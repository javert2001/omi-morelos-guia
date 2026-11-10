import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const methodExpansions: Record<string,LessonExpansion> = {
'usaco-adv-random': chapter('usaco-adv-random',[
['Separa corrección, probabilidad y tiempo','Un algoritmo Las Vegas siempre devuelve una respuesta correcta cuando termina, pero su tiempo depende de decisiones aleatorias. Elegir pivotes al azar en quickselect es un ejemplo: las particiones conservan exactamente el elemento buscado, aunque una sucesión de pivotes malos tarde mucho. Un algoritmo Monte Carlo limita su trabajo y admite una probabilidad de respuesta errónea. No confundas «casi siempre acierta» con «siempre acierta y casi siempre es rápido».\n\nUna tercera posibilidad es usar azar para encontrar un candidato y verificarlo con un certificado determinista. Si una propuesta dice que cierto número aparece más de la mitad de las veces, basta contarlo para confirmar una respuesta positiva. No encontrar candidato, en cambio, no certifica que no exista. El programa debe distinguir una conclusión demostrada de una búsqueda que agotó sus intentos.'],
['Calcula la probabilidad que realmente necesitas','Si una fracción f de posiciones contiene una respuesta útil y eliges una posición uniforme, fallas con probabilidad 1−f. Tras k elecciones independientes con reemplazo, la probabilidad de fallar siempre es (1−f)^k. Si f≥1/2 y k=20, el riesgo es como máximo 1/1048576. Si f=1/1000, veinte intentos siguen fallando cerca del 98% de las veces: el mismo número de repeticiones no sirve para todos los problemas.\n\nSi realizas Q consultas y cada una tiene riesgo a lo sumo ε, la desigualdad de la unión acota el riesgo de al menos un fallo por Qε; no exige independencia entre consultas. Para multiplicar probabilidades de repetición sí necesitas justificar independencia o una cota condicional equivalente. Reutilizar exactamente la misma muestra no crea nuevos intentos.'],
['Deriva selección aleatoria con partición en tres grupos','Para encontrar el k-ésimo menor, elige un pivote y divide en menores, iguales y mayores. Si k cae entre los menores, conserva ese grupo. Si cae en el bloque de iguales, ya conoces la respuesta. Si cae entre los mayores, descarta los otros grupos y ajusta k. La versión en el mismo arreglo mantiene los índices lt, i y gt: antes de lt hay menores; entre lt e i−1 hay iguales; después de gt hay mayores; i..gt está por clasificar.\n\nCuando a[i] es menor, intercambia con a[lt] y aumenta ambos índices. Si es mayor, intercambia con a[gt] y disminuye gt, sin aumentar i: el elemento recién llegado aún no fue clasificado. Si es igual, aumenta i. Los duplicados quedan en un solo bloque y no fuerzan una recursión por cada aparición.'],
['Demuestra tiempo esperado sin prometer un límite absoluto','Al menos aproximadamente la mitad de los pivotes se encuentran en la zona central de los valores ordenados. Un pivote de esa zona deja como máximo cerca de tres cuartas partes para continuar. Esperamos un número constante de intentos antes de cada reducción importante. Las longitudes examinadas forman una serie geométrica en esperanza: n+(3/4)n+(3/4)²n+… = O(n).\n\nTodavía existe una secuencia de pivotes extremos que produce trabajo cuadrático. El resultado esperado se refiere al azar del algoritmo para una entrada fija, no a una distribución supuesta de las entradas. Para experimentar puedes fijar una semilla y reproducir un fallo. Una semilla conocida no ofrece por sí sola una garantía probabilística contra una entrada construida específicamente para esa secuencia de pivotes.'],
['Diseña experimentos reproducibles y detecta sesgos','Usa un generador con estado explícito y una distribución uniforme apropiada. Tomar un entero aleatorio módulo m puede sesgar los residuos cuando el número de resultados posibles no es múltiplo de m; uniform_int_distribution evita tener que implementar ese ajuste. Para depurar registra la semilla junto con la entrada y compara con un algoritmo determinista lento.\n\nMide más que un caso favorable: entradas ordenadas, inversas, repetidas y con muchos valores iguales. Al evaluar hashes, separa colisión entre dos objetos de la probabilidad de alguna colisión entre miles de comparaciones. Dos módulos reducen el riesgo solo bajo supuestos adecuados sobre las elecciones aleatorias. Si la respuesta puede verificarse exactamente con poco costo, esa comprobación suele ser una mejora más clara que repetir indefinidamente una heurística.']
],[reflect('riesgo','Amplifica una búsqueda con cuidado','Una muestra uniforme independiente encuentra un elemento útil con probabilidad al menos 1/4. ¿Cuántos intentos bastan para que la probabilidad de no encontrar ninguno sea menor que 1/100? Comprueba tu resultado sin redondear hacia abajo.',['La cota de fallo es (3/4)^k.','Compara potencias alrededor de k=16.'],'Necesitamos (3/4)^k<0.01. El cociente log(0.01)/log(0.75) es aproximadamente 16.01, así que hacen falta 17 intentos. Con 16, la probabilidad es cerca de 0.01002, todavía demasiado alta; con 17 es cerca de 0.00752. Usar 16 por redondeo descuidado no cumple la garantía. El cálculo requiere muestras independientes o una garantía de éxito condicional en cada intento.'),program('seleccion','Encuentra el k-ésimo sin ordenar todo','Entrada: n y k (1≤k≤n≤100000), después n enteros entre −1000000000 y 1000000000. Imprime el k-ésimo menor contando repeticiones. Implementa quickselect con pivote aleatorio y partición de tres grupos.',['Mantén k como índice global desde cero y un intervalo [l,r].','Después de particionar, k<lt va a la izquierda; k>gt va a la derecha.'],'Cada partición ubica un bloque de valores iguales en sus posiciones ordenadas definitivas y conserva la zona que contiene k. Por eso el resultado es exacto para cualquier pivote y cualquier semilla. La partición de tres grupos maneja repeticiones en un solo paso. El tiempo es lineal en esperanza con pivotes uniformes y cuadrático en el peor caso; usa memoria adicional constante aparte del arreglo y del generador. La semilla fija facilita reproducir los ejercicios.',String.raw`#include <iostream>
#include <vector>
#include <random>
#include <algorithm>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    --k;
    vector<long long> a(n);
    for (auto &x : a)
        cin >> x;
    mt19937 rng(2026);
    int l = 0, r = n - 1;
    while (l <= r) {
        uniform_int_distribution<int> pick(l, r);
        long long pivot = a[pick(rng)];
        int lt = l, i = l, gt = r;
        while (i <= gt) {
            if (a[i] < pivot)
                swap(a[lt++], a[i++]);
            else if (a[i] > pivot)
                swap(a[i], a[gt--]);
            else
                ++i;
        }
        if (k < lt)
            r = lt - 1;
        else if (k > gt)
            l = gt + 1;
        else {
            cout << pivot << '\n';
            break;
        }
    }
}
`,[['6 4\n7 1 7 5 3 7\n','7\n'],['1 1\n-5\n','-5\n'],['5 5\n1 2 3 4 5\n','5\n'],['4 2\n9 9 9 9\n','9\n']])]),
'usaco-adv-interactive': chapter('usaco-adv-interactive',[
['El enunciado incluye un protocolo de conversación','En un problema por lotes recibes toda la entrada y produces toda la salida. En uno interactivo alternas consultas y respuestas con otro programa. El protocolo especifica exactamente qué imprimir, qué devuelve el juez, cuántas preguntas permite y cómo anunciar el resultado final. Esos detalles forman parte del algoritmo: una idea matemática correcta con un formato incorrecto puede fallar antes de la segunda pregunta.\n\nPiensa en una función preguntar que representa una única interacción. Debe emitir la consulta, vaciar la salida si es necesario, leer la respuesta y detenerse si recibe una señal de error o fin de archivo. No sigas preguntando después de una respuesta de terminación. Tampoco escribas mensajes de depuración en la salida que interpreta el juez.'],
['Diseña la conversación con una búsqueda binaria','Un juez esconde h entre uno y N. Puedes preguntar «¿h≤m?» y responde sí o no. Conserva un intervalo [l,r] que siempre contiene h; empieza [1,N]. Pregunta m=l+(r−l)/2. Si la respuesta es sí, cambia r=m; si es no, cambia l=m+1. Cuando l=r, ese valor es la respuesta.\n\nPara N=20 y h=14, preguntamos por 10: no, queda [11,20]. Por 15: sí, queda [11,15]. Por 13: no, queda [14,15]. Por 14: sí, queda [14,14]. Cuatro consultas bastaron en este caso. En general hacen falta a lo sumo ceil(log2 N) porque cada consulta reduce el tamaño del intervalo a su mitad redondeada hacia arriba.'],
['Prueba el límite de información antes de programar','Una consulta con dos respuestas divide las posibilidades en como máximo dos grupos. Tras q consultas, un árbol de decisiones binario tiene como máximo 2^q hojas. Si debes distinguir N secretos diferentes, necesitas 2^q≥N en el peor caso. La búsqueda binaria alcanza esta cota cuando puedes elegir preguntas que separen aproximadamente por mitades.\n\nSi las respuestas tienen tres valores, el argumento informativo cambia a 3^q, pero no significa que exista una consulta legal que reparta perfectamente el conjunto. Si el juez puede responder de forma adaptativa, demuestra que tu invariante conserva al menos un secreto compatible y que tu respuesta final sirve para todos los secretos aún compatibles. No supongas una distribución aleatoria del secreto a menos que el enunciado lo garantice.'],
['Simula al juez dentro de la misma página','El laboratorio de esta guía recibe toda la entrada al iniciar y luego ejecuta hasta terminar. Para estudiar una estrategia interactiva sin otro sitio, sustituye temporalmente preguntar por una función local que conoce el secreto y calcula la respuesta. Lleva un contador de consultas y verifica que no se exceda el presupuesto. El algoritmo del participante no debe leer directamente el secreto; solo puede usar la función simulada.\n\nPrueba todos los secretos para N pequeño y las orillas uno y N para valores grandes. Puedes simular respuestas inválidas para comprobar que tu protocolo termina correctamente. Esta prueba por lotes permite entender y verificar la estrategia, aunque no reproduzca el intercambio en vivo de una plataforma de concursos. La diferencia es visible: el ejercicio de abajo es un simulador local.'],
['Vacía la salida y distingue interacción de comunicación','En C++, imprimir un salto de línea con \\n no obliga por sí solo a enviar el contenido almacenado. Un protocolo real suele necesitar cout << consulta << endl o cout << consulta << flush. Si desactivas la sincronización y haces cin.tie(nullptr), no confíes en que leer vacíe automáticamente cout. Después de imprimir la respuesta final, termina como especifique el protocolo.\n\nEn problemas de comunicación, dos participantes pueden conocer partes distintas de la información y solo enviar cierta cantidad de bits. La meta es codificar lo suficiente para que el receptor reconstruya la respuesta; no necesariamente hay un ciclo de preguntas al juez. Para transmitir uno de N estados distintos sin información adicional hacen falta al menos ceil(log2 N) bits de longitud fija. Si ambos comparten información previa, cuenta solamente las posibilidades que siguen siendo indistinguibles para el receptor.']
],[reflect('presupuesto','¿Alcanza con nueve preguntas?','Hay un secreto entre 1 y 1000 y cada pregunta solo admite sí o no. ¿Puede cualquier estrategia garantizar encontrarlo con nueve consultas? ¿Cuántas usa la búsqueda binaria en el peor caso?',['Cuenta hojas de un árbol de decisiones de profundidad nueve.','2^9=512 y 2^10=1024.'],'No: nueve consultas permiten distinguir como máximo 512 secuencias de respuestas y hay 1000 secretos. Por el principio del palomar, algunos secretos serían indistinguibles. Diez consultas bastan con búsqueda binaria, pues 1024≥1000. Esta cota es de peor caso; ciertos secretos se identifican antes, pero eso no garantiza nueve para todos.'),program('simulador','Encuentra el secreto: juez simulado','Este es un simulador por lotes, no un juez interactivo en vivo. Entrada: N y secreto h (1≤h≤N≤1000000000). La función preguntar(m) devuelve si h≤m y cuenta una consulta. Implementa búsqueda binaria usando solo esa función para decidir. Salida: secreto encontrado y cantidad de consultas. No imprimas la conversación.',['El intervalo [l,r] contiene al secreto en todo momento.','La consulta m=l+(r−l)/2 permite actualizar r=m o l=m+1.'],'La función del juez guarda el secreto y el participante solo observa sus respuestas booleanas. Cada respuesta conserva el secreto dentro del intervalo y reduce su tamaño. Al quedar una sola posibilidad, es necesariamente la correcta. La cantidad de consultas es O(log N) y la memoria O(1). Para un concurso interactivo real, se reemplazaría la función por emisión, flush y lectura respetando el protocolo.',String.raw`#include <iostream>
using namespace std;
int main() {
    long long n, secret;
    cin >> n >> secret;
    int calls = 0;
    auto ask = [&](long long m) {
        ++calls;
        return secret <= m;
    };
    long long l = 1, r = n;
    while (l < r) {
        long long m = l + (r - l) / 2;
        if (ask(m))
            r = m;
        else
            l = m + 1;
    }
    cout << l << ' ' << calls << '\n';
}
`,[['20 14\n','14 4\n'],['1 1\n','1 0\n'],['8 1\n','1 3\n'],['8 8\n','8 3\n']])]),
'usaco-adv-vectorization': chapter('usaco-adv-vectorization',[
['Piensa en carriles que realizan la misma operación','SIMD significa aplicar una instrucción a varios datos. Si una instrucción tiene cuatro carriles enteros, puede sumar cuatro parejas a la vez. Para sumar arreglos, el bloque que empieza en i carga a[i..i+3] y b[i..i+3], suma carril por carril y guarda cuatro resultados. Después se avanza cuatro posiciones. Las posiciones finales que no completan un bloque requieren una cola escalar o una operación enmascarada.\n\nEsto reduce trabajo de instrucciones, pero no cambia que debamos leer O(n) datos. Una mejora de algoritmo, por ejemplo pasar de O(n²) a O(n log n), suele cambiar mucho más la escala. Primero elige una complejidad apropiada, después identifica con mediciones qué parte del programa consume el tiempo.'],
['Comprueba independencia antes de agrupar iteraciones','El ciclo c[i]=a[i]+b[i] no depende de valores calculados en otras iteraciones, si los arreglos se usan sin solapamientos que alteren datos pendientes. En cambio a[i]=a[i−1]+b[i] depende de la iteración anterior. Ejecutar todas esas sumas simultáneamente usaría valores antiguos y cambiaría el resultado. Para paralelizar prefijos se necesita un algoritmo de escaneo distinto.\n\nTambién hay dependencias menos visibles: dos referencias o apuntadores pueden señalar la misma memoria. El compilador debe demostrar que una transformación respeta todos los casos permitidos. No añadas una promesa de no solapamiento si tu programa puede violarla; una optimización basada en una premisa falsa puede producir respuestas incorrectas aunque las pruebas habituales pasen.'],
['Reduce con varios acumuladores y trata los sobrantes','En una suma escalar, cada actualización de total depende de la anterior. Podemos usar cuatro acumuladores: s0 recibe posiciones 0,4,8…; s1 recibe 1,5,9…; y así. Al final sumamos s0+s1+s2+s3. Esta separación acorta cadenas de dependencia y puede ayudar al compilador, pero escribir cuatro variables no garantiza por sí solo que se genere SIMD.\n\nPara n=6 y valores [1,2,3,4,5,6], el primer bloque deja s0=1,s1=2,s2=3,s3=4. Las dos posiciones restantes añaden cinco y seis al total final, dando 21. El límite del ciclo de bloques debe comprobar i+3<n antes de acceder a las cuatro posiciones. Las pruebas con n=1,3,4 y 5 detectan lecturas fuera del arreglo que un caso múltiplo de cuatro no muestra.'],
['La representación numérica también forma parte de la prueba','Sumar enteros sin desbordamiento permite reagrupar porque la suma matemática es asociativa. En C++, desbordar un entero con signo es comportamiento indefinido. Con punto flotante, (a+b)+c y a+(b+c) pueden diferir por redondeos; una reducción vectorizada que cambia el orden puede alterar los últimos dígitos. Debes conocer la tolerancia del problema y las opciones de compilación antes de aceptar esa transformación.\n\nLos accesos contiguos suelen aprovechar mejor memoria y caché. Si procesas solo una propiedad de muchos objetos, separar esa propiedad en un arreglo puede evitar leer campos inútiles. Pero copiar o reorganizar datos también cuesta; mide el programa completo. Leer y escribir más rápido que lo que permite la memoria puede convertirse en el límite, aunque las operaciones aritméticas sean baratas.'],
['Experimenta aquí y distingue portabilidad de instrucciones específicas','El compilador del navegador usa WebAssembly. Las instrucciones AVX o SSE de procesadores x86 no son portables a ese entorno. Por eso el ejercicio usa C++17 estándar y enseña la transformación por bloques con una referencia escalar; el resultado puede comprobarse aquí sin instalar nada. No afirmamos que este ejemplo emita instrucciones SIMD en este compilador.\n\nUn experimento de rendimiento debe fijar tamaño, datos y número de repeticiones; evitar que el compilador elimine el cálculo; excluir la descarga inicial y comparar varias ejecuciones. El tiempo mostrado por el laboratorio incluye trabajo del compilador y del entorno, así que no es una medida aislada del ciclo. Para aprender la técnica, primero verifica igualdad exacta en tamaños pequeños; después razona sobre dependencias, memoria, sobrantes y rango de valores. Las instrucciones específicas son una extensión ligada a la plataforma donde competirás.']
],[reflect('dependencia','¿Puede hacerse en cuatro carriles?','Compara estos dos ciclos: A) c[i]=a[i]+b[i]; B) a[i]=a[i−1]+b[i], para i≥1. Explica cuál puede procesar varias posiciones independientes y da un ejemplo donde ejecutar B con todos los valores antiguos cambie la respuesta.',['En B, la lectura a[i−1] puede necesitar una escritura de la iteración anterior.','Prueba a=[1,0,0] y b=[0,2,3].'],'A puede agrupar posiciones si la memoria de entrada y salida no introduce solapamientos problemáticos. B es una recurrencia: con a=[1,0,0] y b=[0,2,3], la ejecución secuencial da a[1]=3 y a[2]=6. Si ambas usan valores antiguos, a[2] sería 0+3=3. La misma expresión aritmética no basta para demostrar equivalencia; hay que respetar el orden de dependencias.'),program('bloques','Producto escalar por bloques','Entrada: n (1≤n≤100000), luego n valores del arreglo a y n del arreglo b, todos entre −1000000 y 1000000. Imprime Σ a[i]·b[i]. Usa cuatro acumuladores para los bloques completos y procesa por separado el sobrante. Este código estándar no exige instrucciones SIMD.',['El ciclo principal puede avanzar cuatro si i+3<n.','Cada producto debe evaluarse en long long, no en int.'],'Distribuimos las posiciones de cada bloque entre cuatro acumuladores y después los reunimos. Cada índice se visita exactamente una vez; el ciclo final procesa los que no completan cuatro. El valor absoluto de la suma no supera 10^17 y cabe en long long. Tiempo O(n), memoria O(n) para los arreglos y O(1) adicional. Esta transformación muestra independencia y reducción; su velocidad real depende del compilador y del equipo.',String.raw`#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n), b(n);
    for (auto &x : a)
        cin >> x;
    for (auto &x : b)
        cin >> x;
    long long s0 = 0, s1 = 0, s2 = 0, s3 = 0;
    int i = 0;
    for (; i + 3 < n; i += 4) {
        s0 += a[i] * b[i];
        s1 += a[i + 1] * b[i + 1];
        s2 += a[i + 2] * b[i + 2];
        s3 += a[i + 3] * b[i + 3];
    }
    long long ans = s0 + s1 + s2 + s3;
    for (; i < n; i++)
        ans += a[i] * b[i];
    cout << ans << '\n';
}
`,[['5\n1 2 3 4 5\n5 4 3 2 1\n','35\n'],['1\n-3\n7\n','-21\n'],['4\n1 1 1 1\n2 2 2 2\n','8\n'],['3\n1000000 1000000 1000000\n1000000 1000000 1000000\n','3000000000000\n']])]),
};
