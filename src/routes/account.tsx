import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";
import { formatPrice, useCart } from "@/lib/cart";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your Account — ObjektHaus" },
      {
        name: "description",
        content:
          "Your ObjektHaus account: saved details, past orders, current selection and design contributions.",
      },
      { property: "og:title", content: "Your Account — ObjektHaus" },
      { property: "og:description", content: "Orders, details and design contributions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

type Profile = { id: string; full_name: string; phone: string; address: string; email: string | null };
type OrderItem = { slug: string; product: string; qty: number; price: number };
type OrderRow = {
  id: string;
  reference: string;
  status: string;
  total: number;
  created_at: string;
  items: OrderItem[];
};
type Submission = { id: string; title: string; description: string; status: string; created_at: string };

function AccountPage() {
  const { session, loading } = useSession();
  const { data: isAdmin } = useIsAdmin(session?.user.id);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const uid = session?.user.id;

  useEffect(() => {
    if (!loading && !session) void navigate({ to: "/auth" });
  }, [loading, session, navigate]);

  const { data: profile } = useQuery({
    queryKey: ["profile", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", uid!).maybeSingle();
      if (data) return data as unknown as Profile;
      const fresh = {
        id: uid!,
        full_name: String(session?.user.user_metadata?.["full_name"] ?? ""),
        phone: "",
        address: "",
        email: session?.user.email ?? null,
      };
      await supabase.from("profiles").upsert(fresh);
      return fresh as Profile;
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["my-orders", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("id, reference, status, total, created_at, items")
        .eq("user_id", uid!)
        .order("created_at", { ascending: false });
      return (data ?? []) as unknown as OrderRow[];
    },
  });

  const { data: designs = [] } = useQuery({
    queryKey: ["my-designs", uid],
    enabled: !!uid,
    queryFn: async () => {
      const { data } = await supabase
        .from("design_submissions")
        .select("id, title, description, status, created_at")
        .eq("user_id", uid!)
        .order("created_at", { ascending: false });
      return (data ?? []) as unknown as Submission[];
    },
  });

  const { lines, total, setQty, remove } = useCart();

  const [draft, setDraft] = useState<Profile | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  useEffect(() => {
    if (profile) setDraft(profile);
  }, [profile]);

  const saveProfile = async () => {
    if (!draft) return;
    const { error } = await supabase.from("profiles").upsert(draft);
    setSavedMsg(error ? error.message : "Details saved.");
    await qc.invalidateQueries({ queryKey: ["profile", uid] });
    setTimeout(() => setSavedMsg(null), 3000);
  };

  const [dTitle, setDTitle] = useState("");
  const [dDesc, setDDesc] = useState("");
  const [dUrl, setDUrl] = useState("");
  const [dMsg, setDMsg] = useState<string | null>(null);

  const submitDesign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;
    const { error } = await supabase
      .from("design_submissions")
      .insert({ user_id: uid, title: dTitle, description: dDesc, reference_url: dUrl });
    if (error) {
      setDMsg(error.message);
      return;
    }
    setDTitle("");
    setDDesc("");
    setDUrl("");
    setDMsg("Thank you — the studio will look at your idea.");
    await qc.invalidateQueries({ queryKey: ["my-designs", uid] });
    setTimeout(() => setDMsg(null), 4000);
  };

  if (loading || !session) {
    return <div className="min-h-screen bg-sand px-8 py-32 text-sand-foreground">Loading…</div>;
  }

  const field = (label: string, key: keyof Profile, textarea = false) => (
    <label className="block">
      <span className="caps opacity-55">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={String(draft?.[key] ?? "")}
          onChange={(e) => setDraft((d) => (d ? { ...d, [key]: e.target.value } : d))}
          className="mt-2 w-full resize-none border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
        />
      ) : (
        <input
          value={String(draft?.[key] ?? "")}
          onChange={(e) => setDraft((d) => (d ? { ...d, [key]: e.target.value } : d))}
          className="mt-2 w-full border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
        />
      )}
    </label>
  );

  return (
    <main data-tone="dark" className="min-h-screen bg-sand text-sand-foreground">
      <SiteNav />
      <section className="mx-auto max-w-5xl px-7 pt-32 pb-24 sm:px-10 lg:pt-40">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="caps opacity-55">Your account</p>
            <h1 className="mt-4 font-display text-5xl font-light">
              {profile?.full_name || session.user.email}
            </h1>
          </div>
          <div className="flex flex-wrap gap-5">
            {isAdmin && (
              <Link to="/admin" search={{ status: "all" }} className="caps link-underline">
                Studio panel
              </Link>
            )}
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="caps opacity-55 hover:opacity-90"
            >
              Sign out
            </button>
          </div>
        </div>
        <span className="rule-line mt-6" />

        <div className="mt-14 grid gap-14 lg:grid-cols-2">
          {/* Details */}
          <section>
            <h2 className="font-display text-3xl font-light">Your details</h2>
            <div className="mt-6 space-y-5">
              {field("Full name", "full_name")}
              {field("Phone number", "phone")}
              {field("Address", "address", true)}
              <p className="text-sm opacity-60">Email — {session.user.email}</p>
            </div>
            <div className="mt-6 flex items-center gap-5">
              <button type="button" onClick={saveProfile} className="caps link-underline">
                Save details
              </button>
              {savedMsg && <span className="caps opacity-55">{savedMsg}</span>}
            </div>
          </section>

          {/* Cart */}
          <section>
            <h2 className="font-display text-3xl font-light">Your cart</h2>
            {lines.length === 0 ? (
              <p className="mt-4 text-sm opacity-65">
                Nothing selected yet.{" "}
                <Link to="/archive" className="link-underline">
                  Open the archive
                </Link>
                .
              </p>
            ) : (
              <>
                <ul className="mt-4 divide-y divide-current/15">
                  {lines.map((l) => (
                    <li key={l.slug} className="flex items-center justify-between gap-4 py-4">
                      <div>
                        <p className="text-sm">{l.product}</p>
                        <p className="caps mt-1 opacity-55">{formatPrice(l.price)} each</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center border border-current/25">
                          <button type="button" onClick={() => setQty(l.slug, l.qty - 1)} className="px-3 py-1">
                            –
                          </button>
                          <span className="min-w-6 text-center text-sm">{l.qty}</span>
                          <button type="button" onClick={() => setQty(l.slug, l.qty + 1)} className="px-3 py-1">
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(l.slug)}
                          className="caps opacity-45 hover:opacity-90"
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm">Subtotal {formatPrice(total)}</p>
                <Link to="/order" className="caps link-underline mt-5 inline-block">
                  Go to checkout
                </Link>
              </>
            )}
          </section>
        </div>

        {/* Orders */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-light">Previous orders</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm opacity-65">No orders placed from this account yet.</p>
          ) : (
            <ul className="mt-6 divide-y divide-current/15">
              {orders.map((o) => (
                <li key={o.id} className="py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <p className="font-display text-2xl font-light">#{o.reference}</p>
                    <span className="caps rounded-full border border-current/30 px-3 py-1 opacity-80">
                      {o.status}
                    </span>
                  </div>
                  <p className="caps mt-1 opacity-55">{new Date(o.created_at).toLocaleString()}</p>
                  <ul className="mt-3 space-y-1 text-sm opacity-75">
                    {(o.items ?? []).map((it) => (
                      <li key={it.slug}>
                        {it.qty} × {it.product}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-2 text-sm">Total {formatPrice(Number(o.total))}</p>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Design contribution */}
        <section className="mt-16 border border-current/20 p-7">
          <h2 className="font-display text-3xl font-light">Contribute a design</h2>
          <p className="mt-2 text-sm opacity-65">
            Suggest an object, a flower or a form you would like the studio to make.
          </p>
          <form onSubmit={submitDesign} className="mt-6 space-y-5">
            <label className="block">
              <span className="caps opacity-55">Title</span>
              <input
                required
                maxLength={120}
                value={dTitle}
                onChange={(e) => setDTitle(e.target.value)}
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
              />
            </label>
            <label className="block">
              <span className="caps opacity-55">Your idea</span>
              <textarea
                required
                rows={4}
                maxLength={2000}
                value={dDesc}
                onChange={(e) => setDDesc(e.target.value)}
                className="mt-2 w-full resize-none border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
              />
            </label>
            <label className="block">
              <span className="caps opacity-55">Reference link (optional)</span>
              <input
                value={dUrl}
                onChange={(e) => setDUrl(e.target.value)}
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 text-sm outline-none focus:border-current"
              />
            </label>
            {dMsg && <p className="text-sm opacity-80">{dMsg}</p>}
            <button type="submit" className="caps link-underline">
              Send to the studio
            </button>
          </form>

          {designs.length > 0 && (
            <ul className="mt-8 divide-y divide-current/15">
              {designs.map((d) => (
                <li key={d.id} className="py-4">
                  <p className="text-sm">{d.title}</p>
                  <p className="caps mt-1 opacity-55">
                    {d.status} — {new Date(d.created_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </section>
    </main>
  );
}
