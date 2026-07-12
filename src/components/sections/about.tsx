import Image from "next/image";
import { Heart, Sparkles, BookOpen, Drama } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { missionText, historyText, values, type ValueCard } from "@/content/values";

const icons: Record<ValueCard["icon"], React.ComponentType<{ className?: string }>> = {
  heart: Heart,
  sparkles: Sparkles,
  "book-open": BookOpen,
  drama: Drama,
};

export function About() {
  return (
    <section id="o-masterskoy" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            О мастерской
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl italic leading-snug text-primary sm:text-4xl md:text-5xl">
            Через звук — к чувствам, через классику — к мыслям
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-relaxed text-foreground/80">
            {missionText}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, i) => {
            const Icon = icons[value.icon];
            return (
              <Reveal key={value.title} delay={i * 100}>
                <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-md">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl italic text-primary">{value.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    {value.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-24 grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <Reveal as="section" className="order-2 md:order-1">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
              Наша история
            </p>
            <h3 className="mt-4 font-display text-3xl italic text-primary">
              Как рождалась «Поэзия звука»
            </h3>
            <p className="mt-6 text-base leading-relaxed text-foreground/80">{historyText}</p>
          </Reveal>
          <Reveal delay={120} className="order-1 md:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg">
              <Image
                src="/images/history-quartirnik.svg"
                alt="Отчётный квартирник мастерской «Поэзия звука»"
                fill
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
