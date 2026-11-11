import { defineContentScript } from '#imports';
import { installYoutubeBridge } from '@/dom/video-subtitles/youtube/page-bridge';

export default defineContentScript({
  matches: ['*://*.youtube.com/*'],
  runAt: 'document_start',
  world: 'MAIN',
  main() {
    installYoutubeBridge(window);
  },
});
