import { page, text, snippet, problem, program, detail, type Walkthrough } from './intermediate-helpers.ts';

export const silverMoreWalkthroughs: Record<string, Walkthrough> = {
  'usaco-silver-sorting-custom': l => page([
    problem(l, 'Las coordenadas distintas del ejemplo, en orden, son [−10,5,20,100]. Sus rangos son 0,1,2,3. Por eso ambas apariciones de 20 reciben el rango 2. Debemos imprimir los rangos en el orden de la entrada.'),
    text('Por qué no usar las coordenadas como índices', 'Reservar una casilla por cada posible coordenada requeriría demasiado espacio: una coordenada puede valer un millón de millones, y también puede ser negativa. Si solo necesitamos comparar el orden, basta guardar cuáles valores aparecen.\n\nPodríamos buscar para cada coordenada cuántos valores distintos menores hay recorriendo toda la lista. Eso repite hasta n² comparaciones. Ordenar una copia nos permite hacer esa búsqueda mucho más rápido.'),
    snippet('Ordenar una copia y quitar repeticiones', 'a conserva el orden original. En v queremos una sola aparición de cada valor, ordenada de menor a mayor:', String.raw`auto v = a;
sort(v.begin(), v.end());
v.erase(unique(v.begin(), v.end()), v.end());`, 'sort deja [−10,5,20,20,100]. unique agrupa los valores distintos al principio y devuelve el nuevo final; erase borra lo que queda después. v termina en [−10,5,20,100]. unique por sí solo no reduce el tamaño del vector.'),
    snippet('Encontrar el rango de cada coordenada', 'Cada valor de a aparece exactamente una vez en v. Buscamos su posición con lower_bound:', String.raw`for (auto x : a) {
    int rango = lower_bound(v.begin(), v.end(), x) - v.begin();
    cout << rango << ' ';
}`, 'Esto se llama compresión de coordenadas. No comprime las distancias: entre 20 y 100 hay 80 unidades, aunque sus rangos difieran en uno. Conserva igualdad y orden.'),
    program(l, 'El programa mantiene los datos originales en a y usa v únicamente para traducir valores a rangos.', 'Ordenar y hacer n búsquedas cuesta O(n log n), con O(n) memoria. Si todas las coordenadas son iguales, todos los rangos deben ser cero. Para recuperar un valor desde su rango j, consulta v[j].'),
    text('Otro caso: ordenar fichas con más de un dato', 'Ahora imagina fichas con nombre y puntuación. Queremos más puntos primero y, en un empate, nombre alfabético. Ordenar solo los puntos perdería la relación con los nombres: ordenaremos fichas completas.\n\nUn comparador responde «¿a debe ir antes que b?». No pregunta si a es mejor o igual. Dos fichas idénticas no deben precederse entre sí.'),
    snippet('Escribir un criterio con desempate', 'Primero comparamos puntos. Solo si empatan consultamos los nombres:', String.raw`struct Ficha { string nombre; int puntos; };
bool antes(const Ficha& a, const Ficha& b) {
    if (a.puntos != b.puntos) return a.puntos > b.puntos;
    return a.nombre < b.nombre;
}
// sort(fichas.begin(), fichas.end(), antes);`, 'Con Ana:8, Luis:10 y Beto:8, quedan Luis, Ana, Beto. Usar >= para los puntos haría que dos fichas empatadas se dijeran mutuamente «voy antes», un criterio inválido para sort.'),
    detail(l, 4), detail(l, 7),
  ]),
  'usaco-silver-greedy-sorting': l => page([
    problem(l, 'Podemos asistir a [1,2), [2,3) y [3,5): tres talleres. El final de uno puede ser el inicio del siguiente. Elegir [0,4) primero dejaría pasar los dos talleres cortos del medio.'),
    text('Probar todas las agendas', 'Una solución directa decide para cada taller si lo toma o lo deja, y comprueba que los elegidos no se encimen. Hay 2ⁿ selecciones: no alcanza para 200 000 talleres.\n\nBusquemos una elección que no cierre opciones innecesarias. Entre los talleres disponibles, tomaremos el que termina primero. No elegimos el más corto: un taller corto que empiece muy tarde puede impedir varios anteriores.'),
    text('Por qué terminar antes no nos perjudica', 'Piensa en una agenda con la máxima cantidad posible. Su primer taller termina a cierta hora. Si lo cambiamos por el taller que termina antes que todos, el resto de la agenda sigue siendo compatible: terminamos igual o antes.\n\nEntonces existe una agenda óptima que empieza con nuestra elección. Después queda el mismo problema, pero solo con talleres que empiezan cuando ya estamos libres. Podemos repetir el argumento. Esta forma de elegir una opción segura y continuar se llama algoritmo voraz.'),
    snippet('Guardar primero el final para ordenar', 'En el vector a cada pareja será (fin,inicio), aunque la entrada traiga inicio fin. sort ordena parejas por su primer valor y usa el segundo para desempatar:', String.raw`vector<pair<long long, long long>> a(n);
for (auto &[f, i] : a) cin >> i >> f;
sort(a.begin(), a.end());`, 'Para el ejemplo, los finales aparecen en orden 2,3,4,5,6. El nombre i aquí representa la hora de inicio, no una posición del vector.'),
    snippet('Aceptar solo talleres compatibles', 'fin recuerda cuándo termina el último taller aceptado. Antes del primero usamos el menor long long posible, porque también se permiten horarios negativos:', String.raw`long long fin = numeric_limits<long long>::lowest();
int ans = 0;
for (auto [f, i] : a) {
    if (i >= fin) {
        ans++;
        fin = f;
    }
}`, 'Aceptamos [1,2) y [2,3); rechazamos [0,4) porque empieza antes de 3; aceptamos [3,5) y rechazamos [4,6). Sale 3. Usamos >= porque tocarse en el límite está permitido.'),
    program(l, 'El programa cuenta elecciones después de ordenar por final. No necesita guardar todas las agendas ni reconstruir la elegida.', 'Ordenar cuesta O(n log n), recorrer O(n), guardar talleres O(n). Con n=0 imprime 0. Si cambiaras el objetivo a maximizar ganancias, elegir el que termina antes ya no tendría esta garantía.'),
    detail(l, 3), detail(l, 7),
  ]),
  'usaco-silver-priority-queues': l => page([
    problem(l, 'Para tamaños [1,2,3,4], unimos 1+2 y pagamos 3. Quedan [3,3,4]. Unimos 3+3 y pagamos 6; quedan [4,6]. Pagamos 10 en la última unión. El costo total es 3+6+10=19, no solo 10.'),
    text('Encontrar los dos menores cada vez', 'Podríamos recorrer la lista para localizar los dos archivos más pequeños, retirarlos y agregar su suma. Haríamos una búsqueda lineal por unión: O(n²) en total.\n\nOrdenar una sola vez no basta: el archivo que acabas de crear también participa en la siguiente elección. Necesitamos una colección que permita agregar un valor y retirar el menor muchas veces. Esa es la tarea de una cola de prioridad mínima.'),
    snippet('Crear una cola que entregue el menor', 'priority_queue normalmente entrega el mayor. greater<long long> invierte la prioridad para poner el menor arriba:', String.raw`priority_queue<long long, vector<long long>, greater<long long>> q;
q.push(4);
q.push(1);
q.push(3);
long long menor = q.top(); // 1
q.pop(); // Retira el 1; ahora el menor es 3.`, 'push agrega un valor. top consulta el prioritario sin borrarlo. pop lo retira y no devuelve su valor; por eso primero guardamos top. Estas operaciones usan un montículo, un árbol organizado para localizar rápidamente ese extremo.'),
    snippet('Repetir las uniones', 'ans acumula todo lo pagado. La nueva suma vuelve a q para competir con los archivos restantes:', String.raw`long long ans = 0;
while (q.size() > 1) {
    auto a = q.top(); q.pop();
    auto b = q.top(); q.pop();
    ans += a + b;
    q.push(a + b);
}`, 'Solo entramos si quedan al menos dos archivos. Con un único archivo inicial no hay unión y el costo es cero. No retires valores de una cola vacía.'),
    text('Por qué conviene unir los dos menores', 'Dibuja las fusiones como un árbol: los archivos originales están abajo; cada unión crea un padre con la suma de sus hijos. Un archivo paga su tamaño una vez por cada unión que recorre hasta arriba.\n\nSi un archivo grande está más abajo que uno pequeño, intercambiarlos no aumenta el costo: ahora el pequeño paga más veces y el grande menos. Podemos colocar los dos menores en dos hojas hermanas del nivel más profundo. Unirlos primero deja un solo archivo que representa a ambos, y el resto vuelve a ser el mismo problema. Esa justificación permite repetir la elección.'),
    program(l, 'Leemos los tamaños directamente en q y repetimos la fusión de los dos menores hasta dejar uno.', 'Hay n−1 uniones, cada una con operaciones O(log n): total O(n log n), memoria O(n). ans requiere long long porque un mismo archivo contribuye varias veces al costo.'),
    detail(l, 4), detail(l, 5), detail(l, 7),
  ]),
  'usaco-silver-graph-traversal': l => page([
    problem(l, 'Los grupos del ejemplo son {1,2,3}, {4,5} y {6}. El club 6 cuenta aunque no aparezca en ninguna conexión. No pedimos cuántas aristas hay, sino cuántas partes separadas tiene la red.'),
    text('No iniciar una búsqueda desde cada club sin recordar nada', 'Podríamos explorar desde cada club, pero entonces los clubes 1,2 y 3 producirían el mismo grupo tres veces. Guardaremos una marca visto por club y solo iniciaremos una búsqueda si todavía no tiene marca.\n\nUna componente es un conjunto máximo de vértices conectados mediante caminos. BFS descubre una componente completa usando una cola. DFS lo hace siguiendo una rama con una pila. Ambos necesitan recordar qué vértices ya descubrieron.'),
    snippet('Preparar las listas de vecinos', 'Cada conexión funciona en ambos sentidos. Convertimos los números desde uno a índices desde cero:', String.raw`vector<vector<int>> g(n);
while (m--) {
    int u, v; cin >> u >> v;
    --u; --v;
    g[u].push_back(v);
    g[v].push_back(u);
}`, 'La lista g[0] contiene los vecinos del club 1. Guardar solo una dirección convertiría el problema en otra red y podría separar clubes que sí están conectados.'),
    snippet('Pintar una componente con BFS', 'Este fragmento se ejecuta desde un club s todavía no visitado. La cola contiene vértices descubiertos cuyos vecinos falta revisar:', String.raw`queue<int> q;
q.push(s);
visto[s] = true;
while (!q.empty()) {
    int u = q.front(); q.pop();
    for (int v : g[u]) {
        if (!visto[v]) {
            visto[v] = true;
            q.push(v);
        }
    }
}`, 'Desde el club 1 descubre 1,2,3. Sus marcas quedan guardadas después de vaciar la cola. Desde el club 4 descubre 4,5. Desde 6 solo se descubre él mismo.'),
    text('Contar cada comienzo nuevo', 'Recorremos s desde 0 hasta n−1. Si visto[s] es falso, incrementamos componentes y hacemos el BFS anterior. Si ya es verdadero, su grupo ya fue contado.\n\nCada búsqueda solo marca vértices que se conectan con su inicio. Al terminar, no queda ningún camino por explorar dentro de esa parte. Por eso dos búsquedas diferentes corresponden a componentes diferentes, y ninguna queda sin contar.'),
    program(l, 'El ciclo exterior encuentra comienzos nuevos; el interior recorre sus componentes. Aunque los ciclos estén anidados, ningún vértice entra dos veces a una cola.', 'Cada arista se examina desde sus dos extremos: O(n+m) tiempo y memoria. Prueba un grafo sin aristas: tiene n componentes.'),
    detail(l, 5),
    snippet('La alternativa con una pila', 'Para marcar alcanzables también puedes reemplazar la cola por una pila. El último vértice agregado es el primero que sale:', String.raw`vector<int> pila{s};
visto[s] = true;
while (!pila.empty()) {
    int u = pila.back(); pila.pop_back();
    for (int v : g[u]) if (!visto[v]) {
        visto[v] = true;
        pila.push_back(v);
    }
}`, 'Esto hace un recorrido en profundidad para alcanzabilidad. Cambia el orden de las visitas, pero no la componente encontrada. No uses ese orden como si garantizara distancias mínimas; para aristas de igual costo las capas de BFS sí las garantizan.'),
    detail(l, 3), detail(l, 6),
  ]),
  'usaco-silver-flood-fill': l => page([
    problem(l, 'En el ejemplo, los ocho puntos rodean la pared central y todos se pueden alcanzar sin pisar una pared. Forman una región. Dos puntos que solo se tocan en una esquina no quedan conectados.'),
    text('Convertir casillas en una red', 'Cada punto es un lugar visitable; comparte una conexión con los puntos de arriba, abajo, izquierda y derecha. No necesitamos crear listas de todas esas aristas: podemos calcular cuatro vecinos a partir de la fila y columna.\n\nRecorrer desde cada punto sin guardar visitas contaría la misma región muchas veces. Igual que al contar componentes de un grafo, pintaremos una región completa y empezaremos otra solo desde una casilla todavía libre.'),
    snippet('Calcular los cuatro movimientos', 'El par dr[k],dc[k] describe un desplazamiento. Por ejemplo, k=0 baja una fila y no cambia de columna:', String.raw`int dr[] = {1, -1, 0, 0};
int dc[] = {0, 0, 1, -1};
for (int k = 0; k < 4; k++) {
    int u = x + dr[k], v = y + dc[k];
    if (u >= 0 && u < n && v >= 0 && v < m && a[u][v] == '.') {
        a[u][v] = '#';
        q.push({u, v});
    }
}`, 'Primero comprobamos los límites y después leemos a[u][v]. Al cambiar un punto por # lo marcamos como visitado. Aquí podemos reutilizar el símbolo porque ya no necesitamos distinguir paredes originales de celdas visitadas.'),
    text('Seguir una región sin contarse dos veces', 'El recorrido exterior encuentra el punto (0,0), aumenta ans y lo pone en la cola. BFS alcanza (1,0) y (0,1), luego el resto del anillo. La pared central no entra.\n\nCuando termina, todos esos puntos ya tienen marca. El recorrido exterior pasa sobre ellos sin incrementar ans. El algoritmo se llama flood fill porque llena toda una región conectada, como la herramienta de relleno de un editor de dibujos.'),
    program(l, 'Por cada punto sin pintar, main inicia una cola nueva y agrega una región al contador. La cola guarda parejas de fila y columna.', 'Cada celda se descubre una vez y revisa cuatro vecinos: O(FC) tiempo y hasta O(FC) memoria. En un tablero con filas .# y #., la respuesta es 2: no permitimos diagonales.'),
    detail(l, 5),
    text('Medir una región además de contarla', 'Para obtener su área, suma uno por cada punto que sacas de su cola. Para el perímetro, cuenta cada lado que mira fuera del tablero o hacia una pared original.\n\nEn el anillo 3×3, el área es 8. El borde exterior tiene 12 lados y el hueco aporta 4: perímetro 16. Para esta variante usa una tabla separada de visitados, porque convertir puntos a # impediría distinguirlos de paredes y contarías bordes internos por error.'),
    detail(l, 6),
  ]),
  'usaco-silver-intro-tree': l => page([
    problem(l, 'En el ejemplo, el vértice 3 tiene debajo a 4 y 5. Su subárbol contiene {3,4,5}, por eso mide 3. El de la raíz 1 contiene los cinco vértices. Las hojas 2,4,5 tienen tamaño 1.'),
    text('Qué significa mirar un árbol desde una raíz', 'Un árbol es una red conectada sin ciclos. Entre cada par de vértices hay un solo camino. Elegir la raíz 1 permite hablar de arriba y abajo: el padre de un vértice es su vecino en dirección a la raíz; sus otros vecinos son hijos.\n\nEl subárbol de v incluye v y todos los vértices que quedan debajo de él. Contarlo con un recorrido separado por vértice repetiría mucho trabajo: en una cadena, hasta O(n²). Vamos a calcular cada tamaño una sola vez.'),
    snippet('Anotar padres antes que hijos', 'order empieza con la raíz, cuyo índice interno es 0. Agregamos sus hijos, luego los de ellos. p[v] recuerda el padre de v:', String.raw`vector<int> p(n, -1), order{0}, sz(n, 1);
for (int i = 0; i < n; i++) {
    int v = order[i];
    for (int u : g[v]) {
        if (u != p[v]) {
            p[u] = v;
            order.push_back(u);
        }
    }
}`, 'Como la entrada es un árbol, ignorar al padre basta para no regresar: no puede aparecer otra arista hacia un vértice ya descubierto. Esa simplificación sería incorrecta en un grafo con ciclos.'),
    snippet('Sumar los tamaños de abajo hacia arriba', 'Cada vértice empieza con tamaño 1 por sí mismo. Al recorrer order al revés, todos sus descendientes ya habrán contribuido:', String.raw`for (int i = n - 1; i > 0; i--) {
    int v = order[i];
    sz[p[v]] += sz[v];
}`, 'Primero 5 y 4 aportan uno cada uno al vértice 3: su tamaño pasa de 1 a 3. Luego 3 aporta sus tres al 1; 2 aporta uno más. El tamaño de 1 termina en 5. No procesamos la posición 0 porque la raíz no tiene padre.'),
    program(l, 'El programa construye las listas, prepara order y acumula tamaños. Usa ciclos y vectores, así que también funciona con árboles muy profundos sin agotar la pila de llamadas.', 'Tiempo O(n), memoria O(n). Una cadena con raíz en un extremo tiene tamaños n,n−1,…,1. Una estrella tiene tamaño n en el centro y 1 en cada hoja.'),
    detail(l, 4), detail(l, 5), detail(l, 7),
  ]),
  'usaco-silver-func-graphs': l => page([
    problem(l, 'Las instrucciones son 1→2, 2→3, 3→4 y 4→3. Partimos de 1. Tras dos pasos estamos en 3; después alternamos 4,3,4,3… El paso 101 termina en 4.'),
    snippet('Seguir cada instrucción', 'Con pocos pasos bastaría esta simulación:', String.raw`int v = s;
for (long long paso = 0; paso < k; paso++) v = nxt[v];`, 'Para k=10¹⁸ no podemos hacer una vuelta por paso. Pero solo hay n vértices: si seguimos suficientes instrucciones, tendremos que volver a uno conocido.'),
    text('Separar la entrada del recorrido que se repite', 'Un grafo funcional tiene exactamente una salida por vértice. Cuando vuelves a un vértice, toda la trayectoria posterior se repite, porque su siguiente destino siempre es el mismo.\n\nGuardemos el orden de primeras visitas: [1,2,3,4]. El siguiente sería 3, que ya estaba en la posición 2. Hay una parte inicial de longitud 2 y un ciclo de longitud 2. Llegar al ciclo cuesta dos pasos; solo después podemos descontar vueltas completas.'),
    snippet('Anotar cuándo vimos cada vértice', 'first[v]=-1 significa que v todavía no aparece en order. Guardamos el vértice de partida en la posición 0, antes de dar ningún paso:', String.raw`int v = s;
while (first[v] == -1) {
    first[v] = order.size();
    order.push_back(v);
    v = nxt[v];
}
long long mu = first[v];
long long len = order.size() - mu;`, 'Al terminar, v es el primer vértice repetido. mu indica dónde empieza el ciclo y len cuántos vértices contiene. Los nombres son números de posiciones, no identificadores de vértices.'),
    snippet('Saltar vueltas completas', 'Si k ya es una posición de order, la consultamos directamente. Si no, quitamos la parte inicial y reducimos solo los pasos que caen en el ciclo:', String.raw`long long pos = k < (long long)order.size()
    ? k : mu + (k - mu) % len;
cout << order[pos] + 1 << '\n';`, 'En el ejemplo, pos=2+(101-2)%2=3. order[3] representa el vértice 4. Sumamos uno al imprimir porque el programa convirtió los identificadores a índices desde cero.'),
    program(l, 'El programa lee nxt, sigue la trayectoria hasta una repetición y calcula una posición equivalente dentro de order.', 'Visita como máximo n vértices distintos: O(n) tiempo y memoria, aunque k sea enorme. Prueba k=0: debe devolver el vértice inicial, sin dar un paso.'),
    detail(l, 7),
    text('Floyd y saltos preparados resuelven otras necesidades', 'Floyd detecta el ciclo sin guardar first: un caminante avanza una arista por vuelta y otro dos hasta encontrarse. Después se puede medir la longitud del ciclo y localizar su entrada. Ahorra memoria, pero requiere varias caminatas y más cuidado al contar.\n\nSi habrá muchas consultas desde orígenes diferentes, conviene guardar salto[j][v], el destino después de 2ʲ pasos desde v. Se obtiene como salto[j−1][salto[j−1][v]]. Descomponer k en potencias de dos responde cada consulta en O(log k), con O(n log k) preparación y memoria.'),
  ]),
  'usaco-silver-intro-bitwise': l => page([
    problem(l, 'Con cinco estudiantes y comités de dos, hay diez posibilidades. Aquí no calcularemos una fórmula de combinaciones: representaremos cada comité y contaremos sus integrantes. Eso permite usar después la misma representación en problemas con restricciones.'),
    text('Una decisión sí o no por estudiante', 'Una solución recursiva podría decidir «entra» o «no entra» para cada estudiante. Hay dos opciones por persona, así que aparecen 2ⁿ comités.\n\nPodemos guardar esas n decisiones en los bits de un entero. El bit i vale 1 si entra el estudiante i y 0 si no. Una máscara es simplemente ese entero usado como conjunto. Para estudiantes 0,1,2, la máscara binaria 101 representa {0,2}; la 000 representa el conjunto vacío.'),
    snippet('Leer una decisión de la máscara', '1ULL << i coloca un único bit encendido en la posición i. Al aplicar &, solo puede sobrevivir ese bit:', String.raw`if (mask & (1ULL << i)) {
    cantidad++;
}`, 'Si mask es 101₂ y i=1, 101₂ & 010₂ da cero: no está. Para i=2, 101₂ & 100₂ no es cero: sí está. ULL pide un entero sin signo de 64 bits.'),
    snippet('Enumerar todos los comités', 'Los enteros de 0 a 2ⁿ−1 recorren todas las combinaciones de n bits. Contamos los bits de cada máscara:', String.raw`unsigned long long respuesta = 0;
for (unsigned long long mask = 0; mask < (1ULL << n); ++mask) {
    int cantidad = 0;
    for (int i = 0; i < n; ++i)
        if (mask & (1ULL << i)) ++cantidad;
    if (cantidad == k) ++respuesta;
}`, 'Con n=3 y k=2, sirven 011,101,110: tres comités. Ninguno se repite porque dos máscaras diferentes discrepan en al menos un integrante.'),
    program(l, 'main lee n y k, recorre las máscaras y cuenta las que tienen k integrantes. La máscara cero participa y sirve cuando k=0.', 'El tiempo es O(n·2ⁿ), memoria adicional O(1). Con n=20 hay 1 048 576 máscaras; con n=60 esta enumeración ya no es viable aunque la máscara quepa en el tipo.'),
    snippet('Cambiar integrantes sin tocar los demás', 'Si bit vale 1ULL << i, estas operaciones actúan sobre el integrante i:', String.raw`mask |= bit;   // Agregar.
mask &= ~bit;  // Quitar.
mask ^= bit;   // Alternar: entra si no estaba y sale si estaba.`, 'OR, escrito |, enciende bits presentes en cualquiera. AND, &, conserva los que están en ambos. XOR, ^, conserva los que difieren. Por eso A&B representa la intersección y A|B la unión de dos comités.'),
    detail(l, 6), detail(l, 7),
  ]),
  'usaco-silver-silver-conclusion': l => page([
    problem(l, 'Podemos bajar desde la altura 1 hasta el 2, ir al 3 y terminar en el 4. Ese camino evita la celda de altura 8. El menor límite es 4 porque el destino ya tiene esa altura.'),
    text('Resolver una pregunta más pequeña primero', 'Enumerar todos los caminos puede generar muchísimos recorridos, incluso vueltas que no terminan. En cambio, para una altura fija H podemos tachar las celdas mayores que H y preguntar si el origen y el destino quedan conectados.\n\nEsa comprobación ya la sabemos resolver: BFS en un tablero. Después encontraremos el menor H que da una respuesta afirmativa.'),
    snippet('Permitir solo las celdas que caben bajo el límite', 'Dentro de BFS, (x,y) es un vecino de la celda actual. Lo agregamos únicamente si existe, no fue visitado y su altura alcanza el requisito:', String.raw`if (x >= 0 && x < n && y >= 0 && y < m
    && !seen[x][y] && a[x][y] <= h) {
    seen[x][y] = true;
    q.push({x, y});
}`, 'Cada llamada a ok(h) crea sus propias marcas seen. No puedes conservarlas entre alturas: una celda antes bloqueada puede volverse accesible. Elegiremos h al menos igual a ambas esquinas para poder iniciar el recorrido en (0,0).'),
    text('Seguir dos comprobaciones del ejemplo', 'Con H=3, puedes recorrer las alturas 1,2,3, pero no entrar al destino de altura 4. Con H=4 ya llegas. Con H=8 también llegas: abrir más celdas nunca destruye el camino anterior.\n\nPor tanto, las respuestas pasan una sola vez de no a sí. El límite inferior es la mayor altura de las dos esquinas; el superior es la mayor altura de todo el tablero, que permite visitar todas sus celdas.'),
    snippet('Buscar el primer límite suficiente', 'lo y hi contienen la respuesta. ok recorre el tablero y devuelve si llegó al destino:', String.raw`while (lo < hi) {
    int mid = lo + (hi - lo) / 2;
    if (ok(mid)) hi = mid;
    else lo = mid + 1;
}`, 'Cuando una altura funciona, intentamos bajar. Cuando falla, todas las menores también fallan. El BFS y esa propiedad de las alturas tienen justificaciones separadas; necesitamos ambas.'),
    program(l, 'El programa define ok como una función local, con su propia cola y tabla de visitas. Después realiza la búsqueda y escribe el menor límite.', 'Cada comprobación cuesta O(FC); hay O(log(A+1)) comprobaciones si A es la altura máxima. La memoria es O(FC). Con una sola celda, la respuesta es su altura y la búsqueda no necesita entrar al ciclo.'),
    detail(l, 1), detail(l, 7),
  ]),
};
