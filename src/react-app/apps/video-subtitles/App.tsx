import { useEffect } from 'react';
import { sendMessage } from '@/core/messaging';
import { mountVideoSubtitleRenderer } from '@/react-app/apps/video-subtitles/renderer';
import { createYoutubeSubtitleRuntime, type VideoSubtitleSettings } from '@/dom/video-subtitles/runtime';
import { createYoutubeAdapter } from '@/dom/video-subtitles/youtube/adapter';
import { isYoutubeEmbed } from '@/dom/video-subtitles/youtube/bridge-protocol';
import { observeEmbedIdentity } from '@/dom/video-subtitles/youtube/embed-identity';
import { syncUiLocaleFrom } from '@/i18n';
import { getConfigService, getPublicConfig, watchPublicConfig, type PublicConfig } from '@/services/config/public';
import { isSiteEnabled } from '@/services/config/site-control';
import { createSubtitleTranslationClient } from '@/services/subtitles/client';

function settings(config: PublicConfig, hosts: string[]): VideoSubtitleSettings {
  return {
    config: config.videoSubtitles,
    translationRevision: config.subtitleTranslationRevision,
    allowed: hosts.every((host) => isSiteEnabled(config.siteControl, host)),
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
    const embed = isYoutubeEmbed(location.href);
    if (!embed && !['www.youtube.com', 'youtube.com'].includes(location.hostname)) return;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    void Promise.all([getPublicConfig(), sendMessage('getSubtitleContext', undefined)])
      .then(([config, context]) => {
        if (disposed || !context) return;
        syncUiLocaleFrom(config);
        let current = settings(config, context.hosts);
        // The callback runs after the asynchronous page-world identity reply.
        const identity = embed ? observeEmbedIdentity(window, () => runtime.configure(current)) : null;
        const runtime = createYoutubeSubtitleRuntime(
          window,
          current,
          {
            render: mountVideoSubtitleRenderer,
            connect: createSubtitleTranslationClient,
            patch: (patch) => getConfigService().patchVideoSubtitles(patch),
            more: () => {
              void sendMessage('openVideoSubtitleSettings', undefined);
            },
          },
          identity ? [{ id: 'youtube', create: (win) => createYoutubeAdapter(win, identity.videoId) }] : undefined
        );
        const unwatch = watchPublicConfig((next) => {
          syncUiLocaleFrom(next);
          current = settings(next, context.hosts);
          runtime.configure(current);
        });
        cleanup = () => {
          unwatch();
          identity?.dispose();
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
