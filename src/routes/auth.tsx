import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin, useSession } from "@/lib/auth";
import { SiteNav } from "@/components/SiteNav";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — ObjektHaus" },
      {
        name: "description",
        content:
          "Sign in to your ObjektHaus account to follow your orders, keep your cart and contribute design ideas.",
      },
      { property: "og:title", content: "Sign In — ObjektHaus" },
      { property: "og:description", content: "Your ObjektHaus account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

type Mode = "signin" | "signup" | "forgot";

function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { session } = useSession();
  const { data: isAdmin, isLoading: roleLoading } = useIsAdmin(session?.user.id);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session || roleLoading) return;
    if (isAdmin) void navigate({ to: "/admin", search: { status: "all" } });
    else void navigate({ to: "/account" });
  }, [session, isAdmin, roleLoading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);

    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setMsg(
        error ? error.message : "If that email has an account, a reset link is on its way to the inbox.",
      );
      setBusy(false);
      return;
    }

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
      setBusy(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/account`,
        data: { full_name: name },
      },
    });
    if (error) setMsg(error.message);
    else if (data.session) {
      await supabase.from("profiles").upsert({ id: data.session.user.id, full_name: name, email });
    } else {
      setMsg("Account created. Please confirm your email, then sign in.");
    }
    setBusy(false);
  };

  return (
    <main data-tone="dark" className="min-h-screen bg-sand text-sand-foreground">
      <SiteNav />
      <section className="mx-auto max-w-md px-7 pt-32 pb-20 sm:px-10 lg:pt-40">
        <p className="caps opacity-55">Account</p>
        <h1 className="mt-4 font-display text-5xl font-light">
          {mode === "signup" ? "Create account" : mode === "forgot" ? "Reset password" : "Sign in"}
        </h1>
        <span className="rule-line mt-6" />

        <form onSubmit={submit} className="mt-10 space-y-6">
          {mode === "signup" && (
            <label className="block">
              <span className="caps opacity-55">Full name</span>
              <input
                required
                value={name}
                maxLength={100}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
          )}
          <label className="block">
            <span className="caps opacity-55">Email</span>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
            />
          </label>
          {mode !== "forgot" && (
            <label className="block">
              <span className="caps opacity-55">Password</span>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full border-b border-current/30 bg-transparent py-2 outline-none focus:border-current"
              />
            </label>
          )}
          {msg && <p className="text-sm opacity-80">{msg}</p>}
          <button type="submit" disabled={busy} className="link-underline caps disabled:opacity-40">
            {busy
              ? "One moment…"
              : mode === "signin"
                ? "Sign in"
                : mode === "signup"
                  ? "Create account"
                  : "Send reset link"}
          </button>
        </form>

        <div className="mt-10 flex flex-col gap-4">
          {mode !== "signin" && (
            <button type="button" onClick={() => setMode("signin")} className="caps self-start opacity-55 hover:opacity-90">
              I already have an account
            </button>
          )}
          {mode !== "signup" && (
            <button type="button" onClick={() => setMode("signup")} className="caps self-start opacity-55 hover:opacity-90">
              Create an account
            </button>
          )}
          {mode !== "forgot" && (
            <button type="button" onClick={() => setMode("forgot")} className="caps self-start opacity-55 hover:opacity-90">
              Forgot password
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
