# Estado de trabajo de interfaz — 22 de noviembre de 2026

> Nombre vigente: **Athun: el grimorio oscuro**. El nombre histórico del repositorio no debe trasladarse a la interfaz ni a textos nuevos.

- Rama de trabajo aislada: `work/athun-papiro-universal-20261122`. No se ha fusionado con la rama principal.
- Se han eliminado de la pantalla de entrada y de varias vistas las frases promocionales no aprobadas.
- Se han restaurado los controles inferiores de la pantalla de juego: botones, iconos y etiquetas vuelven a tener contraste y área táctil visible.
- Se han ocultado las dos rosas de los extremos que no forman parte de la plantilla aprobada.
- No se han modificado datos de partidas, guardados ni migraciones.
- Plantilla universal verificada en esta rama: `app/assets/athun-papiro-universal.webp` (316.424 bytes). La ruta coincide con CSS y las pruebas visuales comprueban su uso en las pantallas secundarias y de aventura.
- Pendiente para el 23/11/2026 a las 19:00 (Europe/Madrid): crear las animaciones del grimorio y de la calavera e integrarlas respetando el momento de aparición de esta última.

---

# ATHUN: EL GRIMORIO OSCURO — DOCUMENTO MAESTRO

Última actualización: 12 de noviembre de 2026.

## 1. IDENTIDAD DEL PROYECTO

Nombre: Athun: el grimorio oscuro.

Tipo: juego web narrativo e interactivo.

Desarrollo: teléfono Android mediante Termux, Node.js y JavaScript.

Ruta:
~/storage/shared/Download/Cosmopolis

Servidor local:
http://127.0.0.1:8080/index.html

Athun: el grimorio oscuro es una aventura narrativa en la que el jugador crea un
personaje y vive acontecimientos que dependen de su naturaleza,
pasado, capacidades, personalidad y decisiones.

El universo debe ser original, con personajes, lugares e historias
propios.

El nombre oficial del proyecto es Athun: el grimorio oscuro. Cosmopolis se conserva únicamente como nombre histórico de la carpeta local y del repositorio GitHub.

## 2. ENTORNO DE TRABAJO

Se utilizan dos sesiones de Termux:

- Sesión 1: mantener el servidor funcionando.
- Sesión 2: ejecutar comandos y trabajar con los archivos.

No cerrar ni reiniciar la sesión del servidor innecesariamente.

Comando para iniciar el servidor:

cd ~/storage/shared/Download/Cosmopolis && node server.js

Mensaje esperado:

Servidor de Athun disponible en http://127.0.0.1:8080

La dirección /index.html se ha comprobado que funciona.

## 3. ESTRUCTURA CONOCIDA

Cosmopolis/
  index.html
  server.js
  nueva_aventura.txt
  docs/
  app/
    js/
      app.js
      app.js.backup
      character.js
      adventure.js
      session.js
      director.js
      core/
        save.js
    css/
      style.css
      style.css.backup
    assets/
      scenes/
        visita-inesperada.webp

La estructura es orientativa y debe comprobarse antes de modificar
archivos.

## 4. FUNCIONALIDADES DESARROLLADAS

### Creación de personajes

Se ha trabajado en un sistema para crear personajes con:

- Nombre.
- Naturaleza.
- Pasado o historia.
- Capacidades.
- Personalidad.

### Aventuras

Existe un archivo de generación narrativa:

app/js/game/adventure.js

Contiene cuatro comienzos de aventura:

- Una visita inesperada.
- El incidente.
- La última advertencia.
- Una puerta prohibida.

El comienzo se elige aleatoriamente.

La narración incorpora los datos del personaje y devuelve:

- title
- image
- text
- createdAt

### Escenas ilustradas

Se ha incorporado:

app/assets/scenes/visita-inesperada.webp

Se comprobó que el servidor la entrega correctamente mediante
una respuesta HTTP 200.

También aparecen estas rutas en los comienzos narrativos:

- el-incidente.webp
- ultima-advertencia.webp
- puerta-prohibida.webp

Su existencia debe comprobarse.

### Acciones e historial

Existe el archivo:

app/js/game/session.js

Se ha trabajado en el registro de acciones del jugador y sus
respuestas narrativas.

Existe un historial de acciones.

### Dirección narrativa

Existe:

app/js/game/director.js

Debe revisarse antes de realizar cambios.

### Guardado de partidas

Existe:

app/js/core/save.js

Se ha trabajado con localStorage y la clave:

cosmopolis_save

Hay que comprobar su funcionamiento actual antes de modificarlo.

## 5. ARCHIVOS PRINCIPALES

index.html:
Página de entrada.

server.js:
Servidor local Node.js.

app/js/app.js:
Lógica principal y navegación.

app/js/character.js:
Creación de personajes.

app/js/game/adventure.js:
Comienzos de aventura.

app/js/game/session.js:
Sesiones y acciones.

app/js/game/director.js:
Dirección narrativa.

app/js/core/save.js:Guardado y recuperación.

app/css/style.css:
Presentación visual.

app/assets/scenes/:
Ilustraciones de escenas.

## 6. ESTADO TÉCNICO

- El servidor Node.js se ha ejecutado correctamente.
- La página index.html se ha abierto en el navegador.
- La imagen visita-inesperada.webp respondió HTTP 200.
- Se han realizado comprobaciones de sintaxis JavaScript.
- Existen copias de seguridad de app.js y style.css.
- El archivo nueva_aventura.txt está vacío y no es este documento.

No considerar terminada ninguna función sin probarla.

## 7. PENDIENTES

1. Comprobar todos los archivos existentes.
2. Revisar la integración de Adventure en app.js.
3. Comprobar la visualización de escenas.
4. Verificar las cuatro imágenes.
5. Comprobar el guardado y recuperación de partidas.
6. Probar las acciones y el historial.
7. Revisar la navegación entre pantallas.
8. Comprobar errores en el navegador.
9. Continuar ampliando el juego sin romper lo que funciona.

## 8. NORMAS PARA CONTINUAR EL DESARROLLO

- Explicar cada paso en español sencillo.
- El usuario trabaja copiando y pegando comandos desde Android.
- Indicar siempre qué sesión de Termux utilizar.
- No exigir conocimientos de programación.
- Dar comandos completos y fáciles de copiar.
- No realizar modificaciones sin revisar primero el código actual.
- Hacer copias de seguridad antes de cambios importantes.
- Comprobar la sintaxis después de modificar JavaScript.
- Probar los cambios en el navegador.
- No repetir trabajos ya realizados.
- Actualizar este documento al finalizar cada sesión.

## 9. CÓMO RECUPERAR EL CONTEXTO

Al comenzar una nueva conversación, leer primero:

docs/MAESTRO_COSMOPOLIS.md

Comando:

cd ~/storage/shared/Download/Cosmopolis && cat docs/MAESTRO_COSMOPOLIS.md

Después comprobar el estado real de los archivos y continuar desde
el último punto documentado.

## 10. HISTORIAL

9 de noviembre de 2026:

- Reconstrucción inicial de la documentación del proyecto.
- Registro de la estructura conocida.
- Registro de creación de personajes.
- Registro de los comienzos de aventura.
- Registro del servidor local y del sistema de acciones.
- Identificación de tareas pendientes de verificación.

Añadir aquí las futuras actualizaciones con fecha, cambios,
pruebas realizadas y próximo paso.

FIN DEL DOCUMENTO MAESTRO

## DECISIONES DE DISEÑO CONFIRMADAS — 9 DE NOVIEMBRE DE 2026

### Libertad absoluta del jugador

Decisión confirmada: Cosmopolis será una aventura narrativa abierta. El jugador podrá intentar prácticamente cualquier acción mediante texto libre. No estará limitado a un catálogo cerrado de acciones.

El juego deberá interpretar la intención del jugador y responder de forma coherente con el mundo, la situación, el personaje y los acontecimientos anteriores.

### Misiones y consecuencias

- El jugador puede abandonar cualquier misión, incluidas las principales.
- No se le obligará a seguir una trama determinada.
- Abandonar una misión no supone automáticamente un fracaso.
- Las decisiones y los abandonos pueden alterar el desarrollo de la historia.
- Las consecuencias deben permanecer en la memoria del mundo.
- No habrá reinicios artificiales que borren las consecuencias.

### Mundo vivo y memoria narrativa

- Los personajes deben recordar las acciones y decisiones relevantes del jugador.
- Los acontecimientos del mundo pueden avanzar a ritmos diferentes.
- El mundo evoluciona mientras la partida permanece abierta.
- Al cerrar el juego, el mundo se congela; no se simula el paso del tiempo mientras está cerrado.
- Las consecuencias y los acontecimientos importantes deben conservarse al guardar la partida.

### Historias y universo

- El universo debe poder generar nuevas tramas a partir de las consecuencias de las decisiones.
- Habrá historias principales y aventuras secundarias que puedan surgir de forma continua.
- El objetivo es conseguir una experiencia narrativa expansiva, con posibilidades de aventura que no dependan de una única historia lineal.

### Objetivo técnico

Construir un motor narrativo central con memoria local, generación de acontecimientos y mecanismos de coherencia.

La intención acordada es que el juego funcione en Android sin depender de Gemini ni de servicios de pago.

### Norma de trabajo

Este documento es la referencia principal del proyecto. Se actualizará con las decisiones confirmadas, los cambios de código, las funcionalidades incorporadas y los problemas pendientes.

No se volverán a preguntar decisiones que ya estén registradas, salvo que sea necesario aclarar una contradicción o un cambio solicitado por el usuario.


## ESTADO TÉCNICO COMPROBADO — 9/11/2026

- character.js crea personajes con nombre, naturaleza, apariencia, historia, habilidades, personalidad y fecha de creación.
- save.js utiliza localStorage del navegador con la clave cosmopolis_save.
- session.js guarda las acciones del jugador y las respuestas narrativas, con fecha.
- director.js reconoce seis grupos básicos de acciones mediante palabras clave y utiliza respuestas genéricas cuando no encuentra coincidencias.
- app.js muestra la aventura, recoge acciones escritas libremente y actualiza el historial y la narración.
- Pendiente: ampliar el motor narrativo para interpretar acciones libres, recordar acontecimientos y generar consecuencias coherentes.
- Pendiente: revisar Character.create(), porque actualmente Save.save({ character }) guarda únicamente la ficha y puede sustituir datos anteriores de la partida.

## Respaldo GitHub — 12/11/2026

Primer respaldo remoto completado correctamente.
Repositorio privado: https://github.com/crowley80/Cosmopolis
Rama principal: main.
Primer commit: 7f36a4e (Primer respaldo de Cosmopolis).
GitHub CLI autenticado y rama local conectada con origin/main.
Registro detallado de la sesión: docs/SESION_2026-11-12_RESPALDO_GITHUB.md.
No repetir la configuración inicial del repositorio en futuras sesiones.

## ACTUALIZACIÓN DE DISEÑO Y PLAN DE TRABAJO — 12 DE NOVIEMBRE DE 2026

Esta sección recoge las decisiones más recientes y prevalece sobre cualquier descripción anterior del documento que las contradiga. Las referencias antiguas a escenas ilustradas, imágenes o paneles de personajes no representan la dirección visual y de interfaz actualmente aprobada.

### Identidad visual aprobada

Se aprueba como referencia estética la maqueta de pergamino/papiro antiguo que el usuario ha valorado positivamente.

- Papel crema envejecido, con textura y desgaste sutil.
- Tinta marrón oscura y contraste suficiente para leer cómodamente en móvil.
- Detalles de cuero, bronce y oro viejo.
- Tipografía de aire clásico, pero clara y legible.
- Menús, fichas y documentos con aspecto de páginas de un libro o manuscrito.
- El mapa, cuando se consulte, seguirá la misma identidad de cartografía antigua y pergamino.

La estética debe mejorar la inmersión sin perjudicar la lectura, la escritura ni el uso táctil.

### Interfaz exclusivamente textual

Se mantiene la decisión firme de que el juego sea exclusivamente textual: no incluir imágenes ni ilustraciones en la interfaz ni en las escenas.

La estructura móvil ya validada se conserva como base:
- Zona superior para narración, historia y diálogos, con desplazamiento propio.
- Zona inferior para escribir y enviar acciones libres y consultar el historial de acciones.
- Al enviar una acción, se muestra la página narrativa actual sin desplegar todo el historial de narraciones; las acciones siguen guardadas internamente para mantener continuidad.

### Narración y personajes

La narración será el centro de la experiencia. Se elimina el apartado o panel permanente «Personajes cercanos» para liberar espacio y evitar una interfaz dominada por paneles.

Los personajes se presentarán dentro de la narración cuando entren en escena o sean relevantes. El narrador describirá de forma natural su presencia, aspecto, gestos, palabras, comportamiento y reacciones. El jugador decidirá qué hacer con ellos mediante texto libre: hablar, ignorar, seguir, ayudar, engañar, observar o cualquier otra acción razonable.

La narración debe sentirse como una novela de aventuras interactiva, no como una sucesión de respuestas mecánicas a comandos. Se buscarán escenas con ambiente, acción, reacciones, diálogos y consecuencias cuando la situación lo requiera, con ritmo y extensión variados.

El narrador distinguirá claramente:
- Lo que el personaje percibe directamente.
- Lo que puede deducir o sospechar.
- Lo que todavía desconoce.

No debe revelar como hecho información que el personaje no pueda conocer.

### Exploración del entorno
Se podrán ofrecer ayudas opcionales para consultar el entorno, sin convertirlas en límites ni sustituir la escritura libre. Ejemplos de intenciones:
- Observar alrededor: averiguar qué hay a la vista.
- Buscar personajes: preguntar quién está cerca o quién destaca en la escena.
- Examinar un lugar u objeto: descubrir detalles perceptibles.
- Escuchar: atender a sonidos, voces o movimientos.
- Preguntar al narrador: solicitar qué puede saber o advertir el personaje sobre el lugar.

Estas ayudas pueden aparecer como acciones rápidas o sugerencias discretas, pero nunca como un menú cerrado. El jugador siempre podrá escribir cualquier otra acción.

### Plan para las próximas sesiones

Orden de trabajo acordado:

1. Mantener este documento maestro y el registro de sesión actualizados con las decisiones y el estado real del proyecto.
2. Rediseñar con CSS la interfaz existente para aplicar la identidad de pergamino, conservando la estructura táctil de dos zonas que ya funciona. Priorizar contraste, legibilidad, separación de diálogos y comodidad de lectura.
3. Retirar de la interfaz el panel permanente «Personajes cercanos» y cualquier elemento que reste espacio a la narración.
4. Incorporar ayudas opcionales de exploración del entorno, conectadas al sistema de acciones libres.
5. Mejorar progresivamente el motor narrativo para presentar personajes y escenas de forma natural, mantener memoria de acontecimientos y producir reacciones y consecuencias coherentes.
6. Probar cada cambio en el navegador del móvil, corregir errores y no dar por terminada una función hasta haberla probado.

### Normas de implementación y continuidad

- No rehacer la interfaz desde cero: conservar lo que ya funciona y modificarlo de forma incremental.
- No añadir imágenes ni ilustraciones; la estética de pergamino se construirá mediante CSS, tipografía, color, bordes y elementos textuales.
- No convertir las ayudas de exploración en opciones obligatorias o en un catálogo cerrado.
- Evitar auditorías generales repetidas. Leer este documento y comprobar solo lo necesario para la tarea concreta.
- El usuario trabaja desde Android con pantalla táctil y Termux, sin teclado físico ni tecla Ctrl. Dar pasos sencillos, comandos pegables y pedir confirmación con «ok».
- Cuando se trabaje directamente en GitHub, indicar qué archivos se cambian y qué commit se ha creado. No afirmar que un cambio está probado en el móvil hasta que se haya probado allí.
- Al final de cada sesión, registrar cambios realizados, pruebas, incidencias y siguiente paso.

### Avance de implementación — 12 de noviembre de 2026

- Se ha actualizado `app/css/style.css` directamente en GitHub para aplicar la primera versión de la identidad visual de pergamino: tonos crema envejecido, tinta marrón, cuero y oro viejo.
- Se han conservado las dos zonas de la interfaz móvil: narración con desplazamiento propio y panel inferior de escritura.
- Se han mantenido los estilos de adaptación a pantallas móviles y de poca altura.
- La textura se ha construido únicamente con CSS; no se han añadido imágenes ni ilustraciones.
- Commit de GitHub: `4ceaddf` («Aplicar identidad visual de pergamino a Cosmopolis»).
- Estado de prueba: cambio guardado y releído en GitHub; todavía no probado en el navegador del teléfono. Antes de seguir con ajustes visuales, sincronizar el repositorio local y comprobar la apariencia real en móvil.
- Siguiente paso inmediato: comprobar el estado del repositorio local en Termux, sincronizar este commit si no hay cambios locales pendientes y revisar la nueva apariencia en el navegador. Después continuar con la eliminación de cualquier panel permanente de personajes (si existe en la interfaz real) y las ayudas opcionales de exploración.



# Actualización visual — segunda iteración, 12 de noviembre de 2026

Tras la primera prueba en el teléfono, el usuario indicó que el resultado no se parecía suficientemente a la maqueta de referencia. Se identificó que la primera CSS había aplicado principalmente una paleta de color y degradados, sin suficiente composición de manuscrito.

- Se rediseñó `app/css/style.css` con una cubierta de cuero oscura alrededor del pergamino, doble marco interior, texturas CSS en varias capas, adornos tipográficos, encabezados centrados, separadores ornamentales y una zona de escritura con líneas de papel.
- Se conservaron la interfaz textual, la narración con scroll independiente y la zona fija de escritura.
- Se mantuvieron ajustes para móviles y pantallas de poca altura.
- No se añadieron imágenes ni ilustraciones.
- Se actualizó `index.html` para cambiar el color de la barra del navegador y añadir una versión nueva a la URL de la hoja de estilos, evitando reutilizar la CSS anterior almacenada en caché.
- Commits: `dcedb4d` (rediseño CSS) y `2ab5ccc` (actualización de index y caché).
- Estado: cambios guardados en GitHub. Aún falta sincronizarlos con Termux y probarlos en Chrome. No considerar aprobada la nueva apariencia hasta recibir la valoración del usuario.

## Próximo paso
Comprobar `git status --short` en Termux; si está limpio, ejecutar `git pull --ff-only`. Después recargar la página del navegador. El servidor Node.js actual sirve los archivos desde la carpeta del proyecto, por lo que no hace falta reiniciarlo para cambios de CSS/HTML.


## Ajuste visual fiel a la maqueta — 12 de noviembre de 2026

El usuario aclaró que la meta no era una web beige con marcos, sino trasladar a CSS la estética completa de la imagen de referencia: papiro intensamente dorado/ocre, textura envejecida, manchas, bordes quemados y desiguales, ornamentos dibujados, tipografía clásica y composición de manuscrito. La ilustración del castillo se omite por la decisión firme de interfaz sin imágenes; no se sustituye por otra ilustración.

- Se añadió una nueva capa de estilos CSS para aproximar el papel cálido y texturizado, el desgaste oscuro de los bordes, la cabecera con emblema ornamental, separadores y zona de escritura enmarcada.
- Se mantiene la interfaz exclusivamente textual, sin panel de personajes cercanos.
- El campo de acción y el botón se colocan en horizontal en móvil cuando el ancho lo permite.
- Commit CSS: 5a66a63.
- Se actualizó la versión de caché en index.html para forzar la carga del nuevo CSS.
- Estado: cambios guardados en GitHub; pendientes de sincronizar en Termux y comprobar visualmente en Chrome. No declarar aprobado el diseño hasta la valoración del usuario.


## Reconstrucción de la maqueta original — 12/11/2026

El usuario confirmó la composición de la imagen de referencia como objetivo visual literal. Deben conservarse la cabecera de Cosmópolis con rosa de los vientos, el recuadro de ubicación/hora/día, el papel ocre envejecido, las manchas, bordes quemados, marcos y filigranas, tipografía ornamental, y el tintero con pluma junto al campo de escritura. Se eliminan la ilustración del castillo y el panel «Personajes cercanos». La interfaz sigue siendo textual: la pluma y el tintero se dibujan como vector SVG en línea, no como imagen externa.

Cambios aplicados en GitHub:
- `app/js/app.js`: nueva cabecera de manuscrito con dos rosas de los vientos, título, lema y metadatos; tintero/pluma vectorial junto al campo de acción; retirada de la alerta de diagnóstico.
- `app/css/style.css`: capas de textura de papiro, tonos ocre/dorados, bordes oscurecidos, ornamentos, marcos, tipografías de manuscrito (con fuentes web y alternativas locales) y distribución móvil inspirada en la maqueta.
- `index.html`: actualización de versiones de caché.
- Commits: `4ec005e` (estructura), `f225560` (estética), `322384a` (caché).
- Estado: guardado en GitHub; no probado todavía en el teléfono. La fuente ornamental remota requiere conexión; hay fuentes alternativas locales.
- Próximo paso: sincronizar en Termux con `git status --short` y, si está limpio, `git pull --ff-only`; recargar Chrome y valorar la apariencia. No dar el diseño por aprobado hasta la confirmación del usuario.

## Auditoría de fidelidad visual — 12 de noviembre de 2026

Se ha iniciado la comparación de la implementación de GitHub (rama main) con la imagen original «Cosmopolis: aventura en la Ciudadela de Ámbar.png», recuperada de la Biblioteca de ChatGPT y mostrada al usuario en esta sesión.

Archivos revisados sin modificarlos:
- index.html
- app/js/app.js
- app/css/style.css
- app/js/game/adventure.js
- app/js/game/director.js

Hallazgos de la implementación actual:
- app.js sí construye una cabecera .manuscript-header con dos rosas de los vientos, el logotipo, el lema y el bloque de ubicación/hora/día.
- La cabecera incluye además el botón «Mi ficha». La regla CSS .manuscript-header button lo coloca en una fila adicional (grid-column: 2 / 4), alterando la proporción y composición de la cabecera de referencia.
- La zona narrativa actual contiene un adorno superior, un rótulo de ubicación, un título y texto a ancho completo. No contiene el separador ornamental horizontal completo de la maqueta ni las opciones de exploración visibles como sección.
- La ilustración de la ciudad y el panel «Personajes cercanos» no aparecen en el marcado actual, coherente con las decisiones posteriores: interfaz exclusivamente textual y personajes integrados en la narración.
- La zona inferior sí contiene el tintero y la pluma dibujados mediante SVG, el campo de escritura y el botón «Enviar», dispuestos en horizontal.
- La hoja tiene capas de color ocre, texturas CSS, oscurecimiento de bordes y un polígono de contorno irregular. La implementación reproduce parte del lenguaje material, pero todavía no acredita fidelidad completa en proporciones, marcos, ornamentos ni distribución global.
- No hay barra inferior de Historial/Mapa/Inventario/Opciones en el marcado actual; la interfaz aprobada posteriormente prioriza las dos zonas funcionales de narración y escritura.

Alcance de esta auditoría:
- Solo lectura de archivos en GitHub. No se ha modificado código ni se ha probado la versión actual en Chrome del teléfono.
- No se declara aprobada la apariencia actual.
- Próximo paso: comprobar el estado local en Termux antes de sincronizar GitHub, sin sobrescribir cambios locales. Después comparar la página real en el móvil con la referencia y decidir ajustes concretos, uno a uno.

Norma reforzada por el usuario: la referencia debe respetarse en composición, formas, detalles ornamentales, tipografía, textura, proporciones y matices de color; no basta con copiar la paleta cromática. Las exclusiones funcionales (ilustración y panel permanente de personajes) se mantienen.



## Corrección estructural de fidelidad visual — 12 de noviembre de 2026

Se recuperó y examinó la imagen original «Cosmopolis: aventura en la Ciudadela de Ámbar.png» desde la Biblioteca de ChatGPT. Se utilizó como referencia visual directa; no se pidió al usuario volver a adjuntarla.

Hallazgo principal: `app/css/style.css` había acumulado 1.172 líneas y varias iteraciones superpuestas, con cinco bloques distintos para `.adventure-screen`, cuatro para `.adventure-screen::before` y múltiples redefiniciones de los mismos selectores. Esa cascada hacía difícil controlar el resultado y mantener proporciones coherentes. Además, `.manuscript-header button` ocupaba una fila adicional y alteraba la composición de cabecera de la maqueta.

Cambios preparados en esta iteración:
- Se conserva intacta la primera parte de CSS dedicada a creación de personaje y ficha.
- Se sustituye el conjunto de iteraciones visuales duplicadas por una única sección coherente para la pantalla de aventura.
- Se mantienen la hoja ocre, el borde irregular oscurecido, la cabecera en cuatro columnas, el bloque de ubicación/hora/día, la zona narrativa desplazable y el área fija de escritura.
- Se dibujan las rosas de los vientos con SVG vectorial en vez de usar un símbolo tipográfico genérico.
- El acceso «Mi ficha» se traslada fuera de la cabecera para que no deforme su composición.
- Se mantienen la pluma y el tintero vectoriales, sin incorporar ilustraciones de escenas, castillo ni panel permanente de personajes.
- Se actualizan las versiones de caché de CSS y JavaScript.

Commits creados en GitHub (rama main):
- `507b3b2` — unificación de la hoja CSS de aventura (de 1.172 a 636 líneas; un único bloque principal de `.adventure-screen`).
- `a249aed` — rosas de los vientos vectoriales y traslado de «Mi ficha» fuera de la cabecera.
- `a8ef42b` — actualización de caché para CSS y JavaScript.
- `93aa9c8` — registro de esta corrección en el documento maestro.

Pruebas pendientes:
- Sincronizar los cambios en Termux.
- Ejecutar `node --check app/js/app.js`.
- Recargar `http://127.0.0.1:8080/index.html` en Chrome y comparar la composición con la referencia.
- No declarar el diseño aprobado hasta que el usuario confirme la apariencia real en su teléfono.



## Corrección de contraste, bordes y ornamentos — 12 de noviembre de 2026

Tras recuperar y examinar la imagen original de referencia, el usuario señaló diferencias concretas que seguían pendientes: el fondo exterior debía ser negro, el borde del papiro mucho más quemado y oscuro, las esquinas debían parecer dobladas, y la rosa de los vientos y el conjunto de pluma/tintero necesitaban un dibujo ornamental más elaborado.

Se prepara una corrección específica sobre la implementación existente:
- Fondo exterior casi negro, para separar visualmente el folio del entorno.
- Borde de papel con recorte irregular más pronunciado, bandas de quemado más oscuras, sombras profundas y textura más envejecida.
- Cuatro pliegues triangulares superpuestos en las esquinas para simular papel doblado.
- Rosas de los vientos SVG más complejas, con anillos, marcas radiales y estrella de ocho puntas.
- Pluma con barbas y nervadura más detalladas, junto a un tintero de vidrio oscuro con cuello, bandas y reflejos.
- Se conserva la interfaz exclusivamente textual: no se recupera la ilustración de la ciudad ni el panel permanente «Personajes cercanos».

Estado: cambios guardados en GitHub en cuatro commits consecutivos: `5571043` (fondo negro, borde quemado y pliegues), `c6c84bb` (SVG ornamentales), `8eee259` (caché) y `76973af` (documentación). Se ha fijado expresamente la capa de los pliegues por encima del contenido para que sean visibles. Pendiente sincronizar en Termux, ejecutar `node --check app/js/app.js` y comprobar en Chrome. La apariencia no se considerará aprobada hasta que el usuario la valide.


## 11. REPRODUCCIÓN DE LA MAQUETA ORIGINAL — 12 DE NOVIEMBRE DE 2026

Referencia visual oficial: archivo de Biblioteca «Cosmopolis: aventura en la Ciudadela de Ámbar.png».

Instrucción literal del usuario: reproducir esta maqueta sin reinterpretaciones, conservando el pergamino, el borde irregular y quemado, la paleta de colores y tonos y la tipografía. Retirar únicamente la ilustración del castillo y el bloque «Personajes cercanos» para ampliar el espacio del narrador.

Cambios publicados:
- `app/css/style.css`: reconstruida la composición visual de aventura alrededor del pergamino, con fondo exterior casi negro, borde irregular quemado, tonos ocre/dorados, doble marco y esquinas plegadas.
- Se conserva la tipografía ya cargada en el proyecto: `UnifrakturMaguntia` para el título y `IM Fell English` para subtítulo, ubicación, narración y controles.
- Se amplía la zona narrativa retirando el pequeño encabezado ornamental y el título intermedio que reducían el espacio de lectura.
- `app/js/app.js`: la narración ocupa directamente el área central; se mantienen el campo de acción, el botón Enviar y el acceso a la ficha.
- `index.html`: versión de caché actualizada a `20261112-referencia-original1`.

La ilustración del castillo y el panel «Personajes cercanos» no se renderizan en la pantalla de aventura actual. No se han añadido ilustraciones de escena ni se ha cambiado la lógica de guardado, acciones o respuestas.

Commits:
- CSS: `3f098a9`
- Narración: `f4c5803`
- Caché: `b7a96ac`

Estado: publicado en `main`; pendiente de sincronización y prueba visual en Termux/navegador. La fidelidad visual no se considera aprobada hasta que el usuario la confirme.


