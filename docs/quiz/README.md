# Test de personalidad PMD

Esta es una página web independiente del módulo de Foundry VTT. Ofrece un test rápido de 20 preguntas (incluida la pregunta de sexo) y un test completo de 65 preguntas. Carga el banco de preguntas y las especies desde `../data/` y no modifica actores ni perfiles de Foundry.

Las recomendaciones muestran la primera etapa de cada línea evolutiva, aunque esa especie pueda evolucionar —por ejemplo Pichu, Meowth o Chimchar—, y también especies sin evolución. No se ofrecen sus formas evolucionadas; Pikachu se mantiene como excepción para conservar su papel de inicial PMD. Meowth está incluido entre las opciones iniciales. Se excluyen los Pokémon Paradoja y los Ultraentes, salvo Poipole. El banco se deduplica y se baraja con Fisher–Yates; las sesiones rápidas recuerdan las preguntas ya usadas para evitar repetirlas hasta recorrer el conjunto.

El fondo usa las mismas capas animadas y el mismo sonido de selección que el sitio fanmade de referencia. Los retratos PMD se sirven desde el repositorio comunitario PMDCollab/SpriteCollab usando siempre la paleta `0000/Normal.png`; si falta un retrato, se usa arte oficial normal de PokéAPI, nunca una variante shiny/variocolor. El botón permite silenciarlo. Se respeta la preferencia `prefers-reduced-motion` para reducir las animaciones.

Al terminar, el resultado muestra la frase «Pareces ser...», tu naturaleza, las recomendaciones y un gráfico radial con la distribución completa de tu test de personalidad.

Para probarla localmente, abre una terminal en la carpeta del módulo y ejecuta:

```text
python -m http.server
```

Después visita `http://localhost:8000/quiz/`. Para publicarla, sube la carpeta del módulo a un alojamiento estático como GitHub Pages; la ruta `quiz/` funcionará sin cambios.
