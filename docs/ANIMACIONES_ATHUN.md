# Animaciones de Athun: el grimorio oscuro

## Recursos

- `app/assets/athun-grimorio-animado.gif` — GIF 436 × 390 px, 9 fotogramas, 180 ms por fotograma, bucle continuo. Uso previsto: presentación inicial, debajo del título.
- `app/assets/athun-calavera-animada.webp` — WebP animado transparente 640 × 900 px, 9 fotogramas; ocho fotogramas de 160 ms y un último fotograma de 1500 ms; reproducción de una sola pasada. Uso previsto: ilustración final de la secuencia de muerte.

## Reglas de presentación

1. La animación del grimorio puede mostrarse en la presentación inicial.
2. La calavera no puede mostrarse, precargarse visualmente ni dar pistas antes de que el texto de muerte haya terminado de leerse.
3. La calavera se activa desde el evento real de fin de narración de muerte y permanece en su fotograma final.
4. Mantener el fondo general del papiro universal; la calavera tiene transparencia para superponerse a él.
5. No introducir textos, lemas ni adornos adicionales.

## Estado técnico

Los binarios se han creado y están empaquetados en la Biblioteca de ChatGPT. Su copia a `app/assets/` y su integración en la aplicación siguen pendientes. La rama actual aún no contiene un flujo de muerte explícito ni un evento de finalización de esa narración; no se debe simular mediante detección de palabras o temporizadores.