## Barra inferior de navegación — 12 de noviembre de 2026

Se recupera en la pantalla de aventura la franja de cuatro accesos que aparece en la maqueta original: Historial, Mapa, Inventario y Opciones. Se coloca debajo del panel de escritura, fijada al conjunto de la hoja, con cuatro columnas, separadores verticales, iconos vectoriales lineales y la paleta de pergamino ocre, tinta marrón y oro viejo.

- Archivos modificados: app/js/app.js y app/css/style.css.
- Historial: muestra las acciones guardadas de la sesión.
- Mapa, Inventario y Opciones: los botones informan claramente de que sus pantallas aún no están implementadas; no se simula que esas funciones existan.
- Se mantienen la interfaz textual y la ausencia de ilustraciones.
- Commit de `app.js`: `975f86e`.
- Commit de `style.css`: `ef7ca75`.
- Commit de `index.html` (invalidación de caché): `b5a7c78`.
- Commit de esta actualización documental: `17b0642`.
- Estado: cambios guardados en `main` y releídos desde GitHub. No se ha podido ejecutar todavía una vista previa real de la aplicación completa para compararla píxel a píxel con la maqueta; tampoco se ha probado en el navegador móvil. Por tanto, no se declara fidelidad visual completa ni se solicita al usuario que abra la página.


## Ajuste de cabecera y emblemas de navegación — 12 de noviembre de 2026

Segunda pasada de fidelidad basada en inspección directa de la maqueta original.

- Se sustituyen los cuatro pictogramas genéricos por dibujos vectoriales más próximos a los emblemas de la referencia: libro abierto, mapa enrollado, mochila y engranaje.
- Se refuerza el marco inferior con doble contorno, esquinas redondeadas, líneas interiores y tonos de pergamino/dorado.
- Se compacta la cabecera de aventura y se reduce el margen superior del conjunto para acercar el título al borde superior y liberar espacio vertical para la narración.
- No se modifica la lógica de guardado ni el contenido de las pantallas que aún no existen.
- Commits de esta pasada: `1e5661e` (emblemas), `5c21f69` (estilos iniciales), `605d3ca` (caché) y `a72f3c5` (ajuste móvil).
- Esta pasada se basa en comparación de la imagen original y el código fuente; todavía no equivale a una prueba de renderizado del navegador ni permite certificar coincidencia visual total.


## Corrección técnica de las esquinas dobladas — 12 de noviembre de 2026

Durante la revisión del CSS se detectó una colisión de reglas: el selector general `.adventure-screen > *` asignaba `position: relative` a todos los hijos directos, incluidos los cuatro elementos `.paper-fold`. Esa regla anulaba el `position: absolute` declarado para los pliegues, por lo que sus coordenadas de esquina no podían aplicarse como estaba previsto.

Corrección aplicada en `app/css/style.css`: el selector específico `.adventure-screen > .paper-fold` vuelve a declarar explícitamente `position: absolute` y mantiene `z-index: 20`. Se actualizó la versión de caché de CSS/JavaScript en `index.html` a `20261112-pliegues-corregidos`.

Commits:
- CSS: `3c8b022`.
- Caché: `3cb7840`.

La corrección está guardada en GitHub `main`. Es un arreglo deducido directamente de la cascada CSS; todavía no se ha podido obtener una captura renderizada del navegador para verificar su aspecto final. No se declara aprobada la fidelidad visual.


## Vista previa automática para comparación visual — 12 de noviembre de 2026

Se ha añadido `.github/workflows/visual-preview.yml` para superar la limitación de no disponer de navegador automatizado en el entorno de trabajo:

- GitHub Actions ejecuta Chromium mediante Playwright cuando cambian `app/**`, `index.html` o el propio flujo.
- Arranca un servidor HTTP local y carga la aplicación con una partida ficticia de prueba en almacenamiento local.
- Renderiza capturas de aventura en móvil (390 × 844) y escritorio (1024 × 900).
- Publica ambas capturas como artefacto `cosmopolis-visual-preview`, con retención de siete días.
- El flujo no modifica datos de juego ni requiere secretos; solo lee el repositorio.

Commit del flujo: `7cf8c9d`.

Objetivo inmediato: recuperar el artefacto de esa ejecución, inspeccionar las capturas y contrastar la composición renderizada con la maqueta original. Esta automatización todavía no demuestra que la ejecución haya terminado correctamente ni que la apariencia sea fiel; ambas cosas quedan pendientes de verificación. No pedir al usuario que abra la página hasta completar esa comparación.


### Primera comparación renderizada con la maqueta — 12 de noviembre de 2026

Se recuperó de la Biblioteca de ChatGPT la referencia original y se inspeccionó junto a las capturas reales generadas por Chromium.

Observaciones verificadas:
- La estructura general sí está presente en el render móvil: cabecera horizontal con dos rosas, título/subtítulo, metadatos; folio narrativo; panel fijo de escritura; barra inferior de cuatro herramientas.
- La proporción vertical de cabecera y la distribución general se aproximan a la referencia.
- La versión renderizada mantiene los ornamentos principales, los pliegues de esquina y el fondo exterior negro.
- Diferencias visibles que todavía requieren una pasada de detalle: la textura del papel actual es más regular y cuadriculada que la textura orgánica de la referencia; el borde quemado y recortado puede ganar irregularidad y profundidad; el marco del panel de escritura y los emblemas inferiores son menos ricos en filigrana que los de la maqueta.
- La captura inicial mostró secuencias literales `\\n` entre párrafos, pero se comprobó que el origen era exclusivamente el texto ficticio de la prueba automatizada, no el renderizador de la aplicación. Se corrigió el escape en el flujo para que la siguiente captura use saltos de línea reales.

Ejecución 1:
- Workflow: `Visual preview`, run `43211352971`.
- Resultado: instalación, servidor, renderizado y subida de artefactos completados correctamente.
- Artefacto: `cosmopolis-visual-preview`, ID `13941422014`.
- Capturas obtenidas: móvil 390 × 844 y escritorio 1024 × 900.
- Commit del flujo: `7cf8c9d`; corrección del texto de prueba: `ec0f8a5`.

Siguiente paso: inspeccionar la segunda captura corregida y aplicar ajustes visuales pequeños y respaldados por la comparación; no modificar a ciegas la composición que ya se ve correctamente.


### Textura orgánica del pergamino — 12 de noviembre de 2026

A partir de la comparación de la captura corregida con la maqueta original, se ha eliminado el patrón cuadriculado regular que aparecía en la hoja. Se ha sustituido por una capa sutil de ruido fractal SVG embebido y veladuras radiales irregulares en tonos sepia/ocre, manteniendo el color base y el sombreado quemado de los bordes. El cambio afecta únicamente al fondo del folio; no altera la distribución, tipografía, controles ni lógica de juego.

- CSS: commit `2bbe809`.
- Caché CSS/JS: commit `d9b8a40`, versión `20261112-textura-organica`.
- La actualización está guardada en `main`.
- Pendiente: inspeccionar la siguiente captura automática para comprobar que la textura SVG se renderiza correctamente en Chromium y que se acerca más al aspecto irregular del papel original.


### Intensificación de la pátina envejecida — 12 de noviembre de 2026

La segunda captura confirmó que la retirada de las líneas repetidas eliminó el aspecto cuadriculado, pero la pátina seguía demasiado uniforme frente al papel de la maqueta. Se intensificó el grano fractal SVG (frecuencia .9, cuatro octavas, opacidad .25), se añadieron veladuras radiales irregulares y se oscureció ligeramente el tono ámbar base. No se tocaron proporciones ni controles.

- CSS: commit `bee3d34`.
- Caché: commit `fae92a4`, versión `20261112-pergamino-envejecido`.
- Se verificó por lectura de GitHub que el bloque CSS contiene la nueva textura y los valores actualizados.
- Pendiente: inspeccionar el siguiente render automático para confirmar el efecto visual real del grano.


### Verificación del render con párrafos corregidos — 12 de noviembre de 2026

La segunda ejecución de Playwright confirmó que los saltos de párrafo ya se muestran como espacios reales entre bloques narrativos; desapareció el texto literal `\\n` observado en la primera captura. La composición móvil mantiene la cabecera y los dos paneles inferiores dentro del ancho de 390 px, sin desbordamiento horizontal visible.

- Workflow run: `43211556070`, resultado satisfactorio.
- Artefacto: `cosmopolis-visual-preview`, ID `13941721086`.
- Capturas inspeccionadas: móvil y escritorio.
- La segunda comparación confirmó que la textura seguía siendo demasiado uniforme; de ahí los dos ajustes de pátina registrados a continuación.
- Nueva prueba de textura intensificada en curso: runs `43211960786` y `43211980887`; el segundo corresponde al último estado con caché `20261112-pergamino-envejecido`.


### Grano y manchas de papel en dos escalas — 12 de noviembre de 2026

La captura con pátina intensificada seguía mostrando una superficie más lisa que la referencia. Se ha añadido una segunda capa SVG de ruido fractal: una escala amplia de manchas (frecuencia .12, opacidad .32) y otra fina de grano (frecuencia .82, opacidad .17). La combinación conserva el tono ámbar y evita recuperar el patrón cuadriculado eliminado.

- CSS: commit `310d0f2`.
- Caché: commit `3f58bd6`, versión `20261112-textura-moteada`.
- Pendiente: comprobar en Chromium la visibilidad y naturalidad de ambas escalas; si el ruido resulta excesivo o sigue siendo imperceptible, revertir o ajustar solo la intensidad.


### Contorno rasgado menos geométrico — 12 de noviembre de 2026

La inspección de la última captura mostró que la textura ya presenta manchas y grano, pero el recorte del folio seguía repitiendo dientes de tamaño casi idéntico. Se sustituyó el polígono uniforme por un contorno con longitudes y profundidades variables en los cuatro lados, buscando acercarlo al borde irregular de la maqueta.

- CSS: commit `f0a65a6`.
- Caché: commit `68d91cd`, versión `20261112-bordes-irregulares`.
- La modificación solo afecta al recorte del papel. Pendiente comprobar el render móvil/escritorio antes de conservarla como definitiva.


### Métricas reales de distribución móvil y textura en capas — 12 de noviembre de 2026

La ejecución `43211980887` completó correctamente el renderizado y subió el artefacto `13942450830`. La inspección visual confirma que las dos escalas de ruido generan manchas orgánicas visibles, sin volver al entramado cuadriculado. El papel queda más cálido y envejecido; se mantiene pendiente juzgar si la intensidad final es la adecuada frente a la maqueta.

Métricas recogidas directamente por Playwright en 390 × 844:
- Documento: 390 × 844; ancho del documento igual al viewport, sin desbordamiento horizontal.
- Folio: 390 × 844.
- Cabecera: x=6, y=3, ancho=378, alto=80.
- Narración: x=6, y=83, ancho=378, alto=563.83.
- Panel de escritura: x=6, y=646.83, ancho=378, alto=128.17.
- Barra inferior: x=6, y=779, ancho=378, alto=60.

La automatización ha demostrado que la estructura ocupa el ancho móvil completo y mantiene fijos el panel de escritura y la barra inferior, dejando el área narrativa como zona flexible y desplazable.

La revisión del contorno de borde irregular y la textura en dos escalas está en ejecución con los runs `43212385941` y `43212397333`; el segundo incluye el último cambio de caché. No considerar aprobada la fidelidad hasta inspeccionar su captura.


### Verificación final del contorno y grano orgánico — 12 de noviembre de 2026

La ejecución `43212397333` ha renderizado correctamente la versión con doble escala de ruido y contorno irregular. Capturas descargadas e inspeccionadas en móvil y escritorio. El grano y las manchas ya se distinguen a tamaño móvil y el borde deja de repetir exactamente el mismo diente. La lectura conserva párrafos separados y la distribución no presenta desbordamiento horizontal.

- Artefacto: `cosmopolis-visual-preview`, ID `13941223619`.
- Run: `43212397333`, commit renderizado `68d91cd`.
- Métricas móviles: documento 390 × 844; cabecera 378 × 80; narración 378 × 563.83; panel de escritura 378 × 128.17; barra inferior 378 × 60.
- El panel de escritura y la barra inferior quedan anclados al fondo; la narración ocupa el espacio flexible.
- Comparación visual: la textura y el recorte están más próximos al pergamino de la maqueta. Aún hay diferencias en el nivel de filigrana de los marcos del panel de escritura y de la barra inferior; no se declara coincidencia exacta ni aprobación final.

La captura está verificada, pero no se ha solicitado al usuario sincronizar ni probar en el teléfono. Próxima pasada: valorar únicamente el marco ornamental del panel de escritura y la barra inferior frente a la maqueta, sin alterar la composición funcional ya medida.


### Filigrana vectorial de los marcos inferiores — 12 de noviembre de 2026

La comparación de la captura confirmó que el pergamino ya tiene una textura y un borde más orgánicos, pero los marcos del área de escritura y de la barra inferior seguían siendo demasiado geométricos frente a la maqueta. Se han añadido trazos SVG ornamentales embebidos en CSS, con esquinas de volutas, líneas dobles y rombos centrales, sin añadir imágenes externas ni modificar el HTML o la lógica de controles.

- CSS: commit `4eec70f`.
- Caché: commit `c435b2e`, versión `20261112-marcos-ornamentales`.
- Pendiente: inspeccionar el render automático para comprobar que los trazos se ajustan a los paneles en móvil y escritorio y no interfieren con el texto o los botones.


### Ajuste de escala de la filigrana — 12 de noviembre de 2026

La captura de los nuevos marcos reveló un problema de proporción en escritorio: los SVG conservaban la relación de aspecto original y quedaban centrados, por lo que sus adornos no alcanzaban los extremos del panel. En móvil el efecto era menos evidente.

Corrección aplicada: se añadió `preserveAspectRatio='none'` a ambos SVG embebidos para que el marco se adapte al ancho y alto reales de cada panel.

- CSS: commit `5afef7e`.
- Caché: commit `8f70322`, versión `20261112-marcos-ajustados`.
- Pendiente: volver a inspeccionar escritorio y móvil; el marco debe recorrer ahora todo el ancho de cada panel sin invadir el campo ni los botones.


### Compactación de volutas para despejar los controles — 12 de noviembre de 2026

La captura posterior al ajuste de escala confirmó que los marcos ya cubren todo el ancho también en escritorio, pero las volutas del panel de escritura quedaban demasiado grandes y se acercaban a la pluma y al botón «Mi ficha». Se han reducido las cuatro volutas de esquina del SVG del panel de escritura; se conserva la línea ornamental y el marco extendido. La barra inferior no se modifica.

- CSS: commit `cd13bff`.
- Caché: commit `889fd7a`, versión `20261112-volutas-compactas`.
- Pendiente: verificar la nueva escala en ambas resoluciones.


### Validación de marcos ornamentales en móvil y escritorio — 12 de noviembre de 2026

La ejecución `43213175518` terminó correctamente y se inspeccionaron las dos capturas generadas con el SVG estirado y las volutas compactas.

- Artefacto: `cosmopolis-visual-preview`, ID `13942571997`.
- Run: `43213175518`, conclusión `success`.
- En móvil (390 × 844), las volutas quedan en las esquinas y ya no invaden la pluma, el campo de escritura, el botón Enviar ni «Mi ficha».
- En escritorio (1024 × 900), los marcos recorren el ancho del panel y las esquinas siguen siendo proporcionadas; se corrige el problema de centrado anterior.
- La barra inferior conserva sus cuatro botones y sus separadores; los adornos quedan en el contorno.
- No se han modificado los controles, los textos ni la lógica de guardado.

Estado visual: la composición está más cerca de la maqueta en textura, borde rasgado y filigrana inferior. Sigue sin ser una coincidencia exacta: la maqueta tiene un acabado de tinta y papel más complejo y el marco de escritura aún es una aproximación vectorial. No declarar aprobada hasta que el usuario la vea en su dispositivo.

Todos los cambios de esta pasada están guardados en `main`; CSS `4eec70f` + corrección de escala `5afef7e` + volutas compactas `cd13bff`; caché final `889fd7a`. La documentación se actualiza aquí para conservar continuidad.


### Confirmación de volutas compactas — 12 de noviembre de 2026

La ejecución `43213175518` completó correctamente y se inspeccionaron las capturas de móvil y escritorio.

- Artefacto: `cosmopolis-visual-preview`, ID `13942571997`.
- En móvil, las cuatro volutas quedan dentro de las esquinas del panel de escritura y dejan libres la pluma, «Mi ficha», el campo y «Enviar».
- En escritorio, el marco se adapta a la anchura completa sin volver a concentrar los adornos en el centro.
- La barra inferior conserva la disposición de cuatro botones y los adornos de esquina.
- No se detectan desbordamientos en la medición móvil anterior (390 px de documento para 390 px de viewport).

La corrección de escala y la reducción de volutas quedan verificadas por captura automatizada. La fidelidad global sigue siendo aproximada, no una reproducción exacta; no se solicita todavía la validación final en el teléfono.


### Filigrana de cabecera y panel de ubicación — 12 de noviembre de 2026

Tras revisar las capturas de móvil y escritorio, la cabecera y el panel de ubicación eran los dos elementos que aún se veían demasiado planos frente a la maqueta. Se añadieron marcos SVG ornamentales embebidos en CSS: líneas finas, volutas discretas en las esquinas y rombos centrales. El panel de ubicación recibe su propio marco interior, manteniendo el texto legible.

- CSS: commit `507db11`.
- Caché: commit `6e7cd35`, versión `20261112-filigrana-cabecera`.
- No se alteran las brújulas, el logotipo, la cuadrícula ni las dimensiones del encabezado.
- Pendiente: render automatizado móvil/escritorio para comprobar que la filigrana no se superpone al título ni a los datos de ubicación.


### Verificación de filigrana de cabecera y ubicación — 12 de noviembre de 2026

La ejecución automatizada posterior al cambio de cabecera terminó correctamente. Se descargaron y revisaron las capturas de 390 × 844 (móvil) y 1024 × 900 (escritorio).

- Run: `43219215403`, commit renderizado `6e7cd35458b6650c3243f6df22cd730e4cc7f694`, conclusión `success`.
- Artefacto: `cosmopolis-visual-preview`, ID `13945445816`.
- En móvil, el marco ornamental queda dentro de la cabecera; no tapa el título, las brújulas ni el panel de ubicación. El panel interior conserva legibles ubicación, hora y fecha.
- En escritorio, las líneas y volutas se adaptan al ancho del encabezado y el marco interior del panel de ubicación mantiene sus proporciones.
- La estructura medida en la ejecución anterior conserva la distribución vertical: narración desplazable y panel de escritura/barra inferior anclados. La captura móvil actual no muestra desbordamiento horizontal ni solapamientos en cabecera o controles.

La pasada visual queda validada. La interfaz actual reúne textura envejecida, contorno rasgado, filigrana en cabecera, panel de ubicación, escritura y barra inferior, con cuatro controles visibles. Es una aproximación cuidada a la maqueta, no una reproducción exacta. No se ha cambiado la lógica del juego.


## 12. IA narrativa local — continuidad al 12 de noviembre de 2026

Objetivo aprobado: incorporar una IA ejecutada en el propio Android para generar narración y diálogos en español, conservar memoria de personajes y reaccionar a los hechos del mundo. Cosmopolis seguirá siendo exclusivamente textual; no se incorporarán imágenes ni ilustraciones.

Entorno comunicado durante la preparación:
- Dispositivo: Samsung SM-A576B, Android 17, arquitectura ARM64.
- Memoria disponible aproximada: 11,2 GiB; almacenamiento libre comunicado: 302 GB.
- Node.js: v26.12.1.
- llama.cpp ya está clonado en $HOME/llama.cpp y las herramientas de compilación necesarias se instalaron en Termux.

Plan técnico acordado:
1. Configurar y compilar llama.cpp en CPU, con una configuración conservadora para Termux/Android.
2. Probar modelos GGUF pequeños y comparar la calidad narrativa en español antes de decidir cuál se adopta.
3. Qwen3-4B GGUF Q4_K_M (aprox. 2,5 GB) queda como candidato inicial de evaluación, no como elección definitiva.
4. Integrar el servidor local de inferencia con la aplicación web y diseñar memoria persistente de personajes, relaciones, hechos y estado del mundo.

Siguiente paso operativo pendiente: desde Termux, dentro del clon $HOME/llama.cpp, ejecutar la configuración CMake:

```sh
cd "$HOME/llama.cpp" && cmake -S . -B build -DCMAKE_BUILD_TYPE=Release -DGGML_NATIVE=ON -DGGML_OPENMP=OFF -DGGML_LLAMAFILE=OFF -DLLAMA_BUILD_SERVER=ON -DLLAMA_BUILD_TESTS=OFF
```

Este paso solo configura la compilación; todavía no descarga ningún modelo ni modifica el juego. Revisar la salida completa antes de compilar. No asumir que la compilación ha terminado hasta comprobar el resultado real en Termux.


### Configuración CMake completada en Termux — 12 de noviembre de 2026

El usuario ejecutó la configuración CMake de llama.cpp en `$HOME/llama.cpp` con Release, backend CPU nativo ARM, OpenMP desactivado y servidor habilitado. Resultado satisfactorio: `Configuring done`, `Generating done` y archivos de compilación creados en `$HOME/llama.cpp/build`. Arquitectura detectada: aarch64 / ARM. Aviso no bloqueante: ccache no está instalado. CMake seleccionó `-mcpu=native` y generó la variante CPU con dotprod/i8mm/SVE según detección.

Siguiente paso: compilar únicamente el objetivo `llama-server` con paralelismo bajo (`-j2`) para moderar el uso de memoria del teléfono. No descargar modelo todavía.


### Compilación de llama-server completada — 12 de noviembre de 2026

El usuario compiló `llama-server` en Termux con `cmake --build build --target llama-server -j2`. La compilación terminó al 100 % sin errores; quedaron construidos `ggml`, `llama`, `server-context`, `llama-server-impl` y `llama-server`. Siguiente comprobación: verificar que `build/bin/llama-server` existe y responde a `--version`. Todavía no se ha descargado ningún modelo ni arrancado el servidor.


### Verificación del ejecutable llama-server — 12 de noviembre de 2026

La compilación de `llama-server` terminó correctamente al 100 %. Se ejecutó `"$HOME/llama.cpp/build/bin/llama-server" --version` y respondió `version: 0.9.0-dev (build 1, commit 711f9f4)`, compilado con `Clang 21.1.8 for Android aarch64`. El ejecutable queda verificado en el dispositivo. Siguiente paso: seleccionar y descargar un modelo GGUF ligero de prueba en el almacenamiento interno de Termux; todavía no se ha descargado ningún modelo ni iniciado el servidor.


### Modelo GGUF de prueba seleccionado — 12 de noviembre de 2026

Se selecciona como candidato inicial, no definitivo, `Qwen/Qwen3-4B-GGUF` en cuantización `Q4_K_M`, publicado por la organización Qwen en Hugging Face bajo licencia Apache 2.0. El archivo exacto es `Qwen3-4B-Q4_K_M.gguf`, con tamaño publicado de aproximadamente 2,5 GB. Es compatible con el flujo de uso documentado por el propio repositorio para llama.cpp. Para la primera prueba se limitará el contexto a 4096 tokens para contener el consumo de memoria. Referencia: https://huggingface.co/Qwen/Qwen3-4B-GGUF/tree/main. A fecha de esta anotación, el modelo aún no se ha descargado; pendiente de ejecutar la descarga en `$HOME/models` dentro del almacenamiento interno de Termux.


### Incidencia: descarga redundante detenida — 12 de noviembre de 2026

Se inició por error la descarga de `Qwen3-4B-Q4_K_M.gguf` desde Qwen3-4B-GGUF, pese a que Cosmopolis ya dispone de los modelos `Qwen3.5-2B-Q4_K_M.gguf` y `Qwen3.5-4B-Q4_K_M.gguf`; este último ya constaba como descargado y con SHA-256 verificado. La descarga adicional no era necesaria y no debe considerarse un tercer candidato prioritario. El usuario detuvo Termux mediante **Forzar detención** en los ajustes de Android para cortar el consumo de datos. Esto detiene el proceso, pero no confirma si quedó un archivo parcial; no borrar ni reanudar ese archivo sin comprobarlo. Próximo paso: reabrir Termux y trabajar con los dos modelos Qwen3.5 existentes, empezando por probar el 4B. No solicitar nuevas descargas ni repetir comprobaciones ya realizadas.


### Limpieza de descarga parcial — 12 de noviembre de 2026

El usuario confirmó que eliminó correctamente `$HOME/models/Qwen3-4B-Q4_K_M.gguf`, que había quedado en 147 MB tras detener la descarga redundante. Se conservan los dos modelos existentes en `$HOME/models/cosmopolis/`: `Qwen3.5-2B-Q4_K_M.gguf` (1,3 GB) y `Qwen3.5-4B-Q4_K_M.gguf` (2,6 GB), según la comprobación de tamaños anterior. No se requieren más descargas. Próximo trabajo: probar el Qwen3.5-4B ya disponible.


### Integración inicial del narrador local preparada — 12 de noviembre de 2026

Se ha incorporado una primera capa de integración en el repositorio, sin descargar modelos ni alterar los archivos GGUF del teléfono:

- Nuevo `app/js/game/narrator.js`: cliente del endpoint OpenAI-compatible de llama.cpp en `127.0.0.1:8081`. Comprueba `/health`, envía contexto del personaje, estado del mundo, pistas, hechos y seis acciones recientes, y solicita una respuesta JSON estructurada.
- `index.html`: carga el cliente después de `director.js`.
- `app/js/app.js`: el envío de acciones pasa a ser asíncrono, bloquea el formulario durante la generación y mantiene la persistencia mediante `Session.addAction`.
- `app/css/style.css`: estilo para el estado de espera.
- Si el servidor local no está disponible, la petición falla o la respuesta no cumple el esquema, se utiliza `Director.respond()` como alternativa; no se pierde la acción por falta de IA.
- Se limita la aplicación de cambios del modelo: ubicación, hechos/pistas nuevos, evento y variación de confianza de Elia entre -1 y 1.
- Nuevo lanzador `scripts/iniciar_ia_local.sh`: usa el Qwen3.5-4B existente, puerto 8081, contexto 4096, cuatro hilos, una petición simultánea y CORS limitado a `http://127.0.0.1:8080`. No realiza descargas.
- Nueva guía `docs/IA_LOCAL_ANDROID.md` con arranque y pruebas pendientes.

La documentación oficial de llama.cpp confirma el endpoint `POST /v1/chat/completions`, el endpoint de salud `/health`, el modo de respuesta JSON con esquema y las opciones de CORS/puerto. Referencia: https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md.

**Estado de verificación:** los archivos se han creado y recuperado de GitHub para comprobar que los puntos de integración y el orden de carga están presentes. La inferencia real, la respuesta JSON del modelo, la persistencia y el rendimiento aún no se han probado en el Samsung; requieren arrancar el servidor en Termux. No declarar la IA integrada y validada hasta completar esas pruebas. Próximo paso cuando el teléfono esté disponible: sincronizar `main`, ejecutar `bash scripts/iniciar_ia_local.sh`, comprobar `/health` y realizar la primera acción desde el navegador.


### Ampliación del contexto de memoria — 12 de noviembre de 2026

El cliente `Narrator` incorpora también la memoria persistente recuperada mediante `Session.getWorld()`: hasta 50 hechos, los 20 eventos más recientes y las relaciones guardadas. Se combina con el estado actual de la aventura y las seis acciones más recientes para dar continuidad al modelo. El cambio está en GitHub; todavía requiere prueba real con el modelo en el dispositivo.


### Comprobación estática del lanzador y cliente — 12 de noviembre de 2026

Se ha ejecutado una validación sintáctica con Node.js sobre el cliente `narrator.js` y `bash -n` sobre el lanzador `scripts/iniciar_ia_local.sh`; ambos han pasado. También se ha comprobado en GitHub que el formulario usa el envío asíncrono, que el módulo se carga después de `Director` y que el estado de espera queda fuera de la cuadrícula de tres columnas. Esto no sustituye las pruebas de ejecución en Android ni confirma que Qwen3.5-4B cargue y genere respuestas; esas pruebas siguen pendientes.


### Primer arranque del servidor en el Samsung — 12 de noviembre de 2026

El usuario sincronizó correctamente `main` en Termux mediante `git pull --ff-only origin main`, avanzando de `91bcace` a `56a9434`. El lanzador `scripts/iniciar_ia_local.sh` se ejecutó y comunicó que inició `llama-server` en segundo plano con PID 2537; registro en `$HOME/cosmopolis-llama-server.log`. Este mensaje confirma el inicio del proceso, pero todavía no confirma que el modelo Qwen3.5-4B haya terminado de cargar ni que el endpoint de salud responda. Siguiente verificación: consultar el registro y `/health` antes de probar el juego.


### Modelo Qwen3.5-4B cargado y servidor listo — 12 de noviembre de 2026

