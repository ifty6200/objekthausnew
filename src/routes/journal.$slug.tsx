import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { useJournal } from "@/lib/journal";

export const Route = createFileRoute("/journal/$slug")({
  head: ({ params }) => ({
    links: [{ rel: "canonical", href: `https://objekthausstudio.lovable.app/journal/${params.slug}` }],
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — ObjektHaus Journal` },
      { name: "description", content: "A studio note from the ObjektHaus Journal — handcrafted plywood objects made in Dhaka." },
      { property: "og:url", content: `https://objekthausstudio.lovable.app/journal/${params.slug}` },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — ObjektHaus Journal` },
      { property: "og:description", content: "A studio note from the ObjektHaus Journal." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Post,
});

function Post() {
  const { slug } = Route.useParams();
  const posts = useJournal();
  const i = posts.findIndex((p) => p.slug === slug);
  const post = posts[i];
  const next = posts[i + 1];

  return (
    <main data-tone="dark" className="min-h-screen bg-bone text-ink">
      <SiteNav />
      <article className="mx-auto max-w-3xl px-7 pt-32 pb-24 sm:px-10 lg:pt-40">
        {!post ? (
          <p className="font-mono uppercase">This note could not be found. <Link to="/journal" className="underline">Back to the Journal</Link></p>
        ) : (
          <>
            <span className="inline-block border-2 border-ink bg-olive px-2 py-0.5 font-mono text-xs font-bold uppercase text-olive-foreground">{post.category} · {post.date}</span>
            <h1 className="mt-5 border-b-4 border-ink pb-6 font-sans text-5xl font-black uppercase leading-[0.9] sm:text-7xl">{post.title}</h1>
            {post.cover && <img src={post.cover} alt={post.title} fetchPriority="high" className="mt-10 aspect-[4/3] w-full border-4 border-ink object-cover shadow-[10px_10px_0_var(--color-olive)]" />}
            <div className="mt-12 space-y-5 text-[1.05rem] leading-relaxed">
              {post.body.split(/\n{2,}/).map((para, k) =>
                para.startsWith("## ") ? (
                  <h2 key={k} className="pt-4 font-sans text-3xl font-black uppercase">{para.slice(3)}</h2>
                ) : para.startsWith("> ") ? (
                  <blockquote key={k} className="border-4 border-l-[12px] border-ink border-l-olive bg-bone p-5 font-sans text-2xl font-bold uppercase shadow-[6px_6px_0_var(--color-olive)]">{para.slice(2)}</blockquote>
                ) : (
                  <p key={k} className="whitespace-pre-line opacity-85">{para}</p>
                ),
              )}
            </div>
            <div className="mt-16 flex flex-wrap justify-between gap-6 border-t-4 border-ink pt-6 font-mono text-xs font-bold uppercase">
              <Link to="/journal" className="border-2 border-ink px-3 py-1 hover:bg-ink hover:text-bone">← All notes</Link>
              {next && <Link to="/journal/$slug" params={{ slug: next.slug }} className="border-2 border-ink bg-clay px-3 py-1 text-clay-foreground shadow-[3px_3px_0_var(--color-ink)]">{next.title} →</Link>}
            </div>
          </>
        )}
      </article>
    </main>
  );
}
