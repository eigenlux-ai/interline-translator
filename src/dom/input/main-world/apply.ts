/**
 * @module dom/input/main-world/apply
 *
 * MAIN-WORLD editor access. This module runs in the PAGE's realm (via the
 * `editor-injector` content script, `world: 'MAIN'`), so it can see the expandos
 * a content script cannot: `el.__quill`, `el.__lexicalEditor`, `el.cmTile`,
 * `window.monaco`, and React fiber keys. Model-managed editors (Slate, Lexical,
 * Quill, CodeMirror, ProseMirror, Monaco…) roll the DOM back to their internal
 * document, so DOM-level edits are reverted — the only reliable read AND write
 * is through the editor's OWN instance API.
 *
 * Contract: `resolveEditor(el)` returns a handle `{ read, write }` from the
 * FIRST adapter whose instance is reachable from `el` — exactly one adapter
 * writes to prevent double-mutations. `applyToEditor` then:
 *   1. reads the model → identity translations short-circuit as 'applied'
 *      (a no-op is success, NOT a cue to try more destructive strategies);
 *   2. compares against the caller's `expectedBefore` → 'raced' aborts the
 *      write atomically at the last moment (the user kept typing while the
 *      translation was in flight);
 *   3. writes, settles a frame, and verifies via `read()` — model truth, so
 *      editors that paint async (CodeMirror, Monaco) can't false-negative.
 *
 * The pure builders (`buildLexicalState`, `slateStart/End/Text`, `lexicalText`,
 * `textToParagraphHtml`) are exported for unit tests; the instance glue needs a
 * real editor and is verified in a live browser.
 */

/* eslint-disable @typescript-eslint/no-explicit-any -- page-realm editor instances are untyped by nature */

import { squashWhitespace, stripTriggerSpaces, type RichSnapshot } from '../protocol';

const settle = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * An editor reachable from a DOM node: read its model text, replace it all.
 *
 * `readRich`/`writeRich` are the editor's OWN document round-trip, present only
 * on adapters whose instance exposes both halves (CKEditor's getData/setData,
 * TipTap's getHTML/setContent, Lexical's editor state…). They exist for ONE
 * caller — the 撤销 baseline — so a translated document can be put back with its
 * bold/links/lists intact; translations themselves are always written as plain
 * text through `write`. An adapter that cannot round-trip its markup simply
 * omits the pair and undoes plain text, which is what every adapter did before.
 */
export interface EditorHandle {
  read: () => string;
  write: (text: string) => void;
  readRich?: () => string;
  writeRich?: (snapshot: string) => void;
}

/**
 * The rich half of a handle — `{}` unless BOTH ends of the round-trip are
 * reachable. Never half a pair: a snapshot we could not write back would make
 * 撤销 silently do nothing, which is worse than restoring plain text.
 */
function richIf(
  available: boolean,
  readRich: () => string,
  writeRich: (snapshot: string) => void
): Pick<EditorHandle, 'readRich' | 'writeRich'> {
  return available ? { readRich, writeRich } : {};
}

// ─────────────────────────────── React fiber ────────────────────────────────

/** The React fiber attached to a DOM node (main world only — the key is a page expando). */
function reactFiber(el: Element): any {
  const key = Object.keys(el).find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
  return key ? (el as any)[key] : null;
}

/** Walk up the fiber tree, returning the first prop/state value that `pick` accepts. */
function fiberFind(el: Element, pick: (node: any) => any): any {
  let fiber = reactFiber(el);
  for (let hops = 0; fiber && hops < 60; hops++, fiber = fiber.return) {
    const hit = pick(fiber.memoizedProps) ?? pick(fiber.stateNode) ?? pick(fiber.memoizedState);
    if (hit) return hit;
  }
  return null;
}

// ─────────────────────────────────── Slate ──────────────────────────────────

type SlatePoint = { path: number[]; offset: number };

