/**
 * @module dom/filter
 *
 * Tag/structural classification for the walk — inline vs skippable vs fully
 * skipped, code/data tags, and the "has any letter" string test. Mostly
 * tag-based so it's testable in happy-dom; the inline test alone consults
 * computed `display` first (see isInlineElement — host CSS re-purposes
 * phrasing tags as layout containers, and the walk must follow the layout).
 * The paint-aware half — is a node actually visible (`isHidden`/`isVisuallyHidden`)
 * and its visible text (`visibleText`) — lives in `./visibility`.
 */

import { DATA_OMNI, PROJECT_PREFIX } from '@/constants';
import { CHIP_MAX_CHARS, CODE_PRE_CLASS, INLINE_TAGS, NON_CONTENT_TAGS, SKIP_TAGS } from './policy';

/** Uppercase tag name — SVG/MathML elements report a lowercase tagName (svg, math). */
function tag(el: Element): string {
  return el.tagName.toUpperCase();
}

/**
 * True for inline phrasing elements — the walk keeps them INSIDE the unit.
 *
 * Layout truth first: modern sites re-purpose phrasing tags as layout
 * containers wholesale (a Tailwind card grid is `<a class="flex flex-col">`
 * full of headings and paragraphs). The tag list alone would swallow such a
 * card into ONE unit — its text flattens into a word-mashed blob, and the
 * gloss lands inside the flex container where it blockifies into a phantom
 * full-width row (aicanvas card-gallery breakage). So when a layout engine
 * reports a real box, computed display decides; the tag list remains the
 * fallback for boxless cases (`none` renders nothing to gloss; `contents`
 * dissolves its box, so its display says nothing about content flow) and for
 * non-layout test engines (happy-dom reports '' on un-styled inline tags).
 */
export function isInlineElement(el: Element): boolean {
  const d = el.ownerDocument.defaultView?.getComputedStyle?.(el).display;
  if (d && d !== 'none' && d !== 'contents') return d.startsWith('inline') || d.startsWith('ruby');
  return INLINE_TAGS.has(tag(el));
}

/** The tag-list HALF of the inline test alone — an element's phrasing NATURE,
 *  ignoring layout. The walk uses the disagreement between the two: an inline
 *  TAG restyled block is typography (a Tailwind `<span class="block">` line
 *  break); a block TAG restyled inline-block may still be a structural card. */
export function isInlineTag(el: Element): boolean {
  return INLINE_TAGS.has(tag(el));
}

/**
 * Computed-style test: an element that paints its own CHROME — border,
 * background, or shadow. A "shell" (pill button, badge, chip: aicanvas's
 * `<span class="inline-flex … border rounded-full">View Component</span>`).
 * The 译文 must treat shells specially on BOTH sides of injection: never
 * reproduce one (a cloned shell renders as a second fake control beside the
 * real one) and prefer to live INSIDE one (so the control itself reads
 * bilingual, instead of a caption dangling outside the chrome). Layout-engine
 * only — no engine reports no paint, so nothing is a shell in happy-dom
 * unless inline styles say so.
 */
export function isShellElement(el: Element): boolean {
  const cs = el.ownerDocument.defaultView?.getComputedStyle?.(el);
  if (!cs) return false;
  if (
    parseFloat(cs.borderTopWidth) > 0 ||
    parseFloat(cs.borderBottomWidth) > 0 ||
    parseFloat(cs.borderLeftWidth) > 0 ||
    parseFloat(cs.borderRightWidth) > 0
  ) {
    return true;
  }
  const bg = cs.backgroundColor;
  if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') return true;
  const shadow = cs.boxShadow;
  return !!shadow && shadow !== 'none';
}

/**
 * A "sentence chip": a DIV restyled to INLINE-level layout carrying a short
 * atomic token inside running text — X's @mention chip (`<div
 * style="display:inline-flex"><img avatar><a>@user</a></div>` mid-tweet) is
 * the founding case. Treating such a chip as a hard recurse boundary shatters
 * the surrounding sentence into per-span fragment units, so the walk keeps it
 * IN-unit and the serializer rides it through as ONE opaque placeholder (like
 * inline code). Deliberately narrow: only DIV (a custom element is inline by
 * DEFAULT — no restyle proven; a BUTTON is a control), only when a layout
 * engine proves the inline restyle, only short text (a card-sized
 * inline-block DIV is structure, not a token), and never with a control
 * inside (a cloned control is a second fake one — the shell disease).
 */
export function isInlineChip(el: Element): boolean {
  if (tag(el) !== 'DIV') return false;
  const d = el.ownerDocument.defaultView?.getComputedStyle?.(el).display;
  if (!d || !d.startsWith('inline')) return false;
  if ((el.textContent ?? '').trim().length > CHIP_MAX_CHARS) return false;
  return !el.querySelector('button, input, select, textarea');
}

/**
 * Tags whose text is CODE/DATA, never visible content (Reddit scatters bootstrap
 * `<script>SML.load(...)</script>` loaders through the light DOM). Unlike
 * `<code>`/`<kbd>` (inline code that IS visible and round-trips), these must be
 * excluded from translatable text AND dropped from the 译文 — never reproduced.
 */
/** True for code/data tags whose text is never visible content. */
export function isNonContent(el: Element): boolean {
  return NON_CONTENT_TAGS.has(tag(el));
}

