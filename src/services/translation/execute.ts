/**
 * @module services/translation/execute
 *
 * The single non-streaming translation entry point. Preflight (provider /
 * languages / mode / key) comes from `./preflight`, the cache key + prompt
 * from `cache/cache-key` — both shared with the streaming paths so the three
 * pipelines cannot drift. Dispatch: `google-mt` → free MT fetch; any LLM kind
 * → ai-sdk generateText. BACKGROUND-ONLY (imports ai-sdk + provider factories).
 *
 * Dependencies (model factory, MT fetcher, generate fn, cache) are injectable
 * so the dispatch logic is unit-testable with a stub generate + in-memory
 * cache — no real keys, no network, no IndexedDB.
 */

import { generateText, type LanguageModel } from 'ai';
import type { Config, ProviderConfig, TranslateRequest, TranslateResult } from '@/data/models';
import { computeCacheKey, singleTranslationKey } from './cache/cache-key';
import type { TranslationCache } from './cache/db';
import type { BuiltPrompt } from './prompts';
import { shortStopError } from '@/services/stream/limiter';
import { llmCallOptions, requireApiKey, resolveCallEnv, resolveProvider } from './preflight';
import { createLlmModel } from './provider/llm';
import { googleFreeTranslate } from './provider/mt';
import { stripThink } from './reasoning';

export { resolveProvider };

/**
 * Hard ceiling on one non-streaming LLM call. Without it a wedged endpoint
 * (connection accepted, response never sent) holds a RequestQueue slot forever
 * — six of those starve every proxy-path translation until the SW dies, and
 * the panel's keep-alive makes sure it doesn't. Generous: a single segment
 * completes in seconds; only a hang ever gets near this.
 */
const EXECUTE_TIMEOUT_MS = 90_000;

export interface ExecuteDeps {
  /** Resolve an ai-sdk model for an LLM provider + key. Default: createLlmModel. */
  resolveModel?: (provider: ProviderConfig, apiKey: string) => Promise<LanguageModel> | LanguageModel;
  /** Free MT fetcher. Default: googleFreeTranslate. */
  mtFetch?: typeof googleFreeTranslate;
  /** generateText override (for tests). Default: ai-sdk generateText. */
  generate?: typeof generateText;
  /** Translation cache. When omitted, caching is skipped entirely. */
  cache?: TranslationCache;
  /** Caller's cancellation (batch fallback passes its batch signal). Reaches
   *  the LLM call only — the MT fetch is bounded by its own 10s timeout, and
   *  batch callers pre-check the signal per item. */
  signal?: AbortSignal;
}

export async function executeTranslate(
  req: TranslateRequest,
  config: Config,
  deps: ExecuteDeps = {}
): Promise<TranslateResult> {
  const text = req.text.trim();
  if (!text) return { text: '', providerId: req.providerId ?? 'noop' };

  const { provider, target, source, useMt } = resolveCallEnv(config, req);

  // Build the LLM prompt + cache key up front (shared derivation with the
  // streaming/batch paths — see singleTranslationKey). MT uses no prompt but
  // still caches, keyed on empty prompts (its output depends on text+pair only).
  let cacheKey: string | undefined;
  let built: BuiltPrompt = { system: '', prompt: '' };
  if (useMt) {
    cacheKey = await computeCacheKey({ preparedText: text, provider, source, target, systemPrompt: '', userPrompt: '' });
  } else {
    ({ key: cacheKey, built } = await singleTranslationKey(text, provider, source, target, config, req.context));
  }

  if (deps.cache && cacheKey) {
    // Cache read is best-effort: storage issues degrade to cache-miss rather than failure.
    // An empty hit is also treated as a miss — empty strings are never served as valid translations.
    const hit = await deps.cache.get(cacheKey).catch(() => undefined);
    if (hit) return { text: hit, providerId: provider.id, fromCache: true };
  }

  // Translate.
  let result: TranslateResult;
  if (useMt) {
    const mt = deps.mtFetch ?? googleFreeTranslate;
    const out = await mt(text, source, target);
    result = { text: out.text, detectedSource: out.detectedSource, providerId: provider.id };
  } else {
    const apiKey = requireApiKey(provider);
    const resolveModel = deps.resolveModel ?? createLlmModel;
    const generate = deps.generate ?? generateText;
    const model = await resolveModel(provider, apiKey);
    const timeout = AbortSignal.timeout(EXECUTE_TIMEOUT_MS);
    const gen = await generate({
      model,
      system: built.system,
      prompt: built.prompt,
      abortSignal: deps.signal ? AbortSignal.any([deps.signal, timeout]) : timeout,
      ...llmCallOptions(provider),
    });
    // A capped or content-filtered completion is a HALF translation. Returning
    // it would render a broken sentence and (below) cache it for 30 days —
    // the streaming paths reject the same finishReason for the same reason.
    const shortStop = shortStopError(gen.finishReason);
    if (shortStop) throw shortStop;
    result = { text: stripThink(gen.text).trim(), providerId: provider.id };
  }

  // Store (best-effort; a cache write must never fail the translation).
  if (deps.cache && cacheKey && result.text) {
    await deps.cache.set(cacheKey, result.text, result.detectedSource).catch(() => {});
  }
  return result;
}
