import { fakeBrowser } from 'wxt/testing/fake-browser';
import type { Browser } from '#imports';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { sendMessage } from '@/core/messaging';
import { registerConfigGateway } from './config/gateway';
import { defaultConfig } from './config/schema';
import { getConfig, setConfig } from './config/storage';
import { clearSubtitleCache } from './subtitles/cache';
import { registerSubtitleServer } from './subtitles/server';
import { getTranslationService } from './translation/contract';
import { executeTranslate } from './translation/execute';
import { registerTranslationService } from './translation/impl';

vi.mock('./translation/execute', () => ({ executeTranslate: vi.fn() }));
vi.mock('./translation/cache/db', () => ({ dexieCache: {} }));
vi.mock('./subtitles/cache', () => ({ clearSubtitleCache: vi.fn() }));
vi.mock('./subtitles/manager', () => ({
  SubtitleRequestManager: class {
    refresh() {}
  },
}));

type Listener = Parameters<typeof fakeBrowser.runtime.onMessage.addListener>[0];
let sender: Browser.runtime.MessageSender;

beforeEach(() => {
  vi.clearAllMocks();
  sender = { id: fakeBrowser.runtime.id, url: fakeBrowser.runtime.getURL('options.html') };
  const listeners: Listener[] = [];
  vi.spyOn(fakeBrowser.runtime.onMessage, 'addListener').mockImplementation((listener) => {
    listeners.push(listener);
  });
  vi.spyOn(fakeBrowser.runtime.onConnect, 'addListener').mockImplementation(() => {});
  // Model Chromium's callback-only receiver contract: a Promise return value
  // cannot keep this channel open. Exercise the real callers and listeners.
  vi.spyOn(fakeBrowser.runtime, 'sendMessage').mockImplementation((...args: unknown[]) => {
    const message = args[0];
    const callback = args.at(-1) as (reply: unknown) => void;
    let open = true;
    let replied = false;
    let keepAlive = false;
    const respond = (reply: unknown) => {
      if (!open || replied) return;
      replied = true;
      callback(reply);
    };
    for (const listener of listeners) {
      const result: unknown = listener(message, sender, respond);
      expect(result).not.toBeInstanceOf(Promise);
      if (result === true) keepAlive = true;
    }
    open = keepAlive;
    if (!keepAlive && !replied) callback(undefined);
    return Promise.resolve();
  });
  vi.mocked(clearSubtitleCache).mockResolvedValue(undefined);
  vi.mocked(executeTranslate).mockResolvedValue({ text: 'Translated fixture', providerId: 'fixture' });
  registerConfigGateway();
  registerTranslationService();
  registerSubtitleServer();
});
afterEach(() => vi.restoreAllMocks());

it('delivers all four asynchronous replies through the callback transport', async () => {
  const base = defaultConfig();
  const next = structuredClone(base);
  next.appearance.colorScheme = 'dark';
  await expect(setConfig(next, base)).resolves.toBeUndefined();
  expect((await getConfig()).appearance.colorScheme).toBe('dark');
  await expect(getTranslationService().translate({ text: 'Hello', source: 'auto', target: 'en' })).resolves.toEqual({
    text: 'Translated fixture',
    providerId: 'fixture',
  });
  await expect(sendMessage('exportSubtitleDiagnostics', undefined)).resolves.toEqual({ version: 1, events: [] });
  await expect(sendMessage('clearSubtitleCache', undefined)).resolves.toEqual({ ok: true });
  expect(clearSubtitleCache).toHaveBeenCalledOnce();
});

it('preserves the browser-supplied translation owner and rejects foreign senders', async () => {
  const tab = await fakeBrowser.tabs.create({ url: 'https://example.test/editor' });
  sender = { id: fakeBrowser.runtime.id, tab, url: tab.url, documentId: 'fixture-document' };
  await getTranslationService().translate({ text: 'Hello', source: 'auto', target: 'en' });
  expect(executeTranslate).toHaveBeenCalledWith(
    expect.anything(),
    expect.anything(),
    expect.objectContaining({ admission: { owner: `${tab.id}:fixture-document`, kind: 'interactive' } })
  );
  sender = { ...sender, id: 'foreign-extension' };
  await expect(getTranslationService().translate({ text: 'Hello', source: 'auto', target: 'en' })).rejects.toThrow(
    'Unauthorized'
  );
  expect(executeTranslate).toHaveBeenCalledOnce();
});

it('keeps settings and maintenance operations inaccessible to content senders', async () => {
  sender = { id: fakeBrowser.runtime.id, url: 'https://example.test/editor' };
  const base = defaultConfig();
  const next = { ...base, providers: [] };
  await expect(setConfig(next, base)).rejects.toThrow('Configuration could not be saved');
  await expect(sendMessage('exportSubtitleDiagnostics', undefined)).rejects.toThrow('Unauthorized');
  await expect(sendMessage('clearSubtitleCache', undefined)).rejects.toThrow('Unauthorized');
  expect(clearSubtitleCache).not.toHaveBeenCalled();
  expect((await getConfig()).providers).toEqual(base.providers);
});

it('relays asynchronous failures and allows subsequent requests to succeed', async () => {
  vi.mocked(clearSubtitleCache).mockRejectedValueOnce(new Error('Cache unavailable'));
  await expect(sendMessage('clearSubtitleCache', undefined)).rejects.toThrow('Cache unavailable');
  await expect(sendMessage('clearSubtitleCache', undefined)).resolves.toEqual({ ok: true });
  // Non-retryable failure: prove the original error reaches the caller.
  vi.mocked(executeTranslate).mockRejectedValueOnce(Object.assign(new Error('Invalid API key'), { status: 401 }));
  await expect(getTranslationService().translate({ text: 'Fail', source: 'auto', target: 'en' })).rejects.toThrow(
    'Invalid API key'
  );
  // Provider errors carry the request and response; only name and message leave the background.
  const detailed = Object.assign(new Error('Invalid API key', { cause: new Error('upstream detail') }), {
    name: 'AI_APICallError',
    status: 401,
    url: 'https://gateway.example.test/v1?api-key=secret',
    requestBodyValues: { system: 'private prompt' },
    responseBody: 'private response',
  });
  vi.mocked(executeTranslate).mockRejectedValueOnce(detailed);
  const relayed = await getTranslationService()
    .translate({ text: 'Fail', source: 'auto', target: 'en' })
    .catch((error: Error) => error);
  expect(relayed).toMatchObject({ name: 'AI_APICallError', message: 'Invalid API key' });
  expect(Object.keys(relayed).filter((key) => key !== 'name')).toEqual([]);
  expect((relayed as Error).cause).toBeUndefined();
  expect((relayed as Error).stack).toBe('');
  await expect(
    getTranslationService().translate({ text: 'Recover', source: 'auto', target: 'en' })
  ).resolves.toMatchObject({
    text: 'Translated fixture',
  });
});
