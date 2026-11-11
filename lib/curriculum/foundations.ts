import type { Lesson, Problem } from './types.ts';

// Every code example is a complete program that can be compiled with C++17.
const cpp = (body: string, headers: string[] = []) =>
  [
    "#include <iostream>",
    ...headers.map((header) => `#include <${header}>`),
    "using namespace std;",
    "",
    "int main() {",
    body,
    "    return 0;",
    "}",
  ].join("\n");
const starter = cpp(
  "    // Lee los datos, resuelve el problema e imprime tu respuesta.\n",
);

export const foundationLessons: Lesson[] = [
  {
    id: "que-es-programar",
    level: "inicio",
    title: "Qué es programar",
    description:
      "Describe una tarea mediante datos de entrada, instrucciones y una salida.",
    minutes: 10,
    sections: [
      {
        title: "Instrucciones que se pueden seguir",
        body: "Preparar una torta requiere ingredientes y acciones en cierto orden: abrir el pan, poner el relleno y cerrarlo. Programar también consiste en describir acciones, pero con suficiente precisión para que una computadora pueda ejecutarlas. Si una instrucción resulta ambigua, el programa no elegirá por nosotros la interpretación que queríamos.",
      },
      {
        title: "Entrada, cálculo y resultado",
        body: "Dos autobuses llevan 23 y 19 personas. Recibimos esas cantidades como entrada, las sumamos y entregamos 42 como salida. El procedimiento de sumar sirve con otros números; 42 es solo el resultado de esta prueba. Llamamos algoritmo a los pasos que indican cómo resolver la tarea con los datos recibidos.",
      },
      {
        title: "Un programa que escribe un mensaje",
        body: "El siguiente programa está escrito en C++ y muestra Hola, Morelos! No lee datos porque el mensaje es fijo. El texto entre comillas determina qué aparece en la salida. Pulsa Probar código para abrir este programa completo en el laboratorio de la página.",
        code: cpp(String.raw`    cout << "Hola, Morelos!" << '\n';`),
      },
      {
        title: "Ejecutar y cambiar el mensaje",
        body: "Deja la entrada vacía y pulsa Ejecutar código. La salida debe contener Hola, Morelos! Cambia únicamente el texto entre comillas y ejecuta de nuevo: verás el mensaje nuevo. El laboratorio conserva el borrador en este navegador cuando su almacenamiento está disponible. El menú Laboratorio C++ ofrece otro editor para pruebas independientes.",
      },
      {
        title: "Detectar una instrucción incompleta",
        body: "Pide a otra persona que dibuje un cuadrado siguiendo tus instrucciones, sin mostrarle el dibujo. Si no indicas cuánto avanzar o cuánto girar, puede obtener otra figura. Depurar un programa consiste en localizar diferencias de ese tipo entre la tarea que queríamos resolver y las instrucciones que realmente escribimos.",
      },
    ],
    quiz: {
      question:
        "Un programa recibe 23 y 19, los suma y escribe 42. ¿Cuál es la salida?",
      options: ["23 y 19", "La operación de sumar", "42"],
      answer: 2,
      explanation:
        "El programa recibe 23 y 19 como entrada. Después de sumarlos entrega 42; ese resultado es la salida.",
    },
    problemId: "hola-morelos",
  },
  {
    id: "tu-primer-programa",
    level: "inicio",
    title: "Tu primer programa en C++",
    description:
      "Lee la estructura de un programa, ejecútalo y distingue errores de escritura y de cálculo.",
    minutes: 12,
    sections: [
      {
        title: "Dónde empieza el programa",
        body: "Este programa escribe dos líneas: Estoy aprendiendo C++ y Un paso a la vez. #include <iostream> permite usar entrada y salida; using namespace std evita escribir std:: antes de cout. La ejecución comienza en main y sigue las instrucciones entre sus llaves. return 0 indica una terminación normal; ese cero no se imprime.",
        code: cpp(String.raw`    cout << "Estoy aprendiendo C++" << '\n';
    cout << "Un paso a la vez" << '\n';`),
      },
      {
        title: "Qué hace el compilador",
        body: "El código fuente es el texto que escribes. El compilador lo transforma en un programa ejecutable y rechaza ciertas construcciones inválidas, como un nombre cou que no existe en lugar de cout. Que compile no demuestra que resuelva la tarea: una multiplicación puede estar bien escrita aunque el problema pidiera una suma.",
      },
      {
        title: "Comparar dos versiones",
        body: "Abre el ejemplo con Probar código y ejecútalo sin entrada. Cambia solo el primer mensaje: la segunda línea debe mantenerse. Después quita un punto y coma, observa el diagnóstico y repónlo. Puedes hacer lo mismo con una comilla. Revisa el primer error y también la línea anterior: una comilla ausente puede hacer que el compilador interprete mal lo que viene después.\n\nEl borrador se guarda en este navegador. Descargar .cpp permite conservar una copia fuera de él.",
      },
      {
        title: "Texto, nombres y separadores",
        body: "C++ distingue mayúsculas: main no es Main y cout no es Cout. Las comillas dobles delimitan texto, y el punto y coma termina muchas instrucciones. Dentro de un mensaje, \\n produce un salto de línea. Los espacios fuera de las comillas suelen servir para acomodar el código; los que imprimes sí forman parte de la respuesta.\n\nPuedes escribir dos líneas con dos instrucciones o con dos saltos dentro de un mensaje. Añadir una etiqueta como La respuesta es cambia la salida si el problema solo pide un número.",
      },
    ],
    quiz: {
      question: "¿Qué hace el compilador?",
      options: [
        "Adivina qué respuesta quería el problema",
        "Traduce el código fuente a un programa ejecutable",
        "Garantiza que el algoritmo sea correcto",
      ],
      answer: 1,
      explanation:
        "El compilador transforma el texto fuente y detecta ciertas construcciones inválidas. No sabe si elegiste sumar o multiplicar según lo que pedía el problema.",
    },
    problemId: "hola-morelos",
  },
  {
    id: "entrada-y-salida",
    level: "inicio",
    title: "Entrada y salida con cin y cout",
    description: "Lee los datos de una prueba y muestra el resultado sin cambiar el programa.",
    minutes: 14,
    sections: [
      {
        title: "Leer dos números y sumarlos",
        body: "El programa recibe dos enteros. cin >> a >> b guarda el primero en a y el segundo en b; después cout muestra a + b. No imprime una pregunta para pedirlos porque el problema ya proporciona la entrada. La salida debe contener únicamente lo solicitado.",
        code: cpp(String.raw`    int a, b;
    cin >> a >> b;
    cout << a + b << '\n';`),
      },
      {
        title: "Seguir los valores leídos",
        body: "Con 8 5, las variables guardan ocho y cinco y la suma produce trece. Con 2 9, el mismo código produce once. Al leer números con cin, espacios y saltos de línea funcionan como separadores: escribir 8 y 5 en dos líneas no cambia la secuencia de valores recibidos.",
      },
      {
        title: "Probar otra entrada",
        body: "Abre el ejemplo con Probar código, escribe 8 5 en Entrada y ejecuta; espera 13. Luego cambia solo la entrada a 2 9 y espera 11. El código y los datos van en paneles distintos. Escribe todos los valores antes de ejecutar: el laboratorio entrega la entrada completa, sin esperar nuevas respuestas durante la ejecución.",
      },
      {
        title: "Calcular, no memorizar el ejemplo",
        body: "Un programa que siempre escribe 13 coincide con la primera prueba, pero falla con 2 9. El ejemplo del enunciado muestra el formato y un resultado; tu procedimiento debe obtener también los demás. Prepara una entrada pequeña diferente y calcula su salida antes de ejecutar para tener con qué comparar.",
      },
    ],
    quiz: {
      question: "¿Qué imprime el programa del ejemplo si recibe 4 7?",
      options: ["4 7", "11", "a + b"],
      answer: 1,
      explanation:
        "cin guarda 4 en a y 7 en b. La expresión a + b calcula 11 antes de imprimirlo.",
    },
    problemId: "mochilas-del-equipo",
  },
  {
    id: "variables-y-operaciones",
    level: "inicio",
    title: "Variables y operaciones",
    description:
      "Usa variables enteras, asignaciones, cocientes y residuos.",
    minutes: 16,
    sections: [
      {
        title: "Guardar y actualizar un valor",
        body: "int dias = 7 crea una variable entera llamada dias y guarda siete. El signo = asigna: primero calcula lo que hay a la derecha y luego reemplaza el valor de la izquierda. Por eso puntos = puntos + 1 usa la cantidad anterior para obtener la nueva. El nombre debe indicar qué cantidad guarda.",
      },
      {
        title: "Grupos completos y sobrantes",
        body: "Para repartir 17 personas en equipos de cinco, 17 / 5 da tres equipos completos y 17 % 5 da dos personas restantes. La división de enteros no conserva decimales. Los operadores +, -, * y / permiten sumar, restar, multiplicar y dividir; % calcula el residuo de la división entera.",
        code: cpp(String.raw`    int personas = 17;
    int porEquipo = 5;
    cout << personas / porEquipo << '\n';
    cout << personas % porEquipo << '\n';`),
      },
      {
        title: "Revisar el tamaño de la operación",
        body: "En entornos habituales, int llega aproximadamente a dos mil millones; long long permite enteros mayores. Si a y b son int, a * b puede desbordarse antes de guardarse en una variable más amplia. 1LL * a * b realiza la multiplicación con long long desde el principio.\n\nNo dividas entre cero. Usa paréntesis cuando necesites cambiar o aclarar el orden de las operaciones.",
      },
    ],
    quiz: {
      question: "Tienes 23 lápices y cada paquete contiene 6. ¿Cuántos sobran?",
      options: ["3", "5", "6"],
      answer: 1,
      explanation:
        "23 / 6 da 3 paquetes completos y 23 % 6 da 5 lápices restantes: 23 = 3 × 6 + 5.",
    },
    problemId: "equipos-completos",
  },
  {
    id: "tu-primer-problema",
    level: "inicio",
    title: "Resolver un problema completo",
    description: "Del enunciado a una solución comprobada: datos, procedimiento, código y pruebas.",
    minutes: 12,
    sections: [
      {
        title: "Separar la historia de la cuenta",
        body: "Un grupo trae a mochilas y otro trae b. Para saber cuántas llegaron, basta sumar a + b; no necesitamos representar a cada persona ni cada mochila. Antes de escribir código, identifica las cantidades recibidas, el resultado pedido y los límites que pueden tomar esos datos.",
      },
      {
        title: "Escribir el procedimiento",
        body: "Para las mochilas, el plan es leer a y b, calcular a + b y mostrarlo. Con doce y nueve esperamos veintiuna. Escribe esa cuenta antes de programarla. Si una tarea más grande no se puede explicar todavía con pocos datos, vuelve al enunciado y decide qué operación falta.",
      },
      {
        title: "Elegir pruebas que distingan errores",
        body: "Prueba 0 + 0, un dato pequeño junto a uno grande y los máximos permitidos. Calcula cada respuesta antes de ejecutar. Si falla, guarda entrada, salida esperada y salida obtenida. Esa prueba permite revisar el cálculo o pedir una pista sobre un fallo concreto, en lugar de describirlo solo como “no funciona”.",
      },
    ],
    quiz: {
      question: "Tu programa pasa el ejemplo del enunciado. ¿Qué sigue?",
      options: [
        "Probar otros casos y revisar que la idea cubra todos los datos permitidos",
        "Suponer que ya es correcto para cualquier entrada",
        "Cambiar la respuesta para que siempre sea igual al ejemplo",
      ],
      answer: 0,
      explanation:
        "Prueba entradas distintas y calcula sus respuestas antes de ejecutar. Los casos de frontera pueden revelar un fallo; el argumento del algoritmo debe explicar también los casos que no ejecutaste.",
    },
    problemId: "mochilas-del-equipo",
  },
  {
    id: "condicionales",
    level: "fundamentos",
    title: "Condiciones con if y else",
    description: "Decide qué instrucciones ejecutar según una comparación o varios requisitos.",
    minutes: 15,
    sections: [
      {
        title: "El caso de sesenta puntos",
        body: "Un taller permite pasar con al menos sesenta puntos. if ejecuta su bloque cuando puntos >= 60 es verdadero; else cubre el caso contrario. La igualdad está incluida. Usar puntos > 60 rechazaría exactamente sesenta aunque los valores mayores funcionaran.",
        code: cpp(String.raw`    int puntos;
    cin >> puntos;
    if (puntos >= 60) {
        cout << 1 << '\n';
    } else {
        cout << 0 << '\n';
    }`),
      },
      {
        title: "Escribir una condición compuesta",
        body: "== compara igualdad y != diferencia. < y > son comparaciones estrictas; <= y >= incluyen el límite. Una sola = asigna un valor. Para exigir dos requisitos usa &&; con || basta que alguno se cumpla. Así, edad >= 12 && edad <= 18 acepta las edades del intervalo completo, incluidos ambos extremos.",
      },
      {
        title: "Probar dónde cambia la respuesta",
        body: "Con el límite sesenta, prueba 59, 60 y 61. Los tres resultados muestran si la igualdad quedó en el caso correcto. Si el programa tiene varias ramas, busca un ejemplo que llegue a cada una. Para reconocer números pares, comprueba si x % 2 == 0: la división entre dos no deja residuo.",
      },
    ],
    quiz: {
      question: "¿Qué condición comprueba que x sea un número par?",
      options: ["x / 2 == 0", "x % 2 == 0", "x = 2"],
      answer: 1,
      explanation:
        "Un número es par cuando al dividirlo entre 2 su residuo es cero.",
    },
    problemId: "pase-al-taller",
  },
  {
    id: "ciclos",
    level: "fundamentos",
    title: "Repeticiones con ciclos",
    description:
      "Cuenta vueltas y acumula datos sin duplicar instrucciones.",
    minutes: 20,
    sections: [
      {
        title: "Qué se repite en un for",
        body: "Si llegan n números, necesitamos n lecturas. for (int i = 0; i < n; ++i) empieza con i igual a cero, comprueba la condición y aumenta i después de cada vuelta. Para n = 3 visita 0, 1 y 2. No ejecuta una vuelta con i = 3 porque 3 < 3 es falso.",
      },
      {
        title: "Contar no es sumar los valores",
        body: "El ejemplo cuenta días con al menos treinta minutos de práctica. El contador empieza en cero y aumenta uno cuando el dato cumple la condición. Un acumulador tendría otra función: sumar los minutos recibidos. Ambos cambian durante el recorrido, pero representan cantidades distintas y no se actualizan con la misma operación.",
        code: cpp(String.raw`    int n;
    cin >> n;
    int dias = 0;
    for (int i = 0; i < n; ++i) {
        int minutos;
        cin >> minutos;
        if (minutos >= 30) ++dias;
    }
    cout << dias << '\n';`),
      },
      {
        title: "Comprobar el inicio y la salida",
        body: "Con i <= n harías una vuelta extra. En un while, olvidar el cambio de la variable puede impedir que la condición se vuelva falsa. Prueba n = 1 y anota el estado antes y después de la vuelta. Si solo necesitas una suma o un conteo, puedes procesar cada dato al leerlo sin guardar toda la lista.",
      },
    ],
    quiz: {
      question: "¿Cuántas veces se ejecuta for (int i = 0; i < 4; ++i)?",
      options: ["3", "4", "5"],
      answer: 1,
      explanation: "i toma los valores 0, 1, 2 y 3. Son cuatro iteraciones.",
    },
    problemId: "dias-de-practica",
  },
  {
    id: "arreglos",
    level: "fundamentos",
    title: "Arreglos y posiciones",
    description:
      "Guarda datos en un vector y recórrelos sin salir de sus posiciones válidas.",
    minutes: 20,
    sections: [
      {
        title: "El tamaño y el último índice",
        body: "vector<int> a(n) guarda n enteros. La primera posición es a[0] y la última a[n - 1]. Si hay cinco casillas, sus etiquetas son 0, 1, 2, 3 y 4; a[5] no existe. El índice indica dónde consultar, mientras que el contenido es el valor almacenado allí.",
      },
      {
        title: "Guardar un máximo provisional",
        body: "Para buscar el mayor, toma el primer dato como candidato y compáralo con cada valor posterior. Reemplázalo solo si encuentras uno mayor. Con -8, -3 y -5 termina en -3. Iniciar en cero daría una respuesta que ni siquiera pertenece a la lista. El programa supone n >= 1.",
        code: cpp(
          String.raw`    int n;
    cin >> n;
    vector<int> a(n);
    for (int i = 0; i < n; ++i) cin >> a[i];
    int mayor = a[0];
    for (int i = 1; i < n; ++i) {
        if (a[i] > mayor) mayor = a[i];
    }
    cout << mayor << '\n';`,
          ["vector"],
        ),
      },
      {
        title: "Cuándo conservar la lista",
        body: "Si únicamente quieres el máximo, puedes mantener el candidato mientras lees y descartar cada dato anterior. Guardar el vector sirve si después necesitas ordenar, consultar posiciones o hacer otro recorrido. Elige según esas consultas: conservar más datos ocupa memoria, pero perderlos impide responder preguntas que dependan de ellos.",
      },
    ],
    quiz: {
      question:
        "Un vector tiene 6 elementos. ¿Cuál es su último índice válido?",
      options: ["5", "6", "7"],
      answer: 0,
      explanation: "Los índices comienzan en cero: 0, 1, 2, 3, 4 y 5.",
    },
    problemId: "temperaturas-de-morelos",
  },
  {
    id: "cadenas",
    level: "fundamentos",
    title: "Cadenas de caracteres",
    description: "Lee palabras o líneas y recorre sus caracteres con string.",
    minutes: 16,
    sections: [
      {
        title: "Posiciones de una palabra",
        body: "Si un string contiene \"morelos\", palabra[0] es el carácter m y palabra.size() vale siete. Las posiciones empiezan en cero, como en un vector. Las comillas dobles escriben una cadena y las simples un carácter. Podemos recorrer esa colección para contar letras o construir otro texto.",
      },
      {
        title: "Contar apariciones de una letra",
        body: "for (char letra : palabra) recibe cada carácter de la cadena. El programa aumenta un contador cuando letra es a. Para banana encuentra tres. A mayúscula es otro carácter y no cumple esa comparación. La condición debe corresponder exactamente a las letras que pide contar el problema.",
        code: cpp(
          String.raw`    string palabra;
    cin >> palabra;
    int cantidad = 0;
    for (char letra : palabra) {
        if (letra == 'a') ++cantidad;
    }
    cout << cantidad << '\n';`,
          ["string"],
        ),
      },
      {
        title: "Leer hasta un espacio o hasta el fin de línea",
        body: "cin >> palabra lee una palabra, mientras que getline(cin, linea) conserva los espacios internos de la línea. Después de leer un número puede quedar pendiente un salto de línea. getline(cin >> ws, linea) consume primero los espacios iniciales; úsalo solo si esos espacios no pertenecen a la información que debes conservar.",
      },
    ],
    quiz: {
      question: 'Si palabra es "Morelos", ¿qué contiene palabra[1]?',
      options: ["M", "o", "r"],
      answer: 1,
      explanation: "El índice 0 contiene M y el índice 1 contiene o.",
    },
  },
  {
    id: "funciones",
    level: "fundamentos",
    title: "Funciones y resultados",
    description:
      "Define una tarea, pásale sus datos y utiliza el resultado que devuelve.",
    minutes: 18,
    sections: [
      {
        title: "Una tarea que recibe un entero",
        body: "bool esPar(int x) recibe un número y responde verdadero o falso según su paridad. Es una función: reúne instrucciones para una tarea y permite llamarlas con distintos datos. Su nombre y sus parámetros deben dejar claro qué calcula, para poder comprobarla sin recorrer todo el programa.",
      },
      {
        title: "Seguir una llamada",
        body: "En este programa, esPar se define antes de main. Cuando main llama esPar(numero), el valor de numero se copia en x. La función calcula su respuesta y return la devuelve, terminando esa llamada. Después continúa main desde el lugar que usó el resultado; el return de esPar no termina todo el programa.",
        code: String.raw`#include <iostream>
using namespace std;

bool esPar(int x) {
    return x % 2 == 0;
}

int main() {
    int numero;
    cin >> numero;
    cout << (esPar(numero) ? 1 : 0) << '\n';
    return 0;
}`,
      },
      {
        title: "Leer el contrato de la función",
        body: "El contrato aquí es “recibe un entero y devuelve si es par”. Pasar los datos como parámetros hace visible esa dependencia. El ejemplo también usa condición ? valorSiVerdadero : valorSiFalso, que elige uno de dos valores. Esa elección usa la respuesta de esPar para decidir qué mostrar, sin confundir devolver con imprimir.",
      },
    ],
    quiz: {
      question: "¿Qué hace return dentro de una función?",
      options: [
        "Repite la función",
        "Termina esa llamada y puede devolver un resultado",
        "Borra todas las variables del programa",
      ],
      answer: 1,
      explanation:
        "return termina la llamada actual y devuelve el control a quien la hizo. Puede entregar un resultado para seguir calculando. En main, return termina normalmente el programa.",
    },
  },
  {
    id: "pensar-en-algoritmos",
    level: "algoritmos",
    title: "De una idea a un algoritmo",
    description: "Define un procedimiento, comprueba qué mantiene y busca entradas que puedan refutarlo.",
    minutes: 18,
    sections: [
      {
        title: "Una solución que puedes comprobar",
        body: "Para saber si aparece un número en una lista, recorre sus elementos y compara cada uno con el objetivo. Es una solución directa que permite comprobar casos pequeños. Si los límites exigen algo más rápido, úsala como referencia para revisar la nueva idea sin perder de vista qué respuesta debe producir.",
      },
      {
        title: "Lo que sigue siendo cierto tras cada vuelta",
        body: "Al buscar el máximo, después de procesar i datos, mayor debe ser el máximo de esos i datos. Esa afirmación es una invariante. Comprueba que sea cierta al iniciar, que cada actualización la conserve y que al terminar exprese lo que pide el problema. Así justificas todas las vueltas, no solo una ejecución dibujada.",
      },
      {
        title: "Una entrada que demuestra un fallo",
        body: "Para detectar repetidos en una lista sin ordenar, comparar solo vecinos falla con 4, 7, 4. Los dos cuatros no quedan juntos. Ese contraejemplo basta para descartar la regla, aunque otras pruebas hayan pasado. Cuando una idea depende de una suposición, busca una entrada permitida que no la cumpla.",
      },
    ],
    quiz: {
      question:
        "¿Qué demuestra la lista 4, 7, 4 sobre buscar repetidos comparando sólo vecinos?",
      options: [
        "Que siempre funciona",
        "Que puede fallar aunque haya repetidos",
        "Que no existen repetidos",
      ],
      answer: 1,
      explanation:
        "Los dos cuatros no son vecinos. Por eso una comparación sólo entre vecinos no detecta esa repetición sin ordenar antes.",
    },
    problemId: "temperaturas-de-morelos",
  },
  {
    id: "complejidad",
    level: "algoritmos",
    title: "Tiempo y memoria de un algoritmo",
    description: "Estima cómo crecen las operaciones y los datos guardados al aumentar la entrada.",
    minutes: 20,
    sections: [
      {
        title: "Contar trabajo con el tamaño de entrada",
        body: "Llamemos n a la cantidad de datos. Un recorrido hace unas n visitas; comparar cada dato con todos puede hacer n². Para cien mil elementos, son cien mil frente a diez mil millones. Los ejemplos pequeños ocultan esa diferencia, así que la estimación debe usar los límites máximos del problema.",
      },
      {
        title: "Qué expresa la notación O",
        body: "O(n) indica crecimiento lineal y O(n²), cuadrático. Dos recorridos consecutivos hacen cerca de 2n operaciones y siguen siendo O(n). Descartar aproximadamente media búsqueda cada vez suele dar O(log n). Estas expresiones no son segundos: el equipo, el lenguaje y el costo de cada operación también afectan el tiempo real.",
      },
      {
        title: "Hacer una cuenta separada de memoria",
        body: "Guardar n enteros usa O(n) memoria. Conservar solo una suma y el dato recién leído requiere O(1) espacio adicional. Revisa todo el procedimiento, incluidos los ciclos internos y los datos temporales. Una solución puede reducir tiempo a cambio de guardar información, por lo que conviene escribir ambas cuentas antes de elegirla.",
      },
    ],
    quiz: {
      question:
        "Al duplicar n, ¿cómo crece aproximadamente el trabajo de una solución O(n²)?",
      options: ["Se mantiene igual", "Se duplica", "Se multiplica por cuatro"],
      answer: 2,
      explanation:
        "(2n)² = 4n². Esta comparación describe el crecimiento dominante, no un tiempo exacto de ejecución.",
    },
  },
  {
    id: "ordenamiento",
    level: "algoritmos",
    title: "Ordenamiento con sort",
    description: "Ordena datos para consultar posiciones o comparar valores vecinos.",
    minutes: 20,
    sections: [
      {
        title: "Lo que cambia al ordenar",
        body: "Ordenar de menor a mayor coloca juntos los valores iguales. El primer dato es el mínimo, el último el máximo y cada posición permite consultar un valor por su rango. Si el problema también necesita las posiciones originales, guarda el índice junto a cada valor antes de cambiar el orden.",
      },
      {
        title: "La posición del k-ésimo menor",
        body: "Con <algorithm>, sort(a.begin(), a.end()) ordena todo el vector de forma ascendente. Si k se cuenta desde uno, consulta a[k - 1]. Las copias de un valor ocupan posiciones diferentes: en 2, 2, 9, el segundo menor es dos. Debe cumplirse 1 <= k <= n antes de acceder.",
        code: cpp(
          String.raw`    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    sort(a.begin(), a.end());
    cout << a[k - 1] << '\n';`,
          ["vector", "algorithm"],
        ),
      },
      {
        title: "Incluir el costo de ordenar",
        body: "sort usa O(n log n) comparaciones. Después, contar valores distintos comparando vecinos cuesta O(n), y una búsqueda binaria cuesta O(log n). El costo previo no desaparece al añadir esas operaciones. Si solo necesitas hallar el máximo una vez, una vuelta de O(n) evita ordenar toda la lista.",
      },
    ],
    quiz: {
      question: "En la lista ordenada 3, 3, 8, 12, ¿cuál es el tercer menor?",
      options: ["3", "8", "12"],
      answer: 1,
      explanation:
        "Contando posiciones desde uno: el primero es 3, el segundo es 3 y el tercero es 8.",
    },
    problemId: "tiempos-del-equipo",
  },
  {
    id: "busqueda-binaria",
    level: "algoritmos",
    title: "Búsqueda binaria en una lista ordenada",
    description:
      "Mantén un intervalo de candidatos y descarta una mitad con cada comparación.",
    minutes: 25,
    sections: [
      {
        title: "Descartar una mitad con una comparación",
        body: "Buscas diecisiete en una lista ascendente. Si el centro vale diez, también todos los datos a su izquierda son menores que diecisiete. Puedes descartarlos junto con ese diez. Si el centro vale veinticinco, descarta la derecha. El orden justifica cada descarte; sin él, no sabríamos qué valores contiene la otra mitad.",
      },
      {
        title: "Encontrar el primero que alcanza x",
        body: "El programa encuentra la primera posición con valor mayor o igual que x. Mantiene [izq, der), incluyendo izq y excluyendo der. Si a[medio] < x, la respuesta debe ir después; si no, medio sigue siendo candidato. Al terminar, izq puede valer n, indicando que todos los elementos eran menores.",
        code: cpp(
          String.raw`    int n, x;
    cin >> n >> x;
    vector<int> a(n);
    for (int &valor : a) cin >> valor;
    // La entrada debe estar ordenada de menor a mayor.
    int izq = 0, der = n;
    while (izq < der) {
        int medio = izq + (der - izq) / 2;
        if (a[medio] < x) izq = medio + 1;
        else der = medio;
    }
    if (izq < n && a[izq] == x) cout << izq << '\n';
    else cout << -1 << '\n';`,
          ["vector"],
        ),
      },
      {
        title: "Probar límites y contar comparaciones",
        body: "Prueba un objetivo menor que todos, uno mayor, uno repetido y uno ausente entre dos valores. Cada comparación reduce el intervalo aproximadamente a la mitad, por eso la búsqueda cuesta O(log n); leer los datos sigue costando O(n). lower_bound ofrece esta misma consulta en la biblioteca. Verifica su resultado antes de usarlo como una posición existente.",
      },
    ],
    quiz: {
      question:
        "¿Qué condición necesita esta búsqueda binaria sobre una lista?",
      options: [
        "Que todos los valores sean distintos",
        "Que la lista esté ordenada",
        "Que tenga un número par de elementos",
      ],
      answer: 1,
      explanation:
        "El orden permite descartar una mitad con seguridad. Los valores pueden repetirse y la cantidad de elementos puede ser cualquiera.",
    },
  },
  {
    id: "sumas-de-prefijos",
    level: "algoritmos",
    title: "Sumas de prefijos",
    description: "Prepara sumas acumuladas para contestar intervalos con una resta.",
    minutes: 25,
    sections: [
      {
        title: "Preparar lo que se repite entre consultas",
        body: "En 4, 2, 5 y 1 queremos responder varias sumas de intervalos. Recorrer cada intervalo puede repetir muchas adiciones. Guarda pref[i], la suma de los primeros i elementos: pref[0] = 0 y pref[i + 1] = pref[i] + a[i]. Obtenemos 0, 4, 6, 11 y 12. Hay n + 1 prefijos porque también representamos no tomar ningún elemento.",
      },
      {
        title: "Restar la parte anterior al intervalo",
        body: "Con posiciones del problema desde uno e intervalo inclusivo [L,R], pref[R] contiene todo hasta R. pref[L - 1] contiene exactamente lo anterior a L. Al restarlos queda pref[R] - pref[L - 1]. Para posiciones dos a tres, 11 - 4 = 7, que corresponde a 2 + 5. La cancelación también funciona con negativos.",
        code: cpp(
          String.raw`    int n, q;
    cin >> n >> q;
    vector<long long> pref(n + 1, 0);
    for (int i = 1; i <= n; ++i) {
        long long x;
        cin >> x;
        pref[i] = pref[i - 1] + x;
    }
    while (q--) {
        int L, R;
        cin >> L >> R;
        cout << pref[R] - pref[L - 1] << '\n';
    }`,
          ["vector"],
        ),
      },
      {
        title: "Cuándo compensa preparar los prefijos",
        body: "Construir la tabla requiere O(n) tiempo y memoria. Cada consulta usa una resta, O(1), así que q consultas cuestan O(n + q) en total. La lista debe permanecer fija. Si modificas un elemento, todos los prefijos que lo incluyen pueden cambiar; la tabla anterior ya no representa las sumas de la lista actual.",
      },
    ],
    quiz: {
      question:
        "Si pref = [0, 4, 6, 11, 12], ¿cuánto suman las posiciones 2 a 4, incluidas?",
      options: ["12", "8", "6"],
      answer: 1,
      explanation: "pref[4] - pref[1] = 12 - 4 = 8. Son los valores 2 + 5 + 1.",
    },
    problemId: "minutos-por-etapa",
  },
  {
    id: "busqueda-exhaustiva",
    level: "olimpiada",
    title: "Búsqueda exhaustiva",
    description: "Genera todas las opciones permitidas y comprueba cuáles cumplen la condición.",
    minutes: 22,
    sections: [
      {
        title: "Revisar parejas de posiciones",
        body: "Para contar parejas con valores iguales, podemos comparar cada par de casillas. Exige i < j: así no eliges una casilla consigo misma ni cuentas dos órdenes de la misma pareja. Este recorrido es una búsqueda exhaustiva porque considera todas las opciones permitidas antes de decidir cuáles sirven.",
        code: cpp(
          String.raw`    int n;
    cin >> n;
    vector<int> a(n);
    for (int &x : a) cin >> x;
    long long parejas = 0;
    for (int i = 0; i < n; ++i) {
        for (int j = i + 1; j < n; ++j) {
            if (a[i] == a[j]) ++parejas;
        }
    }
    cout << parejas << '\n';`,
          ["vector"],
        ),
      },
      {
        title: "Cuántas opciones hay que revisar",
        body: "El programa visita n(n - 1)/2 parejas, de modo que tarda O(n²). Para n = 100 son 4 950; para n = 200000, casi veinte mil millones. Si cada objeto puede elegirse o no, aparecen 2ⁿ subconjuntos. Cuenta ese espacio antes de añadir ciclos o ramas: la corrección por sí sola no garantiza que alcance el tiempo.",
      },
      {
        title: "Usar una solución pequeña como referencia",
        body: "Una búsqueda lenta y correcta permite comprobar un método rápido con entradas pequeñas. También puede resolver subtareas de menor tamaño si el concurso las ofrece. Justifica que la enumeración cubre todas las opciones y no repite respuestas: revisar mucho no compensa una generación que dejó posibilidades fuera.",
      },
    ],
    quiz: {
      question: "¿Por qué empezamos j en i + 1 al revisar parejas?",
      options: [
        "Para contar sólo parejas de posiciones diferentes, una vez cada una",
        "Para saltarnos todas las parejas iguales",
        "Para que el algoritmo sea O(n)",
      ],
      answer: 0,
      explanation:
        "i < j evita emparejar un elemento consigo mismo y evita contar tanto (i, j) como (j, i).",
    },
  },
  {
    id: "voraces",
    level: "olimpiada",
    title: "Algoritmos voraces y argumentos de intercambio",
    description:
      "Comprueba cuándo una decisión local conserva una solución óptima.",
    minutes: 24,
    sections: [
      {
        title: "Elegir el taller que termina primero",
        body: "Varios talleres ocupan intervalos de tiempo y todos cuentan igual. Queremos asistir a la mayor cantidad sin traslapes. Una regla voraz elige el que termina primero entre los compatibles y continúa sin deshacer esa elección. El procedimiento es corto; falta explicar por qué no pierde una selección mejor.",
      },
      {
        title: "Cambiar una solución sin empeorarla",
        body: "Supón que una solución óptima empieza con otro taller. Sustituye ese primero por el que termina antes. Queda libre al menos el mismo tiempo, por lo que los talleres posteriores siguen cabiendo. El intercambio conserva su cantidad. Podemos repetir el razonamiento con las actividades compatibles que quedan después de la primera elección.",
      },
      {
        title: "Una regla parecida puede fallar",
        body: "Con monedas de uno, tres y cuatro, tomar la mayor primero paga seis con 4 + 1 + 1. Pero 3 + 3 utiliza solo dos monedas. La regla voraz no es universal: depende del problema y su objetivo. Antes de adoptarla, busca un contraejemplo y un argumento que conserve alguna solución óptima tras cada elección.",
      },
    ],
    quiz: {
      question: "Con monedas de 1, 3 y 4, ¿cuál es el mínimo para pagar 6?",
      options: [
        "Dos monedas: 3 + 3",
        "Tres monedas: 4 + 1 + 1",
        "Seis monedas: 1 + 1 + 1 + 1 + 1 + 1",
      ],
      answer: 0,
      explanation:
        "Dos monedas bastan y una sola no puede valer 6. Este caso muestra que elegir siempre la mayor moneda puede fallar.",
    },
    problemId: "monedas-del-recreo",
  },
  {
    id: "programacion-dinamica",
    level: "olimpiada",
    title: "Programación dinámica para monedas",
    description:
      "Calcula mínimos para cantidades pequeñas y reutilízalos al resolver las siguientes.",
    minutes: 30,
    sections: [
      {
        title: "Qué guarda cada respuesta",
        body: "Con monedas de uno, tres y cuatro, queremos pagar exactamente una cantidad usando el menor número de monedas. Define dp[s] como ese mínimo para s. dp[0] = 0 porque no hace falta ninguna moneda para pagar cero. Resolveremos cantidades crecientes para usar respuestas ya conocidas al calcular la siguiente.",
      },
      {
        title: "Elegir la última moneda",
        body: "Si la última moneda es c, antes pagamos s - c. Esa opción cuesta dp[s - c] + 1 monedas. Revisa todas las c que caben y toma el mínimo. El orden creciente asegura que las cantidades menores ya estén resueltas. Inicializa lo pendiente con un valor mayor que cualquier respuesta posible para que una opción válida lo reemplace.",
        code: cpp(
          String.raw`    int n;
    cin >> n;
    vector<int> dp(n + 1, n + 1);
    dp[0] = 0;
    int monedas[] = {1, 3, 4};
    for (int s = 1; s <= n; ++s) {
        for (int c : monedas) {
            if (c <= s) dp[s] = min(dp[s], dp[s - c] + 1);
        }
    }
    cout << dp[n] << '\n';`,
          ["vector", "algorithm"],
        ),
      },
      {
        title: "La cuenta para seis y su justificación",
        body: "De cero a seis, la tabla vale 0, 1, 2, 1, 1, 2, 2. Para seis, elegir tres al final da dp[3] + 1 = 2. Toda solución termina con alguna moneda permitida y revisamos todas, así que no omitimos una respuesta mejor. Con tres denominaciones fijas, calcular hasta n usa O(n) tiempo y memoria.",
      },
    ],
    quiz: {
      question: "¿Por qué dp[0] vale cero?",
      options: [
        "Porque pagar cero requiere cero monedas",
        "Porque todos los valores de la tabla deben ser cero",
        "Porque la moneda de cero es la más pequeña",
      ],
      answer: 0,
      explanation:
        "La base representa una tarea ya resuelta: no necesitas ninguna moneda para sumar cero.",
    },
    problemId: "monedas-del-recreo",
  },
  {
    id: "grafos",
    level: "olimpiada",
    title: "Grafos y búsqueda en anchura",
    description: "Representa conexiones y encuentra distancias cuando cada arista cuesta un paso.",
    minutes: 30,
    sections: [
      {
        title: "Guardar los pasillos de un campus",
        body: "Los salones serán vértices y los pasillos, aristas. Si puedes recorrer un pasillo en ambos sentidos, registra cada extremo entre los vecinos del otro. Esa lista de adyacencia guarda las conexiones existentes sin reservar una casilla para cada pareja de salones. El modelo debe conservar la dirección real de las conexiones.",
      },
      {
        title: "Procesar primero las distancias menores",
        body: "BFS, o búsqueda en anchura, usa una cola: lo que entra primero sale primero. Desde un origen, descubre lugares a un paso antes que los de dos, y así sucesivamente. Cuando todas las aristas cuestan un paso, la primera distancia descubierta es mínima, porque cualquier recorrido más corto habría llegado desde una capa anterior.",
        code: cpp(
          String.raw`    int n, m;
    cin >> n >> m;
    vector<vector<int>> vecinos(n + 1);
    for (int i = 0; i < m; ++i) {
        int a, b;
        cin >> a >> b;
        vecinos[a].push_back(b);
        vecinos[b].push_back(a);
    }
    vector<int> distancia(n + 1, -1);
    queue<int> pendientes;
    distancia[1] = 0;
    pendientes.push(1);
    while (!pendientes.empty()) {
        int actual = pendientes.front();
        pendientes.pop();
        for (int siguiente : vecinos[actual]) {
            if (distancia[siguiente] == -1) {
                distancia[siguiente] = distancia[actual] + 1;
                pendientes.push(siguiente);
            }
        }
    }
    cout << distancia[n] << '\n';`,
          ["vector", "queue"],
        ),
      },
      {
        title: "Evitar visitas repetidas",
        body: "Usamos distancia -1 para un vértice no descubierto. Al agregarlo a la cola, asigna su distancia; no esperes a sacarlo, porque otro vecino podría agregarlo otra vez. Cada vértice se procesa una vez y las aristas se revisan por sus extremos: O(n + m). Con costos distintos, pocas aristas no implican menor costo y esta garantía de BFS deja de servir.",
      },
    ],
    quiz: {
      question: "¿Cuándo garantiza BFS la menor cantidad de pasos?",
      options: [
        "Cuando cada arista representa un paso del mismo costo",
        "Cuando los caminos tienen cualquier costo",
        "Sólo cuando todos los vértices tienen dos vecinos",
      ],
      answer: 0,
      explanation:
        "BFS recorre por número de aristas. Esa cantidad coincide con el costo sólo cuando todas las aristas tienen el mismo costo.",
    },
    problemId: "rutas-del-campus",
  },
  {
    id: "preparar-concurso",
    level: "olimpiada",
    title: "Preparar y revisar un simulacro",
    description:
      "Elige problemas, distribuye el tiempo y revisa las causas de los errores.",
    minutes: 15,
    sections: [
      {
        title: "Elegir por dónde comenzar",
        body: "Lee los problemas del ensayo y distingue qué entiendes, qué límites tienen y si ofrecen subtareas. Empieza por una solución que puedas explicar y completar. Si te detienes, escribe qué sabes y qué falta antes de cambiar de problema. Esa nota permite regresar sin rehacer la lectura ni perder la idea que ya tenías.",
      },
      {
        title: "Comprobar antes de enviar",
        body: "Revisa formato, tipos numéricos, posiciones válidas y cantidad de operaciones. Prueba el tamaño mínimo y un límite donde cambie la respuesta. Si falla, reduce la entrada hasta poder seguirla a mano. Durante un simulacro usa las herramientas acordadas; para un evento real, los recursos permitidos los establece su convocatoria vigente.",
      },
      {
        title: "Registrar la causa del error",
        body: "Después del intento, anota la idea, la ayuda usada, el fallo y una prueba que lo muestre. Dos días después, resuelve otra vez sin mirar el código. Si consultaste una solución, cierra la explicación y reconstruye el argumento. Deja también tiempo de descanso: revisar cansado puede ocultar errores que verías con una lectura posterior.",
      },
      {
        title: "Decidir qué estudiar después",
        body: "La ruta cubre herramientas, no todos los problemas que podrían aparecer. El siguiente tema debe responder a una necesidad concreta: representar un árbol, explorar decisiones con recursión, mantener dos punteros o definir un estado de programación dinámica. Comprueba primero que puedas explicar y adaptar las ideas previas; así sabrás qué parte del problema nuevo requiere atención.",
      },
    ],
    quiz: {
      question:
        "Después de estudiar una solución que no encontraste, ¿qué ayuda más a aprender?",
      options: [
        "Copiarla y no volver a verla",
        "Reconstruir la idea sin apuntes y reintentar días después",
        "Memorizar únicamente los nombres de las variables",
      ],
      answer: 1,
      explanation:
        "Cerrar la explicación y reconstruirla obliga a recuperar cada decisión. Repetirla días después con otra entrada comprueba si puedes aplicar la idea sin tener el código delante.",
    },
  },
];

