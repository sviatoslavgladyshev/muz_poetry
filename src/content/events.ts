export type EventType = "концерт" | "квартирник" | "лекция" | "кинопоказ";

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
  концерт: "/images/event-concert.svg",
  квартирник: "/images/event-kvartirnik.svg",
  лекция: "/images/event-lecture.svg",
  кинопоказ: "/images/event-cinema.svg",
};

export const events: StudioEvent[] = [
  {
    id: "evt-1",
    date: "2026-07-19",
    time: "18:00",
    title: "Лекция «Как Рахманинов слышал Казань»",
    type: "лекция",
    description:
      "Разбираем связь русской классики с городом и слушаем редкие записи за чашкой чая.",
    image: eventTypeImage["лекция"],
  },
  {
    id: "evt-2",
    date: "2026-07-26",
    time: "19:30",
    title: "Квартирник «Голоса июля»",
    type: "квартирник",
    description:
      "Тёплый вечер с учениками мастерской: живой звук, свечи и открытый микрофон.",
    image: eventTypeImage["квартирник"],
  },
  {
    id: "evt-3",
    date: "2026-08-02",
    time: "17:00",
    title: "Ламповый кинопоказ: «Амели»",
    type: "кинопоказ",
    description: "Смотрим культовый фильм под пледами и обсуждаем музыку Яна Тьерсена.",
    image: eventTypeImage["кинопоказ"],
  },
  {
    id: "evt-4",
    date: "2026-08-16",
    time: "18:30",
    title: "Отчётный концерт «Поэзия звука»",
    type: "концерт",
    description:
      "Ученики мастерской представляют программу семестра — от классики до эстрады.",
    image: eventTypeImage["концерт"],
  },
  {
    id: "evt-5",
    date: "2026-08-30",
    time: "18:00",
    title: "Лекция «Джаз и импровизация как язык свободы»",
    type: "лекция",
    description: "Слушаем джазовые стандарты и говорим о том, как рождается импровизация.",
    image: eventTypeImage["лекция"],
  },
  {
    id: "evt-6",
    date: "2026-09-13",
    time: "19:00",
    title: "Квартирник «Сентябрьские аккорды»",
    type: "квартирник",
    description: "Открытие нового сезона мастерской в кругу учеников, друзей и семьи.",
    image: eventTypeImage["квартирник"],
  },
];
