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
    const timeoutId = window.setTimeout(() => setMounted(false), 420);
    return () => window.clearTimeout(timeoutId);
  }, [ready]);

  if (!mounted) return null;

  return (
    <div
      role="status"
      aria-label={brandName}
      aria-hidden={ready}
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#120609] transition-opacity duration-400 ease-out motion-reduce:duration-0 ${
        ready ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex w-52 flex-col items-center text-[#e3c789]">
        <div className="flex items-center gap-3">
          <Music2 className="size-5" strokeWidth={1.7} />
          <span className="font-display text-2xl italic">{brandName}</span>
        </div>
        <div className="mt-5 h-px w-full overflow-hidden bg-[#e3c789]/20">
          <span className="door-loader-progress block h-full w-2/5 bg-[#e3c789]" />
        </div>
      </div>
    </div>
  );
}
