import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { resolve, basename } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const sourceRoot = fileURLToPath(new URL("../..", import.meta.url));
const appRoot = resolve(sourceRoot, "jambu");
process.chdir(appRoot);
const text = await readFile(resolve(sourceRoot, "UI/dummy-meals.md"), "utf8");
const block = text.match(/```json\s*([\s\S]*?)```/);
if (!block)
  throw new Error("O documento não contém a coleção JSON de refeições.");
const meals = JSON.parse(block[1]);
if (
  !Array.isArray(meals) ||
  new Set(meals.map((m) => m.id)).size !== meals.length
)
  throw new Error("Refeições inválidas ou duplicadas.");
await mkdir("src/mobile/data", { recursive: true });
await mkdir("assets/mobile-fixtures", { recursive: true });
await writeFile(
  "src/mobile/data/meals.json",
  JSON.stringify(meals, null, 2) + "\n",
);
const urls = [
  ...new Set(
    meals.flatMap((m) => [
      m.user.avatarUrl,
      ...m.dishes.map((d) => d.imageUrl),
      ...m.comments.map((c) => c.avatarUrl),
    ]),
  ),
];
const old = JSON.parse(await readFile("assets/mock/manifest.json", "utf8"));
const entries = [];
for (let i = 0; i < urls.length; i += 4) {
  await Promise.all(
    urls.slice(i, i + 4).map(async (url) => {
      if (old.some((item) => item.url === url)) return;
      const file =
        createHash("sha256").update(url).digest("hex").slice(0, 12) + ".jpg";
      const target = resolve("assets/mobile-fixtures", file);
      if (url.startsWith("assets/dishes/")) {
        await copyFile(
          resolve(appRoot, "assets/mock", basename(url)),
          target,
        );
        entries.push({ url, file, origin: `assets/mock/${basename(url)}` });
        return;
      }
      try {
        const response = await fetch(url, {
          signal: AbortSignal.timeout(20000),
        });
        if (!response.ok) throw new Error(String(response.status));
        await writeFile(target, new Uint8Array(await response.arrayBuffer()));
        entries.push({ url, file, origin: url });
      } catch {
        process.stderr.write(
          `Foto remota usará carregamento em tempo de execução: ${url}\n`,
        );
      }
    }),
  );
}
entries.sort((a, b) => a.url.localeCompare(b.url));
await writeFile(
  "assets/mobile-fixtures/manifest.json",
  JSON.stringify(entries, null, 2) + "\n",
);
await writeFile(
  "src/mobile/data/pictures.ts",
  "import { pictures as existingPictures } from '@/data/pictures';\nimport type { ImageSource } from 'expo-image';\nexport const pictures: Record<string, ImageSource> = {\n  ...existingPictures,\n" +
    entries
      .map(
        (e) =>
          `  ${JSON.stringify(e.url)}: require('../../../assets/mobile-fixtures/${e.file}'),`,
      )
      .join("\n") +
    "\n};\n",
);
process.stdout.write(
  `${meals.length} refeições, ${meals.reduce((n, m) => n + m.dishes.length, 0)} pratos, ${entries.length} fotos adicionais locais.\n`,
);
