# OMRI · Guía de programación

Plataforma educativa en español para estudiantes de secundaria y preparatoria, inspirada en la estructura de USACO Guide. Incluye una entrada desde cero y una introducción a cada uno de los **149 módulos** de su índice público, cotejado el 10 de noviembre de 2026. Es un proyecto educativo independiente, sin afiliación con USACO Guide. No es una convocatoria oficial; los niveles de USACO sirven para organizar el aprendizaje, no representan categorías oficiales de la OMI.

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
| **Total**      |   **169** | **149 módulos de referencia + 20 lecciones originales conservadas** |

Cada módulo nuevo tiene objetivos, prerrequisitos, explicaciones propias en español, un ejemplo trabajado, una pregunta con explicación y un enlace directo a la fuente para profundizar. Las lecciones son introducciones: no constituyen una traducción íntegra de todos los artículos, soluciones y bancos de problemas de USACO Guide. Los módulos sobre procesos de USACO y contribución a su sitio se presentan como recursos opcionales con su contexto original.

La ruta permite buscar sin acentos, filtrar por avance, incluir u ocultar módulos opcionales y desplegar capítulos por etapa. Las especialidades avanzadas se pueden abrir libremente; los prerrequisitos son recomendaciones.

## Funcionamiento

- Panel con estadísticas reales, mapa de actividad, racha y meta semanal.
- 169 lecciones con preguntas de comprensión; ejemplos completos de C++17 en los temas que incluyen código.
- 10 retos originales de razonamiento, 43 casos de entrada/salida, pistas y soluciones.
- Catálogo de 120 módulos de práctica externa, de Bronce a Avanzado, con acceso a la explicación local y a los problemas originales.
- Búsqueda global, apuntes por lección y perfil con meta semanal.
- Laboratorio C++17 con editor, entrada, salida, diagnósticos, cancelación y borradores locales.
- Botón «Probar código» en los ejemplos y editor con plantilla/entrada en cada problema.
- Copia de código y descarga de programas `.cpp`.
- Exportación del progreso como JSON y reinicio con confirmación.
- Diseño adaptable a computadora y móvil; navegación por teclado.

Los retos locales conservan el ejercicio de predecir la **salida que escribe el alumno** y ahora incluyen un editor para compilar y ejecutar C++17. El laboratorio permite experimentar con entrada libre; ejecutar un programa no equivale a que un juez haya aceptado la solución ni marca automáticamente el reto como resuelto. Los problemas externos se resuelven y evalúan en sus propias plataformas; sus enunciados pueden estar en inglés y sus resultados no se sincronizan con el progreso local.

El perfil, los apuntes y el progreso se guardan en `localStorage` con la clave `omi-morelos-progress-v1`. Los identificadores de las 20 lecciones y los 10 problemas originales se conservan. Las rutas anteriores `algoritmos` y `olimpiada` siguen funcionando y llevan a Bronce y Plata. Los borradores de código y entrada se guardan por separado bajo `omi-morelos-cpp-draft-v1:<clave>`; no se borran al reiniciar el progreso de las lecciones. No hay cuentas, backend de alumnos ni sincronización entre dispositivos. Borrar los datos del navegador borra estos avances. El sitio local y el publicado tienen almacenamientos separados; publicar la página no transfiere automáticamente los datos guardados en localhost. Las fuentes, la ilustración y el compilador se sirven desde el propio sitio; los recursos externos requieren internet.

## Compilador en el navegador

