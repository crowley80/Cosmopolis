# COSMOPOLIS — DOCUMENTO MAESTRO

Última actualización: 12 de noviembre de 2026.

## 1. IDENTIDAD DEL PROYECTO

Nombre: Cosmopolis.

Tipo: juego web narrativo e interactivo.

Desarrollo: teléfono Android mediante Termux, Node.js y JavaScript.

Ruta:
~/storage/shared/Download/Cosmopolis

Servidor local:
http://127.0.0.1:8080/index.html

Cosmopolis es una aventura narrativa en la que el jugador crea un
personaje y vive acontecimientos que dependen de su naturaleza,
pasado, capacidades, personalidad y decisiones.

El universo debe ser original, con personajes, lugares e historias
propios.

No cambiar el nombre Cosmopolis sin autorización del usuario.

## 2. ENTORNO DE TRABAJO

Se utilizan dos sesiones de Termux:

- Sesión 1: mantener el servidor funcionando.
- Sesión 2: ejecutar comandos y trabajar con los archivos.

No cerrar ni reiniciar la sesión del servidor innecesariamente.

Comando para iniciar el servidor:

cd ~/storage/shared/Download/Cosmopolis && node server.js

Mensaje esperado:

Cosmópolis disponible en http://127.0.0.1:8080

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


## Retirada definitiva de los cuatro pliegues triangulares — 12 de noviembre de 2026

Se eliminan los cuatro adornos triangulares de las esquinas del pergamino, tras comprobar que no encajan con la estética visual deseada.

- Se retira el bloque CSS `.paper-fold` y sus cuatro variantes.
- Se elimina la regla de posicionamiento específica de esos elementos.
- Se retiran los cuatro elementos HTML generados desde `app/js/app.js`.
- Se actualiza la versión de caché en `index.html` a `20261112-sin-pliegues`.
- Se conservan la textura, el borde quemado, los marcos ornamentales y la paleta del pergamino.

La validación visual en Chrome queda pendiente de confirmación del usuario.


### Primera ejecución real de Qwen3.5-4B en Android — 12 de noviembre de 2026

Se completa satisfactoriamente el primer arranque del narrador local en Termux utilizando el modelo existente `Qwen3.5-4B-Q4_K_M.gguf`.

- Se modifica `scripts/iniciar_ia_local.sh` para incorporar `--reasoning off` en el arranque de llama-server.
- Se crea una copia de seguridad anterior al cambio: `scripts/iniciar_ia_local.sh.bak-20261112-reasoning`.
- Se reinicia el servidor y se comprueba que el modelo termina de cargar.
- El endpoint `http://127.0.0.1:8081/health` responde HTTP 200 con `{"status":"ok"}`.
- El registro confirma `model loaded` y que el servidor escucha en `127.0.0.1:8081`.
- Se realiza la primera petición real a `/v1/chat/completions` con instrucciones narrativas en español.
- Qwen3.5-4B genera una narración coherente en español, sin mostrar bloques de razonamiento interno.
- Rendimiento medido: 57 tokens de entrada, 180 tokens generados, 6,42 tokens por segundo y 31,05 segundos de tiempo total.
- La respuesta termina con `finish_reason: length` porque la prueba limita deliberadamente la generación a 180 tokens. No constituye un error del servidor.

**Resultado:** servidor local operativo y primera generación narrativa real confirmada en Android.

**Pendiente:** probar una respuesta más larga sin el límite de 180 tokens, evaluar la calidad literaria, comprobar la respuesta JSON estructurada que necesita `Narrator` y realizar una prueba completa desde Cosmopolis en el navegador. La integración con la partida y su persistencia todavía no se consideran validadas.



### Primera respuesta JSON estructurada de Qwen3.5-4B — 12 de noviembre de 2026

Se completa satisfactoriamente una petición real al endpoint `/v1/chat/completions` utilizando el mismo esquema JSON que emplea `app/js/game/narrator.js`.

