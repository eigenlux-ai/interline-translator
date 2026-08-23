/**
 * @module VisualManager/colorSchemeManager
 *
 * Mantine MantineColorSchemeManager backed by WXT storage instead of
 * window.localStorage. The `subscribe` hook bridges storage.watch into
 * Mantine's reactive system, so a scheme change made in any surface (or any
 * extension context) updates every other surface live.
 */

import type { MantineColorScheme, MantineColorSchemeManager } from '@mantine/core';
import { visualColorSchemeStorage } from './storages';

export function extStorageColorSchemeManager(initialColorScheme?: MantineColorScheme): MantineColorSchemeManager {
  // Mantine's `get` is synchronous while WXT storage is async; track the
  // last known value in a closure, seeded from the hydrated initial state.
  let currentColorScheme = initialColorScheme;
  let unwatch: (() => void) | undefined;

  return {
    get: (defaultValue) => currentColorScheme ?? defaultValue,
    set: (value) => {
      currentColorScheme = value;
      visualColorSchemeStorage.setValue(value).catch((error) => {
        console.warn('[VisualManager] failed to persist color scheme', error);
      });
    },
    subscribe: (onUpdate) => {
      // Defensive: a second subscribe without an interleaved unsubscribe
      // (StrictMode double-effects) must not leak the previous watcher.
      unwatch?.();
      unwatch = visualColorSchemeStorage.watch((value) => {
        currentColorScheme = value;
        onUpdate(value);
      });
    },
    unsubscribe: () => {
      unwatch?.();
      unwatch = undefined;
    },
    clear: () => {
      currentColorScheme = undefined;
      visualColorSchemeStorage.removeValue().catch((error) => {
        console.warn('[VisualManager] failed to clear color scheme', error);
      });
    },
  };
}
