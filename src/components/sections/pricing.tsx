"use client";

import { useTranslations } from "next-intl";
import {
  ArrowRight,
  CalendarRange,
  Check,
  Gift,
  Music2,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/reveal";
import { SectionLink } from "@/components/section-link";
import {
  getPricingItem,
  pricingPreviewItemIds,
  pricingSections,
  pricingStats,
  type PriceItem,
  type PricingSection,
} from "@/content/pricing";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function Pricing({ locale }: { locale: AppLocale }) {
  const t = useTranslations("pricing");
  const previewItems = pricingPreviewItemIds
    .map((id) => getPricingItem(id, locale))
    .filter((item): item is PriceItem => Boolean(item));

  return (
    <section id="tseny" className="scroll-mt-24 border-y border-border bg-secondary/45 py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic leading-[1.05] text-primary sm:text-4xl md:text-5xl">
            {t("heading")}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base leading-relaxed text-foreground/75 md:text-lg">
            {t("previewIntro")}
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {pricingStats[locale].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="font-display text-2xl text-primary">{stat.value}</span>
                <span className="ml-2 text-xs text-foreground/60">{stat.label}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {previewItems.map((item, index) => (
            <Reveal key={item.id} delay={index * 80} className="h-full">
              <CompactPriceCard item={item} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-12 flex flex-col items-center justify-center gap-5 border-t border-border pt-8 text-center sm:flex-row sm:justify-between sm:text-left">
            <p className="max-w-2xl text-sm leading-relaxed text-foreground/65">
              {t("previewNote")}
            </p>
            <Button
              render={<Link href="/pricing" />}
              nativeButton={false}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t("fullCta")}
              <ArrowRight />
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PricingPageContent({ locale }: { locale: AppLocale }) {
  const t = useTranslations("pricing");
  const sections = pricingSections[locale];
  const startItems = getSectionItems(sections, "start", "single");
  const individualSection = getSection(sections, "individual");
  const groupSection = getSection(sections, "groups");
  const monthSection = getSection(sections, "club-1-month");
  const quarterSection = getSection(sections, "club-3-months");
  const recommendedItems = ["group-4", "individual-8", "club-month-individual-8"]
    .map((id) => getPricingItem(id, locale))
    .filter((item): item is PriceItem => Boolean(item));

  return (
    <div className="bg-candle">
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-6xl px-5 py-7 md:px-8 md:py-10">
          <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div>
              <Reveal>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
                  {t("pageEyebrow")}
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="mt-4 max-w-3xl font-display text-4xl italic leading-[1.02] text-candle sm:text-5xl md:text-6xl">
                  {t("pageHeading")}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-primary-foreground/75 md:text-lg">
                  {t("pageIntro")}
                </p>
              </Reveal>
              <Reveal delay={180}>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button
                    render={<SectionLink href="/#kontakty" />}
                    nativeButton={false}
                    size="lg"
                    className="bg-candle text-mahogany hover:bg-candle/90"
                  >
                    {t("cta")}
                    <ArrowRight />
                  </Button>
                  <Button
                    render={<a href="#recommended" />}
                    nativeButton={false}
                    size="lg"
                    variant="outline"
                    className="border-candle/35 bg-transparent text-candle hover:bg-candle/10 hover:text-candle"
                  >
                    {t("catalogCta")}
                  </Button>
                </div>
              </Reveal>
            </div>

            <Reveal delay={140}>
              <div className="border-y border-leaf/40 py-6 lg:border-y-0 lg:border-l lg:py-2 lg:pl-9">
                <div className="flex items-center gap-3 text-leaf">
                  <Gift className="h-5 w-5" />
                  <p className="text-sm font-semibold uppercase tracking-[0.25em]">
                    {t("freeEyebrow")}
                  </p>
                </div>
                <p className="mt-4 font-display text-4xl leading-none text-candle">
                  {t("freeHeading")}
                </p>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-primary-foreground/65">
                  {t("freeText")}
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={220}>
            <div className="mt-12 grid border-t border-primary-foreground/15 pt-6 sm:grid-cols-3">
              {pricingStats[locale].map((stat, index) => (
                <div
                  key={stat.label}
                  className={`py-3 sm:px-6 ${
                    index > 0 ? "border-t border-primary-foreground/15 sm:border-l sm:border-t-0" : ""
                  }`}
                >
                  <p className="font-display text-3xl text-leaf">{stat.value}</p>
                  <p className="mt-1 text-xs leading-relaxed text-primary-foreground/60">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <PricingNav
        label={t("priceNavLabel")}
        items={[
          ["#start", t("navStart")],
          ["#subscriptions", t("navSubscriptions")],
          ["#club-month", t("navClubMonth")],
          ["#club-quarter", t("navClubQuarter")],
        ]}
      />

      <section id="recommended" className="scroll-mt-20 border-b border-border bg-secondary/45 py-8 md:py-12">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
                {t("recommendedEyebrow")}
              </p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-primary md:text-5xl">
                {t("recommendedHeading")}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-foreground/65">
                {t("recommendedIntro")}
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {recommendedItems.map((item, index) => (
              <Reveal key={item.id} delay={index * 80} className="h-full">
                <RecommendedCard
                  item={item}
                  featured={item.id === "individual-8"}
                  eyebrow={
                    index === 0
                      ? t("routeStart")
                      : index === 1
                        ? t("routeProgress")
                        : t("routeCulture")
                  }
                  cta={t("chooseCta")}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing-catalog" className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-12">
        <Reveal>
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
              {t("catalogEyebrow")}
            </p>
            <h2 className="mt-3 font-display text-4xl leading-tight text-primary md:text-5xl">
              {t("catalogHeading")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/65">
              {t("catalogIntro")}
            </p>
          </div>
        </Reveal>

        <div className="mt-14 space-y-20">
          <PricingBand
            id="start"
            icon={<Gift />}
            eyebrow={t("navStart")}
            title={t("startHeading")}
            description={t("startIntro")}
            items={startItems}
            cta={t("chooseCta")}
          />

          <section id="subscriptions" className="scroll-mt-24">
            <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
              <SectionLead
                icon={<Music2 />}
                eyebrow={t("navSubscriptions")}
                title={t("subscriptionsHeading")}
                description={t("subscriptionsIntro")}
              />
              <div className="space-y-10">
                <OfferCollection section={individualSection} cta={t("chooseCta")} />
                <OfferCollection section={groupSection} cta={t("chooseCta")} icon={<Users />} />
              </div>
            </div>
          </section>

          <PricingBand
            id="club-month"
            icon={<Sparkles />}
            eyebrow={t("navClubMonth")}
            title={monthSection.title}
            description={monthSection.description}
            items={monthSection.items}
            cta={t("chooseCta")}
          />

          <PricingBand
            id="club-quarter"
            icon={<CalendarRange />}
            eyebrow={t("navClubQuarter")}
            title={quarterSection.title}
            description={quarterSection.description}
            items={quarterSection.items}
            cta={t("chooseCta")}
          />
        </div>
      </section>

      <section className="bg-primary py-7 text-primary-foreground">
        <Reveal>
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-7 px-5 md:flex-row md:items-center md:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
                {t("finalEyebrow")}
              </p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl leading-tight text-candle md:text-4xl">
                {t("finalHeading")}
              </h2>
            </div>
            <Button
              render={<SectionLink href="/#kontakty" />}
              nativeButton={false}
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {t("cta")}
              <ArrowRight />
            </Button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}

function CompactPriceCard({ item }: { item: PriceItem }) {
  return (
    <Card
      className={`relative flex h-full flex-col gap-0 rounded-[8px] border p-7 ring-0 transition-shadow hover:shadow-lg md:p-8 ${
        item.featured
          ? "border-primary bg-primary text-primary-foreground shadow-lg"
          : "border-border bg-card shadow-sm"
      }`}
    >
      <div className={`flex min-h-7 items-start ${item.badge ? "pr-28" : ""}`}>
        <p className={`min-w-0 text-sm font-semibold uppercase tracking-[0.25em] ${item.featured ? "text-candle" : "text-leaf"}`}>
          {item.benefitLabel}
        </p>
      </div>
      {item.badge && (
        <Badge className="absolute top-5 right-4 h-auto rounded-[4px] bg-accent px-2.5 py-1 text-accent-foreground hover:bg-accent md:top-6 md:right-5">
          {item.badge}
        </Badge>
      )}
      <p className={`mt-5 font-display text-3xl leading-snug ${item.featured ? "text-candle" : "text-primary"}`}>
        {item.benefit}
      </p>
      <h3 className={`mt-5 text-sm font-semibold leading-relaxed ${item.featured ? "text-primary-foreground/85" : "text-foreground/80"}`}>
        {item.title}
      </h3>
      <PriceLine item={item} className="mt-auto pt-6" compact dark={item.featured} />
    </Card>
  );
}

function RecommendedCard({
  item,
  eyebrow,
  cta,
  featured,
}: {
  item: PriceItem;
  eyebrow: string;
  cta: string;
  featured: boolean;
}) {
  return (
    <Card
      className={`relative flex h-full flex-col gap-0 overflow-hidden rounded-[8px] border p-7 ring-0 md:p-8 ${
        featured
          ? "border-primary bg-primary text-primary-foreground shadow-xl"
          : "border-border bg-card shadow-sm"
      }`}
    >
      {featured && <div className="absolute inset-x-0 top-0 h-1 bg-leaf" />}
      <div className={`flex min-h-7 items-start ${item.badge ? "pr-28" : ""}`}>
        <p className={`min-w-0 text-sm font-semibold uppercase tracking-[0.25em] ${featured ? "text-candle" : "text-leaf"}`}>
          {eyebrow}
        </p>
      </div>
      {item.badge && (
        <Badge
          className={`absolute top-5 right-4 h-auto rounded-[4px] px-2.5 py-1 md:top-6 md:right-5 ${
            featured
              ? "bg-accent text-accent-foreground hover:bg-accent"
              : "bg-primary text-primary-foreground hover:bg-primary"
          }`}
        >
          {item.badge}
        </Badge>
      )}
      <h3 className={`mt-3 text-lg font-semibold ${featured ? "text-candle" : "text-primary"}`}>
        {item.title}
      </h3>
      <p className={`mt-8 font-display text-4xl leading-[1.05] ${featured ? "text-candle" : "text-primary"}`}>
        {item.benefit}
      </p>
      {item.description && (
        <p className={`mt-4 text-sm leading-relaxed ${featured ? "text-primary-foreground/70" : "text-foreground/65"}`}>
          {item.description}
        </p>
      )}
      <PriceLine item={item} className="mt-auto pt-8" compact dark={featured} />
      <Button
        render={<SectionLink href="/#kontakty" />}
        nativeButton={false}
        className={`mt-6 w-full ${
          featured
            ? "bg-accent text-accent-foreground hover:bg-accent/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {cta}
        <ArrowRight />
      </Button>
    </Card>
  );
}

function PricingBand({
  id,
  icon,
  eyebrow,
  title,
  description,
  items,
  cta,
}: {
  id: string;
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
  items: PriceItem[];
  cta: string;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="grid gap-10 lg:grid-cols-[16rem_1fr]">
        <SectionLead icon={icon} eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 80} className="h-full">
              <CatalogOffer item={item} cta={cta} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionLead({
  icon,
  eyebrow,
  title,
  description,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Reveal>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-candle [&_svg]:h-5 [&_svg]:w-5">
        {icon}
      </div>
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.25em] text-leaf">{eyebrow}</p>
      <h2 className="mt-2 font-display text-3xl italic leading-tight text-primary">{title}</h2>
      {description && (
        <p className="mt-4 text-sm leading-relaxed text-foreground/60">{description}</p>
      )}
    </Reveal>
  );
}

function OfferCollection({
  section,
  cta,
  icon,
}: {
  section: PricingSection;
  cta: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <Reveal>
        <div className="mb-4 flex items-center gap-3 border-b border-border pb-3">
          {icon && <span className="text-leaf [&_svg]:h-4 [&_svg]:w-4">{icon}</span>}
          <h3 className="font-display text-2xl italic text-primary">{section.title}</h3>
        </div>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-2">
        {section.items.map((item, index) => (
          <Reveal key={item.id} delay={index * 80} className="h-full">
            <CatalogOffer item={item} cta={cta} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

function CatalogOffer({ item, cta }: { item: PriceItem; cta: string }) {
  return (
    <Card
      className={`relative flex h-full flex-col gap-0 rounded-[8px] border p-7 ring-0 md:p-8 ${
        item.featured
          ? "border-leaf/70 bg-secondary shadow-sm"
          : "border-border bg-card shadow-sm"
      }`}
    >
      <div className={`flex min-h-7 items-start ${item.badge ? "pr-28" : ""}`}>
        <p className="min-w-0 text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
          {item.benefitLabel}
        </p>
      </div>
      {item.badge && (
        <Badge className="absolute top-5 right-4 h-auto rounded-[4px] bg-primary px-2.5 py-1 text-primary-foreground hover:bg-primary md:top-6 md:right-5">
          {item.badge}
        </Badge>
      )}

      <h3 className="mt-5 text-base font-semibold text-primary">{item.title}</h3>
      <p className="mt-2 font-display text-3xl leading-snug text-primary">
        {item.benefit}
      </p>
      {item.description && (
        <p className="mt-3 text-sm leading-relaxed text-foreground/65">{item.description}</p>
      )}

      {item.details && (
        <ul className="mt-5 space-y-2.5">
          {item.details.map((detail) => (
            <li key={detail} className="flex items-start gap-2 text-xs leading-relaxed text-foreground/65">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-leaf" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto flex flex-col gap-5 border-t border-border/80 pt-6 sm:flex-row sm:items-end sm:justify-between">
        <PriceLine item={item} compact />
        <Button
          render={<SectionLink href="/#kontakty" />}
          nativeButton={false}
          size="sm"
          variant="ghost"
          className="justify-start px-0 text-primary hover:bg-transparent hover:text-leaf sm:justify-center"
        >
          {cta}
          <ArrowRight />
        </Button>
      </div>
    </Card>
  );
}

function PricingNav({
  label,
  items,
}: {
  label: string;
  items: [string, string][];
}) {
  return (
    <nav aria-label={label} className="w-full border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-5 py-3 md:px-8">
        {items.map(([href, itemLabel]) => (
          <Button
            key={href}
            render={<a href={href} />}
            nativeButton={false}
            size="sm"
            variant="ghost"
            className="shrink-0 rounded-full px-2 text-sm font-semibold uppercase tracking-[0.25em] text-foreground/60 hover:bg-secondary hover:text-primary"
          >
            {itemLabel}
          </Button>
        ))}
      </div>
    </nav>
  );
}

function PriceLine({
  item,
  className = "",
  compact = false,
  dark = false,
}: {
  item: PriceItem;
  className?: string;
  compact?: boolean;
  dark?: boolean;
}) {
  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span
          className={`${compact ? "text-xl" : "text-2xl"} font-medium ${dark ? "text-candle" : "text-primary"}`}
        >
          {item.price}
        </span>
        {item.unit && (
          <span className={`text-xs ${dark ? "text-primary-foreground/60" : "text-foreground/50"}`}>
            / {item.unit}
          </span>
        )}
      </div>
    </div>
  );
}

function getSection(sections: PricingSection[], id: string) {
  const section = sections.find((candidate) => candidate.id === id);
  if (!section) {
    throw new Error(`Missing pricing section: ${id}`);
  }
  return section;
}

function getSectionItems(sections: PricingSection[], ...ids: string[]) {
  return ids.flatMap((id) => getSection(sections, id).items);
}
