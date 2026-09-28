export type WorkMode = "Remote" | "On-site" | "Hybrid";

export interface AuthUser {
  email: string;
}

export interface Internship {
  id: string;
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
  duration: string;
  apply_url: string;
  source: string;
  external_id: string | null;
  is_active: boolean;
  posted_at: string;
  created_at: string;
}
