import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { useJournal } from "@/lib/journal";

export const Route = createFileRoute("/journal/")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://objekthausstudio.lovable.app/journal" }],
    meta: [
      { title: "The Journal — ObjektHaus Studio Notes" },
      { name: "description", content: "Studio notes from ObjektHaus in Dhaka: our cause, object improvements, materials and the making of handcrafted plywood objects." },
      { property: "og:url", content: "https://objekthausstudio.lovable.app/journal" },
      { property: "og:title", content: "The Journal — ObjektHaus Studio Notes" },
      { property: "og:description", content: "Our cause, improvements and notes from the ObjektHaus studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Journal,
});

function Journal() {
  const posts = useJournal();
  const [cat, setCat] = useState("All");
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const cats = ["All", ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))];
  const rest = posts.filter((p) => p !== featured && (cat === "All" || p.category === cat));

  return (
    <main data-tone="dark" className="min-h-screen bg-bone text-soot">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-7 pt-32 pb-24 sm:px-10 lg:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b-4 border-soot pb-6">
          <h1 className="font-sans text-6xl font-black uppercase leading-[0.85] tracking-tight sm:text-8xl">
            The<br /><span className="text-cobalt">Journal</span>
          </h1>
          <span className="-rotate-3 border-2 border-soot bg-vermillion px-3 py-1 font-mono text-xs font-bold uppercase text-bone shadow-[4px_4px_0_var(--color-soot)]">Studio notes · Dhaka</span>
        </div>

        {!featured ? (
          <p className="mt-12 font-mono uppercase">The first notes from the studio are on their way.</p>
        ) : (
          <>
            <Link to="/journal/$slug" params={{ slug: featured.slug }} className="group mt-12 grid border-4 border-soot bg-bone shadow-[10px_10px_0_var(--color-cobalt)] transition-transform hover:-translate-x-1 hover:-translate-y-1 lg:grid-cols-2">
              {featured.cover && <img src={featured.cover} alt={featured.title} fetchPriority="high" className="aspect-[4/3] h-full w-full border-b-4 border-soot object-cover grayscale contrast-125 transition group-hover:grayscale-0 lg:border-b-0 lg:border-r-4" />}
              <div className="flex flex-col justify-between gap-6 p-7">
                <div>
                  <span className="inline-block border-2 border-soot bg-vermillion px-2 py-0.5 font-mono text-xs font-bold uppercase text-bone">Featured · {featured.category}</span>
                  <h2 className="mt-5 font-sans text-4xl font-black uppercase leading-none sm:text-5xl">{featured.title}</h2>
                  <p className="mt-4 opacity-80">{featured.excerpt}</p>
                </div>
                <div className="flex items-center justify-between font-mono text-xs uppercase">
                  <span>{featured.date}</span>
                  <span className="border-2 border-soot bg-soot px-3 py-1 text-bone">Read →</span>
                </div>
              </div>
            </Link>

            {posts.length > 1 && (
              <div className="mt-24">
                <h2 className="font-sans text-3xl font-black uppercase">Explore more</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {cats.map((c) => (
                    <button key={c} type="button" onClick={() => setCat(c)} className={`border-2 border-soot px-3 py-1 font-mono text-xs font-bold uppercase transition ${cat === c ? "bg-cobalt text-bone shadow-[3px_3px_0_var(--color-soot)]" : "bg-bone hover:bg-soot hover:text-bone"}`}>{c}</button>
                  ))}
                </div>
                <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p, i) => (
                    <li key={p.slug}>
                      <Link to="/journal/$slug" params={{ slug: p.slug }} className={`group block border-4 border-soot bg-bone transition-transform hover:-translate-y-1 ${i % 2 ? "shadow-[6px_6px_0_var(--color-vermillion)]" : "shadow-[6px_6px_0_var(--color-cobalt)]"}`}>
                        {p.cover && <img src={p.cover} alt={p.title} loading="lazy" className="aspect-[4/3] w-full border-b-4 border-soot object-cover grayscale transition group-hover:grayscale-0" />}
                        <div className="p-5">
                          <p className="font-mono text-xs uppercase opacity-70">{p.category} · {p.date}</p>
                          <h3 className="mt-2 font-sans text-2xl font-black uppercase leading-tight">{p.title}</h3>
                          <p className="mt-2 text-sm opacity-75">{p.excerpt}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
