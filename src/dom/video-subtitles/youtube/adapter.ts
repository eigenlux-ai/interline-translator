import { subtitleFingerprint, type PlaybackState } from '@/core/subtitles';
import { PROJECT_PREFIX } from '@/constants';
import type { VideoPlatformAdapter, VideoSubtitleSourceEvent } from '../platform';
import {
  BRIDGE_REQUEST,
  isYoutubeEmbed,
  isYoutubeShorts,
  validBridgeResponse,
  youtubeVideoId,
} from './bridge-protocol';
import { parseYouTubeTimedText } from './parser';
import { youtubePlayer } from './player';
import { captionLanguage } from './target-track';

/** YouTube DOM, native-caption custody and page protocol stay behind the platform boundary. */
export function createYoutubeAdapter(
  win: Window,
  currentVideoId = () => youtubeVideoId(win.location.href)
): VideoPlatformAdapter | null {
  const videoId = currentVideoId();
  const player = youtubePlayer(win);
  const video = player?.querySelector<HTMLVideoElement>('video');
  if (!videoId || !player || !video) return null;
  // Modern embeds put their touch-control overlay beside #movie_player in body.
  // Stay above that sibling stacking context and inside element fullscreen.
  const resolveMount = () => {
    if (isYoutubeShorts(win.location.href)) {
      const fullscreen = win.document.fullscreenElement;
      const container = player.closest<HTMLElement>('#player-container') ?? player;
      // Shorts fullscreen can target <html>; retain the video's own bounds.
      return fullscreen?.contains(player) && !fullscreen.contains(container)
        ? (fullscreen as HTMLElement)
        : container;
    }
    if (!isYoutubeEmbed(win.location.href)) return player;
    const fullscreen = win.document.fullscreenElement;
    return fullscreen && fullscreen.nodeType === 1 && fullscreen.contains(player)
      ? (fullscreen as HTMLElement)
      : win.document.body;
  };
  const mount = resolveMount();
  let active = false,
    disposed = false,
    startedAt = 0,
    trackId = '',
    rawTrack = '',
    domLanguage: string | undefined;
  let awaitingSeekCaption = false;
  let wasSeeking = false;
  let freshDuringSeek = false;
  let live = false;
  let observer: MutationObserver | null = null,
    captionContainer: Element | null = null;
  let hiddenStyle: HTMLStyleElement | null = null;
  const custodyAttribute = `data-${PROJECT_PREFIX}-subtitle-custody`;
  const custodyId = win.crypto.randomUUID();
  let frameId: number | null = null;
  let lastReadAt = -Infinity;
  let retryTimer: number | null = null;
  let observation = 0,
    lastText: string | null = null;
  const sourceListeners = new Set<(event: VideoSubtitleSourceEvent) => void>();
  const playbackListeners = new Set<(state: PlaybackState) => void>();
  const frameListeners = new Set<() => void>();
  const requests = new Map<string, number>();
  const targetRequests = new Map<string, number>();
  let targetLanguage = '',
    targetTrackId = '',
    rawTarget = '';
  let lastTargetReadAt = -Infinity;
  const clearTarget = () => {
    targetTrackId = '';
    rawTarget = '';
    targetRequests.clear();
    emit({ type: 'targetTrack', track: null, language: targetLanguage, pending: !!targetLanguage && !live });
  };
  const readTarget = (resetRetry = false) => {
    if (!active || !targetLanguage || live || Date.now() - lastTargetReadAt < 200) return;
    lastTargetReadAt = Date.now();
    const requestId = win.crypto.randomUUID();
    targetRequests.set(requestId, Date.now());
    for (const [id, time] of targetRequests) if (Date.now() - time > 15_000) targetRequests.delete(id);
    win.postMessage(
      {
        type: BRIDGE_REQUEST,
        version: 1,
        requestId,
        videoId,
        action: 'read',
        enableCaptions: false,
        targetLanguage,
        knownTrackId: rawTarget ? targetTrackId : '',
        resetRetry,
      },
      win.location.origin
    );
  };
  const adPlaying = () => player.classList.contains('ad-showing') || player.classList.contains('ad-interrupting');
  const snapshot = (): PlaybackState => ({
    timeMs: video.currentTime * 1000,
    paused: video.paused,
    playbackRate: video.playbackRate,
    seeking: video.seeking,
    adPlaying: adPlaying(),
  });
  const emit = (event: VideoSubtitleSourceEvent) => {
    if (active) sourceListeners.forEach((listener) => listener(event));
  };
  const bridge = (action: 'read' | 'stop', resetRetry = false) => {
    if (action === 'read') {
      const elapsed = Date.now() - lastReadAt;
      if (resetRetry && elapsed < 200) {
        if (retryTimer === null)
          retryTimer = win.setTimeout(() => {
            retryTimer = null;
            if (active) bridge('read', true);
          }, 200 - elapsed);
        return;
      }
      if (!resetRetry && (retryTimer !== null || elapsed < 200)) return;
      lastReadAt = Date.now();
    } else {
      if (retryTimer !== null) win.clearTimeout(retryTimer);
      retryTimer = null;
      lastReadAt = -Infinity;
    }
    const requestId = win.crypto.randomUUID();
    if (action === 'read') requests.set(requestId, Date.now());
    for (const [id, time] of requests) if (Date.now() - time > 15_000) requests.delete(id);
    win.postMessage(
      {
        type: BRIDGE_REQUEST,
        version: 1,
        requestId,
        videoId,
        action,
        enableCaptions: true,
        knownTrackId: rawTrack ? trackId : '',
        resetRetry: resetRetry || undefined,
      },
      win.location.origin
    );
    if (action === 'read') readTarget(resetRetry);
  };
  const readDom = () => {
    if (!active || awaitingSeekCaption || rawTrack || Date.now() - startedAt < 2500 || video.seeking || adPlaying())
      return;
    const text = Array.from(captionContainer?.querySelectorAll('.ytp-caption-segment') ?? [])
      .map((el) => el.textContent ?? '')
      .join(' ');
    if (text === lastText) return;
    lastText = text;
    observation += 1;
    emit({ type: 'currentText', snapshot: { text, observation, contentVersion: observation, sessionVersion: 0 } });
  };
  const bindCaptions = () => {
    const next = player.querySelector('.ytp-caption-window-container');
    if (next === captionContainer) return;
    observer?.disconnect();
    captionContainer = next;
    if (next && !video.seeking) awaitingSeekCaption = false;
    if (next) {
      observer = new MutationObserver(() => {
        // Polling cannot establish freshness after a seek; a new DOM observation can.
        if (video.seeking) freshDuringSeek = true;
        else awaitingSeekCaption = false;
        readDom();
      });
      observer.observe(next, { subtree: true, childList: true, characterData: true });
    }
  };
  const cancelFrames = () => {
    if (frameId !== null) video.cancelVideoFrameCallback?.(frameId);
    frameId = null;
  };
  const frame = () => {
    frameId = null;
    if (!active || win.document.visibilityState === 'hidden' || !frameListeners.size) return;
    frameListeners.forEach((listener) => listener());
    frameId = video.requestVideoFrameCallback?.(frame) ?? null;
  };
  const startFrames = () => {
    if (active && frameId === null && win.document.visibilityState !== 'hidden' && frameListeners.size)
      frameId = video.requestVideoFrameCallback?.(frame) ?? null;
  };
  const playbackChanged = () => {
    if (!active) return;
    const state = snapshot();
    if (state.seeking || state.adPlaying) {
      lastText = null;
      if (!wasSeeking) {
        observer?.takeRecords();
        freshDuringSeek = false;
      }
      awaitingSeekCaption = true;
    }
    if (wasSeeking && !state.seeking && freshDuringSeek) awaitingSeekCaption = false;
    wasSeeking = !!state.seeking;
    playbackListeners.forEach((listener) => listener(state));
    readDom();
    startFrames();
  };
  const visibilityChanged = () => {
    if (win.document.visibilityState === 'hidden') cancelFrames();
    else {
      playbackChanged();
      startFrames();
    }
  };
  const restoreNative = () => {
    hiddenStyle?.remove();
    hiddenStyle = null;
    if (player.getAttribute(custodyAttribute) === custodyId) player.removeAttribute(custodyAttribute);
  };
  const onMessage = (message: MessageEvent) => {
    if (
      message.source !== win ||
      message.origin !== win.location.origin ||
      !active ||
      !validBridgeResponse(message.data)
    )
      return;
    const data = message.data;
    if (targetRequests.has(data.requestId)) {
      if (
        !targetLanguage ||
        data.snapshot.videoId !== videoId ||
        currentVideoId() !== videoId ||
        data.snapshot.ad ||
        adPlaying()
      )
        return;
      const target = data.snapshot.track;
      if (
        data.snapshot.live ||
        !target ||
        target.kind !== 'manual' ||
        captionLanguage(target.language) !== captionLanguage(targetLanguage)
      ) {
        clearTarget();
        emit({ type: 'targetTrack', track: null, language: targetLanguage });
        return;
      }
      if (targetTrackId !== target.id) {
        rawTarget = '';
        targetTrackId = target.id;
        emit({ type: 'targetTrack', track: null, language: targetLanguage, pending: !data.error });
      }
      if (data.error) emit({ type: 'targetTrack', track: null, language: targetLanguage });
      if (data.text && data.text !== rawTarget) {
        try {
          const cues = parseYouTubeTimedText(data.text);
          if (!cues.length) return;
          rawTarget = data.text;
          emit({
            type: 'targetTrack',
            language: targetLanguage,
            track: { videoId, ...target, contentVersion: subtitleFingerprint(`${targetTrackId}:${rawTarget}`), cues },
          });
        } catch {
          /* Invalid target data falls back to the existing translation path. */
        }
      }
      return;
    }

    if (!requests.has(data.requestId) || data.snapshot.videoId !== videoId || currentVideoId() !== videoId) return;
    if (data.snapshot.ad || adPlaying()) {
      playbackChanged();
      return;
    }
    if (domLanguage !== data.snapshot.domLanguage) {
      domLanguage = data.snapshot.domLanguage;
      lastText = null;
    }
    if (live !== !!data.snapshot.live) {
      live = !!data.snapshot.live;
      clearTarget();
      rawTrack = '';
      lastText = null;
    }
    const nextTrackId = data.snapshot.track?.id ?? '';
    if (trackId !== nextTrackId) {
      trackId = nextTrackId;
      rawTrack = '';
      lastText = null;
    }
    emit({
      type: 'metadata',
      value: {
        videoId,
        title: data.snapshot.title,
        language: data.snapshot.track?.language ?? 'auto',
        domLanguage: data.snapshot.domLanguage,
        live,
        trackId,
        hasTracks: data.snapshot.hasTracks,
      },
    });
    if (!live && data.text && data.text !== rawTrack && data.snapshot.track) {
      try {
        const cues = parseYouTubeTimedText(data.text);
        if (!cues.length) throw new Error('empty');
        // The runtime receives current media state before it adopts the recovered track.
        playbackListeners.forEach((listener) => listener(snapshot()));
        rawTrack = data.text;
        emit({
          type: 'track',
          sessionVersion: 0,
          track: {
            videoId,
            ...data.snapshot.track,
            contentVersion: subtitleFingerprint(`${trackId}:${data.text}`),
            cues,
          },
        });
      } catch {
        emit({ type: 'unavailable', reason: 'fetch-failed', retryable: true });
      }
    } else if (!rawTrack && (!data.snapshot.hasTracks || data.error))
      emit({
        type: 'unavailable',
        reason: !data.snapshot.hasTracks ? 'no-captions' : data.error === 'rateLimit' ? 'rate-limited' : 'fetch-failed',
        retryable: !!data.snapshot.hasTracks,
      });
    readDom();
  };
  const events = ['timeupdate', 'seeking', 'seeked', 'ratechange', 'play', 'pause', 'loadedmetadata'];
  const stop = () => {
    if (!active) return;
    active = false;
    bridge('stop');
    requests.clear();
    targetRequests.clear();
    rawTarget = '';
    targetTrackId = '';
    lastTargetReadAt = -Infinity;
    observer?.disconnect();
    observer = null;
    captionContainer = null;
    cancelFrames();
    restoreNative();
    rawTrack = '';
    trackId = '';
    domLanguage = undefined;
    awaitingSeekCaption = false;
    wasSeeking = false;
    freshDuringSeek = false;
    live = false;
    lastText = null;
  };
  const dispose = () => {
    if (disposed) return;
    stop();
    disposed = true;
    events.forEach((name) => video.removeEventListener(name, playbackChanged));
    win.document.removeEventListener('visibilitychange', visibilityChanged);
    win.removeEventListener('message', onMessage);
    sourceListeners.clear();
    playbackListeners.clear();
    frameListeners.clear();
  };
  events.forEach((name) => video.addEventListener(name, playbackChanged));
  win.document.addEventListener('visibilitychange', visibilityChanged);
  win.addEventListener('message', onMessage);
  return {
    id: 'youtube',
    capabilities: { timeline: true, currentText: true, trackSelection: false, adDetection: true, fullscreen: true },
    videoId: () => videoId,
    mount: () => mount,
    matches: () =>
      currentVideoId() === videoId &&
      resolveMount() === mount &&
      youtubePlayer(win) === player &&
      player.querySelector('video') === video,
    playback: {
      snapshot,
      subscribe(listener) {
        playbackListeners.add(listener);
        return () => playbackListeners.delete(listener);
      },
      subscribeFrames(listener) {
        frameListeners.add(listener);
        startFrames();
        return () => {
          frameListeners.delete(listener);
          if (!frameListeners.size) cancelFrames();
        };
      },
      dispose() {
        playbackListeners.clear();
        frameListeners.clear();
        cancelFrames();
      },
    },
    source: {
      subscribe(listener) {
        sourceListeners.add(listener);
        return () => sourceListeners.delete(listener);
      },
      dispose() {
        sourceListeners.clear();
      },
    },
    hideNativeCaptions() {
      if (!hiddenStyle) {
        hiddenStyle = win.document.createElement('style');
        player.setAttribute(custodyAttribute, custodyId);
        hiddenStyle.textContent = `[${custodyAttribute}="${custodyId}"] .ytp-caption-window-container { visibility: hidden !important; }`;
        player.append(hiddenStyle);
      }
      return restoreNative;
    },
    start() {
      if (active || disposed) return;
      active = true;
      startedAt = Date.now();
      bindCaptions();
      bridge('read');
      playbackChanged();
      startFrames();
    },
    stop,
    dispose,
    poll() {
      if (!active) return;
      bindCaptions();
      bridge('read');
      playbackChanged();
    },
    setTargetLanguage(language = '') {
      if (language === targetLanguage) return;
      if (targetLanguage)
        win.postMessage(
          {
            type: BRIDGE_REQUEST,
            version: 1,
            requestId: win.crypto.randomUUID(),
            videoId,
            action: 'stop',
            targetLanguage,
          },
          win.location.origin
        );
      targetLanguage = language;
      lastTargetReadAt = -Infinity;
      clearTarget();
      readTarget();
    },
    retry() {
      if (active) {
        lastText = null;
        readDom();
        bridge('read', true);
      }
    },
  };
}
