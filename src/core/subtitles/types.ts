/** Portable subtitle contracts. This module has no browser or service dependencies. */
export interface SubtitleCue {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
}

export interface SubtitleTrack {
  videoId: string;
  id: string;
  language: string;
  kind: 'manual' | 'auto';
  contentVersion: string;
  cues: readonly SubtitleCue[];
}

export interface PlaybackState {
  timeMs: number;
  paused: boolean;
  playbackRate: number;
  seeking?: boolean;
  adPlaying?: boolean;
}

export interface SubtitleIdentity {
  sessionVersion: number;
  videoId: string;
  trackId: string;
  trackVersion: string;
  cueId: string;
  contentVersion: string;
}

export interface CurrentTextSnapshot {
  text: string;
  observation: number;
  contentVersion: number;
  sessionVersion: number;
}

export type SubtitleSourceEvent =
  | { type: 'track'; track: SubtitleTrack; sessionVersion: number; incremental?: boolean }
  | { type: 'currentText'; snapshot: CurrentTextSnapshot }
  | { type: 'unavailable'; reason: 'no-captions' | 'fetch-failed' | 'rate-limited'; retryable: boolean };

export interface SubtitleSource {
  subscribe(listener: (event: SubtitleSourceEvent) => void): () => void;
  dispose(): void;
}

export interface PlaybackPort {
  snapshot(): PlaybackState;
  subscribe(listener: (state: PlaybackState) => void): () => void;
  dispose(): void;
}

export interface TranslationRequest {
  identity: SubtitleIdentity;
  text: string;
  context: string;
  priority: 'current' | 'prefetch';
}

export type SubtitleTranslationEvent =
  | { type: 'completed'; identity: SubtitleIdentity; text: string }
  | { type: 'failed'; identity: SubtitleIdentity; code: string; retryable: boolean }
  | { type: 'cancelled'; identity: SubtitleIdentity };

export interface TranslationPort {
  submit(requests: readonly TranslationRequest[]): void;
  updatePriorities(identities: readonly SubtitleIdentity[]): void;
  subscribe(listener: (event: SubtitleTranslationEvent) => void): () => void;
  unsubscribe(identities: readonly SubtitleIdentity[]): void;
  dispose(): void;
}

export interface SubtitleViewModel {
  original: string;
  translation: string;
  status: 'ready' | 'loading' | 'no-captions' | 'fetch-failed' | 'translation-failed';
}

export interface SubtitleRenderer {
  render(view: SubtitleViewModel): void;
  dispose(): void;
}

export interface PlatformCapabilities {
  timeline: boolean;
  currentText: boolean;
  trackSelection: boolean;
  adDetection: boolean;
  fullscreen: boolean;
}

/** Platform-owned handles keep mounting and native-caption changes outside the core. */
export interface PlatformAdapter<Mount = unknown> {
  id: string;
  capabilities: PlatformCapabilities;
  videoId(): string | null;
  playback: PlaybackPort;
  source: SubtitleSource;
  mount(): Mount | null;
  hideNativeCaptions(): () => void;
  dispose(): void;
}

export interface SubtitleSession {
  start(): void;
  stop(): void;
  dispose(): void;
}

export interface SubtitleTimers {
  setTimeout(callback: () => void, delayMs: number): unknown;
  clearTimeout(handle: unknown): void;
}
