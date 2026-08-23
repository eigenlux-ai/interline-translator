/**
 * @module dom/skip-policy
 *
 * Decide whether a unit's text should be SKIPPED (already a language the user
 * reads) before we spend an RPC translating it. Division of labour with
 * `dom/filter`: filter prunes single NODES structurally (skip tags, editors,
 * our own output); this module judges a unit's TEXT by language.
 * Detection operates in three layers:
 *
 *   1. SCRIPT fast-path (sync, zero-cost): CJK scripts are decisive (kana ⇒ ja,
 *      hangul ⇒ ko, Han-dominant ⇒ zh). Evaluated synchronously before queuing.
 *   2. On-device DETECTOR (async): Uses Chrome's built-in `LanguageDetector` API
 *      for Latin and other languages, gated by minimum text length and confidence.
 *   3. POST-translation guard (caller): Checks if the engine returned the input unchanged.
 *
 * A hit means: the detected language is the TARGET or one of the user's
 * `skipLanguages` (the languages they already read).
 */

/** Tuning for the detector layer (the script fast-path is always exact). */
export const MIN_DETECT_LENGTH = 12; // shorter text detects unreliably → don't trust it
export const MIN_DETECT_CONFIDENCE = 0.5;

export interface SkipPolicy {
  /** Always skipped. */
  target: string;
  /** Extra languages the user reads. */
  skip: readonly string[];
  minLength: number;
  minConfidence: number;
}

/** Build a policy from config (fills the threshold constants). */
export function skipPolicy(target: string, skip: readonly string[]): SkipPolicy {
  return { target, skip, minLength: MIN_DETECT_LENGTH, minConfidence: MIN_DETECT_CONFIDENCE };
}

/** Base subtag, case-folded: 'zh-CN' → 'zh', 'EN' → 'en'. */
function base(lang: string): string {
  return lang.toLowerCase().split('-')[0];
}

/** True if a detected code matches the target or a skip language (by base subtag). */
function matchesPolicy(lang: string, policy: SkipPolicy): boolean {
  const b = base(lang);
  return b === base(policy.target) || policy.skip.some((s) => base(s) === b);
}

/**
 * The language a text's SCRIPT decisively indicates, or null when the script
 * isn't decisive (Latin could be any of dozens of languages). Conservative on
 * mixed text — only calls it Chinese when Han dominates, so a mostly-English line
 * with one 中文 word stays unknown (→ gets translated).
 */
function scriptLang(text: string): 'ja' | 'ko' | 'zh' | null {
  if (/[぀-ヿ]/u.test(text)) return 'ja'; // hiragana + katakana
  if (/[가-힯ᄀ-ᇿ]/u.test(text)) return 'ko'; // hangul syllables + jamo
  const han = (text.match(/[一-鿿㐀-䶿]/gu) ?? []).length;
  const latin = (text.match(/[a-z]/giu) ?? []).length;
  return han > 0 && han >= latin ? 'zh' : null;
}

/** Layer 1 — synchronous, exact for CJK. True ⇒ skip without queuing/translating. */
export function scriptSaysSkip(text: string, policy: SkipPolicy): boolean {
  const lang = scriptLang(text);
  return lang !== null && matchesPolicy(lang, policy);
}

// ---- Layer 2: Chrome on-device LanguageDetector (best-effort, cached) ----

interface Detector {
  detect(text: string): Promise<Array<{ detectedLanguage: string; confidence: number }>>;
}
interface DetectorCtor {
  availability?: () => Promise<string>;
  create: () => Promise<Detector>;
}

// undefined = not probed yet, null = probed-unavailable, Detector = ready.
let cached: Detector | null | undefined;
let probing = false;
let lastProbe = 0;

/** When unavailable, re-check availability at most this often. Lets a model the
 *  user downloads on the OPTIONS PAGE get picked up here (a different realm, but
 *  availability is a browser-wide fact) without a page reload. */
const REPROBE_MS = 60_000;

/** Return the on-device detector if ready; otherwise kick off creation in the
 *  background and return null so the caller falls back this time. Re-probes after
 *  REPROBE_MS while unavailable. Never throws and never blocks on a download. */
function readyDetector(win: (Window & typeof globalThis) | null | undefined): Detector | null {
  if (cached) return cached; // ready — keep it forever
  if (probing) return null;
  // cached === null means we probed and the model wasn't present; only re-probe
  // once the TTL has elapsed. cached === undefined means never probed → probe now.
  if (cached === null && Date.now() - lastProbe < REPROBE_MS) return null;
  probing = true;
  lastProbe = Date.now();
  const Ctor = (win ?? globalThis) as unknown as { LanguageDetector?: DetectorCtor };
  const LD = Ctor.LanguageDetector;
  if (!LD?.create) {
    cached = null;
    probing = false;
    return null;
  }
  void (async () => {
    try {
      const availability = LD.availability ? await LD.availability() : 'available';
      // Only create when the model is already present. Downloading it needs a
      // USER GESTURE (Chrome throws otherwise) — that's the options page's job
      // (services/detect/model). Until then we stay null and fall back.
      cached = availability === 'available' ? await LD.create() : null;
    } catch {
      cached = null;
    } finally {
      probing = false;
    }
  })();
  return null;
}

/** Layer 2 — async. True ⇒ the on-device detector is confident the text is the
 *  target or a skip language. False (fall through) on short text / low confidence
 *  / detector unavailable. */
export async function detectSaysSkip(
  text: string,
  policy: SkipPolicy,
  win: (Window & typeof globalThis) | null | undefined
): Promise<boolean> {
  if (text.length < policy.minLength) return false;
  const det = readyDetector(win);
  if (!det) return false;
  try {
    const top = (await det.detect(text))?.[0];
    return !!top && top.confidence >= policy.minConfidence && matchesPolicy(top.detectedLanguage, policy);
  } catch {
    return false;
  }
}

/** Test-only: reset the cached detector between cases. */
export function __resetDetectorCache(): void {
  cached = undefined;
  probing = false;
  lastProbe = 0;
}
