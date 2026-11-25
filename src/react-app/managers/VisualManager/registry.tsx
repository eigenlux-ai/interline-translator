/**
 * @module VisualManager/registry
 *
 * Orchestrator of the visual subsystem: owns React state for visual
 * preferences, persists them to WXT storage, and keeps every surface in
 * sync by watching the same storage items (color scheme syncs through the
 * colorSchemeManager; primary color is watched here).
 */

import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import { useSurface } from '@/surface/context';
import { resolvePrimaryColor } from './color-generation';
import MantineRegistry from './components/MantineRegistry';
import VisualContextProvider from './context';
import type { VisualColorScheme, VisualPrimaryColor } from './defs';
import type { VisualPersistentState } from './persistent-util';
import { colorSchemePreference, primaryColorPreference } from './storages';

interface VisualStateBridgeProps extends PropsWithChildren {
  colorScheme: VisualColorScheme;
  primaryColor: VisualPrimaryColor;
  onColorSchemeChange: (colorScheme: VisualColorScheme) => void;
  onPrimaryColorChange: (primaryColor: VisualPrimaryColor) => void;
}

/**
 * Lives inside MantineProvider; consumes Mantine's raw hooks and exposes
 * unified change handlers through the VisualContext. Persistence rules:
 * in `'extension'` mode, color scheme is written once by the colorSchemeManager
 * (via Mantine); under forced/external schemes Mantine's setter is a no-op, so
 * this bridge persists the preference directly. Primary color is
 * always persisted by the manager registry / bridge.
 */
function VisualStateBridge({
  children,
  colorScheme,
  primaryColor,
  onColorSchemeChange,
  onPrimaryColorChange,
}: VisualStateBridgeProps) {
  const env = useSurface();
  const persistDirectly = env.colorSchemeStrategy !== 'extension';
  // keepTransitions: true is required for host isolation, not just for aesthetics.
  // Without it, Mantine's color-scheme toggle injects a global `*{transition:none}`
  // <style> tag into document.head (the host page) for ~10ms on every switch,
  // causing an unintended mutation. Do not remove this option.
  // (Side effect: our own UI animates the theme switch instead of hard-cutting,
  // which is acceptable. A scoped anti-flash inside the shadow root would need a
  // custom implementation.)
  const { setColorScheme: mantineSetColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const activeColorScheme = useComputedColorScheme('light');
  const setColorScheme = useCallback(
    (next: VisualColorScheme) => {
      onColorSchemeChange(next);
      // Under a forced or external scheme, Mantine's setter is a no-op so
      // colorSchemeManager.set never runs; persist directly there and let
      // Mantine handle the single storage write in `'extension'` mode.
      if (persistDirectly) {
        colorSchemePreference.setValue(next).catch((error) => {
          console.warn('[VisualManager] failed to persist color scheme', error);
        });
      } else {
        mantineSetColorScheme(next);
      }
    },
    [onColorSchemeChange, persistDirectly, mantineSetColorScheme]
  );
  const toggleColorScheme = useCallback(() => {
    // Resolve the saved 'auto' preference at click time, even on a forced surface.
    const dark =
      colorScheme === 'auto' ? window.matchMedia('(prefers-color-scheme: dark)').matches : colorScheme === 'dark';
    setColorScheme(dark ? 'light' : 'dark');
  }, [setColorScheme, colorScheme]);
  const setPrimaryColor = useCallback(
    (next: VisualPrimaryColor) => {
      const preference = resolvePrimaryColor(next);
      onPrimaryColorChange(preference);
      primaryColorPreference.setValue(preference).catch((error) => {
        console.warn('[VisualManager] failed to persist primary color', error);
      });
    },
    [onPrimaryColorChange]
  );

  return (
    <VisualContextProvider
      colorScheme={colorScheme}
      activeColorScheme={activeColorScheme}
      primaryColor={primaryColor}
      setColorScheme={setColorScheme}
      toggleColorScheme={toggleColorScheme}
      setPrimaryColor={setPrimaryColor}
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
  const primaryColor = resolvePrimaryColor(state.primaryColor);
  // Per preference: bumped by every newer value (watch event, local change)
  // so a catch-up read cannot overwrite it.
  const revisions = useRef<Record<VisualKey, number>>({ colorScheme: 0, primaryColor: 0 });
  const update = useCallback(<K extends VisualKey>(key: K, value: VisualPersistentState[K]) => {
    revisions.current[key]++;
    setState((s) => (s[key] === value ? s : { ...s, [key]: value }));
  }, []);

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
    const unwatchers = [follow('colorScheme', colorSchemePreference), follow('primaryColor', primaryColorPreference)];
    return () => {
      active = false;
      unwatchers.forEach((unwatch) => unwatch());
    };
  }, [update]);

  const onColorSchemeChange = useCallback(
    (colorScheme: VisualColorScheme) => update('colorScheme', colorScheme),
    [update]
  );

  const onPrimaryColorChange = useCallback(
    (primaryColor: VisualPrimaryColor) => update('primaryColor', primaryColor),
    [update]
  );

  return (
    <MantineRegistry colorScheme={state.colorScheme} primaryColor={primaryColor}>
      <VisualStateBridge
        colorScheme={state.colorScheme}
        primaryColor={primaryColor}
        onColorSchemeChange={onColorSchemeChange}
        onPrimaryColorChange={onPrimaryColorChange}
      >
        {children}
      </VisualStateBridge>
    </MantineRegistry>
  );
};

export default VisualManagerRegistry;
