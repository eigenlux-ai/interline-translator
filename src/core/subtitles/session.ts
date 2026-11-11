import { cueContentVersion } from './text';
import { SubtitleTimeline } from './timeline';
import type { PlaybackState, SubtitleCue, SubtitleIdentity, SubtitleTrack } from './types';

/** Pure result ownership. The runtime owns subscriptions, rendering and cancellation. */
export class SubtitleSessionState {
  sessionVersion = 0;
  track: SubtitleTrack | null = null;
  timeline = new SubtitleTimeline([]);
  playback: PlaybackState = { timeMs: 0, paused: true, playbackRate: 1 };
  private disposed = false;
  private readonly results = new Map<string, { version: string; text: string }>();
  private readonly byId = new Map<string, SubtitleCue>();

  replaceTrack(track: SubtitleTrack): void {
    if (this.disposed || this.playback.adPlaying) return;
    const timeline = new SubtitleTimeline(track.cues);
    if (
      this.track?.videoId === track.videoId &&
      this.track.id === track.id &&
      this.track.contentVersion === track.contentVersion &&
      this.timeline.cues.length === timeline.cues.length &&
      this.timeline.cues.every(
        (cue, index) =>
          cue.id === timeline.cues[index].id && cueContentVersion(cue) === cueContentVersion(timeline.cues[index])
      )
    )
      return;
    this.invalidate();
    this.track = { ...track, cues: timeline.cues };
    this.timeline = timeline;
    this.byId.clear();
    this.timeline.cues.forEach((cue) => this.byId.set(cue.id, cue));
  }

  updatePlayback(playback: PlaybackState): void {
    if (!this.disposed) this.playback = { ...playback };
  }

  invalidate(): void {
    this.sessionVersion += 1;
    this.results.clear();
  }

  token(cue: SubtitleCue): SubtitleIdentity | null {
    const track = this.track;
    if (this.disposed || !track || !this.byId.has(cue.id)) return null;
    const actual = this.byId.get(cue.id)!;
    if (cueContentVersion(cue) !== cueContentVersion(actual)) return null;
    return {
      sessionVersion: this.sessionVersion,
      videoId: track.videoId,
      trackId: track.id,
      trackVersion: track.contentVersion,
      cueId: cue.id,
      contentVersion: cueContentVersion(cue),
    };
  }

  accepts(identity: SubtitleIdentity): boolean {
    const track = this.track;
    const cue = this.byId.get(identity.cueId);
    return (
      !this.disposed &&
      !!track &&
      !!cue &&
      identity.sessionVersion === this.sessionVersion &&
      identity.videoId === track.videoId &&
      identity.trackId === track.id &&
      identity.trackVersion === track.contentVersion &&
      identity.contentVersion === cueContentVersion(cue)
    );
  }

  acceptResult(identity: SubtitleIdentity, text: string): boolean {
    if (!this.accepts(identity) || !text.trim()) return false;
    this.results.set(identity.cueId, { version: identity.contentVersion, text: text.trim() });
    return true;
  }

  translation(cue: SubtitleCue): string | undefined {
    if (this.disposed || this.playback.adPlaying || this.playback.seeking) return undefined;
    const result = this.results.get(cue.id);
    return result?.version === cueContentVersion(cue) ? result.text : undefined;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.invalidate();
    this.track = null;
    this.timeline = new SubtitleTimeline([]);
    this.byId.clear();
  }
}
