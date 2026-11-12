/** Page-world YouTube adapter: observes only timedtext, never proxies arbitrary requests. */
import { PROJECT_PREFIX } from '@/constants';
import {
  BRIDGE_RESPONSE,
  BRIDGE_VERSION,
  MAX_SUBTITLE_BYTES,
  safeTimedTextUrl,
  validBridgeRequest,
  youtubeVideoId,
  type YoutubeBridgeResponse,
  type YoutubeSnapshot,
} from './bridge-protocol';

type Track = {
  baseUrl?: string;
  languageCode?: string;
  kind?: string;
  vssId?: string;
  vss_id?: string;
  name?: { simpleText?: string };
};
type PlayerResponse = {
  videoDetails?: { videoId?: string; title?: string };
  captions?: { playerCaptionsTracklistRenderer?: { captionTracks?: Track[] } };
};
type Player = HTMLElement & {
  getPlayerResponse?(): PlayerResponse;
  getOption?(module: string, option: string): Track | undefined;
  isSubtitlesOn?(): boolean;
  toggleSubtitles?(): void;
};

export const YOUTUBE_CAPTURE_TIMEOUT_MS = 8000;
export const YOUTUBE_CAPTURE_CACHE_ENTRIES = 3;
export const YOUTUBE_CAPTURE_STARTUP_MS = 5000;
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
  let active = false;
  let disposed = false;
  let suspended = false;
  let epoch = 0;
  let currentVideo = '';
  let selectedTrackId = '';
  let pending: { controller: AbortController; key: string } | null = null;
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
  let lastRequestAt = -Infinity;
  const fetchBudgets = new Map<string, { attempts: number; retryAt: number; rateLimitUntil: number }>();
  let receivedRead = false;
  const cache = new Map<string, string>();
  // Capture signed URLs independently of bodies: failed native requests can still supply fresh tokens.
  const observedUrls = new Map<string, string>();
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
    userCaptionVideo = youtubeVideoId(win.location.href) ?? '';
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
    if (target?.closest?.('#movie_player .ytp-subtitles-button')) captionInteraction();
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
    if (!editable && win.document.querySelector('#movie_player')) captionInteraction();
  };
  const isAd = () => {
    const player = win.document.querySelector('#movie_player');
    return !!player && (player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting'));
  };
  const clearVideo = (videoId: string) => {
    if (currentVideo === videoId) return;
    epoch += 1;
    pending?.controller.abort();
    pending = null;
    for (const observer of observers) observer.abort();
    observers.clear();
    cache.clear();
    observedUrls.clear();
    fetchBudgets.clear();
    selectedTrackId = '';
    currentVideo = videoId;
    changedCaptions = null;
    userCaptionVideo = '';
    releaseCaptionControl();
  };
  const observedUrl = (rawUrl: string): URL | null => {
    if (!active || disposed || suspended || isAd()) return null;
    const id = youtubeVideoId(win.location.href);
    const url = id && safeTimedTextUrl(rawUrl, id);
    if (!url || url.searchParams.has('tlang')) return null;
    clearVideo(id);
    const key = trackKey(url);
    observedUrls.delete(key);
    observedUrls.set(key, url.href);
    while (observedUrls.size > YOUTUBE_CAPTURE_CACHE_ENTRIES) observedUrls.delete(observedUrls.keys().next().value!);
    return url;
  };
  const capture = (rawUrl: string, text: string, captureEpoch: number) => {
    if (captureEpoch !== epoch || !text || text.length > MAX_SUBTITLE_BYTES) return;
    if (new TextEncoder().encode(text).byteLength > MAX_SUBTITLE_BYTES) return;
    const url = observedUrl(rawUrl);
    if (!url) return;
    const key = trackKey(url);
    cache.delete(key);
    cache.set(key, text);
    while (cache.size > YOUTUBE_CAPTURE_CACHE_ENTRIES) cache.delete(cache.keys().next().value!);
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
        observers.add(observer);
        void result
          .then((response) => {
            if (!active || disposed || observer.signal.aborted || !response.ok) return;
            const finalUrl = response.url || url.href;
            if (!safeTimedTextUrl(finalUrl, currentVideo)) return;
            return boundedSubtitleText(response.clone(), observer.signal).then((text) =>
              capture(finalUrl, text, captureEpoch)
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
      const listener = () => {
        xhrListeners.delete(this);
        this.removeEventListener('loadend', listener);
        try {
          if (this.status === 200 && (!this.responseType || this.responseType === 'text'))
            capture(this.responseURL || url.href, this.responseText, captureEpoch);
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
  const install = () => {
    if (disposed || suspended || active) return;
    active = true;
    win.fetch = wrappedFetch;
    xhrPrototype.open = wrappedOpen;
    xhrPrototype.send = wrappedSend;
  };
  const release = (dropCache = false) => {
    active = false;
    epoch += 1;
    pending?.controller.abort();
    pending = null;
    for (const observer of observers) observer.abort();
    observers.clear();
    for (const [xhr, listener] of xhrListeners) xhr.removeEventListener('loadend', listener);
    xhrListeners.clear();
    // Turning observation off must not discard the native response captured
    // during startup. A later user toggle may only receive empty replay bodies.
    // These bounded, page-local caches are invalidated on video change/disposal.
    if (dropCache) {
      cache.clear();
      observedUrls.clear();
    }
    releaseCaptionControl();
    if (win.fetch === wrappedFetch) win.fetch = originalFetch;
    if (xhrPrototype.open === wrappedOpen) xhrPrototype.open = originalOpen;
    if (xhrPrototype.send === wrappedSend) xhrPrototype.send = originalSend;
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
        youtubeVideoId(win.location.href) === videoId &&
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
    if (data.action === 'stop') {
      receivedRead = false;
      lastRequestAt = -Infinity;
      release();
      restoreCaptions();
      return;
    }
    if (Date.now() - lastRequestAt < 200) return;
    lastRequestAt = Date.now();
    receivedRead = true;
    const videoId = youtubeVideoId(win.location.href);
    if (!videoId) return;
    clearVideo(videoId);
    install();
    const player = win.document.querySelector<Player>('#movie_player');
    if (!player) return;
    let response: PlayerResponse | undefined;
    try {
      response = player.getPlayerResponse?.();
    } catch {
      return;
    }
    if (!response || response.videoDetails?.videoId !== videoId) return;
    watchCaptionControl(player);
    const ad = isAd();
    const rawTracks = response.captions?.playerCaptionsTracklistRenderer?.captionTracks;
    const tracks = Array.isArray(rawTracks)
      ? rawTracks.filter((item) => item && typeof item === 'object').slice(0, 100)
      : [];
    let selected: Track | undefined;
    try {
      if (
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
    const track =
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
      (!selected?.vssId && !selected?.vss_id && !selected?.languageCode
        ? tracks.find((item) => trackId(item) === selectedTrackId)
        : undefined) ??
      tracks[0];
    const snapshot: YoutubeSnapshot = {
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
    if (selectedTrackId !== nextTrackId || ad) {
      pending?.controller.abort();
      pending = null;
    }
    selectedTrackId = nextTrackId;
    const requestEpoch = epoch;
    const post = (extra: Partial<YoutubeBridgeResponse> = {}) => {
      if (
        disposed ||
        !active ||
        suspended ||
        requestEpoch !== epoch ||
        youtubeVideoId(win.location.href) !== videoId ||
        selectedTrackId !== nextTrackId
      )
        return;
      if (!ad && isAd()) return;
      win.postMessage(
        { type: BRIDGE_RESPONSE, version: BRIDGE_VERSION, requestId: data.requestId, snapshot, ...extra },
        win.location.origin
      );
    };
    if (ad || !track) {
      post();
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
      post({ text: cached });
      return;
    }
    const tokenRawUrl = observedUrls.get(key);
    const tokenUrl = tokenRawUrl && safeTimedTextUrl(tokenRawUrl, videoId);
    // Keep the native signature, token and client context together; copying only
    // the token onto the player response URL can create an invalid combination.
    if (tokenUrl) url = tokenUrl;
    url.searchParams.set('fmt', 'json3');
    let budget = fetchBudgets.get(key);
    if (!budget) {
      if (fetchBudgets.size >= YOUTUBE_FETCH_MAX_TRACK_BUDGETS) {
        post({ error: 'unavailable' });
        return;
      }
      budget = { attempts: 0, retryAt: 0, rateLimitUntil: 0 };
      fetchBudgets.set(key, budget);
    }
    if (data.resetRetry) {
      budget.attempts = 0;
      budget.retryAt = 0;
    }
    if (Date.now() < budget.rateLimitUntil) {
      post({ error: 'rateLimit' });
      return;
    }
    if (pending?.key === key) {
      post();
      return;
    }
    if (budget.attempts >= YOUTUBE_FETCH_MAX_ATTEMPTS || Date.now() < budget.retryAt) {
      post({ error: 'fetch' });
      return;
    }
    post();
    budget.attempts += 1;
    pending?.controller.abort();
    const controller = new AbortController();
    pending = { controller, key };
    let timedOut = false;
    const timeout = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, YOUTUBE_CAPTURE_TIMEOUT_MS);
    void Promise.resolve()
      .then(() => originalFetch.call(win, url.href, { credentials: 'include', signal: controller.signal }))
      .then(async (res) => {
        if (pending?.controller !== controller || controller.signal.aborted || requestEpoch !== epoch) return;
        if (!res.ok) {
          budget.retryAt = Date.now() + (res.status === 429 ? YOUTUBE_FETCH_RATE_LIMIT_COOLDOWN_MS : 10_000);
          if (res.status === 429) budget.rateLimitUntil = Math.max(budget.rateLimitUntil, budget.retryAt);
          post({ error: res.status === 429 ? 'rateLimit' : 'fetch' });
          return;
        }
        if (res.url && !safeTimedTextUrl(res.url, videoId)) throw new Error('redirect');
        const text = await boundedSubtitleText(res, controller.signal);
        if (!text) throw new Error('empty');
        if (controller.signal.aborted || requestEpoch !== epoch || youtubeVideoId(win.location.href) !== videoId)
          return;
        capture(url.href, text, requestEpoch);
        post({ text });
      })
      .catch(() => {
        if (pending?.controller !== controller || requestEpoch !== epoch) return;
        if (!controller.signal.aborted || timedOut) {
          budget.retryAt = Date.now() + 10_000;
          post({ error: 'fetch' });
        }
      })
      .finally(() => {
        clearTimeout(timeout);
        if (pending?.controller === controller) pending = null;
      });
  };
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    clearTimeout(startup);
    release(true);
    restoreCaptions();
    win.removeEventListener('message', onMessage);
    win.document.removeEventListener('click', onCaptionClick, true);
    win.document.removeEventListener('keydown', onCaptionKey, true);
    win.removeEventListener('pagehide', onHide);
    win.removeEventListener('pageshow', onShow);
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
    lastRequestAt = -Infinity;
    // Remain inert until the resumed content runtime confirms it is enabled.
  };
  owners.set(win, dispose);
  install();
  const startup = setTimeout(() => {
    if (!receivedRead) release();
  }, YOUTUBE_CAPTURE_STARTUP_MS);
  win.addEventListener('message', onMessage);
  win.document.addEventListener('click', onCaptionClick, true);
  win.document.addEventListener('keydown', onCaptionKey, true);
  win.addEventListener('pagehide', onHide);
  win.addEventListener('pageshow', onShow);
  return dispose;
}
