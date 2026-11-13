import { defineContentScript } from '#imports';
import surfaceCss from 'virtual:surface-css';
import { createShadowSurfaceUi } from '@/surface/shadow';
import VideoSubtitleApp from '@/react-app/apps/video-subtitles/App';
import { renderSurfaceApp } from '@/react-app/bootstrap';
import { SHADOW_SURFACE_TAG } from '@/constants';
import { hostColorSchemeSource } from '@/dom/host-scheme';
import '@/react-app/styles/shadow-surface.css';

export default defineContentScript({
  matches: ['https://*.youtube.com/embed/*', 'https://*.youtube-nocookie.com/embed/*'],
  allFrames: true,
  cssInjectionMode: 'manual',
  async main(ctx) {
    // The ordinary floating surface already owns top-level documents.
    if (window === window.top) return;
    const ui = await createShadowSurfaceUi(ctx, {
      name: SHADOW_SURFACE_TAG,
      css: surfaceCss,
      position: 'overlay',
      colorSchemeStrategy: hostColorSchemeSource,
      onMount: (container, env) => {
        const app = renderSurfaceApp(container, env, <VideoSubtitleApp />);
        app.catch((error) => console.warn('[youtube-embed] failed to render the surface', error));
        return app;
      },
      onRemove: (mounted) => {
        void mounted?.then(
          (root) => root.unmount(),
          () => {}
        );
      },
    });
    ui.mount();
  },
});
