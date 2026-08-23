/**
 * @module managers/ManagersRegistry
 *
 * Composes every manager provider. Add new managers (settings, auth, …)
 * by nesting their registries here and extending the aggregated persistent
 * state — follow the VisualManager file layout as the blueprint.
 */

import type { PropsWithChildren } from 'react';
import type { ManagersPersistentState } from './persistent-util';
import VisualManagerRegistry from './VisualManager/registry';

export interface ManagersRegistryProps extends PropsWithChildren {
  persistentState: ManagersPersistentState;
}

const ManagersRegistry = ({ persistentState, children }: ManagersRegistryProps) => {
  return <VisualManagerRegistry persistentState={persistentState.visual}>{children}</VisualManagerRegistry>;
};

export default ManagersRegistry;