El usuario ejecutó en Termux la consulta del registro y del endpoint de salud. El registro confirma que llama.cpp cargó el archivo `$HOME/models/cosmopolis/Qwen3.5-4B-Q4_K_M.gguf`, inicializó un único slot con contexto de 4096 tokens y cuatro hilos, informó `model loaded` y quedó escuchando en `http://127.0.0.1:8081`. La petición a `http://127.0.0.1:8081/health` devolvió `{"status":"ok"}`. Por tanto, el proceso PID 2537 está operativo y el modelo está cargado; no se necesita descargar ni iniciar otra instancia. Próximo paso: abrir Cosmopolis en el navegador del teléfono (`http://127.0.0.1:8080/index.html`) y probar una acción narrativa real. La generación, el formato JSON, la aplicación de cambios y la persistencia todavía no están validados.


### Revisión de la integración tras cargar el modelo — 12 de noviembre de 2026

Se ha revisado el flujo actual de `narrator.js`, `app.js` y `game/session.js` en la rama `main`:

- El cliente consulta `/health` antes de llamar a `/v1/chat/completions`, limita la espera de generación a 90 segundos y vuelve a `Director.respond()` si el servidor falla o la respuesta no se puede validar.
- La petición utiliza `response_format` con `type: "json_schema"` y un esquema que restringe los campos narrativos. La documentación de llama.cpp confirma que `/v1/chat/completions` admite respuestas JSON restringidas por esquema: https://github.com/ggml-org/llama.cpp/blob/master/tools/server/README.md.
- La respuesta validada se convierte en una nueva aventura; `Session.addAction()` guarda acción, narración, aventura actualizada y evento mediante `Save.save()`. El historial anterior se mantiene en el almacenamiento local.
- La guía `docs/IA_LOCAL_ANDROID.md` se actualizó para marcar como completados el arranque del modelo y la comprobación de salud.

**Límite de esta revisión:** es una inspección estática del código remoto. No demuestra todavía que el modelo haya generado una respuesta real desde el navegador, ni que CORS, la generación JSON, el rendimiento y la persistencia tras recarga funcionen en el dispositivo. La siguiente prueba necesaria sigue siendo enviar una acción desde la página del juego y revisar el resultado. No se ha reiniciado ni duplicado el servidor y no se ha descargado ningún archivo.


### Corrección de las dobleces de las esquinas — 12 de noviembre de 2026

Se ha recuperado y consultado la fotografía original aprobada «Cosmopolis: aventura en la Ciudadela de Ámbar.png» como referencia visual. La revisión del código identificó el origen del defecto señalado: cuatro elementos `.paper-fold` dibujaban las esquinas con `clip-path: polygon(...)`, produciendo pestañas triangulares ajenas al acabado orgánico del papiro.

Corrección preparada en CSS: se sustituyen las máscaras poligonales por pliegues curvos con bordes redondeados, iluminación y sombra suaves; se mantienen los cuatro puntos de doblado, el contorno irregular del papel y la composición general. No se modifica la cabecera, el contenido narrativo, los controles ni la lógica de juego.

**Validación pendiente:** ejecutar la vista previa automatizada de móvil y escritorio e inspeccionar visualmente las capturas junto a la fotografía original aprobada. Esta modificación no se declara finalizada ni fiel hasta completar esa comparación; si los pliegues curvos siguen pareciendo formas geométricas, se retirarán y se replantearán antes de darla por buena.


### Retirada de los pliegues artificiales y refuerzo del borde quemado — 12 de noviembre de 2026

Se inspeccionó directamente la imagen original de referencia «Cosmopolis: aventura en la Ciudadela de Ámbar.png». La referencia presenta el papel recortado de forma orgánica, con esquinas integradas en la silueta y dobleces discretas; no lleva cuatro adornos independientes superpuestos. La primera corrección con gradientes curvos aún mantenía cuatro piezas añadidas y no resolvía fielmente el problema.

Se retiran por completo los cuatro nodos `.paper-fold` del marcado HTML y sus reglas CSS. Se refuerza el oscurecimiento irregular de las cuatro esquinas y se modera el tono base del papiro, conservando la silueta irregular existente y el fondo negro. No se introducen triángulos, polígonos ni pseudo-elementos de pliegue. La estructura, composición y controles permanecen intactos.

**Validación visual:** queda pendiente renderizar en Chromium móvil y comparar la captura resultante con la referencia original antes de considerarlo aprobado. La automatización de vista previa debe ejecutarse sobre este commit; no se afirma todavía que la fidelidad visual esté verificada.


### Revisión de captura y corrección de la silueta del papiro — 12 de noviembre de 2026

Se descargó e inspeccionó el artefacto real de Chromium del run 26 (43253173126), tanto en móvil como en escritorio, y se comparó con la fotografía original recuperada de la biblioteca. La captura reveló un defecto que no debía haberse pasado por alto: aunque se habían retirado las piezas triangulares, la máscara clip-path: polygon(...) del propio papel conservaba una secuencia de dientes laterales muy regulares y agresivos. El render también quedaba demasiado pálido frente al ámbar tostado de la referencia.

Corrección aplicada en app/css/style.css (commit bda4f3c): se elimina la silueta poligonal dentada y se sustituye por una máscara SVG con desplazamiento de ruido fractal, para obtener un contorno irregular más orgánico y no geométrico. Se refuerza la textura de grano y se devuelve saturación cálida al degradado base, reduciendo el velo crema central que lavaba el tono. No se añaden elementos de esquina ni piezas superpuestas.

**Validación pendiente:** el commit ha disparado una nueva vista previa automática. Hay que descargar e inspeccionar el siguiente artefacto móvil/escritorio y contrastarlo con la imagen original antes de considerar resuelto el borde o el color. El run 26 sí terminó correctamente y sus capturas se inspeccionaron; el problema descrito arriba se detectó en ellas. No se ha probado nada en el teléfono durante esta sesión.


### Ajuste de escala de la máscara orgánica — 12 de noviembre de 2026

La captura del run 28 (43255589587) mostró que la primera máscara SVG se estaba representando con su proporción interna cuadrada en la pantalla vertical: el papel quedaba visible solo en una franja central. Se detectó al inspeccionar la captura real, no se considera una corrección válida. Se ha añadido preserveAspectRatio='none' a las dos fuentes SVG de máscara para que ocupen toda la superficie del pergamino en móvil y escritorio. Nuevo commit CSS: 065cc9a. La vista previa automática del commit debe confirmar que el fondo vuelve a cubrir toda la hoja y que el borde mantiene su irregularidad orgánica; la validación visual sigue pendiente.


### Segunda comparación visual: máscara ya cubre toda la hoja — 12 de noviembre de 2026

La captura real del run 29 (43255852452) confirma que el ajuste preserveAspectRatio='none' corrige el fallo anterior: el pergamino vuelve a cubrir toda la superficie en móvil y escritorio y desaparece la banda transparente. La máscara SVG funciona sin producir triángulos ni cortes rectos grandes. La comparación con la referencia original aún muestra un borde demasiado discreto y un papel algo lavado; por ello se ha aplicado otro ajuste en CSS (commit ace1c17): mayor desplazamiento orgánico del contorno, sombras interiores más anchas y oscuras, manchas de envejecimiento más visibles y menos velo crema en el centro. La vista previa del nuevo commit queda pendiente de inspección antes de cerrar el apartado.


### Ajuste de tono ámbar y grano tras el render 30 — 12 de noviembre de 2026

La captura móvil/escritorio del run 30 (43256134825) confirma que la máscara ya cubre toda la hoja, conserva el fondo y no crea recortes rectos ni pestañas triangulares. El borde quemado se ha hecho más ancho y oscuro, y el contorno se percibe más natural, aunque todavía es más regular que el de la fotografía. La comparación de color detectó que el centro del papel seguía demasiado apagado y rojizo respecto al oro/ocre luminoso de la referencia. Nuevo ajuste CSS (commit 41c4ac8): el degradado base pasa a una gama más dorada y luminosa, se refuerza ligeramente el grano y aumenta el desplazamiento de la máscara para dar más variación al borde. Pendiente inspeccionar el render siguiente; no se declara aún fidelidad final.


### Refinamiento final de la paleta y el borde — 12 de noviembre de 2026

El render 31 (43256501459) muestra que el pergamino ya recupera una gama dorada más próxima a la referencia, con textura visible y borde quemado. La medición visual del centro todavía indicaba menos luminosidad amarilla que en la imagen aprobada. Se aplica un último ajuste CSS (commit 4e1b478): reflejos centrales más dorados, base ámbar algo más luminosa y mayor variación de la máscara erosionada. Nueva vista previa automática pendiente de inspección. Se mantiene la decisión de no añadir pliegues decorativos falsos: las esquinas forman parte de una única silueta de papel.


### Pliegues orgánicos integrados en las esquinas — 12 de noviembre de 2026

Tras inspeccionar el render 32 (43256742801), se confirma que la silueta erosionada ya es continua, sin los dientes grandes del polígono original, y que el color se ha acercado al ámbar de la referencia. Para recuperar el detalle de las esquinas dobladas sin repetir el error de las pestañas triangulares, se han añadido en CSS dos trazos curvos muy discretos por esquina, como líneas de tensión y luz integradas en la textura del propio papel (commit CSS d47e827). No son piezas superpuestas ni polígonos rellenos. Pendiente la última captura automática para comprobar que las curvas se leen como pliegues naturales y no como adornos.


### Revisión de los pliegues y captura del run 33 — 12 de noviembre de 2026

Se descargaron e inspeccionaron las capturas móvil y escritorio del run 33 (43257072180). El render confirma que el papel cubre toda la zona narrativa, conserva el tono ámbar, presenta un borde erosionado continuo y no muestra los antiguos dientes triangulares. Los primeros trazos de pliegue se perdían demasiado cerca de la sombra del borde; se han desplazado hacia dentro y reforzado ligeramente para que las esquinas dobladas se lean como pequeñas curvas de tensión y luz, no como triángulos ni piezas añadidas (commit CSS 354f5a0). Pendiente la captura automática final de este ajuste.


### Captura final inspeccionada del ajuste de pliegues — 12 de noviembre de 2026

La vista previa del run 34 (43257402434) se descargó y se inspeccionó en móvil. La ejecución de Chromium completó los pasos de renderizado y subida del artefacto correctamente. El resultado conserva la hoja completa, la textura dorada y el borde irregular sin pestañas triangulares. Los trazos curvos de las esquinas se integran en la textura y son deliberadamente discretos; al quedar parcialmente bajo las piezas de cabecera y controles, no se leen como dobleces prominentes. Por tanto, se considera corregido el defecto de los triángulos y la máscara dentada, pero no se afirma que las dobleces de esquina reproduzcan exactamente la fotografía. El commit de código más reciente es 354f5a0; el historial maestro queda actualizado en este commit.


## Paneles de aventura, exploración e inventario — 12 de noviembre de 2026

Se ha continuado la programación pendiente sobre la rama `main`, manteniendo la interfaz exclusivamente textual y la composición de pergamino aprobada.

### Funciones implementadas

- Historial: panel de crónica que muestra las acciones del jugador, sus respuestas narrativas y la fecha registrada, sin desplegar permanentemente el historial en la página principal.
- Mapa: panel textual de lugares visitados/conocidos y pistas reunidas. No inventa conexiones ni dibuja territorios que el personaje todavía desconoce.
- Inventario: panel de pertenencias persistentes. Los objetos se añaden o retiran mediante cambios explícitos del narrador, no por el mero hecho de examinar algo.
- Opciones: muestra personaje, ubicación y número de acciones guardadas; permite guardar manualmente y consultar la ficha. El guardado automático existente se conserva.
- Exploración: botón discreto junto al área de escritura con cuatro sugerencias opcionales: observar alrededor, buscar personajes, examinar el lugar y escuchar. Cada sugerencia se envía como texto normal al narrador; la escritura libre sigue disponible.
- Memoria: cada acción registra la ubicación actual en `visitedLocations`; el estado de aventura incorpora `inventory`.
- IA local: el contexto enviado al modelo incluye inventario y lugares visitados. El esquema JSON incorpora `itemsToAdd` y `itemsToRemove`; el cliente valida ambos campos, evita duplicados y limita el inventario a 50 entradas.

### Archivos modificados

- `app/js/app.js`: paneles accesibles superpuestos al manuscrito y accesos de consulta/exploración.
- `app/css/style.css`: estilos de los paneles y controles de exploración adaptados a la paleta de pergamino.
- `app/js/game/adventure.js`: inicialización del inventario y de los lugares conocidos.
- `app/js/game/session.js`: persistencia de lugares visitados e inventario.
- `app/js/game/narrator.js`: contexto y contrato JSON para cambios reales de pertenencias.
- `docs/IA_LOCAL_ANDROID.md`: documentación de la memoria del inventario.
- `.github/workflows/visual-preview.yml`: prueba de interacción automatizada con Chromium.

### Validación y límites

La automatización se ha ampliado para probar Historial, Mapa, Inventario vacío, guardado manual, las sugerencias de exploración y la persistencia de un objeto devuelto por una respuesta JSON simulada del endpoint local. La captura móvil y de escritorio se sigue generando en el mismo flujo.

**No confundir la simulación automatizada con una prueba del modelo real.** Sigue pendiente comprobar en el Samsung que Qwen3.5-4B genera el nuevo esquema, que el navegador se comunica con el servidor local y que la partida conserva el inventario tras recargar. Tampoco se declara validada la apariencia en el teléfono: la inspección visual final queda para cuando el usuario pueda verla esta noche.

Commits de esta tanda:
- `82fa290`: preparar inventario y lugares conocidos.
- `5619255`: persistir lugares visitados e inventario.
- `3823a6a`: ampliar memoria narrativa con objetos.
- `f46a41c`: implementar paneles de aventura y ayudas de exploración.
- `705e45e`: estilos de paneles y controles.
- `fa386c3`: pruebas automatizadas de paneles, exploración y guardado.

Próximo paso: esperar el resultado del flujo de Chromium, corregir cualquier fallo detectado, revisar el resto de las funciones de guardado y navegación y dejar una nueva captura lista. No solicitar al usuario pasos en Termux ni nuevas confirmaciones durante esta continuación.


### Memoria individual de personajes — 12 de noviembre de 2026

Se ha ampliado el estado narrativo para que los personajes con presencia registrada conserven recuerdos concretos de acontecimientos compartidos:

- El esquema de respuesta de Narrator incluye `characterMemoriesToAdd`, con nombre y recuerdo.
- El cliente solo aplica recuerdos a personajes que ya existen en `adventure.state.characters`; una respuesta del modelo no puede crear personajes arbitrarios mediante este campo.
- Se eliminan duplicados y se limita la memoria a 30 entradas por personaje.
- Los recuerdos viven dentro del estado de aventura, por lo que se guardan con la partida y se vuelven a enviar al modelo en las acciones posteriores.
- Elia comienza con el recuerdo de su primer encuentro con el personaje.

La automatización de Chromium se ha ampliado para simular dos acciones consecutivas: encontrar un medallón y entregárselo a Elia. Comprueba la incorporación y retirada del objeto, el cambio de confianza, la conservación de dos recuerdos y la recuperación de la última página narrativa tras recargar.

Commits:
- `2af285b`: inicializar memoria individual de personajes.
- `9ba3101`: guardar recuerdos persistentes de personajes.
- `7bef390`: probar recuerdos individuales y persistencia de relaciones.

La prueba sigue siendo una simulación controlada del endpoint; no afirma que Qwen3.5-4B haya sido probado en el teléfono. Queda pendiente el ensayo de generación real y la inspección visual del usuario.


### Reloj interno y paso del tiempo — 12 de noviembre de 2026

Se ha separado el tiempo ficticio de la hora real del teléfono. La cabecera del manuscrito muestra ahora ubicación actual, momento del día y número de jornada de la aventura. El estado inicial empieza en el día 1, por la mañana.

El narrador devuelve `time` y `day` dentro del contrato JSON. El cliente valida ambos campos, conserva el momento anterior si llega vacío y limita el número de día a un entero positivo. Las instrucciones narrativas establecen que el tiempo solo avanza cuando la acción lo justifica y que la jornada cambia al cruzar al día siguiente. Al no existir un temporizador de fondo, el mundo permanece congelado cuando se cierra la partida, tal como se acordó.

La prueba de navegador simula dos acciones y verifica el cambio de «Media mañana» a «Mediodía», la persistencia de la hora interna tras recargar y la conservación del inventario, la relación y los recuerdos de Elia.

Commits:
- `3f48f17`: añadir reloj y día propios del mundo narrativo.
- `935d838`: integrar el paso del tiempo en la memoria narrativa.
- `668c34e`: mostrar el reloj interno en la cabecera del manuscrito.
- `57655ce`: probar reloj interno y avance de jornada.

El cambio está en GitHub; la generación real de esos valores por Qwen3.5-4B queda pendiente de prueba en el dispositivo. La automatización usa respuestas simuladas y no se debe confundir con una prueba del modelo.


### Registro de nuevos personajes y continuidad individual — 12 de noviembre de 2026

Se amplía el estado del mundo para que el narrador pueda registrar personajes nuevos que entren realmente en escena. El contrato JSON añade `charactersToAdd`, con nombre, función, ubicación, actitud y primer recuerdo. El cliente evita duplicados, limita las altas a cinco por respuesta y 50 personajes por aventura. Los recuerdos posteriores se incorporan mediante `characterMemoriesToAdd`, siempre sobre personajes ya registrados, con un máximo de 30 recuerdos por personaje.

Esto permite que los NPC importantes no dependan únicamente de las seis últimas acciones del historial: su identidad, situación y recuerdos quedan dentro de la partida y vuelven a formar parte del contexto enviado al modelo. No se registran figurantes irrelevantes ni se permite que el campo de recuerdos cree personajes arbitrarios.

La prueba automatizada simula la aparición de Tomás, guarda su recuerdo inicial, registra un segundo recuerdo tras entregar el medallón a Elia y comprueba la persistencia después de recargar.

Commits:
- `8436828`: registrar personajes nuevos y su memoria persistente.
- `061c1ca`: probar alta y memoria persistente de nuevos personajes.

Pendiente: confirmar que el modelo local real utiliza con fiabilidad este contrato en el dispositivo; el flujo automatizado valida el cliente con respuestas simuladas.


### Actualización de ubicación y actitud de personajes — 12 de noviembre de 2026

Se añade `characterUpdates` al contrato del narrador para mantener actualizadas la ubicación y la actitud de personajes existentes. Solo se modifican personajes ya registrados, se ignoran nombres desconocidos y campos vacíos y se limita cada respuesta a diez actualizaciones. La información queda dentro de `adventure.state.characters`, se guarda y vuelve a formar parte del contexto de la IA.

La prueba automatizada cambia la actitud de Elia después de encontrar el medallón y desplaza a Tomás a la entrada de la posada tras la segunda acción. Comprueba que ambos datos, junto con los recuerdos individuales, se conservan al recargar.

Commits:
- `6b3acb5`: mantener ubicación y actitud de personajes persistentes.
- `5d7f379`: probar cambios de ubicación y actitud de personajes.


### Actualización inmediata de la cabecera — 12 de noviembre de 2026

La cabecera del manuscrito se actualiza después de cada acción guardada. Se vuelven a leer los datos persistidos y se reflejan sin recargar la página la ubicación actual, el momento del día y la jornada interna. La prueba automatizada verifica el cambio a «Mediodía» en pantalla inmediatamente después de la segunda acción y vuelve a comprobarlo tras recargar.

Commits:
- `88d6198`: actualizar ubicación y reloj del manuscrito tras cada acción.
- `a6a4e90`: probar actualización inmediata del reloj y ubicación.


### Renovación de caché de la interfaz — 12 de noviembre de 2026

Se ha actualizado la versión de consulta de la hoja CSS y del JavaScript principal en `index.html` a `20261112-funciones-memoria`. Así, al sincronizar la rama en Termux y recargar la página, el navegador solicitará las nuevas funciones de paneles, inventario, memoria de personajes y reloj interno en lugar de reutilizar los recursos con la versión anterior de caché.

Commit: `42f828f`.


### Validación integrada de Chromium — run 59 — 12 de noviembre de 2026

La ejecución `43261787915` terminó con conclusión `success`. Se generaron las capturas móvil y escritorio y se completó la batería de interacciones. Artefacto: `cosmopolis-visual-preview`, ID `13962729257`.

Pruebas completadas:
- Apertura y cierre de Historial, Mapa, Inventario y Opciones.
- Guardado manual desde Opciones.
- Envío de una ayuda de exploración como acción normal.
- Respuesta JSON simulada del narrador local.
- Alta de un objeto en el inventario y retirada posterior al entregarlo.
- Registro de un personaje nuevo (Tomás), sus recuerdos y cambios posteriores.
- Actualización de actitud y ubicación de personajes existentes.
- Persistencia de confianza, recuerdos, inventario, lugar y reloj interno.
- Recuperación de la última acción y de la narración tras recargar.
- Actualización inmediata de ubicación y reloj en la cabecera sin recargar.

Medición de la vista móvil de 390 × 844:
- Documento: 390 × 844; sin desbordamiento horizontal.
- Cabecera: 378 × 80.
- Narración: 378 × 547, con desplazamiento propio.
- Panel de escritura: 378 × 145.
- Barra inferior: 378 × 60, dentro del alto visible.
- No se solapan la narración, el panel de escritura ni la barra inferior.

La vista de escritorio de 1024 × 900 también se generó sin desbordamiento horizontal ni errores JavaScript. Se inspeccionaron las dos capturas: se conserva el pergamino dorado, el borde erosionado, la cabecera, el área narrativa y los controles inferiores. La fidelidad con la fotografía de referencia sigue siendo aproximada y requiere la valoración del usuario en su teléfono.

Incidencia de pruebas resuelta: varias ejecuciones intermedias fallaban porque el propio `addInitScript` de Chromium volvía a escribir la partida de demostración en cada recarga, borrando los cambios que se intentaban verificar. Se cambió para inicializar solo cuando no existe una partida guardada. También se ajustó la aserción del Historial para comprobar la respuesta narrativa que realmente muestra, no el evento interno. El run 59 confirma que la recuperación funciona.

Capturas generadas:
- `cosmopolis-mobile.png`
- `cosmopolis-desktop.png`

El run 59 valida el código anterior al último cambio de versión de caché; el siguiente run se encargará de confirmar también el `index.html` actualizado.


### Validación final tras renovar caché — run 60 — 12 de noviembre de 2026

La ejecución `43261948491`, sobre el commit `42f828f`, terminó correctamente. Se confirmó que el cambio de versión de CSS y JavaScript en `index.html` no altera la interfaz ni rompe las pruebas. La batería completa de interacción volvió a pasar y se generaron nuevas capturas móvil y escritorio.

- Artefacto: `cosmopolis-visual-preview`.
- ID: `13964671036`.
- Capturas: `cosmopolis-mobile.png` y `cosmopolis-desktop.png`.
- Interacciones: Historial, Mapa, Inventario, Opciones, guardado manual, exploración, alta/retirada de objetos, alta y memoria de personajes, cambios de actitud/ubicación, reloj interno y recuperación tras recarga.
- Geometría móvil 390 × 844: documento 390 × 844; sin desbordamiento horizontal. Narración, panel de escritura y barra inferior permanecen dentro de la pantalla y sin solaparse.

El estado remoto de `main` contiene el conjunto de cambios y la documentación continua está guardada. La prueba sigue usando una respuesta simulada para verificar la integración del cliente; la inferencia real de Qwen3.5-4B y la apariencia en el navegador del Samsung no se declaran verificadas. Esas son las dos comprobaciones que quedan para la revisión con el usuario.


### Protección de continuidad del calendario — 12 de noviembre de 2026

Durante la revisión del narrador se detectó que una respuesta válida de la IA podía devolver un número de día inferior al ya alcanzado. Se ha corregido `app/js/game/narrator.js`: el día guardado ahora nunca retrocede, aunque el modelo proponga un valor anterior. Se mantiene el límite de 9999 y el día mínimo 1. El prompt también indica explícitamente que el narrador no debe reducir el día.

La prueba automatizada de Chromium se ha reforzado con dos respuestas simuladas: la primera avanza al día 2 y la segunda intenta volver al día 1. La comprobación exige que la partida conserve el día 2 después de la segunda acción y tras recargar.

Commits:
- `narrator.js`: protección contra retrocesos del día.
- `visual-preview.yml`: regresión automatizada del calendario.

Validación pendiente: ejecución del workflow tras estos commits. Esta prueba verifica la lógica del cliente con respuestas simuladas, no la generación real de Qwen3.5-4B en Android.


### Relaciones dinámicas para todos los personajes — 12 de noviembre de 2026

Se ha generalizado el cambio de confianza: deja de depender exclusivamente de Elia y pasa a aplicarse a cualquier personaje ya registrado. El contrato del narrador incorpora `relationshipChanges`, con personaje, variación pequeña (-1, 0 o 1) y motivo. El cliente solo modifica NPCs existentes, limita cada respuesta a diez cambios y mantiene la puntuación entre -5 y 10. Para conservar compatibilidad con la ficha narrativa de Elia, su campo histórico `eliaTrust` se sincroniza con su confianza individual.

El motivo de cada cambio se añade también a la memoria del personaje, evitando duplicados y respetando el límite de 30 recuerdos. Así, la relación no es solo un número: queda constancia de qué interacción la modificó y el modelo puede tenerlo en cuenta en escenas posteriores.

La prueba automatizada simula una entrega de objeto que mejora la confianza de Elia y Tomás, y comprueba las puntuaciones y el recuerdo asociado. Es una prueba del cliente con respuestas simuladas; no demuestra todavía que Qwen3.5-4B produzca cambios acertados en el teléfono.

Commit de implementación: pendiente de confirmación de GitHub Actions.


### Contexto compacto para modelos locales — 12 de noviembre de 2026

Se ha limitado el tamaño del contexto enviado a llama-server para evitar que una aventura larga desborde la ventana de contexto del modelo local. La petición conserva el estado narrativo completo necesario para resolver la acción, pero selecciona hasta 20 personajes dando prioridad a quienes están en la ubicación actual y a Elia; transmite hasta ocho recuerdos por personaje, los 20 eventos recientes, 25 hechos y pistas, 30 objetos, 25 lugares y seis acciones recientes. También se acotan los campos de la ficha y la longitud de las acciones/respuestas incluidas.

La compactación solo afecta al mensaje enviado al modelo: no elimina recuerdos, eventos ni personajes de la partida guardada. La prueba automatizada genera un estado de prueba más grande y verifica que el contexto se recorta mientras la memoria original permanece intacta.


### Actualización de caché del narrador — 12 de noviembre de 2026

Se ha versionado también la carga de `app/js/game/narrator.js` en `index.html`, junto con los identificadores de caché de CSS y del script principal. Esto evita que el navegador móvil reutilice una copia antigua del narrador y no reciba las mejoras de relaciones dinámicas y contexto compacto. Commit: `bf5317a`. La vista previa automática de este commit queda en ejecución.


### Validación integrada de relaciones y contexto compacto — run 66 — 12 de noviembre de 2026

La ejecución `43287834445` terminó con conclusión `success` sobre el commit `0e30715`. La prueba integrada confirma que Elia y Tomás reciben cambios de confianza justificados, que el motivo se conserva como recuerdo individual y que los cambios anteriores (inventario, memoria, ubicación/actitud, reloj y recarga) siguen funcionando.

También se probó la compactación del contexto: se simularon 30 eventos y 12 recuerdos de Elia; el mensaje enviado al modelo incluyó 20 eventos y ocho recuerdos, mientras la copia de la partida mantuvo intactos los 12. Se conservaron las seis acciones recientes. Esto confirma que se limita la petición sin borrar datos persistentes.

La vista móvil de 390 × 844 se generó sin desbordamiento horizontal ni solapamientos: narración 378 × 547, panel de escritura 378 × 145 y barra inferior 378 × 60. La prueba completa de interacciones, guardado y recarga terminó correctamente. Artefacto `cosmopolis-visual-preview`, ID `13975217633`.

La ejecución del commit de renovación de caché `bf5317a` (run 67) sigue pendiente de completar. Las pruebas de Chromium usan respuestas simuladas y no sustituyen la validación de Qwen3.5-4B real en el Samsung.


### Validación tras renovar caché del narrador — run 67 — 12 de noviembre de 2026

La ejecución `43287906891`, sobre el commit `bf5317a`, terminó con conclusión `success`. Chromium cargó la nueva URL versionada de `narrator.js`, generó las vistas móvil y escritorio, completó las interacciones y subió el artefacto de vista previa. La actualización de caché queda validada; se mantienen pendientes únicamente las pruebas de inferencia real con Qwen3.5-4B en el Samsung y la revisión visual directa del usuario en su navegador.


### Iniciativa visible de personajes presentes — 12 de noviembre de 2026

Se amplía el contrato del narrador con `characterActions`: hasta dos personajes ya registrados y presentes en la ubicación actual pueden realizar una pequeña iniciativa autónoma durante la escena. Las acciones se validan contra personajes existentes y su ubicación; no se aceptan acciones de personajes fuera de escena ni se cambia su ubicación con este mecanismo. Cada iniciativa se añade a la narración, se registra como `lastAutonomousAction` y se conserva como recuerdo individual (máximo 30). Esto permite que los personajes no se limiten a esperar la orden del jugador, sin simular movimientos fuera de cámara ni alterar el mapa de forma arbitraria.

