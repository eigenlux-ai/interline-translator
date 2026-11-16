import { fakeBrowser } from 'wxt/testing/fake-browser';
import { expect, it, vi } from 'vitest';
import { removeAllListeners } from '@/core/messaging';
import { PROJECT_PREFIX } from '@/constants';
import { dispatchMessage } from '@/test-utils/runtime-messaging';
import { registerConfigGateway } from './gateway';
import { getConfigService, getPublicConfig } from './public';
import { defaultConfig } from './schema';
import { getConfig, setConfig } from './storage';

it('a delayed options read never writes defaults over a newer save', async () => {
  await getConfig();
  await fakeBrowser.storage.local.remove(`${PROJECT_PREFIX}:config`);
  const originalGet = fakeBrowser.storage.local.get.bind(fakeBrowser.storage.local);
  let release!: () => void;
  let captured!: () => void;
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  const readStarted = new Promise<void>((resolve) => {
    captured = resolve;
  });
  const spy = vi.spyOn(fakeBrowser.storage.local, 'get').mockImplementationOnce(async (keys) => {
    const snapshot = await originalGet(keys);
    captured();
    await barrier;
    return snapshot;
  });
  const firstRead = getConfig();
  await readStarted;
  const saved = defaultConfig('ja');
  await setConfig(saved);
  release();
  await firstRead;
  spy.mockRestore();
  expect((await getConfig()).translate.target).toBe('ja');
});

it('queues trusted settings saves behind a delayed background initialization', async () => {
  const originalGet = fakeBrowser.storage.local.get.bind(fakeBrowser.storage.local);
  let release!: () => void;
  let captured!: () => void;
  const barrier = new Promise<void>((resolve) => {
    release = resolve;
  });
  const readStarted = new Promise<void>((resolve) => {
    captured = resolve;
  });
  const spy = vi.spyOn(fakeBrowser.storage.local, 'get').mockImplementationOnce(async (keys) => {
    const snapshot = await originalGet(keys);
    captured();
    await barrier;
    return snapshot;
  });
  registerConfigGateway();
  await readStarted;
  const base = defaultConfig();
  const next = defaultConfig('ja');
  next.providers.push({ id: 'custom', kind: 'openai', model: 'test', apiKeys: ['saved-key'], enabled: true });
  const save = dispatchMessage(
    'editConfig',
    { next, base },
    { id: fakeBrowser.runtime.id, url: fakeBrowser.runtime.getURL('options.html') }
  );
  release();
  expect(await save).toEqual({ ok: true });
  spy.mockRestore();
  expect(await getConfig()).toEqual(next);
  expect((await getPublicConfig()).translate.target).toBe('ja');

  // A later background startup must reuse the saved configuration.
  vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('en-US');
  removeAllListeners();
  registerConfigGateway();
  await getConfigService().patch({});
  expect(await getConfig()).toEqual(next);
});
