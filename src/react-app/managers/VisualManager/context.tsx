/**
 * @module VisualManager/context
 *
 * Public hook surface of the visual subsystem. Components call `useVisual()`
 * for every theme operation; they never touch Mantine's raw hooks or the
 * storage layer directly.
 */

import { createContext, useContext, useMemo, type PropsWithChildren } from 'react';
import type { VisualContextValues } from './defs';

const VisualContext = createContext<VisualContextValues | null>(null);

export function useVisual(): VisualContextValues {
  const context = useContext(VisualContext);
  if (!context) {
    throw new Error('useVisual must be used inside ManagersRegistry');
  }
  return context;
}

export default function VisualContextProvider({
  children,
  colorScheme,
  activeColorScheme,
  primaryColor,
  setColorScheme,
  toggleColorScheme,
  setPrimaryColor,
}: PropsWithChildren<VisualContextValues>) {
  const memoized = useMemo(
    () => ({
      colorScheme,
      activeColorScheme,
      primaryColor,
      setColorScheme,
      toggleColorScheme,
      setPrimaryColor,
    }),
    [colorScheme, activeColorScheme, primaryColor, setColorScheme, toggleColorScheme, setPrimaryColor]
  );
  return <VisualContext.Provider value={memoized}>{children}</VisualContext.Provider>;
}
