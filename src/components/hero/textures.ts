"use client";

import { useMemo } from "react";
import { CanvasTexture, RepeatWrapping, type Texture } from "three";

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
  const size = 256;
  const canvas = createCanvas(size);
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);

  ctx.globalAlpha = 0.16;
  for (let i = 0; i < 900; i += 1) {
    const x = Math.random() * size;
    const value = Math.floor(96 + Math.random() * 112);
    ctx.strokeStyle = `rgb(${value},${value},${value})`;
    ctx.lineWidth = Math.random() * 1.6 + 0.3;
    ctx.beginPath();
    ctx.moveTo(x, Math.random() * size * 0.4);
    ctx.lineTo(x + (Math.random() - 0.5) * 2, size);
    ctx.stroke();
  }

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(1, 3);
  return texture;
}

export type HeroTextures = {
  brushedRoughness: Texture | null;
};

export function useHeroTextures(): HeroTextures {
  return useMemo(() => ({ brushedRoughness: createBrushedRoughness() }), []);
}
