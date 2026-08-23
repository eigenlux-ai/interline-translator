/**
 * @module data/models/lang
 *
 * Language code primitives. Pure types + small literal tables — zero runtime
 * weight, safe to import from any surface (content/UI/background).
 */

/** A language code (BCP-47-ish, e.g. 'en', 'zh-CN', 'ja'). */
export type LangCode = string;

/** UI locales the interface ships in (message bundles under `src/i18n`). */
export const UI_LANGS = ['zh', 'zh-TW', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru', 'pt', 'it', 'ar'] as const;
export type UiLang = (typeof UI_LANGS)[number];

/**
 * UI locales written right-to-left — the interface direction is a PROPERTY of
 * the locale, never a separate preference. Arabic is the only one shipped
 * today; the day a he/fa bundle lands it joins this table and the whole
 * interface follows.
 */
export const RTL_UI_LANGS: Partial<Record<UiLang, true>> = { ar: true };

/**
 * The interface-language setting (`config.language.ui`): `auto` follows
 * `translate.target` — the product knows the language its user reads — or a
 * pinned locale for e.g. the learner who reads English pages but wants a
 * Chinese UI.
 */
export type UiLangSetting = UiLang | 'auto';

/** Sentinel meaning "let the engine detect the source language". */
export const AUTO = 'auto' as const;

/** Source language: a concrete code, or `AUTO` for autodetection. */
export type SourceLang = LangCode | typeof AUTO;

/**
 * Curated default target options surfaced in the UI. Not exhaustive — any
 * LangCode is accepted by the engine; this only seeds the pickers.
 */
export const COMMON_LANGS = [
  'en',
  'zh-CN',
  'zh-TW',
  'ja',
  'ko',
  'fr',
  'de',
  'es',
  'ru',
  'pt',
  'it',
  'ar',
] as const satisfies readonly LangCode[];

/**
 * Readable names for the seeded language pickers (each in its own script —
 * the way OS language lists do it). Any code still works; unknown codes fall
 * back to the bare code in `langOptions`.
 */
export const LANG_LABELS: Record<string, string> = {
  en: 'English',
  'zh-CN': '中文 (简体)',
  'zh-TW': '中文 (繁體)',
  ja: '日本語',
  ko: '한국어',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  ru: 'Русский',
  pt: 'Português',
  it: 'Italiano',
  ar: 'العربية',
};

/** Picker options with readable labels (falls back to the bare code). */
export function langOptions(langs: readonly LangCode[] = COMMON_LANGS): Array<{ value: string; label: string }> {
  return langs.map((c) => ({ value: c, label: LANG_LABELS[c] ?? c }));
}

/**
 * Source-language picker options: the auto-detect row (label localized by the
 * caller) over the seeded targets. One builder for every source picker, so the
 * `AUTO` sentinel and the list shape can't drift between surfaces.
 */
export function sourceOptions(autoLabel: string): Array<{ value: string; label: string }> {
  return [{ value: AUTO, label: autoLabel }, ...langOptions()];
}

/**
 * A representative character of each language's SCRIPT — what the floating
 * ball's disc shows as its "translate" mark. Keyed by base subtag; scripts
 * that share a letterform share an entry (Cyrillic → Я). Latin-script targets
 * fall through to 'A'.
 */
const SCRIPT_GLYPHS: Record<string, string> = {
  zh: '文',
  ja: 'あ',
  ko: '한',
  ru: 'Я',
  uk: 'Я',
  ar: 'ع',
  he: 'א',
  el: 'α',
  th: 'ก',
  hi: 'अ',
};

/**
 * The seal face's language DIRECTION pair: top-left = source, bottom-right =
 * target. `src: null` means "render the any-language mark" (the globe icon) —
 * used for source 'auto', and for degenerate pairs whose scripts share a
 * letterform (en → es would stamp "A / A"; the globe says strictly more).
 */
export function pairGlyphs(source: SourceLang, target: LangCode): { src: string | null; dst: string } {
  const dst = SCRIPT_GLYPHS[target.toLowerCase().split('-')[0]] ?? 'A';
  if (source === AUTO) return { src: null, dst };
  const src = SCRIPT_GLYPHS[source.toLowerCase().split('-')[0]] ?? 'A';
  return { src: src === dst ? null : src, dst };
}

/**
 * Each UI locale named in its OWN script — the way OS language lists do it.
 * DERIVED from `LANG_LABELS` (the UI locale `zh` keys onto the `zh-CN` label),
 * so a language is named in exactly one place and the UI-language picker can
 * never drift from the target picker.
 */
export const UI_LANG_NAMES: Record<UiLang, string> = Object.fromEntries(
  UI_LANGS.map((l) => [l, LANG_LABELS[l === 'zh' ? 'zh-CN' : l] ?? l])
) as Record<UiLang, string>;
