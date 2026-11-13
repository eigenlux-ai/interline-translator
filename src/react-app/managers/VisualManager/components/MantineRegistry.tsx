/**
 * @module VisualManager/components/MantineRegistry
 *
 * Assembles the full Mantine provider stack. This is THE single place where
 * the SurfaceEnv is translated into Mantine wiring — shadow surfaces and
 * document surfaces differ only here:
 *
 * - cssVariablesSelector / getRootElement → theme root inside the shadow
 * - Portal defaultProps target            → floating layers stay in-shadow
 * - theme.scale                            → rem compensation
 * - forceColorScheme                       → colorSchemeStrategy (external sources
 *   subscribe to the host's painted scheme and re-pin live)
 * - dir attribute + direction context      → the UI locale (rtl for Arabic),
 *   written on OUR root, never on the host's <html>
 *
 * Internal component; application code renders ManagersRegistry instead.
 */

import { useLayoutEffect, useMemo, useState, useSyncExternalStore, type PropsWithChildren } from 'react';
import {
  Combobox,
  createTheme,
  DirectionContext,
  Drawer,
  HoverCard,
  MantineProvider,
  Menu,
  mergeThemeOverrides,
  Modal,
  Popover,
  Tooltip,
  type Direction,
  type MantineThemeOverride,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useSurface } from '@/surface/context';
import { SURFACE_ROOT_CLASS, Z_INDEX } from '@/constants';
import { RTL_UI_LANGS } from '@/data/models/lang';
import { getUiLocale, subscribeUiLocale } from '@/i18n';
import { isCustomPrimaryColor, useGeneratedPrimaryRamp } from '../color-generation';
import { extStorageColorSchemeManager } from '../colorSchemeManager';
import type { VisualColorScheme, VisualPrimaryColor } from '../defs';
import { interlineCssVariables, interlineTheme } from '../theme';

/**
 * Base theme: the project's Interline design tokens (朱/纸/墨 + danger + fonts),
 * plus surface-agnostic defaults. `focusRing: 'auto'` keeps the ring for
 * keyboard focus only. interlineTheme fixes the brand primary to `cinnabar`
 * (virtualColor) — the per-surface override below only displaces it when the
 * user explicitly picks a custom HEX color.
 */
// Stable no-op pair for the strategies that don't watch the host. The
// colorSchemeStrategy is fixed for a surface's lifetime, so the hook's
// subscribe/getSnapshot identity never actually flips at runtime.
const noopSubscribe = () => () => {};
const lightSnapshot = () => 'light' as const;

// Mantine's DirectionContext also carries imperative setters; ours is derived
// from the locale, so there is nothing to set. No @mantine/* component calls
// them (they only read `dir`) — the field exists to satisfy the context type.
const noopSetDirection = () => {};

const baseTheme = mergeThemeOverrides(
  interlineTheme,
  createTheme({
    focusRing: 'auto',
    components: {
      Modal: Modal.extend({
        defaultProps: {
          centered: true,
        },
      }),
    },
  })
);

export interface MantineRegistryProps extends PropsWithChildren {
  colorScheme: VisualColorScheme;
  primaryColor: VisualPrimaryColor;
}

