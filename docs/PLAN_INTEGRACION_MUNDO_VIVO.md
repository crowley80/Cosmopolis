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
14. Validar y resolver el evento con `world-event-resolution.js`. Su estado `applied` solo significa que se registraron referencias a efectos: **no aplica todavía efectos de dominio**.
15. Crear un registro cerrado de efectos tipados (por ejemplo, añadir hecho observado, cambiar relación con causa, mover personaje con precondiciones). Cada efecto necesita validador, límites y pruebas de idempotencia antes de ejecutarse.
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

Los módulos `world-core`, `knowledge`, `perception`, `perception-rules`, `world-scheduler`, `npc-initiative`, `npc-context`, `npc-proposal` y `world-event-resolution` están aislados. Hay 84 pruebas escritas documentadas, pero no se afirma que hayan sido ejecutadas en checkout real. Ningún módulo de esta lista se carga desde `index.html` ni se ha integrado en el runtime de Termux.
