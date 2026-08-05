export const SCROLL_TO_SECTION_KEY = "mp-scroll-to-section";

/**
 * In-page section jumps without writing `#id` into the address bar.
 *
 * Next.js `Link` to `/#klub` does a client navigation that leaves the hash
 * stuck in the URL even after the visitor scrolls away — so a later visit to
 * `/ru/` can reopen already scrolled to that section. Plain `scrollIntoView`
 * plus `history.replaceState` keeps the path clean.
 */
export function sectionIdFromHref(href: string): string | null {
  const hashIndex = href.indexOf("#");
  if (hashIndex === -1) return null;
  const id = href.slice(hashIndex + 1);
  return id || null;
}

export function scrollToSectionId(id: string) {
  const node = document.getElementById(id);
  if (!node) return false;

  node.scrollIntoView({ behavior: "smooth", block: "start" });

  const { pathname, search } = window.location;
  if (window.location.hash) {
    window.history.replaceState(null, "", `${pathname}${search}`);
  }
  return true;
}

export function clearLocationHash() {
  if (!window.location.hash) return;
  const { pathname, search } = window.location;
  window.history.replaceState(null, "", `${pathname}${search}`);
}

export function rememberSectionForHome(id: string) {
  try {
    sessionStorage.setItem(SCROLL_TO_SECTION_KEY, id);
  } catch {
    /* private mode */
  }
}

export function takeRememberedSection(): string | null {
  try {
    const id = sessionStorage.getItem(SCROLL_TO_SECTION_KEY);
    if (id) sessionStorage.removeItem(SCROLL_TO_SECTION_KEY);
    return id;
  } catch {
    return null;
  }
}
