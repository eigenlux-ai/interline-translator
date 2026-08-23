import { describe, expect, it } from 'vitest';
import { findPrefixMismatches } from './check-prefix-sync';

// A minimal global.css stand-in templated on a prefix, so we can assert the
// detector fires only when the file and the prefix disagree.
const cssFor = (prefix: string) => `
:root,
.${prefix}-surface-root {
  --${prefix}-z-float-ui: 2146000000;
  --${prefix}-z-main-ui: 2146100000;
}
.${prefix}-surface-root { color: red; }
`;

describe('findPrefixMismatches', () => {
  it('returns no errors when global.css matches the prefix', () => {
    expect(findPrefixMismatches(cssFor('aie'), 'aie')).toEqual([]);
    expect(findPrefixMismatches(cssFor('zzz'), 'zzz')).toEqual([]);
  });

  it('flags both anchors and names the stale prefix when out of sync', () => {
    const errors = findPrefixMismatches(cssFor('aie'), 'zzz');
    expect(errors).toHaveLength(2);
    // surface-root mismatch points at what to add AND what is currently there
    expect(errors[0]).toContain('.zzz-surface-root');
    expect(errors[0]).toContain("PROJECT_PREFIX ('zzz')");
    expect(errors[0]).toContain('.aie-surface-root'); // stale prefix surfaced
    // z-var mismatch
    expect(errors[1]).toContain('--zzz-z-main-ui');
  });

  it('reports a hyphenated stale prefix in full in the hint', () => {
    // A fork that previously used `.my-ext-surface-root` then renamed the prefix:
    // the hint must surface the whole stale prefix, not truncate at the hyphen.
    const errors = findPrefixMismatches('.my-ext-surface-root {}\n--my-ext-z-main-ui: 1;', 'new');
    expect(errors[0]).toContain('.my-ext-surface-root');
  });

  it('flags only the surface-root anchor when just that one drifts', () => {
    // z-vars already renamed to the new prefix, but the surface-root class forgotten
    const partial = `.old-surface-root {}\n--new-z-main-ui: 1;`;
    const errors = findPrefixMismatches(partial, 'new');
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain('.new-surface-root');
    expect(errors[0]).toContain('.old-surface-root'); // stale prefix surfaced
  });
});
