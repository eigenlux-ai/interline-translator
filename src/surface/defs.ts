/**
 * @module surface/defs
 *
 * The isomorphic surface contract. A SurfaceEnv describes everything that
 * differs between extension mount points (popup, sidepanel, options, in-page
 * shadow DOM, …). UI code never branches on the mount point — it consumes
 * the environment through `useSurface()` and the Mantine provider stack is
 * wired from these fields in exactly one place (MantineRegistry).
 */

export type SurfaceKind = 'document' | 'shadow';

/**
 * How the surface resolves its color scheme.
 *
 * - `extension`  — follow the extension-wide setting (WXT storage, synced
 *                  live across every surface). The default everywhere.
 * - `force-light` / `force-dark` — pin the scheme. Escape hatch for in-page
 *   UI that must not depend on the user's extension-wide preference.
 * - `follow-host` — live-track the HOST page's painted scheme (see
 *   dom/host-scheme): re-detected when html/body attributes change or the OS
 *   preference flips, so a host theme switch re-skins the mounted surface.
 *   For in-page floating UI that must match the page it hovers over.
 */
export type ColorSchemeStrategy = 'extension' | 'force-light' | 'force-dark' | 'follow-host';

export interface SurfaceEnv {
  kind: SurfaceKind;
  /**
   * Element Mantine treats as the theme root: receives the
   * `data-mantine-color-scheme` attribute and scopes the CSS variable tree
   * (`cssVariablesSelector`).
   */
  rootElement: HTMLElement;
  /** Default target for every Mantine Portal (Modal/Popover/Tooltip/…). */
  portalTarget: HTMLElement;
  /**
   * rem compensation. rem resolves against the HOST page's `<html>` font
   * size even inside shadow DOM, so pages using e.g. `font-size: 62.5%`
   * would shrink the UI. Shadow surfaces set `theme.scale` to
   * `16 / hostRootFontSize`; document surfaces are always `1`.
   *
   * Limitation: measured ONCE at surface creation. Hosts that change their
   * root font size at runtime are not tracked (re-create the surface, or
   * re-measure via computeHostRemScale, if that ever matters).
   */
  scale: number;
  colorSchemeStrategy: ColorSchemeStrategy;
  /** Present only for `kind: 'shadow'`. */
  shadowRoot?: ShadowRoot;
}
