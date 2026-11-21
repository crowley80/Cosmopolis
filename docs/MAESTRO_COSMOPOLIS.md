# ATHUN: EL GRIMORIO OSCURO — DOCUMENTO MAESTRO

Última actualización: 21 de noviembre de 2026.

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

El nombre oficial del proyecto es «Athun: el grimorio oscuro». «Cosmopolis» se conserva únicamente en la ruta física del repositorio y en referencias históricas que no deban alterarse.

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
      game/
      core/
        save.js
    css/
      style.css
    assets/
      athun-plantilla-principal-sin-rosas.webp
      plantillas/
        athun-papiro-interfaz.webp
      scenes/

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

Existe un sistema de comienzos de aventura y generación narrativa.

### Acciones e historial

Existe el registro de acciones del jugador y sus respuestas narrativas.

### Guardado de partidas

Existe un sistema de guardado y recuperación de partidas. Los cambios visuales no deben modificar ni eliminar esos datos.

## 5. ARCHIVOS PRINCIPALES

- `index.html`: página de entrada.
- `server.js`: servidor local Node.js.
- `app/js/app.js`: lógica principal y navegación.
- `app/js/game/`: sistemas de aventura, sesión, mapa y narración.
- `app/js/core/save.js`: guardado y recuperación.
- `app/css/style.css`: presentación visual.
- `app/assets/`: imágenes y plantillas.

## 6. ESTADO TÉCNICO

No considerar terminada ninguna función sin probarla.

## 7. INTERFAZ Y PLANTILLAS OFICIALES — 21/11/2026

- Nombre oficial: **Athun: el grimorio oscuro**.
- La plantilla principal de pergamino sin rosas está en `app/assets/athun-plantilla-principal-sin-rosas.webp` y se aplica a la pantalla de aventura.
- La plantilla secundaria de papiro está en `app/assets/plantillas/athun-papiro-interfaz.webp` y se aplica como fondo a las pantallas secundarias mediante CSS.
- La lógica de selección de pantalla activa las clases visuales correspondientes; el contenido sigue siendo HTML para conservar accesibilidad y legibilidad.
- La pantalla de Opciones incluye guardado manual, consulta de ficha, cambio de protagonista/partida y regreso a la aventura.
- Los cambios de plantillas son visuales: no modifican ni migran partidas guardadas.
- La integración está en la rama `work/athun-papiro-integracion-segura-20261121`, dentro de la PR #11, todavía sin fusionar.
- CI había superado 65/65 pruebas en una ejecución anterior. La ejecución del commit más reciente debe comprobarse por separado.
- **Pendiente obligatorio:** abrir la versión de esta rama en Chrome Android y verificar visualmente los dos fondos, contraste de narración y metadatos, botones, pantallas secundarias y continuidad de una partida antigua. Las pruebas automatizadas no sustituyen esa comprobación.
- No declarar que la interfaz funciona correctamente hasta completar la prueba real en el teléfono.
