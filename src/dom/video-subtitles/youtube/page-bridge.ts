/** Page-world YouTube adapter: observes only timedtext, never proxies arbitrary requests. */
import { LiveSubtitleBuffer } from '@/core/subtitles/live';
import { retryDelay } from '@/core/subtitles/retry';
import { SubtitleTrackCache, TRACK_CACHE_MAX_ENTRIES } from '@/core/subtitles/track-cache';
import { PROJECT_PREFIX } from '@/constants';
import {
  BRIDGE_RESPONSE,
  BRIDGE_VERSION,
  isYoutubeEmbed,
  isYoutubeLive,
  isYoutubeShorts,
  MAX_SUBTITLE_BYTES,
  safeTimedTextUrl,
  validBridgeRequest,
  validVideoId,
  youtubeVideoId,
  type YoutubeBridgeResponse,
  type YoutubeSnapshot,
} from './bridge-protocol';
import { parseYouTubeTimedText } from './parser';
import { youtubePlayer } from './player';
import { chooseHumanTarget } from './target-track';
import { audioCaptionIndex, type AudioTrack } from './track-selection';

type Track = {
  baseUrl?: string;
  url?: string;
  languageCode?: string;
  kind?: string;
  isDefault?: boolean;
  vssId?: string;
  vss_id?: string;
  name?: { simpleText?: string };
  translationLanguage?: { languageCode?: string };
};
type PlayerResponse = {
  videoDetails?: { videoId?: string; title?: string; isLive?: boolean; isLiveContent?: boolean };
  microformat?: { playerMicroformatRenderer?: { liveBroadcastDetails?: { isLiveNow?: boolean } } };
  captions?: {
    playerCaptionsTracklistRenderer?: {
      captionTracks?: Track[];
      audioTracks?: AudioTrack[];
      defaultAudioTrackIndex?: number;
    };
  };
};
type Player = HTMLElement & {
  getPlayerResponse?(): PlayerResponse;
  getAudioTrack?(): (AudioTrack & { captionTracks?: Track[] }) | undefined;
  getOption?: {
    (module: string, option: 'tracklist'): Track[] | undefined;
    (module: string, option: string): Track | undefined;
  };
  isSubtitlesOn?(): boolean;
  toggleSubtitles?(): void;
};

export const YOUTUBE_CAPTURE_TIMEOUT_MS = 8000;
export const YOUTUBE_CAPTURE_CACHE_ENTRIES = TRACK_CACHE_MAX_ENTRIES;
export const YOUTUBE_FETCH_MAX_ATTEMPTS = 3;
export const YOUTUBE_FETCH_RATE_LIMIT_COOLDOWN_MS = 60_000;
export const YOUTUBE_FETCH_MAX_TRACK_BUDGETS = 100;

/** Cancellation and a timed-out read must reject, never return a partial response. */
export async function boundedSubtitleText(response: Response, signal?: AbortSignal): Promise<string> {
  if (Number(response.headers.get('content-length')) > MAX_SUBTITLE_BYTES) throw new Error('oversize');
  if (signal?.aborted) throw new Error('aborted');
  if (!response.body) return '';
  const reader = response.body.getReader();
  let abort: () => void = () => {};
  let timeout: ReturnType<typeof setTimeout> | undefined;
  const cancelled = new Promise<never>((_, reject) => {
    abort = () => reject(new Error('aborted'));
    signal?.addEventListener('abort', abort, { once: true });
    timeout = setTimeout(() => reject(new Error('timeout')), YOUTUBE_CAPTURE_TIMEOUT_MS);
  });
  const read = async () => {
    const decoder = new TextDecoder();
    let bytes = 0;
    let text = '';
    for (;;) {
      const { value, done } = await reader.read();
      if (done) return text + decoder.decode();
      bytes += value.byteLength;
      if (bytes > MAX_SUBTITLE_BYTES) throw new Error('oversize');
      text += decoder.decode(value, { stream: true });
    }
  };
  try {
    return await Promise.race([read(), cancelled]);
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abort);
    void reader.cancel().catch(() => {});
  }
}

function trackKey(url: URL): string {
  return JSON.stringify(['v', 'lang', 'kind', 'name', 'tlang'].map((name) => url.searchParams.get(name) ?? ''));
}

function trackId(track: Track): string {
  return String(
    track.vssId ||
      track.vss_id ||
      JSON.stringify([track.languageCode ?? '', track.kind ?? '', track.name?.simpleText ?? ''])
  ).slice(0, 300);
}

const owners = new WeakMap<Window, () => void>();

