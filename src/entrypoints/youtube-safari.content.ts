import { defineContentScript, injectScript } from '#imports';
import { isYoutubeEmbed } from '@/dom/video-subtitles/youtube/bridge-protocol';

// Safari MV2 ignores world: MAIN. Load only the public player bridge in the page.
export default defineContentScript({
  include: ['safari'],
  matches: ['https://*.youtube.com/*', 'https://*.youtube-nocookie.com/embed/*'],
  allFrames: true,
  runAt: 'document_start',
  async main(ctx) {
    if (window !== window.top && !isYoutubeEmbed(location.href)) return;
    if (!document.documentElement) {
      await new Promise<void>((resolve) => {
        const observer = new MutationObserver(() => {
          if (document.documentElement) {
            observer.disconnect();
            resolve();
          }
        });
        observer.observe(document, { childList: true });
        ctx.onInvalidated(() => {
          observer.disconnect();
          resolve();
        });
      });
    }
    if (!ctx.isInvalid) await injectScript('/youtube-main.js');
  },
});
