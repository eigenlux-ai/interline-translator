/**
 * @module services/config/schema
 *
 * Zod schema for the full persisted config. `data/models/config.ts` holds the
 * canonical TS shape; this schema is asserted to match it via
 * `satisfies z.ZodType<Config>`, so the runtime validator and the static type
 * can never drift. Background validates on read/write; settings UI validates
 * form input.
 */

import { z } from 'zod';
import { BILINGUAL_STYLES, DISPLAY_MODES, type Config } from '@/data/models';
import { UI_LANGS } from '@/data/models/lang';
import { CONFIG_VERSION } from './migrations/v001';

const providerKind = z.enum([
  'openai',
  'anthropic',
  'google',
  'openrouter',
  'openai-compatible',
  'anthropic-compatible',
  'google-mt',
]);

/**
 * Is this base URL safe to send an API key and page text to? Every request to
 * a custom endpoint carries both, so a plain-http REMOTE host publishes them
 * on the wire. Require https — except for the loopback/`.local` hosts a
 * self-hosted engine actually runs on (the seeded openai-compatible base is
 * `http://localhost:11434/v1`, which has to keep working).
 */
export function isSafeBaseURL(raw: string): boolean {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return false; // not a URL at all — no engine could reach it anyway
  }
  if (url.protocol === 'https:') return true;
  if (url.protocol !== 'http:') return false;
  // `new URL` keeps the brackets on an IPv6 host, hence the literal '[::1]';
  // 127.0.0.0/8 is loopback in full, not just .0.1.
  const host = url.hostname.toLowerCase();
  return host === 'localhost' || host === '[::1]' || host.startsWith('127.') || host.endsWith('.local');
}

/** Exported so a corrupted `providers` array can be salvaged one entry at a time. */
export const providerConfigSchema = z.object({
  id: z.string().min(1),
  kind: providerKind,
  label: z.string().optional(),
  apiKeys: z.array(z.string()),
  // Degrades to undefined instead of rejecting: an unsafe endpoint must never
  // be USED, but failing here would cost the user the whole provider entry —
  // API keys included — the next time the config is read and rewritten.
  baseURL: z.string().refine(isSafeBaseURL).optional().catch(undefined),
  model: z.string(),
  extraHeaders: z.record(z.string(), z.string()).optional(),
  enabled: z.boolean(),
  draft: z.boolean().optional(),
  providerOptions: z.record(z.string(), z.unknown()).optional(),
  // `.optional()` so configs saved before this field validate (no migration).
  // Deliberately NO range cap on temperature: the sane range is a UI affordance
  // (the NumberInput clamps), and rejecting an odd hand-edited value here would
  // fail the whole providers section on backup import — upstream answers an
  // out-of-range value with a clear 400 instead.
  // `.catch(undefined)` finishes that argument for the caps that DO exist (a
  // maxOutputTokens of 0 truncates every batch, so it stays rejected): a knob
  // block is a preference, and losing one must never cost the engine its keys.
  params: z
    .object({
      temperature: z.number().optional(),
      maxOutputTokens: z.number().int().positive().optional(),
      reasoning: z.boolean().optional(),
    })
    .optional()
    .catch(undefined),
});

const siteMode = z.enum(['auto', 'always', 'never']);

export const configSchema = z.object({
  version: z.number().int().nonnegative(),
  language: z.object({ ui: z.enum(['auto', ...UI_LANGS]) }),
  providers: z.array(providerConfigSchema),
  translate: z.object({
    defaultProviderId: z.string().optional(),
    source: z.string(),
    target: z.string(),
    // Default to empty array for backwards compatibility.
    skipLanguages: z.array(z.string()).default([]),
    pageContext: z.boolean().optional(),
    richText: z.boolean().optional(),
  }),
  // Default to empty array for backwards compatibility.
  glossary: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string(),
        enabled: z.boolean(),
        pattern: z.string().optional(),
        entries: z.array(
          z.object({
            source: z.string().min(1),
            target: z.string().min(1),
            note: z.string().optional(),
          })
        ),
      })
    )
    .default([]),
  // Default prompt configuration with empty styles and site rules.
  prompt: z
    .object({
      styles: z.array(z.object({ id: z.string().min(1), name: z.string(), directives: z.string() })).default([]),
      activeStyleId: z.string().optional(),
      siteRules: z.array(z.object({ pattern: z.string(), styleId: z.string() })).default([]),
      expert: z
        .object({
          single: z.object({ system: z.string().optional(), user: z.string().optional() }).optional(),
          batch: z.object({ system: z.string().optional() }).optional(),
        })
        .optional(),
    })
    .default({ styles: [], siteRules: [] }),
  // Default configuration for in-page input translation.
  inputTranslation: z
    .object({
      enabled: z.boolean(),
      triggerCount: z.number().int().min(2).max(5),
      target: z.string(),
    })
    .default({ enabled: true, triggerCount: 3, target: 'en' }),
  siteControl: z.object({
    defaultMode: siteMode,
    rules: z.array(z.object({ pattern: z.string(), mode: siteMode })),
  }),
  appearance: z.object({
    colorScheme: z.enum(['auto', 'light', 'dark']),
    bilingualStyle: z.enum(BILINGUAL_STYLES),
    translationFont: z.enum(['kai', 'inherit']),
    // `.default(...)` so configs saved before this field validate (no migration).
    displayMode: z.enum(DISPLAY_MODES).default('bilingual'),
    // Default ON since 2026-08-03: the interleave line cleared its entire
    // default-enable bar (F1-F7, real-browser matrix, perf probes) — and every
    // ambiguous shape still falls back to the whole-block layout by design.
    paragraphInterleave: z.boolean().default(true),
  }),
}) satisfies z.ZodType<Config>;

/** Stable id of the seeded free MT provider (works with no API key). */
export const FREE_MT_PROVIDER_ID = 'google-free';

/**
 * Factory for a fresh default config. Seeds the free no-key MT provider as the
 * default so the extension translates out of the box; users add LLM keys later.
 */
export function defaultConfig(): Config {
  return {
    version: CONFIG_VERSION,
    language: { ui: 'auto' },
    providers: [
      {
        id: FREE_MT_PROVIDER_ID,
        kind: 'google-mt',
        label: 'Google Translate (free)',
        apiKeys: [],
        model: '',
        enabled: true,
      },
    ],
    translate: { defaultProviderId: FREE_MT_PROVIDER_ID, source: 'auto', target: 'zh-CN', skipLanguages: [] },
    prompt: { styles: [], siteRules: [] },
    glossary: [],
    inputTranslation: { enabled: true, triggerCount: 3, target: 'en' },
    siteControl: { defaultMode: 'auto', rules: [] },
    appearance: {
      colorScheme: 'auto',
      bilingualStyle: 'blend',
      translationFont: 'kai',
      displayMode: 'bilingual',
      paragraphInterleave: true,
    },
  };
}
