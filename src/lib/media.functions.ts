// Studio media uploads. The browser cannot write to the media store directly
// (studio staff are not signed in to the storage backend), so the file is sent
// through a staff-guarded server function that uploads with elevated rights and
// returns a long-lived link.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;
const MAX_BYTES = 45 * 1024 * 1024;

const payload = z.object({
  name: z.string().min(1).max(200),
  contentType: z.string().min(3).max(120),
  data: z.string().min(16), // base64, no data: prefix
});

export const uploadMedia = createServerFn({ method: "POST" })
  .inputValidator((d) => payload.parse(d))
  .handler(async ({ data }) => {
    const { requireStaff } = await import("./staff-auth.server");
    await requireStaff();

    const bytes = Uint8Array.from(atob(data.data), (c) => c.charCodeAt(0));
    if (bytes.byteLength > MAX_BYTES) {
      throw new Error("That file is larger than 45 MB — please use a smaller one.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const path = `${Date.now()}-${data.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const { error } = await supabaseAdmin.storage.from("media").upload(path, bytes, {
      contentType: data.contentType || "application/octet-stream",
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw new Error(error.message);

    const signed = await supabaseAdmin.storage.from("media").createSignedUrl(path, TEN_YEARS);
    if (signed.error || !signed.data) {
      throw new Error(signed.error?.message ?? "Could not create a link for that file.");
    }
    return { url: signed.data.signedUrl };
  });
