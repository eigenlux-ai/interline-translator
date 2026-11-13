import type { PlaybackState } from './types';

/** Measure missed display time, not request latency. Ignore stalls and clock jumps. */
export class SubtitleLagMonitor {
  private previous: { now: number; time: number; missing: boolean; eligible: boolean } | null = null;
  private samples: { at: number; duration: number; missing: boolean }[] = [];
  private quietUntil = 0;

  reset() {
    this.previous = null;
    this.samples = [];
    this.quietUntil = 0;
  }

  dismiss(now: number) {
    this.reset();
    this.quietUntil = now + 60_000;
  }

  observe(now: number, playback: PlaybackState, eligible: boolean, missing: boolean): boolean {
    const previous = this.previous;
    const next = { now, time: playback.timeMs, eligible, missing };
    if (playback.paused || playback.seeking || playback.adPlaying) {
      this.samples = [];
      this.previous = null;
      return false;
    }
    if (previous) {
      const elapsed = now - previous.now;
      const advanced = playback.timeMs - previous.time;
      if (elapsed > 2000 || advanced < 0 || advanced > elapsed * playback.playbackRate + 1500) {
        this.samples = [];
        this.previous = next;
      } else if (elapsed >= 250 && advanced > 0) {
        if (previous.eligible && eligible) {
          this.samples.push({
            at: now,
            duration: Math.min(elapsed, advanced / Math.max(0.25, playback.playbackRate)),
            missing: previous.missing,
          });
        }
        this.previous = next;
      }
    } else this.previous = next;
    this.samples = this.samples.filter((sample) => sample.at > now - 12_000);
    const total = this.samples.reduce((sum, sample) => sum + sample.duration, 0);
    const missed = this.samples.reduce((sum, sample) => sum + (sample.missing ? sample.duration : 0), 0);
    return eligible && now >= this.quietUntil && total >= 6000 && missed >= 4000 && missed / total >= 0.5;
  }
}
