/**
 * @module surface/document
 *
 * SurfaceEnv factory for HTML-page mount points: popup, sidepanel, options,
 * tab pages — anything where the extension owns the whole document. These
 * need no isolation plumbing, so the env is just the document's natural
 * roots with scale 1.
 */

import type { ColorSchemeStrategy, SurfaceEnv } from './defs';

export interface DocumentSurfaceOptions {
  colorSchemeStrategy?: ColorSchemeStrategy;
}

export function documentSurface(options?: DocumentSurfaceOptions): SurfaceEnv {
  return {
    kind: 'document',
    rootElement: document.documentElement,
    portalTarget: document.body,
    scale: 1,
    colorSchemeStrategy: options?.colorSchemeStrategy ?? 'extension',
  };
}
