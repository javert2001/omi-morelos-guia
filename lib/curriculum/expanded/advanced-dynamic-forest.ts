import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const advancedDynamicForestExpansions: Record<string,LessonExpansion> = {
'usaco-adv-critical': chapter('usaco-adv-critical',[
['Empieza con una definición que incluya todos los caminos','Fija un origen s y considera solo vértices alcanzables desde él. Un vértice d domina a v si todo camino dirigido de s a v pasa por d. El propio v y el origen s siempre dominan a v. No se trata solamente de caminos mínimos: una ruta más larga también puede evitar una ciudad y demostrar que no era obligatoria. Tampoco basta revisar un árbol DFS, porque ese árbol conserva una sola ruta por vértice.\n\nEn un rombo s→a→t y s→b→t, a y b no dominan a t; sus dominadores son s y t. Si añadimos una arista t→a, aparecen ciclos pero la conclusión no cambia. Los vértices no alcanzables se excluyen para evitar una afirmación vacía sobre «todos los caminos» cuando no existe ninguno.'],
['Construye primero una solución exacta por eliminación','Para saber si d domina a un destino t, elimina temporalmente d y sus aristas y recorre desde s. Si t deja de ser alcanzable, toda ruta original lo necesitaba. Si sigue siendo alcanzable, el recorrido proporciona un camino que evita d. Probar cada candidato cuesta O(n(n+m)) con DFS o BFS, una solución completamente válida cuando n es pequeño.\n\nAntes comprueba que t sea alcanzable en el grafo original. Considera por separado eliminar s: ningún recorrido puede comenzar. Eliminar t también impide alcanzarlo. Esta versión es útil como solución educativa y como oráculo para verificar implementaciones rápidas en grafos pequeños. No necesitas modificar físicamente las listas: basta omitir el vértice prohibido durante el recorrido.'],
['Calcula conjuntos de dominadores por punto fijo','Para todos los destinos a la vez, inicializa Dom(s)={s} y Dom(v) con todos los vértices alcanzables para v≠s. Repite Dom(v)={v} unido con la intersección de Dom(u) para todos los predecesores alcanzables u de v. Los conjuntos solo pierden elementos y hay un número finito, así que el proceso termina.\n\nLa intersección expresa que una ciudad obligatoria debe estar en todas las formas de entrar a v. En un DAG basta un orden topológico; con ciclos hacen falta rondas hasta estabilizar. Iniciar todos los conjuntos vacíos produciría otro comportamiento y no corresponde a esta derivación. Los bitsets aceleran las intersecciones, pero el número de rondas y aristas sigue formando parte del costo. Para entradas pequeñas, compara cada conjunto resultante con la prueba de eliminación.'],
['Organiza las respuestas en un árbol de dominadores','Para v≠s existe un dominador estricto más cercano a v, llamado dominador inmediato idom(v). Los enlaces idom forman un árbol con raíz s. Los ancestros de v en ese árbol son exactamente sus dominadores estrictos. En el rombo, idom(a)=s, idom(b)=s e idom(t)=s. En una cadena s→a→b→t, los enlaces inmediatos siguen la cadena.\n\nUna vez construido el árbol, las ciudades obligatorias para llegar a t son el camino desde t hasta s. Para preguntar si d domina a v en muchas consultas, aplana el árbol con tiempos de entrada y salida: d domina a v si el intervalo de d contiene el de v. No confundas este árbol con el árbol DFS usado para construirlo; representan relaciones diferentes.'],
['Una ruta a la construcción rápida: semidominadores','Lengauer–Tarjan empieza numerando los alcanzables por DFS y guardando sus padres. Un semidominador de w es el vértice de menor número DFS que puede llegar a w por un camino cuyos vértices internos tienen números mayores que el de w. Procesa w en orden DFS inverso. Para cada predecesor v, usa eval(v) para recuperar la etiqueta con menor semidominador sobre el camino de ancestros que ya se ha unido; actualiza semi[w] con ese mínimo.\n\nGuarda w en un grupo asociado a semi[w], une w con su padre DFS y procesa el grupo del padre: para cada v, toma u=eval(v); asigna provisionalmente idom[v]=u si semi[u]<semi[v], o el padre en otro caso. Después recorre en orden DFS creciente: si el idom provisional de w difiere de semi[w], reemplázalo por idom[idom[w]]. eval usa compresión de caminos conservando además la mejor etiqueta, no simplemente el representante DSU habitual. El vínculo entre semidominador e inmediato es justamente la corrección de esa segunda pasada.'],
['Escoge el costo que puedes justificar y probar','La implementación de semidominadores necesita demostrar invariantes de eval y de las uniones; agregar compresión sin actualizar etiquetas da respuestas plausibles pero falsas. Las variantes simples y las que equilibran las estructuras tienen análisis distintos: no atribuyas automáticamente O(m α(n)) a cualquier código con DSU. Para esta unidad implementaremos el método exacto por eliminación con cotas moderadas y una complejidad explícita.\n\nPrueba rombos, cadenas, ciclos, aristas paralelas y un destino inalcanzable. Para verificar un candidato no obligatorio, conserva una ruta que lo evita; para uno obligatorio, comprueba la desconexión al omitirlo. Cuando pases al algoritmo rápido, la comparación contra este oráculo ofrece una comprobación independiente y reproducible.']
],[reflect('caminos','No basta el camino más corto','El grafo tiene aristas 1→2, 2→4, 1→3, 3→5, 5→4. Todas pesan uno. ¿Qué vértices dominan a 4 desde 1? ¿Por qué analizar únicamente caminos mínimos da una conclusión incorrecta?',['La ruta por 2 es más corta, pero existe otra por 3 y 5.','Dominar considera todos los caminos dirigidos.'],'Solo 1 y 4 dominan a 4. El camino mínimo 1→2→4 pasa por 2, pero 1→3→5→4 lo evita. Los vértices 3 y 5 tampoco son obligatorios porque la ruta por 2 los evita. Las distancias no aparecen en la definición de dominación.'),program('obligatorias','Ciudades que ninguna ruta puede evitar','Entrada: n,m (1≤n≤500, 0≤m≤5000), seguidos de m aristas dirigidas u,v entre 1 y n. El origen es 1 y el destino n. Si no hay ruta, imprime 0 y termina. Si la hay, imprime la cantidad de vértices presentes en toda ruta y, en la siguiente línea, esos vértices en orden creciente. Incluye origen y destino.',['Primero comprueba alcanzabilidad sin prohibir ningún vértice.','Para cada d, recorre el grafo omitiéndolo; si pierdes el destino, d es obligatorio.'],'Existe una ruta que evita d exactamente cuando el destino sigue alcanzable al prohibir d. Así la prueba es equivalente a la definición, incluso con ciclos. El recorrido marca visitados y no se queda atrapado en ellos. Repetimos n recorridos, con costo O(n(n+m)) y memoria O(n+m), apropiado para estas cotas.',String.raw`#include <iostream>
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
['Separa el bosque real de los árboles auxiliares','El bosque representado contiene las aristas del problema. Un link-cut tree lo descompone en caminos preferidos y representa cada camino con un splay, un árbol binario auxiliar. Los hijos izquierdo y derecho del splay ordenan vértices a lo largo del camino; no son necesariamente hijos del vértice en el bosque real. Cambiar preferencia reorganiza la representación sin añadir ni quitar una arista real.\n\nCada nodo conserva un padre p. Si su padre lo tiene como hijo izquierdo o derecho, es un enlace auxiliar. Si no, p representa la conexión desde la cabeza de un camino hacia el camino superior. Por eso isRoot(x) no pregunta solamente si p[x] es cero: también comprueba si x aparece entre los hijos de p[x]. Confundir ambos tipos de relación rompe las rotaciones.'],
['Mantén sumas y giros antes de rotar','El agregado de un nodo del splay es valor[x]+suma[hijo izquierdo]+suma[hijo derecho]. pull(x) lo recalcula después de modificar hijos. Para invertir la dirección de un camino, intercambia los hijos y alterna una marca reverse. push(x) transmite esa inversión a los hijos antes de examinar su estructura.\n\nAntes de splay(x), reúne sus ancestros auxiliares y empuja marcas de arriba hacia abajo. Después aplica rotaciones zig-zig cuando x y su padre están del mismo lado, o zig-zag cuando están en lados opuestos. Cada rotación actualiza padres, el hijo intermedio y el enlace desde el abuelo si este pertenece al mismo splay; finalmente recalcula primero el nodo que bajó y después el que subió. No recomputes sumas con hijos todavía equivocados.'],
['Expón un camino con access','access(x) convierte el camino desde la raíz representada hasta x en un camino preferido. Empieza last=0 y sube usando los padres de camino. En cada y, haz splay(y), cambia su hijo derecho por last y actualiza la suma; guarda last=y y continúa hacia su padre de camino. Termina haciendo splay(x).\n\nEl hijo derecho anterior deja de ser preferido, pero su puntero de padre puede seguir apuntando a y como enlace de camino. No lo borres pensando que eliminaste una arista del bosque. Después de access(x), x queda como raíz auxiliar y no tiene hijo derecho; su subárbol izquierdo representa sus ancestros en orden. Esta operación es la pieza común para consultas, actualizaciones y cambios de raíz.'],
['Construye makeroot, link y cut con condiciones claras','makeroot(x) hace access(x) e invierte el camino expuesto. Así x pasa a ser raíz del árbol representado sin cambiar las aristas. Para encontrar la raíz de un componente, haz access(x), baja por hijos izquierdos empujando marcas y finalmente haz splay del vértice encontrado.\n\nPara link(u,v), primero makeroot(u). Si la raíz de v es u, ya estaban conectados y añadir una arista crearía un ciclo; rechaza esa operación. En otro caso, pon p[u]=v como enlace de camino. Para cut(u,v), haz makeroot(u) y access(v). Si la arista existe directamente, u debe ser el hijo izquierdo de v y no debe tener hijo derecho; entonces separa ese enlace, limpia p[u] y recalcula v. Sin la comprobación de adyacencia podrías cortar un camino entero o una arista equivocada.'],
['Consulta y modifica el camino expuesto','Para sumar valores en el camino u–v, comprueba conectividad, haz makeroot(u) y access(v). El splay de v representa exactamente ese camino, por lo que suma[v] es la respuesta. Para cambiar el valor de un vértice x, haz access(x), cambia valor[x] y recalcula su agregado.\n\nPor ejemplo, con valores 2,5,7 y aristas 1–2,2–3, la consulta 1–3 da 14. Cambiar el valor de 2 a cuatro da 13. Cortar 2–3 deja 1 y 3 desconectados. Reunirlos con 1–3 crea un bosque diferente; la consulta 2–3 ahora recorre 2–1–3 y sigue incluyendo los tres valores. Los nombres makeroot y access describen cambios de representación; solo link y cut modifican las aristas del problema.'],
['Conoce qué garantiza la estructura y qué no','Las operaciones de splay y access dan O(log n) amortizado por operación en la estructura estándar; una operación individual puede tardar más. El análisis amortizado distribuye el costo sobre toda la secuencia, no impone que cada árbol auxiliar tenga altura logarítmica en todo momento. La memoria es O(n).\n\nEl agregado mostrado suma caminos, no subárboles del bosque representado. Para consultas de subárbol se necesitan además contribuciones de hijos virtuales y mantenimiento durante access. Si el agregado depende del orden, como un hash de camino, guarda versiones hacia delante y hacia atrás e intercámbialas al invertir. Antes de usar restricciones grandes, compara operaciones aleatorias con un bosque pequeño guardado en listas y búsquedas BFS; prueba cortes y enlaces repetidos, consultas u=u y cambios de raíz sucesivos.']
],[reflect('bosques','Distingue reorganizar de cortar','Un bosque tiene aristas 1–2 y 2–3. Ejecutas makeroot(3), access(1) y después consultas 2–3. ¿Qué aristas reales siguen existiendo? ¿Cuál sería el error de interpretar el hijo derecho descartado en access como una arista eliminada?',['makeroot y access solo cambian caminos preferidos.','Las operaciones que modifican el bosque real son link y cut.'],'Siguen existiendo 1–2 y 2–3. La consulta 2–3 usa la arista directa entre ambos. Un hijo que deja de ser preferido conserva una conexión virtual al resto del bosque; borrarla convertiría una reorganización interna en una desconexión real. Los árboles auxiliares representan caminos y no deben confundirse con la topología original.'),program('bosque','Suma sobre un bosque que cambia','Entrada: n,q (1≤n≤20000, 1≤q≤20000), luego n valores entre −1000000000 y 1000000000. El bosque empieza sin aristas. Cada operación es L u v para enlazar componentes distintos, C u v para cortar una arista existente, U u valor para actualizar un vértice, o Q u v para consultar la suma del camino. Los L y C son válidos. En cada Q imprime la suma, o −1 si están desconectados. Los vértices van de 1 a n.',['Expón u–v con makeroot(u) y access(v).','Empuja inversiones antes de rotar y recalcula sumas después.'],'El camino expuesto queda representado por un solo splay y su suma incluye exactamente los vértices del trayecto. Los cambios de raíz no modifican aristas; link y cut sí. Los valores y agregados usan long long. La complejidad es O((n+q) log n) amortizada como cota global y memoria O(n); el código usa almacenamiento indexado para mantener estables las referencias.',String.raw`#include <iostream>
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
