/**
 * @module services/translation/provider/mt
 *
 * Free, no-key machine translation — the out-of-the-box fallback so the
 * extension works before a user configures any LLM key. Uses Google's public
 * `translate_a/single` (client=gtx) GET endpoint, which needs no key. Plain
 * HTTP (not ai-sdk). BACKGROUND-ONLY (cross-origin fetch from the SW).
 *
 * M1a: the `translate_a/single` fetcher. The `translate-pa` HTML endpoint
 * (preserves inline tags, better quality) lands in M1b as the primary.
 */

import type { LangCode, SourceLang } from '@/data/models';

/** Map our codes to Google MT's `sl`/`tl` params. `auto` → 'auto'. */
function toGoogleLang(code: SourceLang | LangCode): string {
  if (code === 'auto') return 'auto';
  // Our LangCodes match Google's (zh-CN/zh-TW regioned, rest bare) — pass through.
  return code;
}

/** Above this, `q` moves to a POST body — long selections in a GET query
 *  overflow Google's frontend URL limit (~8k after encoding; CJK ≈ 9 bytes/char). */
const GET_MAX_CHARS = 700;

interface MtResult {
  text: string;
  detectedSource?: string;
}

/**
 * Translate plain text via the free endpoint. Returns the joined translation
 * plus the detected source language. Throws on network/parse failure so the
 * caller can fall back or surface an error.
 */
export async function googleFreeTranslate(
  text: string,
  source: SourceLang,
  target: LangCode,
  timeoutMs = 10_000
): Promise<MtResult> {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: toGoogleLang(source),
    tl: toGoogleLang(target),
    dt: 't',
  });
  const base = `https://translate.googleapis.com/translate_a/single?${params.toString()}`;
  // Same endpoint accepts q in a form-encoded POST body — required for long
  // text, identical response shape.
  const init: RequestInit =
    text.length <= GET_MAX_CHARS
      ? {}
      : {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: new URLSearchParams({ q: text }).toString(),
        };
  const url = init.method ? base : `${base}&${new URLSearchParams({ q: text }).toString()}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    // statusCode on the error object: the RequestQueue's retry classifier keys
    // on it (a 400/403 must fail fast, not walk the backoff ladder).
    if (!res.ok) throw Object.assign(new Error(`[mt] ${res.status} ${res.statusText}`), { statusCode: res.status });
    const data = (await res.json()) as unknown;
    return parseSingle(data);
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Response shape: `[ [ ["译文","src",...], ... ], ..., "detectedLang", ... ]`.
 * Concatenate every sentence segment's first element. Exported for unit tests.
 */
export function parseSingle(data: unknown): MtResult {
  if (!Array.isArray(data)) throw new Error('[mt] unexpected response shape');
  const segments = data[0];
  if (!Array.isArray(segments)) throw new Error('[mt] missing translation segments');
  const text = segments
    .map((seg) => (Array.isArray(seg) ? (seg[0] ?? '') : ''))
    .join('')
    .trim();
  const detectedSource = typeof data[2] === 'string' ? (data[2] as string) : undefined;
  return { text, detectedSource };
}
