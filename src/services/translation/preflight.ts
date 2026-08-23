/**
 * @module services/translation/preflight
 *
 * Resolves a translation request against configuration into a concrete execution
 * environment (provider, target, source, mode, API key, model options). Shared
 * across single-shot, streaming, and batch translation execution paths.
 *
 * Pure logic over Config with no DOM dependencies.
 */

import {
  providerRunNeedsKey,
  type Config,
  type LangCode,
  type ProviderConfig,
  type ProviderKind,
  type SourceLang,
  type TranslateMode,
} from '@/data/models';
import {
  inferModelCapabilities,
  isAnthropicThinkingModel,
  isGoogleThinkingModel,
} from './model-capabilities';

/** The request fields preflight needs (a structural subset of TranslateRequest). */
export interface CallMeta {
  providerId?: string;
  /** Empty string falls back to the configured target (`||` on purpose). */
  target?: LangCode | '';
  source?: SourceLang;
  mode?: TranslateMode;
}

export interface CallEnv {
  provider: ProviderConfig;
  target: LangCode;
  source: SourceLang;
  /** True when this call must go through classic MT (provider kind or forced mode). */
  useMt: boolean;
}

/** Pick the provider for a request: explicit id → default → first enabled. */
export function resolveProvider(config: Config, providerId?: string): ProviderConfig {
  const wanted = providerId ?? config.translate.defaultProviderId;
  // Draft engines are unvalidated and disabled engines are switched OFF by the
  // user — never use either, even as the named/default id; fall through to the
  // first enabled non-draft (the free MT is never a draft, so a usable engine
  // always exists).
  const byId = wanted ? config.providers.find((p) => p.id === wanted && p.enabled && !p.draft) : undefined;
  const provider = byId ?? config.providers.find((p) => p.enabled && !p.draft);
  if (!provider) {
    throw new Error('[translation] no provider configured — add an API key or enable the free MT fallback.');
  }
  return provider;
}

/** Resolve provider + language pair + mode for one call. */
export function resolveCallEnv(config: Config, meta: CallMeta): CallEnv {
  const provider = resolveProvider(config, meta.providerId);
  return {
    provider,
    target: meta.target || config.translate.target,
    source: meta.source ?? config.translate.source,
    useMt: provider.kind === 'google-mt' || meta.mode === 'mt',
  };
}

/**
 * First configured API key, or the ONE canonical missing-key error. Kinds that
 * can run keyless (*-compatible pointing at a local endpoint) get '' instead of
 * the error — the same exemption validateProvider applies, so an engine that
 * passed Validate keyless never throws here at translate time.
 */
export function requireApiKey(provider: ProviderConfig): string {
  const apiKey = provider.apiKeys[0];
  if (!apiKey) {
    if (!providerRunNeedsKey(provider.kind)) return '';
    throw new Error(`[translation] provider "${provider.id}" has no API key configured.`);
  }
  return apiKey;
}

/**
 * Everything the user configured on the ENGINE (as opposed to the request)
 * that ai-sdk takes as call settings: the provider-namespaced `providerOptions`
 * plus the cross-provider sampling knobs.
 */
export interface LlmCallOptions {
  providerOptions?: never;
  temperature?: number;
  maxOutputTokens?: number;
}

/**
 * Anthropic wants an explicit budget when thinking is enabled, and the API also
 * demands max_tokens > budget_tokens — 1024 is its documented minimum, which
 * keeps the most headroom under a user-set output cap.
 */
const ANTHROPIC_THINKING_BUDGET = 1024;

/**
 * Extended thinking has NO cross-provider spelling — every vendor invented its
 * own parameter — so one boolean has to fan out into six shapes. This table is
 * the entire translation; it runs only when the user made an explicit choice,
 * so an untouched engine still sends no thinking directive at all.
 *
 * A model that doesn't take its family's parameter answers with a 4xx. That is
 * why validateProvider sends these too: the failure lands on the Validate
 * button the user just pressed, not on every later translation.
 *
 * "Off" is a true off for OpenAI (the whole gpt-5 line takes effort 'none' now
 * that the o-series is retired), Anthropic and OpenRouter. Gemini is the one
 * exception — it has no off at any level — so there it means "think least".
 */
