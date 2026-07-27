# Auditoría de fuentes para Pokémon Mystery Dungeon

> **Documento técnico.** Este archivo sirve para verificar extracción, conteos y
> procedencia. No es la guía de dirección. Para una lectura humana de las
> reglas, procedimientos, conflictos y usos en mesa, consulta
> `GUIA_INTERPRETATIVA_PARA_GM.md`.

## Propósito y método

Esta auditoría documenta las fuentes entregadas para diseñar un módulo de
Foundry VTT que funcione sobre `dnd5e`. La revisión se realiza por página y por
hoja. Para cada PDF se conserva un índice interno con número de página, método
de extracción y texto de trabajo. Las páginas sin una capa de texto fiable se
procesan mediante OCR en español e inglés. Los libros de Excel se importan
completos, se inspeccionan como valores y fórmulas y se renderizan para una
comprobación visual.

El material extraído se mantiene en `tmp/research/` y no se distribuye. Este
documento resume reglas y estructura sin reproducir los libros.

### Cobertura comprobada

- 36 PDF revisados, 802 páginas en total.
- 4 libros de Excel revisados, 5 hojas y 1.579 filas utilizadas en conjunto.
- 802 archivos de página generados y 0 errores de extracción.
- 313 páginas del Manual PokeD&D fueron procesadas íntegramente mediante OCR.
- Las únicas páginas sin texto útil son cinco páginas decorativas del documento
  de GM Binder. No contienen reglas ni tablas.
- Se hizo además una comprobación visual mediante hojas de contacto y
  renderizados de todas las hojas de cálculo.

## Biblioteca revisada

### Fuentes PokeD&D y aventura

| Documento | Páginas | Uso |
| --- | ---: | --- |
| Manual PokeD&D Modo Aventura v2 (2026) | 313 | Fuente mecánica principal para la implementación D&D |
| Resumen de funcionamiento de hoja PokeD&D | 27 | Explicación de ficha y terminología D&D |
| Hoja de personaje PokeDyD | 3 | Diseño de campos y organización de ficha |
| Crónicas de Evaloren | 27 | Estructura de aventura, PNJ y progresión por hitos |
| Gimnasios Pokémon y sus líderes | 14 | Encuentros, líderes y progresión temática |

### Sistemas Mystery Dungeon de referencia

| Documento | Páginas | Uso |
| --- | ---: | --- |
| Explorers! A PMD RPG v1.0 | 226 | Fuente PMD más amplia: exploración, equipos, mazmorras y contenido |
| Explorers! Cheat Sheet | 2 | Flujo de juego y referencia rápida |
| Explorers! Status Conditions | 2 | Taxonomía de estados |
| Explorers! Character Sheet - Form Fillable | 1 | Campos de personaje editables |
| Explorers! Character Sheet - Print Safe | 1 | Jerarquía visual de la ficha |
| Mystery Dungeon TTRPG Rulebook - GM Binder | 12 | Variante d20 breve |
| Pokérole Mystery Dungeon | 24 | Gremios, rangos, generación de mazmorras y tono |
| PMDTA Player's Guide | 50 | Sistema, creación, capacidades, habilidades y mundo |
| PMDTA Narrator's Guide | 33 | Objetos, encuentros, tesoro y herramientas del Director |
| PMDTA Optional | 14 | Kits, construcción, movimientos de estado y talentos avanzados |

Se localizaron dos copias de `Narrator's Guide.pdf`, de 33 páginas cada una.
Comparten nombre, número de páginas y estructura; ambas fueron verificadas y se
tratan como una sola fuente lógica.

### Hojas y personajes PMDTA

También se revisaron los cuatro diseños de ficha PMDTA:

- `char-sheet-fillable-blue.pdf`;
- `char-sheet-fillable-green.pdf`;
- `char-sheet-fillable-pink.pdf`;
- `char-sheet-printable.pdf`.

Son variantes cromáticas o imprimibles de una misma ficha. Confirman que el
Actor necesita nombre, especie, nivel, uno o dos tipos, habilidad, capacidades,
objeto sostenido, PG actuales y máximos, experiencia, Awareness, cinco
estadísticas Pokémon, veinte habilidades, talentos IQ, tres espacios de equipo
por localización y tres hitos de experiencia.

