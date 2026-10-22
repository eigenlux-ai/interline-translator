import { MantineProvider } from '@mantine/core';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { Config } from '@/data/models';
import { m } from '@/paraglide/messages.js';
import { defaultConfig } from '@/services/config/schema';
import ProviderSettings from './ProviderSettings';

// happy-dom does not implement the FontFaceSet used by Mantine Autosize.
Object.defineProperty(document, 'fonts', { configurable: true, value: new EventTarget() });

const validateProvider = vi.hoisted(() => vi.fn());
vi.mock('@/services/translation/contract', () => ({ getTranslationService: () => ({ validateProvider }) }));
vi.mock('@mantine/notifications', () => ({ notifications: { show: vi.fn() } }));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

function fixture() {
  const config = defaultConfig();
  config.providers.push({
    id: 'checking',
    kind: 'openai',
    apiKeys: ['key'],
    model: 'model',
    draft: true,
    enabled: false,
  });
  return config;
}

it('validation preserves intervening edits, additions, removals, and unrelated configuration', async () => {
  let finish!: (result: { ok: boolean }) => void;
  validateProvider.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  const config = fixture();
  config.providers.push({ ...config.providers[1], id: 'removed' });
  const onSave = vi.fn();
  const ui = (value: Config) => (
    <MantineProvider>
      <ProviderSettings config={value} onSave={onSave} />
    </MantineProvider>
  );
  const view = render(ui(config));
  fireEvent.click(view.getAllByText(m.provider_validate())[0]);
  const latest = {
    ...config,
    language: { ui: 'fr' as const },
    providers: [
      { ...config.providers[0], label: 'edited', enabled: false },
      { ...config.providers[1], label: 'renamed' },
      { ...config.providers[1], id: 'added' },
    ],
  };
  view.rerender(ui(latest));
  await act(async () => {
    finish({ ok: true });
  });
  expect(onSave).toHaveBeenCalledExactlyOnceWith({
    ...latest,
    providers: latest.providers.map((p) => (p.id === 'checking' ? { ...p, draft: false, enabled: true } : p)),
  });
});

it.each(['removed', 'unmounted'])('ignores validation after the card is %s', async (mode) => {
  let finish!: (result: { ok: boolean }) => void;
  validateProvider.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  const config = fixture();
  const onSave = vi.fn();
  const view = render(
    <MantineProvider>
      <ProviderSettings config={config} onSave={onSave} />
    </MantineProvider>
  );
  fireEvent.click(view.getByText(m.provider_validate()));
  if (mode === 'unmounted') view.unmount();
  else
    view.rerender(
      <MantineProvider>
        <ProviderSettings config={{ ...config, providers: [] }} onSave={onSave} />
      </MantineProvider>
    );
  await act(async () => {
    finish({ ok: true });
  });
  expect(onSave).not.toHaveBeenCalled();
});

it('uses random IDs for new engines across separate settings instances', () => {
  const onSave = vi.fn();
  for (let i = 0; i < 2; i++) {
    const view = render(
      <MantineProvider>
        <ProviderSettings config={defaultConfig()} onSave={onSave} />
      </MantineProvider>
    );
    fireEvent.click(view.getByRole('button', { name: /^OpenAI$/ }));
    view.unmount();
  }
  const ids = onSave.mock.calls.map(([config]) => (config as Config).providers.at(-1)!.id);
  expect(ids[0]).toMatch(/^openai-[0-9a-f]{32}$/);
  expect(ids[1]).not.toBe(ids[0]);
});

it('does not validate a connection changed while the request was pending', async () => {
  let finish!: (result: { ok: boolean }) => void;
  validateProvider.mockImplementation(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      })
  );
  const config = fixture();
  const onSave = vi.fn();
  const view = render(
    <MantineProvider>
      <ProviderSettings config={config} onSave={onSave} />
    </MantineProvider>
  );
  fireEvent.click(view.getByText(m.provider_validate()));
  const changed = {
    ...config,
    providers: config.providers.map((p) => (p.id === 'checking' ? { ...p, model: 'new-model' } : p)),
  };
  view.rerender(
    <MantineProvider>
      <ProviderSettings config={changed} onSave={onSave} />
    </MantineProvider>
  );
  await act(async () => {
    finish({ ok: true });
  });
  expect(onSave).not.toHaveBeenCalled();
});
