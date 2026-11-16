/**
 * Shared isolated-world channel state. Early receiver and lazy editor bridge
 * are separate bundles; a window slot lets them share one port and one attempt.
 * Only handshakes use window messages. A port is a transport, not a security
 * boundary against the page that owns the MAIN-world editor.
 */
import { randomId } from '@/core/uid';
import { PROJECT_PREFIX } from '@/constants';
import { editorMessageOrigin } from './message-origin';
import { INJECT_ACK, INJECT_BYE, INJECT_HELLO, INJECT_PING, INJECT_PONG, INJECT_PORT } from './protocol';

const STATE_SLOT = `__${PROJECT_PREFIX.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())}InjectorChannel`;
const HELLO_TIMEOUT_MS = 400;
const CACHED_PORT_PROBE_MS = 150;
/** A timer this overdue means the shared main thread was blocked, not the port. */
const BLOCKED_THREAD_MS = 20;
const BLOCKED_THREAD_GRACE_MS = 60;

interface ChannelState {
  port?: MessagePort;
  pending?: Promise<MessagePort | null>;
  cancel?: () => void;
  generation: number;
}

function slots(): Record<string, ChannelState | undefined> {
  return window as unknown as Record<string, ChannelState | undefined>;
}
function state(): ChannelState {
  return (slots()[STATE_SLOT] ??= { generation: 0 });
}

function adopt(e: MessageEvent, current: ChannelState): MessagePort | null {
  const origin = editorMessageOrigin();
  if (!origin || e.source !== window || e.origin !== origin) return null;
  if ((e.data as { __omni?: string } | null)?.__omni !== INJECT_PORT) return null;
  const offered = e.ports?.[0];
  if (!offered) return null;
  if (current.port) {
    if (current.port !== offered) offered.close();
    return current.port;
  }
  try {
    offered.postMessage({ __omni: INJECT_ACK });
    current.port = offered;
    return offered;
  } catch {
    offered.close();
    return null;
  }
}

/** Register the early receiver. Lazy callers can recover even if this listener is erased. */
export function receiveInjectorPortOffer(): () => void {
  const current = state();
  const generation = current.generation;
  const onOffer = (e: MessageEvent) => {
    if (current.generation !== generation) {
      window.removeEventListener('message', onOffer);
      return;
    }
    if (adopt(e, current)) window.removeEventListener('message', onOffer);
  };
  window.addEventListener('message', onOffer);
  return () => window.removeEventListener('message', onOffer);
}

function hello(current: ChannelState, timeoutMs: number): Promise<MessagePort | null> {
  const origin = editorMessageOrigin();
  if (!origin || timeoutMs <= 0) return Promise.resolve(null);
  return new Promise((resolve) => {
    const finish = (port: MessagePort | null) => {
      clearTimeout(timer);
      window.removeEventListener('message', onOffer);
      if (current.cancel === cancel) current.cancel = undefined;
      resolve(port);
    };
    const cancel = () => finish(null);
    const onOffer = (e: MessageEvent) => {
      const port = adopt(e, current);
      if (port) finish(port);
    };
    const timer = setTimeout(cancel, timeoutMs);
    current.cancel = cancel;
    window.addEventListener('message', onOffer);
    try {
      window.postMessage({ __omni: INJECT_HELLO }, origin);
    } catch {
      cancel();
    }
  });
}

function probe(current: ChannelState, port: MessagePort, timeoutMs: number): Promise<boolean> {
  if (timeoutMs <= 0) return Promise.resolve(false);
  return new Promise((resolve) => {
    const id = randomId();
    const started = Date.now();
    const finish = (alive: boolean) => {
      clearTimeout(timer);
      port.removeEventListener('message', onMessage);
      if (current.cancel === cancel) current.cancel = undefined;
      resolve(alive);
    };
    const cancel = () => finish(false);
    const onMessage = (e: MessageEvent) => {
      if (e.data?.__omni === INJECT_PONG && e.data.id === id) finish(true);
    };
    // PING and PONG are two tasks on the page's main thread. When an editor's
    // own key handling blocks that thread, the expired timer can run between
    // them and condemn a healthy port. Let already-queued replies drain first.
    const expire = () => {
      const blocked = Date.now() - started - timeoutMs > BLOCKED_THREAD_MS;
      timer = setTimeout(cancel, blocked ? BLOCKED_THREAD_GRACE_MS : 0);
    };
    let timer = setTimeout(expire, timeoutMs);
    current.cancel = cancel;
    port.addEventListener('message', onMessage);
    try {
      port.start();
      port.postMessage({ __omni: INJECT_PING, id });
    } catch {
      cancel();
    }
  });
}

/** A late failure from an old request must never evict a newer connection. */
export function invalidateInjectorPort(port: MessagePort): void {
  const current = state();
  if (current.port !== port) return;
  current.port = undefined;
  port.close();
}

/** One bounded attempt per window; successes are checked, failures are never cached. */
export function injectorPort(timeoutMs = HELLO_TIMEOUT_MS): Promise<MessagePort | null> {
  if (!editorMessageOrigin()) return Promise.resolve(null);
  const current = state();
  if (current.pending) return current.pending;
  const generation = current.generation;
  const deadline = Date.now() + timeoutMs;
  const remaining = () => Math.max(0, deadline - Date.now());
  const connect = async () => {
    const held = current.port;
    if (held) {
      const alive = await probe(current, held, Math.min(CACHED_PORT_PROBE_MS, remaining()));
      if (generation !== current.generation) return null;
      if (alive && current.port === held) return held;
      invalidateInjectorPort(held);
    }
    const offered = await hello(current, remaining());
    if (generation !== current.generation || !offered) return null;
    const alive = await probe(current, offered, remaining());
    if (generation !== current.generation) return null;
    if (alive && current.port === offered) return offered;
    invalidateInjectorPort(offered);
    return null;
  };
  const pending = connect().finally(() => {
    if (current.pending === pending) current.pending = undefined;
  });
  current.pending = pending;
  return pending;
}

/** Cancel in-flight work before handing the channel back on extension invalidation. */
export function closeInjectorPort(): void {
  const current = slots()[STATE_SLOT];
  if (!current) return;
  current.generation++;
  current.cancel?.();
  current.pending = undefined;
  const port = current.port;
  current.port = undefined;
  try {
    // Do not close immediately: the responder must receive BYE and unhook first.
    port?.postMessage({ __omni: INJECT_BYE });
  } catch {
    /* already disconnected */
  }
}

/** TEST-ONLY: discard channel state without sending a lifecycle message. */
export function resetInjectorPortForTests(): void {
  const current = slots()[STATE_SLOT];
  if (current) {
    current.generation++;
    current.cancel?.();
    current.port?.close();
  }
  delete slots()[STATE_SLOT];
}
