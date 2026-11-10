"use client";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
  type CSSProperties,
} from "react";
import {
  ArrowUpRight,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Bookmark,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Compass,
  Download,
  ExternalLink,
  Flame,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Mountain,
  NotebookPen,
  Play,
  Search,
  Settings2,
  Sparkles,
  Sprout,
  Target,
  Trophy,
  X,
  Zap,
  Copy,
  Circle,
  Network,
  Layers3,
  Binary,
  Medal,
  Terminal,
} from "lucide-react";
import {
  levels,
  lessons,
  problems,
  type Lesson,
  type Problem,
} from "@/lib/curriculum";
import {
  initialProgress,
  loadProgress,
  saveProgress,
  completeLesson,
  solveProblem,
  streak,
  weekCount,
  localDateKey,
  type Progress,
} from "@/lib/progress";

import CurriculumBrowser from "./curriculum-browser";
import PracticeCatalog from "./practice-catalog";
import CppPlayground from "./cpp-playground";
import { guideIndex } from "@/lib/curriculum/source-index";
import { legacyLevelAliases } from "@/lib/curriculum/levels";
import { publicAsset } from "@/lib/public-asset";

type View =
  | "dashboard"
  | "ruta"
  | "problemas"
  | "apuntes"
  | "recursos"
  | "acerca"
  | "leccion"
  | "problema"
  | "compilador";
type Route = { view: View; id?: string };
const icons = [Sprout, Code2, Compass, Medal, Network, Trophy, Layers3, Binary];
const viewNames: Record<View, string> = {
  dashboard: "Mi panel",
  ruta: "Ruta de aprendizaje",
  problemas: "Problemas",
  apuntes: "Mis apuntes",
  recursos: "Recursos",
  acerca: "Acerca de la OMI",
  leccion: "Aprender",
  problema: "Practicar",
  compilador: "Laboratorio C++",
};
function routeFromHash(): Route {
  const [view, id] = window.location.hash.replace(/^#\/?/, "").split("/");
  const mappedId =
    view === "ruta" && id && Object.hasOwn(legacyLevelAliases, id)
      ? legacyLevelAliases[id]
      : id;
  return {
    view: Object.hasOwn(viewNames, view) ? (view as View) : "dashboard",
    id:
      view === "ruta" && mappedId && !levels.some((l) => l.id === mappedId)
        ? undefined
        : mappedId,
  };
}
function go(view: View, id?: string) {
  window.location.hash = `/${view}${id ? `/${id}` : ""}`;
}
function Pill({
  children,
  tone = "green",
}: {
  children: ReactNode;
  tone?: string;
}) {
  return <span className={`pill ${tone}`}>{children}</span>;
}
function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress-track">
      <div style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}
