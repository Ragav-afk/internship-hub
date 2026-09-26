"use server";

import { createClient } from "@/lib/supabase/server";

export interface FavoriteActionResult {
  error?: string;
}

export async function addFavorite(internshipId: string): Promise<FavoriteActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("favorites").insert({ internship_id: internshipId });

  if (error) {
    // 23505 = unique_violation - it's already favorited, which is fine.
    if (error.code === "23505") return {};
    console.error("Failed to add favorite:", error.message);
    return { error: "Couldn't save this internship. Please try again." };
  }

  return {};
}

export async function removeFavorite(internshipId: string): Promise<FavoriteActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("internship_id", internshipId);

  if (error) {
    console.error("Failed to remove favorite:", error.message);
    return { error: "Couldn't remove this internship. Please try again." };
  }

  return {};
}
