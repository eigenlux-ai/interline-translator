import { describe, expect, it } from 'vitest';
import { pairGlyphs } from './lang';

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
