import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "data");
const WIKI = "https://www.wikidex.net";

// WikiDex suele publicar primero el nombre de España.  El módulo usa la
// localización del doblaje latino de la serie y de los juegos de Pokémon.
const LATAM_MOVE_NAMES = {
  "A Bocajarro": "Combate Cercano",
  "Ascuas": "Brasas",
  "Ataque Rápido": "Ataque Rápido",
  "Pistola Agua": "Pistola de Agua",
  "Psicocorte": "Psicocorte"
};

const LATAM_TYPE_NAMES = {
  pelea: "lucha",
  "físico": "físico",
  "especial": "especial",
  estado: "estado"
};

function latamName(name) {
  const cleanName = String(name ?? "").trim();
  if (/^Aparato\s+/i.test(cleanName)) return cleanName.replace(/^Aparato/i, "Esfera");
  return LATAM_MOVE_NAMES[cleanName] ?? cleanName;
}

function latamDescription(description, englishName = "") {
  if (englishName === "Close Combat") {
    return "Ataca ferozmente al objetivo sin protegerse; después de usarlo, el usuario reduce temporalmente su Ataque y Defensa durante el combate.";
  }
  return String(description ?? "")
    .replace(/usuario/gi, "usuario")
    .replace(/Pokémon de tipo pelea/gi, "Pokémon de tipo Lucha");
}

function clean(html) {
  return html
    .replace(/<br\s*\/?>/gi, " / ")
    .replace(/<sup[\s\S]*?<\/sup>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

function cells(row) {
  return [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(match => match[1]);
}

function imageFromCell(cell) {
  const source = cell.match(/<img[^>]+(?:data-src|src)=["']([^"']+)["']/i)?.[1] ?? null;
  if (!source) return null;
  return source.startsWith("//") ? `https:${source}` : source;
}

function spanishName(cell) {
  const latino = cell.match(/<span[^>]*lang="(?:es-LA|es-419)"[^>]*>([\s\S]*?)<\/span>/i);
  if (latino) return latamName(clean(latino[1]));
  const castellano = cell.match(/<span[^>]*lang="es-ES"[^>]*>([\s\S]*?)<\/span>/i);
  if (castellano) return latamName(clean(castellano[1]));
  const links = [...cell.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)].map(m => clean(m[1])).filter(Boolean);
  return latamName(links[0] ?? clean(cell).split(" / ")[0]);
}

function typeFromCell(cell) {
  const match = cell.match(/title="Tipo ([^"]+)"/i);
  return match ? match[1].toLowerCase().replace("tipo ", "") : "normal";
}

function categoryFromCell(cell) {
  const match = cell.match(/alt="Clase ([^"]+)"/i);
  return (match?.[1] ?? "estado").toLowerCase();
}

function numberOrNull(value) {
  const number = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(number) && String(value).match(/\d/) ? number : null;
}

function parseMoveTable(html) {
  const start = html.indexOf('class="tabpokemon sortable tablemanager"');
  const table = html.slice(start, html.indexOf("</table>", start));
  const moves = [];
  for (const row of table.matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
    const data = cells(row[0]);
    if (data.length < 9 || !/^\d{4}/.test(clean(data[0]))) continue;
    const description = clean(data[3]);
    const priority = /prioridad (?:alta|positiva)/i.test(description) ? 1 : /prioridad (?:baja|negativa)/i.test(description) ? -1 : 0;
    const selfDamage = /(hiere|lesiona|daño de retroceso|retroceso).*\b(usuario|usador)\b/i.test(description);
    const power = numberOrNull(clean(data[6]));
    moves.push({
      index: Number(clean(data[0])),
      name: spanishName(data[1]),
      // La tabla no muestra un icono individual junto al nombre; usamos el icono
      // oficial del tipo (y, si falta, el de la clase) como avatar del movimiento.
      img: imageFromCell(data[1]) ?? imageFromCell(data[4]) ?? imageFromCell(data[5]),
      englishName: clean(data[1]).split(" / ").at(-1),
      generation: Number(data[2].match(/alt="(\d+)"/i)?.[1] ?? clean(data[2]).match(/\d+/)?.[0] ?? 0),
      description: latamDescription(description, clean(data[1]).split(" / ").at(-1)),
      type: LATAM_TYPE_NAMES[typeFromCell(data[4])] ?? typeFromCell(data[4]),
      category: categoryFromCell(data[5]),
      power,
      accuracy: numberOrNull(clean(data[7])),
      pp: numberOrNull(clean(data[8])),
      priority,
      selfDamage,
      source: "WikiDex — Lista de movimientos"
    });
  }
  return moves;
}

