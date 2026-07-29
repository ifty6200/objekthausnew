import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SocialLinks } from "@/components/Social";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact the Studio — ObjektHaus" },
      {
        name: "description",
        content:
          "Write to the ObjektHaus studio about commissions, editions, press or a visit to the workshop.",
      },
      { property: "og:title", content: "Contact the Studio — ObjektHaus" },
      { property: "og:description", content: "Commissions, editions, press and studio visits." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);

  return (
    <main data-tone="dark" className="min-h-screen bg-sand text-sand-foreground">
      <SiteNav />

      <section className="px-7 pt-32 pb-20 sm:px-10">
        <p className="caps opacity-55">Studio</p>
        <h1 className="mt-4 font-display text-5xl font-light sm:text-6xl">Contact</h1>
        <span className="rule-line mt-6" />

        <div className="mt-10 space-y-2 text-[0.95rem] opacity-80">
          <p>ObjektHaus Werkstatt</p>
          <p>Gärtnerstraße 14, 10245 Berlin</p>
          <p>Thursday – Saturday, by appointment</p>
          <p className="pt-4">studio@objekthaus.com</p>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <span className="caps opacity-55">Elsewhere</span>
          <SocialLinks className="opacity-80" size={20} />
        </div>

        {sent ? (
          <p className="mt-14 font-display text-2xl font-light">
            Your message has been received. We answer slowly, but we answer.
          </p>
        ) : (
          <form
            className="mt-14 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="block">
              <span className="caps opacity-55">Name</span>
              <input
                required
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
            <label className="block">
              <span className="caps opacity-55">Email</span>
              <input
                required
                type="email"
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
            <label className="block">
              <span className="caps opacity-55">Message</span>
              <textarea
                required
                rows={4}
                className="mt-2 w-full resize-none border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
            <button type="submit" className="link-underline caps mt-4">
              Send
            </button>
          </form>
        )}

        <div className="mt-20 flex justify-between">
          <Link to="/" className="caps link-underline">
            Exhibition
          </Link>
          <Link to="/order" className="caps link-underline">
            Order
          </Link>
        </div>
      </section>
    </main>
  );
}
