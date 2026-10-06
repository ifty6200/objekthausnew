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
    <main data-tone="dark" className="min-h-screen bg-bone text-bone-foreground">
      <SiteNav />
      <section className="mx-auto max-w-6xl px-7 pt-32 pb-24 sm:px-10 lg:pt-40">
        <p className="caps opacity-55">Studio notes</p>
        <h1 className="mt-4 font-display text-5xl font-light sm:text-7xl">The Journal</h1>
        <span className="rule-line mt-6" />

        {!featured ? (
          <p className="mt-12 opacity-70">The first notes from the studio are on their way.</p>
        ) : (
          <>
            <Link to="/journal/$slug" params={{ slug: featured.slug }} className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-end">
              {featured.cover && <img src={featured.cover} alt={featured.title} fetchPriority="high" className="aspect-[4/3] w-full object-cover" />}
              <div>
                <p className="caps opacity-55">Featured · {featured.category} · {featured.date}</p>
                <h2 className="mt-4 font-display text-4xl font-light sm:text-5xl">{featured.title}</h2>
                <p className="mt-4 opacity-75">{featured.excerpt}</p>
                <span className="caps link-underline mt-6 inline-block">Read the note</span>
              </div>
            </Link>

            {posts.length > 1 && (
              <div className="mt-24">
                <h2 className="caps opacity-55">Explore more</h2>
                <div className="mt-4 flex flex-wrap gap-5">
                  {cats.map((c) => (
                    <button key={c} type="button" onClick={() => setCat(c)} className={`caps ${cat === c ? "" : "opacity-45"}`}>{c}</button>
                  ))}
                </div>
                <ul className="mt-8 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((p) => (
                    <li key={p.slug}>
                      <Link to="/journal/$slug" params={{ slug: p.slug }} className="block">
                        {p.cover && <img src={p.cover} alt={p.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />}
                        <p className="caps mt-4 opacity-55">{p.category} · {p.date}</p>
                        <h3 className="mt-2 font-display text-2xl font-light">{p.title}</h3>
                        <p className="mt-2 text-sm opacity-70">{p.excerpt}</p>
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
