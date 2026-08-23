import { describe, expect, it, vi } from 'vitest';
import {
  emitPageTranslationState,
  onPageTranslationState,
  onPageTranslationStateQuery,
  onSetPageTranslation,
  requestPageTranslationState,
  requestSetPageTranslation,
} from './page-translation-bridge';

describe('page-translation-bridge', () => {
  it('delivers ball → owner set requests with the boolean intact', () => {
    const cb = vi.fn();
    const off = onSetPageTranslation(cb);
    requestSetPageTranslation(true);
    requestSetPageTranslation(false);
    off();
    expect(cb.mock.calls).toEqual([[true], [false]]);
  });

  it('delivers ball → owner state queries', () => {
    const cb = vi.fn();
    const off = onPageTranslationStateQuery(cb);
    requestPageTranslationState();
    off();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('delivers owner → ball state broadcasts with the boolean intact', () => {
    const cb = vi.fn();
    const off = onPageTranslationState(cb);
    emitPageTranslationState(true);
    emitPageTranslationState(false);
    off();
    expect(cb.mock.calls).toEqual([[true], [false]]);
  });

  it('round-trips a mount-time query: ball asks, owner answers, ball renders', () => {
    // The owner answers a query by broadcasting its current state.
    let ownerActive = true;
    const offQuery = onPageTranslationStateQuery(() => emitPageTranslationState(ownerActive));
    const seen = vi.fn();
    const offState = onPageTranslationState(seen);

    requestPageTranslationState();
    expect(seen).toHaveBeenLastCalledWith(true);

    ownerActive = false;
    requestPageTranslationState();
    expect(seen).toHaveBeenLastCalledWith(false);

    offQuery();
    offState();
  });

  it('stops delivering after unsubscribe', () => {
    const cb = vi.fn();
    const off = onSetPageTranslation(cb);
    off();
    requestSetPageTranslation(true);
    expect(cb).not.toHaveBeenCalled();
  });

  it('does not cross-wire channels (a set request is not a state broadcast)', () => {
    const stateCb = vi.fn();
    const off = onPageTranslationState(stateCb);
    requestSetPageTranslation(true);
    off();
    expect(stateCb).not.toHaveBeenCalled();
  });
});
