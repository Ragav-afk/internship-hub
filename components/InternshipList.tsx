import { Internship } from "@/lib/types";
import InternshipCard from "@/components/InternshipCard";

interface InternshipListProps {
  internships: Internship[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function InternshipList({ internships, selectedId, onSelect }: InternshipListProps) {
  return (
    <div className="h-full flex-1 min-w-0 overflow-y-auto bg-gray-50 p-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-3">
        <p className="text-sm text-gray-500">
          {internships.length} internship{internships.length === 1 ? "" : "s"}
        </p>

        {internships.length === 0 ? (
          <p className="text-sm text-gray-500">
            No internships match your filters. Try adjusting your search or filters.
          </p>
        ) : (
          internships.map((internship) => (
            <InternshipCard
              key={internship.id}
              internship={internship}
              isSelected={internship.id === selectedId}
              onClick={() => onSelect(internship.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
