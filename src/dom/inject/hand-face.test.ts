import { describe, expect, it } from 'vitest';
import { COMMON_LANGS, UI_LANGS } from '@/data/models';
import { handFaceFor, handFaceStyle } from './hand-face';

describe('handFaceFor', () => {
  it('maps each culture to its own written hand', () => {
    expect(handFaceFor('zh-CN')).toBe('kai');
    expect(handFaceFor('zh')).toBe('kai');
    expect(handFaceFor('zh-Hans-SG')).toBe('kai');
    expect(handFaceFor('zh-TW')).toBe('kai-tc');
    expect(handFaceFor('zh-HK')).toBe('kai-tc');
    expect(handFaceFor('zh-Hant')).toBe('kai-tc');
    expect(handFaceFor('zh-Hans-HK')).toBe('kai'); // explicit script beats region
    expect(handFaceFor('zh-Hant-CN')).toBe('kai-tc');
    expect(handFaceFor('ja')).toBe('kyokasho');
    expect(handFaceFor('ko')).toBe('myeongjo');
    expect(handFaceFor('ar')).toBe('naskh');
    expect(handFaceFor('en-US')).toBe('italic');
    expect(handFaceFor('ru')).toBe('italic');
    expect(handFaceFor('el')).toBe('italic');
  });

  it('leaves scripts without a chosen face on the page font', () => {
    for (const lang of ['th', 'hi', 'he', 'fa', 'kk', '', undefined, null]) expect(handFaceFor(lang)).toBeNull();
  });

  it('covers every target the pickers offer and every UI locale (the previews and labels rely on it)', () => {
    for (const lang of [...COMMON_LANGS, ...UI_LANGS]) expect(handFaceFor(lang)).not.toBeNull();
  });
});

describe('handFaceStyle', () => {
  it('only the italic face sets font-style; no face keeps the preview font', () => {
    expect(handFaceStyle('italic').fontStyle).toBe('italic');
    expect(handFaceStyle('kai').fontStyle).toBeUndefined();
    expect(handFaceStyle('kai').fontFamily.endsWith(', serif')).toBe(true);
    expect(handFaceStyle(null)).toEqual({ fontFamily: 'inherit' });
  });
});
