# Guía interpretativa para dirigir Pokémon Mystery Dungeon en D&D 5e

## Qué es este documento

Esta guía no es un inventario de archivos. Explica qué experiencia propone cada
manual, cómo usarla en mesa, dónde se encuentran las reglas y qué decisiones
debe tomar el GM antes de automatizarlas en Foundry.

La biblioteca no forma un único sistema coherente. Contiene cuatro juegos
distintos:

1. **PokeD&D Modo Aventura**, construido directamente sobre D&D 5e.
2. **Explorers!**, un juego independiente de reservas de d6.
3. **Pokémon Mystery Dungeon Tabletop Adventures (PMDTA)**, basado en 2d6,
   estadísticas Pokémon e hitos de experiencia.
4. **Pokérole Mystery Dungeon**, suplemento de Pokérole centrado en la tensión
   entre mente humana e instinto Pokémon.

Para el módulo solicitado, D&D 5e es el motor. Los otros libros sirven para
construir la experiencia de Mystery Dungeon: gremios, equipos, misiones,
mazmorras cambiantes, bolsa compartida, hambre, comunidad y tono.

## Decisión de diseño recomendada

El GM debería poder describir su campaña así:

> Los jugadores son Pokémon con clase, características y actividades de D&D 5e.
> Forman un equipo de exploración, aceptan misiones, viajan a mazmorras
> misteriosas, administran suministros, rescatan habitantes y descubren una
> amenaza que altera el mundo.

Esto implica la siguiente jerarquía:

| Pregunta | Fuente principal | Fuente de apoyo |
| --- | --- | --- |
| ¿Cómo se hace una prueba o salvación? | D&D 5e | PokeD&D pp. 4-6 |
| ¿Cómo funciona un Actor jugador? | D&D 5e + PokeD&D pp. 6-29 | Fichas PMDTA y Explorers |
| ¿Cómo funciona un movimiento? | PokeD&D pp. 24-26 y tablas pp. 47-298 | Explorers pp. 48-50 |
| ¿Cómo funciona un combate? | D&D 5e + PokeD&D pp. 32-34 | Explorers pp. 14-18 |
| ¿Cómo se organiza una campaña PMD? | Explorers pp. 58-84 | Pokérole pp. 7-19 |
| ¿Cómo se genera una mazmorra? | Explorers pp. 75-81 | PMDTA pp. 3-4 y Pokérole pp. 9-17 |
| ¿Qué Pokémon aparecen en un bioma? | Excel PMDTA de hábitats | mapas de biomas |
| ¿Cómo se prepara una aventura? | Crónicas de Evaloren | guía de GM de Explorers |

## La experiencia de juego, explicada al GM

### El ciclo de una sesión

Explorers propone el ciclo más claro en sus páginas 71-72. Adaptado a D&D:

1. **Preparación y riesgo.** Presenta una solicitud concreta, su cliente, la
   recompensa y qué ocurrirá si nadie actúa.
2. **Viaje.** Haz una o dos escenas que establezcan el bioma, consuman tiempo o
   revelen información. No conviertas cada kilómetro en una tirada.
3. **Entrada a la mazmorra.** Explica la anomalía del lugar: clima imposible,
   arquitectura cambiante, pérdida de orientación o Pokémon ferales.
4. **Exploración por plantas.** Alterna elección de ruta, peligro, descubrimiento
   y encuentro. Cada planta debe cambiar la situación.
5. **Escalada.** Introduce una complicación que transforme la misión: el objetivo
   se mueve, aparece un rival, el cliente ocultó información o la mazmorra se
   desestabiliza.
6. **Resolución.** El objetivo no siempre es derrotar a alguien. Puede ser
   rescatar, escoltar, recuperar, negociar, sobrevivir o cerrar una anomalía.
7. **Regreso.** Entrega recompensa, reputación, noticias y consecuencias. Deja
   visible una nueva oportunidad o amenaza.

Este ciclo es mejor para Foundry que una sucesión de combates. El módulo debe
ayudar al GM a preparar y mostrar cada etapa.

### Qué hace que una mazmorra sea “Mystery Dungeon”

