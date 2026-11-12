/** Run through ego-browser nodejs, passing an owned TaskSpace Page. */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { names } from './artwork.mjs';
import { locales } from './copy.mjs';

export async function composeStoreAssets(page, root) {
  for (const locale of Object.keys(locales)) {
    await mkdir(path.join(root, 'assets/store', locale), { recursive: true });
    for (const [index, name] of names.entries()) {
      await render(page, root, locale, name, 1280, 800, `/artwork?locale=${locale}&index=${index}`);
    }
    for (const [name, width, height, size] of [
      ['promo-small', 440, 280, 'small'],
      ['promo-marquee', 1400, 560, 'marquee'],
    ]) {
      await render(page, root, locale, name, width, height, `/promo?locale=${locale}&size=${size}`);
    }
    console.log(`Composed ${locale}: five screenshots and two promotional images`);
  }
}
async function render(page, root, locale, name, width, height, route) {
  await page.cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await page.goto('http://127.0.0.1:9341' + route);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await page.evaluate(async () => {
    await document.fonts.ready;
    // Promotional canvas only. The product captures embedded inside remain unmodified.
    const clean = () => document.querySelectorAll('aie-surface,aie-omt-surface').forEach((node) => node.remove());
    new MutationObserver(clean).observe(document.documentElement, { childList: true, subtree: true });
    clean();
  });
  await page.screenshot({ path: path.join(root, 'assets/store', locale, name + '.png') });
}

export async function composePreview(page, root) {
  const { readFile } = await import('node:fs/promises');
  let html =
    '<style>*{box-sizing:border-box}body{margin:0;padding:20px;background:#ede7df;font:13px system-ui;color:#5e5045}h2{font-size:14px;margin:0 0 8px;font-weight:500}section{margin-bottom:18px}.row{display:flex;gap:10px}img{width:240px;height:150px;border-radius:5px;box-shadow:0 2px 6px #0001}</style>';
  for (const [locale, label] of Object.entries({ global: 'ENGLISH', zh_CN: '简体中文', ja: '日本語', ko: '한국어' })) {
    html += '<section><h2>' + label + '</h2><div class="row">';
    for (const name of names) {
      const bytes = await readFile(path.join(root, 'assets/store', locale, name + '.png'));
      html += '<img src="data:image/png;base64,' + bytes.toString('base64') + '">';
    }
    html += '</div></section>';
  }
  await page.cdp('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 820,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await page.evaluate((html) => {
    document.documentElement.innerHTML = '<head><meta charset="utf-8"></head><body>' + html + '</body>';
    const clean = () => document.querySelectorAll('aie-surface,aie-omt-surface').forEach((node) => node.remove());
    new MutationObserver(clean).observe(document.documentElement, { childList: true, subtree: true });
    clean();
  }, html);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete && i.naturalWidth > 0));
  await page.screenshot({ path: path.join(root, 'assets/store/preview.png') });
}
