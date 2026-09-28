import { runImport } from "@/lib/import/runImport";
import { createSupabaseAdmin } from "@/lib/import/supabaseAdmin";

export const runtime = "nodejs";
export const maxDuration = 60;

// Vercel sends `Authorization: Bearer <CRON_SECRET>` on every request it
// makes to trigger this route (its own documented mechanism for securing
// cron routes, not a custom scheme here). Anyone else hitting this URL has
// no way to produce that header, so they get a 401 before any import work
// happens.
export async function GET(request: Request) {
  const auth = request.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createSupabaseAdmin();
  const summaries = await runImport(supabase);

  return Response.json({ summaries });
}
