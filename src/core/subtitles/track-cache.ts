import { SUBTITLE_MAX_CUES } from './json3';
import { SUBTITLE_MAX_RESPONSE_BYTES } from './limits';

// Enough for both maximum-sized active source and human target tracks.
export const TRACK_CACHE_MAX_BYTES = 2 * SUBTITLE_MAX_RESPONSE_BYTES;
export const TRACK_CACHE_MAX_CUES = 2 * SUBTITLE_MAX_CUES;
export const TRACK_CACHE_MAX_ENTRIES = 3;

/** Raw bodies only: parsed cue objects must not be retained in a second cache. */
export class SubtitleTrackCache {
  private entries = new Map<string, { text: string; bytes: number; cues: number }>();
  private bytes = 0;
  private cues = 0;
  constructor(
    private readonly protectedKeys: () => ReadonlySet<string> = () => new Set(),
    private readonly onEvict: (key: string) => void = () => {}
  ) {}
  peek(key: string): string | undefined {
    return this.entries.get(key)?.text;
  }
  get(key: string): string | undefined {
    const entry = this.entries.get(key);
    if (entry) {
      this.entries.delete(key);
      this.entries.set(key, entry);
    }
    return entry?.text;
  }
  /** Weights are measured by the parser/capture owner, once per changed body. */
  set(key: string, text: string, bytes: number, cues: number): boolean {
    if (
      !Number.isSafeInteger(bytes) ||
      bytes < 1 ||
      bytes > SUBTITLE_MAX_RESPONSE_BYTES ||
      !Number.isSafeInteger(cues) ||
      cues < 1 ||
      cues > TRACK_CACHE_MAX_CUES
    )
      return false;
    const previous = this.entries.get(key);
    let totalBytes = this.bytes - (previous?.bytes ?? 0) + bytes;
    let totalCues = this.cues - (previous?.cues ?? 0) + cues;
    let size = this.entries.size + (previous ? 0 : 1);
    const protectedKeys = this.protectedKeys();
    const evictions: string[] = [];
    const fits = () =>
      totalBytes <= TRACK_CACHE_MAX_BYTES && totalCues <= TRACK_CACHE_MAX_CUES && size <= TRACK_CACHE_MAX_ENTRIES;
    for (const [candidate, entry] of this.entries) {
      if (fits()) break;
      if (candidate === key || protectedKeys.has(candidate)) continue;
      evictions.push(candidate);
      totalBytes -= entry.bytes;
      totalCues -= entry.cues;
      size--;
    }
    // An unrelated passive capture cannot displace either active track.
    if (!fits()) return false;
    for (const candidate of evictions) this.delete(candidate);
    if (previous) {
      this.bytes -= previous.bytes;
      this.cues -= previous.cues;
      this.entries.delete(key);
    }
    this.entries.set(key, { text, bytes, cues });
    this.bytes += bytes;
    this.cues += cues;
    return true;
  }
  discard(key: string) {
    this.delete(key);
  }
  private delete(key: string) {
    const entry = this.entries.get(key);
    if (!entry) return;
    this.entries.delete(key);
    this.bytes -= entry.bytes;
    this.cues -= entry.cues;
    this.onEvict(key);
  }
  clear() {
    for (const key of this.entries.keys()) this.delete(key);
  }
  snapshot() {
    return { entries: this.entries.size, bytes: this.bytes, cues: this.cues };
  }
}
