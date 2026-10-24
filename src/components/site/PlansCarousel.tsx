import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Plan } from "@/lib/site-store";
import { WhatsAppIcon, whatsappHref } from "./WhatsAppButton";

/** Features shown before the "show all" toggle, so cards stay short and even. */
const PREVIEW = 4;

function PlanCard({ plan, whatsappNumber }: { plan: Plan; whatsappNumber: string }) {
  const [expanded, setExpanded] = useState(false);
  const extra = Math.max(0, plan.features.length - PREVIEW);
  const shown = expanded ? plan.features : plan.features.slice(0, PREVIEW);
  const wa = whatsappHref(whatsappNumber, `مرحبًا، أريد الاستفسار عن "${plan.name}" (${plan.price}).`);

  return (
    <div
      className={`relative flex w-[82vw] max-w-72 shrink-0 snap-center flex-col rounded-2xl border bg-card p-5 first:ms-auto last:me-auto sm:max-w-[19rem] ${
        plan.featured ? "border-primary shadow-lift ring-2 ring-primary/20" : "shadow-soft"
      }`}
    >
      {plan.featured && (
        <span className="absolute -top-3 right-1/2 inline-flex translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-soft">
          <Star className="h-3 w-3 fill-current" /> الأكثر طلبًا
        </span>
      )}

      <div className="text-center">
        <h3 className="text-base font-semibold leading-snug text-muted-foreground">{plan.name}</h3>
        <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-1.5">
          <span className="text-3xl font-extrabold leading-tight text-primary">{plan.price}</span>
          {plan.period && <span className="text-base font-bold text-primary">{plan.period}</span>}
        </p>
        {plan.note && <p className="mt-1.5 text-sm text-muted-foreground">{plan.note}</p>}
      </div>

      <div className="my-4 border-t" />
      {plan.footnote && <p className="-mt-1 mb-4 text-center text-xs leading-relaxed text-muted-foreground">{plan.footnote}</p>}

      <div className="flex-1">
        <ul className="space-y-2.5">
          {shown.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-snug">
              <span className="mt-px flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
        {extra > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-primary"
          >
            {expanded ? "إخفاء" : `عرض كل المميزات (+${extra})`}
            <ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      <a
        href={wa || "#contact"}
        {...(wa ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className={`mt-5 inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-4 text-center font-bold transition active:scale-[0.98] ${
          plan.featured
            ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90"
            : "border border-primary text-primary hover:bg-accent"
        }`}
      >
        {wa ? (
          <>
            <WhatsAppIcon className="h-5 w-5" /> اطلب عبر واتساب
          </>
        ) : (
          "اطلب هذه الباقة"
        )}
      </a>
    </div>
  );
}

type Scroll = { active: number; canScroll: boolean; atStart: boolean; atEnd: boolean };

/** Plans in a horizontal swipe row (scroll-snap). The page is RTL, so the first plan is on the right. */
export function PlansCarousel({ plans, whatsappNumber }: { plans: Plan[]; whatsappNumber: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [s, setS] = useState<Scroll>({ active: 0, canScroll: false, atStart: true, atEnd: false });

  const step = useCallback(() => {
    const el = scroller.current;
    const a = el?.children[0] as HTMLElement | undefined;
    const b = el?.children[1] as HTMLElement | undefined;
    if (!a) return 0;
    return b ? Math.abs(b.offsetLeft - a.offsetLeft) : a.offsetWidth;
  }, []);

  const update = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft); // scrollLeft is negative in RTL
    const atEnd = max > 4 && pos > max - 4;
    const next: Scroll = {
      canScroll: max > 4,
      atStart: pos < 4,
      atEnd,
      active: atEnd ? plans.length - 1 : Math.min(plans.length - 1, Math.round(pos / (step() || 1))),
    };
    setS((prev) => ((Object.keys(next) as (keyof Scroll)[]).every((k) => prev[k] === next[k]) ? prev : next));
  }, [plans.length, step]);

  useEffect(() => {
    update();
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update, plans]);

  // dir +1 = next plan (to the left in RTL), -1 = previous
  const go = (dir: 1 | -1) => scroller.current?.scrollBy({ left: -dir * step(), behavior: "smooth" });
  const goTo = (i: number) => scroller.current?.scrollTo({ left: -i * step(), behavior: "smooth" });

  return (
    <div role="region" aria-roledescription="carousel" aria-label="الباقات والأسعار">
      <div
        ref={scroller}
        onScroll={update}
        tabIndex={0}
        className="no-scrollbar mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-6 pt-5 focus-visible:outline-none sm:gap-5"
      >
        {plans.map((pl) => (
          <PlanCard key={pl.id} plan={pl} whatsappNumber={whatsappNumber} />
        ))}
      </div>

      {s.canScroll && (
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={s.atStart}
            aria-label="الباقة السابقة"
            className="hidden h-11 w-11 items-center justify-center rounded-full border bg-card shadow-soft transition hover:bg-accent disabled:opacity-40 md:inline-flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            {plans.map((pl, i) => (
              <button
                key={pl.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`الانتقال إلى ${pl.name}`}
                aria-current={i === s.active}
                className="flex h-8 w-6 items-center justify-center"
              >
                <span className={`h-2 rounded-full transition-all ${i === s.active ? "w-5 bg-primary" : "w-2 bg-primary/30"}`} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={s.atEnd}
            aria-label="الباقة التالية"
            className="hidden h-11 w-11 items-center justify-center rounded-full border bg-card shadow-soft transition hover:bg-accent disabled:opacity-40 md:inline-flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
