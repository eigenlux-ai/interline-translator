import { describe, expect, it } from 'vitest';
import editorInjector from '@/entrypoints/editor-injector.content';
import editorRecovery from '@/entrypoints/editor-recovery.content';
import injectorPort from '@/entrypoints/injector-port.content';

/**
 * All entrypoints must cover the same frames. Early injection captures closed
 * roots and offers a channel; the late MAIN-world bootstrap repairs missed or
 * erased startup. The isolated bridge can also initiate its own handshake.
 *
 * Lives here, not beside the entrypoints: WXT treats every top-level file in
 * `src/entrypoints/` as an entrypoint to build, so a `*.test.ts` there fails
 * the build. (A file inside a `<name>.content/` directory is fine — only that
 * directory's `index.ts` is the entrypoint.)
 */
describe('editor-injector channel reach', () => {
  it('also starts the same MAIN-world responder at document_end in every frame', () => {
    expect(editorRecovery.world).toBe('MAIN');
    expect(editorRecovery.runAt).toBe('document_end');
    expect(editorRecovery.allFrames).toBe(true);
    expect(editorRecovery.matchAboutBlank).toBe(true);
    expect(editorRecovery.matches).toEqual(editorInjector.matches);
  });
  it('pairs a MAIN-world responder with an isolated receiver in every frame, at document_start', () => {
    expect(editorInjector.world).toBe('MAIN');
    expect(injectorPort.world).toBeUndefined(); // WXT's default: the isolated world

    for (const script of [editorInjector, injectorPort]) {
      expect(script.runAt).toBe('document_start');
      expect(script.allFrames).toBe(true);
      expect(script.matchAboutBlank).toBe(true);
      expect(script.matches).toEqual(['http://*/*', 'https://*/*']);
    }
  });
});
