import { page, text, snippet, problem, program, detail, type Walkthrough } from './intermediate-helpers.ts';

export const containerWalkthroughs: Record<string, Walkthrough> = {
  'usaco-gold-intro-sorted-sets': l => page([
    problem(l, 'Tenemos boletos de [2,4,4,7]. Con presupuesto 5 vendemos uno de 4; con presupuesto 4 vendemos el otro. Con 1 no alcanza ningún boleto y respondemos −1. Con 8 vendemos el de 7.'),
    text('Buscar y borrar sin revisar todos los boletos', 'Una solución directa recorre el inventario para elegir el mayor precio suficiente y borra esa copia. Con muchas ventas podría costar O(nq).\n\nUn vector ordenado acelera la búsqueda, pero borrar un elemento requiere desplazar los siguientes. Usaremos multiset, una colección ordenada que permite insertar y borrar en O(log n). Conserva copias iguales: necesitamos ambos boletos de 4.'),
    snippet('Encontrar el primer precio que se pasa', 'upper_bound(x) señala el primer precio mayor que el presupuesto. El anterior, si existe, será el mayor que sí cabe:', String.raw`auto it = s.upper_bound(x);
if (it == s.begin()) {
    cout << -1 << '\n';
} else {
    --it;
    cout << *it << '\n';
    s.erase(it);
}`, 'Si it es begin(), no hay elemento anterior. Esto también ocurre en una colección vacía. Si it es end() y la colección no está vacía, sí podemos retroceder: todos los boletos caben y elegimos el último.'),
    text('Borrar exactamente la copia vendida', 's.erase(it) retira el elemento señalado por ese iterador. s.erase(4), en cambio, retiraría todos los boletos de precio 4. En el ejemplo, eso impediría realizar la segunda venta correctamente.\n\nDespués de la primera venta queda [2,4,7]. Para presupuesto 4, upper_bound señala 7; retroceder lleva a la copia restante de 4. La estructura mantiene el orden después de cada borrado.'),
    program(l, 'main inserta los precios y procesa los presupuestos en el orden de llegada. Usa el método s.upper_bound, que aprovecha la estructura del contenedor.', 'Cada inserción o consulta cuesta O(log(n+1)); la memoria es O(n). El presupuesto no se reutiliza ni se acumula entre compradores. Si no hay boleto, el inventario permanece igual.'),
    detail(l, 4), detail(l, 5), detail(l, 7),
  ]),
  'usaco-gold-custom-cpp-stl': l => page([
    problem(l, 'Los registros 4 y 2 tienen diez puntos. El desempate coloca primero al id 2, luego al 4. El id 1 tiene siete puntos y va al final. El orden pedido es 2 4 1.'),
    text('Un orden para fichas completas', 'Con datos fijos podríamos guardar los registros en un vector y usar sort. Aquí usaremos set para practicar un contenedor que mantiene el orden al insertar.\n\nset necesita saber cuándo un registro va antes que otro. No conoce el significado de «más puntos, luego menor id», así que debemos escribir un comparador. También utiliza ese comparador para decidir si dos registros son equivalentes.'),
    snippet('Definir el registro y su comparación', 'p representa puntos. El comparador compara p primero; únicamente si empata revisa id:', String.raw`struct R { long long id, p; };
struct C {
    bool operator()(const R& a, const R& b) const {
        if (a.p != b.p) return a.p > b.p;
        return a.id < b.id;
    }
};`, 'operator() hace que un objeto C se pueda usar como una función. El const final indica que comparar no modifica ese objeto. No usamos >= ni <=: un registro nunca debe ir antes de sí mismo.'),
    snippet('Dejar que el contenedor mantenga el orden', 'El segundo parámetro de set es el tipo del comparador. Cada inserción ubica el registro según ese criterio:', String.raw`set<R, C> s;
s.insert({4, 10});
s.insert({2, 10});
s.insert({1, 7});
for (auto r : s) cout << r.id << ' ';`, 'Si comparáramos solo puntos, los registros 4 y 2 serían equivalentes para set: ninguno iría antes que el otro. Uno desaparecería del resultado. El desempate por id evita esa pérdida porque todos los ids de la entrada son distintos.'),
    program(l, 'main lee cada ficha y la inserta sin ordenar al final. Recorrer s ya entrega el orden de reconocimiento.', 'La inserción total cuesta O(n log n), memoria O(n). El comparador usa un número constante de comparaciones; si comparara cadenas largas, su costo también contaría.'),
    detail(l, 5), detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-stacks': l => page([
    problem(l, 'En [2,5,3,3,1], el 5 tiene como anterior menor al 2, de índice 0. Los dos treses también: el primer 3 no sirve para el segundo porque pedimos estrictamente menor. El 1 no tiene ningún menor a su izquierda.'),
    snippet('Buscar hacia atrás desde cada posición', 'La solución directa se detiene al encontrar el primer valor menor:', String.raw`int j = i - 1;
while (j >= 0 && a[j] >= a[i]) j--;
cout << j << ' ';`, 'Si los valores bajan continuamente, cada búsqueda recorre todo lo anterior y cuesta O(n²) en total. Necesitamos dejar de guardar candidatos que ya nunca podrán ser la respuesta.'),
    text('Cuándo un candidato queda reemplazado', 'Supón que estamos leyendo un 3 y el candidato más reciente era un 5. Para el 3, ese 5 no sirve. Para cualquier valor futuro, tampoco necesitamos conservarlo: si el 5 fuera menor que ese valor, el 3 también lo sería y estaría más cerca.\n\nGuardaremos índices candidatos en una pila. Sus valores crecerán de abajo hacia arriba. Cuando llega a[i], retiramos todos los del tope que valgan al menos a[i]. El que quede arriba será el menor anterior más cercano.'),
    snippet('Retirar, contestar y guardar el índice nuevo', 's.back() es el último índice agregado. Usamos sus índices para poder imprimir posiciones, no solo valores:', String.raw`while (!s.empty() && a[s.back()] >= a[i]) s.pop_back();
cout << (s.empty() ? -1 : s.back()) << ' ';
s.push_back(i);`, 'Con [2,5], la pila guarda índices [0,1]. Al llegar el primer 3, retira el índice 1 y contesta 0; agrega 2. Al llegar el segundo 3, retira 2 por igualdad y vuelve a contestar 0. Al llegar 1, vacía toda la pila.'),
    text('Por qué el ciclo no hace trabajo cuadrático', 'Cada índice entra una vez en la pila. Si sale, nunca regresa. En toda la ejecución hay como máximo n entradas y n salidas, aunque una llegada retire muchos candidatos.\n\nEl tope restante es válido porque su valor es menor. Es el más cercano entre los candidatos, y los descartados ya tenían un reemplazo posterior menor o igual. Por eso no perdimos una respuesta mejor.'),
    program(l, 'El programa recibe cada valor, actualiza la pila y escribe su respuesta antes de agregarlo como candidato futuro.', 'Tiempo O(n), memoria O(n). Cambiar >= por > modificaría la pregunta y permitiría usar un valor igual. Prueba [7,7,7]: todas las respuestas deben ser −1.'),
    detail(l, 6), detail(l, 7),
  ]),
  'usaco-gold-sliding-window': l => page([
    problem(l, 'Con k=3, los tramos son [1,3,2], [3,2,5] y [2,5,4]. Sus máximos son 3,5,5. La ventana siempre contiene exactamente k posiciones consecutivas.'),
    text('Recalcular cada máximo repite comparaciones', 'Recorrer las k posiciones de cada ventana cuesta O(nk). Podríamos usar una colección ordenada, pero aquí podemos aprovechar que las posiciones entran por la derecha y salen por la izquierda.\n\nSi llega un 5 detrás de un 3, el 3 nunca volverá a ser máximo mientras ambos estén en una ventana: el 5 es mayor y además saldrá después. Podemos retirar al 3 de los candidatos sin esperar a que venza.'),
    text('Dos razones distintas para retirar un candidato', 'Guardaremos índices en una deque: permite quitar por ambos extremos. Sus valores irán de mayor a menor.\n\nPor delante retiramos índices que ya quedaron fuera de la ventana. Por detrás retiramos valores menores o iguales al recién llegado, porque el nuevo los reemplaza. Mantener índices permite distinguir dos valores iguales que vencen en momentos diferentes.'),
    snippet('Actualizar la deque con cada llegada', 'La ventana que termina en i empieza en i−k+1. Los índices hasta i−k ya vencieron:', String.raw`while (!q.empty() && q.front() <= i - k) q.pop_front();
while (!q.empty() && a[q.back()] <= a[i]) q.pop_back();
q.push_back(i);
if (i >= k - 1) cout << a[q.front()] << ' ';`, 'Al llegar el 3 del ejemplo retiramos el 1 del fondo. Al llegar el 2 queda detrás del 3. La primera respuesta es 3. Cuando llega 5, retira 2 y 3, y queda solo: es máximo de las dos ventanas restantes.'),
    text('Por qué el frente da la respuesta', 'Los candidatos permanecen en orden de llegada y sus valores son decrecientes. Por eso el mayor válido está al frente. Cada elemento retirado del fondo tiene uno posterior de valor al menos igual, que durará más dentro de las ventanas.\n\nCada índice entra una vez y sale a lo sumo una vez. El costo total es O(n), aunque cada actualización tenga dos ciclos. La deque usa O(k) lugares; el programa además guarda a, por lo que su memoria total es O(n).'),
    program(l, 'main imprime solamente cuando ya leyó k elementos. Antes de eso la ventana aún no tiene el tamaño solicitado.', 'Con k=1, cada valor es su propio máximo. Con k=n, debe salir un único máximo. Los valores negativos funcionan igual: no inicializamos el máximo artificialmente en cero.'),
    detail(l, 7),
  ]),
};
