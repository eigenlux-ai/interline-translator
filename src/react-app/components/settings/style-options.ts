/**
 * @module react-app/components/settings/style-options
 *
 * Shared UI projection of the style universe (素译 + builtins + user styles):
 * localized names for builtin ids and Select data — used by the options
 * management page AND the popup quick switcher, so the two lists can't drift.
 */

import type { PromptConfig } from '@/data/models';
import { BUILTIN_STYLES } from '@/services/translation/prompts/builtin-styles';
import { m } from '@/paraglide/messages.js';

/** Sentinel Select value for "no style" — Config stores it as undefined. */
export const PLAIN_STYLE = '';

/** Config → Select value ('' represents 素译). */
export function toStyleSelectValue(id: string | undefined): string {
  return id ?? PLAIN_STYLE;
}

/** Select value → Config value (Select's null and the 素译 sentinel both mean undefined). */
export function fromStyleSelectValue(v: string | null): string | undefined {
  return v && v !== PLAIN_STYLE ? v : undefined;
}

/** Localized name/description per builtin id (directives stay English). */
export const builtinCopy: Record<string, { name: () => string; desc: () => string }> = {
  'builtin:colloquial': { name: m.style_builtin_colloquial, desc: m.style_builtin_colloquial_desc },
  'builtin:academic': { name: m.style_builtin_academic, desc: m.style_builtin_academic_desc },
  'builtin:technical': { name: m.style_builtin_technical, desc: m.style_builtin_technical_desc },
  'builtin:literary': { name: m.style_builtin_literary, desc: m.style_builtin_literary_desc },
};

/** Display name for any style id (builtin → localized; user → stored name). */
export function styleDisplayName(prompt: PromptConfig, id: string | undefined): string {
  if (!id) return m.style_plain_name();
  const builtin = builtinCopy[id];
  if (builtin) return builtin.name();
  return prompt.styles.find((s) => s.id === id)?.name ?? id;
}

/** Mantine Select data over the whole style universe. */
export function styleSelectData(prompt: PromptConfig, opts?: { includePlain?: boolean }): Array<{ value: string; label: string }> {
  return [
    ...(opts?.includePlain === false ? [] : [{ value: PLAIN_STYLE, label: m.style_plain_name() }]),
    ...BUILTIN_STYLES.map((s) => ({ value: s.id, label: builtinCopy[s.id]?.name() ?? s.name })),
    ...prompt.styles.map((s) => ({ value: s.id, label: s.name })),
  ];
}
