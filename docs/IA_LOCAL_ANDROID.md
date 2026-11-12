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


## Relaciones dinámicas de personajes — 12 de noviembre de 2026

El contrato JSON sustituye el ajuste exclusivo `eliaTrustDelta` por `relationshipChanges`, aplicable a cualquier NPC que ya exista en `adventure.state.characters`. Cada cambio contiene el nombre del personaje, un delta entero entre -1 y 1 y un motivo breve. El cliente ignora nombres desconocidos y cambios fuera de rango, limita cada respuesta a diez modificaciones y acota la confianza entre -5 y 10. El motivo se incorpora a la memoria individual del personaje, sin duplicados y conservando los 30 recuerdos más recientes. En el caso de Elia se mantiene sincronizado el campo heredado `eliaTrust`.

La prueba de Chromium simula cambios de relación de Elia y Tomás y verifica la persistencia de puntuaciones y recuerdos. La inferencia real del modelo Qwen3.5-4B sigue pendiente de validación en el Samsung.


## Contexto acotado para modelos locales — 12 de noviembre de 2026

Para reducir el riesgo de superar el contexto disponible en Qwen3.5-4B, `Narrator.buildMessages()` construye una vista compacta sin modificar la partida persistida. Prioriza personajes de la ubicación actual y Elia, incluye hasta 20 NPCs, ocho recuerdos por personaje, 20 eventos, 25 hechos y pistas, 30 objetos, 25 ubicaciones y seis acciones recientes. También limita la longitud de campos de ficha y texto histórico.

La prueba automatizada amplía deliberadamente los recuerdos/eventos de una copia temporal y comprueba los límites del mensaje enviado al modelo, además de verificar que la copia original conserva todos sus recuerdos. La compactación no borra datos de la partida.


## Iniciativa autónoma en escena — 12 de noviembre de 2026

El esquema del narrador añade `characterActions`, una lista de hasta dos acciones cortas de NPCs ya registrados. El cliente resuelve el nombre contra el estado persistido y solo acepta acciones si el personaje está en la ubicación actual (o no tiene ubicación asignada). No actualiza ubicación con este campo. La acción se añade al texto narrativo, se guarda en `lastAutonomousAction` y se incorpora a la memoria individual, con límite de 30 recuerdos. De esta forma se admiten iniciativas pequeñas visibles sin permitir que el modelo mueva personajes fuera de escena.

La prueba automatizada comprueba que la iniciativa de Elia se persiste en su memoria y estado, y que se rechaza una iniciativa de Tomás después de que su ubicación haya cambiado fuera de la escena. No equivale a validar la calidad de las decisiones generadas por Qwen3.5-4B en Android.


## Objetivos personales persistentes — 12 de noviembre de 2026

Los personajes registrados pueden conservar un `personalGoal` breve que expresa un deseo, problema o motivación. El arranque de la aventura asigna a Elia el propósito de descubrir el origen de la campana y su relación con los mapas. Los NPC nuevos pueden recibir un objetivo inicial opcional al entrar en escena.

El contrato del narrador incorpora `goalUpdates`: hasta dos cambios por respuesta, cada uno con personaje, nuevo objetivo y motivo. El cliente solo actualiza personajes ya registrados, ignora objetivos vacíos o desconocidos, conserva un historial acotado de diez cambios con el número de acción y añade el motivo a la memoria individual (máximo 30 recuerdos). El objetivo actual viaja dentro del contexto compacto porque forma parte de la ficha persistida del personaje; así puede orientar sus diálogos e iniciativas posteriores sin crear misiones obligatorias para el jugador.

La prueba de Chromium simula la evolución del objetivo de Elia, asigna y modifica el de Tomás, verifica el historial y la memoria, y comprueba que un nombre inexistente no crea ni modifica personajes. La prueba valida el procesamiento del cliente con respuestas simuladas; la calidad de la evolución de objetivos en Qwen3.5-4B debe comprobarse en el Samsung.


### Objetivos que influyen en conversaciones e iniciativas — 12 de noviembre de 2026

