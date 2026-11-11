import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const numberExpansions: Record<string,LessonExpansion> = {
'usaco-adv-extend-euclid': chapter('usaco-adv-extend-euclid', [
["Recuperar los coeficientes", "Con 35 y 22, Euclides hace estas divisiones: 35=22+13, 22=13+9, 13=9+4 y 9=2·4+1. Para expresar el uno con los números iniciales, recorre las igualdades al revés: 1=9−2·4=3·9−2·13=3·22−5·13=8·22−5·35. Así obtienes x=−5 e y=8. Cada sustitución conserva la igualdad; la función recursiva repite esas sustituciones.\n\nSi buscas 35x+22y=7, multiplica por siete: una solución es (−35,56). Las demás son x=−35+22t, y=56−35t. Puedes comprobarlo al sustituir: los términos con t se cancelan. Por ejemplo, t=2 produce (9,−14). Sigue siendo una solución entera, aunque no cumple una posible restricción de no negatividad."],
["Restringir las soluciones", "Para 6x+10y=38, divide entre dos. La ecuación 3x+5y=19 tiene la solución (3,2), así que todas son x=3+5t, y=2−3t. Si ambos deben ser no negativos, necesitas t≥ceil(−3/5)=0 y t≤floor(2/3)=0. Solo sirve t=0. Encontrar una pareja inicial no termina el problema: debes intersectar las restricciones sobre t.\n\nCuidado al traducir pisos a C++: −3/5 da cero, mientras floor(−3/5)=−1. Con divisor b positivo, calcula q=a/b y resta uno si a%b es negativo. El techo puede calcularse como −floor(−a/b), siempre que negar a no desborde. Revisa también los productos intermedios de los coeficientes."],
["Combinar congruencias", "Quieres un x que deje residuo r al dividir entre m y residuo s al dividir entre n. Escribe x=r+mt. La segunda condición se vuelve mt≡s−r módulo n. Si g=gcd(m,n) no divide s−r, no hay solución. Si lo divide, despeja t=((s−r)/g)·inverso(m/g) módulo n/g. El resultado x=r+mt se repite cada m·(n/g); normalízalo a ese periodo.\n\nPor ejemplo, x≡2 módulo 6 y x≡5 módulo 9 llevan a 2t≡1 módulo 3. Sirve t=2: x=14. Las soluciones son 14,32,50… Los residuos 2 y 4, en cambio, son incompatibles porque tres no divide su diferencia. Para más condiciones, combina dos a la vez y conserva el residuo y el periodo obtenidos."],
["Inversos y casos de prueba", "Euclides extendido también sirve con módulos compuestos. La fórmula a^(m−2) requiere un módulo primo y que a no sea divisible por él. Cuando el inverso no existe, devuelve una señal explícita, como −1; cero podría confundirse con una respuesta válida.\n\nPara comprobar tu implementación, enumera x en [0,m) con módulos pequeños y busca cuál cumple a·x mod m=1. Compara con Euclides. Incluye a=1, múltiplos de m y pares coprimos grandes. Esa comparación detecta errores del código; la condición gcd(a,m)=1 es lo que demuestra cuándo existe el inverso."]
], [reflect('familia',"Soluciones no negativas","Encuentra todas las parejas de enteros x, y no negativos que cumplen 4x + 6y = 24. ¿Cómo puedes comprobar que no falta ninguna?",["Divide ambos lados entre dos. La ecuación queda 2x + 3y = 12.","Empieza con (x,y) = (6,0). Si aumentas x en tres, ¿cuánto debe cambiar y?"],"Partimos de (6,0). Todas las soluciones enteras tienen la forma x=6+3t, y=−2t. Para que x sea no negativo necesitas t≥−2; para que y sea no negativo, t≤0.\n\nSolo quedan t=−2,−1,0, que producen (0,4), (3,2) y (6,0). La familia obtenida con Euclides contiene todas las soluciones enteras. Al revisar todos los enteros de ese intervalo, también has revisado todas las que cumplen la restricción."),program('inverso',"Inverso modular","Recibes dos enteros a y m, con 1 ≤ a ≤ 1000000000 y 2 ≤ m ≤ 1000000000. Encuentra el menor entero x no negativo que cumpla a·x ≡ 1 módulo m. Imprime x, o −1 si no existe. El módulo puede ser compuesto.",["Euclides extendido obtiene x, y tales que ax+my=gcd(a,m). ¿Qué valor debe tener ese máximo común divisor?","Si obtienes un inverso negativo, llévalo al intervalo [0,m) con (x % m + m) % m."],"Calcula g=gcd(a,m) y los coeficientes de ax+my=g. Si g=1, al tomar residuos módulo m queda ax≡1: x es el inverso que buscas. Si g>1, cualquier ax+my es divisible por g y nunca puede valer uno. En ese caso devuelve −1.\n\nLa expresión (x%m+m)%m elige el representante entre cero y m−1 sin cambiar su residuo. El programa usa long long para los productos intermedios. Después de reducir a módulo m, Euclides tarda O(log m) y la versión recursiva usa O(log m) memoria.",String.raw`#include <iostream>
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
["Separar por la primera pareja","Toda secuencia balanceada no vacía se puede escribir de una sola forma como (A)B: A es el interior de la primera pareja y B lo que sigue. Con n parejas, si A usa i, B usa n−1−i. Para esa elección hay C[i]·C[n−1−i] posibilidades. Suma para i de cero a n−1.\n\nUsa C[0]=1, porque dejar una parte vacía es una elección. Obtienes C[1]=1, C[2]=2 y C[3]=5. Para tres parejas las secuencias son ((())), (()()), (())(), ()(()) y ()()(). Separarlas por el cierre correspondiente al primer símbolo muestra por qué no omites ni repites ninguna."],
["Una fórmula por reflexión","Dibuja cada apertura como un paso hacia arriba y cada cierre como uno hacia abajo. Hay binom(2n,n) caminos que terminan a altura cero. Para contar los que bajan de cero, refleja el prefijo hasta su primera llegada a −1: intercambia subidas y bajadas. Obtienes un camino con n+1 subidas y n−1 bajadas.\n\nLa operación es reversible: refleja hasta la primera llegada a +1. Por tanto hay binom(2n,n−1) caminos inválidos. Al restarlos, C[n]=binom(2n,n)−binom(2n,n−1)=binom(2n,n)/(n+1). Esta división es una igualdad entre enteros. Si calculas módulo un número, no puedes sustituirla sin más por una división entera o por un inverso que quizá no exista."],
["La misma cuenta en árboles y polígonos","En un árbol binario lleno, cada nodo interno tiene exactamente dos hijos. Si además está ordenado y tiene n nodos internos, se separa en la raíz y dos subárboles con i y n−1−i nodos internos. Los lados izquierdo y derecho tienen papeles distintos. Esa separación produce la misma recurrencia.\n\nPara triangular un polígono convexo de n+2 vértices, fija un lado y el triángulo que lo toca. Los otros dos lados del triángulo dejan dos polígonos menores. Al contar sus triangulaciones obtienes C[n].\n\nLa relación útil es la descomposición en dos partes independientes. Si impones una altura máxima a los paréntesis, por ejemplo, ya no puedes usar C[n] sin cambios: el estado debe recordar esa cota."],
["Costo y aritmética modular","La recurrencia necesita O(n²) tiempo y O(n) memoria. Para n grande y módulo primo P, puedes preparar factoriales e inversos y aplicar la fórmula en O(n) de preparación si 2n<P. Si un denominador es múltiplo de P, ese procedimiento no sirve directamente. La recurrencia sí funciona con cualquier módulo.\n\nLos valores crecen rápido; revisa si caben en long long. El ejercicio calcula módulo 1000000007 y reduce cada suma y producto. Comprueba primero 1,1,2,5,14,42. Si C[2] sale uno, revisa si permitiste que el interior o el sufijo estén vacíos."]
],[reflect('altura',"Paréntesis con altura limitada","Escribe las secuencias balanceadas de tres pares de paréntesis cuya altura nunca supere dos. La altura es la cantidad de aperturas que todavía no has cerrado. Después describe una DP para n pares y altura máxima H.",["De las cinco secuencias con tres pares, solo una llega a altura tres.","Al construir una secuencia, guarda cuántos símbolos llevas y cuántos paréntesis siguen abiertos."],"Las cuatro secuencias son (()()), (())(), ()(()) y ()()(). Descartas ((())) porque sus tres primeras aperturas llevan la altura a tres.\n\nDefine dp[pos][b] como la cantidad de prefijos válidos con pos símbolos y b aperturas sin cerrar. Empieza con dp[0][0]=1. Puedes abrir si b<H y todavía no has usado n aperturas; puedes cerrar si b>0. La cantidad de aperturas usadas es (pos+b)/2.\n\nLa respuesta está en dp[2n][0]: ya escribiste todos los símbolos y no queda ninguna apertura pendiente. Estas reglas impiden tanto cerrar antes de tiempo como superar H."),program('parentesis',"Contar secuencias balanceadas","Lee un entero n (0 ≤ n ≤ 1000). Imprime cuántas secuencias balanceadas puedes formar con n pares de paréntesis, módulo 1000000007. Para n=0 cuenta la secuencia vacía.",["Separa cada secuencia no vacía como (A)B. Si A usa i pares, ¿cuántos quedan para B?","Usa C[0]=1: dejar vacía una parte también es una elección."],"Para calcular C[k], elige cuántos pares irán dentro de la primera pareja. Si pones i dentro, quedan k−1−i después. Puedes combinar cualquiera de las C[i] secuencias interiores con cualquiera de las C[k−1−i] exteriores. Suma esos productos.\n\nCada secuencia tiene un único cierre correspondiente a su primera apertura, así que esta separación la cuenta una sola vez. Calcula k en orden creciente para tener disponibles los valores anteriores. El vector ocupa O(n) memoria y las 1+2+…+n transiciones requieren O(n²) tiempo.",String.raw`#include <iostream>
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
["Números como vectores de bits","Escribe 6 como 110 y 3 como 011. Aplicar XOR suma cada posición módulo dos, sin acarreos: 110 XOR 011=101, que vale cinco. Repetir un vector lo cancela. El subconjunto vacío produce cero.\n\nEn {6,3,5}, el cinco ya se forma con los otros dos. Agregarlo aumenta la cantidad de subconjuntos, pero no la de valores posibles. Una base elimina esa redundancia. Si contiene r vectores independientes, sus 2^r elecciones producen resultados diferentes; de otro modo, el XOR de dos elecciones iguales revelaría una dependencia."],
["Insertar mediante pivotes","Guarda en base[b] un número cuyo bit más alto sea b. Al insertar x, recorre de mayor a menor. Si ese bit está encendido y ya hay pivote, haz x XOR base[b]. El bit desaparece y no aparecen bits superiores. Si no hay pivote, guarda x. Si termina en cero, ya podías formarlo.\n\nInserta 6: base[2]=110. Inserta 3: base[1]=011. Para 5, primero 101 XOR 110=011; después 011 XOR 011=000. Cada cambio es reversible usando un vector existente, así que conservas las combinaciones posibles. El proceso termina porque el bit principal baja después de cada cancelación."],
["Pertenencia y XOR máximo","Para saber si puedes formar t, reduce sus bits con los pivotes. Si falta el pivote que necesitas, no se puede. Si llegas a cero, sí.\n\nPara maximizar el resultado, empieza en cero y recorre los pivotes de mayor a menor. Usa base[b] solo si respuesta XOR base[b] aumenta la respuesta. Los pivotes que faltan por revisar no tienen bits superiores a b, por lo que no pueden corregir una mala elección en un bit más importante.\n\nCon {6,3}, pasas de cero a seis. Usar después tres daría cinco, así que lo descartas. El XOR máximo de un subconjunto es seis; el XOR de toda la lista es cinco."],
["Reconstrucción, orden y costo","Con números de B bits, cada inserción o consulta cuesta O(B); construir la base cuesta O(nB) y ocupa O(B). Si también necesitas los índices elegidos, acompaña cada pivote con su combinación de elementos originales y aplica los mismos XOR. Una máscara de 64 bits solo alcanza si hay a lo sumo 64 índices.\n\nPara enumerar los resultados en orden numérico necesitas reducir también los bits inferiores de los pivotes. La base triangular basta para el máximo, pero no garantiza por sí sola el orden del k-ésimo XOR. Usa tipos sin signo para desplazar y revisa su ancho: desplazar un int 40 posiciones es inválido. El ejercicio usa valores menores que 2^30 y opera con unsigned long long."]
],[reflect('rango',"Valores que puede formar una base","Tienes los números 1,2,3,4. Calcula el rango de su base XOR, la cantidad de valores XOR distintos que puedes formar y cuántos subconjuntos producen cero. Incluye el subconjunto vacío.",["El número 3 se obtiene como 1 XOR 2. ¿Agrega un valor independiente?","Lista primero los XOR que formas con 1,2,4. Después piensa qué cambia al permitir también el 3."],"Los números 1,2,4 son independientes: cada uno enciende un bit distinto. El 3 ya se obtiene con 1 XOR 2, por lo que el rango es tres. Puedes formar 2³=8 valores, del cero al siete.\n\nDos subconjuntos producen cero: el vacío y {1,2,3}. Cada resultado tiene dos representaciones. Para pasar de una a la otra, cambia la presencia de 1,2,3: agrega los que faltan y quita los que estaban. Su XOR conjunto es cero, así que el resultado no cambia."),program('maximo',"XOR máximo","Lee n (1 ≤ n ≤ 100000) y después n enteros a[i], con 0 ≤ a[i] < 2^30. Imprime el mayor XOR que puedas obtener al elegir un subconjunto. Puedes elegir el subconjunto vacío, cuyo XOR es cero.",["Construye una base con un pivote por bit. Inserta cada número recorriendo los bits de 29 a 0.","Empieza la respuesta en cero. Revisa los pivotes de mayor a menor y usa uno solo si aumenta el resultado."],"Al insertar un número, cancela su bit más alto con el pivote correspondiente. Cada cancelación usa un valor que ya puedes formar, de modo que conservas las combinaciones posibles. Si aparece un bit sin pivote, guarda ahí el número restante.\n\nPara obtener el máximo, recorre la base de arriba hacia abajo. Acepta un XOR cuando aumenta la respuesta. Los pivotes siguientes solo afectan bits inferiores, así que no pueden mejorar una decisión equivocada en un bit superior.\n\nHay 30 bits por número: la construcción tarda O(30n) y la base ocupa O(30). Si todos los valores son cero, la respuesta también es cero.",String.raw`#include <iostream>
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
