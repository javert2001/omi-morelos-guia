import type { LessonExpansion } from '../types.ts';
import { chapter, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedOfflineExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-range-sweep': chapter(85, [
    s('Convierte una coordenada en el orden del trabajo', `Una consulta bidimensional parece exigir una estructura bidimensional. Sin embargo, si conoces las consultas antes de responderlas, puedes ordenar eventos por una coordenada y mantener información únicamente sobre la otra. Este procedimiento se llama barrido. Es una técnica offline: puedes cambiar el orden de procesamiento, pero debes guardar el identificador de cada consulta para devolver las respuestas en su orden original.

Trabajaremos primero con puntos (x,y) y preguntas del tipo «¿cuántos puntos cumplen x≤X e y≤Y?». Necesitas ordenar, comprimir coordenadas y usar un Fenwick de frecuencias. El eje x será el reloj del barrido; el Fenwick describirá los valores y de los puntos que ya entraron.`),
    s('Define exactamente qué significa estar activo', `Ordena los puntos por x y las consultas por X. Antes de responder una consulta, inserta todos los puntos cuyo x≤X. Cada inserción agrega uno a la posición comprimida de su y. Entonces un prefijo del Fenwick hasta Y cuenta los puntos que también cumplen y≤Y.

El invariante es preciso: al responder (X,Y), están activos todos y solo los puntos con x≤X. Esa frase determina el bucle while que inserta puntos y resuelve los empates. Si usas x<X por accidente, desaparecen los puntos sobre la frontera vertical. Los duplicados también cuentan: dos puntos con las mismas coordenadas generan dos incrementos.`),
    s('Traza con puntos repetidos', `Considera P=[(1,1),(2,3),(3,2),(2,3)]. Al responder (X=1,Y=3), solo está activo (1,1), por lo que la respuesta es 1. Al pasar a X=2 entran ambas copias de (2,3): ahora hay tres puntos activos. La pregunta Y=2 devuelve 1, mientras Y=3 devuelve 3. Con X=3 ya están los cuatro puntos y Y=2 devuelve 2.

Observa que Y puede disminuir o aumentar arbitrariamente entre consultas; no mueve el barrido. Fenwick permite consultar distintos prefijos del conjunto activo sin perder información. En cambio, X nunca retrocede porque ordenamos previamente todas las preguntas.`),
    s('De prefijos a rectángulos con cuatro eventos', `Para contar en [x1,x2]×[y1,y2], ambos inclusivos, define F(X,Y) como la respuesta del prefijo bidimensional. El resultado es F(x2,y2)-F(x1-1,y2)-F(x2,y1-1)+F(x1-1,y1-1). Crea cuatro eventos con el mismo identificador de consulta y signos +1,-1,-1,+1. El barrido calcula cada prefijo y acumula su contribución firmada.

Con los cuatro puntos anteriores, [2,3]×[2,3] contiene las dos copias de (2,3) y (3,2): tres puntos. Los prefijos valen 4,1,1,1, así que 4-1-1+1=3. La esquina se repone porque se restó dos veces. Si las coordenadas fueran reales, reemplazarías «x1-1» por eventos estrictos y desempates apropiados.`),
    s('Comprimir sin perder desigualdades', `Ordena los valores y de los puntos y elimina repetidos. Cada inserción usa lower_bound para encontrar el índice exacto de un y existente, más uno para Fenwick. Una consulta y≤Y usa upper_bound(Y), que devuelve cuántas coordenadas comprimidas son menores o iguales a Y. Ese número ya es el tamaño del prefijo a consultar.

Y no tiene que aparecer en la lista. Si las coordenadas son [1,3,8] y Y=5, upper_bound devuelve 2 y consultamos los valores 1 y 3. Usar lower_bound aquí excluiría el punto y=3 cuando Y=3. Esta diferencia entre insertar una clave y localizar un límite es una fuente frecuente de fallos.`),
    s('La misma idea cuenta intersecciones ortogonales', `Para contar cruces entre segmentos verticales y horizontales, barre por y. Un vertical en x desde yA hasta yB produce una entrada +1 en yA y una salida -1 en yB; un horizontal produce una consulta sobre su intervalo de x. Si tocar extremos cuenta como intersección, en una altura compartida procesa entradas, consultas y salidas, en ese orden.

Por ejemplo, un vertical x=2 con y en [1,5] y un horizontal y=5 con x en [0,3] deben contarse. Retirar el vertical antes de la consulta perdería ese contacto. Esta versión cuenta pares vertical-horizontal; no resuelve superposiciones entre segmentos paralelos ni cruces de segmentos inclinados sin otra estructura.`),
    s('Corrección y costo total', `Ordenar por X garantiza que, antes de una consulta, todas las inserciones necesarias pueden hacerse avanzando un único puntero. Ningún punto con x>X ha entrado y todos los que cumplen x≤X ya entraron. El prefijo de Fenwick selecciona exactamente los activos con y≤Y, por lo que F es correcto. La fórmula de cuatro prefijos cuenta una vez los puntos del rectángulo y cancela los demás.

Con n puntos y q rectángulos hay 4q eventos. Ordenar cuesta O((n+q) log(n+q)); cada inserción o evento cuesta O(log n). La memoria es O(n+q). Este método evita una matriz de n² celdas y suele ser preferible a Fenwick 2D para consultas estáticas.`),
    s('Cuándo no puedes reordenar y cómo probar', `Si el siguiente rectángulo se calcula usando la respuesta anterior, no conoces todos los eventos al inicio y el barrido offline no se aplica directamente. También cambian las condiciones si los puntos aparecen y desaparecen durante el tiempo original del problema. Primero verifica que reordenar no destruya una dependencia real.

En el ejercicio las coordenadas están entre -10⁹ y 10⁹, así que restar uno dentro de long long es seguro. Prueba puntos sobre cada borde, rectángulos sin puntos, varias copias de un punto y coordenadas negativas. Para verificar una implementación, compara cada consulta con recorrer todos los puntos en instancias pequeñas; la versión lenta es una especificación útil.`),
  ], [
    p('parcelas','Puntos dentro de parcelas','Entrada: n q (1≤n,q≤100000), n pares x y y q rectángulos x1 y1 x2 y2. Coordenadas enteras entre -10⁹ y 10⁹, con x1≤x2 e y1≤y2. Los bordes están incluidos y puntos repetidos cuentan por separado. Imprime el número de puntos en cada rectángulo.', ['Convierte cada rectángulo en cuatro prefijos con signos.', 'Inserta puntos mientras x≤X y usa upper_bound para consultar y≤Y.'], 'El barrido conserva exactamente los puntos cuya coordenada x cumple el límite de cada evento. Fenwick cuenta entre ellos los que cumplen el límite y. Inclusión y exclusión reconstruye el rectángulo. Tiempo O((n+q) log(n+q)), memoria O(n+q).', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
struct Event {
    long long x, y;
    int id, sign;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<pair<long long, long long>> a(n);
    vector<long long> ys;
    for (auto &v : a) {
        cin >> v.first >> v.second;
        ys.push_back(v.second);
    }
    sort(a.begin(), a.end());
    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());
    vector<Event> ev;
    vector<long long> ans(q);
    for (int i = 0; i < q; i++) {
        long long x, y, X, Y;
        cin >> x >> y >> X >> Y;
        ev.push_back({X, Y, i, 1});
        ev.push_back({x - 1, Y, i, -1});
        ev.push_back({X, y - 1, i, -1});
        ev.push_back({x - 1, y - 1, i, 1});
    }
    sort(ev.begin(), ev.end(), [](Event u, Event v) { return u.x < v.x; });
    vector<int> bit(ys.size() + 1);
    int next = 0;
    for (auto e : ev) {
        while (next < n && a[next].first <= e.x) {
            int j = lower_bound(ys.begin(), ys.end(), a[next].second) - ys.begin() + 1;
            for (; j < (int)bit.size(); j += j & -j)
                bit[j]++;
            next++;
        }
        int j = upper_bound(ys.begin(), ys.end(), e.y) - ys.begin();
        long long z = 0;
        for (; j; j -= j & -j)
            z += bit[j];
        ans[e.id] += e.sign * z;
    }
    for (long long z : ans)
        cout << z << '\n';
}`, [{input:'4 3\n1 1\n2 3\n3 2\n2 3\n1 1 2 3\n2 2 3 3\n4 4 5 5\n',output:'3\n3\n0\n'}, {input:'2 2\n-1 -1\n0 0\n-1 -1 -1 -1\n-2 -2 0 0\n',output:'1\n2\n'}, {input:'1 2\n5 7\n5 7 5 7\n5 8 8 9\n',output:'1\n0\n'}]),
    r('empates','Contactos en el borde','Un vertical va de (4,2) a (4,6). Hay horizontales desde x=1 hasta x=7 en alturas 2,4 y 6. ¿Cuántos cruces hay con extremos incluidos? ¿Y si los extremos del vertical se excluyen? Especifica el orden de eventos necesario en ambos casos.', ['Las alturas 2 y 6 coinciden con cambios de actividad.', 'No existe un único desempate válido para todas las definiciones.'], 'Con extremos incluidos hay tres cruces; se procesan entrada, consulta y salida. Con el vertical abierto en ambos extremos solo cruza el horizontal de altura 4. En una altura común, para esa convención se procesan primero salidas, luego consultas y después entradas. Así el vertical aún no participa en su inicio y ya no participa en su final. El significado geométrico dicta el orden, no la comodidad del código.'),
  ]),

  'usaco-plat-dc-srq': chapter(90, [
    s('Consultas estáticas sin una operación inversa', `Una suma de rango se obtiene restando prefijos, pero no toda operación asociativa permite cancelar un prefijo. Multiplicar matrices o componer funciones puede perder información. Considera una función constante f(x)=7: después de aplicarla no puedes recuperar x mediante una inversa. Aun así, puedes combinar segmentos contiguos porque la composición es asociativa.

Queremos preparar un arreglo fijo para responder agregados de intervalos. «Fijo» es una condición importante: no habrá actualizaciones. Usaremos intervalos inclusivos [l,r] durante la explicación de la tabla disjunta; cada resumen conserva el orden de izquierda a derecha. Necesitas conocer divide y vencerás, operaciones binarias asociativas y bits.`),
    s('El corte que divide una consulta en dos partes', `Divide un bloque [L,R] en dos mitades, separadas entre M y M+1. En la mitad izquierda prepara todos los sufijos que terminan en M: A[i]⊗…⊗A[M]. En la mitad derecha prepara todos los prefijos que empiezan en M+1: A[M+1]⊗…⊗A[j].

Si una consulta cumple l≤M<r, su agregado es sufijo[l]⊗prefijo[r]. Las dos partes son contiguas, no se superponen y cubren exactamente [l,r]. Las consultas completamente en una mitad se resuelven repitiendo el proceso allí. Al final cualquier consulta de al menos dos elementos cruza algún corte; una consulta de una sola posición devuelve su elemento.`),
    s('Orden correcto al construir los resúmenes', `Un sufijo se construye de derecha a izquierda: suf[i]=A[i]⊗suf[i+1]. Un prefijo se construye de izquierda a derecha: pre[i]=pre[i-1]⊗A[i]. Las fórmulas parecen simétricas, pero intercambiar sus operandos rompe operaciones no conmutativas.

Usa funciones afines para comprobarlo. Sean f(x)=2x+1 y g(x)=3x. Aplicar primero f y después g produce 6x+3; hacerlo al revés produce 6x+1. Definiremos combinar(f,g)=g∘f para que el orden del arreglo coincida con el orden de aplicación. Si f=(a,b) y g=(c,d), combinar devuelve (c·a,c·b+d).`),
    s('Tabla disjunta: un nivel para cada potencia de dos', `En el nivel k divide el arreglo en bloques de longitud 2^(k+1), con una mitad de longitud 2^k. Guarda en una sola fila de la tabla los sufijos de cada mitad izquierda y los prefijos de cada mitad derecha. La preparación de una fila recorre O(n) posiciones; hay O(log n) filas.

Para extremos distintos l y r, toma k como la posición del bit más significativo de l XOR r. Ambos índices coinciden en todos los bits superiores a k y difieren en k. Por ello pertenecen al mismo bloque de tamaño 2^(k+1), pero están a lados opuestos de su corte. La respuesta usa tabla[k][l]⊗tabla[k][r]. No necesitas buscar el corte recursivamente.`),
    s('Traza de una consulta y del caso unitario', `Supón ocho funciones f0…f7 y consulta [2,6]. En binario, 2=010 y 6=110; su XOR es 100 y el bit principal es k=2. El bloque relevante tiene longitud 8 y se divide entre 3 y 4. Combinamos el sufijo f2⊗f3 con el prefijo f4⊗f5⊗f6.

Si consultas [4,5], el XOR es 001, k=0 y basta el bloque de dos elementos correspondiente. Para [5,5], el XOR vale cero y no tiene bit principal: devuelve f5 antes de intentar calcular k. Llamar a una instrucción de contar ceros iniciales con cero puede ser comportamiento indefinido en C++; el caso especial es obligatorio.`),
    s('Por qué no usar dos bloques superpuestos', `Una sparse table de mínimos suele cubrir un rango con dos bloques de igual longitud que pueden superponerse. Funciona porque min(x,x)=x: repetir elementos no cambia el resultado. Esa propiedad se llama idempotencia. Sumar o componer funciones no es idempotente y repetir elementos sí cambia la respuesta.

Para [1,2,3], sumar los bloques [1,2] y [2,3] produce 8 en vez de 6 porque cuenta dos veces el 2. La tabla disjunta evita el problema: sus dos fragmentos se tocan en una frontera sin compartir posiciones. Por eso basta asociatividad; no exige inversa, conmutatividad ni idempotencia.`),
    s('Prueba de corrección y costos reales', `Cada sufijo y prefijo es correcto por inducción sobre su longitud: se añade un elemento en el extremo apropiado y la asociatividad permite agrupar sin cambiar el orden. El bit principal selecciona un corte que separa exactamente los extremos. Unir los dos resúmenes correctos entrega todos y solo los elementos del rango en el orden original.

La preparación usa O(n log n) tiempo y espacio. Cada consulta usa O(1) combinaciones. Estas cotas suponen que el resumen y combinar tienen tamaño y costo constantes. Concatenar textos es una buena imagen mental, pero no satisface ese supuesto: copiar cadenas cuesta según su longitud. Matrices de tamaño fijo o pares afines sí lo satisfacen.`),
    s('Una variante offline y recomendaciones', `Si todas las consultas se conocen de antemano, también puedes repartirlas recursivamente: en cada bloque responde las que cruzan el corte y manda las demás a su mitad. Una implementación directa cuesta O((n+q) log n) y puede ahorrar memoria si libera resúmenes por niveles. La tabla disjunta invierte más memoria para responder futuras consultas inmediatamente.

En el ejercicio calculamos todo módulo 1000000007 para evitar que los coeficientes crezcan sin límite. Las funciones pueden ser constantes, mostrando que no necesitamos inversas. Comprueba arreglos cuyo tamaño no sea potencia de dos: la última mitad puede quedar incompleta y los bucles deben respetar n.`),
  ], [
    p('transformaciones','Componer transformaciones','Entrada: n q (1≤n≤100000, 1≤q≤100000), luego n pares a b que representan f(x)=a·x+b módulo 1000000007. Cada consulta l r x pide aplicar f[l], f[l+1], …, f[r] a x, con posiciones desde uno. Todos los coeficientes y x están entre 0 y 1000000006. Imprime el resultado.', ['Combinar dos funciones significa aplicar la izquierda y después la derecha.', 'Usa el bit principal de (l-1) XOR (r-1) para elegir el nivel.'], 'Se precalculan sufijos izquierdos y prefijos derechos de cada bloque binario. El nivel elegido separa los extremos; sus fragmentos son disjuntos y cubren la consulta. La composición afín es asociativa, aunque no conmutativa. Preparación O(n log n), consulta O(1).', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
const long long MOD = 1000000007;
struct F {
    long long a, b;
};
F join(F f, F g) { return {g.a * f.a % MOD, (g.a * f.b + g.b) % MOD}; }
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<F> a(n);
    for (auto &f : a)
        cin >> f.a >> f.b;
    int K = 1;
    while ((1 << K) < n)
        K++;
    vector<vector<F>> t(K, vector<F>(n));
    for (int k = 0; k < K; k++) {
        int half = 1 << k;
        for (int L = 0; L < n; L += 2 * half) {
            int M = min(n, L + half), R = min(n, L + 2 * half);
            t[k][M - 1] = a[M - 1];
            for (int i = M - 2; i >= L; i--)
                t[k][i] = join(a[i], t[k][i + 1]);
            if (M < R) {
                t[k][M] = a[M];
                for (int i = M + 1; i < R; i++)
                    t[k][i] = join(t[k][i - 1], a[i]);
            }
        }
    }
    while (q--) {
        int l, r;
        long long x;
        cin >> l >> r >> x;
        --l;
        --r;
        F f;
        if (l == r)
            f = a[l];
        else {
            int k = 31 - __builtin_clz((unsigned)(l ^ r));
            f = join(t[k][l], t[k][r]);
        }
        cout << (f.a * x + f.b) % MOD << '\n';
    }
}`, [{input:'3 3\n2 1\n3 0\n1 4\n1 3 1\n2 3 2\n2 2 5\n',output:'13\n10\n15\n'}, {input:'1 2\n0 7\n1 1 0\n1 1 99\n',output:'7\n7\n'}, {input:'4 2\n1 1\n1 2\n2 0\n1 1000000006\n1 4 0\n2 3 1\n',output:'5\n6\n'}]),
    r('sin-inversa','Una consulta que no admite cancelar prefijos','Las funciones son f0(x)=2x+1, f1(x)=0 y f2(x)=x+5. Calcula el resultado de [1,2] sobre x=8, con índices desde cero. Explica por qué conocer la composición de prefijos no permite simplemente dividir para eliminar f0.', ['La función constante borra información del argumento.', 'La tabla disjunta combina funciones sin intentar deshacer ninguna.'], 'Aplicar f1 deja 0 y aplicar f2 deja 5. El resultado es 5 para cualquier x. Las composiciones de prefijos pueden ser constantes y no tienen inversa; no existe una división general que recupere las funciones omitidas. La tabla disjunta usa directamente el resumen de f1 seguido del resumen de f2, cuya composición es la función constante 5.'),
  ]),

  'usaco-plat-sqrt': chapter(90, [
    s('Dividir en bloques para equilibrar dos costos', `Un arreglo de n posiciones puede dividirse en bloques consecutivos de tamaño B. Para sumar un intervalo, recorre las partes incompletas de sus extremos y usa una suma precalculada para cada bloque completo entre ellas. Hay como máximo dos fragmentos de B elementos y aproximadamente n/B bloques.

El costo es O(B+n/B). Si B es muy pequeño, recorres muchos bloques; si es muy grande, recorres demasiadas posiciones fronterizas. El equilibrio está cerca de √n. Este razonamiento es más importante que memorizar «usar raíz»: cuando cambian los costos de actualizar o consultar, el mejor tamaño también puede cambiar.`),
    s('Actualizaciones y una consulta por bloques', `En A=[1,2,3,4,5,6,7,8,9] con B=3, las sumas de bloques son 6,15,24. Para consultar posiciones [1,7] desde cero, recorre 2 y 3, usa el bloque completo [4,5,6] con suma 15 y recorre 7 y 8. La respuesta es 35.

Una actualización puntual que sustituye A[i] por v modifica la suma de su bloque en v-A[i], así que cuesta O(1). Si el resumen fuera mínimo, reemplazar el mínimo anterior podría obligar a recorrer todo el bloque. La descomposición no garantiza los mismos costos para cualquier agregado; siempre deriva qué necesitas reconstruir.`),
    s('Cuando el resumen de un bloque no basta', `Para contar distintos en un rango, no puedes sumar las cantidades de distintos de bloques separados: el mismo valor puede aparecer en varios. Guardar conjuntos grandes y unirlos en cada consulta puede resultar caro. El algoritmo de Mo toma otra dirección: conserva una sola ventana activa y ordena las consultas para mover sus extremos poco a poco.

Mo necesita que puedas agregar o quitar una posición y actualizar la respuesta eficientemente. Para distintos mantén freq[v] y distintos. Al agregar, si freq[v] era cero, aumenta distintos; después incrementa la frecuencia. Al quitar, disminuye la frecuencia y, si llegó a cero, disminuye distintos. Una segunda copia de un valor no cambia la cantidad de distintos.`),
    s('Ordenar consultas y mantener la ventana', `Divide las posiciones izquierdas en bloques de tamaño B. Ordena consultas primero por l/B y después por r. En bloques alternos puedes ordenar r en sentido contrario; así evitas que el extremo derecho regrese de n a cero entre todos los bloques. Guarda el índice original de cada consulta.

Empieza con una ventana vacía, por ejemplo L=0 y R=-1 si usas extremos inclusivos. Para alcanzar [l,r], expande a izquierda mientras L>l, expande a derecha mientras R<r, y luego elimina posiciones sobrantes mientras L<l o R>r. Cada movimiento llama agregar o quitar exactamente una vez. Mantener una convención única evita incluir una posición dos veces.`),
    s('Traza de frecuencias y borrados', `En [1,2,1,3,2], la ventana [0,2] contiene frecuencias {1:2,2:1} y respuesta 2. Para pasar a [1,3], primero agrega el 3: distintos pasa a 3. Después quita la primera copia de 1: su frecuencia baja de 2 a 1, por lo que distintos sigue siendo 3.

Para pasar de allí a [3,4], agrega el 2 final, cuya frecuencia pasa a 2 sin cambiar distintos. Quita el 2 de la posición 1 y todavía queda una copia. Quita el 1 de la posición 2 y desaparece ese valor: ahora la ventana contiene [3,2] y la respuesta es 2. Reducir distintos en cada eliminación, sin revisar la frecuencia restante, sería incorrecto.`),
    s('Cuenta los movimientos antes de elegir B', `En un bloque fijo de l, el extremo derecho recorre a lo sumo O(n) posiciones. Hay aproximadamente n/B bloques, así su movimiento total es O(n²/B). Entre consultas consecutivas del mismo bloque, l cambia como máximo O(B), dando O(qB). El total es O(n²/B+qB), además de ordenar las q consultas.

Si q es del orden de n, B≈√n produce O((n+q)√n). Si q difiere mucho, puedes equilibrar con B≈n/√q, limitado al rango válido. Estas cotas suponen agregar y quitar O(1); si cuestan log n, multiplicas por ese factor. No afirmes O(log n) por consulta: una consulta aislada puede mover una ventana muy lejos.`),
    s('Correctitud y compresión de valores', `El invariante de la ventana dice que freq[v] es la cantidad exacta de apariciones de v entre L y R, y distintos cuenta sus frecuencias positivas. Agregar y quitar preservan ese significado comprobando los pasos entre cero y uno. Cuando los extremos coinciden con la consulta, el invariante entrega la respuesta correcta. El orden elegido solo cambia el costo, nunca el resultado.

Si los valores llegan hasta 10⁹, comprímelos ordenando y deduplicando. Para contar igualdad, basta que valores iguales reciban el mismo identificador y distintos reciban identificadores distintos; sus distancias numéricas no importan. Así las frecuencias caben en un vector de tamaño a lo sumo n, con acceso O(1).`),
    s('Limitaciones y cómo desarrollar una solución fiable', `La versión básica de Mo supone un arreglo estático y todas las consultas conocidas. No puedes aplicarla directamente si hay cambios entre consultas o si la siguiente depende de una respuesta anterior. Hay extensiones con una dimensión temporal, pero requieren poder aplicar y deshacer modificaciones y tienen otra complejidad.

Primero verifica agregar y quitar sin ordenar consultas, usando pequeños movimientos manuales. Después añade la ordenación y compara con un set construido para cada rango. Prueba todos iguales, todos distintos, un solo elemento y rangos repetidos. Para sumas con cambios puntuales, Fenwick suele ser más sencillo; Mo resulta interesante cuando la respuesta depende de frecuencias y no se combina mediante un resumen pequeño.`),
  ], [
    p('colores','Colores distintos en intervalos','Entrada: n q (1≤n,q≤50000), n valores entre -10⁹ y 10⁹ y q intervalos inclusivos l r desde uno. El arreglo no cambia. Imprime cuántos valores distintos hay en cada intervalo, conservando el orden de las consultas.', ['Comprime los valores para usar un vector de frecuencias.', 'Solo cambia distintos cuando una frecuencia pasa entre cero y uno.'], 'Ordenamos consultas mediante Mo y mantenemos una ventana con frecuencias exactas. Cada movimiento actualiza la cantidad de frecuencias positivas. La ventana final coincide con cada consulta. Para B≈√n el costo es O((n+q)√n+q log q), con O(n+q) memoria.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <cmath>
using namespace std;
struct Query {
    int l, r, id;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<int> a(n);
    for (int &x : a)
        cin >> x;
    vector<int> v = a;
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());
    for (int &x : a)
        x = lower_bound(v.begin(), v.end(), x) - v.begin();
    vector<Query> qs(q);
    for (int i = 0; i < q; i++) {
        cin >> qs[i].l >> qs[i].r;
        --qs[i].l;
        --qs[i].r;
        qs[i].id = i;
    }
    int B = max(1, (int)sqrt(n));
    sort(qs.begin(), qs.end(), [&](Query x, Query y) {
        int bx = x.l / B, by = y.l / B;
        if (bx != by)
            return bx < by;
        return bx % 2 ? x.r > y.r : x.r < y.r;
    });
    vector<int> freq(v.size()), ans(q);
    int L = 0, R = -1, distinct = 0;
    auto add = [&](int i) {
        if (freq[a[i]]++ == 0)
            distinct++;
    };
    auto del = [&](int i) {
        if (--freq[a[i]] == 0)
            distinct--;
    };
    for (auto x : qs) {
        while (L > x.l)
            add(--L);
        while (R < x.r)
            add(++R);
        while (L < x.l)
            del(L++);
        while (R > x.r)
            del(R--);
        ans[x.id] = distinct;
    }
    for (int x : ans)
        cout << x << '\n';
}`, [{input:'5 3\n1 2 1 3 2\n1 3\n2 4\n4 5\n',output:'2\n3\n2\n'}, {input:'4 3\n7 7 7 7\n1 4\n2 2\n2 3\n',output:'1\n1\n1\n'}, {input:'3 3\n-1000000000 0 1000000000\n1 3\n1 1\n2 3\n',output:'3\n1\n2\n'}]),
    r('potencia','Mantener otra función de frecuencias','La respuesta de una ventana es Σ_v freq[v]². Deriva cómo cambia al agregar y al quitar una aparición de v. Calcula la respuesta en [2,2,3] y después de agregar otro 2.', ['Compara (c+1)² con c².', 'Para quitar, usa la frecuencia anterior a la eliminación.'], 'Si la frecuencia anterior es c, agregar cambia la respuesta en (c+1)²-c²=2c+1. Quitar cambia en (c-1)²-c²=-2c+1. En [2,2,3], las frecuencias son 2 y 1, así que la respuesta es 4+1=5. Agregar otro 2 aporta 2·2+1=5 y deja respuesta 10=3²+1². Ambas operaciones cuestan O(1), por lo que se pueden usar dentro de Mo sin cambiar su cota de movimientos.'),
  ]),
};