Abre [Laboratorio C++](http://127.0.0.1:3000/dashboard#/compilador), escribe los datos para `cin` antes de ejecutar y pulsa **Ejecutar** o Ctrl/⌘ + Enter. También puedes abrir un ejemplo desde **Probar código** y trabajar en la plantilla de cada problema. El editor muestra `stdout`, `stderr`, diagnósticos de Clang y código de salida; permite cancelar, restaurar el ejemplo con confirmación y descargar el borrador.

Clang y LLD están compilados a WebAssembly y funcionan en un Web Worker. El código y los datos de entrada permanecen en el navegador; no se envían a un servicio de compilación. Al usar el laboratorio por primera vez se descargan aproximadamente **19 MB comprimidos**, que ocupan unos **60 MB al descomprimirse**. Se intenta conservar esa descarga en la caché del navegador para usos posteriores; el navegador puede eliminarla. El primer arranque necesita conexión y puede tardar más en equipos o redes lentos. La caché no convierte toda la guía en una aplicación disponible sin conexión.

Requiere un navegador actual con WebAssembly, Web Workers y `DecompressionStream`, como versiones recientes de Chrome, Edge, Firefox o Safari. No necesita `SharedArrayBuffer`, cabeceras especiales de aislamiento ni un servidor de ejecución, por lo que también funciona en GitHub Pages. La velocidad y la memoria disponible dependen del dispositivo del alumno.

Cada programa recibe un sistema de archivos virtual nuevo. El ejecutor no le expone archivos personales, red, variables de entorno del equipo ni las API del navegador. La entrada se entrega completa como UTF-8 y después termina: escribe todos los datos para `cin` antes de ejecutar. No es una terminal interactiva, y un archivo del equipo mencionado mediante `freopen` no está disponible dentro del programa.

Límites: código de 64 KiB, entrada de 32 KiB, salida de 64 KiB por fase, hasta 120 segundos para cargar el compilador, 30 segundos para compilar y 3 segundos para ejecutar. Cancelar o superar el tiempo detiene el Worker. La memoria lineal de WebAssembly está limitada a 256 MiB para cada herramienta de compilación, 64 MiB para el sistema de archivos y 128 MiB para el programa del alumno; **estos límites no son una cota de la RAM total que consume la pestaña**.

El lenguaje es C++17 con libc++; se incluye una cabecera de compatibilidad `bits/stdc++.h` con bibliotecas estándar, pero no extensiones GNU como `__gnu_pbds`. El entorno WebAssembly no reproduce todas las funciones de un sistema operativo ni la arquitectura de un juez de concursos. El laboratorio es para aprender y experimentar; no evalúa automáticamente todas las pruebas de un problema.

### Servicio nativo opcional para desarrollo

Se conserva la API local de Apple Clang en `lib/server/compiler.ts` y `scripts/vite/compiler-plugin.ts`, disponible únicamente con `npm run dev` en macOS con Command Line Tools y `sandbox-exec`. La interfaz utiliza el compilador WebAssembly por defecto también en localhost. La API nativa acepta solo solicitudes locales con comprobación de origen, aísla compilación y ejecución y elimina sus temporales. No se incluye en GitHub Pages y no está diseñada para exponerse como servicio público: no tiene una cota estricta de RAM. Las pruebas nativas se mantienen para verificar este componente de desarrollo.

## Editar

- `lib/curriculum.ts`: punto de entrada del catálogo completo.
- `lib/curriculum/{general,bronze,silver,gold,platinum,advanced}.ts`: lecciones de cada división.
- `lib/curriculum/levels.ts`: etapas y prerrequisitos generales.
- `lib/curriculum/foundations.ts` y `legacy.ts`: contenido previo e integración con las nuevas etapas.
- `lib/curriculum/source-index.ts`: índice de referencia y fecha de cotejo.
- `components/curriculum-browser.tsx`: capítulos, búsqueda y filtros del temario.
- `components/practice-catalog.tsx`: práctica externa por tema.
- `components/learning-app.tsx`: panel, lector, problemas, apuntes y perfil.
- `components/cpp-playground.tsx` y `.css`: editor, borradores y resultados.
- `lib/browser-compiler.ts`: integración del compilador WebAssembly y límites del laboratorio.
- `public/compiler/`: herramientas WebAssembly, ejecutor, manifiesto y licencias.
- `lib/server/compiler.ts` y `scripts/vite/compiler-plugin.ts`: API nativa opcional para desarrollo en macOS.
- `vite.pages.config.ts` y `.github/workflows/pages.yml`: construcción estática y publicación en Pages.
- `lib/progress.ts`: persistencia, actividad, rachas y metas.
- `app/globals.css`: diseño adaptable y estilos.

Tecnologías: React 19, TypeScript, Vite y Lucide. La construcción para Pages es una aplicación estática independiente de la configuración de Vinext/Sites que se conserva para el servidor de desarrollo y la construcción alternativa de Workers. `npm run build:pages` es el comando de publicación en GitHub; `npm run build` genera la alternativa de Workers.

## Verificar

```sh
npm test
npx tsc --noEmit
npm run check:cpp
npm run build
npm run build:pages
```

Las pruebas del compilador nativo cubren ejecución, errores, límites, cancelación, recuperación, origen de solicitudes y aislamiento mediante archivos de prueba desechables. Los casos de integración nativa se omiten en plataformas distintas de macOS; no sustituyen una comprobación del laboratorio WebAssembly en el navegador y en la versión estática.

Las pruebas del temario comprueban la correspondencia exacta de los 149 módulos, identificadores estables, integridad y ciclos de prerrequisitos, enlaces, preguntas y estructura de las lecciones. También cubren almacenamiento ausente o dañado, fechas locales y registro de avances sin duplicados. `check:cpp` requiere `clang++`: valida la sintaxis de cada ejemplo completo en C++17 y compila/ejecuta las 10 soluciones con sus 43 casos.

## Referencias y atribución

El índice curricular se basa en [USACO Guide](https://usaco.guide/), de Competitive Programming Initiative y sus colaboradores. La referencia, la licencia CC BY-NC-SA 4.0 y el inventario utilizado están conservados en `data/reference/`; consulta `data/reference/ATTRIBUTION.md`. El texto local se redactó en español para introducir cada tema y cada módulo enlaza su referencia.

El compilador WebAssembly se basa en [binji/wasm-clang](https://github.com/binji/wasm-clang), con las adaptaciones y la versión de origen documentadas en `public/compiler/NOTICE` y `public/compiler/manifest.json`. Se conservan `public/compiler/LICENSE` y `public/compiler/LICENSE.llvm`; estas licencias de software son independientes de la licencia del material educativo.

El logotipo, la mascota Entrenator y el favicon proceden del [sitio de la Olimpiada Morelense de Informática](https://www.omri.org.mx/). Sus archivos originales, fuentes y condiciones de atribución se documentan en [public/brand/ATTRIBUTION.md](public/brand/ATTRIBUTION.md). La interfaz toma su paleta verde lima y azul oscuro como referencia para integrar estos recursos en la guía.

Fuentes DM Sans y Manrope bajo SIL Open Font License, con licencias en `public/fonts/`. Iconos de Lucide.
