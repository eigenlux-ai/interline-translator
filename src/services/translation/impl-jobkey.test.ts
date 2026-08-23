/**
 * jobKey must cover every request field that changes the output — mirroring
 * the persistent cache key — or two DIFFERENT concurrent requests would share
 * one in-flight promise through the RequestQueue's dedup.
 */
import { describe, expect, it } from 'vitest';
import type { Config, ProviderConfig } from '@/data/models';
import { jobKey } from './impl';
import { makeTestConfig } from '@/test-utils/config';

const llm: ProviderConfig = { id: 'oai', kind: 'openai', apiKeys: ['sk'], model: 'g', enabled: true };
const mt: ProviderConfig = { id: 'google-free', kind: 'google-mt', apiKeys: [], model: '', enabled: true };

const config: Config = makeTestConfig({
  providers: [llm, mt],
  translate: { defaultProviderId: 'oai', source: 'auto', target: 'zh-CN', skipLanguages: [] },
});

describe('jobKey', () => {
  const base = { text: 'hello', source: 'auto', target: 'zh-CN' } as const;

  it('differs by MODE (mt vs llm must never share a result)', () => {
    expect(jobKey(config, { ...base })).not.toBe(jobKey(config, { ...base, mode: 'mt' }));
  });

  it('differs by SOURCE', () => {
    expect(jobKey(config, { ...base, source: 'ja' })).not.toBe(jobKey(config, { ...base, source: 'en' }));
  });

  it('uses the RESOLVED provider — distinct unresolvable ids dedup to the same engine', () => {
    // 'ghost' does not exist → falls back to the default; must equal the explicit default key.
    expect(jobKey(config, { ...base, providerId: 'ghost' })).toBe(jobKey(config, { ...base, providerId: 'oai' }));
  });

  it('differs by CONTEXT — the domain picks the per-site PromptStyle', () => {
    // Input translation sends `{ domain, title }`; two tabs translating the
    // same draft on different sites get DIFFERENT prompts, so sharing one
    // in-flight job would hand the second tab the first site's styling.
    expect(jobKey(config, { ...base, context: { domain: 'github.com' } })).not.toBe(
      jobKey(config, { ...base, context: { domain: 'news.ycombinator.com' } })
    );
  });

  it('is order-insensitive inside context — the same context still dedups', () => {
    expect(jobKey(config, { ...base, context: { domain: 'a.com', title: 'T' } })).toBe(
      jobKey(config, { ...base, context: { title: 'T', domain: 'a.com' } })
    );
  });
});
