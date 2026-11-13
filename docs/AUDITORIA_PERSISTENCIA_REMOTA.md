# Auditoría preliminar de persistencia e idempotencia

Fecha: 13 de noviembre de 2026  
Alcance: lectura estática de la instantánea remota disponible en `work/arquitectura-mundo-vivo`. No representa todavía la copia más reciente de Termux. No se ha modificado código de ejecución ni se han ejecutado pruebas.

## 1. Archivos revisados

- `app/js/game/character.js`
- `app/js/core/save.js`
- `app/js/game/session.js`
- `app/js/app.js`

## 2. Hallazgos

### P-01 — La creación/edición de personaje reemplaza el objeto de personaje completo

En la instantánea revisada, `Character.create(data)` construye un objeto nuevo con los campos del formulario y llama a `Save.save({ character })`.

**Qué significa:** no reemplaza toda la partida. La función `Save.save()` parte del guardado actual y mezcla las propiedades superiores, por lo que conserva `adventure`, `actions` y `world`. Sin embargo, sí reemplaza íntegramente `current.character`. Cualquier propiedad adicional del personaje que no esté en el formulario —por ejemplo, metadatos futuros, estado persistente o extensiones de otros sistemas— desaparecería al editarlo.

**Riesgo:** pérdida parcial de datos del personaje, no borrado completo de la partida.

**Solución futura:** separar explícitamente creación inicial y actualización de perfil. La actualización debe fusionar solo los campos editables con el personaje guardado, preservando identificadores y propiedades de sistema. No aplicar hasta comprobar el código local actualizado y sus llamadas.

### P-02 — Las acciones no tienen clave de idempotencia

En la instantánea revisada, `Session.addAction()` siempre añade una entrada a `saved.actions` y un evento a `saved.world.events`. La operación no recibe un ID estable ni comprueba si la misma acción ya fue procesada.

**Qué significa:** si una operación se repite tras un timeout, una respuesta perdida o un reintento manual, puede duplicar la acción y sus efectos de registro. La interfaz deshabilita el formulario durante la petición, lo que reduce el doble toque, pero no resuelve reintentos de red ni respuestas cuyo guardado haya ocurrido antes de perderse la conexión.

**Riesgo:** duplicación del historial, eventos repetidos y, cuando se incorpore el reloj lógico, avance múltiple del mundo por una sola intención del jugador.

**Solución futura:** asignar un `operationId` antes de iniciar la petición, conservarlo durante los reintentos y registrar los IDs procesados en el guardado. La operación debe devolver el resultado existente cuando recibe un ID ya aplicado. El registro debe actualizarse de forma atómica junto con los cambios del mundo.

### P-03 — El flujo actual genera antes de persistir la acción

En la instantánea revisada, el formulario llama a `Narrator.respond()` y, cuando recibe respuesta, llama a `Session.addAction()`. La persistencia de la acción sucede después de la generación narrativa.

**Qué significa:** si el narrador falla antes de devolver respuesta, la acción no se registra en el historial. Si el mundo se modifica en memoria durante la generación o antes de guardar, hay que comprobar que esos cambios no se pierden ni se aplican dos veces al reintentar.

**Riesgo:** separación entre intención enviada, efectos estructurados y respuesta narrativa; especialmente delicado cuando la IA y el motor compartan objetos mutables.

**Solución futura:** definir una operación de turno con fases explícitas y un registro durable de estado (recibida, resuelta, narrada). La fase de efectos debe ser determinista e idempotente; la narración debe poder reintentarse sin volver a ejecutar los efectos.

### P-04 — La fusión de relaciones solo combina el primer nivel

En `Save.save()`, `world.relationships` se fusiona con spread del objeto superior. Si las relaciones están organizadas como `relationships[A][B]`, una actualización parcial de A puede sustituir el subobjeto completo de A y descartar vínculos B→C que no vengan en el objeto entrante.

**Riesgo:** pérdida de relaciones cuando se guarde una actualización parcial por personaje.

**Solución futura:** definir una función de fusión consciente de la estructura, o guardar cambios de relación mediante operaciones explícitas por par de personajes. Añadir una prueba donde se actualice A→B y se compruebe que A→C y todas las relaciones inversas permanecen intactas.

### P-05 — La sustitución completa de guardado es una operación destructiva

`Save.replace(data)` crea un guardado a partir de `data` y valores por defecto. `Session.startNewAdventure()` archiva primero el texto del guardado anterior y verifica que la copia archivada coincide antes de reemplazarlo.

**Qué significa:** el camino de nueva aventura contiene una protección previa útil. Aun así, cualquier nuevo uso directo de `Save.replace()` debe considerarse destructivo y restringirse a flujos explícitos de sustitución de partida.

**Solución futura:** mantener `replace` como operación excepcional, exigir una copia verificada cuando exista guardado previo y evitar usarla para actualizaciones parciales.

## 3. Aspectos positivos observados

- `Save.save()` conserva propiedades superiores no incluidas en una actualización parcial.
- `Save.save()` preserva eventos y hechos si el objeto entrante no proporciona esas colecciones.
- `Session.startNewAdventure()` archiva y verifica el guardado anterior antes de iniciar la sustitución.
- La interfaz deshabilita temporalmente el formulario durante la petición narrativa.
- El historial interno conserva la acción y su respuesta, aunque la pantalla muestre solo la página narrativa actual.

## 4. Orden de corrección recomendado

1. Reconciliar la copia local actualizada de Termux con esta instantánea remota.
2. Añadir pruebas de regresión de guardado y edición de personaje antes de cambiar `Character.create()`.
3. Introducir `operationId` y pruebas de idempotencia antes de incorporar el reloj del mundo.
4. Revisar si `Narrator.respond()` modifica objetos recibidos por referencia y aislar la mutación del estado.
5. Corregir la fusión de relaciones con pruebas de preservación de pares no modificados.
6. Mantener la protección de archivo previo al crear una aventura nueva y cubrirla con una prueba de fallo de almacenamiento.

## 5. Qué no se ha concluido

- No se ha demostrado que la copia local actual de Termux conserve exactamente estos mismos comportamientos.
- No se ha demostrado que `Narrator.respond()` mutile el objeto de aventura; requiere inspección específica.
- No se han ejecutado pruebas automatizadas ni pruebas en el dispositivo.
- No se ha modificado ningún archivo de runtime.

Esta auditoría es una guía de revisión para la integración segura, no una autorización para copiar los archivos remotos encima de la instalación local.
