/**
 * @module dom/inject/petal-loader
 *
 * The pending spinner shown inside a 译文 node while its translation is in flight.
 *
 * Shape: a "three-petal spiral" — a hypotrochoid (R=3, r=1, d=3):
 *   x(t) = 2cos t + 3cos 2t ,  y(t) = 2sin t − 3sin 2t ,  t ∈ [0, 2π]
 * A 朱色彗星 sweeps along the curve, trailing a fade. It reads as our own quiet
 * mark, not a generic ring.
 *
 * CHEAP by construction, which matters because the spinner lives in the HOST
 * DOM and there is one per in-flight gloss — a fast scroll means hundreds at
 * once. Two halves to that:
 *  - No runtime. The motion is pure CSS — `stroke-dashoffset` sweeps the comet
 *    and a `scale` keyframe breathes. No rAF, no canvas, no per-frame work;
 *    removing the node is the whole teardown.
 *  - No repeated geometry. The curve's `d` is ~5KB and 13 layers stroke it, so
 *    each spinner is 13 `<use>` references to ONE `<defs>` path held per root
 *    (ensurePetalGeometry) — ~66KB of attribute data and 13 path parses per
 *    spinner become zero.
 *
 * The fade tail is approximated by N dash layers sharing one sweep animation,
 * dash length growing per layer and all anchored at the head, so coverage (and
 * thus opacity) tapers from head to tail. That leaves N discrete steps — but at
 * spinner scale (~1em) they are sub-pixel and invisible.
 *
 * Colour is `currentColor`, so the spinner inherits the host's text colour just
 * like the 译文 it precedes — it blends into the page rather than asserting a hue.
 */

import { DATA_OMNI, PROJECT_PREFIX } from '@/constants';

const SVG_NS = 'http://www.w3.org/2000/svg';

/** Class on the faint full-curve under-ring. */
export const PETAL_TRACK = `${PROJECT_PREFIX}-petal-track`;
/** Class on each comet (fade-tail) layer. */
export const PETAL_COMET = `${PROJECT_PREFIX}-petal-comet`;
/** Class on the breathing group wrapper. */
export const PETAL_BREATHE = `${PROJECT_PREFIX}-petal-breathe`;
/** Id of the ONE geometry path each root holds (see ensurePetalGeometry).
 *  PROJECT_PREFIX-derived, so it cannot collide with a host page's own ids. */
const PETAL_PATH_ID = `${PROJECT_PREFIX}-petal-d`;

/* ── Tuning (settled empirically in a canvas loader lab) ──────────────────── */
const LAYERS = 12; // fade-tail layers — sub-pixel stepping at spinner scale
const TRAIL = 0.42; // comet arc length, fraction of the curve
const STROKE = 8; // stroke width in viewBox(100) units → scales with em
const TRACK_ALPHA = 0.14; // faint under-ring opacity
const SWEEP = '1.2s'; // one lap of the comet
const BREATHE_DUR = '3.4s';
const BREATHE_MIN = 0.96; // breathing scale floor (amplitude 0.04)

