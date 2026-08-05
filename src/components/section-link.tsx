"use client";

import type { ComponentProps, MouseEvent, ReactNode } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import {
  rememberSectionForHome,
  scrollToSectionId,
  sectionIdFromHref,
} from "@/lib/scroll-to-section";

type SectionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  children?: ReactNode;
};

function isHomepagePath(pathname: string) {
  return pathname === "/" || /\/(ru|tt)\/?$/.test(pathname);
}

/**
 * Like `Link`, but hash targets scroll in place and leave `/ru/` without a
 * `#section` suffix in the address bar.
 */
export function SectionLink({ href, onClick, children, ...props }: SectionLinkProps) {
  const router = useRouter();
  const id = sectionIdFromHref(href);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;
    if (!id) return;

    event.preventDefault();

    if (isHomepagePath(window.location.pathname)) {
      scrollToSectionId(id);
      return;
    }

    rememberSectionForHome(id);
    router.push("/");
  };

  return (
    <Link href={id ? "/" : href} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
}
