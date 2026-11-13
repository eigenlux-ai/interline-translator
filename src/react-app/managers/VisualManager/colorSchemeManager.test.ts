import { describe, expect, it, vi } from 'vitest';
import { extStorageColorSchemeManager } from './colorSchemeManager';
import { visualColorSchemeStorage } from './storages';

/**
 * Manages the Mantine MantineColorSchemeManager, backed by WXT storage.
 * Runs against @webext-core/fake-browser (in-memory storage + onChanged), resetting
 * before each test. Ensures the StrictMode double-subscribe leak fix and the
 * storage.watch → onUpdate bridge work correctly for cross-surface color-scheme sync.
 */

// fake-browser's onChanged dispatch may be async; flush microtasks + a macrotask.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('extStorageColorSchemeManager', () => {
  it('get returns the seeded initial value, then the default fallback', () => {
    const mgr = extStorageColorSchemeManager('dark');
    expect(mgr.get('light')).toBe('dark');

    const empty = extStorageColorSchemeManager();
    expect(empty.get('light')).toBe('light');
  });

  it('set persists to storage and updates get', async () => {
    const mgr = extStorageColorSchemeManager('light');
    mgr.set('dark');
    expect(mgr.get('light')).toBe('dark');
    await flush();
    expect(await visualColorSchemeStorage.getValue()).toBe('dark');
  });

  it('subscribe fires onUpdate when storage changes from elsewhere', async () => {
    const mgr = extStorageColorSchemeManager('light');
    const onUpdate = vi.fn();
    mgr.subscribe(onUpdate);

    await visualColorSchemeStorage.setValue('dark'); // e.g. another surface
    await flush();

    expect(onUpdate).toHaveBeenCalledWith('dark');
  });

  it('a second subscribe without an interleaved unsubscribe does not leak the first watcher', async () => {
    const mgr = extStorageColorSchemeManager('light');
    const first = vi.fn();
    const second = vi.fn();
    mgr.subscribe(first); // StrictMode-style double-invoke without cleanup
    mgr.subscribe(second);

    await visualColorSchemeStorage.setValue('dark');
    await flush();

    expect(first).not.toHaveBeenCalled(); // unwatched by the second subscribe
    expect(second).toHaveBeenCalledWith('dark');
  });

  it('unsubscribe stops further updates', async () => {
    const mgr = extStorageColorSchemeManager('light');
    const onUpdate = vi.fn();
    mgr.subscribe(onUpdate);
    mgr.unsubscribe();

    await visualColorSchemeStorage.setValue('dark');
    await flush();

    expect(onUpdate).not.toHaveBeenCalled();
  });

  it('subscribe catches up on a change made after the initial read', async () => {
    const mgr = extStorageColorSchemeManager('light'); // seeded from an earlier read
    await visualColorSchemeStorage.setValue('dark'); // before anyone subscribed
    const onUpdate = vi.fn();
    mgr.subscribe(onUpdate);
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('dark');
    expect(mgr.get('light')).toBe('dark');
  });

  it('a local set during the catch-up read wins over the read', async () => {
    let finish: (value: 'light') => void = () => {};
    const read = vi
      .spyOn(visualColorSchemeStorage, 'getValue')
      .mockImplementationOnce(() => new Promise((resolve) => (finish = resolve)));
    const mgr = extStorageColorSchemeManager('light');
    const onUpdate = vi.fn();
    mgr.subscribe(onUpdate);
    mgr.set('dark');
    finish('light');
    await flush();
    expect(onUpdate).not.toHaveBeenCalledWith('light');
    expect(mgr.get('light')).toBe('dark');
    read.mockRestore();
  });

  it('clear during the catch-up read wins over the read', async () => {
    let finish: (value: 'dark') => void = () => {};
    const read = vi
      .spyOn(visualColorSchemeStorage, 'getValue')
      .mockImplementationOnce(() => new Promise((resolve) => (finish = resolve)));
    const mgr = extStorageColorSchemeManager('dark');
    const onUpdate = vi.fn();
    mgr.subscribe(onUpdate);
    mgr.clear();
    finish('dark');
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
    expect(mgr.get('light')).toBe('light');
    read.mockRestore();
  });

  it('does not write values received from storage back (no echo loop between surfaces)', async () => {
    const write = vi.spyOn(visualColorSchemeStorage, 'setValue');
    // Mantine subscribes with its own setter, which calls manager.set.
    const surfaces = [extStorageColorSchemeManager('light'), extStorageColorSchemeManager('light')];
    for (const mgr of surfaces) mgr.subscribe((value) => mgr.set(value));
    await flush();
    surfaces[0]!.set('dark');
    surfaces[0]!.set('light'); // two changes before the first echo lands
    for (let i = 0; i < 10; i++) await flush();
    expect(write).toHaveBeenCalledTimes(2);
    expect(await visualColorSchemeStorage.getValue()).toBe('light');
    expect(surfaces.map((mgr) => mgr.get('dark'))).toEqual(['light', 'light']);
    write.mockRestore();
  });
});
