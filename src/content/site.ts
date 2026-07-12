import type { AppLocale } from "@/i18n/routing";

export const siteConfig = {
  name: "«Поэзия звука»",
  domain: "muzpoetry.ru",
  phoneDisplay: "8 900 538 78 70",
  phoneHref: "tel:+79005387870",
  contactPerson: "Александра",
  address: {
    ru: "Казань, улица Гоголя, 25 (Вахитовский район)",
    tt: "Казан, Гоголь урамы, 25 (Вахитов районы)",
  } satisfies Record<AppLocale, string>,
  vk: "https://vk.ru/club240133150",
  telegram: "https://t.me/muzpoetry",
  instagram: "https://instagram.com/muzpoetry",
  whatsapp: "https://wa.me/79005387870",
  // Formspree-style placeholder — swap with a real endpoint before launch.
  trialFormEndpoint: "https://formspree.io/f/YOUR_FORM_ID",
  yandexMapEmbedSrc:
    "https://yandex.ru/map-widget/v1/?ll=49.111226%2C55.795250&z=16&text=Казань%2C%20улица%20Гоголя%2025&pt=49.111226,55.795250,pm2rdm",
} as const;

export const navLinks = [
  { href: "#o-masterskoy", key: "about" },
  { href: "#mastera", key: "teachers" },
  { href: "#obuchenie", key: "directions" },
  { href: "#klub", key: "club" },
  { href: "#tseny", key: "pricing" },
  { href: "#afisha", key: "afisha" },
  { href: "#kontakty", key: "contacts" },
] as const;
