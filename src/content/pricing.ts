import type { AppLocale } from "@/i18n/routing";

export type PriceItem = {
  id: string;
  label: string;
  title: string;
  description?: string;
  price: string;
  unit?: string;
  badge?: string;
  featured?: boolean;
  details?: string[];
};

export type PricingSection = {
  id: string;
  title: string;
  description?: string;
  items: PriceItem[];
};

export type PricingStat = {
  value: string;
  label: string;
};

const childrenPricingSections: PricingSection[] = [
  {
    id: "start",
    title: "Разовый старт и знакомство",
    items: [
      {
        id: "trial",
        label: "1",
        title: "Пробное занятие",
        description: "Первое знакомство с мастером, атмосферой особняка и инструментом.",
        price: "0 ₽",
        unit: "30 минут",
        details: [
          "Бережно проверяем слух и голос.",
          "Составляем индивидуальный план развития таланта.",
        ],
      },
    ],
  },
  {
    id: "single",
    title: "Разовое занятие",
    items: [
      {
        id: "single-lesson",
        label: "2",
        title: "Музыкальная практика",
        description:
          "Гибкий формат для занятий в свободном графике: классическое обучение вокалу или игре на гитаре, укулеле и фортепиано.",
        price: "2 400 ₽",
        unit: "час",
        details: ["Без Культурного клуба."],
      },
    ],
  },
  {
    id: "individual",
    title: "Индивидуальные занятия",
    description: "Один на один с мастером.",
    items: [
      {
        id: "individual-4",
        label: "3",
        title: "Абонемент на 4 занятия",
        price: "7 200 ₽",
        unit: "1 месяц",
      },
      {
        id: "individual-8",
        label: "4",
        title: "Абонемент на 8 занятий",
        price: "12 800 ₽",
        unit: "1 месяц",
        badge: "Экономия 800 ₽ с каждого часа",
        featured: true,
      },
    ],
  },
  {
    id: "groups",
    title: "Занятия в группах",
    items: [
      {
        id: "group-4",
        label: "5",
        title: "Абонемент на 4 занятия",
        price: "4 000 ₽",
        unit: "1 месяц",
      },
      {
        id: "group-8",
        label: "6",
        title: "Абонемент на 8 занятий",
        price: "7 200 ₽",
        unit: "1 месяц",
        badge: "900 ₽ за 1 час",
        featured: true,
      },
    ],
  },
  {
    id: "club-1-month",
    title: "Клубные карты на 1 месяц «Культурный старт»",
    description:
      "Максимально выгодный абонемент под ключ: уроки музыки + 4 недели Культурного клуба по 8 часов в месяц. Ребенка ждут уютные просмотры фильмов, викторины, музыкальные квизы, настольные игры, интерактивные лекции, мастер-классы и живое общение со сверстниками.",
    items: [
      {
        id: "club-month-group-4",
        label: "7",
        title: "Пакет «Группа + Клуб»",
        description: "4 групповых занятия музыкой + 4 встречи Клуба.",
        price: "8 200 ₽",
        unit: "месяц",
      },
      {
        id: "club-month-group-8",
        label: "8",
        title: "Пакет «Группа + Клуб»",
        description: "8 уроков музыки + 4 встречи Клуба.",
        price: "11 400 ₽",
        unit: "месяц",
        badge: "525 ₽ за час в клубе",
      },
      {
        id: "club-month-individual-4",
        label: "9",
        title: "Пакет «Индивидуально + Клуб»",
        description: "4 индивидуальных урока музыки + 4 встречи Клуба.",
        price: "11 400 ₽",
        unit: "месяц",
        details: [
          "Премиальные индивидуальные уроки + 8 часов насыщенной культурной программы.",
          "Полноценное развитие кругозора под ключ.",
        ],
      },
      {
        id: "club-month-individual-8",
        label: "10",
        title: "Пакет «Индивидуально + Клуб»",
        description: "8 уроков музыки + 4 встречи Клуба.",
        price: "16 280 ₽",
        unit: "месяц",
        badge: "Хит продаж",
        featured: true,
        details: [
          "Музыка стоит 12 800 ₽, а Клуб обходится всего в 3 480 ₽ за месяц.",
          "Супер-цена: 435 ₽ за час в клубе.",
        ],
      },
    ],
  },
  {
    id: "club-3-months",
    title: "Клубные карты на 3 месяца «Погружение в искусство»",
    description:
      "Программа для будущих резидентов. Покупая этот пакет, вы экономите более 6 000 рублей по сравнению с помесячной оплатой. В стоимость уже включены все материалы для мастер-классов, угощения и гарантированное сольное выступление на сцене нашего особняка.",
    items: [
      {
        id: "club-quarter-group-12",
        label: "11",
        title: "Пакет «Группа + Клуб»",
        description: "12 уроков музыки + 12 встреч Клуба за курс.",
        price: "22 900 ₽",
        unit: "3 месяца",
      },
      {
        id: "club-quarter-group-24",
        label: "12",
        title: "Пакет «Группа + Клуб»",
        description: "24 урока музыки + 12 встреч Клуба за курс.",
        price: "32 490 ₽",
        unit: "3 месяца",
      },
      {
        id: "club-quarter-individual-12",
        label: "13",
        title: "Пакет «Индивидуально + Клуб»",
        description: "12 уроков музыки + 12 встреч Клуба за курс.",
        price: "32 490 ₽",
        unit: "3 месяца",
      },
      {
        id: "club-quarter-individual-24",
        label: "14",
        title: "Пакет «Индивидуально + Клуб»",
        description: "24 урока музыки + 12 встреч Клуба за курс.",
        price: "46 000 ₽",
        unit: "3 месяца",
        featured: true,
      },
    ],
  },
];

export const pricingSections: Record<AppLocale, PricingSection[]> = {
  ru: childrenPricingSections,
  tt: childrenPricingSections,
};

export const pricingPreviewItemIds = [
  "trial",
  "individual-8",
  "club-month-individual-8",
] as const;

export const pricingStats: Record<AppLocale, PricingStat[]> = {
  ru: [
    { value: "0 ₽", label: "пробное занятие" },
    { value: "900 ₽", label: "час в группе при абонементе" },
    { value: "435 ₽", label: "час в клубе в хитовом пакете" },
  ],
  tt: [
    { value: "0 ₽", label: "сынау дәресе" },
    { value: "900 ₽", label: "абонемент белән төркемдә бер сәгать" },
    { value: "435 ₽", label: "популяр пакетта клуб сәгате" },
  ],
};

export function getPricingItem(id: string, locale: AppLocale) {
  return pricingSections[locale].flatMap((section) => section.items).find((item) => item.id === id);
}
