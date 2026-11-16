# Plan técnico — guardado, partidas múltiples y mundo compartido de Athun

Fecha: 16 de noviembre de 2026
Estado: auditoría estática y propuesta; todavía no se ha modificado el código de guardado.

## Hallazgos confirmados en GitHub

Archivos revisados: `app/js/core/save.js`, `app/js/game/session.js`, `app/js/game/character.js`, `app/js/game/adventure.js`, `app/js/app.js` e `index.html`.

1. `Save.key` es una única clave (`cosmopolis_save`) que contiene personaje, aventura, acciones y mundo.
2. `Session.startNewAdventure()` archiva el JSON anterior y después llama a `Save.replace()` con eventos, hechos y relaciones vacíos. Por tanto, iniciar otra aventura no mantiene un mundo común.
3. `Character.create()` guarda la ficha mediante `Save.save({ character })`, acoplándola al único registro activo.
4. `Athun.init()` carga automáticamente ese único personaje/aventura; no hay selector de partidas.
5. El mapa lee `visitedLocations` desde el estado de la aventura, no desde un registro global de localizaciones.
6. El inventario actual es una lista simple dentro de `adventure.state.inventory`; no existe aún una protección estructural para Athun.

Estos hallazgos contradicen los requisitos aprobados el 15/11/2026: múltiples partidas independientes, mundo persistente compartido, progreso separado por protagonista y Athun permanente.

## Arquitectura objetivo

Separar tres ámbitos, sin mezclar sus ciclos de vida:

- **Mundo global**: una clave/versionado propios para localizaciones descubiertas, entidades compartidas, hechos confirmados y cambios persistentes del mundo.
- **Partida**: un registro por protagonista/partida con ficha, aventura, posición, inventario, misiones, acciones, relaciones y decisiones personales.
- **Athun por partida**: vínculo, recuerdos, revelaciones y facetas conocidas por ese protagonista; el objeto Athun debe protegerse en las operaciones de inventario.

El índice de partidas debe contener identificador estable, nombre del protagonista, fecha de creación/actualización y referencia a su estado. La selección activa se guarda por separado.

## Migración compatible

1. Antes de cambiar el formato, conservar intacto `cosmopolis_save` y leerlo como partida heredada si aún no existe el nuevo índice.
2. Crear una migración idempotente: ejecutar dos veces no duplica partidas, hechos, lugares ni eventos.
3. Copiar primero el contenido heredado a una partida con ID estable; verificar escritura y lectura antes de marcar la migración como completada.
4. Crear el mundo global a partir únicamente de los datos que puedan clasificarse con seguridad como globales. No convertir automáticamente recuerdos o acciones personales en hechos universales.
5. Mantener temporalmente la API pública `Save.load/save/replace` para evitar romper módulos, pero hacer que opere sobre la partida activa. Añadir operaciones explícitas para crear, listar, activar y borrar partidas (el borrado requerirá confirmación dentro del juego).
6. Cambiar `Session.startNewAdventure` para crear/activar una partida sin vaciar el mundo global ni sobrescribir otras partidas.
7. Separar los eventos personales de los cambios globales: una acción de un protagonista no se convierte automáticamente en acontecimiento mundial.
8. Proteger Athun desde la capa de inventario: impedir eliminarlo, venderlo, transferirlo o duplicarlo, incluso si el narrador solicita esas operaciones.
9. Incorporar selector «Nueva partida / Continuar» y listado de protagonistas después de que la capa de datos esté probada.

## Pruebas obligatorias antes de integrar

- Partida heredada: migrar y recuperar exactamente ficha, aventura, acciones y estado.
- Idempotencia: repetir la migración no cambia el resultado ni duplica datos.
- Dos protagonistas: crear A y B, alternar entre ambos y comprobar que cada uno conserva su estado.
- Mundo compartido: descubrir un lugar con A y verificar que B puede consultarlo; un cambio global válido debe persistir al alternar.
- Aislamiento: acciones, inventario, posición y relaciones personales de A no deben aparecer en B.
- Athun: intentos de quitar, vender, transferir o destruir el grimorio no deben alterar su presencia en el inventario.
- Fallo de almacenamiento: si una escritura falla, no cambiar la partida activa ni marcar la migración como completada.
- Compatibilidad: las partidas existentes nunca se borran ni se reinician durante la actualización.

## Alcance de esta sesión

Solo lectura del código y documentación de la arquitectura. No se ha cambiado ningún archivo de ejecución ni se ha ejecutado la aplicación en Android. La implementación debe hacerse por etapas pequeñas, con copia previa de cada archivo, pruebas automatizadas de almacenamiento y revisión de las llamadas existentes antes de sustituir la API.


