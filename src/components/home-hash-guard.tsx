"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/i18n/navigation";
import {
  clearLocationHash,
  scrollToSectionId,
  takeRememberedSection,
} from "@/lib/scroll-to-section";

function isHomepage(pathname: string) {
  return pathname === "/";
}

function settleHomepageHash() {
  const pending = takeRememberedSection();
  const hadHash = Boolean(window.location.hash);
  clearLocationHash();

  if (pending) {
    requestAnimationFrame(() => scrollToSectionId(pending));
    return;
  }

  if (hadHash) {
    window.scrollTo(0, 0);
  }
}

/**
 * Keeps the homepage address bar as `/ru/` / `/tt/` without a trailing
 * `#section`, and restores the hero as the entry point when a stale hash
 * would otherwise yank the scroll position mid-page.
 */
export function HomeHashGuard() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (!isHomepage(pathname)) return;

    settleHomepageHash();

    const onHashChange = () => settleHomepageHash();
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [pathname]);

  return null;
}
