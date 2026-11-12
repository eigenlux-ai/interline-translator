import {
  DomTextStabilizer,
  planSubtitleWindow,
  subtitleFingerprint,
  SubtitleSessionState,
  type SubtitleCue,
  type SubtitleIdentity,
} from '@/core/subtitles';
import type { VideoSubtitlesConfig, VideoSubtitlesPatch } from '@/data/models/config';
import type { SubtitleSubscription, SubtitleTranslationEvent, SubtitleWindow } from '@/services/subtitles/protocol';
import type {
  VideoPlatformAdapter,
  VideoPlatformDefinition,
  VideoSubtitleMetadata,
  VideoSubtitleSourceEvent,
} from './platform';
import { videoSubtitlePlatforms } from './platforms';

export interface VideoSubtitleSettings {
  config: VideoSubtitlesConfig;
  allowed: boolean;
  targetLanguage: string;
  providerId?: string;
  providerKind: string;
  /** Output-affecting provider, prompt and glossary configuration. */
  translationRevision?: string;
  providers: { id: string; label: string; kind: string }[];
}
export type VideoSubtitleStatus =
  | 'ready'
  | 'fetching'
  | 'no-captions'
  | 'fetch-failed'
  | 'rate-limited'
  | 'translation-failed'
  | 'loading'
  | 'unavailable'
  | 'dom';
export interface VideoSubtitleView {
  enabled: boolean;
  original: string;
  translation: string;
  status: VideoSubtitleStatus;
  sourceLanguage: string;
  settings: VideoSubtitleSettings;
}
export interface VideoSubtitleRenderer {
  /** Recover when the host page removes an injected satellite. */
  isConnected?(): boolean;
  render(view: VideoSubtitleView): void;
  dispose(): void;
}
export interface VideoSubtitleUiState {
  open: boolean;
  focusControl?: number;
}
export interface VideoSubtitleRuntimePorts {
  render(
    player: HTMLElement,
    actions: {
      uiState?: VideoSubtitleUiState;
      saveUiState?(patch: Partial<VideoSubtitleUiState>): void;
      toggle(): void;
      fail(): void;
      retry(): void;
      patch(patch: VideoSubtitlesPatch): Promise<void>;
      more(): void;
    }
  ): VideoSubtitleRenderer;
  connect(handlers: { onEvent(event: SubtitleTranslationEvent): void; onDisconnect(): void }): {
    updateWindow(window: SubtitleWindow): void;
    close(): void;
  };
  patch(patch: VideoSubtitlesPatch): Promise<void>;
  more(): void;
}

function boundedSubscriptions(items: SubtitleSubscription[]): SubtitleSubscription[] {
  let budget = 100_000;
  return items
    .filter((item) => {
      budget -= item.text.length + (item.context?.length ?? 0);
      return budget >= 0;
    })
    .slice(0, 100);
}

