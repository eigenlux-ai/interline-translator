import { expect, it, vi } from 'vitest';
import { defaultConfig } from '@/services/config/schema';
import { executeTranslate } from '../execute';

it('cancels the free MT network request when its stream is cancelled', async () => {
  let signal!: AbortSignal;
  let ready!: () => void;
  let rejectFetch!: (e: unknown) => void;
  const started = new Promise<void>((r) => {
    ready = r;
  });
  vi.stubGlobal(
    'fetch',
    vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          rejectFetch = reject;
          signal = init.signal!;
          signal.addEventListener('abort', () => reject(signal.reason), { once: true });
          ready();
        })
    )
  );
  const controller = new AbortController();
  const job = executeTranslate({ text: 'Hello test', source: 'auto', target: 'zh-CN' }, defaultConfig(), {
    signal: controller.signal,
  });
  const outcome = job.catch((e) => e);
  try {
    await started;
    controller.abort();
    expect(signal.aborted).toBe(true);
    expect(await outcome).toMatchObject({ name: 'AbortError' });
  } finally {
    rejectFetch(new DOMException('cleanup', 'AbortError'));
    await outcome;
    vi.unstubAllGlobals();
  }
});
