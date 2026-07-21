import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const port = Number.parseInt(process.env.PORT ?? "3000", 10);
const hostname = process.env.HOST ?? "0.0.0.0";
const basePath = process.env.BASE_PATH ?? "/muz_poetry";
const outDir = path.resolve("out");

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".woff2", "font/woff2"],
]);

function sendText(response, statusCode, message) {
  response.writeHead(statusCode, { "content-type": "text/plain; charset=utf-8" });
  response.end(message);
}

function resolveFilePath(urlPath) {
  const decodedPath = decodeURIComponent(urlPath);
  const normalizedPath = path.normalize(decodedPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(outDir, normalizedPath);

  if (!filePath.startsWith(outDir)) {
    return null;
  }

  return filePath;
}

async function findStaticFile(filePath) {
  try {
    const stats = await stat(filePath);
    return stats.isDirectory() ? path.join(filePath, "index.html") : filePath;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);

  if (url.pathname === "/" || url.pathname === basePath) {
    response.writeHead(302, { location: `${basePath}/` });
    response.end();
    return;
  }

  if (!url.pathname.startsWith(`${basePath}/`)) {
    sendText(response, 404, `Not found. This export is mounted at ${basePath}/`);
    return;
  }

  const filePath = resolveFilePath(url.pathname.slice(basePath.length));
  const staticFile = filePath ? await findStaticFile(filePath) : null;

  if (!staticFile) {
    sendText(response, 404, "Not found");
    return;
  }

  try {
    const stats = await stat(staticFile);
    const contentType = contentTypes.get(path.extname(staticFile)) ?? "application/octet-stream";

    response.writeHead(200, {
      "content-length": stats.size,
      "content-type": contentType,
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(staticFile).pipe(response);
  } catch {
    sendText(response, 404, "Not found");
  }
});

server.listen(port, hostname, () => {
  console.log(`Serving static export at http://localhost:${port}${basePath}/`);
});