export function installYoutubeBridge(win: Window): () => void {
  // Entrypoint reinjection does not stack wrappers or duplicate listeners.
  const existing = owners.get(win);
  if (existing) return existing;
  // Embeds and Shorts can reuse a player while its media identity changes.
  const pageVideoId = (): string | null => {
    if (!isYoutubeEmbed(win.location.href) && !isYoutubeShorts(win.location.href) && !isYoutubeLive(win.location.href))
      return youtubeVideoId(win.location.href);
    try {
      const id = (youtubePlayer(win) as Player | null)?.getPlayerResponse?.().videoDetails?.videoId;
      return validVideoId(id) &&
        (!(isYoutubeShorts(win.location.href) || isYoutubeLive(win.location.href)) ||
          !youtubeVideoId(win.location.href) ||
          id === youtubeVideoId(win.location.href))
        ? id
        : null;
    } catch {
      return null;
    }
  };
  let active = false;
  let disposed = false;
  let suspended = false;
  let epoch = 0;
  let currentVideo = '';
  const makeChannel = () => ({
    selectedTrackId: '',
    cacheKey: '',
    pending: null as { controller: AbortController; key: string } | null,
    lastRequestAt: -Infinity,
  });
  const sourceChannel = makeChannel();
  const targetChannel = makeChannel();
  const cancelChannel = (channel: ReturnType<typeof makeChannel>) => {
    channel.pending?.controller.abort();
    channel.pending = null;
    channel.selectedTrackId = '';
    channel.cacheKey = '';
    channel.lastRequestAt = -Infinity;
  };
  let changedCaptions: { player: Player; videoId: string; track: string; interactionVersion: number } | null = null;
  let captionInteractionVersion = 0;
  let ownCaptionToggle = false;
  let userCaptionVideo = '';
  let captionButton: Element | null = null;
  let captionButtonObserver: MutationObserver | null = null;
  let expectedCaptionState: boolean | null = null;
  let captionControl: {
    player: Player;
    original: NonNullable<Player['toggleSubtitles']>;
    wrapped: NonNullable<Player['toggleSubtitles']>;
  } | null = null;
  const fetchBudgets = new Map<string, { attempts: number; retryAt: number }>();
  let receivedRead = false;
  let selectedAudioId = '';
  let endpointRetryAt = 0;
  let endpointRateLimits = 0;
  const liveRevisions = new Map<string, number>();
  let captureRevision = 0;
  let captureLive: boolean | null = null;
  const liveBuffers = new Map<string, LiveSubtitleBuffer>();
  const cache = new SubtitleTrackCache(
    () => new Set([sourceChannel.cacheKey, targetChannel.cacheKey]),
    (key) => {
      liveRevisions.delete(key);
      liveBuffers.delete(key);
    }
  );
  // Capture signed URLs independently of bodies: failed native requests can still supply fresh tokens.
  const observedUrls = new Map<string, string>();
  const domLanguages = new Map<string, string>();
  const observers = new Set<AbortController>();
  const xhrListeners = new Map<XMLHttpRequest, EventListener>();
  const originalFetch = win.fetch;
  const xhrPrototype = (win as Window & { XMLHttpRequest: typeof XMLHttpRequest }).XMLHttpRequest.prototype;
  const originalOpen = xhrPrototype.open;
  const originalSend = xhrPrototype.send;
  const xhrUrls = new WeakMap<XMLHttpRequest, string>();

  const captionInteraction = () => {
    if (!receivedRead || ownCaptionToggle) return;
    captionInteractionVersion += 1;
    userCaptionVideo = pageVideoId() ?? '';
    changedCaptions = null;
    expectedCaptionState = null;
  };
  const watchCaptionButton = (player: Player) => {
    const button = player.querySelector('.ytp-subtitles-button');
    if (button === captionButton) return;
    captionButtonObserver?.disconnect();
    captionButtonObserver = null;
    captionButton = button;
    expectedCaptionState = null;
    if (!button) return;
    captionButtonObserver = new (win as Window & { MutationObserver: typeof MutationObserver }).MutationObserver(
      (records) => {
        for (let index = 0; index < records.length; index++) {
          // Reconstruct every transition, including off/on within one observer delivery.
          const next = records[index + 1]?.oldValue ?? button.getAttribute('aria-pressed');
          if (next === records[index].oldValue || !['true', 'false'].includes(next ?? '')) continue;
          const enabled = next === 'true';
          if (expectedCaptionState === enabled) expectedCaptionState = null;
          else captionInteraction();
        }
      }
    );
    captionButtonObserver.observe(button, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: ['aria-pressed'],
    });
  };
  const releaseCaptionControl = () => {
    captionButtonObserver?.disconnect();
    captionButtonObserver = null;
    captionButton = null;
    expectedCaptionState = null;
    if (!captionControl) return;
    const { player, original, wrapped } = captionControl;
    try {
      if (player.toggleSubtitles === wrapped) player.toggleSubtitles = original;
    } catch {
      /* Do not interrupt network/listener cleanup if the host froze its API. */
    }
    captionControl = null;
  };
  const watchCaptionControl = (player: Player) => {
    if (captionControl?.player === player && player.toggleSubtitles === captionControl.wrapped) {
      watchCaptionButton(player);
      return;
    }
    releaseCaptionControl();
    watchCaptionButton(player);
    const original = player.toggleSubtitles;
    if (!original) return;
    const wrapped = function (this: Player, ...args: unknown[]) {
      captionInteraction();
      return Reflect.apply(original, this, args);
    };
    try {
      player.toggleSubtitles = wrapped;
      captionControl = { player, original, wrapped };
    } catch {
      /* Some player implementations expose a read-only API. DOM controls still revoke custody. */
    }
  };
  const toggleOwnedCaptions = (player: Player) => {
    const before = player.isSubtitlesOn?.();
    if (captionButton && typeof before === 'boolean') expectedCaptionState = !before;
    ownCaptionToggle = true;
    try {
      player.toggleSubtitles?.();
    } finally {
      ownCaptionToggle = false;
    }
  };
  const onCaptionClick = (event: MouseEvent) => {
    const target = event.target as Element | null;
    if (target?.closest?.('.ytp-subtitles-button') && youtubePlayer(win)?.contains(target)) captionInteraction();
  };
  const onCaptionKey = (event: KeyboardEvent) => {
    if (
      typeof event.key !== 'string' ||
      event.key.toLowerCase() !== 'c' ||
      event.ctrlKey ||
      event.metaKey ||
      event.altKey
    )
      return;
    const editable = event.composedPath().some((node) => {
      const element = node as Element;
      if (element.localName?.startsWith(`${PROJECT_PREFIX}-`)) return true;
      return element.matches?.(
        'input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]'
      );
    });
    if (!editable && youtubePlayer(win)) captionInteraction();
  };
  const isAd = () => {
    const player = youtubePlayer(win);
    return !!player && (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting'));
  };
  const clearVideo = (videoId: string) => {
    if (currentVideo === videoId) return;
    epoch += 1;
    cancelChannel(sourceChannel);
    cancelChannel(targetChannel);
    for (const observer of observers) observer.abort();
    observers.clear();
    for (const [xhr, listener] of xhrListeners) xhr.removeEventListener('loadend', listener);
    xhrListeners.clear();
    cache.clear();
    liveRevisions.clear();
    liveBuffers.clear();
    observedUrls.clear();
    domLanguages.clear();
    fetchBudgets.clear();
    sourceChannel.selectedTrackId = '';
    selectedAudioId = '';
    currentVideo = videoId;
    captureLive = null;
    receivedRead = false;
    changedCaptions = null;
    userCaptionVideo = '';
    releaseCaptionControl();
  };
  const observedUrl = (rawUrl: string): URL | null => {
    // Most host requests are unrelated. Avoid measuring Shorts layout for them.
    try {
      if (new URL(rawUrl).pathname !== '/api/timedtext') return null;
    } catch {
      return null;
    }
    if (!active || disposed || suspended || isAd()) return null;
    const id = pageVideoId();
    const url = id && safeTimedTextUrl(rawUrl, id);
    if (!url) return null;
    const translated = url.searchParams.has('tlang');
    const domLanguage = url.searchParams.get('tlang') || url.searchParams.get('lang') || 'auto';
    url.searchParams.delete('tlang');
    clearVideo(id);
    const key = trackKey(url);
    observedUrls.delete(key);
    observedUrls.set(key, url.href);
    domLanguages.set(key, domLanguage.slice(0, 50));
    while (observedUrls.size > YOUTUBE_CAPTURE_CACHE_ENTRIES) {
      const oldest = observedUrls.keys().next().value!;
      observedUrls.delete(oldest);
      domLanguages.delete(oldest);
    }
    // Preserve the native context, but never treat translated bodies as originals.
    return translated ? null : url;
  };
  const capture = (rawUrl: string, text: string, captureEpoch: number, revision = ++captureRevision): boolean => {
    if (
      !active ||
      disposed ||
      suspended ||
      isAd() ||
      captureEpoch !== epoch ||
      !text ||
      text.length > MAX_SUBTITLE_BYTES
    )
      return false;
    const id = pageVideoId();
    const url = id && id === currentVideo && safeTimedTextUrl(rawUrl, id);
    if (!url || url.searchParams.has('tlang')) return false;
    const key = trackKey(url);
    if ((liveRevisions.get(key) ?? 0) > revision) return false;
    if (cache.peek(key) === text) {
      liveRevisions.set(key, revision);
      return true;
    }
    let bytes = new TextEncoder().encode(text).byteLength;
    if (bytes > MAX_SUBTITLE_BYTES) return false;
    let cueCount: number;
    try {
      const cues = parseYouTubeTimedText(text);
      cueCount = cues.length;
      if (!cues.length) return false;
      if (captureLive) {
        const video = youtubePlayer(win)?.querySelector('video');
        if (!video || video.seeking) return false;
        const buffer = liveBuffers.get(key) ?? new LiveSubtitleBuffer();
        buffer.merge(cues, video.currentTime * 1000, video.seekable.length ? video.seekable.start(0) * 1000 : 0);
        liveBuffers.set(key, buffer);
        cueCount = buffer.cues.length;
        text = JSON.stringify({
          events: buffer.cues.map((cue) => ({
            tStartMs: cue.startMs,
            dDurationMs: cue.endMs - cue.startMs,
            wWinId: cue.id,
            segs: [{ utf8: cue.text }],
          })),
        });
        bytes = new TextEncoder().encode(text).byteLength;
      }
    } catch {
      return false;
    }
    // Body completion must not replace newer native tokens or the DOM language.
    if (cache.set(key, text, bytes, cueCount)) {
      liveRevisions.set(key, revision);
    } else {
      // Admission pressure is not a fetch/parse failure. Direct callers may still
      // display this validated body without retaining an extra raw cache entry.
      cache.discard(key);
      liveRevisions.delete(key);
      liveBuffers.delete(key);
    }
    return true;
  };
  const wrappedFetch: typeof fetch = function (this: Window, ...args) {
    // Preserve the exact original promise, caller receiver, arguments and synchronous exceptions.
    const result = Reflect.apply(originalFetch, this, args) as ReturnType<typeof fetch>;
    try {
      const input = args[0];
      const rawUrl = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      const url = observedUrl(new URL(rawUrl, win.location.href).href);
      if (url && observers.size < YOUTUBE_CAPTURE_CACHE_ENTRIES) {
        const observer = new AbortController();
        const captureEpoch = epoch;
        const revision = ++captureRevision;
        observers.add(observer);
        void result
          .then((response) => {
            if (!active || disposed || observer.signal.aborted || !response.ok) return;
            const finalUrl = response.url || url.href;
            if (!safeTimedTextUrl(finalUrl, currentVideo)) return;
            return boundedSubtitleText(response.clone(), observer.signal).then((text) =>
              capture(finalUrl, text, captureEpoch, revision)
            );
          })
          .catch(() => {})
          .finally(() => observers.delete(observer));
      }
    } catch {
      /* Observation must never change fetch behavior. */
    }
    return result;
  };
  const wrappedOpen: typeof originalOpen = function (
    this: XMLHttpRequest,
    ...args: [method: string, url: string | URL, async?: boolean, username?: string | null, password?: string | null]
  ) {
    const result = Reflect.apply(originalOpen, this, args);
    try {
      const rawUrl = new URL(String(args[1]), win.location.href).href;
      xhrUrls.set(this, rawUrl);
      observedUrl(rawUrl);
    } catch {
      /* Observation must never change open behavior. */
    }
    return result;
  };
  const wrappedSend: typeof originalSend = function (this: XMLHttpRequest, ...args) {
    const rawUrl = xhrUrls.get(this);
    const url = rawUrl && observedUrl(rawUrl);
    const prior = xhrListeners.get(this);
    if (prior) {
      this.removeEventListener('loadend', prior);
      xhrListeners.delete(this);
    }
    if (url && xhrListeners.size < YOUTUBE_CAPTURE_CACHE_ENTRIES) {
      const captureEpoch = epoch;
      const revision = ++captureRevision;
      const listener = () => {
        xhrListeners.delete(this);
        this.removeEventListener('loadend', listener);
        try {
          if (this.status === 200 && (!this.responseType || this.responseType === 'text'))
            capture(this.responseURL || url.href, this.responseText, captureEpoch, revision);
        } catch {
          /* The host may make responseText unavailable. */
        }
      };
      xhrListeners.set(this, listener);
      this.addEventListener('loadend', listener);
    }
    try {
      return Reflect.apply(originalSend, this, args);
    } catch (error) {
      const listener = xhrListeners.get(this);
      if (listener) this.removeEventListener('loadend', listener);
      xhrListeners.delete(this);
      throw error;
    }
  };
  const tryHostChange = (change: () => void) => {
    try {
      change();
    } catch {
      /* A locked host method must not disable other capture channels. */
    }
  };
  const install = () => {
    if (disposed || suspended || active) return;
    active = true;
    tryHostChange(() => {
      win.fetch = wrappedFetch;
    });
    tryHostChange(() => {
      xhrPrototype.open = wrappedOpen;
    });
    tryHostChange(() => {
      xhrPrototype.send = wrappedSend;
    });
  };
  const release = (dropCache = false) => {
    active = false;
    epoch += 1;
    cancelChannel(sourceChannel);
    cancelChannel(targetChannel);
    for (const observer of observers) observer.abort();
    observers.clear();
    for (const [xhr, listener] of xhrListeners) xhr.removeEventListener('loadend', listener);
    xhrListeners.clear();
    // Turning observation off must not discard the native response captured
    // during startup. A later user toggle may only receive empty replay bodies.
    // These bounded, page-local caches are invalidated on video change/disposal.
    if (dropCache) {
      cache.clear();
      liveRevisions.clear();
      liveBuffers.clear();
      observedUrls.clear();
      domLanguages.clear();
    }
    releaseCaptionControl();
    tryHostChange(() => {
      if (win.fetch === wrappedFetch) win.fetch = originalFetch;
    });
    tryHostChange(() => {
      if (xhrPrototype.open === wrappedOpen) xhrPrototype.open = originalOpen;
    });
    tryHostChange(() => {
      if (xhrPrototype.send === wrappedSend) xhrPrototype.send = originalSend;
    });
  };
  const restoreCaptions = () => {
    const owned = changedCaptions;
    changedCaptions = null;
    userCaptionVideo = '';
    if (!owned) return;
    const { player, videoId, track, interactionVersion } = owned;
    try {
      const selected = player.getOption?.('captions', 'track');
      if (
        interactionVersion === captionInteractionVersion &&
        pageVideoId() === videoId &&
        player.isSubtitlesOn?.() &&
        trackId(selected ?? {}) === track
      )
        toggleOwnedCaptions(player);
    } catch {
      /* The player may have been replaced. */
    }
    changedCaptions = null;
  };
  const onMessage = (event: MessageEvent) => {
    if (
      event.source !== win ||
      event.origin !== win.location.origin ||
      !validBridgeRequest(event.data) ||
      disposed ||
      suspended
    )
      return;
    const data = event.data;
    if (data.action === 'identify') {
      if (
        !isYoutubeEmbed(win.location.href) &&
        !isYoutubeShorts(win.location.href) &&
        !isYoutubeLive(win.location.href)
      )
        return;
      const videoId = pageVideoId();
      clearVideo(videoId ?? '');
      if (videoId)
        win.postMessage(
          {
            type: BRIDGE_RESPONSE,
            version: BRIDGE_VERSION,
            requestId: data.requestId,
            snapshot: { videoId, title: '', ad: isAd(), track: null, hasTracks: false },
          },
          win.location.origin
        );
      return;
    }
    if (data.videoId && data.videoId !== pageVideoId()) return;
    const channel = data.targetLanguage ? targetChannel : sourceChannel;
    if (data.action === 'stop' && data.targetLanguage) {
      cancelChannel(targetChannel);
      return;
    }
    if (data.action === 'stop') {
      receivedRead = false;
      sourceChannel.lastRequestAt = -Infinity;
      sourceChannel.pending?.controller.abort();
      sourceChannel.pending = null;
      cancelChannel(targetChannel);
      restoreCaptions();
      releaseCaptionControl();
      // Stop active work, but retain bounded passive capture of native responses.
      return;
    }
    if (Date.now() - channel.lastRequestAt < 200) return;
    channel.lastRequestAt = Date.now();
    const videoId = pageVideoId();
    if (!videoId) return;
    clearVideo(videoId);
    receivedRead = true;
    install();
    const player = youtubePlayer(win) as Player | null;
    if (!player) return;
    let response: PlayerResponse | undefined;
    try {
      response = player.getPlayerResponse?.();
    } catch {
      return;
    }
    if (!response || response.videoDetails?.videoId !== videoId) return;
    if (!data.targetLanguage) watchCaptionControl(player);
    const ad = isAd();
    const tracklist = response.captions?.playerCaptionsTracklistRenderer;
    let rawTracks = tracklist?.captionTracks;
    // In-band live captions may only be advertised by the active caption module.
    if (!rawTracks?.length) {
      try {
        const native = player.getOption?.('captions', 'tracklist');
        if (Array.isArray(native)) rawTracks = native;
      } catch {
        /* Optional player module is not always loaded yet. */
      }
    }
    const live =
      response.videoDetails?.isLive === true ||
      response.microformat?.playerMicroformatRenderer?.liveBroadcastDetails?.isLiveNow === true ||
      player.querySelector('video')?.duration === Infinity;
    let currentAudio: (AudioTrack & { captionTracks?: Track[] }) | undefined;
    try {
      currentAudio = player.getAudioTrack?.();
    } catch {
      /* Optional player API. */
    }
    const audioTracks = Array.isArray(tracklist?.audioTracks) ? tracklist.audioTracks : [];
    const audio =
      (currentAudio?.id
        ? audioTracks.find((item) => (item?.audioTrackId ?? item?.id) === currentAudio.id)
        : undefined) ??
      (currentAudio?.captionTrackIndices ? currentAudio : undefined) ??
      audioTracks[tracklist?.defaultAudioTrackIndex ?? 0];
    const audioId = String(currentAudio?.id ?? audio?.id ?? tracklist?.defaultAudioTrackIndex ?? '');
    const audioChanged = audioId !== selectedAudioId;
    if (!data.targetLanguage) selectedAudioId = audioId;
    if (captureLive !== null && captureLive !== live) {
      cache.clear();
      liveRevisions.clear();
      liveBuffers.clear();
    }
    captureLive = live;
    const tracks = Array.isArray(rawTracks)
      ? rawTracks
          .filter((item) => item && typeof item === 'object')
          .slice(0, 100)
          .map((item) => ({
            ...item,
            vssId: item.vssId ?? item.vss_id,
            // Privacy-enhanced embeds expose same-origin relative timedtext URLs.
            baseUrl:
              typeof item.baseUrl === 'string'
                ? safeTimedTextUrl(item.baseUrl, videoId, win.location.href)?.href
                : undefined,
          }))
      : [];
    const nativeAudioCaptions = Array.isArray(currentAudio?.captionTracks) ? currentAudio.captionTracks : [];
    const nativeDefault = nativeAudioCaptions.find((item) => item?.isDefault) ?? nativeAudioCaptions[0];
    const nativeDefaultTrack = nativeDefault?.vssId
      ? tracks.find((item) => item.vssId === nativeDefault.vssId)
      : undefined;
    let selected: Track | undefined;
    try {
      if (
        !data.targetLanguage &&
        data.enableCaptions &&
        userCaptionVideo !== videoId &&
        !ad &&
        tracks.length &&
        player.isSubtitlesOn?.() === false &&
        player.toggleSubtitles
      ) {
        toggleOwnedCaptions(player);
        changedCaptions = {
          player,
          videoId,
          track: trackId(player.getOption?.('captions', 'track') ?? {}),
          interactionVersion: captionInteractionVersion,
        };
      }
      selected = player.getOption?.('captions', 'track');
    } catch {
      /* Default track remains usable. */
    }
    const sourceTrack =
      tracks.find(
        (item) => (selected?.vssId || selected?.vss_id) && item.vssId === (selected.vssId || selected.vss_id)
      ) ??
      tracks.find(
        (item) =>
          selected?.languageCode &&
          item.languageCode === selected.languageCode &&
          (item.kind ?? '') === (selected.kind ?? '')
      ) ??
      // Player errors and transient module reloads can temporarily clear the
      // selection. Keep the confirmed source until an explicit choice returns.
      (!audioChanged && !selected?.vssId && !selected?.vss_id && !selected?.languageCode
        ? tracks.find((item) => trackId(item) === sourceChannel.selectedTrackId)
        : undefined) ??
      nativeDefaultTrack ??
      tracks[audioCaptionIndex(audio, tracks.length) ?? -1] ??
      tracks[0];
    const track = data.targetLanguage ? chooseHumanTarget(tracks, data.targetLanguage) : sourceTrack;
    const sourceUrl = track?.baseUrl && safeTimedTextUrl(track.baseUrl, videoId);
    if (sourceUrl) sourceUrl.searchParams.delete('tlang');
    channel.cacheKey = sourceUrl ? trackKey(sourceUrl) : '';
    const observedLanguage = sourceUrl ? domLanguages.get(trackKey(sourceUrl)) : undefined;
    const domLanguage =
      selected?.translationLanguage?.languageCode ||
      observedLanguage ||
      selected?.languageCode ||
      track?.languageCode ||
      'auto';
    const snapshot: YoutubeSnapshot = {
      live,
      domLanguage: String(domLanguage).slice(0, 50),
      videoId,
      title: typeof response.videoDetails?.title === 'string' ? response.videoDetails.title.slice(0, 1000) : '',
      ad,
      hasTracks: tracks.length > 0,
      track: track
        ? {
            id: trackId(track),
            language: String(track.languageCode ?? 'auto').slice(0, 50),
            kind: track.kind === 'asr' ? 'auto' : 'manual',
          }
        : null,
    };
    const nextTrackId = snapshot.track?.id ?? '';
    if (channel.selectedTrackId !== nextTrackId || ad || live) {
      channel.pending?.controller.abort();
      channel.pending = null;
    }
    channel.selectedTrackId = nextTrackId;
    const requestEpoch = epoch;
    const requestStarted = Date.now();
    const post = (extra: Partial<YoutubeBridgeResponse> = {}) => {
      if (
        disposed ||
        !active ||
        suspended ||
        requestEpoch !== epoch ||
        pageVideoId() !== videoId ||
        channel.selectedTrackId !== nextTrackId
      )
        return;
      if (!ad && isAd()) return;
      win.postMessage(
        {
          type: BRIDGE_RESPONSE,
          version: BRIDGE_VERSION,
          requestId: data.requestId,
          snapshot,
          cacheUsage: cache.snapshot(),
          acquisition: 'fetch',
          durationMs: Math.max(0, Math.min(300_000, Date.now() - requestStarted)),
          ...extra,
        },
        win.location.origin
      );
    };
    if (ad || !track) {
      post();
      return;
    }
    if (live) {
      // Live captions are native incremental packets, never a finite-track fetch.
      const url = typeof track.baseUrl === 'string' && safeTimedTextUrl(track.baseUrl, videoId);
      const key = url && trackKey(url);
      const text = key && cache.get(key);
      const liveRevision = key && liveRevisions.get(key);
      post(text && liveRevision ? { text, liveRevision, acquisition: 'live' } : {});
      return;
    }
    if (data.knownTrackId === nextTrackId) {
      post();
      return;
    }
    let url = typeof track.baseUrl === 'string' && safeTimedTextUrl(track.baseUrl, videoId);
    if (!url) {
      post({ error: 'unavailable' });
      return;
    }
    url.searchParams.delete('tlang');
    const key = trackKey(url);
    const cached = cache.get(key);
    if (cached) {
      post({ text: cached, acquisition: 'cache' });
      return;
    }
    const tokenRawUrl = observedUrls.get(key);
    const tokenUrl = tokenRawUrl && safeTimedTextUrl(tokenRawUrl, videoId);
    // Keep the native signature, token and client context together; copying only
    // the token onto the player response URL can create an invalid combination.
    const nativeRawUrl = nativeAudioCaptions.find((item) => trackId(item) === trackId(track))?.url;
    const nativeUrl = nativeRawUrl && safeTimedTextUrl(nativeRawUrl, videoId, win.location.href);
    if (tokenUrl) url = tokenUrl;
    else if (nativeUrl && trackKey(nativeUrl) === key) url = nativeUrl;
    // Native track URLs omit the web player's transport parameters. Preserve any
    // observed client context, and fill only missing request-format defaults.
    for (const [name, value] of Object.entries({ xorb: '2', xobt: '3', xovt: '3', c: 'WEB', cplayer: 'UNIPLAYER' })) {
      if (!url.searchParams.has(name)) url.searchParams.set(name, value);
    }
    url.searchParams.set('fmt', 'json3');
    let budget = fetchBudgets.get(key);
    if (!budget) {
      if (fetchBudgets.size >= YOUTUBE_FETCH_MAX_TRACK_BUDGETS) {
        post({ error: 'unavailable' });
        return;
      }
      budget = { attempts: 0, retryAt: 0 };
      fetchBudgets.set(key, budget);
    }
    if (data.resetRetry) {
      budget.attempts = 0;
      budget.retryAt = 0;
    }
    if (Date.now() < endpointRetryAt) {
      post({ error: 'rateLimit', retryDelayMs: endpointRetryAt - Date.now() });
      return;
    }
    if (channel.pending?.key === key) {
      post();
      return;
    }
    if (budget.attempts >= YOUTUBE_FETCH_MAX_ATTEMPTS || Date.now() < budget.retryAt) {
      post({ error: 'fetch' });
      return;
    }
    post();
    budget.attempts += 1;
    channel.pending?.controller.abort();
    const controller = new AbortController();
    channel.pending = { controller, key };
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, YOUTUBE_CAPTURE_TIMEOUT_MS);
    void Promise.resolve()
      .then(() => originalFetch.call(win, url.href, { credentials: 'include', signal: controller.signal }))
      .then(async (res) => {
        if (channel.pending?.controller !== controller || controller.signal.aborted || requestEpoch !== epoch) return;
        if (!res.ok) {
          if (res.status === 429) {
            endpointRateLimits += 1;
            const backoff = Math.min(
              300_000,
              YOUTUBE_FETCH_RATE_LIMIT_COOLDOWN_MS * 2 ** Math.min(3, endpointRateLimits - 1)
            );
            const header = res.headers.get('retry-after')?.trim() ?? '';
            const requested = /^\d+(?:\.\d+)?$/.test(header) ? Number(header) * 1000 : Date.parse(header) - Date.now();
            const delay = retryDelay(backoff, 300_000, Number.isFinite(requested) ? Math.max(0, requested) : 0);
            endpointRetryAt = Date.now() + delay;
            // A temporary endpoint refusal must not permanently exhaust this track.
            budget.attempts = 0;
            budget.retryAt = endpointRetryAt;
          } else budget.retryAt = Date.now() + retryDelay(10_000, 30_000);
          post({
            error: res.status === 429 ? 'rateLimit' : 'fetch',
            retryDelayMs: Math.max(0, budget.retryAt - Date.now()),
          });
          return;
        }
        if (res.url) {
          const finalUrl = safeTimedTextUrl(res.url, videoId);
          if (!finalUrl || trackKey(finalUrl) !== key) throw new Error('redirect');
        }
        const text = await boundedSubtitleText(res, controller.signal);
        if (!text) throw new Error('empty');
        if (controller.signal.aborted || requestEpoch !== epoch || pageVideoId() !== videoId) return;
        if (!capture(url.href, text, requestEpoch)) throw new Error('invalid-subtitles');
        // Count consecutive acquisition failures, not successful cache refetches.
        budget.attempts = 0;
        budget.retryAt = 0;
        if (Date.now() >= endpointRetryAt) {
          endpointRetryAt = 0;
          endpointRateLimits = 0;
        }
        post({ text });
      })
      .catch(() => {
        if (channel.pending?.controller !== controller || requestEpoch !== epoch) return;
        if (!controller.signal.aborted || timedOut) {
          budget.retryAt = Date.now() + retryDelay(10_000, 30_000);
          post({ error: 'fetch' });
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (channel.pending?.controller === controller) channel.pending = null;
      });
  };
  const onMediaReset = (event: Event) => {
    if (!captureLive || event.target !== youtubePlayer(win)?.querySelector('video')) return;
    epoch += 1;
    cache.clear();
    liveBuffers.clear();
    liveRevisions.clear();
    cancelChannel(sourceChannel);
    cancelChannel(targetChannel);
    for (const observer of observers) observer.abort();
    observers.clear();
    for (const [xhr, listener] of xhrListeners) xhr.removeEventListener('loadend', listener);
    xhrListeners.clear();
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    release(true);
    restoreCaptions();
    win.removeEventListener('message', onMessage);
    win.document.removeEventListener('emptied', onMediaReset, true);
    win.document.removeEventListener('loadedmetadata', onMediaReset, true);
    win.document.removeEventListener('click', onCaptionClick, true);
    win.document.removeEventListener('keydown', onCaptionKey, true);
    win.removeEventListener('pagehide', onHide);
    win.removeEventListener('pageshow', onShow);
    win.document.removeEventListener('yt-navigate-start', onNavigateStart);
    win.document.removeEventListener('yt-navigate-finish', onNavigateFinish);
    owners.delete(win);
  };
  const onHide = (event: PageTransitionEvent) => {
    if (!event.persisted) {
      dispose();
      return;
    }
    suspended = true;
    release();
    restoreCaptions();
  };
  const onShow = () => {
    if (!suspended || disposed) return;
    suspended = false;
    sourceChannel.lastRequestAt = -Infinity;
    // Re-arm passive observation; only a read request can start active work.
    install();
  };
  const onNavigateStart = () => {
    if (disposed || suspended) return;
    receivedRead = false;
    sourceChannel.lastRequestAt = -Infinity;
    clearVideo('');
    install();
  };
  const onNavigateFinish = () => {
    if (disposed || suspended) return;
    clearVideo(pageVideoId() ?? '');
    install();
  };
  owners.set(win, dispose);
  install();
  win.document.addEventListener('yt-navigate-start', onNavigateStart);
  win.document.addEventListener('yt-navigate-finish', onNavigateFinish);
  win.addEventListener('message', onMessage);
  win.document.addEventListener('emptied', onMediaReset, true);
  win.document.addEventListener('loadedmetadata', onMediaReset, true);
  win.document.addEventListener('click', onCaptionClick, true);
  win.document.addEventListener('keydown', onCaptionKey, true);
  win.addEventListener('pagehide', onHide);
  win.addEventListener('pageshow', onShow);
  return dispose;
}
