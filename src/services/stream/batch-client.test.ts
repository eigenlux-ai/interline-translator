/**
 * batch-client behavior against a scripted server on fakeBrowser ports.
 *
 * The one that matters most: a port DISCONNECT before `batchDone` must REJECT
 * `handle.done` — the SW being recycled mid-batch is a failure for every
 * segment still pending, and resolving would leave their spinners forever
 * (the page-side consumer only marks errors in its catch branch).
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fakeBrowser } from 'wxt/testing';
import type { BatchStreamServerMessage, BatchStreamStart } from '@/data/models';
import { streamBatchTranslate } from './batch-client';
import { STREAM_PORT_NAME } from './index';

/** Minimal in-memory Port pair — fakeBrowser doesn't implement runtime ports. */
interface FakePort {
  name: string;
  postMessage(m: unknown): void;
  disconnect(): void;
  onMessage: { addListener(fn: (m: unknown) => void): void };
  onDisconnect: { addListener(fn: () => void): void };
}

const onConnectListeners: ((p: FakePort) => void)[] = [];

function fakeConnect(opts?: { name?: string }): FakePort {
  const name = opts?.name ?? '';
  const ends = [
    { msg: [] as ((m: unknown) => void)[], dis: [] as (() => void)[] },
    { msg: [] as ((m: unknown) => void)[], dis: [] as (() => void)[] },
  ] as const;
  let connected = true;
  const makePort = (mine: (typeof ends)[number], theirs: (typeof ends)[number]): FakePort => ({
    name,
    postMessage(m) {
      if (!connected) throw new Error('Attempting to use a disconnected port object');
      theirs.msg.forEach((fn) => fn(m));
    },
    disconnect() {
      if (!connected) return;
      connected = false;
      theirs.dis.forEach((fn) => fn()); // Chrome fires onDisconnect on the OTHER end only
    },
    onMessage: { addListener: (fn) => mine.msg.push(fn) },
    onDisconnect: { addListener: (fn) => mine.dis.push(fn) },
  });
  const client = makePort(ends[0], ends[1]);
  const server = makePort(ends[1], ends[0]);
  onConnectListeners.forEach((fn) => fn(server));
  return client;
}

beforeEach(() => {
  onConnectListeners.length = 0;
  (fakeBrowser.runtime as unknown as { connect: typeof fakeConnect }).connect = fakeConnect;
});

/** Capture the server end of the next stream-port connection. */
function captureServerPort(): { port: () => FakePort; started: () => Promise<BatchStreamStart> } {
  let serverPort: FakePort | undefined;
  let resolveStart!: (m: BatchStreamStart) => void;
  const started = new Promise<BatchStreamStart>((res) => {
    resolveStart = res;
  });
  onConnectListeners.push((p) => {
    if (p.name !== STREAM_PORT_NAME) return; // ignore the keep-alive port
    serverPort = p;
    p.onMessage.addListener((raw) => {
      const msg = raw as { type?: string };
      if (msg.type === 'batchStart') resolveStart(raw as BatchStreamStart);
    });
  });
  return {
    port: () => {
      if (!serverPort) throw new Error('no stream port connected');
      return serverPort;
    },
    started: () => started,
  };
}

