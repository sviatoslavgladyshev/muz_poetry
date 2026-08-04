"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add("is-visible");
          observer.unobserve(node);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const Comp = as;
  // Keep stagger subtle so sections feel responsive, not staged.
  const cappedDelay = delay > 0 ? Math.min(Math.round(delay * 0.35), 60) : 0;

  return (
    <Comp
      ref={ref as never}
      className={cn("reveal", className)}
      style={{ transitionDelay: cappedDelay ? `${cappedDelay}ms` : undefined }}
    >
      {children}
    </Comp>
  );
}
