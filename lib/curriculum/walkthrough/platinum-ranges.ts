import type { PlatinumWalkthrough } from './platinum-helpers.ts';
import { complete, excerpt, walkthrough } from './platinum-helpers.ts';

export const platinumRangeWalkthroughs: Record<string, PlatinumWalkthrough> = {
  'usaco-plat-range-sweep': (lesson) => walkthrough([
    {
      title: 'Cuántos puntos hay dentro de cada parcela',
      body: 'Tenemos cuatro registros de árboles: (1,1), (2,3), (3,2) y otra copia de (2,3). Una parcela es un rectángulo y queremos contar sus registros, incluidos los que tocan el borde. Las dos copias cuentan por separado.\n\nLa entrada contiene n q, después los n puntos y finalmente q rectángulos x1 y1 x2 y2. Debemos imprimir las respuestas en el orden de las preguntas. Puede haber 100 000 puntos y 100 000 consultas; las coordenadas son enteras entre −10⁹ y 10⁹.\n\nPodríamos comparar cada punto con los cuatro límites de cada parcela. Es correcto, pero hace hasta 10 000 millones de comparaciones punto-consulta. Buscaremos cómo aprovechar que los puntos son fijos y conocemos todas las preguntas.',
      picture: { caption: 'La primera parcela es [1,2] × [1,3].', rows: [
        { label: 'Registro', values: ['A', 'B', 'C', 'D'] },
        { label: '(x,y)', values: ['(1,1)', '(2,3)', '(3,2)', '(2,3)'] },
        { label: 'Dentro', values: ['sí', 'sí', 'no', 'sí'], highlight: [0, 1, 3] },
      ] },
    },
    {
      title: 'Primero resolvamos una pregunta con dos límites',
      body: 'Llamemos F(X,Y) a la cantidad de puntos con x ≤ X e y ≤ Y. Esta región se extiende hacia la izquierda y hacia abajo; no tiene los otros dos bordes de una parcela.\n\nImagina mover una línea vertical de izquierda a derecha. Al llegar a X = 1, solo incorporamos (1,1). Al llegar a X = 2, incorporamos las dos copias de (2,3). Entonces F(2,2) = 1 y F(2,3) = 3. La línea no necesita retroceder si ordenamos las preguntas por X. A este recorrido ordenado lo llamamos **barrido**.\n\nGuardaremos las alturas y de los puntos incorporados en un Fenwick de frecuencias. Preguntar cuántos tienen y ≤ Y se convierte en consultar un prefijo.',
    },
    {
      title: 'De un rectángulo a cuatro prefijos',
      body: 'Para [x1,x2] × [y1,y2], empieza con F(x2,y2). Sobra la parte con x < x1 y sobra la parte con y < y1. Restamos ambas. La esquina que cumple las dos condiciones se restó dos veces, así que la devolvemos una vez.\n\nLa fórmula es F(x2,y2) − F(x1−1,y2) − F(x2,y1−1) + F(x1−1,y1−1). Restar uno tiene sentido porque las coordenadas son enteras.\n\nEn la parcela [2,3] × [2,3], los cuatro conteos son 4, 1, 1 y 1. Quedan 4−1−1+1 = 3 registros. Creamos cuatro preguntas pequeñas, cada una con su signo y el número de la consulta original.',
      code: excerpt(lesson, '        ev.push_back({X, Y', '    }\n    sort(ev.begin()'), codeKind: 'fragment',
      afterCode: 'En el fragmento, `x,y` son los límites inferiores y `X,Y` los superiores. `id` conserva el destino de cada resultado: ordenar eventos no cambia el orden en que imprimiremos las respuestas.',
    },
    {
      title: 'Las coordenadas grandes se convierten en posiciones pequeñas',
      body: 'Un Fenwick no puede reservar una casilla por cada coordenada hasta 10⁹. Ordenamos las alturas que sí aparecen y quitamos duplicados. En nuestro ejemplo la lista es [1,2,3]. Guardar su posición basta: solo necesitamos comparar alturas, no medir distancias.\n\nPara insertar y usamos lower_bound y sumamos uno, porque Fenwick empieza en uno. Para consultar hasta Y usamos upper_bound: devuelve cuántas alturas son menores o iguales al límite. No hace falta que Y aparezca en la lista.',
      code: excerpt(lesson, '    sort(ys.begin()', '    vector<Event>'), codeKind: 'fragment',
      check: { question: 'Si las alturas posibles son [1,3,8] y el límite es Y = 5, ¿cuántas posiciones del Fenwick consultamos?', answer: 'Las primeras dos, correspondientes a 1 y 3. upper_bound(5) apunta después de ellas. Usar el valor 5 como índice no representaría la lista comprimida.' },
    },
    {
      title: 'Insertar antes de responder',
      body: 'Ordenamos los puntos por x y los eventos por su límite x. El puntero next señala el primer punto que todavía no entró. Antes de responder un evento, insertamos todos los puntos cuya x sea menor o igual a ese límite.\n\nLa igualdad importa: un árbol justo sobre el borde pertenece a la parcela. Cada copia realiza su propio incremento. Después recorremos el prefijo Fenwick y multiplicamos el conteo por el signo del evento.',
      code: excerpt(lesson, '    int next = 0;', '    for (long long z : ans)'), codeKind: 'fragment',
      afterCode: 'Cada punto entra una sola vez. Entre eventos el límite Y puede subir o bajar; eso solo cambia el prefijo consultado. El límite X avanza siempre, por lo que nunca necesitamos retirar puntos.',
    },
    {
      title: 'Por qué cada conteo representa la parcela',
      body: 'Justo antes de responder F(X,Y), Fenwick contiene todos y solo los puntos con x ≤ X. Su prefijo hasta Y conserva exactamente los que además cumplen y ≤ Y. Esa es la propiedad que mantiene el barrido.\n\nLuego los cuatro signos dejan coeficiente uno dentro de la parcela y cero fuera. Un punto situado abajo y a la izquierda, por ejemplo, aporta 1−1−1+1 = 0.\n\nOrdenamos n puntos y 4q eventos, y hacemos operaciones de O(log n) en Fenwick. El tiempo total es O((n+q) log(n+q)) y la memoria O(n+q). La ordenación requiere conocer todas las consultas: no sirve directamente si la siguiente depende de la respuesta anterior.',
    },
    complete(lesson, 'La entrada de prueba contiene nuestras cuatro ubicaciones y tres parcelas. Las dos primeras contienen tres registros y la última ninguno. El programa conserva identificadores para imprimir 3, 3 y 0 en ese orden.', 'Las coordenadas usan long long: los límites inferiores pueden perder una unidad al crear eventos. Prueba una parcela reducida al punto (2,3): debe contar dos. Una parcela fuera de todos los puntos debe contar cero.'),
    {
      title: 'El mismo barrido puede contar cruces',
      body: 'Ahora imagina segmentos verticales y horizontales. Barre por altura: un vertical entra cuando alcanzas su extremo inferior y sale al superar el superior. Mientras está activo, guarda un uno en su coordenada x. Un horizontal pregunta cuántos verticales activos quedan entre sus extremos.\n\nCuando tocar un extremo cuenta, procesa en una misma altura las entradas, después las consultas y al final las salidas. Si ambos extremos se excluyen, procesa salidas, consultas y entradas. Por ejemplo, un vertical desde altura 2 hasta 6 cruza horizontales en 2, 4 y 6 tres veces si los extremos cuentan, y una si no cuentan.\n\nEste modelo cuenta pares vertical-horizontal. Los segmentos inclinados y las superposiciones entre paralelos requieren otra descripción del conjunto activo.',
    },
  ]),
  'usaco-plat-rurq': (lesson) => walkthrough([
    {
      title: 'Sumar a varios lugares de una fila',
      body: 'Una fila de cinco contadores empieza en [0,0,0,0,0]. La operación «1 2 4 3» agrega tres a las posiciones 2, 3 y 4. Queda [0,3,3,3,0]. La operación «2 1 4» pregunta por la suma de las primeras cuatro posiciones: nueve.\n\nLa entrada contiene n q y q operaciones. «1 l r x» suma x en todo [l,r]; «2 l r» pide su suma. Los extremos se incluyen y los índices empiezan en uno. n y q pueden llegar a 200 000, con |x| ≤ 10⁶.\n\nUn for por actualización y otro por consulta resuelven el problema, pero una secuencia puede costar O(nq). Necesitamos representar un cambio largo sin visitar todas sus posiciones.',
      picture: { caption: 'Dos cambios sobre la misma fila.', rows: [
        { label: 'Inicio', values: ['0', '0', '0', '0', '0'] },
        { label: '+3 en [2,4]', values: ['0', '3', '3', '3', '0'], highlight: [1, 2, 3] },
        { label: '−1 en [3,5]', values: ['0', '3', '2', '2', '−1'], highlight: [2, 3, 4] },
      ] },
    },
    {
      title: 'Marcar dónde empieza y termina un aumento',
      body: 'Define la diferencia D[i] = A[i]−A[i−1], tomando A[0] = 0. Para recuperar A[i], suma las diferencias desde uno hasta i: los valores intermedios se cancelan.\n\nAgregar tres en [2,4] solo cambia D[2] en +3 y D[5] en −3. Los prefijos de [0,3,0,0,−3] reconstruyen [0,3,3,3,0]. No importa si el intervalo contiene tres posiciones o cien mil: cambian dos marcas.\n\nUn Fenwick sobre D permite actualizar esas marcas y consultar un valor A[i]. Pero nos piden sumar varios valores de A. Antes de añadir otra estructura, veamos cuántas veces participa cada diferencia.',
    },
    {
      title: 'Derivar la suma de un prefijo',
      body: 'Queremos S(p) = A[1]+…+A[p]. D[1] aparece en los p valores; D[2], en los últimos p−1; D[j], exactamente p−j+1 veces. Por eso S(p) = Σ(j≤p) (p−j+1)D[j].\n\nSeparar p−j+1 en p−(j−1) da S(p) = p·ΣD[j] − Σ(j−1)D[j]. Son dos sumas de prefijos. Guardamos D[j] en el Fenwick b y (j−1)D[j] en el Fenwick c.\n\nDespués de +3 en [2,4], para p = 4 ambos prefijos valen tres: S(4) = 4·3−3 = 9. Para p = 5, b suma cero y c suma −9: el resultado sigue siendo nueve.',
      check: { question: '¿Por qué D[2] se multiplica por tres dentro de S(4)?', answer: 'Porque aparece en A[2], A[3] y A[4]. Su coeficiente es 4−2+1 = 3; la fórmula separada calcula el mismo coeficiente como 4−1.' },
    },
    {
      title: 'Un Fenwick y dos instancias',
      body: 'La estructura BIT guarda sumas. add cambia una diferencia; sum devuelve un prefijo. Los saltos p & -p recorren los bloques habituales de Fenwick. Usamos long long desde el almacenamiento: una suma total puede superar int.\n\nNo estamos guardando dos copias del arreglo A. Cada instancia representa uno de los dos términos de la identidad que acabamos de obtener.',
      code: excerpt(lesson, 'struct BIT', 'int main()'), codeKind: 'fragment',
    },
    {
      title: 'Convertir una operación en cuatro cambios pequeños',
      body: 'change(p,x) modifica la diferencia de la posición p en los dos árboles. Para sumar x en [l,r], llamamos change(l,x) y change(r+1,−x). Si r = n, la segunda marca queda fuera de la fila y la omitimos.\n\nLa función pref aplica la fórmula de S(p). Para obtener [l,r], restamos S(l−1) de S(r). Así desaparece todo lo que quedó antes de l.',
      code: excerpt(lesson, '    BIT b(n)', '    while (q--)'), codeKind: 'fragment',
      afterCode: 'Después de los dos cambios de nuestra tabla, [2,5] suma 3+2+2−1 = 6. La fórmula debe obtener seis aunque haya valores negativos. No usamos las sumas para buscar por frecuencia, así que no necesitamos que sean crecientes.',
    },
    complete(lesson, 'La primera consulta de la entrada imprime nueve. Luego restamos uno en [3,5] y la segunda imprime seis. El programa empieza en ceros; si recibieras un arreglo inicial, cargarías sus diferencias en ambos Fenwick.', 'Cada operación hace un número fijo de cambios o prefijos de O(log n). El total es O(q log n), con O(n) memoria. Con los límites dados, las sumas pueden acercarse a 4·10¹⁶; por eso los productos y resultados son long long. Prueba n = 1 y una consulta antes de cualquier cambio.'),
    {
      title: 'Otra solución: dejar un incremento pendiente',
      body: 'Un árbol de segmentos también puede resolverlo. Cada nodo guarda la suma de su intervalo y un incremento pendiente, llamado lazy. Si un intervalo completo de longitud len recibe +x, su suma aumenta x·len y su pendiente aumenta x.\n\nLa suma del nodo ya es correcta; todavía falta transmitir el cambio a sus hijos. Antes de bajar por una consulta o actualización parcial, lo aplicamos a ambos hijos y borramos la pendiente del padre. Después de modificar hijos, recalculamos la suma del padre.',
      code: 'void aplicar(int v, int L, int R, long long x) {\n    suma[v] += x * (R - L + 1);\n    lazy[v] += x;\n}\nvoid repartir(int v, int L, int R) {\n    if (L == R) return;\n    int M = (L + R) / 2;\n    aplicar(2*v, L, M, lazy[v]);\n    aplicar(2*v+1, M+1, R, lazy[v]);\n    lazy[v] = 0;\n}', codeKind: 'fragment',
      afterCode: 'Estas funciones pertenecen a la alternativa con árbol, no al programa de dos Fenwick. Una actualización ignora nodos disjuntos, aplica directamente si cubre todo el nodo y, en otro caso, reparte y visita los hijos. Esa división produce O(log n) nodos relevantes por operación.',
    },
    {
      title: 'Si también podemos asignar un valor',
      body: 'Una etiqueta de suma no describe «poner todo en cinco». Para admitir asignaciones guarda si hay una asignación pendiente, su valor y cualquier incremento posterior. Una asignación nueva reemplaza los cambios anteriores. Una suma posterior aumenta el valor asignado, si existe, o se acumula como incremento.\n\nPrueba la composición sobre un solo número: asignar cinco, sumar tres, asignar −2 y sumar siete deja cinco, sin importar el valor inicial. Sobre cuatro posiciones, la suma final es veinte. La etiqueta equivalente es asignar cinco.\n\nLa propiedad del árbol es que cada suma ya representa su intervalo actual, aunque sus descendientes tengan trabajo pendiente. La propiedad de los dos Fenwick es la identidad de diferencias. No reemplaces suma por mínimo en esa identidad: depende de distribuir y restar sumas.',
    },
  ]),
  'usaco-plat-sparse-segtree': (lesson) => walkthrough([
    {
      title: 'Muchísimas posiciones, muy pocos cambios',
      body: 'Hay un contador cero en cada posición entera de [0,U). Para U = 16, agrega cinco en la posición 13 y dos en la posición 3. Queremos consultar [12,16), [4,8) y [3,14): las respuestas son 5, 0 y 7. El corchete izquierdo incluye su extremo; el paréntesis derecho lo excluye.\n\nLa entrada contiene U q. Cada «1 x d» agrega d en x; cada «2 l r» pide la suma de [l,r). U puede llegar a 10¹², q a 5 000 y |d| a 10⁶. Se permiten intervalos vacíos.\n\nReservar U contadores es imposible. Tampoco necesitamos hacerlo: casi todas las posiciones nunca reciben un cambio. Conservaremos la división de un árbol de segmentos, pero construiremos únicamente las partes utilizadas.',
    },
    {
      title: 'Una rama inexistente significa suma cero',
      body: 'La raíz representa [0,16). Sus hijos representan [0,8) y [8,16). Para cambiar la posición 13 seguimos [8,16), [12,16), [12,14) y [13,14). Creamos solo esas cajas y la raíz. Las otras regiones siguen en cero y no necesitan cajas físicas.\n\nCada nodo guarda dos índices de hijos y una suma. El índice −1 significa que no existe el hijo. Una función value traduce ese índice a cero. Así no necesitamos casos especiales al sumar los dos hijos.',
      code: excerpt(lesson, 'struct Node', 'int add('), codeKind: 'fragment',
      picture: { caption: 'La primera actualización crea un solo camino.', rows: [
        { label: 'Intervalo', values: ['[0,16)', '[8,16)', '[12,16)', '[12,14)', '[13,14)'] },
        { label: 'Suma', values: ['5', '5', '5', '5', '5'] },
      ] },
    },
    {
      title: 'Crear al bajar, sumar al regresar',
      body: 'add recibe el índice del nodo, su intervalo [L,R), la posición x y el incremento d. Si no hay nodo, crea uno. Si R−L = 1, llegó a la posición: modifica la suma y devuelve su índice.\n\nEn otro caso calcula el punto medio. x < M pertenece a la izquierda; el resto, a la derecha. Guarda el índice devuelto por la llamada recursiva y recalcula la suma de ambos hijos.',
      code: excerpt(lesson, 'int add(', 'long long query('), codeKind: 'fragment',
      afterCode: 'Al agregar dos en la posición 3, reutilizamos la raíz y creamos el camino izquierdo que falte. La raíz pasa a siete. No guardamos referencias como `int& hijo = t[v].a` durante la recursión: un push_back puede reubicar el vector e invalidarlas. Recuperamos t[v] por índice después de la llamada.',
    },
    {
      title: 'Consultar no debe crear nada',
      body: 'Una consulta tiene tres casos. Si el nodo no existe o su intervalo no se cruza con la pregunta, aporta cero. Si está completamente dentro, aporta su suma. En una intersección parcial preguntamos a ambos hijos y sumamos.\n\nPara [12,16), el nodo correspondiente ya guarda cinco. Para [4,8), encontramos una rama ausente: cero. Para [3,14), reunimos los dos contadores modificados. Nunca creamos nodos al leer.',
      code: excerpt(lesson, 'long long query(', 'int main()'), codeKind: 'fragment',
      check: { question: '¿La suma de una rama ausente sigue siendo cero si los incrementos pueden ser negativos?', answer: 'Sí. Ausente significa que nunca se modificó ninguna posición de esa rama. Una rama existente puede sumar cero o un número negativo; no debemos confundir suma cero con ausencia.' },
    },
    {
      title: 'Qué garantiza la estructura',
      body: 'Después de cada actualización, la hoja representa su contador y cada antecesor suma dos intervalos disjuntos. Por inducción desde la hoja, todos los nodos del camino quedan correctos; los demás no cambiaron. Las ramas ausentes representan regiones todavía inicializadas en cero.\n\nLa consulta divide su intervalo en partes disjuntas y solo acepta nodos completamente incluidos. Por eso cada posición contribuye una vez. Un intervalo vacío no incluye ninguna y devuelve cero.\n\nLa altura es O(log U): con U = 10¹² hay unas cuarenta divisiones. Una operación cuesta O(log U) y q actualizaciones crean O(q log U) nodos en el peor caso. Caminos compartidos reducen el número real.',
    },
    complete(lesson, 'root empieza en −1 porque ni siquiera necesitamos crear la raíz antes del primer cambio. Cada actualización devuelve la nueva raíz. La entrada reproduce los dos contadores y las tres consultas que seguimos a mano.', 'L, R, x y U son long long. El punto medio se calcula como L+(R−L)/2. Prueba U = 1, una consulta antes de actualizar y [0,0), que debe devolver cero. La suma de un nodo también es long long.'),
    {
      title: 'Cuándo conviene comprimir las coordenadas',
      body: 'Si conoces todas las posiciones que se actualizarán antes de empezar, puedes ordenarlas, quitar duplicados y usar un Fenwick común sobre esos índices. Para sumas puntuales, consultar [l,r) se traduce con lower_bound(l) y lower_bound(r). Suele usar menos memoria que crear caminos.\n\nEl árbol disperso permite recibir coordenadas nuevas durante la ejecución sin rehacer esa lista. En ambos casos tienes que distinguir orden y distancia: comprimir posiciones conserva cuáles están dentro de un rango, pero no conserva la longitud geométrica entre ellas.\n\nAquí solo cambiamos puntos y el valor inicial es cero. Con aumentos sobre intervalos, una rama ausente podría heredar cambios pendientes del padre. Harían falta etiquetas y una regla explícita para materializar esos valores.',
    },
  ]),
  'usaco-plat-2drq': (lesson) => walkthrough([
    {
      title: 'Cambios en celdas y sumas de rectángulos',
      body: 'Una tabla de riego tiene tres filas y tres columnas, inicialmente en cero. Agregamos cinco a (2,2), tres a (1,3) y −2 a (3,1). La suma de toda la tabla es seis; la del rectángulo con esquinas (1,2) y (2,3) es ocho.\n\nLa entrada contiene n m q. «1 x y d» incrementa una celda; «2 x1 y1 x2 y2» pide la suma de un rectángulo inclusivo. Los índices empiezan en uno. n,m ≤ 500, q ≤ 20 000 y |d| ≤ 10⁶.\n\nPodemos recorrer todas las celdas de cada consulta, con costo O(nm). Los prefijos estáticos contestarían rápido, pero cada cambio obligaría a corregir muchos prefijos. Vamos a mantenerlos con un Fenwick en dos dimensiones.',
      picture: { caption: 'Estado después de los tres incrementos.', rows: [
        { label: 'Fila 1', values: ['0', '0', '3'] },
        { label: 'Fila 2', values: ['0', '5', '0'], highlight: [1] },
        { label: 'Fila 3', values: ['−2', '0', '0'] },
      ] },
    },
    {
      title: 'Qué representa una celda del Fenwick',
      body: 'En una dimensión, t[i] resume las últimas lowbit(i) posiciones que terminan en i. lowbit(i) es i & -i. En dos dimensiones, t[i][j] resume el producto de dos intervalos: las últimas lowbit(i) filas y las últimas lowbit(j) columnas.\n\nPor ejemplo, t[2][2] cubre filas 1 a 2 y columnas 1 a 2. t[3][2] cubre solo la fila 3 y las columnas 1 a 2. No es el valor de una sola celda de la tabla original.\n\nPara actualizar (x,y), visitamos los bloques de filas que contienen x y, dentro de cada uno, los bloques de columnas que contienen y.',
      code: excerpt(lesson, '    auto add =', '    auto pref ='), codeKind: 'fragment',
      afterCode: 'El ciclo interior empieza otra vez en y para cada i. Si conservaras el j de la vuelta anterior, ya estaría fuera de la tabla y las siguientes filas no recibirían el cambio. Ningún índice de actualización puede ser cero: lowbit(0) es cero y el ciclo no avanzaría.',
    },
    {
      title: 'Consultar un prefijo rectangular',
      body: 'pref(x,y) suma desde (1,1) hasta (x,y). El recorrido descendente por filas las divide en bloques sin repetir; el recorrido por columnas hace lo mismo. Cada pareja de bloques produce un rectángulo y juntos cubren el prefijo exactamente una vez.\n\nPara pref(3,3), los índices visitados son 3 y 2 en ambas dimensiones. Sumamos t[3][3], t[3][2], t[2][3] y t[2][2]. Son cuatro rectángulos disjuntos que cubren toda la tabla.',
      code: excerpt(lesson, '    auto pref =', '    while (q--)'), codeKind: 'fragment',
      afterCode: 'Si x o y es cero, el ciclo correspondiente no entra y el prefijo vale cero. Eso permite consultar rectángulos pegados a la primera fila o a la primera columna sin inventar una casilla exterior.',
    },
    {
      title: 'Quitar las franjas que sobran',
      body: 'Para [x1,x2] × [y1,y2], toma pref(x2,y2), resta pref(x1−1,y2) y pref(x2,y1−1), y agrega pref(x1−1,y1−1). La última esquina se había restado dos veces.\n\nEn nuestro rectángulo [1,2] × [2,3], el prefijo (2,3) suma ocho. La franja de columna 1 en esas filas suma cero y no hay filas anteriores a uno: la respuesta sigue siendo ocho. Para [2,3] × [1,2], solo cuentan cinco y −2, de modo que sale tres.',
      check: { question: '¿El cambio «agregar cinco» equivale siempre a «asignar cinco»?', answer: 'No. Si la celda tenía tres, agregar cinco la deja en ocho. Para asignarle cinco debemos agregar 5−3 = 2 y conocer su valor anterior.' },
    },
    complete(lesson, 'Juntamos los dos recorridos y la combinación de cuatro prefijos. La entrada contiene los tres cambios de la tabla y consultas cuyas respuestas son 6, 8 y 3.', 'Cada recorrido tiene O(log n) filas y O(log m) columnas: una operación cuesta O(log n·log m). La memoria es O(nm), no O(n+m). long long evita desbordar al sumar muchos incrementos. Prueba una tabla 1×1 y consultas de una sola celda.'),
    {
      title: 'Cuando la tabla completa ya no cabe',
      body: 'Con cien mil filas y cien mil columnas, reservar el producto es demasiado. Comprimir las dos coordenadas por separado no garantiza arreglarlo: q puntos pueden producir q valores x distintos y q valores y distintos, todavía q² combinaciones.\n\nSi conocemos las futuras actualizaciones, preparamos un Fenwick exterior sobre x. Para cada punto, recorremos sus índices exteriores y anotamos y en la lista de cada uno. Después ordenamos cada lista, quitamos duplicados y reservamos allí un Fenwick interno.\n\nAl actualizar, buscamos y dentro de cada lista visitada. Al consultar, upper_bound indica cuántas coordenadas internas cumplen el límite. Cada punto aparece en O(log q) listas: memoria O(q log q), operaciones O(log²q). El programa anterior usa la variante densa porque sus límites sí permiten la tabla completa.',
    },
    {
      title: 'Elegir qué trabajo vale la pena preparar',
      body: 'La propiedad que acabamos de usar es que cada bloque del Fenwick mantiene la suma actual de su rectángulo. Un incremento visita todos los bloques que contienen la celda y no cambia los demás; una consulta combina una partición del prefijo. Los cuatro signos convierten esos prefijos en el rectángulo pedido.\n\nSi la tabla nunca cambia, prepara prefijos estáticos en O(nm) y responde en O(1). Si solo hay puntos fijos y todas las consultas se conocen, un barrido por una coordenada puede usar un único Fenwick. Elige a partir de cuándo cambian los datos y del tamaño que realmente ocupa la representación.',
    },
  ]),
  'usaco-plat-dc-srq': (lesson) => walkthrough([
    {
      title: 'Aplicar solo un tramo de transformaciones',
      body: 'Una fila contiene f1(x)=2x+1, f2(x)=3x y f3(x)=x+4. Si empezamos en uno y aplicamos las tres, pasamos por 3, 9 y 13. Queremos repetir este cálculo para muchos intervalos de la fila sin ejecutar todas sus funciones.\n\nLa entrada contiene n q, n pares a b que representan f(x)=a·x+b, y q preguntas l r x. Aplicamos desde f[l] hasta f[r] en ese orden e imprimimos el resultado módulo 1 000 000 007. n,q ≤ 100 000; coeficientes y argumentos están entre cero y el módulo menos uno.\n\nUn recorrido por consulta cuesta O(nq). Restar prefijos no sirve aquí: una función constante pierde la entrada y no tiene una operación inversa que la deshaga.',
    },
    {
      title: 'Resumir varias funciones con dos números',
      body: 'Aplicar f(x)=a·x+b y después g(x)=c·x+d produce c(ax+b)+d = ca·x+cb+d. Otra vez es una función del mismo tipo: basta guardar dos coeficientes.\n\nDefinimos join(f,g) como aplicar primero f y después g. Para nuestras dos primeras funciones resulta 6x+3. Cambiar el orden produciría 6x+1, así que no podemos intercambiar operandos.\n\nPodemos agrupar las operaciones de distintas maneras sin cambiar su orden: (f seguida de g) seguida de h es lo mismo que f seguida de (g seguida de h). Esa propiedad se llama asociatividad.',
      code: excerpt(lesson, 'const long long MOD', 'int main()'), codeKind: 'fragment',
    },
    {
      title: 'Preparar ambos lados de un corte',
      body: 'Dividamos la fila entre la segunda y la tercera función. A la izquierda guardamos lo que se obtiene al comenzar en cada posición y terminar justo antes del corte. Son sufijos de esa mitad. A la derecha guardamos lo que se obtiene al comenzar en el corte y terminar en cada posición: prefijos.\n\nUna consulta que cruce el corte une un sufijo izquierdo y un prefijo derecho. No repite ninguna función. Para [1,3] unimos 6x+3 con x+4 y obtenemos 6x+7: con x=1 devuelve 13.\n\nSi una consulta no cruza ese corte, necesita un corte dentro de una mitad. Prepararemos cortes en bloques de tamaños 2, 4, 8 y así sucesivamente.',
      picture: { caption: 'El corte principal de nuestra fila.', rows: [
        { label: 'Función', values: ['2x+1', '3x', 'x+4'] },
        { label: 'Resumen hacia el corte', values: ['6x+3', '3x', 'x+4'] },
      ] },
    },
    {
      title: 'Construir cada fila de la tabla',
      body: 'El nivel k usa mitades de longitud 2^k. L es el comienzo del bloque, M el comienzo de la mitad derecha y R su final excluido. Construimos sufijos izquierdos de derecha a izquierda y prefijos derechos de izquierda a derecha.\n\nObserva el orden de join: el elemento nuevo va delante del sufijo, pero después del prefijo. min(n,…) permite que el último bloque esté incompleto.',
      code: excerpt(lesson, '    for (int k = 0;', '    while (q--)'), codeKind: 'fragment',
      afterCode: 'Cada nivel recorre O(n) posiciones. Hay O(log n) niveles, por lo que la construcción y la memoria cuestan O(n log n). Esta tabla se llama disjoint sparse table, o tabla de bloques disjuntos. Los datos deben permanecer fijos después de construirla.',
    },
    {
      title: 'Encontrar el corte sin bajar por un árbol',
      body: 'Dentro del programa usamos índices desde cero. Para l distinto de r, el bit más alto de l XOR r indica el nivel donde los extremos quedan por primera vez en mitades distintas del mismo bloque. Los bits superiores iguales los colocan en ese bloque; el bit diferente los separa.\n\nEn [0,2], los binarios 00 y 10 dan XOR 10: k=1. Usamos mitades de dos posiciones, justo el corte que seguimos a mano. En [1,2], también usamos ese nivel. Si l=r, devolvemos directamente esa función.',
      code: excerpt(lesson, '        F f;', '        cout <<'), codeKind: 'fragment',
      afterCode: '`__builtin_clz` cuenta ceros iniciales de un entero de 32 bits. No lo llamamos con cero: por eso la consulta unitaria tiene su propia rama. La resta 31−clz obtiene el índice del bit más alto, contando desde cero.',
    },
    {
      title: 'Por qué necesitamos partes disjuntas',
      body: 'Una tabla de mínimos puede combinar bloques superpuestos: repetir el mismo valor no cambia un mínimo. Esa propiedad se llama idempotencia. La composición de funciones no la cumple; aplicar dos veces 2x+1 cambia el resultado.\n\nAquí cada resumen conserva el orden y los dos resúmenes cubren la consulta sin repetirse. La asociatividad permite combinarlos como una sola función. No necesitamos inversas, conmutatividad ni idempotencia.\n\nCada respuesta hace O(1) combinaciones después de O(n log n) preparación. Esto supone que cada resumen tiene tamaño constante. Pares afines o matrices de dimensión fija lo cumplen; concatenar y copiar textos largos tendría un costo adicional.',
      check: { question: '¿Podemos construir la tabla si alguna función es f(x)=7?', answer: 'Sí. La composición sigue siendo asociativa aunque esa función no tenga inversa. Es precisamente una situación donde dividir o deshacer composiciones de prefijos no sería una solución general.' },
    },
    complete(lesson, 'La primera pregunta aplica las tres funciones a uno y obtiene trece. La segunda aplica 3x y luego x+4 a dos: diez. La última aplica solamente 3x a cinco: quince.', 'Los productos de dos residuos caben en long long con este módulo. Comprueba n = 1, una función constante y una longitud que no sea potencia de dos. Si necesitas cambios en las funciones, un árbol de segmentos con la misma join permite actualizaciones y consultas en O(log n).'),
    {
      title: 'La alternativa cuando todas las preguntas ya están disponibles',
      body: 'También puedes repartir las consultas con divide y vencerás. En un bloque, prepara sus sufijos y prefijos, contesta las consultas que cruzan el centro y envía las otras a la mitad correspondiente. Cuando una consulta queda en una sola posición, usa ese elemento.\n\nUna implementación directa hace O((n+q) log n) trabajo. Puede liberar los resúmenes de un bloque al terminar con él. La tabla que construimos conserva todos los niveles para contestar también consultas posteriores inmediatamente. Ambas opciones utilizan la misma partición exacta alrededor de un corte.',
    },
  ]),
  'usaco-plat-sqrt': (lesson) => walkthrough([
    {
      title: 'Cuántos valores diferentes aparecen en una ventana',
      body: 'La fila es [1,2,1,3,2]. Preguntamos por los intervalos [1,3], [2,4] y [4,5], con índices desde uno. Contienen respectivamente {1,2}, {1,2,3} y {2,3}: imprimimos 2, 3 y 2.\n\nLa entrada contiene n q, los n valores y los q intervalos inclusivos. n,q ≤ 50 000 y cada valor está entre −10⁹ y 10⁹. La fila no cambiará. Las respuestas deben salir en el orden original.\n\nCrear un conjunto para cada consulta funciona, pero repite mucho trabajo entre ventanas parecidas. Mover una orilla solo agrega o quita una posición. Vamos a conservar las frecuencias de la ventana y ordenar las preguntas para moverla menos.',
    },
    {
      title: 'Por qué aparecen bloques de tamaño raíz',
      body: 'Antes de contar distintos, piensa en sumas. Divide nueve valores [1,…,9] en bloques de tres; sus sumas son 6, 15 y 24. Para sumar posiciones 2 a 8, revisa 2 y 3, usa el bloque completo 15 y revisa 7 y 8. Obtienes 35.\n\nCon bloques de tamaño B, revisas hasta dos orillas de B elementos y unos n/B bloques. El costo es O(B+n/B), que se equilibra cerca de B=√n. Cambiar una posición actualiza su suma de bloque en O(1).\n\nPara distintos, no podemos sumar los conteos de dos bloques: el mismo valor puede estar en ambos. Usaremos los bloques para ordenar consultas, no para combinar respuestas parciales.',
    },
    {
      title: 'Mantener una respuesta mientras cambian las orillas',
      body: 'freq[v] cuenta cuántas copias del valor v hay en la ventana. distinct cuenta cuántas frecuencias son positivas. Una copia nueva solo aumenta distinct cuando antes no había ninguna. Quitar una copia solo lo disminuye cuando ya no queda otra.\n\nEn el código, comprimimos los valores para usarlos como índices pequeños. Esa compresión conserva la igualdad: todos los unos reciben el mismo índice y un dos recibe otro.',
      code: excerpt(lesson, '    vector<int> freq', '    for (auto x : qs)'), codeKind: 'fragment',
      afterCode: 'La ventana vacía se representa con L=0 y R=−1. En add, el operador ++ compara primero la frecuencia anterior con cero. En del, -- baja primero la frecuencia y comprueba si quedó en cero. Esas dos posiciones del operador son intencionales.',
    },
    {
      title: 'Seguir dos movimientos con copias repetidas',
      body: 'La primera ventana, [1,3], contiene [1,2,1]. Para pasar a [2,4], agregamos el tres de la derecha: ahora hay tres valores distintos. Quitamos el primer uno, pero todavía queda su segunda copia: seguimos en tres.\n\nPara pasar después a [4,5], agregamos el dos final. Quitamos el dos de la posición 2: aún queda otro. Quitamos el uno de la posición 3: ahora sí desaparece ese valor, y la respuesta baja a dos.\n\nEl código convierte las posiciones a índices desde cero. Las ventanas correspondientes son [0,2], [1,3] y [3,4]. No cambies de convención a mitad de los movimientos.',
      picture: { caption: 'Frecuencias después de alcanzar cada consulta.', rows: [
        { label: 'Ventana desde uno', values: ['[1,3]', '[2,4]', '[4,5]'] },
        { label: 'freq[1],freq[2],freq[3]', values: ['2,1,0', '1,1,1', '0,1,1'] },
        { label: 'Distintos', values: ['2', '3', '2'] },
      ] },
    },
    {
      title: 'Ordenar las consultas: el algoritmo de Mo',
      body: 'Agrupa preguntas según el bloque de su extremo izquierdo: l/B. Dentro de un bloque, ordénalas por el extremo derecho. Así R recorre la fila en una sola dirección mientras L se mueve dentro de una zona pequeña.\n\nAlternamos la dirección de R entre bloques consecutivos para evitar volver al inicio cada vez. Este orden se conoce como algoritmo de Mo. Cambia cuándo calculamos una respuesta, pero no qué intervalo representa.',
      code: excerpt(lesson, '    int B =', '    vector<int> freq'), codeKind: 'fragment',
      afterCode: 'Cada consulta guarda su id original. Al terminar de ajustar la ventana, escribimos en ans[id], no en la siguiente posición libre. La impresión final recupera el orden pedido por el enunciado.',
    },
    {
      title: 'Llevar la ventana exactamente a la pregunta',
      body: 'Primero ampliamos por la izquierda y por la derecha; luego quitamos lo que sobra. Esta convención evita retirar posiciones que todavía no están presentes. Cada llamada a add o del modifica una sola frecuencia.\n\nCuando L y R coinciden con los extremos de una pregunta, freq describe exactamente sus elementos y distinct es su respuesta.',
      code: excerpt(lesson, '    for (auto x : qs)', '    for (int x : ans)'), codeKind: 'fragment',
      check: { question: 'Al quitar un dos de una ventana que tenía dos copias de dos, ¿baja distinct?', answer: 'No. La frecuencia pasa de dos a uno y el valor sigue presente. Solo baja cuando la última copia hace que la frecuencia llegue a cero.' },
    },
    complete(lesson, 'El programa comprime valores, ordena las preguntas y mueve una única ventana. La entrada reproduce la fila que seguimos; las respuestas son 2, 3 y 2.', 'Dentro de cada bloque izquierdo, R hace O(n) movimientos. Hay unos n/B bloques: O(n²/B). L aporta O(qB). Con B≈√n resulta O((n+q)√n), más O(q log q) para ordenar; la memoria es O(n+q). Si q difiere mucho de n, B≈n/√q equilibra mejor los dos términos.'),
    {
      title: 'Cambiar lo que medimos sin cambiar el recorrido',
      body: 'Mo sirve cuando puedes actualizar la respuesta al agregar o quitar un elemento. Para medir Σfreq[v]², si la frecuencia anterior es c, agregar una copia aumenta el resultado en (c+1)²−c² = 2c+1. Quitarla lo cambia en (c−1)²−c² = −2c+1.\n\nEn [2,2,3], el valor es 2²+1² = 5. Agregar otro dos aporta cinco y deja diez. Las dos modificaciones cuestan O(1), igual que contar distintos.\n\nLa versión explicada exige una fila fija y preguntas disponibles de antemano. Con modificaciones intercaladas necesitas además aplicar y deshacer cambios. Si cada consulta depende de la respuesta anterior, tampoco puedes ordenarla directamente. Para sumas con cambios puntuales, un Fenwick suele resolver el problema con menos trabajo.',
    },
  ]),
};