- Se envía el esquema con los siete campos obligatorios: `reply`, `event`, `category`, `location`, `factsToAdd`, `cluesToAdd` y `eliaTrustDelta`.
- Qwen devuelve los siete campos con sus tipos correspondientes y sin texto explicativo fuera del objeto JSON.
- La generación termina con `finish_reason: stop`, sin alcanzar el límite de tokens.
- Rendimiento: 103 tokens de entrada, 231 tokens generados y aproximadamente 6,00 tokens por segundo.
- La ubicación devuelta es `La Taberna del Ciervo`.
- Se detecta un error semántico: el modelo clasifica la entrada en una taberna como `combat`. Aunque respeta el esquema, necesita mejorar la clasificación de acciones.

**Resultado:** primera respuesta estructurada satisfactoria. El modelo demuestra que puede producir el formato de datos que espera el cliente Narrator.

**Pendiente:** validar automáticamente el JSON, comprobar la integración real desde el navegador y mejorar las instrucciones de clasificación. La persistencia y la aplicación de cambios a una partida todavía no están verificadas.


## 13/11/2026 — Validación del flujo narrativo en navegador

- Se amplió el timeout de las peticiones al narrador IA de 90 a 180 segundos en `app/js/game/narrator.js`.
- Se creó la copia de seguridad `app/js/game/narrator.js.bak-20261113-timeout`.
- Prueba en Chrome: se envió la acción «Miro a Elia» y apareció la escena narrativa sin avisos de error.
- Tras recargar la página, la narración seguía visible: persistencia confirmada en esta prueba.
- El servidor local había completado una generación de 87,4 segundos (tarea 777). La generación desde el navegador y la persistencia funcionan, aunque queda pendiente confirmar inequívocamente que la respuesta mostrada procedía de la IA y no del fallback.


## 13/11/2026 — Registro del motor narrativo por acción

- Se añade `aiUsed` al registro persistente de cada acción en `app/js/game/session.js`.
- `true`: respuesta generada por la IA local.
- `false`: respuesta del narrador alternativo.
- `null`: acción antigua o sin información verificable.
- Las acciones anteriores y las partidas existentes no se modifican retrospectivamente.
- Se conserva una copia de seguridad de los archivos modificados.


## 14/11/2026 — Corrección del contexto del agente autónomo

- Se investigan dos rechazos consecutivos de Qwen al abordar la tarea director.
- Se identifica que askQwen() leía únicamente el archivo principal e ignoraba los archivos auxiliares declarados en task.support.
- Se modifica exclusivamente scripts/agente_cosmopolis.js para incorporar los archivos auxiliares como contexto de solo referencia.
- El archivo principal sigue siendo el único autorizado para recibir modificaciones.
- Se conserva la protección NO_SEGURO, la validación de parches, las copias de seguridad y la reversión ante errores.
- Copia de seguridad: scripts/agente_cosmopolis.js.bak-contexto-1794612061508.
- Sintaxis JavaScript comprobada y git diff --check sin errores.

**Resultado:** contexto auxiliar incorporado. Todavía no se ha modificado director.js ni se ha validado una nueva respuesta de Qwen.

**Pendiente:** probar la petición con el contexto completo, adaptar y validar director.js, continuar con narrator.js y realizar la validación narrativa final.

## 14/11/2026 — Optimización del contexto de la tarea Director
- La tarea director recibe un resumen explícito del estado inicial de Adventure y de los contratos existentes de Session, en lugar de enviar ambos archivos auxiliares completos.
- Las demás tareas conservan el envío íntegro de sus archivos auxiliares.
- El archivo modificable sigue siendo exclusivamente el indicado por cada tarea.
- Se mantienen las protecciones de parches, las comprobaciones y las copias de seguridad del agente.
- Copia del agente: scripts/agente_cosmopolis.js.bak-contexto-director-2026-11-13T23-49-58-281Z.
- Copia del historial: docs/MAESTRO_COSMOPOLIS.md.bak-contexto-director-2026-11-13T23-49-58-281Z.
- Sintaxis del agente comprobada con node --check.
**Resultado:** contexto de Director optimizado. Pendiente probar la petición contra Qwen y validar el parche antes de aplicarlo.


