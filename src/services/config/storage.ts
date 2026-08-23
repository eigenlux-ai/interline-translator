/**
 * @module services/config/storage
 *
 * The single persisted config item. WXT storage propagates across every
 * context, so background (deciding how to translate) and UI (settings) read
 * and watch the SAME item — no proxy needed. Validation/migration runs on read.
 *
 * Import-safe everywhere EXCEPT that it pulls zod (via schema) — keep heavy
 * settings forms in the options entrypoint, not in content.
 */

import { storage } from '#imports';
import { PROJECT_PREFIX } from '@/constants';
import type { Config, ProviderConfig } from '@/data/models';
import { migrate } from './migrations/v001';
import { configSchema, defaultConfig, providerConfigSchema } from './schema';

const CONFIG_KEY = `local:${PROJECT_PREFIX}:config` as const;

const configStorage = storage.defineItem<Config>(CONFIG_KEY, { fallback: defaultConfig() });

/**
 * Salvage a corrupted `providers` array entry by entry. This section is the one
 * whose loss is permanent: the next full-object write persists the gap, and the
 * user's API keys are gone from storage for good. So one hand-edited entry must
 * cost that entry alone. Returns undefined when nothing is left to keep, so the
 * caller falls back to the seeded free MT engine and the page still translates.
 */
function salvageProviders(raw: unknown): ProviderConfig[] | undefined {
  if (!Array.isArray(raw)) return undefined;
  const kept: ProviderConfig[] = [];
  const dropped: string[] = [];
  raw.forEach((entry, i) => {
    const parsed = providerConfigSchema.safeParse(entry);
    if (parsed.success) {
      kept.push(parsed.data);
      return;
    }
    // The id (or the slot) alone — an entry holds API keys, which are never logged.
    const id = (entry as ProviderConfig | null)?.id;
    dropped.push(typeof id === 'string' ? id : `#${i}`);
  });
  if (dropped.length) console.warn(`[config] dropped ${dropped.length} invalid provider(s): ${dropped.join(', ')}`);
  return kept.length ? kept : undefined;
}

/**
 * Read the current config, migrated + validated. Salvages per-section on
 * corruption — and, inside `providers`, per ENTRY.
 */
export async function getConfig(): Promise<Config> {
  const raw = await configStorage.getValue();
  const migrated = migrate(raw as unknown as Record<string, unknown>);
  const parsed = configSchema.safeParse(migrated);
  if (parsed.success) return parsed.data;

  // One bad field must not factory-reset the user: a wholesale fallback made
  // their providers/keys invisible (while storage still held them) with zero
  // diagnostics. Salvage every top-level section that validates on its own;
  // only the broken ones revert to defaults. `providers` is an array, so a
  // whole-section revert there would still wipe every key over ONE bad entry:
  // that section salvages element-wise instead.
  console.warn('[config] stored config failed validation — salvaging valid sections', parsed.error);
  const base = defaultConfig() as unknown as Record<string, unknown>;
  for (const [key, sub] of Object.entries(configSchema.shape)) {
    if (!migrated || !(key in migrated)) continue;
    const section = sub.safeParse(migrated[key]);
    if (section.success) base[key] = section.data;
    else if (key === 'providers') base.providers = salvageProviders(migrated[key]) ?? base.providers;
  }
  return base as unknown as Config;
}

/** Persist a full config (validated first; throws on invalid input). */
export async function setConfig(next: Config): Promise<void> {
  const parsed = configSchema.parse(next);
  await configStorage.setValue(parsed);
}

/** Subscribe to config changes from any context. Returns an unwatch fn. */
export function watchConfig(cb: (config: Config) => void): () => void {
  return configStorage.watch((value) => {
    if (value) cb(value);
  });
}
