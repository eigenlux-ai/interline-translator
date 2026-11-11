/**
 * @module VisualManager/theme
 *
 * Interline · 行间 — Mantine 9 design tokens.
 *
 * Two-layer encoding:
 *   identity = cinnabar accent / glacier & obsidian neutrals / kai font option for translations
 *   mechanics = 10-step color ramps, consistent elevation, and subtle dividers.
 * This is merged as the BASE theme in MantineRegistry; per-surface overrides
 * (portal target, zIndex, floatingStrategy, scale) layer on top.
 */

import {
  createTheme,
  SegmentedControl,
  virtualColor,
  type CSSVariablesResolver,
  type MantineColorsTuple,
} from '@mantine/core';
import { cinnabarDark, cinnabarLight, dangerDark, dangerLight } from './color-ramps';

/* ── 朱 cinnabar: the single accent / primary.
 *   The ramp generator emits ONE 10-step ramp (not light+dark); default
 *   light/dark difference is only a primaryShade index swap. Our 朱 must be
 *   precise in BOTH schemes, so each scheme has its own ramp, pinned with
 *   virtualColor (Mantine 7.7+), 10 steps each. The four ramps come PRECOMPUTED
 *   from ./color-ramps (generated once from @mantine/colors-generator) so this
 *   module does not statically import that package — see color-ramps.ts for why
 *   (chroma-js resident-bundle weight) and color-ramps.test.ts for the pin. ── */

/* ── danger: a cool deep red for error + destructive actions. The brand cinnabar
 *   is a warm orange-red; danger sits on the cool side so the two never collide.
 *   Error states always pair icon + copy, never colour alone.
 *   In global.css we map `--mantine-color-error` → `--mantine-color-danger-6`
 *   (auto-follows scheme through virtualColor). dangerLight/dangerDark come
 *   precomputed from ./color-ramps like the 朱 ramps. ── */

/* Warm earth and amber roles around glacier daylight and obsidian night; cinnabar remains the primary action. */
const sand: MantineColorsTuple = [
  '#F6F8FB',
  '#F2F1EE',
  '#E5E1DB',
  '#D3CDC3',
  '#91877B',
  '#766B60',
  '#62584E',
  '#514233',
  '#382D25',
  '#2C241F',
];
const charcoal: MantineColorsTuple = [
  '#F5EBDD',
  '#E8D8C2',
  '#C8B69E',
  '#B39C7E',
  '#8B755A',
  '#695039',
  '#30261D',
  '#1B1714',
  '#09090B',
  '#080706',
];

export const interlineTheme = createTheme({
  primaryColor: 'cinnabar',
  primaryShade: 6, // same index both schemes; the colour difference comes from virtualColor's two ramps
  colors: {
    cinnabarLight,
    cinnabarDark,
    cinnabar: virtualColor({ name: 'cinnabar', light: 'cinnabarLight', dark: 'cinnabarDark' }),
    dangerLight,
    dangerDark,
    danger: virtualColor({ name: 'danger', light: 'dangerLight', dark: 'dangerDark' }),
    sand,
    dark: charcoal,
  },

  white: '#FFFFFF', // raised card (paper-raised)
  black: '#2C241F', // ink

  /* ── Fonts: typography scale and font stacks ── */
  fontFamily: '"Hanken Grotesk", ui-sans-serif, system-ui, sans-serif', // UI/utility
  fontFamilyMonospace: '"Spline Sans Mono", ui-monospace, monospace', // codes/model names/shortcuts
  headings: {
    fontFamily: '"EB Garamond", Georgia, "Songti SC", serif', // brand/headings/source serif
    fontWeight: '600',
  },

  defaultRadius: 'sm',
  radius: { xs: '4px', sm: '6px', md: '9px', lg: '14px', xl: '20px' },

  /* ── Elevation system: layered shadows ── */
  shadows: {
    xs: '0 1px 2px rgba(81,55,31,.04), 0 1px 3px rgba(81,55,31,.06)',
    sm: '0 1px 2px rgba(81,55,31,.05), 0 4px 12px -2px rgba(81,55,31,.08), 0 2px 6px -1px rgba(81,55,31,.04)',
    md: '0 1px 3px rgba(81,55,31,.05), 0 8px 24px -6px rgba(81,55,31,.14), 0 3px 8px -2px rgba(81,55,31,.06)', // popover
    lg: '0 2px 4px rgba(81,55,31,.05), 0 16px 36px -8px rgba(81,55,31,.18), 0 4px 12px -2px rgba(81,55,31,.08)',
    xl: '0 4px 8px rgba(81,55,31,.06), 0 24px 52px -12px rgba(81,55,31,.24), 0 6px 16px -4px rgba(81,55,31,.10)',
  },

  components: {
    SegmentedControl: SegmentedControl.extend({
      styles: {
        root: {
          backgroundColor: 'var(--interline-segment-track)',
          border: '1px solid var(--interline-segment-border)',
          '--sc-color': 'var(--interline-segment-selected)',
        },
      },
    }),
  },

  cursorType: 'pointer',
  fontSmoothing: true,

  /* ── Custom identity tokens, shared across surfaces (via theme.other) ── */
  other: {
    // Translation font = LXGW WenKai (classical annotation hand); used for all译文.
    fontKai: '"LXGW WenKai", "Kaiti SC", "Noto Serif SC", serif',
    fontSerif: '"EB Garamond", Georgia, "Songti SC", serif',
    gloss: { light: '#514233', dark: '#E0CFB7' },
    paper: { light: '#FCFAF7', dark: '#09090B' },
    paperRaised: { light: '#FFFFFF', dark: '#1B1714' },
    inkSoft: { light: '#62584E', dark: '#C8B69E' },
    inkFaint: { light: '#766B60', dark: '#B39C7E' },
    hair: { light: 'rgba(81,55,31,.12)', dark: 'rgba(245,222,185,.13)' },
    hairStrong: { light: 'rgba(81,55,31,.22)', dark: 'rgba(245,222,185,.24)' },
    cardBorder: { light: 'rgba(81,55,31,.08)', dark: 'rgba(245,222,185,.1)' },
    badgeBg: { light: 'rgba(81,55,31,.05)', dark: 'rgba(245,222,185,.07)' },
    focusRing: '0 0 0 2px var(--mantine-color-cinnabar-5)',
    cinnabarWash: { light: 'rgba(194,64,42,.08)', dark: 'rgba(226,97,74,.12)' },
    cinnabarInk: { light: '#A73522', dark: '#F28B76' },
    glossTick: { width: '3px', radius: '2px' },
  },
});

