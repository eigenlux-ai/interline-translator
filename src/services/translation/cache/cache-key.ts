/**
 * @module services/translation/cache/cache-key
 *
 * Deterministic cache key for a translation. The key must be STABLE across
 * runs and across machines, and must NOT leak secrets:
 *
 *   - include only a whitelist of provider fields that actually change output
 *     (id/kind/model/baseURL + selected providerOptions);
 *   - NEVER include API keys (plaintext secret) or volatile fields (enabled,
 *     label, apiKeys array) — those don't change the translation;
 *   - `|`-join the parts then SHA-256 → hex.
 *
 * Pure function over its inputs (uses Web Crypto, available in SW/content/window).
 */

import type { Config, LangCode, ProviderConfig, SourceLang, TranslateContext } from '@/data/models';
import { resolveGlossary, withGlossary } from '../glossary';
import { buildTranslatePrompt, resolvePromptStyle, type BuiltPrompt } from '../prompts';

export interface CacheKeyInput {
  /** Text after placeholder preparation (the exact string sent to the engine). */
  preparedText: string;
  provider: ProviderConfig;
  source: SourceLang;
  target: LangCode;
  systemPrompt: string;
  userPrompt: string;
}

/**
 * Deterministic serialization of a JSON-ish value (objects get sorted keys) —
 * providerOptions are nested PER PROVIDER by ai-sdk convention
 * (`{ openai: { reasoningEffort } }`), so a flat whitelist of top-level keys
 * would miss every real output-changing knob. All of providerOptions is model
 * parameters by contract, so the whole (canonicalized) object belongs in the key.
 *
 * Exported so the in-flight dedup key (`jobKey`) canonicalizes a request's
 * context through this very serializer — two canonicalizers would drift.
 */
export function stableStringify(v: unknown): string {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? '';
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`;
  const o = v as Record<string, unknown>;
  return `{${Object.keys(o)
    .sort()
    .map((k) => `${JSON.stringify(k)}:${stableStringify(o[k])}`)
    .join(',')}}`;
}

/** Project the provider down to only the fields that influence the output. */
function stableProviderFingerprint(p: ProviderConfig): string {
  // NB: apiKeys deliberately excluded (secret + output-irrelevant).
  // params (temperature/maxOutputTokens/reasoning) change the generated text, so
  // they belong in the key exactly like providerOptions — without them, lowering
  // the temperature and re-translating would just replay the old cached text.
  return [
    p.id,
    p.kind,
    p.model,
    p.baseURL ?? '',
    stableStringify(p.providerOptions ?? {}),
    stableStringify(p.params ?? {}),
  ].join('~');
}

async function sha256Hex(input: string): Promise<string> {
  const bytes = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function computeCacheKey(input: CacheKeyInput): Promise<string> {
  // Context (title/glossary/neighbors) enters the key THROUGH the prompts —
  // buildReference folds it into systemPrompt — never as separate parts: a
  // separate title part made identical MT requests miss across pages whose
  // prompts (empty for MT) could not depend on the title at all.
  const parts = [
    input.preparedText,
    stableProviderFingerprint(input.provider),
    input.source,
    input.target,
    input.systemPrompt,
    input.userPrompt,
  ];
  return sha256Hex(parts.join('|'));
}

/**
 * Key + prompt for ONE text under the SINGLE-translation prompt shape — the
 * shared-cache invariant lives here: `executeTranslate`, the streaming single
 * path AND the batch path (which prompts the model differently but keys each
 * segment as if translated alone) must all derive their per-text key from this
 * one function, or a prompt change silently forks the cache between paths.
 *
 * The PromptStyle AND the on-demand glossary are resolved INTERNALLY (site
 * rules / term-in-text filtering via `context.domain`) so the key and the
 * prompt can never disagree: switching styles or editing a matching glossary
 * rule re-keys automatically, and every caller inherits the same resolution.
 */
export async function singleTranslationKey(
  text: string,
  provider: ProviderConfig,
  source: SourceLang,
  target: LangCode,
  config: Pick<Config, 'prompt' | 'glossary'>,
  context?: TranslateContext
): Promise<{ key: string; built: BuiltPrompt }> {
  const style = resolvePromptStyle(config.prompt, context?.domain);
  const ctx = withGlossary(context, resolveGlossary(config.glossary, context?.domain, text));
  const built = buildTranslatePrompt(text, source, target, config.prompt, ctx, style);
  const key = await computeCacheKey({
    preparedText: text,
    provider,
    source,
    target,
    systemPrompt: built.system,
    userPrompt: built.prompt,
  });
  return { key, built };
}