/** Leftmost text point of a Slate document (descend firstborn to a text leaf). */
export function slateStart(children: any[]): SlatePoint {
  const path: number[] = [];
  let node: any = { children };
  while (node?.children?.length) {
    path.push(0);
    node = node.children[0];
  }
  return { path, offset: 0 };
}

/** Rightmost text point of a Slate document (descend lastborn, offset = leaf length). */
export function slateEnd(children: any[]): SlatePoint {
  const path: number[] = [];
  let node: any = { children };
  while (node?.children?.length) {
    const i = node.children.length - 1;
    path.push(i);
    node = node.children[i];
  }
  return { path, offset: typeof node?.text === 'string' ? node.text.length : 0 };
}

/** Plain text of a Slate document — top-level blocks joined with newlines. */
export function slateText(children: any[]): string {
  const nodeText = (n: any): string =>
    typeof n?.text === 'string' ? n.text : ((n?.children ?? []) as any[]).map(nodeText).join('');
  return children.map(nodeText).join('\n');
}

/** A value that looks like a Slate editor (raw op API), whether `n` or `n.editor`. */
function asSlateEditor(n: any): any {
  const cand = n && typeof n.insertText === 'function' ? n : n?.editor;
  return cand &&
    typeof cand.insertText === 'function' &&
    typeof cand.apply === 'function' &&
    Array.isArray(cand.children)
    ? cand
    : null;
}

/**
 * Slate editor instances (from `withReact(createEditor())`) carry `insertText`,
 * `apply`, `children`, `selection`. We reach one via the React fiber on the
 * `[data-slate-editor]` node (slate-react passes it as `memoizedProps.editor`
 * up the tree), set an expanded selection over the whole document with a raw
 * `set_selection` op (no `slate` import needed), then `insertText` — which
 * deletes the expanded selection before inserting, i.e. replaces.
 */
function slateAdapter(el: Element): EditorHandle | null {
  const editor = fiberFind(el, asSlateEditor);
  if (!editor) return null;
  return {
    read: () => slateText(editor.children),
    write: (text) => {
      const anchor = slateStart(editor.children);
      const focus = slateEnd(editor.children);
      editor.apply({ type: 'set_selection', properties: editor.selection, newProperties: { anchor, focus } });
      editor.insertText(text);
    },
  };
}

// ────────────────────────────────── Draft.js ────────────────────────────────

/** A prop bag that looks like a Draft editor's (immutable editorState + onChange). */
function asDraftProps(n: any): { editorState: any; onChange: (s: any) => void } | null {
  const es = n?.editorState;
  return es && typeof es.getCurrentContent === 'function' && typeof n.onChange === 'function' ? n : null;
}

/**
 * Draft.js — fiber → `{ editorState, onChange }` props. The library classes are
 * recovered FROM THE INSTANCE (`editorState.constructor` is EditorState with its
 * `push`/`moveFocusToEnd` statics; `getCurrentContent().constructor` is
 * ContentState with `createFromText`), so no draft-js bundling is needed.
 *
 * Draft state is immutable and REPLACED on every change, so both read and write
 * must re-resolve the fiber per call — a captured editorState goes stale the
 * moment onChange commits.
 */
function draftAdapter(el: Element): EditorHandle | null {
  const body = el.closest('.public-DraftEditor-content');
  if (!body) return null;
  const resolve = () => asDraftProps(fiberFind(body, asDraftProps));
  if (!resolve()) return null;
  return {
    // Read from the RENDERED blocks, not the fiber: the `__reactFiber$` expando
    // can point at the stale ALTERNATE after a commit, whose memoizedProps still
    // hold the pre-write editorState — the DOM always reflects the current one.
    // `[data-block]` children keep the block structure (joined with \n).
    read: () => {
      const blocks = body.querySelectorAll('[data-block]');
      if (blocks.length) return Array.from(blocks, (b) => b.textContent ?? '').join('\n');
      return body.textContent ?? '';
    },
    write: (text) => {
      const props = resolve();
      if (!props) throw new Error('draft editorState unreachable');
      const editorState = props.editorState;
      const EditorState = editorState.constructor;
      const ContentState = editorState.getCurrentContent().constructor;
      // createFromText splits on \n into blocks — multi-paragraph translations keep structure.
      let next = EditorState.push(editorState, ContentState.createFromText(text), 'insert-characters');
      if (typeof EditorState.moveFocusToEnd === 'function') next = EditorState.moveFocusToEnd(next);
      props.onChange(next);
    },
  };
}

