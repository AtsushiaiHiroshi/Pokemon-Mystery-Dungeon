import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const raw = file => fetch(`https://raw.githubusercontent.com/PokeAPI/pokeapi/master/data/v2/csv/${file}`).then(response => response.text());
const parse = csv => csv.trim().split(/\r?\n/).slice(1).map(line => line.split(","));
const [pokemonCSV, speciesNamesCSV, pokemonTypesCSV, typeNamesCSV, speciesCSV] = await Promise.all([
  raw("pokemon.csv"), raw("pokemon_species_names.csv"), raw("pokemon_types.csv"), raw("type_names.csv"), raw("pokemon_species.csv")
]);
const names = new Map(parse(speciesNamesCSV).filter(row => row[1] === "7").map(row => [row[0], row[2]]));
const typeNames = new Map(parse(typeNamesCSV).filter(row => row[1] === "7").map(row => [row[0], row[2]]));
const species = new Map(parse(speciesCSV).map(row => [row[0], {
  generation: Number(row[2] ?? 1),
  evolvesFrom: row[3] ? Number(row[3]) : null
}]));
// Los Ultraentes no forman parte de la selección inicial salvo Poipole.
// Las formas Paradoja tampoco se ofrecen: no pertenecen a una línea evolutiva.
const ultraBeasts = new Set([
  "nihilego", "buzzwole", "pheromosa", "xurkitree", "celesteela", "kartana",
  "guzzlord", "stakataka", "blacephalon", "poipole", "naganadel"
]);
const paradoxPokemon = new Set([
  "great-tusk", "scream-tail", "brute-bonnet", "flutter-mane", "slither-wing", "sandy-shocks", "roaring-moon",
  "iron-treads", "iron-bundle", "iron-hands", "iron-jugulis", "iron-moth", "iron-thorns",
  "walking-wake", "raging-bolt", "gouging-fire", "iron-leaves", "iron-crown", "iron-boulder"
]);
const typesByPokemon = new Map();
for (const row of parse(pokemonTypesCSV)) {
  const list = typesByPokemon.get(row[0]) ?? [];
  list[Number(row[2]) - 1] = typeNames.get(row[1]) ?? "normal";
  typesByPokemon.set(row[0], list.filter(Boolean));
}
const all = parse(pokemonCSV).filter(row => Number(row[0]) >= 1 && Number(row[0]) <= 1025)
  .map(row => ({
    id: Number(row[0]),
    name: names.get(row[0]) ?? row[1],
    identifier: row[1],
    types: typesByPokemon.get(row[0]) ?? ["normal"],
    generation: species.get(row[0])?.generation ?? 1,
    evolvesFrom: species.get(row[0])?.evolvesFrom ?? null,
    // La primera etapa puede tener evoluciones; lo que excluimos son las
    // especies que ya evolucionan desde otra. Pikachu es la excepción.
    quizEligible: !paradoxPokemon.has(row[1]) && (!ultraBeasts.has(row[1]) || row[1] === "poipole") && (species.get(row[0])?.evolvesFrom == null || row[1] === "pikachu"),
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${row[0]}.png`,
    source: "PokeAPI"
  }));
await mkdir(path.join(root, "data"), { recursive: true });
await writeFile(path.join(root, "data", "pokemon-all.json"), JSON.stringify(all, null, 2));
console.log(`Pokémon: ${all.length} especies base (generaciones 1–9).`);
