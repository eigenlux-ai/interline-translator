// @vitest-environment node
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { SourceMap } from 'node:module';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runInNewContext } from 'node:vm';
import { build } from 'vite';
import { afterEach, describe, expect, it } from 'vitest';
import inlineSurfaceCss, { keepAtRulesInShadow } from './inline-surface-css';

const roots: string[] = [];
afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function fixture(withCss: boolean, body = 'globalThis.result = { css, classes };') {
  const root = await mkdtemp(join(tmpdir(), 'surface-css-test-'));
  roots.push(root);
  await writeFile(join(root, 'global.css'), ':root { --surface-test: 42px; }');
  await writeFile(join(root, 'panel.module.css'), '.panel::after { content: "你好 $&"; }');
  await writeFile(
    join(root, 'entry.js'),
    `import css from 'virtual:surface-css';
     ${withCss ? "import './global.css'; import classes from './panel.module.css';" : 'const classes = {};'}
     ${body}`
  );
  return root;
}

async function bundle(root: string, build_: { minify?: boolean; sourcemap?: boolean } = {}) {
  const result = await build({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: [inlineSurfaceCss()],
    build: {
      write: false,
      cssCodeSplit: false,
      ...build_,
      rollupOptions: { input: join(root, 'entry.js'), output: { format: 'iife' } },
    },
  });
  if (Array.isArray(result) || !('output' in result)) throw new Error('Expected one build output');
  const chunk = result.output.find((item) => item.type === 'chunk');
  const sheet = result.output.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
  if (!chunk || chunk.type !== 'chunk' || !sheet || sheet.type !== 'asset') throw new Error('Missing JS or audit CSS');
  return Object.assign(chunk, { css: String(sheet.source) });
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
  expect(sheet.fileName).toMatch(/^surface-css\/entry[\w-]*\.css$/);
  expect(result.output.filter((item) => item.fileName.endsWith('.css'))).toHaveLength(1);
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

// Each body is a pattern the minifier would fold against a plain placeholder
// string before the real CSS is substituted.
it.each([
  [
    'replaceAll',
    `globalThis.result = css.replaceAll(':root', ':host');`,
    (css: string) => css.replaceAll(':root', ':host'),
  ],
  ['length', `const length = css.length; globalThis.result = length;`, (css: string) => css.length],
  ['truthiness', `globalThis.result = css ? 'yes' : 'no';`, () => 'yes'],
])('keeps %s on the CSS a runtime operation', async (_name, body, expected) => {
  const root = await fixture(true, body);
  const chunk = await bundle(root, { minify: true });
  const context: { result?: unknown } = {};
  runInNewContext(chunk.code, context);
  expect(context.result).toEqual(expected(chunk.css));
  expect(chunk.code).toContain('--surface-test');
});

// Dev shape (`pnpm dev`: unminified, inline sourcemap), read back from the
// WRITTEN file: rolldown serializes its own map, so the in-memory chunk proves nothing.
it('keeps the written dev sourcemap aligned after the inserted CSS', async () => {
  const root = await fixture(true, 'globalThis.result = [css, "AFTER_TOKEN"];\nglobalThis.later = "LATER_TOKEN";');
  await build({
    root,
    configFile: false,
    logLevel: 'silent',
    plugins: [inlineSurfaceCss()],
    build: {
      outDir: join(root, 'dist'),
      minify: false,
      sourcemap: 'inline',
      cssCodeSplit: false,
      rollupOptions: { input: join(root, 'entry.js'), output: { format: 'iife', entryFileNames: 'entry.js' } },
    },
  });
  const code = await readFile(join(root, 'dist/entry.js'), 'utf8');
  const encoded = /\/\/# sourceMappingURL=data:application\/json[^,]*;base64,([\w+/=]+)\s*$/.exec(code)?.[1];
  if (!encoded) throw new Error('Missing inline sourcemap');
  const payload = JSON.parse(Buffer.from(encoded, 'base64').toString());
  const map = new SourceMap(payload);
  const lines = code.split('\n');
  const original = (line: number, column: number) => {
    const entry = map.findEntry(line, column);
    if (!('originalSource' in entry)) throw new Error(`No mapping for ${line}:${column}`);
    const source =
      payload.sourcesContent[payload.sources.findIndex((name: string) => entry.originalSource.endsWith(name))];
    return { ...entry, text: source.split('\n')[entry.originalLine].slice(entry.originalColumn) };
  };

  // Nothing is mapped after the literal on its own line, so no column there can drift.
  const cssLine = lines.findIndex((text) => text.includes('--surface-test'));
  const tail = map.findEntry(cssLine, lines[cssLine]!.length - 1);
  if ('generatedLine' in tail && tail.generatedLine === cssLine) {
    expect(tail.generatedColumn).toBeLessThan(lines[cssLine]!.indexOf('--surface-test'));
  }

  // Code after the literal still resolves to its source position.
  for (const token of ['globalThis.result', '"AFTER_TOKEN"', 'globalThis.later', '"LATER_TOKEN"']) {
    const line = lines.findIndex((text, index) => index > cssLine && text.includes(token));
    expect(line, token).toBeGreaterThan(cssLine);
    const hit = original(line, lines[line]!.indexOf(token));
    expect(hit.originalSource, token).toMatch(/entry\.js$/);
    expect(hit.text.startsWith(token), `${token} -> ${hit.text}`).toBe(true);
  }
});

describe('keepAtRulesInShadow', () => {
  const tailwindShape =
    '@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))){*,:before,:after,::backdrop{--aie-tw-a:initial;--aie-tw-b:0px}}}' +
    '.x{color:red}@property --aie-tw-a{syntax:"*";inherits:false}@property --aie-tw-b{syntax:"<length>";inherits:false;initial-value:0}';

  it('drops @property and applies the Tailwind fallback unconditionally', () => {
    const css = keepAtRulesInShadow(tailwindShape);
    expect(css).not.toContain('@property');
    expect(css).not.toContain('@supports');
    expect(css).toContain('@layer properties{*,:before,:after,::backdrop{--aie-tw-a:initial;--aie-tw-b:0px}}');
    expect(css).toContain('.x{color:red}');
  });

  it('refuses to drop a registration the fallback does not cover', () => {
    expect(() => keepAtRulesInShadow(tailwindShape + '@property --aie-tw-c{syntax:"*";inherits:false}')).toThrow(
      '--aie-tw-c'
    );
  });

  it('leaves CSS without @property untouched', () => {
    expect(keepAtRulesInShadow('.x{color:red}')).toBe('.x{color:red}');
  });
});
