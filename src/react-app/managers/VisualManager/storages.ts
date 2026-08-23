/**
 * @module VisualManager/storages
 *
 * WXT storage bindings for visual preferences. Every surface in every
 * context reads/watches the same items — this is what makes theme changes
 * propagate live across popup, sidepanel and in-page UI with zero code.
 */

import { storage } from '#imports';
import { PROJECT_PREFIX } from '@/constants';
import type { VisualColorScheme, VisualPrimaryColor } from './defs';

export const visualColorSchemeStorage = storage.defineItem<VisualColorScheme>(
  `local:${PROJECT_PREFIX}:visual:color-scheme`,
  { fallback: 'auto' }
);

export const visualPrimaryColorStorage = storage.defineItem<VisualPrimaryColor>(
  `local:${PROJECT_PREFIX}:visual:primary-color`,
  // Brand 朱 (cinnabar) by default; the picker can override with any named/HEX color.
  { fallback: 'cinnabar' }
);
