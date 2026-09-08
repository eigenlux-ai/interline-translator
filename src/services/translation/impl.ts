/**
 * @module services/translation/impl
 *
 * BACKGROUND-ONLY implementation of the translation engine. This file (and its
 * transitive deps — providers/queue/cache/prompts, ai-sdk, dexie) must be
 * imported ONLY from `entrypoints/background.ts` via `registerTranslationService()`.
 * Importing it from content/UI would drag ai-sdk into that bundle and break the
 * size red line — the eslint `import/no-restricted-paths` rule forbids it.
 *
 * Every PROXY-path call (popup panel, input translation) funnels through one
 * shared RequestQueue: concurrency cap, in-flight dedup, retry with backoff.
 * The STREAMING paths (划词 / whole-page batch) deliberately do not — they need
 * incremental output, and their upstream pressure is bounded by the stream
 * limiter + watchdog instead (services/stream/limiter).
 */

import { registerService } from '@webext-core/proxy-service';
import { generateText } from 'ai';
import {
  providerRunNeedsKey,
  type Config,
  type LangCode,
  type ProviderConfig,
  type TranslateRequest,
  type TranslateResult,
} from '@/data/models';
import { getConfig } from '@/services/config/storage';
import { stableProviderFingerprint, stableStringify } from './cache/cache-key';
import { dexieCache } from './cache/db';
import { TRANSLATION_SERVICE_KEY, type ProviderValidation, type TranslationService } from './contract';
import { executeTranslate } from './execute';
import { llmCallOptions, requireApiKey, resolveProvider } from './preflight';
import { buildSummaryPrompt } from './prompts';
import { createLlmModel } from './provider/llm';
import { googleFreeTranslate } from './provider/mt';
import { RequestQueue } from './queue/request-queue';
import { stripThink } from './reasoning';

/** Shared across every request (page/selection/input) so the API is never blasted. */
const queue = new RequestQueue({ maxConcurrent: 6, maxRetries: 2, baseBackoffMs: 800 });

/**
 * Dedup/ordering key. Must cover every request field that changes the OUTPUT
 * (mirroring the persistent cache key), or two different requests share one
 * in-flight promise: an `mt`-mode and an LLM request for the same text would
 * hand the second caller the wrong engine's result. Provider is RESOLVED so
 * distinct ids that fall back to the same engine still dedup. `context` rides
 * in canonicalized: input translation sends `{ domain, title }`, and the domain
 * selects the per-site PromptStyle, so the same draft typed on two sites must
 * NOT collapse onto one job and inherit the other site's register.
 */
export function jobKey(config: Config, req: TranslateRequest): string {
  const provider = stableProviderFingerprint(resolveProvider(config, req.providerId));
  const target = req.target || config.translate.target;
  const source = req.source ?? config.translate.source;
  const context = stableStringify(req.context ?? {});
  return stableStringify([
    provider,
    source,
    req.mode ?? 'llm',
    target,
    context,
    config.prompt,
    config.glossary,
    req.text,
  ]);
}

class TranslationServiceImpl implements TranslationService {
  async translate(req: TranslateRequest): Promise<TranslateResult> {
    const config = await getConfig();
    return queue.enqueue(jobKey(config, req), () => executeTranslate(req, config, { cache: dexieCache }));
  }

  async detectLang(text: string): Promise<LangCode> {
    // Reuse the free MT endpoint's language detection (no key needed).
    const out = await googleFreeTranslate(text.slice(0, 200), 'auto', 'en');
    return out.detectedSource ?? 'und';
  }

  async summarizePage(pageText: string, target: LangCode): Promise<string> {
    try {
      const config = await getConfig();
      const provider = resolveProvider(config);
      if (provider.kind === 'google-mt') return ''; // MT can't reason — feature is inert
      const apiKey = requireApiKey(provider);
      const model = await createLlmModel(provider, apiKey);
      const { system, prompt } = buildSummaryPrompt(pageText.slice(0, 8000), target);
      // One-off per page and best-effort: a hung/failed summary must never
      // block or fail the translation flow it serves.
      const gen = await generateText({
        model,
        system,
        prompt,
        abortSignal: AbortSignal.timeout(30_000),
        ...llmCallOptions(provider),
      });
      return stripThink(gen.text).trim().slice(0, 800);
    } catch {
      return '';
    }
  }

  async validateProvider(provider: ProviderConfig): Promise<ProviderValidation> {
    if (provider.kind === 'google-mt') return { ok: true }; // keyless free MT — always usable
    const apiKey = provider.apiKeys[0];
    if (!apiKey && providerRunNeedsKey(provider.kind)) return { ok: false, error: '需要填入 API key' };
    if (!provider.model.trim()) return { ok: false, error: '需要设置模型' };
    try {
      const model = await createLlmModel(provider, apiKey ?? '');
      // One tiny completion proves the key + model + endpoint all resolve.
      // Hard timeout: a stalled endpoint left the settings' Validate button
      // spinning forever (nothing upstream ever aborted this call).
      // Engine settings ride along on purpose: the OpenAI reasoning line rejects
      // a temperature other than 1, so a knob the model refuses must fail HERE,
      // at the button the user just pressed — not later, on every translation.
      const gen = await generateText({
        model,
        prompt: 'Reply with the single word: ok',
        abortSignal: AbortSignal.timeout(15_000),
        ...llmCallOptions(provider),
      });
      return { ok: true, sample: gen.text.trim().slice(0, 40) };
    } catch (e) {
      if (e instanceof DOMException && e.name === 'TimeoutError') {
        return { ok: false, error: '验证超时(15 秒),端点无响应或不可达' };
      }
      return { ok: false, error: e instanceof Error ? e.message : String(e) };
    }
  }
}

/** Call exactly once from the background entrypoint. */
export function registerTranslationService() {
  return registerService(TRANSLATION_SERVICE_KEY, new TranslationServiceImpl());
}