Según Explorers pp. 12-13 y 75-81, PMDTA pp. 3-4 y Pokérole pp. 9-17, una
mazmorra no es solamente un mapa:

- está dividida en plantas;
- cambia de distribución o comportamiento;
- tiene habitaciones y pasillos con decisiones de ruta;
- limita visibilidad e información;
- contiene terreno, clima, trampas y objetos;
- atrae o altera a Pokémon salvajes;
- ejerce presión para avanzar;
- tiene escaleras, salida o condición especial de escape;
- puede expulsar, separar o rescatar a quien cae;
- guarda un objetivo distinto del mero exterminio.

#### Procedimiento recomendado por planta

1. Revela la entrada y dos rasgos sensoriales.
2. Define el reloj de presión: turnos de exploración, encuentros o inestabilidad.
3. Presenta al menos dos rutas o prioridades.
4. Coloca una señal antes de cada peligro serio.
5. Incluye una interacción no bélica: objeto, huella, criatura neutral, mecanismo
   o pista.
6. Resuelve como máximo un encuentro principal por planta, salvo que la misión
   sea deliberadamente extenuante.
7. Al encontrar la salida, permite decidir entre avanzar o seguir buscando.
8. Registra tiempo, suministros, PP y efectos que duren hasta abandonar la
   mazmorra.

Explorers usa fichas de mazmorra para que el GM introduzca habitaciones,
conexiones o complicaciones sin depender por completo del azar (pp. 75-77).
Pokérole usa losetas y secuencias de eventos (pp. 9-17). En Foundry, ambas ideas
se traducen mejor a un generador asistido: propone una planta, pero el GM la
confirma y puede mover o sustituir cada elemento.

### Diseño de misiones

Explorers pp. 60-63 diferencia rescate, solicitud de objeto, captura de
forajidos y otros encargos. PMDTA incluye tablas de trabajos en su Narrator's
Guide pp. 30-33. Pokérole añade rango y dificultad en pp. 7-9.

Una misión completa necesita:

- **cliente:** quién pide ayuda y por qué no puede resolverlo;
- **objetivo visible:** rescatar, recuperar, escoltar, investigar o detener;
- **lugar:** bioma, mazmorra y número aproximado de plantas;
- **riesgo:** qué amenaza al equipo;
- **reloj:** qué empeora si tardan;
- **verdad oculta:** información que cambia la interpretación;
- **recompensa:** dinero, objetos, reputación, acceso o relación;
- **consecuencia:** qué cambia aunque los personajes fracasen.

El generador del manual PokeD&D pp. 303-306 solo combina objetivo, ubicación y
antagonista. Sirve como chispa, pero no produce por sí solo una aventura
dirigible. Foundry debe pedir también cliente, riesgo, reloj, giro y
consecuencia.

## Preparación de campaña

### Sesión cero

Explorers pp. 68-70 recomienda acordar el mundo y el tono. Pokérole pp. 3-5
demuestra que “humano transformado” puede implicar pérdida de identidad,
feralidad y terror. PMDTA pp. 11-12 ofrece siete explicaciones diferentes para
la presencia de humanos transformados. Antes de crear personajes, el GM debe
resolver:

- ¿Todos eran Pokémon, todos eran humanos o hay una mezcla?
- ¿Los humanos conservan recuerdos?
- ¿Existen humanos o entrenadores en el mundo actual?
- ¿Los Pokémon salvajes son ciudadanos, animales, ferales o víctimas de la
  mazmorra?
- ¿Qué ocurre al quedar a 0 PG dentro de una mazmorra?
- ¿La evolución cambia personalidad, tamaño o capacidades?
- ¿Qué grado de hambre, pérdida de memoria, corrupción y horror acepta la mesa?
- ¿Qué contenidos necesitan líneas, velos o una pausa inmediata?

PokeD&D presupone un mundo sin entrenadores (pp. 299-301), pero también permite
ubicar la campaña en regiones Pokémon o escenarios de D&D (p. 44). Esta
contradicción no necesita una regla universal: necesita una configuración de
mundo y una respuesta visible en la guía de campaña.

### Construcción del mundo

