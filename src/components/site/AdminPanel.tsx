import { useEffect, useRef, useState } from "react";
import { X, Trash2, Plus, LogOut, Loader2, ImagePlus, DollarSign, Package } from "lucide-react";
import type { Project, PricingPlan, SiteTexts } from "@/lib/site-store";

const ADMIN_PASSWORD = "1234";
const IMGBB_KEY = "820a1a52d1b835874a9200fe7d3bb6b3";

const TEXT_FIELDS: { key: keyof SiteTexts; label: string; long?: boolean }[] = [
  { key: "brand", label: "اسم الموقع" },
  { key: "heroTitle", label: "العنوان الرئيسي" },
  { key: "heroDescription", label: "وصف الواجهة", long: true },
  { key: "heroCta", label: "نص زر الواجهة" },
  { key: "aboutTitle", label: "عنوان من نحن" },
  { key: "aboutText", label: "نص من نحن", long: true },
  { key: "servicesTitle", label: "عنوان الخدمات" },
  { key: "portfolioTitle", label: "عنوان الأعمال" },
  { key: "contactPhone", label: "رقم الهاتف الظاهر" },
  { key: "whatsappNumber", label: "رقم الواتساب للتواصل (مثال: 9647700000000)" },
  { key: "contactEmail", label: "البريد الإلكتروني" },
  { key: "contactAddress", label: "العنوان" },
  { key: "statsProjects", label: "إحصائية: المتاجر المنجزة (مثال: +15)" },
  { key: "statsVisitors", label: "إحصائية: عدد الزوار (مثال: +2,500)" },
  { key: "statsSatisfaction", label: "إحصائية: نسبة الرضا (مثال: 100%)" },
  { key: "statsUptime", label: "إحصائية: الاستقرار والسرعة (مثال: 99.9%)" },
];

type Props = {
  open: boolean;
  onClose: () => void;
  texts: SiteTexts;
  projects: Project[];
  plans: PricingPlan[];
  saveTexts: (t: SiteTexts) => Promise<void>;
  addProject: (p: Omit<Project, "id">) => Promise<void>;
  removeProject: (id: string) => Promise<void>;
  addPlan: (p: Omit<PricingPlan, "id">) => Promise<void>;
  removePlan: (id: string) => Promise<void>;
};

const input =
  "w-full rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring";

async function uploadToImgbb(file: File): Promise<string> {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error("فشل رفع الصورة");
  const json = await res.json();
  const url = json?.data?.display_url;
  if (!url) throw new Error("فشل رفع الصورة");
  return url as string;
}

