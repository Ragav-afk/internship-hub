"use client";

import { useRouter } from "next/navigation";
import { Internship } from "@/lib/types";
import InternshipCard from "@/components/InternshipCard";

interface FavoritesGridProps {
  internships: Internship[];
}

export default function FavoritesGrid({ internships }: FavoritesGridProps) {
  const router = useRouter();

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {internships.map((internship) => (
        <InternshipCard
          key={internship.id}
          internship={internship}
          isSelected={false}
          isFavorited
          isLoggedIn
          onClick={() => router.push(`/internships/${internship.id}`)}
        />
      ))}
    </div>
  );
}
