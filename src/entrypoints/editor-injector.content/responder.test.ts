import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  INJECT_ACK,
  INJECT_ATTR,
  INJECT_BYE,
  INJECT_HELLO,
  INJECT_PORT,
  INJECT_REQ,
  INJECT_RES,
  type InjectResponse,
} from '@/dom/input/protocol';
import { startResponder } from './responder';

/** Ports deliver on the event loop, not on a timer — a few turns drain them. */
const settlePorts = async () => {
  for (let i = 0; i < 3; i++) await new Promise((resolve) => setImmediate(resolve));
};

const NATIVE_ATTACH_SHADOW = Element.prototype.attachShadow;

/**
 * A CodeMirror 6 stand-in: the adapter reaches the EditorView through the
 * `.cm-content` expando, so this is the smallest thing `readEditor`/`applyToEditor`
 * accept (same recipe as main-world/apply.test).
 */
function mountEditor(doc: string) {
  const editor = document.createElement('div');
  editor.className = 'cm-editor';
  const content = document.createElement('div');
  content.className = 'cm-content';
  editor.append(content);
  document.body.append(editor);
  let value = doc;
  const view = {
    state: {
      get doc() {
        return { toString: () => value, length: value.length };
      },
    },
    dispatch: (tr: { changes: { insert: string } }) => {
      value = tr.changes.insert;
    },
  };
  (content as unknown as Record<string, unknown>).cmTile = { view };
  return { content, current: () => value };
}

interface TestChannel {
  /** Payloads the responder pushed onto our end of the private channel. */
  replies: InjectResponse[];
  /** Everything the responder handed to `window.postMessage`, offers included. */
  windowTraffic: { message: unknown; transfer: MessagePort[] }[];
  send: (payload: unknown) => void;
  /** The responder's next reply — awaits the event, never a duration (`apply` reads back). */
  nextReply: () => Promise<InjectResponse>;
  ack: () => void;
  hello: () => void;
  teardown: () => Promise<void>;
}

function startTestResponder(): TestChannel {
  const windowTraffic: { message: unknown; transfer: MessagePort[] }[] = [];
  const posted = vi.spyOn(window, 'postMessage').mockImplementation(((
    message: unknown,
    _origin: string,
    transfer?: MessagePort[]
  ) => {
    windowTraffic.push({ message, transfer: transfer ?? [] });
  }) as typeof window.postMessage);

  startResponder();
  const offered = windowTraffic.at(-1)?.transfer[0];
  if (!offered) throw new Error('the responder offered no port');

  const replies: InjectResponse[] = [];
  const attach = (port: MessagePort) => {
    port.addEventListener('message', (e: MessageEvent) => replies.push(e.data as InjectResponse));
    port.start();
  };
  attach(offered);

  const nextReply = () => {
    const { promise, resolve } = Promise.withResolvers<InjectResponse>();
    const once = (e: MessageEvent) => {
      offered.removeEventListener('message', once);
      resolve(e.data as InjectResponse);
    };
    offered.addEventListener('message', once);
    return promise;
  };

  return {
    replies,
    windowTraffic,
    nextReply,
    send: (payload: unknown) => offered.postMessage(payload),
    ack: () => offered.postMessage({ __omni: INJECT_ACK }),
    // A hello as Chrome delivers it: same window, same origin (happy-dom's own
    // postMessage reports neither).
    hello: () =>
      window.dispatchEvent(
        new MessageEvent('message', { data: { __omni: INJECT_HELLO }, origin: location.origin, source: window })
      ),
    teardown: async () => {
      offered.postMessage({ __omni: INJECT_BYE });
      await settlePorts();
      posted.mockRestore();
    },
  };
}

