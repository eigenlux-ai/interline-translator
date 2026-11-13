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
  // Bumped by every newer source of truth (watch event, local set, new or
  // ended subscription) so a catch-up read cannot overwrite it.
  let revision = 0;
  // Mantine subscribes with its own setter, which calls `set`. A value that
  // came FROM storage must not be written back: with two quick changes the
  // echoes of each would chase each other between surfaces forever.
  let applyingStoredValue = false;
  const applyStored = (onUpdate: (value: MantineColorScheme) => void, value: MantineColorScheme) => {
    currentColorScheme = value;
    applyingStoredValue = true;
    try {
      onUpdate(value);
    } finally {
      applyingStoredValue = false;
    }
  };

  return {
    get: (defaultValue) => currentColorScheme ?? defaultValue,
    set: (value) => {
      revision++;
      currentColorScheme = value;
      if (applyingStoredValue) return;
      visualColorSchemeStorage.setValue(value).catch((error) => {
        console.warn('[VisualManager] failed to persist color scheme', error);
      });
    },
    subscribe: (onUpdate) => {
      // Defensive: a second subscribe without an interleaved unsubscribe
      // (StrictMode double-effects) must not leak the previous watcher.
      unwatch?.();
      unwatch = visualColorSchemeStorage.watch((value) => {
        revision++;
        applyStored(onUpdate, value);
      });
      // The initial value was read before this subscription existed; catch
      // up on a change another surface made in between.
      const readRevision = ++revision;
      visualColorSchemeStorage
        .getValue()
        .then((value) => {
          if (revision !== readRevision || value === currentColorScheme) return;
          applyStored(onUpdate, value);
        })
        .catch((error) => {
          console.warn('[VisualManager] failed to read color scheme', error);
        });
    },
    unsubscribe: () => {
      revision++;
      unwatch?.();
      unwatch = undefined;
    },
    clear: () => {
      revision++;
      currentColorScheme = undefined;
      visualColorSchemeStorage.removeValue().catch((error) => {
        console.warn('[VisualManager] failed to clear color scheme', error);
      });
    },
  };
}