Explorers pp. 69-70 recomienda empezar por lo que la cámara puede ver:

1. una comunidad base;
2. un gremio o autoridad;
3. dos facciones;
4. tres mazmorras cercanas;
5. un problema inmediato;
6. una amenaza que crecerá con los niveles.

El mapa PMDTA muestra cinco grandes continentes —Mist, Water, Air, Sand y
Grass—, numerosas islas, asentamientos, montañas y torres. La versión de biomas
añade praderas, bosques, desiertos, tundra, páramos, zonas tropicales, pantanos,
aguas tormentosas y mares casi infranqueables. Su propósito práctico es:

- limitar qué especies propone el generador;
- justificar rutas, suministros y medios de transporte;
- crear fronteras naturales entre arcos;
- situar torres y lugares legendarios como objetivos de alto rango.

No es un mapa táctico. Debe importarse como mapa de navegación o Scene sin
cuadrícula, con notas y enlaces a regiones.

## Personajes

### Creación con PokeD&D

PokeD&D pp. 26-30 propone este orden:

1. especie y uno o dos tipos;
2. naturaleza;
3. clase de D&D;
4. seis características de D&D;
5. rasgos de un tipo;
6. movimiento inicial;
7. origen equivalente a trasfondo;
8. equipo;
9. historia y personalidad.

La especie tiene valor narrativo, pero el manual no proporciona un bloque
racial individual para cada Pokémon. Mecánicamente, la identidad proviene del
tipo elegido, naturaleza, clase y movimientos. El módulo no debe inventar
bonificadores raciales de especie donde el libro no los define.

### Tipos como linajes

PokeD&D pp. 16-19 concede un rasgo mayor y uno menor por tipo. Algunos ejemplos
relevantes para el GM:

- Fuego y Eléctrico reciben resistencia elemental y utilidad ambiental.
- Agua obtiene nado y respiración limitada.
- Planta reduce necesidades de alimento y resiste veneno.
- Tierra recibe resistencia eléctrica y tremorsentido corto.
- Bicho obtiene trepar.
- Fantasma puede cruzar barreras delgadas.
- Psíquico usa telepatía.
- Acero tiene armadura natural.
- Normal gana PG y una bonificación flexible.

Los dobles tipos siguen contando como ambos para interacciones, pero el jugador
elige solo uno para los rasgos de linaje (pp. 27-28). Foundry debe distinguir
`tipos de combate` de `tipo que concede rasgos`.

### Naturalezas

Las 25 naturalezas de PokeD&D pp. 12-16 sustituyen bonificadores raciales:

- +2 a una característica y +1 a otra;
- velocidad entre 25 y 35 pies;
- un rasgo defensivo, ofensivo, móvil o social.

No deben duplicarse con los aumentos de característica de reglas modernas de
D&D si la mesa ya los aplica desde trasfondo u otra fuente. El asistente de
creación debe advertir sobre el origen de cada aumento.

### La ficha PMDTA como referencia de experiencia

Los cuatro PDF de colores y el DOCX de personaje confirman los siguientes
campos:

- nombre, nivel, especie y tipos;
- habilidad y capacidades con descripción;
- PG actuales y máximos;
- Attack, Sp. Atk, Defense, Sp. Def y Speed;
- Awareness y dieciocho habilidades adicionales;
- objeto sostenido;
- equipo de cabeza, cuello y cinturón;
- talentos IQ básicos, intermedios, avanzados y maestros;
- personalidad, pasado, aspiración y defectos;
- siete hitos narrativos; cuatro marcas permiten subir de nivel.

En un módulo de D&D, las cinco estadísticas Pokémon no deben sustituir Fuerza,
Destreza, Constitución, Inteligencia, Sabiduría y Carisma. Pueden aparecer como
un panel opcional para contenido PMDTA importado o como metadatos de especie.

Las dieciséis fichas pregeneradas muestran que habilidad, capacidad y talento IQ
son conceptos diferentes:

- la **habilidad** reacciona a un evento o modifica una regla;
- la **capacidad** describe anatomía, sentidos o locomoción;
- el **talento IQ** concede una especialidad de exploración, objetos o combate.

