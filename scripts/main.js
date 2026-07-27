const MODULE_ID = "pokemon-mystery-dungeon";
const TYPES = [
  "normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison",
  "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark",
  "steel", "fairy"
];

const TYPE_LABELS = {
  normal: "Normal", fire: "Fuego", water: "Agua", electric: "Eléctrico",
  grass: "Planta", ice: "Hielo", fighting: "Lucha", poison: "Veneno",
  ground: "Tierra", flying: "Volador", psychic: "Psíquico", bug: "Bicho",
  rock: "Roca", ghost: "Fantasma", dragon: "Dragón", dark: "Siniestro",
  steel: "Acero", fairy: "Hada"
};

const EFFECTIVENESS = {
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

const DEFAULT_DATA = {
  species: "",
  type1: "normal",
  type2: "",
  nature: "",
  aura: "",
  origin: "",
  team: "",
  rank: "Normal",
  rankPoints: 0,
  hunger: 100,
  hungerMax: 100,
  pp: 10,
  ppMax: 10,
  friendship: 0,
  adventureTokens: 0,
  notes: ""
};

function esc(value) {
  return foundry.utils.escapeHTML(String(value ?? ""));
}

function actorData(actor) {
  return foundry.utils.mergeObject(
    foundry.utils.deepClone(DEFAULT_DATA),
    foundry.utils.deepClone(actor.getFlag(MODULE_ID, "profile") ?? {}),
    { inplace: false }
  );
}

function optionList(selected, allowEmpty = false) {
  const empty = allowEmpty ? `<option value="">—</option>` : "";
  return empty + TYPES.map(type =>
    `<option value="${type}" ${selected === type ? "selected" : ""}>${TYPE_LABELS[type]}</option>`
  ).join("");
}

function field(label, name, value, type = "text", extra = "") {
  return `<label>${label}<input type="${type}" name="${name}" value="${esc(value)}" ${extra}></label>`;
}

function panelHTML(actor) {
  const d = actorData(actor);
  return `
    <form class="pmd-sheet" autocomplete="off">
      <header>
        <i class="fas fa-paw"></i>
        <div><h2>${esc(actor.name)}</h2><p>Perfil de explorador Pokémon sobre D&D 5e</p></div>
      </header>
      <div class="pmd-grid">
        <section class="pmd-card">
          <h3>Identidad Pokémon</h3>
          <div class="pmd-fields">
            ${field("Especie", "species", d.species)}
            ${field("Naturaleza", "nature", d.nature)}
            <label>Tipo principal<select name="type1">${optionList(d.type1)}</select></label>
            <label>Tipo secundario<select name="type2">${optionList(d.type2, true)}</select></label>
            ${field("Aura", "aura", d.aura)}
            ${field("Origen / vida anterior", "origin", d.origin)}
          </div>
        </section>
        <section class="pmd-card">
          <h3>Equipo de exploración</h3>
          <div class="pmd-fields">
            ${field("Nombre del equipo", "team", d.team)}
            <label>Rango<select name="rank">
              ${["Normal", "Bronce", "Plata", "Oro", "Diamante", "Gran Maestro"]
                .map(rank => `<option ${d.rank === rank ? "selected" : ""}>${rank}</option>`).join("")}
            </select></label>
            ${field("Puntos de rango", "rankPoints", d.rankPoints, "number", 'min="0"')}
            ${field("Amistad", "friendship", d.friendship, "number", 'min="0"')}
            ${field("Fichas de aventura", "adventureTokens", d.adventureTokens, "number", 'min="0"')}
          </div>
        </section>
        <section class="pmd-card">
          <h3>Supervivencia</h3>
          <div class="pmd-fields">
            ${field("Hambre actual", "hunger", d.hunger, "number", 'min="0"')}
            ${field("Hambre máxima", "hungerMax", d.hungerMax, "number", 'min="1"')}
            ${field("PP actuales", "pp", d.pp, "number", 'min="0"')}
            ${field("PP máximos", "ppMax", d.ppMax, "number", 'min="1"')}
          </div>
          <div class="pmd-meter"><progress value="${d.hunger}" max="${d.hungerMax}"></progress><span>${d.hunger}/${d.hungerMax}</span></div>
          <div class="pmd-meter"><progress value="${d.pp}" max="${d.ppMax}"></progress><span>${d.pp}/${d.ppMax} PP</span></div>
          <p class="pmd-help">Usa PP como reserva general para Movimientos Pokémon creados como conjuros o rasgos de D&D 5e.</p>
        </section>
        <section class="pmd-card">
          <h3>Notas de aventura</h3>
          <textarea name="notes" rows="8">${esc(d.notes)}</textarea>
        </section>
      </div>
      <section class="pmd-card">
        <h3>Acciones rápidas</h3>
        <div class="pmd-actions">
          <button type="button" data-pmd-action="check"><i class="fas fa-dice-d20"></i> Prueba PMD</button>
          <button type="button" data-pmd-action="spend-pp"><i class="fas fa-bolt"></i> Gastar 1 PP</button>
          <button type="button" data-pmd-action="hunger"><i class="fas fa-drumstick-bite"></i> Gastar 10 hambre</button>
          <button type="button" data-pmd-action="rest"><i class="fas fa-campground"></i> Descanso completo</button>
          <button type="button" data-pmd-action="type"><i class="fas fa-burst"></i> Efectividad</button>
          <button type="button" data-pmd-action="mission"><i class="fas fa-map"></i> Misión</button>
        </div>
      </section>
    </form>`;
}

function isActorSheet(application) {
  const document = application.document ?? application.actor;
  return document?.documentName === "Actor" && ["character", "npc"].includes(document.type);
}

function isItemSheet(application) {
  return application.document?.documentName === "Item";
}

function pokemonSheetBanner(actor) {
  const d = actorData(actor);
  const types = [d.type1, d.type2].filter(Boolean).map(type => TYPE_LABELS[type] ?? type).join(" / ");
  return `
    <section class="pmd-sheet-banner" data-pmd-sheet-banner data-pmd-actor-id="${actor?.id ?? ""}">
      <i class="fas fa-paw"></i>
      <div>
        <strong>${d.species ? esc(d.species) : "Perfil Pokémon sin configurar"}</strong>
        <span>${types || "Elige especie, tipos y naturaleza"}</span>
      </div>
      <button type="button" data-pmd-open-profile>
        <i class="fas fa-pen-to-square"></i> Editar perfil Pokémon
      </button>
    </section>`;
}

function integratedPokemonSection(actor) {
  const d = actorData(actor);
  const moves = actor.items?.filter(item => item.getFlag(MODULE_ID, "move")?.kind === "move") ?? [];
  return `<section class="pmd-integrated" data-pmd-integrated>
    <div class="pmd-integrated-title"><i class="fas fa-paw"></i><div><strong>Capa Pokémon Mystery Dungeon</strong><span>Perfil, supervivencia y movimientos integrados en esta hoja D&amp;D 5e</span></div></div>
    <div class="pmd-inline-grid">
      <label>Especie<input data-pmd-field="species" value="${esc(d.species)}" placeholder="Ej. Pikachu"></label>
      <label>Naturaleza<input data-pmd-field="nature" value="${esc(d.nature)}" placeholder="Ej. Alegre"></label>
      <label>Tipo principal<select data-pmd-field="type1">${optionList(d.type1)}</select></label>
      <label>Tipo secundario<select data-pmd-field="type2">${optionList(d.type2, true)}</select></label>
      <label>Hambre<input type="number" min="0" data-pmd-field="hunger" value="${d.hunger}"></label>
      <label>PP generales<input type="number" min="0" data-pmd-field="pp" value="${d.pp}"></label>
    </div>
    <div class="pmd-integrated-footer"><div><strong>Movimientos PMD:</strong> ${moves.length ? moves.map(item => `<button type="button" class="pmd-inline-move" data-pmd-item-id="${item.id}">${esc(item.name)} <small>${moveData(item).pp.value}/${moveData(item).pp.max} PP</small></button>`).join("") : "Arrastra movimientos desde el compendio a esta hoja."}</div><button type="button" data-pmd-inline-save><i class="fas fa-save"></i> Guardar perfil PMD</button></div>
  </section>`;
}

async function saveIntegratedProfile(actor, box, application) {
  const d = actorData(actor);
  for (const key of ["species", "nature", "type1", "type2"]) d[key] = box.querySelector(`[data-pmd-field="${key}"]`)?.value ?? d[key];
  for (const key of ["hunger", "pp"]) d[key] = Math.max(0, Number(box.querySelector(`[data-pmd-field="${key}"]`)?.value ?? d[key]));
  await actor.setFlag(MODULE_ID, "profile", d);
  ui.notifications.info("Perfil Pokémon guardado en la hoja.");
  await application.render({ force: true });
}

function moveData(item) {
  return foundry.utils.mergeObject({
    kind: "move",
    type: "normal",
    category: "physical",
    pp: { value: 5, max: 5 },
    stabEligible: true,
    power: null,
    accuracy: null,
    priority: 0,
    selfDamage: false,
    save: { ability: "", dc: "" },
    source: { document: "", page: null }
  }, foundry.utils.deepClone(item.getFlag(MODULE_ID, "move") ?? {}), { inplace: false });
}

async function openMoveEditor(item) {
  if (!item?.isOwner) return ui.notifications.warn("No tienes permiso para editar este objeto.");
  const d = moveData(item);
  const result = await foundry.applications.api.DialogV2.prompt({
    window: { title: `Datos Pokémon: ${item.name}` },
    classes: ["pmd-dialog"],
    content: `<form class="pmd-sheet">
      <p class="pmd-help">El ataque, daño, alcance, objetivo y salvación se editan en las Activities normales de dnd5e. Aquí solo se guardan los datos Pokémon.</p>
      <div class="pmd-fields">
        <label>Tipo<select name="type">${optionList(d.type)}</select></label>
        <label>Categoría<select name="category">
          ${["physical", "special", "status"].map(value =>
            `<option value="${value}" ${d.category === value ? "selected" : ""}>${value === "physical" ? "Físico" : value === "special" ? "Especial" : "Estado"}</option>`
          ).join("")}
        </select></label>
        ${field("PP actuales", "ppValue", d.pp.value, "number", 'min="0"')}
        ${field("PP máximos", "ppMax", d.pp.max, "number", 'min="0"')}
        ${field("Potencia Pokémon", "power", d.power ?? "", "number", 'min="0"')}
        ${field("Precisión (%)", "accuracy", d.accuracy ?? "", "number", 'min="0" max="100"')}
        ${field("Prioridad", "priority", d.priority ?? 0, "number")}
        <label>Salvación<select name="saveAbility"><option value="">Sin salvación</option>${["str", "dex", "con", "int", "wis", "cha"].map(value => `<option value="${value}" ${d.save?.ability === value ? "selected" : ""}>${value.toUpperCase()}</option>`).join("")}</select></label>
        ${field("CD de salvación", "saveDC", d.save?.dc ?? "", "text")}
        ${field("Documento fuente", "sourceDocument", d.source.document)}
        ${field("Página fuente", "sourcePage", d.source.page ?? "", "number", 'min="1"')}
        <label><input type="checkbox" name="stabEligible" ${d.stabEligible ? "checked" : ""}> Puede recibir STAB</label>
        <label><input type="checkbox" name="selfDamage" ${d.selfDamage ? "checked" : ""}> Aplica daño o retroceso al usuario</label>
      </div>
    </form>`,
    ok: {
      label: "Guardar datos Pokémon",
      callback: (_event, button) => new foundry.applications.ux.FormDataExtended(button.form).object
    }
  });
  if (!result) return;
  const ppMax = Math.max(0, Number(result.ppMax || 0));
  await item.setFlag(MODULE_ID, "move", {
    kind: "move",
    type: result.type,
    category: result.category,
    pp: { value: Math.clamp(Number(result.ppValue || 0), 0, ppMax), max: ppMax },
    power: result.power === "" ? null : Number(result.power),
    accuracy: result.accuracy === "" ? null : Number(result.accuracy),
    priority: Number(result.priority || 0),
    selfDamage: Boolean(result.selfDamage),
    save: { ability: result.saveAbility ?? "", dc: result.saveDC ?? "" },
    stabEligible: Boolean(result.stabEligible),
    source: {
      document: result.sourceDocument ?? "",
      page: result.sourcePage ? Number(result.sourcePage) : null
    }
  });
  ui.notifications.info(`Datos Pokémon de ${item.name} guardados.`);
}

function moveSheetBanner(item) {
  const d = moveData(item);
  return `
    <section class="pmd-sheet-banner pmd-move-banner" data-pmd-item-banner data-pmd-item-id="${item?.id ?? ""}">
      <i class="fas fa-burst"></i>
      <div>
        <strong>Movimiento ${TYPE_LABELS[d.type] ?? d.type}</strong>
        <span>${d.category} · ${d.pp.value}/${d.pp.max} PP</span>
      </div>
      <button type="button" data-pmd-edit-move>
        <i class="fas fa-pen-to-square"></i> Editar datos Pokémon
      </button>
    </section>`;
}

async function saveFromDialog(actor, dialog) {
  const form = dialog.element.querySelector("form");
  if (!form) return;
  const raw = new foundry.applications.ux.FormDataExtended(form).object;
  for (const key of ["rankPoints", "hunger", "hungerMax", "pp", "ppMax", "friendship", "adventureTokens"]) {
    raw[key] = Number(raw[key] || 0);
  }
  raw.hunger = Math.clamp(raw.hunger, 0, Math.max(1, raw.hungerMax));
  raw.pp = Math.clamp(raw.pp, 0, Math.max(1, raw.ppMax));
  await actor.setFlag(MODULE_ID, "profile", raw);
  ui.notifications.info(game.i18n.localize("PMD.Saved"));
}

async function updateResource(actor, key, delta) {
  const d = actorData(actor);
  const maxKey = `${key}Max`;
  d[key] = Math.clamp(Number(d[key]) + delta, 0, Number(d[maxKey]));
  await actor.setFlag(MODULE_ID, "profile", d);
}

async function rollCheck(actor) {
  const roll = await new Roll("1d20 + @prof", {
    prof: actor.system.attributes?.prof ?? 0
  }).evaluate();
  await roll.toMessage({
    speaker: ChatMessage.getSpeaker({ actor }),
    flavor: `<h3>Prueba PMD</h3><p>${esc(actor.name)} realiza una prueba de aventura usando su bonificador de competencia.</p>`
  });
}

async function typeCalculator() {
  const selects = (name) => `<select name="${name}">${optionList(name === "attack" ? "normal" : "", name !== "attack")}</select>`;
  const result = await foundry.applications.api.DialogV2.prompt({
    window: { title: "Efectividad elemental" },
    classes: ["pmd-dialog"],
    content: `<form class="pmd-sheet"><div class="pmd-fields">
      <label>Movimiento${selects("attack")}</label>
      <label>Tipo defensor 1${selects("def1")}</label>
      <label>Tipo defensor 2${selects("def2")}</label>
    </div></form>`,
    ok: {
      label: "Calcular",
      callback: (_event, button) => new foundry.applications.ux.FormDataExtended(button.form).object
    }
  });
  if (!result) return;
  const chart = EFFECTIVENESS[result.attack] ?? {};
  const multiplier = (chart[result.def1] ?? 1) * (result.def2 ? (chart[result.def2] ?? 1) : 1);
  const label = multiplier === 0 ? "No afecta" : multiplier > 1 ? "¡Súper eficaz!" : multiplier < 1 ? "No es muy eficaz" : "Daño normal";
  await ChatMessage.create({
    content: `<div class="pmd-card"><h3>${TYPE_LABELS[result.attack]} → ${TYPE_LABELS[result.def1]}${result.def2 ? ` / ${TYPE_LABELS[result.def2]}` : ""}</h3><p><strong>${label}</strong> ×${multiplier}</p></div>`
  });
}

const MISSION_PARTS = {
  kind: ["Rescatar a un Pokémon perdido", "Escoltar a un viajero", "Recuperar un objeto robado", "Explorar una anomalía", "Capturar a un forajido", "Llevar suministros urgentes"],
  place: ["Bosque Susurrante", "Cueva Cristal", "Ruinas del Tiempo", "Monte Tormenta", "Pantano Neblina", "Desierto Espejismo"],
  twist: ["el mapa cambia tras cada descanso", "una tormenta altera los tipos de daño", "otro equipo busca el mismo objetivo", "el cliente ocultó un peligro", "la comida escasea", "un Pokémon poderoso protege la última planta"],
  reward: ["bayas y 5 puntos de rango", "un Orbe de Escape y 10 puntos de rango", "una Semilla Revivir y 15 puntos de rango", "un favor del gremio y 20 puntos de rango"]
};

function randomEntry(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function generateMission(actor = null) {
  const mission = {
    kind: randomEntry(MISSION_PARTS.kind),
    place: randomEntry(MISSION_PARTS.place),
    twist: randomEntry(MISSION_PARTS.twist),
    reward: randomEntry(MISSION_PARTS.reward)
  };
  await ChatMessage.create({
    speaker: actor ? ChatMessage.getSpeaker({ actor }) : undefined,
    content: `<div class="pmd-card"><h2><i class="fas fa-map"></i> Nueva misión</h2>
      <p><strong>Objetivo:</strong> ${mission.kind}</p>
      <p><strong>Lugar:</strong> ${mission.place}</p>
      <p><strong>Giro:</strong> ${mission.twist}.</p>
      <p><strong>Recompensa:</strong> ${mission.reward}.</p></div>`
  });
  return mission;
}

async function openPanel(actor) {
  if (!actor) return ui.notifications.warn(game.i18n.localize("PMD.NoActor"));
  const dialog = new foundry.applications.api.DialogV2({
    window: { title: `${game.i18n.localize("PMD.Title")}: ${actor.name}`, resizable: true },
    position: { width: 760, height: 720 },
    classes: ["pmd-dialog"],
    content: panelHTML(actor),
    buttons: [
      {
        action: "save",
        label: "Guardar",
        icon: "fas fa-save",
        default: true,
        callback: async (_event, _button, app) => saveFromDialog(actor, app)
      },
      { action: "close", label: "Cerrar", icon: "fas fa-times" }
    ]
  });
  await dialog.render(true);
  dialog.element.addEventListener("click", async event => {
    const button = event.target.closest("[data-pmd-action]");
    if (!button) return;
    const action = button.dataset.pmdAction;
    if (action === "check") await rollCheck(actor);
    if (action === "spend-pp") await updateResource(actor, "pp", -1);
    if (action === "hunger") await updateResource(actor, "hunger", -10);
    if (action === "rest") {
      const d = actorData(actor);
      d.pp = d.ppMax;
      d.hunger = d.hungerMax;
      await actor.setFlag(MODULE_ID, "profile", d);
      ui.notifications.info(game.i18n.localize("PMD.Restored"));
    }
    if (action === "type") await typeCalculator();
    if (action === "mission") await generateMission(actor);
    if (["spend-pp", "hunger", "rest"].includes(action)) {
      await dialog.close();
      await openPanel(actor);
    }
  });
}

async function createStarterContent() {
  if (!game.user.isGM) return;
  await importStarterCompendia();
  await game.settings.set(MODULE_ID, "starterCreated", true);
  await game.settings.set(MODULE_ID, "contentVersion", 6);
  ui.notifications.info(game.i18n.localize("PMD.SetupDone"));
}

async function importStarterCompendia() {
  if (!game.user.isGM) return;
  const itemFolder = game.folders.find(f => f.name === "PMD — Contenido inicial" && f.type === "Item")
    ?? await Folder.create({ name: "PMD — Contenido inicial", type: "Item", color: "#f1b93c" });
  const journalFolder = game.folders.find(f => f.name === "Pokémon Mystery Dungeon" && f.type === "JournalEntry")
    ?? await Folder.create({ name: "Pokémon Mystery Dungeon", type: "JournalEntry", color: "#285b88" });
  const packNames = ["pmd-starter-moves", "pmd-starter-items"];
  for (const packName of packNames) {
    const pack = game.packs.get(`${MODULE_ID}.${packName}`);
    if (!pack) {
      console.warn(`${MODULE_ID} | No se encontró el compendio ${packName}.`);
      continue;
    }
    for (const document of await pack.getDocuments()) {
      const data = document.toObject();
      delete data._id;
      data.folder = itemFolder.id;
      const existing = game.items.find(item =>
        item.name === data.name && item.getFlag(MODULE_ID, "starter")
      );
      if (existing) await existing.update(data);
      else await Item.create(data);
    }
  }
  const rulesPack = game.packs.get(`${MODULE_ID}.pmd-rules`);
  if (rulesPack) {
    for (const document of await rulesPack.getDocuments()) {
      const data = document.toObject();
      delete data._id;
      data.folder = journalFolder.id;
      const existing = game.journal.find(entry =>
        entry.name === data.name && entry.getFlag(MODULE_ID, "starter")
      );
      if (existing) await existing.update(data);
      else await JournalEntry.create(data);
    }
  }
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "starterCreated", {
    name: "Contenido inicial creado",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
  });
  game.settings.register(MODULE_ID, "contentVersion", {
    name: "Versión del contenido PMD instalado",
    scope: "world",
    config: false,
    type: Number,
    default: 0
  });
  game.settings.registerMenu(MODULE_ID, "starterContent", {
    name: "PMD.Setup",
    label: "PMD.Setup",
    hint: "Crea una guía rápida, una plantilla de movimiento y objetos de exploración en el mundo actual.",
    icon: "fas fa-paw",
    type: class PMDSetupMenu extends foundry.applications.api.ApplicationV2 {
      render() {
        createStarterContent();
        return this;
      }
    },
    restricted: true
  });
});

