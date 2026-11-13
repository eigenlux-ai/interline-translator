import { useState } from 'react';
import { NumberInput, type NumberInputProps } from '@mantine/core';

type Props = Omit<NumberInputProps, 'value' | 'defaultValue' | 'onChange' | 'onBlur' | 'min' | 'max'> & {
  value: number;
  min: number;
  max: number;
  onCommit: (value: number) => void;
};

/** Keep incomplete numbers local; only persist a bounded value on commit. */
export default function PreferenceNumberInput({ value, min, max, onCommit, ...props }: Props) {
  const [draft, setDraft] = useState<string | number>(value);
  const [previous, setPrevious] = useState(value);
  const [editing, setEditing] = useState(false);
  if (previous !== value) {
    setPrevious(value);
    if (!editing) setDraft(value);
  }
  const commit = (input: string | number) => {
    const number = Number(input);
    const next = input === '' || !Number.isFinite(number) ? value : Math.min(max, Math.max(min, number));
    setDraft(next);
    if (next !== value) onCommit(next);
  };
  return (
    <NumberInput
      {...props}
      min={min}
      max={max}
      clampBehavior="none"
      value={draft}
      onFocusCapture={() => setEditing(true)}
      onChange={(next) => {
        setDraft(next);
        // Stepper buttons can be clicked without first focusing the input.
        if (!editing) commit(next);
      }}
      onBlur={() => {
        setEditing(false);
        commit(draft);
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !event.nativeEvent.isComposing) commit(draft);
      }}
    />
  );
}
