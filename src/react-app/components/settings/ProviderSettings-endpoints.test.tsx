// @vitest-environment happy-dom
/**
 * Endpoint-invariant contract for the `anthropic-compatible` preset: the
 * request-side default stays the OFFICIAL Anthropic endpoint (a blank Base URL
 * must never ship the user's key to a third party), while the UI's real-world
 * example is a third-party endpoint that is visibly labeled 「第三方服务」 and
 * never used for a request.
 */
import { MantineProvider } from '@mantine/core';
import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_BASE } from '@/core/rpc/provider-models';
import type { Config } from '@/data/models';
import { m } from '@/paraglide/messages.js';
import { defaultConfig } from '@/services/config/schema';
import ProviderSettings, { BASE_URL_HINT, THIRD_PARTY_KINDS } from './ProviderSettings';

// happy-dom does not implement the FontFaceSet used by Mantine Autosize.
Object.defineProperty(document, 'fonts', { configurable: true, value: new EventTarget() });
afterEach(cleanup);

function withCompatible(): Config {
  const config = defaultConfig();
  config.providers.push({
    id: 'kimi',
    kind: 'anthropic-compatible',
    apiKeys: [],
    model: 'glm-4.6',
    draft: true,
    enabled: false,
  });
  return config;
}

describe('anthropic-compatible endpoint defaults', () => {
  it('a blank Base URL resolves to the official Anthropic endpoint — same as the `anthropic` kind', () => {
    expect(DEFAULT_BASE['anthropic-compatible']).toBe('https://api.anthropic.com/v1');
    expect(DEFAULT_BASE['anthropic-compatible']).toBe(DEFAULT_BASE.anthropic);
  });

  it('the UI hint is a third-party example: flagged in the UI and never the request default', () => {
    expect(BASE_URL_HINT['anthropic-compatible']).toBe('https://api.moonshot.cn/anthropic');
    expect(BASE_URL_HINT['anthropic-compatible']).not.toBe(DEFAULT_BASE['anthropic-compatible']);
    expect(THIRD_PARTY_KINDS.has('anthropic-compatible')).toBe(true);
    expect(THIRD_PARTY_KINDS.has('anthropic')).toBe(false);
    expect(THIRD_PARTY_KINDS.has('openai-compatible')).toBe(false);
  });

  it('renders the preset with a third-party label and an honest Base URL description', () => {
    const view = render(
      <MantineProvider>
        <ProviderSettings config={withCompatible()} onSave={vi.fn()} />
      </MantineProvider>
    );
    expect(view.getAllByText(m.provider_third_party()).length).toBeGreaterThan(0);
    expect(view.getByText(m.provider_base_url_third_party_desc())).toBeTruthy();
  });
});
