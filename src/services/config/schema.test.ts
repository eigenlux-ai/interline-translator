import { describe, expect, it } from 'vitest';
import { CONFIG_VERSION, migrate } from './migrations/v001';
import { configSchema, defaultConfig, FREE_MT_PROVIDER_ID, isSafeBaseURL } from './schema';

describe('config schema', () => {
  it('the seeded default config is valid', () => {
    expect(() => configSchema.parse(defaultConfig())).not.toThrow();
  });

  it('seeds the free MT provider as the default engine', () => {
    const c = defaultConfig();
    expect(c.translate.defaultProviderId).toBe(FREE_MT_PROVIDER_ID);
    expect(c.providers.some((p) => p.id === FREE_MT_PROVIDER_ID && p.kind === 'google-mt')).toBe(true);
  });

  it('rejects an invalid config', () => {
    const bad = { ...defaultConfig(), providers: [{ id: '', kind: 'nope' }] };
    expect(() => configSchema.parse(bad)).toThrow();
  });

  it('supplies the inputTranslation default for configs saved before that field', () => {
    const legacy = { ...defaultConfig() } as Record<string, unknown>;
    delete legacy.inputTranslation;
    const parsed = configSchema.parse(legacy);
    expect(parsed.inputTranslation).toEqual({ enabled: true, triggerCount: 3, target: 'en' });
  });

  it('rejects an out-of-range trigger count', () => {
    const bad = { ...defaultConfig(), inputTranslation: { enabled: true, triggerCount: 9, target: 'en' } };
    expect(() => configSchema.parse(bad)).toThrow();
  });

  it('migrate is idempotent on a current config and stamps the version', () => {
    const c = defaultConfig() as unknown as Record<string, unknown>;
    const once = migrate(c);
    const twice = migrate(once);
    expect(twice).toEqual(once);
    expect(once.version).toBe(defaultConfig().version);
  });

  it('migrate upgrades a versionless blob to the current version', () => {
    const migrated = migrate({ providers: [] });
    expect(migrated.version).toBe(defaultConfig().version);
  });

  it('v2 resets the never-user-set language.ui seed to auto (follow the target)', () => {
    const v1 = { ...defaultConfig(), version: 1, language: { ui: 'en' } } as Record<string, unknown>;
    const migrated = migrate(v1);
    expect(migrated.language).toEqual({ ui: 'auto' });
    expect(migrated.version).toBe(CONFIG_VERSION);
    expect(() => configSchema.parse(migrated)).not.toThrow();
  });

  it('supplies the displayMode default for configs saved before that field', () => {
    const legacy = defaultConfig() as unknown as Record<string, unknown>;
    delete (legacy.appearance as Record<string, unknown>).displayMode;
    const parsed = configSchema.parse(legacy);
    expect(parsed.appearance.displayMode).toBe('bilingual');
  });
});

describe('provider baseURL safety', () => {
  it('takes https anywhere, and http only on a local host', () => {
    expect(isSafeBaseURL('https://api.example.com/v1')).toBe(true);
    expect(isSafeBaseURL('http://localhost:11434/v1')).toBe(true); // the seeded Ollama base
    expect(isSafeBaseURL('http://127.0.0.1:8080')).toBe(true);
    expect(isSafeBaseURL('http://[::1]:8080/v1')).toBe(true);
    expect(isSafeBaseURL('http://ollama.local/v1')).toBe(true);

    expect(isSafeBaseURL('http://evil.example.com')).toBe(false);
    expect(isSafeBaseURL('http://localhost.evil.example.com')).toBe(false); // a suffix is not a host
    expect(isSafeBaseURL('ftp://files.example.com')).toBe(false);
    expect(isSafeBaseURL('api.example.com')).toBe(false); // no scheme = not a URL
    expect(isSafeBaseURL('')).toBe(false);
  });

  it('drops an unsafe endpoint but keeps the engine — and its key', () => {
    const cfg = defaultConfig();
    cfg.providers.push({
      id: 'llm',
      kind: 'openai-compatible',
      apiKeys: ['sk-secret'],
      baseURL: 'http://evil.example.com',
      model: 'llama3.1',
      enabled: true,
    });
    const p = configSchema.parse(cfg).providers[1];
    expect(p.baseURL).toBeUndefined(); // never used, so the key never goes out in the clear
    expect(p.apiKeys).toEqual(['sk-secret']);
  });

  it('keeps a safe endpoint verbatim', () => {
    const cfg = defaultConfig();
    cfg.providers.push({
      id: 'ollama',
      kind: 'openai-compatible',
      apiKeys: [],
      baseURL: 'http://localhost:11434/v1',
      model: 'llama3.1',
      enabled: true,
    });
    expect(configSchema.parse(cfg).providers[1].baseURL).toBe('http://localhost:11434/v1');
  });
});

