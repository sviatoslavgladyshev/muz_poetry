import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { siteConfig, navLinks } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

export async function Footer({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "nav" });
  const tFooter = await getTranslations({ locale, namespace: "footer" });

  return (
    <footer className="bg-charcoal py-8 text-cream/60">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-5 text-center text-sm md:flex-row md:justify-between md:px-8 md:text-left">
        <p>{tFooter("copyright", { year: new Date().getFullYear() })}</p>
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-gold-soft">
              {t(link.key)}
            </a>
          ))}
          <Link href="/afisha" className="transition-colors hover:text-gold-soft">
            {t("afisha")}
          </Link>
        </nav>
        <p className="text-cream/40">{siteConfig.domain}</p>
      </div>
    </footer>
  );
}
