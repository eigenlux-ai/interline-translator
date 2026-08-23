import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchJson } from './request';

/** Stub `fetch` with a minimal Response — `fetchJson` only touches these four members. */
const stubFetch = (init: { ok: boolean; status?: number; statusText?: string; body?: unknown }) =>
  vi.stubGlobal('fetch', async () => ({
    ok: init.ok,
    status: init.status ?? 200,
    statusText: init.statusText ?? '',
    json: async () => init.body,
  }));

afterEach(() => vi.unstubAllGlobals());

describe('fetchJson', () => {
  it('resolves the parsed body on 2xx', async () => {
    stubFetch({ ok: true, body: { data: [{ id: 'gpt-a' }] } });
    await expect(fetchJson('https://api.openai.com/v1/models')).resolves.toEqual({ data: [{ id: 'gpt-a' }] });
  });

  it('never leaks a query-string credential into the thrown message', async () => {
    // Gemini's /models carries the API key in the query by design, and
    // ProviderSettings shows the thrown message verbatim in a notification.
    stubFetch({ ok: false, status: 403, statusText: 'Forbidden' });
    const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=AIzaSyDEADBEEF_secret&pageSize=1000';
    const message = await fetchJson(url).catch((e: Error) => e.message);

    expect(message).not.toContain('AIza');
    expect(message).not.toContain('key=');
    // Still diagnosable: the status plus the endpoint that failed.
    expect(message).toBe('[request] 403 Forbidden for https://generativelanguage.googleapis.com/v1beta/models');
  });

  it('drops userinfo and keeps a keyless URL intact', async () => {
    stubFetch({ ok: false, status: 401, statusText: 'Unauthorized' });
    const message = await fetchJson('https://sk-abc:tok@gateway.acme.test/v1/models').catch((e: Error) => e.message);
    expect(message).toBe('[request] 401 Unauthorized for https://gateway.acme.test/v1/models');
  });

  it('formats an unparseable URL without throwing a second error', async () => {
    stubFetch({ ok: false, status: 500, statusText: 'Internal Server Error' });
    const message = await fetchJson('//models?token=sk-secret').catch((e: Error) => e.message);
    expect(message).toBe('[request] 500 Internal Server Error for //models');
  });
});
