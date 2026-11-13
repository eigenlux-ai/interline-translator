// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceEditableText, setNativeValue } from './replace';

beforeEach(() => {
  document.body.innerHTML = '';
});
afterEach(() => {
  document.body.innerHTML = '';
});

describe('setNativeValue', () => {
  it('sets value via the prototype setter and fires input + change', () => {
    const input = document.createElement('input');
    input.value = 'hello';
    document.body.appendChild(input);
    const onInput = vi.fn();
    const onChange = vi.fn();
    input.addEventListener('input', onInput);
    input.addEventListener('change', onChange);

    setNativeValue(input, '你好');
    expect(input.value).toBe('你好');
    expect(onInput).toHaveBeenCalledOnce();
    expect(onChange).toHaveBeenCalledOnce();
  });
});

describe('replaceEditableText', () => {
  it('replaces an <input>', async () => {
    const input = document.createElement('input');
    input.value = 'hello';
    document.body.appendChild(input);
    expect(await replaceEditableText(input, 'input', '你好')).toBe(true);
    expect(input.value).toBe('你好');
  });

  it('replaces a <textarea>', async () => {
    const ta = document.createElement('textarea');
    ta.value = 'hello world';
    document.body.appendChild(ta);
    expect(await replaceEditableText(ta, 'textarea', '你好世界')).toBe(true);
    expect(ta.value).toBe('你好世界');
  });

  it('replaces a contenteditable, and reports it replaced (not appended)', async () => {
    const ce = document.createElement('div');
    ce.setAttribute('contenteditable', 'true');
    ce.textContent = 'hello';
    document.body.appendChild(ce);
    expect(await replaceEditableText(ce, 'contenteditable', '你好')).toBe(true);
    expect(ce.textContent).toContain('你好');
    expect(ce.textContent).not.toContain('hello'); // the read-back verify's core: old text gone
  });

  it('treats an identity write (translation === current text) as success WITHOUT mutating', async () => {
    const ce = document.createElement('div');
    ce.setAttribute('contenteditable', 'true');
    ce.textContent = 'already target   '; // trailing trigger-space residue
    document.body.appendChild(ce);
    const onInput = vi.fn();
    ce.addEventListener('input', onInput);
    expect(await replaceEditableText(ce, 'contenteditable', 'already target')).toBe(true);
    expect(ce.textContent).toBe('already target   '); // untouched — no destructive escalation
    expect(onInput).not.toHaveBeenCalled();
  });

  it('does not re-set a native field whose value already equals the translation', async () => {
    const input = document.createElement('input');
    input.value = '你好';
    document.body.appendChild(input);
    const onInput = vi.fn();
    input.addEventListener('input', onInput);
    expect(await replaceEditableText(input, 'input', '你好')).toBe(true);
    expect(onInput).not.toHaveBeenCalled();
  });

  it('accepts a multi-line paste that the editor RE-BLOCKS into divs (no destructive fallback)', async () => {
    // An editor that turns each pasted line into its own <div> joins them in
    // textContent ("第一行第二行"), so line verification checks each line individually
    // rather than requiring raw newline characters in textContent.
    const ce = document.createElement('div');
    ce.setAttribute('contenteditable', 'true');
    ce.textContent = 'line one line two';
    document.body.appendChild(ce);
    ce.addEventListener('paste', (e) => {
      const text = (e as ClipboardEvent).clipboardData?.getData('text/plain') ?? '';
      while (ce.firstChild) ce.removeChild(ce.firstChild);
      for (const line of text.split('\n')) {
        const block = document.createElement('div');
        block.textContent = line;
        ce.appendChild(block);
      }
    });

    expect(await replaceEditableText(ce, 'contenteditable', '第一行\n第二行')).toBe(true);
    expect(ce.querySelectorAll('div')).toHaveLength(2); // editor's block structure intact
    expect(ce.textContent).not.toContain('line one');
  });

  it('accepts a translation that CONTAINS the original (no destructive fallback)', async () => {
    // A translation may legitimately retain parts of the source text (e.g. proper nouns,
    // URLs, or echoed identifiers). The write verification checks that the target translation
    // is present rather than failing on residual source substring matches.
    const ce = document.createElement('div');
    ce.setAttribute('contenteditable', 'true');
    ce.textContent = 'Gemini API';
    document.body.appendChild(ce);
    const onInput = vi.fn();
    ce.addEventListener('input', onInput);
    ce.addEventListener('paste', (e) => {
      const text = (e as ClipboardEvent).clipboardData?.getData('text/plain') ?? '';
      // The editor owns its DOM: it wraps the accepted text in its own node,
      // which the Range fallback would delete on escalation.
      while (ce.firstChild) ce.removeChild(ce.firstChild);
      const span = document.createElement('span');
      span.textContent = text;
      ce.appendChild(span);
    });

    expect(await replaceEditableText(ce, 'contenteditable', 'Gemini API（谷歌的接口）')).toBe(true);
    expect(ce.querySelector('span')?.textContent).toBe('Gemini API（谷歌的接口）'); // editor's node intact
    expect(onInput).not.toHaveBeenCalled(); // never reached the Range fallback
  });

  it('still escalates when the editor APPENDS instead of replacing', async () => {
    // The containment guard's reason to exist: text landing NEXT TO the
    // original (editor pasted at a stale selection) is not a replacement.
    const ce = document.createElement('div');
    ce.setAttribute('contenteditable', 'true');
    ce.textContent = 'hello';
    document.body.appendChild(ce);
    ce.addEventListener('paste', (e) => {
      const text = (e as ClipboardEvent).clipboardData?.getData('text/plain') ?? '';
      ce.appendChild(document.createTextNode(text));
    });

    expect(await replaceEditableText(ce, 'contenteditable', '你好')).toBe(true);
    expect(ce.textContent).not.toContain('hello'); // the appending paste was rejected, chain escalated
  });

  it('dispatches events that cross a shadow boundary', async () => {
    // active-element pierces shadow roots to reach Gemini/Discord-style
    // editors, so the write's events must be `composed` too — a framework
    // listener delegated OUTSIDE the root is the only one that hears them.
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: 'open' });
    const input = document.createElement('input');
    input.value = 'hello';
    root.appendChild(input);
    const onInput = vi.fn();
    document.body.addEventListener('input', onInput);

    expect(await replaceEditableText(input, 'input', '你好')).toBe(true);
    expect(onInput).toHaveBeenCalledOnce();
  });
});

