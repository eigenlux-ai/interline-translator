/**
 * @module services/stream/limiter
 *
 * Global cap on concurrent upstream LLM streams. The stream/batch paths don't
 * go through the shared RequestQueue (they need incremental output, not a
 * settled promise), so without this a big page flushing a batch every 16
 * items/3000 chars would open dozens of simultaneous streamText calls against
 * the provider — rate-limit bait with no backpressure. BACKGROUND-ONLY state;
 * an SW restart naturally resets it.
 */

const MAX_CONCURRENT_STREAMS = 4;

let active = 0;
const waiters: (() => void)[] = [];

/**
 * Watchdog ceilings for one upstream stream. A wedged endpoint (accepts the
 * connection, never emits, never closes) would otherwise hold its slot — and
 * its port + keep-alive — forever; four of those would freeze every tab's
 * translation with no reset (the keep-alive keeps the SW alive by design).
 *
 * The ceiling that matters is on SILENCE, not on duration: a local Ollama
 * grinding a 3000-char batch on CPU emits steadily for minutes and is in no
 * way wedged, while a wedged endpoint is recognisable within seconds. A total
 * wall-clock cap punished exactly the wrong one. The absolute cap survives
 * only as a backstop against a stream that dribbles forever, set far beyond
 * any real completion.
 */
const STREAM_IDLE_MS = 60_000;
const STREAM_TOTAL_MS = 900_000;

export interface Watchdog {
  /** Combined signal (caller's abort ∪ timeout) — pass to streamText/generateText. */
  signal: AbortSignal;
  /** True when a TIMEOUT fired (as opposed to the caller aborting). */
  timedOut(): boolean;
  /** Progress: restart the silence clock. Call on every delta. */
  beat(): void;
  /** Release the timers. Call in a finally — an armed timer keeps the SW alive. */
  done(): void;
}

/**
 * Combine the caller's abort with the watchdog timeouts, keeping them
 * distinguishable. The distinction is load-bearing: ai-sdk 6 does NOT throw
 * out of `textStream` on abort — the stream just ENDS cleanly — so after the
 * loop the caller must ask "did my user cancel (stay silent) or did the
 * watchdog fire (a truncated result that must surface as an ERROR, not as a
 * quietly-shortened success)?"
 */
export function makeWatchdog(
  signal: AbortSignal,
  idleMs: number = STREAM_IDLE_MS,
  totalMs: number = STREAM_TOTAL_MS
): Watchdog {
  const ac = new AbortController();
  let fired = false;
  const trip = () => {
    fired = true;
    ac.abort();
  };
  const total = setTimeout(trip, totalMs);
  let idle = setTimeout(trip, idleMs);
  const clear = () => {
    clearTimeout(idle);
    clearTimeout(total);
  };
  ac.signal.addEventListener('abort', clear, { once: true });
  return {
    signal: AbortSignal.any([signal, ac.signal]),
    timedOut: () => fired,
    beat: () => {
      if (fired) return;
      clearTimeout(idle);
      idle = setTimeout(trip, idleMs);
    },
    done: clear,
  };
}

/** The canonical wedged-upstream error (client-visible message). */
export function watchdogError(): Error {
  return new Error('translation timed out — the provider stopped responding');
}

/**
 * A stream can also end SHORT with no error and no abort: the model ran out of
 * output budget (`length` — reachable straight from the user's own
 * maxOutputTokens knob) or a provider filter cut the response off. ai-sdk
 * reports both ONLY through `finishReason`, so without this check the last
 * half-written sentence flushes as a finished segment, renders as final and
 * lands in the 30-day cache — the same "quietly-shortened success" the
 * watchdog branch exists to prevent, arriving through a different door.
 */
const SHORT_STOP_REASON: Record<string, string> = {
  length: 'the model hit its output token limit — raise the max output tokens setting',
  'content-filter': 'the provider stopped the response (content filter)',
};

/**
 * The canonical stopped-short error for a finishReason, or null when the model
 * really did finish. Callers must read `finishReason` through a
 * `.catch(() => undefined)` attached right after `streamText` — a failed
 * stream rejects that promise too, and the captured `onError` value is
 * re-thrown long before anyone awaits it.
 */
export function shortStopError(finishReason: string | undefined): Error | null {
  const why = finishReason === undefined ? undefined : SHORT_STOP_REASON[finishReason];
  return why ? new Error(`translation stopped early — ${why}`) : null;
}

/**
 * Run `fn` once a stream slot frees up. Always releases.
 *
 * Waiters wake NEWEST-FIRST (LIFO). Batch arrival is viewport-gated on the
 * content side, so the youngest waiter is the batch closest to where the user
 * is looking right now; older waiters are content scrolled past on the way.
 * FIFO serviced exactly the wrong end: after a fast scroll, the paragraph in
 * front of the user queued behind every batch minted during the scroll.
 * Deferred batches can't starve in practice — new batches only arrive while
 * the user keeps scrolling, and the backlog drains as soon as they stop.
 * The pool is shared by every tab, but a backgrounded tab barely mints new
 * batches (its IntersectionObserver is throttled), so a foreground scroll
 * burst defers another tab's queued batches only briefly.
 */
export async function withStreamSlot<T>(fn: () => Promise<T>): Promise<T> {
  if (active >= MAX_CONCURRENT_STREAMS) {
    await new Promise<void>((resolve) => waiters.push(resolve));
    // The releaser transferred its slot to us — `active` already counts it.
  } else {
    active++;
  }
  try {
    return await fn();
  } finally {
    const next = waiters.pop();
    if (next) next(); // hand the slot over without touching the count
    else active--;
  }
}
