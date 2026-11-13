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


## Preparación del motor de mundo vivo — 13 de noviembre de 2026

Se ha preparado una especificación técnica independiente en `docs/ARQUITECTURA_MUNDO_VIVO.md`. Define el modelo de datos del mundo, memoria episódica de NPCs, relaciones direccionales, eventos con causas y consecuencias, reloj lógico, iniciativas autónomas, límites de conocimiento, migración compatible y pruebas de regresión.

La propuesta respeta las decisiones ya aprobadas: mundo congelado al cerrar la partida, avance solo durante la sesión activa, libertad de acciones en texto libre, IA local como narrador/intérprete y estado persistente como fuente de verdad. Se ha planteado una implementación por fases para no rehacer los sistemas existentes.

**Importante sobre la base de trabajo:** el repositorio remoto consultado no contiene todavía el último avance local de `aiUsed` documentado el 13/11. Para evitar sobrescribir cambios del teléfono, esta preparación se ha realizado en la rama aislada `work/arquitectura-mundo-vivo`, partiendo del último estado remoto disponible. No se han modificado archivos de ejecución ni se ha integrado nada en `main`. Antes de integrar, reconciliar la rama con la copia local actualizada de Termux.

Estado: diseño documentado; implementación y pruebas de ejecución pendientes.


## Contratos y plan de pruebas del mundo vivo — 13 de noviembre de 2026

Se añade `docs/PLAN_PRUEBAS_MUNDO_VIVO.md` como complemento ejecutable de la arquitectura: contratos de estado canónico, idempotencia, congelación offline, conocimiento limitado, iniciativas causales y migración no destructiva. Incluye una matriz de pruebas unitarias, integración, cierre/reapertura y calidad narrativa con el modelo local, además de criterios para cerrar cada fase.

No se afirma que estas pruebas estén implementadas ni ejecutadas. Se mantiene la precaución de no integrar código de runtime hasta reconciliar esta rama con la copia vigente de Termux, que contiene avances posteriores al último commit remoto consultado.

Estado: arquitectura y criterios de aceptación documentados; implementación pendiente de sincronización segura.


## Auditoría preliminar de persistencia — 13 de noviembre de 2026

Se añade `docs/AUDITORIA_PERSISTENCIA_REMOTA.md` tras revisar estáticamente `character.js`, `save.js`, `session.js` y `app.js` en la instantánea remota. Se aclara que `Character.create()` no borra toda la partida: `Save.save()` conserva las propiedades superiores, aunque la edición sí reemplaza el objeto completo del personaje. También se identifican la ausencia de idempotencia en `Session.addAction()`, el orden generación→persistencia, la fusión superficial de relaciones y el carácter destructivo de `Save.replace()`.

Los hallazgos son preliminares porque la rama remota no incluye los últimos cambios de Termux. No se modifica runtime ni se afirma que estos hallazgos estén verificados en la copia local actual. La prioridad técnica pasa a ser reconciliar el código vigente y después cubrir edición de personaje, reintentos, relaciones y guardado con pruebas antes de implementar el reloj del mundo.

Estado: auditoría estática remota documentada; verificación local y correcciones pendientes.


## Primer núcleo aislado del mundo vivo — 13 de noviembre de 2026

Se incorporan dos archivos nuevos en la rama de trabajo:

- `app/js/game/world-core.js`: módulo puro y aislado para normalizar el estado del mundo y aplicar un paso lógico identificado por `operationId`. Conserva campos desconocidos, mantiene el reloj lógico independiente del reloj real, evita repetir una operación mientras su ID permanezca en el registro y ordena eventos de forma determinista por tick e ID.
- `scripts/test-world-core.js`: siete pruebas con el ejecutor nativo `node:test`, que cubren migración mínima no destructiva, normalización repetible, avance de un tick, duplicados, IDs vacíos, preservación de relaciones/campos desconocidos y límite del registro.

Se ha revisado el comparador de IDs para que no dependa de la configuración regional del dispositivo. El registro de idempotencia conserva las últimas 500 operaciones; por tanto, antes de integrar en producción habrá que coordinarlo con el historial durable de acciones para que los reintentos antiguos no puedan reaplicarse después de salir de esa ventana.

Importante: este módulo todavía no se carga desde `index.html` ni está conectado a `Session.addAction()`. Es una primera pieza aislada, no cambia el comportamiento de la partida actual. Las pruebas están escritas en el repositorio; la validación realizada en este entorno fue un ensayo Node independiente de la lógica, no una ejecución sobre un checkout completo de la rama ni sobre Termux.

