import { fakeBrowser } from 'wxt/testing';
import { beforeEach, expect, it, vi } from 'vitest';
import { streamAnnotate, streamTranslate } from './client';

const { stop } = vi.hoisted(() => ({ stop: vi.fn() }));
vi.mock('@/services/keep-alive', () => ({ connectKeepAlive: () => ({ stop }) }));
let messages: (message: unknown) => void;
let disconnect: () => void;
const port = {
  postMessage: vi.fn(),
  disconnect: vi.fn(),
  onMessage: {
    addListener: (fn: typeof messages) => {
      messages = fn;
    },
  },
  onDisconnect: {
    addListener: (fn: typeof disconnect) => {
      disconnect = fn;
    },
  },
};
beforeEach(() => {
  vi.clearAllMocks();
  (fakeBrowser.runtime as unknown as { connect: () => typeof port }).connect = () => port;
});
it.each(['translate', 'annotate'])('cancels a silent %s stream immediately', async (kind) => {
  const controller = new AbortController();
  const stream =
    kind === 'translate'
      ? streamTranslate({ text: 'hello', source: 'auto', target: 'en' }, 'request', controller.signal)
      : streamAnnotate({ text: 'hello', translation: '你好', target: 'zh-CN' }, 'request', controller.signal);
  const next = stream.next();
  expect(port.postMessage).toHaveBeenCalledOnce();
  controller.abort();
  expect(port.postMessage).toHaveBeenLastCalledWith({ type: 'cancel', requestId: 'request' });
  expect(port.disconnect).toHaveBeenCalledOnce();
  expect(stop).toHaveBeenCalledOnce();
  await expect(next).resolves.toMatchObject({ done: true });
});
it('does not open a stream that has already been cancelled', async () => {
  const controller = new AbortController();
  controller.abort();
  await expect(
    streamTranslate({ text: 'hello', source: 'auto', target: 'en' }, 'request', controller.signal).next()
  ).resolves.toMatchObject({ done: true });
  expect(port.postMessage).not.toHaveBeenCalled();
});
it('still surfaces an unexpected disconnect', async () => {
  const stream = streamTranslate({ text: 'hello', source: 'auto', target: 'en' }, 'request');
  const next = stream.next();
  disconnect();
  await expect(next).rejects.toThrow('disconnected');
});
it('aborts while suspended at a yielded token without waiting for another next call', async () => {
  const controller = new AbortController();
  const stream = streamTranslate({ text: 'hello', source: 'auto', target: 'en' }, 'request', controller.signal);
  const next = stream.next();
  messages({ type: 'chunk', requestId: 'request', delta: 'Hello' });
  expect(await next).toEqual({ value: 'Hello', done: false });
  controller.abort();
  expect(port.disconnect).toHaveBeenCalledOnce();
  await expect(stream.next()).resolves.toMatchObject({ done: true });
});
