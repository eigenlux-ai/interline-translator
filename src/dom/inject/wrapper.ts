/**
 * @module dom/inject/wrapper
 *
 * Create and manage the translated content nodes for a translation unit:
 *
 *   - block  → a block element sibling right after the source (new line).
 *     For prose: paragraphs, list items, block headings.
 *   - inline → an inline element appended inside the source as its last child.
 *     For nav items / headings-in-flex / buttons / inline elements, where a
 *     block sibling would add a flex/grid item or break the line layout.
 * Both carry `class="notranslate" translate="no"` + data-omni-* so other
 * translators and our own re-walks skip them. The layout mode is stamped on the
 * node (data-omni-layout) so findGloss/remove know where to look. One node per
 * unit, idempotent.
 */

import { DATA_OMNI, OMNI_BLOCK_TAG, OMNI_INLINE_TAG } from '@/constants';
import { isInlineTag, isShellElement } from '../filter';
import { NEWLINE_PRESERVING, NO_CARVE_TAGS } from '../policy';
import type { TranslationUnit } from '../traversal';
import { createPetalSpinner } from './petal-loader';
import { GLOSS_CLASS, PENDING_CLASS, SRC_FONT_VAR, SRC_LINE_VAR } from './styles';

export type InjectMode = 'block' | 'inline';

/**
 * For inline mode, find where to append the 译文 so it reads on the SAME line as
 * the text. Descend through single-child wrappers until we reach the element
 * that DIRECTLY holds the text (or branches), and append there. This keeps the
 * 译文 on one line in the two cases the layout would otherwise break:
 *   - a flex/grid-COLUMN wrapper (MediaWiki radio: `<div flex-col><label><span>
 *     text</span></label>` → step down to the <span> so 译文 isn't a new flex
 *     item on its own line);
 *   - a BLOCK-level nav link (`<li><a class=block>Quick Start</a></li>` → step
 *     into the <a> so "Quick Start 快速入门" stays one line; the 译文 joining the
 *     clickable nav row is expected — same destination as the link. The inline
 *     gloss CSS strips text-decoration so it never masquerades as a link).
 *
 * It does NOT bury the 译文 inside a CONTENT link: a prose `<p>see <a>x</a></p>`
 * has direct text at the `<p>`, so descent stops there and the 译文 sits at the
 * paragraph level, never inside the inline link.
 */
const TRACK_DISPLAYS = new Set(['flex', 'inline-flex', 'grid', 'inline-grid']);

function inlineHost(el: Element): Element {
  const win = el.ownerDocument.defaultView;
  let cur = el;
  for (;;) {
    const kids = Array.from(cur.children).filter((c) => !c.hasAttribute(DATA_OMNI.translated));
    const hasDirectText = Array.from(cur.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? '').trim());
    if (kids.length !== 1 || hasDirectText) return cur;
    const child = kids[0];
    if (!win?.getComputedStyle) return cur; // no layout engine → don't descend (keeps unit tests stable)
    const curIsTrack = TRACK_DISPLAYS.has(win.getComputedStyle(cur).display);
    const childDisplay = win.getComputedStyle(child).display;
    const childIsBlock = !(childDisplay.startsWith('inline') || childDisplay === 'contents' || childDisplay === '');
    // Descend when appending HERE would break the line — `cur` is a flex/grid
    // track (gloss becomes a stray item — the radio-label case) or the single
    // child is block-level (gloss after it wraps — a block nav link) — or when
    // the single child is a SHELL (border/background pill): a 译文 dangling
    // outside a control's chrome reads as a stray caption, INSIDE it the
    // control itself reads bilingual. Stop at a plain inline child (gloss
    // beside it is already same-line, and won't inherit its
    // colour/underline/bold).
    if (curIsTrack || childIsBlock || isShellElement(child)) cur = child;
    else return cur;
  }
}

