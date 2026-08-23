/**
 * MAIN-world `attachShadow` hook: the discovery-timing half of closed-shadow
 * support, and the only door into CLOSED roots from the page realm (reading a
 * closed root from the ISOLATED world needs no hook at all — content scripts
 * have `chrome.dom` / Firefox's element property, see dom/shadow).
 *
 * Two consumers, both fed from here:
 *   - the responder next door: a marked editable can live inside a closed root,
 *     which no `querySelector` reaches, so `roots()` seeds its scan;
 *   - the isolated-world page translator: a root attached AFTER its host was
 *     walked is invisible to the walker (no mutation ever fires inside a tree we
 *     haven't adopted), so each attach posts one throttled, content-free signal
 *     that nudges the debounced rescan.
 *
 * It lives inside the responder's bundle so the registry remains a module closure
 * inaccessible to page scripts, keeping closed roots isolated from page context.
 * This also inherits the responder script's `allFrames` configuration across nested frames.
 *
 * Page-inert by contract: no reads of page state, no attributes written onto
 * host elements, and the signal targets `location.origin` (not `'*'`) to prevent
 * leaking extension state across embedded third-party frames. The patch is a Proxy
 * that preserves native stringification, and `uninstall()` restores the original method.
 */

import { PROJECT_PREFIX, SHADOW_ATTACH_SIGNAL } from '@/constants';

/**
 * Registry ceiling. WeakRefs allow discarded component trees to be garbage-collected.
 * The collection is capped at MAX_SHADOW_ROOTS using a bounded ring buffer to prevent
 * unbounded array growth in long-lived single-page applications.
 */
export const MAX_SHADOW_ROOTS = 512;

/** One trailing signal per window: component libraries attach dozens of roots in one task. */
const SIGNAL_THROTTLE_MS = 100;

/**
 * Re-injection guard (extension update without a page reload). A second wrap
 * would nest proxies — the inner one surviving every `uninstall()` — and double
 * every signal. The brand is served by the patched function's `get` trap rather
 * than written onto it: a property written on the native method would outlive
 * the unwrap and strand the next instance on a dead closure. A well-known symbol
 * is the only state two instances of this bundle share, and it exposes the
 * unhook, never the roots.
 */
const HOOK_BRAND = Symbol.for(`${PROJECT_PREFIX}:shadow-hook`);

export interface ShadowRegistry {
  /** Live roots, newest first; dead entries are pruned as a side effect. */
  roots(): ShadowRoot[];
  /** Restore the original `attachShadow` and forget every root. */
  uninstall(): void;
}

const INERT: ShadowRegistry = {
  roots: () => [],
  uninstall: () => {},
};

export function installShadowRegistry(): ShadowRegistry {
  const proto = Element.prototype;
  // A previous instance of this bundle must unhook FIRST, so `orig` below is
  // always the real method and never another wrapper.
  const previous = (proto.attachShadow as unknown as Record<symbol, unknown>)?.[HOOK_BRAND];
  if (typeof previous === 'function') (previous as () => void)();

  const orig = proto.attachShadow;
  // Exotic sandbox without shadow DOM: nothing to hook, and the responder's
  // deep scan simply loses its closed-root reach.
  if (typeof orig !== 'function') return INERT;

  const refs: WeakRef<ShadowRoot>[] = [];
  let signalTimer: ReturnType<typeof setTimeout> | null = null;

  const roots = (): ShadowRoot[] => {
    const out: ShadowRoot[] = [];
    for (let i = refs.length - 1; i >= 0; i--) {
      const root = refs[i].deref();
      if (root) out.push(root);
      else refs.splice(i, 1);
    }
    return out;
  };

  function uninstall(): void {
    // Only unwrap OUR patch: if the page (or another extension) wrapped us in
    // turn, assigning `orig` here would delete their wrapper with ours.
    if (proto.attachShadow === patched) proto.attachShadow = orig;
    if (signalTimer !== null) {
      clearTimeout(signalTimer);
      signalTimer = null;
    }
    refs.length = 0;
  }

  const patched = new Proxy(orig, {
    apply(target, host: Element, args: [ShadowRootInit]): ShadowRoot {
      const root = Reflect.apply(target, host, args);
      if (refs.length >= MAX_SHADOW_ROOTS) {
        let live = 0;
        for (const ref of refs) if (ref.deref()) refs[live++] = ref;
        refs.length = live;
        if (refs.length >= MAX_SHADOW_ROOTS) refs.shift();
      }
      refs.push(new WeakRef(root));
      if (signalTimer === null) {
        signalTimer = setTimeout(() => {
          signalTimer = null;
          try {
            window.postMessage({ source: SHADOW_ATTACH_SIGNAL }, location.origin);
          } catch {
            /* opaque origin (sandboxed frame) — nothing to signal into */
          }
        }, SIGNAL_THROTTLE_MS);
      }
      return root;
    },
    get(target, prop, receiver) {
      return prop === HOOK_BRAND ? uninstall : Reflect.get(target, prop, receiver);
    },
  });

  proto.attachShadow = patched;
  return { roots, uninstall };
}
