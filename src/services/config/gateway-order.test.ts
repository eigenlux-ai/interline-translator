import { storage } from '#imports';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import type { Config } from '@/data/models';
import { registerConfigGateway } from './gateway';
import { defaultConfig } from './schema';

const state = vi.hoisted(() => ({
  read: vi.fn(),
  set: vi.fn(async (_key: string, _value: unknown) => {}),
  watch: null as null | ((c: Config) => void),
}));
vi.mock('@webext-core/proxy-service', () => ({ registerService: vi.fn(), createProxyService: vi.fn() }));
vi.mock('./storage', () => ({
  getConfig: state.read,
  setConfig: vi.fn(),
  watchConfig: (cb: (c: Config) => void) => {
    state.watch = cb;
    return () => {};
  },
}));
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(storage, 'setItem').mockImplementation(state.set);
});
afterEach(() => vi.restoreAllMocks());
it('does not mirror a stale startup read after a newer settings event', async () => {
  let finish!: (c: Config) => void;
  state.read.mockImplementationOnce(
    () =>
      new Promise<Config>((r) => {
        finish = r;
      })
  );
  registerConfigGateway();
  const old = defaultConfig();
  const next = { ...old, siteControl: { ...old.siteControl, defaultMode: 'never' as const } };
  state.watch!(next);
  await new Promise((r) => setTimeout(r, 0));
  finish(old);
  await new Promise((r) => setTimeout(r, 0));
  expect((state.set.mock.calls.at(-1)?.[1] as { siteControl: { defaultMode: string } })?.siteControl.defaultMode).toBe(
    'never'
  );
});
