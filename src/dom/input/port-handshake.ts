/**
 * @module dom/input/port-handshake
 *
 * The isolated world's end of the editor-injector channel: ONE private
 * MessagePort, taken from the main-world responder at document_start.
 *
 * WHY a port. An `apply` request carries the model's TRANSLATION into the page
 * realm. Sent with `window.postMessage`, it is delivered to every listener in
 * the page — a prefilled `class="ProseMirror"` div plus three lines of script
 * is enough to harvest completions the user paid for with their own API key.
 * The page owns its editors' INPUT, which is why the old design was defensible
 * for `read`; it never had our OUTPUT.
 *
 * WHY document_start. A transferred port materialises in `MessageEvent.ports`,
 * and EVERY listener on the receiving window sees the same event — a handover
 * over `window` is only private if nothing hostile can be listening yet. The
 * responder therefore offers its port in its first task, before the page has
 * run a line of script, and this receiver must already be listening: hence its
 * own document_start entrypoint (`entrypoints/injector-port.content`), since
 * page-translate — where the bridge lives — only starts at document_idle.
 * `hello()` is the fallback for an injection-order surprise; it is the one path
 * where a page script could be listening, so it carries no text either: it asks
 * for a port and nothing more.
 *
 * WHY a window slot. Receiver and bridge live in different content-script
 * bundles, which share no module instance — but they do share the isolated
 * world's `window`, whose expandos live in the extension's own realm wrapper
 * and are invisible to the page (unlike the MAIN-world global this replaced).
 */

import { PROJECT_PREFIX } from '@/constants';
import { INJECT_ACK, INJECT_BYE, INJECT_HELLO, INJECT_PORT } from './protocol';

/** Isolated-realm handover slot (camel-cased prefix, like any other of our globals). */
const PORT_SLOT = `__${PROJECT_PREFIX.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())}InjectorPort`;

/** How long a late handshake waits for a replacement offer before giving up. */
const HELLO_TIMEOUT_MS = 400;

/** In-flight late handshake, shared by concurrent callers and cleared on settle. */
let pending: Promise<MessagePort | null> | null = null;

function slot(): Record<string, MessagePort | undefined> {
  return window as unknown as Record<string, MessagePort | undefined>;
}

/**
 * Take the port out of an offer, or null when the message isn't one. Idempotent
 * and first-offer-wins: a duplicate offer (the responder answered a hello whose
 * predecessor had already landed) is dropped and the held port returned, so the
 * two halves can never end up on different channels. Acking is what pairs us —
 * it tells the responder which port to keep and to stop reading `window`.
 */
function adopt(e: MessageEvent): MessagePort | null {
  if (e.source !== window || e.origin !== location.origin) return null;
  if ((e.data as { __omni?: string } | null)?.__omni !== INJECT_PORT) return null;
  const offered = e.ports?.[0];
  if (!offered) return null;
  const held = slot()[PORT_SLOT];
  if (held) return held;
  slot()[PORT_SLOT] = offered;
  offered.postMessage({ __omni: INJECT_ACK });
  return offered;
}

/**
 * Listen for the document_start offer. Called from the `injector-port`
 * entrypoint — the earliest isolated-world code this extension runs — and
 * one-shot: once a port is held, nothing on `window` interests us again.
 * Returns the listener teardown.
 */
export function receiveInjectorPortOffer(): () => void {
  const onOffer = (e: MessageEvent) => {
    if (adopt(e)) window.removeEventListener('message', onOffer);
  };
  window.addEventListener('message', onOffer);
  return () => window.removeEventListener('message', onOffer);
}

function hello(timeoutMs: number): Promise<MessagePort | null> {
  const { promise, resolve } = Promise.withResolvers<MessagePort | null>();

  const onOffer = (e: MessageEvent) => {
    const port = adopt(e);
    if (port) settle(port);
  };
  const timer = setTimeout(() => settle(null), timeoutMs);
  const settle = (port: MessagePort | null) => {
    window.removeEventListener('message', onOffer);
    clearTimeout(timer);
    resolve(port);
  };

  window.addEventListener('message', onOffer);
  try {
    window.postMessage({ __omni: INJECT_HELLO }, location.origin);
  } catch {
    // Opaque origin (sandboxed frame): postMessage(…, location.origin) throws
    // synchronously and no responder can be reached at all.
    settle(null);
  }
  return promise;
}

/**
 * The channel to the main world, or null when this page has no responder.
 *
 * ONLY SUCCESS IS REMEMBERED. The `ping` probe this replaces cached its own
 * 400ms timeout for the whole page lifetime, so one busy main thread at the
 * user's first gesture silently demoted every Slate/Lexical/CodeMirror/Monaco
 * field to the DOM path until reload. A failed handshake now costs exactly one
 * gesture: the next one asks again.
 */
export function injectorPort(timeoutMs = HELLO_TIMEOUT_MS): Promise<MessagePort | null> {
  const held = slot()[PORT_SLOT];
  if (held) return Promise.resolve(held);
  pending ??= hello(timeoutMs).finally(() => {
    pending = null;
  });
  return pending;
}

/**
 * Give the channel back on teardown (extension update, disable, uninstall): the
 * responder restores `Element.prototype.attachShadow` and drops its registry,
 * leaving the page realm as it was found. We deliberately do NOT close our end
 * — a close() racing our own BYE could strand it — the port is unreachable once
 * the slot is cleared and dies with the realm.
 */
export function closeInjectorPort(): void {
  const port = slot()[PORT_SLOT];
  if (!port) return;
  delete slot()[PORT_SLOT];
  try {
    port.postMessage({ __omni: INJECT_BYE });
  } catch {
    /* already torn down on the far side */
  }
}

/** TEST-ONLY: forget the held port and any in-flight handshake between cases. */
export function resetInjectorPortForTests(): void {
  delete slot()[PORT_SLOT];
  pending = null;
}
