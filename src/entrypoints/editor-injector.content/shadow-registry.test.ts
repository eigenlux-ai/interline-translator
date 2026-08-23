import { afterEach, describe, expect, it, vi } from 'vitest';
import { PROJECT_PREFIX, SHADOW_ATTACH_SIGNAL } from '@/constants';
import { installShadowRegistry, MAX_SHADOW_ROOTS, type ShadowRegistry } from './shadow-registry';

/** Our whole window namespace, and the exact global the standalone hook published. */
const OUR_GLOBALS = `__${PROJECT_PREFIX.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())}`;
const LEGACY_GLOBAL = `${OUR_GLOBALS}ShadowRoots`;

/** Captured before anything installs: the identity `uninstall()` has to restore. */
const NATIVE_ATTACH_SHADOW = Element.prototype.attachShadow;

let registry: ShadowRegistry | null = null;

afterEach(() => {
  registry?.uninstall();
  registry = null;
  Element.prototype.attachShadow = NATIVE_ATTACH_SHADOW;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
  vi.useRealTimers();
});

function attachClosedRoot(): ShadowRoot {
  const host = document.createElement('div');
  document.body.append(host);
  return host.attachShadow({ mode: 'closed' });
}

describe('installShadowRegistry', () => {
  it('keeps closed roots reachable for the responder and unreachable by name', () => {
    registry = installShadowRegistry();
    const root = attachClosedRoot();

    expect(registry.roots()).toContain(root);
    // The old design published this as a window function, so any ad, third-party
    // tag or XSS payload could list the page's CLOSED roots.
    expect((window as unknown as Record<string, unknown>)[LEGACY_GLOBAL]).toBeUndefined();
    expect(Object.getOwnPropertyNames(window).filter((key) => key.startsWith(OUR_GLOBALS))).toEqual([]);
  });

  it('leaves no extension source in the patched method (no toString fingerprint)', () => {
    registry = installShadowRegistry();
    const source = Function.prototype.toString.call(Element.prototype.attachShadow);

    expect(source).toContain('[native code]');
    expect(source).not.toContain('WeakRef');
    expect(source).not.toContain('postMessage');
    expect(Element.prototype.attachShadow.name).toBe('attachShadow');
  });

  it('bounds the registry — a root-churning SPA cannot grow it without limit', () => {
    registry = installShadowRegistry();
    // Strong refs on purpose: nothing here is collectable, so only the cap can
    // stop the array. Pre-fix this pushed one entry per attach, forever.
    const alive: ShadowRoot[] = [];
    for (let i = 0; i < MAX_SHADOW_ROOTS + 40; i++) alive.push(attachClosedRoot());

    const listed = registry.roots();
    expect(listed.length).toBe(MAX_SHADOW_ROOTS);
    // Newest wins: the root the user just focused into is the one a request needs.
    expect(listed[0]).toBe(alive[alive.length - 1]);
    expect(listed).not.toContain(alive[0]);
  });

  it('restores the original method on uninstall (teardown leaves the realm as found)', () => {
    registry = installShadowRegistry();
    expect(Element.prototype.attachShadow).not.toBe(NATIVE_ATTACH_SHADOW);

    registry.uninstall();
    registry = null;
    expect(Element.prototype.attachShadow).toBe(NATIVE_ATTACH_SHADOW);
  });

  it('leaves a wrapper that someone else put on top of ours alone', () => {
    registry = installShadowRegistry();
    const ours = Element.prototype.attachShadow;
    const theirs: typeof Element.prototype.attachShadow = function attachShadow(this: Element, init: ShadowRootInit) {
      return ours.call(this, init);
    };
    Element.prototype.attachShadow = theirs;

    registry.uninstall();
    registry = null;
    // Assigning `orig` here would have deleted their wrapper with ours.
    expect(Element.prototype.attachShadow).toBe(theirs);
  });

  it('hands over on re-injection instead of nesting wrappers', () => {
    const stale = installShadowRegistry();
    const staleWrapper = Element.prototype.attachShadow;
    registry = installShadowRegistry();
    expect(Element.prototype.attachShadow).not.toBe(staleWrapper);

    const root = attachClosedRoot();
    expect(registry.roots()).toContain(root);
    expect(stale.roots()).toEqual([]);

    // The live instance unwraps to the NATIVE method — a nested wrapper would
    // have left the stale one patched in forever.
    registry.uninstall();
    registry = null;
    expect(Element.prototype.attachShadow).toBe(NATIVE_ATTACH_SHADOW);
  });

  it('posts one throttled, content-free attach signal per window', async () => {
    vi.useFakeTimers();
    registry = installShadowRegistry();
    const posted = vi.spyOn(window, 'postMessage');

    attachClosedRoot();
    attachClosedRoot();
    attachClosedRoot();
    expect(posted).not.toHaveBeenCalled(); // trailing, not per-attach
    await vi.advanceTimersByTimeAsync(100);

    expect(posted).toHaveBeenCalledTimes(1);
    const [message, targetOrigin] = posted.mock.calls[0];
    // Content-free, and never '*': a broadcast target would leak "this user runs
    // a translator" to every embedded frame.
    expect(message).toEqual({ source: SHADOW_ATTACH_SIGNAL });
    expect(targetOrigin).toBe(location.origin);
  });
});
