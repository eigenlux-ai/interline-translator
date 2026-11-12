import { isYoutubeShorts, youtubeVideoId } from '@/core/subtitles/youtube-url';

/** DOM-only ownership selection, shared by isolated and MAIN worlds. */
export function youtubePlayer(win: Window): HTMLElement | null {
  if (!isYoutubeShorts(win.location.href)) return win.document.querySelector('#movie_player');
  const id = youtubeVideoId(win.location.href);
  const candidates: { player: HTMLElement; area: number }[] = [];
  for (const reel of win.document.querySelectorAll('ytd-reel-video-renderer')) {
    if (reel.closest('[hidden], [aria-hidden="true"]')) continue;
    // A reused renderer can temporarily retain the previous video's player.
    if (![...reel.querySelectorAll<HTMLAnchorElement>('a[href]')].some((link) => youtubeVideoId(link.href) === id))
      continue;
    for (const player of reel.querySelectorAll<HTMLElement>('.html5-video-player')) {
      if (!player.querySelector('video') || player.closest('[hidden], [aria-hidden="true"]')) continue;
      const rect = player.getBoundingClientRect();
      const width = Math.max(0, Math.min(rect.right, win.innerWidth) - Math.max(rect.left, 0));
      const height = Math.max(0, Math.min(rect.bottom, win.innerHeight) - Math.max(rect.top, 0));
      const area = width * height;
      if (area > 0 && area >= (rect.width * rect.height) / 2 && win.getComputedStyle(player).visibility !== 'hidden')
        candidates.push({ player, area });
    }
  }
  candidates.sort((a, b) => b.area - a.area);
  if (!candidates.length || candidates[0].area === candidates[1]?.area) return null;
  return candidates[0].player;
}
