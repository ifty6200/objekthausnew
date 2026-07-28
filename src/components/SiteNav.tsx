import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useNavTone } from "./use-nav-tone";
import { SocialLinks } from "./Social";

const items = [
  { no: "I", label: "Object No.07 — Dome Lamp", hash: "object" },
  { no: "II", label: "Queen Anne's Lace", hash: "card" },
  { no: "III", label: "Botanical Archive", to: "/archive" },
  { no: "IV", label: "Contact", to: "/contact" },
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
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const goToSection = (hash: string) => {
    setOpen(false);
    const scroll = () =>
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    if (router.state.location.pathname !== "/") {
      router.navigate({ to: "/" }).then(() => setTimeout(scroll, 160));
    } else {
      setTimeout(scroll, 80);
    }
  };

  const iconTone = open ? "text-olive-foreground" : tone === "dark" ? "text-ink" : "text-bone";

  return (
    <>
      <header
        data-nav-root
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-colors duration-500 sm:px-8 ${iconTone}`}
      >
        <Link
          to="/"
          aria-label="Back to the exhibition entrance"
          onClick={() => setOpen(false)}
          className="pointer-events-auto -m-2 p-2 transition-all duration-500 hover:opacity-60"
        >
          <EyeIcon />
        </Link>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="pointer-events-auto -m-2 flex h-9 w-9 flex-col items-end justify-center gap-[7px] p-2"
        >
          <span
            className={`block h-px bg-current transition-all duration-500 ${
              open ? "w-7 translate-y-[4px] rotate-45" : "w-7"
            }`}
          />
          <span
            className={`block h-px bg-current transition-all duration-500 ${
              open ? "w-7 -translate-y-[4px] -rotate-45" : "w-4"
            }`}
          />
        </button>
      </header>

      {/* Minimal index overlay */}
      <div
        className={`fixed inset-0 z-40 bg-olive text-olive-foreground transition-opacity duration-700 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-center px-7 sm:px-10">
          <p
            className={`caps mb-12 opacity-50 transition-all duration-700 ${
              open ? "translate-y-0 opacity-50" : "translate-y-2 opacity-0"
            }`}
          >
            Index
          </p>
          <ul>
            {items.map((item, i) => (
              <li key={item.label}>
                {item.hash ? (
                  <button
                    type="button"
                    onClick={() => goToSection(item.hash!)}
                    style={{ transitionDelay: open ? `${120 + i * 90}ms` : "0ms" }}
                    className={`group flex w-full items-baseline gap-5 py-4 text-left transition-all duration-700 hover:opacity-60 ${
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                  >
                    <span className="caps w-7 shrink-0 opacity-45">{item.no}</span>
                    <span className="font-display text-2xl font-light sm:text-3xl">
                      {item.label}
                    </span>
                  </button>
                ) : (
                  <Link
                    to={item.to!}
                    onClick={() => setOpen(false)}
                    style={{ transitionDelay: open ? `${120 + i * 90}ms` : "0ms" }}
                    className={`group flex w-full items-baseline gap-5 py-4 text-left transition-all duration-700 hover:opacity-60 ${
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                  >
                    <span className="caps w-7 shrink-0 opacity-45">{item.no}</span>
                    <span className="font-display text-2xl font-light sm:text-3xl">
                      {item.label}
                    </span>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          <div
            style={{ transitionDelay: open ? "520ms" : "0ms" }}
            className={`mt-14 flex items-center gap-6 transition-all duration-700 ${
              open ? "translate-y-0 opacity-70" : "translate-y-3 opacity-0"
            }`}
          >
            <SocialLinks />
            <span className="h-px w-10 bg-current opacity-40" />
            <span className="caps opacity-70">© ObjektHaus 2024</span>
          </div>
        </div>
      </div>
    </>
  );
}
