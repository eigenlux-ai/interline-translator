/**
 * @module react-app/hooks/usePointerDrag
 *
 * Pointer drag for a fixed-position surface: press (primary button only) records
 * the grab offset and takes pointer capture so the gesture survives leaving the
 * handle; travel past a small threshold is what turns a press into a drag (below
 * it the press is still a click). The dragged box follows the pointer clamped
 * through whatever bounds the caller supplies (e.g. the viewport margin).
 *
 * Every ending — pointerup, pointercancel, lostpointercapture — settles through
 * one idempotent routine, so an interrupted drag never leaves a live press or a
 * stuck `dragging` flag behind. No long-press, no snap, no persistence: the
 * caller owns the position it is handed back.
 */

import { useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

export interface DragPoint {
  x: number;
  y: number;
}

/** Pixels the pointer must travel before a press becomes a drag (click guard). */
export const DRAG_THRESHOLD_PX = 5;

export interface UsePointerDragOptions {
  /** The dragged box's current left/top — the grab offset is measured from it. */
  position: DragPoint;
  /** Clamp a raw position into the allowed area (viewport margins etc.). */
  clamp: (pos: DragPoint) => DragPoint;
  /** A press crossed the threshold: a real drag has begun. */
  onDragStart?: () => void;
  /** Every move past the threshold, already clamped — the box follows here. */
  onDrag?: (pos: DragPoint) => void;
  /** A real drag ended (release, cancel or lost capture). */
  onDragEnd?: (pos: DragPoint) => void;
}

interface Press {
  pointerId: number;
  /** Pointer position at grab time, relative to the box's left/top. */
  dx: number;
  dy: number;
  startX: number;
  startY: number;
  dragging: boolean;
  /** Last position handed to onDrag — what an interrupted drag keeps. */
  pos: DragPoint;
}

export interface PointerDragHandlers {
  /** True while a press past the threshold is in flight (cursor, guards). */
  dragging: boolean;
  onPointerDown: (e: ReactPointerEvent) => void;
  onPointerMove: (e: ReactPointerEvent) => void;
  onPointerUp: (e: ReactPointerEvent) => void;
  onPointerCancel: (e: ReactPointerEvent) => void;
  onLostPointerCapture: (e: ReactPointerEvent) => void;
}

export function usePointerDrag(options: UsePointerDragOptions): PointerDragHandlers {
  const [dragging, setDragging] = useState(false);
  const press = useRef<Press | null>(null);

  // Handlers close over the render they were created with; the press itself
  // (offsets, ids) lives in the ref so no update can go stale mid-gesture.
  const onPointerDown = (e: ReactPointerEvent) => {
    if (e.button !== 0) return; // primary button only — right/middle never drag
    if (press.current) return; // one press at a time
    e.preventDefault(); // no text selection, no implicit scroll, no caret move
    try {
      // Capture so pointermove/up keep arriving after the pointer leaves the
      // handle — and so the release target is OUR ui (isOwnUi keeps the host
      // page's mouseup settle from firing on it).
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Capture is an optimization; the drag still works without it.
    }
    press.current = {
      pointerId: e.pointerId,
      dx: e.clientX - options.position.x,
      dy: e.clientY - options.position.y,
      startX: e.clientX,
      startY: e.clientY,
      dragging: false,
      pos: options.position,
    };
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    const p = press.current;
    if (!p || e.pointerId !== p.pointerId) return;
    if (!p.dragging) {
      if (Math.hypot(e.clientX - p.startX, e.clientY - p.startY) <= DRAG_THRESHOLD_PX) return;
      p.dragging = true;
      setDragging(true);
      options.onDragStart?.();
    }
    const pos = options.clamp({ x: e.clientX - p.dx, y: e.clientY - p.dy });
    p.pos = pos;
    options.onDrag?.(pos);
  };

  /** Idempotent: pointerup followed by lostpointercapture settles only once. */
  const end = (e: ReactPointerEvent) => {
    const p = press.current;
    if (!p || e.pointerId !== p.pointerId) return;
    press.current = null;
    if (p.dragging) {
      setDragging(false);
      options.onDragEnd?.(p.pos);
    }
    const el = e.currentTarget as HTMLElement | null;
    try {
      if (el && el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    } catch {
      // Already released — nothing to clean up.
    }
  };

  return {
    dragging,
    onPointerDown,
    onPointerMove,
    onPointerUp: end,
    onPointerCancel: end,
    onLostPointerCapture: end,
  };
}