// ────────────────────────────────── Lexical ─────────────────────────────────

/**
 * A minimal, universally-valid Lexical editor state: one paragraph per line of
 * `text`. `root`/`paragraph`/`text` are registered in every Lexical editor, so
 * `editor.parseEditorState(json)` + `setEditorState` always applies — no
 * `lexical` `$`-function imports (unreachable even from the main world) needed.
 */
export function buildLexicalState(text: string): string {
  const paragraph = (line: string) => ({
    children:
      line === '' ? [] : [{ detail: 0, format: 0, mode: 'normal', style: '', text: line, type: 'text', version: 1 }],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'paragraph',
    version: 1,
  });
  return JSON.stringify({
    root: {
      children: text.split('\n').map(paragraph),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  });
}

/** Plain text of a serialized Lexical state — top-level blocks joined with newlines. */
export function lexicalText(stateJson: any): string {
  const nodeText = (n: any): string =>
    typeof n?.text === 'string' ? n.text : ((n?.children ?? []) as any[]).map(nodeText).join('');
  return ((stateJson?.root?.children ?? []) as any[]).map(nodeText).join('\n');
}

function lexicalAdapter(el: Element): EditorHandle | null {
  const editor: any =
    (el as any).__lexicalEditor ?? (el.closest('[data-lexical-editor]') as any)?.__lexicalEditor ?? null;
  if (!editor || typeof editor.setEditorState !== 'function' || typeof editor.parseEditorState !== 'function') {
    return null;
  }
  return {
    read: () =>
      typeof editor.getEditorState === 'function'
        ? lexicalText(editor.getEditorState().toJSON())
        : (el.textContent ?? ''),
    write: (text) => editor.setEditorState(editor.parseEditorState(buildLexicalState(text))),
    // Lexical's rich snapshot is its SERIALIZED STATE, not HTML: the instance
    // exposes no HTML serializer (that lives in @lexical/html, unreachable from
    // the page realm), while state JSON is the exact shape `write` already
    // pushes — a byte-exact restore of every node, format and attribute.
    ...richIf(
      typeof editor.getEditorState === 'function',
      () => JSON.stringify(editor.getEditorState().toJSON()),
      (snapshot) => editor.setEditorState(editor.parseEditorState(snapshot))
    ),
  };
}

// ─────────────────────────────────── Quill ──────────────────────────────────

/**
 * wangEditor v5 — slate CORE with its own view layer (no React, so the Slate
 * fiber adapter can't see it). Its DOM↔editor WeakMaps are module-private, but
 * the editable root (`[data-slate-editor]`, which also carries
 * `data-slate-node="value"`) is registered as the value for the editor object
 * itself, and the PUBLIC `DomEditor.toSlateNode` reads exactly that map (its
 * `editor` parameter is unused — null is fine). Only reachable on UMD/CDN
 * builds (`window.wangEditor`); bundled builds expose no global and fall
 * through to the contenteditable chain (verified working — slate-core's
 * beforeinput handler doesn't check isTrusted).
 */
function wangEditorAdapter(el: Element): EditorHandle | null {
  const root = el.closest('[data-slate-editor]');
  if (!root) return null;
  const DomEditor = (window as any).wangEditor?.DomEditor;
  if (typeof DomEditor?.toSlateNode !== 'function') return null;
  let editor: any = null;
  try {
    editor = DomEditor.toSlateNode(null, root);
  } catch {
    return null; // not registered (detached/mid-teardown) — let the chain fall through
  }
  // toSlateNode is typed as a generic slate Node — verify it IS the editor
  // (guards a future version moving the editor-level ELEMENT_TO_NODE entry).
  if (typeof editor?.getText !== 'function' || typeof editor?.setHtml !== 'function') return null;
  return {
    // getText joins top-level blocks with \n — already the plain-text shape we ship.
    read: () => String(editor.getText() ?? ''),
    // setHtml = enable+clear+insert with focus/selection restored; pre-escaped
    // one-<p>-per-line HTML sidesteps its plain-text-vs-HTML sniffing on
    // translations that happen to start with '<'.
    write: (text) => editor.setHtml(textToParagraphHtml(text)),
    // getHtml/setHtml is wangEditor's own document round-trip — the same setter
    // the plain write uses, fed its own output instead of escaped lines.
    ...richIf(
      typeof editor.getHtml === 'function',
      () => String(editor.getHtml() ?? ''),
      (html) => editor.setHtml(html)
    ),
  };
}

function quillAdapter(el: Element): EditorHandle | null {
  // Anchor to the content body — the link tooltip's <input> also lives inside
  // `.ql-container` and must never resolve to the document-wide instance.
  const body = el.closest('.ql-editor');
  if (!body) return null;
  const container = body.parentElement ?? body;
  const Quill = (window as any).Quill;
  // NOT `&&…??`: when the global is absent that yields literal `false`, which
  // `??` keeps — silently killing the `__quill` expando fallback that bundled
  // (global-less) Quill builds rely on.
  const quill: any =
    (typeof Quill?.find === 'function' ? Quill.find(container) : null) ?? (container as any)?.__quill ?? null;
  if (!quill || typeof quill.setText !== 'function') return null;
  return {
    read: () => (typeof quill.getText === 'function' ? String(quill.getText()) : (body.textContent ?? '')),
    write: (text) => quill.setText(text, 'user'), // replaces the whole document
    // dangerouslyPasteHTML(html) replaces the whole document through the
    // clipboard matchers, so Quill re-parses its own markup into deltas — the
    // one HTML entry point that keeps its model in sync. `getSemanticHTML` is
    // Quill 2 only; on 1.x the `.ql-editor` innerHTML IS the document markup
    // (the matchers normalise its cursor/`<br>` artefacts on the way back in).
    ...richIf(
      typeof quill.clipboard?.dangerouslyPasteHTML === 'function',
      () => (typeof quill.getSemanticHTML === 'function' ? String(quill.getSemanticHTML()) : body.innerHTML),
      (html) => quill.clipboard.dangerouslyPasteHTML(html, 'user')
    ),
  };
}

// ───────────────────────────────── CKEditor 5 ───────────────────────────────

/**
 * Plain text of a rendered editable with block boundaries as SINGLE newlines —
 * the inverse of `textToParagraphHtml` (one <p> per line). innerText emits \n\n
 * for a paragraph break (and falls back to textContent semantics on unrendered
 * nodes); folding runs of newlines keeps read↔write round-trips stable for the
 * identity/race comparisons.
 */
function blockText(el: Element): string {
  const raw = el instanceof HTMLElement ? el.innerText : (el.textContent ?? '');
  return raw.replace(/\n{2,}/g, '\n');
}

/** Escape `text` and wrap each line in <p> — for editors whose setter parses HTML. */
export function textToParagraphHtml(text: string): string {
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text
    .split('\n')
    .map((line) => `<p>${escape(line)}</p>`)
    .join('');
}

function ckeditor5Adapter(el: Element): EditorHandle | null {
  // CKEditor 5 hangs its Editor off the editable root as `.ckeditorInstance`.
  const editable = el.closest('.ck-editor__editable, .ck-content') ?? el;
  const editor: any = (editable as any).ckeditorInstance ?? null;
  if (!editor || typeof editor.setData !== 'function') return null;
  return {
    // getData() is HTML; the rendered editable's text is the plain-text truth.
    // innerText, NOT textContent: textContent glues paragraphs ("ab"), which
    // would feed run-together source text to translation. innerText renders a
    // <p> break as \n\n — fold to \n so read round-trips with write (one <p>
    // per line of text).
    read: () => blockText(editable),
    // setData PARSES HTML — raw text with <, >, & would be mangled as markup.
    write: (text) => editor.setData(textToParagraphHtml(text)),
    // getData/setData is CKEditor's own document round-trip, so the undo
    // baseline keeps everything the plain-text read drops.
    ...richIf(
      typeof editor.getData === 'function',
      () => String(editor.getData() ?? ''),
      (html) => editor.setData(html)
    ),
  };
}

// ─────────────────────────────────── TipTap ─────────────────────────────────

function tiptapAdapter(el: Element): EditorHandle | null {
  // TipTap (unlike vanilla ProseMirror) attaches its Editor to the `.ProseMirror`
  // DOM node as `.editor`, so we get a real instance write here.
  const dom = el.closest('.ProseMirror, .tiptap') ?? el;
  const editor: any = (dom as any).editor ?? null;
  if (!editor?.commands || typeof editor.commands.setContent !== 'function') return null;
  return {
    // Default blockSeparator is "\n\n" — ask for "\n" to round-trip with write.
    read: () =>
      typeof editor.getText === 'function' ? String(editor.getText({ blockSeparator: '\n' })) : blockText(dom),
    // setContent parses string input as HTML — escape like CKEditor.
    write: (text) => editor.commands.setContent(textToParagraphHtml(text)),
    // getHTML feeds the very setter the plain write uses, so the restore path
    // is the one TipTap itself documents for replacing a document.
    ...richIf(
      typeof editor.getHTML === 'function',
      () => String(editor.getHTML() ?? ''),
      (html) => editor.commands.setContent(html)
    ),
  };
}

// ─────────────────────────────────── TinyMCE ────────────────────────────────

function tinymceAdapter(el: Element): EditorHandle | null {
  // Inline mode: the instance is on THIS window. Iframe mode: the editable
  // body lives in TinyMCE's about:blank frame while the instance lives in the
  // PARENT window — same-origin by construction, so reach up (we run per-frame
  // via allFrames, and this code executes inside the editor's frame).
  let tinymce: any = (window as any).tinymce;
  if (!tinymce) {
    try {
      tinymce = (window.parent as any)?.tinymce ?? null;
    } catch {
      tinymce = null; // cross-origin parent
    }
  }
  if (!tinymce) return null;
  const body = el.closest('.mce-content-body') ?? el;
  const editors: any[] = typeof tinymce.get === 'function' ? ([] as any[]).concat(tinymce.get() ?? []) : [];
  // Must anchor to THIS element's editor — no `activeEditor` fallback, or TinyMCE
  // would greedily claim every other editor on the page and write to the wrong one.
  const ed = editors.find((e) => e?.getBody && (e.getBody() === body || e.getBody()?.contains(el)));
  if (!ed || typeof ed.setContent !== 'function') return null;
  return {
    // format:'text' emits "\n\n" between paragraphs — fold to round-trip with write.
    read: () =>
      typeof ed.getContent === 'function'
        ? String(ed.getContent({ format: 'text' })).replace(/\n{2,}/g, '\n')
        : blockText(body),
    write: (text) => ed.setContent(textToParagraphHtml(text)),
    // getContent() defaults to format:'html' — TinyMCE's own serialization,
    // written back through the same setter.
    ...richIf(
      typeof ed.getContent === 'function',
      () => String(ed.getContent() ?? ''),
      (html) => ed.setContent(html)
    ),
  };
}

// ───────────────────────────── CodeMirror 6 / 5 ─────────────────────────────

function codemirrorAdapter(el: Element): EditorHandle | null {
  // CM6: the content DOM node carries a ContentView expando whose `.view` is the
  // EditorView (`cmView` or `cmTile` property). Anchor to `.cm-content` only —
  // the search panel's native input lives in `.cm-editor` but outside the content.
  const content = el.closest('.cm-content');
  const view: any = (content as any)?.cmView?.view ?? (content as any)?.cmTile?.view ?? null;
  if (view && typeof view.dispatch === 'function' && view.state) {
    return {
      // Model truth — `.cm-content` textContent is only the VIRTUALIZED viewport.
      read: () => String(view.state.doc.toString()),
      write: (text) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } }),
    };
  }
  // CM5: the hidden textarea conduit sits inside `.CodeMirror`; the search
  // dialog's field is an <input> in `.CodeMirror-dialog` — never claim it.
  if (el.closest('.CodeMirror-dialog')) return null;
  const cm5: any = (el.closest('.CodeMirror') as any)?.CodeMirror ?? null;
  if (cm5 && typeof cm5.setValue === 'function') {
    return {
      read: () => (typeof cm5.getValue === 'function' ? String(cm5.getValue()) : ''),
      write: (text) => cm5.setValue(text),
    };
  }
  return null;
}

