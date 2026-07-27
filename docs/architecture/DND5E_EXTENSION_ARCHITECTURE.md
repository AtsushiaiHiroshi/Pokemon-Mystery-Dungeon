# Arquitectura: Pokémon Mystery Dungeon como módulo de dnd5e

## Objetivo

Extender Foundry VTT 14 y dnd5e 5.3.x sin crear un sistema de juego paralelo.
Los documentos de dnd5e conservan autoridad sobre tiradas, combate, daño,
descansos, clases y progresión.

## Mapa de conceptos

| Concepto Pokémon | Representación Foundry/dnd5e |
| --- | --- |
| Personaje Pokémon | Actor `character` de dnd5e |
| Pokémon salvaje o PNJ | Actor `npc` |
| Especie o forma | Item `feat` aplicado + flags del Actor |
| Tipo elemental | Flags del Actor y del Item movimiento |
| Naturaleza | Item `feat` |
| Origen | Background de dnd5e o Item `background` disponible |
| Clase | Clase dnd5e sin sustitución |
| Movimiento | Item con una o más Activities dnd5e |
| PP | Recurso por Item movimiento |
| Habilidad de especie | Item `feat` |
| Capacidad | Item `feat` pasivo o Active Effect |
| Talento IQ | Item `feat` opcional |
| Cualidad rara | Item `feat` |
| Estado Pokémon | Active Effect + status id |
| Objeto sostenido | Item equipado con slot PMD |
| Baya/semilla/orbe/varita | Item `consumable` |
| Evolución | Aplicación que actualiza especie/forma y concede Items |
| Equipo de exploración | Journal estructurado o documento lógico en flags |
| Bolsa compartida | Actor contenedor o Journal estructurado con Items enlazados |
| Misión | Journal con datos estructurados |
| Mazmorra | Colección de Scenes, Journal y tablas |
| Rango/reputación | Datos compartidos del equipo |

## Espacios de nombres

Todos los datos propios se guardan bajo:

```text
flags.pokemon-mystery-dungeon
```

No se escriben propiedades no soportadas dentro de `actor.system` o
`item.system`. Los valores que dnd5e ya conoce —PG, CA, alcance, daño, acción,
salvación, usos y efectos— se configuran en el esquema de dnd5e y no se
duplican en flags.

## Perfil del Actor

```js
{
  schemaVersion: 1,
  enabled: true,
  identity: {
    speciesId: "",
    speciesName: "",
    form: "",
    combatTypes: ["normal"],
    lineageType: "normal",
    natureItemUuid: "",
    origin: "",
    aura: ""
  },
  evolution: {
    stage: 1,
    target: "",
    requirements: [],
    declinedMilestones: []
  },
  exploration: {
    teamUuid: "",
    hunger: { value: 100, max: 100 },
    friendship: 0,
    rescueState: "safe"
  },
  optional: {
    pokemonStats: null,
    awareness: null,
    iqEnabled: false,
    primalEnabled: false
  }
}
```

`combatTypes` responde a efectividad y STAB. `lineageType` responde a los rasgos
de tipo concedidos por PokeD&D. Esta separación resuelve el doble tipo sin
otorgar dos linajes completos.

## Movimiento

```js
{
  schemaVersion: 1,
  kind: "move",
  type: "electric",
  category: "special",
  pp: {
    value: 5,
    max: 5,
    consumeOn: "use"
  },
  stabEligible: true,
  learn: {
    level: 1,
    source: "pokeup",
    requirements: []
  },
  tags: ["ranged"],
  source: {
    document: "",
    page: null
  }
}
```

Ataque, CD, daño, alcance, objetivo, duración y efectos pertenecen a las
Activities de dnd5e. Los flags solo almacenan semántica Pokémon que dnd5e no
conoce.

## Flujo de uso de un movimiento

1. El usuario activa una Activity del Item.
2. El módulo comprueba que el Item sea movimiento y tenga PP.
3. Si no tiene PP, cancela o solicita anulación del GM.
4. Consume PP cuando dnd5e acepta el uso.
5. dnd5e realiza ataque, salvación, plantilla, daño o curación.
6. El módulo calcula STAB y efectividad según ajustes.
7. Presenta un desglose; cualquier modificación no determinista requiere
   confirmación.
8. Los efectos se aplican mediante Active Effects.

El módulo no sustituye el mensaje ni la tirada de dnd5e por una tirada propia.

## Ajustes de mundo

### Reglas esenciales

- `effectivenessProfile`: `none`, `narrative`, `pokednd`, `custom`.
- `stabProfile`: `none`, `pokednd`, `custom`.
- `ppMode`: `perMove` o `actorPool`.
- `ppConsumeOn`: `use` o `success`.
- `pokeUpMode`: `parallel` o `manual`.
- `evolutionLevels`: lista predeterminada `[7, 12]`.

### Exploración opcional

- activar hambre;
- gasto por planta, tiempo o escena;
- consecuencia al llegar a cero;
- exigir suministros durante descanso;
- activar bolsa compartida;
- regla de evacuación a 0 PG;
- rangos del equipo;
- memorias humanas;
- talentos IQ;
- Primal.

Los ajustes opcionales están desactivados hasta que el GM los configure.

## Lo que no implementará el perfil dnd5e

- reservas de d6 explosivos de Explorers;
- resolución 2d6 y éxito parcial de PMDTA;
- daño `Attack × multiplicadores - Defense`;
- Logic, Instinct y Primal como reemplazos de características;
- niveles de clase sustituidos por PokeUp;
- modo TCG de gimnasios;
- estadísticas multiplicadas por número de jugadores;
- una segunda iniciativa o economía de acciones.

Estas ideas pueden inspirar contenido, objetos, complicaciones o ajustes
opcionales, pero no reemplazan el motor.

## Migración desde 0.1.0

1. Marcar perfiles existentes con `schemaVersion: 0`.
2. Copiar especie, tipos, naturaleza, aura y origen a `identity`.
3. Copiar hambre, amistad y equipo a `exploration`.
4. Conservar PP global solo si el mundo elige `actorPool`.
5. No borrar flags antiguos hasta confirmar la migración.
6. Registrar versión y resultado por Actor.

## Pruebas de frontera

Una función nueva debe responder:

1. ¿Puede usar una Activity, prueba o documento existente?
2. ¿Mantiene válidos Actors no Pokémon?
3. ¿Puede desactivarse sin dejar datos residuales?
4. ¿Respeta permisos y propiedad de Foundry?
5. ¿Requiere sustituir una regla fundamental de dnd5e?

Si la quinta respuesta es sí, la función no pertenece al módulo.
