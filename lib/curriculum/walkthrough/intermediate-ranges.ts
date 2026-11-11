import type { Lesson } from '../types.ts';
import { page, text, snippet, problem, program, detail } from './intermediate-helpers.ts';

const build = String.raw`void construir(int v, int l, int r) {
    if (l == r) {
        arbol[v] = a[l];
        return;
    }
    int m = (l + r) / 2;
    construir(2 * v, l, m);
    construir(2 * v + 1, m + 1, r);
    arbol[v] = arbol[2 * v] + arbol[2 * v + 1];
}`;
const query = String.raw`long long consultar(int v, int l, int r, int desde, int hasta) {
    if (r < desde || hasta < l) return 0;
    if (desde <= l && r <= hasta) return arbol[v];
    int m = (l + r) / 2;
    return consultar(2 * v, l, m, desde, hasta)
         + consultar(2 * v + 1, m + 1, r, desde, hasta);
}`;
const change = String.raw`void agregar(int v, int l, int r, int posicion, long long x) {
    if (l == r) {
        arbol[v] += x;
        return;
    }
    int m = (l + r) / 2;
    if (posicion <= m) agregar(2 * v, l, m, posicion, x);
    else agregar(2 * v + 1, m + 1, r, posicion, x);
    arbol[v] = arbol[2 * v] + arbol[2 * v + 1];
}`;
const segmentSumProgram = String.raw`#include <iostream>
#include <vector>
using namespace std;
vector<long long> a, arbol;

${build}

${query}

${change}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    a.resize(n + 1);
    arbol.resize(4 * n);
    for (int i = 1; i <= n; i++) cin >> a[i];
    construir(1, 1, n);
    while (q--) {
        int tipo, l;
        long long r;
        cin >> tipo >> l >> r;
        if (tipo == 1) agregar(1, 1, n, l, r);
        else cout << consultar(1, 1, n, l, (int)r) << '\n';
    }
}`;

