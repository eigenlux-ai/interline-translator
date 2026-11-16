/**
 * The MAIN-world responder itself (the entrypoint next door is just its shell).
 *
 * It serves two ops for the isolated-world bridge:
 *
 *   - read  → the model text (+ undo snapshot) of the editor owning the marked
 *     element; the isolated world's DOM read sees only the rendered viewport of
 *     virtualized editors like CodeMirror/Monaco — the model is the truth;
 *   - apply → replace the document, atomically guarded by `before` (see apply.ts).
 *
 * TRANSPORT. Editor data stays on a dedicated MessagePort. Window messages
 * carry only offers and reconnect requests. Early and late injections share
 * a resume callback, never the ports or shadow-root registry. The page owns
 * this realm, so the transport cannot authenticate the page's editor state.
 *
 * TARGETING. Only a node the isolated world marked with its 128-bit nonce is
 * ever touched, and an ambiguous mark is refused (see findMarked). What remains
 * out of reach is a page that impersonates the user's focused editor down to its
 * current text: everything a responder in the PAGE's realm can check, that realm
 * can also fake. The fix that matters is that harvesting now takes an active
 * impersonation instead of three lines of `window` listener.
 */

import { PROJECT_PREFIX } from '@/constants';
import { watchDocumentRoot } from '@/dom/document-root';
import { applyToEditor, readEditor } from '@/dom/input/main-world/apply';
import { editorMessageOrigin } from '@/dom/input/message-origin';
import {
  asRichSnapshot,
  INJECT_ACK,
  INJECT_ATTR,
  INJECT_BYE,
  INJECT_HELLO,
  INJECT_PING,
  INJECT_PONG,
  INJECT_PORT,
  INJECT_REQ,
  INJECT_RES,
  type InjectRequest,
  type InjectResponse,
  type InjectStatus,
  type RichSnapshot,
} from '@/dom/input/protocol';
import { installShadowRegistry, type ShadowRegistry } from './shadow-registry';

const RESUME_SLOT = Symbol.for(`${PROJECT_PREFIX}:editor-responder`);
const OFFER_TIMEOUT_MS = 3000;
const MAX_PENDING_OFFERS = 2;

/** The deepest active element, descending through open AND registry-known closed roots. */
function deepActiveElement(registry: ShadowRegistry): Element | null {
  let el: Element | null = document.activeElement;
  for (;;) {
    let inner: Element | null = el?.shadowRoot?.activeElement ?? null;
    if (!inner && el) inner = registry.roots().find((r) => r.host === el)?.activeElement ?? null;
    if (!inner) return el;
    el = inner;
  }
}

/** Gate for the expensive whole-tree scan — real requests resolve via focus. */
let lastDeepScan = 0;

/**
 * Find the marked node. Fast path: the target is by construction the focused
 * editable, so the deep activeElement (or an ancestor) carries the attribute.
 *
 * TWO CLAIMANTS MEAN MISS. The isolated world marks exactly one node per
 * request, but the marker is plain host DOM: a page watching its own attributes
 * can copy the nonce onto a node of its own before the request lands. A second
 * claimant is therefore a decoy, and writing into it would hand the model's
 * output to the page — so we resolve nothing and the caller degrades to the DOM
 * path (the safe direction: show the original, never leak the translation).
 *
 * The exhaustive shadow-piercing scan stays a rate-limited last resort — it is
 * O(page size) and an editor remount can fire several requests in a row.
 */
function findMarked(id: string, registry: ShadowRegistry): Element | null {
  const selector = `[${INJECT_ATTR}="${CSS.escape(id)}"]`;
  const claims = document.querySelectorAll(selector);
  if (claims.length > 1) return null;

  const active = deepActiveElement(registry);
  const focused = active?.closest?.(selector);
  if (focused) return focused;

  if (claims.length === 1) return claims[0];

  const now = Date.now();
  if (now - lastDeepScan < 300) return null;
  lastDeepScan = now;
  // Seed with the registry too — the shadowRoot-walk below only sees open roots,
  // and the marked editable may live inside a closed one.
  const roots: (Document | ShadowRoot)[] = [document, ...registry.roots()];
  while (roots.length) {
    const root = roots.pop()!;
    const hit = root.querySelector(selector);
    if (hit) return hit;
    root.querySelectorAll('*').forEach((n) => {
      const sr = (n as HTMLElement).shadowRoot;
      if (sr) roots.push(sr);
    });
  }
  return null;
}

