import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Reveal, RuleLine } from "@/components/Reveal";
import { flowers, getFlower, type Flower } from "@/lib/flowers";
import { AddToCart } from "@/components/AddToCart";
import { formatPrice } from "@/lib/cart";

export const Route = createFileRoute("/flower/$slug")({
  loader: ({ params }) => {
    const flower = getFlower(params.slug);
    if (!flower) throw notFound();
    return flower;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Floret"} — ObjektHaus` },
      {
        name: "description",
        content:
          loaderData?.represents ??
          "A plywood object from the ObjektHaus botanical archive.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Floret"} — ObjektHaus` },
      { property: "og:description", content: loaderData?.why ?? "" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlowerCard,
});

function FlowerCard() {
  const f = Route.useLoaderData() as Flower;
  const next = flowers[(flowers.findIndex((x) => x.slug === f.slug) + 1) % flowers.length];

  return (
    <main data-tone="dark" className="min-h-screen bg-sand text-sand-foreground">
      <SiteNav />

      <section className="mx-auto max-w-5xl px-7 pt-32 pb-14 sm:px-10 lg:pt-40">
        <p className="caps rise opacity-55">Floret No. {f.no}</p>
        <h1 className="rise mt-4 font-display text-5xl leading-[1.05] font-light sm:text-6xl">
          {f.name}
        </h1>
        <p className="mt-3 text-sm italic opacity-60">{f.latin}</p>
        <RuleLine className="mt-6" />
        <p className="caps mt-6 opacity-60">{f.product}</p>
        <p className="mt-2 text-sm opacity-60">
          {f.edition} — {formatPrice(f.price)}
        </p>
      </section>

      {/* Swipeable product images */}
      <section className="pb-4">
        <div className="mx-auto flex max-w-6xl snap-x snap-mandatory gap-4 overflow-x-auto px-7 pb-4 sm:px-10">
          {f.images.map((img) => (
            <div
              key={img.src}
              className="image-veil w-[78%] shrink-0 snap-center overflow-hidden rounded-xl sm:w-[52%]"
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                width={900}
                height={1100}
                className="h-[58svh] w-full object-cover"
              />
            </div>
          ))}
        </div>
        <p className="caps mx-auto max-w-6xl px-7 opacity-45 sm:px-10">Swipe — {f.images.length} views</p>
      </section>

      <section className="mx-auto max-w-5xl space-y-12 px-7 py-14 sm:px-10">
        <Reveal>
          <p className="caps opacity-55">The representing flower card</p>
          <RuleLine className="mt-3" />
          <div className="mt-6 flex flex-col items-center border border-current/20 p-8 text-center">
            <img
              src={f.card}
              alt={`Botanical archive card engraving of ${f.name}`}
              loading="lazy"
              width={1024}
              height={1200}
              className="drift w-44 opacity-85 mix-blend-multiply dark:mix-blend-normal"
            />
            <p className="caps mt-6 opacity-55">Floret No. {f.no}</p>
            <p className="mt-2 font-display text-2xl font-light">{f.name}</p>
            <p className="mt-1 text-sm italic opacity-60">{f.latin}</p>
            <p className="mt-4 max-w-sm text-sm opacity-70">
              A letterpressed archive card of {f.name}, numbered and slipped into every{" "}
              {f.product.split("—")[1]?.trim() ?? "object"} we ship.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <p className="caps opacity-55">What it represents</p>
          <RuleLine className="mt-3" />
          <p className="mt-4 text-[1rem] leading-relaxed opacity-85">{f.represents}</p>
        </Reveal>
        <Reveal delay={80}>
          <p className="caps opacity-55">Why this flower</p>
          <RuleLine className="mt-3" />
          <p className="mt-4 text-[1rem] leading-relaxed opacity-85">{f.why}</p>
        </Reveal>
        <Reveal delay={160}>
          <p className="caps opacity-55">The story</p>
          <RuleLine className="mt-3" />
          <p className="mt-4 text-[1rem] leading-relaxed opacity-85">{f.story}</p>
        </Reveal>

        <Reveal delay={200} className="flex justify-end pt-4">
          <AddToCart flower={f} className="justify-end" />
        </Reveal>

        <div className="flex items-center justify-between border-t border-current/15 pt-8">
          <Link to="/archive" className="caps link-underline">
            Archive
          </Link>
          <Link to="/flower/$slug" params={{ slug: next.slug }} className="caps link-underline">
            Next — {next.name}
          </Link>
        </div>
      </section>
    </main>
  );
}
