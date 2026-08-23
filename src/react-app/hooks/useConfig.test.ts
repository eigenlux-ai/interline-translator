// @vitest-environment happy-dom
import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { getConfig } from '@/services/config/storage';
import { defaultConfig } from '@/services/config/schema';
import { useConfig } from './useConfig';

/**
 * The write protocol under keystroke bursts (the settings forms save on every
 * keystroke). Runs against fake-browser storage, whose onChanged also fires in
 * the writing context — exactly the echo the hook must not roll back on.
 */

describe('useConfig', () => {
  it('loads the persisted config on mount', async () => {
    const { result } = renderHook(() => useConfig());
    await waitFor(() => expect(result.current.config).not.toBeNull());
    expect(result.current.config!.translate.target).toBe(defaultConfig().translate.target);
  });

  it('patch merges against the LATEST local state — same-tick patches stack', async () => {
    const { result } = renderHook(() => useConfig());
    await waitFor(() => expect(result.current.config).not.toBeNull());

    await act(async () => {
      // Two patches in the same tick: the second must merge with the first,
      // not overwrite with the stale render-time snapshot.
      void result.current.patch({ translate: { ...result.current.config!.translate, target: 'fr' } });
      void result.current.patch({ inputTranslation: { ...result.current.config!.inputTranslation, enabled: false } });
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.config!.translate.target).toBe('fr'); // first patch survived
    expect(result.current.config!.inputTranslation.enabled).toBe(false);
    const persisted = await getConfig();
    expect(persisted.translate.target).toBe('fr');
    expect(persisted.inputTranslation.enabled).toBe(false);
  });

  it('a rapid save burst never rolls the UI back to an older value (echo suppression)', async () => {
    const { result } = renderHook(() => useConfig());
    await waitFor(() => expect(result.current.config).not.toBeNull());
    const base = result.current.config!;

    await act(async () => {
      // Simulate typing "abc" into a per-keystroke-saving field: three writes,
      // no awaits between them. Watch echoes of write 1/2 arrive while write 3
      // is optimistic — applying one would revert the input text.
      void result.current.save({ ...base, translate: { ...base.translate, target: 'a' } });
      void result.current.save({ ...base, translate: { ...base.translate, target: 'ab' } });
      void result.current.save({ ...base, translate: { ...base.translate, target: 'abc' } });
      await new Promise((r) => setTimeout(r, 80));
    });

    expect(result.current.config!.translate.target).toBe('abc');
    expect((await getConfig()).translate.target).toBe('abc'); // storage got the last write
  });
});
