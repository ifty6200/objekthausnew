import { useEffect, useRef } from "react";
import { loadGsap, prefersReducedMotion, useShowcase } from "@/lib/motion";
import archiveDark from "@/assets/archive-dark.jpg";

/**
 * Full-screen photo plates after "Got an idea?". One pinned stage; each scroll step slides the next
 * plate up over the previous one and snaps exactly one plate per swipe, in both directions.
 * Letters re-animate every time a plate becomes active (forward or backward).
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
        const plates = gsap.utils.toArray<HTMLElement>(el.querySelectorAll("[data-plate]"));
        const n = plates.length;
        const chars = plates.map((p) => p.querySelectorAll("[data-ch]"));
        let active = -1;
        const show = (i: number) => {
          if (i === active) return;
          active = i;
          chars.forEach((c, k) => {
            gsap.killTweensOf(c);
            if (k === i) gsap.fromTo(c, { autoAlpha: 0, yPercent: 150 }, { autoAlpha: 1, yPercent: 0, duration: 0.9, ease: "power3.out", stagger: { each: 0.02, from: "random" } });
            else gsap.set(c, { autoAlpha: 0, yPercent: 150 });
          });
        };
        const tl = gsap.timeline({ defaults: { ease: "none" }, paused: true });
        plates.forEach((p, i) => {
          if (i === 0) return;
          tl.fromTo(p, { yPercent: 100 }, { yPercent: 0, duration: 1, ease: "power2.inOut" }, i - 1)
            .fromTo(p.querySelector("[data-bg]"), { scale: 1.15 }, { scale: 1, duration: 1, ease: "power2.inOut" }, i - 1)
            .to(plates[i - 1].querySelector("[data-bg]"), { scale: 0.92, autoAlpha: 0.4, duration: 1, ease: "power2.inOut" }, i - 1);
        });
        if (n === 1) tl.to({}, { duration: 1 });

        // Pin the stage; gestures are intercepted so ONE swipe/wheel step = exactly ONE panel.
        let step = 0;
        let busy = false;
        const st = gsap.plugins?.Observer
          ? null
          : null;
        void st;
        const trigger = (window as any).ScrollTrigger;
        const pin = trigger?.create?.({ trigger: el, start: "top top", end: "bottom bottom", pin: el.querySelector(".sticky"), pinSpacing: false });
        const goTo = (next: number) => {
          next = gsap.utils.clamp(0, n - 1, next);
          if (busy || next === step) return;
          busy = true;
          step = next;
          show(step);
          gsap.to(tl, {
            progress: n > 1 ? step / (n - 1) : 0,
            duration: 0.85,
            ease: "power3.inOut",
            onComplete: () => { busy = false; },
          });
        };
        const Observer = (gsap as any).Observer;
        const obs = Observer?.create({
          target: el,
          type: "wheel,touch,pointer",
          wheelSpeed: -1,
          tolerance: 12,
          preventDefault: true,
          onDown: () => goTo(step + 1),
          onUp: () => goTo(step - 1),
          onEnable: () => show(step),
        });
        // Allow leaving the pinned section at the edges (scroll past first/last panel).
        const release = trigger?.create?.({
          trigger: el,
          start: "top top",
          end: "bottom bottom",
          onEnter: () => { step = 0; show(0); tl.progress(0); obs?.enable(); },
          onEnterBack: () => { step = n - 1; show(step); tl.progress(1); obs?.enable(); },
          onLeave: () => obs?.disable(),
          onLeaveBack: () => obs?.disable(),
        });
        void pin; void release;
        chars.forEach((c) => gsap.set(c, { autoAlpha: 0, yPercent: 150 }));
      }, el);
      kill = () => ctx.revert();
    });
    return () => { alive = false; kill(); };
  }, [JSON.stringify(slides)]);

  if (!s.enabled || !slides.length) return null;

  return (
    <div ref={root} aria-label="Studio plates" className="relative" style={{ height: `${slides.length * 100}svh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-soot">
        {slides.map((sl, i) => (
          <section
            key={i}
            data-plate
            data-tone="light"
            className="absolute inset-0 h-full w-full overflow-hidden bg-soot text-bone"
            style={{ zIndex: i + 1 }}
          >
            <div
              data-bg
              className="absolute inset-0 flex h-full w-full items-center justify-center bg-cover bg-center"
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
    </div>
  );
}
