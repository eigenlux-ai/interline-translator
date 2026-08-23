/**
 * @module services/translation/batch/protocol
 *
 * Wire protocol for BATCH LLM translation that streams progressively, one
 * segment at a time, onto the page.
 *
 * Why a salted sentinel instead of JSON: the payload is just an ordered list of
 * translations, and translation text is hostile to JSON escaping (quotes,
 * backslashes, raw newlines — which LLMs frequently get wrong). A marker format
 * needs no escaping, is trivially parsed incrementally (no partial-JSON
 * parser), maps by explicit index (drop/reorder robust), and streams char by
 * char — all of which the JSON approach taken by comparable extensions gives up.
 *
 * Format — each segment is introduced by `[[SALT#N]]` (N is 1-based), and its
 * translation runs until the next marker (or end of stream):
 *
 *   [[a1b2c3#1]]translated one
 *   [[a1b2c3#2]]translated two
 *
 * SALT is 6 random hex chars per request, so the marker can't collide with page
 * content (even a page literally discussing `[[...]]` wiki syntax) and the model
 * is nudged to echo it verbatim rather than "fix" the format. `{{n}}` inline
 * placeholders pass through untouched (distinct from our `[[salt#n]]`).
 *
 * Pure logic — no ai-sdk, no DOM — so the incremental parser is unit-tested
 * against arbitrarily-split chunk streams.
 */

import type { LangCode, PromptConfig, PromptStyle, SourceLang, TranslateContext } from '@/data/models';
import { NL_TOKEN_LENIENT_RE } from './nl-token';
import {
  buildReference,
  fillTemplate,
  isValidBatchSystemTemplate,
  languageName,
  styleBlock,
  templateValues,
} from '../prompts';

/** A streamed parser event: text appended to (or completion of) one segment. */
export interface SegEvent {
  /** 1-based segment index. */
  index: number;
  /** Text to append to this segment (may be ''). */
  delta: string;
  /** True when this segment is finished (no more deltas will follow for it). */
  done: boolean;
}

/** The ~n rule is PROTOCOL, not style: items are encoded with the token
 *  unconditionally, so every system prompt — including a user's expert batch
 *  template, which takes over everything else — must carry this line. */
const NL_TOKEN_RULE =
  'The token [[{salt}~n]] inside a segment represents a paragraph break. Keep each [[{salt}~n]] token in the translation at the corresponding position, unchanged. It never ends the segment — translate ALL text after it.';

const BATCH_SYSTEM = [
  'You are an expert translator embedded in a browser.',
  'Translate each marked segment into natural, idiomatic {target} — the way a fluent native speaker would actually write it today, not a word-for-word gloss.',
  'The input is a list of segments, each introduced by a marker of the form [[{salt}#N]] where N is the segment number.',
  'Output the translation of EVERY segment, each introduced by its EXACT marker [[{salt}#N]], in the same order and with the same N.',
  NL_TOKEN_RULE,
  'Rules:',
  '- Output ONLY markers followed by translations — no explanations, notes, headings, or quotes.',
  '- Emit exactly one marker per segment; never merge, split, drop, or reorder segments.',
  "- Match each segment's register and tone; keep casual casual and formal formal, never inflating a plain phrase into a stiff textbook equivalent. Preserve meaning precisely and keep {{n}} placeholders, numbers, code, and URLs untouched.",
  '- If a segment is already in {target}, or is an untranslatable identifier/code/URL/number, repeat it unchanged after its marker.',
].join('\n');

