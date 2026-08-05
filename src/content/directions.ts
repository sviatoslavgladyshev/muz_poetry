import type { AppLocale } from "@/i18n/routing";

export type DirectionGroup = "instruments" | "vocal";

export type Direction = {
  id: string;
  group: DirectionGroup;
  title: string;
  image: string;
  description: string;
  result: string;
  forWhom: string;
};

export const directionGroups: DirectionGroup[] = ["instruments", "vocal"];

export const directions: Record<AppLocale, Direction[]> = {
  ru: [
    {
      id: "piano",
      group: "instruments",
      title: "Фортепиано",
      image: "/images/direction-piano.jpg",
      description:
        "Развивает интеллект и учит мыслить масштабно. Детям — мягкое погружение через игру, взрослым — шанс исполнить детскую мечту.",
      result: "От Баха и Моцарта до неоклассики Эйнауди и Циммера в вашем исполнении.",
      forWhom: "Дети 6–16 лет и взрослые любого уровня.",
    },
    {
      id: "guitar",
      group: "instruments",
      title: "Гитара",
      image: "/images/direction-guitar.jpg",
      description:
        "Самый душевный инструмент для любой компании. Без сухой теории: сразу постановка рук, переборы и первые аккорды.",
      result: "Через месяц — первые песни, дальше импровизация и подбор на слух.",
      forWhom: "Дети от 7 лет и взрослые любого уровня.",
    },
    {
      id: "ukulele",
      group: "instruments",
      title: "Укулеле",
      image: "/images/direction-ukulele.jpg",
      description:
        "Маленькая гавайская гитара, которая влюбляет с первого аккорда. Мягкие струны и небольшой размер — идеальный старт.",
      result: "Самый быстрый путь в музыку: базовые аккорды за пару занятий.",
      forWhom: "Дети от 5–6 лет и взрослые без ограничений.",
    },
    {
      id: "vocal-pop",
      group: "vocal",
      title: "Эстрадный вокал",
      image: "/images/direction-vocal-pop.jpg",
      description:
        "Пение — это свобода самовыражения. Снимаем зажимы, работаем с микрофоном и сценой в современных стилях: поп, рок, джаз, соул.",
      result: "Запись своей песни на студии и уверенные выступления на концертах.",
      forWhom: "Дети 6–16 лет и взрослые любого уровня.",
    },
    {
      id: "vocal-academic",
      group: "vocal",
      title: "Академический вокал",
      image: "/images/direction-vocal-academic.jpg",
      description:
        "Классика — фундамент, истинная поэзия звука. Ставим академическое дыхание, объёмное звучание и управление регистрами.",
      result: "Безупречная техника и сольные номера на вечерах классической музыки.",
      forWhom: "Дети 6–16 лет и взрослые любого уровня.",
    },
  ],
  tt: [
    {
      id: "piano",
      group: "instruments",
      title: "Фортепиано",
      image: "/images/direction-piano.jpg",
      description:
        "Интеллектны үстерә һәм киң масштабта уйларга өйрәтә. Балаларга — уен аша йомшак кереш, өлкәннәргә — балачак хыялын тормышка ашыру.",
      result: "Бахтан һәм Моцарттан алып Эйнауди белән Циммерга кадәр — сезнең башкаруда.",
      forWhom: "6–16 яшьлек балалар һәм теләсә нинди дәрәҗәдәге өлкәннәр.",
    },
    {
      id: "guitar",
      group: "instruments",
      title: "Гитара",
      image: "/images/direction-guitar.jpg",
      description:
        "Теләсә нинди компания өчен иң җанлы инструмент. Коры теориясез: кул кую, перебор һәм беренче аккордлар.",
      result: "Бер айдан — беренче җырлар, аннары импровизация һәм ишетеп табу.",
      forWhom: "7 яшьтән балалар һәм теләсә нинди дәрәҗәдәге өлкәннәр.",
    },
    {
      id: "ukulele",
      group: "instruments",
      title: "Укулеле",
      image: "/images/direction-ukulele.jpg",
      description:
        "Беренче аккордтан гашыйк итә торган кечкенә гавай гитарасы. Йомшак кыллар һәм кечкенә үлчәм — идеаль башлангыч.",
      result: "Музыкага иң тиз юл: бер-ике дәрестә нигез аккордлар.",
      forWhom: "5–6 яшьтән балалар һәм чикләүсез өлкәннәр.",
    },
    {
      id: "vocal-pop",
      group: "vocal",
      title: "Эстрада вокалы",
      image: "/images/direction-vocal-pop.jpg",
      description:
        "Җырлау — үзеңне белдерү иреге. Кысынкылыкларны алабыз, микрофон һәм сәхнә белән эшлибез: поп, рок, джаз, соул.",
      result: "Студиядә үз җырыңны язу һәм концертларда ышанычлы чыгышлар.",
      forWhom: "6–16 яшьлек балалар һәм теләсә нинди дәрәҗәдәге өлкәннәр.",
    },
    {
      id: "vocal-academic",
      group: "vocal",
      title: "Академик вокал",
      image: "/images/direction-vocal-academic.jpg",
      description:
        "Классика — нигез, чын тавыш поэзиясе. Академик сулыш, күләмле яңгыраш һәм регистрларны идарә итү.",
      result: "Камил техника һәм классик музыка кичәләрендә соло чыгышлар.",
      forWhom: "6–16 яшьлек балалар һәм теләсә нинди дәрәҗәдәге өлкәннәр.",
    },
  ],
};