export function pointRangeWalkthrough(l: Lesson): Partial<Lesson> {
  const sample = { input: '4 4\n1 2 3 4\n2 1 4\n1 2 5\n2 2 3\n2 4 4\n', output: '10\n10\n4\n' };
  return page([
    problem(l, 'El marcador empieza en [1,2,3,4]. La primera consulta suma todo: 10. Después agregamos 5 a la segunda posición y queda [1,7,3,4]. La suma de posiciones 2 a 3 ahora es 10. La posición 4 sigue valiendo 4.'),
    snippet('Recorrer el intervalo cada vez', 'Con un arreglo común, agregar es inmediato y consultar requiere recorrer el intervalo:', String.raw`a[i] += x;
// Para consultar l a r:
long long total = 0;
for (int j = l; j <= r; j++) total += a[j];`, 'El peor caso cuesta O(n) por consulta. Las sumas de prefijos tampoco resuelven ambos trabajos rápidamente: cambiar a[i] invalida todos los prefijos desde i. Vamos a guardar sumas de bloques para cambiar pocas y consultar pocas.'),
    text('Un árbol de sumas', 'Divide [1,2,3,4] en mitades. La mitad izquierda suma 3; la derecha, 7. La suma general es 10. Divide otra vez hasta que cada bloque contenga un solo valor.\n\nCada caja que guarda una suma se llama nodo. La de arriba, raíz, representa todo el arreglo. Cada nodo tiene dos hijos para sus mitades; los nodos de un elemento son hojas. Para responder una consulta usaremos bloques completos siempre que queden dentro de ella.'),
    { title: 'Dónde está cada suma', body: 'Numeramos nodos desde 1. Los hijos de v serán 2v y 2v+1. El número de nodo no es una posición del arreglo: por ejemplo, el nodo 5 representa la posición 2.', picture: { caption: 'Árbol para el arreglo inicial; los intervalos incluyen ambos extremos.', rows: [
      { label: 'Nodo', values: ['1','2','3','4','5','6','7'] },
      { label: 'Posiciones', values: ['1 a 4','1 a 2','3 a 4','1','2','3','4'] },
      { label: 'Suma', values: ['10','3','7','1','2','3','4'] },
    ] } },
    snippet('Construir las sumas de abajo hacia arriba', 'v identifica el nodo y [l,r] las posiciones que representa. En una hoja copiamos el valor; en otro nodo construimos sus mitades y sumamos:', build, 'La llamada inicial es construir(1,1,n). El intervalo se hace más pequeño hasta llegar a l=r; esa condición detiene la recursión. Reservaremos 4n posiciones para arbol, suficiente para esta numeración incluso cuando n no sea potencia de dos.'),
    snippet('Consultar con tres casos', 'Buscamos la suma inclusiva [desde,hasta]. Un nodo puede quedar completamente fuera, completamente dentro o cruzar una frontera de la consulta:', query, 'Fuera devuelve cero porque no aporta elementos. Dentro devuelve su suma completa, sin bajar. Si solo coincide en parte, consulta ambos hijos y suma sus aportaciones.\n\nPara [2,3], el nodo de [1,2] se divide: [1,1] aporta 0 y [2,2] aporta 2. El de [3,4] también: [3,3] aporta 3 y [4,4] aporta 0. Total 5 antes de actualizar.'),
    snippet('Agregar en una posición y reparar sus padres', 'Solo cambian las sumas de los bloques que contienen posicion. Bajamos hasta su hoja, agregamos x y recalculamos al regresar:', change, 'Agregar 5 en la posición 2 cambia su hoja de 2 a 7. El bloque [1,2] cambia de 3 a 8; el bloque [1,4], de 10 a 15. El bloque [3,4] sigue en 7. La consulta [2,3] ahora devuelve 7+3=10.'),
    text('Cuánto cuesta cada operación', 'Construir visita todos los nodos: O(n). Agregar sigue un solo camino de longitud O(log n). Consultar puede visitar dos lados, pero solo los nodos que cruzan las dos fronteras necesitan seguir dividiéndose; los bloques interiores responden de inmediato. Hay O(log n) nodos relevantes por frontera.\n\nLas consultas y cambios cuestan O(log n), y el árbol usa O(n) memoria. Esta idea también sirve para mínimos y máximos si cambias la operación de combinación y el valor que devuelves fuera.'),
    { title: 'Programa completo con árbol de segmentos', body: 'Este programa resuelve exactamente la entrada del comienzo. Las operaciones tipo 1 agregan una cantidad; las tipo 2 consultan un intervalo. Las tres funciones son las que acabamos de desarrollar.', code: segmentSumProgram, codeInput: sample.input, example: sample, afterCode: 'Prueba agregar −5 en vez de 5: el arreglo pasa a [1,−3,3,4] y la consulta [2,3] da cero. Las sumas y los incrementos usan long long.' },
    text('Otra estructura para estas mismas sumas: Fenwick', 'Si solo necesitas sumar rangos y agregar en una posición, un árbol de Fenwick guarda menos bloques y usa ciclos cortos. No reemplaza a todos los árboles de segmentos; aprovecha que podemos restar dos prefijos para obtener un intervalo.\n\nb[i] guardará la suma de un bloque que termina en i. Su longitud es el valor del bit encendido más bajo de i, escrito i&−i. Para i=6, binario 110, ese bit vale 2: b[6] suma posiciones 5 y 6. Para i=8, vale 8: b[8] suma posiciones 1 a 8.'),
    { title: 'Los bloques que guarda Fenwick', body: 'Todos los índices empiezan en uno. La posición cero queda fuera de los ciclos. Esta tabla muestra el patrón con ocho posiciones:', picture: { caption: 'Cada bloque termina en el índice que lo guarda.', rows: [
      { label: 'i', values: ['1','2','3','4','5','6','7','8'] },
      { label: 'i & −i', values: ['1','2','1','4','1','2','1','8'] },
      { label: 'Bloque de b[i]', values: ['1','1 a 2','3','1 a 4','5','5 a 6','7','1 a 8'] },
    ] } },
    snippet('Sumar un prefijo sin repetir posiciones', 'Tomamos el bloque que termina en i y retrocedemos exactamente su longitud. Al llegar a cero ya cubrimos el prefijo completo:', String.raw`auto sum = [&](int i) {
    long long s = 0;
    for (; i > 0; i -= i & -i) s += b[i];
    return s;
};`, 'sum(7) agrega b[7], b[6] y b[4]: posiciones 7, luego 5 a 6, luego 1 a 4. No se repiten ni queda un hueco. La suma de l a r es sum(r)-sum(l−1), igual que con prefijos comunes.'),
    snippet('Avisar a los bloques que contienen el cambio', 'Al agregar x en i, avanzamos por los bloques guardados que incluyen esa posición:', String.raw`auto add = [&](int i, long long x) {
    for (; i <= n; i += i & -i) b[i] += x;
};`, 'Con n=8, add(3,x) modifica b[3], b[4] y b[8]: son exactamente los bloques de la tabla que contienen 3. add(2,5) modifica b[2], b[4] y b[8]. Cada salto aumenta el tamaño del bloque y llegamos fuera del arreglo en O(log n) pasos.'),
    program(l, 'Esta segunda implementación usa Fenwick para el mismo problema. Al leer cada valor inicial, llama add para incorporarlo; después las operaciones reutilizan add y sum.', 'Con esta construcción, el tiempo es O((n+q)log n), memoria O(n). Nunca llames add(0,x): i&−i sería cero y el ciclo no avanzaría. Si una operación reemplaza a[i] por x en lugar de agregar, debes pasar a add la diferencia x−a[i] y recordar el nuevo valor.'),
    detail(l, 7),
  ]);
}
