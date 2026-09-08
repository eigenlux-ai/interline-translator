import { expect, it, vi } from 'vitest';
import { getPageContext } from './page-context';

it('keeps each text context stable across toggles and summary completion', async () => {
  const root = document.createElement('main');
  let resolve!: (summary: string) => void;
  const read = vi.fn(
    () =>
      new Promise<string>((r) => {
        resolve = r;
      })
  );
  const first = getPageContext(root, 'view-a', read);
  expect(first.forText('first viewport')).toBe('');
  resolve('overview A');
  await Promise.resolve();
  expect(first.forText('below the fold')).toBe('overview A');
  const reopened = getPageContext(root, 'view-a', read);
  expect(reopened.forText('first viewport')).toBe('');
  expect(reopened.forText('below the fold')).toBe('overview A');
  expect(read).toHaveBeenCalledOnce();
});

it('isolates a new view from a late old-view response', async () => {
  const root = document.createElement('main');
  let resolveOld!: (summary: string) => void;
  const old = getPageContext(
    root,
    'a',
    () =>
      new Promise((r) => {
        resolveOld = r;
      })
  );
  const next = getPageContext(root, 'b', async () => 'new overview');
  await Promise.resolve();
  resolveOld('old overview');
  await Promise.resolve();
  expect(old.forText('text')).toBe('old overview');
  expect(next.forText('text')).toBe('new overview');
});

it('handles summary failure without interrupting translation', async () => {
  const root = document.createElement('main');
  const context = getPageContext(root, 'a', async () => {
    throw new Error('offline');
  });
  await Promise.resolve();
  await Promise.resolve();
  expect(context.forText('text')).toBe('');
});
