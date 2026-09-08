import { describe, expect, it } from 'vitest';
import type { Config, ProviderConfig } from '@/data/models';
import { computeCacheKey, singleTranslationKey, type CacheKeyInput } from './cache-key';

const provider: ProviderConfig = {
  id: 'p1',
  kind: 'openai',
  apiKeys: ['sk-SECRET-1'],
  model: 'gpt-4o-mini',
  enabled: true,
};

const base: CacheKeyInput = {
  preparedText: 'Hello world',
  provider,
  source: 'auto',
  target: 'zh-CN',
  systemPrompt: 'sys',
  userPrompt: 'usr',
};

describe('computeCacheKey', () => {
  it('is deterministic for identical input', async () => {
    expect(await computeCacheKey(base)).toBe(await computeCacheKey(base));
  });

  it('produces a 64-char hex sha-256 digest', async () => {
    expect(await computeCacheKey(base)).toMatch(/^[0-9a-f]{64}$/);
  });

  it('ignores the API key (secret + output-irrelevant)', async () => {
    const rotated = { ...base, provider: { ...provider, apiKeys: ['sk-SECRET-2', 'sk-SECRET-3'] } };
    expect(await computeCacheKey(rotated)).toBe(await computeCacheKey(base));
  });

  it('ignores output-irrelevant fields (enabled/label)', async () => {
    const cosmetic = { ...base, provider: { ...provider, enabled: false, label: 'My Key' } };
    expect(await computeCacheKey(cosmetic)).toBe(await computeCacheKey(base));
  });

  it('changes when the model changes', async () => {
    const other = { ...base, provider: { ...provider, model: 'gpt-4o' } };
    expect(await computeCacheKey(other)).not.toBe(await computeCacheKey(base));
  });

  it('changes when the target language changes', async () => {
    expect(await computeCacheKey({ ...base, target: 'ja' })).not.toBe(await computeCacheKey(base));
  });

  it('changes when a stable providerOption (reasoning) changes', async () => {
    const reasoning = { ...base, provider: { ...provider, providerOptions: { reasoning: false } } };
    expect(await computeCacheKey(reasoning)).not.toBe(await computeCacheKey(base));
  });
});

describe('providerOptions fingerprint', () => {
  it('sees NESTED per-provider options (ai-sdk convention), not just top-level keys', async () => {
    const low = { ...base, provider: { ...provider, providerOptions: { openai: { reasoningEffort: 'low' } } } };
    const high = { ...base, provider: { ...provider, providerOptions: { openai: { reasoningEffort: 'high' } } } };
    expect(await computeCacheKey(low)).not.toBe(await computeCacheKey(high));
  });

  it('is order-independent (canonicalized keys)', async () => {
    const a = { ...base, provider: { ...provider, providerOptions: { openai: { a: 1, b: 2 } } } };
    const b = { ...base, provider: { ...provider, providerOptions: { openai: { b: 2, a: 1 } } } };
    expect(await computeCacheKey(a)).toBe(await computeCacheKey(b));
  });
});

describe('params fingerprint', () => {
  it('changes when temperature changes (else re-translating replays the old text)', async () => {
    const cold = { ...base, provider: { ...provider, params: { temperature: 0 } } };
    const warm = { ...base, provider: { ...provider, params: { temperature: 1.2 } } };
    expect(await computeCacheKey(cold)).not.toBe(await computeCacheKey(warm));
    expect(await computeCacheKey(cold)).not.toBe(await computeCacheKey(base));
  });

  it('separates the knobs — temperature 1 is not maxOutputTokens 1', async () => {
    const t = { ...base, provider: { ...provider, params: { temperature: 1 } } };
    const m = { ...base, provider: { ...provider, params: { maxOutputTokens: 1 } } };
    expect(await computeCacheKey(t)).not.toBe(await computeCacheKey(m));
  });

  it('the reasoning toggle re-keys — thinking on and off are different translations', async () => {
    const on = { ...base, provider: { ...provider, params: { reasoning: true } } };
    const off = { ...base, provider: { ...provider, params: { reasoning: false } } };
    expect(await computeCacheKey(on)).not.toBe(await computeCacheKey(off));
    expect(await computeCacheKey(off)).not.toBe(await computeCacheKey(base));
  });

  it('an empty params object keys the same as no params at all', async () => {
    const empty = { ...base, provider: { ...provider, params: {} } };
    expect(await computeCacheKey(empty)).toBe(await computeCacheKey(base));
  });
});

