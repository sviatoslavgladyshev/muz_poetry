import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { EventCard } from "@/components/event-card";
import { events } from "@/content/events";

export function Afisha() {
  const upcoming = events.slice(0, 3);

  return (
    <section id="afisha" className="bg-cream py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            Жизнь мастерской
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic text-primary sm:text-4xl md:text-5xl">
            Афиша и события
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mx-auto mt-6 max-w-xl text-center text-lg leading-relaxed text-foreground/80">
            Концерты, квартирники, лекции и кинопоказы — ближайшие встречи мастерской.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {upcoming.map((event, i) => (
            <Reveal key={event.id} delay={i * 100} className="h-full">
              <EventCard event={event} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 text-center">
            <Button
              render={<Link href="/afisha" />}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Смотреть полную афишу
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
