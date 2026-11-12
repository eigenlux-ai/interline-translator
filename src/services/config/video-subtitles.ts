/** Shared, content-safe defaults and provider resolution; no storage or SDK. */
import type { Config, ProviderConfig, VideoSubtitlesConfig, VideoSubtitlesPatch } from '@/data/models';

export const SUBTITLE_REQUEST_LIMITS = {
  maxConcurrent: [1, 3],
  requestsPerSecond: [0.1, 10],
  mtLookAheadSeconds: [0, 60],
  llmLookAheadSeconds: [0, 120],
  maxBatchItems: [1, 5],
  maxBatchChars: [100, 10000],
} as const;

export function defaultVideoSubtitles(): VideoSubtitlesConfig {
  return {
    enabled: true,
    platforms: { youtube: { enabled: true, autoEnable: false } },
    translation: { preferHumanCaptions: false, target: { mode: 'inherit' }, provider: { mode: 'inherit' } },
    requests: {
      maxConcurrent: 3,
      requestsPerSecond: 2,
      mtLookAheadSeconds: 10,
      llmLookAheadSeconds: 30,
      maxBatchItems: 5,
      maxBatchChars: 1000,
    },
    appearance: {
      displayMode: 'bilingual',
      translationPosition: 'below',
      fontSize: 22,
      positionPercent: 10,
      backgroundOpacity: 0.75,
    },
  };
}

/** Fixed missing/disabled providers never silently fall back to another service. */
export function resolveSubtitleProvider(config: Config): ProviderConfig | undefined {
  const selection = config.videoSubtitles.translation.provider;
  const available = config.providers.filter((p) => p.enabled && !p.draft);
  if (selection.mode === 'fixed') return available.find((p) => p.id === selection.providerId);
  return available.find((p) => p.id === config.translate.defaultProviderId) ?? available[0];
}

export function mergeVideoSubtitles(current: VideoSubtitlesConfig, patch: VideoSubtitlesPatch): VideoSubtitlesConfig {
  const platforms = { ...current.platforms };
  for (const [id, fields] of Object.entries(patch.platforms ?? {})) {
    platforms[id] = { ...(platforms[id] ?? { enabled: false, autoEnable: false }), ...fields };
  }
  return {
    ...current,
    ...(patch.enabled !== undefined ? { enabled: patch.enabled } : {}),
    platforms,
    translation: { ...current.translation, ...patch.translation },
    requests: { ...current.requests, ...patch.requests },
    appearance: { ...current.appearance, ...patch.appearance },
  };
}
