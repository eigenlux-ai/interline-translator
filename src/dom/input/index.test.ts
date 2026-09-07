// @vitest-environment happy-dom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { InputTranslator } from './index';

const { translate } = vi.hoisted(() => ({ translate: vi.fn() }));
vi.mock('@/services/translation/contract', () => ({
  getTranslationService: () => ({ translate, detectLang: vi.fn(), validateProvider: vi.fn() }),
}));
vi.mock('@/services/keep-alive', () => ({ withKeepAlive: (fn: () => unknown) => fn() }));

const { injectViaMainWorld, richSnapshot } = vi.hoisted(() => ({
  injectViaMainWorld: vi.fn(async () => 'applied' as const),
  richSnapshot: { adapter: 'ckeditor5', data: '<p>hello <strong>world</strong></p>' },
}));
// Stands in for the main world (a real one needs the page realm). Scoped to the
// CKEditor stand-in below by design: every other case here uses a native field,
// which must keep taking the DOM route.
vi.mock('./injector-bridge', () => ({
  isMainWorldEditor: (el: Element) => el.closest('.ck-content') !== null,
  readViaMainWorld: async () => ({ text: 'hello world', rich: richSnapshot }),
  injectViaMainWorld,
}));

const tick = (ms = 10) => new Promise((r) => setTimeout(r, ms));
function pressSpace(el: Element, init: KeyboardEventInit = {}, { trusted = true } = {}) {
  const e = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true, ...init });
  // Constructed events are untrusted by spec; the controller (rightly) ignores
  // those — mark the simulated user keystrokes as trusted.
  if (trusted) Object.defineProperty(e, 'isTrusted', { value: true });
  el.dispatchEvent(e);
}

beforeEach(() => {
  translate.mockReset();
  translate.mockResolvedValue({ text: '你好', providerId: 'mock' });
  injectViaMainWorld.mockClear();
  document.body.innerHTML = '';
});

