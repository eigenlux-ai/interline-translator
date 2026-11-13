// Single source of truth for the prefix, shared with src/constants (which
// re-exports it) and scripts/audit-css-vars.mjs.
const { PROJECT_PREFIX } = require('./prefix.cjs');

const SURFACE_ROOT = `.${PROJECT_PREFIX}-surface-root`;

// `:root, :host` → `:root, :host, .<prefix>-surface-root`. Tailwind's theme
// vars (`--color-*`, `--spacing`, …) and Mantine's layer vars are emitted on
// `:root, :host`. `:host` re-anchors them on the shadow host, which defeats
// INHERITED host-page values (host uses the same lib) — but NOT an outer rule
// that explicitly matches the host element (`<prefix>-surface{…}` / `*{…}`),
// because per CSS scoping such outer rules beat `:host`. Re-anchoring onto
// `.<prefix>-surface-root` — a node INSIDE the shadow, unreachable by any
// outer selector — closes that gap so the whole theme-var layer shares the
// same hard-isolation guarantee as our Mantine/z/spacing vars. Inert in
// document surfaces (no such element; `:root` still applies). rem-
// compensation overrides in global.css are unlayered and still win over
// these layered values. Matched on the parsed selector list, so dev output
// (`:root, :host`) and minified output (`:root,:host`) are treated alike.
const anchorSurfaceRoot = {
  postcssPlugin: 'anchor-surface-root',
  Rule(rule) {
    const selectors = rule.selectors.map((selector) => selector.trim());
    if (selectors.includes(':root') && selectors.includes(':host') && !selectors.includes(SURFACE_ROOT)) {
      rule.selectors = [...rule.selectors, SURFACE_ROOT];
    }
  },
};

module.exports = {
  plugins: [
    require('postcss-preset-mantine')(),
    require('postcss-simple-vars')({
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    }),
    // Custom properties inherit into shadow trees, so a host page's own
    // Tailwind `--tw-*` values would reach our utilities; in document surfaces
    // Tailwind's `@property` registrations are also document-global. Renaming
    // the variables to `--<prefix>-tw-*` namespaces them; utility CLASS NAMES
    // are untouched (selectors never leak out of shadow DOM).
    //
    // NOTE: we deliberately do NOT rewrite Tailwind's `@layer properties`
    // fallback selector (`*, ::before, ::after, ::backdrop`): `:root` matches
    // nothing inside a shadow root, while `*` is shadow-scoped and correct. For
    // the shadow content entry, vite-plugins/inline-surface-css drops the
    // @property rules (ignored inside shadow roots) and removes this block's
    // @supports gate, so the fallback supplies the initial values there.
    require('postcss-replace')({
      pattern: /(--tw-)/g,
      data: { '--tw-': `--${PROJECT_PREFIX}-tw-` },
    }),
    anchorSurfaceRoot,
  ],
};
