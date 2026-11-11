import { fakeBrowser } from 'wxt/testing';
import { describe, expect, it } from 'vitest';
import { registerConfigGateway } from './gateway';
import { mergeConfigEdits } from './merge';
import { migrate } from './migrations/v001';
import { getConfigService, toPublicConfig } from './public';
import { defaultConfig, videoSubtitlesPatchSchema, videoSubtitlesSchema } from './schema';
import { CONFIG_EDIT_MESSAGE, getConfig, setConfig } from './storage';
import { defaultVideoSubtitles, resolveSubtitleProvider } from './video-subtitles';

const trusted = () => ({ id: fakeBrowser.runtime.id, url: fakeBrowser.runtime.getURL('options.html') });
const edit = async (
  next: ReturnType<typeof defaultConfig>,
  base: ReturnType<typeof defaultConfig>,
  sender = trusted()
) => {
  const results = await fakeBrowser.runtime.onMessage.trigger({ type: CONFIG_EDIT_MESSAGE, next, base }, sender);
  return results.find((r) => r !== undefined);
};

describe('video subtitle preferences', () => {
  it('migrates old backups to manual opt-in defaults and retains inheritance', () => {
    const old = { ...defaultConfig(), version: 4 } as Record<string, unknown>;
    delete old.videoSubtitles;
    expect(migrate(old).videoSubtitles).toEqual(defaultVideoSubtitles());
    expect(defaultVideoSubtitles().platforms.youtube.autoEnable).toBe(false);
  });
  it('validates independent rate/concurrency and bounded budgets, rejecting arbitrary keys', () => {
    expect(
      videoSubtitlesPatchSchema.safeParse({ requests: { maxConcurrent: 2, requestsPerSecond: 0.5 } }).success
    ).toBe(true);
    for (const bad of [
      { requests: { maxConcurrent: 0 } },
      { requests: { requestsPerSecond: 0 } },
      { requests: { maxBatchItems: 6 } },
      { appearance: { backgroundOpacity: 1.1 } },
      { translation: { provider: { mode: 'fixed' } } },
      { arbitrary: true },
    ]) {
      expect(videoSubtitlesPatchSchema.safeParse(bad).success).toBe(false);
    }
    expect(videoSubtitlesSchema.safeParse(defaultVideoSubtitles()).success).toBe(true);
  });
  it('fixed providers do not fall back, summaries exclude keys, endpoints, headers, and drafts', () => {
    const config = defaultConfig();
    config.providers.push({
      id: 'llm',
      kind: 'openai',
      label: 'AI',
      apiKeys: ['secret'],
      baseURL: 'https://private.test',
      extraHeaders: { Authorization: 'private-header' },
      enabled: true,
      model: 'x',
    });
    config.videoSubtitles.translation.provider = { mode: 'fixed', providerId: 'llm' };
    expect(resolveSubtitleProvider(config)?.kind).toBe('openai');
    const summary = toPublicConfig(config);
    expect(summary.effectiveSubtitleProvider).toMatchObject({ status: 'fixed', kind: 'openai' });
    expect(JSON.stringify(summary)).not.toMatch(/secret|private.test|private-header/);
    config.providers[1].draft = true;
    expect(resolveSubtitleProvider(config)).toBeUndefined();
    expect(toPublicConfig(config).availableProviders.map((p) => p.id)).toEqual(['google-free']);
    expect(toPublicConfig(config).effectiveSubtitleProvider.status).toBe('unavailable');
  });
  it('serial field patches preserve unrelated fields from another surface', async () => {
    registerConfigGateway();
    await Promise.all([
      getConfigService().patchVideoSubtitles({
        appearance: { fontSize: 30 },
        platforms: { youtube: { autoEnable: true } },
      }),
      getConfigService().patchVideoSubtitles({
        appearance: { backgroundOpacity: 0.2 },
        platforms: { youtube: { enabled: false } },
      }),
    ]);
    const preferences = (await getConfig()).videoSubtitles;
    expect(preferences.appearance).toMatchObject({ fontSize: 30, backgroundOpacity: 0.2 });
    expect(preferences.platforms.youtube).toEqual({ autoEnable: true, enabled: false });
  });
  it('stale options snapshots and concurrent player patches share a queue without lost edits', async () => {
    registerConfigGateway();
    const base = defaultConfig();
    await setConfig(base);
    const next = structuredClone(base);
    next.appearance.colorScheme = 'dark';
    next.videoSubtitles.appearance.fontSize = 28;
    await Promise.all([
      getConfigService().patchVideoSubtitles({
        translation: { target: { mode: 'fixed', language: 'ja' } },
        appearance: { backgroundOpacity: 0.3 },
      }),
      edit(next, base),
    ]);
    const current = await getConfig();
    expect(current.appearance.colorScheme).toBe('dark');
    expect(current.videoSubtitles.appearance).toMatchObject({ fontSize: 28, backgroundOpacity: 0.3 });
    expect(current.videoSubtitles.translation.target).toEqual({ mode: 'fixed', language: 'ja' });
  });
  it('rejects full-config writes from content senders and resets only subtitle preferences', async () => {
    registerConfigGateway();
    const base = defaultConfig();
    const next = { ...base, providers: [] };
    expect(await edit(next, base, { ...trusted(), url: 'https://youtube.com/watch?v=x' })).toEqual({ ok: false });
    await getConfigService().patch({ translate: { ...base.translate, target: 'fr' } });
    await getConfigService().patchVideoSubtitles({ appearance: { fontSize: 40 } });
    await getConfigService().resetVideoSubtitles();
    const current = await getConfig();
    expect(current.translate.target).toBe('fr');
    expect(current.videoSubtitles).toEqual(defaultVideoSubtitles());
  });
  it('accepts a Firefox options sender carrying its extension tab', async () => {
    registerConfigGateway();
    const base = defaultConfig();
    const next = { ...base, appearance: { ...base.appearance, bilingualStyle: 'card' as const } };
    const extensionTab = { ...trusted(), tab: { id: 1, url: trusted().url } };
    expect(await edit(next, base, extensionTab)).toEqual({ ok: true });
    expect((await getConfig()).appearance.bilingualStyle).toBe('card');
  });
  it('three-way merges remove obsolete union members when switching to inheritance', () => {
    const base = { provider: { mode: 'fixed', providerId: 'x' }, other: 1 };
    expect(mergeConfigEdits({ ...base, other: 2 }, { provider: { mode: 'inherit' }, other: 1 }, base)).toEqual({
      provider: { mode: 'inherit' },
      other: 2,
    });
  });
});
