import type { LessonExpansion } from '../types.ts';
import { chapter, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedRangeExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-segtree-ext': chapter(85, [
    s("El primer salón donde cabe un grupo", "Tienes cuatro salones con capacidades libres [2,7,1,5]. Llega un grupo de cuatro personas y debes asignarle el primer salón donde quepa. Recorrer las capacidades de izquierda a derecha encuentra la respuesta, pero repetir ese recorrido para muchos grupos puede costar O(nq).\n\nUn árbol de segmentos puede guardar el máximo de cada intervalo. Ese dato responde una pregunta concreta: si el máximo es menor que cuatro, ninguna posición del intervalo sirve. No necesitamos conocer todas sus capacidades para descartarlo. Usaremos índices desde cero e intervalos [l,r), que incluyen l y excluyen r."),
    s("Un resumen que permite descartar una mitad", "La mitad izquierda contiene [2,7] y guarda máximo 7; la derecha contiene [1,5] y guarda 5. La raíz combina ambos máximos y también guarda 7. Como 7≥4, sabemos que existe un salón adecuado.\n\nMira primero al hijo izquierdo. Si su máximo alcanza el tamaño del grupo, baja allí: cualquier respuesta de esa mitad aparece antes que las de la derecha. Si no alcanza, descarta toda la mitad izquierda y entra en la derecha. Repite hasta llegar a una hoja. Cada decisión usa el resumen de un hijo; no hace falta una búsqueda binaria que consulte intervalos completos."),
    s("Qué ocurre al llegar varios grupos", "Para el grupo de cuatro, entramos en [2,7], descartamos la capacidad 2 y elegimos el índice 1. Al ocuparlo, queda [2,3,1,5]. Recalculamos los máximos desde esa hoja hasta la raíz: el máximo izquierdo pasa a 3 y el total a 5.\n\nUn grupo de tres vuelve a usar el índice 1 y deja [2,0,1,5]. Uno de seis no cabe: basta comparar seis con el máximo 5 de la raíz. Elegir el salón de capacidad cinco para el primer grupo habría dejado menos espacio sobrante, pero no cumpliría la regla del primer salón. La prioridad por la izquierda forma parte del problema."),
    s("Por qué el descenso devuelve la primera posición", "Durante la búsqueda, el nodo actual siempre contiene una capacidad suficiente. Además, cada posición anterior que hemos descartado es demasiado pequeña. Estas dos afirmaciones son el invariante del recorrido.\n\nSi el hijo izquierdo alcanza el tamaño pedido, contiene una respuesta y sus índices preceden a los de la derecha. Si no alcanza, descartarlo no puede eliminar una respuesta válida. En ambos casos conservamos el invariante y reducimos el intervalo. Al llegar a una hoja, su posición es válida y ninguna anterior lo es. Después de ocuparla, solo cambian sus ancestros: recombinar sus máximos restaura el significado de todos los nodos."),
    s("Cuando la pregunta es una suma máxima", "El mismo árbol puede responder otra pregunta si cambiamos el resumen. Para la mayor suma de un bloque contiguo, cada nodo necesita cuatro datos: total T, mejor prefijo P, mejor sufijo S y mejor bloque B. Al unir los intervalos A y C, calculamos T=A.T+C.T, P=max(A.P,A.T+C.P), S=max(C.S,C.T+A.S) y B=max(A.B,C.B,A.S+C.P).\n\nEl último término contempla un bloque que cruza la frontera: un sufijo de A seguido de un prefijo de C. Para [-2,3] el resumen es (1,1,3,3); para [-1,4], (3,3,4,4). Juntos dan (4,4,6,6). Si no se permite un bloque vacío, una hoja v guarda (v,v,v,v), incluso cuando v es negativo."),
    s("Encontrar un objeto por su número de orden", "Si cada hoja guarda una frecuencia no negativa, puedes guardar sumas y buscar el k-ésimo objeto. Primero verifica 1≤k≤suma total. Si la suma izquierda alcanza k, baja a ese lado. En caso contrario, resta de k todos los objetos de la izquierda y busca los restantes en la derecha.\n\nLa condición de frecuencias no negativas permite interpretar cada suma como una cantidad de objetos. Con valores negativos, una suma pequeña puede ocultar un prefijo grande. Para encontrar el primer prefijo de suma al menos x en ese caso, guarda también el máximo prefijo; cuando descartes una mitad, ajusta x restándole su suma total."),
    s("Qué puede combinarse y cuánto cuesta", "El resumen de un intervalo debe obtenerse a partir de sus dos partes consecutivas. La combinación tiene que ser asociativa: cambiar los paréntesis no debe cambiar el resultado. No necesita ser conmutativa; concatenar ab con cd es distinto de hacerlo al revés. Conserva siempre el orden izquierda-derecha en las consultas.\n\nCon resúmenes de tamaño constante, construir cuesta O(n), almacenar el árbol O(n), y tanto actualizar como buscar por descenso O(log n). Hacer una búsqueda binaria con una consulta por intento costaría O(log² n). Usa un indicador de intervalo vacío cuando no haya un neutro sencillo y evita operar con centinelas que puedan desbordarse."),
    s("Del ejemplo al programa", "El programa siguiente coloca las hojas en un arreglo cuya longitud es una potencia de dos. Las hojas sobrantes tienen capacidad cero. Como los grupos son positivos, esas hojas nunca pueden ser elegidas. Los índices internos empiezan en cero, pero imprimimos posiciones desde uno para reservar la salida cero cuando no existe salón.\n\nLas capacidades y sumas deben caber en el tipo elegido; long long evita problemas al sumar muchos valores grandes. Para revisar la implementación, compara cada grupo con un recorrido directo en arreglos pequeños. Incluye capacidad cero, un único salón, grupos repetidos y un grupo mayor que el máximo. Para el resumen de subarreglos, prueba también valores todos negativos."),
  ], [
    p('salones',"Asignación de salones en orden","Tienes n salones y recibes q grupos. Cada grupo ocupa el primer salón con capacidad libre suficiente; su tamaño se resta de esa capacidad. Imprime la posición del salón, numerada desde uno, o 0 si no cabe en ninguno.\n\nEntrada: n q; después, n capacidades y q tamaños de grupo. Límites: 1≤n,q≤200000, capacidades entre 0 y 10⁹ y grupos entre 1 y 10⁹. Escribe una respuesta por línea.", ["¿Qué dato basta para asegurar que ningún salón de un intervalo tiene espacio?", "Compara primero con el máximo de la raíz. Si hay respuesta, intenta siempre la mitad izquierda antes de pasar a la derecha."], "Guarda en cada nodo la mayor capacidad de su intervalo. Si el máximo de la raíz es menor que el grupo, imprime cero. Si alcanza, baja al hijo izquierdo cuando su máximo sea suficiente; de lo contrario, baja al derecho. Esa elección conserva la respuesta de menor índice.\n\nEn la hoja elegida resta el tamaño del grupo y recalcula los máximos de sus ancestros. No cambia ningún intervalo que quede fuera de ese camino. Construyes el árbol en O(n) y resuelves cada llegada en O(log n), con O(n) memoria.", String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    int z = 1;
    while (z < n)
        z *= 2;
    vector<long long> t(2 * z);
    for (int i = 0; i < n; i++)
        cin >> t[z + i];
    for (int i = z - 1; i; i--)
        t[i] = max(t[2 * i], t[2 * i + 1]);
    while (q--) {
        long long x;
        cin >> x;
        if (t[1] < x) {
            cout << 0 << '\n';
            continue;
        }
        int v = 1;
        while (v < z)
            v = t[v * 2] >= x ? v * 2 : v * 2 + 1;
        cout << v - z + 1 << '\n';
        t[v] -= x;
        for (v /= 2; v; v /= 2)
            t[v] = max(t[v * 2], t[v * 2 + 1]);
    }
}`, [{input:'4 3\n2 7 1 5\n4 3 6\n',output:'2\n2\n0\n'}, {input:'1 3\n5\n2 3 1\n',output:'1\n1\n0\n'}, {input:'3 3\n0 0 4\n1 3 1\n',output:'3\n3\n0\n'}]),
    r('maximo-bloque',"Combinar dos bloques con números negativos","Para [-4,2,-1,3,-5], calcula el total T, el mejor prefijo P, el mejor sufijo S y el mejor bloque contiguo B. No puedes elegir un bloque vacío. Divide el arreglo después de −1 y explica cuál de las dos mitades, o qué cruce entre ellas, produce B. ¿Qué cambiaría incorrectamente si una hoja negativa empezara con B=0?", ["Calcula primero los cuatro datos de [-4,2,-1] y de [3,-5].", "Un bloque que cruza el corte tiene que usar un sufijo de la izquierda y un prefijo de la derecha."], "La parte [-4,2,-1] tiene (T,P,S,B)=(-3,-2,1,2). La parte [3,-5] tiene (-2,3,-2,3). Al combinar, T=-5; P=max(-2,-3+3)=0; S=max(-2,-2+1)=-1; B=max(2,3,1+3)=4.\n\nLa mejor suma viene del cruce [2,-1,3]. Poner B=0 en una hoja negativa permitiría elegir un bloque vacío aunque el enunciado lo prohíbe. Por ejemplo, en [-5,-2] devolvería cero cuando la respuesta correcta es −2."),
  ]),

  'usaco-plat-rurq': chapter(90, [
    s("Sumar a varias posiciones y preguntar por su suma", "Partimos de [2,5,1,3] y queremos agregar cuatro a las posiciones 2 y 3. El arreglo debe quedar [2,9,5,3]. Con un Fenwick de actualizaciones puntuales podemos cambiar ambas posiciones, pero una operación podría afectar casi todo el arreglo. Hacerlo posición por posición costaría O(n log n).\n\nBuscamos que el trabajo dependa de los extremos del intervalo, no de su longitud. Para sumas, las diferencias permiten construir una solución con dos Fenwick. Un árbol de segmentos con modificaciones pendientes resuelve el mismo problema y admite otras operaciones. Aquí los índices empiezan en uno y [l,r] incluye ambos extremos."),
    s("Dos marcas bastan para describir un incremento", "Define D[1]=A[1] y D[i]=A[i]−A[i−1] para i>1. Sumando D[1] hasta D[i] recuperas A[i], porque las diferencias intermedias se cancelan. Nuestro arreglo [2,5,1,3] produce D=[2,3,-4,2].\n\nAl sumar cuatro en [2,3], solo cambia la diferencia donde empieza el aumento y donde termina: D[2]+=4 y D[4]−=4. Queda [2,7,-4,-2], cuyos prefijos reconstruyen [2,9,5,3]. En general, agregar x a [l,r] modifica D[l]+=x y D[r+1]−=x, si r<n. Ya podemos actualizar un rango y consultar un punto; falta obtener sumas de rangos."),
    s("Contar cuántas veces aparece cada diferencia", "Queremos S(p)=A[1]+…+A[p]. Sustituye cada valor por su suma de diferencias. D[j] aparece en A[j], A[j+1] y hasta A[p]: participa p−j+1 veces. Por tanto, S(p)=Σ(j≤p)(p−j+1)D[j]=p·ΣD[j]−Σ(j−1)D[j].\n\nUn Fenwick B1 guarda D[j] y otro B2 guarda (j−1)D[j]. Para cambiar una diferencia en delta, agrega delta a B1 y delta·(j−1) a B2. La consulta de prefijo es p·B1.sum(p)−B2.sum(p). Finalmente, la suma de [l,r] es S(r)−S(l−1). Los dos árboles representan los dos términos de la identidad."),
    s("Seguir los signos con cinco ceros", "Parte de [0,0,0,0,0] y agrega tres en [2,4]. En B1 añadimos +3 en 2 y −3 en 5. En B2 añadimos +3 en 2 y −12 en 5, porque multiplicamos por j−1. Hasta p=4, los prefijos de ambos árboles valen tres: S(4)=4·3−3=9.\n\nHasta p=5, B1 suma cero y B2 suma −9: S(5)=0−(−9)=9. Ahora resta uno en [3,5]. Queda [0,3,2,2,-1] y el intervalo [2,5] suma seis. No guardamos la cancelación en D[6], porque está fuera del dominio. Los incrementos negativos son válidos: aquí sumamos valores, no buscamos objetos por frecuencia."),
    s("Guardar cambios pendientes en un árbol", "En el árbol de segmentos, cada nodo guarda suma y un incremento pendiente. Si un intervalo completo de longitud len recibe +x, su nueva suma es suma+x·len. Acumula también x en la pendiente. La respuesta del nodo ya es correcta; lo pendiente es repartir el cambio a sus descendientes.\n\nCuando una operación necesita bajar, aplica esa pendiente a ambos hijos y bórrala del padre. Para actualizar: ignora intervalos disjuntos; aplica directamente cuando la cobertura sea total; en los demás casos, reparte, visita hijos y suma sus resultados. Una consulta parcial también necesita repartir antes de leer hijos que todavía contienen información anterior."),
    s("Asignar no es lo mismo que sumar", "Supón que también podemos poner todos los valores de un intervalo en v. Una etiqueta que solo acumula incrementos ya no describe todos los cambios. Puedes guardar tieneAsignacion, valorAsignado y sumaPendiente. Una asignación nueva reemplaza cualquier operación anterior. Una suma posterior aumenta el valor asignado, si existe, o se acumula como incremento en otro caso.\n\nCon [1,2,3], asignar cuatro a todo y sumar dos al último deja [4,4,6], suma catorce. Invertir esas operaciones deja [4,4,4], suma doce. Antes de programar la composición de etiquetas, aplica ambas secuencias a un solo número: debe producir el mismo resultado que tu etiqueta combinada."),
    s("La propiedad que mantiene cada estructura", "En la solución con diferencias, cada operación cambia exactamente los dos límites que reconstruyen el aumento pedido. Los Fenwick mantienen los prefijos de esos cambios y la identidad de S(p) convierte sus respuestas en sumas del arreglo. Restar dos prefijos elimina precisamente lo que queda antes de l.\n\nEn el árbol diferido, suma[v] siempre representa la suma actual de su intervalo, aunque sus hijos tengan cambios pendientes. Aplicar un aumento mantiene esa propiedad al multiplicarlo por la longitud. Repartir lo transmite sin modificar el total. Recombinar vuelve a sumar dos partes disjuntas. Olvidar el reparto rompe esa propiedad cuando una consulta entra solo en parte del intervalo."),
    s("Límites e implementación", "Ambas estructuras usan O(n) memoria y O(log n) por operación. Dos Fenwick requieren menos casos de implementación para este problema; el árbol diferido permite otros resúmenes y etiquetas si puedes definir cómo se aplican y componen. No sustituyas suma por mínimo en las fórmulas de Fenwick: su derivación utiliza restas y distribución.\n\nUsa long long para los productos y resultados. Con 200000 posiciones, 200000 operaciones y aumentos de hasta 10⁶, el total puede acercarse a 4·10¹⁶. El programa empieza en ceros; para un arreglo inicial puedes cargar sus diferencias. Revisa intervalos de una posición, ambos extremos del arreglo, aumentos negativos y consultas sin actualizaciones previas."),
  ], [
    p('suma-rangos',"Sumar y consultar intervalos","Un arreglo de n posiciones empieza en cero. Procesa q operaciones: «1 l r x» suma x a cada posición de [l,r], y «2 l r» pide la suma de ese intervalo. Los índices empiezan en uno y ambos extremos están incluidos.\n\nEntrada: n q, seguidos de las operaciones. Límites: 1≤n,q≤200000, 1≤l≤r≤n, |x|≤10⁶. Imprime una línea por consulta.", ["Escribe el arreglo de diferencias y observa qué cambia al agregar x a un intervalo.", "En el prefijo hasta p, la diferencia D[j] aparece p−j+1 veces. Separa ese coeficiente en p−(j−1)."], "Cada actualización modifica D[l] en x y D[r+1] en −x, salvo cuando r=n. Guarda D[j] en un Fenwick y (j−1)D[j] en otro. Sus prefijos dan S(p)=p·sum(D)−sum((j−1)D[j]).\n\nResponde [l,r] con S(r)−S(l−1). La resta cancela todos los valores anteriores a l; los cambios fuera del arreglo nunca se guardan. Cada operación realiza una cantidad constante de operaciones Fenwick: O(log n) tiempo y O(n) memoria.", String.raw`#include <iostream>
#include <vector>
using namespace std;
struct BIT {
    int n;
    vector<long long> t;
    BIT(int n) : n(n), t(n + 1) {}
    void add(int p, long long x) {
        for (; p <= n; p += p & -p)
            t[p] += x;
    }
    long long sum(int p) {
        long long z = 0;
        for (; p; p -= p & -p)
            z += t[p];
        return z;
    }
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    BIT b(n), c(n);
    auto change = [&](int p, long long x) {
        if (p <= n) {
            b.add(p, x);
            c.add(p, x * (p - 1));
        }
    };
    auto pref = [&](int p) { return p * b.sum(p) - c.sum(p); };
    while (q--) {
        int type, l, r;
        cin >> type >> l >> r;
        if (type == 1) {
            long long x;
            cin >> x;
            change(l, x);
            change(r + 1, -x);
        } else
            cout << pref(r) - pref(l - 1) << '\n';
    }
}`, [{input:'5 4\n1 2 4 3\n2 1 4\n1 3 5 -1\n2 2 5\n',output:'9\n6\n'}, {input:'1 3\n2 1 1\n1 1 1 -8\n2 1 1\n',output:'0\n-8\n'}, {input:'3 4\n1 1 3 5\n1 2 2 7\n2 1 3\n2 2 2\n',output:'22\n12\n'}]),
    r('etiquetas',"Cuatro cambios sobre el mismo nodo","Un nodo representa cuatro valores y tiene pendiente asignarlos a cinco. Después llegan estas operaciones sobre todo su intervalo: sumar tres, asignar −2 y sumar siete. Calcula la suma final y una sola etiqueta que permita transmitir el resultado a los hijos.", ["Sigue un único valor: todos reciben las mismas operaciones.", "Al llegar una asignación, deja de importar lo que ocurrió antes."], "La primera asignación y la suma dejan cada valor en ocho. Asignar −2 reemplaza ese ocho, y sumar siete deja cinco. Como hay cuatro valores, la suma es veinte.\n\nPuedes transmitir una sola asignación a cinco. Una etiqueta de suma no serviría: el resultado ya no depende de los valores iniciales, y una suma conservaría esa dependencia."),
  ]),

  'usaco-plat-sparse-segtree': chapter(80, [
    s("Contadores muy separados", "Tienes contadores en las posiciones de 0 a 10¹²−1. Empiezan en cero y solo habrá 5000 cambios, aunque las consultas puedan abarcar cualquier intervalo. Reservar un arreglo para todas las posiciones no cabe en memoria. Lo que sí podemos guardar son las partes del dominio que llegan a cambiar.\n\nUn árbol de segmentos disperso divide el dominio igual que uno ordinario, pero crea nodos conforme los necesita. Para verlo, usaremos U=16 y el intervalo [0,16): sus hijos son [0,8) y [8,16). Repetir estas divisiones lleva hasta intervalos de una posición. Incluso con U=10¹², la altura ronda cuarenta."),
    s("Un intervalo sin cambios no necesita un nodo", "Como todos los contadores empiezan en cero, un hijo que no existe representa una suma conocida: cero. Una consulta puede devolverla sin construir ese hijo. La raíz también puede empezar ausente.\n\nCada nodo creado guarda suma e índices de sus hijos. Podemos usar −1 para indicar ausencia y un vector para almacenar los demás. El índice dentro del vector identifica el nodo, pero no es una coordenada del problema. Por ejemplo, nodos[12] podría representar [500000,1000000). La recursión lleva sus límites como parámetros y usa los índices únicamente para localizar la información almacenada."),
    s("Crear solo el camino que cambia", "Para agregar cinco en la posición 13, visitamos [0,16), [8,16), [12,16), [12,14) y [13,14). Creamos los nodos ausentes de ese camino. En la hoja sumamos cinco; al regresar, cada padre suma sus hijos, tomando cero para los que no existen.\n\nEn general, divide [L,R) en m=L+(R−L)/2. Si x<m, actualiza el hijo izquierdo; en caso contrario, el derecho. Una actualización posterior en 12 comparte el camino hasta [12,14) y solo necesita una hoja distinta. Los caminos compartidos explican por qué el número real de nodos puede ser menor que cambios por altura."),
    s("Consultar un intervalo", "Una consulta [a,b) devuelve cero si el nodo no existe o si su intervalo no intersecta la consulta. Si [L,R) está completamente dentro de [a,b), devuelve la suma guardada. Si solo se superponen en parte, consulta ambos hijos y suma sus respuestas. Ninguno de esos casos crea nodos.\n\nCon cinco en 13 y dos en 3, la suma total es siete. [12,16) devuelve cinco; [4,8), cero; [3,14), siete. Un intervalo vacío [a,a) no contiene posiciones y también devuelve cero. Los límites semiabiertos permiten expresar todos esos casos sin corregir los extremos a mano."),
    s("Por qué las sumas siguen representando el arreglo", "La propiedad que mantenemos es que cada nodo guarda la suma real de su intervalo. Un nodo ausente también la cumple: representa cero porque ningún cambio lo ha necesitado. Una actualización modifica la hoja correcta y recalcula sus ancestros sumando dos intervalos disjuntos que cubren exactamente el intervalo del padre.\n\nPara consultar, la disjunción aporta cero y la cobertura completa usa una suma que ya sabemos correcta. En la intersección parcial, las llamadas a los hijos cuentan partes separadas del intervalo pedido. No falta ninguna posición ni se cuenta dos veces. La división termina porque cada llamada trabaja con un intervalo más pequeño."),
    s("Índices estables dentro de un vector", "Una llamada recursiva puede agregar nodos con push_back. Si el vector se queda sin capacidad, mueve sus elementos a otra zona de memoria e invalida las referencias anteriores. Por eso pasar nodos[v].izquierdo por referencia a una función que puede agregar nodos resulta peligroso.\n\nHaz que actualizar devuelva el índice del hijo actualizado. Guarda primero el índice antiguo en una variable, llama a la función y asigna el resultado volviendo a acceder a nodos[v]. El índice v sigue identificando el mismo elemento aunque cambie la dirección del vector. Reservar memoria puede reducir realocaciones, pero no corrige una referencia que deja de ser válida."),
    s("Si conoces las posiciones de antemano", "Otra solución consiste en ordenar todas las posiciones que podrán cambiar, quitar repeticiones y usar sus índices en un árbol ordinario. Para [a,b), lower_bound(a) y lower_bound(b) delimitan exactamente los puntos relevantes. Como las posiciones omitidas siempre valen cero, no cambian la respuesta. Esta compresión suele necesitar O(q) memoria.\n\nEl árbol disperso permite recibir posiciones nuevas sin preparar esa lista y tiene una cota de O(q log U) nodos. Ninguna de las dos representaciones debe confundir orden con distancia: las coordenadas 2 y 100 pueden quedar juntas en la lista comprimida, pero siguen separadas por 98 unidades."),
    s("Tiempo, memoria y cambios de rango", "Actualizar una posición y consultar un intervalo cuesta O(log U). Una consulta solo mantiene dos fronteras parcialmente cubiertas por nivel; los demás nodos visitados aportan su suma completa. Con q actualizaciones se crean como máximo O(q log U) nodos. Las consultas no aumentan ese consumo. Usa long long para coordenadas y sumas y calcula el punto medio mediante L+(R−L)/2.\n\nSi agregas modificaciones de rango con etiquetas pendientes, debes definir qué hereda un hijo que se crea después del cambio. Ya no puedes interpretar todo hijo ausente como cero. Para la versión puntual, revisa posiciones 0 y U−1, incrementos negativos y consultas donde no haya ocurrido ningún cambio."),
  ], [
    p('universo',"Sumas en un dominio enorme","Hay un contador inicialmente cero en cada posición entera de [0,U). Procesa «1 x d» para agregar d a la posición x y «2 l r» para imprimir la suma de [l,r). El extremo derecho queda excluido y se permiten intervalos vacíos.\n\nEntrada: U q y después q operaciones. Límites: 1≤U≤10¹², 1≤q≤5000 y |d|≤10⁶. Todas las coordenadas son válidas. Imprime una respuesta por consulta.", ["¿Qué suma representa una parte del dominio donde nunca ocurrió un cambio?", "Devuelve el índice del nodo actualizado. Así no mantienes referencias al vector mientras una llamada recursiva agrega elementos."], "Representa los intervalos sin cambios mediante un índice nulo que aporta cero. Una actualización crea únicamente los nodos de su camino y recalcula cada suma a partir de los hijos. La consulta usa los casos de disjunción, cobertura completa e intersección parcial sin crear nodos.\n\nLa división del dominio produce O(log U) niveles. Cada operación cuesta O(log U) y q actualizaciones crean como máximo O(q log U) nodos. Si varias posiciones comparten parte del camino, reutilizan esos nodos.", String.raw`#include <iostream>
#include <vector>
using namespace std;
struct Node {
    int a = -1, b = -1;
    long long sum = 0;
};
vector<Node> t;
long long value(int v) { return v < 0 ? 0 : t[v].sum; }
int add(int v, long long L, long long R, long long x, long long d) {
    if (v < 0) {
        v = t.size();
        t.push_back({});
    }
    if (R - L == 1) {
        t[v].sum += d;
        return v;
    }
    long long M = L + (R - L) / 2;
    if (x < M) {
        int child = add(t[v].a, L, M, x, d);
        t[v].a = child;
    } else {
        int child = add(t[v].b, M, R, x, d);
        t[v].b = child;
    }
    t[v].sum = value(t[v].a) + value(t[v].b);
    return v;
}
long long query(int v, long long L, long long R, long long l, long long r) {
    if (v < 0 || R <= l || r <= L)
        return 0;
    if (l <= L && R <= r)
        return t[v].sum;
    long long M = L + (R - L) / 2;
    return query(t[v].a, L, M, l, r) + query(t[v].b, M, R, l, r);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    long long U;
    int q;
    cin >> U >> q;
    int root = -1;
    while (q--) {
        int k;
        long long x, y;
        cin >> k >> x >> y;
        if (k == 1)
            root = add(root, 0, U, x, y);
        else
            cout << query(root, 0, U, x, y) << '\n';
    }
}`, [{input:'16 5\n1 13 5\n1 3 2\n2 12 16\n2 4 8\n2 3 14\n',output:'5\n0\n7\n'}, {input:'1 4\n2 0 1\n1 0 -3\n2 0 1\n2 0 0\n',output:'0\n-3\n0\n'}, {input:'1000000000000 4\n1 999999999999 9\n1 0 4\n2 1 1000000000000\n2 0 1000000000000\n',output:'9\n13\n'}]),
    r('elige-estructura',"Comprimir puntos no comprime distancias","Las únicas posiciones que recibirán modificaciones son 10, 10⁹ y 10¹²; todas empiezan en cero. Prepara una compresión para consultar sumas puntuales y traduce el intervalo [11,10¹²+1). Explica también qué información falta si quisieras medir su longitud real.", ["Los puntos que nunca cambian aportan cero, así que no necesitas reservarles una posición.", "Usa lower_bound en ambos extremos; compara después la cantidad de índices con la distancia entre coordenadas."], "La lista ordenada es C=[10,10⁹,10¹²], con índices 0,1,2. lower_bound(11) devuelve 1 y lower_bound(10¹²+1) devuelve 3. Consultamos [1,3), que contiene los dos puntos actualizables dentro del intervalo original.\n\nEso responde sumas, porque los demás contadores valen cero. No mide la longitud: el intervalo original tiene longitud 10¹²−10, no dos. Para longitudes debemos conservar las distancias entre coordenadas."),
  ]),

  'usaco-plat-2drq': chapter(85, [
    s("La suma de una parte de la tabla", "Tenemos una matriz con filas [1,2,3], [4,5,6] y [7,8,9]. Queremos sumar el bloque inferior derecho: 5+6+8+9=28. Recorrer sus celdas funciona, pero hacerlo para muchos rectángulos puede repetir casi toda la tabla en cada consulta.\n\nDefinimos P(x,y) como la suma desde la esquina superior izquierda hasta la fila x y la columna y, incluidas. Numeramos desde uno y reservamos P(0,y)=P(x,0)=0. Con esos prefijos podemos recortar cualquier rectángulo, incluso cuando toca la primera fila o la primera columna."),
    s("Recortar con cuatro prefijos", "P(x2,y2) incluye el rectángulo pedido y también las filas anteriores a x1 y las columnas anteriores a y1. Quitamos las primeras con P(x1−1,y2) y las segundas con P(x2,y1−1). La esquina común se quitó dos veces, así que la reponemos con P(x1−1,y1−1).\n\nLa respuesta es P(x2,y2)−P(x1−1,y2)−P(x2,y1−1)+P(x1−1,y1−1). En el ejemplo obtenemos 45−6−12+1=28. Una celda interior participa una vez; una celda en las franjas se cancela; en la esquina, su coeficiente es 1−1−1+1=0. La misma cuenta sirve con valores negativos."),
    s("Preparar prefijos cuando no hay cambios", "Cada prefijo se construye con P(x,y)=A[x][y]+P(x−1,y)+P(x,y−1)−P(x−1,y−1). Sumamos la celda actual, la parte de arriba y la parte de la izquierda, y corregimos su esquina compartida. Si recorremos por filas, esos tres resultados ya están calculados.\n\nPreparar y guardar toda la tabla cuesta O(nm); cada consulta posterior usa cuatro lecturas y cuesta O(1). El inconveniente aparece al modificar una celda: muchos prefijos la contienen. Si cambiamos el centro de cinco a quince, el bloque del ejemplo pasa de 28 a 38, pero habría que corregir varios prefijos almacenados."),
    s("Fenwick en las dos direcciones", "Para admitir cambios puntuales, usamos dos recorridos Fenwick anidados. lowbit(i)=i&−i da la longitud del bloque que termina en i. T[i][j] representa filas desde i−lowbit(i)+1 hasta i y columnas desde j−lowbit(j)+1 hasta j.\n\nAl agregar delta en (x,y), recorre i=x,x+lowbit(x),… hasta n. Para cada i, inicia de nuevo j=y y avanza con j+=lowbit(j) hasta m, sumando delta a T[i][j]. Es importante reiniciar j: cada bloque de filas necesita recorrer todos los bloques de columnas que contienen la celda."),
    s("Consultar y modificar sin reconstruir la tabla", "Para obtener P(x,y), recorre i hacia cero restando lowbit(i). Por cada i, vuelve a j=y y recórrelo restando lowbit(j). Suma las celdas T[i][j] visitadas y usa cuatro de estos prefijos para contestar un rectángulo.\n\nEn una tabla 3×3 inicialmente cero, agrega cinco en (2,2), tres en (1,3) y −2 en (3,1). El total es seis. [1,2]×[2,3] suma ocho; [2,3]×[1,2] suma tres. Si agregas cuatro al centro, ambas respuestas aumentan cuatro y quedan doce y siete. Solo cambias los bloques que contienen (2,2)."),
    s("Por qué las dos dimensiones no cuentan de más", "En una dimensión, restar lowbit separa un prefijo en bloques que no se superponen. Las posiciones restantes forman otro prefijo más corto, hasta llegar a cero. Hacerlo en filas y en columnas produce pares de bloques: cada celda pertenece exactamente a uno de sus rectángulos. Por eso la consulta cuenta cada valor una vez.\n\nAl actualizar, sumar lowbit enumera los bloques que contienen la posición modificada. Sus combinaciones en ambas dimensiones enumeran precisamente los resúmenes que deben recibir delta. Así se conserva el significado de T. La fórmula de cuatro prefijos convierte esas consultas correctas en una suma rectangular correcta."),
    s("Una matriz rápida también puede ser demasiado grande", "Cada operación Fenwick cuesta O(log n·log m), pero la tabla ocupa O(nm) memoria. Con cien mil filas y cien mil columnas ese producto es demasiado grande. Comprimir x e y por separado no siempre lo resuelve: q puntos podrían seguir produciendo q² combinaciones de índices.\n\nSi conoces las actualizaciones, prepara para cada nodo del Fenwick exterior solo las coordenadas y que lo utilizarán. Ordena esas listas y construye un Fenwick interno por lista. Cada punto entra en O(log q) listas: la memoria queda en O(q log q) y las operaciones en O(log²q). Para datos estáticos, un barrido puede ser más sencillo."),
    s("Convenciones que debe respetar el código", "Fenwick recibe incrementos, no asignaciones. Para cambiar una celda de anteriorValor a nuevoValor, envía nuevoValor−anteriorValor. El ejercicio siguiente pide incrementos explícitos. Los índices empiezan en uno: iniciar una actualización en cero produciría un ciclo, porque lowbit(0)=0 y la posición nunca avanzaría.\n\nRevisa una matriz 1×1, consultas de una celda, rectángulos pegados a los bordes e incrementos negativos. Usa long long para las sumas: una celda puede caber en int aunque la tabla completa no. Si los datos nunca cambian, los prefijos estáticos ya responden en O(1) y no necesitan el trabajo adicional de Fenwick."),
  ], [
    p('huerto',"Incrementos en una tabla de riego","Una tabla de n filas y m columnas empieza en cero. Cada operación «1 x y d» agrega d a una celda. Cada operación «2 x1 y1 x2 y2» pide la suma de ese rectángulo, con los dos extremos incluidos e índices desde uno.\n\nEntrada: n m q y después q operaciones. Límites: 1≤n,m≤500, 1≤q≤20000, |d|≤10⁶. Las posiciones son válidas. Imprime una línea por consulta.", ["Combina un recorrido Fenwick sobre filas con otro sobre columnas. Reinicia el recorrido interior en cada fila visitada.", "Obtén el rectángulo restando la franja superior y la izquierda de un prefijo; repón la esquina común."], "Cada celda de Fenwick guarda la suma de un bloque de filas combinado con un bloque de columnas. Al actualizar, agregamos d a todos los bloques que contienen la celda. Al consultar un prefijo, los recorridos descendentes forman una partición sin superposiciones.\n\nCuatro prefijos reconstruyen la suma pedida. Cada operación cuesta O(log n·log m), así que q operaciones cuestan O(q log n log m). La tabla ocupa O(nm) memoria.", String.raw`#include <iostream>
#include <vector>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, m, q;
    cin >> n >> m >> q;
    vector<vector<long long>> t(n + 1, vector<long long>(m + 1));
    auto add = [&](int x, int y, long long d) {
        for (int i = x; i <= n; i += i & -i)
            for (int j = y; j <= m; j += j & -j)
                t[i][j] += d;
    };
    auto pref = [&](int x, int y) {
        long long z = 0;
        for (int i = x; i; i -= i & -i)
            for (int j = y; j; j -= j & -j)
                z += t[i][j];
        return z;
    };
    while (q--) {
        int type;
        cin >> type;
        if (type == 1) {
            int x, y;
            long long d;
            cin >> x >> y >> d;
            add(x, y, d);
        } else {
            int a, b, c, d;
            cin >> a >> b >> c >> d;
            cout << pref(c, d) - pref(a - 1, d) - pref(c, b - 1) + pref(a - 1, b - 1)
                 << '\n';
        }
    }
}`, [{input:'3 3 6\n1 2 2 5\n1 1 3 3\n1 3 1 -2\n2 1 1 3 3\n2 1 2 2 3\n2 2 1 3 2\n',output:'6\n8\n3\n'}, {input:'1 1 3\n2 1 1 1 1\n1 1 1 -7\n2 1 1 1 1\n',output:'0\n-7\n'}, {input:'2 3 4\n1 1 1 4\n1 2 3 8\n2 1 2 2 3\n2 1 1 1 1\n',output:'8\n4\n'}]),
    r('cuatro-prefijos',"Una tabla que no cambia","La matriz tiene dos filas: [2,−1,4] y [0,3,5]. Calcula la suma de las columnas 2 y 3 en ambas filas usando cuatro prefijos. Después decide qué estructura usarías si llegan un millón de consultas y ninguna actualización.", ["El prefijo que sobra por la izquierda termina en la columna uno.", "Los prefijos que terminan en fila cero valen cero."], "Los cuatro valores son P(2,3)=13, P(0,3)=0, P(2,1)=2 y P(0,1)=0. Al combinarlos obtenemos 13−0−2+0=11. Coincide con sumar directamente −1+4+3+5.\n\nComo la matriz permanece fija, prepara una tabla de prefijos en O(nm) tiempo y memoria. Cada una del millón de preguntas cuesta O(1). Fenwick serviría, pero sus recorridos logarítmicos no aportarían ninguna operación que necesitemos."),
  ]),
};
