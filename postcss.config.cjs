// Single source of truth for the prefix, shared with src/constants (which
// re-exports it) and scripts/audit-css-vars.mjs.
const { PROJECT_PREFIX } = require('./prefix.cjs');

module.exports = {
  plugins: {
    'postcss-preset-mantine': {},
    'postcss-simple-vars': {
      variables: {
        'mantine-breakpoint-xs': '36em',
        'mantine-breakpoint-sm': '48em',
        'mantine-breakpoint-md': '62em',
        'mantine-breakpoint-lg': '75em',
        'mantine-breakpoint-xl': '88em',
      },
    },
    // Tailwind registers its internal `--tw-*` custom properties via `@property`,
    // which is DOCUMENT-GLOBAL even when the stylesheet lives inside a shadow root.
    // On host pages that also use Tailwind this collides with their `--tw-*`
    // variables (bidirectional pollution). Renaming the variables namespaces them;
    // utility CLASS NAMES are untouched (selectors never leak out of shadow DOM).
    //
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
    // these layered values.
    //
    // NOTE: we deliberately do NOT rewrite Tailwind's `@layer properties`
    // fallback selector (`*, ::before, ::after, ::backdrop`). It sets `--<prefix>-tw-*`
    // initial values per-element for browsers WITHOUT @property; rewriting it to
    // `:root` makes it inert inside a shadow root (`:root` matches nothing
    // there), breaking those transient vars on ancient browsers. `*` is shadow-
    // scoped (no host leak) and correct. On modern browsers the @property
    // registrations supply the initial values regardless, so this block is moot.
    'postcss-replace': {
      pattern: /(--tw-|:root,:host)/g,
      data: {
        '--tw-': `--${PROJECT_PREFIX}-tw-`,
        ':root,:host': `:root,:host,.${PROJECT_PREFIX}-surface-root`,
      },
    },
  },
};
