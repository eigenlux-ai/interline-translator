// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { isHidden, isVisuallyHidden, visibleText } from './visibility';

function el(html: string): Element {
  document.body.innerHTML = html;
  return document.body.firstElementChild!;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('isHidden', () => {
  it('true for the [hidden] attribute, false for hidden="until-found"', () => {
    expect(isHidden(el('<div hidden>x</div>'))).toBe(true);
    expect(isHidden(el('<div hidden="until-found">x</div>'))).toBe(false);
  });

  it('true for display:none and visibility:hidden', () => {
    expect(isHidden(el('<div style="display:none">x</div>'))).toBe(true);
    expect(isHidden(el('<div style="visibility:hidden">x</div>'))).toBe(true);
  });

  it('true for the clip-based sr-only pattern (1px + overflow:hidden)', () => {
    expect(isHidden(el('<div style="width:1px;height:1px;overflow:hidden">x</div>'))).toBe(true);
  });

  it('false for ordinary visible elements (and for sr-only by CLASS — that is isVisuallyHidden)', () => {
    expect(isHidden(el('<p>visible</p>'))).toBe(false);
    expect(isHidden(el('<span class="sr-only">label</span>'))).toBe(false);
    // a responsive hider is NOT permanently hidden
    expect(isHidden(el('<span class="sl-hidden md:sl-block">shown on md</span>'))).toBe(false);
  });
});

describe('isVisuallyHidden', () => {
  it('true only for known sr-only utility classes', () => {
    for (const c of ['sr-only', 'visually-hidden', 'screen-reader-text', 'a11y-text']) {
      expect(isVisuallyHidden(el(`<span class="${c}">x</span>`))).toBe(true);
    }
  });

  it('false for responsive hiders and plain elements', () => {
    expect(isVisuallyHidden(el('<span class="sl-hidden md:sl-block">x</span>'))).toBe(false);
    expect(isVisuallyHidden(el('<span>x</span>'))).toBe(false);
  });
});

describe('visibleText', () => {
  it('keeps painted text, drops sr-only / code-data / hidden subtrees', () => {
    const root = el(
      '<div>Visible' +
        '<span class="sr-only">screen reader only</span>' +
        '<script>doStuff()</script>' +
        '<span hidden>collapsed panel text</span>' +
        ' tail</div>'
    );
    const t = visibleText(root);
    expect(t).toContain('Visible');
    expect(t).toContain('tail');
    expect(t).not.toContain('screen reader only');
    expect(t).not.toContain('doStuff');
    expect(t).not.toContain('collapsed panel text');
  });

  it('is empty for an icon-only control (only an sr-only label)', () => {
    const root = el('<a href="/x"><span class="sr-only">GitHub</span><svg></svg></a>');
    expect(visibleText(root).trim()).toBe('');
  });

  it('drops aria-hidden subtrees — in lockstep with serializeInline', () => {
    const root = el('<div>Posted by <span aria-hidden="true">+8 decoration</span>team</div>');
    const t = visibleText(root);
    expect(t).toContain('Posted by');
    expect(t).toContain('team');
    expect(t).not.toContain('+8 decoration');
  });
});