Hooks.once("ready", async () => {
  // Delegación de respaldo: algunas hojas dnd5e vuelven a pintar el formulario y
  // eliminan listeners locales; el botón debe seguir funcionando en modo normal y edición.
  document.addEventListener("click", event => {
    const profileButton = event.target.closest?.("[data-pmd-open-profile]");
    if (profileButton && !event.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
      const actorId = profileButton.closest("[data-pmd-actor-id]")?.dataset.pmdActorId;
      void openPanel(game.actors.get(actorId));
    }
    const moveButton = event.target.closest?.("[data-pmd-edit-move]");
    if (moveButton && !event.defaultPrevented) {
      event.preventDefault();
      event.stopPropagation();
      const itemId = moveButton.closest("[data-pmd-item-id]")?.dataset.pmdItemId;
      void openMoveEditor(game.items.get(itemId));
    }
  });
  game.pmd = {
    open: openPanel,
    mission: generateMission,
    typeCalculator,
    createStarterContent,
    importStarterCompendia,
    data: actorData
  };
  console.info("Pokémon Mystery Dungeon | Listo para D&D 5e.");
  if (game.user.isGM && game.settings.get(MODULE_ID, "contentVersion") < 6) {
    const create = await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("PMD.Title") },
      classes: ["pmd-dialog"],
      content: `<p>Hay una actualización de contenido PMD disponible. Incluye 902 movimientos, objetos de mazmorra, 121 candidatos de las entregas de Mundo Misterioso, 1025 especies de las generaciones 1–9, avatares y un test de personalidad PMD.</p><p>¿Quieres importarla al mundo? No se borrará ningún Actor ni documento propio.</p>`,
      yes: { label: "Importar y actualizar", icon: "fas fa-paw" },
      no: { label: "Más tarde" },
      rejectClose: false
    });
    if (create) await createStarterContent();
  }
});