describe('streamBatchTranslate', () => {
  it('routes seg/segDone and resolves on batchDone', async () => {
    const server = captureServerPort();
    const onSeg = vi.fn();
    const onSegDone = vi.fn();
    const handle = streamBatchTranslate({ source: 'auto', target: 'zh' }, ['a', 'b'], { onSeg, onSegDone });
    const start = await server.started();
    expect(start.items).toEqual(['a', 'b']);

    const post = (m: BatchStreamServerMessage) => server.port().postMessage(m);
    post({ type: 'seg', requestId: start.requestId, index: 1, delta: '你' });
    post({ type: 'segDone', requestId: start.requestId, index: 1, text: '你好' });
    post({ type: 'segDone', requestId: start.requestId, index: 2, text: '再见' });
    post({ type: 'batchDone', requestId: start.requestId });

    await expect(handle.done).resolves.toBeUndefined();
    expect(onSeg).toHaveBeenCalledWith(1, '你');
    expect(onSegDone).toHaveBeenCalledWith(1, '你好');
    expect(onSegDone).toHaveBeenCalledWith(2, '再见');
  });

  it('rejects on batchError', async () => {
    const server = captureServerPort();
    const handle = streamBatchTranslate({ source: 'auto', target: 'zh' }, ['a'], { onSegDone: vi.fn() });
    const start = await server.started();
    server.port().postMessage({ type: 'batchError', requestId: start.requestId, message: 'no api key' });
    await expect(handle.done).rejects.toThrow('no api key');
  });

  it('REJECTS when the port disconnects before batchDone (SW recycled)', async () => {
    const server = captureServerPort();
    const onSegDone = vi.fn();
    const handle = streamBatchTranslate({ source: 'auto', target: 'zh' }, ['a', 'b'], { onSegDone });
    const start = await server.started();
    // One segment lands, then the background dies.
    server.port().postMessage({ type: 'segDone', requestId: start.requestId, index: 1, text: '你好' });
    server.port().disconnect();
    await expect(handle.done).rejects.toThrow(/disconnected/);
    expect(onSegDone).toHaveBeenCalledTimes(1);
  });

  it('cancel() settles done without rejecting', async () => {
    const server = captureServerPort();
    const handle = streamBatchTranslate({ source: 'auto', target: 'zh' }, ['a'], { onSegDone: vi.fn() });
    await server.started();
    handle.cancel();
    await expect(handle.done).resolves.toBeUndefined();
  });

  it('ignores messages for a different requestId', async () => {
    const server = captureServerPort();
    const onSegDone = vi.fn();
    const handle = streamBatchTranslate({ source: 'auto', target: 'zh' }, ['a'], { onSegDone });
    const start = await server.started();
    server.port().postMessage({ type: 'segDone', requestId: 'other', index: 1, text: 'x' });
    server.port().postMessage({ type: 'batchDone', requestId: start.requestId });
    await handle.done;
    expect(onSegDone).not.toHaveBeenCalled();
  });
});

describe('streamBatchTranslate — extension-context-invalidated window', () => {
  it('a THROWING runtime.connect yields a rejecting handle, never a sync throw', async () => {
    (fakeBrowser.runtime as unknown as { connect: () => never }).connect = () => {
      throw new Error('Extension context invalidated.');
    };
    const handle = streamBatchTranslate({ source: 'auto', target: 'zh' }, ['a'], { onSegDone: vi.fn() });
    await expect(handle.done).rejects.toThrow(/context invalidated/);
    expect(() => handle.cancel()).not.toThrow();
  });

  it('a THROWING postMessage (port died in the connect→post window) also rejects and stops the keep-alive', async () => {
    let disconnected = 0;
    const deadPort = {
      name: STREAM_PORT_NAME,
      postMessage() {
        throw new Error('Attempting to use a disconnected port object');
      },
      disconnect() {
        disconnected++;
      },
      onMessage: { addListener() {} },
      onDisconnect: { addListener() {} },
    };
    // First connect = the stream port (dead); the keep-alive helper connects
    // through the same runtime.connect, so hand it a working fake pair.
    let call = 0;
    (fakeBrowser.runtime as unknown as { connect: (o?: { name?: string }) => unknown }).connect = (o) => {
      call++;
      return call === 1 ? deadPort : fakeConnect(o);
    };
    const handle = streamBatchTranslate({ source: 'auto', target: 'zh' }, ['a'], { onSegDone: vi.fn() });
    await expect(handle.done).rejects.toThrow(/disconnected port/);
    expect(disconnected).toBeGreaterThan(0); // cleanup ran (keep-alive released, port closed)
  });
});
