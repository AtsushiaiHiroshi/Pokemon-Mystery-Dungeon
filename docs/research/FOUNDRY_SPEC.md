# Especificación funcional para Foundry VTT

## Alcance

El producto es un módulo para Foundry VTT 14 que extiende `dnd5e` 5.3.x. No es
un sistema independiente y no reemplaza las clases, actividades, tiradas,
combate ni documentos fundamentales de D&D.

### Regla de frontera

Una función pertenece al módulo cuando puede expresarse como una extensión de
un documento o flujo existente de dnd5e:

- datos adicionales en `flags`;
- Items `feat`, `spell`, `consumable`, `equipment` o equivalentes;
- Activities de ataque, salvación, daño, curación o utilidad;
- Active Effects y estados;
- ajustes de mundo;
- aplicaciones auxiliares para preparar contenido.

Una función cruzaría hacia un sistema propio si necesitara sustituir:

- las seis características;
- la fórmula general `d20 + modificador + competencia`;
- CA, PG, salvaciones, iniciativa o economía de acciones;
- clases, niveles o progresión de dnd5e;
- Actor, Item, Combat, Scene o sus hojas fundamentales;
- las Activities como mecanismo de resolución.

Explorers, PMDTA y Pokérole son referencias de diseño y contenido. Sus reservas
de d6, tablas 2d6, estadísticas y fórmulas de daño no se ejecutan dentro del
perfil predeterminado del módulo.

### Principio de implementación

El módulo añade Pokémon a D&D; no añade un segundo juego encima de D&D. Por
tanto:

- no existe una “tirada PMD” genérica;
- una prueba Pokémon usa una habilidad, herramienta, salvación o Activity de
  dnd5e;
- Attack, Sp. Atk, Defense, Sp. Def y Speed son metadatos opcionales, no
  reemplazos de las características D&D;
- el nivel de Actor y la clase avanzan normalmente;
- PokeUp se entrega como `feat` paralelo;
- la consecuencia de un movimiento se resuelve mediante su Activity;
- los subsistemas opcionales nunca alteran Actors normales sin consentimiento.

## Entidades

### Perfil Pokémon del Actor

Cada Actor debe almacenar:

- especie y forma;
- uno o dos tipos;
- naturaleza y aura;
- etapa y requisitos de evolución;
- capacidades físicas;
- habilidades o cualidades propias de especie;
- tamaño, movimiento terrestre, vuelo, nado, excavación y trepar;
- objeto sostenido y espacios de equipo por cabeza, cuello y cinturón;
- estadísticas Pokémon de Attack, Sp. Atk, Defense, Sp. Def y Speed como datos
  secundarios a las seis características D&D;
- Awareness y habilidades PMD;
- talentos IQ;
- biografía, aspiración e hitos de experiencia;
- equipo, rango y reputación;
- amistad, hambre y condición de rescate.

Estos datos deben vivir bajo `flags.pokemon-mystery-dungeon` para no modificar
el esquema de `dnd5e`.

### Movimiento Pokémon

Un movimiento se representa mediante un Item de dnd5e con una o más
Activities. Sus datos PMD son:

- tipo elemental;
- categoría física, especial o estado;
- coste y PP máximos;
- potencia fuente;
- acción, acción bonus, reacción o duración;
- alcance expresado en pies y casillas;
- patrón de objetivo;
- daño y escalado D&D;
- salvación y CD;
- estados, cambios de estadísticas, empuje y movimiento;
- STAB y regla de efectividad;
- nivel o requisito de aprendizaje;
- etiquetas de familias de movimientos.

No debe depender de texto libre para los campos que necesiten automatización.

### Cualidad rara

Se representa como Item `feat`, con:

- prerrequisito de tipo, anatomía, movimiento o nivel;
- evento de activación;
- frecuencia;
- cambios pasivos;
- inmunidades y resistencias;
- efectos aplicados.

### Habilidad, capacidad y talento IQ

Las fichas pregeneradas confirman tres conceptos distintos:

- una habilidad de especie con disparador y efecto;
- una o más capacidades físicas, sensoriales o de locomoción;
- talentos IQ con reglas pasivas o acciones especiales.

Se representan como Items `feat` enlazados al Actor. Los datos estructurados
deben incluir disparador, frecuencia, modificadores, efecto activo, duración y
fuente. La ficha muestra un resumen, pero conserva el texto completo en el
Item.

### Especie

La especie debe ser una definición reutilizable que pueda aplicarse a un Actor:

- tipos y forma;
- tamaño;
- capacidades;
- movimientos sugeridos;
- evoluciones;
- habilidades y cualidad única;
- hábitats.

### Equipo de exploración

Documento lógico compartido con:

- nombre;
- miembros y reserva;
- rango y reputación;
- bolsa y capacidad;
- almacén;
- mapa;
- misiones activas y completadas;
- insignias de rescate.

## Subsistemas

### PP

Modo recomendado:

- PP actual y máximo por movimiento.
- El intento de uso de la Activity consume PP de acuerdo con el ajuste del
  mundo; no debe depender de impactar para evitar usos gratuitos al fallar.
- El Item no puede usarse a 0 PP salvo decisión del Director.
- descanso, objetos y servicios pueden recuperar PP.

Debe existir un ajuste de mundo para usar una reserva simplificada por Actor.

