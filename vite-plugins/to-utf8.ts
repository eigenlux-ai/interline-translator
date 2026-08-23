/**
 * @module vite-plugins/to-utf8
 *
 * Rewrites every non-ASCII character in emitted JS chunks as a `\uXXXX`
 * escape, leaving the output pure ASCII.
 *
 * Why: Chrome refuses to load extension scripts it can't read as UTF-8 and
 * reports "Could not load file. It isn't UTF-8 encoded." The precise trigger
 * is Unicode non-characters (U+FDD0..U+FDEF, U+nFFFE/U+nFFFF, e.g. katex's
 * String.fromCharCode(65535) sentinel), but we escape ALL non-ASCII to match
 * esbuild's charset:'ascii' (WXT's own fix on the Vite 7 path): a bulletproof
 * superset that also covers CJK/emoji source strings.
 *
 * Required even if your own source is ASCII-only: dependencies ship non-ASCII
 * too (e.g. @webext-core/messaging embeds box-drawing/arrow glyphs in its debug
 * strings), so bundled chunks are rarely pure ASCII on their own. Do not remove
 * this plugin on the assumption that a CJK-free app doesn't need it.
 *
 * This is a plugin because Vite 8 / rolldown has no native ascii-output
 * option. WXT skips its esbuild.charset fix on rolldown (an empty TODO),
 * rolldown#8805 and oxc#17068 are both open with no ETA, and the Vite core
 * team recommends exactly this regex approach in rolldown#8805.
 * See https://github.com/wxt-dev/wxt/issues/353.
 *
 * Hook choice: rolldown 1.0.3 (Vite 8's bundler) does NOT honor a renderChunk
 * return value (verified empirically: escaping there is a silent no-op, while
 * mutating chunk.code in generateBundle IS written to disk), so generateBundle
 * is the only working hook here. Trade-off: when sourcemaps are enabled (off
 * by default in WXT builds) map columns drift on lines that contain non-ASCII,
 * since a 1-char source becomes a 6-char escape and the map is not recomposed.
 * Revisit once rolldown honors renderChunk or ships native ascii output.
 *
 * Code-unit based on purpose: a surrogate pair is escaped as its two `\uXXXX`
 * units, which the JS engine recombines correctly (do NOT add the regex `u`
 * flag, which would hand the callback a full code point and break the high
 * half). `\uXXXX` is valid in every context a non-ASCII char can legally
 * appear (string, template, regex, identifier). The one case it changes
 * runtime behavior is a `String.raw` tagged template holding literal
 * non-ASCII (its raw string would gain the escaped form), which is
 * vanishingly rare in bundled output.
 *
 * Scope is JS chunks only: CSS uses different escape syntax and Chrome
 * tolerates it, while JSON / _locales are UTF-8 by spec and are not run
 * through Chrome's script UTF-8 check.
 */
import type { PluginOption } from 'vite';

// Match the high range positively (every code unit >= 0x80) rather than
// negating the ASCII range: equivalent for escaping, but keeps control chars
// out of the pattern (no-control-regex) and leaves newlines/tabs untouched.
// Two regexes on purpose: a global one for replacement, and a flagless one for
// the fast-path test (a /g regex would carry lastIndex state across chunks).
const NON_ASCII_G = /[\u0080-\uffff]/g;
const HAS_NON_ASCII = /[\u0080-\uffff]/;

// Exported for unit testing (see to-utf8.test.ts); the plugin itself uses it internally.
export function escapeNonAscii(code: string): string {
  return code.replace(NON_ASCII_G, (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'));
}

export default function toUtf8(): PluginOption {
  return {
    name: 'to-utf8',
    generateBundle(_options, bundle) {
      for (const fileName in bundle) {
        const asset = bundle[fileName];
        if (asset.type === 'chunk' && HAS_NON_ASCII.test(asset.code)) {
          asset.code = escapeNonAscii(asset.code);
        }
      }
    },
  };
}
