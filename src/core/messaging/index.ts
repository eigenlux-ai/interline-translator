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
import type { SubtitleDiagnostic } from '@/core/subtitles/diagnostics';
import type { Config, TranslateRequest, TranslateResult } from '@/data/models';

interface ProtocolMap {
  /** Sender-scoped input translation; the background supplies the admission owner. */
  translate(request: TranslateRequest): TranslateResult;
  /** Trusted extension settings only; serialized with content-side field patches. */
  editConfig(edit: { next: Config; base: Config }): { ok: boolean };
  /** Trusted extension settings only; diagnostic events never contain transcript text. */
  exportSubtitleDiagnostics(): { version: 1; events: (SubtitleDiagnostic & { time: number })[] };
  clearSubtitleCache(): { ok: boolean };
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
  /** Content → background: open the independent subtitle preferences. */
  openVideoSubtitleSettings(): void;
  /** Browser-validated frame and embedding-site policy scope. */
  getSubtitleContext(): { hosts: string[] } | null;
}

// The existing transport uses sendResponse + return true, including for Promise
// handlers. Native Promise replies still depend on Chromium rollout state.
export const { sendMessage, onMessage, removeAllListeners } = defineExtensionMessaging<ProtocolMap>();
