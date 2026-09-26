"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark } from "lucide-react";
import { addFavorite, removeFavorite } from "@/lib/favoriteActions";

interface FavoriteButtonProps {
  internshipId: string;
  initialFavorited: boolean;
  isLoggedIn: boolean;
  className?: string;
}

export default function FavoriteButton({
  internshipId,
  initialFavorited,
  isLoggedIn,
  className,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function handleClick(event: React.MouseEvent) {
    // Cards this button sits on also have their own onClick (select/open) -
    // stop it from firing when someone just meant to bookmark the card.
    event.stopPropagation();

    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    const nextFavorited = !isFavorited;
    setIsFavorited(nextFavorited);
    setIsPending(true);

    const result = nextFavorited
      ? await addFavorite(internshipId)
      : await removeFavorite(internshipId);

    setIsPending(false);
    if (result.error) {
      setIsFavorited(!nextFavorited);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
      aria-pressed={isFavorited}
      className={className ?? "text-gray-400 hover:text-blue-600 disabled:opacity-60"}
    >
      <Bookmark className="h-5 w-5" fill={isFavorited ? "currentColor" : "none"} />
    </button>
  );
}
