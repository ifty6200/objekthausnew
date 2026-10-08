import { useEffect } from "react";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/** Adds GSAP scroll fade-ins to the page's sections and springy feedback to main buttons. */
export function MotionEnhancer({ selector = "main > section" }: { selector?: string }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let cleanup = () => {};
    let alive = true;
    loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (!alive) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(selector).slice(1).forEach((el) => {
          const kids = el.querySelectorAll(":scope > div, :scope > h2, :scope > p");
          gsap.from(kids.length ? kids : el, {
            autoAlpha: 0, y: 40, duration: 1.1, ease: "power2.out", stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
        });
      });
      const btns = Array.from(document.querySelectorAll<HTMLElement>(".corner-action, [data-cta]"));
      const on = (e: Event) => gsap.to(e.currentTarget as HTMLElement, { scale: 1.04, duration: 0.4, ease: "back.out(3)" });
      const off = (e: Event) => gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      const tap = (e: Event) => gsap.fromTo(e.currentTarget as HTMLElement, { scale: 0.94 }, { scale: 1, duration: 0.7, ease: "elastic.out(1.2, 0.35)" });
      btns.forEach((b) => { b.addEventListener("pointerenter", on); b.addEventListener("pointerleave", off); b.addEventListener("pointerdown", tap); });
      ScrollTrigger.refresh();
      cleanup = () => {
        ctx.revert();
        btns.forEach((b) => { b.removeEventListener("pointerenter", on); b.removeEventListener("pointerleave", off); b.removeEventListener("pointerdown", tap); });
      };
    });
    return () => { alive = false; cleanup(); };
  }, [selector]);
  return null;
}
