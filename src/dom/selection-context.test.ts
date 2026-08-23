// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { DATA_OMNI } from '@/constants';
import { selectionNeighbors } from './selection-context';

function selectIn(el: Element, start = 0, end?: number): Selection {
  const node = el.firstChild!;
  const r = document.createRange();
  r.setStart(node, start);
  r.setEnd(node, end ?? (node.textContent?.length ?? 0));
  const sel = window.getSelection()!;
  sel.removeAllRanges();
  sel.addRange(r);
  return sel;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('selectionNeighbors', () => {
  it('returns the previous and next paragraph texts', () => {
    document.body.innerHTML = '<p id="a">Before text.</p><p id="b">The selected one.</p><p id="c">After text.</p>';
    const sel = selectIn(document.getElementById('b')!);
    expect(selectionNeighbors(sel)).toEqual(['Before text.', 'After text.']);
  });

  it('handles edges: first/last paragraph yields one neighbor', () => {
    document.body.innerHTML = '<p id="a">Only one.</p><p id="b">Follower.</p>';
    expect(selectionNeighbors(selectIn(document.getElementById('a')!))).toEqual(['Follower.']);
    expect(selectionNeighbors(selectIn(document.getElementById('b')!))).toEqual(['Only one.']);
  });

  it('strips our injected 译文 from neighbor text (translated pages must not feed 译文 back)', () => {
    document.body.innerHTML =
      `<p>Original neighbor.<span ${DATA_OMNI.translated}="1">邻居译文</span></p><p id="b">Sel.</p>`;
    expect(selectionNeighbors(selectIn(document.getElementById('b')!))).toEqual(['Original neighbor.']);
  });

  it('caps each neighbor and skips empty siblings', () => {
    document.body.innerHTML = `<p>${'x'.repeat(500)}</p><p id="b">Sel.</p><p>   </p>`;
    const out = selectionNeighbors(selectIn(document.getElementById('b')!));
    expect(out).toHaveLength(1);
    expect(out[0]).toHaveLength(240);
  });

  it('a long selection is its own context — no neighbors attached', () => {
    document.body.innerHTML = `<p>Prev.</p><p id="b">${'long '.repeat(300)}</p>`;
    expect(selectionNeighbors(selectIn(document.getElementById('b')!))).toEqual([]);
  });

  it('climbs past inline wrappers to the containing block', () => {
    document.body.innerHTML = '<p>Prev.</p><p id="b"><em><strong id="t">deep</strong></em></p><p>Next.</p>';
    const sel = selectIn(document.getElementById('t')!);
    expect(selectionNeighbors(sel)).toEqual(['Prev.', 'Next.']);
  });
});
