/**
 * @module services/translation/reasoning
 *
 * Strip inline reasoning from reasoning-model output.
 *
 * Structured-reasoning providers (Gemini, OpenAI o-series) surface thinking as
 * SEPARATE stream parts, so `streamText().textStream` / `generateText().text`
 * already exclude it — and the batch parser drops everything before the first
 * marker anyway. But some models (DeepSeek-R1 and friends via Ollama /
 * OpenRouter / openai-compatible) emit a leading `<think>…</think>` block as
 * plain TEXT. This module removes that prefix so it never reaches the page.
 *
 * Pure logic — unit-tested, no ai-sdk.
 */

const OPEN = '<think>';
const CLOSE = '</think>';

/**
 * Drop a leading `<think>…</think>` block from a COMPLETE string.
 *
 * An UNCLOSED leading `<think>` is returned as-is: real inline-reasoning
 * models always close the tag before the answer, so "never closes" means the
 * text legitimately STARTS with a literal `<think>` (e.g. translating a page
 * about reasoning models) — swallowing it turned a valid translation into a
 * silent empty result.
 */
export function stripThink(text: string): string {
  const t = text.trimStart();
  if (!t.startsWith(OPEN)) return text;
  const i = t.indexOf(CLOSE);
  return i === -1 ? text : t.slice(i + CLOSE.length).trimStart();
}

export interface ThinkStripper {
  /** Feed a raw delta, get the text to actually show (may be ''). */
  push(delta: string): string;
  /**
   * MUST be called at stream end. Returns any withheld remainder: when a
   * leading `<think>` never closed, the whole withheld prefix comes back —
   * same rationale as `stripThink`, it was literal content, not reasoning.
   */
  flush(): string;
}

/**
 * Stateful streaming stripper: suppresses a leading `<think>…</think>` even
 * when it's split across chunks. Non-reasoning output passes through after a
 * few-char sniff. While inside an (as yet unclosed) think block the FULL text
 * is buffered, not discarded — `flush()` can then return it if the close tag
 * never arrives (literal `<think>` content). Real reasoning spans are bounded
 * (a few KB), so the buffer is not a memory concern.
 *
 *   const strip = createThinkStripper();
 *   ...show(strip.push(delta))...; show(strip.flush());
 */
export function createThinkStripper(): ThinkStripper {
  let buf = '';
  let mode: 'sniff' | 'think' | 'pass' = 'sniff';

  const push = (delta: string): string => {
    if (mode === 'pass') return delta;
    buf += delta;

    if (mode === 'sniff') {
      const lead = buf.replace(/^\s+/, '');
      if (lead.length < OPEN.length) {
        if (OPEN.startsWith(lead)) return ''; // could still become <think> — wait
        mode = 'pass'; // definitely not reasoning
        const out = buf;
        buf = '';
        return out;
      }
      if (!lead.startsWith(OPEN)) {
        mode = 'pass';
        const out = buf;
        buf = '';
        return out;
      }
      mode = 'think';
    }

    // mode === 'think': withhold until the close tag; keep everything so an
    // unclosed block can be recovered by flush().
    const i = buf.indexOf(CLOSE);
    if (i === -1) return '';
    const rest = buf.slice(i + CLOSE.length).replace(/^\s+/, '');
    buf = '';
    mode = 'pass';
    return rest;
  };

  const flush = (): string => {
    const out = mode === 'sniff' || mode === 'think' ? buf : '';
    buf = '';
    mode = 'pass';
    return out;
  };

  return { push, flush };
}