La prueba de Chromium simula a Elia examinando una marca por iniciativa propia y comprueba que queda en su memoria. En la segunda acción, Tomás cambia a otra ubicación: aunque la respuesta simulada intenta asignarle una iniciativa en la plaza, el cliente la rechaza por estar fuera de escena. La prueba valida el procesamiento del cliente con respuestas simuladas; el comportamiento del modelo local real requiere prueba en el dispositivo.


### Protección de iniciativas fuera de escena — 12 de noviembre de 2026

Se amplió la regresión automatizada para confirmar que un personaje que se ha desplazado a otra ubicación no puede ejecutar una iniciativa atribuida a la escena actual. En la simulación, Tomás pasa a la entrada de la posada y el cliente descarta su supuesta acción en la plaza. Esto evita recuerdos y acontecimientos incoherentes causados por personajes que actúan desde lugares donde no están presentes.


## Objetivos personales persistentes — 12 de noviembre de 2026

Los personajes registrados pueden conservar un `personalGoal` breve que expresa un deseo, problema o motivación. El arranque de la aventura asigna a Elia el propósito de descubrir el origen de la campana y su relación con los mapas. Los NPC nuevos pueden recibir un objetivo inicial opcional al entrar en escena.

El contrato del narrador incorpora `goalUpdates`: hasta dos cambios por respuesta, cada uno con personaje, nuevo objetivo y motivo. El cliente solo actualiza personajes ya registrados, ignora objetivos vacíos o desconocidos, conserva un historial acotado de diez cambios con el número de acción y añade el motivo a la memoria individual (máximo 30 recuerdos). El objetivo actual viaja dentro del contexto compacto porque forma parte de la ficha persistida del personaje; así puede orientar sus diálogos e iniciativas posteriores sin crear misiones obligatorias para el jugador.

La prueba de Chromium simula la evolución del objetivo de Elia, asigna y modifica el de Tomás, verifica el historial y la memoria, y comprueba que un nombre inexistente no crea ni modifica personajes. La prueba valida el procesamiento del cliente con respuestas simuladas; la calidad de la evolución de objetivos en Qwen3.5-4B debe comprobarse en el Samsung.


### Objetivos que influyen en conversaciones e iniciativas — 12 de noviembre de 2026

Se refuerza el uso activo de `personalGoal`: el prompt de la IA local pide que los objetivos orienten iniciativas visibles sin forzar avances ni repetir acciones. El narrador alternativo también incorpora el objetivo de Elia cuando conversa con ella y permite que otros NPCs presentes expresen su motivación al ser preguntados por su nombre. Se añade una regresión automatizada que comprueba que el narrador alternativo menciona el objetivo persistido de Tomás en una conversación dirigida a él. Esta prueba verifica la lógica determinista; la generación contextual del modelo local debe validarse en el dispositivo.


Ajuste de legibilidad — 12 de noviembre de 2026: los diálogos del narrador alternativo presentan el objetivo del NPC como una declaración directa («Mi objetivo ahora es este…»), preservando el texto original del objetivo para que la prueba pueda comprobarlo literalmente. Se renueva la caché de `director.js` para evitar cargar una versión anterior.


Ajuste de selección de diálogo — 12 de noviembre de 2026: el narrador alternativo prioriza la conversación con un NPC presente cuando el jugador lo nombra, sin exigir que la frase coincida con una lista limitada de verbos interrogativos. Así se evita que una formulación libre omita el objetivo personal del personaje. La prueba automatizada cubre la mención directa de Tomás.


### Estados de progreso de objetivos personales — 12 de noviembre de 2026

Los objetivos incorporan `goalStatus` con cuatro estados controlados: `active`, `progress`, `blocked` y `completed`. La IA puede actualizar el estado sin cambiar el objetivo, o modificar ambos cuando la historia lo justifica. Cada transición se guarda en `goalHistory` junto con el motivo y el número de acción; los cambios de estado también quedan en la memoria del personaje. El narrador alternativo adapta la forma de hablar del NPC según el estado, evitando presentar como pendiente un objetivo ya cumplido o ignorar un bloqueo. Las pruebas verifican el progreso de Elia y el bloqueo temporal de Tomás.

### Archivo y renovación de objetivos personales — 12 de noviembre de 2026

Se refuerza el ciclo de vida de las metas para que un NPC no abandone un propósito pendiente por una propuesta arbitraria del modelo. Los objetivos en estado activo, progreso o bloqueo conservan su texto; un bloqueo puede avanzar a progreso, pero no retroceder a activo. Un objetivo completado queda cerrado y no puede reabrirse. Solo después de completarlo se admite una meta distinta en estado activo, con un motivo que explique la conexión narrativa y el nuevo propósito.

Cada personaje mantiene `completedGoals`, un archivo independiente de hasta 20 metas cumplidas con su motivo y número de acción. `goalHistory` conserva las diez transiciones más recientes y `completedGoals` evita que el archivo de metas cerradas dependa de ese historial limitado. Las partidas antiguas se adaptan al vuelo cuando se procesa el siguiente cambio de objetivo, sin exigir migración ni borrar datos.

La regresión automatizada simula tres casos: completar una meta y abrir otra archivando la anterior; rechazar la sustitución de una meta aún en progreso; y evitar que una meta completada vuelva a estado activo. La prueba utiliza respuestas simuladas y no valida por sí sola la calidad narrativa de Qwen3.5-4B en el dispositivo.


### Corrección de regresión del archivo de objetivos — 12 de noviembre de 2026

La primera ejecución de la nueva prueba de ciclo de vida detectó una expectativa desactualizada en la comprobación del contexto compacto: el escenario de prueba crea deliberadamente a Elia con el objetivo breve `Averiguar por qué suenan las campanas.`, mientras que la expectativa se había cambiado al objetivo inicial de la aventura. Se corrigió únicamente esa expectativa para que refleje el dato real del escenario; la prueba de interacción principal sigue verificando por separado que el objetivo de Elia progresa hacia el texto completo definido por la respuesta simulada. No era un fallo del código de objetivos ni de la partida.


### Ajuste del escenario de interacción de objetivos — 12 de noviembre de 2026

La ejecución #96 encontró una segunda inconsistencia en el escenario simulado: el personaje de prueba nacía con el objetivo `Averiguar por qué suenan las campanas.`, pero la respuesta mock intentaba reemplazarlo por el objetivo inicial largo de la aventura mientras solo cambiaba el estado a progreso. La nueva protección impide correctamente sustituir una meta pendiente. Se ajustaron el mock y su aserción para conservar el objetivo breve del escenario y probar únicamente la transición `active` → `progress`. El objetivo largo de la aventura real permanece intacto.

### Corrección de regresión en el objetivo de Tomás — 12 de noviembre de 2026

La ejecución #97 superó la instalación, el arranque y la primera interacción, pero agotó el tiempo de espera tras la segunda acción. El escenario simulado intentaba sustituir el objetivo activo con el que se había creado Tomás por otro distinto y marcarlo como bloqueado. La protección del ciclo de vida rechaza correctamente esa sustitución; por tanto, la prueba no estaba modelando un cambio de estado válido. Se ajustó el objetivo inicial de Tomás en el fixture para que coincida con el que después pasa a estado `blocked`. La regresión sigue comprobando el bloqueo, el historial, las relaciones, los recuerdos y que Tomás no actúe fuera de escena. No se ha relajado la protección del motor.

### Archivo de metas cumplidas en el contexto compacto — 12 de noviembre de 2026

El contexto que recibe la IA incluye ahora las cinco transiciones recientes del historial de objetivos y hasta ocho metas cumplidas por personaje, conservando para cada una su motivo. El prompt indica expresamente que el modelo consulte ese archivo para no proponer de nuevo objetivos ya completados, salvo que un hecho posterior dé una motivación nueva y concreta. La compactación solo afecta a la copia enviada al modelo: el archivo persistido en la partida no se recorta. La regresión automatizada verifica que se envían las ocho entradas más recientes y que las diez originales siguen intactas en el estado de prueba.

### Validación del ciclo de objetivos y del contexto archivado — 12 de noviembre de 2026

La ejecución #98 (`43304268836`) terminó correctamente después de corregir el escenario de Tomás. La ejecución #100 (`43304354041`) validó la nueva prueba de compactación del archivo de metas, y la ejecución #101 (`43304384243`) terminó correctamente sobre el commit final `75eb4b4`. La prueba confirma que las interacciones, guardado y recarga siguen funcionando, que el diseño móvil no desborda el viewport de 390 × 844 y que el contexto de IA recibe ocho metas archivadas sin modificar las diez conservadas en el estado original. Los runs #99 y #100 también finalizaron correctamente. Estas pruebas usan respuestas simuladas; siguen pendientes la validación de inferencia real con Qwen3.5-4B en el Samsung y la revisión visual directa en el navegador del teléfono.


### Límites de conocimiento del personaje — 12 de noviembre de 2026

Se refuerzan las instrucciones de `Narrator.buildMessages()` para impedir que la narración revele información que el personaje todavía no puede conocer. El modelo debe diferenciar percepciones directas, deducciones e hipótesis; no debe presentar como hechos confirmados las sospechas, ni revelar pensamientos privados, identidades ocultas o sucesos fuera de escena sin una fuente narrativa válida. Al examinar objetos o lugares, debe describir primero señales observables y ajustar las conclusiones a las pistas y capacidades disponibles.

Se amplía la regresión de Chromium para comprobar que el prompt contiene estas reglas. La prueba valida que las instrucciones llegan al modelo, no que Qwen3.5-4B las cumpla siempre en una partida real. Se renueva la caché del narrador para que el navegador cargue el prompt actualizado.



### Aceptación de la dirección visual — 12 de noviembre de 2026

El usuario ha revisado las capturas de la aplicación y confirma que, aunque la interfaz no reproduce exactamente la fotografía de referencia, la estética actual le parece suficientemente buena y mucho más trabajada que la versión anterior. Se acepta el pergamino actual como base visual para continuar el desarrollo. No se perseguirá una copia literal a costa de la legibilidad o del uso táctil. Se mantiene la decisión de interfaz exclusivamente textual y sin ilustraciones dentro del juego.



### Corrección de sintaxis en el prompt — 12 de noviembre de 2026

La primera ejecución de Chromium tras añadir los límites de conocimiento detectó que faltaba una coma entre dos instrucciones del array del prompt. Se corrigió el separador y se renovó de nuevo la caché de narrator.js. La ejecución fallida no llegó a completar la interacción, por lo que no se considera validación funcional; se espera una nueva ejecución con el arreglo.


### Iniciativas de NPCs integradas en la escena — 12 de noviembre de 2026

Se ajusta `Narrator.buildMessages()` para que las iniciativas autónomas registradas en `characterActions` formen parte de la propia respuesta narrativa, con transiciones naturales, en lugar de aparecer como una lista o ficha añadida al final. El campo estructurado queda como registro para persistir la acción en la memoria del personaje. Como protección de compatibilidad, el cliente incorpora la acción a la narración solo si el modelo no la ha incluido ya, evitando duplicarla. También se corrige el separador para que cualquier añadido use saltos de línea reales y no la secuencia literal `\\n`. Se renueva la caché y se amplía la prueba de Chromium para comprobar que la iniciativa aparece en la respuesta sin etiqueta mecánica ni escape visible. La validación pendiente corresponde al nuevo run de GitHub Actions; la calidad narrativa del modelo local debe comprobarse además en el Samsung.


Corrección de validación — 12 de noviembre de 2026: la prueba de iniciativa autónoma estaba comprobando la acción de Elia después de una segunda acción del jugador, cuando la interfaz muestra únicamente la narración de esa segunda acción. El comportamiento probado era correcto; el momento de la aserción era incorrecto. Se ha trasladado la comprobación inmediatamente después de la primera acción, que es la que genera la iniciativa, y se mantiene la comprobación de que no aparezca como ficha ni con escapes visibles. Nuevo commit de prueba: `a595a391d346aded934167d937841ebb237f6abf`. Validación pendiente de la nueva ejecución.


## ACTUALIZACIÓN — 15 DE NOVIEMBRE DE 2026 — IDENTIDAD ATHUN Y PLANTILLAS

- Nuevo nombre visible del juego: **Athun: el grimorio oscuro**. Se conservan las rutas del proyecto y las claves internas de guardado para no romper partidas existentes.
- Se incorporan dos fondos maestros independientes: `app/assets/templates/athun-aventura.webp` (plantilla narrativa con áreas vacías para la interfaz de aventura) y `app/assets/templates/athun-papiro-limpio.webp` (papiro vacío para inicio, creación, ficha y paneles).
- El contenido de texto, formularios y controles se mantiene en HTML/CSS, superpuesto al fondo; no se incrusta en las imágenes.
- Se añade el acceso «Pista» a la barra de aventura. Consulta al narrador sin guardar una acción ni aplicar cambios a la partida. Si el narrador IA no está disponible, ofrece una orientación general y no inventa datos de la escena.
- Se guardaron copias previas de `app/js/app.js`, `app/css/style.css`, `index.html` y este documento con el sufijo `.bak-20261115-athun-plantillas`.
- Pendiente de esta integración: incorporar los dos archivos gráficos a `app/assets/templates/`, comprobar su carga en el navegador móvil y ajustar las posiciones si fuera necesario.


## CONTINUIDAD — 15 DE NOVIEMBRE DE 2026: ATHUN

La identidad vigente del proyecto es **Athun: el grimorio oscuro**. El nombre Cosmópolis queda obsoleto como identidad del juego; las referencias históricas y la ruta local antigua se conservan solo por compatibilidad técnica hasta que se migren de forma segura.

### Decisiones visuales y narrativas vigentes
- El prólogo aprobado es el texto proporcionado por el usuario el 15/11/2026; debe conservarse íntegro.
- La plantilla narrativa debe ser la fotografía original del usuario, limpia de texto, usada como fondo de la aventura.
- Debe existir una segunda plantilla de papiro en blanco para inicio, creación de personaje, mapa, opciones y demás pantallas.
- Ambas plantillas deben ser archivos de imagen independientes; textos y controles se superponen como elementos de interfaz.
- La barra de aventura debe incluir el botón **Pista**, que ya aparece implementado en el código consultado. Debe verificarse su funcionamiento real.

### Estado remoto comprobado
- Repositorio privado: https://github.com/crowley80/Cosmopolis, rama main.
- `index.html` ya muestra el título «Athun: el grimorio oscuro».
- `app/js/app.js` contenía dos identificadores JavaScript inválidos por incluir espacios y dos puntos. El 15/11/2026 se guardó una copia en `app/js/app.js.bak-20261115-reparacion-identificador` y se corrigieron ambas referencias para usar el identificador `Athun`. El cambio está en GitHub; aún requiere comprobación de sintaxis y prueba en Chrome.
- La hoja `app/css/style.css` todavía construye el fondo con gradientes y SVG incrustados; no está usando la fotografía original como imagen de fondo.
- No se ha localizado en el repositorio ningún archivo llamado `athun-plantilla-pergamino.webp` ni `athun-plantilla-pergamino-respaldo.webp`. Las rutas mencionadas anteriormente no deben darse por existentes: nunca se verificó su creación ni su incorporación al repositorio.
- La fotografía original que el usuario quiere conservar no está disponible en los archivos consultados en esta sesión. No generar una sustitución ni inventar una plantilla. Para completar la integración hace falta recuperar esa imagen original desde el adjunto/conversación donde se proporcionó o pedir que se vuelva a adjuntar si no puede recuperarse.

### Próximos pasos obligatorios
1. Recuperar la fotografía original aportada por el usuario y preparar, a partir de ella, la versión narrativa limpia y la plantilla de papiro en blanco, sin alterar la composición aprobada.
2. Guardar ambas imágenes maestras y sus copias de seguridad dentro de `app/assets/` y verificar que el servidor las entrega.
3. Integrar las dos imágenes en CSS según el tipo de pantalla, manteniendo textos y controles como capas independientes.
4. Revisar y probar el botón Pista con el estado narrativo actual, sin modificar la partida.
5. Ejecutar comprobación de sintaxis JavaScript y abrir la versión real en Chrome desde Termux.
6. Actualizar esta sección con resultados verificables. No afirmar que está integrado o probado antes de hacerlo.


### Flujo de inicio y prólogo — decisión aprobada el 15/11/2026
- El prólogo completo de Athun se presenta **una sola vez**, en el primer arranque de una instalación/partida nueva, como presentación inicial del juego.
- Al terminar esa presentación, el jugador pasa a la creación de personaje y después al inicio de la historia.
- En los arranques posteriores, si existe una partida guardada con personaje y aventura, se entra directamente en la historia: no se vuelve a mostrar el prólogo ni la creación del personaje.
- No es necesario repetir pantallas introductorias en cada arranque. Como máximo, se permite una pantalla de espera breve con el logotipo o una presentación visual de Athun mientras se inicializa el juego; es opcional y no debe bloquear ni retrasar innecesariamente la carga.
- El prólogo no debe confundirse con la narración recurrente de la aventura ni aparecer como escena inicial cada vez que se carga una partida.
- La implementación debe guardar de forma persistente que la presentación inicial ya se mostró y manejar con cuidado instalaciones antiguas/partidas existentes: nunca reiniciar ni sobrescribir una partida guardada para mostrar el prólogo.

### Estado de implementación de este flujo — verificado el 16/11/2026
- `Athun.showPrologue()` presenta el texto aprobado íntegramente, dividido en dos párrafos, y ofrece el botón «Continuar».
- Al continuar, registra `athun_intro_seen_v1=1` en el almacenamiento local y pasa a la creación del personaje.
- `Athun.init()` comprueba primero las partidas existentes: si hay alguna, abre el selector de partidas y omite el prólogo, incluso en instalaciones antiguas que todavía no tengan la marca de presentación. Así se evita reiniciar o sobrescribir partidas previas.
- En una instalación sin partidas, muestra el prólogo solo cuando la marca aún no existe; en siguientes arranques abre directamente la creación del personaje.
- `tests/prologue.test.js` comprueba el texto aprobado, el registro al continuar, la presentación en una instalación nueva y la omisión para instalaciones con marca o con partidas existentes.
- GitHub Actions, ejecución 447 (`43941850589`): suite completa `node --test tests/*.test.js` y comprobación de sintaxis JavaScript, correctas sobre el commit `82a3c38`.
- Playwright, ejecución 233 (`43941850563`): validación visual móvil simulada y escritorio, correcta sobre el mismo commit.
- La prueba en un Chrome de Android físico sigue pendiente; las pruebas automatizadas no la sustituyen.
## DECISIONES NARRATIVAS Y DE ARQUITECTURA — 15 DE NOVIEMBRE DE 2026

### Athun, el grimorio consciente
- Athun contiene toda la magia existente y todo el conocimiento, conocido y desconocido.
- Tiene conciencia, voluntad y personalidad propias.
- Se reescribe a sí mismo; su contenido y lo que revela no son estáticos.
- Es conocido por su fama en el mundo, pero el protagonista conoce poco de su historia. El jugador descubre sus orígenes, secretos, capacidades y pasado progresivamente durante la aventura.
- Athun se entrega al protagonista al principio de la historia para ayudarle.
- Athun es un elemento permanente y protegido del inventario: nunca puede ser robado, vendido, destruido, perdido ni separado del jugador por ninguna circunstancia narrativa o mecánica.
- Que contenga todo el conocimiento no significa que revele siempre sus respuestas: puede guardar silencio, ocultar información, negarse a responder o descubrir recuerdos que tenía olvidados.

### Historias diferentes según el protagonista
- Cada personaje jugable tiene su propia partida, decisiones, relaciones, misiones, descubrimientos y evolución.
- La historia de Athun y la relación entre el grimorio y el protagonista varían según el personaje y los acontecimientos de esa partida.
- Las diferencias deben afectar a acontecimientos, revelaciones, diálogos y evolución de la relación, no limitarse a cambiar unas pocas frases.
- El mismo Athun puede mostrar facetas distintas de su conciencia a protagonistas diferentes.

### Inicio y selección de partidas
- Al arrancar, el jugador debe poder elegir entre iniciar una partida nueva o continuar una partida existente.
- Nueva partida: elegir con qué personaje jugar y comenzar la historia particular de ese protagonista.
- Continuar partida: mostrar las partidas/personajes disponibles y permitir reanudar la elegida.
- Debe ser posible mantener varias partidas y probar protagonistas e historias diferentes sin sobrescribir accidentalmente las demás.
- La selección/gestión de personajes puede permitir consultar los protagonistas y sus progresos.
- La interfaz inicial debe integrarse con la identidad visual aprobada de Athun y seguir siendo cómoda en móvil.

### Mundo y localizaciones compartidos
- El mundo es una única entidad persistente y compartida entre todos los protagonistas.
- Las localizaciones y elementos del mundo se crean o amplían conforme se desarrolla la historia; no es necesario generar todo el mundo por adelantado.
- Una localización descubierta o creada por un protagonista permanece disponible para los demás.
- Los cambios persistentes del mundo y las consecuencias globales de los acontecimientos se comparten entre partidas.
- Cambiar de protagonista o iniciar una partida nueva no reinicia ni borra el mundo compartido.
- Cada protagonista conserva, por separado, su posición, inventario, relaciones, misiones, decisiones y progreso individual.

### Separación técnica obligatoria
La arquitectura deberá separar claramente:
1. **Estado global del mundo:** localizaciones, entidades compartidas, hechos y cambios persistentes.
2. **Estado de cada partida/personaje:** ficha, inventario, posición, misiones, decisiones, relaciones y progreso.
3. **Estado narrativo de Athun por partida:** recuerdos, revelaciones, relación y facetas descubiertas con ese protagonista.

Cada partida debe recibir a Athun desde su creación y el inventario debe protegerlo mediante una regla estructural, no solo mediante instrucciones al narrador. La persistencia compartida del mundo debe evitar que guardar o cargar una partida sobrescriba los datos de otros protagonistas.

### Estado de implementación
Estas decisiones quedan aprobadas como requisitos de diseño y arquitectura, pero **todavía no se han implementado ni probado en el juego**. Antes de modificar código, revisar el sistema actual de guardado (app/js/core/save.js), la inicialización/navegación (app/js/app.js), la creación de personajes y el estado de sesión. Diseñar una migración compatible con partidas existentes y hacer copias de seguridad antes de cualquier cambio. No borrar ni reiniciar datos existentes.

## PANTALLA DE BIENVENIDA Y CARGA — DECISIÓN APROBADA EL 15/11/2026

- La ilustración compartida en la conversación (grimorio antiguo flotando sobre un pedestal, energía mágica turquesa y figuras encapuchadas) queda aprobada como referencia artística principal de la entrada de Athun.
- Se quiere una pantalla inicial vertical para móvil, en proporción aproximada 9:16, que aparezca al arrancar mientras se prepara el juego y antes de llegar a la selección de personaje/partidas.
- La composición debe conservar el grimorio como foco central y su atmósfera de fantasía oscura. El título exacto «Athun: el grimorio oscuro» irá en la zona superior, con tipografía fantástica elegante y legible.
- En la zona inferior se mostrará «Cargando…» y una barra de progreso discreta en tonos turquesa.
- Esta pantalla no tendrá botones, menús ni controles de selección: es únicamente una presentación/carga previa a la pantalla de inicio y selección.
- La pantalla debe ser breve y no retrasar innecesariamente la carga. No debe volver a mostrar el prólogo en cada arranque ni sustituir el flujo de nueva partida/continuar partida ya aprobado.
- Esta nueva portada es una excepción visual concreta a la interfaz de juego predominantemente textual; no modifica por sí sola las decisiones sobre la narración y las pantallas interiores.
- Estado: diseño aprobado, pero la imagen final vertical y su integración en el juego todavía no están generadas, guardadas ni implementadas. La generación de la imagen no pudo ejecutarse en esta sesión por el límite temporal del plan Free. No afirmar que existe un archivo final.
- Próximo paso: cuando vuelva a estar disponible la generación, crear la composición vertical usando la ilustración compartida como referencia; después guardar el recurso en `app/assets/`, integrarlo como pantalla inicial y probarlo en el móvil.



## AUDITORÍA DEL GUARDADO Y PLAN DE MIGRACIÓN — 16 DE NOVIEMBRE DE 2026

Se ha revisado en GitHub el guardado, la sesión, la creación de personajes, el inicio de aventura y el mapa. Se confirma que el sistema actual utiliza una sola clave `cosmopolis_save`; `Session.startNewAdventure()` archiva el registro anterior y reinicia los datos del mundo; `Character.create()` guarda dentro de ese único registro; y `Athun.init()` recupera automáticamente una sola partida. El mundo y las localizaciones no están separados de la partida individual. El inventario tampoco protege estructuralmente a Athun.

Estos límites contradicen los requisitos aprobados el 15/11/2026 de múltiples partidas independientes, mundo compartido persistente y Athun inseparable del protagonista. Antes de tocar código se ha creado el respaldo `docs/MAESTRO_COSMOPOLIS.md.bak-20261116-guardado` y el plan detallado `docs/PLAN_MIGRACION_GUARDADO_ATHUN.md`.

**Estado:** auditoría estática completada y plan de migración documentado. No se ha modificado código ejecutable ni se ha probado el juego en Android. La implementación queda dividida en migración compatible de partidas, separación del mundo global, protección de Athun y, finalmente, selector de partidas. No se debe reiniciar, sobrescribir ni eliminar el guardado heredado. Cada fase deberá contar con pruebas de recuperación, aislamiento entre protagonistas e idempotencia antes de continuar.


## REVISIÓN AUTÓNOMA — 16 DE NOVIEMBRE DE 2026 — CONTINUIDAD DEL PRÓLOGO

Se ha vuelto a inspeccionar el código remoto de `app/js/game/adventure.js`, `director.js`, `narrator.js`, `session.js`, `save.js` y `app.js`. Esta revisión confirma que la corrección narrativa aprobada el 15/11 aún no está reflejada de forma coherente en la versión ejecutable:

- `Adventure.createOpening()` sigue comenzando directamente en la Plaza del pozo, presenta a Elia y revela la campana y el pozo antes de que el protagonista pueda descubrirlos.
- El estado inicial registra `eliaMet: true`, añade a Elia al conjunto de personajes y guarda como hechos conocidos detalles que el prólogo aprobado reserva para el descubrimiento gradual.
- `Director.respond()` crea a Elia automáticamente aunque no exista en el estado, y varias respuestas genéricas presuponen que está presente o que el protagonista conoce el pozo y la campana.
- `Narrator.buildMessages()` todavía describe el juego como «Cosmópolis» y necesita reforzar el límite de conocimiento inicial, además de la identidad vigente de Athun.
- La documentación de continuidad y los respaldos históricos confirman que este trabajo debe conservar los cambios previos de director/narrador; no se debe sustituirlos por una versión simplificada.

**Prioridad de ejecución:** recuperar el texto íntegro del prólogo aprobado y reconciliarlo con el estado inicial de aventura; después adaptar el director para que solo incluya personajes y hechos ya descubiertos, y ajustar el contexto/instrucciones del narrador. Añadir pruebas automatizadas de acciones iniciales, preguntas neutrales, exploración del camino y primer encuentro con Elia. Mantener pendiente la validación final en Chrome/Android.

**Estado de esta revisión:** solo lectura y diagnóstico. No se ha modificado código ejecutable ni se ha alterado ninguna partida. Se ha creado el respaldo previo `docs/MAESTRO_COSMOPOLIS.md.bak-20261116-revision-inicial` antes de actualizar esta documentación. No se ha recuperado aún el texto íntegro del prólogo, por lo que no se debe reconstruir de memoria ni reemplazarlo por una paráfrasis.


## CORRECCIÓN DE APERTURA Y PRESENCIA PERMANENTE DE ATHUN — 16 DE NOVIEMBRE DE 2026

Se recuperó el texto íntegro aprobado para el comienzo de Valdebruma y se aplicó a `app/js/game/adventure.js`. La apertura queda así:

- Ubicación inicial: `Camino de entrada a Valdebruma`.
- Fase inicial: `arrival`.
- El protagonista llega durante una mañana tranquila, sin urgencia ni nadie esperándolo.
- Puede observar el valle, entrar en el pueblo, buscar alojamiento o acercarse a sus habitantes.
- El texto aprobado comienza «El camino lleva un buen rato descendiendo entre las montañas...» y termina «La mañana sigue su curso. Tu historia en Valdebruma comienza aquí.»
- El estado inicial solo registra que el protagonista ha llegado a Valdebruma y que el pueblo está en un valle entre montañas. Elia, el pozo y la campana no se conocen ni se han descubierto.

### Athun desde el inicio
- El inventario inicial contiene `Athun`.
- El estado narrativo de Athun se registra por partida, con vínculo, recuerdos y revelaciones.
- Se marca como pertenencia permanente.
- El narrador recibe instrucciones explícitas para no confundir el conocimiento de Athun con el del protagonista ni revelar de golpe su historia.
- La aplicación de respuestas de IA impide retirar Athun del inventario y lo repone si una respuesta del modelo lo omite.

