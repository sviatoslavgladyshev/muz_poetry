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
import { useScrollProgress } from "./use-scroll-progress";

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/**
 * Writes overlay + photo-door values as CSS custom properties from one progress.
 */
function writeOverlayVars(
  stage: HTMLElement | null,
  progress: number,
  scratch: HeroMotion,
) {
  if (!stage) return;

  applyMotion(scratch, progress);

  const open = scratch.open;
  const lead = 1 - easeInOutSine(range(progress, 0.1, 0.38));
  stage.style.setProperty("--hero-lead-opacity", lead.toFixed(3));
  stage.style.setProperty("--hero-lead-y", `${(-52 * (1 - lead)).toFixed(1)}px`);

  stage.style.setProperty("--hero-hint-opacity", (1 - range(progress, 0, 0.07)).toFixed(3));

  stage.style.setProperty("--hero-door-open", open.toFixed(4));
  /*
    The copy behind the doors never moves; the doorway grows over it instead, so
    walking through widens the view rather than pushing the text at the viewer.
  */
  const approachZoom = scratch.approach * 2.6;
  stage.style.setProperty("--hero-door-zoom", approachZoom.toFixed(4));

  // Done by 0.78; the rest of the track is a deliberate hold on the copy.
  const photoOpacity = 1 - easeInOutSine(range(progress, 0.62, 0.78));
  stage.style.setProperty("--hero-photo-opacity", photoOpacity.toFixed(3));
}

/**
 * Full-screen hero: the historic door photograph swings open on scroll.
 * Always runs — never skipped for reduced motion or device quality.
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
  const [photoReady, setPhotoReady] = useState(false);

  const scratchRef = useRef(createHeroMotion());
  const smoothRef = useRef(0);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);
  const targetRef = useRef(0);

  const writeFromSmooth = useCallback(() => {
    writeOverlayVars(stageRef.current, smoothRef.current, scratchRef.current);
  }, []);

  const onProgress = useCallback(
    (progress: number) => {
      targetRef.current = progress;
      if (rafRef.current !== 0) return;

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
    [writeFromSmooth],
  );

  useScrollProgress(trackRef, onProgress);

  useEffect(() => {
    writeFromSmooth();
  }, [writeFromSmooth]);

  const markPhotoReady = useCallback(() => setPhotoReady(true), []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setPhotoReady(true), 2200);
    return () => window.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    return () => {
      /*
        Clearing the id matters as much as cancelling the frame: this cleanup also
        runs on a locale switch, where the refs survive. A leftover id would make
        every later `onProgress` bail out early and freeze the door.
      */
      if (rafRef.current !== 0) cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
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
        <PhotoDoors onReady={markPhotoReady} />
        <HeroCopyOverlay copy={copy} />
      </div>
    </section>
  );
}