La integración queda bloqueada hasta reconciliar la copia local de Termux, incluido el cambio `aiUsed` del 13/11. No copiar estos archivos sobre la instalación móvil ni activar el módulo todavía.

Estado: primer núcleo y batería inicial de pruebas añadidos en rama aislada; integración y validación en dispositivo pendientes.


## Auditoría del contexto privado del narrador — 13 de noviembre de 2026

La revisión de `Narrator.buildMessages()` añade el hallazgo P-06 a `docs/AUDITORIA_PERSISTENCIA_REMOTA.md`: en la instantánea remota, los spreads `...person` y `...state` pueden enviar al modelo campos internos no previstos para el conocimiento del protagonista. Las instrucciones del prompt no son una barrera de seguridad de datos. La solución prevista es construir vistas explícitas y filtradas para protagonista y NPC, separando verdad del mundo, percepción, recuerdos, rumores y secretos.

Este punto es prioritario para el futuro motor: la IA no debe recibir indiscriminadamente toda la verdad del mundo para después intentar no contarla. No se ha modificado el narrador actual ni se afirma que exista una filtración observada; es un riesgo estático de la versión remota.



## Vistas de conocimiento por actor — 13 de noviembre de 2026

Se ha añadido en la rama aislada `work/arquitectura-mundo-vivo` el módulo puro `app/js/game/knowledge.js` y su batería `scripts/test-knowledge.js`. El módulo mantiene registros de conocimiento ligados a un actor, exige fuente (`perceived`, `communicated` o `inferred`), distingue tipo (`fact`, `rumor`, `belief`, `secret`), limita confianza y permite construir vistas por actor y localización. Los IDs duplicados se rechazan.

La API no recibe el estado canónico del mundo: por diseño, el llamador debe proporcionar exclusivamente entradas autorizadas para el actor. Por tanto, este módulo es una barrera estructural útil, pero no sustituye la obligación de filtrar correctamente en el motor que registre y entregue los datos. Tampoco se ha conectado a `Narrator`, `app.js` ni al guardado actual.

Se añadieron ocho pruebas automatizadas para validación de fuentes, separación entre actores, secretos, rumores, inferencias, idempotencia y filtro de localización. Estado de ejecución: código y pruebas guardados en GitHub; pendiente ejecutarlas en un checkout real de la rama y validar compatibilidad con Node/Termux. No está integrado en la instalación móvil.



## Comunicación selectiva y deducción trazable — 13 de noviembre de 2026

Se amplía el módulo experimental `app/js/game/knowledge.js` con `communicateKnowledge()` y `recordInference()`. La primera transmite únicamente IDs seleccionados de la memoria del emisor al receptor, registra quién comunicó la información y mantiene el carácter de rumor/creencia y su confianza. La segunda exige evidencias que el actor ya conozca y registra la conclusión como creencia inferida con referencias a dichas evidencias.

Se añaden cuatro pruebas para verificar transmisión selectiva, conservación de rumores, rechazo de información no poseída y deducciones con evidencia propia. La batería total queda en doce pruebas escritas. No se conecta aún al motor narrativo ni al guardado; la capa superior deberá decidir qué contenido se comunicó realmente y no transferir automáticamente memorias completas.


## Registro de percepción individual — 13 de noviembre de 2026

Se ha añadido `app/js/game/perception.js` y `scripts/test-perception.js`. El adaptador transforma observaciones explícitamente autorizadas para un actor en recuerdos de fuente `perceived`, con IDs estables por estímulo y observador. No calcula visión ni audición: exige que el motor espacial proporcione `observerIds` después de comprobar alcance, obstáculos, sentidos y circunstancias. Así se evita asumir que todos los personajes conocen todo lo que ocurre en su localización.

Se han escrito cinco pruebas para autorización, rechazo de observaciones no autorizadas, deduplicación y separación de memorias entre actores. El módulo depende de `CosmopolisKnowledge` y permanece aislado, sin carga en la aplicación. Pendiente ejecutar la batería en checkout real y validar el futuro motor espacial.


## Orden de integración y ejecución de pruebas — 13 de noviembre de 2026

Se ha documentado el orden de dependencias previsto: núcleo del mundo, conocimiento, percepción, motor espacial, motor de turno y finalmente narrador filtrado. `perception.js` depende de `CosmopolisKnowledge`, por lo que el módulo de conocimiento debe cargarse antes. No se han añadido etiquetas de carga ni cambios en la aplicación.

