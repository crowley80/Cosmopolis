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

## 21. Contexto individual de NPC con allowlist

Se añade `app/js/game/npc-context.js` para construir el contexto que una futura llamada narrativa podrá recibir para un NPC. No acepta el objeto mundo ni serializa el personaje completo. Copia únicamente campos permitidos del propio actor (identidad, descripción, rasgos, objetivo propio, estado de objetivo, tarea y localización), una descripción de escena ya filtrada que debe entregar el motor, y el conocimiento de ese actor producido por `CosmopolisKnowledge.buildSceneKnowledge`.

Rechaza actores sin ID, escenas de otra localización o ausencia del módulo de conocimiento. No incorpora automáticamente personajes cercanos, pensamientos privados, secretos internos arbitrarios ni datos globales. Los secretos que el propio NPC conoce solo pueden entrar a través de sus registros de conocimiento individuales.

El límite de confianza sigue siendo importante: `sceneView.description` debe ser una descripción previamente autorizada por el motor; este módulo no puede certificar la veracidad ni el filtrado de una cadena que recibe. No está conectado al narrador ni al runtime.



## 22. Corrección de integridad del scheduler — 13 de noviembre de 2026

La revisión directa del archivo detectó dos discrepancias entre el contrato documentado y la implementación: un escape literal de salto de línea en el comparador de ordenación, que podía invalidar la sintaxis JavaScript, y la ausencia del rechazo por capacidad que ya esperaba la prueba correspondiente. Se corrigen ambos puntos en `app/js/game/world-scheduler.js`: el comparador vuelve a tener saltos de línea reales y `scheduleEvent` devuelve `reason: "capacity"` sin modificar la agenda cuando ya contiene 500 entradas. La corrección mantiene los eventos existentes y no introduce reloj real ni ejecución en segundo plano.

La prueba de capacidad ya estaba presente en `scripts/test-world-scheduler.js`; queda pendiente ejecutarla en un checkout real de la rama. Esta corrección está en la rama aislada y no se ha copiado a Termux ni integrado en `main`.


## 23. Validación causal de propuestas NPC

Se añade `app/js/game/npc-proposal.js`, un módulo puro que registra propuestas estructuradas de iniciativa como eventos pendientes sin invocar IA ni redactar narración. Exige ID de propuesta, actor, tick idéntico al tick lógico actual, causa explícita, tipo y descripción. También exige que el actor figure en la lista explícita de elegibles y que siga vivo, sea autónomo, no sea el jugador y conserve un objetivo activo. Si se proporciona localización, debe coincidir con la del actor.

La operación es idempotente por ID de propuesta mientras permanezca en el registro de las últimas 500 propuestas, y también comprueba el ID del evento resultante. Conserva campos desconocidos del mundo y no muta el objeto recibido. Rechaza la operación si el historial de eventos ya alcanza 200 entradas, sin descartar eventos existentes. Cada evento queda marcado como pendiente, con actor, causa, localización y payload estructurado.

El módulo no decide si la acción propuesta es físicamente posible ni si su consecuencia es verdadera; eso corresponde al futuro validador de acciones y al motor de mundo. Tampoco se conecta todavía al runtime.


## 24. Ciclo de resolución de eventos

Se añade `app/js/game/world-event-resolution.js` para controlar las transiciones terminales de eventos pendientes. La operación exige un evento existente en estado `pending`, un `operationId` único, tick lógico válido, resultado terminal (`applied`, `cancelled` o `failed`) y resumen estructurado. Si se marca como aplicado, exige referencias explícitas a los efectos registrados. La transición conserva la causa y los datos originales del evento, añade el registro de resolución y no muta el mundo recibido.

Este módulo solo registra el resultado y sus referencias: **no ejecuta ni aplica los efectos** sobre hechos, relaciones, personajes o localizaciones. Esa separación es intencionada; la aplicación real de efectos requiere un catálogo de operaciones tipadas y validadores de dominio para no permitir mutaciones arbitrarias. Los reintentos con el mismo operationId se rechazan y no se permite reabrir un evento terminal. El módulo permanece aislado del runtime.


## 25. Plan de integración del runtime

Se crea `docs/PLAN_INTEGRACION_MUNDO_VIVO.md`, que identifica los puntos de entrada observados en `index.html`, `Session.addAction` y `Narrator.buildMessages`, y ordena la integración en etapas: reconciliación de Termux, contrato de persistencia/idempotencia, allowlists de conocimiento, percepción, scheduler, iniciativas, resolución y efectos tipados, y pruebas de partida completa. Se documentan riesgos concretos de la instantánea remota: ausencia de operationId en `Session.addAction`, dos historiales de eventos, spreads de objetos completos en el contexto del narrador y diferencia entre la versión remota y el último cambio local `aiUsed`. El plan es una guía de integración, no una modificación de runtime; la copia móvil sigue siendo la fuente más reciente y debe reconciliarse antes de tocarla.


