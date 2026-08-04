import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PricingPageContent } from "@/components/sections/pricing";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricing" });
  const tNav = await getTranslations({ locale, namespace: "nav" });

  return {
    title: `${t("pageEyebrow")} — ${tNav("brand")}`,
    description: t("pageIntro"),
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <PricingPageContent locale={locale as AppLocale} />;
}
