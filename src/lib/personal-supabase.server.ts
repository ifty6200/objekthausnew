// Server-only Supabase client for the user's personal Supabase project.
// Uses the service-role key (RLS bypassed) — all access is gated by server
// functions that authorize via the managed backend (has_role / auth.uid()).
// Do not import at module scope from client-reachable files; load inside handlers.
import { createClient } from "@supabase/supabase-js";

function createSupabaseFetch(key: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) new Headers(init.headers).forEach((v, k) => headers.set(k, v));
    // New opaque sb_ keys are not JWTs — drop the Bearer header, keep apikey.
    if (key.startsWith("sb_") && headers.get("Authorization") === `Bearer ${key}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", key);
    return fetch(input, { ...init, headers });
  };
}

let _client: ReturnType<typeof createClient> | undefined;

export function getPersonalAdmin() {
  if (_client) return _client;
  const url = process.env["PERSONAL_SUPABASE_URL"];
  const key = process.env["PERSONAL_SUPABASE_SERVICE_ROLE_KEY"];
  if (!url || !key) {
    throw new Error(
      "Missing PERSONAL_SUPABASE_URL / PERSONAL_SUPABASE_SERVICE_ROLE_KEY. Add them in Project Settings → Secrets.",
    );
  }
  _client = createClient(url, key, {
    global: { fetch: createSupabaseFetch(key) },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
