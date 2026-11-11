import { describe, expect, it, vi } from 'vitest';
import {
  createCue,
  DomTextStabilizer,
  parseYouTubeJson3,
  parseYouTubeJson3WithMapping,
  planSubtitleWindow,
  SUBTITLE_MAX_RESPONSE_CHARS,
  SubtitleSessionState,
  SubtitleTimeline,
  type CurrentTextSnapshot,
  type PlatformAdapter,
  type PlaybackState,
  type SubtitleTrack,
} from './index';

const cue = (id: string, startMs: number, endMs: number, text = id) => ({ id, startMs, endMs, text });
const track = (overrides: Partial<SubtitleTrack> = {}): SubtitleTrack => ({
  videoId: 'video-a',
  id: 'en-manual',
  language: 'en',
  kind: 'manual',
  contentVersion: 'v1',
  cues: [cue('first', 0, 1000), cue('second', 2000, 3000), cue('third', 4000, 6000)],
  ...overrides,
});
const playback = (overrides: Partial<PlaybackState> = {}): PlaybackState => ({
  timeMs: 0,
  paused: false,
  playbackRate: 1,
  ...overrides,
});

describe('portable subtitle timeline', () => {
  it('preserves overlapping speakers, gaps and end-exclusive boundaries', () => {
    const timeline = new SubtitleTimeline([
      cue('long', 0, 5000),
      cue('short', 1000, 2000),
      cue('third', 4000, 6000),
      cue('invalid', 8000, 7000),
      cue('empty', 7000, 8000, '  '),
    ]);
    expect(timeline.at(1500).map((item) => item.id)).toEqual(['long', 'short']);
    expect(timeline.at(2000).map((item) => item.id)).toEqual(['long']);
    expect(timeline.at(5000).map((item) => item.id)).toEqual(['third']);
    expect(timeline.at(6000)).toEqual([]);
    expect(timeline.at(500).map((item) => item.id)).toEqual(['long']);
  });

  it('plans bounded speed-adjusted windows and pauses scheduling during ads or seeks', () => {
    const timeline = new SubtitleTimeline(track().cues);
    expect(
      planSubtitleWindow(timeline, playback({ playbackRate: 2, paused: true }), { prefetchMs: 2000 }).upcoming.map(
        (item) => item.id
      )
    ).toEqual(['second', 'third']);
    expect(
      planSubtitleWindow(timeline, playback({ playbackRate: 2 }), {
        prefetchMs: 2000,
        maxPrefetchMs: 2500,
      }).upcoming.map((item) => item.id)
    ).toEqual(['second']);
    expect(planSubtitleWindow(timeline, playback({ adPlaying: true }), { prefetchMs: 5000 })).toEqual({
      current: [],
      upcoming: [],
    });
    expect(planSubtitleWindow(timeline, playback({ seeking: true }), { prefetchMs: 5000 })).toEqual({
      current: [],
      upcoming: [],
    });
    expect(timeline.window(0, 60_000, 2)).toHaveLength(2);
    expect(timeline.at(1500)).toEqual([]);
  });

  it('keeps context stable across seeks and window shapes without showing future text', () => {
    const timeline = new SubtitleTimeline(track().cues);
    const context = timeline.context('second');
    timeline.window(0, 6000);
    timeline.window(5000, 0);
    timeline.window(2000, 2000);
    expect(timeline.context('second')).toBe(context);
    expect(context).toBe('first\nsecond\nthird');
    expect(timeline.at(2000).map((item) => item.text)).toEqual(['second']);
    expect(timeline.context('second', 5)).toHaveLength(5);
  });

  it('validates and normalizes cue input', () => {
    expect(createCue(-1, 1, 'bad')).toBeNull();
    expect(createCue(0, Infinity, 'bad')).toBeNull();
    expect(createCue(0, 1, ' a\n b ')?.text).toBe('a b');
  });
});

