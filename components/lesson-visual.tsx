"use client";

import { useEffect, useId, useState } from "react";
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from "lucide-react";
import { lessonVisuals, type VisualRow } from "@/lib/lesson-visuals";
import type { LessonPicture } from "@/lib/curriculum/types";
import "./lesson-visual.css";

function Rows({ rows }: { rows: VisualRow[] }) {
  const columns=Math.max(...rows.map(row=>row.values.length));
  return <div className="visual-rows-scroll"><div className="visual-rows" style={{minWidth:columns*44}}>{rows.map((row,i)=><div className="visual-row" key={i} role="group" aria-label={row.label}>
    <span className="visual-row-label">{row.label}</span>
    <div className="visual-cells" style={{gridTemplateColumns:`repeat(${columns}, minmax(0, 1fr))`}}>{row.values.map((value,j)=><span key={j} className={`visual-cell ${row.highlight?.includes(j)?"is-active":""} ${row.muted?.includes(j)?"is-muted":""}`}>
      {row.highlight?.includes(j)&&<span className="sr-only">Destacado: </span>}{value}
    </span>)}</div>
  </div>)}</div></div>;
}

export function LessonDrawing({ picture }: { picture: LessonPicture }) {
  return <figure className="lesson-drawing"><figcaption>{picture.caption}</figcaption><Rows rows={picture.rows} /></figure>;
}

export default function LessonAnimation({ visual }: { visual: string }) {
  const animation=lessonVisuals[visual];
  if(!animation)return null;
  return <Player key={visual} animation={animation} />;
}

function Player({ animation }: { animation: (typeof lessonVisuals)[string] }) {
  const [step,setStep]=useState(0),[playing,setPlaying]=useState(false),[reduceMotion,setReduceMotion]=useState(false);
  const id=useId(),frame=animation.frames[step],last=animation.frames.length-1;
  useEffect(()=>{
    const media=window.matchMedia("(prefers-reduced-motion: reduce)");
    const update=()=>{setReduceMotion(media.matches);if(media.matches)setPlaying(false);};
    update();media.addEventListener("change",update);return()=>media.removeEventListener("change",update);
  },[]);
  useEffect(()=>{
    if(!playing||reduceMotion)return;
    const timer=window.setTimeout(()=>{if(step<last)setStep(step+1);if(step+1>=last)setPlaying(false);},5000);
    return()=>window.clearTimeout(timer);
  },[playing,step,last,reduceMotion]);
  const go=(next:number)=>{setPlaying(false);setStep(Math.max(0,Math.min(last,next)));};
  return <figure className="lesson-visual" aria-labelledby={`${id}-title`}>
    <figcaption className="visual-heading"><div><h3 id={`${id}-title`}>{animation.title}</h3></div><span className="visual-counter">{step+1} / {last+1}</span></figcaption>
    <div className="visual-progress" aria-hidden="true">{animation.frames.map((_,i)=><span key={i} className={i<=step?"filled":""} />)}</div>
    {frame.nodes&&<svg className="visual-graph" viewBox="0 0 600 290" role="img" aria-labelledby={`${id}-diagram`}>
      <title id={`${id}-diagram`}>{frame.title}. {frame.nodes.map(n=>`${n.label}: ${n.value}`).join("; ")}</title>
      {frame.edges?.map(([from,to])=>{const a=frame.nodes!.find(n=>n.id===from)!,b=frame.nodes!.find(n=>n.id===to)!;return <line key={`${from}-${to}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="visual-edge" />;})}
      {frame.nodes.map(node=><g key={node.id} className={`visual-node ${node.state?`is-${node.state}`:""}`}>
        <rect x={node.x-36} y={node.y-24} width="72" height="48" rx="13" />
        <text className="visual-node-value" x={node.x} y={node.y+9} textAnchor="middle">{node.value}</text>
        <text className="visual-node-label" x={node.x} y={node.y+47} textAnchor="middle">{node.label.replace("posiciones ","").replace("posición ","")}</text>
      </g>)}
    </svg>}
    {frame.rows&&<Rows rows={frame.rows} />}
    <div className="visual-explanation" aria-live={playing?"off":"polite"} aria-atomic="true">
      <h4>{frame.title}</h4><p>{frame.explanation}</p>
      {frame.result&&<strong className="visual-result">{frame.result}</strong>}
    </div>
    <div className="visual-controls">
      <button type="button" onClick={()=>go(step-1)} disabled={step===0} aria-label="Paso anterior de la animación"><ArrowLeft size={16} /><span>Anterior</span></button>
      {!reduceMotion&&<button type="button" className="visual-play" onClick={()=>{if(playing){setPlaying(false);return;}if(step===last)setStep(0);setPlaying(true);}} aria-pressed={playing} aria-label={playing?"Pausar animación":"Reproducir animación"}>
        {playing?<Pause size={15}/>:<Play size={15}/>}<span>{playing?"Pausar":"Reproducir"}</span>
      </button>}
      <button type="button" className="visual-next" onClick={()=>go(step+1)} disabled={step===last} aria-label="Paso siguiente de la animación"><span>Siguiente</span><ArrowRight size={16}/></button>
      <button type="button" className="visual-reset" onClick={()=>go(0)} aria-label="Reiniciar animación" title="Volver al primer paso"><RotateCcw size={15}/></button>
    </div>
    <p className="visual-caption">{frame.nodes?"Azul: lo que estamos revisando. Los números debajo indican posiciones o distancias. ":""}{reduceMotion?"Usa los botones para cambiar de paso.":"Usa los botones o reproduce un paso cada 5 segundos."}</p>
  </figure>;
}
