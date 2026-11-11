import type { Lesson, LessonSection } from '../types.ts';

function exercise(lesson: Lesson, id: string) {
  const e = lesson.exercises?.find(e => e.id === id);
  if (!e?.code || e.sampleInput === undefined || e.sampleOutput === undefined) throw new Error(`Programa ausente: ${lesson.id}/${id}`);
  return e;
}
function part(lesson: Lesson, id: string, start: string, end?: string) {
  const code = exercise(lesson, id).code!;
  const a = code.indexOf(start), b = end ? code.indexOf(end, a + start.length) : code.length;
  if (a < 0 || b < a) throw new Error(`Fragmento ausente: ${lesson.id}/${id}/${start}`);
  return code.slice(a, b).trim();
}
function runnable(lesson: Lesson, id: string, title: string, body: string, afterCode: string): LessonSection {
  const e = exercise(lesson, id);
  return { title, body, code: e.code, codeInput: e.sampleInput, example: { input: e.sampleInput!, output: e.sampleOutput! }, afterCode };
}
function chapter(sections: LessonSection[]): Partial<Lesson> {
  return { sections, detailedSections: undefined, takeaway: undefined, presentation: 'walkthrough' };
}

export const advancedStringWalkthroughs: Record<string, (lesson: Lesson) => Partial<Lesson>> = {
  'usaco-adv-fft': lesson => chapter([
    {
      title: 'Multiplicar dos listas de coeficientes',
      body: 'Queremos multiplicar A(x)=1+2x por B(x)=3+4x. Distribuir cada término produce 3+4x+6x+8x², que agrupamos como 3+10x+8x². Las listas [1,2] y [3,4] se convierten en [3,10,8].\n\nLa entrada contiene n m y las dos listas, desde el término constante al de mayor grado. n,m ≤ 100 000 y los coeficientes están entre cero y 998244352. Imprimimos los n+m−1 coeficientes del producto, módulo 998244353.\n\nEl coeficiente c[k] reúne todas las parejas i+j=k: c[k]=Σa[i]b[j]. Esa operación se llama convolución. Dos bucles la calculan en O(nm), hasta 10 000 millones de productos. Vamos a cambiar de representación para multiplicar más rápido.',
      code: 'vector<long long> c(n + m - 1);\nfor (int i = 0; i < n; i++)\n    for (int j = 0; j < m; j++)\n        c[i + j] = (c[i + j] + a[i] * b[j]) % MOD;', codeKind: 'fragment',
    },
    {
      title: 'Multiplicar valores es más sencillo que multiplicar coeficientes',
      body: 'Si conocemos A y B evaluados en el mismo punto w, el producto allí es C(w)=A(w)·B(w). No hace falta mezclar posiciones: multiplicamos dos números. Un polinomio de grado menor que N queda determinado por sus valores en N puntos distintos.\n\nLa idea será convertir coeficientes en evaluaciones, multiplicar posición a posición y recuperar los coeficientes. Eso solo ahorra trabajo si ambas conversiones también son rápidas.\n\nElegimos puntos con una relación útil: potencias de una raíz de la unidad. Una raíz de orden N es un número w para el que w^N=1 y ninguna potencia positiva menor da uno. Sus N potencias son distintas. La transformada rápida de Fourier, FFT, aprovecha esa organización.',
    },
    {
      title: 'Separar coeficientes pares e impares',
      body: 'Agrupa A(x)=Apar(x²)+x·Aimpar(x²), donde Apar contiene a0,a2,a4,… y Aimpar contiene a1,a3,a5,… . Por ejemplo, 1+2x+3x²+4x³ se escribe (1+3x²)+x(2+4x²).\n\nSi N es potencia de dos, w^(N/2)=−1. Los puntos w^k y −w^k tienen el mismo cuadrado, así que reutilizan las mismas evaluaciones de Apar y Aimpar. Si estas valen E y O, las dos respuestas son E+w^k·O y E−w^k·O. A esa pareja de operaciones se le llama mariposa.\n\nResolvemos dos transformadas de tamaño N/2 y las combinamos en O(N). La recurrencia T(N)=2T(N/2)+O(N) da O(N log N), en lugar de evaluar cada punto desde cero.',
    },
    {
      title: 'Un ejemplo de evaluaciones y relleno',
      body: 'En números complejos podemos usar 1,i,−1,−i, donde i²=−1. Para A=1+2x las evaluaciones son [3,1+2i,−1,1−2i]; para B=3+4x, [7,3+4i,−1,3−4i]. Multiplicarlas da [21,−5+10i,1,−5−10i]. La transformada inversa recupera [3,10,8,0].\n\nUsamos cuatro posiciones porque necesitamos tres coeficientes y la implementación trabaja con potencias de dos. Completamos con ceros hasta N≥n+m−1.\n\nSin ese espacio, los grados altos vuelven al principio: las evaluaciones no distinguen x^N de uno. Por ejemplo, (1+x+x²)² tiene coeficientes [1,2,3,2,1]. Con tamaño cuatro, el último uno se mezcla con el primero y obtendrías [2,2,3,2].',
      check: { question: '¿Qué tamaño potencia de dos necesita el producto de dos listas de tres coeficientes?', answer: 'Ocho. El resultado tiene cinco coeficientes, por lo que cuatro no alcanza y la siguiente potencia de dos es ocho.' },
    },
    {
      title: 'Hacer las mismas operaciones con residuos exactos',
      body: 'Nuestro problema pide coeficientes módulo P=998244353. Podemos reemplazar los complejos por residuos módulo P y usar una transformada numérica, NTT. Necesitamos que N divida P−1 y una raíz de orden N.\n\nEste primo es 119·2²³+1 y tres es una raíz primitiva: sus potencias generan los residuos no nulos. Para un bloque de longitud len, root=3^((P−1)/len) tiene el orden necesario. Así admite longitudes potencia de dos hasta 2²³.\n\nComo ejemplo pequeño, módulo 17 el número cuatro tiene orden cuatro: sus potencias son 1,4,16,13. Evaluar nuestras listas allí y multiplicar da [4,1,1,6]. La inversa recupera [3,10,8,0], ahora todo con aritmética modular exacta.',
    },
    {
      title: 'Ordenar los índices antes de combinar bloques',
      body: 'La versión recursiva separa pares e impares repetidamente. La versión iterativa reproduce ese orden invirtiendo los bits de cada índice. Con N=8, los índices quedan 0,4,2,6,1,5,3,7: 001 se convierte en 100, por ejemplo.\n\nEl primer bucle de transform hace esa permutación. i recorre los índices normales y j mantiene el índice con bits invertidos. Intercambia solo cuando i<j para no deshacer el mismo cambio después.',
      code: part(lesson, 'convolucion', '    for (int i = 1, j = 0;', '    for (int len = 2;'), codeKind: 'fragment',
      afterCode: 'Después de la permutación, podemos combinar bloques de dos, luego cuatro, luego ocho y así hasta N. Es la misma dependencia de las mitades pequeñas, preparada para usar un único arreglo.',
    },
    {
      title: 'Escribir las mariposas y la transformada inversa',
      body: 'Cada bloque empieza con w=1. u es el valor de su primera mitad y v el de la segunda multiplicado por la potencia actual de la raíz. Guardamos u+v y u−v, y avanzamos w multiplicándolo por root.\n\nPara invertir, usamos la raíz inversa y al final multiplicamos cada entrada por N⁻¹. En este primo, un número no nulo a tiene inverso a^(P−2). Sin la normalización final recuperaríamos N veces los coeficientes.',
      code: part(lesson, 'convolucion', '    for (int len = 2;', '\n}\nvector<long long> multiply'), codeKind: 'fragment',
      afterCode: 'Tras restar añadimos MOD para mantener un residuo no negativo. Los productos se calculan en long long: int no alcanza. La función power del programa completo obtiene potencias modulares mediante cuadrados sucesivos.',
    },
    {
      title: 'Juntar las tres conversiones',
      body: 'multiply elige N, rellena ambas listas con ceros, las transforma y multiplica sus evaluaciones en el mismo índice. Aplica la inversa a ese producto y recorta a n+m−1 coeficientes.\n\nEl producto completo necesita espacio suficiente aunque al final solo quieras algunos coeficientes. Recortar la entrada a una NTT demasiado corta produciría convolución circular antes de que pudieras descartar lo sobrante.',
      code: part(lesson, 'convolucion', 'vector<long long> multiply', 'int main()'), codeKind: 'fragment',
    },
    runnable(lesson, 'convolucion', 'El programa completo de multiplicación', 'La entrada contiene [1,2] y [3,4]. El programa devuelve 3, 10 y 8 módulo el primo indicado. Las rutinas son las mismas que acabamos de separar.', 'Para N la potencia de dos elegida, el costo es O(N log N) y la memoria O(N). Con las longitudes de este problema N≤262144, dentro del límite de raíces disponibles. Comprueba tamaños uno, ceros y un resultado cuya longitud sea una potencia de dos más uno contra el doble bucle.'),
    {
      title: 'Qué resultado recuperas y qué operación estás acelerando',
      body: 'La NTT entrega residuos módulo P, no enteros arbitrariamente grandes. Para reconstruir enteros puedes combinar varios primos mediante el teorema chino del resto, pero su producto debe superar una cota demostrada del resultado. Con valores negativos necesitas margen para distinguir su representación con signo.\n\nLa FFT compleja recupera enteros redondeando; debes controlar el error según longitudes y magnitudes. Elige entre residuos exactos, enteros exactos o aproximaciones antes de seleccionar una implementación.\n\nSi las listas son frecuencias, c[k] cuenta parejas de índices cuya suma es k. Para comparar secuencias desplazadas aparece una correlación: invertir una lista permite convertirla en convolución, pero deriva qué índice corresponde a cada desplazamiento. La FFT ordinaria no calcula mínimos de sumas: min-plus es una operación diferente.',
    },
  ]),
  'usaco-adv-fft-ext': lesson => chapter([
    {
      title: 'Buscar una serie que deshaga una multiplicación',
      body: 'Queremos una lista B que, al multiplicarse por A=1−x, empiece con los coeficientes [1,0,0,0]. B=1+x+x²+x³ sirve porque (1−x)B=1−x⁴. Si descartamos grado cuatro en adelante, solo queda uno.\n\nEscribimos A·B≡1 módulo xⁿ para decir que los primeros n coeficientes coinciden con uno. No estamos evaluando x ni preguntando si una serie converge. Trabajamos formalmente con sus coeficientes.\n\nLa entrada contiene n ≤ 100 000 y n coeficientes de A módulo P=998244353, con a0 distinto de cero. Imprimimos n coeficientes de su inversa B. El programa usará la multiplicación NTT del capítulo anterior como operación ya disponible.',
    },
    {
      title: 'Resolver un coeficiente por vez',
      body: 'El término constante exige a0·b0=1, de modo que b0 es el inverso modular de a0. Para grado k>0, la suma del producto debe ser cero: a0·bk+Σ(i=1…k)ai·b(k−i)=0.\n\nDespejar da bk=−a0⁻¹·Σai·b(k−i). Esa recurrencia obtiene cada coeficiente con los anteriores y cuesta O(n²). Para A=1−x, b0=1 y cada siguiente bk repite b(k−1): todos son uno.\n\nCon A=2+x, aparecen 1/2, −1/4, 1/8. En módulo P esas fracciones significan multiplicar por inversos, no dividir enteros de C++. Si a0=0, el producto constante siempre sería cero y no podría existir esta inversa.',
    },
    {
      title: 'Corregir todos los coeficientes de una mitad de golpe',
      body: 'Supón que B ya es correcta hasta grado m−1. Escribe AB=1−E; el error E empieza en grado m o mayor. Vamos a usar Bnuevo=B(2−AB).\n\nMultiplicar por A da ABnuevo=(1−E)(1+E)=1−E². Como E empieza en grado m, E² empieza en grado 2m. La nueva aproximación es correcta hasta grado 2m−1: duplicamos la precisión.\n\nEsta corrección se conoce como iteración de Newton para la inversa. La demostración usa productos de series y grados del error; no depende de aproximaciones decimales.',
      picture: { caption: 'La corrección para A=1−x.', rows: [
        { label: 'Precisión', values: ['1 término', '2 términos', '4 términos'] },
        { label: 'B', values: ['1', '1+x', '1+x+x²+x³'] },
        { label: 'A·B', values: ['1−x', '1−x²', '1−x⁴'] },
      ] },
    },
    {
      title: 'Seguir las dos primeras correcciones',
      body: 'Empieza B=1. Entonces 2−AB=2−(1−x)=1+x y Bnuevo=1+x. Ya hay dos coeficientes correctos.\n\nAhora AB=(1−x)(1+x)=1−x². La corrección es 1+x². Multiplicarla por B da (1+x)(1+x²)=1+x+x²+x³. Su producto por A es 1−x⁴.\n\nPara un n que no sea potencia de dos, la última ronda conserva solo t=min(2m,n) términos. Los términos de A de grado t o mayor no afectan los coeficientes menores que t porque todas las potencias son no negativas.',
      check: { question: '¿Por qué el segundo paso deja correctos cuatro coeficientes si el anterior solo aseguraba dos?', answer: 'El error anterior empezaba en grado dos. La nueva identidad reemplaza ese error por su cuadrado, que empieza en grado cuatro. Por eso no queda error en grados cero, uno, dos ni tres.' },
    },
    {
      title: 'Traducir la corrección a operaciones sobre vectores',
      body: 'El vector b empieza con a0⁻¹. cut contiene los primeros t coeficientes de A. Calculamos c=cut·b y lo recortamos a t. Después convertimos c en 2−c: su término constante recibe dos menos el valor anterior y los demás cambian de signo.\n\nFinalmente multiplicamos b por esa corrección y conservamos t términos. multiply rellena por dentro hasta una potencia de dos suficiente para su producto completo, como en la lección anterior.',
      code: part(lesson, 'inversa', '    vector<long long>b', "    for(int i=0;i<n;i++){if(i)cout"), codeKind: 'fragment',
      afterCode: 'El fragmento mantiene los nombres y las operaciones del programa. Aunque solo conservemos t términos, no debemos forzar la longitud de la NTT a t: un producto de mayor grado podría envolverse hacia los términos bajos antes del recorte.',
    },
    runnable(lesson, 'inversa', 'El programa completo de inversión', 'La entrada representa A=1−x con cuatro coeficientes. El valor −1 se escribe P−1, es decir, 998244352. La salida 1 1 1 1 es la serie que seguimos a mano.', 'Los tamaños de cada ronda se duplican. Con multiplicación M(n)=O(n log n), sumar el trabajo de todas las rondas sigue dando O(n log n), con O(n) memoria temporal. Verifica multiplicando A por la respuesta y comprobando que sus primeros n coeficientes sean 1,0,…,0. Para n=1 basta el inverso de a0.'),
    {
      title: 'Derivar e integrar coeficientes',
      body: 'Una derivada formal transforma A′[i−1]=i·A[i]. Integrar con constante cero transforma I(A)[i+1]=A[i]/(i+1). Son operaciones de O(n). En módulo P, dividir exige que los denominadores sean invertibles; para los grados que usamos basta n<P.\n\nSi A[0]=1, el logaritmo formal de A tiene constante cero y satisface (log A)′=A′/A. Por tanto, calcula log A integrando A′·inversa(A), con recortes al grado pedido.\n\nPor ejemplo, log(1+x) comienza x−x²/2+x³/3. Esas fracciones se calculan con inversos modulares. A[0]=1 fija la normalización del logaritmo que estamos usando; no la omitas.',
    },
    {
      title: 'Exponenciales y raíces usando correcciones',
      body: 'Para exp(A), exige A[0]=0 y empieza B=1. Queremos log B=A. Si B ya acierta m términos, actualiza Bnuevo=B·(1+A−log B) y recorta a 2m. La corrección lineal cancela el error conocido; los términos de error restantes empiezan al menos en grado 2m.\n\nPara una raíz cuadrada con constante no nula, escoge primero b0 tal que b0²=a0. Después usa Bnuevo=(B+A/B)/2. Necesitas que existan esa raíz y el inverso de dos. Las dos elecciones de b0 pueden conducir a dos raíces distintas.\n\nSi A empieza con ceros y no es la serie cero, su primer grado no nulo debe ser par para tener raíz con grados enteros. Extrae esa potencia de x, resuelve la parte con constante no nula y vuelve a incorporarla. No apliques la fórmula dividiendo por una B de constante cero.',
    },
    {
      title: 'Dividir polinomios revirtiendo sus coeficientes',
      body: 'Para A=BQ+R, con grados n y m≤n, el cociente tiene como máximo n−m+1 coeficientes. Invierte las listas de A y B: sus términos principales pasan a ser constantes. El reverso de B sí tiene constante invertible si su coeficiente principal no es cero.\n\nLos primeros n−m+1 términos de reverso(A)·inversa(reverso(B)) dan el cociente invertido. Revierte ese resultado para obtener Q y calcula R=A−BQ. Debe cumplirse grado(R)<m.\n\nCon A=x²−1 y B=x−1, obtienes Q=x+1 y R=0. La inversión de series resuelve una división de polinomios después de ajustar el orden de coeficientes; no son exactamente la misma operación desde el comienzo.',
    },
    {
      title: 'Evaluar e interpolar con un árbol de productos',
      body: 'Para evaluar A en muchos puntos xi, crea hojas con polinomios x−xi y guarda en cada nodo el producto de sus hijos. Baja por el árbol los residuos de A módulo cada producto. En una hoja, el residuo módulo x−xi es la constante A(xi). Así compartes divisiones entre grupos de puntos.\n\nPara interpolar valores yi en puntos distintos, define P(x)=∏(x−xi) y wi=yi/P′(xi). Los denominadores no son cero porque los puntos son distintos. Coloca wi en las hojas y combina F=Fizq·Pder+Fder·Pizq. En la raíz queda el polinomio buscado.\n\nLa fórmula interpola porque en xi se anulan todos los términos de otras hojas, mientras su propio producto vale P′(xi) y cancela el denominador. Con tamaños comparables, ambas operaciones cuestan O(M(n) log n). El árbol almacena O(n log n) coeficientes si conservas todos sus niveles.',
    },
    {
      title: 'Funciones generadoras y una transformada para XOR',
      body: 'Un objeto de tamaño d que puedes usar cero o una vez se representa por 1+x^d. Si puedes usar cualquier cantidad, usa 1+x^d+x^(2d)+…=1/(1−x^d). Al multiplicar estos factores, el coeficiente de x^s cuenta elecciones de tamaño total s. Los factores para d=1,…,n con uso ilimitado cuentan particiones con esas partes. Comprueba los primeros coeficientes con una mochila.\n\nSi los índices se combinan con XOR en vez de suma, necesitas otra transformada: Walsh–Hadamard. Por cada bit, reemplaza parejas (u,v) por (u+v,u−v). Multiplica las listas transformadas posición a posición. Repetir las mariposas y dividir por la longitud invierte el proceso.\n\nLa normalización exige que dos sea invertible en el módulo. Una NTT ordinaria combina grados por suma; estas mariposas combinan máscaras por XOR. La operación entre índices determina cuál corresponde.',
    },
  ]),
  'usaco-adv-string-search': lesson => chapter([
    {
      title: 'Encontrar un patrón sin repetir todas las comparaciones',
      body: 'Buscamos aba dentro de ababa. Aparece empezando en las posiciones uno y tres, o índices cero y dos si numeramos desde cero. Las apariciones comparten la letra central y ambas cuentan.\n\nNuestro primer programa lee patrón y texto, no vacíos, con letras de a a z y hasta 100 000 letras cada uno. Imprime la cantidad de apariciones, no sus posiciones. Después resolveremos otras dos preguntas: contar palíndromos y buscar varios patrones juntos.\n\nLa búsqueda directa prueba el patrón completo en cada posición. En textos con muchas letras iguales puede repetir casi las mismas comparaciones O(|patrón|·|texto|) veces. KMP conserva la parte de una coincidencia que todavía puede servir después de un fallo.',
    },
    {
      title: 'Qué parte del patrón puede reaprovecharse',
      body: 'Un prefijo comienza en la primera letra; un sufijo termina en la última. Un **borde** es un prefijo propio que también es sufijo. Propio significa más corto que toda la palabra. aba tiene el borde a.\n\npi[i] guarda la longitud del mayor borde del patrón desde el índice cero hasta i. Para aba obtenemos [0,0,1]: a no tiene borde no vacío, ab tampoco y aba tiene a.\n\nAl encontrar aba en ababa, su última a ya coincide con la primera del patrón. Conservamos una letra coincidente para buscar la siguiente aparición en lugar de empezar de cero.',
      picture: { caption: 'La tabla de prefijos del patrón aba.', rows: [
        { label: 'Índice', values: ['0', '1', '2'] },
        { label: 'Letra', values: ['a', 'b', 'a'] },
        { label: 'pi', values: ['0', '0', '1'] },
      ] },
    },
    {
      title: 'Construir la tabla de bordes',
      body: 'Para calcular pi[i], comienza con j=pi[i−1]: el borde más largo que ya conocías. Si la nueva letra no coincide con p[j], prueba el borde de ese borde, pi[j−1]. Repite hasta poder extender una coincidencia o llegar a cero.\n\nNo omitimos candidatos: cualquier borde más corto que todavía pudiera continuar también es borde del mayor. Si las letras coinciden, incrementamos j y guardamos la longitud obtenida.',
      code: part(lesson, 'kmp', '    vector<int> pi(m);', '    int j = 0, answer'), codeKind: 'fragment',
      afterCode: 'j es una longitud. Cuando vale uno, la próxima letra a comparar es p[1], la segunda. pi[j−1] consulta el borde del prefijo que ya coincidía, no el de la letra que acaba de fallar.',
    },
    {
      title: 'Leer el texto manteniendo el mayor prefijo coincidente',
      body: 'Recorremos el texto una sola vez. j indica cuántas letras iniciales del patrón coinciden con el final del texto procesado. Ante un fallo, retrocedemos j por sus bordes sin retroceder el índice del texto.\n\nCuando j alcanza la longitud m, contamos una aparición y volvemos a pi[m−1]. Para aba, eso deja j=1. Las siguientes letras b y a completan la aparición que empieza en el índice dos.',
      code: part(lesson, 'kmp', '    int j = 0, answer', '    cout << answer'), codeKind: 'fragment',
      afterCode: 'Cada letra incrementa j como máximo una vez. Sus descensos totales no pueden superar sus aumentos, así que los while también suman tiempo lineal. Construir pi y recorrer el texto cuesta O(|patrón|+|texto|), con O(|patrón|) memoria.',
      check: { question: 'Después de encontrar aba, ¿por qué conservamos una letra en vez de borrar toda la coincidencia?', answer: 'La última a de aba también es su prefijo propio de longitud uno. Puede ser el comienzo de otra aparición superpuesta, como la que empieza en la posición tres de ababa.' },
    },
    runnable(lesson, 'kmp', 'Programa completo: contar apariciones de un patrón', 'Lee aba ababa e imprime dos. El texto se recorre hacia delante y los retrocesos ocurren únicamente dentro del patrón.', 'Prueba aa en aaaaa: deben salir cuatro apariciones. Un patrón más largo que el texto debe producir cero. El patrón debe ser no vacío porque el algoritmo consulta p[j].'),
    {
      title: 'Otra tabla: cuánto coincide desde cada posición',
      body: 'Z[i] mide cuántas letras coinciden entre el prefijo de s y el fragmento que empieza en i. Usaremos Z[0]=0 por convenio. En aaaaa, Z=[0,4,3,2,1].\n\nMantén una ventana [l,r) que coincide con el prefijo y llega lo más lejos posible. Si i está dentro, la posición i−l del prefijo describe el mismo tramo. Puedes reutilizar min(Z[i−l],r−i) letras; más allá de r debes comparar.\n\nSi las nuevas comparaciones extienden la frontera, guarda l=i y r=i+Z[i]. La frontera derecha solo avanza O(n) veces y hay como máximo una comparación fallida por posición: tiempo O(n).',
      code: 'vector<int> zFunction(const string& s) {\n    int n = s.size();\n    vector<int> z(n);\n    for (int i = 1, l = 0, r = 0; i < n; i++) {\n        if (i < r) z[i] = min(r - i, z[i - l]);\n        while (i + z[i] < n && s[z[i]] == s[i + z[i]]) ++z[i];\n        if (i + z[i] > r) { l = i; r = i + z[i]; }\n    }\n    return z;\n}', codeKind: 'fragment',
      afterCode: 'Para buscar un patrón, calcula Z sobre patrón + separador + texto. El separador debe estar ausente del alfabeto. En las posiciones del texto, un Z al menos igual a la longitud del patrón señala una aparición. KMP y Z responden búsquedas similares con tablas de significado distinto.',
    },
    {
      title: 'Ahora queremos contar intervalos palindrómicos',
      body: 'Un palíndromo se lee igual de izquierda a derecha y al revés. Para abba, las cuatro letras individuales, bb y abba dan seis intervalos palindrómicos. Las dos letras a cuentan como intervalos distintos porque están en posiciones distintas.\n\nEl segundo programa lee una palabra de hasta 100 000 letras de a a z e imprime ese conteo. Expandir desde cada centro es correcto, pero aaaaa… obliga a repetir O(n²) comparaciones.\n\nManacher guarda cuánto se puede expandir desde cada centro y reutiliza la simetría de un palíndromo ya comprobado. Separamos centros sobre letras, para longitudes impares, y centros entre letras, para longitudes pares.',
    },
    {
      title: 'Radios impares y su reflejo',
      body: 'd1[i] cuenta cuántos radios impares son válidos alrededor de i, incluyendo la letra central. Si d1[i]=3, existen palíndromos de longitudes 1, 3 y 5, y el mayor tiene extremos i−2 e i+2.\n\nConserva [l,r], el palíndromo conocido que llega más a la derecha. Si i está dentro, su reflejo es l+r−i. Podemos copiar su radio hasta donde lo permita la frontera r. Después comprobamos las letras nuevas que queden fuera.\n\nEn abacaba, el centro de índice tres tiene radio cuatro y representa c, aca, bacab y abacaba alrededor de ese centro.',
      code: part(lesson, 'manacher', '    for (int i = 0, l = 0, r = -1;', '    for (int i = 0, l = 0, r = -1;'), codeKind: 'fragment',
      afterCode: 'El radio inicial es uno fuera del palíndromo conocido. El min evita afirmar coincidencias más allá del borde comprobado. Cada expansión adicional que alarga r avanza una frontera global; ese es el ahorro que evita repetir todas las comparaciones.',
    },
    {
      title: 'Radios pares y suma de todos los intervalos',
      body: 'Para longitudes pares, el centro está entre i−1 e i. d2[i]=k representa un palíndromo máximo desde i−k hasta i+k−1 y aporta k intervalos de longitudes 2,4,…,2k. Si no coincide ni la pareja central, k=0.\n\nEn abba, d1=[1,1,1,1] y d2=[0,0,2,0]. Las cuatro letras y los dos palíndromos del centro entre las b suman seis.\n\nEl reflejo par es l+r−i+1 y las comparaciones usan i−k−1 e i+k. Son desplazamientos diferentes de los impares; conviene dibujar los dos centros antes de copiar una fórmula.',
      code: 'int k = i > r ? 0 : min(d2[l + r - i + 1], r - i + 1);\nwhile (i - k - 1 >= 0 && i + k < n\n       && s[i - k - 1] == s[i + k]) ++k;\nd2[i] = k;\nans += k;\nif (i + k - 1 > r) { l = i - k; r = i + k - 1; }', codeKind: 'fragment',
      afterCode: 'Cada intervalo tiene un centro y una paridad únicos. Sumar todos los radios cuenta cada aparición una vez. Manacher cuesta O(n) tiempo y memoria; el conteo puede llegar a n(n+1)/2, por lo que ans es long long.',
    },
    runnable(lesson, 'manacher', 'Programa completo: contar palíndromos por posición', 'Lee abba e imprime seis. El programa ejecuta por separado las dos pasadas de radios y suma sus aportaciones.', 'Prueba aaaa: sus diez intervalos no vacíos son palíndromos. No son diez textos distintos: los textos son a, aa, aaa y aaaa. La diferencia entre posiciones y textos determina qué estructura necesitas.'),
    {
      title: 'Guardar un nodo por palíndromo distinto',
      body: 'Si la pregunta pide textos palindrómicos distintos, un eertree guarda uno por nodo. Una transición con letra c envuelve un palíndromo P y representa cPc. Cada nodo tiene un enlace hacia su mayor sufijo palindrómico propio.\n\nAñadimos dos raíces artificiales, de longitudes −1 y cero. last señala el mayor sufijo palindrómico del texto ya leído. Al agregar la letra de la posición pos, seguimos enlaces hasta encontrar un v cuya letra anterior, s[pos−1−len[v]], coincida con la nueva. La raíz de longitud −1 siempre permite formar una letra.\n\nSi la transición de v por esa letra ya existe, usamos su nodo. Si no, creamos uno de longitud len[v]+2. Para longitud uno, el enlace va a la raíz de longitud cero. Para longitudes mayores, buscamos desde link[v] otro palíndromo que pueda envolverse y tomamos su transición.',
      code: '// Raíces: 0 tiene longitud -1; 1 tiene longitud 0.\n// link[0] = 0, link[1] = 0, last empieza en 1.\nint extendible(int v, int pos, const string& s) {\n    while (pos - 1 - len[v] < 0 || s[pos - 1 - len[v]] != s[pos])\n        v = link[v];\n    return v;\n}\n// Para la nueva letra c = s[pos] - \'a\':\nint v = extendible(last, pos, s);\nif (next[v][c] == -1) {\n    int u = crearNodo(len[v] + 2); // Inicializa transiciones a -1.\n    next[v][c] = u;\n    link[u] = len[u] == 1 ? 1 : next[extendible(link[v], pos, s)][c];\n}\nlast = next[v][c];\nocc[last]++;', codeKind: 'fragment',
      afterCode: 'Solo el sufijo palindrómico más largo puede ser nuevo al agregar una letra: sus sufijos palindrómicos más cortos ya aparecen también al principio de él, antes de la nueva posición. Por eso cada letra crea como máximo un nodo y hay O(n) palíndromos distintos. Para frecuencias, empieza contadores en cero, incrementa last y propaga de mayor a menor longitud hacia link. No confundas estos enlaces palindrómicos con los de un autómata de sufijos general.',
    },
    {
      title: 'Buscar un diccionario completo en el mismo texto',
      body: 'Ahora los patrones son he y she, y el texto shehe. she aparece una vez y he dos: total tres. Ejecutar KMP por separado vuelve a leer todo el texto por cada palabra.\n\nEl tercer programa lee q patrones y un texto, todos no vacíos y en a…z. q ≤ 10 000, la suma de longitudes de patrones no supera 100 000 y el texto tampoco. Los patrones repetidos cuentan por cada copia.\n\nUn trie es un árbol que comparte prefijos: cada arista lleva una letra y cada camino desde la raíz describe un prefijo del diccionario. Guardamos count en los nodos donde terminan palabras. Aho–Corasick añade enlaces para conservar sufijos útiles cuando la siguiente letra no puede continuar el camino actual.',
    },
    {
      title: 'Enlaces de fallo y patrones que terminan como sufijos',
      body: 'El enlace de fallo de un nodo apunta al mayor sufijo propio de su palabra que también sea prefijo en el trie. Para she, ese sufijo es he. Cuando llegamos a she debemos contar ambas palabras, no solamente la que termina en ese nodo.\n\nConstruimos enlaces con BFS, por profundidad creciente. Los hijos de la raíz fallan a la raíz. Para una arista por c de v a u, el enlace de u es la transición por c desde el enlace de v. Esa transición ya se conoce porque su origen tiene menor profundidad.\n\nCompletamos transiciones faltantes con las del enlace. En la raíz, las que faltan vuelven a la raíz. Sumamos count[link[v]] en count[v] para incluir todos los patrones que terminan como sufijos.',
      code: part(lesson, 'aho', '    while (!bfs.empty())', '    string text;'), codeKind: 'fragment',
      afterCode: 'El programa inserta antes todas las palabras y prepara los hijos de la raíz en la cola. Si un patrón está repetido, su nodo terminal empieza con un count mayor. La propagación conserva esa multiplicidad.',
    },
    {
      title: 'Recorrer el texto con una transición por letra',
      body: 'v representa el mayor sufijo del texto procesado que todavía es un prefijo del diccionario. Como completamos todas las transiciones, leer una letra solo cambia v y agrega count[v].\n\nAl procesar she, llegamos a un nodo cuya cuenta incluye she y he: sumamos dos. Después de h y e, reconocemos otro he y sumamos uno. Total tres.\n\nPara un alfabeto fijo de 26 letras, la construcción cuesta O(26L), donde L es la suma de longitudes de patrones, y recorrer el texto cuesta O(|texto|). La tabla ocupa O(26L). Contamos apariciones sin enumerarlas una por una.',
      code: part(lesson, 'aho', '    string text;', '    cout << answer'), codeKind: 'fragment',
    },
    runnable(lesson, 'aho', 'Programa completo: contar apariciones del diccionario', 'La entrada contiene he, she y shehe. El programa comparte prefijos, construye enlaces y produce tres.', 'Si necesitas listar posiciones por patrón, usa enlaces de salida o recorridos que cuenten el tamaño de la salida. Copiar todas las listas de patrones a cada nodo puede ocupar memoria cuadrática. Contar y listar no tienen el mismo costo cuando hay muchas coincidencias.'),
    {
      title: 'Elegir la representación según la pregunta',
      body: 'KMP y Z sirven para un patrón. Manacher calcula los radios de palíndromos por posición. El eertree conserva textos palindrómicos distintos y puede propagar sus apariciones. Aho–Corasick comparte el trabajo de buscar un diccionario.\n\nComprueba textos cortos contra la búsqueda directa. Para palíndromos, enumera intervalos y compara sus extremos; si piden textos distintos, guárdalos en un conjunto antes de contar. Incluye aaaa, palabras repetidas en el diccionario y patrones contenidos en otros.\n\nTodos nuestros programas usan letras de a a z, con una posición por carácter. Un string de C++ guarda bytes; tratar texto UTF-8 general como si cada byte fuera una letra cambiaría el problema y el alfabeto.',
    },
  ]),
  'usaco-adv-suffix-array': lesson => chapter([
    {
      title: 'Contar subcadenas sin guardar todas sus copias',
      body: 'Queremos contar las subcadenas distintas de banana. Un intervalo como ana aparece en dos lugares, pero su texto debe contarse una sola vez. La entrada es una palabra de una a 20 000 letras de a a z y la salida es la cantidad de textos no vacíos distintos. Para banana será quince.\n\nEnumerar los n(n+1)/2 intervalos y copiarlos a un conjunto sirve en ejemplos pequeños, pero puede copiar O(n³) letras. En lugar de copiar cada subcadena, ordenaremos los sufijos: los fragmentos que van desde una posición hasta el final.\n\nToda subcadena que empieza en i es un prefijo del sufijo i. Ordenar los sufijos agrupa juntos los que comparten comienzo y nos permite reconocer qué prefijos ya habíamos contado.',
    },
    {
      title: 'Separar la posición en el texto de la posición ordenada',
      body: 'Usamos índices desde cero. Los sufijos de banana ordenados como en un diccionario son a, ana, anana, banana, na y nana. Comienzan en [5,3,1,0,4,2]. Esa lista de índices es el arreglo de sufijos, SA.\n\nNo guardamos copias de las palabras completas. SA[r] dice dónde empieza el sufijo del lugar r. Su inversa rank[i] dice qué lugar ocupa el sufijo que empieza en i.\n\nEn el ejemplo, rank=[3,2,5,1,4,0]. El sufijo que empieza en uno, anana, ocupa el lugar dos; su vecino anterior empieza en SA[1]=3.',
      picture: { caption: 'Orden de los sufijos y coincidencia con el anterior.', rows: [
        { label: 'SA', values: ['5', '3', '1', '0', '4', '2'] },
        { label: 'Sufijo', values: ['a', 'ana', 'anana', 'banana', 'na', 'nana'] },
        { label: 'LCP', values: ['0', '1', '3', '0', '0', '2'] },
      ] },
    },
    {
      title: 'Comparar bloques mediante números de rango',
      body: 'Comparar dos sufijos completos dentro de sort podría volver a recorrer muchas letras. Empezamos con un rango por letra. Si ya sabemos ordenar bloques de longitud k, un bloque de longitud 2k queda descrito por dos rangos: el de su primera mitad y el de la segunda.\n\nOrdena índices por (rank[i],rank[i+k]). Si la segunda mitad sale del texto, usa −1, menor que cualquier rango: un sufijo que termina antes queda primero cuando su comienzo coincide.\n\nDespués asigna rangos nuevos. Pares iguales reciben el mismo; al cambiar el par, aumenta el rango. Guarda estos rangos en otro arreglo para no modificar los valores que las comparaciones todavía usan.',
      code: part(lesson, 'distintas-sa', '    for (int k = 1;', '    for (int i = 0; i < n; i++)\n        rank[sa[i]]'), codeKind: 'fragment',
      afterCode: 'En banana, los bloques de dos letras dejan empatados los comienzos de ana y anana. Una ronda de cuatro letras distingue ana seguido del final de anan. Duplicamos k en cada ronda y podemos parar cuando todos los rangos sean distintos.',
    },
    {
      title: 'Cuánto comienzo comparte cada vecino',
      body: 'LCP[r] es la longitud del prefijo común entre los sufijos SA[r−1] y SA[r]. Para el primero usamos cero. En banana, a y ana comparten una letra; ana y anana comparten tres; na y nana comparten dos. La tabla es [0,1,3,0,0,2].\n\nComparar cada pareja desde cero podría costar O(n²) con muchas letras iguales. Kasai calcula todos los LCP recorriendo posiciones del texto y reutilizando una parte de la coincidencia anterior.\n\nSi dos sufijos coinciden en h letras, quitar su primera letra deja al menos h−1 coincidencias. El vecino del siguiente sufijo puede cambiar, pero los que comparten ese prefijo quedan juntos en el orden, así que su nuevo predecesor no empeora esa cota.',
    },
    {
      title: 'Extender solo lo que todavía no conocemos',
      body: 'Recorre i en el orden original. Si rank[i]=0, ese sufijo no tiene predecesor y reiniciamos h=0. Si no, toma j=SA[rank[i]−1] y compara desde i+h y j+h, aumentando h mientras coincidan.\n\nEl valor obtenido es su LCP. Después reduce h en uno, si es positivo, para aprovecharlo en la siguiente posición del texto. El programa resta cada LCP directamente del conteo; si necesitaras otras consultas, también podrías guardarlo en un arreglo.',
      code: part(lesson, 'distintas-sa', '    int h = 0;', '    cout << ans'), codeKind: 'fragment',
      afterCode: 'h solo disminuye como máximo uno entre iteraciones, además del reinicio del caso sin predecesor. Las extensiones acumuladas son O(n); Kasai cuesta tiempo lineal. La tabla SA usa O(n log²n) con el sort de esta implementación; counting sort por rangos puede reducirla a O(n log n).',
    },
    {
      title: 'Descontar prefijos que ya aparecieron',
      body: 'El sufijo SA[r] tiene n−SA[r] prefijos no vacíos. Sus primeros LCP[r] ya aparecieron en el vecino anterior. Ningún sufijo anterior puede compartir un comienzo más largo sin que también lo comparta ese vecino: los sufijos que comienzan igual forman un bloque.\n\nPor eso su aporte nuevo es n−SA[r]−LCP[r]. Sumando longitudes de todos los sufijos obtenemos n(n+1)/2 y restamos ΣLCP.\n\nPara banana hay 21 intervalos por posición y la suma de LCP es 1+3+2=6. Quedan quince textos distintos. Para aaaa son diez intervalos menos 1+2+3=6: quedan a, aa, aaa y aaaa.',
      check: { question: '¿Por qué no restamos todos los LCP con todos los sufijos anteriores?', answer: 'Porque repetiríamos descuentos. El vecino anterior ya tiene el mayor comienzo compartido con cualquier sufijo anterior; sus LCP[r] primeros prefijos son exactamente los que no son nuevos.' },
    },
    runnable(lesson, 'distintas-sa', 'El programa completo de SA y LCP', 'Lee banana e imprime quince. Primero ordena los sufijos por duplicación y luego resta los prefijos repetidos usando Kasai. No copia los sufijos completos.', 'El tiempo es O(n log²n) con esta construcción y la memoria O(n). La respuesta usa long long porque puede ser cuadrática. Prueba una letra, todas las letras iguales y todas distintas. En textos cortos, contrasta SA con ordenar sufijos completos y el resultado con un conjunto de subcadenas.'),
    {
      title: 'Buscar patrones y comparar dos sufijos',
      body: 'Los sufijos que empiezan con un patrón ocupan un intervalo consecutivo de SA. Dos búsquedas binarias localizan el primer sufijo cuyo prefijo no es menor y el primero cuyo prefijo es mayor. Compara hasta la longitud del patrón; un sufijo que termina antes es menor. La diferencia de extremos cuenta apariciones.\n\nCada comparación puede revisar |patrón| letras, así que esa búsqueda cuesta O(|patrón| log n). No confundas el orden de las coincidencias en SA con sus posiciones en el texto.\n\nEl prefijo común de dos sufijos con rangos a<b es min(LCP[a+1],…,LCP[b]). Todos los sufijos intermedios comparten precisamente el comienzo que sobrevive a todas esas fronteras. Una estructura de mínimos por rango permite responder esas consultas sin comparar letras otra vez.',
    },
    {
      title: 'Separadores y varias palabras',
      body: 'Para combinar textos, usa separadores fuera del alfabeto y registra a qué texto pertenece cada sufijo. No cuentes fragmentos que atraviesen una frontera. Los LCP entre vecinos de orígenes distintos permiten hallar la subcadena común más larga entre dos textos.\n\nAlgunos constructores añaden un terminador único para facilitar el orden. Nuestro programa no lo necesita porque trata la parte fuera de rango con −1. Si añades uno, exclúyelo de la cuenta de subcadenas originales.\n\nEl mismo SA y LCP también permiten construir un árbol de sufijos comprimido. Cada hoja corresponde a un sufijo y cada encuentro de ramas aparece a una profundidad determinada por un LCP; lo desarrollaremos junto a los autómatas de sufijos.',
    },
  ]),
  'usaco-adv-string-suffix': lesson => chapter([
    {
      title: 'Contar subcadenas mientras añadimos letras',
      body: 'La palabra aba tiene cinco subcadenas distintas: a, b, ab, ba y aba. La a aparece dos veces, pero su texto cuenta una sola. Queremos obtener ese conteo para una palabra de hasta 100 000 letras de a a z. La entrada es la palabra y la salida, una cantidad.\n\nGuardar todos los intervalos en un conjunto sirve para comprobar casos pequeños, pero puede copiar una cantidad cúbica de letras. El capítulo anterior organizó las subcadenas mediante sufijos ordenados. Ahora construiremos una estructura que se extiende al agregar una letra.\n\nUn **autómata** tiene estados y transiciones etiquetadas con letras. Desde un estado inicial, seguir las letras de una palabra determina un camino. Nuestro autómata de sufijos tendrá un camino para cada subcadena del texto.',
    },
    {
      title: 'Agrupar subcadenas que terminan en los mismos lugares',
      body: 'En aba, usando índices desde cero, a termina en {0,2}; b termina en {1}; ab también termina en {1}. Por eso b y ab pueden compartir estado: tienen los mismos finales y las mismas posibilidades de continuar a la derecha. ba y aba comparten otro estado con final {2}.\n\nCada estado v guarda len[v], la longitud máxima de sus subcadenas. Su enlace link[v] apunta al estado del mayor sufijo propio cuyo conjunto de finales es distinto.\n\nLas longitudes representadas por v forman el intervalo len[link[v]]+1 hasta len[v], con una subcadena distinta por longitud. Esta relación permitirá contar sin enumerar los caminos.',
      picture: { caption: 'Estados no iniciales al terminar aba.', rows: [
        { label: 'Subcadenas del estado', values: ['a', 'b, ab', 'ba, aba'] },
        { label: 'Finales', values: ['{0,2}', '{1}', '{2}'] },
        { label: 'Longitudes', values: ['1', '1 a 2', '2 a 3'] },
      ] },
    },
    {
      title: 'La representación de cada estado',
      body: 'next[c] indica a qué estado llegamos agregando la letra c a una subcadena representada. −1 significa que esa continuación no existe. La raíz tiene longitud cero y enlace −1. last señala el estado del prefijo completo que hemos leído.\n\nPara añadir una letra creamos cur con len[cur]=len[last]+1. Recorremos los sufijos del prefijo anterior siguiendo enlaces desde last. Donde falta la transición de esa letra, la añadimos hacia cur: acabamos de descubrir una nueva subcadena terminada en la posición nueva.',
      code: part(lesson, 'automata', 'struct State', 'int main()'), codeKind: 'fragment',
      afterCode: 'El arreglo fijo de 26 transiciones corresponde al alfabeto a…z. Reservamos cerca de 2n estados. Usamos índices y volvemos a acceder al vector después de insertar: una referencia a un elemento puede quedar inválida si push_back cambia su almacenamiento.',
    },
    {
      title: 'Añadir las transiciones que no existían',
      body: 'Si recorremos todos los enlaces y llegamos a −1 sin encontrar una transición, el mayor sufijo conocido de cur queda en la raíz. Si encontramos p que ya tiene transición por c hacia q, hay dos posibilidades.\n\nCuando len[p]+1=len[q], la longitud encaja con esa transición y podemos enlazar cur a q. Si len[p]+1 es menor, q agrupa longitudes que ahora ya no comparten todos sus finales: necesitamos separarlo.',
      code: part(lesson, 'automata', "        int c = ch - 'a'", '        if (p == -1)'), codeKind: 'fragment',
      afterCode: 'Este fragmento agrega las transiciones nuevas. Después comprobamos los dos casos descritos: llegar a −1 enlaza cur con la raíz; encontrar una transición de longitud compatible lo enlaza con q. cur representa el nuevo prefijo completo y sus sufijos todavía no representados en otro estado. Encontrar una transición existente no significa que podamos enlazar a su destino sin revisar las longitudes.',
    },
    {
      title: 'Ver por qué aparece un clon en abb',
      body: 'Tras leer ab, las subcadenas b y ab comparten el final {1} y el mismo estado q, de longitud máxima dos. Al añadir otra b, la subcadena b termina ahora en {1,2}, pero ab sigue terminando solo en {1}. Ya no deben compartir estado.\n\nCreamos un **clon** que conserva las transiciones y el enlace de q, pero tiene longitud máxima len[p]+1, aquí uno. Representará b. El estado q conserva la parte larga, ab. El nuevo cur representa bb y abb.\n\nRedirigimos hacia el clon las transiciones por la nueva letra que todavía apuntan a q al subir desde p. Finalmente, tanto q como cur enlazan al clon: b es el sufijo que corresponde a sus nuevas clases.',
      code: part(lesson, 'automata', '                int clone =', '            }\n        }\n        last = cur;'), codeKind: 'fragment',
      afterCode: 'Copiar transiciones conserva las continuaciones que las subcadenas cortas ya tenían. Cambiar len separa las longitudes y redirigir transiciones separa sus finales. El clon no corresponde a una nueva posición leída: si contamos apariciones, su contador debe empezar en cero, no copiar el de q.',
    },
    {
      title: 'Sumar cuántas longitudes aporta cada estado',
      body: 'Cada estado no inicial aporta len[v]−len[link[v]] subcadenas: una para cada longitud de su intervalo. Los estados separan conjuntos de finales distintos, así que no contamos una misma subcadena en dos estados.\n\nPara aba, las contribuciones son una para a, dos para b y ab, y dos para ba y aba: total cinco. Para abb son a, b, ab, bb y abb, también cinco, aunque su construcción usa un clon.\n\nLa respuesta puede ser n(n+1)/2, por lo que necesita long long aunque la estructura tenga solo O(n) estados.',
      code: part(lesson, 'automata', '    long long answer', '    cout << answer'), codeKind: 'fragment',
      check: { question: 'Al crear el clon que representa b en abb, ¿acabamos de leer una b adicional?', answer: 'No. La nueva letra ya corresponde a cur. El clon solo separa una clase anterior; darle una aparición inicial extra contaría una posición que no existe.' },
    },
    runnable(lesson, 'automata', 'El programa completo del autómata', 'Lee aba e imprime cinco. Cada letra extiende la estructura y, al final, sumamos los intervalos de longitudes de los estados. La entrada puede cambiarse a abb para provocar la separación explicada.', 'Para alfabeto fijo, la construcción del autómata tiene O(n) estados, transiciones y tiempo amortizado; no significa que cada while individual haga un número constante de pasos. Con mapas ordenados para alfabetos grandes aparecen factores logarítmicos. Compara con un conjunto explícito para palabras de hasta ocho letras, incluyendo abbbb y aaaaa.'),
    {
      title: 'Contar apariciones de un patrón',
      body: 'Para frecuencias, asigna uno a cada cur creado por una letra y cero a cada clon. Procesa estados de mayor a menor len y añade occ[v] a occ[link[v]]. Cada final del prefijo completo también es final de sus sufijos; los enlaces distribuyen esas aportaciones a las clases correspondientes.\n\nPuedes ordenar por longitud con counting sort en O(n), porque ninguna longitud supera n. Después, para buscar un patrón, recorre sus letras desde la raíz. Si falta una transición, no aparece; si terminas en v, su frecuencia es occ[v].\n\nEn abb, el estado de ab recibe una aparición y el de b recibe dos después de propagar. Un clon que empezara en uno inflaría esa última cuenta. Las subcadenas de un mismo estado comparten finales, por lo que comparten frecuencia.',
    },
    {
      title: 'Comparar con otro texto',
      body: 'Para hallar la subcadena común más larga con otro texto, conserva un estado v y la longitud l del sufijo que actualmente coincide. Lee el segundo texto de izquierda a derecha. Si no existe la transición de su letra, sigue link[v] y recorta l al len del nuevo estado hasta encontrar una transición o llegar a la raíz.\n\nSi puedes avanzar, sigue la transición y aumenta l. Si desde la raíz tampoco puedes, deja v en la raíz y l=0. Guarda el mayor l alcanzado. Cada paso conserva el mayor sufijo del texto procesado que aparece en el primero.\n\nEsta consulta busca cualquier subcadena común, no necesariamente un prefijo o sufijo de los textos completos. Con más textos, necesitas registrar por estado qué orígenes aportan coincidencias y excluir separadores de las respuestas.',
    },
    {
      title: 'Otra estructura: comprimir el trie de todos los sufijos',
      body: 'Un trie de todos los sufijos comparte sus prefijos, pero copiar una arista por letra puede ocupar O(n²). Un árbol de sufijos comprime cada camino sin bifurcaciones en una arista que guarda un intervalo del texto original. Añade un terminador único para que ningún sufijo sea prefijo de otro y cada uno termine en una hoja.\n\nEn banana$, los sufijos a$, ana$ y anana$ comparten la primera a. Los dos últimos continúan juntos con na antes de separarse. Esas letras compartidas se representan una sola vez en el camino hacia sus hojas.\n\nEl autómata agrupa por finales compartidos; este árbol comparte prefijos de sufijos. Sus enlaces y sus estados tienen significados distintos. No puedes intercambiar sus fórmulas solo porque ambos se construyan a partir del mismo texto.',
    },
    {
      title: 'Construir el árbol comprimido desde SA y LCP',
      body: 'Ya tenemos una forma de construir SA y LCP. Procesa sus sufijos en orden y conserva una pila con el camino a la hoja anterior. La profundidad de un nodo es la cantidad de letras desde la raíz. El LCP con el siguiente sufijo indica hasta qué profundidad deben compartir camino.\n\nSaca nodos mientras su profundidad supere ese LCP y recuerda la rama que acabas de sacar. Si la cima queda exactamente en la profundidad buscada, agrega allí la hoja nueva. Si queda por encima, divide aquella rama creando un nodo interno a profundidad LCP; mueve la rama anterior bajo él y agrega la nueva hoja como otro hijo.\n\nPara una arista padre→hijo, usa un sufijo representativo que empiece en i: su etiqueta es el intervalo desde i+profundidad[padre] hasta i+profundidad[hijo], excluyendo el final. No copies ese texto. Cada nodo entra y sale una vez de la pila, así que la conversión cuesta O(n) después de preparar SA y LCP.',
    },
    {
      title: 'Qué añade la construcción en línea de Ukkonen',
      body: 'Si necesitas extender el árbol de sufijos letra por letra, Ukkonen mantiene un árbol implícito del prefijo leído. Implícito significa que algunos sufijos pueden terminar dentro de una arista. Un extremo derecho compartido por las hojas alarga sus etiquetas al llegar cada letra, sin visitar todas las hojas.\n\nEl punto activo se describe por un nodo, una arista y una longitud recorrida dentro de ella. Un contador registra extensiones pendientes. Antes de comparar una letra, si la longitud activa alcanza toda una arista, camina al siguiente nodo y descuenta esa longitud: es el salto por aristas completas.\n\nSi falta la transición, crea una hoja. Si la letra siguiente de la arista coincide con la nueva, aumenta la longitud activa y termina la fase: las extensiones restantes ya están representadas de forma implícita. Si difiere, parte la arista en ese lugar, crea un nodo interno y agrega una hoja nueva desde él.',
    },
    {
      title: 'Continuar una fase sin empezar otra búsqueda desde cero',
      body: 'Después de una extensión explícita, reduce el contador pendiente. Si estás en la raíz con longitud activa positiva, reduce esa longitud en uno y ajusta el comienzo de la arista activa al siguiente sufijo pendiente. Si estás en otro nodo, sigue su enlace de sufijo.\n\nLos nodos internos creados durante una fase se enlazan con el siguiente nodo interno correspondiente al sufijo sin la primera letra. Esos enlaces y los saltos de aristas completas evitan volver a comparar cada sufijo desde la raíz. El terminador final fuerza a que todos terminen explícitamente en hojas.\n\nEn aaaa, muchas fases encuentran la misma letra dentro de una arista y solo extienden el punto activo; no crean cuatro caminos nuevos completos. El algoritmo tiene construcción lineal con alfabeto fijo, pero exige mantener juntos esos estados. Si el texto ya está disponible, SA+LCP ofrece una construcción comprimida más fácil de revisar paso a paso.',
    },
    {
      title: 'Relacionar las estructuras y comprobar sus cuentas',
      body: 'En el árbol de sufijos, recorrer hijos por orden de primera letra y leer las hojas produce SA. La profundidad del ancestro común de dos hojas es su LCP. En el autómata, seguir una palabra desde la raíz identifica su clase de finales.\n\nPara varios textos, registra el origen de cada hoja o las aportaciones a cada estado. Con pocos textos puede bastar una máscara; con muchos, conjuntos que se fusionan. El eertree del capítulo anterior es otra estructura: solo conserva palíndromos y sus enlaces van a sufijos palindrómicos.\n\nComprueba conteos distintos con un conjunto de subcadenas y frecuencias con búsqueda directa permitiendo superposiciones. Incluir aaaaa prueba coincidencias largas; abb y abbbb fuerzan clones. Las comprobaciones deben distinguir cantidad de estados, subcadenas distintas y apariciones: son tres números diferentes.',
    },
  ]),
};
