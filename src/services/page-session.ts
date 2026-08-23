/**
 * @module services/page-session
 *
 * Per-tab whole-page-translation memory, so a FULL navigation (traditional
 * forum pagination, `?page=2` → a brand-new document → a fresh content script
 * with no in-memory state) can restore the translation the user turned on a
 * page ago — without making it a persistent "always translate this site" rule.
 *
 * Why the background owns this: a content script can't see its own `tabId` and
 * dies on every navigation, and an MV3 service worker's memory is evicted on
 * idle. `browser.storage.session` is the one store that (a) the background can
 * key by `sender.tab.id`, (b) survives SW eviction, and (c) is cleared when the
 * browser session ends — matching the session lifetime of per-tab translation.
 * Origin scoping: the remembered state carries the origin it was set on; the
 * content script only restores when it still matches `location.origin`, so a
 * cross-origin navigation in the same tab won't wrongly re-translate.
 */

import { onMessage } from '@/core/messaging';
import { PROJECT_PREFIX } from '@/constants';

interface TabPageState {
  enabled: boolean;
  origin: string;
}

const key = (tabId: number) => `${PROJECT_PREFIX}:pt-session:${tabId}`;

export function registerPageSession(): void {
  onMessage('setTabPageTranslation', async ({ data, sender }) => {
    const tabId = sender.tab?.id;
    if (tabId == null) return;
    await browser.storage.session.set({ [key(tabId)]: data satisfies TabPageState });
  });

  onMessage('getTabPageTranslation', async ({ sender }) => {
    const tabId = sender.tab?.id;
    if (tabId == null) return null;
    const k = key(tabId);
    const got = await browser.storage.session.get(k);
    return (got[k] as TabPageState | undefined) ?? null;
  });

  // Reclaim the entry when the tab closes (session storage would otherwise hold
  // it for the rest of the browser session).
  browser.tabs.onRemoved.addListener((tabId) => {
    void browser.storage.session.remove(key(tabId));
  });
}
