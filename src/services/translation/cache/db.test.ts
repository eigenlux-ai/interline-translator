import 'fake-indexeddb/auto';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CACHE_PROTOCOL,
  CACHE_TTL_MS,
  capEntryCount,
  clearCache,
  dexieCache,
  getCached,
  putCached,
  sweepOlderThan,
} from './db';

beforeEach(() => {
  vi.spyOn(Date, 'now').mockReturnValue(10_000);
});

afterEach(async () => {
  vi.restoreAllMocks();
  await clearCache();
});

describe('translation cache (Dexie)', () => {
  it('upserts by key and reads back the latest value', async () => {
    await putCached({ key: 'k1', value: 'v1', createdAt: 1000, protocol: CACHE_PROTOCOL });
    expect(await getCached('k1')).toBe('v1');
    await putCached({ key: 'k1', value: 'v2', createdAt: 2000, protocol: CACHE_PROTOCOL });
    expect(await getCached('k1')).toBe('v2');
  });

  it('returns undefined for a missing key', async () => {
    expect(await getCached('nope')).toBeUndefined();
  });

  it('dexieCache.set stamps createdAt + protocol and round-trips', async () => {
    await dexieCache.set('k2', 'hello', 'en');
    expect(await dexieCache.get('k2')).toBe('hello');
    expect(await dexieCache.getResult!('k2')).toEqual({ text: 'hello', detectedSource: 'en' });
  });

  it('a pre-protocol (or older-protocol) entry reads as a MISS — poison is never served', async () => {
    // The truncation-poisoned entries written before the ~n token hardening
    // carry no protocol field at all; a future bump must also invalidate.
    await putCached({ key: 'poison', value: 'half a translation', createdAt: 1000 });
    await putCached({ key: 'stale', value: 'old semantics', createdAt: 1000, protocol: CACHE_PROTOCOL - 1 });
    expect(await getCached('poison')).toBeUndefined();
    expect(await getCached('stale')).toBeUndefined();
    expect(await dexieCache.get('poison')).toBeUndefined();
  });

  it('sweepOlderThan deletes entries below the cutoff only', async () => {
    await putCached({ key: 'old', value: 'o', createdAt: 100, protocol: CACHE_PROTOCOL });
    await putCached({ key: 'new', value: 'n', createdAt: 10_000, protocol: CACHE_PROTOCOL });
    const removed = await sweepOlderThan(5000);
    expect(removed).toBe(1);
    expect(await getCached('old')).toBeUndefined();
    expect(await getCached('new')).toBe('n');
  });
});

it('rejects expired entries even before the scheduled sweep runs', async () => {
  vi.mocked(Date.now).mockReturnValue(CACHE_TTL_MS + 10_000);
  await putCached({ key: 'expired', value: 'old', createdAt: 10_000, protocol: CACHE_PROTOCOL });
  await putCached({ key: 'fresh', value: 'new', createdAt: 10_001, protocol: CACHE_PROTOCOL });
  expect(await getCached('expired')).toBeUndefined();
  expect(await getCached('fresh')).toBe('new');
});

it('overlapping capacity sweeps preserve the newest entries', async () => {
  for (let i = 0; i < 8; i++) {
    await putCached({ key: String(i), value: String(i), createdAt: i + 1, protocol: CACHE_PROTOCOL });
  }
  const removed = await Promise.all([capEntryCount(3), capEntryCount(3)]);
  expect(removed.reduce((a, b) => a + b, 0)).toBe(5);
  expect(await getCached('4')).toBeUndefined();
  expect(await getCached('5')).toBe('5');
  expect(await getCached('7')).toBe('7');
});
