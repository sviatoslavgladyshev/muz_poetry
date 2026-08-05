import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/reveal";
import { historyText } from "@/content/values";
import type { AppLocale } from "@/i18n/routing";

export async function About({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <div
      id="o-masterskoy"
      className="scroll-mt-24 bg-candle py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* The heading, mission and all four principles are revealed through the
            doors. The document continues directly into the workshop's history. */}
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal as="section" className="order-2 md:order-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
              {t("historyEyebrow")}
            </p>
            <h2 className="mt-4 font-display text-3xl italic text-primary sm:text-4xl md:text-5xl">
              {t("historyHeading")}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-foreground/80 md:text-lg">
              {historyText[locale]}
            </p>
          </Reveal>
          <Reveal delay={120} className="order-1 md:order-2">
            <div
              className="relative flex aspect-[4/5] w-full flex-col items-center justify-center overflow-hidden rounded-[8px] bg-mahogany px-8 py-10 text-center shadow-sm sm:px-10"
              role="img"
              aria-label={t("historyImageAlt")}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 20% 20%, var(--candle) 0 1px, transparent 1.5px), radial-gradient(circle at 80% 70%, var(--leaf) 0 1px, transparent 1.5px)",
                  backgroundSize: "48px 48px, 64px 64px",
                }}
              />
              <div className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-candle/10" />
              <div className="pointer-events-none absolute -bottom-20 -left-12 size-48 rounded-full bg-leaf/15" />

              <p className="relative text-sm font-semibold uppercase tracking-[0.22em] text-leaf">
                {t("historyCardEyebrow")}
              </p>
              <p className="relative mt-5 max-w-[14ch] font-display text-4xl leading-tight text-candle sm:text-5xl">
                {t("historyCardTitle")}
              </p>
              <span className="relative mt-6 h-px w-14 bg-leaf/60" aria-hidden="true" />
              <p className="relative mt-5 max-w-xs text-sm leading-relaxed text-candle/70">
                {t("historyCardCaption")}
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
