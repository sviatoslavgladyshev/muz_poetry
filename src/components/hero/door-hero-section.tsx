"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { clamp01, easeInOutSine, range } from "./easing";
import { applyMotion, createHeroMotion, type HeroMotion } from "./motion";
import { DoorHeroFallback } from "./door-hero-fallback";
import { DoorHeroLoader } from "./door-hero-loader";
import { HeroCopyOverlay, type DoorHeroCopy } from "./hero-copy-overlay";
import {
  NextSectionReveal,
  type NextSectionCopy,
} from "./next-section-reveal";
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
  stage.style.setProperty("--hero-beyond-y", "0px");
  stage.style.setProperty("--hero-beyond-copy-opacity", "1");
  stage.style.setProperty("--hero-hint-opacity", "0");
}

/**
 * Writes the overlay's animated values as CSS custom properties.
 *
 * Driving the DOM through custom properties — rather than React state — keeps the
 * whole hero at zero re-renders while scrolling. The curves intentionally mirror
 * the ones in `motion.ts` so the copy and the doors stay in step.
 */
function writeOverlayVars(
  stage: HTMLElement | null,
  progress: number,
  lite: boolean,
  scratch: HeroMotion,
) {
  if (!stage) return;

  // Run the progress through the same timeline the scene uses, so the overlay is
  // working from exactly the values the doors and camera are.
  applyMotion(scratch, progress);

  const reveal = scratch.reveal;
  // Lead copy clears out before the opening gets wide enough to compete with it,
  // but not so early that there is a dead beat while the doors are still shut.
  const lead = 1 - easeInOutSine(range(progress, 0.1, 0.38));
  stage.style.setProperty("--hero-lead-opacity", lead.toFixed(3));
  stage.style.setProperty("--hero-lead-y", `${(-52 * (1 - lead)).toFixed(1)}px`);

  // How far past the doorway we are. Once the camera is through, the wall no longer
  // covers any of the frame and the section behind it is simply what you are looking
  // at — there is no cross-fade anywhere in the hand-off.
  const throughDoorway = range(progress, 0.82, 0.96);

  // The section beyond grows as the camera closes on the threshold, then settles back
  // to 1:1 once we are through it, so it matches the real section that follows.
  const beyondScale = 1 + reveal * 0.06 * (1 - throughDoorway);
  stage.style.setProperty("--hero-beyond-scale", beyondScale.toFixed(3));

  // The actual About composition stays readable after the threshold is crossed.
  // A small upward drift makes it feel attached to the document scroll, while the
  // full text remains present instead of dissolving into a temporary teaser.
  const readProgress = easeInOutSine(range(progress, 0.7, 1));
  const readTravel = Math.min(window.innerHeight * (lite ? 0.025 : 0.045), lite ? 20 : 40);
  stage.style.setProperty("--hero-beyond-y", `${(-readTravel * readProgress).toFixed(1)}px`);
  stage.style.setProperty("--hero-beyond-copy-opacity", "1");

  stage.style.setProperty("--hero-hint-opacity", (1 - range(progress, 0, 0.07)).toFixed(3));

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
  const [sceneReady, setSceneReady] = useState(false);

  const lite = quality.lite;
  // Scratch object the overlay evaluates the timeline into, reused every frame.
  const scratchRef = useRef(createHeroMotion());
  const onProgress = useCallback(
    (progress: number) => {
      writeOverlayVars(stageRef.current, clamp01(progress), lite, scratchRef.current);
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

  const markSceneReady = useCallback(() => setSceneReady(true), []);

  // The CSS door is already painted when WebGL is unavailable. Wait one browser
  // paint before dismissing the loader so the visitor never sees an empty frame.
  useEffect(() => {
    if (quality.pending || quality.webgl) return;
    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(markSceneReady);
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
    };
  }, [markSceneReady, quality.pending, quality.webgl]);

  // A slow or broken graphics driver must never leave the visitor behind a loader.
  useEffect(() => {
    const timeoutId = window.setTimeout(markSceneReady, 4500);
    return () => window.clearTimeout(timeoutId);
  }, [markSceneReady]);

  return (
    <section
      ref={trackRef}
      className="door-hero relative bg-[#120609]"
      aria-label={copy.brandName}
      aria-busy={!sceneReady}
    >
      <DoorHeroLoader brandName={copy.brandName} ready={sceneReady} />

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
            onReady={markSceneReady}
          />
        )}

        <HeroCopyOverlay copy={copy} />
      </div>
    </section>
  );
}
