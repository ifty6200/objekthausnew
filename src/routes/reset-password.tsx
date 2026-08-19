import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Choose a New Password — ObjektHaus" },
      { name: "description", content: "Set a new password for your ObjektHaus account." },
      { property: "og:title", content: "Choose a New Password — ObjektHaus" },
      { property: "og:description", content: "Set a new password for your account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPassword,
});

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setMsg(error.message);
      return;
    }
    setMsg("Password updated.");
    void navigate({ to: "/account" });
  };

  return (
    <main data-tone="dark" className="min-h-screen bg-sand text-sand-foreground">
      <SiteNav />
      <section className="mx-auto max-w-md px-7 pt-32 pb-20 sm:px-10 lg:pt-40">
        <p className="caps opacity-55">Account</p>
        <h1 className="mt-4 font-display text-5xl font-light">New password</h1>
        <span className="rule-line mt-6" />
        <p className="mt-6 text-sm opacity-70">
          Open this page from the reset link in your inbox, then choose a new password.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-6">
          <label className="block">
            <span className="caps opacity-55">New password</span>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
            />
          </label>
          {msg && <p className="text-sm opacity-80">{msg}</p>}
          <button type="submit" disabled={busy} className="link-underline caps disabled:opacity-40">
            {busy ? "Saving…" : "Save password"}
          </button>
        </form>
      </section>
    </main>
  );
}
