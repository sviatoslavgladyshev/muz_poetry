"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const VISIBLE_CLASS = "is-visible";

type PendingReveal = {
  node: HTMLElement;
  show: () => void;
};

/*
  One shared scroll/resize sweep backs up the per-element observers.

  An IntersectionObserver alone is not enough here: a locale switch replaces the
  DOM nodes mid-scroll, and anything whose observer was attached to the old node
  would stay at opacity 0 forever. The sweep re-checks live rects, so content
  always ends up visible no matter how often the visitor scrolls or switches.
*/
const pending = new Set<PendingReveal>();
let sweepFrame = 0;
let sweepBound = false;

function isInView(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  return rect.top < viewportHeight * 0.94 && rect.bottom > 0;
}

function runSweep() {
  sweepFrame = 0;
  for (const entry of Array.from(pending)) {
    if (!entry.node.isConnected) {
      pending.delete(entry);
      continue;
    }
    if (isInView(entry.node)) entry.show();
  }
  if (pending.size === 0) unbindSweep();
}

function scheduleSweep() {
  if (sweepFrame !== 0) return;
  sweepFrame = requestAnimationFrame(runSweep);
}

function bindSweep() {
  if (sweepBound) return;
  sweepBound = true;
  window.addEventListener("scroll", scheduleSweep, { passive: true });
  window.addEventListener("resize", scheduleSweep);
}

function unbindSweep() {
  if (!sweepBound) return;
  sweepBound = false;
  window.removeEventListener("scroll", scheduleSweep);
  window.removeEventListener("resize", scheduleSweep);
  if (sweepFrame !== 0) {
    cancelAnimationFrame(sweepFrame);
    sweepFrame = 0;
  }
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const detachRef = useRef<(() => void) | null>(null);

  // A callback ref rather than an effect: it fires again whenever React hands us
  // a different element, which is exactly what happens on a locale switch.
  const attach = useCallback((node: HTMLDivElement | null) => {
    detachRef.current?.();
    detachRef.current = null;

    if (!node) return;
    if (node.classList.contains(VISIBLE_CLASS)) return;

    if (isInView(node)) {
      node.classList.add(VISIBLE_CLASS);
      return;
    }

    const entry: PendingReveal = {
      node,
      show: () => {
        node.classList.add(VISIBLE_CLASS);
        detachRef.current?.();
        detachRef.current = null;
      },
    };

    const observer = new IntersectionObserver(
      ([observed]) => {
        if (observed.isIntersecting) entry.show();
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" },
    );
    observer.observe(node);

    pending.add(entry);
    bindSweep();

    detachRef.current = () => {
      observer.disconnect();
      pending.delete(entry);
      if (pending.size === 0) unbindSweep();
    };
  }, []);

  const Comp = as;
  // Keep stagger subtle so sections feel responsive, not staged.
  const cappedDelay = delay > 0 ? Math.min(Math.round(delay * 0.35), 60) : 0;

  return (
    <Comp
      ref={attach as never}
      className={cn("reveal", className)}
      style={{ transitionDelay: cappedDelay ? `${cappedDelay}ms` : undefined }}
    >
      {children}
    </Comp>
  );
}