## 26. Prueba integrada de causalidad NPC

Se añade `scripts/test-npc-event-lifecycle.js`, que ejercita en secuencia la propuesta de iniciativa y la resolución terminal. Comprueba que actor, causa y localización sobreviven al ciclo; que los reintentos no duplican; que un evento cancelado no se reabre; y que registrar referencias de efectos no muta hechos del mundo por sí solo. Es integración entre módulos aislados, no integración con la aplicación.


## 27. Corrección de equidad del cursor de iniciativas

La revisión del selector encontró que el cursor buscaba el primer ID lexicográficamente mayor, aunque los candidatos se ordenan primero por cooldown. Si el último actor seleccionado era `zeta` y el siguiente ordenado era `alfa`, el selector podía volver a elegir `zeta` y romper la rotación. Ahora el cursor localiza el actor exacto en la lista ordenada y continúa desde el siguiente índice, con vuelta circular. Se añade una prueba para IDs cuyo orden alfabético no coincide con el orden de cooldown. La selección sigue siendo determinista.


## 28. Unicidad de IDs de evento en el núcleo

`world-core.applyStep` ya impedía repetir un `operationId`, pero permitía que una operación distinta añadiera un evento con un ID ya existente. Ahora comprueba la unicidad del ID de evento antes de incrementar el tick o registrar la operación. Si está duplicado, devuelve `applied: false`, `reason: "duplicate-event-id"` y el estado normalizado sin mutaciones. Se añade una prueba de regresión que comprueba que no avanza el tick ni consume el nuevo operationId.


## Normalización canónica de IDs de evento — 13/11/2026

La revisión de idempotencia detectó que un evento podía comprobarse con el ID recortado pero almacenarse con espacios exteriores. Esto permitía que dos representaciones textuales equivalentes eludieran la comprobación de unicidad. `world-core.applyStep()` ahora compara IDs existentes tras normalizarlos con `trim()` y almacena siempre el ID canónico recortado; un ID vacío o compuesto por espacios adopta el `operationId` ya normalizado. La validación de duplicados ocurre antes de consumir tick o registrar la operación.

Se añaden dos pruebas de regresión. La suite del núcleo pasa a nueve pruebas escritas y la batería total del proyecto a 92. La corrección permanece aislada y pendiente de ejecución en checkout real/CI; no modifica Termux ni el runtime.


## Compatibilidad de IDs heredados en propuestas NPC — 13/11/2026

Se refuerza npc-proposal.js para que reconozca también IDs de eventos heredados con espacios exteriores. La propuesta genera un identificador canónico; antes de aceptarla, el módulo compara contra los IDs existentes tras trim(). Esto evita reintroducir una propuesta que ya exista bajo una representación equivalente.

Se añade una prueba de regresión con un evento heredado. La batería total pasa a 93 pruebas escritas. Pendiente de ejecución en checkout real/CI; no se integra en el runtime ni modifica Termux.


## Resolución de eventos con IDs heredados — 13/11/2026

Se hace compatible world-event-resolution.js con eventos antiguos cuyo ID tenga espacios exteriores. La búsqueda compara el ID existente tras trim(), y al completar una transición guarda el identificador canónico. Así, una resolución válida no queda bloqueada por diferencias de formato heredadas y el evento queda normalizado para operaciones posteriores.

Se añade una prueba de regresión. La batería total alcanza 94 pruebas escritas; ejecución real pendiente. No se aplican efectos de dominio ni se conecta el módulo al runtime.


## Corrección de expectativa contradictoria del scheduler — 13/11/2026

La primera ejecución real de GitHub Actions ha permitido detectar una prueba antigua contradictoria: un caso esperaba conservar desde e5 mientras otro caso ya comprobaba correctamente que la normalización conserva los 500 eventos con vencimiento más próximo (e0–e499). El comportamiento implementado ordena por dueTick ascendente y conserva la primera ventana de 500, por lo que se corrige la expectativa obsoleta a e0. No se cambia la lógica del scheduler.


## Primera ejecución completa de CI — 13/11/2026

GitHub Actions ejecutó las once suites con Node.js 22 sobre el commit 90cd4cf1c630534c44609b193e4adc94a89f0a26. Resultado verificado: **94 pruebas, 94 pasaron, 0 fallaron**. La ejecución detectó antes una expectativa contradictoria en una prueba del scheduler; se corrigió la expectativa obsoleta (de e5 a e0) sin alterar el algoritmo y la nueva ejecución quedó verde. Esto valida los módulos aislados en Ubuntu/Node 22, no la integración en Termux ni el runtime de la aplicación.


