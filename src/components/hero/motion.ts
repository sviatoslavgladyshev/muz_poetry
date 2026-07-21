import { useRef } from "react";
import { easeInOutCubic, easeInOutSine, range } from "./easing";

/**
 * The single mutable object every part of the hero reads from.
 *
 * Scroll writes to `target` outside the render loop; the scene damps it into
 * `smooth` once per frame and derives everything else from that one value. Because
 * the derived values are pure functions of `smooth`, the doors, the camera, the room
 * and the HTML overlay can never drift out of phase with each other.
 *
 * Deliberately free of any Three.js import: the DOM overlay uses the same curves,
 * and this module must stay in the main bundle rather than the lazy 3D chunk.
 */
export type HeroMotion = {
  /** Raw scroll progress, 0..1. */
  target: number;
  /** Damped scroll progress — the authoritative clock for the hero. */
  smooth: number;
  /** How far the leaves have swung, 0..1, eased to feel heavy. */
  open: number;
  /** How far the camera has travelled toward the doorway, 0..1. */
  approach: number;
  /** How present the room behind the doors is, 0..1. */
  reveal: number;
};

/** Timeline: the doors hold shut briefly, then open across most of the scroll. */
const DOOR_START = 0.12;
const DOOR_END = 0.86;
/**
 * The camera only starts moving once the leaves have visibly parted, and eases in
 * as well as out — an early linear push reads as falling toward the doors rather
 * than walking toward them.
 */
const APPROACH_START = 0.22;
const APPROACH_END = 1;
/** The room brightens behind the widening gap, slightly trailing the doors. */
const REVEAL_START = 0.2;
const REVEAL_END = 0.82;

/** Derives every animated value from a single progress value. */
export function applyMotion(motion: HeroMotion, smooth: number) {
  motion.smooth = smooth;
  motion.open = easeInOutCubic(range(smooth, DOOR_START, DOOR_END));
  motion.approach = easeInOutCubic(range(smooth, APPROACH_START, APPROACH_END));
  motion.reveal = easeInOutSine(range(smooth, REVEAL_START, REVEAL_END));
}

export function createHeroMotion(initial = 0): HeroMotion {
  const motion: HeroMotion = {
    target: initial,
    smooth: initial,
    open: 0,
    approach: 0,
    reveal: 0,
  };
  applyMotion(motion, initial);
  return motion;
}

/**
 * The motion object is handed around as a ref rather than a plain value: it is
 * mutated every frame outside of React's render, which is exactly what refs are for.
 */
export function useHeroMotion(initial = 0) {
  return useRef(createHeroMotion(initial));
}
