// Collect runtime dependencies and the WXT foundation, with upstream notices.
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';

const packages = new Map();
function visit(manifest, names, recursive = true) {
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
  const require = createRequire(manifest);
  for (const name of names ?? Object.keys(pkg.dependencies ?? {})) {
    const path = require.resolve
      .paths(name)
      .map((dir) => join(dir, name, 'package.json'))
      .find((candidate) => existsSync(candidate));
    if (!path) throw new Error(`Cannot find license metadata for ${name}`);
    const dep = JSON.parse(readFileSync(path, 'utf8'));
    const key = `${dep.name}@${dep.version}`;
    if (packages.has(key)) continue;
    const dir = dirname(path);
    const files = readdirSync(dir).filter((file) => /^(licen[cs]e|copying|notice)([._-]|$)/i.test(file));
    packages.set(key, {
      name: dep.name,
      version: dep.version,
      license: typeof dep.license === 'string' ? dep.license : (dep.license?.type ?? 'See upstream notices'),
      ...(dep.name === 'wxt' ? { repository: 'https://github.com/wxt-dev/wxt' } : {}),
      notices:
        files.map((file) => readFileSync(join(dir, file), 'utf8')).join('\n\n') ||
        (dep.name === 'wxt' ? readFileSync('src/data/licenses/wxt.txt', 'utf8') : ''),
    });
    if (recursive) visit(path);
  }
}
const root = resolve('package.json');
visit(root);
// WXT is declared as a dev dependency, but supplies the extension foundation.
visit(root, ['wxt'], false);
const wxtManifest = resolve('node_modules/wxt/package.json');
visit(wxtManifest, ['@wxt-dev/browser', '@wxt-dev/storage']);
writeFileSync(
  'src/data/third-party-notices.json',
  `${JSON.stringify(
    [...packages.values()].sort((a, b) =>
      a.name === 'wxt' ? -1 : b.name === 'wxt' ? 1 : a.name.localeCompare(b.name)
    ),
    null,
    2
  )}\n`
);
