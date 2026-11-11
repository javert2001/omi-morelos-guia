import type { PlatinumWalkthrough } from './platinum-helpers.ts';
import { complete, excerpt, walkthrough } from './platinum-helpers.ts';

export const platinumGeometryWalkthroughs: Record<string, PlatinumWalkthrough> = {
  'usaco-plat-geo-pri': (lesson) => walkthrough([
    {
      title: 'Saber si dos tramos se tocan',
      body: 'Un tramo va de (0,0) a (4,4) y otro de (0,4) a (4,0). Se cruzan en el centro: debemos responder SI. También responde SI si solo comparten un extremo o si se superponen sobre una misma recta.\n\nLa entrada contiene q y q líneas con las ocho coordenadas de A, B, C y D. Para cada pareja de segmentos cerrados AB y CD imprimimos SI o NO. q ≤ 100 000 y las coordenadas son enteras entre −10⁹ y 10⁹. Se permiten segmentos que sean un único punto.\n\nPodríamos calcular ecuaciones de rectas e intersecciones, pero aparecen divisiones y casos verticales. Como solo necesitamos decidir si existe contacto, usaremos signos exactos de productos entre coordenadas.',
    },
    {
      title: 'Una resta describe un desplazamiento',
      body: 'Un vector es un desplazamiento. Si A=(0,0) y B=(4,4), el vector B−A es (4,4). Para dos vectores u y v, su producto cruzado en el plano es ux·vy−uy·vx. Su signo dice hacia qué lado gira la dirección de u para apuntar a v.\n\nPara orientar tres puntos calculamos (B−A)×(C−A). Un resultado positivo coloca C a la izquierda de A→B; negativo, a la derecha; cero, sobre la misma recta. En el cruce inicial, C=(0,4) da 16 y D=(4,0) da −16.',
      code: excerpt(lesson, 'struct P', 'int sign('), codeKind: 'fragment',
      afterCode: 'Restar A hace que el resultado dependa de las posiciones relativas. Si trasladas todos los puntos la misma distancia, las diferencias y el signo permanecen iguales. Intercambiar B y C cambia el signo.',
    },
    {
      title: 'Buscar extremos a lados opuestos',
      body: 'Si C y D quedan estrictamente a lados opuestos de la recta AB, el segmento CD cruza esa recta. Para que el cruce también esté dentro de AB, A y B deben quedar a lados opuestos de la recta CD. Comprobamos las dos parejas.\n\nEn el ejemplo ambas parejas tienen signos opuestos: existe un cruce interior. No basta revisar que las cajas que rodean a los segmentos se superpongan. Eso no garantiza que los segmentos se encuentren.\n\nCompara signos, no productos de orientaciones completas: cada orientación puede caber en long long mientras su producto ya no cabe.',
      code: 'int sign(long long x) { return (x > 0) - (x < 0); }\n// x e y son las orientaciones de C y D respecto de AB.\n// z y w son las de A y B respecto de CD.\nbool cruceInterior = sign(x) * sign(y) < 0\n                  && sign(z) * sign(w) < 0;', codeKind: 'fragment',
      afterCode: 'sign solo devuelve −1, 0 o 1, por lo que multiplicar esos signos sí es seguro. Las orientaciones cero necesitan otra comprobación: pueden representar contacto, superposición o segmentos separados.',
    },
    {
      title: 'Estar en la recta no significa estar en el segmento',
      body: 'Los puntos (0,0), (1,0) y (2,0) están alineados. Sin embargo, (2,0) no pertenece al segmento que termina en (1,0). Además de orientación cero, exigimos que las dos coordenadas del punto estén entre las de los extremos.\n\nLa función on combina ambas condiciones. También funciona cuando A=B: su caja contiene únicamente ese punto.',
      code: excerpt(lesson, 'bool on(', 'bool hit('), codeKind: 'fragment',
      check: { question: '¿Los segmentos (0,0)–(1,0) y (2,0)–(3,0) se intersectan porque sus orientaciones son cero?', answer: 'No. Son colineales, pero ningún extremo pertenece a la caja del otro segmento. Hay un espacio entre ellos.' },
    },
    {
      title: 'Combinar el cruce interior y los contactos',
      body: 'Primero buscamos un cruce con signos estrictamente opuestos. Si no ocurre, probamos los cuatro extremos: cualquiera que esté sobre el otro segmento demuestra contacto.\n\nEso incluye el segundo ejemplo, (0,0)–(2,0) con (2,0)–(3,1): comparten (2,0). También incluye segmentos colineales que se superponen. Si se superponen, al menos un extremo de uno pertenece al otro.',
      code: excerpt(lesson, 'bool hit(', 'int main()'), codeKind: 'fragment',
      afterCode: 'Las comparaciones son inclusivas porque el enunciado dice segmentos cerrados. Con extremos abiertos tendríamos que distinguir contactos en extremos de puntos interiores. No cambies las desigualdades sin cambiar también esa definición.',
    },
    complete(lesson, 'La entrada presenta un cruce interior, un extremo compartido y dos segmentos colineales separados. Las respuestas son SI, SI y NO. El programa no calcula coordenadas de intersección: solo demuestra si hay un punto común.', 'Cada pregunta cuesta O(1) tiempo y memoria; el total es O(q). Con estas cotas, cada diferencia es como máximo 2·10⁹ y una orientación queda acotada por 8·10¹⁸, dentro de long long. Las coordenadas ya son long long antes de multiplicar. Convertir un producto desbordado de int después no lo repararía.'),
    {
      title: 'El mismo producto cruzado también mide áreas',
      body: 'El valor absoluto del producto cruzado mide el área del paralelogramo formado por dos vectores. El triángulo ocupa la mitad. Con A=(0,0), B=(4,0) y C=(1,3), la orientación vale doce: el área del triángulo es seis.\n\nPara un polígono simple cuyos vértices recorren el borde, suma xi·y(i+1)−yi·x(i+1), incluyendo la última pareja con el primer vértice. El valor absoluto es el doble del área; su signo indica el sentido del recorrido.\n\nCon coordenadas enteras podemos conservar el doble del área sin decimales. Hay que revisar la cota de la suma completa y respetar el orden del borde: ordenar vértices arbitrariamente cambia la figura.',
    },
    {
      title: 'Producto punto y punto más cercano',
      body: 'Otra operación, el producto punto u·v = ux·vx+uy·vy, permite proyectar y comparar distancias. u·u es su longitud al cuadrado. Para vectores no nulos, el signo distingue un ángulo agudo, recto u obtuso.\n\nPara encontrar el punto de la recta AB más cercano a P, toma v=B−A y t=((P−A)·v)/(v·v). El punto es A+t·v. Para limitarlo al segmento, recorta t al intervalo [0,1]. Si A=B, devuelve A sin dividir.\n\nCon A=(0,0), B=(2,0) y P=(3,4), t=1.5. La proyección sobre la recta es (3,0), pero queda fuera del segmento. Su punto más cercano es B y la distancia es √17, no cuatro. Esta operación sí puede necesitar decimales; las decisiones de intersección enteras del programa no los necesitan.',
    },
  ]),
  'usaco-plat-sweep-line': (lesson) => walkthrough([
    {
      title: 'Medir el terreno cubierto sin duplicar la parte común',
      body: 'Un huerto ocupa [0,3] × [0,2] y otro [2,4] × [1,4]. Cada uno mide seis unidades cuadradas. Su intersección mide una, así que juntos cubren once, no doce. Queremos hacer el mismo cálculo con muchos rectángulos.\n\nLa entrada contiene n y n rectángulos x1 y1 x2 y2, con lados paralelos a los ejes. n ≤ 20 000 y las coordenadas están entre −10⁶ y 10⁶. Imprimimos el área cubierta al menos una vez. Un ancho o alto cero aporta cero.\n\nSumar áreas individuales cuenta repetidamente los cruces. Restar solo intersecciones de parejas también falla cuando coinciden tres o más rectángulos. Vamos a dividir el plano en franjas donde la cobertura no cambia.',
    },
    {
      title: 'Cortar donde aparece un borde vertical',
      body: 'Mueve una línea vertical desde la izquierda. Entre dos bordes consecutivos, los rectángulos que atraviesa son siempre los mismos. Su unión vertical tiene longitud constante. El área de esa franja es ancho por longitud cubierta.\n\nEn nuestro ejemplo, entre x=0 y x=2 solo está el primer huerto: altura dos, área cuatro. Entre 2 y 3, la unión va de y=0 a y=4: altura cuatro, área cuatro. Entre 3 y 4 solo queda el segundo: altura tres, área tres. Total once.',
      picture: { caption: 'Cada franja se cuenta una sola vez.', rows: [
        { label: 'Franja x', values: ['[0,2)', '[2,3)', '[3,4)'] },
        { label: 'Ancho', values: ['2', '1', '1'] },
        { label: 'Altura cubierta', values: ['2', '4', '3'] },
        { label: 'Área', values: ['4', '4', '3'] },
      ] },
    },
    {
      title: 'Cada huerto genera una entrada y una salida',
      body: 'El borde izquierdo genera un evento +1 sobre [y1,y2); el derecho, uno −1 sobre el mismo intervalo. Usamos intervalos semiabiertos porque los bordes tienen área cero.\n\nAntes de aplicar un evento en x, sumamos la longitud cubierta anterior por x−xAnterior. Esa longitud describe la franja que acabamos de atravesar. Después actualizamos el conjunto de intervalos activos.\n\nCon varios eventos en la misma x, puedes agruparlos. El programa los procesa uno por uno: entre ellos el ancho es cero, así que los estados intermedios no añaden área.',
    },
    {
      title: 'Las hojas representan espacios, no coordenadas',
      body: 'Reúne todas las alturas de bordes, ordénalas y quita duplicados. Aquí Y=[0,1,2,4]. Las hojas representan [0,1), [1,2) y [2,4): sus longitudes son 1, 1 y 2. La última coordenada no necesita una hoja propia.\n\nLa compresión conserva el orden, pero no convierte las distancias en uno. Un nodo que abarca hojas L a R representa longitud Y[R+1]−Y[L].\n\nCada nodo guarda cover, cuántas coberturas completas se detuvieron allí, y len, la longitud cubierta de su intervalo. Las coberturas parciales quedan representadas en sus hijos.',
    },
    {
      title: 'Actualizar la longitud sin borrar otras coberturas',
      body: 'Si cover[v] es positivo, todo el intervalo del nodo está cubierto y len[v] es su longitud real. Si es cero, una hoja aporta cero y un nodo interno suma sus hijos.\n\nPara actualizar, ignora lo disjunto. En cobertura completa cambia el contador; en cobertura parcial visita los hijos. Al regresar aplica la regla de len. No necesitas bajar una cobertura completa hasta todas las hojas.',
      code: excerpt(lesson, '    function<void(int, int, int, int, int, int)> update', '    long long area'), codeKind: 'fragment',
      afterCode: 'No borres los hijos cuando cover sea positivo. Quizá conserven otro rectángulo que seguirá activo cuando salga el que cubría al padre. Las altas y bajas del mismo rectángulo recorren exactamente el mismo intervalo, por lo que sus contadores se compensan.',
    },
    {
      title: 'Convertir eventos en área',
      body: 'La raíz len[1] contiene la unión de todas las alturas activas. Multiplicamos por el ancho recorrido antes de modificarla. Para un evento [y,z), las hojas afectadas empiezan en el índice de y y terminan una antes del índice de z.\n\nEn x=2 agregamos el segundo huerto después de sumar las primeras cuatro unidades de área. La raíz pasa de dos a cuatro. En x=3 sumamos otras cuatro y quitamos el primero: la raíz queda en tres.',
      code: excerpt(lesson, '    long long area', '    cout << area'), codeKind: 'fragment',
      check: { question: 'Si un rectángulo sale, ¿podemos poner a cero todas sus alturas?', answer: 'No. Otro rectángulo puede seguir cubriéndolas. Debemos retirar solo su aportación al contador y reconstruir len con las coberturas que continúan activas.' },
    },
    {
      title: 'Justificar las dos partes del algoritmo',
      body: 'Primero, el árbol mantiene la unión vertical. Con contador positivo todo el nodo está cubierto; con contador cero, su cobertura es exactamente la de sus hijos. Esa regla prueba len por inducción desde las hojas.\n\nSegundo, entre eventos el conjunto de intervalos no cambia. La altura de la unión es constante y el producto por el ancho da su área exacta. Las franjas no se superponen, así que sus áreas se suman sin duplicar ninguna región.\n\nHay dos eventos por rectángulo, O(n) alturas y O(log n) trabajo por actualización. Ordenar y procesar cuestan O(n log n), con O(n) memoria. Consultar len[1] cuesta O(1).',
    },
    complete(lesson, 'La entrada contiene los dos huertos del dibujo. La salida es once. El programa descarta rectángulos degenerados y devuelve cero inmediatamente si no queda ninguno.', 'Usamos long long para longitudes y productos. La unión está dentro de una caja de lado 2·10⁶, así que su área cabe en 64 bits. Prueba rectángulos idénticos, uno dentro de otro y dos que solo compartan borde. También prueba alturas muy separadas: contar hojas en lugar de longitudes debe detectarse con ese caso.'),
  ]),
  'usaco-plat-convex-hull': (lesson) => walkthrough([
    {
      title: 'Rodear todos los puntos y calcular el área',
      body: 'Hay puntos en (0,0), (2,0), (2,2), (0,2) y (1,1). Si ajustas una liga alrededor de ellos, queda un cuadrado de lado dos. El punto central no modifica el contorno. Queremos imprimir el doble del área: ocho.\n\nLa entrada contiene n y n puntos enteros, con n ≤ 100 000 y coordenadas entre −10⁶ y 10⁶. Puede haber repetidos. Si la figura queda reducida a un punto o un segmento, su área es cero.\n\nEse contorno es la **envolvente convexa**: rodea los puntos sin entrantes. Probar cada pareja como posible lado y revisar todos los demás puntos sería muy costoso. Ordenaremos los puntos para construir el borde inferior y superior.',
    },
    {
      title: 'Decidir si tres puntos forman un giro válido',
      body: 'Para A, B y C, el producto cruzado (B−A)×(C−A) es positivo si A→B→C gira a la izquierda, negativo si gira a la derecha y cero si están alineados. No necesitamos pendientes, ángulos ni divisiones.\n\nAl construir el borde inferior de izquierda a derecha queremos giros a la izquierda. Si los últimos puntos a,b y el nuevo p giran a la derecha, b queda por encima de la conexión directa a→p y no es una esquina inferior necesaria. Si están alineados, b tampoco es una esquina: podemos conservar los extremos.',
      code: excerpt(lesson, 'long long cross(', 'int main()'), codeKind: 'fragment',
    },
    {
      title: 'Ordenar y mantener una pila de esquinas',
      body: 'Ordena por x y después por y, y elimina repetidos. En nuestro ejemplo el orden es (0,0), (0,2), (1,1), (2,0), (2,2). Guarda una cadena en un vector: el último punto es el último candidato a esquina.\n\nAl llegar (1,1), la terna (0,0),(0,2),(1,1) gira a la derecha: quitamos (0,2) de la cadena inferior. Después, al llegar (2,0), retiramos (1,1). Eso no prohíbe que (0,2) aparezca en la cadena superior; solo descartamos su papel en la inferior.',
      code: excerpt(lesson, '    vector<P> lo, hi;', '    for (int i = n - 1;'), codeKind: 'fragment',
      afterCode: 'El while repite la comprobación porque quitar una esquina puede descubrir otra terna inválida. Al terminar, añadimos p. Cada punto entra una vez y puede salir una vez; aunque un while retire varios, el trabajo total de esta cadena es O(n).',
    },
    {
      title: 'Construir el otro lado y cerrar el borde',
      body: 'Recorre ahora los puntos en orden inverso con la misma regla. Obtienes la cadena superior, desde la derecha hacia la izquierda. Ambas comparten los dos extremos, así que quitamos el último de cada una antes de unirlas.\n\nPara el ejemplo, el borde final es (0,0), (2,0), (2,2), (0,2). Todos los giros son a la izquierda y el centro queda dentro. No ordenes estas esquinas otra vez: ahora ya recorren el borde en el orden necesario.',
      code: excerpt(lesson, '    for (int i = n - 1;', '    long long area'), codeKind: 'fragment',
      picture: { caption: 'Las esquinas recorren el cuadrado sin el punto central.', rows: [
        { label: 'Orden del borde', values: ['1', '2', '3', '4'] },
        { label: 'Punto', values: ['(0,0)', '(2,0)', '(2,2)', '(0,2)'] },
      ] },
    },
    {
      title: 'Obtener el área sin redondear',
      body: 'Para vértices ordenados sobre un polígono simple, suma xi·y(i+1)−yi·x(i+1), incluyendo el último con el primero. El valor absoluto es el doble del área. En el cuadrado, las cuatro contribuciones son 0, 4, 4 y 0: total ocho.\n\nEl índice siguiente usa módulo para volver al primer punto después del último. Con coordenadas enteras, el resultado también es entero y no necesitamos dividir entre dos ni usar decimales.',
      code: excerpt(lesson, '    long long area', '    cout << llabs'), codeKind: 'fragment',
      afterCode: 'Para el perímetro usarías las distancias entre esquinas consecutivas, no estos productos. Área y perímetro son preguntas distintas sobre el mismo borde. Si la figura es degenerada, fija también qué definición de perímetro espera el enunciado.',
    },
    {
      title: 'Por qué podemos descartar un punto',
      body: 'Tras cada inserción, la cadena inferior conserva giros a la izquierda y deja todos los puntos procesados sobre ella o por encima. Una terna con giro derecho o recto tiene un punto intermedio que no necesita el borde inferior extremo. Reemplazar sus dos enlaces por uno mantiene el cierre inferior de los puntos procesados.\n\nLos puntos nuevos llegan en orden lexicográfico; el ajuste solo afecta el extremo de la cadena. El procedimiento simétrico construye el borde superior. Juntos encierran todos los puntos y conservan sus esquinas extremas.\n\nOrdenar domina el tiempo O(n log n); ambas cadenas suman O(n) trabajo y memoria. Con las cotas dadas, orientaciones y suma del área caben en long long.',
    },
    complete(lesson, 'La entrada contiene las cuatro esquinas del cuadrado y el centro. El programa conserva solo las esquinas y produce ocho. Si quedan menos de tres puntos distintos, devuelve cero antes de construir cadenas.', 'Prueba todos los puntos iguales y todos sobre una recta. Con varios colineales, la regla ≤0 deja solo los extremos y el área sale cero. Añadir puntos interiores o duplicar una esquina no debe cambiar el resultado.'),
    {
      title: 'Si piden todos los puntos que están sobre el borde',
      body: 'Nuestro objetivo necesita únicamente las esquinas. Si también quieres conservar puntos intermedios de un lado, retira solo cuando el producto cruzado sea menor que cero, no cuando sea cero.\n\nPor ejemplo, añadir (1,0) al cuadrado no cambia su área, pero ese punto sí pertenece al borde. La desigualdad estricta permite conservarlo. Trata aparte el caso donde todos los puntos sean colineales: ambas cadenas podrían listar los mismos puntos y duplicarlos.\n\nUna revisión útil es comprobar el signo de todos los giros y que cada punto original quede dentro o sobre el polígono obtenido. Los casos con repetidos y colineales comprueban la política del borde, no solo el cálculo de área.',
      check: { question: '¿Debemos conservar (1,0) para calcular el área del cuadrado de lado dos?', answer: 'No hace falta: está sobre un lado recto entre (0,0) y (2,0). Quitarlo no cambia la figura ni su área. Sí lo conservaríamos si la salida pidiera todos los puntos de entrada situados sobre el borde.' },
    },
  ]),
};
