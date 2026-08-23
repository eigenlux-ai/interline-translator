// ai-sdk-leak detector for content scripts (NOT a strict size gate — modern
// browsers don't cap extension size; this only guards the architecture).
//
// The eslint import boundary forbids content/UI from importing ai-sdk/dexie or a
// service impl, but lint can be silenced with a disable comment. This assertion
// is the backstop: ai-sdk (~149KB gzip) leaking into a content script — which
// would mean the contract/impl split broke — pushes it well past these
// (deliberately generous) per-file gzip budgets:
//   - lean scripts (host translation / pure DOM)  → 100KB   (currently ~30KB)
//   - Mantine-UI scripts (float-ui layer, …)      → 260KB   (currently ~158KB)
// Both leave ample room for normal growth while still tripping on a full ai-sdk
// leak (lean 30→179, ui 158→307).
//
// Usage: node scripts/check-content-bundle-size.mjs [outputDir] [leanKB] [uiKB]
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import { gzipSync } from 'node:zlib';

const outDir = process.argv[2] ?? '.output/chrome-mv3';
const leanKB = Number(process.argv[3] ?? 100);
const uiKB = Number(process.argv[4] ?? 260);

// Content scripts that legitimately bundle the Mantine/React UI (shadow surfaces).
const UI_SCRIPTS = ['float-ui'];

const contentDir = join(outDir, 'content-scripts');

function collectJs(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) out.push(...collectJs(full));
    else if (name.endsWith('.js')) out.push(full);
  }
  return out;
}

const files = collectJs(contentDir);
if (files.length === 0) {
  console.error(`check-content-bundle-size — no content-script JS under ${contentDir}. Did you run \`pnpm build\` first?`);
  process.exit(1);
}

const isUi = (f) => UI_SCRIPTS.some((u) => basename(f).includes(u));

let ok = true;
console.log('=== content-script bundles (gzip) ===');
for (const f of files) {
  const gzKB = gzipSync(readFileSync(f)).length / 1024;
  const budget = isUi(f) ? uiKB : leanKB;
  const within = gzKB <= budget;
  ok = ok && within;
  console.log(`  ${within ? '✅' : '❌'} ${gzKB.toFixed(1)}KB / ${budget}KB ${isUi(f) ? '(ui)  ' : '(lean)'}  ${basename(f)}`);
}

console.log(
  ok
    ? '\n✅ every content script within budget (no heavy engine leak).'
    : '\n❌ a content script is OVER budget — likely ai-sdk/dexie leaked past the contract boundary.',
);
process.exit(ok ? 0 : 1);
