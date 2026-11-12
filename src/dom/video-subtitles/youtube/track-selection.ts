/** Resolve only valid indices; caption indices can be absolute or audio-local. */
export interface AudioTrack {
  id?: string;
  audioTrackId?: string;
  captionTrackIndices?: number[];
  defaultCaptionTrackIndex?: number;
}
export function audioCaptionIndex(audio: AudioTrack | undefined, count: number): number | undefined {
  const index = audio?.defaultCaptionTrackIndex;
  if (!Number.isInteger(index) || index! < 0) return;
  const indices = audio?.captionTrackIndices;
  const resolved = Array.isArray(indices) && !indices.includes(index!) ? indices[index!] : index;
  return Number.isInteger(resolved) && resolved! >= 0 && resolved! < count ? resolved : undefined;
}
