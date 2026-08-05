"use client";

import { ArrowRight, CalendarPlus } from "lucide-react";
import type { MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { scrollToSectionId } from "@/lib/scroll-to-section";

/**
 * The HTML layer of the hero: headline, supporting copy and calls to action.
 *
 * This is plain, server-rendered markup sitting above the canvas — it is present
 * and readable before any JavaScript runs and whether or not WebGL is available.
 * Its animation is driven entirely by CSS custom properties written by
 * `DoorHeroSection`, so scrolling never re-renders React.
 */

export type DoorHeroCopy = {
  eyebrow: string;
  brandDescriptor: string;
  brandName: string;
  subtitle: string;
  ctaTrial: string;
  ctaAfisha: string;
  scrollHint: string;
};

function jumpTo(id: string) {
  return (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSectionId(id);
  };
}

export function HeroCopyOverlay({ copy }: { copy: DoorHeroCopy }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
      {/*
        Lead copy: legible over the closed doors, then lifted away as the leaves
        part so it never fights the section being revealed behind them.
      */}
      <div
        className="door-hero-lead pointer-events-auto relative flex w-full max-w-[40rem] flex-col items-center rounded-2xl px-5 py-8 sm:px-8 sm:py-10"
        style={{
          opacity: "var(--hero-lead-opacity, 1)",
          transform: "translate3d(0, var(--hero-lead-y, 0px), 0)",
        }}
      >
        {/* Soft dark veil so cream type stays readable on the facade. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-[radial-gradient(ellipse_at_center,rgba(18,6,9,0.72)_0%,rgba(18,6,9,0.45)_55%,transparent_78%)]"
        />

        <div className="flex w-full items-center justify-center gap-3 sm:gap-4">
          <span className="h-px w-7 bg-leaf sm:w-12" aria-hidden="true" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-leaf drop-shadow-[0_1px_10px_rgba(0,0,0,0.85)] sm:text-sm">
            {copy.eyebrow}
          </p>
          <span className="h-px w-7 bg-leaf sm:w-12" aria-hidden="true" />
        </div>

        <p className="mt-6 font-display text-xl leading-tight text-candle drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] sm:text-2xl md:text-[1.75rem]">
          {copy.brandDescriptor}
        </p>

        <h1 className="mt-2 font-display text-5xl leading-none text-candle drop-shadow-[0_3px_28px_rgba(0,0,0,0.95)] sm:text-6xl md:text-7xl">
          {copy.brandName}
        </h1>

        <span className="mt-6 h-px w-14 bg-leaf" aria-hidden="true" />

        <p className="mt-5 max-w-md text-base leading-relaxed text-candle drop-shadow-[0_2px_14px_rgba(0,0,0,0.9)] sm:max-w-lg sm:text-lg">
          {copy.subtitle}
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            render={<a href="#kontakty" onClick={jumpTo("kontakty")} />}
            nativeButton={false}
            size="lg"
            className="bg-primary px-5 text-primary-foreground shadow-[0_8px_24px_-8px_rgba(0,0,0,0.65)] hover:bg-primary/90"
          >
            <CalendarPlus />
            {copy.ctaTrial}
          </Button>
          <Button
            render={<a href="#afisha" onClick={jumpTo("afisha")} />}
            nativeButton={false}
            size="lg"
            variant="ghost"
            className="px-5 text-candle hover:bg-candle/15 hover:text-candle"
          >
            {copy.ctaAfisha}
            <ArrowRight />
          </Button>
        </div>
      </div>

      {/* Scroll affordance — the only instruction the hero gives. */}
      <div
        aria-hidden="true"
        className="door-hero-hint absolute bottom-8 flex flex-col items-center gap-2"
        style={{ opacity: "var(--hero-hint-opacity, 1)" }}
      >
        <span className="text-[0.75rem] font-medium tracking-[0.22em] text-candle/80 uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
          {copy.scrollHint}
        </span>
        <span className="h-9 w-px bg-gradient-to-b from-leaf to-transparent" />
      </div>
    </div>
  );
}
