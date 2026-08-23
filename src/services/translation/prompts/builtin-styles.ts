/**
 * @module services/translation/prompts/builtin-styles
 *
 * Factory-shipped translation styles. Defined in CODE, not persisted — stored
 * presets would go stale as we refine directives, and their names must follow
 * the UI language (Paraglide) rather than freeze at install time. Config only
 * ever references them by id (`activeStyleId` / site rules); user-created
 * styles live in `config.prompt.styles`.
 *
 * Directives are deliberately English: LLM-facing (models follow English
 * instructions most reliably) and token-cheap. They double as living examples
 * of how to write a style — the options UI offers "duplicate" so users start
 * from one of these.
 *
 * 素译 (faithful, the default) is NOT a style: it is the absence of one
 * (`activeStyleId: undefined`), so the skeleton runs unmodified.
 */

import type { PromptStyle } from '@/data/models';

/** Stable id prefix — UI uses it to gate edit/delete (builtins are read-only). */
export const BUILTIN_STYLE_PREFIX = 'builtin:';

export const isBuiltinStyleId = (id: string): boolean => id.startsWith(BUILTIN_STYLE_PREFIX);

/**
 * `name` here is the CANONICAL (English) fallback; the options UI renders
 * localized names via Paraglide keys derived from the id (style_colloquial
 * etc.), never this field.
 */
export const BUILTIN_STYLES: readonly PromptStyle[] = [
  {
    id: 'builtin:colloquial',
    name: 'Colloquial',
    directives: [
      'Prefer natural, conversational phrasing over stiff literal renderings.',
      'Use everyday vocabulary and contractions where the target language allows.',
      'Break long formal constructions into shorter spoken-rhythm sentences when meaning is preserved.',
    ].join('\n'),
  },
  {
    id: 'builtin:academic',
    name: 'Academic',
    directives: [
      'Use a formal, scholarly register with precise terminology.',
      'Preserve hedging and qualification exactly (may, suggests, appears to) — never strengthen or weaken claims.',
      'Keep citations, references, and technical notation untouched.',
    ].join('\n'),
  },
  {
    id: 'builtin:technical',
    name: 'Technical docs',
    directives: [
      'Keep API names, identifiers, CLI commands, file paths, and error strings untranslated.',
      'Use imperative mood for instructions and keep terminology consistent across the whole text.',
      'Prefer the established target-language term of art over inventive rewording.',
    ].join('\n'),
  },
  {
    id: 'builtin:literary',
    name: 'Literary',
    directives: [
      'Prioritize rhythm, imagery, and the voice of the original over word-for-word fidelity.',
      'Freer word order and idiomatic substitution are welcome when they carry the same feeling.',
      'Preserve register shifts (dialect, irony, tenderness) rather than flattening them.',
    ].join('\n'),
  },
];

/** Look up a style by id across builtins + the user's own styles. */
export function findStyle(userStyles: readonly PromptStyle[], id: string | undefined): PromptStyle | undefined {
  if (!id) return undefined;
  return BUILTIN_STYLES.find((s) => s.id === id) ?? userStyles.find((s) => s.id === id);
}
