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

function AdminLayout() {
  const { session, loading } = useSession();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(session?.user.id);
  const { data: isSuper } = useIsSuperAdmin(session?.user.id);
  const tabs = isSuper ? [...baseTabs, staffTab] : baseTabs;
  const navigate = useNavigate();

  useEffect(() => {
    if (loading || roleLoading) return;
    if (!session) void navigate({ to: "/auth", replace: true });
    else if (isAdmin === false) void navigate({ to: "/account", replace: true });
  }, [loading, roleLoading, session, isAdmin, navigate]);

  if (loading || roleLoading || !session || !isAdmin) {
    return <div className="min-h-screen bg-bone px-8 py-32 text-bone-foreground">Loading…</div>;
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
