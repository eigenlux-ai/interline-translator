/**
 * @module dom/inject/placeholder
 *
 * Preserve inline formatting across translation. A paragraph like
 *   `Hello <a href="x">world</a>, <b>friend</b>`
 * is serialized to a flat string with numbered placeholders
 *   `Hello {{0}}world{{1}}, {{2}}friend{{3}}`
 * which the engine translates as plain text; afterwards the inline tags are
 * spliced back around the (re-ordered) text. If the engine drops/mangles
 * placeholders (some MT does), `restore` reports a mismatch and the caller
 * falls back to plain text — never throwing, never emitting broken markup.
 *
 * Pure string/DOM logic — unit-tested for the serialize→restore round-trip.
 */

import { isAriaHidden, isInlineChip, isNonContent, isSkippedElement } from '../filter';
import { DROP_ATTRS_FROM_GLOSS, DROP_FROM_GLOSS, EVENT_HANDLER_ATTR } from '../policy';
import { isHidden, isVisuallyHidden } from '../visibility';

export interface SerializedInline {
  /** Flattened text with `{{n}}` placeholders where inline tags opened/closed. */
  text: string;
  /** Opening/closing tag fragments indexed by placeholder number. */
  tags: string[];
}

const PLACEHOLDER = /\{\{(\d+)\}\}/g;

/**
 * outerHTML for the opaque-placeholder path, scrubbed of anything the 译文 must
 * not reproduce. The per-child DROP / isAriaHidden checks above can't see inside
 * an element that rides through whole (translate=no, inline code, …) — without
 * this, a `<span translate="no">Next.js <img …></span>` smuggles a duplicate
 * image (detached from the CSS context that sized it), and a nested
 * `<span aria-hidden="true">★</span>` reproduces decoration that visibleText
 * already dropped from unit.text — the very lockstep this module promises.
 */
function opaqueFragment(el: Element): string {
  const clone = el.cloneNode(true) as Element;
  const scrub = (source: Element, node: Element) => {
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      if (DROP_ATTRS_FROM_GLOSS.has(name) || EVENT_HANDLER_ATTR.test(name)) node.removeAttribute(attr.name);
    }
    // Read visibility in the original CSS context, never on the detached clone.
    for (const [index, child] of Array.from(node.children).entries()) {
      const original = source.children[index];
      if (
        DROP_FROM_GLOSS.has(child.tagName.toUpperCase()) ||
        isNonContent(original) ||
        isAriaHidden(original) ||
        isHidden(original) ||
        isVisuallyHidden(original)
      )
        child.remove();
      else scrub(original, child);
    }
  };
  scrub(el, clone);
  return clone.outerHTML;
}

/**
 * Flatten an element's inline content into placeholder text. Block/skip
 * descendants are not expected here (callers pass leaf blocks); any skipped
 * inline element is emitted as an opaque placeholder pair so it round-trips
 * untouched.
 */
export function serializeInline(el: Element): SerializedInline {
  const tags: string[] = [];
  let text = '';

  const visit = (node: Node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === 3 /* text */) {
        text += child.textContent ?? '';
      } else if (child.nodeType === 1 /* element */) {
        const elc = child as Element;
        // Form controls + media (input/img/svg/…) are NOT translatable content
        // and must NOT be duplicated into the 译文 — drop them entirely (e.g.
        // `<label><input> Automatic</label>` → 译文 is just "自动", not a 2nd radio).
        if (DROP_FROM_GLOSS.has(elc.tagName.toUpperCase())) continue;
        // Screen-reader-only labels (sr-only) aren't visible content — don't pull
        // them into the 译文 (the gloss would be invisible + brand names mangled).
        if (isVisuallyHidden(elc)) continue;
        // Code/data tags (<script>/<style>/<noscript>/<template>) are never
        // visible content — drop them, never reproduce (Reddit's inline
        // SML.load(...) loaders were leaking into the 译文 as raw text).
        if (isNonContent(elc)) continue;
        // Hidden descendants (e.g. a [hidden] hovercard panel deep inside a unit):
        // walk-time pruning misses in-unit subtrees, so drop them here too —
        // otherwise a normally-invisible block gets reproduced into the 译文.
        if (isHidden(elc)) continue;
        // aria-hidden = decoration by declaration (avatar facepiles, icon
        // glyphs). Reproducing it opaquely duplicates visible decoration —
        // dropped, in lockstep with visibleText (nextjs.org's author avatars
        // cloned into the 译文 lost their --size context and rendered huge).
        if (isAriaHidden(elc)) continue;
        if (isSkippedElement(elc) || elc.tagName === 'BR' || isInlineChip(elc)) {
          // Opaque: represent the whole element as one placeholder (BR line
          // break, inline <code>, a sentence chip the walk kept in-unit, etc.
          // — preserved in place, not duplicated-away), sanitized of nested
          // media/controls.
          const idx = tags.push(opaqueFragment(elc)) - 1;
          text += `{{${idx}}}`;
          continue;
        }
        // Emit open tag → recurse → close tag, each as a placeholder.
        const open = openTag(elc);
        const openIdx = tags.push(open) - 1;
        text += `{{${openIdx}}}`;
        visit(elc);
        const closeIdx = tags.push(`</${elc.tagName.toLowerCase()}>`) - 1;
        text += `{{${closeIdx}}}`;
      }
    }
  };
  visit(el);
  return { text, tags };
}

/**
 * The reproduced inline tag, minus everything DROP_ATTRS_FROM_GLOSS /
 * EVENT_HANDLER_ATTR name: the 译文's `<span class="hl">` must look like the
 * source's without also BEING it (a second `id`, a second `onclick`).
 * Lowercased first — attribute names come back case-preserved from foreign
 * (SVG/MathML) elements, and those are the ones a host page hand-writes.
 */