it('preserves edits made during the async paste delay', async () => {
  vi.useFakeTimers();
  try {
    const el = document.createElement('div');
    el.contentEditable = 'true';
    el.textContent = 'original draft';
    document.body.append(el);
    const writing = replaceEditableText(el, 'contenteditable', 'translated draft', {
      expectedBefore: 'original draft',
    });
    await vi.advanceTimersByTimeAsync(60);
    el.textContent = 'new text typed by the user';
    await vi.advanceTimersByTimeAsync(100);
    await writing;
    expect(el.textContent).toBe('new text typed by the user');
  } finally {
    vi.useRealTimers();
  }
});

describe('pending paste selection safety', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  function start(start = 14, end = start) {
    const el = document.createElement('div');
    el.contentEditable = 'true';
    el.textContent = 'original draft';
    document.body.append(el);
    el.focus();
    const selection = window.getSelection()!;
    const range = document.createRange();
    range.setStart(el.firstChild!, start);
    range.setEnd(el.firstChild!, end);
    selection.removeAllRanges();
    selection.addRange(range);
    const controller = new AbortController();
    const writing = replaceEditableText(el, 'contenteditable', 'translated draft', { signal: controller.signal });
    return { el, selection, controller, writing };
  }

  it.each(['beforeinput', 'keydown', 'paste', 'cut', 'compositionstart'])(
    'restores the original caret before %s default editing',
    async (event) => {
      const { el, selection, writing } = start();
      expect(selection.toString()).toBe('original draft');
      el.dispatchEvent(new Event(event, { bubbles: true }));
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode('X'));
      await vi.runAllTimersAsync();
      expect(await writing).toBe(false);
      expect(el.textContent).toBe('original draftX');
    }
  );

  it('keeps the full selection for a paste handler that awaits before reading it', async () => {
    const { el, writing } = start();
    let selected = '';
    el.addEventListener('paste', async (event) => {
      const text = (event as ClipboardEvent).clipboardData!.getData('text/plain');
      await Promise.resolve();
      const selection = window.getSelection()!;
      selected = selection.toString();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const span = document.createElement('span');
      span.textContent = text;
      range.insertNode(span);
    });
    await vi.runAllTimersAsync();
    expect(await writing).toBe(true);
    expect(selected).toBe('original draft');
    expect(el.textContent).toBe('translated draft');
    expect(el.querySelector('span')?.textContent).toBe('translated draft');
  });

  it.each([false, true])('accepts the paste handler synthetic beforeinput (async=%s)', async (asyncHandler) => {
    const { el, writing } = start();
    let selected = '';
    el.addEventListener('paste', async (event) => {
      event.preventDefault();
      if (asyncHandler) await Promise.resolve();
      el.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertFromPaste' }));
      const selection = window.getSelection()!;
      selected = selection.toString();
      const range = selection.getRangeAt(0);
      range.deleteContents();
      const span = document.createElement('span');
      span.textContent = (event as ClipboardEvent).clipboardData!.getData('text/plain');
      range.insertNode(span);
    });
    await vi.runAllTimersAsync();
    expect(await writing).toBe(true);
    expect(selected).toBe('original draft');
    expect(el.textContent).toBe('translated draft');
    expect(el.querySelector('span')?.textContent).toBe('translated draft');
  });

  it('guards insertFromPaste before our paste has started', async () => {
    const { el, selection, writing } = start();
    el.dispatchEvent(new InputEvent('beforeinput', { bubbles: true, inputType: 'insertFromPaste' }));
    expect(selection.isCollapsed).toBe(true);
    await vi.runAllTimersAsync();
    expect(await writing).toBe(false);
    expect(el.textContent).toBe('original draft');
  });

  it.each(['beforeinput', 'keydown', 'paste', 'cut', 'compositionstart'])(
    'preserves user editing during paste settle on %s',
    async (event) => {
      const { el, selection, writing } = start();
      await vi.advanceTimersByTimeAsync(120);
      expect(selection.toString()).toBe('original draft');
      el.dispatchEvent(new Event(event, { bubbles: true }));
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode('X'));
      await vi.runAllTimersAsync();
      expect(await writing).toBe(false);
      expect(el.textContent).toBe('original draftX');
    }
  );

  it.each(['abort', 'blur'])('releases selection during paste settle on %s', async (event) => {
    const { el, selection, controller, writing } = start();
    await vi.advanceTimersByTimeAsync(120);
    if (event === 'abort') controller.abort();
    else el.dispatchEvent(new Event('blur'));
    expect(selection.isCollapsed).toBe(true);
    expect(selection.anchorOffset).toBe(14);
    await vi.runAllTimersAsync();
    expect(await writing).toBe(false);
    expect(el.textContent).toBe('original draft');
  });

  it('restores a user selection and leaves subsequent user selection alone', async () => {
    const { el, selection, writing } = start(0, 8);
    el.dispatchEvent(new Event('beforeinput'));
    expect(selection.toString()).toBe('original');
    selection.collapse(el.firstChild!, 3);
    el.dispatchEvent(new Event('beforeinput'));
    expect(selection.anchorOffset).toBe(3);
    await vi.runAllTimersAsync();
    expect(await writing).toBe(false);
  });

  it.each(['abort', 'blur'])('releases the whole-draft selection synchronously on %s', async (event) => {
    const { el, selection, controller, writing } = start();
    if (event === 'abort') controller.abort();
    else el.dispatchEvent(new Event('blur'));
    expect(selection.isCollapsed).toBe(true);
    expect(selection.anchorOffset).toBe(14);
    await vi.runAllTimersAsync();
    expect(await writing).toBe(false);
    expect(el.textContent).toBe('original draft');
  });

  it('does not reclaim a selection the user moved during the wait', async () => {
    const { selection, el, writing } = start();
    selection.collapse(el.firstChild!, 3);
    await vi.runAllTimersAsync();
    expect(await writing).toBe(false);
    expect(selection.anchorOffset).toBe(3);
    expect(el.textContent).toBe('original draft');
  });

  it('accepts an editor-normalized whole-document selection before pasting', async () => {
    const { el, selection, writing } = start();
    // ProseMirror rewrites DIV boundary points to text-node boundary points
    // while synchronizing the same whole-document selection with its model.
    const range = document.createRange();
    range.selectNodeContents(el.firstChild!);
    selection.removeAllRanges();
    selection.addRange(range);
    el.addEventListener('paste', (event) => {
      el.textContent = (event as ClipboardEvent).clipboardData!.getData('text/plain');
    });
    await vi.runAllTimersAsync();
    expect(await writing).toBe(true);
    expect(el.textContent).toBe('translated draft');
  });

  it('restores the caret before user typing even after editor selection normalization', async () => {
    const { el, selection, writing } = start();
    const range = document.createRange();
    range.selectNodeContents(el.firstChild!);
    selection.removeAllRanges();
    selection.addRange(range);
    el.dispatchEvent(new Event('beforeinput'));
    expect(selection.isCollapsed).toBe(true);
    expect(selection.anchorOffset).toBe(14);
    await vi.runAllTimersAsync();
    expect(await writing).toBe(false);
    expect(el.textContent).toBe('original draft');
  });
});
