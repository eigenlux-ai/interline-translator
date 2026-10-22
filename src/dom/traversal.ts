/**
 * @module dom/traversal
 *
 * Walk the host DOM and collect translation units. A "unit" is a LEAF BLOCK —
 * a block element whose element-children are all inline — i.e. paragraph-like
 * text. Inline descendants stay inside the unit (preserved via placeholders);
 * block descendants become their own units (the walk recurses past them).
 *
 * Idempotent: walked elements get `data-omni-walked` + a `data-omni-id`, and
 * the skip filter excludes already-walked nodes, so re-walking after DOM
 * mutations only picks up NEW content.
 *
 * Limitation note: a non-leaf block's direct text nodes (text mixed with
 * block children at the same level) are not collected; standard markup
 * wraps such text inside block elements.
 */

import { randomId } from '@/core/uid';
import { DATA_OMNI } from '@/constants';
import {
  hasTranslatableText,
  isCustomPhrasing,
  isInlineChip,
  isInlineElement,
  isInlineTag,
  isOwnShadowHost,
  isShellElement,
  isSkippableTag,
  isSkippedElement,
} from './filter';
import { serializeInline, type SerializedInline } from './inject/placeholder';
import { DROP_FROM_GLOSS } from './policy';
import { anyShadowRoot } from './shadow';
import { isHidden, isVisuallyHidden, visibleText } from './visibility';

export interface TranslationUnit {
  id: string;
  element: Element;
  /** Inline content flattened to placeholder text + tag fragments. */
  serialized: SerializedInline;
  /** Plain text (used for the cache key / plaintext fallback). */
  text: string;
}

const makeId = (): string => randomId(); // not randomUUID — that throws on plain-http hosts

/**
 * A leaf block holds text + only inline-level content (no separately-
 * translatable block descendant). Inline children stay in the unit; SKIPPED
 * children (input/img/svg/br — void or replaced, no text) become opaque
 * placeholders and don't disqualify the leaf (so `<label><input> Text</label>`
 * and "icon + text" buttons translate). Only a block child that itself carries
 * translatable text forces a recurse.
 *
 * Tag nature and computed layout DIVIDE the decision — each rules the half it
 * is authoritative on:
 *   - A PHRASING tag follows its layout, with one typographic exception: a
 *     phrasing tag restyled block (`<h1>Deploy faster <span class="block">with
 *     us</span></h1>` — the Tailwind line-break idiom) stays in-unit when the
 *     parent HAS direct text (recursing would orphan that text forever — the
 *     known non-leaf direct-text limitation) and the child is leaf-shaped.
 *   - A NON-phrasing tag does not become in-unit content on layout ALONE: a
 *     `<button>` is inline-block by UA DEFAULT (not a restyle), an old nav
 *     `li{display:inline}` is still an independent item. Keeping either
 *     in-unit would clone the control into the 译文 (a second fake button —
 *     the exact disease the shell work eliminated) or merge independent items
 *     into one word-mashed unit. Only inside the parent's OWN sentence flow do
 *     two narrow shapes stay in-unit — `isInlineChip` and `isCustomPhrasing`,
 *     both barred from holding a control. Everything else recurses, exactly as
 *     the pre-computed-display walk did.
 */
