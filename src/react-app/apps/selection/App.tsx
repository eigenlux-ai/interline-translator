/**
 * @module react-app/apps/selection
 *
 * 划词 translation: when the user selects text on the host page, a small 朱 pill
 * appears at the selection; clicking it streams the translation into a card
 * (kai font, translation only — no explanation). Lives in a shadow surface, so
 * its styles are fully isolated from the host page.
 *
 * Selection is read from the HOST page (content scripts share the DOM). We tag
 * our own UI with data-omni-selection-ui and ignore mouseups inside it, so
 * interacting with the pill/card doesn't dismiss it.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActionIcon,
  Badge,
  Box,
  Group,
  Paper,
  Skeleton,
  Text,
  Tooltip,
  Transition,
  UnstyledButton,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { CheckIcon, CloseIcon, CopyIcon, PinIcon, SparklesIcon, VolumeIcon } from '@/react-app/components/icons';
import { usePublicConfig } from '@/react-app/hooks/usePublicConfig';
import { DATA_OMNI, Z_INDEX } from '@/constants';
import { selectionNeighbors } from '@/dom/selection-context';
import { syncUiLocaleFrom } from '@/i18n';
import { m } from '@/paraglide/messages.js';
import { isSiteEnabled } from '@/services/config/site-control';
import { streamAnnotate, streamTranslate } from '@/services/stream/client';

interface SelectionInfo {
  text: string;
  x: number;
  y: number;
  /** Paragraphs before/after the selection — captured at selection time (the
   *  live Selection is gone by the time the user clicks 译). */
  neighbors: string[];
}

const MAX_SELECTION = 5000;

/**
 * Keys that move or extend the caret. A keyup on one of these means a keyboard
 * selection gesture just settled: with Shift it may have grown a selection,
 * without it the selection collapsed. Both end in the same settle pass, which
 * decides show-or-dismiss — so a plain arrow can never leave a stale pill
 * anchored at a caret the user has already walked away from.
 */
const CARET_KEYS: Record<string, true> = {
  ArrowLeft: true,
  ArrowRight: true,
  ArrowUp: true,
  ArrowDown: true,
  Home: true,
  End: true,
  PageUp: true,
  PageDown: true,
};

/**
 * Keyup, not keydown, and coalesced by KEY_SETTLE_MS: a held arrow fires one
 * keyup at release, and a burst of deliberate presses collapses into a single
 * settle. The pill must never chase a selection the user is still extending.
 */
const KEY_SETTLE_MS = 180;

function isSelectionGesture(e: KeyboardEvent): boolean {
  if (CARET_KEYS[e.key]) return true;
  // Ctrl/⌘-A takes the whole document in one stroke — the other way a keyboard
  // user arrives at a selection without ever touching an arrow.
  return (e.key === 'a' || e.key === 'A') && (e.ctrlKey || e.metaKey);
}

/**
 * Emphasize 「anchor」 quotes in 注疏 notes — the passage-mode prompt makes
 * each note begin with the exact source fragment it explains, so the eye can
 * jump from note to word. Plain string transform over the streaming text;
 * unmatched/unclosed quotes pass through untouched.
 */
function renderNoteAnchors(notes: string): React.ReactNode {
  const parts = notes.split(/(「[^」\n]{1,24}」)/);
  if (parts.length === 1) return notes;
  return parts.map((part, i) =>
    part.startsWith('「') && part.endsWith('」') ? (
      <span key={i} style={{ fontWeight: 600 }}>
        {part}
      </span>
    ) : (
      part
    )
  );
}

/**
 * Caret rect at the selection FOCUS — where the user actually released the
 * drag (backward selections put focus at the START; that is still where the
 * hand is). A selection's bounding box anchors the pill at the block's
 * bottom-left, which on wide rows (GitHub issue lists) lands hundreds of px
 * from the release point. Chrome returns a caret-height rect for a collapsed
 * range in text; empty/odd positions fall back to null (caller uses the
 * mouseup point, then the bounding box).
 */
function caretRectAtFocus(s: Selection): DOMRect | null {
  if (!s.focusNode) return null;
  const r = document.createRange();
  try {
    r.setStart(s.focusNode, s.focusOffset);
    r.collapse(true);
  } catch {
    return null;
  }
  const rect = r.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0) {
    const rects = r.getClientRects();
    return rects.length > 0 ? rects[0] : null;
  }
  return rect;
}

function isOwnUi(e: Event): boolean {
  return e.composedPath().some((n) => (n as HTMLElement)?.dataset?.omniSelectionUi !== undefined);
}

/**
 * The selection's text EXCLUDING our own injected 译文. On a translated page a
 * paragraph sweep drags the gloss along — `sel.toString()` would send a
 * Chinese-English mash back to the engine and present garbage as the result.
 */
