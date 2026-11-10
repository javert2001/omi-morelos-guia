import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedGeometryExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-geo-pri': extend('usaco-plat-geo-pri',90,[
    s('Notación vectorial que elimina casos de pendiente',`Un punto P=(x,y) también puede representar un vector desde el origen. Restar B-A produce el desplazamiento de A a B. El producto punto u·v=ux·vx+uy·vy mide cuánto apuntan en la misma dirección: es positivo para ángulo agudo, cero para perpendicularidad y negativo para ángulo obtuso. La longitud al cuadrado es u·u; comparar longitudes al cuadrado evita raíces y mantiene aritmética entera.

El producto cruzado bidimensional u×v=ux·vy-uy·vx es un número con signo. Su valor absoluto es el área del paralelogramo formado por ambos vectores. Para orientar A,B,C usa (B-A)×(C-A), no A×B salvo que el tercer punto sea el origen. Así la respuesta no cambia cuando trasladas toda la figura.`),
    s('Intersección inclusiva de segmentos: todos los casos',`Para segmentos AB y CD, calcula o1=orient(A,B,C), o2=orient(A,B,D), o3=orient(C,D,A) y o4=orient(C,D,B). Si los signos de o1 y o2 son estrictamente opuestos y también los de o3 y o4, hay un cruce interior. No multipliques o1·o2 para comprobarlo: el producto puede desbordarse aunque cada orientación quepa en long long.

Quedan los contactos y las superposiciones colineales. Si una orientación es cero, comprueba si el punto correspondiente pertenece a la caja delimitadora del segmento: min(Ax,Bx)≤Px≤max(Ax,Bx), y lo mismo para y. Colinealidad más esas dos desigualdades equivalen a pertenencia al segmento cerrado. Este procedimiento también maneja segmentos degenerados de longitud cero, que son puntos.`),
    s('Áreas, proyecciones y distancia a un segmento',`El doble del área de un triángulo ABC es |(B-A)×(C-A)|. Para un polígono simple ordenado, el doble del área firmada es la suma de xi·y(i+1)-yi·x(i+1), cerrando el último con el primero. El signo depende de la orientación del recorrido; usa valor absoluto cuando piden área.

Para proyectar P sobre la recta AB, define v=B-A y t=((P-A)·v)/(v·v). La proyección es A+t·v. Para el segmento limita t al intervalo [0,1]; si t<0 el punto más cercano es A, y si t>1 es B. Si A=B no puedes dividir por v·v=0: la distancia buscada es simplemente la distancia a A. Esta derivación muestra por qué distancia a recta y distancia a segmento son problemas diferentes.`),
    s('Aritmética exacta, hipótesis y pruebas adversarias',`Antes de elegir un tipo entero, acota las diferencias y los productos. Con coordenadas entre -10⁹ y 10⁹, cada diferencia tiene valor absoluto≤2·10⁹ y una orientación tiene valor absoluto≤8·10¹⁸, dentro de long long. Si el límite aumenta, esa garantía desaparece. Sumar muchas áreas requiere una cota adicional; no basta verificar cada producto por separado.

Con coordenadas reales, un epsilon fijo debe elegirse según la escala y no convierte automáticamente una prueba inestable en exacta. En problemas enteros prefiere signos exactos. Prueba segmentos verticales, horizontales, puntos repetidos, contacto en un extremo, segmentos colineales separados y coordenadas negativas. La intersección de las cajas delimitadoras por sí sola no prueba que los segmentos se crucen: solo descarta algunos casos imposibles. El algoritmo de intersección usa O(1) tiempo y memoria: la dificultad está en cubrir correctamente todos los casos, no en su complejidad.`),
  ],[
    p('interseccion','¿Se tocan dos segmentos?','Entrada: q (1≤q≤100000) y q líneas con ax ay bx by cx cy dx dy. Las coordenadas son enteras entre -10⁹ y 10⁹. Imprime SI si los segmentos cerrados AB y CD comparten algún punto, incluso un extremo o una superposición, y NO en otro caso.', ['Primero comprueba cruces de signos estrictos.', 'Si una orientación es cero, verifica pertenencia a la caja del segmento.'], 'Un cruce interior exige que cada segmento tenga extremos a lados opuestos de la recta del otro. Los casos de orientación cero se resuelven con pertenencia inclusiva al segmento. Así se cubren cruces, contactos, superposiciones y segmentos degenerados.', String.raw`#include <iostream>
#include <algorithm>
using namespace std;
struct P {
    long long x, y;
};
long long cross(P a, P b, P c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
int sign(long long x) { return (x > 0) - (x < 0); }
bool on(P a, P b, P p) {
    return cross(a, b, p) == 0 && min(a.x, b.x) <= p.x && p.x <= max(a.x, b.x) &&
           min(a.y, b.y) <= p.y && p.y <= max(a.y, b.y);
}
bool hit(P a, P b, P c, P d) {
    auto x = cross(a, b, c), y = cross(a, b, d), z = cross(c, d, a), w = cross(c, d, b);
    if (sign(x) * sign(y) < 0 && sign(z) * sign(w) < 0)
        return true;
    return (!x && on(a, b, c)) || (!y && on(a, b, d)) || (!z && on(c, d, a)) ||
           (!w && on(c, d, b));
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    while (q--) {
        P a, b, c, d;
        cin >> a.x >> a.y >> b.x >> b.y >> c.x >> c.y >> d.x >> d.y;
        cout << (hit(a, b, c, d) ? "SI" : "NO") << '\n';
    }
}`, [{input:'3\n0 0 4 4 0 4 4 0\n0 0 2 0 2 0 3 1\n0 0 1 0 2 0 3 0\n',output:'SI\nSI\nNO\n'}, {input:'2\n1 1 1 1 0 0 2 2\n1 2 1 2 0 0 2 2\n',output:'SI\nNO\n'}, {input:'2\n-1000000000 -1000000000 1000000000 1000000000 -1000000000 1000000000 1000000000 -1000000000\n0 0 5 0 2 0 7 0\n',output:'SI\nSI\n'}]),
    r('proyeccion','La recta no es el segmento','Dados A=(0,0), B=(2,0) y P=(3,4), calcula la proyección sobre la recta AB y el punto más cercano del segmento AB. Calcula también el doble del área del triángulo ABP.', ['v=(2,0), por lo que t=6/4.', 'Para el segmento, limita t a uno.'], 't=1.5 y la proyección sobre la recta es (3,0), a distancia 4 de P. Esa proyección queda fuera del segmento. Al limitar t a 1 obtenemos B=(2,0), cuya distancia a P es √17. El producto cruzado (2,0)×(3,4)=8 es el doble del área; el área del triángulo es 4. Usar la distancia a la recta daría una respuesta demasiado pequeña para el segmento.'),
  ]),

  'usaco-plat-sweep-line': extend('usaco-plat-sweep-line',105,[
    s('La integral se convierte en una suma de franjas',`Para rectángulos alineados a los ejes, las posiciones x relevantes son sus bordes verticales. Entre dos posiciones consecutivas, el conjunto de intervalos y activos no cambia. Por tanto, el área de esa franja es su ancho multiplicado por la longitud de la unión de intervalos y activos. La suma de todas las franjas da el área de la unión.

Cada rectángulo [x1,x2]×[y1,y2] genera un evento +1 en x1 y otro -1 en x2 sobre [y1,y2). Los bordes tienen área cero, así que la convención semiabierta no altera el resultado. Antes de aplicar los eventos en x, agrega longitudCubierta·(x-xAnterior): la estructura todavía representa la franja que acabas de atravesar.`),
    s('El árbol que mide longitud, no cantidad de índices',`Ordena todas las coordenadas y y elimina duplicados. Una hoja i representa el intervalo geométrico [Y[i],Y[i+1]), cuya longitud es Y[i+1]-Y[i]. No existe una hoja para la última coordenada aislada. Cada nodo guarda cobertura, el número de intervalos que cubren completamente su segmento por actualizaciones detenidas allí, y longitud, la parte de su segmento cubierta al menos una vez.

Para recalcular: si cobertura>0, longitud=Y[R+1]-Y[L]. Si cobertura=0 y es hoja, longitud=0. Si cobertura=0 y no es hoja, longitud=longitudIzquierda+longitudDerecha. Los hijos mantienen información de coberturas parciales incluso cuando el padre está completamente cubierto. No debes borrarla al agregar una cobertura global.`),
    s('Aplicar un evento y comprobar solapamientos',`Para actualizar un intervalo comprimido, ignora nodos disjuntos; si un nodo está totalmente cubierto, suma delta a su contador; si no, visita ambos hijos. Después recalcula la longitud según la regla anterior. El contador local no es la cantidad total de rectángulos que cubren cada punto: cuenta solamente actualizaciones que se detuvieron exactamente en ese nodo. Esa distinción permite que el padre cubierto oculte temporalmente las diferencias entre sus hijos.

Con intervalos [0,5) y [2,8), la longitud cubierta es 8, no 11. Al retirar [0,5), queda 6, porque [2,8) sigue activo. Un árbol que pusiera a cero el segmento retirado perdería la cobertura superpuesta. Las altas y bajas deben usar exactamente el mismo intervalo para que los contadores se compensen.`),
    s('Prueba, eventos simultáneos y límites',`Por inducción, la longitud de cada nodo es correcta: una cobertura local positiva cubre todo; sin ella, la cobertura depende de los hijos disjuntos. La raíz entrega entonces la longitud de la unión de todos los intervalos activos. En cada franja el conjunto es constante, por lo que multiplicar esa longitud por el ancho calcula exactamente su área. Las franjas no se superponen y cubren todos los rectángulos.

Los eventos con igual x pueden agruparse. También pueden procesarse uno por uno si antes de cada evento acumulas el área: entre eventos iguales el ancho es cero, así que el estado intermedio no aporta área. Con R rectángulos, ordenar y procesar cuesta O(R log R), con O(R) memoria. Usa long long para longitudes y productos. Un rectángulo de ancho o alto cero no aporta área y puede omitirse.`),
  ],[
    p('union-area','Área cubierta por huertos','Entrada: n (1≤n≤20000) y n rectángulos x1 y1 x2 y2 con coordenadas enteras entre -10⁶ y 10⁶, x1≤x2 e y1≤y2. Imprime el área de su unión, contando solapamientos una sola vez. Rectángulos degenerados aportan cero.', ['Barre los bordes x y conserva la unión activa sobre y.', 'Cada hoja mide una diferencia entre coordenadas consecutivas.'], 'El árbol mantiene la longitud cubierta mediante contadores completos y la suma de hijos cuando el contador es cero. Entre eventos esa longitud es constante; multiplicarla por el ancho de cada franja y sumar entrega el área exacta.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <functional>
using namespace std;
struct E {
    long long x, y, z;
    int d;
};
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<E> ev;
    vector<long long> ys;
    while (n--) {
        long long x, y, X, Y;
        cin >> x >> y >> X >> Y;
        if (x == X || y == Y)
            continue;
        ev.push_back({x, y, Y, 1});
        ev.push_back({X, y, Y, -1});
        ys.push_back(y);
        ys.push_back(Y);
    }
    if (ev.empty()) {
        cout << 0 << '\n';
        return 0;
    }
    sort(ys.begin(), ys.end());
    ys.erase(unique(ys.begin(), ys.end()), ys.end());
    sort(ev.begin(), ev.end(), [](E a, E b) { return a.x < b.x; });
    int m = ys.size() - 1;
    vector<int> cover(4 * m);
    vector<long long> len(4 * m);
    function<void(int, int, int, int, int, int)> update = [&](int v, int L, int R, int l,
                                                              int r, int d) {
        if (r < L || R < l)
            return;
        if (l <= L && R <= r)
            cover[v] += d;
        else {
            int M = (L + R) / 2;
            update(2 * v, L, M, l, r, d);
            update(2 * v + 1, M + 1, R, l, r, d);
        }
        if (cover[v] > 0)
            len[v] = ys[R + 1] - ys[L];
        else if (L == R)
            len[v] = 0;
        else
            len[v] = len[2 * v] + len[2 * v + 1];
    };
    long long area = 0, prev = ev[0].x;
    for (auto e : ev) {
        area += len[1] * (e.x - prev);
        prev = e.x;
        int l = lower_bound(ys.begin(), ys.end(), e.y) - ys.begin(),
            r = lower_bound(ys.begin(), ys.end(), e.z) - ys.begin() - 1;
        update(1, 0, m - 1, l, r, e.d);
    }
    cout << area << '\n';
}`, [{input:'2\n0 0 3 2\n2 1 4 4\n',output:'11\n'}, {input:'3\n0 0 5 5\n1 1 2 2\n0 0 5 5\n',output:'25\n'}, {input:'3\n0 0 1 1\n1 0 2 1\n5 5 5 8\n',output:'2\n'}]),
    r('longitud-no-indices','Un hueco grande entre coordenadas','Dos rectángulos son [0,2]×[0,100] y [1,3]×[90,110]. Calcula el área de la unión por franjas y explica por qué contar intervalos comprimidos cubiertos no basta.', ['Las franjas x son [0,1), [1,2) y [2,3).', 'Sus longitudes y cubiertas son 100,110 y 20.'], 'Las áreas de las franjas son 1·100, 1·110 y 1·20, total 230. También 200+40-10=230 por inclusión y exclusión. Las coordenadas y comprimidas son [0,90,100,110], cuyos intervalos tienen longitudes 90,10,10. Contar cada intervalo como una unidad haría iguales regiones geométricas de tamaños muy distintos y produciría un área falsa.'),
  ]),

  'usaco-plat-convex-hull': extend('usaco-plat-convex-hull',90,[
    s('Especifica la salida antes de elegir desigualdades',`Una envolvente puede pedirse como lista de esquinas extremas o como lista de todos los puntos del borde. Aquí conservaremos solamente las esquinas; si todos los puntos son colineales, quedarán sus dos extremos. Si hay un único punto distinto, la envolvente contiene ese punto. Ordena lexicográficamente por x y después y, y elimina duplicados antes de construir las cadenas.

La cadena inferior va del punto más pequeño al más grande y debe girar siempre en sentido antihorario al añadir el siguiente punto. La superior se construye recorriendo el orden inverso con la misma condición. Estos nombres se refieren a su posición geométrica; no exigen que el polígono final tenga un lado horizontal ni que los valores de x sean distintos.`),
    s('Pseudocódigo completo de la cadena monótona',`Mantén una pila H. Para cada punto p en orden creciente, mientras H tenga al menos dos puntos y cruzado(H[-2],H[-1],p)≤0, elimina H[-1]. Después agrega p. El resultado es la cadena inferior. Repite con los puntos en orden decreciente para la superior. Al unir ambas, elimina la última posición de cada cadena para no repetir los dos extremos compartidos.

El signo cero elimina puntos intermedios de un borde recto, como exige nuestra salida. Cambiar ≤0 por <0 conserva puntos colineales, pero entonces necesitas tratar especialmente el caso completamente colineal para no listarlos dos veces. Las pilas almacenan los puntos originales; no calculamos intersecciones ni pendientes, por lo que las coordenadas enteras permanecen exactas.`),
    s('Por qué retirar un punto no pierde una esquina',`Al procesar p, si los dos últimos puntos a,b y p forman un giro horario o recto en la cadena inferior, b no puede ser una esquina necesaria de esa cadena. La nueva conexión de a hacia p deja b por encima del borde inferior o sobre él. Como los puntos futuros están a la derecha en el orden lexicográfico, no pueden convertir a b en un extremo inferior indispensable entre a y p.

Mantener giros antihorarios produce una cadena convexa que sostiene a todos los puntos procesados por encima de sus segmentos. La cadena superior tiene el argumento simétrico. Su unión encierra todos los puntos y cada esquina retenida es extrema. Además, cada punto se agrega una vez y puede retirarse una vez por cadena, de modo que los bucles while cuestan O(n) en total, no O(n²).`),
    s('Una traza y aplicaciones con cuidado numérico',`Con puntos (0,0),(1,0),(1,1),(2,0),(2,2),(0,2), el orden empieza (0,0),(0,2),(1,0). Al llegar a (1,0), el punto (0,2) se retira de la cadena inferior. Los puntos (1,0) y (2,0) son colineales con (0,0), por lo que al conservar solo esquinas se elimina el intermedio. Al final la envolvente es el cuadrado de esquinas (0,0),(2,0),(2,2),(0,2); (1,1) queda interior.

Una vez ordenado el borde, puedes calcular su área con la fórmula del cordón o su perímetro sumando distancias. El ejercicio pide el doble del área para evitar decimales. Sus coordenadas se limitan a ±10⁶ y n≤100000, por lo que tanto productos cruzados como la suma de áreas caben en long long. Para conjuntos vacíos, problemas de borde inclusivo o coordenadas mayores debes revisar de nuevo las condiciones.`),
  ],[
    p('hull-area','Área de la banda convexa','Entrada: n (1≤n≤100000) y n puntos enteros con coordenadas entre -10⁶ y 10⁶; puede haber repetidos. Imprime el doble del área de su envolvente convexa. Una envolvente de uno o dos puntos tiene área cero.', ['Construye dos cadenas eliminando giros no antihorarios.', 'Aplica la fórmula del cordón a los vértices resultantes.'], 'Las cadenas monótonas conservan solo esquinas extremas y su unión forma el borde convexo. Cada punto entra y sale a lo sumo una vez de cada cadena. Ordenar domina el tiempo O(n log n); la suma de productos cruzados da el doble del área sin error de redondeo.', String.raw`#include <iostream>
#include <vector>
#include <algorithm>
#include <cstdlib>
using namespace std;
struct P {
    long long x, y;
    bool operator<(const P &o) const { return x != o.x ? x < o.x : y < o.y; }
    bool operator==(const P &o) const { return x == o.x && y == o.y; }
};
long long cross(P a, P b, P c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n;
    cin >> n;
    vector<P> a(n);
    for (auto &p : a)
        cin >> p.x >> p.y;
    sort(a.begin(), a.end());
    a.erase(unique(a.begin(), a.end()), a.end());
    n = a.size();
    if (n < 3) {
        cout << 0 << '\n';
        return 0;
    }
    vector<P> lo, hi;
    for (P p : a) {
        while (lo.size() >= 2 && cross(lo[lo.size() - 2], lo.back(), p) <= 0)
            lo.pop_back();
        lo.push_back(p);
    }
    for (int i = n - 1; i >= 0; i--) {
        P p = a[i];
        while (hi.size() >= 2 && cross(hi[hi.size() - 2], hi.back(), p) <= 0)
            hi.pop_back();
        hi.push_back(p);
    }
    lo.pop_back();
    hi.pop_back();
    lo.insert(lo.end(), hi.begin(), hi.end());
    long long area = 0;
    for (int i = 0; i < (int)lo.size(); i++) {
        P p = lo[i], q = lo[(i + 1) % lo.size()];
        area += p.x * q.y - p.y * q.x;
    }
    cout << llabs(area) << '\n';
}`, [{input:'5\n0 0\n2 0\n2 2\n0 2\n1 1\n',output:'8\n'}, {input:'4\n0 0\n1 0\n2 0\n1 0\n',output:'0\n'}, {input:'3\n0 0\n3 0\n0 2\n',output:'6\n'}]),
    r('colineales','Elegir una política para el borde','Tienes los puntos (0,0),(1,0),(2,0),(2,1),(0,1). ¿Cuántos puntos debe devolver una envolvente que pide solo esquinas? ¿Y una que pide todos los puntos de entrada sobre el borde? Explica la desigualdad del bucle.', ['El punto (1,0) está sobre un lado recto.', 'Un producto cruzado cero identifica colinealidad.'], 'Solo esquinas requiere cuatro puntos: todos salvo (1,0). La política de todos los puntos de borde requiere cinco. En la primera se retira mientras el cruzado sea ≤0; en la segunda se retira únicamente con cruzado <0 para conservar colineales. Además hay que evitar duplicaciones al juntar cadenas y tratar el conjunto completamente colineal. La desigualdad forma parte de la especificación de salida, no es un detalle intercambiable.'),
  ]),
};