describe('singleTranslationKey (the cross-path shared derivation)', () => {
  const cfg: Pick<Config, 'prompt' | 'glossary'> = { prompt: { styles: [], siteRules: [] }, glossary: [] };

  it('same text+config → same key regardless of caller', async () => {
    const a = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg);
    const b = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg);
    expect(a.key).toBe(b.key);
    expect(a.built.prompt).toBe('Hello');
  });

  it('page title does NOT split the MT-style key but DOES enter via the LLM system prompt', async () => {
    const plain = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg);
    const titled = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg, { title: 'Some Page' });
    // for the LLM the title is real context (in the system prompt) → different key
    expect(titled.key).not.toBe(plain.key);
    expect(titled.built.system).toContain('Some Page');
  });

  it('prompt-affecting config (expert system template) changes the key', async () => {
    const plain = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg);
    const custom = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', {
      prompt: { styles: [], siteRules: [], expert: { single: { system: 'X {target}' } } },
      glossary: [],
    });
    expect(custom.key).not.toBe(plain.key);
  });

  it('a MATCHING glossary rule re-keys the text; unrelated texts keep their key', async () => {
    const noGloss = await singleTranslationKey('Restart the pod', provider, 'auto', 'zh-CN', cfg);
    const withGloss = {
      prompt: { styles: [] as never[], siteRules: [] as never[] },
      glossary: [{ id: 's1', name: 'AI 术语集', enabled: true, entries: [{ source: 'Pod', target: '容器组' }] }],
    };
    const matched = await singleTranslationKey('Restart the pod', provider, 'auto', 'zh-CN', withGloss);
    expect(matched.key).not.toBe(noGloss.key);
    expect(matched.built.system).toContain('Pod → 容器组');

    const unrelated1 = await singleTranslationKey('Hello there', provider, 'auto', 'zh-CN', cfg);
    const unrelated2 = await singleTranslationKey('Hello there', provider, 'auto', 'zh-CN', withGloss);
    expect(unrelated2.key).toBe(unrelated1.key); // glossary growth doesn't bust unrelated cache
  });

  it('the page overview (通读全文) enters the key through the system prompt', async () => {
    const plain = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg);
    const withOverview = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg, { summary: '概览' });
    expect(withOverview.key).not.toBe(plain.key);
    expect(withOverview.built.system).toContain('概览');
  });

  it('the ACTIVE STYLE changes the key (switching styles re-keys automatically)', async () => {
    const plain = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', cfg);
    const styled = await singleTranslationKey('Hello', provider, 'auto', 'zh-CN', {
      prompt: { styles: [], siteRules: [], activeStyleId: 'builtin:academic' },
      glossary: [],
    });
    expect(styled.key).not.toBe(plain.key);
    expect(styled.built.system).toContain('Style directives');
  });
});

it('separates prompt fields containing the old key delimiter', async () => {
  const a = { ...base, systemPrompt: 'a|b', userPrompt: 'c' };
  const b = { ...base, systemPrompt: 'a', userPrompt: 'b|c' };
  expect(await computeCacheKey(a)).not.toBe(await computeCacheKey(b));
});

it('separates provider model and endpoint containing the old delimiter', async () => {
  const a = { ...base, provider: { ...provider, model: 'a~b', baseURL: 'c' } };
  const b = { ...base, provider: { ...provider, model: 'a', baseURL: 'b~c' } };
  expect(await computeCacheKey(a)).not.toBe(await computeCacheKey(b));
});