/**
 * Find the existing 译文 node for a unit, if any. Inline AND inside-block glosses
 * live INSIDE the source, so look there first by per-unit walkId (UUID → no
 * cross-unit false match; position-independent, so a host SPA re-render appending
 * nodes after it doesn't lose it). The only out-of-source case is the block
 * clipped-source FALLBACK, where the 译文 is an afterend sibling.
 */
export function findGloss(unit: TranslationUnit, _mode: InjectMode): HTMLElement | null {
  // :not([seg]) — interleave SEGMENTS are satellites of the primary gloss; a
  // host that evicted only the primary must read as "gloss missing" so the
  // heal paths re-place the whole unit (matching a surviving segment instead
  // would short-circuit refill and lose paragraph 1 forever).
  const inside = unit.element.querySelector<HTMLElement>(
    `[${DATA_OMNI.walkId}="${unit.id}"][${DATA_OMNI.translated}]:not([${DATA_OMNI.seg}])`
  );
  if (inside) return inside;
  // Clipped-source fallback gloss: an afterend SIBLING. Match among ALL of the
  // parent's children, not just nextElementSibling — a host inserting a node
  // between source and gloss mid-stream (ads, React reorder) would otherwise
  // hide the existing gloss from us and every later write would create a
  // duplicate, orphaning the first as a stuck spinner.
  const sibling = unit.element.parentElement?.querySelector<HTMLElement>(
    `:scope > [${DATA_OMNI.walkId}="${unit.id}"][${DATA_OMNI.translated}]`
  );
  return sibling ?? null;
}

/** Every interleave SEGMENT gloss of a unit (paragraph 2..N of 逐段对照) —
 *  the primary gloss (no seg marker) is excluded; findGloss stays anchored on
 *  it. Used to sweep stale segments before a re-fill re-places the 译文. */
export function segGlosses(unit: TranslationUnit): HTMLElement[] {
  return Array.from(
    unit.element.querySelectorAll<HTMLElement>(
      `[${DATA_OMNI.walkId}="${unit.id}"][${DATA_OMNI.translated}][${DATA_OMNI.seg}]`
    )
  );
}

/**
 * The source-side paragraph separators of a unit: its <br> elements grouped
 * into consecutive runs (`text<br><br>text` = ONE separator of two <br>s —
 * only whitespace text / comments may sit between members of a group).
 * K groups ⇒ K+1 source paragraphs.
 *
 * DIRECT children of the unit only, deliberately: a <br> nested inside an
 * inline child (`<a>line one<br>line two</a>`, an opaque translate=no span)
 * still splits the TRANSLATED string — so source count < translation count,
 * the interleave gate's equality check fails, and the whole-block fallback
 * wins. That asymmetry is the safety: interleaving around a nested <br>
 * would slice reproduced markup mid-element and insert block glosses INSIDE
 * the host's inline elements. Counting only what we can safely insert
 * against makes every nested-break unit fall back instead of break.
 * Our own gloss nodes (already inserted before break groups by a previous
 * interleave pass) are invisible to the grouping — they don't break a run.
 */
export function sourceBreakGroups(el: Element): HTMLElement[][] {
  const breaks = Array.from(el.querySelectorAll<HTMLElement>('br')).filter(
    (br) => br.parentElement === el && !br.closest(`[${DATA_OMNI.translated}]`)
  );
  const groups: HTMLElement[][] = [];
  let cur: HTMLElement[] = [];
  for (const br of breaks) {
    if (cur.length === 0) {
      cur.push(br);
      continue;
    }
    // Same group iff only whitespace text / our glosses separate it from the
    // previous <br>.
    let n: Node | null = cur[cur.length - 1].nextSibling;
    let contiguous = false;
    while (n) {
      if (n === br) {
        contiguous = true;
        break;
      }
      const isWs = n.nodeType === 3 && !(n.textContent ?? '').trim();
      const isComment = n.nodeType === 8; // serializeInline ignores comments — so must the run
      const isGloss = n.nodeType === 1 && (n as Element).hasAttribute(DATA_OMNI.translated);
      if (!isWs && !isComment && !isGloss) break;
      n = n.nextSibling;
    }
    if (contiguous) {
      cur.push(br);
    } else {
      groups.push(cur);
      cur = [br];
    }
  }
  if (cur.length) groups.push(cur);
  return groups;
}

