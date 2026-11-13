# Plan de contratos y pruebas del mundo vivo

Fecha: 13 de noviembre de 2026  
Estado: plan técnico; no ejecutado contra el código de la aplicación.

Este documento convierte la propuesta de `ARQUITECTURA_MUNDO_VIVO.md` en criterios verificables. Su finalidad es evitar que la implementación introduzca duplicados, pérdida de partidas, avances offline o filtraciones de conocimiento.

## 1. Contratos que no se pueden romper

### C1. El estado guardado es la verdad
- La narración generada no modifica por sí sola el estado persistente.
- Solo se aplican cambios estructurados que hayan sido validados por el motor.
- Un error del modelo no puede borrar personajes, inventario, relaciones, eventos ni progreso.

### C2. Una acción se procesa una sola vez
- Cada acción aceptada tiene un identificador estable.
- Reintentar la misma operación devuelve el resultado ya calculado o reanuda la narración; nunca vuelve a aplicar consecuencias.
- El reloj lógico aumenta una vez, no una vez por petición HTTP ni por intento de generación.

### C3. El mundo se congela al cerrar
- Cargar una partida conserva el tick guardado.
- El tiempo real transcurrido desde el guardado no crea eventos ni cambia ubicaciones, necesidades o relaciones.
- Los avances de viaje, espera o descanso son pasos explícitos del juego, no una diferencia de marcas temporales reales.

### C4. El conocimiento está acotado
- Los hechos privados o secretos no entran en el contexto del jugador salvo que exista una vía de percepción, comunicación o deducción justificada.
- Una creencia o rumor no se convierte en hecho confirmado.
- La memoria de cada NPC contiene únicamente experiencias propias, información recibida o inferencias identificadas como tales.

### C5. Las iniciativas son causales y limitadas
- Cada iniciativa referencia un objetivo, necesidad, evento o circunstancia que la justifica.
- Un NPC no actúa si está incapacitado, ausente o bloqueado.
- Los límites por tick impiden ciclos infinitos y avalanchas de acciones.
- Las iniciativas fuera de escena pueden cambiar el mundo, pero no se narran como si el protagonista las hubiera presenciado.

### C6. La migración es no destructiva
- Los guardados antiguos siguen cargando.
- Los campos heredados se normalizan sin descartar información desconocida.
- La migración es idempotente: ejecutarla dos veces produce el mismo estado que ejecutarla una vez.
- Los datos heredados se eliminan únicamente cuando existe una migración verificada y una copia recuperable.

## 2. Pruebas unitarias

| ID | Caso | Preparación | Resultado esperado |
|---|---|---|---|
| U-01 | Estado vacío | Cargar sin objeto `world` | Crear estructura mínima válida sin excepción |
| U-02 | Migración heredada | Cargar partida con `personalGoal`, `goalStatus` y `characterActions` | Conservar y normalizar los datos |
| U-03 | Migración repetida | Normalizar el mismo guardado dos veces | Resultado profundamente equivalente |
| U-04 | Tick único | Procesar una acción nueva | Tick incrementado exactamente en uno |
| U-05 | Acción duplicada | Procesar dos veces el mismo ID | Un único evento y un único avance |
| U-06 | Orden estable | Añadir eventos con igual prioridad y tick | Orden final estable por ID |
| U-07 | Límite de cola | Programar más eventos que el máximo por paso | Procesar solo el máximo; conservar el resto |
| U-08 | Evento cancelado | Resolver un evento cancelado | No aplicar consecuencias |
| U-09 | Relación direccional | Modificar A respecto a B | No modificar automáticamente B respecto a A |
| U-10 | Memoria con fuente | Registrar un hecho comunicado | Recuerdo marcado como comunicado, con fuente |
| U-11 | Secreto | Crear evento privado de NPC | No aparece en conocimiento del protagonista |
| U-12 | Rumor | Registrar información no confirmada | Mantener estado de rumor y confianza separada |
| U-13 | NPC bloqueado | Marcar NPC incapacitado | No seleccionar iniciativa |
| U-14 | Cooldown | NPC con enfriamiento vigente | No volver a actuar |
| U-15 | Error de narrador | Forzar fallo del modelo tras resolver el mundo | Estado coherente; reintento sin repetir consecuencias |
| U-16 | Campos desconocidos | Cargar objeto con propiedades adicionales | Preservar propiedades no gestionadas |

