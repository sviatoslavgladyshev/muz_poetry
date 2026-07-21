import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { directions, directionGroups, type DirectionGroup } from "@/content/directions";
import type { AppLocale } from "@/i18n/routing";
import { publicAssetPath } from "@/lib/utils";
import { Link } from "@/i18n/navigation";

export async function Directions({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "directions" });

  const groupLabels: Record<DirectionGroup, string> = {
    instruments: t("groupInstruments"),
    vocal: t("groupVocal"),
  };

  return (
    <section id="obuchenie" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic text-primary sm:text-4xl md:text-5xl">
            {t("heading")}
          </h2>
        </Reveal>

        {directionGroups.map((group) => (
          <div key={group} className="mt-16 first:mt-16">
            <Reveal>
              <h3 className="mb-7 font-display text-2xl italic text-primary">
                {groupLabels[group]}
              </h3>
            </Reveal>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {directions[locale]
                .filter((d) => d.group === group)
                .map((direction, i) => (
                  <Reveal key={direction.id} delay={i * 100} className="h-full">
                    <Card className="flex h-full flex-col gap-0 overflow-hidden rounded-[8px] border border-border bg-card py-0 shadow-sm ring-0 transition-shadow hover:shadow-lg">
                      <div className="relative aspect-[5/4] w-full">
                        <Image
                          src={publicAssetPath(direction.image)}
                          alt={direction.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="flex flex-1 flex-col gap-3 p-6">
                        <h4 className="font-display text-2xl italic text-primary">
                          {direction.title}
                        </h4>
                        <p className="text-sm leading-relaxed text-foreground/75">
                          {direction.description}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/75">
                          <span className="font-semibold text-foreground">
                            {t("resultLabel")}{" "}
                          </span>
                          {direction.result}
                        </p>
                        <p className="text-sm leading-relaxed text-foreground/60">
                          <span className="font-semibold text-foreground/80">
                            {t("forWhomLabel")}{" "}
                          </span>
                          {direction.forWhom}
                        </p>
                        <Button
                          render={<Link href="/pricing" />}
                          nativeButton={false}
                          className="mt-auto w-full bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {t("cta")}
                        </Button>
                      </CardContent>
                    </Card>
                  </Reveal>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
