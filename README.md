# Pokémon Mystery Dungeon para Foundry VTT

El proyecto está pasando a ser un **sistema Pokémon nativo** para Foundry VTT 14.
La referencia a D&D se limita al índice d20, los modificadores y la presentación
de tiradas; la ficha, los actores, los objetos y el combate ya no dependen de la
hoja D&D 5e.

La arquitectura y el plan de migración están en
[`docs/architecture/POKEMON_SYSTEM_ARCHITECTURE.md`](docs/architecture/POKEMON_SYSTEM_ARCHITECTURE.md).
El módulo D&D legado se conserva temporalmente para mundos existentes, pero no
debe activarse junto con el sistema nuevo.

## Funciones

- Hoja Pokémon nativa con PS, Ataque, Defensa, Ataque Especial, Defensa Especial,
  Velocidad, precisión, evasión, PP, hambre, amistad, agotamiento y Poké.
- Compendios nativos con 1025 especies, 902 movimientos, 316 habilidades HA y
  278 objetos de mazmorra; los objetos de captura/Poké Balls se excluyen.
- Combate preparado para prioridad, orden por Velocidad, precisión/evasión,
  categorías físico/especial, efectividad por tipo y golpes críticos.
- Evolución y amistad diseñadas como migraciones de especie, estadísticas,
  movimientos y habilidades.

## Uso

1. Instala el sistema desde `system.json` o copia el repositorio a
   `Data/systems/pokemon-mystery-dungeon`.
2. Activa **Pokémon Mystery Dungeon** en la creación del mundo; no selecciones
   el módulo D&D legado.
3. Crea un Actor y elige el tipo **Pokémon**. La ficha nativa calcula sus
   características a partir de especie, nivel, IV, EV y naturaleza.
4. Abre los compendios nativos y arrastra movimientos, habilidades u objetos a
   la ficha. La moneda única es **Poké**.

Para regenerar los compendios después de actualizar los datos de WikiDex:

```bash
npm run fetch:pokemon
npm run fetch:wikidex
npm run build:native-packs
```

## Test de personalidad externo

El test PMD no se ejecuta dentro de Foundry ni modifica actores. Es una página
interactiva independiente en [`docs/quiz/index.html`](docs/quiz/index.html), con
un modo rápido de 20 preguntas y uno completo de 65 preguntas, 16 naturalezas y
recomendaciones ampliadas a las generaciones 1–9. El resultado ofrece la primera
etapa de cada línea evolutiva, pero no sus evoluciones posteriores; Pikachu es
la excepción y Meowth se mantiene entre las opciones iniciales. Se excluyen los
Pokémon Paradoja y los Ultraentes, salvo Poipole.
Para probarla localmente, ejecuta `python -m http.server --directory docs` desde
la carpeta del módulo y abre `http://localhost:8000/quiz/`. El workflow de
GitHub Pages publica automáticamente `docs/` al hacer merge en `main`.

El módulo no incluye arte oficial ni reproduce los manuales de referencia.
Pokémon y Pokémon Mystery Dungeon pertenecen a sus respectivos propietarios.

## Desarrollo

```bash
npm run validate
```

El flujo de GitHub Actions valida el manifiesto y, al publicar una etiqueta
`v*`, crea los archivos de instalación del sistema y conserva el paquete legacy
por separado.

Manifiesto del sistema nativo:

```text
https://github.com/AtsushiaiHiroshi/Pokemon-Mystery-Dungeon/releases/latest/download/system.json
```

Manifiesto del puente legacy (solo para mundos antiguos):

```text
https://github.com/AtsushiaiHiroshi/Pokemon-Mystery-Dungeon/releases/latest/download/module.json
```
