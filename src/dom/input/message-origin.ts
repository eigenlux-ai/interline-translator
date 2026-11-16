/**
 * Use the document's inherited origin, not its URL's origin: about:blank and
 * srcdoc can belong to an HTTP(S) page while location.origin is still "null".
 * Opaque sandbox origins never participate in the editor bridge.
 */
export function editorMessageOrigin(win: Pick<Window, 'origin'> = window): string | null {
  try {
    const origin = new URL(win.origin);
    return origin.protocol === 'http:' || origin.protocol === 'https:' ? origin.origin : null;
  } catch {
    return null;
  }
}