export const foundationProblems: Problem[] = [
  {
    id: "hola-morelos",
    title: "¡Hola, Morelos!",
    level: "inicio",
    difficulty: "Inicial",
    topic: "Salida de datos",
    statement:
      "Escribe un programa que muestre Hola, Morelos! en una línea. El mensaje debe conservar la mayúscula, la coma, el espacio y el signo final.",
    input: "No se proporcionan datos de entrada.",
    output: "Escribe una línea con Hola, Morelos!",
    sampleInput: "",
    sampleOutput: "Hola, Morelos!",
    hint: "Escribe el texto entre comillas dobles en una instrucción cout.",
    explanation:
      "Como el mensaje es fijo, no necesitas variables ni lecturas. cout escribe el texto entre comillas y un salto termina la línea. El signo inicial ¡ del título no pertenece al mensaje solicitado.",
    tests: [{ input: "", output: "Hola, Morelos!" }],
    starter: cpp("    // Escribe aquí tu mensaje de bienvenida."),
    solution: cpp(String.raw`    cout << "Hola, Morelos!" << '\n';`),
  },
  {
    id: "mochilas-del-equipo",
    title: "Mochilas del equipo",
    level: "inicio",
    difficulty: "Inicial",
    topic: "Variables y suma",
    statement:
      "Llegan dos grupos con a y b mochilas, respectivamente. Calcula cuántas mochilas trajeron entre los dos.",
    input: "Recibe dos enteros a y b, con 0 ≤ a, b ≤ 1000, separados por un espacio.",
    output: "Escribe el total de mochilas como un entero.",
    sampleInput: "12 9",
    sampleOutput: "21",
    hint: "Cada mochila pertenece a uno de los dos grupos. ¿Qué operación junta ambas cantidades?",
    explanation:
      "Lee a y b y calcula a + b. Con doce y nueve, la suma es veintiuno. Cada mochila se cuenta una vez, en el grupo que la trajo. Dos lecturas y una suma tienen tiempo O(1) y usan memoria O(1).",
    tests: [
      { input: "12 9", output: "21" },
      { input: "0 0", output: "0" },
      { input: "1000 1000", output: "2000" },
      { input: "0 37", output: "37" },
    ],
    starter,
    solution: cpp(String.raw`    int a, b;
    cin >> a >> b;
    cout << a + b << '\n';`),
  },
  {
    id: "equipos-completos",
    title: "Equipos completos",
    level: "fundamentos",
    difficulty: "Fácil",
    topic: "División y residuo",
    statement:
      "Hay n estudiantes y necesitas equipos de exactamente k integrantes. Forma tantos equipos completos como sea posible y cuenta también los estudiantes que quedan fuera.",
    input: "Recibe n y k, con 0 ≤ n ≤ 1000000 y 1 ≤ k ≤ 1000.",
    output:
      "Escribe el número de equipos completos y el de estudiantes restantes, en ese orden y separados por un espacio.",
    sampleInput: "23 5",
    sampleOutput: "4 3",
    hint: "Divide n entre k para contar equipos completos. El residuo indica los estudiantes que no completan otro.",
    explanation:
      "n / k cuenta los grupos completos y n % k obtiene el sobrante. Con veintitrés estudiantes y equipos de cinco, formas cuatro equipos que usan veinte; quedan tres estudiantes. El sobrante es menor que k, por lo que no alcanza para otro grupo. Tiempo O(1) y memoria O(1).",
    tests: [
      { input: "23 5", output: "4 3" },
      { input: "0 4", output: "0 0" },
      { input: "4 7", output: "0 4" },
      { input: "1000000 1", output: "1000000 0" },
      { input: "36 6", output: "6 0" },
    ],
    starter,
    solution: cpp(String.raw`    int n, k;
    cin >> n >> k;
    cout << n / k << ' ' << n % k << '\n';`),
  },
  {
    id: "pase-al-taller",
    title: "Pase al taller",
    level: "fundamentos",
    difficulty: "Fácil",
    topic: "Condicionales",
    statement:
      "Una actividad se abre al obtener al menos sesenta puntos. Recibes el puntaje p y debes indicar si cumple esa condición.",
    input: "Recibe un entero p entre 0 y 100, incluidos.",
    output: "Escribe 1 si p ≥ 60; escribe 0 en otro caso.",
    sampleInput: "60",
    sampleOutput: "1",
    hint: "Sesenta también debe aceptar la actividad. Elige una comparación que incluya la igualdad.",
    explanation:
      "La condición p >= 60 acepta el límite y todos los valores superiores. Para 59 escribe cero; para 60 y 61, uno. Usar > excluiría incorrectamente sesenta. La comparación tarda O(1) y usa memoria O(1).",
    tests: [
      { input: "60", output: "1" },
      { input: "59", output: "0" },
      { input: "0", output: "0" },
      { input: "100", output: "1" },
    ],
    starter,
    solution: cpp(String.raw`    int p;
    cin >> p;
    cout << (p >= 60 ? 1 : 0) << '\n';`),
  },
  {
    id: "dias-de-practica",
    title: "Días de práctica",
    level: "fundamentos",
    difficulty: "Fácil",
    topic: "Ciclos y conteo",
    statement:
      "Tienes los minutos de práctica de n días. Cuenta cuántos registran al menos k minutos. Los días contados no necesitan ser consecutivos.",
    input:
      "La primera línea contiene n y k, con 1 ≤ n ≤ 100000 y 1 ≤ k ≤ 1440. La siguiente contiene n enteros entre 0 y 1440, uno por día.",
    output:
      "Escribe cuántos días tienen un registro mayor o igual que k.",
    sampleInput: "5 30\n20 45 30 0 60",
    sampleOutput: "3",
    hint: "Empieza un contador en cero. Cada día que cumpla minutos >= k añade una unidad.",
    explanation:
      "Revisa cada duración una vez y aumenta el contador cuando alcance k. En el ejemplo cuentan 45, 30 y 60: son tres días. Tras procesar cada dato, el contador representa los días válidos entre los ya leídos. Tiempo O(n) y memoria adicional O(1), sin guardar la lista.",
    tests: [
      { input: "5 30\n20 45 30 0 60", output: "3" },
      { input: "1 1\n0", output: "0" },
      { input: "4 20\n20 20 20 20", output: "4" },
      { input: "5 1440\n1439 1440 0 1440 700", output: "2" },
    ],
    starter,
    solution: cpp(String.raw`    int n, k;
    cin >> n >> k;
    int respuesta = 0;
    for (int i = 0; i < n; ++i) {
        int minutos;
        cin >> minutos;
        if (minutos >= k) ++respuesta;
    }
    cout << respuesta << '\n';`),
  },
  {
    id: "temperaturas-de-morelos",
    title: "La temperatura más alta",
    level: "fundamentos",
    difficulty: "Fácil",
    topic: "Arreglos y máximos",
    statement:
      "Recibes n temperaturas enteras, que pueden ser negativas. Encuentra el valor más alto de la lista.",
    input:
      "La primera línea contiene n, con 1 ≤ n ≤ 100000. La siguiente contiene n temperaturas enteras entre −100 y 100.",
    output: "Escribe la temperatura más alta como un entero.",
    sampleInput: "5\n18 24 21 28 23",
    sampleOutput: "28",
    hint: "Usa la primera temperatura como candidato y compárala con cada una de las siguientes. Cero puede no aparecer en la lista.",
    explanation:
      "El primer dato es un candidato válido porque n es al menos uno. Reemplázalo cuando llegue uno mayor. Así conservas el máximo de las temperaturas leídas; al terminar es el de toda la lista. Inicializar en cero fallaría si todas fueran negativas. Tiempo O(n) y memoria adicional O(1).",
    tests: [
      { input: "5\n18 24 21 28 23", output: "28" },
      { input: "3\n-8 -3 -5", output: "-3" },
      { input: "1\n-100", output: "-100" },
      { input: "4\n0 0 0 0", output: "0" },
      { input: "3\n100 4 -100", output: "100" },
    ],
    starter,
    solution: cpp(String.raw`    int n;
    cin >> n;
    int mayor;
    cin >> mayor;
    for (int i = 1; i < n; ++i) {
        int temperatura;
        cin >> temperatura;
        if (temperatura > mayor) mayor = temperatura;
    }
    cout << mayor << '\n';`),
  },
  {
    id: "tiempos-del-equipo",
    title: "Tiempos del equipo",
    level: "algoritmos",
    difficulty: "Intermedio",
    topic: "Ordenamiento",
    statement:
      "Conoces los tiempos de n personas y buscas el k-ésimo menor. Cuenta cada aparición: si dos personas tardaron lo mismo, sus tiempos ocupan dos posiciones en la lista ordenada.",
    input:
      "La primera línea contiene n y k, con 1 ≤ k ≤ n ≤ 100000. La siguiente contiene n tiempos enteros entre 1 y 1000000000.",
    output:
      "Escribe el tiempo de la posición k después de ordenar de menor a mayor, contando desde uno.",
    sampleInput: "5 3\n18 9 12 9 25",
    sampleOutput: "12",
    hint: "Ordena con sort y convierte la posición pedida al índice del vector, que cuenta desde cero.",
    explanation:
      "La muestra se ordena como [9,9,12,18,25], así que el tercer tiempo es doce. En general consulta a[k − 1] tras ordenar. Los límites garantizan que existe y los empates permanecen como apariciones separadas. El ordenamiento cuesta O(n log n); almacenar los datos usa O(n) memoria.",
    tests: [
      { input: "5 3\n18 9 12 9 25", output: "12" },
      { input: "1 1\n17", output: "17" },
      { input: "4 2\n8 8 8 8", output: "8" },
      { input: "5 5\n1000000000 3 7 1 6", output: "1000000000" },
      { input: "3 1\n9 2 8", output: "2" },
    ],
    starter,
    solution: cpp(
      String.raw`    int n, k;
    cin >> n >> k;
    vector<int> tiempos(n);
    for (int &x : tiempos) cin >> x;
    sort(tiempos.begin(), tiempos.end());
    cout << tiempos[k - 1] << '\n';`,
      ["vector", "algorithm"],
    ),
  },
  {
    id: "minutos-por-etapa",
    title: "Minutos por etapa",
    level: "algoritmos",
    difficulty: "Intermedio",
    topic: "Sumas de prefijos",
    statement:
      "Una lista fija guarda los minutos de práctica de n días. Recibes q consultas: cada una pide la suma desde el día L hasta el R, incluidos ambos. Los valores no cambian entre consultas.",
    input:
      "La primera línea contiene n y q, con 1 ≤ n, q ≤ 100000. Siguen n enteros entre 0 y 1440 y después q líneas con L y R, donde 1 ≤ L ≤ R ≤ n.",
    output:
      "Escribe la suma de cada consulta en una línea, en el orden recibido.",
    sampleInput: "5 3\n20 30 15 45 10\n2 4\n1 5\n3 3",
    sampleOutput: "90\n120\n15",
    hint: "pref[R] suma desde el primer día hasta R. Identifica el prefijo que contiene los días anteriores a L.",
    explanation:
      "Define pref[0] = 0 y pref[i] como la suma de los primeros i días. Para [L,R], resta pref[L − 1] de pref[R]: quitas exactamente lo anterior a L. La consulta 2 a 4 suma 30 + 15 + 45 = 90. Preparación y consultas cuestan O(n + q), con O(n) memoria.",
    tests: [
      { input: "5 3\n20 30 15 45 10\n2 4\n1 5\n3 3", output: "90\n120\n15" },
      { input: "1 2\n0\n1 1\n1 1", output: "0\n0" },
      {
        input: "3 3\n1440 1440 1440\n1 3\n1 1\n2 3",
        output: "4320\n1440\n2880",
      },
      { input: "4 2\n1 2 3 4\n4 4\n1 4", output: "4\n10" },
    ],
    starter,
    solution: cpp(
      String.raw`    int n, q;
    cin >> n >> q;
    vector<long long> pref(n + 1, 0);
    for (int i = 1; i <= n; ++i) {
        long long minutos;
        cin >> minutos;
        pref[i] = pref[i - 1] + minutos;
    }
    while (q--) {
        int L, R;
        cin >> L >> R;
        cout << pref[R] - pref[L - 1] << '\n';
    }`,
      ["vector"],
    ),
  },
  {
    id: "monedas-del-recreo",
    title: "Monedas del recreo",
    level: "olimpiada",
    difficulty: "Intermedio",
    topic: "Programación dinámica",
    statement:
      "Dispones de monedas de valores 1, 3 y 4, sin límite de cantidad para cada valor. Calcula el menor número de monedas que suma exactamente n. Para n = 0, la respuesta es cero.",
    input: "Recibe un entero n, con 0 ≤ n ≤ 100000.",
    output: "Escribe el mínimo número de monedas necesario para sumar n.",
    sampleInput: "6",
    sampleOutput: "2",
    hint: "Si la última moneda vale c, antes debías haber pagado s − c. Define dp[s] y compara las tres opciones que caben.",
    explanation:
      "Para seis, 3 + 3 usa dos monedas y mejora 4 + 1 + 1. Define dp[0] = 0. Para cada s, prueba c en {1,3,4} con c ≤ s y toma el menor dp[s − c] + 1. Toda solución termina en una de esas monedas, por lo que revisar las tres cubre el óptimo. Tiempo y memoria O(n).",
    tests: [
      { input: "6", output: "2" },
      { input: "0", output: "0" },
      { input: "2", output: "2" },
      { input: "7", output: "2" },
      { input: "10", output: "3" },
      { input: "100000", output: "25000" },
    ],
    starter,
    solution: cpp(
      String.raw`    int n;
    cin >> n;
    vector<int> dp(n + 1, n + 1);
    dp[0] = 0;
    int monedas[] = {1, 3, 4};
    for (int s = 1; s <= n; ++s) {
        for (int c : monedas) {
            if (c <= s) dp[s] = min(dp[s], dp[s - c] + 1);
        }
    }
    cout << dp[n] << '\n';`,
      ["vector", "algorithm"],
    ),
  },
  {
    id: "rutas-del-campus",
    title: "Rutas del campus",
    level: "olimpiada",
    difficulty: "Avanzado",
    topic: "Grafos y BFS",
    statement:
      "Un campus tiene n edificios numerados de 1 a n y m senderos que pueden recorrerse en ambos sentidos. Cada sendero cuenta como un paso. Encuentra el menor número de pasos del edificio 1 al n, o indica −1 si no existe ruta.",
    input:
      "La primera línea contiene n y m, con 1 ≤ n ≤ 100000 y 0 ≤ m ≤ 200000. Después hay m líneas a b, con 1 ≤ a, b ≤ n y a ≠ b. Ningún sendero se repite.",
    output:
      "Escribe la distancia mínima de 1 a n, o −1 si no se puede llegar. Cuando n = 1, escribe 0.",
    sampleInput: "5 5\n1 2\n2 5\n1 3\n3 4\n4 5",
    sampleOutput: "2",
    hint: "Usa una cola para visitar primero los edificios a un paso, después a dos y así sucesivamente. Marca cada uno al insertarlo.",
    explanation:
      "BFS comienza en uno con distancia cero y procesa por capas. Al descubrir un vecino, guarda la distancia actual más uno y márcalo antes de ponerlo en la cola. Su primera visita ofrece el menor número de aristas porque todos los senderos cuestan un paso. En la muestra, 1 → 2 → 5 usa dos. Tiempo y memoria O(n + m).",
    tests: [
      { input: "5 5\n1 2\n2 5\n1 3\n3 4\n4 5", output: "2" },
      { input: "1 0", output: "0" },
      { input: "3 1\n1 2", output: "-1" },
      { input: "4 3\n1 2\n2 3\n3 4", output: "3" },
      { input: "4 4\n1 2\n2 3\n3 1\n1 4", output: "1" },
    ],
    starter,
    solution: cpp(
      String.raw`    int n, m;
    cin >> n >> m;
    vector<vector<int>> vecinos(n + 1);
    for (int i = 0; i < m; ++i) {
        int a, b;
        cin >> a >> b;
        vecinos[a].push_back(b);
        vecinos[b].push_back(a);
    }
    vector<int> distancia(n + 1, -1);
    queue<int> pendientes;
    distancia[1] = 0;
    pendientes.push(1);
    while (!pendientes.empty()) {
        int actual = pendientes.front();
        pendientes.pop();
        for (int siguiente : vecinos[actual]) {
            if (distancia[siguiente] == -1) {
                distancia[siguiente] = distancia[actual] + 1;
                pendientes.push(siguiente);
            }
        }
    }
    cout << distancia[n] << '\n';`,
      ["vector", "queue"],
    ),
  },
];
