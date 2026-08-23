/**
 * @module services/translation/provider/llm
 *
 * Lazy LLM model factory. Each provider family's ai-sdk package is loaded with
 * a DYNAMIC import, so only the providers a user actually configures get pulled
 * into the running background bundle (and tree-shaking keeps the rest out of
 * the eager graph). BACKGROUND-ONLY — imports ai-sdk.
 *
 * Returns an ai-sdk `LanguageModel` ready to hand to generateText/streamText.
 * Multi-key rotation is handled by the caller (it picks which key to pass).
 */

import type { LanguageModel } from 'ai';
import type { LlmProviderKind, ProviderConfig } from '@/data/models';

/** Build a LanguageModel for a configured LLM provider + a chosen API key. */
export async function createLlmModel(provider: ProviderConfig, apiKey: string): Promise<LanguageModel> {
  const kind = provider.kind as LlmProviderKind;
  // Extra headers (corporate proxy / gateway auth) merged into every request.
  const headers = provider.extraHeaders;
  switch (kind) {
    case 'openai': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      return createOpenAI({ apiKey, baseURL: provider.baseURL, headers })(provider.model);
    }
    // anthropic-compatible shares the case: same wire format, just a custom
    // baseURL (Kimi / GLM / local proxy) — there is no separate ai-sdk package.
    case 'anthropic':
    case 'anthropic-compatible': {
      const { createAnthropic } = await import('@ai-sdk/anthropic');
      // The extension runs in a browser context, so the Anthropic API's CORS
      // guard rejects direct calls unless we opt into browser access. The user's
      // own key lives in extension storage (not exposed to third-party pages),
      // so this is the accepted posture — same header the models.ts probe sets.
      // Compatible vendors ignore the header; a gateway fronting the real API
      // still needs it. extraHeaders spreads last so a gateway can override it.
      const anthropicHeaders = { 'anthropic-dangerous-direct-browser-access': 'true', ...headers };
      return createAnthropic({ apiKey, baseURL: provider.baseURL, headers: anthropicHeaders })(provider.model);
    }
    case 'google': {
      const { createGoogleGenerativeAI } = await import('@ai-sdk/google');
      return createGoogleGenerativeAI({ apiKey, baseURL: provider.baseURL, headers })(provider.model);
    }
    case 'openrouter': {
      const { createOpenRouter } = await import('@openrouter/ai-sdk-provider');
      return createOpenRouter({ apiKey, baseURL: provider.baseURL, headers })(provider.model);
    }
    case 'openai-compatible': {
      const { createOpenAICompatible } = await import('@ai-sdk/openai-compatible');
      // baseURL is required for compatible endpoints (Ollama/custom).
      const baseURL = provider.baseURL ?? 'http://localhost:11434/v1';
      return createOpenAICompatible({ name: provider.label ?? provider.id, apiKey, baseURL, headers })(provider.model);
    }
    default: {
      // Exhaustiveness guard: a new LlmProviderKind must be handled here.
      const _exhaustive: never = kind;
      throw new Error(`[provider] unsupported LLM kind: ${String(_exhaustive)}`);
    }
  }
}
