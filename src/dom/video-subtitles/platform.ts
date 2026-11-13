import type {
  PlatformAdapter,
  PlaybackPort,
  SubtitleSource,
  SubtitleSourceEvent,
  SubtitleTrack,
} from '@/core/subtitles';

export interface VideoSubtitleMetadata {
  videoId: string;
  title: string;
  language: string;
  domLanguage?: string;
  live?: boolean;
  trackId: string;
  hasTracks: boolean;
}
export type VideoSubtitleSourceEvent =
  | SubtitleSourceEvent
  | { type: 'reset' }
  | { type: 'metadata'; value: VideoSubtitleMetadata }
  | { type: 'targetTrack'; pending?: boolean; track: SubtitleTrack | null; language: string };
export interface VideoPlatformAdapter extends Omit<PlatformAdapter<HTMLElement>, 'playback' | 'source'> {
  playback: PlaybackPort & { subscribeFrames(listener: () => void): () => void };
  source: Omit<SubtitleSource, 'subscribe'> & {
    subscribe(listener: (event: VideoSubtitleSourceEvent) => void): () => void;
  };
  /** Current renderer parent; may change during fullscreen without changing ownership. */
  mount(): HTMLElement | null;
  /** Stable media ownership, independent of the renderer's fullscreen mount. */
  matches(): boolean;
  media?(): HTMLVideoElement;
  start(): void;
  stop(): void;
  poll(): void;
  retry(): void;
  setTargetLanguage?(language?: string): void;
}
export interface VideoPlatformDefinition {
  id: string;
  create(win: Window): VideoPlatformAdapter | null;
}