Comando preparado para ejecutar las suites desde la raíz del repositorio: `node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js`. Es una instrucción documentada; no se declara ejecutada en el checkout ni en Termux.

## Continuidad técnica — reglas explícitas de percepción (13/11/2026)

Se ha añadido a la rama `work/arquitectura-mundo-vivo` el módulo experimental puro `app/js/game/perception-rules.js`. Resuelve qué actores son elegibles para percibir un estímulo a partir de datos explícitos: misma localización, sentido habilitado, listas opcionales de visibilidad/audibilidad/alcance, ocultación, bloqueo y atención requerida. Produce `observerIds` para el adaptador `perception.js`.

También se ha añadido `scripts/test-perception-rules.js` con diez pruebas escritas para localización, sentidos, autorización visual y auditiva, ocultación, obstáculos, atención, canales desconocidos, determinismo y salida de resolución.

Límites: no calcula geometría, distancia, paredes, línea de visión ni propagación sensorial. Las restricciones físicas deben ser proporcionadas explícitamente por una futura capa de escena. No se han conectado estos módulos al runtime ni se han modificado los archivos activos de Termux.

Documentación ampliada:
- `docs/ARQUITECTURA_MUNDO_VIVO.md`, sección 17.
- `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`, sección 13.

Comando de validación previsto desde la raíz de un checkout actualizado:

```sh
node --test scripts/test-world-core.js scripts/test-knowledge.js scripts/test-perception.js scripts/test-perception-rules.js
```

Las pruebas están escritas, pero no se afirma que se hayan ejecutado en un checkout real ni en el teléfono. La rama remota sigue pendiente de reconciliación con la copia más reciente de Termux antes de cualquier integración.

## Continuidad técnica — flujo perceptivo integrado en pruebas (13/11/2026)

Se ha añadido `scripts/test-perception-pipeline.js`, con tres pruebas que conectan en memoria los módulos `perception-rules.js`, `perception.js` y `knowledge.js`. Comprueban que solo los actores elegibles reciben recuerdos, que una lista de visibilidad puede excluir a alguien presente y que cada canal sensorial produce recuerdos separados por actor.

La batería documentada queda en 37 pruebas escritas: 7 del núcleo del mundo, 12 de conocimiento, 5 del adaptador de percepción, 10 de reglas perceptivas y 3 del flujo conjunto. El comando completo figura en `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`.

No se ha conectado nada a `app.js`, `narrator.js`, `session.js` ni `index.html`. Tampoco se han ejecutado las pruebas en un checkout real o en Termux. Los módulos siguen siendo experimentales y aislados; la reconciliación con la copia móvil continúa siendo requisito previo a la integración.

## Continuidad técnica — agenda de eventos del mundo (13/11/2026)

Se ha añadido `app/js/game/world-scheduler.js`, un scheduler puro y experimental basado exclusivamente en ticks lógicos. Permite programar eventos futuros, cancelar los que sigan pendientes y recoger los vencidos una sola vez. El orden se determina por tick e ID, no por reloj real.

La agenda tiene un máximo de 500 entradas. Al alcanzar el límite, rechaza nuevas altas sin eliminar eventos existentes; al normalizar agendas heredadas que superen la capacidad, conserva los vencimientos más próximos. El scheduler no avanza el mundo ni trabaja en segundo plano: el motor de turnos deberá invocarlo después de un paso válido y persistir el estado resultante. No simula tiempo offline y no está conectado al runtime.

Se añade `scripts/test-world-scheduler.js` con diez pruebas escritas, incluyendo vencimiento, idempotencia de entrega, cancelación, validación y protección frente a pérdida de eventos al alcanzar el límite.

La batería total documentada pasa de 37 a 47 pruebas escritas. El comando de las seis suites está en `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`. Estas pruebas siguen pendientes de ejecución en checkout real y Termux; no se afirma que hayan pasado.

Se han actualizado `docs/ARQUITECTURA_MUNDO_VIVO.md` y `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`. No se ha modificado la aplicación activa ni se ha integrado la rama en `main`.

## Continuidad técnica — selección acotada de iniciativas NPC (13/11/2026)

