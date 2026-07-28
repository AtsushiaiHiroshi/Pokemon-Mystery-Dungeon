import { access, readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const manifest = JSON.parse(await readFile(new URL("module.json", root), "utf8"));
const systemManifest = JSON.parse(await readFile(new URL("system.json", root), "utf8"));

if (manifest.id !== "pokemon-mystery-dungeon") {
  throw new Error("El id del manifiesto no coincide con el nombre del módulo.");
}

if (systemManifest.id !== "pokemon-mystery-dungeon") {
  throw new Error("El id del sistema Pokémon no coincide con el nombre del proyecto.");
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

if (systemManifest.relationships?.systems?.some(system => system.id === "dnd5e")) {
  throw new Error("El sistema Pokémon no debe depender de dnd5e.");
}

await Promise.all(files.map(file => access(new URL(file, root))));
await Promise.all([
  ...(systemManifest.esmodules ?? []),
  ...(systemManifest.styles ?? []),
  ...(systemManifest.languages ?? []).map(language => language.path),
  "templates/actor/pokemon-sheet.hbs",
  ...(systemManifest.packs ?? []).map(pack => pack.path)
].map(file => access(new URL(file, root))));

for (const file of manifest.esmodules ?? []) {
  const source = await readFile(new URL(file, root), "utf8");
  new vm.Script(source, { filename: file });
}

console.log(`Puente legacy válido: ${manifest.title} v${manifest.version}`);
console.log(`Sistema nativo válido: ${systemManifest.title} v${systemManifest.version}`);
console.log(`${files.length} archivos legacy y ${(systemManifest.packs ?? []).length} compendios nativos declarados encontrados.`);
