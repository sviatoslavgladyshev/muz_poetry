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
 * scrolling; the fit to the doorway is done with a transform instead.
 */
const COPY_WIDTH_PX = 460;

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
            width: `${COPY_WIDTH_PX}px`,
            // Shrink to whatever the doorway currently allows, so the door leaves
            // never crop the copy. Capped at 1 so it never blows up past its design size.
            transform: `scale(min(1, calc(var(--hero-aperture, ${COPY_WIDTH_PX}px) * 0.86 / ${COPY_WIDTH_PX})))`,
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
