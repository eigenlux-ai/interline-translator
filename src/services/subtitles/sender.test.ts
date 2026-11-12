import { describe, expect, it } from 'vitest';
import { subtitleSenderContext } from './sender';

const sender = {
  id: 'extension',
  frameId: 2,
  documentId: 'doc',
  url: 'https://www.youtube.com/embed/video_123',
  tab: { id: 0, url: 'https://example.com/article' },
};
describe('subtitle frame ownership', () => {
  it('uses browser-provided top and frame hosts and isolates sibling frames', () => {
    const context = subtitleSenderContext(sender, 'extension');
    expect(context?.hosts).toEqual(['example.com', 'www.youtube.com']);
    expect(subtitleSenderContext({ ...sender, frameId: 3 }, 'extension')?.owner).not.toBe(context?.owner);
    expect(
      subtitleSenderContext({ ...sender, url: 'https://www.youtube-nocookie.com/embed/video_123' }, 'extension')?.hosts
    ).toContain('www.youtube-nocookie.com');
  });
  it('retains top-level homepage initialization for later SPA watch navigation', () => {
    expect(
      subtitleSenderContext({ ...sender, frameId: 0, url: 'https://www.youtube.com/' }, 'extension')
    ).not.toBeNull();
  });
  it('rejects foreign extensions, non-embed frames, opaque parents and lookalike hosts', () => {
    for (const input of [
      { ...sender, id: 'other' },
      { ...sender, frameId: undefined },
      { ...sender, url: 'https://www.youtube.com/watch?v=video_123' },
      { ...sender, url: 'https://youtube.com.evil.test/embed/video_123' },
      { ...sender, url: 'http://www.youtube.com/embed/video_123' },
      { ...sender, tab: { id: 1 } },
      { ...sender, tab: { id: 1, url: 'data:text/html,hello' } },
    ])
      expect(subtitleSenderContext(input, 'extension')).toBeNull();
  });
});
