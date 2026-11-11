import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedTreeDivisionExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-centroid': extend('usaco-plat-centroid',110,[
    s("Encontrar los centroides y preparar las listas","Enraíza temporalmente una componente de N vértices y calcula tamaños. Al quitar v, las partes tienen los tamaños de sus hijos y N−tamaño[v], correspondiente al lado del padre. Elige un vértice cuyo máximo no supere N/2.\n\nRecorre la componente desde ese centroide para agregar a cada vértice el par de referencia y distancia. Después márcalo bloqueado y repite en las componentes restantes, sin borrar las aristas originales. El arreglo de bloqueados evita cruzar los centroides ya retirados. En cada nivel recorres componentes disjuntas."),
    s("Demostrar que alguna candidata es exacta","Una candidata dist(v,c)+dist(c,x) describe un recorrido hasta un activo x pasando por c. Con pesos no negativos, ese rodeo nunca es menor que la distancia real. Por tanto, ninguna candidata subestima la respuesta.\n\nAhora toma un activo x más cercano. Hay un primer centroide c que separa v y x, o coincide con uno. El camino único entre ambos pasa por c, así que dist(v,x)=dist(v,c)+dist(c,x). Ambos guardaron esa referencia y mejor[c]≤dist(c,x). Esa candidata alcanza el óptimo; junto con la no subestimación, esto prueba igualdad."),
    s("Activar otra estación en la misma cadena","Después de activar 1, activa también 4. La referencia 3 recibe distancia 1, y mejor[3] baja de 2 a 1. Desde 5, pasar por 3 daría 2+1=3, pero no es la mejor candidata: una referencia dentro de la componente {4,5} recupera la distancia exacta 1.\n\nEl ejemplo explica por qué no basta un centroide global. Las divisiones sucesivas permiten encontrar la referencia que realmente queda en el camino entre la consulta y su mejor activo. No necesitas que todas las candidatas sean exactas; necesitas que ninguna subestime y que una alcance la respuesta."),
    s("Qué cambia si también cierras estaciones","Activar dos veces una estación no afecta un mínimo. Desactivarla sí exige más información: mejor[c] no recuerda qué otro activo podría reemplazar al que lo producía. Por ejemplo, en 1–2–3, si 1 y 3 están activos, mejor[2]=1; retirar 1 no elimina la aportación de 3.\n\nPuedes guardar un multiset de distancias por centroide. Una activación inserta una distancia y una desactivación borra una sola ocurrencia. Así recuperas el menor valor restante, a cambio de otro factor logarítmico. No borres todas las distancias iguales por retirar un único activo."),
  ],[
    p('faros',"Distancia a una estación activa","Lee n q (1≤n≤10000, 1≤q≤50000), n−1 aristas de un árbol y q operaciones. Al inicio todos los vértices están inactivos. «1 v» activa v; «2 v» pide la distancia, medida en aristas, hasta el activo más cercano. Imprime −1 si no existe ninguno. Las estaciones no se desactivan.", ["Al construir la descomposición, guarda cada distancia de un vértice a sus centroides ancestros.", "Cada activación ofrece su distancia a esas referencias; cada consulta combina su distancia con el mejor valor recibido."], "Prepara las listas de referencias y comienza cada mejor[c] en infinito. Activar x actualiza mínimos en su lista; consultar v minimiza d+mejor[c] en la suya. Las candidatas representan rodeos y nunca subestiman la respuesta. El centroide que separa v de un activo óptimo está en su camino y produce igualdad. La preparación cuesta O(n log n) y cada operación O(log n).", String.raw`#include <iostream>
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
    r('borrar-no',"Conservar alternativas al desactivar","En la cadena 1–2–3 están activos 1 y 3. El centroide 2 guarda mejor[2]=1. Si desactivas 1, ¿sería correcto cambiar ese mínimo a infinito? Describe qué información permitiría admitir desactivaciones.", ["El vértice 3 ofrece otra distancia igual a 1.", "Además de empates, debes poder recuperar el segundo menor valor cuando desaparezca el primero."], "No sería correcto: 3 sigue activo y está a distancia 1. Conserva en cada centroide un multiset con las distancias de los activos de su componente. Al retirar 1, borra una sola ocurrencia de su distancia. El mínimo del multiset continúa siendo 1. Con valores diferentes también puedes recuperar el siguiente menor, aunque insertar y borrar agregan un factor logarítmico."),
  ]),

  'usaco-plat-vt': extend('usaco-plat-vt',100,[
    s("Construir el conjunto y conectarlo con una pila","Ordena las k marcas por tin y agrega el LCA de cada pareja consecutiva. Vuelve a ordenar y elimina repetidos. Hay a lo sumo k+(k−1)=2k−1 vértices.\n\nRecórrelos con una pila. Antes de procesar v, retira de la cima los vértices que no sean ancestros de v. Si queda un vértice u arriba, conéctalo con v y guarda la longitud del tramo; después apila v. El primer vértice retenido es la raíz virtual. No agregues automáticamente la raíz original si la pregunta no la necesita."),
    s("Por qué bastan las parejas consecutivas","Los vértices de cada subárbol ocupan un bloque en el orden DFS. Si una bifurcación conecta marcas de dos hijos distintos, en la lista habrá una frontera entre esos bloques. El último marcado de un bloque y el primero del siguiente son consecutivos, y su LCA es precisamente esa bifurcación. Así no falta ningún punto de encuentro necesario.\n\nLa pila mantiene el camino de ancestros retenidos hacia el vértice actual. Al retirar los que ya no contienen al siguiente vértice, la cima restante es su ancestro retenido más cercano. Por eso las aristas comprimen cadenas sin saltarse bifurcaciones."),
    s("Sumar las aristas necesarias para conectar las marcas","En el ejemplo, el árbol virtual tiene 1→2 de longitud 1, 2→4 de longitud 1, 2→5 de longitud 1 y 1→6 de longitud 2. La suma es 5: necesitas cinco aristas originales para conectar {4,5,6}.\n\nLos caminos comprimidos no comparten aristas interiores y juntos forman el menor subárbol de conexión. Por eso puedes sumar sus longitudes directamente. Con una única marca no hay aristas virtuales y la respuesta es cero. Una DP sobre este árbol pequeño también puede contar pares o propagar marcas."),
    s("Elegir qué información conserva una arista","Guardar solo la longitud basta para distancias, pero no para todas las preguntas. Si necesitas el mínimo peso de un tramo, guarda ese mínimo; si hay una restricción en un vértice intermedio, debes representar su efecto antes de eliminarlo.\n\nPor ejemplo, en la cadena 1–2–3–4–5 con marcas 3 y 5, la raíz virtual es 3 y la única arista pesa 2. Añadir 1 y sumar todo daría 4, que incluiría dos aristas ajenas a la conexión pedida. La compresión y sus agregados deben corresponder a la pregunta concreta."),
  ],[
    p('conectar',"Aristas para conectar estaciones","Lee n k (1≤k≤n≤20000), n−1 aristas de un árbol y k vértices importantes distintos. Cada arista pesa uno. Imprime cuántas aristas tiene el menor subárbol que conecta todos los importantes. Si k=1, la respuesta es 0.", ["Ordena las marcas por entrada DFS y añade los LCAs de parejas consecutivas.", "Une cada vértice retenido con su ancestro retenido más cercano y suma las diferencias de profundidad."], "Los LCAs incorporan los puntos donde se separan los caminos entre marcas. La pila conecta esos puntos sin incluir ramas ajenas. Cada arista virtual representa un camino de longitud igual a la diferencia de profundidades; sus interiores no comparten aristas. Por eso sumar las longitudes cuenta exactamente las aristas del subárbol mínimo.", String.raw`#include <iostream>
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
    r('raiz-virtual',"Elegir la raíz del árbol reducido","En la cadena 1–2–3–4–5, enraizada en 1, marca 3 y 5. Construye el árbol virtual. Después explica qué error cometerías al añadir siempre la raíz 1 y sumar todas las aristas del árbol resultante.", ["El primer encuentro de los caminos hacia arriba de 3 y 5 ocurre en 3.", "Las aristas entre 1 y 3 no son necesarias para unir las dos marcas."], "Conserva 3 y 5 y únelos con una arista virtual de longitud 2. La raíz virtual es 3. Si añades 1, aparece también 1→3 de longitud 2 y la suma sube incorrectamente a 4. Algunas DP necesitan incluir la raíz original, pero entonces deben distinguir qué tramos contribuyen a la respuesta."),
  ]),

  'usaco-plat-kruskal-tree': extend('usaco-plat-kruskal-tree',100,[
    s("Construir el bosque de reconstrucción","Empieza con un nodo hoja por vértice. Para cada arista (u,v,w), busca sus componentes con DSU. Si coinciden, no hagas nada. Si difieren, crea t, asigna etiqueta[t]=w y conecta t con las raíces de reconstrucción de ambas componentes. Después únelas en DSU y guarda t como raíz histórica de la nueva componente.\n\nCada fusión reduce el número de componentes en uno, así que crea a lo sumo n−1 nodos. El resultado tiene a lo sumo 2n−1 nodos, aunque el grafo original tenga ciclos o aristas paralelas. Si el grafo está desconectado, obtienes varios árboles."),
    s("Demostrar el significado del ancestro común","Después de procesar todas las aristas de peso≤W, DSU representa exactamente las componentes del grafo limitado a esas aristas. Las etiquetas no disminuyen al subir por el árbol, pues las fusiones se procesaron por peso creciente.\n\nSi el LCA de u y v tiene etiqueta w, antes de esa unión estaban en componentes separadas: ningún umbral menor los conectaba. Al producirse la unión, aparece una conexión usando solo pesos≤w. Esas dos observaciones prueban que w es el mínimo posible."),
    s("Resolver empates y pares sin conexión","Varias aristas de igual peso pueden crear las fusiones binarias en distinto orden. El árbol resultante puede cambiar, pero todas esas fusiones llevan la misma etiqueta; las respuestas por umbral permanecen iguales.\n\nAntes de consultar un LCA, comprueba que las dos hojas pertenezcan a la misma componente final. Si no, nunca se conectan. Para u=v, el camino está vacío: el ejercicio define respuesta cero y usa pesos no negativos. Esa convención debe venir del enunciado, no de una etiqueta improvisada en las hojas."),
    s("Separar los padres actuales de los históricos","El padre de DSU puede cambiar por compresión de caminos. El padre del árbol de reconstrucción representa una fusión histórica y debe permanecer fijo. Mantén ambos conceptos separados al implementar.\n\nPrepara LCA sobre los nodos del bosque, por ejemplo con saltos binarios. Una secuencia de fusiones puede formar una cadena de profundidad cercana a n, aunque uses unión por tamaño dentro del DSU. Recorre el árbol de reconstrucción iterativamente si una recursión tan profunda puede agotar la pila."),
  ],[
    p('umbral',"Nivel mínimo para conectar ciudades","Lee n m q (1≤n≤20000, 0≤m≤100000, 1≤q≤50000), m aristas u v w con 0≤w≤10⁹ y q pares u v. Para cada par imprime el menor W que permite conectarlo usando solo aristas de peso≤W. Imprime −1 si nunca hay conexión y 0 cuando u=v.", ["Crea un nodo histórico cada vez que Kruskal une dos componentes distintas.", "La primera unión que contiene ambas hojas es su ancestro común más bajo."], "Construye el bosque con DSU y prepara LCA. Si u=v, responde 0; si sus componentes finales difieren, responde −1. En otro caso devuelve la etiqueta de su LCA. DSU registra la conectividad de cada umbral y ese ancestro representa la primera unión que reúne a ambas hojas; por eso su etiqueta es el menor W válido.", String.raw`#include <iostream>
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
    r('suma-no',"Máximo de una ruta frente a suma de una ruta","Hay una carretera directa 1–3 de peso 8 y el camino 1–2–3 con pesos 5 y 5. ¿Qué responde el árbol de Kruskal para 1 y 3? ¿Qué ruta minimiza la suma de los pesos?", ["En el camino por 2, el mayor peso es 5 y la suma es 10.", "La arista directa tiene máximo y suma iguales a 8."], "El árbol responde 5: a ese umbral ya están disponibles las dos carreteras del camino por 2. Para minimizar la suma escogerías la carretera directa, pues 8<10. El árbol de reconstrucción responde sobre el mayor peso de la ruta; usarlo para sumar distancias resolvería una pregunta diferente."),
  ]),
};