Hooks.on("renderApplicationV2", (application, element) => {
  if (!(element instanceof HTMLElement)) return;
  if (isActorSheet(application) && !element.querySelector("[data-pmd-sheet-banner]")) {
    const actor = application.document ?? application.actor;
    element.insertAdjacentHTML("afterbegin", pokemonSheetBanner(actor));
    element.querySelector("[data-pmd-sheet-banner]")?.insertAdjacentHTML("afterend", integratedPokemonSection(actor));
    const button = element.querySelector("[data-pmd-open-profile]");
    button?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      void openPanel(actor);
    }, { capture: true });
    const box = element.querySelector("[data-pmd-integrated]");
    box?.querySelector("[data-pmd-inline-save]")?.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      void saveIntegratedProfile(actor, box, application);
    }, { capture: true });
    box?.querySelectorAll("[data-pmd-item-id]").forEach(moveButton => moveButton.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      void game.items.get(moveButton.dataset.pmdItemId)?.sheet?.render(true);
    }, { capture: true }));
  }
  if (isItemSheet(application)) {
    const item = application.document;
    const isMove = item.getFlag(MODULE_ID, "move")?.kind === "move";
    if (isMove && !element.querySelector("[data-pmd-item-banner]")) {
      element.insertAdjacentHTML("afterbegin", moveSheetBanner(item));
      element.querySelector("[data-pmd-edit-move]")?.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();
        void openMoveEditor(item);
      }, { capture: true });
    }
  }
});

