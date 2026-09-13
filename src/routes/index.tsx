import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Reveal, RuleLine } from "@/components/Reveal";
import { SocialLinks } from "@/components/Social";
import { QuickAdd } from "@/components/AddToCart";
import { HeroVideo } from "@/components/HeroVideo";
import { Wordmark } from "@/components/SiteNav";
import { useFlower } from "@/lib/products";
import { useHero, usePanel5, useManifesto, useFeatured } from "@/lib/site";
import heroVideo from "@/assets/hero-meadow.mp4.asset.json";
import haloHero from "@/assets/halo-2.jpg.asset.json";
import qalCard from "@/assets/qal-card.jpg.asset.json";
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
  const hero = useHero();
  const panel5 = usePanel5();
  const manifesto = useManifesto();
  const featuredSlug = useFeatured().slug || "queen-annes-lace";
  const featured = useFlower(featuredSlug);
  const quoteBlocks = (manifesto.body || "")
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  const materials = (panel5.body || "Plywood\nBrass\nStone\nLinen\nPaper")
    .split("\n")
    .map((m) => m.trim())
    .filter(Boolean);

  return (
    <main className="bg-bone">
      <SiteNav />

      {/* I — Entrance */}
      <section id="hero" data-tone="light" className="panel justify-end bg-ink text-bone">
        <HeroVideo
          key={hero.videoUrl || heroVideo.url}
          src={hero.videoUrl || heroVideo.url}
          label="A field of chamomile flowers swaying in the sun"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/25 via-transparent to-ink/45" />
        <h1 className="rise absolute inset-0 flex items-center justify-center px-10 text-bone">
          <span className="sr-only">ObjektHaus</span>
          <Wordmark className="h-16 w-[min(78vw,22rem)] drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:h-20 sm:w-[26rem] lg:h-28 lg:w-[38rem] xl:w-[44rem]" />
        </h1>
        <div className="relative flex flex-col items-center gap-5 text-bone">
          <p className="caps drop-shadow-[0_1px_10px_rgba(0,0,0,0.5)]">
            {hero.caption || "Scroll to enter exhibition"}
          </p>
          <span className="drift h-14 w-px bg-current opacity-60" />
        </div>
      </section>

      {/* II — Manifesto */}
      <section id="manifesto" data-tone="light" className="panel bg-olive text-olive-foreground">
        <div className="space-y-9 font-display text-[2.1rem] leading-[1.15] font-light sm:text-5xl lg:text-6xl">
          {quoteBlocks.map((block, bi) => (
            <div key={bi} className="space-y-9">
              {bi > 0 && <RuleLine delay={(bi - 1) * 100} />}
              <Reveal as="p" delay={bi * 100}>
                {block.split("\n").map((line, li) => (
                  <span key={li} className="block">
                    {line}
                  </span>
                ))}
              </Reveal>
            </div>
          ))}
        </div>
        <div className="mt-16 flex flex-col items-center gap-3">
          <p className="caps opacity-60">Scroll</p>
          <span className="drift h-10 w-px bg-current opacity-45" />
        </div>
      </section>

      {/* III — Object No.01 */}
      <section id="object" data-tone="dark" className="panel bg-clay text-clay-foreground">
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <Reveal className="image-veil mx-auto w-full max-w-md lg:max-w-none">
          <img
            src={haloHero.url}
            alt="ObjektHaus Object No.01, the Halo Pendant lamp glowing above a dark table"
            loading="lazy"
            width={1024}
            height={1408}
            className="mx-auto w-full object-contain lg:max-h-[68svh] lg:w-auto"
          />
        </Reveal>
        <div className="lg:pr-6">
        <Reveal className="mt-10 lg:mt-0" delay={120}>
          <h2 className="font-display text-4xl font-light sm:text-5xl lg:text-6xl">
            Object No.01 — Halo Pendant
          </h2>
          <p className="mt-3 text-sm tracking-wide opacity-70">Edition 001 / 101</p>
        </Reveal>
        <RuleLine className="mt-8" />
        <div className="mt-14 flex justify-end">
          <Reveal delay={200}>
            <QuickAdd flower={getFlower("queen-annes-lace")!} />
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
            src={qalCard.url}
            alt="Botanical archive card of Queen Anne's Lace, pressed on textured paper"
            loading="lazy"
            width={1024}
            height={1200}
            className="mx-auto w-full lg:max-h-[62svh] lg:w-auto lg:object-contain"
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
        <div className="lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        <div>
        {panel5.eyebrow && <p className="caps mb-4 opacity-55">{panel5.eyebrow}</p>}
        <Reveal as="h2" className="font-display text-[2.1rem] leading-[1.15] font-light sm:text-5xl lg:text-6xl">
          {panel5.title ? (
            panel5.title.split("\n").map((line, i) => (
              <span key={i} className="block">
                {line}
              </span>
            ))
          ) : (
            <>
              Every object
              <br />
              begins as
              <br />
              a material,
              <br />
              not a product.
            </>
          )}
        </Reveal>
        <RuleLine className="mt-8" />
        <ul className="mt-10 space-y-4 text-lg font-light tracking-wide opacity-70 lg:mt-12">
          {materials.map((m, i) => (
            <Reveal as="li" key={m} delay={i * 80}>
              {m}
            </Reveal>
          ))}
        </ul>
        </div>
        <div>
        <Reveal className="image-veil mt-10 w-full rounded-xl lg:mt-0" delay={100}>
          <HeroVideo
            key={panel5.videoUrl || craftVideo.url}
            src={panel5.videoUrl || craftVideo.url}
            label="A craftsman planing a plywood panel, shavings curling away"
            className="w-full rounded-xl object-cover lg:max-h-[58svh]"
          />
        </Reveal>
        {panel5.caption && <p className="caps mt-4 opacity-55">{panel5.caption}</p>}
        <div className="mt-12 flex justify-end">
          <Reveal>
            <Link to="/archive" className="corner-action caps">
              Explore <Arrow />
            </Link>
          </Reveal>
        </div>
        </div>
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
