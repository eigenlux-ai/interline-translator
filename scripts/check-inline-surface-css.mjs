import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const directory = process.argv[2];
assert(directory, 'Usage: node scripts/check-inline-surface-css.mjs <build-directory>');
for (const entryName of ['float-ui', 'youtube-embed']) {
  const cssPath = `content-scripts/${entryName}.css`;
  const [css, js, manifestText] = await Promise.all([
    readFile(join(directory, cssPath), 'utf8'),
    readFile(join(directory, `content-scripts/${entryName}.js`), 'utf8'),
    readFile(join(directory, 'manifest.json'), 'utf8'),
  ]);
  const literal = JSON.stringify(css).replace(
    /[\u0080-\uffff]/g,
    (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0')
  );
  assert(js.includes(literal), 'The audited CSS must be embedded verbatim in the content script.');
  assert(!js.includes('__AIE_BUNDLED_SURFACE_CSS_'), 'Unresolved surface CSS placeholder.');
  const manifest = JSON.parse(manifestText);
  assert(
    !(manifest.content_scripts ?? []).some((entry) => entry.css?.includes(cssPath)),
    'Surface CSS must not be injected into the host document.'
  );
  for (const entry of manifest.web_accessible_resources ?? []) {
    const resources = typeof entry === 'string' ? [entry] : entry.resources;
    assert(
      !resources.some((resource) =>
        new RegExp('^' + resource.split('*').map(escapeRegex).join('.*') + '$').test(cssPath)
      ),
      'The embedded surface CSS does not need web-accessible resource exposure.'
    );
  }
}
console.log('audit:surface OK — complete audited CSS embedded; no manifest CSS injection or public CSS resource.');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
