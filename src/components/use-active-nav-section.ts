"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";

/** Section ids watched for scrollspy on the homepage. */
const HOME_SECTIONS = [
  { id: "obuchenie", key: "directions" },
  { id: "mastera", key: "teachers" },
  { id: "klub", key: "club" },
  { id: "tseny", key: "pricing" },
  { id: "afisha", key: "afisha" },
  { id: "o-masterskoy", key: "about" },
  { id: "kontakty", key: "contacts" },
] as const;

export type NavSectionKey = (typeof HOME_SECTIONS)[number]["key"];

/**
 * Tracks which nav section is currently in view so the header can highlight it.
 * On dedicated pages (`/pricing`, `/afisha`) the matching item stays active.
 */
export function useActiveNavSection(): NavSectionKey | null {
  const pathname = usePathname();
  const [active, setActive] = useState<NavSectionKey | null>(null);

  useEffect(() => {
    if (pathname === "/pricing") {
      setActive("pricing");
      return;
    }
    if (pathname === "/afisha") {
      setActive("afisha");
      return;
    }

    // Only run scrollspy on the homepage (locale root).
    if (pathname !== "/") {
      setActive(null);
      return;
    }

    const nodes = HOME_SECTIONS.map(({ id, key }) => {
      const el = document.getElementById(id);
      return el ? { el, key } : null;
    }).filter((entry): entry is { el: HTMLElement; key: NavSectionKey } => entry !== null);

    if (nodes.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;
      // Offset accounts for the sticky header pill (~60–72px).
      const line = window.scrollY + 96;
      let current: NavSectionKey | null = null;

      for (const { el, key } of nodes) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = key;
      }

      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (frame !== 0) return;
      frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== 0) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return active;
}
