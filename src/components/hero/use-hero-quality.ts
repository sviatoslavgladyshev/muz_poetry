"use client";

import { useEffect, useState } from "react";

export type HeroQuality = {
  /** True until the browser environment has been inspected, to avoid an SSR mismatch. */
  pending: boolean;
  /** WebGL is usable — when false we fall back to a pure-CSS hero. */
  webgl: boolean;
  /** Small viewport or coarse pointer: fewer draw calls, no shadows, less camera travel. */
  lite: boolean;
  /** User asked for reduced motion: the scene renders one static frame. */
  reducedMotion: boolean;
};

const INITIAL: HeroQuality = {
  pending: true,
  webgl: false,
  lite: false,
  reducedMotion: false,
};

function detectWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

/**
 * Decides how much scene the current device should get. Runs only on the client:
 * the server always renders the accessible HTML hero, and the canvas layers in
 * afterwards once we know it is worth mounting.
 */
export function useHeroQuality(): HeroQuality {
  const [quality, setQuality] = useState<HeroQuality>(INITIAL);

  useEffect(() => {
    const liteQuery = window.matchMedia("(max-width: 767px), (pointer: coarse)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const webgl = detectWebGL();

    const sync = () =>
      setQuality({
        pending: false,
        webgl,
        lite: liteQuery.matches,
        reducedMotion: motionQuery.matches,
      });

    sync();
    liteQuery.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);

    return () => {
      liteQuery.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  return quality;
}
