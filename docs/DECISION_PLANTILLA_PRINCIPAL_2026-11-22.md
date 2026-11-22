# Decisión visual: plantilla principal de Athun

Fecha: 22 de noviembre de 2026

## Aprobación

El usuario ha aprobado como nueva referencia visual principal de «Athun: el grimorio oscuro» la plantilla de pergamino vertical presentada en esta conversación el 22/11/2026.

Esta decisión sustituye como referencia visual principal a las maquetas anteriores, sin borrar los archivos históricos ni alterar las plantillas secundarias.

## Rasgos que deben conservarse

- Formato vertical.
- Papel envejecido cálido, con textura y bordes irregulares oscurecidos.
- Cabecera superior con el título «Athun: el grimorio oscuro».
- Recuadro superior para lugar y fecha.
- Dos rosas de los vientos en la cabecera.
- Amplia zona central despejada para el texto narrativo.
- Separador ornamental inferior.
- Botón «Pista» integrado en la zona inferior derecha.
- Ornamentación de las esquinas inferiores.

## Reglas de integración

1. Usar la imagen aprobada como fondo completo de la pantalla principal de aventura.
2. Mantener la proporción original y utilizar ajuste de imagen que no recorte ni deforme la plantilla.
3. Colocar narración, lugar, fecha y controles únicamente en sus zonas correspondientes, sin cubrir los adornos ni inventar paneles, marcos o textos.
4. No redibujar, regenerar, retocar ni sustituir la imagen.
5. No cambiar textos, adornos o distribución sin aprobación expresa del usuario.
6. La plantilla secundaria en blanco sigue siendo independiente y no debe reemplazarse por esta.
7. No modificar ni migrar partidas guardadas como parte de este cambio visual.

## Archivo de referencia

La imagen ya creada en esta conversación está disponible en el entorno de trabajo como:

`/mnt/data/a_parchment_style_fantasy_game_ui_background_vert.png`

Comprobación técnica del archivo: los datos reales son WebP, aunque el nombre termina en `.png`; dimensiones 1025 × 1535 píxeles. Antes de incorporarla al repositorio deberá conservarse la imagen y corregirse la extensión para que coincida con su formato real, sin recomprimirla ni alterar sus dimensiones.

## Estado de implementación

- Decisión visual registrada.
- La imagen todavía no está incorporada al repositorio ni conectada al CSS de la aplicación.
- No declarar la integración terminada hasta que el archivo binario esté guardado en `app/assets/`, el CSS lo utilice y la pantalla se compruebe en Chrome Android.
- No se ha autorizado generar ninguna imagen adicional.


## Auditoría del código de la rama de trabajo

Rama revisada: `work/athun-interfaz-unificada-20261122`.

Comprobaciones realizadas el 22/11/2026:

- `app/css/style.css` contiene al final una regla de integración de papiro que aplica un fondo oscuro con degradados a `.adventure-screen`.
- Esa misma regla desactiva los pseudo-elementos de la pantalla, elimina las rosas de los vientos mediante `.compass { display:none; }` y deja la cabecera sin fondo.
- `app/js/app.js`, en `showAdventure()`, construye el título, un subtítulo independiente, dos rosas de los vientos SVG y los metadatos como HTML separado.
- Por tanto, la pantalla actual todavía está construida con elementos CSS/HTML anteriores y no utiliza la nueva imagen aprobada como fondo.

## Siguiente integración técnica segura

1. Incorporar el archivo binario aprobado en `app/assets/`, con extensión coherente con su formato real (WebP).
2. En la pantalla de aventura, usar la imagen completa como fondo sin recortarla ni deformarla.
3. Retirar de la composición los elementos HTML que duplican el título y las rosas ya impresos en la imagen.
4. Posicionar los datos dinámicos de ubicación y fecha sobre el recuadro previsto, sin duplicar etiquetas ni añadir textos no aprobados.
5. Conservar el área narrativa, el espacio de escritura y los controles funcionales; comprobar que no oculten la ornamentación.
6. Hacer una copia de seguridad antes de tocar CSS o JavaScript y verificar la pantalla en Chrome Android.
7. No alterar el selector de partidas, los datos guardados ni la plantilla secundaria durante esta integración.
