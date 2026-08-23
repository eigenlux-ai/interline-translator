import { describe, expect, it } from 'vitest';
import { DATA_OMNI, PROJECT_PREFIX } from '@/constants';
import { INJECT_ATTR, INJECT_REQ, INJECT_RES, MAIN_WORLD_EDITOR_SELECTOR, stripTriggerSpaces } from './protocol';

describe('injector wire protocol constants', () => {
  it('derives message keys from PROJECT_PREFIX (host-collision-free, single source)', () => {
    expect(INJECT_REQ).toBe(`${PROJECT_PREFIX}:inject-req`);
    expect(INJECT_RES).toBe(`${PROJECT_PREFIX}:inject-res`);
    expect(INJECT_REQ).not.toBe(INJECT_RES);
  });

  it('sources the marker attribute from DATA_OMNI (the host-DOM marker registry)', () => {
    expect(INJECT_ATTR).toBe(DATA_OMNI.injectId);
    expect(INJECT_ATTR).toMatch(/^data-/);
  });

  it('targets editable bodies/conduits, never bare container chrome', () => {
    const parts = MAIN_WORLD_EDITOR_SELECTOR.split(',');
    // Container-chrome selectors would capture auxiliary inputs (find widget,
    // link tooltip, search panel) and route them to whole-document writes.
    expect(parts).not.toContain('.ql-container');
    expect(parts).not.toContain('.cm-editor');
    expect(parts).not.toContain('.monaco-editor');
    expect(parts).toContain('.ql-editor');
    expect(parts).toContain('.cm-content');
    expect(parts).toContain('.monaco-editor textarea.inputarea');
  });
});

describe('stripTriggerSpaces', () => {
  it('strips only trailing ASCII spaces (the sole residue the space-gesture can leave)', () => {
    expect(stripTriggerSpaces('hello   ')).toBe('hello');
    expect(stripTriggerSpaces('hello')).toBe('hello');
  });

  it('preserves newlines/tabs/full-width spaces — those are real user input', () => {
    expect(stripTriggerSpaces('hello\n\n')).toBe('hello\n\n');
    expect(stripTriggerSpaces('hello\t')).toBe('hello\t');
    expect(stripTriggerSpaces('hello　')).toBe('hello　'); // U+3000
    expect(stripTriggerSpaces('hello\n  ')).toBe('hello\n'); // spaces after \n stripped, \n kept
  });

  it('does not touch interior whitespace', () => {
    expect(stripTriggerSpaces('hello world  ')).toBe('hello world');
  });
});
