import { runImport } from "@/lib/import/runImport";
import { createSupabaseAdmin } from "@/lib/import/supabaseAdmin";

async function main() {
  const supabase = createSupabaseAdmin();
  const summaries = await runImport(supabase);

  console.log("\nImport summary:");
  for (const { source, inserted, updated, deactivated } of summaries) {
    console.log(`  ${source}: +${inserted} new, ${updated} updated, ${deactivated} deactivated`);
  }
}

main().catch((err) => {
  console.error("[import] Failed:", err);
  process.exit(1);
});
