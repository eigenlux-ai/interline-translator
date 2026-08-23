/**
 * @module core/messaging
 *
 * Typed runtime messaging (@webext-core/messaging). Add one entry to
 * ProtocolMap per message; both ends get full type safety — no string
 * actions, no hand-rolled listeners.
 *
 * For main-world ⇆ content-script bridging, see the README recipe
 * (@webext-core/messaging/page — same protocol style, different transport).
 */

import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  /** Popup → active-tab content: turn whole-page translation on/off; returns the resulting state (e.g. false on a `never` site). */
  togglePageTranslation(enabled: boolean): boolean;
  /** Context menu / command → active-tab content: flip page translation; returns the new state. */
  flipPageTranslation(): boolean;
  /** Popup → active-tab content: is page translation currently active? */
  getPageTranslationState(): boolean;
  /**
   * Content → background: remember whether whole-page translation is ON for
   * THIS tab, so a full navigation (a new content script) can restore it. The
   * background keys this by `sender.tab.id` in session storage; `origin` scopes
   * it so the state doesn't bleed across a cross-origin navigation in the tab.
   */
  setTabPageTranslation(state: { enabled: boolean; origin: string }): void;
  /** Content → background: on load, the remembered state for this tab (null if none). */
  getTabPageTranslation(): { enabled: boolean; origin: string } | null;
  /** Content → background: open the options / settings page in a tab. */
  openOptionsPage(): void;
}

export const { sendMessage, onMessage } = defineExtensionMessaging<ProtocolMap>();
