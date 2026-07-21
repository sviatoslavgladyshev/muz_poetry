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

/** One leaf. Slightly narrower than half the opening so seams stay visible. */
export const LEAF_WIDTH = 1.13;
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

/**
 * Distance from the hinge axis to the centre of the leaf. The leaf mesh is offset
 * by this much inside its pivot group, which is what makes the leaf rotate around
 * its outer hinge instead of around its own centre.
 */
export const LEAF_OFFSET_X = LEAF_HINGE_GAP + LEAF_WIDTH / 2;

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
  /** Near-black plum — the doors and wall. */
  ink: "#180b11",
  panel: "#2a1920",
  panelEdge: "#4a2c3a",
  plumDeep: "#3c1224",
  gold: "#c6963d",
  goldSoft: "#e3c789",
  cream: "#fbf7f0",
} as const;
