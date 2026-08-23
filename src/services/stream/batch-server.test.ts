/**
 * Behavioral tests for the batch stream server — the ai-sdk 6 semantics that
 * bit us are pinned here with a scripted streamText mock:
 *   - provider errors arrive ONLY via onError (stream ends cleanly);
 *   - abort (user cancel AND watchdog timeout) also ends the stream cleanly;
 *   - the per-item fallback must never run against a failed/cancelled/wedged
 *     upstream;
 *   - empty segments are neither cached nor marked done;
 *   - duplicate texts share one upstream marker and fan back out.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { BatchStreamStart, Config, ProviderConfig } from '@/data/models';

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

// Controllable watchdog + passthrough slot (AbortSignal.timeout is not fake-timer friendly).
let watchdogTimedOut = false;
vi.mock('./limiter', async (importOriginal) => {
  const orig = await importOriginal<typeof import('./limiter')>();
  return {
    ...orig,
    withStreamSlot: (fn: () => Promise<unknown>) => fn(),
    makeWatchdog: (signal: AbortSignal) => ({ signal, timedOut: () => watchdogTimedOut, beat: () => {}, done: () => {} }),
  };
});

import { dexieCache } from '@/services/translation/cache/db';
import { handleBatchStart } from './batch-server';
import { makeTestConfig } from '@/test-utils/config';

// ── fixtures ─────────────────────────────────────────────────────────────────
const llmProvider: ProviderConfig = { id: 'oai', kind: 'openai', apiKeys: ['sk-test'], model: 'gpt-x', enabled: true };

function makeConfig(): Config {
  return makeTestConfig({
    providers: [llmProvider],
    translate: { defaultProviderId: 'oai', source: 'auto', target: 'zh-CN', skipLanguages: [] },
  });
}

interface Posted {
  type: string;
  index?: number;
  text?: string;
  delta?: string;
  message?: string;
}

function makePort() {
  const posted: Posted[] = [];
  return { posted, port: { postMessage: (m: Posted) => posted.push(m) } as never };
}

function startMsg(items: string[]): BatchStreamStart {
  return { type: 'batchStart', requestId: 'r1', items, source: 'auto', target: 'zh-CN' };
}

/**
 * Script the next streamText call. `script` receives the extracted salt and
 * the call options (so it can fire onError / inspect the prompt) and returns
 * the deltas to stream. `finishReason` mirrors the ai-sdk 6 promise field —
 * 'stop' unless a test is pinning a cap/filter stop.
 */