## Avance de implementación — rama `feat/athun-multisave-world`

Se ha iniciado una primera fase ejecutable en una rama separada de `main`.

### Implementado en esta fase
- Índice de partidas, clave activa y almacenamiento independiente por protagonista.
- Migración inicial de `cosmopolis_save` a una partida heredada. La clave original se conserva sin modificar como respaldo.
- Creación, listado y activación de partidas; actualización de ficha sin crear duplicados.
- Creación de una partida nueva sin sobrescribir la aventura anterior.
- Almacenamiento global separado para el mundo y registro compartido de localizaciones descubiertas.
- Selector inicial de partidas, acceso para cambiar de partida y creación de nuevos protagonistas.
- Protección de Athun en la normalización del inventario y en el procesamiento de objetos retirados por el narrador.
- Copias de seguridad de los seis archivos de ejecución modificados.
- Pruebas automatizadas de migración, aislamiento, alternancia, mundo compartido y permanencia de Athun.
- Flujo de GitHub Actions para ejecutar pruebas y comprobación de sintaxis JavaScript.

### Límites pendientes de validar
- GitHub Actions ha completado correctamente la comprobación de sintaxis JavaScript y las seis pruebas automatizadas de almacenamiento (ejecución 48, 16/11/2026).
- El mundo global registra localizaciones; la clasificación y persistencia de entidades, hechos y acontecimientos globales requiere reglas narrativas explícitas para no convertir acciones personales en hechos universales.
- La migración conserva íntegro el JSON heredado y su mundo personal dentro de la partida antigua; no transforma automáticamente relaciones o hechos personales en datos globales.
- La prueba visual y funcional final en Chrome/Android sigue pendiente. No se declara validado en el teléfono.
- La integración debe revisarse mediante pull request antes de incorporarse a `main`.


### Ampliación de la capa compartida
- Las identidades básicas de los NPC descubiertos se registran en `world.entities`: nombre, función y primera localización conocida.
- Se excluyen deliberadamente de esa ficha global la confianza, los recuerdos, los objetivos y las relaciones; permanecen en la partida de cada protagonista.
- El contexto del narrador recibe las localizaciones y entidades compartidas, con una instrucción explícita para no trasladar estados personales entre protagonistas.
- La migración de partidas antiguas incorpora localizaciones visitadas y la identidad básica de NPC ya conocidos, sin importar recuerdos privados.


### Recuperación ante pérdida del índice
El índice puede reconstruirse a partir de las claves de partidas individuales que sigan presentes en `localStorage`. La recuperación conserva el identificador activo si aún es válido y no depende de volver a migrar la clave heredada. Se ha añadido una prueba automatizada para comprobar que dos partidas siguen siendo accesibles tras eliminar el índice.


## Revisión autónoma adicional — 16 de noviembre de 2026

### Cobertura de seguridad añadida
Se amplían las pruebas automatizadas para cubrir dos condiciones que no estaban verificadas explícitamente:
- Repetir la inicialización/migración de una partida heredada no debe duplicar partidas, localizaciones ni alterar el contenido original.
- Si falla la escritura de la clave de partida activa al crear una partida nueva, debe revertirse el registro parcial y conservarse intacta la partida que ya estaba activa.

Estas pruebas se ejecutan en el mismo flujo de GitHub Actions que comprueba sintaxis y almacenamiento. No sustituyen una prueba real en Chrome/Android.

### Requisito pendiente: mapa con niebla de guerra
La implementación actual comparte un catálogo de localizaciones y la pantalla de mapa muestra una lista; todavía no constituye un mapa espacial ni implementa visión/niebla de guerra. No debe darse por completado este requisito.

Diseño que debe respetarse en una fase independiente:
- Al iniciar, mostrar únicamente el entorno inmediato del protagonista (barrio, sector o zona equivalente).
- Ampliar el territorio revelado progresivamente al explorar y desplazarse.
- Diferenciar tres estados: nunca descubierto (oculto), descubierto pero no visible en este momento (conocido) y visitado/recorrido.
- Mantener el descubrimiento geográfico en el mundo compartido para que otro protagonista pueda disponer de la información ya descubierta, sin compartir posiciones actuales, recuerdos ni relaciones personales.
- No inventar coordenadas, conexiones ni distancias a partir de nombres de lugares. El mapa necesitará datos espaciales y relaciones entre zonas proporcionados por el mundo/narración o generados con reglas consistentes.
- La interfaz debe seguir siendo legible y táctil en móvil y respetar la plantilla visual aprobada. La niebla debe ocultar información no descubierta, no limitarse a etiquetar una lista.

