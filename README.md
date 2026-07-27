# Pokémon Mystery Dungeon para D&D 5e

Módulo local para Foundry VTT 14 y D&D 5e 5.3.x.

## Funciones

- Panel PMD por Actor con especie, tipos, naturaleza, aura, rango de equipo,
  hambre, PP, amistad y fichas de aventura.
- Tiradas PMD al chat y consumo/restauración rápida de recursos.
- Calculadora de efectividad elemental.
- Generador de misiones de rescate, exploración, escolta y captura.
- Instalador de contenido inicial: diario de reglas, movimientos, objetos y Pokémon jugables.
- Compendios de 902 movimientos, 278 objetos de mazmorra, 121 candidatos de Mundo Misterioso y 1025 especies Pokémon de las generaciones 1–9.
- Botón **Editar perfil Pokémon** dentro de las hojas de Actor dnd5e.
- Editor Pokémon para tipo, categoría y PP dentro de los movimientos.
- Acceso desde el directorio de actores, controles de token y macros.

## Uso

1. Instálalo con el manifiesto de la última versión o copia este repositorio a
   `Data/modules/pokemon-mystery-dungeon`.
2. Activa el módulo en un mundo que utilice `dnd5e`.
3. En Configuración del módulo, ejecuta **Crear contenido inicial PMD**.
4. Selecciona un token y usa el botón de huella, o abre el menú contextual de
   un actor y elige **Ficha PMD**.
5. Abre **Compendios** y busca las carpetas `PMD`. Arrastra un movimiento u
   objeto a la hoja para crear una copia editable.
6. En la hoja del Actor, usa **Editar perfil Pokémon**. En la hoja de un
   movimiento, usa **Editar datos Pokémon** para tipo, categoría, PP, potencia,
   precisión, prioridad, retroceso y CD; configura ataque, daño, alcance y
   salvación con las Activities normales de dnd5e.

El compendio `PMD - Pokémon (todas las generaciones)` contiene las 1025 especies
base de las generaciones 1–9 con avatares oficiales de PokeAPI.

## Test de personalidad externo

El test PMD no se ejecuta dentro de Foundry ni modifica actores. Es una página
interactiva independiente en [`docs/quiz/index.html`](docs/quiz/index.html), con
un modo rápido de 8 preguntas y uno completo de 64 preguntas, 16 naturalezas y
recomendaciones ampliadas a las generaciones 1–9. El resultado evita evoluciones
salvo Pikachu y mantiene a Meowth entre las opciones iniciales.
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
`v*`, crea automáticamente `module.json` y
`pokemon-mystery-dungeon.zip` como archivos de la versión.

Manifiesto de instalación:

```text
https://github.com/AtsushiaiHiroshi/Pokemon-Mystery-Dungeon/releases/latest/download/module.json
```
