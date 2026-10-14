import {
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync,
  renameSync,
  existsSync,
} from "node:fs";
import { join, basename } from "node:path";

// GitVerse Pages не отдаёт файлы из папок с подчёркиванием на старте
// (_next) и может резать «~» в именах файлов. Поэтому после экспорта:
//   1. «~» в именах файлов заменяем на «_»;
//   2. папку _next переименовываем в assets, _not-found — в not-found;
//   3. ссылки в текстах переписываем: /_next -> /assets.
// Пути оставляем абсолютными (/<репозиторий>/assets/...): рантайм
// Turbopack резолвит свой префикс догрузки чанков от URL СТРАНИЦЫ, а не
// от файла скрипта, поэтому относительные пути ломают гидрацию.
const root = "out";

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

// 1. Переименовываем файлы с «~» и запоминаем соответствие имён.
const renames = new Map();
for (const file of walk(root)) {
  const name = basename(file);
  if (name.includes("~")) {
    const newName = name.replaceAll("~", "_");
    renameSync(file, join(file.slice(0, file.length - name.length), newName));
    renames.set(name, newName);
  }
}

// 2. Переписываем ссылки во всех текстовых файлах экспорта.
let changed = 0;
for (const file of walk(root)) {
  if (!/\.(html|js|txt|css)$/.test(file)) continue;
  const src = readFileSync(file, "utf8");
  let next = src
    .split("/_next")
    .join("/assets")
    .split("/_not-found")
    .join("/not-found");
  for (const [oldName, newName] of renames) {
    next = next.split(oldName).join(newName);
  }
  if (next !== src) {
    writeFileSync(file, next);
    changed += 1;
  }
}

// 3. Переименовываем служебные папки с подчёркиванием на старте.
for (const [from, to] of [
  ["_next", "assets"],
  ["_not-found", "not-found"],
]) {
  const fromDir = join(root, from);
  if (existsSync(fromDir)) renameSync(fromDir, join(root, to));
}

console.log(
  `make-paths-relative: rewritten ${changed} files, renamed ${renames.size} files with ~`
);