export function AdminPanel({
  open,
  onClose,
  texts,
  projects,
  plans,
  saveTexts,
  addProject,
  removeProject,
  addPlan,
  removePlan,
}: Props) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"projects" | "plans" | "texts">("projects");
  const [draft, setDraft] = useState<SiteTexts>(texts);
  const [saved, setSaved] = useState(false);

  // فورم المشاريع
  const [np, setNp] = useState({ name: "", description: "", url: "" });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [status, setStatus] = useState<"" | "uploading" | "saving">("");
  const [formError, setFormError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // فورم الباقات
  const [newPlan, setNewPlan] = useState({
    name: "",
    price: "",
    currency: "IQD" as "IQD" | "USD",
    description: "",
    featuresText: "",
    popular: false,
  });
  const [savingPlan, setSavingPlan] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);

  const [savingTexts, setSavingTexts] = useState(false);

  useEffect(() => setDraft(texts), [texts]);
  useEffect(() => {
    if (!open) {
      setPw("");
      setError("");
      setFormError("");
      setStatus("");
    }
  }, [open]);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!open) return null;

  const login = (e: React.FormEvent) => {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setError("");
    } else {
      setError("كلمة المرور غير صحيحة");
    }
  };

  const submitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!np.name || !np.url || !file || status) return;
    setFormError("");
    try {
      setStatus("uploading");
      const image = await uploadToImgbb(file);
      setStatus("saving");
      await addProject({ ...np, image });
      setNp({ name: "", description: "", url: "" });
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setFormError("حدث خطأ أثناء الإضافة. حاول مرة أخرى.");
    } finally {
      setStatus("");
    }
  };

  const submitPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price || savingPlan) return;
    setSavingPlan(true);
    try {
      const features = newPlan.featuresText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      await addPlan({
        name: newPlan.name,
        price: newPlan.price,
        currency: newPlan.currency,
        description: newPlan.description,
        features,
        popular: newPlan.popular,
      });

      setNewPlan({
        name: "",
        price: "",
        currency: "IQD",
        description: "",
        featuresText: "",
        popular: false,
      });
    } finally {
      setSavingPlan(false);
    }
  };

  const submitTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    if (savingTexts) return;
    setSavingTexts(true);
    try {
      await saveTexts(draft);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSavingTexts(false);
    }
  };

  const deleteProject = async (id: string) => {
    setDeletingId(id);
    try {
      await removeProject(id);
    } finally {
      setDeletingId(null);
    }
  };

  const deletePlanItem = async (id: string) => {
    setDeletingPlanId(id);
    try {
      await removePlan(id);
    } finally {
      setDeletingPlanId(null);
    }
  };

  const busy = status !== "";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-3 backdrop-blur-sm animate-in fade-in sm:p-4">
      <div
        className={`relative w-full rounded-2xl bg-card shadow-lift animate-in zoom-in-95 ${
          authed ? "max-w-4xl" : "max-w-sm"
        } max-h-[92vh] overflow-y-auto text-right`}
      >
        <button
          onClick={onClose}
          aria-label="إغلاق"
          className="absolute left-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted"
        >
          <X className="h-5 w-5" />
        </button>

        {!authed ? (
          <form onSubmit={login} className="space-y-4 p-6 sm:p-8">
            <h2 className="text-xl font-bold">تسجيل دخول المسؤول</h2>
            <input
              type="password"
              autoFocus
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="أدخل كلمة المرور"
              className={input}
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button className="w-full rounded-lg bg-gradient-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90">
              دخول
            </button>
          </form>
        ) : (
          <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-4 flex items-center justify-between gap-4 pl-6">
              <h2 className="text-xl font-bold md:text-2xl">لوحة التحكم</h2>
              <button
                onClick={() => {
                  setAuthed(false);
                  onClose();
                }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive sm:text-sm"
              >
                <LogOut className="h-4 w-4" /> خروج
              </button>
            </div>

            {/* التبويبات */}
            <div className="mb-6 flex gap-1 rounded-xl bg-muted p-1 text-xs sm:gap-2 sm:text-sm">
              {[
                { id: "projects", label: "المشاريع" },
                { id: "plans", label: "باقات الأسعار" },
                { id: "texts", label: "نصوص الموقع" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`flex-1 rounded-lg py-2 font-semibold transition ${
                    tab === t.id ? "bg-card text-primary shadow-soft" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* تبويب المشاريع */}
            {tab === "projects" && (
              <div className="space-y-6">
                <form onSubmit={submitProject} className="grid gap-3 rounded-xl border p-4 md:grid-cols-2">
                  <input
                    required
                    placeholder="اسم المشروع"
                    value={np.name}
                    onChange={(e) => setNp({ ...np, name: e.target.value })}
                    className={input}
                  />
                  <input
                    required
                    type="url"
                    dir="ltr"
                    placeholder="رابط المتجر https://"
                    value={np.url}
                    onChange={(e) => setNp({ ...np, url: e.target.value })}
                    className={`${input} text-right`}
                  />
                  <label
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-input px-3 py-2 text-sm text-muted-foreground transition hover:border-primary md:col-span-2 ${
                      busy ? "pointer-events-none opacity-60" : ""
                    }`}
                  >
                    {preview ? (
                      <img src={preview} alt="" className="h-12 w-16 rounded-md object-cover" />
                    ) : (
                      <ImagePlus className="h-5 w-5" />
                    )}
                    <span className="truncate">{file ? file.name : "اختر صورة للمشروع"}</span>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      required
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <textarea
                    placeholder="وصف المشروع"
                    value={np.description}
                    onChange={(e) => setNp({ ...np, description: e.target.value })}
                    className={`${input} md:col-span-2`}
                    rows={2}
                  />
                  {formError && <p className="text-sm text-destructive md:col-span-2">{formError}</p>}
                  <button
                    disabled={busy}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-primary py-2.5 font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60 md:col-span-2"
                  >
                    {busy ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {status === "uploading" ? "جارٍ رفع الصورة..." : "جارٍ الحفظ..."}
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" /> إضافة مشروع
                      </>
                    )}
                  </button>
                </form>
                <ul className="space-y-2">
                  {projects.map((p) => (
                    <li key={p.id} className="flex items-center gap-3 rounded-xl border p-3">
                      {p.image && <img src={p.image} alt="" className="h-12 w-16 rounded-md object-cover" />}
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base">{p.name}</p>
                        <p className="truncate text-xs text-muted-foreground" dir="ltr">
                          {p.url}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteProject(p.id)}
                        disabled={deletingId === p.id}
                        aria-label="حذف"
                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      >
                        {deletingId === p.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      </button>
                    </li>
                  ))}
                  {projects.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">لا توجد مشاريع مضافة.</p>
                  )}
                </ul>
              </div>
            )}

            {/* تبويب الباقات والأسعار */}
            {tab === "plans" && (
              <div className="space-y-6">
                <form onSubmit={submitPlan} className="grid gap-3 rounded-xl border p-4 md:grid-cols-2">
                  <input
                    required
                    placeholder="اسم الباقة (مثال: باقة الانطلاق)"
                    value={newPlan.name}
                    onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                    className={input}
                  />

                  <div className="flex gap-2">
                    <input
                      required
                      placeholder="السعر (مثال: 150 أو 300,000)"
                      value={newPlan.price}
                      onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                      className={`${input} flex-1`}
                    />
                    <select
                      value={newPlan.currency}
                      onChange={(e) => setNewPlan({ ...newPlan, currency: e.target.value as any })}
                      className="rounded-lg border border-input bg-card px-3 py-2 text-sm outline-none font-bold"
                    >
                      <option value="IQD">د.ع (دينار)</option>
                      <option value="USD">$ (دولار)</option>
                    </select>
                  </div>

                  <input
                    placeholder="وصف مختصر للباقة"
                    value={newPlan.description}
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                    className={`${input} md:col-span-2`}
                  />

                  <textarea
                    rows={3}
                    placeholder="المزايا (اكتب كل ميزة في سطر منفصل)"
                    value={newPlan.featuresText}
                    onChange={(e) => setNewPlan({ ...newPlan, featuresText: e.target.value })}
                    className={`${input} md:col-span-2`}
                  />

                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer md:col-span-2">
                    <input
                      type="checkbox"
                      checked={newPlan.popular}
                      onChange={(e) => setNewPlan({ ...newPlan, popular: e.target.checked })}
                      className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                    />
                    <span>تمييز هذه الباقة كـ "الأكثر طلباً"</span>
                  </label>

                  <button
                    disabled={savingPlan}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gradient-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 md:col-span-2"
                  >
                    {savingPlan ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                    إضافة باقة جديدة
                  </button>
                </form>

                {/* قائمة الباقات المضافة */}
                <div className="space-y-3">
                  <h3 className="font-bold text-sm text-muted-foreground">الباقات الحالية في الموقع:</h3>
                  {plans.map((pl) => (
                    <div key={pl.id} className="flex items-center justify-between rounded-xl border p-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base">{pl.name}</span>
                          {pl.popular && (
                            <span className="rounded bg-primary/20 px-2 py-0.5 text-xs font-bold text-primary">
                              الأكثر طلباً
                            </span>
                          )}
                        </div>
                        <div className="text-sm font-semibold text-primary mt-0.5">
                          {pl.price} {pl.currency === "IQD" ? "د.ع" : "$"}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{pl.features?.length || 0} مزايا مسجلة</div>
                      </div>
                      <button
                        onClick={() => deletePlanItem(pl.id)}
                        disabled={deletingPlanId === pl.id}
                        aria-label="حذف"
                        className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
                      >
                        {deletingPlanId === pl.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                  {plans.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground">لا توجد باقات بعد. أضف أول باقة بالأعلى.</p>
                  )}
                </div>
              </div>
            )}

            {/* تبويب النصوص */}
            {tab === "texts" && (
              <form onSubmit={submitTexts} className="grid gap-4 md:grid-cols-2">
                {TEXT_FIELDS.map((f) => (
                  <label key={f.key} className={`space-y-1 text-sm font-medium ${f.long ? "md:col-span-2" : ""}`}>
                    <span>{f.label}</span>
                    {f.long ? (
                      <textarea
                        rows={3}
                        value={draft[f.key] ?? ""}
                        onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                        className={input}
                      />
                    ) : (
                      <input
                        value={draft[f.key] ?? ""}
                        onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                        className={input}
                      />
                    )}
                  </label>
                ))}
                <button
                  disabled={savingTexts}
                  className="flex items-center justify-center gap-2 rounded-lg bg-gradient-primary py-2.5 font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 md:col-span-2"
                >
                  {savingTexts ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> جارٍ الحفظ...
                    </>
                  ) : saved ? (
                    "تم الحفظ ✓"
                  ) : (
                    "حفظ التغييرات"
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
