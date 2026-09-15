import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useIsSuperAdmin, useSession } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Studio Panel — ObjektHaus" },
      { name: "description", content: "Manage ObjektHaus orders, objects and site content." },
      { property: "og:title", content: "Studio Panel — ObjektHaus" },
      { property: "og:description", content: "Internal studio panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminLayout,
});

const baseTabs: {
  to: "/admin" | "/admin/products" | "/admin/site" | "/admin/staff";
  label: string;
  exact?: boolean;
}[] = [
  { to: "/admin", label: "Orders", exact: true },
  { to: "/admin/products", label: "Objects" },
  { to: "/admin/site", label: "Site content" },
];
const staffTab = { to: "/admin/staff" as const, label: "Studio access", exact: false };

function StudioLogin({ notice }: { notice?: string | null }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setMsg("Those studio credentials were not recognised.");
    setBusy(false);
  };

  return (
    <main className="min-h-screen bg-bone px-7 py-32 text-bone-foreground sm:px-10">
      <div className="mx-auto max-w-md">
        <p className="caps opacity-50">ObjektHaus</p>
        <h1 className="mt-4 font-display text-4xl font-light">Studio panel</h1>
        <p className="mt-4 text-sm opacity-65">
          Studio credentials only. Customer accounts sign in from the site menu.
        </p>
        {notice && <p className="mt-4 text-sm opacity-70">{notice}</p>}
        <span className="rule-line mt-6" />
        <form onSubmit={submit} className="mt-10 space-y-6">
          <label className="block">
            <span className="caps opacity-55">Studio email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
            />
          </label>
          <label className="block">
            <span className="caps opacity-55">Password</span>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
            />
          </label>
          <button type="submit" disabled={busy} className="caps link-underline disabled:opacity-40">
            {busy ? "Signing in…" : "Enter studio"}
          </button>
        </form>
        {msg && <p className="mt-6 text-sm opacity-70">{msg}</p>}
        <Link to="/" className="caps link-underline mt-10 block opacity-60">
          Back to site
        </Link>
      </div>
    </main>
  );
}

function AdminLayout() {
  const { session, loading } = useSession();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(session?.user.id);
  const { data: isSuper } = useIsSuperAdmin(session?.user.id);
  const tabs = isSuper ? [...baseTabs, staffTab] : baseTabs;
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session && isAdmin === false) {
      setNotice(`${session.user.email} has no studio access. Signed out.`);
      void supabase.auth.signOut();
    }
  }, [loading, session, isAdmin]);

  if (loading || (session && roleLoading)) {
    return <div className="min-h-screen bg-bone px-8 py-32 text-bone-foreground">Loading…</div>;
  }

  if (!session || !isAdmin) {
    return <StudioLogin notice={notice} />;
  }

  return (
    <main className="min-h-screen bg-bone text-bone-foreground">
      <header className="border-b border-current/15 px-7 py-6 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <div>
            <p className="caps opacity-50">ObjektHaus</p>
            <h1 className="font-display text-3xl font-light">Studio panel</h1>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/" className="caps link-underline">
              View site
            </Link>
            <button
              type="button"
              onClick={() => supabase.auth.signOut()}
              className="caps opacity-55 hover:opacity-90"
            >
              Sign out
            </button>
          </div>
        </div>
        <nav className="mx-auto mt-6 flex max-w-6xl flex-wrap gap-6">
          {tabs.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              activeOptions={{ exact: t.exact ?? false }}
              activeProps={{ className: "opacity-100 border-current" }}
              className="caps border-b border-transparent pb-1 opacity-55 transition-opacity hover:opacity-90"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </header>
      <div className="mx-auto max-w-6xl px-7 py-10 sm:px-10">
        <Outlet />
      </div>
    </main>
  );
}
