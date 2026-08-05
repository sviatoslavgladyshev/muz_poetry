import type { AppLocale } from "@/i18n/routing";

export type Teacher = {
  photo: string;
  name: string;
  alias?: string;
  role: string;
  credentials: string;
  superpower: string;
  route: string;
};

export type TeacherSlot = Teacher | { empty: true };

export const teachersIntro: Record<AppLocale, string> = {
  ru: "Наши мастера — не строгие судьи, а бережные наставники и практикующие артисты. Они умеют слушать, сопереживать и зажигать искренний огонь в душе.",
  tt: "Безнең остазларыбыз — каты хөкемдарлар түгел, ә сак наставникларыбыз һәм эшли торган артистлар. Алар тыңлый белә, хисдәшлек итә һәм җанда чын ялкын кабыза белә.",
};

export const teachers: Record<AppLocale, TeacherSlot[]> = {
  ru: [
    {
      photo: "/images/teacher-diana.svg",
      name: "Шарапова Диана",
      role: "Вокал и фортепиано",
      credentials:
        "Выпускница Училища искусств и художественных ремёсел им. В. В. Верещагина и Казанской государственной консерватории им. Н. Г. Жиганова.",
      superpower: "За одно занятие снимает страх петь в полный голос.",
      route: "джаз-клубы и лекции о кино",
    },
    { empty: true },
    { empty: true },
  ],
  tt: [
    {
      photo: "/images/teacher-diana.svg",
      name: "Шарапова Диана",
      role: "Вокал һәм фортепиано",
      credentials:
        "В. В. Верещагин исемендәге Сәнгать һәм һөнәрчелек училищесын һәм Н. Җиһанов исемендәге Казан дәүләт консерваториясен тәмамлаган.",
      superpower: "Бер дәрестә тулы тавыш белән җырлау куркуын бетерә.",
      route: "джаз-клублар һәм кино турында лекцияләр",
    },
    { empty: true },
    { empty: true },
  ],
};