export type InterlineTheme = typeof interlineTheme;

/** Scheme roles belong in Mantine's generated variables, alongside its defaults. */
export const interlineCssVariables: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {
    ...Object.fromEntries(sand.map((color, index) => [`--mantine-color-gray-${index}`, color])),
    '--mantine-color-body': theme.other.paper.light,
    '--mantine-color-text': '#2C241F',
    '--mantine-color-dimmed': '#62584E',
    '--mantine-color-placeholder': '#766B60',
    '--mantine-color-default': theme.other.paperRaised.light,
    '--mantine-color-default-color': '#2C241F',
    '--mantine-color-default-hover': '#F2F1EE',
    '--mantine-color-default-border': '#91877B',
    '--mantine-color-disabled': '#F2F1EE',
    '--mantine-color-disabled-color': '#766B60',
    '--interline-segment-track': '#F3EDE7',
    '--interline-segment-border': '#E5DAD0',
    '--interline-segment-selected': '#FFFFFF',
    '--interline-reading-surface': '#FFFCF8',
    '--interline-selection-surface': '#FBF0E6',
    '--interline-focus': '#A73522',
    '--interline-accent-ink': '#A73522',
    '--mantine-color-cinnabar-text': '#A73522',
    '--mantine-color-cinnabar-light': '#FBEEE8',
    '--mantine-color-cinnabar-light-hover': '#F7E2D6',
    '--mantine-primary-color-filled': `var(--mantine-color-${theme.primaryColor}-filled)`,
    '--mantine-color-cinnabar-filled': '#B63E2A',
    '--mantine-color-cinnabar-filled-hover': '#9F3323',
  },
  dark: {
    '--mantine-color-body': theme.other.paper.dark,
    '--mantine-color-text': '#F5EBDD',
    '--mantine-color-dimmed': '#C8B69E',
    '--mantine-color-placeholder': '#B39C7E',
    '--mantine-color-default': theme.other.paperRaised.dark,
    '--mantine-color-default-color': '#F5EBDD',
    '--mantine-color-default-hover': '#30261D',
    '--mantine-color-default-border': '#8B755A',
    '--mantine-color-disabled': '#30261D',
    '--mantine-color-disabled-color': '#B39C7E',
    '--interline-segment-track': '#30261D',
    '--interline-segment-border': '#8B755A',
    '--interline-segment-selected': '#85551F',
    '--interline-reading-surface': '#211B12',
    '--interline-selection-surface': '#392918',
    '--interline-focus': '#F28B76',
    '--interline-accent-ink': '#F28B76',
    '--mantine-color-cinnabar-text': '#F28B76',
    '--mantine-color-cinnabar-light': '#382417',
    '--mantine-color-cinnabar-light-hover': '#49301B',
    '--mantine-primary-color-filled': `var(--mantine-color-${theme.primaryColor}-filled)`,
    '--mantine-color-cinnabar-filled': '#B63E2A',
    '--mantine-color-cinnabar-filled-hover': '#C44732',
  },
});
