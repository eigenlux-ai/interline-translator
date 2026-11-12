import type { VideoSubtitleView } from './runtime';

type SafariVideo = HTMLVideoElement & {
  webkitPresentationMode?: string;
  webkitDisplayingFullscreen?: boolean;
};

/** A removable, single-cue output for Safari's system video fullscreen. */
export function createNativeSubtitleRenderer(video: SafariVideo) {
  let view: VideoSubtitleView | undefined;
  let element: HTMLTrackElement | undefined;
  let fullscreen = video.webkitPresentationMode === 'fullscreen' || !!video.webkitDisplayingFullscreen;
  let disposed = false;
  const previous = new Map<TextTrack, TextTrackMode>();
  const clear = () => {
    if (element) {
      const track = element.track;
      for (const cue of Array.from(track.cues ?? [])) track.removeCue(cue);
      track.mode = 'disabled';
      element.remove();
      element = undefined;
    }
    for (const [track, mode] of previous) {
      // Respect changes made by the user/player after taking custody.
      if (track.mode === 'hidden') track.mode = mode;
    }
    previous.clear();
  };
  const sync = () => {
    if (disposed) return;
    const appearance = view?.settings.config.appearance;
    const original = appearance?.displayMode !== 'translation' || !view?.translation ? view?.original : '';
    const translation = appearance?.displayMode !== 'original' ? view?.translation : '';
    const lines = appearance?.translationPosition === 'above' ? [translation, original] : [original, translation];
    const text = lines.filter(Boolean).join('\n');
    const Cue = (video.ownerDocument.defaultView as (Window & typeof globalThis) | null)?.VTTCue;
    if (!fullscreen || !view?.enabled || !text || video.seeking || !Number.isFinite(video.currentTime) || !Cue) {
      clear();
      return;
    }
    try {
      if (!element) {
        element = video.ownerDocument.createElement('track');
        element.kind = 'subtitles';
        element.label = 'Interline';
        video.append(element);
      }
      const track = element.track;
      for (const native of Array.from(video.textTracks)) {
        if (native !== track && native.mode === 'showing') {
          if (!previous.has(native)) previous.set(native, native.mode);
          native.mode = 'hidden';
        }
      }
      track.mode = 'showing';
      const time = video.currentTime;
      const cue = track.cues?.[0];
      // Short rolling intervals are output-only: they never become source data.
      if (cue && (cue as VTTCue).text === escapeCueText(text) && cue.startTime <= time && cue.endTime > time + 0.5)
        return;
      for (const old of Array.from(track.cues ?? [])) track.removeCue(old);
      track.addCue(new Cue(Math.max(0, time - 0.05), time + 1, escapeCueText(text)));
    } catch {
      // Unsupported native output must leave original captions usable.
      clear();
    }
  };
  const begin = () => {
    fullscreen = true;
    sync();
  };
  const end = () => {
    fullscreen = false;
    clear();
  };
  const presentation = () => {
    fullscreen = video.webkitPresentationMode === 'fullscreen';
    sync();
  };
  const reset = () => {
    view = undefined;
    clear();
  };
  const listeners: [string, () => void][] = [
    ['webkitbeginfullscreen', begin],
    ['webkitendfullscreen', end],
    ['webkitpresentationmodechanged', presentation],
    ['seeking', reset],
    ['emptied', reset],
    ['loadedmetadata', reset],
    ['timeupdate', sync],
  ];
  listeners.forEach(([name, listener]) => video.addEventListener(name, listener));
  return {
    render(next: VideoSubtitleView) {
      view = next;
      sync();
    },
    dispose() {
      disposed = true;
      listeners.forEach(([name, listener]) => video.removeEventListener(name, listener));
      clear();
      view = undefined;
    },
  };
}

function escapeCueText(text: string) {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
