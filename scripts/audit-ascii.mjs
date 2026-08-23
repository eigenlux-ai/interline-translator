// Build-output guard: assert every emitted JS chunk is pure ASCII to ensure
// reliable script loading across all Chromium versions.
//
// This is a fail-open tripwire: if rolldown ever stops honoring the plugin's
// generateBundle mutation, or the plugin is removed before upstream ships native
// ascii output, the build stays green but the extension breaks for downstream
// users who ship CJK/emoji. Run this after `build` to catch that silently.
//
// Usage: node scripts/audit-ascii.mjs <dist-dir>   (e.g. .output/chrome-mv3)
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: node scripts/audit-ascii.mjs <dist-dir>');
  process.exit(2);
}

function jsFiles(root) {
  const out = [];
  for (const entry of readdirSync(root)) {
    const full = join(root, entry);
    if (statSync(full).isDirectory()) out.push(...jsFiles(full));
    else if (entry.endsWith('.js')) out.push(full);
  }
  return out;
}

const files = jsFiles(dir);
if (files.length === 0) {
  console.error(`no .js files under ${dir} -- did you run \`pnpm build\` first?`);
  process.exit(2);
}

const offenders = [];
for (const file of files) {
  const buf = readFileSync(file);
  let line = 1;
  for (let i = 0; i < buf.length; i++) {
    const b = buf[i];
    if (b === 0x0a) line++;
    else if (b >= 0x80) {
      offenders.push({ file, line, byte: b.toString(16).padStart(2, '0') });
      break; // one report per file is enough to fail the build
    }
  }
}

if (offenders.length > 0) {
  console.error(`audit:ascii FAILED -- non-ASCII bytes in ${offenders.length} built chunk(s):`);
  for (const o of offenders) console.error(`  ${o.file}:${o.line} (first non-ASCII byte 0x${o.byte})`);
  console.error('The to-utf8 plugin should have escaped these. See vite-plugins/to-utf8.ts.');
  process.exit(1);
}

console.log(`audit:ascii OK -- ${files.length} built chunk(s) are pure ASCII.`);
