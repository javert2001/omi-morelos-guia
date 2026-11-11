import type { PlatinumWalkthrough } from './platinum-helpers.ts';
import { complete, excerpt, walkthrough } from './platinum-helpers.ts';

export const platinumTreeWalkthroughs: Record<string, PlatinumWalkthrough> = {
  'usaco-plat-binary-jump': (lesson) => walkthrough([
    {
      title: 'Seguir una ruta durante muchísimos pasos',
      body: 'Cuatro ciudades tienen una única salida indicada: 1 va a 2, 2 a 3, 3 a 1 y 4 a 3. Desde la ciudad 4, cero pasos te dejan en 4; uno te lleva a 3; cuatro siguen 4→3→1→2→3 y terminan otra vez en 3.\n\nLa entrada contiene n q, los n destinos de un paso y q consultas v k. Imprimimos dónde termina cada recorrido. Los vértices se numeran desde uno, n,q ≤ 100 000 y k puede alcanzar 10¹⁸.\n\nSeguir las salidas una por una es correcto, pero una sola pregunta podría necesitar 10¹⁸ vueltas de un ciclo. Prepararemos destinos de recorridos largos para resolverla con unas sesenta decisiones.',
    },
    {
      title: 'Preparar recorridos de 1, 2, 4 y 8 pasos',
      body: 'Llamamos sucesor al destino después de un paso. Guarda en up[j][v] el destino después de 2^j pasos desde v. La fila cero contiene los sucesores que ya recibimos.\n\nPara saber adónde llevan cuatro pasos, primero da dos y después otros dos desde donde llegaste. Para ocho, encadena dos saltos de cuatro. Así construimos una fila usando exclusivamente la anterior.',
      code: excerpt(lesson, '    for (int j = 1;', '    while (q--)'), codeKind: 'fragment',
      picture: { caption: 'Destinos expresados con los números de ciudad de la entrada.', rows: [
        { label: 'Inicio', values: ['1', '2', '3', '4'] },
        { label: '1 paso', values: ['2', '3', '1', '3'] },
        { label: '2 pasos', values: ['3', '1', '2', '1'] },
        { label: '4 pasos', values: ['2', '3', '1', '3'] },
      ] },
      afterCode: 'El programa resta uno a los números al leerlos para usar arreglos desde cero. La tabla del dibujo conserva los números de la entrada. No confundas j, que elige la longitud del salto, con v, que elige dónde comienza.',
    },
    {
      title: 'Escribir una distancia como suma de potencias',
      body: 'Trece pasos son 8+4+1. En binario, trece es 1101: están encendidos los bits 0, 2 y 3. Desde la ciudad 4, un paso lleva a 3; cuatro más llevan a 1; ocho más llevan a 3. En total avanzamos trece.\n\nPara cada bit encendido de k, reemplazamos v por el destino de ese salto. Cada salto empieza en el resultado del anterior; no consultamos siempre desde la ciudad inicial.',
      code: excerpt(lesson, '        for (int j = 0;', '        cout <<'), codeKind: 'fragment',
      afterCode: 'Con k=0 no hay bits encendidos y v queda igual. Sesenta filas cubren los bits del 0 al 59 porque 10¹⁸ < 2⁶⁰. El tamaño de la tabla depende del máximo número de pasos, aunque haya pocas ciudades.',
      check: { question: 'Si solo hay tres ciudades, ¿bastan dos filas para responder k=10¹⁸?', answer: 'No. Dos filas solo guardan saltos de uno y dos pasos. Para descomponer cualquier k hasta 10¹⁸ necesitamos sesenta filas, incluso cuando la ruta recorre muchas veces un ciclo pequeño.' },
    },
    {
      title: 'Por qué un ciclo no cambia el razonamiento',
      body: 'La primera fila representa un paso porque copia la entrada. Si una fila representa correctamente 2^(j−1) pasos, encadenarla consigo misma representa 2^j. Eso prueba todas las filas por inducción.\n\nLa consulta concatena saltos cuyas longitudes suman exactamente k. No importa si visitan varias veces una ciudad: siguen la misma sucesión de salidas que el recorrido directo.\n\nPreparar y guardar la tabla cuesta O(n log K), donde K es el mayor k admitido. Cada consulta cuesta O(log K). Aquí log K se concreta en sesenta filas; k y los desplazamientos se manejan con enteros de 64 bits.',
    },
    complete(lesson, 'La entrada pregunta por cero, uno y cuatro pasos desde 4, y por 10¹⁸ pasos desde 1. Las tres primeras respuestas se ven en la tabla. En el ciclo 1→2→3→1, 10¹⁸ deja resto uno al dividir entre tres, así que la última respuesta es 2.', 'Prueba una ciudad que apunte a sí misma. Toda consulta desde ella debe terminar allí. Para contrastar el programa, usa primero k pequeños y sigue las salidas a mano; luego comprueba vueltas grandes con un ciclo de longitud conocida.'),
    {
      title: 'Usar los saltos para encontrar un ancestro común',
      body: 'En un árbol enraizado, el sucesor puede ser el padre. El ancestro común más bajo, o LCA, es el primer vértice compartido al subir desde dos vértices. Primero sube al más profundo hasta que ambos tengan la misma profundidad. Si coinciden, ya lo encontraste.\n\nSi siguen separados, prueba saltos de mayor a menor. Súbelos juntos solo cuando los destinos sean distintos. Eso los mantiene debajo del LCA: al llegar al LCA o superarlo, los destinos de igual longitud coincidirían. Al terminar, sus padres son iguales y ese padre es la respuesta.',
      code: 'if (depth[u] < depth[v]) swap(u, v);\nint d = depth[u] - depth[v];\nfor (int j = 0; j < LOG; j++)\n    if ((d >> j) & 1) u = up[j][u];\nif (u != v) {\n    for (int j = LOG - 1; j >= 0; j--)\n        if (up[j][u] != up[j][v]) {\n            u = up[j][u];\n            v = up[j][v];\n        }\n    u = up[0][u];\n}\n// u contiene el LCA.', codeKind: 'fragment',
      afterCode: 'Este fragmento supone un árbol, profundidades y una tabla de padres. Define el padre de la raíz como ella misma. Si el problema pide un ancestro que no existe, comprueba antes que k no supere la profundidad; quedarse en la raíz no sería una respuesta válida para ese otro enunciado.',
    },
    {
      title: 'Guardar también lo que se acumula durante el salto',
      body: 'Podemos acompañar el destino con la suma de pesos de las aristas recorridas. La regla es acc[j][v] = acc[j−1][v] + acc[j−1][up[j−1][v]]. Al usar un salto en una consulta, agrega ese resumen antes de mover v.\n\nEn una cadena con pesos 5, 7 y 2, el salto de dos aristas acumula doce y la tercera aporta dos: total catorce. Para mínimos, reemplaza la suma por mínimo y elige correctamente el valor neutro.\n\nDecide si el peso pertenece a una arista o a un vértice para no duplicar extremos. Si acumulas textos o funciones, importa la dirección: al unir dos ramas mediante el LCA, una se recorre en sentido contrario y puede requerir otro resumen.',
    },
  ]),
  'usaco-plat-merging': (lesson) => walkthrough([
    {
      title: 'Contar colores debajo de cada vértice',
      body: 'La raíz 1 tiene hijos 2 y 3. El vértice 2 tiene hijos 4 y 5. Sus colores, en ese orden, son [1,2,1,3,2]. Queremos contar los colores distintos del subárbol de cada vértice, incluyendo al propio vértice.\n\nLa entrada contiene n, los n colores y los padres de 2 hasta n. La raíz es 1 y n ≤ 20 000. Imprimimos una respuesta por vértice: en el ejemplo serán 3, 2, 1, 1 y 1.\n\nPodemos resolver a los hijos y copiar sus conjuntos en un conjunto nuevo para el padre. Pero en una cadena con colores distintos copiaríamos tamaños 1, 2, 3 y así hasta n. Ese trabajo es cuadrático. Conservaremos un conjunto ya construido y agregaremos los otros.',
    },
    {
      title: 'Resolver primero a los hijos',
      body: 'Cada hoja empieza con un conjunto que contiene su color. Para calcular al padre, necesitamos que todos sus hijos ya estén resueltos. Construimos un orden donde los padres aparezcan antes que sus hijos y luego lo recorremos al revés.\n\nEn nuestro ejemplo, las hojas 3, 4 y 5 producen {1}, {3} y {2}. El vértice 2 debe unir {3}, {2} y su propio color 2: obtiene {2,3}. Guarda la respuesta dos antes de entregar ese conjunto al padre.',
      code: excerpt(lesson, '    vector<int> order', '    vector<set<int>>'), codeKind: 'fragment',
      afterCode: 'Este recorrido usa un vector como lista de trabajo. No necesita una llamada recursiva por vértice, así que una cadena larga no aumenta la profundidad de la pila del programa.',
      picture: { caption: 'Los números se guardan aunque el conjunto se reutilice después.', rows: [
        { label: 'Vértice', values: ['3', '4', '5', '2', '1'] },
        { label: 'Conjunto al resolverlo', values: ['{1}', '{3}', '{2}', '{2,3}', '{1,2,3}'] },
        { label: 'Respuesta', values: ['1', '1', '1', '2', '3'] },
      ] },
    },
    {
      title: 'Elegir qué conjunto no vamos a copiar',
      body: 'Para cada vértice v, calcula sz[v], el número de vértices de su subárbol. Escoge como heavy al hijo de subárbol más grande. Transferimos su conjunto a v con swap, que intercambia los contenedores sin copiar todas sus claves.\n\nDespués insertamos el color de v y los colores de los demás hijos. Esos conjuntos pequeños ya no serán necesarios: podemos vaciarlos. En la raíz del ejemplo conservamos el conjunto de 2, agregamos el color 1 e incorporamos {1} del hijo 3. Queda {1,2,3}.',
      code: excerpt(lesson, '    for (int i = n - 1;', '    for (int x : ans)'), codeKind: 'fragment',
      afterCode: 'La elección usa tamaños de subárbol, no cantidades de colores distintos. Con colores repetidos, unir dos conjuntos no garantiza duplicar el número de claves. Usar sz permite demostrar el ahorro sin hacer esa suposición.',
    },
    {
      title: 'Contar cuántas veces puede moverse un dato',
      body: 'Llamamos pesada a la arista hacia heavy y ligeras a las otras. Si un hijo ligero tiene s vértices, el hijo pesado tiene al menos s. El padre contiene entonces al menos 2s+1 vértices. Subir por una arista ligera al menos duplica el tamaño del subárbol que contiene a cualquier vértice.\n\nEse tamaño empieza en uno y no supera n, por lo que un vértice cruza O(log n) aristas ligeras. En cada mezcla recorremos como máximo tantas claves como vértices tiene el hijo ligero. Podemos cargar esas visitas a sus vértices.\n\nEn total hay O(n log n) visitas a claves. Insertar en set cuesta O(log n): tiempo O(n log²n). Los conjuntos que siguen activos contienen O(n) claves entre todos.',
    },
    {
      title: 'Por qué las respuestas de los hijos siguen siendo válidas',
      body: 'Cuando procesamos v, los conjuntos de sus hijos representan sus subárboles. Su unión, más el color propio, representa exactamente el subárbol de v. set elimina las repeticiones, de modo que su tamaño cuenta colores diferentes.\n\nDespués de guardar ans[v], el contenedor puede crecer, vaciarse o transferirse a otro vértice. La respuesta numérica no cambia: describe el momento en que v quedó resuelto. No prometemos conservar un conjunto histórico independiente por cada subárbol.',
      check: { question: 'Si el conjunto que pertenecía a 2 luego contiene {1,2,3} en la raíz, ¿la respuesta de 2 debe cambiar de dos a tres?', answer: 'No. ans[2] se guardó cuando su conjunto era {2,3}. El contenedor ahora se reutiliza para otro subárbol, pero el subárbol original de 2 sigue teniendo solo esos dos colores.' },
    },
    complete(lesson, 'El programa lee padres desde el vértice 2 y convierte la numeración a índices desde cero. Procesa el orden al revés, transfiere el conjunto elegido y conserva las respuestas en el orden original de los vértices.', 'En una cadena solo se reutiliza el conjunto del único hijo y se inserta el color propio. En una estrella se incorporan muchas bolsas de una clave. Comprueba ambas formas con colores iguales y distintos; si todos son iguales, cada respuesta debe ser uno.'),
    {
      title: 'Cambiar el contenido de las bolsas',
      body: 'Si quieres cuántas veces aparece cada color, sustituye set por un mapa de color a frecuencia. Al mezclar una entrada (color,cantidad), suma cantidad en el mapa conservado. El mismo argumento por subárboles limita las visitas a claves.\n\nUn contenedor hash puede hacer más rápidas las inserciones en promedio, pero su cota depende de las colisiones. set y map dan operaciones logarítmicas deterministas.\n\nEsta técnica se llama mezcla de pequeño a grande. No es el DSU de componentes de conectividad: aquí combinamos información de subárboles y reutilizamos su almacenamiento. Si necesitas conservar cada versión completa para consultas posteriores, tendrás que diseñar otra representación o aceptar el costo de guardarla.',
    },
  ]),
  'usaco-plat-hld': (lesson) => walkthrough([
    {
      title: 'Sumar un camino que pasa por varias ramas',
      body: 'Tenemos las aristas 1–2, 1–3, 2–4 y 2–5. Los valores de los vértices son [1,2,3,4,5]. El camino de 4 a 3 pasa por 4,2,1,3 y suma diez. Después cambiamos el valor de 2 a diez: el camino de 4 a 5 suma 4+10+5 = 19.\n\nLa entrada contiene n q, los valores, n−1 aristas y q operaciones. «1 v x» asigna x a v; «2 u v» pide la suma del camino incluyendo sus extremos. n,q ≤ 20 000 y |valor| ≤ 10⁶.\n\nRecorrer todo el camino puede costar O(n) por pregunta. Un arreglo de posiciones DFS vuelve consecutivos los subárboles, pero un camino entre ramas puede no ser un solo intervalo. Lo dividiremos en pocos tramos consecutivos.',
    },
    {
      title: 'Conservar juntos los hijos más grandes',
      body: 'Enraíza en 1. Para cada vértice calcula su padre, profundidad y tamaño de subárbol. Elige como pesado al hijo con mayor tamaño. Al seguir hijos pesados aparecen cadenas sin bifurcaciones; los demás hijos comienzan cadenas nuevas.\n\nEn el ejemplo, 2 es el hijo pesado de 1. En 2 puedes elegir 4 o 5 porque sus tamaños empatan; el código elige el primero que encuentra. Supongamos 4: tenemos la cadena 1→2→4 y las cadenas individuales 3 y 5.\n\nSi bajas por una arista no elegida, el subárbol tiene menos de la mitad de los vértices del anterior. Por eso un camino hacia la raíz cruza O(log n) de esas aristas ligeras.',
    },
    {
      title: 'Dar posiciones consecutivas a cada cadena',
      body: 'head[v] guarda la cabeza de la cadena de v y pos[v] su posición en un arreglo. Numeramos una cadena completa, de arriba hacia abajo, antes de comenzar otra. Guardamos sus valores en Fenwick usando esas posiciones.\n\nstarts contiene las cabezas pendientes. Mientras recorremos una cadena por heavy, añadimos los hijos ligeros a esa lista. Las cadenas pueden quedar en distinto orden sin cambiar la respuesta; lo necesario es que cada una sea consecutiva.',
      code: excerpt(lesson, '    vector<int> starts', '    auto add ='), codeKind: 'fragment',
      afterCode: 'Los tamaños se calculan antes, recorriendo hijos antes que padres. El programa completo hace ambas preparaciones de forma iterativa. heavy[v]=−1 indica que terminó una cadena.',
    },
    {
      title: 'Retirar primero la cadena cuya cabeza esté más abajo',
      body: 'Para consultar u y v, compara sus cabezas. Si son distintas, toma la cabeza de mayor profundidad. El tramo desde esa cabeza hasta su extremo pertenece entero al camino buscado: lo sumas y mueves ese extremo al padre de la cabeza.\n\nEn el camino 4→3, la cadena de 3 comienza en profundidad uno y la de 4 comienza en la raíz. Retiramos primero el vértice 3 y subimos su extremo a 1. Ahora 4 y 1 comparten cadena: consultamos el intervalo que contiene 1,2,4. Sale 3+(1+2+4)=10.',
      code: excerpt(lesson, '            long long ans = 0;', '            cout << ans'), codeKind: 'fragment',
      afterCode: 'Comparamos profundidades de las cabezas, no únicamente de u y v. Después de sumar un tramo subimos al padre de su cabeza para no contarlo otra vez. Cuando comparten cadena, el intervalo restante incluye al ancestro común una sola vez.',
    },
    {
      title: 'Cambiar una asignación en un incremento',
      body: 'Fenwick agrega cantidades; la operación del problema asigna un valor. Si el vértice 2 tenía dos y ahora debe tener diez, enviamos +8 a su posición y guardamos diez como su valor actual.\n\nEl resto de la descomposición no cambia. Los tamaños y cadenas dependen de las aristas del árbol, no de los valores almacenados.',
      code: excerpt(lesson, '        if (type == 1)', '        } else {') + '\n        }', codeKind: 'fragment',
      afterCode: 'El fragmento es la rama de actualización dentro de main. z contiene el nuevo valor y a[u] el anterior. Una segunda asignación debe usar el valor ya actualizado, no el de la entrada inicial.',
      check: { question: 'Después de cambiar el valor de 2 a diez, ¿cuánto suma el camino 4→5?', answer: 'Diecinueve: visita 4,2,5 y suma 4+10+5. La raíz 1 no pertenece a ese camino y no debe contarse.' },
    },
    {
      title: 'Por qué hay pocos intervalos y ninguno se repite',
      body: 'Mientras las cabezas difieren, la cabeza más profunda está debajo del ancestro común. El tramo retirado está dentro del camino y queda separado del camino pendiente. Al compartir cadena, las posiciones restantes forman exactamente un intervalo.\n\nCada tramo retirado cruza una arista ligera al subir. Hay O(log n) en cada lado del camino, así que obtenemos O(log n) consultas de intervalo. Con Fenwick, cada una cuesta O(log n): la consulta completa cuesta O(log²n).\n\nLa descomposición ocupa O(n) memoria y tiempo; el llenado del Fenwick de este programa cuesta O(n log n). Una asignación cuesta O(log n). Los recorridos de preparación no dependen de la profundidad de la pila de llamadas.',
    },
    complete(lesson, 'La entrada pregunta primero por 4→3, cambia el valor de 2 y pregunta por 4→5 y 1→1. Esperamos 10, 19 y 1. Todas las consultas incluyen los valores de los dos extremos.', 'Prueba un solo vértice y valores negativos. Una consulta u=v debe devolver su valor actual. Si cambias las aristas durante las operaciones, esta descomposición deja de representar el árbol: esa variante requiere otra estructura.'),
    {
      title: 'Pesos en aristas y operaciones con dirección',
      body: 'Si los pesos pertenecen a aristas, guarda cada peso en su extremo hijo. En el último tramo excluye la posición del ancestro común: allí está la arista hacia su padre, que no forma parte del camino. Con pesos 1–2=4, 2–3=7 y 2–4=9, el camino 3→4 suma 7+9 = 16, sin agregar cuatro.\n\nPara suma o máximo, el orden de los intervalos no afecta el resultado. Para concatenar texto o componer funciones sí importa. Conserva un acumulador para cada extremo y guarda resúmenes de cada tramo en ambos sentidos. Los tramos que suben desde u se leen al revés del orden del arreglo; los del lado de v deben unirse en orden contrario al que fueron retirados.\n\nCon actualizaciones sobre caminos puedes conservar la misma partición y usar un árbol de segmentos con etiquetas pendientes en lugar de Fenwick.',
    },
  ]),
  'usaco-plat-centroid': (lesson) => walkthrough([
    {
      title: 'Encontrar una estación activa cercana',
      body: 'Cinco estaciones forman la cadena 1–2–3–4–5. Al principio ninguna está activa: desde 5 respondemos −1. Activamos 1 y la distancia desde 5 pasa a cuatro. Activamos 4 y ahora la estación más cercana a 5 queda a una arista.\n\nLa entrada contiene n q, n−1 aristas y operaciones «1 v» para activar y «2 v» para consultar. n ≤ 10 000 y q ≤ 50 000. La distancia es el número de aristas, las estaciones no se desactivan y no hay pesos.\n\nBuscar desde la estación consultada por todo el árbol cuesta O(n) cada vez. Guardar todas las distancias cuesta O(n²). Prepararemos pocas estaciones de referencia para cada vértice.',
    },
    {
      title: 'Elegir una referencia que parta el árbol en mitades',
      body: 'Un **centroide** es un vértice cuya eliminación deja componentes de tamaño a lo sumo la mitad del original. En nuestra cadena, 3 sirve: quedan {1,2} y {4,5}, de tamaño dos. Elegimos otro centroide dentro de cada parte y repetimos.\n\nCada vértice participa en componentes que van reduciéndose por lo menos a la mitad. Por eso tiene O(log n) referencias. Las relaciones entre esas referencias forman el árbol de descomposición; sus aristas no son necesariamente aristas del árbol original.\n\nPara encontrar un centroide, calcula tamaños en la componente. Al quitar v, los lados de sus hijos tienen tamaño sz[hijo] y el lado de su padre tiene N−sz[v]. Buscamos un máximo de esos tamaños que no supere N/2.',
      code: excerpt(lesson, '        int c = start', '        vector<tuple'), codeKind: 'fragment',
    },
    {
      title: 'Guardar la distancia original a cada referencia',
      body: 'Después de elegir c, recorremos su componente para guardar en path[v] el par (c,distancia de v a c). Luego bloqueamos c y descomponemos las partes restantes. Bloquear significa no cruzarlo en recorridos posteriores; no borramos aristas.\n\nDesde 5 guardamos la referencia 3 a distancia dos y también referencias dentro de {4,5}. Desde 1 guardamos 3 a distancia dos y sus referencias en {1,2}. La referencia común 3 permitirá relacionarlos.',
      code: excerpt(lesson, '        vector<tuple', '    };\n    build(0);'), codeKind: 'fragment',
      afterCode: 'La búsqueda dentro de una componente usa una lista de trabajo con vértice, padre y distancia. build solo recurre al pasar a componentes de tamaño a lo sumo la mitad, por lo que su recursión tiene O(log n) profundidad.',
    },
    {
      title: 'Una activación ofrece distancias a sus referencias',
      body: 'best[c] guarda la menor distancia a un activo que ha ofrecido información a c. Todos empiezan en infinito. Al activar x, recorremos path[x] y hacemos best[c]=min(best[c],d).\n\nActivar 1 ofrece distancia dos a la referencia 3, así que best[3] pasa a dos. Consultar desde 5 puede usar sus dos aristas hasta 3 y las dos guardadas: candidata cuatro. Si no hubo ninguna activación, todas las candidatas siguen en infinito y respondemos −1.',
      code: excerpt(lesson, '        if (type == 1)', '    }\n}'), codeKind: 'fragment',
      afterCode: 'Al activar 4, best[3] baja a uno. Pasar de 5 por 3 y luego a 4 daría tres, pero una referencia de la componente {4,5} obtiene la distancia exacta uno. Por eso consultamos todas las referencias y no solo el centroide inicial.',
    },
    {
      title: 'Por qué el mínimo de candidatos es la distancia real',
      body: 'Cada candidata describe ir de v a una referencia c y de allí a algún activo x. Es un posible rodeo y nunca es más corto que el camino único entre v y x. Por tanto, ninguna candidata subestima la distancia al activo más cercano.\n\nElige ahora un activo óptimo x. En algún nivel de la descomposición aparece el primer centroide c que separa v y x, o coincide con uno de ellos. El camino entre ambos pasa por c. Ambos guardaron esa referencia, así que la candidata alcanza como máximo dist(v,c)+dist(c,x)=dist(v,x).\n\nUna candidata alcanza el óptimo y ninguna lo mejora falsamente: su mínimo es la respuesta. El argumento también sirve con pesos no negativos; con pesos negativos, la afirmación sobre rodeos requiere otro análisis.',
      check: { question: '¿Todas las referencias deben devolver la distancia exacta?', answer: 'No. Algunas dan rodeos más largos. Basta que ninguna dé menos que la respuesta real y que al menos una referencia, la que separa al par, alcance la distancia exacta.' },
    },
    complete(lesson, 'La entrada sigue nuestra cadena: consulta sin activos, activa 1, consulta, activa 4 y vuelve a consultar. Las respuestas son −1, 4 y 1. Las distancias se preparan una sola vez.', 'En cada nivel, las componentes recorridas son disjuntas y suman O(n) vértices. Hay O(log n) niveles: preparación y memoria O(n log n). Cada operación examina O(log n) pares ya guardados. Si calcularas sus distancias mediante LCA en ese momento, tendrías que añadir el costo de esas consultas.'),
    {
      title: 'Qué cambia cuando una estación se apaga',
      body: 'Activar dos veces no cambia un mínimo. Desactivar sí necesita saber quién lo produjo y qué otras estaciones siguen disponibles. best[c] por sí solo no lo recuerda.\n\nPuedes guardar un multiset de distancias por centroide. Al activar, inserta una distancia en cada referencia; al desactivar, elimina una sola aparición de esa distancia. La primera entrada restante da el mínimo. También registra si cada estación ya estaba activa para no insertarla dos veces.\n\nEn la cadena 1–2–3, si 1 y 3 están activos, la referencia 2 recibe dos copias de la distancia uno. Apagar 1 debe dejar una de ellas. Esta variante añade un factor logarítmico por las inserciones y eliminaciones; no es la que ejecuta el programa anterior.',
    },
  ]),
  'usaco-plat-vt': (lesson) => walkthrough([
    {
      title: 'Conectar pocas estaciones dentro de un árbol grande',
      body: 'Las aristas son 1–2, 1–3, 2–4, 2–5 y 3–6. Solo nos interesan las estaciones 4, 5 y 6. ¿Cuántas aristas necesita el menor subárbol que las conecta? En este caso necesita las cinco aristas.\n\nLa entrada contiene n k, n−1 aristas y k estaciones importantes distintas. 1 ≤ k ≤ n ≤ 20 000. Cada arista mide uno. Imprimimos una cantidad; con una única estación es cero.\n\nPara una sola pregunta podemos recorrer el árbol completo. La técnica que construiremos resulta útil al repetir preguntas con pocos vértices importantes: preparamos el árbol una vez y después conservamos solo las marcas y los puntos donde sus caminos se separan.',
    },
    {
      title: 'Qué vértices podemos quitar del dibujo',
      body: 'Los caminos de 4 y 5 se encuentran en 2. Para conectarlos con 6 necesitamos también 1. El vértice 3 solo está de paso entre 1 y 6: podemos sustituir 1–3–6 por una arista de longitud dos.\n\nConservamos entonces {1,2,4,5,6}. Esta representación reducida se llama **árbol virtual**. Sus aristas representan caminos del árbol original, no necesariamente una sola arista.\n\nEl punto de encuentro de dos vértices es su ancestro común más bajo, o LCA. Antes de responder preguntas preparamos profundidades, LCA y tiempos de entrada y salida de un recorrido DFS.',
      picture: { caption: 'Las aristas del árbol virtual y las longitudes que conservan.', rows: [
        { label: 'Arista virtual', values: ['1→2', '2→4', '2→5', '1→6'] },
        { label: 'Longitud original', values: ['1', '1', '1', '2'] },
      ] },
    },
    {
      title: 'Usar el orden DFS para reconocer ancestros',
      body: 'tin[v] registra cuándo entra DFS en v. tout[v] marca el final del bloque de su subárbol. Los descendientes de v aparecen juntos entre esos tiempos. u es ancestro de v si tin[u] ≤ tin[v] y tout[v] ≤ tout[u].\n\nCon esa prueba y una tabla de saltos hacia padres obtenemos LCA. Si ninguno es ancestro del otro, subimos u con saltos grandes mientras el destino todavía no sea ancestro de v. El padre del último u será el encuentro.',
      code: excerpt(lesson, '    auto anc =', '    vector<int> a(k)'), codeKind: 'fragment',
      afterCode: 'El programa usa DFS iterativo para calcular los tiempos. Las profundidades cuentan aristas desde la raíz, por lo que un camino de ancestro u a descendiente v mide dep[v]−dep[u].',
    },
    {
      title: 'Agregar solo los encuentros que hacen falta',
      body: 'Ordenamos las marcas por tin y agregamos el LCA de cada pareja consecutiva. Luego ordenamos todo otra vez y quitamos repetidos. Son como máximo k+(k−1)=2k−1 vértices.\n\n¿Por qué bastan parejas consecutivas? Los marcados de cada subárbol forman un bloque en el orden DFS. Si una bifurcación conecta marcas de dos hijos, hay una frontera entre esos bloques. Las marcas a ambos lados de esa frontera son consecutivas y su LCA es esa bifurcación.\n\nEn nuestro ejemplo, las marcas ordenadas 4,5,6 agregan LCA(4,5)=2 y LCA(5,6)=1. Aparecen exactamente los encuentros necesarios.',
      code: excerpt(lesson, '    auto cmp =', '    st.clear();'), codeKind: 'fragment',
    },
    {
      title: 'Conectar cada vértice con el ancestro retenido más cercano',
      body: 'Recorremos la lista final por tin y mantenemos una pila de ancestros retenidos. Antes de procesar v, quitamos de la cima los que ya no sean ancestros de v. Si queda u arriba, conectamos u con v. Después apilamos v.\n\nLa lista del ejemplo es 1,2,4,5,6. Al llegar a 5 quitamos 4 y lo conectamos con 2. Al llegar a 6 quitamos 5 y 2 y lo conectamos con 1. Cada conexión agrega su diferencia de profundidades.',
      code: excerpt(lesson, '    st.clear();', '    cout << ans'), codeKind: 'fragment',
      afterCode: 'El programa solo necesita sumar longitudes. Si después quisieras hacer una programación dinámica, además guardarías las conexiones en una lista de hijos del árbol virtual.',
    },
    {
      title: 'Por qué sumar longitudes no repite aristas',
      body: 'Añadimos todas las bifurcaciones relevantes. Entre un vértice retenido y su ancestro retenido más cercano no queda otra bifurcación que necesitemos separar. Por eso los caminos representados por aristas virtuales no comparten aristas interiores.\n\nSu unión contiene todos los caminos necesarios entre las marcas y ninguna rama que termine sin una marca. Es el menor subárbol que las conecta. Sumar 1+1+1+2 da cinco aristas originales.\n\nNo agregues automáticamente la raíz original. En la cadena 1–2–3–4–5, las marcas 3 y 5 necesitan dos aristas. La raíz virtual es 3; incluir el tramo desde 1 añadiría aristas ajenas a la pregunta.',
      check: { question: 'Si solo marcamos el vértice 4, ¿qué longitud debe tener el árbol virtual?', answer: 'Cero. La lista contiene únicamente 4, la pila no crea ninguna conexión y no necesitamos viajar hasta la raíz original.' },
    },
    complete(lesson, 'La entrada usa las tres estaciones 4, 5 y 6. La salida cinco cuenta aristas del árbol original, aunque el árbol virtual tenga solo cuatro conexiones.', 'Preparar DFS y saltos binarios cuesta O(n log n). Para k marcas, ordenar y obtener LCAs cuesta O(k log k+k log n), con O(k) espacio adicional. En varias preguntas reutiliza la preparación, pero reconstruye las listas y la pila de cada grupo de marcas.'),
    {
      title: 'Qué debes conservar al comprimir un camino',
      body: 'La diferencia de profundidades basta para longitudes sin pesos. Con pesos, guarda distancias desde la raíz y resta esas distancias en cada arista virtual. Si la pregunta pide el mínimo peso del tramo, debes preparar y consultar ese mínimo, no solo su longitud.\n\nEliminar vértices intermedios conserva únicamente lo que hayas resumido. Una restricción que dependa de una estación intermedia no desaparece por comprimirla. Representa antes su efecto en la arista.\n\nUna vez construido el árbol pequeño, puedes hacer DP para contar pares de marcas o decidir cortes. Su ventaja es trabajar con O(k) vértices relevantes; la transición concreta depende del nuevo problema.',
    },
  ]),
  'usaco-plat-kruskal-tree': (lesson) => walkthrough([
    {
      title: 'Qué nivel de carretera permite unir dos ciudades',
      body: 'Las ciudades 1, 2 y 3 tienen carreteras 1–2 de nivel 3, 2–3 de nivel 7 y 1–3 de nivel 10. Si tu permiso acepta carreteras de nivel como máximo W, el menor W para ir de 1 a 3 es siete: vas por 2.\n\nLa entrada contiene n m q, m aristas u v w y q pares u v. n ≤ 20 000, m ≤ 100 000, q ≤ 50 000 y 0 ≤ w ≤ 10⁹. Imprimimos el menor umbral, −1 si nunca hay conexión y cero si u=v.\n\nPodríamos probar umbrales con búsquedas en el grafo para cada pregunta. Como todas dependen de cómo se unen las mismas ciudades al habilitar carreteras, guardaremos ese historial una sola vez.',
    },
    {
      title: 'Abrir las carreteras en orden',
      body: 'Ordena aristas de menor a mayor peso, como en Kruskal. Un DSU mantiene qué ciudades están conectadas por las carreteras ya abiertas. Si una arista une ciudades del mismo grupo, no cambia la conectividad. Si une grupos distintos, los fusiona.\n\nAl abrir nivel tres aparecen juntas {1,2}. Al abrir nivel siete se incorpora 3. La carretera de diez ya no une grupos diferentes.\n\nVamos a registrar cada fusión como un nodo nuevo. Sus dos hijos son las raíces históricas de los grupos que fusionó y su etiqueta es el nivel de la carretera.',
      picture: { caption: 'Los vértices originales quedan como hojas del historial.', rows: [
        { label: 'Fusión', values: ['A', 'B'] },
        { label: 'Hijos', values: ['1 y 2', 'A y 3'] },
        { label: 'Etiqueta', values: ['3', '7'] },
      ] },
    },
    {
      title: 'Construir el historial sin perderlo al comprimir DSU',
      body: 'El código usa índices nuevos para las fusiones: total empieza en n. Al unir dos representantes a y b crea t, guarda sus hijos y fija sus padres históricos. Después DSU considera t representante del grupo nuevo.\n\nEl arreglo parent pertenece al árbol histórico y no se modifica por compresión de caminos. dsu sí puede cambiar cuando find busca representantes. Mezclar ambos arreglos destruiría las relaciones que usaremos en las consultas.',
      code: excerpt(lesson, '    int total = n;', '    int K = 1;'), codeKind: 'fragment',
      afterCode: 'Cada fusión reduce en uno la cantidad de componentes, así que hay a lo sumo n−1 nodos nuevos. Reservar 2n alcanza. El resultado puede ser un bosque si quedan ciudades desconectadas; no inventamos una carretera entre sus raíces.',
    },
    {
      title: 'La primera fusión común responde la pregunta',
      body: 'El ancestro común más bajo de dos hojas, LCA, es el primer nodo histórico que contiene ambas. Su etiqueta indica cuándo quedaron conectadas por primera vez. Para 1 y 2 es A, con tres; para 1 y 3 es B, con siete.\n\nNo buscamos el camino de menor suma. En un camino de pesos cinco y cinco, el umbral necesario es cinco aunque la suma sea diez. Una carretera directa de ocho tiene menor suma que diez, pero necesita un permiso mayor.\n\nPreparamos profundidades y saltos binarios sobre los nodos del bosque. Sus raíces apuntan a sí mismas. Recorremos de forma iterativa porque las fusiones pueden formar una cadena muy larga.',
    },
    {
      title: 'Encontrar ese ancestro con saltos binarios',
      body: 'Antes del LCA, comprueba si find(u) y find(v) coinciden. Si no, la respuesta es −1. Si u=v, el enunciado define cero. Para los demás pares igualamos profundidades y subimos ambos con saltos de mayor a menor mientras sus destinos sigan siendo distintos.\n\nCuando ya no puedan subir separados, su padre es el primer ancestro compartido. Imprimimos su etiqueta, no su número de nodo ni su profundidad.',
      code: excerpt(lesson, '        if (dep[u] < dep[v])', '        cout << weight'), codeKind: 'fragment',
      afterCode: 'Si al igualar profundidades los dos índices ya coinciden, ese nodo es el LCA y no damos el último paso al padre. El caso de dos hojas distintas normalmente llega a una fusión, pero la rutina conserva la lógica general de LCA.',
    },
    {
      title: 'Por qué la etiqueta es el menor umbral válido',
      body: 'Después de procesar todas las aristas con peso como máximo W, DSU representa exactamente las componentes del grafo que permiten esas aristas. Cada fusión registra una conexión real a su nivel.\n\nSi el LCA de u y v tiene etiqueta w, la fusión los conecta usando solo pesos ≤ w. Un umbral estrictamente menor no puede haberlos conectado: en ese caso ya pertenecerían al mismo grupo antes de cualquier fusión de nivel w. Por tanto, w es el mínimo.\n\nLos pesos empatados pueden producir distintos árboles binarios según su orden, pero todas esas fusiones llevan la misma etiqueta. Las respuestas por umbral permanecen iguales.',
      check: { question: 'Si 1–2 y 2–3 pesan cinco, ¿qué umbral conecta 1 con 3 aunque las fusiones se procesen en distinto orden?', answer: 'Cinco. El historial puede tener formas distintas, pero el primer ancestro que reúne las hojas tiene etiqueta cinco en cualquier orden.' },
    },
    complete(lesson, 'La entrada usa las tres carreteras del ejemplo y pregunta por 1–2, 1–3 y 2–2. Las respuestas son 3, 7 y 0. Los casos de componentes distintas se detectan antes de intentar LCA.', 'Ordenar cuesta O(m log m), preparar los saltos O(n log n) y cada LCA O(log n). La memoria es O(m+n log n). Este DSU enlaza representantes al nodo nuevo y usa compresión, sin unión por tamaño: una cota conservadora para todas sus búsquedas es O((m+q+n) log n), no debemos atribuirle automáticamente la cota α(n).'),
    {
      title: 'Separar aún más el DSU si necesitas la cota habitual',
      body: 'Otra implementación mantiene un DSU convencional con unión por tamaño y un arreglo raizHistorica[representante]. Al fusionar componentes, crea el nodo histórico con esas dos raíces; une los representantes por tamaño y guarda el nodo nuevo en el representante ganador.\n\nAsí puedes usar la cota amortizada O(α(n)) de DSU con compresión y unión por tamaño, mientras el árbol histórico conserva la misma información. No cambies parent al comprimir.\n\nPara comprobar una respuesta w en un caso pequeño, filtra aristas de peso ≤ w y busca un camino. Debe existir. Con el siguiente peso menor disponible, no debe existir. Incluye vértices aislados, aristas paralelas, empates y preguntas de un vértice consigo mismo.',
    },
  ]),
};
