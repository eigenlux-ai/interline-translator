// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  applyToEditor,
  buildLexicalState,
  lexicalText,
  readEditor,
  resolveEditor,
  slateEnd,
  slateStart,
  slateText,
  textToParagraphHtml,
} from './apply';

beforeEach(() => {
  document.body.innerHTML = '';
});
afterEach(() => {
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('buildLexicalState', () => {
  it('wraps single-line text in one paragraph → one text node, default node types', () => {
    const state = JSON.parse(buildLexicalState('你好世界'));
    expect(state.root.type).toBe('root');
    expect(state.root.children).toHaveLength(1);
    const paragraph = state.root.children[0];
    expect(paragraph.type).toBe('paragraph');
    expect(paragraph.children[0]).toMatchObject({ type: 'text', text: '你好世界', version: 1 });
  });

  it('splits multi-line text into one paragraph per line (empty line → empty paragraph)', () => {
    const state = JSON.parse(buildLexicalState('第一段\n\n第三段'));
    expect(state.root.children).toHaveLength(3);
    expect(state.root.children[0].children[0].text).toBe('第一段');
    expect(state.root.children[1].children).toHaveLength(0);
    expect(state.root.children[2].children[0].text).toBe('第三段');
  });

  it('round-trips through lexicalText (the paired reader)', () => {
    const text = 'a "quoted" line\nsecond line';
    expect(lexicalText(JSON.parse(buildLexicalState(text)))).toBe(text);
  });
});

describe('slateStart / slateEnd / slateText', () => {
  it('spans a single paragraph from offset 0 to the leaf length', () => {
    const children = [{ type: 'paragraph', children: [{ text: 'hello' }] }];
    expect(slateStart(children)).toEqual({ path: [0, 0], offset: 0 });
    expect(slateEnd(children)).toEqual({ path: [0, 0], offset: 5 });
  });

  it('descends firstborn→lastborn across multiple blocks and nested nodes', () => {
    const children = [
      { type: 'paragraph', children: [{ text: 'first' }] },
      { type: 'quote', children: [{ type: 'paragraph', children: [{ text: 'nested last' }] }] },
    ];
    expect(slateStart(children)).toEqual({ path: [0, 0], offset: 0 });
    expect(slateEnd(children)).toEqual({ path: [1, 0, 0], offset: 'nested last'.length });
  });

  it('handles an empty leaf (offset 0)', () => {
    const children = [{ type: 'paragraph', children: [{ text: '' }] }];
    expect(slateEnd(children)).toEqual({ path: [0, 0], offset: 0 });
  });

  it('slateText joins top-level blocks with newlines, concatenating inline leaves', () => {
    const children = [
      { type: 'paragraph', children: [{ text: 'hello ' }, { text: 'world', bold: true }] },
      { type: 'paragraph', children: [{ text: '第二段' }] },
    ];
    expect(slateText(children)).toBe('hello world\n第二段');
  });
});

describe('textToParagraphHtml', () => {
  it('escapes HTML-significant characters so setters that parse HTML cannot mangle text', () => {
    expect(textToParagraphHtml('i <3 u & <b>you</b>')).toBe('<p>i &lt;3 u &amp; &lt;b&gt;you&lt;/b&gt;</p>');
  });

  it('wraps each line in its own paragraph', () => {
    expect(textToParagraphHtml('a\nb')).toBe('<p>a</p><p>b</p>');
  });
});

/** A fake Quill instance driven through the real adapter contract. */
function fakeQuill(initial: string) {
  let doc = `${initial}\n`; // Quill keeps a trailing newline
  return {
    setText: vi.fn((text: string) => {
      doc = `${text}\n`;
    }),
    getText: () => doc,
  };
}

function mountQuillDom(): { body: HTMLElement; container: HTMLElement } {
  const container = document.createElement('div');
  container.className = 'ql-container';
  const body = document.createElement('div');
  body.className = 'ql-editor';
  body.textContent = 'hello';
  container.appendChild(body);
  document.body.appendChild(container);
  return { body, container };
}

describe('resolveEditor — Quill anchoring and instance lookup', () => {
  it('reaches a bundled Quill (no window.Quill global) through the __quill expando', () => {
    const { body, container } = mountQuillDom();
    (container as unknown as { __quill: unknown }).__quill = fakeQuill('hello');
    const hit = resolveEditor(body);
    expect(hit?.name).toBe('quill');
    expect(hit?.handle.read()).toBe('hello\n');
  });

  it('does NOT claim elements outside the content body (e.g. the link-tooltip input)', () => {
    const { container } = mountQuillDom();
    (container as unknown as { __quill: unknown }).__quill = fakeQuill('hello');
    const tooltipInput = document.createElement('input');
    container.appendChild(tooltipInput); // inside .ql-container but NOT .ql-editor
    expect(resolveEditor(tooltipInput)).toBeNull();
  });
});

describe('resolveEditor — CodeMirror 6 (cmTile and cmView expandos)', () => {
  function mountCm6(expando: 'cmTile' | 'cmView', doc: string) {
    const editor = document.createElement('div');
    editor.className = 'cm-editor';
    const content = document.createElement('div');
    content.className = 'cm-content';
    editor.appendChild(content);
    document.body.appendChild(editor);
    let value = doc;
    const view = {
      state: {
        get doc() {
          return { toString: () => value, length: value.length };
        },
      },
      dispatch: vi.fn((tr: { changes: { insert: string } }) => {
        value = tr.changes.insert;
      }),
    };
    (content as unknown as Record<string, unknown>)[expando] = { view };
    return { content, editor, view };
  }

  it.each(['cmTile', 'cmView'] as const)('resolves the EditorView via %s.view', (expando) => {
    const { content } = mountCm6(expando, 'const x = 1');
    const hit = resolveEditor(content);
    expect(hit?.name).toBe('codemirror');
    expect(hit?.handle.read()).toBe('const x = 1'); // model truth, not viewport DOM
  });

  it('does NOT claim inputs outside .cm-content (search panel)', () => {
    const { editor } = mountCm6('cmTile', 'doc');
    const panelInput = document.createElement('input');
    editor.appendChild(panelInput); // inside .cm-editor but NOT .cm-content
    expect(resolveEditor(panelInput)).toBeNull();
  });
});

describe('resolveEditor / applyToEditor — Draft.js via fiber + instance-recovered classes', () => {
  // Minimal stand-ins for Draft's immutable classes — the adapter must recover
  // them from the INSTANCE (constructor statics), never from an import.
  class FakeContentState {
    constructor(readonly text: string) {}
    static createFromText(t: string) {
      return new FakeContentState(t);
    }
    getPlainText(sep: string) {
      return this.text.split('\n').join(sep);
    }
  }
  class FakeEditorState {
    constructor(readonly content: FakeContentState) {}
    static push(_prev: FakeEditorState, content: FakeContentState) {
      return new FakeEditorState(content);
    }
    static moveFocusToEnd(s: FakeEditorState) {
      return s;
    }
    getCurrentContent() {
      return this.content;
    }
  }

  function mountDraft(initial: string) {
    const body = document.createElement('div');
    body.className = 'public-DraftEditor-content';
    body.setAttribute('contenteditable', 'true');
    document.body.appendChild(body);
    const fiber = {
      memoizedProps: {
        editorState: new FakeEditorState(FakeContentState.createFromText(initial)),
        // Simulate React's controlled re-render: onChange commits the NEW state
        // back into the fiber's props (what the adapter's re-resolve must see).
        onChange: vi.fn((next: FakeEditorState) => {
          fiber.memoizedProps.editorState = next;
          body.textContent = next.getCurrentContent().getPlainText('\n');
        }),
      },
      return: null,
    };
    (body as unknown as Record<string, unknown>)['__reactFiber$fake'] = fiber;
    body.textContent = initial;
    return { body, fiber };
  }

  it('resolves via the fiber props and reads plain text from the model', () => {
    const { body } = mountDraft('hello from draftjs');
    const hit = resolveEditor(body);
    expect(hit?.name).toBe('draft');
    expect(hit?.handle.read()).toBe('hello from draftjs');
  });

  it('writes through EditorState.push + onChange and verifies against the RE-RESOLVED state', async () => {
    const { body, fiber } = mountDraft('hello from draftjs');
    await expect(applyToEditor(body, '来自Draft的你好', 'hello from draftjs')).resolves.toBe('applied');
    expect(fiber.memoizedProps.onChange).toHaveBeenCalledOnce();
    expect(fiber.memoizedProps.editorState.getCurrentContent().getPlainText('\n')).toBe('来自Draft的你好');
  });

  it('keeps multi-line structure (createFromText splits blocks on newlines)', async () => {
    const { fiber, body } = mountDraft('one');
    await expect(applyToEditor(body, '第一段\n第二段')).resolves.toBe('applied');
    expect(fiber.memoizedProps.editorState.getCurrentContent().getPlainText('\n')).toBe('第一段\n第二段');
  });

  it('does not claim non-Draft contenteditables', () => {
    const plain = document.createElement('div');
    plain.setAttribute('contenteditable', 'true');
    document.body.appendChild(plain);
    expect(resolveEditor(plain)).toBeNull();
  });
});

describe('applyToEditor — atomic apply semantics', () => {
  function mountWiredQuill(initial: string) {
    const { body, container } = mountQuillDom();
    body.textContent = initial;
    const quill = fakeQuill(initial);
    (container as unknown as { __quill: unknown }).__quill = quill;
    return { body, quill };
  }

  it('applies and verifies against the model', async () => {
    const { body, quill } = mountWiredQuill('hello');
    await expect(applyToEditor(body, '你好', 'hello\n')).resolves.toBe('applied');
    expect(quill.setText).toHaveBeenCalledWith('你好', 'user');
  });

  it('reports an identity translation as applied WITHOUT writing (no destructive escalation)', async () => {
    const { body, quill } = mountWiredQuill('already target');
    await expect(applyToEditor(body, 'already target\n')).resolves.toBe('applied');
    expect(quill.setText).not.toHaveBeenCalled();
  });

  it("reports 'raced' WITHOUT writing when the model drifted from expectedBefore", async () => {
    const { body, quill } = mountWiredQuill('hello\nuser kept typing');
    await expect(applyToEditor(body, '你好', 'hello')).resolves.toBe('raced');
    expect(quill.setText).not.toHaveBeenCalled();
  });

  it("reports 'miss' when no adapter reaches an instance", async () => {
    const orphan = document.createElement('div');
    document.body.appendChild(orphan);
    await expect(applyToEditor(orphan, '你好')).resolves.toBe('miss');
  });
});

describe("applyToEditor — multi-line verify tolerates the editor's block serialization", () => {
  // Verify uses fuzzy line matching rather than exact substring match because
  // multi-line translations land as one <p> per line, and different editor adapters
  // serialize paragraph breaks differently ("", "\n", or "\n\n").
  function mountCk(initial: string) {
    const editable = document.createElement('div');
    editable.className = 'ck-content';
    editable.innerHTML = `<p>${initial}</p>`;
    document.body.appendChild(editable);
    const setData = vi.fn((html: string) => {
      editable.innerHTML = html; // CKEditor renders one <p> per paragraph
    });
    (editable as unknown as { ckeditorInstance: unknown }).ckeditorInstance = { setData };
    return { editable, setData };
  }

  it('CKEditor5: a landed two-paragraph write is applied, not a cascade-triggering miss', async () => {
    const { editable, setData } = mountCk('line one line two');
    await expect(applyToEditor(editable, '第一段\n第二段', 'line one line two')).resolves.toBe('applied');
    expect(setData).toHaveBeenCalledOnce();
    expect(editable.querySelectorAll('p')).toHaveLength(2); // structure intact — no DOM-chain fallback ran
  });

  it('CKEditor5: read() keeps paragraph boundaries (translation source must not glue words)', () => {
    const { editable } = mountCk('one');
    editable.innerHTML = '<p>line one</p><p>line two</p>';
    const hit = resolveEditor(editable);
    expect(hit?.handle.read()).toBe('line one\nline two');
  });

  it('TipTap: verify survives getText\'s block separator; the adapter asks for "\\n"', async () => {
    const dom = document.createElement('div');
    dom.className = 'ProseMirror';
    document.body.appendChild(dom);
    let lines = ['hello there'];
    const editor = {
      getText: vi.fn(
        (opts?: { blockSeparator?: string }) => lines.join(opts?.blockSeparator ?? '\n\n') // TipTap default is \n\n
      ),
      commands: {
        setContent: vi.fn((html: string) => {
          lines = [...html.matchAll(/<p>(.*?)<\/p>/g)].map((m) => m[1]);
        }),
      },
    };
    (dom as unknown as { editor: unknown }).editor = editor;
    await expect(applyToEditor(dom, '你好\n再见', 'hello there')).resolves.toBe('applied');
    expect(editor.commands.setContent).toHaveBeenCalledOnce();
  });
});

describe('resolveEditor — wangEditor v5 via window.wangEditor.DomEditor', () => {
  type WangGlobal = { wangEditor?: { DomEditor?: { toSlateNode?: (e: null, n: Element) => unknown } } };
  const _g = globalThis as unknown as WangGlobal & { window: WangGlobal };

  const mountWangDom = () => {
    const root = document.createElement('div');
    root.setAttribute('data-slate-editor', 'true');
    root.setAttribute('data-slate-node', 'value');
    const p = document.createElement('p');
    p.textContent = 'hello from wang';
    root.appendChild(p);
    document.body.appendChild(root);
    return { root, p };
  };

  const fakeWangEditor = () => {
    const state = { text: 'hello from wang', html: '' };
    return {
      state,
      getText: () => state.text,
      setHtml: (h: string) => {
        state.html = h;
        state.text = h
          .replace(/<\/p>/g, '\n')
          .replace(/<[^>]+>/g, '')
          .replace(/\n$/, '');
      },
      insertText: () => {},
    };
  };

  afterEach(() => {
    delete (window as unknown as WangGlobal).wangEditor;
    document.body.innerHTML = '';
  });

  it('resolves the instance through DomEditor.toSlateNode(null, root) and writes paragraph HTML', () => {
    const { root, p } = mountWangDom();
    const editor = fakeWangEditor();
    (window as unknown as WangGlobal).wangEditor = {
      DomEditor: { toSlateNode: (_e, n) => (n === root ? editor : null) },
    };
    const hit = resolveEditor(p);
    expect(hit?.name).toBe('wangeditor');
    expect(hit?.handle.read()).toBe('hello from wang');
    hit?.handle.write('第一行\n第二行 <tag>');
    expect(editor.state.html).toBe('<p>第一行</p><p>第二行 &lt;tag&gt;</p>'); // escaped, one <p> per line
  });

  it('returns null without the UMD global (bundled build) — the CE chain owns it', () => {
    const { p } = mountWangDom();
    expect(resolveEditor(p)).toBeNull();
  });

  it('rejects a toSlateNode result that is not the editor (future-version guard)', () => {
    const { root, p } = mountWangDom();
    (window as unknown as WangGlobal).wangEditor = {
      DomEditor: { toSlateNode: (_e, n) => (n === root ? { type: 'paragraph', children: [] } : null) },
    };
    expect(resolveEditor(p)).toBeNull();
  });
});

describe('rich undo snapshots — 撤销 must not flatten the document', () => {
  /** A CKEditor 5 stand-in wired through its real getData/setData round-trip. */
  function mountRichCk(html: string) {
    const editable = document.createElement('div');
    editable.className = 'ck-content';
    editable.innerHTML = html;
    document.body.appendChild(editable);
    (editable as unknown as { ckeditorInstance: unknown }).ckeditorInstance = {
      getData: () => editable.innerHTML,
      setData: (next: string) => {
        editable.innerHTML = next;
      },
    };
    return editable;
  }

  it('CKEditor5: translate-then-undo puts the <strong> back (it used to restore flattened text)', async () => {
    const editable = mountRichCk('<p>hello <strong>world</strong></p>');

    // Exactly what the controller snapshots before translating.
    const snap = readEditor(editable);
    expect(snap?.text).toBe('hello world');
    expect(snap?.rich).toEqual({ adapter: 'ckeditor5', data: '<p>hello <strong>world</strong></p>' });

    await expect(applyToEditor(editable, '你好世界', snap?.text)).resolves.toBe('applied');
    expect(editable.innerHTML).toBe('<p>你好世界</p>'); // the translation write-back stays plain, by design

    await expect(applyToEditor(editable, 'hello world', undefined, snap?.rich)).resolves.toBe('applied');
    expect(editable.innerHTML).toBe('<p>hello <strong>world</strong></p>'); // byte-exact, marks and all
  });

  it('Lexical: the snapshot is its own serialized state, so nested formats survive', async () => {
    const dom = document.createElement('div');
    dom.setAttribute('data-lexical-editor', 'true');
    document.body.appendChild(dom);
    const bold = {
      root: {
        children: [
          {
            children: [{ format: 1, text: 'bold draft', type: 'text', version: 1 }],
            type: 'paragraph',
            version: 1,
          },
        ],
        type: 'root',
        version: 1,
      },
    };
    let state = bold;
    const editor = {
      getEditorState: () => ({ toJSON: () => state }),
      parseEditorState: (json: string) => JSON.parse(json),
      setEditorState: vi.fn((next: typeof bold) => {
        state = next;
      }),
    };
    (dom as unknown as { __lexicalEditor: unknown }).__lexicalEditor = editor;

    const snap = readEditor(dom);
    expect(snap?.text).toBe('bold draft');
    expect(snap?.rich?.adapter).toBe('lexical');

    await expect(applyToEditor(dom, '加粗草稿', snap?.text)).resolves.toBe('applied');
    expect(lexicalText(state)).toBe('加粗草稿');
    expect(state.root.children[0].children[0].format).toBe(0); // plain write-back flattened it, as before

    await expect(applyToEditor(dom, 'bold draft', undefined, snap?.rich)).resolves.toBe('applied');
    expect(state.root.children[0].children[0].format).toBe(1); // the bold mark is back
  });

  it('an adapter without a rich round-trip (vanilla ProseMirror) still undoes via the plain path', async () => {
    const pm = document.createElement('div');
    pm.className = 'ProseMirror';
    document.body.appendChild(pm);
    let doc = 'hello world';
    const view = {
      state: {
        get doc() {
          return { textBetween: () => doc, content: { size: doc.length } };
        },
        get tr() {
          return { insertText: (text: string) => ({ text }) };
        },
      },
      dispatch: vi.fn((tr: { text: string }) => {
        doc = tr.text;
      }),
    };
    (pm as unknown as { pmViewDesc: unknown }).pmViewDesc = { view };

    const snap = readEditor(pm);
    expect(snap?.text).toBe('hello world');
    expect(snap?.rich).toBeUndefined(); // no reachable serializer — degrade to plain, never to broken

    await expect(applyToEditor(pm, '你好世界', snap?.text)).resolves.toBe('applied');
    expect(doc).toBe('你好世界');
    await expect(applyToEditor(pm, 'hello world', undefined, snap?.rich)).resolves.toBe('applied');
    expect(doc).toBe('hello world');
  });

  it('refuses a snapshot from another adapter — a remount can swap the reachable instance', async () => {
    const editable = mountRichCk('<p>hello <strong>world</strong></p>');
    await expect(applyToEditor(editable, '你好世界', 'hello world')).resolves.toBe('applied');

    const foreign = { adapter: 'quill', data: '<p>not ours</p>' };
    await expect(applyToEditor(editable, 'hello world', undefined, foreign)).resolves.toBe('applied');
    expect(editable.innerHTML).toBe('<p>hello world</p>'); // plain restore, NOT the foreign payload
  });
});