## 3. Pruebas de integración

### I-01 — Acción y persistencia
Enviar una acción libre que produzca un cambio estructurado. Guardar, recargar y verificar que:
- el cambio aparece una sola vez;
- el tick coincide;
- el historial conserva la acción;
- la narración visible corresponde a esa operación.

### I-02 — Reintento de red
Interrumpir la respuesta después de persistir el mundo y repetir la misma operación. Debe recuperarse la respuesta o regenerarse la narración sin duplicar el evento ni volver a avanzar el tick.

### I-03 — Iniciativa visible
Crear una oportunidad válida para un NPC presente. La iniciativa se registra una vez y se incorpora a la escena narrada de forma natural, sin ficha mecánica ni duplicación.

### I-04 — Iniciativa fuera de escena
Permitir que un NPC actúe en otra localización. El estado registra el suceso, pero la narración no lo presenta como observado por el protagonista. El jugador podrá descubrirlo después mediante una vía válida.

### I-05 — Cambio de relación
Registrar una ayuda, amenaza o traición con causa identificable. Solo cambian los ejes pertinentes y en la dirección correspondiente. El historial de relación apunta al evento causal.

### I-06 — Guardado antiguo
Abrir una partida creada antes de introducir el nuevo esquema, jugar un turno y volver a guardar. El guardado mantiene los datos anteriores y añade únicamente la estructura nueva necesaria.

## 4. Pruebas de congelación offline

### O-01 — Cierre y reapertura
1. Guardar en tick N.
2. Cerrar la aplicación.
3. Esperar cualquier intervalo real.
4. Cargar la partida.

Resultado: tick N y mismo estado del mundo. Ningún evento pendiente se ejecuta por el tiempo transcurrido.

### O-02 — Evento programado
Programar un evento para tick N+3 y cerrar en N. Al reabrir, el evento sigue pendiente. Solo se resuelve después de que el juego alcance N+3 mediante acciones o pasos explícitos.

### O-03 — Fecha del dispositivo alterada
Cambiar la hora del dispositivo entre cierre y reapertura. El estado del mundo no cambia.

## 5. Pruebas narrativas con el modelo local

Estas pruebas no sustituyen las pruebas deterministas: miden la calidad de la narración y deben repetirse varias veces por la variabilidad del modelo.

- **N-01 Información secreta:** el narrador no revela una conversación privada que el protagonista no oyó.
- **N-02 Rumor:** expresa la información como rumor y conserva la incertidumbre.
- **N-03 Personalidad:** dos NPCs reaccionan de manera distinta ante la misma situación según sus objetivos y recuerdos.
- **N-04 Continuidad:** una promesa, deuda o amenaza recordada influye de forma coherente en una escena posterior.
- **N-05 Acción libre:** una orden no prevista en ejemplos o listas cerradas se interpreta por intención; si no puede resolverse, el narrador no finge haberla ejecutado.
- **N-06 Consecuencias:** abandonar una trama puede permitir que el mundo evolucione y produzca consecuencias sin obligar al jugador a retomarla.
- **N-07 No duplicación:** una iniciativa que ya forma parte de la prosa no vuelve a añadirse al final.
- **N-08 Perspectiva:** el narrador distingue señales observables de conclusiones e hipótesis.

## 6. Secuencia recomendada de implementación

