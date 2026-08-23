/**
 * @module services/translation/queue/request-queue
 *
 * Bounded, fair, deduplicating request scheduler. Protects provider APIs from
 * a page that wants to translate hundreds of nodes at once:
 *   - concurrency cap (max parallel in-flight);
 *   - minimum interval between starts (simple token-bucket rate limit);
 *   - dedup: identical keys in-flight share one promise (one network call);
 *   - priority: higher runs first (viewport nodes beat off-screen ones);
 *   - retry with exponential backoff on failure.
 *
 * Pure scheduling logic — no DOM, no ai-sdk. Unit-tested with fake timers.
 */

export interface RequestQueueOptions {
  maxConcurrent?: number;
  /** Minimum ms between task starts (rate limit). 0 = no throttle. */
  minIntervalMs?: number;
  maxRetries?: number;
  /** Base backoff; attempt N waits baseBackoffMs * 2^(N-1). */
  baseBackoffMs?: number;
}

interface Task<R> {
  key: string;
  priority: number;
  run: () => Promise<R>;
  resolve: (r: R) => void;
  reject: (e: unknown) => void;
  attempt: number;
}

const DEFAULTS: Required<RequestQueueOptions> = {
  maxConcurrent: 6,
  minIntervalMs: 0,
  maxRetries: 2,
  baseBackoffMs: 500,
};

/**
 * Retrying a PERMANENT failure (invalid key 401, bad request 400) just triples
 * the doomed call and delays the visible error by the full backoff ladder.
 * ai-sdk's APICallError carries an explicit `isRetryable`; otherwise classify
 * by status: 408/429/5xx are transient, other 4xx are permanent, and anything
 * without a status (network drop) is worth retrying.
 */
function isRetryable(error: unknown): boolean {
  const e = error as { isRetryable?: unknown; statusCode?: unknown; status?: unknown };
  if (typeof e?.isRetryable === 'boolean') return e.isRetryable;
  const status = typeof e?.statusCode === 'number' ? e.statusCode : typeof e?.status === 'number' ? e.status : null;
  if (status === null) return true;
  return status === 408 || status === 429 || status >= 500;
}

export class RequestQueue {
  private readonly opts: Required<RequestQueueOptions>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private queue: Task<any>[] = [];
  private active = 0;
  private lastStart = 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private inflight = new Map<string, Promise<any>>();
  private draining = false;

  constructor(options: RequestQueueOptions = {}) {
    this.opts = { ...DEFAULTS, ...options };
  }

  /** Number of tasks queued or running (for backpressure decisions). */
  get size(): number {
    return this.queue.length + this.active;
  }

  /**
   * Schedule `run` under `key`. If an identical key is already in-flight, the
   * existing promise is returned (deduped) — `run` is not invoked again.
   */
  enqueue<R>(key: string, run: () => Promise<R>, priority = 0): Promise<R> {
    const existing = this.inflight.get(key);
    if (existing) return existing as Promise<R>;

    const promise = new Promise<R>((resolve, reject) => {
      this.queue.push({ key, priority, run, resolve, reject, attempt: 0 });
    });
    this.inflight.set(key, promise);
    // Cleanup happens deterministically in start() when the task FINALLY settles
    // (kept during retries) — not via a detached .finally(), which would race
    // the caller's await continuation.
    this.drain();
    return promise;
  }

  private drain(): void {
    if (this.draining) return;
    this.draining = true;
    try {
      while (this.active < this.opts.maxConcurrent && this.queue.length > 0) {
        if (this.opts.minIntervalMs > 0) {
          const wait = this.lastStart + this.opts.minIntervalMs - Date.now();
          if (wait > 0) {
            setTimeout(() => this.drain(), wait);
            break;
          }
        }
        // Highest priority first; stable for equal priorities (insertion order).
        let idx = 0;
        for (let i = 1; i < this.queue.length; i++) {
          if (this.queue[i].priority > this.queue[idx].priority) idx = i;
        }
        const [task] = this.queue.splice(idx, 1);
        this.start(task);
      }
    } finally {
      this.draining = false;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private start(task: Task<any>): void {
    this.active++;
    this.lastStart = Date.now();
    task.run().then(
      (result) => {
        this.active--;
        this.inflight.delete(task.key);
        task.resolve(result);
        this.drain();
      },
      (error) => {
        this.active--;
        if (task.attempt < this.opts.maxRetries && isRetryable(error)) {
          task.attempt++; // still in-flight: keep the dedup entry during retries
          const backoff = this.opts.baseBackoffMs * 2 ** (task.attempt - 1);
          setTimeout(() => {
            this.queue.push(task);
            this.drain();
          }, backoff);
        } else {
          this.inflight.delete(task.key);
          task.reject(error);
        }
        this.drain();
      }
    );
  }
}
