import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { adaptQuizToLatam } from "./quiz-latam.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = "https://nrosa01.github.io/pmd-quiz-online/lang/es/";
const files = ["natures-es.json", "questions-es.json", "naturetopokemon-es.json", "naturedescription-es.json"];
const data = {};
for (const file of files) data[file.replace("-es.json", "")] = await (await fetch(base + file)).json();
adaptQuizToLatam(data);
// Meowth es una opción inicial de Pokémon Mundo Misterioso; se incorpora a
// las recomendaciones de la naturaleza Activa sin eliminar las del quiz base.
data.naturetopokemon.Activa = [...new Set([...(data.naturetopokemon.Activa ?? []), "Meowth"])]
data.naturetopokemon.Miedosa = [...new Set([...(data.naturetopokemon.Miedosa ?? []), "Tepig"])]
data.naturetopokemon.Audaz = [...new Set([...(data.naturetopokemon.Audaz ?? []), "Kubfu"])]
try {
  const starterTables = JSON.parse(await readFile(path.join(root, "data", "wikidex-starters.json"), "utf8"));
  data.pmdStarters = [...new Set(Object.values(starterTables).flat().map(entry => entry.name))];
} catch {
  data.pmdStarters = [];
}
data.initialPokemon = [...new Set(Object.values(data.naturetopokemon).flat())];
await mkdir(path.join(root, "data"), { recursive: true });
await writeFile(path.join(root, "data", "quiz-es.json"), JSON.stringify(data, null, 2));
console.log(`Quiz PMD: ${data.questions.length} preguntas y ${data.natures.length} naturalezas.`);
