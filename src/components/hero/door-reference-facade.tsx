"use client";

import Image from "next/image";
import { publicAssetPath } from "@/lib/utils";

export function DoorReferenceFacade({ onReady }: { onReady: () => void }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden bg-[#120609] opacity-[var(--hero-reference-opacity,1)] transition-opacity duration-150 ease-linear"
    >
      <Image
        src={publicAssetPath("/images/historic-door.webp")}
        alt=""
        width={1024}
        height={1536}
        priority
        onLoad={onReady}
        onError={onReady}
        className="absolute top-1/2 left-1/2 h-[92svh] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain md:h-[94svh]"
      />
    </div>
  );
}
