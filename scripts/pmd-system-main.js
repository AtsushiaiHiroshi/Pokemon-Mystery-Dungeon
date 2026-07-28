import {
  ACCURACY_EVASION_STAGE_MULTIPLIERS,
  POKEMON_STATS,
  STAT_STAGE_MULTIPLIERS,
  accuracyMultiplier,
  calculateStats,
  filterAdventureItems,
  stageMultiplier,
  typeEffectiveness
} from "./pmd-system-model.js";

const SYSTEM_ID = "pokemon-mystery-dungeon";
const ActorSheetV2 = foundry.applications.sheets.ActorSheetV2;
const HandlebarsMixin = foundry.applications.api.HandlebarsApplicationMixin;
const DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;

const DEFAULT_POKEMON_SYSTEM = {
  level: 1,
  experience: 0,
  speciesId: null,
  speciesName: "",
  types: { primary: "normal", secondary: "" },
  natureName: "",
  natureMultipliers: {},
  baseStats: { hp: 1, attack: 1, defense: 1, specialAttack: 1, specialDefense: 1, speed: 1 },
  ivs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
  evs: { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 },
  combat: {
    accuracyStage: 0,
    evasionStage: 0,
    priority: 0,
    statStages: { attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 }
  },
  resources: {
    hp: { value: 1, max: 1 },
    pp: { value: 10, max: 10 },
    hunger: { value: 100, max: 100 },
    friendship: { value: 70, max: 255 }
  },
  exhaustion: 0,
  currency: { poke: 0 },
  notes: ""
};

function pokemonSystem(actor) {
  return actor.system ?? {};
}

class PokemonActorSheet extends HandlebarsMixin(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["pmd-system-sheet"],
    position: { width: 1040, height: 760 },
    window: { title: "Pokémon" }
  };

  static PARTS = {
    form: { template: `systems/${SYSTEM_ID}/templates/actor/pokemon-sheet.hbs` }
  };

  async _prepareContext(options) {
    const actor = this.actor;
    const system = pokemonSystem(actor);
    const stats = calculateStats({
      level: system.level ?? 1,
      baseStats: system.baseStats ?? {},
      ivs: system.ivs ?? {},
      evs: system.evs ?? {},
      nature: system.natureMultipliers ?? {}
    });
    return {
      actor,
      system,
      stats,
      items: actor.items.contents,
      editable: this.isEditable,
      statNames: {
        hp: "PS", attack: "Ataque", defense: "Defensa", specialAttack: "Ataque Especial",
        specialDefense: "Defensa Especial", speed: "Velocidad"
      },
      POKEMON_STATS,
      stageMultiplier,
      STAT_STAGE_MULTIPLIERS,
      ACCURACY_EVASION_STAGE_MULTIPLIERS
    };
  }

  async _onRender(context, options) {
    await super._onRender(context, options);
    this.element.querySelectorAll("[data-pmd-roll]").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        const formula = button.dataset.pmdRoll || "1d20";
        const label = button.dataset.pmdLabel || "Tirada Pokémon";
        new Roll(formula).toMessage({ flavor: label });
      });
    });
  }
}

Hooks.once("init", () => {
  CONFIG.Actor.dataModels ??= {};
  DocumentSheetConfig.registerSheet(Actor, "pmd", PokemonActorSheet, {
    types: ["pokemon", "npc", "team"],
    makeDefault: true,
    label: "Pokémon Mystery Dungeon"
  });

  game.pmd = {
    systemId: SYSTEM_ID,
    stats: POKEMON_STATS,
    calculateStats,
    stageMultiplier,
    accuracyMultiplier,
    typeEffectiveness,
    filterAdventureItems
  };
});

Hooks.on("preCreateActor", (actor, data) => {
  if (!["pokemon", "npc", "team"].includes(actor.type)) return;
  actor.updateSource({
    system: foundry.utils.mergeObject(foundry.utils.deepClone(DEFAULT_POKEMON_SYSTEM), data.system ?? {}, { inplace: false })
  });
});

Hooks.once("ready", () => {
  console.info("Pokémon Mystery Dungeon | Sistema propio inicializado.");
});
