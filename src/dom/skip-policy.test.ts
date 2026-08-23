// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { __resetDetectorCache, detectSaysSkip, scriptSaysSkip, skipPolicy } from './skip-policy';

afterEach(() => {
  __resetDetectorCache();
  delete (globalThis as unknown as { LanguageDetector?: unknown }).LanguageDetector;
});

const tick = () => new Promise((r) => setTimeout(r));
const win = globalThis as unknown as Window & typeof globalThis;

describe('scriptSaysSkip (layer 1, sync)', () => {
  it('target zh: Chinese-dominant skips, Japanese/English/mixed do not', () => {
    const p = skipPolicy('zh-CN', []);
    expect(scriptSaysSkip('这是一段已经是中文的文本内容', p)).toBe(true);
    expect(scriptSaysSkip('在 JavaScript 中引擎负责执行代码', p)).toBe(true); // Han dominates
    expect(scriptSaysSkip('これは日本語です', p)).toBe(false); // kana ⇒ ja, translate
    expect(scriptSaysSkip('This is plain English text here', p)).toBe(false);
    expect(scriptSaysSkip('This is mostly English with one 中文 word', p)).toBe(false);
  });

  it('target ja skips kana; target ko skips hangul', () => {
    expect(scriptSaysSkip('これは日本語の文章です', skipPolicy('ja', []))).toBe(true);
    expect(scriptSaysSkip('이것은 한국어 문장입니다', skipPolicy('ko', []))).toBe(true);
  });

  it('skipLanguages: target en + skip [zh] → Chinese text is skipped via script', () => {
    const p = skipPolicy('en', ['zh']);
    expect(scriptSaysSkip('这是中文内容应当被跳过', p)).toBe(true);
    expect(scriptSaysSkip('This English line is translated', p)).toBe(false);
  });
});

describe('detectSaysSkip (layer 2, on-device detector)', () => {
  function mockDetector(lang: string, confidence: number) {
    (globalThis as unknown as { LanguageDetector: unknown }).LanguageDetector = {
      availability: async () => 'available',
      create: async () => ({ detect: async () => [{ detectedLanguage: lang, confidence }] }),
    };
  }

  it('returns false when no detector is available', async () => {
    expect(await detectSaysSkip('Some English sentence to detect', skipPolicy('en', []), win)).toBe(false);
  });

  it('skips when the detector is confident the text is the target language', async () => {
    mockDetector('en', 0.99);
    const p = skipPolicy('en', []);
    // First call kicks off async creation (returns false); detector ready next tick.
    await detectSaysSkip('A reasonably long English sentence here', p, win);
    await tick();
    expect(await detectSaysSkip('A reasonably long English sentence here', p, win)).toBe(true);
  });

  it('does not skip short text (below the length threshold)', async () => {
    mockDetector('en', 0.99);
    await detectSaysSkip('short', skipPolicy('en', []), win);
    await tick();
    expect(await detectSaysSkip('short', skipPolicy('en', []), win)).toBe(false);
  });

  it('does not skip on low confidence', async () => {
    mockDetector('en', 0.2);
    const p = skipPolicy('en', []);
    await detectSaysSkip('A reasonably long English sentence here', p, win);
    await tick();
    expect(await detectSaysSkip('A reasonably long English sentence here', p, win)).toBe(false);
  });

  it('matches a skip language by base subtag (detected fr, skip [fr])', async () => {
    mockDetector('fr', 0.95);
    const p = skipPolicy('en', ['fr']);
    await detectSaysSkip('Une phrase en français assez longue ici', p, win);
    await tick();
    expect(await detectSaysSkip('Une phrase en français assez longue ici', p, win)).toBe(true);
  });

  it('re-probes availability after the TTL (model downloaded later on the options page)', async () => {
    // Models the cross-realm flow: the content side probes once while the model
    // is absent (cached null), the user downloads it on the options page, and the
    // content side picks it up on its next re-probe — no page reload.
    const realNow = Date.now;
    let clock = 1_000_000;
    Date.now = () => clock;
    try {
      let avail = 'downloadable';
      (globalThis as unknown as { LanguageDetector: unknown }).LanguageDetector = {
        availability: async () => avail,
        create: async () => ({ detect: async () => [{ detectedLanguage: 'en', confidence: 0.99 }] }),
      };
      const p = skipPolicy('en', []);
      const text = 'A reasonably long English sentence here';

      await detectSaysSkip(text, p, win); // first probe — model absent
      await tick();
      expect(await detectSaysSkip(text, p, win)).toBe(false);

      avail = 'available'; // user downloads the model on the options page
      clock += 1_000; // still within the TTL → no re-probe yet
      expect(await detectSaysSkip(text, p, win)).toBe(false);

      clock += 60_000; // TTL elapsed → next call re-probes and creates the detector
      await detectSaysSkip(text, p, win);
      await tick();
      expect(await detectSaysSkip(text, p, win)).toBe(true);
    } finally {
      Date.now = realNow;
    }
  });
});
