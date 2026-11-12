/**
 * Embed the content entry's complete, processed CSS in its JS bundle.
 * Ordinary CSS and CSS Modules keep using Vite's pipeline; the emitted CSS
 * asset remains available for audits but is neither fetched nor host-injected.
 * WXT builds each content script separately, including in development mode.
 */
import type { Plugin } from 'vite';
import { escapeNonAscii } from './to-utf8';

const MODULE_ID = 'virtual:surface-css';
const RESOLVED_ID = `\0${MODULE_ID}`;
const MARKER = '__AIE_BUNDLED_SURFACE_CSS_61d9a7__';

export default function inlineSurfaceCss(): Plugin {
  return {
    name: 'inline-surface-css',
    apply: 'build',
    enforce: 'post',
    resolveId(id) {
      if (id === MODULE_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) return `export default ${JSON.stringify(MARKER)};`;
    },
    generateBundle: {
      order: 'post',
      handler(_options, bundle) {
        const consumers = Object.values(bundle).filter((item) => item.type === 'chunk' && item.code.includes(MARKER));
        if (consumers.length === 0) return;
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
        const css = typeof sheet.source === 'string' ? sheet.source : new TextDecoder().decode(sheet.source);
        for (const chunk of chunks) {
          const token = new RegExp('(["\'`])' + MARKER + '\\1', 'g');
          if (!token.test(chunk.code)) {
            this.error('The surface CSS placeholder was transformed unexpectedly.');
          }
          token.lastIndex = 0;
          // This hook runs after CSS generation and may run after the ASCII
          // plugin, so escape the inserted literal here as well.
          chunk.code = chunk.code.replaceAll(token, () => escapeNonAscii(JSON.stringify(css)));
        }
      },
    },
  };
}
