import { describe, expect, it } from 'vitest';
import type { GlossaryEntry, GlossarySet, TranslateContext } from '@/data/models';
import { resolveGlossary, withGlossary } from './glossary';

const aiSet: GlossarySet = {
  id: 's1',
  name: 'AI 术语集',
  enabled: true,
  entries: [
    { source: 'Pod', target: '容器组' },
    { source: 'thread', target: '线程' },
  ],
};
const k8sSet: GlossarySet = {
  id: 's2',
  name: 'K8s 术语集',
  enabled: true,
  pattern: '*.k8s.io',
  entries: [{ source: 'Service', target: '服务', note: 'k8s 语境' }],
};
const sets = [aiSet, k8sSet];

describe('resolveGlossary — sets + on-demand injection', () => {
  it('injects only terms that OCCUR in the text (case-insensitive)', () => {
    expect(resolveGlossary(sets, undefined, 'Restart the pod after deploy')).toEqual([
      { source: 'Pod', target: '容器组' },
    ]);
    expect(resolveGlossary(sets, undefined, 'nothing relevant here')).toEqual([]);
  });

  it('a DISABLED set contributes nothing', () => {
    const off = [{ ...aiSet, enabled: false }, k8sSet];
    expect(resolveGlossary(off, 'docs.k8s.io', 'a Pod and a Service')).toEqual([
      { source: 'Service', target: '服务', note: 'k8s 语境' },
    ]);
  });

  it('a site-scoped set requires a matching host', () => {
    const text = 'A Service routes to a Pod';
    expect(resolveGlossary(sets, 'kubernetes.k8s.io', text).map((e) => e.source)).toEqual(['Pod', 'Service']);
    expect(resolveGlossary(sets, 'example.com', text).map((e) => e.source)).toEqual(['Pod']);
    expect(resolveGlossary(sets, undefined, text).map((e) => e.source)).toEqual(['Pod']); // no host → scoped sets skipped
  });

  it('duplicate terms across sets: the EARLIER set wins', () => {
    const first: GlossarySet = { id: 'a', name: 'A', enabled: true, entries: [{ source: 'Pod', target: '容器组' }] };
    const second: GlossarySet = { id: 'b', name: 'B', enabled: true, entries: [{ source: 'pod', target: '豆荚' }] };
    expect(resolveGlossary([first, second], undefined, 'a pod')).toEqual([{ source: 'Pod', target: '容器组' }]);
  });

  it('caps injected entries across sets and keeps order', () => {
    const entries: GlossaryEntry[] = Array.from({ length: 20 }, (_, i) => ({ source: `term${i}`, target: `T${i}` }));
    const big: GlossarySet = { id: 'big', name: 'big', enabled: true, entries };
    const text = entries.map((r) => r.source).join(' ');
    const out = resolveGlossary([big], undefined, text);
    expect(out).toHaveLength(12);
    expect(out[0].source).toBe('term0');
  });
});

describe('withGlossary', () => {
  it('returns the context untouched when nothing resolved', () => {
    const ctx: TranslateContext = { title: 'T' };
    expect(withGlossary(ctx, [])).toBe(ctx);
    expect(withGlossary(undefined, [])).toBeUndefined();
  });

  it('request-provided entries come first (kept priority)', () => {
    const merged = withGlossary({ glossary: [{ source: 'a', target: 'A' }] }, [{ source: 'b', target: 'B' }]);
    expect(merged?.glossary?.map((e) => e.source)).toEqual(['a', 'b']);
  });
});
