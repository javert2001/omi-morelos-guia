"use client";
import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { flushSync } from "react-dom";
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
  NotebookPen,
  Play,
  Search,
  Settings2,
  Sprout,
  Trophy,
  X,
  Copy,
  Circle,
  Layers3,
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
  type Progress,
} from "@/lib/progress";

import CurriculumBrowser from "./curriculum-browser";
import StudioDashboard from "./studio-dashboard";
import PracticeCatalog from "./practice-catalog";
import CppPlayground from "./cpp-playground";
import LessonExercises from "./lesson-exercises";
import LessonAnimation, { LessonDrawing } from "./lesson-visual";
import SegmentTreeDiagram from "./segment-tree-diagram";
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
const viewNames: Record<View, string> = {
  dashboard: "Mi panel",
  ruta: "Temario",
  problemas: "Problemas",
  apuntes: "Mis apuntes",
  recursos: "Recursos",
  acerca: "Acerca de la OMRI",
  leccion: "Lección",
  problema: "Problema",
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
function CodeBlock({ code, fragment = false, input = "" }: { code: string; fragment?: boolean; input?: string }) {
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
          <span>{fragment ? "C++17 · Fragmento" : "C++17"}</span>
          <div className="code-actions">
            {!fragment && <button
              aria-expanded={editing}
              onClick={() => setEditing(!editing)}
            >
              <Play size={13} />
              {editing ? "Cerrar editor" : "Probar código"}
            </button>}
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
          initialInput={input}
          storageKey={draftId}
          title="Ejecutar ejemplo"
          compact
        />
      )}
    </>
  );
}

function LessonParagraphs({ text, formatted = false }: { text: string; formatted?: boolean }) {
  return <>{text.split("\n\n").map((paragraph, i) => <p key={i}>{formatted
    ? paragraph.split(/(`[^`]+`|\*\*[^*]+\*\*)/g).map((part, j) => part.startsWith("`")
      ? <code key={j}>{part.slice(1, -1)}</code>
      : part.startsWith("**") ? <strong key={j}>{part.slice(2, -2)}</strong> : part)
    : paragraph}</p>)}</>;
}

