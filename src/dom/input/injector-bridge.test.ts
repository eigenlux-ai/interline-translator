import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { injectViaMainWorld, readViaMainWorld } from './injector-bridge';
import { receiveInjectorPortOffer, resetInjectorPortForTests } from './port-handshake';
import { INJECT_ATTR, INJECT_HELLO, INJECT_PORT, INJECT_REQ, INJECT_RES, type InjectRequest } from './protocol';

/**
 * A main-world responder, faked at the wire: it serves whatever arrives on its
 * end of the private channel. (The real one lives in
 * entrypoints/editor-injector.content/responder — this file is about the
 * isolated half.)
 */
function fakeResponder() {
  const channel = new MessageChannel();
  const served: InjectRequest[] = [];
  channel.port1.onmessage = (e: MessageEvent) => {
    const req = e.data as InjectRequest;
    if (req.__omni !== INJECT_REQ) return;
    served.push(req);
    channel.port1.postMessage({
      __omni: INJECT_RES,
      id: req.id,
      status: req.op === 'read' ? 'ok' : 'applied',
      ...(req.op === 'read'
        ? { text: 'the source text', rich: { adapter: 'ckeditor5', data: '<p>the source text</p>' } }
        : {}),
    });
  };
  /** Hand the other end over the way Chrome does: transferred, not serialized. */
  const offer = () =>
    window.dispatchEvent(
      new MessageEvent('message', {
        data: { __omni: INJECT_PORT },
        origin: location.origin,
        source: window,
        ports: [channel.port2],
      })
    );
  return { served, offer };
}

/** Every payload any page script could pick up off `window`, in order. */
function watchPageWorld(): { seen: unknown[]; stop: () => void } {
  const seen: unknown[] = [];
  const onMessage = (e: MessageEvent) => seen.push(e.data);
  window.addEventListener('message', onMessage);
  const posted = vi.spyOn(window, 'postMessage');
  return {
    seen,
    stop: () => {
      window.removeEventListener('message', onMessage);
      for (const call of posted.mock.calls) seen.push(call[0]);
      posted.mockRestore();
    },
  };
}

function mountEditor(): Element {
  const el = document.createElement('div');
  el.className = 'ProseMirror';
  el.setAttribute('contenteditable', 'true');
  document.body.append(el);
  return el;
}

let stopReceiver: (() => void) | null = null;

beforeEach(() => {
  resetInjectorPortForTests();
  document.body.innerHTML = '';
  stopReceiver = receiveInjectorPortOffer();
});

afterEach(() => {
  stopReceiver?.();
  stopReceiver = null;
  resetInjectorPortForTests();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('injectViaMainWorld', () => {
  it('never puts the translation where the page can hear it', async () => {
    const el = mountEditor();
    const responder = fakeResponder();
    responder.offer();
    const page = watchPageWorld();

    const outcome = await injectViaMainWorld(el, 'THE MODEL OUTPUT', { expectedBefore: 'the source text' });
    page.stop();

    expect(outcome).toBe('applied');
    // It reached the responder…
    expect(responder.served).toEqual([
      expect.objectContaining({ op: 'apply', text: 'THE MODEL OUTPUT', before: 'the source text' }),
    ]);
    // Translation payload never crosses the window object, preventing page scripts from intercepting it.
    expect(JSON.stringify(page.seen)).not.toContain('THE MODEL OUTPUT');
  });

  it('clears its nonce off the host element once the round-trip is done', async () => {
    const el = mountEditor();
    fakeResponder().offer();
    await injectViaMainWorld(el, 'x', { expectedBefore: 'y' });
    expect(el.hasAttribute(INJECT_ATTR)).toBe(false);
  });

  it('retries the handshake on the next gesture instead of caching one failure', async () => {
    const el = mountEditor();

    // Gesture 1: the main thread is busy and nothing answers the handshake.
    vi.useFakeTimers();
    const first = injectViaMainWorld(el, 'THE MODEL OUTPUT', { expectedBefore: 'the source text' });
    await vi.advanceTimersByTimeAsync(400);
    expect(await first).toBe('miss');
    vi.useRealTimers();

    // Gesture 2: the responder answers the hello. The cached `ping` probe this
    // replaces left the whole main-world path dead until a page reload.
    const responder = fakeResponder();
    const onHello = (e: MessageEvent) => {
      if ((e.data as { __omni?: string } | null)?.__omni === INJECT_HELLO) responder.offer();
    };
    window.addEventListener('message', onHello);
    const second = await injectViaMainWorld(el, 'THE MODEL OUTPUT', { expectedBefore: 'the source text' });
    window.removeEventListener('message', onHello);

    expect(second).toBe('applied');
    expect(responder.served).toHaveLength(1);
  });

  it("resolves 'miss' without waiting out the full gesture budget when the page has no responder", async () => {
    const el = mountEditor();
    vi.useFakeTimers();
    const pending = injectViaMainWorld(el, 'x', { timeoutMs: 60_000 });
    await vi.advanceTimersByTimeAsync(400);
    expect(await pending).toBe('miss');
  });
});

describe('readViaMainWorld', () => {
  it('carries the model text and its rich snapshot back over the channel', async () => {
    const el = mountEditor();
    fakeResponder().offer();
    const page = watchPageWorld();

    const snapshot = await readViaMainWorld(el);
    page.stop();

    expect(snapshot).toEqual({
      text: 'the source text',
      rich: { adapter: 'ckeditor5', data: '<p>the source text</p>' },
    });
    expect(JSON.stringify(page.seen)).not.toContain('the source text');
  });
});
