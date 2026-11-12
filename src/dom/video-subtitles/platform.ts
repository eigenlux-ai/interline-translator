import type { PlatformAdapter, PlaybackPort, SubtitleSource, SubtitleSourceEvent } from '@/core/subtitles';

export interface VideoSubtitleMetadata {
  videoId: string;
  title: string;
  language: string;
  domLanguage?: string;
  live?: boolean;
  trackId: string;
  hasTracks: boolean;
}
export type VideoSubtitleSourceEvent = SubtitleSourceEvent | { type: 'metadata'; value: VideoSubtitleMetadata };
export interface VideoPlatformAdapter extends Omit<PlatformAdapter<HTMLElement>, 'playback' | 'source'> {
  playback: PlaybackPort & { subscribeFrames(listener: () => void): () => void };
  source: Omit<SubtitleSource, 'subscribe'> & {
    subscribe(listener: (event: VideoSubtitleSourceEvent) => void): () => void;
  };
  /** Stable ownership check includes the media element, not just the URL. */
  matches(): boolean;
  start(): void;
  stop(): void;
  poll(): void;
  retry(): void;
}
export interface VideoPlatformDefinition {
  id: string;
  create(win: Window): VideoPlatformAdapter | null;
}
