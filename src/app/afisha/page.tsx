import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { EventCard } from "@/components/event-card";
import { events } from "@/content/events";

export const metadata: Metadata = {
  title: "Афиша событий — «Поэзия звука»",
  description:
    "Концерты, квартирники, лекции и кинопоказы вокально-акустической мастерской «Поэзия звука» в Казани.",
};

export default function AfishaPage() {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            Жизнь мастерской
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mx-auto mt-4 max-w-2xl text-center font-display text-4xl italic text-primary sm:text-5xl">
            Афиша событий
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-foreground/80">
            Все концерты, квартирники, лекции и кинопоказы мастерской — в одном месте.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((event, i) => (
            <Reveal key={event.id} delay={(i % 3) * 100} className="h-full">
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-16 text-center">
            <Button
              render={<Link href="/#kontakty" />}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Записаться на пробное занятие
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
