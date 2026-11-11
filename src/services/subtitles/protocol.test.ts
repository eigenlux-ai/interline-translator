import { describe, expect, it } from 'vitest';
import { isSubtitleTranslationEvent, isSubtitleWindow } from './protocol';

const item = {
  subscriptionId: 'a',
  cueId: 'a',
  contentVersion: 'v',
  text: '<script>untrusted</script>',
  priority: 'current',
};
const window = { generation: 1, trackVersion: 'track', sourceLanguage: 'en', subscriptions: [item] };
describe('subtitle wire validation', () => {
  it('accepts text as data and rejects duplicate IDs, invalid priorities, and oversized payloads', () => {
    expect(isSubtitleWindow(window)).toBe(true);
    expect(isSubtitleWindow({ ...window, subscriptions: [item, item] })).toBe(false);
    expect(isSubtitleWindow({ ...window, subscriptions: [{ ...item, priority: 'interactive' }] })).toBe(false);
    expect(isSubtitleWindow({ ...window, subscriptions: [{ ...item, text: 'x'.repeat(4001) }] })).toBe(false);
    expect(isSubtitleWindow({ ...window, generation: NaN })).toBe(false);
    expect(
      isSubtitleWindow({
        ...window,
        subscriptions: Array.from({ length: 30 }, (_, i) => ({
          ...item,
          subscriptionId: String(i),
          text: 'x'.repeat(4000),
        })),
      })
    ).toBe(false);
  });
  it('requires versioned identities and bounded response text', () => {
    const event = { ...item, version: 1, type: 'completed', generation: 1, trackVersion: 'track', text: 'done' };
    expect(isSubtitleTranslationEvent(event)).toBe(true);
    expect(isSubtitleTranslationEvent({ ...event, version: 2 })).toBe(false);
    expect(isSubtitleTranslationEvent({ ...event, text: 'x'.repeat(32001) })).toBe(false);
  });
});