Por eso no deben guardarse en un único campo de notas.

### La ficha PokeD&D

La hoja PokeD&D ocupa tres páginas:

- la primera conserva el núcleo dnd5e: seis características, habilidades,
  salvaciones, CA, iniciativa, velocidad, PG, dados de golpe, percepción
  pasiva, ataques, inventario, alineamiento y salvaciones de muerte;
- la segunda concentra apariencia, rasgos, atributos y movimientos Pokémon;
- la tercera mantiene conjuros, característica de lanzamiento, CD, ataque de
  conjuro y espacios por nivel.

El `Resumen de funcionamiento de hoja` explica cada zona en pp. 2-26. Es una
guía introductoria de D&D, no un segundo reglamento. Confirma que los
movimientos necesitan nombre, alcance, tiempo, Move Power, daño, descripción y
efecto adicional (pp. 25-26).

El resumen contiene una diferencia respecto a las reglas actuales habituales:
en p. 9 indica que tres éxitos de salvación de muerte devuelven al personaje con
1 PG. En D&D 5e tradicional, tres éxitos estabilizan. El módulo debe seguir la
versión de dnd5e instalada salvo que el GM active expresamente esta variante.

## Progresión y evolución

### Problema central de PokeD&D

PokeD&D mantiene niveles 1-20 de D&D, pero desde nivel 5 permite elegir entre la
mejora de clase y una mejora PokeUp (pp. 22-24). Interpretado literalmente, un
personaje puede perder Ataque Extra, espacios de conjuro y rasgos que el sistema
dnd5e espera por nivel. Los ejemplos de pp. 308-312 incluso presentan PokeUp en
niveles anteriores y sitúan la primera elección en nivel 4.

Para una campaña estable se recomienda:

- **no sustituir niveles de clase;**
- entregar PokeUp en niveles o hitos definidos como progresión paralela;
- mantener el avance normal de dnd5e;
- registrar PokeUp como `feat` o recompensa de hito.

El GM puede usar otra interpretación, pero Foundry no debe borrar ni saltar
automáticamente avances de clase.

### Evolución

PokeD&D sitúa evoluciones en niveles 7 y 12 (pp. 21-22). Requiere:

- nivel;
- misión o prueba narrativa;
- catalizador, lazo, entrenamiento o bendición;
- consentimiento del jugador.

No evolucionar concede un beneficio alternativo. Explorers pp. 54-56 amplía los
requisitos: hora, región, género, personalidad, amistad, movimiento u objeto.
El mejor modelo para Foundry es una lista configurable de requisitos y una vista
previa, nunca una sustitución automática del Actor.

## Movimientos Pokémon

### Qué contienen

PokeD&D dedica pp. 47-298 a progresiones y movimientos de los 18 tipos. Cada
movimiento puede incluir:

- tipo;
- acción, acción bonus o reacción;
- alcance;
- PP;
- característica de Move Power;
- ataque o salvación;
- daño escalado;
- condición o efecto secundario;
- recarga;
- requisito de evolución o permanencia en forma básica.

Explorers pp. 48-50 añade una taxonomía útil de objetivos y familias:
multigolpe, mordida, sonido, danza, polvo, pulso, puño, corte, viento,
explosión y proyectiles. El Excel contiene 513 movimientos ya separados por
tipo, categoría, PP, potencia, alcance, objetivo, nivel y descripción.

### Cómo debe resolverlos el GM

Un movimiento debe convertirse en una actividad dnd5e con una resolución
principal:

- ataque contra CA;
- salvación contra CD;
- curación;
- utilidad sin tirada;
- efecto aplicado a una plantilla o conjunto de objetivos.

Move Power está descrito de manera ambigua: PokeD&D p. 25 dice que se suma
además de la característica principal y competencia. Antes de importarlo en
masa debe definirse si es:

- una característica;
- un bonificador fijo;
- una escala de potencia;
- o metadato sin aplicación automática.

### STAB y efectividad

PokeD&D p. 26 presenta STAB como competencia y característica principal
añadidas al daño. PMDTA usa multiplicadores de 1.5, 0.75, 0.5 y 0. Explorers
usa su propia escala. Estas fórmulas no pueden coexistir en un mismo ataque.

