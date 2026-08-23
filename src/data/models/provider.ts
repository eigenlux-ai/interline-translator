/**
 * @module data/models/provider
 *
 * Provider configuration shapes. A `ProviderConfig` describes ONE configured
 * engine instance the user added (an LLM provider with keys/model, or the
 * free MT fallback). The provider factory (`CREATE_AI_MAPPER`, background-only)
 * turns these into ai-sdk model instances lazily.
 */

/**
 * Engine families. LLM providers go through ai-sdk; `google-mt` is the
 * free no-key machine-translation fallback (thin fetch, not ai-sdk).
 */
export type ProviderKind =
  | 'openai'
  | 'anthropic'
  | 'google' // Gemini API key (NOT Vertex)
  | 'openrouter'
  | 'openai-compatible' // Ollama / custom baseURL
  | 'anthropic-compatible' // Kimi / GLM / local proxy — Anthropic wire format at a custom baseURL
  | 'google-mt'; // free MT fallback

/** True for kinds that run through ai-sdk (i.e. need an API key + model). */
export type LlmProviderKind = Exclude<ProviderKind, 'google-mt'>;

/**
 * The engine knobs the settings UI exposes.
 *
 * Every field is optional and UNSET BY DEFAULT: an omitted knob is never sent,
 * so the model's own default applies and nothing changes for users who don't
 * touch this. That matters beyond tidiness — the OpenAI reasoning line (o-series
 * / gpt-5) REJECTS a `temperature` other than 1, so sending a "harmless"
 * default would break those models outright.
 *
 * temperature/maxOutputTokens are ai-sdk call settings and pass through as-is.
 * `reasoning` is NOT: every vendor spells it differently, so preflight
 * translates the boolean into that kind's `providerOptions` shape.
 */
export interface ModelParams {
  /** 0 = most literal/deterministic, higher = freer. Provider range is 0–2. */
  temperature?: number;
  /** Hard cap on generated tokens. Too low TRUNCATES a page batch mid-flight. */
  maxOutputTokens?: number;
  /** Force extended thinking on or off. Undefined leaves the model's default. */
  reasoning?: boolean;
}

export interface ProviderConfig {
  /** Stable user-assigned id; referenced by TranslateRequest.providerId & cache key. */
  id: string;
  kind: ProviderKind;
  /** Human label shown in settings; defaults to a kind-derived name. */
  label?: string;
  /** One or more API keys; the engine rotates across them. Empty for `google-mt`. */
  apiKeys: string[];
  /** Override base URL (openai-compatible / corporate proxy). */
  baseURL?: string;
  /** Model id, e.g. 'gpt-4o-mini', 'claude-haiku-4-5', 'gemini-2.0-flash'. */
  model: string;
  /** Extra HTTP headers merged into every request (corporate proxy / gateway auth). */
  extraHeaders?: Record<string, string>;
  enabled: boolean;
  /**
   * A freshly added engine starts as a draft (not used for translation) until
   * "Validate" confirms its key/model/endpoint actually work. Cleared on success.
   */
  draft?: boolean;
  /** Passed through to ai-sdk `providerOptions` (e.g. reasoning toggles). */
  providerOptions?: Record<string, unknown>;
  /** Engine knobs set in settings (temperature / maxOutputTokens / reasoning). */
  params?: ModelParams;
}

/**
 * Does listing this kind's models (`/models`) require an API key?
 * OpenRouter's models endpoint is public; openai-compatible (Ollama/custom)
 * runs locally without auth. OpenAI / Anthropic / Google all require the key.
 */
export function providerModelsNeedKey(kind: ProviderKind): boolean {
  return kind === 'openai' || kind === 'anthropic' || kind === 'google';
}

/**
 * Does actually RUNNING this kind (a completion → translate / validate) require
 * an API key? Everything cloud does; the *-compatible kinds may point at a
 * keyless local endpoint (Ollama / claude-code-router), and the free MT is
 * keyless by design.
 */
export function providerRunNeedsKey(kind: ProviderKind): boolean {
  return kind !== 'openai-compatible' && kind !== 'anthropic-compatible' && kind !== 'google-mt';
}
