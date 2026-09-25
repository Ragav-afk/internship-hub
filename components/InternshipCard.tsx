import { Bookmark, Briefcase, Clock, MapPin } from "lucide-react";
import { Internship } from "@/lib/types";
import { formatLocation, formatPostedAt, formatStipend } from "@/lib/format";

interface InternshipCardProps {
  internship: Internship;
  isSelected: boolean;
  onClick: () => void;
}

export default function InternshipCard({ internship, isSelected, onClick }: InternshipCardProps) {
  return (
    <article
      onClick={onClick}
      className={`cursor-pointer rounded-lg border p-4 transition hover:shadow-md ${
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
        <Bookmark className="h-5 w-5 text-gray-400" />
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
