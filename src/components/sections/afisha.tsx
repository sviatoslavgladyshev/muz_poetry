import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export async function Afisha({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "afisha" });

  return (
    <section id="afisha" className="scroll-mt-24 bg-candle py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic text-primary sm:text-4xl md:text-5xl">
            {t("heading")}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-foreground/80">
            {t("intro")}
          </p>
        </Reveal>

        <Reveal delay={180}>
          <div className="mx-auto mt-12 max-w-2xl border border-border bg-secondary/50 px-8 py-12 text-center md:px-12 md:py-14">
            <p className="font-display text-2xl italic text-primary sm:text-3xl">
              {t("comingSoonTitle")}
            </p>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-foreground/70">
              {t("comingSoon")}
            </p>
          </div>
        </Reveal>

        <Reveal delay={220}>
          <div className="mt-10 text-center">
            <Button
              render={<Link href="/afisha" />}
              nativeButton={false}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {t("ctaFull")}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
