# Test de personalidad PMD

Esta es una página web independiente del módulo de Foundry VTT. Ofrece un test rápido de 8 preguntas y un test completo de 64 preguntas. Carga el banco de preguntas y las especies desde `../data/` y no modifica actores ni perfiles de Foundry.

Las recomendaciones muestran especies base o sin evolución y primeras preevoluciones; Pikachu se mantiene como excepción para conservar su papel de inicial PMD. Meowth está incluido entre las opciones iniciales.

Para probarla localmente, abre una terminal en la carpeta del módulo y ejecuta:

```text
python -m http.server
```

Después visita `http://localhost:8000/quiz/`. Para publicarla, sube la carpeta del módulo a un alojamiento estático como GitHub Pages; la ruta `quiz/` funcionará sin cambios.
