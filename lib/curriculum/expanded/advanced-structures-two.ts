import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedStructuresTwoExpansions: Record<string, LessonExpansion> = {
  'usaco-adv-segtree-beats': extend('usaco-adv-segtree-beats',120,[
    s("Guardar qué valores cambiaría un recorte","Cada nodo guarda suma, máximo M, segundo máximo estricto S y cantidad c de apariciones de M. En [8,8,5,2], estos campos son 23, 8, 5 y 2. «Estricto» significa distinto del máximo; guardar la segunda copia de 8 como S perdería información sobre qué otros valores podrían cambiar.\n\nUna hoja guarda suma=v, M=v, c=1 y S=−infinito. Al unir hijos con igual máximo, suma cantidades y toma el mayor segundo máximo. Si gana el máximo izquierdo, conserva su cantidad y calcula S=max(Sizquierdo,Mderecho); el otro caso es simétrico. El centinela no es un valor real que deba entrar en operaciones aritméticas."),
    s("Aplicar un techo solo cuando el resumen basta","Para chmin(l,r,x), ignora nodos disjuntos y aquellos con M≤x. Si un nodo está completamente cubierto y S<x<M, solo sus c máximos cambian: actualiza suma+=(x−M)·c y M=x. En los demás casos desciende y recombina.\n\nAntes de bajar, aplica a cada hijo el techo del padre si su máximo lo supera. El máximo del padre ya guarda esa restricción, sin necesitar otra etiqueta. Si x=S, no uses el caso rápido: los máximos se unen con la segunda clase y c ya no describe su nueva cantidad. Descender permite reconstruir correctamente esa multiplicidad."),
    s("Por qué los descensos adicionales se pueden pagar","Considera como potencial la suma de cantidades de valores distintos en todos los segmentos del árbol. Al inicio es O(n log n), porque cada elemento participa en un nodo por nivel. Una actualización parcial tiene O(log n) nodos de frontera; en cada uno puede introducir a lo sumo el nuevo valor x. Por tanto, aumenta el potencial O(log n).\n\nUn nodo totalmente cubierto que exige descender tiene x≤S<M. Después del recorte, al menos las clases S y M se fusionan o desaparecen por encima de x; sus valores distintos disminuyen. Esa reducción paga los descensos difíciles. Para esta variante de chmin y sumas, el total es O((n+q) log n); añadir incrementos o chmax exige otro análisis."),
    s("Justificar el caso rápido y comprobar las fronteras","Si S<x<M, todos los valores distintos del máximo están≤S y permanecen iguales. Solo c elementos disminuyen M−x, lo que explica el ajuste exacto de la suma. Si la condición no se cumple, resolver en los hijos y combinarlos calcula el mismo efecto. Las consultas parciales también deben empujar el techo antes de leerlos.\n\nCompara secuencias pequeñas contra un arreglo actualizado directamente. Incluye x=M, x=S, todos los valores iguales, negativos y rangos unitarios. Un segundo máximo incorrecto puede no alterar la suma hasta varias operaciones después. El ejercicio no admite chmax ni incrementos: agregarlos requiere campos y reglas de interacción adicionales, no solo otra rama en el código."),
  ],[
    p('techos',"Recortar valores y consultar sumas","Lee n q (1≤n,q≤50000), n valores entre −10⁹ y 10⁹ y q operaciones. «1 l r x» reemplaza cada A[i] por min(A[i],x) en el intervalo inclusivo [l,r], con |x|≤10⁹. «2 l r» pide su suma. Los índices empiezan en 1.", ["Guarda máximo, segundo máximo distinto y cantidad de máximos, además de la suma.", "Solo recorta un nodo completo sin bajar si el umbral está estrictamente por encima del segundo máximo."], "Cuando el umbral solo afecta a la clase máxima, ajusta su contribución mediante (x−M)·c. Si afecta otras clases o coincide con el segundo máximo, desciende, propaga los techos pendientes y recombina. El potencial de valores distintos paga los descensos adicionales, con O((n+q) log n) total para esta variante sin incrementos.", String.raw`#include <iostream>
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
    r('segundo-estricto',"Un umbral que fusiona dos clases","Un nodo representa [8,8,5,5,2]. Aplica chmin con x=5 y calcula su máximo M, segundo máximo estricto S, cantidad c y suma. ¿Por qué sería incorrecto conservar la cantidad anterior?", ["Las dos apariciones de 8 pasan a formar la misma clase que los dos valores 5.", "Después del cambio, el segundo máximo distinto es 2."], "Antes tienes M=8, S=5, c=2 y suma=28. Después queda [5,5,5,5,2]: M=5, S=2, c=4 y suma=22. La fórmula de disminución obtiene esa suma, pero conservar c=2 deja un resumen incorrecto. Un recorte posterior a 4 restaría 2 cuando debe restar 4. La condición estricta S<x evita esa fusión sin conocer su multiplicidad."),
  ]),

  'usaco-adv-persistent': extend('usaco-adv-persistent',100,[
    s("Crear una raíz sin modificar la versión anterior","Cada nodo guarda índices de hijos y suma. Para asignar una posición desde una raíz, copia el nodo actual. En una hoja cambia la suma; en un nodo interno actualiza recursivamente solo el hijo que contiene la posición y guarda en la copia el índice que devuelve. El otro hijo se comparte. Recalcula la suma y devuelve el índice del nodo nuevo.\n\nLos nodos existentes son inmutables porque varias versiones pueden apuntar a ellos. Guarda roots[v] para identificar la raíz de cada versión. Cada consulta recibe la versión que debe leer; no hay una única raíz global que describa todas las historias."),
    s("Ramificar dos cambios desde la misma versión","La versión 0 es [2,0,5,1]. Cambiar su posición 2 a 7 crea la versión 1, [2,7,5,1]. Cambiar la posición 1 a 9 desde la versión 0 crea la versión 2, [9,0,5,1]. Ambas nuevas suman 15, pero una consulta de la primera posición distingue sus valores 2 y 9.\n\nLa versión vieja sigue correcta porque sus nodos no cambian. La nueva también: por inducción, el hijo copiado contiene el cambio solicitado y el compartido conserva lo que no cambió; su suma reconstruye el intervalo. Poder actualizar desde cualquier versión se conoce como persistencia completa."),
    s("Restar versiones cuando representan prefijos","Otra aplicación usa como dominio los valores comprimidos. roots[i] guarda las frecuencias de los primeros i elementos. La diferencia entre roots[r] y roots[l] representa las apariciones de A[l,r), porque el segundo prefijo está contenido en el primero.\n\nPara seleccionar el k-ésimo, calcula c como conteo izquierdo de roots[r] menos el de roots[l]. Si k≤c, baja en ambas raíces a la izquierda; si no, baja a la derecha con k−c. Una hoja identifica el valor. Esta resta funciona para conteos aditivos; no puedes reemplazarlos por máximos y esperar que restar raíces conserve el significado."),
    s("Presupuestar nodos y usar índices estables","Construir el árbol inicial cuesta O(n) nodos. Cada asignación copia un camino de O(log n), de modo que q cambios ocupan O(n+q log n). Consultar cuesta O(log n), como en un árbol normal. Conservar versiones requiere esa memoria; liberar un nodo compartido sin controlar quién lo usa rompería otras raíces.\n\nUtiliza índices en el vector de nodos. No guardes referencias a sus elementos durante una llamada que pueda hacer push_back y realocarlo: copia el nodo antes o vuelve a acceder por índice. Prueba cambios repetidos de una posición, ramas desde la versión inicial y consultas a versiones antiguas después de muchos cambios."),
  ],[
    p('versiones',"Consultar arreglos de distintas versiones","Lee n q (1≤n≤50000, 1≤q≤20000), n valores de valor absoluto≤10⁶ y q operaciones. «1 version posicion valor» crea una versión con esa asignación e imprime su identificador. «2 version l r» imprime la suma inclusiva. La versión inicial es 0 y las nuevas se numeran 1,2,…; solo se mencionan versiones existentes.", ["Cada cambio copia únicamente el camino desde la raíz hasta su posición.", "Comienza cada consulta desde la raíz de la versión solicitada."], "Comparte los subárboles que no cambian y crea copias de los nodos del camino actualizado. Como nunca modificas un nodo anterior, las raíces viejas siguen representando sus arreglos. La raíz nueva combina el hijo cambiado con el intacto y da la versión solicitada. Cada operación cuesta O(log n) y la memoria total es O(n+q log n).", String.raw`#include <iostream>
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
    r('restar-maximos',"Una diferencia de máximos no recupera un intervalo","Un prefijo de dos elementos es [10,1] y uno de cuatro es [10,1,7,3]. Si sus versiones guardan solo máximos, ¿puedes obtener el máximo de las posiciones 3…4 restando los máximos de ambos prefijos?", ['Ambos prefijos tienen máximo 10.', "El intervalo que interesa contiene los valores 7 y 3."], "La resta daría 10−10=0, pero la respuesta es 7. Persistencia conserva versiones; no añade una operación inversa al agregado. Restar prefijos sirve para cantidades aditivas, no para máximos. Para obtener ese máximo puedes consultar directamente el intervalo en el árbol de la versión correspondiente."),
  ]),

  'usaco-adv-treaps': extend('usaco-adv-treaps',115,[
    s("Separar por posición y unir en orden","El recorrido izquierda, nodo, derecha de un treap implícito representa la secuencia. Cada nodo guarda tamaño, suma, hijos y prioridad. split(T,k) separa sus primeros k elementos. Si el hijo izquierdo tiene s elementos y k≤s, divide ese hijo y reconecta su parte derecha a T. Si k>s, divide el derecho con k−s−1 y reconecta su parte izquierda.\n\nmerge(A,B) coloca A antes de B. Escoge como raíz la de mayor prioridad: si gana A, combina su hijo derecho con B; si gana B, combina A con su hijo izquierdo. Después recalcula tamaño y suma. La precondición de orden es necesaria: merge concatena, no mezcla posiciones arbitrariamente."),
    s("Aislar un intervalo y dejar su inversión pendiente","Para invertir un subárbol, intercambia sus hijos y cambia su bandera rev. Antes de descender, push transmite esa inversión a los hijos y limpia la bandera del padre. Después de reconectar, pull recalcula tamaño=1+tamañoIzquierdo+tamañoDerecho y suma=valor+sumaIzquierda+sumaDerecha.\n\nPara operar sobre [l,r), separa primero un prefijo A de longitud l; del resto separa B de longitud r−l y deja C como sufijo. B contiene exactamente el intervalo. Invierte o consulta su suma y reconstruye merge(A,merge(B,C)). Incluso una consulta debe reconstruir, porque split modifica enlaces aunque la operación solicitada solo lea."),
    s("Separar corrección de balance esperado","split es correcto por inducción: el tamaño izquierdo decide de qué lado de la raíz cae la frontera y solo esa parte necesita dividirse. merge conserva el orden de concatenación y la propiedad de prioridades al escoger la mayor raíz. La inversión intercambia las mitades y deja pendiente invertir internamente cada una, lo que invierte el recorrido completo.\n\nLas prioridades aleatorias controlan la forma, no la exactitud de las respuestas. Con prioridades independientes y distintas, la altura esperada es O(log n); el peor caso puede ser O(n). Si necesitas garantías frente a entradas adaptativas que conocen las prioridades, debes revisar ese modelo o elegir una estructura determinista."),
    s("Seguir una inversión y comprobar las etiquetas","Para invertir [1,4) en [1,2,3,4,5], separa A=[1], B=[2,3,4] y C=[5]. La marca de B representa [4,3,2]; al unir obtienes [1,4,3,2,5]. La suma total sigue siendo 15, por lo que invertir no necesita modificar ese agregado. Una composición no conmutativa sí necesitaría resúmenes en ambos sentidos.\n\nEl ejercicio mantiene una cantidad fija de elementos, aunque split y merge también permiten inserciones y borrados. Usa índices con cero como árbol vacío. Una semilla fija facilita reproducir ejemplos, pero no convierte el costo esperado en garantía absoluta. Prueba invertir dos veces, un elemento y toda la secuencia."),
  ],[
    p('secuencia',"Invertir tramos y consultar sus sumas","Lee n q (1≤n,q≤20000), n valores de valor absoluto≤10⁶ y q operaciones. «1 l r» invierte las posiciones inclusivas l…r; «2 l r» imprime su suma. Las posiciones empiezan en 1.", ["Dos llamadas a split separan prefijo, intervalo y sufijo.", "Invertir intercambia hijos y cambia una bandera; la suma permanece igual."], "Los tamaños permiten que split aísle las posiciones pedidas según el recorrido del árbol. Aplica al centro una inversión diferida o lee su suma, y vuelve a unir las tres partes en orden. Propaga antes de bajar y recalcula después de reconectar. El costo esperado es O(log n) por operación y la memoria O(n).", String.raw`#include <iostream>
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
    r('push-pull',"Distinguir el trabajo de push y pull","¿Qué puede fallar si split desciende sin propagar una inversión pendiente? ¿Y si merge reconecta hijos pero no recalcula tamaño y suma?", ["Una marca representa una inversión que aún debe llegar a los descendientes.", "Los tamaños guían los cortes siguientes y las sumas responden consultas."], "Sin push, puedes interpretar el interior de un hijo con el orden anterior y cortar elementos equivocados. Sin pull, los enlaces pueden ser correctos pero quedan tamaños y sumas obsoletos, que alterarán cortes y respuestas posteriores. push prepara el significado de los hijos antes de usarlos; pull reconstruye el del padre después de modificarlos."),
  ]),
};
