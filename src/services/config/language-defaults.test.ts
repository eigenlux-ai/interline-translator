import { fakeBrowser } from 'wxt/testing/fake-browser';
import { storage } from '#imports';
import { describe, expect, it, vi } from 'vitest';
import { PROJECT_PREFIX } from '@/constants';
import { syncUiLocaleFrom } from '@/i18n';
import { registerConfigGateway } from './gateway';
import { browserTranslationTarget, getBrowserTranslationTarget } from './language-defaults';
import { defaultPublicConfig, getConfigService, PUBLIC_CONFIG_KEY, toPublicConfig } from './public';
import { defaultConfig } from './schema';
import { getConfig, setConfig } from './storage';

describe('browser language initialization', () => {
  it.each([
    ['en-US', 'en', false, 'en'],
    ['en-GB', 'en', false, 'en'],
    ['zh-CN', 'zh-CN', true, 'zh'],
    ['zh-HK', 'zh-TW', true, 'zh-TW'],
    ['zh-Hant', 'zh-TW', true, 'zh-TW'],
    ['zh-Hans-HK', 'zh-CN', true, 'zh'],
    ['ja-JP', 'ja', true, 'ja'],
    ['pt-BR', 'pt', true, 'pt'],
    ['nl-NL', 'nl', true, 'en'],
  ])('%s seeds %s and input translation enabled=%s', async (locale, target, enabled, ui) => {
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue(locale);
    registerConfigGateway();
    await getConfigService().patch({});
    const config = await getConfig();
    expect(config.translate.target).toBe(target);
    expect(config.language.ui).toBe('auto');
    expect(config.inputTranslation).toEqual({ enabled, triggerCount: 3, target: 'en' });
    expect(defaultPublicConfig()).toEqual(toPublicConfig(config));
    expect(syncUiLocaleFrom(undefined)).toBe('en');
    expect(syncUiLocaleFrom(config)).toBe(ui);
  });

  it('persists the first seed even if the browser language later changes', async () => {
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('ja-JP');
    registerConfigGateway();
    await getConfigService().patch({}); // Wait behind initialization in the write queue.
    const initial = await getConfig();
    const stored = await fakeBrowser.storage.local.get(`${PROJECT_PREFIX}:config`);
    expect(stored[`${PROJECT_PREFIX}:config`]).toEqual(initial);
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('en-US');
    expect(await getConfig()).toEqual(initial);
  });

  it('preserves existing target, UI override and manually enabled input translation', async () => {
    const existing = defaultConfig('en');
    existing.language.ui = 'ja';
    existing.inputTranslation = { enabled: true, triggerCount: 2, target: 'fr' };
    await setConfig(existing);
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('zh-TW');
    expect(await getConfig()).toEqual(existing);
  });

  it('retains legacy defaults when upgrading an unsaved profile on an English browser', async () => {
    const legacy = defaultConfig('zh-CN');
    await storage.setItem(PUBLIC_CONFIG_KEY, toPublicConfig(legacy));
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('en-US');
    registerConfigGateway();
    await getConfigService().patch({});
    expect(await getConfig()).toEqual(legacy);
    expect(syncUiLocaleFrom(await getConfig())).toBe('zh');
  });

  it('keeps a failed seed stable and retries without overwriting later user edits', async () => {
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('ja-JP');
    vi.spyOn(fakeBrowser.storage.local, 'set').mockRejectedValueOnce(new Error('temporary failure'));
    const alarm = vi.spyOn(fakeBrowser.alarms, 'create');
    registerConfigGateway();
    await getConfigService().patch({});
    await vi.waitFor(() => expect(alarm).toHaveBeenCalled());
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('en-US');
    const pending = await getConfig();
    expect(pending.translate.target).toBe('ja');
    pending.translate.target = 'de'; // Readers cannot mutate the cached seed.
    expect((await getConfig()).translate.target).toBe('ja');
    const name = alarm.mock.calls[0][0] as string;
    await fakeBrowser.alarms.onAlarm.trigger({ name, scheduledTime: Date.now() });
    await getConfigService().patch({});
    const saved = await fakeBrowser.storage.local.get(`${PROJECT_PREFIX}:config`);
    expect(saved[`${PROJECT_PREFIX}:config`]).toMatchObject({ translate: { target: 'ja' } });

    await setConfig(defaultConfig('fr'));
    await fakeBrowser.alarms.onAlarm.trigger({ name, scheduledTime: Date.now() });
    await getConfigService().patch({});
    expect((await getConfig()).translate.target).toBe('fr');
  });

  it('falls back to English if browser locale is invalid or unavailable', () => {
    expect(browserTranslationTarget('')).toBe('en');
    expect(browserTranslationTarget('not a locale')).toBe('en');
    vi.mocked(fakeBrowser.i18n.getUILanguage).mockImplementation(() => {
      throw new Error('unavailable');
    });
    expect(getBrowserTranslationTarget()).toBe('en');
    expect(defaultConfig().inputTranslation.enabled).toBe(false);
  });
});
