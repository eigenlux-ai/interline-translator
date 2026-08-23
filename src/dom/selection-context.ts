/**
 * @module dom/selection-context
 *
 * Neighboring-paragraph extraction for 划词 translation. A lone selection has
 * no self-context — the sentence before and after are what disambiguate
 * pronouns, ellipses and terminology — so we climb from the selection to its
 * containing block and take the visible text of the adjacent block siblings.
 *
 * Best-effort by design: no computed styles (works in non-layout DOMs), a
 * fixed block-tag list instead of display: queries, and our own injected 译文
 * stripped so a translated page doesn't feed translations back as "context".
 */

import { DATA_OMNI } from '@/constants';

/** Tags treated as the selection's containing "paragraph". */
const BLOCK_TAGS = new Set([
  'P',
  'LI',
  'DD',
  'DT',
  'BLOCKQUOTE',
  'PRE',
  'TD',
  'TH',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
  'ARTICLE',
  'SECTION',
  'DIV',
]);

/** Per-neighbor text cap — context, not content; keep the prompt lean. */
const NEIGHBOR_MAX_CHARS = 240;

/** A selection longer than this carries enough of its own context already. */
const SELECTION_SELF_SUFFICIENT_CHARS = 1000;

/** The nearest block-ish ancestor of a node (null when only body/html qualify). */
function containingBlock(node: Node | null): Element | null {
  let el: Element | null = node instanceof Element ? node : (node?.parentElement ?? null);
  while (el && el !== el.ownerDocument.body) {
    if (BLOCK_TAGS.has(el.tagName)) return el;
    el = el.parentElement;
  }
  return null;
}

/** Visible text of an element with our injected 译文 removed. */
function textWithoutGloss(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  clone.querySelectorAll(`[${DATA_OMNI.translated}]`).forEach((g) => g.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

/**
 * The paragraphs immediately before and after the selection (either may be
 * absent), capped per entry. Empty array when the selection is long enough to
 * be its own context, or when no containing block is found.
 */
export function selectionNeighbors(selection: Selection): string[] {
  if (selection.rangeCount === 0) return [];
  if (selection.toString().length > SELECTION_SELF_SUFFICIENT_CHARS) return [];
  const block = containingBlock(selection.getRangeAt(0).commonAncestorContainer);
  if (!block) return [];
  const out: string[] = [];
  for (const sibling of [block.previousElementSibling, block.nextElementSibling]) {
    if (!sibling) continue;
    const text = textWithoutGloss(sibling);
    if (text) out.push(text.slice(0, NEIGHBOR_MAX_CHARS));
  }
  return out;
}
