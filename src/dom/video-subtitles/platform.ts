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
  /** Stable ownership check includes the media element, not just the URL. */
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
