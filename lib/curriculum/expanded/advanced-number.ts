import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const numberExpansions: Record<string,LessonExpansion> = {
'usaco-adv-extend-euclid': chapter('usaco-adv-extend-euclid', [
['Deshaz las divisiones con un ejemplo completo', 'Con 35 y 22 las divisiones son 35 = 1·22 + 13, 22 = 1·13 + 9, 13 = 1·9 + 4 y 9 = 2·4 + 1. Ahora regresamos: 1 = 9 − 2·4 = 3·9 − 2·13 = 3·22 − 5·13 = 8·22 − 5·35. Obtuvimos x = −5 e y = 8 sin adivinar. Cada sustitución conserva la igualdad. La función recursiva automatiza exactamente estas sustituciones: no es una fórmula misteriosa.\n\nSi queremos 35x + 22y = 7, multiplicamos ambos coeficientes por siete y obtenemos (−35, 56). Todas las soluciones son x = −35 + 22t e y = 56 − 35t. Sustituye para ver que los términos con t se cancelan. Elegir t = 2 produce (9, −14); la ecuación sigue siendo cierta, aunque no satisfaga una condición adicional de no negatividad.'],
['Añade restricciones sin perder soluciones', 'Para 6x + 10y = 38 podemos dividir entre dos y usar la solución x = 3, y = 2 de 3x + 5y = 19. La familia completa es x = 3 + 5t, y = 2 − 3t. Si x e y deben ser no negativos, la primera desigualdad exige t ≥ ceil(−3/5) = 0 y la segunda t ≤ floor(2/3) = 0. Hay una única solución no negativa. No basta encontrar una pareja de Bézout: debes intersectar los intervalos de t.\n\nEn C++, −3/5 da cero, pero floor(−3/5) vale −1. Para dividir a entre b positivo con piso, usa q = a/b y resta uno a q si a%b es negativo. El techo se obtiene como −floor(−a/b), siempre que negar a no desborde. En problemas con límites enormes, analiza también los productos de coeficientes y no solo las entradas.'],
['Construye el teorema chino del resto', 'Supón x ≡ r módulo m y x ≡ s módulo n. Escribe x = r + mt. La segunda condición equivale a mt ≡ s−r módulo n. Sea g = gcd(m,n). Si g no divide s−r, no hay solución. Si lo divide, m/g tiene inverso módulo n/g y t = ((s−r)/g)·inverso(m/g) módulo n/g. Entonces x = r + mt, con periodo m·(n/g). Normaliza el resultado al intervalo desde cero hasta periodo−1.\n\nPor ejemplo, x ≡ 2 módulo 6 y x ≡ 5 módulo 9: g = 3 divide la diferencia. Queda 2t ≡ 1 módulo 3; t = 2 y x = 14. Las respuestas son 14, 32, 50… En cambio, residuos 2 y 4 son incompatibles. Para muchas congruencias combina de dos en dos y conserva el residuo y periodo de cada combinación.'],
['Cuándo usar cada herramienta', 'Euclides extendido funciona también con módulos compuestos. La potencia a^(m−2) no es un sustituto general: necesita un módulo primo y a no divisible por él. Un inverso puede no existir; devolver cero en ese caso confunde una ausencia con una respuesta. El ejercicio usa −1 como señal explícita.\n\nEmpieza probando módulos pequeños por enumeración: busca un x en [0,m) que cumpla a·x mod m = 1 y compara con tu algoritmo. Después prueba a múltiplo de m, a = 1 y números coprimos grandes. Ese programa lento es una herramienta de verificación independiente, no una demostración para todos los enteros.']
], [reflect('familia','Cuenta soluciones no negativas','Encuentra todas las soluciones enteras no negativas de 4x + 6y = 24. Explica por qué tu lista está completa.',['Divide la ecuación entre dos.','Una solución de 2x + 3y = 12 es (6,0); escribe su familia.'],'La familia es x = 6 + 3t, y = −2t. Las restricciones dan −2 ≤ t ≤ 0. Para t = −2, −1 y 0 aparecen (0,4), (3,2) y (6,0). No hay otras: toda solución de una ecuación diofántica difiere de la inicial en un múltiplo de (3,−2), y los tres valores de t son los únicos enteros del intervalo.'),program('inverso','Inverso sin suponer primo','Entrada: a y m, con 1 ≤ a ≤ 1000000000 y 2 ≤ m ≤ 1000000000. Imprime el menor x no negativo tal que a·x ≡ 1 módulo m; imprime −1 si no existe.',['Calcula g, x, y con ax + my = g.','Si g = 1, normaliza x con (x % m + m) % m.'],'Bézout prueba tanto la existencia como la imposibilidad. Cuando g = 1, ax difiere de uno en un múltiplo de m. Cuando g > 1, cualquier ax + my es divisible por g y no puede ser uno. La normalización conserva la congruencia. Usamos long long para productos intermedios; las cotas del ejercicio son moderadas. Tiempo O(log m) tras reducir a módulo m y memoria O(log m) por la recursión.',String.raw`#include <iostream>
using namespace std;
long long eg(long long a, long long b, long long &x, long long &y) {
    if (b == 0) {
        x = 1;
        y = 0;
        return a;
    }
    long long u, v;
    long long g = eg(b, a % b, u, v);
    x = v;
    y = u - (a / b) * v;
    return g;
}
int main() {
    long long a, m, x, y;
    cin >> a >> m;
    long long g = eg(a % m, m, x, y);
    if (g != 1)
        cout << -1 << '\n';
    else
        cout << (x % m + m) % m << '\n';
}
`,[['3 11\n','4\n'],['6 9\n','-1\n'],['1 2\n','1\n'],['17 40\n','33\n']])]),
'usaco-adv-catalan': chapter('usaco-adv-catalan',[
['Construye la recurrencia con el primer par','Una secuencia balanceada nunca tiene más cierres que aperturas en un prefijo, y termina con cantidades iguales. Toda secuencia no vacía se escribe de manera única como (A)B, donde A y B también están balanceadas. Si hay n pares y A tiene i, B tiene n−1−i. Para esa elección hay C[i]·C[n−1−i] posibilidades. Sumamos i desde cero hasta n−1.\n\nC[0] = 1 cuenta la secuencia vacía, una opción real que hace funcionar los extremos. C[1] = 1; C[2] = C[0]C[1] + C[1]C[0] = 2; C[3] = 2+1+2 = 5. Las cinco secuencias son ((())), (()()), (())(), ()(()) y ()()(). Clasificarlas por el cierre que corresponde al primer símbolo demuestra que no duplicamos ni omitimos ninguna.'],
['Del camino a la fórmula cerrada','Interpreta abrir como subir uno y cerrar como bajar uno. De los binom(2n,n) caminos que regresan a altura cero, algunos pasan por −1. En cada camino malo refleja el prefijo hasta su primera llegada a −1: intercambia subidas y bajadas de ese prefijo. Obtienes un camino con n+1 subidas y n−1 bajadas. La operación inversa refleja hasta la primera llegada a +1; por eso es una correspondencia exacta.\n\nHay binom(2n,n−1) caminos malos. Al restarlos obtenemos C[n] = binom(2n,n) − binom(2n,n−1) = binom(2n,n)/(n+1). Esta prueba explica de dónde sale la división. No significa que se pueda usar división ordinaria después de tomar módulo: allí dividir exige un inverso que tal vez no exista.'],
['Reconoce la misma descomposición en otros objetos','Un árbol binario ordenado con n nodos internos se separa en su raíz y dos subárboles con i y n−1−i nodos internos. «Ordenado» significa que el hijo izquierdo y el derecho tienen papeles distintos. Esa distinción es necesaria para la misma recurrencia. Las triangulaciones de un polígono convexo con n+2 vértices también se cuentan con C[n]: fija un lado y distingue el triángulo que lo toca; sus otros dos lados separan dos polígonos menores.\n\nEn ejercicios nuevos busca una decisión que produzca dos partes independientes, no solamente una palabra como árbol o paréntesis. Si la forma de combinar introduce restricciones entre las partes, multiplicar sus conteos puede ser incorrecto. Por ejemplo, limitar la altura de los paréntesis necesita recordar esa cota en el estado.'],
['Elige un cálculo seguro y comprueba la base','La DP de la recurrencia tarda O(n²) y usa O(n) memoria; es una opción clara para n de pocos miles. Para n grande y módulo primo P, factoriales e inversos permiten la fórmula en O(n) de preparación si 2n < P. Si el denominador es múltiplo de P, no puedes aplicar ese esquema directamente. La recurrencia sigue siendo válida con cualquier módulo, aunque sea más lenta.\n\nLos Catalan crecen deprisa: no asumas que caben en long long sin revisar n. En el ejercicio trabajamos módulo 1000000007 y reducimos cada suma y producto. Para depurar, calcula primero 1,1,2,5,14,42. Si C[2] da uno, probablemente olvidaste que el interior puede estar vacío o que el sufijo puede estar vacío.']
],[reflect('altura','Una restricción cambia el estado','¿Cuántas secuencias balanceadas de tres pares tienen altura máxima a lo sumo dos? Escribe la lista y describe una DP para cualquier n y altura H.',['De las cinco secuencias de tres pares, una alcanza altura tres.','Usa el número de símbolos escritos y el balance actual.'],'Son cuatro: (()()), (())(), ()(()) y ()()(). Se excluye ((())). Define dp[pos][b] como el número de prefijos legales de longitud pos y balance b. Parte de dp[0][0]=1. Puedes abrir si b<H y cerrar si b>0, siempre que no excedas n aperturas, que se deducen como (pos+b)/2. La respuesta es dp[2n][0]. Mantener el balance evita aceptar un cierre prematuro; limitarlo a H elimina exactamente los prefijos demasiado altos.'),program('parentesis','Cuenta mensajes balanceados','Entrada: un entero n (0 ≤ n ≤ 1000). Salida: número de secuencias balanceadas de n pares de paréntesis, módulo 1000000007.',['Usa la descomposición única (A)B.','No olvides C[0] = 1.'],'Calculamos C[k] a partir de valores con índices menores que k. Cada producto elige de forma independiente un interior y un sufijo. Cada secuencia tiene una única pareja correspondiente a su primer paréntesis, así que aparece una vez. Guardamos un vector de n+1 valores y hacemos 1+2+…+n transiciones: O(n²) tiempo y O(n) memoria.',String.raw`#include <iostream>
#include <vector>
using namespace std;
int main() {
    int n;
    cin >> n;
    const long long M = 1000000007;
    vector<long long> c(n + 1);
    c[0] = 1;
    for (int k = 1; k <= n; k++)
        for (int i = 0; i < k; i++)
            c[k] = (c[k] + c[i] * c[k - 1 - i]) % M;
    cout << c[n] << '\n';
}
`,[['3\n','5\n'],['0\n','1\n'],['4\n','14\n'],['5\n','42\n']])]),
'usaco-adv-xor-basis': chapter('usaco-adv-xor-basis',[
['Traduce números a vectores de ceros y unos','El número 6 es 110 en binario: piensa en el vector (1,1,0). XOR suma cada coordenada módulo dos. Por eso 6 XOR 3 = 110 XOR 011 = 101 = 5. Sumar dos veces el mismo vector da cero; no hay acarreos. Un conjunto genera todos los XOR de sus subconjuntos, incluido el subconjunto vacío, cuyo resultado es cero.\n\nCon {6,3,5}, el tercer número ya está generado por los primeros. Añadirlo aumenta la cantidad de subconjuntos, pero no la cantidad de valores distintos. Una base conserva solamente vectores independientes: los suficientes para representar todo sin guardar redundancias. Si tiene rango r, existen exactamente 2^r valores representables porque cada combinación de esos r vectores es distinta.'],
['Inserta un número cancelando su bit principal','Guarda base[b] con bit más alto b. Al insertar x, recorre bits de mayor a menor. Si x tiene el bit b y ya existe base[b], cambia x por x XOR base[b]; el bit b desaparece y no se crean bits mayores. Si no existe pivote, coloca x allí y termina. Si x llega a cero, era combinación de los anteriores.\n\nInserta 6: queda base[2]=110. Inserta 3: queda base[1]=011. Inserta 5: 101 XOR 110 = 011; después XOR 011 = 000. Rechazamos solamente la redundancia, no el dato original para otras tareas. El proceso conserva el espacio generado porque reemplazar x por x XOR un vector existente es reversible. Además termina: el bit principal baja en cada cancelación.'],
['Consulta pertenencia y construye el máximo','Para preguntar si t puede formarse, cancela sus bits con los mismos pivotes. Si necesitas un pivote que no existe, es imposible; si llegas a cero, es posible. Para maximizar el XOR, empieza respuesta=0 y recorre los pivotes desde el más alto. Si respuesta XOR base[b] es mayor, realiza el cambio. Ningún pivote posterior tiene un bit mayor que b, por lo que no puede deshacer una decisión sobre un bit más importante.\n\nCon {6,3}, de cero pasamos a seis usando 110. Hacer XOR con 011 daría cinco, menor que seis, así que lo evitamos. El máximo es seis, aunque el XOR de todos sea cinco. «XOR máximo de un subconjunto» y «XOR de todo el arreglo» son problemas diferentes.'],
['Extensiones, costos y límites de la representación','Con B bits, insertar o consultar cuesta O(B), construir n valores O(nB) y la memoria de la base O(B). Para recuperar qué índices forman un resultado, acompaña cada pivote con una máscara o una representación de su combinación de elementos originales y aplica los mismos XOR a esos certificados. Si n es grande, una máscara de 64 bits no basta.\n\nPara enumerar el k-ésimo XOR en orden numérico hace falta reducir también los bits menores de los pivotes; leer sin más la base triangular no garantiza el orden. Para el máximo no se requiere esa reducción adicional. Usa desplazamientos sobre tipos sin signo y un ancho coherente con las restricciones; desplazar un int 40 posiciones es inválido. El ejercicio limita los números a menos de 2^30 y utiliza unsigned long long para operar con margen.']
],[reflect('rango','Más subconjuntos no significa más resultados','Para los números 1,2,3,4, determina el rango, cuántos XOR distintos existen y cuántos subconjuntos producen cero. Justifica las tres respuestas.',['El 3 es 1 XOR 2.','Hay 16 subconjuntos en total y cada resultado tiene la misma cantidad de representaciones.'],'Los vectores 1,2,4 son independientes y 3 es redundante: rango 3. Hay 2³=8 resultados distintos, exactamente de cero a siete. El núcleo tiene tamaño 2^(4−3)=2, así que dos subconjuntos producen cero: el vacío y {1,2,3}. Agregar {1,2,3} por diferencia simétrica transforma cualquier representación en la otra sin cambiar su XOR.'),program('maximo','La señal más grande','Entrada: n (1 ≤ n ≤ 100000), seguido de n enteros a[i] (0 ≤ a[i] < 2^30). Imprime el mayor XOR de un subconjunto; puedes elegir el vacío.',['Construye un pivote por bit, de 29 a 0.','Una vez construida la base, mejora la respuesta del bit más alto al más bajo.'],'Cada cancelación preserva las combinaciones representables. Al construir el máximo, elegir la mejor posibilidad para el bit más significativo disponible es seguro porque las decisiones posteriores solo afectan bits inferiores. El subconjunto vacío permite devolver cero cuando todos los datos son cero. Tiempo O(30n), memoria O(30).',String.raw`#include <iostream>
#include <array>
using namespace std;
int main() {
    int n;
    cin >> n;
    array<unsigned long long, 30> b{};
    for (int i = 0; i < n; i++) {
        unsigned long long x;
        cin >> x;
        for (int j = 29; j >= 0; j--)
            if ((x >> j) & 1ULL) {
                if (b[j])
                    x ^= b[j];
                else {
                    b[j] = x;
                    break;
                }
            }
    }
    unsigned long long ans = 0;
    for (int j = 29; j >= 0; j--)
        if ((ans ^ b[j]) > ans)
            ans ^= b[j];
    cout << ans << '\n';
}
`,[['3\n6 3 5\n','6\n'],['4\n1 2 3 4\n','7\n'],['3\n0 0 0\n','0\n'],['1\n536870912\n','536870912\n']])]),
};