Se refuerza el uso activo de `personalGoal`: el prompt de la IA local pide que los objetivos orienten iniciativas visibles sin forzar avances ni repetir acciones. El narrador alternativo también incorpora el objetivo de Elia cuando conversa con ella y permite que otros NPCs presentes expresen su motivación al ser preguntados por su nombre. Se añade una regresión automatizada que comprueba que el narrador alternativo menciona el objetivo persistido de Tomás en una conversación dirigida a él. Esta prueba verifica la lógica determinista; la generación contextual del modelo local debe validarse en el dispositivo.


Ajuste de legibilidad — 12 de noviembre de 2026: el narrador alternativo expresa el objetivo de un NPC con una frase directa y conserva literalmente el objetivo almacenado. Se renueva la caché de `director.js`.


Ajuste de selección de diálogo — 12 de noviembre de 2026: la ruta alternativa reconoce al NPC presente por su nombre y puede expresar su objetivo sin depender de una lista cerrada de expresiones interrogativas.


### Estados de progreso de objetivos personales — 12 de noviembre de 2026

Los objetivos incorporan `goalStatus` con cuatro estados controlados: `active`, `progress`, `blocked` y `completed`. La IA puede actualizar el estado sin cambiar el objetivo, o modificar ambos cuando la historia lo justifica. Cada transición se guarda en `goalHistory` junto con el motivo y el número de acción; los cambios de estado también quedan en la memoria del personaje. El narrador alternativo adapta la forma de hablar del NPC según el estado, evitando presentar como pendiente un objetivo ya cumplido o ignorar un bloqueo. Las pruebas verifican el progreso de Elia y el bloqueo temporal de Tomás.

### Archivo y renovación de objetivos personales — 12 de noviembre de 2026

Se refuerza el ciclo de vida de las metas para que un NPC no abandone un propósito pendiente por una propuesta arbitraria del modelo. Los objetivos en estado activo, progreso o bloqueo conservan su texto; un bloqueo puede avanzar a progreso, pero no retroceder a activo. Un objetivo completado queda cerrado y no puede reabrirse. Solo después de completarlo se admite una meta distinta en estado activo, con un motivo que explique la conexión narrativa y el nuevo propósito.

Cada personaje mantiene `completedGoals`, un archivo independiente de hasta 20 metas cumplidas con su motivo y número de acción. `goalHistory` conserva las diez transiciones más recientes y `completedGoals` evita que el archivo de metas cerradas dependa de ese historial limitado. Las partidas antiguas se adaptan al vuelo cuando se procesa el siguiente cambio de objetivo, sin exigir migración ni borrar datos.

La regresión automatizada simula tres casos: completar una meta y abrir otra archivando la anterior; rechazar la sustitución de una meta aún en progreso; y evitar que una meta completada vuelva a estado activo. La prueba utiliza respuestas simuladas y no valida por sí sola la calidad narrativa de Qwen3.5-4B en el dispositivo.

### Archivo de metas cumplidas en el contexto de IA — 12 de noviembre de 2026

`Narrator.buildMessages()` incorpora al contexto hasta cinco transiciones recientes de `goalHistory` y ocho entradas de `completedGoals`, con objetivo y motivo. Las instrucciones piden evitar repetir metas archivadas sin una motivación nueva respaldada por hechos. Los límites se aplican exclusivamente a la copia compacta enviada al modelo; los datos completos de la partida permanecen intactos. La prueba de Chromium comprueba el límite de ocho entradas y que las diez metas originales continúan guardadas.

### Validación del archivo de metas en el contexto — 12 de noviembre de 2026

Las ejecuciones #98, #99, #100 y #101 de GitHub Actions finalizaron correctamente. La prueba #101, sobre el commit `75eb4b4`, completó las interacciones de Chromium, el guardado y la recarga, y verificó el encaje del diseño móvil en 390 × 844. La prueba específica del contexto confirma que se transmiten como máximo ocho metas cumplidas y cinco transiciones recientes, sin recortar los datos persistidos. La validación de Chromium emplea respuestas simuladas: no sustituye la prueba real de generación, esquema JSON y persistencia con Qwen3.5-4B en el Samsung.
