import {
  DomTextStabilizer,
  planSubtitleWindow,
  subtitleFingerprint,
  SubtitleSessionState,
  SubtitleTimeline,
  type SubtitleCue,
  type SubtitleIdentity,
} from '@/core/subtitles';
import { coversSubtitleInterval } from '@/core/subtitles/coverage';
import { recordSubtitleDiagnostic as diagnostic } from '@/core/subtitles/diagnostics';
import { SubtitleLagMonitor } from '@/core/subtitles/lag';
import { retryDelay } from '@/core/subtitles/retry';
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
  assistance?: {
    kind: 'slow' | 'buffering' | 'buffer-ready' | 'buffer-stalled';
    canBuffer: boolean;
    completed: number;
    total: number;
  };
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
      buffer?(): void;
      resume?(): Promise<void>;
      dismissAssistance?(): void;
      patch(patch: VideoSubtitlesPatch): Promise<void>;
      more(): void;
    },
    media?: HTMLVideoElement
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
  let rendererMount: HTMLElement | null = null;
  let state = new SubtitleSessionState();
  const lag = new SubtitleLagMonitor();
  let buffering: { timeMs: number; cues: SubtitleCue[]; completed: number; progressAt: number } | null = null;
  let metadata: VideoSubtitleMetadata | null = null;
  let targetTimeline = new SubtitleTimeline([]);
  let targetWaitUntil = 0;
  const humanAt = (timeMs: number) =>
    settings.config.translation.preferHumanCaptions && !metadata?.live
      ? targetTimeline
          .at(timeMs)
          .map((cue) => cue.text)
          .join('\n')
      : '';
  let uiVideo: string | null = null;
  let resumeVideo: string | null = null;
  let uiState: VideoSubtitleUiState = { open: false };
  let status: VideoSubtitleStatus = 'fetching';
  let original = '',
    domTranslation = '',
    domStable = '',
    domVersion = '',
    signature = '';
  let deferredDom: { text: string; contentVersion: number } | null = null;
  let domPrefixTranslation = '';
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
  // In-band live captions expose no portable timestamps. Reuse exact translated
  // text when native DVR playback renders it again; never invent a cue interval.
  const liveDomTranslations = new Map<string, string>();
  const rememberLiveDom = (text: string, translation: string) => {
    if (!metadata?.live || !text || !translation) return;
    liveDomTranslations.delete(text);
    liveDomTranslations.set(text, translation);
    let chars = [...liveDomTranslations].reduce((sum, [key, value]) => sum + key.length + value.length, 0);
    while (liveDomTranslations.size > 256 || chars > 64_000) {
      const first = liveDomTranslations.keys().next().value!;
      chars -= first.length + liveDomTranslations.get(first)!.length;
      liveDomTranslations.delete(first);
    }
  };
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
    buffering = null;
    lag.reset();
    generation += 1;
    diagnostic({ event: 'session-reset', generation });
    state.invalidate();
    identities.clear();
    failures.clear();
    desired.clear();
    liveDomTranslations.clear();
    signature = '';
    original = '';
    domTranslation = '';
    domStable = '';
    domVersion = '';
    deferredDom = null;
    domPrefixTranslation = '';
    domSourceAvailable = false;
    frameSignature = '';
    stabilizer.reset();
    closeClient();
  };
  const stabilizer = new DomTextStabilizer({
    timers: { setTimeout: (cb, ms) => win.setTimeout(cb, ms), clearTimeout: (id) => win.clearTimeout(id as number) },
    onDisplay(value) {
      deferredDom = null;
      if (value.text || original || domStable || domTranslation || failures.has('current')) status = 'dom';
      const growingLive = !!metadata?.live && !!domStable && value.text.startsWith(domStable);
      original = value.text;
      const cached = metadata?.live ? liveDomTranslations.get(value.text) : undefined;
      if (!growingLive) {
        domPrefixTranslation = '';
        failures.delete('current');
        domTranslation = cached ?? '';
        domStable = '';
        domVersion = String(value.contentVersion);
        signature = '';
      } else if (cached) {
        domPrefixTranslation = '';
        domStable = value.text;
        domVersion = String(value.contentVersion);
        domTranslation = cached;
        signature = '';
      }
      update();
    },
    onStable(value) {
      if (enabled && (!state.track || metadata?.live) && value.sessionVersion === generation) {
        // Do not cancel an in-flight sentence every time another live word arrives.
        if (
          metadata?.live &&
          domStable &&
          !domTranslation &&
          !failures.has('current') &&
          value.text.startsWith(domStable)
        ) {
          deferredDom = value;
          return;
        }
        if (domStable !== value.text) {
          failures.delete('current');
          domPrefixTranslation = metadata?.live ? domTranslation || domPrefixTranslation : '';
          domStable = value.text;
          domVersion = String(value.contentVersion);
          domTranslation = metadata?.live ? (liveDomTranslations.get(value.text) ?? '') : '';
          signature = '';
        }
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
  let diagnosticPaint = '';
  const paint = () => {
    const playback = adapter?.playback.snapshot();
    if (playback) state.updatePlayback(playback);
    const cues = playback ? state.timeline.at(playback.timeMs) : [];
    const suppressed = !enabled || !!playback?.adPlaying || !!playback?.seeking;
    const timed = !!state.track && (!metadata?.live || cues.length > 0);
    const source = timed ? cues.map((cue) => cue.text).join('\n') : original;
    const human = playback ? humanAt(playback.timeMs) : '';
    const translated =
      human ||
      (timed
        ? cues
            .map((cue) => state.translation(cue) ?? '')
            .filter(Boolean)
            .join('\n')
        : domTranslation || domPrefixTranslation);
    const translationEnabled = !!settings.providerId && settings.config.appearance.displayMode !== 'original';
    const canBuffer = !!metadata && !metadata.live && !!state.track && !!adapter?.media?.();
    if (
      buffering &&
      (!translationEnabled ||
        !canBuffer ||
        suppressed ||
        !playback?.paused ||
        Math.abs(playback.timeMs - buffering.timeMs) > 250)
    ) {
      buffering = null;
      lag.dismiss(Date.now());
    }
    const slow =
      playback &&
      lag.observe(
        Date.now(),
        playback,
        !suppressed &&
          translationEnabled &&
          !!source &&
          !human &&
          !(timed ? cues.some((cue) => failures.has(cue.id)) : failures.has('current')),
        timed ? cues.some((cue) => !state.translation(cue)) : !domTranslation
      );
    let assistance: VideoSubtitleView['assistance'];
    if (buffering) {
      const completed = buffering.cues.filter(
        (cue) => !!state.translation(cue) || coversSubtitleInterval(targetTimeline, cue.startMs, cue.endMs)
      ).length;
      if (completed !== buffering.completed) {
        buffering.completed = completed;
        buffering.progressAt = Date.now();
      }
      const stalled = Date.now() - buffering.progressAt >= 30_000 || buffering.cues.some((cue) => failures.has(cue.id));
      assistance = {
        kind: completed === buffering.cues.length ? 'buffer-ready' : stalled ? 'buffer-stalled' : 'buffering',
        canBuffer,
        completed,
        total: buffering.cues.length,
      };
    } else if (slow) assistance = { kind: 'slow', canBuffer, completed: 0, total: 0 };
    try {
      renderer?.render({
        enabled,
        original: suppressed ? '' : source,
        translation: suppressed ? '' : translated,
        sourceLanguage: (timed ? metadata?.language : (metadata?.domLanguage ?? metadata?.language)) ?? '',
        settings,
        assistance,
        status: human
          ? 'ready'
          : settings.providerId || settings.config.appearance.displayMode === 'original'
            ? status
            : 'unavailable',
      });
      const paintState = `${suppressed}:${!!source}:${!!translated}:${status}`;
      if (renderer && paintState !== diagnosticPaint) {
        diagnosticPaint = paintState;
        diagnostic({
          event: source && !suppressed ? 'render-ready' : 'render-empty',
          generation,
          count: translated && !suppressed ? 1 : 0,
        });
      }
      // Take custody only after a successful rendered original; restore through gaps and shutdown.
      if (enabled && !suppressed && source && renderer && adapter) restoreNative ??= adapter.hideNativeCaptions();
      else restore();
    } catch {
      diagnostic({ event: 'render-failed', generation });
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
    ) {
      diagnostic({ event: 'translation-stale', generation });
      return;
    }
    if (value.type === 'invalidated') {
      if (desired.has(value.subscriptionId)) {
        signature = '';
        queuePlan(100);
      }
      return;
    }
    if (value.type === 'cancelled') return;
    if (state.track && value.cueId !== 'current') {
      const identity = identities.get(value.subscriptionId);
      if (!identity || subtitleFingerprint(identity.contentVersion) !== value.contentVersion) {
        diagnostic({ event: 'translation-stale', generation });
        return;
      }
      if (value.type === 'completed' && value.text) state.acceptResult(identity, value.text);
      else if (value.type === 'failed') failures.add(value.cueId);
    } else if (value.contentVersion === domVersion && value.cueId === 'current') {
      if (value.type === 'completed') {
        domTranslation = value.text ?? '';
        rememberLiveDom(domStable, domTranslation);
      } else if (value.type === 'failed') failures.add('current');
      // The stabilizer has already emitted the final growing sentence. Drain it
      // after this prefix settles, even if the native caption never changes again.
      if (deferredDom && deferredDom.text !== domStable) {
        domPrefixTranslation = domTranslation || domPrefixTranslation;
        domStable = deferredDom.text;
        domVersion = String(deferredDom.contentVersion);
        domTranslation = '';
        failures.delete('current');
        deferredDom = null;
      }
    } else {
      diagnostic({ event: 'translation-stale', generation });
      return;
    }
    if (value.type === 'completed' || value.type === 'failed')
      diagnostic({
        event: value.type === 'completed' ? 'translation-completed' : 'translation-failed',
        generation,
        code: value.error?.code,
      });
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
          reconnectAt = Date.now() + retryDelay(1000 * 2 ** Math.min(reconnectAttempts, 5), 30_000);
          diagnostic({
            event: 'retry-scheduled',
            generation,
            attempt: reconnectAttempts,
            delayMs: reconnectAt - Date.now(),
          });
          status = 'unavailable';
          paint();
        },
      });
    } catch {
      reconnectAt = Date.now() + retryDelay(5000, 30_000);
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
    const human = humanAt(playback.timeMs);
    const canTranslate =
      settings.config.appearance.displayMode !== 'original' &&
      !playback.adPlaying &&
      !playback.seeking &&
      Date.now() >= targetWaitUntil;
    const timed = !!state.track && (!metadata?.live || state.timeline.at(playback.timeMs).length > 0);
    if (timed) {
      const lookAhead = settings.providerKind.endsWith('-mt')
        ? settings.config.requests.mtLookAheadSeconds
        : settings.config.requests.llmLookAheadSeconds;
      const planned = planSubtitleWindow(state.timeline, playback, { prefetchMs: lookAhead * 1000, maxCues: 100 });
      // The progress denominator and requested cues stay identical even if the
      // user edits look-ahead/rate settings while the video is paused.
      if (buffering) {
        const currentIds = new Set(planned.current.map((cue) => cue.id));
        planned.upcoming = buffering.cues.filter((cue) => !currentIds.has(cue.id));
      }
      if (!metadata?.live) original = planned.current.map((cue) => cue.text).join('\n');
      status = planned.current.some((cue) => failures.has(cue.id))
        ? 'translation-failed'
        : planned.current.some((cue) => !state.translation(cue)) && canTranslate
          ? 'loading'
          : 'ready';
      frameSignature = `${planned.current.map((cue) => cue.id).join('|')}::${targetTimeline
        .at(playback.timeMs)
        .map((cue) => cue.id)
        .join('|')}`;
      if (canTranslate) {
        const add = (cue: SubtitleCue, priority: 'current' | 'prefetch') => {
          if (
            (priority === 'current' && human) ||
            coversSubtitleInterval(targetTimeline, cue.startMs, cue.endMs) ||
            state.translation(cue) ||
            failures.has(cue.id)
          )
            return;
          if (cue.text.length > 4000) {
            failures.add(cue.id);
            return;
          }
          const identity = state.token(cue);
          if (!identity) return;
          const subscriptionId = `${generation}:${cue.id}:${subtitleFingerprint(identity.contentVersion)}`;
          identities.set(subscriptionId, identity);
          subscriptions.push({
            subscriptionId,
            cueId: cue.id,
            contentVersion: subtitleFingerprint(identity.contentVersion),
            text: cue.text,
            context: metadata?.live ? cue.text : state.timeline.context(cue.id),
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
      if (canTranslate && !human && domStable && !domTranslation && !failures.has('current')) {
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
      deferredDom = null;
      domPrefixTranslation = '';
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
            (timed ? metadata?.language : (metadata?.domLanguage ?? metadata?.language)) ?? 'auto'
          ).slice(0, 40),
          title: metadata?.title.slice(0, 500),
          subscriptions: bounded,
        });
      } catch {
        closeClient();
        reconnectAt = Date.now() + retryDelay(1000, 30_000);
      }
    }
    const live = new Set(bounded.map((item) => item.subscriptionId));
    for (const id of identities.keys()) if (!live.has(id)) identities.delete(id);
    paint();
  }
  const sourceChanged = (value: VideoSubtitleSourceEvent) => {
    if (!enabled || !adapter) return;
    if (value.type === 'track') diagnostic({ event: 'source-track', generation, count: value.track.cues.length });
    if (value.type === 'unavailable') diagnostic({ event: 'source-error', generation, code: value.reason });
    if (value.type === 'currentText' && status !== 'dom') diagnostic({ event: 'source-dom', generation });
    if (value.type === 'reset') {
      invalidate();
      state.dispose();
      state = new SubtitleSessionState();
      status = 'fetching';
    } else if (value.type === 'targetTrack') {
      if (
        !settings.config.translation.preferHumanCaptions ||
        value.language !== settings.targetLanguage ||
        (value.track && value.track.videoId !== adapter.videoId())
      )
        return;
      targetTimeline = new SubtitleTimeline(value.track?.cues ?? []);
      if (!value.pending) targetWaitUntil = 0;
      signature = '';
    } else if (value.type === 'metadata') {
      if (
        metadata?.trackId !== value.value.trackId ||
        metadata?.live !== value.value.live ||
        ((!state.track || metadata?.live) && metadata?.domLanguage !== value.value.domLanguage)
      ) {
        invalidate();
        state.dispose();
        state = new SubtitleSessionState();
        status = 'fetching';
      }
      metadata = value.value;
      if (metadata.live) targetWaitUntil = 0;
    } else if (value.type === 'track') {
      const playback = adapter.playback.snapshot();
      if (playback.adPlaying || value.track.videoId !== adapter.videoId()) return;
      if (value.incremental && metadata?.live && state.track?.contentVersion === value.track.contentVersion) {
        const previous = new Map(state.timeline.cues.map((cue) => [cue.id, JSON.stringify(cue)]));
        const retained = new Set(
          value.track.cues.filter((cue) => previous.get(cue.id) === JSON.stringify(cue)).map((cue) => cue.id)
        );
        for (const id of failures) if (!retained.has(id)) failures.delete(id);
        state.updatePlayback(playback);
        state.updateLiveTrack(value.track);
      } else {
        invalidate();
        state.updatePlayback(playback);
        state.replaceTrack(value.track);
      }
      status = 'ready';
    } else if (value.type === 'currentText') {
      if (!state.track || metadata?.live) {
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
    targetTimeline = new SubtitleTimeline([]);
    targetWaitUntil = 0;
    paint();
  };
  const start = () => {
    if (!adapter || !permitted(adapter.id)) return;
    enabled = true;
    status = 'fetching';
    reconnectAt = 0;
    reconnectAttempts = 0;
    targetWaitUntil = settings.config.translation.preferHumanCaptions ? Date.now() + 1500 : 0;
    adapter.setTargetLanguage?.(settings.config.translation.preferHumanCaptions ? settings.targetLanguage : undefined);
    adapter.start();
    update();
  };
  const retry = () => {
    failures.clear();
    reconnectAt = 0;
    signature = '';
    if (buffering) {
      // Retry translation only: reacquiring the source would invalidate the
      // frozen buffer target. Keep completed results and cancel stale callbacks.
      buffering.progressAt = Date.now();
      closeClient();
    } else adapter?.retry();
    update();
  };
  const buffer = () => {
    const media = adapter?.media?.();
    const playback = adapter?.playback.snapshot();
    if (
      !enabled ||
      !media ||
      !metadata ||
      metadata.live ||
      !state.track ||
      !settings.providerId ||
      settings.config.appearance.displayMode === 'original' ||
      !playback ||
      playback.adPlaying ||
      playback.seeking
    )
      return;
    const lookAhead = settings.providerKind.endsWith('-mt')
      ? settings.config.requests.mtLookAheadSeconds
      : settings.config.requests.llmLookAheadSeconds;
    const planned = planSubtitleWindow(state.timeline, playback, {
      prefetchMs: Math.max(10, lookAhead) * 1000,
      maxCues: 100,
    });
    const cues = [...planned.current, ...planned.upcoming];
    if (!cues.length) return;
    media.pause();
    buffering = { timeMs: playback.timeMs, cues, completed: 0, progressAt: Date.now() };
    lag.dismiss(Date.now());
    update();
  };
  const resume = async () => {
    if (!buffering || !adapter || !enabled) return;
    // Remain actionable if play() is rejected; never resume from a timer/result.
    await adapter.media?.()?.play();
    buffering = null;
    lag.dismiss(Date.now());
    update();
  };
  const disposeRenderer = () => {
    try {
      renderer?.dispose();
    } catch {
      /* A failed view cannot retain caption custody. */
    }
    renderer = null;
    rendererMount = null;
  };
  const detach = () => {
    cleanups.forEach((cleanup) => cleanup());
    cleanups = [];
    adapter?.dispose();
    adapter = null;
    disposeRenderer();
  };
  const mountRenderer = (mount: HTMLElement) => {
    if (!adapter) return;
    if (uiVideo !== adapter.videoId()) {
      uiVideo = adapter.videoId();
      uiState = { open: false };
    }
    renderer = ports.render(
      mount,
      {
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
        buffer,
        resume,
        dismissAssistance: () => {
          lag.dismiss(Date.now());
          paint();
        },
        patch: ports.patch,
        more: ports.more,
      },
      adapter.media?.()
    );
    rendererMount = mount;
  };
  const tick = () => {
    if (disposed) return;
    if (adapter && (!adapter.matches() || !permitted(adapter.id))) {
      resumeVideo = enabled && permitted(adapter.id) ? adapter.videoId() : null;
      stop();
      detach();
    }
    if (adapter && (adapter.mount() !== rendererMount || renderer?.isConnected?.() === false)) {
      // Fullscreen/reparenting changes the output surface, not the media session.
      const mount = adapter.mount();
      disposeRenderer();
      try {
        if (mount) mountRenderer(mount);
      } catch {
        fail();
        return;
      }
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
            mountRenderer(mount);
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
              const target = targetTimeline
                .at(state.playback.timeMs)
                .map((cue) => cue.id)
                .join('|');
              if (`${current}::${target}` !== frameSignature) queuePlan();
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
  win.document.addEventListener('fullscreenchange', tick);
  const interval = win.setInterval(tick, 1000);
  tick();
  return {
    configure(next: VideoSubtitleSettings) {
      const changed =
        settings.providerId !== next.providerId ||
        settings.targetLanguage !== next.targetLanguage ||
        settings.providerKind !== next.providerKind ||
        settings.translationRevision !== next.translationRevision;
      const targetChanged =
        settings.targetLanguage !== next.targetLanguage ||
        settings.config.translation.preferHumanCaptions !== next.config.translation.preferHumanCaptions;
      settings = next;
      if (targetChanged) {
        targetTimeline = new SubtitleTimeline([]);
        targetWaitUntil = enabled && next.config.translation.preferHumanCaptions ? Date.now() + 1500 : 0;
        adapter?.setTargetLanguage?.(next.config.translation.preferHumanCaptions ? next.targetLanguage : undefined);
        signature = '';
      }
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
      win.document.removeEventListener('fullscreenchange', tick);
    },
  };
}

/** Compatibility entrypoint; the session implementation itself has no YouTube dependencies. */
export const createYoutubeSubtitleRuntime = createSubtitleRuntime;
