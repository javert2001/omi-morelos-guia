import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedStructuresOneExpansions: Record<string, LessonExpansion> = {
  'usaco-adv-springboards': extend('usaco-adv-springboards',90,[
    s('Demuestra la dominancia usando futuras consultas',`Una oferta (a,b) permite obtener ahorro b cuando la consulta exige alcance x≤a. La oferta (c,d) domina a (a,b) si c≥a y d≥b: para cualquier consulta que admite la primera, la segunda también es válida y nunca es peor. Esta definición debe incluir todas las variables relevantes del problema. Si hubiera además un costo por usar ofertas lejanas, comparar únicamente alcance y ahorro ya no sería suficiente.

Podemos eliminar dominadas porque las operaciones solo insertan ofertas. Si se permitiera borrar la dominante, una oferta descartada podría volver a ser necesaria. La frontera representa la información suficiente para responder futuras consultas bajo ese modelo, no una lista completa de todas las ofertas que alguna vez existieron.`),
    s('Invariante del mapa y procedimiento de inserción',`Ordena las ofertas retenidas por alcance creciente. Sus ahorros deben disminuir estrictamente: si una oferta posterior tuviera ahorro mayor o igual, dominaría a la anterior. Para insertar (a,b), busca it=lower_bound(a). Si existe y su ahorro≥b, rechaza la nueva oferta porque ese sucesor ya la domina. Si existe con el mismo alcance y menor ahorro, elimina esa versión.

Inserta la nueva pareja y recorre sus predecesores: mientras su ahorro≤b, bórralos porque el nuevo alcance es mayor y su ahorro no es menor. Detente al encontrar un ahorro>b. No necesitas revisar predecesores anteriores, pues por el invariante sus ahorros son todavía mayores. El único sucesor que importa para rechazar era el primero, ya que los siguientes tienen ahorros menores.`),
    s('Prueba de consulta y contabilidad amortizada',`Para una consulta x, lower_bound(x) encuentra la primera oferta con alcance suficiente. Entre esa y las posteriores, los ahorros decrecen, así que la primera da el máximo. Si no existe, ninguna oferta sirve. Usa una señal separada de inexistencia: un ahorro negativo puede ser una respuesta legítima y no debe confundirse con cero o con un centinela arbitrario.

Una inserción puede borrar muchas ofertas, pero cada pareja insertada se borra como máximo una vez. A lo largo de q operaciones hay O(q) inserciones y borrados; las búsquedas e inserciones de map cuestan O(log q). El costo total es O(q log q), con O(q) memoria. No afirmes que cada operación individual tarda siempre O(log q): una sola puede retirar casi toda la frontera.`),
    s('De ofertas abstractas a una DP de transporte',`En problemas de moverse por una cuadrícula hacia coordenadas crecientes, un transporte puede ahorrar parte del costo normal de caminar. Un estado puede resumirse como coordenada alcanzada y ahorro acumulado. Un barrido ordena una coordenada y una frontera descarta estados peores en la otra, siempre después de derivar exactamente qué consultas permite cada estado.

Si un transporte termina donde otro empieza, el orden de eventos decide si pueden encadenarse: procesa finales antes de inicios cuando el modelo lo permite. Antes de intentar una solución geométrica completa, prueba la frontera por sí sola con ofertas repetidas, ahorros negativos y una inserción que domina a muchas anteriores. El ejercicio aísla ese componente; la clave de reutilizarlo es justificar la dominancia en el nuevo modelo y no asumirla porque dos estados tienen dos números.`),
  ],[
    p('frontera','Ofertas no dominadas','Entrada: q (1≤q≤100000). Cada operación es «1 a b» para insertar una oferta con alcance a y ahorro b, o «2 x» para consultar el máximo ahorro entre ofertas con a≥x. Todos los números tienen valor absoluto≤10⁹. Imprime el ahorro o NINGUNA. No se borran ofertas.', ['En la frontera ordenada por alcance, los ahorros decrecen estrictamente.', 'El sucesor puede rechazar una inserción y los predecesores pueden ser eliminados por ella.'], 'Se eliminan solo ofertas dominadas para toda consulta futura. El invariante de ahorros decrecientes permite responder con lower_bound. Cada oferta se inserta y elimina a lo sumo una vez, dando O(q log q) total.', String.raw`#include <iostream>
#include <map>
#include <iterator>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    map<long long, long long> f;
    while (q--) {
        int type;
        long long a;
        cin >> type >> a;
        if (type == 2) {
            auto it = f.lower_bound(a);
            if (it == f.end())
                cout << "NINGUNA\n";
            else
                cout << it->second << '\n';
        } else {
            long long b;
            cin >> b;
            auto it = f.lower_bound(a);
            if (it != f.end() && it->second >= b)
                continue;
            if (it != f.end() && it->first == a)
                it = f.erase(it);
            it = f.emplace_hint(it, a, b);
            while (it != f.begin()) {
                auto p = prev(it);
                if (p->second > b)
                    break;
                f.erase(p);
            }
        }
    }
}`, [{input:'7\n1 2 9\n1 5 6\n1 8 3\n2 4\n1 6 8\n2 4\n2 7\n',output:'6\n8\n3\n'}, {input:'4\n1 1 -2\n1 3 -5\n2 2\n2 4\n',output:'-5\nNINGUNA\n'}, {input:'5\n1 3 5\n1 7 2\n1 8 6\n2 1\n2 9\n',output:'6\nNINGUNA\n'}]),
    r('borrado','Una frontera que pierde información necesaria','Inserta (3,5) y después (8,6). ¿Qué conserva la frontera? Si luego se permite borrar (8,6), ¿puede responder correctamente la consulta x=2 con la información restante?', ['La segunda oferta domina a la primera.', 'La eliminación de dominadas supone que la dominante seguirá disponible.'], 'Después de ambas inserciones solo se conserva (8,6), pues sirve para todas las consultas de (3,5) y ahorra más. Si se borra, la frontera queda vacía, pero la oferta histórica (3,5) debería volver a responder 5 para x=2. Ya fue descartada y no puede recuperarse sin guardar información adicional. Por eso el algoritmo no soporta borrados arbitrarios con la misma estructura.'),
  ]),

  'usaco-adv-wavelet': extend('usaco-adv-wavelet',100,[
    s('Construcción recursiva con particiones estables',`Comprime los valores del arreglo en rangos 0…σ-1, conservando una tabla para recuperar el valor original. Un nodo representa un intervalo de valores [lo,hi] y la subsecuencia que llegó a él, en el mismo orden relativo que tenía en el arreglo original. Si lo=hi, es una hoja. De otro modo, divide por mid=(lo+hi)/2 y manda valores≤mid a la izquierda y el resto a la derecha.

Mientras recorres la subsecuencia, construye pref[0]=0 y pref[i+1]=pref[i]+(valor[i]≤mid). Esa tabla registra cuántos elementos de cada prefijo tomaron la rama izquierda. La estabilidad de la partición es indispensable: si ordenaras libremente los elementos dentro de un hijo, los rangos ya no se trasladarían mediante simples conteos.`),
    s('Selección, conteo y suma: qué debe guardar cada variante',`Para seleccionar el k-ésimo menor en [l,r), calcula c=pref[r]-pref[l]. Si k≤c, baja a la izquierda con [pref[l],pref[r]); si no, baja a la derecha con [l-pref[l],r-pref[r]) y k-c. En una hoja, todos los candidatos tienen el mismo valor y puedes devolverlo. Debe cumplirse 1≤k≤r-l antes de empezar.

Para contar valores≤x, un nodo cuyo intervalo de valores termina≤x aporta r-l; uno que empieza>x aporta cero; los demás se dividen trasladando el rango a sus hijos. Si quieres sumar valores menores que un umbral o sumar los k menores, añade prefijos de sumas de las subsecuencias. Los conteos por sí solos no contienen esas sumas: no atribuyas a una estructura básica consultas que requieren campos adicionales.`),
    s('Prueba de la traducción de posiciones',`La subsecuencia izquierda conserva el orden original. Antes de l llegaron exactamente pref[l] elementos a ese hijo; antes de r llegaron pref[r]. Por tanto, los elementos izquierdos originados en [l,r) ocupan exactamente las posiciones [pref[l],pref[r]) del hijo. El argumento derecho usa la cantidad total de posiciones menos las enviadas a la izquierda.

En selección, todos los valores del hijo izquierdo son menores o iguales que cualquier valor del derecho. Si allí hay c candidatos, los primeros c lugares del orden están en ese hijo. Si k>c, descartarlos reduce el rango buscado a k-c. Esta prueba maneja valores repetidos sin asignarles posiciones únicas por valor: cada aparición sigue contando como un elemento.`),
    s('Complejidad, memoria y límites del modelo estático',`La altura es O(log σ). Cada elemento participa en un prefijo por nivel, así que la construcción y memoria de esta versión cuestan O(n log σ). Seleccionar y contar hasta un umbral cuestan O(log σ). La representación sencilla usa enteros para prefijos; versiones con bitvectors y consultas rank pueden ahorrar espacio, pero requieren otra implementación.

Una modificación arbitraria del arreglo altera las particiones estables y muchos prefijos, de modo que este código es estático. No prometas cambios puntuales O(log n) sin una variante dinámica. En el programa los nodos se guardan por índices para evitar referencias invalidadas al crecer el vector. Prueba todos los valores iguales, k=1, k=longitud del rango y valores negativos que solo se convierten a rangos durante la compresión.`),
  ],[
    p('k-esimo','El k-ésimo del intervalo','Entrada: n q (1≤n≤50000, 1≤q≤100000), n valores enteros entre -10⁹ y 10⁹ y q consultas l r k, con 1≤l≤r≤n y 1≤k≤r-l+1. Imprime el k-ésimo menor del intervalo inclusivo, contando repeticiones.', ['La partición por valores debe ser estable.', 'Traduce ambos extremos usando el prefijo de elementos enviados a la izquierda.'], 'Cada nodo divide los candidatos por valor y sus prefijos trasladan exactamente el intervalo original. Comparar k con el número de candidatos izquierdos decide la rama correcta. Preparación O(n log σ), consulta O(log σ), con σ valores distintos.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
struct Node {
    int lo, hi, a = -1, b = -1;
    vector<int> pref;
};
vector<Node> t;
int build(const vector<int> &v, int lo, int hi) {
    int id = t.size();
    t.push_back({lo, hi, -1, -1, {0}});
    if (lo == hi)
        return id;
    int mid = (lo + hi) / 2;
    vector<int> L, R;
    for (int x : v) {
        t[id].pref.push_back(t[id].pref.back() + (x <= mid));
        if (x <= mid)
            L.push_back(x);
        else
            R.push_back(x);
    }
    int a = build(L, lo, mid), b = build(R, mid + 1, hi);
    t[id].a = a;
    t[id].b = b;
    return id;
}
int kth(int v, int l, int r, int k) {
    if (t[v].lo == t[v].hi)
        return t[v].lo;
    int a = t[v].pref[l], b = t[v].pref[r], c = b - a;
    if (k <= c)
        return kth(t[v].a, a, b, k);
    return kth(t[v].b, l - a, r - b, k - c);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<int> a(n);
    for (int &x : a)
        cin >> x;
    vector<int> values = a;
    sort(values.begin(), values.end());
    values.erase(unique(values.begin(), values.end()), values.end());
    for (int &x : a)
        x = lower_bound(values.begin(), values.end(), x) - values.begin();
    int root = build(a, 0, values.size() - 1);
    while (q--) {
        int l, r, k;
        cin >> l >> r >> k;
        cout << values[kth(root, l - 1, r, k)] << '\n';
    }
}`, [{input:'4 3\n4 1 3 2\n2 4 2\n1 4 1\n1 4 4\n',output:'2\n1\n4\n'}, {input:'3 2\n7 7 7\n1 3 2\n2 2 1\n',output:'7\n7\n'}, {input:'4 2\n-5 3 -5 0\n1 4 2\n2 4 2\n',output:'-5\n0\n'}]),
    r('mover-rango','Traducir los dos hijos','En un nodo, pref=[0,1,1,2,2,3]. Para el intervalo [1,5), calcula los rangos en ambos hijos y decide dónde buscar el tercer menor.', ['El izquierdo usa pref en ambos extremos.', 'El derecho resta esos prefijos a las posiciones.'], 'El rango izquierdo es [pref[1],pref[5])=[1,3), con dos candidatos. El derecho es [1-1,5-3)=[0,2), también con dos. Como k=3 supera los dos candidatos izquierdos, descendemos a la derecha buscando k=3-2=1. Usar [1,5) sin traducir consultaría posiciones que no corresponden a la subsecuencia del hijo.'),
  ]),

  'usaco-adv-count-min': extend('usaco-adv-count-min',95,[
    s('El resumen debe describir exactamente lo que cuenta',`Para cada segmento guarda mn, su valor mínimo, y cnt, cuántas posiciones alcanzan ese mínimo. Al unir dos nodos, si sus mínimos difieren conserva el par del menor; si son iguales suma sus cantidades. Este resumen es asociativo porque describe una propiedad del segmento completo, independiente de cómo agrupes sus partes.

Para consultas parcialmente disjuntas usa el neutro (infinito,0). No uses (0,0), porque cero podría vencer incorrectamente a todos los valores positivos. Cada hoja inicial guarda (A[i],1). Si representas longitudes geométricas, sustituye 1 por la longitud de su intervalo elemental; la misma operación suma medidas, no necesariamente números de posiciones.`),
    s('Propagación de incrementos: tres campos bastan',`Agrega una etiqueta lazy de incremento pendiente. Sumar x a todos los valores de un nodo cambia mn+=x y lazy+=x, pero no cambia cnt: todos los elementos reciben la misma cantidad y conservan sus comparaciones. Para una actualización parcial, transmite lazy a ambos hijos, limpia la etiqueta del padre, actualiza las partes que intersectan y recombina sus pares.

Una consulta parcial también transmite la etiqueta antes de bajar. En cobertura total devuelve el par guardado, que ya incluye todos los incrementos. No necesitas conocer los valores individuales para una actualización uniforme. Asignar todo a x sería otra operación: entonces mn=x y cnt debe ser la longitud completa del segmento, por lo que requiere una etiqueta distinta.`),
    s('Traza con negativos y demostración del conteo',`Parte de [3,1,1,4]. El mínimo global es 1 y aparece dos veces. Suma 2 al rango [2,3] con índices desde uno: queda [3,3,3,4], cuyo resumen es (3,3). Suma -5 al rango [1,2]: queda [-2,-2,3,4], con resumen (-2,2). En la consulta [2,4], el resumen es (-2,1), no el conteo global dos.

La corrección se demuestra por segmentos: una hoja cuenta correctamente su valor; una unión elige exactamente los elementos que alcanzan el mínimo de ambas partes. Un incremento uniforme conserva qué posiciones son mínimas, así que aplicar mantiene el significado. Empujar distribuye el mismo incremento sin cambiar valores reales. El conteo no puede actualizarse a partir del mínimo solamente: dos segmentos con el mismo mínimo pueden tener multiplicidades diferentes.`),
    s('Aplicación geométrica y condiciones que la sostienen',`Para cobertura por intervalos, cada hoja guarda cuántos intervalos la cubren y su longitud geométrica. Las altas y bajas correctas mantienen coberturas no negativas. Si el mínimo global es cero, las posiciones que lo alcanzan son precisamente las descubiertas: longitudCubierta=longitudTotal-cnt. Si el mínimo es positivo, toda la región está cubierta.

La fórmula deja de tener esa interpretación si permites coberturas negativas por quitar un intervalo inexistente. Un mínimo -1 no representa simplemente «hueco», sino un estado inválido del modelo. Cada operación del árbol cuesta O(log n), con O(n) memoria. El ejercicio trabaja con valores enteros generales y cuenta posiciones, así separa el mecanismo del árbol de la interpretación geométrica. Prueba mínimos repetidos en ambos hijos, incrementos cero y rangos de una sola posición.`),
  ],[
    p('minimo-cantidad','Mínimo y multiplicidad','Entrada: n q (1≤n,q≤50000), n valores con valor absoluto≤10⁶ y q operaciones. «1 l r x» suma x a [l,r], con |x|≤10⁶; «2 l r» pide el mínimo del rango y cuántas veces aparece. Índices desde uno, extremos incluidos. Imprime ambos valores por consulta.', ['Un incremento uniforme cambia el mínimo pero conserva su cantidad.', 'Al combinar mínimos iguales suma las cantidades.'], 'El resumen (mínimo,cantidad) se combina según cuál mínimo gana. Lazy propagation distribuye los incrementos solo cuando hace falta descender, manteniendo siempre correcto el agregado del nodo. Cada operación cuesta O(log n).', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
struct Node {
    long long mn = 0, lazy = 0;
    int cnt = 0;
};
vector<Node> t;
vector<long long> a;
pair<long long, int> join(pair<long long, int> x, pair<long long, int> y) {
    if (x.first < y.first)
        return x;
    if (y.first < x.first)
        return y;
    return {x.first, x.second + y.second};
}
void pull(int v) {
    auto z = join({t[2 * v].mn, t[2 * v].cnt}, {t[2 * v + 1].mn, t[2 * v + 1].cnt});
    t[v].mn = z.first;
    t[v].cnt = z.second;
}
void build(int v, int L, int R) {
    if (L == R) {
        t[v].mn = a[L];
        t[v].cnt = 1;
        return;
    }
    int M = (L + R) / 2;
    build(2 * v, L, M);
    build(2 * v + 1, M + 1, R);
    pull(v);
}
void apply(int v, long long x) {
    t[v].mn += x;
    t[v].lazy += x;
}
void push(int v) {
    apply(2 * v, t[v].lazy);
    apply(2 * v + 1, t[v].lazy);
    t[v].lazy = 0;
}
void add(int v, int L, int R, int l, int r, long long x) {
    if (r < L || R < l)
        return;
    if (l <= L && R <= r) {
        apply(v, x);
        return;
    }
    push(v);
    int M = (L + R) / 2;
    add(2 * v, L, M, l, r, x);
    add(2 * v + 1, M + 1, R, l, r, x);
    pull(v);
}
pair<long long, int> query(int v, int L, int R, int l, int r) {
    if (r < L || R < l)
        return {4000000000000000000LL, 0};
    if (l <= L && R <= r)
        return {t[v].mn, t[v].cnt};
    push(v);
    int M = (L + R) / 2;
    return join(query(2 * v, L, M, l, r), query(2 * v + 1, M + 1, R, l, r));
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    a.resize(n);
    for (auto &x : a)
        cin >> x;
    t.resize(4 * n);
    build(1, 0, n - 1);
    while (q--) {
        int k, l, r;
        cin >> k >> l >> r;
        --l;
        --r;
        if (k == 1) {
            long long x;
            cin >> x;
            add(1, 0, n - 1, l, r, x);
        } else {
            auto z = query(1, 0, n - 1, l, r);
            cout << z.first << ' ' << z.second << '\n';
        }
    }
}`, [{input:'4 5\n3 1 1 4\n2 1 4\n1 2 3 2\n2 1 4\n1 1 2 -5\n2 2 4\n',output:'1 2\n3 3\n-2 1\n'}, {input:'1 3\n5\n2 1 1\n1 1 1 -8\n2 1 1\n',output:'5 1\n-3 1\n'}, {input:'3 2\n2 2 2\n1 2 2 1\n2 1 3\n',output:'2 2\n'}]),
    r('cobertura','Contar longitud descubierta','Las hojas representan [0,2), [2,7), [7,10), con coberturas [1,0,0]. ¿Qué par (mínimo,medida) debe guardar la raíz y cuál es la longitud cubierta? ¿Qué cambia si todas las coberturas aumentan en uno?', ['Las medidas son 2,5,3.', 'La medida del mínimo suma las longitudes que tienen cobertura mínima.'], 'El mínimo es 0 y su medida es 5+3=8. La longitud total es 10, por lo que la cubierta es 10-8=2. Tras sumar uno, las coberturas son [2,1,1]: el resumen pasa a (1,8), pues las mismas hojas siguen siendo mínimas. Ahora el mínimo es positivo y toda la longitud 10 está cubierta; no se debe restar 8 automáticamente sin comprobar el valor del mínimo.'),
  ]),
};
