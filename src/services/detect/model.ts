/**
 * @module services/detect/model
 *
 * On-device language-detection MODEL lifecycle, for the OPTIONS PAGE only. These
 * wrap Chrome's built-in `LanguageDetector` to report whether the small on-device
 * model is present and to trigger its download.
 *
 * Why this lives in services/ and not dom/: the download must run from a user
 * gesture in the options-page realm (Chrome throws otherwise), so it's a UI
 * concern, not part of the content injection pipeline. The pipeline's own skip
 * logic stays in `dom/skip-policy` and re-probes availability on a TTL — once the
 * model is downloaded here it becomes a browser-wide fact every realm sees, so
 * the content side picks it up without a reload and without any cross-realm
 * messaging.
 */

interface DetectorCtor {
  availability?: () => Promise<string>;
  create: () => Promise<unknown>;
}

function detector(win: typeof globalThis): DetectorCtor | undefined {
  return (win as unknown as { LanguageDetector?: DetectorCtor }).LanguageDetector;
}

export type DetectorStatus = 'unavailable' | 'downloadable' | 'downloading' | 'available';

/** Current on-device detector status (for the options UI). */
export async function detectorStatus(win: typeof globalThis = globalThis): Promise<DetectorStatus> {
  const LD = detector(win);
  if (!LD?.create) return 'unavailable';
  if (!LD.availability) return 'available';
  try {
    return (await LD.availability()) as DetectorStatus;
  } catch {
    return 'unavailable';
  }
}

/**
 * Download the on-device model. MUST be called from a user gesture (Chrome
 * requires one while the model is downloadable). Resolves when ready. The content
 * side re-probes availability on its own TTL, so no cache reset / message is
 * needed here.
 */
export async function downloadDetectorModel(win: typeof globalThis = globalThis): Promise<void> {
  const LD = detector(win);
  if (!LD?.create) throw new Error('on-device LanguageDetector is unavailable');
  await LD.create();
}
