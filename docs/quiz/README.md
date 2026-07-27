# Test de personalidad PMD

Esta es una página web independiente del módulo de Foundry VTT. Carga el banco de preguntas y las especies desde `../data/` y no modifica actores ni perfiles de Foundry.

Para probarla localmente, abre una terminal en la carpeta del módulo y ejecuta:

```text
python -m http.server
```

Después visita `http://localhost:8000/quiz/`. Para publicarla, sube la carpeta del módulo a un alojamiento estático como GitHub Pages; la ruta `quiz/` funcionará sin cambios.
