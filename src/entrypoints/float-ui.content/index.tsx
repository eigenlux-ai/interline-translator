/**
 * Floating-UI surface: the 划词 popover (SelectionApp) and the 悬浮球 + control
 * panel (FloatingBallApp). A SHADOW content script (cssInjectionMode: 'ui') —
 * all of it lives fully isolated in a shadow root (unlike the host translation
 * script, which injects 译文 into the host DOM). `overlay` positioning keeps
 * the host element at zero layout footprint; each app positions itself (fixed).
 */

import { defineContentScript } from '#imports';
import { createShadowSurfaceUi } from '@/surface/shadow';
import FloatingBallApp from '@/react-app/apps/floating-ball/App';
import SelectionApp from '@/react-app/apps/selection/App';
import { renderSurfaceApp } from '@/react-app/bootstrap';
import { SHADOW_SURFACE_TAG } from '@/constants';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  cssInjectionMode: 'ui',
  async main(ctx) {
    const ui = await createShadowSurfaceUi(ctx, {
      name: SHADOW_SURFACE_TAG,
      position: 'overlay',
      // In-page floaters match the PAGE they hover over, not the OS: a dark
      // system over a light page would render them as charcoal islands. LIVE
      // (not a one-shot sample) — the host flipping its own theme switch
      // re-skins the mounted surface (see dom/host-scheme).
      colorSchemeStrategy: 'follow-host',
      onMount: (container, env) =>
        renderSurfaceApp(
          container,
          env,
          <>
            <SelectionApp />
            <FloatingBallApp />
          </>,
        ),
      onRemove: (mounted) => {
        void mounted?.then((root) => root.unmount());
      },
    });
    ui.mount();
  },
});
