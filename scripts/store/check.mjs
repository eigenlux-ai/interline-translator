// Validate upload dimensions, truecolor PNGs and listing/manifest consistency.
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { locales } from './fixtures.mjs';

const sourceUrl = 'https://github.com/eigenlux-ai/interline-translator';
for (const locale of Object.keys(locales)) {
  const dir = `assets/store/${locale}`;
  const files = await readdir(dir);
  const screenshots = files.filter((name) => /^screenshot-\d-.*\.png$/.test(name));
  assert.equal(screenshots.length, 5, `${locale}: five screenshots required`);
  for (const name of [...screenshots, 'promo-small.png', 'promo-marquee.png']) {
    const png = await readFile(`${dir}/${name}`);
    assert.equal(png.subarray(1, 4).toString(), 'PNG', `${name}: PNG signature`);
    const size = [png.readUInt32BE(16), png.readUInt32BE(20)];
    const expected = name === 'promo-small.png' ? [440, 280] : name === 'promo-marquee.png' ? [1400, 560] : [1280, 800];
    assert.deepEqual(size, expected, `${locale}/${name}: dimensions`);
    assert.equal(png[24], 8, `${name}: eight bits per channel`);
    assert.equal(png[25], 2, `${name}: RGB without alpha`);
  }
  const summary = (await readFile(`${dir}/summary.txt`, 'utf8')).trim();
  assert.ok(summary.length > 0 && summary.length <= 132, `${locale}: summary length`);
  const manifestLocale = locale === 'global' ? 'en' : locale;
  const messages = JSON.parse(await readFile(`public/_locales/${manifestLocale}/messages.json`, 'utf8'));
  assert.equal(summary, messages.extDescription.message, `${locale}: manifest summary must match`);
  const listing = await readFile(`${dir}/listing.txt`, 'utf8');
  for (const term of [sourceUrl, `${sourceUrl}/issues`, `${sourceUrl}/pulls`, 'MIT', 'PRs welcome'])
    assert.ok(listing.includes(term), `${locale}: missing ${term}`);
  assert.ok(listing.length < 16000, `${locale}: description budget`);
  console.log(
    `${locale}: 5 screenshots + 2 promo images; summary ${summary.length}/132; source/Issues/PR links present`
  );
}
const manifest = JSON.parse(await readFile('assets/store/capture-manifest.json', 'utf8'));
assert.equal(manifest.evidence.length, 20, 'capture provenance for all screenshots');
assert.equal(new Set(manifest.evidence.map((e) => e.file)).size, 20, 'unique capture provenance');
console.log('Store assets validated. Visual inspection is still required after regeneration.');
