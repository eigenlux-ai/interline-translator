/**
 * @module surface/focus-bridge
 *
 * Keeps Mantine's own focus handling working inside our shadow roots.
 *
 * Mantine manages focus through two things on `document`, and neither works
 * from inside a shadow surface or a satellite:
 *
 * 1. `keydown` listeners - `useFocusTrap` (Modal, Drawer, trapFocus
 *    Popover/Menu, FocusTrap) and `useFocusReturn`. Keys typed in our UI never
 *    get there: isolation stops them at the shadow root so host-page hotkeys
 *    stay quiet.
 * 2. `document.activeElement` - `useFocusReturn` (what to focus again when a
 *    Modal/Drawer/Popover closes), `use-mask`, Menu type-ahead, RangeSlider.
 *    Outside a shadow tree the browser reports the shadow HOST, never the
 *    focused element, so focus "returns" to the host (a no-op, focus ends up
 *    on <body>) and `input === document.activeElement` is never true.
 *
 * Rather than re-implement Mantine (which components trap, when, how Tab
 * wraps and where focus returns are private to it and carry no DOM marker),
 * the `document` object of THIS JS context - the content script's isolated
 * world; the host page's own `document` wrapper, listeners and
 * `activeElement` are untouched - is made to answer the way it would on a
 * normal page:
 *
 * - `document.addEventListener` / `removeEventListener` are wrapped.
 *   Bubble-phase `keydown` registrations are mirrored onto a private, detached
 *   element. A once callback is removed from both targets before invocation.
 *   At an isolating shadow root, a copy of each unhandled, non-composing
 *   Tab keydown is dispatched on the private target, and `preventDefault()`
 *   is carried back to the real event.
 * - `document.activeElement` gets an own accessor that takes the native value
 *   and, while it is the host of a shadow root bridged here, continues with
 *   that root's `activeElement` (nested bridged roots included; closed roots
 *   work, the reference is held here). Shadow roots that are not ours - the
 *   host page's components - are never entered, and with focus outside our
 *   roots the native value is returned as is.
 *
 * So exactly the traps Mantine considers active run, with Mantine's
 * algorithm, in Mantine's order, focus returns to the element Mantine
 * recorded - and the host page still sees nothing.
 *
 * Limits: only Tab is relayed (other keys stay fully isolated); listeners get
 * a copy whose `target` is the private element and `isTrusted` is false;
 * capture-phase document listeners are not mirrored (they already run before
 * the event enters the shadow tree). Any other code in this JS context that
 * reads `document.activeElement` sees the deep value too; `shadowRoot.activeElement`
 * and other documents (iframes) are unchanged.
 */

type Listener = EventListenerOrEventListenerObject | null;
type Options = boolean | AddEventListenerOptions | undefined;

let mirror: EventTarget | undefined;

const isCapture = (options: Options) => (typeof options === 'object' ? !!options?.capture : !!options);