function reasoningProviderOptions(kind: ProviderKind, model: string, on: boolean): Record<string, unknown> {
  const caps = inferModelCapabilities(kind as never, model);

  switch (kind) {
    case 'openai':
      if (caps.fixedTemperature) {
        return { openai: { reasoningEffort: on ? 'medium' : 'low' } };
      }
      return { openai: { reasoningEffort: on ? 'medium' : 'none' } };

    case 'openai-compatible':
      if (caps.reasoning === 'mandatory') {
        return {};
      }
      return { openaiCompatible: { reasoningEffort: on ? 'medium' : 'none' } };

    case 'anthropic':
    case 'anthropic-compatible':
      if (caps.requiresThinkingBudget || isAnthropicThinkingModel(model)) {
        return {
          anthropic: {
            thinking: on ? { type: 'enabled', budgetTokens: ANTHROPIC_THINKING_BUDGET } : { type: 'disabled' },
          },
        };
      }
      return on
        ? { anthropic: { thinking: { type: 'enabled', budgetTokens: ANTHROPIC_THINKING_BUDGET } } }
        : {};

    case 'google':
      return { google: { thinkingConfig: { thinkingLevel: on ? 'high' : 'low' } } };

    case 'openrouter':
      // Gemini and mandatory reasoning models on OpenRouter don't accept { enabled: false }.
      // "Off" maps to { effort: 'low' } (minimal thinking), and "On" maps to { effort: 'high' }.
      if (isGoogleThinkingModel(model) || caps.reasoning === 'mandatory') {
        return { openrouter: { reasoning: { effort: on ? 'high' : 'low' } } };
      }
      if (isAnthropicThinkingModel(model)) {
        return { openrouter: { reasoning: { max_tokens: on ? 1024 : 0 } } };
      }
      return { openrouter: { reasoning: { effort: on ? 'medium' : 'none' } } };
    case 'google-mt':
      return {};
  }
}

/**
 * The spreadable engine-settings passthrough for ai-sdk calls —
 * `{...llmCallOptions(provider)}` with automatic model capability sanitization.
 */
export function llmCallOptions(provider: ProviderConfig): LlmCallOptions {
  const { temperature, maxOutputTokens, reasoning } = provider.params ?? {};
  const modelName = provider.model ?? '';
  const caps = inferModelCapabilities(provider.kind, modelName);
  const derived = reasoning === undefined ? {} : reasoningProviderOptions(provider.kind, modelName, reasoning);
  const raw = provider.providerOptions ?? {};

  const providerOptions: Record<string, unknown> = {};
  for (const ns of new Set([...Object.keys(derived), ...Object.keys(raw)])) {
    const d = derived[ns];
    const r = raw[ns];
    const dIsObj = typeof d === 'object' && d !== null && !Array.isArray(d);
    const rIsObj = typeof r === 'object' && r !== null && !Array.isArray(r);
    providerOptions[ns] = dIsObj && rIsObj ? { ...(d as object), ...(r as object) } : (r ?? d);
  }

  // Sanitize temperature: models with fixed temperature (o1/o3) reject custom temperature
  let safeTemperature = temperature;
  if (caps.fixedTemperature) {
    safeTemperature = undefined;
  } else if (
    (provider.kind === 'anthropic' || provider.kind === 'anthropic-compatible') &&
    reasoning === true &&
    safeTemperature !== undefined
  ) {
    // Anthropic requires temperature 1.0 when thinking is enabled
    safeTemperature = undefined;
  }

  // Ensure maxOutputTokens > budgetTokens for Anthropic thinking
  let safeMaxTokens = maxOutputTokens;
  if (
    (provider.kind === 'anthropic' || provider.kind === 'anthropic-compatible') &&
    reasoning === true &&
    safeMaxTokens !== undefined &&
    safeMaxTokens <= ANTHROPIC_THINKING_BUDGET
  ) {
    safeMaxTokens = ANTHROPIC_THINKING_BUDGET + 1024;
  }

  return {
    ...(Object.keys(providerOptions).length ? { providerOptions: providerOptions as never } : {}),
    ...(safeTemperature === undefined ? {} : { temperature: safeTemperature }),
    ...(safeMaxTokens === undefined ? {} : { maxOutputTokens: safeMaxTokens }),
  };
}
