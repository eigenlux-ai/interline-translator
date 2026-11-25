// @vitest-environment node
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';
import { PROJECT_PREFIX } from '../prefix.cjs';

it('audits the selector subject, including alternatives and qualified host defaults', () => {
  const dir = mkdtempSync(join(tmpdir(), 'audit-css-'));
  const file = join(dir, 'surface.css');
  const audit = (selectors: string[]) => {
    writeFileSync(file, selectors.map((selector) => `${selector} { --brand: red }`).join('\n'));
    return spawnSync(process.execPath, ['scripts/audit-css-vars.mjs', file], { encoding: 'utf8' });
  };
  const surface = `.${PROJECT_PREFIX}-surface-root`;
  try {
    const scoped = audit([
      'html>.x',
      'html > .x',
      ':root::before',
      '.panel:has(:root)',
      '.panel:not(:host)',
      '[title="a, :root"]',
      `:is(:root, ${surface})`,
      ':host([data-mantine-color-scheme=dark])',
    ]);
    expect(scoped.status, scoped.stderr || scoped.stdout).toBe(0);

    const violations = [
      ':is(:root)',
      ':where(.x, :is(:host))',
      `:root, ${surface}>.child`,
      ':host',
      ':ROOT, .x[data-mantine-color-scheme]',
      ':is(:root, .x[data-mantine-color-scheme])',
    ];
    const invalid = audit(violations);
    expect(invalid.status).toBe(1);
    expect(invalid.stdout).toContain(
      `VIOLATIONS (design tokens on root, MISSING ${surface}): ${violations.length} rule(s)`
    );
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
