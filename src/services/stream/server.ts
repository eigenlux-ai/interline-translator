/**
 * @module services/stream/server
 *
 * BACKGROUND side of token streaming. proxy-service can't return an async
 * iterable, so streaming translations run over the named Port: a client sends
 * `StreamStart`, we stream `chunk`s then `done` (or `error`). Cancellation is
 * by `requestId` (`StreamCancel`) → AbortController. BACKGROUND-ONLY (ai-sdk).
 *
 * MT providers have no streaming endpoint, so they emit the whole result as a
 * single chunk — the client code path is identical either way. Single LLM
 * streams share the persistent cache with executeTranslate and the batch path
 * (same key derivation — see cache-key.singleTranslationKey): a repeat
 * selection replays instantly instead of paying a second LLM call.
 */

import { type LanguageModel, streamText } from 'ai';
import type { AnnotateStart, StreamClientMessage, StreamServerMessage, TranslateRequest } from '@/data/models';
import { getConfig } from '@/services/config/storage';
import { singleTranslationKey } from '@/services/translation/cache/cache-key';
import { dexieCache } from '@/services/translation/cache/db';
import { executeTranslate } from '@/services/translation/execute';
import { llmCallOptions, requireApiKey, resolveCallEnv, resolveProvider, type LlmCallOptions } from '@/services/translation/preflight';
import { buildAnnotatePrompt } from '@/services/translation/prompts';
import { createLlmModel } from '@/services/translation/provider/llm';
import { createThinkStripper } from '@/services/translation/reasoning';
import { handleBatchStart } from './batch-server';
import { runStreamHandler } from './handler';
import { STREAM_PORT_NAME } from './index';
import { makeWatchdog, shortStopError, watchdogError } from './limiter';

/** The runtime Port type, extracted from the onConnect listener signature. */
type RuntimePort = Parameters<Parameters<typeof browser.runtime.onConnect.addListener>[0]>[0];

/**
 * Stream an LLM completion into the Port as `chunk`s then `done`, returning
 * the full (think-stripped) text — or null when the caller aborted.
 *
 * Two ai-sdk 6 semantics are load-bearing here:
 *   - `textStream` does NOT throw on provider-side errors (bad key, 4xx/5xx,
 *     rate limits) — they arrive via `onError` while the stream simply ENDS.
 *     We capture and re-throw after the loop, else a failed call posts `done`
 *     with zero chunks and the UI renders a silent empty "success".
 *   - `textStream` does NOT throw on ABORT either — the stream ends cleanly.
 *     So after the loop we must distinguish: user cancel → silent stop;
 *     watchdog timeout → a TRUNCATED result that must surface as an error,
 *     never as a quietly-shortened success.
 */
async function pumpModelStream(
  post: (m: StreamServerMessage) => void,
  requestId: string,
  signal: AbortSignal,
  input: { model: LanguageModel; system: string; prompt: string } & LlmCallOptions
): Promise<string | null> {
  let streamError: unknown = null;
  const watchdog = makeWatchdog(signal);
  const result = streamText({
    ...input,
    abortSignal: watchdog.signal,
    onError: ({ error }) => {
      streamError = error;
    },
  });
  // Attach catch handler immediately to prevent unhandled rejections if the stream fails.
  const finishReason = Promise.resolve(result.finishReason).catch(() => undefined);
  // Suppress a leading inline <think>…</think> block (DeepSeek-R1 etc.).
  const strip = createThinkStripper();
  const chunks: string[] = [];
  const emit = (delta: string) => {
    if (!delta) return;
    chunks.push(delta);
    post({ type: 'chunk', requestId, delta });
  };
  try {
    for await (const delta of result.textStream) {
      watchdog.beat(); // the ceiling is on SILENCE — a slow-but-live stream must not trip it
      emit(strip.push(delta));
    }
  } finally {
    watchdog.done();
  }
  if (streamError) throw streamError;
  if (signal.aborted) return null; // user cancelled — the client is gone
  if (watchdog.timedOut()) throw watchdogError();
  // Ended short with no error and no abort: the model hit its output cap or a
  // content filter cut it. Same rule as the watchdog — a truncated completion
  // must surface as an error, never as a quietly-shortened success that the
  // caller then caches.
  const shortStop = shortStopError(await finishReason);
  if (shortStop) throw shortStop;
  emit(strip.flush()); // an unclosed <think> was literal content — recover it
  post({ type: 'done', requestId });
  return chunks.join('');
}

