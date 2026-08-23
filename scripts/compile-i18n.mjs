// Compile messages/{locale}.json into src/paraglide (committed, so tsc/eslint/
// vitest/CI never need to run this — re-run via `pnpm i18n` after editing
// messages). Programmatic API instead of the CLI so the options are pinned in
// code:
//  - strategy [globalVariable, baseLocale]: no cookie/url machinery in the
//    runtime — the locale is DRIVEN by our resolver (UI follows
//    translate.target; see src/i18n), pushed in via overwriteGetLocale.
//    baseLocale is the throw-free fallback for code that calls m.*() without
//    src/i18n loaded (unit tests import dom modules directly): zh, the
//    product default.
//  - emitTsDeclarations: typed .d.ts output, so the repo keeps allowJs off.
// The message-format plugin resolves from node_modules (settings.json uses a
// local path, not the CDN URL) — compiles stay offline/hermetic.
import { rmSync } from 'node:fs';
import { compile } from '@inlang/paraglide-js';

await compile({
  project: './project.inlang',
  outdir: './src/paraglide',
  strategy: ['globalVariable', 'baseLocale'],
  emitTsDeclarations: true,
});
// Paraglide emits a self-ignoring src/paraglide/.gitignore (`*`) on every
// compile. Our policy is the opposite — the output is COMMITTED so
// tsc/vitest/CI never depend on this script running — so drop it each time.
rmSync('./src/paraglide/.gitignore', { force: true });
console.log('paraglide: compiled messages -> src/paraglide');
