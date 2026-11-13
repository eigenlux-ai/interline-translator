// Every sheet in surface-css/ is the audit copy of CSS that inline-surface-css
// embedded in the content script of the same name: it must match the JS
// byte for byte and must never be loaded by the manifest or the host page.
// Sheets in content-scripts/ belong to entries using WXT's normal CSS
// injection and are not checked here.
import assert from 'node:assert/strict';
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const directory = process.argv[2];
assert(directory, 'Usage: node scripts/check-inline-surface-css.mjs <build-directory>');
const manifest = JSON.parse(await readFile(join(directory, 'manifest.json'), 'utf8'));
const sheets = (await readdir(join(directory, 'surface-css')).catch(() => [])).filter((file) => file.endsWith('.css'));
assert(sheets.length > 0, 'No surface-css/*.css found; expected one audited sheet per surface content script.');

const normalize = (path) => path.replace(/^\.?\//, '');
const injected = (manifest.content_scripts ?? []).flatMap((entry) => (entry.css ?? []).map(normalize));
const exposed = (manifest.web_accessible_resources ?? [])
  .flatMap((entry) => (typeof entry === 'string' ? [entry] : entry.resources))
  .map((resource) => new RegExp('^' + normalize(resource).split('*').map(escapeRegex).join('.*') + '$'));

for (const sheet of sheets) {
  const cssPath = `surface-css/${sheet}`;
  const jsPath = `content-scripts/${sheet.replace(/\.css$/, '.js')}`;
  const css = await readFile(join(directory, cssPath), 'utf8');
  const js = await readFile(join(directory, jsPath), 'utf8').catch(() => assert.fail(`${cssPath} has no ${jsPath}.`));
  const literal = JSON.stringify(css).replace(
    /[\u0080-\uffff]/g,
    (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')
  );
  assert(js.includes(literal), `${cssPath} must be embedded verbatim in ${jsPath} (import virtual:surface-css).`);
  assert(!/@property\b/.test(css), `${cssPath} still contains @property rules (they should have been dropped).`);
  if (/@font-face\b/.test(css))
    console.warn(`warning: ${cssPath} declares @font-face, which is ignored in shadow roots.`);
  // The embedded entry must not also ship its CSS the normal way.
  const injectedPath = jsPath.replace(/\.js$/, '.css');
  const shipped = await stat(join(directory, injectedPath)).then(
    () => true,
    () => false
  );
  assert(!shipped, `${injectedPath} exists; its CSS is embedded and must not also be emitted.`);
  assert(!injected.includes(injectedPath), `${injectedPath} must not be injected into the host by the manifest.`);
  assert(!exposed.some((pattern) => pattern.test(injectedPath)), `${injectedPath} must not be web-accessible.`);
}
const scripts = (await readdir(join(directory, 'content-scripts'))).filter((file) => file.endsWith('.js'));
for (const file of scripts) {
  const js = await readFile(join(directory, 'content-scripts', file), 'utf8');
  assert(!js.includes('__AIE_BUNDLED_SURFACE_CSS_'), `Unresolved surface CSS placeholder in content-scripts/${file}.`);
}
console.log(
  `audit:surface OK — ${sheets.length} surface sheet(s) embedded; no manifest CSS injection or public CSS resource.`
);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