// ─────────────────────────────────── Monaco ─────────────────────────────────

function monacoAdapter(el: Element): EditorHandle | null {
  // Only Monaco's OWN input conduit routes here (`.monaco-editor textarea.inputarea`
  // in the shared selector) — auxiliary chrome inputs (find widget) never should,
  // as this handle reads/writes the FULL document model.
  const monaco = (window as any).monaco;
  const editors: any[] = monaco?.editor?.getEditors?.() ?? [];
  const host = el.closest('.monaco-editor') ?? el;
  const ed = editors.find((e) => {
    const dom = e?.getDomNode?.();
    return dom && (dom === host || dom.contains(el) || host.contains?.(dom));
  });
  const model = ed?.getModel?.();
  if (!ed || !model || typeof ed.executeEdits !== 'function') return null;
  return {
    read: () => (typeof model.getValue === 'function' ? String(model.getValue()) : ''),
    write: (text) => ed.executeEdits('interline', [{ range: model.getFullModelRange(), text }]),
  };
}

// ───────────────────────────────── ProseMirror ──────────────────────────────

/**
 * ProseMirror does not expose its EditorView on the DOM by design, so this is a
 * best-effort probe. When unreachable we return null — the isolated world's
 * trusted-beforeinput DOM chain handles vanilla ProseMirror well (verified).
 */
