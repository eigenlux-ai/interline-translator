/** Narrow page bridge protocol. Page data is untrusted; extension capabilities never cross this boundary. */
import { SUBTITLE_MAX_RESPONSE_BYTES } from '@/core/subtitles/limits';
import { PROJECT_PREFIX } from '@/constants';

export const BRIDGE_REQUEST = `${PROJECT_PREFIX}:youtube-subtitles:request`;
export const BRIDGE_RESPONSE = `${PROJECT_PREFIX}:youtube-subtitles:response`;
export const BRIDGE_VERSION = 1;
export const MAX_SUBTITLE_BYTES = SUBTITLE_MAX_RESPONSE_BYTES;
export const MAX_TIMEDTEXT_URL_CHARS = 8192;
export interface YoutubeTrackInfo {
  id: string;
  language: string;
  kind: 'manual' | 'auto';
}
export interface YoutubeSnapshot {
  /** Language displayed by native captions, independent of the original track. */
  domLanguage?: string;
  videoId: string;
  title: string;
  ad: boolean;
  track: YoutubeTrackInfo | null;
  hasTracks: boolean;
}
export type YoutubeBridgeRequest = {
  type: typeof BRIDGE_REQUEST;
  version: 1;
  requestId: string;
  videoId?: string;
} & ({ action: 'stop' } | { action: 'read'; enableCaptions: boolean; knownTrackId?: string; resetRetry?: boolean });
export type YoutubeBridgeResponse = {
  type: typeof BRIDGE_RESPONSE;
  version: 1;
  requestId: string;
  snapshot: YoutubeSnapshot;
  text?: string;
  error?: 'fetch' | 'rateLimit' | 'unavailable';
};

function object(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
function boundedString(value: unknown, length: number, empty = false): value is string {
  return typeof value === 'string' && (empty || value.length > 0) && value.length <= length;
}
function validVideoId(value: unknown): value is string {
  return typeof value === 'string' && /^[\w-]{6,64}$/u.test(value);
}
function youtubeHost(url: URL): boolean {
  return (
    url.protocol === 'https:' &&
    !url.username &&
    !url.password &&
    (!url.port || url.port === '443') &&
    /(^|\.)youtube\.com$/u.test(url.hostname)
  );
}
export function youtubeVideoId(url: string): string | null {
  if (typeof url !== 'string' || url.length > MAX_TIMEDTEXT_URL_CHARS) return null;
  try {
    const parsed = new URL(url);
    if (!youtubeHost(parsed) || parsed.pathname !== '/watch') return null;
    const id = parsed.searchParams.get('v');
    return validVideoId(id) ? id : null;
  } catch {
    return null;
  }
}
export function safeTimedTextUrl(value: string, videoId: string): URL | null {
  if (!boundedString(value, MAX_TIMEDTEXT_URL_CHARS) || !validVideoId(videoId)) return null;
  try {
    const url = new URL(value);
    return youtubeHost(url) && url.pathname === '/api/timedtext' && url.searchParams.get('v') === videoId ? url : null;
  } catch {
    return null;
  }
}
export function validBridgeRequest(value: unknown): value is YoutubeBridgeRequest {
  const x = object(value);
  if (!x || x.type !== BRIDGE_REQUEST || x.version !== BRIDGE_VERSION || !boundedString(x.requestId, 100)) return false;
  if (x.videoId !== undefined && !validVideoId(x.videoId)) return false;
  return (
    x.action === 'stop' ||
    (x.action === 'read' &&
      typeof x.enableCaptions === 'boolean' &&
      (x.knownTrackId === undefined || boundedString(x.knownTrackId, 300, true)) &&
      (x.resetRetry === undefined || typeof x.resetRetry === 'boolean'))
  );
}
export function validBridgeResponse(value: unknown): value is YoutubeBridgeResponse {
  const x = object(value);
  if (!x || x.type !== BRIDGE_RESPONSE || x.version !== BRIDGE_VERSION || !boundedString(x.requestId, 100))
    return false;
  const snapshot = object(x.snapshot);
  if (
    !snapshot ||
    !validVideoId(snapshot.videoId) ||
    !boundedString(snapshot.title, 1000, true) ||
    typeof snapshot.ad !== 'boolean' ||
    typeof snapshot.hasTracks !== 'boolean' ||
    (snapshot.domLanguage !== undefined && !boundedString(snapshot.domLanguage, 50))
  )
    return false;
  const track = object(snapshot.track);
  if (
    snapshot.track !== null &&
    (!track ||
      !boundedString(track.id, 300) ||
      !boundedString(track.language, 50) ||
      (track.kind !== 'manual' && track.kind !== 'auto'))
  )
    return false;
  if (snapshot.track !== null && !snapshot.hasTracks) return false;
  return (
    (x.text === undefined ||
      (boundedString(x.text, MAX_SUBTITLE_BYTES, true) &&
        new TextEncoder().encode(x.text).byteLength <= MAX_SUBTITLE_BYTES)) &&
    (x.error === undefined || x.error === 'fetch' || x.error === 'rateLimit' || x.error === 'unavailable')
  );
}
