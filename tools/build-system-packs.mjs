import { createRequire } from "node:module";
import { mkdir, readFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("C:/Program Files/Foundry Virtual Tabletop/resources/app/package.json");
const { ClassicLevel } = require("classic-level");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SYSTEM_ID = "pokemon-mystery-dungeon";

const slug = value => String(value ?? "")
  .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/gi, "").toLowerCase();
const documentId = (prefix, index) => `${prefix}${String(index).padStart(6, "0")}`.slice(0, 16).padEnd(16, "0");

function moveDocument(record, index) {
  const category = /estado|status/i.test(record.category ?? "") ? "status" : /especial|special/i.test(record.category ?? "") ? "special" : "physical";
  return {
    _id: documentId("move", index),
    name: record.name,
    type: "move",
    img: record.img || "icons/svg/explosion.svg",
    system: {
      kind: "move",
      type: record.type || "normal",
      category,
      power: record.power,
      accuracy: record.accuracy,
      pp: { value: record.pp ?? 5, max: record.pp ?? 5 },
      priority: record.priority ?? 0,
      selfDamage: Boolean(record.selfDamage),
      generation: record.generation ?? null,
      englishName: record.englishName || "",
      description: record.description || "",
      source: record.source || "WikiDex — Lista de movimientos"
    },
    effects: [],
    ownership: { default: 0 },
    flags: { [SYSTEM_ID]: { source: "wikidex", ha: true } }
  };
}

function abilityDocument(record, index) {
  return {
    _id: documentId("ability", index),
    name: record.nameHA || record.nameES,
    type: "ability",
    img: "icons/magic/nature/leaf-glow-green.webp",
    system: {
      kind: "ability",
      nameES: record.nameES || record.nameHA,
      nameHA: record.nameHA || record.nameES,
      englishName: record.englishName || "",
      generation: record.generation ?? null,
      description: record.description || "",
      source: record.source || "WikiDex — Lista de habilidades"
    },
    effects: [],
    ownership: { default: 0 },
    flags: { [SYSTEM_ID]: { source: "wikidex", locale: "HA" } }
  };
}

function isCaptureDevice(record) {
  const text = `${record.name ?? ""} ${record.englishName ?? ""}`
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  return /poke ?ball|pokeball|pokebola|ultraball|superball|safariball|rapidball|nivelball|turnoball|peso ?ball|amorball|lujo ?ball|curaciónball|oscuraball|sana ?ball|malla ?ball|alivio ?ball|cebo ?ball|moon ?ball|friend ?ball|dream ?ball|master ?ball/.test(text);
}

function itemDocument(record, index) {
  return {
    _id: documentId("item", index),
    name: record.name,
    type: "item",
    img: record.img || "icons/svg/loot.svg",
    system: {
      kind: "dungeon-item",
      englishName: record.englishName || "",
      pricePoke: Number(String(record.price ?? "").replace(/[^0-9]/g, "")) || 0,
      locations: record.locations || "",
      affects: record.affects || "",
      description: record.description || "",
      source: record.source || "WikiDex — Lista de objetos de Pokémon Mundo misterioso"
    },
    effects: [],
    ownership: { default: 0 },
    flags: { [SYSTEM_ID]: { source: "wikidex", currency: "poke" } }
  };
}

function pokemonActor(record, index, abilityByKey) {
  const baseStats = record.baseStats || { hp: 1, attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 };
  const types = record.types || ["normal"];
  const abilities = (record.abilities || []).map(ability => {
    const rawName = typeof ability === "string" ? ability : ability.name || ability.identifier || "";
    const source = abilityByKey.get(slug(rawName));
    return {
      name: source?.nameHA || rawName,
      englishName: source?.englishName || "",
      hidden: Boolean(ability.hidden),
      generation: source?.generation ?? null
    };
  });
  return {
    _id: documentId("pokemon", index),
    name: record.name,
    type: "pokemon",
    img: record.sprite || "icons/svg/wingfoot.svg",
    system: {
      kind: "pokemon",
      speciesId: record.id,
      speciesName: record.name,
      generation: record.generation ?? null,
      types: { primary: types[0] || "normal", secondary: types[1] || "" },
      level: 1,
      experience: 0,
      natureName: "",
      natureMultipliers: {},
      baseStats,
      ivs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
      evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
      combat: { accuracyStage: 0, evasionStage: 0, priority: 0, statStages: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 } },
      resources: { hp: { value: 1, max: 1 }, pp: { value: 10, max: 10 }, hunger: { value: 100, max: 100 }, friendship: { value: 70, max: 255 } },
      ability: abilities[0]?.name || "",
      abilities,
      exhaustion: 0,
      currency: { poke: 0 },
      notes: ""
    },
    items: [],
    effects: [],
    ownership: { default: 0 },
    flags: { [SYSTEM_ID]: { source: record.source || "PokeAPI", species: record.name } }
  };
}

async function writePack(name, type, documents) {
  const target = path.join(ROOT, "packs", name);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  const db = new ClassicLevel(target, { valueEncoding: "utf8" });
  await db.open();
  const prefix = type === "Item" ? "!items!" : "!actors!";
  await db.batch(documents.map(document => ({ type: "put", key: `${prefix}${document._id}`, value: JSON.stringify(document) })));
  await db.compactRange("", "\uffff");
  await db.close();
  console.log(`${name}: ${documents.length} documentos nativos`);
}

const moves = JSON.parse(await readFile(path.join(ROOT, "data", "wikidex-moves.json"), "utf8"));
const abilities = JSON.parse(await readFile(path.join(ROOT, "data", "wikidex-abilities.json"), "utf8"));
const rawItems = JSON.parse(await readFile(path.join(ROOT, "data", "wikidex-items.json"), "utf8"));
const pokemon = JSON.parse(await readFile(path.join(ROOT, "data", "pokemon-all.json"), "utf8"));
const adventureItems = rawItems.filter(record => !isCaptureDevice(record));
const abilityByKey = new Map();
for (const ability of abilities) {
  for (const key of [ability.nameES, ability.nameHA, ability.englishName]) {
    if (key) abilityByKey.set(slug(key), ability);
  }
}

await writePack("pmd-native-moves-v1", "Item", moves.map(moveDocument));
await writePack("pmd-native-abilities-v1", "Item", abilities.map(abilityDocument));
await writePack("pmd-native-items-v1", "Item", adventureItems.map(itemDocument));
await writePack("pmd-native-pokemon-v1", "Actor", pokemon.map((record, index) => pokemonActor(record, index, abilityByKey)));
console.log(`Objetos de captura excluidos: ${rawItems.length - adventureItems.length}`);
