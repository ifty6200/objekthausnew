import pLamp1 from "@/assets/p-lamp-1.jpg";
import pLamp2 from "@/assets/p-lamp-2.jpg";
import pCard1 from "@/assets/p-card-1.jpg";
import pCard2 from "@/assets/p-card-2.jpg";
import pStool1 from "@/assets/p-stool-1.jpg";
import pStool2 from "@/assets/p-stool-2.jpg";
import pShelf1 from "@/assets/p-shelf-1.jpg";
import pShelf2 from "@/assets/p-shelf-2.jpg";
import pFloor1 from "@/assets/p-floor-1.jpg";
import pFloor2 from "@/assets/p-floor-2.jpg";
import objectLamp from "@/assets/object-lamp.jpg";
import craftWood from "@/assets/craft-wood.jpg";

export type Flower = {
  slug: string;
  no: string;
  name: string;
  latin: string;
  note: string;
  product: string;
  edition: string;
  represents: string;
  why: string;
  story: string;
  images: { src: string; alt: string }[];
};

export const flowers: Flower[] = [
  {
    slug: "queen-annes-lace",
    no: "041",
    name: "Queen Anne's Lace",
    latin: "Daucus carota",
    note: "Discovered, never announced.",
    product: "Object No.07 — Dome Lamp",
    edition: "Edition 041 / 101",
    represents:
      "A hand-formed plywood dome lamp, its shade bent from seven layers of birch ply and sanded until the seams disappear.",
    why: "The flower opens as a wide, weightless dome held on the thinnest of stems — the exact silhouette we were chasing. Its umbel diffuses light the way our shade does: softly, from the edges inward.",
    story:
      "No.07 began as a failed bowl. A sheet of ply cracked in the press, curved the wrong way, and sat on the bench for a month before someone turned it over and put a bulb underneath. We kept the curve, lost the crack, and spent a summer learning to bend seven plies without a single splinter. Each lamp is pressed one at a time and takes four days to leave the mould.",
    images: [
      { src: objectLamp, alt: "Object No.07 dome lamp seen from the front" },
      { src: pLamp1, alt: "Plywood dome lamp glowing on a warm backdrop" },
      { src: pLamp2, alt: "Detail of the layered plywood edge of the dome shade" },
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
    represents:
      "A small desk card holder milled from a single block of laminated plywood, with a shallow scoop cut for the thumb.",
    why: "Cow parsley builds whole structures out of almost nothing — hollow stems, thin ribs, perfect balance. Our holder is the same idea: a few grams of material doing all the work of holding something upright.",
    story:
      "We designed this for the botanical archive card that ships with every object, because customers kept telling us they had nowhere to put it. It began as an offcut exercise — the block is cut from the waste left by the dome lamps, so nothing from a sheet leaves the workshop unused.",
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
    represents:
      "A three-legged plywood stool at child height, equally at home as a plant stand or a bedside table.",
    why: "Yarrow is the toughest soft-looking thing in the meadow — fine leaves, wiry stems, it survives being walked on. We wanted a stool that reads as delicate but takes a grown adult without a sound.",
    story:
      "The first prototype had four legs and wobbled on every floor we tried. Three legs never wobble. The seat is dished by hand with a curved plane, so no two are identical; the last pass is done by ear, listening for the shaving to go quiet.",
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
    represents:
      "A wall shelf bent from a single plywood sheet, curling upward at one end to stop small objects from wandering.",
    why: "A fern frond arrives coiled and slowly opens. The shelf is that gesture held halfway — one continuous line that decides, at the last moment, to turn upward.",
    story:
      "Bending ply this tightly without cracking took eleven attempts and one very patient steam box. The curve holds a book, a cup, a pair of glasses. It ships with two brass fixings and a spirit level, because a crooked curve is far more obvious than a crooked straight line.",
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
    represents: "A slender plywood floor lamp, a single upright stem carrying a wide, flat shade.",
    why: "Hogweed grows head-high in a season and never looks like it is trying. That is the posture we wanted: tall, plain, unbothered — height as a fact rather than a statement.",
    story:
      "The stem is a laminated ply spine, 14mm thin, that flexes very slightly when you brush past it and settles again. We tested it for a year in the studio doorway. It is still standing, and the light it throws across the ceiling is the reason we stopped designing pendants.",
    images: [
      { src: pFloor1, alt: "Tall plywood floor lamp in a sunlit corner" },
      { src: pFloor2, alt: "The wide plywood shade seen from below, lit warmly" },
    ],
  },
];

export function getFlower(slug: string) {
  return flowers.find((f) => f.slug === slug);
}
