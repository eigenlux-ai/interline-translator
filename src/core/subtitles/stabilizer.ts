import { normalizeSubtitleText } from './text';
import type { CurrentTextSnapshot, SubtitleTimers } from './types';

export const DOM_SUBTITLE_DEBOUNCE_MS = 400;
export const DOM_SUBTITLE_MAX_WAIT_MS = 1500;
export const DOM_SUBTITLE_MAX_CHARS = 4000;

export interface DomTextStabilizerOptions {
  timers: SubtitleTimers;
  debounceMs?: number;
  maxWaitMs?: number;
  onDisplay(snapshot: CurrentTextSnapshot): void;
  onStable(snapshot: CurrentTextSnapshot): void;
}

/** Display stays immediate; the translation consumer sees only the latest stable text. */
export class DomTextStabilizer {
  private latest: CurrentTextSnapshot | null = null;
  private observation = 0;
  private version = 0;
  private disposed = false;
  private debounce: unknown;
  private deadline: unknown;
  private hasDebounce = false;
  private hasDeadline = false;
  private submitted = '';
  private readonly debounceMs: number;
  private readonly maxWaitMs: number;

  constructor(private readonly options: DomTextStabilizerOptions) {
    this.debounceMs = Math.max(1, Math.min(1000, options.debounceMs ?? DOM_SUBTITLE_DEBOUNCE_MS));
    this.maxWaitMs = Math.max(this.debounceMs, Math.min(5000, options.maxWaitMs ?? DOM_SUBTITLE_MAX_WAIT_MS));
  }

  update(rawText: string, sessionVersion: number): void {
    if (this.disposed) return;
    const text = normalizeSubtitleText(rawText).slice(0, DOM_SUBTITLE_MAX_CHARS);
    const previous = this.latest;
    if (previous?.text === text && previous.sessionVersion === sessionVersion) return;
    const sameSession = previous?.sessionVersion === sessionVersion;
    const growth = sameSession && previous?.text && text.startsWith(previous.text);
    // A sentence change starts a fresh deadline. Prefix growth keeps the original deadline.
    if (!growth) this.clearTimers();
    this.version += 1;
    this.observation += 1;
    this.latest = { text, observation: this.observation, contentVersion: this.version, sessionVersion };
    this.options.onDisplay({ ...this.latest });
    if (!text) {
      this.submitted = '';
      return;
    }
    if (!sameSession || !growth) this.submitted = '';
    if (this.hasDebounce) this.options.timers.clearTimeout(this.debounce);
    this.hasDebounce = true;
    this.debounce = this.options.timers.setTimeout(() => this.flush(), this.debounceMs);
    if (!this.hasDeadline) {
      this.hasDeadline = true;
      this.deadline = this.options.timers.setTimeout(() => this.flush(), this.maxWaitMs);
    }
  }

  /** Seek, track switch and clear invalidate old snapshots even when text repeats. */
  reset(): void {
    this.clearTimers();
    this.latest = null;
    this.submitted = '';
    this.version += 1;
  }

  private flush(): void {
    this.clearTimers();
    if (!this.latest?.text || this.latest.text === this.submitted || this.disposed) return;
    this.submitted = this.latest.text;
    this.options.onStable({ ...this.latest });
  }

  private clearTimers(): void {
    if (this.hasDebounce) this.options.timers.clearTimeout(this.debounce);
    if (this.hasDeadline) this.options.timers.clearTimeout(this.deadline);
    this.hasDebounce = false;
    this.hasDeadline = false;
  }

  dispose(): void {
    if (this.disposed) return;
    this.reset();
    this.disposed = true;
  }
}
