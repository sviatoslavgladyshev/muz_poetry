import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { EventCard } from "@/components/event-card";
import { Link } from "@/i18n/navigation";
import { events } from "@/content/events";
import type { AppLocale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "afisha" });
  return {
    title: `${t("pageHeading")} — «Поэзия звука»`,
    description: t("pageIntro"),
  };
}

export default async function AfishaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const l = locale as AppLocale;
  const t = await getTranslations({ locale, namespace: "afisha" });

  const sorted = [...events[l]].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-4 max-w-2xl text-center font-display text-4xl italic text-primary sm:text-5xl">
            {t("pageHeading")}
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-foreground/80">
            {t("pageIntro")}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((event, i) => (
            <Reveal key={event.id} delay={(i % 3) * 100} className="h-full">
              <EventCard event={event} locale={l} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 text-center">
            <Button
              render={<Link href="/#kontakty" />}
              nativeButton={false}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("ctaTrial")}
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
