"use client";

import { useTranslations } from "next-intl";
import { ArrowRight, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import {
  getPricingItem,
  pricingPreviewItemIds,
  pricingSections,
  pricingStats,
  type PriceItem,
} from "@/content/pricing";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function Pricing({ locale }: { locale: AppLocale }) {
  const t = useTranslations("pricing");
  const previewItems = pricingPreviewItemIds
    .map((id) => getPricingItem(id, locale))
    .filter((item): item is PriceItem => Boolean(item));

  return (
    <section id="tseny" className="bg-secondary/60 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold">
                {t("eyebrow")}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="mt-4 max-w-xl font-display text-3xl italic leading-tight text-primary sm:text-4xl md:text-5xl">
                {t("heading")}
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/75 md:text-lg">
                {t("previewIntro")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="grid gap-3 sm:grid-cols-3">
              {pricingStats[locale].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-border bg-card px-5 py-4 shadow-sm"
                >
                  <p className="font-display text-2xl italic text-primary">{stat.value}</p>
                  <p className="mt-1 text-xs font-medium leading-relaxed text-foreground/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {previewItems.map((item, i) => (
            <Reveal key={item.id} delay={i * 100} className="h-full">
              <CompactPriceCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-12 flex flex-col items-center justify-between gap-5 border-t border-border pt-8 text-center sm:flex-row sm:text-left">
            <p className="max-w-2xl text-sm leading-relaxed text-foreground/70">
              {t("previewNote")}
            </p>
            <Button
              render={<Link href="/pricing" />}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("fullCta")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PricingPageContent({ locale }: { locale: AppLocale }) {
  const t = useTranslations("pricing");

  return (
    <div className="bg-cream">
      <section className="bg-primary text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-[1fr_0.85fr]">
          <div>
            <Reveal>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gold-soft">
                {t("pageEyebrow")}
              </p>
            </Reveal>
            <Reveal delay={80}>
              <h1 className="mt-5 max-w-3xl font-display text-4xl italic leading-tight text-cream sm:text-5xl md:text-6xl">
                {t("pageHeading")}
              </h1>
            </Reveal>
            <Reveal delay={140}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
                {t("pageIntro")}
              </p>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button
                  render={<Link href="/#kontakty" />}
                  size="lg"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {t("cta")}
                </Button>
                <Button
                  render={<a href="#pricing-catalog" />}
                  size="lg"
                  variant="outline"
                  className="border-cream/40 bg-transparent text-cream hover:bg-cream/10 hover:text-cream"
                >
                  {t("catalogCta")}
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal delay={160}>
            <div className="grid gap-3 self-end sm:grid-cols-3 lg:grid-cols-1">
              {pricingStats[locale].map((stat) => (
                <div
                  key={stat.label}
                  className="border-l border-gold-soft/45 bg-cream/10 px-5 py-4"
                >
                  <p className="font-display text-3xl italic text-gold-soft">{stat.value}</p>
                  <p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-5 py-4 md:px-8">
          {pricingSections[locale].map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="shrink-0 rounded-full border border-border bg-cream px-4 py-2 text-xs font-semibold text-foreground/70 transition-colors hover:border-primary hover:text-primary"
            >
              {section.title}
            </a>
          ))}
        </div>
      </section>

      <section id="pricing-catalog" className="py-20 md:py-28">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 md:px-8">
          {pricingSections[locale].map((section, sectionIndex) => (
            <Reveal key={section.id} delay={sectionIndex * 60}>
              <section id={section.id} className="scroll-mt-24">
                <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">
                      {String(sectionIndex + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-3 font-display text-3xl italic leading-tight text-primary">
                      {section.title}
                    </h2>
                    {section.description && (
                      <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                        {section.description}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {section.items.map((item) => (
                      <FullPriceCard key={item.id} item={item} cta={t("ctaShort")} />
                    ))}
                  </div>
                </div>
              </section>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

function CompactPriceCard({ item }: { item: PriceItem }) {
  return (
    <article
      className={`flex h-full flex-col rounded-2xl border p-6 shadow-sm ${
        item.featured ? "border-gold bg-primary text-primary-foreground" : "border-border bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            item.featured ? "bg-gold-soft text-primary" : "bg-primary/10 text-primary"
          }`}
        >
          {item.label}
        </span>
        {item.badge && (
          <Badge className="bg-accent text-accent-foreground hover:bg-accent">
            {item.badge}
          </Badge>
        )}
      </div>

      <h3 className={`mt-5 font-display text-xl italic ${item.featured ? "text-cream" : "text-primary"}`}>
        {item.title}
      </h3>
      {item.description && (
        <p
          className={`mt-2 text-sm leading-relaxed ${
            item.featured ? "text-primary-foreground/75" : "text-foreground/70"
          }`}
        >
          {item.description}
        </p>
      )}
      <PriceLine item={item} className="mt-auto pt-6" />
    </article>
  );
}

function FullPriceCard({ item, cta }: { item: PriceItem; cta: string }) {
  return (
    <article
      className={`relative flex h-full flex-col rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-lg ${
        item.featured ? "border-gold bg-primary text-primary-foreground" : "border-border bg-card"
      }`}
    >
      {item.badge && (
        <Badge className="absolute -top-3 left-5 bg-accent text-accent-foreground hover:bg-accent">
          {item.badge}
        </Badge>
      )}

      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            item.featured ? "bg-gold-soft text-primary" : "bg-primary/10 text-primary"
          }`}
        >
          {item.label}
        </span>
        <h3
          className={`font-display text-xl italic leading-tight ${
            item.featured ? "text-cream" : "text-primary"
          }`}
        >
          {item.title}
        </h3>
      </div>

      {item.description && (
        <p
          className={`mt-4 text-sm leading-relaxed ${
            item.featured ? "text-primary-foreground/75" : "text-foreground/70"
          }`}
        >
          {item.description}
        </p>
      )}

      <PriceLine item={item} className="mt-6" />

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
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  item.featured ? "text-gold-soft" : "text-gold"
                }`}
              />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

      <Button
        render={<Link href="/#kontakty" />}
        className={`mt-auto w-full ${
          item.featured
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {cta}
      </Button>
    </article>
  );
}

function PriceLine({ item, className = "" }: { item: PriceItem; className?: string }) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={`font-display text-3xl italic ${
            item.featured ? "text-gold-soft" : "text-primary"
          }`}
        >
          {item.price}
        </span>
        {item.unit && (
          <span
            className={`text-sm ${item.featured ? "text-primary-foreground/70" : "text-foreground/60"}`}
          >
            / {item.unit}
          </span>
        )}
      </div>
    </div>
  );
}
