import type { LessonExpansion } from '../types.ts';
import { mathChapter as chapter, reflect, program } from './advanced-math-helpers.ts';
const ntt = String.raw`#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;
const long long MOD = 998244353;
long long power(long long a, long long e) {
    long long r = 1;
    for (; e; e >>= 1, a = a * a % MOD)
        if (e & 1)
            r = r * a % MOD;
    return r;
}
void transform(vector<long long> &a, bool inverse) {
    int n = a.size();
    for (int i = 1, j = 0; i < n; i++) {
        int bit = n >> 1;
        for (; j & bit; bit >>= 1)
            j ^= bit;
        j ^= bit;
        if (i < j)
            swap(a[i], a[j]);
    }
    for (int len = 2; len <= n; len <<= 1) {
        long long root = power(3, (MOD - 1) / len);
        if (inverse)
            root = power(root, MOD - 2);
        for (int start = 0; start < n; start += len) {
            long long w = 1;
            for (int j = 0; j < len / 2; j++) {
                long long u = a[start + j], v = a[start + j + len / 2] * w % MOD;
                a[start + j] = (u + v) % MOD;
                a[start + j + len / 2] = (u - v + MOD) % MOD;
                w = w * root % MOD;
            }
        }
    }
    if (inverse) {
        long long inv = power(n, MOD - 2);
        for (auto &x : a)
            x = x * inv % MOD;
    }
}
vector<long long> multiply(vector<long long> a, vector<long long> b) {
    int size = a.size() + b.size() - 1, n = 1;
    while (n < size)
        n <<= 1;
    a.resize(n);
    b.resize(n);
    transform(a, false);
    transform(b, false);
    for (int i = 0; i < n; i++)
        a[i] = a[i] * b[i] % MOD;
    transform(a, true);
    a.resize(size);
    return a;
}
`;
export const polynomialExpansions: Record<string,LessonExpansion> = {
'usaco-adv-fft': chapter('usaco-adv-fft',[
['Una transformada cambia de representación','Los coeficientes permiten sumar polinomios fácilmente, pero multiplicarlos requiere combinar parejas. Las evaluaciones permiten multiplicarlos fácilmente: C(w)=A(w)B(w). Necesitamos n+m−1 evaluaciones para determinar un producto cuyos grados van de cero a n+m−2. La FFT elige puntos especiales para que pasar entre representaciones no cueste un trabajo cuadrático.\n\nPara A=1+2x y B=3+4x, usa cuatro puntos 1,i,−1,−i. Las evaluaciones de A son 3,1+2i,−1,1−2i; las de B son 7,3+4i,−1,3−4i. Sus productos son 21,−5+10i,1,−5−10i. Aplicar la transformada inversa recupera 3,10,8,0. El último cero existe por el relleno; no representa un coeficiente adicional necesario.'],
['Deriva una mariposa y el orden de los índices','Si N es potencia de dos y w es una raíz de orden N, entonces w^(N/2)=−1. Las posiciones k y k+N/2 comparten el mismo cuadrado. Si E[k] evalúa los coeficientes pares y O[k] los impares, las dos respuestas son E[k]+w^k O[k] y E[k]−w^k O[k]. Una mariposa produce ambas usando una sola multiplicación por w^k.\n\nEn una implementación iterativa, primero permuta los índices invirtiendo sus bits. Para N=8, los índices quedan 0,4,2,6,1,5,3,7. Esa permutación reproduce las separaciones recursivas por paridad. Después combina bloques de tamaños 2,4,8… hasta N. En cada bloque reinicia la potencia w^0=1 y multiplícala por la raíz correspondiente al tamaño de ese bloque.'],
['Construye una NTT exacta en un campo finito','En lugar de números complejos, trabajamos módulo P=998244353. El número 3 es una raíz primitiva de este campo; para un bloque de longitud L, w=3^((P−1)/L) tiene orden L cuando L divide P−1. Como P−1 contiene el factor 2^23, podemos usar potencias de dos hasta ese tamaño. El algoritmo de mariposas es el mismo, con sumas, restas y productos modulares.\n\nLa inversa usa w^(P−2), el inverso de la raíz, y al final multiplica cada coeficiente por N^(P−2). Omitir esa normalización produce N veces el resultado. Tras una resta añade P antes de reducir para evitar residuos negativos. En este módulo, multiplicar dos residuos menores que P cabe en long long, pero no en int.'],
['Interpreta correctamente el resultado modular','La NTT devuelve coeficientes módulo P, no necesariamente sus valores enteros completos. Si cuentas parejas y una frecuencia puede ser muy grande, el conteo puede exceder P. Para reconstrucción exacta puedes calcular con varios primos compatibles y combinar residuos por el teorema chino del resto; el producto de los módulos debe superar una cota demostrada de la magnitud del resultado. Para coeficientes con signo hay que elegir también una representación simétrica con margen suficiente.\n\nLa FFT compleja recupera enteros por redondeo solo cuando el error numérico queda controlado. Incrementar arbitrariamente las magnitudes puede invalidar el método. Antes de escoger una variante, determina si el problema pide módulo, enteros exactos o aproximaciones, y verifica longitud, cota de coeficientes y raíces disponibles.'],
['Relaciona convolución, correlación y otras operaciones','Para contar parejas de suma k, usa frecuencias como coeficientes: c[k] suma todas las parejas de índices que suman k. Para comparar desplazamientos entre secuencias suele aparecer correlación; invertir una secuencia permite expresarla como convolución, pero debes derivar qué índice del producto representa cada desplazamiento. Un error de signo aquí produce respuestas desplazadas aunque la NTT esté bien.\n\nLa convolución ordinaria combina índices sumándolos y valores multiplicándolos antes de sumar. La expresión min(a[i]+b[j]) para i+j=k pertenece a otra operación y no se obtiene con la misma FFT. Prueba siempre el producto rápido contra doble ciclo en arreglos pequeños, incluyendo longitudes uno y productos cuya longitud sea justo una potencia de dos más uno.']
],[reflect('circular','Por qué hacen falta ceros','Multiplica A=[1,1,1] por B=[1,1,1]. ¿Cuántos coeficientes reales tiene el resultado y cuál es la menor longitud de NTT permitida si usas potencias de dos? ¿Qué ocurriría con una convolución circular de longitud cuatro?',['El grado máximo es cuatro.','En longitud cuatro, x^4 se identifica con x^0.'],'El producto es [1,2,3,2,1], con cinco coeficientes. La menor potencia de dos suficiente es ocho. En una convolución circular de longitud cuatro, el coeficiente de x^4 se suma al término constante y se obtiene [2,2,3,2]. Rellenar hasta una longitud al menos n+m−1 evita esa superposición.'),program('convolucion','Multiplica dos polinomios','Entrada: n y m (1≤n,m≤100000), después n coeficientes de A y m de B, del término constante al de mayor grado, entre 0 y 998244352. Imprime n+m−1 coeficientes del producto módulo 998244353.',['Rellena hasta la menor potencia de dos al menos n+m−1.','Transforma ambos arreglos, multiplica posiciones correspondientes e invierte.'],'Evaluamos ambos polinomios en las mismas raíces de la unidad. El producto de evaluaciones es la evaluación del producto; la inversa recupera sus coeficientes. El relleno impide envolvimiento circular. La longitud usada no supera 2^18 con estas cotas y es compatible con el módulo. Tiempo O(N log N), memoria O(N), donde N es la longitud de transformada.',ntt+String.raw`int main(){
    int n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
    auto c=multiply(a,b);for(int i=0;i<(int)c.size();i++){if(i)cout<<' ';cout<<c[i];}cout<<'\n';
}
`,[['2 2\n1 2\n3 4\n','3 10 8\n'],['1 1\n998244352\n2\n','998244351\n'],['3 3\n1 1 1\n1 1 1\n','1 2 3 2 1\n'],['2 1\n0 0\n5\n','0 0\n']])]),
'usaco-adv-fft-ext': chapter('usaco-adv-fft-ext',[
['Deriva una inversa coeficiente por coeficiente','Sea A=a0+a1x+… y buscamos B=b0+b1x+… con AB=1. El término constante exige b0=a0^−1. Para k>0, el coeficiente k del producto debe ser cero: a0bk+Σ de i=1 a k de ai b(k−i)=0. Así bk=−a0^−1 Σ ai b(k−i). Esta recurrencia O(n²) sirve de referencia exacta para comprobar Newton en tamaños pequeños.\n\nPara A=1−x, b0=1 y cada siguiente coeficiente repite el anterior: todos son uno. Para A=2+x, b0=1/2, b1=−1/4 y b2=1/8 en un campo donde esas divisiones existan. En aritmética modular son inversos, no divisiones enteras de C++. Si a0=0, no hay inversa como serie ordinaria con grados no negativos.'],
['Programa Newton truncando en cada ronda','Empieza con B=[inverso(a0)]. Si conocemos m coeficientes, toma t=min(2m,n), recorta A a sus primeros t coeficientes y calcula C=AB truncado a t. Cambia C por 2−C: su constante es 2−C[0] y los demás coeficientes son sus negativos. Finalmente sustituye B por B·C truncado a t. Repite hasta tener n coeficientes.\n\nEl error se eleva al cuadrado, así que los primeros m coeficientes ya correctos se convierten en al menos 2m correctos. No hace falta que n sea potencia de dos; la última ronda puede truncarse antes. Cada multiplicación interna sí rellena a una potencia de dos compatible con la NTT. Usar t como longitud de transformada sin reservar espacio para el producto produciría una convolución circular incorrecta.'],
['Obtén derivada, integral, logaritmo y exponencial','La derivada desplaza coeficientes: A′[i−1]=i·A[i]. Una integral con constante cero hace I(A)[i+1]=A[i]/(i+1). Por eso, para los primeros n coeficientes en un campo de característica P, trabajamos con n<P y denominadores invertibles. Si A[0]=1, log(A)=I(A′·A^−1). Se necesitan solamente los coeficientes hasta el grado de truncamiento.\n\nPara exp(A) exigimos A[0]=0. Empieza B=1 y duplica precisión con B_nuevo=B·(1+A−log(B)), truncando. La corrección se obtiene al linealizar log alrededor de B; el error de aproximación vuelve a comenzar al doble del grado. Para raíz cuadrada con término constante no nulo, elige una raíz b0 de a0 y usa B_nuevo=(B+A/B)/2. Si A empieza con ceros, el primer grado no nulo debe ser par: extrae esa potencia de x antes de aplicar el método.'],
['Divide polinomios y evalúa muchos puntos','Si grado(A)=n y grado(B)=m≤n, invierte el orden de sus coeficientes. Los primeros n−m+1 coeficientes de reverso(A)·inverso(reverso(B)) determinan el cociente invertido. Revierte ese resultado para obtener Q y calcula el residuo R=A−BQ; su grado debe ser menor que m. Esta comprobación es un certificado útil para depurar la inversión de índices.\n\nPara evaluar A en muchos puntos xi, construye un árbol cuyas hojas son (x−xi) y cuyos nodos almacenan el producto de sus hijos. Propaga el residuo de A módulo el polinomio de cada nodo; en una hoja el residuo constante es A(xi). La división reduce el tamaño del trabajo por nivel. Con multiplicación rápida, el costo típico es O(M(n) log n) para tamaños comparables; se deben contar también los coeficientes del árbol en memoria.'],
['Interpola y reconoce la operación sobre los índices','Para puntos distintos, sea P(x)=producto(x−xi). Evalúa P′ en cada xi y define wi=yi/P′(xi). Las hojas del árbol guardan wi; un nodo combina F_izq·P_der + F_der·P_izq. En la raíz se obtiene el polinomio interpolador. P′(xi) no es cero precisamente porque los puntos son distintos. Duplicar un punto exige otro problema con condiciones adicionales, no esta fórmula.\n\nSi los índices se combinan por XOR, usa Walsh–Hadamard: para cada bloque transforma la pareja (u,v) en (u+v,u−v). Repite por cada bit, multiplica punto a punto las transformadas y aplica de nuevo las mariposas, dividiendo por la longitud. Esto funciona con un módulo donde dos sea invertible. La diferencia con FFT es estructural: el índice se une mediante XOR, no suma. Antes de aplicar una función generadora, escribe qué operación combina los tamaños de los objetos que cuentas.']
],[reflect('newton','Una ronda que duplica precisión','Para A=1−x, empieza con B=1. Calcula la primera actualización B(2−AB) módulo x² y luego la segunda módulo x⁴.',['La primera corrección es 1+x.','En la segunda, A·B=1−x².'],'La primera ronda da 1·(2−(1−x))=1+x. En la segunda, 2−AB=1+x² y (1+x)(1+x²)=1+x+x²+x³. Al multiplicar por 1−x queda 1−x⁴, por lo que los coeficientes hasta grado tres son correctos. El error pasó de empezar en x a empezar en x² y después en x⁴.'),program('inversa','Invierte una serie formal','Entrada: n (1≤n≤100000), seguido de n coeficientes A[0..n−1] entre 0 y 998244352, con A[0] distinto de cero. Imprime los n coeficientes de B tales que A·B ≡ 1 módulo x^n, trabajando módulo 998244353.',['Inicializa B con el inverso modular de A[0].','Duplica longitud usando B·(2−A·B) y recorta cada resultado.'],'Newton conserva todos los coeficientes correctos y duplica la precisión porque el nuevo error es el cuadrado del anterior. Las multiplicaciones usan la NTT completa del capítulo previo, incluida aquí para que el programa se pueda ejecutar por sí solo. Los tamaños forman una progresión geométrica y el tiempo total es O(n log n); el programa conserva memoria O(n).',ntt+String.raw`int main(){
    int n;cin>>n;vector<long long>a(n);for(auto&x:a)cin>>x;
    vector<long long>b(1,power(a[0],MOD-2));
    while((int)b.size()<n){
        int t=min(n,2*(int)b.size());vector<long long>cut(a.begin(),a.begin()+t);
        auto c=multiply(cut,b);c.resize(t);
        c[0]=(2-c[0]+MOD)%MOD;for(int i=1;i<t;i++)c[i]=(MOD-c[i])%MOD;
        b=multiply(b,c);b.resize(t);
    }
    for(int i=0;i<n;i++){if(i)cout<<' ';cout<<b[i];}cout<<'\n';
}
`,[['4\n1 998244352 0 0\n','1 1 1 1\n'],['1\n2\n','499122177\n'],['3\n1 1 0\n','1 998244352 1\n'],['5\n1 0 0 0 0\n','1 0 0 0 0\n']])]),
};
