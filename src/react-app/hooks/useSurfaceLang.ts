/**
 * Keep the surface root's `lang` on the resolved UI locale.
 *
 * Screen readers pick pronunciation and the engine picks hyphenation/font
 * fallback from `lang`, and a surface's entrypoint HTML cannot declare it: the
 * locale is resolved from config at runtime and switches without a reload, so a
 * static `lang="en"` mispronounces a Chinese-default UI forever.
 *
 * Writes the same root as the `dir` attribute (MantineRegistry) — for a document
 * surface that root IS `<html>`, and for a shadow surface it is our own element,
 * never the host's.
 */

import { useEffect, useSyncExternalStore } from 'react';
import { useSurface } from '@/surface/context';
import { getUiLocale, subscribeUiLocale } from '@/i18n';

export function useSurfaceLang(): void {
  const env = useSurface();
  const uiLocale = useSyncExternalStore(subscribeUiLocale, getUiLocale);
  useEffect(() => {
    // `zh` means Simplified everywhere in this project (UI_LANG_NAMES resolves
    // it through the zh-CN label), so spell the region out rather than leave
    // voice and font selection to guess between Hans and Hant.
    env.rootElement.setAttribute('lang', uiLocale === 'zh' ? 'zh-CN' : uiLocale);
  }, [env.rootElement, uiLocale]);
}
