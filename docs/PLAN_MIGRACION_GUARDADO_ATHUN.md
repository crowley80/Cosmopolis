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
- El flujo de pruebas se ha añadido, pero debe confirmarse su ejecución satisfactoria en GitHub Actions.
- El mundo global registra localizaciones; la clasificación y persistencia de entidades, hechos y acontecimientos globales requiere reglas narrativas explícitas para no convertir acciones personales en hechos universales.
- La migración conserva íntegro el JSON heredado y su mundo personal dentro de la partida antigua; no transforma automáticamente relaciones o hechos personales en datos globales.
- La prueba visual y funcional final en Chrome/Android sigue pendiente. No se declara validado en el teléfono.
- La integración debe revisarse mediante pull request antes de incorporarse a `main`.


### Ampliación de la capa compartida
- Las identidades básicas de los NPC descubiertos se registran en `world.entities`: nombre, función y primera localización conocida.
- Se excluyen deliberadamente de esa ficha global la confianza, los recuerdos, los objetivos y las relaciones; permanecen en la partida de cada protagonista.
- El contexto del narrador recibe las localizaciones y entidades compartidas, con una instrucción explícita para no trasladar estados personales entre protagonistas.
- La migración de partidas antiguas incorpora localizaciones visitadas y la identidad básica de NPC ya conocidos, sin importar recuerdos privados.
