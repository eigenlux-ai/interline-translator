import { fakeBrowser } from 'wxt/testing';
import { beforeEach } from 'vitest';

// Reset the in-memory extension APIs (storage, etc.) between tests so storage
// state and onChanged listeners never leak across cases.
beforeEach(() => {
  fakeBrowser.reset();
});

/**
 * happy-dom MutationObserver keep-alive — the ROOT-CAUSE fix for the flaky
 * MutationObserver-driven tests (first found in dom/page-translation).
 *
 * happy-dom (20.x) files each MutationObserver's record-dispatch callback as a
 * `WeakRef` over an anonymous closure that NOTHING holds strongly
 * (MutationObserverListener: `callback: new WeakRef((record) => this.report(record))`).
 * The moment a major GC runs, `callback.deref()` goes undefined and
 * `Node[reportMutation]` silently SPLICES that listener out — from then on the
 * observer receives no records at all, and `observeMutations` stops propagating
 * it to nodes inserted later. No error, no warning: the test's next
 * MutationObserver-driven wait simply never completes and vitest times it out.
 * The flake signature is exact: random subsets of MO-driven tests hanging one
 * timeout each, green in isolation where no major GC lands mid-test,
 * uncorrelated with CPU load (GC is allocation-driven).
 *
 * Fix: swap `WeakRef` for a strong-ref shim ONLY while `observe()` constructs
 * that one callback, so exactly the mutation-dispatch closures are pinned for
 * the lifetime of their observer. Real browsers (production) implement
 * MutationObserver natively and are unaffected; this is test-infra only.
 */
class PinnedRef<T> {
  constructor(private readonly value: T) {}
  deref(): T {
    return this.value;
  }
}
const happyDomObserve = MutationObserver.prototype.observe;
MutationObserver.prototype.observe = function (target: Node, options?: MutationObserverInit): void {
  const RealWeakRef = globalThis.WeakRef;
  (globalThis as unknown as { WeakRef: unknown }).WeakRef = PinnedRef;
  try {
    happyDomObserve.call(this, target, options as MutationObserverInit);
  } finally {
    (globalThis as unknown as { WeakRef: unknown }).WeakRef = RealWeakRef;
  }
};