let channel: TestChannel | null = null;

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(async () => {
  await channel?.teardown();
  channel = null;
  Element.prototype.attachShadow = NATIVE_ATTACH_SHADOW;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe('startResponder', () => {
  it('offers a port and nothing else — the handover carries no payload', () => {
    channel = startTestResponder();
    expect(channel.windowTraffic).toHaveLength(1);
    expect(channel.windowTraffic[0].message).toEqual({ __omni: INJECT_PORT });
    expect(channel.windowTraffic[0].transfer).toHaveLength(1);
  });

  it('answers read and apply on the channel, never on the window', async () => {
    channel = startTestResponder();
    const editor = mountEditor('the source text');
    editor.content.setAttribute(INJECT_ATTR, 'nonce-1');

    const read = channel.nextReply();
    channel.send({ __omni: INJECT_REQ, id: 'nonce-1', op: 'read' });
    expect(await read).toEqual({ __omni: INJECT_RES, id: 'nonce-1', status: 'ok', text: 'the source text' });

    const applied = channel.nextReply();
    channel.send({
      __omni: INJECT_REQ,
      id: 'nonce-1',
      op: 'apply',
      text: 'THE MODEL OUTPUT',
      before: 'the source text',
    });
    expect(await applied).toEqual({ __omni: INJECT_RES, id: 'nonce-1', status: 'applied' });

    expect(editor.current()).toBe('THE MODEL OUTPUT');
    // The window saw the port offer and not one byte of either document.
    expect(JSON.stringify(channel.windowTraffic.map((t) => t.message))).not.toContain('MODEL OUTPUT');
    expect(channel.windowTraffic).toHaveLength(1);
  });

  it('refuses a nonce two nodes claim, rather than writing into the decoy', async () => {
    channel = startTestResponder();
    const editor = mountEditor('the source text');
    editor.content.setAttribute(INJECT_ATTR, 'nonce-2');
    // What a page can do with a MutationObserver: copy the nonce it just saw
    // onto a node of its own and collect the write.
    const decoy = document.createElement('div');
    decoy.className = 'cm-content';
    decoy.setAttribute(INJECT_ATTR, 'nonce-2');
    document.body.append(decoy);

    const refused = channel.nextReply();
    channel.send({
      __omni: INJECT_REQ,
      id: 'nonce-2',
      op: 'apply',
      text: 'THE MODEL OUTPUT',
      before: 'the source text',
    });

    expect(await refused).toEqual({ __omni: INJECT_RES, id: 'nonce-2', status: 'miss' });
    expect(editor.current()).toBe('the source text');
    expect(decoy.textContent).toBe('');
  });

  it('ignores requests whose op is not on the protocol', async () => {
    channel = startTestResponder();
    const editor = mountEditor('the source text');
    editor.content.setAttribute(INJECT_ATTR, 'nonce-3');

    channel.send({ __omni: INJECT_REQ, id: 'nonce-3', op: 'ping' });
    channel.send({ __omni: INJECT_REQ, op: 'read' });
    await settlePorts();

    // No `ping` oracle left, and no reply is a probe answer either.
    expect(channel.replies).toEqual([]);
  });

  it('replaces a missed offer on hello, and stops reading the window once acked', async () => {
    channel = startTestResponder();

    channel.hello();
    expect(channel.windowTraffic).toHaveLength(2); // a fresh channel for the asker

    channel.ack();
    await settlePorts();
    channel.hello();
    expect(channel.windowTraffic).toHaveLength(2); // paired: the window is done
  });

  it('unhooks attachShadow on BYE and goes quiet', async () => {
    channel = startTestResponder();
    expect(Element.prototype.attachShadow).not.toBe(NATIVE_ATTACH_SHADOW);
    const editor = mountEditor('the source text');
    editor.content.setAttribute(INJECT_ATTR, 'nonce-4');

    await channel.teardown();
    expect(Element.prototype.attachShadow).toBe(NATIVE_ATTACH_SHADOW);

    channel.send({ __omni: INJECT_REQ, id: 'nonce-4', op: 'read' });
    await settlePorts();
    expect(channel.replies).toEqual([]);
    channel = null;
  });
});
