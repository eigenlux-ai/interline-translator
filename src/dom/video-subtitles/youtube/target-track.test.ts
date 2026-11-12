import { expect, it } from 'vitest';
import { captionLanguage, chooseHumanTarget } from './target-track';

const track = (languageCode: string, kind?: string, suffix = '') => ({
  languageCode,
  kind,
  baseUrl: `https://www.youtube.com/api/timedtext?v=video_123&lang=${languageCode}${suffix}`,
});
it('excludes automatic tracks and translated bodies while preserving Chinese script distinctions', () => {
  const simplified = track('zh-Hans');
  const traditional = track('zh-Hant');
  expect(
    chooseHumanTarget(
      [track('zh-CN', 'asr'), track('zh-CN', undefined, '&tlang=zh-CN'), traditional, simplified],
      'zh-CN'
    )
  ).toBe(simplified);
  expect(chooseHumanTarget([simplified, traditional], 'zh-TW')).toBe(traditional);
  expect(chooseHumanTarget([simplified], 'zh-TW')).toBeUndefined();
  expect(captionLanguage('%%%')).toBe('');
});
it('prefers exact language tags and safely handles missing targets', () => {
  const exact = track('en-GB');
  expect(chooseHumanTarget([track('en-US'), exact], 'en-GB')).toBe(exact);
  expect(chooseHumanTarget([track('en')], 'ja')).toBeUndefined();
});