describe('InputTranslator', () => {
  it('translates and replaces an input on the 3-space trigger', async () => {
    const input = document.createElement('input');
    input.value = 'hello';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();

    expect(translate).toHaveBeenCalledOnce();
    expect(translate.mock.calls[0][0]).toMatchObject({ text: 'hello', target: 'zh-CN' });
    expect(input.value).toBe('你好');
    t.stop();
  });

  it('does not fire during IME composition', async () => {
    const input = document.createElement('input');
    input.value = '你';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'en' });
    t.start();

    pressSpace(input, { isComposing: true });
    pressSpace(input, { isComposing: true });
    pressSpace(input, { isComposing: true });
    await tick();

    expect(translate).not.toHaveBeenCalled();
    t.stop();
  });

  it('honours a /lang prefix', async () => {
    const input = document.createElement('input');
    input.value = '/ja hello';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();

    expect(translate.mock.calls[0][0]).toMatchObject({ text: 'hello', target: 'ja' });
    t.stop();
  });

  it('ignores synthetic (untrusted) keydowns — a page cannot fabricate the trigger', async () => {
    const input = document.createElement('input');
    input.value = 'hello';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(input, {}, { trusted: false });
    pressSpace(input, {}, { trusted: false });
    pressSpace(input, {}, { trusted: false });
    await tick();

    expect(translate).not.toHaveBeenCalled();
    t.stop();
  });

  it('does not count chorded spaces (Ctrl/Alt/Meta+Space are commands, not typing)', async () => {
    const input = document.createElement('input');
    input.value = 'hello';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(input, { ctrlKey: true }); // Windows IME toggle
    pressSpace(input, { ctrlKey: true });
    pressSpace(input, { ctrlKey: true });
    await tick();

    expect(translate).not.toHaveBeenCalled();
    t.stop();
  });

  it('drops the translation when focus moved to another field while in flight', async () => {
    const input = document.createElement('input');
    input.value = 'hello';
    const other = document.createElement('input');
    document.body.append(input, other);
    input.focus();
    // Translation resolves only AFTER the user has moved on.
    translate.mockImplementation(async () => {
      other.focus();
      return { text: '你好', providerId: 'mock' };
    });
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();

    expect(input.value).toBe('hello'); // untouched — no write into a field the user left
    t.stop();
  });

  it('keeps the draft when the engine returns an EMPTY translation (no destructive wipe)', async () => {
    translate.mockResolvedValue({ text: '', providerId: 'mock' }); // think-only output / untranslatable
    const input = document.createElement('input');
    input.value = 'my precious draft';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();

    expect(input.value).toBe('my precious draft'); // untouched — '' is nothing to show, not a replacement
    t.stop();
  });

  it('the undo pill ends at the NEXT keystroke (Enter-to-send left it floating over a sent chat)', async () => {
    const input = document.createElement('input');
    input.value = '你好';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'en' });
    translate.mockResolvedValue({ text: 'hello', providerId: 'mock' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();
    expect(document.querySelector('aie-omt-input-hint')).not.toBeNull(); // undo pill up

    // The user hits Enter to SEND the message.
    const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    Object.defineProperty(enter, 'isTrusted', { value: true });
    input.dispatchEvent(enter);

    expect(document.querySelector('aie-omt-input-hint')).toBeNull(); // window over, pill gone
    t.stop();
  });

  it('Cmd/Ctrl+Z within the undo window restores the original (Meta keydown alone must not eat the window)', async () => {
    const input = document.createElement('input');
    input.value = '你好';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'en' });
    translate.mockResolvedValue({ text: 'hello', providerId: 'mock' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();
    expect(input.value).toBe('hello');

    // Cmd+Z arrives as TWO keydowns: bare Meta first, then z+meta.
    const meta = new KeyboardEvent('keydown', { key: 'Meta', metaKey: true, bubbles: true, cancelable: true });
    Object.defineProperty(meta, 'isTrusted', { value: true });
    input.dispatchEvent(meta);
    expect(document.querySelector('aie-omt-input-hint')).not.toBeNull(); // window survives the bare modifier

    const z = new KeyboardEvent('keydown', { key: 'z', metaKey: true, bubbles: true, cancelable: true });
    Object.defineProperty(z, 'isTrusted', { value: true });
    input.dispatchEvent(z);
    await tick();

    expect(input.value).toBe('你好'); // restored
    expect(document.querySelector('aie-omt-input-hint')).toBeNull();
    t.stop();
  });

  it('a mouse click elsewhere ends the undo window (clicking SEND instead of Enter)', async () => {
    const input = document.createElement('input');
    input.value = '你好';
    const sendButton = document.createElement('button');
    document.body.append(input, sendButton);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'en' });
    translate.mockResolvedValue({ text: 'hello', providerId: 'mock' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();
    expect(document.querySelector('aie-omt-input-hint')).not.toBeNull();

    const click = new PointerEvent('pointerdown', { bubbles: true });
    Object.defineProperty(click, 'isTrusted', { value: true });
    sendButton.dispatchEvent(click);

    expect(document.querySelector('aie-omt-input-hint')).toBeNull();
    expect(input.value).toBe('hello'); // dismissal never restores — only Z/pill do
    t.stop();
  });

  it('skips password inputs', async () => {
    const input = document.createElement('input');
    input.type = 'password';
    input.value = 'secret';
    document.body.appendChild(input);
    input.focus();
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(input);
    pressSpace(input);
    pressSpace(input);
    await tick();

    expect(translate).not.toHaveBeenCalled();
    t.stop();
  });

  it("撤销 restores the editor's OWN markup, not the flattened text it read", async () => {
    const editable = document.createElement('div');
    editable.className = 'ck-content';
    editable.setAttribute('contenteditable', 'true');
    editable.innerHTML = '<p>hello <strong>world</strong></p>';
    document.body.appendChild(editable);
    editable.focus();
    translate.mockResolvedValue({ text: '你好世界', providerId: 'mock' });
    const t = new InputTranslator({ defaultTarget: 'zh-CN' });
    t.start();

    pressSpace(editable);
    pressSpace(editable);
    pressSpace(editable);
    await tick();

    // The translation itself still goes in as plain text, race guard armed.
    expect(injectViaMainWorld).toHaveBeenNthCalledWith(1, editable, '你好世界', { expectedBefore: 'hello world' });

    const z = new KeyboardEvent('keydown', { key: 'z', metaKey: true, bubbles: true, cancelable: true });
    Object.defineProperty(z, 'isTrusted', { value: true });
    editable.dispatchEvent(z);
    await tick();

    // …and the restore carries the snapshot, so <strong> comes back. Restoring
    // `original` alone would put the draft back as one flat line of text.
    expect(injectViaMainWorld).toHaveBeenNthCalledWith(2, editable, 'hello world', { rich: richSnapshot });
    t.stop();
  });
});

it('stop prevents an in-flight translation from modifying the draft', async () => {
  let release!: (value: { text: string; providerId: string }) => void;
  translate.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        release = resolve;
      })
  );
  const input = document.createElement('input');
  input.value = 'original draft';
  document.body.append(input);
  input.focus();
  const t = new InputTranslator({ defaultTarget: 'zh-CN' });
  t.start();
  pressSpace(input);
  pressSpace(input);
  pressSpace(input);
  await tick();
  t.stop();
  release({ text: 'translated draft', providerId: 'mock' });
  await tick();
  expect(input.value).toBe('original draft');
});
