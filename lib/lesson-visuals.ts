export type VisualState = "active" | "done" | "muted";
export type VisualNode = { id: string; x: number; y: number; value: string; label: string; state?: VisualState };
export type VisualRow = { label: string; values: string[]; highlight?: number[]; muted?: number[] };
export type VisualFrame = { title: string; explanation: string; nodes?: VisualNode[]; edges?: [string, string][]; rows?: VisualRow[]; result?: string };
export type LessonVisual = { title: string; frames: VisualFrame[] };

const treeEdges: [string, string][] = [["1","2"],["1","3"],["2","4"],["2","5"],["3","6"],["3","7"]];
const positions = [[300,38],[160,135],[440,135],[65,235],[225,235],[375,235],[535,235]];
const ranges = ["posiciones 1–4","posiciones 1–2","posiciones 3–4","posición 1","posición 2","posición 3","posición 4"];
function tree(values: number[], operation: "sum" | "max", active: number[] = [], done: number[] = [], visible?: number[]): VisualNode[] {
  const combine = (a: number,b: number) => operation === "sum" ? a+b : Math.max(a,b);
  const left=combine(values[0],values[1]), right=combine(values[2],values[3]);
  const numbers=[combine(left,right),left,right,...values];
  return numbers.map((number,i)=>({id:String(i+1),x:positions[i][0],y:positions[i][1],value:visible&&!visible.includes(i+1)?"?":String(number),label:ranges[i],state:active.includes(i+1)?"active":done.includes(i+1)?"done":visible&&!visible.includes(i+1)?"muted":undefined}));
}
function treeFrame(title: string, explanation: string, values: number[], operation: "sum" | "max", active: number[], done: number[] = [], result?: string, visible?: number[]): VisualFrame {
  return { title, explanation, nodes:tree(values,operation,active,done,visible),edges:treeEdges,result };
}

export function segmentBuild(): LessonVisual {
  const a=[2,7,1,5];
  return { title:"Construye el árbol desde abajo",frames:[
    treeFrame("1. Coloca los cuatro números","Cada caja de abajo guarda un número del arreglo. Las llamamos hojas.",a,"sum",[4,5,6,7],[],undefined,[4,5,6,7]),
    treeFrame("2. Junta la mitad izquierda","2 + 7 = 9. La caja que está encima resume esas dos posiciones.",a,"sum",[2],[4,5],undefined,[2,4,5,6,7]),
    treeFrame("3. Junta la mitad derecha","1 + 5 = 6. Ya conocemos la suma de cada mitad.",a,"sum",[3],[2,6,7],undefined,[2,3,4,5,6,7]),
    treeFrame("4. Junta las dos mitades","9 + 6 = 15. La caja de arriba, o raíz, guarda la suma de los cuatro números.",a,"sum",[1],[2,3],"Suma total: 15"),
  ]};
}

export function segmentQuery(): LessonVisual {
  const a=[2,7,1,5];
  return { title:"Suma las posiciones 2 y 3",frames:[
    treeFrame("1. La raíz incluye números de más","Queremos 7 + 1. La suma 15 también incluye las posiciones 1 y 4, así que no podemos tomarla completa.",a,"sum",[1]),
    treeFrame("2. Revisa la mitad izquierda","Su suma es 9, pero solo necesitamos la posición 2. Bajamos otra vez.",a,"sum",[2]),
    treeFrame("3. Descarta la posición 1","El 2 está fuera de la pregunta. No aporta nada a esta suma.",a,"sum",[4]),
    treeFrame("4. Guarda el 7","La posición 2 sí está dentro. Añadimos su valor a la respuesta.",a,"sum",[5],[5],"Llevamos: 7"),
    treeFrame("5. Revisa la mitad derecha","De las posiciones 3 y 4 solo necesitamos la 3. Esta mitad también debe abrirse.",a,"sum",[3],[5]),
    treeFrame("6. Guarda el 1","La posición 3 aporta 1. La posición 4 queda fuera.",a,"sum",[6],[5,6],"Respuesta: 7 + 1 = 8"),
  ]};
}

