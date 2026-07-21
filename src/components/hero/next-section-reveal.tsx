"use client";

import { Heart, Sparkles } from "lucide-react";

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
  mission: string;
  highlights: Array<{
    icon: "heart" | "sparkles" | "book-open" | "drama";
    title: string;
    description: string;
  }>;
};

export function NextSectionReveal({ copy }: { copy: NextSectionCopy }) {
  return (
    <section
      aria-labelledby="door-about-heading"
      className="absolute inset-0 overflow-hidden bg-cream"
      style={{
        // Grows as the camera moves toward the doorway, so the space beyond has its
        // own parallax rather than reading as a flat backdrop pasted behind the hole.
        transform: "scale(var(--hero-beyond-scale, 1))",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_50%_40%,#fffefa_0%,var(--cream)_52%,#eee0cc_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gold/30" />

      <div className="relative h-full overflow-hidden">
        <div
          className="door-about-preview mx-auto flex min-h-full w-full max-w-6xl flex-col items-center justify-center px-5 pt-20 pb-8 text-center md:px-8 md:pt-24"
          style={{
            opacity: "var(--hero-beyond-copy-opacity, 1)",
            transform: "translateY(var(--hero-beyond-y, 0px))",
          }}
        >
          <p className="text-[11px] font-semibold tracking-[0.25em] text-gold uppercase sm:text-xs md:text-sm">
            {copy.eyebrow}
          </p>
          <h2
            id="door-about-heading"
            className="mt-3 max-w-4xl font-display text-3xl leading-[1.05] italic text-primary sm:text-4xl md:mt-4 md:text-5xl"
          >
            {copy.heading}
          </h2>
          <p className="mt-5 max-w-4xl text-[13px] leading-relaxed text-foreground/78 sm:text-sm md:mt-7 md:text-base">
            {copy.mission}
          </p>

          <div className="mt-6 grid w-full max-w-4xl gap-3 text-left sm:grid-cols-2 md:mt-8 md:gap-4">
            {copy.highlights.map((highlight) => {
              const Icon = highlight.icon === "heart" ? Heart : Sparkles;

              return (
                <article
                  key={highlight.title}
                  className="border-l-2 border-gold/55 bg-white/45 px-4 py-3 backdrop-blur-[2px] md:px-5 md:py-4"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0 text-primary" />
                    <h3 className="font-display text-lg italic text-primary md:text-xl">
                      {highlight.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/72 md:text-sm">
                    {highlight.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
