import { createClient } from "@/lib/supabase/server";
import { Internship } from "@/lib/types";

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
