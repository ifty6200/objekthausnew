import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { loadGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Site-wide GSAP: scroll fade-ins for sections, springy hover/press on every link and button,
 * and a fluid snap onto the photo plates and the cream page ending.
 */
export function MotionEnhancer({ selector = "main > section" }: { selector?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (prefersReducedMotion() || path.startsWith("/admin")) return;
    let cleanup = () => {};
    let alive = true;
    const t = window.setTimeout(() => loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (!alive) return;
      const ctx = gsap.context(() => {
        gsap.utils.toArray<HTMLElement>(selector).slice(1).forEach((el) => {
          if (el.hasAttribute("data-plate")) return;
          const kids = el.querySelectorAll(":scope > div, :scope > h2, :scope > p");
          gsap.from(kids.length ? kids : el, {
            autoAlpha: 0, y: 40, duration: 1.1, ease: "power2.out", stagger: 0.12,
            scrollTrigger: { trigger: el, start: "top 80%", once: true },
          });
        });
        // One single snap controller (multiple triggers fought each other and caused double jumps).
        const points = () => {
          const vh = window.innerHeight;
          const pts: number[] = [];
          const box = document.querySelector<HTMLElement>("[aria-label='Studio plates']");
          if (box) {
            const top = box.getBoundingClientRect().top + window.scrollY;
            box.querySelectorAll("[data-plate]").forEach((_, i) => pts.push(top + i * vh));
          }
          document.querySelectorAll<HTMLElement>("[data-snap-end]").forEach((e) => pts.push(e.getBoundingClientRect().top + window.scrollY));
          return pts;
        };
        if (document.querySelector("[data-plate], [data-snap-end]")) {
          ScrollTrigger.create({
            start: 0, end: "max",
            snap: {
              snapTo: (progress: number) => {
                const max = ScrollTrigger.maxScroll(window);
                const y = progress * max;
                const vh = window.innerHeight;
                let best = -1, dist = Infinity;
                for (const p of points()) { const d = Math.abs(p - y); if (d < dist) { dist = d; best = p; } }
                if (best < 0 || dist > vh * 0.5) return progress;
                return Math.min(best, max) / max;
              },
              duration: { min: 0.35, max: 0.7 }, delay: 0.15, ease: "power2.inOut", inertia: false,
            },
          });
        }
      });
      const fine = window.matchMedia("(hover: hover)").matches;
      const btns = Array.from(document.querySelectorAll<HTMLElement>("main a, main button, footer a, header a, header button, [data-cta]"));
      const on = (e: Event) => gsap.to(e.currentTarget as HTMLElement, { scale: 1.04, duration: 0.4, ease: "back.out(3)" });
      const off = (e: Event) => gsap.to(e.currentTarget as HTMLElement, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      const tap = (e: Event) => gsap.fromTo(e.currentTarget as HTMLElement, { scale: 0.95 }, { scale: 1, duration: 0.6, ease: "back.out(2.2)" });
      btns.forEach((b) => {
        if (fine) { b.addEventListener("pointerenter", on); b.addEventListener("pointerleave", off); }
        b.addEventListener("pointerdown", tap);
      });
      ScrollTrigger.refresh();
      cleanup = () => {
        ctx.revert();
        btns.forEach((b) => { b.removeEventListener("pointerenter", on); b.removeEventListener("pointerleave", off); b.removeEventListener("pointerdown", tap); });
      };
    }), 300);
    return () => { alive = false; clearTimeout(t); cleanup(); };
  }, [selector, path]);
  return null;
}
