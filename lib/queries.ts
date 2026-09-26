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
    return [];
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
    return null;
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