Se revisaron además 16 personajes de nivel 5:

| Origen | Personajes |
| --- | --- |
| Humanos transformados | April, Audrey, Bruce, Courtney, Duncan, Gray, Ken y Natalie |
| Nativos del mundo | Clay, Five, Lane, Lore, Melody, Roll, Sink y Tide |

Estas fichas demuestran combinaciones reales de especie y forma, tipos simples
y dobles, habilidades activadas por críticos o fallos, capacidades anatómicas y
de locomoción, talentos IQ, objetos sostenidos, biografía y aspiración. Por
tanto, habilidad, capacidad y talento IQ no deben reducirse a una sola cadena
de texto: requieren entidades o efectos estructurados con descripción y
automatización opcional.

## Libros de Excel

### Moves and Rare Qualities Sheet

El libro contiene dos hojas sin fórmulas:

- `Moves`, rango utilizado `B1:J538`.
- `Rare Qualities`, rango utilizado `A1:D187`.

Después de excluir filas separadoras y encabezados repetidos:

- 513 movimientos reales, después de retirar cuatro encabezados repetidos.
- 182 cualidades raras reales, después de retirar dos encabezados repetidos.
- 18 tipos elementales.
- 209 movimientos físicos.
- 153 movimientos especiales.
- 81 movimientos de estado físico.
- 70 movimientos de estado especial.

Distribución de PP:

| PP | Movimientos |
| ---: | ---: |
| 5 | 66 |
| 10 | 97 |
| 15 | 282 |
| 20 | 66 |

Distribución de potencia:

| Potencia | Movimientos |
| ---: | ---: |
| 0 | 130 |
| 1 | 58 |
| 2 | 101 |
| 3 | 112 |
| 4 | 38 |
| 5 | 28 |
| 6 | 12 |
| 7 | 25 |
| 8 | 2 |

Los niveles de movimiento se representan con una a cinco estrellas. Las
cualidades raras se concentran en nivel 3 (112), nivel 6 (61) y nivel 9 (9).

La tabla no está normalizada para una importación directa. Contiene encabezados
repetidos, filas de separación, variantes ortográficas de objetivos y valores
no numéricos en potencia. Debe limpiarse antes de crear compendios.

### Pokémon By Habitat

Se localizaron dos versiones:

- versión de 190 filas;
- versión de 192 filas.

La versión de 192 filas es la más reciente y contiene 18 especies o formas que
no aparecen en la anterior: Dipplin, Poltchageist, Sinistcha, Ursaluna
Bloodmoon, Archaludon, Walking Wake, Iron Leaves, Okidogi, Munkidori,
Fezandipiti, Ogerpon, Gouging Fire, Hydrapple, Raging Bolt, Iron Boulder,
Iron Crown, Terapagos y Pecharunt.

La implementación debe usar la versión de 192 filas y conservar múltiples
hábitats por especie.

### Pokémon Capabilities

La hoja `Capabilities`, rango `A1:AE472`, define 31 clasificaciones. Incluye:

- locomoción bípeda, cuadrúpeda, rodante, deslizante y por rebote;
- excavación, vuelo con alas, levitación, flotación y natación;
- adherencia a paredes, manos, múltiples brazos y telequinesis;
- respiración acuática, telepatía y visión especial;
- velocidad, robustez y seis categorías de tamaño;
- selección de personajes y grupos de habilidades.

La estructura es una lista por columna, no una tabla por Pokémon. Para Foundry
debe invertirse a una entidad por especie con una colección de capacidades.

## Análisis por sistema

### PokeD&D

PokeD&D conserva el núcleo de D&D:

- Fuerza, Destreza, Constitución, Inteligencia, Sabiduría y Carisma.
- Tiradas `1d20 + modificador + competencia` cuando corresponda.
- CA, iniciativa, velocidad, PG, dados de golpe, percepción pasiva y
  salvaciones contra muerte.
- Habilidades y salvaciones estándar.
- Clases, subclases, trasfondos, equipo e inventario.