Se ha añadido `app/js/game/npc-initiative.js`, un módulo puro que selecciona qué NPC pueden proponer una iniciativa en cada tick lógico. Exige una lista explícita de actores elegibles, excluye al jugador, actores no autónomos o fallecidos y personajes sin objetivo activo, y respeta `nextInitiativeTick`. La selección es determinista y usa un cursor rotatorio para repartir oportunidades; por defecto selecciona un NPC por tick y el máximo configurable es cinco.

También incorpora `markInitiative`, que registra el tick de la última iniciativa y el siguiente tick permitido sin mutar el objeto original, y rechaza duplicar una marca en el mismo tick. No genera acciones ni invoca IA; esa responsabilidad sigue en el motor superior.

Se han escrito diez pruebas en `scripts/test-npc-initiative.js`. La batería total documentada pasa de 47 a 57 pruebas. El comando actualizado de las siete suites está en `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`.

Documentación ampliada en `docs/ARQUITECTURA_MUNDO_VIVO.md` y `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`. No se ha conectado el módulo al runtime ni se han modificado archivos activos de Termux. La ejecución real de las pruebas y la reconciliación de la rama con la copia móvil siguen pendientes.

## Continuidad técnica — contexto narrativo individual de NPC (13/11/2026)

Se ha añadido `app/js/game/npc-context.js`, constructor experimental de contexto para un único NPC mediante allowlist. No recibe ni serializa el estado global del mundo ni el objeto completo del personaje. Incluye únicamente identidad y campos autorizados del propio NPC, descripción de escena ya filtrada por el motor y los recuerdos de ese actor obtenidos mediante `CosmopolisKnowledge.buildSceneKnowledge`.

Rechaza identidad incompleta, escena de otra localización o ausencia del módulo de conocimiento. No copia automáticamente secretos internos arbitrarios, pensamientos privados, personajes cercanos ni campos extra del mundo. Los datos de escena deben llegar ya filtrados: el constructor no puede verificar una descripción que el motor le entregue sin garantías.

Se han escrito diez pruebas en `scripts/test-npc-context.js` para allowlist, aislamiento de memoria, límites de localización, ausencia de campos arbitrarios, validación y no mutación de datos. La batería documentada pasa de 57 a 67 pruebas escritas. El comando de las ocho suites figura en `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`.

Se han actualizado arquitectura y plan de pruebas. El módulo sigue aislado: no se ha conectado al narrador ni a la aplicación, y no se han ejecutado las pruebas en checkout real o Termux. La reconciliación con la copia móvil sigue siendo obligatoria antes de integrar.



## Corrección de integridad del scheduler — 13/11/2026

Durante la revisión autónoma del núcleo se detectaron y corrigieron dos fallos en `app/js/game/world-scheduler.js`: un escape literal de salto de línea que podía romper la sintaxis del comparador y la falta del control de capacidad de 500 entradas que ya exigía su suite de pruebas. Ahora `scheduleEvent` rechaza nuevas altas con `reason: "capacity"` sin descartar ni alterar eventos existentes. La prueba correspondiente ya estaba escrita en `scripts/test-world-scheduler.js`.

La corrección se ha guardado en `work/arquitectura-mundo-vivo`. No se afirma ejecución de la suite: sigue pendiente validarla en un checkout real. No se ha modificado Termux ni se ha integrado la rama en `main`.


## Propuestas causales de iniciativa NPC — 13/11/2026

Se incorpora a la rama `work/arquitectura-mundo-vivo` el módulo experimental `app/js/game/npc-proposal.js` y su suite `scripts/test-npc-proposal.js`. El módulo registra propuestas estructuradas como eventos pendientes únicamente si tienen causa explícita, tick actual, actor autorizado y objetivo activo; rechaza duplicados, actores no elegibles, discrepancias de localización y falta de capacidad. Conserva campos desconocidos del mundo y no modifica el objeto de entrada.

Se añaden ocho pruebas escritas. La batería documentada pasa de 67 a 75 pruebas y el comando completo se actualiza en `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`. No se afirma que se hayan ejecutado en checkout real. El módulo no genera narración ni se conecta todavía al runtime.

En la misma sesión se corrigió `world-scheduler.js`: se reparó el comparador con escapes de salto de línea literales y se añadió el control de capacidad que faltaba pese a estar cubierto por una prueba existente. Todo permanece en la rama aislada; no se ha modificado Termux ni integrado en `main`.


## Ciclo de resolución de eventos — 13/11/2026

