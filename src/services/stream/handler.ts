/**
 * @module services/stream/handler
 *
 * Shared lifecycle scaffolding for stream-port handlers (single translate,
 * batch translation, word notes). Manages AbortController registration,
 * cancellation handling, and error-to-message projection.
 */

/**
 * Run one port request under a registered AbortController.
 *
 * - user cancellation (`ac.signal.aborted`) ends SILENTLY — the client already
 *   tore down its listeners, an error message would be noise at best;
 * - any other throw is projected to `onError` (the handler posts its own
 *   error/batchError shape);
 * - the controller is always deregistered.
 */
export async function runStreamHandler(
  requestId: string,
  controllers: Map<string, AbortController>,
  onError: (message: string) => void,
  fn: (ac: AbortController) => Promise<void>
): Promise<void> {
  const ac = new AbortController();
  controllers.set(requestId, ac);
  try {
    await fn(ac);
  } catch (e) {
    if (!ac.signal.aborted) onError(e instanceof Error ? e.message : String(e));
  } finally {
    controllers.delete(requestId);
  }
}
