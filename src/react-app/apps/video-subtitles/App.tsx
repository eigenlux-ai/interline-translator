import { useEffect } from 'react';
import { sendMessage } from '@/core/messaging';
import { mountVideoSubtitleRenderer } from '@/react-app/apps/video-subtitles/renderer';
import { createYoutubeSubtitleRuntime, type VideoSubtitleSettings } from '@/dom/video-subtitles/runtime';
import { syncUiLocaleFrom } from '@/i18n';
import { getConfigService, getPublicConfig, watchPublicConfig, type PublicConfig } from '@/services/config/public';
import { isSiteEnabled } from '@/services/config/site-control';
import { createSubtitleTranslationClient } from '@/services/subtitles/client';

function settings(config: PublicConfig): VideoSubtitleSettings {
  return {
    config: config.videoSubtitles,
    translationRevision: config.subtitleTranslationRevision,
    allowed: isSiteEnabled(config.siteControl, location.hostname),
    targetLanguage:
      config.videoSubtitles.translation.target.mode === 'inherit'
        ? config.translate.target
        : config.videoSubtitles.translation.target.language,
    providerId: config.effectiveSubtitleProvider.id,
    providerKind: config.effectiveSubtitleProvider.kind,
    providers: config.availableProviders,
  };
}
/** Shares the host surface's React tree and satellite registry. */
export default function VideoSubtitleApp() {
  useEffect(() => {
    if (!['www.youtube.com', 'youtube.com'].includes(location.hostname)) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void getPublicConfig()
      .then((config) => {
        if (disposed) return;
        syncUiLocaleFrom(config);
        const runtime = createYoutubeSubtitleRuntime(window, settings(config), {
          render: mountVideoSubtitleRenderer,
          connect: createSubtitleTranslationClient,
          patch: (patch) => getConfigService().patchVideoSubtitles(patch),
          more: () => {
            void sendMessage('openVideoSubtitleSettings', undefined);
          },
        });
        const unwatch = watchPublicConfig((next) => {
          syncUiLocaleFrom(next);
          runtime.configure(settings(next));
        });
        cleanup = () => {
          unwatch();
          runtime.dispose();
        };
      })
      .catch((error) => {
        if (!disposed) console.error('Unable to initialize video subtitles', error);
      });
    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);
  return null;
}
