/**
 * @module dom/input/protocol
 *
 * The ONE definition of the isolated↔main editor-injector wire protocol —
 * imported by BOTH worlds (injector-bridge in the isolated world, the
 * editor-injector content script in the page's main world), so the message
 * keys, the marker attribute, and the editor selector list can never drift
 * apart between the two bundles. Everything here must stay side-effect-free
 * and extension-API-free: it is compiled into the MAIN-world bundle.
 *
 * Requests and replies travel over a PRIVATE MessagePort, never over `window`:
 * an `apply` carries the model's translation into the page realm, and a window
 * message is heard by every script on the page (see dom/input/port-handshake
 * for how the port gets there). Only the handshake itself is a window message,
 * and it carries nothing but the port.
 */

import { DATA_OMNI, PROJECT_PREFIX } from '@/constants';

/** Port message keys (PROJECT_PREFIX-derived, collision-free against host pages). */
export const INJECT_REQ = `${PROJECT_PREFIX}:inject-req`;
export const INJECT_RES = `${PROJECT_PREFIX}:inject-res`;

/**
 * Handshake keys, the only two that ride `window`. INJECT_PORT is the
 * responder's port offer (document_start, before the page can hold a listener
 * that would see `MessageEvent.ports`); INJECT_HELLO asks for a replacement
 * offer when the isolated world missed that one.
 */
export const INJECT_PORT = `${PROJECT_PREFIX}:inject-port`;
export const INJECT_HELLO = `${PROJECT_PREFIX}:inject-hello`;

/**
 * Port control keys. ACK names the ONE port the isolated world kept, which
 * lets the responder close its spares and stop listening to `window` for
 * good; BYE is teardown — the responder unhooks `attachShadow` and forgets
 * every root, so a page whose extension went away is left as it was found.
 */
export const INJECT_ACK = `${PROJECT_PREFIX}:inject-ack`;
export const INJECT_BYE = `${PROJECT_PREFIX}:inject-bye`;

/** Nonce attribute marking the target editable (host DOM marker → DATA_OMNI). */
export const INJECT_ATTR = DATA_OMNI.injectId;

/**
 * What the main world is asked to do. No `ping`: availability is whether the
 * handshake produced a port, so the responder answers nothing at all until a
 * request arrives over that port.
 */
export type InjectOp = 'read' | 'apply';

/** Outcome of an `apply` (also reused as the generic reply status). */
export type InjectStatus = 'applied' | 'raced' | 'miss' | 'ok';

/**
 * An adapter's OWN serialization of its document, taken before we overwrite it
 * so 撤销 can put back what was really there — bold, links, lists and all. The
 * payload is opaque and adapter-PRIVATE: CKEditor/TinyMCE/wangEditor hand back
 * their HTML, Quill semantic HTML, Lexical a serialized editor state. Nothing
 * on either side of the wire parses `data`; `adapter` is compared against the
 * adapter that resolves at write time, so a snapshot can never be fed to an
 * editor that cannot read it (a remount could swap the reachable instance).
 */
export interface RichSnapshot {
  adapter: string;
  data: string;
}

/**
 * Validate a `RichSnapshot` off the wire. Both worlds share one window, so a
 * hostile page can post a malformed reply/request — a shape check here keeps
 * that from reaching an editor API as `undefined.data`.
 */
export function asRichSnapshot(v: unknown): RichSnapshot | undefined {
  const r = v as Partial<RichSnapshot> | null | undefined;
  return r && typeof r.adapter === 'string' && typeof r.data === 'string'
    ? { adapter: r.adapter, data: r.data }
    : undefined;
}

export interface InjectRequest {
  __omni: typeof INJECT_REQ;
  id: string;
  op: InjectOp;
  /** apply: the replacement text. */
  text?: string;
  /** apply: expected current text (trigger-space-stripped) — atomic race check. */
  before?: string;
  /** apply: restore this rich snapshot instead of `text` (撤销 only). */
  rich?: RichSnapshot;
}

export interface InjectResponse {
  __omni: typeof INJECT_RES;
  id: string;
  status: InjectStatus;
  /** read: the editor's model text. */
  text?: string;
  /** read: the editor's own rich serialization, when that adapter round-trips it. */
  rich?: RichSnapshot;
}

/**
 * Editable BODIES owned by main-world-instance editors. Deliberately the
 * content nodes, NOT the container chrome: auxiliary native inputs living in
 * the chrome (Monaco's find widget, Quill's link tooltip in `.ql-container`,
 * CodeMirror's search panel in `.cm-editor`/`.CodeMirror-dialog`) must NOT be
 * routed here — their correct handling is a plain setNativeValue on the input
 * itself, while these selectors would anchor to the surrounding editor and
 * clobber the whole document.
 *
 * Kept beside the adapter registry contract (`main-world/apply` builds one
 * adapter per entry family) so adding an editor means touching this one list.
 */
export const MAIN_WORLD_EDITOR_SELECTOR = [
  '[data-slate-editor]', // Slate, WangEditor (Slate-core)
  '[data-lexical-editor]', // Lexical
  '.public-DraftEditor-content', // Draft.js (content body only)
  '.ql-editor', // Quill (content body only)
  '.ck-editor__editable', // CKEditor 5
  '.ck-content',
  '.mce-content-body', // TinyMCE (inline)
  '.cm-content', // CodeMirror 6 (content only — search panel lives outside it)
  '.ProseMirror', // ProseMirror, TipTap
  '.monaco-editor textarea.inputarea', // Monaco's OWN input conduit only
  '.CodeMirror textarea', // CodeMirror 5 hidden conduit (dialog uses <input>)
].join(',');

/**
 * Strip the trigger's own residue: the N-space gesture can only ever deposit
 * plain ASCII spaces (`e.key === ' '` gates the trigger), so ONLY those are
 * normalised away when comparing field snapshots. Anything else the user types
 * while a translation is in flight — newlines, tabs — is real input and must
 * make snapshot comparisons fail (the pre-fix `\s+$` erased those too).
 */
export function stripTriggerSpaces(s: string): string {
  return s.replace(/ +$/, '');
}

/**
 * Collapse ALL whitespace for did-the-write-land containment checks. Editors
 * serialize block boundaries every which way — CKEditor's editable textContent
 * glues paragraphs ("ab"), TipTap/TinyMCE plain-text getters emit "\n\n",
 * innerText varies by element — so an exact `includes(text)` on a multi-line
 * translation false-misses after a PERFECTLY GOOD write, and the caller then
 * escalates to a destructive fallback (the model≠DOM desync class of bug).
 * Letters-only containment is the right strength: whitespace shape is the
 * editor's business; the letters either landed or they didn't.
 */
export function squashWhitespace(s: string): string {
  return s.replace(/\s+/g, '');
}