Se incorpora a `work/arquitectura-mundo-vivo` el módulo experimental `app/js/game/world-event-resolution.js` y su suite `scripts/test-world-event-resolution.js`. El módulo controla transiciones de eventos pendientes a aplicados, cancelados o fallidos; exige operación idempotente, tick válido, resumen y referencias explícitas de efectos cuando el resultado es aplicado. Conserva causalidad y no muta el estado de entrada.

Se añaden nueve pruebas escritas. La batería documentada pasa de 75 a 84 pruebas y se actualiza el comando de ejecución. Importante: el módulo registra el resultado y las referencias de efectos, pero todavía no ejecuta las mutaciones del mundo. No está conectado al runtime ni se han ejecutado las suites en un checkout real. No se ha modificado Termux ni integrado la rama en `main`.


## Plan de integración del runtime — 13/11/2026

Se crea `docs/PLAN_INTEGRACION_MUNDO_VIVO.md` con los puntos de entrada verificados de la instantánea remota y un orden de integración por etapas. Incluye reconciliación obligatoria con Termux, persistencia idempotente, protección de conocimiento, percepción, scheduler, iniciativas, resolución y efectos tipados, además de criterios para la primera partida. Se documentan los riesgos de `Session.addAction` sin operationId, duplicidad de historiales y spreads en `Narrator.buildMessages`.

Es documentación basada en la instantánea de la rama remota, no una modificación del runtime. Se mantiene la precaución de no sobrescribir la copia Termux, que contiene cambios más recientes.


## Integración de propuestas y resolución NPC — 13/11/2026

Se añade `scripts/test-npc-event-lifecycle.js` con cuatro pruebas integradas entre los módulos de propuesta y resolución. Verifica conservación de causalidad, idempotencia de reintentos, irreversibilidad de estados terminales y ausencia de mutaciones implícitas del mundo. La batería documentada pasa de 84 a 88 pruebas escritas; el comando completo queda actualizado en `docs/PLAN_PRUEBAS_MUNDO_VIVO.md`.

Estas pruebas no se han ejecutado en checkout real. Cubren solo el encadenamiento de módulos puros, no el runtime ni la aplicación de efectos de dominio.


## CI para las pruebas del mundo vivo — 13/11/2026

Se crea `.github/workflows/world-tests.yml` en la rama de trabajo. GitHub Actions ejecutará las once suites aisladas con Node.js 22 en pushes a la rama, pull requests a `main` o ejecución manual. El workflow está guardado, pero todavía no se ha verificado un run completado; no se declara que las pruebas hayan pasado.


## Corrección de rotación de iniciativas NPC — 13/11/2026

La revisión del selector encontró un caso de inequidad: el cursor comparaba IDs alfabéticamente aunque los candidatos se ordenan primero por cooldown. Se corrigió para avanzar desde la posición exacta del último actor en la lista determinista y se añadió una prueba de regresión. La batería documentada pasa de 88 a 89 pruebas escritas. El resultado de ejecución sigue pendiente de GitHub Actions.


## Unicidad de eventos en world-core — 13/11/2026

Se corrige una brecha de idempotencia en `world-core.applyStep`: además de deduplicar `operationId`, ahora rechaza IDs de evento ya existentes antes de avanzar el tick. Se añade una prueba de regresión para verificar que la operación rechazada no consume tick ni se registra como procesada. La batería documentada pasa de 89 a 90 pruebas escritas. El workflow CI todavía debe confirmar su ejecución.


## Normalización canónica de IDs de evento — 13/11/2026

En la revisión de `world-core.js` se detectó una discrepancia entre el ID usado para comprobar duplicados y el que podía terminar almacenado: los espacios exteriores se recortaban para comparar, pero el evento podía conservarlos. Se corrigió para comparar IDs existentes tras `trim()` y guardar siempre el identificador canónico. Si el ID del evento está vacío o solo contiene espacios, se usa el `operationId` normalizado.

Se añadieron dos pruebas de regresión a `scripts/test-world-core.js`. La batería documentada pasa de 90 a 92 pruebas escritas. No se afirma ejecución ni CI verde. Los cambios siguen en `work/arquitectura-mundo-vivo`; Termux y el runtime activo no se han modificado.


## Deduplicación compatible con eventos heredados de NPC — 13/11/2026

Se corrigió npc-proposal.js para detectar IDs equivalentes aunque un evento heredado contenga espacios exteriores. La deduplicación compara el identificador existente tras trim(), manteniendo el ID canónico npc-proposal:<id> de las nuevas propuestas. Se añade una prueba de regresión en scripts/test-npc-proposal.js. La batería pasa de 92 a 93 pruebas escritas. Sigue pendiente ejecutar las suites en checkout real o CI; no se ha tocado Termux ni el runtime.