function mirrorDocumentKeydown(): EventTarget {
  if (mirror) return mirror;
  // A detached element, not `new EventTarget()`: in a Firefox content script
  // listeners on a bare EventTarget are never called (verified in Firefox 157).
  const target = (mirror = document.createElement('div'));
  const add = document.addEventListener.bind(document);
  const remove = document.removeEventListener.bind(document);
  const mirrored = (type: string, options: Options) => type === 'keydown' && !isCapture(options);
  // Only bubble-phase keydown reaches this map, so the callback alone is the
  // DOM registration key. The first registration owns its once/passive/signal.
  const registrations = new WeakMap<EventListenerOrEventListenerObject, { signal?: AbortSignal; forget: () => void }>();
  document.addEventListener = (type: string, listener: Listener, options?: Options) => {
    if (!listener) return;
    if (!mirrored(type, options)) return add(type, listener, options);
    const { once, passive, signal } = typeof options === 'object' ? (options ?? {}) : {};
    if (signal?.aborted) return;
    const existing = registrations.get(listener);
    if (existing) {
      // The native signal has already removed both callbacks even if our
      // abort handler hasn't run yet (e.g. re-registering in an abort handler).
      if (!existing.signal?.aborted) return;
      existing.forget();
    }

    const wrapper: EventListener = (event) => {
      if (once) forget();
      if (typeof listener === 'function') listener.call(document, event);
      else listener.handleEvent(event);
    };
    const forget = () => {
      signal?.removeEventListener('abort', forget);
      registrations.delete(listener);
      if (once) remove(type, wrapper);
      target.removeEventListener(type, wrapper);
    };
    const shared = { passive, signal };
    // Keep the original identity for ordinary native dispatch: a listener
    // installed before bridging still deduplicates if it is registered again.
    add(type, once ? wrapper : listener, shared);
    target.addEventListener(type, wrapper, shared);
    registrations.set(listener, { signal, forget });
    signal?.addEventListener('abort', forget, { once: true });
  };
  document.removeEventListener = (type: string, listener: Listener, options?: Options) => {
    if (!listener) return;
    // Also honor removal of native listeners registered before the bridge.
    remove(type, listener, options);
    if (mirrored(type, options)) registrations.get(listener)?.forget();
  };
  return target;
}

const relayed = new WeakSet<ShadowRoot>();

function relayTabKeydown(shadowRoot: ShadowRoot): void {
  const target = mirrorDocumentKeydown();
  if (relayed.has(shadowRoot)) return;
  relayed.add(shadowRoot);
  shadowRoot.addEventListener('keydown', (event) => {
    const { key, code, shiftKey, ctrlKey, altKey, metaKey, repeat, isComposing } = event as KeyboardEvent;
    if (key !== 'Tab' || isComposing || event.defaultPrevented) return;
    const init = { key, code, shiftKey, ctrlKey, altKey, metaKey, repeat, cancelable: true };
    const copy = new KeyboardEvent('keydown', init);
    target.dispatchEvent(copy);
    if (copy.defaultPrevented) event.preventDefault();
  });
}

/** Our shadow roots by host element; the only ones `activeElement` enters. */
let bridgedRoots: WeakMap<Element, ShadowRoot> | undefined;

function deepenActiveElement(): WeakMap<Element, ShadowRoot> {
  if (bridgedRoots) return bridgedRoots;
  const roots = (bridgedRoots = new WeakMap());
  // Inherited (Document.prototype in browsers); looked up rather than named
  // so the shared prototype is neither assumed nor touched.
  let getter: (() => Element | null) | undefined;
  for (let proto: object | null = document; proto && !getter; proto = Object.getPrototypeOf(proto)) {
    getter = Object.getOwnPropertyDescriptor(proto, 'activeElement')?.get;
  }
  if (!getter) return roots;
  const native = getter;
  Object.defineProperty(document, 'activeElement', {
    configurable: true,
    enumerable: true,
    get() {
      let element = native.call(document);
      for (let inner; element && (inner = roots.get(element)?.activeElement); ) element = inner;
      return element;
    },
  });
  return roots;
}

export interface FocusBridgeOptions {
  /**
   * Set when `shadowRoot` stops `keydown` from propagating: Tab keydowns
   * reaching it are then delivered to this context's document keydown
   * listeners.
   */
  relayTab?: boolean;
}

/**
 * Make Mantine's document-level focus handling see into `shadowRoot`: this
 * context's `document.activeElement` resolves to the element focused inside
 * it, and with `relayTab` its Tab keydowns reach the document listeners. Call
 * it for every shadow root of ours, before the UI inside mounts (document
 * keydown listeners registered before the first `relayTab` call are not
 * known). Idempotent per shadow root.
 */
export function bridgeFocus(shadowRoot: ShadowRoot, { relayTab = false }: FocusBridgeOptions = {}): void {
  deepenActiveElement().set(shadowRoot.host, shadowRoot);
  if (relayTab) relayTabKeydown(shadowRoot);
}
