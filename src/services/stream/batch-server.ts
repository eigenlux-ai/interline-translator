/**
 * @module services/stream/batch-server
 *
 * BACKGROUND side of BATCH streaming translation — the fast path for whole-page
 * LLM translation. One `streamText` call covers many segments; the salted
 * sentinel protocol (translation/batch/protocol) lets us route the stream, char
 * by char, back to each segment so the page fills progressively.
 *
 * Flow per batch:
 *   1. per-item cache lookup (same key derivation as executeTranslate — see
 *      cache-key.singleTranslationKey) → hits emitted now;
 *   2. misses are DEDUPED BY TEXT (list pages repeat their microcopy dozens of
 *      times) and only unique texts are packed into ONE prompt and streamed —
 *      results fan back out to every duplicate;
 *   3. incremental parser → `seg`/`segDone` messages per original index;
 *   4. any unique text the model dropped/merged falls back to an individual
 *      translate — unless the batch was cancelled or timed out (a wedged
 *      upstream must NOT be re-hammered once per segment);
 *   5. MT / mode:"mt" skips batching entirely (it's already cheap), translated
 *      with bounded concurrency through executeTranslate.
 *
 * Shares the stream Port with single-segment streaming; cancellation is the same
 * `cancel` message → AbortController. BACKGROUND-ONLY (ai-sdk).
 */

import { streamText } from 'ai';
import type { BatchStreamServerMessage, BatchStreamStart } from '@/data/models';
import { getConfig } from '@/services/config/storage';
import { buildBatchPrompt, createBatchParser, decodeNewlineTokens } from '@/services/translation/batch/protocol';
import { singleTranslationKey } from '@/services/translation/cache/cache-key';
import { dexieCache } from '@/services/translation/cache/db';
import { executeTranslate } from '@/services/translation/execute';
import { resolveGlossary, withGlossary } from '@/services/translation/glossary';
import { llmCallOptions, requireApiKey, resolveCallEnv } from '@/services/translation/preflight';
import { expertDivergesBatchCache, resolvePromptStyle } from '@/services/translation/prompts';
import { createLlmModel } from '@/services/translation/provider/llm';
import { createThinkStripper } from '@/services/translation/reasoning';
import { runStreamHandler } from './handler';
import { makeWatchdog, shortStopError, watchdogError, withStreamSlot } from './limiter';

type RuntimePort = Parameters<Parameters<typeof browser.runtime.onConnect.addListener>[0]>[0];

/** Run `fn` over `arr` with at most `limit` in flight (protects the MT endpoint). */
async function mapLimit<T>(arr: T[], limit: number, fn: (x: T, i: number) => Promise<void>): Promise<void> {
  let next = 0;
  const worker = async () => {
    while (next < arr.length) {
      const i = next++;
      await fn(arr[i], i);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, arr.length) }, worker));
}

/** One unique text in a batch: every original index it fills + its cache key. */
interface UniqueItem {
  text: string;
  origs: number[];
  /** '' when the shared cache is bypassed (expert divergence). */
  key: string;
  /** False when this segment's own glossary terms were squeezed out of the
   *  capped batch union — its output must not be cached under a key that
   *  claims those terms applied. */
  cacheable: boolean;
}

