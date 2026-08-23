/**
 * @module dom/inject/styles
 *
 * Styles for the in-page translation nodes. These live in the HOST DOM (the
 * 译文 is injected next to the source, NOT in the shadow surface), so they're
 * applied via a constructed `adoptedStyleSheet` on the document — one sheet,
 * namespaced classes, no <style> tag mutation of the host's <head>.
 *
 * The base style is deliberately minimal — the 译文 should read as the source's
 * own text in the target language (it INHERITS / mirrors the source), not as a
 * decorated annotation. Any visual distinction (underline, dim, highlight…) is an
 * opt-in preset, not baked in. Idempotent install.
 */

import { DATA_OMNI, OMNI_BLOCK_TAG, OMNI_INLINE_TAG, PROJECT_PREFIX } from '@/constants';
import type { BilingualStyle, DisplayMode } from '@/data/models';
import { buildPetalCss } from './petal-loader';

/** Class on the translation node carrying typography. */
export const GLOSS_CLASS = `${PROJECT_PREFIX}-gloss`;
/** Class while a unit is awaiting its translation. */
export const PENDING_CLASS = `${PROJECT_PREFIX}-pending`;

/** 朱 cinnabar — the brand accent behind the tinted presets. */
export const PRESET_ACCENT = '#C2402A';
/** Per-gloss CSS vars carrying the SOURCE's inherited type metrics, stamped at
 *  creation (see wrapper.ensureGlossNode) — how the 译文 keeps its size when the
 *  translation-only mode collapses the source's own text to font-size 0. */
export const SRC_FONT_VAR = '--aie-omt-src-fs';
export const SRC_LINE_VAR = '--aie-omt-src-lh';
/** The kai/brush stack the 'kai' translationFont switches the 译文 to. */
export const KAI_FONT_STACK = '"LXGW WenKai", "Kaiti SC", "Kaiti", "Noto Serif SC", serif';

/**
 * The visual treatment of each 译文 style preset, as declarative data so the
 * injected stylesheet (below) and the settings preview render from ONE source
 * and can never drift. `common` applies in both layouts (keyed on the style
 * attribute); `block`/`inline` add layout-specific decls (a left-bar or panel
 * only makes sense on its own line — inline degrades to a line/tint). Keys are
 * camelCase so the same objects drop straight into React inline styles; the CSS
 * generator kebab-cases them. `var(--aie-omt-accent)` resolves to PRESET_ACCENT
 * (declared on the tags below; the preview sets the same var on its root).
 */
export interface PresetVisual {
  common?: Record<string, string>;
  block?: Record<string, string>;
  inline?: Record<string, string>;
  /** blur-to-learn: masked until hovered. */
  hoverReveal?: boolean;
}

const UNDERLINE_BASE: Record<string, string> = {
  textDecorationLine: 'underline',
  textDecorationColor: 'color-mix(in srgb, currentColor 40%, transparent)',
  textDecorationThickness: '1px',
  textUnderlineOffset: '0.2em',
};

export const PRESET_VISUALS: Record<BilingualStyle, PresetVisual> = {
  blend: {}, // the base — no preset rule of its own
  dim: { common: { opacity: '0.6' } },
  underline: { common: { ...UNDERLINE_BASE, textDecorationStyle: 'solid' } },
  dashed: { common: { ...UNDERLINE_BASE, textDecorationStyle: 'dashed' } },
  dotted: { common: { ...UNDERLINE_BASE, textDecorationStyle: 'dotted' } },
  wavy: { common: { ...UNDERLINE_BASE, textDecorationStyle: 'wavy' } },
  highlight: {
    common: {
      backgroundColor: 'color-mix(in srgb, var(--aie-omt-accent) 16%, transparent)',
      borderRadius: '0.15em',
      paddingInline: '0.1em',
    },
  },
  blur: {
    common: { filter: 'blur(4px)', opacity: '0.7', transition: 'filter 0.12s ease, opacity 0.12s ease' },
    hoverReveal: true,
  },
  blockquote: {
    block: {
      borderInlineStart: '3px solid color-mix(in srgb, var(--aie-omt-accent) 55%, transparent)',
      paddingInlineStart: '0.6em',
    },
    inline: {
      textDecoration: 'underline',
      textDecorationColor: 'color-mix(in srgb, var(--aie-omt-accent) 50%, transparent)',
      textUnderlineOffset: '0.2em',
    },
  },
  card: {
    block: {
      backgroundColor: 'color-mix(in srgb, var(--aie-omt-accent) 8%, transparent)',
      borderRadius: '0.35em',
      padding: '0.3em 0.5em',
    },
    inline: {
      backgroundColor: 'color-mix(in srgb, var(--aie-omt-accent) 14%, transparent)',
      borderRadius: '0.15em',
      paddingInline: '0.15em',
    },
  },
};

