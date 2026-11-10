import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
import { polynomialExpansions } from './advanced-polynomials.ts';
export const advancedStringsExpansions: Record<string,LessonExpansion> = {
...polynomialExpansions,
'usaco-adv-string-search': chapter('usaco-adv-string-search',[
['Construye KMP sin retroceder en el texto','Para calcular pi[i], empieza j=pi[i−1]. Mientras j>0 y patrón[i] difiera de patrón[j], retrocede j=pi[j−1]. Si las letras coinciden, aumenta j; guarda pi[i]=j. Los saltos recorren todos los bordes candidatos en orden decreciente: cualquier borde más corto de un prefijo también es borde de su borde mayor. Por eso no omitimos una posibilidad al saltar.\n\nAl recorrer el texto aplica el mismo procedimiento, usando sus letras contra el patrón. Cuando j alcanza la longitud del patrón, registra una aparición y cambia j=pi[j−1] para permitir solapamientos. El índice del texto nunca retrocede. Cada aumento de j se puede cobrar a una letra procesada; los retrocesos totales no superan esos aumentos, dando tiempo lineal. Un patrón vacío exige definir qué significa coincidencia; aquí lo excluimos explícitamente.'],
['Calcula Z usando una ventana conocida','Mantén una ventana [l,r) donde el texto coincide con el prefijo de longitud r−l. Para una posición i<r, inicializa z[i]=min(r−i,z[i−l]); fuera de la ventana empieza en cero. Mientras i+z[i]<n y s[z[i]]=s[i+z[i]], aumenta z[i]. Si i+z[i]>r, reemplaza l=i y r=i+z[i]. Se suele definir z[0]=0 por convenio, aunque el prefijo completo tenga longitud n.\n\nEn aabcaab, los valores desde índice uno son 1,0,0,3,1,0. En i=4 descubrimos aab; la ventana cubre [4,7). En i=5 podemos reutilizar z[1]=1. Para buscar un patrón, usa patrón + separador + texto y detecta posiciones con z al menos igual a la longitud del patrón. La ventana solo extiende su extremo derecho n veces; las comparaciones fallidas añaden a lo sumo una por posición.'],
['Deriva los radios impares y pares de Manacher','Define d1[i] como el número de radios válidos centrados en la letra i, incluyendo el centro; el palíndromo máximo tiene longitud 2d1[i]−1. Mantén el intervalo inclusivo [l,r] del palíndromo que llega más a la derecha. Si i≤r, inicia k=min(d1[l+r−i],r−i+1); si no, k=1. Expande mientras i−k≥0, i+k<n y ambas letras coincidan. Guarda d1[i]=k y actualiza [l,r]=[i−k+1,i+k−1] si avanzó.\n\nPara pares, el centro está entre i−1 e i. Inicia k=0 fuera del intervalo, o min(d2[l+r−i+1],r−i+1) dentro. Compara i−k−1 con i+k; al terminar guarda d2[i]=k y el intervalo [i−k,i+k−1]. La reflexión reutiliza únicamente la parte totalmente dentro del palíndromo conocido. La suma de todos los d1 y d2 cuenta las ocurrencias de palíndromos, no solo sus textos distintos.'],
['Completa Aho–Corasick en orden de profundidad','Inserta todos los patrones en un trie y marca cuántos terminan en cada nodo. Sus aristas representan letras. El enlace de fallo de un nodo representa el mayor sufijo propio de su palabra que también existe como prefijo en el trie. Procesa nodos con BFS: los hijos de la raíz fallan a la raíz. Para una arista v→u por letra c, el fallo de u es la transición por c desde fallo[v].\n\nPara alfabeto fijo puedes completar las transiciones faltantes de v copiándolas desde fallo[v]; en la raíz, una letra faltante lleva a la raíz. Antes de procesar los hijos, acumula cuenta[v]+=cuenta[fallo[v]]. Así, al leer cada letra del texto, una transición basta y cuenta[estado] indica cuántos patrones terminan ahí, incluidos sufijos y patrones repetidos. Si necesitas posiciones de cada patrón, conserva enlaces de salida o listas; copiar todas las listas a cada nodo puede consumir memoria cuadrática.'],
['Construye un eertree para palíndromos distintos','Un árbol palindrómico tiene dos raíces: longitud −1 y longitud 0. Mantén last, el nodo del mayor sufijo palindrómico del prefijo leído. Al añadir s[pos], sigue enlaces de sufijo desde last hasta un nodo v donde pos−1−len[v]≥0 y esa letra sea s[pos]. El nodo de longitud −1 siempre permite formar el palíndromo de una sola letra. La transición v por s[pos] representa envolver su palíndromo con esa letra.\n\nSi la transición existe, reutilízala. Si no, crea un nodo de longitud len[v]+2. Cuando su longitud es uno, su enlace va a la raíz de longitud cero. En otro caso, repite la búsqueda desde link[v] y toma la transición por la nueva letra para hallar el enlace del nodo creado. Actualiza last y suma una aparición de sufijo ahí. Al final propaga contadores en orden decreciente de longitud hacia los enlaces para obtener todas las ocurrencias. Cada letra crea a lo sumo un nodo, por lo que hay O(n) palíndromos distintos.'],
['Elige qué quieres contar y verifica con enumeración','Para un patrón, KMP o Z son suficientes. Para radios de todos los centros, Manacher evita almacenar cada texto palindrómico. Para palíndromos distintos y sus frecuencias, el eertree conserva identidades. Para muchos patrones simultáneos, Aho–Corasick comparte prefijos y sufijos. Son representaciones diferentes; no se reemplazan simplemente cambiando una constante.\n\nEn cadenas cortas enumera todas las posiciones iniciales y compara letra por letra. Para palíndromos enumera intervalos y compara extremos; para textos distintos usa un conjunto. Incluye aaaa, patrones repetidos y un patrón contenido en otro. Un algoritmo lineal para localizar coincidencias no puede imprimir una cantidad cuadrática de apariciones en tiempo lineal: contar y enumerar tienen costos de salida diferentes. Los ejercicios usan letras a–z, de modo que cada posición corresponde a un carácter simple.']
],[reflect('z','Reconstruye una tabla Z','Calcula Z para aaaaa usando el convenio z[0]=0. ¿Cuántas ocurrencias de aa hay en ese texto, permitiendo solapamientos?',['Cada posición comparte con el prefijo todo lo que resta del texto.','Las posiciones iniciales válidas son de cero a tres.'],'Z=[0,4,3,2,1]. Hay cuatro apariciones de aa, empezando en 0,1,2 y 3. Son ocurrencias por posición; todas corresponden al mismo texto aa. Un algoritmo que después de encontrar una coincidencia saltara dos posiciones perdería las superpuestas.'),program('kmp','Todas las apariciones, incluso solapadas','Entrada: patrón y texto, dos palabras no vacías de letras a–z, cada una de longitud a lo sumo 100000. Imprime la cantidad de apariciones del patrón en el texto, permitiendo solapamientos.',['Calcula la función de prefijos del patrón.','Tras una coincidencia completa, vuelve al borde pi[m−1], no necesariamente a cero.'],'KMP mantiene la longitud del mayor prefijo del patrón que coincide con el sufijo procesado. Los enlaces de borde prueban exactamente las alternativas posibles tras un fallo. Después de una coincidencia, conservar el borde permite detectar apariciones superpuestas. Tiempo O(patrón+texto), memoria O(patrón).',String.raw`#include <iostream>
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
`,[['aba ababa\n','2\n'],['aa aaaaa\n','4\n'],['abc ab\n','0\n'],['a a\n','1\n']]),program('manacher','Cuenta todos los palíndromos','Entrada: una palabra s de 1 a 100000 letras a–z. Imprime cuántos intervalos no vacíos de s son palíndromos. Dos intervalos distintos cuentan por separado aunque tengan el mismo texto.',['Calcula radios impares y pares por separado.','Cada radio válido corresponde a un palíndromo centrado ahí.'],'Cada intervalo palindrómico tiene un único centro y paridad. d1[i] cuenta los impares con centro i y d2[i] los pares con centro entre i−1 e i. Sumar ambos arreglos cuenta cada intervalo una vez. Usamos long long porque una cadena de letras iguales tiene n(n+1)/2 palíndromos. Tiempo y memoria O(n).',String.raw`#include <iostream>
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
`,[['abba\n','6\n'],['aaaa\n','10\n'],['a\n','1\n'],['abc\n','3\n']]),program('aho','Un diccionario de patrones','Entrada: q (1≤q≤10000), luego q palabras no vacías a–z y finalmente un texto no vacío a–z. La suma de longitudes de patrones y la longitud del texto no superan 100000 cada una. Imprime la cantidad total de apariciones de todos los patrones. Patrones repetidos cuentan por separado.',['Acumula el número de terminales a través de los enlaces de fallo.','Procesa el texto con las transiciones completas y suma la cuenta de cada estado visitado.'],'El trie reconoce el prefijo más largo que es sufijo del texto leído. Los enlaces de fallo representan los demás sufijos que pueden terminar patrones. Al acumular sus terminales por BFS, cada transición del texto aporta todas las coincidencias que terminan en esa posición. Tiempo O(26L+T) y memoria O(26L), con L longitud total de patrones y T longitud del texto.',String.raw`#include <iostream>
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
['Distingue sufijos, subcadenas y posiciones','Un sufijo empieza en una posición y llega hasta el final. Una subcadena puede terminar antes. Todas las subcadenas que empiezan en i son prefijos del sufijo i. Por eso ordenar sufijos organiza indirectamente todas las subcadenas sin almacenarlas. El arreglo SA conserva posiciones originales; rango[i] conserva el lugar del sufijo i dentro de SA. Son permutaciones inversas, no el mismo arreglo.\n\nPara banana, SA=[5,3,1,0,4,2] y rango=[3,2,5,1,4,0]. Si quieres el predecesor lexicográfico del sufijo que empieza en uno, buscas SA[rango[1]−1]=SA[1]=3. Confundir una posición del texto con una posición del arreglo ordenado es una de las causas más comunes de errores en LCP.'],
['Duplica rangos de manera reproducible','Comienza con rango[i] igual al código de la letra. Para una longitud k=1,2,4,… ordena índices por el par (rango[i], rango[i+k]), usando −1 cuando i+k sale de la cadena. Recorre el orden resultante y asigna nuevos rangos: dos posiciones reciben el mismo rango si sus pares eran iguales. Usa un arreglo nuevo para los rangos; modificar el viejo mientras comparas cambia el significado de los pares.\n\nEn banana, los pares de letras de longitud dos distinguen ba, an, na y a con centinela; los comienzos uno y tres todavía comparten an. La siguiente ronda compara cuatro letras y separa anan de ana seguido del final. Cuando todos los rangos son diferentes podemos terminar. Si usamos sort, cada ronda cuesta O(n log n); con O(log n) rondas la cota es O(n log² n).'],
['Construye LCP con Kasai y una coincidencia reutilizable','Recorre posiciones i del texto, no posiciones de SA. Sea r=rango[i]. Si r=0, no hay predecesor y reinicia h=0. Si no, j=SA[r−1]. Mientras i+h y j+h estén dentro y las letras coincidan, aumenta h. Guarda LCP[r]=h; antes de pasar a i+1, reduce h en uno si es positivo.\n\n¿Por qué se puede empezar desde h−1? Al eliminar la primera letra de dos sufijos que compartían h, quedan h−1 letras iguales. El predecesor lexicográfico del siguiente sufijo puede cambiar, pero no reduce ese límite inferior: los sufijos con un prefijo fijo forman un bloque contiguo en el orden. El contador h solo aumenta O(n) veces en total, porque entre iteraciones disminuye a lo sumo uno. Así el cálculo es lineal.'],
['Justifica el conteo de subcadenas distintas','El sufijo SA[r] tiene n−SA[r] prefijos no vacíos. Sus primeros LCP[r] prefijos ya aparecieron en el sufijo anterior; todos los demás son nuevos. Ningún sufijo aún más atrás comparte un prefijo mayor que el predecesor, porque los que comparten un prefijo están juntos. La contribución es n−SA[r]−LCP[r]. Sumando da n(n+1)/2−ΣLCP.\n\nPara aaaa, SA=[3,2,1,0] y LCP=[0,1,2,3]. Hay diez intervalos por posición, pero solamente cuatro textos distintos: a,aa,aaa,aaaa. La suma de LCP es seis y diez menos seis da cuatro. El resultado puede ser cuadrático aunque SA y LCP ocupen memoria lineal, así que usa long long para el conteo.'],
['Usa el arreglo para buscar y relacionar cadenas','Un patrón aparece como prefijo en un intervalo contiguo de sufijos. Haz dos búsquedas binarias: la primera encuentra el primer sufijo cuyo prefijo no es menor que el patrón; la segunda, el primero que es mayor cuando comparas solo hasta la longitud del patrón. La diferencia da el número de apariciones. Una comparación puede costar O(longitud del patrón), por lo que esta versión tarda O(|p| log n).\n\nEl prefijo común de dos sufijos es el mínimo de LCP entre sus rangos; una estructura RMQ convierte esa propiedad en consultas rápidas. Para comparar dos textos concatenados, incorpora un separador fuera del alfabeto y recorta coincidencias que lo crucen. Un recorrido por sufijos de orígenes distintos puede encontrar la subcadena común más larga, usando LCP y teniendo en cuenta esas fronteras.']
],[reflect('lcp','Cuenta sin enumerar todos los textos','Para s=abab, el arreglo de sufijos es [2,0,3,1]. Calcula LCP con el convenio LCP[0]=0 y el número de subcadenas distintas.',['Los sufijos en orden son ab, abab, b, bab.','Resta la suma de LCP a 4·5/2.'],'LCP=[0,2,0,1]. La suma es tres y hay diez intervalos, así que existen siete subcadenas distintas: a,b,ab,ba,aba,bab,abab. El sufijo abab aporta solo aba y abab como nuevos respecto a ab; los prefijos a y ab ya habían aparecido.'),program('distintas-sa','Cuenta subcadenas con SA y LCP','Entrada: una palabra s de 1 a 20000 letras a–z. Imprime la cantidad de subcadenas distintas no vacías usando arreglo de sufijos y LCP.',['Ordena pares de rangos para longitudes 1,2,4… .','Calcula LCP con Kasai y réstalo de n(n+1)/2.'],'La construcción por duplicación ordena prefijos cada vez más largos hasta ordenar sufijos completos. Kasai encuentra las coincidencias con el predecesor. Cada sufijo aporta todos sus prefijos salvo los ya vistos en el anterior, de modo que la fórmula cuenta cada texto una vez. La versión con sort cuesta O(n log² n) y usa O(n) memoria.',String.raw`#include <iostream>
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
['Comprende qué divide un clon del autómata','Al extender con una letra c, crea cur con len[cur]=len[last]+1. Desde p=last, añade transiciones faltantes por c hacia cur y sigue link[p]. Si llegas a −1, link[cur]=raíz. Si encuentras p con transición a q y len[p]+1=len[q], enlaza cur a q. En otro caso necesitas separar la clase q: crea clone copiando sus transiciones y su enlace, pero con len[clone]=len[p]+1.\n\nMientras p exista y su transición c apunte a q, redirígela a clone y sigue los enlaces. Finalmente link[q]=link[cur]=clone. La copia conserva los futuros posibles; reducir len separa las longitudes cortas que ahora tienen más posiciones finales. El clon no suma una nueva terminación de prefijo: si llevas ocurrencias, inicia su contador en cero. El estado cur sí inicia con uno.'],
['Usa enlaces para contar y buscar','Cada estado no inicial representa las longitudes desde len[link[v]]+1 hasta len[v], con los mismos finales. Por eso contribuye exactamente len[v]−len[link[v]] subcadenas distintas. Para frecuencias, procesa estados de mayor a menor longitud y suma ocurrencias[v] a ocurrencias[link[v]]. Ordenarlos por longitud puede hacerse con counting sort en O(n), pues las longitudes no superan n.\n\nPara buscar un patrón, recorre sus letras desde la raíz; una transición faltante significa que no aparece. Si termina en v, su frecuencia es la de v tras propagar contadores. Para buscar la mayor subcadena común con otro texto, recórrelo manteniendo estado y longitud actual. Ante un fallo sigue enlaces, recorta la longitud a len del nuevo estado y prueba otra vez; al avanzar por una transición aumenta la longitud. Conserva el máximo observado.'],
['Construye un árbol de sufijos a partir de SA y LCP','Añade un terminador único al texto para que ningún sufijo completo sea prefijo de otro. En el árbol comprimido, las hojas representan sufijos y la profundidad de un nodo es la longitud de su etiqueta desde la raíz. Procesa los sufijos en orden de SA con una pila de nodos del camino a la hoja anterior. Para el siguiente sufijo, su LCP con el anterior determina la profundidad donde debe bifurcarse.\n\nSaca nodos mientras la cima tenga profundidad mayor que ese LCP. Si la cima queda exactamente a esa profundidad, añade ahí la nueva hoja. Si queda más arriba, crea un nodo interno a la profundidad LCP, mueve bajo él la rama del sufijo anterior y añade también la nueva hoja. Las etiquetas de arista son intervalos del texto del sufijo representante: desde su inicio más la profundidad del padre hasta su inicio más la profundidad del hijo. Cada nodo entra y sale una vez de la pila, así que esta conversión es lineal después de tener SA y LCP.'],
['Relaciona la construcción en línea con el punto activo','Ukkonen evita construir SA antes: incorpora una letra por fase manteniendo un árbol implícito de los sufijos del prefijo. El punto activo se representa por nodo, arista y desplazamiento dentro de ella; las aristas guardan intervalos del texto y todas las hojas pueden compartir el extremo derecho de la fase. Un contador registra cuántas extensiones de sufijos siguen pendientes.\n\nEn cada extensión, si falta la transición crea una hoja. Si la letra siguiente de la arista coincide con la nueva letra, aumenta la longitud activa y termina la fase: las extensiones restantes ya están representadas implícitamente. Si difiere, parte la arista en el punto activo, añade una hoja y enlaza el nodo interno creado con el siguiente nodo interno de la cadena de extensiones. Tras completar una extensión, sigue un enlace de sufijo o reduce el punto activo si estás en la raíz. Antes de comparar letras, salta aristas completas mientras el desplazamiento sea al menos su longitud. El terminador fuerza que todos los sufijos queden explícitos. La alternativa SA+LCP anterior ofrece una construcción completa más fácil de depurar para trabajo por lotes.'],
['Transforma representaciones según la consulta','Un DFS que visita las aristas del árbol por orden de primera letra produce SA leyendo sus hojas. La profundidad del ancestro común de dos hojas da el LCP de esos sufijos. El autómata organiza por finales compartidos; el árbol organiza prefijos compartidos de sufijos. Esa diferencia explica por qué sus enlaces y transiciones no se intercambian copiando índices.\n\nPara varias cadenas, distingue qué estados o hojas aparecen en cada origen y evita incluir separadores en respuestas. Puedes usar máscaras de orígenes cuando son pocos o conjuntos fusionados cuando son muchos. El mismo cuidado aparece en eertrees: sus nodos representan palíndromos distintos y sus enlaces representan sufijos palindrómicos, no todas las subcadenas. En la lección de búsqueda ya tienes el procedimiento de inserción y propagación para esa estructura.'],
['Valida estructuras complejas con objetos pequeños','Para cadenas de longitud hasta ocho, genera todas sus subcadenas y guárdalas en un conjunto. Compara su tamaño con la suma de intervalos de longitud del autómata y con SA/LCP. Después cuenta ocurrencias por comparación directa, incluyendo solapamientos, y revisa la propagación de enlaces. Usa textos como abbbb, donde aparecen clones, y aaaaa, donde las repeticiones son largas.\n\nCon alfabeto fijo, el autómata usa O(n) estados y transiciones de tamaño constante por estado. En una implementación de arreglos de 26 letras, esa constante consume memoria real: dimensiona para cerca de 2n estados. No conserves una referencia a un elemento de vector mientras haces push_back, porque una realocación puede invalidarla. El código usa índices y vuelve a acceder al vector después de cada inserción.']
],[reflect('clases','Cuenta las subcadenas sin repetirlas','Lista las subcadenas distintas de abb y explica por qué b tiene dos ocurrencias pero ab solo una. ¿Por qué la creación de un clon no debe aumentar por sí misma el conteo de apariciones?',['Las posiciones finales de b son distintas de las de ab.','Un clon reorganiza clases existentes, no añade una posición al texto.'],'Las subcadenas son a,b,ab,bb,abb: cinco. b termina en posiciones uno y dos; ab termina solo en uno. Al añadir la última b, una clase que antes agrupaba ciertas longitudes puede necesitar separarse porque cambian sus conjuntos de finales. El clon representa esa separación y arranca con contador cero; las apariciones reales llegan al propagar los estados correspondientes a los prefijos del texto.'),program('automata','Cuenta con un autómata de sufijos','Entrada: una palabra s de 1 a 100000 letras a–z. Imprime la cantidad de subcadenas distintas no vacías, construyendo un autómata de sufijos.',['Cada estado aporta len[v]−len[link[v]].','Al clonar, copia transiciones y enlace pero reduce la longitud; redirige las transiciones necesarias.'],'La construcción agrupa subcadenas con los mismos finales. Las longitudes representadas por cada estado forman un intervalo y esos intervalos, junto con sus clases, particionan todas las subcadenas distintas. Sumamos su tamaño sin enumerar textos. Con alfabeto fijo, tiempo y memoria son O(n); el contador es long long porque puede haber O(n²) respuestas.',String.raw`#include <iostream>
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
