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
