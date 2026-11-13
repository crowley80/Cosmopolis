# Arquitectura propuesta: motor de mundo vivo

Fecha de preparación: 13 de noviembre de 2026  
Estado: diseño técnico preparado; todavía no integrado en el código de ejecución.  
Base consultada: rama `main` disponible en GitHub, cuyo estado llega al 12 de noviembre de 2026. La copia local de Termux contiene avances posteriores (incluido el guardado de `aiUsed` el 13/11) y es la referencia prioritaria para cualquier implementación. Esta propuesta no modifica ni reemplaza esos archivos.

## 1. Objetivo

Convertir el mundo de Cosmopolis en un sistema persistente que pueda cambiar por las acciones del jugador y por las iniciativas de sus habitantes, sin convertirlo en una simulación descontrolada ni en una sucesión de eventos arbitrarios.

El mundo debe cumplir las decisiones ya aprobadas:

- Libertad de acción mediante texto libre; ninguna lista cerrada limita al jugador.
- Los personajes tienen personalidad, objetivos, memoria e iniciativa.
- Las relaciones evolucionan por experiencias concretas, no por contadores arbitrarios.
- Los acontecimientos y sus consecuencias persisten al guardar y cargar.
- El mundo avanza mientras la partida está abierta.
- Al cerrar la partida, el mundo se congela. No se simula tiempo offline.
- La narración solo comunica lo que el personaje jugador puede percibir, deducir o conocer.
- El modelo local ayuda a interpretar y narrar; el estado persistente y las reglas deterministas siguen siendo la fuente de verdad.

## 2. Diagnóstico de la base existente

En la versión remota consultada:

- `Session.addAction()` ya conserva acciones, respuestas, eventos, hechos, ubicaciones visitadas e inventario, con límites de retención.
- `Save.load()` normaliza las colecciones principales y `Save.save()` fusiona el estado superior y las relaciones.
- `Director.respond()` devuelve un estado de aventura actualizado, mantiene pistas, hechos conocidos, eventos y relaciones de Elia, y registra la última acción.
- El estado narrativo ya contempla personajes con objetivos y estados de objetivo, y el proyecto ha incorporado iniciativas de NPCs a la narración.
- Existen dos historiales de eventos con propósitos parcialmente solapados: `adventure.state.events` y `world.events`. La implementación futura debe definir una única fuente canónica y conservar adaptadores de lectura para partidas antiguas.

Esta base es suficiente para evolucionar de forma incremental. No conviene reemplazarla de golpe ni crear un segundo sistema de memoria paralelo.

## 3. Principios de arquitectura

### 3.1 Estado y narración separados

El estado del mundo se actualiza mediante funciones controladas y verificables. El narrador recibe una instantánea limitada y la expresa en prosa. Una frase generada por el modelo no se convierte por sí sola en un hecho persistente.

Flujo recomendado:

1. Recibir la acción libre del jugador.
2. Interpretar intención, objetivos y posibles sujetos/objetos.
3. Aplicar las consecuencias deterministas que estén justificadas.
4. Avanzar un paso de simulación del mundo.
5. Resolver las iniciativas elegibles de personajes no jugadores.
6. Construir el contexto narrativo desde el estado ya actualizado.
7. Generar la respuesta.
8. Validar y persistir cambios estructurados admitidos.
9. Mostrar únicamente la página narrativa actual, manteniendo el historial interno.

La llamada a la IA no debe ser responsable de inventar identificadores, modificar directamente relaciones ni sobrescribir el estado completo.

### 3.2 Una fuente canónica de verdad

El objeto `world` será el hogar de la simulación global. `adventure.state` conservará el estado local de la aventura y los campos de compatibilidad que todavía necesite el código actual.

No duplicar el mismo acontecimiento en varios lugares salvo que una copia sea una proyección explícita y reconstruible.

### 3.3 Simulación acotada y determinista

Cada acción aceptada representa una oportunidad de avance del mundo. Los acontecimientos internos pueden consumir pasos de simulación definidos por reglas, no por la duración real de una petición de red.

No usar intervalos permanentes para escribir el estado. Si en el futuro hay un reloj visual, será solo una representación; el guardado seguirá dependiendo de pasos discretos y comprobables.

