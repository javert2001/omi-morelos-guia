import type { Lesson } from '../types.ts';

/** Questions that need to follow the new worked example, rather than the former one. */
export const basicsQuizzes: Record<string, Lesson['quiz']> = {
  'entrada-y-salida': {
    question: 'El programa recibe 20 6: hay veinte cuadernos y entregamos seis. ¿Qué debe escribir?',
    options: ['20 6', '14', '26'], answer: 1,
    explanation: 'La primera cantidad es la disponible y la segunda la entregada. El programa calcula t − e, es decir, 20 − 6 = 14.',
  },
  condicionales: {
    question: 'La temperatura es 25. ¿Qué camino toma el programa?',
    options: ['FRIO, porque no supera 25', 'AGRADABLE, porque no es menor que 15 y sí cumple t <= 25', 'CALOR, porque 25 queda fuera del intervalo'], answer: 1,
    explanation: 'La primera condición, t < 15, es falsa. La segunda, t <= 25, es verdadera. El extremo 25 pertenece al intervalo agradable.',
  },
  'usaco-general-expected-knowledge': {
    question: 'Ya leíste 5 y 2: el mayor es 5 y su frecuencia es 1. Ahora llega 7. ¿Qué debes guardar?',
    options: ['Mayor 7 y frecuencia 2', 'Mayor 5 y frecuencia 1', 'Mayor 7 y frecuencia 1'], answer: 2,
    explanation: 'El 7 reemplaza al mayor anterior. Su frecuencia empieza en uno, porque las apariciones de 5 no son apariciones de 7.',
  },
  'usaco-general-modules': {
    question: 'Después de enseñar a contar la letra a en una palabra, ¿qué ejercicio añade una dificultad cercana?',
    options: ['Contar todas las vocales conservando el recorrido y cambiando la condición', 'Calcular el camino más corto de un grafo sin presentar grafos', 'Aprender todas las características de C++'], answer: 0,
    explanation: 'Contar vocales mantiene la lectura, el recorrido y el contador. La parte nueva es la condición que reconoce cualquiera de cinco letras.',
  },
  'usaco-general-working-mdx': {
    question: '¿Qué puede añadir MDX a un texto escrito en Markdown?',
    options: ['Componentes interactivos, si el sitio sabe procesarlos', 'Una garantía automática de que el código es correcto', 'Una obligación de quitar todos los títulos'], answer: 0,
    explanation: 'MDX permite integrar componentes además del texto. Esa posibilidad depende del entorno que lo procesa; no convierte cualquier archivo Markdown en una aplicación.',
  },
  'usaco-general-generic-code': {
    question: 'La plantilla mayor compara a > b y devuelve uno de los valores. ¿Qué necesita su tipo T?',
    options: ['Ser siempre int', 'Permitir esa comparación y copiar el valor devuelto', 'Ocupar exactamente ocho bytes'], answer: 1,
    explanation: 'La plantilla solo sirve para tipos que admiten las operaciones que escribe su cuerpo. No funciona con cualquier tipo por el solo hecho de usar T.',
  },
  'pensar-en-algoritmos': {
    question: 'Hay once lápices y tres cuadernos. Cada paquete usa dos lápices y un cuaderno. ¿Por qué no podemos preparar cinco paquetes?',
    options: ['Porque once no se divide exactamente entre dos', 'Porque cinco paquetes necesitarían cinco cuadernos y solo hay tres', 'Porque siempre hay que dejar un lápiz sin usar'], answer: 1,
    explanation: 'Los lápices permiten cinco paquetes, pero los cuadernos solo tres. La respuesta tiene que respetar ambos límites.',
  },
  'usaco-bronze-simulation': {
    question: 'El saldo es 5 y llega R 6. Según las reglas de la alcancía, ¿qué sucede?',
    options: ['El saldo pasa a −1', 'El saldo se queda en 5', 'El saldo pasa a 0'], answer: 1,
    explanation: 'El retiro solo se acepta si saldo >= x. Como 5 no alcanza para 6, no se modifica el estado.',
  },
  'usaco-bronze-intro-complete': {
    question: '¿Qué condición representa una terna de posiciones distintas sin contar sus cambios de orden?',
    options: ['i <= j <= k', 'i < j < k', 'Permitir cualquier i, j y k'], answer: 1,
    explanation: 'Ordenar estrictamente los tres índices evita repetir una posición y deja una sola representación para cada grupo de tres posiciones.',
  },
  'usaco-bronze-ad-hoc': {
    question: '¿Por qué no puedes terminar en x = 2 después de exactamente tres pasos de +1 o −1?',
    options: ['Porque tres pasos nunca alcanzan una distancia de dos', 'Porque tras tres pasos la posición es impar y 2 es par', 'Porque solo se permite moverse a la izquierda'], answer: 1,
    explanation: 'Hay pasos suficientes en cantidad, pero cada movimiento cambia la paridad. Partiendo de cero, después de un número impar de pasos terminas en una posición impar.',
  },
};