describe('migration v3 — PromptStyle system', () => {
  it('moves translate.custom*Prompt into prompt.expert.single and deletes the old fields', () => {
    const old = {
      version: 2,
      translate: { source: 'auto', target: 'zh-CN', customSystemPrompt: 'SYS {target}', customUserPrompt: 'U {text}' },
    };
    const out = migrate(old) as {
      version: number;
      translate: Record<string, unknown>;
      prompt: { styles: unknown[]; siteRules: unknown[]; expert?: { single?: { system?: string; user?: string } } };
    };
    expect(out.version).toBeGreaterThanOrEqual(3);
    expect(out.translate.customSystemPrompt).toBeUndefined();
    expect(out.translate.customUserPrompt).toBeUndefined();
    expect(out.prompt.expert?.single).toEqual({ system: 'SYS {target}', user: 'U {text}' });
    expect(out.prompt.styles).toEqual([]);
    expect(out.prompt.siteRules).toEqual([]);
  });

  it('a config without custom prompts gets a bare prompt node (no expert)', () => {
    const out = migrate({ version: 2, translate: { source: 'auto', target: 'zh-CN' } }) as {
      prompt: { expert?: unknown };
    };
    expect(out.prompt).toBeDefined();
    expect(out.prompt.expert).toBeUndefined();
  });
});

describe('migration v4 — glossary sets', () => {
  it('wraps flat entries into sets grouped by their old per-entry pattern', () => {
    const out = migrate({
      version: 3,
      glossary: [
        { source: 'Pod', target: '容器组' },
        { source: 'Service', target: '服务', pattern: '*.k8s.io' },
        { source: 'thread', target: '线程' },
      ],
    }) as { glossary: Array<{ name: string; enabled: boolean; pattern?: string; entries: unknown[] }> };
    expect(out.glossary).toHaveLength(2);
    const [plain, scoped] = out.glossary;
    expect(plain.enabled).toBe(true);
    expect(plain.pattern).toBeUndefined();
    expect(plain.entries).toHaveLength(2);
    expect(scoped.pattern).toBe('*.k8s.io');
    expect(scoped.entries).toEqual([{ source: 'Service', target: '服务' }]);
  });

  it('no glossary → empty sets; already-sets shape passes through', () => {
    expect((migrate({ version: 3 }) as { glossary: unknown[] }).glossary).toEqual([]);
    const sets = [{ id: 'x', name: 'X', enabled: true, entries: [] }];
    expect((migrate({ version: 3, glossary: sets }) as { glossary: unknown[] }).glossary).toEqual(sets);
  });
});

describe('migration idempotence on version-less re-import', () => {
  it('a config that already HAS a prompt node keeps it (v3 must not wipe styles on re-run)', () => {
    const out = migrate({
      // version stripped by a hand edit — migrate() starts from 0
      prompt: { styles: [{ id: 'u1', name: '我的', directives: 'X' }], siteRules: [], activeStyleId: 'u1' },
      glossary: [{ id: 's1', name: 'S', enabled: true, entries: [] }],
      translate: { source: 'auto', target: 'zh-CN' },
    }) as { prompt: { styles: unknown[]; activeStyleId?: string }; glossary: unknown[] };
    expect(out.prompt.styles).toHaveLength(1);
    expect(out.prompt.activeStyleId).toBe('u1');
    expect(out.glossary).toHaveLength(1); // v4's own guard
  });
});
