import type { GuidedChapter } from '../types.ts';
import { guided } from './basics-helper.ts';

export const guidedInicio: Record<string, GuidedChapter> = {
  'que-es-programar': guided('Programar es escribir pasos claros que sirven para muchos datos distintos.', [
    ["Una tarea con datos que cambian", "Repartir seis galletas entre dos personas es una tarea que ya puedes resolver: das tres a cada una. Programar consiste en escribir cómo obtener ese resultado. La diferencia es que las instrucciones también deben servir si mañana hay doce galletas y tres personas; no basta guardar la respuesta de hoy."],
    ['Primero recibe los datos', 'Tu programa necesita saber cuántas galletas hay y cuántas personas recibirán. Estos datos se llaman entrada. Hoy son seis y dos; mañana pueden ser doce y tres. La idea es conservar las instrucciones aunque cambien esos números.'],
    ['Después transforma los datos', 'En este reparto, podemos dividir las galletas entre las personas. Ese cálculo es el proceso. Para empezar, usaremos cantidades que se reparten exactamente y al menos una persona. Decir estas condiciones evita preguntas que todavía no hemos resuelto.'],
    ['Al final entrega una respuesta', 'Seis dividido entre dos da tres. La respuesta que muestra el programa se llama salida. No es la lista de instrucciones: es lo que obtuvimos al seguirlas con una entrada concreta. Sigamos ahora todo el recorrido en una sola fila.', { picture: { caption: 'Los datos viajan por tres pasos.', rows: [{ label: 'Entrada', values: ['6 galletas', '2 personas'] }, { label: 'Proceso', values: ['6 ÷ 2'] }, { label: 'Salida', values: ['3 por persona'] }] } }],
    ['Haz tú el trabajo del programa', 'Antes de escribir código, prueba tus instrucciones con lápiz. Cambia solo la entrada y conserva el procedimiento. Así puedes descubrir si explicaste una regla o si únicamente recordaste la respuesta del primer ejemplo que habías visto.', { check: { question: 'Hay doce galletas y tres personas. ¿Cuál es la salida?', answer: 'Cuatro galletas por persona, porque 12 ÷ 3 = 4.' } }],
    ["De la regla al programa", "Para llevar este reparto a C++, necesitarás leer dos números, dividirlos y mostrar el resultado. Aquí supusimos que hay al menos una persona y que el reparto es exacto. Si permitimos sobrantes, habrá que decir qué hacer con ellos. Las condiciones del problema deciden qué instrucciones hacen falta."],
  ]),
  'tu-primer-programa': guided('Empieza con un programa pequeño, predice su salida y cambia una cosa cada vez.', [
    ["Un programa que escribe Hola", "Vamos a ejecutar un programa que escribe Hola. El ejemplo de abajo está completo: no tienes que añadirle archivos ni otras funciones. Ábrelo con Probar código y deja vacía la entrada. Antes de ejecutarlo, localicemos dónde comienza y qué instrucción escribe el mensaje."],
    ['Encuentra dónde empieza', 'Busca main en el ejemplo: es el nombre del lugar donde comienza nuestro programa. Las llaves que lo acompañan encierran sus instrucciones. Piensa en ellas como la portada y la última página de una receta que se va a seguir.'],
    ['Encuentra lo que se muestra', 'Dentro de main, cout indica que queremos escribir en la salida. El texto Hola aparece entre comillas porque queremos mostrar esas letras tal cual. El punto y coma marca el final de esa instrucción, como un punto al terminar una oración.', { code: String.raw`#include <iostream>
using namespace std;

int main() {
    cout << "Hola\n";
    return 0;
}` }],
    ['Pulsa ejecutar y observa', 'Antes de correr las instrucciones, el compilador revisa si están escritas de una forma válida y prepara el programa. Después se ejecuta. Si todo salió bien, verás Hola en la salida; no necesitas escribir nada en la entrada de este ejemplo.'],
    ['Haz un solo cambio', 'Cambia Hola por Hola, Morelos. No muevas las comillas ni el punto y coma. Antes de ejecutar, di qué esperas ver. Comparar tu predicción con el resultado te enseña qué hace cada parte sin cambiar muchas piezas al mismo tiempo.', { check: { question: 'Si el texto entre comillas cambia a Buen día, ¿qué debería mostrar el programa?', answer: 'Debería mostrar Buen día. Cambiamos el mensaje, no la forma de ejecutarlo.' } }],
    ["Qué ocurre cuando falta una comilla", "Si quitas una comilla, el compilador ya no puede reconocer dónde termina el texto. Puede señalar esa línea o la siguiente. Compara con la versión que funcionaba, repón la comilla y ejecuta otra vez. Corregir el primer error suele aclarar los mensajes posteriores, que a veces son consecuencia del mismo problema."],
  ]),
  'entrada-y-salida': guided('La entrada cambia en cada prueba; el programa debe seguir resolviendo la misma tarea.', [
    ['Una calculadora que suma dos números', "Una suma cambia según los números que recibe. Con 4 y 7 debe dar 11; con 8 y 3 también; con 1 y 3 debe dar 4. Esos números son la entrada. El programa conservará las mismas instrucciones y leerá los datos de cada prueba para calcular su salida."],
    ['Prepara dos lugares para guardar', 'Llamaremos a y b a los números que vamos a recibir. Una variable es un lugar con nombre donde guardamos un dato. Por ahora, imagina dos casillas vacías esperando que les asignemos los valores escritos en la entrada.'],
    ['Lee de izquierda a derecha', 'cin sirve para leer. Cuando pedimos primero a y después b, el primer número va a a y el siguiente a b. Para leer números, un espacio o un salto de línea pueden separarlos: importa el orden, no la apariencia de las filas.', { picture: { caption: 'Cada lectura toma el siguiente número disponible.', rows: [{ label: 'Entrada', values: ['4', '7'] }, { label: 'Variable', values: ['a', 'b'] }] } }],
    ['Calcula y muestra el resultado', 'Una vez guardados los datos, sumamos a + b. cout muestra ese resultado en la salida. Si el problema pide únicamente un número, entregamos únicamente ese número: mensajes como “Tu respuesta es” añaden texto que el juez no pidió.', { code: String.raw`#include <iostream>
using namespace std;

int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << '\n';
    return 0;
}` }],
    ['Predice otra ejecución', 'Borra los datos anteriores y escribe una entrada distinta. El código puede quedarse igual. Antes de ejecutarlo, anota qué valor tendrá cada variable y qué número aparecerá al final. Si algo difiere, revisa primero el orden de lectura.', { check: { question: 'Si la entrada es 8 3, ¿qué guardan a y b y cuál es la salida?', answer: 'a guarda 8, b guarda 3 y la salida es 11.' } }],
    ['Comprueba el formato completo', "Antes de ejecutar, escribe todos los datos en el panel de entrada. El laboratorio los entrega juntos; no espera una conversación para pedirlos uno por uno. Si la tarea dice que llegan dos números, deben estar los dos. El formato del enunciado también te dirá cuándo necesitas leer palabras o líneas completas."],
  ]),
  'variables-y-operaciones': guided('Una variable guarda un valor; cada operación debe tener sentido para los datos que usas.', [
    ["Guardar la cantidad de canicas", "Tienes siete canicas y recibes tres. Para calcular cuántas quedan, guardamos 7 en una variable llamada canicas y luego sumamos 3. Una variable asocia un nombre con un valor. El nombre permanece; el valor puede cambiar cuando una instrucción lo actualiza."],
    ['El valor puede cambiar', 'Si recibes tres canicas, calculas siete más tres y guardas diez en el mismo lugar. La asignación sustituye el valor anterior. Por eso, canicas = canicas + 3 significa “calcula con lo que había y luego guarda el nuevo resultado”.', { picture: { caption: 'La casilla conserva su nombre, pero cambia su contenido.', rows: [{ label: 'Antes', values: ['canicas: 7'] }, { label: 'Recibes', values: ['+3'] }, { label: 'Después', values: ['canicas: 10'] }] }, code: String.raw`#include <iostream>
using namespace std;

int main() {
    int canicas = 7;
    canicas = canicas + 3;
    cout << canicas << '\n';
    return 0;
}` }],
    ['Reparte sin cortar objetos', 'Ahora reparte siete canicas entre tres personas. Cada una recibe dos y sobra una. Cuando ambos números son enteros, la división en C++ entrega la parte entera: 7 / 3 da 2. No aparece un decimal escondido esperando mostrarse.'],
    ['Pregunta cuánto sobra', 'El símbolo % calcula el residuo de una división entera. En nuestro reparto, 7 % 3 da 1. Juntas, las dos respuestas cuentan la historia: tres personas reciben dos canicas y todavía queda una. No podemos dividir ni pedir residuo entre cero.'],
    ['Revisa el orden de las cuentas', 'Las multiplicaciones y divisiones se hacen antes que las sumas y restas. Si quieres sumar primero, usa paréntesis. Conviene calcular una expresión pequeña a mano antes de escribir otra más larga: los paréntesis también ayudan a quien lee tu programa.', { check: { question: '¿Cuánto valen 2 + 3 * 4 y (2 + 3) * 4?', answer: 'La primera da 14; la segunda da 20, porque los paréntesis hacen que sumemos primero.' } }],
    ["Elegir el tipo por su rango", "Una variable entera solo puede guardar valores dentro del rango de su tipo. int alcanza para nuestras canicas; long long sirve para cantidades mucho mayores. Revisa también las operaciones: si multiplicas dos números, el producto puede necesitar más espacio que cualquiera de ellos. Elegir un destino amplio no arregla una cuenta que ya se desbordó."],
  ]),
  'tu-primer-problema': guided('Lee, resuelve un ejemplo a mano, explica tu regla y después conviértela en código.', [
    ['Lee la pregunta hasta el final', "Cada caja contiene seis lápices y una escuela compra cierta cantidad de cajas. Queremos calcular cuántos lápices recibe. La entrada es el número de cajas; la salida, el total de lápices. Separar esas dos cantidades ayuda a decidir qué leer, qué calcular y qué mostrar."],
    ['Haz un ejemplo con objetos', 'Con tres cajas puedes dibujar tres grupos de seis lápices. Cuenta: seis más seis más seis son dieciocho. Este ejemplo nos ayuda a entender la historia. Todavía no es un programa: falta encontrar una regla que también sirva para otras cantidades.', { picture: { caption: 'Cada caja aporta el mismo número de lápices.', rows: [{ label: 'Caja', values: ['1', '2', '3'] }, { label: 'Lápices', values: ['6', '6', '6'] }, { label: 'Acumulados', values: ['6', '12', '18'] }] } }],
    ['Escribe la regla en palabras', 'Para saber el total, multiplica el número de cajas por seis. Ahora tenemos un procedimiento corto que sirve con una caja, tres o diez. No necesitamos dibujar cada lápiz cuando el número de cajas crece; conservamos la relación que encontramos.'],
    ['Traduce solo esos pasos', 'Nuestro programa necesita leer cajas, calcular cajas por seis y mostrar el total. Son tres tareas. Si no sabes escribir alguna en C++, vuelve a entrada, operaciones o salida. Tener el plan separado del código permite ubicar exactamente qué parte falta aprender.'],
    ['Prueba más que el ejemplo', 'El primer ejemplo puede salir bien por casualidad. Prueba una caja y, si el enunciado permite cero, prueba cero cajas. Comprueba también una cantidad distinta que puedas multiplicar mentalmente. Cada prueba debe tener una respuesta esperada antes de ejecutarla.', { check: { question: 'Si llegan cuatro cajas, ¿qué respuesta esperamos y por qué?', answer: '24 lápices: cuatro grupos de seis dan 4 × 6 = 24.' } }],
    ['Cuando falle, busca una diferencia', "Si tu programa devuelve nueve para tres cajas, compara su operación con el plan: 3 + 6 da nueve, pero necesitamos 3 × 6. Si devuelve dieciocho con cualquier entrada, probablemente imprimiste el ejemplo. Mantén una prueba distinta a mano: con cuatro cajas deben salir veinticuatro."],
  ]),
  'condicionales': guided('Una condición decide qué instrucciones se ejecutan; prueba también el valor justo en la frontera.', [
    ['A veces hay dos caminos', "Un juego deja entrar a quien tenga al menos diez puntos. Con nueve muestra Espera; con diez o más, Entras. Una condición expresa la pregunta que separa esos casos. El programa la evalúa como verdadera o falsa y ejecuta las instrucciones del caso correspondiente."],
    ['Escribe la pregunta con precisión', '“Al menos diez” incluye el diez: usamos puntos >= 10. En cambio, > significa estrictamente mayor. También podemos comparar un residuo: x % 2 == 0 pregunta si x es par, porque al dividirlo entre dos no sobra nada.'],
    ['Usa if para el primer camino', 'if significa “si”. Las instrucciones de su bloque se ejecutan cuando la condición es verdadera. Si puntos vale doce, la pregunta puntos >= 10 es verdadera y podemos mostrar Entras. Si vale ocho, ese bloque no se ejecuta.'],
    ['Usa else para el otro camino', 'else contiene lo que debe ocurrir cuando la condición anterior es falsa. Así cubrimos las dos posibilidades sin repetir la pregunta. En nuestro ejemplo, mostramos Espera. Exactamente uno de esos dos bloques se ejecuta en cada intento.', { picture: { caption: 'Mira con cuidado el punto donde cambia la respuesta.', rows: [{ label: 'Puntos', values: ['9', '10', '11'] }, { label: '¿>= 10?', values: ['No', 'Sí', 'Sí'], highlight: [1] }, { label: 'Salida', values: ['Espera', 'Entras', 'Entras'] }] }, code: String.raw`#include <iostream>
using namespace std;

int main() {
    int puntos;
    cin >> puntos;
    if (puntos >= 10) {
        cout << "Entras\n";
    } else {
        cout << "Espera\n";
    }
    return 0;
}` }],
    ['Cuando hay dos requisitos', 'Supón que además necesitas una ficha. Para exigir ambas cosas usamos &&, que significa “y”. La condición completa solo es verdadera si alcanzas los puntos y tienes la ficha. Con ||, que significa “o”, bastaría cumplir al menos uno de los requisitos.', { check: { question: 'Tienes doce puntos, pero ninguna ficha. Si se requieren ambas cosas, ¿entras?', answer: 'No. Aunque cumples el requisito de puntos, falta la ficha.' } }],
    ['Prueba el borde antes de seguir', "Prueba nueve, diez y once: están antes, justo en y después del límite. Con > en lugar de >=, el caso de diez puntos fallaría. Para preguntar si dos valores son iguales usa ==. Una sola = asigna un valor, por lo que tiene un trabajo distinto en el programa."],
  ]),
  'ciclos': guided('Un ciclo repite una tarea; lleva la cuenta de dónde empieza, cuándo termina y qué cambia.', [
    ["Sumar una lista con un ciclo", "Sumemos 3, 1, 5 y 2. Una instrucción por número resolvería este ejemplo, pero habría que copiar más instrucciones si llegaran cien datos. Un ciclo repite una tarea sin copiar su código. En cada vuelta leeremos un número y lo agregaremos al total que ya llevamos."],
    ["Inicializar suma y contador", 'Antes de leer números, el total vale cero. Ese total es un acumulador: guarda lo que llevamos sumado. También necesitamos un contador para saber cuántos números hemos procesado. Al comenzar, no hemos procesado ninguno, así que el contador también vale cero.'],
    ['Haz una vuelta completa', 'En cada vuelta leemos el siguiente número, lo agregamos al total y aumentamos el contador. Después de leer el tres, el total vale tres y el contador uno. Respeta siempre ese mismo orden para que la cuenta describa lo que realmente ocurrió.'],
    ['Repite mientras falten números', 'Seguimos mientras el contador sea menor que cuatro. Después de la cuarta vuelta, ya no falta ningún número y paramos. Una tabla pequeña deja ver lo que permanece de una vuelta a la siguiente, sin tener que recordar todo mentalmente.', { picture: { caption: 'El total conserva el trabajo de las vueltas anteriores.', rows: [{ label: 'Leído', values: ['3', '1', '5', '2'] }, { label: 'Contador', values: ['1', '2', '3', '4'] }, { label: 'Total', values: ['3', '4', '9', '11'] }] } }],
    ['No borres lo que llevabas', 'Si vuelves a poner el total en cero dentro de cada vuelta, perderás las sumas anteriores. Si olvidas aumentar el contador, quizá el ciclo nunca termine. Estas dos variables cumplen trabajos distintos; seguirlas por separado ayuda a detectar el error.', { check: { question: 'Después de leer 3, 1 y 5, ¿cuánto falta por leer y cuánto llevamos sumado?', answer: 'Falta un número y llevamos 9. El contador vale 3 y el total vale 9.' } }],
    ['Elige una forma de repetir', "En el programa, i empieza en cero. La condición i < 4 permite las vueltas con i igual a 0, 1, 2 y 3; ++i aumenta el contador al terminar cada una. Eso hace cuatro lecturas. for reúne inicio, condición y avance; while expresa la misma repetición dejando el inicio y el avance en otras instrucciones.", { code: String.raw`#include <iostream>
using namespace std;

int main() {
    int total = 0;
    for (int i = 0; i < 4; ++i) {
        int numero;
        cin >> numero;
        total = total + numero;
    }
    cout << total << '\n';
    return 0;
}` }],
  ]),
  'arreglos': guided('Un arreglo guarda varios valores en orden, y cada posición tiene su propio índice.', [
    ['Guarda una fila de datos', "Guardemos las puntuaciones 8, 3, 9 y 5 para poder consultarlas después. Un arreglo es una fila de valores. Cada casilla tiene una posición, llamada índice, y un contenido. Para pedir el nueve necesitamos indicar su posición, no escribir nueve como si fuera la dirección de la casilla."],
    ['Las direcciones empiezan en cero', 'En C++, la primera casilla tiene índice cero. Índice significa posición. En nuestra fila de cuatro datos, los índices son cero, uno, dos y tres. El valor nueve está en el índice dos: el índice y el contenido no son la misma cosa.', { picture: { caption: 'La fila de arriba dice dónde; la de abajo dice qué hay.', rows: [{ label: 'Índice', values: ['0', '1', '2', '3'] }, { label: 'Valor', values: ['8', '3', '9', '5'], highlight: [2] }] } }],
    ['Visita una casilla por vuelta', 'Para mirar todos los datos, empieza con índice cero y avanza de uno en uno. Detente antes de llegar al tamaño del arreglo. Aquí visitarás cuatro posiciones. La posición cuatro no existe, aunque tengamos cuatro elementos; la última posición válida es tres.'],
    ['Busquemos la puntuación mayor', 'Podemos recordar un candidato: al principio, el ocho de la primera casilla. Mira el siguiente valor. Si supera al candidato, reemplázalo. El tres no lo cambia; el nueve sí; el cinco tampoco. Al terminar, el candidato es el mayor de toda la fila.', { code: String.raw`#include <iostream>
using namespace std;

int main() {
    int puntos[] = {8, 3, 9, 5};
    int mayor = puntos[0];
    for (int i = 1; i < 4; ++i) {
        if (puntos[i] > mayor) {
            mayor = puntos[i];
        }
    }
    cout << mayor << '\n';
    return 0;
}` }],
    ['Comprueba una modificación', 'Cambiar una casilla no cambia automáticamente las demás. Si el cinco se convierte en doce, las otras tres puntuaciones se mantienen. Después de modificar datos, quizá debas volver a calcular una respuesta que dependía de ellos, como la puntuación máxima.', { check: { question: 'Si la casilla de índice 1 cambia a 10, ¿cuál es ahora el mayor?', answer: '10. La fila queda 8, 10, 9, 5; cambiamos el segundo elemento.' } }],
    ['Guarda solo cuando lo necesites', "Para buscar solo el mayor, también podrías actualizar un candidato mientras lees y no guardar la fila. El arreglo hace falta cuando quieres volver a los datos o consultar posiciones concretas. En ambos casos, si empiezas con el primer elemento, verifica que exista: una colección vacía no tiene casilla cero."],
  ]),
  'cadenas': guided('Una cadena es una fila de caracteres que puedes recorrer, contar y comparar.', [
    ['Una palabra también tiene casillas', "La palabra casa tiene cuatro letras. Podemos guardarla en una cadena, llamada string en C++, y consultar sus posiciones como las de un arreglo. Cada posición contiene un carácter. Vamos a recorrer esa palabra para contar cuántas veces aparece la letra a, sin escribir la respuesta directamente."],
    ['Miremos la palabra por dentro', 'casa tiene cuatro caracteres. La c está en el índice cero y la última a en el tres. Para recorrerla, visitamos los índices menores que su longitud. Un espacio también cuenta como carácter cuando forma parte de la cadena que guardamos.', { picture: { caption: 'Cada letra ocupa una posición.', rows: [{ label: 'Índice', values: ['0', '1', '2', '3'] }, { label: 'Letra', values: ['c', 'a', 's', 'a'], highlight: [1, 3] }] } }],
    ['Contemos una letra concreta', 'Queremos saber cuántas veces aparece a. Empezamos con un contador en cero. Visitamos una letra por vuelta y aumentamos el contador solamente cuando vemos a. Al terminar la palabra casa, el contador vale dos. No aumentamos nada cuando vemos c o s.', { code: String.raw`#include <iostream>
#include <string>
using namespace std;

int main() {
    string palabra = "casa";
    int cantidad = 0;
    for (int i = 0; i < palabra.size(); ++i) {
        if (palabra[i] == 'a') {
            ++cantidad;
        }
    }
    cout << cantidad << '\n';
    return 0;
}` }],
    ['Elige cómo leer el texto', 'cin lee una palabra hasta encontrar un espacio. Si la entrada dice casa azul, una lectura de este tipo obtiene casa. Para recibir toda la línea, usamos getline. Elegimos la lectura según lo que pide el problema, no según cuál parezca más corta.'],
    ['Compara lo que realmente guardaste', 'La letra A y la letra a son caracteres distintos. Si el ejercicio habla solo de minúsculas, podemos aprovechar esa condición. Si acepta ambas, tenemos que decidir cómo contarlas. El programa no adivina que queremos tratar dos símbolos diferentes como si fueran iguales.', { check: { question: 'Si contamos únicamente la letra a minúscula en Ana, ¿cuántas hay?', answer: 'Una. La primera letra es A mayúscula y no coincide con a.' } }],
    ['Empieza con texto sencillo', "En estos ejemplos usamos letras simples que ocupan un byte, como a, b o c. Con texto UTF-8, una letra acentuada puede ocupar varios bytes y string cuenta esos bytes. Por eso no generalizaremos todavía el recorrido a cualquier texto. Para casa, predice el contador tras cada letra y compruébalo con el programa."],
  ]),
  'funciones': guided('Una función reúne una tarea con nombre, recibe lo necesario y puede devolver un resultado.', [
    ['Dale un nombre a una tarea', "Necesitas calcular el doble de cuatro y luego el doble de siete. La operación es la misma; cambia el número. Podemos escribirla una vez en una función llamada doble. Una llamada entrega un dato a esa función y recibe el resultado de ejecutar sus instrucciones con él."],
    ['Aclara qué necesita recibir', 'doble necesita un número. Dentro de su definición podemos llamarlo x; ese nombre es un parámetro, es decir, el lugar que recibirá el dato. Cuando pedimos doble de cuatro, x toma el valor cuatro para esa llamada concreta a la función.'],
    ['Aclara qué debe devolver', 'La función calcula x por dos y usa return para terminar esa llamada y devolver el resultado. Devolver no es mostrar en pantalla. El resultado queda disponible para quien hizo la llamada, que puede guardarlo, sumarlo con otro número o mostrarlo después.'],
    ['Sigue dos llamadas separadas', 'Primero pedimos doble de cuatro y recibimos ocho. Después pedimos doble de siete y recibimos catorce. Cada llamada utiliza su propio dato de entrada. Que la primera llamada usara cuatro no obliga a que las siguientes conserven ese mismo valor.', { picture: { caption: 'La tarea es la misma; cambia el dato que recibe.', rows: [{ label: 'Entrada', values: ['4', '7'] }, { label: 'Operación', values: ['4 × 2', '7 × 2'] }, { label: 'Devuelve', values: ['8', '14'] }] }, code: String.raw`#include <iostream>
using namespace std;

int doble(int x) {
    return x * 2;
}

int main() {
    cout << doble(4) << '\n';
    cout << doble(7) << '\n';
    return 0;
}` }],
    ['Prueba la tarea por separado', 'Antes de usar doble dentro de un programa grande, comprueba algunos números pequeños. Si conocemos bien lo que recibe y devuelve, podemos revisar esta pieza sin seguir todas las demás. También debemos decir si hay valores que la función no admite.', { check: { question: '¿Qué devuelve doble de cero? ¿Aparece necesariamente en pantalla?', answer: 'Devuelve cero. Solo aparece en pantalla si alguna instrucción decide mostrar ese resultado.' } }],
    ['Divide cuando la tarea sea clara', "Una función es útil cuando su tarea se puede describir con precisión: recibe una lista no vacía y devuelve su mayor, por ejemplo. Ese acuerdo ayuda a probarla por separado. No necesitas convertir cada línea en una función; separa tareas que tengan entradas, resultados o condiciones que puedas explicar sin leer todo el programa."],
  ]),
  'preparar-concurso': guided('Ensaya cómo elegir, probar y revisar problemas antes del día del concurso.', [
    ["Un simulacro con varios problemas", "En un simulacro tienes varios problemas y un tiempo limitado. Resolverlos exige decidir dónde empezar, cuánto insistir y cuándo probar el código. Puedes ensayar esas decisiones con ejercicios de esta guía. Guarda tus intentos y una nota del momento en que cambias de problema; servirán para revisar qué te detuvo."],
    ['Mira primero qué hay', "Lee todos los problemas antes de elegir. Anota cuáles entiendes, dónde tienes un procedimiento y cuáles necesitan una segunda lectura. No tienes que resolverlos en el orden de presentación. Una idea conocida permite empezar con una tarea concreta que puedas implementar y comprobar."],
    ['Pon una meta al primer intento', "Para el primer problema, escribe entrada, salida y un ejemplo resuelto a mano. Explica el procedimiento antes de programar. Si no aparece una observación nueva, anota la duda y considera pasar temporalmente a otro; esa nota permite retomar sin reconstruir todo el intento."],
    ['Reserva tiempo para comprobar', 'Que el programa compile no significa que resuelva el problema. Prueba el ejemplo y otros casos pequeños que puedas verificar tú. Incluye el valor más pequeño permitido y los empates si importan. Conserva el código que ya funciona antes de intentar una mejora grande.'],
    ["Comparar respuesta esperada y obtenida", 'Si una prueba falla, escribe qué esperabas y qué obtuviste. Investiga esa diferencia antes de volver a enviar. Cambiar cosas sin una explicación puede ocultar el fallo en una prueba y crear otro diferente. Busca la primera decisión que no coincide con tu plan.', { check: { question: 'Tu código compila, pero para tres cajas de seis lápices devuelve 9. ¿Ya está listo?', answer: 'No. La respuesta esperada es 18; debemos revisar la operación y repetir la prueba.' } }],
    ["Revisar un problema incompleto", "Al terminar, elige un problema incompleto y localiza la causa: lectura del enunciado, elección del método, código o pruebas. Corrígelo con calma. Si consultaste una solución, ciérrala y reconstruye la idea; días después, vuelve a intentarlo sin apuntes. Esa repetición comprueba qué recuerdas cuando la explicación ya no está delante."],
  ]),
};
