import { HINGE_X, OPENING_HEIGHT, TRIM_INNER_X } from "./door-config";

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
 * Where the camera ends. Desktop finishes right on the threshold with the opening
 * filling the frame; the cream veil at the end of the scroll carries the visitor
 * through. On a narrow viewport the doorway already fills the width at rest, so
 * almost any forward travel pushes the frame out of shot — mobile barely moves.
 */
export function heroCameraEndZ(startZ: number, lite: boolean) {
  return lite ? startZ * 0.78 : 2.4;
}

export function heroCameraZ(aspect: number, lite: boolean, approach: number) {
  const start = heroCameraStartZ(aspect, lite);
  const end = heroCameraEndZ(start, lite);
  return start + (end - start) * approach;
}

/**
 * How wide the doorway appears on screen, in CSS pixels, at the current camera
 * position. Used to size the copy showing through the opening so the door leaves
 * never clip it.
 */
export function apertureWidthPx(
  viewportWidth: number,
  viewportHeight: number,
  lite: boolean,
  approach: number,
) {
  const aspect = viewportWidth / viewportHeight;
  const z = heroCameraZ(aspect, lite, approach);
  // Half the world-space width visible at the plane of the doorway (z = 0).
  const halfVisible = z * Math.tan((CAMERA_FOV * Math.PI) / 360) * aspect;
  return (HINGE_X / halfVisible) * viewportWidth;
}
