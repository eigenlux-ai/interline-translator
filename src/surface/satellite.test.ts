import { afterEach, describe, expect, it } from 'vitest';
import { SATELLITE_TAG } from '@/constants';
import { createSatellite } from './satellite';

/**
 * Satellite lifecycle management, tested through the public createSatellite API
 * (since the registry is internal). happy-dom provides attachShadow, MutationObserver,
 * and microtasks, which effectively cover the DOM behaviors: cleaning up orphans,
 * re-attaching when anchors move (B3), and repairing adjacency based on position.
 * Note that styling and React portals (e.g., adoptedStyleSheets) are NOT covered
 * in these tests and require verification in a real browser.
 */

// Flush MutationObserver callback → queued sweep microtask → DOM settle.
const sweep = () => new Promise((resolve) => setTimeout(resolve, 0));

const sat = (el: Element | null): boolean => el?.tagName.toLowerCase() === SATELLITE_TAG;

afterEach(async () => {
  document.body.replaceChildren(); // removing anchors triggers the sweep to reap satellites
  await sweep();
});

describe('satellite lifecycle', () => {
  it('inserts the satellite as the anchor next sibling (default afterend)', () => {
    const anchor = document.createElement('p');
    document.body.append(anchor);
    createSatellite(anchor, null);
    expect(sat(anchor.nextElementSibling)).toBe(true);
  });

  it('destroys an orphaned satellite when its anchor is removed', async () => {
    const anchor = document.createElement('p');
    document.body.append(anchor);
    createSatellite(anchor, null);
    expect(document.querySelectorAll(SATELLITE_TAG)).toHaveLength(1);

    anchor.remove();
    await sweep();
    expect(document.querySelectorAll(SATELLITE_TAG)).toHaveLength(0);
  });

  it('re-attaches the satellite when the anchor is moved (B3)', async () => {
    const anchor = document.createElement('p');
    const otherParent = document.createElement('section');
    document.body.append(anchor, otherParent);
    createSatellite(anchor, null);

    otherParent.append(anchor); // re-parent the anchor, keeping it connected
    expect(sat(anchor.nextElementSibling)).toBe(false); // left behind, pre-sweep
    await sweep();
    expect(sat(anchor.nextElementSibling)).toBe(true); // followed to new location
    expect(document.querySelectorAll(SATELLITE_TAG)).toHaveLength(1); // moved, not recreated
  });

  it('repairs adjacency when a node is inserted between anchor and satellite', async () => {
    const anchor = document.createElement('p');
    document.body.append(anchor);
    createSatellite(anchor, null);

    anchor.insertAdjacentElement('afterend', document.createElement('span')); // intruder
    expect(sat(anchor.nextElementSibling)).toBe(false);
    await sweep();
    expect(sat(anchor.nextElementSibling)).toBe(true);
  });

  it('honors a non-default position and repairs it (beforebegin)', async () => {
    const anchor = document.createElement('p');
    document.body.append(anchor);
    createSatellite(anchor, null, { position: 'beforebegin' });
    expect(sat(anchor.previousElementSibling)).toBe(true);

    anchor.insertAdjacentElement('beforebegin', document.createElement('span')); // intruder before
    expect(sat(anchor.previousElementSibling)).toBe(false);
    await sweep();
    expect(sat(anchor.previousElementSibling)).toBe(true);
  });
});
