// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { DATA_OMNI } from '@/constants';
import { createPetalSpinner, PETAL_COMET, PETAL_TRACK } from './petal-loader';

/** Every element inside `scope` (spinner or holder) that spells out geometry. */
function geometryNodes(scope: ParentNode): Element[] {
  return Array.from(scope.querySelectorAll('[d]'));
}

function layers(spinner: Element): Element[] {
  return Array.from(spinner.querySelectorAll(`.${PETAL_TRACK}, .${PETAL_COMET}`));
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('createPetalSpinner geometry sharing', () => {
  it('carries no geometry of its own — every layer is a reference', () => {
    // Before: 13 <path> elements each repeating the ~5KB `d` (~66KB per
    // spinner, 13 path parses). One spinner per in-flight gloss means hundreds
    // of those on a fast scroll.
    const spinner = createPetalSpinner(document);
    expect(geometryNodes(spinner)).toEqual([]);
    expect(spinner.querySelectorAll('path').length).toBe(0);
    // The fade is unchanged in kind: one track + one <use> per comet layer.
    expect(layers(spinner).length).toBe(13);
    expect(spinner.querySelectorAll(`.${PETAL_COMET}`).length).toBe(12);
    expect(layers(spinner).every((l) => l.tagName.toLowerCase() === 'use')).toBe(true);
  });

  it('holds the geometry exactly once per root, however many spinners exist', () => {
    for (let i = 0; i < 20; i++) document.body.appendChild(createPetalSpinner(document));
    expect(geometryNodes(document).length).toBe(1);
    expect(document.querySelectorAll(`[${DATA_OMNI.petalDefs}]`).length).toBe(1);
  });

  it('resolves each layer against an id that exists in the SAME root', () => {
    const spinner = createPetalSpinner(document);
    document.body.appendChild(spinner);
    const hrefs = new Set(layers(spinner).map((l) => l.getAttribute('href')));
    expect(hrefs.size).toBe(1);
    const id = [...hrefs][0]!;
    expect(id.startsWith('#')).toBe(true);
    expect(document.querySelector(`${id}[d]`)).not.toBeNull();
  });

  it('gives a shadow root its own copy — a fragment reference cannot cross the boundary', () => {
    const host = document.createElement('div');
    document.body.appendChild(host);
    const shadow = host.attachShadow({ mode: 'open' });
    shadow.appendChild(createPetalSpinner(shadow));
    // Own holder inside the shadow tree, and the document's own copy is NOT
    // what the shadow spinner points at (ids don't cross the boundary).
    expect(shadow.querySelectorAll(`[${DATA_OMNI.petalDefs}]`).length).toBe(1);
    expect(document.querySelectorAll(`[${DATA_OMNI.petalDefs}]`).length).toBe(0);
    const id = shadow.querySelector('use')!.getAttribute('href')!;
    expect(shadow.querySelector(`${id}[d]`)).not.toBeNull();
  });

  it('keeps the shared stroke width on the group, not on each of the 13 layers', () => {
    const spinner = createPetalSpinner(document);
    expect(layers(spinner).some((l) => l.hasAttribute('stroke-width'))).toBe(false);
    expect(spinner.querySelector('g')!.getAttribute('stroke-width')).toBe('8');
  });

  it('re-creates the holder after teardown removed it', () => {
    document.body.appendChild(createPetalSpinner(document));
    document.querySelector(`[${DATA_OMNI.petalDefs}]`)!.remove();
    document.body.appendChild(createPetalSpinner(document));
    expect(geometryNodes(document).length).toBe(1);
  });
});
