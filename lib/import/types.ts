import { WorkMode } from "@/lib/types";

export type ImportSource = "Greenhouse" | "Lever" | "Ashby";

export interface CompanyConfig {
  slug: string;
  source: ImportSource;
  displayName: string;
  // Used only when the source doesn't give us a structured compensation
  // field to read a currency off of (see resolveCompensation in mapping.ts).
  // Per-company rather than a single per-source default, since the company
  // list mixes US and Indian companies - defaulting every Greenhouse/Lever/
  // Ashby row to USD was fine when the list was all-American, but wrong for
  // e.g. Groww.
  defaultCurrency: string;
}

// One row ready to upsert into `internships` - everything except id/created_at,
// which the database fills in.
export interface ImportRow {
  title: string;
  company: string;
  description: string;
  field: string;
  city: string;
  country: string | null;
  work_mode: WorkMode;
  stipend_min: number | null;
  stipend_max: number | null;
  stipend_note: string | null;
  currency: string;
  duration: string | null;
  apply_url: string;
  source: ImportSource;
  external_id: string;
  posted_at: string;
}
