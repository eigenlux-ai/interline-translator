import { describe, expect, it } from 'vitest';
import { UI_LANGS } from '@/data/models/lang';
import { m } from '@/paraglide/messages.js';
import { resolveUiLang, syncUiLocale } from './index';

describe('resolveUiLang', () => {
  it('auto follows the translate target', () => {
    expect(resolveUiLang('auto', 'zh-CN')).toBe('zh');
    expect(resolveUiLang('auto', 'en')).toBe('en');
    expect(resolveUiLang('auto', 'ja')).toBe('ja');
    expect(resolveUiLang('auto', 'ar')).toBe('ar');
  });

  it('Chinese splits by script: Traditional variants read the zh-TW UI', () => {
    expect(resolveUiLang('auto', 'zh-TW')).toBe('zh-TW');
    expect(resolveUiLang('auto', 'zh-HK')).toBe('zh-TW');
    expect(resolveUiLang('auto', 'zh-Hant')).toBe('zh-TW');
    expect(resolveUiLang('auto', 'zh-CN')).toBe('zh'); // Simplified and bare zh → zh
  });

  it('regional codes fold onto their base locale', () => {
    expect(resolveUiLang('auto', 'pt-BR')).toBe('pt');
    expect(resolveUiLang('auto', 'en-GB')).toBe('en');
    expect(resolveUiLang('auto', 'de-AT')).toBe('de');
  });

  it('auto falls back to English for targets with no shipped locale', () => {
    expect(resolveUiLang('auto', 'th')).toBe('en');
    expect(resolveUiLang('auto', 'nl')).toBe('en');
  });

  it('a pinned locale wins over the target', () => {
    expect(resolveUiLang('zh', 'en')).toBe('zh');
    expect(resolveUiLang('ja', 'en')).toBe('ja');
    expect(resolveUiLang('en', 'zh-CN')).toBe('en');
  });

  it('tolerates legacy/loose values: full codes pin, junk derives from target', () => {
    expect(resolveUiLang('zh-CN', 'en')).toBe('zh'); // full code pins its base locale
    expect(resolveUiLang('unknown', 'zh-CN')).toBe('zh'); // junk == auto
    // 'zhx' must not match zh — the base subtag ends at a hyphen or the string.
    expect(resolveUiLang('auto', 'zhx')).toBe('en');
  });
});

describe('paraglide bridge', () => {
  it('syncUiLocale drives what m.*() speaks', () => {
    syncUiLocale('auto', 'zh-CN');
    expect(m.ball_panel_title()).toBe('翻译此页');
    syncUiLocale('auto', 'ja'); // ja is a shipped locale now
    expect(m.ball_panel_title()).toBe('このページを翻訳');
    syncUiLocale('auto', 'th'); // no shipped locale → English
    expect(m.ball_panel_title()).toBe('Translate this page');
    syncUiLocale('zh', 'th'); // pin wins
    expect(m.ball_panel_title()).toBe('翻译此页');
  });

  it('a per-call locale override beats the synced locale', () => {
    syncUiLocale('zh', 'zh-CN');
    expect(m.ball_panel_title({}, { locale: 'en' })).toBe('Translate this page');
  });

  it('parameterized messages interpolate in every shipped locale', () => {
    for (const locale of UI_LANGS) {
      expect(m.style_aria({ label: 'X' }, { locale })).toContain('X');
    }
  });

  it('every shipped locale has a non-empty, distinct catalog (each is hand-authored)', () => {
    const titles = UI_LANGS.map((locale) => m.ball_panel_title({}, { locale }));
    for (const t of titles) expect(t.trim()).not.toBe('');
    // No two locales collapse to the same string → each is a real translation,
    // not a silent fallback to another catalog.
    expect(new Set(titles).size).toBe(UI_LANGS.length);
  });
});