### 3.4 Conocimiento limitado

Distinguir siempre entre:
- Hecho del mundo: ocurrió, independientemente de que el jugador lo sepa.
- Recuerdo de un personaje: lo percibió o se lo comunicaron.
- Conocimiento del jugador: llegó a la percepción o memoria del protagonista.
- Rumor: información transmitida por una fuente, con fiabilidad propia.
- Hipótesis: interpretación todavía no confirmada.

Nunca filtrar al contexto narrativo hechos privados de NPCs como si fueran conocidos por el protagonista.

## 4. Modelo de datos propuesto

Los campos son una propuesta compatible, no una orden para migrar toda la partida en una sola operación.

### 4.1 `world`

```js
world: {
  schemaVersion: 2,
  clock: {
    tick: 0,
    lastAdvancedAt: null
  },
  events: [],
  facts: [],
  characters: {},
  relationships: {},
  locations: {},
  pendingEvents: [],
  simulation: {
    lastProcessedTick: 0,
    maxEventsPerStep: 8
  }
}
```

- `clock.tick`: contador lógico de pasos de mundo; no equivale a segundos reales.
- `lastAdvancedAt`: marca técnica para diagnóstico, no habilita avance offline.
- `events`: registro canónico de sucesos confirmados.
- `facts`: hechos derivados o persistentes con fuente.
- `characters`: memoria y estado de cada NPC.
- `relationships`: vínculo entre pares de personajes.
- `locations`: estado de lugares y cambios persistentes.
- `pendingEvents`: eventos futuros programados por reglas.
- `simulation`: control de idempotencia y límites de trabajo.

### 4.2 Personaje no jugador

```js
world.characters[id] = {
  id,
  name,
  location,
  status: "active",
  goals: [{
    id,
    description,
    status: "active",
    priority: 0,
    motivation,
    progress: 0,
    blockers: [],
    createdAtTick: 0,
    updatedAtTick: 0
  }],
  memory: {
    episodes: [],
    beliefs: [],
    knownFacts: []
  },
  needs: {},
  schedule: null,
  lastActedTick: 0,
  initiative: {
    enabled: true,
    cooldownUntilTick: 0
  }
};
```

No es necesario que todos los NPCs tengan todos los campos desde el principio. Los datos actuales como `personalGoal`, `goalStatus`, `characterActions` y `trust` deben leerse mediante una capa de compatibilidad y migrarse gradualmente.

### 4.3 Memoria episódica

Cada recuerdo debe poder responder: quién estuvo implicado, qué pasó, cuándo (tick), dónde, qué fuente lo acredita y qué importancia tiene para ese personaje.

```js
{
  id,
  tick,
  type: "observed|experienced|told|inferred",
  summary,
  participants: [],
  location: null,
  sourceEventId: null,
  confidence: 1,
  importance: 1
}
```

No guardar cada frase de diálogo como recuerdo permanente. Priorizar promesas, ayudas, traiciones, amenazas, pérdidas, descubrimientos, acuerdos, conflictos y cambios de objetivo. Mantener un resumen reciente y recuerdos destacados con límites configurables.

### 4.4 Relaciones

La relación debe ser direccional: A puede confiar en B más de lo que B confía en A.

```js
world.relationships[characterA][characterB] = {
  trust: 0,
  respect: 0,
  affection: 0,
  fear: 0,
  hostility: 0,
  history: []
};
```

No reducir las relaciones a un único valor de amistad. Una persona puede respetar al protagonista y temerlo al mismo tiempo. Cada variación debe apuntar a un evento o recuerdo; evitar sumar puntos por repetir una palabra o una acción sin contexto.

### 4.5 Eventos

```js
{
  id,
  tick,
  type,
  summary,
  participants: [],
  location: null,
  causes: [],
  consequences: [],
  visibility: "public|local|private|secret",
  status: "confirmed|rumor|cancelled"
}
```

Los eventos deben tener causa y consecuencias rastreables. Una iniciativa de NPC no es un hecho hasta que se resuelve y se registra. Los eventos secretos no deben filtrarse al narrador del jugador sin una vía de conocimiento.

