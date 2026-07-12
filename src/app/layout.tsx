import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "«Поэзия звука»",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const target = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/ru/`;

  return (
    <html lang="ru">
      <head>
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=${target}`} />
        </noscript>
      </head>
      <body>
        {children}
        <noscript>
          <a href={target}>Поэзия звука — русская версия сайта</a>
        </noscript>
      </body>
    </html>
  );
}
