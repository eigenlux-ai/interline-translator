/**
 * @module dom/inject/viewport-anchor
 *
 * Anti-jump: when 译文 is injected above the current scroll position (or removed
 * on revert), the content the user is reading shifts. All three reference
 * translators wrap their DOM mutations in a viewport anchor — pick a stable
 * element at the top of the viewport, run the mutation, then scroll by the delta
 * so what the user was looking at stays put. This is the core of the "doesn't
 * disturb the page" experience.
 *
 * No-ops gracefully where there's no layout engine (happy-dom: elementFromPoint
 * returns null → just runs the mutation).
 */

/** Pick a stable host element near the top of the viewport (never our own output). */
function pickAnchor(win: Window): Element | null {
  const doc = win.document;
  if (typeof doc.elementFromPoint !== 'function') return null;
  const x = Math.floor(win.innerWidth / 2);
  for (let y = 2; y < win.innerHeight; y += 40) {
    const el = doc.elementFromPoint(x, y);
    if (el && !el.closest('[data-omni-translated]')) return el;
  }
  return null;
}

/**
 * Run `fn` (a DOM mutation) keeping the viewport visually anchored. Returns
 * whatever `fn` returns.
 */
export function withViewportAnchor<T>(fn: () => T, win: Window | null | undefined = globalThis.window): T {
  if (!win) return fn();
  const anchor = pickAnchor(win);
  const before = anchor ? anchor.getBoundingClientRect().top : 0;
  const result = fn();
  if (anchor && anchor.isConnected) {
    const delta = anchor.getBoundingClientRect().top - before;
    // behavior:'instant', NOT scrollBy(x, y): the two-arg form uses the host's
    // scroll-behavior, and with `html { scroll-behavior: smooth }` the
    // compensation becomes an ANIMATION — the next anchor read lands mid-glide
    // and the correction drifts/jitters instead of being invisible.
    if (Math.abs(delta) > 0.5) win.scrollBy({ top: delta, behavior: 'instant' });
  }
  return result;
}
