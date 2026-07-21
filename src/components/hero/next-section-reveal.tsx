"use client";

/**
 * What the visitor sees through the doorway: the opening of the next section.
 *
 * This sits *behind* the WebGL canvas in the stacking order. The canvas is drawn
 * with a transparent clear colour, and the wall around the doorway is opaque
 * geometry — so the only place this layer shows through is the opening itself.
 * As the leaves swing apart, more of it is uncovered.
 *
 * It deliberately mirrors the real `About` section's opening — same eyebrow, same
 * heading, same palette — so that when the hero hands off at the end of the scroll,
 * the visitor lands on the section they were already looking at rather than cutting
 * to something new.
 */

export type NextSectionCopy = {
  eyebrow: string;
  heading: string;
};

/**
 * Width the copy is laid out at. It never changes, so the text never re-flows while
 * scrolling; the fit to the doorway is done with a transform instead. Exported so
 * the scroll driver can work out the scale factor that makes it fit.
 */
export const REVEAL_COPY_WIDTH_PX = 460;

export function NextSectionReveal({ copy }: { copy: NextSectionCopy }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-cream"
      style={{
        // Grows as the camera moves toward the doorway, so the space beyond has its
        // own parallax rather than reading as a flat backdrop pasted behind the hole.
        transform: "scale(var(--hero-beyond-scale, 1))",
      }}
    >
      {/* Warm light pooling where the doorway is, falling off toward the edges. */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_center,#fffdf9_0%,var(--cream)_45%,#efe4d2_100%)]" />

      <div className="relative flex h-full items-center justify-center">
        <div
          className="text-center"
          style={{
            width: `${REVEAL_COPY_WIDTH_PX}px`,
            opacity: "var(--hero-beyond-copy-opacity, 1)",
            // Shrunk to whatever gap the doors currently leave, so the leaves never
            // crop the copy, then travelling up and out of frame as we pass through.
            // The scale arrives as a plain number from the scroll driver — CSS cannot
            // compare a length against a unitless 1, so doing this arithmetic in
            // `min()` here silently invalidates the whole transform.
            transform: "translateY(var(--hero-beyond-y, 0px)) scale(var(--hero-beyond-copy-scale, 1))",
          }}
        >
          <p className="text-xs font-semibold tracking-[0.25em] text-gold uppercase sm:text-sm">
            {copy.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl leading-snug italic text-primary md:text-4xl">
            {copy.heading}
          </h2>
        </div>
      </div>
    </div>
  );
}
