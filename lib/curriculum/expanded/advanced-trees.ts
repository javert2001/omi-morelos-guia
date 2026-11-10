import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedTreeExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-binary-jump': extend('usaco-plat-binary-jump',90,[
    s('Construcción exacta y elección del número de niveles',`Escribe primero la función sucesor(v): en un árbol es el padre, y en un grafo funcional es la única arista saliente. Define up[0][v]=sucesor(v). Para j>0, up[j][v]=up[j-1][up[j-1][v]]: hacer dos viajes de 2^(j-1) pasos equivale a uno de 2^j. Calcula toda una fila antes de pasar a la siguiente, porque ambas consultas de la fórmula pertenecen a la fila anterior.

El número de filas depende del mayor salto permitido, no solo de n. Si k≤10¹⁸, necesitas 60 filas porque 2⁶⁰>10¹⁸. Para responder, examina los bits de k: cuando el bit j está encendido, reemplaza v por up[j][v]. El orden creciente funciona; la cantidad total de pasos realizados es la suma de esas potencias. Un salto cero no cambia el vértice.`),
    s('LCA mediante saltos: algoritmo completo',`Para encontrar el ancestro común más bajo de a y b en un árbol enraizado, calcula antes sus profundidades. Primero sube el más profundo exactamente la diferencia de profundidades, usando la representación binaria. Si ambos vértices ya coinciden, ese es el LCA. Si no, recorre j de mayor a menor: cuando up[j][a] y up[j][b] sean distintos, mueve ambos a esos ancestros. Al terminar, devuelve su padre inmediato.

La condición «ancestros distintos» evita subir hasta el LCA o por encima de él demasiado pronto. Después de igualar profundidades, ambos vértices están a la misma distancia vertical del LCA. Cada salto aceptado los mantiene estrictamente debajo; cada salto rechazado es demasiado grande. Al acabar no existe un salto de longitud uno que los mantenga separados, así que comparten padre.`),
    s('Acumular información durante los saltos',`Además del destino, un salto puede guardar la suma, máximo o mínimo de los pesos recorridos. Para sumas, acc[j][v]=acc[j-1][v]+acc[j-1][up[j-1][v]]. En una consulta sumas el resumen del salto antes de mover el vértice. Define si el peso pertenece a la arista que sale de v o al propio vértice, para no contar extremos dos veces.

Con la cadena 4→3→2→1 y pesos de aristas 5,7,2, subir tres pasos desde 4 acumula 5+7+2=14. Si la operación es no conmutativa, conserva el orden del recorrido. Para combinar dos mitades de un camino a través del LCA, una mitad se recorre al revés y puede necesitar un resumen inverso separado.`),
    s('Casos de frontera que forman parte del modelo',`En un grafo funcional puede haber ciclos: los saltos siguen siendo correctos porque la recurrencia representa composición, sin suponer que el camino termina. En un árbol, decide qué ocurre al subir más allá de la raíz. Puedes definir padre(raíz)=raíz y saturar allí, o usar un vértice nulo y reportar inexistencia; no mezcles las convenciones. Para LCA, la primera convención resulta cómoda.

La preparación cuesta O(n log K), la consulta O(log K) y la memoria O(n log K). Usa un entero de 64 bits para k y expresiones como 1LL<<j; desplazar un int 32 bits en exceso es incorrecto. Para probar, compara saltos pequeños con seguir sucesores uno a uno y añade después un k enorme en un ciclo de longitud conocida.`),
  ],[
    p('sucesores','Viajes de muchos pasos','Entrada: n q (1≤n,q≤100000), los n sucesores desde uno y q pares v k, con 0≤k≤10¹⁸. Cada vértice tiene exactamente un sucesor. Imprime el vértice alcanzado después de k pasos desde v.', ['Compón dos saltos iguales para construir el siguiente nivel.', 'Para k≤10¹⁸ bastan los bits 0…59.'], 'Cada celda up[j][v] representa exactamente 2^j pasos por inducción. La consulta concatena los saltos de los bits encendidos, cuya suma es k. Los ciclos no afectan esta composición. Tiempo O((n+q)·60), memoria O(n·60).', String.raw`#include <iostream>
#include <vector>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<vector<int>> up(60, vector<int>(n));
    for (int &v : up[0]) {
        cin >> v;
        --v;
    }
    for (int j = 1; j < 60; j++)
        for (int v = 0; v < n; v++)
            up[j][v] = up[j - 1][up[j - 1][v]];
    while (q--) {
        int v;
        long long k;
        cin >> v >> k;
        --v;
        for (int j = 0; j < 60; j++)
            if ((k >> j) & 1LL)
                v = up[j][v];
        cout << v + 1 << '\n';
    }
}`, [{input:'4 4\n2 3 1 3\n4 0\n4 1\n4 4\n1 1000000000000000000\n',output:'4\n3\n3\n2\n'}, {input:'1 2\n1\n1 0\n1 999\n',output:'1\n1\n'}, {input:'3 3\n2 3 3\n1 1\n1 2\n1 100\n',output:'2\n3\n3\n'}]),
    r('lca-traza','Seguir una consulta de LCA','El árbol tiene padre(2)=1, padre(3)=1, padre(4)=2, padre(5)=4 y padre(6)=3. Encuentra LCA(5,6), explicando la igualación de profundidades y el salto simultáneo.', ['Las profundidades de 5 y 6 son 3 y 2 si la raíz tiene profundidad cero.', 'Después de igualar, los vértices son 4 y 6.'], 'Subimos 5 un paso hasta 4. Los ancestros a dos pasos de 4 y 6 son ambos 1, así que no aceptamos ese salto. Sus padres inmediatos son 2 y 3, distintos, por lo que avanzamos a ellos. Ahora comparten el padre 1; ese es el LCA. El algoritmo no devuelve 2 ni 3 porque ninguno es ancestro del otro lado.'),
  ]),

  'usaco-plat-merging': extend('usaco-plat-merging',85,[
    s('Un procedimiento completo para conjuntos de subárboles',`Enraíza el árbol y procesa hijos antes que padres. Cada vértice debe obtener un conjunto con todos los colores de su subárbol. Antes de mezclar, elige el hijo cuyo subárbol tiene más vértices y reutiliza su conjunto mediante swap. Inserta el color del vértice actual y después los elementos de los conjuntos de los demás hijos. Guarda el tamaño como respuesta y libera los conjuntos pequeños cuando ya no los necesites.

Elegir por tamaño del subárbol permite una prueba sencilla aun cuando haya colores repetidos. La cantidad de colores de un conjunto nunca supera la cantidad de vértices que representa. No copies primero el conjunto grande: esa copia destruiría el ahorro que buscamos. Intercambiar contenedores mueve su propiedad sin recorrer sus elementos.`),
    s('Por qué cada aportación paga pocas veces',`Llama pesada a la arista hacia el hijo de mayor subárbol; las otras son ligeras. Si un vértice está en un hijo ligero de tamaño s, el subárbol del padre tiene al menos 2s+1 vértices: existe un hijo pesado de tamaño al menos s. Por ello, al subir por una arista ligera, el tamaño del contenedor de vértices al menos se duplica. Un vértice puede cruzar solo O(log n) aristas ligeras.

En cada mezcla ligera recorremos a lo sumo tantos colores como vértices contiene ese hijo. Podemos cargar ese trabajo a sus vértices; cada uno paga O(log n) veces. Con set, cada inserción cuesta O(log n), dando O(n log²n). Esta demostración evita afirmar incorrectamente que el número de colores siempre se duplica cuando existen duplicados.`),
    s('Traza de reutilización y respuestas que sobreviven',`La raíz 1 tiene hijos 2 y 3; el vértice 2 tiene hijos 4 y 5. Los colores de 1…5 son [1,2,1,3,2]. Primero las hojas producen {1}, {3} y {2}. El subárbol de 2 combina los colores de 4 y 5 y agrega el suyo: {2,3}, respuesta 2. La raíz reutiliza ese conjunto porque el subárbol 2 tiene tres vértices, frente a uno del subárbol 3. Después agrega el color 1 y mezcla {1}, obteniendo {1,2,3}, respuesta 3.

El conjunto que antes pertenecía al vértice 2 ahora puede modificarse, pero su respuesta numérica ya quedó guardada. No prometas conservar todos los conjuntos históricos: eso requeriría copias o persistencia y tendría otro costo de memoria.`),
    s('Generalizaciones y errores de propiedad',`El contenedor puede ser un mapa color→frecuencia, una tabla hash u otra estructura que admita insertar contribuciones. Con mapas debes sumar frecuencias, no limitarte a unir claves. Si usas hash, el tiempo esperado puede mejorar, pero la garantía depende de sus colisiones; set ofrece una cota determinista logarítmica. No confundas esta mezcla de contenedores con DSU de conectividad: comparten la idea de mover lo pequeño, pero mantienen objetos distintos.

Un recorrido recursivo de una cadena muy larga puede agotar la pila. El ejercicio construye un orden con una pila implícita en un vector y luego lo recorre al revés. Prueba todos los colores iguales, todos distintos, una estrella y una cadena. Verifica que vaciar un conjunto pequeño no vacíe también el grande por compartir accidentalmente el mismo puntero.`),
  ],[
    p('colores-subarbol','Colores bajo cada vértice','Entrada: n (1≤n≤20000), n colores enteros y los padres de los vértices 2…n. La raíz es 1 y los padres describen un árbol. Imprime para cada vértice, en orden 1…n, el número de colores distintos de su subárbol.', ['Procesa el orden de visita al revés.', 'Reutiliza el conjunto del hijo de mayor subárbol y mezcla los demás.'], 'Por inducción, los conjuntos de hijos contienen exactamente sus colores. Su unión con el color propio da el conjunto correcto del padre. Los movimientos se cargan a aristas ligeras: cada vértice cruza O(log n), y set añade otro factor logarítmico.', String.raw`#include <iostream>
#include <vector>
#include <set>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<int> color(n), sz(n, 1), ans(n);
    for (int &x : color)
        cin >> x;
    vector<vector<int>> ch(n);
    for (int v = 1; v < n; v++) {
        int p;
        cin >> p;
        ch[p - 1].push_back(v);
    }
    vector<int> order = {0};
    for (int i = 0; i < (int)order.size(); i++)
        for (int u : ch[order[i]])
            order.push_back(u);
    vector<set<int>> bag(n);
    for (int i = n - 1; i >= 0; i--) {
        int v = order[i], heavy = -1;
        for (int u : ch[v]) {
            sz[v] += sz[u];
            if (heavy < 0 || sz[u] > sz[heavy])
                heavy = u;
        }
        if (heavy >= 0)
            bag[v].swap(bag[heavy]);
        bag[v].insert(color[v]);
        for (int u : ch[v])
            if (u != heavy) {
                bag[v].insert(bag[u].begin(), bag[u].end());
                bag[u].clear();
            }
        ans[v] = bag[v].size();
    }
    for (int x : ans)
        cout << x << '\n';
}`, [{input:'5\n1 2 1 3 2\n1 1 2 2\n',output:'3\n2\n1\n1\n1\n'}, {input:'1\n7\n',output:'1\n'}, {input:'4\n5 5 5 5\n1 2 3\n',output:'1\n1\n1\n1\n'}]),
    r('cuenta-movimientos','Entender una cota amortizada','En una cadena de n vértices, ¿cuántos conjuntos de hijos ligeros hay? ¿Implica eso que la solución no realiza trabajo? Contrasta con un árbol binario equilibrado.', ['Una cadena tiene un solo hijo por vértice.', 'Todavía se inserta el color propio en cada vértice.'], 'En una cadena, cada hijo existente es pesado y no hay mezclas ligeras. Se reutiliza el conjunto y se inserta un color por vértice, por lo que hay n inserciones y O(n log n) tiempo con set, no tiempo cero. En un árbol equilibrado, algunos colores cruzan O(log n) aristas ligeras y se obtiene la cota general O(n log²n). El análisis amortizado suma el trabajo de toda la ejecución, no atribuye siempre el mismo costo a cada nodo.'),
  ]),

  'usaco-plat-hld': extend('usaco-plat-hld',105,[
    s('Dos recorridos convierten el árbol en un arreglo',`Primero calcula padre, profundidad y tamaño de subárbol para cada vértice. Marca como pesado al hijo de mayor tamaño. En el segundo recorrido, asigna posiciones consecutivas visitando primero al hijo pesado y luego los ligeros. Guarda head[v], la cabeza de la cadena pesada que contiene a v, y pos[v], su posición en el arreglo.

El hijo pesado hereda la cabeza del padre; cada hijo ligero inicia su propia cadena. Como el recorrido sigue una cadena antes de abandonarla, sus vértices ocupan posiciones consecutivas en orden de profundidad. Esta propiedad permite reemplazar un tramo de camino por un intervalo de arreglo. Encima de ese arreglo puedes usar Fenwick para sumas o un árbol de segmentos para agregados más generales.`),
    s('Descomponer una consulta sin repetir vértices',`Para consultar el camino entre u y v, mientras head[u]≠head[v], compara las profundidades de sus cabezas. Toma el lado cuya cabeza sea más profunda, consulta el intervalo entre pos[head[u]] y pos[u], e inmediatamente reemplaza u por padre[head[u]]. Ese salto abandona toda la cadena ya contada. Cuando ambos extremos están en una cadena, consulta entre sus posiciones, ordenadas de menor a mayor.

Elegir la cabeza más profunda impide saltar por encima del LCA. Los intervalos retirados son disjuntos y pertenecen al camino buscado. El tramo final contiene el LCA una sola vez. Si guardas pesos en aristas en vez de vértices, representa cada arista en su extremo hijo y excluye la posición del LCA en la consulta final.`),
    s('Prueba del número de cambios de cadena',`Una arista ligera va a un hijo cuyo tamaño es como máximo la mitad del tamaño del padre. Si fuera mayor, ningún otro hijo podría ser tan grande y ese hijo tendría que ser el pesado. Por tanto, al subir desde un vértice hacia la raíz y cruzar una arista ligera, el tamaño del subárbol al menos se duplica. Eso puede ocurrir O(log n) veces.

Cada iteración de la consulta abandona una cadena y cruza una arista ligera. Así obtenemos O(log n) intervalos. Si consultar cada intervalo cuesta O(log n), el camino completo cuesta O(log²n). Las actualizaciones puntuales siguen costando O(log n). HLD no convierte automáticamente cualquier operación de camino en O(log n); hay que contar ambos niveles de trabajo.`),
    s('Orden del camino, construcción iterativa y comprobación',`Para sumas y máximos, el orden de los fragmentos no afecta la respuesta. Para concatenación o composición, sí: los fragmentos del lado de u se recorren hacia arriba y los del lado de v deben agregarse en orden inverso al final. Guarda resúmenes en ambos sentidos y dos acumuladores, uno por extremo. Ignorar este detalle puede pasar todas las pruebas de sumas y fallar cuando cambia el agregado.

El programa siguiente usa pesos de vértices, sumas y cambios puntuales. Construye padre y profundidad con un orden iterativo, tamaños en orden inverso y cadenas mediante una pila de cabezas. Así una cadena de 20000 vértices no exige 20000 llamadas recursivas. Comprueba consultas u=v, raíz-hoja y entre ramas distintas, además de cambios en la raíz y valores negativos.`),
  ],[
    p('camino-suma','Sumas en caminos','Entrada: n q (1≤n,q≤20000), n valores con valor absoluto≤10⁶, n-1 aristas y q operaciones. «1 v x» asigna x al vértice v; «2 u v» pide la suma de valores del camino inclusivo entre u y v. Los vértices se numeran desde uno. Imprime una línea por consulta.', ['Numera primero al hijo pesado para que cada cadena sea un intervalo.', 'Sube siempre el extremo cuya cabeza sea más profunda.'], 'HLD particiona el camino en O(log n) intervalos disjuntos. Fenwick suma cada intervalo y actualiza un vértice mediante la diferencia entre su nuevo valor y el anterior. Tiempo O(log²n) por consulta y O(log n) por actualización; memoria O(n).', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<long long> a(n), bit(n + 1);
    for (auto &x : a)
        cin >> x;
    vector<vector<int>> g(n);
    for (int i = 1; i < n; i++) {
        int u, v;
        cin >> u >> v;
        --u;
        --v;
        g[u].push_back(v);
        g[v].push_back(u);
    }
    vector<int> par(n, -1), dep(n), sz(n, 1), heavy(n, -1), head(n), pos(n), order = {0};
    for (int i = 0; i < n; i++) {
        int v = order[i];
        for (int u : g[v])
            if (u != par[v]) {
                par[u] = v;
                dep[u] = dep[v] + 1;
                order.push_back(u);
            }
    }
    for (int i = n - 1; i > 0; i--) {
        int v = order[i], p = par[v];
        sz[p] += sz[v];
        if (heavy[p] < 0 || sz[v] > sz[heavy[p]])
            heavy[p] = v;
    }
    vector<int> starts = {0};
    int timer = 0;
    while (!starts.empty()) {
        int h = starts.back();
        starts.pop_back();
        for (int v = h; v != -1; v = heavy[v]) {
            head[v] = h;
            pos[v] = timer++;
            for (int u : g[v])
                if (par[u] == v && u != heavy[v])
                    starts.push_back(u);
        }
    }
    auto add = [&](int p, long long x) {
        for (++p; p <= n; p += p & -p)
            bit[p] += x;
    };
    auto pref = [&](int p) {
        long long z = 0;
        for (; p; p -= p & -p)
            z += bit[p];
        return z;
    };
    auto range = [&](int l, int r) { return pref(r + 1) - pref(l); };
    for (int v = 0; v < n; v++)
        add(pos[v], a[v]);
    while (q--) {
        int type, u;
        long long z;
        cin >> type >> u >> z;
        --u;
        if (type == 1) {
            add(pos[u], z - a[u]);
            a[u] = z;
        } else {
            int v = (int)z - 1;
            long long ans = 0;
            while (head[u] != head[v]) {
                if (dep[head[u]] < dep[head[v]])
                    swap(u, v);
                ans += range(pos[head[u]], pos[u]);
                u = par[head[u]];
            }
            ans += range(min(pos[u], pos[v]), max(pos[u], pos[v]));
            cout << ans << '\n';
        }
    }
}`, [{input:'5 4\n1 2 3 4 5\n1 2\n1 3\n2 4\n2 5\n2 4 3\n1 2 10\n2 4 5\n2 1 1\n',output:'10\n19\n1\n'}, {input:'1 3\n-2\n2 1 1\n1 1 7\n2 1 1\n',output:'-2\n7\n'}, {input:'3 2\n1 2 3\n1 2\n2 3\n2 1 3\n2 2 3\n',output:'6\n5\n'}]),
    r('pesos-aristas','Excluir el LCA cuando los valores están en aristas','El árbol tiene aristas 1–2 de peso 4, 2–3 de peso 7 y 2–4 de peso 9. Si guardas cada peso en el vértice hijo, ¿qué posiciones deben sumarse para el camino 3–4? ¿Por qué no debes incluir el valor almacenado en 2?', ['El LCA de 3 y 4 es 2.', 'El valor de 2 representa la arista que va a su padre.'], 'Se suman los valores almacenados en 3 y 4: 7+9=16. El valor 4 almacenado en 2 representa la arista 1–2, que no pertenece al camino 3–4. En la última cadena se debe excluir la posición del LCA. Para una consulta de un vértice consigo mismo, el camino de aristas está vacío y su suma es cero, aunque el vértice tenga un valor almacenado.'),
  ]),
};
