export function validVideoId(value: unknown): value is string {
  return typeof value === 'string' && /^[\w-]{6,64}$/u.test(value);
}
function youtubeHost(url: URL, embed = false): boolean {
  return (
    url.protocol === 'https:' &&
    !url.username &&
    !url.password &&
    (!url.port || url.port === '443') &&
    (/(^|\.)youtube\.com$/u.test(url.hostname) ||
      (embed && ['youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(url.hostname)))
  );
}
/** Privacy-enhanced hosts support embeds, not watch pages. */
export function isYoutubeEmbed(value: string): boolean {
  try {
    const url = new URL(value);
    return value.length <= 8192 && youtubeHost(url, true) && /^\/embed\/[\w-]{6,64}\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}
export function isYoutubeShorts(value: string): boolean {
  try {
    const url = new URL(value);
    return value.length <= 8192 && youtubeHost(url) && /^\/shorts\/[\w-]{6,64}\/?$/.test(url.pathname);
  } catch {
    return false;
  }
}
export function youtubeVideoId(url: string): string | null {
  if (typeof url !== 'string' || url.length > 8192) return null;
  try {
    const parsed = new URL(url);
    if (!youtubeHost(parsed)) return null;
    if (isYoutubeShorts(url)) return parsed.pathname.split('/')[2];
    if (parsed.pathname !== '/watch') return null;
    const id = parsed.searchParams.get('v');
    return validVideoId(id) ? id : null;
  } catch {
    return null;
  }
}
export function safeTimedTextUrl(value: string, videoId: string, base?: string): URL | null {
  if (typeof value !== 'string' || !value || value.length > 8192 || !validVideoId(videoId)) return null;
  try {
    const url = new URL(value, base);
    return youtubeHost(url, true) && url.pathname === '/api/timedtext' && url.searchParams.get('v') === videoId
      ? url
      : null;
  } catch {
    return null;
  }
}
