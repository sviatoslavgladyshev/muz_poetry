import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const bodyFont = Manrope({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://muzpoetry.ru"),
  title: "«Поэзия звука» — вокально-акустическая мастерская в Казани",
  description:
    "Вокально-акустическая мастерская «Поэзия звука»: фортепиано, гитара, укулеле, эстрадный и академический вокал для детей от 6 лет и взрослых в Казани. Музыка как способ мыслить, звук как способ чувствовать.",
  keywords: [
    "вокал Казань",
    "музыкальная школа Казань",
    "уроки вокала",
    "уроки фортепиано",
    "уроки гитары",
    "поэзия звука",
  ],
  openGraph: {
    title: "«Поэзия звука» — вокально-акустическая мастерская в Казани",
    description:
      "Пространство музыки, культуры и искусства для детей от 6 лет и взрослых.",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
