/**
 * @module services/translation/glossary
 *
 * On-demand glossary resolution over NAMED SETS (「AI 术语集」…). An entry
 * reaches the prompt only when ALL hold:
 *   - its set is enabled;
 *   - the set's site pattern matches the page host (absent = every site);
 *   - the entry's source term actually OCCURS in the text being translated
 *     (case-insensitive).
 *
 * The occurrence filter is the load-bearing choice: hoarding domain sets must
 * not tax every request with their whole contents, and — because the cache
 * key derives from the final prompts — unrelated texts keep stable keys no
 * matter how the collection grows. Only texts that CONTAIN a term re-key when
 * that term's entry changes, which is exactly when their translation could
 * change.
 *
 * Pure logic — unit-tested, no browser APIs.
 */

import type { GlossaryEntry, GlossarySet, TranslateContext } from '@/data/models';
import { matchDomainPattern } from '@/services/config/site-control';

/**
 * Ceiling on injected entries per prompt. A text that somehow matches more
 * (pathological sets, or one-word terms like "the") keeps the FIRST matches
 * in set-then-entry order — earlier sets are treated as the more deliberate
 * ones. 12 exact-term directives is already beyond what a model applies
 * reliably.
 */
const MAX_ENTRIES_PER_PROMPT = 12;

/** Entries from enabled, host-matching sets whose term occurs in `text` (first-wins per term). */
export function resolveGlossary(sets: readonly GlossarySet[], host: string | undefined, text: string): GlossaryEntry[] {
  if (sets.length === 0 || !text) return [];
  const haystack = text.toLowerCase();
  const seen = new Set<string>();
  const out: GlossaryEntry[] = [];
  for (const set of sets) {
    if (!set.enabled) continue;
    if (set.pattern && (!host || !matchDomainPattern(host, set.pattern))) continue;
    for (const entry of set.entries) {
      if (out.length >= MAX_ENTRIES_PER_PROMPT) return out;
      const term = entry.source.trim();
      if (!term) continue;
      const key = term.toLowerCase();
      if (seen.has(key)) continue; // duplicate term: the earlier set/entry wins
      if (!haystack.includes(key)) continue;
      seen.add(key);
      out.push({ source: term, target: entry.target, ...(entry.note ? { note: entry.note } : {}) });
    }
  }
  return out;
}

/**
 * Merge resolved glossary entries into a request context (request-provided
 * entries keep priority by coming first — buildReference lists them earlier).
 */
export function withGlossary(context: TranslateContext | undefined, resolved: GlossaryEntry[]): TranslateContext | undefined {
  if (resolved.length === 0) return context;
  return { ...context, glossary: [...(context?.glossary ?? []), ...resolved] };
}
