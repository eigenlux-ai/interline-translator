import { fakeBrowser } from 'wxt/testing/fake-browser';
import { afterEach, expect, it, vi } from 'vitest';
import { dispatchMessage } from '@/test-utils/runtime-messaging';
import { registerSubtitleServer } from './server';

vi.mock('@/services/config/storage', () => ({ getConfig: vi.fn(), watchConfig: vi.fn() }));
vi.mock('./manager', () => ({ SubtitleRequestManager: class {} }));
afterEach(() => vi.restoreAllMocks());

it('restricts diagnostic ingestion and export to appropriate senders and bounds batches', async () => {
  const listeners = vi.spyOn(fakeBrowser.runtime.onMessage, 'addListener');
  vi.spyOn(fakeBrowser.runtime.onConnect, 'addListener').mockImplementation(() => {});
  registerSubtitleServer();
  const handler = listeners.mock.calls[0][0];
  const source = {
    id: fakeBrowser.runtime.id,
    frameId: 0,
    url: 'https://www.youtube.com/watch?v=test',
    tab: await fakeBrowser.tabs.create({ url: 'https://www.youtube.com/watch?v=test' }),
  };
  const options = { id: fakeBrowser.runtime.id, url: fakeBrowser.runtime.getURL('options.html') };
  const payload = {
    type: 'subtitle:diagnostics',
    version: 1,
    events: [{ event: 'source-error', code: 'rate-limited', url: 'signed-secret', text: 'transcript', context: 999 }],
  };
  handler(payload, { ...source, id: 'foreign-extension' }, () => {});
  handler({ ...payload, events: Array(33).fill(payload.events[0]) }, source, () => {});
  expect(await dispatchMessage('exportSubtitleDiagnostics', undefined, options)).toEqual({ version: 1, events: [] });
  handler(payload, source, () => {});
  handler(payload, source, () => {}); // A flood from the same frame cannot fill the buffer.
  await expect(dispatchMessage('exportSubtitleDiagnostics', undefined, source)).rejects.toThrow('Unauthorized');
  const result = (await dispatchMessage('exportSubtitleDiagnostics', undefined, options)) as { events: unknown[] };
  expect(result.events).toHaveLength(1);
  expect(result.events[0]).toEqual({
    event: 'source-error',
    code: 'rate-limited',
    context: 1,
    time: expect.any(Number),
  });
});
