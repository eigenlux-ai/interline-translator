import { describe, expect, it } from 'vitest';
import type { Config } from '@/data/models';
import { defaultConfig, FREE_MT_PROVIDER_ID } from '@/services/config/schema';
import { draftImportedProviders } from './BackupSettings';

/** A backup file as it comes off disk: engines saved while they were live. */
function imported(): Config {
  const cfg = defaultConfig();
  cfg.providers.push({
    id: 'my-openai',
    kind: 'openai',
    apiKeys: ['sk-secret'],
    model: 'gpt-4o-mini',
    enabled: true,
  });
  return cfg;
}

describe('draftImportedProviders', () => {
  it('sends every gated engine back through the validation gate', () => {
    const p = draftImportedProviders(imported()).providers[1];
    expect(p.draft).toBe(true);
    expect(p.enabled).toBe(false);
    // Still listed, key intact — the user re-validates, they do not re-type.
    expect(p.apiKeys).toEqual(['sk-secret']);
  });

  it('leaves the free MT engine alone — it has no gate to pass', () => {
    const providers = draftImportedProviders(imported()).providers;
    expect(providers.map((x) => x.id)).toEqual([FREE_MT_PROVIDER_ID, 'my-openai']);
    expect(providers[0]).toEqual(defaultConfig().providers[0]);
  });
});