function openTag(el: Element): string {
  const attrs = Array.from(el.attributes)
    .filter((a) => {
      const name = a.name.toLowerCase();
      return !DROP_ATTRS_FROM_GLOSS.has(name) && !EVENT_HANDLER_ATTR.test(name);
    })
    .map((a) => ` ${a.name}="${escapeAttr(a.value)}"`)
    .join('');
  return `<${el.tagName.toLowerCase()}${attrs}>`;
}

function escapeAttr(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

/** Count placeholders present in a string. */
export function countPlaceholders(text: string): number {
  return (text.match(PLACEHOLDER) ?? []).length;
}

export interface RestoreResult {
  html: string;
  /** False when the translated text lost/duplicated placeholders → use plain text. */
  ok: boolean;
}

/**
 * Re-insert inline tags into a translated string. The translated TEXT (engine
 * output) is always HTML-escaped — only the page's OWN inline-tag fragments are
 * emitted raw — so a model that returns markup can't inject anything. Returns
 * `ok:false` (with escaped plain text) if any placeholder is missing/duplicated/
 * out of range, so the caller degrades gracefully instead of emitting broken
 * or partial markup.
 */
export function restoreInline(translated: string, tags: string[]): RestoreResult {
  const re = /\{\{(\d+)\}\}/g;
  const seen = new Set<number>();
  let ok = true;
  let html = '';
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(translated)) !== null) {
    if (m.index > last) html += escapeText(translated.slice(last, m.index)); // text chunk → escaped
    const idx = Number(m[1]);
    if (idx < 0 || idx >= tags.length || seen.has(idx)) {
      ok = false;
    } else {
      seen.add(idx);
      html += tags[idx]; // page's own tag fragment → raw
    }
    last = m.index + m[0].length;
  }
  if (last < translated.length) html += escapeText(translated.slice(last));
  // Every original tag fragment must reappear exactly once.
  if (seen.size !== tags.length) ok = false;
  return ok ? { html, ok: true } : { html: escapeText(stripPlaceholders(translated, tags.length)), ok: false };
}

/**
 * Strip placeholder debris for the fallback path. MT engines mangle `{{n}}` in
 * varied ways — drop a brace on one side (`{{0`, `0}}`), reformat the inner gap
 * (`{{ 0 }}`, `{ {0} }`), or split the braces — leaving visible junk in the 译文.
 *
 * We treat as debris any digit run that (a) still has at least ONE surviving
 * brace adjacent to it (a fully de-braced bare number is indistinguishable from
 * real text, so we leave it) AND (b) is a valid placeholder INDEX (`< count`).
 * The index bound is what lets `Java{{0}}[6]` → `Java0}}[6]` lose only the `0}}`
 * while the real `[6]` reference and an unrelated `{2024}` survive untouched.
 */
function stripPlaceholders(text: string, count: number): string {
  if (count <= 0) return text;
  const drop = (full: string, n: string) => (Number(n) < count ? '' : full);
  return stripOrphanBraceRuns(
    text
      // Spaced / split double braces: `{{ 0 }}`, `{ {0} }`.
      .replace(/\{\s*\{\s*(\d+)\s*\}\s*\}/g, (full, n) => drop(full, n))
      // A digit run with a brace surviving on EITHER side, balanced or not:
      // `{{0}}`, `{{0`, `{0}`, `0}}`, `0}`. (One alternative needs a leading
      // brace, the other a trailing one — so a bare number never matches.)
      .replace(/\{+\s*(\d+)\s*\}*|(\d+)\s*\}+/g, (full, lead, trail) => drop(full, lead ?? trail))
  );
}

/**
 * Last-resort debris sweep: a `{{`/`}}` RUN whose index the engine swallowed
 * ENTIRELY, which the digit-bearing passes above cannot see. Google Translate
 * returned `更重要的是，}}他们贬低了设计的作用…` for an elyx.design paragraph —
 * the bare `}}` rendered as visible junk in the 译文.
 *
 * Only UNMATCHED runs go: a balanced `{{ … }}` is real content (a docs page
 * explaining a Handlebars/Jinja template), and this fallback — which already
 * knows the engine mangled our markers — must not eat the user's own braces.
 * Runs only, never a lone `{`/`}`: two braces is OUR marker's signature.
 */
function stripOrphanBraceRuns(text: string): string {
  const runs: Array<{ start: number; end: number; open: boolean }> = [];
  const re = /\{{2,}|\}{2,}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    runs.push({ start: m.index, end: m.index + m[0].length, open: m[0].startsWith('{') });
  }
  const orphans = new Set<number>();
  const open: number[] = [];
  runs.forEach((run, i) => {
    if (run.open) open.push(i);
    else if (open.length) open.pop();
    else orphans.add(i); // a closer with nothing to close
  });
  for (const i of open) orphans.add(i); // openers never closed
  if (orphans.size === 0) return text;
  let out = '';
  let last = 0;
  runs.forEach((run, i) => {
    if (!orphans.has(i)) return;
    out += text.slice(last, run.start);
    last = run.end;
  });
  return out + text.slice(last);
}

function escapeText(v: string): string {
  return v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Split rendered 译文 HTML into paragraphs at its <br> runs (逐段对照's
 * translation-side counterpart of wrapper.sourceBreakGroups). A run of <br>s
 * with only whitespace between them is ONE separator. Safe on our HTML: text
 * is entity-escaped by restoreInline, so a literal "<br" can only be a real
 * break tag (reproduced from the source's own serialized fragments).
 */
export function splitHtmlByBreaks(html: string): string[] {
  return html.split(/(?:<br\b[^>]*\/?>\s*)+/gi);
}
