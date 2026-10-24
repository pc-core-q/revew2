import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ChevronUp, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { Plan } from "@/lib/site-store";
import { btnOutline, btnPrimary, fieldClass, type Notify } from "./shared";

type PlanInput = Omit<Plan, "id" | "order">;

type Props = {
  plans: Plan[];
  savePlan: (id: string | null, data: PlanInput) => Promise<void>;
  removePlan: (id: string) => Promise<void>;
  movePlan: (id: string, dir: -1 | 1) => Promise<void>;
  setFeaturedPlan: (id: string | null) => Promise<void>;
  notify: Notify;
  onDirtyChange: (dirty: boolean) => void;
};

const PERIODS = ["/ سنويًا", "/ شهريًا", "دفعة واحدة"];

/** "150,000 د.ع" -> "ما يعادل 12,500 د.ع شهريًا" (annual price divided by 12). */
function suggestMonthly(price: string): string | null {
  const latin = price.replace(/[٠-٩]/g, (d) => String("٠١٢٣٤٥٦٧٨٩".indexOf(d)));
  const m = latin.match(/\d[\d,]*(?:\.\d+)?/);
  if (!m || m.index === undefined) return null;
  const amount = Number(m[0].replace(/,/g, ""));
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const currency = (latin.slice(0, m.index) + latin.slice(m.index + m[0].length)).trim();
  const monthly = Math.round(amount / 12).toLocaleString("en-US");
  return `ما يعادل ${monthly}${currency ? ` ${currency}` : ""} شهريًا`;
}

