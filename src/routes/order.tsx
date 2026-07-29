import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { SocialLinks } from "@/components/Social";
import objectLamp from "@/assets/object-lamp.jpg";

export const Route = createFileRoute("/order")({
  head: () => ({
    meta: [
      { title: "Order Object No.07 — ObjektHaus" },
      {
        name: "description",
        content:
          "Reserve Object No.07, the speckled ceramic dome lamp from ObjektHaus. Edition of 101, each with its botanical archive card.",
      },
      { property: "og:title", content: "Order Object No.07 — ObjektHaus" },
      { property: "og:description", content: "Edition of 101. Reserve your object." },
    ],
  }),
  component: Order,
});

function Order() {
  const [sent, setSent] = useState(false);

  return (
    <main data-tone="dark" className="min-h-screen bg-clay text-clay-foreground">
      <SiteNav />

      <section className="px-7 pt-32 pb-20 sm:px-10">
        <p className="caps opacity-55">Edition 041 / 101</p>
        <h1 className="mt-4 font-display text-5xl font-light sm:text-6xl">Order</h1>
        <span className="rule-line mt-6" />

        <img
          src={objectLamp}
          alt="Object No.07, the ceramic dome lamp"
          loading="lazy"
          width={1024}
          height={1408}
          className="mx-auto mt-12 w-full max-w-sm object-contain"
        />

        <dl className="mt-12 divide-y divide-current/20 text-[0.95rem]">
          {[
            ["Object", "No.07 — Dome Lamp"],
            ["Materials", "Speckled stoneware, brass fitting"],
            ["Dimensions", "H 34 × Ø 26 cm"],
            ["Includes", "Botanical archive card"],
            ["Price", "€ 420"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-6 py-4">
              <dt className="caps opacity-55">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>

        {sent ? (
          <p className="mt-12 font-display text-2xl font-light">
            Thank you — we&apos;ll write to you about Object No.07.
          </p>
        ) : (
          <form
            className="mt-12 space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label className="block">
              <span className="caps opacity-55">Name</span>
              <input
                required
                name="name"
                autoComplete="name"
                maxLength={100}
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
            <label className="block">
              <span className="caps opacity-55">Phone number</span>
              <input
                required
                type="tel"
                name="phone"
                autoComplete="tel"
                maxLength={25}
                pattern="[0-9+()\-\s]{6,25}"
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
            <label className="block">
              <span className="caps opacity-55">Address</span>
              <textarea
                required
                name="address"
                rows={3}
                maxLength={300}
                autoComplete="street-address"
                className="mt-2 w-full resize-none border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
            <label className="block">
              <span className="caps opacity-55">Email (optional)</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                maxLength={255}
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
            <button type="submit" className="link-underline caps mt-4">
              Reserve this object
            </button>
          </form>
        )}

        <div className="mt-16 flex items-center gap-6">
          <span className="caps opacity-55">Or reach us</span>
          <SocialLinks className="opacity-80" size={20} />
        </div>

        <div className="mt-20 flex justify-between">
          <Link to="/" className="caps link-underline">
            Exhibition
          </Link>
          <Link to="/contact" className="caps link-underline">
            Contact
          </Link>
        </div>
      </section>
    </main>
  );
}