function prosemirrorAdapter(el: Element): EditorHandle | null {
  const pm = el.closest('.ProseMirror') ?? el;
  const desc: any = (pm as any).pmViewDesc;
  const view: any = desc?.view ?? (pm as any).pmView ?? (pm as any).editor?.view ?? null;
  if (!view || typeof view.dispatch !== 'function' || !view.state) return null;
  return {
    read: () => String(view.state.doc.textBetween(0, view.state.doc.content.size, '\n')),
    write: (text) => {
      const { state } = view;
      view.dispatch(state.tr.insertText(text, 0, state.doc.content.size));
    },
  };
}

// ─────────────────────────────────── Registry ───────────────────────────────

type Adapter = { name: string; build: (el: Element) => EditorHandle | null };

const ADAPTERS: Adapter[] = [
  { name: 'slate', build: slateAdapter },
  { name: 'wangeditor', build: wangEditorAdapter }, // slate-core, no fiber — after slate: both anchor [data-slate-editor], neither claims the other's instance
  { name: 'draft', build: draftAdapter },
  { name: 'lexical', build: lexicalAdapter },
  { name: 'quill', build: quillAdapter },
  { name: 'ckeditor5', build: ckeditor5Adapter },
  { name: 'tiptap', build: tiptapAdapter }, // before prosemirror: both match .ProseMirror
  { name: 'tinymce', build: tinymceAdapter },
  { name: 'codemirror', build: codemirrorAdapter },
  { name: 'monaco', build: monacoAdapter },
  { name: 'prosemirror', build: prosemirrorAdapter },
];

