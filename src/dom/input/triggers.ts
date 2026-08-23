/**
 * @module dom/input/triggers
 *
 * Pure trigger logic for input-box translation:
 *   - SpaceTrigger: the "type space N times quickly" state machine;
 *   - parseInputCommand: optional `/en …` or `en: …` language prefix.
 *
 * No DOM here — the controller feeds it key events + timestamps, so it's fully
 * unit-testable.
 */

import type { LangCode } from '@/data/models';

export interface SpaceTriggerOptions {
  /** Consecutive spaces that fire the trigger. */
  count?: number;
  /** Max gap (ms) between consecutive spaces to count as one sequence. */
  timeThresholdMs?: number;
}

export class SpaceTrigger {
  private streak = 0;
  private last = 0;
  private readonly count: number;
  private readonly threshold: number;

  constructor(opts: SpaceTriggerOptions = {}) {
    this.count = opts.count ?? 3;
    this.threshold = opts.timeThresholdMs ?? 300;
  }

  /** Feed a space keydown at time `now` (ms). Returns true when the trigger fires. */
  space(now: number): boolean {
    if (now - this.last > this.threshold) this.streak = 0;
    this.streak++;
    this.last = now;
    if (this.streak >= this.count) {
      this.streak = 0;
      return true;
    }
    return false;
  }

  /** Any non-space key resets the streak. */
  reset(): void {
    this.streak = 0;
  }
}

/** Aliases the language-prefix command accepts. */
export const LANG_ALIASES: Record<string, LangCode> = {
  en: 'en',
  english: 'en',
  zh: 'zh-CN',
  cn: 'zh-CN',
  chinese: 'zh-CN',
  'zh-cn': 'zh-CN',
  'zh-tw': 'zh-TW',
  tw: 'zh-TW',
  ja: 'ja',
  jp: 'ja',
  japanese: 'ja',
  ko: 'ko',
  korean: 'ko',
  fr: 'fr',
  french: 'fr',
  de: 'de',
  german: 'de',
  es: 'es',
  spanish: 'es',
  ru: 'ru',
  russian: 'ru',
  pt: 'pt',
  it: 'it',
  italian: 'it',
  ar: 'ar',
};

/**
 * Aliases the colon form refuses: lowercase, yet ordinary English rather than
 * a command — "it: broken again" is a sentence, and lowercase "tw: food" is a
 * content warning, not 繁中. Demanding ≥3 characters would catch the same two
 * words, but it also kills `ja:` / `fr:` / `cn:`, the form people actually
 * type; naming the two real words is the narrower cut. Neither language loses
 * the feature: `italian:` and `zh-tw:` still work, and so does the slash form.
 */
const COLON_AMBIGUOUS: Record<string, true> = { it: true, tw: true };

export interface ParsedCommand {
  /** Explicit target from the prefix, if any (else the configured default). */
  target?: LangCode;
  /** The text to translate (prefix + trailing trigger spaces stripped). */
  text: string;
}

/**
 * Parse an optional language prefix. `/<lang> text` or `<lang>: text`. Trailing
 * whitespace (the trigger spaces) is always stripped. Unknown prefixes are left
 * as-is (treated as ordinary text).
 *
 * The slash form is case-insensitive (a leading `/` is unambiguous intent).
 * The colon form is LOWERCASE-ONLY — typed-out commands are lowercase, while
 * "TW: spoilers" and other "PSA"-style uppercase prefixes are real text — and
 * it additionally refuses COLON_AMBIGUOUS.
 */
export function parseInputCommand(raw: string): ParsedCommand {
  const text = raw.replace(/\s+$/, '');

  const slash = text.match(/^\/([a-zA-Z-]+)[ \t]+([\s\S]+)$/);
  if (slash) {
    const target = LANG_ALIASES[slash[1].toLowerCase()];
    if (target) return { target, text: slash[2] };
  }

  const colon = text.match(/^([a-z-]+):[ \t]*([\s\S]+)$/);
  if (colon && !COLON_AMBIGUOUS[colon[1]]) {
    const target = LANG_ALIASES[colon[1]];
    if (target) return { target, text: colon[2] };
  }

  return { text };
}
