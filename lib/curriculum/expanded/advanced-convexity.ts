import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedConvexityExpansions: Record<string, LessonExpansion> = {
  'usaco-adv-line-container': extend('usaco-adv-line-container',105,[
    s("Elegir las posiciones que organiza el árbol","Li Chao divide posiciones de consulta, no pendientes. Puedes trabajar sobre un intervalo entero [L,R] o, si conoces todas las x futuras, ordenarlas y eliminar repetidas. En el segundo caso divide índices, pero evalúa cada recta en la coordenada original: los espacios entre x pueden ser desiguales.\n\nRecolectar coordenadas no permite adelantar inserciones. Después debes ejecutar las operaciones en su orden original, para que cada pregunta use solo las rectas que ya existían. Representa explícitamente un nodo vacío; guardar allí una recta cero introduciría una opción inexistente que podría ganar."),
    s("Conservar la mejor recta en el punto medio","Un nodo de índices [l,r] guarda una recta f. Si está vacío, inserta g y termina. Si no, calcula m=(l+r)/2 y compara g con f en x[l] y x[m] antes de intercambiar. Si g gana en el medio, intercámbialas: f será la ganadora y g la perdedora.\n\nSi l=r, termina. Si las dos comparaciones iniciales dieron resultados distintos, inserta la perdedora en la mitad izquierda; en caso contrario, en la derecha. Esa regla conserva la información necesaria pese al intercambio. Para mínimos de valores bastan comparaciones estrictas; si también debes recuperar un índice con desempate, aplícalo consistentemente en cada comparación."),
    s("Demostrar que no hace falta guardar ambas mitades","La diferencia de dos rectas es lineal y cambia de signo a lo sumo una vez. Una vez que el nodo conserva la ganadora en el medio, la otra solo puede superarla en un lado. Las comparaciones del extremo y del medio identifican ese lado; en el opuesto no puede mejorar la respuesta.\n\nPara consultar x, evalúa todas las rectas de su camino desde la raíz hasta la hoja y toma el mínimo. Cada candidata que no quedó en un ancestro fue enviada a la mitad donde todavía podía ganar. Si x estaba fuera de esa mitad, otra recta conservada ya la superaba allí. Así no pierdes el mínimo global."),
    s("Costos y funciones que rompen la prueba","Con σ coordenadas comprimidas, insertar y consultar cuestan O(log σ) y el árbol completo ocupa O(σ). En un dominio entero implícito puedes crear nodos según se necesitan, con altura O(log(R−L+1)). Entre rectas paralelas, conserva la de menor intercepto; el algoritmo básico también funciona sin ese descarte, aunque pueda recorrer una rama innecesaria.\n\nNo sustituyas rectas por funciones arbitrarias: f(x)=0 y g(x)=1−x² dejan ganar a f en el medio y a g en ambos extremos, así que enviar g a una sola mitad perdería respuestas. Revisa también m·x+b; con las cotas del ejercicio cabe en long long. Prueba pendientes repetidas y consultas antes de insertar."),
  ],[
    p('li-chao',"Consultar rectas que llegan sin orden","Lee q (1≤q≤100000), con al menos una consulta. «1 m b» inserta y=m·x+b y «2 x» pide el menor valor entre las rectas insertadas hasta entonces. Se cumple |m|,|b|,|x|≤10⁶. Imprime el mínimo o NINGUNA si no hay rectas. No hay orden especial en pendientes ni consultas.", ["Puedes recolectar las x para comprimir el dominio, pero después procesa todas las operaciones en su orden original.", "Guarda en cada nodo la ganadora en el medio y envía la otra solo al lado donde aún puede ganar."], "Dos rectas cambian de orden a lo sumo una vez. Por eso, al conservar la ganadora central, la perdedora necesita guardarse en una sola mitad. La consulta evalúa el camino completo hasta su coordenada y reúne todas las candidatas que aún podían mejorar allí. Ordenar coordenadas y ejecutar operaciones cuesta O(q log q), con O(q) memoria.", String.raw`#include <iostream>
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
    r('dos-cruces',"Una pareja de funciones con dos cruces","Compara f(x)=0 y g(x)=1−x² en [−2,2]. ¿Cuál es menor en x=0 y en ambos extremos? Explica qué ocurriría si enviaras la perdedora del medio a una sola mitad.", ["En el centro g vale 1; en los dos extremos vale −3.", "Las funciones se cruzan en −1 y 1."], "En x=0 gana f, con 0 frente a 1. En x=−2 y x=2 gana g, con −3 frente a 0. Guardar g solo en una mitad perdería su mejora en la otra. Li Chao para rectas depende de que haya a lo sumo un cambio de orden; que una función sea fácil de evaluar no garantiza esa propiedad."),
  ]),

  'usaco-adv-lagrange': extend('usaco-adv-lagrange',125,[
    s("Resolver la selección después de fijar un precio","Queremos elegir exactamente K posiciones no consecutivas, con beneficios ai≥0. Sea F(k) el mejor beneficio con k elecciones. La DP que guarda posición y cantidad cuesta O(nK). Para un precio λ, en cambio, maximiza beneficio−λ·cantidad y deja de exigir una cantidad fija.\n\nAl procesar i, compara omitirlo, usando el óptimo hasta i−1, con tomarlo, usando el óptimo hasta i−2 más ai−λ. Cada estado guarda valor penalizado y cantidad. Compara primero el valor y, en empate, elige mayor cantidad. Evaluar un precio cuesta O(n) tiempo y O(1) memoria adicional; la cantidad sirve para orientar la búsqueda, no como dimensión de la tabla."),
    s("Demostrar la concavidad que permite recuperar K","Toma soluciones óptimas A y B de tamaños k−1 y k+1. En su diferencia simétrica, las posiciones forman caminos alternantes: dos vecinos no pueden pertenecer ambos a A ni ambos a B. Cada componente tiene una diferencia de cantidades entre −1 y 1. Como B tiene dos elementos más, alguna componente contiene uno más de B.\n\nIntercambia en esa componente las pertenencias a A y B. Obtienes dos conjuntos independientes de tamaño k, con la misma suma total de beneficios que antes. Los elementos comunes no crean conflictos porque eran compatibles con ambas soluciones. Cada nuevo conjunto vale como máximo F(k), así que F(k−1)+F(k+1)≤2F(k). Esta concavidad depende de la estructura de camino y no se transfiere a un grafo cualquiera."),
    s("Buscar el precio que soporta la cantidad pedida","Define G(λ)=max_k(F(k)−λk). Con desempate hacia mayor cantidad, el conteo elegido no aumenta al subir λ. Como F es cóncava y entera, sus ganancias marginales son enteras. Busca el mayor λ entero cuyo conteo sea al menos K; en ese precio, F(K)=G(λ)+λK.\n\nNo limites la búsqueda a precios positivos. En [4,100,4], F(1)=100 y F(2)=8; λ=−92 hace empatar ambos conteos con valor penalizado 192. El desempate elige dos y recupera 192−92·2=8. Puedes buscar en [−B,B], con B=1+Σai: el extremo negativo favorece la máxima cantidad y el positivo deja cero elecciones."),
    s("Entender saltos y comprobar la recuperación","El conteo puede saltar de más de K a menos de K. Si corresponde a un tramo lineal de F, la fórmula recupera el valor intermedio sin exigir que una evaluación elija exactamente K. Sin concavidad, podría devolver un punto por encima de cualquier solución real; la monotonía del conteo no basta para evitarlo.\n\nLa búsqueda usa O(log B) evaluaciones, con costo O(n log B). Guarda valores en long long: una penalización multiplicada por la cantidad puede ser mucho mayor que un beneficio. El programa devuelve el valor, no reconstruye una selección. Compara todos los K de arreglos pequeños con la DP O(nK), incluyendo ceros, K=1, K=⌈n/2⌉ y precios negativos."),
  ],[
    p('seleccion',"Elegir K posiciones sin vecinos consecutivos","Lee n K, con 1≤n≤100000 y 1≤K≤⌈n/2⌉, y n beneficios entre 0 y 10⁶. Debes elegir exactamente K posiciones sin elegir dos consecutivas. Imprime el mayor beneficio total; no se pide reconstruir las posiciones.", ["Con precio λ, cada posición elegida aporta ai−λ a una DP de camino.", "Desempata hacia mayor cantidad y busca el mayor precio cuyo conteo sea al menos K."], "El intercambio de una componente alternante entre selecciones de tamaños k−1 y k+1 demuestra que F es discretamente cóncava. Por eso existe un precio entero de soporte para K. La DP calcula G(λ) y un conteo monótono; la búsqueda encuentra ese precio y devuelve G(λ)+λK. El tiempo es O(n log(1+Σai)).", String.raw`#include <iostream>
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
    r('sin-concavidad',"Un óptimo que ningún precio hace ganar","Supón F(0)=0, F(1)=1 y F(2)=4. ¿Existe λ que haga óptima la cantidad 1 al maximizar F(k)−λk? ¿Qué valor recuperaría G(λ)+λK para K=1 y λ=2?", ["Para que k=1 venza a k=0 necesitas 1−λ≥0.", "Para que venza a k=2 necesitas 1−λ≥4−2λ."], "Las condiciones exigen a la vez λ≤1 y λ≥3, así que no existe tal precio. Con λ=2, los valores penalizados son [0,−1,0] y G=0. La recuperación produciría 2, aunque F(1)=1. El punto intermedio queda por debajo de la envolvente cóncava; este caso muestra por qué buscar un precio requiere una prueba adicional a la monotonía del conteo."),
  ]),

  'usaco-adv-slope-trick': extend('usaco-adv-slope-trick',115,[
    s("Representar la DP como función de un límite","Queremos cambiar ai por bi no decrecientes, pagando Σ|ai−bi|. Define Fi(x) como el menor costo del prefijo terminado exactamente en x. La transición es Fi(x)=|x−ai|+min(y≤x)Fi−1(y). Guarda en su lugar Gi(x)=min(y≤x)Fi(y): el menor costo si el último valor no supera x.\n\nGi es convexa, no creciente y termina horizontal. Una bisagra izquierda (p−x)+ significa max(0,p−x): tiene pendiente −1 antes de p y cero después. Representa Gi(x)=C+Σ(p en H)(p−x)+, donde H es un multiconjunto en un max-heap y C es el mínimo global. Inicialmente H está vacío y C=0."),
    s("Derivar las operaciones sobre el heap","Cuando llega a, agrega |x−a|=(a−x)++(x−a)+ a la función anterior. Después toma el mínimo de prefijo, que aplana la parte creciente. Esa pendiente positiva comienza en m=max(a,máximoAnterior), por lo que debes restar (x−m)+.\n\nComo m≥a, (x−a)+−(x−m)+=(m−a)+(a−x)+−(m−x)+. Al sustituir, conservas las bisagras anteriores, agregas dos en a, retiras una en m y aumentas C en m−a. Por eso el algoritmo inserta a dos veces, extrae el máximo m y acumula m−a. Esta identidad conserva toda la función, no solamente su mínimo."),
    s("Seguir el estado para [3,1,2]","Al procesar 3, inserta dos treses y retira uno: H={3}, C=0. Al procesar 1, inserta dos unos y retira 3: H={1,1}, C=2. Al procesar 2, inserta dos doses y retira uno: H={2,1,1}, C=2. El costo mínimo final es dos.\n\nLo alcanza [1,1,2], que cambia el primer valor en dos unidades, y también [2,2,2], que cambia los dos primeros en una unidad cada uno. El heap representa puntos donde cambia la pendiente; sus elementos ordenados no son automáticamente una secuencia óptima. Si solo piden el costo, C contiene toda la respuesta necesaria."),
    s("Distinguir esta variante de una biblioteca general","Una representación más general usa bisagras izquierdas y derechas, con un max-heap y un min-heap. Sumar valores absolutos añade quiebres, trasladar el argumento mueve sus posiciones y tomar mínimos de prefijo aplana la parte creciente. Cada transformación necesita su propia regla demostrada.\n\nAquí cada elemento hace O(log n) trabajo y la memoria es O(n), aunque los ai lleguen a 10⁹. Las esquinas enteras garantizan un minimizador entero. Para reconstruir guarda información adicional o utiliza un método de bloques de regresión isotónica. Comprueba el costo contra una DP de dominio pequeño, con secuencias crecientes, decrecientes, repetidas y negativas."),
  ],[
    p('ajustar',"Ajustar valores para que no disminuyan","Lee n (1≤n≤200000) y n enteros ai con |ai|≤10⁹. Puedes reemplazarlos por enteros bi no decrecientes. Imprime el mínimo costo Σ|ai−bi|. Solo se pide el costo, no la secuencia final.", ["Representa el mínimo de prefijo de la DP mediante bisagras izquierdas y una constante.", "Inserta ai dos veces en el max-heap, extrae su máximo m y agrega m−ai al costo."], "La identidad de bisagras representa exactamente sumar |x−ai| y aplanar la parte creciente al tomar el mínimo de prefijo. El heap guarda los puntos de cambio de pendiente y C el mínimo. Cada dato requiere dos inserciones y una extracción: O(n log n) tiempo y O(n) memoria. Al terminar, devuelve C.", String.raw`#include <iostream>
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
    r('bisagra',"Verificar una identidad por tres regiones","Con a=2 y m=5, verifica (x−a)+−(x−m)+=(m−a)+(a−x)+−(m−x)+ para x=0,3,7, donde z+=max(0,z). Explica el significado de la constante m−a.", ["Antes de a, los dos términos del lado izquierdo valen cero.", "Después de m, la diferencia del lado izquierdo ya no depende de x."], "En x=0 obtienes 0=3+2−5. En x=3 obtienes 1−0=3+0−2. En x=7 obtienes 5−2=3+0−0. La constante m−a=3 incrementa el mínimo C cuando el nuevo valor obliga a ajustar una esquina anterior mayor. Los otros términos redistribuyen las pendientes para conservar la función en las tres regiones."),
  ]),
};
