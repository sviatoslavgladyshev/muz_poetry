import Link from "next/link";
import { siteConfig, navLinks } from "@/content/site";

export function Footer() {
  return (
    <footer className="bg-charcoal py-8 text-cream/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center text-sm md:flex-row md:justify-between md:px-8 md:text-left">
        <p>
          © {new Date().getFullYear()} «Поэзия звука» · вокально-акустическая мастерская в
          Казани
        </p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-gold-soft">
              {link.label}
            </a>
          ))}
          <Link href="/afisha" className="transition-colors hover:text-gold-soft">
            Афиша
          </Link>
        </nav>
        <p className="text-cream/40">{siteConfig.domain}</p>
      </div>
    </footer>
  );
}
