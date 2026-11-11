import './segment-tree-diagram.css';

const nodes = [
  { x: 260, y: 38, label: 'Salones 1 a 4', value: 7 },
  { x: 135, y: 135, label: 'Salones 1 y 2', value: 7 },
  { x: 385, y: 135, label: 'Salones 3 y 4', value: 5 },
  { x: 65, y: 232, label: 'Salón 1', value: 2 },
  { x: 200, y: 232, label: 'Salón 2', value: 7 },
  { x: 320, y: 232, label: 'Salón 3', value: 1 },
  { x: 455, y: 232, label: 'Salón 4', value: 5 },
];
const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];

export default function SegmentTreeDiagram() {
  return <figure className="segment-tree-diagram">
    <figcaption>El número de cada caja es el mayor espacio disponible entre los salones que abarca.</figcaption>
    <div className="segment-tree-scroll" tabIndex={0} aria-label="Diagrama del árbol de máximos">
      <svg viewBox="0 0 520 275" role="img" aria-label="La raíz abarca los salones 1 a 4 y guarda 7. Sus hijos guardan 7 para los salones 1 y 2, y 5 para los salones 3 y 4. Las cuatro hojas guardan 2, 7, 1 y 5.">
        {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={nodes[a].x} y1={nodes[a].y + 29} x2={nodes[b].x} y2={nodes[b].y - 29} />)}
        {nodes.map((node, i) => <g key={node.label}>
          <rect x={node.x - 56} y={node.y - 29} width="112" height="59" rx="8" className={i > 2 ? 'is-leaf' : ''} />
          <text x={node.x} y={node.y - 7} textAnchor="middle" className="segment-tree-label">{node.label}</text>
          <text x={node.x} y={node.y + 20} textAnchor="middle" className="segment-tree-value">{node.value}</text>
        </g>)}
      </svg>
    </div>
    <p className="segment-tree-scroll-hint">Puedes deslizar el dibujo horizontalmente.</p>
  </figure>;
}
