import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedConvexityExpansions: Record<string, LessonExpansion> = {
  'usaco-adv-line-container': extend('usaco-adv-line-container',105,[
    s('Elegir un dominio entero o coordenadas conocidas',`Li Chao organiza posiciones de consulta, no pendientes. Si todas las x pertenecen a un intervalo entero [L,R], divídelo por puntos medios hasta hojas. Si conoces todas las x que serán consultadas, ordénalas y elimina repetidos; el árbol divide índices de esa lista, pero evalúa las rectas en sus coordenadas originales. Espacios desiguales entre x no son un problema: lo que importa es su orden.

Aunque recolectes coordenadas leyendo las operaciones, las inserciones y consultas se ejecutan después en su orden original. Una consulta no puede usar una recta que aparece más tarde. La compresión solo prepara el dominio; no convierte las rectas futuras en candidatas actuales. Un árbol vacío debe distinguirse de una recta de valor cero, que sería una candidata real y a veces incorrecta.`),
    s('Inserción precisa: conservar el ganador del medio',`Un nodo representa índices [l,r] y guarda una recta f, o está vacío. Para insertar g, si está vacío guárdala y termina. Calcula m=(l+r)/2 y compara g con f en x[l] y x[m], antes de intercambiar nada. Si g gana en el medio, intercambia f y g: ahora f es la mejor allí y g la perdedora.

Si l=r, termina. Si los resultados de las dos comparaciones iniciales eran distintos, inserta la perdedora en el hijo izquierdo; de otro modo, insértala en el derecho. Esta formulación maneja el intercambio sin cambiar las condiciones. Las comparaciones pueden ser estrictas: en empates cualquier recta que produzca el mismo mínimo sirve si solo buscas el valor. Para recuperar índices con desempates, incorpora esa regla en cada comparación.`),
    s('Por qué basta conservar una sola mitad de la perdedora',`La diferencia g(x)-f(x) es una función lineal, así que cambia de signo a lo sumo una vez. Después de conservar la ganadora en el medio, la otra solo puede mejorar en un lado. Las comparaciones entre extremo y medio identifican ese lado. En el lado descartado, la perdedora nunca mejora a la recta que quedó en el nodo y puede olvidarse.

Para consultar x, evalúa todas las rectas de la raíz a su hoja y toma el mínimo. La recta óptima original no se pierde: cada vez que no quedó en un ancestro, solo fue enviada a una mitad donde aún podía ganar. Si x no pertenecía a esa mitad, otra recta del camino ya la dominaba en x. Ese argumento inductivo garantiza que el mínimo del camino es el mínimo de todas las rectas insertadas.`),
    s('Paralelas, complejidad y familias que no cumplen la prueba',`Dos rectas paralelas nunca intercambian su orden; la de mayor intercepto puede descartarse. El algoritmo básico también las maneja aunque a veces recorra una rama innecesaria. Con σ coordenadas comprimidas, insertar y consultar cuestan O(log σ), y un arreglo completo de nodos ocupa O(σ). En un dominio implícito se pueden crear nodos bajo demanda y la altura depende de log(R-L+1).

No reemplaces rectas por funciones arbitrarias: dos parábolas con distintos términos cuadráticos pueden cruzarse dos veces y la perdedora del medio podría ganar en ambos extremos. La prueba de una sola mitad dejaría de valer. También comprueba overflow al evaluar m·x+b; con |m|,|x|≤10⁶ y |b|≤10⁶, long long basta. Prueba consultas antes de insertar, pendientes repetidas, consultas en orden descendente y rectas óptimas solo en un extremo.`),
  ],[
    p('li-chao','Rectas que llegan sin orden','Entrada: q (1≤q≤100000), con al menos una consulta. Operaciones «1 m b» insertan y=m·x+b; «2 x» consulta el mínimo entre las rectas insertadas hasta ese momento. |m|,|b|,|x|≤10⁶. Imprime el mínimo o NINGUNA si todavía no hay rectas. No hay restricciones de orden.', ['Recolecta todas las coordenadas consultadas, pero procesa después las operaciones en su orden original.', 'Cada nodo conserva la ganadora en su punto medio y envía la perdedora a una sola mitad.'], 'La diferencia de dos rectas cambia de signo a lo sumo una vez. Por ello, la perdedora del medio solo necesita conservarse en una mitad. La consulta evalúa el camino completo y no pierde ninguna candidata que pudiera mejorar en su coordenada. Tiempo O(q log q), memoria O(q).', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;
struct Line {
    long long m = 0, b = 0;
    long long at(long long x) const { return m * x + b; }
};
struct Op {
    int type;
    long long a, b;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    vector<Op> ops;
    vector<long long> xs;
    while (q--) {
        Op o;
        cin >> o.type >> o.a;
        o.b = 0;
        if (o.type == 1)
            cin >> o.b;
        else
            xs.push_back(o.a);
        ops.push_back(o);
    }
    sort(xs.begin(), xs.end());
    xs.erase(unique(xs.begin(), xs.end()), xs.end());
    int n = xs.size();
    vector<Line> t(4 * n);
    vector<bool> has(4 * n);
    function<void(int, int, int, Line)> insert = [&](int v, int l, int r, Line g) {
        if (!has[v]) {
            t[v] = g;
            has[v] = true;
            return;
        }
        int mid = (l + r) / 2;
        bool left = g.at(xs[l]) < t[v].at(xs[l]),
             middle = g.at(xs[mid]) < t[v].at(xs[mid]);
        if (middle)
            swap(t[v], g);
        if (l == r)
            return;
        if (left != middle)
            insert(2 * v, l, mid, g);
        else
            insert(2 * v + 1, mid + 1, r, g);
    };
    for (auto o : ops) {
        if (o.type == 1)
            insert(1, 0, n - 1, {o.a, o.b});
        else {
            long long ans = 4000000000000000000LL;
            int p = lower_bound(xs.begin(), xs.end(), o.a) - xs.begin(), v = 1, l = 0,
                r = n - 1;
            while (true) {
                if (has[v])
                    ans = min(ans, t[v].at(o.a));
                if (l == r)
                    break;
                int mid = (l + r) / 2;
                if (p <= mid) {
                    v *= 2;
                    r = mid;
                } else {
                    v = v * 2 + 1;
                    l = mid + 1;
                }
            }
            if (ans == 4000000000000000000LL)
                cout << "NINGUNA\n";
            else
                cout << ans << '\n';
        }
    }
}`, [{input:'6\n2 1\n1 2 1\n1 -1 7\n2 1\n2 6\n2 0\n',output:'NINGUNA\n3\n1\n1\n'}, {input:'4\n1 3 8\n1 3 2\n2 -2\n2 4\n',output:'-4\n14\n'}, {input:'5\n1 0 10\n2 100\n1 -2 0\n2 100\n2 -100\n',output:'10\n-200\n10\n'}]),
    r('dos-cruces','Por qué no sirven funciones arbitrarias','Compara f(x)=0 y g(x)=1-x² en el dominio [-2,2]. ¿Quién gana para mínimos en x=0 y en ambos extremos? ¿Qué problema causa esto a una inserción que solo conserva una mitad de la perdedora?', ['g(0)=1 y g(-2)=g(2)=-3.', 'La diferencia tiene dos cruces, en -1 y 1.'], 'En el medio gana f con 0 frente a 1. En ambos extremos gana g con -3 frente a 0. Si g se envía solo a una mitad, se pierde su mejora en la otra. Li Chao para rectas se apoya en que dos candidatas se cruzan como máximo una vez; esta pareja viola esa condición. No basta que cada función sea fácil de evaluar para usar la misma estructura.'),
  ]),

  'usaco-adv-lagrange': extend('usaco-adv-lagrange',125,[
    s('Un caso completo: elegir posiciones no consecutivas',`Tenemos n beneficios ai≥0 y debemos elegir exactamente K posiciones, sin elegir dos consecutivas. Sea F(k) el máximo beneficio con k posiciones. Una DP con dimensiones posición y cantidad cuesta O(nK). Para una penalización λ, elimina la cantidad del estado y maximiza beneficio-λ·cantidad.

Recorre el arreglo con dos estados anteriores. Para la posición i, compara omitirla, conservando el óptimo hasta i-1, con tomarla, usando el óptimo hasta i-2 más ai-λ. Cada estado guarda un par (valorPenalizado,cantidad). Compara primero el valor y, en empate, elige la mayor cantidad. Así una evaluación de λ cuesta O(n) tiempo y O(1) memoria adicional. La cantidad se conserva para orientar la búsqueda, no para indexar una tabla.`),
    s('Prueba de concavidad para este problema, no para cualquiera',`Toma soluciones óptimas A y B con k-1 y k+1 posiciones. En su diferencia simétrica, las posiciones forman caminos alternantes: no puede haber vecinos ambos de A ni ambos de B porque cada solución es independiente. Cada componente tiene diferencia de cantidades entre -1 y 1. Como B tiene dos elementos más en total, existe una componente con un elemento más de B que de A.

Intercambia la pertenencia a A y B dentro de esa componente. Obtienes dos conjuntos independientes de tamaño k; los elementos comunes no crean conflictos, pues eran compatibles con ambas soluciones. La suma de beneficios de los nuevos conjuntos es la misma que antes. Como cada conjunto nuevo vale como máximo F(k), resulta F(k-1)+F(k+1)≤2F(k). Esa es la concavidad discreta: las ganancias marginales no aumentan. Esta prueba usa la estructura de camino; no se transfiere automáticamente a cualquier grafo.`),
    s('Buscar el precio y recuperar el valor exacto',`Define G(λ)=max_k(F(k)-λk). Con el desempate hacia mayor cantidad, el conteo óptimo no aumenta cuando λ aumenta. Como F es cóncava y entera, sus pendientes marginales son enteras; busca el mayor λ entero cuya evaluación usa al menos K posiciones. En ese precio, K pertenece al punto o tramo de empate soportado por la recta y F(K)=G(λ)+λK.

El precio puede ser negativo. En [4,100,4], F(1)=100 y F(2)=8; para forzar dos posiciones hay que premiar su cantidad. El precio de soporte de K=2 es λ=-92: ambos conteos dan valor penalizado 192, el desempate elige dos y recuperamos 192-92·2=8. Buscar solo precios positivos fallaría. Un intervalo seguro es [-B,B], con B=1+Σai: sus extremos fuerzan respectivamente la máxima cantidad y cero.`),
    s('Saltos, complejidad y comprobación de la recuperación',`La cantidad óptima puede saltar de un valor mayor que K a uno menor. Eso no obliga a encontrar una solución penalizada que use exactamente K: si el salto corresponde a un tramo lineal de F, la fórmula recupera su valor intermedio. Sin la prueba de concavidad, esa misma fórmula podría devolver un punto de la envolvente por encima del valor realmente alcanzable.

La búsqueda requiere O(log B) evaluaciones, total O(n log B), y el programa guarda solo valores y cantidades, no una selección reconstruida. Usa long long porque la penalización multiplicada por el número de posiciones puede superar ampliamente cada beneficio. Para verificar, calcula F(k) con la DP O(nK) en arreglos pequeños y compara todos los K válidos. Incluye ceros, K=1, K=⌈n/2⌉ y el ejemplo donde la penalización necesaria es negativa.`),
  ],[
    p('seleccion','Elegir exactamente K posiciones separadas','Entrada: n K, con 1≤n≤100000 y 1≤K≤⌈n/2⌉, seguida por n beneficios entre 0 y 10⁶. Elige exactamente K posiciones, sin elegir dos consecutivas, y maximiza la suma. Imprime únicamente el beneficio máximo.', ['Para un precio λ, una DP de camino maximiza ai-λ por cada posición elegida.', 'Desempata hacia más posiciones y busca el mayor precio cuya cantidad sea al menos K.'], 'La diferencia simétrica de dos selecciones independientes en un camino demuestra concavidad discreta del óptimo por cantidad. Por ello existe un precio entero de soporte para K. La DP penalizada calcula G y un conteo monótono; la búsqueda recupera F(K)=G(λ)+λK en O(n log(1+Σai)).', String.raw`#include <iostream>
#include <vector>
using namespace std;
struct State {
    long long value;
    int count;
};
State better(State a, State b) {
    if (a.value != b.value)
        return a.value > b.value ? a : b;
    return a.count > b.count ? a : b;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, K;
    cin >> n >> K;
    vector<long long> a(n);
    long long B = 1;
    for (auto &x : a) {
        cin >> x;
        B += x;
    }
    auto solve = [&](long long price) {
        State prev2{0, 0}, prev{0, 0};
        for (long long x : a) {
            State take{prev2.value + x - price, prev2.count + 1};
            State cur = better(prev, take);
            prev2 = prev;
            prev = cur;
        }
        return prev;
    };
    long long lo = -B, hi = B;
    while (lo < hi) {
        long long mid = lo + (hi - lo + 1) / 2;
        if (solve(mid).count >= K)
            lo = mid;
        else
            hi = mid - 1;
    }
    cout << solve(lo).value + lo * K << '\n';
}`, [{input:'3 2\n4 100 4\n',output:'8\n'}, {input:'5 2\n5 1 4 1 5\n',output:'10\n'}, {input:'4 2\n0 0 0 0\n',output:'0\n'}]),
    r('sin-concavidad','Un valor que ningún precio recupera','Sea F(0)=0,F(1)=1,F(2)=4. ¿Existe λ para el cual k=1 maximice F(k)-λk? ¿Qué valor produce la envolvente al evaluar K=1 con λ=2?', ['Para vencer a k=0 se necesita λ≤1.', 'Para vencer a k=2 se necesita λ≥3.'], 'No existe: k=1 exigiría simultáneamente 1-λ≥0, es decir λ≤1, y 1-λ≥4-2λ, es decir λ≥3. Con λ=2, los valores penalizados son [0,-1,0] y G=0. La recuperación G+λ·1 daría 2, pero F(1)=1. La envolvente cóncava está por encima del punto intermedio, demostrando por qué la monotonía del conteo y la búsqueda binaria no bastan sin concavidad.'),
  ]),

  'usaco-adv-slope-trick': extend('usaco-adv-slope-trick',115,[
    s('Trabaja con el mínimo de prefijo y una bisagra',`Para ajustar ai a una secuencia no decreciente bi, sea Fi(x) el costo mínimo de los primeros i valores terminando con bi=x. La transición es Fi(x)=|x-ai|+min(y≤x)Fi-1(y). Define Gi(x)=min(y≤x)Fi(y). Mantendremos Gi, que es convexa, no creciente y finalmente horizontal.

Escribe una bisagra izquierda como (p-x)+=max(0,p-x). La representación será Gi(x)=C+Σ(p en H)(p-x)+, donde H es un multiconjunto guardado en max-heap y C es el mínimo global. Cada bisagra tiene pendiente -1 antes de p y cero después; su punto p registra un cambio de pendiente. Inicialmente G0=0, H vacío y C=0. No almacenamos valores para cada posible entero x.`),
    s('Derivar por qué se inserta dos veces y se borra una',`Al llegar a, suma |x-a|=(a-x)++(x-a)+ a la función anterior. La pendiente positiva del término derecho debe aplanarse al tomar el mínimo de prefijo. El punto donde empieza esa pendiente positiva es m=max(a,máximoAnterior), porque antes todavía puede quedar alguna bisagra izquierda activa. Por tanto restamos (x-m)+.

Como m≥a, se cumple (x-a)+-(x-m)+=(m-a)+(a-x)+-(m-x)+. Sustituyendo, la nueva función conserva las bisagras antiguas, agrega dos bisagras en a, elimina una bisagra en m y aumenta C en m-a. Ese es el algoritmo: inserta a dos veces en el max-heap, extrae su máximo m y acumula m-a. Después de cada paso el heap crece en uno. La identidad demuestra la operación; no es una receta basada únicamente en ejemplos.`),
    s('Traza de pendientes y costo para una secuencia',`Para [3,1,2], al procesar 3 insertas [3,3], extraes 3 y queda H=[3],C=0. Al procesar 1 insertas dos unos, extraes 3 y sumas 2: H=[1,1],C=2. Al procesar 2 insertas dos doses, extraes un 2 y no cambia C: H=[2,1,1],C=2.

La respuesta es 2. La secuencia ajustada [1,1,2] cuesta |3-1|+0+0=2; también [2,2,2] cuesta 1+1+0=2. El heap representa una función de costos posibles, no necesariamente una secuencia óptima elegida. Leer sus elementos ordenados como si fueran directamente los bi sería una interpretación injustificada. El mínimo C basta si solo piden el costo.`),
    s('Generalización, convexidad y reconstrucción',`Una biblioteca más general representa una función convexa como mínimo más bisagras izquierdas y derechas, usando un max-heap y un min-heap. Agregar valores absolutos añade esquinas; trasladar el argumento desplaza sus posiciones; tomar mínimo de prefijo elimina la parte creciente. Cada transformación necesita una regla demostrada que conserve la función, no solo su valor mínimo.

La versión del ejercicio realiza O(log n) trabajo por elemento y usa O(n) memoria, independientemente de que los ai lleguen a 10⁹. Los valores ajustados pueden ser enteros: como todas las esquinas son enteras, existe un minimizador entero. Si necesitas reconstrucción, guarda información adicional de etapas o usa un algoritmo de bloques para regresión isotónica; el costo por sí solo no especifica todos los predecesores. Compara contra una DP en un dominio pequeño, especialmente secuencias ya crecientes, estrictamente decrecientes, repetidas y negativas.`),
  ],[
    p('ajustar','Ajustar una secuencia con costo absoluto','Entrada: n (1≤n≤200000) y n enteros ai con |ai|≤10⁹. Puedes sustituirlos por enteros bi no decrecientes. Imprime el mínimo de Σ|ai-bi|. Solo se pide el costo, no la secuencia ajustada.', ['Representa el mínimo de prefijo de la DP con bisagras izquierdas.', 'Inserta cada ai dos veces, extrae el máximo y suma máximo-ai.'], 'La identidad de bisagras describe exactamente sumar |x-ai| y aplanar la parte creciente de la función convexa. El heap conserva sus cambios de pendiente y C su mínimo global. Cada elemento requiere dos inserciones y una extracción: O(n log n) tiempo y O(n) memoria.', String.raw`#include <iostream>
#include <queue>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    priority_queue<long long> h;
    long long cost = 0;
    while (n--) {
        long long a;
        cin >> a;
        h.push(a);
        h.push(a);
        long long m = h.top();
        h.pop();
        cost += m - a;
    }
    cout << cost << '\n';
}`, [{input:'3\n3 1 2\n',output:'2\n'}, {input:'4\n1 2 2 9\n',output:'0\n'}, {input:'3\n5 2 4\n',output:'3\n'}]),
    r('bisagra','Comprobar la identidad por regiones','Para a=2 y m=5, verifica la identidad (x-a)+-(x-m)+=(m-a)+(a-x)+-(m-x)+ en x=0,3,7. Explica qué representa el término constante m-a.', ['A la izquierda de a, ambos términos del lado izquierdo son cero.', 'A la derecha de m, la diferencia se vuelve constante.'], 'En x=0, el lado izquierdo es 0 y el derecho 3+2-5=0. En x=3, el izquierdo es 1-0=1 y el derecho 3+0-2=1. En x=7, el izquierdo es 5-2=3 y el derecho 3+0-0=3. El término m-a=3 es el incremento del mínimo C cuando una esquina anterior demasiado grande debe acomodarse al nuevo valor; los otros términos redistribuyen los cambios de pendiente sin perder la función.'),
  ]),
};