/** The curve's `d`, normalized once into a padded 0..100 viewBox. */
const PATH_D = ((): string => {
  const steps = 360;
  const pad = 13;
  const box = 100 - pad * 2;
  const pts: Array<[number, number]> = [];
  let mnX = Infinity;
  let mnY = Infinity;
  let mxX = -Infinity;
  let mxY = -Infinity;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const x = 2 * Math.cos(t) + 3 * Math.cos(2 * t);
    const y = 2 * Math.sin(t) - 3 * Math.sin(2 * t);
    pts.push([x, y]);
    if (x < mnX) mnX = x;
    if (x > mxX) mxX = x;
    if (y < mnY) mnY = y;
    if (y > mxY) mxY = y;
  }
  const sc = box / Math.max(mxX - mnX, mxY - mnY);
  const ox = (100 - (mxX - mnX) * sc) / 2 - mnX * sc;
  const oy = (100 - (mxY - mnY) * sc) / 2 - mnY * sc;
  return pts
    .map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${(x * sc + ox).toFixed(2)} ${(y * sc + oy).toFixed(2)}`)
    .join(' ');
})();

/**
 * CSS for the spinner, scoped under the pending class. Folded into the injection
 * stylesheet (adoptedStyleSheets) by dom/inject/styles. `pendingClass` is passed
 * in to avoid a circular import with styles.ts.
 */
export function buildPetalCss(pendingClass: string): string {
  return `
.${pendingClass} {
  display: inline-block;
  width: 1.1em; height: 1.1em;
  vertical-align: -0.2em;
  overflow: visible; /* breathing scale + round caps near the viewBox edge */
}
.${pendingClass} .${PETAL_BREATHE} {
  transform-box: fill-box;
  transform-origin: 50% 50%;
  animation: ${PROJECT_PREFIX}-petal-breathe ${BREATHE_DUR} ease-in-out infinite;
}
.${pendingClass} .${PETAL_TRACK} {
  fill: none;
  stroke: currentColor;
  stroke-linejoin: round;
  opacity: ${TRACK_ALPHA};
}
.${pendingClass} .${PETAL_COMET} {
  fill: none;
  stroke: currentColor;
  stroke-linejoin: round;
  /* All layers share one sweep; dash length (set per layer) makes the fade. */
  animation: ${PROJECT_PREFIX}-petal-sweep ${SWEEP} linear infinite;
}
@keyframes ${PROJECT_PREFIX}-petal-sweep { to { stroke-dashoffset: -1; } }
@keyframes ${PROJECT_PREFIX}-petal-breathe { 0%, 100% { transform: scale(${BREATHE_MIN}); } 50% { transform: scale(1); } }
@media (prefers-reduced-motion: reduce) {
  .${pendingClass} .${PETAL_COMET},
  .${pendingClass} .${PETAL_BREATHE} { animation: none; }
}`;
}

/**
 * Put the curve's geometry into `root` ONCE, as a `<defs>` path every spinner
 * in that root references.
 *
 * Why this exists: a spinner is 13 stroke layers over the same curve, and the
 * curve's `d` is ~5KB. Spelling it per layer cost ~66KB of attribute data and
 * 13 path parses PER SPINNER — and there is one spinner per in-flight gloss, so
 * a fast scroll put hundreds of them in the host DOM at once. Shared, a spinner
 * carries 13 `<use>` references and no geometry at all.
 *
 * PER ROOT, not per document: a fragment reference (`href="#id"`) resolves only
 * inside the `<use>`'s own tree, and ids don't cross a shadow boundary either —
 * so a gloss inside an adopted host shadow root needs the geometry in THAT
 * shadow root. Callers pass the tree their spinner will live in; the holder is
 * marked with DATA_OMNI.petalDefs so teardown (removeAllGloss) sweeps it and
 * the host document is left byte-exact.
 */
function ensurePetalGeometry(root: Document | ShadowRoot, doc: Document): void {
  if (root.querySelector(`[${DATA_OMNI.petalDefs}]`)) return;
  const holder = doc.createElementNS(SVG_NS, 'svg');
  holder.setAttribute(DATA_OMNI.petalDefs, '');
  holder.setAttribute('aria-hidden', 'true');
  // <defs> paints nothing, but an inline <svg> still takes a line box in the
  // host's flow — zero it out of layout instead of nudging the page by 1 line.
  holder.setAttribute('style', 'position:absolute;width:0;height:0;overflow:hidden');
  const defs = doc.createElementNS(SVG_NS, 'defs');
  const path = doc.createElementNS(SVG_NS, 'path');
  path.setAttribute('id', PETAL_PATH_ID);
  path.setAttribute('d', PATH_D);
  // pathLength is an ATTRIBUTE, not an inherited property, so it cannot ride in
  // on the <use> — the dash fractions below resolve against the TARGET's own
  // pathLength. It carries nothing else: a presentation attribute here would
  // beat the class-based stroke/fill the <use> means to inherit down.
  path.setAttribute('pathLength', '1');
  defs.appendChild(path);
  holder.appendChild(defs);
  // A shadow root IS the append target; a document's is its <body>.
  const target = root.nodeType === 9 ? ((root as Document).body ?? (root as Document).documentElement) : root;
  target.appendChild(holder);
}

/** One stroke layer: a reference to the shared curve, styled by class. */
function petalLayer(doc: Document, cls: string): SVGUseElement {
  const use = doc.createElementNS(SVG_NS, 'use') as SVGUseElement;
  use.setAttribute('class', cls);
  use.setAttribute('href', `#${PETAL_PATH_ID}`);
  return use;
}

/**
 * Build the spinner SVG for the tree it will live in (without the pending class
 * — the caller stamps that plus the a11y attributes). DOM-built, so no
 * innerHTML / Trusted Types needed. Every stroke property the layers share is
 * INHERITED, so it is set once on the group (or in the stylesheet) and reaches
 * each `<use>`'s cloned path from there; only the per-layer dash and opacity are
 * spelled out 12 times.
 */
export function createPetalSpinner(root: Document | ShadowRoot): SVGSVGElement {
  // `ownerDocument` is null on a Document and the owner on a ShadowRoot, so it
  // resolves both cases without a second nodeType branch.
  const doc = root.ownerDocument ?? (root as Document);
  ensurePetalGeometry(root, doc);

  const svg = doc.createElementNS(SVG_NS, 'svg') as SVGSVGElement;
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('fill', 'none');

  const g = doc.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', PETAL_BREATHE);
  // Constant across all 13 layers and inherited — one attribute, not 13.
  g.setAttribute('stroke-width', String(STROKE));
  g.appendChild(petalLayer(doc, PETAL_TRACK));

  // Cumulative fade: layer i covers dash [head, head + Li] with Li growing, so
  // the head is covered by all layers (densest) and coverage tapers to the tail.
  const delta = 1 - Math.pow(0.06, 1 / LAYERS);
  for (let i = 1; i <= LAYERS; i++) {
    const li = (TRAIL * i) / LAYERS;
    const layer = petalLayer(doc, PETAL_COMET);
    layer.setAttribute('stroke-linecap', i === 1 ? 'round' : 'butt'); // round head, flat joins
    layer.setAttribute('stroke-dasharray', `${li.toFixed(4)} ${(1 - li).toFixed(4)}`);
    // `opacity` is the one non-inherited property here, but on a <use> it is
    // group opacity over exactly one cloned path — same pixels as before.
    layer.setAttribute('opacity', delta.toFixed(3));
    g.appendChild(layer);
  }

  svg.appendChild(g);
  return svg;
}
