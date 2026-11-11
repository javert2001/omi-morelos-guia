"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Flame,
  Play,
  Settings2,
} from "lucide-react";
import { lessons, levels, problems, type Lesson } from "@/lib/curriculum";
import { localDateKey, streak, weekCount, type Progress } from "@/lib/progress";
import { publicAsset } from "@/lib/public-asset";
import "@/app/studio-dashboard.css";

type StudioDashboardProps = {
  progress: Progress;
  next: Lesson;
  completed: number;
  solved: number;
  onOpenLesson: (id: string) => void;
  onProfile: () => void;
};

const routeGroups = [
  { number: "01", title: "Programación básica", caption: "C++, lectura de problemas y herramientas.", ids: ["inicio", "fundamentos", "general"] },
  { number: "02", title: "Algoritmos y estructuras", caption: "De búsqueda exhaustiva a programación dinámica.", ids: ["bronce", "plata", "oro"] },
  { number: "03", title: "Temas avanzados", caption: "Consultas, geometría, cadenas y flujos.", ids: ["platino", "avanzado"] },
];

const starters = [
  { id: "que-es-programar", label: "Conceptos básicos", symbol: "?" },
  { id: "tu-primer-programa", label: "Código y compilación", symbol: ">_" },
  { id: "entrada-y-salida", label: "Entrada y salida", symbol: "↔" },
];

