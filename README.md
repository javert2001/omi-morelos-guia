# OMRI · Guía de programación

Guía autodidacta en español para estudiantes de secundaria y preparatoria: **169 lecciones y 340 ejercicios propios integrados**, desde los primeros programas hasta algoritmos avanzados. El temario cubre los **149 módulos** del índice público de USACO Guide, cotejado el 10 de noviembre de 2026, y conserva 20 lecciones de la ruta inicial. Las explicaciones, ejemplos, pistas y soluciones se estudian dentro del sitio; las referencias externas son lecturas opcionales.

Es un proyecto educativo independiente, sin afiliación con USACO Guide. El contenido se redactó originalmente en español sobre el mismo temario; no constituye una traducción íntegra ni una reproducción de artículos y bancos de problemas ajenos. Los niveles de USACO organizan el aprendizaje y no representan categorías oficiales de la OMRI. La guía no sustituye las convocatorias oficiales.

Los alumnos solo necesitan abrir la página en un navegador moderno: pueden leer, escribir C++17 y ejecutar sus programas sin instalar compiladores ni crear una cuenta. El sitio puede alojarse en **GitHub Pages** porque la compilación y la ejecución ocurren en el navegador mediante WebAssembly; GitHub sirve los archivos estáticos.

## Desarrollar en esta computadora

Para modificar el sitio se requiere Node.js 22.13 o posterior y npm. Los alumnos no necesitan estas herramientas. Desde esta carpeta:

```sh
npm install
npm run dev -- --host 127.0.0.1 --port 3000
```

