import type { LessonExpansion } from '../types.ts';
import { chapter, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedRangeExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-segtree-ext': chapter(85, [
    s('Antes de comenzar: qué resume un nodo', `Necesitas conocer arreglos, recursión y el árbol de segmentos que responde sumas. Trabajaremos con posiciones desde cero y segmentos semiabiertos [l,r): contienen l y excluyen r. Un nodo no guarda necesariamente un número; guarda la información necesaria para responder sobre su segmento sin volver a recorrerlo. La pregunta central es: si conozco el resumen de dos segmentos consecutivos, ¿puedo obtener el de su unión?

Llamaremos combinar a esa operación. Debe ser asociativa: combinar(combinar(A,B),C) y combinar(A,combinar(B,C)) representan el mismo segmento. No tiene que ser conmutativa. Por ejemplo, concatenar «ab» con «cd» produce «abcd», mientras invertir el orden cambia el resultado. Esta distinción determina cómo se implementan consultas y se evitan errores aparentemente inexplicables.`),
    s('Buscar una posición aprovechando los resúmenes', `Supón que cada posición contiene la capacidad libre de un salón y quieres el primero que reciba a un grupo de x personas. Guarda el máximo de cada segmento. Si el máximo de la raíz es menor que x, no existe respuesta. De otro modo, mira el hijo izquierdo: si su máximo alcanza x, la respuesta más temprana está allí; si no, entra al derecho.

El descenso termina en una hoja y visita un nodo por nivel. No hace falta hacer una búsqueda binaria externa que consulte máximos repetidamente. Tras asignar el salón, resta x a su capacidad y reconstruye los máximos del camino. La estructura sirve porque el resumen permite certificar que un segmento completo no contiene soluciones.`),
    s('Traza completa de tres grupos', `Capacidades [2,7,1,5]. La raíz guarda 7; la mitad izquierda guarda 7 y la derecha 5. Para x=4 elegimos izquierda, descartamos la hoja 2 y llegamos al índice 1, cuya capacidad baja a 3. El arreglo queda [2,3,1,5]. Ahora x=3 vuelve a elegir el índice 1 y deja [2,0,1,5]. Finalmente x=6 supera el máximo global 5, así que respondemos que no hay salón.

Comprueba que «primero» significa menor índice, no menor capacidad suficiente. Elegir el salón de capacidad 5 antes que el de capacidad 7 habría satisfecho al grupo, pero incumplido la regla. Por eso miramos siempre el hijo izquierdo antes del derecho.`),
    s('Prueba de que el descenso encuentra el primero', `Mantén este invariante: el segmento del nodo actual contiene alguna capacidad suficiente y ninguna posición descartada anteriormente puede ser una respuesta menor. Es cierto en la raíz después de comprobar su máximo. Si el máximo izquierdo alcanza x, existe una solución en la izquierda; cualquiera de la derecha tiene un índice mayor y puede ignorarse. Si no alcanza, ninguna posición izquierda sirve y descartarla es seguro.

Cada paso reduce la longitud del segmento. Al llegar a una hoja, el invariante garantiza que esa posición sirve y que ninguna anterior sirve. Actualizar sus ancestros restaura el significado de todos los máximos; los nodos fuera del camino representan segmentos que no cambiaron.`),
    s('Otro resumen: máximo subarreglo', `Para responder la máxima suma de un bloque contiguo, guarda cuatro cantidades: suma total T, mejor prefijo P, mejor sufijo S y mejor subarreglo B. Al juntar A y C: T=A.T+C.T; P=max(A.P,A.T+C.P); S=max(C.S,C.T+A.S); B=max(A.B,C.B,A.S+C.P). El último caso representa un subarreglo que cruza la frontera: necesariamente es un sufijo izquierdo seguido de un prefijo derecho.

En [-2,3] el resumen sin permitir vacío es (1,1,3,3); en [-1,4] es (3,3,4,4). Al unirlos obtenemos total 4, prefijo 4, sufijo 6 y mejor 6, correspondiente a [3,-1,4]. Una hoja v guarda (v,v,v,v). No inicialices todo con cero si el bloque vacío está prohibido: en [-5,-2] la respuesta correcta sería -2.`),
    s('El k-ésimo elemento y la condición escondida', `Si las hojas son frecuencias no negativas, el resumen puede ser una suma. Para encontrar el k-ésimo objeto, compara k con la suma izquierda. Si k no la supera, baja a la izquierda; de otro modo, resta esa suma y baja a la derecha. Debes comprobar antes 1≤k≤suma total. Las frecuencias permiten interpretar la suma como una cantidad de objetos.

No reutilices ese procedimiento con valores negativos. En [5,-5,5], la suma izquierda puede ocultar un prefijo que ya alcanzó el objetivo. Para buscar el primer prefijo con suma al menos x cuando hay negativos, necesitas guardar además el máximo prefijo; al descartar una mitad, ajustas x por su suma total.`),
    s('Complejidad, orden y casos vacíos', `Con n elementos, construir cuesta O(n), cada actualización O(log n) y cada descenso O(log n), siempre que combinar tenga costo constante. El almacenamiento es O(n). Una búsqueda binaria que haga consultas completas costaría O(log² n), aunque ambos métodos den la misma respuesta.

En consultas de operaciones no conmutativas, conserva el orden izquierda-derecha. Puedes usar un indicador de segmento vacío en vez de inventar un elemento neutro que no existe. Evita sumar a un centinela como el mínimo entero porque provoca overflow. Cuando el problema admite valores de hasta 10⁹ y 200000 posiciones, sus sumas necesitan long long.`),
    s('Cómo construir y revisar tu solución', `Empieza escribiendo en una frase qué significa cada campo del nodo. Deriva combinar con todos los casos posibles, y prueba el resumen en dos segmentos pequeños antes de escribir la recursión. Después compara consultas aleatorias contra recorrer directamente el arreglo. Los ejemplos de todos negativos, valores repetidos, un solo elemento y una respuesta inexistente revelan errores distintos.

El ejercicio ejecutable siguiente usa una estructura iterativa con hojas en una potencia de dos. Las hojas adicionales tienen capacidad cero; como los grupos son positivos, nunca se eligen. La salida usa posiciones desde uno para que cero represente «ningún salón»; esa conversión sucede únicamente al imprimir.`),
  ], [
    p('salones','Asignar salones','Entrada: n q (1≤n,q≤200000), n capacidades entre 0 y 10⁹ y q tamaños de grupo entre 1 y 10⁹. Cada grupo ocupa el primer salón con capacidad suficiente y reduce esa capacidad. Imprime su posición desde uno, o 0 si no cabe, una por línea.', ['Guarda el máximo de cada intervalo.', 'Si la raíz alcanza, desciende al hijo izquierdo siempre que su máximo alcance.'], 'El máximo descarta intervalos sin capacidad suficiente. Mirar primero el hijo izquierdo encuentra el menor índice. Después se actualizan todos los máximos de sus ancestros. Construir cuesta O(n); cada grupo O(log n).', String.raw`#include <iostream>
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
    r('maximo-bloque','Diseñar un resumen sin usar ceros','Calcula (T,P,S,B) para [-4,2,-1,3,-5] sin permitir el subarreglo vacío. Explica cuál de los tres casos produce B y qué falla si inicializas una hoja negativa con B=0.', ['Divide entre -1 y 3.', 'Enumera prefijos y sufijos por separado antes de combinar.'], 'En [-4,2,-1] obtenemos T=-3, P=-2, S=1, B=2. En [3,-5] obtenemos T=-2, P=3, S=-2, B=3. La unión tiene T=-5, P=max(-2,-3+3)=0, S=max(-2,-2+1)=-1 y B=max(2,3,1+3)=4. El bloque [2,-1,3] cruza la frontera. Inicializar B=0 permite implícitamente elegir el bloque vacío y daría respuestas equivocadas en arreglos completamente negativos.'),
  ]),

  'usaco-plat-rurq': chapter(90, [
    s('Dos operaciones que cambian la estructura necesaria', `Sabes responder sumas de intervalos y modificar un solo elemento con Fenwick. Ahora una instrucción agrega x a todas las posiciones de [l,r], y otra pide su suma. Actualizar cada posición individualmente puede costar O(n log n) por operación. Cuando n y q llegan a 200000, esa solución deja de ser práctica.

Usaremos índices desde uno para Fenwick y extremos inclusivos. Hay dos caminos: aprovechar la estructura algebraica de las sumas con dos árboles Fenwick, o representar modificaciones pendientes en un árbol de segmentos. Aprender ambos permite reconocer cuándo conviene una implementación corta y cuándo necesitas una herramienta más general.`),
    s('Primero transforma los valores en diferencias', `Define D[1]=A[1] y D[i]=A[i]-A[i-1] para i>1. Recuperas A[i] sumando D[1] hasta D[i]. Agregar x a [l,r] cambia únicamente D[l]+=x y, si r<n, D[r+1]-=x. Dentro del intervalo todos los vecinos aumentan lo mismo y sus diferencias permanecen iguales.

Por ejemplo A=[2,5,1,3] produce D=[2,3,-4,2]. Agregar 4 a [2,3] transforma D en [2,7,-4,-2]; al sumar prefijos obtienes [2,9,5,3]. Ya conseguimos actualización de rango y consulta de un punto. Falta responder sumas de varios puntos sin recuperar cada uno por separado.`),
    s('Deriva la identidad de dos Fenwick', `Sea S(p)=A[1]+…+A[p]. Sustituyendo cada A por su prefijo de diferencias, D[j] aparece en A[j], A[j+1],…,A[p]: exactamente p-j+1 veces. Entonces S(p)=Σ(j≤p)(p-j+1)D[j]=p·ΣD[j]-Σ(j-1)D[j].

Guarda D[j] en el árbol B1 y (j-1)D[j] en B2. La consulta de prefijo será p·B1.sum(p)-B2.sum(p). Cuando modificas D[j] por delta, agregas delta a B1 y delta·(j-1) a B2. Una suma [l,r] se obtiene como S(r)-S(l-1). Esta fórmula no es un truco para memorizar: resulta de contar cuántas veces participa cada diferencia.`),
    s('Una traza que comprueba los signos', `Parte de cinco ceros y agrega 3 a [2,4]. En B1 insertas +3 en 2 y -3 en 5; en B2 insertas +3 en 2 y -12 en 5. Para p=4, las consultas son 3 y 3: S(4)=4·3-3=9. Para p=5 ambas sumas de B1 se cancelan y B2 suma -9: S(5)=0-(-9)=9.

Ahora agrega -1 a [3,5]. El arreglo real es [0,3,2,2,-1]; la suma de [2,5] es 6. El cambio en D[6] no se almacena porque está fuera del arreglo. Actualizaciones negativas son válidas: la consulta suma cantidades algebraicas, no busca un k-ésimo elemento mediante monotonía.`),
    s('Propagación diferida: aplazar trabajo sin mentir', `En un árbol de segmentos guarda suma[v] y pendiente[v]. Si sumas x a un intervalo completo de longitud len, actualiza suma[v]+=x·len y pendiente[v]+=x. El agregado del nodo ya incluye el cambio; son sus descendientes quienes todavía no lo reflejan. Cuando una operación necesita entrar a un hijo, transmite la pendiente a ambos hijos y vuelve a cero la del padre.

El pseudocódigo es: si no hay intersección, regresar; si la cobertura es total, aplicar y regresar; en otro caso, empujar, visitar hijos y recombinar. En una consulta parcial también debes empujar antes de leer los hijos. «Diferida» significa posponer la distribución, no posponer la corrección de la respuesta almacenada.`),
    s('Asignar y sumar: el orden de las etiquetas', `Si además puedes asignar A[i]=v en un rango, una simple pendiente aditiva no alcanza. Una representación segura usa tieneAsignacion, valorAsignado y sumaPendiente. Una asignación posterior descarta todo cambio anterior y pone la suma pendiente en cero. Una suma posterior aumenta el valor asignado si existe asignación, o acumula la suma pendiente en otro caso.

En [1,2,3], asignar todo a 4 y sumar 2 al último produce [4,4,6], suma 14. Hacer primero la suma y después asignar produce [4,4,4], suma 12. Las etiquetas se componen en orden temporal. Puedes verificar cualquier regla aplicando las operaciones a un único número y comparando con aplicar la etiqueta compuesta.`),
    s('Por qué ambas soluciones son correctas', `La solución con Fenwick conserva exactamente el arreglo de diferencias: cada actualización realiza los únicos dos cambios que producen el incremento solicitado. La identidad derivada convierte sus prefijos en sumas del arreglo, de modo que restar prefijos responde cualquier rango.

Para lazy propagation, el invariante es que suma[v] es la suma real del segmento después de todas las operaciones, aunque los hijos necesiten recibir su etiqueta. Aplicar respeta ese invariante por multiplicar x por el número de elementos. Empujar conserva la suma total y vuelve coherentes los hijos. Recombinar suma segmentos disjuntos. Esta prueba también explica por qué olvidar empujar rompe una consulta parcial.`),
    s('Costos, límites y una estrategia de implementación', `Dos Fenwick usan O(n) memoria y O(log n) por operación; cada incremento realiza hasta cuatro actualizaciones internas y una consulta usa cuatro prefijos. El árbol diferido tiene el mismo orden asintótico y más posibilidades de agregados y etiquetas. Dos Fenwick no se generalizan sustituyendo suma por mínimo: la derivación usa distribución y resta.

Usa long long para coeficientes y resultados. Bajo límites de 200000 operaciones e incrementos de hasta 10⁶, una suma puede llegar al orden de 4·10¹⁶. Prueba l=r, l=1, r=n, varios incrementos negativos y consultas antes de modificar. El código del ejercicio empieza en ceros para concentrarse en las operaciones; un arreglo inicial puede cargarse usando sus diferencias.`),
  ], [
    p('suma-rangos','Incrementos y sumas','Entrada: n q, con 1≤n,q≤200000. El arreglo inicial contiene n ceros. Cada operación es «1 l r x» para agregar x a [l,r], o «2 l r» para imprimir su suma. 1≤l≤r≤n y |x|≤10⁶. Imprime una línea por consulta.', ['Usa diferencias: cambia l y r+1.', 'Un prefijo de A vale p·sum(D)-sum((j-1)D[j]).'], 'Cada diferencia D[j] contribuye a p-j+1 posiciones del prefijo. Dos Fenwick almacenan los dos términos de esa identidad. Se ignora r+1 cuando supera n. Todas las operaciones cuestan O(log n), con O(n) memoria.', String.raw`#include <iostream>
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
    r('etiquetas','Componer etiquetas sin invertir el tiempo','Un nodo representa cuatro valores. Tiene pendiente asignar 5. Después llegan sumar 3, asignar -2 y sumar 7, todas con cobertura completa. ¿Qué suma debe guardar y qué etiqueta final basta transmitir a sus hijos?', ['Aplica las operaciones a un solo valor.', 'Una asignación borra el efecto de operaciones anteriores.'], 'Asignar 5 y sumar 3 dejaría cada valor en 8. La asignación -2 reemplaza ese resultado; sumar 7 deja cada valor en 5. La suma del nodo es 4·5=20 y basta transmitir asignar 5. No se necesita conocer los valores iniciales. Una etiqueta sumar 13 sería incorrecta porque conservaría dependencia de esos valores, que la asignación ya eliminó.'),
  ]),

  'usaco-plat-sparse-segtree': chapter(80, [
    s('Un universo grande no obliga a reservarlo entero', `Imagina contadores en las posiciones enteras de 0 a 10¹²-1. Solo recibes 5000 incrementos, pero las consultas pueden mencionar cualquier intervalo. Un arreglo con un billón de celdas es imposible para el laboratorio. Un árbol disperso conserva la división binaria de ese universo y crea únicamente los nodos que necesita.

Debes saber cómo funciona un árbol de segmentos y qué es un puntero o índice de nodo. Usaremos el dominio semiabierto [0,U). Si U=16, la raíz representa [0,16), sus hijos [0,8) y [8,16), y así sucesivamente. La altura es ⌈log₂U⌉, unas 40 decisiones para U=10¹².`),
    s('La ausencia de un nodo tiene significado', `Todos los contadores empiezan en cero. Por eso un hijo que todavía no existe representa un intervalo entero cuya suma es cero. No significa «dato desconocido» ni exige materializarlo para consultar. La raíz también puede empezar como un índice nulo.

Cada nodo existente almacena suma, hijo izquierdo e hijo derecho. El valor nulo se puede representar con -1, manteniendo los nodos reales en un vector. Es importante separar el identificador del nodo de las coordenadas geométricas: un nodo con índice 12 en el vector puede representar [500000,1000000). Las coordenadas se pasan como parámetros de la recursión y no dependen de dónde se guardó el nodo.`),
    s('Crear el camino de una actualización', `Para sumar delta en la posición x, crea el nodo actual si no existe. Si su intervalo tiene longitud uno, modifica su suma. De otro modo, calcula m=L+(R-L)/2; desciende a [L,m) si x<m y a [m,R) si x≥m. Reconstruye la suma del padre a partir de sus hijos, interpretando hijos ausentes como cero.

Con U=16 y x=13, aparecen [0,16), [8,16), [12,16), [12,14) y [13,14). No aparecen hojas para 12,14 o 15. Una segunda actualización en 12 comparte todos los nodos hasta [12,14) y crea únicamente la hoja faltante. Las rutas compartidas explican por qué el consumo real suele ser menor que q veces la altura.`),
    s('Consultar sin crear nodos', `Para consultar [a,b), regresa cero si el nodo no existe o los intervalos son disjuntos. Si [L,R) está completamente dentro de [a,b), regresa su suma. En cualquier otro caso divide y suma las respuestas de ambos hijos. Una consulta no debe cambiar el árbol.

Si guardaste +5 en 13 y +2 en 3, la raíz suma 7. Consultar [12,16) devuelve directamente el nodo de suma 5; consultar [4,8) encuentra ausencia y devuelve cero; consultar [3,14) suma 2 y 5 aunque atraviese varias particiones. El intervalo vacío [a,a) devuelve cero por disjunción. Dibujar estos caminos ayuda a separar cobertura total de intersección parcial.`),
    s('Justificación por inducción sobre los segmentos', `El invariante es que cada nodo existente guarda la suma real de todas las posiciones de su segmento. Un nodo ausente cumple la misma afirmación con suma cero porque ninguna actualización lo ha necesitado. Una hoja modificada recibe exactamente el incremento de su posición. En un nodo interno, los hijos representan partes disjuntas cuya unión es su intervalo; sumar sus valores conserva el invariante.

La consulta usa tres casos exhaustivos. En disjunción no hay contribución. En cobertura total la suma guardada es exacta por el invariante. En intersección parcial, ambas llamadas cuentan partes disjuntas del rango pedido. La recursión termina porque cada intervalo se acorta hasta una hoja.`),
    s('El peligro de las referencias a un vector', `Es tentador escribir actualizar(nodos[v].izquierdo,…) pasando esa celda por referencia. Pero una llamada recursiva puede ejecutar push_back, provocar una realocación del vector e invalidar la referencia. El programa puede parecer correcto con pocos datos y fallar después.

Una técnica segura es hacer que actualizar devuelva el índice de su nueva raíz. Copias el índice del hijo a una variable, llamas recursivamente y vuelves a guardar el resultado accediendo a nodos[v] mediante su índice, que permanece válido. Reservar capacidad reduce realocaciones, pero no sustituye una regla correcta si calculaste mal la reserva. El ejercicio usa esta técnica de retorno de índices.`),
    s('Comparación con comprimir coordenadas', `Si conoces todas las posiciones que serán actualizadas, puedes ordenarlas, eliminar repetidos y guardar sus valores en un árbol ordinario. Una consulta [a,b) se traduce mediante lower_bound de a y b. Para sumas puntuales esta alternativa suele usar menos memoria: O(q) frente a O(q log U) nodos en la cota del árbol disperso.

El árbol implícito es útil cuando las coordenadas llegan en línea o cuando quieres mantener una partición del dominio sin recolectarlas primero. No confundas compresión con preservar distancias: entre las posiciones 2 y 100 hay distancia 98, aunque sus índices comprimidos sean consecutivos. Si guardas longitudes cubiertas, necesitas las coordenadas originales.`),
    s('Costos, variantes y límites concretos', `Cada cambio y consulta de intervalo cuesta O(log U). Una consulta de rango puede visitar dos fronteras y varios segmentos completos, pero solo una cantidad constante de nodos por nivel. Con q cambios, se crean como máximo O(q log U) nodos y no más durante las consultas. Usa long long para coordenadas y sumas, y calcula el punto medio sin sumar L+R directamente.

Una variante con actualizaciones de rango y lazy propagation debe definir cómo un hijo nuevo hereda etiquetas anteriores. No basta copiar el código puntual y añadir una pendiente: un hijo ausente podría representar un intervalo modificado. Primero domina el caso de incremento puntual; incluye pruebas de extremos 0 y U-1, incrementos negativos y consultas que no contienen ninguna posición modificada.`),
  ], [
    p('universo','Contadores en coordenadas enormes','Entrada: U q, con 1≤U≤10¹² y 1≤q≤5000. Inicialmente todos los contadores de [0,U) valen cero. «1 x d» agrega d al contador x, con |d|≤10⁶; «2 l r» consulta la suma en [l,r), permitiendo l=r. Imprime una línea por consulta. Todas las coordenadas son válidas.', ['Un nodo ausente representa suma cero.', 'Devuelve índices desde la actualización para evitar referencias invalidadas por vector.'], 'Solo se crean los nodos del camino de cada posición modificada. Cada nodo suma sus hijos y las consultas suman segmentos disjuntos. La altura es O(log U); con q cambios la memoria es O(q log U).', String.raw`#include <iostream>
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
    r('elige-estructura','¿Disperso o comprimido?','Conoces de antemano todas las modificaciones: posiciones 10,10⁹ y 10¹², inicialmente cero. Debes responder sumas de valores puntuales en intervalos. Diseña una compresión y traduce [11,10¹²+1). Después explica por qué esa misma compresión no mide por sí sola la longitud del intervalo.', ['Comprime solo posiciones que podrán tener valor distinto de cero.', 'lower_bound localiza el primer punto no menor que un extremo.'], 'Ordena C=[10,10⁹,10¹²] y usa índices 0,1,2. Para [11,10¹²+1), lower_bound(11)=1 y lower_bound(10¹²+1)=3, así que consultas [1,3). Los puntos sin modificaciones aportan cero y pueden omitirse. Sin embargo, el intervalo original tiene longitud 10¹²-10, que no coincide con los dos índices consultados. Si se pidieran longitudes, habría que almacenar distancias entre coordenadas.'),
  ]),

  'usaco-plat-2drq': chapter(85, [
    s('De intervalos a rectángulos', `En una tabla, cada elemento tiene fila y columna. Una consulta pide la suma en las filas x1…x2 y columnas y1…y2, con ambos extremos incluidos. Necesitas manejar prefijos en una dimensión y entender que una matriz de n por m contiene n·m posiciones, no n+m.

Definiremos P(x,y) como la suma de todas las celdas con fila ≤x y columna ≤y. Las filas y columnas empiezan en uno; P(0,y)=P(x,0)=0. Esta frontera de ceros permite escribir una sola fórmula incluso para rectángulos que tocan la primera fila o la primera columna. Dibuja los cuatro prefijos antes de implementar: es más seguro que memorizar signos.`),
    s('La inclusión y exclusión del rectángulo', `Comienza con P(x2,y2), que contiene el rectángulo pedido pero también todas las filas anteriores a x1 y las columnas anteriores a y1. Resta P(x1-1,y2) y P(x2,y1-1). La esquina superior izquierda quedó restada dos veces, así que repón P(x1-1,y1-1).

El resultado es P(x2,y2)-P(x1-1,y2)-P(x2,y1-1)+P(x1-1,y1-1). Puedes probarlo siguiendo una celda: una celda dentro aparece una vez; una celda exclusivamente arriba o a la izquierda se cancela; una celda en la esquina tiene coeficiente 1-1-1+1=0. Esta prueba por contribución funciona para cualquier valor, incluidos negativos.`),
    s('Prefijos estáticos: la opción más sencilla', `Si la matriz no cambia, calcula P(x,y)=A[x][y]+P(x-1,y)+P(x,y-1)-P(x-1,y-1). Recorrer por filas garantiza que los tres prefijos necesarios ya existen. La preparación cuesta O(nm), el espacio O(nm) y cada rectángulo O(1).

En la matriz [1,2,3;4,5,6;7,8,9], el bloque de filas 2…3 y columnas 2…3 suma 5+6+8+9=28. Los cuatro prefijos son 45,6,12,1; entonces 45-6-12+1=28. Cambiar la celda central a 15 alteraría muchos prefijos, así que esta estructura estática no es adecuada si hay cambios frecuentes.`),
    s('Qué representa una celda de Fenwick 2D', `Para permitir incrementos puntuales, usa un Fenwick sobre cada dimensión. lowbit(i)=i&-i es el tamaño del bloque que termina en i. La celda T[i][j] guarda la suma del rectángulo de filas i-lowbit(i)+1…i y columnas j-lowbit(j)+1…j.

Agregar delta en (x,y) requiere visitar todos los bloques que la contienen: i=x; i≤n; i+=lowbit(i), y dentro de cada i, j=y; j≤m; j+=lowbit(j). Es fundamental reiniciar j=y en cada iteración exterior. El recorrido interior no puede compartir una variable agotada por el recorrido anterior. Esta estructura es el producto de dos Fenwick ordinarios.`),
    s('Cómo se consulta y una traza de cambios', `Para P(x,y), recorre i=x; i>0; i-=lowbit(i), y para cada i recorre j=y; j>0; j-=lowbit(j), acumulando T[i][j]. Los intervalos de filas forman una partición del prefijo y lo mismo sucede con las columnas; sus productos forman rectángulos disjuntos.

En una tabla 3×3 inicialmente cero, agrega 5 a (2,2), 3 a (1,3) y -2 a (3,1). El total es 6. El rectángulo [1,2]×[2,3] suma 8 y el rectángulo [2,3]×[1,2] suma 3. Después agrega 4 a (2,2): las respuestas pasan a 12 y 7. No reconstruiste toda la tabla: solo cambiaste los bloques que contienen el centro.`),
    s('Demostración de los recorridos', `En una dimensión, restar lowbit elimina el último bloque del prefijo y deja un prefijo más corto sin superposición. Repetirlo llega a cero y cubre todas las posiciones una vez. Al combinar dos particiones, cada celda pertenece a exactamente un par de bloques, por lo que la consulta bidimensional cuenta cada valor una vez.

Para una actualización, sumar lowbit enumera los bloques Fenwick que contienen la posición. Hacerlo en ambas dimensiones enumera todos sus productos. Así los únicos resúmenes afectados reciben delta, conservando el significado de T. La fórmula de cuatro prefijos convierte consultas correctas de prefijo en consultas correctas de rectángulo.`),
    s('La memoria puede ser el verdadero obstáculo', `Cada operación cuesta O(log n·log m), pero el Fenwick denso consume O(nm) memoria. Con n=m=100000 es inviable aunque cada operación sea rápida. Comprimir por separado las coordenadas x e y puede seguir produciendo q² celdas para q puntos: no basta decir que las coordenadas se hicieron pequeñas.

Una alternativa offline recoge, para cada nodo del Fenwick exterior, las coordenadas y que podrían actualizarlo. Ordena y deduplica esas listas; cada nodo almacena su propio Fenwick interno. Cada punto participa en O(log q) listas, así la memoria es O(q log q) y el tiempo por operación O(log²q). Si no hay actualizaciones, un barrido ordenado por x suele ser aún más sencillo.`),
    s('Elegir convenciones y comprobar errores', `Distingue incrementar una celda de asignarle un valor. Fenwick recibe un delta: para asignar nuevoValor, necesitas conocer anteriorValor y enviar su diferencia. El ejercicio utiliza incrementos explícitos para evitar esa confusión. Una estructura con índices desde uno no puede ejecutar add(0,…), pues lowbit(0)=0 provocaría un ciclo infinito.

Prueba una matriz 1×1, rectángulos de una sola celda, todas las esquinas y actualizaciones negativas. Usa long long: el valor de cada celda y la suma de muchas celdas tienen límites diferentes. Si solo necesitas consultas estáticas, conserva los prefijos simples; una estructura dinámica más complicada no mejora una operación que ya cuesta O(1).`),
  ], [
    p('huerto','Riego de un huerto','Entrada: n m q, con 1≤n,m≤500 y 1≤q≤20000. La tabla comienza en cero. «1 x y d» agrega d a una celda, con |d|≤10⁶. «2 x1 y1 x2 y2» imprime la suma del rectángulo inclusivo. Las posiciones son válidas e índices desde uno.', ['Anida dos recorridos Fenwick.', 'Resta cuatro prefijos para obtener un rectángulo.'], 'Cada bloque Fenwick representa el producto de un intervalo de filas y otro de columnas. Las actualizaciones modifican todos los bloques que contienen la celda; las consultas de prefijo suman una partición disjunta. Tiempo O(q log n log m) y memoria O(nm).', String.raw`#include <iostream>
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
    r('cuatro-prefijos','Reconstruir una suma y elegir estructura','En la matriz [2,-1,4;0,3,5], calcula la suma de las filas 1…2 y columnas 2…3 usando cuatro prefijos. Después elige entre prefijos estáticos y Fenwick 2D si hay un millón de consultas y ningún cambio.', ['La columna anterior al rango es la primera.', 'La frontera con fila cero vale cero.'], 'P(2,3)=13, P(0,3)=0, P(2,1)=2 y P(0,1)=0. La respuesta es 13-0-2+0=11, igual a -1+4+3+5. Sin cambios, conviene la tabla de prefijos: se construye en O(nm), conserva O(nm) memoria y responde en O(1). Fenwick añadiría factores logarítmicos sin aportar una capacidad necesaria.'),
  ]),
};