## Compatibilidad de resolución con IDs heredados — 13/11/2026

Se corrigió world-event-resolution.js para localizar eventos comparando IDs tras trim() y normalizar el ID al guardar la transición. Se añadió una prueba que resuelve un evento legado con espacios exteriores. La batería pasa de 93 a 94 pruebas escritas. Los módulos siguen aislados; no se afirma ejecución ni se modifica Termux/runtime.


## Corrección de prueba detectada por CI — 13/11/2026

Se consultó la primera ejecución real de GitHub Actions. De 92 pruebas, 91 pasaron y falló una expectativa contradictoria del scheduler: una prueba esperaba e5 al truncar 505 eventos, mientras la especificación y otra prueba establecen conservar los 500 vencimientos más próximos, e0–e499. Se corrigió únicamente la expectativa de la prueba a e0; no se modificó el scheduler. La nueva ejecución debe confirmar la corrección y también abarcar los casos de IDs heredados añadidos posteriormente.


## Primera ejecución completa de CI — 13/11/2026

GitHub Actions ejecutó las once suites con Node.js 22 sobre el commit 90cd4cf1c630534c44609b193e4adc94a89f0a26. Resultado verificado: **94 pruebas, 94 pasaron, 0 fallaron**. La ejecución detectó antes una expectativa contradictoria en una prueba del scheduler; se corrigió la expectativa obsoleta (de e5 a e0) sin alterar el algoritmo y la nueva ejecución quedó verde. Esto valida los módulos aislados en Ubuntu/Node 22, no la integración en Termux ni el runtime de la aplicación.


## Efectos de dominio tipados — 13/11/2026

Se añaden `app/js/game/world-effects.js` y `scripts/test-world-effects.js`. El módulo aplica solo efectos tipados `fact.add`, `relationship.adjust` y `character.move`, exige un evento causal pendiente, IDs idempotentes, valida ejes y límites de relación, comprueba personajes/localizaciones y conserva referencias de efectos en el evento causal. No acepta rutas arbitrarias ni muta el estado original. Se escriben doce pruebas nuevas; la batería pasa de 94 a 106. Se incorpora la suite al workflow CI. Todo sigue aislado, sin integración en Termux/runtime; el esquema de entidades debe reconciliarse antes de activar el módulo.


## Verificación de efectos antes de cerrar eventos — 13/11/2026

Se endureció world-event-resolution.js: un evento solo puede pasar a applied si cada ID incluido en effectIds aparece previamente en event.appliedEffectIds, registro que crea world-effects.js al aplicar efectos tipados. Se añade una prueba contra referencias inventadas y se amplía la prueba integrada NPC para ejecutar primero fact.add y después resolver el evento. La batería pasa de 106 a 107 pruebas escritas. Pendiente CI para confirmar la nueva cadena; aún no está integrada en Termux/runtime.


## Ajuste de expectativa en el ciclo causal integrado — 13/11/2026

La primera ejecución tras exigir referencias de efectos reales pasó 106 de 107 pruebas. El único fallo era una expectativa antigua del test integrado: comparaba el ID del hecho (`clue-map-fragment`) con el ID del efecto (`effect-clue-map`). La implementación conserva correctamente el ID del efecto en `resolution.effectIds`; se corrige la expectativa de la prueba sin cambiar el código de dominio.


## Límite coherente de efectos por evento — 13/11/2026

Se establece un máximo de 50 efectos por evento causal en world-effects.js, coherente con el límite de referencias de world-event-resolution.js. Al alcanzar la capacidad, una nueva mutación se rechaza antes de modificar el estado. Se añade prueba de regresión; la batería pasa de 107 a 108 pruebas escritas. Pendiente de CI.


## CI verde con efectos tipados — 13/11/2026

La ejecución GitHub Actions del commit 3b0495614d0df6a0462f1c06f25f9d6102a0fbb8 completó las doce suites con Node.js 22: **108 pruebas, 108 pasaron, 0 fallaron**. Incluye el módulo nuevo de efectos tipados, la verificación de referencias reales al resolver eventos y el límite de 50 efectos por evento causal. Validación confirmada en Ubuntu/Node 22; la integración en Termux y en la aplicación sigue pendiente de reconciliación.


## Protección frente a IDs especiales en efectos — 13/11/2026

