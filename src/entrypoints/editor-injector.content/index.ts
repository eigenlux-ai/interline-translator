/**
 * MAIN-WORLD editor injector. Runs in the PAGE's JS realm (`world: 'MAIN'`) so
 * it can reach editor instances the isolated-world content script cannot — see
 * `dom/input/main-world/apply`. This file is only the WXT shell: the responder
 * lives in ./responder, the closed-shadow-root registry it scans with in
 * ./shadow-registry.
 *
 * Start early to capture the page's first closed shadow roots. The separate
 * document_end entrypoint resumes this same responder, without rewrapping
 * attachShadow or discarding roots collected here.
 */

import { defineContentScript } from '#imports';
import { startResponder } from './responder';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  // One responder per frame, paired with that frame's isolated-world half —
  // window.postMessage never crosses frames, so each pair is self-contained.
  allFrames: true,
  matchAboutBlank: true,
  world: 'MAIN',
  runAt: 'document_start',
  main() {
    startResponder();
  },
});
