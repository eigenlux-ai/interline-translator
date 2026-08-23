/**
 * @module services/keep-alive
 *
 * Prevents MV3 service workers from terminating during long-running operations
 * (such as slow LLM responses or streaming connections). Clients maintain a
 * long-lived Port and send periodic heartbeat pings every 20s to reset the SW
 * idle timer, automatically reconnecting when Chrome cycles ports.
 *
 * Import-safe everywhere: only browser APIs + the prefix constant.
 */

import { PROJECT_PREFIX } from '@/constants';

const KEEP_ALIVE_PORT = `${PROJECT_PREFIX}-keepalive`;
const PING_INTERVAL_MS = 20_000;

/** BACKGROUND: accept keep-alive ports. Receiving any message resets the idle timer. */
export function registerKeepAlive(): void {
  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== KEEP_ALIVE_PORT) return;
    // The act of receiving keeps the worker warm; nothing else to do.
    port.onMessage.addListener(() => {
      /* idle timer reset as a side effect of message receipt */
    });
    port.onDisconnect.addListener(() => {
      void browser.runtime.lastError; // read = checked (bfcache closes ports with it set)
    });
  });
}

export interface KeepAliveHandle {
  stop: () => void;
}

/**
 * CLIENT (popup/content/options): hold the worker awake for the duration of an
 * operation. Pings every 20s and reconnects if Chrome drops the port. Call
 * `stop()` when the work is done.
 */
export function connectKeepAlive(): KeepAliveHandle {
  let port: ReturnType<typeof browser.runtime.connect> | null = null;
  let timer: ReturnType<typeof setInterval> | null = null;
  let stopped = false;

  const open = () => {
    if (stopped) return;
    try {
      port = browser.runtime.connect({ name: KEEP_ALIVE_PORT });
    } catch {
      // Extension context invalidated (update/reload) — nothing left to keep
      // alive; connect() would throw again on every retry, so stop for good.
      stopped = true;
      if (timer) clearInterval(timer);
      return;
    }
    port.onDisconnect.addListener(() => {
      void browser.runtime.lastError; // read = checked (bfcache closes ports with it set)
      if (!stopped) open(); // Chrome closed it (~5min) — reconnect.
    });
  };

  open();
  if (!stopped) {
    timer = setInterval(() => {
      try {
        port?.postMessage({ t: Date.now() });
      } catch {
        open(); // port invalidated — re-establish.
      }
    }, PING_INTERVAL_MS);
  }

  return {
    stop() {
      stopped = true;
      if (timer) clearInterval(timer);
      try {
        port?.disconnect();
      } catch {
        /* already gone */
      }
      port = null;
    },
  };
}

/** Run an async op with the worker kept awake; always releases the port. */
export async function withKeepAlive<T>(fn: () => Promise<T>): Promise<T> {
  const handle = connectKeepAlive();
  try {
    return await fn();
  } finally {
    handle.stop();
  }
}
