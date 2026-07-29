import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Reveal, RuleLine } from "@/components/Reveal";
import { SocialLinks } from "@/components/Social";
import heroMeadow from "@/assets/hero-meadow.jpg";
import objectLamp from "@/assets/object-lamp.jpg";
import botanicalLace from "@/assets/botanical-lace.jpg";
import craftWood from "@/assets/craft-wood.jpg";
import craftVideo from "@/assets/craft-plane.mp4.asset.json";
import archiveDark from "@/assets/archive-dark.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ObjektHaus — A Quiet Exhibition of Objects" },
      {
        name: "description",
        content:
          "Scroll through the ObjektHaus exhibition: Object No.07, its botanical archive card, the materials behind it and the flowers that name each plywood object.",
      },
      { property: "og:title", content: "ObjektHaus — A Quiet Exhibition of Objects" },
      {
        property: "og:description",
        content: "Scroll through the ObjektHaus exhibition: Object No.07, its botanical archive card, the materials behind it and the flowers that name each plywood object.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Arrow() {
  return (
    <svg className="arrow" width="22" height="8" viewBox="0 0 22 8" fill="none" aria-hidden="true">
      <path d="M0 4h20M16.5 1L20 4l-3.5 3" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

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
          className="ken absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/45" />
        <h1 className="rise absolute inset-0 flex items-center justify-center font-display text-5xl font-light tracking-[0.02em] text-bone drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-8xl">
          ObjektHaus
        </h1>
        <div className="relative flex flex-col items-center gap-5 text-bone">
          <p className="caps drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">Scroll to enter exhibition</p>
          <span className="drift h-14 w-px bg-current opacity-60" />
        </div>
      </section>

      {/* II — Manifesto */}
      <section id="manifesto" data-tone="light" className="panel bg-olive text-olive-foreground">
        <div className="space-y-9 font-display text-[2.1rem] leading-[1.15] font-light sm:text-5xl lg:text-6xl">
          <Reveal as="p">
            Objects shape
            <br />
            the spaces
            <br />
            we inhabit.
          </Reveal>
          <RuleLine />
          <Reveal as="p" delay={100}>
            Spaces shape
            <br />
            the moments
            <br />
            we remember.
          </Reveal>
          <RuleLine delay={100} />
          <Reveal as="p" delay={200}>
            We create
            <br />
            objects that
            <br />
            invite you
            <br />
            to notice.
          </Reveal>
        </div>
        <div className="mt-16 flex flex-col items-center gap-3">
          <p className="caps opacity-60">Scroll</p>
          <span className="drift h-10 w-px bg-current opacity-45" />
        </div>
      </section>

      {/* III — Object No.07 */}
      <section id="object" data-tone="dark" className="panel bg-clay text-clay-foreground">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="image-veil mx-auto w-full max-w-md lg:max-w-none">
          <img
            src={objectLamp}
            alt="ObjektHaus Object No.07, a speckled ceramic dome table lamp"
            loading="lazy"
            width={1024}
            height={1408}
            className="mx-auto w-full object-contain lg:max-h-[68svh] lg:w-auto"
          />
        </Reveal>
        <div className="lg:pr-6">
        <Reveal className="mt-10 lg:mt-0" delay={120}>
          <h2 className="font-display text-4xl font-light sm:text-5xl lg:text-6xl">Object No.07</h2>
          <p className="mt-3 text-sm tracking-wide opacity-70">Edition 041 / 101</p>
        </Reveal>
        <RuleLine className="mt-8" />
        <div className="mt-14 flex justify-end">
          <Reveal delay={200}>
            <Link to="/order" className="corner-action caps">
              Bring it home <Arrow />
            </Link>
          </Reveal>
        </div>
        </div>
        </div>
      </section>

      {/* IV — Botanical card */}
      <section id="card" data-tone="dark" className="panel bg-sand text-sand-foreground">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="image-veil mx-auto w-full max-w-xs lg:max-w-sm">
          <img
            src={botanicalLace}
            alt="Ink engraving of a Queen Anne's Lace flower"
            loading="lazy"
            width={1024}
            height={1200}
            className="mx-auto w-full mix-blend-multiply lg:max-h-[62svh] lg:w-auto lg:object-contain"
          />
        </Reveal>
        <div className="lg:pr-6">
        <Reveal as="h2" className="mt-8 font-display text-4xl font-light sm:text-5xl lg:mt-0 lg:text-6xl">
          Queen Anne&apos;s Lace
        </Reveal>
        <RuleLine className="mt-5" />
        <div className="mt-7 space-y-6 text-[0.95rem] leading-relaxed opacity-85">
          <Reveal as="p" delay={80}>
            Queen Anne&apos;s Lace grows quietly.
            <br />
            Its beauty is discovered,
            <br />
            never announced.
          </Reveal>
          <Reveal as="p" delay={160}>
            Like this object,
            <br />
            it rewards attention.
          </Reveal>
          <Reveal as="p" delay={240}>
            Every ObjektHaus purchase
            <br />
            includes a botanical archive card.
          </Reveal>
        </div>
        <div className="mt-14 flex justify-end">
          <Reveal delay={300}>
            <Link
              to="/flower/$slug"
              params={{ slug: "queen-annes-lace" }}
              className="corner-action caps"
            >
              Explore floret <Arrow />
            </Link>
          </Reveal>
        </div>
        </div>
        </div>
      </section>

      {/* V — Materials */}
      <section id="materials" data-tone="dark" className="panel bg-bone text-bone-foreground">
        <Reveal as="h2" className="font-display text-[2.1rem] leading-[1.15] font-light sm:text-5xl lg:text-6xl">
          Every object
          <br />
          begins as
          <br />
          a material,
          <br />
          not a product.
        </Reveal>
        <RuleLine className="mt-8" />
        <Reveal className="image-veil mt-10 w-full rounded-xl" delay={100}>
          <video
            src={craftVideo.url}
            poster={craftWood}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="A craftsman planing a plywood panel, shavings curling away"
            className="w-full rounded-xl object-cover"
          />
        </Reveal>
        <ul className="mt-10 space-y-4 text-lg font-light tracking-wide opacity-70">
          {["Plywood", "Brass", "Stone", "Linen", "Paper"].map((m, i) => (
            <Reveal as="li" key={m} delay={i * 80}>
              {m}
            </Reveal>
          ))}
        </ul>
        <div className="mt-12 flex justify-end">
          <Reveal>
            <Link to="/archive" className="corner-action caps">
              Explore <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* VI — Botanical archive */}
      <section
        id="archive"
        data-tone="light"
        className="panel justify-end bg-ink text-ink-foreground"
      >
        <img
          src={archiveDark}
          alt="Herbarium plate of pale botanical engravings on a dark ground"
          loading="lazy"
          width={1024}
          height={1408}
          className="ken absolute inset-0 h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
        <div className="relative">
          <Reveal as="h2" className="font-display text-4xl font-light sm:text-5xl lg:text-6xl">
            Botanical
            <br />
            Archive
          </Reveal>
          <RuleLine className="mt-5" />
          <Reveal as="p" className="mt-5 text-[0.95rem] leading-relaxed opacity-80" delay={100}>
            Explore the flowers behind
            <br />
            each object and their stories.
          </Reveal>
          <Reveal className="mt-8" delay={180}>
            <Link to="/archive" className="corner-action text-lg font-light">
              Enter Archive <Arrow />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* VII — Bring it home */}
      <section id="order" data-tone="dark" className="panel bg-clay text-clay-foreground">
        <Reveal
          as="h2"
          className="font-display text-[2.6rem] leading-[1.05] font-light sm:text-6xl"
        >
          Bring it
          <br />
          home
        </Reveal>
        <div className="mt-12 flex flex-col items-start gap-8">
          <Reveal delay={80}>
            <Link to="/order" className="corner-action font-display text-3xl font-light">
              Order <Arrow />
            </Link>
          </Reveal>
          <Reveal delay={160}>
            <Link to="/contact" className="corner-action font-display text-3xl font-light">
              Contact <Arrow />
            </Link>
          </Reveal>
          <Reveal delay={240}>
            <SocialLinks className="opacity-75" size={20} />
          </Reveal>
        </div>
        <div className="mt-20 flex justify-center">
          <RuleLine />
        </div>
        <footer className="mt-10">
          <div className="caps flex items-center justify-between opacity-70">
            <Link to="/privacy" className="transition-opacity duration-500 hover:opacity-60">
              Privacy
            </Link>
            <Link to="/terms" className="transition-opacity duration-500 hover:opacity-60">
              Terms
            </Link>
          </div>
          <p className="caps mt-6 text-center opacity-55">© ObjektHaus 2024</p>
        </footer>
      </section>
    </main>
  );
}
