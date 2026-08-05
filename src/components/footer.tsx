import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig, navLinks } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="border-t border-candle/10 bg-juniper py-12 text-candle/75 md:py-14">
      <div className="mx-auto grid max-w-6xl gap-6 px-5 text-sm md:grid-cols-3 md:items-center md:gap-8 md:px-8">
        <p className="text-center md:text-left">
          {tFooter("copyright", { year: new Date().getFullYear() })}
        </p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-candle"
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>
        <p className="text-center text-candle/45 md:text-right">{siteConfig.domain}</p>
      </div>
    </footer>
  );
}
