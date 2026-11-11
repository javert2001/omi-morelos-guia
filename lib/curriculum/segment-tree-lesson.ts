import type { Lesson } from './types.ts';

const scan = `int reservarSinArbol(int personas) {
    for (int salon = 1; salon <= n; salon++) {
        if (lugares[salon] >= personas) {
            lugares[salon] -= personas;
            return salon;
        }
    }
    return 0; // Ningún salón tiene espacio suficiente.
}`;

const build = `void construir(int nodo, int inicio, int fin) {
    if (inicio == fin) {
        mayor[nodo] = lugares[inicio];
        return;
    }

    int medio = (inicio + fin) / 2;
    construir(nodo * 2, inicio, medio);
    construir(nodo * 2 + 1, medio + 1, fin);

    mayor[nodo] = max(mayor[nodo * 2],
                      mayor[nodo * 2 + 1]);
}`;

const search = `int buscar(int nodo, int inicio, int fin, int personas) {
    if (mayor[nodo] < personas) return 0;
    if (inicio == fin) return inicio;

    int medio = (inicio + fin) / 2;
    if (mayor[nodo * 2] >= personas) {
        return buscar(nodo * 2, inicio, medio, personas);
    }
    return buscar(nodo * 2 + 1, medio + 1, fin, personas);
}`;

const update = `void actualizar(int nodo, int inicio, int fin,
                int salon, int nuevoValor) {
    if (inicio == fin) {
        mayor[nodo] = nuevoValor;
        return;
    }

    int medio = (inicio + fin) / 2;
    if (salon <= medio) {
        actualizar(nodo * 2, inicio, medio, salon, nuevoValor);
    } else {
        actualizar(nodo * 2 + 1, medio + 1, fin, salon, nuevoValor);
    }

    mayor[nodo] = max(mayor[nodo * 2],
                      mayor[nodo * 2 + 1]);
}`;

export const segmentTreeProgram = `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int n;
vector<int> lugares, mayor;

${build}

${search}

${update}

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int q;
    cin >> n >> q;
    lugares.resize(n + 1);
    mayor.resize(4 * n);
    for (int salon = 1; salon <= n; salon++) {
        cin >> lugares[salon];
    }
    construir(1, 1, n);

    for (int grupo = 0; grupo < q; grupo++) {
        int personas;
        cin >> personas;
        int salon = buscar(1, 1, n, personas);
        cout << salon << '\\n';

        if (salon != 0) {
            lugares[salon] -= personas;
            actualizar(1, 1, n, salon, lugares[salon]);
        }
    }
}`;

const sample = { input: '4 3\n2 7 1 5\n4 3 6\n', output: '2\n2\n0\n' };