## 5. Ciclo de simulación

### Paso A — Acción del jugador

La acción libre sigue siendo prioritaria. El intérprete extrae, cuando sea posible, intención, objetivo, persona, lugar y tono. Si hay ambigüedad, el motor no debe fingir que ha ejecutado una acción precisa: puede pedir aclaración narrativamente o describir un resultado limitado y reversible.

### Paso B — Aplicación de consecuencias

Aplicar únicamente consecuencias justificadas por el estado, capacidades, objetos, ubicación y hechos conocidos. Las acciones fallidas también pueden producir ruido, sospechas, gasto de tiempo o reacciones, pero no deben conceder automáticamente el resultado buscado.

### Paso C — Avance del reloj lógico

Incrementar `world.clock.tick` una sola vez por acción que realmente se haya procesado. Las respuestas duplicadas, reintentos de red o recargas no deben incrementar el reloj otra vez. Usar un identificador de operación o una marca de acción procesada para garantizar idempotencia.

### Paso D — Eventos pendientes

Procesar eventos cuyo `dueTick` sea menor o igual al tick actual, en orden estable:
1. prioridad;
2. tick programado;
3. identificador.

Aplicar un límite máximo por paso para evitar bucles o bloqueos. Si quedan eventos, continúan en el siguiente paso. No eliminar un evento hasta haber aplicado sus consecuencias o marcado su cancelación.

### Paso E — Iniciativas de NPCs

Un NPC puede actuar si:
- está activo y puede actuar;
- su objetivo o situación lo justifica;
- no está en periodo de enfriamiento;
- existe una oportunidad concreta;
- la acción no contradice una restricción conocida.

Elegir un número pequeño de iniciativas por paso y priorizar las cercanas o relevantes para la escena. No hacer que todos los habitantes actúen en cada turno. Las acciones pueden ocurrir fuera de la vista, pero se registran con visibilidad adecuada y solo se narran al jugador si las percibe o descubre.

### Paso F — Contexto narrativo

Preparar una instantánea compacta:
- ubicación y escena actual;
- personajes perceptibles;
- eventos recientes que el protagonista conoce;
- recuerdos relevantes de los NPCs presentes;
- relaciones conocidas;
- iniciativas visibles que acaban de ocurrir;
- límites de conocimiento y continuidad.

No enviar toda la base histórica al modelo. Seleccionar por relevancia, cercanía, recencia e importancia.

### Paso G — Persistencia

Guardar el estado actualizado de forma atómica en el guardado existente. Si falla la generación narrativa después de aplicar el paso, el sistema debe conservar un estado coherente y poder reintentar la narración sin volver a procesar la acción ni duplicar eventos.

## 6. Tiempo y congelación al cerrar

El diseño aprobado establece que el mundo se congela al cerrar la partida.

Por tanto:
- No calcular ticks a partir de `Date.now() - lastAdvancedAt` al volver a cargar.
- No ejecutar eventos atrasados por tiempo offline.
- Al cargar, restaurar exactamente el último tick guardado.
- Reanudar el avance con la siguiente acción del jugador.
- Los tiempos de espera, viajes y descansos dentro del juego pueden consumir varios ticks explícitos, si el sistema narrativo los establece.
- La marca real de guardado sirve para diagnóstico y recuperación, no para simular acontecimientos mientras la app está cerrada.

## 7. Memoria y relevancia

Orden recomendado de retención:
1. Hechos permanentes y consecuencias irreversibles.
2. Objetivos actuales y bloqueos.
3. Recuerdos personales de gran importancia.
4. Recuerdos recientes de la escena.
5. Conversación de baja importancia, resumible o descartable.

Los recuerdos archivados pueden compactarse en resúmenes, pero no borrar hechos esenciales ni alterar el sentido de promesas, deudas, amenazas, relaciones o consecuencias. La compactación afecta al contexto enviado a la IA, no a la verdad persistida.

## 8. Compatibilidad y migración

La migración debe ser incremental y no destructiva:

