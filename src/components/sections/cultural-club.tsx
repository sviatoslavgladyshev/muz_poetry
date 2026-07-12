import { getTranslations } from "next-intl/server";
import { Ticket, Sparkle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { clubIntro, clubOfferings, type ClubOffering } from "@/content/club";
import { siteConfig } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

const icons: Record<ClubOffering["icon"], React.ComponentType<{ className?: string }>> = {
  ticket: Ticket,
  sparkle: Sparkle,
};

export async function CulturalClub({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "club" });

  return (
    <section id="klub" className="bg-primary py-24 text-primary-foreground md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold-soft">
            {t("eyebrowPrefix")} {siteConfig.name}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic sm:text-4xl md:text-5xl">
            {t("heading")}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg text-primary-foreground/80">
            {clubIntro[locale]}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {clubOfferings[locale].map((offering, i) => {
            const Icon = icons[offering.icon];
            return (
              <Reveal key={offering.title} delay={i * 120} className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-cream/15 bg-cream/5 p-8 backdrop-blur-sm">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                    <Icon className="h-6 w-6 text-gold-soft" />
                  </div>
                  <h3 className="font-display text-2xl italic">{offering.title}</h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-primary-foreground/80">
                    {offering.description}
                  </p>
                  <p className="mt-6 text-sm font-medium text-gold-soft">{offering.forWhom}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
