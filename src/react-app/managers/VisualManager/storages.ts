/**
 * @module VisualManager/storages
 *
 * WXT storage bindings for visual preferences. Every surface in every
 * context reads/watches the same items — this is what makes theme changes
 * propagate live across popup, sidepanel and in-page UI with zero code.
 */

import { storage } from '#imports';
import { PROJECT_PREFIX } from '@/constants';
import type { VisualColorScheme, VisualPrimaryColor } from './defs';

export const visualColorSchemeStorage = storage.defineItem<VisualColorScheme>(
  `local:${PROJECT_PREFIX}:visual:color-scheme`,
  { fallback: 'auto' }
);

export const visualPrimaryColorStorage = storage.defineItem<VisualPrimaryColor>(
  `local:${PROJECT_PREFIX}:visual:primary-color`,
  // Brand cinnabar by default; the picker can override with any named/HEX color.
  { fallback: 'cinnabar' }
);

// Notifications can arrive before a later local write commits, or after both writes
// have settled. Re-read the committed value once local writes drain. A revision
// prevents an older read from winning against a later notification or local edit.
function syncedPreference<T>(item: {
  getValue: () => Promise<T>;
  setValue: (next: T) => Promise<void>;
  watch: (callback: (next: T) => void) => () => void;
}) {
  const listeners = new Set<(next: T) => void>();
  let unwatch: (() => void) | undefined;
  let revision = 0;
  let pending = 0;
  let needsRead = false;

  const refresh = () => {
    if (pending > 0) {
      needsRead = true;
      return;
    }
    needsRead = false;
    if (listeners.size === 0) return;
    const readRevision = ++revision;
    item
      .getValue()
      .then((value) => {
        if (revision === readRevision) [...listeners].forEach((listener) => listener(value));
      })
      .catch((error) => console.warn('[VisualManager] failed to refresh preference', error));
  };

  const persist = async (operation: () => Promise<void>) => {
    revision++;
    pending++;
    try {
      await operation();
    } catch (error) {
      needsRead = true; // Restore the committed preference after a failed optimistic update.
      throw error;
    } finally {
      if (--pending === 0 && needsRead) refresh();
    }
  };

  return {
    getValue: () => item.getValue(),
    setValue: (next: T) => persist(() => item.setValue(next)),
    watch(callback: (next: T) => void) {
      listeners.add(callback);
      unwatch ??= item.watch(refresh);
      return () => {
        listeners.delete(callback);
        if (listeners.size === 0) {
          unwatch?.();
          unwatch = undefined;
          revision++;
        }
      };
    },
  };
}

export const colorSchemePreference = syncedPreference(visualColorSchemeStorage);
export const primaryColorPreference = syncedPreference(visualPrimaryColorStorage);