1. Si `world.schemaVersion` no existe, tratar la partida como versión anterior.
2. Crear `clock`, `characters`, `locations` y `pendingEvents` con valores seguros.
3. Importar NPCs conocidos desde las estructuras ya existentes, sin duplicar entidades.
4. Convertir los objetivos simples actuales en una lista de objetivos cuando proceda, preservando texto y estado.
5. Mantener los recuerdos existentes de `characterActions` como episodios de compatibilidad hasta que se complete una migración verificada.
6. Elegir una fuente canónica para eventos y exponer adaptadores para consumidores antiguos.
7. No eliminar campos antiguos en la primera versión.
8. Guardar una copia de seguridad antes de cualquier migración destructiva; preferiblemente, hacer que la migración sea reversible.

Las partidas antiguas deben seguir cargando aunque falten campos, haya arrays nulos o existan valores de relación en formatos anteriores.

## 9. Pruebas de regresión obligatorias

Antes de integrar el motor en la partida:

- Cargar una partida antigua sin `schemaVersion` y comprobar que no pierde personaje, aventura, acciones ni relaciones.
- Procesar una acción una vez y comprobar que el tick aumenta exactamente uno.
- Repetir la misma operación por reintento y comprobar que no duplica el evento ni el tick.
- Cerrar y volver a cargar: el tick y los eventos deben permanecer idénticos; no debe ocurrir ningún avance offline.
- Programar un evento para el siguiente tick y comprobar que se ejecuta una sola vez.
- Programar dos eventos simultáneos y comprobar el orden determinista.
- Superar el límite de eventos por paso y comprobar que el resto permanece pendiente.
- Comprobar que un NPC no actúa si está inactivo, bloqueado o en cooldown.
- Comprobar que un NPC recuerda una traición y que otro personaje no recibe ese recuerdo sin una fuente.
- Comprobar que el protagonista no conoce un evento privado ocurrido fuera de escena.
- Comprobar que una relación puede ser asimétrica.
- Comprobar que la compactación de memoria no elimina hechos permanentes ni altera objetivos cumplidos.
- Comprobar que la interfaz sigue mostrando solo la narración actual y conserva el historial de acciones.
- Ejecutar las pruebas con respuestas simuladas y, por separado, validar la inferencia real con el modelo local.

## 10. Plan de implementación incremental

**Fase 0 — Diseño y contratos (este documento).**  
Definir fuente de verdad, esquema, reglas de tiempo, memoria y pruebas. No tocar todavía el flujo de ejecución.

**Fase 1 — Normalización segura.**  
Añadir un módulo puro de normalización/migración de estado. Pruebas de partidas antiguas y nuevas. Sin iniciativas autónomas todavía.

**Fase 2 — Reloj lógico y eventos.**  
Implementar tick idempotente, cola de eventos y resolución acotada. Mantener congelación offline.

**Fase 3 — Memoria individual y relaciones.**  
Unificar recuerdos episódicos, objetivos y vínculos con fuentes y niveles de conocimiento.

**Fase 4 — Iniciativas de NPCs.**  
Convertir los sistemas actuales de iniciativa en acciones estructuradas, condicionadas por objetivos, localización, cooldown y oportunidades.

**Fase 5 — Integración narrativa.**  
Entregar al narrador solo el contexto pertinente y las consecuencias perceptibles. Validar que la prosa no inventa cambios de estado.

**Fase 6 — Mundo y localizaciones.**  
Añadir cambios persistentes en lugares, rumores y acontecimientos encadenados, sin aumentar innecesariamente la carga de inferencia.

No saltar de fase si las pruebas de compatibilidad y persistencia anteriores no pasan.

## 11. Decisiones que no deben alterarse sin autorización

- Cosmopolis sigue siendo una aventura abierta y de texto libre.
- No hay avance del mundo mientras la partida está cerrada.
- No depender de Gemini ni de servicios de pago.
- El modelo local no es la fuente de verdad del estado.
- La interfaz sigue siendo textual, vertical y optimizada para móvil, con narración arriba y entrada de acciones abajo.
- El documento maestro sigue siendo la referencia de continuidad del proyecto.

## 12. Estado de este trabajo

