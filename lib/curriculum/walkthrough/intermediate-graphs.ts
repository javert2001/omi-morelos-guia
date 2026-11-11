import { page, text, snippet, problem, program, detail, type Walkthrough } from './intermediate-helpers.ts';

export const graphWalkthroughs: Record<string, Walkthrough> = {
  'usaco-gold-unweighted-shortest-paths': l => page([
    problem(l, 'Desde 0 llegamos a 1 y 3 cruzando una arista, y a 2 cruzando dos: 0→1→2. El vértice 4 está aislado, así que su distancia es −1. La distancia al propio origen es cero.'),
    text('Encontrar un camino no garantiza que sea el más corto', 'DFS puede encontrar una ruta después de seguir una rama larga, aunque haya otra más corta pendiente. Probar todas las rutas sería innecesario y podría repetir ciclos.\n\nBFS procesa primero los vértices a distancia cero, luego a distancia uno, después a distancia dos. La cola conserva ese orden porque agrega los nuevos al final. Como todas las aristas cuestan un paso, descubrir un vértice por primera vez fija su distancia mínima.'),
    snippet('Usar la distancia también como marca', 'd[v]=-1 significa que todavía no encontramos una ruta hacia v. El origen empieza en cero y entra primero a la cola:', String.raw`vector<int> d(n, -1);
queue<int> q;
d[0] = 0;
q.push(0);
while (!q.empty()) {
    int v = q.front(); q.pop();
    for (int u : g[v]) {
        if (d[u] == -1) {
            d[u] = d[v] + 1;
            q.push(u);
        }
    }
}`, 'Al sacar 0, asignamos d[1]=d[3]=1. Al sacar 1, asignamos d[2]=2. El 3 ya esperaba antes que 2; esa es la organización por capas. Escribimos la distancia antes de encolar para que nadie lo agregue dos veces.'),
    detail(l, 4),
    program(l, 'Los vértices ya vienen numerados desde cero. main guarda cada conexión en ambas direcciones y conserva −1 para los que BFS no descubra.', 'Tiempo y memoria O(n+m). Agregar la arista 0 2 al ejemplo debe cambiar d[2] a 1. Si todas las aristas tuvieran el mismo costo C, estas cantidades de pasos se podrían multiplicar por C.'),
    detail(l, 5),
    text('Cuando una conexión cuesta cero', 'Ahora permite aristas de costo 0 o 1. La ruta 0→1 de costo 1 puede perder contra 0→2→1 con costos 0 y 0. Marcar 1 definitivamente al verlo por primera vez sería incorrecto.\n\nUsamos una deque, una cola donde podemos agregar también al principio. Una mejora por arista de costo cero sigue en la misma capa y va al frente; una mejora por costo uno pertenece a la siguiente y va al final. Actualizamos solamente cuando encontramos un costo menor.'),
    snippet('Relajar aristas con costo cero o uno', 'Para esta variante, g[v] contiene parejas (destino,peso), d empieza en INF salvo d[0]=0, y q es una deque<int>:', String.raw`while (!q.empty()) {
    int v = q.front(); q.pop_front();
    for (auto [u, w] : g[v]) {
        if (d[v] + w < d[u]) {
            d[u] = d[v] + w;
            if (w == 0) q.push_front(u);
            else q.push_back(u);
        }
    }
}`, 'No uses la condición d[u]==−1 de BFS común: una distancia previa puede mejorar. Esta técnica se llama BFS 0–1 y cuesta O(n+m). Para pesos generales necesitaremos otra forma de elegir la menor distancia pendiente.'),
    detail(l, 7),
  ]),
  'usaco-gold-dsu': l => page([
    problem(l, 'Al principio hay cinco grupos. Las conexiones 0–1, 2–3 y 1–2 los reducen a {0,1,2,3} y {4}. La conexión 0–3 ya une miembros del mismo grupo; el lazo 4–4 tampoco junta grupos distintos. La respuesta es 2.'),
    text('Actualizar grupos sin recorrer el grafo entero', 'Podrías almacenar todas las aristas y contar componentes con BFS al final. Eso funciona para esta salida. Pero si quisieras contestar después de cada conexión, repetir BFS sería caro.\n\nDSU mantiene conjuntos disjuntos: cada vértice pertenece a exactamente un grupo. Permite consultar si dos vértices están juntos y unir sus grupos. No guarda las rutas entre ellos.'),
    snippet('Encontrar el representante de un grupo', 'p[x] apunta hacia otro miembro del mismo grupo. En el representante, p[x]=x. find sigue esas referencias y acorta el camino para consultas posteriores:', String.raw`int find(int x) {
    if (p[x] == x) return x;
    return p[x] = find(p[x]);
}`, 'Al principio cada vértice se representa a sí mismo. Si tenemos 3→2→0 y 0→0, find(3) devuelve 0 y deja también p[3]=0. El representante es una etiqueta elegida por la estructura, no necesariamente el menor vértice.'),
    snippet('Colgar el grupo pequeño del grande', 's[a] guarda el tamaño cuando a es un representante. join devuelve si realmente hubo una unión:', String.raw`bool join(int a, int b) {
    a = find(a); b = find(b);
    if (a == b) return false;
    if (s[a] < s[b]) swap(a, b);
    p[b] = a;
    s[a] += s[b];
    return true;
}`, 'No cambiamos el padre de un vértice cualquiera: primero encontramos las raíces de ambos grupos. Adjuntar el grupo pequeño limita la profundidad; comprimir caminos acelera aún más las consultas repetidas.'),
    text('Restar solo cuando se unen componentes distintas', 'components empieza en n. Por cada arista, join devuelve true si dos grupos pasaron a ser uno, y false si ya era un solo grupo. Restar ese resultado evita descontar conexiones repetidas o lazos.\n\nLa estructura conserva exactamente los grupos de alcanzabilidad: agregar una conexión solo puede unir las dos componentes de sus extremos; no puede separar ninguna ni conectar una tercera sin un camino.'),
    program(l, 'La estructura DSU guarda p y s. main procesa cada conexión al leerla, por lo que no necesita guardar las aristas.', 'Con unión por tamaño y compresión, el tiempo total es O((n+m)α(n)), donde α crece tan despacio que es menor que 5 para estos tamaños. La memoria es O(n).'),
    detail(l, 7),
  ]),
  'usaco-gold-toposort': l => page([
    problem(l, 'Las tareas 0 y 1 deben hacerse antes de la 2; la 2 debe ir antes de la 3. Podemos empezar con 0 y después 1, dejando [0,1,2,3]. El ejercicio fija cómo desempatar para que podamos verificar una salida única.'),
    text('Contar requisitos pendientes', 'Probar todas las permutaciones de tareas y comprobar cada dependencia costaría n!. Podemos construir un orden directamente: una tarea sin requisitos pendientes ya se puede hacer.\n\nin[v] será la cantidad de aristas que entran a v, es decir, sus requisitos todavía pendientes. Si in[v]=0, agregamos v a una cola. Al terminar v, cada tarea que dependía de ella pierde un requisito.'),
    snippet('Preparar y atender tareas disponibles', 'Al leer una arista a→b, agregamos b a g[a] e incrementamos in[b]. Luego ejecutamos:', String.raw`queue<int> q;
for (int i = 0; i < n; i++) if (in[i] == 0) q.push(i);
while (!q.empty()) {
    int v = q.front(); q.pop();
    order.push_back(v);
    for (int u : g[v]) {
        in[u]--;
        if (in[u] == 0) q.push(u);
    }
}`, 'La cola inicial del ejemplo es [0,1]. Sacar 0 deja in[2]=1, todavía no disponible. Sacar 1 deja in[2]=0 y agrega 2. Después 2 libera a 3. Este procedimiento se llama algoritmo de Kahn.'),
    text('Detectar un ciclo cuando se acaba la cola', 'Si salen los n vértices, cada tarea apareció después de sus requisitos: tenemos un orden topológico. Si quedan pendientes, cada uno todavía depende de algún otro pendiente.\n\nSigue esos requisitos hacia atrás. Como hay una cantidad finita de vértices, terminarás repitiendo uno: aparece un ciclo de dependencias que nadie puede iniciar. Por eso order.size()!=n permite imprimir CICLO.'),
    program(l, 'main conserva los vecinos en el orden de entrada y agrega los ceros iniciales en orden numérico. Esto respeta el desempate solicitado.', 'Tiempo y memoria O(n+m). Agrega 3→1 al ejemplo: las tareas 1,2,3 quedarán en un ciclo y el programa imprimirá CICLO.'),
    detail(l, 6),
    snippet('Usar el orden para contar caminos', 'En un grafo dirigido sin ciclos, ya puedes propagar respuestas sin volver hacia atrás. Para contar caminos desde s, empieza con formas[s]=1 y las demás en cero:', String.raw`for (int v : order) {
    for (int u : g[v]) formas[u] += formas[v];
}`, 'Cuando llegamos a v, todos sus predecesores ya aportaron. Cada camino que termina en u tiene una última arista v→u, así que sumar sus aportaciones cuenta todas las posibilidades. Usa el módulo o tipo de entero que exija el problema.'),
  ]),
  'usaco-gold-shortest-paths': l => page([
    problem(l, 'La arista directa 0→1 cuesta 8, pero 0→2→1 cuesta 2+1=3. Desde allí llegamos a 3 pagando cuatro más: distancia 7. Contar aristas con BFS preferiría incorrectamente la conexión directa.'),
    text('Elegir la propuesta de menor costo', 'Podríamos mantener distancias provisionales y recorrer todos los vértices para elegir la menor pendiente en cada paso. Ese Dijkstra sencillo cuesta O(n²), que puede ser demasiado aquí.\n\nUsaremos una cola de prioridad mínima para elegir la propuesta más barata. d[v] guarda el menor costo que hemos encontrado hasta v. Una propuesta es la pareja (costo,vértice); puede volverse vieja si luego aparece un camino mejor.'),
    snippet('Revisar si una arista mejora la ruta', 'Si llegamos a v con costo x, seguir una arista a u de peso w propone costo x+w. A esta comparación se le llama relajación:', String.raw`if (w <= INF - x && x + w < d[u]) {
    d[u] = x + w;
    q.push({d[u], u});
}`, 'La primera condición evita que la suma sobrepase el valor INF elegido. No sumamos costos a una distancia imposible: solo recorremos vértices que llegaron a la cola con una ruta real.'),
    snippet('Ignorar propuestas que ya quedaron atrás', 'La cola ordena primero por costo. Al sacar una pareja, comprobamos si su costo todavía coincide con d[v]:', String.raw`while (!q.empty()) {
    auto [x, v] = q.top(); q.pop();
    if (x != d[v]) continue;
    for (auto [w, u] : g[v]) {
        if (w <= INF - x && x + w < d[u]) {
            d[u] = x + w;
            q.push({d[u], u});
        }
    }
}`, 'En el ejemplo, desde 0 agregamos (8,1) y (2,2). Sale (2,2), que agrega (3,1). Sale (3,1) antes que (8,1), y propone (7,3). Cuando finalmente sale (8,1), ya no coincide con d[1]=3 y la descartamos.'),
    detail(l, 5),
    program(l, 'El programa usa parejas (peso,destino) en g y (distancia,vértice) en q. Solo guarda la dirección indicada por la entrada.', 'Tiempo O((n+m)log(n+m)), memoria O(n+m). Los pesos deben ser no negativos para justificar que la menor propuesta vigente ya es definitiva. Usa Bellman–Ford u otro método adecuado cuando esa condición no se cumpla.'),
    detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-mst': l => page([
    problem(l, 'Para conectar tres sedes, podemos elegir las conexiones 0–1 y 1–2 de costo 2 cada una. Pagamos 4. Agregar también 0–2 costaría más y no conectaría ninguna sede nueva.'),
    text('Conectar toda la red con costo mínimo', 'No estamos buscando la ruta más barata desde un origen: queremos pagar una sola vez por cada conexión instalada y dejar todas las sedes conectadas. Entre las redes que son árboles elegimos la de menor costo. Un árbol conectado tiene n−1 aristas y no contiene ciclos.\n\nEnumerar todos los subconjuntos de aristas sería enorme. Kruskal revisa las aristas de menor a mayor costo y acepta una solo cuando une componentes que antes estaban separadas.'),
    snippet('Ordenar las conexiones por costo', 'Guardamos cada arista como (peso,extremo,extremo), así sort compara primero el peso:', String.raw`vector<tuple<long long, int, int>> e;
e.push_back({w, a, b});
// Después de leer todas:
sort(e.begin(), e.end());`, 'Si dos conexiones cuestan lo mismo, cualquiera puede revisarse primero. El árbol elegido podría cambiar, pero el costo mínimo no.'),
    snippet('Usar DSU para detectar cuándo se forma un ciclo', 'd.join(a,b) devuelve true solo si a y b estaban en grupos distintos. Esa conexión puede agregarse al bosque actual:', String.raw`long long ans = 0;
int used = 0;
for (auto [w, a, b] : e) {
    if (d.join(a, b)) {
        ans += w;
        used++;
    }
}`, 'Conectar dos vértices ya unidos por un camino cerraría un ciclo, así que la rechazamos. En el ejemplo aceptamos las dos aristas de costo 2 y rechazamos la de costo 3.'),
    text('Por qué la conexión barata es una elección segura', 'Mira una de las componentes actuales y separa sus vértices del resto. Para completar cualquier árbol necesitamos una arista que cruce esa separación. La que estamos considerando es una de las más baratas disponibles que puede unir dos componentes.\n\nSi un árbol óptimo no la usa, agregarla forma un ciclo. Ese ciclo contiene otra arista que cruza la misma separación y no cuesta menos. Podemos retirar esa otra arista: seguimos conectados, sin aumentar el costo. Existe, por tanto, un árbol óptimo compatible con nuestra elección.'),
    program(l, 'El programa incluye DSU completo. Si acepta n−1 aristas, imprime el costo; si no, las conexiones disponibles no alcanzan para unir toda la red.', 'Ordenar domina el tiempo: O(m log m), con O(n+m) memoria. Los pesos negativos también funcionan para este objetivo de árbol mínimo. Un solo vértice necesita cero aristas y cuesta cero.'),
    detail(l, 4), detail(l, 7),
  ]),
};
