"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({
  locale,
  className,
}: {
  locale: AppLocale;
  className?: string;
}) {
  const t = useTranslations("languageSwitcher");
  const pathname = usePathname();

  return (
    <div className={cn("flex items-center gap-1 text-sm font-semibold leading-none", className)}>
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center gap-1 leading-none">
          {i > 0 && <span className="text-foreground/30">/</span>}
          <Link
            href={pathname}
            locale={loc}
            aria-current={locale === loc ? "true" : undefined}
            aria-label={t(loc === "ru" ? "ariaRu" : "ariaTt")}
            className={cn(
              "rounded px-1.5 py-1 transition-colors",
              locale === loc
                ? "text-primary"
                : "text-foreground/50 hover:text-primary"
            )}
          >
            {t(loc)}
          </Link>
        </span>
      ))}
    </div>
  );
}
