import { getTranslations } from "next-intl/server";
import { DoorHeroSection } from "@/components/hero/door-hero-section";
import { siteConfig } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

/**
 * Homepage hero.
 *
 * A server component whose only job is translation: it resolves every string up
 * front and hands them to `DoorHeroSection`, so the headline, supporting copy and
 * both calls to action are in the server-rendered HTML regardless of whether the
 * 3D scene ever loads.
 */
export async function Hero({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "hero" });
  // The same strings the real About section opens with, so what the visitor sees
  // through the doorway is continuous with where the hero hands off.
  const about = await getTranslations({ locale, namespace: "about" });

  return (
    <DoorHeroSection
      copy={{
        eyebrow: t("eyebrow"),
        brandDescriptor: t("brandDescriptor"),
        brandName: siteConfig.name,
        subtitle: t("subtitle"),
        ctaTrial: t("ctaTrial"),
        ctaAfisha: t("ctaAfisha"),
        scrollHint: t("scrollHint"),
      }}
      nextSection={{
        eyebrow: about("eyebrow"),
        heading: about("heading"),
      }}
    />
  );
}