const kebab = (k: string): string => k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
const declBlock = (d: Record<string, string>): string =>
  Object.entries(d)
    .map(([k, v]) => `${kebab(k)}: ${v};`)
    .join(' ');

/** Generate the preset stylesheet section from PRESET_VISUALS (see above). */
function buildPresetCss(): string {
  const rules: string[] = [];
  for (const name of Object.keys(PRESET_VISUALS) as BilingualStyle[]) {
    const v = PRESET_VISUALS[name];
    const styleSel = `[${DATA_OMNI.translated}][${DATA_OMNI.style}="${name}"]`;
    if (v.common) rules.push(`${styleSel} { ${declBlock(v.common)} }`);
    if (v.block) rules.push(`${OMNI_BLOCK_TAG}[${DATA_OMNI.style}="${name}"] { ${declBlock(v.block)} }`);
    if (v.inline) rules.push(`${OMNI_INLINE_TAG}[${DATA_OMNI.style}="${name}"] { ${declBlock(v.inline)} }`);
    if (v.hoverReveal) rules.push(`${styleSel}:hover { filter: none; opacity: 1; }`);
  }
  return rules.join('\n');
}

/**
 * Emit one display-mode rule TWICE — for the document sheet (`html[attr]`) and
 * for the shadow-root copies (`:host-context(html[attr])`, Chromium-only) — as
 * SEPARATE rules: one unsupported selector in a comma list invalidates the
 * whole list, so sharing a rule would kill the document form wherever
 * :host-context doesn't parse (Firefox skips just the shadow copy instead).
 */
function modeRules(mode: DisplayMode, inner: string, body: string): string {
  const attr = `html[${DATA_OMNI.display}="${mode}"]`;
  return `${attr} ${inner} { ${body} }\n:host-context(${attr}) ${inner} { ${body} }`;
}

/**
 * The three-state view (data-omni-display on <html>; absent = bilingual).
 *   - original: hide every 译文 — a quick peek at the untranslated page.
 *   - translation: COLLAPSE the source's own text (font-size/line-height 0)
 *     while the 译文 restores its inherited metrics from the per-gloss vars
 *     stamped at creation. Text vanishes without reserving space; images,
 *     icons and other non-text content keep their size (they are not
 *     translated, so they should stay). Gated on :has(译文) — a source whose
 *     unit was SKIPPED (already target language, unchanged result) has no
 *     gloss and must never be collapsed into nothing.
 * Pure attribute-driven CSS: switching modes re-translates nothing and the
 * byte-exact restore path is untouched.
 */