export function registerStreamServer(): void {
  browser.runtime.onConnect.addListener((port) => {
    if (port.name !== STREAM_PORT_NAME) return;
    const controllers = new Map<string, AbortController>();

    port.onMessage.addListener((raw) => {
      const msg = raw as StreamClientMessage;
      if (msg.type === 'cancel') {
        controllers.get(msg.requestId)?.abort();
        controllers.delete(msg.requestId);
      } else if (msg.type === 'start') {
        void handleStart(port, msg.requestId, msg.request, controllers);
      } else if (msg.type === 'batchStart') {
        void handleBatchStart(port, msg, controllers);
      } else if (msg.type === 'annotate') {
        void handleAnnotate(port, msg, controllers);
      }
    });

    port.onDisconnect.addListener(() => {
      // A page navigating into the back/forward cache closes its ports with
      // runtime.lastError SET; leaving it unread logs "Unchecked
      // runtime.lastError" to the extension's Errors page. Reading it is the
      // whole fix — the disconnect itself is handled below.
      void browser.runtime.lastError;
      controllers.forEach((c) => c.abort());
      controllers.clear();
    });
  });
}

/** try/catch-safe post factory for one port. */
function makePost(port: RuntimePort): (m: StreamServerMessage) => void {
  return (m) => {
    try {
      port.postMessage(m);
    } catch {
      /* port closed */
    }
  };
}

/** Exported for behavioural tests (fake port + controllers map). */
export async function handleStart(
  port: RuntimePort,
  requestId: string,
  request: TranslateRequest,
  controllers: Map<string, AbortController>
): Promise<void> {
  const post = makePost(port);
  await runStreamHandler(requestId, controllers, (message) => post({ type: 'error', requestId, message }), async (ac) => {
    const text = request.text.trim();
    if (!text) {
      post({ type: 'done', requestId });
      return;
    }
    const config = await getConfig();
    const { provider, target, source, useMt } = resolveCallEnv(config, request);

    if (useMt) {
      // No streaming endpoint — reuse the non-streaming engine (incl. its cache)
      // and emit the result as one chunk.
      const out = await executeTranslate({ ...request, mode: 'mt' }, config, { cache: dexieCache, signal: ac.signal });
      post({ type: 'chunk', requestId, delta: out.text });
      post({ type: 'done', requestId, detectedSource: out.detectedSource });
      return;
    }

    const apiKey = requireApiKey(provider);
    const { key, built } = await singleTranslationKey(text, provider, source, target, config, request.context);
    const hit = await dexieCache.get(key).catch(() => undefined); // broken IndexedDB → miss
    if (hit) {
      post({ type: 'chunk', requestId, delta: hit });
      post({ type: 'done', requestId });
      return;
    }

    const model = await createLlmModel(provider, apiKey);
    // Deliberately NOT behind withStreamSlot: the cap exists to stop BATCH
    // fan-out, not a lone selection. A user-initiated stream (划词) must never
    // wait on a slot at all — even under the limiter's newest-first wake order
    // it would still block while all four slots stream page batches (under the
    // old FIFO order it spun for minutes behind them). The watchdog timeout
    // still bounds a wedged upstream.
    const full = await pumpModelStream(post, requestId, ac.signal, {
      model,
      system: built.system,
      prompt: built.prompt,
      ...llmCallOptions(provider),
    });
    const trimmed = full?.trim();
    if (trimmed) void dexieCache.set(key, trimmed).catch(() => {});
  });
}

/**
 * 注疏 — reader's-companion notes for a translated selection. LLM-only by
 * nature (the free MT can't reason about nuance); the client hides the
 * affordance for MT engines, so an error here is a config drift, not a normal
 * path. Not behind the batch limiter: one user click, one stream — same
 * standing as a selection translation. Uncached: notes are one-off,
 * low-repeat, and cheap next to page translation.
 */
async function handleAnnotate(
  port: RuntimePort,
  msg: AnnotateStart,
  controllers: Map<string, AbortController>
): Promise<void> {
  const { requestId } = msg;
  const post = makePost(port);
  await runStreamHandler(requestId, controllers, (message) => post({ type: 'error', requestId, message }), async (ac) => {
    const config = await getConfig();
    const provider = resolveProvider(config, msg.providerId);
    if (provider.kind === 'google-mt') throw new Error('annotation needs an LLM engine');
    const apiKey = requireApiKey(provider);
    const model = await createLlmModel(provider, apiKey);
    const { system, prompt } = buildAnnotatePrompt(msg.text, msg.translation, msg.target || config.translate.target);
    await pumpModelStream(post, requestId, ac.signal, {
      model,
      system,
      prompt,
      ...llmCallOptions(provider),
    });
  });
}
