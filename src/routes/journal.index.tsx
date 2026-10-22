import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { useJournal, type JournalPost } from "@/lib/journal";

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

const ink = "border-[3px] border-ink";
const pop = (c = "soot") => `shadow-[6px_6px_0_var(--color-${c})]`;
const halftone = { backgroundImage: "radial-gradient(var(--color-ink) 1px, transparent 1.4px)", backgroundSize: "8px 8px" };
const hatch = { backgroundImage: "repeating-linear-gradient(45deg, var(--color-ink) 0 1px, transparent 1px 7px)" };
const mins = (p: JournalPost) => Math.max(1, Math.round((p.body || "").split(/\s+/).length / 200));
const vol = (i: number) => `Vol. ${String(i + 1).padStart(2, "0")}`;
const tear = { clipPath: "polygon(0 30%,4% 0,9% 40%,14% 10%,20% 45%,26% 5%,33% 35%,40% 0,47% 40%,54% 8%,61% 42%,68% 2%,75% 38%,82% 6%,89% 44%,95% 12%,100% 35%,100% 100%,0 100%)" };

function PostLink({ p, className, children }: { p: JournalPost; className?: string; children: React.ReactNode }) {
  return <Link to="/journal/$slug" params={{ slug: p.slug }} className={className}>{children}</Link>;
}