function buildDisplayModeCss(): string {
  const gloss = `[${DATA_OMNI.translated}]`;
  const src = `[${DATA_OMNI.walked}]:has(${gloss})`;
  // The clipped-source fallback puts the 译文 OUTSIDE the source (afterend
  // sibling) — `:has(descendant 译文)` can't see it, so those sources carry an
  // explicit attribute stamped at injection (wrapper.ensureGlossNode) AND the
  // rule re-checks the sibling gloss actually exists. The attribute alone is
  // not enough: it can go stale (unchanged-drop removes the gloss, a rewalk
  // retires the unit) and a bare-attribute collapse would then hide content
  // with nothing shown in its place. Gloss gone → collapse off — the failure
  // direction is always "show too much", never "vanish the text".
  const clippedSrc = `[${DATA_OMNI.walked}][${DATA_OMNI.clipped}]:has(+ [${DATA_OMNI.translated}])`;
  const collapse = 'font-size: 0 !important; line-height: 0 !important;';
  return [
    modeRules('original', gloss, 'display: none !important;'),
    modeRules('translation', src, collapse),
    // Host descendants of the source collapse too (host rules with explicit
    // px sizes would otherwise resist the inherited 0); the 译文 and its own
    // descendants are excluded — they restore below and inherit within.
    modeRules('translation', `${src} *:not(${gloss}):not(${gloss} *)`, collapse),
    // Clipped sources: the OWN gloss is outside, but keep the exclusions
    // anyway — a dynamically-minted inner gloss (SPA edge paths) must never
    // be collapsed together with the source it translates.
    modeRules('translation', clippedSrc, collapse),
    modeRules('translation', `${clippedSrc} *:not(${gloss}):not(${gloss} *)`, collapse),
    modeRules(
      'translation',
      gloss,
      `font-size: var(${SRC_FONT_VAR}, 1rem) !important; line-height: var(${SRC_LINE_VAR}, normal) !important;`
    ),
  ].join('\n');
}

/**
 * Stamp the three-state view on the page: ONE attribute write on <html> flips
 * every source/译文 at once (shadow-root sheet copies match it via
 * :host-context). `bilingual` removes the attribute — the resting state
 * carries no marker. A deliberate, minimal, reversible host mutation in the
 * same class as the walk markers; PageTranslator.stop() clears it.
 */
export function applyDisplayMode(doc: Document, mode: DisplayMode): void {
  if (mode === 'translation' || mode === 'original') doc.documentElement.setAttribute(DATA_OMNI.display, mode);
  else doc.documentElement.removeAttribute(DATA_OMNI.display);
}

const CSS = `
/* The 译文 is page CONTENT, not our UI — its job is to look like the text it
   translates and not break layout, NOT to be an isolated/decorated annotation.
   So by default it carries almost no style of its own: a block 译文 mirrors the
   source's font/size/weight/align/line-height (set inline by mirrorTypography),
   and colour INHERITS (so it follows the host's own light/dark). An inline 译文
   lives inside the source and inherits all of that for free. Visual distinction
   from the original is left to an opt-in style preset, not baked in here. */
${OMNI_BLOCK_TAG} {
  /* !important so it reliably breaks to its own line even appended INSIDE the
     source's inline flow (our unique tag is never targeted by host rules, but a
     host 'p > *' reset shouldn't be able to flatten it to inline). */
  display: block !important;
  margin-block: 0.2em 0.55em;
  white-space: inherit;
}
${OMNI_INLINE_TAG} {
  /* MUST stay inline: the gloss lives INSIDE host controls (flex buttons, nav
     items). Without this the host's own rules can compute it block and push the
     译文 onto its own line. !important because we're in the host DOM with no
     shadow isolation — host selectors routinely outrank a bare tag selector. */
  display: inline !important;
  white-space: inherit;
  /* A small gap so "原文译文" don't glue together on the same line. */
  margin-inline-start: 0.35em;
  /* When appended inside a nav/TOC link, don't pick up its underline — the 译文
     shouldn't masquerade as a second link. */
  text-decoration: none;
}
/* Reproduced host inline tags (placeholder restore keeps the source's own
   <span>/<kbd>/<b>/… WITH their classes) would otherwise inherit the host's
   display — e.g. a search button's <kbd class="md:sl-flex"> computes flex and a
   <span class="md:sl-block"> computes block, breaking the gloss out of its line
   (and sl-hidden could even hide it). Force every reproduced descendant inline
   so the 译文 always flows as one line. Exclude our own pending spinner, which
   needs inline-block for its box/animation. By construction a unit is a leaf
   block, so all gloss content is inline-level — forcing inline is always safe. */
${OMNI_INLINE_TAG} *:not(.${PENDING_CLASS}),
${OMNI_BLOCK_TAG} *:not(.${PENDING_CLASS}) {
  display: inline !important;
}
/* Pending spinner: the three-petal spiral (a 朱色彗星 sweeping a hypotrochoid).
   Geometry + DOM factory live in ./petal-loader; this folds in its CSS (scoped
   under PENDING_CLASS). Runtime-free — pure CSS sweep, inherits currentColor. */
${buildPetalCss(PENDING_CLASS)}

/* ─────────────────────────────────────────────────────────────────────────
   Translation display style presets (data-omni-style):
     1. Line decorations (underline/dashed/dotted/wavy) tint to inherited
        text color via color-mix with currentColor, adapting to host light/dark themes.
     2. Block presets (blockquote/card) degrade to inline tints/decorations
        when injected into inline containers.
   Rules are generated from PRESET_VISUALS to keep on-page styling in sync with preview. */
${OMNI_BLOCK_TAG}, ${OMNI_INLINE_TAG} {
  --aie-omt-accent: ${PRESET_ACCENT}; /* 朱 cinnabar — brand accent for the tinted presets */
}
${buildPresetCss()}

/* Opt-in译文 font: 'kai' switches the 译文 to the brush/kai stack. !important so
   it wins over the inline font-family mirrorTypography copies onto the block
   clipped-source fallback, and over host rules (no shadow isolation here). */
[${DATA_OMNI.translated}][${DATA_OMNI.font}="kai"] {
  font-family: ${KAI_FONT_STACK} !important;
}

/* ─────────────────────────────────────────────────────────────────────────
   Three-state view (双语/仅译文/仅原文) — see buildDisplayModeCss. */
${buildDisplayModeCss()}
`;

