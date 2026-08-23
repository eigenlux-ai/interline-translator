/**
 * @module react-app/bootstrap
 *
 * The one renderer every surface uses. Entry points stay ~3 lines:
 * build a SurfaceEnv (documentSurface() or via createShadowSurfaceUi) and
 * hand it here together with the app node.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { SurfaceProvider } from '@/surface/context';
import type { SurfaceEnv } from '@/surface/defs';
import { SatelliteOutlet } from '@/surface/satellite';
import { useSurfaceLang } from '@/react-app/hooks/useSurfaceLang';
import ManagersRegistry from '@/react-app/managers/ManagersRegistry';
import { getManagersPersistentState } from '@/react-app/managers/persistent-util';
import '@/react-app/styles/global.css';

/** Renders nothing — it exists so the `lang` stamp runs inside the providers. */
function SurfaceLang(): null {
  useSurfaceLang();
  return null;
}

export async function renderSurfaceApp(
  container: HTMLElement,
  env: SurfaceEnv,
  app: React.ReactNode
): Promise<ReactDOM.Root> {
  // Hydrate persisted state before first paint — no theme flash.
  const persistentState = await getManagersPersistentState();

  const root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <SurfaceProvider env={env}>
        <ManagersRegistry persistentState={persistentState}>
          <SurfaceLang />
          {/* Inside the providers on purpose: satellites portal into this tree,
              so they inherit theme/managers/modals context for free. */}
          <SatelliteOutlet />
          {app}
        </ManagersRegistry>
      </SurfaceProvider>
    </React.StrictMode>
  );
  return root;
}