/**
 * A `<pre>` is skipped only when it structurally reads as CODE — the DIRECT
 * pre>code child shape every Markdown renderer emits, or a highlighter's class
 * fingerprint on the pre or its wrapper. A plain `<pre>` (mail archives,
 * poetry, plaintext READMEs) is real prose that deserves translation — even
 * when it CONTAINS an inline `<code>` snippet deeper in the prose, which is
 * why the child probe is `:scope > code`, not a subtree query.
 */
export function isCodePre(el: Element): boolean {
  if (tag(el) !== 'PRE') return false;
  // The Markdown shape is pre>code AS THE WRAPPER: a direct <code> child and no
  // direct prose text of the pre's own. A prose pre with an inline snippet
  // (`<pre>use <code>--flag</code> here</pre>`) has direct text — not code.
  if (el.querySelector(':scope > code')) {
    const hasDirectText = Array.from(el.childNodes).some((n) => n.nodeType === 3 && (n.textContent ?? '').trim());
    if (!hasDirectText) return true;
  }
  const own = typeof el.className === 'string' ? el.className : '';
  const wrap = el.parentElement && typeof el.parentElement.className === 'string' ? el.parentElement.className : '';
  return CODE_PRE_CLASS.test(own) || CODE_PRE_CLASS.test(wrap);
}

/**
 * Tag-only skip check (void/replaced/non-content tags: input/img/svg/code/…).
 * Unlike isSkippedElement, this does NOT consider the data-omni walk markers —
 * so the traversal can treat such a child as a placeholder without mistaking an
 * already-walked block child for one.
 *
 * A CODE pre counts as skippable, like the old blanket PRE rule: a container
 * with loose prose AROUND a code block must stay ONE leaf unit (the code-pre
 * rides through serialization as a dropped placeholder) — otherwise the loose
 * text is orphaned by the children-only recursion and never translates. The
 * code text itself never leaks into the unit: `visibleText` excludes code-pre
 * subtrees, so a wrapper whose only content is code produces no unit at all.
 */
export function isSkippableTag(el: Element): boolean {
  return SKIP_TAGS.has(tag(el)) || isCodePre(el);
}

/**
 * True when the element declares itself non-content for the a11y tree.
 * Decoration by declaration: the walk skips such blocks, and the in-unit drop
 * (`visibleText` / `serializeInline`) excludes such inline subtrees — the 译文
 * must never reproduce decoration (a facepile of avatar <img>s cloned into a
 * gloss loses its CSS-variable sizing context and renders enormous).
 */
export function isAriaHidden(el: Element): boolean {
  return el.getAttribute('aria-hidden') === 'true';
}

/** True for elements whose entire subtree should be skipped. */
export function isSkippedElement(el: Element): boolean {
  if (SKIP_TAGS.has(tag(el)) || isCodePre(el)) return true;
  if (el.getAttribute('translate') === 'no') return true;
  if (el.classList?.contains('notranslate')) return true;
  // Our own output / already-walked nodes.
  if (el.hasAttribute(DATA_OMNI.translated) || el.hasAttribute(DATA_OMNI.walked)) return true;
  // Editable surfaces — handled by the input-translation path, not page translation.
  const editable = el.getAttribute('contenteditable');
  if (editable === '' || editable === 'true' || editable === 'plaintext-only') return true;
  if (isAriaHidden(el)) return true;
  return false;
}

/**
 * True for OUR OWN shadow hosts (surfaces, gloss tags — every custom element we
 * create carries the project prefix). The shadow walk must never descend into
 * them: translating our own UI would be the ouroboros bug.
 */
export function isOwnShadowHost(el: Element): boolean {
  return el.tagName.toLowerCase().startsWith(`${PROJECT_PREFIX}-`);
}

/**
 * True when `el` sits inside a subtree the WALK would never have entered —
 * a contenteditable editor, a <pre>/skip-tag subtree, translate=no, etc.
 *
 * The walk prunes at ANCESTOR level, so descendants never carry any marker of
 * their own; but mutation records start INSIDE the subtree (typing produces
 * characterData on a line-div deep in the editor). Every dynamic entry point
 * must re-check the chain, or it injects 译文 into content the user is writing
 * (and the editor fights it forever). Crosses shadow boundaries via the host.
 */
export function inSkippedAncestry(el: Element, boundary?: Node): boolean {
  // Inherited contenteditable resolves without a chain walk where supported.
  if ((el as HTMLElement).isContentEditable) return true;
  for (let cur: Element | null = el; cur && cur !== boundary; ) {
    if (SKIP_TAGS.has(tag(cur)) || isCodePre(cur)) return true;
    if (cur.getAttribute('translate') === 'no') return true;
    if (cur.classList?.contains('notranslate')) return true;
    if (cur.getAttribute('aria-hidden') === 'true') return true;
    const editable = cur.getAttribute('contenteditable');
    if (editable === '' || editable === 'true' || editable === 'plaintext-only') return true;
    const root = cur.getRootNode();
    cur = cur.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
  }
  return false;
}

/** Does this string contain anything worth translating (not just numbers/punct/urls)? */
export function hasTranslatableText(text: string): boolean {
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;
  // Strip URLs, then require at least one letter (any script).
  const withoutUrls = trimmed.replace(/https?:\/\/\S+/g, '');
  // \p{L} = any letter; covers Latin, CJK, Cyrillic, Arabic, …
  return /\p{L}/u.test(withoutUrls);
}
