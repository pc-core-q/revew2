import { useEffect } from "react";

/**
 * Adds `is-visible` to every `.reveal` element when it scrolls into view.
 * A MutationObserver also picks up elements that appear later (e.g. data arriving from Firebase),
 * so content never stays stuck at opacity 0.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    const watch = () => document.querySelectorAll(".reveal:not(.is-visible)").forEach((el) => io.observe(el));
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      mo.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
