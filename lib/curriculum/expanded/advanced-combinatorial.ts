import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const combinatorialExpansions: Record<string,LessonExpansion> = {
'usaco-adv-fracturing-search': chapter('usaco-adv-fracturing-search',[
["Guardar el mejor de cada región","Supón que buscas las diez combinaciones más baratas de un menú enorme. No necesitas listar todas si puedes dividirlas en grupos y encontrar la más barata de cada grupo. Guarda esos mínimos en una cola de prioridad. Extrae el menor, entrega esa combinación y divide el resto de su grupo en regiones más pequeñas.\n\nLas regiones pendientes deben cubrir todos los candidatos que faltan, sin superponerse. Además, cada una debe anunciar su mínimo verdadero. Con esas condiciones, el menor de los mínimos es el siguiente resultado global. Si dos regiones comparten un candidato, podrías repetirlo; si anuncias solo una estimación, todavía no puedes entregarlo como respuesta."],
["Generar subconjuntos sin repetirlos","Ordena los valores no negativos a[0]≤a[1]≤… . Empieza con el subconjunto vacío, de suma cero; su único hijo es {0}. Para un estado no vacío guarda su suma s y su mayor índice i. Si existe i+1, genera dos hijos: agregarlo, con suma s+a[i+1], o reemplazar i por i+1, con suma s−a[i]+a[i+1]. Ningún hijo cuesta menos que su padre.\n\nCada subconjunto tiene un padre único. Si su máximo índice es j>0 y contiene j−1, el padre quita j. Si no contiene j−1, el padre cambia j por j−1. El caso {0} viene del vacío. Por eso no necesitas un conjunto de visitados. Aunque guardes solo suma e índice máximo, cada entrada de la cola representa una selección distinta."],
["Empates y valores negativos","Con [2,3,5], extraes primero el vacío y luego {2}. Este genera {2,3}, de suma cinco, y {3}, de suma tres. Extraes {3} y genera {3,5}, de suma ocho, y {5}, de suma cinco. Los dos candidatos de costo cinco son distintos: ambos cuentan. El quinto resultado, contando el vacío, vale cinco.\n\nSi piden sumas distintas, deberás saltar empates. Entonces K resultados pueden requerir más de K extracciones.\n\nPara admitir valores negativos, empieza con todos los negativos elegidos y usa su suma como costo base. Cambiar la decisión de un elemento cuesta su valor absoluto: quitar un negativo o agregar un positivo aumenta la suma en esa cantidad. Así vuelves al caso de costos no negativos."],
["Partir por la primera decisión diferente","Para enumerar árboles de expansión, una región puede fijar aristas obligatorias y prohibidas. Encuentra su mejor árbol T y ordena las aristas elegidas que todavía sean libres: e1,e2,… . La región i obliga a usar e1,…,e(i−1) y prohíbe ei, además de conservar las restricciones anteriores.\n\nCualquier árbol distinto de T omite alguna arista de T. La primera que omite determina una única región, así que no lo pierdes ni lo repites. Esta partición necesita que toda solución distinta omita alguna decisión elegida; no puedes aplicarla a cualquier familia sin comprobarlo.\n\nResuelve cada región con Kruskal: agrega primero las aristas obligatorias, rechaza los ciclos y completa con las permitidas por peso. Si no conectas todos los vértices, la región está vacía. No dividas usando una arista que ya era obligatoria."],
["Costo de la enumeración","Si cada extracción genera como mucho D regiones y resolver una cuesta T, obtener K objetos requiere O(KDT + KD log(KD)), además de la preparación. El espacio de soluciones puede ser exponencial y aun así permitir los primeros resultados. Todo depende del costo de resolver cada región.\n\nPara las sumas de subconjuntos, D≤2 y cada suma nueva se calcula en O(1). El costo total es O(n log n + K log K) y la memoria O(n+K). Comprueba la implementación enumerando todos los subconjuntos para n≤15. Prueba ceros, valores repetidos y K=1: permiten detectar si perdiste multiplicidades o te saltaste el vacío."]
],[reflect('duplicados',"Subconjuntos con la misma suma","Para [1,1,2], ordena las ocho sumas de subconjuntos, contando repeticiones. ¿Cuál ocupa el cuarto lugar? ¿Cuál sería el cuarto valor si eliminaras las sumas repetidas?",["Los dos unos ocupan posiciones distintas: elegir uno o el otro produce subconjuntos distintos.","Separa los subconjuntos según incluyan el dos. En cada grupo puedes elegir ninguno, uno o ambos unos."],"Las sumas ordenadas son 0,1,1,2,2,3,3,4. La cuarta es dos. Si conservas solo valores distintos, queda 0,1,2,3,4 y el cuarto es tres.\n\nUna cola que descarte estados por repetir una suma perdería selecciones válidas. Dos objetos pueden tener el mismo costo y aun así contar como resultados distintos."),program('subconjuntos',"La k-ésima suma","Lee n y k, seguidos de n enteros a[i] no negativos. Se cumple 1≤n≤100000, 1≤k≤min(100000,2^n) y 0≤a[i]≤1000000000. Imprime la k-ésima suma de subconjunto en orden no decreciente. El vacío cuenta y las sumas repetidas conservan sus lugares.",["Ordena los valores. Inicia la cola con suma cero e índice máximo −1, que representa el vacío.","Desde un estado no vacío puedes agregar el siguiente índice o reemplazar el máximo actual por él."],"Cada subconjunto tiene un único padre en el árbol de generación. Sus hijos nunca tienen una suma menor, porque los valores están ordenados y son no negativos. La cola entrega en cada paso el candidato pendiente más barato; la k-ésima extracción da la respuesta.\n\nConserva las sumas repetidas y cuenta el vacío como primera extracción. Usa long long para sumar. Ordenar cuesta O(n log n) y las extracciones O(k log k); la memoria es O(n+k).",String.raw`#include <iostream>
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
["Comprobar los tres axiomas","Imagina talleres separados por categoría, con cupo b[c] para cada una. Una selección es independiente si respeta todos los cupos. El conjunto vacío cumple la regla, y quitar talleres tampoco puede exceder un cupo. Falta comprobar intercambio.\n\nToma dos selecciones válidas A y B con |A|<|B|. En alguna categoría B tiene más talleres que A; si no ocurriera, B no podría ser mayor. Elige de esa categoría un taller de B que no esté en A. Al agregarlo a A, su cantidad no supera la que ya tenía B, así que respeta el cupo.\n\nLa familia cumple los tres axiomas y se llama matroide de partición. Esta prueba permite usar el teorema voraz; la apariencia del problema por sí sola no basta."],
["Maximal, máximo y base","Una selección es maximal cuando ya no puedes agregarle elementos. Es máxima cuando tiene el mayor tamaño posible. No significan lo mismo en cualquier problema.\n\nEn un matroide sí coinciden para los conjuntos independientes. Si uno maximal A fuera menor que otro independiente B, intercambio permitiría agregarle un elemento a A, contradiciendo que era maximal. Estos conjuntos se llaman bases y todos tienen el mismo tamaño, el rango.\n\nEl rango de un subconjunto X cuenta cuántos elementos independientes puedes elegir dentro de X. En el matroide gráfico vale n−c, donde c es la cantidad de componentes, incluidos los vértices aislados. Si el grafo está desconectado, una base es un bosque de expansión: no puede conectar componentes entre las que no hay aristas."],
["Por qué ordenar por peso funciona","Busca una base de costo mínimo. Recorre los elementos por peso creciente y acepta uno si mantiene la independencia. Para justificarlo, conserva esta afirmación: alguna base óptima B contiene todo el prefijo elegido P.\n\nAl aceptar e, si ya pertenece a B, la afirmación sigue cierta. Si no, B+e contiene un circuito, es decir, un conjunto dependiente mínimo. Ese circuito incluye un f fuera de P; de lo contrario, P+e sería dependiente. Cambiar f por e conserva una base que contiene P+e.\n\nAdemás, f no puede ser más barato que e. Si lo fuera, habría aparecido antes y habría sido aceptado: el prefijo de aquel momento unido con f era un subconjunto de B y, por tanto, independiente. El reemplazo no aumenta el costo. Repetirlo demuestra que el resultado completo es óptimo."],
["Una familia que no es un matroide","En el camino de tres vértices 1−2−3, elige vértices que no sean vecinos. A={2} es una selección válida y maximal. B={1,3} también es válida y tiene mayor tamaño. Sin embargo, no puedes agregar a A ninguno de los elementos de B. Falla intercambio.\n\nPon peso tres en el centro y dos en cada extremo. Elegir primero el de mayor peso obtiene tres; elegir ambos extremos obtiene cuatro. Este ejemplo muestra por qué ordenar y aceptar lo que quepa no siempre funciona.\n\nLos emparejamientos de aristas tampoco forman un matroide en general. Combinar dos restricciones que sí son matroides por separado puede necesitar un algoritmo de intercambios, como veremos en la siguiente lección."],
["Objetivo y comprobación de independencia","Si buscas máximo peso y puedes elegir cualquier tamaño, recorre pesos decrecientes y omite los negativos. No estás obligado a empeorar la suma. Si debes completar una base, en cambio, quizá necesites algunos negativos para alcanzar su tamaño. Una cuota exacta también exige comprobar que exista una selección de ese tamaño.\n\nLa función que decide si una selección es independiente se llama oráculo. Para cupos bastan contadores; para aristas sin ciclos, un DSU; para vectores independientes, una base algebraica. Al costo O(n log n) de ordenar debes sumar el de esas comprobaciones.\n\nCon entradas pequeñas, enumera todas las selecciones y compara tanto su validez como su peso. Esto sirve para probar tu implementación después de justificar que la familia cumple los axiomas."]
],[reflect('axioma',"Comprobar el intercambio","En E={a,b,c}, permite los subconjuntos de tamaño como mucho dos, excepto {a,b}. ¿Forman un matroide? Comprueba en particular el intercambio entre conjuntos de uno y dos elementos.",["Los únicos conjuntos permitidos de tamaño dos son {a,c} y {b,c}.","Desde {a}, ¿qué elemento de {b,c} puedes agregar? Haz lo mismo con los demás conjuntos de un elemento."],"Sí. El vacío está permitido y quitar elementos conserva la validez. Desde {a} hacia {b,c}, puedes agregar c; desde {b} hacia {a,c}, también c. Desde {c}, puedes agregar a o b según el conjunto de destino. Los casos donde el elemento ya coincide se amplían con el que falta.\n\nTambién puedes verlo como dos categorías, {a,b} y {c}, con cupo uno cada una. Es un matroide de partición."),program('cupos',"Elegir talleres con cupos","Lee n y c (1≤n,c≤100000), después c cupos b[j] entre cero y n. Luego recibe n líneas con la categoría y el valor de un taller. Las categorías van de uno a c y los valores de −1000000000 a 1000000000. Elige cualquier cantidad de talleres sin exceder los cupos e imprime la mayor suma de valores posible.",["Considera primero los talleres de mayor valor.","Acepta uno positivo si todavía queda cupo en su categoría. Puedes dejar cupos vacíos."],"Ordena por valor decreciente. Acepta un taller positivo cuando su categoría tenga espacio y reduce ese cupo. Los cupos forman un matroide de partición, de modo que esta elección voraz obtiene el máximo peso.\n\nOmite valores negativos porque no se exige completar una base; los ceros tampoco mejoran la suma. Cada comprobación de cupo cuesta O(1). El costo total es O(n log n+c), con O(n+c) memoria.",String.raw`#include <iostream>
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
["Por qué puede hacer falta deshacer una elección","Cada propuesta conecta una escuela con un taller. No puedes repetir escuela ni taller. Cada regla por separado define un matroide de partición. Con propuestas (A,1), (A,2), (B,1), elegir (A,1) te deja atascado con una sola. Sin embargo, (A,2) y (B,1) forman una selección de dos.\n\nPara mejorar necesitas quitar una propuesta y agregar otras dos. El algoritmo de intersección encuentra cadenas de estos cambios. Aquí buscamos la mayor cantidad de elementos. La variante con pesos requiere otro análisis; no basta con reemplazar BFS por una cola de prioridad."],
["Grafo de intercambios","Sea S independiente en los matroides M1 y M2. Crea un vértice por elemento. Para x fuera de S e y dentro, agrega y→x si S−y+x es independiente en M1. Agrega x→y si ese intercambio es independiente en M2.\n\nLas fuentes son los x que puedes agregar directamente en M1. Los destinos son los x que puedes agregar directamente en M2. Busca con BFS el camino más corto entre alguna fuente y algún destino. Alterna elementos externos e internos, empezando y terminando fuera.\n\nCambia la pertenencia de todos sus elementos: agrega los que estaban fuera y quita los que estaban dentro. Añades uno más de los que quitas. Conserva la dirección indicada para cada matroide; las fuentes, los destinos y los arcos deben usar la misma convención."],
["Seguir una cadena de cambios","Empieza con S={(A,1)}. M1 controla escuelas y M2 talleres. (B,1) es fuente porque no repite escuela. No puedes agregarlo directamente en M2: el taller uno ya está ocupado.\n\nEl arco (B,1)→(A,1) permite liberar ese taller. Luego (A,1)→(A,2) respeta la regla de escuelas al sustituir una propuesta de A por la otra. (A,2) es destino porque el taller dos está libre en S.\n\nEl camino completo deja {(B,1),(A,2)}. Comprueba la selección final en ambos matroides; las adiciones parciales no tienen por qué ser válidas. Después reconstruye el grafo, porque los intercambios disponibles dependen del nuevo S."],
["Qué garantiza el camino más corto","El teorema de intersección asegura que cambiar la pertenencia a lo largo de un camino aumentante mínimo conserva ambas independencias. La prueba usa los circuitos: si la selección final fuera dependiente, sus intercambios permitirían saltar una parte del camino. Eso produciría un camino más corto, contradiciendo la elección de BFS. Este es el motivo para exigir longitud mínima.\n\nCuando no hay camino, sea R el conjunto alcanzable desde las fuentes. El teorema da |S|=rango1(E fuera de R)+rango2(R). Esa igualdad certifica que no falta una selección mayor.\n\nEn efecto, cualquier selección común independiente T tiene como mucho rango1(E fuera de R) elementos fuera de R y rango2(R) dentro. Al sumar obtienes |T|≤|S|. La justificación completa del teorema usa propiedades de circuitos; este argumento explica cómo su certificado demuestra optimalidad."],
["Implementar los oráculos","Para empezar, puedes reconstruir el conjunto cada vez que pruebas una adición o un intercambio. Con m elementos, rango final r y costo T por prueba, construir todos los arcos cuesta O(mrT) por aumento. Con r aumentos, obtienes O(mr²T), más los recorridos. Es una opción clara para entradas pequeñas.\n\nEn el matroide gráfico, construye un DSU con S−y y prueba las aristas externas. Así evitas implementar borrados en DSU.\n\nSi quieres fijar un conjunto independiente F como obligatorio, usa contracción: X es válido cuando X unido con F era independiente. El dual, en cambio, tiene como bases los complementos de las bases originales. No equivale a negar la respuesta del oráculo. Estas transformaciones requieren sus propias comprobaciones antes de combinarlas con intersección."]
],[reflect('direccion',"Encontrar un camino aumentante","Hay propuestas (A,1), (A,2), (B,1). No puedes repetir escuela ni taller y ya elegiste S={(A,1)}. Explica por qué no puedes agregar directamente (A,2) y encuentra el camino de intercambios que permite elegir dos propuestas.",["Agregar (A,2) repetiría la escuela A.","El primer matroide controla escuelas. Busca una propuesta externa que puedas agregar sin repetir una."],"La fuente es (B,1), porque B está libre. El camino es (B,1)→(A,1)→(A,2). El primer arco permite liberar el taller uno en el segundo matroide. El segundo reemplaza una propuesta de A por otra sin repetir escuela.\n\nCambia la pertenencia de todo el camino: quita (A,1) y agrega (B,1),(A,2). La selección final tiene dos escuelas distintas y dos talleres distintos."),program('interseccion',"Propuestas compatibles","Lee L,R,m, con 1≤L,R≤10 y 0≤m≤40. Después vienen m pares u,v, con 1≤u≤L y 1≤v≤R. Elige la mayor cantidad de propuestas sin repetir u ni v e imprime esa cantidad. Practica la intersección de dos matroides de partición construyendo los oráculos y el grafo de intercambios.",["Un oráculo comprueba que no se repitan valores u. El otro hace lo mismo con v.","Desde la selección actual, reconstruye fuentes, destinos y arcos. Busca con BFS un camino aumentante mínimo."],"Empieza con la selección vacía, válida para ambas reglas. Cada BFS encuentra un camino aumentante mínimo; al cambiar la pertenencia de sus elementos, la selección crece en uno y conserva las dos independencias. Repite hasta que no exista camino. El teorema de intersección garantiza entonces que la cantidad es máxima.\n\nLa implementación reconstruye las selecciones al consultar los oráculos. Con m≤40, ese costo permite seguir el algoritmo directamente. Para entradas grandes de este problema particular, conviene un algoritmo especializado de emparejamiento.",String.raw`#include <iostream>
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
