import { spawnSync } from 'node:child_process';
import path from 'node:path';

if (process.platform !== 'darwin') throw new Error('Safari app packaging requires macOS and Xcode.');
const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
};
// Match the app name's case: Apple's packager derives the containing app ID from it.
run('xcrun', [
  'safari-web-extension-converter',
  '.output/safari-mv2',
  '--project-location',
  '.output/safari-xcode',
  '--app-name',
  'Interline',
  '--bundle-identifier',
  'ai.eigenlux.Interline',
  '--swift',
  '--macos-only',
  '--copy-resources',
  '--no-open',
  '--no-prompt',
  '--force',
]);
run('xcodebuild', [
  '-project',
  '.output/safari-xcode/Interline/Interline.xcodeproj',
  '-scheme',
  'Interline',
  '-configuration',
  'Debug',
  '-derivedDataPath',
  '.output/safari-derived',
  'CODE_SIGN_IDENTITY=-',
  'CODE_SIGNING_ALLOWED=YES',
  'build',
]);
console.log(`Safari test app: ${path.resolve('.output/safari-derived/Build/Products/Debug/Interline.app')}`);
