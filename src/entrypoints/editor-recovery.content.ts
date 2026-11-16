import { defineContentScript } from '#imports';
import { startResponder } from './editor-injector.content/responder';

/** Empty Firefox frames may miss document_start; also repair early document.write(). */
export default defineContentScript({
  matches: ['http://*/*', 'https://*/*'],
  allFrames: true,
  matchAboutBlank: true,
  world: 'MAIN',
  runAt: 'document_end',
  main() {
    startResponder();
  },
});
