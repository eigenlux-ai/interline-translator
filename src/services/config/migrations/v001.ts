/**
 * @module services/config/migrations/v001
 *
 * Versioned config migration chain. Each migration step transforms a
 * configuration object from the previous schema version to the next version.
 */

/** Current config schema version. Bump when adding a migration step. */
export const CONFIG_VERSION = 4;

export type Migration = (input: Record<string, unknown>) => Record<string, unknown>;

/**
 * Ordered migrations keyed by the version they UPGRADE TO. To go from a stored
 * `version` to CONFIG_VERSION, apply every entry whose key is > stored version.
 */
export const MIGRATIONS: Record<number, Migration> = {
  // 1: initial schema — nothing to migrate from.
  1: (input) => input,
  // 2: `language.ui` becomes the interface-language override with default
  // 'auto' (follow translate.target). No UI ever exposed the old seeded 'en',
  // so every stored value IS the seed — reset unconditionally. Sibling fields
  // under `language` are preserved: a frozen migration must not hardcode the
  // object's future shape.
  2: (input) => ({
    ...input,
    language: { ...(input.language as Record<string, unknown> | undefined), ui: 'auto' },
  }),
  // 3: PromptStyle system lands.
  // The legacy full-override fields `translate.customSystemPrompt/customUserPrompt`
  // MOVE into the expert escape hatch `prompt.expert.single` — same semantics
  // (whole-template takeover), new address.
  3: (input) => {
    // Idempotence guard: a config that already HAS a prompt node is ≥v3-shaped.
    // Reachable via backup import of a hand-edited file that lost its `version`
    // (migrate() then starts from 0) — without this, re-running would wipe the
    // user's styles/siteRules/expert with the empty seed below.
    if (input.prompt && typeof input.prompt === 'object') return input;
    const translate = { ...(input.translate as Record<string, unknown> | undefined) };
    const system = typeof translate.customSystemPrompt === 'string' ? translate.customSystemPrompt : undefined;
    const user = typeof translate.customUserPrompt === 'string' ? translate.customUserPrompt : undefined;
    delete translate.customSystemPrompt;
    delete translate.customUserPrompt;
    const single = { ...(system ? { system } : {}), ...(user ? { user } : {}) };
    return {
      ...input,
      translate,
      prompt: {
        styles: [],
        siteRules: [],
        ...(system || user ? { expert: { single } } : {}),
      },
    };
  },
  // 4: glossary grows SETS (「AI 术语集」…). The flat entry list (lived for
  // one dev day) becomes sets grouped by each entry's old per-entry pattern:
  // patternless entries → one enabled default set; each distinct pattern →
  // its own set carrying that pattern (site scope moved to the set level).
  4: (input) => {
    const flat = Array.isArray(input.glossary) ? (input.glossary as Record<string, unknown>[]) : [];
    if (flat.some((x) => x && typeof x === 'object' && 'entries' in x)) return input; // already sets
    const groups = new Map<string, Record<string, unknown>[]>();
    for (const e of flat) {
      if (!e || typeof e !== 'object') continue;
      const pattern = typeof e.pattern === 'string' ? e.pattern : '';
      const entry: Record<string, unknown> = { source: e.source, target: e.target };
      if (typeof e.note === 'string') entry.note = e.note;
      const list = groups.get(pattern);
      if (list) list.push(entry);
      else groups.set(pattern, [entry]);
    }
    const sets = [...groups.entries()].map(([pattern, entries], i) => ({
      id: `set-${i + 1}`,
      name: pattern || '术语表',
      enabled: true,
      ...(pattern ? { pattern } : {}),
      entries,
    }));
    return { ...input, glossary: sets };
  },
};

/** Apply the chain to bring a raw stored object up to CONFIG_VERSION. */
export function migrate(raw: Record<string, unknown>): Record<string, unknown> {
  const from = typeof raw.version === 'number' ? raw.version : 0;
  let acc = raw;
  for (let v = from + 1; v <= CONFIG_VERSION; v++) {
    const step = MIGRATIONS[v];
    if (step) acc = step(acc);
  }
  return { ...acc, version: CONFIG_VERSION };
}
