import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedGeometryExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-geo-pri': extend('usaco-plat-geo-pri',90,[
    s("Comprobar cruces y contactos entre segmentos","Para AB y CD calcula o1=orient(A,B,C), o2=orient(A,B,D), o3=orient(C,D,A) y o4=orient(C,D,B). Hay un cruce interior si o1 y o2 tienen signos estrictamente opuestos y también o3 y o4. Compara signos directamente; multiplicar orientaciones puede desbordar aunque cada una quepa en el tipo.\n\nSi alguna orientación es cero, comprueba si el punto correspondiente está en la caja del otro segmento: min(Ax,Bx)≤Px≤max(Ax,Bx), y lo mismo para y. Colinealidad más pertenencia a esa caja cubren contactos, superposiciones e incluso segmentos de longitud cero."),
    s("Encontrar el punto más cercano de un segmento","Sea v=B−A. La proyección de P sobre la recta AB es A+t·v, donde t=((P−A)·v)/(v·v). Para obtener el punto más cercano del segmento, limita t a [0,1]: antes de A eliges A; después de B eliges B. Si A=B, el segmento es un punto y no debes dividir entre cero.\n\nCon A=(0,0), B=(2,0) y P=(3,4), t=1.5. La proyección en la recta es (3,0), pero queda fuera del segmento. Su punto más cercano es B y la distancia es √17, no 4."),
    s("Sumar áreas sin calcular ángulos","El doble del área de un triángulo es |orient(A,B,C)|. Para un polígono simple con vértices en orden, suma xi·y(i+1)−yi·x(i+1), incluyendo el último con el primero. El valor absoluto de esa suma es el doble del área; el signo indica el sentido del recorrido.\n\nEsta fórmula permite conservar resultados enteros cuando las coordenadas son enteras. Si el ejercicio pide el doble del área, no necesitas dividir ni redondear. Ordenar los puntos de cualquier manera no sirve: deben recorrer el borde del polígono."),
    s("Comprobar el tamaño de los números","Con coordenadas entre −10⁹ y 10⁹, las diferencias tienen valor absoluto≤2·10⁹ y una orientación queda acotada por 8·10¹⁸, dentro de long long. Haz también las multiplicaciones en ese tipo; convertir después de multiplicar en int no repara un desbordamiento. Sumar muchas áreas requiere revisar otra cota.\n\nCon coordenadas reales necesitas una política de tolerancias adecuada a su escala. Un epsilon arbitrario no vuelve exactas todas las comparaciones. Cuando el enunciado da enteros y las cotas caben, puedes conservar signos exactos para orientación e intersección."),
  ],[
    p('interseccion',"Intersección de segmentos cerrados","Lee q (1≤q≤100000) y q líneas ax ay bx by cx cy dx dy. Todas las coordenadas son enteras entre −10⁹ y 10⁹. Para cada línea imprime SI si AB y CD comparten algún punto, incluidos contactos en extremos y superposiciones; en otro caso imprime NO.", ["Calcula las cuatro orientaciones y comprueba pares de signos estrictamente opuestos sin multiplicarlos.", "Cuando una orientación valga cero, revisa si el punto está dentro de la caja del segmento correspondiente."], "Si los extremos de cada segmento quedan a lados opuestos de la recta del otro, hay un cruce interior. Los demás contactos posibles requieren colinealidad de algún extremo y pertenencia a la caja del otro segmento. Estas pruebas incluyen extremos compartidos, superposiciones y segmentos que son puntos. Cada consulta necesita O(1) operaciones; long long cubre las orientaciones dentro de las cotas dadas.", String.raw`#include <iostream>
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
    r('proyeccion',"Proyección en una recta y en un segmento","Para A=(0,0), B=(2,0) y P=(3,4), calcula la proyección de P en la recta AB, el punto más cercano del segmento AB y el doble del área de ABP.", ["El vector v=B−A es (2,0), así que t=((P−A)·v)/(v·v)=6/4.", "La proyección de la recta usa ese t; la del segmento debe limitarlo al intervalo [0,1]."], "Obtienes t=1.5 y la proyección (3,0), cuya distancia a P es 4. Como t>1, ese punto queda fuera del segmento. Para el segmento utiliza t=1 y obtienes B=(2,0), a distancia √17. Por otra parte, (2,0)×(3,4)=8, así que el doble del área es 8 y el área es 4."),
  ]),

  'usaco-plat-sweep-line': extend('usaco-plat-sweep-line',105,[
    s("Guardar espacios entre coordenadas","Ordena todas las coordenadas y y elimina repetidas. Una hoja i del árbol representa [Y[i],Y[i+1]), cuya longitud real es Y[i+1]−Y[i]. La última coordenada aislada no necesita hoja. Comprimir coordenadas conserva su orden, no las distancias.\n\nCada nodo guarda un contador de coberturas completas y una longitud cubierta. El contador registra actualizaciones que se detuvieron exactamente en ese nodo. No representa por sí solo cuántos rectángulos cubren cada punto: los hijos conservan las coberturas parciales."),
    s("Recalcular la unión después de un evento","Si el contador de un nodo es positivo, todo su segmento está cubierto y su longitud es Y[R+1]−Y[L]. Si el contador es cero, una hoja vale cero y un nodo interno suma las longitudes de sus hijos. No borres los datos de los hijos cuando el padre quede completamente cubierto: los necesitarás al retirar esa cobertura.\n\nPara actualizar, ignora nodos disjuntos; en cobertura total modifica el contador; en cobertura parcial baja a los hijos. Recalcula al regresar. Las altas y bajas de un rectángulo deben afectar exactamente al mismo intervalo."),
    s("Seguir un solapamiento al quitar cobertura","Los intervalos [0,5) y [2,8) cubren longitud 8, aunque sus longitudes individuales suman 11. Al retirar [0,5), sigue cubierto [2,8), de longitud 6. Poner a cero directamente el tramo retirado borraría parte de esa segunda cobertura.\n\nLos contadores evitan ese error: una cobertura completa puede ocultar temporalmente la información de los hijos, pero no la destruye. Por inducción, cada nodo conserva la longitud de su unión; por tanto, la raíz entrega la longitud vertical que necesita el barrido."),
    s("Justificar el área y elegir tipos numéricos","Dentro de cada franja, la unión vertical es constante. Su longitud multiplicada por el ancho da exactamente el área cubierta allí. Las franjas son disjuntas y cubren todos los rectángulos, así que sus áreas se suman sin duplicar regiones.\n\nUsa long long tanto para las longitudes como para el producto por el ancho, y revisa las cotas totales del enunciado. Los rectángulos de ancho o alto cero aportan cero y puedes omitirlos. Este procedimiento supone lados paralelos a los ejes."),
  ],[
    p('union-area',"Área total de varios huertos","Lee n (1≤n≤20000) y n rectángulos x1 y1 x2 y2. Sus coordenadas enteras están entre −10⁶ y 10⁶, con x1≤x2 e y1≤y2. Imprime el área cubierta por al menos uno, contando una sola vez las superposiciones. Un rectángulo de ancho o alto cero aporta cero.", ["Convierte cada borde vertical en un evento y conserva la unión de intervalos y activos.", "Las hojas del árbol representan espacios entre coordenadas consecutivas y guardan sus longitudes reales."], "Ordena los eventos por x. Antes de cada grupo suma el ancho recorrido por la longitud cubierta actual. Después actualiza los contadores de los intervalos que empiezan o terminan. Cada nodo completamente cubierto aporta toda su longitud; en caso contrario combina a sus hijos. Así la raíz mantiene la unión vertical y cada franja aporta su área exacta. El tiempo total es O(n log n).", String.raw`#include <iostream>
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
    r('longitud-no-indices',"Franjas con alturas diferentes","Calcula por franjas la unión de [0,2]×[0,100] y [1,3]×[90,110]. Después explica por qué no bastaría contar cuántos intervalos comprimidos están cubiertos.", ["Separa las franjas x en [0,1), [1,2) y [2,3).", "En ellas, la unión vertical mide 100, 110 y 20."], "Las tres franjas tienen ancho 1 y aportan 100+110+20=230. También puedes verificarlo con las áreas individuales y la intersección: 200+40−10=230. Las coordenadas verticales son [0,90,100,110], con espacios de longitudes 90, 10 y 10. Contar cada espacio como una unidad daría el mismo peso a regiones de tamaños distintos."),
  ]),

  'usaco-plat-convex-hull': extend('usaco-plat-convex-hull',90,[
    s("Completar y unir las cadenas","Ejecuta el mismo procedimiento en orden decreciente para obtener la cadena superior. Al unirlas, omite el último punto de cada cadena para no repetir los extremos compartidos. Las esquinas resultantes recorren el borde convexo.\n\nSi la salida exige todos los puntos del borde, cambia la eliminación a orient<0 para conservar colineales. Trata aparte el caso donde todos están alineados: de lo contrario, las dos cadenas podrían listar esos puntos dos veces. La desigualdad elegida debe corresponder a la salida pedida."),
    s("Por qué una eliminación es segura","En la cadena inferior, un giro horario o recto coloca b por encima de la conexión a→p o sobre ella. Por eso b no puede ser una esquina inferior necesaria entre esos puntos. Los puntos futuros, procesados en orden lexicográfico, no vuelven indispensable esa esquina descartada.\n\nDespués de cada inserción, la cadena gira en el sentido exigido y todos los puntos procesados quedan sobre sus segmentos o por encima. La superior tiene la propiedad simétrica. Juntas encierran todos los puntos, y las esquinas retenidas son extremas."),
    s("Seguir el cuadrado y calcular su área","Con (0,0),(1,0),(1,1),(2,0),(2,2),(0,2), la envolvente conserva (0,0),(2,0),(2,2),(0,2). El punto (1,0) está sobre un lado y (1,1) en el interior; ninguno es una esquina.\n\nPara obtener el doble del área, suma xi·y(i+1)−yi·x(i+1) a lo largo del borde y toma el valor absoluto. Aquí da 8, correspondiente a área 4. Un borde de uno o dos puntos tiene área cero. Para el perímetro, en cambio, sumarías las distancias entre esquinas consecutivas."),
    s("Acotar trabajo y aritmética","Ordenar cuesta O(n log n). En cada cadena, un punto entra una vez y puede salir una vez; por eso todos los while juntos cuestan O(n), aunque una inserción retire varios puntos. La memoria es O(n).\n\nLas orientaciones y la suma del área deben caber en el tipo elegido. Para las cotas del ejercicio, n≤100000 y coordenadas entre −10⁶ y 10⁶, long long basta. Con cotas mayores revisa también la suma de productos, no solamente un producto aislado."),
  ],[
    p('hull-area',"Doble del área de una envolvente","Lee n (1≤n≤100000) y n puntos enteros con coordenadas entre −10⁶ y 10⁶. Puede haber puntos repetidos. Imprime el doble del área de su envolvente convexa. Si solo queda uno o dos puntos, imprime 0.", ["Ordena, elimina duplicados y construye las dos cadenas retirando giros que no sean antihorarios.", "Recorre las esquinas resultantes con la fórmula del cordón y toma el valor absoluto."], "Construye cada cadena retirando su último punto mientras el producto cruzado sea≤0. Une las cadenas sin repetir sus extremos y suma los productos cruzados de parejas consecutivas del borde. La construcción conserva solo las esquinas extremas y la suma entrega el doble del área sin redondeo. Ordenar domina el tiempo O(n log n); las pilas ocupan O(n) memoria.", String.raw`#include <iostream>
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
    r('colineales',"Esquinas frente a todos los puntos del borde","Tienes (0,0),(1,0),(2,0),(2,1),(0,1). ¿Cuántos puntos devuelve una envolvente de solo esquinas? ¿Cuántos devuelve si deben aparecer todos los puntos de entrada del borde? Relaciona la diferencia con la condición de eliminación.", ["El punto (1,0) está entre los extremos de un lado recto.", "El producto cruzado de tres puntos de ese lado vale cero."], "La lista de esquinas tiene cuatro puntos y omite (1,0). La lista de todo el borde tiene cinco. Para esquinas retira con producto≤0; para conservar colineales, retira solo con producto<0. En la segunda política debes evitar duplicados al unir las cadenas y tratar aparte el caso completamente colineal. La desigualdad expresa una decisión de la especificación."),
  ]),
};