1. **Inspección de la copia vigente:** reconciliar primero el código de Termux, incluidos los cambios del 13/11, con la rama de trabajo. No sustituir archivos locales con la versión remota antigua.
2. **Contratos puros:** implementar normalización, migración y funciones de tick en módulos aislados, sin llamadas a IA ni acceso al DOM.
3. **Idempotencia:** introducir identificadores de operación y pruebas de reintento antes de añadir más autonomía.
4. **Eventos:** unificar la fuente canónica y mantener adaptadores de lectura/escritura para el esquema anterior.
5. **Memoria y relaciones:** añadir recuerdos con fuente y relaciones direccionales sin romper los campos heredados.
6. **Iniciativas:** conectar objetivos y oportunidades con acciones acotadas y cooldown.
7. **Narración:** construir un contexto filtrado por percepción y conocimiento; la IA redacta, no decide la verdad.
8. **Validación en dispositivo:** comprobar guardado, recarga, interfaz táctil y comportamiento del modelo local en el Samsung.

## 7. Condiciones para considerar una fase terminada

Una fase no se considera terminada solo porque el código compile. Debe incluir:
- pruebas automatizadas pertinentes;
- comprobación de compatibilidad con una partida anterior;
- actualización de `docs/MAESTRO_COSMOPOLIS.md`;
- copia de seguridad antes de cualquier modificación en la copia local;
- verificación en navegador/dispositivo cuando afecte a la experiencia;
- constancia explícita de lo que no se ha podido validar.

## 8. Límites de este documento

Este plan no afirma que las pruebas estén implementadas ni ejecutadas. La rama de trabajo parte de una versión remota anterior a los últimos cambios locales de Termux. Hasta reconciliar ambas copias, los cambios de esta rama son documentación de diseño y criterios de aceptación; no deben integrarse a ciegas en `main` ni copiarse encima del teléfono.


## 9. Casos específicos para vistas de conocimiento

El módulo experimental `app/js/game/knowledge.js` incorpora doce pruebas en `scripts/test-knowledge.js`. Añadir a la futura integración los siguientes contratos:

- Cada registro pertenece a un único actor; la vista de otro actor no puede incluirlo por defecto.
- La fuente debe ser percepción, comunicación o inferencia explícita. No existe una fuente implícita de omnisciencia.
- Rumor, creencia, hecho y secreto son estados diferenciados; la presentación nunca convierte rumor o creencia en hecho confirmado.
- La vista de escena filtra por localización y no incorpora estado canónico no proporcionado.
- La entrega de información comunicada debe crear un registro nuevo para el receptor, con emisor y fuente, sin transferir automáticamente toda la memoria del emisor.
- La deducción debe registrar la evidencia que la sustenta en una capa superior; este módulo etiqueta la inferencia, pero no valida su razonamiento.

La batería escrita cubre validación, aislamiento por actor, secretos, rumores, inferencias, deduplicación, localización y límites de confianza. La ejecución real en el repositorio y la validación en dispositivo siguen pendientes.



## 10. Pruebas de transmisión y deducción

La batería se amplía con cuatro contratos:

- Comunicación selectiva: solo se transfiere la información elegida y el emisor conserva su propia memoria.
- Persistencia epistemológica: un rumor comunicado sigue siendo rumor y conserva su confianza.
- Autorización: no se puede transmitir un registro que el emisor no posee.
- Inferencia trazable: una deducción solo se registra si sus evidencias pertenecen al actor y queda etiquetada como creencia inferida.

La capa narrativa deberá expresar incertidumbre según tipo, fuente y confianza; estas funciones no deben presentar inferencias como hechos confirmados.


## 11. Contratos de percepción

El adaptador `app/js/game/perception.js` añade pruebas para:

- registrar solo observaciones con autorización explícita del actor;
- rechazar estímulos sin observadores declarados;
- deduplicar el mismo estímulo para el mismo actor;
- crear memorias separadas para dos observadores autorizados;
- conservar localización sin calcular ni inventar alcance o línea de visión.

La futura capa espacial deberá generar `observerIds` mediante reglas verificables de sentidos, distancia, obstáculos, atención y condiciones ambientales. La presencia física por sí sola no equivale a percepción.


## 12. Ejecución local de las pruebas aisladas

