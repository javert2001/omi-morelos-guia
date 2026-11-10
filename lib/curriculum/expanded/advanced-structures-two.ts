import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedStructuresTwoExpansions: Record<string, LessonExpansion> = {
  'usaco-adv-segtree-beats': extend('usaco-adv-segtree-beats',120,[
    s('Construir y combinar los cuatro campos necesarios',`Cada nodo guarda suma, máximo M, segundo máximo estricto S y cantidad c de apariciones de M. Una hoja con valor v guarda suma=v,M=v,c=1 y S=-infinito. Al combinar hijos con el mismo máximo, suma sus cantidades y toma el mayor segundo máximo. Si el máximo izquierdo es mayor, conserva su cantidad y toma S=max(Sizquierdo,Mderecho); el caso contrario es simétrico.

«Estricto» significa el mayor valor diferente de M, no la segunda posición al ordenar. En [8,8,5,2], M=8,S=5,c=2. Si guardases S=8 por la segunda copia, perderías la oportunidad de actualizar juntas las dos apariciones del máximo. El centinela de una hoja nunca debe participar en operaciones aritméticas como si fuera un valor real.`),
    s('Actualización completa y propagación del techo',`Para chmin(l,r,x), ignora nodos disjuntos y nodos con M≤x. Si hay cobertura total y S<x, aplica suma+=(x-M)·c y M=x; solo la clase máxima cambia. De otro modo, desciende. Antes de visitar hijos, si alguno tiene máximo mayor que el del padre, aplícale el techo del padre con la misma operación rápida. Después de actualizar hijos, recombina sus resúmenes.

No necesitas guardar una etiqueta chmin separada: el máximo del padre es el techo que los hijos deben respetar. La condición del caso rápido garantiza que empujar ese techo solo afecta los máximos del hijo. En particular, si x=S, no puedes aplicar la fórmula y conservar c: la clase máxima se fusiona con la segunda y su nueva multiplicidad no está almacenada en c.`),
    s('Una prueba amortizada para esta variante concreta',`Considera como potencial la suma, sobre todos los nodos del árbol, de cuántos valores distintos existen en su segmento. Inicialmente es O(n log n), porque cada elemento contribuye como máximo una vez por nivel. Una actualización parcialmente cubierta solo aparece en O(log n) nodos de frontera; en cada uno puede introducir a lo sumo un valor nuevo, el umbral x, así que aumenta el potencial como máximo O(log n).

Un nodo totalmente cubierto que obliga a descender tiene x≤S<M. Después de la operación, al menos las clases S y M se fusionan o desaparecen por encima de x, reduciendo en al menos uno la cantidad de valores distintos de ese nodo. Esas reducciones pagan los descensos costosos. Por ello, para chmin y sumas, el trabajo total es O((n+q) log n). Agregar sumas o chmax cambia este potencial y exige un análisis nuevo.`),
    s('Correctitud, consultas y verificación diferencial',`La operación rápida es exacta porque todos los elementos distintos del máximo están≤S<x y no cambian. Los c máximos disminuyen exactamente M-x, justificando el ajuste de suma. Cuando no se cumple esa condición, repartir el trabajo a los hijos calcula el efecto real y recombinar restaura los cuatro campos. Una consulta parcial debe empujar antes de leer los hijos; una completa puede devolver directamente la suma del nodo.

Implementa primero una versión lenta que recorra cada posición. Compara secuencias de operaciones pequeñas, especialmente x=M, x=S, todos iguales, valores negativos y actualizaciones de un único elemento. Un error en el segundo máximo puede permanecer oculto varias operaciones antes de alterar una suma. El ejercicio incluye solamente chmin y consultas: una ampliación a chmax y suma requiere también mínimos, segundos mínimos, sus cantidades y reglas de interacción.`),
  ],[
    p('techos','Poner techos a un arreglo','Entrada: n q (1≤n,q≤50000), n valores entre -10⁹ y 10⁹ y q operaciones. «1 l r x» reemplaza cada A[i] por min(A[i],x) en el rango inclusivo, con |x|≤10⁹. «2 l r» pide su suma. Índices desde uno.', ['Guarda el segundo máximo distinto y la cantidad de máximos.', 'Solo actualiza un nodo completo sin bajar cuando x supera estrictamente el segundo máximo.'], 'El caso rápido cambia únicamente la clase de máximos y ajusta su contribución a la suma. Los demás casos se dividen y recombinan. El potencial de clases distintas paga los descensos adicionales para esta variante de chmin sin incrementos, dando O((n+q) log n) total.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
const long long NEG = -4000000000000000000LL;
struct Node {
    long long sum = 0, mx = 0, second = NEG;
    int count = 0;
};
vector<Node> t;
vector<long long> a;
void pull(int v) {
    auto L = t[2 * v], R = t[2 * v + 1];
    t[v].sum = L.sum + R.sum;
    if (L.mx == R.mx) {
        t[v].mx = L.mx;
        t[v].count = L.count + R.count;
        t[v].second = max(L.second, R.second);
    } else if (L.mx > R.mx) {
        t[v].mx = L.mx;
        t[v].count = L.count;
        t[v].second = max(L.second, R.mx);
    } else {
        t[v].mx = R.mx;
        t[v].count = R.count;
        t[v].second = max(R.second, L.mx);
    }
}
void build(int v, int L, int R) {
    if (L == R) {
        t[v] = {a[L], a[L], NEG, 1};
        return;
    }
    int M = (L + R) / 2;
    build(2 * v, L, M);
    build(2 * v + 1, M + 1, R);
    pull(v);
}
void cap(int v, long long x) {
    if (t[v].mx <= x)
        return;
    t[v].sum += (x - t[v].mx) * t[v].count;
    t[v].mx = x;
}
void push(int v) {
    cap(2 * v, t[v].mx);
    cap(2 * v + 1, t[v].mx);
}
void update(int v, int L, int R, int l, int r, long long x) {
    if (r < L || R < l || t[v].mx <= x)
        return;
    if (l <= L && R <= r && t[v].second < x) {
        cap(v, x);
        return;
    }
    push(v);
    int M = (L + R) / 2;
    update(2 * v, L, M, l, r, x);
    update(2 * v + 1, M + 1, R, l, r, x);
    pull(v);
}
long long query(int v, int L, int R, int l, int r) {
    if (r < L || R < l)
        return 0;
    if (l <= L && R <= r)
        return t[v].sum;
    push(v);
    int M = (L + R) / 2;
    return query(2 * v, L, M, l, r) + query(2 * v + 1, M + 1, R, l, r);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    a.resize(n);
    for (auto &x : a)
        cin >> x;
    t.resize(4 * n);
    build(1, 0, n - 1);
    while (q--) {
        int k, l, r;
        cin >> k >> l >> r;
        --l;
        --r;
        if (k == 1) {
            long long x;
            cin >> x;
            update(1, 0, n - 1, l, r, x);
        } else
            cout << query(1, 0, n - 1, l, r) << '\n';
    }
}`, [{input:'4 5\n9 9 4 1\n2 1 4\n1 1 4 6\n2 1 4\n1 1 4 3\n2 1 4\n',output:'23\n17\n10\n'}, {input:'3 3\n5 5 2\n1 1 3 2\n2 1 3\n2 2 2\n',output:'6\n2\n'}, {input:'2 3\n-1 -3\n1 1 2 -2\n2 1 2\n2 1 1\n',output:'-5\n-2\n'}]),
    r('segundo-estricto','El umbral igual al segundo máximo','Un nodo representa [8,8,5,5,2]. Si aplicas chmin con x=5, ¿cuáles son M,S,c y suma después? ¿Qué error produce conservar la cantidad anterior?', ['Los dos ochos se fusionan con los dos cincos.', 'El nuevo segundo máximo estricto es 2.'], 'Antes: M=8,S=5,c=2,suma=28. Después el arreglo es [5,5,5,5,2], así que M=5,S=2,c=4,suma=22. La fórmula de diferencia puede obtener la suma 22, pero conservar c=2 deja el resumen incorrecto: un chmin posterior a 4 restaría solo 2 en lugar de 4. La condición estricta S<x evita ese caso y obliga a descender para reconstruir la multiplicidad.'),
  ]),

  'usaco-adv-persistent': extend('usaco-adv-persistent',100,[
    s('Actualizaciones que devuelven una raíz nueva',`Representa cada nodo mediante índices de sus hijos y su suma. Para asignar una posición desde una versión raíz, crea una copia del nodo actual. Si es hoja, reemplaza su suma. Si no, actualiza recursivamente solamente el hijo cuyo intervalo contiene la posición, guarda en la copia la nueva raíz de ese hijo y conserva el índice del otro. Recalcula la suma de la copia y devuelve su índice.

La regla fundamental es no escribir sobre nodos existentes. Todas las versiones pueden compartirlos y esperan que sigan significando lo mismo. Guarda un vector roots, donde roots[v] identifica la versión v. Una consulta recibe explícitamente qué raíz recorrer; no existe una única raíz global que represente todas las historias.`),
    s('Ejemplo de ramificación y prueba de conservación',`Parte de [2,0,5,1], versión 0. Asignar posición 2 a 7 desde ella crea la versión 1, [2,7,5,1], de suma 15. Asignar posición 1 a 9 desde la versión 0 crea la versión 2, [9,0,5,1], de suma 15 también. Aunque coincidan sus sumas totales, son arreglos distintos: consultar las primeras dos posiciones da 9 en ambas, pero una consulta unitaria las distingue.

La versión anterior permanece correcta porque sus nodos no se modifican. La versión nueva es correcta por inducción: su hijo actualizado representa el cambio solicitado y el otro hijo compartido representa valores que no cambiaron. Sumar ambos reconstruye exactamente el intervalo. Este mecanismo permite ramificar desde cualquier versión, conocido como persistencia completa.`),
    s('Selección por diferencia de versiones de prefijo',`Otra construcción usa como dominio los valores comprimidos, no las posiciones. roots[i] guarda frecuencias de los primeros i elementos. Al insertar A[i] creas una versión incrementando una frecuencia. Para seleccionar en A[l,r), compara roots[r] y roots[l]: la diferencia de sus conteos representa exactamente las apariciones del intervalo.

En cada nivel calcula c=suma(hijoIzquierdoDeR)-suma(hijoIzquierdoDeL). Si k≤c, baja en ambas raíces por la izquierda; en otro caso baja por la derecha con k-c. En una hoja recupera el valor comprimido. La resta funciona porque los resúmenes son conteos aditivos y la versión izquierda es un prefijo contenido en la derecha. No puedes sustituir suma por máximo y restar raíces: el máximo no tiene esa propiedad.`),
    s('Presupuesto de nodos y manejo seguro de memoria',`El árbol inicial completo necesita O(n) nodos. Una asignación copia un nodo por nivel, O(log n), así q versiones consumen O(n+q log n) nodos. Cada consulta sigue un árbol normal y cuesta O(log n). Esta memoria es deliberada: conservar el pasado tiene un costo, y liberar nodos compartidos sin contar referencias rompería otras versiones.

Usa índices enteros estables en un vector. No conserves una referencia a nodos[v] mientras una llamada recursiva pueda hacer push_back y realocar el vector. Copia primero el nodo en una variable local o vuelve a acceder por índice después. Prueba actualizar repetidamente una misma posición, crear versiones desde la raíz inicial y consultar versiones antiguas tras muchos cambios. El ejercicio imprime los nuevos identificadores para que la historia quede explícita.`),
  ],[
    p('versiones','Arreglos con historia','Entrada: n q (1≤n≤50000, 1≤q≤20000), n valores con valor absoluto≤10⁶ y q operaciones. «1 version posicion valor» crea una versión nueva asignando esa posición desde la versión indicada e imprime su identificador. «2 version l r» imprime la suma inclusiva. La versión inicial es 0; las nuevas se numeran 1,2,… y solo se mencionan versiones existentes.', ['Copia solo el camino hasta la posición modificada.', 'Las consultas usan la raíz de la versión solicitada.'], 'Los nodos compartidos son inmutables. Cada actualización crea copias del camino y conserva los subárboles sin cambios, por lo que la versión nueva es correcta y las anteriores permanecen intactas. Tiempo O(log n) por operación; memoria O(n+q log n).', String.raw`#include <iostream>
#include <vector>
using namespace std;
struct Node {
    int a = -1, b = -1;
    long long sum = 0;
};
vector<Node> t;
vector<long long> initial;
int build(int L, int R) {
    int v = t.size();
    t.push_back({});
    if (L == R) {
        t[v].sum = initial[L];
        return v;
    }
    int M = (L + R) / 2, a = build(L, M), b = build(M + 1, R);
    t[v] = {a, b, t[a].sum + t[b].sum};
    return v;
}
int change(int old, int L, int R, int p, long long x) {
    Node copy = t[old];
    int v = t.size();
    t.push_back(copy);
    if (L == R) {
        t[v].sum = x;
        return v;
    }
    int M = (L + R) / 2;
    if (p <= M) {
        int a = change(copy.a, L, M, p, x);
        t[v].a = a;
    } else {
        int b = change(copy.b, M + 1, R, p, x);
        t[v].b = b;
    }
    t[v].sum = t[t[v].a].sum + t[t[v].b].sum;
    return v;
}
long long sum(int v, int L, int R, int l, int r) {
    if (r < L || R < l)
        return 0;
    if (l <= L && R <= r)
        return t[v].sum;
    int M = (L + R) / 2;
    return sum(t[v].a, L, M, l, r) + sum(t[v].b, M + 1, R, l, r);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    initial.resize(n);
    for (auto &x : initial)
        cin >> x;
    vector<int> roots = {build(0, n - 1)};
    while (q--) {
        int type, ver, l;
        long long r;
        cin >> type >> ver >> l >> r;
        if (type == 1) {
            roots.push_back(change(roots[ver], 0, n - 1, l - 1, r));
            cout << roots.size() - 1 << '\n';
        } else
            cout << sum(roots[ver], 0, n - 1, l - 1, (int)r - 1) << '\n';
    }
}`, [{input:'4 5\n2 0 5 1\n1 0 2 7\n2 0 1 4\n2 1 1 4\n1 0 1 9\n2 2 1 2\n',output:'1\n8\n15\n2\n9\n'}, {input:'1 3\n5\n1 0 1 -2\n2 0 1 1\n2 1 1 1\n',output:'1\n5\n-2\n'}, {input:'2 4\n1 2\n1 0 1 3\n1 1 2 4\n2 1 1 2\n2 2 1 2\n',output:'1\n2\n5\n7\n'}]),
    r('restar-maximos','Una operación que no admite diferencias de raíces','Los primeros dos elementos de un arreglo son [10,1] y los primeros cuatro son [10,1,7,3]. Si dos versiones guardan solo máximos, ¿puedes obtener el máximo de las posiciones 3…4 restando sus máximos?', ['Ambos prefijos tienen máximo 10.', 'El intervalo buscado contiene 7 y 3.'], 'Restar máximos daría 10-10=0, mientras el máximo real es 7. La resta de versiones funciona para resúmenes aditivos como frecuencias o sumas, no para cualquier agregado. La persistencia conserva versiones, pero no crea una operación inversa que el resumen no posee. Para un máximo de posiciones dentro de una versión puedes consultar el rango directamente en su árbol.'),
  ]),

  'usaco-adv-treaps': extend('usaco-adv-treaps',115,[
    s('Definiciones exactas de split y merge implícitos',`En un treap implícito cada nodo representa un elemento de la secuencia; el recorrido inorder entrega el orden. Guarda tamaño, suma, hijos y prioridad. split(T,k) devuelve los primeros k elementos y el resto. Si el hijo izquierdo tiene s elementos y k≤s, divide ese hijo y reconecta su parte derecha como nuevo hijo izquierdo de T. Si k>s, divide el hijo derecho con k-s-1 y reconecta su parte izquierda.

merge(A,B) presupone que todos los elementos de A van antes que los de B. Elige como raíz la de mayor prioridad: si es A, combina su hijo derecho con B; si es B, combina A con su hijo izquierdo. Después recalcula tamaño y suma. La operación preserva el orden porque nunca cruza elementos de A detrás de elementos de B.`),
    s('Inversión diferida y operaciones de intervalo',`Para invertir un subárbol, intercambia sus hijos y cambia su bandera rev. No recorres todos sus elementos. Antes de descender por un nodo, push transmite esa inversión a sus hijos y limpia su bandera. Después de cambiar hijos, pull calcula tamaño=1+tamañoIzquierdo+tamañoDerecho y suma=valor+sumaIzquierda+sumaDerecha.

Para actuar sobre [l,r) de la secuencia, divide primero en A de longitud l y resto; divide ese resto en B de longitud r-l y C. Ahora B representa exactamente el intervalo. Puedes invertirlo, consultar su suma o aplicar otra etiqueta compatible. Finalmente reconstruye merge(A,merge(B,C)). Una consulta también debe reconstruir el árbol después de sus particiones: split cambia enlaces aunque solo querías leer un resultado.`),
    s('Correctitud y papel real de la aleatoriedad',`split conserva el orden por inducción: el tamaño izquierdo decide si el corte cae antes o después de la raíz, y la llamada recursiva divide exactamente la parte que contiene la frontera. merge conserva tanto el orden como la propiedad de montículo al elegir la mayor prioridad disponible. La bandera de inversión equivale a invertir el inorder: intercambia las mitades y deja pendiente invertir cada una.

La aleatoriedad se usa para controlar la forma, no para aproximar la respuesta. Con prioridades independientes y distintas, la altura esperada es O(log n); las respuestas son exactas para cualquier forma válida. El peor caso puede ser una cadena y costar O(n). Si el problema exige garantías contra entradas adaptativas que conocen las prioridades, considera una estructura determinista o una fuente aleatoria apropiada.`),
    s('Implementación por índices y una traza de etiquetas',`La secuencia [1,2,3,4,5] se divide para invertir [1,4) en A=[1],B=[2,3,4],C=[5]. Activar rev en B representa [4,3,2] y al unir queda [1,4,3,2,5]. Su suma total sigue siendo 15, porque invertir no cambia una suma; por eso esa etiqueta no necesita modificar el agregado. Si guardaras una composición no conmutativa, necesitarías también su versión inversa.

El ejercicio no inserta ni elimina elementos, pero usa las mismas primitivas que lo permitirían. Los nodos viven en un vector preasignado y se identifican con índices, usando cero como vacío. Un generador determinista de prioridades sirve para reproducir los ejemplos; su costo esperado describe el modelo de prioridades aleatorias, no una garantía absoluta de esa semilla. Prueba invertir dos veces el mismo rango, una sola posición y toda la secuencia.`),
  ],[
    p('secuencia','Invertir y sumar segmentos','Entrada: n q (1≤n,q≤20000), n valores con valor absoluto≤10⁶ y q operaciones. «1 l r» invierte el intervalo inclusivo de posiciones l…r; «2 l r» imprime su suma. Posiciones desde uno.', ['Dos split aíslan el intervalo.', 'La inversión cambia hijos y bandera, pero no la suma.'], 'El treap representa el orden mediante inorder y tamaños. Split aísla exactamente las posiciones pedidas; una inversión diferida cambia su orden sin alterar valores ni suma. Merge reconstruye la secuencia. El tiempo esperado por operación es O(log n), con O(n) memoria.', String.raw`#include <iostream>
#include <vector>
#include <cstdint>
#include <algorithm>
using namespace std;
struct Node {
    int l = 0, r = 0, size = 1;
    long long value = 0, sum = 0;
    uint32_t priority = 0;
    bool rev = false;
};
vector<Node> t;
int size(int v) { return v ? t[v].size : 0; }
long long sum(int v) { return v ? t[v].sum : 0; }
void pull(int v) {
    t[v].size = 1 + size(t[v].l) + size(t[v].r);
    t[v].sum = t[v].value + sum(t[v].l) + sum(t[v].r);
}
void flip(int v) {
    if (v) {
        swap(t[v].l, t[v].r);
        t[v].rev = !t[v].rev;
    }
}
void push(int v) {
    if (t[v].rev) {
        flip(t[v].l);
        flip(t[v].r);
        t[v].rev = false;
    }
}
pair<int, int> split(int v, int k) {
    if (!v)
        return {0, 0};
    push(v);
    if (k <= size(t[v].l)) {
        auto [a, b] = split(t[v].l, k);
        t[v].l = b;
        pull(v);
        return {a, v};
    }
    auto [a, b] = split(t[v].r, k - size(t[v].l) - 1);
    t[v].r = a;
    pull(v);
    return {v, b};
}
int merge(int a, int b) {
    if (!a || !b)
        return a ? a : b;
    if (t[a].priority > t[b].priority) {
        push(a);
        t[a].r = merge(t[a].r, b);
        pull(a);
        return a;
    }
    push(b);
    t[b].l = merge(a, t[b].l);
    pull(b);
    return b;
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    t.resize(n + 1);
    uint32_t seed = 2463534242u;
    int root = 0;
    for (int i = 1; i <= n; i++) {
        cin >> t[i].value;
        t[i].sum = t[i].value;
        seed ^= seed << 13;
        seed ^= seed >> 17;
        seed ^= seed << 5;
        t[i].priority = seed;
        root = merge(root, i);
    }
    while (q--) {
        int k, l, r;
        cin >> k >> l >> r;
        auto [a, rest] = split(root, l - 1);
        auto [b, c] = split(rest, r - l + 1);
        if (k == 1)
            flip(b);
        else
            cout << sum(b) << '\n';
        root = merge(a, merge(b, c));
    }
}`, [{input:'5 4\n1 2 3 4 5\n2 1 5\n1 2 4\n2 1 2\n2 4 5\n',output:'15\n5\n7\n'}, {input:'1 3\n-7\n1 1 1\n2 1 1\n2 1 1\n',output:'-7\n-7\n'}, {input:'3 4\n1 2 3\n1 1 3\n2 1 1\n1 1 3\n2 1 1\n',output:'3\n1\n'}]),
    r('push-pull','Dos omisiones con síntomas distintos','Explica qué puede pasar si split consulta tamaños y baja sin hacer push de una inversión pendiente. Después explica qué falla si merge reconecta hijos pero no hace pull.', ['La bandera representa cambios todavía no distribuidos a descendientes.', 'El tamaño guía futuros cortes y la suma responde consultas.'], 'Sin push, la recursión puede interpretar el orden interno de un hijo antes de aplicar la inversión que le corresponde, y el corte separa elementos equivocados. Sin pull, los enlaces pueden ser correctos pero los tamaños y sumas del nodo quedan obsoletos: las siguientes particiones usan posiciones falsas y las consultas devuelven agregados antiguos. push prepara el significado de los hijos antes de usarlos; pull reconstruye el significado del padre después de cambiarlos.'),
  ]),
};