describe('result ownership', () => {
  it('rejects changed cue timing and text even if the source reuses a track version', () => {
    const state = new SubtitleSessionState();
    state.replaceTrack(track());
    const token = state.token(state.timeline.cues[0])!;
    state.replaceTrack(track({ cues: [cue('first', 0, 1200, 'changed')] }));
    expect(state.acceptResult(token, 'old result')).toBe(false);
    expect(state.timeline.cues[0].text).toBe('changed');
  });
  it('rejects old session, track, video, timing and text versions', () => {
    const state = new SubtitleSessionState();
    state.replaceTrack(track());
    const first = state.timeline.cues[0];
    const token = state.token(first)!;
    expect(state.acceptResult(token, 'translated')).toBe(true);
    expect(state.translation(first)).toBe('translated');
    for (const changed of [
      { ...token, sessionVersion: token.sessionVersion - 1 },
      { ...token, videoId: 'other' },
      { ...token, trackVersion: 'old' },
      { ...token, trackId: 'other' },
      { ...token, contentVersion: 'changed' },
      { ...token, cueId: 'other' },
    ])
      expect(state.acceptResult(changed, 'stale')).toBe(false);
    state.replaceTrack(track({ contentVersion: 'v2', cues: [cue('first', 0, 1200, 'changed')] }));
    expect(state.acceptResult(token, 'late')).toBe(false);
    expect(state.translation(state.timeline.cues[0])).toBeUndefined();
    state.dispose();
    state.dispose();
    expect(state.token(first)).toBeNull();
    expect(state.acceptResult(token, 'late')).toBe(false);
  });

  it('hides ad/seek text, preserves completed results, and ignores ad track replacement', () => {
    const state = new SubtitleSessionState();
    state.replaceTrack(track());
    const first = state.timeline.cues[0];
    state.acceptResult(state.token(first)!, 'translated');
    state.updatePlayback(playback({ adPlaying: true, timeMs: 30_000 }));
    state.replaceTrack(track({ videoId: 'advertisement' }));
    expect(state.track?.videoId).toBe('video-a');
    expect(state.translation(first)).toBeUndefined();
    state.updatePlayback(playback({ seeking: true, timeMs: 5000 }));
    expect(state.translation(first)).toBeUndefined();
    state.updatePlayback(playback({ timeMs: 0 }));
    expect(state.translation(first)).toBe('translated');
    state.invalidate();
    expect(state.translation(first)).toBeUndefined();
  });

  it('can be driven by a mock non-YouTube platform without DOM objects', () => {
    let onPlayback = (_: PlaybackState) => {};
    const adapter: PlatformAdapter<string> = {
      id: 'mock-platform',
      capabilities: { timeline: true, currentText: false, trackSelection: false, adDetection: true, fullscreen: false },
      videoId: () => 'video-a',
      mount: () => 'mock-render-target',
      hideNativeCaptions: () => () => {},
      dispose: () => {},
      playback: {
        snapshot: () => playback(),
        subscribe: (listener) => {
          onPlayback = listener;
          return () => {};
        },
        dispose: () => {},
      },
      source: {
        subscribe: (listener) => {
          listener({ type: 'track', track: track(), sessionVersion: 1 });
          return () => {};
        },
        dispose: () => {},
      },
    };
    const state = new SubtitleSessionState();
    adapter.source.subscribe((event) => {
      if (event.type === 'track') state.replaceTrack(event.track);
    });
    adapter.playback.subscribe((event) => state.updatePlayback(event));
    onPlayback(playback({ timeMs: 2100 }));
    expect(state.timeline.at(state.playback.timeMs)[0].id).toBe('second');
    expect(adapter.mount()).toBe('mock-render-target');
  });
});

describe('DOM current-text stabilization', () => {
  function setup() {
    vi.useFakeTimers();
    const stable: CurrentTextSnapshot[] = [];
    const display: CurrentTextSnapshot[] = [];
    const stabilizer = new DomTextStabilizer({
      timers: {
        setTimeout: (callback, delay) => setTimeout(callback, delay),
        clearTimeout: (handle) => clearTimeout(handle as ReturnType<typeof setTimeout>),
      },
      debounceMs: 400,
      maxWaitMs: 1500,
      onDisplay: (snapshot) => display.push(snapshot),
      onStable: (snapshot) => stable.push(snapshot),
    });
    return { stabilizer, stable, display };
  }

  it('updates original immediately and submits latest prefix only after stability', () => {
    const { stabilizer, stable, display } = setup();
    stabilizer.update('hello', 1);
    vi.advanceTimersByTime(200);
    stabilizer.update('hello world', 1);
    vi.advanceTimersByTime(399);
    expect(stable).toEqual([]);
    expect(display.map((item) => item.text)).toEqual(['hello', 'hello world']);
    vi.advanceTimersByTime(1);
    expect(stable.map((item) => item.text)).toEqual(['hello world']);
    stabilizer.update('hello   world', 1);
    vi.advanceTimersByTime(2000);
    expect(stable).toHaveLength(1);
    stabilizer.dispose();
    vi.useRealTimers();
  });

  it('does not postpone continuously growing speech beyond max wait', () => {
    const { stabilizer, stable } = setup();
    let text = 'word';
    stabilizer.update(text, 1);
    for (let index = 0; index < 5; index += 1) {
      vi.advanceTimersByTime(250);
      text += ' word';
      stabilizer.update(text, 1);
    }
    vi.advanceTimersByTime(250);
    expect(stable).toHaveLength(1);
    expect(stable[0].text).toBe(text);
    expect(stable[0].contentVersion).toBe(6);
    stabilizer.dispose();
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });

  it('invalidates clear, new sentence, session change and seek reset immediately', () => {
    const { stabilizer, stable, display } = setup();
    stabilizer.update('old', 1);
    stabilizer.update('', 1);
    vi.advanceTimersByTime(2000);
    expect(stable).toEqual([]);
    expect(display.at(-1)?.text).toBe('');
    stabilizer.update('new', 1);
    stabilizer.update('changed', 2);
    vi.advanceTimersByTime(400);
    expect(stable[0]).toMatchObject({ text: 'changed', sessionVersion: 2 });
    stabilizer.update('pending', 2);
    stabilizer.reset();
    vi.advanceTimersByTime(2000);
    expect(stable).toHaveLength(1);
    stabilizer.dispose();
    stabilizer.update('disposed', 3);
    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });
});

