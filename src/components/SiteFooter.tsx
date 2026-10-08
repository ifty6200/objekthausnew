import { Link, useRouterState } from "@tanstack/react-router";
import { useRef } from "react";
import { WordmarkGlyph } from "./WordmarkGlyph";

const links = [
  { label: "Archive", to: "/archive" },
  { label: "Journal", to: "/journal" },
  { label: "Got an idea?", to: "/collaborate" },
  { label: "Contact", to: "/contact" },
] as const;

/** Soot shutter footer with quiet legal links at the very bottom of every public page. */
export function SiteFooter() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const blades = useRef<HTMLDivElement>(null);
  if (path.startsWith("/admin")) return null;

  const track = (e: React.PointerEvent) => {
    const el = blades.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", `${((e.clientX - r.left) / r.width) * 100}%`);
  };

  return (
    <footer data-tone="light" className="bg-soot text-bone" onPointerMove={track}>
      <div
        ref={blades}
        aria-hidden="true"
        className="h-10 w-full opacity-30"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, currentColor 0 1px, transparent 1px 28px)", maskImage: "radial-gradient(circle at var(--px, 50%) 50%, black, transparent 45%)", WebkitMaskImage: "radial-gradient(circle at var(--px, 50%) 50%, black, transparent 45%)" }}
      />
      <div className="mx-auto max-w-6xl px-7 py-16 sm:px-10">
        <WordmarkGlyph className="block h-10 w-64 opacity-90" />
        <nav className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="caps link-underline opacity-75 hover:opacity-100">{l.label}</Link>
          ))}
        </nav>
        <div className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-current/15 pt-5 text-[0.65rem] tracking-widest uppercase opacity-45">
          <span>© ObjektHaus Studio, Dhaka</span>
          <Link to="/privacy" className="hover:opacity-100">Privacy policy</Link>
          <Link to="/terms" className="hover:opacity-100">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
