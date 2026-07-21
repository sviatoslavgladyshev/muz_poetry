/** Clamp `value` into 0..1. */
export function clamp01(value: number) {
  return value < 0 ? 0 : value > 1 ? 1 : value;
}

/**
 * Re-maps `value` from the range [start, end] onto 0..1, clamped at both ends.
 * Used to give each part of the hero its own slice of the scroll timeline.
 */
export function range(value: number, start: number, end: number) {
  return clamp01((value - start) / (end - start));
}

/** Slow start, slow stop — the "heavy mechanical" feel the doors need. */
export function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Decelerating ease, for the camera push so it never feels like it lurches. */
export function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Gentle accelerate-then-settle, used for the interior brightening. */
export function easeInOutSine(t: number) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}
