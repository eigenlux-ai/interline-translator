// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { anyShadowRoot } from './shadow';

type ChromeStub = { chrome?: { dom?: { openOrClosedShadowRoot?: (el: Element) => ShadowRoot | null } } };
const g = globalThis as ChromeStub;

afterEach(() => {
  delete g.chrome;
});

describe('anyShadowRoot — three-tier closed-root probe', () => {
  it('returns an OPEN root via the standard property', () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'open' });
    expect(anyShadowRoot(host)).toBe(root);
  });

  it('falls back to chrome.dom for a CLOSED root (Chromium content scripts)', () => {
    const host = document.createElement('div');
    const root = host.attachShadow({ mode: 'closed' });
    expect(host.shadowRoot).toBeNull(); // closed — invisible to the standard property
    expect(anyShadowRoot(host)).toBeNull(); // no privileged API in this env
    g.chrome = { dom: { openOrClosedShadowRoot: (el) => (el === host ? root : null) } };
    expect(anyShadowRoot(host)).toBe(root);
  });

  it("uses Firefox's element property when present", () => {
    const host = document.createElement('div') as Element & { openOrClosedShadowRoot?: ShadowRoot };
    const root = host.attachShadow({ mode: 'closed' });
    host.openOrClosedShadowRoot = root;
    expect(anyShadowRoot(host)).toBe(root);
  });

  it('a throwing chrome.dom (detached/foreign element) degrades to null', () => {
    g.chrome = {
      dom: {
        openOrClosedShadowRoot: () => {
          throw new Error('invalid');
        },
      },
    };
    expect(anyShadowRoot(document.createElement('div'))).toBeNull();
  });
});

describe('getDeepActiveElement — closed-root descent (via anyShadowRoot)', () => {
  it('descends into a closed root when the probe API exposes it', async () => {
    const { getDeepActiveElement } = await import('./input/active-element');
    const host = document.createElement('div');
    document.body.appendChild(host);
    const root = host.attachShadow({ mode: 'closed' });
    const input = document.createElement('input');
    root.appendChild(input);
    input.focus();
    // Without the probe the descent stops at the host…
    expect(getDeepActiveElement()).toBe(host);
    // …with chrome.dom it reaches the real editable.
    g.chrome = { dom: { openOrClosedShadowRoot: (el) => (el === host ? root : null) } };
    expect(getDeepActiveElement()).toBe(input);
    host.remove();
  });
});
