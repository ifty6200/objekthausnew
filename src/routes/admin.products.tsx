import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaUpload } from "@/components/MediaUpload";
import type { ProductRow } from "@/lib/products";
import { flowers } from "@/lib/flowers";
import { defaultFeatured, useSetting, type FeaturedSettings } from "@/lib/site";
import { defaultHidden, type HiddenSettings } from "@/lib/products";

export const Route = createFileRoute("/admin/products")({
  component: AdminProducts,
});

type Draft = Omit<ProductRow, "id"> & { id?: string };

const emptyDraft: Draft = {
  slug: "",
  no: "",
  name: "",
  latin: "",
  note: "",
  product: "",
  edition: "",
  price: 0,
  weight_kg: 0,
  represents: "",
  why: "",
  story: "",
  card_url: "",
  images: [],
  sort_order: 0,
  published: true,
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function Field({
  label,
  value,
  onChange,
  textarea,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  textarea?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="caps opacity-55">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full resize-none border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
        />
      )}
    </label>
  );
}

function AdminProducts() {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: rows = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error: e } = await supabase
        .from("products")
        .select("*")
        .order("sort_order")
        .order("created_at");
      if (e) throw e;
      return (data ?? []) as unknown as ProductRow[];
    },
  });

  const set = (patch: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  const save = async () => {
    if (!draft) return;
    setError(null);
    const payload = {
      ...draft,
      slug: draft.slug || slugify(draft.name),
      price: Number(draft.price) || 0,
      weight_kg: Number(draft.weight_kg) || 0,
      sort_order: Number(draft.sort_order) || 0,
    };
    const { error: e } = draft.id
      ? await supabase.from("products").update(payload).eq("id", draft.id)
      : await supabase.from("products").insert(payload);
    if (e) {
      setError(e.message);
      return;
    }
    setDraft(null);
    await qc.invalidateQueries({ queryKey: ["admin-products"] });
    await qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    await qc.invalidateQueries({ queryKey: ["admin-products"] });
    await qc.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-light">Objects &amp; botanical cards</h2>
          <p className="mt-2 text-sm opacity-60">
            Studio objects added here appear in the botanical archive alongside the founding five.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDraft({ ...emptyDraft })}
          className="caps link-underline"
        >
          Add an object
        </button>
      </div>

      <FeaturedPicker rows={rows} />



      {draft && (
        <div className="mt-8 border border-current/20 p-6">
          <p className="caps opacity-55">{draft.id ? "Edit object" : "New object"}</p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <Field label="Flower name" value={draft.name} onChange={(v) => set({ name: v, slug: draft.slug || slugify(v) })} />
            <Field label="Latin name" value={draft.latin} onChange={(v) => set({ latin: v })} />
            <Field label="Slug (url)" value={draft.slug} onChange={(v) => set({ slug: slugify(v) })} />
            <Field label="Floret no." value={draft.no} onChange={(v) => set({ no: v })} />
            <Field label="Object title" value={draft.product} onChange={(v) => set({ product: v })} />
            <Field label="Edition" value={draft.edition} onChange={(v) => set({ edition: v })} />
            <Field label="Price (৳)" type="number" value={draft.price} onChange={(v) => set({ price: Number(v) })} />
            <Field label="Weight (kg)" type="number" value={draft.weight_kg} onChange={(v) => set({ weight_kg: Number(v) })} />
            <Field label="Sort order" type="number" value={draft.sort_order} onChange={(v) => set({ sort_order: Number(v) })} />
            <Field label="Short note" value={draft.note} onChange={(v) => set({ note: v })} />
          </div>
          <div className="mt-6 space-y-6">
            <Field label="What it represents" textarea value={draft.represents} onChange={(v) => set({ represents: v })} />
            <Field label="Why this flower" textarea value={draft.why} onChange={(v) => set({ why: v })} />
            <Field label="The story" textarea value={draft.story} onChange={(v) => set({ story: v })} />
            <MediaUpload
              label="Botanical archive card"
              accept="image/*"
              value={draft.card_url}
              onChange={(url) => set({ card_url: url })}
            />

            <div className="space-y-4">
              <span className="caps opacity-55">Product images (swipeable gallery)</span>
              {draft.images.map((img, i) => (
                <div key={i} className="border border-current/15 p-4">
                  <MediaUpload
                    label={`Image ${i + 1}`}
                    accept="image/*"
                    value={img.src}
                    onChange={(url) =>
                      set({ images: draft.images.map((x, j) => (j === i ? { ...x, src: url } : x)) })
                    }
                  />
                  <Field
                    label="Alt text"
                    value={img.alt}
                    onChange={(v) =>
                      set({ images: draft.images.map((x, j) => (j === i ? { ...x, alt: v } : x)) })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => set({ images: draft.images.filter((_, j) => j !== i) })}
                    className="caps mt-3 opacity-45 hover:opacity-90"
                  >
                    Remove image
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set({ images: [...draft.images, { src: "", alt: "" }] })}
                className="caps link-underline"
              >
                Add image
              </button>
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => set({ published: e.target.checked })}
              />
              Published on the site
            </label>
          </div>

          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
          <div className="mt-6 flex gap-6">
            <button type="button" onClick={save} className="caps link-underline">
              Save object
            </button>
            <button type="button" onClick={() => setDraft(null)} className="caps opacity-50 hover:opacity-90">
              Cancel
            </button>
          </div>
        </div>
      )}

      <ul className="mt-10 divide-y divide-current/15">
        {rows.map((r) => (
          <li key={r.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="font-display text-2xl font-light">{r.product || r.name}</p>
              <p className="caps mt-1 opacity-55">
                {r.name} — ৳{Number(r.price)} · {Number(r.weight_kg)}kg{" "}
                {r.published ? "" : "· hidden"}
              </p>
            </div>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() => setDraft({ ...r, images: Array.isArray(r.images) ? r.images : [] })}
                className="caps link-underline"
              >
                Edit
              </button>
              <button type="button" onClick={() => remove(r.id)} className="caps opacity-45 hover:opacity-90">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <FoundingObjects rows={rows} onEdit={(d) => setDraft(d)} />
    </div>
  );
}

/** The five built-in objects: editable (creates an override row) and hideable. */
function FoundingObjects({
  rows,
  onEdit,
}: {
  rows: ProductRow[];
  onEdit: (d: Draft) => void;
}) {
  const qc = useQueryClient();
  const { data } = useSetting<HiddenSettings>("hidden", defaultHidden);
  const hidden = Array.isArray(data?.slugs) ? data.slugs : [];

  const toggleHidden = async (slug: string) => {
    const next = hidden.includes(slug) ? hidden.filter((s) => s !== slug) : [...hidden, slug];
    await supabase
      .from("site_settings")
      .upsert({ key: "hidden", value: { slugs: next } as never });
    await qc.invalidateQueries({ queryKey: ["site_settings", "hidden"] });
    await qc.invalidateQueries({ queryKey: ["products"] });
  };

  const editBuiltIn = (slug: string) => {
    const f = flowers.find((x) => x.slug === slug)!;
    const existing = rows.find((r) => r.slug === slug);
    if (existing) {
      onEdit({ ...existing, images: Array.isArray(existing.images) ? existing.images : [] });
      return;
    }
    onEdit({
      slug: f.slug,
      no: f.no,
      name: f.name,
      latin: f.latin,
      note: f.note,
      product: f.product,
      edition: f.edition,
      price: f.price,
      weight_kg: f.weightKg,
      represents: f.represents,
      why: f.why,
      story: f.story,
      card_url: f.card,
      images: f.images,
      sort_order: 0,
      published: true,
    });
  };

  return (
    <div className="mt-12 border-t border-current/15 pt-8">
      <p className="caps opacity-55">Founding objects (built into the exhibition)</p>
      <p className="mt-2 text-sm opacity-60">
        Editing one saves a studio copy that replaces it everywhere on the site.
      </p>
      <ul className="mt-4 divide-y divide-current/15">
        {flowers.map((f) => (
          <li key={f.slug} className="flex flex-wrap items-center justify-between gap-4 py-4">
            <div>
              <p className="text-sm">
                {f.product} — {f.name}
              </p>
              <p className="caps mt-1 opacity-50">
                {rows.some((r) => r.slug === f.slug) ? "edited in studio" : "original"}
                {hidden.includes(f.slug) ? " · hidden" : ""}
              </p>
            </div>
            <div className="flex gap-5">
              <button type="button" onClick={() => editBuiltIn(f.slug)} className="caps link-underline">
                Edit
              </button>
              <button
                type="button"
                onClick={() => void toggleHidden(f.slug)}
                className="caps opacity-45 hover:opacity-90"
              >
                {hidden.includes(f.slug) ? "Show" : "Hide"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Chooses which object fills the third and fourth panels of the exhibition. */
function FeaturedPicker({ rows }: { rows: ProductRow[] }) {
  const qc = useQueryClient();
  const { data } = useSetting<FeaturedSettings>("featured", defaultFeatured);
  const current = (data ?? defaultFeatured).slug;
  const [saved, setSaved] = useState(false);

  const options = [
    ...flowers.map((f) => ({ slug: f.slug, label: `${f.product} — ${f.name}` })),
    ...rows
      .filter((r) => !flowers.some((f) => f.slug === r.slug))
      .map((r) => ({ slug: r.slug, label: `${r.product || r.name} — ${r.name}` })),
  ];

  const choose = async (slug: string) => {
    await supabase.from("site_settings").upsert({ key: "featured", value: { slug } as never });
    await qc.invalidateQueries({ queryKey: ["site_settings", "featured"] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section className="mt-10 border border-current/20 p-6">
      <h3 className="font-display text-2xl font-light">Featured on the exhibition</h3>
      <p className="mt-2 text-sm opacity-60">
        The chosen object fills the third panel, and its flower card fills the fourth panel.
      </p>
      <div className="mt-5 space-y-3">
        {options.map((o) => (
          <label key={o.slug} className="flex items-center gap-3 text-sm">
            <input
              type="radio"
              name="featured"
              checked={current === o.slug}
              onChange={() => void choose(o.slug)}
            />
            {o.label}
          </label>
        ))}
      </div>
      {saved && <p className="caps mt-4 opacity-55">Saved</p>}
    </section>
  );
}
