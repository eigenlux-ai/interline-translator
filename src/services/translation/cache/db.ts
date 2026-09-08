/**
 * @module services/translation/cache/db
 *
 * Persistent translation cache (Dexie/IndexedDB). BACKGROUND-ONLY. The cache
 * key (see ./cache-key) is the primary key, so writes upsert naturally. A 24h
 * alarm sweeps entries older than the TTL (see background entrypoint).
 *
 * Exposes a small `TranslationCache` interface so the engine can be unit-tested
 * against an in-memory implementation without IndexedDB.
 */

import Dexie, { type Table } from 'dexie';
import type { TranslateResult, TranslationCacheEntity } from '@/data/models';

export interface TranslationCache {
  get(key: string): Promise<string | undefined>;
  getResult?(key: string): Promise<Pick<TranslateResult, 'text' | 'detectedSource'> | undefined>;
  set(key: string, value: string, detectedSource?: string): Promise<void>;
}

/**
 * Cached-value protocol version. Bump when the serialization semantics
 * of cached values change. A version mismatch is treated as a cache miss.
 */
export const CACHE_PROTOCOL = 2;

export const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000;

class OmniDatabase extends Dexie {
  translationCache!: Table<TranslationCacheEntity, string>;

  constructor() {
    super('interline');
    // `key` is the primary key (string); `createdAt` indexed for TTL sweeps.
    this.version(1).stores({ translationCache: 'key, createdAt' });
  }
}

let _db: OmniDatabase | null = null;
function db(): OmniDatabase {
  return (_db ??= new OmniDatabase());
}

export async function getCached(key: string): Promise<string | undefined> {
  return (await getCachedResult(key))?.text;
}

async function getCachedResult(key: string): Promise<Pick<TranslateResult, 'text' | 'detectedSource'> | undefined> {
  const row = await db().translationCache.get(key);
  // Alarms may be delayed while the browser is closed. Expiry is enforced
  // at read time too; do not delete here, which could race a fresh upsert.
  return row?.protocol === CACHE_PROTOCOL &&
    Number.isFinite(row.createdAt) &&
    row.createdAt > Date.now() - CACHE_TTL_MS &&
    typeof row.value === 'string' &&
    row.value.trim()
    ? { text: row.value, detectedSource: row.detectedSource }
    : undefined;
}

export async function putCached(entry: TranslationCacheEntity): Promise<void> {
  await db().translationCache.put(entry);
}

/** Delete entries older than `cutoff` (epoch ms). Returns the count removed. */
export async function sweepOlderThan(cutoff: number): Promise<number> {
  return db().translationCache.where('createdAt').below(cutoff).delete();
}

/**
 * Bound the cache by ENTRY COUNT as well as age: a heavy reader can write
 * hundreds of thousands of segments inside the TTL window (hundreds of MB of
 * IndexedDB). Deletes the oldest entries beyond `max`. Returns count removed.
 */
export async function capEntryCount(max: number): Promise<number> {
  if (!Number.isSafeInteger(max) || max < 0) throw new RangeError('Invalid cache entry limit');
  const database = db();
  const table = database.translationCache;
  // Keep selection and deletion atomic: another request may refresh a key
  // between them, and overlapping sweeps must not over-evict.
  return database.transaction('rw', table, async () => {
    const total = await table.count();
    if (total <= max) return 0;
    const keys = await table
      .orderBy('createdAt')
      .limit(total - max)
      .primaryKeys();
    await table.bulkDelete(keys);
    return keys.length;
  });
}

export async function clearCache(): Promise<void> {
  await db().translationCache.clear();
}

/** The Dexie-backed cache the engine uses in production. */
export const dexieCache: TranslationCache = {
  get: getCached,
  getResult: getCachedResult,
  async set(key, value, detectedSource) {
    await putCached({ key, value, detectedSource, createdAt: Date.now(), protocol: CACHE_PROTOCOL });
  },
};
