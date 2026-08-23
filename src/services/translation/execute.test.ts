import type { generateText, LanguageModel } from 'ai';
import { describe, expect, it, vi } from 'vitest';
import type { Config, ProviderConfig } from '@/data/models';
import { executeTranslate, resolveProvider } from './execute';
import { makeTestConfig } from '@/test-utils/config';

/** A generateText stub that returns fixed text and records its call args. */
function stubGenerate(text: string) {
  return vi.fn(async () => ({ text })) as unknown as typeof generateText;
}
const SENTINEL_MODEL = { __mock: true } as unknown as LanguageModel;

function makeConfig(providers: ProviderConfig[], defaultProviderId?: string): Config {
  return makeTestConfig({ providers, translate: { defaultProviderId, source: 'auto', target: 'zh-CN', skipLanguages: [] } });
}

const mtProvider: ProviderConfig = {
  id: 'google-free',
  kind: 'google-mt',
  apiKeys: [],
  model: '',
  enabled: true,
};

const llmProvider: ProviderConfig = {
  id: 'oai',
  kind: 'openai',
  apiKeys: ['sk-test'],
  model: 'gpt-4o-mini',
  enabled: true,
};

describe('resolveProvider', () => {
  it('prefers the explicit id, then default, then first enabled', () => {
    const config = makeConfig([mtProvider, llmProvider], 'google-free');
    expect(resolveProvider(config, 'oai').id).toBe('oai');
    expect(resolveProvider(config).id).toBe('google-free');
    expect(resolveProvider(makeConfig([{ ...llmProvider, enabled: true }])).id).toBe('oai');
  });

  it('throws when no provider is available', () => {
    expect(() => resolveProvider(makeConfig([]))).toThrow(/no provider configured/);
  });

  it('skips a draft engine — even when named — and falls back to a usable one', () => {
    const draft = { ...llmProvider, draft: true };
    // explicit id points at the draft → ignored, falls through to the MT fallback
    expect(resolveProvider(makeConfig([mtProvider, draft], 'oai'), 'oai').id).toBe('google-free');
    // a draft is also skipped in the first-enabled fallback
    expect(resolveProvider(makeConfig([draft, mtProvider])).id).toBe('google-free');
  });

  it('skips a DISABLED engine — even when named or default — the user switched it off', () => {
    const disabled = { ...llmProvider, enabled: false };
    // explicit id points at the disabled provider → ignored
    expect(resolveProvider(makeConfig([mtProvider, disabled]), 'oai').id).toBe('google-free');
    // defaultProviderId points at the disabled provider → ignored too
    expect(resolveProvider(makeConfig([mtProvider, disabled], 'oai')).id).toBe('google-free');
  });
});

describe('executeTranslate — MT path', () => {
  it('uses the free MT fetcher and returns its text + detected source', async () => {
    const mtFetch = vi.fn(async () => ({ text: '你好', detectedSource: 'en' }));
    const config = makeConfig([mtProvider], 'google-free');
    const out = await executeTranslate({ text: 'hello', source: 'auto', target: 'zh-CN' }, config, { mtFetch });
    expect(out).toEqual({ text: '你好', detectedSource: 'en', providerId: 'google-free' });
    expect(mtFetch).toHaveBeenCalledOnce();
  });

  it('honours mode:"mt" even when an LLM provider is selected', async () => {
    const mtFetch = vi.fn(async () => ({ text: '世界', detectedSource: 'en' }));
    const config = makeConfig([llmProvider], 'oai');
    const out = await executeTranslate({ text: 'world', source: 'auto', target: 'zh-CN', mode: 'mt' }, config, {
      mtFetch,
    });
    expect(out.text).toBe('世界');
    expect(mtFetch).toHaveBeenCalledOnce();
  });
});

describe('executeTranslate — LLM path', () => {
  it('resolves the model with the provider + key, then trims generateText output', async () => {
    const resolveModel = vi.fn(async () => SENTINEL_MODEL);
    const generate = stubGenerate('  你好世界  ');
    const config = makeConfig([llmProvider], 'oai');
    const out = await executeTranslate({ text: 'hello world', source: 'auto', target: 'zh-CN' }, config, {
      resolveModel,
      generate,
    });
    expect(out).toEqual({ text: '你好世界', providerId: 'oai' });
    expect(resolveModel).toHaveBeenCalledWith(llmProvider, 'sk-test');
    // generateText received the resolved model + a system/prompt pair.
    const callArg = (generate as unknown as { mock: { calls: [Record<string, unknown>][] } }).mock.calls[0][0];
    expect(callArg.model).toBe(SENTINEL_MODEL);
    expect(typeof callArg.system).toBe('string');
    expect(String(callArg.prompt)).toContain('hello world');
  });

  it('throws when the chosen LLM provider has no API key', async () => {
    const config = makeConfig([{ ...llmProvider, apiKeys: [] }], 'oai');
    await expect(executeTranslate({ text: 'x', source: 'auto', target: 'zh-CN' }, config)).rejects.toThrow(
      /no API key/
    );
  });
});

