# Test de personalidad PMD

Esta es una página web independiente del módulo de Foundry VTT. Ofrece un test rápido de 8 preguntas y un test completo de 64 preguntas. Carga el banco de preguntas y las especies desde `../data/` y no modifica actores ni perfiles de Foundry.

Las recomendaciones muestran la primera etapa de cada línea evolutiva, aunque esa especie pueda evolucionar —por ejemplo Pichu, Meowth o Chimchar—, y también especies sin evolución. No se ofrecen sus formas evolucionadas; Pikachu se mantiene como excepción para conservar su papel de inicial PMD. Meowth está incluido entre las opciones iniciales.

El fondo cambia suavemente de color durante el test. El botón «Activar ambiente» genera un ambiente sonoro local y ligero con Web Audio; los navegadores requieren una acción del usuario para iniciar audio. Se respeta la preferencia `prefers-reduced-motion` para reducir las animaciones.

Para probarla localmente, abre una terminal en la carpeta del módulo y ejecuta:

```text
python -m http.server
```

Después visita `http://localhost:8000/quiz/`. Para publicarla, sube la carpeta del módulo a un alojamiento estático como GitHub Pages; la ruta `quiz/` funcionará sin cambios.
