import { fakeBrowser } from 'wxt/testing/fake-browser';
import { afterEach, expect, it, vi } from 'vitest';
import { recordSubtitleDiagnostic } from '@/core/subtitles/diagnostics';
import { relaySubtitleDiagnostics } from './diagnostics';

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});
it('coalesces and bounds telemetry, releases the timer and subscription on teardown', async () => {
  vi.useFakeTimers();
  const sendMessage = vi.spyOn(fakeBrowser.runtime, 'sendMessage').mockResolvedValue(undefined);
  const stop = relaySubtitleDiagnostics();
  for (let i = 0; i < 100; i++) recordSubtitleDiagnostic({ event: 'session-reset', generation: i });
  expect(sendMessage).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(1000);
  expect(sendMessage).toHaveBeenCalledOnce();
  expect((sendMessage.mock.calls[0][0] as unknown as { events: unknown[] }).events).toHaveLength(32);
  recordSubtitleDiagnostic({ event: 'render-failed' });
  stop();
  expect(sendMessage).toHaveBeenCalledTimes(2);
  recordSubtitleDiagnostic({ event: 'render-failed' });
  await vi.advanceTimersByTimeAsync(2000);
  expect(sendMessage).toHaveBeenCalledTimes(2);
  expect(vi.getTimerCount()).toBe(0);
});