const parseFeatures = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export function PlansManager({ plans, savePlan, removePlan, movePlan, setFeaturedPlan, notify, onDirtyChange }: Props) {
  // null = list view, "new" = add form, otherwise the id of the plan being edited
  const [editing, setEditing] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const editingPlan = editing && editing !== "new" ? plans.find((p) => p.id === editing) : undefined;

  useEffect(() => {
    if (editing && editing !== "new" && !editingPlan) setEditing(null);
  }, [editing, editingPlan]);

  const run = async (id: string, action: () => Promise<void>, okMsg?: string) => {
    setBusyId(id);
    try {
      await action();
      if (okMsg) notify(okMsg);
    } catch {
      notify("تعذّر تنفيذ العملية. حاول مرة أخرى.", "error");
    } finally {
      setBusyId(null);
      setConfirmId(null);
    }
  };

  if (editing === "new" || editingPlan) {
    return (
      <PlanForm
        key={editing}
        plan={editingPlan}
        savePlan={savePlan}
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
          الباقات <span className="text-sm font-medium text-muted-foreground">({plans.length})</span>
        </h3>
        <button type="button" onClick={() => setEditing("new")} className={btnPrimary}>
          <Plus className="h-4 w-4" /> باقة جديدة
        </button>
      </div>

      <ul className="space-y-3">
        {plans.map((p, i) => {
          const busy = busyId === p.id;
          return (
            <li key={p.id} className={`rounded-2xl border bg-card p-3 ${p.featured ? "border-primary/60 ring-1 ring-primary/20" : ""}`}>
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">{p.name}</p>
                    {p.featured && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                        <Star className="h-3 w-3 fill-current" /> مُبرزة
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm font-bold text-primary">
                    {p.price}
                    {p.period && <span className="mr-1.5 text-xs font-bold">{p.period}</span>}
                  </p>
                  {p.note && <p className="text-xs text-muted-foreground">{p.note}</p>}
                  <p className="text-xs text-muted-foreground">{p.features.length} ميزة</p>
                </div>
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    aria-label="تحريك للأعلى"
                    disabled={i === 0 || busyId !== null}
                    onClick={() => run(p.id, () => movePlan(p.id, -1))}
                    className="inline-flex h-9 w-11 items-center justify-center rounded-lg hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronUp className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="تحريك للأسفل"
                    disabled={i === plans.length - 1 || busyId !== null}
                    onClick={() => run(p.id, () => movePlan(p.id, 1))}
                    className="inline-flex h-9 w-11 items-center justify-center rounded-lg hover:bg-muted disabled:opacity-30"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {confirmId === p.id ? (
                <div className="mt-3 space-y-2 rounded-xl bg-destructive/10 p-3">
                  <p className="text-sm font-medium text-destructive">حذف باقة «{p.name}» نهائيًا؟ لا يمكن التراجع.</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => run(p.id, () => removePlan(p.id), "تم حذف الباقة")}
                      disabled={busy}
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-destructive px-4 text-sm font-semibold text-destructive-foreground disabled:opacity-60"
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      نعم، احذف
                    </button>
                    <button type="button" onClick={() => setConfirmId(null)} disabled={busy} className={btnOutline}>
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
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
                  <button
                    type="button"
                    disabled={busyId !== null}
                    onClick={() =>
                      run(
                        p.id,
                        () => setFeaturedPlan(p.featured ? null : p.id),
                        p.featured ? "أُلغي إبراز الباقة" : `تم إبراز باقة «${p.name}»`,
                      )
                    }
                    className={`${btnOutline} w-full`}
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className={`h-4 w-4 ${p.featured ? "fill-current text-primary" : ""}`} />}
                    {p.featured ? "إلغاء الإبراز" : "إبراز هذه الباقة"}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {plans.length === 0 && (
        <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          لا توجد باقات، وقسم الأسعار مخفي في الموقع. اضغط «باقة جديدة» لإضافة أول باقة.
        </div>
      )}
      {plans.length > 0 && (
        <p className="text-xs text-muted-foreground">الترتيب هنا هو ترتيب ظهور الباقات في الموقع. يمكن إبراز باقة واحدة فقط.</p>
      )}
    </div>
  );
}

type FormProps = {
  plan?: Plan;
  savePlan: Props["savePlan"];
  notify: Notify;
  onDirtyChange: (dirty: boolean) => void;
  onClose: () => void;
};

function PlanForm({ plan, savePlan, notify, onDirtyChange, onClose }: FormProps) {
  const isNew = !plan;
  const [name, setName] = useState(plan?.name ?? "");
  const [price, setPrice] = useState(plan?.price ?? "");
  const [period, setPeriod] = useState(plan?.period ?? "");
  const [note, setNote] = useState(plan?.note ?? "");
  const [footnote, setFootnote] = useState(plan?.footnote ?? "");
  const [featuresText, setFeaturesText] = useState(plan?.features.join("\n") ?? "");
  const [featured, setFeatured] = useState(plan?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const features = parseFeatures(featuresText);
  const monthlyHint = period.includes("سنوي") ? suggestMonthly(price) : null;
  const dirty = isNew
    ? Boolean(name || price || period || note || footnote || featuresText || featured)
    : name !== plan.name ||
      price !== plan.price ||
      period !== plan.period ||
      note !== plan.note ||
      footnote !== plan.footnote ||
      featured !== plan.featured ||
      features.join("\n") !== plan.features.join("\n");

  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  const back = () => {
    if (saving) return;
    if (dirty && !window.confirm("لديك تغييرات غير محفوظة. هل تريد تجاهلها؟")) return;
    onClose();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!name.trim()) return setError("أدخل اسم الباقة.");
    if (!price.trim()) return setError("أدخل سعر الباقة.");
    setError("");
    setSaving(true);
    try {
      await savePlan(plan?.id ?? null, {
        name: name.trim(),
        price: price.trim(),
        period: period.trim(),
        note: note.trim(),
        footnote: footnote.trim(),
        features,
        featured,
      });
      notify(isNew ? "تمت إضافة الباقة" : "تم حفظ التعديلات");
      onDirtyChange(false);
      onClose();
    } catch {
      setError("تعذّر الحفظ في قاعدة البيانات. حاول مرة أخرى.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={back}
          aria-label="رجوع إلى قائمة الباقات"
          className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
        >
          <ArrowRight className="h-5 w-5" />
        </button>
        <h3 className="text-base font-bold">{isNew ? "باقة جديدة" : "تعديل الباقة"}</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-1.5 text-sm font-medium">
          <span>اسم الباقة</span>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: الاحترافية" className={fieldClass} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium">
          <span>السعر</span>
          <input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="مثال: 450,000 د.ع" className={fieldClass} />
        </label>
        <div className="space-y-1.5 text-sm font-medium md:col-span-2">
          <label htmlFor="plan-period" className="block">
            الفترة بجانب السعر <span className="font-normal text-muted-foreground">(اختياري)</span>
          </label>
          <input id="plan-period" value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="مثال: / سنويًا" className={fieldClass} />
          <div className="flex flex-wrap gap-2 pt-1">
            {PERIODS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(period === p ? "" : p)}
                className={`min-h-9 rounded-full border px-3.5 text-sm transition ${
                  period === p ? "border-primary bg-accent font-semibold text-primary" : "bg-card hover:bg-muted"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 text-sm font-medium md:col-span-2">
          <label htmlFor="plan-note" className="block">
            سطر تحت السعر <span className="font-normal text-muted-foreground">(اختياري، مثل المعادل الشهري)</span>
          </label>
          <input id="plan-note" value={note} onChange={(e) => setNote(e.target.value)} placeholder="مثال: ما يعادل 12,500 د.ع شهريًا" className={fieldClass} />
          {monthlyHint && note !== monthlyHint && (
            <button
              type="button"
              onClick={() => setNote(monthlyHint)}
              className="min-h-9 rounded-xl bg-accent px-3 text-start text-xs font-semibold text-accent-foreground"
            >
              اقتراح: {monthlyHint} (اضغط للاستخدام)
            </button>
          )}
        </div>
        <label className="block space-y-1.5 text-sm font-medium md:col-span-2">
          <span>
            ملاحظة الدفع <span className="font-normal text-muted-foreground">(اختياري، تظهر بخط صغير)</span>
          </span>
          <input value={footnote} onChange={(e) => setFootnote(e.target.value)} placeholder="مثال: الدفع سنويًا — 150,000 دينار عند الاشتراك" className={fieldClass} />
        </label>
        <label className="block space-y-1.5 text-sm font-medium md:col-span-2">
          <span>المميزات</span>
          <textarea
            rows={7}
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            placeholder={"اكتب كل ميزة في سطر مستقل\nمثال:\nمتجر جاهز\nدعم فني لمدة شهر"}
            className={fieldClass}
          />
          <span className="block text-xs font-normal text-muted-foreground">{features.length} ميزة. كل سطر يظهر كنقطة منفصلة في البطاقة.</span>
        </label>
        <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border bg-card px-3.5 py-2 md:col-span-2">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-5 w-5 shrink-0 accent-[var(--primary)]"
          />
          <span className="text-sm">
            <span className="font-semibold">إبراز هذه الباقة</span>
            <span className="block text-xs text-muted-foreground">تظهر بإطار وشارة «الأكثر طلبًا»، وتُلغى الإبراز عن الباقة المبرزة حاليًا.</span>
          </span>
        </label>
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-destructive/10 px-3.5 py-2.5 text-sm font-medium text-destructive">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 -mx-4 -mb-4 flex gap-2 border-t bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:-mx-6 md:px-6">
        <button type="submit" disabled={saving || (!isNew && !dirty)} className={`${btnPrimary} flex-1`}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> جارٍ الحفظ...
            </>
          ) : isNew ? (
            <>
              <Plus className="h-4 w-4" /> إضافة الباقة
            </>
          ) : (
            "حفظ التعديلات"
          )}
        </button>
        <button type="button" onClick={back} disabled={saving} className={btnOutline}>
          إلغاء
        </button>
      </div>
    </form>
  );
}
