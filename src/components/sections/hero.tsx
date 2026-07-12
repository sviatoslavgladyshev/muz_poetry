import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-studio.svg"
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
            Казань · с 6 лет и для взрослых
          </p>
        </Reveal>

        <Reveal delay={80}>
          <h1 className="font-display text-4xl italic leading-tight sm:text-5xl md:text-6xl">
            Вокально-акустическая мастерская
            <span className="block not-italic text-gold-soft">«Поэзия звука»</span>
          </h1>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-6 max-w-2xl text-lg text-primary-foreground/85 md:text-xl">
            Пространство музыки, культуры и искусства для детей от 6 лет и взрослых.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-8 max-w-2xl font-display text-xl italic leading-relaxed text-cream/95 md:text-2xl">
            «Музыка как способ мыслить, звук как способ чувствовать: учим понимать классику
            и звучать свободно».
          </p>
        </Reveal>

        <Reveal delay={320}>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <a href="#kontakty">Записаться на пробное занятие</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-cream/40 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
            >
              <a href="#afisha">Смотреть афишу событий</a>
            </Button>
          </div>
          <a
            href="#tseny"
            className="mt-5 inline-block text-sm font-medium text-cream/70 underline underline-offset-4 transition-colors hover:text-cream"
          >
            Купить абонемент
          </a>
        </Reveal>
      </div>
    </section>
  );
}
