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
  whatsapp: "https://wa.me/79005387870",
  instagram: "https://www.instagram.com/muzpoetry_kzn",
  yandexMapEmbedSrc:
    "https://yandex.ru/map-widget/v1/?ll=49.111226%2C55.795250&z=16&text=Казань%2C%20улица%20Гоголя%2025&pt=49.111226,55.795250,pm2rdm",
} as const;

export const navLinks = [
  { href: "/#o-masterskoy", key: "about" },
  { href: "/#mastera", key: "teachers" },
  { href: "/#obuchenie", key: "directions" },
  { href: "/#klub", key: "club" },
  { href: "/pricing", key: "pricing" },
  { href: "/#afisha", key: "afisha" },
  { href: "/#kontakty", key: "contacts" },
] as const;

export const primaryNavLinks = [
  { href: "/#mastera", key: "teachers" },
  { href: "/#obuchenie", key: "directions" },
  { href: "/#klub", key: "club" },
  { href: "/#tseny", key: "pricing" },
  { href: "/#afisha", key: "afisha" },
] as const;

export const secondaryNavLinks = [
  { href: "/#o-masterskoy", key: "about" },
  { href: "/#kontakty", key: "contacts" },
] as const;
