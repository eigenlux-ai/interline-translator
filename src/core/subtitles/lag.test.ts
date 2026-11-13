import { describe, expect, it } from 'vitest';
import { SubtitleLagMonitor } from './lag';

describe('subtitle display lag', () => {
  it('detects sustained missed display time, recovers, and respects dismissal', () => {
    const monitor = new SubtitleLagMonitor();
    const observe = (time: number, missing = true) =>
      monitor.observe(time, { timeMs: time, paused: false, playbackRate: 1 }, true, missing);
    for (let time = 0; time < 6000; time += 500) expect(observe(time)).toBe(false);
    expect(observe(6000)).toBe(true);
    expect(monitor.observe(6000, { timeMs: 6000, paused: false, playbackRate: 1 }, false, true)).toBe(false);
    for (let time = 6500; time <= 20000; time += 500) observe(time, false);
    expect(observe(20500, false)).toBe(false);
    monitor.dismiss(20500);
    for (let time = 21000; time <= 80000; time += 500) expect(observe(time)).toBe(false);
    expect(observe(80500)).toBe(true);
  });

  it('does not blame translation for pauses, ads, seeking, video stalls, gaps or background timers', () => {
    for (const state of [{ paused: true }, { adPlaying: true }, { seeking: true }, { timeMs: 0 }]) {
      const monitor = new SubtitleLagMonitor();
      for (let time = 0; time <= 20000; time += 500) {
        expect(monitor.observe(time, { timeMs: time, paused: false, playbackRate: 1, ...state }, true, true)).toBe(
          false
        );
      }
    }
    const monitor = new SubtitleLagMonitor();
    for (let time = 0; time <= 20000; time += 500) {
      expect(monitor.observe(time, { timeMs: time, paused: false, playbackRate: 1 }, false, true)).toBe(false);
    }
    monitor.reset();
    monitor.observe(0, { timeMs: 0, paused: false, playbackRate: 1 }, true, true);
    expect(monitor.observe(10000, { timeMs: 10000, paused: false, playbackRate: 1 }, true, true)).toBe(false);
    expect(monitor.observe(10500, { timeMs: 50000, paused: false, playbackRate: 1 }, true, true)).toBe(false);
  });
});
