import { useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import type { SiteTexts } from "@/lib/site-store";
import { btnOutline, btnPrimary, fieldClass, type Notify } from "./shared";

type Field = { key: keyof SiteTexts; label: string; long?: boolean; ltr?: boolean; inputMode?: "tel" | "email"; hint?: string };

const GROUPS: { title: string; fields: Field[] }[] = [
  {
    title: "الواجهة الرئيسية",
    fields: [
      { key: "brand", label: "اسم الموقع" },
      { key: "heroTitle", label: "العنوان الرئيسي" },
      { key: "heroDescription", label: "وصف الواجهة", long: true },
      { key: "heroCta", label: "نص الزر" },
    ],
  },
  {
    title: "من نحن",
    fields: [
      { key: "aboutTitle", label: "العنوان" },
      { key: "aboutText", label: "النص", long: true },
    ],
  },
  {
    title: "عناوين الأقسام",
    fields: [
      { key: "servicesTitle", label: "عنوان الخدمات" },
      { key: "portfolioTitle", label: "عنوان الأعمال" },
      { key: "plansTitle", label: "عنوان الباقات والأسعار" },
      { key: "plansSubtitle", label: "سطر تحت عنوان الباقات", long: true },
    ],
  },
  {
    title: "معلومات التواصل",
    fields: [
      { key: "contactPhone", label: "رقم الهاتف", ltr: true, inputMode: "tel" },
      { key: "contactEmail", label: "البريد الإلكتروني", ltr: true, inputMode: "email" },
      { key: "contactAddress", label: "العنوان" },
      {
        key: "whatsappNumber",
        label: "رقم واتساب",
        ltr: true,
        inputMode: "tel",
        hint: "يمكن كتابته 07813623682 أو بالصيغة الدولية 9647813623682. اتركه فارغًا لإخفاء الزر العائم.",
      },
      { key: "whatsappMessage", label: "رسالة واتساب الجاهزة", long: true, hint: "تظهر مكتوبة مسبقًا عند ضغط الزائر على الزر." },
    ],
  },
];

const same = (a: SiteTexts, b: SiteTexts) => (Object.keys(a) as (keyof SiteTexts)[]).every((k) => a[k] === b[k]);

type Props = {
  texts: SiteTexts;
  saveTexts: (t: SiteTexts) => Promise<void>;
  notify: Notify;
  onDirtyChange: (dirty: boolean) => void;
};

export function TextsEditor({ texts, saveTexts, notify, onDirtyChange }: Props) {
  const [draft, setDraft] = useState<SiteTexts>(texts);
  const [saving, setSaving] = useState(false);
  const prev = useRef(texts);

  // Live updates from Firebase only replace the form when the user has no unsaved edits.
  useEffect(() => {
    setDraft((d) => (same(d, prev.current) ? texts : d));
    prev.current = texts;
  }, [texts]);

  const dirty = !same(draft, texts);
  useEffect(() => {
    onDirtyChange(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange(false), [onDirtyChange]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving || !dirty) return;
    setSaving(true);
    try {
      await saveTexts(draft);
      notify("تم حفظ النصوص");
    } catch {
      notify("تعذّر الحفظ. تحقق من الاتصال وحاول مرة أخرى.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {GROUPS.map((g) => (
        <fieldset key={g.title} className="space-y-4 rounded-2xl border p-4">
          <legend className="px-2 text-sm font-bold text-primary">{g.title}</legend>
          {g.fields.map((f) => {
            const changed = draft[f.key] !== texts[f.key];
            return (
              <label key={f.key} className="block space-y-1.5 text-sm font-medium">
                <span className="flex items-center gap-2">
                  {f.label}
                  {changed && <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">معدّل</span>}
                </span>
                {f.long ? (
                  <textarea
                    rows={3}
                    value={draft[f.key]}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className={fieldClass}
                  />
                ) : (
                  <input
                    value={draft[f.key]}
                    inputMode={f.inputMode}
                    dir={f.ltr ? "ltr" : undefined}
                    onChange={(e) => setDraft({ ...draft, [f.key]: e.target.value })}
                    className={`${fieldClass} ${f.ltr ? "text-right" : ""}`}
                  />
                )}
                {f.hint && <span className="block text-xs font-normal text-muted-foreground">{f.hint}</span>}
              </label>
            );
          })}
        </fieldset>
      ))}

      <div className="sticky bottom-0 -mx-4 -mb-4 flex gap-2 border-t bg-card/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:-mx-6 md:px-6">
        <button type="submit" disabled={saving || !dirty} className={`${btnPrimary} flex-1`}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> جارٍ الحفظ...
            </>
          ) : (
            "حفظ التغييرات"
          )}
        </button>
        <button type="button" onClick={() => setDraft(texts)} disabled={saving || !dirty} className={btnOutline} aria-label="تراجع عن التعديلات">
          <RotateCcw className="h-4 w-4" /> تراجع
        </button>
      </div>
    </form>
  );
}
