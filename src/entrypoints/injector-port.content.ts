/**
 * Isolated-world half of the editor-injector handshake, and nothing else.
 *
 * It exists purely for its TIMING. The main-world responder offers its private
 * MessagePort in its first task — the only moment a `window` handover cannot be
 * overheard, because the page has not run a line of script yet (a transferred
 * port shows up in `MessageEvent.ports` for every listener on the window) — and
 * somebody in the isolated world has to be listening right then. The bridge
 * that uses the port lives in `page-translate`, which starts at document_idle;
 * by then the offer is long gone. So this entrypoint takes the port at
 * document_start and parks it where the bridge finds it (dom/input/port-handshake).
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
