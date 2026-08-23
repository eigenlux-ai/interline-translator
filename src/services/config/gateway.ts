/**
 * @module services/config/gateway
 *
 * BACKGROUND half of the content-safe config story (projection type, readers
 * and the RPC contract live in ./public — import-safe; this file pulls the
 * full config machinery and must stay background-only):
 *
 *  - MIRROR: every change to the full config is projected into the public key,
 *    so content scripts get live settings without ever reading the full
 *    config (whose providers array carries API keys).
 *  - WRITE GATE: content-side edits (the floating ball's target/style/site
 *    toggles) arrive over the ConfigService RPC as a SECTION patch, filtered
 *    against a whitelist — a content script can never write providers.
 *
 * Call `registerConfigGateway()` once from the background entrypoint.
 */

import { registerService } from '@webext-core/proxy-service';
import { storage } from '#imports';
import type { Config } from '@/data/models';
import {
  CONFIG_SERVICE_KEY,
  PUBLIC_CONFIG_KEY,
  toPublicConfig,
  type PublicConfig,
  type PublicConfigPatch,
} from './public';
import { getConfig, setConfig, watchConfig } from './storage';

/** The sections a content surface may write. Never providers/version/language. */
const PATCHABLE = ['translate', 'inputTranslation', 'siteControl', 'appearance'] as const;

async function mirror(config: Config): Promise<void> {
  await storage.setItem<PublicConfig>(PUBLIC_CONFIG_KEY, toPublicConfig(config));
}

export function registerConfigGateway(): void {
  // Serialize the read-modify-write: two patches racing (two tabs' floating
  // balls) would otherwise interleave getConfig/setConfig and one would
  // silently roll the other back.
  let patchChain: Promise<void> = Promise.resolve();

  registerService(CONFIG_SERVICE_KEY, {
    patch(patch: PublicConfigPatch): Promise<void> {
      const run = patchChain.then(async () => {
        const allowed: Partial<Config> = {};
        for (const key of PATCHABLE) {
          if (patch[key] !== undefined) (allowed as Record<string, unknown>)[key] = patch[key];
        }
        if (Object.keys(allowed).length === 0) return;
        const cur = await getConfig();
        await setConfig({ ...cur, ...allowed }); // zod-validated inside
        // Mirror BEFORE resolving (the watch below also mirrors, idempotently):
        // callers sequence "patch → re-apply translation", and the re-apply
        // reads the projection — it must already hold this patch.
        await getConfig().then(mirror);
      });
      patchChain = run.catch(() => {}); // a failed patch must not jam the chain
      return run;
    },
  });

  // Mirror now (covers install/update/migrations while the SW was down) and on
  // every subsequent change. storage.onChanged wakes the SW, so the projection
  // can't go stale while it sleeps.
  void getConfig().then(mirror);
  watchConfig((config) => void mirror(config));
}
