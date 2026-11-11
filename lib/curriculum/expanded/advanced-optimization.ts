import type { LessonExpansion } from '../types.ts';
import { extend, section as s, reasoning as r, program as p } from './advanced-helpers.ts';

export const advancedOptimizationExpansions: Record<string, LessonExpansion> = {
  'usaco-plat-convex-hull-trick': extend('usaco-plat-convex-hull-trick',110,[
    s("Eliminar una recta que nunca mejora el mínimo","Sean pendientes a.m>b.m>c.m. La recta b puede ganar entre los puntos de cambio xAB=(b.b−a.b)/(a.m−b.m) y xBC=(c.b−b.b)/(b.m−c.m). Si xAB≥xBC, no tiene un intervalo de ventaja y puedes retirarla.\n\nEvita dividir comparando (b.b−a.b)·(b.m−c.m)≥(c.b−b.b)·(a.m−b.m), cuyos denominadores originales son positivos. Al insertar c, elimina del final mientras se cumpla esa condición. Para pendientes iguales conserva antes únicamente el menor intercepto: las rectas paralelas no tienen un punto de cambio finito."),
    s("Responder consultas que avanzan hacia la derecha","En una consulta x, compara las dos primeras rectas. Si la segunda da un valor menor o igual, retira la primera y repite. La segunda tiene menor pendiente, así que seguirá siendo al menos tan buena para cualquier x futuro mayor. El frente que queda da la respuesta.\n\nCada recta entra una vez y sale a lo sumo una vez, por delante o por detrás. Por eso n inserciones y q consultas cuestan O(n+q) en total. Una operación individual puede retirar muchas rectas; la cota es amortizada."),
    s("Seguir los cambios de ganador","Para 3x, 2x+1 y x+5, los cruces relevantes están en 1 y 4. Ganan, respectivamente, en x=0, x=2 y x=5, con valores 0, 5 y 10. La recta central tiene un intervalo útil.\n\nSi cambias esa recta por 2x+10, los puntos de cambio quedan en 10 y −5. Su intervalo de ventaja desaparece, así que se elimina. Esta comprobación distingue una recta que aún no gana de una que nunca podrá ganar."),
    s("Cuidar productos y reglas de empate","Los productos de la prueba de redundancia pueden superar el tamaño de m·x+b. Acota ambas operaciones antes de elegir un tipo. En el ejercicio, |m|,|b|≤10000 hace segura esa comparación con long long; otras cotas pueden necesitar una representación más amplia.\n\nSi solo pides el valor mínimo, puedes descartar opciones empatadas. Si también debes recuperar el menor índice, incorpora esa regla a las comparaciones. No cambies silenciosamente el candidato elegido cuando el enunciado especifica un desempate."),
  ],[
    p('rectas',"Consultar rectas con pendientes ordenadas","Lee n q (1≤n,q≤100000), n pares m b con pendientes estrictamente decrecientes y |m|,|b|≤10000. Después lee q valores x no decrecientes, con |x|≤10⁶. Para cada x imprime el menor valor m·x+b entre todas las rectas.", ["Compara los puntos de cambio de tres rectas para decidir si la del medio puede retirarse.", "En una consulta creciente, una recta vencida por la siguiente ya no vuelve a ganar."], "Construye la envolvente quitando del final las rectas cuyo intervalo de ventaja esté vacío. Para cada x, retira del frente mientras la segunda recta sea igual o mejor. Los puntos de cambio permanecen ordenados y cada eliminación conserva todos los mínimos necesarios. Cada recta entra y sale una vez, dando O(n+q) tiempo y O(n) memoria.", String.raw`#include <iostream>
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
    r('dp-rectas',"Convertir una recurrencia en rectas","Sea h=[1,3,4], C=2 y dp[0]=0. Calcula dp[1] y dp[2] para dp[i]=min(j<i){dp[j]+(h[i]−h[j])²+C}. Indica qué rectas existen justo antes de consultar i=2.", ["La recta del estado j tiene pendiente −2h[j] e intercepto dp[j]+h[j]².", "Inserta la recta del estado actual únicamente después de calcular su respuesta."], "El estado 0 aporta −2x+1. Consultarlo en x=3 da −5; al sumar 3²+2 resulta dp[1]=6. Inserta entonces −6x+15. Antes de i=2 están esas dos rectas; en x=4 valen −7 y −9. El mínimo más 4²+2 produce dp[2]=9. Directamente, min(0+9+2,6+1+2)=9. Insertar la recta actual antes de consultar permitiría un candidato que todavía no es válido."),
  ]),

  'usaco-plat-dc-dp': extend('usaco-plat-dc-dp',110,[
    s("Demostrar la condición para sumas al cuadrado","Escribe w(l,r)=(S[r]−S[l])². Para a≤b≤c≤d necesitamos w(a,c)+w(b,d)≤w(a,d)+w(b,c), una desigualdad de Monge. Si A,B,C son las sumas de las tres zonas consecutivas, la diferencia derecha menos izquierda es (A+B+C)²+B²−(A+B)²−(B+C)²=2AC.\n\nCon valores no negativos, 2AC≥0. Esa desigualdad permite intercambiar cortes cruzados sin empeorar el resultado y, eligiendo el menor corte en empates, obtener óptimos monótonos. Si admites negativos, A y C podrían tener signos opuestos y esta prueba deja de servir."),
    s("Resolver primero la posición central","La función resolver(L,R,optL,optR) calcula M=(L+R)/2 y prueba j desde optL hasta min(optR,M−1). Guarda el menor costo y su corte best. Después resuelve [L,M−1] con candidatos [optL,best] y [M+1,R] con candidatos [best,optR].\n\nLa llamada inicial para la fila k es resolver(k,n,k−1,n−1); termina cuando L>R. Recorre candidatos en orden creciente y cambia best solo ante una mejora estricta. Descarta estados anteriores imposibles, representados por infinito, en vez de sumarlos y arriesgar desbordamiento."),
    s("Seguir cómo avanza el corte","En [1,2,3,4] con dos grupos, los cortes finales cuestan 82, 58 y 52, así que gana j=3. Para el prefijo [1,2,3], los costos son 26 y 18, y gana j=2. El corte se mueve de 2 a 3 al extender el prefijo.\n\nLa recursión mantiene dos intervalos distintos: posiciones pendientes y candidatos permitidos. No los confundas. Una frontera calculada para los cortes no se convierte en una frontera de posiciones por resolver."),
    s("Costo de una fila y memoria necesaria","En cada nivel de la recursión se revisan O(n) candidatos, contando las fronteras compartidas; hay O(log n) niveles. Una fila cuesta O(n log n) y las K filas O(Kn log n).\n\nSolo necesitas la fila anterior y la actual, por lo que la memoria es O(n), además de una pila de O(log n). Conserva imposibles los estados i<k y empieza con dp[0][0]=0. Los demás estados de cero grupos son imposibles."),
  ],[
    p('particiones',"Particionar cargas con costo cuadrático","Lee n K (1≤n≤2000, 1≤K≤min(n,50)) y n enteros entre 0 y 1000. Divide el arreglo en exactamente K segmentos contiguos no vacíos. El costo de cada segmento es el cuadrado de su suma. Imprime el menor costo total.", ["Calcula sumas prefijas para evaluar cada segmento en O(1).", "Para una fila, encuentra el mejor corte de la posición central y restringe con él los candidatos de ambas mitades."], "Usa dp[k][i]=min_j(dp[k−1][j]+(S[i]−S[j])²). El costo es Monge porque la diferencia de la desigualdad es 2AC≥0. Con desempate por el menor corte, los óptimos son monótonos. Divide y vencerás puede reducir los intervalos de candidatos sin excluir el óptimo. El tiempo es O(Kn log n) y bastan dos filas, O(n) memoria.", String.raw`#include <iostream>
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
    r('hipotesis',"Revisar la hipótesis de no negatividad","En la prueba de Monge, A,B,C representan sumas de tres zonas consecutivas. Toma A=−2, B=3 y C=4. Compara (A+B)²+(B+C)² con (A+B+C)²+B². ¿Sigue siendo válida la justificación usada para arreglos no negativos?", ["El lado izquierdo es 1²+7².", "Resta el lado izquierdo del derecho y comprueba que obtienes 2AC."], "El lado izquierdo vale 50 y el derecho 34. La desigualdad 50≤34 no se cumple; la diferencia es −16=2·(−2)·4. Por eso no puedes aplicar esta prueba a valores negativos. No afirma que todas esas instancias fallen, pero sí elimina la garantía de la optimización. Necesitarías otra propiedad demostrada o la DP general."),
  ]),
};
