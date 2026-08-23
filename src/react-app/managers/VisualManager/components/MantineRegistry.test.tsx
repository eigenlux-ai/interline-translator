// @vitest-environment happy-dom
/* eslint-disable no-restricted-syntax --
   This test PLAYS THE HOST PAGE (repaints body, inspects head/html) to assert
   the exact discipline the lint rule enforces: the surface must not touch the
   host document. The assertions need direct host access to prove that. */
import { useDirection } from '@mantine/core';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { SurfaceProvider } from '@/surface/context';
import type { SurfaceEnv } from '@/surface/defs';
import { SURFACE_ROOT_CLASS } from '@/constants';
import { syncUiLocale } from '@/i18n';
import MantineRegistry from './MantineRegistry';

/**
 * follow-host: a HOST theme switch must re-skin the mounted surface LIVE, and
 * the re-pin must stay inside our own root. The second half is the project's
 * host-isolation red line — Mantine reacting to a forceColorScheme change may
 * only write our rootElement's data attribute, never touch the host's <head>
 * or <html>. Pinned as a test so a Mantine upgrade can't silently regress it.
 */

function makeShadowEnv(): SurfaceEnv {
  const rootElement = document.createElement('div');
  rootElement.className = SURFACE_ROOT_CLASS;
  document.body.appendChild(rootElement);
  return { kind: 'shadow', rootElement, portalTarget: rootElement, scale: 1, colorSchemeStrategy: 'follow-host' };
}

const settle = async () => {
  await Promise.resolve();
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
};

afterEach(() => {
  cleanup();
  document.body.style.backgroundColor = '';
  document.documentElement.removeAttribute('dir');
  document.querySelectorAll(`.${SURFACE_ROOT_CLASS}`).forEach((el) => el.remove());
  syncUiLocale('zh', 'zh-CN'); // module-level locale: don't leak into the next test
});

describe('MantineRegistry follow-host', () => {
  it('re-pins the scheme when the host flips its theme, without touching the host document', async () => {
    document.body.style.backgroundColor = 'rgb(250, 246, 238)'; // host starts light
    const env = makeShadowEnv();
    render(
      <SurfaceProvider env={env}>
        <MantineRegistry colorScheme="light" primaryColor="cinnabar">
          <span>ui</span>
        </MantineRegistry>
      </SurfaceProvider>
    );
    await waitFor(() => expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('light'));

    // Snapshot the HOST document after mount — the flip below must not add,
    // remove, or rewrite anything here (html attributes, head children).
    const htmlAttrs = document.documentElement.outerHTML.slice(0, document.documentElement.outerHTML.indexOf('>') + 1);
    const headBefore = document.head.innerHTML;

    // The host flips its own theme switch (style-attribute repaint on body).
    await act(async () => {
      document.body.style.backgroundColor = 'rgb(18, 18, 18)';
      await settle();
    });

    await waitFor(() => expect(env.rootElement.getAttribute('data-mantine-color-scheme')).toBe('dark'));
    expect(document.head.innerHTML).toBe(headBefore);
    expect(document.documentElement.outerHTML.slice(0, document.documentElement.outerHTML.indexOf('>') + 1)).toBe(
      htmlAttrs
    );
  });
});

/**
 * Text direction is a property of the UI LOCALE, not a stored preference: the
 * Arabic interface must render rtl, and must follow a runtime locale switch
 * (the locale tracks `translate.target`). The host document must stay clean —
 * Mantine's own DirectionProvider would seed from, and write to, the host's
 * <html dir>, which is why this surface provides the context itself.
 */
describe('MantineRegistry direction', () => {
  function DirProbe() {
    return <span data-testid="dir">{useDirection().dir}</span>;
  }

  const mount = (env: SurfaceEnv) =>
    render(
      <SurfaceProvider env={env}>
        <MantineRegistry colorScheme="light" primaryColor="cinnabar">
          <DirProbe />
        </MantineRegistry>
      </SurfaceProvider>
    );

  it('resolves rtl for an Arabic UI locale and ltr for the others', async () => {
    syncUiLocale('ar', 'ar');
    const env = makeShadowEnv();
    const { getByTestId } = mount(env);
    await waitFor(() => expect(env.rootElement.getAttribute('dir')).toBe('rtl'));
    expect(getByTestId('dir').textContent).toBe('rtl');

    for (const locale of ['zh', 'en'] as const) {
      cleanup();
      syncUiLocale(locale, locale);
      const ltrEnv = makeShadowEnv();
      const ltr = mount(ltrEnv);
      await waitFor(() => expect(ltrEnv.rootElement.getAttribute('dir')).toBe('ltr'));
      expect(ltr.getByTestId('dir').textContent).toBe('ltr');
    }
  });

  it('follows a runtime locale switch, and leaves the host document alone', async () => {
    syncUiLocale('en', 'en');
    const env = makeShadowEnv();
    const { getByTestId } = mount(env);
    await waitFor(() => expect(env.rootElement.getAttribute('dir')).toBe('ltr'));

    // The user pins Arabic (or retargets translation to it) while mounted.
    await act(async () => {
      syncUiLocale('ar', 'en');
      await settle();
    });

    await waitFor(() => expect(getByTestId('dir').textContent).toBe('rtl'));
    expect(env.rootElement.getAttribute('dir')).toBe('rtl');
    expect(document.documentElement.hasAttribute('dir')).toBe(false);
  });
});
