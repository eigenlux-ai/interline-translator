import {
  createCue,
  parseYouTubeJson3,
  SUBTITLE_MAX_CUES,
  SUBTITLE_MAX_RESPONSE_CHARS,
  SubtitleParseError,
  type SubtitleCue,
} from '@/core/subtitles';

/** XML decoding belongs at the browser boundary, never in the portable subtitle core. */
export function parseYouTubeTimedText(input: string): SubtitleCue[] {
  if (input.length > SUBTITLE_MAX_RESPONSE_CHARS) throw new SubtitleParseError('response-too-large');
  if (!input.trim()) return [];
  if (input.trimStart().startsWith('{')) return parseYouTubeJson3(input);
  // Do not permit an XML document to request external resources or expand entities.
  if (/<!DOCTYPE|<!ENTITY/iu.test(input)) throw new SubtitleParseError('invalid-format');
  const doc = new DOMParser().parseFromString(input, 'text/xml');
  if (doc.querySelector('parsererror')) throw new SubtitleParseError('invalid-format');
  const transcript = doc.documentElement;
  if (!transcript || !['transcript', 'timedtext'].includes(transcript.tagName))
    throw new SubtitleParseError('invalid-format');
  const nodes = Array.from(doc.querySelectorAll('text, body > p'));
  if (nodes.length > SUBTITLE_MAX_CUES) throw new SubtitleParseError('response-too-large');
  const cues: SubtitleCue[] = [];
  const progressive: {
    tStartMs: number;
    dDurationMs: number;
    wWinId: string;
    aAppend: number;
    segs: { utf8: string; tOffsetMs: number }[];
  }[] = [];
  for (const [index, node] of nodes.entries()) {
    const isSeconds = node.tagName === 'text';
    const start = node.getAttribute(isSeconds ? 'start' : 't');
    const duration = node.getAttribute(isSeconds ? 'dur' : 'd');
    if (start === null || duration === null || !/^\d+(?:\.\d+)?$/u.test(start) || !/^\d+(?:\.\d+)?$/u.test(duration))
      continue;
    const scale = isSeconds ? 1000 : 1;
    const startMs = Number(start) * scale;
    const durationMs = Number(duration) * scale;
    if (!isSeconds && node.querySelector('s[t]')) {
      progressive.push({
        tStartMs: startMs,
        dDurationMs: durationMs,
        wWinId: node.getAttribute('w') ?? `xml:${index}`,
        aAppend: node.getAttribute('a') === '1' ? 1 : 0,
        segs: Array.from(node.childNodes).map((child) => ({
          utf8: child.textContent ?? '',
          tOffsetMs: child.nodeType === 1 ? Number((child as Element).getAttribute('t') ?? '0') : 0,
        })),
      });
      continue;
    }
    // XML textContent decodes entities and excludes formatting tags without executing markup.
    const copy = node.cloneNode(true) as Element;
    copy.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
    const cue = createCue(startMs, startMs + durationMs, copy.textContent ?? '');
    if (cue) cues.push(cue);
  }
  cues.push(...parseYouTubeJson3({ events: progressive }));
  return cues.sort((a, b) => a.startMs - b.startMs || a.endMs - b.endMs);
}