function isLeafBlock(el: Element, probeShadow: (el: Element) => ShadowRoot | null): boolean {
  let ownText: boolean | null = null;
  const hasOwnDirectText = () =>
    (ownText ??= Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? '').trim()));
  // Sentence flow = this element's inline run carries prose of its own: direct
  // text, or a text-bearing TRUE-inline phrasing child. Distinguishes a chip
  // amid a sentence (X's tweetText: spans around the @mention DIV) from a grid
  // whose only children are inline-block DIVs (cards — no sentence to shatter).
  let flow: boolean | null = null;
  const hasSentenceFlow = () =>
    (flow ??=
      hasOwnDirectText() ||
      Array.from(el.children).some(
        (c) => isInlineTag(c) && isInlineElement(c) && hasTranslatableText(c.textContent ?? '')
      ));
  for (const child of Array.from(el.children)) {
    // A shadow host's content lives in its shadow tree — its light textContent
    // is empty, which the marker-child rule below would misread as "nothing
    // there", pruning the whole subtree as a text-less leaf. Always recurse.
    if (probeShadow(child) && !isOwnShadowHost(child)) return false;
    // Void/replaced tags (input/img/svg) stay in the unit as placeholders.
    if (isSkippableTag(child)) continue;
    // An empty marker child (e.g. Reddit's <faceplate-perfmark/> at the end of a
    // post title) carries no translatable text — it must NOT turn the title into
    // a non-leaf, which would orphan the title's own text. Only a child that
    // actually holds text can force a recurse.
    if (!hasTranslatableText(child.textContent ?? '')) continue;
    // Non-phrasing tags recurse unconditionally (see doc above) — except two
    // shapes that only ever appear INSIDE this parent's own running text, where
    // recursing shatters one sentence into fragment units (or orphans the
    // parent's loose text entirely). Both require sentence flow: outside prose,
    // the same tag is structure (a grid of cards) and must still recurse.
    //   - a sentence CHIP (X's inline-flex @mention DIV mid-tweet) stays in-unit
    //     OPAQUE — serializeInline rides it through as one placeholder;
    //   - a custom/unknown PHRASING tag (elyx.design's `<ink>` hand-drawn
    //     underline wrapping a few words of a headline) stays in-unit
    //     TRANSPARENT — its text translates with the sentence and the tag is
    //     replayed around the 译文.
    // The phrasing case also demands LEAF SHAPE, like the restyled-phrasing
    // exception below it. A custom element is `display:inline` by DEFAULT, so
    // the predicate alone would swallow any component host that never styled
    // itself — an Angular `<app-card><h3>…</h3><div>…</div></app-card>` beside
    // loose text — flattening a card into one word-mashed unit whose block
    // children the 译文 then reproduces as a phantom row. Requiring leaf shape
    // keeps that recursing; `<ink>relevant</ink>` has no element children at
    // all, so it passes trivially.
    if (!isInlineTag(child)) {
      if (hasSentenceFlow() && (isInlineChip(child) || (isCustomPhrasing(child) && isLeafBlock(child, probeShadow)))) {
        continue;
      }
      return false;
    }
    // Phrasing tag in inline flow — normal in-unit content.
    if (isInlineElement(child)) continue;
    // Phrasing tag restyled block — typographic only when the parent owns
    // direct text a recurse would orphan, and the child is leaf-shaped.
    if (hasOwnDirectText() && isLeafBlock(child, probeShadow)) continue;
    return false;
  }
  return true;
}

/**
 * A "link group" is a container whose element children are 2+ links and nothing
 * else (no prose direct text) — e.g. Previous/Next pager buttons, breadcrumbs, a
 * row of action links. Each link is an INDEPENDENT navigation target, so the
 * group must NOT be one leaf block: that would flatten both `<a href>`s into a
 * single unit and the 译文 would reproduce every card (duplicate links + the host
 * card chrome overlapping). Recursing instead makes each link its own unit,
 * translated inline in place. A paragraph with inline links (`see <a>x</a> and
 * <a>y</a>`) has direct text, so it is NOT a link group and stays one unit.
 */
function isLinkGroup(el: Element): boolean {
  const kids = Array.from(el.children);
  const links = kids.filter((c) => c.tagName.toUpperCase() === 'A');
  if (links.length < 2) return false;
  // Every non-skippable element child must be a link (br/img/svg/… don't count).
  if (kids.some((c) => c.tagName.toUpperCase() !== 'A' && !isSkippableTag(c))) return false;
  const hasOwnText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? '').trim());
  return !hasOwnText;
}

/**
 * If a unit's content is ENTIRELY one link (`<li><a><span>text</span></a>` — a
 * nav/TOC item), serialize the link's INNER content, not the `<li>`. Otherwise
 * the whole `<a href>` gets flattened into placeholders and the 译文 reproduces a
 * SECOND working link; worse, since inlineHost appends the gloss inside the
 * original `<a>`, the reproduction nests as an invalid `<a>`-in-`<a>`. The
 * original link is untouched — the gloss (placed inside it) just carries the
 * translated text. A link that wraps only PART of a unit (`<p>see <a>x</a>
 * now</p>`) is left alone: it must stay a link in the 译文, on the right word.
 *
 * The same rule covers a sole SHELL wrapper (a border/background pill —
 * `<div><span class="… border rounded">View Component</span></div>`): cloning
 * it into the 译文 renders a second fake control beside the real one, so the
 * shell is unwrapped exactly like a link. Text-style wrappers (`<b>`, `<em>`,
 * a plain coloured span) still reproduce — that's the 带样式 promise.
 */
