import { MapPin, Phone, Send, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { TrialForm } from "@/components/trial-form";
import { siteConfig } from "@/content/site";

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.16 18.6c-6.7 0-10.62-4.68-10.79-12.47h3.4c.12 5.7 2.6 8.11 4.53 8.6V6.13h3.19v4.9c1.91-.21 3.9-2.45 4.58-4.9h3.18c-.52 3-2.72 5.24-4.28 6.16 1.56.74 4.06 2.7 5 6.31h-3.5c-.72-2.35-2.55-4.16-5-4.41v4.41h-.31z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function Contacts() {
  return (
    <section id="kontakty" className="bg-plum-deep py-24 text-cream md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-gold-soft">
            Контакты
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic sm:text-4xl md:text-5xl">
            Приходите на пробное занятие
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-10 lg:grid-cols-5 lg:gap-14">
          <Reveal delay={120} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold-soft" />
                <div>
                  <p className="font-semibold">Адрес</p>
                  <p className="text-cream/75">{siteConfig.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-gold-soft" />
                <div>
                  <p className="font-semibold">Телефон / WhatsApp</p>
                  <a
                    href={siteConfig.phoneHref}
                    className="text-cream/75 transition-colors hover:text-gold-soft"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                  <p className="text-sm text-cream/60">{siteConfig.contactPerson}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={siteConfig.vk}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="ВКонтакте"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-gold hover:text-plum-deep"
                >
                  <VkIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-gold hover:text-plum-deep"
                >
                  <Send className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-gold hover:text-plum-deep"
                >
                  <MessageCircle className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-cream/10 transition-colors hover:bg-gold hover:text-plum-deep"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>

              <div className="mt-2 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-cream/15">
                <iframe
                  src={siteConfig.yandexMapEmbedSrc}
                  title="Мастерская «Поэзия звука» на карте — улица Гоголя, 25, Казань"
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={200} className="lg:col-span-3">
            <div className="rounded-3xl bg-cream p-7 text-foreground shadow-xl md:p-9">
              <h3 className="font-display text-2xl italic text-primary">
                Запись на пробное занятие
              </h3>
              <p className="mt-2 text-sm text-foreground/70">
                Оставьте контакты — мы перезвоним и подберём удобное время.
              </p>
              <div className="mt-6">
                <TrialForm />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