Desde la raíz del repositorio, cuando se disponga de un checkout actualizado de esta rama:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js
```

Este comando ejecuta las suites del núcleo del mundo, conocimiento y percepción. La existencia del comando documentado no significa que se haya ejecutado en Termux: la validación debe registrarse por separado y realizarse primero en un checkout real, después en el dispositivo.

## 13. Pruebas de reglas explícitas de percepción

Se añade `scripts/test-perception-rules.js` para verificar el contrato del motor de elegibilidad:
- coincidencia de localización;
- habilitación del sentido;
- listas explícitas de visibilidad y audibilidad;
- ocultación y bloqueo por actor;
- atención requerida y atención por defecto;
- ausencia de percepción entre localizaciones;
- rechazo de canales desconocidos;
- determinismo y deduplicación de actores;
- conservación del estímulo al añadir `observerIds`.

Comando actualizado para las cuatro suites aisladas:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js scripts/test-world-scheduler.js scripts/test-npc-initiative.js scripts/test-npc-context.js
```

Las pruebas están escritas en la rama, pero todavía no se han ejecutado en un checkout real ni en Termux. Las reglas no simulan geometría ni demuestran visibilidad física: las restricciones espaciales avanzadas deben llegar explícitamente desde una futura capa de escena.
## 14. Pruebas del flujo completo de percepción

`scripts/test-perception-pipeline.js` añade tres pruebas de integración aislada: autorización de observadores, restricción de visibilidad entre actores presentes y separación de recuerdos según canal sensorial. Estas pruebas ejercitan los tres módulos puros en conjunto, pero no sustituyen una prueba de integración con el guardado, el narrador ni la interfaz.

El comando completo de pruebas escritas queda así:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js
```

El conjunto suma 37 pruebas escritas (7 + 12 + 5 + 10 + 3). No se afirma que se hayan ejecutado en un checkout real ni en Termux.

## 15. Pruebas de agenda de eventos lógicos

Se añade `scripts/test-world-scheduler.js` con diez contratos:
- orden determinista por tick e ID;
- validación de eventos e IDs duplicados;
- entrega solo al alcanzar el tick;
- entrega exactamente una vez;
- cancelación limitada a eventos pendientes;
- rechazo de ticks inválidos;
- normalización con conservación de extensiones;
- límite de capacidad sin descartar eventos existentes;
- conservación prioritaria de los vencimientos más próximos.

El scheduler no usa reloj real ni ejecuta eventos autónomamente. El motor de turnos controla el avance y la persistencia. El comando completo de las seis suites queda:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js scripts/test-world-scheduler.js
```

La batería documentada suma 47 pruebas escritas. No se afirma que se hayan ejecutado en un checkout real ni en Termux.

## 16. Pruebas de selección de iniciativas NPC

Se añade `scripts/test-npc-initiative.js` con diez pruebas de contrato: lista explícita de elegibles, exclusión de jugador/no autónomos/fallecidos, objetivos activos, cooldown por tick, rotación determinista, límite de iniciativas, deduplicación, marcado de cooldown, idempotencia por tick y rechazo de entradas inválidas.

La batería suma 57 pruebas escritas. El comando completo de las siete suites:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js scripts/test-world-scheduler.js scripts/test-npc-initiative.js
```

No se afirma ejecución en checkout real ni en Termux. La selección no genera acciones narrativas y debe integrarse en el motor de turnos después de reconciliar la rama con la copia móvil.

## 17. Pruebas del contexto individual de NPC

Se añade `scripts/test-npc-context.js` con diez pruebas: allowlist de campos propios, rechazo de localización incorrecta, aislamiento de memoria por actor y localización, ausencia de datos arbitrarios de escena, normalización de rasgos, validación de identidad, no mutación del actor, dependencia explícita del módulo de conocimiento y límites de longitud.

La batería suma 67 pruebas escritas. El comando completo de las ocho suites:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js scripts/test-world-scheduler.js scripts/test-npc-initiative.js scripts/test-npc-context.js
```

