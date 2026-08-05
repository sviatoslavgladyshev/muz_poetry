const target = "/ru/";

/*
  Static export can't issue a real 3xx, so the entry page is a tiny HTML document
  that forwards to the default locale — with a meta refresh so it also works
  without JavaScript.
*/
export default function RootRedirect() {
  return (
    <html lang="ru">
      <head>
        <meta httpEquiv="refresh" content={`0; url=${target}`} />
      </head>
      <body>
        <a href={target}>Поэзия звука — русская версия сайта</a>
      </body>
    </html>
  );
}
