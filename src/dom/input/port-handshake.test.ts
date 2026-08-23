import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { closeInjectorPort, injectorPort, receiveInjectorPortOffer, resetInjectorPortForTests } from './port-handshake';
import { INJECT_ACK, INJECT_BYE, INJECT_HELLO, INJECT_PORT } from './protocol';

/** Ports deliver on the event loop, not on a timer — a few turns drain them. */
const settlePorts = async () => {
  for (let i = 0; i < 3; i++) await new Promise((resolve) => setImmediate(resolve));
};

/**
 * The responder's half of a channel plus the window offer that hands the other
 * half over. happy-dom's own postMessage drops transfers (and reports a `source`
 * that is not `window`), so the offer is dispatched the way Chrome delivers it.
 */
function offerPort(init: { origin?: string; source?: MessageEventSource | null; withPort?: boolean } = {}) {
  const channel = new MessageChannel();
  const received: unknown[] = [];
  channel.port1.onmessage = (e: MessageEvent) => received.push(e.data);
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { __omni: INJECT_PORT },
      origin: init.origin ?? location.origin,
      source: init.source === undefined ? window : init.source,
      ports: init.withPort === false ? [] : [channel.port2],
    })
  );
  return { responder: channel.port1, offered: channel.port2, received };
}

let stopReceiver: (() => void) | null = null;

beforeEach(() => {
  resetInjectorPortForTests();
});

afterEach(() => {
  stopReceiver?.();
  stopReceiver = null;
  resetInjectorPortForTests();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('receiveInjectorPortOffer', () => {
  it('adopts the document_start offer, acks it, and serves it to the bridge with no window traffic', async () => {
    stopReceiver = receiveInjectorPortOffer();
    const { offered, received } = offerPort();
    await settlePorts();

    // The ack is what lets the responder close its spares and stop reading window.
    expect(received).toEqual([{ __omni: INJECT_ACK }]);
    const posted = vi.spyOn(window, 'postMessage');
    await expect(injectorPort()).resolves.toBe(offered);
    expect(posted).not.toHaveBeenCalled();
  });

  it('keeps the first channel when a second offer arrives (a hello that raced the offer)', async () => {
    stopReceiver = receiveInjectorPortOffer();
    const first = offerPort();
    const second = offerPort();
    await settlePorts();

    await expect(injectorPort()).resolves.toBe(first.offered);
    // Only one channel is ever acked — the responder closes the unacked spare.
    expect(second.received).toEqual([]);
  });

  it('ignores an offer that did not come from this window and origin', async () => {
    stopReceiver = receiveInjectorPortOffer();
    offerPort({ origin: 'https://evil.example' });
    offerPort({ source: null });
    offerPort({ withPort: false });
    await settlePorts();

    vi.useFakeTimers();
    const pending = injectorPort();
    await vi.advanceTimersByTimeAsync(400);
    await expect(pending).resolves.toBeNull();
  });
});

describe('injectorPort', () => {
  it('remembers SUCCESS only — a failed handshake is retried on the next gesture', async () => {
    // Gesture 1: nothing answers the hello. The `ping` probe this replaces
    // cached exactly this outcome for the rest of the page's life.
    vi.useFakeTimers();
    const first = injectorPort();
    await vi.advanceTimersByTimeAsync(400);
    await expect(first).resolves.toBeNull();
    vi.useRealTimers();

    // Gesture 2: the responder answers this time. (Gesture 1's own hello may
    // still be in flight — happy-dom delivers window messages on its own timer —
    // so this counts nothing: an extra offer is idempotent, first one wins.)
    const answered = vi.fn(() => offerPort().offered);
    const onHello = (e: MessageEvent) => {
      if ((e.data as { __omni?: string } | null)?.__omni === INJECT_HELLO) answered();
    };
    window.addEventListener('message', onHello);
    const second = await injectorPort();
    window.removeEventListener('message', onHello);

    expect(answered).toHaveBeenCalled();
    expect(second).not.toBeNull();
    // …and the port is now held, so no further handshake is ever posted.
    const posted = vi.spyOn(window, 'postMessage');
    await expect(injectorPort()).resolves.toBe(second);
    expect(posted).not.toHaveBeenCalled();
  });

  it('shares one in-flight handshake between concurrent callers', async () => {
    vi.useFakeTimers();
    const hellos: unknown[] = [];
    const posted = vi.spyOn(window, 'postMessage').mockImplementation((data: unknown) => {
      hellos.push(data);
    });
    const both = Promise.all([injectorPort(), injectorPort()]);
    await vi.advanceTimersByTimeAsync(400);
    await expect(both).resolves.toEqual([null, null]);
    expect(posted).toHaveBeenCalledTimes(1);
    expect(hellos).toEqual([{ __omni: INJECT_HELLO }]);
  });
});

describe('closeInjectorPort', () => {
  it('hands the channel back so the responder can unhook attachShadow', async () => {
    stopReceiver = receiveInjectorPortOffer();
    const { received } = offerPort();
    await settlePorts();
    received.length = 0;

    closeInjectorPort();
    await settlePorts();
    expect(received).toEqual([{ __omni: INJECT_BYE }]);

    // The slot is empty afterwards: a later gesture re-handshakes rather than
    // talking into a channel we already gave back.
    vi.useFakeTimers();
    const pending = injectorPort();
    await vi.advanceTimersByTimeAsync(400);
    await expect(pending).resolves.toBeNull();
  });
});
