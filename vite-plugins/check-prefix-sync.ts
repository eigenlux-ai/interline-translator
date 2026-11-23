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
import { createRequire } from 'node:module';
import { join } from 'node:path';
import postcss from 'postcss';
import valueParser from 'postcss-value-parser';
import type { PluginOption } from 'vite';

const GLOBAL_CSS = 'src/react-app/styles/global.css';

/**
 * Reads `PROJECT_PREFIX` directly from `prefix.cjs` on disk, bypassing Node's
 * module cache so dev-server HMR edits to `prefix.cjs` are observed immediately.
 */
export function readProjectPrefix(rootDir = process.cwd()): string {
  const prefixPath = join(rootDir, 'prefix.cjs');
  const req = createRequire(prefixPath);
  // Resolve through symlinks (e.g. macOS /var -> /private/var) so the cache key matches.
  delete req.cache[req.resolve(prefixPath)];
  const mod = req(prefixPath) as { PROJECT_PREFIX?: unknown };
  if (typeof mod.PROJECT_PREFIX !== 'string' || mod.PROJECT_PREFIX.length === 0) {
    throw new Error(`prefix.cjs must export a non-empty PROJECT_PREFIX string (${prefixPath}).`);
  }
  return mod.PROJECT_PREFIX;
}

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
  const root = postcss.parse(globalCss);
  const escapeRe = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const selectors: string[] = [];
  root.walkRules((rule) => {
    selectors.push(...rule.selectors);
  });

  const surfaceClass = `.${prefix}-surface-root`;
  const surfaceRe = new RegExp(`\\.${escapeRe(prefix)}-surface-root(?![\\w-])`);
  if (!selectors.some((sel) => surfaceRe.test(sel))) {
    // Character class includes `-` so a hyphenated stale prefix (e.g. a fork
    // that used `.my-ext-surface-root`) is reported in full, not truncated.
    const found = [
      ...new Set(
        selectors.flatMap((sel) => [...sel.matchAll(/\.([a-z0-9-]+)-surface-root(?![\w-])/gi)].map((m) => m[1]!))
      ),
    ].filter((p) => p !== prefix);
    const hint = found.length
      ? ` (global.css currently uses ${found.map((p) => `.${p}-surface-root`).join(', ')})`
      : '';
    errors.push(
      `global.css must anchor surface styles on ${surfaceClass} to match PROJECT_PREFIX ('${prefix}')${hint}`
    );
  }

  const zVar = `--${prefix}-z-main-ui`;
  const sbVars = ['track-color', 'thumb-color', 'size'].map((suffix) => `--${prefix}-sb-${suffix}`);
  const sbPattern = /^--(?:([a-z0-9-]+)-)?sb-(?:track-color|thumb-color|size)$/i;

  let hasZVar = false;
  const declaredSbVars = new Set<string>();
  const staleDecl = new Set<string>();
  const varRefSet = new Set<string>();
  const staleRef = new Set<string>();

  root.walkDecls((decl) => {
    if (decl.prop === zVar) hasZVar = true;
    const propMatch = sbPattern.exec(decl.prop);
    if (propMatch) {
      if (propMatch[1] === prefix) declaredSbVars.add(decl.prop);
      else staleDecl.add(decl.prop);
    }
    valueParser(decl.value).walk((node) => {
      if (node.type !== 'function' || node.value.toLowerCase() !== 'var') return;
      const argument = node.nodes.find((child) => child.type !== 'space' && child.type !== 'comment');
      if (argument?.type !== 'word') return;
      const ref = argument.value;
      varRefSet.add(ref);
      const refMatch = sbPattern.exec(ref);
      if (refMatch && refMatch[1] !== prefix) staleRef.add(ref);
    });
  });

  if (!hasZVar) {
    errors.push(`global.css is missing ${zVar} — its --<prefix>-z-* block does not match PROJECT_PREFIX ('${prefix}')`);
  }

  const missingDecl = sbVars.filter((name) => !declaredSbVars.has(name));
  const missingRef = sbVars.filter((name) => !varRefSet.has(name));
  if (missingDecl.length > 0 || missingRef.length > 0 || staleDecl.size > 0 || staleRef.size > 0) {
    const parts: string[] = [];
    if (missingDecl.length > 0) parts.push(`missing declarations (${missingDecl.join(', ')})`);
    if (missingRef.length > 0) parts.push(`missing var() references (${missingRef.join(', ')})`);
    if (staleDecl.size > 0) parts.push(`stale declarations (${[...staleDecl].join(', ')})`);
    if (staleRef.size > 0) parts.push(`stale var() references (${[...staleRef].join(', ')})`);
    errors.push(`global.css scrollbar variables must match PROJECT_PREFIX ('${prefix}'): ${parts.join('; ')}`);
  }

  return errors;
}

// Dedupe identical dev warnings across WXT's multiple per-entrypoint builds
// (each calls the vite() factory, so this module-scoped state is shared).
const warned = new Set<string>();
let startupPrefix: string | undefined;

export default function checkPrefixSync(): PluginOption {
  let isBuild = false;

  const check = (warn: (msg: string) => void, error: (msg: string) => never | void) => {
    let prefix: string;
    let errors: string[];
    try {
      prefix = readProjectPrefix();
      startupPrefix ??= prefix;
      const css = readFileSync(join(process.cwd(), GLOBAL_CSS), 'utf8');
      errors = findPrefixMismatches(css, prefix);
    } catch (err) {
      const readError = err instanceof Error ? err.message : String(err);
      if (isBuild) {
        error(readError);
      } else if (!warned.has(readError)) {
        warned.add(readError);
        warn(readError);
      }
      return;
    }
    const restartNeeded = !isBuild && prefix !== startupPrefix;
    if (errors.length === 0 && !restartNeeded) return;

    const details = errors.map((e) => `  • ${e}`);
    if (restartNeeded) {
      details.push(
        `  • prefix.cjs changed from '${startupPrefix}' to '${prefix}' — restart the dev server so JS/PostCSS bundles pick up the new prefix.`
      );
    }
    const heading = errors.length > 0 ? 'prefix.cjs ↔ global.css out of sync:' : 'prefix.cjs changed:';
    const msg =
      `${heading}\n${details.join('\n')}` +
      (errors.length > 0 ? `\nUpdate ${GLOBAL_CSS} to use the '${prefix}' prefix, then save.` : '');
    if (isBuild) {
      if (errors.length > 0) error(msg);
    } else if (!warned.has(msg)) {
      warned.add(msg);
      warn(msg);
    }
  };

  return {
    name: 'check-prefix-sync',
    configResolved(config) {
      isBuild = config.command === 'build';
      if (startupPrefix === undefined) {
        try {
          startupPrefix = readProjectPrefix();
        } catch {
          // Reported on buildStart / handleHotUpdate.
        }
      }
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
