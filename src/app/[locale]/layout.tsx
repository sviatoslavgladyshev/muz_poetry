import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Forum, Montserrat_Alternates } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { routing, type AppLocale } from "@/i18n/routing";
import "./globals.css";

const displayFont = Forum({
  variable: "--font-display",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: "400",
});

const bodyFont = Montserrat_Alternates({
  variable: "--font-body",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  weight: ["400", "500", "600", "700"],
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
    keywords: t("keywords")
      .split(",")
      .map((keyword) => keyword.trim())
      .filter(Boolean),
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
      <head>
        {/*
          Strip a leftover `#section` before the browser scrolls to it. In-page
          nav no longer writes hashes; this only cleans stale bookmarks/refreshes
          so `/ru/` opens at the hero again.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(!/\\/(ru|tt)\\/?$/.test(p))return;if(!location.hash)return;if(sessionStorage.getItem("mp-scroll-to-section"))return;history.replaceState(null,"",p+location.search);if("scrollRestoration" in history)history.scrollRestoration="manual";window.scrollTo(0,0);}catch(e){}})();`,
          }}
        />
      </head>
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
