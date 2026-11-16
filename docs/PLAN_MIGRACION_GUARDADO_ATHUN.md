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


## Avance 16 de noviembre de 2026 — protección de Athun en partidas heredadas

**Implementado:** `Save.load()` realiza una migración idempotente cuando encuentra una partida con aventura: asegura el objeto `Athun` en el inventario y completa `state.athun` con `permanent: true`, conservando los recuerdos, revelaciones y vínculo que ya existan. Solo persiste cuando detecta una diferencia; no sustituye ni reinicia la partida.

**Validación directa:** se probó una partida heredada sin inventario ni estado de Athun; la carga añadió ambos y persistió el resultado. Una segunda carga no volvió a escribir. Resultado: correcto.

**Aún pendiente:** índice de partidas múltiples, mundo global compartido, selección de protagonista/partida y pruebas de aislamiento entre partidas. La migración de Athun no debe confundirse con la migración completa de guardado.


## Estado actualizado — 16 de noviembre de 2026

La primera fase de protección de Athun ya está implementada también para partidas heredadas. `Save.load()` incorpora el grimorio al inventario y normaliza `state.athun.permanent` sin reiniciar el registro; la escritura es condicional e idempotente. La prueba directa confirma una sola escritura en la primera migración y ninguna en la segunda carga.

La apertura de Valdebruma y la primera conversación están corregidas y cuentan con pruebas directas. Las pruebas de Chrome/Playwright se añadieron al workflow, pero el resultado remoto todavía no se ha podido consultar.

La migración completa de guardado sigue pendiente: índice de múltiples partidas, mundo global compartido, selección de protagonista y aislamiento de progreso individual. No confundir la protección de Athun con la finalización de esas fases.


## Integración preparatoria basada en main — 16/11/2026

Para evitar integrar una rama desfasada, se abrió `integracion/athun-multisave-main-20261116` directamente desde el `main` actual y se trasladaron a ella los módulos de partidas múltiples, atlas, pruebas y workflow. Se conservaron las versiones narrativas más recientes de `adventure.js` y `director.js`; el narrador principal recibió únicamente el guardado de protección contra copias de Athun. La capa de guardado incorpora el estado permanente del grimorio y preserva sus recuerdos y revelaciones por partida.

Respaldos previos creados en la propia rama para CSS, aplicación, guardado, personaje, sesión, narrador, HTML y ambos documentos. CI de integración completada: ejecución 237, sintaxis correcta y 25/25 pruebas aprobadas. La comparación confirma que la rama parte del main actual (0 commits detrás) y no modifica adventure.js ni director.js. Pendiente la validación manual en Chrome/Android. No se ha fusionado en `main` ni se han tocado datos de partidas del dispositivo.
