/**
 * The MAIN-world responder itself (the entrypoint next door is just its shell).
 *
 * It serves two ops for the isolated-world bridge:
 *
 *   - read  → the model text (+ 撤销 snapshot) of the editor owning the marked
 *     element; the isolated world's DOM read sees only the rendered viewport of
 *     virtualized editors like CodeMirror/Monaco — the model is the truth;
 *   - apply → replace the document, atomically guarded by `before` (see apply.ts).
 *
 * TRANSPORT. Both travel over a private MessagePort, offered in this script's
 * first task; after the isolated world acks it, this responder neither reads nor
 * writes `window` for the protocol again (dom/input/port-handshake explains why
 * the offer has to be that early; the registry's content-free attach signal is
 * the one window message this bundle still posts). The old design answered on
 * the window, which meant every page script heard the `apply` — i.e. the model's
 * completion, the one thing on this wire the page did NOT already own. There is
 * no `ping` op either: the handshake IS the availability answer, so this
 * responder is silent until a request arrives on its own channel.
 *
 * TARGETING. Only a node the isolated world marked with its 128-bit nonce is
 * ever touched, and an ambiguous mark is refused (see findMarked). What remains
 * out of reach is a page that impersonates the user's focused editor down to its
 * current text: everything a responder in the PAGE's realm can check, that realm
 * can also fake. The fix that matters is that harvesting now takes an active
 * impersonation instead of three lines of `window` listener.
 */

import { applyToEditor, readEditor } from '@/dom/input/main-world/apply';
import {
  asRichSnapshot,
  INJECT_ACK,
  INJECT_ATTR,
  INJECT_BYE,
  INJECT_HELLO,
  INJECT_PORT,
  INJECT_REQ,
  INJECT_RES,
  type InjectRequest,
  type InjectResponse,
  type InjectStatus,
  type RichSnapshot,
} from '@/dom/input/protocol';
import { installShadowRegistry, type ShadowRegistry } from './shadow-registry';

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

export function startResponder(): void {
  // Before any page script runs: the hook has to see the FIRST attachShadow.
  const registry = installShadowRegistry();
  /** Ports offered so far — normally one; a second only if a hello raced the first. */
  const ports = new Set<MessagePort>();
  let paired = false;

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
    window.removeEventListener('message', onWindowMessage);
    for (const port of ports) {
      port.onmessage = null;
      port.close();
    }
    ports.clear();
    registry.uninstall();
  };

  const onPortMessage = (port: MessagePort, e: MessageEvent) => {
    const key = (e.data as { __omni?: string } | null)?.__omni;

    if (key === INJECT_ACK) {
      // Paired. This is the port the isolated world kept, so the spares go and
      // `window` stops being read at all: the channel is now the whole protocol.
      paired = true;
      window.removeEventListener('message', onWindowMessage);
      for (const spare of ports) {
        if (spare === port) continue;
        spare.onmessage = null;
        spare.close();
        ports.delete(spare);
      }
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
    const channel = new MessageChannel();
    ports.add(channel.port1);
    channel.port1.onmessage = (e: MessageEvent) => onPortMessage(channel.port1, e);
    try {
      window.postMessage({ __omni: INJECT_PORT }, location.origin, [channel.port2]);
    } catch {
      // Opaque origin (sandboxed frame): postMessage(…, location.origin) throws
      // synchronously, so no isolated-world partner can ever be reached here.
      ports.delete(channel.port1);
      channel.port1.close();
    }
  };

  const onWindowMessage = (e: MessageEvent) => {
    if (paired || e.source !== window || e.origin !== location.origin) return;
    if ((e.data as { __omni?: string } | null)?.__omni !== INJECT_HELLO) return;
    // The isolated world missed the document_start offer (injection-order
    // surprise) and is asking for a replacement.
    offerPort();
  };

  window.addEventListener('message', onWindowMessage);
  offerPort();
}
