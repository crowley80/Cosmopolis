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


## Inventario y memoria de pertenencias — 12 de noviembre de 2026

El contrato JSON del narrador local incorpora dos listas controladas:

- `itemsToAdd`: objetos que el personaje obtiene realmente y puede transportar.
- `itemsToRemove`: objetos que entrega, consume, pierde o deja atrás.

El cliente valida que ambas listas existan, evita duplicados, limita cada respuesta a diez cambios y el inventario total a 50 entradas. Los objetos se guardan dentro de `adventure.state.inventory`, por lo que forman parte de la partida local y del contexto narrativo que recibe el modelo en las siguientes acciones. Examinar un objeto no implica añadirlo automáticamente.

La interfaz de Inventario muestra las pertenencias registradas. La prueba automatizada simula una respuesta estructurada del endpoint para comprobar la aplicación y persistencia de un objeto; no sustituye una prueba de generación real con Qwen3.5-4B en el Samsung.


## Recuerdos individuales de personajes — 12 de noviembre de 2026

El esquema del narrador incorpora `characterMemoriesToAdd`, una lista de recuerdos con nombre de personaje y texto. El cliente solo acepta recuerdos para personajes ya presentes en `adventure.state.characters`; no crea NPCs a partir de una salida del modelo. Los recuerdos se normalizan, se evitan duplicados y se conservan los 30 más recientes por personaje.

Como los recuerdos forman parte de `state.characters`, se incluyen automáticamente en el contexto de las siguientes peticiones y sobreviven al guardado/recarga. La prueba de Chromium simula dos acciones: encontrar un medallón y entregárselo a Elia; comprueba que el objeto entra y sale del inventario, que cambia su confianza y que ambos recuerdos siguen guardados después de recargar.

La prueba usa respuestas JSON simuladas y valida el contrato de integración; no reemplaza la prueba con el modelo real en Android.


## Reloj interno del mundo — 12 de noviembre de 2026

La cabecera ya no presenta la hora y fecha reales del teléfono como si fueran el calendario de la aventura. Muestra `state.time` y `state.day`, que pertenecen al mundo ficticio. El contrato del narrador devuelve ambos campos; el cliente valida el tipo, limita el día a un entero positivo y conserva el momento anterior si el texto recibido está vacío.

El prompt indica que el tiempo no debe avanzar sin causa narrativa y que el día solo cambia al cruzar al siguiente. El reloj solo cambia cuando se procesa y guarda una acción, por lo que no simula tiempo mientras la partida está cerrada. La prueba de Chromium comprueba que dos respuestas sucesivas actualizan la cabecera de «Media mañana» a «Mediodía» y que el valor permanece tras recargar.


## Registro de personajes nuevos — 12 de noviembre de 2026

Se añade `charactersToAdd` al contrato JSON. El narrador puede registrar personajes nuevos cuando entran realmente en escena, con nombre, función, ubicación, actitud y un primer recuerdo. El cliente limita las altas a cinco por respuesta y 50 personajes por aventura, evita duplicados sin distinguir mayúsculas y mantiene sus recuerdos dentro del estado de cada personaje. Las siguientes respuestas pueden ampliar esa memoria mediante `characterMemoriesToAdd`.

El modelo no puede crear un personaje solo mediante el campo de recuerdos: primero debe estar registrado como personaje nuevo o existir previamente. La prueba de navegador simula la entrada de Tomás en escena, añade su memoria inicial y registra un segundo recuerdo después de otra acción; ambos quedan guardados tras recargar.


## Actualización de ubicación y actitud de personajes — 12 de noviembre de 2026

El esquema incorpora `characterUpdates` para que el narrador pueda actualizar la ubicación y actitud de personajes ya registrados. Solo se aplican entradas cuyo nombre coincide con un personaje existente; se ignoran nombres desconocidos y campos vacíos. Se limitan los cambios a diez por respuesta. Esto evita que un NPC permanezca indefinidamente en una ubicación antigua después de desplazarse o que su disposición ignore acontecimientos recientes.

La prueba automatizada cambia la actitud de Elia y mueve a Tomás a la entrada de la posada, y comprueba que ambos cambios permanecen en la partida.


## Actualización inmediata de cabecera — 12 de noviembre de 2026

Después de guardar cada acción, la interfaz vuelve a leer la aventura persistida y actualiza inmediatamente la ubicación, el momento del día y la jornada en la cabecera del manuscrito. No hace falta recargar la página para ver los cambios de tiempo o desplazamiento. La prueba de Chromium comprueba el cambio a «Mediodía» en la misma sesión y vuelve a comprobarlo después de recargar.


## Protección contra retrocesos del calendario — 12 de noviembre de 2026

El cliente aplica una regla adicional de continuidad: `state.day` nunca puede ser inferior al día que ya estaba guardado. Si el modelo devuelve por error un día anterior, se conserva el día alcanzado. El valor sigue limitado al intervalo 1–9999. La prueba automatizada de Chromium incluye una regresión deliberada del modelo (día 2 seguido de día 1) y exige conservar el día 2.
