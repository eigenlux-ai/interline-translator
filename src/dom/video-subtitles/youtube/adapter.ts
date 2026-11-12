import { subtitleFingerprint, type PlaybackState } from '@/core/subtitles';
import type { VideoPlatformAdapter, VideoSubtitleSourceEvent } from '../platform';
import { BRIDGE_REQUEST, validBridgeResponse, youtubeVideoId } from './bridge-protocol';
import { parseYouTubeTimedText } from './parser';

/** YouTube DOM, native-caption custody and page protocol stay behind the platform boundary. */
export function createYoutubeAdapter(win: Window): VideoPlatformAdapter | null {
  const videoId = youtubeVideoId(win.location.href);
  const player = win.document.querySelector<HTMLElement>('#movie_player');
  const video = player?.querySelector<HTMLVideoElement>('video');
  if (!videoId || !player || !video) return null;
  let active = false,
    disposed = false,
    startedAt = 0,
    trackId = '',
    rawTrack = '',
    domLanguage: string | undefined;
  let observer: MutationObserver | null = null,
    captionContainer: Element | null = null;
  let hiddenStyle: HTMLStyleElement | null = null;
  let frameId: number | null = null;
  let lastReadAt = -Infinity;
  let retryTimer: number | null = null;
  let observation = 0,
    lastText: string | null = null;
  const sourceListeners = new Set<(event: VideoSubtitleSourceEvent) => void>();
  const playbackListeners = new Set<(state: PlaybackState) => void>();
  const frameListeners = new Set<() => void>();
  const requests = new Map<string, number>();
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
  };
  const readDom = () => {
    if (!active || rawTrack || Date.now() - startedAt < 2500 || video.seeking || adPlaying()) return;
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
    if (next) {
      observer = new MutationObserver(readDom);
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
    if (state.seeking || state.adPlaying) lastText = null;
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
    if (
      !requests.has(data.requestId) ||
      data.snapshot.videoId !== videoId ||
      youtubeVideoId(win.location.href) !== videoId
    )
      return;
    if (data.snapshot.ad || adPlaying()) {
      playbackChanged();
      return;
    }
    if (domLanguage !== data.snapshot.domLanguage) {
      domLanguage = data.snapshot.domLanguage;
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
        trackId,
        hasTracks: data.snapshot.hasTracks,
      },
    });
    if (data.text && data.text !== rawTrack && data.snapshot.track) {
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
        reason: data.snapshot.hasTracks ? 'fetch-failed' : 'no-captions',
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
    observer?.disconnect();
    observer = null;
    captionContainer = null;
    cancelFrames();
    restoreNative();
    rawTrack = '';
    trackId = '';
    domLanguage = undefined;
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
    mount: () => player,
    matches: () =>
      youtubeVideoId(win.location.href) === videoId &&
      win.document.querySelector('#movie_player') === player &&
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
        hiddenStyle.textContent = '#movie_player .ytp-caption-window-container { visibility: hidden !important; }';
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
    retry() {
      if (active) {
        lastText = null;
        readDom();
        bridge('read', true);
      }
    },
  };
}
