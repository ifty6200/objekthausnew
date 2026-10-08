import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { loadGsap, prefersReducedMotion, useShowcase } from "@/lib/motion";
import archiveDark from "@/assets/archive-dark.jpg";

/** Continuous animated slides (GSAP Observer). Swipe/drag, arrows or autoplay; edited in the Studio. */
export function ObserverShowcase() {
  const s = useShowcase();
  const slides = (s.slides ?? []).filter((x) => x.published !== false);
  const root = useRef<HTMLElement>(null);
  const goto = useRef<(i: number, d: number) => void>(() => {});
  const [index, setIndex] = useState(0);
  const cur = useRef(-1);
  const count = slides.length;

  useEffect(() => {
    if (!count || !root.current) return;
    let alive = true;
    let kill = () => {};
    loadGsap().then(({ gsap, Observer }) => {
      const el = root.current;
      if (!alive || !el) return;
      const q = (c: string) => gsap.utils.toArray<HTMLElement>(el.querySelectorAll(c));
      const secs = q("[data-slide]"), outers = q("[data-outer]"), inners = q("[data-inner]"), bgs = q("[data-bg]");
      const wrap = gsap.utils.wrap(0, secs.length);
      const reduce = prefersReducedMotion();
      let animating = false;
      cur.current = -1;
      gsap.set(secs, { autoAlpha: 0 });
      gsap.set(outers, { yPercent: 100 });
      gsap.set(inners, { yPercent: -100 });
      goto.current = (i, dir) => {
        if (animating) return;
        i = wrap(i);
        if (i === cur.current) return;
        animating = true;
        const f = dir === -1 ? -1 : 1;
        const tl = gsap.timeline({ defaults: { duration: reduce ? 0.01 : 1.25, ease: "power1.inOut" }, onComplete: () => { animating = false; } });
        if (cur.current >= 0) {
          gsap.set(secs[cur.current], { zIndex: 0 });
          tl.to(bgs[cur.current], { yPercent: -15 * f }).set(secs[cur.current], { autoAlpha: 0 });
        }
        gsap.set(secs[i], { autoAlpha: 1, zIndex: 1 });
        tl.fromTo([outers[i], inners[i]], { yPercent: (k) => (k ? -100 * f : 100 * f) }, { yPercent: 0 }, 0)
          .fromTo(bgs[i], { yPercent: 15 * f }, { yPercent: 0 }, 0)
          .fromTo(secs[i].querySelectorAll("[data-ch]"), { autoAlpha: 0, yPercent: 150 * f }, { autoAlpha: 1, yPercent: 0, duration: 1, ease: "power2", stagger: { each: 0.02, from: "random" } }, 0.2);
        cur.current = i;
        setIndex(i);
      };
      goto.current(0, 1);
      const obs = Observer.create({
        target: el, type: "touch,pointer", tolerance: 20, dragMinimum: 10,
        onUp: () => goto.current(cur.current + 1, 1),
        onDown: () => goto.current(cur.current - 1, -1),
      });
      const t = s.autoplay > 0 ? window.setInterval(() => goto.current(cur.current + 1, 1), s.autoplay * 1000) : 0;
      kill = () => { obs.kill(); if (t) clearInterval(t); };
    });
    return () => { alive = false; kill(); };
  }, [count, s.autoplay, JSON.stringify(slides)]);

  if (!s.enabled || !count) return null;

  return (
    <section ref={root} data-tone="light" aria-roledescription="carousel" aria-label="Studio plates" className="relative h-[100svh] touch-pan-y overflow-hidden bg-soot text-bone select-none">
      {slides.map((sl, i) => (
        <div key={i} data-slide className="absolute inset-0" style={{ visibility: i === 0 ? "visible" : "hidden" }}>
          <div data-outer className="h-full w-full overflow-hidden">
            <div data-inner className="h-full w-full overflow-hidden">
              <div data-bg className="absolute inset-0 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgb(20 21 19 / .65) 40%, rgb(20 21 19 / .2)), url(${sl.image || archiveDark})` }}>
                <div className="px-7 text-center">
                  <p className="caps opacity-60">{sl.caption}</p>
                  <h2 className="mt-5 font-display text-5xl font-light sm:text-7xl lg:text-8xl" aria-label={sl.heading}>
                    {sl.heading.split(" ").map((w, wi) => (
                      <span key={wi} aria-hidden="true" className="inline-block overflow-hidden whitespace-nowrap pr-[0.25em]">
                        {Array.from(w).map((c, ci) => <span key={ci} data-ch className="inline-block">{c}</span>)}
                      </span>
                    ))}
                  </h2>
                  {sl.link && <Link to={sl.link} className="corner-action caps mt-10 inline-flex">Enter</Link>}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-8 z-10 flex items-center justify-center gap-6">
        <button type="button" aria-label="Previous plate" onClick={() => goto.current(cur.current - 1, -1)} className="caps opacity-70 hover:opacity-100">←</button>
        <span className="caps font-mono text-xs opacity-60">{String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <button type="button" aria-label="Next plate" onClick={() => goto.current(cur.current + 1, 1)} className="caps opacity-70 hover:opacity-100">→</button>
      </div>
    </section>
  );
}
