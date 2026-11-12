/** Preserve script distinctions (especially Chinese); exact tags win among compatible tracks. */
export function captionLanguage(value: string): string {
  try {
    const locale = new Intl.Locale(value);
    const expanded = locale.maximize();
    return `${expanded.language}-${expanded.script}`.toLowerCase();
  } catch {
    return '';
  }
}
export function chooseHumanTarget<T extends { languageCode?: string; kind?: string; baseUrl?: string }>(
  tracks: T[],
  language: string
): T | undefined {
  const target = captionLanguage(language);
  if (!target) return;
  const manual = tracks.filter(
    (track) =>
      track.kind !== 'asr' &&
      !!track.languageCode &&
      captionLanguage(track.languageCode) === target &&
      !hasTranslation(track.baseUrl)
  );
  return manual.find((track) => track.languageCode?.toLowerCase() === language.toLowerCase()) ?? manual[0];
}
function hasTranslation(url?: string): boolean {
  try {
    return !url || new URL(url).searchParams.has('tlang');
  } catch {
    return true;
  }
}
