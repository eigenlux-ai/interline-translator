/**
 * @module managers/persistent-util
 *
 * Aggregated one-shot hydration for all managers, awaited before first
 * render by the bootstrap.
 */

import { getVisualPersistentState, type VisualPersistentState } from './VisualManager/persistent-util';

export interface ManagersPersistentState {
  visual: VisualPersistentState;
}

export async function getManagersPersistentState(): Promise<ManagersPersistentState> {
  const [visual] = await Promise.all([getVisualPersistentState()]);
  return { visual };
}
