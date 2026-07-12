"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { navLinks } from "@/content/site";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

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
            Поэзия звука
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/75 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button
            render={<a href="#kontakty" />}
            size="sm"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Записаться
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Открыть меню" />
            }
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="right" className="bg-cream">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl italic text-primary">
                Поэзия звука
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
                  {link.label}
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
                Записаться
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
