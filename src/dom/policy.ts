/**
 * @module dom/policy
 *
 * THE decision table of the injection line. Every tag set / class fingerprint
 * / display list that decides how an element is treated lives HERE — the
 * algorithms stay in their stage modules, but when a new site pattern needs a
 * policy tweak, this file is the one place to patch.
 *
 * The pipeline asks four questions, in order; each stage's algorithm home and
 * the policy data it consumes:
 *
 * | # | question             | algorithm home                            | policy data                                |
 * |---|----------------------|-------------------------------------------|--------------------------------------------|
 * | 1 | element class?       | filter.ts — isInlineElement, isInlineTag, | SKIP_TAGS, INLINE_TAGS, NON_CONTENT_TAGS,  |
 * |   |                      | isSkippableTag, isSkippedElement,         | CODE_PRE_CLASS, CHIP_MAX_CHARS             |
 * |   |                      | isShellElement, isInlineChip, isCodePre   |                                            |
 * | 2 | unit boundary?       | traversal.ts — isLeafBlock, isLinkGroup,  | (stage-1 predicates only)                  |
 * |   |                      | unwrapSoleWrapper                         |                                            |
 * | 3 | serialization        | inject/placeholder.ts — serializeInline,  | DROP_FROM_GLOSS, OPAQUE_SCRUB_SELECTOR     |
 * |   | treatment?           | opaqueFragment, restoreInline; plus       | (visibleText reads the drop set too: a     |
 * |   |                      | visibility.ts — visibleText               | unit is keyed by the text a gloss carries) |
 * |   |                      |                                           | DROP_ATTRS_FROM_GLOSS + EVENT_HANDLER_ATTR |
 * | 4 | injection site &     | inject/wrapper.ts — ensureGlossNode,      | NEWLINE_PRESERVING, NO_CARVE_TAGS;         |
 * |   | interleave carving?  | inlineHost, sourceNewlineRuns; plus       | TABLE_PARENT_TAGS, TABLE_INTERNAL_DISPLAYS |
 * |   |                      | page-translation.ts — chooseMode, placeNl |                                            |
 *
 * Contract between stages: what stage 1 classes as opaque-in-unit must ride
 * stage 3 as ONE placeholder (visibleText counts its text, the gloss
 * reproduces it whole); what stage 2 keeps in-unit must never be something
 * stage 3 would clone as a fake control. When you add a set here, say which
 * stage(s) consume it and why the failure direction is safe.
 */

/** Elements whose subtree must never be translated (walk-level skip; void/
 *  replaced members double as in-unit opaque placeholders — see isSkippableTag). */
export const SKIP_TAGS = new Set([
  'SCRIPT',
  'STYLE',
  'NOSCRIPT',
  'CODE',
  'KBD',
  'SAMP',
  'VAR',
  'TEXTAREA',
  'SVG',
  'CANVAS',
  'IMG',
  'VIDEO',
  'AUDIO',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'MATH',
  'INPUT',
  'SELECT',
  'OPTION',
]);

/** Phrasing/inline elements — they stay INSIDE a translation unit (via
 *  placeholders). The tag list is the boxless FALLBACK half of the inline
 *  test; computed display wins when a layout engine reports one.
 *  The RUBY family and INS/DEL are here for stage 2 (isLeafBlock reads this
 *  list, not computed display, to decide unit boundaries): a `<p>` holding
 *  `<ruby>` was not a leaf, so the walk recursed PAST the sentence into
 *  `<rt>` — the furigana is itself a leaf, so a Japanese page got its
 *  READING translated and the sentence that reading annotates dropped.
 *  Failure direction: a ruby container or a `<del>` diff view restyled block
 *  is caught by the layout half and still recurses; only in a boxless env
 *  can it flatten into one unit — a word-mashed unit, never lost text. */
export const INLINE_TAGS = new Set([
  'A',
  'ABBR',
  'B',
  'BDI',
  'BDO',
  'CITE',
  'DATA',
  'DFN',
  'EM',
  'I',
  'MARK',
  'Q',
  'S',
  'SMALL',
  'SPAN',
  'STRONG',
  'SUB',
  'SUP',
  'TIME',
  'U',
  'WBR',
  'BR',
  'FONT',
  'LABEL',
  'RUBY',
  'RT',
  'RP',
  'RB',
  'RTC',
  'INS',
  'DEL',
]);

/** Tags whose text is CODE/DATA, never visible content (Reddit scatters
 *  bootstrap `<script>SML.load(...)</script>` loaders through the light DOM).
 *  Unlike `<code>`/`<kbd>` (inline code that IS visible and round-trips),
 *  these are excluded from translatable text AND dropped from the 译文. */
export const NON_CONTENT_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE']);

/** Syntax-highlighter class fingerprints — a <pre> carrying one (or wrapped
 *  by one) reads as CODE even without the pre>code shape. */
export const CODE_PRE_CLASS =
  /(?:^|[\s_-])(?:highlight|hljs|prism|shiki|chroma|codehilite|sourcecode|language-|lang-|cm-|monaco)/i;

/** A sentence chip (isInlineChip) must be an atomic token, not a card — cap
 *  its text so an inline-block content card never rides through opaque. */