Se endurece world-effects.js frente a IDs como __proto__ y constructor: las lecturas verifican propiedades propias y las escrituras usan definición explícita de propiedad de datos, evitando setters heredados. Se añade una prueba para movimientos y relaciones con esos identificadores. La batería pasa de 108 a 109 pruebas escritas. Pendiente CI.


## CI verde tras endurecimiento de efectos — 13/11/2026

GitHub Actions completó las doce suites en el commit f3ed516a008c47b0d0c0715144d6c03d2fb2a6e7: **109 pruebas, 109 pasaron, 0 fallaron**. Esta ejecución incluye la validación de referencias de efectos, el límite de 50 efectos por evento y la protección de IDs especiales (`__proto__`, `constructor`). La validación corresponde a módulos aislados en Node.js 22; no certifica integración en Termux.


## Unicidad durable de IDs de efecto — 13/11/2026

Se añade una prueba de recuperación para comprobar que un ID de efecto no puede reutilizarse en otro evento incluso si el registro global processedEffects se ha compactado o perdido: el evento causal conserva appliedEffectIds y actúa como referencia durable. La batería pasa de 109 a 110 pruebas escritas. Pendiente CI.


## CI verde con unicidad durable de efectos — 13/11/2026

GitHub Actions completó las doce suites en el commit 5397518ca02c0ad1989369f0105eb5ddc9d853eb: **110 pruebas, 110 pasaron, 0 fallaron**. La ejecución incluye el caso que demuestra que los IDs de efecto siguen siendo únicos aunque se compacte el registro global, gracias a las referencias guardadas en cada evento causal. Validación en Node.js 22; integración en Termux pendiente.


## Actualización del plan de integración — 13/11/2026

Se sincroniza docs/PLAN_INTEGRACION_MUNDO_VIVO.md con el estado actual: world-effects.js ya existe con tres efectos tipados; world-event-resolution.js exige referencias realmente registradas; el catálogo limita a 50 efectos por evento y tiene pruebas de idempotencia. El inventario se actualiza a diez módulos experimentales, doce suites y 110 pruebas, con CI verde. Se mantiene el bloqueo de integración hasta reconciliar la copia más reciente de Termux.


## Integridad de referencias de efectos y localizaciones — 13/11/2026

Se endurecen dos contratos: fact.add rechaza locationId si no existe en world.locations; y world-event-resolution.js exige que la resolución applied enumere todos los efectos registrados en el evento causal, no solo un subconjunto válido. Se añaden dos pruebas de regresión y se ajusta el test de resolución completa para incluir las tres referencias registradas. La batería asciende a **112 pruebas escritas**. La validación CI queda pendiente.

## Corrección de prueba de referencias completas — 13/11/2026

La ejecución CI de 112 pruebas detectó un único test de normalización que aún enviaba solo dos de los tres efectos registrados en el evento. Se corrige el conjunto de entrada para incluir también fact-2 y seguir verificando la deduplicación/limpieza. No cambia el contrato de producción: la resolución aplicada debe enumerar exactamente todos los efectos existentes. Reejecutar CI.


## Validación profunda de payloads de propuestas NPC — 13/11/2026

Se endurece npc-proposal.js para que el payload estructurado no pueda introducir objetos arbitrarios, ciclos, prototipos especiales ni estructuras desmesuradas en el estado del mundo. La copia admite solo valores JSON-like, arrays y objetos planos, con profundidad máxima 3, 20 elementos/propiedades por contenedor, 100 nodos, cadenas de 500 caracteres y rechazo de claves peligrosas. La copia es profunda y no comparte referencias con la propuesta. Se añaden cuatro pruebas; la batería pasa de 112 a **116 pruebas escritas**. Pendiente CI.


## Causalidad limitada al conocimiento del NPC — 13/11/2026

Se endurece registerNpcProposal: ya no basta con que el modelo proponga un causeId no vacío. El motor debe proporcionar explícitamente knownCauseIdsByActor y la causa debe estar en la lista de conocimiento del actor que inicia la acción. Esto impide que una iniciativa se apoye en rumores, hechos o acciones que ese NPC no conoce. Se añaden dos pruebas y se actualizan las fixtures. La batería asciende a **118 pruebas escritas**. El runtime deberá construir esta allowlist desde la memoria individual del NPC, nunca desde el inventario global de causas.


## Contratos de integración NPC actualizados — 13/11/2026

