// Single source of truth for the project namespace prefix.
//
// Plain CommonJS on purpose: the prefix is needed by tooling that runs OUTSIDE
// the TS build and cannot import the `src` tree — PostCSS config (postcss.config.cjs)
// and the CSS audit script (scripts/audit-css-vars.mjs) — as well as by the TS
// source itself (src/constants re-exports this). Keeping it here lets all of
// them read the exact same literal, so changing the prefix is a one-line edit.
//
// The ONE place that still mirrors this by hand is global.css (CSS can't import).
// A test in src/constants/index.test.ts fails loudly if that mirror ever drifts.
exports.PROJECT_PREFIX = 'aie-omt';
