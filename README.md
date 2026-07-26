# Pokémon Mystery Dungeon para D&D 5e

Módulo local para Foundry VTT 14 y D&D 5e 5.3.x.

## Funciones

- Panel PMD por Actor con especie, tipos, naturaleza, aura, rango de equipo,
  hambre, PP, amistad y fichas de aventura.
- Tiradas PMD al chat y consumo/restauración rápida de recursos.
- Calculadora de efectividad elemental.
- Generador de misiones de rescate, exploración, escolta y captura.
- Instalador de contenido inicial: diario de reglas, objetos de ejemplo y tablas.
- Acceso desde el directorio de actores, controles de token y macros.

## Uso

1. Instálalo con el manifiesto de la última versión o copia este repositorio a
   `Data/modules/pokemon-mystery-dungeon`.
2. Activa el módulo en un mundo que utilice `dnd5e`.
3. En Configuración del módulo, ejecuta **Crear contenido inicial PMD**.
4. Selecciona un token y usa el botón de huella, o abre el menú contextual de
   un actor y elige **Ficha PMD**.
5. Para movimientos, usa objetos de tipo `feat` o `spell` de D&D 5e. El panel
   PMD conserva los PP generales; los objetos iniciales muestran una estructura
   recomendada.

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