/** Generic session owner. All platform acquisition, clocks and native-caption custody use ports. */
export function createSubtitleRuntime(
  win: Window,
  initial: VideoSubtitleSettings,
  ports: VideoSubtitleRuntimePorts,
  platforms: readonly VideoPlatformDefinition[] = videoSubtitlePlatforms
) {
  let settings = initial;
  let disposed = false,
    enabled = false,
    generation = 0;
  let adapter: VideoPlatformAdapter | null = null;
  let renderer: VideoSubtitleRenderer | null = null;
  let state = new SubtitleSessionState();
  let metadata: VideoSubtitleMetadata | null = null;
  let uiVideo: string | null = null;
  let resumeVideo: string | null = null;
  let uiState: VideoSubtitleUiState = { open: false };
  let status: VideoSubtitleStatus = 'fetching';
  let original = '',
    domTranslation = '',
    domStable = '',
    domVersion = '',
    signature = '';
  let reconnectAt = 0,
    reconnectAttempts = 0,
    connectionEpoch = 0;
  let client: ReturnType<VideoSubtitleRuntimePorts['connect']> | null = null;
  let restoreNative: (() => void) | null = null;
  let scheduleTimer: number | null = null;
  let frameSignature = '';
  let domSourceAvailable = false;
  let cleanups: (() => void)[] = [];
  const identities = new Map<string, SubtitleIdentity>();
  const failures = new Set<string>();
  const desired = new Set<string>();
  const platformSettings = (id: string) => settings.config.platforms[id as keyof typeof settings.config.platforms];
  const permitted = (id: string) => settings.allowed && settings.config.enabled && !!platformSettings(id)?.enabled;
  const closeClient = () => {
    connectionEpoch += 1;
    const previous = client;
    client = null;
    signature = '';
    previous?.close();
  };
  const restore = () => {
    restoreNative?.();
    restoreNative = null;
  };
  const invalidate = () => {
    generation += 1;
    state.invalidate();
    identities.clear();
    failures.clear();
    desired.clear();
    signature = '';
    original = '';
    domTranslation = '';
    domStable = '';
    domVersion = '';
    domSourceAvailable = false;
    frameSignature = '';
    stabilizer.reset();
    closeClient();
  };
  const stabilizer = new DomTextStabilizer({
    timers: { setTimeout: (cb, ms) => win.setTimeout(cb, ms), clearTimeout: (id) => win.clearTimeout(id as number) },
    onDisplay(value) {
      if (value.text || original || domStable || domTranslation || failures.has('current')) status = 'dom';
      failures.delete('current');
      original = value.text;
      domTranslation = '';
      domStable = '';
      domVersion = String(value.contentVersion);
      signature = '';
      update();
    },
    onStable(value) {
      if (enabled && !state.track && value.sessionVersion === generation) {
        domStable = value.text;
        update();
      }
    },
  });
  const fail = () => {
    restore();
    enabled = false;
    adapter?.stop();
    invalidate();
    try {
      renderer?.dispose();
    } catch {
      /* Native captions are already restored. */
    }
    renderer = null;
  };
  const paint = () => {
    const playback = adapter?.playback.snapshot();
    if (playback) state.updatePlayback(playback);
    const cues = playback ? state.timeline.at(playback.timeMs) : [];
    const suppressed = !enabled || !!playback?.adPlaying || !!playback?.seeking;
    const source = state.track ? cues.map((cue) => cue.text).join('\n') : original;
    const translated = state.track
      ? cues
          .map((cue) => state.translation(cue) ?? '')
          .filter(Boolean)
          .join('\n')
      : domTranslation;
    try {
      renderer?.render({
        enabled,
        original: suppressed ? '' : source,
        translation: suppressed ? '' : translated,
        sourceLanguage: (state.track ? metadata?.language : (metadata?.domLanguage ?? metadata?.language)) ?? '',
        settings,
        status: settings.providerId || settings.config.appearance.displayMode === 'original' ? status : 'unavailable',
      });
      // Take custody only after a successful rendered original; restore through gaps and shutdown.
      if (enabled && !suppressed && source && renderer && adapter) restoreNative ??= adapter.hideNativeCaptions();
      else restore();
    } catch {
      fail();
    }
  };
  const queuePlan = (delay = 0) => {
    if (scheduleTimer !== null || !enabled || disposed) return;
    scheduleTimer = win.setTimeout(() => {
      scheduleTimer = null;
      update();
    }, delay);
  };
  const event = (value: SubtitleTranslationEvent) => {
    if (
      !enabled ||
      value.generation !== generation ||
      value.trackVersion !== (state.track?.contentVersion ?? `dom:${adapter?.videoId()}`)
    )
      return;
    if (value.type === 'invalidated') {
      if (desired.has(value.subscriptionId)) {
        signature = '';
        queuePlan(100);
      }
      return;
    }
    if (value.type === 'cancelled') return;
    if (state.track) {
      const identity = identities.get(value.subscriptionId);
      if (!identity || subtitleFingerprint(identity.contentVersion) !== value.contentVersion) return;
      if (value.type === 'completed' && value.text) state.acceptResult(identity, value.text);
      else if (value.type === 'failed') failures.add(value.cueId);
    } else if (value.contentVersion === domVersion && value.cueId === 'current') {
      if (value.type === 'completed') domTranslation = value.text ?? '';
      else if (value.type === 'failed') failures.add('current');
    }
    signature = '';
    update();
  };
  const ensureClient = () => {
    if (client || Date.now() < reconnectAt || !settings.providerId) return;
    const epoch = ++connectionEpoch;
    try {
      client = ports.connect({
        onEvent: (value) => {
          if (epoch === connectionEpoch) {
            if (value.type === 'completed' || value.type === 'failed') {
              reconnectAttempts = 0;
              reconnectAt = 0;
            }
            event(value);
          }
        },
        onDisconnect() {
          if (epoch !== connectionEpoch || !enabled) return;
          client = null;
          signature = '';
          reconnectAttempts += 1;
          reconnectAt = Date.now() + Math.min(30_000, 1000 * 2 ** Math.min(reconnectAttempts, 5));
          status = 'unavailable';
          paint();
        },
      });
    } catch {
      reconnectAt = Date.now() + 5000;
      status = 'unavailable';
    }
  };
  function update() {
    if (!enabled || !adapter) {
      paint();
      return;
    }
    const playback = adapter.playback.snapshot();
    state.updatePlayback(playback);
    const subscriptions: SubtitleSubscription[] = [];
    const canTranslate =
      settings.config.appearance.displayMode !== 'original' && !playback.adPlaying && !playback.seeking;
    if (state.track) {
      const lookAhead = settings.providerKind.endsWith('-mt')
        ? settings.config.requests.mtLookAheadSeconds
        : settings.config.requests.llmLookAheadSeconds;
      const planned = planSubtitleWindow(state.timeline, playback, { prefetchMs: lookAhead * 1000, maxCues: 100 });
      original = planned.current.map((cue) => cue.text).join('\n');
      status = planned.current.some((cue) => failures.has(cue.id))
        ? 'translation-failed'
        : planned.current.some((cue) => !state.translation(cue)) && canTranslate
          ? 'loading'
          : 'ready';
      frameSignature = planned.current.map((cue) => cue.id).join('|');
      if (canTranslate) {
        const add = (cue: SubtitleCue, priority: 'current' | 'prefetch') => {
          if (state.translation(cue) || failures.has(cue.id)) return;
          if (cue.text.length > 4000) {
            failures.add(cue.id);
            return;
          }
          const identity = state.token(cue);
          if (!identity) return;
          const subscriptionId = `${generation}:${cue.id}`;
          identities.set(subscriptionId, identity);
          subscriptions.push({
            subscriptionId,
            cueId: cue.id,
            contentVersion: subtitleFingerprint(identity.contentVersion),
            text: cue.text,
            context: state.timeline.context(cue.id),
            priority,
            distanceMs: Math.max(0, cue.startMs - playback.timeMs),
          });
        };
        planned.current.forEach((cue) => add(cue, 'current'));
        planned.upcoming.forEach((cue) => add(cue, 'prefetch'));
      }
    } else {
      // Native-caption gaps are normal once DOM fallback has supplied text.
      // Repeated full-track fetch errors must not replace this usable source.
      if (domSourceAvailable && !domStable) status = 'dom';
      if (domStable)
        status = failures.has('current') ? 'translation-failed' : canTranslate && !domTranslation ? 'loading' : 'dom';
      if (canTranslate && domStable && !domTranslation && !failures.has('current')) {
        subscriptions.push({
          subscriptionId: `${generation}:dom:${domVersion}`,
          cueId: 'current',
          contentVersion: domVersion,
          text: domStable,
          priority: 'current',
        });
      }
    }
    if (playback.adPlaying || playback.seeking) {
      original = '';
      domTranslation = '';
      domStable = '';
      domVersion = '';
      stabilizer.reset();
    }
    const bounded = boundedSubscriptions(subscriptions);
    const nextSignature = JSON.stringify(bounded.map((item) => [item.subscriptionId, item.priority]));
    if (canTranslate && bounded.length) ensureClient();
    if (client && signature !== nextSignature) {
      signature = nextSignature;
      desired.clear();
      bounded.forEach((item) => desired.add(item.subscriptionId));
      try {
        client.updateWindow({
          generation,
          trackVersion: state.track?.contentVersion ?? `dom:${adapter.videoId()}`,
          sourceLanguage: (
            (state.track ? metadata?.language : (metadata?.domLanguage ?? metadata?.language)) ?? 'auto'
          ).slice(0, 40),
          title: metadata?.title.slice(0, 500),
          subscriptions: bounded,
        });
      } catch {
        closeClient();
        reconnectAt = Date.now() + 1000;
      }
    }
    const live = new Set(bounded.map((item) => item.subscriptionId));
    for (const id of identities.keys()) if (!live.has(id)) identities.delete(id);
    paint();
  }
  const sourceChanged = (value: VideoSubtitleSourceEvent) => {
    if (!enabled || !adapter) return;
    if (value.type === 'metadata') {
      if (
        metadata?.trackId !== value.value.trackId ||
        metadata?.live !== value.value.live ||
        (!state.track && metadata?.domLanguage !== value.value.domLanguage)
      ) {
        invalidate();
        state.dispose();
        state = new SubtitleSessionState();
        status = 'fetching';
      }
      metadata = value.value;
    } else if (value.type === 'track') {
      const playback = adapter.playback.snapshot();
      if (playback.adPlaying || value.track.videoId !== adapter.videoId()) return;
      invalidate();
      state.updatePlayback(playback);
      state.replaceTrack(value.track);
      status = 'ready';
    } else if (value.type === 'currentText') {
      if (!state.track) {
        if (value.snapshot.text) {
          domSourceAvailable = true;
          status = 'dom';
        }
        stabilizer.update(value.snapshot.text, generation);
      }
    } else status = value.reason;
    update();
  };
  const stop = () => {
    enabled = false;
    if (scheduleTimer !== null) win.clearTimeout(scheduleTimer);
    scheduleTimer = null;
    invalidate();
    restore();
    adapter?.stop();
    state.dispose();
    state = new SubtitleSessionState();
    metadata = null;
    paint();
  };
  const start = () => {
    if (!adapter || !permitted(adapter.id)) return;
    enabled = true;
    status = 'fetching';
    reconnectAt = 0;
    reconnectAttempts = 0;
    adapter.start();
    update();
  };
  const retry = () => {
    failures.clear();
    reconnectAt = 0;
    signature = '';
    adapter?.retry();
    update();
  };
  const detach = () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [];
    adapter?.dispose();
    adapter = null;
    try {
      renderer?.dispose();
    } catch {
      /* A failed view cannot retain caption custody. */
    }
    renderer = null;
  };
  const tick = () => {
    if (disposed) return;
    if (adapter && (!adapter.matches() || !permitted(adapter.id) || renderer?.isConnected?.() === false)) {
      resumeVideo = enabled && permitted(adapter.id) ? adapter.videoId() : null;
      stop();
      detach();
    }
    if (!adapter) {
      for (const platform of platforms) {
        if (!permitted(platform.id)) continue;
        try {
          adapter = platform.create(win);
        } catch {
          adapter = null;
        }
        if (adapter) break;
      }
      if (adapter) {
        const mount = adapter.mount();
        if (mount) {
          try {
            if (uiVideo !== adapter.videoId()) {
              uiVideo = adapter.videoId();
              uiState = { open: false };
            }
            renderer = ports.render(mount, {
              uiState,
              saveUiState: (patch) => {
                uiState = { ...uiState, ...patch };
              },
              toggle: () => {
                resumeVideo = null;
                return enabled ? stop() : start();
              },
              fail,
              retry,
              patch: ports.patch,
              more: ports.more,
            });
          } catch {
            detach();
            return;
          }
          cleanups = [
            adapter.source.subscribe(sourceChanged),
            adapter.playback.subscribe(() => update()),
            adapter.playback.subscribeFrames(() => {
              paint();
              const current = state.timeline
                .at(state.playback.timeMs)
                .map((cue) => cue.id)
                .join('|');
              if (current !== frameSignature) queuePlan();
            }),
          ];
          if (resumeVideo === adapter.videoId() || platformSettings(adapter.id)?.autoEnable) start();
          resumeVideo = null;
        }
      }
    }
    if (enabled) {
      adapter?.poll();
      update();
    } else paint();
  };
  const onHide = () => {
    resumeVideo = null;
    stop();
    detach();
  };
  win.addEventListener('pagehide', onHide);
  const interval = win.setInterval(tick, 1000);
  tick();
  return {
    configure(next: VideoSubtitleSettings) {
      const changed =
        settings.providerId !== next.providerId ||
        settings.targetLanguage !== next.targetLanguage ||
        settings.providerKind !== next.providerKind ||
        settings.translationRevision !== next.translationRevision;
      settings = next;
      if (changed) {
        invalidate();
        adapter?.retry();
      }
      tick();
      update();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      win.clearInterval(interval);
      stop();
      detach();
      stabilizer.dispose();
      win.removeEventListener('pagehide', onHide);
    },
  };
}

/** Compatibility entrypoint; the session implementation itself has no YouTube dependencies. */
export const createYoutubeSubtitleRuntime = createSubtitleRuntime;
