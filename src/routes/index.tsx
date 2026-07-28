import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import heroMeadow from "@/assets/hero-meadow.jpg";
import objectLamp from "@/assets/object-lamp.jpg";
import botanicalLace from "@/assets/botanical-lace.jpg";
import craftWood from "@/assets/craft-wood.jpg";
import archiveDark from "@/assets/archive-dark.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ObjektHaus — A Quiet Exhibition of Objects" },
      {
        name: "description",
        content:
          "Scroll through the ObjektHaus exhibition: Object No.07, its botanical archive card, the materials behind it and the flowers that name it.",
      },
      { property: "og:title", content: "ObjektHaus — A Quiet Exhibition of Objects" },
      {
        property: "og:description",
        content: "Objects shape the spaces we inhabit. Enter the exhibition.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-bone">
      <SiteNav />

      {/* I — Entrance */}
      <section id="hero" data-tone="light" className="panel justify-end bg-ink text-bone">
        <img
          src={heroMeadow}
          alt="Sunrise over a misty meadow of daisies and poppies"
          width={1024}
          height={1536}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/45" />
        <h1 className="rise absolute inset-0 flex items-center justify-center font-display text-5xl font-light tracking-[0.02em] text-bone drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:text-6xl">
          ObjektHaus
        </h1>
        <div className="relative flex flex-col items-center gap-5 text-bone">
          <p className="caps drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">Scroll to enter exhibition</p>
          <span className="h-14 w-px bg-current opacity-60" />
        </div>
      </section>

      {/* II — Manifesto */}
      <section
        id="manifesto"
        data-tone="light"
        className="panel bg-olive text-olive-foreground"
      >
        <div className="space-y-9 font-display text-[2.1rem] leading-[1.15] font-light sm:text-5xl">
          <p>
            Objects shape
            <br />
            the spaces
            <br />
            we inhabit.
          </p>
          <span className="rule-line" />
          <p>
            Spaces shape
            <br />
            the moments
            <br />
            we remember.
          </p>
          <span className="rule-line" />
          <p>
            We create
            <br />
            objects that
            <br />
            invite you
            <br />
            to notice.
          </p>
        </div>
        <div className="mt-16 flex flex-col items-center gap-3">
          <p className="caps opacity-60">Scroll</p>
          <span className="rule-line" />
        </div>
      </section>

      {/* III — Object No.07 */}
      <section id="object" data-tone="dark" className="panel bg-clay text-clay-foreground">
        <img
          src={objectLamp}
          alt="ObjektHaus Object No.07, a speckled ceramic dome table lamp"
          loading="lazy"
          width={1024}
          height={1408}
          className="mx-auto w-full max-w-md object-contain"
        />
        <div className="mt-10">
          <h2 className="font-display text-4xl font-light sm:text-5xl">Object No.07</h2>
          <p className="mt-3 text-sm tracking-wide opacity-70">Edition 041 / 101</p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="rule-line" />
          </div>
        </div>
      </section>

      {/* IV — Botanical card */}
      <section id="card" data-tone="dark" className="panel bg-sand text-sand-foreground">
        <img
          src={botanicalLace}
          alt="Ink engraving of a Queen Anne's Lace flower"
          loading="lazy"
          width={1024}
          height={1200}
          className="mx-auto w-full max-w-xs mix-blend-multiply"
        />
        <h2 className="mt-8 font-display text-4xl font-light sm:text-5xl">Queen Anne&apos;s Lace</h2>
        <span className="rule-line mt-5" />
        <div className="mt-7 space-y-6 text-[0.95rem] leading-relaxed opacity-85">
          <p>
            Queen Anne&apos;s Lace grows quietly.
            <br />
            Its beauty is discovered,
            <br />
            never announced.
          </p>
          <p>
            Like this object,
            <br />
            it rewards attention.
          </p>
          <p>
            Every ObjektHaus purchase
            <br />
            includes a botanical archive card.
          </p>
        </div>
        <div className="mt-12 flex justify-center">
          <span className="rule-line" />
        </div>
      </section>

      {/* V — Materials */}
      <section id="materials" data-tone="dark" className="panel bg-bone text-bone-foreground">
        <h2 className="font-display text-[2.1rem] leading-[1.15] font-light sm:text-5xl">
          Every object
          <br />
          begins as
          <br />
          a material,
          <br />
          not a product.
        </h2>
        <span className="rule-line mt-8" />
        <img
          src={craftWood}
          alt="A craftsman planing an oak beam, shavings curling away"
          loading="lazy"
          width={1200}
          height={800}
          className="mt-10 w-full rounded-xl object-cover"
        />
        <ul className="mt-10 space-y-4 text-lg font-light tracking-wide opacity-70">
          {["Wood", "Brass", "Stone", "Linen", "Paper"].map((m) => (
            <li key={m}>{m}</li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <span className="rule-line" />
        </div>
        <div className="mt-12 flex justify-end">
          <Link to="/archive" className="caps link-underline">
            Explore
          </Link>
        </div>
      </section>

      {/* VI — Botanical archive */}
      <section id="archive" data-tone="light" className="panel justify-end bg-ink text-ink-foreground">
        <img
          src={archiveDark}
          alt="Herbarium plate of pale botanical engravings on a dark ground"
          loading="lazy"
          width={1024}
          height={1408}
          className="absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative">
          <h2 className="font-display text-4xl font-light sm:text-5xl">
            Botanical
            <br />
            Archive
          </h2>
          <span className="rule-line mt-5" />
          <p className="mt-5 text-[0.95rem] leading-relaxed opacity-80">
            Explore the flowers behind
            <br />
            each object and their stories.
          </p>
          <Link to="/archive" className="link-underline mt-8 inline-block text-lg font-light">
            Enter Archive
          </Link>
        </div>
      </section>

      {/* VII — Bring it home */}
      <section id="order" data-tone="dark" className="panel bg-clay text-clay-foreground">
        <h2 className="font-display text-[2.6rem] leading-[1.05] font-light sm:text-6xl">
          Bring it
          <br />
          home
        </h2>
        <div className="mt-12 flex flex-col items-start gap-8">
          <Link to="/order" className="link-underline font-display text-3xl font-light">
            Order
          </Link>
          <Link to="/contact" className="link-underline font-display text-3xl font-light">
            Contact
          </Link>
        </div>
        <div className="mt-20 flex justify-center">
          <span className="rule-line" />
        </div>
        <footer className="mt-10">
          <div className="caps flex items-center justify-between opacity-70">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          <p className="caps mt-6 text-center opacity-55">© ObjektHaus 2024</p>
        </footer>
      </section>
    </main>
  );
}