function Journal() {
  const posts = useJournal();
  const [cat, setCat] = useState("All");
  const [reel, setReel] = useState("All");
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));
  const filtered = posts.filter((p) => cat === "All" || p.category === cat);
  const covers = posts.map((p) => p.cover).filter(Boolean);
  const reelPosts = posts.filter((p) => reel === "All" || p.category === reel);

  return (
    <main data-tone="dark" className="min-h-screen overflow-x-clip bg-bone text-ink">
      <SiteNav />

      {/* 1. Top bar */}
      <header className={`mx-4 mt-24 flex flex-wrap items-center gap-4 ${ink} bg-bone p-3 ${pop()} sm:mx-8`}>
        <span className={`grid h-11 w-11 place-items-center ${ink} bg-olive font-black text-olive-foreground`}>OH</span>
        <div className="mr-auto leading-none">
          <p className="font-sans text-lg font-black uppercase">The Journal</p>
          <p className="font-mono text-[10px] uppercase opacity-70">ObjektHaus studio notes · Dhaka</p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {["All", ...cats].slice(0, 5).map((c) => (
            <button key={c} type="button" onClick={() => setCat(c)} className={`${ink} rounded-full px-3 py-1 font-mono text-xs font-bold uppercase ${cat === c ? "bg-clay text-clay-foreground" : "bg-bone hover:bg-ink hover:text-bone"}`}>{c}</button>
          ))}
        </nav>
      </header>

      {!featured ? (
        <p className="px-8 py-32 text-center font-mono uppercase">The first notes from the studio are on their way.</p>
      ) : (
        <>
          {/* 2. Split hero */}
          <section className="grid items-center gap-10 px-4 py-16 sm:px-8 lg:grid-cols-2">
            <div className="relative">
              <span className="absolute -left-2 -top-10 grid h-24 w-24 rotate-12 place-items-center bg-olive font-black uppercase text-bone" style={{ clipPath: "polygon(50% 0,61% 20%,83% 9%,80% 32%,100% 40%,84% 56%,96% 77%,72% 78%,64% 100%,50% 84%,36% 100%,28% 78%,4% 77%,16% 56%,0 40%,20% 32%,17% 9%,39% 20%)" }}>New</span>
              <p className="font-mono text-xs uppercase opacity-70">{featured.category} · {featured.date}</p>
              <h1 className="mt-3 font-sans text-6xl font-black uppercase leading-[0.82] tracking-tight sm:text-8xl" style={{ textShadow: "4px 3px 0 var(--color-cobalt), -3px -2px 0 var(--color-vermillion)" }}>
                {featured.title}
              </h1>
              <p className="mt-6 max-w-md opacity-80">{featured.excerpt}</p>
              <PostLink p={featured} className={`mt-8 inline-flex items-center gap-3 ${ink} bg-ink px-5 py-3 font-mono text-xs font-bold uppercase text-bone ${pop("olive")} transition hover:-translate-y-1`}>Read the note → <span className="opacity-60">読む</span></PostLink>
            </div>
            <div className="grid grid-cols-6 gap-1.5 [perspective:900px]" aria-hidden="true">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className={`aspect-square border-2 border-ink bg-cover bg-center grayscale transition duration-700 hover:grayscale-0 ${i % 5 === 0 ? "bg-clay" : i % 7 === 0 ? "bg-olive" : "bg-bone"}`}
                  style={{ backgroundImage: covers.length ? `url(${covers[i % covers.length]})` : undefined, transform: `rotateY(${(i % 6 - 2.5) * 6}deg) rotateX(${(Math.floor(i / 6) - 1) * 8}deg)`, ...(covers.length ? {} : halftone) }} />
              ))}
            </div>
          </section>

          {/* Publication rail */}
          <div className="overflow-hidden border-y-[3px] border-ink bg-ink py-3 text-bone">
            <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-10 font-mono text-sm font-bold uppercase">
              {[...posts, ...posts, ...posts].map((p, i) => <span key={i}>{vol(i % posts.length)} · {p.title} ✦</span>)}
            </div>
          </div>

          {/* 3. Latest reading */}
          <section className="grid gap-10 px-4 py-20 sm:px-8 lg:grid-cols-[1fr_2fr]">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-sans text-5xl font-black uppercase leading-none">Keep<br />Reading</h2>
              <p className="mt-4 font-mono text-sm uppercase">{filtered.length} notes · {Math.round(filtered.reduce((a, p) => a + mins(p), 0) / Math.max(1, filtered.length))} min avg read</p>
            </div>
            <div className="flex snap-x gap-6 overflow-x-auto pb-6">
              {filtered.map((p, i) => (
                <PostLink key={p.slug} p={p} className={`w-72 shrink-0 snap-start ${ink} bg-bone ${pop(i % 2 ? "vermillion" : "cobalt")} transition hover:-translate-y-1`}>
                  {p.cover ? <img src={p.cover} alt={p.title} loading="lazy" className="aspect-[4/3] w-full border-b-[3px] border-ink object-cover" /> : <div className="aspect-[4/3] border-b-[3px] border-ink" style={halftone} />}
                  <div className="p-4">
                    <p className="font-mono text-[11px] uppercase opacity-70">{vol(posts.indexOf(p))} · {p.category}</p>
                    <h3 className="mt-1 font-sans text-xl font-black uppercase leading-tight">{p.title}</h3>
                    <div className="mt-3 h-2 border-2 border-ink"><div className="h-full bg-clay" style={{ width: `${Math.min(100, mins(p) * 10)}%` }} /></div>
                    <p className="mt-2 font-mono text-[11px] uppercase">{mins(p)} min read →</p>
                  </div>
                </PostLink>
              ))}
            </div>
          </section>

          {/* 4. Six flavors bento */}
          <section className="px-4 py-20 sm:px-8">
            <h2 className="font-sans text-5xl font-black uppercase">Six Flavors</h2>
            <div className="mt-8 grid auto-rows-[180px] grid-cols-2 gap-4 lg:grid-cols-4">
              {posts.slice(0, 6).map((p, i) => (
                <PostLink key={p.slug} p={p} className={`group relative overflow-hidden ${ink} ${pop()} ${["col-span-2 row-span-2 bg-clay text-bone", "bg-olive text-olive-foreground", "bg-bone", "row-span-2 bg-bone", "bg-ink text-bone", "col-span-2 lg:col-span-1 bg-bone"][i]}`}>
                  <div className="absolute inset-0 opacity-20" style={i % 2 ? hatch : halftone} />
                  {p.cover && <img src={p.cover} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-90" />}
                  <div className="relative flex h-full flex-col justify-end p-5">
                    <p className="font-mono text-[11px] uppercase">{p.category}</p>
                    <h3 className="font-sans text-2xl font-black uppercase leading-none">{p.title}</h3>
                  </div>
                </PostLink>
              ))}
            </div>
          </section>

          {/* 5. The Shelf */}
          <section className="grid gap-10 bg-olive px-4 py-20 text-bone sm:px-8 lg:grid-cols-[1fr_2fr]" style={{ backgroundImage: "radial-gradient(rgb(255 255 255 / .12) 1px, transparent 1.4px)", backgroundSize: "10px 10px" }}>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <h2 className="font-sans text-5xl font-black uppercase">The Shelf</h2>
              <p className="mt-3 font-mono text-sm uppercase opacity-70">{posts.length} volumes in the archive</p>
            </div>
            <div className="flex h-80 items-end gap-2 overflow-x-auto border-b-8 border-bone pb-0 [perspective:800px]">
              {posts.slice(0, 12).map((p, i) => (
                <PostLink key={p.slug} p={p} className={`flex shrink-0 items-center justify-center border-2 border-ink px-2 transition duration-300 [writing-mode:vertical-rl] hover:-translate-y-4 hover:[transform:rotateY(-20deg)] ${["bg-olive", "bg-bone text-ink", "bg-clay", "bg-ink"][i % 4]}`}
                  style={{ height: `${70 + ((i * 37) % 30)}%`, width: `${44 + ((i * 13) % 20)}px` }}>
                  <span className="truncate font-sans text-sm font-black uppercase">{p.title}</span>
                </PostLink>
              ))}
            </div>
          </section>

          {/* 6. New volumes reel */}
          <section className="relative px-4 py-20 sm:px-8">
            <div className="absolute inset-x-0 top-0 h-6 bg-[#1b2440]" style={{ ...tear, transform: "scaleY(-1)" }} />
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-sans text-5xl font-black uppercase">New Volumes</h2>
              <div className="flex flex-wrap gap-2">
                {["All", ...cats].map((c) => (
                  <button key={c} type="button" onClick={() => setReel(c)} className={`${ink} px-3 py-1 font-mono text-xs font-bold uppercase ${reel === c ? "bg-olive text-bone" : "bg-bone"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-6">
              {reelPosts.map((p) => (
                <PostLink key={p.slug} p={p} className={`flex w-80 shrink-0 snap-start ${ink} bg-bone ${pop("olive")}`}>
                  <div className="grid w-24 place-items-center border-r-[3px] border-dashed border-ink bg-olive p-2 text-center font-mono text-bone">
                    <span className="text-xs font-bold uppercase">{p.date}</span>
                  </div>
                  <div className="p-4">
                    <p className="font-mono text-[11px] uppercase opacity-70">{vol(posts.indexOf(p))} · {p.category}</p>
                    <h3 className="mt-1 font-sans text-lg font-black uppercase leading-tight">{p.title}</h3>
                    <p className="mt-3 font-mono text-[11px] uppercase">Read →</p>
                  </div>
                </PostLink>
              ))}
            </div>
          </section>
        </>
      )}

      {/* 7. Footer */}
      <footer className="relative mt-10 bg-ink px-4 pb-10 pt-16 text-bone sm:px-8">
        <div className="absolute inset-x-0 -top-5 h-6 bg-ink" style={tear} />
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div><p className="font-sans text-3xl font-black uppercase">ObjektHaus</p><p className="mt-2 font-mono text-xs uppercase opacity-60">Handcrafted objects · Dhaka</p></div>
          <div className="font-mono text-xs uppercase"><p className="opacity-50">Directory</p><Link to="/archive" className="mt-2 block hover:text-olive-foreground">Botanical Archive</Link><Link to="/collaborate" className="block hover:text-olive-foreground">Got an idea?</Link><Link to="/contact" className="block hover:text-olive-foreground">Contact</Link></div>
          <div className="font-mono text-xs uppercase"><p className="opacity-50">Categories</p>{cats.map((c) => <p key={c} className="mt-1">{c}</p>)}</div>
          <div className="font-mono text-xs uppercase"><p className="opacity-50">Colophon</p><p className="mt-2 opacity-80">Printed in ink, olive & clay. {posts.length} notes so far.</p></div>
        </div>
      </footer>
    </main>
  );
}