Recomendación para D&D:

- STAB como bono opcional y visible, no oculto;
- efectividad como perfil configurable;
- desglose completo en chat;
- confirmación del GM antes de modificar daño;
- no aplicar multiplicadores PMDTA por defecto a números de dnd5e.

### Combos

PokeD&D pp. 30-32 permite unir movimiento y conjuro o rasgo de clase en una sola
acción, sumar ambos daños y conservar ambos efectos. Esta regla puede duplicar
la economía de acciones, STAB, Ataque Furtivo, Smite y efectos de control.

Debe tratarse como regla opcional con una de estas salvaguardas:

- una vez por descanso o mediante inspiración;
- uno de los componentes solo aporta tipo y descripción;
- daño completo de una fuente y dado reducido de la otra;
- creación previa de combos aprobados por el GM.

Foundry no debe permitir combinaciones arbitrarias automáticas.

## Combate

PokeD&D pp. 32-34 conserva iniciativa, movimiento, acción, acción bonus y
reacción de D&D. Los movimientos gastan PP. Un descanso corto recupera PP igual
al modificador de Constitución, mínimo uno; un descanso largo restaura todos.

### Estados

PokeD&D p. 34 adapta quemadura, parálisis, congelación, veneno y confusión.
Explorers pp. 161-162 y el PDF `Status Conditions` amplían el catálogo con
estados de control, alteraciones de estadísticas y duraciones. PMDTA pp. 8-10
usa todavía otra escala.

Cada estado de Foundry necesita:

- momento de aplicación;
- duración y unidad;
- tirada para evitarlo o terminarlo;
- efecto sobre movimiento, tiradas, acciones o daño;
- inmunidades;
- fuente y responsable de concentración, si aplica;
- eliminación reversible.

No basta con un icono.

### Encuentros

Explorers pp. 82-91 ofrece la mejor orientación:

- PNJ amistosos necesitan deseo, obstáculo y rasgo memorable;
- enemigos normales pueden usar modificadores y pocas habilidades;
- jefes deben cambiar el problema, no solo aumentar PG;
- escalar por nivel y tamaño del equipo;
- variar funciones y movimientos.

El Narrator's Guide de PMDTA p. 1 recomienda enemigos fuertes singulares antes
que grandes multitudes, porque el Narrador no debe ocupar más tiempo de turno
que todos los jugadores. Es un consejo especialmente útil en Foundry.

Para jefes, PokeD&D pp. 45-46 y 299-300 recomienda acciones legendarias,
acciones de guarida y condiciones de victoria alternativas. Una plantilla de
jefe debe incluir:

- dos o tres fases;
- acción fuera de turno;
- cambio de terreno;
- objetivo alternativo;
- reacción a una decisión de los jugadores;
- retirada, rendición, purificación o sellado.

## Exploración, hambre e inventario

### Viaje

PokeD&D pp. 42-44 usa velocidad en pies, terreno difícil, descanso y pruebas de
Supervivencia/Naturaleza. Surf, Fly, Flash, Strength, Cut y Teleport funcionan
como herramientas de exploración. El GM decide si requieren tirada, PP o solo
justificación narrativa.

La hoja de capacidades PMDTA enumera locomoción, anatomía, sentidos, tamaño,
telepatía, telequinesis y robustez. Estas capacidades deberían resolver
automáticamente preguntas simples —por ejemplo, poder nadar— y conceder
contexto o ventaja cuando aún exista riesgo.

### Bolsa de equipo

El DOCX `Bag Sheet` registra portador, espacios totales, espacios libres, objeto,
descripción y coste en espacios. PMDTA p. 2 distingue:

- objeto sostenido, siempre disponible;
- una prenda en cabeza, cuello y cintura;
- objetos de bolsa, utilizables solo si se tiene acceso a ella.

Explorers pp. 61 y 206-224 aporta bolsa por rango y familias completas de
objetos. El módulo necesita una bolsa compartida separada de los inventarios
dnd5e individuales, con capacidad en espacios, no en peso.

### Objetos y economía