/** A newline separator RUN inside a direct text-node child of the unit —
 *  the pre-wrap counterpart of a <br> group. `node` is the text node holding
 *  the run; [start, end) brackets the `\n` run, with its surrounding spaces
 *  folded in (NL_RUN_SOURCE — the shared separator shape). */
export interface NewlineRun {
  node: Text;
  start: number;
  end: number;
}

/**
 * Newline-paragraph separators of a pre-wrap unit: runs of `\n` inside text
 * nodes whose ancestor chain UP TO the unit is purely inline-level (the
 * X/Threads shape — tweet text sliced into inline <span>s, literal newlines
 * inside them, white-space:pre-wrap on the container). The inline-chain
 * requirement is the safety argument's generalized form: within one inline
 * flow, a newline is a REAL paragraph break of the unit's own prose; under a
 * block-level descendant it would belong to that block's flow (and such
 * blocks are walker-recursed anyway). Splitting the translation at these
 * separators is done at the DOM level (Range.extractContents auto-balances
 * tags cut mid-element), so nested-inline runs no longer threaten markup —
 * the string-slice hazard that once forced the direct-children-only rule.
 * Returns [] when the computed white-space does not preserve newlines (they
 * render as spaces there — not paragraphs) or without a layout engine.
 */
export const NL_RUN_SOURCE = '[ \\t]*\\n\\s*';

/**
 * Did the host REPLACE a split text node's whole run, or just edit the first
 * paragraph in place?
 *
 * Carving a pre-wrap unit splits one host text node into a RETAINED first half
 * plus MINTED continuations that hold the remaining host paragraphs. A host
 * that rewrites the run only writes to the node IT references — the retained
 * half — so the continuations become stale duplicates and must go. But a host
 * that merely appends to the first paragraph ("(edited)", a status suffix)
 * touches the same node while the continuations still hold REAL prose that
 * exists nowhere else: deleting them destroys page content permanently
 * (removed nodes survive neither normalize() nor teardown).
 *
 * Two signals separate them, and BOTH must hold for "surgical":
 *   - the new data still starts with the snapshot (an edit extends the
 *     paragraph; a rewrite replaces it), and
 *   - it introduced no new separator (a rewrite reinstates the paragraph
 *     structure the split took apart, so its text carries the breaks again;
 *     an in-place edit of one paragraph cannot grow one).
 * Snapshot-relative rather than absolute, because dropEdgeRuns can leave a
 * leading newline inside the retained half.
 *
 * Ambiguity resolves toward KEEPING host text: a misread rewrite leaves a
 * stale paragraph that the following rewalk re-translates as it stands, while
 * a misread edit would delete prose outright.
 */
export function splitRunRewritten(current: string, snapshot: string): boolean {
  if (!current.startsWith(snapshot)) return true;
  const re = new RegExp(NL_RUN_SOURCE, 'g');
  return (current.match(re)?.length ?? 0) !== (snapshot.match(re)?.length ?? 0);
}

/**
 * Drop EDGE runs — a run with no non-whitespace text on its outer side is not
 * a paragraph SEPARATOR, just trailing/leading whitespace. The batch protocol
 * trims every item, so such a run can exist on one side only (a source ending
 * in `\n` vs its trimmed translation — or a translation whose model kept a
 * trailing ~n token vs a source we count-matched against): left in, it skews
 * the count comparison by one FOREVER, locking the unit into whole-block
 * fallback. Mirrors the br side's empty-part tolerance. `root` scopes the
 * prose stream; text inside our own glosses is not source prose.
 */
