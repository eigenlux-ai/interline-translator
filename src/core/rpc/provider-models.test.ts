import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ModelsService } from './provider-models';

vi.mock('@/services/request', () => ({ fetchJson: vi.fn() }));
import { fetchJson } from '@/services/request';

const mockFetch = fetchJson as unknown as ReturnType<typeof vi.fn>;
const svc = new ModelsService();
// last call's [url, init]
const lastUrl = () => mockFetch.mock.calls.at(-1)![0] as string;
const lastHeaders = () => (mockFetch.mock.calls.at(-1)![1] as { headers: Record<string, string> }).headers;

beforeEach(() => mockFetch.mockReset());

describe('ModelsService.list', () => {
  it('openai: GET /v1/models with Bearer auth, ids sorted & deduped', async () => {
    mockFetch.mockResolvedValue({ data: [{ id: 'gpt-b' }, { id: 'gpt-a' }, { id: 'gpt-a' }] });
    const ids = await svc.list({ kind: 'openai', apiKey: 'sk-1' });
    expect(lastUrl()).toBe('https://api.openai.com/v1/models');
    expect(lastHeaders().Authorization).toBe('Bearer sk-1');
    expect(ids).toEqual(['gpt-a', 'gpt-b']);
  });

  it('anthropic: x-api-key + version + browser-access headers', async () => {
    mockFetch.mockResolvedValue({ data: [{ id: 'claude-x' }] });
    await svc.list({ kind: 'anthropic', apiKey: 'sk-ant' });
    expect(lastUrl()).toBe('https://api.anthropic.com/v1/models');
    const h = lastHeaders();
    expect(h['x-api-key']).toBe('sk-ant');
    expect(h['anthropic-version']).toBe('2023-06-01');
    expect(h['anthropic-dangerous-direct-browser-access']).toBe('true');
    expect(h.Authorization).toBeUndefined();
  });

  it('google: key in query, parses models[].name and strips the models/ prefix', async () => {
    mockFetch.mockResolvedValue({
      models: [
        { name: 'models/gemini-2.0-flash', supportedGenerationMethods: ['generateContent'] },
        { name: 'models/embedding-001', supportedGenerationMethods: ['embedContent'] }, // filtered out
      ],
    });
    const ids = await svc.list({ kind: 'google', apiKey: 'g-key' });
    expect(lastUrl()).toContain('https://generativelanguage.googleapis.com/v1beta/models?key=g-key');
    expect(ids).toEqual(['gemini-2.0-flash']);
  });

  it('openai-compatible: honours baseURL override and strips a trailing slash', async () => {
    mockFetch.mockResolvedValue({ data: [{ id: 'llama3.1' }] });
    await svc.list({ kind: 'openai-compatible', baseURL: 'http://localhost:11434/v1/' });
    expect(lastUrl()).toBe('http://localhost:11434/v1/models');
  });

  it('anthropic-compatible: custom baseURL + anthropic-style headers', async () => {
    mockFetch.mockResolvedValue({ data: [{ id: 'kimi-k2' }] });
    await svc.list({ kind: 'anthropic-compatible', baseURL: 'https://api.moonshot.cn/anthropic/', apiKey: 'sk-kimi' });
    expect(lastUrl()).toBe('https://api.moonshot.cn/anthropic/models');
    const h = lastHeaders();
    expect(h['x-api-key']).toBe('sk-kimi');
    expect(h['anthropic-version']).toBe('2023-06-01');
    expect(h.Authorization).toBeUndefined();
  });

  it('merges extra headers into the request', async () => {
    mockFetch.mockResolvedValue({ data: [] });
    await svc.list({ kind: 'openai', apiKey: 'sk-1', extraHeaders: { 'X-Org': 'acme' } });
    expect(lastHeaders()['X-Org']).toBe('acme');
  });
});
