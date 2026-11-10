import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedTreeDivisionExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-centroid': extend('usaco-plat-centroid',110,[
    s('Encontrar y retirar un centro equilibrado',`Un centroide de un árbol de N vértices es un vértice cuya eliminación deja componentes de tamaño como máximo N/2. Para encontrarlo, enraíza temporalmente la componente y calcula tamaños de subárbol. Para cada candidato v, el tamaño de su mayor parte es el máximo entre los tamaños de sus hijos y N-tamaño[v], que representa el lado de su padre. Elige uno cuyo máximo no supere N/2.

Márcalo retirado, pero conserva las aristas originales: un arreglo bloqueado evita cruzarlo durante las siguientes búsquedas. Repite el procedimiento en cada componente restante. Los centroides encontrados forman otro árbol, el árbol de descomposición. No es el árbol original y sus aristas no representan necesariamente conexiones directas entre vértices vecinos.`),
    s('Preparar las distancias y resolver activaciones',`Cuando eliges un centroide c, recorre su componente y guarda para cada vértice v el par (c,distancia(v,c)). Al seguir la descomposición, cada vértice acumula O(log n) pares. Mantén mejor[c], inicialmente infinito, que es la menor distancia desde c a un vértice activado que participó en su componente.

Para activar x, recorre sus pares (c,d) y ejecuta mejor[c]=min(mejor[c],d). Para consultar desde v, minimiza d+mejor[c] sobre los pares de v. Si ningún centroide tiene un valor finito, todavía no hay vértices activos. Esta variante admite activar repetidamente el mismo vértice, pero no desactivar: un mínimo escalar no recuerda qué alternativa debe recuperarse cuando desaparece su ganador.`),
    s('Por qué el rodeo por un centroide da la distancia exacta',`Para cualquier centroide compartido y cualquier vértice activo x considerado, dist(v,c)+dist(c,x) es la longitud de un recorrido que pasa por c, por lo que nunca es menor que la distancia real dist(v,x). Las respuestas candidatas no subestiman el óptimo.

Ahora toma el vértice activo x más cercano. En el proceso de descomposición existe un primer centroide c que separa v y x, o coincide con uno de ellos. En un árbol, el camino único entre ambos pasa por c. Por tanto dist(v,x)=dist(v,c)+dist(c,x). Ambos guardaron c en sus listas y mejor[c]≤dist(c,x). Esa candidata alcanza el óptimo. Junto con la no subestimación, obtenemos igualdad.`),
    s('Una traza, límites y variantes que sí cambian la solución',`En la cadena 1–2–3–4–5, elige centroide 3. Al activar 1, mejor[3] pasa a 2; los centroides de las componentes que contienen 1 también reciben sus distancias. Consultar desde 5 considera 2+2=4 a través de 3, que es su distancia real a 1. Si luego activas 4, mejor[3] pasa a 1 y la consulta desde 5 encuentra distancia 1 mediante un centroide que separa 4 y 5 dentro de su componente.

Cada nivel procesa componentes disjuntas y cada componente se reduce a la mitad, dando O(n log n) preparación y memoria para las listas. Activar y consultar cuestan O(log n). Con pesos no negativos sustituye número de aristas por suma de pesos. Para desactivaciones necesitas multiconjuntos o estructuras con borrado; decrementar mejor[c] o ponerlo arbitrariamente en infinito sería incorrecto.`),
  ],[
    p('faros','Faros activos más cercanos','Entrada: n q (1≤n≤10000, 1≤q≤50000), n-1 aristas de un árbol y q operaciones. «1 v» activa el vértice v; «2 v» pide su distancia al activo más cercano, medida en aristas, o -1 si no hay ninguno. Al inicio todos están inactivos. No hay desactivaciones.', ['Guarda las distancias de cada vértice a sus centroides ancestros.', 'Cada centroide conserva la menor distancia que recibió de una activación.'], 'La consulta prueba rodeos por centroides. Ninguno subestima una distancia real y el primer centroide que separa la consulta de su activo óptimo pertenece a su camino, proporcionando igualdad. Preparación O(n log n), operaciones O(log n).', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
#include <tuple>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<vector<int>> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    vector<int> blocked(n), par(n), sz(n), best(n, 1000000000);
    vector<vector<pair<int, int>>> path(n);
    function<void(int)> build = [&](int start) {
        vector<int> order = {start};
        par[start] = -1;
        for (int i = 0; i < (int)order.size(); i++) {
            int v = order[i];
            for (int u : g[v])
                if (!blocked[u] && u != par[v]) {
                    par[u] = v;
                    order.push_back(u);
                }
        }
        for (int i = (int)order.size() - 1; i >= 0; i--) {
            int v = order[i];
            sz[v] = 1;
            for (int u : g[v])
                if (!blocked[u] && par[u] == v)
                    sz[v] += sz[u];
        }
        int c = start, N = order.size();
        for (int v : order) {
            int largest = N - sz[v];
            for (int u : g[v])
                if (!blocked[u] && par[u] == v)
                    largest = max(largest, sz[u]);
            if (largest <= N / 2) {
                c = v;
                break;
            }
        }
        vector<tuple<int, int, int>> todo = {{c, -1, 0}};
        while (!todo.empty()) {
            auto [v, p, d] = todo.back();
            todo.pop_back();
            path[v].push_back({c, d});
            for (int u : g[v])
                if (!blocked[u] && u != p)
                    todo.push_back({u, v, d + 1});
        }
        blocked[c] = 1;
        for (int u : g[c])
            if (!blocked[u])
                build(u);
    };
    build(0);
    while (q--) {
        int type, v;
        cin >> type >> v;
        --v;
        if (type == 1) {
            for (auto [c, d] : path[v])
                best[c] = min(best[c], d);
        } else {
            int ans = 1000000000;
            for (auto [c, d] : path[v])
                ans = min(ans, best[c] + d);
            cout << (ans >= 1000000000 ? -1 : ans) << '\n';
        }
    }
}`, [{input:'5 5\n1 2\n2 3\n3 4\n4 5\n2 5\n1 1\n2 5\n1 4\n2 5\n',output:'-1\n4\n1\n'}, {input:'1 3\n2 1\n1 1\n2 1\n',output:'-1\n0\n'}, {input:'4 4\n1 2\n1 3\n1 4\n1 2\n2 3\n1 3\n2 3\n',output:'2\n0\n'}]),
    r('borrar-no','Por qué un mínimo no permite desactivar','En una cadena 1–2–3 hay activos 1 y 3. El centroide 2 guarda mejor[2]=1. Si desactivas 1, ¿debe ponerse mejor[2] en infinito? Diseña la información adicional que haría falta.', ['Hay dos vértices que logran el mismo mínimo.', 'Incluso mínimos distintos pueden necesitar recuperarse.'], 'No: el vértice 3 sigue a distancia 1. El valor mínimo no indica cuántos activos lo consiguen ni cuál es el segundo menor. Una solución es guardar en cada centroide un multiset de distancias de los activos de su componente. Activar inserta la distancia; desactivar elimina una sola ocurrencia, no todas las iguales. Consultar usa el menor elemento o infinito si el multiset está vacío. Las operaciones adquieren un factor logarítmico adicional.'),
  ]),

  'usaco-plat-vt': extend('usaco-plat-vt',100,[
    s('La estructura que se conserva y la que se comprime',`Un árbol virtual contiene un pequeño conjunto de vértices importantes y los puntos donde se juntan sus caminos. Una arista virtual u→v representa el camino completo de u a v en el árbol original, sin vértices relevantes intermedios. Si las aristas originales pesan uno, su peso es profundidad[v]-profundidad[u]. La compresión conserva la estructura de ancestros y las distancias entre vértices retenidos.

No basta conectar directamente los importantes más cercanos en el recorrido: pueden pertenecer a ramas distintas y necesitar un ancestro común que no estaba marcado. Por eso la construcción añade LCAs. Tampoco se insertan necesariamente todos los vértices del camino; los intermedios de grado dos se sustituyen por una arista con peso.`),
    s('Construcción completa con orden DFS y pila',`Precalcula tiempos de entrada tin, tiempos de salida tout y LCA en el árbol original. Ordena los k vértices marcados por tin. Agrega el LCA de cada pareja consecutiva de esa lista. Ordena nuevamente por tin y elimina repetidos. El conjunto resultante tiene a lo sumo 2k-1 vértices.

Recórrelos en ese orden con una pila de ancestros. Para cada v, elimina la cima mientras no sea ancestro de v. Si queda una cima u, agrega la arista virtual u→v con peso profundidad[v]-profundidad[u]. Después apila v. La relación de ancestro se comprueba con tin[u]≤tin[v] y tout[v]≤tout[u]. El primer elemento es la raíz virtual; no tienes que añadir siempre la raíz original.`),
    s('Por qué bastan los LCAs de vecinos',`Los vértices de cada subárbol aparecen consecutivamente en el orden DFS. Considera un punto de ramificación necesario, cuyo subárbol contiene marcados de al menos dos hijos diferentes. En la lista ordenada hay una frontera entre los marcados de dos de esas ramas; el último marcado de una y el primero de la siguiente son vecinos, y su LCA es exactamente ese punto. Por eso todo punto de ramificación necesario se añade.

Una vez incluidos esos ancestros, la pila conserva el camino de ancestros retenidos que lleva al vértice actual. Al retirar los que ya no contienen al siguiente vértice, la cima restante es su ancestro retenido más cercano. Así las aristas virtuales no omiten ninguna ramificación necesaria ni introducen caminos ajenos al subárbol de conexión.`),
    s('Una aplicación completa y el significado de sus pesos',`Supón aristas 1–2,1–3,2–4,2–5,3–6 y marcados {4,5,6}. Sus LCAs vecinos añaden 2 y 1. El árbol virtual tiene aristas 1→2 de peso 1, 2→4 de peso 1, 2→5 de peso 1 y 1→6 de peso 2. La suma 5 es el número de aristas del menor subárbol que conecta los marcados. El vértice 3 desapareció, pero su distancia quedó en el peso 2.

Esta suma funciona porque los caminos comprimidos no comparten aristas interiores. Si solo hay un marcado, la suma es cero. La preparación del árbol original cuesta O(n log n); una consulta con k marcados cuesta O(k log k+k log n), incluyendo LCAs. Procesar todo el árbol en cada consulta desperdiciaría el ahorro. Los ejercicios de DP posteriores pueden ejecutarse sobre estos O(k) nodos, siempre interpretando correctamente los pesos comprimidos.`),
  ],[
    p('conectar','Conectar estaciones importantes','Entrada: n k (1≤k≤n≤20000), n-1 aristas de un árbol y k vértices importantes distintos. Imprime el número de aristas del menor subárbol que los conecta. Las aristas pesan uno. Si k=1, imprime 0.', ['Agrega LCAs de marcados consecutivos en orden DFS.', 'Conecta cada nodo retenido con el ancestro retenido más cercano y suma diferencias de profundidad.'], 'Los LCAs añadidos conservan todas las ramificaciones del subárbol de conexión. Cada arista virtual representa un camino de longitud igual a la diferencia de profundidades, y esos caminos son disjuntos en sus interiores. Su suma cuenta exactamente las aristas necesarias.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, k;
    cin >> n >> k;
    vector<vector<int>> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    int K = 1;
    while ((1 << K) <= n)
        K++;
    vector<vector<int>> up(K, vector<int>(n));
    vector<int> tin(n), tout(n), dep(n), it(n), st = {0};
    int timer = 0;
    tin[0] = timer++;
    while (!st.empty()) {
        int v = st.back();
        if (it[v] == (int)g[v].size()) {
            tout[v] = timer;
            st.pop_back();
            continue;
        }
        int u = g[v][it[v]++];
        if (u == up[0][v])
            continue;
        up[0][u] = v;
        dep[u] = dep[v] + 1;
        tin[u] = timer++;
        st.push_back(u);
    }
    for (int j = 1; j < K; j++)
        for (int v = 0; v < n; v++)
            up[j][v] = up[j - 1][up[j - 1][v]];
    auto anc = [&](int u, int v) { return tin[u] <= tin[v] && tout[v] <= tout[u]; };
    auto lca = [&](int u, int v) {
        if (anc(u, v))
            return u;
        if (anc(v, u))
            return v;
        for (int j = K - 1; j >= 0; j--)
            if (!anc(up[j][u], v))
                u = up[j][u];
        return up[0][u];
    };
    vector<int> a(k);
    for (int &v : a) {
        cin >> v;
        --v;
    }
    auto cmp = [&](int x, int y) { return tin[x] < tin[y]; };
    sort(a.begin(), a.end(), cmp);
    for (int i = 1; i < k; i++)
        a.push_back(lca(a[i - 1], a[i]));
    sort(a.begin(), a.end(), cmp);
    a.erase(unique(a.begin(), a.end()), a.end());
    st.clear();
    long long ans = 0;
    for (int v : a) {
        while (!st.empty() && !anc(st.back(), v))
            st.pop_back();
        if (!st.empty())
            ans += dep[v] - dep[st.back()];
        st.push_back(v);
    }
    cout << ans << '\n';
}`, [{input:'6 3\n1 2\n1 3\n2 4\n2 5\n3 6\n4 5 6\n',output:'5\n'}, {input:'3 1\n1 2\n2 3\n2\n',output:'0\n'}, {input:'5 2\n1 2\n2 3\n3 4\n4 5\n2 5\n',output:'3\n'}]),
    r('raiz-virtual','¿Hay que incluir la raíz original?','En la cadena 1–2–3–4–5 con raíz 1, marca 3 y 5. Construye el árbol virtual y explica por qué agregar siempre la raíz 1 cambiaría la suma si después contaras todas sus aristas sin filtrar.', ['El LCA de 3 y 5 es 3.', 'El subárbol mínimo de conexión no necesita llegar a 1.'], 'El árbol virtual correcto contiene 3 y 5, unidos por una arista de peso 2. La raíz virtual es 3. Añadir 1 produce además una arista 1→3 de peso 2; sumar todo daría 4, aunque solo hacen falta las aristas 3–4 y 4–5. Incluir la raíz original puede servir para ciertas DP, pero entonces hay que excluir explícitamente segmentos que no contribuyen a la cantidad buscada.'),
  ]),

  'usaco-plat-kruskal-tree': extend('usaco-plat-kruskal-tree',100,[
    s('Construir un vértice que representa una fusión',`Empieza con un nodo hoja por cada vértice del grafo y un DSU cuyas componentes son individuales. Ordena las aristas por peso creciente. Para una arista (u,v,w), localiza las raíces de sus componentes. Si ya son iguales, ignórala. Si son distintas, crea un nuevo nodo t con etiqueta w, cuyos hijos son las raíces actuales de ambos árboles de componentes. La nueva componente del DSU tendrá t como raíz de reconstrucción.

Cada fusión reduce el número de componentes en uno, así que se crean como máximo n-1 nodos nuevos. El grafo original puede tener ciclos y aristas paralelas, pero la estructura de reconstrucción es un bosque binario con a lo sumo 2n-1 nodos. Sus hojas siguen identificando los vértices originales.`),
    s('El significado de cada etiqueta',`Después de procesar todas las aristas de peso como máximo W, las componentes del DSU son exactamente las componentes del grafo restringido a esas aristas. Una fusión de etiqueta w registra el instante en que dos componentes pasan a estar conectadas. Las etiquetas de ancestros nunca disminuyen al subir, porque las aristas se procesaron ordenadas.

Para dos hojas distintas u y v conectadas en el grafo, su LCA en el árbol de reconstrucción es la primera fusión que las reúne. Su etiqueta es el menor umbral W que permite viajar entre ellas usando solo aristas de peso≤W. Equivale a minimizar, sobre todos los caminos u-v, el mayor peso de una arista del camino. No es la suma de pesos del camino mínimo.`),
    s('Traza y demostración mediante umbrales',`Con aristas 1–2 de peso 3, 2–3 de peso 7 y 1–3 de peso 10, primero creas un nodo de etiqueta 3 con hijos 1 y 2. Después creas otro de etiqueta 7 que une esa componente con 3. La arista de peso 10 se ignora. El LCA de 1 y 2 tiene etiqueta 3, y el de 1 y 3 tiene etiqueta 7.

Antes de procesar peso 7, 3 está separado de 1, por lo que ningún camino con máximo menor que 7 existe. Al procesarlo aparece el camino 1–2–3, cuyo máximo es 7. Esas dos afirmaciones prueban optimalidad. La prueba general usa el mismo invariante de conectividad para cada umbral; no necesita enumerar caminos ni depender de cuál árbol de expansión eligió Kruskal.`),
    s('Empates, desconexión y consultas prácticas',`Si varias aristas tienen el mismo peso, las fusiones binarias pueden ocurrir en distintos órdenes y producir formas distintas. La respuesta sigue siendo correcta: todos los nodos creados durante ese empate llevan la misma etiqueta. Un grafo desconectado produce varias raíces; antes de consultar LCA verifica que ambas hojas pertenezcan a la misma componente final. Para u=v define explícitamente la respuesta; con pesos no negativos, el ejercicio usa cero para el camino vacío.

Después de construir el bosque, prepara saltos binarios para LCA sobre sus hasta 2n-1 nodos. No confundas el padre del DSU, que puede comprimirse, con el padre en el árbol de reconstrucción, que es una arista histórica fija. Ordenar cuesta O(m log m), la preparación adicional O(n log n) y cada consulta O(log n). Una cadena de fusiones puede tener profundidad n, por lo que conviene recorrerla iterativamente.`),
  ],[
    p('umbral','Umbral para conectar ciudades','Entrada: n m q (1≤n≤20000, 0≤m≤100000, 1≤q≤50000), m aristas u v w con 0≤w≤10⁹ y q pares u v. Imprime el menor W que conecta u con v usando solo aristas de peso≤W, o -1 si nunca se conectan. Para u=v imprime 0.', ['Cada fusión exitosa de Kruskal crea un nodo nuevo.', 'La respuesta es la etiqueta del LCA de las dos hojas.'], 'El DSU después de cada umbral representa exactamente su conectividad. El LCA registra la primera fusión que contiene ambas hojas, de modo que su etiqueta es el menor umbral posible. Componentes finales distintas producen -1.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;
struct E {
    int u, v, w;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<E> edges(m);
    for (auto &e : edges) {
        cin >> e.u >> e.v >> e.w;
        --e.u;
        --e.v;
    }
    sort(edges.begin(), edges.end(), [](E a, E b) { return a.w < b.w; });
    vector<int> dsu(2 * n), parent(2 * n, -1), weight(2 * n), dep(2 * n);
    iota(dsu.begin(), dsu.end(), 0);
    vector<vector<int>> ch(2 * n);
    auto find = [&](int x) {
        int r = x;
        while (dsu[r] != r)
            r = dsu[r];
        while (dsu[x] != x) {
            int y = dsu[x];
            dsu[x] = r;
            x = y;
        }
        return r;
    };
    int total = n;
    for (auto e : edges) {
        int a = find(e.u), b = find(e.v);
        if (a == b)
            continue;
        int t = total++;
        weight[t] = e.w;
        ch[t] = {a, b};
        parent[a] = parent[b] = t;
        dsu[a] = dsu[b] = t;
    }
    int K = 1;
    while ((1 << K) <= total)
        K++;
    vector<vector<int>> up(K, vector<int>(total));
    vector<int> order;
    for (int v = 0; v < total; v++)
        if (parent[v] < 0) {
            parent[v] = v;
            order.push_back(v);
        }
    for (int i = 0; i < (int)order.size(); i++) {
        int v = order[i];
        up[0][v] = parent[v];
        for (int u : ch[v]) {
            dep[u] = dep[v] + 1;
            order.push_back(u);
        }
    }
    for (int j = 1; j < K; j++)
        for (int v = 0; v < total; v++)
            up[j][v] = up[j - 1][up[j - 1][v]];
    while (q--) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        if (find(u) != find(v)) {
            cout << -1 << '\n';
            continue;
        }
        if (u == v) {
            cout << 0 << '\n';
            continue;
        }
        if (dep[u] < dep[v])
            swap(u, v);
        int d = dep[u] - dep[v];
        for (int j = 0; j < K; j++)
            if ((d >> j) & 1)
                u = up[j][u];
        if (u != v) {
            for (int j = K - 1; j >= 0; j--)
                if (up[j][u] != up[j][v]) {
                    u = up[j][u];
                    v = up[j][v];
                }
            u = up[0][u];
        }
        cout << weight[u] << '\n';
    }
}`, [{input:'3 3 3\n1 2 3\n2 3 7\n1 3 10\n1 2\n1 3\n2 2\n',output:'3\n7\n0\n'}, {input:'3 1 2\n1 2 4\n1 3\n1 2\n',output:'-1\n4\n'}, {input:'3 2 2\n1 2 5\n2 3 5\n1 3\n2 3\n',output:'5\n5\n'}]),
    r('suma-no','Distinguir dos optimizaciones','Hay una arista directa 1–3 de peso 8 y un camino 1–2–3 con pesos 5 y 5. ¿Qué responde el árbol de Kruskal para 1 y 3? ¿Qué camino elegiría una consulta de suma mínima?', ['El máximo del camino de dos aristas es 5, pero su suma es 10.', 'Cada problema usa una función distinta para comparar caminos.'], 'El árbol de reconstrucción responde 5: con umbral 5 ya existen las dos aristas del camino por 2. La consulta de suma mínima elegiría la arista directa de costo 8, menor que 10. El árbol de Kruskal minimiza el cuello de botella, es decir, el mayor peso usado, no la suma. Confundir ambas interpretaciones daría una solución incorrecta aunque la construcción del árbol fuera perfecta.'),
  ]),
};
