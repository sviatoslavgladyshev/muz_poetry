import { MathUtils } from "three";

/**
 * Shared dimensions for the door hero.
 *
 * The whole scene is modelled in "metres", laid out so that:
 *   - the meeting edge of the two leaves sits at `x = 0`
 *   - the wall's front face sits at `z = 0`, the wall itself extends to negative z
 *   - the leaves sit just proud of the wall and swing outward, toward the camera
 *
 * Keeping every measurement here means the frame, the hinges and the pivot
 * groups can never drift out of alignment with each other.
 */

/** Clear width of the doorway (both leaves together). */
export const OPENING_WIDTH = 2.3;
/** Clear height of the doorway. */
export const OPENING_HEIGHT = 3.4;

/** Hinge axes sit on the outer edges of the opening: x = -HINGE_X and x = +HINGE_X. */
export const HINGE_X = OPENING_WIDTH / 2;

/** The reference entrance uses a narrow pedestrian leaf and a wider two-panel leaf. */
export const LEFT_LEAF_WIDTH = 0.8;
export const RIGHT_LEAF_WIDTH = 1.47;
/**
 * Slightly taller than the clear opening. The leaves sit in front of the wall, so
 * the extra 2cm at top and bottom laps over the reveal the way a real door does —
 * without it, daylight from the space beyond leaks over the door heads as a hard
 * bright line.
 */
export const LEAF_HEIGHT = OPENING_HEIGHT + 0.04;
export const LEAF_THICKNESS = 0.14;

/** Gap between the hinge axis and the leaf's outer edge — reads as a shadow reveal. */
export const LEAF_HINGE_GAP = 0.01;

/** Leaves sit just in front of the wall face so they can swing outward without clipping it. */
export const LEAF_CENTER_Z = LEAF_THICKNESS / 2 + 0.02;

/** How far the doors open. ~86° reads as "fully open" without going perfectly flat. */
export const MAX_OPEN_ANGLE = MathUtils.degToRad(86);

/** The surrounding wall the doorway is cut into. Large enough to fill any viewport. */
export const WALL_WIDTH = 30;
export const WALL_HEIGHT = 20;
export const WALL_DEPTH = 0.8;

/**
 * Inner edges of the architectural trim. Held clear of the hinge axes so the
 * swinging leaves (which sweep a circle of radius LEAF_WIDTH around each hinge)
 * never intersect the frame.
 */
export const TRIM_INNER_X = HINGE_X + 0.13;
export const TRIM_INNER_Y = OPENING_HEIGHT / 2 + 0.06;
export const TRIM_DEPTH = 0.16;

/** Floor level, shared by the threshold and the interior floor. */
export const FLOOR_Y = -OPENING_HEIGHT / 2;

/** Brand palette, mirrored from globals.css so the 3D scene stays on-brand. */
export const PALETTE = {
  /** Dark plum wall with aged walnut architecture and muted antique brass. */
  ink: "#180b11",
  wood: "#4f352e",
  woodDark: "#3c211c",
  woodLight: "#9a6850",
  panel: "#5a3027",
  panelEdge: "#8a5945",
  plumDeep: "#3b1723",
  gold: "#a87936",
  goldSoft: "#d5b06a",
  cream: "#fbf7f0",
} as const;
