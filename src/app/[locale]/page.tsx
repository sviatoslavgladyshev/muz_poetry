import { setRequestLocale } from "next-intl/server";
import type { AppLocale } from "@/i18n/routing";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Teachers } from "@/components/sections/teachers";
import { Directions } from "@/components/sections/directions";
import { CulturalClub } from "@/components/sections/cultural-club";
import { Pricing } from "@/components/sections/pricing";
import { Afisha } from "@/components/sections/afisha";
import { Contacts } from "@/components/sections/contacts";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as AppLocale;

  return (
    <>
      <Hero locale={l} />
      <About locale={l} />
      <Teachers locale={l} />
      <Directions locale={l} />
      <CulturalClub locale={l} />
      <Pricing locale={l} />
      <Afisha locale={l} />
      <Contacts locale={l} />
    </>
  );
}
