import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { bootstrapSuperAdmin } from "@/lib/staff.functions";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/setup")({
  head: () => ({
    meta: [
      { title: "Owner setup — ObjektHaus" },
      { name: "description", content: "One-time owner setup for the ObjektHaus studio panel." },
      { property: "og:title", content: "Owner setup — ObjektHaus" },
      { property: "og:description", content: "One-time owner setup for the ObjektHaus studio panel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SetupPage,
});

function SetupPage() {
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const bootstrap = useServerFn(bootstrapSuperAdmin);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await bootstrap({ data: { token: token.trim(), email: email.trim(), password } });
      setMsg("Owner account ready. Signing you in…");
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) {
        setMsg("Owner account ready. Please sign in from the account page.");
      } else {
        void navigate({ to: "/admin", search: { status: "all" } });
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Setup failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main data-tone="dark" className="min-h-screen bg-sand text-sand-foreground">
      <SiteNav />
      <section className="mx-auto max-w-md px-7 pt-32 pb-20 sm:px-10 lg:pt-40">
        <p className="caps opacity-55">ObjektHaus</p>
        <h1 className="mt-4 font-display text-5xl font-light">Owner setup</h1>
        <p className="mt-4 text-sm opacity-65">
          One time only. Enter your private setup token and choose the owner email and password.
        </p>
        <span className="rule-line mt-6" />
        <form onSubmit={submit} className="mt-10 space-y-6">
          <label className="block">
            <span className="caps opacity-55">Setup token</span>
            <input
              required
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
            />
          </label>
          <label className="block">
            <span className="caps opacity-55">Owner email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
            />
          </label>
          <label className="block">
            <span className="caps opacity-55">Password (12+ characters)</span>
            <input
              required
              type="password"
              minLength={12}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
            />
          </label>
          {msg && <p className="text-sm opacity-75">{msg}</p>}
          <button
            type="submit"
            disabled={busy}
            className="caps border-b border-current pb-1 disabled:opacity-40"
          >
            {busy ? "Working…" : "Create owner account"}
          </button>
        </form>
      </section>
    </main>
  );
}
