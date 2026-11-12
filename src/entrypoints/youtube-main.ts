import { defineUnlistedScript } from '#imports';
import { isYoutubeEmbed } from '@/dom/video-subtitles/youtube/bridge-protocol';
import { installYoutubeBridge } from '@/dom/video-subtitles/youtube/page-bridge';

export default defineUnlistedScript({
  include: ['safari'],
  main() {
    if (window !== window.top && !isYoutubeEmbed(location.href)) return;
    installYoutubeBridge(window);
  },
});
