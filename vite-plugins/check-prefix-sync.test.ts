import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { findPrefixMismatches, readProjectPrefix, zIndexVariables } from './check-prefix-sync';

// A minimal global.css stand-in templated on a prefix, so we can assert the
// detector fires only when the file and the prefix disagree.
const cssFor = (prefix: string) => `
:root,
.${prefix}-surface-root {
  ${zIndexVariables(prefix)
    .map(({ name, value }) => `${name}: ${value};`)
    .join('\n  ')}
  --${prefix}-sb-track-color: transparent;
  --${prefix}-sb-thumb-color: #868e96;
  --${prefix}-sb-size: 5px;
}
.${prefix}-surface-root { color: red; }
::-webkit-scrollbar { width: var(--${prefix}-sb-size); height: var(--${prefix}-sb-size); }
::-webkit-scrollbar-track { background: var(--${prefix}-sb-track-color); }
::-webkit-scrollbar-thumb { background: var(--${prefix}-sb-thumb-color); }
`;

describe('findPrefixMismatches', () => {
  it('returns no errors when global.css matches the prefix', () => {
    expect(findPrefixMismatches(cssFor('aie'), 'aie')).toEqual([]);
    expect(findPrefixMismatches(cssFor('zzz'), 'zzz')).toEqual([]);
  });

  it('reports each missing layer even when main-ui still matches', () => {
    const css = cssFor('new').replace('--new-z-popover:', '--old-z-popover:').replace('--new-z-max:', '--old-z-max:');
    const errors = findPrefixMismatches(css, 'new');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('--new-z-popover, --new-z-max');
    expect(errors[0]).not.toContain('--new-z-main-ui');
  });

  it('flags all anchors and names the stale prefix when out of sync', () => {
    const errors = findPrefixMismatches(cssFor('aie'), 'zzz');
    expect(errors).toHaveLength(3);
    // surface-root mismatch points at what to add AND what is currently there
    expect(errors[0]).toContain('.zzz-surface-root');
    expect(errors[0]).toContain("PROJECT_PREFIX ('zzz')");
    expect(errors[0]).toContain('.aie-surface-root'); // stale prefix surfaced
    // z-var mismatch
    expect(errors[1]).toContain('--zzz-z-main-ui');
    // scrollbar-var mismatch
    expect(errors[2]).toContain('missing declarations (--zzz-sb-track-color');
    expect(errors[2]).toContain('missing var() references (--zzz-sb-track-color');
    expect(errors[2]).toContain('--zzz-sb-thumb-color');
  });

  it('reports a hyphenated stale prefix in full in the hint', () => {
    // A fork that previously used `.my-ext-surface-root` then renamed the prefix:
    // the hint must surface the whole stale prefix, not truncate at the hyphen.
    const errors = findPrefixMismatches('.my-ext-surface-root {}\n--my-ext-z-main-ui: 1;', 'new');
    expect(errors[0]).toContain('.my-ext-surface-root');
  });

  it('flags only the surface-root anchor when just that one drifts', () => {
    // z-vars and sb-vars already renamed to the new prefix, but the surface-root class forgotten
    const partial = cssFor('new').replaceAll('.new-surface-root', '.old-surface-root');
    const errors = findPrefixMismatches(partial, 'new');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('.new-surface-root');
    expect(errors[0]).toContain('.old-surface-root'); // stale prefix surfaced
  });

  it('flags scrollbar variable declaration or var() reference drift independently', () => {
    const missingDecl = cssFor('new').replace('--new-sb-thumb-color: #868e96;', '--old-sb-thumb-color: #868e96;');
    const declErrors = findPrefixMismatches(missingDecl, 'new');
    expect(declErrors).toHaveLength(1);
    expect(declErrors[0]).toContain('missing declarations (--new-sb-thumb-color)');
    expect(declErrors[0]).toContain('stale declarations (--old-sb-thumb-color)');

    const missingRef = cssFor('new').replaceAll('var(--new-sb-size)', 'var(--old-sb-size)');
    const refErrors = findPrefixMismatches(missingRef, 'new');
    expect(refErrors).toHaveLength(1);
    expect(refErrors[0]).toContain('missing var() references (--new-sb-size)');
    expect(refErrors[0]).toContain('stale var() references (--old-sb-size)');
  });

  it('flags a single stale var() reference even when another property retains the current prefix', () => {
    const partialStale = cssFor('new').replace('height: var(--new-sb-size);', 'height: var(--old-sb-size);');
    const errors = findPrefixMismatches(partialStale, 'new');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('stale var() references (--old-sb-size)');
  });

  it('accepts var() references with fallback values', () => {
    const withFallbacks = cssFor('new')
      .replaceAll('var(--new-sb-size)', 'var(--new-sb-size, 5px)')
      .replaceAll('var(--new-sb-track-color)', 'var(--new-sb-track-color, transparent)')
      .replaceAll('var(--new-sb-thumb-color)', 'var(--new-sb-thumb-color, #868e96)');
    expect(findPrefixMismatches(withFallbacks, 'new')).toEqual([]);
  });

  it('ignores stale names inside CSS comments', () => {
    const withComments =
      cssFor('new').replace('width: var(--new-sb-size);', 'width: /* var(--old-sb-size) */ var(--new-sb-size);') +
      '\n/* Previous width: var(--old-sb-size); --old-sb-size: 4px; .old-surface-root {} */';
    expect(findPrefixMismatches(withComments, 'new')).toEqual([]);
  });

  it('ignores var() text inside strings but still checks nested fallback functions', () => {
    const css =
      cssFor('new') +
      String.raw`
      .help::after { content: "example: \"var(--old-sb-size)\"" 'var(--old-sb-track-color)'; }
      .icon { background-image: url("var(--old-sb-thumb-color)"); }
    `;
    expect(findPrefixMismatches(css, 'new')).toEqual([]);
    const withFallback = css + '.panel { width: calc(1px + var(--size, var(--old-sb-size))); }';
    expect(findPrefixMismatches(withFallback, 'new')).toEqual([
      expect.stringContaining('stale var() references (--old-sb-size)'),
    ]);
  });
});

describe('readProjectPrefix', () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  it('re-reads prefix.cjs from disk when edited without stale module caching', () => {
    const dir = mkdtempSync(join(tmpdir(), 'prefix-sync-test-'));
    dirs.push(dir);
    writeFileSync(join(dir, 'prefix.cjs'), "exports.PROJECT_PREFIX = 'one';\n");
    expect(readProjectPrefix(dir)).toBe('one');

    writeFileSync(join(dir, 'prefix.cjs'), "exports.PROJECT_PREFIX = 'two';\n");
    expect(readProjectPrefix(dir)).toBe('two');
  });
});
