import { page, text, snippet, problem, program, detail, type Walkthrough } from './intermediate-helpers.ts';

const binaryLoop = String.raw`int l = 0, r = n;
while (l < r) {
    int m = l + (r - l) / 2;
    if (a[m] < x) l = m + 1;
    else r = m;
}`;

export const silverWalkthroughs: Record<string, Walkthrough> = {
  'busqueda-binaria': l => page([
    problem(l, 'En el ejemplo, el folio 8 aparece dos veces. Basta con que aparezca una para responder SI. Vamos a encontrar su primera posible posición y después comprobar qué hay allí.'),
    snippet('Primero, revisar todos los folios', 'Un recorrido directo compara x con cada folio. Funciona incluso si la lista está desordenada:', String.raw`bool encontrado = false;
for (int i = 0; i < n; i++) {
    if (a[i] == x) encontrado = true;
}`, 'Hace hasta n comparaciones por búsqueda. Aquí la lista ya está ordenada: si el folio central es demasiado pequeño, los de su izquierda también lo son. Podemos dejar de revisarlos.'),
    text('Buscar el primero que no sea menor', 'Buscaremos la primera posición con valor al menos x. Si contiene x, el folio existe; si contiene algo mayor, no existe. Si no queda ningún valor, la posición será n, que indica el final de la lista.\n\nCon [2,5,8,8,11] y x=8, empezamos con l=0 y r=5. El centro m=2 contiene 8. Ese 8 sirve, pero quizá haya uno antes: dejamos r=2. Ahora m=1 contiene 5 y podemos descartar las posiciones 0 y 1, poniendo l=2. Los límites coinciden en 2.'),
    snippet('Escribir las decisiones del ejemplo', 'El tramo [l,r) incluye l y excluye r. Representa lo que todavía falta revisar. r empieza en n porque también necesitamos representar «no hay ningún valor suficiente».', binaryLoop, 'Si a[m] es demasiado pequeño, descartamos también m: por eso escribimos m+1. Si a[m] alcanza, conservamos esa posición como posible respuesta con r=m. Nunca accedemos a a[r]; r puede estar fuera del arreglo.'),
    snippet('Comprobar si encontramos el folio', 'La posición hallada puede contener un número mayor o señalar el final. Comprobamos ambos casos antes de responder:', String.raw`bool encontrado = l < n && a[l] == x;
cout << (encontrado ? "SI" : "NO") << '\n';`, 'C++ evalúa && de izquierda a derecha. Si l<n es falso, no intenta leer a[l]. Eso permite manejar también una lista vacía.'),
    detail(l, 7),
    program(l, 'main lee la lista, reduce el intervalo y compara el candidato con x. El ejemplo usa exactamente los límites que acabamos de seguir.', 'Prueba buscar 7: la frontera sigue siendo la posición 2, pero allí hay un 8, así que debe salir NO. Leer la entrada cuesta O(n); la búsqueda, O(log(n+1)).'),
    detail(l, 1), detail(l, 6),
  ]),
  'sumas-de-prefijos': l => page([
    problem(l, 'En el ejemplo, cumplen la meta los días 2, 3 y 5. Del día 2 al 4 cumplen dos; el día 4, por sí solo, no cumple. Queremos contar días, no sumar minutos.'),
    snippet('Contar una consulta con un recorrido', 'Podríamos mirar cada día del intervalo y contar los que alcanzaron la meta T:', String.raw`int cantidad = 0;
for (int dia = l; dia <= r; dia++) {
    if (minutos[dia] >= T) cantidad++;
}`, 'Con muchos intervalos repetiríamos las mismas comprobaciones. Hasta 200 000 consultas sobre 200 000 días podrían requerir 40 000 millones de visitas.'),
    text('Cambiar minutos por ceros y unos', 'Una vez que sabemos si el día cumplió, su cantidad exacta de minutos deja de importar. En [20,30,40,0,50], con T=30, escribimos [0,1,1,0,1]. Sumarlos cuenta días cumplidos.\n\nAhora guardamos un total acumulado: p[i] contará los días cumplidos entre 1 e i. Antes del día 1 hay cero, así que p[0]=0. El arreglo p queda [0,0,1,2,2,3]. Tiene una posición adicional para ese comienzo vacío.'),
    snippet('Preparar los acumulados', 'Cada lectura aporta 1 si x alcanza T, y 0 si no. El nuevo total es el anterior más esa aportación:', String.raw`vector<int> p(n + 1);
for (int i = 1; i <= n; i++) {
    long long x;
    cin >> x;
    p[i] = p[i - 1] + (x >= T);
}`, 'La comparación entre paréntesis se convierte en 1 o 0. p[3]=2 significa que dos de los primeros tres días cumplieron, no que el tercer día entrenaras dos minutos.'),
    snippet('Quitar los días que sobran', 'p[r] cuenta hasta el último día pedido. También cuenta los anteriores a l. Esos días están en p[l-1], así que los restamos:', String.raw`cout << p[r] - p[l - 1] << '\n';`, 'Para los días 2 a 4 calculamos p[4]-p[1]=2-0=2. Para el día 4 solamente, p[4]-p[3]=2-2=0. Con l=1 restamos p[0], que ya contiene cero.'),
    program(l, 'Primero construimos p con los minutos de todos los días. Después respondemos cada consulta con dos lecturas y una resta.', 'El tiempo es O(n+q) y la memoria O(n). Cambia T a 40: en el periodo completo cumplirán dos días. No reutilices estos prefijos si cambias los minutos o la meta; tendrías que reconstruirlos.'),
    detail(l, 6),
  ]),
  'grafos': l => page([
    problem(l, 'Desde el salón 1 podemos pasar por 2, después por 4 y llegar a 3. Los salones 5 y 6 están conectados entre sí, pero separados de ese grupo. El ejemplo responde SI porque su destino es 3.'),
    text('Por qué no basta buscar un pasillo directo', 'Comprobar únicamente si existe el pasillo s–t rechazaría el ejemplo: 1 y 3 no están unidos directamente. Necesitamos considerar viajes con varios pasillos.\n\nPodríamos probar todos los recorridos, pero un pasillo de ida y vuelta produciría 1,2,1,2… sin terminar. En cuanto conocemos un salón, lo marcamos. No necesitamos descubrirlo por segunda vez para saber a qué otros salones podemos llegar desde él.'),
    snippet('Guardar el mapa en listas', 'Un grafo representa objetos mediante vértices y conexiones mediante aristas. Aquí los salones son vértices y los pasillos son aristas. g[u] guardará los vecinos de u. Convertimos los números de entrada a posiciones desde cero:', String.raw`vector<vector<int>> g(n);
while (m--) {
    int u, v;
    cin >> u >> v;
    --u; --v;
    g[u].push_back(v);
    g[v].push_back(u);
}`, 'Agregamos las dos direcciones porque el pasillo permite ir y regresar. La entrada 2 4 agrega 3 a g[1] y 1 a g[3]. Los números internos cambian, pero representan los mismos salones.'),
    snippet('Atender los salones en una cola', 'Una cola atiende primero lo que llegó primero. Guardaremos allí los salones descubiertos cuyos vecinos todavía falta revisar. seen evita repetirlos:', String.raw`vector<bool> seen(n);
queue<int> q;
q.push(s);
seen[s] = true;
while (!q.empty()) {
    int v = q.front();
    q.pop();
    for (int u : g[v]) {
        if (!seen[u]) {
            seen[u] = true;
            q.push(u);
        }
    }
}`, 'Este recorrido se llama BFS. En el ejemplo, la cola recibe los salones 1, 2, 4 y 3 en ese orden. Al revisar el 2 también vemos el 1, pero su marca impide agregarlo de nuevo. Marcamos al agregar, no al sacar.'),
    text('Qué sabemos cuando se vacía la cola', 'Cada salón marcado tiene un camino desde s: o es s, o lo descubrimos desde otro salón que ya tenía ese camino. Además, si hubiera un salón alcanzable sin marcar, el primer pasillo hacia una parte no marcada lo habría descubierto. Por tanto, basta leer seen[t].\n\nCada salón entra una vez a la cola y cada pasillo se revisa desde sus dos extremos. Tiempo y memoria: O(n+m). No estamos probando todas las rutas posibles.'),
    program(l, 'main convierte también s y t a índices desde cero, construye las listas y ejecuta BFS. Si s=t, la marca inicial ya permite responder SI.', 'Cambia el destino del ejemplo de 3 a 6: debe responder NO. Agregar otra vez un pasillo existente no cambia la respuesta, porque seen evita nuevas visitas.'),
    detail(l, 5), detail(l, 6), detail(l, 7),
  ]),
  'usaco-silver-prefix-sums': l => page([
    problem(l, 'Los cuatro balances son [4,−3,6,2]. El periodo completo suma 9. La consulta 1 4 pide −3+6+2=5; 2 2 no contiene elementos y suma cero. El extremo derecho siempre queda fuera.'),
    snippet('Sumar cada periodo directamente', 'Una solución correcta recorre el tramo de cada consulta:', String.raw`long long total = 0;
for (int i = l; i < r; i++) total += a[i];`, 'Cada consulta puede revisar n valores. Con n y q de 200 000, esa repetición puede ser demasiado grande. Como el arreglo no cambia, podemos preparar sumas que sirvan para todas las consultas.'),
    text('Un total para cada comienzo de periodo', 'p[i] será la suma de los primeros i valores. No es la suma hasta el índice i: ese elemento todavía queda fuera. Por eso p[0]=0 y p tiene n+1 posiciones.\n\nPara [4,−3,6,2], escribimos p=[0,4,1,7,9]. Los primeros tres valores suman 7; los primeros cuatro, 9. Para obtener los índices 1,2,3 restamos los primeros uno: 9-4=5. Solo quitamos lo que está antes del periodo.'),
    snippet('Construir la tabla una sola vez', 'Al leer a[i] en la variable x, lo agregamos al total anterior. Ya no necesitamos guardar a para responder sumas:', String.raw`vector<long long> p(n + 1, 0);
for (int i = 0; i < n; ++i) {
    long long x;
    cin >> x;
    p[i + 1] = p[i] + x;
}`, 'El primer valor se guarda en p[1], porque es la suma de un elemento. Los acumulados usan long long: muchos valores pequeños pueden producir una suma que no cabe en int.'),
    snippet('Responder con una resta', 'p[r] contiene todo hasta antes de r. p[l] contiene exactamente lo que sobra a la izquierda:', String.raw`cout << p[r] - p[l] << '\n';`, 'Para [0,4), obtenemos 9-0=9. Para [2,2), obtenemos 1-1=0. Los números negativos no estorban: cada término sobrante se suma una vez y se resta una vez.'),
    program(l, 'Preparamos p antes de leer las consultas. Cada pregunta posterior usa la misma fórmula, incluso cuando el intervalo está vacío.', 'Construir cuesta O(n); responder q consultas, O(q). Usamos O(n) memoria. Si el enunciado incluye ambos extremos, cambia la fórmula a p[r+1]-p[l]; no mezcles ambas convenciones dentro de una solución.'),
    detail(l, 4), detail(l, 6), detail(l, 7),
  ]),
  'usaco-silver-more-prefix-sums': l => page([
    problem(l, 'El primer rectángulo del ejemplo contiene 5,6,8,9 y suma 28. La segunda consulta pide todo el tablero: 45. Conservaremos filas y columnas numeradas desde uno.'),
    snippet('La solución con dos ciclos', 'Para una consulta, recorrer sus filas y columnas obtiene la suma correcta:', String.raw`long long suma = 0;
for (int i = r1; i <= r2; i++)
    for (int j = c1; j <= c2; j++)
        suma += a[i][j];`, 'El peor caso visita nm celdas por consulta. Queremos preparar una tabla para responder sin volver a entrar en el rectángulo.'),
    text('Sumar hasta una esquina', 'p[i][j] guardará el total de las filas 1 a i y columnas 1 a j. En el tablero del ejemplo, p[2][2]=1+2+4+5=12.\n\nPara calcular p[2][2], suma el rectángulo de arriba, 1+2=3, y el de la izquierda, 1+4=5. Ambos contaron el 1. Quítalo una vez y agrega la celda nueva, 5: 3+5-1+5=12. Ese mismo dibujo sirve en cualquier posición.'),
    snippet('Construir sin casos especiales en los bordes', 'Reservamos una fila 0 y una columna 0 de ceros. x es la celda que acabamos de leer:', String.raw`p[i][j] = x + p[i - 1][j] + p[i][j - 1]
            - p[i - 1][j - 1];`, 'Los prefijos del ejemplo quedan [1,3,6], [5,12,21] y [12,27,45]. Al construir por filas, arriba y a la izquierda ya están calculados.'),
    snippet('Quitar dos franjas y devolver su cruce', 'En el código, (a,b) es la esquina superior izquierda y (c,d), la inferior derecha. Ambas se incluyen. Quitamos las filas anteriores y las columnas anteriores:', String.raw`long long respuesta = p[c][d] - p[a - 1][d]
                    - p[c][b - 1] + p[a - 1][b - 1];`, 'Para filas 2 a 3 y columnas 2 a 3, sale 45-6-12+1=28. El +1 devuelve la esquina superior izquierda, que habíamos quitado dos veces.'),
    program(l, 'El programa lee cada celda y construye su prefijo inmediatamente. Las variables a,b,c,d de cada consulta corresponden a r1,c1,r2,c2 del enunciado.', 'Preparar cuesta O(nm), cada consulta O(1), y la memoria O(nm). Prueba una consulta de una celda, como 2 2 2 2: debe imprimir 5.'),
    text('Otro problema: aumentar muchos tramos', 'Ahora cambia la tarea. Hay cinco casillas inicialmente en cero. Queremos sumar 2 a las posiciones [0,3) y 5 a [2,5), y solo necesitamos el resultado al final. Modificar cada posición repetiría trabajo.\n\nEn lugar de guardar valores finales, d guarda cambios: +2 en 0 inicia un aumento; −2 en 3 lo termina. El segundo cambio agrega +5 en 2 y −5 en 5. Al acumular los avisos sale [2,2,7,5,5].'),
    snippet('Las diferencias guardan dónde comienza y termina un aumento', 'Este fragmento aplica un aumento x en [l,r), con posiciones desde cero. d tiene n+1 lugares para permitir r=n:', String.raw`d[l] += x;
d[r] -= x;
// Después de registrar todos los cambios:
long long activo = 0;
for (int i = 0; i < n; i++) {
    activo += d[i];
    cout << activo << ' ';
}`, 'La posición r es la primera que no debe recibir el aumento. No imprimas d directamente: d son instrucciones de cambio; activo recupera los valores.'),
    detail(l, 6),
    snippet('La misma idea para aumentar rectángulos', 'Con coordenadas semiabiertas [r1,r2) y [c1,c2), registramos cuatro cambios. Una acumulación por filas y otra por columnas convertirán las marcas en valores:', String.raw`d[r1][c1] += x;
d[r1][c2] -= x;
d[r2][c1] -= x;
d[r2][c2] += x;
for (int i = 0; i < n; i++)
    for (int j = 1; j < m; j++) d[i][j] += d[i][j - 1];
for (int i = 1; i < n; i++)
    for (int j = 0; j < m; j++) d[i][j] += d[i - 1][j];`, 'Reserva n+1 filas y m+1 columnas para las marcas de salida. La marca positiva de abajo a la derecha corrige el aumento cancelado dos veces. Esta variante sirve cuando todas las actualizaciones llegan antes de pedir el resultado.'),
    detail(l, 7),
  ]),
  'usaco-silver-two-pointers': l => page([
    problem(l, 'En [1,2,1,4,1], con presupuesto 4, las primeras tres sesiones suman 4. No hay cuatro sesiones consecutivas que quepan. La respuesta es 3; no podemos saltarnos sesiones intermedias.'),
    snippet('Probar cada inicio por separado', 'Una solución directa empieza un tramo en cada posición y lo alarga mientras cabe. Reutilizar la suma dentro del ciclo evita sumarlo desde cero:', String.raw`int mejor = 0;
for (int l = 0; l < n; l++) {
    long long suma = 0;
    for (int r = l; r < n; r++) {
        suma += a[r];
        if (suma > k) break;
        mejor = max(mejor, r - l + 1);
    }
}`, 'Si todo cabe, el código examina aproximadamente n²/2 pares. Además, al cambiar l de 0 a 1 vuelve a visitar casi las mismas sesiones. Podemos conservar una parte del tramo anterior.'),
    text('Mover un tramo sin empezarlo de nuevo', 'Llamaremos ventana al tramo de l a r, incluidos ambos extremos. suma contiene sus duraciones. Primero agregamos a[r]. Si sobra tiempo, retiramos a[l] y avanzamos l, tantas veces como haga falta.\n\nEn el ejemplo, las ventanas son [1], [1,2], [1,2,1], [4] y [1]. Al agregar el 4, la suma pasa a 8. Quitamos 1, luego 2 y luego 1 hasta dejar 4. La mejor longitud encontrada sigue siendo 3.'),
    snippet('Un extremo agrega y el otro retira', 'r recorre las sesiones nuevas. l solamente avanza cuando la ventana excede el presupuesto:', String.raw`int l = 0, mejor = 0;
long long suma = 0;
for (int r = 0; r < n; ++r) {
    suma += a[r];
    while (l <= r && suma > k) suma -= a[l++];
    mejor = max(mejor, r - l + 1);
}`, 'a[l++] primero usa el valor de l y luego aumenta l. Puedes escribirlo en dos líneas si te resulta más claro. Cuando una sesión sola no cabe, l pasa a r+1 y la longitud queda en cero.'),
    text('Por qué no tenemos que regresar', 'Las duraciones son no negativas. Si un inicio produjo una suma demasiado grande, agregar más sesiones no lo arreglará. Por eso descartarlo es seguro.\n\nCada sesión entra una vez por la derecha y sale como máximo una vez por la izquierda. El while puede hacer muchas vueltas en una llegada, pero hace como máximo n retiradas en toda la ejecución: tiempo O(n), memoria O(n). Con [6,−5,2] y presupuesto 3, en cambio, retirar el 6 perdería el tramo completo. El requisito de no negativos es necesario.'),
    program(l, 'Leemos las duraciones, mantenemos la ventana y actualizamos mejor solo después de que vuelva a caber.', 'Prueba [0,0,0] con presupuesto 0: deben caber tres sesiones. Prueba [5] con presupuesto 4: la respuesta es cero.'),
    detail(l, 6),
    snippet('Buscar una pareja con extremos opuestos', 'Para esa variante, a debe estar ordenado y queremos dos posiciones distintas cuya suma sea T. Ahora los índices se acercan:', String.raw`int izquierda = 0, derecha = n - 1;
while (izquierda < derecha) {
    long long s = a[izquierda] + a[derecha];
    if (s == T) break;
    if (s < T) izquierda++;
    else derecha--;
}`, 'Una suma pequeña descarta el extremo izquierdo; una grande descarta el derecho. Esta regla resuelve la pregunta de una pareja, no la del tramo consecutivo.'),
    detail(l, 7),
  ]),
  'usaco-silver-binary-search-sorted-array': l => page([
    problem(l, 'En [2,4,4,7,9], el primer valor de al menos 6 es 7, en la posición 3. No estamos buscando un 6 exacto. Si x fuera 10, responderíamos 5, el tamaño del arreglo.'),
    snippet('Leer desde el principio hasta encontrar uno', 'La solución directa devuelve el primer índice que cumple, o n si termina la lista:', String.raw`int respuesta = 0;
while (respuesta < n && a[respuesta] < x) respuesta++;`, 'Es correcta, pero puede revisar n valores. El orden permite eliminar mitades completas: si a[m] es menor que x, todos los valores anteriores también lo son.'),
    detail(l, 5),
    snippet('Conservar la frontera que puede servir', 'l es el primer índice todavía pendiente; r es una respuesta que sirve o el final n. No incluimos r en lo que falta revisar:', binaryLoop, 'El centro siempre pertenece a [l,r). Si falla, descartamos hasta m con l=m+1. Si sirve, r=m lo conserva como posible primera respuesta. Cuando l=r, ya no queda nada antes de esa frontera por comprobar.'),
    detail(l, 7),
    program(l, 'El programa imprime el índice l, sin leer a[l]. Eso permite devolver n cuando no existe un valor suficiente y devolver 0 cuando la lista está vacía.', 'Para x=4 en el ejemplo debe imprimir 1, no 2. Para x=1 imprime 0. La búsqueda cuesta O(log(n+1)); leer los valores cuesta O(n).'),
    detail(l, 1),
    snippet('Pedir las dos fronteras a C++', 'lower_bound busca el primer valor al menos x. upper_bound busca el primero mayor que x. En un vector podemos restar iteradores para obtener posiciones:', String.raw`int primero = lower_bound(a.begin(), a.end(), x) - a.begin();
int despues = upper_bound(a.begin(), a.end(), x) - a.begin();
cout << despues - primero << '\n';`, 'En [2,4,4,7,9], para x=4 obtenemos primero=1 y despues=3. La diferencia 2 cuenta las apariciones. Incluye <algorithm> para usar estas funciones.'),
    detail(l, 6),
  ]),
  'usaco-silver-binary-search': l => page([
    problem(l, 'Con [2,3,4,2] y dos viajes, capacidad 5 obliga a separar [2,3], [4], [2]: serían tres viajes. Capacidad 6 permite [2,3] y [4,2]. Queremos demostrar que 6 es la menor que funciona.'),
    text('Probar capacidades una por una', 'Podríamos empezar con la capacidad del paquete más pesado y aumentarla de uno en uno hasta lograr el transporte. Para cada prueba recorremos los paquetes. Pero la suma de pesos puede alcanzar 200 000 millones: no podemos hacer tantos intentos.\n\nSeparemos dos tareas: comprobar una capacidad propuesta y elegir cuál probar después. Primero escribiremos una comprobación que podamos ejecutar y entender por sí sola.'),
    snippet('Comprobar si una capacidad alcanza', 'c es la capacidad propuesta. carga suma los paquetes del viaje actual. Cuando el siguiente no cabe, abrimos otro viaje:', String.raw`auto ok = [&](long long c) {
    int grupos = 1;
    long long carga = 0;
    for (auto x : a) {
        if (carga + x > c) {
            grupos++;
            carga = 0;
        }
        carga += x;
    }
    return grupos <= k;
};`, 'auto ok crea una función que devuelve verdadero o falso; [&] le permite leer a y k. Solo la llamaremos con c al menos igual al peso máximo, de modo que cada paquete quepa por sí solo. Con c=5, grupos termina en 3; con c=6, en 2.'),
    detail(l, 5),
    text('Una capacidad mayor conserva cualquier acomodo válido', 'Si todos los bloques caben con capacidad 6, esos mismos bloques caben con 7, 8 o 9. Al aumentar la capacidad, las respuestas a ok tienen la forma «no, no, …, sí, sí». Solo buscamos dónde empieza el sí.\n\nEl límite inferior l será el mayor peso. El superior r será la suma: una capacidad que seguro permite llevar todo en una sola carga. Para el ejemplo empezamos en [4,11]. Probamos 7, funciona; probamos 5, falla; probamos 6, funciona. Queda [6,6].'),
    snippet('Elegir la siguiente capacidad', 'Si m funciona, también podría funcionar algo menor, así que conservamos m como límite superior. Si falla, necesitamos al menos m+1:', String.raw`while (l < r) {
    long long m = l + (r - l) / 2;
    if (ok(m)) r = m;
    else l = m + 1;
}`, 'La búsqueda nunca descarta la menor capacidad suficiente. Cada paso reduce aproximadamente a la mitad el intervalo de candidatos.'),
    program(l, 'Al leer los pesos calculamos los dos límites. La función ok realiza los viajes y la búsqueda imprime la primera capacidad que acepta.', 'Con un solo viaje la respuesta es la suma. Con k=n, es el mayor peso. Hacemos O(log S) comprobaciones de O(n), donde S es la suma; usamos O(n) memoria y long long para las cargas.'),
    detail(l, 7),
  ]),
};
