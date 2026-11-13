# Plan de integración del mundo vivo

**Estado:** preparación técnica basada en inspección estática de la rama `work/arquitectura-mundo-vivo`; no es una integración ejecutada.  
**Fecha:** 13/11/2026.

## 1. Regla de seguridad

La rama contiene módulos experimentales aislados. La copia Termux del usuario es más reciente que la base remota conocida. Antes de modificar cualquier archivo de runtime hay que importar/reconciliar la copia Termux más reciente, conservar backups y comparar cambios. No copiar archivos remotos sobre Termux ni integrar esta rama directamente en `main`.

## 2. Puntos de entrada verificados en la instantánea remota

- `index.html` carga `app/js/core/save.js`, `character.js`, `adventure.js`, `session.js`, `director.js`, `narrator.js` y `app.js`. Ninguno de los módulos experimentales de mundo vivo está cargado.
- `app/js/game/session.js` es el punto de persistencia de acciones. `Session.addAction(action, response, details)` añade la acción, actualiza la aventura y añade un evento a `saved.world.events`; en esta instantánea no recibe un operationId y no deduplica reintentos.
- `Session.addAction` también deriva hechos mediante palabras clave y limita el historial de eventos a 100 y hechos a 50. La migración debe conservar estas propiedades y evitar que un segundo sistema escriba hechos contradictorios.
- `app/js/game/narrator.js` prepara contexto en `buildMessages`, llama al modelo local y transforma la respuesta estructurada en un clon de la aventura. El flujo de aplicación mostrado en la auditoría persiste después de recibir la respuesta, por lo que hay que definir una transacción de acción antes de integrar ticks y eventos.
- En `Narrator.buildMessages`, `compactCharacters` copia `...person` y `compactState` copia `...state`. Esto no constituye una vista de conocimiento segura: campos privados añadidos en el futuro pueden llegar al modelo. El contexto individual de `npc-context.js` todavía no se usa aquí.
- `app.js` es la capa de interfaz y flujo de envío. No debe convertirse en el lugar donde se apliquen reglas de dominio; debe delegar en Session/motor.
- La instantánea remota de `session.js` consultada no incluye el último cambio local `aiUsed` conocido. Esto confirma que no debe reemplazarse por la versión remota sin reconciliar.

## 3. Orden recomendado de integración

### Etapa A — Reconciliar y congelar contrato
1. Obtener una copia exacta de Termux y comparar `app.js`, `session.js`, `narrator.js`, `save.js`, `adventure.js` e `index.html`.
2. Unificar los nombres de raíz del estado canónico. Elegir una sola fuente para eventos, hechos, relaciones y conocimiento; evitar duplicar `adventure.state.events` y `world.events` sin contrato de sincronización.
3. Migrar partidas antiguas de forma aditiva, preservando claves desconocidas y haciendo la migración idempotente.
4. Definir operationId estable por acción y guardar el resultado narrativo, el tick y la mutación del mundo como una sola operación lógica. No generar un ID nuevo en cada reintento de guardado.

### Etapa B — Protección de persistencia
5. Añadir una función de actualización por parches/operaciones en Session; no reemplazar el objeto completo del personaje ni fusionar relaciones de forma superficial.
6. Aplicar una sola vez el paso lógico con `world-core.js`. Reintentos con el mismo operationId deben devolver el estado previo sin aumentar el tick ni duplicar eventos.
7. Mantener la regla de congelación offline: ninguna fecha del dispositivo ni tiempo transcurrido fuera de la sesión puede generar ticks.

### Etapa C — Privacidad de conocimiento y percepción
8. Sustituir spreads de objetos completos en `Narrator.buildMessages` por allowlists explícitas para jugador, escena y cada NPC.
9. Resolver percepción espacial antes de llamar a `perception-rules.js`; el motor debe proporcionar localización, canales habilitados, bloqueos y observadores válidos. No inferir que todos los presentes perciben.
10. Registrar observaciones por actor con `perception.js` y generar contexto individual con `npc-context.js`. El modelo nunca recibe el estado global ni la memoria de otro actor.
11. Registrar comunicación e inferencias como operaciones distintas; un rumor comunicado no se convierte en hecho confirmado.

### Etapa D — Eventos e iniciativas
12. Llamar al scheduler solo después de un tick válido; persistir el estado de agenda y la entrega de eventos en la misma operación.
13. Seleccionar iniciativas mediante `npc-initiative.js`, validar propuesta mediante `npc-proposal.js` y guardar evento causal pendiente.
14. Aplicar los efectos validados mediante `world-effects.js` y resolver después el evento con `world-event-resolution.js`. El estado `applied` exige que cada ID citado esté realmente registrado en `event.appliedEffectIds`; no basta con que la IA devuelva referencias arbitrarias.
15. El catálogo experimental ya existe en `world-effects.js`: `fact.add`, `relationship.adjust` y `character.move`. Exige un evento causal pendiente, IDs idempotentes, límites de variación y de capacidad, referencias persistentes en el evento y precondiciones de localización. Antes de producción hay que reconciliar el esquema de `world.characters`/`world.locations` con Termux y ampliar los efectos según las necesidades reales.
16. Integrar la salida narrativa después de validar los cambios. La narración debe describir lo que el motor ya aceptó, no actuar como autoridad para mutar el mundo.

