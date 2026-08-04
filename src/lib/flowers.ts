import pCard1 from "@/assets/p-card-1.jpg";
import pCard2 from "@/assets/p-card-2.jpg";
import pStool1 from "@/assets/p-stool-1.jpg";
import pStool2 from "@/assets/p-stool-2.jpg";
import pShelf1 from "@/assets/p-shelf-1.jpg";
import pShelf2 from "@/assets/p-shelf-2.jpg";
import pFloor1 from "@/assets/p-floor-1.jpg";
import pFloor2 from "@/assets/p-floor-2.jpg";
import craftWood from "@/assets/craft-wood.jpg";
import qalCard from "@/assets/qal-card.jpg.asset.json";
import halo1 from "@/assets/halo-1.jpg.asset.json";
import halo2 from "@/assets/halo-2.jpg.asset.json";
import halo3 from "@/assets/halo-3.jpg.asset.json";
import cardCowParsley from "@/assets/card-cow-parsley.jpg";
import cardYarrow from "@/assets/card-yarrow.jpg";
import cardMaleFern from "@/assets/card-male-fern.jpg";
import cardHogweed from "@/assets/card-hogweed.jpg";

export type Flower = {
  slug: string;
  no: string;
  name: string;
  latin: string;
  note: string;
  product: string;
  edition: string;
  price: number;
  represents: string;
  why: string;
  story: string;
  card: string;
  images: { src: string; alt: string }[];
};

export const flowers: Flower[] = [
  {
    slug: "queen-annes-lace",
    no: "041",
    name: "Queen Anne's Lace",
    latin: "Daucus carota",
    note: "Discovered, never announced.",
    product: "Object No.01 — Halo Pendant",
    edition: "Edition 001 / 101",
    price: 420,
    represents:
      "A hanging plywood pendant, its slatted drum ring cut from fine vertical ribs and closed with a soft diffuser disc that glows like an open umbel.",
    why: "The flower opens as a wide, weightless dome held on the thinnest of stems — the exact silhouette we were chasing. Its umbel diffuses light the way our shade does: softly, from the edges inward.",
    story:
      "No.01 began as a failed bowl. A sheet of ply cracked in the press, curved the wrong way, and sat on the bench for a month before someone turned it over and put a bulb underneath. We kept the curve, lost the crack, and learned to cut a hundred ribs that meet without a single splinter. Each pendant is assembled one at a time and takes four days to leave the jig.",
    card: qalCard.url,
    images: [
      { src: halo1.url, alt: "Detail of the slatted plywood ribs and diffuser of the Halo Pendant" },
      { src: halo2.url, alt: "Halo Pendant hanging above a dark table with ceramic vessels" },
      { src: halo3.url, alt: "Halo Pendant edition plate — Object 001, Edition 001 / 101" },
    ],
  },
  {
    slug: "cow-parsley",
    no: "042",
    name: "Cow Parsley",
    latin: "Anthriscus sylvestris",
    note: "Roadside architecture.",
    product: "Object No.12 — Card Holder",
    edition: "Edition 042 / 200",
    price: 60,
    represents:
      "A small desk card holder milled from a single block of laminated plywood, with a shallow scoop cut for the thumb.",
    why: "Cow parsley builds whole structures out of almost nothing — hollow stems, thin ribs, perfect balance. Our holder is the same idea: a few grams of material doing all the work of holding something upright.",
    story:
      "We designed this for the botanical archive card that ships with every object, because customers kept telling us they had nowhere to put it. It began as an offcut exercise — the block is cut from the waste left by the dome lamps, so nothing from a sheet leaves the workshop unused.",
    card: cardCowParsley,
    images: [
      { src: pCard1, alt: "Plywood card holder with a stack of cards" },
      { src: pCard2, alt: "Card holder photographed from above with a botanical card" },
    ],
  },
  {
    slug: "yarrow",
    no: "043",
    name: "Yarrow",
    latin: "Achillea millefolium",
    note: "Patient, fine-leaved, durable.",
    product: "Object No.03 — Mini Stool",
    edition: "Edition 043 / 80",
    price: 180,
    represents:
      "A three-legged plywood stool at child height, equally at home as a plant stand or a bedside table.",
    why: "Yarrow is the toughest soft-looking thing in the meadow — fine leaves, wiry stems, it survives being walked on. We wanted a stool that reads as delicate but takes a grown adult without a sound.",
    story:
      "The first prototype had four legs and wobbled on every floor we tried. Three legs never wobble. The seat is dished by hand with a curved plane, so no two are identical; the last pass is done by ear, listening for the shaving to go quiet.",
    card: cardYarrow,
    images: [
      { src: pStool1, alt: "Small three-legged plywood stool" },
      { src: pStool2, alt: "Detail of the plywood stool leg joinery" },
      { src: craftWood, alt: "Craftsman planing an oak beam in the workshop" },
    ],
  },
  {
    slug: "male-fern",
    no: "044",
    name: "Male Fern",
    latin: "Dryopteris filix-mas",
    note: "Unfurls before it stands.",
    product: "Object No.09 — Curve Shelf",
    edition: "Edition 044 / 120",
    price: 140,
    represents:
      "A wall shelf bent from a single plywood sheet, curling upward at one end to stop small objects from wandering.",
    why: "A fern frond arrives coiled and slowly opens. The shelf is that gesture held halfway — one continuous line that decides, at the last moment, to turn upward.",
    story:
      "Bending ply this tightly without cracking took eleven attempts and one very patient steam box. The curve holds a book, a cup, a pair of glasses. It ships with two brass fixings and a spirit level, because a crooked curve is far more obvious than a crooked straight line.",
    card: cardMaleFern,
    images: [
      { src: pShelf1, alt: "Curved plywood wall shelf holding a small ceramic cup" },
      { src: pShelf2, alt: "Close-up of the bent plywood curve and layered edge grain" },
    ],
  },
  {
    slug: "hogweed",
    no: "045",
    name: "Hogweed",
    latin: "Heracleum sphondylium",
    note: "Scale without ceremony.",
    product: "Object No.15 — Tall Floor Lamp",
    edition: "Edition 045 / 60",
    price: 520,
    represents: "A slender plywood floor lamp, a single upright stem carrying a wide, flat shade.",
    why: "Hogweed grows head-high in a season and never looks like it is trying. That is the posture we wanted: tall, plain, unbothered — height as a fact rather than a statement.",
    story:
      "The stem is a laminated ply spine, 14mm thin, that flexes very slightly when you brush past it and settles again. We tested it for a year in the studio doorway. It is still standing, and the light it throws across the ceiling is the reason we stopped designing pendants.",
    card: cardHogweed,
    images: [
      { src: pFloor1, alt: "Tall plywood floor lamp in a sunlit corner" },
      { src: pFloor2, alt: "The wide plywood shade seen from below, lit warmly" },
    ],
  },
];

export function getFlower(slug: string) {
  return flowers.find((f) => f.slug === slug);
}