## 29. Efectos de dominio tipados y acotados

Se añade el módulo experimental `app/js/game/world-effects.js`. A diferencia de un parche genérico, solo acepta tres operaciones explícitas: `fact.add`, `relationship.adjust` y `character.move`. Cada efecto necesita ID propio y un evento causal que siga `pending`; un evento cancelado, fallido o ya aplicado no puede originar efectos nuevos.

- `fact.add` crea un hecho con ID único, texto limitado, tick actual, visibilidad declarada y referencia al evento causal.
- `relationship.adjust` solo permite ejes `trust`, `respect`, `affection`, `fear` y `hostility`, cambios enteros de hasta diez puntos por operación y valores finales acotados entre -100 y 100. El historial conserva efecto, causa, tick y variación.
- `character.move` exige personaje y localización de destino existentes; admite una localización de origen esperada para evitar mover a un personaje desde un lugar incorrecto.

El módulo registra cada ID aplicado tanto en `processedEffects` como en `appliedEffectIds` del evento causal, no muta el objeto recibido y no acepta rutas, propiedades o código arbitrarios. Las referencias `appliedEffectIds` son las que el motor debe entregar después a `world-event-resolution.js` al cerrar el evento como aplicado.

Se añaden doce pruebas unitarias. El módulo sigue aislado y usa la forma canónica propuesta `world.characters`/`world.locations`; antes de conectarlo a la partida hay que reconciliar y migrar el esquema real de Termux. No se ha conectado al runtime.


## 30. Validación cruzada entre efectos y resolución

Se endurece world-event-resolution.js: para cerrar un evento con resultado applied, ya no basta con proporcionar IDs de texto no vacíos. Cada ID debe existir en event.appliedEffectIds, registro que escribe world-effects.js al aplicar realmente el efecto. Una referencia inventada o perteneciente a otro evento se rechaza con unregistered-effect-reference. Las resoluciones cancelled y failed siguen sin exigir efectos.

Se actualizan las pruebas de resolución y el flujo causal integrado para aplicar primero un efecto tipado y después cerrar el evento con sus referencias reales. Así se comprueba el orden correcto: propuesta pendiente → efecto de dominio → resolución terminal. La batería asciende a 107 pruebas escritas.


## Ajuste de expectativa en el ciclo causal integrado — 13/11/2026

La primera ejecución tras exigir referencias de efectos reales pasó 106 de 107 pruebas. El único fallo era una expectativa antigua del test integrado: comparaba el ID del hecho (`clue-map-fragment`) con el ID del efecto (`effect-clue-map`). La implementación conserva correctamente el ID del efecto en `resolution.effectIds`; se corrige la expectativa de la prueba sin cambiar el código de dominio.


## Límite de efectos por evento causal

Se fija un máximo explícito de 50 efectos registrados por evento causal, alineado con el máximo de referencias que acepta world-event-resolution.js. world-effects.js rechaza el efecto número 51 con event-effect-capacity antes de mutar hechos, relaciones o personajes. Así se evita aplicar efectos que después no podrían incluirse en el registro de resolución. Se añade una prueba de capacidad; la batería pasa a 108 pruebas escritas.


## CI verde con efectos tipados — 13/11/2026

La ejecución GitHub Actions del commit 3b0495614d0df6a0462f1c06f25f9d6102a0fbb8 completó las doce suites con Node.js 22: **108 pruebas, 108 pasaron, 0 fallaron**. Incluye el módulo nuevo de efectos tipados, la verificación de referencias reales al resolver eventos y el límite de 50 efectos por evento causal. Validación confirmada en Ubuntu/Node 22; la integración en Termux y en la aplicación sigue pendiente de reconciliación.


## Claves de entidad seguras en efectos tipados

La revisión de world-effects.js detecta el riesgo de usar asignaciones ordinarias sobre objetos cuando IDs externos pueden coincidir con nombres heredados como `__proto__` o `constructor`. Las escrituras de relaciones y personajes ahora crean propiedades de datos propias de forma explícita y las lecturas verifican propiedad propia. Se añade una prueba de regresión con esos IDs para evitar alteraciones accidentales del prototipo. La batería pasa a 109 pruebas escritas.


## CI verde tras endurecimiento de efectos — 13/11/2026

GitHub Actions completó las doce suites en el commit f3ed516a008c47b0d0c0715144d6c03d2fb2a6e7: **109 pruebas, 109 pasaron, 0 fallaron**. Esta ejecución incluye la validación de referencias de efectos, el límite de 50 efectos por evento y la protección de IDs especiales (`__proto__`, `constructor`). La validación corresponde a módulos aislados en Node.js 22; no certifica integración en Termux.


