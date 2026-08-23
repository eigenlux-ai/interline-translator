/**
 * @module data/models/stream
 *
 * Streaming payloads. proxy-service is promise-only (it can't return an
 * async iterable across the RPC boundary), so token-by-token streaming runs
 * over a dedicated named Port instead — see `services/stream`. These are the
 * structured-clonable messages that flow over that Port.
 */

import type { TranslateRequest } from './translate';

/** One streamed delta for an in-flight request. */
export interface StreamChunk {
  requestId: string;
  delta: string;
}

/** content → background: open a streaming translation. */
export interface StreamStart {
  type: 'start';
  requestId: string;
  request: TranslateRequest;
}

/** content → background: cancel an in-flight stream (no AbortSignal across RPC). */
export interface StreamCancel {
  type: 'cancel';
  requestId: string;
}

/**
 * content → background: open a streaming 注疏 (annotation) for a translated
 * selection — the reader's-companion notes under the 夹笺's translation.
 * LLM-only: the server rejects when the resolved engine can't reason.
 */
export interface AnnotateStart {
  type: 'annotate';
  requestId: string;
  /** The source text the user selected. */
  text: string;
  /** The translation already shown — the notes gloss BOTH sides. */
  translation: string;
  /** The reader's language (the notes are written in it). */
  target: string;
  /** The engine that produced the translation — notes should come from the
   *  same one; empty/absent falls back to the default provider. */
  providerId?: string;
}

/** background → content stream lifecycle messages. */
export type StreamServerMessage =
  | { type: 'chunk'; requestId: string; delta: string }
  | { type: 'done'; requestId: string; detectedSource?: string }
  | { type: 'error'; requestId: string; message: string };

/**
 * content → background: open a BATCH streaming translation. `items` are source
 * texts; segments are addressed by 1-based index in the server messages. Shares
 * the stream Port and the `cancel` message with single-segment streaming.
 */
export interface BatchStreamStart extends Omit<TranslateRequest, 'text'> {
  type: 'batchStart';
  requestId: string;
  items: string[];
}

/** background → content batch lifecycle messages (per-segment progressive). */
export type BatchStreamServerMessage =
  | { type: 'seg'; requestId: string; index: number; delta: string } // progressive append
  | { type: 'segDone'; requestId: string; index: number; text: string } // final (trimmed) text
  | { type: 'batchDone'; requestId: string }
  | { type: 'batchError'; requestId: string; message: string };

export type StreamClientMessage = StreamStart | StreamCancel | BatchStreamStart | AnnotateStart;