Se ha preparado la arquitectura, el esquema inicial, las reglas de simulación, el plan de migración y la batería de pruebas. No se han modificado archivos de ejecución ni se ha afirmado que el motor esté implementado o probado en el dispositivo.

La rama de trabajo se ha separado de `main` porque el repositorio remoto consultado no contiene el último cambio local de `aiUsed` documentado el 13/11/2026. Antes de integrar esta propuesta, hay que reconciliar la rama con el estado local actualizado para no sobrescribir avances recientes.


## 13. Vistas de conocimiento aisladas

El módulo experimental `app/js/game/knowledge.js` separa los registros de conocimiento por `actorId`. Cada entrada exige `id`, `content`, `type` (`fact|rumor|belief|secret`) y `source` (`perceived|communicated|inferred`); conserva confianza acotada entre 0 y 1, tick, emisor y localización opcionales. La vista de escena filtra por actor y localización. Un ID ya registrado no se vuelve a insertar.

**Límite de seguridad:** el módulo no conoce la verdad canónica ni la consulta. Esto es deliberado: el motor que lo invoque debe decidir, con reglas comprobables, qué observó, recibió o pudo inferir cada actor. No se debe copiar el estado completo del mundo a una entrada de conocimiento ni confiar en instrucciones del prompt para ocultarlo. Un rumor permanece como rumor y una inferencia conserva su fuente.

El módulo es experimental, no se carga desde `index.html` y no está conectado al narrador ni al guardado. Sus doce pruebas están escritas, pero aún requieren ejecución en un checkout real y posterior validación en Termux.



## 14. Comunicación e inferencia con evidencia

El módulo incorpora dos operaciones explícitas adicionales:

- `communicateKnowledge`: el emisor selecciona IDs concretos de su propia memoria. Solo esos registros se copian al receptor, con fuente `communicated`, emisor y tick. No se transfiere la memoria completa. Los rumores y creencias conservan su tipo y confianza; comunicar un rumor no lo confirma.
- `recordInference`: exige que todas las evidencias citadas ya pertenezcan al actor. La conclusión se registra como `belief` con fuente `inferred` y referencias a sus evidencias. El módulo no valida la lógica de la deducción ni la convierte en verdad canónica.

La comunicación es una operación explícita del motor: la capa superior debe decidir qué se dijo realmente y qué información incluyó el mensaje. No se debe invocar con todos los IDs del emisor ni inferir que una conversación transfiere automáticamente toda su memoria.


## 15. Registro de percepción explícita

Se añade `app/js/game/perception.js` como adaptador experimental entre observaciones espaciales y memoria individual. Solo registra un estímulo cuando el actor aparece en `observerIds`, lista que debe producir previamente el motor tras resolver línea de visión, alcance, audición, atención y condiciones de escena. Cada observación genera una entrada individual con fuente `perceived`.

El módulo **no calcula** quién puede ver u oír: no dispone de geometría ni de estado espacial y no debe inventarlos. La lista de observadores es una frontera de confianza que corresponde al motor espacial. No se debe construirla copiando todos los personajes presentes sin comprobar los sentidos, obstáculos, distancia y circunstancias.


## 16. Orden de carga previsto (todavía no integrado)

Cuando se reconcilie la rama con la copia móvil, el orden de dependencias de estos módulos será:

1. `world-core.js`: normalización y pasos idempotentes del mundo.
2. `knowledge.js`: registros y vistas de conocimiento por actor.
3. `perception.js`: adaptador que registra estímulos usando `CosmopolisKnowledge`; requiere que el módulo anterior esté cargado.
4. Motor espacial: resuelve quién puede percibir cada estímulo y entrega la lista explícita de observadores.
5. Motor de turno: aplica comunicación, inferencias, consecuencias y persistencia mediante operaciones idempotentes.
6. Narrador: recibe únicamente la vista de escena del protagonista, nunca el estado canónico ni memorias privadas de otros actores.

Este orden es una especificación de dependencias, no una modificación de `index.html`. No añadir aún etiquetas `script` ni activar los módulos en la aplicación.

## 17. Reglas explícitas de elegibilidad perceptiva

