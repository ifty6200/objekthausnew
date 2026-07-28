import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavTone } from "./use-nav-tone";

const menu = [
  { label: "Exhibition", to: "/", hash: "hero" },
  { label: "Manifesto", to: "/", hash: "manifesto" },
  { label: "Object No.07", to: "/", hash: "object" },
  { label: "Botanical Card", to: "/", hash: "card" },
  { label: "Materials", to: "/", hash: "materials" },
  { label: "Botanical Archive", to: "/archive" },
  { label: "Order", to: "/order" },
  { label: "Contact", to: "/contact" },
];

const index = [
  { no: "I", label: "Entrance", hash: "hero" },
  { no: "II", label: "Objects shape the spaces", hash: "manifesto" },
  { no: "III", label: "Object No.07 — Dome Lamp", hash: "object" },
  { no: "IV", label: "Queen Anne's Lace", hash: "card" },
  { no: "V", label: "Material before product", hash: "materials" },
  { no: "VI", label: "Botanical Archive", hash: "archive" },
  { no: "VII", label: "Bring it home", hash: "order" },
];

function EyeIcon() {
  return (
    <svg width="34" height="20" viewBox="0 0 34 20" fill="none" aria-hidden="true">
      <path
        d="M1 10C1 10 7 2 17 2C27 2 33 10 33 10C33 10 27 18 17 18C7 18 1 10 1 10Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="17" cy="10" r="3.4" fill="currentColor" />
    </svg>
  );
}

export function SiteNav() {
  const tone = useNavTone();
  const [menuOpen, setMenuOpen] = useState(false);
  const [indexOpen, setIndexOpen] = useState(false);
  const router = useRouter();
  const open = menuOpen || indexOpen;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goToSection = (hash: string) => {
    setMenuOpen(false);
    setIndexOpen(false);
    const scroll = () =>
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (router.state.location.pathname !== "/") {
      router.navigate({ to: "/" }).then(() => setTimeout(scroll, 120));
    } else {
      setTimeout(scroll, 60);
    }
  };

  const iconTone = open ? "text-bone" : tone === "dark" ? "text-ink" : "text-bone";

  return (
    <>
      <header
        data-nav-root
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 mix-blend-normal transition-colors duration-500 sm:px-8 ${iconTone}`}
      >
        <button
          type="button"
          aria-label="Open exhibition index"
          aria-expanded={indexOpen}
          onClick={() => {
            setMenuOpen(false);
            setIndexOpen((v) => !v);
          }}
          className="pointer-events-auto -m-2 p-2 transition-opacity duration-300 hover:opacity-60"
        >
          <EyeIcon />
        </button>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => {
            setIndexOpen(false);
            setMenuOpen((v) => !v);
          }}
          className="pointer-events-auto -m-2 flex h-9 w-9 flex-col items-end justify-center gap-[7px] p-2"
        >
          <span
            className={`block h-px w-7 bg-current transition-transform duration-400 ${
              menuOpen ? "translate-y-[4px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-7 bg-current transition-transform duration-400 ${
              menuOpen ? "-translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </button>
      </header>

      {/* Burger menu overlay */}
      <div
        className={`fixed inset-0 z-40 bg-ink text-ink-foreground transition-opacity duration-500 ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex h-full flex-col justify-center px-7 sm:px-10">
          <p className="caps mb-10 opacity-50">Menu</p>
          <ul className="space-y-5">
            {menu.map((item) =>
              item.hash ? (
                <li key={item.label}>
                  <button
                    type="button"
                    onClick={() => goToSection(item.hash!)}
                    className="font-display text-4xl font-light transition-opacity duration-300 hover:opacity-55 sm:text-5xl"
                  >
                    {item.label}
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="font-display text-4xl font-light transition-opacity duration-300 hover:opacity-55 sm:text-5xl"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <div className="caps mt-14 flex gap-8 opacity-50">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <span>© ObjektHaus 2024</span>
          </div>
        </nav>
      </div>

      {/* Eye — exhibition index overlay */}
      <div
        className={`fixed inset-0 z-40 bg-olive text-olive-foreground transition-opacity duration-500 ${
          indexOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-center px-7 sm:px-10">
          <p className="caps mb-10 opacity-50">Exhibition Index</p>
          <ul className="divide-y divide-current/15">
            {index.map((item) => (
              <li key={item.no}>
                <button
                  type="button"
                  onClick={() => goToSection(item.hash)}
                  className="flex w-full items-baseline gap-5 py-4 text-left transition-opacity duration-300 hover:opacity-60"
                >
                  <span className="caps w-8 shrink-0 opacity-55">{item.no}</span>
                  <span className="font-display text-2xl font-light sm:text-3xl">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}