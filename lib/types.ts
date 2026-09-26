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
  work_mode: WorkMode;
  stipend_min: number | null;
  stipend_max: number | null;
  stipend_note: string | null;
  duration: string;
  apply_url: string;
  source: string;
  posted_at: string;
  created_at: string;
}
