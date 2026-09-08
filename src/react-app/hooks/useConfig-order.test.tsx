// @vitest-environment happy-dom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { Config } from '@/data/models';
import { defaultConfig } from '@/services/config/schema';
import { useConfig } from './useConfig';

const state = vi.hoisted(() => ({
  read: vi.fn(),
  write: vi.fn(async () => {}),
  watch: null as null | ((c: Config) => void),
}));
vi.mock('@/services/config/storage', () => ({
  getConfig: state.read,
  setConfig: state.write,
  watchConfig: (cb: (c: Config) => void) => {
    state.watch = cb;
    return () => {};
  },
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it('does not apply a stale reconciliation read over a newer storage event', async () => {
  const old = defaultConfig();
  const next = { ...old, translate: { ...old.translate, target: 'fr' } };
  let finish!: (c: Config) => void;
  state.read.mockResolvedValueOnce(old).mockImplementationOnce(
    () =>
      new Promise<Config>((r) => {
        finish = r;
      })
  );
  const { result } = renderHook(() => useConfig());
  await act(async () => {});
  await act(async () => {
    await result.current.save(old);
  });
  await act(async () => {
    state.watch!(next);
    finish(old);
  });
  expect(result.current.config?.translate.target).toBe('fr');
});
