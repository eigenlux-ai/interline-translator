/**
 * @module vite-plugins/check-prefix-sync
 *
 * Dev/build-time guard that global.css stays in sync with PROJECT_PREFIX.
 *
 * Why: PROJECT_PREFIX has a single source of truth in `prefix.cjs`, and almost
 * everything derives from it (src/constants, postcss.config.cjs, the CSS audit).
 * The ONE place that still mirrors the prefix by hand is global.css, because CSS
 * cannot import the constant. Forget to update it after changing the prefix and
 * the breakage is SILENT: shadow-surface styling and z-index layering quietly
 * stop matching, with nothing thrown.
 *
 * `pnpm test` already guards this (src/constants/index.test.ts), but that only
 * fires when you run the suite. This plugin closes the interactive gap: it
 * checks at `wxt dev` / `wxt build` startup and on every HMR edit of global.css
 * or prefix.cjs, so a forker mid-edit gets an immediate, located warning instead
 * of chasing an invisible styling bug.
 *
 * Severity by command: a loud WARNING in dev (never blocks the dev server, so
 * you can keep editing toward a fix) and a hard ERROR in build (a broken mirror
 * must not ship — mirrors the audit:css exit-1 ethos).
 *
 * The detection logic is the exported pure `findPrefixMismatches` (unit-tested
 * in check-prefix-sync.test.ts); the plugin is just the fs + Vite wiring.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { PluginOption } from 'vite';
import { PROJECT_PREFIX } from '../prefix.cjs';

const GLOBAL_CSS = 'src/react-app/styles/global.css';

/**
 * Returns a list of human-readable mismatch messages (empty ⇒ in sync). Pure so
 * it can be unit-tested without touching the filesystem or a Vite build.
 *
 * Two anchors are checked — the surface-root class and the z-index var block —
 * because they are the two independent ways global.css hard-codes the prefix.
 * When a mismatch is found we also surface the stale prefix actually present in
 * the file, so the message points straight at what to change.
 */
export function findPrefixMismatches(globalCss: string, prefix: string): string[] {
  const errors: string[] = [];

  const surfaceClass = `.${prefix}-surface-root`;
  if (!globalCss.includes(surfaceClass)) {
    // Character class includes `-` so a hyphenated stale prefix (e.g. a fork
    // that used `.my-ext-surface-root`) is reported in full, not truncated.
    const found = [...new Set([...globalCss.matchAll(/\.([a-z0-9-]+)-surface-root/gi)].map((m) => m[1]))].filter(
      (p) => p !== prefix
    );
    const hint = found.length
      ? ` (global.css currently uses ${found.map((p) => `.${p}-surface-root`).join(', ')})`
      : '';
    errors.push(
      `global.css must anchor surface styles on ${surfaceClass} to match PROJECT_PREFIX ('${prefix}')${hint}`
    );
  }

  const zVar = `--${prefix}-z-main-ui`;
  if (!globalCss.includes(zVar)) {
    errors.push(`global.css is missing ${zVar} — its --<prefix>-z-* block does not match PROJECT_PREFIX ('${prefix}')`);
  }

  return errors;
}

// Dedupe identical dev warnings across WXT's multiple per-entrypoint builds
// (each calls the vite() factory, so this module-scoped set is shared).
const warned = new Set<string>();

export default function checkPrefixSync(): PluginOption {
  let isBuild = false;

  const check = (warn: (msg: string) => void, error: (msg: string) => never | void) => {
    const css = readFileSync(join(process.cwd(), GLOBAL_CSS), 'utf8');
    const errors = findPrefixMismatches(css, PROJECT_PREFIX);
    if (errors.length === 0) return;
    const msg =
      `prefix.cjs ↔ global.css out of sync:\n${errors.map((e) => `  • ${e}`).join('\n')}\n` +
      `Update ${GLOBAL_CSS} to use the '${PROJECT_PREFIX}' prefix, then save.`;
    if (isBuild) {
      error(msg);
    } else if (!warned.has(msg)) {
      warned.add(msg);
      warn(msg);
    }
  };

  return {
    name: 'check-prefix-sync',
    configResolved(config) {
      isBuild = config.command === 'build';
    },
    buildStart() {
      check(
        (m) => this.warn(m),
        (m) => this.error(m)
      );
    },
    handleHotUpdate(ctx) {
      // Re-check on edits to either mirror. Note: editing prefix.cjs only updates
      // the warning here — the JS side (src/constants et al.) imports prefix.cjs
      // at build time, so a prefix change needs a dev-server restart to take
      // effect in the bundle. The warning still fires so you know to restart.
      if (ctx.file.endsWith('global.css') || ctx.file.endsWith('prefix.cjs')) {
        warned.clear(); // a fresh edit deserves a fresh warning even if identical
        check(
          (m) => ctx.server.config.logger.warn(`\n${m}\n`, { timestamp: true }),
          () => {}
        );
      }
    },
  };
}
