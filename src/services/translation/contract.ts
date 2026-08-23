/**
 * @module services/translation/contract
 *
 * The PUBLIC face of the translation engine. This file is import-safe from
 * ANY surface (content/UI/background): it pulls only `import type` + the tiny
 * proxy-service runtime, never ai-sdk/dexie/providers. dom/** and react-app/**
 * must import THIS, never `impl.ts` (enforced by the eslint import boundary +
 * the content-bundle size assertion).
 *
 * Streaming is intentionally absent here — proxy-service is promise-only.
 * Token streaming runs over the named Port in `services/stream`.
 */

import { createProxyService, type ProxyServiceKey } from '@webext-core/proxy-service';
import type { LangCode, ProviderConfig, TranslateRequest, TranslateResult } from '@/data/models';

/** Outcome of a provider "Validate" check (real key/model/endpoint round-trip). */
export interface ProviderValidation {
  ok: boolean;
  /** Failure reason (network / auth / unknown model), surfaced in the UI. */
  error?: string;
  /** A short snippet of the model's reply on success (proof of life). */
  sample?: string;
}

export interface TranslationService {
  /** Translate one string. LLM primary, MT fallback (unless `mode` forces one). */
  translate(req: TranslateRequest): Promise<TranslateResult>;
  // NOTE: whole-page batch translation is NOT here — it streams progressively
  // over the Port (services/stream/batch-{server,client}), which proxy-service
  // (promise-only) can't express. Both LLM and MT page batches flow through that.
  /** Best-effort source language detection. */
  detectLang(text: string): Promise<LangCode>;
  /**
   * 通读全文: one compact page overview for translation context. Returns ''
   * when the default engine can't reason (MT) or the call fails — callers
   * treat '' as "no overview", never as an error.
   */
  summarizePage(pageText: string, target: LangCode): Promise<string>;
  /** Smoke-test a provider's key/model/endpoint with one tiny completion. */
  validateProvider(provider: ProviderConfig): Promise<ProviderValidation>;
}

/** Binds the service type to its key so both ends stay in sync. */
export const TRANSLATION_SERVICE_KEY = 'TranslationService' as ProxyServiceKey<TranslationService>;

/**
 * Call from any surface; methods proxy to the background implementation.
 * Importing this does NOT pull `impl.ts` — only the type + the key string.
 */
export function getTranslationService() {
  return createProxyService(TRANSLATION_SERVICE_KEY);
}
