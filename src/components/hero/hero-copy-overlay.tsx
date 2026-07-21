"use client";

import { ArrowRight, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export function HeroCopyOverlay({ copy }: { copy: DoorHeroCopy }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-5 text-center">
      {/*
        Lead copy: legible over the closed doors, then lifted away as the leaves
        part so it never fights the section being revealed behind them.
      */}
      <div
        className="door-hero-lead pointer-events-auto flex w-full max-w-[38rem] flex-col items-center"
        style={{
          opacity: "var(--hero-lead-opacity, 1)",
          transform: "translate3d(0, var(--hero-lead-y, 0px), 0)",
        }}
      >
        <div className="flex w-full items-center justify-center gap-3 sm:gap-4">
          <span className="h-px w-7 bg-gold-soft/45 sm:w-12" aria-hidden="true" />
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-gold-soft sm:text-xs">
            {copy.eyebrow}
          </p>
          <span className="h-px w-7 bg-gold-soft/45 sm:w-12" aria-hidden="true" />
        </div>

        <p className="mt-6 font-display text-xl font-medium leading-tight text-cream/80 drop-shadow-[0_2px_18px_rgba(0,0,0,0.75)] sm:text-2xl">
          {copy.brandDescriptor}
        </p>

        <h1 className="mt-2 font-display text-5xl font-semibold leading-none text-gold-soft drop-shadow-[0_2px_24px_rgba(0,0,0,0.8)] sm:text-6xl md:text-7xl">
          {copy.brandName}
        </h1>

        <span className="mt-6 h-px w-14 bg-gold-soft/55" aria-hidden="true" />

        <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70 drop-shadow-[0_1px_12px_rgba(0,0,0,0.8)] sm:max-w-lg sm:text-base">
          {copy.subtitle}
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            render={<a href="#kontakty" />}
            nativeButton={false}
            size="lg"
            className="rounded-[6px] bg-accent px-4 text-accent-foreground hover:bg-accent/90"
          >
            <CalendarPlus />
            {copy.ctaTrial}
          </Button>
          <Button
            render={<a href="#afisha" />}
            nativeButton={false}
            size="lg"
            variant="ghost"
            className="rounded-[6px] px-4 text-cream/80 hover:bg-cream/10 hover:text-cream"
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
        <span className="text-[0.7rem] font-medium tracking-[0.22em] text-cream/55 uppercase">
          {copy.scrollHint}
        </span>
        <span className="h-9 w-px bg-gradient-to-b from-gold-soft/70 to-transparent" />
      </div>
    </div>
  );
}
