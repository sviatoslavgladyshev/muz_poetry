"use client";

import { useState } from "react";
import { Check, ShieldCheck } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { singleVisits, subscriptions, pricingTrustLine, type PriceItem } from "@/content/pricing";

export function Pricing() {
  const [isAdult, setIsAdult] = useState(false);

  return (
    <section id="tseny" className="bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold">
            Стоимость обучения
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic text-primary sm:text-4xl md:text-5xl">
            Разовые встречи и клубные карты
          </h2>
        </Reveal>

        <Reveal delay={140}>
          <div className="mx-auto mt-10 flex w-fit items-center gap-4 rounded-full border border-border bg-card px-6 py-3 shadow-sm">
            <span
              className={`text-sm font-semibold transition-colors ${!isAdult ? "text-primary" : "text-foreground/50"}`}
            >
              Цены для детей
            </span>
            <Switch
              checked={isAdult}
              onCheckedChange={setIsAdult}
              aria-label="Переключить цены между детьми и взрослыми"
            />
            <span
              className={`text-sm font-semibold transition-colors ${isAdult ? "text-primary" : "text-foreground/50"}`}
            >
              Цены для взрослых
            </span>
          </div>
        </Reveal>

        <Reveal delay={180}>
          <h3 className="mb-6 mt-16 text-center font-display text-2xl italic text-primary">
            Разовые встречи
          </h3>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {singleVisits.map((item, i) => (
            <Reveal key={item.id} delay={i * 100} className="h-full">
              <PriceCard item={item} isAdult={isAdult} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={100}>
          <h3 className="mb-6 mt-16 text-center font-display text-2xl italic text-primary">
            Абонементы
          </h3>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {subscriptions.map((item, i) => (
            <Reveal key={item.id} delay={i * 120} className="h-full">
              <PriceCard item={item} isAdult={isAdult} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mx-auto mt-14 flex max-w-2xl items-start gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-5 text-sm leading-relaxed text-foreground/80">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
            <p>{pricingTrustLine}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PriceCard({ item, isAdult }: { item: PriceItem; isAdult: boolean }) {
  const price = isAdult ? item.priceAdults : item.priceChildren;

  return (
    <div
      className={`relative flex h-full flex-col rounded-3xl border p-7 shadow-sm transition-shadow hover:shadow-lg ${
        item.featured
          ? "border-gold bg-primary text-primary-foreground"
          : "border-border bg-card"
      }`}
    >
      {item.badge && (
        <Badge className="absolute -top-3 left-7 bg-accent text-accent-foreground hover:bg-accent">
          {item.badge}
        </Badge>
      )}

      <h4
        className={`font-display text-xl italic ${item.featured ? "text-cream" : "text-primary"}`}
      >
        {item.title}
      </h4>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          item.featured ? "text-primary-foreground/80" : "text-foreground/70"
        }`}
      >
        {item.description}
      </p>

      <div className="mt-5 flex items-baseline gap-2">
        <span
          className={`font-display text-3xl italic ${item.featured ? "text-gold-soft" : "text-primary"}`}
        >
          {price}
        </span>
        <span
          className={`text-sm ${item.featured ? "text-primary-foreground/70" : "text-foreground/60"}`}
        >
          / {item.unit}
        </span>
      </div>

      {item.details && (
        <ul className="mt-5 flex flex-col gap-2.5">
          {item.details.map((detail) => (
            <li
              key={detail}
              className={`flex items-start gap-2 text-sm leading-relaxed ${
                item.featured ? "text-primary-foreground/85" : "text-foreground/75"
              }`}
            >
              <Check
                className={`mt-0.5 h-4 w-4 shrink-0 ${item.featured ? "text-gold-soft" : "text-gold"}`}
              />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        asChild
        className={`mt-7 w-full ${
          item.featured
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        <a href="#kontakty">Записаться на пробное занятие</a>
      </Button>
    </div>
  );
}
