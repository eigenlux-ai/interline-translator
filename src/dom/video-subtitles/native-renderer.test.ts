// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultVideoSubtitles } from '../../services/config/video-subtitles';
import { createNativeSubtitleRenderer } from './native-renderer';
import type { VideoSubtitleView } from './runtime';

function fixture() {
  const video = document.createElement('video');
  const native = { mode: 'showing' } as TextTrack;
  const tracks = [native];
  Object.defineProperty(video, 'textTracks', { get: () => tracks });
  const create = document.createElement.bind(document);
  vi.spyOn(document, 'createElement').mockImplementation(((tag: string) => {
    const element = create(tag);
    if (tag === 'track') {
      const cues: VTTCue[] = [];
      const track = {
        mode: 'disabled',
        cues,
        addCue: (cue: VTTCue) => cues.push(cue),
        removeCue: (cue: VTTCue) => cues.splice(cues.indexOf(cue), 1),
      } as unknown as TextTrack;
      Object.defineProperty(element, 'track', { value: track });
      const remove = element.remove.bind(element);
      element.remove = () => {
        tracks.splice(tracks.indexOf(track), 1);
        remove();
      };
      tracks.push(track);
    }
    return element;
  }) as typeof document.createElement);
  vi.stubGlobal(
    'VTTCue',
    class {
      constructor(
        public startTime: number,
        public endTime: number,
        public text: string
      ) {}
    }
  );
  const view: VideoSubtitleView = {
    enabled: true,
    original: '<Hello>',
    translation: '你好',
    status: 'ready',
    sourceLanguage: 'en',
    settings: {
      config: defaultVideoSubtitles(),
      allowed: true,
      targetLanguage: 'zh-CN',
      providerKind: 'mt',
      providers: [],
    },
  };
  const output = createNativeSubtitleRenderer(video);
  const emit = (name: string) => video.dispatchEvent(new Event(name));
  return { video, native, tracks, view, output, emit };
}
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('Safari system fullscreen subtitles', () => {
  it('uses no native track inline and restores native modes on repeated fullscreen exits', () => {
    const f = fixture();
    f.output.render(f.view);
    expect(f.tracks).toHaveLength(1);
    for (let i = 0; i < 3; i++) {
      f.emit('webkitbeginfullscreen');
      expect(f.tracks).toHaveLength(2);
      expect(f.native.mode).toBe('hidden');
      expect((f.tracks[1].cues![0] as VTTCue).text).toBe('&lt;Hello&gt;\n你好');
      f.emit('webkitendfullscreen');
      expect(f.tracks).toHaveLength(1);
      expect(f.native.mode).toBe('showing');
    }
    f.output.dispose();
    f.emit('webkitbeginfullscreen');
    expect(f.tracks).toHaveLength(1);
  });
  it('bounds cues, clears on seek and resets, and never replays a stale view from timeupdate', () => {
    const f = fixture();
    f.output.render(f.view);
    f.emit('webkitbeginfullscreen');
    for (let time = 0; time < 100; time++) {
      f.video.currentTime = time;
      f.output.render({ ...f.view, translation: String(time) });
      expect(f.tracks[1].cues).toHaveLength(1);
      expect(f.tracks[1].cues![0].endTime).toBe(time + 1);
    }
    for (const event of ['seeking', 'emptied', 'loadedmetadata']) {
      f.emit(event);
      f.emit('timeupdate');
      expect(f.tracks).toHaveLength(1);
      f.output.render(f.view);
      expect(f.tracks).toHaveLength(2);
    }
    f.output.dispose();
  });
  it('honors display mode, ordering, gaps, disabling and user changes to native selection', () => {
    const f = fixture();
    f.emit('webkitbeginfullscreen');
    f.view.settings.config.appearance.translationPosition = 'above';
    f.output.render(f.view);
    expect((f.tracks[1].cues![0] as VTTCue).text).toBe('你好\n&lt;Hello&gt;');
    f.view.settings.config.appearance.displayMode = 'translation';
    f.output.render(f.view);
    expect((f.tracks[1].cues![0] as VTTCue).text).toBe('你好');
    f.native.mode = 'disabled';
    f.output.render({ ...f.view, enabled: false });
    expect(f.native.mode).toBe('disabled');
    expect(f.tracks).toHaveLength(1);
    f.output.render({ ...f.view, original: '', translation: '' });
    expect(f.tracks).toHaveLength(1);
    f.output.dispose();
  });
  it('handles presentation-mode transitions and missing native cue support', () => {
    const f = fixture();
    Object.defineProperty(f.video, 'webkitPresentationMode', { configurable: true, value: 'fullscreen' });
    f.output.render(f.view);
    f.emit('webkitpresentationmodechanged');
    expect(f.tracks).toHaveLength(2);
    Object.defineProperty(f.video, 'webkitPresentationMode', { value: 'picture-in-picture' });
    f.emit('webkitpresentationmodechanged');
    expect(f.tracks).toHaveLength(1);
    vi.stubGlobal('VTTCue', undefined);
    f.emit('webkitbeginfullscreen');
    expect(f.tracks).toHaveLength(1);
    expect(f.native.mode).toBe('showing');
    f.output.dispose();
  });
});
