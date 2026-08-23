/**
 * @module dom/shadow
 *
 * Shadow-root access with closed-root discovery across browser environments:
 *
 *   1. `el.shadowRoot` — standard property for open shadow roots across all browsers;
 *   2. `el.openOrClosedShadowRoot` — Firefox privileged element property for content scripts;
 *   3. `chrome.dom.openOrClosedShadowRoot(el)` — Chromium content script API (Chrome 88+).
 * Regular page scripts can see none of the closed roots — but content scripts
 * can, so a translator has no reason to treat closed as opaque. The residual
 * gap is DISCOVERY TIMING (an element whose root attaches after we walked it);
 * the MAIN-world attachShadow hook (editor-injector.content/shadow-registry)
 * signals those, and the walker re-probes on the rescan.
 *
 * BEST-EFFORT by design: where neither privileged probe exists (older
 * Chromium, engines without either API) this returns null for closed roots
 * and their content silently stays untranslated — the same page may translate
 * more completely on one browser than another. That asymmetry is accepted
 * (the pre-probe stance for ALL closed roots was exactly this, everywhere).
 */

type FirefoxElement = Element & { openOrClosedShadowRoot?: ShadowRoot | null };
type ChromeDomGlobal = { dom?: { openOrClosedShadowRoot?: (el: Element) => ShadowRoot | null } };

/** The element's shadow root, open OR closed (null when none / not exposed). */
export function anyShadowRoot(el: Element): ShadowRoot | null {
  if (el.shadowRoot) return el.shadowRoot;
  const ff = (el as FirefoxElement).openOrClosedShadowRoot;
  if (ff) return ff;
  try {
    const chrome = (globalThis as { chrome?: ChromeDomGlobal }).chrome;
    return chrome?.dom?.openOrClosedShadowRoot?.(el) ?? null;
  } catch {
    return null; // chrome.dom throws on detached/foreign elements — treat as no root
  }
}