PokeD&D pp. 35-42 adapta bayas, pociones, piedras, equipo mágico y objetos de
D&D. PMDTA Narrator's Guide pp. 2-21 contiene el catálogo más operativo:
precios de compra/venta, espacios, semillas, orbes, varitas, ropa, herramientas
y evolución. Explorers pp. 206-224 contiene otra colección extensa.

La importación debe conservar la fuente y el perfil de reglas. Un Oran Berry de
PMDTA no tiene el mismo efecto que una Baya Oran de PokeD&D.

## Equipos, gremios y reputación

Explorers pp. 58-61 trata el equipo como personaje colectivo:

- nombre;
- miembros activos y reserva;
- rango;
- reputación;
- bolsa;
- insignia de rescate;
- Wonder Map;
- misiones completadas.

Pokérole pp. 7-9 añade comunidades, gremios, manadas y rangos Normal, Bronce,
Plata, Oro y Diamante. El rango debe abrir acceso a misiones, capacidad,
servicios y autoridad, no ser solo un número.

Foundry necesita una ficha compartida de equipo o un Journal estructurado que
todos puedan consultar.

## Lectura interpretativa de las fuentes

### Explorers! A PMD RPG

**Páginas 4-18:** presenta filosofía de juego, reserva de d6, dados explosivos,
ventaja, pruebas, grados de éxito, avance a través del fallo, estructura de
mazmorra y combate.

**Páginas 19-57:** creación, naturaleza, aura, ocho clases, especializaciones,
estadísticas, habilidades, movimientos, orígenes, amistad, nivel y evolución.
Su mayor aportación al módulo no son sus números, sino la libertad de separar
especie de función: dos Pokémon iguales pueden ocupar roles distintos.

**Páginas 58-67:** equipo, rango, misiones, bolsa, mapa, reserva, terreno,
clima, base, tiendas, servicios y descanso. Es el núcleo de la experiencia PMD.

**Páginas 68-91:** guía del GM, sesión cero, creación gradual del mundo, ciclo de
sesión, facciones, recompensas, diseño de mazmorras, trampas, peligros, PNJ,
jefes, arcos por nivel y bestiario escalable.

**Páginas 92-93:** memorias humanas, cualidad rara inicial, derrota del equipo,
Mega Evolución y especies excepcionales como opciones, no presupuestos.

**Páginas 94-226:** glosario, ficha explicada, especies jugables, estados, 513
movimientos, familias de movimientos, 182 cualidades raras, objetos y referencia
rápida. Es contenido de compendio; no debe confundirse con capítulos de
procedimiento.

### Pokémon Mystery Dungeon Tabletop Adventures

**Player's Guide pp. 1-4:** reglas 2d6, éxito parcial, combate, daño por
multiplicadores y procedimiento de planta con límite de treinta minutos. Es
incompatible matemáticamente con dnd5e, pero útil para diseñar resultados con
coste y presión temporal.

**Páginas 5-10:** creación, evolución, estados y clima.

**Páginas 11-14:** orígenes de humanos y descripción del mundo.

**Páginas 15-44:** tablas de estadísticas, habilidades, capacidades y
habilidades únicas.

**Páginas 45-48:** talentos IQ por nivel.

**Páginas 49-50:** mapa mundial y efectividad.

**Narrator's Guide pp. 1-21:** consejos de combate y catálogo de objetos con
economía.

**Páginas 22-26:** encuentros por pradera, bosque, desierto, tundra, páramo,
tropical y pantano.

**Páginas 27-33:** objeto aleatorio, trabajos, plantilla de PNJ y plantilla de
mazmorra.

**PMDTA Optional pp. 1-14:** kits iniciales, materiales y construcción,
movimientos de estado y talentos IQ avanzados. Debe aparecer como contenido
opcional claramente etiquetado.

### Pokérole Mystery Dungeon

**Páginas 3-5:** la mejor fuente temática de la biblioteca. Logic representa la
mente humana; Instinct, la adaptación Pokémon; Primal, el precio de sobrevivir.
Entrar en estado Primal restaura al personaje, pero aumenta la pérdida futura de
Logic. Es una mecánica dramática potente, pero no debe imponerse en una campaña
heroica sin acuerdo de sesión cero.

