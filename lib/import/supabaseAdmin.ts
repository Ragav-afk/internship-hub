import { createClient } from "@supabase/supabase-js";

// Deliberately separate from lib/supabase/server.ts, which is wired for
// cookie-based user sessions in the Next.js app. This client uses the
// service role key, which bypasses row-level security entirely - it has
// exactly two legitimate callers (scripts/import/run.ts and
// app/api/cron/import/route.ts), both server-only. Never import this from a
// Client Component or anything under components/.
export function createSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add SUPABASE_SERVICE_ROLE_KEY " +
        "to .env.local (from Supabase dashboard -> Project Settings -> API -> service_role key).",
    );
  }

  return createClient(url, serviceRoleKey);
}