No se afirma ejecución en checkout real ni en Termux. El contexto de escena debe ser filtrado por el motor antes de entregarse a este constructor.



## 18. Pruebas de propuestas causales NPC

Se añade `scripts/test-npc-proposal.js` con ocho pruebas: registro de una propuesta causal válida, rechazo de duplicados, elegibilidad explícita, exclusión del jugador/no autónomos/fallecidos, objetivos inactivos, tick y causa obligatorios, coherencia de localización y protección de capacidad sin pérdida de eventos.

La batería documentada asciende a 75 pruebas escritas (67 anteriores + 8 nuevas). Comando completo:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js scripts/test-world-scheduler.js scripts/test-npc-initiative.js scripts/test-npc-context.js scripts/test-npc-proposal.js
```

Las pruebas siguen pendientes de ejecución en un checkout real de la rama y en Termux. El nuevo módulo es experimental y no está integrado en la aplicación.


## 19. Pruebas del ciclo de resolución de eventos

Se añade `scripts/test-world-event-resolution.js` con nueve pruebas: resolución aplicada con referencias de efectos, obligación de referencias al aplicar, cancelación y fallo, idempotencia por operación, rechazo de segunda transición terminal, evento inexistente, resultado y resumen inválidos, validación del tick e identificación, y normalización de referencias de efectos.

La batería documentada asciende a **84 pruebas escritas** (75 anteriores + 9 nuevas). Comando completo:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js scripts/test-world-scheduler.js scripts/test-npc-initiative.js scripts/test-npc-context.js scripts/test-npc-proposal.js scripts/test-world-event-resolution.js
```

No se afirma ejecución en checkout real ni en Termux. El módulo registra estados y referencias, pero no aplica efectos de mundo; permanece experimental y sin integración en la aplicación.


## 20. Pruebas integradas del ciclo causal NPC

Se añade `scripts/test-npc-event-lifecycle.js` con cuatro pruebas de integración entre `npc-proposal.js` y `world-event-resolution.js`: conservación de actor/causa/localización de principio a fin, reintentos idempotentes sin duplicados, imposibilidad de reabrir un evento cancelado y ausencia de mutaciones implícitas en hechos del mundo.

