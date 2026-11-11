import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedStructuresOneExpansions: Record<string, LessonExpansion> = {
  'usaco-adv-springboards': extend('usaco-adv-springboards',90,[
    s("Cuándo una oferta reemplaza a otra","Una oferta (a,b) sirve para consultas de alcance x≤a y entrega ahorro b. La oferta (c,d) domina a (a,b) cuando c≥a y d≥b: toda consulta que aceptaba la primera también acepta la segunda y obtiene al menos el mismo ahorro. Esa comparación demuestra que puedes descartar la primera.\n\nLa regla necesita incluir todas las variables que afecten una respuesta. Si usar una oferta más lejana tuviera un costo adicional, comparar solo alcance y ahorro podría dejar de servir. También suponemos que solo se insertan ofertas: si luego borras la dominante, una oferta descartada podría volver a ser necesaria."),
    s("Mantener las ofertas útiles en un mapa","Ordena las parejas conservadas por alcance creciente. Sus ahorros deben disminuir estrictamente, pues una pareja posterior con ahorro igual o mayor dominaría a la anterior. Esa propiedad describe la frontera de opciones que todavía pueden ganar.\n\nPara insertar (a,b), busca lower_bound(a). Si existe y su ahorro≥b, rechaza la nueva pareja. Si tiene el mismo alcance y menor ahorro, elimínala. Inserta entonces (a,b) y borra hacia atrás los predecesores con ahorro≤b. Detente en el primero con ahorro>b: los anteriores tienen todavía más ahorro y no están dominados."),
    s("Responder y contar las eliminaciones","En una consulta x, lower_bound(x) devuelve la primera oferta con alcance suficiente. Las posteriores tienen menor ahorro, así que esa primera ofrece el máximo. Si no existe, responde que no hay oferta. No confundas inexistencia con cero: un ahorro negativo puede ser una respuesta válida.\n\nUna inserción puede eliminar muchas parejas, pero cada pareja insertada se elimina una sola vez. En q operaciones hay O(q) inserciones y borrados, con búsquedas e inserciones de map en O(log q). El total es O(q log q) y la memoria O(q). Esa es una cota amortizada, no un límite logarítmico para cada operación individual."),
    s("Usar la frontera dentro de un barrido","En una cuadrícula donde solo avanzas hacia coordenadas crecientes, un transporte puede ahorrar parte de la distancia caminada. Después de derivar el costo, a veces un estado se resume con una coordenada y su ahorro. Un barrido ordena una coordenada y la frontera mantiene opciones útiles respecto a la otra.\n\nNo deduzcas dominancia únicamente porque un estado tenga dos números: demuestra qué consultas admite y cómo afecta su costo. Si un transporte termina donde otro comienza y pueden encadenarse, procesa finales antes que inicios en ese punto. El ejercicio aísla la frontera para comprobar ofertas repetidas, ahorros negativos y eliminaciones múltiples antes de integrarla en una DP."),
  ],[
    p('frontera',"Mantener ofertas de alcance y ahorro","Lee q (1≤q≤100000). Una operación «1 a b» inserta una oferta de alcance a y ahorro b; «2 x» pregunta el mayor ahorro entre ofertas con a≥x. Los números tienen valor absoluto≤10⁹. Imprime el ahorro o NINGUNA si no hay oferta válida. Solo hay inserciones.", ["Ordenadas por alcance, las ofertas no dominadas tienen ahorros estrictamente decrecientes.", "El primer sucesor puede dominar la nueva oferta; la nueva puede dominar varios predecesores."], "Conserva únicamente parejas no dominadas. En una inserción, comprueba el primer alcance suficiente y elimina los predecesores que la nueva pareja mejora. La frontera queda con ahorros decrecientes, así que lower_bound(x) entrega el mejor ahorro válido. Cada pareja entra y sale a lo sumo una vez: el total cuesta O(q log q), aunque una operación pueda borrar muchas.", String.raw`#include <iostream>
#include <map>
#include <iterator>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int q;
    cin >> q;
    map<long long, long long> f;
    while (q--) {
        int type;
        long long a;
        cin >> type >> a;
        if (type == 2) {
            auto it = f.lower_bound(a);
            if (it == f.end())
                cout << "NINGUNA\n";
            else
                cout << it->second << '\n';
        } else {
            long long b;
            cin >> b;
            auto it = f.lower_bound(a);
            if (it != f.end() && it->second >= b)
                continue;
            if (it != f.end() && it->first == a)
                it = f.erase(it);
            it = f.emplace_hint(it, a, b);
            while (it != f.begin()) {
                auto p = prev(it);
                if (p->second > b)
                    break;
                f.erase(p);
            }
        }
    }
}`, [{input:'7\n1 2 9\n1 5 6\n1 8 3\n2 4\n1 6 8\n2 4\n2 7\n',output:'6\n8\n3\n'}, {input:'4\n1 1 -2\n1 3 -5\n2 2\n2 4\n',output:'-5\nNINGUNA\n'}, {input:'5\n1 3 5\n1 7 2\n1 8 6\n2 1\n2 9\n',output:'6\nNINGUNA\n'}]),
    r('borrado',"Por qué los borrados cambian el problema","Inserta (3,5) y después (8,6). Describe la frontera. Si ahora se permitiera borrar (8,6), ¿podrías responder la consulta x=2 usando solo lo que conserva esa estructura?", ["La segunda pareja tiene tanto mayor alcance como mayor ahorro.", "La primera sigue siendo una oferta histórica, aunque la frontera haya dejado de guardarla."], "La frontera conserva solo (8,6), que domina a (3,5). Si borras la dominante, queda vacía, pero la respuesta correcta para x=2 debería volver a ser 5. La estructura perdió esa alternativa al descartarla. Para admitir borrados necesitarías información adicional; la demostración de esta frontera depende de que las ofertas dominantes sigan disponibles."),
  ]),

  'usaco-adv-wavelet': extend('usaco-adv-wavelet',100,[
    s("Construir particiones sin cambiar el orden relativo","Comprime los valores en rangos 0…σ−1 y conserva cómo recuperar cada valor original. Un nodo recibe un intervalo de valores [lo,hi] y una subsecuencia. Si lo=hi, todos sus elementos tienen el mismo valor. Si no, divide en mid=(lo+hi)/2 y manda valores≤mid a la izquierda y los demás a la derecha.\n\nConserva el orden relativo dentro de cada hijo. Mientras recorres la subsecuencia, calcula pref[0]=0 y pref[i+1]=pref[i]+(valor[i]≤mid). Estos conteos permitirán traducir posiciones. Ordenar libremente dentro de un hijo destruiría esa correspondencia, aunque todos sus valores siguieran perteneciendo a la mitad correcta."),
    s("Elegir la rama y traducir el intervalo","Para buscar el k-ésimo menor en [l,r), calcula c=pref[r]−pref[l]. Si k≤c, continúa a la izquierda con [pref[l],pref[r]). Si k>c, continúa a la derecha con [l−pref[l],r−pref[r]) y busca la posición k−c. En una hoja devuelve su valor. Antes de iniciar exige 1≤k≤r−l.\n\nPara contar valores≤x, un nodo completamente por debajo de x aporta r−l y uno completamente por encima aporta cero; los demás trasladan la consulta a sus hijos. Si quieres sumar valores o los k menores, añade prefijos de sumas. Los conteos de la versión básica no bastan para responder esas variantes."),
    s("Por qué el traslado conserva los candidatos","Antes de l, exactamente pref[l] elementos fueron al hijo izquierdo; antes de r, fueron pref[r]. Como la partición es estable, los que provenían de [l,r) ocupan justo [pref[l],pref[r]) allí. Para el hijo derecho resta esos conteos al número total de posiciones.\n\nTodos los valores de la izquierda son menores o iguales que los de la derecha. Si hay c candidatos izquierdos, ocupan los primeros c lugares del orden. Eso justifica elegir la izquierda cuando k≤c o restar c al ir a la derecha. Cada aparición cuenta por separado, así que los valores repetidos no necesitan un tratamiento especial."),
    s("Costo y límites de una estructura estática","La altura es O(log σ). Cada elemento participa en una tabla de prefijos por nivel, por lo que construir esta versión cuesta O(n log σ) tiempo y memoria. Seleccionar o contar hasta un umbral cuesta O(log σ). Otras representaciones con bitvectors y rank pueden reducir memoria, pero requieren una implementación distinta.\n\nCambiar un valor altera particiones y prefijos; este código supone un arreglo fijo. En la implementación los nodos se identifican por índices para evitar referencias invalidadas cuando crece el vector. Comprueba valores iguales, negativos, k=1 y k igual a la longitud consultada. Al devolver una respuesta, traduce el rango comprimido a su valor original."),
  ],[
    p('k-esimo',"Seleccionar dentro de un intervalo","Lee n q (1≤n≤50000, 1≤q≤100000), n enteros entre −10⁹ y 10⁹ y q consultas l r k. Se cumple 1≤l≤r≤n y 1≤k≤r−l+1. Para cada consulta imprime el k-ésimo menor de [l,r], contando apariciones repetidas.", ["Al dividir por valores, conserva el orden relativo de cada subsecuencia.", "Los prefijos de elementos izquierdos traducen ambos extremos y dicen cuántos candidatos hay en esa rama."], "Construye el árbol por intervalos de valores. En cada consulta cuenta candidatos izquierdos con pref[r]−pref[l]; desciende allí si alcanzan la posición k, o a la derecha con k reducido. La partición estable asegura que los extremos traducidos describen exactamente los mismos elementos. Preparar cuesta O(n log σ) y consultar O(log σ), con σ valores distintos.", String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
struct Node {
    int lo, hi, a = -1, b = -1;
    vector<int> pref;
};
vector<Node> t;
int build(const vector<int> &v, int lo, int hi) {
    int id = t.size();
    t.push_back({lo, hi, -1, -1, {0}});
    if (lo == hi)
        return id;
    int mid = (lo + hi) / 2;
    vector<int> L, R;
    for (int x : v) {
        t[id].pref.push_back(t[id].pref.back() + (x <= mid));
        if (x <= mid)
            L.push_back(x);
        else
            R.push_back(x);
    }
    int a = build(L, lo, mid), b = build(R, mid + 1, hi);
    t[id].a = a;
    t[id].b = b;
    return id;
}
int kth(int v, int l, int r, int k) {
    if (t[v].lo == t[v].hi)
        return t[v].lo;
    int a = t[v].pref[l], b = t[v].pref[r], c = b - a;
    if (k <= c)
        return kth(t[v].a, a, b, k);
    return kth(t[v].b, l - a, r - b, k - c);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    vector<int> a(n);
    for (int &x : a)
        cin >> x;
    vector<int> values = a;
    sort(values.begin(), values.end());
    values.erase(unique(values.begin(), values.end()), values.end());
    for (int &x : a)
        x = lower_bound(values.begin(), values.end(), x) - values.begin();
    int root = build(a, 0, values.size() - 1);
    while (q--) {
        int l, r, k;
        cin >> l >> r >> k;
        cout << values[kth(root, l - 1, r, k)] << '\n';
    }
}`, [{input:'4 3\n4 1 3 2\n2 4 2\n1 4 1\n1 4 4\n',output:'2\n1\n4\n'}, {input:'3 2\n7 7 7\n1 3 2\n2 2 1\n',output:'7\n7\n'}, {input:'4 2\n-5 3 -5 0\n1 4 2\n2 4 2\n',output:'-5\n0\n'}]),
    r('mover-rango',"Traducir una consulta a los dos hijos","Un nodo tiene pref=[0,1,1,2,2,3]. Para el intervalo [1,5), calcula los intervalos de ambos hijos y decide dónde buscar su tercer menor.", ["El hijo izquierdo recibe [pref[l],pref[r]).", "El derecho recibe [l−pref[l],r−pref[r]); resta del rango k los candidatos izquierdos si desciendes allí."], "La izquierda recibe [1,3), con dos candidatos. La derecha recibe [0,2), también con dos. Como buscas el tercero, los dos izquierdos no bastan: baja a la derecha buscando su primero, k=3−2=1. Mantener [1,5) sin traducir consultaría otras posiciones, o posiciones inexistentes, en las subsecuencias."),
  ]),

  'usaco-adv-count-min': extend('usaco-adv-count-min',95,[
    s("Definir el mínimo junto con su cantidad","Para cada segmento guarda (mn,cnt): el menor valor y cuántas posiciones lo alcanzan. Al combinar dos hijos, conserva el par con menor mn; si empatan, suma sus cantidades. El resultado describe el segmento completo y por eso no depende de cómo agrupes sus partes.\n\nUna hoja guarda (A[i],1). Para una parte disjunta de una consulta, devuelve (infinito,0), no (0,0): cero podría ganar incorrectamente frente a valores positivos. Si las hojas representan espacios geométricos, reemplaza la cantidad uno por la longitud correspondiente y estarás sumando medidas."),
    s("Aplicar incrementos sin visitar cada posición","Sumar x a todo un nodo cambia mn+=x, pero no cnt: todos sus valores se desplazan igual y las mismas posiciones siguen siendo mínimas. Guarda también lazy+=x como incremento pendiente de transmitir.\n\nEn una actualización parcial, empuja ese incremento a ambos hijos, limpia la etiqueta, actualiza las partes que intersectan y recombina. Una consulta parcial también debe empujar antes de bajar; en cobertura total devuelve el par ya actualizado. Asignar todo el rango a x sería otra operación: convertiría en mínimas todas sus posiciones y necesitaría una etiqueta distinta."),
    s("Seguir una actualización que cambia la multiplicidad","Empieza con [3,1,1,4], cuyo resumen global es (1,2). Suma 2 a las posiciones 2…3: queda [3,3,3,4] y el resumen es (3,3). Suma −5 a 1…2: queda [−2,−2,3,4], con resumen (−2,2). Consultar solo 2…4 da (−2,1).\n\nUna hoja describe correctamente su valor. La combinación elige exactamente las posiciones mínimas de sus dos partes, y un incremento uniforme conserva cuáles son. Empujar distribuye ese mismo cambio sin alterar el estado representado. Estas propiedades justifican el árbol; conocer solo el mínimo no permitiría reconstruir su multiplicidad."),
    s("Interpretar la cantidad como longitud descubierta","En cobertura de intervalos, cada hoja guarda cuántas coberturas recibe y cuánto mide. Las altas y bajas válidas mantienen conteos no negativos. Si el mínimo global es cero, cnt mide la parte descubierta y longitudCubierta=longitudTotal−cnt. Si el mínimo es positivo, toda la región está cubierta.\n\nCon coberturas negativas esa interpretación falla: retirar un intervalo inexistente no genera un hueco válido. El ejercicio usa enteros generales y cuenta posiciones, separando la estructura de esa aplicación geométrica. Cada operación cuesta O(log n) y la memoria O(n). Prueba mínimos en ambos hijos, incrementos cero y consultas de una posición."),
  ],[
    p('minimo-cantidad',"Mínimo y cantidad después de incrementos","Lee n q (1≤n,q≤50000), n valores de valor absoluto≤10⁶ y q operaciones. «1 l r x» suma x al intervalo inclusivo [l,r], con |x|≤10⁶; «2 l r» pide su mínimo y cuántas veces aparece. Los índices empiezan en 1. Imprime ambos números por consulta.", ["Un incremento uniforme desplaza el mínimo pero conserva sus posiciones.", "Cuando los mínimos de dos partes empatan, suma sus cantidades."], "Guarda mínimo, cantidad y etiqueta de incremento en cada nodo. Aplicar un incremento modifica mínimo y etiqueta; las consultas o cambios parciales empujan la etiqueta y luego combinan hijos. La combinación conserva la cantidad del mínimo menor o suma si empatan. Ese significado se mantiene tras cada operación, con costo O(log n).", String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
struct Node {
    long long mn = 0, lazy = 0;
    int cnt = 0;
};
vector<Node> t;
vector<long long> a;
pair<long long, int> join(pair<long long, int> x, pair<long long, int> y) {
    if (x.first < y.first)
        return x;
    if (y.first < x.first)
        return y;
    return {x.first, x.second + y.second};
}
void pull(int v) {
    auto z = join({t[2 * v].mn, t[2 * v].cnt}, {t[2 * v + 1].mn, t[2 * v + 1].cnt});
    t[v].mn = z.first;
    t[v].cnt = z.second;
}
void build(int v, int L, int R) {
    if (L == R) {
        t[v].mn = a[L];
        t[v].cnt = 1;
        return;
    }
    int M = (L + R) / 2;
    build(2 * v, L, M);
    build(2 * v + 1, M + 1, R);
    pull(v);
}
void apply(int v, long long x) {
    t[v].mn += x;
    t[v].lazy += x;
}
void push(int v) {
    apply(2 * v, t[v].lazy);
    apply(2 * v + 1, t[v].lazy);
    t[v].lazy = 0;
}
void add(int v, int L, int R, int l, int r, long long x) {
    if (r < L || R < l)
        return;
    if (l <= L && R <= r) {
        apply(v, x);
        return;
    }
    push(v);
    int M = (L + R) / 2;
    add(2 * v, L, M, l, r, x);
    add(2 * v + 1, M + 1, R, l, r, x);
    pull(v);
}
pair<long long, int> query(int v, int L, int R, int l, int r) {
    if (r < L || R < l)
        return {4000000000000000000LL, 0};
    if (l <= L && R <= r)
        return {t[v].mn, t[v].cnt};
    push(v);
    int M = (L + R) / 2;
    return join(query(2 * v, L, M, l, r), query(2 * v + 1, M + 1, R, l, r));
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
            add(1, 0, n - 1, l, r, x);
        } else {
            auto z = query(1, 0, n - 1, l, r);
            cout << z.first << ' ' << z.second << '\n';
        }
    }
}`, [{input:'4 5\n3 1 1 4\n2 1 4\n1 2 3 2\n2 1 4\n1 1 2 -5\n2 2 4\n',output:'1 2\n3 3\n-2 1\n'}, {input:'1 3\n5\n2 1 1\n1 1 1 -8\n2 1 1\n',output:'5 1\n-3 1\n'}, {input:'3 2\n2 2 2\n1 2 2 1\n2 1 3\n',output:'2 2\n'}]),
    r('cobertura',"Medir cobertura con longitudes desiguales","Las hojas representan [0,2), [2,7) y [7,10), con coberturas [1,0,0]. Calcula el par (mínimo,medida) de la raíz y la longitud cubierta. Repite después de agregar una cobertura a toda la región.", ["Las longitudes de las hojas son 2, 5 y 3.", "Solo restas la medida del mínimo a la longitud total cuando ese mínimo es cero."], "El resumen inicial es (0,8), porque las dos hojas descubiertas miden 5+3. La longitud cubierta es 10−8=2. Después las coberturas son [2,1,1] y el resumen (1,8): siguen siendo mínimas las mismas hojas. Como el mínimo ya es positivo, toda la longitud 10 está cubierta; restar automáticamente 8 sería incorrecto."),
  ]),
};
