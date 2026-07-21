"use client";

import { useTranslations } from "next-intl";
import { Switch } from "@/components/ui/switch";
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
  const isTatar = locale === "tt";

  const switchLanguage = (checked: boolean) => {
    router.replace(pathname, { locale: checked ? "tt" : "ru", scroll: false });
  };

  return (
    <div
      className={cn("flex items-center gap-1.5", className)}
      title={t(isTatar ? "ariaTt" : "ariaRu")}
    >
      <span className={cn("transition-opacity", isTatar && "opacity-40")}>
        <FlagMark locale="ru" />
      </span>
      <Switch
        size="sm"
        checked={isTatar}
        onCheckedChange={switchLanguage}
        aria-label={t("toggleAria")}
        className="data-unchecked:bg-[#1d4f9f]/35 data-checked:bg-[#159447]"
      />
      <span className={cn("transition-opacity", !isTatar && "opacity-40")}>
        <FlagMark locale="tt" />
      </span>
    </div>
  );
}
