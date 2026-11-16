import { fakeBrowser } from 'wxt/testing/fake-browser';
import type { Browser } from '#imports';
import type { sendMessage } from '@/core/messaging';

/** Deliver the library wire format with a browser-supplied sender and callback. */
export async function dispatchMessage(
  type: Parameters<typeof sendMessage>[0],
  data: unknown,
  sender: Browser.runtime.MessageSender
): Promise<unknown> {
  const reply = await new Promise<{ res?: unknown; err?: { message?: string } }>((resolve, reject) => {
    void fakeBrowser.runtime.onMessage
      .trigger({ type, data, id: 1, timestamp: Date.now() }, sender, resolve)
      .catch(reject);
  });
  if (reply.err) throw new Error(reply.err.message);
  return reply.res;
}
