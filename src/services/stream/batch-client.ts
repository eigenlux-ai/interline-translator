/**
 * @module services/stream/batch-client
 *
 * CLIENT side of BATCH streaming translation (whole-page). Opens the named Port,
 * sends a `batchStart`, and dispatches per-segment messages to callbacks so the
 * page can fill each 译文 progressively as the model streams. Import-safe: only
 * browser APIs + `import type` (no ai-sdk).
 *
 * Callback-based rather than an async iterable because many segments stream
 * concurrently (one prompt, interleaved output) — there's no single linear
 * sequence to `for await` over.
 */

import type { BatchStreamServerMessage, BatchStreamStart, TranslateRequest } from '@/data/models';
import { randomId } from '@/core/uid';
import { connectKeepAlive } from '@/services/keep-alive';
import { STREAM_PORT_NAME } from './index';

export interface BatchStreamHandlers {
  /** Progressive append for a 1-based segment index (raw model text). */
  onSeg?(index: number, delta: string): void;
  /** Final (trimmed) text for a segment — authoritative; render it for real. */
  onSegDone(index: number, text: string): void;
}

export interface BatchStreamHandle {
  /** Resolves when the whole batch is done; rejects on a server error. */
  done: Promise<void>;
  /** Cancel the in-flight batch (aborts the LLM call in the background). */
  cancel(): void;
}

/**
 * Start a streaming batch translation. `meta` is a TranslateRequest sans `text`.
 *
 * Never throws synchronously: connection or postMessage failures (such as when
 * an extension context is invalidated during background reload) return a handle
 * whose `done` rejects, matching the failure contract of mid-batch disconnects.
 */
export function streamBatchTranslate(
  meta: Omit<TranslateRequest, 'text'>,
  items: string[],
  handlers: BatchStreamHandlers,
  requestId: string = randomId()
): BatchStreamHandle {
  try {
    return openBatchStream(meta, items, handlers, requestId);
  } catch (e) {
    const done = Promise.reject(e instanceof Error ? e : new Error(String(e)));
    void done.catch(() => {}); // observed here; the caller's await still rejects
    return { done, cancel() {} };
  }
}

function openBatchStream(
  meta: Omit<TranslateRequest, 'text'>,
  items: string[],
  handlers: BatchStreamHandlers,
  requestId: string
): BatchStreamHandle {
  const port = browser.runtime.connect({ name: STREAM_PORT_NAME });
  // Hold the SW awake for the whole batch: its idle timer resets on PORT
  // MESSAGES, not on awaited fetches — a long time-to-first-token or a
  // reasoning span (think-stripped, so nothing is posted) is a silent gap.
  const keepAlive = connectKeepAlive();
  let settled = false;
  let resolve!: () => void;
  let reject!: (e: Error) => void;
  const done = new Promise<void>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  const cleanup = () => {
    keepAlive.stop();
    try {
      port.disconnect();
    } catch {
      /* already closed */
    }
  };

  port.onMessage.addListener((raw) => {
    const msg = raw as BatchStreamServerMessage;
    if (msg.requestId !== requestId) return;
    switch (msg.type) {
      case 'seg':
        handlers.onSeg?.(msg.index, msg.delta);
        break;
      case 'segDone':
        handlers.onSegDone(msg.index, msg.text);
        break;
      case 'batchDone':
        if (!settled) {
          settled = true;
          resolve();
        }
        cleanup();
        break;
      case 'batchError':
        if (!settled) {
          settled = true;
          reject(new Error(msg.message));
        }
        cleanup();
        break;
    }
  });
  port.onDisconnect.addListener(() => {
    void browser.runtime.lastError; // read = checked (bfcache closes ports with it set)
    if (!settled) {
      settled = true;
      // Background gone mid-batch (SW recycled / extension updated). This is a
      // FAILURE for every segment that never got its segDone — reject so the
      // caller can mark or retry them instead of leaving spinners forever.
      reject(new Error('translation stream disconnected before the batch finished'));
    }
    cleanup();
  });

  const start: BatchStreamStart = { ...meta, type: 'batchStart', requestId, items };
  try {
    port.postMessage(start);
  } catch (e) {
    cleanup(); // port died in the connect→post window — release the keep-alive
    throw e; // → the wrapper's rejecting handle
  }

  return {
    done,
    cancel() {
      if (!settled) {
        settled = true;
        resolve();
      }
      try {
        port.postMessage({ type: 'cancel', requestId });
      } catch {
        /* already closed */
      }
      cleanup();
    },
  };
}