function dropEdgeRuns(runs: NewlineRun[], root: Element): NewlineRun[] {
  if (runs.length === 0) return runs;
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const parts: Array<{ node: Text; text: string }> = [];
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    let p = t.parentElement;
    let inGloss = false;
    while (p && p !== root) {
      if (p.hasAttribute(DATA_OMNI.translated)) {
        inGloss = true;
        break;
      }
      p = p.parentElement;
    }
    if (!inGloss) parts.push({ node: t, text: t.textContent ?? '' });
  }
  const idx = new Map(parts.map((p, i) => [p.node, i]));
  const prose = (r: NewlineRun, side: 'before' | 'after'): boolean => {
    const i = idx.get(r.node);
    if (i === undefined) return true; // node not in stream (unexpected) — keep the run
    let s = side === 'after' ? parts[i].text.slice(r.end) : parts[i].text.slice(0, r.start);
    if (side === 'after') for (let k = i + 1; k < parts.length; k++) s += parts[k].text;
    else for (let k = 0; k < i; k++) s += parts[k].text;
    return /\S/.test(s);
  };
  const out = runs.slice();
  while (out.length && !prose(out[out.length - 1], 'after')) out.pop();
  while (out.length && !prose(out[0], 'before')) out.shift();
  return out;
}

export function sourceNewlineRuns(el: Element): NewlineRun[] {
  const win = el.ownerDocument.defaultView;
  if (!win?.getComputedStyle) return [];
  if (!NEWLINE_PRESERVING.has(win.getComputedStyle(el).whiteSpace)) return [];
  const runs: NewlineRun[] = [];
  const re = new RegExp(NL_RUN_SOURCE, 'g');
  // Memoized per-element verdict: is this element inline-level AND clean
  // (not a gloss), chained up to `el`?
  const chainOk = new Map<Element, boolean>();
  const inlineChain = (p: Element | null): boolean => {
    if (p === el) return true;
    if (!p) return false;
    const hit = chainOk.get(p);
    if (hit !== undefined) return hit;
    const d = win.getComputedStyle(p).display;
    // '' = no layout box reported (non-layout engines) — fall back to the
    // tag's phrasing nature, mirroring isInlineElement's law.
    const inline = d ? d.startsWith('inline') || d === 'contents' : isInlineTag(p);
    const ok =
      inline &&
      !NO_CARVE_TAGS.has(p.tagName.toUpperCase()) &&
      !(p as HTMLElement).isContentEditable &&
      !p.hasAttribute(DATA_OMNI.translated) &&
      inlineChain(p.parentElement);
    chainOk.set(p, ok);
    return ok;
  };
  const walker = el.ownerDocument.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    if (!inlineChain(t.parentElement)) continue;
    const text = t.textContent ?? '';
    re.lastIndex = 0;
    for (let m = re.exec(text); m; m = re.exec(text)) {
      runs.push({ node: t, start: m.index, end: m.index + m[0].length });
    }
  }
  return dropEdgeRuns(runs, el);
}

/**
 * Newline runs inside a GLOSS node (the translation side of the same scan —
 * shared regex, shared inline-chain law, but rooted at the gloss so its own
 * `translated` attribute doesn't disqualify everything).
 */
export function glossNewlineRuns(gloss: Element): NewlineRun[] {
  const win = gloss.ownerDocument.defaultView;
  const runs: NewlineRun[] = [];
  const re = new RegExp(NL_RUN_SOURCE, 'g');
  const walker = gloss.ownerDocument.createTreeWalker(gloss, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const t = n as Text;
    // Inside the gloss everything is OUR reproduction; only block-level
    // reproduced children would make a \n ambiguous — forced inline by the
    // gloss stylesheet, so the chain check reduces to the engine guard.
    if (win?.getComputedStyle) {
      let p = t.parentElement;
      let ok = true;
      while (p && p !== gloss) {
        const d = win.getComputedStyle(p).display;
        if (!(d.startsWith('inline') || d === 'contents' || d === '')) {
          ok = false;
          break;
        }
        p = p.parentElement;
      }
      if (!ok) continue;
    }
    const text = t.textContent ?? '';
    re.lastIndex = 0;
    for (let m = re.exec(text); m; m = re.exec(text)) {
      runs.push({ node: t, start: m.index, end: m.index + m[0].length });
    }
  }
  // Same edge tolerance as the source side: a model that faithfully kept a
  // trailing ~n token yields a gloss ending in `\n` — not a separator.
  return dropEdgeRuns(runs, gloss);
}

