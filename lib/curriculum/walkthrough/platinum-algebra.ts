import type { PlatinumWalkthrough } from './platinum-helpers.ts';
import { complete, excerpt, walkthrough } from './platinum-helpers.ts';

export const platinumAlgebraWalkthroughs: Record<string, PlatinumWalkthrough> = {
  'usaco-plat-pie': (lesson) => walkthrough([
    {
      title: 'Contar los números que aparecen en alguna lista',
      body: 'Entre uno y cien hay cincuenta múltiplos de dos y veinte múltiplos de cinco. Queremos contar números divisibles por al menos uno de ellos. Sumar 50+20 cuenta dos veces diez, veinte y los demás múltiplos de diez. Hay diez de esos: la respuesta es sesenta.\n\nLa entrada contiene N k y después k divisores. 1 ≤ N ≤ 10¹² y 1 ≤ k ≤ 18; los divisores van de uno a 10¹². Imprimimos cuántos números de 1 a N cumplen al menos una condición.\n\nRevisar cada número contra todos los divisores cuesta O(Nk), demasiado para N grande. En cambio, sabemos contar los múltiplos de un divisor d directamente: hay ⌊N/d⌋.',
    },
    {
      title: 'Qué pasa cuando coinciden tres condiciones',
      body: 'Veamos un caso con tres listas: múltiplos de 2, 3 y 5 entre uno y treinta. Sus tamaños son 15, 10 y 6. Los cruces por parejas son múltiplos de 6, 10 y 15: tamaños 5, 3 y 2.\n\nSi restamos esos cruces, el treinta quedó sumado tres veces y restado tres: desapareció. Debemos devolver una vez la intersección de las tres listas. La cuenta es 15+10+6−5−3−2+1 = 22.\n\nA esta corrección alternada la llamamos inclusión y exclusión: sumamos intersecciones de una cantidad impar de condiciones y restamos las de cantidad par.',
      picture: { caption: 'Cuánto aporta el número 30, que pertenece a las tres listas.', rows: [
        { label: 'Condiciones elegidas', values: ['1', '2', '3'] },
        { label: 'Veces que aparece', values: ['3', '3', '1'] },
        { label: 'Contribución', values: ['+3', '−3', '+1'] },
      ] },
    },
    {
      title: 'Una intersección se cuenta con un mínimo común múltiplo',
      body: 'Un número divisible por todos los divisores elegidos es múltiplo de su mínimo común múltiplo, que abreviamos mcm. Si ese valor es L, la intersección tiene ⌊N/L⌋ elementos.\n\nNo uses siempre el producto. Para divisores 4 y 6 hasta veinte, el cruce contiene doce: mcm(4,6)=12. La unión tiene 5+3−1 = 7 números. Usar 4·6=24 perdería la intersección y contaría doce dos veces.\n\nAgregamos un divisor d a un mcm L mediante (L/gcd(L,d))·d. gcd es el máximo común divisor; dividir primero evita repetir factores compartidos.',
    },
    {
      title: 'Representar las condiciones elegidas con bits',
      body: 'Una máscara de k bits indica qué divisores intervienen en una intersección. El bit i encendido elige d[i]. Recorremos máscaras de uno a 2^k−1: excluimos la máscara vacía porque no corresponde a una condición de la unión.\n\nPara cada máscara empezamos con L=1 y contamos sus bits encendidos. Cada divisor elegido se incorpora al mcm. Si el mcm supera N, ningún número de 1 a N puede ser múltiplo suyo y dejamos de calcular esa máscara.',
      code: excerpt(lesson, '        long long L = 1;', '        if (!empty)'), codeKind: 'fragment',
      afterCode: 'La comprobación `a > N / d[i]` se hace antes de multiplicar. Es equivalente a a·d[i] > N porque las cantidades son positivas, pero no calcula ese producto posiblemente enorme. Cuando la intersección está vacía, ni siquiera necesitamos conocer cuántos bits faltaban: su contribución será cero.',
    },
    {
      title: 'Aplicar el signo y justificarlo por un solo número',
      body: 'Si una máscara tiene cantidad impar de bits, sumamos N/L; si tiene cantidad par, lo restamos. Para demostrarlo, fija un número que cumpla t condiciones. Aparece en C(t,1) listas individuales, C(t,2) pares y así sucesivamente.\n\nSu coeficiente final es C(t,1)−C(t,2)+…+(−1)^(t+1)C(t,t). La expansión de (1−1)^t dice que, al incluir también el término C(t,0)=1, la suma alternada vale cero. Por tanto, el coeficiente que usamos vale uno.\n\nUn número que no cumple ninguna condición no aparece. Así contamos una vez cada número válido y ninguna vez los demás.',
      code: 'if (!empty)\n    ans += (bits % 2 ? 1 : -1) * (N / L);', codeKind: 'fragment',
      check: { question: 'Si los divisores son 2 y 2, ¿la fórmula cuenta dos veces los múltiplos de dos?', answer: 'No. Suma la primera lista, suma la segunda y resta su intersección, que es la misma lista: queda una sola copia. Podemos eliminar divisores repetidos para ahorrar trabajo, pero la fórmula ya es correcta.' },
    },
    complete(lesson, 'La entrada de prueba vuelve al problema inicial: divisibilidad por dos o cinco hasta cien. El programa calcula 50+20−10 y devuelve sesenta.', 'Hay hasta 2^k−1 máscaras y k divisores por máscara. Incluyendo gcd, el costo es O(k·2^k·log D), donde D acota los divisores; la memoria es O(k). Las sumas intermedias tienen signo, así que usamos long long. Prueba un divisor mayor que N y un divisor igual a uno: este último hace válida toda la fila de N números.'),
    {
      title: 'El complemento y las permutaciones sin posiciones fijas',
      body: 'Si quieres números que no cumplen ninguna condición, resta la unión de N. En el ejemplo hasta treinta con divisores 2,3,5 quedan 30−22 = 8.\n\nLa misma idea cuenta permutaciones sin posiciones fijas. Una condición significa que cierta posición conserva su elemento. Fijar j posiciones deja (n−j)! permutaciones. Agrupar intersecciones de igual tamaño da Σ(j=0…n) (−1)^j C(n,j)(n−j)!.\n\nCon tres elementos, la cuenta es 6−6+3−1 = 2. Aquí el término j=0 empieza con todas las permutaciones y las correcciones eliminan las que tienen posiciones fijas. Lo que cambia es cómo cuentas una intersección; la justificación de los signos es la misma.',
    },
    {
      title: 'Al menos una no significa exactamente una',
      body: 'La fórmula conserva una vez cualquier objeto que cumpla una o varias condiciones. No elimina los que cumplen varias. Si dos listas contienen exactamente el mismo único objeto, su unión tiene uno, pero la cantidad de objetos que cumplen exactamente una propiedad es cero.\n\nAntes de enumerar máscaras, escribe qué conjunto quieres contar y cómo calcular cada intersección. Si solo importa la unión de múltiplos, puedes quitar un divisor que sea múltiplo de otro ya presente: sus números ya estaban incluidos.\n\nPara comprobar los signos, enumera un universo pequeño, registra cuántas condiciones cumple cada número y compara con la fórmula. Eso también detecta confundir mcm con producto.',
    },
  ]),
  'usaco-plat-matrix-expo': (lesson) => walkthrough([
    {
      title: 'Contar recorridos con una cantidad exacta de aristas',
      body: 'Un grafo dirigido tiene aristas 1→2, 2→3 y 1→3. Hay un recorrido de dos aristas de 1 a 3: pasar por 2. La arista directa no cuenta porque solo usa una. Permitimos repetir vértices cuando el grafo lo haga posible.\n\nLa entrada contiene n m k s t y m aristas dirigidas. n ≤ 30, m ≤ 1 000 y k ≤ 10¹⁸. Imprimimos el número de recorridos de exactamente k aristas de s a t, módulo 1 000 000 007. Elegir aristas paralelas distintas cuenta por separado.\n\nUna DP que avance una arista por etapa funciona, pero necesitaría k etapas. Agruparemos muchos pasos en una transformación y duplicaremos su longitud.',
    },
    {
      title: 'Una tabla para todos los recorridos de un paso',
      body: 'La matriz A guarda en A[u][v] cuántas aristas van de u a v. Es una tabla cuadrada n×n. En el ejemplo A[1][2], A[2][3] y A[1][3] valen uno y las otras entradas cero.\n\nPara contar recorridos de dos aristas de u a v, fija el vértice intermedio z. Hay A[u][z] opciones para la primera arista y A[z][v] para la segunda; se multiplican. Después sumamos sobre todos los z.\n\nLa fórmula C[u][v] = Σz A[u][z]A[z][v] es precisamente el producto de matrices. También permite unir recorridos de otras longitudes.',
      picture: { caption: 'Matriz de recorridos de una arista del ejemplo.', rows: [
        { label: 'Desde 1 hacia 1,2,3', values: ['0', '1', '1'] },
        { label: 'Desde 2 hacia 1,2,3', values: ['0', '0', '1'] },
        { label: 'Desde 3 hacia 1,2,3', values: ['0', '0', '0'] },
      ] },
    },
    {
      title: 'Escribir el producto y reducir cada suma',
      body: 'Si a cuenta recorridos de p aristas y b de q aristas, mul(a,b) cuenta recorridos de p+q. Cada recorrido completo tiene un único vértice donde termina su parte de longitud p; por eso aparece exactamente una vez en la suma.\n\nLos tres bucles eligen origen, punto intermedio y destino. La condición a[i][k] evita hacer multiplicaciones que aportarían cero. No cambia la fórmula.',
      code: excerpt(lesson, 'const long long MOD', 'int main()'), codeKind: 'fragment',
      afterCode: 'Con el módulo indicado, un producto de dos residuos cabe en long long. Reducimos después de cada adición; acumular muchos productos sin reducir podría desbordar. La letra k de este bucle es un índice intermedio local, distinto del exponente leído en main.',
    },
    {
      title: 'Cero pasos y potencias que se duplican',
      body: 'Con cero aristas existe un recorrido vacío de cada vértice a sí mismo y ninguno hacia otro. Lo representa la identidad I: unos en la diagonal, ceros fuera. Esa será la respuesta acumulada inicial r.\n\nPartimos de a=A. Al reemplazar a por a·a obtenemos recorridos de 2, luego 4, luego 8 aristas. Descomponemos la longitud k en esas potencias, como en exponenciación binaria. Si un bit está encendido, multiplicamos r por la potencia correspondiente.',
      code: excerpt(lesson, '    while (k)', '    cout << r[s][t]'), codeKind: 'fragment',
      afterCode: 'Si k=0 el bucle no entra y r sigue siendo I. Para k=2, el primer paso forma A² y el siguiente lo acumula. No sumamos A+A²: eso contaría varias longitudes, mientras el problema pide una longitud exacta.',
    },
    {
      title: 'Por qué podemos agrupar multiplicaciones',
      body: 'La multiplicación de matrices es asociativa: (AB)C=A(BC). Podemos agrupar las mismas transiciones sin cambiar su resultado. No es conmutativa en general: AB y BA pueden representar procesos distintos.\n\nDurante la exponenciación se conserva que r multiplicada por la potencia pendiente de a equivale a la potencia original. Si k es impar, trasladamos una copia de a a r. Después reemplazamos pares de copias por a² y dividimos k entre dos.\n\nUna multiplicación d×d cuesta O(d³), y hacemos O(log k) de ellas. El total es O(n³ log k), con O(n²) memoria. Por eso n debe ser pequeño aunque el exponente pueda ser enorme.',
      check: { question: 'En nuestro grafo, ¿la arista 1→3 contribuye al conteo de recorridos de longitud dos?', answer: 'No por sí sola. Llega en un paso a 3 y desde allí no sale ninguna arista. Solo 1→2→3 tiene exactamente dos pasos.' },
    },
    complete(lesson, 'El programa incrementa A[u][v] por cada arista, en vez de asignar uno: así conserva las opciones paralelas. Calcula A^k y consulta la entrada s,t. En el ejemplo la respuesta es uno.', 'Prueba k=0 tanto con s=t como con s distinto de t. Deben salir uno y cero. Con dos aristas paralelas 1→2 y una 2→1, hay cuatro recorridos de tres aristas de 1 a 2: dos elecciones para la primera y dos para la tercera.'),
    {
      title: 'Usar una matriz para una recurrencia',
      body: 'Fibonacci cumple F(t+2)=F(t+1)+F(t). Guarda el estado columna [F(t+1),F(t)]. La matriz [[1,1],[1,0]] lo convierte en [F(t+1)+F(t),F(t+1)]. Desde [1,0], una aplicación da [1,1] y dos dan [2,1]. La segunda componente tras n aplicaciones es F(n).\n\nPara una recurrencia lineal de orden d, guarda d términos consecutivos. La primera fila calcula el nuevo término y las restantes desplazan los anteriores. Escribe qué representa cada componente antes de elegir la potencia.\n\nPara xSiguiente=2x+3 añade una componente constante uno: [[2,3],[0,1]] actúa sobre [x,1]. Una regla con un producto de dos variables, como x·y, no es lineal en ese estado. Si la transición cambia con el tiempo, tampoco puedes elevar una única matriz sin representar esa variación.',
    },
    {
      title: 'Cambiar conteos por costos',
      body: 'Hay otra multiplicación útil para caminos: sustituye la suma por mínimo y el producto por suma. Entonces C[u][v]=min_z(A[u][z]+B[z][v]) combina costos de dos partes de un recorrido. Su potencia obtiene costos mínimos de longitud exacta.\n\nEn ese modelo, la identidad tiene cero en la diagonal e infinito fuera. No uses la identidad de conteos, y evita sumar a infinito. También necesitas que la combinación siga siendo asociativa.\n\nLa interpretación fija los elementos neutros y las operaciones. El programa anterior usa la multiplicación ordinaria porque cuenta recorridos; una diagonal positiva en A^k representa recorridos que regresan al origen, no un error.',
    },
  ]),
  'usaco-plat-bitsets': (lesson) => walkthrough([
    {
      title: 'Decidir qué pesos podemos reunir',
      body: 'Tienes tres objetos de pesos 2, 3 y 2. Cada objeto se elige como máximo una vez. Puedes reunir cuatro usando los dos objetos de peso dos, y siete usando los tres. No puedes reunir seis.\n\nLa entrada contiene n q, los n pesos y q objetivos. n,q ≤ 1 000; pesos y objetivos están entre cero y 100 000. Imprimimos SI o NO según exista un subconjunto con la suma exacta. El subconjunto vacío permite conseguir cero.\n\nUna DP booleana mantiene posible[s] para cada suma y procesa un objeto cada vez. Eso tiene unos n·100 001 estados. La transición tiene una forma que permite actualizar muchos estados con una sola operación sobre bloques de bits.',
    },
    {
      title: 'Un bit por cada suma',
      body: 'Un bit solo guarda cero o uno. Usaremos uno cuando una suma sea posible. Al principio encendemos el bit cero y apagamos los demás. std::bitset<100001> reserva posiciones desde cero hasta 100 000.\n\nCon un objeto de peso dos aparecen las sumas {0,2}. Al procesar el peso tres aparecen {0,2,3,5}. Todavía no contamos cuántas selecciones producen cada suma: solo su existencia.',
      code: 'bitset<100001> b;\nb[0] = 1;', codeKind: 'fragment',
      picture: { caption: 'Sumas alcanzables hasta siete durante el ejemplo.', rows: [
        { label: 'Suma', values: ['0', '1', '2', '3', '4', '5', '6', '7'] },
        { label: 'Sin objetos', values: ['1', '0', '0', '0', '0', '0', '0', '0'] },
        { label: 'Después de 2 y 3', values: ['1', '0', '1', '1', '0', '1', '0', '0'] },
        { label: 'Después del otro 2', values: ['1', '0', '1', '1', '1', '1', '0', '1'], highlight: [4, 7] },
      ] },
    },
    {
      title: 'Desplazar las sumas al usar el objeto nuevo',
      body: 'Si una selección anterior sumaba s, al agregar el nuevo objeto de peso x suma s+x. El desplazamiento b<<x mueve cada bit encendido de s a s+x: representa todas las selecciones que sí usan ese objeto.\n\nLas que no lo usan siguen en b. OR, escrito |, enciende un bit si aparece en cualquiera de los dos estados. Por eso la transición completa es b |= b << x.',
      code: excerpt(lesson, '    while (n--)', '    while (q--)'), codeKind: 'fragment',
      afterCode: 'El lado derecho se calcula a partir del estado anterior antes de asignar. Un mismo objeto no puede seguir desplazándose durante su propia transición. Es la versión agrupada de una DP de mochila que recorre las sumas en orden descendente.',
    },
    {
      title: 'Seguir la última transición sin perder las repeticiones',
      body: 'Antes del último objeto de peso dos tenemos {0,2,3,5}. Desplazar por dos produce {2,4,5,7}. Unir ambos conjuntos da {0,2,3,4,5,7}.\n\nEl cuatro usa los dos objetos distintos de peso dos. El seis sigue apagado: no tenemos tres objetos de peso dos ni dos de peso tres. Repetir un valor en la entrada no significa poder repetir indefinidamente un objeto.\n\nCon peso cero, desplazar no cambia los bits y OR deja la misma tabla. Puede haber más selecciones, pero las sumas posibles son las mismas.',
      check: { question: 'Si hay dos objetos de peso uno, ¿qué guarda el bit de la suma uno: uno o dos?', answer: 'Guarda uno, como valor booleano verdadero. Hay dos selecciones posibles, pero el bitset no conserva cuántas formas existen.' },
    },
    {
      title: 'Por qué podemos descartar sumas grandes',
      body: 'Los bits que salen del tamaño del bitset se descartan. Aquí es seguro porque solo preguntamos hasta 100 000 y todos los pesos son no negativos. Una suma mayor nunca volverá a bajar a un objetivo permitido.\n\nCon pesos negativos, ese argumento deja de servir: podrías superar el límite y después regresar. Tendrías que representar otro rango, con un desplazamiento para índices negativos, o elegir otra técnica.\n\nLa propiedad de la DP es que, tras cada objeto, b[s] dice si alguna selección de los objetos ya procesados suma s. La transición separa selecciones que omiten el objeto y selecciones que lo incluyen una vez. Esos dos casos cubren todas las posibilidades.',
    },
    complete(lesson, 'La entrada usa [2,3,2] y consulta 0, 4, 6 y 7. Esperamos SI, SI, NO y SI. Tras preparar la tabla, cada pregunta lee directamente un bit.', 'Un modelo de implementación por palabras de w bits procesa aproximadamente w estados por operación: O(n·ceil(S/w)) trabajo y O(S) bits, para S=100001. C++ define el resultado de bitset, no una instrucción SIMD específica; las constantes dependen de la biblioteca. El tamaño de std::bitset se fija al compilar.'),
    {
      title: 'Reconstruir qué objetos usamos',
      body: 'La tabla final solo dice si existe una selección. Para reconstruirla, una opción guarda el bitset después de cada objeto. Recorre objetos al revés con suma pendiente s. Si la etapa anterior ya permitía s, omite el objeto; si no, debes usarlo y reemplazar s por s−peso.\n\nCon objetivo cuatro en el ejemplo, sin el último dos no era posible cuatro: lo usamos y quedan dos. El tres se omite porque dos ya era posible antes. Finalmente usamos el primer dos.\n\nGuardar todas las etapas ocupa O(nS) bits. Otra opción registra predecesores solo para sumas nuevas, detectadas con (b<<x) & ~b. Enumerar esos bits y guardar sus objetos añade trabajo; la reconstrucción no viene incluida en el OR.',
    },
    {
      title: 'Otras preguntas que operan sobre muchos bits',
      body: 'Si cada vértice de un grafo guarda un bitset de vecinos, (vecinos[u] & vecinos[v]).count() cuenta vecinos comunes: AND deja solo los bits presentes en ambos. OR reúne conjuntos; XOR marca diferencias; any y none comprueban si hay algún bit encendido.\n\nEl ahorro aparece cuando puedes expresar una transición completa con operaciones colectivas. Cambiar un vector por bitset sin esa estructura no garantiza acelerar el algoritmo. Para tamaños dinámicos puedes implementar bloques de enteros, pero tendrás que manejar los desplazamientos entre bloques y los bits sobrantes.\n\nPara contar formas de obtener una suma necesitas cantidades, no bits de existencia. Antes de usar OR, comprueba que perder multiplicidades sea compatible con la pregunta.',
    },
  ]),
  'usaco-plat-dp-sos': (lesson) => walkthrough([
    {
      title: 'Contar máscaras contenidas en una consulta',
      body: 'Representamos dos habilidades con los bits 01 y 10. Las máscaras 00, 01, 10 y 11 significan ninguna, la primera, la segunda y ambas. Tenemos registros [0,1,1,2]. Una consulta x cuenta registros que no tengan habilidades fuera de x.\n\nPara x=01 cuentan 00 y las dos copias de 01: tres. Para x=11 cuentan los cuatro registros. La condición exacta es (m AND x)=m: todos los bits de m están en x. Decimos que m es una submáscara de x.\n\nLa entrada contiene B n q, n máscaras y q consultas. B ≤ 20 y n,q ≤ 200 000. Imprimimos un conteo por consulta, incluyendo cada aparición repetida. Vamos a preparar todas las respuestas F[x].',
    },
    {
      title: 'Separar frecuencias exactas de sumas de submáscaras',
      body: 'Primero A[m] cuenta registros con máscara exactamente m. En el ejemplo A=[1,2,1,0], en orden 00,01,10,11. Queremos F[x]=Σ(m submáscara de x)A[m].\n\nEnumerar submáscaras para cada x repite trabajo. En todas las parejas (m,x), cada bit tiene tres posibilidades: fuera de x, en x pero fuera de m, o en ambos. Por eso el total es 3^B.\n\nSOS DP prepara sumas parciales procesando un bit a la vez. Después de procesarlo, permitiremos que ese bit aparezca o no en los registros contados.',
    },
    {
      title: 'Procesar el primer bit a mano',
      body: 'Copia las frecuencias en F. Para el bit 0, las máscaras que lo contienen reciben el valor de la misma máscara sin ese bit: F[01]+=F[00] y F[11]+=F[10]. Queda [1,3,1,1].\n\nAhora procesa el bit 1: F[10]+=F[00] y F[11]+=F[01]. Queda [1,3,2,4]. Las respuestas de 00, 01 y 11 son una, tres y cuatro, como esperábamos.\n\nNo sumamos todos los subconjuntos en un solo paso. Cada etapa permite omitir una posición binaria adicional.',
      picture: { caption: 'Las etapas para frecuencias exactas [1,2,1,0].', rows: [
        { label: 'Máscara', values: ['00', '01', '10', '11'] },
        { label: 'Frecuencia inicial', values: ['1', '2', '1', '0'] },
        { label: 'Tras bit 0', values: ['1', '3', '1', '1'], highlight: [1, 3] },
        { label: 'Tras bit 1', values: ['1', '3', '2', '4'], highlight: [2, 3] },
      ] },
    },
    {
      title: 'Escribir una etapa sin contar dos veces',
      body: 'El ciclo exterior elige el bit b. El interior recorre máscaras m. Si m contiene ese bit, m XOR (1<<b) lo apaga y proporciona la contribución que lo omite.\n\nPodemos modificar f en su propio arreglo: durante la etapa b, las máscaras sin b no cambian. Esas son justamente las que usamos como origen. Por tanto, no leemos una contribución que acabamos de duplicar en la misma etapa.',
      code: excerpt(lesson, '    for (int b = 0;', '    while (q--)'), codeKind: 'fragment',
      afterCode: 'La operación `m ^ (1 << b)` apaga el bit solo porque comprobamos antes que estaba encendido. Si no lo estuviera, XOR lo encendería y estaríamos sumando en la dirección equivocada.',
    },
    {
      title: 'La propiedad que mantiene cada etapa',
      body: 'Después de procesar un conjunto de bits, f[m] cuenta máscaras que pueden omitir cualquiera de esos bits encendidos de m, pero deben coincidir con m en los bits pendientes.\n\nAl procesar el siguiente bit, separa dos grupos disjuntos: los que lo conservan, ya presentes en f[m], y los que lo omiten, presentes en f[m sin bit]. Sumarlos no repite ninguna máscara. Al terminar, todos los bits pueden omitirse y quedan exactamente las submáscaras de m.\n\nLas repeticiones iniciales están en las frecuencias y se conservan como cantidades. La máscara vacía pertenece a cualquier consulta, pero su frecuencia no es automáticamente uno: depende de la entrada.',
      check: { question: 'Con [0,1,1,2], ¿por qué la consulta 10 devuelve dos y no tres?', answer: 'Solo acepta 00 y 10. Las dos copias de 01 contienen un bit que 10 no permite. Las frecuencias aceptadas son una más una.' },
    },
    complete(lesson, 'El programa cuenta primero las máscaras exactas, hace las B etapas y responde consultando f[x]. La entrada pregunta por 0, 1 y 3 y produce 1, 3 y 4.', 'La preparación cuesta O(n+B·2^B), cada consulta O(1) y la memoria O(2^B). Con B=20, un vector de long long ocupa unos 8 MiB. Si guardas varias tablas, suma sus tamaños. Para verificar, enumera submáscaras directamente con B pequeño y compara cada respuesta.'),
    {
      title: 'Contar supermáscaras e invertir las sumas',
      body: 'Si quieres contar registros que tengan todas las habilidades de x, buscas supermáscaras. Invierte la dirección: cuando m no contiene el bit b, agrega F[m con b] a F[m]. No es la misma pregunta que estar contenido en x.\n\nLa transformada de sumas de submáscaras se puede invertir: usa los mismos bucles, pero resta en lugar de sumar. Se llama inversión de Möbius sobre subconjuntos. No hay que dividir por ninguna cantidad.\n\nEn nuestra tabla final [1,3,2,4], restar por el bit 0 produce [1,2,2,2]. Restar por el bit 1 devuelve [1,2,1,0]. Las contribuciones agregadas por cada dimensión se deshacen; estas operaciones sobre bits distintos pueden aplicarse en el mismo orden.',
      code: 'for (int b = 0; b < B; b++)\n    for (int m = 0; m < (1 << B); m++)\n        if (m & (1 << b))\n            f[m] -= f[m ^ (1 << b)];', codeKind: 'fragment',
    },
    {
      title: 'Combinar parejas cuyo OR sea una máscara exacta',
      body: 'Supón que C[s] debe sumar A[a]·B[b] para todas las parejas con a OR b = s. Si transformas A y B por sumas de submáscaras y multiplicas los resultados en cada s, cuentas parejas donde a y b están contenidos en s. Eso equivale a que su OR esté contenido en s.\n\nEl producto obtenido es, por tanto, la transformada de C. Aplica la inversión anterior para recuperar los valores de OR exacto. Así una suma sobre muchas parejas se convierte en dos transformadas, productos posición a posición y una inversión.\n\nEl argumento utiliza OR. No sirve sin cambios para XOR: estar contenidos en s no describe el resultado exacto de XOR. Tampoco toda operación admite una inversa; si reemplazas suma por máximo, no puedes recuperar las frecuencias originales restando.',
    },
  ]),
};