La batería documentada asciende a **116 pruebas escritas** (84 anteriores + 4 de ciclo causal + 1 de equidad del cursor). Comando completo:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js scripts/test-perception-pipeline.js scripts/test-world-scheduler.js scripts/test-npc-initiative.js scripts/test-npc-context.js scripts/test-npc-proposal.js scripts/test-world-event-resolution.js scripts/test-npc-event-lifecycle.js
```

No se afirma ejecución en checkout real ni en Termux. Esta suite comprueba la integración entre dos módulos puros, no la integración del runtime ni la aplicación de efectos de dominio.


## 21. Ejecución automática en GitHub Actions

Se añade `.github/workflows/world-tests.yml`. En cada push a `work/arquitectura-mundo-vivo`, en pull requests hacia `main` o mediante ejecución manual, GitHub Actions prepara Node.js 22 y ejecuta las once suites aisladas con `node --test`. Esto permite que el repositorio ejecute la batería en un checkout real sin depender del entorno Android.

El workflow acaba de incorporarse; todavía no se dispone aquí de un resultado de ejecución. No debe considerarse la batería aprobada hasta consultar un run completado y revisar su salida.


## 22. Regresión de equidad del cursor NPC

Se añade una prueba a `scripts/test-npc-initiative.js` que cubre el caso en que el orden por cooldown difiere del orden alfabético de IDs. La implementación ahora avanza desde el actor exacto seleccionado en la lista ordenada, en lugar de buscar un ID lexicográficamente mayor. La batería documentada suma **89 pruebas escritas**. La ejecución queda pendiente del run de GitHub Actions.


## 23. Regresión de unicidad de eventos del núcleo

Se añade una prueba a `scripts/test-world-core.js` para impedir que dos operaciones diferentes registren el mismo ID de evento. La comprobación debe rechazar la segunda operación antes de incrementar el tick y sin añadir su operationId al registro de procesadas. La batería documentada asciende a **116 pruebas escritas**. Ejecución pendiente del workflow.


## Normalización de identificadores de eventos

Se amplía `scripts/test-world-core.js` con dos casos de regresión: IDs de evento con espacios exteriores que deben colisionar tras normalización y IDs vacíos que deben adoptar el `operationId` normalizado. `world-core.applyStep()` recorta los IDs al comprobar y al guardar, y compara contra IDs existentes también normalizados.

La batería queda en **116 pruebas escritas** (9 en world-core). Añadir estos casos no implica que estén ejecutados: se mantienen pendientes de un checkout completo o de un run de CI verificable.


## Compatibilidad de IDs heredados en propuestas NPC

Se añade un caso a scripts/test-npc-proposal.js para impedir duplicar una propuesta cuando el evento previo contiene espacios exteriores en su ID. La comparación del módulo ahora normaliza el ID existente con trim() antes de decidir si la propuesta ya fue registrada.

La batería documentada queda en **116 pruebas escritas**. La prueba está añadida, pero no se declara ejecutada.


## Resolución de eventos heredados con IDs no normalizados

Se añade una prueba en scripts/test-world-event-resolution.js para comprobar que un evento con espacios exteriores en su ID puede resolverse usando el ID normalizado, y que la transición persiste el identificador canónico. La batería documentada queda en **116 pruebas escritas**; no se afirma que se hayan ejecutado.


## Incidencia CI: expectativa obsoleta del scheduler

La ejecución de GitHub Actions sobre el commit c065a7c detectó 91/92 pruebas correctas y un fallo en scripts/test-world-scheduler.js: la prueba "limita la agenda y no usa el reloj de pared" esperaba e5, aunque la regla documentada y otra prueba exigen conservar los eventos más próximos e0–e499. Se corrige la expectativa a e0; el algoritmo de producción no se altera. El nuevo commit disparará otra ejecución. La batería en ese momento era de 92 pruebas; las nuevas pruebas añadidas después se incluyen en la siguiente ejecución.


## Primera ejecución completa de CI — 13/11/2026

GitHub Actions ejecutó las once suites con Node.js 22 sobre el commit 90cd4cf1c630534c44609b193e4adc94a89f0a26. Resultado verificado: **94 pruebas, 94 pasaron, 0 fallaron**. La ejecución detectó antes una expectativa contradictoria en una prueba del scheduler; se corrigió la expectativa obsoleta (de e5 a e0) sin alterar el algoritmo y la nueva ejecución quedó verde. Esto valida los módulos aislados en Ubuntu/Node 22, no la integración en Termux ni el runtime de la aplicación.


## 24. Efectos de dominio tipados

Se añade `scripts/test-world-effects.js` con doce pruebas para `world-effects.js`: creación de hechos con causa, idempotencia, unicidad de hechos, relaciones direccionales con historial y límites, validación de ejes/deltas, movimientos entre localizaciones existentes, comprobación de origen, rechazo de causas terminales y no mutación de entrada. El workflow incluye esta duodécima suite.

La batería asciende a **116 pruebas escritas**. Los efectos siguen siendo experimentales y no están conectados al runtime. La resolución de un evento como `applied` debe referenciar los IDs realmente registrados en `event.appliedEffectIds`; la validación cruzada de esa transición queda como siguiente endurecimiento antes de integrar.


## 25. Referencias de efectos verificadas en la resolución

Se añade una prueba que rechaza IDs de efectos inventados y se actualiza el flujo integrado scripts/test-npc-event-lifecycle.js: ahora aplica un efecto real con world-effects.js y pasa su ID a world-event-resolution.js. El módulo de resolución exige que todos los IDs citados estén registrados en el evento causal. La batería documentada queda en **116 pruebas escritas**. El workflow incluye las suites implicadas.


## Ajuste de expectativa en el ciclo causal integrado — 13/11/2026

La primera ejecución tras exigir referencias de efectos reales pasó 106 de 107 pruebas. El único fallo era una expectativa antigua del test integrado: comparaba el ID del hecho (`clue-map-fragment`) con el ID del efecto (`effect-clue-map`). La implementación conserva correctamente el ID del efecto en `resolution.effectIds`; se corrige la expectativa de la prueba sin cambiar el código de dominio.


## 26. Capacidad máxima de efectos por evento

Se añade una prueba en scripts/test-world-effects.js que llena las 50 referencias permitidas y verifica que el siguiente efecto se rechaza sin alterar hechos ni descartar referencias previas. La batería documentada queda en **116 pruebas escritas**.


## CI verde con efectos tipados — 13/11/2026

La ejecución GitHub Actions del commit 3b0495614d0df6a0462f1c06f25f9d6102a0fbb8 completó las doce suites con Node.js 22: **108 pruebas, 108 pasaron, 0 fallaron**. Incluye el módulo nuevo de efectos tipados, la verificación de referencias reales al resolver eventos y el límite de 50 efectos por evento causal. Validación confirmada en Ubuntu/Node 22; la integración en Termux y en la aplicación sigue pendiente de reconciliación.


## 27. IDs especiales y seguridad de propiedades

Se añade una prueba en scripts/test-world-effects.js con IDs `__proto__` y `constructor`. Comprueba que los personajes y relaciones se guardan como propiedades propias y que no se modifica el prototipo de los objetos. La batería documentada queda en **116 pruebas escritas**.


## CI verde tras endurecimiento de efectos — 13/11/2026

GitHub Actions completó las doce suites en el commit f3ed516a008c47b0d0c0715144d6c03d2fb2a6e7: **109 pruebas, 109 pasaron, 0 fallaron**. Esta ejecución incluye la validación de referencias de efectos, el límite de 50 efectos por evento y la protección de IDs especiales (`__proto__`, `constructor`). La validación corresponde a módulos aislados en Node.js 22; no certifica integración en Termux.


## 28. Unicidad durable de efectos entre eventos

Se amplía scripts/test-world-effects.js con un escenario de recuperación donde processedEffects ya no contiene el ID antiguo, pero el evento original conserva appliedEffectIds. El motor debe seguir rechazando ese ID si se intenta reutilizar en otro evento. La batería documentada queda en **116 pruebas escritas**.


## CI verde con unicidad durable de efectos — 13/11/2026

GitHub Actions completó las doce suites en el commit 5397518ca02c0ad1989369f0105eb5ddc9d853eb: **110 pruebas, 110 pasaron, 0 fallaron**. La ejecución incluye el caso que demuestra que los IDs de efecto siguen siendo únicos aunque se compacte el registro global, gracias a las referencias guardadas en cada evento causal. Validación en Node.js 22; integración en Termux pendiente.


## Integridad de referencias de efectos y localizaciones — 13/11/2026

Se endurecen dos contratos: fact.add rechaza locationId si no existe en world.locations; y world-event-resolution.js exige que la resolución applied enumere todos los efectos registrados en el evento causal, no solo un subconjunto válido. Se añaden dos pruebas de regresión y se ajusta el test de resolución completa para incluir las tres referencias registradas. La batería asciende a **116 pruebas escritas**. La validación CI queda pendiente.

## Corrección de prueba de referencias completas — 13/11/2026

La ejecución CI de 112 pruebas detectó un único test de normalización que aún enviaba solo dos de los tres efectos registrados en el evento. Se corrige el conjunto de entrada para incluir también fact-2 y seguir verificando la deduplicación/limpieza. No cambia el contrato de producción: la resolución aplicada debe enumerar exactamente todos los efectos existentes. Reejecutar CI.


## 30. Payload seguro en propuestas NPC

Se añaden cuatro pruebas para límites de tamaño, profundidad, ciclos, claves peligrosas, valores no serializables y copia profunda. La batería documentada queda en **116 pruebas escritas**.
