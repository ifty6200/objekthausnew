import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MediaUpload } from "@/components/MediaUpload";
import type { ProductRow } from "@/lib/products";
import type { ProductSpec } from "@/lib/flowers";
import { flowers } from "@/lib/flowers";

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
  represents: "",
  why: "",
  story: "",
  card_url: "",
  images: [],
  sort_order: 0,
  published: true,
  stock_out: false,
  weight_kg: 0,
  specs: [],
};

const emptySpec: ProductSpec = {
  material: "",
  weight: "",
  light: "",
  type: "",
  colors: "",
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
      sort_order: Number(draft.sort_order) || 0,
      weight_kg: Number(draft.weight_kg) || 0,
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
            <Field label="Sort order" type="number" value={draft.sort_order} onChange={(v) => set({ sort_order: Number(v) })} />
            <Field label="Short note" value={draft.note} onChange={(v) => set({ note: v })} />
            <Field
              label="Weight (kg) — used for delivery"
              type="number"
              value={draft.weight_kg}
              onChange={(v) => set({ weight_kg: Number(v) })}
            />
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

            <div className="space-y-4">
              <span className="caps opacity-55">Materials chart</span>
              {draft.specs.map((s, i) => (
                <div key={i} className="grid gap-4 border border-current/15 p-4 sm:grid-cols-2">
                  <Field
                    label="Material"
                    value={s.material}
                    onChange={(v) =>
                      set({ specs: draft.specs.map((x, j) => (j === i ? { ...x, material: v } : x)) })
                    }
                  />
                  <Field
                    label="Weight"
                    value={s.weight}
                    onChange={(v) =>
                      set({ specs: draft.specs.map((x, j) => (j === i ? { ...x, weight: v } : x)) })
                    }
                  />
                  <Field
                    label="Light used"
                    value={s.light}
                    onChange={(v) =>
                      set({ specs: draft.specs.map((x, j) => (j === i ? { ...x, light: v } : x)) })
                    }
                  />
                  <Field
                    label="Type"
                    value={s.type}
                    onChange={(v) =>
                      set({ specs: draft.specs.map((x, j) => (j === i ? { ...x, type: v } : x)) })
                    }
                  />
                  <Field
                    label="Colour variations"
                    value={s.colors}
                    onChange={(v) =>
                      set({ specs: draft.specs.map((x, j) => (j === i ? { ...x, colors: v } : x)) })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => set({ specs: draft.specs.filter((_, j) => j !== i) })}
                    className="caps self-end text-left opacity-45 hover:opacity-90"
                  >
                    Remove row
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set({ specs: [...draft.specs, { ...emptySpec }] })}
                className="caps link-underline"
              >
                Add chart row
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
            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={draft.stock_out}
                onChange={(e) => set({ stock_out: e.target.checked })}
              />
              Out of stock
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
                ৳{Number(r.price)} · {r.name}
                {r.published ? "" : " · hidden"}
                {r.stock_out ? " · out of stock" : ""}
              </p>
            </div>
            <div className="flex gap-5">
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...r,
                    images: Array.isArray(r.images) ? r.images : [],
                    specs: Array.isArray(r.specs) ? r.specs : [],
                  })
                }
                className="caps link-underline"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Delete "${r.product || r.name}" permanently?`)) void remove(r.id);
                }}
                className="caps opacity-45 hover:opacity-90"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-12 border-t border-current/15 pt-8">
        <p className="caps opacity-55">Founding objects (built into the exhibition)</p>
        <ul className="mt-4 space-y-2 text-sm opacity-70">
          {flowers.map((f) => (
            <li key={f.slug}>
              {f.product} — {f.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