export default function StudioDashboard({ progress, next, completed, solved, onOpenLesson, onProfile }: StudioDashboardProps) {
  // Server builds and browsers may use different dates and timezones. The first
  // render deliberately has no local date; show the real week after mounting.
  const [today, setToday] = useState<Date | null>(null);
  useEffect(() => {
    let midnight: ReturnType<typeof setTimeout>;
    const refresh = () => {
      const now = new Date();
      setToday(now);
      clearTimeout(midnight);
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      midnight = setTimeout(refresh, tomorrow.getTime() - now.getTime() + 50);
    };
    const onVisible = () => { if (document.visibilityState === "visible") refresh(); };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(midnight);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);
  const percentage = Math.min(100, Math.round((completed / lessons.length) * 100));
  const activeStreak = today ? streak(progress.activity, today) : null;
  const weekly = today ? weekCount(progress.activity, today) : null;
  const goal = Math.max(1, progress.goal);
  const goalPercentage = Math.min(100, ((weekly ?? 0) / goal) * 100);
  const hasStarted = completed > 0 || Boolean(progress.lastLesson);
  const nextLevel = levels.find((level) => level.id === next.level);
  const monday = today ? new Date(today) : null;
  if (monday) {
    monday.setHours(12, 0, 0, 0);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  }
  const weekdays = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
  const week = weekdays.map((label, index) => {
    if (!today || !monday) return { label, count: 0, today: false, future: false, pending: true };
    const date = new Date(monday);
    date.setDate(date.getDate() + index);
    const count = progress.activity[localDateKey(date)] ?? 0;
    return { label, count, today: localDateKey(date) === localDateKey(today), future: date.getTime() > new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12).getTime(), pending: false };
  });

  return (
    <div className="studio-dashboard">
      <section className="course-header" aria-labelledby="studio-hero-title">
        <div className="course-introduction">
          <div className="studio-eyebrow">OLIMPIADA MORELENSE DE INFORMÁTICA</div>
          <h1 id="studio-hero-title">Guía de programación</h1>
          <p className="course-description">Aprende C++ y algoritmos con explicaciones, ejemplos y ejercicios en español. Si nunca has programado, empieza por las primeras lecciones.</p>
          <div className="course-actions">
            <button type="button" className="studio-action studio-action-primary" onClick={() => onOpenLesson(next.id)}>
              {hasStarted ? "Continuar lección" : "Empezar el curso"}<ArrowUpRight size={19} />
            </button>
            <a className="studio-text-action" href="#/ruta">Ver temario <ArrowRight size={16} /></a>
          </div>
        </div>
        <img className="course-mascot" src={publicAsset("brand/entrenator.png")} alt="Entrenator, mascota de la OMRI" width={512} height={512} />
      </section>

      <section className="studio-progress-strip" aria-label="Tu progreso de aprendizaje">
        <div className="studio-progress-overview">
          <div><span className="studio-kicker">AVANCE DEL CURSO</span><strong>{percentage}<span>%</span></strong></div>
          <div className="studio-progress-track" role="progressbar" aria-label="Lecciones completadas" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={lessons.length}><span style={{ width: `${percentage}%` }} /></div>
          <p>{lessons.length - completed} lecciones pendientes</p>
        </div>
        <div className="studio-stat"><strong>{completed}<span> / {lessons.length}</span></strong><span>Lecciones completadas</span></div>
        <div className="studio-stat"><strong>{solved}<span> / {problems.length}</span></strong><span>Problemas resueltos</span></div>
        <div className="studio-stat studio-streak"><strong><Flame size={21} strokeWidth={1.7} />{activeStreak ?? "..."}<span>{activeStreak === 1 ? " día" : " días"}</span></strong><span>Días consecutivos de estudio</span></div>
      </section>

      <div className="studio-current-grid">
        <section className="studio-next-card" aria-labelledby="studio-next-title">
          <div className="studio-card-topline"><span className="studio-kicker">{hasStarted ? "CONTINUAR LECCIÓN" : "PRIMERA LECCIÓN"}</span><span className="studio-pill">{nextLevel?.title ?? "Temario"}</span></div>
          <div className="studio-next-body">
            <div className="studio-next-symbol" aria-hidden="true"><Code2 size={38} strokeWidth={1.4} /><span className="studio-symbol-dot" /></div>
            <div><h2 id="studio-next-title">{next.title}</h2><p>{next.description}</p></div>
          </div>
          <div className="studio-next-bottom"><span>{next.minutes} min de estudio<span className="studio-middle-dot">·</span>Ejercicios con solución</span><button type="button" className="studio-round-button" onClick={() => onOpenLesson(next.id)} aria-label={`Abrir lección: ${next.title}`}><ArrowUpRight size={23} /></button></div>
        </section>

        <section className="studio-week-card" aria-labelledby="studio-week-title">
          <div className="studio-card-topline"><h2 id="studio-week-title">Actividad semanal</h2><button type="button" className="studio-icon-button" onClick={onProfile} aria-label="Ajustar mi meta semanal"><Settings2 size={18} /></button></div>
          <div className="studio-week-total"><strong>{weekly ?? "..."}<span> / {goal}</span></strong><p>{weekly === null ? "Cargando tu actividad…" : weekly >= goal ? "Meta semanal completada" : "lecciones o problemas completados"}</p></div>
          <div className="studio-progress-track studio-week-track" role="progressbar" aria-label="Avance de tu meta semanal" aria-valuenow={weekly === null ? undefined : Math.min(weekly, goal)} aria-valuemin={0} aria-valuemax={goal} aria-valuetext={weekly === null ? "Cargando tu actividad" : `${weekly} actividades de una meta de ${goal}`}><span style={{ width: `${goalPercentage}%` }} /></div>
          <div className="studio-week-days" aria-label="Actividad de esta semana">
            {week.map((day, index) => <div key={day.label} role="img" className={`studio-week-day${day.count > 0 && !day.future ? " is-active" : ""}${day.today ? " is-today" : ""}`} aria-label={`${day.label}${day.today ? ", hoy" : ""}: ${day.pending ? "cargando actividad" : day.future ? "por llegar" : `${day.count} ${day.count === 1 ? "actividad" : "actividades"}`}`}><span>{["L", "M", "X", "J", "V", "S", "D"][index]}</span><i>{day.count > 0 && !day.future ? <Check size={13} strokeWidth={2.5} /> : <span />}</i></div>)}
          </div>
          <button type="button" className="studio-small-action" onClick={onProfile}>Ajustar mi meta <ArrowUpRight size={13} /></button>
        </section>
      </div>

      <section className="studio-route" aria-labelledby="studio-route-title">
        <div className="studio-section-heading"><div><h2 id="studio-route-title">Temario</h2></div><a className="studio-text-action" href="#/ruta">Ver todo <ArrowUpRight size={16} /></a></div>
        <div className="studio-route-groups">
          {routeGroups.map((group) => <div className="studio-route-group" key={group.number}>
            <div className="studio-group-heading"><span>{group.number}</span><div><h3>{group.title}</h3><p>{group.caption}</p></div></div>
            <div className="studio-levels">{group.ids.map((id) => {
              const level = levels.find((item) => item.id === id);
              if (!level) return null;
              const available = lessons.filter((lesson) => lesson.level === id);
              const done = available.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
              return <a className="studio-level-link" href={`#/ruta/${id}`} key={id}><span className={`studio-level-mark${done === available.length && done > 0 ? " is-complete" : ""}`} aria-hidden="true">{done === available.length && done > 0 ? <Check size={12} /> : <span />}</span><span className="studio-level-name">{level.title}</span><span className="studio-level-count" aria-label={`${done} de ${available.length} lecciones completadas`}>{done}<span>/{available.length}</span></span><ChevronRight size={15} /></a>;
            })}</div>
          </div>)}
        </div>
      </section>

      <section className="studio-starters" aria-labelledby="studio-starters-title">
        <div className="studio-section-heading"><div><h2 id="studio-starters-title">Primeras lecciones</h2></div><span className="studio-quiet-note">No necesitas conocimientos previos.</span></div>
        <div className="studio-starter-grid">{starters.map((item, index) => {
          const lesson = lessons.find((candidate) => candidate.id === item.id);
          if (!lesson) return null;
          const done = progress.completedLessons.includes(item.id);
          return <button type="button" className="studio-starter" onClick={() => onOpenLesson(item.id)} key={item.id}>
            <div className="studio-starter-top"><span className="studio-starter-index">0{index + 1}</span><span className="studio-starter-symbol" aria-hidden="true">{item.symbol}</span></div>
            <span className="studio-starter-caption">{item.label}</span><h3>{lesson.title}</h3><span className="studio-starter-bottom"><span>{done ? <><Check size={13} />Completada</> : `${lesson.minutes} min · Ejercicios incluidos`}</span><ArrowUpRight size={19} /></span>
          </button>;
        })}</div>
      </section>

      <section className="studio-lab" aria-labelledby="studio-lab-title">
        <div className="studio-lab-graphic" aria-hidden="true"><span>&lt;</span><i>/</i><span>&gt;</span></div>
        <div className="studio-lab-copy"><h2 id="studio-lab-title">Laboratorio C++</h2><p>Escribe y ejecuta programas en el navegador. También puedes abrir los ejemplos desde cada lección.</p></div>
        <a className="studio-action studio-action-light" href="#/compilador"><Play size={15} fill="currentColor" />Abrir el laboratorio<ArrowUpRight size={18} /></a>
      </section>

      <footer className="studio-dashboard-footer"><img src={publicAsset("brand/omri-logo.png")} alt="Olimpiada Morelense de Informática" width={1080} height={270} /><span>Curso de programación y algoritmos<br /><strong>Olimpiada Morelense de Informática</strong></span><a href="#/acerca">Conoce la guía <ArrowUpRight size={13} /></a></footer>
    </div>
  );
}
