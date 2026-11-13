// @vitest-environment happy-dom
import { MantineProvider } from '@mantine/core';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PreferenceNumberInput from './PreferenceNumberInput';

afterEach(cleanup);

describe('preference number editing', () => {
  function setup(value = 22, min = 12, max = 64) {
    const commit = vi.fn();
    const view = render(
      <MantineProvider>
        <PreferenceNumberInput label="Preference" value={value} min={min} max={max} onCommit={commit} />
      </MantineProvider>
    );
    const input = view.getByLabelText('Preference') as HTMLInputElement;
    fireEvent.focusIn(input);
    return { input, commit };
  }

  it('keeps empty and one-digit drafts local until a complete value is committed', () => {
    const { input, commit } = setup();
    for (const value of ['', '2', '24']) fireEvent.change(input, { target: { value } });
    expect(input.value).toBe('24');
    expect(commit).not.toHaveBeenCalled();
    fireEvent.focusOut(input);
    expect(commit).toHaveBeenCalledExactlyOnceWith(24);
  });

  it.each([
    ['2', 12],
    ['999', 64],
  ])('clamps %s only on blur', (draft, bounded) => {
    const { input, commit } = setup();
    fireEvent.change(input, { target: { value: draft } });
    expect(commit).not.toHaveBeenCalled();
    fireEvent.focusOut(input);
    expect(input.value).toBe(String(bounded));
    expect(commit).toHaveBeenCalledExactlyOnceWith(bounded);
  });

  it('restores the saved value when an empty draft loses focus', () => {
    const { input, commit } = setup();
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.focusOut(input);
    expect(input.value).toBe('22');
    expect(commit).not.toHaveBeenCalled();
  });

  it('allows a fractional request rate and commits it with Enter', () => {
    const { input, commit } = setup(2, 0.1, 10);
    for (const value of ['0', '0.', '0.5']) fireEvent.change(input, { target: { value } });
    expect(commit).not.toHaveBeenCalled();
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(commit).toHaveBeenCalledExactlyOnceWith(0.5);
  });
});
