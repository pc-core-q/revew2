import { useCallback, useEffect, useRef, useState } from "react";
import { X, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import type { Plan, Project, SiteTexts } from "@/lib/site-store";
import { ProjectsManager } from "./admin/ProjectsManager";
import { PlansManager } from "./admin/PlansManager";
import { TextsEditor } from "./admin/TextsEditor";
import { btnPrimary, fieldClass, type Notify } from "./admin/shared";

const ADMIN_PASSWORD = "1234";
const SESSION_KEY = "admin-authed";
const LEAVE_MSG = "لديك تغييرات غير محفوظة. هل تريد المغادرة وتجاهلها؟";

type Props = {
  open: boolean;
  onClose: () => void;
  texts: SiteTexts;
  projects: Project[];
  saveTexts: (t: SiteTexts) => Promise<void>;
  addProject: (p: Omit<Project, "id">) => Promise<void>;
  updateProject: (id: string, patch: Partial<Omit<Project, "id">>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  plans: Plan[];
  savePlan: (id: string | null, data: Omit<Plan, "id" | "order">) => Promise<void>;
  removePlan: (id: string) => Promise<void>;
  movePlan: (id: string, dir: -1 | 1) => Promise<void>;
  setFeaturedPlan: (id: string | null) => Promise<void>;
};

export function AdminPanel({
  open,
  onClose,
  texts,
  projects,
  saveTexts,
  addProject,
  updateProject,
  removeProject,
  plans,
  savePlan,
  removePlan,
  movePlan,
  setFeaturedPlan,
}: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"projects" | "plans" | "texts">("projects");
  const [notice, setNotice] = useState<{ message: string; kind: "success" | "error" } | null>(null);
  const dirtyRef = useRef(false);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Stay signed in for the browser session so the panel doesn't ask again after every close.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
    } catch {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      setPw("");
      setError("");
      setNotice(null);
    }
  }, [open]);

  useEffect(() => () => clearTimeout(noticeTimer.current), []);

  const onDirtyChange = useCallback((d: boolean) => {
    dirtyRef.current = d;
  }, []);

  const notify: Notify = useCallback((message, kind = "success") => {
    setNotice({ message, kind });
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(null), 3000);
  }, []);

  /** Runs `action` unless the user has unsaved edits and chooses to stay. */
  const guard = (action: () => void) => {
    if (dirtyRef.current && !window.confirm(LEAVE_MSG)) return;
    dirtyRef.current = false;
    action();
  };

  if (!open) return null;

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    } else setError("كلمة المرور غير صحيحة");
  };

  const logout = () =>
    guard(() => {
      setAuthed(false);
      try {
        sessionStorage.removeItem(SESSION_KEY);
      } catch {
        /* ignore */
      }
      onClose();
    });

  const tabs = [
    { id: "projects", label: "المشاريع" },
    { id: "plans", label: "الباقات" },
    { id: "texts", label: "النصوص" },
  ] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 backdrop-blur-sm md:items-center md:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="لوحة التحكم"
    >
      <div
        className={`relative flex w-full animate-in flex-col overflow-hidden bg-card shadow-lift slide-in-from-bottom-8 fade-in md:zoom-in-95 md:rounded-2xl ${
          authed
            ? "h-dvh md:h-auto md:max-h-[90dvh] md:max-w-4xl"
            : "max-h-[90dvh] rounded-t-3xl md:max-w-sm"
        }`}
      >
        {!authed ? (
          <form onSubmit={login} className="space-y-4 p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] md:p-8">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">تسجيل دخول المسؤول</h2>
              <button type="button" onClick={onClose} aria-label="إغلاق" className="-ml-2 inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <input
              type="password"
              autoFocus
              autoComplete="current-password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className={fieldClass}
            />
            {error && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
            <button className={`${btnPrimary} w-full`}>دخول</button>
          </form>
        ) : (
          <>
            <header className="flex items-center gap-2 border-b px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] md:px-6 md:pt-4">
              <h2 className="flex-1 text-lg font-bold md:text-xl">لوحة التحكم</h2>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-11 items-center gap-1.5 rounded-xl px-3 text-sm text-muted-foreground hover:bg-muted hover:text-destructive"
              >
                <LogOut className="h-4 w-4" /> خروج
              </button>
              <button
                type="button"
                onClick={() => guard(onClose)}
                aria-label="إغلاق"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="px-4 pt-3 md:px-6">
              <div role="tablist" className="flex gap-1 rounded-xl bg-muted p-1">
                {tabs.map((t) => (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={tab === t.id}
                    onClick={() => tab !== t.id && guard(() => setTab(t.id))}
                    className={`min-h-11 flex-1 rounded-lg text-sm font-semibold transition ${
                      tab === t.id ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 md:px-6">
              {tab === "projects" ? (
                <ProjectsManager
                  projects={projects}
                  addProject={addProject}
                  updateProject={updateProject}
                  removeProject={removeProject}
                  notify={notify}
                  onDirtyChange={onDirtyChange}
                />
              ) : tab === "plans" ? (
                <PlansManager
                  plans={plans}
                  savePlan={savePlan}
                  removePlan={removePlan}
                  movePlan={movePlan}
                  setFeaturedPlan={setFeaturedPlan}
                  notify={notify}
                  onDirtyChange={onDirtyChange}
                />
              ) : (
                <TextsEditor texts={texts} saveTexts={saveTexts} notify={notify} onDirtyChange={onDirtyChange} />
              )}
            </div>

            {notice && (
              <div
                role="status"
                className={`pointer-events-none absolute inset-x-4 bottom-24 z-10 mx-auto flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-lift animate-in fade-in slide-in-from-bottom-2 ${
                  notice.kind === "success" ? "bg-foreground text-background" : "bg-destructive text-destructive-foreground"
                }`}
              >
                {notice.kind === "success" ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
                {notice.message}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