**Páginas 7-9:** comunidades, gremios, equipos, manadas, rescates y rangos.

**Páginas 9-17:** losetas de mazmorra, objetivos, eventos, trampas, equipos
enemigos, tesoro, retos del gremio y paso seguro.

**Páginas 18-19:** reclutamiento, entrenamiento y evolución.

**Páginas 20-22:** comida, prendas, orbes, semillas y armas.

**Página 23:** hambre, entrenadores, cazadores y legendarios como complicaciones
de campaña.

### Mystery Dungeon TTRPG de GM Binder

Es una adaptación d20 breve. Usa estadísticas de ataque y defensa Pokémon,
competencia física/especial, PP, naturaleza, tipos y salvaciones de estado. Sus
páginas alternas decorativas no contienen reglas. Sirve para comprobar
terminología y la idea de ficha compacta, pero no ofrece suficiente campaña,
progresión o contenido como para gobernar el módulo.

### PokeD&D Modo Aventura

**Páginas 4-46:** introducción, Pokémon como raza, orígenes, clases, naturalezas,
rasgos de tipo, progresión, evolución, PokeUp, movimientos, creación, combos,
combate, objetos, exploración y legendarios.

**Páginas 47-298:** progresión y movimientos de Normal, Fuego, Agua, Planta,
Eléctrico, Hielo, Tierra, Roca, Lucha, Veneno, Volador, Psíquico, Bicho,
Fantasma, Acero, Siniestro, Hada y Dragón.

**Páginas 299-313:** consejos para el GM, adaptación de bestiario, encuentros,
misiones, clima, glosario y builds.

Es la fuente necesaria para funcionar sobre dnd5e, pero requiere una edición de
reglas antes de automatizarse. Sus ambigüedades deben convertirse en ajustes de
mundo o decisiones documentadas.

## Crónicas de Evaloren como campaña de prueba

### Preparación

La aventura ocupa pp. 3-26, está diseñada para niveles 1-5 y cuatro o cinco
sesiones. Usa hitos: nivel 2 tras el acto 1, nivel 3 tras el acto 2, nivel 4 tras
el acto 3 y nivel 5 antes del clímax.

El GM debe preparar:

- CrownBerry Town y tres PNJ funcionales;
- Shadow Wood;
- Valanar Ruins;
- Dragon Mountain;
- Druidic Camp;
- Cavern of Times;
- el artefacto del sello;
- cuatro subordinados de Gengar;
- Alakazam, Groudon, Reshiram, Gengar y Regirock;
- tres resoluciones para el final.

### Acto 1: el llamado

Los personajes despiertan tras un naufragio, llegan a CrownBerry durante el robo
del artefacto, recogen pistas y tienen un combate tutorial (pp. 12-13). Eevee
funciona como red de seguridad para que una pista fallida no detenga la campaña.

### Acto 2: Shadow Wood

El bosque muestra corrupción, ilusiones y los primeros subordinados serios.
Gengar debe sentirse presente sin exponerse. El objetivo es demostrar que el
problema altera el entorno y conducir a Valanar.

### Acto 3: Valanar

Las ruinas combinan trampas, mural interpretable, guardianes y combate táctico.
Alakazam revela que Regirock puede ser protector o destructor según quién
controle su despertar (pp. 16-17). El dilema debe permanecer abierto.

### Acto 4: los guardianes

Dragon Mountain ofrece poder inmediato de Groudon con coste narrativo. Druidic
Camp ofrece verdad, aliados y resistencia a las ilusiones de Gengar mediante
Reshiram (pp. 17-19). Rechazar a ambos también es válido. El módulo debe
registrar la elección porque modifica escenas y final.

### Acto 5: Cavern of Times

La mazmorra final desgasta recursos con guardianes, derrumbes, cristales e
ilusiones. Regirock tiene dos fases; al 50 % aparece Gengar. Las condiciones de
victoria son derrotar, purificar cristales o renovar el sello (pp. 19-21).

Los tres finales producen consecuencias distintas:

- **Purificación:** regeneración y esperanza.
- **Sello:** paz temporal e incertidumbre.
- **Destrucción:** ruptura del equilibrio y nuevas catástrofes.