### Etapa E — Validación y primera partida
17. Ejecutar las suites unitarias e integración en un checkout real y añadir pruebas de migración de guardados reales anonimizados.
18. Probar una partida con dos NPC, cambio de localización, conversación, secreto comunicado, rumor, iniciativa autónoma, cierre y reapertura.
19. Verificar que el mundo no avanza durante el cierre, que los NPC no conocen hechos no percibidos y que los reintentos de guardado no duplican acciones.
20. Solo después de superar estas pruebas, integrar gradualmente y preparar la primera partida de usuario.

## 4. Criterios de salida

- La partida antigua carga sin pérdida de campos.
- Cada acción produce como máximo un tick y un conjunto de efectos.
- Guardado y reintento son idempotentes.
- El narrador recibe solo contexto autorizado.
- Los NPC solo actúan si son elegibles y sus acciones tienen causa.
- Los eventos pendientes se resuelven una sola vez y sus efectos son verificables.
- Cerrar la aplicación congela el mundo.
- La interfaz textual móvil sigue funcionando y el modelo local continúa siendo opcional con fallback.

## 5. Estado real

Los módulos `world-core`, `knowledge`, `perception`, `perception-rules`, `world-scheduler`, `npc-initiative`, `npc-context`, `npc-proposal`, `world-event-resolution` y `world-effects` están aislados y no se cargan desde `index.html`. La batería comprende doce suites y **125 pruebas**; GitHub Actions las ejecutó con Node.js 22 y confirmó 125/125 correctas en el commit `d3306c1ed999fc2cfd1007ee3adc4e9c7c0d891e` (ejecución 43481478082). El scheduler impide resucitar eventos terminales mediante duplicados y rechaza IDs de más de 120 caracteres sin truncarlos. Esto valida los módulos aislados, no su integración en el runtime ni en Termux. La copia local de Termux sigue siendo la referencia más reciente y debe reconciliarse antes de activar cualquier módulo.


## 6. Actualización de módulos y pruebas — 13/11/2026

Se incorporan al inventario `world-effects.js` y sus validaciones cruzadas con `world-event-resolution.js`. La secuencia de una iniciativa causal ya puede probarse de extremo a extremo en memoria: propuesta NPC pendiente → efecto tipado real → resolución terminal con referencias verificadas. La suite incluye 110 pruebas distribuidas en doce archivos, todas aprobadas por CI Node 22. No se ha hecho integración con la aplicación activa; sigue bloqueada hasta reconciliar Termux y fijar el contrato de persistencia.


## 7. Contratos añadidos para iniciativas NPC — 13/11/2026

La integración de `npc-proposal.js` debe pasar dos datos derivados del contexto privado de cada actor: `eligibleActorIds` y `knownCauseIdsByActor`. El segundo debe contener exclusivamente causas presentes en la memoria del NPC concreto; nunca debe construirse desde el inventario global de hechos/eventos. El payload estructurado de la propuesta se valida y copia en profundidad antes de entrar en `world.events`: solo valores JSON-like, profundidad 3, máximo 20 elementos por contenedor, 100 nodos y 500 caracteres por cadena; se rechazan ciclos y claves peligrosas. La capa runtime debe mantener estos mismos límites al construir el prompt y validar la respuesta del modelo.


## Estado de validación actualizado — 13/11/2026

La rama experimental contiene doce suites automatizadas y **123 pruebas**. La última ejecución de GitHub Actions sobre `8d8588858b3bb05b3ea92af3470b04e4033cd19d` terminó correctamente (123/123). Se añadió protección contra la resurrección de eventos duplicados en el scheduler. Esta validación no elimina el bloqueo de integración: sigue siendo obligatorio reconciliar primero la copia Termux más reciente y comprobar el runtime real antes de conectar módulos o modificar la partida del usuario.


## Estado de validación actualizado — 13/11/2026 (125 pruebas)

La ejecución 43481478082 de GitHub Actions terminó con éxito sobre `d3306c1ed999fc2cfd1007ee3adc4e9c7c0d891e`: doce suites, **125/125 pruebas correctas** con Node.js 22. Además de la protección de estados terminales, el scheduler fija un máximo de 120 caracteres por ID: los nuevos se rechazan si exceden el límite, los heredados inválidos se descartan y cancelEvent no trunca identificadores. El bloqueo de integración permanece intacto: reconciliar primero Termux, validar persistencia y privacidad del contexto y probar el runtime antes de conectar los módulos.


## Protección del reloj lógico — 13/11/2026

world-core.js rechaza ahora applyStep cuando el tick ya alcanzó `Number.MAX_SAFE_INTEGER`, evitando un incremento impreciso. La operación devuelve `tick-overflow` sin avanzar el reloj ni registrar la operación. Prueba incluida y CI verde: **126/126** en la ejecución 43485470144 (Node.js 22). La integración sigue bloqueada hasta reconciliar la copia Termux y validar el runtime.


