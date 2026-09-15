import { createFileRoute } from "@tanstack/react-router";
import { bootstrapSuperAdmin } from "@/lib/staff.functions";

export const Route = createFileRoute("/api/public/bootstrap-owner")({
  server: {
    handlers: {
      POST: async () => {
        const result = await bootstrapSuperAdmin();
        return new Response(JSON.stringify(result), {
          headers: { "content-type": "application/json" },
        });
      },
    },
  },
});
