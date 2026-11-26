/**
 * @module VisualManager/registry
 *
 * Orchestrator of the visual subsystem: owns React state for visual
 * preferences, persists them to WXT storage, and keeps every surface in
 * sync by watching the same storage items.
 */

import { useCallback, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { useSurface } from '@/surface/context';
import { getSystemColorScheme, useSurfaceColorScheme } from '@/surface/use-color-scheme';
import { resolvePrimaryColor } from './color-generation';
import MantineRegistry from './components/MantineRegistry';
import VisualContextProvider from './context';
import type { VisualColorScheme, VisualPrimaryColor } from './defs';
import type { VisualPersistentState } from './persistent-util';
import { colorSchemePreference, primaryColorPreference } from './storages';

export interface VisualManagerRegistryProps extends PropsWithChildren {
  persistentState: VisualPersistentState;
}

type VisualKey = keyof VisualPersistentState;

const VisualManagerRegistry = ({ persistentState, children }: VisualManagerRegistryProps) => {
  const [state, setState] = useState(persistentState);
  const env = useSurface();
  const activeColorScheme = useSurfaceColorScheme(state.colorScheme, env.colorSchemeStrategy);
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

  const setColorScheme = useCallback(
    (next: VisualColorScheme) => {
      update('colorScheme', next);
      colorSchemePreference.setValue(next).catch((error) => {
        console.warn('[VisualManager] failed to persist color scheme', error);
      });
    },
    [update]
  );

  const toggleColorScheme = useCallback(() => {
    const saved = state.colorScheme === 'auto' ? getSystemColorScheme() : state.colorScheme;
    setColorScheme(saved === 'dark' ? 'light' : 'dark');
  }, [state.colorScheme, setColorScheme]);

  const setPrimaryColor = useCallback(
    (next: VisualPrimaryColor) => {
      const preference = resolvePrimaryColor(next);
      update('primaryColor', preference);
      primaryColorPreference.setValue(preference).catch((error) => {
        console.warn('[VisualManager] failed to persist primary color', error);
      });
    },
    [update]
  );

  return (
    <MantineRegistry colorScheme={activeColorScheme} primaryColor={primaryColor}>
      <VisualContextProvider
        colorScheme={state.colorScheme}
        activeColorScheme={activeColorScheme}
        primaryColor={primaryColor}
        setColorScheme={setColorScheme}
        toggleColorScheme={toggleColorScheme}
        setPrimaryColor={setPrimaryColor}
      >
        {children}
      </VisualContextProvider>
    </MantineRegistry>
  );
};

export default VisualManagerRegistry;
