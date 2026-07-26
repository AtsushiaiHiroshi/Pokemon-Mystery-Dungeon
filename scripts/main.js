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
  const folder = game.folders.find(f => f.name === "Pokémon Mystery Dungeon" && f.type === "JournalEntry")
    ?? await Folder.create({ name: "Pokémon Mystery Dungeon", type: "JournalEntry", color: "#285b88" });
  if (!game.journal.find(j => j.getFlag(MODULE_ID, "starter"))) {
    await JournalEntry.create({
      name: "Guía rápida - Pokémon Mystery Dungeon",
      folder: folder.id,
      flags: { [MODULE_ID]: { starter: true } },
      pages: [{
        name: "Reglas de campaña",
        type: "text",
        text: {
          format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML,
          content: `<h1>Pokémon Mystery Dungeon para D&D 5e</h1>
            <p>Usa las reglas normales de D&D 5e para características, habilidades, CA, PG, iniciativa y salvaciones. Cada Actor añade un perfil PMD con especie, tipos, equipo, hambre, PP, amistad y fichas de aventura.</p>
            <h2>Exploración</h2><ul>
              <li>Reduce el hambre en 10 al cambiar de planta o tras una escena exigente.</li>
              <li>A hambre 0, aplica un nivel de agotamiento según las reglas de D&D 5e.</li>
              <li>Un descanso completo restaura hambre y PP; el Director puede exigir comida y un lugar seguro.</li>
            </ul>
            <h2>Movimientos Pokémon</h2><p>Créelos como conjuros o rasgos. Usa el ataque, CD, daño, alcance y actividades del objeto de D&D 5e. Gasta PP desde la ficha PMD cuando corresponda y consulta la calculadora elemental.</p>
            <h2>Caer debilitado</h2><p>Usa las salvaciones contra muerte de D&D 5e. En una mazmorra, el Director puede activar una insignia de rescate para evacuar al equipo cuando nadie pueda revivir al caído.</p>
            <h2>Rangos</h2><p>Normal, Bronce, Plata, Oro, Diamante y Gran Maestro. Otorga puntos por misiones y ajusta el acceso a encargos y recompensas.</p>`
        }
      }]
    });
  }
  const itemFolder = game.folders.find(f => f.name === "Movimientos Pokémon" && f.type === "Item")
    ?? await Folder.create({ name: "Movimientos Pokémon", type: "Item", color: "#f1b93c" });
  const examples = [
    ["Movimiento Pokémon - Plantilla de ataque", "feat", "Duplica este rasgo. Configura una actividad de ataque de D&D 5e, su alcance, daño y tipo elemental. Registra el coste de PP en la descripción."],
    ["Semilla Revivir", "consumable", "Cuando el portador cae a 0 PG, puede consumir esta semilla para recuperar PG según el criterio del Director."],
    ["Orbe de Escape", "consumable", "Permite evacuar al equipo de una Mazmorra Misteriosa salvo que una regla de la escena lo impida."]
  ];
  for (const [name, type, description] of examples) {
    if (game.items.some(i => i.name === name && i.getFlag(MODULE_ID, "starter"))) continue;
    await Item.create({
      name, type, folder: itemFolder.id,
      flags: { [MODULE_ID]: { starter: true } },
      system: { description: { value: `<p>${description}</p>` } }
    });
  }
  await game.settings.set(MODULE_ID, "starterCreated", true);
  ui.notifications.info(game.i18n.localize("PMD.SetupDone"));
}

Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "starterCreated", {
    name: "Contenido inicial creado",
    scope: "world",
    config: false,
    type: Boolean,
    default: false
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
  game.pmd = {
    open: openPanel,
    mission: generateMission,
    typeCalculator,
    createStarterContent,
    data: actorData
  };
  console.info("Pokémon Mystery Dungeon | Listo para D&D 5e.");
  if (game.user.isGM && !game.settings.get(MODULE_ID, "starterCreated")) {
    const create = await foundry.applications.api.DialogV2.confirm({
      window: { title: game.i18n.localize("PMD.Title") },
      classes: ["pmd-dialog"],
      content: `<p>El módulo está listo. ¿Quieres crear ahora la guía rápida, la plantilla de Movimiento Pokémon y los objetos iniciales?</p>`,
      yes: { label: "Crear contenido", icon: "fas fa-paw" },
      no: { label: "Más tarde" },
      rejectClose: false
    });
    if (create) await createStarterContent();
  }
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
