/**
 * Modelo de reglas independiente de Foundry.
 *
 * Este archivo no depende de dnd5e ni de la hoja actual: sirve como núcleo
 * común para el sistema, los compendios y las pruebas de importación.
 */

export const POKEMON_STATS = ["hp", "attack", "defense", "specialAttack", "specialDefense", "speed"];

export const STAT_STAGE_MULTIPLIERS = {
  "-6": 0.25, "-5": 2 / 7, "-4": 1 / 3, "-3": 0.4, "-2": 0.5, "-1": 2 / 3,
  "0": 1, "+1": 1.5, "+2": 2, "+3": 2.5, "+4": 3, "+5": 3.5, "+6": 4
};

export const ACCURACY_EVASION_STAGE_MULTIPLIERS = {
  "-6": 0.25, "-5": 0.28, "-4": 0.33, "-3": 0.4, "-2": 0.5, "-1": 0.66,
  "0": 1, "+1": 1.5, "+2": 2, "+3": 2.5, "+4": 3, "+5": 3.5, "+6": 4
};

export const TYPE_EFFECTIVENESS = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass: { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice: { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying: { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy: { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

export const TYPE_ALIASES = {
  normal: "normal", fuego: "fire", fire: "fire", agua: "water", water: "water", planta: "grass", grass: "grass",
  electrico: "electric", eléctrico: "electric", electric: "electric", hielo: "ice", ice: "ice", lucha: "fighting", pelea: "fighting", fighting: "fighting",
  veneno: "poison", poison: "poison", tierra: "ground", ground: "ground", volador: "flying", flying: "flying", psiquico: "psychic", psíquico: "psychic", psychic: "psychic",
  bicho: "bug", bug: "bug", roca: "rock", rock: "rock", fantasma: "ghost", ghost: "ghost", dragon: "dragon", dragón: "dragon", siniestro: "dark", dark: "dark", acero: "steel", steel: "steel", hada: "fairy", fairy: "fairy"
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, Number(value) || 0));
const floor = value => Math.floor(Number(value) || 0);

export function stageMultiplier(stage = 0, accuracyOrEvasion = false) {
  const bounded = clamp(Math.trunc(stage), -6, 6);
  const table = accuracyOrEvasion ? ACCURACY_EVASION_STAGE_MULTIPLIERS : STAT_STAGE_MULTIPLIERS;
  return table[bounded >= 0 ? `+${bounded}` : String(bounded)] ?? table["0"];
}

export function calculateStats({ baseStats = {}, ivs = {}, evs = {}, level = 1, nature = {} } = {}) {
  const lvl = clamp(level, 1, 100);
  const result = {};
  for (const stat of POKEMON_STATS) {
    const base = Math.max(0, Number(baseStats[stat] ?? 0));
    const iv = clamp(ivs[stat] ?? 0, 0, 31);
    const ev = clamp(evs[stat] ?? 0, 0, 252);
    const core = floor(((2 * base + iv + floor(ev / 4)) * lvl) / 100);
    const natureMultiplier = stat === "hp" ? 1 : Number(nature[stat] ?? 1) || 1;
    const value = stat === "hp" ? core + lvl + 10 : floor((core + 5) * natureMultiplier);
    result[stat] = { value: Math.max(1, value), base, iv, ev, nature: natureMultiplier };
  }
  return result;
}

export function typeEffectiveness(moveType, defenderTypes = []) {
  const type = TYPE_ALIASES[String(moveType ?? "normal").toLowerCase()] ?? "normal";
  return defenderTypes.filter(Boolean).reduce((multiplier, defenderType) => {
    const key = TYPE_ALIASES[String(defenderType).toLowerCase()] ?? String(defenderType).toLowerCase();
    return multiplier * (TYPE_EFFECTIVENESS[type]?.[key] ?? 1);
  }, 1);
}

export function accuracyMultiplier({ moveAccuracy = 100, accuracyStage = 0, evasionStage = 0, sureHit = false } = {}) {
  if (sureHit || moveAccuracy == null || Number(moveAccuracy) < 0) return 1;
  return (Number(moveAccuracy) / 100) * stageMultiplier(accuracyStage, true) / stageMultiplier(evasionStage, true);
}

export function normalizePokemonCurrency(data = {}) {
  return { poke: Math.max(0, Number(data.poke ?? 0)), pokeballs: 0 };
}

export function isCaptureDevice(item = {}) {
  const text = `${item.name ?? ""} ${item.englishName ?? ""} ${item.description ?? ""}`.toLowerCase();
  return /pok[eé] ?ball|pok[eé]bola|great ball|ultra ball|master ball|safari ball|net ball|dive ball|nest ball|repeat ball|timer ball|luxury ball|premier ball|dusk ball|heal ball|quick ball|cherish ball|heavy ball|love ball|friend ball|moon ball|sport ball|park ball|acopio ball|super ball|ultrabola|superbola/i.test(text);
}

export function filterAdventureItems(items = []) {
  return items.filter(item => !isCaptureDevice(item));
}
