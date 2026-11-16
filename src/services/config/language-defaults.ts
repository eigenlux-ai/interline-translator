import { browser } from '#imports';
import { COMMON_LANGS, langOptions, normalizeLanguageCode, type LangCode } from '@/data/models/lang';

/** Normalize the browser UI locale for translation engines and language pickers. */
export function browserTranslationTarget(locale: string): LangCode {
  return normalizeLanguageCode(locale) ?? 'en';
}

/** Extension API works in content scripts and service workers without a DOM. */
export function getBrowserTranslationTarget(): LangCode {
  try {
    return browserTranslationTarget(browser.i18n.getUILanguage());
  } catch {
    return 'en';
  }
}

export function defaultInputTranslation(target: LangCode) {
  return { enabled: !/^en(?:-|$)/i.test(target), triggerCount: 3, target: 'en' };
}

/** Keep the browser language selectable even after choosing a different target. */
export function translationLanguageOptions(...selected: LangCode[]) {
  return langOptions([...new Set([...COMMON_LANGS, getBrowserTranslationTarget(), ...selected])]);
}
