import { fakeBrowser } from 'wxt/testing';
import { describe, expect, it } from 'vitest';
import { PROJECT_PREFIX } from '@/constants';
import { defaultConfig, FREE_MT_PROVIDER_ID } from './schema';
import { getConfig, setConfig } from './storage';

/**
 * Read/write/salvage semantics against fake-browser storage. The salvage
 * cases pin the fix for "one bad field = silent factory reset": a corrupted
 * SECTION must revert alone — the user's providers/keys in the other sections
 * must survive — and inside `providers`, a corrupted ENTRY must revert alone,
 * because a wholesale revert there is what actually costs the user their keys.
 */

const KEY = `${PROJECT_PREFIX}:config`;

/** A realistic user config: an added LLM provider with an API key. */
function userConfig() {
  const cfg = defaultConfig();
  cfg.providers.push({
    id: 'my-openai',
    kind: 'openai',
    apiKeys: ['sk-secret'],
    model: 'gpt-4o-mini',
    enabled: true,
  });
  cfg.translate.defaultProviderId = 'my-openai';
  return cfg;
}

describe('config storage', () => {
  it('round-trips a valid config', async () => {
    await setConfig(userConfig());
    const read = await getConfig();
    expect(read.providers.map((p) => p.id)).toEqual([FREE_MT_PROVIDER_ID, 'my-openai']);
    expect(read.providers[1].apiKeys).toEqual(['sk-secret']);
  });

  it('returns defaults when storage is empty', async () => {
    expect(await getConfig()).toEqual(defaultConfig());
  });

  it('salvages intact sections when ONE section is corrupted', async () => {
    const cfg = userConfig() as unknown as Record<string, unknown>;
    cfg.appearance = { colorScheme: 'neon' }; // invalid enum + missing fields
    await fakeBrowser.storage.local.set({ [KEY]: cfg });

    const read = await getConfig();
    // The user's providers/keys survive…
    expect(read.providers.map((p) => p.id)).toEqual([FREE_MT_PROVIDER_ID, 'my-openai']);
    expect(read.providers[1].apiKeys).toEqual(['sk-secret']);
    expect(read.translate.defaultProviderId).toBe('my-openai');
    // …and only the broken section reverts to defaults.
    expect(read.appearance).toEqual(defaultConfig().appearance);
  });

  it('keeps the valid sections of a PARTIAL config (rest = defaults)', async () => {
    // Partial config merges valid sections with defaults for missing sections.
    await fakeBrowser.storage.local.set({ [KEY]: { siteControl: { defaultMode: 'always', rules: [] } } });
    const read = await getConfig();
    expect(read.siteControl.defaultMode).toBe('always');
    expect(read.providers).toEqual(defaultConfig().providers);
  });

  it('falls back to full defaults when nothing validates', async () => {
    await fakeBrowser.storage.local.set({ [KEY]: { providers: 'not-an-array', translate: 42 } });
    expect(await getConfig()).toEqual(defaultConfig());
  });
});

describe('providers salvage (per entry)', () => {
  it('keeps the other engines AND their keys when ONE entry is malformed', async () => {
    const cfg = userConfig() as unknown as Record<string, unknown>;
    // A hand-edited kind: the entry can never be repaired, but the neighbour
    // holds a working API key that storage must not forget.
    (cfg.providers as unknown[]).push({ id: 'typo', kind: 'openia', apiKeys: [], model: 'x', enabled: true });
    await fakeBrowser.storage.local.set({ [KEY]: cfg });

    const read = await getConfig();
    expect(read.providers.map((p) => p.id)).toEqual([FREE_MT_PROVIDER_ID, 'my-openai']);
    expect(read.providers[1].apiKeys).toEqual(['sk-secret']);
  });

  it('an out-of-range knob costs the knob, not the engine', async () => {
    const cfg = userConfig();
    cfg.providers[1].params = { maxOutputTokens: 0 } as never; // 0 truncates every batch → rejected
    await fakeBrowser.storage.local.set({ [KEY]: cfg });

    const read = await getConfig();
    expect(read.providers[1].apiKeys).toEqual(['sk-secret']);
    expect(read.providers[1].params).toBeUndefined();
  });

  it('reverts to the seeded engine only when NO entry survives', async () => {
    await fakeBrowser.storage.local.set({ [KEY]: { providers: [{ id: 'x' }, { kind: 'openai' }] } });
    expect((await getConfig()).providers).toEqual(defaultConfig().providers);
  });
});
