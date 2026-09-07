/** Real Chromium extension regressions with a local OpenAI-compatible test endpoint.
 * Run from the repository root after building:
 * CORE_CHROME_BIN=/path/to/chrome node scripts/review/core-browser.mjs
 * Uses only an isolated temporary browser profile; artifacts go to .cache/core-review.
 */
import { spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import http from 'node:http';
import { connect, page } from '../store/cdp.mjs';

const chromeBin = process.env.CORE_CHROME_BIN;
if (!chromeBin) throw new Error('Set CORE_CHROME_BIN to a Chrome for Testing executable.');

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const requests = [];
let holdNotes = false;
const heldNotes = [];
let responseDelay = 500;
const server = http.createServer(async (req, res) => {
  if (req.method === 'POST') {
    let raw = '';
    for await (const c of req) raw += c;
    const b = JSON.parse(raw);
    requests.push(b);
    if (b.temperature === 0.234) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          error: { message: 'Unsupported parameter: temperature', type: 'invalid_request_error', param: 'temperature' },
        })
      );
      return;
    }
    const text = b.messages?.at(-1)?.content || '';
    if (holdNotes && /annotator|lexicographer/.test(b.messages?.[0]?.content || ''))
      await new Promise((r) => heldNotes.push(r));
    await delay(responseDelay);
    const content = /\[\[[a-f0-9]+#\d+\]\]/.test(text)
      ? text.replace(/(\[\[[a-f0-9]+#\d+\]\])/g, '$1译文：')
      : 'Translated result [' + b.model + '] ' + text;
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (b.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.end(
        'data: ' +
          JSON.stringify({
            id: 'test',
            object: 'chat.completion.chunk',
            created: 1,
            model: b.model,
            choices: [{ index: 0, delta: { content }, finish_reason: null }],
          }) +
          '\n\ndata: ' +
          JSON.stringify({
            id: 'test',
            object: 'chat.completion.chunk',
            created: 1,
            model: b.model,
            choices: [{ index: 0, delta: {}, finish_reason: 'stop' }],
          }) +
          '\n\ndata: [DONE]\n\n'
      );
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.end(
        JSON.stringify({
          id: 'test',
          object: 'chat.completion',
          created: 1,
          model: b.model,
          choices: [{ index: 0, message: { role: 'assistant', content }, finish_reason: 'stop' }],
          usage: { prompt_tokens: 1, completion_tokens: 1, total_tokens: 2 },
        })
      );
    }
    return;
  }
  res.setHeader('Content-Type', 'text/html');
  res.end(
    '<!doctype html><title>Browser regression</title><style>body{font:20px sans-serif;padding:50px}textarea,div[contenteditable]{display:block;border:1px solid;width:650px;height:100px;margin:25px}</style><p id="source">This passage contains <strong>important additional words</strong> for testing translation changes.</p><p id="second">A second passage explains how readers select a different sentence.</p><textarea id="input">Original draft</textarea><div id="editor" contenteditable="true">Original editable draft</div>'
  );
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
await mkdir('.cache/core-review', { recursive: true });
const profile = process.cwd() + '/.cache/core-review/profile-' + Date.now();
await mkdir(profile, { recursive: true });
const chrome = spawn(
  chromeBin,
  [
    '--no-sandbox',
    '--enable-automation',
    '--remote-debugging-port=0',
    '--user-data-dir=' + profile,
    '--no-first-run',
    '--no-default-browser-check',
    '--load-extension=' + (process.env.CORE_EXTENSION_DIR || process.cwd() + '/.output/chrome-mv3'),
    'about:blank',
  ],
  { env: { ...process.env, DISPLAY: process.env.DISPLAY || ':99' }, stdio: 'ignore' }
);
let client;
try {
  let debug;
  for (let i = 0; i < 80; i++) {
    debug = Number((await readFile(profile + '/DevToolsActivePort', 'utf8').catch(() => '')).split('\n')[0]);
    if (debug) break;
    await delay(200);
  }
  client = await connect(
    (await (await fetch('http://127.0.0.1:' + debug + '/json/version')).json()).webSocketDebuggerUrl
  );
  let sw;
  for (let i = 0; i < 50; i++) {
    for (const t of (await client.call('Target.getTargets')).targetInfos.filter((t) => t.type === 'service_worker')) {
      const { sessionId } = await client.call('Target.attachToTarget', { targetId: t.targetId, flatten: true });
      const r = await client.call(
        'Runtime.evaluate',
        { expression: 'chrome.runtime.getManifest().name', returnByValue: true },
        sessionId
      );
      await client.call('Target.detachFromTarget', { sessionId });
      if (r.result.value === 'Interline · 行间') sw = t;
    }
    if (sw) break;
    await delay(200);
  }
  const id = new URL(sw.url).hostname;
  const options = await page(
    client,
    (await client.call('Target.createTarget', { url: 'chrome-extension://' + id + '/options.html' })).targetId
  );
  await delay(2000);
  let config = {
    version: 4,
    language: { ui: 'en' },
    providers: [
      {
        id: 'review',
        kind: 'openai-compatible',
        label: 'Local test',
        apiKeys: [],
        model: 'review-v1',
        enabled: true,
        baseURL: 'http://127.0.0.1:' + port + '/v1',
      },
    ],
    translate: {
      defaultProviderId: 'review',
      source: 'auto',
      target: 'zh-CN',
      skipLanguages: [],
      richText: true,
      pageContext: false,
    },
    prompt: { styles: [], siteRules: [] },
    glossary: [],
    inputTranslation: { enabled: true, triggerCount: 3, target: 'en' },
    siteControl: { defaultMode: 'auto', rules: [] },
    appearance: {
      colorScheme: 'light',
      bilingualStyle: 'blend',
      translationFont: 'inherit',
      displayMode: 'bilingual',
      paragraphInterleave: true,
    },
  };
  const save = async () => {
    await options.evaluate('chrome.storage.local.set(' + JSON.stringify({ 'aie-omt:config': config }) + ')');
    await delay(400);
  };
  await save();
  const tab = await page(client, (await client.call('Target.createTarget', { url: 'about:blank' })).targetId);
  await tab.call('Page.navigate', { url: 'http://127.0.0.1:' + port + '/fixture' });
  await delay(3000);
  const shadow = "document.querySelector('aie-omt-surface')?.shadowRoot";
  const select = async (id) => {
    await tab.evaluate(
      `(()=>{const r=document.createRange();r.selectNodeContents(document.getElementById('${id}'));getSelection().removeAllRanges();getSelection().addRange(r);document.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,clientX:100,clientY:110}));})()`
    );
    await delay(150);
  };
  const spaces = async (id, count = 3) => {
    await tab.evaluate(
      `(()=>{const e=document.getElementById('${id}');e.focus();if(e.setSelectionRange)e.setSelectionRange(e.value.length,e.value.length);else{const r=document.createRange();r.selectNodeContents(e);r.collapse(false);getSelection().removeAllRanges();getSelection().addRange(r);}})()`
    );
    for (let i = 0; i < count; i++) {
      await tab.call('Input.dispatchKeyEvent', {
        type: 'keyDown',
        key: ' ',
        code: 'Space',
        windowsVirtualKeyCode: 32,
        text: ' ',
      });
      await tab.call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    }
  };
  const results = [];
  await spaces('input');
  await delay(1200);
  results.push({
    test: 'input baseline',
    pass:
      requests.length === 1 &&
      (await tab.evaluate('document.querySelector("#input").value.startsWith("Translated result")')),
    value: await tab.evaluate('document.querySelector("#input").value'),
    requests: requests.length,
  });
  // Edit while the DOM fallback is waiting for the editor's selection synchronization.
  await spaces('editor');
  let selected = false;
  for (let i = 0; i < 200; i++) {
    selected = await tab.evaluate("getSelection().toString().includes('Original editable draft')");
    if (selected) break;
    await delay(10);
  }
  if (selected) await tab.call('Input.insertText', { text: 'USER LATEST DRAFT' });
  await delay(500);
  results.push({
    test: 'contenteditable write race',
    reached: selected,
    pass: await tab.evaluate("document.querySelector('#editor').innerText==='USER LATEST DRAFT'"),
  });
  // A stopped feature must leave its already-running translation unapplied.
  responseDelay = 1600;
  await tab.evaluate('document.querySelector("#input").value="Pending disabled draft"');
  await spaces('input');
  await delay(100);
  config.inputTranslation.enabled = false;
  await save();
  await delay(1800);
  results.push({
    test: 'disable pending input',
    pass: await tab.evaluate('document.querySelector("#input").value.trim()==="Pending disabled draft"'),
  });
  responseDelay = 500;
  config.inputTranslation.enabled = false;
  await save();
  await tab.evaluate('document.querySelector("#input").value="Disabled draft"');
  let n = requests.length;
  await spaces('input');
  await delay(1100);
  results.push({
    test: 'disable input live',
    pass: requests.length === n,
    value: await tab.evaluate('document.querySelector("#input").value'),
  });
  config.inputTranslation = { enabled: true, target: 'fr', triggerCount: 2 };
  await save();
  await tab.evaluate('document.querySelector("#input").value="New live target draft"');
  const beforeLive = requests.length;
  await spaces('input', 2);
  await delay(1100);
  results.push({
    test: 'live input target and trigger count',
    pass: requests.length === beforeLive + 1 && /French/.test(requests.at(-1)?.messages?.[0]?.content || ''),
  });
  // Notes from an old selection must not lock the next selection's notes.
  const clickPill = () => tab.evaluate(shadow + "?.querySelector('[data-testid=omni-selection-pill]')?.click()");
  const clickNotes = () =>
    tab.evaluate(
      '[...(' + shadow + "?.querySelectorAll('button')||[])].find(b=>b.textContent.includes('Notes'))?.click()"
    );
  holdNotes = true;
  await select('source');
  await clickPill();
  await delay(1000);
  await clickNotes();
  await delay(250);
  const hadHeld = heldNotes.length;
  await select('second');
  await clickPill();
  await delay(1000);
  holdNotes = false;
  heldNotes.forEach((r) => r());
  await delay(800);
  const beforeNotes = requests.length;
  await clickNotes();
  await delay(800);
  results.push({ test: 'notes after changed selection', reached: hadHeld > 0, pass: requests.length > beforeNotes });
  // Source removal must invalidate the paragraph's existing translation.
  await tab.evaluate(
    "document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}));getSelection().removeAllRanges()"
  );
  await tab.evaluate(shadow + "?.querySelector('button[aria-pressed]')?.focus()");
  await delay(200);
  await tab.evaluate(shadow + "?.querySelector('button[aria-pressed]')?.click()");
  await delay(2200);
  for (let i = 0; i < 60; i++) {
    if (await tab.evaluate("document.querySelectorAll('[data-omni-translated][data-omni-state=done]').length>0")) break;
    await delay(100);
  }
  const priorPage = requests.length;
  const glossBefore = await tab.evaluate("document.querySelectorAll('[data-omni-translated]').length");
  await tab.evaluate("document.querySelector('#source strong').remove()");
  await delay(1600);
  results.push({
    test: 'removed inline source refreshes page',
    reached: glossBefore > 0,
    pass: requests.length > priorPage,
  });
  config.siteControl.defaultMode = 'never';
  await save();
  await select('source');
  results.push({
    test: 'never selection',
    pass: !(await tab.evaluate('!!' + shadow + "?.querySelector('[data-testid=omni-selection-pill]')")),
  });
  const rpc = (method, arg) =>
    options.evaluate(
      'chrome.runtime.sendMessage(' +
        JSON.stringify({
          id: Math.floor(Math.random() * 100000),
          type: 'proxy-service.TranslationService',
          timestamp: Date.now(),
          data: { path: [method], args: [arg] },
        }) +
        ')'
    );
  const validation = await rpc('validateProvider', { ...config.providers[0], params: { temperature: 0.234 } });
  results.push({
    test: 'validation rejects unsupported configured parameter',
    pass: validation?.res?.ok === false,
    response: validation,
  });
  responseDelay = 1800;
  const beforeJobs = requests.length;
  const first = rpc('translate', { text: 'Unique concurrent configuration draft', source: 'en', target: 'zh-CN' });
  await delay(250);
  config.providers[0].model = 'review-v2';
  await save();
  const second = rpc('translate', { text: 'Unique concurrent configuration draft', source: 'en', target: 'zh-CN' });
  const jobs = await Promise.all([first, second]);
  results.push({
    test: 'different model does not reuse pending job',
    pass: requests.length - beforeJobs === 2 && jobs[1]?.res?.text.includes('review-v2'),
    responses: jobs,
  });
  await tab
    .call('Page.captureScreenshot', { format: 'png' })
    .then((r) =>
      writeFile('.cache/core-review/' + (process.env.PHASE || 'after') + '.png', Buffer.from(r.data, 'base64'))
    );
  console.log(JSON.stringify(results, null, 2));
  await writeFile(
    '.cache/core-review/' + (process.env.PHASE || 'after') + '-requests.json',
    JSON.stringify(requests, null, 2)
  );
  await writeFile('.cache/core-review/' + (process.env.PHASE || 'after') + '.json', JSON.stringify(results, null, 2));
  if (!process.env.CORE_EXPECT_FAILURES && results.some((r) => r.pass !== true || r.reached === false))
    throw new Error('Browser regression failed; inspect the JSON report.');
} finally {
  heldNotes.forEach((r) => r());
  if (client) {
    await client.call('Browser.close').catch(() => {});
    client.close();
  }
  chrome.kill();
  server.close();
  if (chrome.exitCode === null)
    await Promise.race([new Promise((resolve) => chrome.once('exit', resolve)), delay(3000)]);
  await rm(profile, { recursive: true, force: true });
}
