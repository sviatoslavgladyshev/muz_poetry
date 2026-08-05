"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const VISIBLE_CLASS = "is-visible";

/** How far past the viewport edge a block must sit before it hides again. */
const HIDE_MARGIN = 96;

type RevealEntry = {
  node: HTMLElement;
  visible: boolean;
  frame: number;
};

/*
  Every reveal shares two observers and one slow safety sweep.

  Two observers instead of one: the "enter" observer trims the viewport slightly
  so a block starts its fade just after it appears, while the "exit" observer
  pads the viewport so a block only resets once it is comfortably off screen.
  That gap is deliberate hysteresis — with a single boundary a block parked on
  the edge would flicker between states.

  The sweep exists because observers alone can miss cases where the DOM changes
  under them: a locale switch swaps every node mid-scroll, and layout can settle
  a frame later. It re-reads live rects so nothing is ever stranded invisible.
*/
const entries = new Map<HTMLElement, RevealEntry>();
let enterObserver: IntersectionObserver | null = null;
let exitObserver: IntersectionObserver | null = null;
let sweepTimer = 0;
let listening = false;

function viewportHeight() {
  return window.innerHeight || document.documentElement.clientHeight;
}

function shouldShow(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return rect.top < viewportHeight() * 0.94 && rect.bottom > 0;
}

function shouldHide(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return rect.bottom < -HIDE_MARGIN || rect.top > viewportHeight() + HIDE_MARGIN;
}

function show(entry: RevealEntry) {
  if (entry.visible) return;
  entry.visible = true;
  // Paint the hidden state first, otherwise the fade-up is skipped for blocks
  // that are already on screen when they mount.
  entry.frame = requestAnimationFrame(() => {
    entry.frame = requestAnimationFrame(() => {
      entry.frame = 0;
      entry.node.classList.add(VISIBLE_CLASS);
    });
  });
}

function hide(entry: RevealEntry) {
  if (!entry.visible) return;
  entry.visible = false;
  if (entry.frame !== 0) {
    cancelAnimationFrame(entry.frame);
    entry.frame = 0;
  }
  entry.node.classList.remove(VISIBLE_CLASS);
}

function sync(entry: RevealEntry) {
  if (shouldShow(entry.node)) show(entry);
  else if (shouldHide(entry.node)) hide(entry);
}

function runSweep() {
  sweepTimer = 0;
  for (const entry of Array.from(entries.values())) {
    if (!entry.node.isConnected) {
      release(entry.node);
      continue;
    }
    sync(entry);
  }
}

function scheduleSweep() {
  if (sweepTimer !== 0) return;
  // Slow on purpose: the observers do the real work, and the hero writes CSS
  // variables every frame, so reading rects often would thrash layout.
  sweepTimer = window.setTimeout(runSweep, 150);
}

function ensureObservers() {
  if (!enterObserver) {
    enterObserver = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const entry = entries.get(record.target as HTMLElement);
          if (entry && record.isIntersecting) show(entry);
        }
      },
      { rootMargin: `0px 0px -6% 0px` },
    );
  }

  if (!exitObserver) {
    exitObserver = new IntersectionObserver(
      (records) => {
        for (const record of records) {
          const entry = entries.get(record.target as HTMLElement);
          if (entry && !record.isIntersecting) hide(entry);
        }
      },
      { rootMargin: `${HIDE_MARGIN}px 0px ${HIDE_MARGIN}px 0px` },
    );
  }

  if (listening) return;
  listening = true;
  window.addEventListener("scroll", scheduleSweep, { passive: true });
  window.addEventListener("resize", scheduleSweep);
}

function release(node: HTMLElement) {
  const entry = entries.get(node);
  if (entry && entry.frame !== 0) cancelAnimationFrame(entry.frame);
  entries.delete(node);
  enterObserver?.unobserve(node);
  exitObserver?.unobserve(node);

  if (entries.size > 0) return;
  listening = false;
  window.removeEventListener("scroll", scheduleSweep);
  window.removeEventListener("resize", scheduleSweep);
  if (sweepTimer !== 0) {
    clearTimeout(sweepTimer);
    sweepTimer = 0;
  }
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section";
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const nodeRef = useRef<HTMLElement | null>(null);

  // A callback ref rather than an effect: it fires again whenever React hands
  // us a different element, which is exactly what a locale switch does.
  const attach = useCallback((node: HTMLDivElement | null) => {
    if (nodeRef.current && nodeRef.current !== node) {
      release(nodeRef.current);
    }
    nodeRef.current = node;
    if (!node) return;

    ensureObservers();

    const entry: RevealEntry = {
      node,
      visible: node.classList.contains(VISIBLE_CLASS),
      frame: 0,
    };
    entries.set(node, entry);
    enterObserver?.observe(node);
    exitObserver?.observe(node);
    sync(entry);
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
