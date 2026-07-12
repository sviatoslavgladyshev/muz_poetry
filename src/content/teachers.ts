export type Teacher = {
  photo: string;
  name: string;
  alias?: string;
  role: string;
  credentials: string;
  superpower: string;
  quote: string;
  route: string;
};

export type TeacherSlot = Teacher | { empty: true; label: string };

export const teachersIntro =
  "Наши мастера — не строгие судьи, а бережные наставники и практикующие артисты. Они умеют слушать, сопереживать и зажигать искренний огонь в душе.";

export const teachers: TeacherSlot[] = [
  {
    photo: "/images/teacher-diana.svg",
    name: "Шарапова Диана",
    alias: "псевдоним для детей",
    role: "Мастер по вокалу, фортепиано и эмоциональной свободе",
    credentials:
      "Выпускница Училища искусств и художественных ремёсел им. В. В. Верещагина и Казанской государственной консерватории им. Н. Г. Жиганова.",
    superpower: "Умеет за одно занятие снять зажим «я стесняюсь петь громко».",
    quote:
      "Для меня вокал — это терапия. Я учу не просто попадать в ноты, а передавать голосом то, что невозможно сказать словами. На моих уроках можно и нужно смеяться, плакать и быть собой.",
    route: "уютные джаз-клубы и лекции о французском кино",
  },
  { empty: true, label: "Скоро — новый мастер мастерской" },
  { empty: true, label: "Скоро — новый мастер мастерской" },
];
