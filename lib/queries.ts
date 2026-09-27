import { createClient } from "@/lib/supabase/server";
import { AuthUser, Internship } from "@/lib/types";

export async function getInternships(): Promise<Internship[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("internships")
    .select("*")
    .order("posted_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch internships:", error.message);
    throw new Error("Couldn't load internships. Please try again in a moment.");
  }

  return data ?? [];
}

export async function getInternshipById(id: string): Promise<Internship | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("internships")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch internship:", error.message);
    throw new Error("Couldn't load this internship. Please try again in a moment.");
  }

  return data ?? null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const supabase = await createClient();

  // getUser() returns an error whenever there's no logged-in session, which
  // is the normal state for a visitor who hasn't signed in - not worth
  // logging as a failure.
  const { data } = await supabase.auth.getUser();

  return data.user ? { email: data.user.email ?? "" } : null;
}

// No explicit user filter needed on either of these - row-level security
// already scopes "favorites" to the current user's own rows, so a
// logged-out visitor (or anyone else's rows) just comes back empty.

export async function getFavoriteInternshipIds(): Promise<Set<string>> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("favorites").select("internship_id");

  if (error) {
    console.error("Failed to fetch favorites:", error.message);
    return new Set();
  }

  return new Set((data ?? []).map((row) => row.internship_id));
}

export async function getFavoriteInternships(): Promise<Internship[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("favorites")
    .select("internships(*)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch favorite internships:", error.message);
    return [];
  }

  // Supabase's type inference assumes an embedded relation could be
  // one-to-many (an array) since it has no generated schema to check - but
  // internship_id is a plain foreign key, so each row really has exactly one
  // internship (or none, if it was since deleted).
  const rows = (data ?? []) as unknown as { internships: Internship | null }[];

  return rows
    .map((row) => row.internships)
    .filter((internship): internship is Internship => internship !== null);
}
