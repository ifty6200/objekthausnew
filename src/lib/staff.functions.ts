import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const SUPER_EMAIL = "shahidbinrahat@admin.com";
const SUPER_PASSWORD = "#Shahid@9198";

async function assertSuperAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "super_admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Only the super admin can manage studio access.");
}

export const listStaff = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error } = await supabaseAdmin.from("user_roles").select("user_id, role");
    if (error) throw new Error(error.message);
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const emails = new Map((users?.users ?? []).map((u) => [u.id, u.email ?? ""]));
    return (roles ?? []).map((r) => ({
      userId: r.user_id as string,
      role: r.role as string,
      email: emails.get(r.user_id as string) ?? "",
    }));
  });

export const createAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ email: z.string().email(), password: z.string().min(6) }).parse(d),
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();
    let userId: string | undefined;
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: data.password,
      email_confirm: true,
    });
    if (createErr) {
      const { data: existing } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
      const found = (existing?.users ?? []).find((u) => (u.email ?? "").toLowerCase() === email);
      if (!found) throw new Error(createErr.message);
      userId = found.id;
      await supabaseAdmin.auth.admin.updateUserById(found.id, { password: data.password });
    } else {
      userId = created.user?.id;
    }
    if (!userId) throw new Error("Could not create that account.");
    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    if (roleErr) throw new Error(roleErr.message);
    return { ok: true, email };
  });

export const removeAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ userId: z.string().uuid() }).parse(d))
  .middleware([requireSupabaseAuth])
  .handler(async ({ context, data }) => {
    await assertSuperAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * One-time owner setup. Requires the server-side OWNER_BOOTSTRAP_TOKEN secret and
 * refuses to run once a super admin already exists. Credentials are supplied by the
 * caller, never stored in source.
 */
export const bootstrapSuperAdmin = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        token: z.string().min(16).max(512),
        email: z.string().email().max(200),
        password: z.string().min(12).max(200),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const expected = process.env["OWNER_BOOTSTRAP_TOKEN"];
    if (!expected || data.token !== expected) {
      throw new Error("Owner setup is not available.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: existingRole } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "super_admin")
      .limit(1);
    if (existingRole && existingRole.length > 0) {
      throw new Error("Owner setup has already been completed.");
    }

    const email = data.email.trim().toLowerCase();
    const { data: users } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    let userId = (users?.users ?? []).find((u) => (u.email ?? "").toLowerCase() === email)?.id;
    if (userId) {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        password: data.password,
        email_confirm: true,
      });
    } else {
      const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: data.password,
        email_confirm: true,
      });
      if (error) throw new Error(error.message);
      userId = created.user?.id;
    }
    if (!userId) throw new Error("Could not create the owner account.");
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "super_admin" }, { onConflict: "user_id,role" });
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
    return { ok: true, created: true };
  });