/** The first reachable editor instance for `el` — the ONLY one that may write. */
export function resolveEditor(el: Element): { name: string; handle: EditorHandle } | null {
  for (const adapter of ADAPTERS) {
    let handle: EditorHandle | null;
    try {
      handle = adapter.build(el);
    } catch {
      continue; // detection threw (hostile expando) — try the next adapter
    }
    if (handle) return { name: adapter.name, handle };
  }
  return null;
}

/** What one read of an editor yields: its model text, plus the 撤销 snapshot when it has one. */
export interface EditorRead {
  text: string;
  rich?: RichSnapshot;
}

/** Read the editor owning `el`, or null when unreachable. */
export function readEditor(el: Element): EditorRead | null {
  const hit = resolveEditor(el);
  if (!hit) return null;
  let text: string;
  try {
    text = hit.handle.read();
  } catch {
    return null;
  }
  // The rich snapshot is strictly best-effort: without it 撤销 restores the plain
  // text, which is all this ever did — so a serializer that throws must not cost
  // us the read that the translation itself depends on.
  try {
    const data = hit.handle.readRich?.();
    if (typeof data === 'string') return { text, rich: { adapter: hit.name, data } };
  } catch {
    /* the editor's serializer threw → plain text is still a valid baseline */
  }
  return { text };
}

