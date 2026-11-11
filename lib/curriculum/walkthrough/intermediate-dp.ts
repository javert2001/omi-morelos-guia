import { page, text, snippet, problem, program, detail, type Walkthrough } from './intermediate-helpers.ts';

export const dpWalkthroughs: Record<string, Walkthrough> = {
  'programacion-dinamica': l => ({ ...page([
    problem(l, 'Los costos son [5,1,9,2]. Conviene saltar de 0 a 2 y de 2 a 4: pagamos 1+2=3. Solo pagas donde aterrizas; la plataforma que saltas por encima no cobra.'),
    text('Probar todos los recorridos repite preguntas', 'Podríamos probar un salto de uno y otro de dos, repetir desde cada destino y quedarnos con el menor costo. Pero las dos ramas pronto preguntan lo mismo: cuánto cuesta llegar a una misma plataforma.\n\nEn vez de guardar cada recorrido, guardaremos d[i], el menor costo para llegar exactamente a i. Esa frase define el estado de nuestra programación dinámica: cada casilla responde una pregunta más pequeña del problema.'),
    text('Mirar solamente el último salto', 'Para terminar en la plataforma i, el último salto viene de i−1 o de i−2. No hay otra posibilidad. En ambos casos pagamos el costo c de i, así que elegimos el menor costo anterior y le sumamos c.\n\nEmpezamos con d[0]=0. Para el ejemplo: d[1]=5; d[2]=1+min(5,0)=1; d[3]=9+min(1,5)=10; d[4]=2+min(10,1)=3. Los costos anteriores ya están resueltos cuando los necesitamos.'),
    snippet('Llenar una casilla después de las que necesita', 'El vector empieza con ceros. Para cada i, primero consideramos llegar desde i−1. Solo si i≥2 podemos considerar i−2:', String.raw`vector<long long> d(n + 1);
for (int i = 1; i <= n; i++) {
    long long c;
    cin >> c;
    d[i] = c + d[i - 1];
    if (i >= 2) d[i] = min(d[i], c + d[i - 2]);
}`, 'No escribimos d[i−2] para i=1 porque sería un índice negativo. Tampoco contamos cuántas rutas existen: min elige un costo, mientras una suma de cantidades respondería otra pregunta.'),
    text('Por qué basta conservar el mejor costo', 'Si dos recorridos llegan a i, pero uno costó más, ambos tienen exactamente las mismas opciones de saltos futuros. El caro no podrá volverse mejor usando una continuación que el barato también puede usar. Podemos olvidarlo.\n\nAl calcular d[i] comparamos los dos últimos saltos posibles y usamos la mejor manera de llegar a cada origen. Si las casillas anteriores son correctas, d[i] también lo es. Partimos de d[0]=0, que sí es correcto, y avanzamos en orden.'),
    program(l, 'main no necesita guardar todos los costos de entrada: cada c se usa al calcular la plataforma correspondiente. d conserva las respuestas que harán falta después.', 'Tiempo O(n), memoria O(n). Con n=0, d[0] vale cero. Cambia el último costo de 2 a 20: el menor total pasa a 21, porque todas las rutas deben pagar la plataforma final.'),
    text('El mismo razonamiento en el problema de monedas', 'Ahora quieres formar una cantidad s con monedas de valores dados, usando la menor cantidad de monedas. Define dp[s] como ese mínimo. La última moneda podría valer c, de modo que el candidato es dp[s−c]+1, siempre que s−c sea alcanzable.\n\nUsa dp[0]=0 y un valor INF para cantidades todavía imposibles. Con monedas [1,3,4], dp[6]=2 porque puedes agregar una moneda 3 a la solución de cantidad 3. Elegir siempre la moneda mayor daría 4+1+1 y necesitaría tres.'),
    snippet('No confundir imposible con costo cero', 'Este fragmento calcula cantidades de 1 a objetivo. INF es un número mayor que cualquier respuesta posible:', String.raw`vector<int> dp(objetivo + 1, INF);
dp[0] = 0;
for (int s = 1; s <= objetivo; s++) {
    for (int c : monedas) {
        if (c <= s && dp[s - c] != INF)
            dp[s] = min(dp[s], dp[s - c] + 1);
    }
}`, 'Esta variante permite repetir monedas porque una cantidad menor puede haber usado ya la misma denominación. Si cada moneda solo se puede usar una vez, el orden y el estado deben cambiar, como veremos en mochila.'),
  ]), title: 'Programación dinámica: saltos y monedas' }),
  'usaco-gold-divisibility': l => page([
    problem(l, 'Queremos repartir 84 y 126 objetos en paquetes del mismo tamaño, sin sobrantes en ninguno de los dos grupos. Los paquetes más grandes posibles tienen 42 objetos: 84=2·42 y 126=3·42.'),
    text('Probar tamaños uno por uno', 'd divide a a cuando a%d=0, es decir, la división no deja residuo. Podríamos probar todos los d de 1 hasta min(a,b), conservando el mayor que divida a ambos. Para valores de un millón de millones sería demasiado lento.\n\nSi un tamaño divide a 84 y a 126, también divide su diferencia, 42. Y si divide 84 y 42, divide 84+42=126. Podemos reemplazar un número por lo que sobra sin cambiar los divisores comunes.'),
    snippet('Repetir divisiones en vez de restas', 'Euclides reemplaza (a,b) por (b,a%b) hasta que b queda en cero:', String.raw`long long euclides(long long a, long long b) {
    while (b != 0) {
        long long resto = a % b;
        a = b;
        b = resto;
    }
    return a;
}`, 'Para (84,126) obtenemos (126,84), luego (84,42), luego (42,0). Todo número divide a 0, así que el mayor divisor común de 42 y 0 es 42. Nunca dividimos entre cero: la condición del while lo impide.'),
    detail(l, 5),
    program(l, 'C++17 ofrece gcd en <numeric>. El programa completo usa esa función; puedes reemplazar gcd(a,b) por euclides(a,b) después de pegar la función anterior.', 'Euclides usa O(log(max(a,b))) operaciones y O(1) memoria. Prueba 0 17: debe devolver 17. Para calcular mcm(a,b), divide primero a/gcd(a,b) y después multiplica por b, comprobando que el resultado quepa en el tipo.'),
    text('De divisores a números primos', 'Un primo es un entero mayor que 1 cuyos únicos divisores positivos son 1 y él mismo. Para comprobar un número x, basta buscar divisores hasta su raíz cuadrada: si x=u·v y ambos fueran mayores que √x, su producto sería mayor que x.\n\nPodemos aprovechar la misma idea para factorizar: mientras un divisor d siga dividiendo a x, retiramos una copia. Al terminar, si queda un x>1, ese resto es primo.'),
    snippet('Retirar factores repetidos', 'La comparación d<=x/d evita calcular d*d si pudiera desbordarse:', String.raw`for (long long d = 2; d <= x / d; d++) {
    int exponente = 0;
    while (x % d == 0) {
        x /= d;
        exponente++;
    }
    if (exponente) cout << d << ' ' << exponente << '\n';
}
if (x > 1) cout << x << " 1\n";`, 'Con 84 retiramos dos copias de 2, una de 3 y queda 7: 84=2²·3·7. Si necesitas primos para muchos números pequeños, repetir esto puede costar más que preparar una criba.'),
    detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-modular': l => page([
    problem(l, '4⁵=1024. Al dividirlo entre 7 sobran 2, así que esa es la salida. Para exponentes enormes no podemos construir la potencia completa ni hacer una multiplicación por cada unidad del exponente.'),
    snippet('Multiplicar una vez por cada factor', 'Con un exponente pequeño podríamos conservar solamente el residuo después de cada producto:', String.raw`long long r = 1 % m;
for (long long i = 0; i < e; i++) r = r * a % m;`, 'Reducir después de multiplicar conserva el residuo final, pero este ciclo todavía hace e vueltas. Necesitamos usar la estructura del exponente.'),
    text('Armar una potencia con cuadrados', 'Cinco se escribe 4+1. Entonces a⁵=a⁴·a. Para obtener a⁴ podemos cuadrar a una vez y cuadrar el resultado otra vez. No necesitamos formar a²,a³,a⁴,a⁵ por separado.\n\nCon a=4 módulo 7, las potencias de exponentes 1,2,4 tienen residuos 4,2,4. Multiplicamos las correspondientes a 4 y 1: 4·4 deja residuo 2. Los bits de e nos dicen qué potencias usar.'),
    snippet('Consumir un bit del exponente en cada vuelta', 'r guarda el producto de las potencias ya elegidas. a guarda la potencia correspondiente al bit que estamos leyendo:', String.raw`a = (a % m + m) % m;
long long r = 1 % m;
while (e) {
    if (e & 1) r = r * a % m;
    a = a * a % m;
    e >>= 1;
}`, 'e&1 pregunta si el último bit vale uno. e>>=1 lo retira, lo mismo que dividir e entre dos descartando el residuo. Para e=5, usamos a, omitimos a² y usamos a⁴. La normalización inicial permite bases negativas.'),
    program(l, 'El programa conserva siempre residuos entre 0 y m−1. Los límites elegidos aseguran que multiplicar dos residuos cabe en long long.', 'Hace O(log(e+1)) vueltas y usa O(1) memoria. Si e=0, no entra al ciclo y devuelve 1%m. Si m=1, todos los residuos son cero, incluida esa respuesta.'),
    detail(l, 4),
    text('Dividir no es borrar un factor sin más', 'La igualdad 2·3≡6 módulo 8 no autoriza dividir ambos lados por 2 usando la división entera de residuos. Para deshacer una multiplicación por b necesitamos un número inverso u tal que b·u deje residuo 1.\n\nMódulo 7, el inverso de 3 es 5 porque 3·5=15 deja 1. Dividir por 3 equivale a multiplicar por 5. Módulo 8, 2 no tiene inverso: todos sus productos son pares y nunca dejan residuo 1.'),
    detail(l, 2), detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-combo': l => page([
    problem(l, 'Un comité no tiene orden interno: elegir a Ana, Beto y Carla es lo mismo que elegir a Carla, Ana y Beto. Entre siete estudiantes hay 35 comités de tres. Queremos contarlos sin enumerar todas sus máscaras.'),
    text('Separar equipos que incluyen a una persona', 'Fija a la última estudiante. Un comité de k integrantes o la incluye o no la incluye. Si la incluye, faltan k−1 personas entre las otras n−1. Si no, faltan k entre esas mismas n−1.\n\nLlamamos C(n,k) al número buscado. Entonces C(n,k)=C(n−1,k−1)+C(n−1,k). Los dos grupos no se mezclan y entre ambos contienen todos los comités. C(n,0)=1 porque hay un solo comité vacío.'),
    text('Ver las primeras filas antes de programar', 'Para cero estudiantes la fila es [1]. Al agregar uno, queda [1,1]. Con dos, [1,2,1]; con tres, [1,3,3,1]. Cada entrada interior suma las dos que tiene arriba en la fila anterior. Esto se llama triángulo de Pascal.\n\nEnumerar máscaras costaría O(2ⁿ). Usar la fórmula n!/(k!(n−k)!) parece corto, pero 60! no cabe en long long aunque C(60,30) sí. Pascal evita esos factoriales enormes.'),
    snippet('Guardar solamente la fila actual', 'c[j] guarda C(i,j) después de procesar i estudiantes. Para actualizar necesitamos los valores de la fila anterior:', String.raw`vector<long long> c(k + 1);
c[0] = 1;
for (int i = 1; i <= n; i++) {
    for (int j = min(i, k); j >= 1; j--) {
        c[j] += c[j - 1];
    }
}`, 'Recorremos j hacia abajo. Así c[j−1] todavía pertenece a la fila anterior. Con una sola persona, recorrer hacia arriba podría usarla repetidamente al llenar varios tamaños de comité.'),
    program(l, 'Calculamos solo las columnas hasta k, porque no necesitamos equipos más grandes. Al terminar, c[k] es C(n,k).', 'Tiempo O(nk), memoria O(k). Con n≤60 todas estas combinaciones caben en long long. k=0 y k=n deben producir 1.'),
    detail(l, 4), detail(l, 5), detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-intro-dp': l => page([
    problem(l, 'Para llegar a altura 3 hay tres secuencias: 1+1+1, 1+2 y 2+1. Las dos últimas son diferentes porque los saltos ocurren en otro orden. A altura 5 llegamos de ocho maneras.'),
    text('Una recursión que repite la misma pregunta', 'Para llegar a n, el último salto mide uno o dos. Podemos contar primero las rutas hasta n−1 y después las rutas hasta n−2. Pero si abrimos esa recursión sin guardar respuestas, las dos ramas vuelven a preguntar por muchas alturas iguales.\n\nLa programación dinámica conserva esas respuestas. Definimos dp[i] como la cantidad de secuencias que llegan exactamente a la altura i. Ya no guardamos cada secuencia completa.'),
    text('Contar según el último salto', 'Las secuencias que terminan con un salto de uno vienen de i−1; las que terminan con uno de dos vienen de i−2. Son grupos distintos. Por eso sumamos dp[i−1]+dp[i−2].\n\nAntes de movernos hay una secuencia vacía, así que dp[0]=1. Luego dp[1]=1, dp[2]=2, dp[3]=3, dp[4]=5 y dp[5]=8. Si hubiéramos puesto cero en dp[0], no aparecería ninguna ruta al comenzar.'),
    snippet('Calcular en orden de altura', 'Cada casilla usa solo las dos anteriores. Empezamos en la altura 1 para que dp[0] conserve su significado:', String.raw`vector<long long> dp(n + 1);
dp[0] = 1;
for (int i = 1; i <= n; i++) {
    dp[i] = dp[i - 1];
    if (i >= 2) dp[i] += dp[i - 2];
}`, 'Para i=1 no existe un origen i−2 válido, por eso omitimos esa contribución. En i=5 sumamos 5 rutas que terminaban en 4 y 3 que terminaban en 3: ocho rutas diferentes.'),
    program(l, 'La tabla se llena una sola vez y el programa imprime dp[n]. No hay restricciones entre saltos: puedes dar dos saltos de dos seguidos.', 'El tiempo es O(n), memoria O(n). Para n≤90 la respuesta cabe en long long; para límites mayores necesitarías otro tipo de entero o un módulo, según lo que pida el enunciado.'),
    detail(l, 4), detail(l, 5), detail(l, 6),
    text('Qué cambia si el enunciado agrega una condición', 'Si no puedes dar dos saltos de dos seguidos, la altura deja de ser suficiente. Llegar a 4 con último salto de uno permite opciones distintas que llegar con último salto de dos.\n\nEntonces guarda dp[i][ultimo], donde ultimo indica el tamaño del último salto. El estado necesita recordar aquello del pasado que cambia las opciones futuras, pero no necesita guardar la ruta entera. El ejercicio de razonamiento aplica precisamente ese cambio.'),
  ]),
  'usaco-gold-knapsack': l => page([
    problem(l, 'Con capacidad 6 y objetos (peso,valor) de (2,3), (3,4), (4,5), conviene llevar el primero y el tercero: pesan 6 y valen 8. No podemos tomar dos copias del primero; solo hay una de cada objeto.'),
    text('Probar cada selección', 'Enumerar tomar o no tomar cada objeto revisa 2ⁿ selecciones. Para n=100 es demasiado. En cambio, W no supera 10 000: podemos resolver una pregunta por capacidad.\n\nDespués de revisar algunos objetos, dp[c] guardará el mayor valor que podemos llevar con capacidad máxima c. Elegir nada siempre está permitido, así que inicialmente todas las entradas valen cero.'),
    text('Decidir si usamos el objeto nuevo', 'Supón que el nuevo objeto pesa w y vale v. Para una capacidad c tenemos dos posibilidades: dejarlo fuera y conservar dp[c], o incluirlo y agregar v a la mejor selección anterior de capacidad c−w.\n\nCon el primer objeto (2,3), dp[0] y dp[1] quedan en cero; las capacidades 2 a 6 pueden valer 3. Tras (3,4), la capacidad 5 alcanza valor 7. Tras (4,5), capacidad 6 alcanza 8 usando el objeto de peso 2.'),
    snippet('Actualizar de derecha a izquierda', 'El código considera todas las capacidades donde el objeto cabe:', String.raw`for (int c = W; c >= w; c--) {
    dp[c] = max(dp[c], dp[c - w] + v);
}`, 'Recorrer hacia abajo conserva dp[c−w] de antes de este objeto. Si recorrieras hacia arriba, con w=2 y v=3 pondrías dp[2]=3 y luego dp[4]=6 usando ese valor recién escrito: habrías elegido el mismo objeto dos veces.'),
    program(l, 'Cada objeto de entrada produce una pasada descendente de capacidades. Al final, dp[W] acepta cualquier peso total de hasta W.', 'Tiempo O(nW), memoria O(W). Los valores usan long long porque se suman muchos objetos. Si W=0 o n=0, la respuesta es cero.'),
    detail(l, 4),
    text('Si hay copias ilimitadas, cambia el orden', 'Cuando puedes usar el objeto cuantas veces quieras, sí quieres que dp[c−w] pueda contener otra copia. En esa variante recorres c desde w hasta W. La dirección del ciclo representa una regla del enunciado, no un detalle intercambiable de programación.\n\nSi necesitas peso exactamente c, las casillas imposibles ya no pueden empezar en cero: usa un valor negativo que indique «inalcanzable» y deja solamente dp[0]=0.'),
    detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-paths-grids': l => page([
    problem(l, 'El tablero tiene una pared en la segunda fila y segunda columna. Solo permitimos avanzar abajo o derecha, nunca regresar. En el ejemplo hay cuatro maneras de llegar al destino sin pisar la pared.'),
    text('Seguir cada camino puede repetir muchos sufijos', 'Podríamos probar abajo y derecha desde cada punto. Pero muchas rutas pasan por la misma casilla y después tienen exactamente las mismas opciones. Guardaremos cuántas rutas llegan a cada casilla.\n\nPara una casilla libre, el último movimiento viene de arriba o de la izquierda. Esas posibilidades no se mezclan. Por eso su cantidad es la suma de las cantidades de esos dos vecinos; una pared tiene cantidad cero.'),
    text('Llenar el ejemplo a mano', 'La primera fila tiene [1,1,1,1]: solo podemos avanzar a la derecha. La segunda queda [1,0,1,2], porque la pared bloquea la segunda casilla. La tercera queda [1,1,2,4]. La última entrada es la respuesta.\n\nEl 1 inicial cuenta el único comienzo en el origen, antes de moverse. Si el origen es pared, debe valer cero. Los bordes solo reciben rutas desde el vecino que sí existe.'),
    snippet('Reutilizar una fila de memoria', 'Antes de actualizar la columna c, dp[c] conserva la respuesta de arriba. dp[c−1], ya actualizado, contiene la respuesta de la izquierda en la fila actual:', String.raw`if (s[c] == '#') dp[c] = 0;
else if (r == 0 && c == 0) dp[c] = 1;
else if (c) dp[c] = (dp[c] + dp[c - 1]) % 1000000007;`, 'Cuando c=0 no sumamos una izquierda inexistente: el valor de arriba permanece. Una pared debe escribir cero, no solo saltarse, porque el valor guardado de la fila anterior ya no puede atravesarla.'),
    program(l, 'main lee una fila s a la vez y actualiza dp de izquierda a derecha. Al terminar, dp[m−1] corresponde a la esquina inferior derecha.', 'Tiempo O(nm), memoria O(m). Reducir módulo 1 000 000 007 después de cada suma conserva el residuo solicitado. En un tablero 1×1 libre hay una ruta vacía; si está bloqueado, ninguna.'),
    detail(l, 4), detail(l, 6),
  ]),
  'usaco-gold-lis': l => page([
    problem(l, 'En [4,7,9,2,5,8], podemos elegir [4,7,9] o [2,5,8], ambas de longitud 3. Una subsecuencia permite saltar elementos, pero no reordenarlos: [2,4,5,7,8,9] no es una respuesta válida.'),
    snippet('Una solución que compara posiciones anteriores', 'Define dp[i] como la mayor longitud de una subsecuencia creciente que termina exactamente en i. Prueba el elemento anterior que podría ir antes:', String.raw`vector<int> dp(n, 1);
int respuesta = 0;
for (int i = 0; i < n; i++) {
    for (int j = 0; j < i; j++)
        if (a[j] < a[i]) dp[i] = max(dp[i], dp[j] + 1);
    respuesta = max(respuesta, dp[i]);
}`, 'Es correcta: toda subsecuencia que termina en i tiene algún penúltimo elemento j, salvo la de un solo elemento. Cuesta O(n²), demasiado para 200 000 valores. Ahora cambiaremos qué pregunta guarda la tabla.'),
    text('Para cada longitud, guardar el final más pequeño', 'Entre subsecuencias de igual longitud conviene conservar la que termina más abajo: será más fácil agregarle un valor mayor. t[0] guardará el menor final de longitud 1, t[1] el de longitud 2, y así sucesivamente.\n\nLeyendo [4,7,9] obtenemos t=[4,7,9]. Al llegar 2, cambiamos el primer final: [2,7,9]. Al llegar 5, queda [2,5,9]. Al llegar 8, queda [2,5,8]. La longitud sigue siendo 3. Reemplazar un final no elimina las longitudes ya alcanzadas.'),
    snippet('Colocar el valor con búsqueda binaria', 'Buscamos el primer final que sea al menos x. Si no existe, x extiende la mayor longitud conocida:', String.raw`auto p = lower_bound(t.begin(), t.end(), x);
if (p == t.end()) t.push_back(x);
else *p = x;`, 'Los finales están ordenados: una subsecuencia más larga necesita un final mayor. Las entradas anteriores a p son menores que x y permiten extender una de ellas. Si x empata con un final, lo reemplaza sin aumentar longitud; necesitamos crecimiento estricto.'),
    program(l, 'El programa procesa las marcas en su orden original. Solo ordenada está la tabla de mejores finales, nunca la entrada.', 'Tiempo O(n log n), memoria O(n). Con [2,2,2] responde 1. Si el problema permitiera igualdad, usarías upper_bound para buscar el primer final estrictamente mayor.'),
    detail(l, 7),
    text('Los finales no siempre forman una subsecuencia', 'Tras leer [3,5,6,1], la tabla es [1,5,6]. Pero el 1 apareció al final: [1,5,6] no existe en ese orden. La tabla guarda una mejor terminación por longitud, no una misma ruta de elecciones.\n\nPara reconstruir una respuesta, guarda qué índice produjo cada final y, por cada elemento, el índice de su predecesor. Al colocar x en la longitud j+1, su predecesor es el índice guardado para longitud j en ese momento. Sigue esos enlaces desde el último elemento y después invierte la lista.'),
  ]),
  'usaco-gold-dp-bitmasks': l => page([
    problem(l, 'En el ejemplo, asignamos al estudiante 0 la tarea 1, al 1 la tarea 0 y al 2 la tarea 2. Los costos son 1+2+2=5. Las filas representan estudiantes y las columnas tareas; ninguna tarea se repite.'),
    text('Evitar revisar todas las permutaciones', 'Probar n opciones para el primer estudiante, n−1 para el siguiente y así sucesivamente produce n! asignaciones. Con 18 estudiantes son demasiadas.\n\nProcesaremos siempre los estudiantes en orden. Después de asignar a los primeros k, solo importa qué tareas quedaron ocupadas. El orden en que llegaron a ocuparse no afecta las opciones de los estudiantes siguientes. Una máscara puede guardar ese conjunto.'),
    text('Definir una casilla por conjunto de tareas', 'd[mask] será el menor costo para asignar las tareas encendidas en mask a los primeros k estudiantes, donde k es la cantidad de bits encendidos. d[0]=0 porque no hemos asignado nada.\n\nEn el ejemplo, elegir tarea 1 para estudiante 0 lleva de 000 a 010 con costo 1. Elegir tarea 0 para estudiante 1 lleva a 011 con costo 3. Elegir tarea 2 para estudiante 2 termina en 111 con costo 5.'),
    snippet('Contar quién sigue y probar tareas libres', 'k cuenta los bits de mask. Cada operación bits&=bits−1 quita su bit encendido más a la derecha:', String.raw`int k = 0;
for (int bits = mask; bits; bits &= bits - 1) k++;
if (k < n) {
    for (int j = 0; j < n; j++) {
        if (!(mask & (1 << j))) {
            int nueva = mask | (1 << j);
            d[nueva] = min(d[nueva], d[mask] + c[k][j]);
        }
    }
}`, 'La condición comprueba que j siga libre. nueva enciende ese bit; c[k][j] paga la asignación del estudiante que toca. Agregar un bit aumenta el número de máscara, por lo que recorrer mask de menor a mayor respeta las dependencias.'),
    program(l, 'Inicializamos las máscaras no resueltas con INF, un costo mayor que cualquier solución. La respuesta está en z−1, que tiene encendidos los n bits.', 'Hay 2ⁿ estados y hasta n tareas por estado: O(n·2ⁿ) tiempo, O(2ⁿ) memoria. Los costos totales usan long long. Cada asignación completa se puede construir siguiendo este orden de estudiantes.'),
    detail(l, 2), detail(l, 7),
  ]),
  'usaco-gold-dp-ranges': l => page([
    problem(l, 'Para [2,1,3], unir primero 2 y 1 cuesta 3; luego unir 3 y 3 cuesta 6. Total: 9. Si empiezas por 1 y 3, pagas 4+6=10. El orden de las fusiones sí cambia el costo.'),
    text('La restricción de vecinos importa', 'En el problema de archivos podíamos unir cualesquiera dos. Aquí solo se unen vecinos: escoger los dos menores aunque estén separados sería una operación inválida.\n\nEnumerar todas las secuencias de fusiones repite la tarea de unir un mismo tramo. Guardaremos d[l][r], el menor costo para convertir los montones desde l hasta r, ambos incluidos, en uno solo. Un intervalo de un montón cuesta cero: no requiere fusionar.'),
    text('Pensar en la última unión del intervalo', 'Justo antes de dejar un único montón, hay dos: uno viene del intervalo l…k y otro de k+1…r. La última unión cuesta la suma de todos los tamaños entre l y r, sin importar cómo se construyeron sus dos partes.\n\nPara [2,1,3], el corte k=0 cuesta 0+4+6=10. El corte k=1 cuesta 3+0+6=9. Probamos todos los cortes y elegimos el menor. No falta ninguna solución: toda última unión tiene algún corte así.'),
    snippet('Calcular el costo de cada corte', 'p guarda sumas de prefijos. Así el peso del intervalo es p[r+1]-p[l] y no necesita otro recorrido:', String.raw`d[l][r] = 4000000000000000000LL;
for (int k = l; k < r; k++) {
    long long costo = d[l][k] + d[k + 1][r] + p[r + 1] - p[l];
    d[l][r] = min(d[l][r], costo);
}`, 'El primer término une la izquierda, el segundo la derecha y el tercero paga unir los dos resultados. k nunca llega a r: ambas partes deben contener al menos un montón.'),
    snippet('Resolver primero los intervalos cortos', 'Las dos partes de cualquier corte son más cortas que el intervalo completo. Por eso ordenamos el cálculo por longitud:', String.raw`for (int len = 2; len <= n; len++) {
    for (int l = 0; l + len <= n; l++) {
        int r = l + len - 1;
        // Calcular d[l][r] probando sus cortes.
    }
}`, 'Las longitudes de uno ya tienen costo cero. Después calculamos dos, tres y así hasta n. Cuando tratamos un intervalo, todas las respuestas que necesita ya existen.'),
    program(l, 'El programa construye prefijos, prepara la tabla cuadrada y llena los intervalos en ese orden. d[0][n−1] une toda la fila.', 'Hay O(n²) intervalos y hasta O(n) cortes en cada uno: O(n³) tiempo y O(n²) memoria. Con n=1 la respuesta es cero. No confundas la suma del montón final con el costo acumulado de crearlo.'),
    detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-digit-dp': l => page([
    problem(l, 'Hasta 23, las sumas de cifras divisibles por 3 corresponden a 0,3,6,9,12,15,18,21: ocho números. Incluimos cero. No vamos a probar todos los enteros hasta N cuando N puede tener diecinueve cifras.'),
    text('Construir cifras en lugar de enumerar números', 'Imagina escribir todas las representaciones con la misma longitud que N. Para N=23 escribimos 00,01,…,23. Los ceros del comienzo no cambian la suma de cifras y cada número tiene una representación única.\n\nAl elegir la siguiente cifra necesitamos dos datos: el residuo de la suma que llevamos y si nuestro prefijo sigue igual al de N. Si ya es menor, podemos usar cualquier cifra de 0 a 9; si sigue igual, no podemos sobrepasar la cifra de N.'),
    text('Seguir el límite 23', 'En la primera posición puedes elegir 0,1 o 2. Si eliges 0 o 1, la segunda cifra puede ir hasta 9. Si eliges 2, solo puede llegar hasta 3. Elegir 24 estaría fuera del límite.\n\ndp[eq][r] contará cuántos prefijos tienen residuo r y si siguen iguales al límite: eq=1 para iguales y eq=0 para menores. Antes de escribir, hay un prefijo vacío de suma cero que empata: dp[1][0]=1.'),
    snippet('Extender cada grupo de prefijos con una cifra', 'ch es la cifra actual de N. nd guarda el siguiente paso, separado de dp para no mezclar longitudes:', String.raw`int lim = eq ? ch - '0' : 9;
for (int d = 0; d <= lim; d++) {
    int nuevoEq = eq && (d == ch - '0');
    int nuevoResiduo = (r + d) % D;
    nd[nuevoEq][nuevoResiduo] += dp[eq][r];
}`, 'Elegir d agrega esa cifra a todos los prefijos contados en dp[eq][r]. No sumamos d a la cantidad de números: lo sumamos al residuo. nuevoEq solo es uno si antes empatábamos y volvemos a elegir la misma cifra.'),
    text('Por qué podemos juntar prefijos distintos', 'Dos prefijos con la misma longitud, residuo y marca eq permiten exactamente las mismas cifras futuras, y cada continuación produce el mismo cambio de residuo. No necesitamos conocer las cifras anteriores por separado.\n\nCada entero permitido se construye eligiendo sus cifras una vez. Al finalizar, sumamos dp[0][0] y dp[1][0]: ambos tienen suma divisible por D; uno está por debajo de N y el otro coincide con N.'),
    program(l, 'Por cada cifra creamos nd llena de ceros, extendemos todos los estados y la intercambiamos con dp. La respuesta suma los dos estados finales de residuo cero.', 'Tiempo O(cifras·D·10), memoria O(D). El resultado no supera N+1 y cabe en long long con estos límites. Con D=1 todos los números sirven: debe salir N+1.'),
    detail(l, 6), detail(l, 3),
  ]),
};