describe('JSON3 timed parsing', () => {
  it('preserves unrelated overlapping events when no window identity is supplied', () => {
    const cues = parseYouTubeJson3({
      events: [
        { tStartMs: 0, dDurationMs: 3000, segs: [{ utf8: 'speaker one' }] },
        { tStartMs: 1000, dDurationMs: 1000, segs: [{ utf8: 'speaker two' }] },
      ],
    });
    expect(new SubtitleTimeline(cues).at(1500).map((cue) => cue.text)).toEqual(['speaker one', 'speaker two']);
  });
  it('preserves gaps, overlapping windows and filters invalid input', () => {
    const cues = parseYouTubeJson3({
      events: [
        { tStartMs: 0, dDurationMs: 2000, wWinId: 1, segs: [{ utf8: 'first' }] },
        { tStartMs: 1000, dDurationMs: 2000, wWinId: 2, segs: [{ utf8: 'speaker two' }] },
        { tStartMs: 4000, dDurationMs: 500, segs: [{ utf8: 'later' }] },
        { tStartMs: -1, dDurationMs: 1000, segs: [{ utf8: 'invalid' }] },
        { tStartMs: 6000, dDurationMs: 0, segs: [{ utf8: 'invalid' }] },
        { tStartMs: 6000, dDurationMs: 1000, segs: [{ utf8: '\n ' }] },
      ],
    });
    const timeline = new SubtitleTimeline(cues);
    expect(timeline.at(1500).map((item) => item.text)).toEqual(['first', 'speaker two']);
    expect(timeline.at(3500)).toEqual([]);
    expect(cues).toHaveLength(3);
  });

  it('keeps progressive word timing and append snapshots without future text', () => {
    const cues = parseYouTubeJson3({
      events: [
        { tStartMs: 0, dDurationMs: 3000, wWinId: 1, segs: [{ utf8: 'hello' }, { utf8: ' world', tOffsetMs: 500 }] },
        { tStartMs: 1000, dDurationMs: 2000, wWinId: 1, aAppend: 1, segs: [{ utf8: ' again' }] },
      ],
    });
    const timeline = new SubtitleTimeline(cues);
    expect(timeline.at(0).map((item) => item.text)).toEqual(['hello']);
    expect(timeline.at(700).map((item) => item.text)).toEqual(['hello world']);
    expect(timeline.at(1200).map((item) => item.text)).toEqual(['hello world again']);
    expect(timeline.at(3000)).toEqual([]);
  });

  it('coalesces contiguous rolling duplicates and retains original-event mapping', () => {
    const result = parseYouTubeJson3WithMapping({
      events: [
        { tStartMs: 0, dDurationMs: 2000, segs: [{ utf8: 'one two' }] },
        { tStartMs: 500, dDurationMs: 1500, segs: [{ utf8: 'one two' }] },
        { tStartMs: 1000, dDurationMs: 1000, aAppend: 1, segs: [{ utf8: 'two three' }] },
      ],
    });
    expect(result.cues.map((item) => [item.startMs, item.endMs, item.text])).toEqual([
      [0, 1000, 'one two'],
      [1000, 2000, 'one two three'],
    ]);
    expect(result.originalEvents[result.cues[0].id]).toEqual([0, 1]);
  });

  it('keeps same-start replacements distinct by content and rejects oversized input', () => {
    const first = parseYouTubeJson3({ events: [{ tStartMs: 0, dDurationMs: 1000, segs: [{ utf8: 'first' }] }] });
    const second = parseYouTubeJson3({ events: [{ tStartMs: 0, dDurationMs: 2000, segs: [{ utf8: 'changed' }] }] });
    expect(first[0].id).not.toBe(second[0].id);
    expect(() => parseYouTubeJson3('bad json')).toThrow('invalid-format');
    expect(() => parseYouTubeJson3(' '.repeat(SUBTITLE_MAX_RESPONSE_CHARS + 1))).toThrow('response-too-large');
    expect(parseYouTubeJson3({ events: [] })).toEqual([]);
  });
});
