/**
 * @module surface/context
 *
 * React access to the current SurfaceEnv. Business code must use
 * `useSurface()` instead of touching `document.body` /
 * `document.documentElement` directly — that is the one discipline that
 * keeps components isomorphic across mount points.
 */

import { createContext, useContext, type PropsWithChildren } from 'react';
import type { SurfaceEnv } from './defs';

const SurfaceContext = createContext<SurfaceEnv | null>(null);

export function SurfaceProvider({ env, children }: PropsWithChildren<{ env: SurfaceEnv }>) {
  return <SurfaceContext.Provider value={env}>{children}</SurfaceContext.Provider>;
}

export function useSurface(): SurfaceEnv {
  const env = useContext(SurfaceContext);
  if (!env) {
    throw new Error('useSurface must be used inside a SurfaceProvider (see react-app/bootstrap.tsx)');
  }
  return env;
}