export default function LearningApp() {
  const [route, setRoute] = useState<Route>({ view: "dashboard" });
  const [progress, setProgress] = useState<Progress>(initialProgress);
  const [ready, setReady] = useState(false);
  const [menu, setMenu] = useState(false);
  const [modal, setModal] = useState<"search" | "profile" | null>(null);
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const navigationRef = useRef<HTMLElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);
  const openModal = useCallback((kind: "search" | "profile") => {
    // Finish the drawer's focus restoration before mounting another focus trap.
    flushSync(() => setMenu(false));
    setModal(kind);
  }, []);
  useEffect(() => {
    if (!menu) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const links = () => Array.from(navigationRef.current?.querySelectorAll<HTMLElement>("a[href],button:not(:disabled)") || []);
    links()[0]?.focus();
    const keepFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = links(), first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    const desktop = window.matchMedia("(min-width: 741px)");
    const onDesktop = () => { if (desktop.matches) setMenu(false); };
    document.addEventListener("keydown", keepFocus);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", keepFocus);
      desktop.removeEventListener("change", onDesktop);
      previousFocus?.focus();
    };
  }, [menu]);
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
    };
    onRoute();
    window.addEventListener("hashchange", onRoute);
    const keys = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openModal("search");
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", keys);
    return () => {
      window.removeEventListener("hashchange", onRoute);
      window.removeEventListener("keydown", keys);
    };
  }, [openModal]);
  useEffect(() => {
    // Long chapters must start at the top after React renders the new route.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [route.view, route.id]);
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
    setMenu(false);
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
    { view: "ruta", label: "Temario", icon: Compass },
    { view: "problemas", label: "Problemas", icon: Code2 },
    { view: "compilador", label: "Laboratorio C++", icon: Terminal },
    { view: "apuntes", label: "Mis apuntes", icon: NotebookPen },
  ] as const;
  return (
    <div className="app-shell studio-shell" data-view={route.view}>
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
        ref={navigationRef}
        id="workspace-navigation"
        className={`sidebar ${menu ? "open" : ""}`}
        aria-label="Navegación principal"
        onClick={(event) => {
          if ((event.target as HTMLElement).closest("a[href]")) setMenu(false);
        }}
      >
        <button className="sidebar-close icon-button" onClick={() => setMenu(false)} aria-label="Cerrar navegación"><X size={18} /></button>
        <a className="brand" href="#/dashboard" aria-label="OMRI · Guía de programación · Ir al panel">
          <img className="brand-logo" src={publicAsset("brand/omri-logo.png")}
            alt="OMRI · Olimpiada Morelense de Informática" width={1080} height={270} />
          <small>GUÍA DE PROGRAMACIÓN</small>
        </a>
        <div className="workspace-label">
          <span className="tiny-dot" /> Curso de programación{" "}
          <ChevronDown size={14} />
        </div>
        <div className="nav-label">CURSO</div>
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
            Acerca de la OMRI
          </a>
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-journey">
            <div className="sidebar-journey-label"><span>Avance del curso</span><strong>{completed} / {lessons.length}</strong></div>
            <ProgressBar value={completed / lessons.length * 100} />
            <button onClick={() => openLesson(next.id)}><Play size={13} />{completed ? "Continuar lección" : "Abrir lección"}<ArrowUpRight size={14} /></button>
          </div>
          <button
            className="profile-button"
            onClick={() => openModal("profile")}
          >
            <span className="avatar">
              {progress.name ? progress.name.charAt(0).toUpperCase() : "Tú"}
            </span>
            <span>
              <strong>{progress.name || "Tu perfil"}</strong>
              <small>{progress.school}</small>
            </span>
            <Settings2 size={17} />
          </button>
        </div>
      </aside>
      <div className="main-shell" inert={menu}>
        <header className="topbar">
          <div className="breadcrumb">
            <button
              className="icon-button mobile-menu"
              aria-label={menu ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menu}
              aria-controls="workspace-navigation"
              onClick={() => setMenu(!menu)}
            >
              <Menu size={21} />
            </button>
            <img className="mobile-brand" src={publicAsset("brand/omri-logo.png")}
              alt="OMRI" width={1080} height={270} />
            <span>Guía OMRI</span>
            <ChevronRight size={14} />
            <strong>{viewNames[route.view]}</strong>
          </div>
          <div className="top-actions">
            <button
              className="search-button"
              aria-label="Buscar en la guía"
              onClick={() => openModal("search")}
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
              onClick={() => openModal("profile")}
            >
              {progress.name ? progress.name.charAt(0).toUpperCase() : "Tú"}
            </button>
          </div>
        </header>
        <main id="main-content" tabIndex={-1} className="main-content">
          {route.view === "dashboard" && (
            <StudioDashboard progress={progress} next={next} completed={completed} solved={solved} onOpenLesson={openLesson} onProfile={() => openModal("profile")} />
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
                  setToast("Lección completada.");
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
                text="Puedes guardar apuntes desde cualquier lección."
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
                  setToast("Ejercicio de razonamiento completado.");
                }}
              />
            ) : (
              <Empty
                title="No encontramos este problema"
                text="Elige un problema del catálogo."
                action={() => go("problemas")}
              />
            ))}
          {route.view === "apuntes" && (
            <>
              <PageHeading
                eyebrow="APUNTES"
                title="Mis apuntes"
                description="Aquí puedes consultar las notas que guardaste en cada lección."
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
                  title="Todavía no tienes apuntes"
                  text="Puedes escribir y guardar notas en el panel de cada lección."
                  action={() => openLesson(next.id)}
                  label="Ir a una lección"
                />
              )}
            </>
          )}
          {route.view === "compilador" && (
            <>
              <PageHeading
                eyebrow="HERRAMIENTAS"
                title="Laboratorio C++"
                description="Escribe un programa, agrega la entrada y consulta el resultado de su ejecución."
              />
              <CppPlayground
                storageKey="laboratorio"
                title="Editor de C++17"
              />
              <div className="compiler-learning-tip">
                <img src={publicAsset("brand/entrenator.png")} alt="" width={512} height={512} />
                <p>
                  <strong className="mascot-tip-title">Cómo ejecutar tu programa</strong>
                  Escribe los datos que leerá <code>cin</code> en Entrada y
                  pulsa <strong>Ejecutar</strong>. Si aparece un error, revisa
                  la línea indicada y la anterior. Tus
                  borradores se guardan en este navegador.
                </p>
              </div>
            </>
          )}
          {route.view === "recursos" && <Resources />}
          {route.view === "acerca" && <About />}
          <footer className="footer">
            <span>
              <span className="footer-mark">&lt;/&gt;</span> Guía de programación · OMRI
            </span>
            <span>
              <a href="#/acerca">Proyecto educativo independiente · Sin afiliación con USACO Guide</a>
            </span>
          </footer>
        </main>
      </div>
      {modal === "search" && (
        <Modal title="Buscar en la guía" onClose={closeModal} wide>
          <div className="search-field">
            <Search size={20} />
            <input
              ref={searchInputRef}
              aria-label="Buscar lecciones y problemas"
              aria-controls="command-results"
              aria-describedby="command-help"
              placeholder="Busca variables, ciclos, algoritmos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(event) => {
                const first = searchResultsRef.current?.querySelector<HTMLButtonElement>("button");
                if (first && (event.key === "ArrowDown" || event.key === "Enter")) {
                  event.preventDefault();
                  if (event.key === "Enter") first.click(); else first.focus();
                }
              }}
            />
          </div>
          <div className="search-results" id="command-results" ref={searchResultsRef} onKeyDown={(event) => {
            if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
            const buttons = Array.from(searchResultsRef.current?.querySelectorAll<HTMLButtonElement>("button") || []);
            const at = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (at < 0) return;
            event.preventDefault();
            if (event.key === "ArrowUp" && at === 0) searchInputRef.current?.focus();
            else buttons[Math.min(buttons.length - 1, at + (event.key === "ArrowDown" ? 1 : -1))]?.focus();
          }}>
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
          <div className="modal-footer" id="command-help">
            <kbd>↑ ↓</kbd> explorar <kbd>↵</kbd> abrir
            <span><kbd>esc</kbd> cerrar</span>
          </div>
        </Modal>
      )}
      {modal === "profile" && (
        <Modal title="Perfil y progreso" onClose={closeModal}>
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
        Volver al temario
      </button>
      <div className="lesson-layout">
        <article className={`lesson-article ${lesson.takeaway ? "guided-lesson" : ""} ${lesson.presentation === "walkthrough" ? "lesson-walkthrough" : ""}`}>
          <div className="eyebrow">
            {levels.find((l) => l.id === lesson.level)?.title} · LECCIÓN{" "}
            {index + 1}
          </div>
          <h1>{lesson.title}</h1>
          {!lesson.takeaway&&<p className="lesson-description">{lesson.description}</p>}
          <div className="lesson-badges">
            <span>
              <Clock3 size={15} />
              {lesson.takeaway && lesson.presentation !== "walkthrough" ? `${Math.max(2, Math.ceil(lesson.sections.reduce((n,s)=>n+s.body.split(/\s+/).length,0)/130))} min de lectura` : `${lesson.minutes} min de estudio`}
            </span>
            {done ? (
              <Pill>
                <Check size={13} />
                Completada
              </Pill>
            ) : (
              <Pill>Por completar</Pill>
            )}
          </div>
          {lesson.takeaway && <>
            <p className="lesson-overview">{lesson.takeaway}</p>
            {!!lesson.prerequisites?.length && <div className="lesson-prerequisite-links"><span>Antes de esta lección:</span>{lesson.prerequisites.map(id => {
              const previous=lessons.find(item=>item.id===id);
              return previous?<button key={id} onClick={()=>openLesson(id)}>{previous.title}<ArrowUpRight size={12}/></button>:null;
            })}</div>}
          </>}
          <details className="mobile-lesson-contents">
            <summary>Contenido y ejercicios de esta lección</summary>
            {lesson.sections.map((section, i) => <button key={i} onClick={() => document.getElementById(`lesson-part-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{section.title}</button>)}
            {!!lesson.exercises?.length && <button onClick={() => document.getElementById("practica-local")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Practicar: {lesson.exercises.length} ejercicios</button>}
          </details>
          {lesson.optional && (
            <div className="optional-notice">
              <Compass size={17} />
              <p>
                Tema opcional. Revisa los conocimientos previos antes de estudiarlo.
              </p>
            </div>
          )}
          {!lesson.takeaway && !!lesson.objectives?.length && (
            <section className="lesson-objectives">
              <h2>Objetivos</h2>
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
            <section className="lesson-section" id={`lesson-part-${i}`} key={i}>
              <h2>{s.title}</h2>
              <LessonParagraphs text={s.body} formatted={lesson.presentation === "walkthrough"} />
              {s.picture&&<LessonDrawing picture={s.picture}/>}
              {s.diagram === "segment-max" && <SegmentTreeDiagram />}
              {s.visual&&<LessonAnimation key={`${lesson.id}:${i}`} visual={s.visual}/>}
              {s.example && <div className="exercise-sample"><div><strong>Entrada de ejemplo</strong><pre>{s.example.input}</pre></div><div><strong>Salida esperada</strong><pre>{s.example.output}</pre></div></div>}
              {s.code && <CodeBlock code={s.code} fragment={s.codeKind === "fragment"} input={s.codeInput} />}
              {s.afterCode && <LessonParagraphs text={s.afterCode} formatted={lesson.presentation === "walkthrough"} />}
              {s.check&&<div className="lesson-check"><span>COMPRUEBA SI LO ENTENDISTE</span><p>{s.check.question}</p><details><summary>Ver la respuesta</summary><p>{s.check.answer}</p></details></div>}
            </section>
          ))}
          {!!lesson.detailedSections?.length&&<details className="lesson-depth" id="detalle-tecnico">
            <summary>Desarrollo técnico</summary>
            <div className="lesson-depth-body">
              {lesson.objectives&&<p><strong>Contenido:</strong> {lesson.objectives.join(" · ")}.</p>}
              {lesson.detailedSections.map((section,i)=><details key={i}><summary>{section.title}</summary>{section.body.split("\n\n").map((paragraph,j)=><p key={j}>{paragraph}</p>)}{section.code&&<CodeBlock code={section.code}/>}</details>)}
            </div>
          </details>}
          {!!lesson.exercises?.length && <LessonExercises lessonId={lesson.id} exercises={lesson.exercises} />}
          <section className="quiz-card">
            <div className="eyebrow">
              <Lightbulb size={15} /> PREGUNTA DE REPASO
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
                    ? "Respuesta correcta."
                    : "Respuesta incorrecta."}
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
          {lesson.source && <details className="lesson-references">
            <summary>Fuentes y lecturas opcionales</summary>
            <p>La organización del temario toma como referencia USACO Guide, de Competitive Programming Initiative y sus colaboradores. Las explicaciones y los ejercicios de esta guía están redactados en español para estudiar aquí. El material educativo adaptado se comparte bajo CC BY-NC-SA 4.0.</p>
            <a href={lesson.source.url} target="_blank" rel="noopener noreferrer">Tema de referencia en USACO Guide (inglés) <ArrowUpRight size={14} /></a>
            <p>Esta lectura es opcional y no se necesita para completar la lección.</p>
          </details>}
        </article>
        <aside className="lesson-aside">
          <nav className="card lesson-contents" aria-label="Contenido de esta lección">
            <div className="eyebrow"><BookOpen size={15} /> EN ESTA LECCIÓN</div>
            {lesson.sections.map((section, i) => <button key={i} onClick={() => document.getElementById(`lesson-part-${i}`)?.scrollIntoView({ behavior: "smooth", block: "start" })}>{section.title}</button>)}
            {!!lesson.exercises?.length && <button className="contents-practice" onClick={() => document.getElementById("practica-local")?.scrollIntoView({ behavior: "smooth", block: "start" })}><Code2 size={16} /> {lesson.exercises.length} ejercicios con solución</button>}
          </nav>
          {!lesson.takeaway && !!lesson.prerequisites?.length && (
            <section className="card prerequisites-card">
              <div className="eyebrow">
                <Layers3 size={15} /> ANTES DE EMPEZAR
              </div>
              <h3>Conocimientos previos</h3>
              <p>
                Estas lecciones explican los conceptos que se usan aquí.
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
            <h3>Apuntes</h3>
            <p>Anota una explicación, una duda o un ejemplo.</p>
            <textarea
              aria-label="Mis apuntes de la lección"
              placeholder="Escribe tus notas…"
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
              <h3>Problema relacionado</h3>
              <p>Practica el tema con un problema completo.</p>
              <button
                className="text-link"
                onClick={() => go("problema", lesson.problemId)}
              >
                Practicar <ArrowRight size={15} />
              </button>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
function ProblemsPage({ progress }: { progress: Progress }) {
  const [mode, setMode] = useState<"local" | "temas">("temas");
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
        eyebrow="PRÁCTICA"
        title="Problemas y ejercicios"
        description="Elige un tema o un problema completo. Todos incluyen pistas, solución explicada y ejemplos."
      />
      <div className="practice-mode">
        <button
          className={mode === "local" ? "selected" : ""}
          onClick={() => setMode("local")}
        >
          <Code2 size={16} />
          Problemas completos <span>{problems.length}</span>
        </button>
        <button
          className={mode === "temas" ? "selected" : ""}
          onClick={() => setMode("temas")}
        >
          <Layers3 size={16} />
          Práctica por tema{" "}
          <span>
            {lessons.filter((l) => l.exercises?.length).length}
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
              <h3>Problemas con casos de prueba</h3>
              <p>
                Estos problemas incluyen casos de entrada y
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
          <h2>Enunciado</h2>
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
          <h3>Explicación del ejemplo</h3>
          <p>{problem.explanation}</p>
          <button className="button subtle" onClick={() => setHint(!hint)}>
            <Lightbulb size={16} />
            {hint ? "Ocultar pista" : "Ver pista"}
            <ChevronDown size={14} />
          </button>
          {hint && <div className="hint-box">{problem.hint}</div>}
        </article>
        <section className="card practice-panel">
          <span className="eyebrow">
            <Play size={14} /> CASOS DE PRUEBA
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
                ? "Todas las respuestas son correctas. Puedes escribir tu programa en el editor."
                : "Todavía hay casos por resolver. Revisa la pista y vuelve a intentarlo."}
            </div>
          )}
        </section>
      </div>
      <section className="card code-practice">
        <div className="section-heading">
          <div>
            <h2>Solución en C++</h2>
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
          testCases={problem.tests}
          onTestsPassed={onSolve}
        />
        <p className="compiler-problem-note">
          Ejecuta con tu propia entrada o comprueba todos los casos del problema.
          Superarlos registra el problema como resuelto; explica también por qué
          tu algoritmo funciona para cualquier entrada válida.
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
      <img className="empty-mascot" src={publicAsset("brand/entrenator.png")}
        alt="Entrenator, mascota de la OMRI" width={512} height={512} loading="lazy" />
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
      <p>Configura tu perfil y la cantidad de actividades que quieres completar cada semana.</p>
      <label htmlFor="profile-name">Nombre o apodo</label>
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
        <option value={3}>3 actividades por semana</option>
        <option value={5}>5 actividades por semana</option>
        <option value={7}>7 actividades por semana</option>
        <option value={10}>10 actividades por semana</option>
      </select>
      <div className="privacy-note">
        <Bookmark size={16} />
        <span>
          Sin cuenta ni correo. Tus lecciones, problemas y apuntes se guardan en
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
            Se borrarán las lecciones completadas, los problemas, la actividad y los
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
      text: "Curso de algoritmos y estructuras de datos en inglés. Su índice sirve como referencia para este temario.",
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
      text: "Tutoriales de C++ con explicaciones y ejemplos en inglés.",
      url: "https://www.learncpp.com/",
    },
  ];
  return (
    <>
      <PageHeading
        eyebrow="MATERIAL COMPLEMENTARIO"
        title="Recursos"
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
          <h2>Qué necesitas</h2>
          <p>
            Puedes leer las lecciones desde el teléfono. Para escribir código, es más cómodo usar una computadora con teclado. El laboratorio funciona en el navegador; no necesitas instalar un compilador.
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
  const exerciseCount = lessons.reduce((total, lesson) => total + (lesson.exercises?.length || 0), 0);
  return (
    <>
      <PageHeading
        eyebrow="INFORMACIÓN DEL CURSO"
        title="Acerca de esta guía"
        description="Aprende programación en español, desde cero, con explicaciones, práctica y soluciones dentro de la guía."
      />
      <section className="about-hero">
        <img className="about-brand-logo" src={publicAsset("brand/omri-logo.png")}
          alt="OMRI · Olimpiada Morelense de Informática" width={1080} height={270} loading="lazy" />
        <h2>
          Programación para secundaria y preparatoria
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
            title: "Primeros programas",
            text: "No necesitas experiencia. Empezamos con instrucciones, ejemplos cotidianos y tus primeros programas.",
          },
          {
            icon: Lightbulb,
            title: "Algoritmos",
            text: "Entiende el problema antes de escribir código. Prueba casos pequeños, equivócate y encuentra patrones.",
          },
          {
            icon: GraduationCap,
            title: "Ejercicios resueltos",
            text: "Estudia, pide una pista y compara tu razonamiento con la solución. Todo está en español y puedes practicar aquí mismo.",
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
          El logotipo y la mascota Entrenator proceden del{" "}
          <a className="inline-link" href="https://www.omri.org.mx/" target="_blank" rel="noopener noreferrer">
            sitio de la OMRI
          </a>. Allí puedes consultar las convocatorias y la información oficial de la olimpiada.
        </p>
        <p>
          La ruta reúne {lessons.length} lecciones y {exerciseCount} ejercicios
          propios en {levels.length} etapas, desde tus primeros programas hasta
          algoritmos avanzados. Cubre los {guideIndex.length} temas del
          índice de{" "}
          <a
            className="inline-link"
            href="https://usaco.guide/"
            target="_blank"
            rel="noopener noreferrer"
          >
            USACO Guide
          </a>
          . Encontrarás ejemplos paso a paso, pistas y soluciones explicadas
          para estudiar por tu cuenta. Los nombres Bronce, Plata, Oro y Platino organizan el aprendizaje y
          no representan categorías oficiales de la OMRI.
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
          . Las referencias de cada lección son lecturas opcionales. Las
          explicaciones y los ejercicios de esta guía están disponibles aquí,
          en español; no necesitas leer la referencia en inglés para hacerlos.
        </p>
        <p>
          Proyecto educativo independiente inspirado en la estructura de USACO Guide,
          con explicaciones y ejercicios originales en español sobre el mismo
          temario. No es una traducción íntegra de los artículos o bancos de
          problemas de otros sitios. Esta plataforma no sustituye las convocatorias, requisitos ni
          fechas oficiales de la olimpiada.
        </p>
        <p>
          En el catálogo de práctica por tema puedes resolver ejercicios sin
          salir de la lección. Escribe C++17, ejecútalo y comprueba los casos
          publicados, sin instalar nada. Superar esos casos ayuda a detectar
          errores; también debes explicar por qué tu algoritmo funciona para
          cualquier entrada válida. La comprobación no sustituye una evaluación
          completa de un juez de concursos.
        </p>
        <p>
          Tu avance, apuntes, razonamientos escritos, revisiones y borradores se
          guardan en este navegador y se conservan al recargar si el guardado
          local está disponible. No se sincronizan entre dispositivos; borrar
          los datos del sitio los elimina. La descarga de progreso incluye el
          perfil, los apuntes y el avance; los razonamientos de los ejercicios
          y los borradores se guardan por separado. Puedes descargar cada
          programa desde su editor.
        </p>
      </section>
    </>
  );
}
