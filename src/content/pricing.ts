import type { AppLocale } from "@/i18n/routing";

export type PriceItem = {
  id: string;
  label: string;
  title: string;
  benefit: string;
  benefitLabel?: string;
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
        benefit: "0 ₽, чтобы понять маршрут",
        benefitLabel: "без риска",
        description: "Первое знакомство с мастером, атмосферой особняка и инструментом.",
        price: "0 ₽",
        unit: "30 минут",
        badge: "Старт без оплаты",
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
        benefit: "Свобода без абонемента",
        benefitLabel: "разовый формат",
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
    title: "Индивидуальные абонементы",
    description:
      "Самый личный формат: мастер ведет ребенка один на один, слышит нюансы и быстрее раскрывает сильные стороны.",
    items: [
      {
        id: "individual-4",
        label: "3",
        title: "Абонемент на 4 занятия",
        benefit: "Личный маршрут на месяц",
        benefitLabel: "индивидуальный прогресс",
        price: "7 200 ₽",
        unit: "1 месяц",
        badge: "1 800 ₽ за урок",
        details: ["4 встречи один на один: удобно для мягкого старта и стабильной практики."],
      },
      {
        id: "individual-8",
        label: "4",
        title: "Абонемент на 8 занятий",
        benefit: "Экономия 6 400 ₽",
        benefitLabel: "самый сильный музыкальный ритм",
        price: "12 800 ₽",
        unit: "1 месяц",
        badge: "Яркий абонемент",
        featured: true,
        details: [
          "8 индивидуальных часов вместо 19 200 ₽ при разовой оплате.",
          "2 занятия в неделю: ребенок быстрее закрепляет навык и увереннее звучит.",
        ],
      },
    ],
  },
  {
    id: "groups",
    title: "Групповые абонементы",
    description:
      "Больше энергии и общения за меньшую стоимость часа: ребенок учится слышать себя и других.",
    items: [
      {
        id: "group-4",
        label: "5",
        title: "Абонемент на 4 занятия",
        benefit: "1 000 ₽ за час в группе",
        benefitLabel: "выгодный вход",
        price: "4 000 ₽",
        unit: "1 месяц",
        details: ["Живой формат с другими детьми: музыка, общение и регулярность."],
      },
      {
        id: "group-8",
        label: "6",
        title: "Абонемент на 8 занятий",
        benefit: "900 ₽ за час в группе",
        benefitLabel: "самая доступная регулярность",
        price: "7 200 ₽",
        unit: "1 месяц",
        badge: "Выгодно",
        featured: true,
        details: ["8 занятий дают ребенку ритм, командность и заметный рост за месяц."],
      },
    ],
  },
  {
    id: "club-1-month",
    title: "Клубные карты на 1 месяц «Культурный старт»",
    description:
      "Самые продающие абонементы под ключ: уроки музыки + 4 недели Культурного клуба по 8 часов в месяц. Ребенка ждут уютные просмотры фильмов, викторины, музыкальные квизы, настольные игры, интерактивные лекции, мастер-классы и живое общение со сверстниками.",
    items: [
      {
        id: "club-month-group-4",
        label: "7",
        title: "Пакет «Группа + Клуб»",
        benefit: "Музыка + 8 часов клуба",
        benefitLabel: "месяц под ключ",
        description: "4 групповых занятия музыкой + 4 встречи Клуба.",
        price: "8 200 ₽",
        unit: "месяц",
        details: ["Уроки, фильмы, квизы, лекции и живое общение в одном абонементе."],
      },
      {
        id: "club-month-group-8",
        label: "8",
        title: "Пакет «Группа + Клуб»",
        benefit: "Клуб по 525 ₽ за час",
        benefitLabel: "больше музыки и общения",
        description: "8 уроков музыки + 4 встречи Клуба.",
        price: "11 400 ₽",
        unit: "месяц",
        badge: "Сильная выгода",
      },
      {
        id: "club-month-individual-4",
        label: "9",
        title: "Пакет «Индивидуально + Клуб»",
        benefit: "Премиум-уроки + клуб",
        benefitLabel: "кругозор под ключ",
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
        benefit: "Клуб всего 435 ₽/час",
        benefitLabel: "максимум пользы за месяц",
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
        benefit: "3 месяца без доплат",
        benefitLabel: "готовый курс",
        description: "12 уроков музыки + 12 встреч Клуба за курс.",
        price: "22 900 ₽",
        unit: "3 месяца",
        details: ["Материалы, угощения и клубная программа уже включены."],
      },
      {
        id: "club-quarter-group-24",
        label: "12",
        title: "Пакет «Группа + Клуб»",
        benefit: "24 урока + 12 клубов",
        benefitLabel: "плотное погружение",
        description: "24 урока музыки + 12 встреч Клуба за курс.",
        price: "32 490 ₽",
        unit: "3 месяца",
        badge: "Экономия курса",
      },
      {
        id: "club-quarter-individual-12",
        label: "13",
        title: "Пакет «Индивидуально + Клуб»",
        benefit: "Личный рост + сцена",
        benefitLabel: "для будущих резидентов",
        description: "12 уроков музыки + 12 встреч Клуба за курс.",
        price: "32 490 ₽",
        unit: "3 месяца",
        details: ["В курс включено гарантированное сольное выступление на сцене особняка."],
      },
      {
        id: "club-quarter-individual-24",
        label: "14",
        title: "Пакет «Индивидуально + Клуб»",
        benefit: "Экономия больше 6 000 ₽",
        benefitLabel: "самое полное погружение",
        description: "24 урока музыки + 12 встреч Клуба за курс.",
        price: "46 000 ₽",
        unit: "3 месяца",
        badge: "Максимум",
        featured: true,
        details: [
          "24 индивидуальных урока, 12 встреч Клуба, материалы, угощения и сцена включены.",
        ],
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