Antes de implementar, revisar cómo se representan las localizaciones y la posición actual en adventure.state, definir un formato de celdas/zonas compatible y añadir pruebas de aislamiento entre protagonistas, expansión por exploración y persistencia de los tres estados.

### Límite de validación
La rama sigue aislada de main. La validación automatizada no acredita el funcionamiento visual, el flujo táctil ni la recuperación de partidas en Chrome para Android. No fusionar el pull request hasta completar esa comprobación en el dispositivo real.


### Resultado de la revisión autónoma — 16/11/2026
- La primera ejecución ampliada detectó un defecto real: una excepción al escribir la partida activa dejaba una entrada parcial en el índice.
- Se corrigió `Save.createSlot()` para restaurar el índice anterior, retirar el registro incompleto y recuperar la clave activa anterior ante fallos de escritura.
- Nueva ejecución de GitHub Actions **60**: comprobación de sintaxis correcta y **8/8 pruebas aprobadas**. La prueba añadida reproduce el fallo de almacenamiento y comprueba que la partida anterior permanece activa y sin registros huérfanos.
- La validación en Chrome/Android sigue pendiente; no se ha realizado desde esta sesión.


### Validación ampliada con el prólogo — 16/11/2026
GitHub Actions, ejecución **76**, sobre el estado de la rama que incorpora el prólogo y sus pruebas: comprobación de sintaxis JavaScript correcta y **10/10 pruebas aprobadas** (2 del prólogo y 8 de almacenamiento). La ejecución confirma que el prólogo literal se presenta y marca como visto al continuar, que no se repite en instalaciones ya inicializadas y que las partidas existentes conservan el acceso directo al selector.


## Primera fase del atlas de exploración — 16/11/2026

Se ha creado el módulo `app/js/game/map.js` con una separación estricta entre:
- **A la vista:** ubicación actual y ubicaciones adicionales declaradas expresamente en `state.visibleLocations`.
- **Visitado:** lugares incluidos en `state.visitedLocations` de este protagonista.
- **Conocido:** lugares descubiertos y compartidos por el mundo, pero que este protagonista no ha visitado ni tiene a la vista.
- **Sin descubrir:** territorio no enumerado ni nombrado en la interfaz; no se filtran nombres de lugares desconocidos.

La sesión registra en el mundo compartido la ubicación actual y las ubicaciones que el estado narrativo declare visibles. La lista de visitas sigue siendo privada de cada protagonista. El atlas no deduce coordenadas, distancias ni conexiones a partir de nombres. Si el mundo/narrador no aporta información espacial explícita, solo muestra el entorno inmediato conocido; esto evita fabricar una geografía falsa.

La interfaz del mapa ahora presenta leyenda y secciones diferenciadas para entorno inmediato, lugares visitados y conocimiento compartido. Es una primera fase funcional de niebla de exploración y clasificación, no todavía un mapa geográfico con cuadrícula o rutas. Para completar esa fase se necesita incorporar datos de posición y conexiones espaciales explícitos, validar su coherencia narrativa y probar la expansión por desplazamiento.

Pruebas nuevas: clasificación de estados, revelado explícito de ubicaciones visibles, separación entre descubrimiento compartido y visita personal. Se añadió también una prueba de integración de sesión para comprobar que el descubrimiento visible se comparte sin convertirlo en visita del segundo protagonista. Pendiente confirmar CI y validar visualmente en Chrome/Android.


### Ajuste de visibilidad al desplazarse — 16/11/2026
La sesión compara la zona anterior con la nueva. Si el protagonista cambia de ubicación y el estado narrativo arrastra sin cambios la lista `visibleLocations`, esa visibilidad antigua se limpia para que no permanezca iluminada en la nueva zona. Una lista visible nueva y explícita se conserva. Se añadió una prueba de regresión: la zona anterior pasa a conocimiento conocido, no a visión actual. La tanda actual contiene 16 pruebas previstas en total (2 de prólogo, 4 del atlas y 10 de almacenamiento/sesión); su ejecución CI aún debe confirmarse.


### Integración narrativa de visibilidad — 16/11/2026
El esquema estructurado del narrador incorpora `visibleLocations`, que se recalcula en cada respuesta y solo debe incluir lugares cercanos identificados explícitamente en la escena/contexto; no puede inventar topología ni destinos. La lista se limita a 12 nombres y se sincroniza al mundo compartido como descubrimiento, sin registrar visitas personales. Si el jugador cambia de zona y la respuesta arrastra sin cambios la visibilidad anterior, la sesión la limpia.

