/** Shared, bounded admission immediately around an actual provider invocation. */
export type TranslationTaskKind = 'subtitle-current' | 'subtitle-prefetch' | 'page' | 'interactive';
export interface AdmissionMeta {
  providerId: string;
  kind?: TranslationTaskKind;
  /** Background-derived document owner. Never accept this from page messages. */
  owner?: string;
  signal?: AbortSignal;
  /** Subtitle subscriptions can be promoted while awaiting admission. */
  currentKind?: () => TranslationTaskKind;
  /** Applied at the actual start, including after a long admission wait. */
  rateLimit?: { key: string; intervalMs: number | (() => number) };
  /** A business concurrency budget is checked without reserving an upstream slot. */
  canStart?: () => boolean;
  /** Synchronous reservation/release at the actual invocation boundary. */
  onStart?: () => void;
  onFinish?: () => void;
}
interface Candidate {
  meta: AdmissionMeta;
  at: number;
  start: (kind: TranslationTaskKind) => void;
  reject: (error: unknown) => void;
  detach: () => void;
}
export class SharedAdmissionController {
  private active = 0;
  private prefetch = 0;
  private pages = 0;
  private providers = new Map<string, number>();
  private lastStarts = new Map<string, number>();
  private cooldown = new Map<string, number>();
  private candidates: Candidate[] = [];
  private timer?: ReturnType<typeof setTimeout>;
  private lastOwner?: string;
  private prefetchStreak = 0;
  constructor(
    readonly capacity = 6,
    readonly providerCapacity = 6,
    readonly maxCandidates = 256
  ) {}
  get activeCount(): number {
    return this.active;
  }
  get pendingCount(): number {
    return this.candidates.length;
  }
  private earliest(meta: AdmissionMeta): number {
    const rate = meta.rateLimit;
    if (!rate || !this.lastStarts.has(rate.key)) return 0;
    return (
      this.lastStarts.get(rate.key)! + (typeof rate.intervalMs === 'function' ? rate.intervalMs() : rate.intervalMs)
    );
  }
  async run<T>(meta: AdmissionMeta, fn: () => Promise<T>): Promise<T> {
    meta.signal?.throwIfAborted();
    const admittedKind = await new Promise<TranslationTaskKind>((resolve, reject) => {
      const kind = meta.currentKind?.() ?? meta.kind;
      const canStart =
        this.active < this.capacity &&
        (this.providers.get(meta.providerId) ?? 0) < this.providerCapacity &&
        (this.cooldown.get(meta.providerId) ?? 0) <= Date.now() &&
        this.earliest(meta) <= Date.now() &&
        (meta.canStart?.() ?? true) &&
        (kind !== 'subtitle-prefetch' || this.capacity === 1 || this.prefetch < this.capacity - 1);
      if (this.candidates.length >= this.maxCandidates && !canStart) {
        reject(new Error('Translation admission capacity exceeded'));
        return;
      }
      const abort = () => {
        const index = this.candidates.indexOf(candidate);
        if (index >= 0) this.candidates.splice(index, 1);
        candidate.detach();
        reject(meta.signal?.reason ?? new DOMException('Aborted', 'AbortError'));
        this.drain();
      };
      const candidate: Candidate = {
        meta,
        at: Date.now(),
        start: resolve,
        reject,
        detach: () => meta.signal?.removeEventListener('abort', abort),
      };
      meta.signal?.addEventListener('abort', abort, { once: true });
      this.candidates.push(candidate);
      this.drain();
    });
    // active/provider counters were reserved by drain; track the category there too.
    try {
      meta.signal?.throwIfAborted();
      return await fn();
    } catch (error) {
      const e = error as { status?: number; statusCode?: number };
      if (e?.status === 429 || e?.statusCode === 429) this.cooldown.set(meta.providerId, Date.now() + 2000);
      throw error;
    } finally {
      this.active--;
      if (admittedKind === 'subtitle-prefetch') this.prefetch--;
      if (admittedKind === 'page') this.pages--;
      const count = (this.providers.get(meta.providerId) ?? 1) - 1;
      if (count) this.providers.set(meta.providerId, count);
      else this.providers.delete(meta.providerId);
      meta.onFinish?.();
      this.drain();
    }
  }
  /** Re-evaluate in-place promotions. */
  notify(): void {
    this.drain();
  }
  private drain(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
    const now = Date.now();
    for (const [provider, until] of this.cooldown) if (until <= now) this.cooldown.delete(provider);
    while (this.active < this.capacity) {
      const eligible = this.candidates.filter(
        (c) =>
          (this.providers.get(c.meta.providerId) ?? 0) < this.providerCapacity &&
          !this.cooldown.has(c.meta.providerId) &&
          this.earliest(c.meta) <= now &&
          (c.meta.canStart?.() ?? true) &&
          ((c.meta.currentKind?.() ?? c.meta.kind) !== 'subtitle-prefetch' ||
            this.capacity === 1 ||
            this.prefetch < this.capacity - 1)
      );
      if (!eligible.length) break;
      const score = (c: Candidate) => {
        const kind = c.meta.currentKind?.() ?? c.meta.kind ?? 'page';
        if (kind === 'subtitle-current' || kind === 'interactive')
          return 10000 + (c.meta.owner !== this.lastOwner ? 5 : 0);
        if (kind === 'page' && this.prefetchStreak >= 2) return 1000 + Math.min(500, (now - c.at) / 100);
        return (
          (kind === 'subtitle-prefetch' ? 100 : 0) +
          Math.min(500, (now - c.at) / 100) +
          (c.meta.owner !== this.lastOwner ? 5 : 0)
        );
      };
      eligible.sort((a, b) => score(b) - score(a) || a.at - b.at);
      // With multiple lanes preserve one page opportunity under sustained
      // subtitle/interaction load. Single-lane current work remains first.
      const page =
        this.capacity > 1 && this.active >= this.capacity - 1 && this.pages === 0
          ? eligible.find((c) => (c.meta.currentKind?.() ?? c.meta.kind ?? 'page') === 'page')
          : undefined;
      const next = page ?? eligible[0];
      this.candidates.splice(this.candidates.indexOf(next), 1);
      next.detach();
      this.active++;
      const startedKind = next.meta.currentKind?.() ?? next.meta.kind ?? 'page';
      if (startedKind === 'subtitle-prefetch') this.prefetch++;
      if (startedKind === 'page') this.pages++;
      this.providers.set(next.meta.providerId, (this.providers.get(next.meta.providerId) ?? 0) + 1);
      if (next.meta.rateLimit) {
        this.lastStarts.delete(next.meta.rateLimit.key);
        this.lastStarts.set(next.meta.rateLimit.key, now);
        if (this.lastStarts.size > 256) this.lastStarts.delete(this.lastStarts.keys().next().value!);
      }
      if (startedKind === 'subtitle-prefetch') this.prefetchStreak++;
      else if (startedKind === 'page') this.prefetchStreak = 0;
      this.lastOwner = next.meta.owner;
      next.meta.onStart?.();
      next.start(startedKind);
    }
    const wakes = this.candidates
      .map((c) => Math.max(this.cooldown.get(c.meta.providerId) ?? 0, this.earliest(c.meta)))
      .filter((at) => at > now);
    if (wakes.length) this.timer = setTimeout(() => this.drain(), Math.max(1, Math.min(...wakes) - now));
  }
}
export const sharedAdmission = new SharedAdmissionController();
