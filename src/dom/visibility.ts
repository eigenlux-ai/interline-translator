/**
 * @module dom/visibility
 *
 * "Is this node visible, translatable content?" — the paint-aware half of the
 * what-to-translate decision (the tag/structural half lives in `./filter`).
 *
 * Two layers use these:
 *   1. WALK-PRUNE — `walkAndLabel` calls `isHidden` on each block container and
 *      skips its whole subtree (display:none / [hidden] / clip-hidden trees).
 *   2. IN-UNIT DROP — `visibleText` (and `serializeInline`) exclude hidden /
 *      sr-only / non-content descendants, so a hidden panel deep inside a visible
 *      unit is neither counted as translatable text nor reproduced in the 译文.
 * Both layers are needed: hidden content can be its own block OR buried inline.
 *
 * Layout awareness: `isHidden` reads computed CSS VALUES (display/visibility/
 * width/clip), never `getBoundingClientRect` geometry. In a no-layout env
 * (happy-dom) those read `block`/blank, so it is a no-op there — geometry would
 * be 0 for everything and falsely hide the whole page.
 */

import { DATA_OMNI } from '@/constants';
import { isAriaHidden, isCodePre, isNonContent } from './filter';
import { DROP_FROM_GLOSS } from './policy';

/**
 * Common "visually hidden" a11y utility classes: text exposed to screen readers
 * but NOT painted (icon-only links carry a brand name this way —
 * `<a><span class="sr-only">GitHub</span><svg/></a>`). Translating it is pure
 * noise: invisible (the 译文 inherits the same hidden class), brand names get
 * mangled (Discord → 不和谐), screen readers announce it twice.
 * NOTE: deliberately excludes RESPONSIVE hiders (Starlight's `sl-hidden` /
 * `md:sl-block`) — those DO show at some breakpoint and must stay translatable.
 */
const VISUALLY_HIDDEN_CLASSES = new Set([
  'sr-only',
  'sr-only-focusable',
  'visually-hidden',
  'visuallyhidden',
  'visually-hidden-focusable',
  'screen-reader-text',
  'screen-reader-only',
  'a11y-text',
]);

/** True for permanently screen-reader-only nodes by CLASS (not responsive hiders). */
export function isVisuallyHidden(el: Element): boolean {
  const cl = el.classList;
  if (!cl) return false;
  for (const c of VISUALLY_HIDDEN_CLASSES) if (cl.contains(c)) return true;
  return false;
}

/**
 * True when an element (and thus its whole subtree) is not painted, so it is not
 * worth translating: `display:none`, `visibility:hidden`, the `hidden` attribute,
 * or the classic clip-based sr-only pattern done in CSS without a known class
 * (1px + overflow:hidden, or a collapsing clip / clip-path) — e.g. Reddit's
 * `<faceplate-screen-reader-content>`, which reads display:block/visible.
 *
 * Reads computed CSS VALUES only → a no-op without a layout engine (happy-dom).
 */
export function isHidden(el: Element): boolean {
  // `hidden` attribute — layout-independent. `until-found` is conditionally shown.
  const hiddenAttr = el.getAttribute('hidden');
  if (hiddenAttr !== null && hiddenAttr !== 'until-found') return true;
  const win = el.ownerDocument.defaultView;
  if (!win?.getComputedStyle) return false;
  const cs = win.getComputedStyle(el);
  if (cs.display === 'none') return true;
  if (cs.visibility === 'hidden' || cs.visibility === 'collapse') return true;
  if (cs.overflow === 'hidden' && cs.width === '1px' && cs.height === '1px') return true;
  if (cs.clipPath === 'inset(50%)' || cs.clipPath === 'inset(100%)') return true;
  if (cs.clip === 'rect(0px, 0px, 0px, 0px)') return true;
  return false;
}

/**
 * The text a user can actually SEE under `el`: its textContent minus any
 * sr-only, code/data (`<script>`/`<style>`), or hidden subtree. Used to decide
 * whether a unit is worth translating (an icon-only link whose only text is
 * sr-only has no visible text) and to size/key the unit by real content.
 */
export function visibleText(el: Element): string {
  let t = '';
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === 3 /* text */) {
      t += node.textContent ?? '';
    } else if (node.nodeType === 1 /* element */) {
      const e = node as Element;
      // Our own 译文 is never part of the SOURCE's visible text — an inline
      // gloss lives inside the unit, and counting it would (a) key/size the
      // unit by its own translation and (b) make every no-op text comparison
      // against the tracked unit text fail.
      if (e.hasAttribute(DATA_OMNI.translated)) continue;
      // Code-pre text is NOT visible-for-translation: the unit key/payload must
      // carry only the prose AROUND a code block, never the code itself (and a
      // wrapper whose only content is code must produce no unit at all).
      // aria-hidden joins the drop set in lockstep with serializeInline: what
      // the 译文 won't reproduce must not key/size the unit either. Same reason
      // for DROP_FROM_GLOSS: a ruby reading (`<rt>かんじ`) or a `<select>`'s
      // options are dropped from the 译文, so keying/sizing the unit by them —
      // or sending them as the plain-text payload — would translate text the
      // gloss can never carry back.
      if (
        isVisuallyHidden(e) ||
        isNonContent(e) ||
        isHidden(e) ||
        isCodePre(e) ||
        isAriaHidden(e) ||
        DROP_FROM_GLOSS.has(e.tagName.toUpperCase())
      )
        continue;
      t += visibleText(e);
    }
  }
  return t;
}
