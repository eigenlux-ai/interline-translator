/**
 * @module VisualManager/persistent-util
 *
 * One-shot hydration of visual preferences before first render, so the UI
 * never flashes the wrong theme.
 */

import type { VisualColorScheme, VisualPrimaryColor } from './defs';
import { visualColorSchemeStorage, visualPrimaryColorStorage } from './storages';

export interface VisualPersistentState {
  colorScheme: VisualColorScheme;
  primaryColor: VisualPrimaryColor;
}

export async function getVisualPersistentState(): Promise<VisualPersistentState> {
  const [colorScheme, primaryColor] = await Promise.all([
    visualColorSchemeStorage.getValue(),
    visualPrimaryColorStorage.getValue(),
  ]);
  return { colorScheme, primaryColor };
}