function scriptStream(
  script: (salt: string, opts: { onError?: (e: { error: unknown }) => void; prompt: string; abortSignal: AbortSignal }) => string[],
  finishReason: string = 'stop'
) {
  streamTextMock.mockImplementation((opts: { prompt: string; onError?: (e: { error: unknown }) => void; abortSignal: AbortSignal }) => {
    const salt = /\[\[([0-9a-f]{6})#/.exec(opts.prompt)?.[1] ?? 'nosalt';
    const deltas = script(salt, opts);
    return {
      textStream: (async function* () {
        for (const d of deltas) yield d;
      })(),
      finishReason: Promise.resolve(finishReason),
    };
  });
}

beforeEach(() => {
  cacheStore.clear();
  streamTextMock.mockReset();
  executeTranslateMock.mockReset();
  getConfigMock.mockResolvedValue(makeConfig());
  watchdogTimedOut = false;
});
afterEach(() => vi.clearAllMocks());

// ── tests ────────────────────────────────────────────────────────────────────
describe('handleBatchStart — error/abort semantics', () => {
  it('provider error via onError → batchError, and NO per-item fallback storm', async () => {
    scriptStream((_salt, opts) => {
      opts.onError?.({ error: new Error('401 invalid api key') });
      return []; // ai-sdk 6: the stream ends cleanly with zero deltas
    });
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one', 'two', 'three']), new Map());

    expect(posted.some((m) => m.type === 'batchError' && /invalid api key/.test(m.message ?? ''))).toBe(true);
    expect(posted.some((m) => m.type === 'batchDone')).toBe(false);
    expect(executeTranslateMock).not.toHaveBeenCalled(); // the old path fired one doomed call per segment
    expect(cacheStore.size).toBe(0); // nothing from a failed stream may enter the cache
  });

  it('user cancel mid-stream → silent stop: no fallback, no batchDone, no batchError', async () => {
    const controllers = new Map<string, AbortController>();
    scriptStream((salt) => {
      controllers.get('r1')!.abort(); // cancel arrives mid-flight
      return [`[[${salt}#1]]部分`]; // stream then ends cleanly (ai-sdk abort semantics)
    });
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one', 'two']), controllers);

    expect(executeTranslateMock).not.toHaveBeenCalled();
    expect(posted.some((m) => m.type === 'batchDone' || m.type === 'batchError')).toBe(false);
    expect(posted.some((m) => m.type === 'segDone')).toBe(false); // the half-streamed segment is not flushed as done
    expect(cacheStore.size).toBe(0);
  });

  it('watchdog timeout → batchError (truncation is an ERROR), and no fallback re-hammering', async () => {
    scriptStream((salt) => {
      watchdogTimedOut = true;
      return [`[[${salt}#1]]只有一半`]; // upstream wedged after segment 1
    });
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one', 'two', 'three']), new Map());

    expect(posted.some((m) => m.type === 'batchError' && /timed out/.test(m.message ?? ''))).toBe(true);
    expect(executeTranslateMock).not.toHaveBeenCalled();
    // the half-streamed segment must NOT be flushed to done: no truncated
    // translation may be cached or rendered as final
    expect(posted.some((m) => m.type === 'segDone')).toBe(false);
    expect(cacheStore.size).toBe(0);
  });

  it('output cap (finishReason "length") → batchError; the half segment is neither rendered nor cached', async () => {
    scriptStream((salt) => [`[[${salt}#1]]完整一句[[${salt}#2]]被截断的半`], 'length');
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one', 'two']), new Map());

    expect(posted.some((m) => m.type === 'batchError')).toBe(true);
    expect(posted.some((m) => m.type === 'batchDone')).toBe(false);
    // Segment 1 closed on its own marker before the cap — it is genuinely
    // complete and may ship. Segment 2 was still streaming when the model ran
    // out of budget: flushing it would cache a half sentence forever.
    expect(posted.filter((m) => m.type === 'segDone')).toEqual([
      { type: 'segDone', requestId: 'r1', index: 1, text: '完整一句' },
    ]);
    expect([...cacheStore.values()]).toEqual(['完整一句']);
    expect(executeTranslateMock).not.toHaveBeenCalled();
  });

  it('content filter stop is an error too, not a silently short translation', async () => {
    scriptStream((salt) => [`[[${salt}#1]]半句`], 'content-filter');
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one']), new Map());

    expect(posted.some((m) => m.type === 'batchError')).toBe(true);
    expect(posted.some((m) => m.type === 'segDone')).toBe(false);
    expect(cacheStore.size).toBe(0);
  });
});

describe('handleBatchStart — cache hygiene', () => {
  it('an empty segment is not cached, not segDone-d, and gets the individual fallback', async () => {
    scriptStream((salt) => [`[[${salt}#1]][[${salt}#2]]二`]); // #1 emitted nothing
    executeTranslateMock.mockResolvedValue({ text: '一(补)', providerId: 'oai' });
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one', 'two']), new Map());

    expect(cacheStore.size).toBe(1); // only segment 2 (+ the fallback caches via its own path, mocked here)
    expect([...cacheStore.values()]).toEqual(['二']);
    expect(executeTranslateMock).toHaveBeenCalledTimes(1);
    expect(executeTranslateMock.mock.calls[0][0]).toMatchObject({ text: 'one' });
    const seg1 = posted.filter((m) => m.type === 'segDone' && m.index === 1);
    expect(seg1).toEqual([{ type: 'segDone', requestId: 'r1', index: 1, text: '一(补)' }]);
  });

  it("a cached EMPTY string ('' legacy poison) reads as a miss, not a hit", async () => {
    // Seed a poisoned entry under whatever key the server derives: run once to
    // learn the key, poison it, then run again and expect an upstream call.
    scriptStream((salt) => [`[[${salt}#1]]真译文`]);
    const first = makePort();
    await handleBatchStart(first.port, startMsg(['one']), new Map());
    const key = [...cacheStore.keys()][0];
    cacheStore.set(key, ''); // poison

    scriptStream((salt) => [`[[${salt}#1]]重新翻译`]);
    const second = makePort();
    await handleBatchStart(second.port, startMsg(['one']), new Map());
    expect(second.posted.filter((m) => m.type === 'segDone')).toEqual([
      { type: 'segDone', requestId: 'r1', index: 1, text: '重新翻译' },
    ]);
    expect(cacheStore.get(key)).toBe('重新翻译'); // healed
  });

  it('repeated marker (model self-correction) does not concatenate or re-fire segDone', async () => {
    scriptStream((salt) => [`[[${salt}#1]]初版[[${salt}#2]]乙[[${salt}#1]]重打[[${salt}#2]]`]);
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one', 'two']), new Map());

    const seg1 = posted.filter((m) => m.type === 'segDone' && m.index === 1);
    expect(seg1).toEqual([{ type: 'segDone', requestId: 'r1', index: 1, text: '初版' }]);
    expect(cacheStore.size).toBe(2);
    expect([...cacheStore.values()].sort()).toEqual(['乙', '初版']);
  });

  it('a rehearsed marker inside <think> does not leak reasoning into segments', async () => {
    scriptStream((salt) => [`<think>plan: [[${salt}#1]] should be short</think>[[${salt}#1]]真译文`]);
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['one']), new Map());

    const deltas = posted.filter((m) => m.type === 'seg').map((m) => m.delta);
    expect(deltas.join('')).toBe('真译文');
    expect([...cacheStore.values()]).toEqual(['真译文']);
  });
});

