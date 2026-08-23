/**
 * @module services/stream/client
 *
 * CLIENT side of token streaming — usable from any surface (selection UI etc.).
 * Opens the named Port, sends a start message, and exposes the server's chunks
 * as a plain async iterable of string deltas. Import-safe: only browser APIs +
 * `import type` (no ai-sdk).
 *
 *   for await (const delta of streamTranslate(req)) appendToBubble(delta);
 *
 * Two starters share the machinery: `streamTranslate` (a selection's 译文) and
 * `streamAnnotate` (the 夹笺's 注疏 notes — LLM-only; the server errors on MT).
 */

import type { AnnotateStart, StreamServerMessage, TranslateRequest } from '@/data/models';
import { randomId } from '@/core/uid';
import { connectKeepAlive } from '@/services/keep-alive';
import { STREAM_PORT_NAME } from './index';

/** Open the port, post `start`, and yield chunk deltas until done/error. */
async function* streamOverPort(
  start: { type: string; requestId: string } & Record<string, unknown>
): AsyncGenerator<string, void, unknown> {
  const { requestId } = start;
  const port = browser.runtime.connect({ name: STREAM_PORT_NAME });
  // Keep the SW awake through silent spans (time-to-first-token, think-stripped
  // reasoning) — its idle timer only resets on port messages, not fetches.
  const keepAlive = connectKeepAlive();
  const queue: string[] = [];
  let done = false;
  let error: string | null = null;
  let wake: (() => void) | null = null;
  const signal = () => {
    wake?.();
    wake = null;
  };

  port.onMessage.addListener((raw) => {
    const msg = raw as StreamServerMessage;
    if (msg.requestId !== requestId) return;
    if (msg.type === 'chunk') queue.push(msg.delta);
    else if (msg.type === 'done') done = true;
    else if (msg.type === 'error') {
      error = msg.message;
      done = true;
    }
    signal();
  });
  port.onDisconnect.addListener(() => {
    void browser.runtime.lastError; // read = checked (bfcache closes ports with it set)
    // Background gone mid-stream: surface it — ending quietly would present a
    // truncated result as complete.
    if (!done) error = 'translation stream disconnected before it finished';
    done = true;
    signal();
  });

  try {
    // Inside the try: if this throws (port died in the connect→post window),
    // the finally still releases the keep-alive — otherwise its 20s pings
    // would wake the SW forever.
    port.postMessage(start);
    for (;;) {
      while (queue.length) yield queue.shift()!;
      if (done) break;
      await new Promise<void>((resolve) => {
        wake = resolve;
      });
    }
    if (error) throw new Error(error);
  } finally {
    keepAlive.stop();
    try {
      port.postMessage({ type: 'cancel', requestId });
    } catch {
      /* already closed */
    }
    try {
      port.disconnect();
    } catch {
      /* already closed */
    }
  }
}

/** Stream a translation token-by-token. Throws if the server reports an error. */
export function streamTranslate(
  request: TranslateRequest,
  requestId: string = randomId()
): AsyncGenerator<string, void, unknown> {
  return streamOverPort({ type: 'start', requestId, request });
}

/** Stream 注疏 notes for a translated selection. Throws on server error (incl. MT engines). */
export function streamAnnotate(
  input: Omit<AnnotateStart, 'type' | 'requestId'>,
  requestId: string = randomId()
): AsyncGenerator<string, void, unknown> {
  return streamOverPort({ type: 'annotate', requestId, ...input });
}