### Problemas que el GM debe completar

Evaloren ofrece escenas y tono, pero no incluye:

- mapas tácticos;
- bloques completos;
- CD concretas para la mayoría de pruebas;
- tesoro por encuentro;
- cantidad exacta de enemigos;
- mecánica completa del ritual o cristales;
- balance de Regirock para nivel 5.

Por eso es una excelente prueba de preparación para Foundry: el módulo debe
permitir llenar esos huecos sin obligar al GM a programar.

## Los gimnasios

`Gimnasios Pokémon y sus Líderes` no pertenece realmente al mismo reglamento.
Describe un formato competitivo inspirado en TCG Pocket:

- mazos de veinte cartas;
- un Pokémon activo y hasta tres en banca;
- victoria al derrotar tres Pokémon;
- campos permanentes;
- una acción de gimnasio al final de cada ronda;
- diez medallas, Elite 4 y campeonato;
- modo incursión con estadísticas multiplicadas.

Las páginas 7-11 definen campos y acciones de Fuego, Agua, Planta, Eléctrico,
Siniestro, Psíquico, Dragón, Lucha, Acero y Normal. Mezclan daño fijo de TCG,
cuadros, tiradas d20 y ventaja. No son encuentros dnd5e listos para usar.

Para PMD solo conviene reutilizar la ficción:

- Volcán Ígneo, Bahía Marina, Bosque Frondoso, Planta de Energía;
- Cripta Umbría, Laboratorio Onírico, Caverna del Cielo;
- Dojo de la Voluntad, Fábrica de Titanio y Arena Urbana;
- medallas como hitos o permisos;
- acción ambiental temática por ronda.

Cada gimnasio requiere una conversión completa a Scene, peligro ambiental y
Actor dnd5e. Multiplicar estadísticas por número de jugadores, como propone el
modo incursión p. 13, no es una forma segura de escalar un encuentro de D&D.

## Decisiones pendientes que Foundry debe preguntar

El módulo no debería escoger silenciosamente:

1. perfil de efectividad elemental;
2. fórmula de STAB;
3. interpretación de Move Power;
4. PP por movimiento o reserva por Actor;
5. PokeUp paralelo o sustituto de clase;
6. combos permitidos y límite;
7. consecuencia de 0 PG en una mazmorra;
8. uso de hambre;
9. uso de bolsa por espacios;
10. presencia de humanos;
11. especies excepcionales jugables;
12. requisitos de evolución;
13. reglas opcionales de memoria, Primal e IQ;
14. sistema de rangos del equipo.

## Qué debe ofrecer el módulo al GM

- asistente de creación Pokémon sin reemplazar datos dnd5e;
- movimientos como Items con actividades, PP y efectos;
- perfiles configurables de tipo y STAB;
- ficha compartida de equipo;
- bolsa por espacios;
- tablero de misiones;
- generador asistido de misión y mazmorra;
- encuentros filtrados por bioma;
- condiciones completas;
- evolución con vista previa;
- plantillas de jefe por fases;
- diarios y decisiones persistentes;
- importación preparada de Evaloren;
- referencia de reglas con enlaces a la página fuente.

## Cobertura de archivos

La lectura incluye los PDF principales, los PDF de referencia rápida, las hojas
de personaje, las dieciséis fichas pregeneradas, cuatro libros XLSX, dos DOCX,
tres mapas PNG y el TXT de enlaces de las dos rutas entregadas. También incluye
los PDF individuales de PokeD&D, Evaloren, gimnasios, Pokérole y GM Binder.

El TXT de Explorers enlaza una copia en Google Sheets del catálogo de
movimientos/cualidades y una hoja comunitaria de Wonder Codes, misiones y
naturalezas/auras personalizadas. La segunda es contenido comunitario externo:
no debe incorporarse como regla oficial sin revisar sus pestañas y licencia.

`Claude Code.txt` no contiene reglas de juego. Es una lista de referencias
técnicas para Foundry, HTML, CSS y JavaScript. Debe usarse durante la
implementación, no durante la dirección de la campaña.
