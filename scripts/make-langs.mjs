// Пост-билд: раскладывает собранный index.html по языковым путям
// /kk, /ru, /en и делает корневой редирект на язык по умолчанию (kk).
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = resolve(__dirname, "../dist");
const langs = ["kk", "ru", "en"];
const defaultLang = "kk";

const base = process.env.SITE_BASE || "/";
const clean = base.replace(/\/$/, "");

const indexHtml = readFileSync(resolve(dist, "index.html"), "utf-8");

for (const l of langs) {
  const dir = resolve(dist, l);
  mkdirSync(dir, { recursive: true });
  const html = indexHtml.replace(/<html lang="[^"]*"/, `<html lang="${l}"`);
  writeFileSync(resolve(dir, "index.html"), html);
}

const redirect = `<!doctype html>
<html lang="${defaultLang}">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="refresh" content="0; url=${clean}/${defaultLang}/" />
    <link rel="canonical" href="${clean}/${defaultLang}/" />
    <script>location.replace("${clean}/${defaultLang}/" + location.search + location.hash);</script>
    <title>Wedding</title>
  </head>
  <body></body>
</html>`;
writeFileSync(resolve(dist, "index.html"), redirect);
writeFileSync(resolve(dist, "404.html"), redirect);

console.log("Language folders created:", langs.join(", "), "| base:", base);