export function segmentUpdate(): LessonVisual {
  const before=[2,7,1,5],after=[2,3,1,5];
  const initial=tree(before,"sum");
  const leaf=initial.map(n=>n.id==="5"?{...n,value:"3",state:"active" as const}:n);
  const parent=leaf.map(n=>n.id==="2"?{...n,value:"5",state:"active" as const}:{...n,state:n.id==="5"?"done" as const:undefined});
  return { title:"Cambia un número y sube",frames:[
    treeFrame("1. Antes del cambio","La posición 2 vale 7. Vamos a reemplazarla por 3.",before,"sum",[5]),
    {title:"2. Cambia solo la hoja",explanation:"Escribe 3 en la posición 2. Sus dos cajas superiores todavía tienen la suma anterior: ahora toca corregirlas.",nodes:leaf,edges:treeEdges},
    {title:"3. Corrige su padre",explanation:"La mitad izquierda ahora suma 2 + 3 = 5. La mitad derecha sigue sumando 6.",nodes:parent,edges:treeEdges},
    treeFrame("4. Corrige la raíz","La suma total ahora es 5 + 6 = 11. Solo cambiaron tres cajas; las demás no necesitaban trabajo.",after,"sum",[1],[2,5],"Nueva suma total: 11"),
  ]};
}

export function segmentSearch(groups=[4,3,6]): LessonVisual {
  const a=[2,7,1,5], frames:VisualFrame[]=[];
  frames.push(treeFrame("Cada caja guarda el mayor","Los salones tienen 2, 7, 1 y 5 lugares. Buscamos siempre el primer salón donde quepa el grupo, de izquierda a derecha.",a,"max",[1]));
  for(const group of groups) {
    if(Math.max(...a)<group) {frames.push(treeFrame(`Llegan ${group}: no caben`,`${Math.max(...a)} es el mayor espacio disponible y es menor que ${group}. Ningún salón sirve.`,a,"max",[1],[],"Respuesta: 0 (ningún salón)"));continue;}
    frames.push(treeFrame(`Llegan ${group}: empieza arriba`,`El máximo general alcanza ${group}. Existe al menos un salón adecuado.`,a,"max",[1]));
    const left=Math.max(a[0],a[1])>=group, parent=left?2:3, start=left?0:2;
    frames.push(treeFrame(left?"La izquierda sí alcanza":"La izquierda no alcanza",left?`El máximo izquierdo es ${Math.max(a[0],a[1])}. Buscamos allí porque sus salones aparecen antes.`:`El máximo izquierdo es ${Math.max(a[0],a[1])}, menor que ${group}. Podemos descartar ambos salones y buscar a la derecha.`,a,"max",[parent]));
    const index=a[start]>=group?start:start+1;
    frames.push(treeFrame(`Elige el salón ${index+1}`,index===start?`Tiene ${a[index]} lugares: alcanza y es el primero de esta mitad.`:`El salón ${start+1} tiene ${a[start]} y no alcanza. El siguiente tiene ${a[index]}: ese es el primero que sirve.`,a,"max",[index+4],[],`Respuesta: salón ${index+1}`));
    const old=a[index];a[index]-=group;
    frames.push(treeFrame("Ocupa los lugares y actualiza",`Quedan ${old} − ${group} = ${a[index]} lugares en el salón ${index+1}. Recalculamos los máximos de su camino hacia arriba.`,a,"max",[index+4,parent,1],[],`Capacidades: [${a.join(", ")}]`));
  }
  return { title:"Busca un salón sin revisar todos",frames };
}

