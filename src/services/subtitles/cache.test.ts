import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { clearCache, dexieCache } from '@/services/translation/cache/db';
import { makeTestConfig } from '@/test-utils/config';
import { clearSubtitleCache, subtitleCacheEpoch, subtitleCacheKey, writeSubtitleCache } from './cache';
import type { SubtitleWindow } from './protocol';

afterEach(() => clearCache());
const window: SubtitleWindow = {
  generation: 1,
  trackVersion: 'a',
  sourceLanguage: 'en',
  title: 'video',
  subscriptions: [],
};
const item = {
  subscriptionId: 'one',
  cueId: 'cue',
  contentVersion: 'version',
  text: 'Hello',
  context: 'before and after',
  priority: 'current' as const,
};
describe('subtitle semantic cache namespace', () => {
  it('clears only subtitle entries and rejects writes captured before the clear generation', async () => {
    const epoch = subtitleCacheEpoch();
    await dexieCache.set('page-key', 'page');
    await writeSubtitleCache('subtitle:old', 'old', epoch);
    const clearing = clearSubtitleCache();
    const stale = writeSubtitleCache('subtitle:late', 'late', epoch);
    await Promise.all([clearing, stale]);
    expect(await dexieCache.get('page-key')).toBe('page');
    expect(await dexieCache.get('subtitle:old')).toBeUndefined();
    expect(await dexieCache.get('subtitle:late')).toBeUndefined();
    await writeSubtitleCache('subtitle:new', 'new', subtitleCacheEpoch());
    expect(await dexieCache.get('subtitle:new')).toBe('new');
  });
  it('ignores session, cue identity, and playback position; keys actual text/context/provider semantics', async () => {
    const config = makeTestConfig();
    const provider = config.providers[0];
    const key = await subtitleCacheKey(config, provider, 'zh-CN', window, item);
    expect(key).toMatch(/^subtitle:[0-9a-f]{64}$/);
    expect(
      await subtitleCacheKey(
        config,
        { ...provider, apiKeys: ['secret'], label: 'renamed' },
        'zh-CN',
        { ...window, generation: 9, trackVersion: 'other' },
        { ...item, cueId: 'different', distanceMs: 2000 }
      )
    ).toBe(key);
    expect(await subtitleCacheKey(config, provider, 'zh-CN', window, { ...item, context: 'DOM incomplete' })).not.toBe(
      key
    );
    expect(await subtitleCacheKey(config, provider, 'ja', window, item)).not.toBe(key);
    const styled = {
      ...config,
      prompt: {
        ...config.prompt,
        activeStyleId: 'custom',
        styles: [{ id: 'custom', name: 'Custom', directives: 'Use casual speech.' }],
      },
    };
    expect(await subtitleCacheKey(styled, provider, 'zh-CN', window, item)).not.toBe(key);
    expect(await subtitleCacheKey(config, { ...provider, model: 'changed' }, 'zh-CN', window, item)).not.toBe(key);
  });
});