## Límites de IDs en efectos y resolución causal — 13/11/2026

world-effects.js y world-event-resolution.js ya no truncan identificadores causales para hacerlos encajar en 160 caracteres. Se rechazan IDs principales excesivos y se descartan referencias/operaciones heredadas fuera de límite para evitar colisiones por prefijo. Se añaden tres pruebas de regresión. CI verde: **129/129 pruebas** en la ejecución 43485613054 (Node.js 22). Sigue sin estar autorizada la integración directa en Termux hasta reconciliar la copia local.


## Coherencia de IDs compuestos en propuestas NPC — 13/11/2026

npc-proposal.js limita ahora el ID original a 147 caracteres porque añade el prefijo `npc-proposal:` al crear el ID de evento. Así se respeta el límite global de 160 sin truncar ni generar identificadores que el núcleo rechazaría. Prueba de frontera añadida. CI verde: **130/130 pruebas** en ejecución 43485723310. No cambia el bloqueo de integración: primero reconciliar Termux y validar el runtime.


## Integridad de identificadores en conocimiento individual — 13/11/2026

knowledge.js rechaza IDs de entrada/actor que excedan 120 caracteres, conserva la primera copia al normalizar IDs duplicados y no trunca IDs compuestos generados al comunicar conocimiento. Si el ID compuesto no cabe, la comunicación se rechaza explícitamente. CI verde: **132/132 pruebas** en ejecución 43485914684. La integración sigue bloqueada hasta reconciliar Termux y probar el runtime real.


## Aislamiento de IDs y localizaciones en memoria NPC — 13/11/2026

Las consultas de memoria, transferencias e inferencias ya no truncan IDs de actor o conocimiento. Las entradas con emisor/localización excesivos se descartan por completo: no se convierten en recuerdos globales por perder su localización. Las referencias de evidencia fuera del límite se descartan sin alterar sus prefijos. CI verde: **134/134 pruebas** en ejecución 43486091187. La integración sigue pendiente de reconciliación con Termux y validación real del runtime.


## Validación de identidad espacial en contexto NPC — 13/11/2026

npc-context.js rechaza IDs de actor/localización inválidos o superiores a 120 caracteres y compara las localizaciones completas, sin truncar prefijos. Esto impide que el contexto narrativo de un NPC acepte una escena distinta con un identificador que solo comparte prefijo. CI verde: **135/135 pruebas** en ejecución 43486206002. No altera el requisito de reconciliar Termux antes de integrar.


## Identidad segura en selección de iniciativas NPC — 13/11/2026

npc-initiative.js valida los IDs de actor, lista de elegibles, cursor y localización sin truncarlos. Los identificadores largos se descartan, evitando colisiones entre NPC con prefijos iguales. La marcación de iniciativa aplica el mismo contrato. CI verde: **136/136 pruebas** en ejecución 43486310338. Sigue pendiente reconciliar la instalación Termux antes de integrar.


## IDs causales y espaciales en propuestas NPC — 13/11/2026

npc-proposal.js valida sin truncamiento la identidad del actor, la causa conocida y la localización propuesta, además de las allowlists de elegibilidad y conocimiento. Se rechazan actor/localización >120 caracteres y causa >160. CI verde: **137/137 pruebas** en ejecución 43486527033. La integración real sigue pendiente de reconciliación de Termux.


## IDs completos en efectos de mundo — 13/11/2026

La auditoría detectó truncamientos silenciosos en los identificadores de hechos, actores, personajes y localizaciones de `world-effects.js`, además de las listas heredadas de efectos procesados. Se introduce validación estricta de IDs (máximo 160 caracteres) sin truncamiento; las localizaciones opcionales excesivas invalidan el efecto, y las comparaciones de hechos/localizaciones usan identificadores completos. Se añaden dos pruebas de regresión para evitar colisiones por prefijo en hechos, actores, personajes y localizaciones. GitHub Actions, ejecución 43495405489 sobre `0751680ea717757562f98c69de50f5796258f065`, terminó correctamente: **139 pruebas aprobadas**, doce suites, Node.js 22. Sigue siendo validación aislada; no integra el módulo en el runtime ni en Termux.


## IDs estrictos en percepción y evidencia NPC — 13/11/2026

Se elimina el truncamiento de IDs en `perception-rules.js`: actores, localizaciones y listas de autorización deben coincidir con identificadores completos de hasta 120 caracteres. `perception.js` aplica el mismo contrato a observador, estímulo y localización, y rechaza IDs compuestos `perception:<stimulus>:<actor>` que superen los 120 caracteres en vez de truncarlos. `knowledge.js` ahora rechaza una inferencia si cualquiera de sus referencias de evidencia es inválida; ya no filtra silenciosamente una referencia excesiva y acepta el resto. Se añaden cinco pruebas de regresión entre los tres módulos. GitHub Actions, ejecución 43495617446 sobre `ef2cf180a6065f2e87ca49e4a27b601a03d87f8d`, terminó correctamente: **144/144 pruebas aprobadas**, doce suites, Node.js 22. Es validación automatizada de módulos aislados; la integración con el runtime y Termux sigue pendiente de reconciliación de la copia local.
