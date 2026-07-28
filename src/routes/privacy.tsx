import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — ObjektHaus" },
      {
        name: "description",
        content: "How ObjektHaus handles the small amount of information you share with the studio.",
      },
      { property: "og:title", content: "Privacy — ObjektHaus" },
      { property: "og:description", content: "How the studio handles your information." },
    ],
  }),
  component: () => (
    <LegalPage
      title="Privacy"
      body={[
        "We collect only what an order or a message requires: your name, your email, and the address an object travels to.",
        "We do not sell or share this information. Analytics are aggregate and anonymous.",
        "Write to studio@objekthaus.com at any time to see, correct or delete what we hold.",
      ]}
    />
  ),
});

export function LegalPage({ title, body }: { title: string; body: string[] }) {
  return (
    <main data-tone="dark" className="min-h-screen bg-bone text-bone-foreground">
      <SiteNav />
      <section className="px-7 pt-32 pb-24 sm:px-10">
        <h1 className="font-display text-5xl font-light">{title}</h1>
        <span className="rule-line mt-6" />
        <div className="mt-10 max-w-prose space-y-6 text-[0.95rem] leading-relaxed opacity-80">
          {body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <Link to="/" className="caps link-underline mt-16 inline-block">
          Back to exhibition
        </Link>
      </section>
    </main>
  );
}
