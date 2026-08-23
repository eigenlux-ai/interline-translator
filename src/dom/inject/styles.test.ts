import { describe, expect, it } from 'vitest';
import { KAI_FONT_STACK, PRESET_VISUALS, SRC_FONT_VAR, SRC_LINE_VAR, TRANSLATION_CSS } from './styles';

/**
 * The preset CSS is generated from PRESET_VISUALS (the same data source used by
 * the settings preview). These tests verify that the generated CSS rules match
 * the visual presets and stay synchronized with the settings swatch.
 */
describe('generated preset stylesheet', () => {
  const css = TRANSLATION_CSS.replace(/\s+/g, ' ');

  it('keeps the shared underline base, tinted to the inherited colour', () => {
    // every line-decoration preset carries the faded currentColor underline
    for (const style of ['underline', 'dashed', 'dotted', 'wavy'] as const) {
      expect(css).toContain(`[data-omni-style="${style}"] { text-decoration-line: underline;`);
    }
    expect(css).toContain('text-decoration-color: color-mix(in srgb, currentColor 40%, transparent);');
    expect(css).toContain('text-decoration-style: solid;');
    expect(css).toContain('text-decoration-style: wavy;');
  });

  it('dim, highlight, and blur match their shipped values', () => {
    expect(css).toContain('[data-omni-style="dim"] { opacity: 0.6; }');
    expect(css).toContain('background-color: color-mix(in srgb, var(--aie-omt-accent) 16%, transparent);');
    expect(css).toContain('[data-omni-style="blur"] { filter: blur(4px);');
    // blur reveals on hover, exactly like the swatch
    expect(css).toContain('[data-omni-style="blur"]:hover { filter: none; opacity: 1; }');
  });

  it('block presets keep their block signature and their inline degrade', () => {
    expect(css).toContain(
      'aie-omt-block[data-omni-style="blockquote"] { border-inline-start: 3px solid color-mix(in srgb, var(--aie-omt-accent) 55%, transparent);'
    );
    expect(css).toContain('aie-omt-inline[data-omni-style="blockquote"] { text-decoration: underline;');
    expect(css).toContain(
      'aie-omt-block[data-omni-style="card"] { background-color: color-mix(in srgb, var(--aie-omt-accent) 8%, transparent);'
    );
    expect(css).toContain(
      'aie-omt-inline[data-omni-style="card"] { background-color: color-mix(in srgb, var(--aie-omt-accent) 14%, transparent);'
    );
  });

  it("blend carries no rule of its own — it's the untouched base", () => {
    expect(PRESET_VISUALS.blend).toEqual({});
    expect(css).not.toContain('[data-omni-style="blend"]');
  });

  it('the kai font preset switches to the brush stack, with !important to win over the mirror', () => {
    expect(css).toContain(`[data-omni-font="kai"] { font-family: ${KAI_FONT_STACK} !important; }`);
  });

  it('the three-state view: original hides the 译文; translation collapses the source and restores the gloss from its vars', () => {
    // 仅原文 — one cheap rule, plus its :host-context twin for shadow-root copies.
    expect(css).toContain('html[data-omni-display="original"] [data-omni-translated] { display: none !important; }');
    expect(css).toContain(':host-context(html[data-omni-display="original"]) [data-omni-translated]');
    // 仅译文 — the collapse is GATED on :has(译文): a skipped unit keeps its text.
    expect(css).toContain(
      'html[data-omni-display="translation"] [data-omni-walked]:has([data-omni-translated]) { font-size: 0 !important; line-height: 0 !important; }'
    );
    // Clipped-source fallback: the 译文 is an afterend SIBLING, invisible to
    // :has(descendant) — those sources collapse via their stamped attribute,
    // re-gated on the sibling gloss actually existing (a stale stamp whose
    // gloss was dropped must never vanish the source text).
    expect(css).toContain(
      'html[data-omni-display="translation"] [data-omni-walked][data-omni-clipped]:has(+ [data-omni-translated]) { font-size: 0 !important; line-height: 0 !important; }'
    );
    // The gloss restores its inherited metrics from the per-node vars.
    expect(css).toContain(
      `font-size: var(${SRC_FONT_VAR}, 1rem) !important; line-height: var(${SRC_LINE_VAR}, normal) !important;`
    );
  });
});
