"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { easeInOutSine, range } from "./easing";
import { applyMotion, createHeroMotion, type HeroMotion } from "./motion";
import { DoorHeroLoader } from "./door-hero-loader";
import { HeroCopyOverlay, type DoorHeroCopy } from "./hero-copy-overlay";
import {
  NextSectionReveal,
  type NextSectionCopy,
} from "./next-section-reveal";
import { PhotoDoors } from "./photo-doors";
import { useHeroQuality } from "./use-hero-quality";
import { useScrollProgress } from "./use-scroll-progress";

/**
 * Pose the scene freezes at when the visitor has asked for reduced motion: the
 * doors caught part-way open, with warm light just beginning to spill through.
 */
const REDUCED_MOTION_POSE = 0.34;

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function writeStaticOverlayVars(stage: HTMLElement | null) {
  if (!stage) return;
  stage.style.setProperty("--hero-lead-opacity", "1");
  stage.style.setProperty("--hero-lead-y", "0px");
  stage.style.setProperty("--hero-beyond-scale", "1");
  stage.style.setProperty("--hero-beyond-y", "0px");
  stage.style.setProperty("--hero-beyond-copy-opacity", "0");
  stage.style.setProperty("--hero-hint-opacity", "0");
  stage.style.setProperty("--hero-door-open", "0");
  stage.style.setProperty("--hero-door-approach", "0");
  stage.style.setProperty("--hero-door-zoom", "0");
  stage.style.setProperty("--hero-photo-opacity", "1");
}

/**
 * Writes overlay + photo-door values as CSS custom properties from one progress.
 */
function writeOverlayVars(
  stage: HTMLElement | null,
  progress: number,
  lite: boolean,
  scratch: HeroMotion,
) {
  if (!stage) return;

  applyMotion(scratch, progress);

  const reveal = scratch.reveal;
  const open = scratch.open;
  const lead = 1 - easeInOutSine(range(progress, 0.1, 0.38));
  stage.style.setProperty("--hero-lead-opacity", lead.toFixed(3));
  stage.style.setProperty("--hero-lead-y", `${(-52 * (1 - lead)).toFixed(1)}px`);

  const throughDoorway = range(progress, 0.82, 0.96);
  // Keep doorway copy almost 1:1 — a strong scale reads as the text rushing forward.
  const beyondScale = 1 + reveal * 0.02 * (1 - throughDoorway);
  stage.style.setProperty("--hero-beyond-scale", beyondScale.toFixed(3));

  const readProgress = easeInOutSine(range(progress, 0.78, 1));
  const readTravel = Math.min(window.innerHeight * (lite ? 0.015 : 0.03), lite ? 12 : 28);
  stage.style.setProperty("--hero-beyond-y", `${(-readTravel * readProgress).toFixed(1)}px`);

  // Appear only once the leaves have opened enough to frame the copy.
  const beyondCopy = easeInOutSine(range(open, 0.22, 0.55));
  stage.style.setProperty("--hero-beyond-copy-opacity", beyondCopy.toFixed(3));

  stage.style.setProperty("--hero-hint-opacity", (1 - range(progress, 0, 0.07)).toFixed(3));

  stage.style.setProperty("--hero-door-open", open.toFixed(4));
  stage.style.setProperty("--hero-door-approach", scratch.approach.toFixed(4));
  // Soften the push-in so copy inside the opening does not surge at the viewer.
  const approachZoom = scratch.approach * 0.55;
  stage.style.setProperty("--hero-door-zoom", approachZoom.toFixed(4));

  const photoOpacity = 1 - easeInOutSine(range(progress, 0.86, 0.97));
  stage.style.setProperty("--hero-photo-opacity", photoOpacity.toFixed(3));

  stage.style.setProperty("--hero-reveal", reveal.toFixed(3));
}

/**
 * Full-screen hero: the historic door photograph swings open on scroll.
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
  const [photoReady, setPhotoReady] = useState(false);

  const lite = quality.lite;
  const scratchRef = useRef(createHeroMotion());
  const smoothRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const targetRef = useRef(0);

  const writeFromSmooth = useCallback(() => {
    writeOverlayVars(stageRef.current, smoothRef.current, lite, scratchRef.current);
  }, [lite]);

  const onProgress = useCallback(
    (progress: number) => {
      targetRef.current = progress;
      if (quality.reducedMotion || rafRef.current !== 0) return;

      lastTimeRef.current = performance.now();
      const tick = (now: number) => {
        const dt = Math.min((now - lastTimeRef.current) / 1000, 0.064);
        lastTimeRef.current = now;
        const target = targetRef.current;
        smoothRef.current = damp(smoothRef.current, target, 10, dt);
        writeFromSmooth();

        if (Math.abs(target - smoothRef.current) > 0.0002) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = 0;
          smoothRef.current = target;
          writeFromSmooth();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [quality.reducedMotion, writeFromSmooth],
  );

  const progressRef = useScrollProgress(
    trackRef,
    quality.reducedMotion ? undefined : onProgress,
  );

  useEffect(() => {
    if (!quality.reducedMotion) return;
    writeStaticOverlayVars(stageRef.current);
    progressRef.current = REDUCED_MOTION_POSE;
    smoothRef.current = REDUCED_MOTION_POSE;
    targetRef.current = REDUCED_MOTION_POSE;
  }, [quality.reducedMotion, progressRef]);

  useEffect(() => {
    if (quality.reducedMotion) return;
    writeFromSmooth();
  }, [quality.reducedMotion, writeFromSmooth]);

  const markPhotoReady = useCallback(() => setPhotoReady(true), []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPhotoReady(true), 2200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current !== 0) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section
      ref={trackRef}
      className="door-hero relative bg-[#120609]"
      aria-label={copy.brandName}
      aria-busy={!photoReady}
    >
      <DoorHeroLoader brandName={copy.brandName} ready={photoReady} />

      <div ref={stageRef} className="door-hero-stage overflow-hidden">
        <NextSectionReveal copy={nextSection} />
        <PhotoDoors onReady={markPhotoReady} beyond={nextSection} />
        <HeroCopyOverlay copy={copy} />
      </div>
    </section>
  );
}