### Descubrimiento gradual
- `app/js/game/director.js` deja de crear a Elia automáticamente.
- La entrada inicial se resuelve sin introducir a Elia, la campana ni el pozo.
- Entrar en el pueblo cambia la fase a exploración.
- Preguntar a los habitantes antes de descubrir el misterio produce respuestas cotidianas, no rumores sobre la campana.
- La plaza permite descubrir el pozo; examinarlo no revela automáticamente a Elia ni la campana.
- Una manifestación mágica dirigida al pozo puede provocar y registrar el descubrimiento de la campana.
- Se han neutralizado varias respuestas de respaldo que presuponían que Elia o el misterio ya estaban presentes.

### Pruebas y caché
- Se añadieron pruebas de regresión al workflow `.github/workflows/visual-preview.yml` para comprobar la apertura, la entrada al pueblo, las preguntas iniciales, el descubrimiento del pozo, la investigación y la revelación mágica.
- Se renovaron las versiones de consulta de `adventure.js`, `director.js` y `narrator.js` en `index.html`.
- Se crearon respaldos de los tres scripts, del workflow y de `index.html` antes de sus cambios.

**Commits de implementación:** aventura `7077bc7`; director `ba34e20` y `39c7942`; narrador `a421511`; pruebas `d0206a0`; renovación de caché `4c91999`.

**Estado de validación:** las pruebas de regresión quedaron incorporadas al workflow de GitHub Actions, que se activa al actualizar `index.html`. No se declara todavía una validación visual en Chrome/Android ni un resultado verde del workflow hasta consultar su ejecución. Las partidas guardadas existentes no se han modificado ni migrado.


### Ajuste adicional de la primera interacción — 16 de noviembre de 2026

La apertura permite ahora conversar desde el propio camino con la persona que recoge leña junto a una casa. El director registra a ese habitante solo cuando el protagonista intenta hablar con alguien; no lo introduce como personaje conocido antes de tiempo. La pregunta inicial ya no se confunde con una orden de entrar en el pueblo. Tras esa primera conversación comienza la fase de exploración, y el habitante puede conservar su ubicación y recuerdos.

Se amplió el workflow de regresión para comprobar también esa conversación y la sincronización de descubrimientos que realiza el narrador: al registrar hechos nuevos sobre el pozo o la campana, se activan las marcas correspondientes; cuando el narrador incorpora a Elia como personaje, queda registrado que el protagonista la ha conocido. Al cambiar de ubicación desde el camino inicial, la fase pasa a exploración.

**Pruebas ejecutadas en esta sesión:** se analizaron sintácticamente los tres scripts actualizados y se ejecutaron pruebas directas de apertura, conversación con el primer habitante, entrada al pueblo, preguntas sin revelaciones, descubrimiento del pozo, inspección sin revelar la campana y descubrimiento mediante magia. Todas pasaron. También se simuló una respuesta de IA que intentaba retirar Athun y se comprobó que el inventario lo conserva y mantiene su marca permanente. Se simuló además la incorporación de hechos y de Elia y se comprobó que se sincronizan sus indicadores de descubrimiento.

**Pendiente de verificación externa:** el workflow de Chrome/Playwright contiene ahora estas pruebas ampliadas y se activa con los cambios de `index.html` y del propio workflow. No se ha podido consultar desde esta sesión el resultado final de GitHub Actions ni realizar una prueba física en Chrome de Android; no se afirma que esa validación visual esté completada.

**Últimos commits:** director `0a41be7`; pruebas `c5bb316`; caché `43fb158`. El documento maestro mantiene la arquitectura de múltiples partidas y mundo compartido como siguiente línea técnica, sin modificar todavía los guardados existentes.


### Compatibilidad de partidas existentes: Athun permanente — 16 de noviembre de 2026

Se ha actualizado `app/js/core/save.js` para que cualquier partida guardada que ya tenga una aventura incorpore a Athun al inventario si faltaba y complete su estado narrativo como grimorio consciente permanente. La migración conserva los demás datos de la partida, se escribe solo cuando detecta cambios y es idempotente: cargar otra vez una partida ya migrada no vuelve a escribirla. Si el navegador no permite persistir la migración, el objeto queda al menos presente en la sesión actual y se registra una advertencia.

Se añadió una prueba al workflow para migrar una partida heredada sin Athun, comprobar que la protección queda persistida y volver a cargarla. La caché de `save.js` se ha renovado en `index.html`.

**Prueba directa ejecutada:** migración de partida heredada, permanencia de Athun y carga idempotente (una sola escritura); también se volvieron a probar la sintaxis de los scripts y el diálogo inicial con un habitante. Todo pasó en el entorno de pruebas de esta sesión. Sigue pendiente el resultado del workflow remoto y la prueba visual en Android.

**Límite del avance:** esto protege Athun en partidas existentes, pero no implementa todavía el índice de múltiples partidas ni la separación del mundo global. Esas fases continúan pendientes y no se ha reiniciado ni eliminado ningún guardado.


### Cierre de la tanda autónoma — 16 de noviembre de 2026

Se completó además el ajuste de la primera conversación: preguntar desde el camino ya no se interpreta erróneamente como entrar en el pueblo. El protagonista puede hablar con la persona que recoge leña; el habitante se registra solo cuando se produce esa interacción y conserva ubicación y recuerdos. La fase pasa entonces a exploración.

Se implementó también una migración idempotente en `Save.load()` para partidas existentes: si ya hay una aventura, se incorpora Athun al inventario y se crea/normaliza su estado permanente sin reiniciar la partida. La migración solo escribe si detecta cambios. La versión de caché de `save.js` se actualizó en `index.html`.

**Validación directa completada:** sintaxis de los scripts; apertura aprobada; conversación con el primer habitante; entrada al pueblo; preguntas sin revelaciones prematuras; descubrimiento del pozo; inspección sin revelar la campana; revelación mediante magia; protección de Athun frente a una respuesta de IA que intentaba retirarlo; sincronización de hechos descubiertos y encuentro con Elia; migración de una partida antigua y segunda carga sin escritura redundante. Todas estas pruebas directas pasaron.

**Pruebas automatizadas añadidas al workflow:** la misma batería narrativa, protección de Athun frente a la IA y migración de una partida antigua. El workflow se activa con los cambios de `index.html` y del propio archivo de workflow. No se ha podido consultar su resultado remoto en esta sesión y no se afirma que la prueba visual en Android esté completada.

**Commits recientes:** guardado `99d7a19` y `db7d4a3`; prueba de migración `7eb287f`; caché `b9c37b1`; documentación `3a28313` y `3f2d582`. Se conservaron respaldos antes de las modificaciones. No se ha eliminado ni sobrescrito deliberadamente ninguna partida guardada.


## IMPLEMENTACIÓN INICIAL DE PARTIDAS MÚLTIPLES — 16 DE NOVIEMBRE DE 2026

Se ha iniciado la implementación en la rama independiente `feat/athun-multisave-world`, sin modificar `main`.

- Se creó un índice de partidas, un identificador de partida activa y un registro independiente por protagonista.
- La partida antigua `cosmopolis_save` se migra como partida heredada y su clave original se conserva intacta.
- Se incorporaron creación, listado y activación de partidas; la ficha puede editarse sin crear otra partida.
- Una aventura nueva crea un registro independiente cuando ya existe una aventura, evitando archivar y reemplazar la anterior.
- Se separó el almacenamiento del mundo compartido. Las localizaciones descubiertas se registran globalmente y aparecen en el mapa de los protagonistas.
- Se añadió el selector inicial de partidas y accesos para cambiar de historia o crear otro protagonista.
- Athun se repone en la normalización del inventario y el narrador no puede retirarlo mediante `itemsToRemove`.
- Se añadieron pruebas automatizadas y un flujo de GitHub Actions para comprobar sintaxis y almacenamiento.
- Se guardaron copias de seguridad de los archivos de ejecución modificados y de este documento.

**Estado de validación:** implementación en rama de trabajo; GitHub Actions ha superado la comprobación de sintaxis y las 6 pruebas automatizadas de almacenamiento (ejecución 48, 16/11/2026); todavía no probada en Chrome/Android. No se incorpora a `main` hasta completar la revisión funcional en móvil. El mundo global comparte localizaciones en esta fase. No se migran automáticamente hechos, relaciones ni acontecimientos personales al mundo global. La incorporación a `main` queda supeditada a las pruebas y revisión del pull request.

Plan técnico y alcance pendiente: `docs/PLAN_MIGRACION_GUARDADO_ATHUN.md`.


### Ampliación del mundo compartido — 16/11/2026
Además de las localizaciones, el mundo global conserva la identidad básica de los NPC descubiertos (nombre, función y primera localización conocida). La confianza, los recuerdos, los objetivos y las relaciones continúan aislados en la partida de cada protagonista. La migración antigua importa lugares visitados y NPC conocidos sin convertir memorias personales en información global. El narrador recibe el contexto global con instrucciones explícitas de respetar esa separación.


### Recuperación del índice de partidas — 16/11/2026
Si el índice de partidas se elimina o queda ilegible, el almacenamiento reconstruye su listado a partir de las claves de las partidas individuales. Esta recuperación evita que una incidencia del índice haga invisibles registros que siguen almacenados. Se añadieron pruebas para este caso.


### Continuidad narrativa por protagonista — 16/11/2026
El contexto del narrador mantiene separados el mundo global y el mundo personal de la partida activa. Los hechos, eventos y relaciones históricos de la partida heredada siguen disponibles para su protagonista; no se convierten en verdades universales. El selector también muestra el título de cada aventura para distinguir varias historias del mismo personaje.


## PRESENTACIÓN ÚNICA DEL PRÓLOGO — 16/11/2026

Se incorpora el prólogo literal aprobado por el usuario el 15/11/2026. En una instalación nueva se muestra antes de la creación del personaje; al pulsar «Continuar» se registra `athun_intro_seen_v1` y se abre el formulario de creación. En arranques posteriores, si ya existe una partida, se muestra directamente el selector de partidas y no se repite el prólogo. Si la migración del guardado heredado falla, la aplicación muestra un aviso y no inicia una ficha nueva que pueda confundir al jugador o poner en riesgo la recuperación.

Se guardaron copias previas de `app/js/app.js`, `index.html` y este documento con el sufijo `.bak-20261116-prologo-unico`. La caché del script principal se renovó. Se añadieron pruebas automatizadas para comprobar el texto, el registro de primera presentación y la omisión del prólogo cuando ya existen partidas. Pendiente confirmar la ejecución de CI de esta nueva tanda y probar el flujo en Chrome/Android.


### Validación posterior del prólogo y del guardado — 16/11/2026
GitHub Actions, ejecución 76: comprobación de sintaxis JavaScript correcta y 10/10 pruebas aprobadas. Se incluyen dos pruebas nuevas del prólogo de primera ejecución y ocho pruebas de almacenamiento, migración, aislamiento, recuperación, permanencia de Athun e integridad ante fallos de escritura. La prueba visual y funcional en Chrome/Android continúa pendiente; la rama no se fusiona hasta completarla.


## PRIMERA FASE DEL ATLAS DE EXPLORACIÓN — 16/11/2026

Se incorpora el módulo de cartografía `app/js/game/map.js` y se renueva el panel de mapa:
- Distingue la zona actual y otras zonas explícitamente visibles, lugares visitados por el protagonista y lugares conocidos por descubrimientos compartidos.
- El conocimiento geográfico se comparte entre protagonistas; la lista de visitas y la visibilidad actual permanecen ligadas a cada aventura.
- La sesión registra la ubicación actual y las zonas que el estado declare visibles.
- El terreno nunca descubierto no se enumera ni revela nombres.

**Límite deliberado:** todavía no se representa una cuadrícula geográfica ni se inventan rutas, coordenadas o distancias. La aventura inicial no contiene datos espaciales suficientes para dibujar un mapa fiable. Esta fase implementa la clasificación y la niebla de información; la cartografía espacial real queda pendiente de datos explícitos de posición/conexión y de su integración narrativa.

Se añadieron pruebas unitarias del atlas y una prueba de integración para comprobar que una ubicación visible se comparte como conocimiento, pero no como visita personal de otro protagonista. Pendiente: CI de esta tanda y prueba visual/táctil en Chrome para Android.


### Control de niebla durante desplazamientos — 16/11/2026
Al cambiar de ubicación, la sesión evita arrastrar la visibilidad de la zona anterior: si `visibleLocations` no cambia explícitamente en el nuevo estado, se limpia. Los lugares descubiertos permanecen como conocimiento compartido, pero dejan de figurar como entorno visible. Se añade una prueba de regresión para este comportamiento.


### Visibilidad cercana calculada por el narrador — 16/11/2026
El formato estructurado del narrador incluye `visibleLocations`, recalculado en cada respuesta. Solo debe contener lugares próximos que estén identificados explícitamente; no puede inventar rutas, coordenadas ni destinos. La sesión comparte esos descubrimientos con el mundo, mientras las visitas siguen siendo personales. Si se cambia de zona y el narrador arrastra la lista anterior sin cambios, la sesión la limpia para evitar que la zona previa siga apareciendo como visible. La CI 118 aprobó 16/16 pruebas antes de esta ampliación del esquema; falta confirmar la nueva ejecución.


### Validación de la integración narrativa del atlas — 16/11/2026
GitHub Actions, ejecución **125**: sintaxis JavaScript correcta y **16/16 pruebas aprobadas** tras incorporar `visibleLocations` al esquema del narrador. La niebla del atlas y su sincronización con el mundo compartido quedan cubiertas por pruebas automatizadas; la validación visual y táctil en Chrome/Android continúa pendiente.


### Refinamiento de visibilidad y estados del atlas — 16/11/2026
El narrador entrega `visibleLocations` explícitamente a la sesión. Al desplazarse, esa lista sustituye la visión anterior; si el narrador no declara una nueva, la visión antigua se limpia. Las ubicaciones visitadas que vuelven a estar a la vista se clasifican como visibles mientras permanezcan en el campo de visión. Se añadió cobertura automatizada para ambos casos. La tanda actual contiene 18 pruebas; falta confirmar CI tras estos últimos ajustes.


### CI 142 — atlas y visibilidad — 16/11/2026
Comprobación de sintaxis JavaScript correcta y **18/18 pruebas aprobadas**. Quedan cubiertas la niebla, la clasificación actual/visible/visitado/conocido, el descubrimiento compartido, la limpieza de visión al desplazarse y la conservación de una nueva visibilidad explícita del narrador.


### Primera red de caminos descubiertos — 16/11/2026
Se añade al mundo compartido un registro de conexiones direccionales únicamente cuando una partida confirma un desplazamiento entre dos localizaciones distintas. El atlas puede mostrar esos tramos como caminos recorridos. No se deduce el trayecto inverso, la distancia, la orientación ni la posición geográfica; tampoco se enlazan lugares solo porque aparezcan juntos en una narración. Las conexiones se conservan al cambiar de protagonista y se filtran para no mostrar extremos que no estén registrados como lugares conocidos. Se crean copias previas de los archivos modificados con el sufijo `.bak-20261116-rutas`. GitHub Actions, ejecución **169**, completó la comprobación de sintaxis y **20/20 pruebas aprobadas**; incluye el registro de tramos y la protección frente a conexiones inversas inventadas.


### Validación de caminos compartidos entre protagonistas — 16/11/2026
GitHub Actions, ejecución **174** (`43832755166`): sintaxis JavaScript correcta y **21/21 pruebas aprobadas**. La nueva prueba confirma que una ruta descubierta por un protagonista aparece en el atlas de otro, pero no convierte el destino en una visita personal de ese segundo protagonista.


### Auditoría de rutas y coherencia de identidad — 16/11/2026
La revisión de la rama detectó que el sistema registraba una conexión compartida ante cualquier cambio de ubicación, aunque la respuesta narrativa no estuviera clasificada como desplazamiento. Se ha limitado el registro de caminos a respuestas con categoría `movement`; los cambios de ubicación por otras causas siguen actualizando la posición y la visita personal, pero no fabrican un tramo transitable. También se ha actualizado la identidad del prompt del narrador al nombre vigente «Athun: el grimorio oscuro». Se añade una prueba de regresión para el caso no-movimiento. La validación automatizada de estos cambios queda pendiente de la ejecución CI posterior al commit.


### CI 195 — rutas confirmadas y coherencia de Athun — 16/11/2026
GitHub Actions, ejecución **195** (`43836494217`): comprobación de sintaxis JavaScript correcta y **22/22 pruebas aprobadas**. Incluye la regresión que impide crear conexiones del atlas cuando cambia la ubicación por una acción que no está clasificada como desplazamiento. También se valida la actualización del prompt del narrador y el resto de pruebas de guardado, prólogo, atlas y mundo compartido.


### Protección de Athun como instancia única — 16/11/2026

Durante una revisión adicional se detectó un caso límite: aunque el narrador no podía retirar Athun, podía proponer añadir una segunda entrada con un nombre distinto (por ejemplo, «Athun duplicado»). La normalización del guardado ahora elimina todas las entradas que contengan el identificador Athun y conserva una única pertenencia canónica: «Athun — grimorio consciente». El procesador narrativo también rechaza explícitamente cualquier alta de inventario que contenga Athun.

Se añadieron respaldos previos de app/js/core/save.js, app/js/game/narrator.js, tests/storage.test.js, index.html y este documento maestro. Se incorporó una prueba de regresión para asegurar que las variantes duplicadas se normalizan a una sola instancia y se actualizó la versión de caché de save.js.

**Estado de validación:** cambios guardados en la rama feat/athun-multisave-world. GitHub Actions, ejecución 210, terminó correctamente: sintaxis JavaScript correcta y 23/23 pruebas aprobadas, incluida la nueva prueba de unicidad de Athun. La validación en Chrome/Android continúa pendiente; no se ha fusionado el pull request.


### Eliminación transaccional de partidas — 16/11/2026

La revisión del ciclo de borrado encontró un riesgo de pérdida parcial: el índice se actualizaba y el archivo de partida se eliminaba antes de confirmar el cambio de selección activa. Si fallaba esa última escritura, el método devolvía error aunque la partida ya hubiera desaparecido. Se ha endurecido `Save.deleteSlot()` para conservar los valores previos del índice, registro y partida activa, y restaurarlos ante cualquier fallo durante la operación. La última partida continúa protegida contra eliminación.

Se añadieron respaldos previos de `app/js/core/save.js`, `tests/storage.test.js`, este documento y el plan de migración. Se incorporó una prueba que simula el fallo al cambiar la partida activa, comprueba la restauración íntegra y después verifica que el borrado normal funciona. GitHub Actions, ejecución 232, terminó correctamente: sintaxis JavaScript válida y 25/25 pruebas aprobadas. Incluye fallos simulados de eliminación y restauración de la partida activa, borrado correcto, migración del vínculo/recuerdos de Athun y las pruebas previas de partidas múltiples, mundo compartido y atlas. La validación visual en Chrome/Android sigue pendiente.


La migración de cada partida también conserva el vínculo, los recuerdos y las revelaciones de Athun y fuerza su identidad canónica y `permanent: true`. Se amplió la prueba de partida heredada para comprobarlo. Validación CI: ejecución 232, 25/25 pruebas aprobadas.


### Aislamiento del vínculo personal de Athun — 16/11/2026

Se amplía la cobertura de partidas múltiples para verificar que el vínculo, los recuerdos y las revelaciones de Athun pertenecen a cada protagonista y no se mezclan al alternar entre partidas. La prueba modifica el vínculo y añade un recuerdo en una partida, cambia a otra y vuelve a la primera para comprobar que ambos estados se mantienen aislados y persistentes. También se cubre que la última partida no pueda eliminarse y que Athun siga presente en ella.

Se crearon respaldos previos de `tests/storage.test.js` y este documento maestro con el sufijo `.bak-20261116-athun-state-isolation`. GitHub Actions, ejecución 317 (`43907207244`): sintaxis JavaScript correcta y 27/27 pruebas aprobadas, incluidas las dos nuevas pruebas de aislamiento del vínculo de Athun y protección de la última partida. No se ha realizado todavía validación manual en Android.


### Integración selectiva sobre main — 16/11/2026

Se prepara una rama de integración basada en el main vigente para evitar revertir las correcciones narrativas incorporadas después del punto común de las ramas. Se trasladan las partidas múltiples, el mundo persistente compartido, el atlas, el selector y las pruebas; se conservan las correcciones actuales de apertura de Valdebruma, descubrimiento gradual, estado de Elia y protección permanente de Athun. La normalización de la nueva capa de guardado sustituye la migración simple de una sola clave por una migración compatible a un registro individual, sin modificar la clave heredada original.

La integración es selectiva y todavía no está validada. Las pruebas automatizadas y la comparación funcional con main deben completarse antes de proponer la fusión. No se ha ejecutado en Chrome/Android.


### Corrección de prueba de aislamiento — 16/11/2026

La primera ejecución CI de la rama de integración ejecutó 27 pruebas: 26 aprobadas y una fallida. El fallo estaba en la prueba añadida de aislamiento del vínculo de Athun: modificaba un objeto devuelto por una carga independiente y luego guardaba otra copia recién cargada. Se corrige el test para modificar y guardar la misma copia de la partida. No se ha cambiado la lógica de producción por este fallo de prueba. Se guardaron respaldos previos de los dos archivos. CI debe repetirse para validar la corrección.


### Validación de navegador en integración — 16/11/2026

La ejecución 173 de GitHub Actions (`43909804808`) completó correctamente el flujo Playwright en Chromium. Se validó el selector de partidas tras la migración y tras recargar, la apertura aprobada de Valdebruma, los límites de descubrimiento gradual, la permanencia de Athun, el inventario, atlas/mapa, historial, paneles, acciones narrativas, guardado y recuperación tras recarga. El informe del flujo confirma `INTERACTION_TESTS_OK` y `NARRATIVE REGRESSION: ... OK`.

La vista móvil simulada de 390 × 844 px no presenta desbordamiento horizontal: documento 390 × 844 px; narración, panel de escritura y barra inferior quedan dentro de sus límites y en el orden correcto. La vista de escritorio de 1024 × 900 px también pasó sin desbordamiento ni errores JavaScript. La ejecución 348 de la suite de almacenamiento, en el mismo commit, aprobó 27/27 pruebas (0 fallos).

Se observaron solicitudes de recursos con respuesta HTTP 404 en la consola del navegador; no produjeron errores JavaScript ni impidieron las pruebas funcionales o de disposición. Conviene identificar y corregir esos recursos en una limpieza posterior. Esta prueba usa Chromium emulado y no sustituye la validación táctil en un dispositivo Android físico.


### Selector visual y alternancia entre protagonistas — 16/11/2026

La ejecución 180 de Playwright (`43910478567`) también pasó la prueba de interfaz con dos partidas reales de prueba: crea a Darian además de Ariadna, verifica que el selector muestra ambas, abre Ariadna, cambia desde Opciones a Darian y comprueba que cada protagonista conserva su inventario y sus hechos personales sin filtraciones. Se comprueba además que una localización descubierta por Ariadna sigue en el mundo compartido y que Athun aparece como pertenencia canónica en ambas partidas. La suite de almacenamiento en la ejecución 361 (`43910479940`) volvió a aprobar 27/27 pruebas, 0 fallos.

La rama de integración sigue basada directamente en main, con 57 commits por delante y ninguno por detrás; el pull request 4 es integrable y permanece en borrador. No se ha fusionado. La única validación funcional pendiente es en un dispositivo Android físico con Chrome. Persisten algunas solicitudes HTTP 404 no bloqueantes en la consola de Playwright, pendientes de identificar.


### Corrección de recursos de plantilla ausentes — 16/11/2026

La instrumentación de Playwright identificó que los cuatro avisos HTTP 404 procedían de dos fondos WebP inexistentes: `app/assets/templates/athun-papiro-limpio.webp` y `app/assets/templates/athun-aventura.webp`. En vez de introducir imágenes no disponibles, se sustituyeron las referencias rotas por fondos CSS de pergamino y aventura en capas de gradientes y textura, y se añadió `favicon.svg` para la identidad del juego. Se guardó respaldo previo de `app/css/style.css` e `index.html`.

La ejecución 191 de Playwright (`43911426574`) pasó de nuevo en móvil y escritorio, con selector de dos protagonistas, regresión narrativa e interacciones completas. El registro de respuestas 404 quedó vacío: no se registraron recursos HTTP 404. La ejecución 380 de almacenamiento (`43911426719`) pasó 27/27 pruebas, 0 fallos. La rama está 69 commits por delante y 0 por detrás de main; PR #4 sigue abierto, en borrador e integrable. No se ha fusionado. La única validación pendiente es Chrome en un dispositivo Android físico.


### Revalidación autónoma y estado de integración — 16/11/2026

Se ha revisado el estado real de GitHub antes de continuar. El pull request #4 («Integrar partidas múltiples de Athun sin perder la narrativa actual») sigue abierto, en borrador y marcado como integrable, con destino `main`. La rama de integración conserva la apertura narrativa y reúne selector de partidas, registros independientes, mundo compartido, atlas, protección canónica de Athun y pruebas. No se ha fusionado ni se ha alterado `main`.

Se consultaron las ejecuciones remotas asociadas al último commit de la rama:
- GitHub Actions «Athun storage tests», ejecución **388** (ID `43911693394`): finalizada correctamente. Pasaron tanto la comprobación de sintaxis JavaScript como el paso de pruebas de almacenamiento y mundo compartido.
- GitHub Actions «Visual preview», ejecución **195** (ID `43911693467`): finalizada correctamente. Pasaron la instalación de Playwright, el servidor local, la renderización/prueba en Chromium móvil y escritorio y la carga de vistas previas.

Estas ejecuciones confirman CI y navegador Chromium simulado; no equivalen a una prueba táctil en un teléfono Android físico. Esa comprobación sigue pendiente y es el único requisito manual indicado antes de considerar la fusión. Se mantiene el PR en borrador y no se fusiona automáticamente.

Se creó antes de esta actualización el respaldo íntegro `docs/MAESTRO_COSMOPOLIS.md.bak-20261116-validacion-final-ci`. Las partidas locales del usuario no son accesibles desde esta revisión remota y no se han modificado.


### Corrección de consistencia del mundo compartido — 16/11/2026

En la auditoría se detectó que una acción podía publicar localizaciones, personajes y caminos en el mundo compartido antes de que el guardado personal estuviera confirmado. Se corrigió `Session.addAction()`: primero guarda la acción del protagonista y, únicamente si la escritura se verifica, sincroniza después el conocimiento compartido. Si el guardado falla, devuelve `false` y no publica esos descubrimientos.

Se añadió una prueba de regresión que simula un fallo de almacenamiento y comprueba que no se filtren lugares, rutas ni entidades, y que la posición y el historial personales permanezcan intactos. Se guardaron respaldos previos de los dos archivos de ejecución modificados.

GitHub Actions, ejecución **397** (ID `43924727789`): comprobación de sintaxis JavaScript y suite de almacenamiento/mundo compartido completadas correctamente. La corrección está validada en CI. No se ha fusionado el PR #4 ni se ha modificado `main`. La validación táctil en Chrome sobre Android físico sigue pendiente.


### Primer mapa visual para probar la exploración — 16/11/2026

Se pasa del atlas textual a una primera representación visual dentro del panel «Mapa». El esquema coloca la ubicación actual en el centro y distribuye alrededor los lugares visibles, visitados y conocidos. Dibuja únicamente las conexiones direccionales que ya están registradas en el mundo compartido y cuyos dos extremos son conocidos. Los lugares desconocidos no se enumeran ni se convierten en nodos.

Las posiciones del esquema son una distribución visual, no coordenadas, orientación ni distancias geográficas. Se mantiene esta limitación explícita para no presentar una topología provisional como cartografía real. La lista detallada del atlas y sus categorías sigue disponible debajo del dibujo.

Se añadieron pruebas unitarias para verificar que el esquema no introduce lugares ni caminos no registrados, que la ubicación actual ocupa el centro y que un atlas vacío no genera contenido ficticio. Playwright incorpora una comprobación de interfaz que abre el panel del mapa y exige que represente al menos la ubicación actual. Se renovaron las referencias de caché de index.html.

Respaldos previos: app/js/game/map.js.bak-20261116-mapa-jugable, app/js/app.js.bak-20261116-mapa-jugable, app/css/style.css.bak-20261116-mapa-jugable, tests/map.test.js.bak-20261116-mapa-jugable, index.html.bak-20261116-mapa-jugable y .github/workflows/visual-preview.yml.bak-20261116-mapa-jugable, además del respaldo de este documento creado antes de iniciar esta tanda.

Estado: cambios en la rama integration/athun-multisave-main-20261116, PR #4 abierto y sin fusionar. Las ejecuciones de almacenamiento 420, 421, 424, 426 y 427 han completado correctamente; queda confirmar la ejecución Playwright 222, que ya incluye la nueva comprobación visual del mapa. La prueba táctil en Chrome/Android físico sigue pendiente. Próximo paso: convertir la representación esquemática en un recorrido que se pueda probar desde la interfaz y hacer que los descubrimientos se produzcan mediante acciones reales de la aventura.


### Ajuste de la prueba visual del mapa — 16/11/2026

