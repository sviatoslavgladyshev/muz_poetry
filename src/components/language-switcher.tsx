"use client";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { usePathname, useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function FlagMark({ locale }: { locale: AppLocale }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block h-3.5 w-5 overflow-hidden rounded-[2px] border border-black/10 shadow-sm",
        locale === "ru"
          ? "bg-[linear-gradient(to_bottom,#fff_0_33.33%,#1d4f9f_33.33%_66.66%,#d52b1e_66.66%)]"
          : "bg-[linear-gradient(to_bottom,#159447_0_45%,#fff_45%_55%,#d7252e_55%)]"
      )}
    />
  );
}

export function LanguageSwitcher({
  locale,
  className,
}: {
  locale: AppLocale;
  className?: string;
}) {
  const t = useTranslations("languageSwitcher");
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (nextLocale: AppLocale | null) => {
    if (!nextLocale || nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale, scroll: false });
  };

  return (
    <Select
      value={locale}
      onValueChange={(value) => switchLanguage(value as AppLocale | null)}
    >
      <SelectTrigger
        size="sm"
        aria-label={t("selectAria")}
        className={cn(
          "h-8 gap-1.5 rounded-full border-transparent bg-transparent px-2 font-semibold hover:bg-primary/8 focus-visible:ring-2",
          className
        )}
      >
        <FlagMark locale={locale} />
        <span className="text-xs leading-none">{t(locale)}</span>
      </SelectTrigger>
      <SelectContent align="end" alignItemWithTrigger={false} className="min-w-44 p-1.5">
        <SelectItem value="ru" className="gap-2.5 px-2.5 py-2">
          <FlagMark locale="ru" />
          {t("ariaRu")}
        </SelectItem>
        <SelectItem value="tt" className="gap-2.5 px-2.5 py-2">
          <FlagMark locale="tt" />
          {t("ariaTt")}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
