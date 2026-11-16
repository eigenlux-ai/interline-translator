/**
 * Isolated-world half of the editor-injector handshake, and nothing else.
 *
 * Capture an early offer for the bridge in page-translate, which starts at
 * document_idle. If this listener is missed or erased, the bridge initiates
 * its own handshake. Port health is checked before editor requests.
 *
 * All frames, about:blank included: `window.postMessage` never crosses frames,
 * so every frame's responder needs its own isolated-world partner — the same
 * reach the responder and page-translate already declare.
 */

import { defineContentScript } from '#imports';
import { closeInjectorPort, receiveInjectorPortOffer } from '@/dom/input/port-handshake';

export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  allFrames: true,
  matchAboutBlank: true,
  runAt: 'document_start',
  main(ctx) {
    const stopListening = receiveInjectorPortOffer();
    // Extension update / disable / uninstall: hand the channel back so the
    // responder unhooks attachShadow instead of leaving a patched prototype and
    // a live root registry behind on a page that outlives us.
    ctx.onInvalidated(() => {
      stopListening();
      closeInjectorPort();
    });
  },
});
