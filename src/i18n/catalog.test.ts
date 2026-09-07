import { describe, expect, it } from 'vitest';
import { UI_LANGS, type UiLang } from '@/data/models/lang';
import { m } from '@/paraglide/messages.js';

const catalogs = import.meta.glob<Record<string, string>>('../../messages/*.json', {
  eager: true,
  import: 'default',
});
const browserCatalogs = import.meta.glob<Record<string, { message: string }>>('../../public/_locales/*/messages.json', {
  eager: true,
  import: 'default',
});
const placeholders = (value: string) => [...value.matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort();
const source = catalogs['../../messages/en.json'];
const messageKeys = Object.keys(source)
  .filter((key) => key !== '$schema')
  .sort();

describe('localization catalog integrity', () => {
  it('ships exactly the configured interface locales', () => {
    expect(
      Object.keys(catalogs)
        .map((path) => path.split('/').pop()!.replace('.json', ''))
        .sort()
    ).toEqual([...UI_LANGS].sort());
  });

  for (const locale of UI_LANGS) {
    it(`${locale}: complete messages, matching placeholders, and current compiled output`, () => {
      const catalog = catalogs[`../../messages/${locale}.json`];
      expect(
        Object.keys(catalog)
          .filter((key) => key !== '$schema')
          .sort()
      ).toEqual(messageKeys);
      for (const key of messageKeys) {
        const value = catalog[key];
        expect(value.trim(), key).not.toBe('');
        expect(placeholders(value), key).toEqual(placeholders(source[key]));
        const inputs = Object.fromEntries(placeholders(value).map((name) => [name, `TEST_${name}`]));
        const render = m[key as keyof typeof m] as (
          inputs: Record<string, string>,
          options: { locale: UiLang }
        ) => string;
        expect(render(inputs, { locale }), key).toBe(value.replace(/\{(\w+)\}/g, (_, name: string) => inputs[name]));
      }
    });
  }

  it('keeps browser messages complete and descriptions within the manifest limit', () => {
    const keys = Object.keys(browserCatalogs['../../public/_locales/en/messages.json']).sort();
    for (const [path, catalog] of Object.entries(browserCatalogs)) {
      expect(Object.keys(catalog).sort(), path).toEqual(keys);
      for (const { message } of Object.values(catalog)) expect(message.trim(), path).not.toBe('');
      expect(catalog.extDescription.message.length, path).toBeLessThanOrEqual(132);
    }
  });
});
