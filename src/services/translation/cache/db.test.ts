import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { CACHE_PROTOCOL, clearCache, dexieCache, getCached, putCached, sweepOlderThan } from './db';

afterEach(async () => {
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
