/**
 * @module services/stream
 *
 * Named-Port protocol for token-by-token streaming. proxy-service can't return
 * an async iterable across RPC, so streaming translations (划词/selection) open
 * this Port instead: content posts a `StreamStart`, background streams back
 * `chunk`/`done`/`error`. Cancellation is by `requestId` (`StreamCancel`) — no
 * AbortSignal crosses the boundary.
 *
 * Import-safe everywhere: only constants + `import type`.
 */

import { PROJECT_PREFIX } from '@/constants';
import type { StreamClientMessage, StreamServerMessage } from '@/data/models';

/** `browser.runtime.connect({ name })` channel name for streaming translations. */
export const STREAM_PORT_NAME = `${PROJECT_PREFIX}-stream`;

export type { StreamClientMessage, StreamServerMessage };