export type ApplyOutcome = 'applied' | 'raced' | 'miss';

/**
 * Replace the document of the editor owning `el` with `text`.
 *
 *  - 'applied': the model now shows `text` (including the no-op case where it
 *    already did — an identity translation is success, not a cue to escalate);
 *  - 'raced': the model no longer matches `expectedBefore` — the user kept
 *    typing while the translation was in flight; NOTHING was written;
 *  - 'miss': no instance reachable, or the write didn't take. The bridge maps
 *    this to its DOM-chain fallback.
 *
 * `rich` is 撤销 putting back what it snapshotted: the adapter's own document
 * serialization goes in instead of `text`, so formatting the plain write-back
 * had flattened comes back. `text` stays the verification truth either way —
 * it is the plain text OF that snapshot, so the read-back cycle is unchanged.
 */
export async function applyToEditor(
  el: Element,
  text: string,
  expectedBefore?: string,
  rich?: RichSnapshot
): Promise<ApplyOutcome> {
  const hit = resolveEditor(el);
  if (!hit) return 'miss';
  const { handle } = hit;

  let before: string;
  try {
    before = handle.read();
  } catch {
    return 'miss';
  }

  const beforeStripped = stripTriggerSpaces(before);
  if (before === text || beforeStripped === text) return 'applied'; // identity no-op
  if (expectedBefore !== undefined && beforeStripped !== expectedBefore) return 'raced';

  // Only ever back into the adapter that produced it: the payload is opaque, so
  // handing CKEditor's HTML to Lexical's state parser would corrupt the document
  // we are supposed to be rescuing.
  const snapshot = rich?.adapter === hit.name ? rich.data : undefined;
  try {
    if (snapshot !== undefined && handle.writeRich) handle.writeRich(snapshot);
    else handle.write(text);
  } catch {
    return 'miss'; // exactly one adapter writes — a failed write is a miss, never a cascade
  }

  await settle(24); // let the editor's own update cycle flush before reading back
  try {
    const now = handle.read();
    // Whitespace-squashed containment: adapters serialize block boundaries
    // differently than the \n's in `text` (see squashWhitespace) — an exact
    // includes() false-misses a landed multi-line write, and the resulting
    // 'miss' sends the bridge to the DOM chain, which then mangles the very
    // editor that just applied cleanly.
    const wanted = squashWhitespace(text);
    if (wanted && squashWhitespace(now).includes(wanted) && stripTriggerSpaces(now) !== beforeStripped) {
      return 'applied';
    }
  } catch {
    /* read-back threw → treat as miss */
  }
  return 'miss';
}
