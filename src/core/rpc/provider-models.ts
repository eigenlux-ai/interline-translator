/**
 * @module core/rpc/provider-models
 *
 * Background proxy service that lists a provider's available models by calling
 * its `/models` endpoint with the user's API key. Runs in the service worker so
 * the cross-origin fetch uses the extension's `<all_urls>` host permission (a
 * settings-page fetch would be blocked by CORS). Read-only; never persists keys.
 *
 * Thin fetch only (no ai-sdk) — the rule for core/rpc: services here register
 * directly from the background entrypoint and never pull engine dependencies.
 */

import { createProxyService, registerService, type ProxyServiceKey } from '@webext-core/proxy-service';
import type { LlmProviderKind } from '@/data/models';
import { fetchJson } from '@/services/request';

export interface ListModelsInput {
  kind: LlmProviderKind;
  /** Override base URL (corporate proxy / Ollama). Falls back to the kind default. */
  baseURL?: string;
  /** First configured API key. Optional for keyless local endpoints (Ollama). */
  apiKey?: string;
  /** Extra headers (corporate proxy / gateway auth) — merged into the request. */
  extraHeaders?: Record<string, string>;
}

const stripTrailingSlash = (s: string) => s.replace(/\/+$/, '');

/** OpenAI-shaped `{ data: [{ id }] }` response. */
interface OpenAiModelsResponse {
  data?: Array<{ id?: string }>;
}
/** Google `{ models: [{ name, supportedGenerationMethods }] }` response. */
interface GoogleModelsResponse {
  models?: Array<{ name?: string; supportedGenerationMethods?: string[] }>;
}

const sortUnique = (ids: string[]) => Array.from(new Set(ids.filter(Boolean))).sort((a, b) => a.localeCompare(b));

export class ModelsService {
  async list(input: ListModelsInput): Promise<string[]> {
    const { kind, baseURL, apiKey, extraHeaders } = input;
    const key = apiKey?.trim() ?? '';

    if (kind === 'google') {
      // Gemini: key in the query string; no Bearer header.
      const base = stripTrailingSlash(baseURL || 'https://generativelanguage.googleapis.com/v1beta');
      const res = await fetchJson<GoogleModelsResponse>(
        `${base}/models?key=${encodeURIComponent(key)}&pageSize=1000`,
        { method: 'GET', headers: { ...extraHeaders } }
      );
      const ids = (res.models ?? [])
        .filter((m) => !m.supportedGenerationMethods || m.supportedGenerationMethods.includes('generateContent'))
        .map((m) => (m.name ?? '').replace(/^models\//, ''));
      return sortUnique(ids);
    }

    // OpenAI / OpenRouter / Anthropic / openai-compatible all expose `/models`
    // returning `{ data: [{ id }] }`. Only the base URL and auth headers differ.
    // `kind` is non-google here (google returned above); cast narrows the index.
    const base = stripTrailingSlash(baseURL || DEFAULT_BASE[kind as Exclude<LlmProviderKind, 'google'>]);
    const headers: Record<string, string> = { ...extraHeaders };
    if (kind === 'anthropic' || kind === 'anthropic-compatible') {
      if (key) headers['x-api-key'] = key;
      headers['anthropic-version'] = '2023-06-01';
      headers['anthropic-dangerous-direct-browser-access'] = 'true';
    } else if (key) {
      headers.Authorization = `Bearer ${key}`;
    }
    const res = await fetchJson<OpenAiModelsResponse>(`${base}/models`, { method: 'GET', headers });
    return sortUnique((res.data ?? []).map((m) => m.id ?? ''));
  }
}

/** Default `/models` base per kind (excluding google, handled above). */
const DEFAULT_BASE: Record<Exclude<LlmProviderKind, 'google'>, string> = {
  openai: 'https://api.openai.com/v1',
  anthropic: 'https://api.anthropic.com/v1',
  openrouter: 'https://openrouter.ai/api/v1',
  'openai-compatible': 'http://localhost:11434/v1',
  'anthropic-compatible': 'https://api.anthropic.com/v1',
};

const MODELS_SERVICE_KEY = 'ModelsService' as ProxyServiceKey<ModelsService>;

/** Call once from the background entrypoint. */
export function registerModelsService() {
  return registerService(MODELS_SERVICE_KEY, new ModelsService());
}

/** Call from any surface; methods proxy to the background. */
export function getModelsService() {
  return createProxyService(MODELS_SERVICE_KEY);
}
