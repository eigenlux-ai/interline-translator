import { afterEach, expect, it } from 'vitest';
import { inSkippedAncestry, isSkippedElement } from './filter';

afterEach(() => {
  document.body.innerHTML = '';
  window.location.href = 'http://localhost:3000/';
});
it('keeps YouTube native captions out of page translation before subtitle activation', () => {
  window.location.href = 'https://www.youtube.com/watch?v=fixture1234';
  document.body.innerHTML =
    '<div class="ytp-caption-window-container"><span>Current video sentence</span></div><p>Normal page description</p>';
  const container = document.querySelector('div')!;
  expect(isSkippedElement(container)).toBe(true);
  expect(inSkippedAncestry(container.firstElementChild!)).toBe(true);
  expect(isSkippedElement(document.querySelector('p')!)).toBe(false);
  expect(inSkippedAncestry(document.querySelector('p')!)).toBe(false);
});
it('does not reserve YouTube class names on unrelated sites', () => {
  window.location.href = 'https://example.com/';
  document.body.innerHTML = '<div class="ytp-caption-window-container"><span>Normal content</span></div>';
  expect(isSkippedElement(document.querySelector('div')!)).toBe(false);
  expect(inSkippedAncestry(document.querySelector('span')!)).toBe(false);
});
