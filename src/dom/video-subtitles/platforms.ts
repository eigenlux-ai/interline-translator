import type { VideoPlatformDefinition } from './platform';
import { createYoutubeAdapter } from './youtube/adapter';

/** Static registrations only; a new platform does not require changing the session runtime. */
export const videoSubtitlePlatforms: readonly VideoPlatformDefinition[] = [
  { id: 'youtube', create: createYoutubeAdapter },
];
