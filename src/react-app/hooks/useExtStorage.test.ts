import { act, renderHook, waitFor } from '@testing-library/react';
import { storage } from '#imports';
import { describe, expect, it } from 'vitest';
import { useExtStorage } from './useExtStorage';

/**
 * The async-storage ↔ synchronous-snapshot bridge. Runs against
 * @webext-core/fake-browser (reset before each test). Guards: fallback before
 * first read, async seed from persisted value, write round-trip via watch, and
 * snapshot sharing across consumers of the same item.
 */

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
