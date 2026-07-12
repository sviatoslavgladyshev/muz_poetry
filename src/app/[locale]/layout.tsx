import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { routing, type AppLocale } from "@/i18n/routing";
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL("https://muzpoetry.ru"),
    title: t("title"),
    description: t("description"),
    keywords: [
      "вокал Казань",
      "музыкальная школа Казань",
      "уроки вокала",
      "уроки фортепиано",
      "уроки гитары",
      "поэзия звука",
    ],
    openGraph: {
      title: t("title"),
      description: t("description"),
      locale: locale === "tt" ? "tt_RU" : "ru_RU",
      type: "website",
    },
    alternates: {
      languages: { ru: "/ru/", tt: "/tt/" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-body">
        <NextIntlClientProvider>
          <Header locale={locale as AppLocale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale as AppLocale} />
          <Toaster position="bottom-right" richColors />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
