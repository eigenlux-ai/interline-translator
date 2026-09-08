/** Real Chromium main-thread/frame-gap probe with a local translation endpoint.
 * Run from the repository root after building:
 * CORE_CHROME_BIN=/path/to/chrome node scripts/review/performance-browser.mjs
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
const heldResponses = [];
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
      await new Promise((r) => {
        heldNotes.push(r);
        heldResponses.push(res);
      });
    await delay(responseDelay);
    const content = /\[\[[a-f0-9]+#\d+\]\]/.test(text)
      ? text.replace(/(\[\[[a-f0-9]+#\d+\]\])/g, '$1译文：')
      : 'Translated result [' + b.model + '] ' + text;
    res.setHeader('Access-Control-Allow-Origin', '*');
    if (b.stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      if (process.env.PERF_STREAM === '1') {
        for (let i = 0; i < content.length && !res.destroyed; i += 24) {
          res.write(
            'data: ' +
              JSON.stringify({
                id: 'test',
                object: 'chat.completion.chunk',
                created: 1,
                model: b.model,
                choices: [{ index: 0, delta: { content: content.slice(i, i + 24) }, finish_reason: null }],
              }) +
              '\n\n'
          );
          await delay(16);
        }
        res.end(
          'data: ' +
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
      }
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
  const results = [];
  await tab.evaluate(`(()=>{
    const main=document.createElement('main');main.id='stress';
    main.innerHTML=Array.from({length:2500},(_,i)=>'<article><h3>Section '+i+'</h3><p>This paragraph explains <strong>important details</strong> about software performance and interactive reading number '+i+'.</p></article>').join('');
    document.body.prepend(main);
  })()`);
  await delay(1000);
  await tab.call('Performance.enable');
  const metrics = async () =>
    Object.fromEntries((await tab.call('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]));
  await tab.evaluate(`(()=>{window.perfLong=[];window.perfGaps=[];window.perfStop=false;
    new PerformanceObserver(l=>window.perfLong.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask'});
    let last=performance.now();function frame(t){if(window.perfStop)return;window.perfGaps.push(t-last);last=t;requestAnimationFrame(frame);}requestAnimationFrame(frame);
  })()`);
  await delay(1200);
  results.push({ phase: 'idle-control', ...(await tab.evaluate(`({maxFrameGap:Math.max(...window.perfGaps)})`)) });
  await tab.evaluate(
    `(()=>{window.perfLong=[];window.perfGaps=[];const main=document.querySelector('#stress');for(let i=0;i<400;i++){const p=document.createElement('p');p.className='perf-control';p.textContent='Additional dynamic paragraph '+i+' explains performance under incoming updates.';main.append(p);}})()`
  );
  await delay(2000);
  results.push({
    phase: 'dynamic-without-translation',
    ...(await tab.evaluate(`({maxFrameGap:Math.max(...window.perfGaps)})`)),
  });
  await tab.evaluate("document.querySelectorAll('.perf-control').forEach(e=>e.remove())");
  await delay(1000);
  await tab.evaluate('window.perfLong=[];window.perfGaps=[]');
  const before = await metrics();
  await tab.evaluate(shadow + "?.querySelector('button[aria-pressed]')?.focus()");
  await delay(150);
  await tab.evaluate(shadow + "?.querySelector('button[aria-pressed]')?.click()");
  await delay(6000);
  const after = await metrics();
  results.push({
    phase: 'start',
    ...(await tab.evaluate(
      `({longTasks:window.perfLong,maxFrameGap:Math.max(...window.perfGaps),walked:document.querySelectorAll('[data-omni-walked]').length,translated:document.querySelectorAll('[data-omni-translated]').length})`
    )),
    metrics: Object.fromEntries(
      ['TaskDuration', 'LayoutDuration', 'RecalcStyleDuration', 'LayoutCount', 'RecalcStyleCount'].map((k) => [
        k,
        after[k] - before[k],
      ])
    ),
    requests: requests.length,
  });
  await tab.evaluate(
    `(()=>{window.perfLong=[];window.perfGaps=[];const main=document.querySelector('#stress');for(let i=0;i<400;i++){const p=document.createElement('p');p.textContent='Additional dynamic paragraph '+i+' explains performance under incoming updates.';main.append(p);}})()`
  );
  await delay(4000);
  results.push({
    phase: 'dynamic',
    ...(await tab.evaluate(
      `({longTasks:window.perfLong,maxFrameGap:Math.max(...window.perfGaps),walked:document.querySelectorAll('[data-omni-walked]').length})`
    )),
  });
  const beforeRewrite = await metrics();
  await tab.evaluate(`(()=>{
    window.perfLong=[];window.perfGaps=[];
    document.querySelectorAll('#stress article p').forEach((p,i)=>{
      if(i<1000)p.firstChild.data='Updated paragraph '+i+' explains ';
    });
  })()`);
  await delay(4000);
  const afterRewrite = await metrics();
  results.push({
    phase: 'rewrite-1000',
    ...(await tab.evaluate(
      `({maxFrameGap:Math.max(...window.perfGaps),walked:document.querySelectorAll('[data-omni-walked]').length})`
    )),
    metrics: Object.fromEntries(
      ['TaskDuration', 'LayoutDuration', 'RecalcStyleDuration'].map((k) => [k, afterRewrite[k] - beforeRewrite[k]])
    ),
  });
  await tab.evaluate('window.perfStop=true');
  console.log(JSON.stringify(results, null, 2));
  await writeFile(
    '.cache/core-review/perf-' + (process.env.PHASE || 'after') + '.json',
    JSON.stringify(results, null, 2)
  );
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
