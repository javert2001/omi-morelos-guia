import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
import { polynomialExpansions } from './advanced-polynomials.ts';
export const advancedStringsExpansions: Record<string,LessonExpansion> = {
...polynomialExpansions,
'usaco-adv-string-search': chapter('usaco-adv-string-search',[
["Construir y usar la función de prefijos","Un borde es un prefijo propio que también es sufijo. Guarda en pi[i] la longitud del mayor borde del patrón hasta i. Para calcularlo, empieza j=pi[i−1]. Si patrón[i] no coincide con patrón[j], prueba el borde más corto j=pi[j−1] mientras j>0. Si las letras coinciden, aumenta j. Guarda ese valor en pi[i].\n\nLos saltos no omiten candidatos: un borde más corto también es borde del mayor. Al leer el texto, usa el mismo procedimiento contra el patrón. Cuando j llegue a su longitud, cuenta una aparición y vuelve a pi[j−1] para conservar posibles solapamientos.\n\nEl índice del texto nunca retrocede. Cada aumento de j corresponde a una letra procesada, y sus descensos totales no superan sus aumentos. El tiempo es lineal. Aquí el patrón debe ser no vacío."],
["Reutilizar una ventana para Z","Mantén [l,r), un fragmento que coincide con el prefijo del texto. Si i<r, puedes empezar con z[i]=min(r−i,z[i−l]); si está fuera, empieza en cero. Después compara s[z[i]] con s[i+z[i]] y aumenta z[i] mientras coincidan y no salgas del texto. Si alcanzas más lejos que r, actualiza l=i y r=i+z[i]. Usa z[0]=0 por convenio.\n\nEn aabcaab, Z es [0,1,0,0,3,1,0]. Desde i=4 encuentras aab y guardas [4,7). En i=5 reutilizas z[1]=1.\n\nPara buscar un patrón, calcula Z sobre patrón + separador + texto, con un separador que no aparezca en ninguno. Una coincidencia de al menos la longitud del patrón indica una aparición. Las extensiones totales del borde derecho son O(n), más una comparación fallida por posición."],
["Radios de Manacher","Para palíndromos impares, d1[i] cuenta los radios válidos alrededor de i, incluido el centro. El mayor tiene longitud 2d1[i]−1. Guarda el palíndromo [l,r] que llega más lejos. Si i≤r, inicia k=min(d1[l+r−i],r−i+1); fuera de él, usa k=1. Expande comparando i−k con i+k mientras existan y coincidan. Guarda d1[i]=k y, si avanzaste, actualiza [l,r]=[i−k+1,i+k−1].\n\nPara pares, el centro está entre i−1 e i. Empieza k=0 fuera del intervalo; dentro, usa min(d2[l+r−i+1],r−i+1). Compara i−k−1 con i+k. Guarda d2[i]=k y actualiza a [i−k,i+k−1] si corresponde.\n\nLa reflexión solo garantiza la parte contenida en el palíndromo conocido. Después de esa frontera debes comparar. Sumar todos los d1 y d2 cuenta apariciones por posición, incluidas las que comparten el mismo texto."],
["Enlaces de fallo en Aho–Corasick","Inserta los patrones en un trie y cuenta cuántos terminan en cada nodo. El enlace de fallo apunta al mayor sufijo propio que también aparece como prefijo en el trie. Con BFS, procesa primero los nodos menos profundos. Los hijos de la raíz fallan a la raíz. Para una arista v→u con letra c, fallo[u] es la transición por c desde fallo[v].\n\nCon alfabeto fijo, completa cada transición faltante usando la del enlace de fallo. En la raíz, las faltantes vuelven a la raíz. Antes de procesar hijos, suma cuenta[fallo[v]] a cuenta[v].\n\nAl leer una letra del texto haces una transición y agregas cuenta[estado]. Así incluyes los patrones que terminan como sufijos y las repeticiones del diccionario. Para listar posiciones por patrón, usa enlaces de salida o listas; copiar todas las listas en cada nodo puede ocupar memoria cuadrática."],
["Un nodo por palíndromo distinto","El árbol palindrómico, o eertree, tiene raíces de longitud −1 y cero. Guarda en last el mayor sufijo palindrómico del texto leído. Al agregar s[pos], sigue enlaces desde last hasta un v tal que pos−1−len[v] sea válido y esa letra coincida con s[pos]. La raíz de longitud −1 siempre permite formar una sola letra. La transición por esa letra representa envolver el palíndromo de v.\n\nSi la transición existe, úsala. Si no, crea un nodo de longitud len[v]+2. Para longitud uno, su enlace va a la raíz de longitud cero. En otro caso, repite la búsqueda desde link[v] y toma su transición por la nueva letra.\n\nActualiza last e incrementa su contador. Al finalizar, propaga contadores de mayor a menor longitud por los enlaces. Cada letra crea como mucho un nodo, así que hay O(n) palíndromos distintos."],
["Elegir qué contar","KMP o Z bastan para un patrón. Manacher calcula radios de palíndromos; el eertree conserva cada palíndromo distinto y permite contar sus apariciones. Aho–Corasick reúne varios patrones. Elige la representación según la pregunta.\n\nComprueba cadenas cortas comparando directamente en cada posición. Para palíndromos, enumera intervalos y compara sus extremos; usa un conjunto si piden textos distintos. Incluye aaaa, patrones repetidos y un patrón contenido en otro.\n\nContar y listar tienen costos distintos. Aunque puedas contar rápido, imprimir una cantidad cuadrática de apariciones ya requiere tiempo cuadrático. Los ejercicios usan letras de a a z, de modo que cada posición representa un carácter simple."]
],[reflect('z',"Tabla Z con letras repetidas","Calcula Z para aaaaa usando z[0]=0. Después cuenta cuántas veces aparece aa en el texto, permitiendo que dos apariciones compartan letras.",["Desde cada posición, todo el fragmento restante coincide con el comienzo del texto.","Una aparición de aa necesita dos posiciones. Revisa los comienzos de cero a tres."],"Obtienes Z=[0,4,3,2,1]. aa aparece cuatro veces, empezando en 0,1,2,3. Cada posición inicial cuenta por separado, aunque el texto encontrado sea el mismo.\n\nSi saltaras dos posiciones después de cada coincidencia, perderías las apariciones que empiezan dentro de la anterior."),program('kmp',"Contar apariciones con KMP","Lee un patrón y un texto, ambos no vacíos, formados por letras de a a z y de longitud como mucho 100000 cada uno. Imprime cuántas veces aparece el patrón en el texto. Cuenta también las apariciones superpuestas.",["Prepara pi, la función de prefijos del patrón.","Cuando completes una aparición, vuelve a pi[m−1]. Esa parte final todavía puede comenzar otra coincidencia."],"Guarda en j la longitud del mayor prefijo del patrón que coincide con el final del texto procesado. Ante un fallo, los enlaces pi llevan a los siguientes bordes posibles sin retroceder en el texto.\n\nDespués de una coincidencia completa, conserva su mayor borde. Así puedes detectar otra que comparta letras con la anterior. El tiempo es O(|patrón|+|texto|) y la memoria adicional O(|patrón|).",String.raw`#include <iostream>
#include <string>
#include <vector>
using namespace std;
int main() {
    string p, t;
    cin >> p >> t;
    int m = p.size();
    vector<int> pi(m);
    for (int i = 1; i < m; i++) {
        int j = pi[i - 1];
        while (j && p[i] != p[j])
            j = pi[j - 1];
        if (p[i] == p[j])
            ++j;
        pi[i] = j;
    }
    int j = 0, answer = 0;
    for (char c : t) {
        while (j && c != p[j])
            j = pi[j - 1];
        if (c == p[j])
            ++j;
        if (j == m) {
            ++answer;
            j = pi[j - 1];
        }
    }
    cout << answer << '\n';
}
`,[['aba ababa\n','2\n'],['aa aaaaa\n','4\n'],['abc ab\n','0\n'],['a a\n','1\n']]),program('manacher',"Contar intervalos palindrómicos","Lee una palabra s de una a 100000 letras de a a z. Imprime cuántos intervalos no vacíos de s son palíndromos. Dos intervalos en posiciones distintas cuentan por separado, aunque tengan las mismas letras.",["Calcula por separado los radios impares d1 y los pares d2.","Cada radio válido determina un intervalo palindrómico con ese centro."],"Cada palíndromo tiene un centro y una paridad únicos. d1[i] cuenta los impares centrados en i; d2[i], los pares centrados entre i−1 e i. Suma ambos arreglos para contar cada intervalo una vez.\n\nUsa long long: con todas las letras iguales, los n(n+1)/2 intervalos son palíndromos. Manacher obtiene los radios en O(n) tiempo y usa O(n) memoria.",String.raw`#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size();
    vector<int> d1(n), d2(n);
    long long ans = 0;
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = i > r ? 1 : min(d1[l + r - i], r - i + 1);
        while (i - k >= 0 && i + k < n && s[i - k] == s[i + k])
            ++k;
        d1[i] = k;
        ans += k;
        if (i + k - 1 > r) {
            l = i - k + 1;
            r = i + k - 1;
        }
    }
    for (int i = 0, l = 0, r = -1; i < n; i++) {
        int k = i > r ? 0 : min(d2[l + r - i + 1], r - i + 1);
        while (i - k - 1 >= 0 && i + k < n && s[i - k - 1] == s[i + k])
            ++k;
        d2[i] = k;
        ans += k;
        if (i + k - 1 > r) {
            l = i - k;
            r = i + k - 1;
        }
    }
    cout << ans << '\n';
}
`,[['abba\n','6\n'],['aaaa\n','10\n'],['a\n','1\n'],['abc\n','3\n']]),program('aho',"Buscar un diccionario de patrones","Lee q (1≤q≤10000), luego q palabras no vacías y finalmente un texto no vacío. Solo contienen letras de a a z. La suma de las longitudes de los patrones no supera 100000; la del texto tampoco. Imprime el total de apariciones de todos los patrones. Si un patrón está repetido en la lista, sus apariciones cuentan por cada copia.",["En el trie, cuenta cuántos patrones terminan en cada nodo y propaga esas cantidades por los enlaces de fallo.","Procesa el texto con las transiciones completas. Suma la cuenta del estado alcanzado después de cada letra."],"El estado conserva el prefijo más largo del trie que coincide con un sufijo del texto leído. Sus enlaces de fallo representan los otros sufijos que podrían terminar un patrón.\n\nAl sumar las cuentas siguiendo el orden BFS, cada estado acumula todos los patrones que terminan allí, incluidas copias repetidas. Cada letra del texto agrega esa cuenta. Con L igual a la longitud total de patrones y T a la del texto, el tiempo es O(26L+T) y la memoria O(26L).",String.raw`#include <iostream>
#include <string>
#include <vector>
#include <array>
#include <queue>
using namespace std;
struct Node {
    array<int, 26> next;
    int link = 0;
    long long count = 0;
    Node() { next.fill(-1); }
};
int main() {
    int q;
    cin >> q;
    vector<Node> tr(1);
    while (q--) {
        string p;
        cin >> p;
        int v = 0;
        for (char ch : p) {
            int c = ch - 'a';
            if (tr[v].next[c] == -1) {
                int id = tr.size();
                tr[v].next[c] = id;
                tr.emplace_back();
            }
            v = tr[v].next[c];
        }
        ++tr[v].count;
    }
    queue<int> bfs;
    for (int c = 0; c < 26; c++) {
        int u = tr[0].next[c];
        if (u == -1)
            tr[0].next[c] = 0;
        else
            bfs.push(u);
    }
    while (!bfs.empty()) {
        int v = bfs.front();
        bfs.pop();
        tr[v].count += tr[tr[v].link].count;
        for (int c = 0; c < 26; c++) {
            int u = tr[v].next[c];
            if (u == -1)
                tr[v].next[c] = tr[tr[v].link].next[c];
            else {
                tr[u].link = tr[tr[v].link].next[c];
                bfs.push(u);
            }
        }
    }
    string text;
    cin >> text;
    int v = 0;
    long long answer = 0;
    for (char ch : text) {
        v = tr[v].next[ch - 'a'];
        answer += tr[v].count;
    }
    cout << answer << '\n';
}
`,[['2\nhe\nshe\nshehe\n','3\n'],['2\na\naa\naaa\n','5\n'],['2\na\na\naa\n','4\n'],['1\nz\nabc\n','0\n']])]),
'usaco-adv-suffix-array': chapter('usaco-adv-suffix-array',[
["Posiciones originales y posiciones ordenadas","Todas las subcadenas que empiezan en i son prefijos del sufijo que empieza en i. Por eso ordenar los sufijos organiza también las subcadenas sin copiarlas. Guarda en SA las posiciones originales, y en rango[i] el lugar donde quedó el sufijo i. Un arreglo deshace la permutación del otro.\n\nPara banana, SA=[5,3,1,0,4,2] y rango=[3,2,5,1,4,0]. El sufijo de la posición uno ocupa el lugar dos en SA. Su predecesor está en SA[2−1]=3. Distingue siempre una posición del texto de una posición dentro del orden: los cálculos de LCP usan ambas."],
["Construcción por duplicación","Empieza con rango[i] igual al código de la letra. Para k=1,2,4,…, ordena los índices por (rango[i],rango[i+k]); usa −1 si la segunda mitad queda fuera. Asigna rangos nuevos: dos posiciones reciben el mismo si sus pares coinciden. Escríbelos en otro arreglo para no cambiar los datos que todavía comparas.\n\nEn banana, los bloques de dos letras distinguen ba, an, na y a seguida del final. Las posiciones uno y tres todavía comparten an. La ronda de cuatro letras separa anan de ana seguida del final.\n\nPuedes terminar cuando todos los rangos sean diferentes. Con sort, cada ronda cuesta O(n log n) y hay O(log n) rondas: esta versión tarda O(n log² n)."],
["LCP con Kasai","Recorre i en el orden original del texto. Sea r=rango[i]. Si r=0, no hay predecesor: reinicia h=0. Si no, toma j=SA[r−1] y compara desde i+h y j+h. Aumenta h mientras las letras coincidan y ambas posiciones existan. Guarda LCP[r]=h. Antes del siguiente i, reduce h en uno si es positivo.\n\nPuedes conservar h−1 porque quitar la primera letra de dos sufijos con h letras comunes deja h−1 coincidencias. El predecesor del siguiente sufijo puede cambiar, pero no reduce esa cota: los sufijos con un mismo prefijo quedan juntos en el orden.\n\nEntre iteraciones h disminuye como mucho uno; sus aumentos acumulados son O(n). Así Kasai calcula LCP en tiempo lineal."],
["Descontar las subcadenas repetidas","El sufijo SA[r] aporta n−SA[r] prefijos no vacíos. Los primeros LCP[r] ya aparecieron en el anterior. Ningún sufijo más atrás comparte un prefijo mayor que ese vecino, porque los que empiezan igual forman un bloque contiguo. Su contribución nueva es n−SA[r]−LCP[r].\n\nAl sumar obtienes n(n+1)/2−ΣLCP. En aaaa, SA=[3,2,1,0] y LCP=[0,1,2,3]. Hay diez intervalos por posición y restas seis repeticiones: quedan a, aa, aaa, aaaa.\n\nLa respuesta puede ser O(n²) aunque los arreglos solo ocupen O(n). Usa long long para la cuenta."],
["Buscar patrones y comparar sufijos","Los sufijos que empiezan con un patrón ocupan un intervalo contiguo. Dos búsquedas binarias localizan sus extremos: el primer sufijo cuyo prefijo no es menor que el patrón y el primero que es mayor, comparando hasta la longitud del patrón. La diferencia cuenta las apariciones. Cada comparación puede recorrer |p| letras, así que cuesta O(|p| log n).\n\nEl prefijo común de dos sufijos es el mínimo de LCP entre sus rangos. Una estructura RMQ permite responder esas consultas con rapidez.\n\nPara dos textos concatenados, usa un separador fuera del alfabeto y evita coincidencias que crucen sus fronteras. Los LCP entre vecinos de distinto origen permiten encontrar la subcadena común más larga."]
],[reflect('lcp',"Subcadenas de abab","Para s=abab, el arreglo de sufijos es [2,0,3,1]. Calcula LCP con LCP[0]=0 y usa esos valores para contar las subcadenas distintas.",["Los sufijos ordenados son ab, abab, b y bab. Compara cada uno con su vecino anterior.","Hay 4·5/2 intervalos por posición. Resta la suma de LCP."],"LCP=[0,2,0,1]. Su suma es tres, así que quedan 10−3=7 textos distintos: a,b,ab,ba,aba,bab,abab.\n\nPor ejemplo, al llegar al sufijo abab, sus prefijos a y ab ya aparecieron en ab. Solo agrega aba y abab. LCP mide exactamente esa parte repetida."),program('distintas-sa',"Contar con SA y LCP","Lee una palabra s de una a 20000 letras de a a z. Construye su arreglo de sufijos y LCP, y después imprime cuántas subcadenas distintas no vacías contiene.",["Ordena pares de rangos para bloques de longitud 1,2,4,… hasta distinguir los sufijos.","Calcula LCP con Kasai. La respuesta es n(n+1)/2 menos la suma de LCP."],"La duplicación ordena bloques cada vez mayores hasta obtener el orden de los sufijos completos. Después Kasai calcula cuánto coincide cada sufijo con su predecesor.\n\nCada sufijo aporta sus prefijos, salvo los que ya aparecieron en el anterior. Restar los LCP cuenta cada texto una sola vez. La construcción con sort tarda O(n log² n); Kasai es lineal. La memoria total es O(n).",String.raw`#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <numeric>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size();
    vector<int> sa(n), rank(n), next(n);
    iota(sa.begin(), sa.end(), 0);
    for (int i = 0; i < n; i++)
        rank[i] = (unsigned char)s[i];
    for (int k = 1; k < n; k *= 2) {
        auto second = [&](int i) { return i + k < n ? rank[i + k] : -1; };
        auto cmp = [&](int a, int b) {
            return rank[a] != rank[b] ? rank[a] < rank[b] : second(a) < second(b);
        };
        sort(sa.begin(), sa.end(), cmp);
        next[sa[0]] = 0;
        for (int i = 1; i < n; i++)
            next[sa[i]] = next[sa[i - 1]] + (cmp(sa[i - 1], sa[i]) ? 1 : 0);
        rank = next;
        if (rank[sa.back()] == n - 1)
            break;
    }
    for (int i = 0; i < n; i++)
        rank[sa[i]] = i;
    long long ans = 1LL * n * (n + 1) / 2;
    int h = 0;
    for (int i = 0; i < n; i++) {
        if (rank[i] == 0) {
            h = 0;
            continue;
        }
        int j = sa[rank[i] - 1];
        while (i + h < n && j + h < n && s[i + h] == s[j + h])
            ++h;
        ans -= h;
        if (h)
            --h;
    }
    cout << ans << '\n';
}
`,[['banana\n','15\n'],['aaaa\n','4\n'],['a\n','1\n'],['abab\n','7\n'],['abc\n','6\n']])]),
'usaco-adv-string-suffix': chapter('usaco-adv-string-suffix',[
["Separar una clase con un clon","Al agregar c, crea cur con len[cur]=len[last]+1. Empieza p=last: agrega las transiciones por c que falten hacia cur y sigue link[p]. Si llegas a −1, enlaza cur con la raíz. Si encuentras una transición hacia q y len[p]+1=len[q], enlaza cur con q.\n\nEn el otro caso, crea clone copiando las transiciones y el enlace de q, pero usa len[clone]=len[p]+1. Desde p, redirige hacia clone las transiciones por c que todavía apunten a q, siguiendo los enlaces. Finalmente, link[q]=link[cur]=clone.\n\nEl clon separa longitudes cortas que ahora tienen más posiciones finales, sin perder sus continuaciones. No representa una nueva aparición de prefijo, por lo que su contador empieza en cero. El de cur empieza en uno."],
["Contar subcadenas y apariciones","Cada estado no inicial representa las longitudes len[link[v]]+1,…,len[v], todas con los mismos finales. Su contribución a las subcadenas distintas es len[v]−len[link[v]].\n\nPara frecuencias, recorre estados de mayor a menor longitud y agrega ocurrencias[v] a ocurrencias[link[v]]. Puedes ordenarlos con counting sort en O(n), porque las longitudes no superan n. Para buscar un patrón, sigue sus letras desde la raíz. Si termina en v, su frecuencia es la de v después de propagar; si falta una transición, no aparece.\n\nPara la subcadena común más larga con otro texto, recórrelo conservando estado y longitud. Ante un fallo sigue enlaces y recorta la longitud al len del nuevo estado. Al avanzar por una transición, aumenta la longitud. Guarda el mayor valor alcanzado."],
["Árbol de sufijos desde SA y LCP","Agrega un terminador único para que ningún sufijo sea prefijo de otro. Las hojas del árbol comprimido representan sufijos; la profundidad de un nodo mide la longitud del texto desde la raíz. Procesa los sufijos en orden de SA y mantén una pila con el camino a la hoja anterior. El LCP con el nuevo sufijo indica dónde deben separarse.\n\nSaca nodos mientras su profundidad supere ese LCP. Si la cima queda a la profundidad exacta, agrega ahí la nueva hoja. Si queda más arriba, crea un nodo interno a profundidad LCP, mueve bajo él la rama anterior y agrega la nueva hoja.\n\nCada arista guarda un intervalo del sufijo representante: desde su inicio más la profundidad del padre hasta su inicio más la del hijo. Cada nodo entra y sale una vez de la pila. La conversión es O(n) después de construir SA y LCP."],
["Qué conserva Ukkonen","Ukkonen agrega una letra por fase y mantiene un árbol implícito del prefijo leído. Su punto activo consta de nodo, arista y desplazamiento dentro de ella. Las hojas pueden compartir el extremo derecho de la fase, y un contador registra las extensiones pendientes.\n\nSi falta una transición, crea una hoja. Si la siguiente letra de la arista coincide con la nueva, aumenta la longitud activa y termina la fase: lo pendiente ya queda representado implícitamente. Si no coincide, divide la arista, agrega una hoja y enlaza el nodo interno creado con el siguiente de la cadena de extensiones.\n\nTras una extensión, sigue un enlace de sufijo o ajusta el punto activo en la raíz. Salta aristas completas antes de comparar si el desplazamiento alcanza su longitud. El terminador hace explícitos todos los sufijos. Estas son las piezas de la construcción en línea; para implementarla por lotes, SA+LCP suele ser más fácil de comprobar."],
["Relaciones entre las estructuras","En un árbol de sufijos, un DFS que visita aristas por orden de primera letra produce SA al leer las hojas. La profundidad del ancestro común de dos hojas da su LCP. El autómata agrupa por finales compartidos; el árbol comparte prefijos de sufijos. Sus enlaces representan cosas distintas.\n\nCon varios textos, registra a qué orígenes pertenece cada estado u hoja y excluye los separadores de las respuestas. Puedes usar máscaras para pocos orígenes o conjuntos fusionados para muchos.\n\nEl eertree guarda únicamente palíndromos distintos. Sus enlaces van a sufijos palindrómicos, no a cualquier subcadena. Su construcción y la propagación de ocurrencias están en la lección de búsqueda de cadenas."],
["Pruebas pequeñas y memoria","Para textos de hasta ocho letras, enumera las subcadenas y guárdalas en un conjunto. Compara su cantidad con el autómata y con SA/LCP. Después cuenta apariciones directamente, permitiendo solapamientos, para comprobar los contadores propagados. Usa abbbb para provocar clones y aaaaa para comprobar coincidencias largas.\n\nCon alfabeto fijo, el autómata usa O(n) estados y tiempo. Reserva espacio para cerca de 2n estados; un arreglo de 26 transiciones por estado tiene un costo real de memoria. No conserves una referencia a un elemento de vector durante push_back: una realocación puede invalidarla. El código usa índices y vuelve a acceder al vector después de insertar."]
],[reflect('clases',"Clones y apariciones","Lista las subcadenas distintas de abb. Explica por qué b aparece dos veces y ab una sola, y por qué crear un clon en el autómata no debe agregar por sí mismo una aparición.",["Compara las posiciones finales de b con las de ab, numerando desde cero.","Un clon separa grupos existentes. No añade una posición al texto."],"Hay cinco textos distintos: a,b,ab,bb,abb. b termina en las posiciones uno y dos; ab solo en la uno. Al agregar la última b, esas longitudes necesitan clases diferentes porque ya no comparten sus finales.\n\nEl clon representa esa separación y empieza con contador cero. Las apariciones reales se obtienen al propagar los contadores de los estados creados para los prefijos del texto."),program('automata',"Contar con un autómata de sufijos","Lee una palabra s de una a 100000 letras de a a z. Construye su autómata de sufijos e imprime cuántas subcadenas distintas no vacías contiene.",["Cada estado v distinto de la raíz aporta len[v]−len[link[v]].","Al clonar, copia transiciones y enlace, ajusta la longitud y redirige las transiciones que correspondan."],"El autómata agrupa subcadenas con los mismos finales. Cada estado representa una subcadena de cada longitud entre len[link[v]]+1 y len[v]. Sumar el tamaño de esos intervalos cuenta todos los textos distintos sin construirlos.\n\nCon alfabeto fijo, la construcción usa O(n) tiempo y memoria. Guarda la suma en long long, porque puede haber O(n²) subcadenas distintas.",String.raw`#include <iostream>
#include <string>
#include <vector>
#include <array>
using namespace std;
struct State {
    int len = 0, link = -1;
    array<int, 26> next;
    State() { next.fill(-1); }
};
int main() {
    string s;
    cin >> s;
    vector<State> st;
    st.reserve(2 * s.size() + 1);
    st.emplace_back();
    int last = 0;
    for (char ch : s) {
        int c = ch - 'a', cur = st.size();
        st.emplace_back();
        st[cur].len = st[last].len + 1;
        int p = last;
        while (p != -1 && st[p].next[c] == -1) {
            st[p].next[c] = cur;
            p = st[p].link;
        }
        if (p == -1)
            st[cur].link = 0;
        else {
            int q = st[p].next[c];
            if (st[p].len + 1 == st[q].len)
                st[cur].link = q;
            else {
                int clone = st.size();
                st.push_back(st[q]);
                st[clone].len = st[p].len + 1;
                while (p != -1 && st[p].next[c] == q) {
                    st[p].next[c] = clone;
                    p = st[p].link;
                }
                st[q].link = st[cur].link = clone;
            }
        }
        last = cur;
    }
    long long answer = 0;
    for (int v = 1; v < (int)st.size(); v++)
        answer += st[v].len - st[st[v].link].len;
    cout << answer << '\n';
}
`,[['aba\n','5\n'],['abb\n','5\n'],['aaaa\n','4\n'],['banana\n','15\n'],['a\n','1\n']])]),
};
