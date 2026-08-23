/**
 * @module services/translation/cache/cleanup
 *
 * Periodic cache TTL sweep. `chrome.alarms` is the RIGHT tool here (unlike SW
 * keep-alive): a daily, coarse maintenance tick. Entries older than the TTL are
 * deleted. BACKGROUND-ONLY. Call `registerCacheCleanup()` from the entrypoint.
 */

import { PROJECT_PREFIX } from '@/constants';
import { capEntryCount, sweepOlderThan } from './db';

const SWEEP_ALARM = `${PROJECT_PREFIX}-cache-sweep`;
const SWEEP_PERIOD_MINUTES = 24 * 60; // daily
/** Entries older than this are evicted. Translations are stable, so keep them a while. */
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
/** Count ceiling: ~150k entries ≈ 75 MB — age alone lets a heavy reader far past that. */
const CACHE_MAX_ENTRIES = 150_000;

export function registerCacheCleanup(): void {
  // Create only when absent: alarms.create() REPLACES an existing alarm and
  // restarts its countdown, and this runs on every SW start — which on a
  // normally-used browser is far more often than daily, so an unconditional
  // create would defer the sweep forever.
  void browser.alarms.get(SWEEP_ALARM).then((existing) => {
    if (!existing) void browser.alarms.create(SWEEP_ALARM, { periodInMinutes: SWEEP_PERIOD_MINUTES });
  });
  browser.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== SWEEP_ALARM) return;
    void sweepOlderThan(Date.now() - CACHE_TTL_MS)
      .then(() => capEntryCount(CACHE_MAX_ENTRIES))
      .catch((e) => console.warn('[cache] sweep failed', e));
  });
}
