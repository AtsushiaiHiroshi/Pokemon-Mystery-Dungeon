# Base de reglas Pokémon para el sistema

Esta base usa la localización latinoamericana/HA visible en WikiDex y separa
las reglas del videojuego de la forma en que Foundry resuelve dados.

## Características

WikiDex separa PS, Ataque, Defensa, Ataque Especial, Defensa Especial y
Velocidad. Precisión y Evasión solo se modifican durante el combate. Los cinco
stats de combate (excepto PS) tienen 13 niveles de modificación de -6 a +6;
Precisión y Evasión usan su propia tabla de multiplicadores.

Fuente: [Características en WikiDex](https://www.wikidex.net/wiki/Caracter%C3%ADsticas).

## Movimientos

La lista consultada contiene 935 movimientos hasta la novena generación e
incluye tipo, clase, potencia, precisión y PP. El importador debe conservar
como campos separados potencia, precisión, PP, prioridad, categoría y efectos.
El nombre visible será el latinoamericano; los nombres de España e inglés solo
serán alias de búsqueda.

Fuente: [Lista de movimientos](https://www.wikidex.net/wiki/Lista_de_movimientos).

## Habilidades

La lista contiene 316 habilidades hasta la novena generación. WikiDex publica
columnas distintas para `Nombre (ES)` y `Nombre (HA)`; el sistema usará
`Nombre (HA)` como nombre visible y guardará ES/inglés como alias.

Fuente: [Lista de habilidades](https://www.wikidex.net/wiki/Lista_de_habilidades).

## Tipos

Se usarán los 18 tipos principales actuales: Normal, Fuego, Agua, Eléctrico,
Planta, Hielo, Lucha, Veneno, Tierra, Volador, Psíquico, Bicho, Roca,
Fantasma, Dragón, Siniestro, Acero y Hada. El tipo Astral queda como forma
especial configurable, no como tipo base del actor.

Fuente: [Tipo](https://www.wikidex.net/wiki/Tipo).

## Objetos y economía

Se importarán objetos de aventura, medicina, bayas, semillas, orbes, varitas,
objetos arrojables, evolución y equipamiento. Se excluyen Poké Balls y todas
sus variantes de captura porque este mundo no tiene humanos ni tecnología de
captura. La moneda del sistema será únicamente `Poké`.

Fuente: [Lista de objetos](https://www.wikidex.net/wiki/Lista_de_objetos).

## Combate, evolución y amistad

- El turno se ordena por prioridad y Velocidad.
- Los movimientos físicos usan Ataque contra Defensa; los especiales, Ataque
  Especial contra Defensa Especial.
- La evolución será confirmada por el Director y podrá depender de nivel,
  objeto, amistad, hora, lugar, movimiento, forma o género.
- La amistad se guardará en una escala de 0 a 255 y se usará como dato para
  evolución y efectos narrativos.

Fuentes: [Combate Pokémon](https://www.wikidex.net/wiki/Combate_Pok%C3%A9mon),
[Evolución](https://www.wikidex.net/wiki/Evoluci%C3%B3n) y
[Amistad](https://www.wikidex.net/wiki/Amistad).