/** Computed-overflow values that clip a too-tall child (a line-clamp / max-height
 *  box). An inside-block 译文 in such a source would be hidden, so we fall back to
 *  an afterend sibling there. Real-browser only — happy-dom reports '' (no clip). */
const CLIPPING_OVERFLOWS = new Set(['hidden', 'clip', 'scroll', 'auto']);

function sourceClips(el: Element): boolean {
  const win = el.ownerDocument.defaultView;
  if (!win?.getComputedStyle) return false;
  const cs = win.getComputedStyle(el);
  return CLIPPING_OVERFLOWS.has(cs.overflowY) || CLIPPING_OVERFLOWS.has(cs.overflowX);
}

/**
 * Create (or return) the 译文 node for a unit and show the pending spinner.
 * `targetLang` (e.g. "zh-CN") is stamped as `lang` so the browser renders the 译文
 * with the target script's fonts / line-breaking and a screen reader switches
 * voice — the source's own `lang` would otherwise mis-apply to the translation.
 */
export function ensureGlossNode(
  unit: TranslationUnit,
  mode: InjectMode,
  targetLang?: string,
  style?: string,
  font?: string
): HTMLElement {
  const existing = findGloss(unit, mode);
  if (existing) return existing;

  const tag = mode === 'inline' ? OMNI_INLINE_TAG : OMNI_BLOCK_TAG;
  const node = unit.element.ownerDocument.createElement(tag);
  node.setAttribute('class', `notranslate ${GLOSS_CLASS}`);
  node.setAttribute('translate', 'no');
  if (targetLang) node.setAttribute('lang', targetLang);
  // The opt-in visual preset (blend/underline/highlight/…) drives the preset CSS
  // keyed on this attribute. Always stamped (even 'blend', which has no rule) so
  // the active style is inspectable and a live toggle is one attribute write.
  if (style) node.setAttribute(DATA_OMNI.style, style);
  // Opt-in译文 font — only 'kai' has a rule; 'inherit' leaves the 译文 on the
  // host font (no attribute → no override), so we stamp nothing for it.
  if (font === 'kai') node.setAttribute(DATA_OMNI.font, font);
  // `dir="auto"` lets the browser pick writing direction from the 译文's own text,
  // so an RTL target (ar/he/fa) renders right-to-left even though it inherits an
  // LTR source/host. Re-evaluates as the spinner is replaced by real text.
  node.setAttribute('dir', 'auto');
  node.setAttribute(DATA_OMNI.translated, '');
  node.setAttribute(DATA_OMNI.walkId, unit.id);
  node.setAttribute(DATA_OMNI.layout, mode);
  node.setAttribute(DATA_OMNI.state, 'pending');
  // The spinner's shared geometry must land in the SAME tree as the spinner (a
  // fragment reference never crosses a shadow boundary), and `node` is still
  // detached here — so the tree comes from the SOURCE, which is where the gloss
  // is about to go either way (inside it, or beside it under the same parent).
  setPending(node, glossTree(unit.element));

  if (mode === 'inline') {
    // Inline gloss appended INSIDE the source → inherits the source's type and
    // reads on the same line.
    inlineHost(unit.element).appendChild(node);
  } else if (sourceClips(unit.element)) {
    // Source clips its overflow (line-clamp / max-height) → an inside 译文 would
    // be hidden. Fall back to an afterend sibling; a sibling inherits from the
    // PARENT not the source, so mirror the source's type onto it. Stamp the
    // source: the 仅译文 collapse selects `:has(descendant 译文)`, which cannot
    // see this outside gloss — the attribute is its collapse handle.
    unit.element.setAttribute(DATA_OMNI.clipped, '');
    unit.element.insertAdjacentElement('afterend', node);
    mirrorTypography(node, unit.element);
  } else {
    // Default: append inside the source (after its content). The translation
    // groups with the text, inheriting the source's typography and color naturally.
    unit.element.appendChild(node);
  }
  stampSourceMetrics(node);
  return node;
}