export default function MantineRegistry({ colorScheme, primaryColor, children }: MantineRegistryProps) {
  const env = useSurface();
  const isShadow = env.kind === 'shadow';
  const [colorSchemeManager] = useState(() => extStorageColorSchemeManager(colorScheme));

  // A HEX primary color is an explicit user customization → generate a one-off
  // palette and displace the brand 朱. A NAMED color (the default `cinnabar`,
  // or any Mantine palette name) resolves from the merged base theme, which
  // preserves cinnabar's virtualColor (light/dark ramps) and primaryShade.
  // Generation goes through ../color-generation: a dynamic import keeps
  // chroma-js out of the resident bundle and results are cached per hex. The
  // first generation for a custom hex resolves asynchronously (one frame),
  // during which `colors` is undefined and the brand default shows — see the
  // primaryColor fallback in the theme override below.
  const { colors, baseColorIndex } = useGeneratedPrimaryRamp(primaryColor);

  const theme = useMemo(() => {
    const overrides: MantineThemeOverride = {
      scale: env.scale,
      ...(colors
        ? {
            // Custom HEX: inject the generated ramp as a new primary.
            colors: { primary: colors },
            primaryColor: 'primary',
            primaryShade: baseColorIndex,
          }
        : {
            // Named: let the merged theme resolve it (default = brand cinnabar).
            // A custom HEX still generating has no palette yet — fall back to
            // the brand default for that frame instead of naming a palette
            // that doesn't exist (a hex string is not a palette name).
            primaryColor: isCustomPrimaryColor(primaryColor) ? 'cinnabar' : primaryColor,
          }),
      components: {
        ...(isShadow
          ? {
              // lockScroll mutates the HOST page (react-remove-scroll sets
              // overflow:hidden + rewrites body padding + data attributes on
              // document.body) — never acceptable from an injected surface.
              // `centered` comes from baseTheme; mergeThemeOverrides deep-merges defaultProps.
              Modal: Modal.extend({ defaultProps: { zIndex: Z_INDEX.modal, lockScroll: false } }),
              Drawer: Drawer.extend({ defaultProps: { zIndex: Z_INDEX.modal, lockScroll: false } }),
              // Floating overlays portal to the surface root as SIBLINGS of
              // the main UI — Mantine's default z-index (300) would leave
              // them buried under the panel that opened them. The 'fixed'
              // strategy makes coordinates viewport-based, immune to the
              // shadow-internal offsetParent chain and host page scrolling.
              // This must cover the WHOLE @mantine/core floating family — any
              // uncovered member's dropdown gets buried under the panel.
              Popover: Popover.extend({
                defaultProps: { zIndex: Z_INDEX.popover, floatingStrategy: 'fixed' },
              }),
              Tooltip: Tooltip.extend({
                defaultProps: { zIndex: Z_INDEX.popover, floatingStrategy: 'fixed' },
              }),
              // Cursor-following tooltip variant: accepts zIndex but NOT
              // floatingStrategy (its position is hook-computed, not Floating-UI).
              TooltipFloating: Tooltip.Floating.extend({
                defaultProps: { zIndex: Z_INDEX.popover },
              }),
              Menu: Menu.extend({
                defaultProps: { zIndex: Z_INDEX.popover, floatingStrategy: 'fixed' },
              }),
              HoverCard: HoverCard.extend({
                defaultProps: { zIndex: Z_INDEX.popover, floatingStrategy: 'fixed' },
              }),
              // Extending Combobox covers Select/MultiSelect/Autocomplete/
              // TagsInput too: they render an inner <Combobox> via useProps,
              // and don't pass explicit zIndex/floatingStrategy, so these
              // theme defaults flow through.
              Combobox: Combobox.extend({
                defaultProps: { zIndex: Z_INDEX.popover, floatingStrategy: 'fixed' },
              }),
            }
          : {}),
      },
    };
    const merged = mergeThemeOverrides(baseTheme, createTheme(overrides));
    if (isShadow) {
      // DOM nodes must not pass through Mantine's recursive theme merge.
      const portal = merged.components?.Portal;
      merged.components = {
        ...merged.components,
        Portal: { ...portal, defaultProps: { ...portal?.defaultProps, target: env.portalTarget } },
      };
    }
    return merged;
  }, [env, isShadow, colors, baseColorIndex, primaryColor]);

  // Host detection is supplied by the content entry, keeping the surface core generic.
  const source = typeof env.colorSchemeStrategy === 'object' ? env.colorSchemeStrategy : undefined;
  const externalScheme = useSyncExternalStore(
    source?.subscribe ?? noopSubscribe,
    source?.getSnapshot ?? lightSnapshot,
    source?.getSnapshot ?? lightSnapshot
  );
  const forceColorScheme = source
    ? externalScheme
    : env.colorSchemeStrategy === 'force-light'
      ? 'light'
      : env.colorSchemeStrategy === 'force-dark'
        ? 'dark'
        : undefined;

  // The interface's writing direction belongs to the UI LOCALE: an `ar` UI is
  // rtl, and it must flip the moment the locale switches (the locale follows
  // `translate.target` at runtime), not only on mount.
  //
  // Mantine's own DirectionProvider can't carry this. It seeds its state from
  // `initialDirection` ONCE and never re-reads the prop, `detectDirection`
  // seeds it from the HOST page's <html dir>, and its `setDirection` WRITES
  // that same host attribute — a host mutation we don't allow, and one that
  // couldn't reach `[dir=rtl]` selectors inside our shadow root anyway. So we
  // provide the context ourselves and put the attribute on OUR root, next to
  // Mantine's data-mantine-color-scheme, where both the in-tree UI and every
  // portal (portalTarget is that root, or a descendant of it) inherit it.
  const uiLocale = useSyncExternalStore(subscribeUiLocale, getUiLocale);
  const dir: Direction = RTL_UI_LANGS[uiLocale] ? 'rtl' : 'ltr';
  useLayoutEffect(() => {
    const root = env.rootElement;
    const previous = root.getAttribute('dir');
    root.setAttribute('dir', dir);
    return () => {
      if (previous === null) root.removeAttribute('dir');
      else root.setAttribute('dir', previous);
    };
  }, [env.rootElement, dir]);
  const direction = useMemo(() => ({ dir, setDirection: noopSetDirection, toggleDirection: noopSetDirection }), [dir]);

  return (
    <DirectionContext.Provider value={direction}>
      <MantineProvider
        theme={theme}
        cssVariablesResolver={interlineCssVariables}
        defaultColorScheme={colorScheme}
        forceColorScheme={forceColorScheme}
        colorSchemeManager={colorSchemeManager}
        cssVariablesSelector={isShadow ? `.${SURFACE_ROOT_CLASS}` : ':root'}
        getRootElement={() => env.rootElement}
      >
        <Notifications autoClose={5000} position="top-right" zIndex={isShadow ? Z_INDEX.notification : undefined} />
        <ModalsProvider>{children}</ModalsProvider>
      </MantineProvider>
    </DirectionContext.Provider>
  );
}
