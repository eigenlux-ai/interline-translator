// @vitest-environment happy-dom
import { afterEach, describe, expect, it } from 'vitest';
import { DATA_OMNI, PROJECT_PREFIX } from '@/constants';
import { InputHint } from './indicator';

afterEach(() => {
  document.body.innerHTML = '';
});

describe('InputHint spinner', () => {
  it('keeps the petal geometry inside its own shadow root, not the host document', () => {
    // Regression: the spinner was built against `document`, so its `<use>`
    // layers (inside the hint's shadow root) referenced an id they cannot see
    // across the boundary — the spinner rendered as a blank square.
    const anchor = document.createElement('textarea');
    document.body.appendChild(anchor);
    const hint = new InputHint();
    hint.spinner(anchor);

    const shadow = document.querySelector(`${PROJECT_PREFIX}-input-hint`)!.shadowRoot!;
    expect(document.querySelectorAll(`[${DATA_OMNI.petalDefs}]`).length).toBe(0);
    const id = shadow.querySelector('use')!.getAttribute('href')!;
    expect(shadow.querySelector(`${id}[d]`)).not.toBeNull();

    hint.hide();
    expect(document.querySelector(`[${DATA_OMNI.petalDefs}]`)).toBeNull();
  });
});
