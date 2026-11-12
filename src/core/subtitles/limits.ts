/** Full JSON3 tracks include word timings and can exceed 2 MB on multi-hour videos.
 * Keep a finite shared budget across capture, bridge validation and parsing.
 */
export const SUBTITLE_MAX_RESPONSE_BYTES = 8_000_000;
export const SUBTITLE_MAX_RESPONSE_CHARS = SUBTITLE_MAX_RESPONSE_BYTES;
