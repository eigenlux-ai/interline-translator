/**
 * @module data/models/cache
 *
 * Persisted translation-cache entity (Dexie). Index plan: `key, createdAt`
 * — `key` is the primary key (lookup), `createdAt` drives the daily sweep.
 */

export interface TranslationCacheEntity {
  /** Deterministic cache key (primary key) — see `services/translation/cache/cache-key`. */
  key: string;
  /** The translated text. */
  value: string;
  /** Resolved source language, if detected. */
  detectedSource?: string;
  /** Epoch ms; drives TTL cleanup. */
  createdAt: number;
  /** Cached-value protocol version (see CACHE_PROTOCOL in cache/db). Entries
   *  written under an older protocol — or before the field existed — read as
   *  misses, never served. */
  protocol?: number;
}
