"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Tracks how far the user has scrolled through `sectionRef`, normalised to 0..1.
 *
 * The value lives in a ref and is never pushed into React state, so scrolling
 * causes zero re-renders. Consumers read it two ways:
 *   - the 3D scene reads `progressRef.current` inside `useFrame` and eases toward it
 *   - the DOM overlay is updated imperatively by the `onProgress` callback
 */
export function useScrollProgress(
  sectionRef: RefObject<HTMLElement | null>,
  onProgress?: (progress: number) => void,
) {
  const progressRef = useRef(0);
  const onProgressRef = useRef(onProgress);

  // Kept in a ref so the listener below never has to be torn down and re-attached
  // just because the callback identity changed.
  useEffect(() => {
    onProgressRef.current = onProgress;
  }, [onProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;

    const measure = () => {
      rafId = 0;
      const rect = section.getBoundingClientRect();
      // Scroll distance available before the section's bottom reaches the fold.
      const travel = Math.max(rect.height - window.innerHeight, 1);
      const progress = Math.min(Math.max(-rect.top / travel, 0), 1);

      progressRef.current = progress;
      onProgressRef.current?.(progress);
    };

    // Scroll and resize can fire faster than paint; coalesce onto one rAF tick.
    const schedule = () => {
      if (rafId === 0) rafId = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (rafId !== 0) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [sectionRef]);

  return progressRef;
}
