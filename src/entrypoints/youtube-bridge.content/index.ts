import { defineContentScript } from '#imports';
import { isYoutubeEmbed } from '@/dom/video-subtitles/youtube/bridge-protocol';
import { installYoutubeBridge } from '@/dom/video-subtitles/youtube/page-bridge';

export default defineContentScript({
  matches: ['https://*.youtube.com/*', 'https://*.youtube-nocookie.com/embed/*'],
  exclude: ['safari'],
  allFrames: true,
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    if (window !== window.top && !isYoutubeEmbed(location.href)) return;
    installYoutubeBridge(window);
  },
});
