# IA narrativa local de Cosmopolis — Android

## Estado

- llama.cpp está compilado en Termux para Android aarch64.
- Ejecutable verificado: `$HOME/llama.cpp/build/bin/llama-server`, versión 0.9.0-dev.
- Modelos ya presentes en el dispositivo: `$HOME/models/cosmopolis/Qwen3.5-2B-Q4_K_M.gguf` y `$HOME/models/cosmopolis/Qwen3.5-4B-Q4_K_M.gguf`.
- Candidato inicial de prueba: Qwen3.5-4B Q4_K_M. No descargar otro modelo.
- Cosmopolis web se sirve en `http://127.0.0.1:8080`.
- El servidor de inferencia se reserva en `http://127.0.0.1:8081`, para no competir con el servidor web.
- **Arranque verificado en el Samsung (12/11/2026):** Qwen3.5-4B Q4_K_M cargado, `llama-server` escuchando en el puerto 8081 y `/health` devuelve `{"status":"ok"}`. PID comunicado por Termux: 2537. No iniciar una segunda instancia.

## Integración incorporada

- `app/js/game/narrator.js`: cliente del endpoint OpenAI-compatible `/v1/chat/completions` de llama.cpp.
- `index.html`: carga el módulo después de `director.js`.
- `app/js/app.js`: el envío de acciones ahora espera la respuesta asíncrona del narrador y bloquea temporalmente el formulario.
- `app/css/style.css`: presenta un estado de espera discreto sin alterar la cuadrícula de escritura.
- Si el servidor local no responde, tarda demasiado o devuelve una respuesta inválida, el juego utiliza `Director.respond()` como alternativa y conserva el guardado existente.
- La IA recibe ficha del personaje, estado actual, hechos, pistas, personajes y las seis acciones recientes.
- La respuesta está restringida a un esquema JSON con narración, evento, categoría, ubicación, hechos/pistas nuevos y cambio limitado de confianza de Elia.
- Los cambios propuestos se validan y limitan antes de guardarlos. El historial y la persistencia siguen a cargo de `Session` y `Save`.

## Arranque previsto en Termux

El script `scripts/iniciar_ia_local.sh` comprueba el ejecutable y el modelo ya instalados y arranca el servidor en segundo plano con contexto 4096, cuatro hilos, una petición simultánea y CORS limitado al origen local del juego. No descarga nada.

Desde la raíz del proyecto se ejecutará con:

```sh
bash scripts/iniciar_ia_local.sh
```

El registro se escribe en `$HOME/cosmopolis-llama-server.log`. La disponibilidad se comprueba mediante `http://127.0.0.1:8081/health`.

## Estado de las pruebas en el dispositivo

1. **Completado:** iniciar el servidor y comprobar que el modelo termina de cargar.
2. **Completado:** consultar `/health`; respuesta HTTP 200 con `{"status":"ok"}`.
3. **Pendiente:** enviar una acción sencilla desde Cosmopolis y confirmar que se usa la IA local.
4. **Pendiente:** comprobar que el texto generado se guarda y que hechos, pistas, ubicación y relación sobreviven a recargar la página.
5. **Pendiente:** detener el servidor y comprobar que el juego vuelve al director provisional sin perder la partida.
6. **Pendiente:** medir tiempo de primera respuesta, tokens por segundo, memoria y temperatura; ajustar hilos/contexto solo a partir de datos reales.

La carga del modelo y la salud del servidor están verificadas, pero no se declara la integración narrativa completa hasta completar las pruebas restantes en el Samsung. No borrar ni sustituir ninguno de los modelos existentes.
