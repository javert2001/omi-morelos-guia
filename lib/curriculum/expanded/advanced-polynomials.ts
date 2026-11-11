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
["Coeficientes o valores del polinomio","Sumar polinomios es sencillo si guardas sus coeficientes. Multiplicarlos es sencillo si guardas sus valores en los mismos puntos: C(w)=A(w)B(w). El producto de listas de n y m coeficientes tiene hasta n+m−1 coeficientes, así que necesitas suficientes evaluaciones para recuperarlos. La FFT elige puntos que permiten convertir entre ambas representaciones rápidamente.\n\nPara A=1+2x y B=3+4x, evalúa en 1,i,−1,−i. Obtienes A=[3,1+2i,−1,1−2i] y B=[7,3+4i,−1,3−4i]. Sus productos son [21,−5+10i,1,−5−10i]. La transformada inversa recupera [3,10,8,0]. El último cero corresponde al espacio de relleno."],
["Combinar pares e impares","Si N es potencia de dos y w una raíz de orden N, w^(N/2)=−1. Las evaluaciones k y k+N/2 comparten el mismo cuadrado. Si E evalúa los coeficientes pares y O los impares, obtienes E[k]+w^k O[k] y E[k]−w^k O[k]. Esa pareja de cálculos se llama mariposa.\n\nLa versión iterativa reordena primero los índices invirtiendo sus bits. Para N=8, el orden es 0,4,2,6,1,5,3,7. Después combina bloques de 2,4,8… hasta N. En cada bloque empieza con w^0=1 y actualiza la potencia usando la raíz de ese tamaño. Así reproduce las separaciones recursivas por paridad."],
["La variante modular: NTT","Puedes hacer las mismas mariposas módulo P=998244353. El tres es una raíz primitiva; para un bloque de longitud L que divide P−1, w=3^((P−1)/L) tiene orden L. Como 2^23 divide P−1, admite longitudes potencia de dos hasta ese valor.\n\nLa inversa usa el inverso de la raíz, w^(P−2), y al final multiplica por N^(P−2). Si omites ese último factor, obtienes N veces el resultado. Tras una resta, añade P antes de reducir. Los productos de dos residuos caben en long long para este módulo, pero no en int."],
["Qué exactitud necesitas","La NTT devuelve coeficientes módulo P. Si un conteo supera P, no recuperas automáticamente su valor entero. Para reconstruirlo puedes usar varios primos compatibles y el teorema chino del resto. Su producto debe superar una cota demostrada del resultado; con coeficientes negativos necesitas también margen para una representación simétrica.\n\nLa FFT compleja usa redondeo para recuperar enteros y requiere controlar el error numérico. Aumentar los coeficientes sin revisar ese error puede dar respuestas incorrectas. Antes de escoger una versión, comprueba si el problema pide residuos, enteros exactos o aproximaciones, además de la longitud y las raíces disponibles."],
["Convolución y desplazamientos","Si los coeficientes son frecuencias, c[k] cuenta parejas cuyos índices suman k. Para comparar secuencias desplazadas aparece una correlación: invertir una secuencia permite escribirla como convolución. Deriva qué índice representa cada desplazamiento antes de implementar, porque un signo equivocado mueve todas las respuestas.\n\nLa FFT ordinaria combina índices por suma y valores mediante productos y sumas. No calcula min(a[i]+b[j]) para i+j=k: esa es otra operación. Comprueba el producto rápido contra dos ciclos en entradas pequeñas, con longitudes uno y con resultados cuya longitud sea una potencia de dos más uno."]
],[reflect('circular',"Qué ocurre sin suficiente relleno","Multiplica A(x)=1+x+x² por B(x)=1+x+x². ¿Cuántos coeficientes tiene el resultado y qué tamaño mínimo de NTT, potencia de dos, necesitas? Después calcula qué pasaría al usar una convolución circular de tamaño cuatro.",["El grado máximo del producto es cuatro, así que necesitas guardar las posiciones de cero a cuatro.","En una convolución circular de tamaño cuatro, x⁴ se identifica con x⁰."],"El producto es 1+2x+3x²+2x³+x⁴, con cinco coeficientes: [1,2,3,2,1]. La siguiente potencia de dos es ocho, el tamaño mínimo de NTT para guardar el producto sin superposiciones.\n\nCon tamaño cuatro, el coeficiente de x⁴ vuelve a la posición cero. Obtendrías [2,2,3,2], que corresponde a una convolución circular. Agregar ceros hasta alcanzar al menos n+m−1 posiciones evita esa vuelta al inicio."),program('convolucion',"Multiplicar polinomios","Lee n y m (1 ≤ n,m ≤ 100000), después los n coeficientes de A y los m de B. Vienen del término constante al de mayor grado y están entre 0 y 998244352. Imprime los n+m−1 coeficientes de A·B en ese mismo orden, módulo 998244353.",["Elige la menor potencia de dos N≥n+m−1 y completa ambos vectores con ceros.","Aplica NTT a ambos, multiplica sus valores posición por posición y aplica la transformada inversa."],"La transformada evalúa cada polinomio en las mismas raíces de la unidad. Multiplicar esas evaluaciones obtiene las del producto. La transformada inversa recupera sus coeficientes. Como N≥n+m−1, ningún término se superpone al principio del vector.\n\nEl módulo 998244353 admite las raíces que requiere el ejercicio: con estas cotas, N llega como máximo a 2^18. Después de invertir, imprime solo los n+m−1 coeficientes del producto. Las transformadas cuestan O(N log N) tiempo y los vectores ocupan O(N) memoria.",ntt+String.raw`int main(){
    int n,m;cin>>n>>m;vector<long long>a(n),b(m);for(auto&x:a)cin>>x;for(auto&x:b)cin>>x;
    auto c=multiply(a,b);for(int i=0;i<(int)c.size();i++){if(i)cout<<' ';cout<<c[i];}cout<<'\n';
}
`,[['2 2\n1 2\n3 4\n','3 10 8\n'],['1 1\n998244352\n2\n','998244351\n'],['3 3\n1 1 1\n1 1 1\n','1 2 3 2 1\n'],['2 1\n0 0\n5\n','0 0\n']])]),
'usaco-adv-fft-ext': chapter('usaco-adv-fft-ext',[
["La inversa de una serie","Buscas B tal que A·B=1, conservando solo los primeros n coeficientes. El término constante exige b0=a0^−1. Para k>0, el coeficiente debe ser cero: a0bk+Σ de i=1 a k de ai·b(k−i)=0. Por tanto bk=−a0^−1·Σ ai·b(k−i). Esta recurrencia cuadrática sirve para comprobar la versión rápida.\n\nCon A=1−x, todos los coeficientes de B son uno. Con A=2+x empiezas con 1/2,−1/4,1/8. En un campo modular esas fracciones son inversos, no divisiones enteras de C++. Si a0=0, no existe una inversa ordinaria con grados no negativos."],
["Duplicar precisión con Newton","Empieza con B=[inverso(a0)]. Si ya tienes m coeficientes correctos, toma t=min(2m,n). Recorta A a t términos y calcula C=A·B, también recortado. Sustituye C por 2−C y luego B por B·C, conservando t términos. Repite hasta llegar a n.\n\nLa igualdad 1−A·B_nuevo=(1−A·B)² explica la mejora: un error que empezaba en grado m ahora empieza en grado 2m. La última ronda puede detenerse antes de una potencia de dos. Las multiplicaciones internas, en cambio, deben reservar espacio para su producto completo; usar t directamente como longitud de NTT puede causar envolvimiento circular."],
["Derivadas, logaritmos y exponenciales","La derivada usa A′[i−1]=i·A[i]. Integrar con constante cero usa I(A)[i+1]=A[i]/(i+1). Necesitas denominadores invertibles; para n coeficientes módulo un primo P, trabaja con n<P. Si A[0]=1, calcula log(A)=I(A′·A^−1), truncando al grado necesario.\n\nPara exp(A), exige A[0]=0, empieza B=1 y duplica precisión con B_nuevo=B·(1+A−log(B)). La corrección lineal del logaritmo desplaza el error al doble de grado. Para una raíz cuadrada con constante no nula, elige una raíz b0 de a0 y usa (B+A/B)/2. Si A empieza con ceros, su primer grado no nulo debe ser par; extrae esa potencia de x antes de aplicar la fórmula."],
["División y evaluación en varios puntos","Si grado(A)=n y grado(B)=m≤n, invierte el orden de sus coeficientes. Los primeros n−m+1 términos de reverso(A)·inverso(reverso(B)) dan el cociente invertido. Revierte para obtener Q y calcula R=A−B·Q. Comprueba grado(R)<m: es una forma directa de detectar errores de índices.\n\nPara evaluar en muchos xi, construye un árbol con hojas (x−xi) y productos en los nodos. Baja los residuos de A módulo cada producto. En una hoja queda la constante A(xi). Con multiplicación rápida y tamaños comparables, el costo típico es O(M(n) log n), donde M(n) es el costo de multiplicar. Cuenta también los coeficientes almacenados en el árbol."],
["Interpolación y convolución XOR","Para puntos distintos, define P(x)=producto(x−xi) y wi=yi/P′(xi). P′(xi) no es cero porque no hay puntos repetidos. Pon wi en las hojas y combina F_izq·P_der+F_der·P_izq. La raíz contiene el polinomio interpolador. Un punto repetido exige tratar condiciones adicionales; esta fórmula no se aplica directamente.\n\nSi los índices se combinan con XOR, usa Walsh–Hadamard: transforma parejas (u,v) en (u+v,u−v), repite por cada bit y multiplica las transformadas posición a posición. Para invertir, repite las mariposas y divide por la longitud. Necesitas que dos sea invertible en el módulo. La operación sobre los índices, XOR o suma, es la que determina qué transformada corresponde."]
],[reflect('newton',"Duplicar la precisión de una inversa","Sea A(x)=1−x y empieza con B(x)=1. Aplica B←B(2−AB) primero módulo x² y luego módulo x⁴. ¿Qué polinomio obtienes en cada paso? Comprueba el segundo resultado multiplicándolo por A.",["En el primer paso, 2−AB=1+x.","Con B=1+x, el producto AB es 1−x². Calcula de nuevo el factor de corrección."],"Con B=1, la corrección es 2−(1−x)=1+x. La primera aproximación queda B=1+x.\n\nAhora AB=(1−x)(1+x)=1−x², así que 2−AB=1+x². Multiplica: B=(1+x)(1+x²)=1+x+x²+x³.\n\nLa comprobación da (1−x)B=1−x⁴, que es uno módulo x⁴. El término de error pasó de empezar en x² a empezar en x⁴: por eso esta actualización duplica la precisión."),program('inversa',"Inversa de una serie","Lee n (1 ≤ n ≤ 100000) y los n coeficientes de A, del término constante al de grado n−1. Cada coeficiente está entre 0 y 998244352 y a[0] es distinto de cero. Imprime n coeficientes de B tales que A·B≡1 módulo xⁿ, trabajando módulo 998244353.",["Empieza con B[0], el inverso modular de a[0]. Esto resuelve la igualdad módulo x.","Duplica la cantidad de coeficientes correctos usando B←B(2−AB). Descarta los términos que excedan la precisión de ese paso."],"El término constante de A es invertible, así que puedes empezar con B=a[0]⁻¹. Si AB=1−E y el error E empieza en xᵐ, la nueva aproximación cumple A·B(2−AB)=1−E². Su error empieza en x²ᵐ.\n\nRepite la corrección con multiplicaciones NTT, duplicando la precisión hasta cubrir n coeficientes. En cada paso conserva solo la parte necesaria del resultado. La implementación incluye la transformada y sus inversas; no depende de una biblioteca externa.\n\nLas precisiones crecen como 1,2,4,…,n. La suma de los costos es O(n log n) y la memoria es O(n).",ntt+String.raw`int main(){
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
