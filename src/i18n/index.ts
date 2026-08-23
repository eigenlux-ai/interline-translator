/**
 * @module i18n
 *
 * Interface language. Most extensions localize to the BROWSER language; this
 * one knows something better — the language its user actually reads, i.e.
 * `translate.target`. So the UI follows the target by default, with a manual
 * pin in options (`config.language.ui`).
 *
 * That requires switching locale at runtime, which `browser.i18n` (and
 * `@wxt-dev/i18n`, a typed wrapper over it) cannot do — the locale is resolved
 * by the browser from its own UI language, full stop (see
 * https://wxt.dev/guide/essentials/i18n.html, which names this as the reason
 * to go custom). So UI strings are compiled by Paraglide-JS from
 * `messages/{locale}.json` into typed, per-message, tree-shaken functions
 * (`import { m } from '@/paraglide/messages.js'`) — a missing translation is a
 * compile error, and a bundle only carries the messages it imports. Re-run
 * `pnpm i18n` after editing the JSON; the output is committed. This module is
 * the RESOLUTION side: it decides the locale and pushes it into Paraglide's
 * runtime. `public/_locales/` still exists for the one thing only browser.i18n
 * can localize: the manifest description.
 *
 * Usage (any React app root, BEFORE the first `m.*()` evaluates — i.e. at the
 * top of the component body, not in a wrapper component, since JSX child
 * expressions run during the PARENT's render):
 *
 *   syncUiLocale(config.uiLanguage, config.translate.target);
 */

import { UI_LANGS, type LangCode, type UiLang, type UiLangSetting } from '@/data/models/lang';
import { overwriteGetLocale } from '@/paraglide/runtime.js';

/**
 * The current UI locale, driven by config — never by cookie/url/browser
 * detection (the compile pins `strategy: [globalVariable]`, and this overwrite
 * replaces even that). One value per document is correct: every surface in a
 * page derives it from the same config.
 */
let current: UiLang = 'zh';
overwriteGetLocale(() => current);

const listeners = new Set<() => void>();

/**
 * Resolve the effective UI locale AND push it into the Paraglide runtime so
 * subsequent `m.*()` calls speak it. Idempotent; call on every render — a
 * config change re-renders the root, which re-syncs before children evaluate.
 */
export function syncUiLocale(setting: UiLangSetting | string, target: LangCode): UiLang {
  const next = resolveUiLang(setting, target);
  if (next === current) return current;
  current = next;
  // Surfaces call syncUiLocale from a root's RENDER body, while the listener
  // (the Mantine direction provider) sits ABOVE it — notifying synchronously
  // would schedule an update on an already-rendered ancestor mid-render, which
  // React reports as an error. A microtask lands it right after the commit;
  // a listener MOUNTING in that same commit needs no notification at all,
  // since useSyncExternalStore re-reads the snapshot when it commits.
  queueMicrotask(() => listeners.forEach((listener) => listener()));
  return current;
}

/** The locale `m.*()` currently speaks — the snapshot half of the store. */
export function getUiLocale(): UiLang {
  return current;
}

/**
 * Watch the resolved UI locale (`useSyncExternalStore`-shaped). For the parts
 * of the UI that must follow the locale but live ABOVE the surface root that
 * resolves it — today: text direction, which is a property of the locale.
 */
export function subscribeUiLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** What the UI speaks before any config has loaded — the product default target. */
const PRE_CONFIG_TARGET: LangCode = 'zh-CN';

/** Either config shape carries the interface-language pair: the content-safe
 *  projection (`uiLanguage`) or the full config (`language.ui`). */
type UiLocaleSource =
  | { uiLanguage: UiLangSetting; translate: { target: LangCode } }
  | { language: { ui: UiLangSetting }; translate: { target: LangCode } };

/**
 * `syncUiLocale` fed straight from a (possibly not-yet-loaded) config — THE
 * one place that knows the pre-config fallback and which field each config
 * shape carries. Every surface calls this instead of hand-copying `?? 'auto'`
 * / `?? 'zh-CN'` defaults.
 */
export function syncUiLocaleFrom(config: UiLocaleSource | null | undefined): UiLang {
  if (!config) return syncUiLocale('auto', PRE_CONFIG_TARGET);
  return syncUiLocale('uiLanguage' in config ? config.uiLanguage : config.language.ui, config.translate.target);
}

/**
 * Resolve the effective UI locale (PURE — pushes nothing into the runtime).
 * Production surfaces call `syncUiLocaleFrom`; this primitive is exported for
 * tests and for any future consumer that needs the answer without switching
 * what `m.*()` speaks. A pinned setting wins; `auto` (or any unrecognized
 * value) derives from the translate target — matching UI languages apply directly,
 * falling back to English otherwise.
 */
export function resolveUiLang(setting: UiLangSetting | string, target: LangCode): UiLang {
  return asUiLang(setting) ?? asUiLang(target) ?? 'en';
}

/**
 * Map a language-ish code onto a shipped UI locale (null = no match). Chinese
 * splits by script — Traditional variants (zh-TW/zh-HK/zh-MO/zh-Hant*) read the
 * Traditional UI, every other zh* reads Simplified. Everything else matches on
 * its base subtag, so regional codes fold onto the shipped locale (pt-BR → pt,
 * en-GB → en).
 */
function asUiLang(code: string): UiLang | null {
  const c = code.toLowerCase();
  if (/^zh(-|$)/.test(c)) return /^zh-(tw|hk|mo|hant)/.test(c) ? 'zh-TW' : 'zh';
  const base = c.split('-')[0];
  return (UI_LANGS as readonly string[]).includes(base) ? (base as UiLang) : null;
}
