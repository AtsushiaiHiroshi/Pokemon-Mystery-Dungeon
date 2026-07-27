import { createRequire } from "node:module";
import { mkdir, rm, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire("C:/Program Files/Foundry Virtual Tabletop/resources/app/package.json");
const { ClassicLevel } = require("classic-level");
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MODULE_ID = "pokemon-mystery-dungeon";
const WIKIDEX_ITEM_FALLBACK = "https://images.wikidexcdn.net/mwuploads/wikidex/8/85/latest/20101008185348/Esfera_MM.png";
const TYPE_KEYS = {
  normal: "normal", fuego: "fire", fire: "fire", agua: "water", water: "water", planta: "grass", grass: "grass",
  eléctrico: "electric", electrico: "electric", electric: "electric", hielo: "ice", ice: "ice", lucha: "fighting", fighting: "fighting",
  veneno: "poison", poison: "poison", tierra: "ground", ground: "ground", volador: "flying", flying: "flying", psíquico: "psychic", psiquico: "psychic", psychic: "psychic",
  bicho: "bug", bug: "bug", roca: "rock", rock: "rock", fantasma: "ghost", ghost: "ghost", dragón: "dragon", dragon: "dragon", siniestro: "dark", dark: "dark", acero: "steel", steel: "steel", hada: "fairy", fairy: "fairy"
};
const typeKey = value => TYPE_KEYS[String(value ?? "normal").toLowerCase()] ?? "normal";

const id = value => value.padEnd(16, "0").slice(0, 16);
const activity = ({ key, name, damage = "1d6", damageType = "bludgeoning", range = 5, healing = null }) => ({
  _id: id(key),
  type: healing ? "heal" : "attack",
  name,
  img: null,
  sort: 0,
  activation: { type: "action", value: null, condition: "", override: false },
  consumption: { scaling: { allowed: false }, spellSlot: false, targets: [] },
  description: { chatFlavor: "" },
  duration: { value: null, units: "inst", special: "", concentration: false, override: false },
  effects: [],
  flags: {},
  range: { value: range, units: "ft", special: "", override: true },
  target: {
    template: { count: "", contiguous: false, type: "", size: "", width: "", height: "", units: "ft" },
    affects: { count: "1", type: healing ? "ally" : "creature", choice: false, special: "" },
    prompt: true,
    override: true
  },
  uses: { spent: 0, recovery: [] },
  visibility: {
    level: {},
    requireAttunement: false,
    requireIdentification: false,
    requireMagic: false
  },
  ...(healing
    ? { healing: { number: 1, denomination: Number(healing.replace(/\D/g, "")) || 6, bonus: "", types: ["healing"], custom: { enabled: true, formula: healing } } }
    : {
        attack: { ability: "", bonus: "", critical: { threshold: null }, flat: false, type: { value: range > 5 ? "ranged" : "melee", classification: "weapon" } },
        damage: {
          critical: { bonus: "" },
          includeBase: false,
          parts: [{ number: 1, denomination: Number(damage.replace(/\D/g, "")) || 6, bonus: "", types: [damageType], custom: { enabled: true, formula: damage }, scaling: { mode: "", number: 1, formula: "" } }]
        }
      })
});

function move({ key, name, type, category, pp, damage, damageType, range = 5, text, generation = 0, power = null, accuracy = null, priority = 0, selfDamage = false, img = null }) {
  const aid = `${key}Act`;
  const normalizedCategory = /estado|status/i.test(category) ? "status" : /especial|special/i.test(category) ? "special" : "physical";
  const isStatus = normalizedCategory === "status";
  return {
    _id: id(key),
    name,
    type: "feat",
    img: img ?? "icons/svg/explosion.svg",
    system: {
      description: {
        value: `<h2>${name}</h2><p><strong>Tipo:</strong> ${type} · <strong>Categoría:</strong> ${category} · <strong>PP:</strong> ${pp}</p><p>${text}</p><p><strong>Generación:</strong> ${generation || "—"} · <strong>Potencia Pokémon:</strong> ${power ?? "—"} · <strong>Precisión:</strong> ${accuracy ?? "—"}% · <strong>Prioridad:</strong> ${priority}</p>${selfDamage ? "<p><strong>Daño al usuario:</strong> Sí; revisa el efecto de retroceso al usarlo.</p>" : ""}<p>La actividad incluida usa el ataque y bonificador de competencia de D&amp;D 5e. El GM puede cambiar daño, alcance y salvación desde la pestaña Actividades.</p>`,
        chat: ""
      },
      source: { custom: "Adaptación PMD para D&D 5e" },
      activation: { type: "action", cost: 1, condition: "" },
      uses: { spent: 0, max: String(pp), recovery: [{ period: "lr", type: "recoverAll" }] },
      activities: isStatus ? {} : { [id(aid)]: activity({ key: aid, name, damage, damageType, range }) }
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: {
      [MODULE_ID]: {
        starter: true,
        move: {
          kind: "move",
          type: typeKey(type),
          category: normalizedCategory,
          pp: { value: pp, max: pp },
          stabEligible: true,
          source: { document: "WikiDex — Lista de movimientos", page: "" },
          power,
          accuracy,
          priority,
          selfDamage,
          generation
        }
      }
    }
  };
}

const moves = [
  move({ key: "pmdTackle", name: "Placaje", type: "Normal", category: "Físico", pp: 10, damage: "1d6", damageType: "bludgeoning", text: "Golpe corporal básico contra una criatura adyacente." }),
  move({ key: "pmdQuickAttack", name: "Ataque Rápido", type: "Normal", category: "Físico", pp: 6, damage: "1d4", damageType: "force", range: 10, text: "Una embestida veloz. El GM puede conceder ventaja cuando la ficción favorezca la prioridad." }),
  move({ key: "pmdEmber", name: "Ascuas", type: "Fuego", category: "Especial", pp: 8, damage: "1d6", damageType: "fire", range: 30, text: "Proyecta brasas contra un objetivo. Puede encender objetos inflamables desatendidos." }),
  move({ key: "pmdWaterGun", name: "Pistola Agua", type: "Agua", category: "Especial", pp: 8, damage: "1d6", damageType: "cold", range: 30, text: "Dispara agua a presión. El tipo Pokémon se conserva en el perfil PMD; el daño D&D es configurable." }),
  move({ key: "pmdVineWhip", name: "Látigo Cepa", type: "Planta", category: "Físico", pp: 8, damage: "1d6", damageType: "slashing", range: 15, text: "Azota a distancia corta con una liana." }),
  move({ key: "pmdThunderShock", name: "Impactrueno", type: "Eléctrico", category: "Especial", pp: 8, damage: "1d6", damageType: "lightning", range: 30, text: "Descarga eléctrica dirigida contra una criatura." }),
  move({ key: "pmdPowderSnow", name: "Nieve Polvo", type: "Hielo", category: "Especial", pp: 6, damage: "1d6", damageType: "cold", range: 15, text: "Ráfaga helada de corto alcance." }),
  move({ key: "pmdRockThrow", name: "Lanzarrocas", type: "Roca", category: "Físico", pp: 6, damage: "1d8", damageType: "bludgeoning", range: 30, text: "Lanza una roca contra un objetivo visible." }),
  move({ key: "pmdMudSlap", name: "Bofetón Lodo", type: "Tierra", category: "Especial", pp: 8, damage: "1d4", damageType: "bludgeoning", range: 20, text: "Arroja lodo; el GM puede imponer desventaja al siguiente ataque del objetivo." }),
  move({ key: "pmdHelpingHand", name: "Refuerzo", type: "Normal", category: "Estado", pp: 6, damage: "1d4", damageType: "force", range: 15, text: "Ayuda a un aliado. En vez del daño de plantilla, usa la acción Ayudar o concede inspiración según la mesa." })
];

function consumable({ key, name, uses = 1, text, activityData = null, img = null }) {
  const aid = `${key}Act`;
  return {
    _id: id(key),
    name,
    type: "consumable",
    img: img ?? WIKIDEX_ITEM_FALLBACK,
    system: {
      description: { value: `<h2>${name}</h2><p>${text}</p>`, chat: "" },
      source: { custom: "Adaptación inicial PMD para D&D 5e" },
      quantity: 1,
      uses: { spent: 0, max: String(uses), autoDestroy: true, recovery: [] },
      type: { value: "food", subtype: "" },
      activities: activityData ? { [id(aid)]: { ...activityData, _id: id(aid), name } } : {}
    },
    effects: [],
    folder: null,
    sort: 0,
    ownership: { default: 0 },
    flags: { [MODULE_ID]: { starter: true, item: { kind: "dungeon-item" } } }
  };
}

const damageTypes = {
  normal: "bludgeoning", lucha: "bludgeoning", volador: "slashing", veneno: "poison",
  tierra: "bludgeoning", roca: "bludgeoning", bicho: "piercing", fantasma: "necrotic",
  acero: "slashing", fuego: "fire", agua: "cold", planta: "slashing", eléctrico: "lightning",
  hielo: "cold", psíquico: "psychic", siniestro: "necrotic", hada: "radiant", dragón: "acid"
};
function damageFormula(power) {
  if (power == null) return "1d6";
  if (power <= 20) return "1d4";
  if (power <= 40) return "1d6";
  if (power <= 60) return "1d8";
  if (power <= 80) return "1d10";
  if (power <= 100) return "2d6";
  if (power <= 120) return "2d8";
  return "3d8";
}
async function loadWikiMoves() {
  try {
    const records = JSON.parse(await readFile(path.join(ROOT, "data", "wikidex-moves.json"), "utf8"));
    if (!records.length) return moves;
    return records.map((record, recordIndex) => move({
      key: `pmdMove${String(recordIndex).padStart(6, "0")}`,
      name: record.name,
      type: record.type,
      category: record.category,
      pp: record.pp ?? 5,
      damage: damageFormula(record.power),
      damageType: damageTypes[record.type] ?? "force",
      range: record.description?.match(/distancia|remoto|rayo|proyectil/i) ? 30 : 5,
      text: record.description,
      power: record.power,
      accuracy: record.accuracy,
      priority: record.priority,
      selfDamage: record.selfDamage,
      generation: record.generation,
      img: record.img
    }));
  } catch {
    return moves;
  }
}

const allMoves = await loadWikiMoves();

const starterMoveNames = {
  Bulbasaur: ["Placaje", "Gruñido", "Látigo Cepa"], Charmander: ["Placaje", "Gruñido", "Brasas", "Garra"],
  Squirtle: ["Placaje", "Gruñido", "Pistola Agua"], Pikachu: ["Placaje", "Gruñido", "Impactrueno", "Ataque Rápido"],
  Chikorita: ["Placaje", "Gruñido", "Látigo Cepa"], Cyndaquil: ["Placaje", "Gruñido", "Brasas"], Totodile: ["Placaje", "Gruñido", "Pistola Agua"],
  Treecko: ["Placaje", "Gruñido", "Látigo Cepa"], Torchic: ["Placaje", "Gruñido", "Brasas"], Mudkip: ["Placaje", "Gruñido", "Pistola Agua"],
  Turtwig: ["Placaje", "Gruñido", "Látigo Cepa"], Chimchar: ["Placaje", "Gruñido", "Brasas"], Piplup: ["Placaje", "Gruñido", "Pistola Agua"],
  Snivy: ["Placaje", "Gruñido", "Látigo Cepa"], Tepig: ["Placaje", "Gruñido", "Brasas"], Oshawott: ["Placaje", "Gruñido", "Pistola Agua"],
  Riolu: ["Placaje", "Gruñido", "Ataque Rápido"]
};
const speciesTypes = {
  Bulbasaur: ["planta", "veneno"], Charmander: ["fuego"], Squirtle: ["agua"], Pikachu: ["eléctrico"],
  Chikorita: ["planta"], Cyndaquil: ["fuego"], Totodile: ["agua"], Treecko: ["planta"], Torchic: ["fuego"], Mudkip: ["agua"],
  Turtwig: ["planta"], Chimchar: ["fuego"], Piplup: ["agua"], Snivy: ["planta"], Tepig: ["fuego"], Oshawott: ["agua"],
  Axew: ["dragón"], Riolu: ["lucha"], Meowth: ["normal"], Psyduck: ["agua"], Machop: ["lucha"], Cubone: ["tierra"],
  Eevee: ["normal"], Skitty: ["normal"], Munchlax: ["normal"], Vulpix: ["fuego"], Phanpy: ["tierra"], Shinx: ["eléctrico"],
  Chespin: ["planta"], Fennekin: ["fuego"], Froakie: ["agua"]
};
function slug(value) {
  return String(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/gi, "").toLowerCase();
}
function pokemonActor(record, index) {
  const types = (record.types?.length ? record.types : (speciesTypes[record.name] ?? ["normal"])).map(typeKey);
  const type1 = types[0] ?? "normal";
  const type2 = types[1] ?? "";
  const typeStarterMove = { fuego: "Brasas", agua: "Pistola Agua", planta: "Látigo Cepa", eléctrico: "Impactrueno", hielo: "Nieve Polvo", roca: "Lanzarrocas", tierra: "Bofetón Lodo", lucha: "Ataque Rápido" };
  const names = starterMoveNames[record.name] ?? ["Placaje", "Gruñido", typeStarterMove[type1]].filter(Boolean);
  const moveItems = names.map((name, moveIndex) => {
    const source = allMoves.find(item => item.name === name) ?? allMoves.find(item => item.name.includes(name));
    if (!source) return null;
    return { ...JSON.parse(JSON.stringify(source)), _id: id(`pm${index}${moveIndex}${slug(name)}`), folder: null };
  }).filter(Boolean);
  return {
    _id: id(`pmdPokemon${String(index).padStart(5, "0")}`),
    name: record.name,
    type: "character",
    img: record.sprite ?? "icons/svg/wingfoot.svg",
    system: {
      abilities: { str: { value: 10 }, dex: { value: 10 }, con: { value: 10 }, int: { value: 10 }, wis: { value: 10 }, cha: { value: 10 } },
      attributes: { hp: { value: 10, max: 10, temp: 0, tempmax: 0 }, ac: { value: 10 }, prof: 2, init: { ability: "dex", bonus: "" }, movement: { walk: 30 } },
      details: { level: 1, biography: { value: `<p>Pokémon inicial/seleccionable según ${record.source ?? "WikiDex"}.</p>` } },
      traits: { size: "med", di: [], dr: [], dv: [], dm: [], languages: { value: [], custom: "" } },
      resources: { primary: { value: 0, max: 0 }, secondary: { value: 0, max: 0 }, tertiary: { value: 0, max: 0 } }
    },
    items: moveItems,
    effects: [],
    ownership: { default: 0 },
    flags: {
      [MODULE_ID]: {
        starter: true,
        pokemon: { source: record.source ?? "WikiDex — Saga Pokémon Mundo misterioso", games: record.games ?? [record.game], species: record.name, types, generation: record.generation ?? null },
        profile: { species: record.name, type1, type2, hunger: 100, hungerMax: 100, pp: 20, ppMax: 20, friendship: 0, rank: "Normal", rankPoints: 0, nature: "" }
      }
    }
  };
}
async function loadStarterPokemon() {
  try {
    const data = JSON.parse(await readFile(path.join(ROOT, "data", "wikidex-starters.json"), "utf8"));
    const catalogue = JSON.parse(await readFile(path.join(ROOT, "data", "pokemon-all.json"), "utf8"));
    const catalogueByName = new Map(catalogue.map(record => [record.name, record]));
    const grouped = new Map();
    for (const [game, list] of Object.entries(data)) for (const record of list) {
      const current = grouped.get(record.name) ?? { ...record, games: [] };
      current.games.push(game);
      if (!current.types?.length && record.types?.length) current.types = record.types;
      const canonical = catalogueByName.get(record.name);
      if (canonical) Object.assign(current, { sprite: canonical.sprite, generation: canonical.generation, id: canonical.id });
      grouped.set(record.name, current);
    }
    const records = [...grouped.values()];
    if (records.length) return records.map(pokemonActor);
  } catch { /* use the small fallback below */ }
  return ["Bulbasaur", "Charmander", "Squirtle", "Pikachu", "Chikorita", "Cyndaquil", "Totodile", "Treecko", "Torchic", "Mudkip", "Turtwig", "Chimchar", "Piplup", "Snivy", "Tepig", "Oshawott", "Riolu"].map((name, index) => pokemonActor({ name, types: ["normal"], game: "Selección inicial" }, index));
}
const starterPokemon = await loadStarterPokemon();
async function loadAllPokemon() {
  try {
    const records = JSON.parse(await readFile(path.join(ROOT, "data", "pokemon-all.json"), "utf8"));
    return records.map((record, index) => pokemonActor(record, index));
  } catch {
    return starterPokemon;
  }
}
const allPokemon = await loadAllPokemon();

const items = [
  consumable({ key: "pmdOranBerry", name: "Baya Aranja", text: "Recupera 1d8 + bonificador de competencia PG. La actividad puede ajustarse al nivel de la campaña.", activityData: activity({ key: "oranHeal", name: "Comer Baya Aranja", healing: "1d8" }) }),
  consumable({ key: "pmdPechaBerry", name: "Baya Meloc", text: "Elimina la condición Envenenado. El GM aplica la eliminación desde la hoja o mediante el módulo de condiciones que utilice." }),
  consumable({ key: "pmdReviverSeed", name: "Semilla Revivir", text: "Cuando el portador llega a 0 PG, consume la semilla para estabilizarse y recuperar 1d8 PG.", activityData: activity({ key: "reviveHeal", name: "Usar Semilla Revivir", healing: "1d8" }) }),
  consumable({ key: "pmdEscapeOrb", name: "Orbe de Escape", text: "Evacúa al equipo de la Mazmorra Misteriosa, salvo que la escena indique que la huida está bloqueada." }),
  consumable({ key: "pmdApple", name: "Manzana", text: "Restaura 25 puntos de Hambre en el perfil PMD del Pokémon." })
];
async function loadWikiItems() {
  try {
    const records = JSON.parse(await readFile(path.join(ROOT, "data", "wikidex-items.json"), "utf8"));
    if (!records.length) return items;
    return records.map((record, index) => {
      const item = consumable({
        key: `pmdItem${String(index).padStart(5, "0")}`,
        name: record.name,
        text: `${record.description}${record.affects ? `<br><strong>Afecta a:</strong> ${record.affects}` : ""}${record.locations ? `<br><strong>Se encuentra en:</strong> ${record.locations}` : ""}`,
        img: record.img
      });
      item.system.type.value = "misc";
      item.system.source.custom = record.source;
      item.flags[MODULE_ID].item = { kind: "dungeon-item", englishName: record.englishName, price: record.price };
      return item;
    });
  } catch {
    return items;
  }
}
const allItems = await loadWikiItems();

const rules = [{
  _id: id("pmdRules"),
  name: "Empieza aquí — PMD sobre D&D 5e",
  img: "icons/svg/book.svg",
  pages: [
    {
      _id: id("pmdStart"),
      name: "Cómo usar el módulo",
      type: "text",
      title: { show: true, level: 1 },
      text: {
        format: 1,
        content: `<h1>Pokémon Mystery Dungeon sobre D&amp;D 5e</h1><p>Este módulo amplía D&amp;D 5e: no sustituye su motor. CA, PG, características, iniciativa, tiradas y actividades siguen perteneciendo a D&amp;D 5e.</p><ol><li>Abre un Actor personaje o PNJ.</li><li>Pulsa <strong>Editar perfil Pokémon</strong> en la franja PMD de la hoja.</li><li>Abre Compendios y arrastra movimientos u objetos iniciales a la hoja.</li><li>Abre un movimiento y pulsa <strong>Editar datos Pokémon</strong>. Su ataque, daño y alcance se modifican en la pestaña <strong>Actividades</strong> de D&amp;D 5e.</li></ol>`
      },
      ownership: { default: -1 },
      sort: 0
    },
    {
      _id: id("pmdMoves"),
      name: "Movimientos y PP",
      type: "text",
      title: { show: true, level: 1 },
      text: {
        format: 1,
        content: `<h1>Movimientos</h1><p>Cada movimiento es un Rasgo de D&amp;D 5e con una Actividad y un número de usos que representa sus PP. Las fichas iniciales son una base jugable, no una transcripción completa de ningún manual.</p><p>Los datos de tipo, categoría y PP se editan desde la franja Pokémon del objeto. Los dados, ataque, alcance, objetivos y efectos se editan con los controles normales de Actividades de D&amp;D 5e.</p>`
      },
      ownership: { default: -1 },
      sort: 1
    },
    {
      _id: id("pmdCharacter"),
      name: "Crear un Pokémon",
      type: "text",
      title: { show: true, level: 1 },
      text: {
        format: 1,
        content: `<h1>Crear un Pokémon</h1><ol><li>Crea un Actor de tipo Personaje.</li><li>Usa una clase de D&amp;D 5e como armazón mecánico o crea una clase adaptada para la especie.</li><li>Configura especie, tipos, nivel de equipo, hambre y rango en el perfil PMD.</li><li>Arrastra hasta cuatro movimientos iniciales desde el compendio.</li><li>Ajusta PG, CA, velocidades, sentidos y competencias en la hoja D&amp;D según la conversión de la campaña.</li></ol><p>El módulo conserva la hoja D&amp;D porque sus cálculos siguen sosteniendo el juego; la capa PMD identifica y administra las reglas Pokémon añadidas.</p>`
      },
      ownership: { default: -1 },
      sort: 2
    }
  ],
  folder: null,
  sort: 0,
  ownership: { default: 0 },
  flags: { [MODULE_ID]: { starter: true } }
}];

async function writePack(name, documentType, documents) {
  const target = path.join(ROOT, "packs", name);
  await rm(target, { recursive: true, force: true });
  await mkdir(target, { recursive: true });
  const db = new ClassicLevel(target, { valueEncoding: "utf8" });
  await db.open();
  const prefix = documentType === "Item" ? "!items!" : documentType === "Actor" ? "!actors!" : "!journal!";
  await db.batch(documents.map(document => ({ type: "put", key: `${prefix}${document._id}`, value: JSON.stringify(document) })));
  await db.close();
  console.log(`${name}: ${documents.length} documentos`);
}

await writePack("pmd-starter-moves-v5", "Item", allMoves);
await writePack("pmd-starter-items-v5", "Item", allItems);
await writePack("pmd-starter-pokemon-v5", "Actor", starterPokemon);
await writePack("pmd-pokemon-v5", "Actor", allPokemon);
await writePack("pmd-rules-v5", "JournalEntry", rules);
