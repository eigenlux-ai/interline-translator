import { storage } from '#imports';
import { describe, expect, it } from 'vitest';
import type { Config, ProviderConfig } from '@/data/models';
import { registerConfigGateway } from './gateway';
import { CONFIG_VERSION } from './migrations/v001';
import { defaultPublicConfig, getConfigService, getPublicConfig, PUBLIC_CONFIG_KEY, toPublicConfig } from './public';
import { defaultConfig } from './schema';
import { getConfig, setConfig } from './storage';

const tick = (ms = 20) => new Promise((r) => setTimeout(r, ms));

function withLlmProvider(): Config {
  const cfg = defaultConfig();
  cfg.providers.push({
    id: 'my-openai',
    kind: 'openai',
    label: 'My OpenAI',
    apiKeys: ['sk-secret'],
    model: 'gpt-4o-mini',
    enabled: true,
  });
  cfg.translate.defaultProviderId = 'my-openai';
  return cfg;
}

describe('toPublicConfig', () => {
  it('strips the providers array (API keys) and derives the default engine label', () => {
    const pub = toPublicConfig(withLlmProvider());
    expect(JSON.stringify(pub)).not.toContain('sk-secret');
    expect('providers' in pub).toBe(false);
    expect(pub.defaultProviderLabel).toBe('My OpenAI');
  });

  it('defaultPublicConfig mirrors toPublicConfig(defaultConfig()) — the hand-written copy cannot drift', () => {
    // public.ts must stay zod-free, so its defaults are written by hand; this
    // is the pin that keeps them equal to the real schema defaults.
    expect(defaultPublicConfig()).toEqual(toPublicConfig(defaultConfig()));
  });
});

describe('config gateway', () => {
  it('mirrors every full-config change into the public projection', async () => {
    registerConfigGateway();
    await tick(); // initial mirror
    await setConfig(withLlmProvider());
    await tick();

    const pub = await getPublicConfig();
    expect(pub.translate.defaultProviderId).toBe('my-openai');
    expect(pub.defaultProviderLabel).toBe('My OpenAI');
    const raw = await storage.getItem(PUBLIC_CONFIG_KEY);
    expect(JSON.stringify(raw)).not.toContain('sk-secret');
  });

  it('patch() merges whitelisted sections and IGNORES a smuggled providers write', async () => {
    registerConfigGateway();
    await setConfig(withLlmProvider());
    await tick();

    const evil: ProviderConfig = {
      id: 'exfil',
      kind: 'openai-compatible',
      apiKeys: [],
      baseURL: 'https://evil.example',
      model: 'x',
      enabled: true,
    };
    await getConfigService().patch({
      siteControl: { defaultMode: 'always', rules: [] },
      // Not part of PublicConfigPatch — cast to simulate a hostile caller.
      ...({ providers: [evil], version: 99 } as object),
    });
    await tick();

    const cur = await getConfig();
    expect(cur.siteControl.defaultMode).toBe('always'); // whitelisted section landed
    expect(cur.providers.map((p) => p.id)).toEqual(['google-free', 'my-openai']); // smuggle ignored
    expect(cur.version).toBe(CONFIG_VERSION); // the smuggled version: 99 was dropped
    const pub = await getPublicConfig();
    expect(pub.siteControl.defaultMode).toBe('always'); // and the mirror followed
  });

  it('patch() with nothing whitelisted is a no-op', async () => {
    registerConfigGateway();
    await setConfig(withLlmProvider());
    const before = await getConfig();
    await getConfigService().patch({ ...({ providers: [] } as object) });
    expect(await getConfig()).toEqual(before);
  });
});

describe('toPublicConfig — annotate gate follows the RUNTIME provider selection', () => {
  it('a DISABLED default provider is skipped in favor of the first enabled non-draft (mirrors resolveProvider)', async () => {
    const { toPublicConfig } = await import('./public');
    const { defaultConfig } = await import('./schema');
    const cfg = defaultConfig();
    cfg.providers = [
      { id: 'oai', kind: 'openai', apiKeys: ['sk'], model: 'g', enabled: false }, // disabled default
      { id: 'google-free', kind: 'google-mt', apiKeys: [], model: '', enabled: true },
    ];
    cfg.translate.defaultProviderId = 'oai';
    const pub = toPublicConfig(cfg);
    // The runtime would fall back to the MT engine — the 注疏 gate must see MT,
    // not the disabled LLM (which rendered a button that could never work).
    expect(pub.defaultProviderKind).toBe('google-mt');
  });

  it('a draft default is skipped the same way', async () => {
    const { toPublicConfig } = await import('./public');
    const { defaultConfig } = await import('./schema');
    const cfg = defaultConfig();
    cfg.providers = [
      { id: 'oai', kind: 'openai', apiKeys: ['sk'], model: 'g', enabled: true, draft: true },
      { id: 'anthropic', kind: 'anthropic', apiKeys: ['sk'], model: 'c', enabled: true },
    ];
    cfg.translate.defaultProviderId = 'oai';
    expect(toPublicConfig(cfg).defaultProviderKind).toBe('anthropic');
  });
});
