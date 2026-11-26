/**
 * @module VisualManager/defs
 *
 * Type definitions for the visual/theme subsystem.
 */

import type { MantineColorScheme } from '@mantine/core';

export type VisualColorScheme = MantineColorScheme; // 'auto' | 'light' | 'dark'
/** Mantine palette name (e.g. 'blue') or a hex color (palette generated on the fly). */
export type VisualPrimaryColor = string;

export interface VisualContextValues {
  colorScheme: VisualColorScheme;
  /** Visible scheme after applying the surface strategy and system preference. */
  activeColorScheme: 'light' | 'dark';
  primaryColor: VisualPrimaryColor;
  setColorScheme: (colorScheme: VisualColorScheme) => void;
  /** Toggle the saved preference, resolving 'auto' from the system scheme. */
  toggleColorScheme: () => void;
  setPrimaryColor: (primaryColor: VisualPrimaryColor) => void;
}
