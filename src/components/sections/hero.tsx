import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import type { AppLocale } from "@/i18n/routing";
import { publicAssetPath } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

export async function Hero({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "hero" });

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0">
        <Image
          src={publicAssetPath("/images/hero-studio.svg")}
          alt="Зал вокально-акустической мастерской «Поэзия звука»"
          fill
          priority
          className="object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/40" />
      </div>

      <div className="relative mx-auto flex max-w-5xl flex-col items-center px-5 pt-28 pb-24 text-center md:pt-36 md:pb-32">
        <Reveal>
          <p className="mb-4 text-sm font-semibold tracking-[0.25em] text-gold-soft uppercase">
            {t("eyebrow")}
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl">
            {t("brandDescriptor")}
            <span className="block not-italic text-gold-soft">«Поэзия звука»</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85 md:text-xl">
            {t("subtitle")}
          </p>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-cream/95 md:text-2xl">
            {t("slogan")}
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              render={<a href="#kontakty" />}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {t("ctaTrial")}
            </Button>
            <Button
              render={<a href="#afisha" />}
              size="lg"
              variant="outline"
              className="border-cream/40 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
            >
              {t("ctaAfisha")}
            </Button>
          </div>
          <Link
            href="/pricing"
            className="mt-5 inline-block text-sm font-medium text-cream/70 underline underline-offset-4 transition-colors hover:text-cream"
          >
            {t("ctaSubscription")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