Abre [el panel](http://127.0.0.1:3000/dashboard) o [el temario completo](http://127.0.0.1:3000/dashboard#/ruta). El servidor escucha únicamente en esta computadora. Para detenerlo, usa Ctrl+C en la terminal del servidor. Los cambios se reflejan automáticamente.

## Publicar en GitHub Pages

La configuración de publicación está en `.github/workflows/pages.yml`. En cada cambio a `main`, instala las dependencias, verifica tipos y pruebas, construye el sitio y publica únicamente `dist-pages`. En el repositorio de GitHub, selecciona **Settings → Pages → Build and deployment → Source: GitHub Actions**. La dirección pública aparece en el despliegue y en Settings → Pages cuando este termina correctamente.

Si aún no existe un repositorio remoto, autentícate con [GitHub CLI](https://cli.github.com/) mediante `gh auth login --web --git-protocol https --scopes workflow`. Inicializa y confirma los archivos en un repositorio **dentro de esta carpeta `omi-guia`**; comprueba con `git rev-parse --show-toplevel` que no estás usando un repositorio padre con otros proyectos. Después puedes crearlo y subirlo con:

```sh
gh repo create omi-morelos-guia --public --source . --remote origin --push
```

Habilita Pages como se indica arriba y, si el primer intento ocurrió antes de habilitarlo, vuelve a ejecutar **Publicar OMI Morelos** desde la pestaña Actions. El acceso a GitHub y los permisos para crear el repositorio deben corresponder a la cuenta que publicará la guía; no se necesitan claves de API para el compilador.

Para comprobar la misma versión estática antes de publicarla:

```sh
npm run build:pages
npm run preview:pages
```

Abre la dirección que indique Vite, normalmente `http://127.0.0.1:4173/`. Para simular un sitio de proyecto, ejecuta `PAGES_BASE_PATH=/omi-morelos-guia/ npm run build:pages` y `PAGES_BASE_PATH=/omi-morelos-guia/ npm run preview:pages`; abre `/omi-morelos-guia/`. En GitHub Actions esta base se obtiene automáticamente de la configuración de Pages. Las rutas del temario y del laboratorio usan `#/ruta` y `#/compilador`.

## Temario

| Etapa          | Lecciones | Alcance                                                             |
| -------------- | --------: | ------------------------------------------------------------------- |
| Primeros pasos |         5 | Qué es programar, C++, entrada/salida, variables y primer problema  |
| Fundamentos    |         5 | Condiciones, ciclos, arreglos, cadenas y funciones                  |
| General        |        30 | 29 módulos de referencia y preparación para concursos               |
| Bronce         |        18 | 13 módulos de referencia y 5 lecciones puente                       |
| Plata          |        17 | 14 módulos de referencia y 3 lecciones puente                       |
| Oro            |        30 | 29 módulos de referencia y una introducción a programación dinámica |
| Platino        |        23 | Consultas, árboles, geometría y optimizaciones                      |
| Avanzado       |        41 | Especialidades opcionales: flujos, cadenas, polinomios y más        |
| **Total**      |   **169** | **149 temas del índice de referencia + 20 lecciones iniciales conservadas** |

Cada lección reúne explicaciones en español, ejemplos trabajados, preguntas de comprensión y ejercicios locales con pistas progresivas y soluciones explicadas. Los capítulos de algoritmos desarrollan sus estados o invariantes, justificación, complejidad, límites y errores frecuentes. Los ejercicios de programación incluyen enunciado, formato de entrada y salida, solución completa en C++17 y casos publicados que se pueden comprobar en el navegador. Los temas de orientación y herramientas incluyen actividades de razonamiento o aplicación apropiadas a su contenido.

La lectura principal parte de una situación concreta, sigue con un ejemplo pequeño y explica el procedimiento con párrafos breves. Los encabezados nombran el contenido, sin imponer una plantilla de seis pasos. Las preguntas de comprensión permiten desplegar la respuesta. Los esquemas muestran casillas, estados y tablas. Las animaciones de árboles de segmentos, búsqueda, prefijos, recorridos y otros procesos tienen avance manual, reproducción, pausa y reinicio; nunca arrancan solas y respetan la preferencia de movimiento reducido. Funcionan dentro del sitio, sin reproductores ni imágenes externas. El apartado «Desarrollo técnico» reúne las demostraciones, fórmulas y programas completos, separados por tema para consultarlos cuando hagan falta.

Las referencias se encuentran en un apartado opcional y no son un paso necesario para resolver los ejercicios locales. Los módulos sobre procesos de USACO y contribución a su sitio conservan su contexto y carácter opcional. La cobertura del índice organiza los temas; no implica reproducir cada problema o cada variante del material externo.

La ruta permite buscar sin acentos, filtrar por avance, incluir u ocultar módulos opcionales y desplegar capítulos por etapa. Las especialidades avanzadas se pueden abrir libremente; los prerrequisitos son recomendaciones.

## Criterio editorial

Escribe como si le explicaras el tema a otra persona que está aprendiendo. Usa «tú», frases de longitud variada, verbos activos y vocabulario sencillo. Empieza con un caso cotidiano o un ejemplo pequeño que el lector pueda seguir. A partir de ese caso, explica qué hace el algoritmo, por qué funciona, cuánto cuesta y cuándo deja de servir. Presenta la notación después de explicar qué representa.

Cada párrafo debe desarrollar una idea. Usa encabezados que describan el contenido cuando ayuden a orientarse; evita las plantillas repetidas, las frases motivacionales, el tono corporativo, las muletillas y los guiones largos. Las pistas deben ayudar a dar el siguiente paso y las soluciones deben explicar el razonamiento, no limitarse a repetir el código. Conserva los ejemplos visuales donde aclaren un proceso.

Al editar, revisa la lectura principal, el desarrollo técnico, las preguntas, los diagramas, los enunciados, las pistas y las soluciones. Comprueba el texto final que compone `lib/curriculum.ts`, porque una lección puede reunir contenido de varios archivos. `tests/editorial.test.ts` detecta las expresiones prohibidas de forma explícita; esa prueba no sustituye la revisión de claridad y corrección técnica.

## Funcionamiento

- Panel con siguiente lección, estadísticas reales, racha, meta semanal y accesos por etapa.
- 169 lecciones y 340 ejercicios integrados de razonamiento y programación, con pistas progresivas y soluciones explicadas.
- 10 problemas originales adicionales con práctica de salida esperada, editor C++17 y comprobación de sus casos publicados.
- Catálogo local de práctica por tema, desde Primeros pasos hasta Avanzado, con búsqueda y filtros por etapa.
- Búsqueda global, apuntes por lección y perfil con meta semanal.
- Laboratorio C++17 con editor, entrada, salida, diagnósticos, cancelación y borradores locales.
- Comprobación de casos de programación dentro de cada ejercicio y guardado del razonamiento escrito y su revisión.
- Botón «Probar código» en los ejemplos y editor con plantilla/entrada en cada problema.
- Copia de código y descarga de programas `.cpp`.
- Exportación del perfil, apuntes y progreso como JSON, y reinicio con confirmación; los borradores y respuestas de ejercicios tienen almacenamiento separado.
- Diseño adaptable a computadora y móvil; navegación por teclado.

Los retos locales permiten predecir la **salida que escribe el alumno** y comprobar su programa C++17 contra los casos publicados. Superar todos esos casos registra el reto como resuelto. Los ejercicios de las lecciones también permiten comprobar sus casos y marcar que se comparó el razonamiento con la solución. Ejecutar con entrada libre es una acción distinta: no comprueba el resto de los casos.

La comprobación compara palabras y números de la salida, ignorando diferencias de espacios y saltos de línea; no acepta resultados distintos ni aplica tolerancia numérica. Se detiene ante el primer fallo y muestra entrada, salida esperada, salida obtenida o diagnóstico de ejecución. Superar los casos publicados ayuda a detectar errores, pero no demuestra corrección para todas las entradas válidas ni equivale a la evaluación completa de un juez de concursos. La explicación del algoritmo y sus límites sigue siendo parte del ejercicio. Los recursos externos son opcionales y sus resultados no se sincronizan con la guía.

El almacenamiento local conserva los datos al recargar, siempre que el navegador permita guardarlos:

- `omi-morelos-progress-v1`: perfil, apuntes, lecciones completadas, retos resueltos y actividad.
- `omi-morelos-cpp-draft-v1:<clave>`: código y entrada de cada editor.
- `omi-morelos-exercise-v1:<lección>:<ejercicio>`: razonamiento escrito y marca de revisión de cada ejercicio de lección.

Los identificadores de las 20 lecciones y los 10 problemas originales se conservan. Las rutas anteriores `algoritmos` y `olimpiada` siguen funcionando y llevan a Bronce y Plata. Reiniciar el progreso no elimina las respuestas de ejercicios ni los borradores de código guardados en claves separadas. La descarga de progreso JSON tampoco incluye esas respuestas o borradores; los programas pueden descargarse individualmente como `.cpp`.

No hay cuentas, backend de alumnos ni sincronización entre dispositivos. Borrar los datos del navegador elimina estos avances. El sitio local y el publicado tienen almacenamientos separados; publicar no transfiere automáticamente lo guardado en localhost. Las fuentes, imágenes y herramientas del compilador se sirven desde el propio sitio; los recursos externos requieren internet.

## Compilador en el navegador

Abre [Laboratorio C++](http://127.0.0.1:3000/dashboard#/compilador), escribe los datos para `cin` antes de ejecutar y pulsa **Ejecutar** o Ctrl/⌘ + Enter. También puedes abrir un ejemplo desde **Probar código** y trabajar en la plantilla de cada problema. El editor muestra `stdout`, `stderr`, diagnósticos de Clang y código de salida; permite cancelar, restaurar el ejemplo con confirmación y descargar el borrador.

Clang y LLD están compilados a WebAssembly y funcionan en un Web Worker. El código y los datos de entrada permanecen en el navegador; no se envían a un servicio de compilación. Al usar el laboratorio por primera vez se descargan aproximadamente **19 MB comprimidos**, que ocupan unos **60 MB al descomprimirse**. Se intenta conservar esa descarga en la caché del navegador para usos posteriores; el navegador puede eliminarla. El primer arranque necesita conexión y puede tardar más en equipos o redes lentos. La caché no convierte toda la guía en una aplicación disponible sin conexión.

Requiere un navegador actual con WebAssembly, Web Workers y `DecompressionStream`, como versiones recientes de Chrome, Edge, Firefox o Safari. No necesita `SharedArrayBuffer`, cabeceras especiales de aislamiento ni un servidor de ejecución, por lo que también funciona en GitHub Pages. La velocidad y la memoria disponible dependen del dispositivo del alumno.

Cada programa recibe un sistema de archivos virtual nuevo. El ejecutor no le expone archivos personales, red, variables de entorno del equipo ni las API del navegador. La entrada se entrega completa como UTF-8 y después termina: escribe todos los datos para `cin` antes de ejecutar. No es una terminal interactiva, y un archivo del equipo mencionado mediante `freopen` no está disponible dentro del programa.

Límites: código de 64 KiB, entrada de 32 KiB, salida de 64 KiB por fase, hasta 120 segundos para cargar el compilador, 30 segundos para compilar y 3 segundos para ejecutar. Cancelar o superar el tiempo detiene el Worker. La memoria lineal de WebAssembly está limitada a 256 MiB para cada herramienta de compilación, 64 MiB para el sistema de archivos y 128 MiB para el programa del alumno; **estos límites no son una cota de la RAM total que consume la pestaña**.

El lenguaje es C++17 con libc++; se incluye una cabecera de compatibilidad `bits/stdc++.h` con bibliotecas estándar, pero no extensiones GNU como `__gnu_pbds`. El entorno WebAssembly no reproduce todas las funciones de un sistema operativo ni la arquitectura de un juez de concursos. El laboratorio permite experimentar con entradas propias y comprobar los casos publicados cuando el ejercicio los incluye; no dispone de un banco oculto que certifique todas las entradas posibles.

### Servicio nativo opcional para desarrollo

Se conserva la API local de Apple Clang en `lib/server/compiler.ts` y `scripts/vite/compiler-plugin.ts`, disponible únicamente con `npm run dev` en macOS con Command Line Tools y `sandbox-exec`. La interfaz utiliza el compilador WebAssembly por defecto también en localhost. La API nativa acepta solo solicitudes locales con comprobación de origen, aísla compilación y ejecución y elimina sus temporales. No se incluye en GitHub Pages y no está diseñada para exponerse como servicio público: no tiene una cota estricta de RAM. Las pruebas nativas se mantienen para verificar este componente de desarrollo.

## Editar

- `lib/curriculum.ts`: punto de entrada del catálogo completo.
- `lib/curriculum/{general,bronze,silver,gold,platinum,advanced}.ts`: catálogo base e información de cada división.
- `lib/curriculum/expanded/`: capítulos de estudio y ejercicios locales; sus ampliaciones se integran por identificador estable desde `lib/curriculum.ts`.
- `lib/curriculum/types.ts`: contratos de lecciones, ampliaciones y ejercicios, incluidos soluciones ejecutables y casos de prueba.
- `lib/curriculum/levels.ts`: etapas y prerrequisitos generales.
- `lib/curriculum/foundations.ts` y `legacy.ts`: contenido previo e integración con las nuevas etapas.
- `lib/curriculum/source-index.ts`: índice de referencia y fecha de cotejo.
- `components/curriculum-browser.tsx`: capítulos, búsqueda y filtros del temario.
- `components/practice-catalog.tsx`: catálogo de práctica local por tema.
- `components/lesson-exercises.tsx`: razonamiento escrito, pistas progresivas, soluciones, revisión y editores dentro de las lecciones.
- `lib/exercise-judge.ts`: comprobación secuencial de los casos publicados, comparación de salida por tokens y cancelación.
- `components/learning-app.tsx`: navegación, búsqueda, lector, problemas, apuntes y perfil.
- `components/studio-dashboard.tsx`: inicio, siguiente lección, ruta y resumen de progreso.
- `components/cpp-playground.tsx` y `.css`: editor, borradores y resultados.
- `lib/browser-compiler.ts`: integración del compilador WebAssembly y límites del laboratorio.
- `public/compiler/`: herramientas WebAssembly, ejecutor, manifiesto y licencias.
- `lib/server/compiler.ts` y `scripts/vite/compiler-plugin.ts`: API nativa opcional para desarrollo en macOS.
- `vite.pages.config.ts` y `.github/workflows/pages.yml`: construcción estática y publicación en Pages.
- `lib/progress.ts`: persistencia, actividad, rachas y metas.
- `app/globals.css` y `app/omri-brand.css`: estilos base y recursos de la OMRI.
- `app/studio*.css`: sistema visual actual, panel, catálogo, lector y laboratorio; se cargan después de los estilos base.
- `scripts/validate-curriculum-cpp.mjs`: sintaxis C++17 de ejemplos y ejecución nativa de cada solución con sus casos publicados.
- `scripts/validate-browser-cpp.mjs`: verificación de ejemplos y casos mediante el mismo compilador WebAssembly que usa el navegador.

Tecnologías: React 19, TypeScript, Vite y Lucide. La construcción para Pages es una aplicación estática independiente de la configuración de Vinext/Sites que se conserva para el servidor de desarrollo y la construcción alternativa de Workers. `npm run build:pages` es el comando de publicación en GitHub; `npm run build` genera la alternativa de Workers.

## Verificar

```sh
npm test
npx tsc --noEmit
npm run check:cpp
node --experimental-strip-types scripts/validate-browser-cpp.mjs
npm run build:pages
```

Las pruebas del compilador nativo cubren ejecución, errores, límites, cancelación, recuperación, origen de solicitudes y aislamiento mediante archivos de prueba desechables. Los casos de integración nativa se omiten en plataformas distintas de macOS; no sustituyen una comprobación del laboratorio WebAssembly en el navegador y en la versión estática.

Las pruebas del temario comprueban la correspondencia exacta de los 149 módulos, identificadores estables, integridad y ciclos de prerrequisitos, enlaces, preguntas y estructura de las lecciones y sus ejercicios. También cubren almacenamiento ausente o dañado, fechas locales y registro de avances sin duplicados. Las pruebas de comprobación de ejercicios verifican comparación de salidas, detención ante errores y cancelación.

`check:cpp` requiere `clang++`: valida la sintaxis de cada ejemplo completo y compila y ejecuta cada solución con sus casos publicados, tanto en los retos como en las lecciones. El validador WebAssembly usa `tests/helpers/browser-worker.mjs` para probar el ejecutor real; conserva en el directorio temporal una caché de verificaciones satisfactorias identificadas por contenido, casos y versión del ejecutor. Los cambios de código o resultados esperados requieren una comprobación nueva. Ninguno de estos validadores prueba exhaustivamente todas las entradas posibles: las justificaciones y límites de cada capítulo también deben revisarse.

Para cambios de interfaz, comprueba además la versión estática en el navegador: navegación, lectura en móvil, guardado al recargar, pistas, solución y editor. La construcción alternativa para Workers se puede verificar por separado con `npm run build`.

## Referencias y atribución

El índice curricular se basa en [USACO Guide](https://usaco.guide/), de Competitive Programming Initiative y sus colaboradores. La referencia, la licencia CC BY-NC-SA 4.0 y el inventario utilizado están conservados en `data/reference/`; consulta `data/reference/ATTRIBUTION.md`. Las explicaciones, actividades y soluciones locales son contenido original en español para estudiar cada tema sin depender de la lectura externa. Cada módulo conserva su atribución y enlace de consulta opcional; la guía no reproduce íntegramente los artículos ni bancos de problemas externos.

El compilador WebAssembly se basa en [binji/wasm-clang](https://github.com/binji/wasm-clang), con las adaptaciones y la versión de origen documentadas en `public/compiler/NOTICE` y `public/compiler/manifest.json`. Se conservan `public/compiler/LICENSE` y `public/compiler/LICENSE.llvm`; estas licencias de software son independientes de la licencia del material educativo.

El logotipo, la mascota Entrenator y el favicon proceden del [sitio de la Olimpiada Morelense de Informática](https://www.omri.org.mx/). Sus archivos originales, fuentes y condiciones de atribución se documentan en [public/brand/ATTRIBUTION.md](public/brand/ATTRIBUTION.md). El rediseño conserva estos recursos y usa una paleta cobalto sobre superficies claras. La composición toma como referencias visuales [Wickret, de Cuberto](https://wickret.cuberto.com/) y la navegación y jerarquía de [Linear](https://linear.app/), sin reutilizar sus recursos gráficos ni código. Las animaciones de entrada son breves y respetan el movimiento reducido; los procesos de las lecciones conservan sus controles manuales.

Fuentes DM Sans y Manrope bajo SIL Open Font License, con licencias en `public/fonts/`. Iconos de Lucide.
