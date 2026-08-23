/**
 * @module services/translation/batch/nl-token
 *
 * The SHAPE of the salted in-item newline token `[[salt~n]]`, shared between
 * the batch protocol (background — knows the salt, see protocol.ts) and the
 * content-side streaming display (never sees the salt, so it can only match
 * leniently). A separate tiny module because protocol.ts pulls in the whole
 * prompt library — too heavy for the content-script bundle budget.
 */

/** Lenient match for a COMPLETE token: any 4-8 hex salt, any casing — also
 *  catches salts a model mangled (wrong casing / hex typos). */
export const NL_TOKEN_LENIENT_RE = /\[\[[0-9a-f]{4,8}~n\]\]/gi;

/**
 * Display-layer sweep for STREAMING text: complete tokens become paragraph
 * breaks, and a trailing half-token is hidden until the next delta completes
 * it. The trailing case is real — the parser's hold-back only protects
 * `[[salt#` marker prefixes, and `[[salt~` diverges from that prefix at the
 * `~`, so from that character on the fragment is released to the client as
 * ordinary delta text. Requiring the `~` keeps the trim from ever eating
 * legitimate translation text that happens to end in `[[` or hex.
 */
export function sweepNewlineTokensForDisplay(text: string): string {
  return text.replace(NL_TOKEN_LENIENT_RE, '\n').replace(/\[\[[0-9a-f]{4,8}~(?:n\]?)?$/i, '');
}
