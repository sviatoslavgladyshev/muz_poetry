"use client";

import { BookOpen, Drama, Heart, Sparkles } from "lucide-react";

/**
 * What the visitor sees through the doorway: the opening of the next section.
 *
 * Rendered full-bleed under the door layer, and again inside the doorway opening
 * (clipped) so the peek during the swing matches the final composition exactly.
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

const highlightIcons = {
  heart: Heart,
  sparkles: Sparkles,
  "book-open": BookOpen,
  drama: Drama,
} as const;

/** Shared About composition — same markup for the doorway peek and the final reveal. */
export function NextSectionBody({
  copy,
  headingId,
}: {
  copy: NextSectionCopy;
  headingId?: string;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-candle" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_65%_at_50%_40%,color-mix(in_oklab,var(--candle)_92%,white)_0%,var(--candle)_52%,var(--secondary)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-leaf/30" />

      <div className="relative h-full overflow-hidden">
        <div
          className="door-about-preview mx-auto flex min-h-full w-full max-w-6xl flex-col items-center justify-center px-5 pt-20 pb-16 text-center md:px-8 md:pt-24 md:pb-20"
          style={{
            opacity: "var(--hero-beyond-copy-opacity, 1)",
            transform: "translateY(var(--hero-beyond-y, 0px))",
          }}
        >
          <p className="text-sm font-semibold tracking-[0.25em] text-leaf uppercase">
            {copy.eyebrow}
          </p>
          <h2
            id={headingId}
            className="mt-3 max-w-4xl font-display text-3xl leading-[1.05] italic text-primary sm:text-4xl md:mt-4 md:text-5xl"
          >
            {copy.heading}
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-foreground/75 md:mt-6 md:text-lg">
            {copy.mission}
          </p>

          <div className="mt-5 mb-4 grid w-full max-w-6xl snap-x snap-mandatory grid-flow-col auto-cols-[minmax(260px,82vw)] gap-3 overflow-x-auto px-0.5 pb-6 text-left [scrollbar-width:none] md:mt-7 md:mb-6 md:auto-cols-[minmax(280px,46vw)] md:gap-4 md:pb-8 xl:grid-flow-row xl:grid-cols-4 xl:auto-cols-auto xl:overflow-visible [&::-webkit-scrollbar]:hidden">
            {copy.highlights.map((highlight) => {
              const Icon = highlightIcons[highlight.icon];

              return (
                <article
                  key={highlight.title}
                  className="h-full snap-start border-l-2 border-leaf/55 bg-secondary/70 px-5 py-5 md:px-6 md:py-6"
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4 shrink-0 text-primary" />
                    <h3 className="font-display text-lg leading-tight italic text-primary">
                      {highlight.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                    {highlight.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export function NextSectionReveal({ copy }: { copy: NextSectionCopy }) {
  return (
    <section
      aria-labelledby="door-about-heading"
      className="absolute inset-0 overflow-hidden bg-candle"
      style={{
        transform: "scale(var(--hero-beyond-scale, 1))",
      }}
    >
      <NextSectionBody copy={copy} headingId="door-about-heading" />
    </section>
  );
}
