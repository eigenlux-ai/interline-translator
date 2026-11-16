import { describe, expect, it, vi } from 'vitest';
import { languageName } from '@/services/translation/prompts';
import { langOptions, normalizeLanguageCode, pairGlyphs } from './lang';

it.each([
  ['zh-Hant-CN', 'zh-TW'],
  ['zh-Hans-HK', 'zh-CN'],
  ['zh_MO', 'zh-TW'],
  ['pt-BR', 'pt'],
  ['nb-NO', 'nb'],
  ['fil-PH', 'fil'],
  ['und', null],
  ['not a locale', null],
])('normalizes %s to %s', (locale, expected) => {
  expect(normalizeLanguageCode(locale)).toBe(expected);
});

it('treats an engine that reports no language subtag as undetermined', () => {
  // Node 22 and the Chromium builds of its era return undefined for `und`.
  const stub = vi.spyOn(Intl, 'Locale').mockImplementation(function () {
    return { language: undefined };
  } as unknown as typeof Intl.Locale);
  expect(normalizeLanguageCode('und')).toBeNull();
  stub.mockRestore();
});

it('names non-common languages in pickers and LLM prompts, preserving custom codes', () => {
  expect(langOptions(['nl'])).toEqual([{ value: 'nl', label: 'Nederlands' }]);
  expect(languageName('nl')).toBe('Dutch');
  expect(languageName('nb')).toBe('Norwegian Bokmål');
  expect(languageName('fil')).toBe('Filipino');
  expect(langOptions(['custom-code!'])).toEqual([{ value: 'custom-code!', label: 'custom-code!' }]);
  expect(languageName('custom-code!')).toBe('custom-code!');
});

describe('pairGlyphs — the seal face carries the language DIRECTION', () => {
  it('auto source → null src (the globe mark), target script as dst', () => {
    expect(pairGlyphs('auto', 'zh-CN')).toEqual({ src: null, dst: '文' });
    expect(pairGlyphs('auto', 'en')).toEqual({ src: null, dst: 'A' });
    expect(pairGlyphs('auto', 'ja')).toEqual({ src: null, dst: 'あ' });
  });

  it('a pinned source shows its own script top-left', () => {
    expect(pairGlyphs('en', 'zh-CN')).toEqual({ src: 'A', dst: '文' });
    expect(pairGlyphs('ja', 'zh-CN')).toEqual({ src: 'あ', dst: '文' });
    expect(pairGlyphs('zh-CN', 'en')).toEqual({ src: '文', dst: 'A' });
    expect(pairGlyphs('ru', 'de')).toEqual({ src: 'Я', dst: 'A' });
  });

  it('degenerate same-letterform pairs fall back to the globe (never "A / A")', () => {
    expect(pairGlyphs('en', 'es')).toEqual({ src: null, dst: 'A' });
    expect(pairGlyphs('zh-TW', 'zh-CN')).toEqual({ src: null, dst: '文' });
    expect(pairGlyphs('ru', 'uk')).toEqual({ src: null, dst: 'Я' });
  });

  it('unknown codes on either side fall back to the Latin form', () => {
    expect(pairGlyphs('vi', 'zh-CN')).toEqual({ src: 'A', dst: '文' });
    expect(pairGlyphs('vi', 'en')).toEqual({ src: null, dst: 'A' }); // both degrade to A → globe
  });
});
