import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import archiveDark from "@/assets/archive-dark.jpg";
import botanicalLace from "@/assets/botanical-lace.jpg";

export const Route = createFileRoute("/archive")({
  head: () => ({
    meta: [
      { title: "Botanical Archive — ObjektHaus" },
      {
        name: "description",
        content:
          "The flowers behind each ObjektHaus object: Queen Anne's Lace, Cow Parsley, Yarrow and more, with the archive card that ships with every piece.",
      },
      { property: "og:title", content: "Botanical Archive — ObjektHaus" },
      {
        property: "og:description",
        content: "Explore the flowers behind each object and their stories.",
      },
    ],
  }),
  component: Archive,
});

const entries = [
  { no: "041", name: "Queen Anne's Lace", latin: "Daucus carota", note: "Discovered, never announced." },
  { no: "042", name: "Cow Parsley", latin: "Anthriscus sylvestris", note: "Roadside architecture." },
  { no: "043", name: "Yarrow", latin: "Achillea millefolium", note: "Patient, fine-leaved, durable." },
  { no: "044", name: "Male Fern", latin: "Dryopteris filix-mas", note: "Unfurls before it stands." },
  { no: "045", name: "Hogweed", latin: "Heracleum sphondylium", note: "Scale without ceremony." },
];

function Archive() {
  return (
    <main data-tone="light" className="min-h-screen bg-ink text-ink-foreground">
      <SiteNav />

      <header className="relative flex min-h-[70svh] flex-col justify-end overflow-hidden px-7 pb-12 sm:px-10">
        <img
          src={archiveDark}
          alt="Herbarium plate of botanical engravings"
          width={1024}
          height={1408}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="relative">
          <p className="caps opacity-55">Plate No. XXXII</p>
          <h1 className="mt-4 font-display text-5xl font-light sm:text-6xl">
            Botanical
            <br />
            Archive
          </h1>
          <span className="rule-line mt-6" />
        </div>
      </header>

      <section className="px-7 py-16 sm:px-10">
        <ul className="divide-y divide-current/15">
          {entries.map((e) => (
            <li key={e.no} className="py-7">
              <div className="flex items-baseline gap-5">
                <span className="caps w-12 shrink-0 opacity-50">{e.no}</span>
                <div>
                  <h2 className="font-display text-3xl font-light">{e.name}</h2>
                  <p className="mt-1 text-sm italic opacity-60">{e.latin}</p>
                  <p className="mt-3 text-[0.95rem] opacity-80">{e.note}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-7 pb-24 sm:px-10">
        <div className="border border-current/20 p-8 text-center">
          <img
            src={botanicalLace}
            alt="Archive card engraving of Queen Anne's Lace"
            loading="lazy"
            width={1024}
            height={1200}
            className="mx-auto w-40 opacity-80 invert"
          />
          <p className="caps mt-6 opacity-60">Included with every object</p>
          <p className="mt-3 font-display text-2xl font-light">The botanical archive card</p>
          <Link to="/order" className="link-underline caps mt-8 inline-block">
            Order an object
          </Link>
        </div>
      </section>
    </main>
  );
}