describe('handleBatchStart — dedup fan-out', () => {
  it('duplicate texts share one upstream marker and fan out to every index', async () => {
    scriptStream((salt, opts) => {
      // Only TWO markers upstream for three items (Reply ×2 dedups).
      expect([...opts.prompt.matchAll(/\[\[/g)]).toHaveLength(2);
      return [`[[${salt}#1]]回复[[${salt}#2]]分享`];
    });
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['Reply', 'Share', 'Reply']), new Map());

    const done = posted.filter((m) => m.type === 'segDone');
    expect(done).toContainEqual({ type: 'segDone', requestId: 'r1', index: 1, text: '回复' });
    expect(done).toContainEqual({ type: 'segDone', requestId: 'r1', index: 3, text: '回复' });
    expect(done).toContainEqual({ type: 'segDone', requestId: 'r1', index: 2, text: '分享' });
    expect(posted.some((m) => m.type === 'batchDone')).toBe(true);
    expect((dexieCache.set as ReturnType<typeof vi.fn>).mock.calls).toHaveLength(2); // one write per unique text
  });

  it('cache hits fan out to duplicates too and never reach the LLM', async () => {
    scriptStream((salt) => [`[[${salt}#1]]新词`]);
    const first = makePort();
    await handleBatchStart(first.port, startMsg(['hello']), new Map());
    expect(streamTextMock).toHaveBeenCalledTimes(1);

    const second = makePort();
    await handleBatchStart(second.port, startMsg(['hello', 'hello']), new Map());
    expect(streamTextMock).toHaveBeenCalledTimes(1); // no second upstream call
    const done = second.posted.filter((m) => m.type === 'segDone');
    expect(done).toHaveLength(2);
    expect(done.every((m) => m.text === '新词')).toBe(true);
  });
});

describe('handleBatchStart — cache/prompt consistency', () => {
  it('an active expert template BYPASSES the shared cache (no read, no write)', async () => {
    const cfg = makeConfig();
    cfg.prompt = { styles: [], siteRules: [], expert: { single: { system: 'MY SYSTEM {target}' } } };
    getConfigMock.mockResolvedValue(cfg);
    // Seed a poisoned-looking entry: it must NOT be served under divergence.
    cacheStore.set('any-key', '旧译文');

    scriptStream((salt) => [`[[${salt}#1]]新译文`]);
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg(['hello']), new Map());

    expect(posted.filter((m) => m.type === 'segDone')).toEqual([{ type: 'segDone', requestId: 'r1', index: 1, text: '新译文' }]);
    expect(cacheStore.size).toBe(1); // only the seed — the streamed result was NOT written
    expect(dexieCache.get).not.toHaveBeenCalled(); // and nothing was read
  });

  it('a segment whose glossary term was squeezed out of the capped union is NOT cached', async () => {
    const cfg = makeConfig();
    // 13 terms in one set; itemA matches term0..term11 (fills the 12 cap), itemB matches only term12.
    cfg.glossary = [
      {
        id: 'g',
        name: 'G',
        enabled: true,
        entries: Array.from({ length: 13 }, (_, i) => ({ source: `term${i}`, target: `T${i}` })),
      },
    ];
    getConfigMock.mockResolvedValue(cfg);
    const itemA = Array.from({ length: 12 }, (_, i) => `term${i}`).join(' ');
    const itemB = 'about term12 only';

    scriptStream((salt) => [`[[${salt}#1]]甲[[${salt}#2]]乙`]);
    const { port, posted } = makePort();
    await handleBatchStart(port, startMsg([itemA, itemB]), new Map());

    // Both segments still render...
    const done = posted.filter((m) => m.type === 'segDone');
    expect(done).toContainEqual({ type: 'segDone', requestId: 'r1', index: 1, text: '甲' });
    expect(done).toContainEqual({ type: 'segDone', requestId: 'r1', index: 2, text: '乙' });
    // ...but only itemA (whose terms all made the union) was cached.
    expect([...cacheStore.values()]).toEqual(['甲']);
  });
});
