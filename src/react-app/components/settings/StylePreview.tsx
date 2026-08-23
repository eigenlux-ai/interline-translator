/**
 * @module react-app/components/settings/StylePreview
 *
 * 所见即所得 pickers for the 译文's appearance. Instead of a text dropdown, each
 * bilingual-style preset is a small swatch that renders a real 原文/译文 pair
 * with the preset's ACTUAL declarations — pulled from `PRESET_VISUALS`, the same
 * data the injected stylesheet is generated from (src/dom/inject/styles.ts), so
 * a swatch can never drift from what lands on the page.
 *
 * A swatch is a fixed-height flex column, space-between: the preset name pins to
 * the top, the live sample to the bottom, so the whole grid shares one baseline
 * regardless of a block preset (blockquote/card) being taller than a line one.
 */

import type { CSSProperties } from 'react';
import { Box, SimpleGrid, Text, UnstyledButton, useComputedColorScheme, useMantineTheme } from '@mantine/core';
import { BILINGUAL_STYLES, type BilingualStyle } from '@/data/models';
import { KAI_FONT_STACK, PRESET_ACCENT, PRESET_VISUALS } from '@/dom/inject/styles';
import { m } from '@/paraglide/messages.js';
import { CheckIcon } from '@/react-app/components/icons';
/** Per-preset label lookup — the `Record` keeps it exhaustive when a preset is added. */
const PRESET_LABEL: Record<BilingualStyle, () => string> = {
  blend: m.style_blend,
  dim: m.style_dim,
  underline: m.style_underline,
  dashed: m.style_dashed,
  dotted: m.style_dotted,
  wavy: m.style_wavy,
  highlight: m.style_highlight,
  blockquote: m.style_blockquote,
  card: m.style_card,
  blur: m.style_blur,
};

type Scheme = 'light' | 'dark';

interface Tokens {
  gloss: string;
  inkFaint: string;
  hair: string;
  paper: string;
  accent: string;
}

/** Merge a preset's declarations into a React style object (block signature wins when it exists). */
function presetSampleStyle(preset: BilingualStyle): CSSProperties {
  const v = PRESET_VISUALS[preset];
  const layout = v.block ?? v.inline; // show the block identity (bar/panel) where a preset has one
  return { ...(v.common ?? {}), ...(layout ?? {}), ['--aie-omt-accent' as string]: PRESET_ACCENT } as CSSProperties;
}

/** One preset swatch: name on top, a live 原文/译文 sample below, 朱 ring + tick when active. */
function StyleSwatch({
  preset,
  active,
  font,
  tokens,
  compact,
  onSelect,
}: {
  preset: BilingualStyle;
  active: boolean;
  font: 'kai' | 'inherit';
  tokens: Tokens;
  compact: boolean;
  onSelect: () => void;
}) {
  const isBlur = preset === 'blur';
  const glossFont = font === 'kai' ? KAI_FONT_STACK : 'inherit';
  const sampleFontSize = compact ? 12 : 14;

  return (
    <UnstyledButton
      onClick={onSelect}
      aria-pressed={active}
      aria-label={m.style_aria({ label: PRESET_LABEL[preset]() })}
      data-blur-swatch={isBlur ? '' : undefined}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: compact ? 5 : 8,
        minHeight: compact ? 58 : 74,
        padding: compact ? '7px 8px' : '9px 10px',
        borderRadius: 8,
        background: tokens.paper,
        border: `1px solid ${active ? tokens.accent : tokens.hair}`,
        boxShadow: active ? `inset 0 0 0 1px ${tokens.accent}` : 'none',
        transition: 'border-color 120ms ease, box-shadow 120ms ease',
        textAlign: 'left',
        overflow: 'hidden',
      }}
    >
      <Text
        component="span"
        style={{
          fontSize: compact ? 11 : 12,
          fontWeight: active ? 600 : 500,
          color: active ? tokens.accent : tokens.inkFaint,
          lineHeight: 1,
          letterSpacing: '0.01em',
        }}
      >
        {PRESET_LABEL[preset]()}
      </Text>

      {/* Live sample — a faint 原文 echo (roomy only) over the styled 译文. The
          pair is localized MIRRORED: the 译文 sample is in the reader's own
          language (zh UI demos en→zh, en UI demos zh→en), so the swatch always
          previews what a gloss would look like for THIS user; the compact
          gloss fits the narrow ball panel. */}
      <Box component="span" style={{ display: 'block' }}>
        {!compact && (
          <Text
            component="span"
            style={{ display: 'block', fontSize: 9, color: tokens.inkFaint, lineHeight: 1.2, opacity: 0.7 }}
          >
            {m.style_sample_source()}
          </Text>
        )}
        <Box
          component="span"
          className="aie-omt-swatch-gloss"
          style={{
            display: 'block',
            marginTop: compact ? 0 : 2,
            fontFamily: glossFont,
            fontSize: sampleFontSize,
            lineHeight: 1.4,
            color: tokens.gloss,
            width: 'fit-content',
            maxWidth: '100%',
            ...presetSampleStyle(preset),
          }}
        >
          {compact ? m.style_sample_gloss_compact() : m.style_sample_gloss()}
        </Box>
      </Box>
    </UnstyledButton>
  );
}

