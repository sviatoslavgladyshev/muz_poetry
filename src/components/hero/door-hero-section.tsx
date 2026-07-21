"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef } from "react";
import { apertureWidthPx } from "./camera";
import { clamp01, easeInOutCubic, easeInOutSine, range } from "./easing";
import { DoorHeroFallback } from "./door-hero-fallback";
import { HeroCopyOverlay, type DoorHeroCopy } from "./hero-copy-overlay";
import { NextSectionReveal, type NextSectionCopy } from "./next-section-reveal";
import { useHeroQuality } from "./use-hero-quality";
import { useScrollProgress } from "./use-scroll-progress";

/**
 * The 3D scene is the single heaviest thing on the page, so it is split into its
 * own chunk and never server-rendered: Three.js touches `window` at module scope,
 * and the hero is fully readable without it.
 */
const DoorScene = dynamic(() => import("./door-scene"), {
  ssr: false,
  loading: () => <DoorHeroFallback />,
});

/**
 * Pose the scene freezes at when the visitor has asked for reduced motion: the
 * doors caught part-way open, with warm light just beginning to spill through.
 * Kept early enough on the timeline that the doorway is still dark behind the
 * headline, which is set in cream.
 */
const REDUCED_MOTION_POSE = 0.34;

/**
 * The overlay pose that goes with it. Written directly rather than derived from
 * the timeline: at any single point on the scroll the lead copy is mid-fade, and a
 * visitor who never scrolls must see the headline and both CTAs at full strength.
 */
function writeStaticOverlayVars(stage: HTMLElement | null) {
  if (!stage) return;
  stage.style.setProperty("--hero-lead-opacity", "1");
  stage.style.setProperty("--hero-lead-y", "0px");
  stage.style.setProperty("--hero-beyond-scale", "1");
  stage.style.setProperty("--hero-hint-opacity", "0");
  stage.style.setProperty("--hero-exit-opacity", "0");
}

/**
 * Writes the overlay's animated values as CSS custom properties.
 *
 * Driving the DOM through custom properties — rather than React state — keeps the
 * whole hero at zero re-renders while scrolling. The curves intentionally mirror
 * the ones in `motion.ts` so the copy and the doors stay in step.
 */
function writeOverlayVars(stage: HTMLElement | null, progress: number, lite: boolean) {
  if (!stage) return;

  const reveal = easeInOutSine(range(progress, 0.2, 0.82));
  // Lead copy clears out before the opening gets wide enough to compete with it,
  // but not so early that there is a dead beat while the doors are still shut.
  const lead = 1 - easeInOutSine(range(progress, 0.1, 0.38));
  stage.style.setProperty("--hero-lead-opacity", lead.toFixed(3));
  stage.style.setProperty("--hero-lead-y", `${(-52 * (1 - lead)).toFixed(1)}px`);

  // The section beyond the doors grows as the camera closes on the threshold.
  stage.style.setProperty("--hero-beyond-scale", (1 + reveal * 0.14).toFixed(3));

  // How wide the doorway currently reads on screen. The copy behind the doors is
  // scaled to fit inside it, so the leaves never crop it mid-word. Applied as a
  // transform rather than a width so nothing re-flows while scrolling.
  const approach = easeInOutCubic(range(progress, 0.22, 1));
  const aperture = apertureWidthPx(window.innerWidth, window.innerHeight, lite, approach);
  stage.style.setProperty("--hero-aperture", `${Math.round(aperture)}px`);

  stage.style.setProperty("--hero-hint-opacity", (1 - range(progress, 0, 0.07)).toFixed(3));

  // Cream veil that hands off to the section below, so passing through the doorway
  // lands the visitor in the light page rather than cutting to it.
  stage.style.setProperty("--hero-exit-opacity", range(progress, 0.9, 1).toFixed(3));

  // Exposed for anything that wants to react to the reveal (and useful when debugging).
  stage.style.setProperty("--hero-reveal", reveal.toFixed(3));
}

/**
 * Full-screen hero in which a pair of real 3D doors swings open as the visitor scrolls.
 *
 * Layout: a tall scroll track (`.door-hero`) containing one sticky, viewport-height
 * stage (`.door-hero-stage`). Scrolling the track drives progress 0..1; the stage
 * holds the canvas, the copy overlay and the hand-off veil. Both heights come from
 * CSS so `prefers-reduced-motion` collapses the track to a single screen without a
 * layout shift on mount.
 */
export function DoorHeroSection({
  copy,
  nextSection,
}: {
  copy: DoorHeroCopy;
  nextSection: NextSectionCopy;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const quality = useHeroQuality();

  const lite = quality.lite;
  const onProgress = useCallback(
    (progress: number) => {
      writeOverlayVars(stageRef.current, clamp01(progress), lite);
    },
    [lite],
  );

  const progressRef = useScrollProgress(
    trackRef,
    quality.reducedMotion ? undefined : onProgress,
  );

  // Reduced motion: hold the whole hero at one composed pose, doors ajar, and never
  // let scroll touch it again.
  useEffect(() => {
    if (!quality.reducedMotion) return;
    writeStaticOverlayVars(stageRef.current);
    progressRef.current = REDUCED_MOTION_POSE;
  }, [quality.reducedMotion, progressRef]);

  return (
    <section ref={trackRef} className="door-hero relative bg-[#120609]" aria-label={copy.brandName}>
      <div ref={stageRef} className="door-hero-stage overflow-hidden">
        {/* What lies beyond the doors, painted underneath the canvas. The canvas
            clears to transparent and the wall around the doorway is opaque, so this
            is uncovered only through the opening as the leaves swing apart. */}
        <NextSectionReveal copy={nextSection} />

        {/* Canvas layer. Until the browser has been inspected we show the CSS hero,
            which is also the permanent state when WebGL is unavailable. */}
        {quality.pending || !quality.webgl ? (
          <DoorHeroFallback animated={quality.pending} />
        ) : (
          <DoorScene
            progressRef={progressRef}
            lite={quality.lite}
            reducedMotion={quality.reducedMotion}
          />
        )}

        <HeroCopyOverlay copy={copy} />

        {/* Hand-off to the next section: the light the visitor steps into. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-background"
          style={{ opacity: "var(--hero-exit-opacity, 0)" }}
        />
      </div>
    </section>
  );
}
