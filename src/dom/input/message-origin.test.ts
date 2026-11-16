import { describe, expect, it } from 'vitest';
import { editorMessageOrigin } from './message-origin';

describe('editor message origin', () => {
  it('uses the inherited window origin of a srcdoc document', () => {
    const frame = { origin: 'https://editor.example:8443', location: { origin: 'null' } };
    expect(editorMessageOrigin(frame)).toBe('https://editor.example:8443');
  });
  it.each(['null', '', 'file:///tmp/editor.html', 'data:text/html,editor', 'not a URL'])(
    'rejects opaque or non-web origin %s',
    (origin) => {
      expect(editorMessageOrigin({ origin })).toBeNull();
    }
  );
  it('fails closed when the global origin cannot be read', () => {
    expect(
      editorMessageOrigin({
        get origin(): string {
          throw new Error('Unavailable');
        },
      })
    ).toBeNull();
  });
});