## Unicidad global durable de IDs de efecto

Se añade una prueba que elimina deliberadamente el registro global `processedEffects` y comprueba que un ID ya aplicado no puede reutilizarse en otro evento: la referencia persistida en el evento original sigue impidiendo la duplicación. La batería asciende a 110 pruebas escritas.


## CI verde con unicidad durable de efectos — 13/11/2026

GitHub Actions completó las doce suites en el commit 5397518ca02c0ad1989369f0105eb5ddc9d853eb: **110 pruebas, 110 pasaron, 0 fallaron**. La ejecución incluye el caso que demuestra que los IDs de efecto siguen siendo únicos aunque se compacte el registro global, gracias a las referencias guardadas en cada evento causal. Validación en Node.js 22; integración en Termux pendiente.


## Integridad de referencias de efectos y localizaciones — 13/11/2026

Se endurecen dos contratos: fact.add rechaza locationId si no existe en world.locations; y world-event-resolution.js exige que la resolución applied enumere todos los efectos registrados en el evento causal, no solo un subconjunto válido. Se añaden dos pruebas de regresión y se ajusta el test de resolución completa para incluir las tres referencias registradas. La batería asciende a **112 pruebas escritas**. La validación CI queda pendiente.

## Corrección de prueba de referencias completas — 13/11/2026

La ejecución CI de 112 pruebas detectó un único test de normalización que aún enviaba solo dos de los tres efectos registrados en el evento. Se corrige el conjunto de entrada para incluir también fact-2 y seguir verificando la deduplicación/limpieza. No cambia el contrato de producción: la resolución aplicada debe enumerar exactamente todos los efectos existentes. Reejecutar CI.


## Validación profunda de payloads de propuestas NPC — 13/11/2026

Se endurece npc-proposal.js para que el payload estructurado no pueda introducir objetos arbitrarios, ciclos, prototipos especiales ni estructuras desmesuradas en el estado del mundo. La copia admite solo valores JSON-like, arrays y objetos planos, con profundidad máxima 3, 20 elementos/propiedades por contenedor, 100 nodos, cadenas de 500 caracteres y rechazo de claves peligrosas. La copia es profunda y no comparte referencias con la propuesta. Se añaden cuatro pruebas; la batería pasa de 112 a **116 pruebas escritas**. Pendiente CI.


## Causalidad limitada al conocimiento del NPC — 13/11/2026

Se endurece registerNpcProposal: ya no basta con que el modelo proponga un causeId no vacío. El motor debe proporcionar explícitamente knownCauseIdsByActor y la causa debe estar en la lista de conocimiento del actor que inicia la acción. Esto impide que una iniciativa se apoye en rumores, hechos o acciones que ese NPC no conoce. Se añaden dos pruebas y se actualizan las fixtures. La batería asciende a **118 pruebas escritas**. El runtime deberá construir esta allowlist desde la memoria individual del NPC, nunca desde el inventario global de causas.


## CI verde con 118 pruebas y causalidad privada NPC — 13/11/2026

GitHub Actions completó las doce suites en el commit `db91b8bcccfd56c18d61acc5b5c0c3753dbc30a5`: **118 pruebas, 118 pasaron, 0 fallaron** con Node.js 22. Incluye validación profunda de payloads NPC y la nueva condición de que cada iniciativa cite una causa conocida por el actor que la propone. La validación cubre módulos aislados; no acredita todavía integración en la aplicación ni en Termux.


## Límite aritmético del cooldown NPC — 13/11/2026

Se endurece markInitiative para rechazar la suma tick + cooldownTicks cuando deja de ser un entero seguro de JavaScript. Así no se guardan ticks de próxima iniciativa imprecisos por desbordamiento numérico. Se añade una prueba de borde; la batería pasa a **119 pruebas escritas**.


## CI verde con 119 pruebas — 13/11/2026

GitHub Actions completó las doce suites en el commit `e39e93fd8c12dfc646dd2da9ca0d827cefb82d3c`: **119 pruebas, 119 pasaron, 0 fallaron** con Node.js 22. La ejecución incluye el control de desbordamiento aritmético del cooldown de iniciativas NPC. Sigue siendo una validación de módulos aislados, no de la integración en Termux.


## Límites de identificadores en el núcleo del mundo — 13/11/2026

Se establece un máximo de 160 caracteres para operationId, event.id y los IDs heredados de processedOperations. El núcleo rechaza IDs nuevos excesivos sin avanzar el tick y descarta entradas heredadas que exceden el límite. Se añaden dos pruebas; la batería pasa a **121 pruebas escritas**. Pendiente CI.
