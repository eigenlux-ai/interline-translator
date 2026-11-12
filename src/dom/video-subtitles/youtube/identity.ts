import {
  BRIDGE_REQUEST,
  isYoutubeEmbed,
  isYoutubeShorts,
  validBridgeResponse,
  youtubeVideoId,
} from './bridge-protocol';
import { youtubePlayer } from './player';

/** Confirm reused players without enabling native captions or fetching timedtext. */
export function observeYoutubeIdentity(win: Window, changed: () => void) {
  let id: string | null = null;
  let confirmedPlayer: HTMLElement | null = null;
  let request: { id: string; player: HTMLElement; route: string } | null = null;
  let confirmedAt = 0;
  let suspended = false;
  let route = win.location.href;
  const dynamic = () => isYoutubeEmbed(win.location.href) || isYoutubeShorts(win.location.href);
  const videoId = () => {
    if (suspended) return null;
    if (!dynamic()) return youtubeVideoId(win.location.href);
    // Shorts have a route identity: background timer throttling must not detach a
    // confirmed paused session. URL/player/media changes still invalidate it.
    if (
      (isYoutubeEmbed(win.location.href) && Date.now() - confirmedAt > 1500) ||
      confirmedPlayer !== youtubePlayer(win)
    )
      return null;
    return isYoutubeShorts(win.location.href) && id !== youtubeVideoId(win.location.href) ? null : id;
  };
  const adopt = (next: string | null, player: HTMLElement | null = null) => {
    if (id === next && confirmedPlayer === player) return;
    id = next;
    confirmedPlayer = player;
    changed();
  };
  const probe = () => {
    if (suspended) return;
    if (route !== win.location.href) {
      route = win.location.href;
      request = null;
      adopt(null);
      changed();
    }
    if (!dynamic()) return;
    if (!videoId()) adopt(null);
    const player = youtubePlayer(win);
    if (!player) {
      request = null;
      return;
    }
    request = { id: win.crypto.randomUUID(), player, route };
    win.postMessage(
      { type: BRIDGE_REQUEST, version: 1, requestId: request.id, action: 'identify' },
      win.location.origin
    );
  };
  const receive = (event: MessageEvent) => {
    if (
      suspended ||
      event.source !== win ||
      event.origin !== win.location.origin ||
      !validBridgeResponse(event.data) ||
      event.data.requestId !== request?.id ||
      request.route !== win.location.href ||
      request.player !== youtubePlayer(win)
    )
      return;
    const player = request.player;
    request = null;
    const snapshot = event.data.snapshot;
    confirmedAt = Date.now();
    if (snapshot.ad || (isYoutubeShorts(win.location.href) && snapshot.videoId !== youtubeVideoId(win.location.href)))
      adopt(null);
    else adopt(snapshot.videoId, player);
  };
  const reset = (event: Event) => {
    // Background/preloaded media must not tear down the visible video's session.
    if (event.target !== youtubePlayer(win)?.querySelector('video')) return;
    request = null;
    adopt(null);
    probe();
  };
  const navigate = () => {
    request = null;
    adopt(null);
    probe();
  };
  const hide = () => {
    suspended = true;
    request = null;
    adopt(null);
  };
  const show = () => {
    suspended = false;
    probe();
  };
  win.addEventListener('message', receive);
  win.addEventListener('pagehide', hide);
  win.addEventListener('pageshow', show);
  win.addEventListener('popstate', navigate);
  win.document.addEventListener('yt-navigate-start', navigate);
  win.document.addEventListener('yt-navigate-finish', navigate);
  win.document.addEventListener('emptied', reset, true);
  win.document.addEventListener('loadedmetadata', reset, true);
  const timer = win.setInterval(probe, 250);
  // First probe is deferred so callers can finish constructing their runtime.
  return {
    videoId,
    dispose() {
      win.clearInterval(timer);
      win.removeEventListener('message', receive);
      win.removeEventListener('pagehide', hide);
      win.removeEventListener('pageshow', show);
      win.removeEventListener('popstate', navigate);
      win.document.removeEventListener('yt-navigate-start', navigate);
      win.document.removeEventListener('yt-navigate-finish', navigate);
      win.document.removeEventListener('emptied', reset, true);
      win.document.removeEventListener('loadedmetadata', reset, true);
    },
  };
}
