import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Heart, Sparkles, BookOpen, Drama } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { historyText, values, type ValueCard } from "@/content/values";
import type { AppLocale } from "@/i18n/routing";
import { publicAssetPath } from "@/lib/utils";

const icons: Record<ValueCard["icon"], React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  sparkles: Sparkles,
  "book-open": BookOpen,
  drama: Drama,
};

export async function About({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });
  const continuationValues = values[locale].slice(2);

  return (
    <div
      id="o-masterskoy"
      className="bg-cream pt-10 pb-24 md:-mt-48 md:pt-14 md:pb-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* The About heading, mission and first two principles are the real content
            revealed through the doors. The document continues here without repeating
            them, completing the same four-part values sequence. */}
        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {continuationValues.map((value, i) => {
            const Icon = icons[value.icon];
            return (
              <Reveal key={value.title} delay={i * 100}>
                <Card className="flex h-full flex-col gap-0 rounded-[8px] border border-border bg-card py-0 shadow-sm ring-0 transition-shadow hover:shadow-md">
                  <CardContent className="flex h-full flex-col p-7">
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl italic text-primary">{value.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                      {value.description}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-20 grid items-center gap-10 md:mt-24 md:grid-cols-2 md:gap-16">
          <Reveal as="section" className="order-2 md:order-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
              {t("historyEyebrow")}
            </p>
            <h3 className="mt-4 font-display text-3xl italic text-primary">
              {t("historyHeading")}
            </h3>
            <p className="mt-6 text-base leading-relaxed text-foreground/80">
              {historyText[locale]}
            </p>
          </Reveal>
          <Reveal delay={120} className="order-1 md:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg">
              <Image
                src={publicAssetPath("/images/history-quartirnik.svg")}
                alt="Отчётный квартирник мастерской «Поэзия звука»"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
