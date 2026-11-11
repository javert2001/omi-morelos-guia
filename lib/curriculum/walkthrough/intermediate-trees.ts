import { page, text, snippet, problem, program, detail, type Walkthrough } from './intermediate-helpers.ts';

export const treeWalkthroughs: Record<string, Walkthrough> = {
  'usaco-gold-dp-trees': l => page([
    problem(l, 'Los pesos de los vértices 1,2,3,4 son 5,4,3,6. Podemos elegir 1 y 4: no comparten una arista y suman 11. Elegir 1 y 2 no está permitido, aunque su suma parezca conveniente.'),
    text('Qué necesita saber el padre sobre un subárbol', 'Probar cada conjunto de vértices cuesta 2ⁿ. Un árbol permite separar el trabajo: los subárboles de dos hijos no tienen aristas entre ellos. La única conexión hacia arriba pasa por su padre.\n\nPara cada vértice v guardaremos dos respuestas. take[v] es el mayor peso de su subárbol cuando elegimos v. skip[v] es el mayor peso cuando no lo elegimos. Esa distinción le dice al padre si podrá elegirse sin formar una pareja prohibida.'),
    text('Resolver una hoja y después su padre', 'Una hoja elegida aporta su peso; una hoja no elegida aporta cero. Si elegimos al padre, todos sus hijos deben quedar fuera, así que añadimos sus skip. Si no lo elegimos, cada hijo puede usar su mejor opción entre take y skip.\n\nEn el ejemplo, el vértice 4 tiene (take,skip)=(6,0). Su padre 3 tiene (3,6). El vértice 2 tiene (4,0). En la raíz 1, take=5+0+6=11 y skip=4+6=10. Elegimos 11.'),
    snippet('Combinar un hijo con su padre', 'Los pesos iniciales se leen directamente en take y skip empieza en cero. Al terminar el subárbol de v, sumamos su aportación a p[v]:', String.raw`take[p[v]] += skip[v];
skip[p[v]] += max(take[v], skip[v]);`, 'La suma es válida porque los subárboles no comparten vértices ni tienen conexiones entre sí. No estamos eligiendo dos vecinos accidentalmente: take del padre solo recibe skip del hijo.'),
    snippet('Asegurar que los hijos estén listos primero', 'o guarda un orden donde cada padre aparece antes que sus hijos. Recorremos al revés para combinar desde las hojas:', String.raw`for (int i = n - 1; i > 0; i--) {
    int v = o[i];
    take[p[v]] += skip[v];
    skip[p[v]] += max(take[v], skip[v]);
}
cout << max(take[0], skip[0]) << '\n';`, 'La raíz no tiene padre, por eso el ciclo termina antes del índice 0. Como nadie obliga a elegirla, comparamos sus dos respuestas al final.'),
    program(l, 'main construye padres y orden con un recorrido iterativo. Eso evita una recursión de hasta 200 000 llamadas en un árbol con forma de cadena.', 'Cada vértice aporta una vez: O(n) tiempo y memoria. Con un solo vértice de peso 7, take=7 y skip=0. Si todos los pesos son cero, elegir el conjunto vacío sigue siendo válido.'),
    detail(l, 4), detail(l, 2),
  ]),
  'usaco-gold-all-roots': l => page([
    problem(l, 'En la cadena 1–2–3–4, desde 1 las distancias son 0,1,2,3 y suman 6. Desde 2 son 1,0,1,2 y suman 4. Queremos esa suma para cada posible sede, sin recorrer todo el árbol una vez por sede.'),
    text('Aprovechar una respuesta vecina', 'Hacer BFS o DFS desde cada vértice costaría O(n²). Pero pasar de la sede 1 a su vecina 2 modifica todas las distancias de una manera ordenada: algunas disminuyen uno y las demás aumentan uno.\n\nTomemos temporalmente 1 como raíz. sz[v] contará los vértices en el subárbol de v, incluido v. Al mover la sede del padre hacia v, esos sz[v] vértices están un paso más cerca. Los otros n−sz[v] quedan un paso más lejos.'),
    text('Deducir la fórmula con la cadena', 'Desde 1, la respuesta es 6. El subárbol de 2 contiene tres vértices: 2,3,4. Moverse a 2 resta tres unidades y suma una por el vértice 1: 6−3+1=4.\n\nEn general, ans[v]=ans[p[v]]−sz[v]+(n−sz[v]), que se simplifica a ans[p[v]]+n−2·sz[v]. Para pasar de 2 a 3, sz[3]=2 y el cambio es 4−4=0. Para pasar de 3 a 4, sz[4]=1 y el cambio es 4−2=2.'),
    snippet('Preparar tamaños y la primera respuesta', 'El recorrido inicial obtiene p, el orden o y dep, la distancia a la raíz. Sumar profundidades da ans[0]:', String.raw`vector<long long> ans(n);
for (int x : dep) ans[0] += x;
for (int i = n - 1; i > 0; i--) {
    int v = o[i];
    sz[p[v]] += sz[v];
}`, 'sz empieza en uno por vértice y se acumula al revés, cuando los hijos ya están listos. dep empieza en cero en la raíz y cada hijo recibe dep[padre]+1.'),
    snippet('Mover la respuesta de padre a hijo', 'Ahora recorremos en el sentido contrario: necesitamos conocer la respuesta del padre antes de calcular la del hijo:', String.raw`for (int i = 1; i < n; i++) {
    int v = o[i];
    ans[v] = ans[p[v]] + n - 2LL * sz[v];
}`, 'Esta técnica se llama reenraizar: reutilizamos una respuesta al cambiar qué vértice consideramos origen. No modificamos físicamente las aristas ni reconstruimos los padres en cada paso.'),
    program(l, 'El programa usa un recorrido para organizar el árbol, una pasada inversa para tamaños y otra hacia delante para respuestas.', 'Todo cuesta O(n) tiempo y memoria. ans usa long long: una cadena de n vértices tiene suma n(n−1)/2 desde un extremo. Si las aristas pesan w, el cambio al cruzar una arista es w·(n−2·sz[v]).'),
    detail(l, 7),
  ]),
  'usaco-gold-tree-euler': l => page([
    problem(l, 'El subárbol de 3 contiene los vértices 3,4,5 y sus valores suman 30+40+50=120. El subárbol de 1 contiene todos y suma 150. El de 2 solo contiene su valor 20.'),
    text('Convertir cada subárbol en un tramo de arreglo', 'Podríamos recorrer todos los descendientes en cada consulta, pero en una cadena eso podría costar O(nq). Queremos que una pregunta sobre un subárbol se convierta en una suma de intervalo.\n\nDFS entra en un vértice y termina toda su rama antes de regresar a otra. Si anotamos cada vértice al entrar, los de un mismo subárbol quedan consecutivos. Eso no se garantiza en un recorrido por niveles.'),
    snippet('Anotar las entradas de DFS', 'Usamos una pila st. tin[v] guardará la posición de v en la lista o:', String.raw`while (!st.empty()) {
    int v = st.back(); st.pop_back();
    tin[v] = o.size();
    o.push_back(v);
    for (int u : g[v]) {
        if (u != p[v]) {
            p[u] = v;
            st.push_back(u);
        }
    }
}`, 'La pila procesa primero el último hijo agregado. Con las aristas del ejemplo, el orden será 1,3,5,4,2. Es diferente de 1,2,3,4,5, pero también deja cada subárbol seguido. Lo que importa es esa propiedad, no un orden alfabético.'),
    text('Encontrar el final sin otra búsqueda', 'tin[3]=1 en la lista del ejemplo, usando posiciones desde cero. Su tamaño sz[3]=3 indica que ocupa los índices [1,4): allí están 3,5,4.\n\nCalculamos sz con la misma suma de tamaños desde las hojas que ya conocemos. El intervalo de cualquier subárbol será [tin[v],tin[v]+sz[v]). Cada vértice aparece una vez, así que tamaño del subárbol y cantidad de posiciones coinciden.'),
    snippet('Guardar los valores en ese orden', 'Los prefijos siguen o, no el número de vértice original. Así cada intervalo suma los valores correctos:', String.raw`vector<long long> pref(n + 1);
for (int i = 0; i < n; i++) {
    pref[i + 1] = pref[i] + a[o[i]];
}
long long respuesta = pref[tin[v] + sz[v]] - pref[tin[v]];`, 'El arreglo ordenado es [10,30,50,40,20] y sus prefijos [0,10,40,90,130,150]. Para v=3, restamos pref[4]−pref[1]=130−10=120.'),
    program(l, 'El programa convierte vértices a índices internos desde cero, registra DFS, calcula tamaños y responde consultas con prefijos.', 'No hay actualizaciones, así que la preparación cuesta O(n) y cada consulta O(1). Si cambian valores, conserva el mismo orden tin y usa Fenwick o un árbol de segmentos sobre esas posiciones.'),
    detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-lca-euler': l => page([
    problem(l, 'Con raíz 1, los caminos de 4 y 5 hacia arriba se encuentran primero en 3. El de 2 y el de 4 se encuentran en 1. Un vértice cuenta como ancestro de sí mismo, así que LCA(3,3)=3.'),
    text('Subir padres funciona, pero puede ser lento', 'Una solución sencilla sube el vértice más profundo hasta igualar alturas y luego sube ambos hasta que coinciden. En una cadena puede recorrer O(n) aristas por consulta.\n\nVamos a transformar la pregunta en un mínimo sobre un arreglo. Necesitamos un recorrido de Euler completo: anotamos el vértice al llegar y volvemos a anotar al padre cada vez que regresamos de un hijo. No es la lista de una sola aparición por vértice usada para subárboles.'),
    text('Seguir el recorrido con sus regresos', 'Con las aristas del ejemplo, el recorrido es [1,2,1,3,4,3,5,3,1]. Sus profundidades son [0,1,0,1,2,1,2,1,0]. first[v] guarda la primera posición de v.\n\nEntre las primeras apariciones de 4 y 5 vemos [4,3,5]. El de menor profundidad es 3. Entre 2 y 4 vemos [2,1,3,4]; el más alto es 1. Para pasar de la rama de un vértice a la del otro, DFS tiene que regresar a su ancestro común y no sube por encima de él en ese tramo.'),
    snippet('Recordar qué vecino falta por recorrer', 'La pila guarda el camino actual. next[v] indica el siguiente vecino pendiente. Cuando no queda ninguno, salimos de v y anotamos al padre al regresar:', String.raw`if (next[v] == (int)g[v].size()) {
    st.pop_back();
    if (!st.empty()) e.push_back(st.back());
} else {
    int u = g[v][next[v]++];
    if (u == p[v]) continue;
    p[u] = v;
    dep[u] = dep[v] + 1;
    first[u] = e.size();
    e.push_back(u);
    st.push_back(u);
}`, 'Antes del ciclo anotamos la raíz. Cada arista se baja y se sube una vez, así que e tiene 2n−1 entradas. Esta simulación evita usar n llamadas recursivas en una cadena.'),
    snippet('Guardar el vértice menos profundo', 'Usaremos un árbol de segmentos sobre e. Cada nodo guarda un identificador de vértice, no la profundidad misma. best decide cuál conservar:', String.raw`auto best = [&](int a, int b) {
    if (a == -1) return b;
    if (b == -1) return a;
    return dep[a] < dep[b] ? a : b;
};`, '−1 representa un intervalo vacío. Comparar dep y devolver el vértice permite imprimir el LCA directamente. Las hojas guardan los elementos de e; un padre combina sus hijos con best.'),
    text('Ubicar hojas en un árbol iterativo', 'El programa elige una potencia de dos z que alcance para e. Las hojas están en seg[z+i]. Los padres están antes: seg[i]=best(seg[2i],seg[2i+1]). Las hojas sobrantes valen −1.\n\nPara consultar el intervalo inclusivo de primeras apariciones, desplazamos l y r a las hojas y hacemos r exclusivo. Si l es hijo derecho, su hermano izquierdo queda fuera y debemos tomar l solo. Si r es impar, la hoja anterior a r queda sola dentro. Después subimos ambos límites a sus padres.'),
    snippet('Consultar el mínimo entre las apariciones', 'ans comienza como vacío. Cada bloque que tomamos se combina con el resultado anterior:', String.raw`l += z;
r += z + 1;
int ans = -1;
while (l < r) {
    if (l & 1) ans = best(ans, seg[l++]);
    if (r & 1) ans = best(ans, seg[--r]);
    l /= 2;
    r /= 2;
}`, 'Los bloques que agregamos cubren exactamente el tramo original. En cada vuelta subimos un nivel, así que la consulta cuesta O(log n). Al terminar, ans es el vértice menos profundo entre las apariciones.'),
    program(l, 'El programa prepara Euler y el árbol de mínimos una sola vez. Para cada pareja, ordena sus primeras posiciones y ejecuta la consulta anterior.', 'Construcción O(n), consultas O(log n), memoria O(n). En el ejemplo debe imprimir 3,1,3. No uses el menor identificador de vértice como mínimo: debes comparar profundidad.'),
    detail(l, 6), detail(l, 7),
  ]),
};
