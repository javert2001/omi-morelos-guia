import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const numberMoreExpansions: Record<string,LessonExpansion> = {
'usaco-adv-game-theory': chapter('usaco-adv-game-theory',[
["Definir el estado ganador","En este modelo hay dos jugadores, sin azar, que ven todo el estado y disponen de las mismas jugadas. Pierde quien no puede mover. Además, el juego termina: si las posiciones pueden repetirse indefinidamente, esta clasificación no contempla los posibles empates.\n\nUn estado gana si tiene al menos una jugada hacia uno perdedor. Pierde si todas sus jugadas llevan a estados ganadores; sin jugadas también pierde. Al retirar una o dos piedras, cero pierde, uno y dos ganan, y tres pierde. Continuar el cálculo muestra, por inducción, que pierden los múltiplos de tres."],
["Por qué usamos números de Grundy","Dos montones de una piedra ganan por separado, pero juntos forman una posición perdedora en Nim: retires el que retires, el rival toma el último. En cambio, (1,2) gana porque puedes dejar (1,1). Saber solo que cada componente gana no distingue ambos casos.\n\nAsigna g(s)=mex de los Grundy de sus sucesores. Mex es el menor entero no negativo ausente: mex({0,1,3})=2 y mex({1,4})=0. Sin sucesores, g=0. Calcula cada estado después de sus sucesores, por ejemplo de montones pequeños a grandes. El valor conserva la información necesaria para combinar juegos."],
["Combinar componentes con XOR","El Grundy de juegos independientes es el XOR de sus Grundy. Si vale cero, cualquier jugada cambia un componente a un Grundy diferente y deja un XOR no nulo. Si X≠0, elige un componente que tenga encendido el bit principal de X. Su objetivo g XOR X es menor que g; la definición de mex garantiza un sucesor con ese valor. Al mover allí dejas XOR cero.\n\nEn Nim, un montón h puede pasar a cualquier tamaño de cero a h−1, así que su Grundy es h. Con 3,4,5 el XOR es dos. Reduce el primer montón a uno: 1 XOR 4 XOR 5=0. Con retiradas restringidas, busca una jugada legal que produzca el Grundy requerido."],
["Variantes y límites","Si una jugada toca varios montones, no puedes tratarlos como independientes sin demostrarlo. Si las jugadas dependen del jugador, el juego no es imparcial. En Nim misère pierde quien toma la última piedra: cuando solo quedan montones de uno, ganas exactamente si hay una cantidad par. La estrategia final debe tener en cuenta esa excepción.\n\nPara un conjunto de retiradas S, calcular hasta tamaño M cuesta O(M·|S|). Hay a lo sumo |S| sucesores, así que su mex no supera |S| y basta un arreglo de marcas de tamaño |S|+1. Una repetición en unos pocos valores no demuestra periodicidad: justifícala antes de usarla para tamaños que no calculaste."]
],[reflect('mex',"Dos montones","En un turno puedes quitar una o dos piedras de un solo montón. Pierde quien no puede mover. Calcula los valores de Grundy para montones de tamaño 0,1,2,3,4,5. Si hay dos montones, de tamaños 2 y 5, ¿quién gana con juego óptimo?",["El montón vacío tiene Grundy cero. Para los demás, toma el mex de los valores a los que puedes llegar.","Combina los dos montones con XOR, no con suma."],"Para el montón vacío, g[0]=0. Desde uno solo llegas a cero: mex{0}=1. Desde dos llegas a valores uno y cero: mex{1,0}=2. Desde tres llegas a valores dos y uno: mex{2,1}=0. Al continuar obtienes 0,1,2,0,1,2.\n\nLos montones de tamaños dos y cinco tienen Grundy dos. Su XOR es 2 XOR 2=0, así que pierde quien empieza si ambos juegan bien. Cualquier movimiento cambia uno de esos valores; el otro jugador puede responder para recuperar un XOR igual a cero."),program('restas',"Quitar una, tres o cuatro piedras","La entrada comienza con n (1 ≤ n ≤ 1000). Después vienen n tamaños de montón, entre 0 y 100000. Forman una sola partida: en cada turno eliges un montón y quitas 1, 3 o 4 piedras, sin dejar una cantidad negativa. Pierde quien no puede mover. Imprime GANA si quien empieza puede ganar con juego óptimo, o PIERDE en caso contrario.",["Calcula g[s] para todos los tamaños hasta el mayor de la entrada. Usa solo los movimientos que quepan en s.","Cada estado tiene como mucho tres opciones, así que su mex está entre cero y tres. Combina los n valores con XOR."],"Prepara g[0]=0 y recorre los tamaños en orden creciente. Para cada s, marca los valores g[s−1], g[s−3] y g[s−4] que existan. El primer entero no marcado es g[s].\n\nCada turno afecta un solo montón y las reglas de los demás no cambian. Por eso puedes combinar sus valores de Grundy con XOR. Si el resultado es distinto de cero, imprime GANA; si es cero, imprime PIERDE. Con M igual al mayor tamaño, la preparación tarda O(M), leer y combinar los montones cuesta O(n) y el vector ocupa O(M).",String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    int m = 0;
    for (int &x : a) {
        cin >> x;
        m = max(m, x);
    }
    vector<int> g(m + 1);
    int moves[] = {1, 3, 4};
    for (int x = 1; x <= m; x++) {
        bool seen[4] = {};
        for (int d : moves)
            if (x >= d)
                seen[g[x - d]] = true;
        int v = 0;
        while (v < 4 && seen[v])
            ++v;
        g[x] = v;
    }
    int total = 0;
    for (int x : a)
        total ^= g[x];
    cout << (total ? "GANA" : "PIERDE") << '\n';
}
`,[['2\n1 1\n','PIERDE\n'],['1\n4\n','GANA\n'],['1\n2\n','PIERDE\n'],['3\n0 0 0\n','PIERDE\n'],['2\n1 4\n','GANA\n']])]),
'usaco-adv-prefix-sums-nt-1': chapter('usaco-adv-prefix-sums-nt-1',[
["Contar por divisor","Sea σ(k) la suma de divisores positivos de k. Para sumar σ(1)+…+σ(N), podrías factorizar cada número. Prueba otro orden: fija un divisor d. Aparece en d,2d,3d,…, por lo que aporta d·floor(N/d). La respuesta es entonces Σ d·floor(N/d), con d de uno a N.\n\nPara N=5, las aportaciones son 5,4,3,4,5, con total 21. La suma original da 1+3+4+7+6=21. Contaste las mismas parejas divisor-número en otro orden. El cálculo sigue siendo lineal, pero ahora puedes aprovechar que muchos cocientes consecutivos coinciden."],
["Procesar un bloque completo","Desde l, calcula q=floor(N/l) y r=floor(N/q). Todos los denominadores de [l,r] tienen cociente q. Su aportación es q·(l+r)·(r−l+1)/2. Continúa en r+1. Con N=12, los bloques son [1,1], [2,2], [3,3], [4,4], [5,6] y [7,12], con cocientes 12,6,4,3,2,1.\n\nHay O(√N) bloques: los denominadores hasta √N son pocos y los posteriores solo producen cocientes menores que √N. No confundas q=N/l con el final del bloque r=N/q. Tampoco avances l solo uno después de haber contado todo el intervalo."],
["Convolución de Dirichlet","Para funciones aritméticas, define (f*g)(n)=Σ f(d)g(n/d), sobre divisores d de n. Si ambas funciones valen uno, obtienes la cantidad de divisores. Si f(d)=d y g vale uno, obtienes σ(n). La función ε, que vale uno en n=1 y cero en los demás, es el elemento neutro.\n\nLa función de Möbius μ vale cero si hay un factor primo al cuadrado; en un producto de k primos distintos vale (−1)^k, y μ(1)=1. La identidad μ*1=ε sale de expandir un factor (1−1) por cada primo distinto. Por eso h=f*1 implica f=h*μ. Una función multiplicativa cumple f(ab)=f(a)f(b) cuando a y b son coprimos; conserva esa condición al usarla."],
["Prefijos de la función totiente","Define Φ(n)=Σ φ(k), de uno a n. La identidad Σ sobre d|k de φ(d)=k se obtiene agrupando las fracciones i/k por su denominador reducido. Suma para k≤n y cambia el orden: Σ de j=1 a n de Φ(floor(n/j))=n(n+1)/2. Al separar j=1 queda Φ(n)=n(n+1)/2−Σ de j=2 a n de Φ(floor(n/j)).\n\nAgrupa j por cociente y resta (r−l+1)·Φ(n/l) en cada bloque. Los argumentos son menores que n, así que la recursión termina. Memoriza resultados repetidos y precalcula φ y sus prefijos hasta un corte B. Ese corte intercambia memoria por trabajo; el costo aún depende de cuántos bloques procesas, no solo de cuántas respuestas guardas."],
["Comprobar fórmulas y evitar desbordamientos","Con N≤100, enumera divisores y compara contra la suma por bloques. Para Φ, calcula φ(k) contando los i con gcd(i,k)=1 y compara sus prefijos. Incluye Φ(0)=0 y revisa que la suma recursiva empiece en j=2.\n\nSi trabajas módulo M, dividir entre dos puede requerir un inverso que no exista. Para la suma de un intervalo, divide primero el factor par de (l+r)(r−l+1) entre dos y luego multiplica y reduce. El ejercicio pide enteros exactos y limita N a 10^9; sus resultados y productos intermedios caben en long long. Con una cota mayor debes volver a comprobarlo."]
],[reflect('phi',"Sumar valores de φ por bloques","Calcula Φ(6)=φ(1)+…+φ(6) usando Φ(n)=n(n+1)/2−Σ Φ(floor(n/j)), para j de 2 a n. Ya conoces Φ(1)=1, Φ(2)=2 y Φ(3)=4. Agrupa los índices j que tengan el mismo cociente.",["Para j=2 el cociente es tres; para j=3 es dos.","Los índices 4,5,6 comparten el cociente uno. Ese bloque resta tres copias de Φ(1)."],"La suma inicial es 6·7/2=21. El índice j=2 resta Φ(3)=4 y j=3 resta Φ(2)=2. El bloque j=4,5,6 resta 3·Φ(1)=3. Por tanto Φ(6)=21−4−2−3=12.\n\nPuedes comprobarlo con los valores individuales: φ(1),…,φ(6) son 1,1,2,2,4,2. Agrupar no cambia qué términos sumas; solo evita calcular por separado los que repiten el mismo cociente."),program('divisores',"Suma de divisores hasta N","Lee N (1 ≤ N ≤ 1000000000). Para cada entero k entre 1 y N, σ(k) es la suma de sus divisores positivos. Imprime el valor exacto de σ(1)+σ(2)+…+σ(N), sin módulo.",["Un divisor d aparece en d,2d,3d,… hasta N. Su contribución total es d·floor(N/d).","Si un bloque empieza en l y q=floor(N/l), termina en r=floor(N/q). Suma los enteros de l a r con la fórmula aritmética."],"Cambia el orden de la cuenta. En vez de listar los divisores de cada k, cuenta cuántas veces aparece cada divisor d. Obtienes Σ d·floor(N/d).\n\nRecorre los bloques donde floor(N/d) es constante. Si el bloque es [l,r] y su cociente es q, agrega q·(l+r)·(r−l+1)/2 y continúa en r+1. Así cuentas exactamente la misma suma sin recorrer los N divisores.\n\nHay O(√N) bloques. El algoritmo usa O(√N) tiempo y O(1) memoria. Usa long long tanto para la respuesta como para los productos de la fórmula.",String.raw`#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long answer = 0;
    for (long long l = 1; l <= n;) {
        long long q = n / l, r = n / q;
        long long a = l + r, b = r - l + 1;
        if (a % 2 == 0)
            a /= 2;
        else
            b /= 2;
        answer += q * a * b;
        l = r + 1;
    }
    cout << answer << '\n';
}
`,[['5\n','21\n'],['1\n','1\n'],['10\n','87\n'],['2\n','4\n']])]),
'usaco-adv-prefix-sums-nt-2': chapter('usaco-adv-prefix-sums-nt-2',[
["Qué cuenta G durante el algoritmo","Antes de procesar p, G(v) conserva los primos ya procesados y los enteros restantes sin factores primos menores que p. No es todavía π(v). Los nuevos compuestos a quitar tienen la forma p·k, con k≥p y sin factores primos menores que p.\n\nG(floor(v/p)) cuenta los factores candidatos, pero incluye también los primos menores que p. Resta G(p−1) para excluirlos. De ahí sale G(v)−=G(floor(v/p))−G(p−1). Si v<p² no hay ningún producto nuevo de esa forma. Esta condición evita eliminar el propio primo o repetir compuestos de barridos anteriores."],
["Seguir un ejemplo hasta veinte","Para N=20 guardas los límites 20,10,6,5,4,3,2,1. Al inicio G(20)=19. Con p=2 restas G(10)−G(1)=9 y quedan diez candidatos. Tras completar ese barrido, G(6)=3 y G(2)=1. Con p=3, G(20) pierde 3−1=2 y queda ocho: 2,3,5,7,11,13,17,19.\n\nPuedes revisar G(6) aparte: empieza en cinco y al procesar dos resta el valor anterior G(3)−G(1)=2. Quedan 2,3,5. Escribir los sobrevivientes de un ejemplo pequeño ayuda a comprobar qué cuenta cada celda. El entero cuatro ya fue eliminado; no inicia un nuevo barrido."],
["Guardar índices en O(√N)","Sea R=floor(√N). Cada cociente distinto v cumple v≤R o N/v≤R. Usa pequeño[v] para los primeros y grande[N/v] para los grandes. En el conjunto de cocientes, esos índices grandes no se repiten.\n\nGenera los valores en orden descendente: desde l=1 guarda v=N/l y avanza a l=N/v+1. Para localizar x, consulta pequeño[x] o grande[N/x]. Los argumentos floor(v/p), p y p−1 que necesitas también pertenecen al conjunto. Ajusta la raíz calculada con sqrt usando comparaciones enteras hasta cumplir R²≤N<(R+1)²; así no dependes del redondeo decimal."],
["Detectar primos y ordenar los barridos","Cuando llegas a p, si G(p)=G(p−1), p ya fue eliminado y es compuesto. Si difieren en uno, es primo. Recorre los límites de mayor a menor mientras v≥p². Como floor(v/p)<v, la celda que consultas conserva el valor anterior al barrido. En orden ascendente podrías usar un conteo que acabas de modificar.\n\nLa memoria es O(√N). Para esta implementación con acceso constante por arreglos, una cota segura es O(N^(3/4)) actualizaciones. Si cambias los índices por un mapa con búsqueda logarítmica, añade ese costo. Si necesitas listar los primos, una criba normal o segmentada conserva mejor esa información."],
["Casos que comprueban los límites","N=1 debe devolver cero y N=2 debe devolver uno, sin procesar primos hasta la raíz. Prueba cuadrados: π(48)=π(49), porque 49 es compuesto. El barrido de siete debe incluir v=49; por eso la condición es v≥p² y no v>p².\n\nCompara contra Eratóstenes para límites pequeños. Revisa también que guardes a lo sumo unos 2R valores: una lista de tamaño N indica que no saltaste al final de cada bloque. El ejercicio admite hasta 10^9; para aumentar esa cota, vuelve a medir el costo en el entorno donde ejecutarás el programa."]
],[reflect('orden',"El orden de actualización","Para N=10, antes de procesar el primo dos tienes G(10)=9, G(5)=4, G(2)=1 y G(1)=0. La actualización resta G(floor(v/2))−G(1). ¿Qué error aparece si actualizas G(5) antes que G(10)? Compara con procesar v de mayor a menor.",["Al actualizar G(5), restas G(2)−G(1)=1 y queda tres.","La actualización de G(10) debe usar el valor de G(5) anterior a procesar el primo dos."],"Si cambias primero G(5), queda 4−1=3. Luego G(10) usa ese tres y obtiene 9−3=6, que es incorrecto. Usó un valor del que ya quitaste múltiplos de dos.\n\nEn orden descendente, G(10) todavía encuentra G(5)=4 y calcula 9−4=5. Los supervivientes son 2,3,5,7,9. Después puedes actualizar G(5). Leer valores de la etapa anterior evita aplicar dos veces parte del filtrado."),program('primos',"Contar primos hasta N","Lee N (1 ≤ N ≤ 1000000000) e imprime cuántos números primos hay entre 1 y N. Diseña la solución sin reservar un arreglo de N posiciones.",["Guarda G(v)=v−1 para los valores distintos de floor(N/i). Al principio cuentas todos los enteros de dos a v.","Al procesar un primo p, actualiza v≥p² en orden descendente: resta G(floor(v/p))−G(p−1)."],"Guarda solo los cocientes distintos floor(N/i), que son O(√N). El valor inicial G(v)=v−1 cuenta todos los candidatos de dos a v. Procesa los primos hasta √N.\n\nPara cada primo p, resta los compuestos cuyo menor factor primo es p. La expresión G(floor(v/p))−G(p−1) cuenta sus factores acompañantes. Recorre v de mayor a menor para leer los valores anteriores a esta etapa. Cada compuesto se elimina al procesar su menor factor primo, una sola vez.\n\nAl terminar, G(N) cuenta los primos. La tabla ocupa O(√N) memoria; no necesitas una marca por cada número hasta N.",String.raw`#include <iostream>
#include <vector>
#include <cmath>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long r = sqrt((long double)n);
    while ((r + 1) * (r + 1) <= n)
        ++r;
    while (r * r > n)
        --r;
    vector<long long> v, g;
    vector<int> small(r + 1), large(r + 1);
    for (long long l = 1; l <= n;) {
        long long x = n / l;
        int pos = v.size();
        v.push_back(x);
        g.push_back(x - 1);
        if (x <= r)
            small[x] = pos;
        else
            large[n / x] = pos;
        l = n / x + 1;
    }
    auto id = [&](long long x) { return x <= r ? small[x] : large[n / x]; };
    for (long long p = 2; p <= r; p++) {
        if (g[id(p)] == g[id(p - 1)])
            continue;
        long long before = g[id(p - 1)];
        for (int i = 0; i < (int)v.size() && v[i] >= p * p; i++)
            g[i] -= g[id(v[i] / p)] - before;
    }
    cout << g[0] << '\n';
}
`,[['10\n','4\n'],['1\n','0\n'],['2\n','1\n'],['20\n','8\n'],['100\n','25\n'],['10000\n','1229\n']])]),
};