function unwrapSoleWrapper(el: Element): Element {
  let cur = el;
  for (;;) {
    const kids = Array.from(cur.children);
    const hasOwnText = Array.from(cur.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? '').trim());
    if (kids.length === 1 && !hasOwnText && (kids[0].tagName.toUpperCase() === 'A' || isShellElement(kids[0]))) {
      cur = kids[0];
    } else {
      return cur;
    }
  }
}

/**
 * Discover translation units under `root` without writing source markers.
 * Null yields let a caller pause between container visits; unit yields can be
 * collected into a read batch before marking/observing them. The synchronous
 * walkAndLabel wrapper below retains the original labelling API.
 *
 * Shadow roots are walked too — open AND closed, via the content-script probe
 * (`anyShadowRoot`: Firefox's element property / Chromium's chrome.dom — a
 * regular page can't see closed roots, but a content script can). The
 * RENDERED content of a host lives in its shadow tree, while slotted light
 * children stay in the light tree — both are walked, and since every text node
 * physically lives in exactly one tree, nothing double-labels. `onShadowRoot`
 * fires once per root encountered so the caller can attach its observer and
 * styles (dedup is the caller's job). Our own prefix-tagged hosts (surfaces,
 * gloss nodes) are never descended into.
 */
export function* walkTranslationUnits(
  root: Element,
  idGen: () => string = makeId,
  onShadowRoot?: (shadow: ShadowRoot) => void
): Generator<TranslationUnit | null> {
  // Per-WALK probe memo: every child is probed once in its parent's leafness
  // check and again by its own walk() — memoizing halves the native
  // chrome.dom.openOrClosedShadowRoot calls. Scoped to one walk on purpose:
  // a cache that outlived the walk would go stale on late-attached roots.
  const probed = new Map<Element, ShadowRoot | null>();
  const probeShadow = (el: Element): ShadowRoot | null => {
    let r = probed.get(el);
    if (r === undefined) {
      r = anyShadowRoot(el);
      probed.set(el, r);
    }
    return r;
  };

  const walk = function* (el: Element): Generator<TranslationUnit | null> {
    yield null; // allow the caller to yield even through textless container trees
    if (isSkippedElement(el) || isHidden(el) || isVisuallyHidden(el) || DROP_FROM_GLOSS.has(el.tagName.toUpperCase()))
      return;

    const shadow = probeShadow(el);
    if (shadow && !isOwnShadowHost(el)) {
      onShadowRoot?.(shadow);
      for (const child of Array.from(shadow.children)) yield* walk(child);
      // fall through — slotted light children below are rendered content too
    }

    if (isLeafBlock(el, probeShadow) && !isLinkGroup(el)) {
      // Gate on VISIBLE text: an icon-only link whose only text is sr-only is
      // skipped (no invisible 译文, no brand-name mangling).
      if (hasTranslatableText(visibleText(el))) {
        const id = idGen();
        // Serialize the link's inner content (not the wrapping <a>) so a nav/TOC
        // item's 译文 doesn't reproduce a duplicate <a href>. The unit element
        // stays the leaf block — markers + inlineHost placement are unchanged.
        const content = unwrapSoleWrapper(el);
        yield {
          id,
          element: el,
          serialized: serializeInline(content),
          // Visible text only (sr-only/hidden excluded), whitespace-collapsed so
          // the cache key and length routing reflect real content length — not
          // the runs of inter-element whitespace in a deeply-nested unit.
          text: visibleText(content).replace(/\s+/g, ' ').trim(),
        };
        // A real unit owns its inline descendants; never mint nested units.
        return;
      }
      // Light text can be empty (or punctuation-only) through several wrappers
      // while a deeper host still contains translatable shadow content.
    }

    for (const child of Array.from(el.children)) yield* walk(child);
  };

  yield* walk(root);
}

/** Synchronous convenience API; collect reads before applying source markers. */
export function walkAndLabel(
  root: Element,
  idGen: () => string = makeId,
  onShadowRoot?: (shadow: ShadowRoot) => void
): TranslationUnit[] {
  const units = [...walkTranslationUnits(root, idGen, onShadowRoot)].filter((u): u is TranslationUnit => u !== null);
  for (const unit of units) {
    unit.element.setAttribute(DATA_OMNI.walked, '');
    unit.element.setAttribute(DATA_OMNI.walkId, unit.id);
  }
  return units;
}