La primera ejecución Playwright con el mapa mostró que una comprobación previa buscaba el nombre de una ubicación sin distinguir entre el rótulo del SVG y la entrada de la lista. Como ambos deben mostrar el mismo lugar, el selector se acotó a `.atlas-place-name`; no se cambió la interfaz ni los datos de la aventura por este fallo. Se guardó el respaldo `.github/workflows/visual-preview.yml.bak-20261116-mapa-selector` antes del ajuste. GitHub Actions, ejecución de almacenamiento **435**, completada correctamente. GitHub Actions, ejecución Playwright **225** (`43930341843`), completada correctamente en Chromium para la interfaz móvil y de escritorio, incluida la apertura del mapa y la comprobación de su nodo actual. La prueba es emulada y no sustituye la validación táctil en un Android físico.


## Recuperación de avances narrativos y agente local — 16/11/2026

Se recupera sobre la rama de integración de Athun el trabajo narrativo rescatado del commit `0022127`, conservando las mejoras posteriores ya presentes en esta rama.

- Se mantiene la apertura de Valdebruma en el camino de entrada, sin encuentro prematuro con Elia ni revelación anticipada del pozo o la campana. Se conserva el estado ampliado de Athun: grimorio consciente, permanente y presente en el inventario, junto con la memoria y las revelaciones propias de la partida.
- Se conserva la implementación más avanzada de `director.js` y `adventure.js` que ya existía en la rama de integración; no se sustituye por versiones anteriores del commit rescatado.
- El historial de acciones registra `aiUsed`: `true` para respuestas de IA, `false` para respuestas alternativas y `null` cuando no hay información verificable.
- El timeout de generación del narrador local se amplía de 90 a 180 segundos.
- El lanzador de llama-server incorpora `--reasoning off`.
- Se recupera `scripts/agente_cosmopolis.js`, que limita cada tarea a un archivo autorizado, comprueba los parches antes de aplicarlos, crea copias de seguridad y valida sintaxis e integridad del diff.
- La eliminación de los adornos residuales de pliegues se mantiene sin tocar la composición del mapa ni el diseño actual de Athun.

Esta recuperación se realiza en `integration/athun-narrative-recovery-fixed`, creada a partir de `integration/athun-multisave-main-20261116`. No se modifica `main`, no se fusiona el PR #4 y no se descarta la rama de rescate.

Validación pendiente: ejecutar las pruebas automatizadas y la vista previa visual sobre esta rama; la prueba física en Android sigue pendiente.


### Validación de la recuperación narrativa — 16/11/2026

La recuperación selectiva de los avances narrativos y del agente local quedó validada en la rama de integración:
- GitHub Actions «Athun storage tests», ejecución 441 (ID `43939916206`): completada correctamente; comprobación de sintaxis JavaScript y pruebas de almacenamiento/mundo compartido aprobadas.
- GitHub Actions «Visual preview», ejecución 230 (ID `43939916229`): completada correctamente; Playwright renderizó y comprobó la interfaz móvil y de escritorio.

Estas ejecuciones sustituyen el estado de validación pendiente indicado en la sección de recuperación anterior. Son pruebas automatizadas en Chromium simulado; no equivalen a una prueba táctil en un dispositivo Android físico. El PR #4 sigue abierto en borrador, sin fusionar, y `main` permanece intacta.

### Coherencia espacial de las interacciones narrativas — 16/11/2026
La revisión de `Director.respond()` detectó que algunas interacciones podían resolverse a distancia: bastaba con mencionar el pozo aunque el protagonista estuviera en otra ubicación, y Elia podía responder o recibir ofrecimientos aunque su ubicación registrada fuera distinta de la del protagonista.

- El pozo solo admite inspección, manipulación o interacción mágica contextual cuando la ubicación actual es `Plaza del pozo` y el lugar ya ha sido descubierto.
- Elia solo participa en diálogos específicos y recibe aumentos de confianza u ofrecimientos cuando su ubicación coincide con la ubicación actual del protagonista.
- Si Elia es conocida pero está en otro lugar, preguntar por ella no simula una conversación presencial ni modifica su confianza.
- Se añadieron regresiones Playwright para comprobar la inspección remota del pozo, las preguntas a Elia fuera de escena y los ofrecimientos a distancia.
- Se conservaron copias previas de `director.js`, `visual-preview.yml` y este documento con el sufijo `.bak-20261116-presencia-escena`.

**Validación pendiente:** las nuevas regresiones deben completar GitHub Actions en la rama de integración. La prueba táctil en Chrome/Android físico continúa pendiente.

### Revisión adicional de presencia de Elia — 16/11/2026
- La validación visual completa terminó correctamente en el commit `5212e12` (GitHub Actions, ejecución visual `43945612638`); las pruebas de almacenamiento también finalizaron correctamente (`43945612500`).
- En una revisión posterior de `Director.respond()` se detectó una referencia residual: al intentar levantar la losa, el texto podía presentar a Elia observando aunque su ubicación registrada fuera otra. Se corrigió para usar la condición de presencia física `eliaPresent`, no solo el hecho de haberla conocido.
- Se eliminó además una asignación duplicada de `wellInspected`.
- Se añadió una regresión Playwright que sitúa a Elia en Calle Mayor y verifica que no aparezca narrativamente junto al pozo.
- Copia previa de `director.js`: `app/js/game/director.js.bak-20261116-presencia-elia-pozo`.
- La nueva tanda de CI correspondiente a este último cambio debe terminar antes de considerar cerrada la revisión.

### Atlas con muchos descubrimientos — 16/11/2026
- La distribución esquemática anterior aumentaba el radio del anillo en bloques de ocho lugares sin limitarlo al lienzo de 600 × 348. Una exploración prolongada podía colocar nodos fuera del área visible.
- Se ajustó el cálculo para distribuir los lugares en anillos de hasta ocho posiciones, con radios horizontales y verticales acotados al lienzo. Se mantienen el centro de la ubicación actual, los estados de niebla de guerra y las conexiones explícitas; no se inventan rutas ni coordenadas geográficas.
- Se añadió una prueba con 40 lugares para comprobar que no se pierden nodos, no aparecen duplicados y todas las posiciones quedan dentro del lienzo.
- Copias previas: `app/js/game/map.js.bak-20261116-atlas-muchos-lugares` y `tests/map.test.js.bak-20261116-atlas-limites`.
- La validación CI de esta ampliación queda pendiente.

### Separación entre mundo compartido y conocimiento personal — 16/11/2026
La revisión de `WorldMap.getAtlas()`, `Session` y el guardado por partidas confirma una separación deliberada que debe preservarse:

- El registro global puede conservar nombres de lugares, conexiones realmente recorridas y datos básicos de entidades para dar continuidad al mundo entre protagonistas.
- Cada atlas clasifica esos lugares según el estado de su propia partida: ubicación actual, zonas visibles declaradas, lugares visitados y lugares conocidos por el registro global. Que otro protagonista haya descubierto una zona no la marca como visitada ni visible para el personaje activo.
- Los hechos, acontecimientos, relaciones, confianza y recuerdos narrativos permanecen en el guardado personal; no deben copiarse al mundo global.
- Los datos compartidos de personajes se limitan a identidad, función y ubicación. No incluyen confianza ni recuerdos privados.
- El vínculo, memorias y revelaciones de Athun también son independientes por protagonista.
- Esta separación está cubierta por pruebas de `tests/map.test.js` y `tests/storage.test.js`, incluidas las regresiones de conocimiento de ubicaciones, rutas compartidas, privacidad de Elia y recuerdos de Athun.

No se cambia esta arquitectura: el mundo conserva continuidad común, mientras la experiencia, la niebla de guerra y la memoria del protagonista siguen siendo personales.


### Memoria de Athun disponible para el narrador — 16/11/2026
- La revisión detectó que el guardado ya conservaba vínculo, recuerdos y revelaciones de Athun por protagonista, pero `Narrator.buildMessages()` no los incluía en el contexto enviado al modelo.
- El narrador recibe ahora, dentro de la aventura activa, el vínculo y hasta doce recuerdos y doce revelaciones de Athun, con límites de longitud. Las instrucciones dejan claro que esa memoria pertenece exclusivamente a la partida activa, que no debe transferirse entre protagonistas y que los secretos se revelan gradualmente.
- Se añadió una regresión que construye el contexto de dos partidas distintas y verifica que cada una recibe únicamente los recuerdos y revelaciones de su propio Athun.
- Copias previas: `app/js/game/narrator.js.bak-20261116-athun-memoria-contexto`, `tests/storage.test.js.bak-20261116-athun-memoria-contexto` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261116-athun-memoria-contexto`.
- La nueva validación CI debe completarse antes de considerar cerrado este cambio. No se modifican los recuerdos guardados ni se inventan recuerdos nuevos; se corrige únicamente su disponibilidad para la narración.


### Registro activo de experiencias de Athun — 16/11/2026
- El narrador puede proponer hasta tres recuerdos compartidos y tres revelaciones por respuesta, además de un cambio de vínculo de -1, 0 o +1.
- Las instrucciones distinguen recuerdos vividos de revelaciones demostradas en escena; prohíben inventar experiencias y adelantar secretos.
- La aplicación deduplica sin distinguir mayúsculas, limita cada lista a 40 entradas y cada texto a 300 caracteres, y mantiene el vínculo entre -100 y +100.
- Se añadieron pruebas de deduplicación, límites de cantidad y estabilidad del vínculo. Todo queda dentro del guardado personal del protagonista; no se publica en el mundo compartido.
- Copias previas: `app/js/game/narrator.js.bak-20261116-athun-memoria-activa`, `tests/storage.test.js.bak-20261116-athun-memoria-activa` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261116-athun-memoria-activa`.


## REVISIÓN AUTÓNOMA DE CONTINUIDAD — 17 DE NOVIEMBRE DE 2026

Se ha revisado el estado remoto del repositorio y de la integración antes de continuar. No se ha modificado `main`, no se han fusionado ramas y no se ha tocado ningún guardado del usuario.

### Estado de integración
- El trabajo principal de partidas múltiples, mundo compartido, protección permanente de Athun, selector y atlas está en la rama `integration/athun-multisave-main-20261116`, que alimenta el PR #4 contra `main`.
- PR #4 sigue abierto y en borrador; su revisión informa 146 commits por delante y 0 por detrás de `main` en el último estado consultado. No se debe fusionar todavía porque falta la validación táctil en Chrome sobre Android físico.
- PR #5 («Recuperar avances narrativos y agente local…») consta como fusionado en la rama de integración, no en `main`. Sus cambios recuperados incluyen `aiUsed`, timeout local ampliado y el agente con validación de parches y respaldos.
- La rama `integracion/athun-multisave-main-20261116` es una línea distinta y más antigua (68 commits por delante de `main`); no debe confundirse con la rama actual del PR #4.

### CI verificada en el último commit consultado
Commit: `76fc9c4115fd7cd246f553c19ec3acfaaa0b03a2`.
- «Athun storage tests», ejecución 506: **correcta**.
- «Visual preview», ejecución 272: **fallida** en el paso «Render adventure on mobile and desktop». La instalación, el servidor local y la preparación de Playwright sí terminaron correctamente; la subida de capturas se omitió por el fallo.
- La suite de almacenamiento mantiene el resultado satisfactorio de 27 pruebas que recoge el PR. La validación visual de esta revisión no debe marcarse como aprobada hasta diagnosticar y corregir el fallo del paso Playwright y obtener una nueva ejecución verde.

### Próxima tarea técnica
1. Diagnosticar el fallo del workflow visual 272 sin cambiar a ciegas las reglas narrativas ni el guardado.
2. Reproducir el flujo de selector, migración heredada y apertura de aventura que ejecuta Playwright; corregir únicamente la causa demostrada.
3. Ejecutar de nuevo la suite de almacenamiento y Playwright en móvil simulado y escritorio.
4. Mantener pendiente la prueba táctil física en Android y no fusionar el PR #4 hasta completarla.

**Seguridad:** se creó antes de esta actualización una copia íntegra de este documento en `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-auditoria-autonoma`. No se eliminaron respaldos anteriores ni se realizaron operaciones sobre datos locales o partidas guardadas.


### Diagnóstico y corrección de regresión Playwright — 17 de noviembre de 2026

La ejecución visual 272 (commit `76fc9c4115fd7cd246f553c19ec3acfaaa0b03a2`) falló en una aserción que indicaba que la fase no avanzaba al cambiar de ubicación. El registro del job permitió localizar la causa real: el `fakeNarrative` del propio test no cumplía ya el contrato obligatorio de `Narrator.respond()`. El narrador exige `athunMemoriesToAdd`, `athunRevelationsToAdd` y `athunBondChange` (con `delta` y `reason`); al faltar esos campos, la respuesta simulada era rechazada y se ejecutaba el director de respaldo. La aserción posterior atribuía erróneamente el resultado a la fase de exploración.

Se ha actualizado únicamente el fixture de prueba para incluir los tres campos obligatorios con valores neutros. No se han cambiado las reglas narrativas ni el comportamiento de producción. Se conserva una copia previa del workflow en `.github/workflows/visual-preview.yml.bak-20261117-narrative-fixture` y otra de este documento en `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-narrative-fixture`.

**Estado:** corrección publicada en `integration/athun-multisave-main-20261116`. Pendiente la nueva ejecución de Playwright y la suite de almacenamiento. La prueba física en Android sigue pendiente; no fusionar PR #4 hasta completarla.


### Segunda corrección de fixtures Playwright — 17 de noviembre de 2026

La nueva ejecución visual 276 superó la regresión narrativa inicial y confirmó que la corrección anterior era válida. Después detectó un segundo fixture desactualizado en la prueba de interacciones: las respuestas simuladas usadas para las acciones de exploración y el ciclo de objetivos de personajes tampoco incluían los campos obligatorios de memoria/vínculo de Athun. El narrador rechazaba esas respuestas y activaba su alternativa determinista, por lo que la prueba de iniciativa autónoma de Elia no recibía la respuesta simulada prevista.

Se han completado los campos `athunMemoriesToAdd`, `athunRevelationsToAdd` y `athunBondChange` en las dos respuestas de interacción y en la fábrica de respuestas del test de ciclo de objetivos. Los valores son neutros y no alteran la historia ni el vínculo. Se creó un segundo respaldo del workflow y del documento maestro antes de esta modificación: `.github/workflows/visual-preview.yml.bak-20261117-narrative-fixture2` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-narrative-fixture2`.

**Estado:** suite de almacenamiento/sintaxis aprobada en la ejecución 521. La ejecución visual 276 reveló este segundo fixture incompleto; la corrección queda publicada y requiere una nueva ejecución completa. No se han modificado módulos de producción ni se ha fusionado PR #4.


### Revalidación Playwright y guardado transaccional — 17 de noviembre de 2026

La ejecución visual 279 terminó correctamente: Playwright superó las regresiones narrativas, el panel del mapa, historial, inventario, exploración, acciones, guardado/recarga, selector de dos protagonistas y aislamiento entre Ariadna y Darian en Chromium móvil simulado (390 × 844) y escritorio (1024 × 900). La suite de almacenamiento y sintaxis 526 también terminó correctamente.

En la revisión posterior de la persistencia se detectó que `Save.save()` y `Save.replace()` escribían primero el registro de la partida y después actualizaban el índice. Si fallaba la segunda escritura, el método podía devolver error dejando el registro ya cambiado. Se centralizó la operación en `writeSlotAndIndex()`, que conserva registro e índice anteriores, verifica ambas escrituras y revierte el cambio si falla la actualización del índice. `updateIndexEntry()` ahora propaga los fallos de verificación.

Se añaden dos pruebas que simulan fallos al guardar y sustituir una partida y comprueban que el registro y el índice originales se conservan. Copias previas: `app/js/core/save.js.bak-20261117-atomic-slot-save`, `tests/storage.test.js.bak-20261117-atomic-slot-save` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-atomic-slot-save`.

**Estado:** el cambio transaccional está publicado en la rama del PR #4; pendiente de la nueva suite de CI. El PR continúa abierto y en borrador. La validación táctil en Chrome sobre un Android físico sigue pendiente; no fusionar hasta completarla.


### Validación posterior del guardado transaccional — 17 de noviembre de 2026

Se ha comprobado el resultado de GitHub Actions asociado a la revisión de integración que contiene `writeSlotAndIndex()` y las dos pruebas de regresión de guardado/sustitución:

- **Athun storage tests**, ejecución 535: completada correctamente.
- **Visual preview**, ejecución 284: completada correctamente.
- La rama `integration/athun-multisave-main-20261116` continúa basada directamente en `main` (162 commits por delante, 0 por detrás en esta comprobación).

El guardado transaccional y sus pruebas están presentes en la rama del PR #4. La validación automatizada de Chromium móvil simulado y escritorio está aprobada; sigue pendiente exclusivamente la comprobación táctil en Chrome sobre un dispositivo Android físico. El PR #4 permanece abierto y en borrador. No fusionar ni modificar `main` hasta completar esa comprobación.


### Descubrimientos al explorar sin desplazarse — 17 de noviembre de 2026

La revisión del flujo de exploración encontró que Session.addAction() solo aplicaba las zonas visibles declaradas por el narrador cuando cambiaba la ubicación. Por tanto, una observación, búsqueda o investigación realizada desde el mismo lugar podía descubrir una calle o un punto cercano en la narración, pero el atlas no lo registraba como visible.

Se corrigió el flujo para aceptar una lista explícita de zonas visibles también cuando el protagonista permanece en el mismo lugar. Al cambiar de ubicación, si la respuesta no declara una nueva visibilidad, se limpia la visión anterior para mantener la niebla de guerra. Se limitan los nombres a 120 caracteres y la lista a doce entradas; no se inventan zonas ni conexiones.

Se añadieron dos regresiones: una confirma que la exploración estacionaria revela las zonas declaradas sin mover al protagonista; la otra confirma que una nueva ubicación no hereda zonas visibles antiguas si el narrador no declara otras. El conocimiento compartido sigue limitado a los lugares declarados y la visita personal no cambia.

Respaldos previos: app/js/game/session.js.bak-20261117-stationary-visibility, tests/storage.test.js.bak-20261117-stationary-visibility y docs/MAESTRO_COSMOPOLIS.md.bak-20261117-stationary-visibility.

Estado: cambio publicado en la rama integration/athun-multisave-main-20261116. Pendiente la validación de GitHub Actions. PR #4 permanece abierto y sin fusionar; main no se modifica.


### Validación de zonas visibles declaradas por el narrador — 17 de noviembre de 2026

La revisión del atlas encontró un punto débil: aunque el prompt prohíbe inventar lugares, el cliente aceptaba literalmente cualquier nombre devuelto por el modelo en `visibleLocations`. Una respuesta no conforme podía introducir topónimos sin respaldo en el mapa.

- Se añadió un filtro en `Narrator.filterVisibleLocations()`: solo conserva nombres que aparecen explícitamente en la escena narrativa, en el texto de apertura o en el conocimiento ya registrado de la partida/mundo.
- Se eliminan entradas vacías y duplicadas y se mantiene el límite de doce zonas.
- El filtro no crea lugares ni conexiones y no convierte una zona conocida por otro protagonista en una visita personal.
- Se añadió una prueba de regresión que combina una zona ya registrada, otra nombrada en la escena y una ubicación inventada que debe descartarse.
- Respaldos previos: `app/js/game/narrator.js.bak-20261117-visible-location-guard`, `tests/storage.test.js.bak-20261117-visible-location-guard` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-visible-location-guard`.

**Validación completada:** GitHub Actions «Athun storage tests», ejecución 588: correcta (sintaxis y suite de almacenamiento/mundo compartido). «Visual preview», ejecución 300: correcta (Playwright en Chromium móvil simulado de 390 × 844 y escritorio de 1024 × 900, con renderización y pruebas de interacción). El cambio está publicado en `integration/athun-multisave-main-20261116`. No se ha modificado `main`, no se ha fusionado el PR #4 y no se han tocado partidas guardadas. La prueba táctil en Chrome sobre un Android físico sigue pendiente.


### Revalidación final del atlas y estado de integración — 17 de noviembre de 2026

Se ha revisado de nuevo el PR #4 y las ejecuciones más recientes de GitHub Actions sobre el commit `52a52ad01053b50ec42d2555641d2f0a42be1359` de la rama `integration/athun-multisave-main-20261116`:

- «Athun storage tests», ejecución **590** (ID `44045635656`): completada correctamente. Pasaron la comprobación sintáctica y la suite de almacenamiento/mundo compartido.
- «Visual preview», ejecución **301** (ID `44045635851`): completada correctamente. Playwright terminó la renderización y las interacciones en Chromium móvil simulado (390 × 844) y escritorio (1024 × 900).
- La revisión del PR confirma que la rama está actualizada respecto a `main` (0 commits por detrás en el último estado registrado). El PR #4 continúa abierto y en borrador; no se ha fusionado ni se ha modificado `main`.

**Único bloqueo de validación pendiente:** probar la interfaz mediante interacción táctil real en Chrome sobre un dispositivo Android físico. La simulación de Playwright no sustituye esa comprobación. Hasta completarla, mantener el PR en borrador y no fusionar.

No se han modificado partidas guardadas ni datos locales. Se creó el respaldo íntegro previo `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-ci-590-301` antes de añadir esta actualización.


### Corrección de normalización de topónimos — 17 de noviembre de 2026

La revisión del filtro antialucinaciones del atlas detectó que la expresión regular de normalización estaba escrita con barras invertidas duplicadas. En lugar de retirar únicamente las marcas diacríticas Unicode, eliminaba también letras (incluida la «u») y cifras. Esto podía hacer equivalentes nombres distintos, por ejemplo «Puente viejo» y «Pente viejo», o «Calle 1» y «Calle 12», permitiendo falsos positivos en la validación de lugares visibles.

- Corregida la expresión para eliminar solo el rango Unicode de marcas combinantes tras normalizar a NFD.
- Ampliada la regresión del filtro con topónimos casi idénticos y numeración distinta; los nombres no mencionados deben descartarse.
- No se modifica el criterio de descubrimiento: los lugares deben estar respaldados por la escena o por el conocimiento registrado.
- Respaldos previos: `app/js/game/narrator.js.bak-20261117-normalizacion-toponimos`, `tests/storage.test.js.bak-20261117-normalizacion-toponimos` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-normalizacion-toponimos`.

**Validación:** pendiente de GitHub Actions sobre esta revisión. No se modifica `main`, no se fusiona el PR #4 y no se tocan partidas guardadas. La prueba táctil en Chrome para Android físico continúa pendiente.


**Ajuste del caso de regresión:** la primera ejecución de la suite detectó que el propio texto de prueba mencionaba «Calle 12», por lo que el filtro actuaba correctamente al aceptarla. Se corrigió el fixture para que la escena mencione «Calle 1» y «Calle 12» quede únicamente como candidato no respaldado. La prueba ahora verifica que la cifra forma parte de la identidad del topónimo y no se confunde con otra calle.


### Validación CI de normalización de topónimos — 17 de noviembre de 2026

La corrección de la normalización Unicode y su regresión quedaron verificadas en la revisión `4f42703bf3450f38d7101eb76ca7315989a7629e`:

- GitHub Actions «Athun storage tests», ejecución **611**: completada correctamente; sintaxis y las **40 pruebas** de almacenamiento/mundo compartido aprobadas.
- GitHub Actions «Visual preview», ejecución **312**: completada correctamente; Playwright terminó renderización e interacciones en Chromium móvil simulado (390 × 844) y escritorio (1024 × 900), incluida la prueba del atlas.
- La rama sigue basada en `main`, sin commits por detrás; PR #4 continúa abierto y en borrador.
- La validación táctil real en Chrome sobre Android físico sigue pendiente. No se fusiona hasta completarla.



### Verificación de continuidad y CI más reciente — 17 de noviembre de 2026

Se ha vuelto a comprobar el estado del repositorio antes de cerrar esta tanda:

- Rama de trabajo: `integration/athun-multisave-main-20261116`, cabecera funcional verificada en `2114652ab029ff6f7e1b008c265ec35f128ae1e2` antes de esta actualización documental.
- PR #4: abierto, en borrador y sin fusionar; destino `main`.
- Comparación con `main`: **193 commits por delante y 0 por detrás**; la base coincide con `ff292438bc60c391c2cc6f708ac12d02b166cb70`.
- «Athun storage tests», ejecución **614** (ID `44063310467`): correcta. El registro de ejecución confirma comprobación sintáctica y **40/40 pruebas aprobadas**, 0 fallos.
- «Visual preview», ejecución **313** (ID `44063310440`): correcta. Playwright terminó la regresión narrativa y las interacciones de historial, mapa, inventario, opciones, exploración, guardado/recarga y selector con dos protagonistas. La vista móvil simulada fue de 390 × 844 y la de escritorio de 1024 × 900; la interfaz quedó dentro del ancho y alto disponibles, sin errores JavaScript registrados.
- La suite cubre migración heredada idempotente y conservación de la clave original, alternancia y aislamiento personal, persistencia del mundo compartido, publicación de descubrimientos solo tras guardar y presencia/protección de Athun.

**Alcance de esta tanda:** no se ha modificado código de producción ni se han tocado partidas locales. Esta anotación solo registra la verificación remota. No se han ejecutado pruebas en Termux desde esta sesión.

**Bloqueo restante:** la interacción táctil real en Chrome sobre un Android físico sigue sin poder verificarse desde GitHub Actions. Debe comprobarse en el teléfono antes de sacar el PR del borrador o fusionarlo. En esa prueba hay que confirmar apertura y alternancia de dos partidas, guardado/recarga, mundo conocido compartido frente a progreso personal aislado y permanencia de Athun en el inventario sin posibilidad de perderlo, venderlo, transferirlo o destruirlo.

Hasta completar esa validación física, mantener el PR #4 en borrador y no fusionar. `main` y los guardados existentes permanecen intactos.



### Protección narrativa y transaccional de Athun — 17 de noviembre de 2026

La revisión confirmó que la capa de inventario ya impedía retirar o duplicar Athun, pero la instrucción literaria no enumeraba expresamente todas las formas de pérdida. Se reforzó el contrato entre narrador y estado del juego:

- El prompt declara a Athun permanente e inseparable y prohíbe narrar como exitosos el robo, venta, intercambio, transferencia, regalo, abandono, destrucción, consumo o retirada del grimorio.
- Se extrajo la aplicación de cambios de inventario a `Narrator.applyInventoryUpdates()`. El método ignora cualquier intento de retirar o añadir una entrada que contenga «Athun» y restaura la entrada canónica si faltara.
- Se añadió una regresión que simula intentos de retirar, vender, transferir y destruir Athun, verifica que no desaparece ni se duplica, comprueba que los demás objetos sí se actualizan y confirma la regla del prompt.
- Respaldos previos: `app/js/game/narrator.js.bak-20261117-athun-immutability`, `tests/storage.test.js.bak-20261117-athun-immutability` y este respaldo del documento maestro.

**Validación automatizada sobre el commit funcional `43efbb730dbe8869fc59c575e07a584f35317660`:**
- «Athun storage tests», ejecución **623** (push) y **624** (pull request): correctas; comprobación sintáctica y **41/41 pruebas aprobadas**, 0 fallos.
- «Visual preview», ejecución **319**: correcta. Playwright completó la regresión narrativa y las interacciones; el diseño móvil simulado midió 390 × 844 sin desbordamiento horizontal y la prueba de escritorio utilizó 1024 × 900.
- La nueva prueba específica de permanencia de Athun figura como subprueba **41** y pasó.

**Estado de integración:** PR #4 sigue abierto y en borrador. En la comparación previa a esta anotación, la rama estaba 199 commits por delante de `main` y 0 por detrás, con base `ff292438bc60c391c2cc6f708ac12d02b166cb70`. No se ha fusionado ni modificado `main`.

**Pendiente manual:** la interacción táctil real en Chrome sobre Android físico no puede certificarse desde Playwright/GitHub Actions. Debe comprobarse antes de retirar el borrador o fusionar: selector y alternancia de protagonistas, guardado y recarga, mundo común frente a progreso privado, e intentos de perder/vender/transferir/destruir Athun. No se han tocado partidas guardadas ni datos locales del teléfono.


### Protección del mundo compartido ante datos dañados — 17 de noviembre de 2026

La revisión del almacenamiento global detectó que getGlobalWorld() devuelve un mundo vacío cuando el registro athun_shared_world_v1 no se puede interpretar como JSON. Las funciones de actualización podían escribir después ese mundo vacío sobre el registro original, destruyendo el contenido recuperable de una entrada dañada.

Corrección aplicada en app/js/core/save.js:
- Se centralizó la escritura del mundo compartido en writeGlobalWorldVerified().
- Antes de escribir, comprueba que la clave global esté vacía o contenga un objeto JSON válido.
- Si el registro existente está truncado, es JSON inválido o contiene un tipo no admitido, la actualización se rechaza y los bytes originales permanecen intactos.
- La protección se aplica a localizaciones, conexiones, entidades y guardado completo del mundo.
- No se modifica el registro heredado cosmopolis_save, los registros individuales ni el índice de partidas.

Prueba añadida en tests/storage.test.js: simula un mundo global truncado e intenta actualizarlo mediante las cuatro vías; todas deben devolver false y conservar exactamente el valor original.

Respaldos creados antes de modificar:
- app/js/core/save.js.bak-20261117-world-corruption-guard
- tests/storage.test.js.bak-20261117-world-corruption-guard
- docs/MAESTRO_COSMOPOLIS.md.bak-20261117-world-corruption-guard

