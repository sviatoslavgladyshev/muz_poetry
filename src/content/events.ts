import type { AppLocale } from "@/i18n/routing";

export type EventType = "concert" | "kvartirnik" | "lecture" | "cinema";

export type StudioEvent = {
  id: string;
  date: string; // ISO date
  time: string;
  title: string;
  type: EventType;
  description: string;
  image: string;
};

export const eventTypeImage: Record<EventType, string> = {
  concert: "/images/event-concert.svg",
  kvartirnik: "/images/event-kvartirnik.svg",
  lecture: "/images/event-lecture.svg",
  cinema: "/images/event-cinema.svg",
};

export const events: Record<AppLocale, StudioEvent[]> = {
  ru: [
    {
      id: "evt-1",
      date: "2026-07-19",
      time: "18:00",
      title: "Лекция «Как Рахманинов слышал Казань»",
      type: "lecture",
      description:
        "Разбираем связь русской классики с городом и слушаем редкие записи за чашкой чая.",
      image: eventTypeImage.lecture,
    },
    {
      id: "evt-2",
      date: "2026-07-26",
      time: "19:30",
      title: "Квартирник «Голоса июля»",
      type: "kvartirnik",
      description:
        "Тёплый вечер с учениками мастерской: живой звук, свечи и открытый микрофон.",
      image: eventTypeImage.kvartirnik,
    },
    {
      id: "evt-3",
      date: "2026-08-02",
      time: "17:00",
      title: "Ламповый кинопоказ: «Амели»",
      type: "cinema",
      description: "Смотрим культовый фильм под пледами и обсуждаем музыку Яна Тьерсена.",
      image: eventTypeImage.cinema,
    },
    {
      id: "evt-4",
      date: "2026-08-16",
      time: "18:30",
      title: "Отчётный концерт «Поэзия звука»",
      type: "concert",
      description:
        "Ученики мастерской представляют программу семестра — от классики до эстрады.",
      image: eventTypeImage.concert,
    },
    {
      id: "evt-5",
      date: "2026-08-30",
      time: "18:00",
      title: "Лекция «Джаз и импровизация как язык свободы»",
      type: "lecture",
      description: "Слушаем джазовые стандарты и говорим о том, как рождается импровизация.",
      image: eventTypeImage.lecture,
    },
    {
      id: "evt-6",
      date: "2026-09-13",
      time: "19:00",
      title: "Квартирник «Сентябрьские аккорды»",
      type: "kvartirnik",
      description: "Открытие нового сезона мастерской в кругу учеников, друзей и семьи.",
      image: eventTypeImage.kvartirnik,
    },
  ],
  tt: [
    {
      id: "evt-1",
      date: "2026-07-19",
      time: "18:00",
      title: "«Рахманинов Казанны ничек ишеткән» лекциясе",
      type: "lecture",
      description:
        "Рус классикасының шәһәр белән бәйләнешен өйрәнәбез һәм чәй янында сирәк язмалар тыңлыйбыз.",
      image: eventTypeImage.lecture,
    },
    {
      id: "evt-2",
      date: "2026-07-26",
      time: "19:30",
      title: "«Июль тавышлары» квартирнигы",
      type: "kvartirnik",
      description: "Остаханә укучылары белән җылы кич: тере тавыш, шәмнәр һәм ачык микрофон.",
      image: eventTypeImage.kvartirnik,
    },
    {
      id: "evt-3",
      date: "2026-08-02",
      time: "17:00",
      title: "Җылы кино күрсәтү: «Амели»",
      type: "cinema",
      description: "Пледлар астында культ фильмны карыйбыз һәм Ян Тьерсен музыкасын фикер алышабыз.",
      image: eventTypeImage.cinema,
    },
    {
      id: "evt-4",
      date: "2026-08-16",
      time: "18:30",
      title: "«Поэзия звука» хисап концерты",
      type: "concert",
      description: "Остаханә укучылары семестр программасын тәкъдим итә — классикадан алып эстрадага кадәр.",
      image: eventTypeImage.concert,
    },
    {
      id: "evt-5",
      date: "2026-08-30",
      time: "18:00",
      title: "«Джаз һәм ирек теле буларак импровизация» лекциясе",
      type: "lecture",
      description: "Джаз стандартларын тыңлыйбыз һәм импровизациянең ничек тууы турында сөйләшәбез.",
      image: eventTypeImage.lecture,
    },
    {
      id: "evt-6",
      date: "2026-09-13",
      time: "19:00",
      title: "«Сентябрь аккордлары» квартирнигы",
      type: "kvartirnik",
      description: "Укучылар, дуслар һәм гаилә даирәсендә остаханәнең яңа сезонын ачу.",
      image: eventTypeImage.kvartirnik,
    },
  ],
};

const monthNames: Record<AppLocale, string[]> = {
  ru: [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ],
  tt: [
    "гыйнварь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
  ],
};

export function formatEventDate(iso: string, locale: AppLocale): string {
  const date = new Date(`${iso}T00:00:00`);
  const day = date.getDate();
  const month = monthNames[locale][date.getMonth()];
  return `${day} ${month}`;
}
