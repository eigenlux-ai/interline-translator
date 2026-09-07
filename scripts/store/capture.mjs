/** Capture production extension UI through CDP, then compose store artwork.
 * Run against an ISOLATED Chrome for Testing profile; see assets/store/README.md.
 * No user credentials, mock controls, or injected translation results are used.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { connect, page } from './cdp.mjs';
import { locales, sampleHtml } from './fixtures.mjs';
import { promoHtml } from './promo.mjs';

const root = process.cwd();
const rawDir = path.join(root, '.cache/store-capture/raw');
await mkdir(rawDir, { recursive: true });
const port = Number(process.env.STORE_SAMPLE_PORT || 9341);
const host = `http://127.0.0.1:${port}`;
const files = new Map();
const server = createServer((req, res) => {
  const u = new URL(req.url, host);
  if (files.has(u.pathname)) {
    const f = files.get(u.pathname);
    res.setHeader('Content-Type', f.type);
    res.end(f.data);
    return;
  }
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(sampleHtml(u.searchParams.get('locale') || 'zh_CN', u.searchParams.get('mode') || 'article'));
});
await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
const version = await (await fetch(process.env.STORE_CDP_URL || 'http://127.0.0.1:9338/json/version')).json();
const client = await connect(version.webSocketDebuggerUrl);
const created = [];
const evidence = [];
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function until(fn, description, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await fn()) return;
    await delay(150);
  }
  throw new Error(`Timed out: ${description}`);
}
async function open(url, width = 1120, height = 600) {
  const { targetId } = await client.call('Target.createTarget', { url });
  created.push(targetId);
  const p = await page(client, targetId);
  await p.call('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false });
  await until(() => p.evaluate('document.readyState === "complete"'), 'page ready');
  return p;
}
const shadow = "document.querySelector('aie-omt-surface').shadowRoot";
async function ready(p) {
  await until(
    () => p.evaluate(`!!document.querySelector('aie-omt-surface')?.shadowRoot?.querySelector('button[aria-pressed]')`),
    'floating UI'
  );
}
async function shot(p, locale, name) {
  await p.evaluate('document.fonts.ready');
  await delay(350);
  const { data } = await p.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const bytes = Buffer.from(data, 'base64');
  await writeFile(path.join(rawDir, `${locale}-${name}.png`), bytes);
  files.set(`/raw/${locale}-${name}.png`, { type: 'image/png', data: bytes });
  evidence.push({
    locale,
    file: `${locale}/${name}.png`,
    sourceSha256: createHash('sha256').update(bytes).digest('hex'),
  });
}
async function configure(options, l, dark = false) {
  // Change only the fresh capture profile. Reset to the production seeded engine.
  await options.evaluate(
    `(async()=>{const key='aie-omt:config';const data=await chrome.storage.local.get(key);const c=data[key];c.language.ui=${JSON.stringify(l.ui)};c.translate={...c.translate,source:'auto',target:${JSON.stringify(l.target)},defaultProviderId:'google-free',richText:true};c.providers=[{id:'google-free',kind:'google-mt',label:'Google Translate (free)',apiKeys:[],model:'',enabled:true}];c.appearance={...c.appearance,colorScheme:${JSON.stringify(dark ? 'dark' : 'light')},bilingualStyle:'blockquote',translationFont:'inherit',displayMode:'bilingual'};c.inputTranslation={enabled:true,triggerCount:3,target:'en'};await chrome.storage.local.set({[key]:c,'aie-omt:ball-placement':{side:'right',topRatio:0.72}});})()`
  );
  await delay(250);
}
function artwork(l, locale, index, name) {
  const dark = index === 4;
  return `<!doctype html><html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;width:1280px;height:800px;background:${dark ? '#201d18' : '#f2eee6'};color:${dark ? '#f4efe5' : '#2b261f'};font-family:system-ui,-apple-system,sans-serif;overflow:hidden}header{position:absolute;left:80px;right:80px;top:23px;display:flex;align-items:center;justify-content:space-between;font-size:13px;letter-spacing:.3px}.brand{display:flex;align-items:center;gap:9px;font-weight:600}.brand img{width:26px;height:26px}h1{position:absolute;left:80px;top:54px;margin:0;font-size:${locale === 'ko' ? 34 : 36}px;font-weight:600;letter-spacing:-1px}p{position:absolute;left:80px;top:106px;margin:0;font-size:16px;color:${dark ? '#c4b9a6' : '#766957'}}.capture{position:absolute;left:80px;top:155px;width:1120px;height:600px;border-radius:10px;box-shadow:0 8px 30px #201c1518;outline:1px solid ${dark ? '#554b3c' : '#dcd3c4'}}footer{position:absolute;left:80px;right:80px;bottom:14px;display:flex;justify-content:space-between;font-size:12px;color:${dark ? '#d0bfa8' : '#786c5c'}}</style><header><span class="brand"><img src="/icon.png">Interline · 行间</span><span>${l.open}</span></header><h1>${l.labels[index]}</h1><p>${l.details[index]}</p><img class="capture" src="/raw/${locale}-${name}.png"><footer><span>github.com/eigenlux-ai/interline-translator</span><span>Ideas → Issues &nbsp; · &nbsp; PRs welcome &nbsp;&nbsp; ${String(index + 1).padStart(2, '0')} / 05</span></footer></html>`;
}
const names = [
  'screenshot-1-bilingual',
  'screenshot-2-selection',
  'screenshot-3-settings',
  'screenshot-4-input-translation',
  'screenshot-5-dark-mode',
];
try {
  const { targetInfos } = await client.call('Target.getTargets');
  const extensionTarget = targetInfos.find(
    (t) => t.url.startsWith('chrome-extension://') && t.title.includes('Interline')
  );
  const extensionId = process.env.STORE_EXTENSION_ID || (extensionTarget && new URL(extensionTarget.url).hostname);
  if (!extensionId) throw new Error('Set STORE_EXTENSION_ID to the ID in chrome://extensions.');
  const options = await open(`chrome-extension://${extensionId}/options.html`);
  await until(() => options.evaluate('document.querySelectorAll("nav button").length === 6'), 'settings');
  // Persist initial default config if it has only existed as the WXT fallback.
  await options.evaluate(
    `(async()=>{const key='aie-omt:config';if(!(await chrome.storage.local.get(key))[key]){document.querySelectorAll('nav button')[0].click();const input=document.querySelector('input[role="switch"]');if(input){input.click();input.click();}}})()`
  );
  // Read-only fallback extraction from the product's own default when the UI hasn't saved yet.
  await until(
    () => options.evaluate(`chrome.storage.local.get('aie-omt:config').then(x=>!!x['aie-omt:config'])`),
    'saved initial config'
  );
  files.set('/icon.png', { type: 'image/png', data: await readFile('public/icon/128.png') });
  for (const [locale, l] of Object.entries(locales)) {
    if (process.env.STORE_LOCALE && process.env.STORE_LOCALE !== locale) continue;
    await configure(options, l);
    await options.evaluate(`document.querySelectorAll('nav button')[0].click()`);
    await options.evaluate(`document.querySelector('input[value="light"]').click()`);
    const article = await open(`${host}/?locale=${locale}`);
    await ready(article);
    // Keyboard-equivalent activation; focus reveals a tucked launcher first.
    await article.evaluate(`${shadow}.querySelector('button[aria-pressed]').focus()`);
    await delay(200);
    await article.evaluate(`${shadow}.querySelector('button[aria-pressed]').click()`);
    await until(
      () => article.evaluate(`document.querySelectorAll('[data-omni-translated][data-omni-state="done"]').length === 3`),
      `${locale} bilingual translation`,
      60000
    );
    const fits = await article.evaluate(`Array.from(document.querySelectorAll('[data-omni-translated]')).every(e => e.textContent.trim().length > 0 && e.getBoundingClientRect().bottom <= innerHeight - 12)`);
    if (!fits) throw new Error(`${locale}: article is clipped or has an empty translation`);
    await shot(article, locale, names[0]);

    const selection = await open(`${host}/?locale=${locale}&mode=selection`);
    await ready(selection);
    await selection.evaluate(
      `(()=>{const node=document.querySelector('#p0').firstChild;const range=document.createRange();range.setStart(node,0);range.setEnd(node,node.textContent.indexOf('.')+1);const s=window.getSelection();s.removeAllRanges();s.addRange(range);document.dispatchEvent(new MouseEvent('mouseup',{bubbles:true}));})()`
    );
    await until(
      () => selection.evaluate(`!!${shadow}.querySelector('[data-testid="omni-selection-pill"]')`),
      'selection pill'
    );
    await selection.evaluate(`${shadow}.querySelector('[data-testid="omni-selection-pill"]').click()`);
    await until(
      () => selection.evaluate(`!!${shadow}.querySelector('button[aria-label="朗读"]')`),
      'selection translation',
      60000
    );
    await shot(selection, locale, names[1]);

    await options.evaluate(`window.scrollTo(0,0);document.querySelectorAll('nav button')[3].click()`);
    await shot(options, locale, names[2]);

    const input = await open(`${host}/?locale=${locale}&mode=input`);
    await ready(input);
    await input.evaluate('document.querySelector("textarea").focus()');
    await input.call('Input.insertText', { text: l.write });
    for (let i = 0; i < 3; i++) {
      await input.call('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: ' ',
        code: 'Space',
        windowsVirtualKeyCode: 32,
        text: ' ',
      });
      await input.call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    }
    await until(
      () =>
        input.evaluate(
          `(()=>{const v=document.querySelector('textarea').value;return v.trim()!==${JSON.stringify(l.write)} && /thank/i.test(v)})()`
        ),
      'input translation',
      60000
    );
    await shot(input, locale, names[3]);

    await configure(options, l, true);
    await options.evaluate(`document.querySelectorAll('nav button')[0].click()`);
    await options.evaluate(`document.querySelector('input[value="dark"]').click()`);
    await until(
      () => options.evaluate(`document.documentElement.getAttribute('data-mantine-color-scheme') === 'dark'`),
      'dark appearance'
    );
    await options.evaluate(`window.scrollTo(0,0);document.querySelectorAll('nav button')[1].click()`);
    await shot(options, locale, names[4]);
    await mkdir(`assets/store/${locale}`, { recursive: true });
    for (const [i, name] of names.entries()) {
      files.set('/artwork', { type: 'text/html; charset=utf-8', data: artwork(l, locale, i, name) });
      const art = await open(`${host}/artwork`, 1280, 800);
      await until(() => art.evaluate('[...document.images].every(i=>i.complete&&i.naturalWidth>0)'), 'artwork images');
      const { data } = await art.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(`assets/store/${locale}/${name}.png`, Buffer.from(data, 'base64'));
    }
    for (const [name, width, height, marquee] of [
      ['promo-small', 440, 280, false],
      ['promo-marquee', 1400, 560, true],
    ]) {
      files.set('/promo', { type: 'text/html; charset=utf-8', data: promoHtml(l, locale, marquee) });
      const promo = await open(`${host}/promo`, width, height);
      await until(() => promo.evaluate('[...document.images].every(i=>i.complete&&i.naturalWidth>0)'), 'promo images');
      await promo.evaluate('document.fonts.ready');
      const { data } = await promo.call('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
      await writeFile(`assets/store/${locale}/${name}.png`, Buffer.from(data, 'base64'));
    }
    console.log(`Captured and composed ${locale}: five real UI screenshots and two promo images`);
  }
  await writeFile(
    'assets/store/capture-manifest.json',
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        browser: version.Browser,
        extensionVersion: await options.evaluate('chrome.runtime.getManifest().version'),
        viewport: { width: 1120, height: 600, scale: 1 },
        output: { width: 1280, height: 800 },
        translation: 'Live built-in Google Translate (free); original local sample text; no API keys',
        evidence,
      },
      null,
      2
    ) + '\n'
  );
} finally {
  for (const targetId of created) await client.call('Target.closeTarget', { targetId }).catch(() => {});
  client.close();
  server.close();
}
