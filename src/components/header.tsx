"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { CalendarPlus, Info, MapPin, Menu, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Link } from "@/i18n/navigation";
import {
  navLinks,
  primaryNavLinks,
  secondaryNavLinks,
} from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

export function Header({ locale }: { locale: AppLocale }) {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);
  const frameRef = useRef<number | null>(null);
  const t = useTranslations("nav");

  useEffect(() => {
    const onScroll = () => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(() => {
        const nextScrolled = window.scrollY > 32;
        if (nextScrolled !== scrolledRef.current) {
          scrolledRef.current = nextScrolled;
          setScrolled(nextScrolled);
        }
        frameRef.current = null;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <header
      // Exposed as an attribute so pages with a dark hero can restyle the
      // pre-scroll state from CSS (see globals.css).
      data-scrolled={scrolled ? "" : undefined}
      // Always transparent: at rest the page — or the hero's doors — shows straight
      // through, and the scrolled state puts its background on the pill instead.
      className="pointer-events-none sticky top-0 z-50 h-[60px] w-full"
    >
      <div
        className={`pointer-events-auto mx-auto flex transform-gpu items-center justify-between transition-[max-width,border-radius,box-shadow,padding,transform,background-color] duration-300 ease-out ${
          scrolled
            ? // Liquid glass: a translucent pill that blurs and saturates whatever is
              // behind it, with a bright inset rim so it reads as a lens rather than
              // a flat panel.
              "mt-2 h-11 w-[calc(100%-1rem)] max-w-4xl rounded-full border border-white/45 bg-cream/55 px-3 shadow-[0_10px_34px_-8px_rgba(60,18,36,0.35)] ring-1 ring-inset ring-white/50 backdrop-blur-xl backdrop-saturate-150 md:w-[calc(100%-3rem)] md:px-4"
            : "h-[60px] w-full max-w-6xl px-5 md:px-8"
        }`}
      >
        <Link href="/" className="group flex h-full items-center gap-2 leading-none">
          <Music2 className="h-5 w-5 text-primary transition-transform group-hover:-rotate-12" />
          <span className="font-display text-xl italic leading-none tracking-tight text-primary">
            {t("brand")}
          </span>
        </Link>

        <div className="hidden h-full items-center gap-3.5 lg:flex">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex h-full items-center text-sm font-medium leading-none text-foreground/90 transition-colors hover:text-primary"
            >
              {t(link.key)}
            </Link>
          ))}
          <NavigationMenu align="end" className="h-full flex-none">
            <NavigationMenuList className="h-full">
              <NavigationMenuItem className="flex h-full items-center">
                <NavigationMenuTrigger className="h-8 rounded-full bg-transparent px-2 text-foreground/90 hover:bg-primary/8 hover:text-primary data-open:bg-primary/8">
                  {t("more")}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-56 p-1.5">
                  {secondaryNavLinks.map((link) => {
                    const Icon = link.key === "about" ? Info : MapPin;

                    return (
                      <NavigationMenuLink
                        key={link.href}
                        render={<Link href={link.href} />}
                        className="gap-3 px-3 py-2.5 font-medium"
                      >
                        <Icon className="text-primary" />
                        {t(link.key)}
                      </NavigationMenuLink>
                    );
                  })}
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden h-full items-center gap-3 lg:flex">
          <LanguageSwitcher locale={locale} className="h-full leading-none" />
          <Button
            render={<Link href="/#kontakty" />}
            nativeButton={false}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CalendarPlus />
            {t("cta")}
          </Button>
        </div>

        <div className="flex h-full items-center gap-2 lg:hidden">
          <LanguageSwitcher locale={locale} className="h-full leading-none" />
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" aria-label={t("openMenu")} />
              }
            >
              <Menu className="h-6 w-6" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-cream">
              <SheetHeader>
                <SheetTitle className="font-display text-2xl italic text-primary">
                  {t("brand")}
                </SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1 px-4">
                {navLinks.map((link) => (
                  <SheetClose
                    key={link.href}
                    render={
                      <Link
                        href={link.href}
                        className="rounded-md px-2 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                      />
                    }
                  >
                    {t(link.key)}
                  </SheetClose>
                ))}
                <SheetClose
                  render={
                    <Link
                      href="/#kontakty"
                      className="mt-3 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground"
                    />
                  }
                >
                  <CalendarPlus className="h-4 w-4" />
                  {t("cta")}
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