function Modal({
  title,
  onClose,
  children,
  wide = false,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  wide?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    (
      ref.current?.querySelector<HTMLElement>("input,textarea") ??
      ref.current?.querySelector<HTMLElement>("button")
    )?.focus();
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const list = ref.current?.querySelectorAll<HTMLElement>(
          "button,input,select,textarea,a[href]",
        );
        if (!list?.length) return;
        const first = list[0],
          last = list[list.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        ref={ref}
        className={`modal ${wide ? "wide" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-head">
          <h2>{title}</h2>
          <button className="icon-button" aria-label="Cerrar" onClick={onClose}>
            <X size={21} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const draftId =
    "example-" +
    code.length +
    "-" +
    Array.from(code)
      .reduce(
        (hash, char) => (Math.imul(hash, 31) + char.charCodeAt(0)) >>> 0,
        0,
      )
      .toString(16);
  return (
    <>
      <div className="code-block">
        <div className="code-heading">
          <span>C++17</span>
          <div className="code-actions">
            <button
              aria-expanded={editing}
              onClick={() => setEditing(!editing)}
            >
              <Play size={13} />
              {editing ? "Cerrar editor" : "Probar código"}
            </button>
            <button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1800);
                } catch {
                  setCopied(false);
                }
              }}
            >
              <Copy size={13} />
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        </div>
        <pre>
          <code>{code}</code>
        </pre>
      </div>
      {editing && (
        <CppPlayground
          key={draftId}
          initialCode={code}
          storageKey={draftId}
          title="Experimenta con este ejemplo"
          compact
        />
      )}
    </>
  );
}

export default function LearningApp() {
  const [route, setRoute] = useState<Route>({ view: "dashboard" });
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<"search" | "profile" | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  useEffect(() => {
    // Read browser storage after hydration so the server and first client render match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadProgress());
    setReady(true);
    const onRoute = () => {
      const nextRoute = routeFromHash();
      setRoute(nextRoute);
      if (
        nextRoute.view === "leccion" &&
        lessons.some((l) => l.id === nextRoute.id)
      )
        setProgress((p) => ({ ...p, lastLesson: nextRoute.id! }));
      setMenu(false);
      window.scrollTo(0, 0);
    };
    onRoute();
    window.addEventListener("hashchange", onRoute);
    const keys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setModal("search");
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("hashchange", onRoute);
      window.removeEventListener("keydown", keys);
    };
  }, []);
  useEffect(() => {
    if (ready) saveProgress(progress);
  }, [progress, ready]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3500);
    return () => clearTimeout(t);
  }, [toast]);
  const update = (p: Progress) => setProgress(p);
  const openLesson = (id: string) => {
    setProgress((p) => ({ ...p, lastLesson: id }));
    go("leccion", id);
  };
  const lesson = lessons.find((l) => l.id === route.id);
  const problem = problems.find((p) => p.id === route.id);
  const next =
    lessons.find(
      (l) =>
        l.id === progress.lastLesson &&
        !progress.completedLessons.includes(l.id),
    ) ||
    lessons.find(
      (l) => !l.optional && !progress.completedLessons.includes(l.id),
    ) ||
    lessons[0];
  const completed = progress.completedLessons.filter((id) =>
    lessons.some((l) => l.id === id),
  ).length;
  const solved = progress.solvedProblems.filter((id) =>
    problems.some((p) => p.id === id),
  ).length;
  const closeModal = useCallback(() => setModal(null), []);
  const nav = [
    { view: "dashboard", label: "Mi panel", icon: LayoutDashboard },
    { view: "ruta", label: "Ruta de aprendizaje", icon: Compass },
    { view: "problemas", label: "Problemas", icon: Code2 },
    { view: "compilador", label: "Laboratorio C++", icon: Terminal },
    { view: "apuntes", label: "Mis apuntes", icon: NotebookPen },
  ] as const;
  return (
    <div className="app-shell">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById("main-content");
          main?.focus();
          main?.scrollIntoView();
        }}
      >
        Saltar al contenido
      </a>
      {menu && (
        <button
          className="sidebar-shade"
          aria-label="Cerrar menú"
          onClick={() => setMenu(false)}
        />
      )}
      <aside
        className={`sidebar ${menu ? "open" : ""}`}
        aria-label="Navegación principal"
      >
        <a className="brand" href="#/dashboard">
          <span className="brand-mark">
            <Code2 size={26} strokeWidth={2.3} />
          </span>
          <span>
            <strong>
              OMI <span>Morelos</span>
            </strong>
            <small>EL SIGUIENTE PASO ERES TÚ</small>
          </span>
        </a>
        <div className="workspace-label">
          <span className="tiny-dot" /> Tu espacio de aprendizaje{" "}
          <ChevronDown size={14} />
        </div>
        <div className="nav-label">APRENDE A TU RITMO</div>
        <nav>
          {nav.map((item) => (
            <a
              key={item.view}
              href={`#/${item.view}`}
              aria-current={route.view === item.view ? "page" : undefined}
              className={`nav-link ${route.view === item.view || (item.view === "ruta" && route.view === "leccion") || (item.view === "problemas" && route.view === "problema") ? "active" : ""}`}
            >
              <item.icon size={19} />
              <span>{item.label}</span>
              {item.view === "ruta" && (
                <span className="nav-count">{levels.length}</span>
              )}
            </a>
          ))}
        </nav>
        <div className="nav-label second">EXPLORA</div>
        <nav>
          <a
            className={`nav-link ${route.view === "recursos" ? "active" : ""}`}
            href="#/recursos"
          >
            <BookOpen size={19} />
            Recursos útiles
            <ArrowUpRight className="nav-end" size={15} />
          </a>
          <a
            className={`nav-link ${route.view === "acerca" ? "active" : ""}`}
            href="#/acerca"
          >
            <Trophy size={19} />
            Acerca de la OMI
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <span className="tip-icon">
              <Sparkles size={18} />
            </span>
            <strong>
              Un poco cada día,
              <br />
              un gran camino por delante.
            </strong>
            <p>
              No necesitas saber programar.
              <br />
              Solo necesitas curiosidad.
            </p>
            <a href="#/ruta">
              Da tu primer paso <ArrowRight size={15} />
            </a>
          </div>
          <button
            className="profile-button"
            onClick={() => setModal("profile")}
          >
            <span className="avatar">
              {progress.name ? progress.name.charAt(0).toUpperCase() : "Tú"}
            </span>
            <span>
              <strong>{progress.name || "Tu perfil"}</strong>
              <small>{progress.school} · Aprendiz</small>
            </span>
            <Settings2 size={17} />
          </button>
        </div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label="Abrir menú"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={21} />
            </button>
            <span>Tu aprendizaje</span>
            <ChevronRight size={14} />
            <strong>{viewNames[route.view]}</strong>
          </div>
          <div className="top-actions">
            <button
              className="search-button"
              aria-label="Buscar en la guía"
              onClick={() => setModal("search")}
            >
              <Search size={16} />
              <span>Buscar en la guía...</span>
              <kbd>⌘ K</kbd>
            </button>
            <span className="top-divider" />
            <span className="streak-top">
              <Flame size={18} />
              <strong>{streak(progress.activity)}</strong>
              <span>{streak(progress.activity) === 1 ? "día" : "días"}</span>
            </span>
            <button
              className="avatar small-avatar"
              aria-label="Editar mi perfil"
              onClick={() => setModal("profile")}
            >
              {progress.name ? progress.name.charAt(0).toUpperCase() : "Tú"}
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="main-content">
          {route.view === "dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <div className="eyebrow">TU CAMINO EN LA INFORMÁTICA</div>
                  <h1>
                    {progress.name
                      ? `¡Hola, ${progress.name}!`
                      : "Un gran futuro empieza aquí."}
                    <span className="hello-spark">✳</span>
                  </h1>
                  <p>
                    Aprende a programar, resuelve retos y prepárate para la OMI
                    Morelos.
                  </p>
                </div>
                <span className="local-badge">
                  <span />
                  Hecho para aprender
                </span>
              </div>
              <section className="welcome-card">
                <div className="welcome-copy">
                  <span className="hero-tag">
                    <Sprout size={14} /> DESDE CERO, A TU RITMO
                  </span>
                  <h2>
                    Las grandes ideas
                    <br />
                    empiezan con un <span>hola.</span>
                  </h2>
                  <p>
                    No importa si nunca has escrito una línea de código.
                    <br className="desktop-br" /> Este es tu lugar para empezar
                    y llegar más lejos.
                  </p>
                  <button
                    className="button primary"
                    onClick={() => openLesson(next.id)}
                  >
                    {completed ? "Continuar aprendiendo" : "Comenzar mi camino"}
                    <ArrowRight size={17} />
                  </button>
                  <span className="hero-footnote">
                    <Check size={13} /> Gratis · En español · Sin experiencia
                    previa
                  </span>
                </div>
                <img
                  className="hero-illustration"
                  src={publicAsset("learning-illustration.svg")}
                  alt="Una ventana de código entre las montañas de Morelos"
                />
              </section>
              <div className="stats-grid">
                <Stat
                  icon={<BookOpen />}
                  color="green"
                  label="Lecciones completadas"
                  value={completed}
                  suffix={`/ ${lessons.length}`}
                  foot={
                    completed ? "Cada idea cuenta" : "Tu primera idea te espera"
                  }
                />
                <Stat
                  icon={<Code2 />}
                  color="purple"
                  label="Problemas resueltos"
                  value={solved}
                  suffix={`/ ${problems.length}`}
                  foot={
                    solved
                      ? "¡Buen trabajo, sigue así!"
                      : "Convierte ideas en soluciones"
                  }
                />
                <Stat
                  icon={<Flame />}
                  color="orange"
                  label="Racha de aprendizaje"
                  value={streak(progress.activity)}
                  suffix={streak(progress.activity) === 1 ? "día" : "días"}
                  foot="La constancia hace la diferencia"
                />
                <Stat
                  icon={<Target />}
                  color="blue"
                  label="Meta de la semana"
                  value={weekCount(progress.activity)}
                  suffix={`/ ${progress.goal}`}
                  foot="Pequeños pasos, grandes logros"
                />
              </div>
              <div className="dashboard-columns">
                <div className="dashboard-primary">
                  <section className="card path-section">
                    <div className="section-heading">
                      <div>
                        <h2>
                          Tu ruta de aprendizaje{" "}
                          <span className="muted-number">
                            {String(levels.length).padStart(2, "0")}
                          </span>
                        </h2>
                        <p>De tu primer programa a tu primer gran reto.</p>
                      </div>
                      <a className="text-link" href="#/ruta">
                        Ver ruta completa <ArrowRight size={15} />
                      </a>
                    </div>
                    <div className="level-list">
                      {levels.map((level, i) => {
                        const Icon = icons[i % icons.length];
                        const count = lessons.filter(
                          (l) => l.level === level.id,
                        ).length;
                        const done = lessons.filter(
                          (l) =>
                            l.level === level.id &&
                            progress.completedLessons.includes(l.id),
                        ).length;
                        return (
                          <a
                            className="level-row"
                            key={level.id}
                            href={`#/ruta/${level.id}`}
                          >
                            <span className={`level-icon color-${i % 8}`}>
                              <Icon size={22} />
                            </span>
                            <div className="level-info">
                              <div>
                                <h3>{level.title}</h3>
                                {i === 0 && <Pill>Empieza aquí</Pill>}
                              </div>
                              <p>{level.description}</p>
                              <div className="level-meta">
                                <span>{count} lecciones</span>
                                <span>·</span>
                                <span>{level.eyebrow}</span>
                              </div>
                            </div>
                            <div className="level-progress">
                              <span>
                                {done}/{count}
                              </span>
                              <ProgressBar value={(done / count) * 100} />
                            </div>
                            <ChevronRight size={18} />
                          </a>
                        );
                      })}
                    </div>
                  </section>
                  {ready && <Activity progress={progress} />}
                </div>
                <aside className="dashboard-secondary">
                  <section className="card weekly-card">
                    <div className="section-heading">
                      <h2>Tu meta, tu ritmo</h2>
                      <Target size={19} />
                    </div>
                    <div
                      className="goal-ring"
                      style={
                        {
                          "--progress": `${Math.min(100, (weekCount(progress.activity) / progress.goal) * 100)}%`,
                        } as CSSProperties
                      }
                    >
                      <div>
                        <strong>
                          {weekCount(progress.activity)}
                          <span> / {progress.goal}</span>
                        </strong>
                        <small>esta semana</small>
                      </div>
                    </div>
                    <h3>
                      {weekCount(progress.activity) >= progress.goal
                        ? "¡Meta cumplida!"
                        : "Haz espacio para aprender"}
                    </h3>
                    <p>
                      Completa {progress.goal} lecciones o retos esta semana.
                      ¡Cada avance cuenta!
                    </p>
                    <button
                      className="button subtle"
                      onClick={() => setModal("profile")}
                    >
                      Ajustar mi meta <Settings2 size={14} />
                    </button>
                  </section>
                  <section className="daily-card">
                    <div className="challenge-kicker">
                      <Zap size={15} /> TU PRIMER RETO
                    </div>
                    <div className="challenge-code">&lt; / &gt;</div>
                    <h2>¡Hola, Morelos!</h2>
                    <p>
                      Todo gran programador empezó con un saludo. Escribe el
                      tuyo.
                    </p>
                    <div className="challenge-meta">
                      <Pill tone="orange">Inicial</Pill>
                      <span>
                        <Clock3 size={13} />5 min
                      </span>
                    </div>
                    <button
                      className="button challenge-button"
                      onClick={() => go("problema", "hola-morelos")}
                    >
                      Resolver el reto <ArrowRight size={16} />
                    </button>
                  </section>
                </aside>
              </div>
              <div className="section-heading recommendation-heading">
                <div>
                  <h2>Un buen lugar para empezar</h2>
                  <p>Lo esencial, explicado paso a paso.</p>
                </div>
                <span className="small-muted">SELECCIONADO PARA TI</span>
              </div>
              <div className="recommend-grid">
                {lessons.slice(0, 3).map((item, i) => (
                  <button
                    className="recommend-card"
                    key={item.id}
                    onClick={() => openLesson(item.id)}
                  >
                    <span className={`recommend-symbol color-${i}`}>
                      {i === 0 ? <Lightbulb /> : i === 1 ? <Code2 /> : <Play />}
                    </span>
                    <span className="recommend-label">
                      PRIMEROS PASOS · LECCIÓN {i + 1}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="recommend-footer">
                      <span>
                        <Clock3 size={14} />
                        {item.minutes} min de estudio
                      </span>
                      <ArrowUpRight size={19} />
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {route.view === "ruta" && (
            <CurriculumBrowser
              key={route.id || "all"}
              selected={route.id}
              progress={progress}
              openLesson={openLesson}
            />
          )}
          {route.view === "problemas" && <ProblemsPage progress={progress} />}
          {route.view === "leccion" &&
            (lesson ? (
              <LessonPage
                key={lesson.id}
                lesson={lesson}
                progress={progress}
                onComplete={() => {
                  update(completeLesson(progress, lesson.id));
                  setToast("¡Una idea más en tu camino! Lección completada.");
                }}
                onNote={(note) =>
                  update({
                    ...progress,
                    notes: { ...progress.notes, [lesson.id]: note },
                  })
                }
                openLesson={openLesson}
              />
            ) : (
              <Empty
                title="No encontramos esta lección"
                text="Explora las lecciones de tu ruta de aprendizaje."
                action={() => go("ruta")}
              />
            ))}
          {route.view === "problema" &&
            (problem ? (
              <ProblemPage
                key={problem.id}
                problem={problem}
                solved={progress.solvedProblems.includes(problem.id)}
                onSolve={() => {
                  update(solveProblem(progress, problem.id));
                  setToast("¡Lo lograste! Reto de razonamiento completado.");
                }}
              />
            ) : (
              <Empty
                title="No encontramos este problema"
                text="Elige un reto del banco de problemas."
                action={() => go("problemas")}
              />
            ))}
          {route.view === "apuntes" && (
            <>
              <PageHeading
                eyebrow="TU LIBRETA PERSONAL"
                title="Las ideas que te llevas."
                description="Guarda lo que descubriste y vuelve a ello cuando lo necesites."
              />
              {Object.entries(progress.notes).filter(([, v]) => v.trim())
                .length ? (
                <div className="notes-grid">
                  {Object.entries(progress.notes)
                    .filter(([, v]) => v.trim())
                    .map(([id, note]) => (
                      <article key={id} className="card note-card">
                        <NotebookPen size={21} />
                        <h2>
                          {lessons.find((l) => l.id === id)?.title || "Mi nota"}
                        </h2>
                        <p>{note}</p>
                        <button
                          className="text-link"
                          onClick={() => openLesson(id)}
                        >
                          Volver a la lección <ArrowRight size={15} />
                        </button>
                      </article>
                    ))}
                </div>
              ) : (
                <Empty
                  title="Tu próxima idea merece un lugar"
                  text="En cada lección encontrarás una libreta para escribir con tus propias palabras. Tus apuntes aparecerán aquí."
                  action={() => openLesson(next.id)}
                  label="Ir a una lección"
                />
              )}
            </>
          )}
          {route.view === "compilador" && (
            <>
              <PageHeading
                eyebrow="ESCRIBE. EJECUTA. APRENDE."
                title="Tu laboratorio de C++."
                description="Cambia una idea, prueba con datos y descubre qué hace tu programa."
              />
              <CppPlayground
                storageKey="laboratorio"
                title="Un espacio para experimentar"
              />
              <div className="compiler-learning-tip">
                <Lightbulb size={20} />
                <p>
                  Escribe los datos que leerá <code>cin</code> en Entrada y
                  pulsa <strong>Ejecutar</strong>. Si aparece un error, revisa
                  la línea indicada: corregirlo también es aprender. Tus
                  borradores se guardan en este navegador.
                </p>
              </div>
            </>
          )}
          {route.view === "recursos" && <Resources />}
          {route.view === "acerca" && <About />}
          <footer className="footer">
            <span>
              <span className="footer-mark">&lt;/&gt;</span> Hecho con
              curiosidad, para Morelos.
            </span>
            <span>
              <a href="#/acerca">Proyecto educativo independiente · Sin afiliación con USACO Guide</a>
            </span>
          </footer>
        </main>
      </div>
      {modal === "search" && (
        <Modal title="Encuentra tu siguiente idea" onClose={closeModal} wide>
          <div className="search-field">
            <Search size={20} />
            <input
              aria-label="Buscar lecciones y problemas"
              placeholder="Busca variables, ciclos, algoritmos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="search-results">
            {!query && (
              <p className="search-hint">
                Explora las primeras lecciones o escribe un tema.
              </p>
            )}
            {[
              ...lessons.map((l) => ({
                id: l.id,
                title: l.title,
                description: l.description,
                searchText: `${l.category || ""} ${l.source?.key || ""}`,
                kind: "Lección" as const,
              })),
              ...problems.map((p) => ({
                id: p.id,
                title: p.title,
                description: p.topic,
                searchText: p.topic,
                kind: "Problema" as const,
              })),
            ]
              .filter((x) =>
                `${x.title} ${x.description} ${x.searchText}`
                  .toLocaleLowerCase("es")
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .includes(
                    query
                      .toLocaleLowerCase("es")
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, ""),
                  ),
              )
              .slice(0, 12)
              .map((x) => (
                <button
                  className="search-result"
                  key={`${x.kind}-${x.id}`}
                  onClick={() => {
                    closeModal();
                    if (x.kind === "Lección") openLesson(x.id);
                    else go("problema", x.id);
                  }}
                >
                  <span className="search-result-icon">
                    {x.kind === "Lección" ? (
                      <BookOpen size={19} />
                    ) : (
                      <Code2 size={19} />
                    )}
                  </span>
                  <span>
                    <strong>{x.title}</strong>
                    <small>
                      {x.kind} · {x.description}
                    </small>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
            {query &&
              ![
                ...lessons.map(
                  (l) =>
                    l.title +
                    " " +
                    l.description +
                    " " +
                    (l.category || "") +
                    " " +
                    (l.source?.key || ""),
                ),
                ...problems.map((p) => p.title + " " + p.topic),
              ].some((t) =>
                t
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, "")
                  .toLowerCase()
                  .includes(
                    query
                      .normalize("NFD")
                      .replace(/[\u0300-\u036f]/g, "")
                      .toLowerCase(),
                  ),
              ) && (
                <p className="empty-search">
                  No encontramos resultados. Intenta con “variables” o “primer
                  programa”.
                </p>
              )}
          </div>
          <div className="modal-footer">
            <kbd>esc</kbd> para cerrar{" "}
            <span>Aprender empieza con una pregunta.</span>
          </div>
        </Modal>
      )}
      {modal === "profile" && (
        <Modal title="Tu espacio, a tu manera" onClose={closeModal}>
          <ProfileForm
            progress={progress}
            onSave={(p) => {
              update(p);
              closeModal();
              setToast("Tu perfil y tu meta están guardados.");
            }}
          />
        </Modal>
      )}
      {toast && (
        <div className="toast" role="status">
          <CheckCircle2 size={19} />
          {toast}
        </div>
      )}
    </div>
  );
}
function Stat({
  icon,
  color,
  label,
  value,
  suffix,
  foot,
}: {
  icon: ReactNode;
  color: string;
  label: string;
  value: number;
  suffix: string;
  foot: string;
}) {
  return (
    <section className="stat-card">
      <div className="stat-heading">
        <span>{label}</span>
        <span className={`stat-icon ${color}`}>{icon}</span>
      </div>
      <div className="stat-value">
        {value}
        <span>{suffix}</span>
      </div>
      <p>{foot}</p>
    </section>
  );
}
function PageHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow">{eyebrow}</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </div>
  );
}
function Activity({ progress }: { progress: Progress }) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - 168 - ((end.getDay() + 6) % 7));
  const days = Array.from({ length: 175 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
  const months = Array.from({ length: 25 }, (_, i) => {
    const date = days[i * 7];
    return i === 0 ||
      date.getMonth() !== days[Math.max(0, i * 7 - 7)].getMonth()
      ? date.toLocaleDateString("es-MX", { month: "short" }).replace(".", "")
      : "";
  });
  return (
    <section className="card activity-card">
      <div className="section-heading">
        <div>
          <h2>
            Cada día cuenta{" "}
            <span className="activity-count">
              {Object.values(progress.activity).reduce((a, b) => a + b, 0)}{" "}
              avances
            </span>
          </h2>
          <p>Así va creciendo tu constancia.</p>
        </div>
        <Flame size={19} />
      </div>
      <div className="heatmap-scroll">
        <div className="heatmap-months">
          {months.map((m, i) => (
            <span key={i}>{m}</span>
          ))}
        </div>
        <div className="heatmap-wrap">
          <div className="heatmap-labels">
            <span>Lun</span>
            <span>Mié</span>
            <span>Vie</span>
            <span>Dom</span>
          </div>
          <div className="heatmap">
            {days.map((d) => {
              const key = localDateKey(d);
              const count = progress.activity[key] || 0;
              const future = key > localDateKey(end);
              return (
                <div
                  key={key}
                  className={`heat-cell heat-${Math.min(count, 4)} ${future ? "future" : ""}`}
                  title={`${d.toLocaleDateString("es-MX")}: ${count} avances`}
                  aria-label={`${d.toLocaleDateString("es-MX")}: ${count} avances`}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div className="heatmap-footer">
        <span>Un pequeño esfuerzo hoy. Una habilidad para siempre.</span>
        <span>
          Menos <i className="heat-0" />
          <i className="heat-1" />
          <i className="heat-2" />
          <i className="heat-3" />
          <i className="heat-4" /> Más
        </span>
      </div>
    </section>
  );
}
function LessonPage({
  lesson,
  progress,
  onComplete,
  onNote,
  openLesson,
}: {
  lesson: Lesson;
  progress: Progress;
  onComplete: () => void;
  onNote: (n: string) => void;
  openLesson: (id: string) => void;
}) {
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [note, setNote] = useState(progress.notes[lesson.id] || "");
  const [saved, setSaved] = useState(false);
  const done = progress.completedLessons.includes(lesson.id);
  const index = lessons.findIndex((l) => l.id === lesson.id);
  const next = lessons
    .slice(index + 1)
    .find((l) => lesson.optional || !l.optional);

  return (
    <>
      <button className="back-link" onClick={() => go("ruta", lesson.level)}>
        <ArrowLeft size={16} />
        Volver a mi ruta
      </button>
      <div className="lesson-layout">
        <article className="lesson-article">
          <div className="eyebrow">
            {levels.find((l) => l.id === lesson.level)?.title} · LECCIÓN{" "}
            {index + 1}
          </div>
          <h1>{lesson.title}</h1>
          <p className="lesson-description">{lesson.description}</p>
          <div className="lesson-badges">
            <span>
              <Clock3 size={15} />
              {lesson.minutes} min de estudio
            </span>
            {done ? (
              <Pill>
                <Check size={13} />
                Completada
              </Pill>
            ) : (
              <Pill>A tu ritmo</Pill>
            )}
          </div>
          {lesson.optional && (
            <div className="optional-notice">
              <Compass size={17} />
              <p>
                Exploración opcional. Este tema amplía tu preparación; puedes
                retomarlo cuando domines sus prerrequisitos.
              </p>
            </div>
          )}
          {!!lesson.objectives?.length && (
            <section className="lesson-objectives">
              <h2>Al terminar podrás…</h2>
              <ul>
                {lesson.objectives.map((objective) => (
                  <li key={objective}>
                    <CheckCircle2 size={16} />
                    {objective}
                  </li>
                ))}
              </ul>
            </section>
          )}
          {lesson.sections.map((s, i) => (
            <section className="lesson-section" key={i}>
              <h2>{s.title}</h2>
              {s.body.split("\n\n").map((p, j) => (
                <p key={j}>{p}</p>
              ))}
              {s.code && <CodeBlock code={s.code} />}
            </section>
          ))}
          {lesson.source && (
            <section className="lesson-source">
              <BookOpen size={20} />
              <div>
                <h3>Para seguir profundizando</h3>
                <p>
                  Esta lección desarrolla el tema en español. En el módulo
                  original encontrarás más explicaciones y recursos
                  complementarios en inglés.
                </p>
                <a
                  href={lesson.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Consultar el módulo de USACO Guide <ArrowUpRight size={15} />
                </a>
              </div>
            </section>
          )}
          <section className="quiz-card">
            <div className="eyebrow">
              <Lightbulb size={15} /> UNA PAUSA PARA PENSAR
            </div>
            <h2>{lesson.quiz.question}</h2>
            <div className="quiz-options">
              {lesson.quiz.options.map((o, i) => (
                <button
                  key={i}
                  aria-pressed={answer === i}
                  className={`${answer === i ? "chosen" : ""} ${checked && i === lesson.quiz.answer ? "correct" : ""} ${checked && answer === i && i !== lesson.quiz.answer ? "incorrect" : ""}`}
                  onClick={() => {
                    setAnswer(i);
                    setChecked(false);
                  }}
                >
                  <span>{String.fromCharCode(65 + i)}</span>
                  {o}
                </button>
              ))}
            </div>
            <button
              className="button primary"
              disabled={answer === null}
              onClick={() => setChecked(true)}
            >
              Comprobar respuesta <Check size={16} />
            </button>
            {checked && (
              <div
                className={`answer-feedback ${answer === lesson.quiz.answer ? "success" : "try-again"}`}
                role="status"
              >
                <strong>
                  {answer === lesson.quiz.answer
                    ? "¡Exacto!"
                    : "Probemos una vez más."}
                </strong>{" "}
                {lesson.quiz.explanation}
              </div>
            )}
          </section>
          <div className="lesson-finish">
            <button
              className={`button ${done ? "subtle" : "primary"}`}
              disabled={done || !(checked && answer === lesson.quiz.answer)}
              onClick={onComplete}
            >
              {done ? (
                <>
                  <CheckCircle2 size={17} />
                  Lección completada
                </>
              ) : (
                <>
                  Completar lección <Check size={17} />
                </>
              )}
            </button>
            {next && (
              <button className="text-link" onClick={() => openLesson(next.id)}>
                Siguiente lección <ArrowRight size={16} />
              </button>
            )}
          </div>
          {!done && (
            <p className="small-muted">
              Responde la pregunta correctamente para registrar esta lección.
            </p>
          )}
        </article>
        <aside className="lesson-aside">
          {!!lesson.prerequisites?.length && (
            <section className="card prerequisites-card">
              <div className="eyebrow">
                <Layers3 size={15} /> ANTES DE EMPEZAR
              </div>
              <h3>Conecta con lo que ya sabes</h3>
              <p>
                Repasa estas ideas si las necesitas. Puedes explorar cualquier
                lección.
              </p>
              {lesson.prerequisites.map((id) => {
                const required = lessons.find((l) => l.id === id);
                return required ? (
                  <button key={id} onClick={() => openLesson(id)}>
                    {progress.completedLessons.includes(id) ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <BookOpen size={15} />
                    )}
                    <span>{required.title}</span>
                    <ChevronRight size={13} />
                  </button>
                ) : null;
              })}
            </section>
          )}

          <div className="card takeaway">
            <span className="level-icon color-0">
              <NotebookPen size={22} />
            </span>
            <h3>Tu idea, en tus palabras</h3>
            <p>¿Qué aprendiste? Escribirlo te ayuda a recordarlo.</p>
            <textarea
              aria-label="Mis apuntes de la lección"
              placeholder="Hoy descubrí que..."
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSaved(false);
              }}
              rows={7}
            />
            <button
              className="button subtle"
              onClick={() => {
                onNote(note);
                setSaved(true);
              }}
            >
              {saved ? <Check size={15} /> : <Bookmark size={15} />}{" "}
              {saved ? "Apunte guardado" : "Guardar apunte"}
            </button>
          </div>
          {lesson.problemId && (
            <div className="lesson-practice">
              <Code2 size={25} />
              <h3>Ahora es tu turno</h3>
              <p>Lleva esta idea a un problema de práctica.</p>
              <button
                className="text-link"
                onClick={() => go("problema", lesson.problemId)}
              >
                Practicar <ArrowRight size={15} />
              </button>
            </div>
          )}
          {!!lesson.practice?.length && (
            <section className="card practice-links">
              <div className="eyebrow">
                <Code2 size={15} /> SIGUE PRACTICANDO
              </div>
              <h3>
                {lesson.level === "general"
                  ? "Explora los recursos del tema"
                  : "Lleva la idea a un problema"}
              </h3>
              <p>
                Recursos externos; tu avance allí no modifica el de esta guía.
              </p>
              {lesson.practice.map((item) => (
                <a
                  key={item.url}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{item.title}</span>
                  <ArrowUpRight size={16} />
                </a>
              ))}
            </section>
          )}
          <div className="learning-tip">
            <Sprout size={18} />
            <p>
              Si algo no sale a la primera, vas por buen camino. Equivocarse
              también es aprender.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}
function ProblemsPage({ progress }: { progress: Progress }) {
  const [mode, setMode] = useState<"local" | "temas">("local");
  const [filter, setFilter] = useState("todos");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const filtered = problems.filter(
    (p) =>
      (filter === "todos" || p.level === filter) &&
      `${p.title} ${p.topic}`.toLowerCase().includes(query.toLowerCase()) &&
      (status === "todos" ||
        (status === "resueltos"
          ? progress.solvedProblems.includes(p.id)
          : !progress.solvedProblems.includes(p.id))),
  );
  return (
    <>
      <PageHeading
        eyebrow="IDEAS QUE SE CONVIERTEN EN SOLUCIONES"
        title="Tu próxima conquista."
        description="Lee con calma, prueba con ejemplos y descubre que puedes resolverlo."
      />
      <div className="practice-mode">
        <button
          className={mode === "local" ? "selected" : ""}
          onClick={() => setMode("local")}
        >
          <Code2 size={16} />
          Retos locales <span>{problems.length}</span>
        </button>
        <button
          className={mode === "temas" ? "selected" : ""}
          onClick={() => setMode("temas")}
        >
          <Layers3 size={16} />
          Práctica por tema{" "}
          <span>
            {lessons.filter((l) => l.source && l.level !== "general").length}
          </span>
        </button>
      </div>
      {mode === "temas" ? (
        <PracticeCatalog />
      ) : (
        <>
          <div className="problem-banner">
            <Code2 size={28} />
            <div>
              <h3>Primero entiende. Después programa.</h3>
              <p>
                Estos retos comprueban tu razonamiento con casos de entrada y
                salida. Incluyen pistas y soluciones en C++.
              </p>
            </div>
          </div>
          <div className="filter-tabs">
            <button
              className={filter === "todos" ? "selected" : ""}
              onClick={() => setFilter("todos")}
            >
              Todos los niveles
            </button>
            {levels
              .filter((l) => problems.some((p) => p.level === l.id))
              .map((l) => (
                <button
                  className={filter === l.id ? "selected" : ""}
                  onClick={() => setFilter(l.id)}
                  key={l.id}
                >
                  {l.title}
                </button>
              ))}
          </div>
          <div className="problem-toolbar">
            <div className="search-field">
              <Search size={17} />
              <input
                aria-label="Buscar problemas"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar un problema o tema..."
              />
            </div>
            <select
              aria-label="Estado de los problemas"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="pendientes">Por resolver</option>
              <option value="resueltos">Resueltos</option>
            </select>
            <span>
              {filtered.length}{" "}
              {filtered.length === 1 ? "problema" : "problemas"}
            </span>
          </div>
          <div className="card problem-table">
            <div className="problem-table-head">
              <span>ESTADO</span>
              <span>PROBLEMA</span>
              <span>DIFICULTAD</span>
              <span>TEMA</span>
              <span />
            </div>
            {filtered.map((p) => (
              <a
                className="problem-table-row"
                href={`#/problema/${p.id}`}
                key={p.id}
              >
                <span>
                  {progress.solvedProblems.includes(p.id) ? (
                    <CheckCircle2 className="completed-icon" size={21} />
                  ) : (
                    <Circle size={19} />
                  )}
                </span>
                <strong>
                  {p.title}
                  <small>{levels.find((l) => l.id === p.level)?.title}</small>
                </strong>
                <span>
                  <Pill
                    tone={
                      p.difficulty === "Inicial" || p.difficulty === "Fácil"
                        ? "green"
                        : p.difficulty === "Intermedio"
                          ? "orange"
                          : "purple"
                    }
                  >
                    {p.difficulty}
                  </Pill>
                </span>
                <span className="topic">{p.topic}</span>
                <ChevronRight size={17} />
              </a>
            ))}
            {!filtered.length && (
              <p className="empty-search">
                No hay problemas con esos filtros. Prueba con otro nivel o
                estado.
              </p>
            )}
          </div>
        </>
      )}
    </>
  );
}
function ProblemPage({
  problem,
  solved,
  onSolve,
}: {
  problem: Problem;
  solved: boolean;
  onSolve: () => void;
}) {
  const [hint, setHint] = useState(false);
  const [solution, setSolution] = useState(false);
  const [answers, setAnswers] = useState<string[]>(problem.tests.map(() => ""));
  const [checked, setChecked] = useState(false);
  const normalize = (s: string) => s.replace(/\r\n/g, "\n").trim();
  const results = problem.tests.map(
    (t, i) => normalize(answers[i] || "") === normalize(t.output),
  );
  const allCorrect = results.every(Boolean);
  return (
    <>
      <button className="back-link" onClick={() => go("problemas")}>
        <ArrowLeft size={16} />
        Volver a los problemas
      </button>
      <div className="problem-detail-heading">
        <div>
          <div className="eyebrow">RETO DE RAZONAMIENTO</div>
          <h1>{problem.title}</h1>
          <div className="lesson-badges">
            <Pill>{problem.difficulty}</Pill>
            <span>{problem.topic}</span>
            {solved && (
              <Pill>
                <Check size={14} />
                Resuelto
              </Pill>
            )}
          </div>
        </div>
      </div>
      <div className="problem-layout">
        <article className="card problem-statement">
          <h2>El reto</h2>
          {problem.statement.split("\n\n").map((s, i) => (
            <p key={i}>{s}</p>
          ))}
          <h3>Entrada</h3>
          <p>{problem.input}</p>
          <h3>Salida</h3>
          <p>{problem.output}</p>
          <div className="sample-grid">
            <div>
              <strong>Ejemplo de entrada</strong>
              <pre>{problem.sampleInput || "(sin entrada)"}</pre>
            </div>
            <div>
              <strong>Ejemplo de salida</strong>
              <pre>{problem.sampleOutput}</pre>
            </div>
          </div>
          <h3>¿Por qué?</h3>
          <p>{problem.explanation}</p>
          <button className="button subtle" onClick={() => setHint(!hint)}>
            <Lightbulb size={16} />
            {hint ? "Ocultar pista" : "Necesito una pista"}
            <ChevronDown size={14} />
          </button>
          {hint && <div className="hint-box">{problem.hint}</div>}
        </article>
        <section className="card practice-panel">
          <span className="eyebrow">
            <Play size={14} /> PIENSA COMO UNA COMPUTADORA
          </span>
          <h2>¿Qué debería imprimir?</h2>
          <p>
            Resuelve cada caso y escribe la salida esperada. Aquí comprobamos
            tus respuestas. Más abajo puedes escribir y ejecutar tu programa en
            C++.
          </p>
          <div className="test-cases">
            {problem.tests.map((test, i) => (
              <div className="test-case" key={i}>
                <div>
                  <strong>Caso {i + 1}</strong>
                  {checked && (
                    <span className={results[i] ? "test-pass" : "test-fail"}>
                      {results[i] ? "✓ Correcto" : "Revisa tu respuesta"}
                    </span>
                  )}
                </div>
                <label>
                  Entrada<pre>{test.input || "(sin entrada)"}</pre>
                </label>
                <label htmlFor={`case-${i}`}>Tu salida</label>
                <textarea
                  id={`case-${i}`}
                  rows={2}
                  value={answers[i]}
                  placeholder="Escribe tu respuesta..."
                  onChange={(e) => {
                    setAnswers(
                      answers.map((a, j) => (i === j ? e.target.value : a)),
                    );
                    setChecked(false);
                  }}
                />
              </div>
            ))}
          </div>
          <button
            className="button primary full-width"
            disabled={answers.some((a) => !a.trim())}
            onClick={() => {
              setChecked(true);
              if (allCorrect && !solved) onSolve();
            }}
          >
            <Play size={15} />
            Comprobar mis respuestas
          </button>
          {checked && (
            <div
              role="status"
              className={`answer-feedback ${allCorrect ? "success" : "try-again"}`}
            >
              {allCorrect
                ? "¡Muy bien! Todos los casos son correctos. Ahora intenta programar tu solución."
                : "Todavía hay casos por resolver. Revisa la pista y vuelve a intentarlo."}
            </div>
          )}
        </section>
      </div>
      <section className="card code-practice">
        <div className="section-heading">
          <div>
            <h2>Llévalo a C++</h2>
            <p>
              Edita la plantilla y prueba tu solución con los datos del ejemplo.
            </p>
          </div>
        </div>
        <CppPlayground
          key={problem.id}
          initialCode={problem.starter}
          initialInput={problem.sampleInput}
          storageKey={`problem-${problem.id}`}
          title="Programa tu solución"
        />
        <p className="compiler-problem-note">
          Compara la salida de tu programa con la del ejemplo y prueba otros
          casos. La ejecución libre no registra por sí sola el reto como
          resuelto.
        </p>
        <button className="text-link" onClick={() => setSolution(!solution)}>
          <BookOpen size={16} />
          {solution ? "Ocultar solución explicada" : "Ver una posible solución"}
          <ChevronDown size={15} />
        </button>
        {solution && (
          <>
            <div className="hint-box">
              {problem.explanation} Compara la solución con tu idea: ¿qué hace
              cada línea?
            </div>
            <CodeBlock code={problem.solution} />
          </>
        )}
      </section>
    </>
  );
}
function Empty({
  title,
  text,
  action,
  label = "Explorar la ruta",
}: {
  title: string;
  text: string;
  action: () => void;
  label?: string;
}) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <NotebookPen size={32} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="button primary" onClick={action}>
        {label}
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
function ProfileForm({
  progress,
  onSave,
}: {
  progress: Progress;
  onSave: (p: Progress) => void;
}) {
  const [name, setName] = useState(progress.name);
  const [school, setSchool] = useState(progress.school);
  const [goal, setGoal] = useState(progress.goal);
  const [reset, setReset] = useState(false);
  const exportProgress = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "mi-progreso-omi.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <form
      className="profile-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ ...progress, name: name.trim().slice(0, 35), school, goal });
      }}
    >
      <p>Haz tuyo este espacio. Tu progreso se guarda en este navegador.</p>
      <label htmlFor="profile-name">¿Cómo te gustaría que te llamemos?</label>
      <input
        id="profile-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre o apodo"
        maxLength={35}
      />
      <label htmlFor="school">Estoy estudiando</label>
      <select
        id="school"
        value={school}
        onChange={(e) => setSchool(e.target.value)}
      >
        <option>Secundaria</option>
        <option>Preparatoria</option>
        <option>Aprendo por mi cuenta</option>
        <option>Soy docente</option>
      </select>
      <label htmlFor="goal">Mi meta semanal</label>
      <select
        id="goal"
        value={goal}
        onChange={(e) => setGoal(Number(e.target.value))}
      >
        <option value={3}>A mi ritmo · 3 avances por semana</option>
        <option value={5}>Paso constante · 5 avances por semana</option>
        <option value={7}>Con todo · 7 avances por semana</option>
        <option value={10}>Modo reto · 10 avances por semana</option>
      </select>
      <div className="privacy-note">
        <Bookmark size={16} />
        <span>
          Sin cuenta ni correo. Tus lecciones, retos y apuntes se guardan en
          este dispositivo y navegador.
        </span>
      </div>
      <button className="button primary full-width" type="submit">
        Guardar mi perfil <Check size={16} />
      </button>
      <div className="profile-data">
        <button type="button" className="text-link" onClick={exportProgress}>
          <Download size={14} />
          Descargar mi progreso
        </button>
        <button
          type="button"
          className="reset-link"
          onClick={() => setReset(!reset)}
        >
          Empezar de nuevo
        </button>
      </div>
      {reset && (
        <div className="reset-confirm">
          <p>
            Se borrarán las lecciones completadas, los retos, la actividad y los
            apuntes de este navegador. Puedes descargar tu progreso antes de
            continuar.
          </p>
          <div>
            <button
              type="button"
              className="button subtle"
              onClick={() => setReset(false)}
            >
              Conservar mi progreso
            </button>
            <button
              type="button"
              className="button reset-button"
              onClick={() =>
                onSave({
                  ...initialProgress,
                  name,
                  school,
                  goal,
                  completedLessons: [],
                  solvedProblems: [],
                  activity: {},
                  notes: {},
                })
              }
            >
              Reiniciar progreso
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
function Resources() {
  const items = [
    {
      icon: Play,
      title: "Laboratorio C++",
      tag: "TU PRIMER PROGRAMA",
      text: "Escribe C++17, agrega datos de entrada y ejecuta tu programa dentro de esta guía. Guarda tus borradores y aprende de los resultados.",
      url: "#/compilador",
    },
    {
      icon: Code2,
      title: "omegaUp",
      tag: "PRACTICA",
      text: "Una plataforma en español para enviar tus programas a un juez y resolver problemas de programación.",
      url: "https://omegaup.com/",
    },
    {
      icon: BookOpen,
      title: "USACO Guide",
      tag: "EXPLORA",
      text: "La inspiración de esta guía. Amplía tus conocimientos con módulos y problemas de programación competitiva en inglés.",
      url: "https://usaco.guide/",
    },
    {
      icon: Trophy,
      title: "Olimpiada Mexicana de Informática",
      tag: "CONOCE",
      text: "Consulta información y anuncios oficiales sobre la olimpiada nacional.",
      url: "https://www.olimpiadadeinformatica.org.mx/",
    },
    {
      icon: Code2,
      title: "LearnCpp",
      tag: "CONSULTA",
      text: "Tutoriales de C++ para profundizar en el lenguaje, con explicaciones y ejemplos en inglés.",
      url: "https://www.learncpp.com/",
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="HERRAMIENTAS PARA TU CAMINO"
        title="La curiosidad no tiene límites."
        description="Una selección de recursos para practicar y seguir aprendiendo."
      />
      <div className="resources-grid">
        {items.map((item) => (
          <a
            className="card resource-card"
            key={item.title}
            href={item.url}
            target={item.url.startsWith("#") ? undefined : "_blank"}
            rel={item.url.startsWith("#") ? undefined : "noopener noreferrer"}
          >
            <span className="level-icon color-0">
              <item.icon size={24} />
            </span>
            <span className="eyebrow">{item.tag}</span>
            <h2>
              {item.title}
              <ArrowUpRight size={20} />
            </h2>
            <p>{item.text}</p>
            <span className="text-link">
              Visitar recurso <ExternalLink size={14} />
            </span>
          </a>
        ))}
      </div>
      <section className="card resource-advice">
        <Lightbulb size={24} />
        <div>
          <h2>Tu kit para empezar</h2>
          <p>
            Necesitas curiosidad, papel para probar ideas y una computadora
            cuando pases al código. Las primeras lecciones te explican cómo
            funciona un programa y cómo preparar tu editor. Empieza con la ruta
            y usa estos recursos cuando los necesites.
          </p>
          <a className="text-link" href="#/ruta/inicio">
            Ir a primeros pasos <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </>
  );
}
function About() {
  return (
    <>
      <PageHeading
        eyebrow="TALENTO QUE CRECE EN MORELOS"
        title="Tu siguiente reto comienza aquí."
        description="Un espacio para quienes tienen ganas de descubrir qué pueden crear con la informática."
      />
      <section className="about-hero">
        <Mountain size={54} />
        <h2>
          Aprender a resolver problemas
          <br />
          te lleva a lugares increíbles.
        </h2>
        <p>
          La Olimpiada Morelense de Informática inspira esta guía de preparación
          para estudiantes de secundaria y preparatoria. Aquí desarrollas las
          herramientas para convertir una idea en un algoritmo, explicarlo y
          llevarlo al código.
        </p>
        <a className="button primary" href="#/ruta">
          Empezar mi preparación <ArrowRight size={17} />
        </a>
      </section>
      <div className="about-grid">
        {[
          {
            icon: Sprout,
            title: "Comienza desde cero",
            text: "No necesitas experiencia. Empezamos con instrucciones, ejemplos cotidianos y tus primeros programas.",
          },
          {
            icon: Lightbulb,
            title: "Aprende a pensar",
            text: "Entiende el problema antes de escribir código. Prueba casos pequeños, equivócate y encuentra patrones.",
          },
          {
            icon: GraduationCap,
            title: "Avanza a tu ritmo",
            text: "Construye bases sólidas con lecciones, preguntas y retos que van aumentando de dificultad.",
          },
        ].map((x) => (
          <article className="card" key={x.title}>
            <x.icon size={28} />
            <h3>{x.title}</h3>
            <p>{x.text}</p>
          </article>
        ))}
      </div>
      <section className="card about-note">
        <h3>Sobre esta guía</h3>
        <p>
          El temario ampliado recorre {lessons.length} lecciones en{" "}
          {levels.length} etapas y cubre los {guideIndex.length} módulos del
          índice de{" "}
          <a
            className="inline-link"
            href="https://usaco.guide/"
            target="_blank"
            rel="noopener noreferrer"
          >
            USACO Guide
          </a>
          . Los nombres Bronce, Plata, Oro y Platino organizan el aprendizaje y
          no representan categorías oficiales de la OMI Morelos.
        </p>
        <p>
          Referencia y organización temática: Competitive Programming Initiative
          y colaboradores de USACO Guide. Adaptación educativa en español bajo{" "}
          <a
            className="inline-link"
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
          >
            CC BY-NC-SA 4.0
          </a>
          . Los enlaces de cada lección permiten consultar el módulo original y
          sus problemas.
        </p>
        <p>
          Proyecto educativo independiente inspirado en la estructura de USACO Guide,
          con contenido original en español y ejemplos contextualizados en
          Morelos. Esta plataforma no sustituye las convocatorias, requisitos ni
          fechas oficiales de la olimpiada.
        </p>
        <p>
          El avance y los borradores se guardan en tu navegador. Puedes ejecutar
          C++17 directamente en el navegador, sin instalar nada. Para enviar soluciones a un juez de
          concursos, usa omegaUp desde la sección de recursos.
        </p>
      </section>
    </>
  );
}