describe('executeTranslate — cache', () => {
  it('returns a cache hit without calling the provider', async () => {
    const mtFetch = vi.fn();
    const cache = { get: vi.fn(async () => 'CACHED'), set: vi.fn(async () => {}) };
    const config = makeConfig([mtProvider], 'google-free');
    const out = await executeTranslate({ text: 'hi', source: 'auto', target: 'zh-CN' }, config, { mtFetch, cache });
    expect(out).toMatchObject({ text: 'CACHED', fromCache: true });
    expect(mtFetch).not.toHaveBeenCalled();
  });

  it('stores a miss, then serves the next identical request from cache', async () => {
    const store = new Map<string, string>();
    const cache = {
      get: async (k: string) => store.get(k),
      set: async (k: string, v: string) => void store.set(k, v),
    };
    const mtFetch = vi.fn(async () => ({ text: '你好', detectedSource: 'en' }));
    const config = makeConfig([mtProvider], 'google-free');

    const first = await executeTranslate({ text: 'hi', source: 'auto', target: 'zh-CN' }, config, { mtFetch, cache });
    expect(first.text).toBe('你好');
    expect(mtFetch).toHaveBeenCalledOnce();

    const second = await executeTranslate({ text: 'hi', source: 'auto', target: 'zh-CN' }, config, { mtFetch, cache });
    expect(second.fromCache).toBe(true);
    expect(mtFetch).toHaveBeenCalledOnce(); // not called again
  });
});

describe('executeTranslate — empty input', () => {
  it('short-circuits empty text without calling a provider', async () => {
    const mtFetch = vi.fn();
    const config = makeConfig([mtProvider], 'google-free');
    const out = await executeTranslate({ text: '   ', source: 'auto', target: 'zh-CN' }, config, { mtFetch });
    expect(out.text).toBe('');
    expect(mtFetch).not.toHaveBeenCalled();
  });
});

describe('executeTranslate — cache hygiene & cancellation plumbing', () => {
  const config = makeConfig([llmProvider], 'oai');

  it("treats a cached EMPTY string as a MISS (legacy poisoned entry), then heals it", async () => {
    const store = new Map<string, string>();
    // Poison whatever key the engine derives by running once, blanking, re-running.
    const cache = {
      get: async (k: string) => store.get(k),
      set: async (k: string, v: string) => void store.set(k, v),
    };
    const deps = { resolveModel: () => SENTINEL_MODEL, generate: stubGenerate('你好'), cache };
    await executeTranslate({ text: 'hi', source: 'auto', target: 'zh-CN' }, config, deps);
    const key = [...store.keys()][0];
    store.set(key, '');

    const out = await executeTranslate({ text: 'hi', source: 'auto', target: 'zh-CN' }, config, deps);
    expect(out.fromCache).toBeUndefined(); // '' did not serve as a hit
    expect(out.text).toBe('你好');
    expect(store.get(key)).toBe('你好'); // healed
  });

  it('never writes an empty result into the cache', async () => {
    const store = new Map<string, string>();
    const cache = {
      get: async (k: string) => store.get(k),
      set: async (k: string, v: string) => void store.set(k, v),
    };
    await executeTranslate(
      { text: 'hi', source: 'auto', target: 'zh-CN' },
      config,
      { resolveModel: () => SENTINEL_MODEL, generate: stubGenerate(''), cache }
    );
    expect(store.size).toBe(0);
  });

  it('rejects a capped completion instead of returning and caching half a translation', async () => {
    const store = new Map<string, string>();
    const cache = {
      get: async (k: string) => store.get(k),
      set: async (k: string, v: string) => void store.set(k, v),
    };
    const generate = vi.fn(async () => ({ text: '这句话只翻到一', finishReason: 'length' })) as unknown as typeof generateText;
    await expect(
      executeTranslate({ text: 'hi', source: 'auto', target: 'zh-CN' }, config, {
        resolveModel: () => SENTINEL_MODEL,
        generate,
        cache,
      })
    ).rejects.toThrow(/output token limit/);
    expect(store.size).toBe(0);
  });

  it('passes an abort signal to generateText (timeout always; caller signal folded in)', async () => {
    const generate = vi.fn(async (opts: { abortSignal?: AbortSignal }) => {
      expect(opts.abortSignal).toBeInstanceOf(AbortSignal);
      return { text: 'ok' };
    }) as unknown as typeof generateText;
    await executeTranslate(
      { text: 'hi', source: 'auto', target: 'zh-CN' },
      config,
      { resolveModel: () => SENTINEL_MODEL, generate }
    );
    expect(generate).toHaveBeenCalledTimes(1);

    const ac = new AbortController();
    ac.abort();
    const generate2 = vi.fn(async (opts: { abortSignal?: AbortSignal }) => {
      expect(opts.abortSignal?.aborted).toBe(true); // caller's cancel is visible downstream
      return { text: 'ok' };
    }) as unknown as typeof generateText;
    await executeTranslate(
      { text: 'hi', source: 'auto', target: 'zh-CN' },
      config,
      { resolveModel: () => SENTINEL_MODEL, generate: generate2, signal: ac.signal }
    );
    expect(generate2).toHaveBeenCalledTimes(1);
  });
});
