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
    title: "¿Qué es programar?",
    description:
      "Convierte una idea en instrucciones que una computadora pueda seguir.",
    minutes: 10,
    sections: [
      {
        title: "Una idea, paso a paso",
        body: "Programar es escribir instrucciones precisas para resolver una tarea. Piensa en preparar una torta: necesitas ingredientes, un orden y un resultado. Una computadora también necesita que le digas qué hacer y en qué orden. No adivina lo que querías decir. Equivocarte mientras escribes esas instrucciones forma parte de aprender.",
      },
      {
        title: "Entrada → proceso → salida",
        body: "Si quieres saber cuántas personas van en dos autobuses, la entrada puede ser 23 y 19. El proceso es sumar. La salida es 42. Antes de escribir código, completa tres frases: «recibo estos datos», «hago estos pasos» y «entrego esta respuesta». Esa secuencia de pasos se llama algoritmo.",
      },
      {
        title: "Tu primer experimento",
        body: "Usaremos C++, un lenguaje para escribir esas instrucciones. Este programa muestra un mensaje. No necesita entrada: su única tarea es escribir Hola, Morelos! exactamente como aparece entre comillas. Usa el botón Copiar para llevar el programa completo a un editor con compilador y ejecutarlo allí.",
        code: cpp(String.raw`    cout << "Hola, Morelos!" << '\n';`),
      },
      {
        title: "Tu primera ejecución, paso a paso",
        body: "Puedes empezar aquí mismo. 1) Pulsa Probar código junto al ejemplo de esta lección. 2) Observa el programa en el editor. 3) Pulsa Ejecutar código. 4) Busca Hola, Morelos! en la salida. Después cambia el mensaje entre comillas y vuelve a ejecutar. El laboratorio guarda tu borrador en este navegador, así que puedes regresar a tu experimento más tarde. También encontrarás un espacio libre en Laboratorio C++ desde el menú.",
      },
      {
        title: "Pruébalo sin computadora",
        body: "Escribe instrucciones para que otra persona dibuje un cuadrado sin mostrarle tu dibujo. ¿Dijiste cuánto avanzar? ¿Cuánto girar? Cuando tu compañero interprete algo distinto, mejora la instrucción. Así se siente depurar: encontrar dónde nuestras instrucciones dejaron de expresar nuestra idea.",
      },
    ],
    quiz: {
      question:
        "Un programa recibe 23 y 19, los suma y escribe 42. ¿Cuál es la salida?",
      options: ["23 y 19", "La operación de sumar", "42"],
      answer: 2,
      explanation:
        "La salida es el resultado que entrega el programa. Los números 23 y 19 son la entrada.",
    },
    problemId: "hola-morelos",
  },
  {
    id: "tu-primer-programa",
    level: "inicio",
    title: "Tu primer programa en C++",
    description:
      "Conoce las piezas de un programa y pierde el miedo a los errores.",
    minutes: 12,
    sections: [
      {
        title: "Un punto de partida",
        body: "#include <iostream> agrega herramientas de entrada y salida. using namespace std permite escribir cout sin el prefijo std::. int main() marca dónde comienza el programa y las llaves encierran sus instrucciones. return 0 indica que el programa terminó normalmente. Por ahora usa esta estructura y concéntrate en lo que va dentro de main.",
        code: cpp(String.raw`    cout << "Estoy aprendiendo C++" << '\n';
    cout << "Un paso a la vez" << '\n';`),
      },
      {
        title: "Del código a la ejecución",
        body: "El código fuente es el texto que escribes. Un compilador lo traduce a un programa ejecutable. Si escribes cou en lugar de cout o falta un punto y coma, la compilación puede fallar. Lee primero el primer mensaje de error: corregirlo a veces arregla varios mensajes posteriores. Un programa que compila todavía puede tener errores en su idea.",
      },
      {
        title: "Practica un cambio a la vez",
        body: "Pulsa Probar código junto al ejemplo y después Ejecutar código. Debes ver dos líneas: Estoy aprendiendo C++ y Un paso a la vez. Cambia sólo el primer mensaje y ejecuta otra vez. Ahora quita el punto y coma de una instrucción: observa el número de línea del error y vuelve a colocarlo. Un error de compilación significa que primero debes corregir el programa; no es una salida de tu programa. Tu borrador se guarda automáticamente y puedes descargar una copia con Descargar .cpp.",
      },
      {
        title: "Detalles pequeños que importan",
        body: "C++ distingue mayúsculas y minúsculas: main y Main no son lo mismo. Las comillas dobles delimitan texto. El punto y coma termina muchas instrucciones. La expresión '\\n' representa un salto de línea. Los espacios que agregas para acomodar el código ayudan a leerlo; los espacios que imprimes sí forman parte de la salida.",
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
        "El compilador traduce y detecta ciertos errores del lenguaje. La lógica de la solución sigue siendo responsabilidad de quien programa.",
    },
    problemId: "hola-morelos",
  },
  {
    id: "entrada-y-salida",
    level: "inicio",
    title: "Habla con tu programa",
    description: "Lee datos con cin y muestra resultados con cout.",
    minutes: 14,
    sections: [
      {
        title: "La entrada cambia; el programa no",
        body: "Un programa útil funciona con distintos datos. cin >> a lee el siguiente valor y lo guarda en a. cout << a muestra su valor. En los ejercicios, la entrada ya viene preparada: no necesitas imprimir «Escribe un número». El juez espera únicamente la salida solicitada.",
        code: cpp(String.raw`    int a, b;
    cin >> a >> b;
    cout << a + b << '\n';`),
      },
      {
        title: "Sigue una ejecución",
        body: "Con entrada 8 5, primero a vale 8 y b vale 5. Después a + b produce 13 y cout lo muestra. Con entrada 2 9, el mismo programa muestra 11. Para leer números con cin, un espacio y un salto de línea sirven como separadores; 8 y 5 pueden estar juntos en una línea o en dos líneas.",
      },
      {
        title: "Prueba la entrada en tu editor",
        body: "Pulsa Probar código para abrir este programa en el editor. Escribe 8 5 en Entrada (stdin) y después pulsa Ejecutar código. En la salida debe aparecer 13. Cambia la entrada por 2 9 y vuelve a ejecutar: debe aparecer 11. El código y la entrada van en áreas diferentes. Escribe todos los datos antes de ejecutar: este laboratorio los entrega de una vez, así que no debes esperar a que aparezca una pregunta en la salida para escribirlos.",
      },
      {
        title: "Copia el formato, no la respuesta",
        body: "El ejemplo de un problema ilustra cómo deben verse los datos. Tu solución debe calcular también las respuestas de otros casos. Un programa que siempre imprime 13 pasa el primer ejemplo, pero falla para 2 9. Prueba al menos un caso distinto que puedas resolver mentalmente.",
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
      "Guarda información y calcula con enteros, divisiones y residuos.",
    minutes: 16,
    sections: [
      {
        title: "Ponle nombre a un dato",
        body: "Una variable guarda un valor que puedes usar y cambiar. int dias = 7 crea un entero llamado dias. El signo = asigna un valor; no pregunta si dos cosas son iguales. Por eso puntos = puntos + 1 significa calcular el valor anterior más uno y guardarlo de nuevo. Elige nombres que describan la información.",
      },
      {
        title: "Dividir no siempre produce decimales",
        body: "Los operadores +, -, * y / suman, restan, multiplican y dividen. Entre enteros positivos, 17 / 5 da 3: cuenta grupos completos. El operador % obtiene el residuo: 17 % 5 da 2. Así puedes saber que hay 3 equipos completos de 5 personas y sobran 2.",
        code: cpp(String.raw`    int personas = 17;
    int porEquipo = 5;
    cout << personas / porEquipo << '\n';
    cout << personas % porEquipo << '\n';`),
      },
      {
        title: "Elige un tipo que alcance",
        body: "En los entornos habituales de competencia, int puede guardar aproximadamente hasta 2 mil millones. Para sumas y productos mayores usa long long. Si dos int se multiplican, la operación puede desbordarse antes de guardarse: 1LL * a * b fuerza una multiplicación de enteros grandes. Nunca dividas entre cero. Los paréntesis ayudan a expresar claramente el orden de las operaciones.",
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
    title: "Resuelve tu primer problema",
    description: "Una pequeña rutina para leer, pensar, programar y comprobar.",
    minutes: 12,
    sections: [
      {
        title: "Traduce la historia",
        body: "Un enunciado puede hablar de autobuses, monedas o mochilas. Busca qué datos recibes, qué resultado se pide y cuáles son sus límites. Si dos grupos llevan a y b mochilas, sólo necesitas sumar a + b. No hace falta representar cada mochila ni cada persona.",
      },
      {
        title: "Haz un plan antes del código",
        body: "Escribe tu algoritmo en palabras: leer a y b, calcular su suma, imprimirla. Resuelve a mano un ejemplo. Después conviértelo en código. Esta pausa pequeña evita programar una interpretación equivocada del problema. Si no puedes explicar la idea con un caso de tres elementos, conviene seguir pensando.",
      },
      {
        title: "Prueba con intención",
        body: "Para una suma, prueba 0 + 0, un número pequeño con uno grande y los valores máximos permitidos. Calcula la respuesta esperada antes de ejecutar. Si un caso falla, anota entrada, resultado esperado y resultado obtenido. Un caso pequeño que falla ayuda mucho más que «no funciona». Pedir una pista también es parte de entrenar.",
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
        "El ejemplo es una comprobación inicial. Los casos pequeños, los límites y una explicación de tu algoritmo aportan más confianza.",
    },
    problemId: "mochilas-del-equipo",
  },
  {
    id: "condicionales",
    level: "fundamentos",
    title: "Toma decisiones con if",
    description: "Haz que tu programa elija qué hacer según los datos.",
    minutes: 15,
    sections: [
      {
        title: "Si ocurre esto, haz aquello",
        body: "if ejecuta un bloque cuando una condición es verdadera. else define qué hacer en el caso contrario. Si un taller requiere al menos 60 puntos, la condición es puntos >= 60. «Al menos» incluye 60; usar puntos > 60 dejaría fuera por error a quien tiene exactamente esa cantidad.",
        code: cpp(String.raw`    int puntos;
    cin >> puntos;
    if (puntos >= 60) {
        cout << 1 << '\n';
    } else {
        cout << 0 << '\n';
    }`),
      },
      {
        title: "Comparar y combinar",
        body: "Usa == para igualdad, != para diferencia, < y > para comparar, y <= o >= para incluir el límite. No confundas == con =, que asigna. El operador && exige que ambas condiciones sean verdaderas; || necesita que al menos una lo sea. Por ejemplo, edad >= 12 && edad <= 18 comprueba un intervalo completo.",
      },
      {
        title: "Ataca las fronteras",
        body: "Para una condición con límite 60, prueba 59, 60 y 61. Esos tres casos revelan si incluiste correctamente la igualdad. Para varias condiciones, busca una entrada que haga verdadera cada rama. Las pruebas funcionan mejor cuando cada una responde una duda concreta.",
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
    title: "Repite con ciclos",
    description:
      "Procesa muchos datos sin copiar la misma instrucción una y otra vez.",
    minutes: 20,
    sections: [
      {
        title: "Una instrucción, muchas veces",
        body: "Un ciclo for reúne inicio, condición y avance. En for (int i = 0; i < n; ++i), i toma los valores 0, 1, …, n - 1: exactamente n repeticiones. Si n vale 3, las iteraciones son 0, 1 y 2. No llega a 3 porque la condición i < n ya sería falsa.",
      },
      {
        title: "Contadores y acumuladores",
        body: "Un contador suma uno cada vez que ocurre algo. Un acumulador suma cantidades que pueden variar. Este programa cuenta días con al menos 30 minutos de práctica. Iniciamos el contador en cero porque, antes de leer datos, todavía no hemos encontrado ningún día.",
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
        title: "Cuida el principio y el final",
        body: "Un error frecuente es usar i <= n y repetir una vez de más. Otro es olvidar actualizar la variable en un while, que repite mientras una condición sea verdadera. Traza un ciclo con n = 1: escribe el valor de i antes y después de cada vuelta. Si sólo necesitas contar o sumar, puedes procesar cada dato al leerlo sin guardar la lista completa.",
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
    title: "Organiza datos con arreglos",
    description:
      "Guarda una colección y recórrela sin perderte en sus posiciones.",
    minutes: 20,
    sections: [
      {
        title: "Una fila de casillas",
        body: "Un vector guarda varios valores del mismo tipo. vector<int> a(n) crea n enteros. Sus índices van de 0 a n - 1: a[0] es el primero y a[n - 1] es el último. a[n] queda fuera del vector. Imagina cinco casillas con etiquetas 0, 1, 2, 3, 4 antes de escribir un acceso.",
      },
      {
        title: "Encuentra el mayor",
        body: "Lee los datos y recórrelos manteniendo el mayor valor visto hasta ahora. Inicializa mayor con el primer dato. Si usaras cero, fallarías en una lista como -8, -3, -5: la respuesta es -3 y el cero ni siquiera aparece. Este ejemplo supone n >= 1.",
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
        title: "Recuerda sólo lo necesario",
        body: "Si únicamente quieres el máximo, puedes leer un dato, actualizarlo y olvidar ese dato. Guardar el vector conviene cuando lo recorrerás varias veces, ordenarás sus valores o necesitarás consultar posiciones. Elegir qué información conservar también es parte de diseñar una solución.",
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
    title: "Trabaja con palabras",
    description: "Explora textos carácter por carácter usando string.",
    minutes: 16,
    sections: [
      {
        title: "El texto también es una colección",
        body: "Un string guarda una cadena de caracteres. Si palabra vale \"morelos\", palabra[0] es la letra 'm' y palabra.size() vale 7. Las comillas dobles representan una cadena; las simples, un carácter. Puedes recorrer una cadena igual que un vector.",
      },
      {
        title: "Cuenta lo que buscas",
        body: 'El ciclo for (char letra : palabra) visita cada carácter. En este ejemplo contamos cuántas letras a aparecen. Sólo cuenta la a minúscula: las mayúsculas son caracteres diferentes. Si la entrada es "banana", la salida es 3.',
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
        title: "Una palabra o una línea",
        body: "cin >> palabra lee hasta el siguiente espacio. Para leer una línea completa puedes usar getline(cin, linea). Si antes leíste un número con cin, puede quedar un salto de línea pendiente; getline(cin >> ws, linea) descarta primero espacios iniciales. Úsalo cuando esos espacios no formen parte de los datos importantes.",
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
    title: "Divide y organiza con funciones",
    description:
      "Dale un nombre a una tarea y reutilízala con distintos datos.",
    minutes: 18,
    sections: [
      {
        title: "Pequeñas tareas con nombre",
        body: "Una función recibe parámetros, hace una tarea y puede devolver un resultado. Esto permite probar una parte sin releer todo el programa. bool esPar(int x) recibe un entero y devuelve verdadero o falso. El nombre de la función debe explicar qué calcula.",
      },
      {
        title: "Define, llama y recupera",
        body: "La función se define antes de usarla en este ejemplo. Cuando main llama esPar(numero), el valor de numero se copia en x. return devuelve el resultado y termina esa llamada. El return dentro de esPar no termina main.",
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
        title: "Haz explícito lo que necesita",
        body: "Es más fácil comprender una función que recibe sus datos como parámetros que una que depende de muchas variables externas. Escribe qué espera y qué promete: «recibe un entero; devuelve si es par». El operador condición ? valorSiVerdadero : valorSiFalso del ejemplo es una forma corta de elegir entre dos valores.",
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
        "return devuelve el control a donde se llamó la función. Sólo return en main finaliza normalmente el programa completo.",
    },
  },
  {
    id: "pensar-en-algoritmos",
    level: "algoritmos",
    title: "De una idea a un algoritmo",
    description: "Construye una solución clara y explica por qué funciona.",
    minutes: 18,
    sections: [
      {
        title: "Empieza con una solución que entiendas",
        body: "Antes de buscar una solución ingeniosa, describe una directa. Para saber si un número aparece en una lista, puedes recorrer toda la lista y comparar cada dato. Tal vez después exista una forma más rápida, pero la solución directa te da una base para pensar y comprobar.",
      },
      {
        title: "Qué sabes después de cada paso",
        body: "Una invariante es una afirmación que se mantiene durante un algoritmo. Al buscar el máximo, después de procesar i valores, mayor es el máximo entre esos i valores. Comprueba tres momentos: al empezar se cumple; al incorporar un dato sigue cumpliéndose; al terminar expresa exactamente la respuesta solicitada.",
      },
      {
        title: "Prueba ideas con contraejemplos",
        body: "Supón que quieres detectar números repetidos y sólo comparas vecinos. La lista 4, 7, 4 demuestra que esa idea falla: hay dos cuatros que no son vecinos. Un contraejemplo pequeño basta para descartar una idea, aunque funcione en muchos otros casos. Pregunta siempre qué tendría que pasar para que tu algoritmo se equivoque.",
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
    title: "¿Cuánto tarda tu idea?",
    description: "Compara soluciones contando cómo crece su trabajo.",
    minutes: 20,
    sections: [
      {
        title: "El tamaño cambia todo",
        body: "Llamamos n a la cantidad de datos. Un recorrido hace aproximadamente n pasos. Comparar cada elemento con todos los demás puede hacer aproximadamente n² pasos. Con n = 100000, hablamos de cien mil frente a diez mil millones. Una idea cómoda para cinco datos puede volverse inviable cuando crece la entrada.",
      },
      {
        title: "Lee O como una forma de crecer",
        body: "O(n) describe trabajo que crece proporcionalmente a n; O(n²), trabajo cuadrático. Dos recorridos consecutivos siguen siendo O(n), aunque hagan cerca de 2n operaciones. O(log n) suele aparecer cuando descartas la mitad de las opciones repetidamente. No son tiempos exactos en segundos: también importan la máquina, el lenguaje y cada operación.",
      },
      {
        title: "Tiempo y memoria",
        body: "Si guardas n enteros, usas O(n) memoria; si sólo conservas una suma y el dato actual, usas O(1) memoria adicional. Leer los límites del enunciado te ayuda a escoger una técnica. Antes de programar, anota tu costo esperado y comprueba que estás contando el trabajo de todos los ciclos, incluso los anidados.",
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
    title: "Pon los datos en orden",
    description: "Usa sort y descubre qué preguntas se vuelven más fáciles.",
    minutes: 20,
    sections: [
      {
        title: "Una nueva forma de mirar la lista",
        body: "Ordenar reúne los valores iguales y coloca los menores antes de los mayores. Después es sencillo localizar el mínimo, el máximo o el k-ésimo menor. Cambiar el orden es válido sólo cuando la posición original no es parte de lo que necesitas conservar; si lo es, guarda también los índices originales.",
      },
      {
        title: "Ordena con la biblioteca",
        body: "Incluye <algorithm> y usa sort(a.begin(), a.end()). El orden predeterminado es ascendente. Si k se cuenta desde uno, el k-ésimo elemento está en a[k - 1]. Los repetidos ocupan posiciones distintas: en 2, 2, 9, el segundo menor es 2.",
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
        title: "Lo que cuesta y lo que permite",
        body: "sort realiza O(n log n) comparaciones. Una vez ordenado, puedes contar valores distintos comparando vecinos o buscar con búsqueda binaria. Incluye el costo de ordenar al analizar toda tu solución; el recorrido posterior no lo hace desaparecer.",
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
    title: "Busca descartando mitades",
    description:
      "Encuentra un valor rápidamente cuando los datos están ordenados.",
    minutes: 25,
    sections: [
      {
        title: "La pista está en el orden",
        body: "Si buscas 17 y el elemento central vale 10, en una lista ascendente puedes descartar ese 10 y todo lo que queda a su izquierda. Si el central vale 25, puedes descartar la parte derecha. Cada comparación elimina aproximadamente la mitad de las opciones. Sin orden, ese descarte no sería válido.",
      },
      {
        title: "Mantén un intervalo de candidatos",
        body: "Este ejemplo encuentra la primera posición con un valor mayor o igual que x. Usa el intervalo [izq, der), que incluye izq y excluye der. Si a[medio] es menor que x, la respuesta está después; en otro caso, medio todavía puede ser la respuesta. Al terminar, izq puede valer n si todos los datos eran menores.",
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
        title: "Comprueba los extremos",
        body: "Prueba un valor menor que todos, uno mayor que todos, uno repetido y uno que no existe entre dos elementos. La búsqueda tarda O(log n), pero leer la lista cuesta O(n). La biblioteca ofrece lower_bound para la misma idea de encontrar el primer elemento mayor o igual; entender el intervalo te ayuda a usarla correctamente.",
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
    title: "Suma una vez, responde muchas",
    description: "Resuelve consultas de intervalos con sumas de prefijos.",
    minutes: 25,
    sections: [
      {
        title: "Recuerda lo acumulado",
        body: "Define pref[i] como la suma de los primeros i elementos. Entonces pref[0] = 0 y pref[i + 1] = pref[i] + a[i]. Para la lista 4, 2, 5, 1, los prefijos son 0, 4, 6, 11, 12. Hay n + 1 prefijos porque también guardamos la suma de cero elementos.",
      },
      {
        title: "Quita lo que sobra",
        body: "Si las posiciones del problema empiezan en uno y la consulta incluye L y R, la suma es pref[R] - pref[L - 1]. Para posiciones 2 a 3, calculas 11 - 4 = 7: quitas el primer elemento y conservas 2 + 5. Esta cancelación también funciona con números negativos.",
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
        title: "Una inversión que se aprovecha",
        body: "Preparar los prefijos cuesta O(n); cada consulta cuesta O(1). Para q consultas, el total es O(n + q). La memoria es O(n). Este método supone que los valores no cambian entre consultas: si modificas un dato, los prefijos posteriores dejan de representar las sumas actuales.",
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
    title: "Explora todas las posibilidades",
    description: "Usa fuerza bruta cuando el espacio de opciones es pequeño.",
    minutes: 22,
    sections: [
      {
        title: "Una solución directa también cuenta",
        body: "La búsqueda exhaustiva revisa todas las opciones válidas y escoge las que sirven. Para contar parejas de números iguales, puedes revisar cada par de posiciones. Usa i < j para evitar contar una pareja dos veces o emparejar un elemento consigo mismo.",
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
        title: "Cuenta antes de explorar",
        body: "El programa revisa n(n - 1)/2 parejas y tarda O(n²). Para n = 100 puede ser una opción cómoda; para n = 200000 habría cerca de veinte mil millones de parejas. Elegir o no elegir cada uno de n objetos produce 2ⁿ subconjuntos: el crecimiento es todavía más rápido.",
      },
      {
        title: "Un laboratorio para ideas más rápidas",
        body: "Una solución lenta y correcta sirve para comprobar otra rápida con entradas pequeñas. También puede resolver subtareas con límites menores, cuando el concurso las ofrece. Conserva la explicación de por qué enumera todas las opciones sin duplicarlas: la fuerza bruta también necesita ser correcta.",
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
    title: "Elige con una estrategia voraz",
    description:
      "Aprende cuándo una decisión local puede construir una solución óptima.",
    minutes: 24,
    sections: [
      {
        title: "Una decisión que no se deshace",
        body: "Un algoritmo voraz toma una decisión conveniente y sigue adelante. Imagina que todos los talleres tienen el mismo valor, cada uno ocupa un intervalo de tiempo y quieres asistir a la mayor cantidad sin traslapes. Una estrategia correcta es elegir siempre el que termina primero entre los que todavía puedes tomar.",
      },
      {
        title: "La razón importa más que la intuición",
        body: "Si una solución óptima comienza con otro taller, puedes sustituirlo por el que termina primero. El nuevo taller deja al menos tanto tiempo libre como el anterior, así que los siguientes siguen cabiendo. Este argumento de intercambio justifica la primera elección; después repites el razonamiento con los talleres restantes.",
      },
      {
        title: "Una estrategia que parece buena puede fallar",
        body: "Para pagar 6 con monedas de 1, 3 y 4, elegir siempre la mayor toma 4 + 1 + 1: tres monedas. Pero 3 + 3 usa dos. Por eso «toma lo más grande» no es una solución universal. Antes de confiar en una regla voraz, intenta construir un contraejemplo y explica por qué tu decisión conserva alguna solución óptima.",
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
    title: "Guarda respuestas pequeñas",
    description:
      "Construye una solución grande a partir de subproblemas con programación dinámica.",
    minutes: 30,
    sections: [
      {
        title: "Primero define qué significa tu tabla",
        body: "Para monedas de 1, 3 y 4, define dp[s] como el mínimo número de monedas para pagar exactamente s. La respuesta inicial es dp[0] = 0. Si conocemos las cantidades menores, podemos decidir cuál conviene usar como último paso para llegar a s.",
      },
      {
        title: "Prueba cada última moneda",
        body: "Si la última moneda vale c, antes debimos pagar s - c. Por eso la candidata es dp[s - c] + 1. Tomamos la menor entre todas las monedas que caben. Calculamos s en orden creciente para que cada respuesta necesaria esté lista. Una cantidad mayor que cualquier respuesta posible representa inicialmente «todavía no calculado».",
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
        title: "Comprueba el significado con seis pesos",
        body: "Las respuestas de 0 a 6 son 0, 1, 2, 1, 1, 2, 2. Para 6, la última moneda 3 permite usar dp[3] + 1 = 2. Toda solución termina con alguna moneda de la lista y el algoritmo revisa todas: por eso no pierde una opción mejor. Con tres denominaciones fijas, tiempo y memoria son O(n).",
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
    title: "Conecta ideas con grafos",
    description: "Representa lugares y caminos; encuentra distancias con BFS.",
    minutes: 30,
    sections: [
      {
        title: "Puntos y conexiones",
        body: "Un grafo tiene vértices y aristas. Los vértices pueden representar salones y las aristas pasillos entre ellos. Si un pasillo se puede recorrer en ambas direcciones, añade cada extremo a la lista de vecinos del otro. La representación con listas de adyacencia guarda sólo las conexiones existentes.",
      },
      {
        title: "Explora por capas",
        body: "BFS, o búsqueda en anchura, usa una cola: lo primero que entra es lo primero que sale. Visita primero el origen, después los lugares a un paso, luego los de dos pasos. Si todas las aristas cuestan un paso, la primera distancia descubierta para cada vértice es la mínima.",
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
        title: "Marca al descubrir",
        body: "La distancia -1 significa «no visitado». Cámbiala cuando agregas un vértice a la cola para no agregarlo varias veces. Cada vértice se procesa una vez y cada arista se revisa por sus extremos: O(n + m). Si las aristas tienen costos diferentes, BFS ya no garantiza la ruta de menor costo.",
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
    title: "Prepara tu día de olimpiada",
    description:
      "Entrena cómo leer, repartir tu tiempo y aprender de cada intento.",
    minutes: 15,
    sections: [
      {
        title: "Lee primero el mapa completo",
        body: "Al comenzar una práctica de concurso, revisa todos los problemas. Identifica cuáles entiendes, qué límites tienen y si hay subtareas. Empieza por una solución que puedas explicar y terminar. Si te atoras, escribe lo que sabes antes de cambiar de problema: será más fácil retomar después.",
      },
      {
        title: "Un envío es una comprobación",
        body: "Antes de enviar, revisa entrada y salida, tipos numéricos, índices y complejidad. Prueba el tamaño mínimo y una frontera importante. Si el resultado es incorrecto, busca un caso pequeño que contradiga tu programa. En un simulacro usa únicamente las herramientas permitidas por las reglas de esa práctica; las condiciones oficiales deben consultarse en la convocatoria vigente.",
      },
      {
        title: "La bitácora convierte errores en progreso",
        body: "Después de una sesión anota problema, idea, ayuda utilizada, error principal y siguiente intento. Vuelve a resolver una tarea difícil dos días después sin mirar tu código anterior. Si estudiaste la solución, cierra la explicación y reconstruye el argumento con tus palabras. Una pausa y dormir bien también ayudan a razonar mejor.",
      },
      {
        title: "Tu siguiente paso",
        body: "Al terminar esta ruta tendrás una base, no una lista cerrada de todo lo que puede aparecer en una olimpiada. Continúa con más problemas, árboles, recursión, dos punteros y nuevas formas de programación dinámica. Avanza cuando puedas explicar las ideas y adaptarlas a ejemplos nuevos, a tu ritmo y con apoyo de tu entrenador.",
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
        "Reconstruir y recuperar la idea después te ayuda a distinguir comprender un algoritmo de reconocer su código.",
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
      "Tu equipo está listo para su primera sesión. Escribe un programa que muestre el mensaje Hola, Morelos! para dar la bienvenida. Respeta la mayúscula, la coma, el espacio y el signo final.",
    input: "Este problema no recibe datos de entrada.",
    output: "Una línea con el texto exacto: Hola, Morelos!",
    sampleInput: "",
    sampleOutput: "Hola, Morelos!",
    hint: "cout permite escribir texto. Coloca el mensaje entre comillas dobles.",
    explanation:
      "No hay nada que leer ni calcular. Es suficiente imprimir el mensaje solicitado. El signo de apertura ¡ forma parte del título del problema, pero no de la salida.",
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
      "Dos grupos llegan al entrenamiento: el primero trae a mochilas y el segundo trae b. ¿Cuántas mochilas llegaron en total?",
    input: "Dos enteros a y b separados por un espacio. 0 ≤ a, b ≤ 1000.",
    output: "Un entero: la cantidad total de mochilas.",
    sampleInput: "12 9",
    sampleOutput: "21",
    hint: "Guarda ambos números y suma sus valores.",
    explanation:
      "Cada mochila pertenece a uno de los dos grupos, por lo que el total es a + b. Para el ejemplo, 12 + 9 = 21. Tiempo O(1) y memoria O(1).",
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
      "En una actividad hay n estudiantes. Cada equipo debe tener exactamente k integrantes. Forma la mayor cantidad posible de equipos completos y calcula cuántos estudiantes quedan sin equipo.",
    input: "Dos enteros n y k. 0 ≤ n ≤ 1000000 y 1 ≤ k ≤ 1000.",
    output:
      "Dos enteros separados por un espacio: equipos completos y estudiantes restantes.",
    sampleInput: "23 5",
    sampleOutput: "4 3",
    hint: "La división entera cuenta grupos completos; el operador % cuenta lo que sobra.",
    explanation:
      "La cantidad de equipos es n / k y el residuo es n % k. Con 23 estudiantes y equipos de 5, se usan 20 estudiantes y quedan 3. Tiempo O(1) y memoria O(1).",
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
      "En este ejercicio, un taller propone un reto de práctica: para desbloquear su siguiente actividad necesitas al menos 60 puntos. Dado tu puntaje p, indica si alcanzas esa meta. Esta regla pertenece al ejercicio y no representa un criterio de selección de la olimpiada.",
    input: "Un entero p, con 0 ≤ p ≤ 100.",
    output: "Imprime 1 si p es al menos 60. En otro caso, imprime 0.",
    sampleInput: "60",
    sampleOutput: "1",
    hint: "«Al menos» significa que el valor de la frontera también cuenta.",
    explanation:
      "Comprueba p >= 60. Usar > en lugar de >= fallaría justamente para p = 60. Tiempo O(1) y memoria O(1).",
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
      "Llevas un registro de los minutos que practicaste durante n días. Tu meta diaria era practicar al menos k minutos. Cuenta cuántos días alcanzaste la meta; no es necesario que sean consecutivos.",
    input:
      "La primera línea contiene n y k, con 1 ≤ n ≤ 100000 y 1 ≤ k ≤ 1440. La segunda contiene n enteros entre 0 y 1440: los minutos de cada día.",
    output:
      "Un entero: la cantidad de días en los que practicaste al menos k minutos.",
    sampleInput: "5 30\n20 45 30 0 60",
    sampleOutput: "3",
    hint: "Empieza un contador en cero y aumenta uno cada vez que un dato sea mayor o igual que k.",
    explanation:
      "En el ejemplo alcanzaste la meta con 45, 30 y 60 minutos. Procesa cada dato una vez. El tiempo es O(n) y la memoria adicional O(1); no necesitas guardar todos los días.",
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
      "Un equipo revisa n mediciones de temperatura de una estación de práctica. Encuentra la mayor medición. Los datos pueden ser negativos; son un conjunto de entrenamiento, no un reporte meteorológico real.",
    input:
      "La primera línea contiene n, con 1 ≤ n ≤ 100000. La segunda contiene n temperaturas enteras entre -100 y 100.",
    output: "Un entero: la temperatura más alta de la lista.",
    sampleInput: "5\n18 24 21 28 23",
    sampleOutput: "28",
    hint: "Inicia el máximo con el primer dato, no con cero. Después compáralo con los demás.",
    explanation:
      "Mantén el mayor valor que has leído. Cuando llega una temperatura más alta, reemplázalo. Al terminar, has considerado todos los datos. Tiempo O(n) y memoria adicional O(1).",
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
      "Cada una de n personas resolvió un acertijo. Conoces los minutos que tardó cada una y quieres obtener el k-ésimo menor tiempo. Si dos personas tardaron lo mismo, sus tiempos ocupan dos posiciones distintas en la lista ordenada.",
    input:
      "La primera línea contiene n y k, con 1 ≤ k ≤ n ≤ 100000. La segunda contiene n tiempos enteros entre 1 y 1000000000.",
    output:
      "Un entero: el tiempo que ocupa la posición k al ordenar de menor a mayor.",
    sampleInput: "5 3\n18 9 12 9 25",
    sampleOutput: "12",
    hint: "Ordena los tiempos con sort. Recuerda que el vector empieza en el índice cero.",
    explanation:
      "Los tiempos ordenados son 9, 9, 12, 18, 25. La tercera posición contiene 12. En general, después de ordenar responde a[k - 1]. Tiempo O(n log n) y memoria O(n) para guardar la lista.",
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
      "Tu bitácora contiene los minutos de práctica de n días. Un entrenador hace q consultas. En cada una quiere saber cuántos minutos practicaste desde el día L hasta el día R, incluyendo ambos. Los registros no cambian entre consultas.",
    input:
      "La primera línea contiene n y q, con 1 ≤ n, q ≤ 100000. La segunda contiene n enteros entre 0 y 1440. Siguen q líneas con L y R, donde 1 ≤ L ≤ R ≤ n.",
    output:
      "Por cada consulta, imprime en una línea la suma de minutos del intervalo solicitado.",
    sampleInput: "5 3\n20 30 15 45 10\n2 4\n1 5\n3 3",
    sampleOutput: "90\n120\n15",
    hint: "Guarda pref[i], la suma de los primeros i días. ¿Qué parte debes quitar de pref[R]?",
    explanation:
      "La consulta 2 a 4 suma 30 + 15 + 45 = 90. Con pref[0] = 0, cada respuesta es pref[R] - pref[L - 1]. Preparar la tabla y contestar todo cuesta O(n + q), con O(n) memoria.",
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
      "En un juego, las monedas tienen valores de 1, 3 y 4. Puedes usar tantas monedas de cada valor como necesites. Encuentra la menor cantidad de monedas con la que puedes pagar exactamente n. Si n es cero, no necesitas monedas.",
    input: "Un entero n, con 0 ≤ n ≤ 100000.",
    output: "Un entero: la mínima cantidad de monedas necesaria.",
    sampleInput: "6",
    sampleOutput: "2",
    hint: "Define dp[s] como el mínimo para pagar s. Prueba si conviene terminar con una moneda de 1, de 3 o de 4.",
    explanation:
      "Para pagar 6 conviene 3 + 3. Elegir primero la moneda más grande produciría 4 + 1 + 1 y usaría una moneda extra. Usa dp[0] = 0 y dp[s] = mínimo de dp[s - c] + 1 para c en {1, 3, 4} con c ≤ s. Tiempo O(n) y memoria O(n).",
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
      "Un campus de práctica tiene n edificios numerados del 1 al n y m senderos. Cada sendero conecta dos edificios y se recorre en ambas direcciones. Todos cuentan como un paso. Encuentra el menor número de senderos que necesitas recorrer para ir del edificio 1 al edificio n. Si no existe una ruta, indica -1.",
    input:
      "La primera línea contiene n y m, con 1 ≤ n ≤ 100000 y 0 ≤ m ≤ 200000. Siguen m líneas con dos edificios a y b, donde 1 ≤ a, b ≤ n y a ≠ b. No hay senderos repetidos.",
    output:
      "Un entero: la menor cantidad de senderos para llegar de 1 a n, o -1 si es imposible. Si n = 1, la respuesta es 0.",
    sampleInput: "5 5\n1 2\n2 5\n1 3\n3 4\n4 5",
    sampleOutput: "2",
    hint: "Explora el grafo por capas con una cola. Guarda la distancia de cada edificio cuando lo visitas por primera vez.",
    explanation:
      "En el ejemplo, la ruta 1 → 2 → 5 usa dos senderos. BFS visita primero todos los edificios a un paso, luego los de dos y así sucesivamente. Marca cada edificio al agregarlo a la cola para evitar repetirlo. Tiempo y memoria O(n + m).",
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