export interface StylePreviewProps {
  value: BilingualStyle;
  onChange: (value: BilingualStyle) => void;
  /** Render the samples in the currently-selected 译文 font, so the two pickers stay consistent. */
  font: 'kai' | 'inherit';
  /** Denser grid + smaller swatches for the floating-ball panel. */
  compact?: boolean;
  /** Palette overrides (the glass ball panel supplies its own); defaults to the Mantine theme. */
  palette?: Tokens;
}

/**
 * The bilingual-style picker: a grid of live swatches. `blur` reveals on hover,
 * exactly as it does on the page — the swatch is its own explanation.
 */
export default function StylePreview({ value, onChange, font, compact = false, palette }: StylePreviewProps) {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('light') as Scheme;
  const other = theme.other as {
    gloss: Record<Scheme, string>;
    inkFaint: Record<Scheme, string>;
    hair: Record<Scheme, string>;
    paperRaised: Record<Scheme, string>;
  };
  const tokens: Tokens = palette ?? {
    gloss: other.gloss[scheme],
    inkFaint: other.inkFaint[scheme],
    hair: other.hair[scheme],
    paper: other.paperRaised[scheme],
    accent: PRESET_ACCENT,
  };

  return (
    <>
      {/* blur-to-learn: masked by default, cleared on hover — matches the page. */}
      <style>{`.aie-omt-swatch-gloss{transition:filter .12s ease,opacity .12s ease}
[data-blur-swatch]:hover .aie-omt-swatch-gloss{filter:none!important;opacity:1!important}`}</style>
      <SimpleGrid
        cols={compact ? 4 : { base: 3, xs: 4, sm: 5 }}
        spacing={compact ? 6 : 8}
        verticalSpacing={compact ? 6 : 8}
      >
        {BILINGUAL_STYLES.map((preset) => (
          <StyleSwatch
            key={preset}
            preset={preset}
            active={preset === value}
            font={font}
            tokens={tokens}
            compact={compact}
            onSelect={() => onChange(preset)}
          />
        ))}
      </SimpleGrid>
    </>
  );
}

export interface FontPreviewProps {
  value: 'kai' | 'inherit';
  onChange: (value: 'kai' | 'inherit') => void;
}

const FONT_OPTIONS: { value: 'kai' | 'inherit'; stack: string }[] = [
  { value: 'kai', stack: KAI_FONT_STACK },
  { value: 'inherit', stack: 'inherit' },
];

/** The 译文 font picker: two cards, each rendering the same phrase in that font. */
export function FontPreview({ value, onChange }: FontPreviewProps) {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('light') as Scheme;
  const other = theme.other as {
    gloss: Record<Scheme, string>;
    inkFaint: Record<Scheme, string>;
    hair: Record<Scheme, string>;
    paperRaised: Record<Scheme, string>;
  };

  return (
    <SimpleGrid cols={2} spacing={10}>
      {FONT_OPTIONS.map((opt) => {
        const active = opt.value === value;
        const label = opt.value === 'kai' ? m.style_font_kai() : m.style_font_inherit();
        return (
          <UnstyledButton
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            aria-label={m.style_font_aria({ label })}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              padding: '12px 14px',
              borderRadius: 8,
              background: other.paperRaised[scheme],
              border: `1px solid ${active ? PRESET_ACCENT : other.hair[scheme]}`,
              boxShadow: active ? `inset 0 0 0 1.5px ${PRESET_ACCENT}, 0 2px 8px rgba(194, 64, 42, 0.08)` : 'none',
              transition: 'border-color 140ms ease, box-shadow 140ms ease',
              textAlign: 'left',
            }}
          >
            <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text
                component="span"
                style={{
                  fontSize: 13,
                  fontWeight: active ? 600 : 500,
                  color: active ? PRESET_ACCENT : 'var(--mantine-color-text)',
                  lineHeight: 1,
                }}
              >
                {label}
              </Text>
              {active && (
                <Box
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: PRESET_ACCENT,
                    color: '#FFFDF8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CheckIcon width={10} height={10} strokeWidth={2.5} />
                </Box>
              )}
            </Box>
            <Text
              component="span"
              style={{ fontFamily: opt.stack, fontSize: 16, lineHeight: 1.4, color: other.gloss[scheme] }}
            >
              {m.style_sample_gloss()}
            </Text>
            <Text
              component="span"
              style={{
                fontFamily: opt.stack,
                fontSize: 12,
                lineHeight: 1.4,
                color: other.inkFaint[scheme],
                opacity: 0.85,
              }}
            >
              {opt.value === 'kai' ? '落霞与孤鹜齐飞，秋水共长天一色。' : 'The quick brown fox jumps over the lazy dog.'}
            </Text>
          </UnstyledButton>
        );
      })}
    </SimpleGrid>
  );
}
