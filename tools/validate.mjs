import { access, readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("module.json", root), "utf8"));

if (manifest.id !== "pokemon-mystery-dungeon") {
  throw new Error("El id del manifiesto no coincide con el nombre del módulo.");
}

if (!manifest.relationships?.systems?.some(system => system.id === "dnd5e")) {
  throw new Error("El manifiesto debe declarar su relación con dnd5e.");
}

const files = [
  ...(manifest.esmodules ?? []),
  ...(manifest.styles ?? []),
  ...(manifest.languages ?? []).map(language => language.path),
  manifest.license,
  manifest.readme
].filter(Boolean);

await Promise.all(files.map(file => access(new URL(file, root))));

for (const file of manifest.esmodules ?? []) {
  const source = await readFile(new URL(file, root), "utf8");
  new vm.Script(source, { filename: file });
}

console.log(`Módulo válido: ${manifest.title} v${manifest.version}`);
console.log(`${files.length} archivos declarados encontrados.`);
