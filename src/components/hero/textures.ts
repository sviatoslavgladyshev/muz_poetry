"use client";

import { useMemo } from "react";
import {
  CanvasTexture,
  RepeatWrapping,
  SRGBColorSpace,
  type Texture,
} from "three";

/**
 * Small procedural textures, drawn on a 2D canvas at mount time.
 *
 * These exist so the scene ships zero image assets: nothing to download, nothing
 * to cache-bust, and they stay crisp at any DPR. They are deliberately tiny —
 * the roughness map only needs to break up specular highlights, not be legible.
 */

function createCanvas(size: number) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  return canvas;
}

/**
 * Vertical brushed-metal roughness map. Without it the door panels read as flat
 * CG plastic; with it the key light smears along the grain like real anodised metal.
 */
function createBrushedRoughness() {
  const size = 128;
  const canvas = createCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 450; i += 1) {
    const seed = Math.sin(i * 91.731) * 43758.5453;
    const noise = seed - Math.floor(seed);
    const nextSeed = Math.sin((i + 17) * 53.117) * 17341.219;
    const nextNoise = nextSeed - Math.floor(nextSeed);
    const x = noise * size;
    const value = Math.floor(96 + nextNoise * 112);
    ctx.strokeStyle = `rgb(${value},${value},${value})`;
    ctx.lineWidth = nextNoise * 1.6 + 0.3;
    ctx.beginPath();
    ctx.moveTo(x, noise * size * 0.4);
    ctx.lineTo(x + (nextNoise - 0.5) * 2, size);
    ctx.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 3);
  return texture;
}

/** Deep plum lacquer with quiet vertical grain and warmer figure toward the light. */
function createLacquerColor() {
  const size = 128;
  const canvas = createCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const index = (y * size + x) * 4;
      const figure =
        Math.sin(x * 0.11 + Math.sin(y * 0.035) * 1.8) * 0.5 +
        Math.sin(x * 0.037 - y * 0.012) * 0.28;
      const poreSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      const pore = (poreSeed - Math.floor(poreSeed) - 0.5) * 4;
      const lift = figure * 7 + pore;

      image.data[index] = Math.max(24, Math.min(64, 43 + lift));
      image.data[index + 1] = Math.max(8, Math.min(34, 16 + lift * 0.35));
      image.data[index + 2] = Math.max(15, Math.min(46, 29 + lift * 0.65));
      image.data[index + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(0.9, 2.8);
  return texture;
}

export type HeroTextures = {
  brushedRoughness: Texture | null;
  lacquerColor: Texture | null;
};

const EMPTY_TEXTURES: HeroTextures = {
  brushedRoughness: null,
  lacquerColor: null,
};

export function useHeroTextures(enabled = true): HeroTextures {
  return useMemo(
    () =>
      enabled
        ? {
            brushedRoughness: createBrushedRoughness(),
            lacquerColor: createLacquerColor(),
          }
        : EMPTY_TEXTURES,
    [enabled],
  );
}
