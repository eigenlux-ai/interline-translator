// @vitest-environment happy-dom
import { MantineProvider } from '@mantine/core';
import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { m } from '@/paraglide/messages.js';
import { defaultConfig } from '@/services/config/schema';
import BackupSettings from './BackupSettings';

afterEach(cleanup);
it('import does not claim success before storage accepts the configuration', async () => {
  let finish!: () => void;
  const onSave = vi.fn(
    () =>
      new Promise<void>((r) => {
        finish = r;
      })
  );
  const view = render(
    <MantineProvider>
      <BackupSettings config={defaultConfig()} onSave={onSave} />
    </MantineProvider>
  );
  const input = view.container.querySelector('input[type=file]')!;
  const file = new File([JSON.stringify(defaultConfig())], 'test.json', { type: 'application/json' });
  await act(async () => {
    fireEvent.change(input, { target: { files: [file] } });
    await new Promise((r) => setTimeout(r, 30));
  });
  await act(async () => {
    fireEvent.click(view.getByText(m.backup_apply_import()));
  });
  expect(onSave).toHaveBeenCalledOnce();
  const premature = view.queryByText(m.backup_imported()) !== null;
  await act(async () => {
    finish();
  });
  expect(premature).toBe(false);
});

it('retains the import preview on save failure and permits a successful retry', async () => {
  const onSave = vi.fn().mockRejectedValueOnce(new Error('Storage full')).mockResolvedValueOnce(undefined);
  const view = render(
    <MantineProvider>
      <BackupSettings config={defaultConfig()} onSave={onSave} />
    </MantineProvider>
  );
  const file = new File([JSON.stringify(defaultConfig())], 'test.json', { type: 'application/json' });
  await act(async () => {
    fireEvent.change(view.container.querySelector('input[type=file]')!, { target: { files: [file] } });
    await new Promise((r) => setTimeout(r, 30));
  });
  await act(async () => {
    fireEvent.click(view.getByText(m.backup_apply_import()));
  });
  expect(view.queryByText(m.backup_imported())).toBeNull();
  expect(view.getByText(m.backup_save_failed({ error: 'Storage full' }))).toBeTruthy();
  await act(async () => {
    fireEvent.click(view.getByText(m.backup_apply_import()));
  });
  expect(view.getByText(m.backup_imported())).toBeTruthy();
  expect(onSave).toHaveBeenCalledTimes(2);
});
it('reports reset failure without claiming defaults were restored', async () => {
  const onSave = vi.fn().mockRejectedValue(new Error('Storage unavailable'));
  const view = render(
    <MantineProvider>
      <BackupSettings config={defaultConfig()} onSave={onSave} />
    </MantineProvider>
  );
  await act(async () => {
    fireEvent.click(view.getByText(m.backup_reset()));
  });
  await act(async () => {
    fireEvent.click(view.getByText(m.backup_reset_confirm()));
  });
  expect(view.queryByText(m.backup_reset_done())).toBeNull();
  expect(view.getByText(m.backup_save_failed({ error: 'Storage unavailable' }))).toBeTruthy();
});

it('keeps the most recently chosen file when earlier file reading finishes late', async () => {
  const onSave = vi.fn();
  const view = render(
    <MantineProvider>
      <BackupSettings config={defaultConfig()} onSave={onSave} />
    </MantineProvider>
  );
  let finish!: (text: string) => void;
  const old = new File([''], 'old.json');
  vi.spyOn(old, 'text').mockImplementation(
    () =>
      new Promise<string>((r) => {
        finish = r;
      })
  );
  const latest = { ...defaultConfig(), language: { ui: 'fr' as const } };
  const next = new File([JSON.stringify(latest)], 'latest.json');
  const input = view.container.querySelector('input[type=file]')!;
  await act(async () => {
    fireEvent.change(input, { target: { files: [old] } });
  });
  await act(async () => {
    fireEvent.change(input, { target: { files: [next] } });
    await new Promise((r) => setTimeout(r, 20));
  });
  await act(async () => {
    finish(JSON.stringify(defaultConfig()));
  });
  await act(async () => {
    fireEvent.click(view.getByText(m.backup_apply_import()));
  });
  expect(onSave.mock.calls[0][0].language.ui).toBe('fr');
});
