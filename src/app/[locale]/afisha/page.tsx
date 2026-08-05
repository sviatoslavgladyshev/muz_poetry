import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SectionLink } from "@/components/section-link";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "afisha" });
  const tNav = await getTranslations({ locale, namespace: "nav" });
  return {
    title: `${t("pageHeading")} — ${tNav("brand")}`,
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
  const t = await getTranslations({ locale, namespace: "afisha" });

  return (
    <div className="bg-candle py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
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

        <Reveal delay={180}>
          <div className="mx-auto mt-12 max-w-2xl border border-border bg-secondary/50 px-8 py-14 text-center md:px-12 md:py-16">
            <p className="font-display text-2xl italic text-primary sm:text-3xl">
              {t("comingSoonTitle")}
            </p>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-foreground/70">
              {t("comingSoon")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-12 text-center">
            <Button
              render={<SectionLink href="/#kontakty" />}
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
