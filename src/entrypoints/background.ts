import { defineBackground } from '#imports';
import { onMessage } from '@/core/messaging';
import { registerModelsService } from '@/core/rpc/provider-models';
import { PROJECT_PREFIX } from '@/constants';
import { registerAllServices } from '@/services';
import { registerConfigGateway } from '@/services/config/gateway';
import { registerKeepAlive } from '@/services/keep-alive';
import { registerMenusAndCommands } from '@/services/menus';
import { registerPageSession } from '@/services/page-session';
import { registerStreamServer } from '@/services/stream/server';
import { registerCacheCleanup } from '@/services/translation/cache/cleanup';
export default defineBackground(() => {
  // Real background services (translation engine, …). This is the ONLY place
  // service impl.ts files (ai-sdk/dexie) enter a bundle — see services/index.ts.
  registerAllServices();

  // Token-by-token streaming over the named Port (proxy-service is promise-only).
  registerStreamServer();

  // Content-safe config projection (mirror) + the section-patch write gate —
  // content scripts never read or write the full config (API keys) directly.
  registerConfigGateway();

  // Keep the SW awake during in-flight requests/streams (Port ping, not alarms).
  registerKeepAlive();

  // Daily cache TTL sweep (alarms is correct for coarse maintenance ticks).
  registerCacheCleanup();

  // Right-click menu + keyboard command (Alt+T) to toggle page translation.
  registerMenusAndCommands();

  // Per-tab page-translation memory so full navigations (forum pagination)
  // restore the translation the user turned on, scoped to the tab + origin.
  registerPageSession();

  // List a provider's models on demand (settings "Fetch models" button) — a
  // cross-origin fetch that must originate from the service worker.
  registerModelsService();

  // Open options page on demand (from floating-ball panel button or other content surfaces)
  onMessage('openOptionsPage', () => {
    void browser.runtime.openOptionsPage();
  });

  // Clicking the extension action icon directly opens options / settings in a tab
  browser.action?.onClicked.addListener(() => {
    void browser.runtime.openOptionsPage();
  });

  console.log(`[${PROJECT_PREFIX}] background ready`, { id: browser.runtime.id });
});