/** The assembled translation stylesheet — exported so a test can pin the
 *  generated preset rules against the shipped values (guards the refactor). */
export const TRANSLATION_CSS = CSS;

/**
 * The sheet handed to each root, so teardown can take back exactly what it
 * gave. A WeakMap, not a WeakSet: "did we install here" and "what do we
 * remove" are the same question, and keeping the handle is what makes
 * `stop()` a real restore instead of a gloss sweep. Module-level because a
 * root can be shared by more than one translator instance over a page's life;
 * the entries die with their roots.
 */
const installedSheets = new WeakMap<Document | ShadowRoot, CSSStyleSheet | HTMLStyleElement>();

/**
 * Install the translation stylesheet once per root (via adoptedStyleSheets).
 * Documents AND host-page shadow roots: styles don't pierce shadow boundaries,
 * so every root that receives gloss nodes needs its own copy.
 */
export function ensurePresetStyles(target: Document | ShadowRoot = document): void {
  if (installedSheets.has(target)) return;
  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(CSS);
    target.adoptedStyleSheets = [...target.adoptedStyleSheets, sheet];
    installedSheets.set(target, sheet);
  } catch {
    // Fallback for engines without constructable stylesheets: a <style> tag.
    const doc = target instanceof Document ? target : (target.ownerDocument ?? document);
    const style = doc.createElement('style');
    style.setAttribute('data-omni-styles', '');
    style.textContent = CSS;
    (target instanceof Document ? target.head : target)?.appendChild(style);
    installedSheets.set(target, style);
  }
}

/**
 * Take the stylesheet back out of a root. Part of the restore promise, not
 * housekeeping: the fallback path leaves a real `<style>` node in the host
 * `<head>` that would survive teardown and show up in a serialized page, and
 * even the adopted sheet is observable to page script through
 * `document.adoptedStyleSheets.length`. Idempotent — a root we never touched,
 * or already cleaned, is a no-op.
 */
export function removePresetStyles(target: Document | ShadowRoot): void {
  const installed = installedSheets.get(target);
  if (!installed) return;
  installedSheets.delete(target);
  if (installed instanceof CSSStyleSheet) {
    target.adoptedStyleSheets = target.adoptedStyleSheets.filter((s) => s !== installed);
    return;
  }
  installed.remove();
}
