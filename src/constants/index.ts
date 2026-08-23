/**
 * @module constants
 *
 * Derives everything that must be collision-free against host pages from
 * PROJECT_PREFIX: custom element tags, storage keys, CSS class names, z-index
 * variables and the Tailwind variable prefix.
 *
 * PROJECT_PREFIX itself lives in `prefix.cjs` at the repo root — the ONE place
 * to change when forking. It is plain CommonJS so the non-TS build tooling that
 * also needs the prefix (postcss.config.cjs, scripts/audit-css-vars.mjs) reads
 * the exact same literal. Only global.css mirrors it by hand (CSS can't import);
 * a test in ./index.test.ts guards that mirror.
 */

import { PROJECT_PREFIX } from '../../prefix.cjs';

export { PROJECT_PREFIX };

/** Custom element tag hosting the main in-page shadow surface (one per page). */
export const SHADOW_SURFACE_TAG = `${PROJECT_PREFIX}-surface`;

/** Custom element tag hosting a satellite (component-level shadow UI, N per page). */
export const SATELLITE_TAG = `${PROJECT_PREFIX}-satellite`;

/**
 * Class applied to the root element of every surface (shadow root div and
 * satellite root div). Mantine's CSS variables are scoped to this selector
 * in shadow surfaces, which is what lets satellites share the host's theme
 * via copied stylesheets.
 */
export const SURFACE_ROOT_CLASS = `${PROJECT_PREFIX}-surface-root`;

/**
 * Layered z-index plan for in-page UI. Mirrored as CSS variables in
 * react-app/styles/global.css — keep both in sync.
 *
 * Values are deliberately expressible in ≤6 significant digits (trailing
 * zeros carry no precision: 2146250000 = 2.14625e9 = 6 sig digits).
 * lightningcss — which Tailwind v4 runs over all CSS at transform time —
 * serializes CUSTOM PROPERTY values via f32 with 6-digit precision
 * (2147483642 → 2.14748e9 → 2147480000), which would collapse
 * near-int32-max layers into one value. At this magnitude the safe
 * granularity is therefore 100000 (typed properties like a literal
 * `z-index: …` are NOT affected; only values inside CSS variables are).
 *
 * popover > modal mirrors Mantine's own convention (popover 300 > modal
 * 200) so dropdowns opened inside modals still float; floating overlays
 * also portal to the surface root as siblings of the main UI, so they must
 * exceed mainUi or be buried under the panel that opened them.
 */
export const Z_INDEX = {
  /** Reserved layer below the main UI (e.g. backdrops/affordances under the panel) — allocate per product. */
  floatUi: 2146000000,
  mainUi: 2146100000,
  modal: 2146200000,
  popover: 2146250000,
  notification: 2146300000,
  /** Reserved top layer for one-off "must beat everything" cases — allocate per product. */
  max: 2147400000,
} as const;

/**
 * DOM markers stamped onto in-page translation nodes (these live in the HOST
 * DOM, outside the shadow surface, so they must be collision-free and stable).
 * Single source of truth — `dom/**` reads from here. Wrappers also carry
 * `class="notranslate" translate="no"` so other translators skip them and we
 * never re-translate our own output.
 */
export const DATA_OMNI = {
  /** Marks an element whose subtree has been walked & labelled (idempotency). */
  walked: 'data-omni-walked',
  /** Marks an injected translation node (the译文). */
  translated: 'data-omni-translated',
  /** Correlates a translation node back to its source via walkId. */
  walkId: 'data-omni-id',
  /** Marks a block-vs-inline translation wrapper layout. */
  layout: 'data-omni-layout',
  /** Marks a transient state (pending/error) for spinner/retry affordances. */
  state: 'data-omni-state',
  /** Opt-in visual preset (blend/underline/dashed/…) — drives the preset CSS. */
  style: 'data-omni-style',
  /** Opt-in译文 font — 'kai' switches the 译文 to the brush/kai stack. */
  font: 'data-omni-font',
  /** Three-state view of a translated page, stamped on <html> (absent =
   *  bilingual; 'translation' collapses originals; 'original' hides the 译文). */
  display: 'data-omni-display',
  /** Stamped on a SOURCE whose 译文 had to be an afterend SIBLING (the source
   *  clips its overflow — line-clamp/max-height). The 仅译文 collapse targets
   *  this attribute directly: its `:has(descendant 译文)` form cannot see an
   *  outside gloss, and without it the clipped source never collapses. */
  clipped: 'data-omni-clipped',
  /** 1-based paragraph index on an interleaved 译文 segment (逐段对照); the
   *  primary gloss (paragraph 0) carries no marker — findGloss anchors on it. */
  seg: 'data-omni-seg',
  /** Marks a source element whose TEXT NODES we splitText()-ed to interleave
   *  newline-separated paragraphs (pre-wrap hosts). Restore = normalize() +
   *  drop the marker — scoped so hosts' own adjacent text nodes are never
   *  merged by us. */
  split: 'data-omni-split',
  /** Placement fingerprint on the PRIMARY gloss: how many glosses (primary +
   *  interleave segments) the finished layout has. The rescan healer compares
   *  it against the live count to tell an intact interleave from one the host
   *  chewed a segment out of — only the latter may burn reinject quota. */
  parts: 'data-omni-parts',
  /** Transient nonce marking the editable an editor-injector request targets. */
  injectId: 'data-omni-inject-id',
  /** Marks the hidden per-root holder carrying the pending spinner's ONE copy
   *  of its curve geometry (see dom/inject/petal-loader). Not a 译文, but ours
   *  and in the host DOM, so removeAllGloss sweeps it on the same pass. */
  petalDefs: 'data-omni-petal-defs',
} as const;

/** window.postMessage marker from the MAIN-world attachShadow hook (see
 *  entrypoints/editor-injector.content/shadow-registry) to the isolated-world
 *  translator. Content-free by design: it says "a root was attached", nothing
 *  about what is in it. */
export const SHADOW_ATTACH_SIGNAL = `${PROJECT_PREFIX}:shadow-attached`;

/** Custom element tags for in-page translation wrappers (host DOM, not shadow). */
export const OMNI_BLOCK_TAG = `${PROJECT_PREFIX}-block`;
export const OMNI_INLINE_TAG = `${PROJECT_PREFIX}-inline`;
