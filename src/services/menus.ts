/**
 * @module services/menus
 *
 * Right-click context menu + keyboard commands for page translation (background-
 * only). Both flip the active tab's page translation via the content script,
 * which owns the per-tab on/off state.
 */

import { sendMessage } from '@/core/messaging';
import { PROJECT_PREFIX } from '@/constants';

const MENU_TRANSLATE_PAGE = `${PROJECT_PREFIX}-translate-page`;

async function activeTabId(): Promise<number | undefined> {
  const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
  return tab?.id;
}

async function flipActiveTab(tabId?: number): Promise<void> {
  const id = tabId ?? (await activeTabId());
  if (id == null) return;
  try {
    await sendMessage('flipPageTranslation', undefined, id);
  } catch {
    /* no content script on this tab (chrome:// etc.) */
  }
}

export function registerMenusAndCommands(): void {
  // Context menu (rebuilt on install so it's idempotent across reloads).
  browser.runtime.onInstalled.addListener(() => {
    void browser.contextMenus.removeAll().then(() => {
      browser.contextMenus.create({
        id: MENU_TRANSLATE_PAGE,
        // The browser paints this row, so browser.i18n is the ONLY thing that
        // can localize it — src/i18n (Paraglide) reaches our own surfaces only.
        title: browser.i18n.getMessage('menuTranslatePage'),
        contexts: ['page', 'selection'],
      });
    });
  });

  browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === MENU_TRANSLATE_PAGE) void flipActiveTab(tab?.id);
  });

  // Keyboard command (default binding declared in the manifest).
  browser.commands?.onCommand.addListener((command) => {
    if (command === 'toggle-page-translation') void flipActiveTab();
  });
}
