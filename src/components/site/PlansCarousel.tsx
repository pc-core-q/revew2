import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Star } from "lucide-react";
import type { Plan } from "@/lib/site-store";

type Scroll = { active: number; canScroll: boolean; atStart: boolean; atEnd: boolean };

/** Plans in a horizontal swipe row (scroll-snap). The page is RTL, so the first plan is on the right. */
export function PlansCarousel({ plans }: { plans: Plan[] }) {
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
    setS((prev) => (Object.keys(next) as (keyof Scroll)[]).every((k) => prev[k] === next[k]) ? prev : next);
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
        className="no-scrollbar mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-4 pb-6 pt-5 focus-visible:outline-none sm:gap-6"
      >
        {plans.map((pl) => (
          <div
            key={pl.id}
            className={`relative flex w-[78vw] max-w-80 shrink-0 snap-center flex-col rounded-2xl border bg-card p-6 first:ms-auto last:me-auto md:p-7 ${
              pl.featured ? "border-primary shadow-lift ring-2 ring-primary/20" : "shadow-soft"
            }`}
          >
            {pl.featured && (
              <span className="absolute -top-3 right-1/2 inline-flex translate-x-1/2 items-center gap-1 whitespace-nowrap rounded-full bg-gradient-primary px-4 py-1 text-xs font-bold text-primary-foreground shadow-soft">
                <Star className="h-3 w-3 fill-current" /> الأكثر طلبًا
              </span>
            )}
            <h3 className="text-xl font-bold">{pl.name}</h3>
            <div className="mt-3 border-b pb-5">
              <p className="text-3xl font-extrabold text-primary">{pl.price}</p>
              {pl.period && <p className="mt-1 text-sm text-muted-foreground">{pl.period}</p>}
            </div>
            <ul className="my-5 flex-1 space-y-3">
              {pl.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm md:text-base">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className={`block rounded-full py-3 text-center font-bold transition active:scale-[0.98] ${
                pl.featured
                  ? "bg-gradient-primary text-primary-foreground shadow-soft hover:opacity-90"
                  : "border border-primary text-primary hover:bg-accent"
              }`}
            >
              اطلب هذه الباقة
            </a>
          </div>
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