Los Movimientos Pokémon se comportan como una combinación de conjuros y rasgos
de clase. Cada movimiento necesita como mínimo nombre, alcance, tiempo o tipo
de acción, Move Power o bonificador, daño, descripción, efecto adicional y
coste de PP.

El índice del manual organiza sus 313 páginas de este modo:

- páginas 4-46: reglas generales, creación, combate, objetos, exploración y
  legendarios;
- páginas 47-298: tablas PokeUp y catálogos de movimientos por tipo;
- página 299: consejos para el Director;
- página 301: bestiario;
- página 303: tablas aleatorias;
- página 306: glosario;
- página 308: builds de ejemplo;
- página 313: epílogo.

Las 18 tablas elementales empiezan en las páginas siguientes:

| Tipo | Página | Tipo | Página |
| --- | ---: | --- | ---: |
| Normal | 48 | Fuego | 64 |
| Agua | 79 | Planta | 94 |
| Eléctrico | 106 | Hielo | 119 |
| Tierra | 131 | Roca | 143 |
| Lucha | 155 | Veneno | 168 |
| Volador | 180 | Psíquico | 192 |
| Bicho | 205 | Fantasma | 217 |
| Acero | 233 | Siniestro | 250 |
| Hada | 266 | Dragón | 283 |

Las tablas PokeUp ofrecen progresión del nivel 1 al 20 por tipo elemental. Un
Pokémon de dos tipos puede elegir entre ambas tablas. Cada nivel puede otorgar
movimientos, pasivas, evolución o beneficios alternativos por no evolucionar.
El lanzamiento usa una característica principal más competencia y Move Power.
El manual define STAB como una bonificación adicional al daño y permite
combinar un movimiento con conjuros o habilidades bajo una sola resolución.

Los movimientos detallados especifican:

- alcance;
- acción, acción bonus o reacción;
- PP;
- característica de Move Power;
- dados de daño escalados por nivel;
- descripción;
- efecto adicional;
- condición de exclusividad por evolución o permanencia en forma básica.

Esta es la única fuente que coincide directamente con el requisito de usar
Foundry sobre `dnd5e`. Por ello debe gobernar la matemática del módulo.

### Explorers!

Explorers! es un sistema propio de reserva de d6, no D&D. Sus reglas no pueden
copiarse literalmente sobre dnd5e sin cambiar el balance.

Componentes principales:

- Los 6 explotan: se suman y vuelven a tirar.
- Ventaja permite repetir resultados bajos; desventaja obliga a repetir altos.
- Las pruebas combinan dado base, dados por habilidad y modificador.
- Las dificultades y grados de éxito admiten “fallar hacia delante”.
- Existen fichas de aventura para modificar resultados.
- El combate usa iniciativa, movimiento por casillas, acción y reacción.
- Los Pokémon conocen un máximo de cuatro movimientos.
- STAB, efectividad elemental, golpes críticos, objetos, estados y terreno
  forman subsistemas distintos.
- La progresión usa diez niveles, clases y especializaciones.
- Los equipos tienen rango, reputación, bolsa común, mapa y reserva.
- Las mazmorras incluyen habitaciones, pasillos, plantas, trampas, puntos de
  mazmorra, visibilidad, terreno y clima.

Contenido de campaña:

- ocho familias de clase/especialización;
- estadísticas de combate y habilidades sociales/exploratorias;
- trasfondos, motivaciones, amistad, evolución y Mega Evolución;
- rangos y recompensas de equipo;
- generación y dirección de mazmorras;
- bestiario y ejemplos de jefes;
- lista de especies, movimientos, cualidades raras, objetos y estados.

Para Foundry se reutilizan conceptos de interfaz, exploración y contenido. No se
reutiliza la reserva de d6 ni su escala de daño.

### PMDTA

PMDTA también es un sistema independiente. El Player's Guide utiliza tablas de
resultado, estadísticas Pokémon, habilidades mayores y menores, capacidades,
IQ e IQ Talents. La efectividad elemental usa multiplicadores diferentes de los
videojuegos y de Explorers.