export async function handleBatchStart(
  port: RuntimePort,
  msg: BatchStreamStart,
  controllers: Map<string, AbortController>
): Promise<void> {
  const { requestId } = msg;
  const post = (m: BatchStreamServerMessage) => {
    try {
      port.postMessage(m);
    } catch {
      /* port closed */
    }
  };

  await runStreamHandler(requestId, controllers, (message) => post({ type: 'batchError', requestId, message }), async (ac) => {
    const items = msg.items.map((t) => t.trim());
    const config = await getConfig();
    const { provider, target, source, useMt } = resolveCallEnv(config, msg);

    // MT (or forced mt): cheap per-item, no batching. Bounded concurrency.
    // Failures stay PER-ITEM: one flaky fetch must not reject the mapLimit and
    // batchError the whole page — completed segments would survive but every
    // remaining one would be abandoned mid-flight.
    if (useMt) {
      let failures = 0;
      await mapLimit(items, 6, async (text, i) => {
        if (ac.signal.aborted) return; // cancelled — stop issuing fetches
        if (!text) return post({ type: 'segDone', requestId, index: i + 1, text: '' });
        try {
          const out = await executeTranslate(
            { text, source, target, providerId: msg.providerId, mode: 'mt', context: msg.context },
            config,
            { cache: dexieCache, signal: ac.signal }
          );
          post({ type: 'segDone', requestId, index: i + 1, text: out.text });
        } catch {
          failures++; // no segDone → the client keeps its per-unit error path
        }
      });
      if (ac.signal.aborted) return;
      const realItems = items.filter((t) => t).length; // blanks pre-resolve and never fail
      if (realItems > 0 && failures === realItems) {
        post({ type: 'batchError', requestId, message: 'every MT request failed' });
      } else {
        post({ type: 'batchDone', requestId });
      }
      return;
    }

    // The per-segment cache is shared with the single path under keys derived
    // from SINGLE-translation semantics. An active expert template makes the
    // batch pipeline genuinely diverge from those semantics (a batch takeover
    // changes batch output without re-keying; a single takeover changes the
    // keys without changing batch output) — so under expert divergence the
    // batch path neither reads nor writes the shared cache. The individual
    // FALLBACK still caches: it runs the real single pipeline.
    const shareCache = !expertDivergesBatchCache(config.prompt);

    // LLM: per-item cache lookup; hits emitted immediately, misses deduped by
    // text (duplicates share one marker, one completion, one cache write).
    const groups = new Map<string, UniqueItem>();
    await Promise.all(
      items.map(async (text, i) => {
        if (!text) return post({ type: 'segDone', requestId, index: i + 1, text: '' });
        const dup = groups.get(text);
        if (dup) return void dup.origs.push(i);
        // Reserve the group SYNCHRONOUSLY-ish per text: compute the key once.
        const item: UniqueItem = { text, origs: [i], key: '', cacheable: true };
        groups.set(text, item);
        if (!shareCache) return;
        item.key = (await singleTranslationKey(text, provider, source, target, config, msg.context)).key;
        // An empty string in cache is treated as a miss — never serve empty content.
        const hit = await dexieCache.get(item.key).catch(() => undefined); // broken IndexedDB → miss
        if (hit) {
          for (const orig of item.origs) {
            post({ type: 'seg', requestId, index: orig + 1, delta: hit });
            post({ type: 'segDone', requestId, index: orig + 1, text: hit });
          }
          groups.delete(text);
        }
      })
    );
    const uniq = [...groups.values()];
    if (uniq.length === 0) {
      post({ type: 'batchDone', requestId });
      return;
    }

    const apiKey = requireApiKey(provider);
    // Style/glossary resolve from the same inputs as the per-item keys
    // (singleTranslationKey resolves internally), so batch prompt and keys
    // agree — EXCEPT at the glossary injection cap: the batch prompt carries
    // the UNION of every unique text's matches (resolveGlossary over the
    // joined texts, deduped in rule order), and when that union is truncated
    // at the cap, a segment whose own term got squeezed out was translated
    // WITHOUT an instruction its key claims — mark it uncacheable below.
    const style = resolvePromptStyle(config.prompt, msg.context?.domain);
    const glossary = resolveGlossary(config.glossary, msg.context?.domain, uniq.map((u) => u.text).join('\n'));
    if (shareCache && config.glossary.length > 0) {
      const unionTerms = new Set(glossary.map((e) => e.source.toLowerCase()));
      for (const u of uniq) {
        const own = resolveGlossary(config.glossary, msg.context?.domain, u.text);
        u.cacheable = own.every((e) => unionTerms.has(e.source.toLowerCase()));
      }
    }
    const { system, prompt, salt } = buildBatchPrompt(
      uniq.map((u) => u.text),
      source,
      target,
      config.prompt,
      withGlossary(msg.context, glossary),
      undefined,
      style
    );
    const model = await createLlmModel(provider, apiKey);
    const parser = createBatchParser(salt);
    const acc = new Map<number, string>(); // parser index (1-based over uniq) → text
    const done = new Set<number>();

    const apply = (events: ReturnType<typeof parser.push>) => {
      for (const e of events) {
        const u = uniq[e.index - 1];
        if (!u) continue; // model invented an out-of-range index — ignore
        if (e.delta) {
          acc.set(e.index, (acc.get(e.index) ?? '') + e.delta);
          for (const orig of u.origs) post({ type: 'seg', requestId, index: orig + 1, delta: e.delta });
        }
        if (e.done) {
          // Decode the salted paragraph-break tokens BEFORE trim/cache/post —
          // the cache must hold real newlines (poison-free for the interleave
          // gate) and the page must never see token syntax.
          const text = decodeNewlineTokens((acc.get(e.index) ?? '').trim(), salt);
          done.add(e.index);
          // Empty output is a MODEL FAILURE for this segment, not a result:
          // never cache it (it would resolve as a permanent blank on every
          // future page), and don't mark it done — the individual fallback
          // below gives it a real second chance.
          if (!text) {
            done.delete(e.index);
            continue;
          }
          if (shareCache && u.cacheable) void dexieCache.set(u.key, text).catch(() => {});
          for (const orig of u.origs) post({ type: 'segDone', requestId, index: orig + 1, text });
        }
      }
    };

    // One batch = one global stream slot, held through the per-item fallback
    // too — a big page fires many batches concurrently, and without the cap
    // every one of them opened its own upstream stream at once.
    await withStreamSlot(async () => {
      let streamError: unknown = null;
      const watchdog = makeWatchdog(ac.signal);
      const result = streamText({
        model,
        system,
        prompt,
        abortSignal: watchdog.signal,
        // ai-sdk 6: provider errors do NOT throw out of textStream — they only
        // reach onError while the stream ends cleanly. Without this capture a
        // bad key / 429 looked like "the model dropped every segment" and got
        // amplified into one doomed fallback call PER SEGMENT.
        onError: ({ error }) => {
          streamError = error;
        },
        ...llmCallOptions(provider),
      });
      // Attach catch handler immediately to prevent unhandled rejections if the stream fails.
      const finishReason = Promise.resolve(result.finishReason).catch(() => undefined);
      // Strip a leading inline <think>…</think>: reasoning models rehearse the
      // marker syntax inside their thinking, which would route reasoning prose
      // into real segments (the parser can't tell a rehearsed marker from a
      // real one).
      const strip = createThinkStripper();
      try {
        for await (const delta of result.textStream) {
          watchdog.beat(); // the ceiling is on SILENCE — a slow-but-live stream must not trip it
          apply(parser.push(strip.push(delta)));
        }
      } finally {
        watchdog.done();
      }

      // Guards BEFORE the flushes (same ordering as pumpModelStream): a failed
      // /aborted/timed-out stream also ends CLEANLY in ai-sdk 6, and flushing
      // first would stamp the half-streamed segment "done" — caching and
      // rendering a TRUNCATED translation as final.
      if (streamError) throw streamError;
      if (ac.signal.aborted) return; // cancelled — no fallback, no batchDone
      // A watchdog fire lands here, not in a catch: surface it as a real error
      // instead of treating the missing tail as "segments to retry
      // individually" against an endpoint we just declared wedged.
      if (watchdog.timedOut()) throw watchdogError();
      // The model ran out of output budget (or was content-filtered) mid-segment:
      // same shape as a watchdog fire — the tail is missing and the segment
      // still open is half a sentence. Flushing it would cache that half.
      const shortStop = shortStopError(await finishReason);
      if (shortStop) throw shortStop;
      apply(parser.push(strip.flush()));
      apply(parser.flush());

      // Any unique text the model dropped/merged → translate it individually
      // (also caches). Batch cancellation propagates via ac.signal.
      const missing = uniq.filter((_, i) => !done.has(i + 1));
      await mapLimit(missing, 4, async (u) => {
        if (ac.signal.aborted) return;
        try {
          const out = await executeTranslate(
            { text: u.text, source, target, providerId: msg.providerId, context: msg.context },
            config,
            { cache: dexieCache, signal: ac.signal }
          );
          for (const orig of u.origs) post({ type: 'segDone', requestId, index: orig + 1, text: out.text });
        } catch {
          if (ac.signal.aborted) return;
          // give up: an empty segDone makes the client drop the gloss silently
          // (documented give-up shape — no error badge for a lone failed item)
          for (const orig of u.origs) post({ type: 'segDone', requestId, index: orig + 1, text: '' });
        }
      });
    });

    if (ac.signal.aborted) return;
    post({ type: 'batchDone', requestId });
  });
}
