import assert from "node:assert/strict";
import {
  accuracyMultiplier,
  calculateStats,
  filterAdventureItems,
  stageMultiplier,
  typeEffectiveness
} from "../scripts/pmd-system-model.js";

assert.equal(stageMultiplier(0), 1);
assert.equal(stageMultiplier(2), 2);
assert.equal(stageMultiplier(-1), 2 / 3);
assert.equal(stageMultiplier(2, true), 2);

const stats = calculateStats({
  level: 50,
  baseStats: { hp: 45, attack: 49, defense: 49, specialAttack: 65, specialDefense: 65, speed: 45 },
  ivs: { hp: 31, attack: 31, defense: 31, specialAttack: 31, specialDefense: 31, speed: 31 },
  evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 }
});
assert.equal(stats.hp.value, 120);
assert.equal(stats.attack.value, 69);
assert.equal(typeEffectiveness("fire", ["grass"]), 2);
assert.equal(typeEffectiveness("Fuego", ["Planta"]), 2);
assert.equal(accuracyMultiplier({ moveAccuracy: 100, accuracyStage: 1, evasionStage: 0 }), 1.5);
assert.equal(filterAdventureItems([{ name: "Poción" }, { name: "Pokébola" }]).length, 1);

console.log("Modelo Pokémon: OK");
