import { describe, expect, it, vi } from 'vitest';
import { SubtitleTrackCache, TRACK_CACHE_MAX_BYTES, TRACK_CACHE_MAX_CUES } from './track-cache';

describe('multi-track cache budgets', () => {
  it('keeps both maximum active tracks while refusing unrelated passive captures', () => {
    const pins = new Set(['source', 'target']);
    const cache = new SubtitleTrackCache(() => pins);
    expect(cache.set('source', 'original', 8_000_000, 50_000)).toBe(true);
    expect(cache.set('target', 'translation', 8_000_000, 50_000)).toBe(true);
    expect(cache.set('passive', 'extra', 1, 1)).toBe(false);
    expect(cache.get('source')).toBe('original');
    expect(cache.get('target')).toBe('translation');
    expect(cache.snapshot()).toEqual({ entries: 2, bytes: TRACK_CACHE_MAX_BYTES, cues: TRACK_CACHE_MAX_CUES });
    pins.delete('target');
    expect(cache.set('new-target', 'next', 8_000_000, 50_000)).toBe(true);
    expect(cache.get('target')).toBeUndefined();
  });
  it('evicts the least recently used unprotected body for aggregate bytes', () => {
    const evict = vi.fn();
    const cache = new SubtitleTrackCache(undefined, evict);
    cache.set('a', 'A', 6_000_000, 1);
    cache.set('b', 'B', 6_000_000, 1);
    cache.get('a');
    cache.set('c', 'C', 6_000_000, 1);
    expect(evict).toHaveBeenCalledWith('b');
    expect(cache.snapshot()).toEqual({ entries: 2, bytes: 12_000_000, cues: 2 });
    expect(cache.get('a')).toBe('A');
  });
  it('enforces independent cue and entry budgets and does not promote duplicate observations', () => {
    const cache = new SubtitleTrackCache();
    cache.set('a', 'A', 1, 40_000);
    cache.set('b', 'B', 1, 40_000);
    cache.peek('a');
    cache.set('c', 'C', 1, 40_000);
    expect(cache.get('a')).toBeUndefined();
    cache.clear();
    for (const key of ['a', 'b', 'c', 'd']) cache.set(key, key, 1, 1);
    expect(cache.snapshot().entries).toBe(3);
    expect(cache.get('a')).toBeUndefined();
  });
  it('accounts for replacements, rejected writes, explicit discards and clearing without drift', () => {
    const evict = vi.fn();
    const cache = new SubtitleTrackCache(undefined, evict);
    cache.set('a', 'old', 8_000_000, 50_000);
    cache.set('a', 'new', 2, 3);
    expect(cache.set('a', 'bad', NaN, 3)).toBe(false);
    expect(cache.get('a')).toBe('new');
    expect(cache.snapshot()).toEqual({ entries: 1, bytes: 2, cues: 3 });
    cache.discard('a');
    cache.discard('a');
    expect(evict).toHaveBeenCalledTimes(1);
    cache.clear();
    cache.set('b', 'B', 7, 8);
    cache.clear();
    expect(cache.snapshot()).toEqual({ entries: 0, bytes: 0, cues: 0 });
  });
});
