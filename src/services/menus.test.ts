/**
 * The context menu row is BROWSER chrome: the browser paints it, so only
 * browser.i18n can localize the title. A literal English string would render
 * "Translate this page" on a zh_CN-default install.
 */

import { fakeBrowser } from 'wxt/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PROJECT_PREFIX } from '@/constants';
import { registerMenusAndCommands } from './menus';

const created = vi.fn();

beforeEach(() => {
  created.mockClear();
  // fakeBrowser implements none of contextMenus / i18n / commands; stub the three
  // menus.ts touches, with getMessage echoing the KEY so the assertion pins the
  // lookup rather than one locale's copy.
  Object.assign(fakeBrowser as unknown as Record<string, unknown>, {
    contextMenus: {
      removeAll: () => Promise.resolve(),
      create: created,
      onClicked: { addListener: () => {} },
    },
    i18n: { getMessage: (key: string) => `i18n:${key}` },
    commands: { onCommand: { addListener: () => {} } },
  });
});

describe('registerMenusAndCommands', () => {
  it('titles the context menu through browser.i18n, not a literal', async () => {
    registerMenusAndCommands();
    await fakeBrowser.runtime.onInstalled.trigger({ reason: 'install', temporary: false });
    // create() runs inside removeAll().then(…) — let that microtask settle.
    await Promise.resolve();

    expect(created).toHaveBeenCalledWith({
      id: `${PROJECT_PREFIX}-translate-page`,
      title: 'i18n:menuTranslatePage',
      contexts: ['page', 'selection'],
    });
  });
});
