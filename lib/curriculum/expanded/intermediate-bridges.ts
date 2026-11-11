import type { LessonExpansion } from '../types.ts';
import { silverExpansions } from './intermediate-silver.ts';
import { goldExpansions } from './intermediate-gold.ts';

/** The introductory route uses its own practice before the division-level exercises. */
export const intermediateBridgeExpansions: Record<string, LessonExpansion> = {
  'busqueda-binaria': {
    ...silverExpansions['usaco-silver-binary-search-sorted-array'],
    exercises: [
      {
        id: 'frontera-que-avanza',
        title: 'Encuentra el ciclo que nunca termina',
        prompt: 'Buscas x=8 en [2,5,8,11] con límites l=0,r=4 y un intervalo [l,r). La regla propuesta dice: si a[m]<x, pon l=m; en otro caso pon r=m. Traza los primeros pasos y localiza cuándo deja de avanzar. Corrige una sola asignación y explica por qué mantiene todos los candidatos posibles.',
        hints: ['Después de revisar el índice 2, r baja a 2.', 'Si a[m] es menor que x, el propio índice m ya está descartado.'],
        solution: "El primer centro es m=2 y a[2]=8, por lo que r pasa a dos. Después m=1, a[1]=5<8, así que l=1. Con [1,2), el centro sigue siendo 1 y la asignación l=m vuelve a dejar l=1: el ciclo nunca termina. Debe ser l=m+1. Como a[m]<x y el arreglo está ordenado, todos los índices hasta m son demasiado pequeños; descartarlos es válido.\n\nCuando l<r, esa corrección aumenta l estrictamente, y la otra rama disminuye r, garantizando que la longitud del intervalo se reduce.",
      },
      {
        id: 'numero-en-lista',
        title: '¿Está inscrito este folio?',
        prompt: "La lista de folios está ordenada de menor a mayor, con posibles repetidos. Después recibirá n,x y después n folios. Debes imprimir SI si x aparece y NO en otro caso. Límites: 0 ≤ n ≤ 200000; |x| y |folio| ≤ 1000000000. Resuelve con búsqueda binaria; no cambies el orden ni recorras todos los folios para buscar.",
        hints: ['Encuentra la primera posición con valor al menos x.', 'Antes de leer esa posición, comprueba que sea menor que n.'],
        solution: "La búsqueda conserva la frontera entre los valores menores que x y los valores que ya son al menos x. Si el centro es demasiado pequeño, descartamos hasta él; en otro caso lo conservamos como límite superior. Al terminar, l puede ser n. x está presente cuando l<n y a[l]==x. El corto circuito de && evita leer fuera del arreglo.\n\nLa búsqueda cuesta O(log(n+1)) y usa O(1) memoria adicional; leer y guardar la entrada requiere O(n).",
        code: "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n;\n    long long x;\n    cin >> n >> x;\n    vector<long long> a(n);\n    for (auto &v : a)\n        cin >> v;\n    int l = 0, r = n;\n    while (l < r) {\n        int m = l + (r - l) / 2;\n        if (a[m] < x)\n            l = m + 1;\n        else\n            r = m;\n    }\n    cout << (l < n && a[l] == x ? \"SI\" : \"NO\") << \"\\n\";\n}\n",
        sampleInput: '5 8\n2 5 8 8 11\n',
        sampleOutput: 'SI\n',
        tests: [
          {input:'5 8\n2 5 8 8 11\n',output:'SI\n'},
          {input:'0 9\n',output:'NO\n'},
          {input:'3 9\n1 3 7\n',output:'NO\n'},
          {input:'4 4\n1 3 5 7\n',output:'NO\n'},
          {input:'1 -8\n-8\n',output:'SI\n'},
        ],
      },
    ],
  },
  'sumas-de-prefijos': {
    ...silverExpansions['usaco-silver-prefix-sums'],
    exercises: [
      {
        id: 'indicadores-de-meta',
        title: 'Convierte una condición en números',
        prompt: 'Entrenaste [15,30,45,10,30,0] minutos en seis días numerados del 1 al 6. La meta diaria es al menos 30 minutos. Construye un arreglo de ceros y unos y sus prefijos. Cuenta días con meta cumplida entre los días 2 y 5, ambos incluidos. ¿Por qué sumar minutos y dividir entre 30 no responde esa pregunta?',
        hints: ["Cada día aporta exactamente uno si cumple la meta, aunque haya entrenado 60 minutos.", 'Para días l a r incluidos, resta prefijo[r]−prefijo[l−1].'],
        solution: "Escribe [0,1,1,0,1,0] para los días que cumplen y [0,0,1,2,2,3,3] como sus prefijos. Entre días 2 y 5 hay P[5]−P[1]=3−0=3 días que cumplen. Sus minutos suman 115; dividir entre 30 daría 3 con división entera, una coincidencia. Si el día 3 tuviera 90 minutos, seguirían siendo tres días cumplidos pero la suma sería 160 y la división daría cinco.\n\nPrimero transformamos cada dato según la condición; después sumamos los indicadores.",
      },
      {
        id: 'dias-cumplidos',
        title: 'Días que alcanzaron la meta',
        prompt: "Tu programa recibirá n,q,T: cantidad de días, consultas y meta de minutos diarios. Después recibirá los n minutos de entrenamiento y después q pares l,r. Por cada par imprime cuántos días del intervalo inclusivo l,…,r tuvieron al menos T minutos. Los días empiezan en 1. Límites: 1 ≤ n,q ≤ 200000; 0 ≤ T,minutos ≤ 1000000000; 1 ≤ l ≤ r ≤ n.",
        hints: ['Acumula la expresión minutos>=T, que vale cero o uno.', 'No vuelvas a revisar cada día de una consulta.'],
        solution: "P[i] cuenta cuántos días cumplieron la meta desde el primero hasta i; antes de empezar, P[0]=0. Construimos P[i]=P[i−1]+(minutos[i]>=T). Restar P[l−1] de P[r] elimina los días anteriores al intervalo y conserva los solicitados. La igualdad con T sí cumple la meta. El tiempo total es O(n+q) y la memoria O(n); cada conteo es a lo sumo n.",
        code: "#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, q;\n    long long T;\n    cin >> n >> q >> T;\n    vector<int> p(n + 1);\n    for (int i = 1; i <= n; i++) {\n        long long x;\n        cin >> x;\n        p[i] = p[i - 1] + (x >= T);\n    }\n    while (q--) {\n        int l, r;\n        cin >> l >> r;\n        cout << p[r] - p[l - 1] << \"\\n\";\n    }\n}\n",
        sampleInput: '5 3 30\n20 30 40 0 50\n1 5\n2 4\n4 4\n',
        sampleOutput: '3\n2\n0\n',
        tests: [
          {input:'5 3 30\n20 30 40 0 50\n1 5\n2 4\n4 4\n',output:'3\n2\n0\n'},
          {input:'1 1 0\n0\n1 1\n',output:'1\n'},
          {input:'3 2 100\n1 2 99\n1 3\n2 2\n',output:'0\n0\n'},
          {input:'2 1 30\n30 30\n1 2\n',output:'2\n'},
        ],
      },
    ],
  },
  'grafos': {
    ...silverExpansions['usaco-silver-graph-traversal'],
    exercises: [
      {
        id: 'mapa-y-vecinos',
        title: 'Dibuja la red antes de recorrerla',
        prompt: "Hay seis salones y pasillos de doble sentido 1−2,2−4,4−3 y 5−6. Escribe la lista de vecinos de cada salón. ¿Se puede viajar de 1 a 3? ¿Y de 1 a 6? Una solución guardó cada pasillo solamente del primer extremo al segundo: encuentra un recorrido válido que esa representación rechazaría.",
        hints: ['Cada pasillo aparece en dos listas porque es de doble sentido.', 'El camino 3→4→2→1 usa las conexiones en sentido contrario al escrito.'],
        solution: "Las listas son 1:{2}, 2:{1,4}, 3:{4}, 4:{2,3}, 5:{6} y 6:{5}. Se llega de 1 a 3 por 1→2→4→3. No se llega de 1 a 6 porque {1,2,3,4} y {5,6} están desconectados. Guardar solo 1→2,2→4,4→3,5→6 rechazaría el viaje 3→1, aunque los pasillos permiten regresar. La representación debe respetar el sentido de movimiento del enunciado antes de aplicar cualquier recorrido.",
      },
      {
        id: 'pasillos-al-destino',
        title: '¿Puedes llegar al salón?',
        prompt: "Tu programa recibirá n,m,s,t y después m pasillos de doble sentido u v entre salones numerados del 1 al n. Debes imprimir SI si existe un camino desde s hasta t y NO si no existe. Puedes usar cero pasillos cuando s=t. Límites: 1 ≤ n ≤ 200000; 0 ≤ m ≤ 300000. Se permiten pasillos repetidos y conexiones de un salón consigo mismo.",
        hints: ['Guarda cada pasillo en ambas listas de vecinos.', 'Empieza una BFS en s y marca al encolar para no repetir visitas.'],
        solution: "BFS desde s solo agrega salones conectados con alguno ya alcanzado; además, descubre paso a paso cualquier camino válido que salga de s. Marcamos s desde el principio, por lo que s=t responde SI. Visitados evita ciclos, lazos y duplicados. Al terminar consultamos si t fue marcado. El tiempo y la memoria son O(n+m).",
        code: "#include <iostream>\n#include <vector>\n#include <queue>\nusing namespace std;\nint main() {\n    int n, m, s, t;\n    cin >> n >> m >> s >> t;\n    --s;\n    --t;\n    vector<vector<int>> g(n);\n    while (m--) {\n        int u, v;\n        cin >> u >> v;\n        --u;\n        --v;\n        g[u].push_back(v);\n        g[v].push_back(u);\n    }\n    vector<bool> seen(n);\n    queue<int> q;\n    q.push(s);\n    seen[s] = true;\n    while (!q.empty()) {\n        int v = q.front();\n        q.pop();\n        for (int u : g[v])\n            if (!seen[u]) {\n                seen[u] = true;\n                q.push(u);\n            }\n    }\n    cout << (seen[t] ? \"SI\" : \"NO\") << \"\\n\";\n}\n",
        sampleInput: '6 4 1 3\n1 2\n2 4\n4 3\n5 6\n',
        sampleOutput: 'SI\n',
        tests: [
          {input:'6 4 1 3\n1 2\n2 4\n4 3\n5 6\n',output:'SI\n'},
          {input:'3 1 1 3\n1 2\n',output:'NO\n'},
          {input:'1 0 1 1\n',output:'SI\n'},
          {input:'3 3 3 1\n1 2\n1 2\n2 3\n',output:'SI\n'},
        ],
      },
    ],
  },
  'programacion-dinamica': {
    ...goldExpansions['usaco-gold-intro-dp'],
    exercises: [
      {
        id: 'contar-o-minimizar',
        title: 'La tabla debe responder la pregunta correcta',
        prompt: 'Hay cuatro plataformas con costos [5,1,9,2]. Empiezas antes de la primera y puedes avanzar una o dos posiciones, pagando solo al aterrizar. Debes terminar exactamente en la cuarta. Define dp[i] como el menor costo para llegar a i, con dp[0]=0. Calcula dp[1],…,dp[4] y una ruta óptima. Explica por qué sumar las dos respuestas anteriores contaría algo diferente.',
        hints: ['Llegar a i cuesta costo[i] más el mejor de los lugares desde donde puedes saltar.', 'La primera plataforma solamente tiene como predecesor el inicio.'],
        solution: "Los costos mínimos son dp[1]=5, dp[2]=1, dp[3]=10 y dp[4]=3. La ruta óptima salta del inicio a la plataforma 2 y luego a la 4, pagando 1+2. Sumamos el costo actual al mínimo de dos alternativas; no sumamos los costos de ambas rutas porque solo elegimos una. En el problema de contar maneras sí se sumaban cantidades de caminos de casos disjuntos.\n\nEl mismo dibujo de dependencias puede servir para objetivos distintos, pero el significado y la operación cambian.",
      },
      {
        id: 'saltos-de-menor-costo',
        title: 'Cruza pagando lo mínimo',
        prompt: "Tu programa recibirá n y los costos de las plataformas 1 a n. Empiezas en la posición 0, de costo cero. Cada salto avanza una o dos posiciones; pagas el costo de la plataforma donde aterrizas y debes llegar exactamente a n. Debes imprimir el menor costo total. Límites: 0 ≤ n ≤ 200000; 0 ≤ costo ≤ 1000000000. Si n=0, ya llegaste y pagas cero.",
        hints: ['dp[i] usa solamente dp[i−1] y, si existe, dp[i−2].', 'El costo de la última plataforma se paga en cualquier ruta válida.'],
        solution: "Para llegar a i, el último salto sale de i−1 o de i−2: compara esos costos antes de sumar el de la plataforma actual. Como ambas terminan pagando el mismo costo[i], escogemos el menor costo previo y sumamos ese pago. La base dp[0]=0 y el tratamiento especial de i=1 evitan índices negativos.\n\nLos estados iniciales son correctos y cada estado nuevo compara todas las formas de llegar desde respuestas ya resueltas; por eso también obtiene el mínimo.\n\nEl tiempo es O(n), memoria O(n), y long long permite acumular costos grandes. Guardar solo los dos estados previos reduciría memoria, pero la tabla completa facilita seguir la explicación.",
        code: "#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n;\n    cin >> n;\n    vector<long long> d(n + 1);\n    for (int i = 1; i <= n; i++) {\n        long long c;\n        cin >> c;\n        d[i] = c + d[i - 1];\n        if (i >= 2)\n            d[i] = min(d[i], c + d[i - 2]);\n    }\n    cout << d[n] << \"\\n\";\n}\n",
        sampleInput: '4\n5 1 9 2\n',
        sampleOutput: '3\n',
        tests: [
          {input:'4\n5 1 9 2\n',output:'3\n'},
          {input:'0\n',output:'0\n'},
          {input:'1\n7\n',output:'7\n'},
          {input:'3\n10 100 1\n',output:'11\n'},
          {input:'4\n1000000000 1000000000 1000000000 1000000000\n',output:'2000000000\n'},
        ],
      },
    ],
  },
};
