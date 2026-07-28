# Sistema Pokémon Mystery Dungeon para Foundry VTT

## Decisión de arquitectura

El proyecto deja de tratar Pokémon como una capa sobre la hoja de `dnd5e`.
La próxima versión será un **sistema de Foundry propio**, con un módulo de
contenido y herramientas opcional. D&D solo se conserva como referencia de
interfaz y de resolución de dados: d20, modificadores, ventaja/desventaja,
acciones, reacciones, tiradas enfrentadas y desglose de resultados.

El módulo actual se conserva temporalmente como puente de migración. No se
deben añadir nuevas reglas Pokémon a campos de D&D (`abilities`, `attributes`
o monedas de dnd5e); el nuevo sistema tendrá su propio modelo y su propia hoja.

## Paquetes

| Paquete | Función |
| --- | --- |
| `pokemon-mystery-dungeon` (sistema) | Reglas, actores, hoja, combate, tiradas y estados. |
| Compendios nativos del sistema | Pokémon, movimientos, habilidades HA y objetos de aventura, versionados junto al sistema. |
| `pmd-adventure-tools` (módulo opcional futuro) | Misiones, mazmorras, hambre, rescates y generadores. |

Durante la transición ambos manifiestos pueden vivir en el repositorio, pero
el mundo nuevo debe crear una partida usando el sistema Pokémon y no `dnd5e`.

## Actor Pokémon

```text
system.level
system.experience
system.speciesId / system.speciesName
system.types.primary / system.types.secondary
system.natureName / system.natureMultipliers
system.ability
system.baseStats.hp / attack / defense / specialAttack / specialDefense / speed
system.ivs.hp / attack / defense / specialAttack / specialDefense / speed
system.evs.hp / attack / defense / specialAttack / specialDefense / speed
system.combat.accuracyStage
system.combat.evasionStage
system.combat.statStages.attack / defense / specialAttack / specialDefense / speed
system.combat.priority
system.resources.pp.value / max
system.resources.hunger.value / max
system.resources.friendship.value / max
system.exhaustion
system.currency.poke
system.evolution
system.notes
```

La ficha mostrará PS, Ataque, Defensa, Ataque Especial, Defensa Especial y
Velocidad como características principales. Precisión y Evasión serán
modificadores de combate, no características base permanentes.

## Resolución de combate

1. Se elige una acción (movimiento, objeto, cambio, interacción o huida).
2. Se ordena el turno por prioridad del movimiento y después por Velocidad;
   los empates se resuelven con un dado.
3. Si el movimiento tiene precisión, se hace una tirada d20 modificada por
   precisión y evasión. Los movimientos infalibles omiten esta tirada.
4. Los movimientos físicos usan Ataque contra Defensa; los especiales usan
   Ataque Especial contra Defensa Especial.
5. Se aplica el multiplicador de tipos, STAB, críticos, estados y cambios de
   característica. El sistema muestra el desglose antes de aplicar el daño.

Los cambios de Ataque, Defensa, Ataque Especial, Defensa Especial y Velocidad
usan 13 niveles (-6 a +6): 0,25; 0,29; 0,33; 0,40; 0,50; 0,67; 1; 1,5; 2; 2,5;
3; 3,5; 4. Precisión y Evasión utilizan su tabla propia y también se limitan a
-6/+6. Estos multiplicadores se basan en la tabla de características de
WikiDex y serán configurables por el Director.

## Cálculo de estadísticas

La implementación inicial usará las ecuaciones de tercera generación en
adelante:

```text
PS = floor(((2 × Base + IV + floor(EV / 4)) × Nivel) / 100) + Nivel + 10
Otra característica = floor((floor(((2 × Base + IV + floor(EV / 4)) × Nivel) / 100) + 5) × Naturaleza)
```

La naturaleza aporta 0,9, 1,0 o 1,1 a la característica correspondiente.
El Director podrá seleccionar un perfil simplificado para campañas que no
quieran usar IV/EV.

## Datos y localización

- Movimientos: nombre latinoamericano/HA, tipo, categoría, potencia,
  precisión, PP, prioridad, efecto, retroceso y avatar.
- Habilidades: se usará la columna **Nombre (HA)** de WikiDex; el nombre ES de
  España se conservará solo como alias de búsqueda, nunca como etiqueta visible.
- Tipos: los 18 tipos actuales, con nombres latinoamericanos y tabla de
  efectividades configurable.
- Pokémon: especies y formas de generaciones 1–9, características base,
  tipos, habilidades, cadena evolutiva y avatares normales.
- Objetos: todos los objetos de la lista seleccionada excepto Poké Balls y
  variantes de captura. La divisa única será **Poké**.

## Evolución y amistad

La evolución nunca sustituirá un Actor automáticamente. Mostrará una vista
previa con cambios de especie, tipo, habilidades, movimientos y características
y pedirá confirmación al Director.

La amistad se guarda de 0 a 255, con acciones positivas y negativas registradas
en el historial. Los umbrales y requisitos (nivel, amistad, objeto, hora,
lugar, movimiento, género o intercambio) serán datos de la especie, no lógica
codificada dentro de la hoja.

## Migración

1. Exportar los flags `pokemon-mystery-dungeon.profile` de los Actors actuales.
2. Convertir especie, tipos, naturaleza, PP, hambre, amistad, agotamiento y
   Poké a los campos del nuevo Actor.
3. Convertir Items de movimiento a `type: move`, Items de objetos a `type: item`
   y eliminar referencias a actividades o monedas de dnd5e.
4. Conservar una copia de seguridad JSON antes de crear los Actors nuevos.
5. Mantener el módulo puente solo hasta que la hoja Pokémon y los compendios
   cubran el flujo completo.

## Fuentes de reglas

La nomenclatura y las tablas se contrastan con WikiDex: [características],
[movimientos], [habilidades], [tipos], [objetos], [combate Pokémon],
[evolución] y [amistad]. Los datos importados conservarán su fuente y fecha
para poder revisar cambios posteriores.

[características]: https://www.wikidex.net/wiki/Caracter%C3%ADsticas
[movimientos]: https://www.wikidex.net/wiki/Lista_de_movimientos
[habilidades]: https://www.wikidex.net/wiki/Lista_de_habilidades
[tipos]: https://www.wikidex.net/wiki/Tipo
[objetos]: https://www.wikidex.net/wiki/Lista_de_objetos
[combate Pokémon]: https://www.wikidex.net/wiki/Combate_Pok%C3%A9mon
[evolución]: https://www.wikidex.net/wiki/Evoluci%C3%B3n
[amistad]: https://www.wikidex.net/wiki/Amistad
