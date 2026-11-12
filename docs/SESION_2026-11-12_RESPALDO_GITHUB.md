# Sesión del 12 de noviembre de 2026 — Primer respaldo en GitHub

## Resultado
Primer respaldo completo de Cosmopolis en GitHub. Subida realizada correctamente.

## Repositorio
- Usuario: crowley80
- Repositorio: Cosmopolis
- URL: https://github.com/crowley80/Cosmopolis
- Visibilidad: privado
- Rama principal: main

## Preparación local
- Git instalado.
- Repositorio inicializado en main.
- Archivo .gitignore creado.
- Remoto origin configurado.
- 59 archivos preparados e incluidos.
- Identidad local de Git configurada.

## Primer commit
- Identificador: 7f36a4e
- Mensaje: Primer respaldo de Cosmopolis

## Autenticación y subida
- GitHub CLI instalado: versión 2.103.3.
- Autenticación completada mediante código de dispositivo.
- gh auth setup-git ejecutado correctamente.
- git push -u origin main completado sin errores.
- 60 objetos enviados al repositorio remoto.
- Rama main creada en GitHub y configurada para seguir origin/main.

## Seguridad
Durante las pruebas se crearon tokens personales de acceso. El usuario confirmó que fueron revocados, incluido el token compartido accidentalmente en la conversación.
No volver a utilizar esos tokens.
GitHub CLI indicó que las credenciales de autenticación se guardaron en texto plano dentro del almacenamiento privado de Termux. No compartir sus archivos de configuración ni ese almacenamiento.

## Estado al terminar la sesión
- Proyecto local conservado.
- Primer respaldo remoto completado.
- Repositorio GitHub operativo.
- No es necesario repetir la inicialización, preparación ni primer commit.

## Próxima sesión
Continuar el desarrollo de Cosmopolis desde el estado actual.
Consultar primero docs/MAESTRO_COSMOPOLIS.md.
No repetir auditorías generales ni pasos ya completados.

## Continuación de la sesión — decisiones de diseño y próximos pasos

### Decisiones confirmadas por el usuario

- Se aprueba la estética de pergamino/papiro antiguo de la maqueta: papel crema envejecido, tinta marrón oscura, detalles de cuero, bronce y oro viejo. Debe conservarse una lectura cómoda en móvil.
- La interfaz seguirá siendo exclusivamente textual, sin imágenes ni ilustraciones.
- Se elimina el panel permanente «Personajes cercanos». Los personajes se presentarán dentro de la narración cuando aparezcan o sean relevantes, mediante sus gestos, palabras, comportamiento y reacciones.
- La narración será el centro de la experiencia y dispondrá del espacio que antes ocupaba ese panel.
- El jugador decidirá cómo relacionarse con los personajes mediante acciones escritas libremente.
- Se podrán ofrecer ayudas opcionales de exploración: observar alrededor, buscar personajes, examinar lugares u objetos, escuchar y preguntar al narrador. Son ayudas, no un catálogo cerrado ni acciones obligatorias.
- El narrador distinguirá entre lo que el personaje percibe, lo que deduce o sospecha y lo que todavía desconoce; no revelará información inaccesible para el personaje.

### Plan acordado para las próximas sesiones

1. Mantener actualizado `docs/MAESTRO_COSMOPOLIS.md` como fuente principal de continuidad. La actualización de diseño y el plan quedan incorporados allí.
2. Rediseñar progresivamente `app/css/style.css` con la identidad de pergamino, sin rehacer la estructura móvil de dos zonas que ya fue validada.
3. Retirar de la interfaz cualquier panel permanente de personajes cercanos y dar prioridad al espacio de narración.
4. Añadir ayudas discretas y opcionales de exploración, integradas con la entrada de acciones libres.
5. Mejorar el motor narrativo para crear escenas naturales, personajes memorables, diálogos, memoria de acontecimientos y consecuencias coherentes.
6. Probar los cambios en el navegador del móvil y corregir cualquier problema antes de considerarlos terminados.

### Criterios de trabajo

- Trabajar de forma incremental y evitar cambios innecesarios en lo que ya funciona.
- No incorporar imágenes ni ilustraciones; construir la identidad visual con CSS y elementos textuales.
- No limitar la libertad de acción del jugador.
- El usuario trabaja desde Android mediante pantalla táctil, sin teclado físico ni Ctrl: dar instrucciones sencillas, paso a paso y con comandos pegables.
- Registrar en futuras sesiones los cambios reales, las pruebas realizadas, las incidencias y el siguiente paso.

