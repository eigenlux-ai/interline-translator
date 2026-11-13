/**
 * Embed the content entry's complete, processed CSS in its JS bundle.
 * Ordinary CSS and CSS Modules keep using Vite's pipeline. The emitted sheet
 * moves to `surface-css/<entry>.css`: an audit-only copy that nothing loads
 * and `wxt zip` excludes, leaving `content-scripts/*.css` to entries that use
 * WXT's normal CSS injection.
 * WXT builds each content script separately, including in development mode.
 *
 * The CSS only exists once Vite has emitted it (generateBundle), which is after
 * minification. The virtual module therefore exports a placeholder wrapped in
 * an expression the minifier cannot evaluate (an unknown global read), so code
 * such as `css.replaceAll(...)`, `css.length` or `css ? a : b` stays a runtime
 * operation and sees the real CSS instead of being folded against the marker.
 * The global is never set, and its key is a symbol, so neither host-page
 * scripts (isolated world) nor named DOM elements (`id=...`) can supply it.
 *
 * Sourcemaps: the literal is inserted without a newline, so only columns on
 * its own line move. Unminified (dev) output maps nothing after it on that
 * line; minified output with sourcemaps on drifts for the rest of that line,
 * because rolldown writes the map it built before this hook.
 *
 * `@property` rules are dropped from the embedded CSS (see keepAtRulesInShadow).
 */
import { posix } from 'node:path';
import postcss, { type AtRule } from 'postcss';
import type { Plugin } from 'vite';
import { escapeNonAscii } from './to-utf8';

const MODULE_ID = 'virtual:surface-css';
const RESOLVED_ID = `\0${MODULE_ID}`;
const MARKER = '__AIE_BUNDLED_SURFACE_CSS_61d9a7__';
const OPAQUE_KEY = 'surface-css:unset';
/** Output directory of the audit-only CSS copies (see wxt.config.ts `zip.exclude`). */
export const SURFACE_CSS_DIR = 'surface-css';

export default function inlineSurfaceCss(): Plugin {
  let loaded = false;
  return {
    name: 'inline-surface-css',
    apply: 'build',
    enforce: 'post',
    buildStart() {
      loaded = false;
    },
    resolveId(id) {
      if (id === MODULE_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id !== RESOLVED_ID) return;
      loaded = true;
      return `export default String(globalThis[Symbol.for(${JSON.stringify(OPAQUE_KEY)})] ?? ${JSON.stringify(MARKER)});`;
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const consumers = Object.values(bundle).filter((item) => item.type === 'chunk' && item.code.includes(MARKER));
        if (consumers.length === 0) {
          if (loaded) {
            this.error(
              'virtual:surface-css is imported but its value never reaches the bundle; pass it to the surface or remove the import.'
            );
          }
          return;
        }
        // Never accidentally collect styles from unrelated entries or chunks.
        const chunks = Object.values(bundle).filter((item) => item.type === 'chunk');
        if (consumers.length !== 1 || chunks.length !== 1) {
          this.error('virtual:surface-css requires a single content-script bundle without code splitting.');
        }
        const sheets = Object.values(bundle).filter((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
        if (sheets.length !== 1) {
          this.error('virtual:surface-css requires exactly one emitted CSS asset. Check the entry CSS imports.');
        }
        const sheet = sheets[0]!;
        if (sheet.type !== 'asset') this.error('Expected a CSS asset.');
        const raw = typeof sheet.source === 'string' ? sheet.source : new TextDecoder().decode(sheet.source);
        let css: string;
        try {
          css = keepAtRulesInShadow(raw);
        } catch (error) {
          this.error(error instanceof Error ? error.message : String(error));
        }
        if (/@font-face/.test(css)) {
          this.warn('@font-face is ignored inside shadow roots, so fonts declared in surface CSS never load.');
        }
        // Re-emit as the audit copy, named after the script that embeds it;
        // it must stay identical to what ships in the JS.
        delete bundle[sheet.fileName];
        const scriptName = posix.basename(chunks[0]!.fileName).replace(/\.[cm]?js$/, '');
        this.emitFile({ type: 'asset', fileName: `${SURFACE_CSS_DIR}/${scriptName}.css`, source: css });
        // This hook runs after CSS generation and may run after the ASCII
        // plugin, so escape the inserted literal here as well.
        const literal = escapeNonAscii(JSON.stringify(css));
        for (const chunk of chunks) {
          const token = new RegExp('(["\'`])' + MARKER + '\\1', 'g');
          let replaced = false;
          chunk.code = chunk.code.replaceAll(token, () => {
            replaced = true;
            return literal;
          });
          if (!replaced) this.error('The surface CSS placeholder was transformed unexpectedly.');
        }
      },
    },
  };
}

/**
 * `@property` is ignored inside shadow roots, so Tailwind's registrations
 * would leave its `--tw-*` variables without initial values there. Drop them
 * and ungate Tailwind's own per-element fallback (`@layer properties {
 * @supports (…) { *, ::before, ::after, ::backdrop { --tw-*: initial } } }`),
 * which it otherwise limits to browsers without `@property`. Satellites get
 * the same values from the shared sheet. Fails when a registration has no
 * fallback (your own `@property`, or Tailwind changed its output shape).
 */
export function keepAtRulesInShadow(css: string): string {
  const root = postcss.parse(css);
  const registered: string[] = [];
  root.walkAtRules('property', (rule) => {
    registered.push(rule.params.trim());
    rule.remove();
  });
  if (registered.length === 0) return css;

  const covered = new Set<string>();
  root.walkAtRules('layer', (layer) => {
    if (layer.params.trim() !== 'properties' || !layer.nodes) return;
    for (const node of [...layer.nodes]) {
      if (node.type !== 'atrule' || (node as AtRule).name !== 'supports') continue;
      node.walkDecls((decl) => {
        covered.add(decl.prop);
      });
      node.replaceWith((node as AtRule).nodes ?? []);
    }
  });
  const missing = registered.filter((name) => !covered.has(name));
  if (missing.length > 0) {
    throw new Error(
      `@property ${missing.join(', ')} cannot work in surface CSS: registrations are ignored inside shadow roots ` +
        'and no `@layer properties` fallback sets an initial value. Declare the variable where it is used instead.'
    );
  }
  return root.toString();
}
