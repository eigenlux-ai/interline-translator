import { describe, expect, it } from 'vitest';
import { registerConfigGateway } from './gateway';
import { getConfigService, getPublicConfig, toPublicConfig } from './public';
import { defaultConfig } from './schema';
import { setConfig } from './storage';
import { subtitleTranslationRevision } from './subtitle-revision';

function config() {
  const value = defaultConfig();
  value.providers = [
    {
      id: 'llm',
      kind: 'openai-compatible',
      model: 'model-a',
      apiKeys: ['secret-key'],
      enabled: true,
      baseURL: 'https://private.example/v1',
    },
  ];
  value.translate.defaultProviderId = 'llm';
  return value;
}

describe('subtitle semantic revision', () => {
  it('changes for same-id model, endpoint, parameters, prompt and glossary edits', async () => {
    const base = config();
    const revision = await subtitleTranslationRevision(base);
    const edits: ((value: typeof base) => void)[] = [
      (value) => {
        value.providers[0].model = 'model-b';
      },
      (value) => {
        value.providers[0].baseURL = 'https://another.example/v1';
      },
      (value) => {
        value.providers[0].params = { temperature: 0.2 };
      },
      (value) => {
        value.prompt.styles = [{ id: 'plain', name: 'Plain', directives: 'Use concise language' }];
        value.prompt.activeStyleId = 'plain';
      },
      (value) => {
        value.prompt.siteRules = [{ pattern: '*.youtube.com', styleId: 'plain' }];
      },
      (value) => {
        value.glossary = [
          { id: 'terms', name: 'Terms', enabled: true, entries: [{ source: 'kernel', target: '内核' }] },
        ];
      },
    ];
    for (const edit of edits) {
      const changed = structuredClone(base);
      edit(changed);
      expect(await subtitleTranslationRevision(changed)).not.toBe(revision);
    }
  });
  it('does not invalidate completed translations for UI, budget, credentials or unused-provider edits', async () => {
    const base = config();
    const changed = structuredClone(base);
    changed.videoSubtitles.appearance.fontSize = 30;
    changed.videoSubtitles.requests.maxConcurrent = 1;
    changed.providers[0].label = 'Renamed';
    changed.providers[0].apiKeys = ['rotated-secret'];
    changed.providers.push({ id: 'unused', kind: 'google-mt', model: '', apiKeys: [], enabled: true });
    expect(await subtitleTranslationRevision(changed)).toBe(await subtitleTranslationRevision(base));
  });
  it('publishes only a digest and mirrors its current value before a patch resolves', async () => {
    const base = config();
    const revision = await subtitleTranslationRevision(base);
    const projection = toPublicConfig(base, revision);
    expect(revision).toMatch(/^[a-f0-9]{64}$/);
    expect(JSON.stringify(projection)).not.toMatch(/secret-key|private\.example|model-a/);
    await setConfig(base);
    registerConfigGateway();
    await getConfigService().patchVideoSubtitles({ appearance: { fontSize: 26 } });
    expect((await getPublicConfig()).subtitleTranslationRevision).toBe(revision);
    await getConfigService().patchVideoSubtitles({ translation: { target: { mode: 'fixed', language: 'ja' } } });
    expect((await getPublicConfig()).subtitleTranslationRevision).not.toBe(revision);
  });
});
