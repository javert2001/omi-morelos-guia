import type { LessonExpansion } from '../types.ts';
import { chapter, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedOfflineExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-range-sweep': chapter(85, [
    s("Contar puntos sin construir una tabla enorme", "Tenemos los puntos (1,1), (2,3), (3,2) y otra copia de (2,3). Queremos responder cuántos quedan dentro de varios rectángulos. Comparar cada punto con cada consulta cuesta O(nq). Una estructura bidimensional puede resolverlo, pero aquí sabemos todas las consultas de antemano y podemos aprovechar su orden.\n\nEmpezaremos por F(X,Y): cuántos puntos cumplen x≤X e y≤Y. Ordenaremos por el límite X y mantendremos los valores y de los puntos que ya cumplan la primera condición. Este recorrido se llama barrido. Como procesa consultas en otro orden, guarda sus identificadores para devolver cada respuesta a su lugar."),
    s("El conjunto que debe estar disponible", "Ordena puntos por x y preguntas por X. Antes de responder una pregunta, avanza por los puntos mientras x≤X y agrega uno en el Fenwick correspondiente a cada y. Después consulta el prefijo hasta Y.\n\nEn ese momento, Fenwick contiene todos y solo los puntos que cumplen x≤X. Esa es la condición que debe mantener el barrido. El prefijo añade la segunda condición, y≤Y. Una igualdad en la frontera cuenta; usar x<X excluiría puntos válidos. Dos puntos coincidentes también cuentan dos veces, así que cada copia realiza su propio incremento."),
    s("El límite horizontal avanza; el vertical puede variar", "Con X=1 solo entró (1,1), por lo que F(1,3)=1. Cuando X pasa a dos, agregamos las dos copias de (2,3). Ahora F(2,2)=1, pero F(2,3)=3. Al llegar a X=3, entra (3,2) y F(3,2)=2.\n\nY puede aumentar o disminuir entre preguntas: solo cambia qué prefijo consultamos, no qué puntos guardamos. X sí avanza siempre, porque ordenamos las preguntas. De ese modo cada punto entra una sola vez y no necesitamos retirarlo para responder una consulta con un límite horizontal anterior."),
    s("Un rectángulo produce cuatro preguntas", "El rectángulo inclusivo [x1,x2]×[y1,y2] se obtiene como F(x2,y2)−F(x1−1,y2)−F(x2,y1−1)+F(x1−1,y1−1). Creamos cuatro eventos con el identificador de la consulta y signos +1,−1,−1,+1. Al resolverlos, acumulamos sus contribuciones en la misma respuesta.\n\nEn [2,3]×[2,3], los cuatro prefijos valen 4,1,1,1. La respuesta es 4−1−1+1=3: las dos copias de (2,3) y el punto (3,2). Restar uno funciona porque las coordenadas son enteras. Con coordenadas reales representaríamos fronteras estrictas mediante el orden de eventos."),
    s("Insertar una coordenada no es buscar un límite", "Ordena los valores y de los puntos y elimina repetidos. Para insertar un punto, lower_bound encuentra su coordenada exacta; suma uno a ese índice para usar Fenwick desde la posición uno. Para consultar y≤Y, usa upper_bound(Y): devuelve cuántas coordenadas quedan dentro del límite.\n\nSi la lista es [1,3,8] y Y=5, ese tamaño es dos; consultamos las posiciones de uno y tres. Y no necesita aparecer en la lista. En Y=3 también deben entrar dos coordenadas. Usar lower_bound como tamaño del prefijo dejaría fuera el propio tres y cambiaría una frontera inclusiva por una estricta."),
    s("El mismo recorrido para cruces de segmentos", "Para segmentos verticales y horizontales, barre por altura y. Un vertical situado en x entra en su extremo inferior y sale en el superior. Mientras está activo, agrega uno en su x. Un horizontal consulta la suma entre sus extremos horizontales.\n\nSi tocar un extremo cuenta, en una altura compartida procesa entradas, consultas y salidas. Por ejemplo, el vertical x=2, y entre uno y cinco, toca al horizontal de altura cinco que va de x=0 a x=3. Retirarlo antes de consultar perdería ese contacto. El modelo cuenta pares vertical–horizontal; superposiciones paralelas y segmentos inclinados requieren otro tratamiento."),
    s("Por qué cuenta exactamente lo pedido", "Como los límites X están ordenados, un solo puntero incorpora todos los puntos necesarios sin incluir ninguno que supere el límite actual. El prefijo Fenwick selecciona entre esos puntos exactamente los que cumplen y≤Y. Por tanto, cada F es correcto. Los cuatro signos dejan coeficiente uno en el rectángulo y cero fuera de él.\n\nCon n puntos y q rectángulos procesamos n inserciones y 4q eventos. Ordenar cuesta O((n+q) log(n+q)); cada operación de Fenwick, O(log n). La memoria es O(n+q). No hace falta reservar una matriz de combinaciones de coordenadas."),
    s("Cuándo el orden original sí importa", "Si la siguiente consulta se calcula usando la respuesta anterior, todavía no conoces sus límites y no puedes ordenar todos los eventos al inicio. También debes revisar el modelo si los puntos aparecen o desaparecen durante el tiempo original del problema. Reordenar solo es válido cuando conserva las consultas y sus datos.\n\nEl ejercicio limita las coordenadas a [−10⁹,10⁹]; restar uno en long long no desborda. Comprueba puntos sobre los cuatro bordes, puntos repetidos, coordenadas negativas y rectángulos vacíos de puntos. Un recorrido directo sobre todos los puntos sirve para comparar respuestas en instancias pequeñas."),
  ], [
    p('parcelas',"Contar puntos en parcelas","Recibes n puntos y q rectángulos con coordenadas enteras. Cuenta los puntos de cada rectángulo, incluyendo sus bordes. Si varias entradas representan el mismo punto, cada una cuenta por separado.\n\nEntrada: n q, los n pares x y y los q rectángulos x1 y1 x2 y2. Límites: 1≤n,q≤100000; coordenadas entre −10⁹ y 10⁹; x1≤x2, y1≤y2. Imprime las respuestas en el orden de las consultas.", ["Escribe cada rectángulo como una combinación de cuatro prefijos F(X,Y).", "Al ordenar por X, incorpora puntos mientras x≤X. Para la frontera vertical inclusiva usa upper_bound(Y)."], "Cada rectángulo genera cuatro eventos con signos. Ordenamos esos eventos por X e insertamos en Fenwick los puntos cuya x ya alcanza el límite. El prefijo hasta Y cuenta los que cumplen ambas desigualdades.\n\nMultiplica cada resultado por su signo y acumúlalo en el identificador de la consulta. La inclusión y exclusión conserva únicamente los puntos interiores. Tiempo O((n+q) log(n+q)) y memoria O(n+q).", String.raw`#include <iostream>
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
    r('empates',"Qué cambia al incluir los extremos","Un segmento vertical une (4,2) con (4,6). Tres horizontales van de x=1 a x=7 a alturas 2, 4 y 6. Cuenta los cruces si el vertical incluye sus extremos y si excluye ambos. Indica el orden de entradas, salidas y consultas que corresponde a cada caso.", ["Los horizontales de alturas dos y seis coinciden con el inicio y final del vertical.", "Decide si el vertical debe estar activo en cada consulta antes de elegir el desempate."], "Si los extremos se incluyen, los tres horizontales cruzan el vertical. Procesa entradas, consultas y salidas: el segmento ya participa al comenzar y todavía participa al terminar.\n\nSi ambos extremos se excluyen, solo cuenta el horizontal de altura cuatro. Procesa salidas, consultas y entradas: al terminar ya fue retirado y al comenzar aún no se agregó. Los desempates dependen de qué puntos pertenecen al segmento."),
  ]),

  'usaco-plat-dc-srq': chapter(90, [
    s("Componer un intervalo de funciones", "Una fila contiene funciones que se aplican de izquierda a derecha. Queremos preparar la fila para consultar cualquier intervalo sin ejecutar sus funciones una por una. Con sumas podríamos restar prefijos; con funciones no siempre existe una operación que deshaga un prefijo. Una función constante f(x)=7, por ejemplo, pierde el argumento original.\n\nLa composición sí es asociativa: podemos agrupar funciones consecutivas sin cambiar el orden en que actúan. Aprovecharemos esa propiedad en una tabla disjunta para datos fijos. Durante la explicación usamos posiciones desde cero e intervalos inclusivos [l,r]. No admitiremos actualizaciones sobre la fila preparada."),
    s("Dos resúmenes alrededor de un corte", "Divide [L,R] entre M y M+1. En la mitad izquierda prepara los sufijos que terminan en M: A[i]⊗…⊗A[M]. En la derecha prepara los prefijos que empiezan en M+1: A[M+1]⊗…⊗A[j].\n\nSi l≤M<r, la respuesta es sufijo[l]⊗prefijo[r]. Son dos fragmentos consecutivos, separados y con unión exacta [l,r]. Si la consulta cabe entera en una mitad, repite el procedimiento allí. Cualquier intervalo de más de un elemento termina cruzando un corte; un intervalo de una posición devuelve directamente su elemento."),
    s("El orden dentro de cada resumen", "Construye sufijos de derecha a izquierda con suf[i]=A[i]⊗suf[i+1]. Construye prefijos de izquierda a derecha con pre[i]=pre[i−1]⊗A[i]. Aunque ambos recorridos agreguen un elemento, lo agregan en extremos distintos y no debes intercambiar los operandos.\n\nPara f(x)=2x+1 y g(x)=3x, aplicar f y luego g da 6x+3. Invertirlas da 6x+1. Representamos una función afín como (a,b) y definimos combinar(f,g)=g∘f. Si f=(a,b) y g=(c,d), el resultado es (c·a,c·b+d). Así el orden del arreglo coincide con el orden de aplicación."),
    s("Elegir el corte mediante los índices", "El nivel k contiene bloques de longitud 2^(k+1), cada uno dividido en mitades de longitud 2^k. Su fila guarda los sufijos izquierdos y prefijos derechos de esos bloques. Preparar una fila cuesta O(n), y necesitamos O(log n) filas.\n\nPara l≠r, busca el bit más significativo de l XOR r y llama k a su posición. Los extremos coinciden en los bits superiores y difieren en k: están en el mismo bloque, pero a lados opuestos de su corte. Por eso tabla[k][l]⊗tabla[k][r] responde directamente. No tenemos que descender buscando el corte durante cada consulta."),
    s("Dos consultas y el caso de una posición", "Con ocho elementos, [2,6] tiene extremos binarios 010 y 110. Su XOR es 100, así que k=2. El bloque abarca las ocho posiciones y corta entre tres y cuatro. Combinamos el sufijo A[2]⊗A[3] con el prefijo A[4]⊗A[5]⊗A[6].\n\nPara [4,5], el XOR es 001 y usamos k=0, un bloque de dos elementos. En [5,5], el XOR vale cero y no existe un bit principal. Devuelve A[5] antes de calcularlo. Algunas instrucciones de C++ para contar ceros iniciales no admiten cero; tratar el caso unitario evita ese uso inválido."),
    s("Por qué no se pueden repetir partes", "Una tabla de mínimos puede usar dos bloques superpuestos porque repetir un elemento no cambia el mínimo: min(x,x)=x. Esa propiedad se llama idempotencia. La suma y la composición no la tienen.\n\nPara sumar [1,2,3], los bloques [1,2] y [2,3] darían ocho, no seis: repiten el dos. En la tabla disjunta, los fragmentos quedan a lados opuestos de un corte y nunca comparten posiciones. Eso permite trabajar solo con asociatividad. No necesitamos inversas, conmutatividad ni idempotencia, aunque cada combinación debe respetar el orden original."),
    s("Justificación y costo de la tabla", "Cada sufijo se construye agregando el siguiente elemento por la izquierda; cada prefijo, por la derecha. Si el resumen anterior era correcto, la asociatividad garantiza que el nuevo también representa su intervalo. El bit principal selecciona el nivel donde los dos resúmenes cubren la consulta exactamente una vez.\n\nLa preparación ocupa O(n log n) tiempo y memoria, y cada consulta hace O(1) combinaciones. Estas cotas suponen resúmenes y combinaciones de tamaño constante. Los pares afines y las matrices de dimensión fija cumplen esa condición. Concatenar cadenas ayuda a ver el orden, pero copiar textos de longitud variable tiene otro costo."),
    s("Otra forma de repartir consultas conocidas", "Si ya conoces todas las preguntas, puedes resolverlas por divide y vencerás: en cada bloque contesta las que cruzan el centro y reparte las demás entre sus mitades. Una versión directa tarda O((n+q) log n) y puede liberar resúmenes después de usarlos. La tabla disjunta conserva más información para contestar preguntas posteriores inmediatamente.\n\nEl ejercicio calcula coeficientes módulo 1000000007 e incluye funciones constantes, que no tienen inversa. Revisa tamaños que no sean potencias de dos: el último bloque puede estar incompleto y sus bucles deben detenerse en n. Comprueba también consultas unitarias y funciones cuyo orden cambie el resultado."),
  ], [
    p('transformaciones',"Aplicar un tramo de transformaciones","Cada función de una fila tiene la forma f(x)=a·x+b módulo 1000000007. Una consulta l r x pide aplicar f[l], después f[l+1] y así hasta f[r], empezando con x. Las posiciones se numeran desde uno.\n\nEntrada: n q, n pares a b y q consultas. Límites: 1≤n,q≤100000; coeficientes y argumentos entre 0 y 1000000006. Imprime el resultado de cada consulta.", ["Deriva primero qué par representa aplicar una función y después otra; el orden importa.", "Convierte l y r a índices desde cero y usa el bit principal de su XOR. Trata por separado l=r."], "Prepara, para cada bloque binario, sufijos de su mitad izquierda y prefijos de la derecha. El bit principal de los extremos identifica un bloque cuyo corte separa la consulta. Combina sus dos resúmenes en orden de aplicación.\n\nLa composición afín es asociativa y sus pares ocupan espacio constante. Preparar la tabla cuesta O(n log n), cada consulta O(1) y la memoria O(n log n). No necesitamos invertir funciones, así que los coeficientes cero también son válidos.", String.raw`#include <iostream>
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
    r('sin-inversa',"Funciones que pierden información","La fila contiene f0(x)=2x+1, f1(x)=0 y f2(x)=x+5. Con índices desde cero, aplica el intervalo [1,2] al argumento ocho. Explica por qué una estructura basada solo en composiciones de prefijos no puede usar una división general para quitar las funciones que sobran.", ["¿Qué queda del argumento después de aplicar f1?", "Una composición que produce siempre lo mismo no permite reconstruir la entrada."], "f1 transforma ocho en cero y f2 transforma cero en cinco. El intervalo devuelve cinco para cualquier argumento inicial.\n\nLas composiciones de prefijos pueden contener funciones constantes, sin inversa. Por eso no existe una operación general equivalente a restar un prefijo de sumas. La tabla disjunta prepara directamente los fragmentos necesarios: aquí combina f1 con f2 y obtiene la función constante cinco."),
  ]),

  'usaco-plat-sqrt': chapter(90, [
    s("Sumar grupos completos y revisar las orillas", "En [1,2,3,4,5,6,7,8,9], guarda sumas de bloques de tres: 6,15,24. Para consultar [1,7] con índices desde cero, suma las posiciones de valores dos y tres, usa el bloque completo de suma quince y agrega siete y ocho. Obtienes 35 sin revisar cada valor del bloque central.\n\nCon bloques de tamaño B, una consulta recorre como máximo dos orillas de B elementos y unos n/B bloques completos. Su costo es O(B+n/B). Elegir B cerca de √n equilibra ambos trabajos. Si cambian las operaciones o su frecuencia, conviene volver a calcular ese equilibrio."),
    s("Qué se modifica al cambiar una posición", "Si A[i] cambia a v, la suma de su bloque aumenta v−A[i]. Guardamos ese nuevo valor y ajustamos un solo resumen, así que la actualización cuesta O(1). No necesitamos volver a recorrer todo el bloque para sumas.\n\nCon otros resúmenes puede ser distinto. Si guardamos el mínimo y reemplazamos precisamente el elemento mínimo por uno mayor, quizá debamos revisar los demás valores del bloque. La división en bloques organiza los datos, pero no garantiza por sí sola el mismo costo para cualquier pregunta. Primero determina cómo reconstruir el resumen afectado."),
    s("Cuando no basta combinar resúmenes pequeños", "Para contar valores distintos, no podemos sumar los distintos de dos bloques: el mismo valor podría aparecer en ambos. Unir conjuntos completos en cada consulta puede ser costoso. Mo evita esa combinación y mantiene una sola ventana, con frecuencias de los valores que contiene.\n\nGuarda freq[v] y distintos. Al agregar v, aumenta distintos solo si su frecuencia era cero; después incrementa freq[v]. Al quitarlo, disminuye su frecuencia y reduce distintos solo si quedó en cero. Así una segunda copia no crea un valor distinto ni quitar una copia elimina las demás."),
    s("El orden de las consultas mueve menos la ventana", "Agrupa consultas por l/B y, dentro de cada grupo, ordénalas por r. Puedes alternar el sentido de r entre bloques para evitar recorridos completos de regreso. Conserva el índice original de cada pregunta.\n\nEmpieza con una ventana vacía L=0,R=−1. Para llegar a [l,r], agrega posiciones mientras debas ampliar por izquierda o derecha y quita las que sobren en los extremos. Cada paso modifica exactamente una frecuencia. Expandir antes de contraer resulta una convención sencilla para no retirar posiciones que no estaban dentro; mantén la misma interpretación inclusiva de ambos extremos."),
    s("Un cambio de ventana con repeticiones", "En [1,2,1,3,2], la ventana [0,2] contiene dos unos y un dos: hay dos valores distintos. Para llegar a [1,3], agrega primero el tres, que aumenta la respuesta a tres. Quita el primer uno; todavía queda otra copia, así que la respuesta sigue en tres.\n\nPara pasar a [3,4], agrega el dos final y después quita el dos de la posición uno: queda una copia. Al quitar el uno de la posición dos, su frecuencia llega a cero y la respuesta baja a dos. La ventana final [3,2] confirma el resultado. El cambio depende de la frecuencia restante, no solo de que ocurrió una eliminación."),
    s("Elegir B contando movimientos", "En cada bloque del extremo izquierdo, el derecho recorre O(n) posiciones. Hay unos n/B bloques, de modo que suma O(n²/B) movimientos. El extremo izquierdo se mueve O(B) entre consultas del mismo bloque y aporta O(qB). Debemos añadir el costo de ordenar las q consultas.\n\nSi q es comparable con n, B≈√n da O((n+q)√n) movimientos. Para otras cantidades, B≈n/√q equilibra la expresión, ajustándolo al dominio válido. Esto supone agregar y quitar en O(1); si cuesta más, multiplica por ese costo. La cota describe toda la secuencia, no una garantía pequeña para cada consulta aislada."),
    s("La respuesta depende de la ventana, no del orden", "En todo momento freq[v] debe contar exactamente las apariciones de v entre L y R, y distintos debe contar las frecuencias positivas. Las reglas de agregar y quitar conservan esa propiedad. Cuando la ventana coincide con una consulta, su respuesta es correcta, independientemente del orden que usamos para llegar hasta ella.\n\nSi los valores pueden llegar a 10⁹, ordénalos, elimina repeticiones y reemplázalos por sus índices. Para contar igualdad solo necesitamos distinguir valores iguales de distintos; sus distancias numéricas no importan. Así las frecuencias caben en un vector de tamaño a lo sumo n y se consultan en O(1)."),
    s("Condiciones de uso y comprobaciones", "La versión básica necesita un arreglo fijo y todas las consultas disponibles al empezar. Cambios intercalados requieren otra variante, capaz de aplicar y deshacer modificaciones. Si las consultas dependen de respuestas anteriores, tampoco puedes reordenarlas directamente.\n\nAntes de ordenar, comprueba agregar y quitar moviendo una ventana a mano. Después compara el algoritmo completo con construir un conjunto por consulta en datos pequeños. Incluye valores todos iguales, todos distintos, ventanas de una posición y consultas repetidas. Para sumas con cambios puntuales, Fenwick suele ser más directo; Mo resulta útil cuando la respuesta depende de frecuencias difíciles de combinar."),
  ], [
    p('colores',"Valores distintos en una fila fija","Recibes un arreglo que no cambiará y varias consultas de intervalos inclusivos l r, numerados desde uno. Para cada intervalo, imprime cuántos valores diferentes contiene. Conserva el orden en que llegaron las preguntas.\n\nEntrada: n q, los n valores y los q intervalos. Límites: 1≤n,q≤50000; valores entre −10⁹ y 10⁹.", ["Reemplaza cada valor por su lugar en una lista ordenada sin repeticiones para usar frecuencias en un vector.", "Al mover una orilla, el número de distintos solo cambia cuando una frecuencia cruza entre cero y uno."], "Ordena consultas con Mo y conserva las frecuencias de la ventana actual. Cada movimiento agrega o quita una posición y actualiza el número de frecuencias positivas. Cuando los extremos coinciden con una consulta, guarda esa cantidad en su índice original.\n\nCon B≈√n, el tiempo es O((n+q)√n+q log q), además de la compresión, y la memoria O(n+q). La fila debe permanecer fija para que mover las orillas sea suficiente.", String.raw`#include <iostream>
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
    r('potencia',"La suma de cuadrados de las frecuencias","Ahora una ventana debe responder Σ_v freq[v]². Calcula cuánto cambia esa respuesta al agregar y al quitar una aparición de v. Usa la regla para resolver [2,2,3] y después agregar otro dos.", ["Llama c a la frecuencia antes del cambio y resta c² del nuevo cuadrado.", "Al quitar una aparición, la nueva frecuencia es c−1."], "Agregar una aparición cambia c² por (c+1)²: la diferencia es 2c+1. Quitarla cambia c² por (c−1)²: la diferencia es −2c+1. Usa siempre la frecuencia anterior al calcular esos incrementos.\n\nEn [2,2,3], la respuesta es 2²+1²=5. Agregar otro dos, cuya frecuencia era dos, aporta cinco y deja diez: 3²+1². Ambas actualizaciones cuestan O(1), así que pueden sustituir el contador de distintos dentro de Mo sin cambiar la cota de movimientos."),
  ]),
};
