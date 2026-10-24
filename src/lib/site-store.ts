import { useCallback, useEffect, useRef, useState } from "react";
import { get, onValue, push, ref, remove, set, update } from "firebase/database";
import { getDb } from "./firebase";

export type Project = {
  id: string;
  name: string;
  description: string;
  image: string;
  url: string;
};

export type Plan = {
  id: string;
  name: string;
  /** Free text so any currency/format works, e.g. "250,000 د.ع" */
  price: string;
  /** Shown beside the price, e.g. "/ سنويًا", "/ شهريًا" or "دفعة واحدة" */
  period: string;
  /** Optional line under the price, e.g. "ما يعادل 12,500 د.ع شهريًا" */
  note: string;
  /** Optional small payment note under the divider, e.g. "الدفع سنويًا — 150,000 دينار عند الاشتراك" */
  footnote: string;
  features: string[];
  /** Only one plan is highlighted at a time */
  featured: boolean;
  order: number;
};

export type SiteTexts = {
  brand: string;
  heroTitle: string;
  heroDescription: string;
  heroCta: string;
  aboutTitle: string;
  aboutText: string;
  servicesTitle: string;
  portfolioTitle: string;
  plansTitle: string;
  plansSubtitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  whatsappNumber: string;
  whatsappMessage: string;
};

export const DEFAULT_TEXTS: SiteTexts = {
  brand: "متجرك الرقمي",
  heroTitle: "ننقل تجارتك إلى العالم الرقمي",
  heroDescription:
    "نصمم لك متجرًا إلكترونيًا جاهزًا للاستخدام، احترافيًا وسريعًا، لتبدأ البيع عبر الإنترنت خلال أيام.",
  heroCta: "ابدأ متجرك الآن",
  aboutTitle: "من نحن",
  aboutText:
    "نساعد أصحاب المتاجر المحلية على زيادة مبيعاتهم من خلال الانتقال إلى الإنترنت. نتولى التصميم والإعداد والتدريب، لتركّز أنت على منتجاتك وعملائك.",
  servicesTitle: "لماذا تختارنا؟",
  portfolioTitle: "أعمالنا",
  plansTitle: "الباقات والأسعار",
  plansSubtitle: "اختر الباقة المناسبة لحجم تجارتك، وكل الباقات تشمل التدريب والدعم.",
  contactPhone: "+964 770 000 0000",
  contactEmail: "info@example.com",
  contactAddress: "بغداد، العراق",
  whatsappNumber: "9647813623682",
  whatsappMessage: "مرحبًا، أريد الاستفسار عن خدماتكم.",
};

export const DEFAULT_PROJECTS: Project[] = [
  {
    id: "p1",
    name: "متجر الأناقة",
    description: "متجر أزياء نسائية بتصميم عصري وتجربة شراء سلسة.",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=70",
    url: "https://example.com",
  },
  {
    id: "p2",
    name: "بيت العطور",
    description: "متجر عطور فاخرة مع نظام طلبات وتوصيل متكامل.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=70",
    url: "https://example.com",
  },
  {
    id: "p3",
    name: "تقنية بلس",
    description: "متجر إلكترونيات وإكسسوارات مع لوحة تحكم بالمخزون.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=70",
    url: "https://example.com",
  },
];

// Sample plans shown on first run. Edit them (names, prices, features) from the admin panel.
export const DEFAULT_PLANS: Plan[] = [
  {
    id: "plan-1",
    name: "الأساسية",
    price: "150,000 د.ع",
    period: "/ سنويًا",
    note: "ما يعادل 12,500 د.ع شهريًا",
    footnote: "الدفع سنويًا — 150,000 دينار عند الاشتراك",
    features: ["متجر إلكتروني جاهز", "حتى 50 منتجًا", "تصميم متجاوب مع الهاتف", "دعم فني لمدة شهر"],
    featured: false,
    order: 0,
  },
  {
    id: "plan-2",
    name: "الاحترافية",
    price: "240,000 د.ع",
    period: "/ سنويًا",
    note: "ما يعادل 20,000 د.ع شهريًا",
    footnote: "الدفع سنويًا — 240,000 دينار عند الاشتراك",
    features: ["كل ميزات الأساسية", "منتجات غير محدودة", "لوحة تحكم للطلبات", "ربط الطلبات بواتساب", "دعم فني لمدة 3 أشهر"],
    featured: true,
    order: 1,
  },
  {
    id: "plan-3",
    name: "المتقدمة",
    price: "360,000 د.ع",
    period: "/ سنويًا",
    note: "ما يعادل 30,000 د.ع شهريًا",
    footnote: "الدفع سنويًا — 360,000 دينار عند الاشتراك",
    features: ["كل ميزات الاحترافية", "دومين مخصص", "تصميم حسب هوية متجرك", "تدريب كامل على الإدارة", "دعم فني لمدة 6 أشهر"],
    featured: false,
    order: 2,
  },
];

type PlansRecord = Record<
  string,
  Partial<Omit<Plan, "id" | "features">> & { features?: string[] | Record<string, string> }
>;

function recordToPlans(record: PlansRecord): Plan[] {
  return Object.entries(record)
    .map(([id, p], i) => ({
      id,
      name: p.name ?? "",
      price: p.price ?? "",
      period: p.period ?? "",
      note: p.note ?? "",
      footnote: p.footnote ?? "",
      // Realtime Database may return arrays as objects, and drops empty arrays
      features: Array.isArray(p.features) ? p.features : Object.values(p.features ?? {}),
      featured: Boolean(p.featured),
      order: typeof p.order === "number" ? p.order : 1000 + i,
    }))
    .sort((a, b) => a.order - b.order);
}

