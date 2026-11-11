import type { Lesson } from '../types.ts';
import { advancedWalkthrough as w } from './advanced-support.ts';

export const advancedPracticeWalkthroughs: Record<string, (lesson: Lesson) => Partial<Lesson>> = {
  'usaco-adv-random': l => w(l, {
    exercise: 'seleccion',
    problem: 'Quieres encontrar el K-ésimo valor más pequeño de una lista, contando repetidos. Ordenarla funciona, pero para conocer una sola posición no necesitamos ordenar todo.\n\nLa entrada contiene n, K y los n valores. K empieza en uno. Imprime el valor que quedaría en esa posición al ordenar.',
    trace: 'La lista [7,1,7,5,3,7] se ordenaría como [1,3,5,7,7,7]. Su cuarto valor es 7. Si elegimos 7 como pivote, encontramos tres menores y tres iguales: la posición pedida cae en el grupo de iguales y podemos terminar.',
    attempt: ['Descartar el lado que no contiene la respuesta', 'Ordenar cuesta O(n log n). Podemos elegir un pivote, separar menores, iguales y mayores, y seguir solo en el grupo que contiene K. La elección del pivote afectará cuánto trabajo repetimos. Elegirlo al azar da buen tiempo esperado, aunque cualquier pivote conserva una respuesta correcta.'],
    steps: [
      { source: 4 },
      { source: 6, lines: [16,26], explain: 'lt termina la zona de menores; gt empieza la zona de mayores; i revisa la siguiente posición pendiente. Si traemos un valor desde gt, todavía no sabemos a qué grupo pertenece: por eso bajamos gt sin avanzar i. Los repetidos se quedan juntos.' },
      { source: 7, lines: [27,34], explain: 'k ya se convirtió a índice desde cero al leerlo. Como no recortamos ni copiamos el arreglo, conserva su índice original. Si cae antes de lt buscamos a la izquierda; si queda después de gt, a la derecha. Entre ambos, su valor es pivot.' },
      { source: 8 },
    ],
    program: 'El generador usa una semilla fija para poder repetir una ejecución al depurar. Eso no altera la corrección, pero la garantía de tiempo esperado supone pivotes aleatorios respecto de la entrada. Una secuencia adversa todavía puede causar O(n²) trabajo.',
    check: ['Si todos los números son iguales, ¿cuántas particiones necesita este programa?', 'Una. Todos quedan en el grupo de iguales y cualquier K válido cae dentro de él.'],
    extensions: [5,3],
  }),
  'usaco-adv-interactive': l => w(l, {
    exercise: 'simulador',
    problem: 'Otra persona esconde un entero h entre 1 y N. Solo puedes preguntar «¿h es menor o igual a m?». Encuéntralo con pocas preguntas.\n\nPara practicar en este laboratorio usaremos un juez simulado: la entrada contiene N y h, pero la búsqueda solo podrá consultar una función ask. La salida será el número encontrado y la cantidad de preguntas.',
    trace: 'Con N=20 y h=14 preguntamos por 10: no; por 15: sí; por 13: no; por 14: sí. Los intervalos posibles quedan [11,20], [11,15], [14,15] y [14,14]. Encontramos 14 usando cuatro preguntas.',
    attempt: ['Preguntar un número a la vez', 'Preguntar por 1, luego 2, luego 3… podría necesitar N−1 respuestas. Cada pregunta puede separar muchos candidatos, así que conviene dividirlos en dos grupos de tamaños parecidos. La búsqueda binaria hace exactamente eso.'],
    steps: [
      { source: 4 },
      { source: 7, lines: [6,10], explain: 'Esta función pertenece al juez simulado: puede leer secret y cuenta cada consulta. La parte que busca la respuesta no debe leer secret directamente. En una competencia interactiva, ask enviaría una pregunta al juez y leería su respuesta.' },
      { source: 5, lines: [11,19], explain: 'l y r siempre delimitan todos los secretos que siguen siendo posibles. Una respuesta afirmativa conserva [l,m]; una negativa conserva [m+1,r]. Cuando coinciden, no necesitamos otra pregunta: ya queda un solo candidato.' },
      { source: 6 },
      { source: 8 },
    ],
    program: 'El programa completo recibe toda su entrada al empezar, por eso puede ejecutarse aquí. Practica la estrategia y el límite de consultas; un juez externo además exige su formato de mensajes, vaciar la salida y manejar señales de error.',
    check: ['Si N=1, ¿necesitas preguntar algo?', 'No. El único secreto posible es uno; el programa imprime 1 0.'],
    extensions: [2],
  }),
  'usaco-adv-vectorization': l => w(l, {
    exercise: 'bloques',
    problem: 'Tienes dos listas de la misma longitud. Multiplica sus valores posición por posición y suma los productos: a[0]·b[0]+a[1]·b[1]+… . Ese resultado se llama producto punto.\n\nRecibes n, la lista a y la lista b. Los valores son enteros. Vamos a separar el cálculo en bloques sin cambiar su resultado.',
    trace: 'Para [1,2,3,4,5] y [5,4,3,2,1], los productos son 5,8,9,8,5. La suma es 35. El primer bloque de cuatro produce 30 y queda una posición pendiente que aporta 5.',
    attempt: ['Una suma acumulada', 'Un ciclo que agregue a[i]*b[i] a una variable ya resuelve el problema en O(n). No vamos a mejorar ese orden: debemos leer n parejas. Estudiaremos cómo separar dependencias entre operaciones y qué tendría que comprobar un compilador para ejecutarlas en paralelo.'],
    steps: [
      { source: 4, body: 'SIMD permite que una instrucción aplique la misma operación a varios datos, como multiplicar cuatro parejas de números a la vez. Las multiplicaciones a[i]·b[i] de posiciones diferentes no dependen unas de otras. Sumarlas después produce el producto punto.\n\nAgrupar operaciones puede reducir el trabajo por instrucción, pero seguimos leyendo n parejas: la complejidad es O(n). El código de esta lección separa bloques de cuatro en C++ estándar; que el compilador los convierta a SIMD depende de sus optimizaciones y de la plataforma.' },
      { source: 5 },
      { source: 6, body: 'Al acumular todos los productos en una variable, cada adición espera su valor anterior. Podemos repartirlos: s0 recibe las posiciones 0,4,8…; s1 recibe 1,5,9…; y lo mismo con s2 y s3. Al terminar sumamos los cuatro acumuladores.\n\nEn el ejemplo, el primer bloque produce s0=5, s1=8, s2=9 y s3=8: total 30. Queda la posición 4, cuyo producto 5·1 aporta cinco más. El resultado es 35. No estamos sumando a y b elemento a elemento; multiplicamos cada pareja antes de acumular.', lines: [12,22], explain: 'Cada acumulador recibe una posición distinta del bloque. La condición i+3<n garantiza que las cuatro existen. Después juntamos las sumas y procesamos el sobrante una posición a la vez. Con n=5, el segundo ciclo es el que agrega el último producto.' },
      { source: 7 },
      { source: 8 },
    ],
    program: 'El código es C++17 portable. Separar cuatro acumuladores no garantiza instrucciones SIMD ni una mejora de tiempo en todos los equipos. La comprobación principal aquí es que cada posición se use exactamente una vez y que los productos y la suma quepan en long long.',
    check: ['Si n=3, ¿es correcto que el ciclo de bloques no se ejecute?', 'Sí. Las tres posiciones se procesan en el ciclo del sobrante; leer un bloque de cuatro saldría del arreglo.'],
    extensions: [3],
  }),
};