Commits de esta tanda:
- Respaldos: bd95840, a6727d8, a2c3afb.
- Protección de escritura: 8deccdc.
- Prueba automatizada: 0dfa605.

Validación pendiente: las pruebas locales no se han ejecutado desde esta sesión. La nueva prueba y la comprobación sintáctica deben pasar en GitHub Actions antes de considerar validado el cambio. Mantener el PR #4 en borrador y sin fusionar. La prueba táctil real en Chrome sobre Android físico sigue pendiente. No se han tocado guardados locales ni la rama main.


### Validación de protección del mundo compartido — 17 de noviembre de 2026

La protección frente a registros globales dañados ha superado la validación automatizada remota sobre el commit 6d358d1b23fd4157ee1a449d49a9ea5ef784c1ac:

- GitHub Actions «Athun storage tests», ejecución 638: correcta. La comprobación sintáctica de todos los archivos JavaScript terminó sin errores y las **42/42 pruebas** de almacenamiento, mundo compartido, migración, aislamiento y permanencia de Athun pasaron; 0 fallos.
- GitHub Actions «Visual preview», ejecución 327: correcta. Playwright completó renderización e interacciones en Chromium móvil simulado (390 × 844) y escritorio (1024 × 900).
- La nueva regresión es la prueba 42: simula JSON truncado en athun_shared_world_v1 y confirma que las operaciones de localización, conexión, entidad y guardado global rechazan la escritura sin alterar el valor original.
- La rama de integración permanece 207 commits por delante y 0 por detrás de main. PR #4 sigue abierto, en borrador y sin fusionar.

No se han ejecutado pruebas en Termux ni en un Android físico. La interacción táctil real en Chrome Android continúa pendiente; la simulación Playwright no la sustituye. No se han modificado main ni los guardados locales.


### Validación del esquema del mundo compartido — 17 de noviembre de 2026

La protección anterior ya rechazaba JSON truncado y valores raíz que no fueran objetos. La revisión adicional detectó otro caso: un objeto JSON válido podía contener campos conocidos con tipos incorrectos (por ejemplo, locations como texto o entities como array). getGlobalWorld() normaliza esos campos en memoria; sin una validación previa del esquema original, la siguiente escritura podía sustituir el contenido anómalo por arrays u objetos vacíos.

Corrección en app/js/core/save.js:
- writeGlobalWorldVerified() valida ahora, antes de escribir, los tipos de todos los campos conocidos que ya existan en el registro.
- locations, connections, facts, events y changes deben ser arrays.
- entities y relationships deben ser objetos no nulos y no arrays.
- Los campos ausentes siguen permitidos para mantener compatibilidad con registros anteriores.
- Si cualquier campo conocido tiene un tipo incompatible, la escritura se rechaza y el texto original del almacenamiento permanece intacto.

Prueba nueva en tests/storage.test.js: siete escenarios de esquema incoherente (locations, connections, entities, facts, events, changes y relationships). Cada actualización debe devolver false y conservar exactamente el JSON original.

Respaldos previos:
- app/js/core/save.js.bak-20261117-world-schema-guard
- tests/storage.test.js.bak-20261117-world-schema-guard
- docs/MAESTRO_COSMOPOLIS.md.bak-20261117-world-schema-guard

Commits:
- Respaldos: db4102e, 898d5f9, 77cad0f.
- Validación de esquema: d89a4c4.
- Prueba de regresión: ccd259e.
- Esta anotación documental se registra en un commit separado.

Validación pendiente al documentar: GitHub Actions debe ejecutar la comprobación sintáctica y la suite completa. No se afirma todavía que esta nueva prueba haya pasado. El PR #4 sigue abierto en borrador y no se fusiona. No se han modificado main ni guardados locales. La validación táctil en Chrome Android físico continúa pendiente.


### Resultado CI de validación del esquema global — 17 de noviembre de 2026

La validación automatizada ya se completó sobre el cambio funcional y sobre la revisión documental:
- GitHub Actions «Athun storage tests», ejecución **653** (commit documental actual): correcta.
- Comprobación sintáctica de todos los archivos JavaScript: correcta.
- Suite Node.js: **43/43 pruebas aprobadas, 0 fallos**. La prueba 43 comprueba los siete campos de esquema global y la conservación exacta del registro original cuando sus tipos son incorrectos.
- La ejecución 650, sobre el commit funcional de la prueba, también terminó correctamente con 43/43.
- «Visual preview», ejecución **336**, sobre el commit documental, sigue en curso en el momento de esta anotación; no se afirma aún su resultado.

Respaldos de esta actualización: docs/MAESTRO_COSMOPOLIS.md.bak-20261117-schema-ci653.

El PR #4 permanece abierto, en borrador y sin fusionar. No se ha tocado main ni ningún guardado local. La prueba táctil en Android físico sigue pendiente.


### Validación de cambios de ubicación del narrador — 17 de noviembre de 2026

La revisión del flujo de respuestas de la IA local detectó que el modelo podía cambiar `state.currentLocation` mediante el campo estructurado `location`, incluso si la respuesta no describía un desplazamiento o no mencionaba el destino. Como la sesión publica después la ubicación guardada en el atlas compartido, una respuesta incoherente podía crear un teletransporte narrativo y registrar un lugar como descubierto.

Corrección en `app/js/game/narrator.js`:
- Se incorpora `resolveCurrentLocation()` como validación previa del destino propuesto.
- Una ubicación distinta solo se acepta si la respuesta está clasificada como `movement` y el nombre del destino aparece explícitamente en el texto narrativo.
- En diálogos, investigaciones, combates y demás categorías, el protagonista conserva su ubicación aunque el modelo proponga otra en el JSON.
- Si el destino no aparece en la narración, se conserva la ubicación anterior; por tanto, no se activa falsamente la fase de exploración ni se publica ese destino en el mapa.

Regresión añadida en `tests/storage.test.js`:
- Rechaza un cambio de ubicación propuesto durante un diálogo.
- Acepta un desplazamiento cuyo destino se narra explícitamente.
- Rechaza un destino que no aparece en la respuesta, aunque la categoría sea movimiento.

Respaldos previos:
- `app/js/game/narrator.js.bak-20261117-location-guard`
- `tests/storage.test.js.bak-20261117-location-guard`
- `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-location-guard`

Commits funcionales:
- `10bc074`: validación inicial del desplazamiento.
- `4c5b168`: pruebas de regresión.
- `1efdf5d`: corrección de normalización Unicode en el validador.

**Validación CI:** pendiente de consultar para la revisión actual. No se declara aprobada la nueva regresión hasta que GitHub Actions confirme el resultado. La prueba táctil real en Chrome Android sigue pendiente. PR #4 permanece abierto y en borrador; no se ha fusionado ni modificado `main`.

### Revalidación visual y de almacenamiento — 17 de noviembre de 2026 (18:08 UTC)

Se corrigió únicamente el escenario simulado de la prueba visual: la respuesta ficticia que representa el desplazamiento ahora declara la categoría `movement` y menciona explícitamente el destino «Plaza del pozo». Esto hace que el escenario respete la validación narrativa real de `Narrator.resolveCurrentLocation()`; no cambia el comportamiento del juego.

- Commit: `21cdf2574c7263f61148f80db4e59c5fa02a2c7c`.
- GitHub Actions «Athun storage tests», ejecución **44144525754**: completada correctamente.
- GitHub Actions «Visual preview», ejecución **44144525744**: completada correctamente en Chromium móvil simulado y escritorio.
- La prueba táctil en Chrome sobre Android físico continúa pendiente; las pruebas automatizadas no la sustituyen.
- PR #4 permanece abierto, en borrador y sin fusionar. No se ha modificado `main` ni ningún guardado local.


## Corrección del contexto de memoria narrativa (17/11/2026)

Se ha corregido un desajuste en `Narrator.buildMessages()`: el historial reciente se preparaba con la propiedad `action`, pero al serializar el contexto se intentaba leer `text`. Como resultado, el modelo recibía las respuestas anteriores, pero no las acciones que las habían provocado. Ahora se conserva cada acción junto con su respuesta, y una prueba automatizada verifica ambos elementos en el contexto enviado al narrador.

- Se crearon copias de seguridad previas de `app/js/game/narrator.js`, `tests/storage.test.js` y este documento.
- La corrección no modifica partidas ni datos guardados.
- Debe validarse mediante las ejecuciones de CI de esta rama.


## Protección del límite de conocimiento sobre personajes (17/11/2026)

Se ha detectado que el contexto del narrador podía incluir la ficha de Elia aunque el protagonista todavía no la hubiera conocido. Aunque las instrucciones narrativas prohibían revelar ese conocimiento, enviar la ficha completa al modelo suponía una filtración innecesaria. Ahora Elia solo se incorpora al contexto cuando la partida registra `eliaMet: true), incluso si su ubicación coincide con la del protagonista. Se ha añadido una prueba que verifica la exclusión antes del encuentro y su inclusión después.

- Se crearon copias de seguridad previas de los tres archivos modificados.
- No se altera la secuencia del prólogo ni el estado de ninguna partida guardada.
- Pendiente de validación en CI.


## Ajuste del escenario visual de memoria de personajes (17/11/2026)

La nueva protección de conocimiento exige que Elia solo aparezca en el contexto del narrador cuando `eliaMet` sea verdadero. La prueba visual de compactación de recuerdos inspeccionaba la ficha de Elia sin declarar previamente que la protagonista la conocía, por lo que el escenario fallaba correctamente al no encontrarla. Se ha corregido el fixture para establecer explícitamente `probe.state.eliaMet = true` antes de comprobar límites de memoria y objetivos. No se ha debilitado la protección del juego.

- La prueba automatizada de almacenamiento ya había pasado.
- La vista previa falló por una precondición omitida en el fixture, no por un error de ejecución del juego.
- Se creó backup previo del workflow y del documento maestro.
- Pendiente nueva validación de CI.


## Cierre de filtración de entidades compartidas no conocidas (17/11/2026)

Al ampliar la revisión del límite de conocimiento se detectó una segunda vía: el registro global compartido de entidades podía entregar al narrador la identidad y función de Elia aunque la partida activa todavía no la hubiera conocido. La ficha local ya estaba protegida, pero el registro global se incluía sin filtrar.

- El contexto narrativo ahora incorpora entidades compartidas únicamente si su identidad también está presente entre los personajes conocidos de la partida activa.
- Elia continúa excluida por completo hasta que `state.eliaMet === true`, incluso si otra partida ya la registró en el mundo compartido.
- Al conocerla, su referencia global puede acompañar al contexto para mantener identidad y continuidad.
- Se amplió la prueba automatizada para simular que otra partida ya había descubierto a Elia y verificar que no se filtra antes del encuentro, pero sí después.
- Se preserva el registro compartido; el filtro afecta solo a la información entregada al narrador de la partida activa.


## Memoria relacional de Athun (17/11/2026)

El vínculo de Athun ya no depende únicamente de una cifra. Cada cambio efectivo de afinidad conserva también un motivo breve en `state.athun.bondHistory`, dentro de la partida correspondiente.

- El historial guarda solo cambios reales (no registra incrementos que hayan quedado bloqueados por los límites de -100/100).
- Se conservan como máximo 30 motivos y se entregan al narrador los 12 más recientes.
- El contexto mantiene el aislamiento entre protagonistas: cada partida recibe únicamente su propia historia de vínculo.
- La instrucción narrativa utiliza esos motivos para dar continuidad emocional sin convertir la puntuación en una personalidad rígida.
- Se añadió una prueba que registra cambios en sentidos opuestos y verifica que ambos motivos llegan al contexto narrativo de la misma partida.


La prueba de aislamiento de Athun también comprueba ahora que los motivos del vínculo de Ariadna y Darian no se mezclan al alternar partidas.


La capa de normalización de partidas en `app/js/core/save.js` también conserva y sanea este historial al cargar o migrar una ficha: mantiene los 30 registros válidos más recientes, limita cada motivo y descarta entradas mal formadas. Así la memoria relacional no desaparece al reabrir una partida.


### Saneamiento defensivo del estado relacional de Athun — 17 de noviembre de 2026

La actualización de memoria relacional se ha endurecido para no confiar en que el estado cargado esté siempre limpio. Antes de aplicar novedades, `Narrator.applyAthunUpdates()` normaliza el vínculo al intervalo -100..100, filtra recuerdos y revelaciones a texto no vacío de hasta 300 caracteres (máximo 40 de cada tipo) y valida el historial de vínculo (delta -1..1, motivo textual de hasta 240 caracteres y máximo 30 entradas). Los datos mal formados se descartan sin impedir que se incorporen recuerdos nuevos válidos.

Respaldos previos creados en la rama:
- `app/js/game/narrator.js.bak-20261117-athun-state-sanitization`
- `tests/storage.test.js.bak-20261117-athun-state-sanitization`
- `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-athun-state-sanitization`

Se añadió una regresión que introduce entradas de tipos incorrectos, motivos inválidos, un delta fuera de rango y textos demasiado largos; comprueba la normalización y que la actualización continúa procesando datos válidos. La validación de CI queda pendiente; no se considera superada hasta consultar sus resultados.


### Filtrado de memoria antes de construir el contexto del narrador — 17 de noviembre de 2026

Se ha cerrado una segunda vía de entrada de datos defectuosos: `Narrator.buildMessages()` ya no copia objetos, valores vacíos ni motivos no textuales de recuerdos, revelaciones e historial de Athun al contexto enviado al modelo. Además, la representación compacta del estado sobrescribe cualquier copia sin filtrar de `state.athun` con el contexto normalizado, evitando que el mismo dato llegue por una ruta paralela. Se conserva el contenido textual válido y se limita cada recuerdo/revelación a 240 caracteres en el prompt.

Se añadió una prueba que introduce deliberadamente objetos y valores de tipos incorrectos y verifica tanto el contexto específico de Athun como la copia anidada en el estado. Respaldo previo: `app/js/game/narrator.js.bak-20261117-athun-prompt-memory-filter`, `tests/storage.test.js.bak-20261117-athun-prompt-memory-filter` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-athun-prompt-memory-filter`.


### Saneamiento del contexto de personajes y objetivos — 17/11/2026
- El contexto enviado al narrador ya no copia indiscriminadamente los objetos completos de cada personaje.
- Se construye una lista explícita de campos narrativos permitidos; objetivos, estados, confianza, acciones autónomas, recuerdos e historiales se validan y limitan.
- Se descartan recuerdos y entradas de objetivos que no sean texto válido, y se excluyen campos arbitrarios que pudieran contener datos ajenos al contexto narrativo.
- Se añade una regresión con recuerdos malformados, objetivos inválidos, confianza fuera de rango y un campo privado adicional.
- Se conserva el estado original del personaje en la partida; el saneamiento afecta únicamente al contexto que recibe el modelo.


### Validación de acciones autónomas dentro de la escena — 17/11/2026
- Las iniciativas autónomas solo se guardan si el texto de la acción aparece realmente en la narración de la escena actual.
- Se descartan acciones de personajes que no estén registrados, que estén en otra ubicación o que repitan exactamente su última iniciativa.
- Se elimina la inserción automática de acciones al final del relato: el registro estructurado ya no puede introducir una acción que el narrador no haya contado.
- Se añade una prueba de regresión para acciones narradas, omitidas, repetidas, de personajes fuera de escena y nombres desconocidos.


### Ajuste del fixture visual de iniciativas autónomas — 17/11/2026
- La escena simulada de la vista previa ahora incluye expresamente en el texto narrativo la iniciativa de Elia que registra el JSON.
- La prueba conserva su propósito: verificar que la iniciativa aparece integrada en la narración, en vez de depender de que el juego añada una nota al final.


### Validación estructural de actualizaciones de objetivos de personajes — 17 de noviembre de 2026

Se ha reforzado la frontera entre la respuesta del narrador y el estado persistente de los personajes. Antes, una entrada de objetivo con un estado desconocido podía convertirse silenciosamente en «active», y se aceptaban motivos vacíos. Ahora `Narrator.filterGoalUpdates()` solo permite hasta dos actualizaciones por turno cuando:
- El personaje existe en la partida activa y su nombre coincide con una ficha registrada.
- El objetivo es texto no vacío y está limitado a 240 caracteres.
- El estado pertenece exactamente a `active`, `progress`, `blocked` o `completed`.
- El motivo es texto no vacío y está limitado a 200 caracteres.

Las reglas existentes de continuidad siguen impidiendo sustituir objetivos pendientes o reabrir objetivos cumplidos sin una nueva etapa válida. Se añade una prueba de regresión para nombres desconocidos, estados inválidos, motivos vacíos y entradas no listadas.

Respaldos creados antes de los cambios:
- `app/js/game/narrator.js.bak-20261117-goal-update-validation`
- `tests/storage.test.js.bak-20261117-goal-update-validation`
- `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-goal-update-validation`

La validación automatizada queda pendiente de GitHub Actions; no se considera aprobada hasta confirmar el resultado de CI. El PR #4 continúa abierto, en borrador y sin fusionar. No se modifican `main` ni las partidas guardadas locales.


### Reducción de ejecuciones y notificaciones redundantes — 17/11/2026

Se ajustaron los disparadores de GitHub Actions para evitar que cada commit de la rama de integración ejecute dos veces las mismas comprobaciones:
- Las pruebas de almacenamiento ya no se disparan por `push` en la rama de integración; siguen ejecutándose en las ramas principales configuradas y en cada PR hacia `main` cuando cambian `app/js/**`, `tests/**` o su propio workflow.
- La vista previa visual ya no se dispara por `push` en la rama de integración; se conserva en PR hacia `main` y se limita a cambios de `app/**`, `index.html` o su workflow. También se mantiene la ejecución manual.
- Se conservan ambas suites; no se desactivan las validaciones de código ni las pruebas de interfaz. Los cambios solo eliminan ejecuciones duplicadas y las activaciones por documentación u otros archivos no relacionados.

Respaldo previo: `docs/MAESTRO_COSMOPOLIS.md.bak-20261117-ci-notification-filter`, además de las copias previas de ambos workflows. Las nuevas reglas deben confirmarse mediante las ejecuciones que GitHub genere a partir de esta revisión. No se modifica `main`, no se fusiona el PR #4 y no se accede a partidas guardadas locales.


La revalidación posterior a los cambios de disparadores ha finalizado correctamente sobre la revisión `95f3d4df`:
- «Athun storage tests», ejecución **797**: correcta.
- «Visual preview», ejecución **418**: correcta en Chromium móvil simulado y escritorio.

La eliminación del disparador `push` redundante en la rama de integración y los filtros de rutas quedan validados. Las notificaciones de las pruebas de PR se mantienen para proteger los cambios que afectan al código; ya no se genera además una segunda ejecución equivalente por cada `push` en esta rama.


### Personalidad evolutiva de Athun — 18 de noviembre de 2026

Se incorpora una capa narrativa derivada, no persistida, para que la personalidad de Athun pueda evolucionar con el vínculo y las experiencias de cada protagonista:
- Narrator.deriveAthunRelationship() calcula un tono orientativo de confianza, la tendencia de los últimos cambios de vínculo y hasta tres motivos y recuerdos compartidos.
- El perfil se deriva del estado de la partida activa y se envía como athunRelationship, separado del registro canónico currentAdventure.athun. No añade claves al guardado ni mezcla datos entre protagonistas.
- El prompt pide que esa información matice gradualmente la voz, la iniciativa y la vulnerabilidad del grimorio, sin convertir una puntuación en una personalidad rígida ni forzar emociones en cada escena.
- Los hechos y recuerdos concretos prevalecen sobre las etiquetas orientativas; se mantienen intactas la protección permanente de Athun y las reglas de descubrimiento gradual.
- Se añaden pruebas para evolución hacia la cautela y hacia una familiaridad profunda, tendencia reciente, anclas de memoria y presencia del perfil en el contexto narrativo.


## REVISIÓN DEL ESTADO DE INTEGRACIÓN Y LÍMITES DE DESCUBRIMIENTO — 18 DE NOVIEMBRE DE 2026

### Estado del PR #4 antes de esta tanda
- Rama: \`integration/athun-multisave-main-20261116\`.
- Revisión: \`f3b58592199fe1bb7bfa0569062d3c30311725df\`.
- PR #4 abierto y en borrador, con base \`main\`; GitHub lo informa como integrable (\`mergeable_state: clean\`), 320 commits por delante y ninguno por detrás.
- Comprobaciones de esa revisión: «Athun storage tests» (ejecución 44265906015) y «Visual preview» (ejecución 44265906111), ambas correctas. No hay revisiones ni hilos de comentarios pendientes.
- PR #3 sigue abierto como propuesta anterior de partidas/atlas; PR #1 sigue abierto como propuesta narrativa independiente. Ninguno se fusiona en esta tanda.
- Continúa pendiente la prueba táctil real en Chrome sobre Android físico. Las pruebas Playwright móvil/escritorio no sustituyen esa comprobación.
- No se modifica \`main\`, no se fusiona ningún PR y no se accede a los guardados del dispositivo.

### Hallazgo: el JSON podía descubrir cosas que el texto no contaba
La revisión de \`Narrator.respond()\` detectó que \`factsToAdd\`, \`cluesToAdd\` y \`charactersToAdd\` se aplicaban sin comprobar que el descubrimiento estuviera realmente narrado. Una respuesta podía registrar a Elia o marcar la campana como descubierta aunque el texto visible no la mencionara.

### Corrección aplicada en esta tanda
- Los hechos y pistas solo se guardan cuando su frase aparece literalmente en \`reply\`, tras normalizar mayúsculas, tildes y puntuación.
- Las marcas de descubrimiento del pozo y la campana se derivan únicamente de afirmaciones respaldadas por el texto; las afirmaciones negativas no activan esas marcas.
- Cada personaje nuevo debe aportar \`evidence\`: fragmento literal de \`reply\` que contiene su nombre y una señal de presencia o interacción.
- La ubicación declarada del personaje debe coincidir con la ubicación actual de la escena. Se rechazan rumores, personajes de otra zona y cualquier intento de registrar a Athun como personaje duplicado.
- \`eliaMet\` solo cambia a verdadero cuando el encuentro de Elia supera esas comprobaciones.
- Se corrigieron los fixtures de Playwright para que los descubrimientos, el encuentro con Elia y la entrada de Tomás aparezcan también en el texto narrativo, no solo en el JSON estructurado.

### Validación
- Se añadieron regresiones para descubrimientos incluidos únicamente en el JSON, afirmaciones literales válidas, rumores, personajes fuera de escena, duplicación de Athun y afirmaciones negativas.
- La validación remota de esta revisión queda pendiente de las ejecuciones de GitHub Actions. No se declara todavía aprobada.


### Resultados de validación del filtro de descubrimientos — 18 de noviembre de 2026

La revisión de código \`01abd4847b2949a36a37d6d92b8ed40d6a478221\` ha superado las dos comprobaciones automáticas:

- **Athun storage tests**, ejecución **44268205134**: correcta. La suite informa **56 pruebas, 56 aprobadas y 0 fallidas**. Incluye las tres regresiones nuevas sobre afirmaciones no narradas, encuentros presenciales y menciones negativas.
- **Visual preview**, ejecución **44268205117**: correcta. La regresión narrativa de apertura, descubrimiento gradual y permanencia de Athun termina en \`OK\`; las pruebas de interacción terminan en \`INTERACTION_TESTS_OK\` para historial, atlas, inventario, opciones, exploración, respuesta de IA, guardado y recarga.
- La vista móvil simulada se renderizó a **390 × 844 px**, sin desbordamiento horizontal del documento. La vista de escritorio también terminó correctamente.

Los avisos de obsolescencia de Node.js 20 emitidos por algunas acciones de GitHub no provocaron fallos y no afectan al resultado de estas pruebas.

**Pendiente fuera de CI:** probar los controles táctiles en Chrome sobre un dispositivo Android real. La simulación de Playwright no sustituye esa validación. También queda para una siguiente tanda revisar la evidencia narrativa de \`itemsToAdd/itemsToRemove\` y de los cambios de ubicación de personajes ya registrados; este cambio no amplía todavía esos validadores.

El PR #4 permanece abierto y en borrador. No se ha fusionado ni se ha modificado \`main\`.

### Validación de consecuencias narrativas — 18 de noviembre de 2026

Se refuerzan tres fronteras entre la respuesta del modelo y el estado persistente de la partida:

- **Inventario:** `itemsToAdd` y `itemsToRemove` solo se aplican cuando el objeto aparece literalmente en una misma frase de `reply` junto a una acción explícita de adquisición o pérdida. Las menciones sin acción no crean ni eliminan objetos. Athun sigue protegido frente a retirada, pérdida y duplicación.
- **Personajes:** los cambios de ubicación requieren que el nombre del personaje, el destino y una señal de desplazamiento aparezcan juntos en la escena. Los cambios de actitud también deben estar expresados junto al personaje; los campos JSON por sí solos no bastan.
- **Visibilidad:** el atlas deja de tratar todos los lugares conocidos del mundo o visitados anteriormente como visibles desde la posición actual. Solo acepta topónimos respaldados por la escena actual o la ubicación presente.

Se añaden regresiones para adquisiciones y pérdidas sin evidencia, movimientos inventados, cambios de actitud no narrados y lugares conocidos pero no visibles.

**Validación automática pendiente:** ejecutar «Athun storage tests» y «Visual preview» sobre esta revisión antes de considerar cerrada la tanda. No se ha fusionado el PR ni se ha modificado `main`. La prueba táctil en Chrome para Android físico continúa pendiente.


### Evidencia negativa en cambios de inventario — 18 de noviembre de 2026

- Se ha reforzado `Narrator.applyInventoryUpdates()`: una frase que contiene el nombre de un objeto y un verbo de adquisición o pérdida ya no basta si la acción está negada.
- La comprobación analiza la cláusula de cada verbo para distinguir una negación real de una rectificación posterior (por ejemplo, «no lo recoges, pero después lo guardas»).
- Athun conserva su protección canónica y no puede entrar ni salir del inventario mediante estos campos.
- Se añadieron regresiones para adquisiciones y pérdidas negadas, además de acciones afirmativas posteriores a una negación.
- Se crearon copias previas de `narrator.js` y `storage.test.js` con sufijo `bak-20261118-inventory-negation-guard`.

**Validación automática pendiente:** los nuevos commits deben completar «Athun storage tests» antes de dar por cerrada esta corrección. No se modifica `main`, no se fusiona el PR y no se toca ningún guardado del dispositivo.


### Evidencia de acciones y desplazamientos afirmativos — 18 de noviembre de 2026

Se completa la revisión de las otras consecuencias persistentes señaladas en la tanda anterior:

- **Inventario:** las adquisiciones y pérdidas se aceptan solo si el verbo de acción aparece en una cláusula afirmativa junto al objeto. Se ignoran «no recoges», «nunca pierdes» y negaciones equivalentes; una acción afirmativa posterior tras «pero» o «aunque» sí puede registrarse.
- **Ubicación de personajes:** ya no se aceptan como desplazamiento las frases estáticas «permanece», «espera» o «se encuentra». También se rechazan desplazamientos negados. Se conservan los movimientos afirmativos narrados hacia un destino explícito.
- Se añadieron pruebas para las negaciones del inventario, las permanencias, los desplazamientos negados y una rectificación afirmativa posterior.
- Se hicieron copias previas independientes de `narrator.js` y `storage.test.js` para esta revisión, con sufijo `bak-20261118-character-movement-guard`.

**Comprobación local dirigida:** sintaxis de ambos archivos correcta y ejecución de los escenarios nuevos sobre el código real correcta (inventario y movimiento de personajes). No se ha obtenido una ejecución nueva de GitHub Actions asociada a estos commits; la suite remota completa sigue pendiente. No se modifica `main`, no se fusiona el PR y no se toca ningún guardado del dispositivo.


## Protocolo de desarrollo sin spoilers — 18/11/2026

Decisión confirmada por el usuario: desarrollar Athun: el grimorio oscuro sin revelar el contenido del mundo que debe descubrir como jugador.

### Información reservada
- Nombres, distribución, características y habitantes de ciudades, pueblos y localizaciones aún no descubiertos jugando.
- Personajes, encuentros, misiones, acontecimientos, secretos, misterios, giros argumentales y recompensas futuras.
- Contenido oculto del mapa, rutas no descubiertas y zonas aún no reveladas.
- Historia, capacidades, recuerdos, motivaciones y revelaciones de Athun que deban descubrirse progresivamente.

### Información compartible
- Arquitectura del software, código, pruebas, almacenamiento, rendimiento, seguridad y depuración.
- Mecánicas y sistemas descritos de forma abstracta, sin ejemplos que revelen contenido de la aventura.
- Decisiones de interfaz, accesibilidad, controles, equilibrio y herramientas de desarrollo.
- Estado técnico, riesgos, tareas pendientes y resultados de validación, evitando nombres y detalles narrativos reservados.

### Normas operativas
- No presentar atlas completos, listados de asentamientos, fichas de personajes, cronologías, argumentos ni documentos de lore al usuario.
- Mantener el contenido narrativo reservado en los archivos internos de desarrollo y no reproducirlo en informes conversacionales.
- Usar identificadores neutros o descripciones técnicas al hablar de pruebas que simulen descubrimientos.
- No pedir decisiones creativas que adelanten lugares, personajes o acontecimientos que el usuario debería descubrir jugando.
- Si una decisión del usuario es imprescindible, formularla en términos de experiencia o mecánica, sin revelar contenido reservado.
- El usuario debe poder iniciar una partida sin conocer de antemano el mundo, el mapa ni los acontecimientos futuros.

Este protocolo prevalece sobre cualquier práctica anterior de presentar propuestas de regiones, ciudades, personajes o misterios como contenido visible durante el desarrollo.

### Evidencia narrativa en cambios de objetivos — 18/11/2026

Se endurece la validación de actualizaciones persistentes de objetivos de personajes:

- `filterGoalUpdates()` recibe ahora el texto narrativo de la respuesta.
- Cada cambio exige que el personaje esté registrado y que el motivo sea un fragmento literal suficientemente concreto de una misma frase de la narración que mencione a ese personaje.
- Se descartan los cambios de objetivo cuyo motivo solo aparezca en el JSON estructurado, no en la escena narrada.
- El prompt del narrador exige que `reason` cite evidencia literal de `reply`.
- Se amplían las pruebas para cubrir cambios respaldados, personajes desconocidos, estados inválidos, motivos vacíos y cambios inventados sin evidencia narrativa.
- Se crearon respaldos previos de `app/js/game/narrator.js` y `tests/storage.test.js` con el sufijo `bak-20261118-goal-evidence`.

**Estado de validación:** cambios guardados en la rama `integration/athun-multisave-main-20261116`. La suite completa de GitHub Actions todavía no ha devuelto una ejecución asociada a este último commit; no se declara superada. La validación táctil en Chrome/Android físico sigue pendiente. No se modifica `main`, no se fusiona el PR #4 y no se toca ningún guardado del dispositivo.


### Evidencia narrativa en recuerdos de personajes — 18/11/2026

Se aplica el mismo criterio de evidencia narrativa a los recuerdos persistentes de personajes:

- Se añade `filterCharacterMemories(entries, state, reply)`.
- Solo se acepta un recuerdo si el personaje ya está registrado y el contenido del recuerdo aparece literalmente, tras normalización, en una misma frase de `reply` que también identifica al personaje.
- Se rechazan recuerdos inventados únicamente en el JSON estructurado, referencias a personajes desconocidos y duplicados dentro del lote.
- El procesamiento de `characterMemoriesToAdd` utiliza el nuevo filtro antes de modificar el estado persistente.
- Se añade una prueba con recuerdos respaldados, no respaldados, personaje desconocido, duplicados y respuesta no narrativa.
- Se crearon respaldos previos de `app/js/game/narrator.js` y `tests/storage.test.js` con el sufijo `bak-20261118-character-memory-evidence`.

**Estado de validación:** código, pruebas y documentación guardados en la rama `integration/athun-multisave-main-20261116`. Se ha comprobado la presencia de los cambios y de las pruebas en GitHub, pero no hay una ejecución de GitHub Actions asociada al último commit; no se declara superada la suite. La validación en Chrome/Android físico sigue pendiente. No se modifica `main`, no se fusiona el PR #4 y no se toca ningún guardado del dispositivo.

## PROTECCIÓN DE ATHUN EN INVENTARIOS ESTRUCTURADOS — 19 DE NOVIEMBRE DE 2026

### Hallazgo y corrección

La normalización de partidas ya eliminaba las entradas de inventario cuyo texto contenía Athun, pero String(objeto) no inspeccionaba la identidad de una entrada estructurada. Un registro heredado o futuro con campos como id: "athun", itemId o name podía sobrevivir junto a la representación canónica.

- Se incorpora Save.isAthunInventoryEntry(), que comprueba los campos de identidad habituales de entradas estructuradas sin confundir una descripción incidental con la identidad del objeto.
- Save.normalizeSlot() elimina cualquier representación identificada como Athun y vuelve a insertar exactamente una entrada canónica.
- Se conserva el resto del inventario, incluidas entradas estructuradas ajenas a Athun.
- La nueva regresión comprueba varias formas de duplicación, conservación de objetos no relacionados, permanencia del estado de Athun e idempotencia de la normalización.
- Respaldos previos creados antes de editar: app/js/core/save.js.bak-20261119-athun-structured-inventory, tests/storage.test.js.bak-20261119-athun-structured-inventory y docs/MAESTRO_COSMOPOLIS.md.bak-20261119-athun-structured-inventory.

### Estado de la rama e integración

- PR #4 sigue abierto y en borrador; no se ha fusionado.
- Tras los dos commits de esta tanda, la rama está 361 commits por delante y 56 por detrás de main. GitHub informa mergeable_state = dirty (hay conflictos); no se intenta rebase ni fusión. main permanece intacta.
- La cabeza nueva dd70f2772c7279d2578f5d43b80e345840cbb4af no tiene check-runs, estados ni ejecuciones de Actions asociadas. Por tanto, la regresión nueva y la suite completa no se han ejecutado en CI sobre esta revisión.
- Las últimas ejecuciones verdes localizadas (44268522892 y 44268522900) corresponden al commit anterior b357d24, por lo que no validan dd70f277.
- Sigue pendiente obtener una ejecución verificable de CI para esta revisión; no se declara aprobada la suite.
- Sigue pendiente la prueba táctil real en Chrome para Android físico. Las pruebas automatizadas de navegador no la sustituyen.

No se han leído, migrado, sobrescrito ni eliminado guardados del dispositivo.

## Corrección unificada de la pantalla de aventura — 22/11/2026

La integración se prepara directamente sobre la revisión actual de `integration/athun-multisave-main-20261116`, posterior a la eliminación del rótulo «EL GRIMORIO TE RECUERDA». Se evita recuperar versiones anteriores de `app.js` o alterar esa corrección.

- Se incorpora la plantilla gráfica principal aprobada sin rosas como fondo de la pantalla de aventura.
- Se refuerza la tinta de narración, ubicación, momento y acción actual para mantener contraste sobre el pergamino.
- Cabecera, relato, panel de acción y barra inferior quedan en cuatro filas estables; solo el relato tiene desplazamiento vertical propio.
- El formulario se limita al campo de texto y al botón Enviar; la pluma decorativa queda fuera de la composición compacta.
- Los cinco accesos inferiores se distribuyen en cinco columnas iguales; los separadores no consumen espacio ni generan una fila adicional.
- Se actualiza la versión de CSS para evitar que Chrome reutilice estilos anteriores.

**Seguridad:** se conserva el `app.js` actual de la rama de integración, incluido el cambio que elimina «EL GRIMORIO TE RECUERDA». Solo se añade el recurso gráfico y se ajustan CSS, caché y documentación. No se modifica almacenamiento, migraciones ni partidas guardadas. No se fusiona en `main`.


## Diagnóstico de vista previa visual — 22/11/2026

- Se revisó el PR #14 sobre la cabeza `2f8ab71c29afaef10969ca322d9374beaad8d5e7`, basada en la integración vigente `05fb37aef40288e0e419819f0850cc98cd9b75cc`. La propuesta no modifica `app.js`, conserva la eliminación de «EL GRIMORIO TE RECUERDA» y limita su alcance a recurso visual, CSS, caché, workflow y documentación.
- El recurso `app/assets/athun-plantilla-principal-sin-rosas.webp` se inspeccionó directamente: es un WebP VP8 de 400 × 566 px. Contiene ya el marco superior, el área de narración, el campo del jugador y la barra inferior dibujados en la propia imagen; por tanto, la composición HTML/CSS debe alinearse con esos marcos y no duplicarlos.
- La ejecución visual 44968513797 (job 137042876538) falla después de renderizar y tomar las capturas, en una aserción de progresión de metas narrativas: esperaba archivar «Descubrir el origen de la campana.» y abrir «Investigar quién construyó la cámara bajo el pozo.», pero el resultado conserva la meta anterior completada. No es una aserción de geometría visual. El workflow omitía subir las capturas al fallar.
- Se cambió únicamente el paso de subida de artefactos para que se ejecute también cuando una aserción posterior falla (`if: always()`); los archivos ausentes ahora generan advertencia, no ocultan el fallo principal. Esto permite inspeccionar las capturas reales de la interfaz y separar defectos visuales de regresiones narrativas.
- Respaldos previos exactos: `.github/workflows/visual-preview.yml.bak-20261122-artifact-on-failure` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261122-artifact-on-failure`.