/**
 * Freeze the 译文's inherited type metrics onto itself as CSS vars (post-insert,
 * so the computed values reflect the real parent chain / mirrored typography).
 * The translation-only display mode collapses the source's text to font-size 0
 * and these vars are how the gloss keeps its size (styles.buildDisplayModeCss).
 * If that mode is ALREADY active while a lazily-revealed gloss is being created,
 * the collapse would poison the measurement — neutralize the <html> mode
 * attribute for the synchronous read (no paint can happen in between) and put
 * it back. No-op without a layout engine (happy-dom) — the CSS falls back to
 * var defaults.
 */
/**
 * Run `fn` with the three-state display attribute lifted off <html>, restored
 * afterwards — the BATCH counterpart of stampSourceMetrics' per-node
 * neutralize. Creating N glosses under an active 仅译文 collapse would
 * otherwise toggle the attribute (each toggle invalidates style for the whole
 * document, and the interleaved getComputedStyle forces a recalc) once per
 * node; hoisting makes a 16-unit batch cost 2 invalidations instead of 32.
 * stampSourceMetrics still self-neutralizes when called un-hoisted — with the
 * attribute already lifted it reads mode null and toggles nothing.
 */
export function withDisplayModeNeutralized<T>(doc: Document, fn: () => T): T {
  const root = doc.documentElement;
  const mode = root.getAttribute(DATA_OMNI.display);
  if (mode) root.removeAttribute(DATA_OMNI.display);
  try {
    return fn();
  } finally {
    if (mode) root.setAttribute(DATA_OMNI.display, mode);
  }
}

function stampSourceMetrics(node: HTMLElement): void {
  const doc = node.ownerDocument;
  const win = doc.defaultView;
  if (!win?.getComputedStyle) return;
  const root = doc.documentElement;
  const mode = root.getAttribute(DATA_OMNI.display);
  if (mode) root.removeAttribute(DATA_OMNI.display);
  const cs = win.getComputedStyle(node);
  const fs = cs.fontSize;
  const lh = cs.lineHeight;
  if (mode) root.setAttribute(DATA_OMNI.display, mode);
  if (fs) node.style.setProperty(SRC_FONT_VAR, fs);
  if (lh) node.style.setProperty(SRC_LINE_VAR, lh);
}

/**
 * Copy the source's type identity onto a 译文 that is NOT inside the source (the
 * block clipped-source fallback) so a heading's 译文 still reads as a heading. An
 * inside 译文 needs none of this — it inherits. Colour is left to inherit (NOT
 * copied) so the 译文 keeps following the host's light/dark. Real-browser only.
 */
function mirrorTypography(node: HTMLElement, source: Element): void {
  const win = source.ownerDocument.defaultView;
  if (!win?.getComputedStyle) return;
  const cs = win.getComputedStyle(source);
  node.style.fontFamily = cs.fontFamily;
  node.style.fontSize = cs.fontSize;
  node.style.fontWeight = cs.fontWeight;
  node.style.fontStyle = cs.fontStyle;
  node.style.lineHeight = cs.lineHeight;
  node.style.textAlign = cs.textAlign;
  // A clipped <pre>'s sibling gloss must keep the source's line structure —
  // outside the pre, white-space would collapse the translated newlines. ONLY
  // the preserving values are mirrored: copying `nowrap` from an
  // ellipsis-truncated label (overflow:hidden fires the same clip fallback)
  // would pin the gloss to one unwrappable line and overflow its container.
  if (/^(pre|pre-wrap|pre-line|break-spaces)$/.test(cs.whiteSpace)) {
    node.style.whiteSpace = cs.whiteSpace;
  }
}

/**
 * The tree `node` lives in — the document (nodeType 9), or the host-page shadow
 * root that adopted it (nodeType 11). A detached node has neither, so its
 * document stands in: that is the only tree it can be inserted into without
 * crossing a shadow boundary.
 */
