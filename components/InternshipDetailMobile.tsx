"use client";

import { useState } from "react";
import { Internship } from "@/lib/types";
import InternshipDetails from "@/components/InternshipDetails";

interface InternshipDetailMobileProps {
  internship: Internship;
  initialFavorited: boolean;
  isLoggedIn: boolean;
}

// InternshipDetails is a controlled component (no state of its own), which
// keeps the desktop detail panel in sync with the list. This page is a
// Server Component and can't hold that state itself, so this small client
// wrapper owns it instead - safe here since this route only ever shows one
// favorite button at a time, so there's nothing for it to get out of sync
// with.
export default function InternshipDetailMobile({
  internship,
  initialFavorited,
  isLoggedIn,
}: InternshipDetailMobileProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);

  return (
    <InternshipDetails
      internship={internship}
      isFavorited={isFavorited}
      isLoggedIn={isLoggedIn}
      onToggleFavorite={(_id, next) => setIsFavorited(next)}
    />
  );
}
