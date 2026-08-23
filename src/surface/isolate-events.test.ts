import { describe, expect, it } from 'vitest';
import { DEFAULT_ISOLATED_EVENTS, resolveIsolatedEvents } from './isolate-events';

describe('resolveIsolatedEvents', () => {
  it('false disables isolation', () => {
    expect(resolveIsolatedEvents(false)).toEqual([]);
  });

  it('true and undefined both fall back to the keyboard default', () => {
    expect(resolveIsolatedEvents(true)).toEqual(DEFAULT_ISOLATED_EVENTS);
    expect(resolveIsolatedEvents(undefined)).toEqual(DEFAULT_ISOLATED_EVENTS);
  });

  it('an explicit array is used verbatim', () => {
    expect(resolveIsolatedEvents(['pointerdown', 'click'])).toEqual(['pointerdown', 'click']);
  });

  it('default is the @webext-core keyboard set', () => {
    expect(DEFAULT_ISOLATED_EVENTS).toEqual(['keydown', 'keyup', 'keypress']);
  });
});
