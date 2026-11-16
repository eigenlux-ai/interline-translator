import { fakeBrowser } from 'wxt/testing/fake-browser';
import { MantineProvider } from '@mantine/core';
import { act, cleanup, fireEvent, render, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { m } from '@/paraglide/messages';
import { defaultConfig } from '@/services/config/schema';
import GeneralSettings from './GeneralSettings';

vi.mock('@/react-app/managers/VisualManager/context', () => ({
  useVisual: () => ({ colorScheme: 'light', setColorScheme: vi.fn() }),
}));
vi.mock('@/services/detect/model', () => ({
  detectorStatus: async () => 'unavailable',
  downloadDetectorModel: vi.fn(),
}));
vi.mock('./StylePreview', () => ({ default: () => null, FontPreview: () => null }));
afterEach(cleanup);

it('lets a Dutch browser switch away from Dutch and select it again', async () => {
  vi.mocked(fakeBrowser.i18n.getUILanguage).mockReturnValue('nl-NL');
  const onPatch = vi.fn();
  const renderSettings = (target: string) => (
    <MantineProvider env="test">
      <GeneralSettings config={defaultConfig(target)} onPatch={onPatch} />
    </MantineProvider>
  );
  const view = render(renderSettings('nl'));
  await act(async () => fireEvent.click(view.getByRole('combobox', { name: m.settings_target_label() })));
  await act(async () =>
    fireEvent.click(
      within(view.getByRole('listbox', { name: m.settings_target_label() })).getByRole('option', {
        name: 'English',
      })
    )
  );
  expect(onPatch).toHaveBeenLastCalledWith({ translate: { ...defaultConfig('nl').translate, target: 'en' } });
  view.rerender(renderSettings('en'));
  await act(async () => fireEvent.click(view.getByRole('combobox', { name: m.settings_target_label() })));
  await act(async () =>
    fireEvent.click(
      within(view.getByRole('listbox', { name: m.settings_target_label() })).getByRole('option', {
        name: 'Nederlands',
      })
    )
  );
  expect(onPatch).toHaveBeenLastCalledWith({ translate: { ...defaultConfig('en').translate, target: 'nl' } });
});
