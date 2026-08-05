import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Sparkles, Compass, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { teachers, teachersIntro, type Teacher, type TeacherSlot } from "@/content/teachers";
import type { AppLocale } from "@/i18n/routing";
import { publicAssetPath } from "@/lib/utils";

function isTeacher(slot: TeacherSlot): slot is Teacher {
  return !("empty" in slot);
}

export async function Teachers({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "teachers" });

  return (
    <section
      id="mastera"
      className="flex scroll-mt-24 flex-col justify-center bg-secondary/60 py-10 md:min-h-svh md:py-12"
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-3 max-w-2xl text-center font-display text-3xl italic text-primary sm:text-4xl md:text-5xl">
            {t("heading")}
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-foreground/80">
            {teachersIntro[locale]}
          </p>
        </Reveal>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {teachers[locale].map((slot, i) => (
            <Reveal key={i} delay={i * 100} className="h-full">
              {isTeacher(slot) ? (
                <TeacherCard
                  teacher={slot}
                  superpowerLabel={t("superpowerLabel")}
                  routeLabel={t("routeLabel")}
                  credentialsLabel={t("credentialsLabel")}
                />
              ) : (
                <EmptySlot label={t("emptySlotLabel")} hint={t("emptySlotHint")} />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeacherCard({
  teacher,
  superpowerLabel,
  routeLabel,
  credentialsLabel,
}: {
  teacher: Teacher;
  superpowerLabel: string;
  routeLabel: string;
  credentialsLabel: string;
}) {
  return (
    <Card className="flex h-full flex-col gap-0 rounded-[8px] border border-border bg-card px-5 py-6 shadow-sm ring-0 transition-shadow hover:shadow-lg">
      <div className="relative mx-auto size-28 shrink-0 md:size-32">
        <Image
          src={publicAssetPath(teacher.photo)}
          alt={teacher.name}
          fill
          className="rounded-full border border-leaf/25 object-cover shadow-sm"
        />
      </div>

      <div className="mt-4 text-center">
        <h3 className="font-display text-xl italic text-primary">{teacher.name}</h3>
        <p className="mt-1 text-sm text-foreground/65">{teacher.role}</p>
      </div>

      <CardContent className="mt-4 flex flex-1 flex-col gap-2.5 p-0">
        <div className="flex gap-2 text-sm leading-snug text-foreground/75">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
          <p>
            <span className="font-semibold text-foreground">{credentialsLabel} </span>
            {teacher.credentials}
          </p>
        </div>

        <div className="flex gap-2 text-sm leading-snug text-foreground/75">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
          <p>
            <span className="font-semibold text-foreground">{superpowerLabel} </span>
            {teacher.superpower}
          </p>
        </div>

        <div className="mt-auto flex gap-2 pt-1 text-sm leading-snug text-foreground/75">
          <Compass className="mt-0.5 h-4 w-4 shrink-0 text-leaf" />
          <p>
            <span className="font-semibold text-foreground">{routeLabel} </span>
            {teacher.route}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptySlot({ label, hint }: { label: string; hint: string }) {
  return (
    <Card className="flex h-full flex-col items-center justify-center gap-0 rounded-[8px] border border-dashed border-border bg-card/40 px-5 py-8 text-center ring-0">
      <div className="mb-3 flex size-14 items-center justify-center rounded-full border border-dashed border-leaf/35 bg-primary/5">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <p className="font-display text-lg italic text-primary">{label}</p>
      <p className="mt-1.5 max-w-[16rem] text-sm text-foreground/60">{hint}</p>
    </Card>
  );
}
