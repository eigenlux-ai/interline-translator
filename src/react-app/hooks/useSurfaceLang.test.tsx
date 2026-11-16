// @vitest-environment happy-dom
import type { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SurfaceProvider } from '@/surface/context';
import { documentSurface } from '@/surface/document';
import { syncUiLocale, syncUiLocaleFrom } from '@/i18n';
import { useSurfaceLang } from './useSurfaceLang';

/**
 * `lang` must track the resolved UI locale, not the entrypoint HTML's literal:
 * the locale comes from config at runtime and can flip while the surface is
 * open, and a document surface's root IS `<html>`.
 */

const env = documentSurface();

function wrapper({ children }: PropsWithChildren) {
  return <SurfaceProvider env={env}>{children}</SurfaceProvider>;
}

describe('useSurfaceLang', () => {
  beforeEach(() => syncUiLocaleFrom(undefined));
  it('stamps English while config is loading', async () => {
    renderHook(() => useSurfaceLang(), { wrapper });
    await waitFor(() => expect(env.rootElement.getAttribute('lang')).toBe('en'));
  });

  it('re-stamps when the UI locale switches under an open surface', async () => {
    renderHook(() => useSurfaceLang(), { wrapper });
    await waitFor(() => expect(env.rootElement.getAttribute('lang')).toBe('en'));

    // The locale store notifies asynchronously (syncUiLocale runs in render
    // bodies), so poll rather than assume a single microtask.
    syncUiLocale('ar', 'en');
    await waitFor(() => expect(env.rootElement.getAttribute('lang')).toBe('ar'));
    syncUiLocale('auto', 'zh-Hans-HK');
    await waitFor(() => expect(env.rootElement.getAttribute('lang')).toBe('zh-CN'));
  });
});
