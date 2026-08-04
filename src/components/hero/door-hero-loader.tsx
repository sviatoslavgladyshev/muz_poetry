"use client";

import { Music2 } from "lucide-react";
import { useEffect, useState } from "react";

export function DoorHeroLoader({
  brandName,
  ready,
}: {
  brandName: string;
  ready: boolean;
}) {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!ready) return;
    // Failsafe unmount if transitionend never fires (reduced motion / interrupted).
    const timeoutId = window.setTimeout(() => setMounted(false), 220);
    return () => window.clearTimeout(timeoutId);
  }, [ready]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-label={brandName}
      aria-hidden={ready}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return;
        if (ready) setMounted(false);
      }}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#1a0a08] transition-opacity duration-150 ease-out motion-reduce:duration-0 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex w-52 flex-col items-center text-[#b5b38a]">
        <div className="flex items-center gap-3">
          <Music2 className="size-5" strokeWidth={1.7} />
          <span className="font-display text-2xl">{brandName}</span>
        </div>
        <div className="mt-5 h-px w-full overflow-hidden bg-[#b5b38a]/20">
          <span className="door-loader-progress block h-full w-2/5 bg-[#b5b38a]" />
        </div>
      </div>
    </div>
  );
}