function selectionSourceText(sel: Selection): string {
  let text = '';
  for (let i = 0; i < sel.rangeCount; i++) {
    const fragment = sel.getRangeAt(i).cloneContents();
    fragment.querySelectorAll(`[${DATA_OMNI.translated}]`).forEach((gloss) => gloss.remove());
    text += fragment.textContent ?? '';
  }
  return text.trim();
}

export default function SelectionApp() {
  const theme = useMantineTheme();
  const scheme = useComputedColorScheme('light');
  const [sel, setSel] = useState<SelectionInfo | null>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesFailed, setNotesFailed] = useState(false);
  const [config] = usePublicConfig();
  const siteEnabled = !!config && isSiteEnabled(config.siteControl, location.hostname);
  // 注疏 — the reader's-companion notes under the translation. LLM-only: with
  // the free MT as the default engine the affordance simply doesn't exist.
  const canAnnotate = config ? config.defaultProviderKind !== '' && config.defaultProviderKind !== 'google-mt' : false;
  // The card speaks the language its user reads; synced before any m.*() below.
  syncUiLocaleFrom(config);
  const reqId = useRef(0);
  const pending = useRef<AbortController | null>(null);
  const invalidate = useCallback(() => {
    reqId.current++;
    pending.current?.abort();
    pending.current = null;
  }, []);
  useEffect(() => () => invalidate(), [invalidate]);
  const pillRef = useRef<HTMLButtonElement>(null);
  /** The showing pill was summoned by the keyboard, and no Tab has claimed it yet. */
  const pillAwaitsTab = useRef(false);

  const dismiss = useCallback(() => {
    invalidate();
    setSel(null);
    setOpen(false);
    setPinned(false);
    pillAwaitsTab.current = false;
  }, [invalidate]);

  useEffect(() => {
    let timer: number | undefined;
    /**
     * A selection gesture finished: measure what is selected and (re)anchor the
     * pill, or dismiss when nothing translatable is left.
     */
    const settle = (point: { x: number; y: number } | null) => {
      if (pinned) return;
      const s = window.getSelection();
      const text = s && s.rangeCount > 0 ? selectionSourceText(s) : '';
      if (!text || text.length > MAX_SELECTION) {
        dismiss();
        return;
      }
      const rect = s!.getRangeAt(0).getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      const caret = caretRectAtFocus(s!);
      const ax = caret ? caret.left : point?.x || rect.left;
      const ay = caret ? caret.bottom : point?.y || rect.bottom;
      invalidate();
      pillAwaitsTab.current = point === null;
      setSel({ text, x: ax, y: ay, neighbors: selectionNeighbors(s!) });
      setOpen(false);
      setResult('');
    };
    const schedule = (delay: number, point: { x: number; y: number } | null) => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => settle(point), delay);
    };
    const onMouseUp = (e: MouseEvent) => {
      if (isOwnUi(e) || pinned) return;
      schedule(0, { x: e.clientX, y: e.clientY });
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (isOwnUi(e) || !isSelectionGesture(e) || pinned) return;
      schedule(KEY_SETTLE_MS, null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss();
        return;
      }
      if (e.key !== 'Tab' || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) return;
      if (!pillAwaitsTab.current || !pillRef.current) return;
      const active = document.activeElement?.tagName;
      if (active && active !== 'BODY' && active !== 'HTML') return;
      pillAwaitsTab.current = false;
      e.preventDefault();
      pillRef.current.focus({ preventScroll: true });
    };
    const onScroll = (e: Event) => {
      if (isOwnUi(e) || pinned) return;
      dismiss();
    };
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKey);
    document.addEventListener('scroll', onScroll, { capture: true, passive: true });
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('scroll', onScroll, { capture: true });
    };
  }, [dismiss, pinned, invalidate]);

  useEffect(() => {
    // A storage policy change must invalidate the active stream and its transient UI.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (config && !siteEnabled) dismiss();
  }, [config, siteEnabled, dismiss]);

  const annotate = useCallback(async (source: string, translation: string) => {
    pending.current?.abort();
    const controller = new AbortController();
    pending.current = controller;
    const id = reqId.current;
    setNotesLoading(true);
    setNotesFailed(false);
    setNotes('');
    let got = '';
    try {
      for await (const delta of streamAnnotate(
        { text: source, translation, target: '' },
        undefined,
        controller.signal
      )) {
        if (id !== reqId.current) return;
        got += delta;
        setNotes(got);
      }
      if (id === reqId.current && !got.trim()) setNotesFailed(true);
    } catch {
      if (id === reqId.current) setNotesFailed(true);
    } finally {
      if (id === reqId.current) setNotesLoading(false);
    }
  }, []);

  const translate = useCallback(async () => {
    if (!sel || !siteEnabled) return;
    invalidate();
    const id = reqId.current;
    const controller = new AbortController();
    pending.current = controller;
    setOpen(true);
    setLoading(true);
    setResult('');
    setFailed(false);
    setNotesLoading(false);
    setNotesOpen(false);
    setNotes('');
    setNotesFailed(false);
    let got = '';
    try {
      for await (const delta of streamTranslate(
        {
          text: sel.text,
          source: 'auto',
          target: '',
          context: {
            domain: location.hostname || undefined,
            title: document.title.trim().slice(0, 200) || undefined,
            neighbors: sel.neighbors.length ? sel.neighbors : undefined,
          },
        },
        undefined,
        controller.signal
      )) {
        if (id !== reqId.current) return;
        got += delta;
        setResult(got);
      }
      if (id === reqId.current && !got) setFailed(true);
    } catch {
      if (id === reqId.current) setFailed(true);
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, [sel, siteEnabled, invalidate]);

  const speak = (txt: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && txt) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(txt);
      window.speechSynthesis.speak(utter);
    }
  };

  if (!sel || !siteEnabled) return null;
  const other = theme.other as {
    fontKai?: string;
    paperRaised: { light: string; dark: string };
    hair: { light: string; dark: string };
    gloss: { light: string; dark: string };
    inkSoft: { light: string; dark: string };
    inkFaint: { light: string; dark: string };
  };
  const fontKai = other.fontKai;

  const width = open ? 348 : 36;
  const cardMaxH = Math.min(window.innerHeight * 0.4, 480);
  const left = Math.max(8, Math.min(sel.x, window.innerWidth - width - 8));
  const top = Math.max(8, Math.min(sel.y + 6, window.innerHeight - (open ? cardMaxH + 8 : 40)));

  return (
    <Box
      data-omni-selection-ui=""
      onKeyDown={(e) => {
        if (e.key === 'Escape') dismiss();
      }}
      style={{
        position: 'fixed',
        left,
        top,
        zIndex: Z_INDEX.popover,
      }}
    >
      {!open && (
        <UnstyledButton
          ref={pillRef}
          onClick={translate}
          aria-label={m.sel_translate_aria()}
          data-testid="omni-selection-pill"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 28,
            height: 28,
            borderRadius: 6,
            background: 'var(--mantine-color-cinnabar-6)',
            color: '#FFFDF8',
            fontFamily: fontKai,
            fontSize: 15,
            fontWeight: 600,
            boxShadow: '0 2px 6px rgba(194, 64, 42, 0.35)',
            cursor: 'pointer',
            transition: 'transform 0.14s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.14s ease',
          }}
        >
          译
        </UnstyledButton>
      )}

      {/* 夹笺卡片 */}
      {sel && (
        <Transition mounted={open} transition="fade-up" duration={180} timingFunction="cubic-bezier(0.22, 1, 0.36, 1)">
          {(enter) => (
            <Paper
              radius="md"
              style={{
                ...enter,
                width: 340,
                maxHeight: cardMaxH,
                display: 'flex',
                flexDirection: 'column',
                background: other.paperRaised[scheme],
                border: `1px solid ${other.hair[scheme]}`,
                boxShadow: theme.shadows.lg,
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <Group
                justify="space-between"
                align="center"
                px={10}
                py={6}
                wrap="nowrap"
                style={{ borderBottom: `1px solid ${other.hair[scheme]}` }}
              >
                <Group gap={6} align="center">
                  <Box
                    aria-hidden
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      background: 'var(--mantine-color-cinnabar-6)',
                      color: '#FFFDF8',
                      fontFamily: fontKai,
                      fontSize: 12,
                      lineHeight: '20px',
                      textAlign: 'center',
                      userSelect: 'none',
                      fontWeight: 600,
                    }}
                  >
                    译
                  </Box>
                  <Badge size="xs" variant="subtle" color="gray">
                    {m.display_translation()}
                  </Badge>
                </Group>

                <Group gap={4} align="center">
                  {result && !loading && !failed && (
                    <>
                      <Tooltip label={m.sel_speak()} withArrow>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color="gray"
                          onClick={() => speak(result)}
                          aria-label={m.sel_speak()}
                        >
                          <VolumeIcon width={13} height={13} />
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label={copied ? m.gloss_copied() : m.sel_copy()} withArrow>
                        <ActionIcon
                          size="sm"
                          variant="subtle"
                          color={copied ? 'cinnabar' : 'gray'}
                          onClick={() => {
                            void navigator.clipboard?.writeText(result);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 1200);
                          }}
                          aria-label={m.sel_copy()}
                        >
                          {copied ? <CheckIcon width={13} height={13} /> : <CopyIcon width={13} height={13} />}
                        </ActionIcon>
                      </Tooltip>
                    </>
                  )}

                  <Tooltip label={pinned ? m.sel_unpin() : m.sel_pin()} withArrow>
                    <ActionIcon
                      size="sm"
                      variant={pinned ? 'light' : 'subtle'}
                      color={pinned ? 'cinnabar' : 'gray'}
                      onClick={() => setPinned(!pinned)}
                      aria-label={pinned ? m.sel_unpin() : m.sel_pin()}
                    >
                      <PinIcon width={13} height={13} />
                    </ActionIcon>
                  </Tooltip>

                  <Tooltip label={m.common_close()} withArrow>
                    <ActionIcon size="sm" variant="subtle" color="gray" onClick={dismiss} aria-label={m.common_close()}>
                      <CloseIcon width={13} height={13} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Group>

              {/* Body */}
              <Box px={14} py={10} style={{ overflowY: 'auto', flex: 1 }}>
                {loading && !result ? (
                  <Box py={4}>
                    <Skeleton height={14} radius="sm" mb={8} width="90%" />
                    <Skeleton height={14} radius="sm" mb={8} width="75%" />
                    <Skeleton height={14} radius="sm" width="50%" />
                    <Text mt={8} style={{ fontFamily: fontKai, fontSize: 12, color: other.inkFaint[scheme] }}>
                      {m.common_translating()}
                    </Text>
                  </Box>
                ) : failed ? (
                  <Group gap="sm" wrap="nowrap">
                    <Text size="sm" c="var(--mantine-color-danger-6)">
                      {m.common_translate_failed()}
                    </Text>
                    <UnstyledButton
                      onClick={translate}
                      style={{ fontSize: 13, fontWeight: 500, color: 'var(--mantine-color-cinnabar-6)' }}
                    >
                      {m.common_retry()}
                    </UnstyledButton>
                  </Group>
                ) : (
                  <>
                    <Text
                      style={{
                        fontFamily: fontKai,
                        fontSize: 14.5,
                        lineHeight: 1.8,
                        color: other.gloss[scheme],
                        wordBreak: 'break-word',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {result}
                    </Text>

                    {canAnnotate && result && (
                      <Box mt={10} pt={8} style={{ borderTop: `1px solid ${other.hair[scheme]}` }}>
                        <UnstyledButton
                          onClick={() => {
                            const next = !notesOpen;
                            setNotesOpen(next);
                            if (next && !notes && !notesLoading) void annotate(sel.text, result);
                          }}
                          aria-expanded={notesOpen}
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: 'var(--mantine-color-cinnabar-7)',
                            fontFamily: fontKai,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <SparklesIcon width={12} height={12} />
                          {`${m.sel_notes()} ${notesOpen ? '▾' : '▸'}`}
                        </UnstyledButton>

                        {notesOpen && (
                          <Box
                            mt={6}
                            p={8}
                            style={{
                              borderRadius: 6,
                              backgroundColor: 'color-mix(in srgb, var(--mantine-color-cinnabar-6) 4%, transparent)',
                              border: `1px solid ${other.hair[scheme]}`,
                            }}
                          >
                            {notesLoading && !notes ? (
                              <Box py={2}>
                                <Skeleton height={12} radius="sm" mb={4} width="80%" />
                                <Skeleton height={12} radius="sm" width="60%" />
                                <Text
                                  mt={4}
                                  style={{ fontFamily: fontKai, fontSize: 11, color: other.inkFaint[scheme] }}
                                >
                                  {m.sel_notes_loading()}
                                </Text>
                              </Box>
                            ) : notesFailed ? (
                              <Group gap="sm" wrap="nowrap">
                                <Text size="xs" c="var(--mantine-color-danger-6)">
                                  {m.sel_notes_failed()}
                                </Text>
                                <UnstyledButton
                                  onClick={() => void annotate(sel.text, result)}
                                  style={{ fontSize: 12, fontWeight: 500, color: 'var(--mantine-color-cinnabar-6)' }}
                                >
                                  {m.common_retry()}
                                </UnstyledButton>
                              </Group>
                            ) : (
                              <Text
                                style={{
                                  fontFamily: fontKai,
                                  fontSize: 13,
                                  lineHeight: 1.7,
                                  color: other.inkSoft[scheme],
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-word',
                                }}
                              >
                                {renderNoteAnchors(notes)}
                              </Text>
                            )}
                          </Box>
                        )}
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Paper>
          )}
        </Transition>
      )}
    </Box>
  );
}
