/**
 * Behavioral tests for the SINGLE stream server (划词 path): the shared cache
 * (read hit → replay, write-back on success), and the same ai-sdk 6
 * error/abort semantics pinned for the batch server.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Config, ProviderConfig, TranslateRequest } from '@/data/models';

// ── mocks ────────────────────────────────────────────────────────────────────
const streamTextMock = vi.fn();
vi.mock('ai', () => ({ streamText: (...a: unknown[]) => streamTextMock(...a) }));

const cacheStore = new Map<string, string>();
vi.mock('@/services/translation/cache/db', () => ({
  dexieCache: {
    get: vi.fn(async (k: string) => cacheStore.get(k)),
    set: vi.fn(async (k: string, v: string) => void cacheStore.set(k, v)),
  },
}));

const executeTranslateMock = vi.fn();
vi.mock('@/services/translation/execute', () => ({
  executeTranslate: (...a: unknown[]) => executeTranslateMock(...a),
}));

vi.mock('@/services/translation/provider/llm', () => ({
  createLlmModel: vi.fn(async () => ({ __mock: true })),
}));

const getConfigMock = vi.fn();
vi.mock('@/services/config/storage', () => ({ getConfig: () => getConfigMock() }));

let watchdogTimedOut = false;
vi.mock('./limiter', async (importOriginal) => {
  const orig = await importOriginal<typeof import('./limiter')>();
  return {
    ...orig,
    makeWatchdog: (signal: AbortSignal) => ({ signal, timedOut: () => watchdogTimedOut, beat: () => {}, done: () => {} }),
  };
});

import { handleStart } from './server';
import { makeTestConfig } from '@/test-utils/config';

const llmProvider: ProviderConfig = { id: 'oai', kind: 'openai', apiKeys: ['sk-test'], model: 'gpt-x', enabled: true };

function makeConfig(): Config {
  return makeTestConfig({
    providers: [llmProvider],
    translate: { defaultProviderId: 'oai', source: 'auto', target: 'zh-CN', skipLanguages: [] },
  });
}

interface Posted {
  type: string;
  delta?: string;
  message?: string;
}

/** Fake port + shared controllers map; `start` drives handleStart directly. */
function makeClient() {
  const posted: Posted[] = [];
  const controllers = new Map<string, AbortController>();
  const port = { postMessage: (m: Posted) => posted.push(m) } as never;
  return {
    posted,
    start: (requestId: string, request: TranslateRequest) => handleStart(port, requestId, request, controllers),
    cancel: (requestId: string) => controllers.get(requestId)?.abort(),
  };
}

function scriptStream(deltas: string[], opts?: { error?: Error; finishReason?: string }) {
  streamTextMock.mockImplementation((callOpts: { onError?: (e: { error: unknown }) => void }) => {
    if (opts?.error) callOpts.onError?.({ error: opts.error });
    return {
      textStream: (async function* () {
        for (const d of deltas) yield d;
      })(),
      finishReason: Promise.resolve(opts?.finishReason ?? 'stop'),
    };
  });
}

const req = (text: string): TranslateRequest => ({ text, source: 'auto', target: 'zh-CN' });

beforeEach(() => {
  cacheStore.clear();
  streamTextMock.mockReset();
  executeTranslateMock.mockReset();
  getConfigMock.mockResolvedValue(makeConfig());
  watchdogTimedOut = false;
});
afterEach(() => vi.clearAllMocks());

describe('handleStart (single stream) — shared cache', () => {
  it('caches the streamed result and replays a repeat selection without an LLM call', async () => {
    scriptStream(['你', '好']);
    const c1 = makeClient();
    await c1.start('a', req('hello'));
    expect(c1.posted.some((m) => m.type === 'done')).toBe(true);
    expect(streamTextMock).toHaveBeenCalledTimes(1);
    expect([...cacheStore.values()]).toEqual(['你好']);

    const c2 = makeClient();
    await c2.start('b', req('hello'));
    expect(c2.posted.some((m) => m.type === 'done')).toBe(true);
    expect(streamTextMock).toHaveBeenCalledTimes(1); // replay came from cache
    expect(c2.posted.filter((m) => m.type === 'chunk').map((m) => m.delta)).toEqual(['你好']);
  });

  it('does not cache an empty stream result', async () => {
    scriptStream(['']);
    const c = makeClient();
    await c.start('a', req('hello'));
    expect(cacheStore.size).toBe(0);
  });
});

