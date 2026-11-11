import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const advancedDynamicForestExpansions: Record<string,LessonExpansion> = {
'usaco-adv-critical': chapter('usaco-adv-critical',[
["Qué significa que un vértice sea obligatorio","Fija un origen s y mira solo los vértices alcanzables. Decimos que d domina a v cuando todo camino dirigido de s a v pasa por d. El origen y el propio v siempre cumplen esa condición.\n\nDebes considerar todos los caminos, incluidos los largos. Un árbol DFS guarda solo una ruta por vértice y no basta para decidir dominación. En el rombo s→a→t y s→b→t, a y b pueden evitarse; solo s y t dominan a t. Agregar t→a crea un ciclo, pero no cambia esa respuesta.\n\nExcluimos los destinos inalcanzables: no hay caminos sobre los que comprobar la condición."],
["Comprobar un candidato quitándolo","Para preguntar si d domina a t, recorre desde s omitiendo d y sus aristas. Si t deja de alcanzarse, cualquier ruta original necesitaba d. Si todavía llegas, ese recorrido demuestra que existe una ruta que lo evita.\n\nPrimero verifica que t era alcanzable en el grafo original. Al prohibir s no puedes iniciar el recorrido; al prohibir t no puedes terminarlo. No hace falta modificar las listas: basta ignorar al vértice durante la búsqueda.\n\nProbar los n candidatos cuesta O(n(n+m)) con BFS o DFS. Sirve para entradas pequeñas y como respuesta de referencia para comprobar algoritmos más rápidos."],
["Calcular conjuntos hasta que dejen de cambiar","Para obtener todos los destinos a la vez, inicia Dom(s)={s}. Para cualquier otro v alcanzable, empieza Dom(v) con todos los alcanzables. Después repite: Dom(v)={v} unido con la intersección de Dom(u) sobre sus predecesores alcanzables.\n\nUn vértice obligatorio debe estar en todas las maneras de entrar a v; eso explica la intersección. Los conjuntos solo pierden elementos y el proceso termina al estabilizarse. No los inicies vacíos: perderías la interpretación de ir descartando candidatos.\n\nEn un DAG basta seguir un orden topológico; con ciclos necesitas rondas. Los bitsets aceleran intersecciones, pero también debes contar rondas y aristas. Compara con el método de eliminación en grafos pequeños."],
["Representar la dominación con un árbol","Para v≠s, el dominador estricto más cercano a v se llama dominador inmediato, idom(v). Sus enlaces forman un árbol con raíz s. Los ancestros de v en ese árbol son precisamente sus dominadores estrictos.\n\nEn el rombo, idom(a)=idom(b)=idom(t)=s. En la cadena s→a→b→t, los enlaces inmediatos siguen la propia cadena. Para encontrar todas las ciudades obligatorias hacia t, recorre sus padres hasta s.\n\nSi necesitas muchas consultas «¿d domina a v?», aplana este árbol con tiempos de entrada y salida: el intervalo de d debe contener al de v. Este árbol expresa dominación; no es el árbol DFS usado durante la construcción."],
["Cómo se organiza Lengauer–Tarjan","Numera los vértices alcanzables por DFS y guarda sus padres. El semidominador de w es el menor número DFS que puede llegar a w usando un camino cuyos vértices interiores tienen números mayores que w.\n\nProcesa w en orden DFS inverso. Para cada predecesor v, eval(v) busca la etiqueta de menor semidominador en el camino de ancestros ya unido. Usa ese resultado para actualizar semi[w].\n\nAñade w al grupo de semi[w] y únelo con su padre DFS. Procesa el grupo del padre: para cada v, toma u=eval(v). Si semi[u]<semi[v], guarda provisionalmente idom[v]=u; de lo contrario, guarda el padre.\n\nHaz después una pasada DFS creciente. Si idom[w] todavía difiere de semi[w], reemplázalo por idom[idom[w]]. Esa corrección convierte las respuestas provisionales en dominadores inmediatos. eval comprime caminos conservando la mejor etiqueta; devolver solo un representante DSU perdería la información necesaria."],
["Elegir una versión que puedas verificar","La versión rápida necesita justificar qué conservan eval y las uniones. Comprimir caminos sin actualizar sus etiquetas puede producir respuestas incorrectas. Tampoco toda variante con DSU tiene costo O(mα(n)): las versiones simples y las que equilibran estructuras tienen análisis distintos.\n\nEl ejercicio implementa eliminación, con límites moderados y costo explícito. Prueba rombos, cadenas, ciclos, aristas paralelas y destinos inalcanzables. Para un candidato evitable, conserva una ruta que no lo use; para uno obligatorio, comprueba la desconexión al omitirlo.\n\nEsa solución pequeña ofrece una comprobación independiente cuando programes Lengauer–Tarjan."]
],[reflect('caminos','No basta el camino más corto','El grafo tiene aristas 1→2, 2→4, 1→3, 3→5, 5→4. Todas pesan uno. ¿Qué vértices dominan a 4 desde 1? ¿Por qué analizar únicamente caminos mínimos da una conclusión incorrecta?',['La ruta por 2 es más corta, pero existe otra por 3 y 5.','Dominar considera todos los caminos dirigidos.'],"Solo uno y cuatro dominan a cuatro. La ruta mínima 1→2→4 usa el vértice dos, pero la ruta más larga 1→3→5→4 lo evita. La ruta por dos, a su vez, evita tres y cinco.\n\nPara dominación importan todos los caminos dirigidos. Comparar únicamente sus distancias eliminaría alternativas que todavía demuestran que un vértice no es obligatorio."),program('obligatorias','Ciudades que ninguna ruta puede evitar',"Recibirás n,m (1≤n≤500, 0≤m≤5000), seguidos de m aristas dirigidas u,v entre 1 y n. El origen es 1 y el destino n. Si no hay ruta, imprime 0 y termina. Si la hay, imprime la cantidad de vértices presentes en toda ruta y, en la siguiente línea, esos vértices en orden creciente. Incluye origen y destino.",['Primero comprueba alcanzabilidad sin prohibir ningún vértice.','Para cada d, recorre el grafo omitiéndolo; si pierdes el destino, d es obligatorio.'],"Primero comprueba que existe alguna ruta de uno a n. Para cada candidato d, vuelve a recorrer el grafo omitiéndolo. El destino queda alcanzable exactamente cuando existe una ruta que evita d; por eso la prueba coincide con la definición de dominación.\n\nLas marcas de visitado permiten manejar ciclos sin repetir el recorrido indefinidamente. Repetir n búsquedas requiere O(n(n+m)) tiempo y O(n+m) memoria, dentro de los límites del ejercicio.",String.raw`#include <iostream>
#include <vector>
#include <queue>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    while (m--) {
        int u, v;
        cin >> u >> v;
        g[u].push_back(v);
    }
    auto reaches = [&](int banned) {
        if (banned == 1)
            return false;
        vector<int> seen(n + 1);
        queue<int> q;
        q.push(1);
        seen[1] = 1;
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            for (int v : g[u])
                if (v != banned && !seen[v]) {
                    seen[v] = 1;
                    q.push(v);
                }
        }
        return seen[n] != 0;
    };
    if (!reaches(0)) {
        cout << 0 << '\n';
        return 0;
    }
    vector<int> answer;
    for (int d = 1; d <= n; d++)
        if (!reaches(d))
            answer.push_back(d);
    cout << answer.size() << '\n';
    for (int i = 0; i < (int)answer.size(); i++) {
        if (i)
            cout << ' ';
        cout << answer[i];
    }
    cout << '\n';
}
`,[['4 4\n1 2\n1 3\n2 4\n3 4\n','2\n1 4\n'],['3 2\n1 2\n2 3\n','3\n1 2 3\n'],['3 1\n1 2\n','0\n'],['1 0\n','1\n1\n'],['4 5\n1 2\n2 3\n3 2\n3 4\n2 4\n','3\n1 2 4\n']])]),
'usaco-adv-link-cut-tree': chapter('usaco-adv-link-cut-tree',[
["Distinguir el bosque de su representación","El bosque real contiene las aristas del problema. Un link-cut tree lo divide en caminos preferidos y representa cada uno con un splay, un árbol binario auxiliar. Sus hijos ordenan los vértices del camino; no son necesariamente hijos en el bosque real. Cambiar preferencias reorganiza datos sin cambiar aristas reales.\n\nCada nodo tiene un padre p. Si p lo señala como hijo izquierdo o derecho, el enlace pertenece al splay. Si no, p conecta la cabeza de ese camino con un camino superior. Por eso isRoot(x) revisa ambas cosas: p[x] puede existir aunque x sea raíz auxiliar. Las rotaciones deben respetar esa distinción."],
["Actualizar sumas e inversiones antes de rotar","Guarda suma[x]=valor[x]+suma[izquierdo]+suma[derecho]. pull(x) recalcula ese valor tras cambiar los hijos. Para invertir un camino, intercambia los hijos y alterna la marca reverse. push(x) transmite la inversión antes de consultar la estructura de abajo.\n\nAntes de splay(x), reúne sus ancestros auxiliares y empuja las marcas de arriba hacia abajo. Usa zig-zig si x y su padre están del mismo lado, o zig-zag si están en lados opuestos.\n\nCada rotación corrige padres, hijo intermedio y enlace desde el abuelo si pertenece al mismo splay. Al final recalcula primero el nodo que bajó y después el que subió; sus hijos ya deben estar correctos."],
["Qué hace access con los caminos preferidos","access(x) expone el camino desde la raíz representada hasta x. Empieza last=0 y sube por los padres de camino. En cada y, ejecuta splay(y), reemplaza su hijo derecho por last, actualiza la suma y guarda last=y. Continúa hacia el padre de camino y termina con splay(x).\n\nEl hijo derecho anterior deja de ser preferido, pero su padre puede seguir apuntando a y como enlace de camino. No borres ese enlace: no has quitado una arista real.\n\nAl terminar, x es raíz auxiliar, no tiene hijo derecho y su lado izquierdo contiene sus ancestros en orden. Consultas, cambios de valor y cambios de raíz reutilizan esta operación."],
["Cambiar la raíz, agregar y cortar aristas","makeroot(x) hace access(x) e invierte el camino expuesto: cambia la raíz representada sin alterar aristas. Para encontrar la raíz de una componente, haz access(x), baja por hijos izquierdos empujando marcas y aplica splay al vértice encontrado.\n\nPara link(u,v), haz makeroot(u). Si la raíz de v es u, ya estaban conectados y la nueva arista crearía un ciclo: recházala. Si no, asigna p[u]=v como enlace de camino.\n\nPara cut(u,v), haz makeroot(u) y access(v). Comprueba que u sea el hijo izquierdo de v y no tenga hijo derecho: eso confirma la arista directa. Separa el enlace, limpia p[u] y recalcula v. Omitir esa comprobación podría cortar una arista equivocada."],
["Sumar el camino y cambiar valores","Para consultar u–v, comprueba primero que estén conectados. Haz makeroot(u) y access(v): el splay de v representa ese camino y suma[v] contiene la respuesta. Para actualizar x, ejecuta access(x), cambia valor[x] y recalcula su suma.\n\nCon valores [2,5,7] y aristas 1–2,2–3, consultar 1–3 da catorce. Cambiar el valor de 2 a cuatro da trece. Cortar 2–3 separa a 1 y 3. Si luego enlazas 1–3, la consulta 2–3 recorre 2–1–3 e incluye los tres valores.\n\nmakeroot y access solo reorganizan la representación. Las aristas reales cambian con link y cut."],
["Costo amortizado y otros tipos de consulta","La estructura estándar garantiza O(log n) amortizado por operación y O(n) memoria. Amortizado significa que distribuyes el trabajo sobre la secuencia completa: una operación puede costar más y un splay no tiene que mantener altura logarítmica en todo momento.\n\nEstas sumas describen caminos, no subárboles del bosque real. Para consultar subárboles necesitas mantener también los aportes de hijos virtuales durante access. Si el agregado depende del orden, como un hash, guarda las versiones hacia delante y hacia atrás e intercámbialas al invertir.\n\nCompara operaciones aleatorias con un bosque pequeño de listas y BFS. Incluye enlaces, cortes, consultas u=u y cambios de raíz sucesivos."]
],[reflect('bosques','Distingue reorganizar de cortar','Un bosque tiene aristas 1–2 y 2–3. Ejecutas makeroot(3), access(1) y después consultas 2–3. ¿Qué aristas reales siguen existiendo? ¿Cuál sería el error de interpretar el hijo derecho descartado en access como una arista eliminada?',['makeroot y access solo cambian caminos preferidos.','Las operaciones que modifican el bosque real son link y cut.'],"Las aristas reales siguen siendo 1–2 y 2–3. makeroot y access solo cambian la representación, así que la consulta 2–3 todavía usa su arista directa.\n\nCuando un hijo deja de ser preferido, conserva un enlace de camino con el resto del bosque. Borrarlo confundiría una reorganización auxiliar con una desconexión real. Solo link y cut deben cambiar las aristas del problema."),program('bosque','Suma sobre un bosque que cambia',"Recibirás n,q (1≤n≤20000, 1≤q≤20000), luego n valores entre −1000000000 y 1000000000. El bosque empieza sin aristas. Cada operación es L u v para enlazar componentes distintos, C u v para cortar una arista existente, U u valor para actualizar un vértice, o Q u v para consultar la suma del camino. Los L y C son válidos. En cada Q imprime la suma, o −1 si están desconectados.\n\nLos vértices van de 1 a n.",['Expón u–v con makeroot(u) y access(v).','Empuja inversiones antes de rotar y recalcula sumas después.'],"makeroot(u) y access(v) exponen u–v en un solo splay; su agregado suma los vértices de ese camino. Antes comprueba conectividad. Los cambios de raíz conservan las aristas, mientras link y cut modifican el bosque.\n\nLos valores y sus sumas usan long long. Con almacenamiento por índices las referencias permanecen estables durante las rotaciones. La cota global es O((n+q) log n) amortizada y la memoria O(n).",String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
struct Node {
    int c[2] = {0, 0}, p = 0;
    bool rev = false;
    long long value = 0, sum = 0;
};
struct LCT {
    vector<Node> t;
    LCT(int n) : t(n + 1) {}
    bool root(int x) {
        int p = t[x].p;
        return !p || (t[p].c[0] != x && t[p].c[1] != x);
    }
    void pull(int x) { t[x].sum = t[x].value + t[t[x].c[0]].sum + t[t[x].c[1]].sum; }
    void flip(int x) {
        if (x) {
            swap(t[x].c[0], t[x].c[1]);
            t[x].rev = !t[x].rev;
        }
    }
    void push(int x) {
        if (t[x].rev) {
            flip(t[x].c[0]);
            flip(t[x].c[1]);
            t[x].rev = false;
        }
    }
    void rotate(int x) {
        int p = t[x].p, g = t[p].p, d = t[p].c[1] == x, b = t[x].c[d ^ 1];
        if (!root(p))
            t[g].c[t[g].c[1] == p] = x;
        t[x].p = g;
        t[x].c[d ^ 1] = p;
        t[p].p = x;
        t[p].c[d] = b;
        if (b)
            t[b].p = p;
        pull(p);
        pull(x);
    }
    void splay(int x) {
        vector<int> path{x};
        for (int y = x; !root(y);)
            path.push_back(y = t[y].p);
        for (int i = (int)path.size() - 1; i >= 0; i--)
            push(path[i]);
        while (!root(x)) {
            int p = t[x].p, g = t[p].p;
            if (!root(p))
                rotate((t[p].c[1] == x) == (t[g].c[1] == p) ? p : x);
            rotate(x);
        }
    }
    void access(int x) {
        int last = 0;
        for (int y = x; y; y = t[y].p) {
            splay(y);
            t[y].c[1] = last;
            if (last)
                t[last].p = y;
            pull(y);
            last = y;
        }
        splay(x);
    }
    void makeroot(int x) {
        access(x);
        flip(x);
    }
    int findroot(int x) {
        access(x);
        push(x);
        while (t[x].c[0]) {
            x = t[x].c[0];
            push(x);
        }
        splay(x);
        return x;
    }
    void link(int u, int v) {
        makeroot(u);
        if (findroot(v) != u)
            t[u].p = v;
    }
    void cut(int u, int v) {
        makeroot(u);
        access(v);
        if (t[v].c[0] == u && !t[u].c[1]) {
            t[v].c[0] = 0;
            t[u].p = 0;
            pull(v);
        }
    }
    void update(int u, long long v) {
        access(u);
        t[u].value = v;
        pull(u);
    }
    bool connected(int u, int v) { return findroot(u) == findroot(v); }
    long long query(int u, int v) {
        makeroot(u);
        access(v);
        return t[v].sum;
    }
};
int main() {
    int n, q;
    cin >> n >> q;
    LCT tree(n);
    for (int i = 1; i <= n; i++) {
        cin >> tree.t[i].value;
        tree.pull(i);
    }
    while (q--) {
        char op;
        int u;
        long long v;
        cin >> op >> u >> v;
        if (op == 'L')
            tree.link(u, (int)v);
        else if (op == 'C')
            tree.cut(u, (int)v);
        else if (op == 'U')
            tree.update(u, v);
        else if (!tree.connected(u, (int)v))
            cout << -1 << '\n';
        else
            cout << tree.query(u, (int)v) << '\n';
    }
}
`,[['3 7\n2 5 7\nL 1 2\nL 2 3\nQ 1 3\nU 2 4\nQ 1 3\nC 2 3\nQ 1 3\n','14\n13\n-1\n'],['1 3\n8\nQ 1 1\nU 1 -2\nQ 1 1\n','8\n-2\n'],['3 6\n1 2 3\nL 1 2\nC 1 2\nL 1 3\nL 3 2\nQ 1 2\nQ 2 3\n','6\n5\n'],['2 1\n4 6\nQ 1 2\n','-1\n']])]),
};
