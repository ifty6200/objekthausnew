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
    <main data-tone="dark" className="min-h-screen bg-bone text-bone-foreground">
      <SiteNav />
      <article className="mx-auto max-w-2xl px-7 pt-32 pb-24 sm:px-10 lg:pt-40">
        {!post ? (
          <p className="opacity-70">This note could not be found. <Link to="/journal" className="link-underline">Back to the Journal</Link></p>
        ) : (
          <>
            <p className="caps opacity-55">{post.category} · {post.date}</p>
            <h1 className="mt-4 font-display text-4xl font-light sm:text-6xl">{post.title}</h1>
            {post.cover && <img src={post.cover} alt={post.title} fetchPriority="high" className="mt-10 aspect-[4/3] w-full object-cover" />}
            <div className="mt-10 space-y-5 text-[1.05rem] leading-relaxed">
              {post.body.split(/\n{2,}/).map((para, k) =>
                para.startsWith("## ") ? (
                  <h2 key={k} className="pt-4 font-display text-3xl font-light">{para.slice(3)}</h2>
                ) : para.startsWith("> ") ? (
                  <blockquote key={k} className="border-l border-current/40 pl-5 font-display text-2xl font-light italic">{para.slice(2)}</blockquote>
                ) : (
                  <p key={k} className="whitespace-pre-line opacity-85">{para}</p>
                ),
              )}
            </div>
            <div className="mt-16 flex justify-between gap-6 border-t border-current/20 pt-6">
              <Link to="/journal" className="caps link-underline">All notes</Link>
              {next && <Link to="/journal/$slug" params={{ slug: next.slug }} className="caps link-underline">{next.title} →</Link>}
            </div>
          </>
        )}
      </article>
    </main>
  );
}