Se amplía docs/PLAN_INTEGRACION_MUNDO_VIVO.md con dos requisitos de integración: cada propuesta NPC debe demostrar que su causa pertenece al conocimiento individual del actor mediante knownCauseIdsByActor; y los payloads se deben copiar/validar con límites estrictos antes de incorporarlos al estado. La allowlist causal debe derivarse de la memoria privada de cada NPC, no del mundo global.


## CI verde con 118 pruebas y causalidad privada NPC — 13/11/2026

GitHub Actions completó las doce suites en el commit `db91b8bcccfd56c18d61acc5b5c0c3753dbc30a5`: **118 pruebas, 118 pasaron, 0 fallaron** con Node.js 22. Incluye validación profunda de payloads NPC y la nueva condición de que cada iniciativa cite una causa conocida por el actor que la propone. La validación cubre módulos aislados; no acredita todavía integración en la aplicación ni en Termux.


## Límite aritmético del cooldown NPC — 13/11/2026

Se endurece markInitiative para rechazar la suma tick + cooldownTicks cuando deja de ser un entero seguro de JavaScript. Así no se guardan ticks de próxima iniciativa imprecisos por desbordamiento numérico. Se añade una prueba de borde; la batería pasa a **119 pruebas escritas**.


## CI verde con 119 pruebas — 13/11/2026

GitHub Actions completó las doce suites en el commit `e39e93fd8c12dfc646dd2da9ca0d827cefb82d3c`: **119 pruebas, 119 pasaron, 0 fallaron** con Node.js 22. La ejecución incluye el control de desbordamiento aritmético del cooldown de iniciativas NPC. Sigue siendo una validación de módulos aislados, no de la integración en Termux.


## Límites de identificadores en el núcleo del mundo — 13/11/2026

Se establece un máximo de 160 caracteres para operationId, event.id y los IDs heredados de processedOperations. El núcleo rechaza IDs nuevos excesivos sin avanzar el tick y descarta entradas heredadas que exceden el límite. Se añaden dos pruebas; la batería pasa a **121 pruebas escritas**. Pendiente CI.


## CI verde con 121 pruebas — 13/11/2026

GitHub Actions completó las doce suites en el commit `d216f14d62d700a03daefa477f1246d99bb128d6`: **121 pruebas, 121 pasaron, 0 fallaron** con Node.js 22. Incluye límites de 160 caracteres para operationId/event.id y limpieza de identificadores heredados excesivos. Sigue siendo una validación de módulos aislados, no de la integración en Termux.


## Prevención de resurrección de eventos duplicados en la agenda — 13/11/2026

La auditoría del scheduler detectó que normalizeScheduledEvents sobrescribía cada ID repetido con la última copia. Un duplicado heredado pendiente podía sustituir un evento ya disparado o cancelado y hacerlo elegible otra vez. Se corrigió la normalización para conservar el primer registro canónico y permitir únicamente la transición de pendiente a un estado terminal cuando aparece una copia terminal. Los estados terminales nunca retroceden a pendiente. Se añadieron dos pruebas de regresión que cubren ambos órdenes de duplicación y verifican que el evento no vuelve a entregarse. La batería pasa de 121 a **123 pruebas escritas**; CI pendiente. El cambio permanece aislado en work/arquitectura-mundo-vivo y no toca Termux ni main.


## CI verde tras protección de estados terminales del scheduler — 13/11/2026

GitHub Actions completó las doce suites en el commit `8d8588858b3bb05b3ea92af3470b04e4033cd19d`: **123 pruebas, 123 pasaron, 0 fallaron** con Node.js 22. La corrección evita que copias duplicadas pendientes hagan resucitar eventos ya disparados o cancelados. La ejecución valida los módulos aislados en Ubuntu/Node 22; no certifica integración en Termux ni en el runtime principal.


## Límites estrictos de identificadores en el scheduler — 13/11/2026

Se detectó que el scheduler recortaba IDs de agenda a 120 caracteres. Dos IDs distintos con el mismo prefijo podían colisionar y una cancelación con ID excesivo podía dirigirse a otro evento tras el recorte. Ahora se rechazan IDs nuevos excesivos, se descartan IDs heredados fuera del límite y cancelEvent devuelve "invalid-id" sin modificar la agenda. Se exponen los límites en la API y se añaden dos pruebas de regresión. La batería pasa de 123 a **125 pruebas escritas**; CI pendiente. Cambio aislado en la rama experimental, sin tocar Termux ni main.