/** 6 hex chars, unique per request. */
export function makeSalt(): string {
  const b = new Uint8Array(3);
  (globalThis.crypto ?? crypto).getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

const marker = (salt: string, n: number) => `[[${salt}#${n}]]`;
/** In-item newline token — same salt family as segment markers so it can't
 *  collide with page text; `~n` (vs `#N`) keeps the two visually distinct. */
const nlToken = (salt: string) => `[[${salt}~n]]`;
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export interface BuiltBatchPrompt {
  system: string;
  prompt: string;
  salt: string;
}

/** Build the system+user prompt for a batch of source texts (1-based markers). */
export function buildBatchPrompt(
  texts: string[],
  source: SourceLang,
  target: LangCode,
  prompt: PromptConfig,
  context?: TranslateContext,
  salt: string = makeSalt(),
  style?: PromptStyle
): BuiltBatchPrompt {
  const targetName = languageName(target);
  // Expert batch template: full takeover — but ONLY when it keeps the marker
  // instruction (isValidBatchSystemTemplate, the same predicate save-time
  // validation uses). A template without `[[{salt}#` would stop the model
  // emitting markers and kill whole-page translation outright, so imported
  // configs that dodged validation fall back to the skeleton instead.
  const expert = prompt.expert?.batch?.system;
  const usable = isValidBatchSystemTemplate(expert) ? expert : undefined;
  const base = usable ?? BATCH_SYSTEM;
  // One-pass fill: {target}/{source}/{title}/{salt} — matching the documented
  // placeholder table (the UI hint promises {source}/{title} everywhere).
  let system = fillTemplate(base, { ...templateValues(source, targetName, context), salt });
  // Context goes in the system prompt; the user message is ONLY markers + text so
  // no scaffolding can leak into a translation (see prompts/buildReference).
  if (!usable) system += styleBlock(style, 'marker and output-format rules') + buildReference(source, context);
  // Expert template: everything else is the user's to own, but the ~n token
  // rule rides along unconditionally — items are encoded regardless, and a
  // model never told what the token means translates or drops it (the lenient
  // decode sweep then merges paragraphs → 逐段对照 silently degrades).
  if (usable) system += '\n' + fillTemplate(NL_TOKEN_RULE, { salt });

  // Item-internal newlines are ENCODED as a salted token: a model that sees a
  // blank line inside a long batch item will sometimes treat it as the end of
  // the segment and silently skip the rest (observed with gemini-flash — the
  // truncated result then poisons the translation cache). With no literal
  // newlines inside items, the only newlines in the prompt body are the
  // separators BETWEEN markers. decodeNewlineTokens() restores them on output.
  const promptBody = texts.map((t, i) => `${marker(salt, i + 1)}${t.replace(/\n/g, nlToken(salt))}`).join('\n');
  return { system, prompt: promptBody, salt };
}

/**
 * Restore encoded paragraph breaks in a segment's TRANSLATED text. Exact
 * salted tokens become newlines; a lenient second pass sweeps token debris a
 * model mangled (wrong salt casing/typos in the hex run) so no `[[..~n]]`
 * garbage ever reaches the page — a lost token simply merges two paragraphs,
 * which the interleave gate then treats as a count mismatch (whole-block
 * fallback), never a mis-slice.
 */
export function decodeNewlineTokens(text: string, salt: string): string {
  return text.replaceAll(nlToken(salt), '\n').replace(NL_TOKEN_LENIENT_RE, '\n');
}

/** Is `s` a non-empty prefix of some `[[salt#<digits>]]` marker? (stream guard) */
function isMarkerPrefix(s: string, salt: string): boolean {
  const head = `[[${salt}#`;
  if (s.length <= head.length) return head.startsWith(s);
  if (!s.startsWith(head)) return false;
  return /^\d*\]?\]?$/.test(s.slice(head.length)); // digits then up to "]]"
}

/** Longest trailing substring of `buf` that could still grow into a marker. */
function trailingHold(buf: string, salt: string): string {
  const from = Math.max(0, buf.length - (salt.length + 16));
  for (let k = from; k < buf.length; k++) {
    if (isMarkerPrefix(buf.slice(k), salt)) return buf.slice(k);
  }
  return '';
}

/**
 * Incremental parser: feed raw model output deltas, get per-segment events.
 * Robust to markers split across chunk boundaries. Order of real-world use:
 *   const p = createBatchParser(salt); ...p.push(delta)...; p.flush();
 */
export function createBatchParser(salt: string) {
  const re = new RegExp(`\\[\\[${escapeRegExp(salt)}#(\\d+)\\]\\]`);
  let buf = '';
  let cur: number | null = null; // segment currently streaming
  // A done segment stays done. Models occasionally re-emit an earlier marker
  // (self-correction mid-stream); re-entering would CONCATENATE the retake onto
  // the already-delivered text — worse than ignoring it, because the first
  // version was already rendered and cached. Repeated-marker text is dropped
  // until the next fresh marker.
  const finished = new Set<number>();

  /** Segment index a marker opens, or null when it re-opens a finished one. */
  const open = (n: number): number | null => (finished.has(n) ? null : n);

  function push(chunk: string): SegEvent[] {
    const out: SegEvent[] = [];
    buf += chunk;
    for (;;) {
      const m = re.exec(buf);
      if (cur === null) {
        // Before/between segments (or inside a dropped retake): skip to the next marker.
        if (m) {
          cur = open(Number(m[1]));
          buf = buf.slice(m.index + m[0].length);
          continue;
        }
        buf = trailingHold(buf, salt); // drop preamble, keep a partial marker
        return out;
      }
      // Streaming a segment: a new marker ends it.
      if (m) {
        if (m.index > 0) out.push({ index: cur, delta: buf.slice(0, m.index), done: false });
        out.push({ index: cur, delta: '', done: true });
        finished.add(cur);
        cur = open(Number(m[1]));
        buf = buf.slice(m.index + m[0].length);
        continue;
      }
      const hold = trailingHold(buf, salt);
      const emit = buf.slice(0, buf.length - hold.length);
      if (emit) out.push({ index: cur, delta: emit, done: false });
      buf = hold;
      return out;
    }
  }

  function flush(): SegEvent[] {
    const out: SegEvent[] = [];
    if (cur !== null) {
      if (buf) out.push({ index: cur, delta: buf, done: false });
      out.push({ index: cur, delta: '', done: true });
      finished.add(cur);
    }
    buf = '';
    cur = null;
    return out;
  }

  return { push, flush };
}

