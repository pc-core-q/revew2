import { useEffect, useMemo, useState } from "react";
import { ArrowRight, ExternalLink, ImagePlus, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { Project } from "@/lib/site-store";
import {
  btnOutline,
  btnPrimary,
  compressImage,
  fieldClass,
  hostOf,
  normalizeUrl,
  uploadToImgbb,
  type Notify,
} from "./shared";

type ProjectData = Omit<Project, "id">;

type Props = {
  projects: Project[];
  addProject: (p: ProjectData) => Promise<void>;
  updateProject: (id: string, patch: Partial<ProjectData>) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  notify: Notify;
  onDirtyChange: (dirty: boolean) => void;
};

export function ProjectsManager({
  projects,
  addProject,
  updateProject,
  removeProject,
  notify,
  onDirtyChange,
}: Props) {
  // null = list view, "new" = add form, otherwise the id of the project being edited
  const [editing, setEditing] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editingProject = editing && editing !== "new" ? projects.find((p) => p.id === editing) : undefined;

  // The project being edited was deleted elsewhere: go back to the list.
  useEffect(() => {
    if (editing && editing !== "new" && !editingProject) setEditing(null);
  }, [editing, editingProject]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(q));
  }, [projects, query]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await removeProject(id);
      notify("تم حذف المشروع");
    } catch {
      notify("تعذّر حذف المشروع. حاول مرة أخرى.", "error");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  if (editing === "new" || editingProject) {
    return (
      <ProjectForm
        key={editing}
        project={editingProject}
        addProject={addProject}
        updateProject={updateProject}
        notify={notify}
        onDirtyChange={onDirtyChange}
        onClose={() => setEditing(null)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-bold">
          المشاريع <span className="text-sm font-medium text-muted-foreground">({projects.length})</span>
        </h3>
        <button type="button" onClick={() => setEditing("new")} className={btnPrimary}>
          <Plus className="h-4 w-4" /> مشروع جديد
        </button>
      </div>

      {projects.length > 4 && (
        <div className="relative">
          <Search className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المشاريع"
            className={`${fieldClass} pr-10`}
          />
        </div>
      )}

      <ul className="space-y-3">
        {filtered.map((p) => (
          <li key={p.id} className="rounded-2xl border bg-card p-3">
            <div className="flex items-center gap-3">
              {p.image ? (
                <img src={p.image} alt="" loading="lazy" className="h-16 w-20 shrink-0 rounded-lg bg-muted object-cover" />
              ) : (
                <div className="h-16 w-20 shrink-0 rounded-lg bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="line-clamp-1 text-xs text-muted-foreground">{p.description || "بدون وصف"}</p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  dir="ltr"
                  className="mt-0.5 inline-flex max-w-full items-center gap-1 text-xs text-primary"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  <span className="truncate">{hostOf(p.url)}</span>
                </a>
              </div>
            </div>

            {confirmId === p.id ? (
              <div className="mt-3 space-y-2 rounded-xl bg-destructive/10 p-3">
                <p className="text-sm font-medium text-destructive">حذف «{p.name}» نهائيًا؟ لا يمكن التراجع.</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
                  >
                    {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    نعم، احذف
                  </button>
                  <button type="button" onClick={() => setConfirmId(null)} disabled={deletingId === p.id} className={btnOutline}>
                    إلغاء
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setEditing(p.id)} className={`${btnOutline} text-primary`}>
                  <Pencil className="h-4 w-4" /> تعديل
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmId(p.id)}
                  className={`${btnOutline} text-destructive hover:bg-destructive/10`}
                >
                  <Trash2 className="h-4 w-4" /> حذف
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          لا توجد مشاريع بعد. اضغط «مشروع جديد» لإضافة أول مشروع.
        </div>
      )}
      {projects.length > 0 && filtered.length === 0 && (
        <p className="py-6 text-center text-sm text-muted-foreground">لا نتائج مطابقة للبحث.</p>
      )}
    </div>
  );
}

type FormProps = {
  project?: Project;
  addProject: Props["addProject"];
  updateProject: Props["updateProject"];
  notify: Notify;
  onDirtyChange: (dirty: boolean) => void;
  onClose: () => void;
};

function ProjectForm({ project, addProject, updateProject, notify, onDirtyChange, onClose }: FormProps) {
  const isNew = !project;
  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [url, setUrl] = useState(project?.url ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [status, setStatus] = useState<"" | "uploading" | "saving">("");
  const [error, setError] = useState("");

  const dirty = isNew
    ? Boolean(name || description || url || file)
    : name !== project.name || description !== project.description || url !== project.url || Boolean(file);

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const shownImage = preview || project?.image || "";
  const busy = status !== "";

  const back = () => {
    if (busy) return;
    if (dirty && !window.confirm("لديك تغييرات غير محفوظة. هل تريد تجاهلها؟")) return;
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const cleanUrl = normalizeUrl(url);
    if (!name.trim()) return setError("أدخل اسم المشروع.");
    if (!cleanUrl) return setError("رابط المتجر غير صالح. مثال: example.com");
    if (isNew && !file) return setError("اختر صورة للمشروع.");
    setError("");

    let stage: "upload" | "save" = "upload";
    try {
      let image = project?.image ?? "";
      if (file) {
        setStatus("uploading");
        image = await uploadToImgbb(await compressImage(file), file.name);
      }
      stage = "save";
      setStatus("saving");
      const data = { name: name.trim(), description: description.trim(), url: cleanUrl, image };
      if (project) await updateProject(project.id, data);
      else await addProject(data);
      notify(isNew ? "تمت إضافة المشروع" : "تم حفظ التعديلات");
      onDirtyChange(false);
      onClose();
    } catch {
      setError(
        stage === "upload"
          ? "تعذّر رفع الصورة. تحقق من الاتصال أو جرّب صورة أخرى."
          : "تعذّر الحفظ في قاعدة البيانات. حاول مرة أخرى.",
      );
      setStatus("");
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={back}
          aria-label="رجوع إلى قائمة المشاريع"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <h3 className="text-base font-bold">{isNew ? "مشروع جديد" : "تعديل المشروع"}</h3>
      </div>

      <div className="grid gap-5 md:grid-cols-[17rem_1fr]">
        <div>
          <span className="mb-1.5 block text-sm font-medium">صورة المشروع</span>
          <label className="relative block cursor-pointer overflow-hidden rounded-xl border border-dashed border-input bg-muted/50 transition focus-within:ring-2 focus-within:ring-ring/40 hover:border-primary">
            <div className="aspect-[16/9] md:aspect-[4/3]">
              {shownImage ? (
                <img src={shownImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
                  <ImagePlus className="h-7 w-7" />
                  اضغط لاختيار صورة
                </div>
              )}
            </div>
            {shownImage && (
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-foreground/60 py-2 text-sm font-medium text-background">
                <ImagePlus className="h-4 w-4" /> {file ? "تغيير الصورة المختارة" : "استبدال الصورة"}
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              disabled={busy}
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
          </label>
          {!isNew && !file && <p className="mt-1.5 text-xs text-muted-foreground">اتركها كما هي للاحتفاظ بالصورة الحالية.</p>}
        </div>

        <div className="space-y-4">
          <label className="block space-y-1.5 text-sm font-medium">
            <span>اسم المشروع</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: متجر الأناقة" className={fieldClass} />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>رابط المتجر</span>
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              dir="ltr"
              inputMode="url"
              autoCapitalize="none"
              autoCorrect="off"
              placeholder="example.com"
              className={`${fieldClass} text-right`}
            />
          </label>
          <label className="block space-y-1.5 text-sm font-medium">
            <span>الوصف</span>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="جملة أو جملتان عن المشروع"
              className={fieldClass}
            />
          </label>
        </div>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 -mb-4 flex gap-2 border-t bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:-mx-6 md:px-6">
        <button type="submit" disabled={busy || (!isNew && !dirty)} className={`${btnPrimary} flex-1`}>
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {status === "uploading" ? "جارٍ رفع الصورة..." : "جارٍ الحفظ..."}
            </>
          ) : isNew ? (
            <>
              <Plus className="h-4 w-4" /> إضافة المشروع
            </>
          ) : (
            "حفظ التعديلات"
          )}
        </button>
        <button type="button" onClick={back} disabled={busy} className={btnOutline}>
          إلغاء
        </button>
      </div>
    </form>
  );
}