function glossTree(node: Node): Document | ShadowRoot {
  const root = node.getRootNode();
  const isTree = root.nodeType === 9 || root.nodeType === 11;
  return isTree ? (root as Document | ShadowRoot) : node.ownerDocument!;
}

/** Show the loading spinner (three-petal spiral) inside a 译文 node. `tree` is
 *  where the gloss lives, so the spinner can share that tree's geometry. */
export function setPending(node: HTMLElement, tree: Document | ShadowRoot): void {
  node.setAttribute(DATA_OMNI.state, 'pending');
  node.textContent = '';
  const spinner = createPetalSpinner(tree);
  spinner.setAttribute('class', PENDING_CLASS);
  spinner.setAttribute('role', 'img');
  spinner.setAttribute('aria-label', 'translating');
  node.appendChild(spinner);
}

/** Fill a 译文 node with translated HTML (already restored/escaped). */
export function setTranslatedHtml(node: HTMLElement, html: string): void {
  node.setAttribute(DATA_OMNI.state, 'done');
  node.innerHTML = html;
}

/** Show an error marker on a 译文 node (icon + message, never colour alone). */
export function setError(node: HTMLElement, message: string): void {
  node.setAttribute(DATA_OMNI.state, 'error');
  node.textContent = `⚠ ${message}`;
}

/**
 * Remove all injected translation nodes under `root` and clear the walk markers on the
 * source elements, restoring the original DOM. Handles both block siblings and inline children.
 */
export function removeAllGloss(root: ParentNode): void {
  root.querySelectorAll(`[${DATA_OMNI.translated}]`).forEach((n) => n.remove());
  // The spinners' shared geometry holder is ours and lives in the host DOM too,
  // so byte-exact restore has to take it as well. Swept from the whole TREE, not
  // from `root`: the holder sits at the tree's top (body / the shadow root),
  // which a subtree `root` would not reach. Removing one out from under a live
  // spinner is safe in the one direction that matters — the spinner renders
  // empty and the next one re-creates the holder (ensurePetalGeometry).
  const tree = root instanceof Element ? (root.getRootNode() as ParentNode) : root;
  tree.querySelectorAll(`[${DATA_OMNI.petalDefs}]`).forEach((n) => n.remove());
  // Heal splitText scars FIRST (glosses just left, so the halves are adjacent
  // again): normalize() merges ONLY elements we marked — a host's own
  // adjacent text nodes are never touched. textContent is unchanged by
  // split+merge, so the byte-exact restore promise holds.
  root.querySelectorAll(`[${DATA_OMNI.split}]`).forEach((el) => {
    el.normalize();
    el.removeAttribute(DATA_OMNI.split);
  });
  root.querySelectorAll(`[${DATA_OMNI.walked}]`).forEach((el) => {
    el.removeAttribute(DATA_OMNI.walked);
    el.removeAttribute(DATA_OMNI.walkId);
    el.removeAttribute(DATA_OMNI.clipped);
  });
  // querySelectorAll never matches root ITSELF. When root (e.g. <body> holding
  // direct text) became a unit, a leftover marker makes the next walk skip the
  // whole tree — translate-off-then-on would never translate again. Its
  // block-mode gloss also lives OUTSIDE root (afterend sibling): clear both.
  if (root instanceof Element) {
    root.removeAttribute(DATA_OMNI.walked);
    root.removeAttribute(DATA_OMNI.walkId);
    root.removeAttribute(DATA_OMNI.clipped);
    if (root.hasAttribute(DATA_OMNI.split)) {
      root.normalize();
      root.removeAttribute(DATA_OMNI.split);
    }
    // Position-independent, matching findGloss: a node inserted between root
    // and its afterend gloss must not leak the gloss past a toggle-off. Only
    // root-level glosses are direct siblings of root, so this removes ours only.
    root.parentElement?.querySelectorAll(`:scope > [${DATA_OMNI.translated}]`).forEach((gloss) => gloss.remove());
  }
}
