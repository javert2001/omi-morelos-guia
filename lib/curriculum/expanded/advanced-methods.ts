import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const methodExpansions: Record<string,LessonExpansion> = {
'usaco-adv-random': chapter('usaco-adv-random',[
["Qué parte depende del azar","Quickselect puede elegir sus pivotes al azar. Cada partición sigue conservando el elemento buscado, así que la respuesta es correcta; lo que cambia es cuánto tarda. Este tipo de algoritmo se llama Las Vegas. Un algoritmo Monte Carlo, en cambio, limita su trabajo y acepta cierta probabilidad de equivocarse.\n\nTambién puedes buscar un candidato al azar y comprobarlo de forma exacta. Si propones que un número aparece en más de la mitad de la lista, basta contar sus apariciones. Esa cuenta demuestra una respuesta positiva. Pero agotar los intentos sin encontrarlo no demuestra que no exista. Distingue lo que ya comprobaste de lo que la búsqueda simplemente no encontró."],
["Calcular cuántos intentos hacen falta","Si una fracción f de las posiciones sirve, una elección uniforme falla con probabilidad 1−f. Con k elecciones independientes y con reemplazo, fallar en todas tiene probabilidad (1−f)^k. Si f≥1/2 y k=20, la cota es 1/1048576. Si f=1/1000, esos mismos veinte intentos fallan aproximadamente el 98% de las veces.\n\nCon Q consultas de riesgo individual como mucho ε, la probabilidad de algún fallo es como mucho Qε. Esta desigualdad de la unión no exige independencia. Multiplicar probabilidades entre intentos sí necesita independencia o una cota condicional equivalente. Volver a mirar la misma muestra no cuenta como un intento nuevo."],
["Quickselect con tres grupos","Para buscar el k-ésimo menor, elige un pivote y separa menores, iguales y mayores. Si k cae entre los iguales, ya encontraste su valor. Si cae a un lado, conserva solo ese grupo y ajusta el índice cuando corresponda.\n\nPuedes hacerlo en el mismo arreglo con lt, i y gt. Antes de lt hay menores; entre lt e i−1, iguales; después de gt, mayores. La zona i..gt sigue pendiente.\n\nSi a[i] es menor, intercámbialo con a[lt] y aumenta ambos índices. Si es mayor, intercámbialo con a[gt] y baja gt. En este caso no avances i: el valor recién llegado todavía necesita clasificación. Si es igual, avanza i. Los repetidos quedan juntos y se resuelven en una sola partición."],
["Tiempo esperado y peor caso","Aproximadamente la mitad de los pivotes queda en la mitad central del orden. Cualquiera de ellos reduce la zona pendiente a, como mucho, unas tres cuartas partes. Con pivotes uniformes, esperas una cantidad constante de intentos hasta conseguir una reducción así.\n\nLas longitudes procesadas forman, en esperanza, una suma geométrica: n+(3/4)n+(3/4)²n+… . Por eso el tiempo esperado es O(n). Aun así, una secuencia de pivotes extremos puede costar O(n²).\n\nLa esperanza se toma sobre las decisiones aleatorias para una entrada fija. No supone que las entradas sean aleatorias. Una semilla fija permite reproducir errores, pero una secuencia conocida de pivotes no protege frente a entradas diseñadas para perjudicarla."],
["Generar y comprobar las muestras","Usa un generador con estado explícito y una distribución uniforme. Aplicar módulo m a cualquier entero aleatorio puede favorecer algunos residuos. uniform_int_distribution hace el ajuste necesario. Para reproducir un error, guarda la semilla junto con la entrada y compara con una solución determinista sencilla.\n\nPrueba listas ordenadas, invertidas, repetidas y con todos los valores iguales. En un hash, distingue el riesgo de colisión de una pareja del riesgo de alguna colisión entre muchas comparaciones. Usar dos módulos requiere justificar cómo se eligen sus parámetros para estimar el riesgo. Si puedes comprobar exactamente un candidato con poco trabajo, hazlo antes de aceptar la respuesta."]
],[reflect('riesgo',"Cantidad de intentos","Cada muestra uniforme e independiente encuentra un elemento útil con probabilidad de al menos 1/4. ¿Cuántos intentos necesitas para que la probabilidad de no encontrar ninguno sea menor que 1/100? Comprueba los dos enteros alrededor del límite.",["La probabilidad de fallar todos los intentos es como mucho (3/4)^k.","Compara los valores para k=16 y k=17."],"Necesitas (3/4)^k<0.01. Al despejar, el límite es log(0.01)/log(0.75)≈16.01, así que toma 17. Con 16, el riesgo todavía es aproximadamente 0.01002; con 17 baja a 0.00752.\n\nRedondear hacia abajo no cumple la condición. Esta multiplicación de probabilidades depende de la independencia de las muestras o de una garantía equivalente de éxito condicionado en cada intento."),program('seleccion',"Seleccionar sin ordenar toda la lista","Lee n,k, con 1≤k≤n≤100000, y después n enteros entre −1000000000 y 1000000000. Imprime el k-ésimo menor contando repeticiones. Implementa quickselect con un pivote aleatorio y una partición en menores, iguales y mayores.",["Convierte k a un índice desde cero y conserva su posición global en el arreglo.","Tras particionar, si k<lt continúa a la izquierda; si k>gt, a la derecha. Entre ambos límites ya conoces el valor."],"La partición coloca los valores iguales al pivote en sus posiciones definitivas dentro del orden. Si k no está en ese bloque, descarta la zona que no puede contenerlo. Esa decisión es correcta para cualquier pivote.\n\nCon pivotes uniformes, el tiempo esperado es O(n), aunque el peor caso sigue siendo O(n²). Los repetidos se procesan juntos. La memoria adicional, aparte del arreglo y del generador, es constante. El ejemplo fija una semilla para poder reproducir sus ejecuciones; eso no cambia la corrección de la respuesta.",String.raw`#include <iostream>
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
["Una consulta y una respuesta","En un problema interactivo, tu programa conversa con otro: hace una pregunta, lee la respuesta y decide qué preguntar después. El enunciado define el formato, las respuestas posibles, el máximo de consultas y cómo anunciar la solución. Un formato incorrecto puede hacer fallar una estrategia correcta.\n\nAgrupa cada interacción en una función preguntar. Debe escribir la consulta, vaciar la salida, leer la respuesta y detenerse si recibe un error o fin de archivo. No envíes mensajes de depuración por la salida que lee el juez ni sigas preguntando después de una señal de terminación."],
["Encontrar un número oculto","El juez esconde h entre uno y N. Puedes preguntar si h≤m. Mantén un intervalo [l,r] que contenga h y empieza con [1,N]. Consulta m=l+(r−l)/2. Si responde sí, queda [l,m]; si responde no, queda [m+1,r]. Cuando l=r, solo queda un número posible.\n\nCon N=20 y h=14, preguntas por diez: no, queda [11,20]. Por quince: sí, queda [11,15]. Por trece: no, queda [14,15]. Por catorce: sí, queda [14,14]. Usaste cuatro consultas. En general bastan ceil(log2 N): cada pregunta reduce la cantidad de candidatos a la mitad redondeada hacia arriba."],
["Límite de información","Con una pregunta de sí o no puedes separar los candidatos en dos grupos. Después de q preguntas, hay como mucho 2^q secuencias de respuestas. Para distinguir N secretos necesitas 2^q≥N en el peor caso. La búsqueda binaria alcanza ese límite porque puede dividir los candidatos casi por mitades.\n\nCon tres respuestas posibles, la cota pasa a 3^q. Eso no garantiza que las preguntas permitidas consigan repartir los candidatos en tres grupos iguales.\n\nSi el juez responde de forma adaptativa, conserva el conjunto de secretos compatibles con lo observado. La respuesta final debe servir para todos los que queden. No supongas que el secreto se elige al azar si el enunciado no lo dice."],
["Simular al juez","El laboratorio recibe toda la entrada al empezar. Para practicar aquí, la función preguntar conoce el secreto y devuelve la respuesta. El algoritmo que busca el número solo puede consultar esa función; no debe leer el secreto directamente. Lleva también un contador para comprobar el límite de preguntas.\n\nPrueba todos los secretos para N pequeño y los extremos uno y N para tamaños grandes. En un simulador de protocolo, prueba además señales inválidas para comprobar que el programa termina.\n\nEl ejercicio usa esta simulación por lotes. Permite estudiar la estrategia, aunque no reproduce la comunicación en vivo con un juez externo."],
["Enviar la salida y contar bits","En C++, escribir un salto de línea con \\n no obliga a enviar inmediatamente lo que quedó en el búfer. En un protocolo real puedes usar cout << consulta << endl o cout << consulta << flush. Si haces cin.tie(nullptr), leer tampoco vacía cout automáticamente. Al terminar, anuncia la respuesta en el formato pedido y finaliza.\n\nEn problemas de comunicación, dos programas conocen datos distintos y solo pueden intercambiar cierta cantidad de bits. Para transmitir uno de N estados con longitud fija y sin información previa, necesitas al menos ceil(log2 N) bits. Si el receptor ya sabe parte de la información, cuenta solo los estados que todavía no puede distinguir. No todos estos problemas usan preguntas a un juez."]
],[reflect('presupuesto',"Presupuesto de preguntas","Hay un secreto entre uno y mil y cada consulta solo devuelve sí o no. ¿Puede una estrategia garantizar encontrarlo con nueve preguntas? ¿Cuántas necesita la búsqueda binaria en el peor caso?",["Cuenta cuántas secuencias distintas de nueve respuestas pueden existir.","Compara 2^9=512 y 2^10=1024 con los mil secretos posibles."],"Nueve preguntas distinguen como mucho 512 secuencias de respuestas. Como hay mil secretos, algunos producirían la misma secuencia y no podrías separarlos. Por tanto, nueve no alcanzan para garantizar el resultado.\n\nDiez sí bastan con búsqueda binaria, porque 2^10≥1000. Algunos secretos se encuentran antes; el presupuesto debe cubrir también el que tarde más."),program('simulador',"Buscar con un juez simulado","Lee N y el secreto h, con 1≤h≤N≤1000000000. Simula una función preguntar(m) que devuelve si h≤m y cuenta una consulta. El algoritmo de búsqueda solo puede usar esa función para decidir. Imprime el número encontrado y la cantidad de consultas, sin imprimir la conversación. La ejecución es por lotes dentro del laboratorio.",["Mantén [l,r] como el intervalo que todavía puede contener el secreto.","Pregunta por m=l+(r−l)/2. Una respuesta afirmativa conserva [l,m]; una negativa conserva [m+1,r]."],"La función del juez conoce h; la búsqueda solo ve respuestas booleanas. Cada consulta conserva al secreto dentro del intervalo y reduce su tamaño. Cuando l=r, solo queda una posibilidad y debe ser la correcta.\n\nLa búsqueda usa O(log N) consultas y O(1) memoria. En un juez interactivo real, la función preguntar tendría que escribir, vaciar la salida y leer conforme al protocolo. Aquí simulas esas respuestas para comprobar la estrategia.",String.raw`#include <iostream>
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
["Aplicar una operación a varios datos","Imagina cuatro cajas registradoras sumando parejas de precios al mismo tiempo. SIMD hace algo parecido: una instrucción opera en varios carriles. Con cuatro carriles puedes cargar a[i..i+3] y b[i..i+3], sumar las parejas y guardar cuatro resultados. Después avanzas cuatro posiciones.\n\nSi al final quedan menos de cuatro datos, procésalos por separado o con una operación enmascarada que respete sus límites. Sigue siendo necesario leer O(n) datos. Antes de optimizar instrucciones, comprueba que la complejidad del algoritmo sea adecuada y mide qué parte consume el tiempo."],
["Cuándo las iteraciones son independientes","En c[i]=a[i]+b[i], cada posición se calcula sin usar el resultado de la anterior, siempre que los arreglos no se solapen de forma problemática. Puedes agrupar esas operaciones.\n\nEn a[i]=a[i−1]+b[i] ocurre algo distinto: la posición i necesita el valor recién calculado en i−1. Ejecutarlas simultáneamente con los valores antiguos cambia el resultado. Para paralelizar prefijos necesitas otro algoritmo de escaneo.\n\nDos apuntadores pueden señalar la misma memoria aunque tengan nombres distintos. El compilador debe respetar todos los solapamientos permitidos. Solo puedes prometer que no existen si tu programa realmente cumple esa condición."],
["Cuatro acumuladores y un sobrante","Al sumar todo en una variable, cada adición espera el resultado anterior. Puedes repartir el trabajo: s0 suma las posiciones 0,4,8…; s1 las 1,5,9…; y así con s2 y s3. Al terminar, suma los cuatro acumuladores. Esto acorta las dependencias, aunque no garantiza que el compilador genere SIMD.\n\nPara [1,2,3,4,5,6], el primer bloque deja los acumuladores en 1,2,3,4. Luego agregas los dos valores sobrantes, cinco y seis, para obtener 21.\n\nAntes de leer cuatro posiciones comprueba i+3<n. Prueba longitudes 1,3,4 y 5: un arreglo cuyo tamaño sea múltiplo de cuatro no comprueba el manejo del sobrante."],
["Rango numérico y acceso a memoria","Reagrupar sumas enteras conserva el resultado si no hay desbordamiento. En C++, desbordar un entero con signo es comportamiento indefinido. Con decimales, el redondeo puede hacer que (a+b)+c difiera de a+(b+c). Antes de cambiar el orden, revisa la tolerancia del problema y las opciones del compilador.\n\nLos accesos contiguos suelen aprovechar mejor la caché. Si solo necesitas un campo de muchos objetos, guardarlo en un arreglo separado puede evitar lecturas innecesarias. Reorganizar los datos también cuesta, así que mide el programa completo. A veces el límite está en cuánto puede transferir la memoria, aunque las sumas sean rápidas."],
["Medir en el entorno correcto","El compilador de esta página usa WebAssembly. Las instrucciones AVX y SSE de x86 no son portables a este entorno. El ejercicio usa C++17 estándar para mostrar la separación en bloques y comprobar sus resultados. No garantiza que el compilador emita SIMD.\n\nPara medir rendimiento, fija los datos, el tamaño y la cantidad de repeticiones. Asegúrate de usar el resultado para que el compilador no elimine el cálculo. Excluye la descarga inicial y compara varias ejecuciones. El tiempo del laboratorio incluye trabajo del compilador y del entorno; no mide únicamente tu ciclo.\n\nPrimero compara con una versión escalar en entradas pequeñas. Cuando los resultados coincidan, mide si la transformación mejora el tiempo en el equipo donde se ejecutará."]
],[reflect('dependencia',"Dependencias entre iteraciones","Compara A) c[i]=a[i]+b[i] y B) a[i]=a[i−1]+b[i], para i≥1. ¿Cuál permite procesar varias posiciones independientes? Da un ejemplo en el que calcular B con todos los valores antiguos cambie el resultado.",["En B, la posición i puede necesitar el valor que acaba de escribir la iteración i−1.","Usa a=[1,0,0] y b=[0,2,3]. Calcula primero en orden y después con los valores originales."],"A permite agrupar posiciones si las entradas y la salida no se solapan de forma problemática. B depende del resultado anterior. Con a=[1,0,0] y b=[0,2,3], en orden obtienes a[1]=1+2=3 y a[2]=3+3=6.\n\nSi ambas posiciones usan los datos originales, a[2]=0+3=3. La expresión parece la misma, pero leyó otro valor. Para conservar el resultado debes respetar esa dependencia o usar un algoritmo diferente."),program('bloques',"Producto escalar por bloques","Lee n (1≤n≤100000), después n valores de a y n de b. Todos están entre −1000000 y 1000000. Imprime Σ a[i]·b[i]. Procesa bloques completos con cuatro acumuladores y trata el sobrante por separado, usando C++17 estándar.",["Avanza de cuatro en cuatro solo mientras i+3<n.","Evalúa cada producto en long long; convertir la suma después de multiplicar en int sería demasiado tarde."],"Cada acumulador recibe una posición de los bloques completos. Al terminar, suma los cuatro y procesa las posiciones restantes. Así visitas cada índice exactamente una vez, incluso cuando n no es múltiplo de cuatro.\n\nLa suma tiene valor absoluto como mucho 10^17 y cabe en long long. El tiempo es O(n), con O(n) memoria para los arreglos y O(1) adicional. Esta separación puede ayudar al compilador, pero su velocidad depende del equipo y no garantiza instrucciones SIMD.",String.raw`#include <iostream>
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
