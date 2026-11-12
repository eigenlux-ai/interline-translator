import { BRIDGE_REQUEST, validBridgeResponse } from './bridge-protocol';

/** Frame-local metadata probe. It never enables native captions or fetches timedtext. */
export function observeEmbedIdentity(win: Window, changed: () => void) {
  let id: string | null = null;
  let requestId = '';
  let confirmedAt = 0;
  let suspended = false;
  const adopt = (next: string | null) => {
    if (id === next) return;
    id = next;
    changed();
  };
  const probe = () => {
    if (suspended) return;
    if (Date.now() - confirmedAt > 1500) adopt(null);
    requestId = win.crypto.randomUUID();
    win.postMessage({ type: BRIDGE_REQUEST, version: 1, requestId, action: 'identify' }, win.location.origin);
  };
  const receive = (event: MessageEvent) => {
    if (
      suspended ||
      event.source !== win ||
      event.origin !== win.location.origin ||
      !validBridgeResponse(event.data) ||
      event.data.requestId !== requestId
    )
      return;
    requestId = '';
    confirmedAt = Date.now();
    adopt(event.data.snapshot.ad ? null : event.data.snapshot.videoId);
  };
  const reset = () => {
    requestId = '';
    adopt(null);
    probe();
  };
  const hide = () => {
    suspended = true;
    requestId = '';
    adopt(null);
  };
  const show = () => {
    suspended = false;
    probe();
  };
  win.addEventListener('message', receive);
  win.addEventListener('pagehide', hide);
  win.addEventListener('pageshow', show);
  // Capture handles a reused or replaced media element without holding the old element.
  win.document.addEventListener('emptied', reset, true);
  win.document.addEventListener('loadedmetadata', reset, true);
  const timer = win.setInterval(probe, 250);
  probe();
  return {
    videoId: () => id,
    dispose() {
      win.clearInterval(timer);
      win.removeEventListener('message', receive);
      win.removeEventListener('pagehide', hide);
      win.removeEventListener('pageshow', show);
      win.document.removeEventListener('emptied', reset, true);
      win.document.removeEventListener('loadedmetadata', reset, true);
    },
  };
}