function parseAbilityTable(html) {
  const start = html.indexOf('class="tabpokemon sortable tablemanager"');
  const table = html.slice(start, html.indexOf("</table>", start));
  const abilities = [];
  for (const row of table.matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
    const data = cells(row[0]);
    if (data.length < 6 || !/^\d{3}|^-/.test(clean(data[0]))) continue;
    const generation = Number(data[4].match(/alt="(\d+)"/i)?.[1] ?? clean(data[4]).match(/\d+/)?.[0] ?? 0);
    const englishName = clean(data[3]);
    abilities.push({
      index: Number(clean(data[0])) || 0,
      nameES: spanishName(data[1]),
      nameHA: clean(data[2]),
      englishName,
      generation,
      description: clean(data[5]),
      source: "WikiDex — Lista de habilidades"
    });
  }
  return abilities;
}

function parsePokemonTable(html, marker) {
  const markerIndex = html.indexOf(`class="mw-headline" ${marker}`) >= 0
    ? html.indexOf(`class="mw-headline" ${marker}`)
    : html.indexOf(marker);
  if (markerIndex < 0) return [];
  const tail = html.slice(markerIndex);
  const tableStart = tail.indexOf("<table");
  if (tableStart < 0) return [];
  const table = tail.slice(tableStart, tail.indexOf("</table>", tableStart));
  const result = [];
  for (const row of table.matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
    const names = [...row[0].matchAll(/<a[^>]*title="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(match => clean(match[2]) || match[1])
      .filter(name => /^[A-ZÁÉÍÓÚÑ][A-Za-zÁÉÍÓÚÑáéíóúñ'’.-]+$/.test(name) && !/^Archivo|Tipo |Generación|Naturaleza|Sexo/i.test(name));
    const name = names.find(candidate => !/Tipo |Generación|Naturaleza|Sexo/i.test(candidate));
    if (!name || result.includes(name)) continue;
    const types = [...row[0].matchAll(/title="Tipo ([^"]+)"/gi)].map(match => match[1].toLowerCase());
    result.push({ name, types, source: "WikiDex — saga Pokémon Mundo misterioso" });
  }
  return result;
}

function parseObjectTables(html) {
  const objects = [];
  for (const tableMatch of html.matchAll(/<table[^>]*tablaobjeto[^>]*>[\s\S]*?<\/table>/gi)) {
    for (const row of tableMatch[0].matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
      const cells = [...row[0].matchAll(/<(?:th|td)[^>]*>([\s\S]*?)<\/(?:th|td)>/gi)].map(match => match[1]);
      if (cells.length < 4) continue;
      const name = latamName(clean(cells[0]).split("(")[0].replace(/\s*\/\s*$/, "").trim());
      if (!name || /^Objeto$/i.test(name) || objects.some(object => object.name === name)) continue;
      objects.push({
        name,
        img: imageFromCell(cells[0]),
        englishName: clean(cells[0].match(/<i>([\s\S]*?)<\/i>/i)?.[1] ?? ""),
        price: clean(cells[1]),
        locations: clean(cells[2]),
        description: clean(cells[3]),
        affects: clean(cells[4] ?? ""),
        source: "WikiDex — Lista de objetos de Pokémon Mundo misterioso"
      });
    }
  }
  return objects;
}

const moveHTML = await (await fetch(`${WIKI}/wiki/Lista_de_movimientos`)).text();
const moves = parseMoveTable(moveHTML);
for (const move of moves) {
  // Terminología solicitada para el doblaje de la serie; se conserva el nombre WikiDex como alias.
  if (move.englishName === "Close Combat") {
    move.aliases = [move.name, "A Bocajarro", "Cuerpo a Cuerpo"];
    move.name = "Combate Cercano";
  } else if (move.name === "Ascuas") {
    move.aliases = ["Ascuas"];
    move.name = "Brasas";
  }
}
const abilityHTML = await (await fetch(`${WIKI}/wiki/Lista_de_habilidades`)).text();
const abilities = parseAbilityTable(abilityHTML)
  .filter(ability => ability.nameHA !== "—" && ability.englishName !== "—");
const objectHTML = await (await fetch(`${WIKI}/wiki/Lista_de_objetos_de_Pok%C3%A9mon_Mundo_misterioso`)).text();
const objects = parseObjectTables(objectHTML);
const games = [
  ["Equipo de rescate rojo y azul", "/wiki/Pok%C3%A9mon_Mundo_misterioso:_Equipo_de_rescate_rojo_y_Equipo_de_rescate_azul", ["id=\"¿Qué_Pokémon_eres?\"", "id=\"Introducción\""]],
  ["Exploradores del tiempo y oscuridad", "/wiki/Pok%C3%A9mon_Mundo_misterioso:_Exploradores_del_tiempo_y_Exploradores_de_la_oscuridad", ["id=\"¿Qué_Pokémon_eres?\"", "id=\"Introducción\""]],
  ["Exploradores del cielo", "/wiki/Pok%C3%A9mon_Mundo_misterioso:_Exploradores_del_cielo", ["id=\"¿Qué_Pokémon_eres?\"", "id=\"Introducción\""]],
  ["Portales al infinito", "/wiki/Pok%C3%A9mon_Mundo_misterioso:_Portales_al_infinito", ["id=\"Pokémon_jugables\"", "id=\"Pokémon\""]],
  ["Mundo megamisterioso", "/wiki/Pok%C3%A9mon_Mundo_megamisterioso", ["id=\"Pokémon_protagonista\"", "id=\"Pokémon\""]],
  ["Equipo de rescate DX", "/wiki/Pok%C3%A9mon_Mundo_misterioso:_equipo_de_rescate_DX", ["id=\"Pokémon_jugables\"", "id=\"Personajes\""]]
];
const starters = {};
for (const [game, url, markers] of games) {
  const html = await (await fetch(`${WIKI}${url}`)).text();
  starters[game] = parsePokemonTable(html, markers[0]);
  if (!starters[game].length) starters[game] = parsePokemonTable(html, markers[1]);
}

// Estas dos entregas permiten elegir manualmente y no muestran una tabla de test en el artículo.
starters["Portales al infinito"] = ["Pikachu", "Snivy", "Tepig", "Oshawott", "Axew"].map(name => ({ name, types: [], source: "WikiDex — Portales al infinito" }));
// Cielo reutiliza los 16 de rescate y añade cinco opciones.
if (!starters["Exploradores del cielo"].length) {
  const previous = starters["Exploradores del tiempo y oscuridad"];
  starters["Exploradores del cielo"] = [...previous, "Vulpix", "Riolu", "Phanpy", "Eevee", "Shinx"].map(entry =>
    typeof entry === "string" ? { name: entry, types: [], source: "WikiDex — Exploradores del cielo" } : entry
  );
}
// Mega Misterioso presenta sus opciones en una galería con encabezados <th>.
{
  const megaHTML = await (await fetch(`${WIKI}/wiki/Pok%C3%A9mon_Mundo_megamisterioso`)).text();
  const marker = megaHTML.indexOf('class="mw-headline" id="Pokémon_protagonista"');
  const tail = megaHTML.slice(marker);
  const table = tail.slice(tail.indexOf("<table"), tail.indexOf("</table>", tail.indexOf("<table")));
  const names = [...table.matchAll(/<th[^>]*>[\s\S]*?<a[^>]*title="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(match => clean(match[2]) || match[1]).filter(Boolean);
  if (names.length) starters["Mundo megamisterioso"] = [...new Set(names)].map(name => ({ name, types: [], source: "WikiDex — Mundo megamisterioso" }));
}
if (starters["Equipo de rescate DX"].length <= 1) {
  starters["Equipo de rescate DX"] = starters["Equipo de rescate rojo y azul"].map(entry => ({ ...entry, source: "WikiDex — Equipo de rescate DX" }));
}
// Boukendan no usa test de personalidad: ofrece nueve iniciales según la edición.
const boukendan = {
  "Boukendan — Escuadrón Llama": ["Charmander", "Cyndaquil", "Torchic", "Chimchar", "Vulpix", "Growlithe", "Eevee", "Teddiursa", "Buneary"],
  "Boukendan — Escuadrón Tormenta": ["Squirtle", "Totodile", "Mudkip", "Piplup", "Wooper", "Azurill", "Phanpy", "Riolu", "Wynaut"],
  "Boukendan — Escuadrón Luz": ["Pichu", "Pikachu", "Shinx", "Pachirisu", "Elekid", "Mareep", "Psyduck", "Togepi", "Meowth"]
};
for (const [game, names] of Object.entries(boukendan)) {
  starters[game] = names.map(name => ({ name, types: [], source: "WikiDex — Pokémon Fushigi no Dungeon: Boukendan" }));
}

await mkdir(OUT, { recursive: true });
await writeFile(path.join(OUT, "wikidex-moves.json"), JSON.stringify(moves, null, 2));
await writeFile(path.join(OUT, "wikidex-abilities.json"), JSON.stringify(abilities, null, 2));
await writeFile(path.join(OUT, "wikidex-items.json"), JSON.stringify(objects, null, 2));
await writeFile(path.join(OUT, "wikidex-starters.json"), JSON.stringify(starters, null, 2));
console.log(`WikiDex: ${moves.length} movimientos; ${abilities.length} habilidades HA; ${objects.length} objetos PMD; ${Object.values(starters).flat().length} Pokémon iniciales/seleccionables.`);
