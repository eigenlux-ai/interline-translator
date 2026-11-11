import { defineContentScript } from '#imports';
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
export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  async main(ctx) {
    const config = await getPublicConfig();
    if (ctx.isInvalid) return;
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
    ctx.onInvalidated(() => {
      unwatch();
      runtime.dispose();
    });
  },
});
