import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminListOrders, adminUpdateOrder, adminDeleteOrder } from "@/lib/data.functions";
import { formatPrice } from "@/lib/cart";
import { deliveryCost, useDelivery } from "@/lib/site";

type OrderStatus = "new" | "pending" | "confirmed" | "cancelled";
type Filter = "all" | OrderStatus;

type OrderItem = {
  slug: string;
  product: string;
  name: string;
  qty: number;
  price: number;
  weight_kg?: number;
};
type Order = {
  id: string;
  reference: string;
  customer_name: string;
  phone: string;
  address: string;
  email: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  total_weight: number;
  delivery_zone: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
};

const filters: { key: Filter; label: string }[] = [
  { key: "all", label: "All orders" },
  { key: "new", label: "New orders" },
  { key: "pending", label: "Pending orders" },
  { key: "confirmed", label: "Confirmed orders" },
  { key: "cancelled", label: "Cancelled orders" },
];

export const Route = createFileRoute("/admin/")({
  validateSearch: (s: Record<string, unknown>): { status: Filter } => {
    const v = String(s.status ?? "all");
    return { status: (filters.some((f) => f.key === v) ? v : "all") as Filter };
  },
  component: AdminOrders,
});

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
  const cls =
    "mt-2 w-full border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current";
  return (
    <label className="block">
      <span className="caps opacity-55">{label}</span>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={`${cls} resize-none`} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

function AdminOrders() {
  const { status } = Route.useSearch();
  const qc = useQueryClient();
  const delivery = useDelivery();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => (await adminListOrders()) as unknown as Order[],
  });

  const shown = status === "all" ? orders : orders.filter((o) => o.status === status);
  const countOf = (k: Filter) => (k === "all" ? orders.length : orders.filter((o) => o.status === k).length);

  const setStatus = async (id: string, next: OrderStatus) => {
    await adminUpdateOrder({ data: { id, status: next } });
    await qc.invalidateQueries({ queryKey: ["orders"] });
  };

  const removeOrder = async (id: string) => {
    await adminDeleteOrder({ data: { id } });
    await qc.invalidateQueries({ queryKey: ["orders"] });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-x-7 gap-y-3">
        {filters.map((f) => (
          <Link
            key={f.key}
            to="/admin"
            search={{ status: f.key }}
            className={`caps border-b pb-1 transition-opacity ${
              status === f.key ? "border-current opacity-100" : "border-transparent opacity-50 hover:opacity-85"
            }`}
          >
            {f.label} ({countOf(f.key)})
          </Link>
        ))}
      </div>

      {isLoading ? (
        <p className="mt-10 text-sm opacity-60">Loading orders…</p>
      ) : shown.length === 0 ? (
        <p className="mt-10 text-sm opacity-60">No orders in this panel yet.</p>
      ) : (
        <ul className="mt-8 divide-y divide-current/15">
          {shown.map((o) => (
            <li key={o.id} className="py-7">
              {editingId === o.id ? (
                <OrderEditor
                  order={o}
                  perKg={delivery}
                  onClose={() => setEditingId(null)}
                  onSaved={async () => {
                    setEditingId(null);
                    await qc.invalidateQueries({ queryKey: ["orders"] });
                  }}
                />
              ) : (
                <>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <div>
                      <p className="font-display text-2xl font-light">{o.customer_name}</p>
                      <p className="caps mt-1 opacity-55">
                        #{o.reference} — {new Date(o.created_at).toLocaleString()}
                      </p>
                    </div>
                    <span className="caps rounded-full border border-current/30 px-3 py-1 opacity-80">
                      {o.status}
                    </span>
                  </div>

                  <div className="mt-4 grid gap-x-10 gap-y-2 text-sm opacity-80 sm:grid-cols-2">
                    <p>{o.phone}</p>
                    <p>{o.email || "—"}</p>
                    <p className="whitespace-pre-line sm:col-span-2">{o.address}</p>
                  </div>

                  <ul className="mt-4 space-y-1 text-sm opacity-75">
                    {o.items.map((it, i) => (
                      <li key={`${it.slug}-${i}`}>
                        {it.qty} × {it.product} — {formatPrice(it.price * it.qty)}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-sm">
                    Subtotal {formatPrice(Number(o.subtotal))} · Shipping{" "}
                    {Number(o.shipping) === 0 ? "included" : formatPrice(Number(o.shipping))} ·{" "}
                    <strong className="font-normal">Total {formatPrice(Number(o.total))}</strong>
                  </p>
                  {o.note && (
                    <p className="mt-3 whitespace-pre-line border-l border-current/25 pl-4 text-sm opacity-75">
                      <span className="caps mr-2 opacity-55">Note</span>
                      {o.note}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-5">
                    <button type="button" onClick={() => setEditingId(o.id)} className="caps link-underline">
                      Edit order
                    </button>
                    {(["new", "pending", "confirmed", "cancelled"] as OrderStatus[])
                      .filter((s) => s !== o.status)
                      .map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStatus(o.id, s)}
                          className="caps link-underline"
                        >
                          Mark {s}
                        </button>
                      ))}
                    <button
                      type="button"
                      onClick={() => removeOrder(o.id)}
                      className="caps opacity-45 hover:opacity-90"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function OrderEditor({
  order,
  perKg,
  onClose,
  onSaved,
}: {
  order: Order;
  perKg: ReturnType<typeof useDelivery>;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const [d, setD] = useState<Order>({ ...order, items: order.items.map((i) => ({ ...i })) });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const set = (p: Partial<Order>) => setD((c) => ({ ...c, ...p }));

  const setItem = (i: number, p: Partial<OrderItem>) =>
    setD((c) => ({ ...c, items: c.items.map((it, n) => (n === i ? { ...it, ...p } : it)) }));

  const addItem = () =>
    setD((c) => ({
      ...c,
      items: [...c.items, { slug: `item-${c.items.length + 1}`, product: "", name: "", qty: 1, price: 0, weight_kg: 0 }],
    }));

  const removeItem = (i: number) => setD((c) => ({ ...c, items: c.items.filter((_, n) => n !== i) }));

  const recalculate = () => {
    const subtotal = d.items.reduce((s, it) => s + Number(it.price) * Number(it.qty), 0);
    const weight = d.items.reduce((s, it) => s + Number(it.weight_kg ?? 0) * Number(it.qty), 0);
    const shipping = deliveryCost(perKg, weight, subtotal);
    set({ subtotal, total_weight: weight, shipping, total: subtotal + shipping });
  };

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await adminUpdateOrder({
        data: {
          id: d.id,
          reference: d.reference,
          customer_name: d.customer_name,
          phone: d.phone,
          address: d.address,
          email: d.email || null,
          note: d.note || null,
          status: d.status,
          delivery_zone: d.delivery_zone,
          items: d.items,
          subtotal: Number(d.subtotal),
          shipping: Number(d.shipping),
          total: Number(d.total),
          total_weight: Number(d.total_weight),
        },
      });
    } catch (e) {
      setBusy(false);
      setError(e instanceof Error ? e.message : "Could not save this order.");
      return;
    }
    setBusy(false);
    await onSaved();
  };

  return (
    <div className="border border-current/25 p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-2xl font-light">Editing order #{order.reference}</h3>
        <button type="button" onClick={onClose} className="caps opacity-55 hover:opacity-90">
          Cancel
        </button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Field label="Reference" value={d.reference} onChange={(v) => set({ reference: v })} />
        <label className="block">
          <span className="caps opacity-55">Status</span>
          <select
            value={d.status}
            onChange={(e) => set({ status: e.target.value as OrderStatus })}
            className="mt-2 w-full border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
          >
            {(["new", "pending", "confirmed", "cancelled"] as OrderStatus[]).map((s) => (
              <option key={s} value={s} className="bg-clay text-clay-foreground">
                {s}
              </option>
            ))}
          </select>
        </label>
        <Field label="Customer name" value={d.customer_name} onChange={(v) => set({ customer_name: v })} />
        <Field label="Phone" value={d.phone} onChange={(v) => set({ phone: v })} />
        <Field label="Email" value={d.email ?? ""} onChange={(v) => set({ email: v })} />
        <Field label="Delivery zone" value={d.delivery_zone} onChange={(v) => set({ delivery_zone: v })} />
      </div>

      <div className="mt-6 grid gap-6">
        <Field label="Address" textarea value={d.address} onChange={(v) => set({ address: v })} />
        <Field label="Special note" textarea value={d.note ?? ""} onChange={(v) => set({ note: v })} />
      </div>

      <p className="caps mt-8 opacity-55">Objects</p>
      <ul className="mt-3 space-y-5">
        {d.items.map((it, i) => (
          <li key={i} className="grid gap-4 border-b border-current/15 pb-5 sm:grid-cols-5">
            <Field label="Object" value={it.product} onChange={(v) => setItem(i, { product: v })} />
            <Field label="Flower" value={it.name} onChange={(v) => setItem(i, { name: v })} />
            <Field label="Qty" type="number" value={it.qty} onChange={(v) => setItem(i, { qty: Number(v) })} />
            <Field label="Price (৳)" type="number" value={it.price} onChange={(v) => setItem(i, { price: Number(v) })} />
            <div>
              <Field
                label="Weight (kg)"
                type="number"
                value={it.weight_kg ?? 0}
                onChange={(v) => setItem(i, { weight_kg: Number(v) })}
              />
              <button type="button" onClick={() => removeItem(i)} className="caps mt-3 opacity-45 hover:opacity-90">
                Remove object
              </button>
            </div>
          </li>
        ))}
      </ul>
      <button type="button" onClick={addItem} className="caps link-underline mt-4">
        Add object
      </button>

      <div className="mt-8 grid gap-6 sm:grid-cols-4">
        <Field label="Subtotal (৳)" type="number" value={d.subtotal} onChange={(v) => set({ subtotal: Number(v) })} />
        <Field label="Delivery (৳)" type="number" value={d.shipping} onChange={(v) => set({ shipping: Number(v) })} />
        <Field
          label="Total weight (kg)"
          type="number"
          value={d.total_weight}
          onChange={(v) => set({ total_weight: Number(v) })}
        />
        <Field label="Total (৳)" type="number" value={d.total} onChange={(v) => set({ total: Number(v) })} />
      </div>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      <div className="mt-7 flex flex-wrap gap-6">
        <button type="button" onClick={save} disabled={busy} className="caps link-underline disabled:opacity-40">
          {busy ? "Saving…" : "Save order"}
        </button>
        <button type="button" onClick={recalculate} className="caps link-underline opacity-70">
          Recalculate totals
        </button>
      </div>
    </div>
  );
}