## 14/11/2026 — Delimitación de la tarea narrativa de Director
- Se concreta el objetivo para corregir referencias prematuras a Elia y al pozo en las respuestas genéricas.
- Se explicita el estado inicial real de Adventure y los conocimientos disponibles para el jugador.
- Se prohíbe inventar encuentros o descubrimientos y se preservan las acciones explícitas del jugador.
- Se mantienen los contratos existentes y la protección NO_SEGURO; no se modifica todavía director.js.
- Copias previas: scripts/agente_cosmopolis.js.bak-objetivo-director-2026-11-13T23-59-30-017Z y docs/MAESTRO_COSMOPOLIS.md.bak-objetivo-director-2026-11-13T23-59-30-017Z.


## 14/11/2026 — Coherencia entre instrucciones y contexto de Qwen
- Se ajusta la regla de lectura del agente para que exija estudiar el archivo completo y el contexto auxiliar realmente proporcionado.
- Se aclara que Qwen no debe presuponer información de archivos cuyo contenido no haya recibido.
- Se conserva íntegra la protección NO_SEGURO y el resto de las reglas.
- Copias previas: scripts/agente_cosmopolis.js.bak-contexto-real-2026-11-14T00-22-59-771Z y docs/MAESTRO_COSMOPOLIS.md.bak-contexto-real-2026-11-14T00-22-59-771Z.


## 14/11/2026 — Corrección de progresión narrativa en Director
- Se evita que las respuestas genéricas presupongan que el jugador está en la plaza o conoce el pozo.
- Las referencias a Elia en respuestas genéricas quedan condicionadas al conocimiento previo de ella.
- Se eliminan revelaciones anticipadas sobre campanadas, mapas cambiantes y sucesos todavía no descubiertos.
- Se conserva la información de la conversación explícita con Elia.
- La confianza de Elia solo aumenta mediante ofrecimientos cuando el personaje ya la conoce.
- Se mantienen las categorías, los eventos y el contrato de retorno.
- Copias previas: app/js/game/director.js.bak-progresion-2026-11-14T00-32-38-104Z y docs/MAESTRO_COSMOPOLIS.md.bak-progresion-2026-11-14T00-32-38-104Z.
- Pendiente: validación de sintaxis y revisión del diff.


## 14/11/2026 — Declaración del conocimiento de Elia
- Se define `knowsElia` usando el estado del encuentro o los hechos conocidos, evitando referencias a una variable no declarada.
- Copias previas: `app/js/game/director.js.bak-20261114-knows-elia-a` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261114-knows-elia-a`.
- Pendiente: registrar el encuentro explícito y validar las respuestas narrativas.


## 14/11/2026 — Registro del primer encuentro con Elia
- Las dos ramas de diálogo explícito activan `state.eliaMet`, para que las acciones posteriores reconozcan el encuentro.
- Copias previas: `app/js/game/director.js.bak-20261114-registro-encuentro-elia` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261114-registro-encuentro-elia`.
- Pendiente: pruebas de progresión narrativa con el estado inicial.


## 14/11/2026 — Respuestas genéricas neutrales en Director
- El combate ya no presupone que Elia esté presente ni que la acción ocurra en la plaza; el evento usa la ubicación real.
- La magia genérica deja de anticipar el pozo y la presencia de Elia.
- Las preguntas genéricas ya no revelan la campana ni la tormenta.
- Se conservan las respuestas de investigación explícita y diálogo con Elia.
- Copias previas: `app/js/game/director.js.bak-20261114-respuestas-neutrales` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261114-respuestas-neutrales`.
- Pendiente: validación de comportamiento con el estado inicial.


## 14/11/2026 — Progresión del descubrimiento del pozo
- La inspección de los símbolos ya no introduce a Elia si el personaje todavía no la conoce.
- El intento de abrir el pozo sin inspeccionarlo no presupone la presencia de Elia.
- La respuesta genérica al acercarse al pozo evita revelar detalles antes de examinarlos.
- Copias previas: `app/js/game/director.js.bak-20261114-pozo-sin-elia-prematura` y `docs/MAESTRO_COSMOPOLIS.md.bak-20261114-pozo-sin-elia-prematura`.
- Pendiente: pruebas automatizadas de acciones iniciales y conocidas.
