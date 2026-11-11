export const coreDepth: Record<string, [string,string][]> = {
'que-es-programar':[
 ['Una traza completa con objetos reales',"Hay seis cables en una caja y cuatro en otra. Llegan a tu mesa diez cables; al entregar tres quedan siete. Escribe los estados 6 + 4 = 10 y 10 − 3 = 7. La misma regla con nueve, dos y cinco produce seis. Lo que contamos son cables, no cajas: conserva las unidades para no sumar cantidades que representan cosas distintas."],
 ['Encuentra una instrucción ambigua',"«Entrega unos cables» no indica una cantidad que el programa pueda usar. Necesitas recibirla o conocer una regla para calcularla. Si el enunciado garantiza existencias suficientes, puedes restar directamente. Si permite pedir más cables de los disponibles, debe explicar qué hacer en ese caso. El algoritmo aplica las reglas dadas; no puede decidir por su cuenta una regla ausente."]
],
 'tu-primer-programa':[
 ['Sigue la salida como si fuera una cinta',"cout escribe \"Equipo\", luego un espacio y después \"Morelos\\n\". La salida contiene Equipo Morelos: seis letras, un espacio y siete letras, seguidas por un salto de línea. El segundo cout agrega texto después del primero; no lo borra ni inserta separadores. Si cambias el espacio por \\n, obtendrás dos líneas."],
 ['Tres fallos pequeños y cómo distinguirlos',"Compara tres cambios: quitar una comilla impide compilar; escribir Morelo puede compilar pero muestra un texto distinto; repetir la instrucción produce dos mensajes cuando se pidió uno. Solo el primero viola una regla del lenguaje. Para localizarlo, cambia una cosa a la vez y lee el primer diagnóstico; para los otros dos, compara la salida con el texto solicitado."]
 ],
 'entrada-y-salida':[
 ['Traza qué dato recibe cada variable',"La entrada indica existencias iniciales, recibidas y entregadas: 8 5 4. Leídas en ese orden, la cuenta es 8 + 5 − 4 = 9. Si intercambias el significado de las dos últimas lecturas, obtienes 8 + 4 − 5 = 7. Ambas operaciones compilan: el compilador no conoce el significado de los nombres que elegiste."],
 ['Comprueba formato antes de buscar una fórmula nueva',"Para sumar cero y doce, escribe 0 12. Los textos a=0, b=12 o Entrada no pertenecen al formato de dos enteros y pueden impedir la lectura. Los encabezados del enunciado distinguen las muestras, pero no se copian al panel. Antes de cambiar la fórmula, revisa qué valores se leyeron y si coinciden con los que querías probar."]
 ],
 'variables-y-operaciones':[
 ['Actualizaciones que usan el valor anterior',"Con fichas = 14, la asignación paquetes = fichas / 4 guarda tres paquetes y deja fichas en catorce. Después fichas %= 4 guarda el sobrante, dos. Si haces primero la segunda operación, fichas baja a dos y el cálculo de paquetes produce cero. La división sola no modifica sus operandos; la asignación determina qué variable cambia."],
 ['Una prueba que revela truncamiento',"En double promedio = 7 / 2, ambos operandos son enteros: primero se calcula 3 y después se guarda como 3.0. Para obtener 3.5, usa un operando decimal, como 7.0 / 2. Pero si buscas parejas completas entre siete personas, tres sí es la respuesta adecuada. Decide si la cantidad admite fracciones antes de elegir la operación."]
 ],
 'tu-primer-problema':[
 ['Construye un pequeño expediente de solución',"Con vehículos de cuatro lugares, prueba n = 0, 1, 4, 5 y 8: necesitas 0, 1, 1, 2 y 2 vehículos. Calcula los grupos completos y añade uno cuando haya sobrantes. Menos vehículos no pueden bastar porque su capacidad total quedaría por debajo de n; el procedimiento sí acomoda a todas las personas."],
 ['Compara tres soluciones propuestas',"n / 4 falla para cinco personas: entrega uno y deja a alguien fuera. n / 4 + 1 falla para cuatro y para cero porque añade un vehículo innecesario. La expresión n / 4 + (n % 4 != 0) distingue ambos casos. Conserva esas entradas como pruebas de la regla general, sin añadir excepciones dedicadas a cada número."]
 ],
 'condicionales':[
 ['Construye una tabla de verdad de una regla',"Para aceptar edades de 12 a 18, compara ambos límites. Con 11 obtienes falso y verdadero; con 12 o 18, verdadero y verdadero; con 19, verdadero y falso. && acepta solo el segundo grupo. Si un pase permite entrar sin importar la edad, escribe (edad >= 12 && edad <= 18) || pase: el pase es una alternativa al intervalo completo."],
 ['El orden de las ramas puede ocultar casos',"Para clasificar ALTO desde 100 y MEDIO desde 50, pregunta primero si el valor alcanza 100. Si preguntas >= 50 primero en una cadena else if, también capturas los valores altos y nunca llegas a su rama. Prueba 49, 50, 99 y 100. Cada else if se evalúa solamente después de que las condiciones anteriores fueron falsas."]
 ],
 'ciclos':[
 ['Una tabla para revisar el invariante',"Al sumar [3,0,−2,5], el total empieza en cero y pasa por 3, 3, 1 y 6. La vuelta del cero no cambia la suma, pero sí procesa un dato. Por eso el contador de elementos y el acumulador representan cosas distintas. Tras k vueltas, has leído k números y guardas su suma, aunque algunos no la hayan aumentado."],
 ['Un ciclo puede terminar demasiado pronto o nunca',"Si un for incrementa i en su encabezado y también en el cuerpo, avanzas dos posiciones por vuelta. Con n = 5 puedes visitar 0, 2 y 4 y omitir las demás. El error contrario aparece en un while que nunca actualiza la condición: no termina. Una prueba con n = 1 permite revisar el primer avance sin una traza larga; el límite de tiempo del laboratorio solo detiene el fallo, no lo corrige."]
 ],
 'arreglos':[
 ['Traza una transformación sin perder posiciones',"Para duplicar [3,7,2,9], conserva cada posición: b[i] = 2 * a[i] produce [6,14,4,18]. El siete es un valor, no el índice del segundo elemento. Escribir b[a[i]] confunde ambas cosas y puede salir del arreglo. Usar un valor como índice solo tiene sentido en otra tarea, como contar frecuencias, cuando su rango cabe en el arreglo elegido."],
 ['Revisa el caso más pequeño antes de vecinos',"Para comparar a[i] con a[i + 1], necesitas i + 1 < n. Una lista de tamaño uno no tiene parejas vecinas; una de dos tiene una y una de cuatro tiene tres. Si n es positivo, hay n − 1 parejas. Antes de consultar a[0], descarta el caso vacío si está permitido; un valor inventado fuera del arreglo no resuelve ese acceso inválido."]
 ],
 'cadenas':[
 ['Una traza de conteo letra por letra',"Recorre morelos y registra el contador de vocales: después de cada letra vale 0, 1, 1, 2, 2, 3 y 3. Hay siete letras y tres apariciones de vocales. Si pidieran vocales distintas, la respuesta sería dos, e y o. Contar apariciones suma cada coincidencia; registrar presencia solo recuerda si alguna vez apareció."],
 ['Límites de texto que conviene hacer explícitos',"La comparación c == 'a' no acepta 'A'. Si el enunciado garantiza minúsculas, esa comparación basta; si acepta ambos casos, debes tratarlos según la regla indicada. Con acentos surge otra diferencia: en UTF-8, á puede ocupar varios bytes. Un char no representa necesariamente una letra visible. Por eso los primeros ejercicios especifican letras a–z."]
 ],
 'funciones':[
 ['Sigue dos llamadas independientes',"perimetro(3,4) devuelve 2 × (3 + 4) = 14. Otra llamada, perimetro(2,5), calcula también 14 con sus propios parámetros. main puede sumar ambos resultados y obtener 28. Si la función imprimiera 14 en lugar de devolverlo, esa salida no se convertiría en un operando de la suma. El valor de return permite continuar el cálculo."],
 ['Un contrato también debe decir qué entradas admite',"Una función promedio(suma,cantidad) necesita cantidad distinta de cero si va a dividir. Esa condición debe cumplirse por los límites de entrada o comprobarse antes de la llamada. Para un perímetro, especifica qué representan ambos lados y prueba un cuadrado, un rectángulo y valores grandes. Probar una operación aislada facilita distinguir errores de cálculo de errores al leer o imprimir."]
 ]
};
