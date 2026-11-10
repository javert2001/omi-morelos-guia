import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
export const numberMoreExpansions: Record<string,LessonExpansion> = {
'usaco-adv-game-theory': chapter('usaco-adv-game-theory',[
['Antes de calcular, fija las reglas del juego','Supondremos dos participantes que alternan turnos, conocen todo el estado y disponen de las mismas jugadas desde una posición. No hay azar. Bajo la regla normal, pierde quien no puede mover. Además, cada jugada debe acercarnos al final: si se pueden repetir posiciones indefinidamente, aparecen ciclos y posibles empates que esta DP no representa.\n\nUn estado es ganador si existe una jugada hacia un estado perdedor. Es perdedor si todas sus jugadas llevan a estados ganadores, incluyendo el caso sin jugadas. La palabra existe importa: no necesitas que todas tus opciones sean buenas, solo una. Para quitar de un montón una o dos piedras, cero es perdedor; uno y dos ganan; tres pierde porque solo llega a uno o dos. Por inducción, pierden los múltiplos de tres.'],
['Por qué conocer solo ganador o perdedor no basta','Considera dos montones independientes donde se permite quitar cualquier cantidad positiva de uno de ellos. Cada montón de una piedra es ganador por separado. Juntos, (1,1) es perdedor: quien mueve deja una piedra para que el rival retire la última. En cambio (1,2) es ganador: podemos convertirlo en (1,1). Ambos componentes eran ganadores en los dos casos, pero el resultado conjunto cambió.\n\nEl número de Grundy describe más información. Para un estado s, g(s) es el menor entero no negativo ausente entre los Grundy de sus sucesores: la operación mex. Si los sucesores tienen valores {0,1,3}, el mex es 2; si tienen {1,4}, es 0. Un estado sin sucesores tiene g=0. Se calcula en un orden donde todos los sucesores estén resueltos, normalmente de montones pequeños a grandes.'],
['Combina juegos y encuentra una jugada','Para componentes independientes, el Grundy conjunto es el XOR de sus Grundy. Si ese XOR es cero, cualquier jugada cambia un solo componente a un Grundy diferente y deja XOR no nulo. Si el XOR X no es cero, elige un componente cuyo Grundy tenga encendido el bit principal de X. El valor objetivo g XOR X es menor que g; por la definición de mex existe una jugada a ese valor. El nuevo XOR es cero.\n\nEn Nim ordinario, un montón de h piedras puede pasar a todos los tamaños de cero a h−1. Por tanto su Grundy es h. Con tamaños 3,4,5 el XOR es 2. El primer montón puede pasar de 3 a 1, y 1 XOR 4 XOR 5 = 0. Esa construcción no solo decide quién gana: también produce una jugada. En un juego de restas restringidas busca un sucesor legal con el Grundy requerido.'],
['Reconoce cuándo se rompen las hipótesis','Si una jugada puede tocar dos montones a la vez, ya no son componentes independientes y no puedes usar su XOR sin nueva demostración. Si ambos jugadores tienen jugadas diferentes, el juego no es imparcial. Si gana quien no puede mover, cambió la condición terminal. En Nim misère, donde pierde quien toma la última piedra, la regla especial cuando todos los montones no vacíos son unos es ganar exactamente cuando su cantidad es par; cuando hay un montón mayor, se necesita ajustar la jugada final para dejar una cantidad impar de unos al rival.\n\nPara restas de un conjunto S, calcular g[0..M] cuesta O(M·|S|) con un arreglo de marcas de tamaño |S|+1: un mex de a lo sumo |S| sucesores nunca supera |S|. No declares una periodicidad a partir de diez valores observados. Primero demuestra por qué la recurrencia repite estados o limita las entradas al intervalo realmente calculado.']
],[reflect('mex','Una traza de Grundy','En un montón puedes quitar 1 o 2 piedras. Calcula g[0] hasta g[5]. Después decide si dos montones de tamaños 2 y 5 son ganadores bajo la regla normal.',['g[0]=0 y cada otro valor es mex de sus sucesores legales.','Combina con XOR, no con suma.'],'Los Grundy son 0,1,2,0,1,2. Por ejemplo, para tres piedras los sucesores tienen valores 2 y 1, así que el mex es cero. Los montones 2 y 5 tienen Grundy 2 y 2; su XOR es cero, de modo que pierde quien empieza si ambos juegan óptimamente. Aunque cada montón gane por separado, su combinación no gana.'),program('restas','Montones del laboratorio','Entrada: n (1 ≤ n ≤ 1000), seguido de n tamaños entre 0 y 100000. En cada turno se retiran exactamente 1, 3 o 4 piedras de un único montón, si hay suficientes. Pierde quien no puede mover. Imprime GANA si quien empieza puede forzar victoria; en caso contrario PIERDE.',['Calcula Grundy hasta el mayor montón.','Hay como máximo tres sucesores; el mex está entre cero y tres.'],'La DP resuelve primero todos los montones menores. El arreglo usado marca sus Grundy y el primer valor libre es el mex. El XOR de los Grundy decide la suma de juegos porque una jugada cambia exactamente un montón. El programa tarda O(M+n) con M el máximo tamaño y usa O(M+n) memoria para la tabla y los datos.',String.raw`#include <iostream>
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
['Cambia el orden de una suma antes de optimizar','Sea σ(k) la suma de divisores positivos de k. Queremos σ(1)+…+σ(N). En lugar de recorrer cada k y factorizarlo, fijamos un divisor d: aparece en d,2d,3d,… hasta N. Contribuye d·floor(N/d). Por tanto la respuesta es la suma de d·floor(N/d) para d desde uno hasta N. Es una igualdad obtenida contando las mismas parejas (d,k) con d divisor de k en otro orden.\n\nPara N=5, las contribuciones son 1·5, 2·2, 3·1, 4·1 y 5·1: total 21. La suma original es 1+3+4+7+6=21. Esta versión sigue siendo lineal, pero ahora aparece una función escalonada: floor(N/d). Esa estructura permitirá agrupar muchos términos.'],
['Salta todos los denominadores con el mismo cociente','Si el bloque empieza en l, calcula q=floor(N/l). El último denominador con ese cociente es r=floor(N/q). Todos los d en [l,r] aportan q·d; suma el bloque con q·(l+r)·(r−l+1)/2 y continúa en r+1. Para N=12 los bloques son [1,1] con q=12, [2,2] con 6, [3,3] con 4, [4,4] con 3, [5,6] con 2 y [7,12] con 1.\n\nHay O(√N) bloques: hasta √N hay a lo sumo √N denominadores; después, sus cocientes son menores que √N y cada uno define a lo sumo un bloque. Nunca avances l solamente uno si ya calculaste r, ni uses r=N/l: ese valor es el cociente, no el límite del bloque.'],
['La convolución de Dirichlet es otra forma de contar divisores','Para funciones aritméticas f y g definimos (f*g)(n)=Σ f(d)g(n/d), sumando sobre divisores d de n. La función constante uno convolucionada consigo misma cuenta divisores; la identidad id(n)=n convolucionada con uno produce σ(n). La función ε vale uno en n=1 y cero en otro caso; es el elemento neutro de esta convolución.\n\nLa función de Möbius μ vale cero si hay un primo al cuadrado como factor; en un producto de k primos distintos vale (−1)^k, y μ(1)=1. La identidad μ*1=ε se explica expandiendo un producto de factores (1−1), uno por cada primo distinto. Por eso, si h=f*1, entonces f=h*μ: es una inversión sobre divisores. «Multiplicativa» exige f(ab)=f(a)f(b) para a y b coprimos; no autoriza sustituir cualquier producto sin esa condición.'],
['Obtén una recurrencia para sumas de totientes','Sea Φ(n)=Σ de k=1 a n de φ(k), donde φ cuenta enteros coprimos. La identidad Σ sobre d|k de φ(d)=k se demuestra agrupando las fracciones i/k por su denominador reducido. Sumando para k≤n y cambiando el orden obtenemos Σ de j=1 a n de Φ(floor(n/j))=n(n+1)/2. Aísla j=1: Φ(n)=n(n+1)/2−Σ de j=2 a n de Φ(floor(n/j)).\n\nAhora agrupa los j por cociente: por cada bloque [l,r], resta (r−l+1)·Φ(n/l). Los argumentos son menores que n, así que la recurrencia termina. Usa una tabla de resultados para no recalcular el mismo argumento. Un esquema práctico precalcula φ y sus prefijos hasta un corte B mediante criba; las llamadas con argumento ≤B regresan directamente. B controla tiempo y memoria, y debe analizarse según la implementación: memoizar no vuelve mágicamente constante el trabajo de todos los bloques.'],
['Verifica identidades y operaciones con números pequeños','Antes de optimizar, compara para N≤100 un programa que enumere divisores con el de bloques. Para totientes, calcula φ(k) contando gcd(i,k)=1 y compara los prefijos con la recurrencia. Así puedes descubrir un bloque que incluye j=1 por error o una base Φ(0) incorrecta.\n\nSi trabajas módulo M, dividir entre dos requiere cuidado. Para sumar un intervalo de enteros, primero divide entre dos el factor par de (l+r)(r−l+1), luego multiplica y reduce. Si usas un inverso de dos, M debe permitirlo. En el ejercicio no usamos módulo y restringimos N a 10^9; sus sumas y productos intermedios caben en long long. Para cotas mayores se necesita revisar otra vez ese argumento.']
],[reflect('phi','Calcula un prefijo sin factorizar cada término','Usa la recurrencia de Φ para calcular Φ(6), sabiendo Φ(1)=1, Φ(2)=2 y Φ(3)=4. Identifica los bloques de j desde dos.',['Los cocientes de 6/j son 3,2,1,1,1.','La suma triangular es 21.'],'Los bloques son j=2 con cociente 3; j=3 con cociente 2; j=4..6 con cociente 1. Entonces Φ(6)=21−Φ(3)−Φ(2)−3Φ(1)=21−4−2−3=12. Se comprueba con φ(1..6)=1,1,2,2,4,2. El factor tres cuenta la multiplicidad del último cociente: sin él estaríamos omitiendo dos términos.'),program('divisores','Suma de todos los divisores','Entrada: N (1 ≤ N ≤ 1000000000). Imprime Σ de k=1 a N de σ(k), donde σ(k) suma sus divisores positivos. La respuesta es un entero exacto, sin módulo.',['Cada divisor d aparece floor(N/d) veces.','Agrupa denominadores l..r con igual cociente, donde r=N/(N/l).'],'El doble conteo convierte la consulta en Σ d·floor(N/d). Cada bloque se evalúa con una suma aritmética y los bloques particionan [1,N] sin solapamientos. Son O(√N) bloques, cada uno de costo constante; la memoria es O(1). long long evita el desbordamiento que sufriría int incluso con entradas moderadas.',String.raw`#include <iostream>
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
['Entiende qué representa cada celda durante la criba','Antes de procesar el primo p, G(v) cuenta dos grupos: primos ya procesados menores que p y números entre p y v sin factores primos menores que p. No es todavía π(v) en todas las celdas. Al procesar p eliminamos los compuestos cuyo factor primo menor es p. Esos números se escriben p·k con k≥p y sin factores primos menores.\n\nLa cantidad de k admisibles hasta v/p se obtiene de G(v/p), restando los primos menores que p que también quedaron contados allí. Son precisamente G(p−1). Esto justifica la resta; no estamos quitando todos los múltiplos de p otra vez. Cuando v<p² no hay ningún compuesto nuevo de esa forma, por lo que esa celda no necesita actualización.'],
['Una traza con más de un primo','Para N=20 conservamos los argumentos 20,10,6,5,4,3,2,1. Inicialmente G(20)=19. Con p=2 restamos G(10)−G(1)=9 y queda 10. Después del barrido de dos, G(6)=3 y G(2)=1. Al procesar p=3, G(20) pierde G(6)−G(2)=2 y queda 8. Esos ocho sobrevivientes son 2,3,5,7,11,13,17,19. El siguiente entero, cuatro, es compuesto y no requiere un nuevo barrido.\n\nRevisa especialmente G(6): al eliminar los múltiplos compuestos de dos sobreviven 2,3,5. La actualización usa el conteo anterior G(3)−G(1)=2, de modo que pasa de 5 a 3. Acompañar la traza con la lista de sobrevivientes permite detectar si conservaste por error el cuatro o el seis. No se elimina el propio primo dos: solo los productos de dos por factores al menos dos.'],
['Indexa los argumentos sin una tabla de tamaño N','Sea R=floor(√N). Todo argumento v del conjunto de cocientes cumple v≤R o tiene índice cociente N/v≤R. Guarda dos arreglos de índices: pequeño[v] para v≤R y grande[N/v] para v>R. El segundo es inyectivo sobre los argumentos grandes de la lista: esos cocientes aparecen antes de que el denominador supere √N.\n\nGenera los argumentos de mayor a menor usando l=1, v=N/l y luego l=N/v+1. Para consultar un argumento x, elige pequeño[x] o grande[N/x]. La división repetida garantiza que v/p también está en la lista. Los enteros p y p−1 hasta R están allí igualmente. La raíz obtenida con sqrt puede redondear; ajusta R con comparaciones enteras para asegurar R²≤N<(R+1)².'],
['Detecta primos y conserva el orden correcto','Al llegar a un entero p, si G(p)=G(p−1), p ya fue eliminado por un primo menor y es compuesto. Si la diferencia es uno, p es primo. Recorre los argumentos en orden descendente mientras v≥p². Como v/p<v, su celda todavía conserva el valor previo al barrido de p. Un recorrido ascendente usaría información de la etapa equivocada y restaría cantidades incorrectas.\n\nLa memoria es O(√N). Una cota segura para esta versión sencilla es O(N^(3/4)) operaciones de actualización, con acceso constante a los índices; no prometemos ese costo si reemplazamos los arreglos por un mapa con búsqueda logarítmica. Para listar los primos, una criba convencional o segmentada es más adecuada: este método devuelve un conteo y pierde las identidades individuales.'],
['Comprueba la implementación desde los extremos','Los casos N=1 y N=2 no recorren ningún primo hasta la raíz; deben regresar cero y uno. Los cuadrados de primos son buenos límites: de π(48) a π(49) el conteo no cambia aunque 49 todavía no tiene un factor menor que siete. La condición v≥p² debe incluir la igualdad.\n\nPara una comprobación más amplia, ejecuta Eratóstenes hasta un millón y compara π(N) en todos los N pequeños o una muestra reproducible. Compara también el número de valores almacenados con 2R: si tu lista crece como N, no estás saltando bloques. El ejercicio limita N a 10^9 para que el trabajo resulte razonable en el navegador; cambiar esa cota requiere medir tiempo y memoria de nuevo.']
],[reflect('orden','Encuentra el error del barrido','Para N=10 y p=2, explica qué pasa si actualizas primero G(5) y después G(10). Usa los valores iniciales G(10)=9, G(5)=4, G(2)=1, G(1)=0.',['G(5) se vuelve 3.','La actualización de G(10) debe usar el G(5) anterior, que era 4.'],'En orden ascendente, G(5)=4−(1−0)=3. Si lo usamos inmediatamente en G(10), obtenemos 9−3=6, pero deberían sobrevivir solo 2,3,5,7,9: cinco números. El orden descendente calcula primero 9−4=5 y después actualiza G(5). La recurrencia necesita una fotografía de la etapa anterior para sus argumentos menores.'),program('primos','Cuenta sin guardar todos los números','Entrada: N (1 ≤ N ≤ 1000000000). Imprime cuántos números primos son menores o iguales a N. Usa conteos sobre cocientes, sin un vector de tamaño N.',['Guarda G(v)=v−1 para cada cociente distinto.','Actualiza de mayor a menor y resta G(v/p)−G(p−1).'],'Cada barrido elimina exactamente los compuestos cuyo menor factor primo es p. Después de procesar los primos hasta √N no sobrevive ningún compuesto ≤N, porque todo compuesto tiene un factor primo no mayor que su raíz. La celda del mayor argumento, N, queda con π(N). Los dos arreglos de índices mantienen memoria O(√N).',String.raw`#include <iostream>
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
