import { SupabaseClient } from "@supabase/supabase-js";
import { COMPANIES } from "./companies";
import { fetchAshbyInternships } from "./sources/ashby";
import { fetchGreenhouseInternships } from "./sources/greenhouse";
import { fetchLeverInternships } from "./sources/lever";
import { CompanyConfig, ImportRow, ImportSource } from "./types";

const FETCHERS: Record<ImportSource, (company: CompanyConfig) => Promise<ImportRow[]>> = {
  Greenhouse: fetchGreenhouseInternships,
  Lever: fetchLeverInternships,
  Ashby: fetchAshbyInternships,
};

export interface ImportSummary {
  source: ImportSource;
  inserted: number;
  updated: number;
  deactivated: number;
}

function groupBySource(companies: CompanyConfig[]): Map<ImportSource, CompanyConfig[]> {
  const grouped = new Map<ImportSource, CompanyConfig[]>();
  for (const company of companies) {
    grouped.set(company.source, [...(grouped.get(company.source) ?? []), company]);
  }
  return grouped;
}

// Shared by the manual script (scripts/import/run.ts) and the future cron
// route - both just need to build a service-role Supabase client and call
// this. `supabase` must be a service-role client: internships has no
// insert/update policy for anon/authenticated, so those roles can't write.
export async function runImport(supabase: SupabaseClient): Promise<ImportSummary[]> {
  const runStartedAt = new Date().toISOString();
  const summaries: ImportSummary[] = [];

  for (const [source, companies] of groupBySource(COMPANIES)) {
    const rows: ImportRow[] = [];

    for (const company of companies) {
      try {
        rows.push(...(await FETCHERS[source](company)));
      } catch (err) {
        console.warn(`[import] ${source} fetch threw for "${company.slug}":`, err);
      }
    }

    // Compare against what's already stored so the summary can report real
    // insert/update counts instead of just "upserted N rows".
    const { data: existing, error: existingError } = await supabase
      .from("internships")
      .select("external_id")
      .eq("source", source);

    if (existingError) {
      console.error(`[import] Couldn't read existing ${source} rows:`, existingError.message);
      continue;
    }

    const existingIds = new Set((existing ?? []).map((row) => row.external_id));

    if (rows.length > 0) {
      const { error: upsertError } = await supabase
        .from("internships")
        .upsert(
          rows.map((row) => ({ ...row, last_seen_at: runStartedAt })),
          { onConflict: "source,external_id" },
        );

      if (upsertError) {
        console.error(`[import] Couldn't upsert ${source} rows:`, upsertError.message);
        continue;
      }
    }

    // Anything for this source we didn't just touch has fallen out of the
    // feed (job filled/removed) - soft-delete it instead of deleting the row,
    // so an existing favorite pointing at it doesn't break.
    const { data: deactivated, error: deactivateError } = await supabase
      .from("internships")
      .update({ is_active: false })
      .eq("source", source)
      .eq("is_active", true)
      .lt("last_seen_at", runStartedAt)
      .select("id");

    if (deactivateError) {
      console.error(`[import] Couldn't deactivate stale ${source} rows:`, deactivateError.message);
    }

    summaries.push({
      source,
      inserted: rows.filter((row) => !existingIds.has(row.external_id)).length,
      updated: rows.filter((row) => existingIds.has(row.external_id)).length,
      deactivated: deactivated?.length ?? 0,
    });
  }

  return summaries;
}
