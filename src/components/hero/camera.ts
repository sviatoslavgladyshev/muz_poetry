import {
  HINGE_X,
  LEAF_CENTER_Z,
  LEAF_HINGE_GAP,
  LEAF_THICKNESS,
  LEAF_WIDTH,
  MAX_OPEN_ANGLE,
  OPENING_HEIGHT,
  TRIM_INNER_X,
} from "./door-config";

/**
 * Camera maths shared by the 3D scene and the DOM layers.
 *
 * Both need to agree on exactly where the camera is: the scene to place it, and the
 * overlay to work out how wide the doorway currently appears on screen so the copy
 * behind it can be sized to fit. Deriving both from the same functions means they
 * cannot drift apart.
 */

export const CAMERA_FOV = 38;

/** Distance at which an object of the given half-extents exactly fills the frame. */
function fitDistance(aspect: number, halfWidth: number, halfHeight: number) {
  const tanHalfFov = Math.tan((CAMERA_FOV * Math.PI) / 360);
  return Math.max(halfHeight / tanHalfFov, halfWidth / (tanHalfFov * aspect));
}

/** Where the camera starts: the doors framed to dominate the viewport. */
export function heroCameraStartZ(aspect: number, lite: boolean) {
  // Narrow screens frame to the leaves alone; wide screens include the trim.
  const halfWidth = lite ? HINGE_X * 1.05 : TRIM_INNER_X + 0.24;
  return fitDistance(aspect, halfWidth, (OPENING_HEIGHT / 2) * 1.14);
}

/**
 * Where the camera ends: close enough to the threshold that the whole wall — front
 * face *and* the far side of its 0.8m-deep reveal — has left the frame, so the
 * section beyond the doors is simply the entire picture. That is what makes the
 * hand-off continuous without any kind of fade.
 *
 * It stops just short of the doorway rather than driving through it. Travelling
 * further does not improve the shot (the wall is already gone) and eats the end of
 * the timeline: every extra metre is scroll distance spent on a frame that has
 * stopped changing, and it pulls the doors out of view far too early.
 */
export function heroCameraEndZ(startZ: number, lite: boolean) {
  return lite ? startZ * 0.78 : 1;
}

export function heroCameraZ(aspect: number, lite: boolean, approach: number) {
  const start = heroCameraStartZ(aspect, lite);
  const end = heroCameraEndZ(start, lite);
  return start + (end - start) * approach;
}

/**
 * How wide the gap between the doors appears on screen, in CSS pixels.
 *
 * Used to size the copy showing through the opening so the leaves never crop it.
 * Two things can be the limit, and the narrower one wins:
 *
 *   - the wall opening itself, once the doors are wide enough to clear it
 *   - the free (leading) edge of each leaf, which is what actually blocks the view
 *     for most of the animation — a half-open door hides far more of the doorway
 *     than the wall does
 *
 * Both edges are projected properly rather than approximated, because the leaf edge
 * swings toward the camera as it opens and so grows much faster in screen space than
 * its world position alone would suggest.
 */
export function apertureWidthPx(
  viewportWidth: number,
  viewportHeight: number,
  lite: boolean,
  approach: number,
  open: number,
) {
  const aspect = viewportWidth / viewportHeight;
  const cameraZ = heroCameraZ(aspect, lite, approach);
  const tanHalfFov = Math.tan((CAMERA_FOV * Math.PI) / 360);

  /** Half the frame width, in world units, at the given depth. */
  const halfVisibleAt = (worldZ: number) => (cameraZ - worldZ) * tanHalfFov * aspect;

  // The leaf's free edge, swung out around its hinge. The leaf has real thickness,
  // and what actually bounds the view is the corner of that edge nearest the centre
  // line — offset half a thickness along the leaf's normal. Using the edge's centre
  // instead over-reports the gap by about a fifth at half-open, which is exactly
  // where the copy behind gets clipped.
  const angle = open * MAX_OPEN_ANGLE;
  const edgeReach = LEAF_HINGE_GAP + LEAF_WIDTH;
  const halfThickness = LEAF_THICKNESS / 2;
  const edgeX = HINGE_X - edgeReach * Math.cos(angle) - halfThickness * Math.sin(angle);
  const edgeZ = LEAF_CENTER_Z + edgeReach * Math.sin(angle) - halfThickness * Math.cos(angle);

  const wallSpan = halfVisibleAt(0);
  const doorSpan = halfVisibleAt(edgeZ);

  // Camera level with (or past) either edge: nothing is framing the view any more.
  if (wallSpan <= 0.05 || doorSpan <= 0.05) return viewportWidth * 10;

  const halfFraction = Math.min(HINGE_X / wallSpan, edgeX / doorSpan);
  return Math.max(halfFraction, 0) * viewportWidth;
}
