import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { flowers, type Flower } from "@/lib/flowers";

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

/** Studio-added objects appended to the built-in archive. */
export function useAllFlowers() {
  const { data } = useQuery({
    queryKey: ["products", "published"],
    queryFn: fetchProducts,
    initialData: [] as Flower[],
    staleTime: 30_000,
  });
  const extra = data.filter((p) => !flowers.some((f) => f.slug === p.slug));
  return [...flowers, ...extra];
}

/** Studio objects override the built-in copy when the slug matches. */
export function useFlower(slug: string): Flower | undefined {
  const all = useAllFlowers();
  const { data = [] } = useQuery({
    queryKey: ["products", "published"],
    queryFn: fetchProducts,
    initialData: [] as Flower[],
    staleTime: 30_000,
  });
  return data.find((p) => p.slug === slug) ?? all.find((f) => f.slug === slug);
}
