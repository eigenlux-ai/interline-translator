import { fakeBrowser } from 'wxt/testing';
import { beforeEach, expect, it, vi } from 'vitest';
import { PROJECT_PREFIX } from '@/constants';
import { registerCacheCleanup } from './cleanup';
import { CACHE_TTL_MS, capEntryCount, sweepOlderThan } from './db';

vi.mock('./db', () => ({
  CACHE_TTL_MS: 30 * 24 * 60 * 60 * 1000,
  capEntryCount: vi.fn(async () => 0),
  sweepOlderThan: vi.fn(async () => 0),
}));

const alarmName = `${PROJECT_PREFIX}-cache-sweep`;
const get = vi.fn();
const create = vi.fn();
let onAlarm: (alarm: { name: string }) => void;

beforeEach(() => {
  vi.clearAllMocks();
  get.mockResolvedValue(undefined);
  create.mockResolvedValue(undefined);
  Object.assign(fakeBrowser, {
    alarms: {
      get,
      create,
      onAlarm: {
        addListener: (cb: typeof onAlarm) => {
          onAlarm = cb;
        },
      },
    },
  });
});

it('schedules the first cleanup promptly when the alarm is missing', async () => {
  registerCacheCleanup();
  await vi.waitFor(() => expect(create).toHaveBeenCalledWith(alarmName, { delayInMinutes: 1, periodInMinutes: 1440 }));
});

it('does not postpone an existing cleanup on worker restart', async () => {
  get.mockResolvedValue({ name: alarmName });
  registerCacheCleanup();
  await Promise.resolve();
  expect(create).not.toHaveBeenCalled();
});

it('only sweeps for its own alarm, then enforces capacity', async () => {
  registerCacheCleanup();
  onAlarm({ name: 'unrelated' });
  expect(sweepOlderThan).not.toHaveBeenCalled();
  const now = vi.spyOn(Date, 'now').mockReturnValue(CACHE_TTL_MS + 1234);
  onAlarm({ name: alarmName });
  await vi.waitFor(() => expect(capEntryCount).toHaveBeenCalledWith(150_000));
  expect(sweepOlderThan).toHaveBeenCalledWith(1234);
  now.mockRestore();
});

it('handles alarm creation failure without an unhandled rejection', async () => {
  create.mockRejectedValueOnce(new Error('unavailable'));
  const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
  registerCacheCleanup();
  await vi.waitFor(() => expect(warning).toHaveBeenCalled());
  warning.mockRestore();
});