type ProjectsRecord = Record<string, Omit<Project, "id">>;

function recordToProjects(record: ProjectsRecord | null): Project[] {
  if (!record) return [];
  return Object.entries(record).map(([id, p]) => ({ id, ...p }));
}

/** Reads site data from Firebase Realtime Database with live listeners, and seeds defaults on first run. */
export function useSiteData() {
  const [texts, setTexts] = useState<SiteTexts>(DEFAULT_TEXTS);
  const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
  const [plans, setPlans] = useState<Plan[]>(DEFAULT_PLANS);
  const plansRef = useRef<Plan[]>(DEFAULT_PLANS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubTexts: (() => void) | undefined;
    let unsubProjects: (() => void) | undefined;
    let unsubPlans: (() => void) | undefined;
    let cancelled = false;

    getDb().then((db) => {
      if (cancelled) return;

      unsubTexts = onValue(ref(db, "texts"), (snap) => {
        const val = snap.val() as Partial<SiteTexts> | null;
        if (val) {
          setTexts({ ...DEFAULT_TEXTS, ...val });
        } else {
          // First run: seed default texts
          set(ref(db, "texts"), DEFAULT_TEXTS).catch(() => {});
        }
        setLoading(false);
      });

      unsubProjects = onValue(ref(db, "projects"), (snap) => {
        const val = snap.val() as ProjectsRecord | null;
        if (val) {
          setProjects(recordToProjects(val));
        } else {
          // First run: seed default projects
          const seed: ProjectsRecord = {};
          for (const p of DEFAULT_PROJECTS) {
            const { id, ...rest } = p;
            seed[id] = rest;
          }
          set(ref(db, "projects"), seed).catch(() => {});
        }
      });

      unsubPlans = onValue(ref(db, "plans"), async (snap) => {
        const val = snap.val() as PlansRecord | null;
        if (val) {
          const list = recordToPlans(val);
          plansRef.current = list;
          setPlans(list);
          return;
        }
        try {
          // Empty node: seed samples only once, so deleting every plan later doesn't bring them back.
          const seeded = await get(ref(db, "meta/plansSeeded"));
          if (cancelled) return;
          if (seeded.val()) {
            plansRef.current = [];
            setPlans([]);
            return;
          }
          const seed: Record<string, Omit<Plan, "id">> = {};
          for (const { id, ...rest } of DEFAULT_PLANS) seed[id] = rest;
          await update(ref(db), { plans: seed, "meta/plansSeeded": true });
        } catch {
          // Rules may block the write; the samples stay visible locally.
        }
      });
    });

    return () => {
      cancelled = true;
      unsubTexts?.();
      unsubProjects?.();
      unsubPlans?.();
    };
  }, []);

  const saveTexts = useCallback(async (t: SiteTexts) => {
    const db = await getDb();
    // update() merges keys instead of replacing the whole node
    await update(ref(db, "texts"), t);
  }, []);

  const addProject = useCallback(async (p: Omit<Project, "id">) => {
    const db = await getDb();
    await push(ref(db, "projects"), p);
  }, []);

  /** Edits an existing project in place (only the given fields change; the key stays the same). */
  const updateProject = useCallback(async (id: string, patch: Partial<Omit<Project, "id">>) => {
    const db = await getDb();
    await update(ref(db, `projects/${id}`), patch);
  }, []);

  const removeProject = useCallback(async (id: string) => {
    const db = await getDb();
    await remove(ref(db, `projects/${id}`));
  }, []);

  /** Adds (id = null) or edits a plan. Highlighting a plan automatically un-highlights the others. */
  const savePlan = useCallback(async (id: string | null, data: Omit<Plan, "id" | "order">) => {
    const db = await getDb();
    const current = plansRef.current;
    const key = id ?? push(ref(db, "plans")).key!;
    const updates: Record<string, unknown> = {};
    for (const [field, value] of Object.entries(data)) updates[`plans/${key}/${field}`] = value;
    if (!id) updates[`plans/${key}/order`] = current.length ? Math.max(...current.map((p) => p.order)) + 1 : 0;
    if (data.featured) {
      for (const p of current) if (p.id !== key && p.featured) updates[`plans/${p.id}/featured`] = false;
    }
    await update(ref(db), updates);
  }, []);

  const removePlan = useCallback(async (id: string) => {
    const db = await getDb();
    await remove(ref(db, `plans/${id}`));
  }, []);

  /** Moves a plan one step earlier (-1) or later (+1) in the pricing table. */
  const movePlan = useCallback(async (id: string, dir: -1 | 1) => {
    const list = [...plansRef.current];
    const from = list.findIndex((p) => p.id === id);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= list.length) return;
    [list[from], list[to]] = [list[to], list[from]];
    const updates: Record<string, number> = {};
    list.forEach((p, i) => (updates[`plans/${p.id}/order`] = i));
    const db = await getDb();
    await update(ref(db), updates);
  }, []);

  /** Highlights one plan (or none when id is null). */
  const setFeaturedPlan = useCallback(async (id: string | null) => {
    const db = await getDb();
    const updates: Record<string, boolean> = {};
    for (const p of plansRef.current) updates[`plans/${p.id}/featured`] = p.id === id;
    await update(ref(db), updates);
  }, []);

  return {
    texts,
    projects,
    plans,
    loading,
    saveTexts,
    addProject,
    updateProject,
    removeProject,
    savePlan,
    removePlan,
    movePlan,
    setFeaturedPlan,
  };
}
