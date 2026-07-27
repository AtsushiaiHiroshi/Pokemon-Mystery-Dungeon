import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const base = "https://nrosa01.github.io/pmd-quiz-online/lang/es/";
const files = ["natures-es.json", "questions-es.json", "naturetopokemon-es.json", "naturedescription-es.json"];
const data = {};
for (const file of files) data[file.replace("-es.json", "")] = await (await fetch(base + file)).json();
await mkdir(path.join(root, "data"), { recursive: true });
await writeFile(path.join(root, "data", "quiz-es.json"), JSON.stringify(data, null, 2));
console.log(`Quiz PMD: ${data.questions.length} preguntas y ${data.natures.length} naturalezas.`);
