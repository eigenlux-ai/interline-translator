import { describe, expect, it } from 'vitest';
import { BALL, EDGE_BREATH, MARGIN, clamp, placeToPos, shouldTuck, snapPlacement, tuckOffset } from './geometry';

describe('clamp', () => {
  it('returns the value when inside the range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });
  it('pins to the bounds when outside', () => {
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(99, 0, 10)).toBe(10);
  });
});

describe('placeToPos', () => {
  const W = 1000;
  const H = 800;

  it('hugs the right edge for a right placement', () => {
    expect(placeToPos({ side: 'right', topRatio: 0.5 }, W, H).x).toBe(W - BALL - MARGIN);
  });

  it('hugs the left edge for a left placement', () => {
    expect(placeToPos({ side: 'left', topRatio: 0.5 }, W, H).x).toBe(MARGIN);
  });

  it('maps topRatio to a vertical offset', () => {
    expect(placeToPos({ side: 'right', topRatio: 0.5 }, W, H).y).toBe(0.5 * H);
  });

  it('clamps the ball within the vertical margins', () => {
    // ratio 0 would put the top at 0 — pinned down to MARGIN.
    expect(placeToPos({ side: 'right', topRatio: 0 }, W, H).y).toBe(MARGIN);
    // ratio 1 would put the top past the bottom — pinned up to leave a margin.
    expect(placeToPos({ side: 'right', topRatio: 1 }, W, H).y).toBe(H - BALL - MARGIN);
  });
});

describe('snapPlacement', () => {
  const W = 1000;
  const H = 800;

  it('snaps to the left edge when the ball centre is past mid-width', () => {
    // ball at x=100 → centre 117 < 500 → left
    expect(snapPlacement(100, 400, W, H).side).toBe('left');
  });

  it('snaps to the right edge when the ball centre is right of mid-width', () => {
    expect(snapPlacement(900, 400, W, H).side).toBe('right');
  });

  it('records the vertical fraction, clamped to [0,1]', () => {
    expect(snapPlacement(900, 400, W, H).topRatio).toBeCloseTo(0.5);
    expect(snapPlacement(900, -50, W, H).topRatio).toBe(0);
    expect(snapPlacement(900, 9999, W, H).topRatio).toBe(1);
  });

  it('round-trips through placeToPos back to an edge-anchored position', () => {
    const p = snapPlacement(880, 600, W, H);
    const pos = placeToPos(p, W, H);
    expect(pos.x).toBe(W - BALL - MARGIN); // right edge
    expect(pos.y).toBe(clamp((600 / H) * H, MARGIN, H - BALL - MARGIN));
  });
});

describe('tuckOffset — half the seal slides past the edge', () => {
  it('gutterless edge (the default) holds EDGE_BREATH back from the lip', () => {
    expect(tuckOffset('right')).toBe(MARGIN + BALL / 2 - EDGE_BREATH);
    expect(tuckOffset('left')).toBe(-(MARGIN + BALL / 2 - EDGE_BREATH));
  });

  it('a real scrollbar gutter reads as air — full tuck depth against it', () => {
    expect(tuckOffset('right', 15)).toBe(MARGIN + BALL / 2);
    expect(tuckOffset('left', 15)).toBe(-(MARGIN + BALL / 2));
  });

  it('sub-pixel zoom noise is NOT a gutter', () => {
    expect(tuckOffset('right', 0.5)).toBe(MARGIN + BALL / 2 - EDGE_BREATH);
  });
});

describe('shouldTuck — every stay-out reason in one place', () => {
  const rest = { holds: [] as const, lingerUntil: 0, now: 1000 };

  it('tucks only when nothing holds it out', () => {
    expect(shouldTuck(rest)).toBe(true);
  });

  it('any single hold keeps it out', () => {
    for (const reason of ['pointer', 'panel', 'drag', 'stamp'] as const) {
      expect(shouldTuck({ ...rest, holds: [reason] }), reason).toBe(false);
    }
  });

  it('a linger window holds it out until the timestamp passes', () => {
    expect(shouldTuck({ ...rest, lingerUntil: 1500 })).toBe(false);
    expect(shouldTuck({ ...rest, lingerUntil: 1500, now: 1500 })).toBe(true);
  });
});
