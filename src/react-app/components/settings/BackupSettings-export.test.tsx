// @vitest-environment happy-dom
/**
 * Export redaction contract: the downloaded `interline-config.json` carries NO
 * API keys unless the user explicitly confirmed the plaintext-key export, and
 * importing a legacy backup that DOES contain keys keeps working unchanged.
 */
import { MantineProvider } from '@mantine/core';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Config } from '@/data/models';
import { m } from '@/paraglide/messages.js';
import { defaultConfig } from '@/services/config/schema';
import BackupSettings, { exportableConfig } from './BackupSettings';

afterEach(cleanup);

/** A config with one keyed engine plus rules/glossary that must survive export. */
function withSecret(): Config {
  const cfg = defaultConfig();
  cfg.providers.push({
    id: 'my-openai',
    kind: 'openai',
    apiKeys: ['sk-secret'],
    model: 'gpt-4o-mini',
    extraHeaders: { 'X-Team': 'reading' },
    params: { temperature: 0.2 },
    enabled: true,
  });
  cfg.glossary.push({
    id: 'g1',
    name: 'terms',
    enabled: true,
    entries: [{ source: 'interline', target: '行间', note: 'name' }],
  });
  return cfg;
}

describe('exportableConfig', () => {
  it('drops API keys by default and keeps every other field', () => {
    const cfg = withSecret();
    const out = exportableConfig(cfg);
    const mine = out.providers.find((p) => p.id === 'my-openai')!;
    expect(mine.apiKeys).toEqual([]);
    expect(mine.model).toBe('gpt-4o-mini');
    expect(mine.extraHeaders).toEqual({ 'X-Team': 'reading' });
    expect(mine.params).toEqual({ temperature: 0.2 });
    expect(out.glossary).toEqual(cfg.glossary);
    // The caller's config is never mutated in place.
    expect(cfg.providers.find((p) => p.id === 'my-openai')!.apiKeys).toEqual(['sk-secret']);
  });

  it('keeps the keys only when explicitly asked to', () => {
    const cfg = withSecret();
    expect(exportableConfig(cfg, true).providers.find((p) => p.id === 'my-openai')!.apiKeys).toEqual(['sk-secret']);
  });
});

describe('export UI', () => {
  let downloaded: Blob | null;
  let clickSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    downloaded = null;
    URL.createObjectURL = vi.fn((blob: Blob | MediaSource) => {
      downloaded = blob as Blob;
      return 'blob:interline-test';
    });
    URL.revokeObjectURL = vi.fn();
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => undefined);
  });

  afterEach(() => {
    clickSpy.mockRestore();
  });

  const mount = () =>
    render(
      <MantineProvider>
        <BackupSettings config={withSecret()} onSave={vi.fn()} />
      </MantineProvider>
    );
  const exportedJson = async () => JSON.parse(await downloaded!.text());

  it('the default export writes no API keys into the file', async () => {
    const view = mount();
    await act(async () => {
      fireEvent.click(view.getByText(m.backup_export()));
    });
    const parsed = await exportedJson();
    expect(parsed.providers.every((p: { apiKeys: string[] }) => p.apiKeys.length === 0)).toBe(true);
    expect(JSON.stringify(parsed)).not.toContain('sk-secret');
    expect(parsed.providers.find((p: { id: string }) => p.id === 'my-openai').model).toBe('gpt-4o-mini');
  });

  it('exporting keys demands an explicit confirmation that says the file will contain them', async () => {
    const view = mount();
    await act(async () => {
      fireEvent.click(view.getByText(m.backup_export_keys()));
    });
    // The warning names the risk in plain words…
    expect(view.getByText(m.backup_export_keys_confirm_text())).toBeTruthy();
    // …and nothing has been downloaded before the user confirms.
    expect(downloaded).toBeNull();
    await act(async () => {
      fireEvent.click(view.getByText(m.backup_export_keys_confirm()));
    });
    const parsed = await exportedJson();
    expect(parsed.providers.find((p: { id: string }) => p.id === 'my-openai').apiKeys).toEqual(['sk-secret']);
  });

  it('cancelling the confirmation downloads nothing', async () => {
    const view = mount();
    await act(async () => {
      fireEvent.click(view.getByText(m.backup_export_keys()));
    });
    await act(async () => {
      fireEvent.click(view.getByText(m.common_cancel()));
    });
    expect(downloaded).toBeNull();
  });
});

it('a legacy backup that contains API keys still imports, keys intact but gated as a draft', async () => {
  const onSave = vi.fn();
  const view = render(
    <MantineProvider>
      <BackupSettings config={defaultConfig()} onSave={onSave} />
    </MantineProvider>
  );
  const file = new File([JSON.stringify(withSecret())], 'legacy.json', { type: 'application/json' });
  await act(async () => {
    fireEvent.change(view.container.querySelector('input[type=file]')!, { target: { files: [file] } });
    await new Promise((r) => setTimeout(r, 30));
  });
  await act(async () => {
    fireEvent.click(view.getByText(m.backup_apply_import()));
  });
  expect(onSave).toHaveBeenCalledOnce();
  const imported = (onSave.mock.calls[0][0] as Config).providers.find((p) => p.id === 'my-openai')!;
  // The import path is untouched: keys survive the round-trip, the engine just
  // waits behind the validation gate.
  expect(imported.apiKeys).toEqual(['sk-secret']);
  expect(imported.draft).toBe(true);
  expect(imported.enabled).toBe(false);
});
