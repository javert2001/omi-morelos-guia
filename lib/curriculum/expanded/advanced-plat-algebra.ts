import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedPlatAlgebraExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-pie': extend('usaco-plat-pie',85,[
    s('Deriva los signos contando una sola persona',`Sean A1,…,Ak conjuntos de objetos que cumplen distintas propiedades. Queremos contar cuántos cumplen al menos una. Suma tamaños de conjuntos individuales, resta intersecciones de pares, suma intersecciones de ternas y continúa alternando. Cada subconjunto no vacío S de propiedades aporta (-1)^(|S|+1) veces el tamaño de su intersección.

Para probarlo, sigue un objeto que pertenece exactamente a t conjuntos. Aparece en C(t,1)-C(t,2)+C(t,3)-…+(-1)^(t+1)C(t,t). Como (1-1)^t=0, esa suma vale 1 cuando t≥1. Un objeto que no pertenece a ningún conjunto nunca aparece. La fórmula cuenta exactamente una vez cada objeto de la unión, independientemente de cuántas propiedades satisfaga.`),
    s('Intersecciones de divisibilidad y mínimo común múltiplo',`Para contar enteros de 1 a N divisibles por al menos uno de d1,…,dk, el conjunto Ai contiene los múltiplos de di. La intersección de un subconjunto contiene los múltiplos de su mínimo común múltiplo L, y por tanto tiene ⌊N/L⌋ elementos. No uses el producto de divisores salvo que hayas demostrado que son coprimos.

Con N=20 y divisores 4 y 6, hay 5 múltiplos de 4, 3 de 6 y 1 de mcm(4,6)=12; la unión tiene 7 elementos. El producto 24 daría intersección cero y contaría 12 dos veces. Los divisores repetidos no cambian el conjunto unión; la fórmula sigue funcionando, aunque quitarlos reduce el trabajo. También puedes eliminar un divisor que sea múltiplo de otro ya presente: todos sus números ya cumplen esa otra condición.`),
    s('Enumerar subconjuntos sin desbordar el cálculo',`Recorre máscaras de 1 a 2^k-1. Empieza L=1 y, por cada bit encendido, calcula nuevoL=(L/gcd(L,d))·d. Antes de multiplicar, comprueba si L/gcd(L,d)>N/d. Si se cumple, el nuevo mínimo común múltiplo excede N y la intersección está vacía; puedes detener ese subconjunto sin construir un número enorme.

Cuenta sus bits para elegir el signo: cantidad impar suma, cantidad par resta. Con k≤18, hay menos de 263000 máscaras y recorrer sus bits es viable. El algoritmo directo cuesta O(2^k·k·log D), incluyendo los gcd, y usa O(k) memoria. Esta técnica depende de que k sea pequeño; N puede ser enorme porque no recorremos sus enteros.`),
    s('Otros conteos y la diferencia entre al menos y exactamente',`Para contar objetos que no cumplen ninguna propiedad, resta el tamaño de la unión al universo. En permutaciones sin puntos fijos, la intersección de j condiciones «la posición i queda fija» tiene (n-j)! permutaciones; agrupar por tamaño produce Σ(j=0…n)(-1)^j C(n,j)(n-j)!. Para n=3 resulta 6-6+3-1=2, las dos permutaciones cíclicas sin posiciones fijas.

No reutilices la fórmula de unión para «exactamente una propiedad»: los objetos con varias propiedades deben aportar cero, y necesitas otros coeficientes. Un ejemplo mínimo lo revela: si A=B contiene un solo objeto, la unión vale uno, mientras exactamente una propiedad vale cero. Define siempre el conjunto buscado antes de escribir signos. Para revisar tus resultados, enumera universos pequeños y clasifica cada elemento según cuántas condiciones cumple.`),
  ],[
    p('multiplos','Al menos un divisor','Entrada: N k, con 1≤N≤10¹² y 1≤k≤18, seguido por k divisores entre 1 y 10¹². Imprime cuántos enteros de 1 a N son divisibles por al menos uno de ellos.', ['La intersección de condiciones de divisibilidad usa el mcm.', 'Si el mcm supera N, esa intersección no aporta ningún entero.'], 'Inclusión y exclusión hace que un número con t propiedades contribuya exactamente una vez. Cada intersección se cuenta como N/mcm. La comprobación previa a la multiplicación evita overflow al calcular mínimos comunes múltiplos grandes.', String.raw`#include <iostream>
#include <vector>
#include <numeric>
using namespace std;
int main() {
    long long N;
    int k;
    cin >> N >> k;
    vector<long long> d(k);
    for (auto &x : d)
        cin >> x;
    long long ans = 0;
    for (int mask = 1; mask < (1 << k); mask++) {
        long long L = 1;
        int bits = 0;
        bool empty = false;
        for (int i = 0; i < k; i++)
            if ((mask >> i) & 1) {
                bits++;
                long long a = L / gcd(L, d[i]);
                if (a > N / d[i]) {
                    empty = true;
                    break;
                }
                L = a * d[i];
            }
        if (!empty)
            ans += (bits % 2 ? 1 : -1) * (N / L);
    }
    cout << ans << '\n';
}`, [{input:'100 2\n2 5\n',output:'60\n'}, {input:'20 2\n4 6\n',output:'7\n'}, {input:'10 2\n2 2\n',output:'5\n'}]),
    r('tres-condiciones','Seguir las contribuciones','Un objeto cumple tres propiedades A,B,C. ¿Cuántas veces se cuenta al sumar los conjuntos individuales, restar intersecciones de pares y sumar la triple? ¿Qué pasa si olvidas el último término?', ['Hay tres conjuntos individuales y tres parejas.', 'La intersección triple devuelve una contribución.'], 'El coeficiente es 3-3+1=1. Si olvidas la intersección triple queda cero y el objeto desaparece del conteo, aunque pertenece a la unión. Un objeto que cumple exactamente dos propiedades aporta 2-1=1 y no necesita el término triple. Por eso verificar solo ejemplos con dos propiedades no detecta el error de omitir la última corrección.'),
  ]),

  'usaco-plat-matrix-expo': extend('usaco-plat-matrix-expo',90,[
    s('Define el vector de estado y la convención',`Una transición lineal transforma un vector de cantidades mediante sumas de múltiplos de sus componentes. Con vectores columna escribimos vSiguiente=M·vActual; entonces hacer k pasos da M^k·vInicial. El orden importa: aplicar primero A y después B produce B·A·v. Para Fibonacci, el estado [F(t+1),F(t)] se transforma mediante la matriz [[1,1],[1,0]].

No todas las recurrencias caben en una matriz fija. Una transición con un producto entre dos componentes variables, como xSiguiente=x·y, no es lineal en [x,y]. Una constante sí puede manejarse añadiendo una componente que siempre valga uno; por ejemplo xSiguiente=2x+3 se representa con [[2,3],[0,1]] sobre [x,1].`),
    s('Multiplicar y elevar: dos bucles conceptualmente distintos',`El producto C=A·B cumple C[i][j]=Σ_t A[i][t]B[t][j]. La suma recorre el estado intermedio t. Para matrices d×d, la implementación directa usa tres bucles y O(d³) operaciones. La identidad I tiene unos en la diagonal y ceros fuera; cumple I·A=A·I=A.

La exponenciación binaria empieza resultado=I. Mientras k>0, si k es impar, resultado=resultado·M; después M=M·M y k se divide entre dos. El invariante es que resultado por la potencia pendiente de M equivale a la potencia original. Usar la identidad permite tratar k=0 correctamente, sin un caso artificial: cero transiciones dejan el estado igual.`),
    s('Contar recorridos de longitud exacta',`En un grafo dirigido, define A[u][v] como el número de aristas de u a v. Entonces (A²)[u][v]=Σ_t A[u][t]A[t][v] cuenta recorridos de dos aristas: eliges el vértice intermedio y una arista de cada tramo. Por inducción, (A^k)[u][v] cuenta recorridos de exactamente k aristas, permitiendo repetir vértices y aristas.

En 1→2→3 y 1→3 hay un recorrido de longitud uno de 1 a 3 y otro de longitud dos por 2. No los sumes si piden longitud exacta. Con dos aristas paralelas 1→2, cada elección de arista cuenta como un recorrido distinto en esta definición. Si el problema identifica ambos recorridos, usa entradas de adyacencia 0 o 1, manteniendo el producto aritmético para contar recorridos. Una diagonal inicialmente cero no impide que una potencia tenga entradas diagonales positivas: estas cuentan recorridos cerrados de mayor longitud.`),
    s('Modularidad, otras operaciones y límites de uso',`Para conteos grandes, reduce después de cada suma de productos módulo P. Con P=1000000007, un producto de dos residuos cabe en long long, pero acumular d productos sin reducir podría desbordarlo. La complejidad es O(d³ log k) y la memoria O(d²). La dimensión debe ser pequeña: un exponente enorme no es el problema, una matriz de cien mil estados sí lo es.

También existen productos sobre otras operaciones: reemplazar suma por mínimo y multiplicación por suma permite caminos de longitud exacta con costo mínimo. Entonces la identidad tiene cero en diagonal e infinito fuera, y hay que evitar sumar a infinito. No mezcles esa interpretación con conteos. Para comprobar el código, compara exponentes 0,1,2 con cálculos manuales y multiplica matrices no conmutativas para detectar inversiones de orden.`),
  ],[
    p('recorridos','Recorridos de longitud exacta','Entrada: n m k s t, con 1≤n≤30, 0≤m≤1000 y 0≤k≤10¹⁸. Después vienen m aristas dirigidas u v; puede haber paralelas. Imprime el número de recorridos de exactamente k aristas desde s hasta t módulo 1000000007. Las elecciones de aristas paralelas cuentan por separado.', ['La matriz de adyacencia cuenta recorridos de un paso.', 'La potencia cero es la identidad.'], 'El producto de matrices combina recorridos a través de un vértice intermedio. Por inducción, A^k cuenta recorridos de longitud k. La exponenciación binaria obtiene esa potencia en O(n³ log k), usando O(n²) memoria.', String.raw`#include <iostream>
#include <vector>
using namespace std;
const long long MOD = 1000000007;
using Mat = vector<vector<long long>>;
Mat mul(const Mat &a, const Mat &b) {
    int n = a.size();
    Mat c(n, vector<long long>(n));
    for (int i = 0; i < n; i++)
        for (int k = 0; k < n; k++)
            if (a[i][k])
                for (int j = 0; j < n; j++)
                    c[i][j] = (c[i][j] + a[i][k] * b[k][j]) % MOD;
    return c;
}
int main() {
    int n, m, s, t;
    long long k;
    cin >> n >> m >> k >> s >> t;
    --s;
    --t;
    Mat a(n, vector<long long>(n)), r(n, vector<long long>(n));
    for (int i = 0; i < n; i++)
        r[i][i] = 1;
    while (m--) {
        int u, v;
        cin >> u >> v;
        a[u - 1][v - 1]++;
    }
    while (k) {
        if (k & 1)
            r = mul(r, a);
        a = mul(a, a);
        k >>= 1;
    }
    cout << r[s][t] << '\n';
}`, [{input:'3 3 2 1 3\n1 2\n2 3\n1 3\n',output:'1\n'}, {input:'1 0 0 1 1\n',output:'1\n'}, {input:'2 3 3 1 2\n1 2\n1 2\n2 1\n',output:'4\n'}]),
    r('afin','Añadir una constante al estado','La recurrencia es x(t+1)=2x(t)+3, con x(0)=1. Escribe una matriz 2×2 que la represente y calcula x(3) de dos maneras.', ['Añade una segunda componente fija igual a uno.', 'La última fila debe conservar esa componente.'], 'Usa el vector [x,1] y M=[[2,3],[0,1]]. Directamente: x1=5, x2=13 y x3=29. Por potencias, M²=[[4,9],[0,1]] y M³=[[8,21],[0,1]]; multiplicar por [1,1] entrega [29,1]. Una matriz 1×1 solo multiplicaría x y no podría representar la suma constante 3 para todos los valores de x.'),
  ]),

  'usaco-plat-bitsets': extend('usaco-plat-bitsets',85,[
    s('Cada bit representa una respuesta booleana',`Un bitset agrupa muchos valores verdadero/falso en palabras de máquina. Si la palabra tiene w bits, una operación AND, OR o XOR puede procesar w posiciones mediante una instrucción de palabra. En C++, std::bitset<S> tiene tamaño fijo conocido al compilar y permite desplazamientos, operaciones lógicas, count, any y none.

La ventaja aparece cuando puedes expresar la transición de muchos estados con pocas operaciones sobre palabras. No basta sustituir vector<bool> por bitset: debes identificar la operación colectiva. Para un conjunto de sumas alcanzables, el bit s significa «existe un subconjunto cuya suma es s». Inicialmente solo el bit cero está encendido, pues el subconjunto vacío tiene suma cero.`),
    s('Derivar la transición de mochila de subconjuntos',`Si las sumas anteriores son las posiciones encendidas de B y agregas un objeto de peso x, las nuevas sumas que lo usan son B<<x. Las que no lo usan permanecen en B. Por eso la transición completa es B=B OR (B<<x). El desplazamiento se calcula a partir del estado anterior antes de asignar el resultado, así cada objeto se usa a lo sumo una vez.

Con pesos [2,3,2], empezamos {0}; después de 2 tenemos {0,2}; después de 3 tenemos {0,2,3,5}; después del segundo 2 tenemos {0,2,3,4,5,7}. La suma 4 usa los dos objetos de peso 2, que son objetos diferentes. La suma 6 no se consigue: permitir usar indefinidamente el primer 2 resolvería otro problema.`),
    s('Qué se pierde al resumir y cómo recuperar soluciones',`El bitset dice si una suma es posible, pero no conserva automáticamente qué objetos la producen ni cuántas formas existen. Para reconstruir, puedes guardar los bitsets de cada etapa y recorrer los objetos al revés: si la suma s era alcanzable sin el objeto actual, omítelo; si no, úsalo y resta su peso. Esto requiere O(nS) bits de memoria, mayor que guardar solo la última etapa.

Otra opción detecta las sumas recién alcanzadas con nuevos=(B<<x) AND NOT B y registra para ellas el objeto y la suma anterior. Enumerar esos bits exige una implementación adicional; no debe presentarse como costo cero. Para contar formas necesitas una DP numérica, pues OR pierde multiplicidades: dos subconjuntos que llegan al mismo bit se fusionan.`),
    s('Cotas, truncamiento y diferencias con SIMD',`Una implementación por palabras realiza O(n·S/w) trabajo aproximado para n objetos y S estados, con O(S/w) palabras de memoria, frente a O(nS) operaciones booleanas individuales. El estándar de C++ describe el resultado de bitset, no promete una instrucción SIMD particular; el compilador y la biblioteca deciden cómo implementarlo. Es una mejora de representación que funciona incluso sin escribir intrínsecos específicos del procesador.

Los desplazamientos descartan bits fuera del tamaño S. Eso es correcto si solo interesan sumas hasta S-1 y todos los pesos son no negativos: una suma demasiado grande nunca volverá a bajar. Con pesos negativos esa justificación falla y se necesita un rango desplazado u otra técnica. Prueba peso cero, objetos repetidos, objetivo cero y objetivos exactamente en el límite. Evita usar 1<<s cuando s supera el ancho de un entero; eso no sustituye un bitset.`),
  ],[
    p('sumas','Sumas alcanzables','Entrada: n q (1≤n,q≤1000), n pesos entre 0 y 100000 y q objetivos entre 0 y 100000. Cada objeto puede usarse cero o una vez. Para cada objetivo imprime SI si algún subconjunto suma exactamente ese valor, o NO.', ['El bit cero debe comenzar encendido.', 'Cada objeto produce un desplazamiento de todas las sumas anteriores.'], 'El estado conserva exactamente las sumas alcanzables con los objetos procesados. OR mantiene las que no usan el nuevo objeto y el desplazamiento añade las que sí lo usan. Como los pesos son no negativos, descartar sumas mayores que 100000 no afecta las consultas.', String.raw`#include <iostream>
#include <bitset>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    bitset<100001> b;
    b[0] = 1;
    while (n--) {
        int x;
        cin >> x;
        b |= b << x;
    }
    while (q--) {
        int x;
        cin >> x;
        cout << (b[x] ? "SI" : "NO") << '\n';
    }
}`, [{input:'3 4\n2 3 2\n0 4 6 7\n',output:'SI\nSI\nNO\nSI\n'}, {input:'2 3\n0 0\n0 1 100000\n',output:'SI\nNO\nNO\n'}, {input:'1 2\n100000\n100000 99999\n',output:'SI\nNO\n'}]),
    r('conteo-no','Posibilidad no es cantidad','Con dos objetos distintos de peso 1, ¿cuántos subconjuntos suman 1? ¿Qué almacena el bit 1 después de procesarlos? Explica por qué bitset no responde el número de formas.', ['Los objetos son distinguibles aunque sus pesos coincidan.', 'OR fusiona dos contribuciones verdaderas.'], 'Hay dos subconjuntos: elegir el primer objeto o el segundo. El bit 1 solo vale verdadero. La operación OR conserva existencia, no suma contribuciones, así que el estado pierde la multiplicidad. Para contar formas usa una DP de enteros, actualizada en orden descendente por objeto, o una técnica de polinomios adecuada al tamaño del problema.'),
  ]),

  'usaco-plat-dp-sos': extend('usaco-plat-dp-sos',90,[
    s('Máscaras como conjuntos y el costo que queremos evitar',`Con B características, una máscara de B bits representa un subconjunto: el bit i indica si contiene la característica i. Queremos F[mask]=Σ(sub⊆mask)A[sub]. Enumerar todas las submáscaras de cada máscara cuesta 3^B en total, porque cada bit puede estar fuera de mask, dentro de mask pero fuera de sub, o dentro de ambos.

La transformada SOS reduce el trabajo a O(B·2^B) procesando una característica por vez. No necesitas ordenar las máscaras por número de bits ni recorrer sus subconjuntos explícitamente. Antes de implementar, distingue subconjunto de subcadena o subarreglo: aquí no existe contigüidad, solo inclusión de bits encendidos.`),
    s('Invariante por dimensiones y algoritmo completo',`Copia A en F. Para cada bit i de 0 a B-1, recorre todas las máscaras; si mask contiene i, agrega F[mask sin i] a F[mask]. Después de procesar los primeros i bits, F[mask] suma A[sub] sobre conjuntos que pueden omitir libremente esos bits procesados, pero coinciden con mask en los no procesados.

Al procesar el siguiente bit, las contribuciones se separan en dos grupos disjuntos: sub que conserva ese bit y sub que lo omite. El valor anterior representa el primero; el valor de mask sin el bit representa el segundo. No hay doble conteo. Tras procesar todos los bits, cualquier submáscara está permitida y el invariante se convierte exactamente en la suma buscada.`),
    s('Traza pequeña y una aplicación de frecuencias',`Con B=2 y A[0]=1,A[1]=2,A[2]=4,A[3]=8, la fila inicial es [1,2,4,8]. Al procesar el bit 0, F[1]+=F[0] y F[3]+=F[2], quedando [1,3,4,12]. Al procesar el bit 1, F[2]+=F[0] y F[3]+=F[1], quedando [1,3,5,15]. Así F[3] suma los cuatro valores y F[2] suma únicamente A[0]+A[2].

Si A[m] cuenta personas cuyo conjunto exacto de habilidades es m, F[x] cuenta personas cuyas habilidades están todas dentro de x. Personas repetidas con la misma máscara se acumulan en A. La consulta no pregunta quién contiene todas las habilidades de x: esa condición sería de supermáscaras y necesita la variante inversa del recorrido.`),
    s('Supermáscaras, inversión y convolución OR',`Para sumar supermáscaras, cuando mask no contiene el bit i agrega F[mask con i] a F[mask]. Para invertir la transformada de submáscaras, repite la estructura de bucles sustituyendo suma por resta: cada paso deshace la incorporación de la dimensión correspondiente. Esto se llama inversión de Möbius sobre subconjuntos.

La combinación permite calcular una convolución OR: C[s]=Σ(a OR b=s)A[a]B[b]. Transforma A y B por sumas de submáscaras, multiplica punto a punto y aplica la inversión. El producto de transformadas cuenta parejas cuyo OR está contenido en s; la inversión recupera las de OR exactamente s. No uses la misma fórmula para XOR, cuya transformada es diferente. Con B≤20 hay hasta 1048576 estados, así que la memoria también debe presupuestarse: un vector de long long ocupa unos 8 MiB.`),
  ],[
    p('habilidades','Máscaras contenidas','Entrada: B n q (1≤B≤20, 1≤n,q≤200000), n máscaras enteras entre 0 y 2^B-1, y q máscaras de consulta. Para cada x imprime cuántas máscaras de entrada m cumplen (m AND x)=m. Las repeticiones cuentan por separado.', ['Construye frecuencias por máscara exacta.', 'Transforma las frecuencias en sumas de todas las submáscaras.'], 'La transformada procesa cada bit separando contribuciones que lo conservan de las que lo omiten. Tras B etapas, F[x] suma exactamente las frecuencias de submáscaras de x. Preparación O(n+B·2^B), consultas O(1), memoria O(2^B).', String.raw`#include <iostream>
#include <vector>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int B, n, q;
    cin >> B >> n >> q;
    int N = 1 << B;
    vector<long long> f(N);
    while (n--) {
        int x;
        cin >> x;
        f[x]++;
    }
    for (int b = 0; b < B; b++)
        for (int m = 0; m < N; m++)
            if (m & (1 << b))
                f[m] += f[m ^ (1 << b)];
    while (q--) {
        int x;
        cin >> x;
        cout << f[x] << '\n';
    }
}`, [{input:'2 4 3\n0 1 1 2\n0 1 3\n',output:'1\n3\n4\n'}, {input:'1 1 2\n1\n0 1\n',output:'0\n1\n'}, {input:'3 3 3\n3 5 7\n3 6 7\n',output:'1\n0\n3\n'}]),
    r('invertir','Recuperar la tabla original','Una transformada de submáscaras con B=2 produce F=[2,5,7,17]. Recupera A y explica el orden de las restas.', ['Deshaz el bit 0 restando F[0] de F[1] y F[2] de F[3].', 'Después deshaz el bit 1 usando los valores actualizados.'], 'Después de restar por el bit 0 queda [2,3,7,10]. Después de restar por el bit 1 queda [2,3,5,7]. Esa es A. Al transformar de nuevo: bit 0 produce [2,5,5,12] y bit 1 produce [2,5,7,17]. La inversión funciona porque cada operación de suma entre dos bloques disjuntos se sustituye por su resta correspondiente; no se divide por el número de submáscaras.'),
  ]),

  'usaco-plat-plat-conclusion': extend('usaco-plat-plat-conclusion',100,[
    s('Proyecto integrador: conectividad bajo restricciones',`Considera una red de estaciones con aristas de dificultad w. Cada consulta da un vértice v y un límite W, y pide cuántas estaciones son alcanzables desde v usando solo aristas de dificultad≤W. Con n,m,q grandes, ejecutar una búsqueda por consulta cuesta O(q(n+m)). Antes de escoger una estructura, observa que las aristas permitidas solo aumentan cuando W aumenta.

Ordena las consultas por W y las aristas por w. Mantén un DSU de componentes y procesa cada arista una sola vez cuando se vuelve permitida. La respuesta es el tamaño de la componente de v. Este proyecto combina barrido offline, monotonía de eventos, unión por tamaño y restauración del orden original mediante identificadores.`),
    s('Desarrolla el argumento antes del programa',`El invariante es que, justo antes de responder una consulta de límite W, el DSU representa exactamente la conectividad del subgrafo formado por todas las aristas de peso≤W. Al empezar, sin aristas, cada vértice está solo. Insertar una arista fusiona sus componentes si eran distintas, que es precisamente el cambio de conectividad que produce agregar esa arista al grafo.

El bucle debe insertar mientras peso≤W, incluyendo empates. Una vez preparado el DSU, su tamaño de componente es la cantidad buscada. Reordenar consultas es seguro porque ninguna modifica el grafo ni depende de respuestas anteriores. Si el enunciado añadiera esa dependencia, este mismo algoritmo dejaría de ser aplicable aunque su DSU estuviera perfectamente implementado.`),
    s('Traza, límites y pruebas que distinguen errores',`En el camino 1–2 de peso 3 y 2–3 de peso 7, una consulta desde 1 con W=2 responde 1; con W=3 responde 2; con W=7 responde 3. Una consulta desde 3 con W=3 responde 1. Si las consultas llegan en orden 7,2,3, las procesas como 2,3,7 y luego imprimes cada respuesta en su posición original.

Prueba un grafo sin aristas, varios componentes, aristas paralelas, consultas justo antes y justo en un peso, y una arista que une vértices ya conectados. En ese último caso no debes sumar otra vez los tamaños. Ordenar domina O((m+q) log(m+q)); las operaciones DSU añaden un costo amortizado casi constante. La memoria es O(n+m+q).`),
    s('Lista de decisiones para nuevos problemas',`Cuando aparezca un problema distinto, escribe qué objetos cambian, qué información pide cada consulta y qué operaciones son legales. Si son rangos estáticos, comprueba si bastan prefijos o una tabla disjunta. Si hay frecuencias difíciles y consultas offline, considera Mo. Si las consultas siguen caminos de un árbol, decide entre Euler para subárboles, HLD para caminos o centroides para distancias a conjuntos activos.

Después enumera las hipótesis que tu elección necesita: asociatividad, monotonía de óptimos, pendientes ordenadas, pesos no negativos o posibilidad de reordenar. Busca un contraejemplo al quitar cada hipótesis. Finalmente construye una versión lenta para instancias pequeñas y compara. Completar Platino significa poder justificar estas decisiones y detectar cuándo una técnica no aplica, además de escribir su implementación.`),
  ],[
    p('red-umbral','Estaciones alcanzables','Entrada: n m q (1≤n≤100000, 0≤m≤100000, 1≤q≤100000), m aristas no dirigidas u v w, con 0≤w≤10⁹, y q consultas v W. Imprime cuántos vértices son alcanzables desde v usando aristas de peso≤W, incluyendo el propio v. Conserva el orden de las consultas.', ['Ordena consultas por su límite y activa aristas con un puntero.', 'El DSU debe guardar el tamaño de cada componente.'], 'El barrido añade exactamente las aristas permitidas antes de cada consulta. El DSU representa su conectividad por inducción sobre inserciones. El tamaño de la componente entrega la respuesta; los identificadores permiten volver al orden original.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;
struct E {
    int u, v, w;
};
struct Q {
    int v, w, id;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<E> e(m);
    for (auto &x : e) {
        cin >> x.u >> x.v >> x.w;
        --x.u;
        --x.v;
    }
    vector<Q> qs(q);
    for (int i = 0; i < q; i++) {
        cin >> qs[i].v >> qs[i].w;
        --qs[i].v;
        qs[i].id = i;
    }
    sort(e.begin(), e.end(), [](E a, E b) { return a.w < b.w; });
    sort(qs.begin(), qs.end(), [](Q a, Q b) { return a.w < b.w; });
    vector<int> par(n), sz(n, 1), ans(q);
    iota(par.begin(), par.end(), 0);
    auto find = [&](int x) {
        while (x != par[x]) {
            par[x] = par[par[x]];
            x = par[x];
        }
        return x;
    };
    int at = 0;
    for (auto z : qs) {
        while (at < m && e[at].w <= z.w) {
            int a = find(e[at].u), b = find(e[at].v);
            if (a != b) {
                if (sz[a] < sz[b])
                    swap(a, b);
                par[b] = a;
                sz[a] += sz[b];
            }
            at++;
        }
        ans[z.id] = sz[find(z.v)];
    }
    for (int x : ans)
        cout << x << '\n';
}`, [{input:'3 2 4\n1 2 3\n2 3 7\n1 7\n1 2\n1 3\n3 3\n',output:'3\n1\n2\n1\n'}, {input:'2 0 2\n1 100\n2 0\n',output:'1\n1\n'}, {input:'3 3 2\n1 2 1\n1 2 1\n2 3 2\n1 1\n3 2\n',output:'2\n3\n'}]),
    r('diagnostico','Detectar una optimización inválida','Un compañero propone responder composiciones de funciones usando dos bloques superpuestos de sparse table, y otro propone aplicar la deque de CHT con consultas x en cualquier orden. Identifica la hipótesis que falta en cada propuesta y ofrece una alternativa correcta.', ['La superposición requiere que repetir elementos no cambie el resultado.', 'Una recta descartada del frente puede ser necesaria otra vez si x retrocede.'], 'La composición de funciones no es idempotente: repetir una función cambia normalmente el resultado. Usa tabla disjunta o árbol de segmentos que mantenga el orden. La deque de CHT destruye rectas apoyándose en consultas monótonas; si x retrocede, puede necesitar una recta ya eliminada. Para una envolvente estática con puntos de cambio ordenados usa búsqueda binaria; para inserciones arbitrarias considera Li Chao. En ambos casos hay que cambiar la estructura o demostrar la hipótesis faltante.'),
  ]),
};
