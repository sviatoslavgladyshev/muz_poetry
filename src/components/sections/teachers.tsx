import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Quote, Sparkles, Compass, GraduationCap } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { teachers, teachersIntro, type Teacher, type TeacherSlot } from "@/content/teachers";
import type { AppLocale } from "@/i18n/routing";

function isTeacher(slot: TeacherSlot): slot is Teacher {
  return !("empty" in slot);
}

export async function Teachers({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "teachers" });

  return (
    <section id="mastera" className="bg-secondary/60 py-24 md:py-32">
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
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-foreground/80">
            {teachersIntro[locale]}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
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
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-shadow hover:shadow-lg">
      <div className="relative aspect-[4/5] w-full">
        <Image src={teacher.photo} alt={teacher.name} fill className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-plum-deep/90 to-transparent p-5">
          <h3 className="font-display text-2xl italic text-cream">{teacher.name}</h3>
          {teacher.alias && <p className="text-xs text-cream/70">({teacher.alias})</p>}
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-6">
        <p className="text-sm font-semibold text-primary">{teacher.role}</p>

        <div className="flex gap-2 text-sm leading-relaxed text-foreground/75">
          <GraduationCap className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>
            <span className="font-semibold text-foreground">{credentialsLabel} </span>
            {teacher.credentials}
          </p>
        </div>

        <div className="flex gap-2 text-sm leading-relaxed text-foreground/75">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>
            <span className="font-semibold text-foreground">{superpowerLabel} </span>
            {teacher.superpower}
          </p>
        </div>

        <blockquote className="relative rounded-xl bg-secondary/70 p-4 text-sm italic leading-relaxed text-foreground/85">
          <Quote className="mb-1 h-4 w-4 text-gold" />
          {teacher.quote}
        </blockquote>

        <div className="mt-auto flex gap-2 text-sm text-foreground/75">
          <Compass className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
          <p>
            <span className="font-semibold text-foreground">{routeLabel} </span>
            {teacher.route}
          </p>
        </div>
      </div>
    </article>
  );
}

function EmptySlot({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex h-full min-h-[26rem] flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-card/40 p-8 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-6 w-6 text-primary" />
      </div>
      <p className="font-display text-xl italic text-primary">{label}</p>
      <p className="mt-2 text-sm text-foreground/60">{hint}</p>
    </div>
  );
}