// One reviewed example, kept separate while the teaching format is evaluated.
export const segmentTreeLesson: Partial<Lesson> = {
  presentation: 'walkthrough',
  title: 'Árboles de segmentos',
  description: 'Encontrar el primer salón con espacio: del recorrido directo a un árbol de máximos en C++.',
  takeaway: 'Llega un grupo a la escuela. Necesitas encontrar el primer salón donde quepan todos y descontar los lugares que ocuparon. Vamos a escribir un programa que haga eso sin revisar cada salón una y otra vez.',
  prerequisites: ['arreglos', 'funciones'],
  minutes: 45,
  objectives: ['Construir un árbol que guarde el mayor espacio disponible de cada intervalo', 'Buscar un salón y actualizar su capacidad en C++'],
  detailedSections: undefined,
  sections: [
    {
      title: 'El problema que vamos a resolver',
      body: 'Hay cuatro salones, numerados del 1 al 4. Tienen 2, 7, 1 y 5 lugares libres. Llegan grupos de personas; todos los integrantes de un grupo deben entrar al mismo salón. Debes elegir el primer salón con espacio suficiente, empezando por el número 1. Los lugares ocupados dejan de estar disponibles.\n\nSi llegan cuatro personas, eliges el salón 2 y allí quedan tres lugares. Si después llegan tres personas, vuelves a elegir el salón 2 y lo dejas lleno. Un grupo posterior de seis no cabe en ningún salón. En ese caso, el programa responde 0.\n\nLa entrada nos dará n salones, q grupos y sus cantidades. Queremos imprimir el salón asignado a cada grupo. Toda la lección usará posiciones desde uno, también en C++.',
      picture: { caption: 'Procesamos los grupos en el orden en que llegan.', rows: [
        { label: 'Salón', values: ['1', '2', '3', '4'] },
        { label: 'Al principio', values: ['2', '7', '1', '5'] },
        { label: 'Llegan 4 → salón 2', values: ['2', '3', '1', '5'], highlight: [1] },
        { label: 'Llegan 3 → salón 2', values: ['2', '0', '1', '5'], highlight: [1] },
        { label: 'Llegan 6 → ninguno', values: ['2', '0', '1', '5'] },
      ] },
      check: { question: 'Para el primer grupo de cuatro personas, ¿por qué no elegimos el salón 4?', answer: 'Sí tiene espacio, pero el salón 2 también y aparece antes. El enunciado pide el primero donde quepan, no el que deje menos lugares sobrantes.' },
    },
    {
      title: 'Primero, una solución con un for',
      body: 'Guarda las capacidades en el arreglo lugares. Dejamos lugares[0] sin usar para que lugares[1] corresponda al salón 1. Para cada grupo, recorremos el arreglo y nos detenemos en el primer valor que alcance.\n\nEsta función resuelve una llegada. Recibe el tamaño del grupo, descuenta los lugares ocupados y devuelve el número de salón:',
      code: scan,
      codeKind: 'fragment',
      afterCode: 'El `return salon` termina la función en cuanto encontramos espacio. Si el ciclo termina sin encontrarlo, devolvemos 0. Esta solución es correcta.\n\nEl problema aparece con muchos datos. Si hay 200 000 salones y llegan 200 000 grupos que no caben, revisamos todos los salones para cada grupo: hasta 40 000 millones de comprobaciones. Necesitamos poder descartar varios salones de una sola vez.',
    },
    {
      title: '¿Podemos descartar una mitad de golpe?',
      body: 'Volvamos a las capacidades originales: [2, 7, 1, 5]. Separa los salones en dos mitades. En los salones 1 y 2, el mayor espacio disponible es 7. En los salones 3 y 4, es 5.\n\nSi un grupo tiene seis personas, sabemos que no cabe en la mitad derecha: incluso su salón más grande tiene solo cinco lugares. Podemos descartar esa mitad sin revisar sus salones. Eso es lo que nos aporta guardar el máximo.\n\nAhora dibujamos una caja para cada intervalo, es decir, para cada grupo de salones consecutivos. Cada caja guarda el mayor espacio disponible de ese intervalo. Dividimos cada intervalo por la mitad hasta que las cajas de abajo representen un solo salón. El dibujo que resulta es un árbol de segmentos.',
      diagram: 'segment-max',
      afterCode: 'Cada caja se llama **nodo**. La de arriba es la **raíz** y abarca todos los salones. Las cajas de abajo, que representan un solo salón, son las **hojas**. Las dos cajas conectadas debajo de otra son sus **hijos**.\n\nPara calcular una caja, tomamos el mayor de los valores de sus dos hijos: `max(2, 7) = 7`, `max(1, 5) = 5` y, arriba, `max(7, 5) = 7`.',
      check: { question: 'Dos salones tienen dos lugares libres cada uno. ¿Guardar la suma, 4, nos diría si cabe un grupo de cuatro?', answer: 'No. El grupo no se puede dividir entre salones. El máximo es 2, y eso sí nos dice que ninguno tiene los cuatro lugares necesarios.' },
    },
    {
      title: 'Busquemos un salón siguiendo el dibujo',
      body: 'Llega el grupo de cuatro. Empezamos arriba: el 7 nos dice que algún salón tiene espacio. Miramos la mitad izquierda, cuyo máximo también es 7. Buscamos allí porque sus salones aparecen antes que los de la derecha.\n\nDentro de esa mitad, el salón 1 tiene dos lugares y no alcanza. El salón 2 tiene siete: esa es la respuesta. Recorrimos un camino del árbol hasta encontrar un salón, sin inspeccionar los salones 3 y 4.\n\nDespués de sentar al grupo, el salón 2 pasa de 7 a 3. Corregimos las cajas que lo incluyen: el máximo de los salones 1 y 2 pasa a 3; el máximo general pasa a 5. La mitad derecha no cambió. La animación recorre estas decisiones y luego procesa los otros dos grupos.',
      visual: 'segment-search',
      afterCode: 'Siempre intentamos la izquierda primero. Solo vamos a la derecha cuando el máximo izquierdo es demasiado pequeño. En ese caso sabemos que ningún salón de la izquierda serviría; no estamos saltándonos una respuesta anterior.',
    },
    {
      title: 'Del dibujo a dos arreglos',
      body: 'El dibujo ayuda a entender la estructura. Para programarla bastan dos arreglos: lugares guarda la capacidad actual de cada salón y mayor guarda el valor escrito dentro de cada caja: el máximo de su intervalo.\n\nNumeramos las cajas empezando por la raíz, que será la 1. Para una caja con número nodo, usamos nodo * 2 para su hijo izquierdo y nodo * 2 + 1 para el derecho. Así la raíz tiene hijos 2 y 3; la caja 2 tiene hijos 4 y 5.\n\nEl número de caja no es el número de salón. En nuestro dibujo, la caja 5 representa el salón 2. La tabla muestra las dos cosas por separado:',
      picture: { caption: 'Dónde guardamos cada caja del dibujo para n = 4.', rows: [
        { label: 'Número de caja', values: ['1', '2', '3', '4', '5', '6', '7'] },
        { label: 'Salones que abarca', values: ['1 a 4', '1 a 2', '3 a 4', '1', '2', '3', '4'] },
        { label: 'Valor en mayor', values: ['7', '7', '5', '2', '7', '1', '5'] },
      ] },
      code: `int n;
vector<int> lugares; // Posiciones 1 a n: un valor por salón.
vector<int> mayor;   // Posiciones del árbol; la raíz está en 1.`,
      codeKind: 'fragment',
      afterCode: 'En el programa completo reservaremos `n + 1` posiciones para lugares. Para mayor reservaremos `4 * n`: es una cota que deja espacio suficiente para esta numeración, incluso cuando n no es potencia de dos. No significa que cada salón tenga cuatro nodos.\n\nLas funciones recibirán `nodo`, `inicio` y `fin`. Son el número de caja y el intervalo de salones que representa, incluyendo ambos extremos. Por ejemplo, `(2, 1, 2)` significa «caja 2, salones del 1 al 2».',
    },
    {
      title: 'Construir el árbol',
      body: 'La función construir llena las cajas. Si inicio y fin son iguales, estamos ante un solo salón: copiamos su capacidad. Si hay varios, dividimos el intervalo, construimos las dos mitades y guardamos el mayor de sus resultados.\n\nLa función se llama a sí misma sobre intervalos más pequeños. Eso es la recursión aquí: resolver las mitades antes de calcular la caja que las contiene.',
      code: build,
      codeKind: 'fragment',
      afterCode: 'Para los cuatro salones llamamos `construir(1, 1, 4)`. El punto medio es 2, por lo que construye los salones 1 a 2 y los salones 3 a 4.\n\nLa primera mitad se divide de nuevo: copia 2 y 7 en sus hojas y guarda `max(2, 7) = 7`. La segunda guarda `max(1, 5) = 5`. Cuando ambas llamadas terminan, la llamada original guarda `max(7, 5) = 7` en la raíz.\n\nCon una cantidad impar de salones, la división también funciona. Por ejemplo, de 1 a 5 el punto medio es 3: quedan los intervalos de 1 a 3 y de 4 a 5, sin repetir ni omitir posiciones.',
    },
    {
      title: 'Buscar el primer salón que alcance',
      body: 'Ahora escribimos las decisiones del dibujo. Si el máximo del intervalo no alcanza, devolvemos 0. Si alcanza y el intervalo ya es un solo salón, devolvemos esa posición. En otro caso elegimos una mitad.\n\nSolo bajamos a la derecha cuando el máximo izquierdo no alcanza. Como ya comprobamos que existe espacio en el intervalo completo, en ese caso tiene que estar a la derecha.',
      code: search,
      codeKind: 'fragment',
      afterCode: 'Para cuatro personas, la primera llamada es `buscar(1, 1, 4, 4)`. El máximo izquierdo es 7, así que llama a `buscar(2, 1, 2, 4)`. Allí el máximo izquierdo es 2 y no alcanza: llama a `buscar(5, 2, 2, 4)`.\n\nEn esa última llamada, inicio y fin valen 2. Devuelve **2**, el número de salón, no 5, que era el número de caja. La búsqueda todavía no ha ocupado ningún lugar.',
    },
    {
      title: 'Descontar los lugares y corregir el árbol',
      body: 'Encontramos el salón 2. Descontamos las cuatro personas: lugares[2] pasa de 7 a 3. Falta avisarle al árbol, porque sus cajas todavía contienen los máximos anteriores.\n\nLa función actualizar recibe el salón que cambió y su nuevo valor. Baja solamente por la mitad que contiene ese salón. Al llegar a la hoja escribe el valor nuevo; al regresar de cada llamada recalcula el máximo del padre.',
      code: update,
      codeKind: 'fragment',
      afterCode: 'Después de cambiar `lugares[2]`, llamamos a `actualizar(1, 1, 4, 2, 3)`. La hoja del salón 2 queda en 3. Su padre pasa a `max(2, 3) = 3` y la raíz a `max(3, 5) = 5`.\n\nNo reconstruimos todo el árbol. Las cajas de los salones 3 y 4 siguen siendo correctas porque ninguno de esos salones perdió lugares. Si la búsqueda devuelve 0, tampoco descontamos ni actualizamos nada.',
      check: { question: 'Tras ocupar cuatro lugares del salón 2, llega un grupo de seis. ¿Qué devuelve buscar y en qué línea lo decide?', answer: 'Devuelve 0 en la primera condición: mayor[1] vale 5 y 5 < 6. El salón con más espacio tiene cinco lugares, así que no hace falta bajar por el árbol.' },
    },
    {
      title: '¿Cuánto trabajo nos ahorramos?',
      body: 'Cada vez que bajamos un nivel, el intervalo se reduce aproximadamente a la mitad. Con ocho salones pasamos de 8 a 4, luego a 2 y finalmente a 1. Son tres decisiones. Con unos 200 000 salones hacen falta unas dieciocho.\n\nBuscar sigue un solo camino. Actualizar sigue otro camino hasta una hoja y recalcula las cajas al volver. Por eso ambas operaciones cuestan O(log n). El recorrido inicial podía revisar n salones por grupo.\n\nConstruir sí visita todas las cajas, pero lo hacemos una sola vez. Un árbol con n hojas tiene 2n − 1 cajas, así que construir cuesta O(n). Para n salones y q grupos, el programa completo cuesta O(n + q log n) y usa O(n) memoria.',
    },
    {
      title: 'El programa completo, listo para probar',
      body: 'Juntamos las tres funciones. Por cada grupo, main busca un salón, imprime la respuesta y, si encontró uno, descuenta los lugares y actualiza el árbol. Las funciones son las mismas que acabamos de leer.\n\nLa primera línea de entrada contiene n y q. La segunda contiene las n capacidades. La tercera contiene los q tamaños de grupo. Imprimimos una respuesta por línea. Puedes probar el programa aquí; el editor ya incluye esta entrada:',
      example: sample,
      code: segmentTreeProgram,
      codeInput: sample.input,
      afterCode: 'Prueba cambiar la última llegada de 6 a 5. Después de los primeros dos grupos quedan `[2, 0, 1, 5]`, así que la última respuesta debe ser **4**. Si cambias la llegada a 8, debe seguir siendo **0**.\n\nEn este problema las capacidades van de 0 a 10⁹ y los tamaños de grupo, de 1 a 10⁹. Usamos int porque solo comparamos capacidades y restamos cantidades que caben. Aquí nunca sumamos las capacidades de varios salones.',
    },
  ],
  quiz: {
    question: 'Los salones tienen [2, 3, 1, 5] lugares y llegan cuatro personas. ¿Qué hacemos al ver que el máximo de los salones 1 y 2 es 3?',
    options: ['Buscamos en los salones 3 y 4: ninguno de los dos primeros tiene espacio.', 'Elegimos el salón 2 porque es el más grande de la izquierda.', 'Respondemos 0 porque la mitad izquierda no alcanza.'],
    answer: 0,
    explanation: 'Descartamos los salones 1 y 2 porque incluso el mayor tiene menos de cuatro lugares. La mitad derecha tiene máximo 5; la búsqueda termina en el salón 4.',
  },
  exercises: [
    {
      id: 'salones',
      title: 'Implementa la asignación de salones',
      prompt: 'Resuelve el problema de esta lección. Cada grupo entra completo en el primer salón con espacio suficiente. Resta los lugares que ocupa e imprime el número de salón, o 0 si no cabe.\n\nLa entrada contiene n q, luego n capacidades y finalmente q tamaños de grupo. Usa posiciones del 1 al n y escribe una respuesta por línea. Límites: 1 ≤ n, q ≤ 200 000, capacidades de 0 a 10⁹ y grupos de 1 a 10⁹.',
      hints: ['Construye una sola vez el árbol de máximos. La raíz te permite comprobar si existe algún salón suficiente.', 'Busca primero a la izquierda si su máximo alcanza. Después de descontar los lugares, actualiza la hoja del salón elegido y los máximos de sus padres.'],
      solution: 'La construcción guarda el mayor espacio libre de cada intervalo. Para cada grupo, buscar devuelve el primer salón posible porque siempre prefiere la mitad izquierda cuando allí cabe alguien. Si el máximo del intervalo completo es insuficiente, devuelve 0.\n\nCuando hay respuesta, descontamos la capacidad en lugares y llamamos a actualizar con el nuevo valor. De ese modo la siguiente llegada usa las capacidades ya modificadas. El código de abajo coincide con el programa desarrollado en la lección.',
      code: segmentTreeProgram,
      sampleInput: sample.input,
      sampleOutput: sample.output,
      tests: [sample, { input: '1 3\n5\n2 3 1\n', output: '1\n1\n0\n' }, { input: '3 3\n0 0 4\n1 3 1\n', output: '3\n3\n0\n' }, { input: '5 5\n1 2 3 4 5\n5 4 3 2 1\n', output: '5\n4\n3\n2\n1\n' }],
    },
    {
      id: 'seguir-reservas',
      title: 'Sigue dos llegadas a mano',
      prompt: 'Los salones tienen [1, 6, 2, 4] lugares libres. Llega un grupo de cinco personas y después uno de tres. ¿Qué salón recibe a cada grupo? Escribe las capacidades después de cada llegada y los nuevos máximos de la mitad izquierda, de la derecha y de la raíz.',
      hints: ['Para el grupo de cinco, el máximo izquierdo es 6. ¿Cuál de sus dos salones lo puede recibir?', 'Después de la primera llegada, revisa cuánto espacio queda realmente en el salón 2 antes de buscar para el segundo grupo.'],
      solution: 'Las cinco personas entran al salón 2. Queda [1, 1, 2, 4]; los máximos son 1 a la izquierda, 4 a la derecha y 4 en la raíz.\n\nLas tres personas siguientes no caben en la mitad izquierda. En la derecha, el salón 3 tampoco alcanza, así que entran al salón 4. Queda [1, 1, 2, 1], con máximos 1 a la izquierda, 2 a la derecha y 2 en la raíz. Las respuestas son 2 y 4.',
    },
  ],
};
