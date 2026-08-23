/**
 * @module surface/shadow
 *
 * SurfaceEnv factory for the in-page host surface: the extension's main UI
 * injected into arbitrary web pages, isolated in a shadow root. Encapsulates
 * every piece of wiring the isolation demands (shadow root creation via WXT,
 * root element, rem compensation, keyboard event isolation) so a content
 * script needs exactly one call.
 *
 * NOT a singleton — multiple host surfaces with arbitrary anchors are
 * supported; `name` only determines the custom element tag WXT creates.
 * Caveat: the satellite registry (surface/satellite) currently binds to ONE
 * host surface per JS context — see its module header.
 */

import { createShadowRootUi } from '#imports';
import { SURFACE_ROOT_CLASS } from '@/constants';
import type { ColorSchemeStrategy, SurfaceEnv } from './defs';

type ShadowRootUiCtx = Parameters<typeof createShadowRootUi>[0];

export interface ShadowSurfaceOptions<TMounted> {
  /** Custom element tag name (must contain a dash), e.g. SHADOW_SURFACE_TAG. */
  name: string;
  /** Where to insert the host element. Defaults to `body`. */
  anchor?: string | Element;
  /**
   * WXT positioning mode. `overlay` (default) keeps the host element at
   * zero layout footprint — in-page UI should position itself (fixed/
   * absolute), never participate in the host page's flow.
   */
  position?: 'inline' | 'overlay' | 'modal';
  colorSchemeStrategy?: ColorSchemeStrategy;
  /**
   * Keyboard events typed inside the surface must not reach host-page
   * hotkey handlers (YouTube/Twitter-style shortcuts). Defaults to
   * isolating key events; pass `false` to opt out.
   */
  isolateEvents?: boolean | string[];
  /** Mount the app into `container`; whatever it returns is passed to onRemove. */
  onMount: (container: HTMLElement, env: SurfaceEnv) => TMounted;
  onRemove?: (mounted: TMounted | undefined) => void;
}

/**
 * rem resolves against the host page's root font size even inside shadow
 * DOM. Compensate via Mantine's `theme.scale`.
 *
 * Measured with a probe element instead of reading
 * `getComputedStyle(documentElement).fontSize`: the browser's minimum-font-
 * size setting can clamp the root's COMPUTED value (e.g. report 12px on a
 * `font-size: 62.5%` page) while rem still resolves against the true 10px —
 * the probe observes what rem actually resolves to.
 */
// Internal to shadow-surface creation; not part of the public API.
function computeHostRemScale(): number {
  // document_start scripts may run before documentElement exists.
  const parent = document.documentElement ?? document.body ?? document.head;
  if (!parent) return 1;
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;visibility:hidden;font-size:1rem;';
  parent.appendChild(probe);
  const remPx = Number.parseFloat(window.getComputedStyle(probe).fontSize);
  probe.remove();
  if (!Number.isFinite(remPx) || remPx <= 0) return 1;
  return 16 / remPx;
}

export async function createShadowSurfaceUi<TMounted>(ctx: ShadowRootUiCtx, options: ShadowSurfaceOptions<TMounted>) {
  const scale = computeHostRemScale();

  return createShadowRootUi<TMounted>(ctx, {
    name: options.name,
    position: options.position ?? 'overlay',
    anchor: options.anchor ?? 'body',
    isolateEvents: options.isolateEvents ?? ['keydown', 'keyup', 'keypress'],
    onMount: (container, shadowRoot) => {
      // WXT's container is the <body> it recreates inside the shadow root;
      // React warns when creating a root on a body, so wrap in a div. The
      // div doubles as the Mantine theme root (CSS variables + color-scheme
      // attribute) and as the portal target that keeps every floating layer
      // inside the shadow tree.
      const rootElement = document.createElement('div');
      rootElement.classList.add(SURFACE_ROOT_CLASS);
      container.append(rootElement);

      const env: SurfaceEnv = {
        kind: 'shadow',
        shadowRoot,
        rootElement,
        portalTarget: rootElement,
        scale,
        colorSchemeStrategy: options.colorSchemeStrategy ?? 'extension',
      };

      return options.onMount(rootElement, env);
    },
    onRemove: options.onRemove,
  });
}
