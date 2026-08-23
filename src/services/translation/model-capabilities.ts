/**
 * @module services/translation/model-capabilities
 *
 * Model capability matrix and parameter adaptation.
 *
 * Different vendors and models have divergent constraints for reasoning (thinking),
 * temperature, and token budgets:
 * - OpenRouter: Mandatory reasoning models (e.g. R1, Gemini thinking variants, o1/o3)
 *   reject `{ reasoning: { enabled: false } }` with HTTP 400.
 * - OpenAI: o1/o3/o4 reject custom temperature (require default 1) and reject
 *   `reasoningEffort: 'none'`.
 * - Anthropic: Claude 3.7+ supports `thinking`, but requires `max_tokens > budget_tokens`
 *   and forces `temperature: 1.0` when thinking is enabled. Claude 3.5 rejects thinking.
 * - Google Gemini: 2.0+/2.5/3.7 take `thinkingConfig.thinkingLevel`, but 1.5 rejects it.
 * - OpenAI-compatible gateways: Third-party proxies reject unknown vendor parameters.
 */

import type { ProviderKind } from '@/data/models';

export type ReasoningSupport =
  | 'mandatory' // Always reasons, cannot be disabled via API (e.g. DeepSeek-R1, o1, :thinking)
  | 'optional' // Native toggle supported (Claude 3.7+, Gemini 2.0+, GPT-5)
  | 'none'; // Traditional non-reasoning model (gpt-4o, claude-3-5-haiku, gemini-1.5)
export interface ModelCapabilities {
  reasoning: ReasoningSupport;
  fixedTemperature: boolean;
  requiresThinkingBudget: boolean;
}

/** Normalize model id by stripping provider prefix (e.g. 'openai/o3' -> 'o3') and tag suffixes (e.g. ':batch', ':free'). */
export function cleanModelName(model: string): string {
  const withoutPrefix = model.toLowerCase().trim().replace(/^[^/]+\//, '');
  return withoutPrefix.replace(/:(batch|free|nitro|customtools|image|preview)$/i, '');
}

/** Check if model name indicates inherent/mandatory reasoning. */
export function isMandatoryReasoningModel(model: string): boolean {
  const raw = model.toLowerCase().trim();
  const m = cleanModelName(model);
  return (
    raw.endsWith(':thinking') ||
    m.includes('reasoner') ||
    m.includes('thinking') ||
    m.includes('thought') ||
    m.includes('deepseek-r1') ||
    m.includes('deepseek/r1') ||
    m.includes('qwq') ||
    /(^|\/)o[1-9](-|\b|:)/i.test(raw)
  );
}

/** Check if model rejects custom temperature (e.g. OpenAI o1/o3/o4). */
export function isFixedTemperatureModel(model: string): boolean {
  const raw = model.toLowerCase().trim();
  return /(^|\/)o[1-9](-|\b|:)/i.test(raw);
}

/** Check if Anthropic model supports extended thinking (Claude 3.7+, 4.x, 5.x). */
export function isAnthropicThinkingModel(model: string): boolean {
  const m = cleanModelName(model);
  return (
    /claude-(3[-.][7-9]|[4-9])/i.test(m) ||
    /claude-(opus|sonnet|haiku|fable)-[4-9]/i.test(m)
  );
}

/** Check if Google model supports thinkingConfig (Gemini 2.0+, 2.5, 3.x). */
export function isGoogleThinkingModel(model: string): boolean {
  const m = cleanModelName(model);
  return (
    /gemini-(2\.[0-9]|[3-9](\.[0-9]+)?)/i.test(m) ||
    /gemini-[3-9](-|\b)/i.test(m)
  );
}
/** Infer model capabilities from provider kind and model string. */
export function inferModelCapabilities(kind: ProviderKind, model: string): ModelCapabilities {
  if (kind === 'google-mt') {
    return {
      reasoning: 'none',
      fixedTemperature: false,
      requiresThinkingBudget: false,
    };
  }

  const m = model.toLowerCase().trim();
  // Mandatory reasoning models
  if (isMandatoryReasoningModel(m)) {
    return {
      reasoning: 'mandatory',
      fixedTemperature: isFixedTemperatureModel(m),
      requiresThinkingBudget: isAnthropicThinkingModel(m),
    };
  }

  // Optional thinking models
  if (
    (kind === 'anthropic' || kind === 'anthropic-compatible') &&
    isAnthropicThinkingModel(m)
  ) {
    return {
      reasoning: 'optional',
      fixedTemperature: false,
      requiresThinkingBudget: true,
    };
  }

  if (kind === 'google' && isGoogleThinkingModel(m)) {
    return {
      reasoning: 'optional',
      fixedTemperature: false,
      requiresThinkingBudget: false,
    };
  }

  if (kind === 'openrouter' && (isAnthropicThinkingModel(m) || isGoogleThinkingModel(m))) {
    return {
      reasoning: 'optional',
      fixedTemperature: false,
      requiresThinkingBudget: false,
    };
  }

  return {
    reasoning: 'none',
    fixedTemperature: isFixedTemperatureModel(m),
    requiresThinkingBudget: false,
  };
}

/** Patterns matching known 400 parameter rejection errors from upstream APIs. */
export const PARAMETER_ERROR_PATTERNS = [
  /reasoning is mandatory/i,
  /temperature.*not support/i,
  /only.*default.*temperature.*supported/i,
  /temperature cannot be set when thinking/i,
  /extra inputs are not permitted.*thinking/i,
  /thinking.*not supported/i,
  /unsupported parameter/i,
];

/** Check if an error message is caused by incompatible model parameters. */
export function isParameterRejectionError(errorText: string): boolean {
  return PARAMETER_ERROR_PATTERNS.some((pattern) => pattern.test(errorText));
}
