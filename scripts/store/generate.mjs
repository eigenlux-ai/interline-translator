/** Start an isolated Chrome for Testing, capture assets, and close it on completion. */
import { spawn } from 'node:child_process';
import { constants } from 'node:fs';
import { access, mkdir, mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { connect } from './cdp.mjs';

const root = process.cwd();
const cache = path.join(root, '.cache/store-capture');
await mkdir(cache, { recursive: true });
async function findChrome() {
  if (process.env.STORE_CHROME_BIN) return process.env.STORE_CHROME_BIN;
  const browserCache = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const versions = (await readdir(browserCache).catch(() => []))
    .filter((n) => /^chromium-\d+$/.test(n))
    .sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
  for (const version of versions) {
    const candidate = path.join(
      browserCache,
      version,
      'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
    );
    if (
      await access(candidate, constants.X_OK).then(
        () => true,
        () => false
      )
    )
      return candidate;
  }
  throw new Error('Set STORE_CHROME_BIN to a Chrome for Testing executable that supports --load-extension.');
}
const chromeBin = await findChrome();
await access(path.join(root, '.output/chrome-mv3/manifest.json'));
const profile = await mkdtemp(path.join(cache, 'profile-'));
const chrome = spawn(
  chromeBin,
  [
    '--headless=new',
    '--enable-automation',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    `--load-extension=${path.join(root, '.output/chrome-mv3')}`,
    'about:blank',
  ],
  { stdio: ['ignore', 'ignore', 'pipe'] }
);
let diagnostics = '';
chrome.stderr.on('data', (data) => {
  diagnostics = (diagnostics + data.toString()).slice(-2000);
});
let client;
try {
  let port;
  for (let i = 0; i < 100; i++) {
    if (chrome.exitCode !== null) throw new Error(`Chrome exited: ${diagnostics}`);
    const active = await readFile(path.join(profile, 'DevToolsActivePort'), 'utf8').catch(() => '');
    port = Number(active.split('\n')[0]);
    if (port) break;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!port) throw new Error(`Chrome did not start: ${diagnostics}`);
  const cdpUrl = `http://127.0.0.1:${port}/json/version`;
  const version = await (await fetch(cdpUrl)).json();
  client = await connect(version.webSocketDebuggerUrl);
  let extensionId;
  for (let i = 0; i < 50 && !extensionId; i++) {
    const { targetInfos } = await client.call('Target.getTargets');
    for (const target of targetInfos.filter((t) => t.type === 'service_worker' && t.url.endsWith('/background.js'))) {
      const { sessionId } = await client.call('Target.attachToTarget', { targetId: target.targetId, flatten: true });
      const result = await client.call(
        'Runtime.evaluate',
        { expression: 'chrome.runtime.getManifest().name', returnByValue: true },
        sessionId
      );
      await client.call('Target.detachFromTarget', { sessionId });
      if (result.result.value === 'Interline · 行间') extensionId = new URL(target.url).hostname;
    }
    if (!extensionId) await new Promise((resolve) => setTimeout(resolve, 200));
  }
  if (!extensionId) throw new Error('Interline did not load. Use Chrome for Testing with unpacked extension support.');
  await new Promise((resolve, reject) => {
    const capture = spawn(process.execPath, ['scripts/store/capture.mjs'], {
      cwd: root,
      stdio: 'inherit',
      env: { ...process.env, STORE_CDP_URL: cdpUrl, STORE_EXTENSION_ID: extensionId },
    });
    capture.on('error', reject);
    capture.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`Capture exited ${code}`))));
  });
} finally {
  if (client) {
    await client.call('Browser.close').catch(() => {});
    client.close();
  }
  if (chrome.exitCode === null) {
    chrome.kill('SIGTERM');
    await new Promise((resolve) => {
      chrome.once('exit', resolve);
      setTimeout(resolve, 5000);
    });
  }
  // Only the temporary, credential-free profile created by this invocation.
  await rm(profile, { recursive: true, force: true });
}
