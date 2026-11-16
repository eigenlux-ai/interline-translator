import { afterEach, expect, it, vi } from 'vitest';
import { watchDocumentRoot } from './document-root';

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));
let stop: (() => void) | undefined;
afterEach(() => stop?.());

it('reports one replacement when the root is removed and added in separate batches', async () => {
  const onChange = vi.fn();
  stop = watchDocumentRoot(onChange);
  const root = document.createElement('html');
  root.append(document.createElement('body'));
  document.documentElement.remove();
  await flush();
  expect(onChange).not.toHaveBeenCalled();
  document.append(root);
  await flush();
  expect(onChange).toHaveBeenCalledOnce();
});
