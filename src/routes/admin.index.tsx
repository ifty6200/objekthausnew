import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/cart";

type OrderStatus = "new" | "pending" | "confirmed" | "cancelled";
type Filter = "all" | OrderStatus;

type OrderItem = { slug: string; product: string; name: string; qty: number; price: number };
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

function AdminOrders() {
  const { status } = Route.useSearch();
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Order[];
    },
  });

  const shown = status === "all" ? orders : orders.filter((o) => o.status === status);
  const countOf = (k: Filter) => (k === "all" ? orders.length : orders.filter((o) => o.status === k).length);

  const setStatus = async (id: string, next: OrderStatus) => {
    await supabase.from("orders").update({ status: next }).eq("id", id);
    await qc.invalidateQueries({ queryKey: ["orders"] });
  };

  const removeOrder = async (id: string) => {
    await supabase.from("orders").delete().eq("id", id);
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
                {o.items.map((it) => (
                  <li key={it.slug}>
                    {it.qty} × {it.product} — {formatPrice(it.price * it.qty)}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm">
                Subtotal {formatPrice(Number(o.subtotal))} · Shipping{" "}
                {Number(o.shipping) === 0 ? "included" : formatPrice(Number(o.shipping))} ·{" "}
                <strong className="font-normal">Total {formatPrice(Number(o.total))}</strong>
              </p>

              <div className="mt-5 flex flex-wrap gap-5">
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
