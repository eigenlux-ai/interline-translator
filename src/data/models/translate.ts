/**
 * @module data/models/translate
 *
 * Request/response shapes for the translation engine. These cross the
 * proxy-service RPC boundary, so they MUST stay structured-clonable —
 * no functions, no AbortSignal, no class instances. Cancellation is keyed
 * by `requestId` over the side channel, never by passing a signal.
 */

import type { LangCode, SourceLang } from './lang';

/** How a request is fulfilled: through an LLM, or classic machine translation. */
export type TranslateMode = 'llm' | 'mt';

/** Lightweight context injected into LLM prompts (Phase 1 = adjacent text + glossary). */
export interface GlossaryEntry {
  source: string;
  target: string;
  note?: string;
}

export interface TranslateContext {
  /** Page/article title. */
  title?: string;
  /** One-paragraph whole-page overview (通读全文) — consistency anchor. */
  summary?: string;
  /** Neighbouring paragraphs for coherence (kept short). */
  neighbors?: string[];
  glossary?: GlossaryEntry[];
  /** Host domain, for domain-aware prompting (reserved; v1.x). */
  domain?: string;
}

export interface TranslateRequest {
  text: string;
  source: SourceLang;
  target: LangCode;
  /** Which configured provider to use; falls back to the default provider. */
  providerId?: string;
  /** Force a mode; otherwise the engine decides (LLM primary, MT fallback). */
  mode?: TranslateMode;
  context?: TranslateContext;
}

export interface TranslateResult {
  text: string;
  detectedSource?: LangCode;
  /** The provider that actually produced this result (after fallback). */
  providerId: string;
  fromCache?: boolean;
}
