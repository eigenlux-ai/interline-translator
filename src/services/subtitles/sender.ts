import { isYoutubeEmbed } from '@/core/subtitles/youtube-url';

type Sender = { id?: string; url?: string; frameId?: number; documentId?: string; tab?: { id?: number; url?: string } };

/** Only browser-supplied sender fields establish frame ownership and site policy. */
export function subtitleSenderContext(sender: Sender | undefined, extensionId: string) {
  if (sender?.id !== extensionId || sender.tab?.id === undefined || sender.frameId === undefined) return null;
  try {
    const frame = new URL(sender.url ?? '');
    const top = new URL(sender.tab.url ?? '');
    if (!['https:', 'http:'].includes(top.protocol)) return null;
    if (
      !isYoutubeEmbed(frame.href) &&
      !(
        sender.frameId === 0 &&
        frame.protocol === 'https:' &&
        !frame.username &&
        !frame.password &&
        !frame.port &&
        ['www.youtube.com', 'youtube.com'].includes(frame.hostname)
      )
    )
      return null;
    const hosts = [...new Set([top.hostname, frame.hostname])];
    return {
      hosts,
      owner: `${JSON.stringify({
        tab: sender.tab.id,
        frame: sender.frameId,
        document: sender.documentId ?? sender.url,
        hosts,
      })}:${frame.hostname}`,
    };
  } catch {
    return null;
  }
}
