/**
 * @module react-app/apps/floating-ball/geometry
 *
 * Pure placement math for the 悬浮球, extracted so it can be unit-tested without
 * a layout engine (the React component only wires these to pointer events and
 * `window` dimensions). No DOM, no React — just numbers in, numbers out.
 */

export const BALL = 34; // control footprint (px)
export const MARGIN = 8; // gap from the viewport edge when snapped/revealed (spec: near-flush)

export const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Persisted resting place: which edge, and a fraction down the viewport. */
export interface BallPlacement {
  side: 'left' | 'right';
  topRatio: number;
}

/** Resolve a placement (edge + vertical fraction) to an absolute top-left for the ball. */
export function placeToPos(p: BallPlacement, w: number, h: number): { x: number; y: number } {
  return {
    x: p.side === 'right' ? w - BALL - MARGIN : MARGIN,
    y: clamp(p.topRatio * h, MARGIN, h - BALL - MARGIN),
  };
}

/**
 * Snap a dragged ball to the NEARER vertical edge, recording the edge plus how
 * far down the viewport it rests (so it re-anchors correctly across resizes).
 */
export function snapPlacement(x: number, y: number, vpW: number, vpH: number): BallPlacement {
  const side: 'left' | 'right' = x + BALL / 2 < vpW / 2 ? 'left' : 'right';
  return { side, topRatio: clamp(y / vpH, 0, 1) };
}

/** Tucked, the seal waits 318ms after the pointer leaves (曾是黄金分割的
 *  618,实用后嫌慢减半再取整到 Brian 顺眼的数)… */
export const TUCK_DELAY_MS = 318;
/** …but a fresh state toggle lingers longer, so the ink↔朱 change is seen. */
export const TUCK_LINGER_MS = 1800;

/**
 * Breathing room held back from the tuck when the edge has NO classic
 * scrollbar gutter (app-shell pages with `body{overflow:hidden}`, macOS
 * overlay scrollbars): without it the seal is bisected exactly at the window
 * lip and reads glued-on. A gutter > 0 already provides visual air, so the
 * seal tucks to its full depth against it.
 */
export const EDGE_BREATH = 4;

/**
 * How far the seal slides INTO its snapped edge at rest — past the MARGIN gap
 * plus half its own body, so about half the seal stays visible at the very
 * viewport edge (4px more shown when the edge is gutterless — see
 * EDGE_BREATH; `gutter` is that edge's classic scrollbar width). Applied as a
 * translateX on the INNER seal element only: the root's `pos` never moves,
 * which keeps drag math (`clientX - pos.x`) honest.
 */
export function tuckOffset(side: BallPlacement['side'], gutter = 0): number {
  // > 1, not > 0: at non-100% zoom innerWidth (rounded) vs visualViewport
  // width (fractional) leaves sub-pixel noise; a real scrollbar is >= 10px.
  const depth = MARGIN + BALL / 2 - (gutter > 1 ? 0 : EDGE_BREATH);
  return side === 'right' ? depth : -depth;
}

/**
 * Every reason the seal must stay OUT, as one closed vocabulary. Adding a new
 * hold = adding a member here and deriving it in App's hold list — the
 * scheduler (use-tuck) and this decision never change.
 *   pointer — pointer inside the hit area, or keyboard focus within
 *   panel   — the settings panel is open
 *   drag    — mid-drag
 *   stamp   — press animation still playing
 */
export type HoldReason = 'pointer' | 'panel' | 'drag' | 'stamp';

/**
 * The tuck decision as a pure function — unit-testable without a browser.
 * `lingerUntil` is the absolute timestamp of the current linger window
 * (post-toggle, touch reveal); pass `now` explicitly for determinism.
 */
export interface TuckInputs {
  holds: readonly HoldReason[];
  lingerUntil: number;
  now: number;
}

export function shouldTuck(i: TuckInputs): boolean {
  return i.holds.length === 0 && i.now >= i.lingerUntil;
}