GitHub Actions, ejecución **118**: sintaxis JavaScript correcta y **16/16 pruebas aprobadas** para el atlas, prólogo, guardado, migración y sesión. Esta ejecución corresponde a la primera versión completa del atlas con sincronización y limpieza de visibilidad; el cambio posterior de esquema del narrador requiere una nueva ejecución CI.


### CI posterior a la integración del narrador — 16/11/2026
GitHub Actions, ejecución **125**: comprobación de sintaxis JavaScript correcta y **16/16 pruebas aprobadas** tras incorporar `visibleLocations` al esquema estructurado del narrador. Se verifican el atlas, el prólogo, el guardado, la migración, el descubrimiento compartido y la limpieza de visibilidad al cambiar de zona.


### Refinamiento de visibilidad al cambiar de zona — 16/11/2026
El narrador devuelve también `visibleLocations` como campo explícito de la respuesta. Cuando hay desplazamiento, la sesión usa esa lista nueva; si no existe, limpia la visibilidad anterior. Así se evita borrar por error una lista nueva legítima que coincida con la anterior y también se evita conservar una visión obsoleta. La prioridad de estados es: ubicación actual, otras ubicaciones visibles, visitadas no visibles y conocidas no visitadas. Se añade una prueba para asegurar que una zona visitada vuelve a mostrarse como visible cuando entra en el campo de visión.
La tanda ampliada pasa a **18 pruebas previstas**; CI de esta última corrección pendiente.


### Validación final del refinamiento de visibilidad — 16/11/2026
GitHub Actions, ejecución **142**: comprobación de sintaxis JavaScript correcta y **18/18 pruebas aprobadas**. Incluye la prioridad de zonas actualmente visibles sobre visitas antiguas y la conservación de una nueva lista `visibleLocations` declarada explícitamente por el narrador al desplazarse.


## Red conservadora de caminos del atlas — 16/11/2026
La siguiente fase registra una conexión direccional cuando el estado de una partida cambia de una localización A a una localización B tras una acción. Esa transición es evidencia de un tramo recorrido; no demuestra distancias, orientación, geometría ni que el regreso sea posible, por lo que no se genera automáticamente la conexión B → A. El registro se guarda en el mundo compartido, separado de visitas personales, y se muestra como lista de caminos recorridos. Las rutas antiguas no se reconstruyen a partir de simples listas de lugares visitados porque su orden no demuestra que existiera un trayecto directo entre cada par. Se mantiene pendiente la cartografía geográfica con posiciones verificadas.


### Validación de la red inicial de caminos — 16/11/2026
GitHub Actions, ejecución **169** (`43832594402`): comprobación de sintaxis JavaScript correcta y **20/20 pruebas aprobadas**. Se verifica que un desplazamiento confirmado registra un tramo direccional en el mundo compartido, que los extremos se registran como localizaciones y que no se crea automáticamente el camino inverso. También se comprueba que el atlas no muestra conexiones cuyos extremos no estén registrados. La prueba en Chrome/Android y la cartografía geográfica con posiciones reales siguen pendientes.


### CI 174 — conexiones compartidas y aislamiento — 16/11/2026
GitHub Actions, ejecución **174**: comprobación de sintaxis JavaScript correcta y **21/21 pruebas aprobadas**. Se valida que una conexión recorrida por una partida permanece disponible en el atlas de otra, sin transferir el historial personal de visitas.


### Auditoría de conexiones del atlas — 16/11/2026
El registro de conexiones compartidas requiere ahora que la respuesta estructurada clasifique la acción como `movement`, además de confirmar un cambio entre dos ubicaciones distintas. Una modificación de ubicación por investigación, transición narrativa u otra categoría no crea por sí sola un camino. La posición, el conocimiento del lugar y la visita personal continúan sincronizándose normalmente. Se añade una prueba de regresión que impide generar conexiones por cambios no clasificados como desplazamiento. También se corrige el nombre del director narrativo en el prompt del modelo. Pendiente CI de esta revisión; la validación visual en Chrome/Android continúa pendiente.


### CI 195 — rutas confirmadas y coherencia de Athun — 16/11/2026
GitHub Actions, ejecución **195** (`43836494217`): comprobación de sintaxis JavaScript correcta y **22/22 pruebas aprobadas**. Incluye la regresión que impide crear conexiones del atlas cuando cambia la ubicación por una acción que no está clasificada como desplazamiento. También se valida la actualización del prompt del narrador y el resto de pruebas de guardado, prólogo, atlas y mundo compartido.
