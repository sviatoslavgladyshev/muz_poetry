"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Music2 } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { navLinks } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

export function Header({ locale }: { locale: AppLocale }) {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("nav");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-colors duration-300 ${
        scrolled
          ? "border-border/70 bg-cream/90 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/" className="flex items-center gap-2 group">
          <Music2 className="h-5 w-5 text-primary transition-transform group-hover:-rotate-12" />
          <span className="font-display text-xl italic tracking-tight text-primary">
            {t("brand")}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
            >
              {t(link.key)}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <LanguageSwitcher locale={locale} />
          <Button
            render={<a href="#kontakty" />}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t("cta")}
          </Button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher locale={locale} />
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
                      <a
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
                    <a
                      href="#kontakty"
                      className="mt-3 rounded-md bg-primary px-3 py-3 text-center text-base font-semibold text-primary-foreground"
                    />
                  }
                >
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
