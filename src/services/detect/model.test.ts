// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { detectorStatus, downloadDetectorModel } from './model';

afterEach(() => {
  delete (globalThis as unknown as { LanguageDetector?: unknown }).LanguageDetector;
});

function mockLD(parts: { availability?: () => Promise<string>; create?: () => Promise<unknown> }) {
  (globalThis as unknown as { LanguageDetector: unknown }).LanguageDetector = parts;
}

describe('detectorStatus', () => {
  it('reports unavailable when the API is absent', async () => {
    expect(await detectorStatus()).toBe('unavailable');
  });

  it('reflects the availability() value', async () => {
    mockLD({ availability: async () => 'downloadable', create: async () => ({}) });
    expect(await detectorStatus()).toBe('downloadable');
  });

  it('treats create-without-availability() as available', async () => {
    mockLD({ create: async () => ({}) });
    expect(await detectorStatus()).toBe('available');
  });

  it('reports unavailable when availability() throws', async () => {
    mockLD({
      availability: async () => {
        throw new Error('boom');
      },
      create: async () => ({}),
    });
    expect(await detectorStatus()).toBe('unavailable');
  });
});

describe('downloadDetectorModel', () => {
  it('throws when the API is absent', async () => {
    await expect(downloadDetectorModel()).rejects.toThrow(/unavailable/);
  });

  it('calls create() to trigger the download', async () => {
    const create = vi.fn(async () => ({}));
    mockLD({ availability: async () => 'downloadable', create });
    await downloadDetectorModel();
    expect(create).toHaveBeenCalledOnce();
  });
});
