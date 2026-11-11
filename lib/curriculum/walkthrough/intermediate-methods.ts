import { page, text, snippet, problem, program, detail, type Walkthrough } from './intermediate-helpers.ts';

export const methodWalkthroughs: Record<string, Walkthrough> = {
  'usaco-gold-ternary-search': l => page([
    problem(l, 'Con coordenadas 2 y 5, colocar x=3 cuesta (3−2)²+(3−5)²=5. Colocar x=4 también cuesta 5. En 2 o 5 cuesta 9. Solo podemos elegir x entero; la salida pide el costo, no la posición.'),
    text('Probar cada posición entera', 'Podríamos evaluar todas las posiciones desde la menor coordenada hasta la mayor. Cada evaluación suma n cuadrados. Queremos reducir cuántas posiciones probamos.\n\nLa función f(x)=Σ(x−a[i])² baja hacia su mínimo y luego sube. Cada término es una parábola que se abre hacia arriba; al sumarlos obtenemos otra del mismo tipo. Esa forma se llama convexa, y en particular tiene un único valle. Es la propiedad que permite descartar intervalos.'),
    snippet('Programar la función antes de buscar', 'f recibe una posición y devuelve cuánto costaría colocar allí la sede:', String.raw`auto f = [&](long long x) {
    long long s = 0;
    for (auto y : a) {
        long long d = x - y;
        s += d * d;
    }
    return s;
};`, 'Con x=3 y datos [2,5], los términos son 1 y 4. Usamos long long desde d: convertir solo el resultado después de multiplicar no arreglaría un desbordamiento anterior.'),
    text('Comparar dos puntos interiores', 'Elegimos u y v aproximadamente a un tercio y a dos tercios del intervalo. Si f(u)≤f(v), no necesitamos buscar más allá de v: allí el valle no puede estar bajando hacia una respuesta mejor. Si f(u)>f(v), descartamos lo anterior a u.\n\nEn una función con varios valles separados, esa conclusión sería falsa. No basta observar algunas evaluaciones: tenemos que conocer la forma de la función antes de usar búsqueda ternaria.'),
    snippet('Dejar pocos candidatos y revisarlos exactamente', 'Con enteros, dividir entre tres redondea. Cuando quedan pocos valores, dejamos de dividir para evitar repetir los mismos límites:', String.raw`while (r - l > 3) {
    long long u = l + (r - l) / 3;
    long long v = r - (r - l) / 3;
    if (f(u) <= f(v)) r = v;
    else l = u;
}
long long ans = numeric_limits<long long>::max();
for (long long x = l; x <= r; x++) ans = min(ans, f(x));`, 'Para [2,5] ya quedan solo cuatro enteros y el programa los revisa directamente. Esto permite conservar ambos mínimos, 3 y 4, sin reglas delicadas de redondeo.'),
    program(l, 'Los límites iniciales son el mínimo y el máximo de las coordenadas. Fuera de ese rango aumentaría la distancia a todos los puntos, así que ningún óptimo queda afuera.', 'Tiempo O(n log(R+1)), con R=max(a)−min(a), y memoria O(n). Para funciones reales se suele detener tras una cantidad fija de iteraciones y usar double; aquí hacemos la comparación final exacta en enteros.'),
    detail(l, 7),
    text('En este problema también hay una fórmula directa', 'Al desarrollar los cuadrados obtenemos n·x²−2x·Σa[i]+Σa[i]². Su mínimo real está en el promedio de las coordenadas. Por tanto, basta evaluar los dos enteros que rodean ese promedio, lo que cuesta O(n).\n\nLa búsqueda ternaria de esta lección sirve para practicar el razonamiento y también funciona cuando evaluar una función con un solo valle es fácil pero no tenemos una fórmula sencilla para su mínimo.'),
  ]),
  'usaco-gold-hashing': l => page([
    problem(l, 'En ababa, los fragmentos [0,3) y [2,5) son ambos aba. Con a=1 y b=2, su huella es 1·31²+2·31+1=1024. El fragmento [1,4) es bab y su huella es 2·31²+1·31+2=1955.'),
    snippet('Calcular una huella recorriendo el texto', 'Construimos el número de izquierda a derecha: multiplicar por 31 desplaza los valores anteriores y agregar la letra incorpora el nuevo:', String.raw`long long huella = 0;
for (int i = l; i < r; i++) {
    huella = (huella * 31 + s[i] - 'a' + 1) % M;
}`, 'Esto cuesta la longitud del fragmento en cada consulta. Para aba obtenemos 1, luego 33 y luego 1024. El módulo limita el tamaño, pero también permite que dos textos distintos produzcan la misma huella.'),
    text('Preparar las huellas de prefijos', 'h[i] guardará la huella de los primeros i caracteres. p[i] guardará 31ⁱ módulo M. En ambos arreglos dejamos una entrada para el prefijo vacío: h[0]=0 y p[0]=1.\n\nAl consultar [l,r), h[r] ya contiene el fragmento, pero también el prefijo anterior. Ese prefijo está desplazado por r−l posiciones, así que su contribución es h[l]·31^(r−l). La restamos.'),
    snippet('Construir h y las potencias juntas', 'La longitud de s es n; ambas tablas tienen n+1 posiciones:', String.raw`for (int i = 0; i < n; i++) {
    h[i + 1] = (h[i] * 31 + s[i] - 'a' + 1) % M;
    p[i + 1] = p[i] * 31 % M;
}`, 'La dirección del polinomio importa: el primer carácter queda en la potencia más alta. Si cambiaras esa convención, también tendría que cambiar la fórmula de extracción.'),
    snippet('Retirar el prefijo que sobra', 'Multiplicamos el prefijo anterior por la potencia correspondiente al largo del fragmento:', String.raw`long long resultado = (h[r] - h[l] * p[r - l] % M + M) % M;`, 'Para [2,5) de ababa, antes de reducir módulo tenemos h[5]=984127 y h[2]=33. Restamos 33·31³=983103 y queda 1024. El +M evita un residuo negativo después de la resta. Si l=r, resta el mismo prefijo y sale cero.'),
    program(l, 'El programa calcula exactamente las huellas solicitadas; cada consulta posterior usa dos prefijos y una potencia ya guardada.', 'Preparación O(n), consultas O(1), memoria O(n). Compara la huella con la calculada por el recorrido directo para fragmentos pequeños antes de usarla en otro algoritmo.'),
    detail(l, 4), detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-hashmaps': l => page([
    problem(l, 'En [1,−1,1] hay tres tramos de suma 1: el primer elemento, el tercero y el arreglo completo. Los negativos impiden descartar inicios solo porque una suma intermedia se haya pasado.'),
    snippet('Contar todos los tramos por sus extremos', 'Una solución directa fija cada inicio y extiende su suma:', String.raw`long long ans = 0;
for (int l = 0; l < n; l++) {
    long long suma = 0;
    for (int r = l; r < n; r++) {
        suma += a[r];
        if (suma == k) ans++;
    }
}`, 'Cuesta O(n²). Los prefijos calculan cada suma más rápido, pero todavía habría O(n²) pares. Necesitamos contar varios inicios de golpe.'),
    text('Preguntar qué prefijo anterior necesitamos', 'Si p es el prefijo actual y anterior uno de los anteriores, el tramo entre ambos suma p−anterior. Queremos que eso sea k, así que anterior debe valer p−k.\n\nGuardaremos f[valor], cuántas veces apareció cada prefijo antes de la posición actual. Ya existe un prefijo vacío de valor cero, por eso empezamos con f[0]=1. No buscamos una única posición: varios prefijos iguales representan inicios diferentes y todos cuentan.'),
    snippet('Consultar antes de guardar el prefijo actual', 'Después de leer x, actualizamos p y buscamos su complemento:', String.raw`p += x;
auto it = f.find(p - k);
if (it != f.end()) ans += it->second;
f[p]++;`, 'find devuelve un iterador si la clave existe y end() si no. it->second es su frecuencia. Guardamos p después de consultar: si k=0 y lo guardáramos antes, contaríamos el intervalo vacío que termina donde empieza.'),
    text('Seguir las frecuencias en el ejemplo', 'Al leer el primer 1, p=1 y buscamos 0: aparece una vez, así que ans=1. Registramos el prefijo 1.\n\nAl leer −1, p=0 y buscamos −1: no existe. Registramos otro cero, de modo que f[0]=2. Al leer el último 1, p=1 y buscamos 0: sus dos apariciones aportan el tramo completo y el último elemento. ans termina en 3.'),
    program(l, 'unordered_map relaciona cada suma de prefijo con su frecuencia. reserve prepara espacio para reducir ampliaciones durante las inserciones.', 'Tiempo esperado O(n), memoria O(n). La respuesta puede alcanzar n(n+1)/2, así que tanto ans como las sumas usan long long. En un arreglo de tres ceros con k=0, deben contarse seis tramos.'),
    detail(l, 4), detail(l, 7),
    text('Elegir entre map y unordered_map', 'unordered_map usa una función hash para ubicar claves. Su tiempo por operación es esperado constante, pero muchas colisiones pueden degradarlo. No mantiene las claves en orden.\n\nmap usa un árbol ordenado y ofrece O(log n) garantizado por operación. Para este conteo puedes cambiar el contenedor por map y obtener O(n log n), sin modificar el razonamiento de prefijos ni el orden de consultar y registrar.'),
  ]),
  'usaco-gold-meet-in-the-middle': l => page([
    problem(l, 'Para [0,1,1] y objetivo 1, puedes elegir cualquiera de los dos unos, con o sin el cero. Son cuatro subconjuntos de índices, aunque algunas sumas y valores elegidos coincidan.'),
    text('Dividir las decisiones en dos grupos', 'Con cuarenta elementos, enumerar todos los subconjuntos requiere 2⁴⁰ posibilidades, más de un millón de millones. Pero cada mitad de veinte tiene aproximadamente un millón.\n\nTodo subconjunto se divide de una única manera: qué índices toma de la mitad izquierda y cuáles de la derecha. Calcularemos todas las sumas de cada mitad y, para una suma izquierda x, contaremos sumas derechas iguales a T−x. Esta técnica se llama meet in the middle.'),
    snippet('Generar sumas duplicando las elecciones', 's empieza con cero por el subconjunto vacío. Para cada elemento, conservamos las sumas sin él y agregamos las mismas sumas incluyéndolo:', String.raw`vector<long long> sums(const vector<long long>& a, int l, int r) {
    vector<long long> s{0};
    for (int i = l; i < r; i++) {
        int z = s.size();
        for (int j = 0; j < z; j++) s.push_back(s[j] + a[i]);
    }
    return s;
}`, 'Guardamos z antes del ciclo. Si usáramos el tamaño que sigue creciendo, volveríamos a agregar el mismo elemento. Las sumas repetidas deben conservarse: representan selecciones diferentes.'),
    text('Combinar el ejemplo a mano', 'Separamos [0] y [1,1]. La izquierda produce [0,0], porque elegir el cero o dejarlo fuera da la misma suma. La derecha produce [0,1,1,2].\n\nPara cada cero de la izquierda buscamos complemento 1. Hay dos apariciones en la derecha. Cada cero aporta dos y el total es cuatro. Convertir estas listas en conjuntos de valores distintos perdería respuestas.'),
    snippet('Contar todas las apariciones del complemento', 'Ordenamos R para que equal_range encuentre el inicio y final del grupo de valores iguales:', String.raw`auto L = sums(a, 0, n / 2);
auto R = sums(a, n / 2, n);
sort(R.begin(), R.end());
long long ans = 0;
for (auto x : L) {
    auto p = equal_range(R.begin(), R.end(), target - x);
    ans += p.second - p.first;
}`, 'Cada pareja de selecciones de ambas mitades identifica exactamente un subconjunto completo. Por eso no duplicamos respuestas, aunque sus sumas sean iguales. Los valores negativos funcionan porque no usamos una regla de poda por suma.'),
    program(l, 'El programa genera las dos mitades, ordena la derecha y cuenta complementos de cada suma izquierda. El subconjunto vacío permanece en ambas listas.', 'Tiempo O(n·2^(n/2)) y memoria O(2^(n/2)). Con n=0 hay un único subconjunto: el vacío; responde 1 si T=0 y 0 en otro caso. El conteo puede llegar a 2⁴⁰ y requiere long long.'),
    detail(l, 7),
  ]),
  'usaco-gold-gold-conclusion': l => page([
    problem(l, 'Hay dos rutas de 0 a 3: 0→1→3 cuesta 3+8=11 y 0→2→3 cuesta 5+2=7. Queremos la mayor, 11. Si hay un ciclo en cualquier parte del grafo, la instrucción es imprimir CICLO antes de intentar calcular rutas.'),
    text('El objetivo cambia la técnica', 'Dijkstra busca distancias mínimas; no basta cambiar menor por mayor para resolver este problema. Enumerar todas las rutas tampoco conviene: incluso sin ciclos puede haber una cantidad exponencial.\n\nUn grafo dirigido sin ciclos, o DAG, permite ordenar los vértices de modo que todas las aristas avancen. Calcularemos ese orden primero. Después cada respuesta dependerá únicamente de vértices ya procesados.'),
    snippet('Obtener el orden y comprobar todo el grafo', 'in guarda requisitos pendientes. Este es Kahn, igual que al organizar tareas:', String.raw`queue<int> q;
for (int i = 0; i < n; i++) if (in[i] == 0) q.push(i);
vector<int> o;
while (!q.empty()) {
    int v = q.front(); q.pop();
    o.push_back(v);
    for (auto [u, w] : g[v]) if (--in[u] == 0) q.push(u);
}
if ((int)o.size() != n) {
    cout << "CICLO\n";
    return 0;
}`, 'Incluimos también vértices que no se alcanzan desde 0: el enunciado pide detectar cualquier ciclo. La salida temprana evita calcular una tabla bajo una condición que no se cumplió.'),
    text('Definir la mejor ruta que termina en cada vértice', 'd[v] será el mayor peso de una ruta desde 0 hasta v. Inicialmente d[0]=0 y el resto vale −1, que significa inalcanzable. Podemos usar −1 porque todos los pesos son no negativos.\n\nEn el ejemplo, desde 0 proponemos d[1]=3 y d[2]=5. Desde 1 proponemos d[3]=11. Desde 2 proponemos 7, pero conservamos 11. No importa cuál de 1 y 2 atendamos primero, siempre que ambos estén antes de 3.'),
    snippet('Extender solo rutas que existen', 'Cada arista v→u puede prolongar una ruta a v. Tomamos la mejor de todas las propuestas:', String.raw`for (int v : o) {
    if (d[v] != -1) {
        for (auto [u, w] : g[v]) {
            d[u] = max(d[u], d[v] + w);
        }
    }
}`, 'No sumamos w a −1: eso inventaría una ruta desde un lugar al que no llegamos. Cuando toca procesar v, todos sus predecesores ya aportaron; por lo tanto, su valor ya es el mejor posible.'),
    program(l, 'Después de detectar ciclos, el programa calcula las mayores rutas y comprueba si n−1 sigue inalcanzable. En ese caso imprime IMPOSIBLE.', 'Tiempo y memoria O(n+m). Si n=1 y no hay ciclos, la ruta vacía cuesta cero. Prueba quitar las dos aristas hacia 3 del ejemplo: debe aparecer IMPOSIBLE.'),
    detail(l, 1), detail(l, 7),
  ]),
};
