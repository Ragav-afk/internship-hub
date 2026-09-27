"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Internship } from "@/lib/types";
import InternshipCard from "@/components/InternshipCard";

interface FavoritesGridProps {
  internships: Internship[];
}

export default function FavoritesGrid({ internships }: FavoritesGridProps) {
  const router = useRouter();
  // Every internship on this page starts out favorited (that's why it's
  // here) - this local state just tracks unfavoriting within the current
  // visit, same as elsewhere in the app.
  const [favoriteIds, setFavoriteIds] = useState(
    () => new Set(internships.map((internship) => internship.id))
  );

  function handleToggleFavorite(id: string, next: boolean) {
    setFavoriteIds((prev) => {
      const updated = new Set(prev);
      if (next) {
        updated.add(id);
      } else {
        updated.delete(id);
      }
      return updated;
    });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {internships.map((internship) => (
        <InternshipCard
          key={internship.id}
          internship={internship}
          isSelected={false}
          isFavorited={favoriteIds.has(internship.id)}
          isLoggedIn
          onToggleFavorite={handleToggleFavorite}
          onClick={() => router.push(`/internships/${internship.id}`)}
        />
      ))}
    </div>
  );
}