Se añade el módulo experimental puro `app/js/game/perception-rules.js`. A partir de actores y estímulos declarados, produce `observerIds` para alimentar el adaptador `perception.js`.

Reglas aplicadas:
- La primera versión exige coincidencia exacta de `locationId`; no permite percepción entre localizaciones.
- El actor debe tener habilitado explícitamente el sentido correspondiente (`sight`, `hearing`, `smell`, `touch` u `other`).
- Las listas opcionales `visibleTo`, `audibleTo`, `smellableTo`, `reachableBy` y `availableTo` actúan como listas de autorización cuando están presentes.
- `concealedFrom` y `blockedFor` excluyen actores concretos.
- Los estímulos con `requiresAttention` exigen `attentiveActorIds`, o en su ausencia `actor.attention === true`.
- La salida es determinista y elimina IDs de actor duplicados.

Límite deliberado: no calcula distancias, geometría, línea de visión, paredes, propagación acústica, viento, ni atención psicológica. La capa de escena debe aportar esas restricciones mediante las listas explícitas; la ausencia de una lista no demuestra que exista línea de visión ni alcance físico. Este módulo solo resuelve elegibilidad con los datos proporcionados. No está integrado en el runtime.
## 18. Contrato de extremo a extremo de percepción

Se añade `scripts/test-perception-pipeline.js` para comprobar la conexión lógica entre `perception-rules.js`, `perception.js` y `knowledge.js`: los observadores elegibles reciben recuerdos individuales, las listas de visibilidad excluyen actores presentes y los canales sensoriales generan recuerdos diferenciados. Es una prueba de contrato aislada; no implica que el flujo esté conectado a la aplicación.

## 19. Agenda de eventos futuros por ticks lógicos

Se añade el módulo puro experimental `app/js/game/world-scheduler.js`. Mantiene una agenda persistible con `id`, `dueTick`, `status` y `payload`, sin temporizadores ni reloj de pared.

Operaciones:
- `scheduleEvent`: registra un evento pendiente con ID único y tick lógico de vencimiento.
- `cancelEvent`: cancela únicamente eventos pendientes.
- `collectDueEvents`: entrega una sola vez los eventos cuyo `dueTick` ya se ha alcanzado y los marca como `fired`.
- `normalizeScheduledEvents`: normaliza registros y conserva campos de extensión.

La agenda se ordena por tick e ID para que el resultado sea determinista. La capacidad máxima es 500 entradas; al llenarse, las nuevas altas se rechazan sin borrar eventos ya programados. Si una agenda heredada supera el límite, la normalización conserva los 500 vencimientos más próximos.

El scheduler no avanza el reloj ni se ejecuta en segundo plano: el motor de turnos debe llamarlo después de un paso lógico válido y persistir el resultado junto con el estado del mundo. Por tanto, al cerrar la partida no se consumen eventos ni se simula tiempo offline. El scheduler entrega eventos como datos; la capa superior aún debe validar sus consecuencias, permisos, causalidad y conocimiento de los personajes. No está integrado en runtime.

## 20. Selección acotada de iniciativas autónomas de NPC

Se añade `app/js/game/npc-initiative.js`, un módulo puro que selecciona qué personajes no jugadores pueden proponer una iniciativa en un tick. No genera la acción ni ejecuta IA: aplica condiciones verificables y devuelve una lista mínima para el motor superior.

Condiciones: el actor debe figurar en `eligibleActorIds` entregado explícitamente por el motor; no ser el jugador; no estar marcado como no autónomo o fallecido; tener objetivo personal no vacío y no completado, abandonado, fallido o pausado; y haber alcanzado `nextInitiativeTick`. La selección es determinista, con cursor rotatorio para repartir oportunidades. Por defecto selecciona un actor por tick y nunca permite superar cinco.

`markInitiative` registra `lastInitiativeTick` y `nextInitiativeTick` con un periodo de espera lógico, rechazando una segunda marca en el mismo tick. No altera el actor original.

La elegibilidad de escena y el avance del tick pertenecen al motor de turnos. Este módulo no decide si un NPC puede actuar fuera de escena, no crea objetivos, no resuelve consecuencias y no accede a información privada de otros personajes. No está integrado en runtime.