function binarySearch(values=[2,5,8,11,14,17,20],target=14): LessonVisual {
  const frames:VisualFrame[]=[];let l=0,r=values.length;
  frames.push({title:`Buscamos el primer valor que alcanza ${target}`,explanation:"Los números ya están ordenados. La zona de búsqueda contiene al principio todas las casillas.",rows:[{label:"Lista ordenada",values:values.map(String)}]});
  while(l<r){const m=Math.floor((l+r)/2);frames.push({title:`Mira la posición ${m+1}`,explanation:values[m]<target?`${values[m]} es menor que ${target}. Todo lo que está a su izquierda también es demasiado pequeño. Descartamos hasta esta casilla.`:`${values[m]} alcanza o supera ${target}. El primer valor que alcanza ${target} podría estar aquí o antes. Movemos el límite derecho a esta posición.`,rows:[{label:"Casillas todavía candidatas",values:values.map(String),highlight:[m],muted:values.flatMap((_,i)=>i<l||i>r?[i]:[])}]});if(values[m]<target)l=m+1;else r=m;}
  frames.push({title:"Los límites se encontraron",explanation:l<values.length?`La primera posición cuyo valor alcanza ${target} es la ${l+1}. Allí hay ${values[l]}. Aunque el número aparezca más veces, encontramos su primera casilla válida.`:`Ninguna casilla alcanza ${target}. El límite terminó después del último número.`,rows:[{label:"Respuesta",values:values.map(String),highlight:l<values.length?[l]:[]}],result:l<values.length?`Primer valor ≥ ${target}: posición ${l+1}`:"No hay un valor que alcance el objetivo"});return{title:"Descarta media lista cada vez",frames};
}
function prefixSums(a=[2,7,1,5]): LessonVisual {
  const p=[0],frames:VisualFrame[]=[];
  frames.push({title:"Empieza con cero",explanation:"Antes de tomar ningún número, la suma es cero. Por eso ponemos P[0] = 0.",rows:[{label:"Números",values:a.map(String)},{label:"Suma acumulada P",values:["0",...a.map(()=>"?")]}]});
  a.forEach((x,i)=>{p.push(p.at(-1)!+x);frames.push({title:`Añade el número ${i+1}`,explanation:`Llevábamos ${p[i]}. Añadimos ${x}: ahora la suma acumulada es ${p[i+1]}.`,rows:[{label:"Números",values:a.map(String),highlight:[i]},{label:"P",values:[...p.map(String),...Array(a.length-i-1).fill("?")],highlight:[i+1]}]});});
  frames.push({title:"Quita lo que sobra",explanation:`Queremos las posiciones 2 y 3: ${a[1]} + ${a[2]}. P[3] = ${p[3]} incluye también el primer ${a[0]}. Lo quitamos con P[1].`,rows:[{label:"Números",values:a.map(String),highlight:[1,2]},{label:"P",values:p.map(String),highlight:[1,3]}],result:`P[3] − P[1] = ${p[3]} − ${p[1]} = ${p[3]-p[1]}`});return{title:"Guarda sumas que puedes reutilizar",frames};
}
function bubbleSort(): LessonVisual {
  const a=[4,2,3,1],frames:VisualFrame[]=[{title:"Ordena de menor a mayor",explanation:"Comparamos vecinos. Si el izquierdo es mayor, intercambiamos sus lugares.",rows:[{label:"Arreglo",values:a.map(String)}]}];
  for(let end=a.length-1;end>0;end--)for(let i=0;i<end;i++){const old=[...a],swap=a[i]>a[i+1];if(swap)[a[i],a[i+1]]=[a[i+1],a[i]];frames.push({title:swap?`Intercambia ${old[i]} y ${old[i+1]}`:`${a[i]} y ${a[i+1]} ya están en orden`,explanation:swap?"El mayor pasa a la derecha. Repetimos con la siguiente pareja.":"Esta pareja no necesita un cambio. Seguimos comparando.",rows:[{label:"Antes",values:old.map(String),highlight:[i,i+1]},{label:"Después",values:a.map(String),highlight:[i,i+1]}]});}
  frames.push({title:"Terminado",explanation:"Después de cada vuelta, el mayor pendiente llegó al final de su zona. Todas las casillas están ordenadas.",rows:[{label:"Resultado",values:a.map(String)}],result:"1 ≤ 2 ≤ 3 ≤ 4"});return{title:"Mueve el mayor hacia la derecha",frames};
}
function stairs(): LessonVisual {
  const a=[1,1,2,3,5];return{title:"Llega al escalón 4 de todas las maneras",frames:[
    {title:"Estar en el piso cuenta como una manera",explanation:"Puedes subir uno o dos escalones. Hay una manera de estar en el escalón 0: no dar ningún salto.",rows:[{label:"Escalón",values:["0","1","2","3","4"]},{label:"Maneras",values:["1","?","?","?","?"],highlight:[0]}]},
    ...a.slice(1).map((x,j)=>{const i=j+1;return{title:`Completa el escalón ${i}`,explanation:i===1?"Al primer escalón solo llegas desde el piso. Por eso hay una manera.":`El último salto viene del escalón ${i-1} o del ${i-2}. Sus maneras son ${a[i-1]} y ${a[i-2]}; sumarlas da ${x}.`,rows:[{label:"Escalón",values:["0","1","2","3","4"]},{label:"Maneras",values:a.map((v,k)=>k<=i?String(v):"?"),highlight:[i]}],result:i===4?"Respuesta: 5 maneras":undefined};})]};
}
function bfs(four=false): LessonVisual {
  const graph: Record<string,string[]>=four?{A:["B","C"],B:["A","D"],C:["A"],D:["B"]}:{A:["B","C"],B:["A","D"],C:["A","D"],D:["B","C","E"],E:["D"]};
  const coords:Record<string,[number,number]>={A:[75,140],B:[235,60],C:[235,225],D:[405,140],E:[545,140]};
  const edges:[string,string][]=four?[["A","B"],["A","C"],["B","D"]]:[["A","B"],["A","C"],["B","D"],["C","D"],["D","E"]];
  const queue=["A"],seen=new Set(["A"]),dist:Record<string,number>={A:0},frames:VisualFrame[]=[];
  const snapshot=(title:string,explanation:string,current?:string):VisualFrame=>({title,explanation,nodes:Object.keys(graph).map(id=>({id,x:coords[id][0],y:coords[id][1],value:id,label:seen.has(id)?`${dist[id]} pasos`:"sin visitar",state:id===current?"active":seen.has(id)?"done":undefined})),edges,rows:[{label:"Fila de espera",values:queue.length?[...queue]:["vacía"]}]});
  frames.push(snapshot("Empieza en A","Marca A y agrégalo a una fila. Siempre atendemos primero al que llegó antes.","A"));
  while(queue.length){const v=queue.shift()!;const fresh=graph[v].filter(x=>!seen.has(x));fresh.forEach(x=>{seen.add(x);dist[x]=dist[v]+1;queue.push(x);});frames.push(snapshot(`Atiende ${v}`,fresh.length?`Sus vecinos nuevos son ${fresh.join(" y ")}. Márcalos al agregarlos a la fila: así no entran dos veces.`:"Todos sus vecinos ya estaban marcados. No volvemos a agregarlos.",v));}
  frames.push({...snapshot("Ya no queda nadie en la fila",`Visitamos primero los lugares cercanos a A y luego los lejanos. ${four?"D está a dos":"E está a tres"} pasillos de distancia.`),result:four?"Distancia de A a D: 2":"Distancia de A a E: 3"});return{title:"BFS: visita por cercanía",frames};
}
function recursion(): LessonVisual {
  return {title:"Baja con preguntas, sube con respuestas",frames:[
    {title:"Pregunta por suma(3)",explanation:"Queremos 1 + 2 + 3. La función separa el 3 y pregunta cuánto vale suma(2).",rows:[{label:"Esperando respuesta",values:["suma(3)","3 + suma(2)"]}]},
    {title:"suma(2) hace una pregunta menor",explanation:"También separa su último número. Ahora necesitamos suma(1).",rows:[{label:"Llamadas pendientes",values:["suma(3)","suma(2)","suma(1)"]}]},
    {title:"Llegamos a una respuesta conocida",explanation:"suma(1) vale 1. Este es el caso base: responde sin llamar de nuevo a la función.",rows:[{label:"Respuestas",values:["suma(1) = 1"],highlight:[0]}]},
    {title:"Devuelve la primera respuesta",explanation:"suma(2) ya sabe que suma(1) vale 1. Calcula 2 + 1 y devuelve 3.",rows:[{label:"Regreso",values:["suma(1) = 1","suma(2) = 3"],highlight:[1]}]},
    {title:"Termina la pregunta original",explanation:"suma(3) recibe el 3 que esperaba y calcula 3 + 3 = 6. Cada llamada recupera su propio lugar.",rows:[{label:"Regreso",values:["1","3","6"],highlight:[2]}],result:"suma(3) = 6"},
  ]};
}
function rangeAdd(): LessonVisual {
  return {title:"Una nota para cambiar toda una mitad",frames:[
    treeFrame("Partimos de [2, 7, 1, 5]","Vamos a sumar 3 a las posiciones 1 y 2. Ambas viven en la misma mitad.",[2,7,1,5],"sum",[2]),
    {title:"La mitad aumenta de golpe",explanation:"Hay dos números. La suma de esa mitad aumenta 3 × 2 = 6: pasa de 9 a 15. Anotamos «+3 pendiente» para sus hijos.",nodes:tree([2,7,1,5],"sum",[2]).map(n=>n.id==="2"?{...n,value:"15",label:"+3 pendiente"}:n.id==="1"?{...n,value:"21"}:n),edges:treeEdges,result:"La suma total ya es correcta: 21"},
    {title:"Ahora preguntan por una sola posición",explanation:"Para entrar a la posición 2, primero entregamos la nota a los dos hijos: 2 pasa a 5 y 7 pasa a 10. Borramos la nota del padre.",nodes:tree([5,10,1,5],"sum",[4,5]),edges:treeEdges},
    treeFrame("Ya podemos responder","La posición 2 vale 10. Las notas pendientes evitan bajar hasta cada hoja cuando una operación cubre un grupo completo.",[5,10,1,5],"sum",[5],[],"Respuesta: 10"),
  ]};
}

export const lessonVisuals: Record<string, LessonVisual> = {
  "segment-build":segmentBuild(),"segment-query":segmentQuery(),"segment-update":segmentUpdate(),"segment-search":segmentSearch(),
  "range-add":rangeAdd(),"binary-search":binarySearch(),"prefix-sums":prefixSums(),"bubble-sort":bubbleSort(),"dp-stairs":stairs(),"bfs":bfs(),"recursion":recursion(),
  "prefix-sums-guide":prefixSums([3,1,4,2]),"binary-search-first":binarySearch([2,4,4,4,9],4),"bfs-four":bfs(true),
};
