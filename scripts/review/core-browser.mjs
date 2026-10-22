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
const waitFor = async (check, timeout = 5000) => {
  const deadline = Date.now() + timeout;
  do {
    if (await check()) return true;
    await delay(50);
  } while (Date.now() < deadline);
  return false;
};
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
  if (selected) await tab.call('Input.insertText', { text: 'X' });
  await delay(500);
  results.push({
    test: 'typing during contenteditable replacement preserves the existing draft',
    reached: selected,
    value: await tab.evaluate("document.querySelector('#editor').innerText"),
    pass: await tab.evaluate(
      "document.querySelector('#editor').innerText.includes('Original editable draft') && document.querySelector('#editor').innerText.endsWith('X')"
    ),
  });
  await tab.evaluate("document.querySelector('#editor').textContent='Editable baseline draft'");
  await spaces('editor');
  results.push({
    test: 'contenteditable translation still replaces the draft when editing does not resume',
    pass: await waitFor(() =>
      tab.evaluate("document.querySelector('#editor').innerText.startsWith('Translated result')")
    ),
  });
  await tab.evaluate(`(()=>{
    const editor=document.querySelector('#editor');
    editor.textContent='Async editable draft';
    editor.addEventListener('paste', async (event)=>{
      event.preventDefault();
      const text=event.clipboardData.getData('text/plain');
      await Promise.resolve();
      editor.dispatchEvent(new InputEvent('beforeinput',{bubbles:true,inputType:'insertFromPaste'}));
      const range=getSelection().getRangeAt(0);
      range.deleteContents();range.insertNode(document.createTextNode(text));
    }, {once:true});
  })()`);
  await spaces('editor');
  results.push({
    test: 'asynchronous paste replaces the source instead of appending',
    pass: await waitFor(() =>
      tab.evaluate("document.querySelector('#editor').innerText==='Translated result [review-v1] Async editable draft'")
    ),
    value: await tab.evaluate("document.querySelector('#editor').innerText"),
  });
  await tab.evaluate(`(()=>{
    const editor=document.querySelector('#editor');
    editor.textContent='Command editable draft';
    editor.addEventListener('paste', (event)=>{
      event.preventDefault();
      document.execCommand('insertText',false,event.clipboardData.getData('text/plain'));
    }, {once:true});
  })()`);
  await spaces('editor');
  results.push({
    test: 'paste handlers using native editing commands replace the source',
    pass: await waitFor(() =>
      tab.evaluate(
        "document.querySelector('#editor').innerText==='Translated result [review-v1] Command editable draft'"
      )
    ),
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
  results.push({
    test: 'switching selection cancels silent notes',
    reached: hadHeld > 0,
    pass: heldResponses[0]?.destroyed === true,
  });
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
  await tab.evaluate(
    "document.querySelector('#source').insertAdjacentHTML('beforeend','<em>New important inline clause.</em>')"
  );
  await delay(1500);
  results.push({
    test: 'added inline content retranslates the whole paragraph',
    pass: await tab.evaluate(`(()=>{
    const p=document.querySelector('#source');const glosses=p.querySelectorAll('[data-omni-translated]');
    return glosses.length===1 && !p.querySelector('em [data-omni-translated]') && glosses[0].textContent.includes('New important inline clause.') && glosses[0].textContent.includes('This passage contains');
  })()`),
  });
  await tab.evaluate(`(()=>{
    const source=document.querySelector('#source');
    const hidden=document.createElement('span');
    hidden.id='reveal-source';hidden.hidden=true;hidden.textContent=' Revealed hidden clause.';
    source.append(hidden);
    const code=document.createElement('code');
    code.id='opaque-source';code.textContent='safe_code';
    code.setAttribute('onclick', "document.body.dataset.opaqueClicked='yes'");
    source.append(' ',code);
  })()`);
  const opaqueReady = await waitFor(() =>
    tab.evaluate("!!document.querySelector('#source [data-omni-translated][data-omni-state=done] code')")
  );
  results.push({
    test: 'opaque inline formatting preserves text without cloning identity or handlers',
    reached: opaqueReady,
    pass: await tab.evaluate(`(()=>{
      const code=document.querySelector('#source [data-omni-translated] code');
      if(!code)return false;code.click();
      return code.textContent==='safe_code' && !code.hasAttribute('id') && !code.hasAttribute('onclick') &&
        document.querySelectorAll('#opaque-source').length===1 && !document.body.dataset.opaqueClicked;
    })()`),
  });
  await tab.evaluate("document.querySelector('#reveal-source').hidden=false");
  results.push({
    test: 'revealing inline source updates its existing paragraph translation',
    pass: await waitFor(() =>
      tab.evaluate(`(()=>{
      const source=document.querySelector('#source');
      const glosses=source.querySelectorAll('[data-omni-translated]');
      return glosses.length===1 && glosses[0].dataset.omniState==='done' &&
        glosses[0].textContent.includes('Revealed hidden clause.') &&
        !source.querySelector('#reveal-source [data-omni-translated]');
    })()`)
    ),
  });
  await tab.evaluate("document.querySelector('#reveal-source').hidden=true");
  results.push({
    test: 'hiding inline source removes its stale translation',
    pass: await waitFor(() =>
      tab.evaluate(`(()=>{
      const gloss=document.querySelector('#source [data-omni-translated][data-omni-state=done]');
      return !!gloss && !gloss.textContent.includes('Revealed hidden clause.') &&
        gloss.textContent.includes('This passage contains');
    })()`)
    ),
  });
  await tab.evaluate(`(()=>{
    const source=document.querySelector('#source');
    const wrapper=document.createElement('section');
    wrapper.id='visibility-wrapper';wrapper.className='compact';
    source.before(wrapper);wrapper.append(source);
    const style=document.createElement('style');
    style.textContent='#visibility-wrapper.compact .ancestor-extra{display:none}';
    document.head.append(style);
    const extra=document.createElement('span');
    extra.className='ancestor-extra';extra.textContent=' Ancestor-controlled detail.';
    source.append(extra);
  })()`);
  await delay(300);
  await tab.evaluate("document.querySelector('#visibility-wrapper').classList.remove('compact')");
  results.push({
    test: 'ancestor CSS reveal refreshes already translated descendant units',
    pass: await waitFor(() =>
      tab.evaluate(`(()=>{
      const glosses=document.querySelectorAll('#source [data-omni-translated]');
      return glosses.length===1 && glosses[0].dataset.omniState==='done' &&
        glosses[0].textContent.includes('Ancestor-controlled detail.');
    })()`)
    ),
  });
  await tab.evaluate("document.querySelector('#visibility-wrapper').classList.add('compact')");
  results.push({
    test: 'ancestor CSS hide removes stale descendant translation text',
    pass: await waitFor(() =>
      tab.evaluate(`(()=>{
      const gloss=document.querySelector('#source [data-omni-translated][data-omni-state=done]');
      return !!gloss && !gloss.textContent.includes('Ancestor-controlled detail.') &&
        gloss.textContent.includes('This passage contains');
    })()`)
    ),
  });
  await tab.evaluate(`(()=>{
    const source=document.createElement('p');source.id='clipped-source';
    source.style.cssText='overflow:hidden;max-height:100px';
    source.textContent='This clipped paragraph has enough visible source text to require a separate translation sibling.';
    document.body.prepend(source);
  })()`);
  const clippedReady = await waitFor(() =>
    tab.evaluate(`(()=>{
    const source=document.querySelector('#clipped-source');
    return source.nextElementSibling?.matches('[data-omni-translated][data-omni-state=done]')===true;
  })()`)
  );
  await tab.evaluate("document.querySelector('#clipped-source').hidden=true");
  results.push({
    test: 'hiding a clipped source removes its external translation sibling',
    reached: clippedReady,
    pass: await waitFor(() =>
      tab.evaluate(`(()=>{
      const source=document.querySelector('#clipped-source');
      return !source.hasAttribute('data-omni-walked') &&
        !source.nextElementSibling?.matches('[data-omni-translated]');
    })()`)
    ),
  });
  await tab.evaluate("document.querySelector('#clipped-source').hidden=false");
  results.push({
    test: 'revealing a clipped source restores one translation sibling',
    pass: await waitFor(() =>
      tab.evaluate(`(()=>{
      const source=document.querySelector('#clipped-source');
      const gloss=source.nextElementSibling;
      return gloss?.matches('[data-omni-translated][data-omni-state=done]')===true &&
        gloss.textContent.includes('This clipped paragraph') &&
        !gloss.nextElementSibling?.matches('[data-omni-translated]');
    })()`)
    ),
  });
  config.siteControl.defaultMode = 'never';
  await save();
  await select('source');
  results.push({
    test: 'never selection',
    pass: !(await tab.evaluate('!!' + shadow + "?.querySelector('[data-testid=omni-selection-pill]')")),
  });
  const beforeDisabledPage = requests.length;
  await tab.evaluate(
    "document.body.insertAdjacentHTML('beforeend','<p id=late>New content after this site was disabled must stay untranslated.</p>')"
  );
  await delay(1700);
  results.push({
    test: 'never stops an already active page translator',
    pass:
      requests.length === beforeDisabledPage &&
      (await tab.evaluate("document.querySelectorAll('[data-omni-translated]').length===0")),
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
