import type { PlatinumWalkthrough } from './platinum-helpers.ts';
import { complete, excerpt, walkthrough } from './platinum-helpers.ts';

export const platinumOptimizationWalkthroughs: Record<string, PlatinumWalkthrough> = {
  'usaco-plat-convex-hull-trick': (lesson) => walkthrough([
    {
      title: 'Elegir la recta que da el menor valor',
      body: 'Tenemos las funciones 3x, 2x+1 y x+5. Para x=0, sus valores son 0, 1 y 5: gana la primera. Para x=2 son 6, 5 y 7: gana la segunda. Para x=5 son 15, 11 y 10: gana la tercera. Queremos responder muchas preguntas de este tipo.\n\nLa entrada contiene n q, n pares m b y q valores x. Cada par representa m·x+b. Las pendientes m llegan estrictamente decrecientes y las consultas x no decrecen. n,q ≤ 100 000, |m|,|b| ≤ 10 000 y |x| ≤ 10⁶. Imprimimos un mínimo por consulta.\n\nEvaluar todas las rectas cuesta O(nq). Aprovecharemos los dos órdenes para conservar únicamente las candidatas que pueden ganar y avanzar entre ellas.',
    },
    {
      title: 'Dónde cambia la recta ganadora',
      body: 'Las rectas 3x y 2x+1 se igualan en x=1. Antes gana 3x; después gana 2x+1 porque crece más despacio. A su vez, 2x+1 y x+5 se igualan en x=4. La recta del medio puede ganar entre uno y cuatro.\n\nEl menor valor de todas las rectas forma su **envolvente inferior**. Convex hull trick organiza las rectas de esa envolvente. Aquí sus pendientes decrecientes hacen que los ganadores avancen en el mismo orden cuando x crece.\n\nUsaremos una deque: permite agregar y quitar al final durante la construcción y quitar al frente al avanzar por las consultas.',
      picture: { caption: 'Los valores que imprimirá nuestra entrada de prueba.', rows: [
        { label: 'x', values: ['0', '2', '5'] },
        { label: 'Ganadora', values: ['3x', '2x+1', 'x+5'] },
        { label: 'Mínimo', values: ['0', '5', '10'] },
      ] },
    },
    {
      title: 'Detectar una recta que nunca será necesaria',
      body: 'Sean tres rectas a,b,c, con pendientes estrictamente decrecientes. b empieza a vencer a a en xAB=(b.b−a.b)/(a.m−b.m). c empieza a vencer a b en xBC=(c.b−b.b)/(b.m−c.m).\n\nSi xAB ≥ xBC, b no tiene un intervalo donde venza a ambas: cuando por fin mejora a a, c ya es igual o mejor. Podemos eliminar b. Con 3x, 2x+10 y x+5, esos cruces serían diez y −5: la recta intermedia sobra.\n\nAmbos denominadores son positivos. Multiplicar en cruz conserva la desigualdad y evita comparar decimales de intersección.',
      code: excerpt(lesson, 'struct Line', 'int main()'), codeKind: 'fragment',
      afterCode: 'bad devuelve si la recta b puede quitarse entre a y c. Los campos m y b son pendiente e intercepto; por eso b.b significa «intercepto de la recta llamada b». Los límites del ejercicio hacen seguros los productos en long long. Con otros límites debes acotar también estos productos, no solo m·x+b.',
    },
    {
      title: 'Construir la envolvente por su extremo derecho',
      body: 'Al llegar una nueva recta c, examina las dos últimas de la deque. Si la del medio sobra según bad, quítala y vuelve a comprobar con la anterior. Finalmente agrega c.\n\nCada eliminación deja ordenados los puntos donde cambia el ganador. Una recta que todavía no gana puede ser útil más adelante; solo la retiramos cuando su intervalo de ventaja desaparece.',
      code: excerpt(lesson, '    while (n--)', '    while (q--)'), codeKind: 'fragment',
      afterCode: 'El problema garantiza pendientes estrictamente decrecientes. Si admitieras pendientes iguales, conserva primero únicamente la de menor intercepto: es igual o mejor para todo x. No apliques la comparación de cruces a dos pendientes iguales porque su denominador sería cero.',
    },
    {
      title: 'Avanzar por consultas que nunca retroceden',
      body: 'Para una consulta x, compara las dos primeras rectas. Si la segunda da un valor menor o igual, retira la primera. La segunda tiene menor pendiente, así que seguirá siendo al menos tan buena para cualquier consulta posterior mayor. Repite hasta que el frente sea el mejor.\n\nEn x=0 conservamos 3x. En x=2, 2x+1 lo vence y quitamos 3x. En x=5, x+5 vence a 2x+1 y lo quitamos. Cada retirada es definitiva gracias al orden de x.',
      code: excerpt(lesson, '    while (q--)', '\n}'), codeKind: 'fragment',
      check: { question: 'Después de consultar x=5, ¿podemos usar esta misma deque recortada para volver a x=0?', answer: 'No. Ya quitamos 3x, que era la mejor en cero. Si las consultas no son crecientes, debemos conservar la envolvente y buscar la mejor recta sin destruir el frente.' },
    },
    {
      title: 'Contar las operaciones de toda la secuencia',
      body: 'Cada recta entra una vez. Puede salir como máximo una vez, por el frente o por el final. Por eso todos los while de construcción y consulta juntos hacen O(n+q) trabajo y usan O(n) memoria. Una operación aislada sí puede quitar muchas rectas: la cota es amortizada sobre toda la secuencia.\n\nLa prueba de corrección tiene dos partes. bad elimina solo rectas sin ventaja posible. Al consultar, la siguiente recta que ya vence a la primera seguirá venciéndola hacia la derecha. Ambas eliminaciones conservan el mínimo que todavía necesitaremos.\n\nSi solo interesa el valor, podemos eliminar empates. Si debes recuperar un índice específico entre candidatos empatados, incorpora esa regla explícitamente en las comparaciones.',
    },
    complete(lesson, 'La entrada contiene 3x, 2x+1 y x+5, y consulta 0, 2 y 5. Las respuestas son 0, 5 y 10. El programa supone los órdenes garantizados por el enunciado; no ordena las consultas ni las rectas por su cuenta.', 'Prueba la recta intermedia 2x+10: debe desaparecer sin cambiar los mínimos. Con pendientes ordenadas y consultas arbitrarias, puedes conservar la envolvente y buscar por binaria en O(log n). Con inserciones de pendientes sin orden, estudia una estructura como Li Chao; la deque explicada ya no tiene sus garantías.'),
    {
      title: 'De una programación dinámica a consultas de rectas',
      body: 'Supón dp[i]=min(j<i){dp[j]+(h[i]−h[j])²+C}. Probar todos los j cuesta O(n²). Expande el cuadrado y separa lo que no depende de j: dp[i]=h[i]²+C+min(j<i){(−2h[j])·h[i]+dp[j]+h[j]²}.\n\nCada j aporta una recta de pendiente −2h[j] e intercepto dp[j]+h[j]². El estado i consulta x=h[i]. Si h crece estrictamente, las pendientes decrecen y las consultas crecen, justo las condiciones de nuestra deque.\n\nCon h=[0,2,5], C=1 y dp[0]=0, la primera recta es cero. Consultar x=2 da cero y dp[1]=4+1=5. Insertamos después −4x+9. En x=5 da −11, de modo que dp[2]=25+1−11=15. La opción j=0 costaba 26.',
      code: '// Antes del ciclo, inserta la recta del estado 0.\nfor (int i = 1; i < n; i++) {\n    dp[i] = h[i] * h[i] + C + consultar(h[i]);\n    insertar(-2 * h[i], dp[i] + h[i] * h[i]);\n}', codeKind: 'fragment',
      afterCode: 'consultar e insertar representan las dos operaciones de la envolvente que acabamos de desarrollar. Consulta antes de insertar i porque solo se permiten j<i. No ordenes los estados para forzar monotonía si eso cambia sus dependencias: la transformación algebraica seguirá siendo válida, pero necesitarás otra estructura.',
    },
  ]),
  'usaco-plat-dc-dp': (lesson) => walkthrough([
    {
      title: 'Repartir una fila en grupos contiguos',
      body: 'La fila de cargas es [1,2,3,4]. Debemos dividirla en exactamente dos segmentos no vacíos. Cada segmento cuesta el cuadrado de la suma de sus cargas. Cortar después de 1 cuesta 1²+9²=82; después de 2 cuesta 3²+7²=58; después de 3 cuesta 6²+4²=52. El menor costo es 52.\n\nLa entrada contiene n K y n valores entre cero y mil. n ≤ 2 000 y 1 ≤ K ≤ min(n,50). Imprimimos el menor costo de una partición en exactamente K segmentos contiguos no vacíos.\n\nNo queremos enumerar todas las particiones. Primero escribiremos una DP que pruebe todos los últimos cortes; después justificaremos cuáles puede dejar de probar.',
    },
    {
      title: 'Definir un estado que deje solo un corte por decidir',
      body: 'dp[k][i] es el menor costo para dividir los primeros i elementos en k segmentos. Si el último empieza en j+1, los primeros j elementos deben estar divididos en k−1 grupos.\n\nPrepara sumas prefijas S. La suma del último segmento es S[i]−S[j], así que dp[k][i]=min(k−1≤j<i){dp[k−1][j]+(S[i]−S[j])²}. El límite j≥k−1 deja al menos un elemento por grupo anterior; j<i hace no vacío al último.\n\nEl estado inicial es dp[0][0]=0. Los demás estados con cero grupos son imposibles. La solución directa tiene K·n estados y prueba hasta n cortes por estado: O(Kn²).',
      code: '// Versión directa para una fila k.\nfor (int i = k; i <= n; i++) {\n    cur[i] = INF;\n    for (int j = k - 1; j < i; j++) {\n        if (prev[j] == INF) continue;\n        long long suma = S[i] - S[j];\n        cur[i] = min(cur[i], prev[j] + suma * suma);\n    }\n}', codeKind: 'fragment',
    },
    {
      title: 'Qué información nos da el corte de una posición central',
      body: 'Para una fila fija k, llama opt[i] al menor j que alcanza su mínimo. La optimización exige que esos cortes no retrocedan: opt[i] ≤ opt[i+1]. No es una propiedad de cualquier DP. Tendremos que probarla para este costo y para cargas no negativas.\n\nSi ya sabemos que opt[M]=p en una posición central M, las posiciones a su izquierda solo necesitan cortes ≤ p y las de su derecha solo cortes ≥ p. Así resolvemos una mitad restringiendo candidatos y luego la otra.\n\nPara nuestra fila con dos grupos, los prefijos de longitudes 2, 3 y 4 tienen cortes óptimos 1, 2 y 3. Los mínimos son 5, 18 y 52.',
      picture: { caption: 'Segunda fila de DP para [1,2,3,4].', rows: [
        { label: 'Elementos i', values: ['2', '3', '4'] },
        { label: 'Mejor corte opt[i]', values: ['1', '2', '3'] },
        { label: 'Costo dp[2][i]', values: ['5', '18', '52'] },
      ] },
    },
    {
      title: 'Demostrar que los cortes no retroceden',
      body: 'Escribe w(l,r)=(S[r]−S[l])². Para a≤b≤c≤d, separa las cargas en tres zonas consecutivas de sumas A, B y C. La diferencia w(a,d)+w(b,c)−w(a,c)−w(b,d) es (A+B+C)²+B²−(A+B)²−(B+C)² = 2AC.\n\nComo las cargas son no negativas, 2AC≥0. Por tanto, w(a,c)+w(b,d) ≤ w(a,d)+w(b,c). Esta desigualdad se llama Monge.\n\nSi los mejores cortes se cruzaran al avanzar de una posición a otra, podríamos intercambiarlos usando esa desigualdad sin empeorar el costo. Los términos de la fila anterior aparecen una vez a cada lado y se cancelan. Eligiendo siempre el menor corte en empates, un retroceso contradice esa elección. Así obtenemos la monotonía necesaria.\n\nLa no negatividad no es decorativa. Si A=−2 y C=4, la diferencia sería −16 y esta prueba fallaría.',
    },
    {
      title: 'Resolver la posición central y repartir los candidatos',
      body: 'solve(L,R,optL,optR) distingue dos intervalos: posiciones que faltan por resolver y cortes que todavía podrían ganar. Calcula M, prueba sus cortes y guarda best. Después limita los cortes de la mitad izquierda a optL…best y los de la derecha a best…optR.\n\nEl corte nunca puede llegar a M porque el último grupo debe tener un elemento. Recorremos j en orden creciente y solo cambiamos best ante una mejora estricta: así conservamos el menor corte empatado.',
      code: excerpt(lesson, '        function<void(int, int, int, int)> solve', '        prev.swap(cur);'), codeKind: 'fragment',
      afterCode: 'La llamada inicial solve(k,n,k−1,n−1) solo incluye estados posibles de la fila k. Saltamos prev[j]=INF antes de sumar para no operar con un estado imposible. La recursión termina al quedar L>R, no cuando se acaba un intervalo de cortes: son conceptos distintos.',
    },
    {
      title: 'Guardar solo dos filas y contar el trabajo',
      body: 'Una fila solo lee la anterior, de modo que basta prev y cur. Antes de calcular k, ponemos cur en infinito. Al terminar intercambiamos ambas: prev pasa a ser la fila recién resuelta. No inicializamos estados i<k como cero porque sería permitir grupos vacíos.\n\nEn cada nivel de la recursión se revisan O(n) candidatos entre todos los intervalos, incluyendo sus fronteras compartidas. Hay O(log n) niveles: cada fila cuesta O(n log n) y las K filas O(Kn log n).\n\nGuardamos O(n) valores más una pila recursiva de profundidad O(log n). Las sumas pueden alcanzar dos millones y sus cuadrados necesitan long long.',
      check: { question: 'Si K=n, ¿qué partición está permitida y qué costo produce para [2,0,5]?', answer: 'Cada grupo debe contener un solo elemento. El costo es 2²+0²+5²=29. Permitir un grupo vacío rompería la definición del problema.' },
    },
    complete(lesson, 'La entrada contiene [1,2,3,4] y pide dos grupos. El programa construye las dos filas y devuelve 52. La última transición elige el corte después del tercer elemento.', 'Compara esta versión con la recurrencia directa en arreglos pequeños. Incluye ceros, K=1 y K=n, y revisa los empates con la regla del menor corte. Si cambias la función de costo o permites negativos, vuelve a demostrar monotonía; observarla en unas pruebas no basta para justificar la optimización.'),
  ]),
  'usaco-plat-plat-conclusion': (lesson) => walkthrough([
    {
      title: 'Resolver una consulta combinando orden y conectividad',
      body: 'Una red tiene carreteras 1–2 de dificultad tres y 2–3 de dificultad siete. Desde una ciudad v puedes usar solo carreteras con dificultad ≤ W. Queremos contar cuántas ciudades alcanzas, incluida la ciudad de partida.\n\nLa entrada contiene n m q, m aristas no dirigidas u v w y q consultas v W. n,m,q ≤ 100 000, se permite m=0 y los pesos van de cero a 10⁹. Imprimimos respuestas en el orden original.\n\nUna búsqueda por consulta es una solución directa: filtra carreteras por W y cuenta vértices visitados. Cuesta O(q(n+m)). Antes de elegir una estructura, observa qué cambia al aumentar W: se agregan carreteras permitidas, pero ninguna deja de estarlo.',
    },
    {
      title: 'Ordenar preguntas para que el trabajo anterior siga sirviendo',
      body: 'Las consultas se conocen de antemano y no modifican la red. Podemos ordenarlas por W. También ordenamos las aristas por w y avanzamos por ellas una sola vez.\n\nSupón que las preguntas llegan como (1,7), (1,2), (1,3) y (3,3). Las procesaremos con límites 2,3,3,7. Cada pregunta conserva su id para guardar el resultado en su lugar original.\n\nEn W=2 no hay carreteras y desde 1 contamos una ciudad. En W=3 se une {1,2}: desde 1 contamos dos y desde 3 una. En W=7 las tres quedan conectadas.',
      picture: { caption: 'La impresión respeta el orden de entrada, no el del barrido.', rows: [
        { label: 'Consulta original', values: ['(1,7)', '(1,2)', '(1,3)', '(3,3)'] },
        { label: 'Respuesta', values: ['3', '1', '2', '1'] },
      ] },
    },
    {
      title: 'Guardar grupos conectados y sus tamaños',
      body: 'Un DSU representa componentes: grupos de vértices conectados. par[v] apunta hacia un representante y sz[representante] cuenta sus vértices. Al principio cada ciudad es una componente de tamaño uno.\n\nfind sigue padres hasta la raíz. La compresión de caminos acorta las búsquedas futuras. Al unir dos raíces, coloca la componente menor dentro de la mayor y suma sus tamaños. Si las raíces ya coinciden, no cambies el tamaño: esa carretera no añadió ciudades al grupo.',
      code: excerpt(lesson, '    vector<int> par', '    int at = 0;'), codeKind: 'fragment',
      afterCode: 'El código comprime saltando hacia el abuelo durante find. sz solo es una respuesta válida en una raíz actual: por eso consultaremos sz[find(v)] y no necesariamente sz[v].',
    },
    {
      title: 'Incorporar todas las carreteras permitidas antes de responder',
      body: 'at señala la siguiente arista todavía no procesada. Para una consulta z, insertamos aristas mientras su peso sea ≤ z.w. Después leemos el tamaño de la componente de z.v.\n\nUsamos ≤ porque una carretera exactamente igual al límite sí está permitida. Los empates entre consultas no exigen reconstruir nada: el conjunto de carreteras es el mismo. Los empates entre aristas se procesan todos antes de responder ese límite.',
      code: excerpt(lesson, '    int at = 0;', '    for (int x : ans)'), codeKind: 'fragment',
      afterCode: 'ans[z.id] devuelve el resultado a su posición original. Dos aristas paralelas que unen las mismas componentes no duplican el tamaño: la segunda encuentra a==b y se omite su unión.',
    },
    {
      title: 'La propiedad que hace correcto el barrido',
      body: 'Justo antes de responder W, DSU representa exactamente las componentes del grafo formado por todas las aristas de peso ≤ W. Al principio, sin aristas, cada vértice está solo. Agregar una arista une precisamente las dos componentes que conecta, o no cambia nada si ya estaban unidas.\n\nComo procesamos umbrales crecientes, una arista que entró siempre seguirá permitida. Como el while consume todas las que alcanzan el límite, no falta ninguna. El tamaño de la componente de v es entonces exactamente la cantidad buscada.\n\nCada arista entra una vez. Ordenar cuesta O(m log m+q log q); el DSU con tamaño y compresión añade O((m+q)α(n)) amortizado. La memoria es O(n+m+q).',
      check: { question: '¿Cuántas ciudades alcanza un vértice aislado si el límite es enorme?', answer: 'Una: él mismo. El enunciado incluye el origen aunque no exista ninguna carretera para salir.' },
    },
    complete(lesson, 'La entrada usa las cuatro consultas de la tabla. Aunque se calculan por límites crecientes, la salida vuelve al orden original: 3, 1, 2 y 1.', 'Prueba una red sin aristas, aristas de peso cero, componentes separadas y aristas duplicadas. Compara con una búsqueda directa en redes pequeñas. Si el siguiente límite dependiera de la respuesta anterior, ya no podrías conocer y ordenar todas las preguntas al inicio.'),
    {
      title: 'Reconocer qué parte del problema cambió',
      body: 'La combinación anterior funciona porque las preguntas son independientes y la conectividad solo crece durante el barrido. Si hubiera que quitar carreteras al avanzar el tiempo original, este DSU no sabría deshacerlas. Necesitaríamos otro orden válido o una estructura que admita esa operación.\n\nEn un árbol fijo con valores que cambian, HLD transforma consultas de caminos en intervalos. Si cada pregunta menciona pocas marcas, un árbol virtual conserva sus conexiones. Si una transición de DP compara funciones lineales, CHT organiza esas candidatas cuando sus órdenes lo permiten.\n\nEn cada caso, empieza describiendo qué guarda la estructura y qué debes hacer con ese dato. El nombre de una técnica viene después de comprobar que sus operaciones y condiciones coinciden con la pregunta.',
    },
    {
      title: 'Comprobar la condición que permite ahorrar trabajo',
      body: 'La solución lenta establece qué respuesta necesitas. La mejora conserva esa respuesta mediante una propiedad concreta: asociatividad para reagrupar, monotonía para descartar candidatos, reducción de tamaño para limitar niveles o una cota amortizada para limitar el trabajo total.\n\nQuitar la propiedad ayuda a encontrar errores. Dos bloques de suma superpuestos repiten elementos; una tabla de mínimos sí tolera esa repetición. Una deque de CHT que descarta rectas al avanzar x falla si después x retrocede. Ordenar estados de una DP falla si cambia qué estados anteriores están disponibles.\n\nRevisa estados iniciales, transiciones, obtención de la respuesta y costo completo. Si una consulta hace O(log n) llamadas de O(log n), su costo es O(log²n). Las pruebas pequeñas comparan implementaciones; el argumento explica por qué las restricciones del enunciado bastan para todos los casos.',
    },
  ]),
};
