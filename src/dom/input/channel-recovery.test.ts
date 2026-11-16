import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { startResponder } from '@/entrypoints/editor-injector.content/responder';
import { injectViaMainWorld, readViaMainWorld } from './injector-bridge';
import {
  closeInjectorPort,
  injectorPort,
  invalidateInjectorPort,
  receiveInjectorPortOffer,
  resetInjectorPortForTests,
} from './port-handshake';

let stopResponder: (() => void) | undefined;
let stopReceiver: (() => void) | undefined;
let initialWindowListeners: EventListenerOrEventListenerObject[];

function mountEditor(parent: Node = document.body) {
  const el = document.createElement('div');
  el.className = 'cm-content';
  el.textContent = 'Only the visible fragment';
  let value = 'The complete editor model';
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
  Object.assign(el, { cmTile: { view } });
  parent.appendChild(el);
  return { el, view, value: () => value };
}

beforeEach(() => {
  resetInjectorPortForTests();
  document.body.innerHTML = '';
  // happy-dom drops transferred ports. Preserve the browser event shape and
  // asynchronous delivery while exercising both real protocol endpoints.
  vi.spyOn(window, 'postMessage').mockImplementation(((data: unknown, origin: string, ports?: MessagePort[]) => {
    queueMicrotask(() =>
      window.dispatchEvent(
        new MessageEvent('message', {
          data,
          origin,
          source: window,
          ports: ports ?? [],
        })
      )
    );
  }) as typeof window.postMessage);
  stopReceiver = receiveInjectorPortOffer();
  const added = vi.spyOn(window, 'addEventListener');
  stopResponder = startResponder();
  initialWindowListeners = added.mock.calls.filter(([type]) => type === 'message').map(([, listener]) => listener);
});
afterEach(() => {
  stopReceiver?.();
  closeInjectorPort();
  stopResponder?.();
  resetInjectorPortForTests();
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

it('keeps early closed roots and a healthy port across repeated late bootstraps', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const shadow = host.attachShadow({ mode: 'closed' });
  const editor = mountEditor(shadow);
  const first = await injectorPort();
  const hook = Element.prototype.attachShadow;
  startResponder();
  startResponder();
  expect(Element.prototype.attachShadow).toBe(hook);
  expect(await injectorPort()).toBe(first);
  expect(await readViaMainWorld(editor.el)).toEqual({ text: editor.value() });
});

it('reconnects a closed cached port and ignores later invalidation of its predecessor', async () => {
  const editor = mountEditor();
  const first = await injectorPort();
  expect(first).not.toBeNull();
  first!.close();
  expect(await readViaMainWorld(editor.el)).toEqual({ text: editor.value() });
  const replacement = await injectorPort();
  expect(replacement).not.toBe(first);
  invalidateInjectorPort(first!);
  expect(await injectorPort()).toBe(replacement);
});

it('repairs erased window listeners after document root replacement', async () => {
  const first = await injectorPort();
  first!.close();
  for (const listener of initialWindowListeners) window.removeEventListener('message', listener);
  const root = document.createElement('html');
  root.append(document.createElement('body'));
  document.documentElement.remove();
  document.append(root);
  const editor = mountEditor();
  // The observer stays attached to Document, not the root that was removed.
  await new Promise((resolve) => setImmediate(resolve));
  expect(await readViaMainWorld(editor.el)).toEqual({ text: editor.value() });
});

it('can read and apply after missing the entire early receiver', async () => {
  stopReceiver?.();
  const editor = mountEditor();
  expect(await readViaMainWorld(editor.el)).toEqual({ text: editor.value() });
  expect(await injectViaMainWorld(editor.el, 'Translated model', { expectedBefore: editor.value() })).toBe('applied');
  expect(editor.value()).toBe('Translated model');
  expect(editor.view.dispatch).toHaveBeenCalledOnce();
});

it('cancels an in-flight handshake without adopting its queued offer after teardown', async () => {
  const pending = injectorPort();
  closeInjectorPort();
  expect(await pending).toBeNull();
  for (let i = 0; i < 3; i++) await new Promise((resolve) => setImmediate(resolve));
  stopResponder?.();
  stopResponder = startResponder();
  // A new bootstrap gets a fresh generation; teardown did not leave the
  // previous pending promise or unsolicited offer cached.
  expect(await injectorPort()).not.toBeNull();
});
