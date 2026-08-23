/**
 * MAIN-WORLD editor injector. Runs in the PAGE's JS realm (`world: 'MAIN'`) so
 * it can reach editor instances the isolated-world content script cannot — see
 * `dom/input/main-world/apply`. This file is only the WXT shell: the responder
 * lives in ./responder, the closed-shadow-root registry it scans with in
 * ./shadow-registry.
 *
 * `document_start` is load-bearing twice over, which is why both of those live
 * in this one bundle: the attachShadow hook must see the page's first root, and
 * the port handover must happen before the page can hold a `window` listener
 * that would see the transferred port.
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
