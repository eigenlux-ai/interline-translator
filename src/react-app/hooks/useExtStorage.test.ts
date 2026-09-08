import { act, cleanup, renderHook, waitFor } from '@testing-library/react';
import { storage } from '#imports';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useExtStorage } from './useExtStorage';

/**
 * The async-storage ↔ synchronous-snapshot bridge. Runs against
 * @webext-core/fake-browser (reset before each test). Guards: fallback before
 * first read, async seed from persisted value, write round-trip via watch, and
 * snapshot sharing across consumers of the same item.
 */

afterEach(cleanup);

const note = storage.defineItem<string>('local:test:note', { fallback: 'fb' });

describe('useExtStorage', () => {
  it('returns the fallback synchronously, before the first async read resolves', () => {
    const { result } = renderHook(() => useExtStorage(note));
    expect(result.current[0]).toBe('fb');
  });

  it('seeds from the persisted value on mount', async () => {
    await note.setValue('persisted');
    const { result } = renderHook(() => useExtStorage(note));
    await waitFor(() => expect(result.current[0]).toBe('persisted'));
  });

  it('setValue persists and the value flows back via watch', async () => {
    const { result } = renderHook(() => useExtStorage(note));
    await act(async () => {
      result.current[1]('written');
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(result.current[0]).toBe('written');
    expect(await note.getValue()).toBe('written');
  });

  it('shares one snapshot across consumers of the same item', async () => {
    const a = renderHook(() => useExtStorage(note));
    const b = renderHook(() => useExtStorage(note));
    await act(async () => {
      a.result.current[1]('shared');
      await new Promise((r) => setTimeout(r, 30));
    });
    expect(a.result.current[0]).toBe('shared');
    expect(b.result.current[0]).toBe('shared');
  });
});

function controlledItem() {
  const reads: Array<(value: string) => void> = [];
  const watchers = new Set<(value: string) => void>();
  const item = {
    fallback: 'fallback',
    getValue: vi.fn(() => new Promise<string>((resolve) => reads.push(resolve))),
    setValue: vi.fn(async () => {}),
    watch: vi.fn((cb: (value: string) => void) => {
      watchers.add(cb);
      return () => {
        watchers.delete(cb);
      };
    }),
  };
  return { item, reads, watchers };
}

it('shares a single read and watcher and releases them after the last consumer', async () => {
  const { item, reads, watchers } = controlledItem();
  const a = renderHook(() => useExtStorage(item));
  const b = renderHook(() => useExtStorage(item));
  expect(item.getValue).toHaveBeenCalledTimes(1);
  expect(watchers.size).toBe(1);
  await act(async () => reads[0]('stored'));
  expect(a.result.current[0]).toBe('stored');
  expect(b.result.current[0]).toBe('stored');
  a.unmount();
  expect(watchers.size).toBe(1);
  b.unmount();
  expect(watchers.size).toBe(0);
});

it('a read from an unmounted consumer cannot overwrite the remounted snapshot', async () => {
  const { item, reads } = controlledItem();
  const a = renderHook(() => useExtStorage(item));
  a.unmount();
  const b = renderHook(() => useExtStorage(item));
  await act(async () => reads[1]('new'));
  await act(async () => reads[0]('stale'));
  expect(b.result.current[0]).toBe('new');
  const c = renderHook(() => useExtStorage(item));
  expect(c.result.current[0]).toBe('new');
  b.unmount();
  c.unmount();
});

it('a watch update wins over an earlier pending read', async () => {
  const { item, reads, watchers } = controlledItem();
  const hook = renderHook(() => useExtStorage(item));
  await act(async () => {
    for (const cb of watchers) cb('new');
  });
  await act(async () => reads[0]('stale'));
  expect(hook.result.current[0]).toBe('new');
  hook.unmount();
});

it('handles failed initial reads and remains subscribed for recovery', async () => {
  const { item, watchers } = controlledItem();
  item.getValue.mockRejectedValueOnce(new Error('storage unavailable'));
  const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const hook = renderHook(() => useExtStorage(item));
  await act(async () => {});
  expect(hook.result.current[0]).toBe('fallback');
  expect(warning).toHaveBeenCalledTimes(1);
  await act(async () => {
    for (const cb of watchers) cb('recovered');
  });
  expect(hook.result.current[0]).toBe('recovered');
  hook.unmount();
  warning.mockRestore();
});