export const CHIP_MAX_CHARS = 40;

/** Controls + media that must be dropped from the 译文 (never duplicated —
 *  a cloned radio/avatar beside the real one is the shell disease), plus the
 *  ruby ANNOTATION tags. `<rt>`/`<rp>`/`<rtc>` carry a reading of the SOURCE
 *  script (漢字 → かんじ): painted over a 译文 it annotates words that are no
 *  longer there, and left in the payload it makes the engine translate the
 *  same word twice. Only the ruby BASE is content, so only it survives.
 *  Consumed by stage 3 (serializeInline drops these, opaqueFragment scrubs
 *  them) and by visibleText — `<rt>` is the first member here that HAS text,
 *  so the two must now agree explicitly: text the 译文 won't carry must not
 *  key or size the unit either. Failure direction: a dropped reading costs
 *  an annotation, never a sentence. */
export const DROP_FROM_GLOSS = new Set([
  'INPUT',
  'SELECT',
  'TEXTAREA',
  'IMG',
  'SVG',
  'CANVAS',
  'VIDEO',
  'AUDIO',
  'IFRAME',
  'OBJECT',
  'EMBED',
  'MATH',
  'RT',
  'RP',
  'RTC',
]);

/** Everything that must be scrubbed from an opaque fragment before it
 *  re-enters the 译文: media/controls, ruby readings AND aria-hidden
 *  decoration (the per-child drop can't see inside an element that rides
 *  through whole). */
export const OPAQUE_SCRUB_SELECTOR = [...[...DROP_FROM_GLOSS].map((t) => t.toLowerCase()), '[aria-hidden="true"]'].join(
  ','
);

/** Attributes a reproduced inline open tag must NOT carry into the 译文
 *  (stage 3, openTag). serializeInline replays the source's inline tags so
 *  带样式翻译 keeps its formatting — but a tag is more than its look, and the
 *  replay is a COPY standing beside the original:
 *  - `id` / `name` are the document's IDENTITY space. A second `id="brand"`
 *    leaves getElementById resolving to the original (document order), which
 *    is exactly what makes the duplicate silent — meanwhile
 *    querySelectorAll('#brand'), in-page anchor targets and any host script
 *    counting hooks now see two of something the page has one of.
 *  - the id-REFERENCING aria attributes and `for` point AT a real control the
 *    译文 does not own, so a copy re-labels / re-describes that widget from a
 *    decorative twin (and `for` re-targets its click).
 *  - `on*` is host BEHAVIOUR: a reproduced handler fires the page's logic a
 *    second time from a node the page never created.
 *  `class` / `style` / `href` are deliberately KEPT — reproducing inline
 *  formatting (and a link's destination) is what 带样式翻译 promises. This is
 *  DROP_FROM_GLOSS's rule one level down: never clone a control, never clone
 *  a hook. Attribute-only, so it changes nothing about which TEXT a unit
 *  carries — visibleText has no stake in it. Failure direction: a gloss that
 *  looks right but is inert, never a page whose own hooks moved. */
export const DROP_ATTRS_FROM_GLOSS = new Set([
  'id',
  'name',
  'for',
  'aria-labelledby',
  'aria-describedby',
  'aria-controls',
  'aria-owns',
  'aria-flowto',
  'aria-activedescendant',
  'aria-details',
  'aria-errormessage',
]);

/** The `on*` handler family, which is a PREFIX rather than a list (a host page
 *  can carry any of them). Deliberately greedy: a non-handler attribute that
 *  happens to start with `on` costs the 译文 nothing, an unstripped handler
 *  costs the host a second execution. */
export const EVENT_HANDLER_ATTR = /^on[a-z]/;

/** Computed white-space values under which a literal \n renders as a line
 *  break — only there is a newline run a PARAGRAPH separator (elsewhere it
 *  paints as a space and must not trigger interleave carving). */
export const NEWLINE_PRESERVING = new Set(['pre', 'pre-wrap', 'pre-line', 'break-spaces']);

/** Interactive/semantic inline elements a gloss must never be carved INTO:
 *  a segment inserted inside an <a> becomes clickable link content, inside a
 *  <button> becomes button label. Runs under these fall back to whole-block. */
export const NO_CARVE_TAGS = new Set(['A', 'BUTTON', 'LABEL', 'SUMMARY', 'OPTION', 'SELECT', 'TEXTAREA']);

/** Parent tags whose children are table internals: an `afterend` block
 *  sibling of a `<td>`/`<tr>` is a stray non-cell node (invalid table
 *  structure), so such a unit injects inline instead. Tag-based because
 *  non-layout engines (happy-dom) don't report `display: table-*`. */
export const TABLE_PARENT_TAGS = new Set(['TR', 'TBODY', 'THEAD', 'TFOOT', 'TABLE']);

/** Computed `display` values of a parent that make an afterend block sibling
 *  illegal (CSS-driven tables — same rule as TABLE_PARENT_TAGS, layout side). */
export const TABLE_INTERNAL_DISPLAYS = new Set([
  'table',
  'table-row',
  'table-row-group',
  'table-header-group',
  'table-footer-group',
  'inline-table',
]);
