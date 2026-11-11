import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { ProviderConfig } from '@/data/models';
import { makeTestConfig } from '@/test-utils/config';
import { sharedAdmission } from './admission';
import type { TranslationService } from './contract';
import { registerTranslationService } from './impl';

const { generate, mt, readConfig, captured } = vi.hoisted(() => ({
  generate: vi.fn(),
  mt: vi.fn(),
  readConfig: vi.fn(),
  captured: { service: null as TranslationService | null },
}));
vi.mock('@webext-core/proxy-service', () => ({
  registerService: (_key: string, service: TranslationService) => {
    captured.service = service;
  },
}));
vi.mock('ai', () => ({ generateText: generate }));
vi.mock('./provider/llm', () => ({ createLlmModel: async () => ({ modelId: 'stub' }) }));
vi.mock('./provider/mt', () => ({ googleFreeTranslate: mt }));
vi.mock('@/services/config/storage', () => ({ getConfig: readConfig }));

const provider: ProviderConfig = {
  id: 'deadline-provider',
  kind: 'openai-compatible',
  model: 'fixture',
  apiKeys: [],
  enabled: true,
};
const tick = async () => {
  for (let i = 0; i < 12; i++) await Promise.resolve();
};
const releases: Array<() => void> = [];
const blockers: Promise<unknown>[] = [];
function occupyEverySlot() {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const jobs = Array.from({ length: sharedAdmission.capacity }, () =>
    sharedAdmission.run({ providerId: 'occupied', kind: 'page' }, () => pending)
  );
  releases.push(release);
  blockers.push(...jobs);
  return async () => {
    release();
    await Promise.all(jobs);
    await tick();
  };
}
function rejectOnAbort(signal: AbortSignal): Promise<never> {
  return new Promise((_, reject) => {
    signal.throwIfAborted();
    signal.addEventListener('abort', () => reject(signal.reason), { once: true });
  });
}

type Outcome = { value?: unknown; error?: Error };
const cases = [
  {
    name: 'provider validation',
    timeout: 15_000,
    call: (service: TranslationService) => service.validateProvider(provider),
    upstream: generate,
    check: (out: Outcome) => expect(out.value).toMatchObject({ ok: false, error: expect.stringContaining('15') }),
    upstreamSignal: () => generate.mock.calls[0][0].abortSignal as AbortSignal,
  },
  {
    name: 'page summary',
    timeout: 30_000,
    call: (service: TranslationService) => service.summarizePage('A page to summarize.', 'en'),
    upstream: generate,
    check: (out: Outcome) => expect(out.value).toBe(''),
    upstreamSignal: () => generate.mock.calls[0][0].abortSignal as AbortSignal,
  },
  {
    name: 'language detection',
    timeout: 10_000,
    call: (service: TranslationService) => service.detectLang('Hello'),
    upstream: mt,
    check: (out: Outcome) => expect(out.error?.name).toBe('TimeoutError'),
    upstreamSignal: () => mt.mock.calls[0][4] as AbortSignal,
  },
];

beforeEach(() => {
  vi.useFakeTimers();
  // Native AbortSignal.timeout uses its own clock. Only replace the clock
  // source; the real signal and real admission queue perform cancellation.
  vi.spyOn(AbortSignal, 'timeout').mockImplementation((ms) => {
    const controller = new AbortController();
    setTimeout(() => controller.abort(new DOMException('Deadline exceeded', 'TimeoutError')), ms);
    return controller.signal;
  });
  generate.mockReset();
  mt.mockReset();
  readConfig.mockResolvedValue(makeTestConfig({ providers: [provider] }));
  registerTranslationService();
});
afterEach(async () => {
  releases.splice(0).forEach((release) => release());
  await Promise.allSettled(blockers.splice(0));
  vi.clearAllTimers();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe.each(cases)('$name total deadline', ({ timeout, call, upstream, check, upstreamSignal }) => {
  it('removes an expired admission waiter and never starts it after capacity returns', async () => {
    const release = occupyEverySlot();
    const result = call(captured.service!).then(
      (value) => ({ value }),
      (error: Error) => ({ error })
    );
    await tick();
    expect(sharedAdmission.pendingCount).toBe(1);
    await vi.advanceTimersByTimeAsync(timeout - 1);
    expect(sharedAdmission.pendingCount).toBe(1);
    expect(upstream).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    check(await result);
    expect(sharedAdmission.pendingCount).toBe(0);
    await release();
    expect(upstream).not.toHaveBeenCalled();
    expect(sharedAdmission.activeCount).toBe(0);
  });

  it('passes the remaining deadline to the upstream instead of restarting its budget', async () => {
    generate.mockImplementation(({ abortSignal }: { abortSignal: AbortSignal }) => rejectOnAbort(abortSignal));
    mt.mockImplementation((_text, _source, _target, _timeout, signal: AbortSignal) => rejectOnAbort(signal));
    const run = vi.spyOn(sharedAdmission, 'run'); // Observe the real implementation, do not replace it.
    const release = occupyEverySlot();
    let settled = false;
    const result = call(captured.service!)
      .then(
        (value) => ({ value }),
        (error: Error) => ({ error })
      )
      .finally(() => {
        settled = true;
      });
    await tick();
    await vi.advanceTimersByTimeAsync(timeout - 1000);
    await release();
    expect(upstream).toHaveBeenCalledOnce();
    const meta = run.mock.calls.find(([meta]) => meta.providerId !== 'occupied')![0];
    expect(upstreamSignal()).toBe(meta.signal);
    await vi.advanceTimersByTimeAsync(999);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    check(await result);
    expect(sharedAdmission.activeCount).toBe(0);
    expect(sharedAdmission.pendingCount).toBe(0);
  });
});
