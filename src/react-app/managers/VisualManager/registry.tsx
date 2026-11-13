/**
 * @module VisualManager/registry
 *
 * Orchestrator of the visual subsystem: owns React state for visual
 * preferences, persists them to WXT storage, and keeps every surface in
 * sync by watching the same storage items (color scheme syncs through the
 * colorSchemeManager; primary color is watched here). Direction follows the UI locale.
 */

import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import MantineRegistry from './components/MantineRegistry';
import VisualContextProvider from './context';
import type { VisualColorScheme, VisualPrimaryColor } from './defs';
import type { VisualPersistentState } from './persistent-util';
import { visualColorSchemeStorage, visualPrimaryColorStorage } from './storages';

interface VisualStateBridgeProps extends PropsWithChildren {
  colorScheme: VisualColorScheme;
  primaryColor: VisualPrimaryColor;
  onColorSchemeChange: (colorScheme: VisualColorScheme) => void;
  onPrimaryColorChange: (primaryColor: VisualPrimaryColor) => void;
}

/**
 * Lives inside MantineProvider; consumes Mantine's raw hooks and exposes
 * unified change handlers through the VisualContext. Persistence rules:
 * color scheme is written by the colorSchemeManager (via Mantine), the
 * other preferences are written here.
 */
function VisualStateBridge({ children, ...props }: VisualStateBridgeProps) {
  // keepTransitions: true is required for host isolation, not just for aesthetics.
  // Without it, Mantine's color-scheme toggle injects a global `*{transition:none}`
  // <style> tag into document.head (the host page) for ~10ms on every switch,
  // causing an unintended mutation. Do not remove this option.
  // (Side effect: our own UI animates the theme switch instead of hard-cutting,
  // which is acceptable. A scoped anti-flash inside the shadow root would need a
  // custom implementation.)
  const { setColorScheme: mantineSetColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const activeColorScheme = useComputedColorScheme('light');
  const setColorScheme = (colorScheme: VisualColorScheme) => {
    props.onColorSchemeChange(colorScheme);
    // The preference is extension-global, so persist it here: Mantine's setter
    // is a no-op (no colorSchemeManager.set) while this surface has a forced or
    // external scheme. Otherwise it also writes the same value, harmlessly.
    visualColorSchemeStorage.setValue(colorScheme).catch((error) => {
      console.warn('[VisualManager] failed to persist color scheme', error);
    });
    mantineSetColorScheme(colorScheme);
  };

  return (
    <VisualContextProvider
      colorScheme={props.colorScheme}
      activeColorScheme={activeColorScheme}
      primaryColor={props.primaryColor}
      setColorScheme={setColorScheme}
      toggleColorScheme={() => setColorScheme(activeColorScheme === 'light' ? 'dark' : 'light')}
      setPrimaryColor={(primaryColor) => {
        props.onPrimaryColorChange(primaryColor);
        visualPrimaryColorStorage.setValue(primaryColor).catch((error) => {
          console.warn('[VisualManager] failed to persist primary color', error);
        });
      }}
    >
      {children}
    </VisualContextProvider>
  );
}

export interface VisualManagerRegistryProps extends PropsWithChildren {
  persistentState: VisualPersistentState;
}

type VisualKey = keyof VisualPersistentState;

const VisualManagerRegistry = ({ persistentState, children }: VisualManagerRegistryProps) => {
  const [state, setState] = useState(persistentState);
  // Per preference: bumped by every newer value (watch event, local change)
  // so a catch-up read cannot overwrite it.
  const revisions = useRef<Record<VisualKey, number>>({ colorScheme: 0, primaryColor: 0 });
  const update = <K extends VisualKey>(key: K, value: VisualPersistentState[K]) => {
    revisions.current[key]++;
    setState((s) => (s[key] === value ? s : { ...s, [key]: value }));
  };

  // Cross-surface sync: another surface (popup, sidepanel, in-page UI)
  // changed a preference → storage watch fires here → this surface follows.
  // `persistentState` was read before this subscription existed, so read once
  // more after subscribing to catch a change made in between.
  useEffect(() => {
    let active = true;
    const follow = <K extends VisualKey>(
      key: K,
      item: {
        watch: (callback: (value: VisualPersistentState[K]) => void) => () => void;
        getValue: () => Promise<VisualPersistentState[K]>;
      }
    ) => {
      const unwatch = item.watch((value) => update(key, value));
      const readRevision = revisions.current[key];
      item
        .getValue()
        .then((value) => {
          if (active && revisions.current[key] === readRevision) update(key, value);
        })
        .catch((error) => {
          console.warn(`[VisualManager] failed to read ${key}`, error);
        });
      return unwatch;
    };
    const unwatchers = [
      follow('colorScheme', visualColorSchemeStorage),
      follow('primaryColor', visualPrimaryColorStorage),
    ];
    return () => {
      active = false;
      unwatchers.forEach((unwatch) => unwatch());
    };
  }, []);

  return (
    <MantineRegistry colorScheme={state.colorScheme} primaryColor={state.primaryColor}>
      <VisualStateBridge
        colorScheme={state.colorScheme}
        primaryColor={state.primaryColor}
        onColorSchemeChange={(colorScheme) => update('colorScheme', colorScheme)}
        onPrimaryColorChange={(primaryColor) => update('primaryColor', primaryColor)}
      >
        {children}
      </VisualStateBridge>
    </MantineRegistry>
  );
};

export default VisualManagerRegistry;
