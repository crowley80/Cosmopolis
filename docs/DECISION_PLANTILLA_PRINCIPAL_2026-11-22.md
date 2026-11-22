# Decisión visual: plantillas de Athun

Fecha de revisión: 22 de noviembre de 2026

## Criterio de integración

Las pantallas de Athun deben utilizar las plantillas originales aprobadas por el usuario. No se permite sustituirlas por fondos recreados, imágenes generadas, maquetas nuevas ni composiciones que imiten su aspecto.

No se deben añadir lemas, subtítulos, textos promocionales, adornos ni elementos visuales que el usuario no haya solicitado y aprobado.

## Plantilla principal de aventura

La plantilla principal aprobada es la imagen vertical de pergamino compartida por el usuario. Debe conservarse íntegra, con su proporción, resolución, textura, bordes, cabecera, zona narrativa y ornamentación tal como aparecen en el original.

La interfaz debe colocar los datos dinámicos y controles en las zonas previstas por esa plantilla. No debe duplicar elementos que ya estén impresos en la imagen, ni superponer paneles o marcos inventados.

**Estado del archivo:** el binario original aprobado por el usuario no está localizado en el repositorio de esta rama. Por tanto, no está integrado en la aplicación. Una imagen generada accidentalmente durante una conversación anterior no es el original aprobado y queda expresamente excluida; no debe copiarse, renombrarse, utilizarse ni considerarse plantilla oficial.

## Plantilla secundaria en blanco

La plantilla secundaria de papiro en blanco es independiente de la plantilla principal. Se utiliza en pantallas secundarias. Debe conservarse el área central libre, sin añadir un rectángulo o panel nuevo. El título puede situarse arriba y las opciones abajo, sin textos deslizantes que tapen el contenido.

**Estado del archivo:** la hoja de estilos apunta a `app/assets/plantillas/athun-papiro-interfaz.webp`, pero esa ruta devuelve 404 en esta rama. El archivo original debe localizarse antes de declarar esta plantilla integrada. No se debe crear un sustituto.

## Estado técnico comprobado

Rama revisada: `work/athun-interfaz-unificada-20261122`.

- `app/js/app.js` construye todavía una cabecera HTML con título, subtítulo y dos rosas de los vientos para la pantalla de aventura.
- `app/css/style.css` contiene reglas que aplican un fondo oscuro degradado a `.adventure-screen` y ocultan los elementos `.compass`; por tanto, esa composición no está usando la plantilla principal aprobada.
- `app/css/style.css` intenta cargar la plantilla secundaria desde `app/assets/plantillas/athun-papiro-interfaz.webp`, pero el archivo no existe en esa ruta de la rama revisada.
- No se ha comprobado visualmente la integración en Chrome Android.
- No se han modificado partidas guardadas ni datos de usuario.

## Condiciones para completar la integración

1. Localizar los dos archivos originales aprobados por el usuario, sin generar ni redibujar imágenes.
2. Incorporar los archivos originales al repositorio conservando su resolución, proporción y contenido; usar extensiones que correspondan a su formato real.
3. Conectar cada plantilla únicamente a las pantallas que le corresponden.
4. Retirar de la pantalla de aventura los elementos HTML/CSS que dupliquen contenido ya impreso en la plantilla, sin inventar contenido nuevo.
5. Posicionar narración, datos dinámicos, escritura y controles dentro de sus áreas previstas.
6. Verificar contraste, legibilidad, adaptación a móvil y funcionamiento real en Chrome Android.
7. No tocar partidas guardadas, migraciones ni datos de protagonistas durante la integración visual.

Hasta que los archivos originales estén disponibles y la pantalla se haya verificado, el estado debe describirse como **integración pendiente**, no como terminada.
