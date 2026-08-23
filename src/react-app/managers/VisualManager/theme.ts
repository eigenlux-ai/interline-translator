/**
 * @module VisualManager/theme
 *
 * Interline · 行间 — Mantine 9 design tokens.
 *
 * Two-layer encoding:
 *   identity = cinnabar accent / warm ink & paper neutrals / kai font option for translations
 *   mechanics = 10-step color ramps, consistent elevation, and subtle dividers.
 * This is merged as the BASE theme in MantineRegistry; per-surface overrides
 * (portal target, zIndex, floatingStrategy, scale) layer on top.
 */

import { generateColors } from '@mantine/colors-generator';
import { createTheme, virtualColor, type MantineColorsTuple } from '@mantine/core';

/* ── 朱 cinnabar: the single accent / primary.
 *   generateColors emits ONE 10-step ramp (not light+dark); default light/dark
 *   difference is only a primaryShade index swap. Our 朱 must be precise in BOTH
 *   schemes, so we generate a ramp for each and pin them with virtualColor
 *   (Mantine 7.7+), with 10 steps each. ── */
const cinnabarLight: MantineColorsTuple = generateColors('#C2402A'); // light 朱
const cinnabarDark: MantineColorsTuple = generateColors('#E2614A'); // dark 朱 (brighter/warmer, pops on dark)

/* ── danger: a cool deep red for error + destructive actions. The brand cinnabar
 *   is a warm orange-red; danger sits on the cool side so the two never collide.
 *   Error states always pair icon + copy, never colour alone.
 *   In global.css we map `--mantine-color-error` → `--mantine-color-danger-6`
 *   (auto-follows scheme through virtualColor). ── */
const dangerLight: MantineColorsTuple = generateColors('#A81D2D'); // error/danger (light, cool deep red)
const dangerDark: MantineColorsTuple = generateColors('#E04C5C'); // error/danger (dark, brightened cool red)

/* ── 暖灰 sand: warm neutral ramp (paper → ink). Text hierarchy de-emphasises
 *   via this ramp; never grey text on a coloured ground. ── */
const sand: MantineColorsTuple = [
  '#FAF6EE', // 0 paper      — body bg (light)
  '#F1EBDF', // 1
  '#E3DACA', // 2
  '#CFC4B0', // 3 hairline
  '#B3A893', // 4
  '#93897A', // 5
  '#74695B', // 6 ink-faint  — tertiary text/placeholder
  '#574E42', // 7
  '#3A332A', // 8 gloss      — translation ink (softer than body)
  '#211C15', // 9 ink        — body/headings
];

/* ── 暖炭 charcoal: overrides Mantine `dark` for a WARM dark mode
 *   (0 = lightest/text, 9 = deepest). ── */
const charcoal: MantineColorsTuple = [
  '#ECE4D6', // 0 text (dark)
  '#D8CFBE', // 1
  '#B3A893', // 2 ink-soft (dark)
  '#8A8073', // 3
  '#6A6051', // 4 dimmed/placeholder
  '#463E33', // 5
  '#2D2820', // 6 borders/hair
  '#1E1A14', // 7 raised surface / default component bg
  '#16130E', // 8 body bg (dark)
  '#0E0B07', // 9 deepest
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

  white: '#FFFDF8', // raised card (paper-raised)
  black: '#211C15', // ink

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
    xs: '0 1px 2px rgba(33,28,21,.04), 0 1px 3px rgba(33,28,21,.06)',
    sm: '0 1px 2px rgba(33,28,21,.05), 0 4px 12px -2px rgba(33,28,21,.08), 0 2px 6px -1px rgba(33,28,21,.04)',
    md: '0 1px 3px rgba(33,28,21,.05), 0 8px 24px -6px rgba(33,28,21,.14), 0 3px 8px -2px rgba(33,28,21,.06)', // popover
    lg: '0 2px 4px rgba(33,28,21,.05), 0 16px 36px -8px rgba(33,28,21,.18), 0 4px 12px -2px rgba(33,28,21,.08)',
    xl: '0 4px 8px rgba(33,28,21,.06), 0 24px 52px -12px rgba(33,28,21,.24), 0 6px 16px -4px rgba(33,28,21,.10)',
  },

  cursorType: 'pointer',
  fontSmoothing: true,

  /* ── Custom identity tokens, shared across surfaces (via theme.other) ── */
  other: {
    // Translation font = LXGW WenKai (classical annotation hand); used for all译文.
    fontKai: '"LXGW WenKai", "Kaiti SC", "Noto Serif SC", serif',
    fontSerif: '"EB Garamond", Georgia, "Songti SC", serif',
    gloss: { light: '#3A332A', dark: '#D8CFBE' },
    paper: { light: '#FAF6EE', dark: '#16130E' },
    paperRaised: { light: '#FFFDF8', dark: '#1E1A14' },
    inkSoft: { light: '#5C5348', dark: '#B3A893' },
    inkFaint: { light: '#8A8073', dark: '#7D7464' },
    hair: { light: 'rgba(33,28,21,.12)', dark: 'rgba(236,228,214,.13)' },
    hairStrong: { light: 'rgba(33,28,21,.22)', dark: 'rgba(236,228,214,.24)' },
    cardBorder: { light: 'rgba(33,28,21,.08)', dark: 'rgba(236,228,214,.1)' },
    badgeBg: { light: 'rgba(33,28,21,.05)', dark: 'rgba(236,228,214,.07)' },
    focusRing: '0 0 0 2px var(--mantine-color-cinnabar-5)',
    cinnabarWash: { light: 'rgba(194,64,42,.08)', dark: 'rgba(226,97,74,.12)' },
    cinnabarInk: { light: '#9C3320', dark: '#F07A63' },
    glossTick: { width: '3px', radius: '2px' },
  },
});

export type InterlineTheme = typeof interlineTheme;
