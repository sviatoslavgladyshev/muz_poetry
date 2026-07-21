import {
  HINGE_X,
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
  // Mobile starts much farther away because its narrow frustum has to contain the
  // leaves. It still needs to reach the threshold; otherwise the top and sides of
  // the frame continue masking the About section after the doors are fully open.
  return lite ? 1.15 : 1;
}

export function heroCameraZ(aspect: number, lite: boolean, approach: number) {
  const start = heroCameraStartZ(aspect, lite);
  const end = heroCameraEndZ(start, lite);
  return start + (end - start) * approach;
}