El Narrator's Guide aporta contenido especialmente útil para automatización:

- listas de comida, semillas, orbes, varitas, equipamiento y evolución;
- economía de compra/venta y espacios de inventario;
- tabla general de encuentros;
- tablas de encuentro por bioma;
- tablas de tesoro por rareza;
- generadores de personalidad y fichas rápidas de PNJ.

El suplemento opcional añade kits iniciales, materiales y construcción, reglas
ampliadas para movimientos de estado y talentos de IQ de niveles altos.

Los Excel de hábitat y capacidades pertenecen a esta familia y son valiosos
para generación procedimental, independientemente de la matemática usada.

### Pokérole Mystery Dungeon

Pokérole trabaja con su propio sistema de éxitos y atributos. Sus aportes más
relevantes son narrativos y procedimentales:

- tensión entre Lógica, Instinto y estado Primal;
- comunidades, gremios, equipos y manadas;
- rangos Normal, Bronce, Plata, Oro y Diamante;
- misiones clasificadas por dificultad;
- generación de mazmorras mediante losetas;
- eventos periódicos, trampas, peligros, equipos enemigos y tesoro;
- reclutamiento, entrenamiento y evolución;
- hambre, entrenadores, cazadores y legendarios.

Sus maniobras y daños no deben incorporarse literalmente a dnd5e, pero el flujo
de exploración es una excelente referencia para el generador de misiones.

### Mystery Dungeon TTRPG - GM Binder

Es la referencia más breve y cercana a d20 después de PokeD&D. Usa atributos de
ataque y defensa Pokémon, competencia física/especial, Move Power, PP,
salvaciones de estado, tipos, naturaleza y combate por turnos.

Debe usarse como comprobación secundaria para nomenclatura y UX, no como fuente
de balance, porque su esquema de estadísticas no coincide completamente con
las seis características y actividades de `dnd5e`.

### Crónicas de Evaloren

La aventura está organizada en cinco actos y usa progresión por hitos. Incluye:

- CrownBerry Town y la isla de Evaloren;
- robo de un artefacto y debilitamiento del sello de Regirock;
- Gengar y subordinados como oposición;
- Groudon y Reshiram como fuerzas contrapuestas;
- aliados recurrentes;
- decisiones morales y varios desenlaces;
- recomendaciones para mesas nuevas y veteranas.

Es una prueba de aceptación para el módulo: el sistema debe permitir crear los
PNJ, encuentros, diarios, recompensas, decisiones y progresión necesarios para
dirigir esta aventura.

## Conflictos que deben resolverse

| Área | Conflicto | Decisión para el módulo |
| --- | --- | --- |
| Dados | d20, reserva de d6 y éxitos Pokérole | Usar d20 y actividades dnd5e |
| Características | Seis de D&D frente a estadísticas Pokémon | D&D como base; datos Pokémon como campos adicionales |
| Daño elemental | Multiplicadores distintos entre fuentes | Configurable; perfil D&D por defecto |
| PP | Reserva general frente a PP por movimiento | PP por movimiento, con opción simplificada |
| Movimiento | Pies, casillas y tiles con escalas distintas | Pies de dnd5e; conversión visible a casillas |
| Estados | Nombres y duraciones incompatibles | Catálogo PMD con efectos dnd5e explícitos |
| Niveles | 10, 50 o progresión D&D | Niveles dnd5e; tablas de desbloqueo configurables |
| Inventario | Peso, espacios y bolsa común | Inventario dnd5e más bolsa de equipo opcional |
| Evolución | Hito, nivel, objeto, amistad o entorno | Requisitos estructurados y resolución por el Director |

## Conclusión de la auditoría

El módulo no debe intentar fusionar todas las matemáticas. La arquitectura
correcta es:

1. D&D 5e y PokeD&D como motor de resolución.
2. Explorers! como referencia principal de experiencia PMD, clases de contenido
   y estructura de mazmorras.
3. PMDTA como fuente de capacidades, hábitats, objetos y generación.
4. Pokérole como fuente de gremios, rangos y eventos de exploración.
5. Crónicas de Evaloren como campaña de prueba.
