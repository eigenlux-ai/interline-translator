import { describe, expect, it } from 'vitest';
import editorInjector from '@/entrypoints/editor-injector.content';
import injectorPort from '@/entrypoints/injector-port.content';

/**
 * The two halves of the editor-injector channel are only paired if they are
 * injected into the SAME frames at the SAME moment:
 *
 *  - document_start on both sides, because the port handover happens in the
 *    responder's first task, before the page can hold a `window` listener that
 *    would see the transferred port (dom/input/port-handshake);
 *  - allFrames + matchAboutBlank, because `window.postMessage` never crosses
 *    frames and input translation reaches fields inside them (TinyMCE's iframe
 *    mode, embedded comment widgets) — the standalone attachShadow hook this
 *    merge replaced declared neither, so inside every iframe its registry
 *    simply did not exist.
 *
 * Lives here, not beside the entrypoints: WXT treats every top-level file in
 * `src/entrypoints/` as an entrypoint to build, so a `*.test.ts` there fails
 * the build. (A file inside a `<name>.content/` directory is fine — only that
 * directory's `index.ts` is the entrypoint.)
 */
describe('editor-injector channel reach', () => {
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
