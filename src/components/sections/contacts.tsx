import { getTranslations } from "next-intl/server";
import { MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { siteConfig } from "@/content/site";
import type { AppLocale } from "@/i18n/routing";

function VkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.785 16.312s.338-.037.51-.225c.158-.172.153-.495.153-.495s-.022-1.51.676-1.732c.69-.218 1.577 1.46 2.514 2.104.71.488 1.246.381 1.246.381l2.505-.035s1.312-.081.69-1.12c-.051-.085-.364-.747-1.873-2.11-1.58-1.427-1.293-1.196.505-3.664 1.094-1.504 1.532-2.42 1.394-2.815-.131-.376-.94-.277-.94-.277l-2.817.018s-.209-.029-.364.064c-.151.09-.248.3-.248.3s-.445 1.186-1.038 2.194c-1.253 2.13-1.754 2.244-1.959 2.112-.478-.307-.358-1.238-.358-1.897 0-2.062.312-2.91-.608-3.132-.305-.073-.529-.122-1.308-.13-.999-.01-1.845.003-2.325.202-.319.133-.565.428-.415.445.186.02.607.114.83.418.288.392.277 1.273.277 1.273s.156 2.42-.364 2.72c-.356.205-.845-.213-1.895-2.13C7.217 7.37 6.846 6.25 6.846 6.25s-.072-.177-.252-.272c-.218-.115-.522-.152-.522-.152H3.85s-.56.016-.765.26c-.182.217-.015.665-.015.665s2.096 4.91 4.472 7.385c2.178 2.27 4.65 2.12 4.65 2.12h1.593z" />
    </svg>
  );
}

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M9.78 15.23 9.5 18.8c.4 0 .57-.17.78-.37l1.87-1.8 3.88 2.85c.71.39 1.22.19 1.41-.66l2.56-12.04h.01c.23-1.05-.38-1.46-1.07-1.2L3.65 10.3c-1.02.4-.99.95-.17 1.2l3.75 1.17 8.7-5.48c.41-.25.78-.11.47.14z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.89.49 3.73 1.42 5.36L2 22l4.88-1.52a9.86 9.86 0 0 0 5.16 1.43h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.79 14.07c-.24.68-1.4 1.25-1.95 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.2-4.93-4.39-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.36.26-.29.57-.36.76-.36h.55c.17 0 .41-.06.64.49.24.57.82 2 .89 2.14.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.37-.43.5-.14.14-.29.29-.12.56.17.28.74 1.22 1.59 1.97 1.1.97 2.02 1.27 2.31 1.41.28.14.45.12.61-.07.17-.19.71-.83.9-1.11.19-.28.38-.24.64-.14.26.1 1.66.78 1.95.93.28.14.47.21.54.33.07.12.07.69-.17 1.37z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2zm0 7.9A3.1 3.1 0 1 1 12 8.9a3.1 3.1 0 0 1 0 6.2z" />
      <circle cx="17.35" cy="6.75" r="1.15" />
      <path d="M16.5 2h-9A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2zm3.8 14.5a3.8 3.8 0 0 1-3.8 3.8h-9a3.8 3.8 0 0 1-3.8-3.8v-9a3.8 3.8 0 0 1 3.8-3.8h9a3.8 3.8 0 0 1 3.8 3.8v9z" />
    </svg>
  );
}

export async function Contacts({ locale }: { locale: AppLocale }) {
  const t = await getTranslations({ locale, namespace: "contacts" });

  return (
    <section id="kontakty" className="scroll-mt-24 bg-mahogany py-12 text-candle md:py-16">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <p className="text-center text-sm font-semibold uppercase tracking-[0.25em] text-leaf">
            {t("eyebrow")}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="mx-auto mt-4 max-w-2xl text-center font-display text-3xl italic sm:text-4xl md:text-5xl">
            {t("heading")}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-5 max-w-xl text-center text-base leading-relaxed text-candle/75 md:text-lg">
            {t("trialNote")}
          </p>
        </Reveal>

        <div className="mt-14 grid items-stretch gap-10 md:grid-cols-5 md:gap-12">
          <Reveal delay={160} className="md:col-span-2">
            <div className="flex h-full flex-col gap-8">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
                <div>
                  <p className="font-semibold">{t("addressLabel")}</p>
                  <p className="text-candle/75">{siteConfig.address[locale]}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 shrink-0 text-leaf" />
                <div>
                  <p className="font-semibold">{t("phoneLabel")}</p>
                  <a
                    href={siteConfig.phoneHref}
                    className="text-candle/75 transition-colors hover:text-leaf"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                  <p className="text-sm text-candle/60">{siteConfig.contactPerson}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href={siteConfig.vk}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("vkAria")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#0077FF] text-white transition-colors hover:bg-[#0066dd]"
                >
                  <VkIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("telegramAria")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#229ED9] text-white transition-colors hover:bg-[#1b8bc0]"
                >
                  <TelegramIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("whatsappAria")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white transition-colors hover:bg-[#1ebe57]"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                </a>
                <a
                  href={siteConfig.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("instagramAria")}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white transition-opacity hover:opacity-90"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={220} className="md:col-span-3">
            <div className="h-full min-h-[260px] overflow-hidden rounded-[8px] border border-candle/15 md:min-h-[320px]">
              <iframe
                src={siteConfig.yandexMapEmbedSrc}
                title={t("mapTitle")}
                className="h-full w-full min-h-[260px] md:min-h-[320px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