describe('handleStart — error/abort semantics', () => {
  it('provider error via onError → error message, nothing cached', async () => {
    scriptStream([], { error: new Error('429 rate limited') });
    const c = makeClient();
    await c.start('a', req('hello'));
    expect(c.posted.find((m) => m.type === 'error')?.message).toMatch(/rate limited/);
    expect(c.posted.some((m) => m.type === 'done')).toBe(false);
    expect(cacheStore.size).toBe(0);
  });

  it('watchdog timeout → error (a truncated stream must not present as done)', async () => {
    streamTextMock.mockImplementation(() => ({
      textStream: (async function* () {
        yield '一半';
        watchdogTimedOut = true;
      })(),
      finishReason: Promise.resolve('stop'),
    }));
    const c = makeClient();
    await c.start('a', req('hello'));
    expect(c.posted.find((m) => m.type === 'error')?.message).toMatch(/timed out/);
    expect(c.posted.some((m) => m.type === 'done')).toBe(false);
    expect(cacheStore.size).toBe(0); // truncation never enters the cache
  });

  it('user cancel → silent stop (no done, no error) and nothing cached', async () => {
    const c = makeClient();
    streamTextMock.mockImplementation(() => ({
      textStream: (async function* () {
        yield '开';
        c.cancel('a'); // cancel arrives mid-stream
        // ai-sdk abort semantics: the stream just ends cleanly here.
      })(),
      finishReason: Promise.resolve('stop'),
    }));
    await c.start('a', req('hello'));
    expect(c.posted.some((m) => m.type === 'done' || m.type === 'error')).toBe(false);
    expect(cacheStore.size).toBe(0);
  });

  it('an unclosed literal <think> is recovered at flush, not swallowed', async () => {
    scriptStream(['<think> 是推理标签']);
    const c = makeClient();
    await c.start('a', req('hello'));
    expect(c.posted.some((m) => m.type === 'done')).toBe(true);
    expect(c.posted.filter((m) => m.type === 'chunk').map((m) => m.delta).join('')).toBe('<think> 是推理标签');
  });

  it('output cap (finishReason "length") → error, and the half completion is not cached', async () => {
    scriptStream(['这句话只翻到一'], { finishReason: 'length' });
    const c = makeClient();
    await c.start('a', req('hello'));
    expect(c.posted.find((m) => m.type === 'error')?.message).toMatch(/output token limit/);
    expect(c.posted.some((m) => m.type === 'done')).toBe(false);
    expect(cacheStore.size).toBe(0);
  });
});

describe('handleStart — MT branch', () => {
  it('routes MT through executeTranslate (shared cache) and emits one chunk', async () => {
    getConfigMock.mockResolvedValue({
      ...makeConfig(),
      providers: [{ id: 'google-free', kind: 'google-mt', apiKeys: [], model: '', enabled: true }],
      translate: { defaultProviderId: 'google-free', source: 'auto', target: 'zh-CN', skipLanguages: [] },
    });
    executeTranslateMock.mockResolvedValue({ text: '机翻', providerId: 'google-free', detectedSource: 'en' });
    const c = makeClient();
    await c.start('a', req('hello'));
    expect(c.posted.some((m) => m.type === 'done')).toBe(true);
    expect(executeTranslateMock).toHaveBeenCalledTimes(1);
    expect(c.posted.filter((m) => m.type === 'chunk')).toEqual([{ type: 'chunk', requestId: 'a', delta: '机翻' }]);
    expect(streamTextMock).not.toHaveBeenCalled();
  });
});
