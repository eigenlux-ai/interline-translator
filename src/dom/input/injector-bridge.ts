/**
 * @module dom/input/injector-bridge
 *
 * Isolated-world half of the main-world editor bridge (protocol in ./protocol).
 * Model-managed editors (Slate, Lexical, Quill, CodeMirror, ProseMirror, Monaco…)
 * revert DOM-level edits, and virtualized ones (CodeMirror, Monaco) don't even
 * SHOW their full document in the DOM — so both reading and writing go through
 * the `editor-injector` content script in the page realm: mark the target with
 * a nonce id, send the request, await the reply.
 *
 * Requests go over the private port from ./port-handshake, never over `window`:
 * an `apply` carries the model's translation, and the page is entitled to its
 * editors' content — not to our output. No port (no responder on this page, or a
 * handshake that missed) resolves 'miss' at once and RETRIES on the next
 * gesture; the `ping` probe this replaces cached a single 400ms timeout for the
 * page's lifetime and disabled the whole path behind the user's back.
 */

import { randomId } from '@/core/uid';
import { injectorPort } from './port-handshake';
import {
  asRichSnapshot,
  INJECT_ATTR,
  INJECT_REQ,
  INJECT_RES,
  MAIN_WORLD_EDITOR_SELECTOR,
  type InjectOp,
  type InjectResponse,
  type InjectStatus,
  type RichSnapshot,
} from './protocol';

export type { InjectStatus } from './protocol';
export type InjectOutcome = 'applied' | 'raced' | 'miss';

/** One read of a main-world editor: its model text, plus the 撤销 snapshot when it has one. */
export interface EditorSnapshot {
  text: string;
  rich?: RichSnapshot;
}

/** Does this element live inside an editor the main-world injector handles? */
export function isMainWorldEditor(el: Element): boolean {
  return typeof el.closest === 'function' && el.closest(MAIN_WORLD_EDITOR_SELECTOR) !== null;
}

/**
 * One round-trip to the main world. Marks `el` (when given) with the nonce
 * attribute for the request's lifetime. Resolves the reply, or null when the
 * channel is missing or the responder stayed silent past `timeoutMs`.
 */
function request(
  op: InjectOp,
  el: Element | null,
  extra: { text?: string; before?: string; rich?: RichSnapshot },
  timeoutMs: number
): Promise<InjectResponse | null> {
  return new Promise((resolve) => {
    // Crypto-random: the nonce lands in the host DOM, where the page can read
    // it — it must not also be PREDICTABLE, or a decoy could be planted (and
    // the responder's marked-node lookup refused) before the request is sent.
    const id = randomId();
    el?.setAttribute(INJECT_ATTR, id);

    let settled = false;
    const finish = (res: InjectResponse | null) => {
      if (settled) return;
      settled = true;
      channel?.removeEventListener('message', onMessage);
      clearTimeout(timer);
      // Only clear our own nonce — a concurrent request may have re-marked `el`.
      if (el?.getAttribute(INJECT_ATTR) === id) el.removeAttribute(INJECT_ATTR);
      resolve(res);
    };

    const onMessage = (e: MessageEvent) => {
      const d = e.data as Partial<InjectResponse> | null;
      if (!d || d.__omni !== INJECT_RES || d.id !== id) return;
      finish(d as InjectResponse);
    };

    let channel: MessagePort | null = null;
    const timer = setTimeout(() => finish(null), timeoutMs);
    void injectorPort().then((port) => {
      if (settled) return;
      if (!port) {
        finish(null);
        return;
      }
      channel = port;
      port.addEventListener('message', onMessage);
      // Idempotent, and the ONLY thing that starts delivery on a port whose
      // listeners come from addEventListener rather than onmessage.
      port.start();
      port.postMessage({ __omni: INJECT_REQ, id, op, ...extra });
    });
  });
}

/**
 * Read the target editor's MODEL text (virtualization-safe) plus its rich 撤销
 * snapshot, or null when the main world can't resolve it — callers fall back to
 * the DOM read (which has no rich half: see replace.ts's chain). `timeoutMs`
 * bounds the WHOLE call, a late handshake included: one gesture's budget is the
 * unit the caller cares about, and a handshake that ate it is already stashed
 * for the next one.
 */
export async function readViaMainWorld(el: Element, timeoutMs = 600): Promise<EditorSnapshot | null> {
  const res = await request('read', el, {}, timeoutMs);
  if (res?.status !== 'ok' || typeof res.text !== 'string') return null;
  const rich = asRichSnapshot(res.rich);
  return { text: res.text, ...(rich ? { rich } : {}) };
}

/**
 * Ask the main-world injector to replace the target editor's document.
 * `expectedBefore` (trigger-space-stripped) makes the write atomic: the
 * injector re-reads at the last moment and reports 'raced' — without writing —
 * if the user kept typing. 'miss' → the caller may degrade to the DOM chain.
 * `rich` restores a snapshot from an earlier read instead of writing `text`
 * (撤销); the two options never come together — a translation is plain text.
 */
export async function injectViaMainWorld(
  el: Element,
  text: string,
  opts: { expectedBefore?: string; rich?: RichSnapshot; timeoutMs?: number } = {}
): Promise<InjectOutcome> {
  const res = await request(
    'apply',
    el,
    {
      text,
      ...(opts.expectedBefore !== undefined ? { before: opts.expectedBefore } : {}),
      ...(opts.rich !== undefined ? { rich: opts.rich } : {}),
    },
    opts.timeoutMs ?? 1200
  );
  const status: InjectStatus | undefined = res?.status;
  return status === 'applied' || status === 'raced' ? status : 'miss';
}
