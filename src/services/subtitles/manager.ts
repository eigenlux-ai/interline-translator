/** Subtitle business queue. Independent from the page queue; transport owns no queue. */
import type { Config, ProviderConfig } from '@/data/models';
import { sharedAdmission } from '@/services/translation/admission';
import { dexieCache } from '@/services/translation/cache/db';
import { subtitleCacheEpoch, subtitleCacheKey, writeSubtitleCache } from './cache';
import { executeSubtitleBatch, type SubtitleExecution } from './execute';
import {
  SUBTITLE_LIMITS,
  type SubtitleSubscription,
  type SubtitleTranslationEvent,
  type SubtitleWindow,
} from './protocol';

interface Consumer {
  session: string;
  window: SubtitleWindow;
  cue: SubtitleSubscription;
}
interface Task {
  key: string;
  config: Config;
  provider: ProviderConfig;
  target: string;
  window: SubtitleWindow;
  cue: SubtitleSubscription;
  consumers: Map<string, Consumer>;
  attempts: number;
  readyAt: number;
  state: 'queued' | 'offered' | 'running';
  abort?: AbortController;
  startedAt?: number;
}
interface Session {
  owner: string;
  revision: number;
  preparing: boolean;
  emit: (event: SubtitleTranslationEvent) => void;
  consumers: Map<string, string>;
  window?: SubtitleWindow;
}
interface OfferedBatch {
  tasks: Task[];
  active: boolean;
}
const MAX_CURRENT_OFFERS = 3;
const MAX_PREFETCH_OFFERS = 2;
export interface SubtitleManagerDeps {
  prepare: (
    window: SubtitleWindow,
    owner: string
  ) => Promise<{ config: Config; provider: ProviderConfig; target: string }>;
  execute?: (input: SubtitleExecution) => Promise<Map<string, string>>;
  key?: typeof subtitleCacheKey;
  cacheGet?: (key: string) => Promise<string | undefined>;
  cacheWrite?: typeof writeSubtitleCache;
}
function retryable(error: unknown): boolean {
  const e = error as { statusCode?: number; status?: number; isRetryable?: boolean; name?: string };
  if (e?.name === 'AbortError') return false;
  if (typeof e?.isRetryable === 'boolean') return e.isRetryable;
  const status = e?.statusCode ?? e?.status;
  return !status || status === 408 || status === 429 || status >= 500;
}
export class SubtitleRequestManager {
  private sessions = new Map<string, Session>();
  private tasks = new Map<string, Task>();
  private active = 0;
  private offers = new Set<OfferedBatch>();
  private timer?: ReturnType<typeof setTimeout>;
  private scheduled = false;
  constructor(private readonly deps: SubtitleManagerDeps) {}
  get size(): number {
    return this.tasks.size;
  }
  open(id: string, owner: string, emit: Session['emit']): boolean {
    if (this.sessions.has(id) || this.sessions.size >= SUBTITLE_LIMITS.maxSessions) return false;
    this.sessions.set(id, { owner, emit, revision: 0, preparing: false, consumers: new Map() });
    return true;
  }
  async updateWindow(id: string, window: SubtitleWindow): Promise<void> {
    const session = this.sessions.get(id);
    if (!session) return;
    const revision = ++session.revision;
    session.preparing = true;
    try {
      session.window = window;
      // Invalidate old references immediately, before config/cache/key awaits.
      for (const [subscriptionId, key] of session.consumers) {
        const task = this.tasks.get(key);
        const consumer = task?.consumers.get(`${id}:${subscriptionId}`);
        const next = window.subscriptions.find((c) => c.subscriptionId === subscriptionId);
        if (
          consumer &&
          next &&
          consumer.window.generation === window.generation &&
          consumer.window.trackVersion === window.trackVersion &&
          consumer.cue.contentVersion === next.contentVersion &&
          consumer.cue.text === next.text &&
          consumer.cue.context === next.context
        ) {
          consumer.cue = next;
        } else this.detach(id, subscriptionId, 'invalidated');
      }
      sharedAdmission.notify();
      let prepared: Awaited<ReturnType<SubtitleManagerDeps['prepare']>>;
      try {
        prepared = await this.deps.prepare(window, session.owner);
      } catch {
        if (session.revision === revision)
          for (const subscriptionId of [...session.consumers.keys()]) this.detach(id, subscriptionId, 'invalidated');
        if (session.revision === revision)
          for (const cue of window.subscriptions)
            this.emit({ session: id, window, cue }, 'failed', undefined, 'provider-unavailable', false);
        return;
      }
      if (session.revision !== revision || !this.sessions.has(id)) return;
      const keyed = await Promise.all(
        window.subscriptions.map(async (cue) => ({
          cue,
          key: await (this.deps.key ?? subtitleCacheKey)(
            prepared.config,
            prepared.provider,
            prepared.target,
            window,
            cue,
            session.owner.split(':').at(-1)
          ),
        }))
      );
      if (session.revision !== revision || !this.sessions.has(id)) return;
      for (const { cue, key } of keyed) {
        const previous = session.consumers.get(cue.subscriptionId);
        if (previous === key) {
          const existing = this.tasks.get(key);
          if (existing) {
            existing.config = prepared.config;
            existing.provider = prepared.provider;
          }
          continue;
        }
        if (previous) this.detach(id, cue.subscriptionId, 'invalidated');
        let task = this.tasks.get(key);
        if (!task && this.tasks.size >= SUBTITLE_LIMITS.maxTasks) {
          this.emit({ session: id, window, cue }, 'failed', undefined, 'capacity', true);
          continue;
        }
        if (!task) {
          task = { key, ...prepared, window, cue, consumers: new Map(), attempts: 0, readyAt: 0, state: 'queued' };
          this.tasks.set(key, task);
        } else {
          task.config = prepared.config;
          task.provider = prepared.provider;
        }
        session.consumers.set(cue.subscriptionId, key);
        task.consumers.set(`${id}:${cue.subscriptionId}`, { session: id, window, cue });
      }
      sharedAdmission.notify();
      this.schedule();
    } catch (error) {
      // An unexpected key/preparation error cannot leave old references eligible.
      if (session.revision === revision)
        for (const subscriptionId of [...session.consumers.keys()]) this.detach(id, subscriptionId, 'invalidated');
      throw error;
    } finally {
      if (session.revision === revision) session.preparing = false;
      sharedAdmission.notify();
    }
  }
  refresh(): void {
    const sessions = [...this.sessions].filter(([, session]) => session.window);
    // Install the barrier for every session before any update can notify admission.
    for (const [, session] of sessions) session.preparing = true;
    for (const [id, session] of sessions) void this.updateWindow(id, session.window!).catch(() => this.close(id));
  }
  close(id: string): void {
    const session = this.sessions.get(id);
    if (!session) return;
    session.revision++;
    for (const subscriptionId of [...session.consumers.keys()]) this.detach(id, subscriptionId, 'cancelled');
    this.sessions.delete(id);
    sharedAdmission.notify();
    this.schedule();
  }
  private detach(id: string, subscriptionId: string, type: 'cancelled' | 'invalidated'): void {
    const session = this.sessions.get(id),
      key = session?.consumers.get(subscriptionId);
    session?.consumers.delete(subscriptionId);
    if (!key) return;
    const task = this.tasks.get(key),
      consumer = task?.consumers.get(`${id}:${subscriptionId}`);
    if (consumer) this.emit(consumer, type);
    task?.consumers.delete(`${id}:${subscriptionId}`);
    if (task && !task.consumers.size) {
      this.tasks.delete(key);
      // A batch is aborted only after ALL of its tasks lose their consumers.
      if (task.abort && ![...this.tasks.values()].some((t) => t.abort === task.abort && t.consumers.size))
        task.abort.abort();
    }
  }
  private emit(
    c: Consumer,
    type: SubtitleTranslationEvent['type'],
    text?: string,
    code: NonNullable<SubtitleTranslationEvent['error']>['code'] = 'translation-failed',
    canRetry = true
  ): void {
    this.sessions.get(c.session)?.emit({
      version: 1,
      type,
      generation: c.window.generation,
      trackVersion: c.window.trackVersion,
      subscriptionId: c.cue.subscriptionId,
      cueId: c.cue.cueId,
      contentVersion: c.cue.contentVersion,
      ...(text === undefined ? {} : { text }),
      ...(type === 'failed' ? { error: { code, retryable: canRetry } } : {}),
    });
  }
  private current(task: Task): boolean {
    return [...task.consumers.values()].some((c) => c.cue.priority === 'current');
  }
  private currentBatch(batch: readonly Task[]): boolean {
    return batch.some((task) => this.tasks.get(task.key) === task && this.current(task));
  }
  private preparingBatch(batch: readonly Task[]): boolean {
    return batch.some(
      (task) =>
        this.tasks.get(task.key) === task &&
        [...task.consumers.values()].some((consumer) => this.sessions.get(consumer.session)?.preparing)
    );
  }
  private schedule(): void {
    if (this.scheduled) return;
    this.scheduled = true;
    queueMicrotask(() => {
      this.scheduled = false;
      this.drain();
    });
  }
  private drain(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    const queued = [...this.tasks.values()].filter((t) => t.state === 'queued' && t.consumers.size);
    queued.sort(
      (a, b) => Number(this.current(b)) - Number(this.current(a)) || (a.cue.distanceMs ?? 0) - (b.cue.distanceMs ?? 0)
    );
    const now = Date.now();
    let nextWake = Infinity;
    for (const task of queued) {
      if (task.state !== 'queued') continue;
      const current = this.current(task);
      const offers = [...this.offers].filter((offer) => this.currentBatch(offer.tasks) === current).length;
      if (offers >= (current ? MAX_CURRENT_OFFERS : MAX_PREFETCH_OFFERS)) continue;
      const settings = task.config.videoSubtitles.requests;
      const wait = task.readyAt - now;
      if (wait > 0) {
        nextWake = Math.min(nextWake, wait);
        continue;
      }
      const batch = [task];
      let chars = task.cue.text.length;
      if (task.provider.kind !== 'google-mt')
        for (const other of queued) {
          if (
            other === task ||
            other.state !== 'queued' ||
            other.readyAt > now ||
            batch.length >= settings.maxBatchItems
          )
            continue;
          if (
            other.config !== task.config ||
            other.provider.id !== task.provider.id ||
            other.target !== task.target ||
            other.window.sourceLanguage !== task.window.sourceLanguage ||
            other.window.title !== task.window.title ||
            chars + other.cue.text.length > settings.maxBatchChars
          )
            continue;
          batch.push(other);
          chars += other.cue.text.length;
        }
      const offer: OfferedBatch = { tasks: batch, active: false };
      this.offers.add(offer);
      const abort = new AbortController();
      for (const item of batch) {
        item.state = 'offered';
        item.abort = abort;
      }
      void this.run(batch, abort, offer).finally(() => {
        this.offers.delete(offer);
        sharedAdmission.notify();
        this.schedule();
      });
    }
    if (Number.isFinite(nextWake)) this.timer = setTimeout(() => this.schedule(), nextWake);
  }
  private async run(batch: Task[], abort: AbortController, offer: OfferedBatch): Promise<void> {
    const epoch = subtitleCacheEpoch();
    for (const task of batch) task.startedAt ??= Date.now();
    const remaining = Math.max(
      0,
      Math.min(...batch.map((task) => task.startedAt! + SUBTITLE_LIMITS.totalExecutionMs - Date.now()))
    );
    const timer = setTimeout(() => abort.abort(new DOMException('Subtitle timeout', 'TimeoutError')), remaining);
    const pending: Task[] = [];
    const delivered = new Set<string>();
    try {
      for (const task of batch) {
        const hit = await (this.deps.cacheGet ?? dexieCache.get)(task.key).catch(() => undefined);
        if (hit) this.finish(task, hit);
        else if (task.consumers.size) pending.push(task);
      }
      if (!pending.length) return;
      const task = pending[0];
      const liveTask = () => pending.find((item) => this.tasks.get(item.key) === item && item.consumers.size) ?? task;
      const owner = this.sessions.get([...task.consumers.values()][0]?.session)?.owner;
      const results = await (this.deps.execute ?? executeSubtitleBatch)({
        get config() {
          return liveTask().config;
        },
        get provider() {
          return liveTask().provider;
        },
        source: task.window.sourceLanguage,
        target: task.target,
        title: task.window.title,
        domain: owner?.split(':').at(-1),
        signal: abort.signal,
        admission: {
          owner,
          canStart: () =>
            !this.preparingBatch(pending) &&
            this.active < Math.min(3, liveTask().config.videoSubtitles.requests.maxConcurrent) &&
            (this.currentBatch(pending) ||
              [...this.offers].filter((other) => other.active && !this.currentBatch(other.tasks)).length <
                MAX_PREFETCH_OFFERS),
          onStart: () => {
            this.active += 1;
            offer.active = true;
            for (const item of pending) if (this.tasks.get(item.key) === item) item.state = 'running';
          },
          onFinish: () => {
            this.active -= 1;
            offer.active = false;
            this.schedule();
          },
          rateLimit: {
            key: `subtitle:${task.provider.id}`,
            intervalMs: () => 1000 / liveTask().config.videoSubtitles.requests.requestsPerSecond,
          },
          currentKind: () =>
            pending.some((t) => this.tasks.get(t.key) === t && this.current(t))
              ? 'subtitle-current'
              : 'subtitle-prefetch',
        },
        onItem: (key, text) => {
          const item = pending.find((t) => t.key === key);
          if (!item || this.tasks.get(item.key) !== item || abort.signal.aborted) return;
          delivered.add(item.key);
          void (this.deps.cacheWrite ?? writeSubtitleCache)(item.key, text, epoch).catch(() => {});
          this.finish(item, text);
        },
        items: pending.map((t) => ({
          key: t.key,
          text: t.cue.text.trim().replace(/\r\n/g, '\n'),
          context: t.cue.context ?? '',
        })),
      });
      abort.signal.throwIfAborted();
      for (const item of pending) {
        if (delivered.has(item.key)) continue;
        const text = results.get(item.key);
        if (text) {
          await (this.deps.cacheWrite ?? writeSubtitleCache)(item.key, text, epoch).catch(() => {});
          if (this.tasks.get(item.key) === item) this.finish(item, text);
        } else this.fail(item, new Error('Missing subtitle batch item'));
      }
    } catch (error) {
      for (const task of pending) this.fail(task, abort.signal.aborted ? abort.signal.reason : error);
    } finally {
      clearTimeout(timer);
    }
  }
  private finish(task: Task, text: string): void {
    if (this.tasks.get(task.key) !== task) return;
    for (const c of task.consumers.values()) {
      this.emit(c, 'completed', text);
      this.sessions.get(c.session)?.consumers.delete(c.cue.subscriptionId);
    }
    this.tasks.delete(task.key);
  }
  private fail(task: Task, error: unknown): void {
    if (this.tasks.get(task.key) !== task || !task.consumers.size) return;
    if (
      task.attempts < SUBTITLE_LIMITS.maxRetries &&
      retryable(error) &&
      Date.now() - (task.startedAt ?? Date.now()) < SUBTITLE_LIMITS.totalExecutionMs
    ) {
      task.attempts++;
      task.state = 'queued';
      task.abort = undefined;
      task.readyAt = Date.now() + SUBTITLE_LIMITS.retryBaseMs * 2 ** (task.attempts - 1);
      return;
    }
    for (const c of task.consumers.values()) {
      this.emit(
        c,
        'failed',
        undefined,
        (error as Error)?.name === 'TimeoutError' ? 'timeout' : 'translation-failed',
        retryable(error)
      );
      this.sessions.get(c.session)?.consumers.delete(c.cue.subscriptionId);
    }
    this.tasks.delete(task.key);
  }
}
