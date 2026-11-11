import {
  isSubtitleTranslationEvent,
  SUBTITLE_PORT_NAME,
  type SubtitleTranslationEvent,
  type SubtitleWindow,
} from './protocol';

export type { SubtitleSubscription, SubtitleTranslationEvent, SubtitleWindow } from './protocol';
/** A single active-session Port. Reconnect is explicit so callers replan the current window. */
export function createSubtitleTranslationClient(options: {
  onEvent: (event: SubtitleTranslationEvent) => void;
  onDisconnect?: () => void;
}) {
  const port = browser.runtime.connect({ name: SUBTITLE_PORT_NAME });
  let closed = false;
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  const pending = new Set<string>();
  const idle = () => {
    if (heartbeat) clearInterval(heartbeat);
    heartbeat = undefined;
  };
  port.onMessage.addListener((raw) => {
    if (closed || !isSubtitleTranslationEvent(raw)) return;
    pending.delete(JSON.stringify([raw.generation, raw.trackVersion, raw.subscriptionId, raw.contentVersion]));
    if (!pending.size) idle();
    options.onEvent(raw);
  });
  port.onDisconnect.addListener(() => {
    void browser.runtime.lastError;
    if (closed) return;
    closed = true;
    idle();
    options.onDisconnect?.();
  });
  return {
    updateWindow(window: SubtitleWindow) {
      if (closed) return;
      pending.clear();
      for (const item of window.subscriptions)
        pending.add(JSON.stringify([window.generation, window.trackVersion, item.subscriptionId, item.contentVersion]));
      if (pending.size && !heartbeat)
        heartbeat = setInterval(() => {
          try {
            port.postMessage({ version: 1, type: 'ping' });
          } catch {
            idle();
          }
        }, 20_000);
      if (!pending.size) idle();
      port.postMessage({ version: 1, type: 'window', window });
    },
    close() {
      if (closed) return;
      closed = true;
      idle();
      try {
        port.postMessage({ version: 1, type: 'close' });
        port.disconnect();
      } catch {
        /* already disconnected */
      }
    },
  };
}
