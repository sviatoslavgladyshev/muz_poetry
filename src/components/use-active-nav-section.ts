"use client";

import { useEffect, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { clearLocationHash } from "@/lib/scroll-to-section";

/** Section ids watched for scrollspy on the homepage — page order. */
const HOME_SECTIONS = [
  { id: "o-masterskoy", key: "about" },
  { id: "mastera", key: "teachers" },
  { id: "obuchenie", key: "directions" },
  { id: "klub", key: "club" },
  { id: "tseny", key: "pricing" },
  { id: "afisha", key: "afisha" },
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

    /*
      Hash cleanup for the address bar lives in `HomeHashGuard` (layout effect
      + remembered cross-route targets). This hook only tracks the active item.
    */

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

      if (window.scrollY < 48) clearLocationHash();

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