**Estado:** el ajuste del workflow está guardado; todavía no hay una nueva ejecución que confirme la publicación del artefacto. No se declara aprobada la vista previa ni la validación táctil en Chrome Android. No se modifican `main`, PR #4, almacenamiento ni partidas guardadas.


## Alineación real de narración y panel del jugador — 22/11/2026

La captura móvil recuperada de la ejecución 45023756290 mostró defectos concretos que las comprobaciones anteriores no detectaban: la narración alcanzaba el separador ornamental, el panel del jugador superponía controles auxiliares, el campo dibujaba un segundo rectángulo y las etiquetas/iconos HTML duplicaban los que ya están impresos en la plantilla.

- Se ajustan las cuatro zonas de la pantalla para que el relato termine antes del panel del jugador y mantenga su propio desplazamiento.
- Se reduce el encabezado para que el título y los metadatos quepan sin solaparse.
- El campo de escritura pasa a ser transparente y se desplaza a la zona libre situada a la derecha de la pluma.
- El botón Enviar y los cinco accesos inferiores conservan sus zonas táctiles HTML, pero dejan de dibujar texto, iconos o fondos duplicados sobre los elementos ya impresos en la plantilla.
- Los botones auxiliares del encabezado del jugador quedan visualmente ocultos para no invadir el marco; sus manejadores no se eliminan.
- Se añaden aserciones Playwright para contraste estructural, solapamiento del encabezado, transparencia del campo/botón, duplicación de iconos y desplazamiento narrativo.
- Se inspeccionó el recurso correcto de alta resolución localizado en la Biblioteca: `Interfaz RPG en pergamino antiguo.webp`, 1054 × 1492 px. El recurso actualmente versionado en el repositorio mide solo 400 × 566 px y es una versión reducida. La sustitución binaria por el original de alta resolución queda pendiente; no se ha degradado ni sobrescrito el original de la Biblioteca.
- La ejecución 45023756290 confirmó que la captura se genera y ahora se conserva incluso si falla una aserción posterior. La ejecución falló en una regresión independiente de progresión de metas narrativas; no se presenta como validación visual aprobada.

Respaldos previos de esta tanda: `app/css/style.css.bak-20261122-overlay-alignment`, `.github/workflows/visual-preview.yml.bak-20261122-overlay-alignment` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261122-overlay-alignment`.

**Pendiente:** ejecutar de nuevo Playwright y revisar la captura corregida; incorporar el original WebP de alta resolución al repositorio; validar visual y táctilmente en Chrome Android. No se modifica `app.js`, no se recupera el rótulo «EL GRIMORIO TE RECUERDA», no se toca el almacenamiento ni se modifica `main`.


### Ajuste del área táctil inferior — 22/11/2026

La captura de la revisión visual 45024177228 confirma que el campo de acción y los cinco accesos ya quedan alineados con los marcos dibujados y que no se duplican «Enviar», iconos ni etiquetas. La ejecución detectó además que el texto decorativo «Tu turno · Escribe tu acción» interceptaba el clic automatizado sobre el acceso Mapa. Se desactivan únicamente los eventos de puntero en ese rótulo; los cinco botones mantienen sus áreas táctiles y manejadores. Respaldos: `app/css/style.css.bak-20261122-pointer-hitbox` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261122-pointer-hitbox`.

La misma ejecución sigue sin ser verde porque el clic sobre Mapa expiró por esa intercepción; se debe repetir Playwright después de este ajuste. El fallo anterior de progresión de metas narrativas sigue siendo independiente y no se oculta.


### Corrección del contenedor del rótulo táctil — 22/11/2026

La segunda ejecución visual confirmó que el texto ya no interceptaba el toque, pero el contenedor completo `.player-heading` seguía cubriendo parte de la barra inferior. Se desactivan los eventos de puntero en el contenedor decorativo; los controles reales de la barra conservan sus propios eventos. Respaldos: `app/js/core/save.js` no se modifica; copias previas de CSS y documento: `app/css/style.css.bak-20261122-heading-hitbox` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261122-heading-hitbox`. Pendiente repetir la vista previa para confirmar que Mapa y los demás accesos reciben el toque.


### Separación de capas táctiles del panel del jugador — 22/11/2026

La tercera ejecución confirmó que el propio `.player-panel` seguía interceptando el toque destinado a Mapa, aunque el rótulo ya no lo hacía. El contenedor del panel pasa a ser transparente a los eventos de puntero; solo el formulario, el campo de escritura y Enviar reciben interacción. Así se evita que el marco visual del jugador cubra los cinco accesos inferiores. Respaldos: `app/css/style.css.bak-20261122-player-pointer-events` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261122-player-pointer-events`. Pendiente revalidar en Playwright; no se altera la lógica de guardado ni el texto narrativo.


### Corrección del test de exploración oculto — 22/11/2026

La ejecución 45024700037 confirma que las pruebas de regresión narrativa, migración y aislamiento de partidas pasan hasta el paso visual posterior. El fallo ya no es la barra inferior: Playwright intenta tocar `#openExplore`, que deliberadamente está recortado/oculto para no duplicar controles impresos en la plantilla. El test invoca ese manejador interno mediante `HTMLElement.click()`, sin simular una zona táctil inexistente. Los botones visibles (Historial, Mapa, Inventario, Opciones y Pista) siguen comprobándose mediante clics reales de Playwright. Respaldos: `.github/workflows/visual-preview.yml.bak-20261122-hidden-explore-test` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261122-hidden-explore-test`. Se debe repetir la ejecución; esto no equivale aún a validación táctil en Android.


## Ajuste de la prueba de ciclo de objetivos — 22/11/2026

La ejecución visual #493 generó correctamente la captura móvil y superó la regresión narrativa de apertura, descubrimiento gradual y permanencia de Athun. El fallo restante estaba en el propio escenario de prueba del ciclo de objetivos: el texto narrativo simulado no incluía el motivo ni el nombre del personaje, por lo que el filtro de evidencia —correctamente estricto— rechazaba el cambio. Se ajustó el texto simulado para que contenga literalmente el motivo asociado al cambio. No se ha relajado la validación narrativa ni se han modificado partidas, guardados o reglas del juego. Pendiente comprobar la nueva ejecución automatizada y revisar la captura en Chrome Android real.


### Fixtures narrativos compatibles con validación estricta — 22/11/2026

La ejecución visual #494 agotó el tiempo de espera en la primera acción interactiva, no en el segundo intercambio. La regresión narrativa previa sí pasó. El diagnóstico posterior de la misma espera en #498 mostró que la fixture pedía añadir «Medallón de cobre» al inventario, pero su texto solo decía «encuentras»; el filtro real exige una fórmula de adquisición admitida, como «encuentras y guardas». También faltaban frases explícitas para respaldar una memoria y un cambio de actitud de Elia. Se ajustó únicamente la respuesta simulada de Playwright para incluir esas evidencias. No se modificó ni relajó el filtro del juego.


### Auditoría de resolución del fondo principal — 22/11/2026

Se comprobó el recurso binario que realmente está versionado y referenciado por `app/css/style.css`: `app/assets/athun-plantilla-principal-sin-rosas.webp`. Su cabecera WebP VP8 confirma 400 × 566 píxeles (23.199 bytes), no la resolución 1054 × 1492 del original de alta resolución verificado previamente. Por tanto, la rama todavía contiene la variante reducida y no cumple el requisito de conservar la resolución. No se sustituye por una conversión improvisada ni se declara corregido. La sustitución binaria queda pendiente; antes de cerrarla hay que subir el WebP original y volver a comprobar sus dimensiones desde el propio repositorio. La búsqueda exacta de «el grimorio te recuerda» en `app/js/app.js` y `app/js/game/narrator.js` de esta rama no encontró esa frase.


### Evidencia narrativa de objetivos en la segunda interacción de Playwright — 22/11/2026

En paralelo, se añadió a la fixture de la segunda interacción la frase que vincula explícitamente a Tomás con el motivo de su cambio de objetivo, requisito de `Narrator.filterGoalUpdates()`. La ejecución #498 confirmó que el primer bloqueo estaba antes de llegar a ese segundo intercambio; por eso se corrigió ahora la evidencia de adquisición, memoria y actitud del primer turno. La ejecución nueva tras estos ajustes queda pendiente.


## Integración visual — 22 de noviembre de 2026 (continuación)

- La pantalla de aventura y las pantallas auxiliares pasan a referenciar el papiro universal en `app/assets/athun-papiro-universal.webp`, sin crear paneles de fondo alternativos.
- Se eliminan del HTML generado las dos rosas de los extremos del encabezado; el título y los datos de ubicación/tiempo permanecen.
- Se desactivan las capas CSS que dibujaban un papiro sustituto sobre la plantilla.
- **Comprobación pendiente:** incorporar el archivo binario a esa ruta y verificar el resultado en navegador. No se declara aún aplicado hasta que el recurso exista en el repositorio.


### Ajuste responsivo de las pantallas sobre el papiro — 22/11/2026

- Se refinó la composición CSS para que el fondo vertical se escale proporcionalmente en el documento y no se fuerce a cubrir una altura fija de pantalla en las pantallas auxiliares.
- La pantalla de aventura conserva el fondo transparente de sus zonas de contenido y usa el mismo recurso universal como fondo, sin pseudoelementos decorativos superpuestos.
- Se reforzó el contraste de texto narrativo, metadatos, campo de escritura, botón de envío y herramientas inferiores con tonos de tinta y papel, sin introducir una paleta nueva.
- Se añadieron ajustes para anchos móviles pequeños.
- No se han ejecutado pruebas visuales en Chrome Android. El CSS referencia `app/assets/athun-papiro-universal.webp`, pero el recurso todavía debe incorporarse a GitHub; hasta entonces no puede considerarse validada la apariencia final.


## Corrección de pantallas secundarias sobre el papiro universal — 22/11/2026

- Se sustituyó la referencia CSS antigua de las pantallas secundarias por `app/assets/athun-papiro-universal.webp`.
- Se eliminaron visualmente el fondo opaco, el borde y la sombra del contenedor general de creación/selección, para que el papiro siga visible detrás del contenido.
- Las acciones inferiores mantienen sus controles funcionales, pero su fondo vuelve a ser transparente; los botones usan tinta oscura y tonos de papel.
- Los campos de formulario conservan superficies claras y bordes oscuros para que sigan siendo legibles y utilizables.
- Se actualizó la versión de CSS en `index.html` para evitar estilos antiguos en caché.
- No se modificaron textos, lógica de navegación, almacenamiento, migraciones ni partidas guardadas.

**Validación:** cambios guardados en la rama de trabajo. Falta comprobar las capturas de la vista previa automatizada y revisar el resultado en Chrome Android; no se declara todavía terminada la validación visual.


### Aclaración de uso de las dos plantillas — 22/11/2026

La revisión de la captura móvil confirmó que las plantillas no son intercambiables:

- La pantalla de aventura debe usar `app/assets/athun-plantilla-principal-sin-rosas.webp`, que ya contiene el marco de cabecera, el área narrativa, el campo de acción, Enviar y los cinco accesos inferiores.
- Las pantallas auxiliares (selección, creación, ficha y opciones) usan `app/assets/athun-papiro-universal.webp`, que es el papiro en blanco.
- El CSS ya separa ambas referencias y mantiene transparentes las zonas HTML que coinciden con elementos impresos, para no duplicarlos.
- La versión actualmente versionada de la plantilla principal en GitHub es una miniatura de 400 × 566 px. El original conservado en la Biblioteca mide 1054 × 1492 px y debe sustituirla en la misma ruta antes de cerrar la integración.

**Validación:** la vista previa automatizada confirmó las primeras aserciones de composición y la regresión narrativa de apertura; una prueba posterior de progreso narrativo agotó su espera. La captura generada se inspeccionó y permitió detectar el uso incorrecto de la plantilla en la pantalla de aventura. La revisión con el original de alta resolución y la prueba final en Chrome Android siguen pendientes. No se modifican textos, lógica de juego ni partidas guardadas.


### Limpieza de superposiciones y textos auxiliares — 22/11/2026

- Se oculta el encabezado auxiliar del panel del jugador y el placeholder del campo, porque no forman parte de la plantilla principal impresa.
- El campo de escritura y su zona táctil se alinean con el rectángulo de escritura y el botón Enviar ya dibujados en la plantilla.
- En prólogo, selector, creación y ficha se retiraron subtítulos, rótulos promocionales y pies de página no aprobados. Se conservan el texto de prólogo aprobado, el título del proyecto, los nombres funcionales de secciones, las etiquetas de formulario y las acciones necesarias.
- Se actualizó la versión de caché de JavaScript.

**Vista previa automatizada:** Chromium generó capturas móviles de aventura, prólogo, creación, ficha y selector. Las comprobaciones de uso del papiro en blanco, transparencia del contenedor auxiliar y ausencia de errores JavaScript en esas pantallas pasaron. La ejecución completa continúa fallando más adelante en una espera de una regresión de progreso narrativo ajena a la composición visual; no se declara verde la suite completa. La revisión final con el original principal de 1054 × 1492 px y Chrome Android físico sigue pendiente.


## Rectificación de la plantilla única en blanco — 22/11/2026

Se corrige la interpretación anterior: la imagen que debe utilizarse como fondo de todas las pantallas es exclusivamente `app/assets/athun-papiro-universal.webp`, el papiro vertical completamente en blanco. No se debe utilizar `athun-plantilla-principal-sin-rosas.webp` como fondo de juego ni como guía para añadir marcos, botones, iconos o zonas impresas.

- El fondo universal se mantiene sin dibujos ni elementos de interfaz añadidos.
- Cabecera, ubicación/fecha, narración, campo de escritura, botón Enviar y los cinco accesos inferiores son elementos HTML/CSS independientes, colocados sobre el papiro.
- Se eliminan visualmente los marcos y fondos artificiales que imitaban una plantilla ilustrada.
- El campo, Enviar y los cinco accesos vuelven a ser controles visibles y funcionales; no se ocultan sus etiquetas ni sus iconos.
- Se mantiene la separación funcional de pantallas auxiliares y de aventura, compartiendo el mismo recurso de fondo.
- No se modifican textos narrativos, lógica de juego, partidas guardadas ni migraciones.

La revisión se ha guardado en la rama de trabajo. Queda pendiente comprobar la composición real en Chromium/Chrome móvil; el cambio de CSS por sí solo no se presenta como prueba visual superada.


## Corrección de la composición sobre el papiro universal — 22/11/2026

Se confirma como referencia visual única para todas las pantallas el archivo `app/assets/athun-papiro-universal.webp`, el papiro completamente en blanco. No se utiliza la plantilla ilustrada ni se consideran impresos en el fondo marcos, campos, botones, iconos o accesos.

- La pantalla de aventura construye por HTML/CSS la cabecera, metadatos, narración, campo de escritura, botón Enviar y cinco accesos inferiores.
- El fondo de aventura apunta al papiro universal en blanco.
- Se elimina la posición fija y el estiramiento del fondo de la pantalla de aventura: el contenedor conserva la proporción vertical original 1024 × 1535.
- Se mantienen los controles funcionales existentes y no se cambia la lógica de partidas ni el contenido narrativo.

**Validación pendiente:** comprobar la composición visual y las zonas táctiles en Chromium y Chrome Android. El cambio CSS está guardado en esta rama; no se declara todavía validación visual/táctil superada.


## Regla visual vigente: escritura directa y un solo fondo — 22/11/2026

- La única imagen de fondo autorizada en todas las pantallas es `app/assets/athun-papiro-universal.webp`. No recuperar recursos de plantilla anteriores.
- Los textos de narración y los textos informativos de paneles se dibujan directamente sobre el papiro: sin cajas coloreadas, bordes de contenedor ni sombras de panel. La separación se consigue con márgenes y espaciado.
- Los campos editables, botones y controles mantienen su tratamiento visual propio para que sigan siendo reconocibles y utilizables; esta regla no elimina sus áreas táctiles ni los indicadores de foco.
- En la pantalla de aventura el fondo pertenece al contenedor de aventura. El `body` no debe volver a pintar una segunda copia detrás en escritorio. Las pantallas auxiliares conservan el mismo recurso como fondo común.
- No se modifican textos narrativos, datos de partidas ni reglas de juego por este ajuste visual.

**Comprobaciones:** la suite Playwright del 22/11 confirmó las pantallas auxiliares, la transparencia de los contenedores de texto y las interacciones de navegación/partidas en la ejecución `45079022671`. La captura de escritorio mostró una duplicación del papiro a ambos lados; se añadió una corrección CSS específica y la nueva ejecución `45079242111` debe terminar antes de considerar resuelto ese defecto. La prueba en Chrome Android físico sigue pendiente.


## Revisión de paneles auxiliares — 22/11/2026

- Los paneles de Pista, Historial, Mapa, Inventario y Opciones se abren mediante sus manejadores específicos; las pruebas verifican el título correcto de cada panel. La comprobación específica de Pista terminó correctamente en la ejecución `45079854687`.
- El fondo oscuro de la capa superpuesta y el marco/fondo del panel se han retirado. El contenido informativo queda transparente sobre el papiro; los campos y botones conservan su apariencia funcional.
- En el atlas se mantiene el dibujo esquemático como elemento gráfico, pero se eliminan los fondos, bordes y sombras de las filas y del texto de cierre. Se conservan los botones de exploración como controles interactivos.
- Se añadieron aserciones Playwright para comprobar la transparencia del panel de Pista y de los textos del atlas. Las ejecuciones `45079988713` y `45079991489` están pendientes de resultado; no se declara todavía superada esta última revisión.
- No se han cambiado textos narrativos, contenido del mundo, reglas de juego ni datos de partidas.

## Preparación de prueba completa en navegador — 22/11/2026

- La prueba de cambio de partida desde Opciones se amplió para comprobar dos guardados independientes, selección del segundo personaje y aislamiento de su historial.
- La primera ejecución detectó un error de sintaxis en el propio guion de prueba (nombre de variable duplicado), no un fallo del juego. Se corrigió el identificador y se lanzó una nueva ejecución.
- No se considera validada esta ampliación hasta que la nueva ejecución finalice correctamente.
- Objetivo inmediato: cerrar la validación automatizada de botones y navegación, y facilitar después una prueba visual real en Chrome Android.

## Verificación de cambio de partida desde Opciones — 22/11/2026

- Se ha ampliado la prueba Playwright para crear dos partidas de prueba independientes, abrir «Cambiar de partida» desde Opciones y seleccionar la segunda.
- La prueba comprueba que el selector muestra ambas partidas y que el personaje, el historial y el identificador activo corresponden al guardado elegido.
- Resultado pendiente de la ejecución automática de GitHub Actions.

## Resultado de la comprobación funcional de paneles — 22/11/2026

- La ejecución Playwright `45080250424` terminó con resultado satisfactorio.
- Quedaron verificadas las aperturas de Historial, Inventario y Opciones, la transparencia de sus paneles, la presencia de Athun en el inventario y las acciones de guardar y consultar la ficha.
- La ejecución de pantallas secundarias `45080158187` y la comprobación del atlas `45079991489` también finalizaron correctamente.
- Estas pruebas cubren los recorridos automatizados indicados; no sustituyen una inspección manual en el dispositivo Android.

## Comprobación funcional de paneles y opciones — 22/11/2026

- Se amplió Playwright para verificar que Historial, Inventario y Opciones muestran sus textos sin fondos, bordes ni sombras de tarjeta.
- La prueba comprueba además que Inventario incluye la pertenencia permanente Athun.
- En Opciones se ejercitan los controles «Guardar ahora» y «Consultar mi ficha»: el primero debe confirmar el guardado y el segundo abrir la ficha del protagonista activo.
- La nueva ejecución automatizada queda pendiente de resultado; no se considera validada hasta que termine correctamente.
- No se modifican textos narrativos ni estado de las partidas reales: las pruebas usan datos aislados del navegador de CI.

## Verificación de pantallas secundarias — 22/11/2026

- Se amplió la suite Playwright para comprobar que creación de personaje, ficha y selector de partidas mantienen transparentes los contenedores de contenido sobre el papiro universal.
- La prueba conserva los controles de formulario y botones; solo verifica que los paneles estructurales no incorporen fondos ni sombras de tarjeta.
- Las comprobaciones del atlas y del acceso Pista ya finalizaron correctamente en las ejecuciones `45079991489` y `45079854687`. La nueva ampliación para las tres pantallas secundarias queda pendiente de su ejecución automatizada.
- No se han modificado datos, textos ni reglas de juego.

## Ajuste de altura de la aventura — 22/11/2026

La revisión de la captura móvil mostró que la aventura conservaba la proporción de la imagen como altura del contenedor y dejaba espacio vacío debajo. Se cambió la composición para que el fondo universal se pinte una sola vez en el viewport y la interfaz ocupe toda la altura visible del dispositivo. La pantalla auxiliar sigue utilizando el mismo recurso en su modo correspondiente. La validación automatizada de este último ajuste queda pendiente de la ejecución `Visual preview` del commit `b273809`.
