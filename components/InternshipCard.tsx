import { Briefcase, Clock, MapPin } from "lucide-react";
import { Internship } from "@/lib/types";
import { formatLocation, formatPostedAt, formatStipend } from "@/lib/format";
import FavoriteButton from "@/components/FavoriteButton";

interface InternshipCardProps {
  internship: Internship;
  isSelected: boolean;
  isFavorited: boolean;
  isLoggedIn: boolean;
  onToggleFavorite: (id: string, next: boolean) => void;
  onClick: () => void;
}

export default function InternshipCard({
  internship,
  isSelected,
  isFavorited,
  isLoggedIn,
  onToggleFavorite,
  onClick,
}: InternshipCardProps) {
  return (
    <article
      onClick={onClick}
      onKeyDown={(event) => {
        // Ignore keydowns that bubbled up from a focused child (e.g. the
        // bookmark button) - only handle Enter/Space when the card itself is
        // focused, so activating the bookmark doesn't also select the card.
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-current={isSelected ? "true" : undefined}
      className={`cursor-pointer rounded-lg border p-4 transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isSelected
          ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
          : "border-gray-200 bg-white hover:border-blue-400"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{internship.title}</h3>
          <p className="text-sm text-gray-600">{internship.company}</p>
        </div>
        <FavoriteButton
          internshipId={internship.id}
          isFavorited={isFavorited}
          isLoggedIn={isLoggedIn}
          onToggle={onToggleFavorite}
        />
      </div>

      <div className="mt-3 flex flex-col gap-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span>{formatLocation(internship)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-gray-400" />
          <span>{formatStipend(internship)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>
            {internship.duration} · {formatPostedAt(internship.posted_at)}
          </span>
        </div>
      </div>
    </article>
  );
}
