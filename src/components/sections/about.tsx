import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { historyText } from "@/content/values";
import type { AppLocale } from "@/i18n/routing";
import { publicAssetPath } from "@/lib/utils";

export async function About({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div
      id="o-masterskoy"
      className="bg-cream py-24 md:-mt-24 md:pt-32 md:pb-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* The heading, mission and all four principles are revealed through the
            doors. The document continues directly into the workshop's history. */}
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
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
