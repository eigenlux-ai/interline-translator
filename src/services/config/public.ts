/**
 * @module services/config/public
 *
 * The CONTENT-SAFE projection of the persisted config. Content scripts run in
 * every page; they need translate/input/site/appearance settings but must
 * never hold the providers array (API keys) in page-adjacent memory. The
 * background mirrors the full config into this projection on every change
 * (see ./gateway); content reads and watches ONLY the projection, and writes
 * go through the ConfigService RPC — full-config access stays in trusted
 * surfaces (background, popup, options).
 *
 * Import-safe everywhere: type-only imports + WXT storage. No zod (that alone
 * keeps the schema machinery out of the content bundle).
 */

import { createProxyService, type ProxyServiceKey } from '@webext-core/proxy-service';
import { storage } from '#imports';
import { PROJECT_PREFIX } from '@/constants';
import type { Config } from '@/data/models';

export interface PublicConfig {
  translate: Config['translate'];
  inputTranslation: Config['inputTranslation'];
  siteControl: Config['siteControl'];
  appearance: Config['appearance'];
  /** Interface-language override — READ-ONLY here (set in options only);
   *  content resolves it via `resolveUiLang(uiLanguage, translate.target)`. */
  uiLanguage: Config['language']['ui'];
  /** Display label of the default engine — derived, so content never sees providers. */
  defaultProviderLabel: string;
  /** Kind of the default engine — content surfaces gate LLM-only affordances
   *  (注疏) on it without ever touching the providers array. */
  defaultProviderKind: Config['providers'][number]['kind'] | '';
}

export const PUBLIC_CONFIG_KEY = `local:${PROJECT_PREFIX}:config-public` as const;

/** Project a full config down to what content scripts may hold. */
export function toPublicConfig(config: Config): PublicConfig {
  // Mirror preflight.resolveProvider's selection (skip disabled/draft, fall
  // back to the first enabled non-draft) — a bare id lookup made the 注疏
  // affordance follow a provider that the runtime would never use (e.g. a
  // DISABLED LLM default → button shown, every click fails). Inlined rather
  // than imported: public.ts is content-bundle territory and must not grow
  // dependencies; a test pins the two against each other.
  const wanted = config.translate.defaultProviderId;
  const def =
    (wanted ? config.providers.find((p) => p.id === wanted && p.enabled && !p.draft) : undefined) ??
    config.providers.find((p) => p.enabled && !p.draft);
  return {
    translate: config.translate,
    inputTranslation: config.inputTranslation,
    siteControl: config.siteControl,
    appearance: config.appearance,
    uiLanguage: config.language.ui,
    defaultProviderLabel: def?.label ?? def?.id ?? '',
    defaultProviderKind: def?.kind ?? '',
  };
}

/**
 * Hand-written projection of the DEFAULT config — public.ts must stay zod-free
 * (importing schema.ts would drag zod into every content bundle), so this
 * mirrors `toPublicConfig(defaultConfig())` by hand. A test pins the two
 * against each other so they cannot drift.
 */
export function defaultPublicConfig(): PublicConfig {
  return {
    translate: { defaultProviderId: 'google-free', source: 'auto', target: 'zh-CN', skipLanguages: [] },
    inputTranslation: { enabled: true, triggerCount: 3, target: 'en' },
    siteControl: { defaultMode: 'auto', rules: [] },
    appearance: { colorScheme: 'auto', bilingualStyle: 'blend', translationFont: 'kai', displayMode: 'bilingual', paragraphInterleave: true },
    uiLanguage: 'auto',
    defaultProviderLabel: 'Google Translate (free)',
    defaultProviderKind: 'google-mt',
  };
}

const publicConfigStorage = storage.defineItem<PublicConfig | null>(PUBLIC_CONFIG_KEY, { fallback: null });

/**
 * Read the projection. Before the background's first mirror write the stored
 * value is null — fall back to defaults (a fresh install IS defaults; any
 * older persisted config gets mirrored the moment the background wakes).
 */
export async function getPublicConfig(): Promise<PublicConfig> {
  return (await publicConfigStorage.getValue()) ?? defaultPublicConfig();
}

/** Subscribe to projection changes. Returns an unwatch fn. */
export function watchPublicConfig(cb: (config: PublicConfig) => void): () => void {
  return publicConfigStorage.watch((value) => {
    if (value) cb(value);
  });
}

/** The sections a content surface may write. Never providers/version/language. */
export type PublicConfigPatch = Partial<Pick<Config, 'translate' | 'inputTranslation' | 'siteControl' | 'appearance'>>;

export interface ConfigService {
  /** Merge a content-safe section patch into the persisted config (validated). */
  patch(patch: PublicConfigPatch): Promise<void>;
}

export const CONFIG_SERVICE_KEY = 'ConfigService' as ProxyServiceKey<ConfigService>;

/**
 * Call from any surface; `patch` proxies to the background gateway. Importing
 * this never pulls the full config machinery (zod) into the content bundle.
 */
export function getConfigService() {
  return createProxyService(CONFIG_SERVICE_KEY);
}
