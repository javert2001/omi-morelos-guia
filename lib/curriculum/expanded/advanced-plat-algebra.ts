import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedPlatAlgebraExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-pie': extend('usaco-plat-pie',85,[
    s("Calcular intersecciones de divisibilidad","Un entero divisible por todos los divisores elegidos es múltiplo de su mínimo común múltiplo, L. Entre 1 y N hay ⌊N/L⌋ de esos enteros. Utilizar el producto en lugar del mcm solo es válido cuando los divisores son coprimos.\n\nCon N=20 y divisores 4 y 6, hay 5+3−1=7 números, pues mcm(4,6)=12. Usar 24 daría intersección cero y contaría 12 dos veces. Puedes quitar divisores repetidos o múltiplos de otro presente para reducir trabajo sin cambiar la unión."),
    s("Enumerar sin construir números enormes","Recorre máscaras de 1 a 2^k−1. Para cada una empieza con L=1 y agrega sus divisores mediante nuevoL=(L/gcd(L,d))·d. Antes de multiplicar, comprueba si L/gcd(L,d)>N/d. En ese caso el mcm superaría N y la intersección está vacía: deja de procesar esa máscara.\n\nLa cantidad de bits encendidos determina el signo. La comprobación previa evita desbordamientos, pues no necesitas conocer un mcm enorme cuando ya sabes que ningún número del rango puede ser múltiplo suyo."),
    s("Aplicar el mismo razonamiento a permutaciones","Para contar permutaciones sin posiciones fijas, cada condición indica que cierta posición queda fija. Fijar j posiciones deja (n−j)! maneras de ordenar las demás. Agrupar intersecciones por su tamaño produce Σ(j=0…n)(−1)^j C(n,j)(n−j)!.\n\nCon n=3 resulta 6−6+3−1=2. El término j=0 cuenta todas las permutaciones y los demás corrigen las que dejan posiciones fijas. La intersección cambia de significado según el problema, pero los signos provienen del mismo conteo por objeto."),
    s("No confundir unión con exactamente una propiedad","La fórmula anterior cuenta objetos que cumplen al menos una condición. Para contar los que cumplen exactamente una, los objetos con varias deben aportar cero y necesitas otros coeficientes.\n\nSi A=B contiene un único objeto, la unión vale uno y la cantidad que cumple exactamente una propiedad vale cero. Ese ejemplo detecta la confusión antes de implementar. También puedes enumerar un universo pequeño y anotar cuántas propiedades cumple cada objeto para comprobar los signos."),
  ],[
    p('multiplos',"Números con al menos un divisor dado","Lee N k, con 1≤N≤10¹² y 1≤k≤18, y después k divisores entre 1 y 10¹². Imprime cuántos enteros de 1 a N son divisibles por al menos uno de esos divisores.", ["Cada subconjunto de condiciones corresponde a múltiplos de su mcm.", "Detén el cálculo de un mcm si sabes que superará N; esa intersección aporta cero."], "Enumera subconjuntos no vacíos y cuenta cada intersección como ⌊N/mcm⌋. Suma los subconjuntos de tamaño impar y resta los pares. Un número con t divisores elegidos aporta en total uno por la identidad de inclusión y exclusión. Calcula el mcm usando gcd y comprueba antes de multiplicar si superará N para evitar desbordamientos.", String.raw`#include <iostream>
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
    r('tres-condiciones',"Seguir la contribución de un objeto","Un objeto cumple A, B y C. Cuenta cuántas veces aparece al sumar conjuntos individuales, restar cruces por parejas y sumar el cruce triple. ¿Qué ocurriría si omitieras el último término?", ["El objeto aparece en tres conjuntos individuales y en tres parejas.", "El cruce triple agrega una contribución después de las tres restas."], "Su coeficiente es 3−3+1=1. Si omites el cruce triple queda cero y desaparece un objeto que sí pertenece a la unión. En cambio, uno que cumpla exactamente dos condiciones aporta 2−1=1. Por eso probar solo intersecciones de dos grupos no detectaría el término triple que falta."),
  ]),

  'usaco-plat-matrix-expo': extend('usaco-plat-matrix-expo',90,[
    s("Multiplicar y elevar la matriz","El producto C=A·B cumple C[i][j]=Σ_t A[i][t]B[t][j]. La implementación ordinaria usa tres bucles y O(d³) operaciones. La identidad I tiene unos en la diagonal y ceros fuera; representa aplicar cero pasos.\n\nPara elevar M a k, empieza R=I. Mientras k>0, si es impar haz R=R·M; luego M=M·M y divide k entre dos. La propiedad R por la potencia pendiente de M conserva la potencia original. Con k=0, R queda como identidad y el estado no cambia."),
    s("Contar recorridos de longitud exacta","En un grafo dirigido, A[u][v] cuenta las aristas de u a v. Entonces (A²)[u][v]=Σ_t A[u][t]A[t][v] cuenta recorridos de dos aristas pasando por cada posible t. Por inducción, (A^k)[u][v] cuenta recorridos de exactamente k aristas, permitiendo repetir vértices.\n\nEn 1→2→3 y 1→3 existe un recorrido de un paso y otro de dos entre 1 y 3. No los sumes si la longitud es exacta. Si hay aristas paralelas, decide si elegir una u otra cuenta como recorridos distintos; de ello depende la entrada inicial de A."),
    s("Reducir módulo durante las acumulaciones","Para conteos grandes puedes trabajar módulo P. Con P=1000000007, el producto de dos residuos cabe en long long, pero acumular muchos sin reducir puede desbordarlo. Reduce en cada suma de productos.\n\nElevar una matriz d×d cuesta O(d³ log k) y usa O(d²) memoria. La dimensión debe ser pequeña: un exponente enorme puede ser manejable, pero una matriz densa con cien mil estados no. Cuenta ese costo antes de elegir esta representación."),
    s("Cambiar las operaciones cambia el significado","Si sustituyes suma por mínimo y producto por suma, la multiplicación combina costos de caminos de longitud exacta. En esa interpretación, la identidad tiene cero en la diagonal e infinito fuera; evita sumar a infinito.\n\nEn el producto ordinario cuentas recorridos. Una diagonal inicial cero no impide que una potencia tenga diagonal positiva: representa recorridos cerrados. Mantén separados ambos modelos para no mezclar una matriz de conteos con una de costos."),
  ],[
    p('recorridos',"Recorridos con exactamente k aristas","Lee n m k s t, con 1≤n≤30, 0≤m≤1000 y 0≤k≤10¹⁸. Después lee m aristas dirigidas u v, posiblemente paralelas. Imprime el número de recorridos de exactamente k aristas de s a t módulo 1000000007. Elegir aristas paralelas distintas cuenta por separado.", ["La entrada A[u][v] debe contar cuántas aristas conectan u con v.", "Con cero aristas, solo existe el recorrido vacío de un vértice a sí mismo: lo representa la identidad."], "Construye la matriz de adyacencia y calcula A^k por exponenciación binaria. Cada producto combina dos recorridos a través de su vértice intermedio; por inducción, la entrada s,t de la potencia cuenta las longitudes pedidas. Reduce durante la acumulación. El tiempo es O(n³ log k) y la memoria O(n²).", String.raw`#include <iostream>
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
    r('afin',"Representar un término constante","La recurrencia x(t+1)=2x(t)+3 empieza con x(0)=1. Construye una matriz 2×2 para representarla y calcula x(3) tanto directamente como con una potencia de esa matriz.", ["Utiliza el estado [x,1].", "La segunda fila debe mantener la componente constante igual a uno."], "La matriz es M=[[2,3],[0,1]]. Directamente obtienes 5, 13 y 29. También M²=[[4,9],[0,1]] y M³=[[8,21],[0,1]]; al multiplicar por [1,1] resulta [29,1]. Una matriz 1×1 solo multiplicaría x y no podría sumar 3 para todos los valores iniciales."),
  ]),

  'usaco-plat-bitsets': extend('usaco-plat-bitsets',85,[
    s("Qué operaciones acelera un bitset","std::bitset<S> tiene tamaño fijo conocido al compilar. Agrupa valores booleanos y admite AND, OR, XOR, desplazamientos, count, any y none. Una implementación por palabras procesa aproximadamente w bits por operación de máquina.\n\nEl ahorro aparece cuando la transición completa se expresa con esas operaciones colectivas. Cambiar el contenedor sin encontrar tal operación no garantiza una mejora. Otro ejemplo son vecinos comunes en un grafo: (vecinos[u] & vecinos[v]).count() cuenta los bits presentes en ambas listas."),
    s("Decidir cuánto del rango puedes descartar","Los desplazamientos eliminan bits que salen del tamaño S. Si solo consultas sumas hasta S−1 y los pesos son no negativos, es seguro: una suma mayor nunca podrá bajar. Con pesos negativos, esa justificación falla y necesitarías un rango desplazado u otra representación.\n\nstd::bitset exige un tamaño de compilación. Para límites dinámicos puedes implementar bloques de enteros o usar una estructura adecuada. No reemplaces el bitset por 1<<s cuando s pueda exceder el ancho del entero."),
    s("Reconstruir una selección requiere más información","La última tabla indica posibilidad, pero no cuáles objetos usar. Una opción guarda el bitset de cada etapa y recorre los objetos al revés: si la suma s ya era posible antes, omite el objeto; de lo contrario, úsalo y resta su peso. Guardar todas las etapas ocupa O(nS) bits.\n\nTambién puedes detectar sumas nuevas con (B<<x) AND NOT B y registrar sus predecesores. Enumerar esos bits requiere trabajo adicional que debes incluir en el análisis. La reconstrucción no viene gratis con la operación OR."),
    s("Distinguir existencia de número de formas","Con dos objetos distintos de peso 1 hay dos subconjuntos de suma 1, pero el bit 1 solo vale verdadero. OR reúne contribuciones y pierde su multiplicidad. Para contar formas necesitas una DP numérica u otra técnica que conserve cantidades.\n\nEl estándar de C++ define el resultado de las operaciones de bitset, no una instrucción SIMD específica. El compilador y la biblioteca deciden su implementación. La ventaja de procesar bloques no implica que todas las plataformas tengan las mismas constantes."),
  ],[
    p('sumas',"Consultar sumas de subconjuntos","Lee n q (1≤n,q≤1000), n pesos entre 0 y 100000 y q objetivos del mismo rango. Cada objeto puede elegirse cero o una vez. Para cada objetivo imprime SI si existe un subconjunto con esa suma exacta y NO si no existe.", ["Enciende inicialmente solo el bit cero.", "Para cada peso, conserva las sumas anteriores y agrega una copia desplazada por ese peso."], "Mantén B con las sumas alcanzables usando los objetos procesados. En cada paso B OR (B<<x) reúne las selecciones sin el nuevo objeto y las que lo usan una vez. Como los pesos son no negativos, las sumas descartadas por superar 100000 nunca podrán contribuir a una consulta. Al finalizar, consulta directamente cada bit.", String.raw`#include <iostream>
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
    r('conteo-no',"Qué información pierde un bit","Dos objetos distintos pesan 1 cada uno. ¿Cuántos subconjuntos suman 1? ¿Qué valor almacena el bit 1 al terminar? Explica por qué esa representación no cuenta formas.", ["Elegir el primer objeto y elegir el segundo son selecciones diferentes.", "OR de dos contribuciones verdaderas sigue siendo un único valor verdadero."], "Hay dos subconjuntos de suma 1, pero el bit correspondiente solo vale uno. Ese valor responde existencia, no cantidad. Para contar formas conserva un número por suma y actualízalo en orden descendente para cada objeto, como una mochila 0/1 numérica. Así las dos elecciones aportan dos unidades en lugar de fusionarse."),
  ]),

  'usaco-plat-dp-sos': extend('usaco-plat-dp-sos',90,[
    s("Por qué las sumas no cuentan dos veces","Después de procesar algunos bits, F[mask] incluye las máscaras que coinciden con mask en los bits pendientes y pueden omitir los bits ya procesados que mask tiene encendidos. Esa es la propiedad que conserva cada etapa.\n\nEl siguiente bit separa contribuciones en dos grupos disjuntos: las que lo conservan y las que lo omiten. El valor actual representa el primero y F[mask sin bit] el segundo. Al terminar todos los bits, quedan permitidas exactamente todas las submáscaras, sin repeticiones."),
    s("Aplicarlo a frecuencias y a supermáscaras","Si A[m] cuenta estudiantes con conjunto exacto de habilidades m, F[x] cuenta quienes no tienen habilidades fuera de x. Las repeticiones se acumulan en A y la máscara vacía está contenida en cualquier x.\n\nSi quieres contar a quienes tienen todas las habilidades de x, necesitas supermáscaras. Invierte la dirección: cuando mask no contiene el bit i, agrega F[mask con i] a F[mask]. La estructura es parecida, pero responde una condición de inclusión diferente."),
    s("Recuperar los valores originales","La transformada de sumas se puede invertir sustituyendo sus sumas por restas en los mismos bucles por bits. Esto se llama inversión de Möbius sobre subconjuntos. Cada etapa deshace la contribución agregada desde las máscaras sin ese bit.\n\nPor ejemplo, F=[2,5,7,17] pasa a [2,3,7,10] al restar por el bit 0 y a [2,3,5,7] al restar por el bit 1. Transformar otra vez esa tabla recupera F. No se divide por el número de submáscaras."),
    s("Usar la transformada en una convolución OR","Supón C[s]=Σ(a OR b=s)A[a]B[b]. Transforma A y B por sumas de submáscaras y multiplica sus resultados posición a posición. Ese producto cuenta parejas cuyo OR está contenido en s, porque ambos conjuntos deben estar contenidos en s.\n\nAplica después la inversión para recuperar las parejas con OR exactamente s. Este argumento depende de OR: no lo reutilices para XOR, que necesita otra transformada. Cambiar suma por otro agregado también exige revisar qué propiedad necesitas y si existe una operación inversa."),
  ],[
    p('habilidades',"Frecuencias de máscaras contenidas","Lee B n q (1≤B≤20, 1≤n,q≤200000), n máscaras entre 0 y 2^B−1 y q máscaras de consulta. Para cada x imprime cuántas máscaras de entrada m cumplen (m AND x)=m. Si una máscara aparece varias veces, cuenta cada aparición.", ["Construye A con frecuencias de cada máscara exacta.", "En cada bit, una máscara que lo contiene recibe la suma de la misma máscara sin ese bit."], "La condición (m AND x)=m indica que m es submáscara de x. Aplica SOS a las frecuencias: después de cada bit se permite omitir ese bit, y tras B etapas F[x] reúne exactamente todas las submáscaras. Preparar cuesta O(n+B·2^B), responder cada pregunta O(1) y guardar la tabla O(2^B).", String.raw`#include <iostream>
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
    r('invertir',"Invertir una suma de subconjuntos","Con B=2, una transformada por submáscaras produce F=[2,5,7,17]. Recupera la tabla original A mostrando las restas de cada bit.", ["Para el bit 0, resta F[0] de F[1] y F[2] de F[3].", "Para el bit 1, usa la tabla actualizada y resta las entradas que no tienen ese bit."], "Después del bit 0 queda [2,3,7,10]. Después del bit 1 queda A=[2,3,5,7]. Para comprobarlo, transforma A: la primera pasada da [2,5,5,12] y la segunda [2,5,7,17]. Cada resta retira la contribución agregada por su dimensión; no necesitas dividir ni enumerar subconjuntos."),
  ]),

  'usaco-plat-plat-conclusion': extend('usaco-plat-plat-conclusion',100,[
    s("Precisar qué representa la estructura","Justo antes de responder un límite W, DSU debe representar exactamente las componentes del grafo con todas las aristas de peso≤W. Al principio cada vértice está solo. Incorporar una arista une precisamente las dos componentes que esa conexión enlaza, o no cambia nada si ya estaban unidas.\n\nEl bucle debe utilizar ≤, incluyendo aristas empatadas con el límite. Reordenar es válido porque ninguna consulta modifica la red ni depende de una respuesta previa. Si el enunciado añadiera esa dependencia, este barrido ya no estaría justificado."),
    s("Contar el costo y buscar errores concretos","Cada arista se incorpora una sola vez. Ordenar cuesta O((m+q) log(m+q)); las operaciones DSU añaden un costo amortizado casi constante. Guardar ciudades, aristas y consultas requiere O(n+m+q) memoria.\n\nPrueba una red sin aristas, componentes separadas, aristas paralelas y límites justo antes y justo en un peso. Al unir vértices ya conectados, no vuelvas a sumar los tamaños. Una búsqueda directa en redes pequeñas sirve para contrastar las respuestas del barrido."),
    s("Elegir otras combinaciones por sus operaciones","Si cambian valores y preguntas sumas en caminos de un árbol fijo, HLD convierte cada camino en intervalos. Si cada consulta menciona pocas marcas de un árbol enorme, un árbol virtual conserva su conexión. Si una DP genera mínimos de rectas, puedes estudiar CHT.\n\nEn cada caso escribe qué representa el dato y qué operación necesitas. Después comprueba la condición que permite acelerarla: estructura fija, información resumible, pendientes ordenadas o consultas monótonas. Reconocer el nombre de una técnica no prueba que sus condiciones se cumplan."),
    s("Conservar el argumento de cada optimización","La versión lenta establece qué respuesta buscas. Cada optimización debe conservarla usando una propiedad concreta: asociatividad, monotonía, reducción de tamaño o una cota amortizada. Intenta quitar esa propiedad y construir un contraejemplo; así identificas qué restricción es necesaria.\n\nPor ejemplo, ordenar estados de una DP solo es válido si conserva sus dependencias. Una sparse table con bloques superpuestos exige que repetir elementos no altere el agregado. Un conjunto de ejemplos favorables ayuda a depurar, pero no sustituye esas justificaciones."),
  ],[
    p('red-umbral',"Ciudades alcanzables con un límite","Lee n m q (1≤n≤100000, 0≤m≤100000, 1≤q≤100000), m aristas no dirigidas u v w con 0≤w≤10⁹ y q consultas v W. Para cada consulta imprime cuántos vértices puedes alcanzar desde v usando aristas de peso≤W, incluido v. Conserva el orden de entrada.", ["Ordena consultas por W y agrega aristas con un puntero sobre la lista ordenada por peso.", "Guarda en DSU el tamaño de cada componente y un índice original para cada consulta."], "Antes de contestar W, incorpora todas las aristas con peso≤W. Por inducción sobre esas inserciones, DSU representa exactamente la conectividad del subgrafo permitido. El tamaño de la componente de v es la cantidad buscada. Guarda la respuesta según el índice de la consulta y al final imprime en orden original.", String.raw`#include <iostream>
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
    r('diagnostico',"Identificar condiciones que faltan","Una propuesta compone funciones usando dos bloques superpuestos de sparse table. Otra usa la deque de CHT con consultas x en cualquier orden. Explica qué propiedad falta en cada una y cómo cambiarías la solución.", ["Los bloques superpuestos repiten algunos elementos; pregunta si esa repetición conserva la operación.", "Una consulta que retrocede puede necesitar una recta que antes se retiró del frente."], "La composición no es idempotente: aplicar dos veces una función puede cambiar el resultado. Utiliza una tabla disjunta o un árbol de segmentos que respete el orden. La deque de CHT retira rectas apoyándose en consultas monótonas; con x arbitrarios conserva la envolvente y busca por binaria, si sus pendientes están ordenadas. Para inserciones arbitrarias puedes usar Li Chao. En ambos casos debe cambiar la estructura o demostrarse la condición que falta."),
  ]),
};
