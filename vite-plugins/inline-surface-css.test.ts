// @vitest-environment node
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { build } from 'vite';
import { afterEach, expect, it } from 'vitest';
import inlineSurfaceCss from './inline-surface-css';

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function fixture(withCss: boolean) {
  const root = await mkdtemp(join(tmpdir(), 'surface-css-test-'));
  roots.push(root);
  await writeFile(join(root, 'global.css'), ':root { --surface-test: 42px; }');
  await writeFile(join(root, 'panel.module.css'), '.panel::after { content: "你好 $&"; }');
  await writeFile(
    join(root, 'entry.js'),
    `import css from 'virtual:surface-css';
     ${withCss ? "import './global.css'; import classes from './panel.module.css';" : 'const classes = {};'}
     globalThis.result = { css, classes };`
  );
  return root;
}

it.each([false, true])('embeds global and module CSS, preserving scoped names (minify=%s)', async (minify) => {
  const root = await fixture(true);
  const result = await build({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: [inlineSurfaceCss()],
    build: {
      write: false,
      minify,
      cssCodeSplit: false,
      rollupOptions: { input: join(root, 'entry.js'), output: { format: 'iife' } },
    },
  });
  if (Array.isArray(result) || !('output' in result)) throw new Error('Expected one build output');
  const chunk = result.output.find((item) => item.type === 'chunk');
  const sheet = result.output.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
  if (!chunk || !sheet || sheet.type !== 'asset') throw new Error('Missing JS or audit CSS');
  const context = { result: undefined as { css: string; classes: { panel: string } } | undefined };
  runInNewContext(chunk.code, context);
  expect(context.result?.css).toBe(sheet.source);
  expect(context.result?.css).toContain(context.result!.classes.panel);
  expect(context.result?.css).toContain('--surface-test');
  expect(context.result?.css).toContain('$&');
  expect(chunk.code).not.toContain('__AIE_BUNDLED_SURFACE_CSS_');
  expect(chunk.code).not.toMatch(/[\u0080-\uffff]/);
});

it('fails the build when an entry forgets its CSS instead of shipping an unstyled UI', async () => {
  const root = await fixture(false);
  await expect(
    build({
      root,
      configFile: false,
      logLevel: 'silent',
      plugins: [inlineSurfaceCss()],
      build: { write: false, rollupOptions: { input: join(root, 'entry.js'), output: { format: 'iife' } } },
    })
  ).rejects.toThrow('exactly one emitted CSS asset');
});
