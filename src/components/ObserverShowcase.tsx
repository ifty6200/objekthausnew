import { useEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion, useShowcase } from "@/lib/motion";
import archiveDark from "@/assets/archive-dark.jpg";

/**
 * Full-screen photo plates after "Got an idea?". Each plate sticks to the screen and the next one
 * slides up over it; scrolling snaps plate by plate, then onto the cream ending. Works both ways.
 */
export function ObserverShowcase() {
  const s = useShowcase();
  const slides = (s.slides ?? []).filter((x) => x.published !== false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slides.length || !root.current || prefersReducedMotion()) return;
    let alive = true;
    let kill = () => {};
    loadGsap().then(({ gsap }) => {
      const el = root.current;
      if (!alive || !el) return;
      const ctx = gsap.context(() => {
        // Positions are measured from the container, because sticky plates report shifting offsets.
        const vh = () => window.innerHeight;
        gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-plate]")).forEach((sec, i) => {
          const bg = sec.querySelector("[data-bg]");
          if (i > 0) gsap.fromTo(bg, { yPercent: 15 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: el, start: () => `top+=${(i - 1) * vh()} top`, end: () => `top+=${i * vh()} top`, scrub: true, invalidateOnRefresh: true } });
          gsap.fromTo(sec.querySelectorAll("[data-ch]"), { autoAlpha: 0, yPercent: 150 }, {
            autoAlpha: 1, yPercent: 0, duration: 1, ease: "power2", stagger: { each: 0.02, from: "random" },
            scrollTrigger: {
              trigger: el, invalidateOnRefresh: true,
              start: () => `top+=${(i - 0.5) * vh()} top`,
              end: () => `top+=${(i + 0.5) * vh()} top`,
              toggleActions: "restart none restart reset",
            },
          });
        });
      }, el);
      kill = () => ctx.revert();
    });
    return () => { alive = false; kill(); };
  }, [JSON.stringify(slides)]);

  if (!s.enabled || !slides.length) return null;

  return (
    <div ref={root} aria-label="Studio plates" className="relative">
      {slides.map((sl, i) => (
        <section
          key={i}
          data-plate
          data-tone="light"
          className="sticky top-0 h-[100svh] overflow-hidden bg-soot text-bone"
          style={{ zIndex: i + 1 }}
        >
          <div
            data-bg
            className="absolute inset-0 flex items-center justify-center bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(180deg, rgb(20 21 19 / .65) 40%, rgb(20 21 19 / .2)), url(${sl.image || archiveDark})` }}
          >
            <div className="px-7 text-center">
              <p className="caps opacity-60">{sl.caption}</p>
              <h2 className="mt-5 font-display text-5xl font-light sm:text-7xl lg:text-8xl" aria-label={sl.heading}>
                {sl.heading.split(" ").map((w, wi) => (
                  <span key={wi} aria-hidden="true" className="inline-block overflow-hidden whitespace-nowrap pr-[0.25em]">
                    {Array.from(w).map((c, ci) => <span key={ci} data-ch className="inline-block">{c}</span>)}
                  </span>
                ))}
              </h2>
              {sl.link && <a href={sl.link} className="corner-action caps mt-10 inline-flex">Enter</a>}
              <p className="caps mt-10 font-mono text-xs opacity-50">{String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</p>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