Hooks.on("renderActorDirectory", (application, html) => {
  const root = html instanceof HTMLElement ? html : html?.[0];
  if (!root || root.querySelector("[data-pmd-create-actor]")) return;
  const actions = root.querySelector(".header-actions") ?? root.querySelector("header");
  if (!actions) return;
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.pmdCreateActor = "true";
  button.innerHTML = '<i class="fas fa-paw"></i> Crear Pokémon';
  button.title = "Crea un Actor personaje con perfil PMD listo para configurar";
  button.addEventListener("click", async event => {
    event.preventDefault();
    const actor = await Actor.create({
      name: "Pokémon",
      type: "character",
      flags: { [MODULE_ID]: { profile: { species: "", type1: "", type2: "", hunger: 100, hungerMax: 100, pp: 20, ppMax: 20, friendship: 0, rank: "Normal", rankPoints: 0, nature: "" } } }
    });
    await actor?.sheet?.render(true);
  });
  actions.prepend(button);
});

Hooks.on("getActorDirectoryEntryContext", (_html, options) => {
  options.push({
    name: game.i18n.localize("PMD.OpenPanel"),
    icon: '<i class="fas fa-paw"></i>',
    condition: li => game.actors.get(li.dataset.entryId)?.isOwner,
    callback: li => openPanel(game.actors.get(li.dataset.entryId))
  });
});

Hooks.on("getSceneControlButtons", controls => {
  const tokenControls = controls.tokens;
  if (!tokenControls) return;
  tokenControls.tools.pmd = {
    name: "pmd",
    title: "PMD.OpenPanel",
    icon: "fas fa-paw",
    button: true,
    visible: true,
    onChange: () => openPanel(canvas.tokens.controlled[0]?.actor ?? game.user.character)
  };
});