export function startResponder(): (() => void) | undefined {
  const origin = editorMessageOrigin();
  if (!origin) return;
  const slots = window as unknown as Record<symbol, unknown>;
  const previous = slots[RESUME_SLOT];
  if (typeof previous === 'function') {
    previous();
    return;
  }
  // Before any page script runs: the hook has to see the FIRST attachShadow.
  const registry = installShadowRegistry();
  const ports = new Map<MessagePort, ReturnType<typeof setTimeout> | null>();
  let active: MessagePort | null = null;
  let disposed = false;

  const closePort = (port: MessagePort) => {
    const timer = ports.get(port);
    if (timer) clearTimeout(timer);
    ports.delete(port);
    port.onmessage = null;
    port.close();
  };

  const serve = (port: MessagePort, req: InjectRequest) => {
    const reply = (status: InjectStatus, text?: string, rich?: RichSnapshot) => {
      const res: InjectResponse = {
        __omni: INJECT_RES,
        id: req.id,
        status,
        ...(text !== undefined ? { text } : {}),
        ...(rich !== undefined ? { rich } : {}),
      };
      try {
        port.postMessage(res);
      } catch {
        /* channel gone (isolated world torn down) — the bridge's timeout covers us */
      }
    };

    const el = findMarked(req.id, registry);
    if (!el) {
      reply('miss');
      return;
    }

    if (req.op === 'read') {
      const model = readEditor(el);
      if (!model) reply('miss');
      else reply('ok', model.text, model.rich);
      return;
    }

    // asRichSnapshot, not a cast: `rich` is handed to an editor's own HTML/state
    // parser, so it gets shape-checked at the boundary rather than reaching one
    // as `undefined.data` after any drift on the wire.
    applyToEditor(
      el,
      String(req.text ?? ''),
      typeof req.before === 'string' ? req.before : undefined,
      asRichSnapshot(req.rich)
    )
      .then((outcome) => reply(outcome))
      .catch(() => reply('miss'));
  };

  const teardown = () => {
    if (disposed) return;
    disposed = true;
    stopWatchingRoot();
    window.removeEventListener('message', onWindowMessage);
    for (const port of ports.keys()) closePort(port);
    active = null;
    registry.uninstall();
    if (slots[RESUME_SLOT] === resume) delete slots[RESUME_SLOT];
  };

  const onPortMessage = (port: MessagePort, e: MessageEvent) => {
    const key = (e.data as { __omni?: string } | null)?.__omni;

    if (key === INJECT_ACK) {
      if (!ports.has(port)) return;
      active = port;
      const timer = ports.get(port);
      if (timer) clearTimeout(timer);
      ports.set(port, null);
      // An unacknowledged reconnect offer never interrupts a healthy channel.
      for (const spare of ports.keys()) if (spare !== port) closePort(spare);
      return;
    }
    if (port !== active) return;
    if (key === INJECT_PING) {
      if (typeof e.data.id === 'string') port.postMessage({ __omni: INJECT_PONG, id: e.data.id });
      return;
    }
    if (key === INJECT_BYE) {
      teardown();
      return;
    }
    if (key !== INJECT_REQ) return;

    const req = e.data as Partial<InjectRequest>;
    if (typeof req.id !== 'string' || (req.op !== 'read' && req.op !== 'apply')) return;
    serve(port, req as InjectRequest);
  };

  const offerPort = () => {
    // Page messages can be noisy. Bound both unanswered ports and their timers.
    const pending = [...ports.keys()].filter((port) => port !== active);
    while (pending.length >= MAX_PENDING_OFFERS) closePort(pending.shift()!);
    const channel = new MessageChannel();
    ports.set(
      channel.port1,
      setTimeout(() => closePort(channel.port1), OFFER_TIMEOUT_MS)
    );
    channel.port1.onmessage = (e: MessageEvent) => onPortMessage(channel.port1, e);
    try {
      window.postMessage({ __omni: INJECT_PORT }, origin, [channel.port2]);
    } catch {
      closePort(channel.port1);
      channel.port2.close();
    }
  };

  const onWindowMessage = (e: MessageEvent) => {
    if (disposed || e.source !== window || e.origin !== origin) return;
    if ((e.data as { __omni?: string } | null)?.__omni !== INJECT_HELLO) return;
    offerPort();
  };

  const resume = () => {
    if (disposed) return;
    // addEventListener is idempotent for this callback, and reattaches it if
    // document.open() erased the window's listeners.
    window.addEventListener('message', onWindowMessage);
    if (!active) offerPort();
  };
  const stopWatchingRoot = watchDocumentRoot(resume);
  // Only a resume function is shared across bundles. It grants no access to
  // ports, editor operations or collected closed roots.
  Object.defineProperty(slots, RESUME_SLOT, { value: resume, configurable: true });
  resume();
  return teardown;
}
