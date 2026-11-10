import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedOptimizationExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-convex-hull-trick': extend('usaco-plat-convex-hull-trick',110,[
    s('Transforma una recurrencia antes de escoger la estructura',`Considera dp[i]=min(j<i){dp[j]+(h[i]-h[j])²+C}. Expande el cuadrado: dp[i]=h[i]²+C+min(j<i){(-2h[j])·h[i]+dp[j]+h[j]²}. Cada estado j aporta una recta de pendiente m=-2h[j] e intercepto b=dp[j]+h[j]²; el estado i consulta su mínimo en x=h[i]. Primero consultas y después insertas la recta de i, porque usar i como candidato violaría j<i.

Si h crece estrictamente, las pendientes se insertan en orden decreciente y las consultas x crecen. Esas dos condiciones permiten la variante de deque. Si h llega en cualquier orden, la transformación algebraica sigue siendo válida, pero esta implementación deja de tener garantía; necesitarías Li Chao u otro contenedor apropiado.`),
    s('Cuándo una recta intermedia nunca será necesaria',`Supón pendientes a.m>b.m>c.m. La recta b puede ser óptima solo después de que supera a a y antes de que c la supere. Los puntos de cambio son xAB=(b.b-a.b)/(a.m-b.m) y xBC=(c.b-b.b)/(b.m-c.m). Si xAB≥xBC, ese intervalo no tiene interior: b puede retirarse sin cambiar ningún mínimo.

Como los denominadores son positivos, compara sin dividir: (b.b-a.b)·(b.m-c.m)≥(c.b-b.b)·(a.m-b.m). Al insertar c, elimina desde el final mientras la última recta sea redundante junto con su anterior y c. Si dos pendientes son iguales, conserva únicamente el menor intercepto antes de aplicar la comparación; dos rectas paralelas no tienen un punto de intersección finito.`),
    s('Consultar moviendo el frente y probar la amortización',`Para una consulta x, mientras haya dos rectas al frente y la segunda dé un valor menor o igual que la primera, elimina la primera. Como x nunca disminuye y la segunda tiene pendiente menor, una vez que resulta igual o mejor seguirá siendo mejor para todas las consultas futuras. El frente restante entrega el mínimo.

Cada recta entra una vez, puede salir por atrás al volverse redundante o por delante al dejar de ser óptima, y nunca regresa. Por tanto, n inserciones y q consultas cuestan O(n+q) en total, aunque una sola inserción pueda eliminar muchas rectas. Si las consultas no están ordenadas, no puedes destruir el frente; con la envolvente ya construida puedes buscar su mejor recta mediante búsqueda binaria en O(log n).`),
    s('Traza numérica y cotas que debes revisar',`Para rectas 3x, 2x+1 y x+5, los puntos de cambio son 1 y 4. La segunda sirve entre ambos, así que permanece. En x=0 gana 3x=0; en x=2 gana 2x+1=5; en x=5 gana x+5=10. Si sustituyes la recta central por 2x+10, sus puntos de cambio quedan 10 y -5: está dominada por la envolvente de las otras dos y se elimina.

Los productos de la prueba de redundancia pueden desbordarse antes que la evaluación m·x+b. El ejercicio limita |m|,|b|≤10000, haciendo seguros los productos en long long. En otro problema calcula sus cotas y usa una representación más amplia o una comparación racional exacta apropiada. Los empates admiten descartar rectas si solo buscas el valor; si necesitas recuperar el menor índice óptimo, debes incorporar esa regla al desempate.`),
  ],[
    p('rectas','Mínimo de rectas ordenadas','Entrada: n q (1≤n,q≤100000), n pares m b en orden estrictamente decreciente de m, con |m|,|b|≤10000, y q valores x en orden no decreciente, con |x|≤10⁶. Para cada x imprime min(m·x+b) entre todas las rectas.', ['Elimina la recta central si sus puntos de cambio quedan en orden inverso.', 'Con consultas crecientes, una recta vencida al frente nunca vuelve a ganar.'], 'La envolvente conserva puntos de cambio crecientes. Las rectas redundantes no mejoran ningún mínimo y las descartadas al frente no mejorarán consultas futuras. Cada recta entra y sale una sola vez; el costo total es O(n+q).', String.raw`#include <iostream>
#include <deque>
using namespace std;
struct Line {
    long long m, b;
    long long at(long long x) const { return m * x + b; }
};
bool bad(Line a, Line b, Line c) {
    return (b.b - a.b) * (b.m - c.m) >= (c.b - b.b) * (a.m - b.m);
}
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, q;
    cin >> n >> q;
    deque<Line> h;
    while (n--) {
        Line c;
        cin >> c.m >> c.b;
        while (h.size() >= 2 && bad(h[h.size() - 2], h.back(), c))
            h.pop_back();
        h.push_back(c);
    }
    while (q--) {
        long long x;
        cin >> x;
        while (h.size() >= 2 && h[1].at(x) <= h[0].at(x))
            h.pop_front();
        cout << h.front().at(x) << '\n';
    }
}`, [{input:'3 3\n3 0\n2 1\n1 5\n0 2 5\n',output:'0\n5\n10\n'}, {input:'3 3\n3 0\n2 10\n1 5\n-1 0 10\n',output:'-3\n0\n15\n'}, {input:'1 3\n-2 7\n-3 0 4\n',output:'13\n7\n-1\n'}]),
    r('dp-rectas','Construir las rectas de una DP','Para h=[1,3,4], C=2 y dp[0]=0, calcula dp[1] y dp[2] en dp[i]=min(j<i){dp[j]+(h[i]-h[j])²+C}. Muestra la pendiente e intercepto de cada recta disponible antes de consultar i=2.', ['La recta de j es (-2h[j],dp[j]+h[j]²).', 'La recta del estado actual se inserta después de consultarlo.'], 'j=0 aporta -2x+1. En x=3 vale -5; al sumar h[1]²+C=11 obtenemos dp[1]=6. Insertamos la recta de j=1: -6x+15. En x=4, las dos rectas valen -7 y -9; el mínimo -9 más 16+2 da dp[2]=9. La comprobación directa da min(0+9+2,6+1+2)=9. Insertar antes la recta de i usaría una dependencia circular no permitida.'),
  ]),

  'usaco-plat-dc-dp': extend('usaco-plat-dc-dp',110,[
    s('Un problema concreto para derivar estados y costos',`Divide un arreglo de valores no negativos en exactamente K segmentos contiguos no vacíos. El costo de un segmento es el cuadrado de su suma. Define dp[k][i] como el costo mínimo de dividir los primeros i elementos en k segmentos. Si el último segmento empieza después de j, la transición es dp[k][i]=min(k-1≤j<i){dp[k-1][j]+(S[i]-S[j])²}, donde S es el prefijo de sumas.

La solución directa prueba O(n) cortes por cada estado y cuesta O(Kn²). Para una fila k fija, la fila anterior ya es conocida y cada candidato cuesta O(1). Queremos reducir los cortes revisados aprovechando una propiedad de sus posiciones óptimas, no alterando la definición de la DP.`),
    s('La hipótesis matemática y por qué aquí se cumple',`Denota opt[i] el menor corte que obtiene el mínimo de la fila. La optimización requiere opt[i]≤opt[i+1]. Para el costo de sumas al cuadrado con valores no negativos se cumple la desigualdad cuadrangular: w(a,c)+w(b,d)≤w(a,d)+w(b,c) cuando a≤b≤c≤d, usando w(l,r)=(S[r]-S[l])².

Para verlo, separa las sumas de las tres zonas consecutivas como A,B,C. La diferencia entre el lado derecho y el izquierdo es (A+B+C)²+B²-(A+B)²-(B+C)²=2AC≥0. Esta propiedad Monge permite intercambiar dos cortes cruzados sin mejorar su orden invertido; escogiendo el menor corte en empates, los óptimos pueden mantenerse monótonos. Si hubiera valores negativos, A y C podrían tener signos opuestos y la prueba fallaría: no reutilices la optimización sin otra justificación.`),
    s('El procedimiento divide y vencerás de una fila',`Implementa resolver(L,R,optL,optR). Toma M=(L+R)/2 y prueba los cortes j desde optL hasta min(optR,M-1). Guarda el mejor costo y su corte best. Por monotonía, todos los óptimos de posiciones L…M-1 están entre optL y best, y los de M+1…R entre best y optR. Llama recursivamente con esos límites reducidos. La llamada inicial de la fila k es resolver(k,n,k-1,n-1).

Descarta candidatos cuya fila anterior sea infinita, pues representan particiones imposibles. Actualiza best solamente cuando encuentres una mejora estricta para conservar el menor índice en empates. El caso base L>R termina la recursión. Cada nivel recorre O(n) candidatos más sus fronteras compartidas y hay O(log n) niveles, así una fila cuesta O(n log n).`),
    s('Traza y comprobación contra una DP lenta',`En [1,2,3,4] con K=2, los cortes posibles para todo el arreglo producen 1²+9²=82, 3²+7²=58 y 6²+4²=52. Gana j=3. Para los primeros tres elementos, los cortes dan 1²+5²=26 y 3²+3²=18, ganando j=2. Los óptimos se desplazan de 2 a 3 al extender el prefijo, coherentemente con la propiedad.

Solo hacen falta dos filas, por lo que la memoria es O(n), además de la pila O(log n). El tiempo total es O(Kn log n). Antes de confiar en una optimización, compara muchas instancias pequeñas con la transición O(Kn²), incluyendo ceros y K=n. Que algunos ejemplos produzcan óptimos monótonos no es una prueba para un costo nuevo; primero deriva la propiedad algebraica y después implementa.`),
  ],[
    p('particiones','Partir cargas equilibradas','Entrada: n K (1≤n≤2000, 1≤K≤min(n,50)) y n enteros entre 0 y 1000. Divide el arreglo en exactamente K segmentos contiguos no vacíos. El costo es la suma de los cuadrados de las sumas de cada segmento. Imprime el costo mínimo.', ['Usa prefijos para calcular el costo de un segmento en O(1).', 'La monotonía del corte óptimo permite restringir candidatos al resolver la mitad izquierda y derecha.'], 'La recurrencia prueba el inicio del último segmento. La desigualdad Monge del costo, cuya diferencia es 2AC≥0, garantiza cortes óptimos monótonos. Divide y vencerás calcula cada fila restringiendo los intervalos de búsqueda sin excluir su óptimo. Tiempo O(Kn log n), memoria O(n).', String.raw`#include <iostream>
#include <vector>
#include <functional>
#include <algorithm>
using namespace std;
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    int n, K;
    cin >> n >> K;
    vector<long long> S(n + 1);
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        S[i] = S[i - 1] + x;
    }
    const long long INF = 4000000000000000000LL;
    vector<long long> prev(n + 1, INF), cur(n + 1);
    prev[0] = 0;
    for (int k = 1; k <= K; k++) {
        fill(cur.begin(), cur.end(), INF);
        function<void(int, int, int, int)> solve = [&](int L, int R, int optL, int optR) {
            if (L > R)
                return;
            int M = (L + R) / 2, best = optL;
            for (int j = optL; j <= min(optR, M - 1); j++)
                if (prev[j] < INF) {
                    long long d = S[M] - S[j], v = prev[j] + d * d;
                    if (v < cur[M]) {
                        cur[M] = v;
                        best = j;
                    }
                }
            solve(L, M - 1, optL, best);
            solve(M + 1, R, best, optR);
        };
        solve(k, n, k - 1, n - 1);
        prev.swap(cur);
    }
    cout << prev[n] << '\n';
}`, [{input:'4 2\n1 2 3 4\n',output:'52\n'}, {input:'3 3\n2 0 5\n',output:'29\n'}, {input:'4 1\n1 1 1 1\n',output:'16\n'}]),
    r('hipotesis','Un contraejemplo a una justificación incompleta','En la demostración de Monge aparecen A,B,C, las sumas de tres zonas consecutivas. Toma A=-2, B=3, C=4. Compara (A+B)²+(B+C)² con (A+B+C)²+B². ¿Puedes seguir usando la prueba de monotonía basada en no negatividad?', ['El primer lado vale 1²+7².', 'La diferencia debería ser 2AC.'], 'El lado izquierdo es 1+49=50 y el derecho es 25+9=34. La desigualdad requerida 50≤34 es falsa; la diferencia derecha-izquierda es -16=2·(-2)·4. No puedes invocar esa prueba para arreglos con valores negativos. Eso no prueba que toda instancia negativa falle, pero sí que la garantía usada por el algoritmo ya no existe; hay que buscar otra propiedad o conservar la DP general.'),
  ]),
};
