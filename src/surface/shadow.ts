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
import { PROJECT_PREFIX, SURFACE_ROOT_CLASS } from '@/constants';
import type { ColorSchemeStrategy, SurfaceEnv } from './defs';
import { bridgeFocus } from './focus-bridge';
import { resolveIsolatedEvents } from './isolate-events';
import { releaseSatellites } from './satellite';

type ShadowRootUiCtx = Parameters<typeof createShadowRootUi>[0];

export interface ShadowSurfaceOptions<TMounted> {
  /** Custom element tag name (must contain a dash), e.g. SHADOW_SURFACE_TAG. */
  name: string;
  /** Bundled entrypoint CSS; avoids extension-resource requests from the host page. */
  css?: string;
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
 * Measured with a probe instead of reading
 * `getComputedStyle(documentElement).fontSize`: the browser's minimum-font-
 * size setting can clamp the root's COMPUTED value (e.g. report 12px on a
 * `font-size: 62.5%` page) while rem still resolves against the true 10px.
 * The probe is a `width: 1rem` element inside its own closed shadow root, so
 * no host rule (even `div { font-size: … !important }`) can restyle it, and
 * its computed width is exactly what 1rem resolves to.
 */
// Internal to shadow-surface creation; not part of the public API.
function computeHostRemScale(): number {
  // document_start scripts may run before documentElement exists.
  const parent = document.documentElement ?? document.body ?? document.head;
  if (!parent) return 1;
  const probe = document.createElement(`${PROJECT_PREFIX}-rem-probe`);
  probe.style.cssText = 'position:absolute;visibility:hidden;';
  const ruler = document.createElement('div');
  ruler.style.cssText = 'width:1rem;';
  probe.attachShadow({ mode: 'closed' }).append(ruler);
  parent.appendChild(probe);
  const remPx = Number.parseFloat(window.getComputedStyle(ruler).width);
  probe.remove();
  if (!Number.isFinite(remPx) || remPx <= 0) return 1;
  return 16 / remPx;
}

/**
 * Attach the static CSS to the host shadow root as one constructable sheet,
 * which satellites then adopt as the same object (surface/satellite). Where
 * the sheet cannot be constructed or adopted (e.g. Firefox content-script
 * realm mismatches) it becomes a plain <style> before `before` instead.
 *
 * An adopted sheet cascades after the shadow root's <style> elements (WXT's
 * `:host` reset, Mantine's theme variables), the fallback <style> before
 * Mantine's — see the cascade note in global.css.
 */
function attachStaticStyles(shadowRoot: ShadowRoot, before: Node, css: string) {
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(css);
    shadowRoot.adoptedStyleSheets = [...shadowRoot.adoptedStyleSheets, sheet];
    return;
  } catch (error) {
    console.warn('[surface/shadow] constructable sheets unavailable, using <style>', error);
  }
  const style = document.createElement('style');
  style.textContent = css;
  shadowRoot.insertBefore(style, before);
}

export async function createShadowSurfaceUi<TMounted>(ctx: ShadowRootUiCtx, options: ShadowSurfaceOptions<TMounted>) {
  const scale = computeHostRemScale();
  // Attached by us rather than passed to WXT, so the sheet can be shared.
  const css = options.css?.replaceAll(':root', ':host');
  let stylesAttached = false;
  // WXT calls onMount on every mount(); remembered so a repeated mount()
  // without remove() reuses the app instead of starting a second one.
  let current: { rootElement: HTMLElement; shadowRoot: ShadowRoot; mounted: TMounted } | undefined;

  const ui = await createShadowRootUi<TMounted>(ctx, {
    name: options.name,
    position: options.position ?? 'overlay',
    anchor: options.anchor ?? 'body',
    isolateEvents: options.isolateEvents ?? ['keydown', 'keyup', 'keypress'],
    onMount: (container, shadowRoot) => {
      if (current?.rootElement.parentNode === container) return current.mounted;

      // Once per shadow root; a remount after remove() reuses it.
      if (css && !stylesAttached) {
        attachStaticStyles(shadowRoot, container, css);
        stylesAttached = true;
      }

      // WXT 0.21 supplies a div inside the shadow root. Keep our own wrapper
      // as the Mantine theme root and portal target so all floating layers
      // stay within the surface, independently of WXT's container structure.
      const rootElement = document.createElement('div');
      rootElement.classList.add(SURFACE_ROOT_CLASS);
      container.append(rootElement);
      // Mantine handles focus on `document`, which neither sees the focused
      // element in here nor the Tab keys isolation stops; see surface/focus-bridge.
      bridgeFocus(shadowRoot, { relayTab: resolveIsolatedEvents(options.isolateEvents).includes('keydown') });

      const env: SurfaceEnv = {
        kind: 'shadow',
        shadowRoot,
        rootElement,
        portalTarget: rootElement,
        scale,
        colorSchemeStrategy: options.colorSchemeStrategy ?? 'extension',
      };

      current = { rootElement, shadowRoot, mounted: options.onMount(rootElement, env) };
      return current.mounted;
    },
    onRemove: (mounted) => {
      // Only for a mounted UI: remove() can run more than once (see below).
      if (!current) return;
      // Satellites live outside the shadow host, so WXT's remove() would leave them behind.
      releaseSatellites(current.shadowRoot);
      current = undefined;
      options.onRemove?.(mounted);
    },
  });
  // WXT removes the UI when the context is invalidated, but only if that
  // happens after creation, and without stopping autoMount (which would
  // re-mount when the anchor reappears). Never mount on a dead context, and
  // on invalidation use the public remove(), which also stops autoMount.
  const { mount, autoMount } = ui;
  ui.mount = () => {
    if (!ctx.isInvalid) mount();
  };
  ui.autoMount = (autoMountOptions) => {
    if (!ctx.isInvalid) autoMount(autoMountOptions);
  };
  ctx.onInvalidated(() => ui.remove());
  return ui;
}
