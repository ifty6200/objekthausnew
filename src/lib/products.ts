import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { flowers, type Flower } from "@/lib/flowers";
import { useSetting } from "@/lib/site";

export type ProductRow = {
  id: string;
  slug: string;
  no: string;
  name: string;
  latin: string;
  note: string;
  product: string;
  edition: string;
  price: number;
  weight_kg: number;
  represents: string;
  why: string;
  story: string;
  card_url: string;
  images: { src: string; alt: string }[];
  sort_order: number;
  published: boolean;
};

export type HiddenSettings = { slugs: string[] };
export const defaultHidden: HiddenSettings = { slugs: [] };

export function rowToFlower(r: ProductRow): Flower {
  return {
    slug: r.slug,
    no: r.no,
    name: r.name,
    latin: r.latin,
    note: r.note,
    product: r.product,
    edition: r.edition,
    price: Number(r.price),
    weightKg: Number(r.weight_kg) || 0,
    represents: r.represents,
    why: r.why,
    story: r.story,
    card: r.card_url,
    images: Array.isArray(r.images) ? r.images : [],
  };
}

/** A studio row may leave fields blank — the built-in copy fills the gaps. */
function mergeWithBuiltIn(row: Flower): Flower {
  const base = flowers.find((f) => f.slug === row.slug);
  if (!base) return row;
  const merged = { ...base } as Flower;
  (Object.keys(row) as (keyof Flower)[]).forEach((k) => {
    const v = row[k];
    if (v === "" || v === undefined || v === null) return;
    if (Array.isArray(v) && v.length === 0) return;
    // @ts-expect-error index assignment across union of field types
    merged[k] = v;
  });
  return merged;
}

export async function fetchProducts(): Promise<Flower[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error || !data) return [];
  return (data as unknown as ProductRow[]).map(rowToFlower);
}

function usePublishedProducts() {
  return useQuery({
    queryKey: ["products", "published"],
    queryFn: fetchProducts,
    initialData: [] as Flower[],
    staleTime: 5_000,
  }).data;
}

export function useHiddenSlugs(): string[] {
  const { data } = useSetting<HiddenSettings>("hidden", defaultHidden);
  return Array.isArray(data?.slugs) ? data.slugs : [];
}

/** Built-in archive, overridden by studio edits and minus anything hidden. */
export function useAllFlowers(): Flower[] {
  const rows = usePublishedProducts();
  const hidden = useHiddenSlugs();

  const overridden = flowers.map((f) => {
    const row = rows.find((r) => r.slug === f.slug);
    return row ? mergeWithBuiltIn(row) : f;
  });
  const extra = rows
    .filter((r) => !flowers.some((f) => f.slug === r.slug))
    .map(mergeWithBuiltIn);

  return [...overridden, ...extra].filter((f) => !hidden.includes(f.slug));
}

/** Studio objects override the built-in copy when the slug matches. */
export function useFlower(slug: string): Flower | undefined {
  return useAllFlowers().find((f) => f.slug === slug);
}
