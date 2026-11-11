import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedTreeExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-binary-jump': extend('usaco-plat-binary-jump',90,[
    s("Cuántas filas necesitas y qué pasa en la raíz","La tabla debe cubrir el mayor k de las consultas. Para k≤10¹⁸ bastan los bits de 0 a 59, aunque el grafo tenga solo tres vértices. Usa enteros de 64 bits y expresiones como 1LL<<j; un int no alcanza para representar esos saltos.\n\nEn un árbol puedes definir que el padre de la raíz sea la misma raíz. Entonces, un salto excesivo se queda allí. Si el problema pide reportar que un ancestro no existe, compara antes k con la profundidad o utiliza un vértice nulo. Escoge una convención y úsala en toda la tabla."),
    s("Encontrar dónde se unen dos ramas","El ancestro común más bajo, o LCA, es el primer vértice compartido al subir desde dos vértices. Para encontrarlo, sube al más profundo hasta igualar sus profundidades. Si coinciden, ya tienes la respuesta.\n\nSi siguen separados, prueba las potencias de mayor a menor. Sube ambos solamente cuando sus destinos sean distintos. Así permanecen debajo del LCA: un salto que los llevara hasta él o más arriba tendría el mismo destino. Al terminar no pueden subir un paso más sin coincidir; devuelve el padre de cualquiera."),
    s("Guardar también lo que recorres","Puedes acompañar cada destino con la suma de pesos de sus aristas. Define acc[j][v]=acc[j−1][v]+acc[j−1][up[j−1][v]]. En una consulta, agrega ese valor antes de mover v. En 4→3→2→1, con pesos 5, 7 y 2, subir tres pasos acumula 14.\n\nDecide primero si los pesos pertenecen a aristas o a vértices; de eso depende cómo cuentas los extremos. Para concatenar cadenas o componer funciones, el orden importa. Al unir las dos mitades de un camino mediante su LCA, una se recorre al revés y puede necesitar un resumen en sentido inverso."),
    s("Por qué la tabla representa el recorrido correcto","La primera fila es correcta porque almacena un solo paso. Si la fila j−1 representa 2^(j−1) pasos, encadenar dos de sus saltos representa exactamente 2^j; esto demuestra cada fila por inducción. La consulta concatena las potencias presentes en k, sin agregar pasos ni omitirlos.\n\nLa prueba usa composición de la función sucesor, no que los vértices sean distintos. Por eso los ciclos no requieren ningún tratamiento especial. Para LCA sí necesitas un árbol enraizado, pues la noción de ancestro común utilizada depende de sus caminos hacia la raíz."),
  ],[
    p('sucesores',"Destinos después de k viajes","Hay n vértices y cada uno indica su único sucesor. La entrada contiene n q (1≤n,q≤100000), los n sucesores y q consultas v k, con 0≤k≤10¹⁸. Los vértices se numeran desde 1. Para cada consulta imprime dónde terminas después de k pasos desde v.", ["Guarda el destino de 2^j pasos y constrúyelo usando dos saltos de 2^(j−1).", "Revisa los bits de k del 0 al 59; cada bit encendido aporta su salto."], "Prepara up[0] con los sucesores y calcula las otras 59 filas mediante composición. Para cada consulta empieza en v y aplica los saltos de los bits encendidos de k. Cada fila representa la longitud indicada y las longitudes utilizadas suman k; los ciclos no cambian esa propiedad. El tiempo es O((n+q)·60) y la memoria O(n·60).", String.raw`#include <iostream>
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
    r('lca-traza',"Seguir una consulta de ancestro común","Un árbol enraizado en 1 tiene padre(2)=1, padre(3)=1, padre(4)=2, padre(5)=4 y padre(6)=3. Calcula LCA(5,6). Muestra qué vértice subes para igualar profundidades y qué saltos simultáneos aceptas.", ["Con profundidad cero en la raíz, 5 tiene profundidad 3 y 6 tiene profundidad 2.", "Después de subir 5 hasta 4, compara primero los ancestros a dos pasos y después los padres."], "Sube 5 un paso hasta 4. Desde 4 y 6, saltar dos pasos lleva al mismo vértice, 1, así que rechaza ese salto. Sus padres inmediatos son 2 y 3: como son distintos, sube a ellos. Ahora ambos tienen padre 1, que es el LCA. Detenerte en 2 o 3 sería incorrecto porque ninguno pertenece a las dos ramas."),
  ]),

  'usaco-plat-merging': extend('usaco-plat-merging',85,[
    s("Procesar hijos antes que padres","Enraíza el árbol, calcula tamaños de subárbol y procesa los vértices desde las hojas. Para un vértice v, encuentra al hijo con mayor subárbol y transfiere su conjunto con swap. Después inserta el color de v y las claves de los conjuntos de los demás hijos. Guarda el tamaño obtenido como respuesta de v.\n\nPuedes liberar los conjuntos pequeños después de incorporarlos. No copies el conjunto elegido antes de mezclar: esa copia volvería a recorrer los elementos que intentamos conservar. El intercambio debe transferir la propiedad del contenedor sin copiar sus claves."),
    s("Contar cuánto trabajo paga cada vértice","Llama pesada a la arista hacia el hijo de mayor subárbol y ligeras a las demás. Si un hijo ligero tiene s vértices, existe otro hijo con al menos s; por tanto, el subárbol del padre tiene al menos 2s+1. Cada vez que subes por una arista ligera, el tamaño del subárbol al menos se duplica.\n\nUn vértice cruza O(log n) aristas ligeras. En cada mezcla recorres a lo sumo tantas claves como vértices contiene el hijo ligero. Carga esas visitas a sus vértices: suman O(n log n). Con set, cada inserción cuesta O(log n), dando O(n log²n)."),
    s("Seguir los conjuntos en un árbol pequeño","La raíz 1 tiene hijos 2 y 3; el vértice 2 tiene hijos 4 y 5. Los colores de 1 a 5 son [1,2,1,3,2]. Las hojas 3, 4 y 5 empiezan con {1}, {3} y {2}. El vértice 2 obtiene {2,3} y guarda la respuesta 2.\n\nLa raíz reutiliza ese conjunto porque el subárbol de 2 contiene tres vértices. Agrega su color 1 e incorpora {1}, del hijo 3. El conjunto final es {1,2,3}: respuesta 3. La respuesta guardada para 2 permanece igual aunque su antiguo conjunto se haya transferido."),
    s("Adaptar el contenedor a la pregunta","Un conjunto basta para contar colores distintos. Si necesitas frecuencias, utiliza un mapa color→cantidad y suma las cantidades al mezclar. Una tabla hash puede reducir el costo esperado, aunque depende de las colisiones; un contenedor balanceado ofrece la cota logarítmica determinista.\n\nEsta operación mezcla datos de subárboles. No es el DSU que mantiene componentes de conectividad, aunque ambos aprovechen tamaños para ahorrar trabajo. En la implementación también importa la propiedad: vaciar una bolsa pequeña no debe vaciar la grande por haber compartido el mismo contenedor accidentalmente."),
  ],[
    p('colores-subarbol',"Colores de cada subárbol","Cada vértice de un árbol tiene un color entero. Lee n (1≤n≤20000), los n colores y los padres de los vértices 2…n. La raíz es 1 y los padres describen un árbol. Imprime, para los vértices 1…n en ese orden, cuántos colores distintos contiene su subárbol.", ["Obtén un orden en el que aparezcan padres antes que hijos y procésalo al revés.", "Conserva el conjunto del hijo de mayor subárbol; agrega el color propio y las claves de los otros hijos."], "Cada hoja empieza con su color. Cuando llegas a un padre, los conjuntos de los hijos ya son correctos; su unión más el color propio contiene exactamente los colores de su subárbol. Reutiliza el conjunto del hijo de mayor subárbol y guarda el tamaño antes de transferirlo más arriba. Hay O(n log n) visitas a claves, cargadas a aristas ligeras, y cada inserción en set cuesta O(log n).", String.raw`#include <iostream>
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
    r('cuenta-movimientos',"Comparar una cadena con un árbol equilibrado","En una cadena de n vértices, ¿hay hijos ligeros? Cuenta qué trabajo queda aunque no haya mezclas de sus conjuntos. Después explica qué cambia en un árbol binario equilibrado.", ["Si un vértice tiene un solo hijo, ese hijo es el pesado.", "Cada vértice todavía debe insertar su propio color."], "La cadena no tiene hijos ligeros: cada conjunto se transfiere directamente al padre. Aun así se realizan n inserciones de colores, con costo O(n log n) usando set. En un árbol binario equilibrado, los elementos pueden pertenecer a hijos ligeros en O(log n) niveles y aparece la cota O(n log²n). La cota amortizada suma el trabajo de toda la ejecución; no dice que todos los vértices cuesten lo mismo."),
  ]),

  'usaco-plat-hld': extend('usaco-plat-hld',105,[
    s("Quitar un tramo cada vez","Para consultar entre u y v, compara las cabezas de sus cadenas. Si son distintas, elige el extremo cuya cabeza sea más profunda. Consulta desde esa cabeza hasta el extremo y muévelo al padre de la cabeza. Has retirado un tramo completo del camino.\n\nRepite hasta que ambos extremos estén en una cadena. Entonces consulta el intervalo entre sus dos posiciones. Mover el extremo al padre de la cabeza evita contar otra vez los vértices retirados. Comparar las profundidades de las cabezas, y no solo las de u y v, evita saltar por encima del ancestro común."),
    s("Por qué los intervalos cubren el camino","Mientras las cabezas sean distintas, la más profunda está por debajo del ancestro común de los extremos. Todo el tramo que retiras pertenece al camino y no contiene vértices que necesitarás contar después. Al compartir cadena, el camino restante es exactamente el intervalo entre las posiciones.\n\nCada tramo retirado cruza una arista ligera al continuar hacia arriba. Como en cada lado hay O(log n) de esas aristas, obtienes O(log n) intervalos disjuntos. El último incluye el ancestro común una sola vez. Esta partición demuestra que sumar los intervalos da la suma pedida."),
    s("Distinguir pesos en vértices y en aristas","Si los valores pertenecen a vértices, incluye los dos extremos de cada intervalo. Si pertenecen a aristas, guarda cada peso en su extremo hijo. En el último tramo excluye la posición del ancestro común, porque allí está guardada la arista que lo une con su padre y esa arista queda fuera del camino.\n\nCon aristas 1–2 de peso 4, 2–3 de peso 7 y 2–4 de peso 9, el camino 3–4 suma los valores guardados en 3 y 4: 16. Incluir el valor de 2 agregaría erróneamente la arista 1–2."),
    s("Conservar el orden cuando la operación lo requiere","Para suma o máximo puedes combinar los fragmentos en cualquier orden. Para concatenar cadenas o componer funciones, la dirección importa: desde u avanzas hacia arriba, mientras que la otra mitad debe recorrerse desde el ancestro común hacia v. Conserva dos acumuladores y resúmenes en ambos sentidos.\n\nEl ejercicio utiliza sumas en vértices y cambios puntuales. Construye el árbol con recorridos iterativos para que una cadena larga no agote la pila. Fenwick permite actualizar una posición sumando la diferencia entre el valor nuevo y el anterior."),
  ],[
    p('camino-suma',"Cambiar valores y sumar caminos","Lee n q (1≤n,q≤20000), los n valores de los vértices, n−1 aristas y q operaciones. Los vértices se numeran desde 1 y los valores tienen valor absoluto≤10⁶. La operación «1 v x» asigna x a v. La operación «2 u v» pide la suma del camino entre u y v, incluidos ambos extremos. Imprime una línea por consulta.", ["Numera cada cadena pesada de forma consecutiva y guarda su cabeza.", "Retira primero el tramo cuya cabeza tenga mayor profundidad; cuando las cabezas coincidan, consulta el tramo final."], "Descompón el árbol y guarda los valores en un Fenwick según pos. Para cambiar v, agrega nuevo−anterior en su posición. Para consultar un camino, suma los O(log n) intervalos disjuntos que produce HLD. Cada uno cuesta O(log n), así que una consulta cuesta O(log²n); un cambio cuesta O(log n). Las estructuras ocupan O(n) memoria.", String.raw`#include <iostream>
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
    r('pesos-aristas',"Qué valor se excluye al guardar aristas","Las aristas 1–2, 2–3 y 2–4 pesan 4, 7 y 9, respectivamente, y la raíz es 1. Guardas cada peso en el vértice hijo. ¿Qué valores sumas para el camino 3–4? Explica por qué el valor guardado en 2 debe quedar fuera.", ["El ancestro común más bajo de 3 y 4 es 2.", "El valor almacenado en 2 describe la conexión con su padre, no una de las dos conexiones del camino."], "Suma los valores guardados en 3 y 4: 7+9=16. En 2 está guardado el peso 4 de la arista 1–2, que no recorres. Por eso la consulta del último tramo excluye la posición del ancestro común. Aplicando la misma regla a u=v, no queda ninguna arista y la suma es cero."),
  ]),
};
