import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const combinatorialExpansions: Record<string,LessonExpansion> = {
'usaco-adv-fracturing-search': chapter('usaco-adv-fracturing-search',[
['La cola representa regiones todavía no exploradas','Imagina un conjunto gigantesco de candidatos y un algoritmo que encuentra el mejor de cualquier región restringida. Guarda en una cola de prioridad una región y su mejor candidato. Extrae la región con menor costo, entrega su candidato y divide lo que queda en regiones disjuntas. Calcula el mejor de cada región nueva y vuelve a insertarlas. No necesitas materializar todo el espacio.\n\nEl invariante es preciso: las regiones pendientes particionan todos los candidatos aún no entregados y cada una anuncia su mínimo real. Por eso el menor de esos mínimos es el siguiente resultado global. Si las regiones se solapan, puedes entregar dos veces el mismo objeto. Si una región anuncia solamente una estimación, ya no puedes entregar ese candidato como respuesta sin comprobar más condiciones.'],
['Un árbol implícito para sumas de subconjuntos','Ordena números no negativos a[0]≤a[1]≤… . La raíz es el subconjunto vacío, de suma cero; su único hijo es {0}. Un estado no vacío guarda su suma s y su mayor índice i. Si existe i+1, tiene dos hijos: añadir i+1, con suma s+a[i+1], y sustituir i por i+1, con suma s−a[i]+a[i+1]. Ambas sumas son al menos s.\n\nCada subconjunto no vacío aparece exactamente una vez. Si su máximo es j>0 y contiene j−1, su padre se obtiene quitando j; si no contiene j−1, el padre sustituye j por j−1. El caso {0} viene de la raíz. Esta regla de padre único evita un conjunto de visitados, aunque distintas selecciones tengan la misma suma. El estado comprimido no necesita guardar todos los índices para generar los costos de sus hijos.'],
['Sigue una extracción completa y distingue empates','Con valores [2,3,5], extraemos vacío=0, después {2}=2. Ese estado genera {2,3}=5 y {3}=3. Extraemos {3}=3 y genera {3,5}=8 y {5}=5. Ahora la cola tiene dos candidatos con costo cinco: {2,3} y {5}; son distintos y ambos cuentan. El quinto valor, contando el vacío como primero, es cinco.\n\nSi el enunciado solicita valores distintos, esta enumeración requiere una adaptación: saltar empates cambia cuántas extracciones hacen falta y ya no podemos limitar el trabajo por la cantidad de resultados distintos. Si hay entradas negativas, para ordenar sumas de todos los subconjuntos podemos empezar con el subconjunto de todos los negativos y costo base igual a su suma. Cambiar la decisión de incluir cada elemento cuesta su valor absoluto; obtenemos un problema no negativo sobre esos costos.'],
['Particiona decisiones generales por su primera diferencia','Para árboles de expansión u otros objetos combinatorios, un subproblema puede fijar decisiones obligatorias y prohibidas. Después de encontrar su mejor solución T, ordena sus decisiones libres elegidas como e1,e2,… . Crea una región por i: fuerza e1 hasta e(i−1) y prohíbe ei, manteniendo las restricciones previas. Toda solución diferente de T tiene una primera decisión de T que no cumple, así que cae en una región y solo una.\n\nPara un árbol de expansión, el optimizador restringido es Kruskal: añade primero las aristas obligatorias, rechaza si forman ciclo, y completa con aristas permitidas por peso. Si no conecta todos los vértices, la región es vacía. Los nuevos mínimos nunca son menores que el mínimo de su región padre. La partición debe usar solo decisiones libres; prohibir una arista que ya era obligatoria produciría regiones incoherentes.'],
['Analiza cuántos candidatos generas realmente','Si cada extracción genera como máximo D regiones y resolver una cuesta T, entregar K objetos cuesta O(KDT + KD log(KD)), además del costo inicial. Esa cuenta explica por qué un espacio exponencial puede ser manejable para K pequeño. No demuestra que cualquier problema sea fácil: el optimizador de cada región puede seguir siendo costoso.\n\nPara sumas de subconjuntos, D≤2 y el costo nuevo se calcula en O(1), dando O(n log n + K log K) tiempo y O(n+K) memoria. Prueba con n≤15 enumerando todos los subconjuntos y ordenando sus sumas. Incluye ceros, repetidos y K=1: son las pruebas que detectan deduplicación accidental y errores con el subconjunto vacío.']
],[reflect('duplicados','Un empate es un objeto diferente','Para los números [1,1,2], escribe las ocho sumas de subconjuntos en orden, contando multiplicidad. ¿Cuál es la cuarta? ¿Y el cuarto valor distinto?',['Los dos unos tienen índices diferentes.','Agrupa por cantidad de unos elegidos y por si eliges el dos.'],'Las sumas son 0,1,1,2,2,3,3,4. La cuarta suma es 2. Los valores distintos son 0,1,2,3,4, así que el cuarto valor distinto es 3. Una cola que elimina estados solo por tener la misma suma descartaría subconjuntos válidos; la identidad del objeto y su costo son conceptos distintos.'),program('subconjuntos','La k-ésima suma','Entrada: n y k, seguidos de n enteros no negativos a[i]. Límites: 1≤n≤100000, 1≤k≤min(100000,2^n), 0≤a[i]≤1000000000. Imprime la k-ésima suma de subconjunto en orden no decreciente. Incluye el vacío y cuenta multiplicidades.',['Ordena y empieza con el estado de suma cero y último índice −1.','Al extraer un estado no vacío, genera añadir el siguiente índice y reemplazar el último.'],'Los hijos de un estado nunca tienen menor suma y cada subconjunto posee un padre único. La cola extrae el menor candidato no visitado, por lo que la k-ésima extracción es la respuesta. No eliminamos sumas repetidas: pueden pertenecer a distintos subconjuntos. Las sumas caben en long long. Tiempo O(n log n+k log k), memoria O(n+k).',String.raw`#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>
#include <functional>
#include <utility>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<long long> a(n);
    for (auto &x : a)
        cin >> x;
    sort(a.begin(), a.end());
    using S = pair<long long, int>;
    priority_queue<S, vector<S>, greater<S>> q;
    q.push({0, -1});
    for (int t = 1; t <= k; t++) {
        auto [sum, i] = q.top();
        q.pop();
        if (t == k) {
            cout << sum << '\n';
            break;
        }
        if (i + 1 < n) {
            q.push({sum + a[i + 1], i + 1});
            if (i >= 0)
                q.push({sum - a[i] + a[i + 1], i + 1});
        }
    }
}
`,[['3 5\n1 2 4\n','4\n'],['2 4\n0 0\n','0\n'],['2 3\n2 2\n','2\n'],['1 1\n8\n','0\n'],['1 2\n8\n','8\n']])]),
'usaco-adv-matroid': chapter('usaco-adv-matroid',[
['Prueba el intercambio en un ejemplo accesible','En el matroide de partición, cada elemento pertenece a una categoría y la categoría c tiene cupo b[c]. Un conjunto es independiente si no excede ningún cupo. El vacío cumple las restricciones y quitar elementos nunca las viola. Para intercambio, considera independientes A y B con |A|<|B|. Alguna categoría contiene más elementos de B que de A, pues de lo contrario sumar por categorías daría |B|≤|A|.\n\nElige de esa categoría un elemento de B que no esté en A. Al añadirlo a A, su cantidad sigue siendo a lo sumo la de B, que ya respetaba el cupo. Las demás categorías no cambian. Así verificamos los tres axiomas con una demostración concreta; decir simplemente «parece un problema voraz» no sería suficiente.'],
['Distingue maximal, máximo y base','Maximal significa que no puedes añadir un elemento; máximo significa que tiene el mayor tamaño posible. En una familia arbitraria pueden ser diferentes. En un matroide todo independiente maximal es una base y todas las bases tienen igual tamaño: si una base A fuera menor que otra B, intercambio permitiría ampliar A, contradicción.\n\nEse tamaño común se llama rango del matroide. El rango de un subconjunto X es el máximo tamaño independiente usando solo elementos de X. En un grafo con n vértices, el rango de sus aristas es n−c, donde c cuenta componentes, incluidos vértices aislados. Si el grafo no es conexo, una base es un bosque de expansión, no un árbol que mágicamente conecta componentes sin aristas.'],
['Entiende la prueba voraz como mantener una solución óptima','Queremos una base de costo mínimo. Supón que el prefijo voraz P está contenido en alguna base óptima B. Cuando elegimos e que mantiene la independencia, si e ya está en B no cambia nada. Si no, B+e contiene un circuito, un subconjunto dependiente mínimo. Ese circuito incluye un elemento f fuera de P: si estuviera enteramente en P+e, P+e no sería independiente.\n\nReemplazar ese f por e conserva una base. Además, f no era una opción independiente más barata que e cuando se escogió e; si lo fuera, el recorrido ordenado la habría considerado y aceptado mientras seguía disponible. La propiedad de intercambio permite escoger el reemplazo que respeta el prefijo, y el costo no aumenta. Repetir el argumento hace coincidir una base óptima con todo el resultado voraz. Es la estructura de intercambio, no el acto de ordenar por sí solo, lo que sostiene la garantía.'],
['Encuentra un contraejemplo antes de aplicar el teorema','Considera conjuntos de vértices sin vecinos entre sí en el camino 1−2−3. A={2} es independiente y maximal. B={1,3} también es independiente y tiene mayor tamaño. Ningún elemento de B puede añadirse a A, así que falla intercambio. Esta familia no es un matroide, aunque sea cerrada por subconjuntos.\n\nAsignar peso 3 al centro y 2 a cada extremo muestra el fallo voraz de máximo peso: tomar primero el centro obtiene 3; tomar ambos extremos obtiene 4. Tampoco «aristas que forman un emparejamiento» es en general un matroide. En la próxima lección veremos por qué dos restricciones que por separado son matroides pueden requerir caminos aumentantes al combinarse.'],
['Adapta el objetivo y el oráculo de independencia','Para máximo peso sin obligación de completar una base, recorre pesos decrecientes y descarta los negativos; añadir uno negativo empeoraría el valor. Para una base obligatoria no puedes descartarlos sin más: quizá necesites esos elementos para alcanzar el rango. Si hay una cuota exacta, comprueba primero que exista una selección con ese tamaño.\n\nEl oráculo responde si un conjunto conserva independencia. En partición basta un contador por categoría; en el gráfico un DSU detecta ciclos; en el lineal una base algebraica detecta dependencia. Ordenar cuesta O(n log n), pero debes sumar el costo real del oráculo. Comprueba la versión incremental contra enumeración exhaustiva en conjuntos pequeños y compara tanto factibilidad como valor óptimo.']
],[reflect('axioma','Verifica o refuta un matroide','En E={a,b,c}, se permiten todos los subconjuntos de tamaño a lo sumo dos, excepto {a,b}. ¿Es un matroide? Verifica el caso de intercambio que podría parecer problemático.',['Los conjuntos de dos permitidos son {a,c} y {b,c}.','Compara cada singleton con cada conjunto permitido de tamaño dos.'],'Sí. El vacío y la heredabilidad se cumplen. Desde cualquier singleton hacia un conjunto permitido de dos elementos siempre existe una ampliación: desde {a} hacia {b,c} podemos añadir c; desde {b} hacia {a,c} también c; desde {c} se puede añadir a o b según corresponda. El resto de casos es inmediato. Es un matroide de partición con categorías {a,b} y {c}, ambas de cupo uno.'),program('cupos','Elige talleres con cupos','Entrada: n y c (1≤n≤100000, 1≤c≤100000), después c cupos b[j] entre 0 y n, y después n líneas categoría y valor. Categorías de 1 a c; valores entre −1000000000 y 1000000000. Selecciona cualquier cantidad de talleres sin exceder cupos y maximiza la suma de valores. Imprime esa suma.',['Ordena talleres de mayor a menor valor.','Acepta uno positivo si su categoría tiene cupo; no es obligatorio llenar todos los cupos.'],'Los cupos definen un matroide de partición. El esquema voraz acepta el mejor elemento aún independiente; los negativos se descartan porque el conjunto vacío está permitido y no exigimos tamaño fijo. Los contadores son un oráculo O(1). El tiempo es O(n log n+c) y la memoria O(n+c).',String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <utility>
using namespace std;
int main() {
    int n, c;
    cin >> n >> c;
    vector<int> cap(c);
    for (int &x : cap)
        cin >> x;
    vector<pair<long long, int>> a;
    for (int i = 0; i < n; i++) {
        int cat;
        long long w;
        cin >> cat >> w;
        a.push_back({w, cat - 1});
    }
    sort(a.rbegin(), a.rend());
    long long ans = 0;
    for (auto [w, cat] : a)
        if (w > 0 && cap[cat] > 0) {
            ans += w;
            --cap[cat];
        }
    cout << ans << '\n';
}
`,[['5 2\n1 2\n1 9\n1 6\n2 8\n2 7\n2 -1\n','24\n'],['2 1\n0\n1 5\n1 10\n','0\n'],['3 1\n3\n1 -2\n1 0\n1 -1\n','0\n'],['2 2\n1 1\n1 1000000000\n2 1000000000\n','2000000000\n']])]),
'usaco-adv-matroid-isect': chapter('usaco-adv-matroid-isect',[
['Dos restricciones simples pueden bloquear el voraz','Supón que cada propuesta conecta una escuela con un taller y no puedes usar dos propuestas de la misma escuela ni dos del mismo taller. Cada restricción por separado es un matroide de partición. Tomar cualquier propuesta válida hasta atascarse puede producir una selección pequeña. Con propuestas (A,1), (A,2), (B,1), elegir (A,1) impide añadir las otras dos, aunque (A,2) y (B,1) forman una selección de tamaño dos.\n\nLa solución exige deshacer una elección y sustituirla por dos. El algoritmo de intersección busca una cadena de intercambios que conserva la posibilidad de satisfacer ambos sistemas. El problema de esta lección es maximizar cardinalidad; asignar pesos requiere una variante adicional y no se resuelve cambiando BFS por una cola ordenada sin analizar costos y potenciales.'],
['Construye el grafo de intercambio con direcciones explícitas','Sea S independiente en ambos matroides M1 y M2. Cada elemento del universo es un vértice. Para x fuera de S e y dentro de S, dibuja y→x si S−y+x es independiente en M1, y x→y si es independiente en M2. Los elementos x que pueden añadirse directamente en M1 son fuentes; los que pueden añadirse directamente en M2 son destinos.\n\nBusca con BFS un camino de longitud mínima desde cualquier fuente a cualquier destino. Alterna elementos externos e internos y comienza y termina fuera. Cambia pertenencia de todos los elementos del camino: añades uno más de los que quitas. Las direcciones no son intercambiables de manera aislada; invertirlas exige intercambiar también qué matroide define las fuentes y los destinos.'],
['Recorre el ejemplo y comprueba la selección final','Con S={(A,1)}, M1 controla escuelas y M2 talleres. El elemento (B,1) puede añadirse en M1, así que es fuente. No puede añadirse en M2 porque comparte taller uno. Hay un arco (B,1)→(A,1), pues quitar (A,1) libera ese taller. Después existe (A,1)→(A,2), porque el reemplazo respeta las escuelas. (A,2) es destino, ya que su taller dos está libre en S.\n\nEl camino aumenta a {(B,1),(A,2)}. Observa que no estamos obligados a conservar independencia después de añadir solamente el primer elemento: la actualización del camino se considera completa. Revisa el conjunto final en los dos oráculos. Repetimos la construcción desde el nuevo S porque los intercambios posibles cambiaron.'],
['Por qué un camino mínimo es la pieza clave','La propiedad de circuitos de los matroides permite probar que alternar un camino aumentante mínimo mantiene independencia en ambos. Si el conjunto final tuviera un circuito prohibido, los intercambios sobre ese circuito permitirían saltar una parte del camino y obtener uno más corto, contradiciendo la elección por BFS. Esta es la razón de exigir longitud mínima; un recorrido arbitrario no proporciona esa garantía.\n\nTambién existe un certificado de optimalidad cuando no queda camino. Sean R los elementos alcanzables desde las fuentes. Puede demostrarse que |S| = rango1(E fuera de R) + rango2(R). Para cualquier conjunto común independiente T, sus elementos fuera de R son como máximo el primer rango y los de R como máximo el segundo. Así |T|≤|S|. La ausencia de camino no es simplemente «no encontré cómo mejorar»: proporciona una cota superior que alcanza la solución actual.'],
['Implementa primero un oráculo sencillo y correcto','Una implementación educativa puede reconstruir el conjunto en cada prueba de añadir o intercambiar. Si hay m elementos, rango final r y cada prueba cuesta T, construir todos los arcos usa O(mrT) por aumento; con r aumentos, O(mr²T), más los recorridos. Es costoso pero verificable para m pequeño. Implementaciones especializadas reutilizan estructuras para abaratar los oráculos.\n\nEn un matroide gráfico, reconstruir DSU con S−y y probar todas las aristas externas evita necesitar borrados arbitrarios. La contracción por un independiente F define que X es válido cuando X unido con F era independiente: sirve para fijar elecciones obligatorias. El dual tiene como bases los complementos de las bases originales; no se obtiene simplemente negando la respuesta del oráculo. Verifica estas transformaciones antes de combinarlas con intersección.']
],[reflect('direccion','Sigue los arcos correctos','En el ejemplo de escuelas A,B y talleres 1,2, empieza con S={(A,1)}. Explica por qué no es suficiente añadir directamente (A,2), y escribe el camino que permite alcanzar tamaño dos.',['La restricción de escuelas impide usar A dos veces.','Empieza con una propuesta que sí sea añadible en el primer matroide.'],'Añadir (A,2) viola la unicidad de escuela A. La fuente es (B,1); el camino es (B,1)→(A,1)→(A,2). El primer intercambio libera taller uno en M2; el segundo permite cambiar la elección de A en M1. Alternar pertenencia quita (A,1) y añade las otras dos. El resultado tiene escuelas y talleres distintos.'),program('interseccion','Propuestas compatibles','Entrada: L, R y m (1≤L,R≤10, 0≤m≤40), seguidos de m pares u,v, con 1≤u≤L y 1≤v≤R. Cada propuesta puede elegirse una vez. Maximiza la cantidad elegida sin repetir u ni v. Imprime el tamaño. Este ejercicio implementa la intersección de dos matroides de partición mediante oráculos y BFS.',['El primer oráculo detecta escuelas u repetidas; el segundo detecta talleres v repetidos.','Construye fuentes, destinos y arcos de intercambio desde la selección actual en cada iteración.'],'La selección inicial vacía es independiente en ambos sistemas. Cada BFS encuentra un camino aumentante mínimo; invertir su pertenencia añade exactamente un elemento y conserva ambos cupos. Cuando no hay camino, la selección tiene cardinalidad máxima. Esta versión reconstruye los conjuntos para hacer transparente el algoritmo; con m≤40 su costo es adecuado. Un algoritmo especializado de emparejamiento sería más eficiente para instancias grandes.',String.raw`#include <iostream>
#include <vector>
#include <queue>
using namespace std;
int main() {
    int L, R, m;
    cin >> L >> R >> m;
    vector<int> u(m), v(m), in(m);
    for (int i = 0; i < m; i++)
        cin >> u[i] >> v[i];
    auto valid = [&](int which, int remove, int add) {
        vector<int> seen((which == 1 ? L : R) + 1);
        for (int i = 0; i < m; i++)
            if ((in[i] && i != remove) || i == add) {
                int c = which == 1 ? u[i] : v[i];
                if (seen[c]++)
                    return false;
            }
        return true;
    };
    int answer = 0;
    while (true) {
        vector<vector<int>> adj(m);
        vector<int> parent(m, -2);
        queue<int> q;
        for (int x = 0; x < m; x++)
            if (!in[x]) {
                if (valid(1, -1, x)) {
                    parent[x] = -1;
                    q.push(x);
                }
                for (int y = 0; y < m; y++)
                    if (in[y]) {
                        if (valid(1, y, x))
                            adj[y].push_back(x);
                        if (valid(2, y, x))
                            adj[x].push_back(y);
                    }
            }
        int finish = -1;
        while (!q.empty()) {
            int x = q.front();
            q.pop();
            if (!in[x] && valid(2, -1, x)) {
                finish = x;
                break;
            }
            for (int y : adj[x])
                if (parent[y] == -2) {
                    parent[y] = x;
                    q.push(y);
                }
        }
        if (finish == -1)
            break;
        for (int x = finish; x != -1; x = parent[x])
            in[x] ^= 1;
        ++answer;
    }
    cout << answer << '\n';
}
`,[['2 2 3\n1 1\n1 2\n2 1\n','2\n'],['1 1 0\n','0\n'],['2 2 2\n1 1\n1 2\n','1\n'],['3 3 4\n1 1\n2 1\n2 2\n3 3\n','3\n']])]),
};
