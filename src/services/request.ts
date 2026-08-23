/**
 * @module services/request
 *
 * Thin background JSON fetch with a timeout. Deliberately NOT ai-sdk — plain
 * HTTP. Background-only: it runs cross-origin fetches that must originate from
 * the service worker.
 *
 * NB: the google-mt fetcher (translation/provider/mt) does NOT use this — it
 * hand-rolls its fetch because retry classification needs a `statusCode` on
 * the thrown error, which this helper doesn't attach. Current consumer:
 * core/rpc/provider-models (provider model listing).
 */

export interface RequestInitJson extends Omit<RequestInit, 'body'> {
  /** JSON body; serialized automatically. */
  json?: unknown;
}

/**
 * Endpoint identity for an error message: origin + pathname, query dropped.
 *
 * The thrown message reaches a user-facing notification (settings ->
 * ProviderSettings "load models"), so it must never carry a credential.
 * Gemini's `/models` puts the API key in the query string, and dropping the
 * whole query beats redacting known param names: a denylist (`key`, `token`,
 * `access_token`, ...) needs an edit every time a provider or corporate proxy
 * invents another one, and the query carries nothing diagnostic here anyway.
 * `URL` also drops any `user:pass@` userinfo for free.
 */
function endpointOf(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    // Not absolute (or not a URL at all) — cut at the query/fragment marker so
    // the fallback can never expose more than the parsed path would.
    return url.split(/[?#]/, 1)[0];
  }
}

/** Fetch JSON with a timeout; throws on non-2xx. Background-only. */
export async function fetchJson<T>(url: string, init: RequestInitJson = {}, timeoutMs = 10_000): Promise<T> {
  const { json, ...rest } = init;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...rest,
      signal: controller.signal,
      ...(json !== undefined
        ? {
            method: rest.method ?? 'POST',
            headers: { 'content-type': 'application/json', ...(rest.headers ?? {}) },
            body: JSON.stringify(json),
          }
        : {}),
    });
    if (!res.ok) throw new Error(`[request] ${res.status} ${res.statusText} for ${endpointOf(url)}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}
