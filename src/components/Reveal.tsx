import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.18) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  delay?: number;
};

/** Fades, lifts and un-blurs its children the first time they scroll into view. */
export function Reveal({ children, as: Tag = "div", className = "", delay = 0 }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${inView ? "is-visible" : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}

/** A hairline rule that draws itself from left to right when scrolled into view. */
export function RuleLine({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  return (
    <span
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`rule-line reveal-line ${inView ? "scale-x-100" : ""} ${className}`}
    />
  );
}
