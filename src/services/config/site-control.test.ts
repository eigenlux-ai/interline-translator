import { describe, expect, it } from 'vitest';
import type { SiteControlConfig } from '@/data/models';
import { isSiteEnabled, matchDomainPattern, resolveSiteMode, setSiteMode, shouldAutoTranslate } from './site-control';

describe('matchDomainPattern', () => {
  it('matches exact hostnames case-insensitively', () => {
    expect(matchDomainPattern('Example.com', 'example.com')).toBe(true);
    expect(matchDomainPattern('example.com', 'example.org')).toBe(false);
  });

  it('expands * across subdomains', () => {
    expect(matchDomainPattern('a.b.example.com', '*.example.com')).toBe(true);
    expect(matchDomainPattern('example.com', '*.example.com')).toBe(false);
  });

  it('does not let . in the pattern match arbitrary chars', () => {
    expect(matchDomainPattern('exampleXcom', 'example.com')).toBe(false);
  });

  it('returns false for an empty pattern', () => {
    expect(matchDomainPattern('example.com', '   ')).toBe(false);
  });
});

describe('resolveSiteMode', () => {
  const config: SiteControlConfig = {
    defaultMode: 'auto',
    rules: [
      { pattern: '*.example.com', mode: 'always' },
      { pattern: 'mail.example.com', mode: 'never' },
    ],
  };

  it('prefers the most specific (longest) matching rule', () => {
    // both rules match mail.example.com; the longer pattern wins
    expect(resolveSiteMode(config, 'mail.example.com')).toBe('never');
  });

  it('falls back to the default mode when nothing matches', () => {
    expect(resolveSiteMode(config, 'other.org')).toBe('auto');
  });
});

describe('isSiteEnabled', () => {
  it('allows everything except never', () => {
    expect(isSiteEnabled({ defaultMode: 'auto', rules: [] }, 'x.com')).toBe(true);
    expect(isSiteEnabled({ defaultMode: 'always', rules: [] }, 'x.com')).toBe(true);
    expect(isSiteEnabled({ defaultMode: 'never', rules: [] }, 'x.com')).toBe(false);
    expect(isSiteEnabled({ defaultMode: 'auto', rules: [{ pattern: 'x.com', mode: 'never' }] }, 'x.com')).toBe(false);
  });
});

describe('shouldAutoTranslate', () => {
  it('auto-translates only for always', () => {
    expect(shouldAutoTranslate({ defaultMode: 'always', rules: [] }, 'x.com')).toBe(true);
    expect(shouldAutoTranslate({ defaultMode: 'auto', rules: [] }, 'x.com')).toBe(false);
    expect(shouldAutoTranslate({ defaultMode: 'never', rules: [] }, 'x.com')).toBe(false);
  });
});

describe('setSiteMode', () => {
  const base = { defaultMode: 'auto' as const, rules: [{ pattern: '*.example.com', mode: 'never' as const }] };

  it('adds an exact-host always rule (turn on 总是翻译此站)', () => {
    const next = setSiteMode(base, 'news.ycombinator.com', 'always');
    expect(resolveSiteMode(next, 'news.ycombinator.com')).toBe('always');
    expect(next.rules).toContainEqual({ pattern: 'news.ycombinator.com', mode: 'always' });
  });

  it('clearing a host reverts it to the default, leaving glob rules intact', () => {
    const on = setSiteMode(base, 'a.com', 'always');
    const off = setSiteMode(on, 'a.com', null);
    expect(resolveSiteMode(off, 'a.com')).toBe('auto');
    expect(off.rules).toEqual(base.rules); // glob rule untouched
  });

  it('replaces a prior exact rule rather than duplicating it', () => {
    const once = setSiteMode(base, 'a.com', 'always');
    const twice = setSiteMode(once, 'A.COM', 'always'); // case-insensitive host match
    expect(twice.rules.filter((r) => r.pattern === 'a.com')).toHaveLength(1);
  });

  it('does not mutate the input config', () => {
    const before = JSON.stringify(base);
    setSiteMode(base, 'a.com', 'always');
    expect(JSON.stringify(base)).toBe(before);
  });
});
