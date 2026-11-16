// Rebuild the AMO source archive with its own locked dependencies and compare
// every extracted extension file, ignoring ZIP timestamps and compression.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const root = process.cwd();
const pkg = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
const args = process.argv.slice(2);
assert(args.length === 0 || args.length === 2, 'Usage: check-firefox-reproducibility.mjs [extension.zip sources.zip]');
const extensionZip = path.resolve(args[0] ?? `.output/${pkg.name}-${pkg.version}-firefox.zip`);
const sourceZip = path.resolve(args[1] ?? `.output/${pkg.name}-${pkg.version}-sources.zip`);

function run(command, args, cwd = root) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${command} ${args.join(' ')} failed`);
}

async function hashes(directory, prefix = '') {
  const result = new Map();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    const name = prefix + entry.name;
    if (entry.isDirectory()) {
      for (const [key, value] of await hashes(file, name + '/')) result.set(key, value);
    } else {
      assert(entry.isFile(), `Unexpected non-file entry: ${name}`);
      result.set(
        name,
        createHash('sha256')
          .update(await readFile(file))
          .digest('hex')
      );
    }
  }
  return result;
}

const temporary = await mkdtemp(path.join(os.tmpdir(), 'interline-firefox-repro-'));
try {
  const source = path.join(temporary, 'source');
  const original = path.join(temporary, 'original');
  const rebuilt = path.join(temporary, 'rebuilt');
  run('unzip', ['-q', sourceZip, '-d', source]);
  run('unzip', ['-q', extensionZip, '-d', original]);
  run('pnpm', ['install', '--frozen-lockfile'], source);
  run('pnpm', ['zip:firefox'], source);
  const sourcePackage = JSON.parse(await readFile(path.join(source, 'package.json'), 'utf8'));
  const rebuiltZip = `${sourcePackage.name}-${sourcePackage.version}-firefox.zip`;
  run('unzip', ['-q', path.join(source, '.output', rebuiltZip), '-d', rebuilt]);

  const expected = await hashes(original);
  const actual = await hashes(rebuilt);
  assert(expected.size > 0, 'The extension archive is empty');
  const differences = [...new Set([...expected.keys(), ...actual.keys()])]
    .filter((file) => expected.get(file) !== actual.get(file))
    .sort();
  assert.equal(differences.length, 0, `Firefox source rebuild differs:\n${differences.join('\n')}`);
  console.log(`Firefox source rebuild matches all ${expected.size} extension files byte-for-byte.`);
} finally {
  await rm(temporary, { recursive: true, force: true });
}