### Tipos

El motor debe:

- leer el tipo del movimiento;
- leer uno o dos tipos del objetivo;
- calcular el multiplicador;
- aplicar STAB de forma separada;
- mostrar el cálculo en el chat;
- permitir al Director confirmar o ignorar el ajuste.

La tabla de multiplicadores debe ser configurable porque las fuentes usan
escalas distintas.

### Estados

Estados mínimos:

- Burned;
- Poisoned y Badly Poisoned;
- Paralysed;
- Asleep y Yawning;
- Frozen;
- Confused;
- Flinched;
- Frightened;
- Restrained, Trapped y Bound;
- Taunted;
- Disabled;
- Blinded;
- Infatuated;
- cambios temporales de Attack, Defense, Sp. Atk, Sp. Def y Speed.

Cada estado necesita icono propio o genérico, duración, momento de tirada,
salvación, inmunidades y automatización reversible.

### Evolución

Los requisitos admitidos incluyen:

- nivel;
- objeto;
- amistad;
- hora del día;
- lugar o terreno;
- conocimiento de movimiento;
- género o forma;
- presencia de otra especie;
- decisión narrativa.

La evolución debe mostrar una vista previa y nunca reemplazar automáticamente
un Actor sin confirmación del Director.

### Hambre y descanso

- Hambre configurable por Actor.
- Gasto por planta, tiempo o evento.
- Avisos por umbral.
- Consecuencia D&D configurable a hambre cero.
- comida y objetos recuperan valores definidos.
- descanso completo puede restaurar PP y hambre si hay suministros.

### Mazmorras y misiones

El generador necesita:

- bioma y hábitats válidos;
- número de plantas;
- objetivo;
- cliente y objetivo Pokémon;
- dificultad y rango;
- encuentros por hábitat;
- trampas y peligros;
- clima, terreno y visibilidad;
- tesoro y recompensa;
- giro narrativo;
- escaleras, salida y condiciones de rescate.

Las capacidades del Excel deben filtrar encuentros y resolver movimiento por
terreno.

### Bolsa e inventario

Debe ofrecer:

- bolsa común opcional;
- capacidad por rango;
- alimentos, bayas, semillas, orbes, varitas, objetos arrojables y evolución;
- operaciones rápidas para consumir, lanzar o entregar;
- almacén del gremio.

## Compendios previstos

1. Reglas PMD para D&D.
2. Movimientos Pokémon.
3. Cualidades raras.
4. Especies y formas.
5. Objetos PMD.
6. Estados y efectos.
7. Tablas de encuentro.
8. Tablas de tesoro.
9. Plantillas de misión.
10. Contenido de Crónicas de Evaloren.

## Fases de implementación

### Fase 1 - Modelo y ficha

- definir flags y validación;
- panel Pokémon dentro de la ficha;
- secciones para habilidad, capacidades, talentos IQ, Awareness, estadísticas
  Pokémon secundarias y equipo por localización;
- PP por movimiento;
- tipos y estados;
- migración de los datos del prototipo actual.

### Fase 2 - Compendios

- normalizar los 513 movimientos;
- normalizar las 182 cualidades raras;
- convertir hábitats y capacidades a registros por especie;
- crear objetos, efectos y reglas.

### Fase 3 - Exploración

- equipos y rangos;
- hambre y bolsa;
- generador de misiones;
- generador de plantas, encuentros y tesoro;
- herramientas de rescate.

### Fase 4 - Aventura

- adaptar Crónicas de Evaloren;
- diarios, PNJ, objetos, tablas y encuentros;
- pruebas completas dentro de Foundry.

## Criterios de aceptación

- No rompe Actors ni Items normales de dnd5e.
- Un movimiento conserva PP y automatización tras recargar el mundo.
- STAB y tipos producen un desglose visible.
- Los estados se aplican y eliminan sin cambios residuales.
- Una especie puede aplicarse a un Actor sin borrar sus datos D&D.
- El generador solo propone especies compatibles con el hábitat elegido.
- La evolución siempre requiere confirmación.
- La campaña de Evaloren puede prepararse usando únicamente contenido del
  módulo y del SRD de dnd5e.

## Evaluación del prototipo 0.1.0

El prototipo demuestra integración básica con Foundry, pero las siguientes
funciones deben reemplazarse antes de considerarlo una base de reglas:

| Función actual | Problema | Sustitución |
| --- | --- | --- |
| `Prueba PMD` = `1d20 + competencia` | Omite característica, habilidad y contexto | Usar las pruebas y Activities de dnd5e |
| PP global por Actor | No coincide con PokeD&D ni permite costes distintos | PP bajo flags de cada Item movimiento |
| Tabla fija ×0, ×0.5, ×1, ×2 | Impone escala de videojuegos sobre daño dnd5e | Perfiles configurables y confirmación del GM |
| Descanso llena hambre | El descanso no crea comida | Restaurar hambre solo si hay suministro o ajuste |
| Misión de cuatro campos | No produce una misión dirigible | Cliente, riesgo, reloj, verdad, consecuencia y recompensa |
| Datos en un formulario aislado | Duplica la ficha y oculta información | Panel integrado o aplicación enlazada a la ficha dnd5e |
| `feat` de movimiento sin esquema | Depende de texto libre | Flags validados + Activity de dnd5e |
